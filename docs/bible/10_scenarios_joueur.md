# FUSIBLE — Bible scénaristique · 10 · Les scénarios du joueur (amateur et pro)

> Ce chapitre écrit tout ce que vit un joueur dans FUSIBLE : le tutoriel de Trébignac, les postulats amateur (`village_endette`, `lache_academie`) et pro (`pepite`, `fin_de_contrat`, puis `retour_croises`, `binational`, `banc_dore`, `capitaine_dechu`), le réservoir d'intrigues des deux rôles, les réactions, les manchettes, les temps forts de Grand Match, les transitions vers le banc, le bureau et le village, et les fins propres au rôle. Il prolonge la spec `docs/spec_variete_narrative.md` § 4.3-4.4 sans la contredire : les ids d'intrigue de la spec sont gardés, les cartes existantes de `content/cards/joueur/` sont citées par id et absorbées, jamais réécrites. Il suit la charte `00_charte.md` à la lettre : gabarits § 4, ids § 4.10, notation § 4.11, interdits § 6.

## 0. Comment lire ce chapitre

### 0.1 Ce qu'un joueur a que les autres n'ont pas

Le joueur est le seul rôle qui a un corps. Les autres ont un bureau, un banc, un fauteuil ; lui a un genou, et le genou a un avis. C'est la colonne vertébrale de tout ce chapitre : chaque postulat pro a une horloge biologique (l'âge, le genou, la valeur marchande) et une horloge sociale (la tribune, qui adore le lundi et siffle le samedi). Le joueur ne décide presque rien seul : Fardelli décide pour lui, Aulard décide de lui, Camille décide sans lui. Ce qu'il peut faire, c'est jouer, ou ne pas jouer. Tous les dilemmes tiennent là-dedans.

Le joueur amateur, lui, a un boulot, des copains et un village. Il a vingt ans, ou dix-neuf, et un compte à rebours de six saisons avant que le paquet « recruteur » ne se vide. On l'écrit tendre, drôle, jamais méprisant : le foot du dimanche est le foot où l'on pleure vraiment.

### 0.2 Le cast du rôle (rappel de la charte § 2.4)

| Fonction | Joueur amateur (`joueur_amateur`, préfixe `am.`) | Joueur pro (`joueur`, préfixe `jp.`) |
|---|---|---|
| Patron (DIRECTION) | Dédé (le coach bénévole), Pichon (le président-boulanger) | Fardelli (l'agent, `president: fardelli`), Aulard (le prix), Vukić (l'adjoint puis le coach) |
| Chœur | Josiane, Gérard | Josiane, Rouvier |
| Cœur | Vecchio (à 50 ans, Trébignac), Dupuis, Paulette | Bréhaut, Dembo, Vecchio, Mbako |
| Créancier, tentateur | Barbier (la doudoune), « Montbéliac » (une voix) | Nassir, Solvang, « ton cousin », « Tony » |
| Chroniqueur | Léa (L'Écho) | Léa, Vence, Ménèche |
| Horloge | l'âge : 25 ans | Sabatier (le genou) |
| La maison | Camille (la belle-mère, le samedi) | Camille, Sacha (dès six ans) |

Voix sans portrait autorisées (deux cartes chacune au plus par postulat) : « ton cousin des îles », « Tony, ton pote d'enfance », « Maître Vidal, ton avocat », « ton patron » (le garage, la scierie, la plomberie : tiré par le postulat), « ta mère, au téléphone du pays », « ton frère », « le stagiaire de l'Écho », « le préparateur suisse » (existant), « un émissaire d'Al-Dorado », « le kiné du club acheteur ».

### 0.3 Ce que le chapitre pose et ce qu'il lit (résumé ; la matrice complète est en § 12)

**Pose** (charte § 5.2 et traces nouvelles) : `genou_opere`, `genou_grave`, `capitaine`, `international`, `binational_choisi` (valeur `cobalts` | `kambara`), `selection_refusee`, `offshore`, `mouton_noir`, `groupe_accepte`, `special`, `enfant_du_pays`, `honnete_tribune`, `essai_pro`, `patron_furieux`, `flacon_b`, `pharmacie_propre`, `derby_gagne`, `derby_perdu`, `camille_ici`, `sacha_nee` (via `jp.famille.naissance`, remarque du chapitre 01), `ami_ultras`, `diplome`, `agent_fardelli`, `sans_agent`, `vendu_d1`, `fidele`, `exil_dore`, `prolonge`, `sans_club`, `maison_pays`, `jubile_fait`, `memoires_verite`, `consultant`, `pari`, `pari_refuse`, `banc_bosse`, `banc_boude`, `mentor_mbako`, `rival_mbako`, `petition_portee`, `adieu_cobalt`, `brassard_refuse`, `copains_gardes`, `village_fusionne`, `dede_sifflet`, `montbeliac_cash`, `croises_rejoues`, `banc_dore_retour`, `geant_remonte`.

**Lit** (venues d'ailleurs) : `mbako_vendu` (il joue contre toi), `mbako_lance`, `mbako_decide`, `selection_refusee`, `pacte_gege` (« ton nom sur la bâche »), `vukic_dauphin` (Vukić devenu coach ailleurs), `clow_ingrat` et `clow_stage` (le stage du diplôme), `naming_signe` (« le stade s'appelle comme une boisson »), `salaires_retard` (le distributeur), `sabatier_confie` (« tu m'avais dit mars »), `brehaut_frere`, `page_trois_solvang`, `une_lea`, `rapport_trop_lent`, `pichon_reprend`, `dupuis_chez_montbeliac`, `gants_pretes`, `monde_bosquet`, `monde_flux`, `monde_1998`, `divorce`, `gigi_staff`, `derby_tete_haute`.

### 0.4 Conventions propres au chapitre

- Le club de départ est tiré par le moteur ; on écrit `{club}`, `{ville}`, `{rival}`. « L'usine » désigne le club de la pépite quel que soit son nom tiré (le pitch dit Étoile Bretagne ; le texte dit « l'usine »). Le village du joueur amateur est « le village » ; Boisnoir et Trébignac ne sont nommés que dans les scènes qui s'y passent par construction (le tutoriel, la Coupe).
- `{numero}` est le dossard du joueur (adresse noire de Gégé et de Bréhaut : « le {numero} »).
- `{monnaie}` rend francs avant 2002 et écus ensuite ; les chiffres de valeur (`{prix}`) sont posés par le script dans `vars.prix` et ne dépassent jamais les ordres de grandeur de la charte § 1.2.
- Les scènes qui absorbent une carte existante la citent par id ; la carte existante garde son texte, elle reçoit un `arc`, un `step` et, si besoin, un `when` (chantier données, spec § 4.6).
- Une intrigue rejouable porte ses variantes « encore » sur `plays()` ; aucune de ses cartes n'est `once`.
- Le drame (une intrigue sur dix) est marqué **[drame]** dans la fiche ; jamais en S0, jamais deux d'affilée dans un réservoir (les pools sont ordonnés pour ça).

---

## 1. Le tutoriel de Trébignac (douze cartes fixes)

**Rôle** : `joueur_amateur` · **Où** : le FC Trébignac, stade municipal Gérard-Blanchet, Régional 2, août 1990 (le tutoriel ignore l'année du postulat : c'est la première carrière du profil, et seulement elle). **Qui** : Madame Josiane (elle tient le secrétariat du club de Trébignac « le mardi soir, bénévolement, parce que Pichon a demandé »), Gigi Vecchio (il a quarante et un ans en 1990 et joue déjà à Trébignac « le dimanche, pour le plaisir », prêté par son club pro pour l'amical de rentrée : la charte ne le met à Trébignac qu'en 2000, à cinquante ans ; le tutoriel est un amical hors calendrier, une fois par profil, et la fiche 01 de Vecchio s'en accommode : « il est venu jouer l'amical de rentrée à Trébignac tous les ans depuis 1988 »). Les douze cartes sont servies avant le slot 1 du premier postulat, dans cet ordre, sans tirage ; elles n'ont pas de `when`, pas de trace, pas de réaction. Chacune enseigne une chose et une seule.

| # | id | Locuteur | Ce qu'elle apprend | Réplique | ← | → |
|---|---|---|---|---|---|---|
| 1 | `am.tuto.bienvenue` | Josiane | glisser | « Bienvenue à Trébignac, c'est ici qu'on signe la licence. J'en ai vu passer, vous savez : glissez le doigt à gauche, ou à droite, ça ne mord pas. » | **Je signe** — *La licence est tamponnée. Le tampon est de travers.* | **Je signe** — *idem* |
| 2 | `am.tuto.jauges` | Josiane | les quatre jauges | « Là-haut, quatre petites choses : les copains, le bistrot, le coach, le porte-monnaie. Quand l'une se vide ou déborde, on ferme le dossier. » | **Compris** — vestiaire + | **Je regarde encore** — vestiaire + |
| 3 | `am.tuto.vecchio` | Vecchio | la jauge pleine tue | « Gigi Vecchio, quarante et un ans, gardien. J'en ai vu d'autres, petit : ceux que tout le monde aimait trop finissent aussi mal que ceux que personne n'aimait. » | **Je t'écoute, Gigi** — tribunes + | **On verra sur le terrain** — vestiaire + |
| 4 | `am.tuto.copains` | Vecchio | VESTIAIRE | « Momo veut que tu portes les ballons, c'est la règle pour le nouveau. Tu portes, ou tu laisses le sac à ses pieds ? » | **Je porte les ballons** — vestiaire ++, tribunes − | **Chacun son sac** — vestiaire −−, tribunes + |
| 5 | `am.tuto.bistrot` | Josiane | TRIBUNES | « Le bistrot d'en face paie la tournée après chaque victoire, et il parle de toi entre deux tournées. Tu y passes ce soir, ou tu rentres ? » | **Je passe au bistrot** — tribunes ++, caisse − | **Je rentre** — tribunes −, caisse + |
| 6 | `am.tuto.coach` | Vecchio | DIRECTION | « Dédé veut te voir défendre, tu préfères attaquer. Tu le lui dis, ou tu défends dimanche en attendant ? » | **Je défends dimanche** — direction ++, vestiaire − | **Je lui dis** — direction −−, tribunes + |
| 7 | `am.tuto.porte_monnaie` | Josiane | CAISSE | « Le club rembourse l'essence à la fin du mois, en principe. Le principe, à Trébignac, c'est Gérard qui le tient : tu avances, ou tu prends le car ? » | **J'avance l'essence** — caisse −−, vestiaire + | **Je prends le car** — caisse +, tribunes − |
| 8 | `am.tuto.match` | Vecchio | la Carte Match (posture) | « Dimanche, amical contre Boisnoir, il pleuvra. Tu joues, ou tu bosses lundi et tu te ménages ? » | **Je joue** — *posture Je joue* | **Je bosse lundi** — *posture Je bosse lundi* |
| 9 | `am.tuto.temps_fort` | Vecchio | SÛR / ÉQUILIBRÉ / RISQUÉ | « Corner pour nous, je monte. J'en ai vu d'autres, mais le RISQUÉ, c'est moi qui le prends, toi tu restes derrière au SÛR. » | **Je reste derrière (SÛR)** — vestiaire + | **Je monte aussi (RISQUÉ)** — tribunes ++ ou vestiaire − (50/50) |
| 10 | `am.tuto.relation` | Josiane | le visage et la relation | « Regardez la tête de Gigi sur la vignette : quand il sourit, il vous aime ; quand il fait la tête, vous saurez pourquoi. On ne vous donnera jamais de chiffre, on n'est pas au loto. » | **J'ai vu** — *Elle range le classeur.* | **J'ai vu** — *idem* |
| 11 | `am.tuto.promesse` | Vecchio | la promesse et la Parole | « Tu as dit à Dédé « je reste jusqu'en juin ». Un ruban va s'accrocher là-haut ; si tu pars en janvier, tout le canton s'en souviendra. » | **Je promets** — promise, parole +1 | **Je n'ai rien promis** — direction − |
| 12 | `am.tuto.fin` | Josiane | le Bilan, la fin, la relance | « Voilà, en juin on fait les comptes, et si une jauge casse, on ferme le dossier et quelqu'un d'autre le rouvre. J'en ai vu passer, vous savez : ils reviennent tous, sous un autre nom. » | **Allons-y** — *Elle pousse la licence vers toi. Le vrai match commence.* | **Allons-y** — *idem* |

Notes d'intégration : les douze cartes ont `roles: [joueur_amateur]`, `kind: tuto`, pas de `when` ; les effets de jauge sont annulés à la fin du tutoriel (Passation du postulat) : ils ne servent qu'à faire bouger les aiguilles sous les yeux du joueur. La carte 9 est le seul tirage aléatoire du tutoriel ; elle est marquée `rand` comme les temps forts. Si le profil a déjà un Cimetière, le tutoriel n'est pas servi.

---

## 2. Le joueur amateur

### 2.1 Le rôle en trois lignes

Quatre jauges (charte § 3.1) : **Les copains** (VESTIAIRE — *Le toro* / *Le caïd*), **Le bistrot** (TRIBUNES — *Le comptoir* / *Le héros du canton*), **Le coach** (DIRECTION — *La touche* / *Le chouchou*), **Le porte-monnaie** (CAISSE — *Le patron a dit non* / *L'enveloppe*). Jauge fragile : TRIBUNES. Posture de match : *Je joue* / *Je bosse lundi*. Cinq Cartes Match par saison, montée à 70 points. Le rôle dure une à trois saisons ; il débouche (pro, entraîneur amateur, président amateur) ou il meurt ; à 25 ans, la carte Recruteur ne vient plus, sauf `essai_pro` déjà posé.

### 2.2 POSTULAT `village_endette` — Le club du village endetté

**Rôle** : `joueur_amateur` · **Année** : 1991 · **Club** : ES Boisnoir, District (le texte dit « le village », « le club ») · **Jauges** : vestiaire 55, tribunes 50, direction 50, caisse 70 (le porte-monnaie est haut : tu as un boulot ; c'est ce qu'on va t'enlever) · **Force** : 46 · **Objectif de saison** : le maintien en District (« ne pas finir dernier » : il n'y a rien en dessous, sauf la fusion) · **Drapeaux** : `[village, boulot]` · **Président** : `pichon` (dans ce postulat Pichon préside Boisnoir « en attendant », Trébignac ayant un accord de bon voisinage ; le chantier données peut lui préférer une voix « le président » sans portrait, la fiche 02 l'autorise : « ou quand personne ne veut »).
**Pitch** : Dix-neuf ans, un boulot, des copains, et un club qui fusionne l'an prochain.
**Question de saison** (fil rouge) : Qu'est-ce que tu ne veux pas perdre : le boulot, les copains, ou le village ? — `boulot` / `copains` / `village` (poids 1,0 chacun).
**Cast** : dede (patron 2,5), pichon (patron 1), josiane (chœur 1), gerard (chœur 1,5), barbier (créancier 1), aubert (l'horloge de la fusion 1), dupuis (cœur 1), vecchio (cœur 0,5), paulette (0,5), lea (chroniqueuse 1), camille (1), « ton patron » (voix 1), « Montbéliac » (voix 1).
**Objectifs cachés** : `village_detecte_avant` — *Détecté avant la fusion* (`flag('essai_pro') && !flag('village_fusionne')` ; indice : « La doudoune vient le samedi. La fusion, l'été. ») · `village_copains_gardes` — *Les copains d'abord* (`flag('copains_gardes') && stats.saisons >= 2` ; indice : « Il y a des gens qu'on ne vend pas. ») · `village_boulot_tenu` — *Lundi, huit heures* (`!flag('patron_furieux') && stats.saisons >= 2` ; indice : « Trois lundis d'arrêt, c'est la porte. Tu en es à zéro. »).
**alarm_override** : `tribunes.low` → `am.alarme.tribunes_bas_gerard` (Gérard : « Ici, on payait en bières. Toi, on ne te sert plus. ») quand `arc('am.troisieme_mitemps') != 'done'` ; sinon la carte standard `am.alarme.tribunes_bas_dupuis`.

#### Le script `am.village.club_endette`

Quatre ancres en S0 (slots 1, [10-11], 16, 17), trois en S1 ([1-2], [10-11], 17), deux rejouables en S2+ ([1-2], 17). Les ancres commentent les feuilletons du réservoir (§ 2.4) ; elles ne les racontent pas.

### SCÈNE am.village.v1_licence  —  La licence et le boulot
**Rôle** : joueur_amateur · **Intrigue** : am.village.club_endette · **Étape** : 1/9 · **Moment** : saison 0, slot 1 · **Lieu** : le vestiaire de Boisnoir, un banc, un néon qui clignote, Dédé assis dessus · **Conditions** : —
**DÉDÉ** *(coach bénévole — neutre — il te tend une licence et une feuille de paie pliée ensemble)*
« Bon, on va pas se mentir : le club a des dettes, la mairie veut nous marier avec Montbéliac, et toi tu commences lundi à la scierie. Tu signes quand même, petit ? »
← **Je signe, et je bosse lundi** — effets : direction +, caisse +, set: boulot_tenu — *Il tamponne. Le tampon dit « ES Boisnoir » ; l'encre est presque partie.*
→ **Je signe, le foot d'abord** — effets : direction +, vestiaire +, caisse −, set: foot_d_abord — *Il tamponne plus fort. « Le patron, tu lui dis toi-même », dit-il en rangeant l'encre.*
Variante `fil_rouge == 'village'` : « Bon, on va pas se mentir : si on fusionne, le maillot marron disparaît, et toi avec. Tu signes pour le village, ou pour toi ? » — mêmes sorties, la gauche pose `boulot_tenu`, la droite pose `foot_d_abord` ; la conséquence droite devient *« Pour le village », note-t-il sur la licence. Ce n'est pas une case prévue.*
Variante `fil_rouge == 'copains'` : « Bon, on va pas se mentir : Momo, Karim et les jumeaux ont signé ce matin, ils m'ont dit que tu suivrais. Tu suis ? » — gauche **Je suis les copains** — vestiaire ++, caisse −, set: foot_d_abord — *Les jumeaux tapent dans le mur pour fêter ça. Le mur tient.* ; droite **Je signe pour moi** — direction +, vestiaire −, set: boulot_tenu — *Il n'insiste pas. Momo, lui, insistera.*
**Traces** : boulot_tenu, foot_d_abord (sans Almanach ; drapeaux de script) · **Réactions déclenchées** : am.re.gerard_licence (§ 7) · **Lu plus tard par** : am.village.v2_scierie (variantes), am.patron.lundi (variante « tu as dit le foot d'abord »), am.village.v3_fusion

### SCÈNE am.village.v2_scierie  —  Le mercato de la scierie
**Rôle** : joueur_amateur · **Intrigue** : am.village.club_endette · **Étape** : 2/9 · **Moment** : saison 0, [10,11] · **Lieu** : le parking de la scierie, sciure sur les chaussures, ton patron devant la porte · **Conditions** : —
**TON PATRON** *(voix sans portrait — la porte de l'atelier à moitié fermée)*
« Le tournoi de janvier, c'est un samedi, et le samedi ici on livre. Tu livres, ou tu joues et tu cherches un autre lundi ? »
← **Je livre samedi** — effets : caisse ++, tribunes −, vestiaire −, set: samedi_livre — *Tu livres. Le village perd le tournoi. Momo dit que c'était perdu d'avance ; il ment bien.*
→ **Je joue samedi** — effets : tribunes ++, vestiaire +, caisse −−, set: patron_furieux — *Tu marques deux fois. Lundi, le patron ne te dit pas bonjour ; il te dit « la porte, au prochain ».*
Variante `flag('essai_pro')` (la doudoune est déjà passée, § 2.4 am.doudoune) : « Ton essai à Valdorne, c'est mardi et mercredi, et ici mardi on livre. Tu poses deux jours, ou tu poses ta démission ? » — gauche **Je pose deux jours** — caisse −, direction +, set: patron_furieux — *Il signe le congé sans te regarder. Il souligne « sans solde » deux fois.* ; droite **Je reste, tant pis pour l'essai** — caisse ++, tribunes −−, clear: essai_pro, set: essai_rate — *Barbier attend à Valdorne sous la pluie. Tu livres des palettes ; il pleut aussi.*
Variante `flag('foot_d_abord') && fil_rouge == 'boulot'` : le patron ajoute « tu avais dit le foot d'abord, moi j'ai entendu » ; mêmes sorties.
**Traces** : patron_furieux (« {annee} : le patron de {prenom} {nom} a compté les lundis. Il en manquait trois. »), samedi_livre, essai_rate · **Réactions déclenchées** : am.re.camille_sciure (§ 7) · **Lu plus tard par** : am.patron.licenciement (étape S+1, `requires: [patron_furieux]`), am.village.v3_fusion (variante « tu n'as plus de boulot »), fin am_patron (epitaph_plus), Carte Destin amateur → pro (ch. 30 : « tu as posé deux jours »)

### SCÈNE am.village.v3_fusion  —  La réunion de la fusion
**Rôle** : joueur_amateur · **Intrigue** : am.village.club_endette · **Étape** : 3/9 · **Moment** : saison 0, slot 16 (dernier match) · **Lieu** : la salle des fêtes, chaises en plastique, Madame Aubert debout, Dédé assis au fond avec sa casquette sur les genoux · **Conditions** : —
**AUBERT** *(maire — neutre — un plan de stade sur un chevalet, deux blasons collés côte à côte)*
« Le stade, c'est de l'argent public, et deux clubs pour un stade, c'est un club de trop. Boisnoir et Montbéliac fusionnent en juin ; les joueurs qui veulent rester signent ce soir. »
← **Je signe pour le club fusionné** — effets : direction ++, tribunes −−, vestiaire −, set: village_fusionne — *Tu signes en vert et marron. Dédé range sa casquette ; il ne signe rien, il n'a rien à signer.*
→ **Je ne signe pas, je reste Boisnoir** — effets : tribunes ++, vestiaire ++, direction −−, set: copains_gardes — *Momo signe derrière toi sur une serviette : « ES Boisnoir, on reste ». Le maire plie le chevalet.*
Variante `flag('patron_furieux')` : Aubert ajoute « et Montbéliac a un emploi à la mairie pour ceux qui n'en ont plus » ; la gauche donne caisse ++ en plus, la droite caisse −.
Variante `flag('essai_pro') && !flag('essai_rate')` : « On fusionne en juin, mais Valdorne m'a écrit pour votre indemnité de formation ; signez ici et le village touche quelque chose. » — gauche **Je signe, pour le village** — direction ++, caisse −, set: village_fusionne, set: indemnite_village — *Le village touche l'indemnité. Elle paie la buvette neuve. On ne mettra pas ton nom dessus.* ; droite **Je pars libre** — caisse ++, tribunes −−, set: copains_gardes — *Le village ne touche rien. Gérard fait le compte à voix haute, au bar.*
**Traces** : village_fusionne (« {annee} : Boisnoir et Montbéliac ont fusionné. {prenom} {nom} a signé en vert et marron. »), copains_gardes (« {annee} : {prenom} {nom} n'a pas signé la fusion. Momo non plus. Le maillot marron a duré un an de plus. »), indemnite_village · **Réactions déclenchées** : am.re.dede_casquette (§ 7) · **Lu plus tard par** : am.village.v4_bilan, am.village.s1_premier_jour, objectifs `village_detecte_avant` et `village_copains_gardes`, ch. 13 (`fusion_imposee` : « la fusion a déjà eu lieu une fois, en 1991, et la lignée s'en souvient »), ch. 20 (« BOISNOIR-MONTBÉLIAC, LE MARIAGE »), ch. 90 (mémoire des clubs : Loubières / Montbéliac)

### SCÈNE am.village.v4_bilan  —  Le dernier virage du village
**Rôle** : joueur_amateur · **Intrigue** : am.village.club_endette · **Étape** : 4/9 · **Moment** : saison 0, slot 17 (dernier virage) · **Lieu** : la buvette, Gérard qui compte, Dédé qui fait semblant de ne pas écouter · **Conditions** : —
**GÉRARD** *(bénévole, trésorier — neutre — la boîte en fer ouverte, des pièces en piles)*
« Ici, on payait en bières, et cette année on a payé l'arbitre en bières aussi. Dimanche, c'est le dernier match du maillot marron : tu joues pour la photo, ou tu joues pour gagner ? »
← **Pour gagner, on descend pas** — effets : vestiaire +, tribunes +, force +1 — *Tu gagnes. Le village met la photo au bar quand même, mais à côté de la caisse.*
→ **Pour la photo, avec tout le monde** — effets : tribunes ++, vestiaire +, force −2 — *Dédé fait jouer les jumeaux, Momo, et le fils de Dupuis. Vous perdez. La photo est très belle.*
Variante `flag('village_fusionne')` : « Ici, on payait en bières ; l'an prochain on paiera en écus de Montbéliac, enfin, en francs, ce que tu veux. Dimanche c'est le dernier match du maillot marron : pour la photo, ou pour la fierté ? » — mêmes sorties.
Variante `flag('copains_gardes')` : « Ici, on payait en bières, et l'an prochain on paiera encore en bières, puisque tu as refusé le maire. Dimanche, on joue pour le maillot : tu le sais, petit ? » — gauche **Je le sais** — tribunes ++, parole +1, promise (« rester au village ») — *Le ruban s'accroche. Gérard le note dans la boîte en fer.* ; droite **On verra en juin** — tribunes −, direction + — *Il referme la boîte. Sur le couvercle, une date au marqueur.*
**Traces** : — · **Réactions déclenchées** : co.re.vecchio_garde (∃, si `chars.vecchio.statut == 'club'`) · **Lu plus tard par** : set-piece `bilan_carrefour` amateur (ch. 30 : variantes « le maillot marron » / « le maillot vert et marron »)

### SCÈNE am.village.s1_premier_jour  —  Le premier jour du club d'après
**Rôle** : joueur_amateur · **Intrigue** : am.village.club_endette · **Étape** : 5/9 · **Moment** : saison 1, [1,2] · **Lieu** : selon la variante · **Conditions** : —
Variante `flag('village_fusionne')` (première vraie) — **DÉDÉ** *(coach bénévole, désormais adjoint du coach de Montbéliac — noir — il porte un survêtement vert qu'il n'a pas choisi)* : « Bon, on va pas se mentir : le coach c'est plus moi, c'est le neveu du président de Montbéliac. Tu joues où il te met, ou tu viens t'entraîner avec moi le mardi, à Boisnoir, dans le noir ? » — ← **Là où il me met** — direction ++, vestiaire −, relation.dede −1 — *Il hoche la tête. Il vient te regarder jouer le dimanche, depuis la butte, sans casquette.* · → **Le mardi, dans le noir** — vestiaire ++, direction −−, relation.dede +1, set: dede_sifflet — *Le mardi, il y a six joueurs et un projecteur. Il siffle la fin quand la lampe s'éteint.*
Variante `flag('copains_gardes')` — **PICHON** *(président par intérim — neutre — de la farine sur le classeur)* : « Le pain, c'est à cinq heures, et le club, c'est à personne depuis que le maire est parti fâché. Tu veux le brassard, ou tu veux que Momo le prenne et que je dorme ? » — ← **Je prends le brassard** — vestiaire +, direction +, set: capitaine — *Momo applaudit. Les jumeaux aussi, un peu moins fort.* · → **Momo le prend** — vestiaire ++, tribunes −, relation.pichon −1 — *Momo le prend. Il le porte à l'envers deux matchs de suite.*
Secours (sans condition) — **JOSIANE** : « Nouvelle saison, même classeur ; j'en ai vu passer, vous savez, mais rarement un dossier aussi mince que celui de ce club. Vous restez ? » — un bouton **Je reste** — direction + — *Elle range la licence sous la précédente.*
**Traces** : dede_sifflet (« {annee} : Dédé a entraîné six joueurs le mardi, dans le noir. {prenom} {nom} en était. »), capitaine (∃) · **Réactions déclenchées** : — · **Lu plus tard par** : Carte Destin amateur → entraîneur amateur (ch. 30 : Dédé donne son sifflet ; variante « tu l'as déjà, le mardi »), ch. 13 (`fusion_imposee` : Dédé « a déjà vécu ça »), fin am_touche (epitaph_plus)

### SCÈNE am.village.s1_twist  —  Le derby de la fusion
**Rôle** : joueur_amateur · **Intrigue** : am.village.club_endette · **Étape** : 6/9 · **Moment** : saison 1, [10,11] · **Lieu** : le terrain de Montbéliac, stade des Bruyères, une haie, des sangliers derrière la haie · **Conditions** : —
Variante `flag('copains_gardes')` — **UNE VOIX DE MONTBÉLIAC** *(sans portrait — le président des Sangliers, en bottes)* : « Vous êtes venus à onze et demi, je compte le fils Dupuis pour un demi. Trois cents francs par tête si vous levez le pied, et la buvette est pour vous après. » — ← **On lève rien du tout** — tribunes ++, vestiaire ++, caisse −, set: montbeliac_refuse — *Vous perdez quatre à un, debout. Le fils Dupuis marque le un.* · → **Trois cents, ça se discute** — caisse ++, tribunes −−, set: montbeliac_cash, react: am.re.lea_bruyeres — *Vous perdez quatre à zéro, assis. Le président des Sangliers paie en billets pliés en huit.*
Variante `flag('village_fusionne')` — **DUPUIS** *(boucher, sponsor — neutre — il porte le maillot vert et marron par-dessus son tablier)* : « Le meilleur du cochon, et je pèse mes mots : mon nom est dans le dos, et mon fils est sur le banc. Tu lui laisses ta place au derby, ou je change de dos ? » — ← **Il joue à ma place** — direction +, caisse +, tribunes −, relation.dupuis +1 — *Le fils Dupuis joue. Il ne touche pas un ballon. Dupuis dit qu'il a « pesé ».* · → **Je joue, il regarde** — tribunes +, vestiaire +, relation.dupuis −1, set: dupuis_vexe — *Tu joues. Dupuis regarde le dos des maillots pendant tout le match, l'air de compter.*
**Traces** : montbeliac_cash (« {annee} : Montbéliac a payé le village en billets pliés en huit. {prenom} {nom} a compté. »), montbeliac_refuse, dupuis_vexe · **Réactions déclenchées** : am.re.lea_bruyeres (§ 7) · **Lu plus tard par** : fin am_enveloppe (epitaph_plus « les billets pliés en huit »), am.montbeliac (variante « ils t'ont déjà payé »), ch. 13 (Dupuis : « le fils qui joue mal » ; `dupuis_chez_montbeliac`), ch. 20 (« TROIS CENTS FRANCS PAR TÊTE »), ch. 15 (Roux : le district « examine » Montbéliac)

### SCÈNE am.village.s1_veille  —  La veille, au bar
**Rôle** : joueur_amateur · **Intrigue** : am.village.club_endette · **Étape** : 7/9 · **Moment** : saison 1, slot 17 · **Lieu** : le bar-tabac, Paulette à la table du fond avec L'Écho · **Conditions** : —
**PAULETTE** *(abonnée depuis 1951 — neutre — elle lit l'Écho avec une loupe, elle ne lève pas les yeux)*
« J'étais là en cinquante et un, mon petit, et le club a déjà failli mourir trois fois. Demain tu joues le maintien : tu m'emmènes au stade, ou je prends le car de Gérard ? »
← **Je vous emmène** — effets : tribunes ++, vestiaire −, relation.paulette +1, set: paulette_emmenee — *Elle est prête à sept heures. Elle te dit où te placer sur les corners ; elle a raison.*
→ **Le car de Gérard** — effets : tribunes −, vestiaire +, relation.paulette −1 — *Elle prend le car. Elle arrive à la mi-temps ; Gérard s'est trompé de village.*
**Traces** : paulette_emmenee (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 13 (`coupe_du_village` : Paulette « tu m'as emmenée une fois »), ch. 31 (l'enterrement de Paulette, 2009 : « on ne l'a pas réveillée »), ch. 20 (Écho, brève)

### SCÈNE am.village.s2_rentree  —  Encore une saison (rejouable)
**Rôle** : joueur_amateur · **Intrigue** : am.village.club_endette · **Étape** : 8/9 · **Moment** : saison 2+, [1,2] · **Lieu** : le vestiaire, le même néon · **Conditions** : —
**DÉDÉ** *(coach bénévole — neutre ; sourire si relation ≥ 1 — il compte les licences sur ses doigts)*
« Bon, on va pas se mentir : tu as {age} ans, la doudoune ne vient plus après vingt-cinq, et moi j'ai un sifflet qui cherche un cou. Tu joues encore une, ou tu regardes déjà le banc ? »
← **Encore une, Dédé** — effets : vestiaire +, tribunes +, force −1 — *Il compte une licence de plus sur son doigt. Il a des doigts pour encore trois ans.*
→ **Je regarde le banc** — effets : direction ++, tribunes −, set: banc_regarde — *Il enlève le sifflet de son cou. Il ne te le donne pas ; il le pose entre vous deux.*
Variante `plays('am.village.club_endette') >= 2` (« encore ») : « Bon, on va pas se mentir : l'an dernier tu m'as dit « encore une », et l'année d'avant aussi. Cette année, c'est toi qui le dis ou c'est moi ? » — mêmes sorties.
**Traces** : banc_regarde · **Réactions déclenchées** : — · **Lu plus tard par** : Carte Destin amateur → entraîneur amateur (ch. 30, `if: flag('banc_regarde')` : « tu l'avais posé entre nous »)

### SCÈNE am.village.s2_veille  —  La veille, chez Dupuis (rejouable)
**Rôle** : joueur_amateur · **Intrigue** : am.village.club_endette · **Étape** : 9/9 · **Moment** : saison 2+, slot 17 · **Lieu** : la boucherie, le maillot rose « DUPUIS » sur un cintre · **Conditions** : —
**DUPUIS** *(boucher, sponsor — neutre — il pèse un rôti pendant qu'il te parle)*
« Le meilleur du cochon, et je pèse mes mots : demain c'est le dernier match, et le rôti est pour le vestiaire si vous gagnez. Tu le portes, mon maillot rose, ou tu gardes le marron ? »
← **Je porte le rose** — effets : caisse ++, tribunes −, relation.dupuis +1, set: boucher_sponsor — *Tu joues en rose. Le village siffle, puis mange le rôti. Il siffle moins.*
→ **Le marron, et le rôti quand même** — effets : tribunes ++, caisse −, relation.dupuis −1 — *Il donne le rôti quand même. Il dit que c'est la dernière fois ; il le dit chaque année.*
Variante `plays() >= 2` : « Le meilleur du cochon, et je pèse mes mots : c'est le troisième rôti, et le maillot rose est toujours sur son cintre. Cette année, tu le mets ? »
**Traces** : boucher_sponsor (∃, déjà déclaré) · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 11 (drapeau existant), ch. 13 (Dupuis veut choisir le capitaine : « tu as porté le rose »), fin am_heros (epitaph_plus)

### 2.3 POSTULAT `lache_academie` — Lâché par l'académie

**Rôle** : `joueur_amateur` · **Année** : 1994 · **Club** : Régional 1 (tiré ; le pitch dit « le club d'à côté de Valdorne ») · **Jauges** : vestiaire 25 (les vieux te jalousent), tribunes 45, direction 60, caisse 40 · **Force** : 74 (tu as été formé à Valdorne ; c'est ce qui reste) · **Objectif** : la montée en National (70 points) · **Drapeaux** : `[academie, agent_fardelli]` (Fardelli est déjà collé aux basques : la seule situation amateur où il parle) · **Président** : « le président » (voix sans portrait) ; Fardelli est le patron narratif.
**Pitch** : Valdorne t'a rendu à dix-huit ans. Fardelli t'a gardé.
**Question de saison** : Ce que tu veux, c'est la revanche, l'oubli, ou la commission de Fardelli ? — `revanche` / `oubli` / `fardelli`.
**Cast** : fardelli (patron 2), barbier (l'homme du rapport 1,5 : c'est lui qui t'a rendu), dede (coach 1,5), josiane (0,5), gerard (1), lea (1), camille (1), dupuis (0,5), vecchio (0,5), roux (0,5), « les vieux du vestiaire » (voix 1).
**Objectifs cachés** : `academie_sans_fardelli` — *Signer pro sans Fardelli* (`flag('essai_pro') && flag('sans_agent')` ; indice : « L'agent est ton employé, pas ton père. ») · `academie_revanche` — *Le rapport déchiré* (`relation.barbier >= 2` ; indice : « Il t'a vu jouer sous la pluie. Une fois. ») · `academie_vestiaire` — *Les vieux t'ont adopté* (`gauges.vestiaire >= 60 && stats.saisons >= 2` ; indice : « Porte les ballons. Tous. »).
**alarm_override** : `vestiaire.low` → `am.alarme.vestiaire_bas_vieux` (« les vieux » : « Le petit de Valdorne ne fait plus la passe. On ne lui en fait plus non plus. »).

#### Le script `am.academie.rendu` (quatre ancres S0 ; S1 et S2+ en résumé)

### SCÈNE am.academie.l1_rendu  —  Rendu
**Rôle** : joueur_amateur · **Intrigue** : am.academie.rendu · **Étape** : 1/9 · **Moment** : saison 0, slot 1 · **Lieu** : la voiture de Fardelli, garée devant un terrain de Régional, essuie-glaces en marche · **Conditions** : —
**FARDELLI** *(agent — neutre — il ne coupe pas le moteur, il fait chauffer l'habitacle)*
« Valdorne t'a rendu, c'est dans le rapport : « trop lent », il pleuvait. Mon ami, on parle d'argent ou d'amitié ; moi, je te garde, dix pour cent, et on remonte par ici. »
← **Dix pour cent, je te garde** — effets : direction +, caisse −, relation.fardelli +1, set: agent_fardelli — *Il coupe le moteur. Il te fait signer sur le volant ; le papier est humide.*
→ **Je remonte seul** — effets : direction −, tribunes +, relation.fardelli −1, set: sans_agent, clear: agent_fardelli — *Il remet le contact. « Tu m'appelleras », dit-il, et il a raison, tu l'appelleras.*
Variante `fil_rouge == 'revanche'` : « Valdorne t'a rendu, et dans deux ans on joue contre leur réserve ; mon ami, on parle d'argent ou d'amitié, mais la revanche, ça se facture aussi. » · Variante `fil_rouge == 'oubli'` : « Valdorne t'a rendu, oublie Valdorne ; mon ami, on parle d'argent ou d'amitié, et l'oubli, c'est moi qui le vends le mieux. »
**Traces** : agent_fardelli, sans_agent (drapeaux de script, lus par tout le rôle) · **Réactions déclenchées** : am.re.dede_agent (§ 7) · **Lu plus tard par** : am.academie.l3_reserve, jp.pepite.p1_valeur (« tu es déjà mon ami »), objectif `academie_sans_fardelli`, am.doudoune (variante « Fardelli connaît Barbier »), ch. 02 (Fardelli, retrouvailles)

### SCÈNE am.academie.l2_vieux  —  Les vieux
**Rôle** : joueur_amateur · **Intrigue** : am.academie.rendu · **Étape** : 2/9 · **Moment** : saison 0, [10,11] · **Lieu** : le vestiaire, un radiateur, six joueurs de plus de trente ans · **Conditions** : —
**LES VIEUX DU VESTIAIRE** *(voix sans portrait — le plus vieux parle, les autres regardent le radiateur)*
« Le petit de Valdorne veut le penalty, le coup franc et le maillot dix, et nous on a le radiateur. Tu prends le maillot dix, ou tu prends le sac de ballons pendant un mois ? »
← **Le sac, un mois** — effets : vestiaire ++, tribunes −, force −1, set: sac_porte — *Tu portes. Au bout de trois semaines, le plus vieux porte avec toi. Il ne le dit pas.*
→ **Le dix, et vous verrez** — effets : tribunes ++, vestiaire −−, set: dix_pris — *Tu marques deux fois dimanche. Personne ne te fait la passe pour le troisième.*
**Traces** : sac_porte, dix_pris · **Réactions déclenchées** : co.re.vecchio_bouteilles (∃, ch. 01, si `chars.vecchio.statut == 'club'`) · **Lu plus tard par** : alarme `am.alarme.vestiaire_bas_vieux` (variante), objectif `academie_vestiaire`, jp.brassard_test (variante « tu as déjà porté le sac »)

### SCÈNE am.academie.l3_reserve  —  La réserve de Valdorne
**Rôle** : joueur_amateur · **Intrigue** : am.academie.rendu · **Étape** : 3/9 · **Moment** : saison 0, slot 16 · **Lieu** : le stade de la Dorne, terrain annexe, Barbier en doudoune sur la butte · **Conditions** : —
**BARBIER** *(recruteur — neutre — la doudoune fermée, un calepin qu'il n'ouvre pas)*
« Je l'ai vu jouer sous la pluie, et j'ai écrit ce que j'ai vu ; aujourd'hui il ne pleut pas. Tu joues contre nous pour me faire mentir, ou pour gagner ? »
← **Pour te faire mentir** — effets : tribunes ++, vestiaire −, force +1, relation.barbier +1, set: revanche_valdorne — *Tu joues contre leur réserve comme contre un rapport. Il ouvre le calepin à la mi-temps. Il écrit une ligne.*
→ **Pour gagner, tout court** — effets : vestiaire ++, tribunes +, relation.barbier +1, set: revanche_calme — *Tu joues pour le club. Il n'ouvre pas le calepin ; il te fait un signe de tête, une fois.*
Variante `flag('agent_fardelli')` : « Je l'ai vu jouer sous la pluie, et je vois que Fardelli l'a ramassé ; c'est lui qui t'a dit de venir me montrer ? » — mêmes sorties, la droite ajoute relation.fardelli −1.
**Traces** : revanche_valdorne (« {annee} : contre la réserve de Valdorne, {prenom} {nom} a joué contre un rapport. Barbier a écrit une ligne. »), revanche_calme · **Réactions déclenchées** : co.re.barbier_doudoune (ch. 02) · **Lu plus tard par** : am.doudoune.doudoune (variante « le calepin »), objectif `academie_revanche`, ch. 30 (Carte Destin amateur → pro : « Valdorne a relu le rapport »), ch. 20 (« LE RENDU DE VALDORNE »)

### SCÈNE am.academie.l4_virage  —  Le dernier virage
**Rôle** : joueur_amateur · **Intrigue** : am.academie.rendu · **Étape** : 4/9 · **Moment** : saison 0, slot 17 · **Lieu** : le parking, Fardelli au téléphone dans sa voiture, Dédé qui attend qu'il finisse · **Conditions** : —
Variante `flag('agent_fardelli')` — **FARDELLI** *(neutre — il baisse la vitre, pas complètement)* : « Trois clubs de National m'ont appelé, mon ami, et un club de D2 qui ne dit pas son nom. Dimanche, tu joues pour eux ou pour la montée ? » — ← **Pour la montée, ici** — tribunes ++, direction +, relation.fardelli −1 — *Il remonte la vitre. Il note la date : il facturera la fidélité plus tard.* · → **Pour eux, qu'ils voient** — direction −, tribunes −, force +1, set: vitrine — *Tu joues en vitrine. Le club gagne quand même ; ce n'est pas grâce à toi, et tout le monde le sait.*
Secours — **DÉDÉ** : « Bon, on va pas se mentir : le petit de Valdorne, dimanche, c'est le match de la montée, et j'ai deux compos. Tu es dans laquelle ? » — ← **La compo qui gagne** — vestiaire +, force +1 — *Il déchire l'autre.* · → **Celle avec les vieux** — vestiaire ++, tribunes −, force −1 — *Il garde les deux. Il fait jouer les vieux ; ils gagnent, lentement.*
**Traces** : vitrine · **Réactions déclenchées** : — · **Lu plus tard par** : set-piece `bilan_carrefour` amateur (ch. 30), Carte Destin amateur → pro (variante « trois clubs de National »)

**S1 et S2+ (résumé, mêmes fenêtres que le village)** : `am.academie.s1_premier_jour` (Dédé ou Fardelli selon `essai_pro` ; variante « tu as signé pro sans lui » si `sans_agent`) · `am.academie.s1_twist` — *Le retour à la Dorne* (la Coupe tire Valdorne, l'équipe première, au stade de la Dorne ; Barbier en tribune d'honneur ; issues `humilie | tenu | but`) · `am.academie.s1_veille` — Léa (L'Écho) : « Vous confirmez ? Le rendu de Valdorne joue la montée demain. » · `am.academie.s2_rentree` — Fardelli ou Dédé (« encore » sur `plays()`) · `am.academie.s2_veille` — Gérard, la caisse, la tournée d'avant-match.

### 2.4 Le réservoir du joueur amateur (huit intrigues)

Pool `"0"` (prendre 3, fenêtre [2,9], réserve 1) : `am.doudoune` (signature, `if: season >= 1 || flag('academie')`), `am.patron` (`if: flag('boulot')`), `am.troisieme_mitemps`, `am.dede_neveu`, `am.sanglier`, `am.pichon_150`. Pool `"1"` (reprise) : `am.montbeliac`, `am.district`, `am.genou_21` **[drame]** (jamais en S0 ; jamais juste après `am.district`). Pool `"2+"` : `am.doudoune` (replay after 1, max 2), `am.troisieme_mitemps` (ritual), `am.sanglier` (replay after 2). Les intrigues partagées `co.derby` (variante amateur), `co.camille_naissance` (ch. 01) et `co.pharmacie` ne sont pas au pool amateur.

## INTRIGUE am.doudoune  —  Le type en doudoune
**Logline** : Un inconnu en doudoune au bord du terrain a un essai pour toi mardi, à quatre cents kilomètres, et tu bosses lundi. · **Synopsis** : Barbier vient voir jouer un autre. Il te voit. Il propose un essai à Valdorne, deux jours à poser, et un rapport qu'il n'a pas encore écrit. Tu y vas ou tu restes avec les copains ; si tu y vas, le coup de fil arrive deux cartes plus tard : contrat pro, ou « trop lent ». Si tu restes, il revient une fois, l'année suivante, et une seule. C'est la Carte Destin amateur → pro déguisée en feuilleton ; la Carte Destin elle-même (ch. 30) lit ce que cette intrigue a posé.
**Rôle(s)** : joueur_amateur · **Postulat(s)** : partagé (village_endette, lache_academie) · **Porteur** : barbier · **Cast** : barbier, dede, camille, fardelli (si `agent_fardelli`), josiane · **Thème** : mercato
**Saisons** : "0" (si `academie`), "1", "2+" · **Conditions d'entrée** : `age <= 24 && !flag('essai_rate')` · **Exclusions** : `essai_pro` déjà posé et lu · **Rejouabilité** : replay {after: 1, max: 2}
**Issues** → **Traces** → **Qui les lit** : `essai` → `essai_pro` (« {annee} : un type en doudoune a proposé un essai à {prenom} {nom}. Mardi, sous la pluie. ») → lue par ch. 30 (Carte Destin amateur → pro), am.village.v2_scierie, am.patron, objectif `village_detecte_avant`, ch. 20 (« LA DOUDOUNE EST PASSÉE ») · `copains` → `copains_gardes` (déjà déclarée) → objectif, ch. 30 · `trop_lent` → `essai_rate` → am.doudoune.doudoune_encore, ch. 02 (Barbier commence à −1)
**Séquencier** : doudoune (ouverture) → coup_de_fil [in 2,4] → lundi (S+1, at_season +1, [1,4]) ; variante « encore » sur `plays()`.
**Scènes** :

### SCÈNE am.doudoune.doudoune  —  La doudoune
**Rôle** : joueur_amateur · **Intrigue** : am.doudoune · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : le bord du terrain, une main courante, un inconnu qui ne regarde pas le match, il te regarde · **Conditions** : —
**BARBIER** *(recruteur — neutre — les mains dans la doudoune, il ne se présente pas tout de suite)*
« Je bosse pour Valdorne, et il y a un essai mardi, à quatre cents kilomètres ; tu dois poser deux jours. Je l'ai vu jouer sous la pluie, celui que je venais voir ; c'est toi que j'ai regardé. »
← **J'y vais mardi** — effets : caisse −, tribunes +, force −1, set: essai_pro, outcome: essai — *Tu prends le car de nuit. Il pleut à Valdorne ; ça tombe bien, dit-il.*
→ **Je reste avec les copains** — effets : vestiaire ++, tribunes −, set: copains_gardes, outcome: copains — *Il range son calepin. Il revient l'an prochain, une fois ; il ne revient jamais deux fois.*
Variante `plays('am.doudoune') >= 1` (« encore ») : « Je bosse toujours pour Valdorne, et l'an dernier tu es resté avec tes copains ; je l'ai vu jouer sous la pluie, et je ne repasse pas trois fois. Mardi ? » — mêmes sorties, la droite pose aussi `essai_rate`.
Variante `flag('revanche_valdorne')` : « Je bosse pour Valdorne, et Valdorne a relu mon rapport après la réserve ; il pleuvait moins. Mardi, tu viens leur montrer le reste ? »
Variante `flag('agent_fardelli')` : « Je bosse pour Valdorne, et ton ami Fardelli m'a téléphoné trois fois ; je l'ai vu jouer sous la pluie, toi, pas lui. Tu viens seul mardi, ou avec lui ? » — ← **Seul** — set: essai_pro, set: essai_seul, relation.fardelli −1 · → **Avec lui** — set: essai_pro, caisse −, relation.fardelli +1.
**Traces** : essai_pro, copains_gardes, essai_seul · **Réactions déclenchées** : am.re.camille_quatre_cents (§ 7) · **Lu plus tard par** : am.doudoune.coup_de_fil, am.village.v2_scierie, am.patron.lundi, objectif `academie_sans_fardelli` (`essai_seul`), ch. 30 (Carte Destin)

### SCÈNE am.doudoune.coup_de_fil  —  Le coup de fil
**Rôle** : joueur_amateur · **Intrigue** : am.doudoune · **Étape** : 2/4 · **Moment** : [2,4] après l'essai · **Lieu** : la cabine du bar-tabac, Gérard qui fait semblant d'essuyer un verre · **Conditions** : `flag('essai_pro')`
**BARBIER** *(recruteur — neutre — au téléphone, un fond de bruit de stade)*
« J'ai rendu mon rapport, et Valdorne le lit lentement ; je l'ai vu jouer sous la pluie, j'ai écrit ça, et j'ai écrit « à revoir en juin ». Tu tiens jusqu'en juin, ou tu veux la réponse tout de suite ? »
← **Je tiens jusqu'en juin** — effets : direction +, tribunes +, relation.barbier +1, set: essai_juin — *Tu tiens. En juin, la Carte Destin arrive avec sa doudoune ; elle a relu le rapport.*
→ **La réponse tout de suite** — effets : tribunes −, relation.barbier −1, rand: [{p: 0.35, set: essai_juin, direction ++}, {set: essai_rate, tribunes −−, outcome: trop_lent}] — *Il te la donne. Elle tient en deux mots, ou en un : « juin ».*
**Traces** : essai_juin (sans Almanach), essai_rate · **Réactions déclenchées** : am.re.dede_juin (§ 7) · **Lu plus tard par** : ch. 30 (Carte Destin amateur → pro : `if: flag('essai_juin')`, variante « Valdorne a lu le rapport » si `rapport_trop_lent`), am.doudoune.doudoune_encore

### SCÈNE am.doudoune.lundi  —  Le lundi d'après
**Rôle** : joueur_amateur · **Intrigue** : am.doudoune · **Étape** : 3/4 · **Moment** : saison suivante, [1,4] · **Lieu** : le vestiaire de ton club amateur, si tu y es encore · **Conditions** : `flag('essai_rate') || flag('copains_gardes')`
**DÉDÉ** *(coach bénévole — sourire si relation ≥ 1 — il te rend ton sac, il l'a gardé tout l'été)*
« Bon, on va pas se mentir : la doudoune n'a pas rappelé, et les copains, eux, ont rappelé tout l'été. Tu joues dimanche comme avant, ou comme quelqu'un qui a raté quelque chose ? »
← **Comme avant** — effets : vestiaire ++, tribunes +, clear: essai_rate — *Tu joues comme avant. Momo dit que tu es meilleur qu'avant ; c'est faux, et c'est gentil.*
→ **Comme quelqu'un qui a raté** — effets : vestiaire −, tribunes −, force +2, set: rancune_valdorne — *Tu joues fâché. Tu marques plus. Personne ne te tape dans le dos après.*
**Traces** : rancune_valdorne · **Réactions déclenchées** : — · **Lu plus tard par** : jp.pepite.p1_valeur (variante « tu as attendu un an de plus »), ch. 90 (mémoire de Valdorne : −1)
**Épilogue** : par abandon (changement de club), `essai_pro` reste posé (Barbier suit le joueur, pas le club) ; ligne « {annee} : la doudoune est repartie sans réponse. »

## INTRIGUE am.patron  —  Le patron en a marre
**Logline** : Trois lundis d'arrêt pour des blessures de foot ; le prochain, c'est la porte. · **Synopsis** : Ton patron (la scierie, le garage, la plomberie, tiré) compte les lundis. Une cheville tordue le dimanche, un certificat de Sabatier qui n'existe pas encore (c'est un amateur : le certificat est du médecin du canton, une voix), une convocation de dernière minute, et le lundi où tu choisis entre la paie et le tournoi. Si `patron_furieux` est posé, l'étape S+1 est le licenciement, et le porte-monnaie s'effondre ; Camille a un mot à dire, et Dupuis peut proposer un boulot à la boucherie, contre le maillot rose.
**Rôle(s)** : joueur_amateur · **Postulat(s)** : village_endette (signature possible), lache_academie · **Porteur** : « ton patron » (voix ; le porteur technique est `dede`, seul personnage à statut de la chaîne) · **Cast** : ton patron, dede, camille, dupuis, gerard · **Thème** : argent
**Saisons** : "0", "1" · **Conditions d'entrée** : `flag('boulot')` · **Exclusions** : — · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `pied_leve` → `boulot_tenu` (script) · `foot` → `patron_furieux` (« {annee} : le patron de {prenom} {nom} a compté les lundis. Il en manquait trois. ») → am.patron.licenciement, am.village.v3_fusion, fin am_patron, ch. 30 (Carte Destin : « tu as posé deux jours ») · `boucherie` → `boucher_sponsor` (∃) → ch. 11, ch. 13
**Séquencier** : lundi (ouverture) → cheville [in 2,5] → licenciement (S+1, [2,8], `requires: [patron_furieux]`) → boucherie [in 1,3] après licenciement.

### SCÈNE am.patron.lundi  —  Trois lundis
**Rôle** : joueur_amateur · **Intrigue** : am.patron · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : l'atelier, huit heures cinq, ta cheville bandée sous le pantalon · **Conditions** : —
**TON PATRON** *(voix sans portrait — il regarde la pendule, pas toi)*
« Trois lundis d'arrêt pour du foot, et j'ai un carnet de commandes, pas un carnet de santé. Le prochain lundi que tu rates, c'est la porte : tu lèves le pied, ou le foot d'abord ? »
← **Je lève le pied** — effets : caisse ++, vestiaire −, force −2, outcome: pied_leve — *Tu joues moins fort le dimanche. Dédé le voit ; il ne dit rien, il te met à droite, là où on court moins.*
→ **Le foot d'abord** — effets : vestiaire +, tribunes +, caisse −, set: patron_furieux, outcome: foot — *Il note quelque chose dans le carnet de commandes. Ce n'est pas une commande.*
Variante `flag('foot_d_abord')` : « Tu as dit « le foot d'abord » à la licence, on me l'a répété au bar, et moi je compte les lundis : trois. Le prochain, c'est la porte : tu changes d'avis, ou tu changes de patron ? »
**Traces** : patron_furieux · **Réactions déclenchées** : am.re.camille_sciure (§ 7) · **Lu plus tard par** : am.patron.licenciement, am.village.v3_fusion, fin am_patron, objectif `village_boulot_tenu`

### SCÈNE am.patron.cheville  —  Le médecin du canton
**Rôle** : joueur_amateur · **Intrigue** : am.patron · **Étape** : 2/4 · **Moment** : [2,5] · **Lieu** : la salle d'attente du médecin du canton, Dédé qui t'a conduit, la casquette sur les genoux · **Conditions** : —
**DÉDÉ** *(coach bénévole — neutre — il te tend un arrêt de travail déjà rempli, il ne l'a pas rempli lui-même, c'est ce qu'il dit)*
« Bon, on va pas se mentir : le docteur a fait un arrêt de huit jours pour une cheville qui en vaut trois, et dimanche il y a le tournoi. Tu prends l'arrêt et tu joues, ou tu retournes bosser boiteux ? »
← **L'arrêt, et je joue** — effets : tribunes ++, caisse +, direction −, set: arret_complaisance — *Tu joues au tournoi avec un arrêt de travail dans la poche. Le patron est dans la tribune ; il ne s'assoit pas.*
→ **Je bosse boiteux** — effets : caisse ++, tribunes −, vestiaire −, force −1 — *Tu bosses. Tu boites jusqu'à mercredi. Le patron te dit « merci » ; c'est la première fois.*
**Traces** : arret_complaisance (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : am.patron.licenciement (variante « le patron t'a vu au tournoi »), ch. 15 (Roux : « les arrêts du canton » quand le district examine)

### SCÈNE am.patron.licenciement  —  La porte
**Rôle** : joueur_amateur · **Intrigue** : am.patron · **Étape** : 3/4 · **Moment** : saison suivante, [2,8] · **Lieu** : le bureau de l'atelier, une enveloppe, le carnet de commandes fermé · **Conditions** : `flag('patron_furieux')`
**TON PATRON** *(voix sans portrait — il a préparé l'enveloppe ; il l'a préparée depuis longtemps)*
« Quatrième lundi, et j'avais dit trois ; voilà ton solde, et une lettre pour la boîte d'intérim de Montbéliac. Tu prends l'intérim là-bas, ou tu cherches ici ? »
← **L'intérim à Montbéliac** — effets : caisse +, tribunes −−, vestiaire −, set: intérim_montbeliac — *Tu bosses chez l'ennemi. Le samedi, on te demande si tu signes aussi chez eux ; tu réponds « non » de moins en moins vite.*
→ **Je cherche ici** — effets : caisse −−, tribunes +, vestiaire +, set: chomage_village — *Tu cherches. Le village n'a que deux employeurs : la scierie, et Dupuis.*
Variante `flag('arret_complaisance')` : « Je t'ai vu au tournoi avec un arrêt de huit jours dans la poche, et j'ai un carnet de commandes ; voilà ton solde. L'intérim à Montbéliac, ou tu cherches ici ? »
**Traces** : chomage_village (« {annee} : {prenom} {nom} a perdu son boulot pour un tournoi. Le village n'a que deux patrons. »), intérim_montbeliac · **Réactions déclenchées** : co.re.camille_journal (∃, si `!flag('divorce')`) · **Lu plus tard par** : am.patron.boucherie, fin am_patron (epitaph_plus), am.montbeliac (variante « tu bosses déjà chez eux »), ch. 13 (Dupuis : « je t'ai embauché une fois »)

### SCÈNE am.patron.boucherie  —  Le tablier
**Rôle** : joueur_amateur · **Intrigue** : am.patron · **Étape** : 4/4 · **Moment** : [1,3] après le licenciement · **Lieu** : la boucherie, le maillot rose sur son cintre, un tablier plié à côté · **Conditions** : `flag('chomage_village')`
**DUPUIS** *(boucher, sponsor — sourire — il te tend le tablier, le maillot est derrière)*
« Le meilleur du cochon, et je pèse mes mots : j'embauche, six heures le matin, et le dimanche tu joues en rose avec mon nom dans le dos. Le tablier et le maillot, ou ni l'un ni l'autre ? »
← **Le tablier et le maillot** — effets : caisse ++, tribunes −, relation.dupuis +1, set: boucher_sponsor, clear: chomage_village, outcome: boucherie — *Tu apprends le hachoir. Le dimanche, le village siffle le rose, puis achète le cochon.*
→ **Ni l'un ni l'autre** — effets : caisse −, tribunes +, vestiaire +, relation.dupuis −1 — *Il replie le tablier. Il sponsorise Montbéliac la saison suivante ; il pèse ses mots ailleurs.*
**Traces** : boucher_sponsor (∃) · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 13 (`dupuis_chez_montbeliac` si refusé : la fiche 02 pose la trace au palier ; ici c'est la variante d'entrée), fin am_heros
**Épilogue** : par abandon, `patron_furieux` reste (le patron est une réputation, pas un club) ; ligne « {annee} : à {ville}, on savait que {nom} ratait les lundis. »

## INTRIGUE am.troisieme_mitemps  —  La troisième mi-temps
**Logline** : Le président a payé la tournée, ça finit au bar à quatre heures ou tu rentres. · **Synopsis** : Chaque saison, le rituel : la tournée, le bar, Gérard qui compte, Camille qui attend. Une première fois on reste ou on rentre ; la deuxième, une vidéo tourne (dès 2007, le Flux ; avant, une photo dans L'Écho) ; la troisième, la bagarre au bar et la gendarmerie, ou la sagesse. Le thème est absurde et tendre : c'est là que se fait le bistrot (TRIBUNES) et que se défait le porte-monnaie.
**Rôle(s)** : joueur_amateur · **Postulat(s)** : partagé · **Porteur** : gerard · **Cast** : gerard, dupuis, camille, lea, pichon, « Momo » (voix) · **Thème** : absurde
**Saisons** : "0", "2+" (ritual) · **Conditions d'entrée** : — · **Rejouabilité** : ritual (escalier sur `plays()`)
**Issues** → **Traces** → **Qui les lit** : `reste` → `bar_quatre_heures` (« {annee} : la troisième mi-temps a duré jusqu'à quatre heures. {prenom} {nom} a payé la dernière. ») → am.troisieme_mitemps.video, alarme `am.alarme.tribunes_bas_gerard` (variante « tu ne viens plus »), ch. 20 (Écho, brève) · `rentre` → `rentre_tot` → co.camille (ch. 01, variante « il rentre tôt, celui-là »)
**Séquencier** : tournee (ouverture, S0) → video [in 3,6] (`plays >= 1` ou `year >= 2007`) → bagarre (S2+, `plays >= 2`) ; chaque étape a sa variante « encore ».

### SCÈNE am.troisieme_mitemps.tournee  —  La tournée du président
**Rôle** : joueur_amateur · **Intrigue** : am.troisieme_mitemps · **Étape** : 1/3 · **Moment** : ouverture tirée, après une Carte Match gagnée de préférence · **Lieu** : le bar-tabac, la tournée sur le comptoir, Gérard derrière avec la boîte en fer · **Conditions** : —
**GÉRARD** *(bénévole, trésorier — neutre — il pousse une bière vers toi et une addition vers Pichon)*
« Ici, on payait en bières, et ce soir c'est le président qui paie, enfin, c'est la caisse ; ça finit à quatre heures. Tu restes, ou tu rentres chez Camille ? »
← **Je reste jusqu'à quatre heures** — effets : tribunes ++, force −1, relation.camille −1, set: bar_quatre_heures, outcome: reste — *À quatre heures, Momo chante. À cinq, Pichon ouvre la boulangerie et vous met dehors avec du pain.*
→ **Je rentre** — effets : tribunes −, force +1, relation.camille +1, set: rentre_tot, outcome: rentre — *Tu rentres. Le village dit « il est pas d'ici, celui-là ». Il le dit avec tendresse ; pas tous.*
Variante `plays() == 1` (« encore ») : « Ici, on payait en bières, et l'an dernier tu as payé la dernière ; ce soir c'est reparti, et Momo a apporté un appareil photo. Tu restes ? » · Variante `plays() >= 2` : « Ici, on payait en bières, et toi tu es le seul à savoir combien ça coûte, puisque tu as tenu la boîte un soir. Tu restes, ou tu comptes ? » — ← **Je compte avec toi** — tribunes +, caisse +, relation.gerard +1, set: gerard_confiance — *Tu comptes. Il te montre le double fond de la boîte. Tu sais quelque chose maintenant.*
**Traces** : bar_quatre_heures, rentre_tot, gerard_confiance (« {annee} : Gérard a montré le double fond de la boîte à {prenom} {nom}. ») · **Réactions déclenchées** : am.re.camille_quatre_heures (§ 7) · **Lu plus tard par** : ch. 13 (`gerard_parti` : « tu connaissais le double fond »), fin pa_buvette (ch. 30, epitaph_plus), am.troisieme_mitemps.video

### SCÈNE am.troisieme_mitemps.video  —  La photo qui tourne
**Rôle** : joueur_amateur · **Intrigue** : am.troisieme_mitemps · **Étape** : 2/3 · **Moment** : [3,6] · **Lieu** : la rédaction de L'Écho (une table au bar), Léa avec une photo (ou un téléphone dès 2007) · **Conditions** : `flag('bar_quatre_heures')`
**LÉA** *(L'Écho — neutre — elle pose la photo à l'envers, puis à l'endroit)*
« Vous confirmez ? Vous, sur le comptoir, à quatre heures, avec le maillot du club et le fils Dupuis qui tient l'échelle. Je la passe en page « Au local », ou je la garde ? »
← **Passez-la, c'est le village** — effets : tribunes ++, direction −, relation.lea +1, set: photo_comptoir — *L'Écho la passe. Dédé la découpe et la punaise au vestiaire, côté « à ne pas refaire ».*
→ **Gardez-la, s'il vous plaît** — effets : direction +, tribunes −, relation.lea −1 — *Elle la garde. Elle la ressort dix ans plus tard, quand tu es quelqu'un ; elle ne l'a pas oubliée.*
Variante `year >= 2007` (`monde_flux`) : « Vous confirmez ? La vidéo du comptoir a trois mille vues sur le Flux, et le district en a une copie. Je la commente, ou je la laisse tourner ? »
**Traces** : photo_comptoir (« {annee} : {prenom} {nom} sur le comptoir, à quatre heures, en maillot. L'Écho l'a passée. ») · **Réactions déclenchées** : co.re.lea_confirme (∃) · **Lu plus tard par** : jp.memoires (variante « la photo du comptoir »), ch. 20 (Écho : « AU LOCAL, À QUATRE HEURES »), am.district (variante « le district a la photo »)

### SCÈNE am.troisieme_mitemps.bagarre  —  Quatre heures dix
**Rôle** : joueur_amateur · **Intrigue** : am.troisieme_mitemps · **Étape** : 3/3 · **Moment** : saison 2+, `plays() >= 2` · **Lieu** : le trottoir devant le bar, un joueur de Montbéliac par terre, Momo qui saigne du nez · **Conditions** : —
**MOMO** *(voix sans portrait — il tient son nez, il tient aussi une chaise)*
« Le gars de Montbéliac a dit que le maillot marron c'était une couleur de boue, et je lui ai répondu avec la chaise. La gendarmerie arrive : tu me couvres, ou tu dis ce que tu as vu ? »
← **Je te couvre** — effets : vestiaire ++, direction −−, set: momo_couvert — *Tu dis que la chaise est tombée toute seule. Le gendarme est de Boisnoir ; il écrit « chute de chaise ».*
→ **Je dis ce que j'ai vu** — effets : direction +, vestiaire −−, tribunes − — *Momo prend trois matchs. Il ne te parle plus jusqu'à la Coupe ; à la Coupe, il te fait la passe, une.*
**Traces** : momo_couvert · **Réactions déclenchées** : — · **Lu plus tard par** : am.district (variante « la chaise »), fin am_toro (epitaph_plus « Momo »)
**Épilogue** : ligne « {annee} : la troisième mi-temps de {ville} a fini au comptoir, comme chaque année. »

## INTRIGUE am.dede_neveu  —  Le neveu du président
**Logline** : Le neveu du président doit jouer. À ta place. Tu comprends ? · **Synopsis** : Dédé, gêné, t'annonce que le neveu de Pichon joue dimanche, à ton poste, parce que la mairie, parce que la subvention, parce que. Tu acceptes le banc ou tu gueules devant tout le monde ; si tu gueules, Montbéliac t'appelle ; si tu acceptes, le neveu rate tout et Dédé te rappelle en cours de match, à toi de choisir de rentrer. La quatrième scène est la revanche du neveu : il devient ton coéquipier, ou ton ennemi doux.
**Rôle(s)** : joueur_amateur · **Postulat(s)** : partagé · **Porteur** : dede · **Cast** : dede, pichon, « le neveu » (voix), « Montbéliac » (voix), gerard · **Thème** : direction
**Saisons** : "0", "1" · **Conditions d'entrée** : `gauges.direction >= 35` · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `banc` → `banc_accepte` → am.dede_neveu.rentre, ch. 30 (set-piece `objective` amateur) · `gueule` → `voisin_appelle` (« {annee} : {prenom} {nom} a gueulé devant tout le monde. Montbéliac a appelé le soir même. ») → am.montbeliac (`if`), fin am_touche, ch. 13 (Pichon : « il avait gueulé »)
**Séquencier** : neveu (ouverture) → rentre [in 1,3] (`banc_accepte`) ou appel [in 1,3] (`voisin_appelle`) → revanche (S+1, [3,9]).

### SCÈNE am.dede_neveu.neveu  —  À ta place
**Rôle** : joueur_amateur · **Intrigue** : am.dede_neveu · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : le vestiaire, la compo à la craie, ton nom effacé du plat de la main · **Conditions** : —
**DÉDÉ** *(coach bénévole — neutre — il a de la craie sur la paume, il la cache)*
« Bon, on va pas se mentir : le neveu du président joue dimanche, à ta place, et je n'ai pas décidé ça au mardi. Tu acceptes le banc, ou tu gueules devant tout le monde ? »
← **J'accepte le banc** — effets : direction ++, vestiaire −, force −1, set: banc_accepte, outcome: banc — *Tu t'assois. Le neveu rate un contrôle, puis deux. Dédé regarde le banc à la vingtième.*
→ **Je gueule devant tout le monde** — effets : direction −−, vestiaire ++, tribunes +, set: voisin_appelle, outcome: gueule — *Tu gueules. Pichon l'apprend au pétrin. Le soir, le téléphone sonne ; l'indicatif est celui de Montbéliac.*
**Traces** : banc_accepte, voisin_appelle · **Réactions déclenchées** : am.re.pichon_petrin (§ 7) · **Lu plus tard par** : am.dede_neveu.rentre, am.montbeliac, fin am_touche (epitaph_plus), ch. 30

### SCÈNE am.dede_neveu.rentre  —  La vingtième minute
**Rôle** : joueur_amateur · **Intrigue** : am.dede_neveu · **Étape** : 2/4 · **Moment** : [1,3] · **Lieu** : le banc de touche, une planche sur deux parpaings, Dédé debout · **Conditions** : `flag('banc_accepte')`
**DÉDÉ** *(coach bénévole — sourire — il te fait signe du menton vers la touche)*
« Bon, on va pas se mentir : on perd un à zéro et le neveu court après le ballon comme après un car. Tu rentres à sa place, ou tu me laisses assumer jusqu'au bout ? »
← **Je rentre** — effets : tribunes ++, vestiaire +, direction −, force +1 — *Tu rentres. Tu égalises. Le neveu applaudit ; Pichon, en tribune, n'applaudit pas, il pétrit ses mains.*
→ **Assume jusqu'au bout** — effets : direction ++, tribunes −−, vestiaire − — *Il assume. Vous perdez deux à zéro. Le neveu vient te remercier au bar ; c'est le seul.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : —

### SCÈNE am.dede_neveu.appel  —  L'indicatif de Montbéliac
**Rôle** : joueur_amateur · **Intrigue** : am.dede_neveu · **Étape** : 2/4 (branche) · **Moment** : [1,3] · **Lieu** : la cuisine, le téléphone mural, Camille qui écoute depuis le couloir · **Conditions** : `flag('voisin_appelle')`
**UNE VOIX DE MONTBÉLIAC** *(sans portrait — le président des Sangliers, il ne dit pas bonjour)*
« Vous avez gueulé, on l'a su, et chez nous on ne fait pas jouer les neveux, on fait jouer ceux qu'on paie. Deux cents francs par match et un poste à la mairie : vous venez ?»
← **Je viens** — effets : caisse ++, tribunes −−−, vestiaire −, club: {change: true}, set: passe_a_montbeliac — *Tu passes chez l'ennemi. Le village retire ta photo du bar ; Gérard la garde dans la boîte, à l'envers.*
→ **Je reste, même au banc** — effets : tribunes ++, caisse −, relation.dede +1 — *Tu raccroches. Camille sort du couloir. Dédé, le lendemain, remet ton nom à la craie ; il appuie fort.*
**Traces** : passe_a_montbeliac (« {annee} : {prenom} {nom} est passé à Montbéliac pour deux cents francs. Le village a retourné sa photo. ») · **Réactions déclenchées** : co.re.camille_journal (∃) · **Lu plus tard par** : ch. 90 (mémoire des clubs : Boisnoir −3, « départ chez le rival »), ch. 13 (`fusion_imposee` : « tu étais passé chez eux »), fin am_enveloppe (epitaph_plus)

### SCÈNE am.dede_neveu.revanche  —  Le neveu, un an plus tard
**Rôle** : joueur_amateur · **Intrigue** : am.dede_neveu · **Étape** : 3/4 · **Moment** : saison suivante, [3,9] · **Lieu** : l'entraînement du mardi, le neveu qui reste après les autres pour tirer des coups francs · **Conditions** : `!flag('passe_a_montbeliac')`
**LE NEVEU** *(voix sans portrait — il ramasse les ballons sans qu'on le lui demande)*
« Mon oncle ne m'a jamais demandé si je voulais jouer, il m'a mis, et tout le village a vu que je courais comme un car. Tu m'apprends le contrôle, ou tu me laisses à la boulangerie ? »
← **Je t'apprends** — effets : vestiaire ++, direction +, force −1, set: neveu_forme — *Tu restes le mardi. Au bout d'un an, il contrôle. Au bout de deux, il te fait la passe.*
→ **La boulangerie, c'est bien aussi** — effets : vestiaire −, direction −, force +1 — *Il arrête. Il reprend la boulangerie en 2008, quand Pichon ferme. Il fait le pain, et il regarde les matchs de loin.*
**Traces** : neveu_forme · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 13 (`coupe_du_village` : « le neveu de Pichon joue », variante `neveu_forme`), ch. 31 (2008 : la boulangerie de Pichon ferme, « le neveu reprend »)
**Épilogue** : ligne « {annee} : le neveu du président a joué. Le village s'en souvient. »

## INTRIGUE am.sanglier  —  Le sanglier
**Logline** : Un sanglier a labouré la surface de réparation cette nuit ; l'arbitre hésite. · **Synopsis** : Le matin du match, Gérard découvre la surface retournée. On joue quand même (dans les trous) ou on reporte (et on perd la recette). Si l'on joue et qu'on gagne, le sanglier devient l'emblème ; s'il y a une entorse dans un trou, le porte-monnaie en souffre. La deuxième scène est la Une de L'Écho ; la troisième, un an plus tard, le sanglier revient, ou un autre.
**Rôle(s)** : joueur_amateur (et président_amateur : la variante « côté président » est au ch. 13) · **Postulat(s)** : partagé · **Porteur** : gerard · **Cast** : gerard, dede, lea, pichon, colline (si l'arbitre est un arbitre de district ; sinon « l'arbitre » voix) · **Thème** : absurde
**Saisons** : "0", "2+" (replay after 2, max 2) · **Conditions d'entrée** : — · **Rejouabilité** : replay {after: 2, max: 2}
**Issues** → **Traces** → **Qui les lit** : `joue` → `sanglier_embleme` (« {annee} : un sanglier a labouré la surface de {ville}. On a joué dedans, on a gagné. Il est sur le maillot. ») → am.sanglier.echo, ch. 13 (le maillot au sanglier), ch. 31 (anecdote « le sanglier dans la surface » : Haute-Combe l'a aussi), ch. 20 · `report` → `sanglier_report` → am.sanglier.encore
**Séquencier** : surface (ouverture) → echo [in 1,3] → encore (S2+, `plays >= 1`).

### SCÈNE am.sanglier.surface  —  La surface labourée
**Rôle** : joueur_amateur · **Intrigue** : am.sanglier · **Étape** : 1/3 · **Moment** : ouverture tirée, un matin de match · **Lieu** : la surface de réparation, retournée sur dix mètres, Gérard avec un râteau · **Conditions** : —
**GÉRARD** *(bénévole — neutre — le râteau à la main, il n'a pas commencé)*
« Ici, on payait en bières, et là il faudrait payer un sanglier, il a labouré la surface cette nuit. L'arbitre hésite : on joue dans les trous, ou on reporte et on perd la recette ? »
← **On joue dans les trous** — effets : tribunes ++, force −1, rand: [{p: 0.15, set: entorse_sanglier, caisse −−}, {set: sanglier_embleme}], outcome: joue — *Vous jouez. Le gardien adverse tombe dans un trou sur le penalty. Vous gagnez ; le sanglier est adopté.*
→ **On reporte** — effets : direction +, caisse −, tribunes −, set: sanglier_report, outcome: report — *Report. Gérard ratisse jusqu'à midi. Dupuis dit qu'il aurait bien pris le sanglier ; il pèse ses mots.*
Variante `plays() >= 1` (« encore ») : « Ici, on payait en bières, et le sanglier est revenu, ou c'est son cousin, il a la même façon de labourer. On joue dedans, comme l'autre fois ? »
**Traces** : sanglier_embleme, sanglier_report, entorse_sanglier · **Réactions déclenchées** : am.re.dede_sanglier (§ 7) · **Lu plus tard par** : am.sanglier.echo, ch. 13 (PA : le maillot au sanglier ; variante « le sanglier de 1992 »), ch. 31, fin am_heros

### SCÈNE am.sanglier.echo  —  Le sanglier en page « Au local »
**Rôle** : joueur_amateur · **Intrigue** : am.sanglier · **Étape** : 2/3 · **Moment** : [1,3] · **Lieu** : le bar, L'Écho ouvert sur le comptoir, une photo de trou · **Conditions** : `flag('sanglier_embleme')`
**LÉA** *(L'Écho — sourire — elle a titré, elle est contente du titre)*
« Vous confirmez ? « Le sanglier a marqué contre son camp », c'est ma Une de dimanche, et Dupuis veut le mettre sur le maillot. Vous posez avec le sanglier, ou avec le ballon ? »
← **Avec le sanglier** — effets : tribunes ++, direction −, relation.lea +1, set: pose_sanglier — *Tu poses avec une tête de sanglier en carton. La photo fait le tour du canton, puis du district.*
→ **Avec le ballon, sérieusement** — effets : direction +, tribunes − — *Tu poses avec le ballon. Personne ne garde cette photo-là ; celle du sanglier, si.*
**Traces** : pose_sanglier (sans Almanach) · **Réactions déclenchées** : co.re.lea_confirme (∃) · **Lu plus tard par** : ch. 20 (« LE SANGLIER A MARQUÉ CONTRE SON CAMP »), ch. 90 (mémoire de club : l'emblème)
**Épilogue** : ligne « {annee} : le sanglier est revenu. Personne ne l'a vu, tout le monde l'a entendu. »

## INTRIGUE am.pichon_150  —  Cent cinquante francs au noir
**Logline** : Le club propose cent cinquante francs par mois, au noir, et un match arrangé pour éviter la descente, cinq cents pour toi. · **Synopsis** : Pichon te glisse une enveloppe mensuelle « pour l'essence », que Gérard sort de la boîte. C'est l'amateurisme réel : illégal, tendre, universel. Puis, au printemps, quelqu'un propose un match arrangé pour éviter la descente ; Pichon refuse, toi tu décides. Si tu acceptes, le district « examine » (Roux, § am.district). La quatrième scène, un an plus tard, est le coup de fil de cinq heures : Pichon t'appelle après ton premier match ailleurs, il n'a pas regardé l'heure.
**Rôle(s)** : joueur_amateur · **Postulat(s)** : partagé · **Porteur** : pichon · **Cast** : pichon, gerard, roux, « un intermédiaire » (voix), camille · **Thème** : argent
**Saisons** : "0", "1" · **Conditions d'entrée** : `gauges.caisse <= 60` · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `enveloppe` → `enveloppe_essence` (« {annee} : cent cinquante francs par mois, pour l'essence. Gérard les sortait de la boîte pour {prenom} {nom}. ») → fin am_enveloppe, am.district, ch. 13 (Pichon : « je te payais l'essence »), ch. 15 (Roux : « les enveloppes du canton ») · `arrange` → `match_arrange` (« {annee} : un match pour ne pas descendre, arrangé. {nom} a levé le pied. ») → am.district (`if`), fin am_enveloppe, ch. 30 (fin *Le pari* variante amateur), ch. 20 · `propre` → `match_propre` → ch. 30 (trait Intègre), objectif
**Séquencier** : essence (ouverture) → arrange [in 4,8] → cinq_heures (S+1, [1,3], `requires: [essai_pro]` ou changement de club).

### SCÈNE am.pichon_150.essence  —  Pour l'essence
**Rôle** : joueur_amateur · **Intrigue** : am.pichon_150 · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : l'arrière de la boulangerie, cinq heures et demie, l'enveloppe sur le pétrin · **Conditions** : —
**PICHON** *(boulanger, président — neutre — de la farine sur l'enveloppe)*
« Le pain, c'est à cinq heures, et le foot, c'est après ; entre les deux, cent cinquante francs par mois pour l'essence, que personne ne voie. Tu prends, ou tu prends le car ? »
← **Je prends, pour l'essence** — effets : caisse ++, direction +, set: enveloppe_essence, outcome: enveloppe — *Tu prends. Gérard note « essence » dans la boîte. Il souligne.*
→ **Je prends le car** — effets : caisse −, tribunes +, relation.pichon +1, outcome: propre — *Tu prends le car. Pichon te donne le pain de la veille à la place ; il pèse plus lourd.*
**Traces** : enveloppe_essence · **Réactions déclenchées** : am.re.gerard_souligne (§ 7) · **Lu plus tard par** : am.pichon_150.arrange (variante), fin am_enveloppe, am.district, ch. 13, ch. 15

### SCÈNE am.pichon_150.arrange  —  Le match arrangé
**Rôle** : joueur_amateur · **Intrigue** : am.pichon_150 · **Étape** : 2/4 · **Moment** : [4,8], au printemps, quand la descente menace · **Lieu** : la buvette après l'entraînement, un homme que personne ne connaît, une enveloppe plus épaisse · **Conditions** : —
**UN INTERMÉDIAIRE** *(voix sans portrait — il parle à Pichon, mais il te regarde)*
« Dimanche, si vous perdez contre eux, ils se maintiennent, et vous vous maintenez au match d'après, c'est calculé ; cinq cents francs par joueur. Le président a dit non ; toi, tu dis quoi ? »
← **Je dis non aussi** — effets : tribunes +, vestiaire +, caisse −, set: match_propre, relation.pichon +1, outcome: propre — *Tu dis non. Pichon te donne une baguette de plus. Vous perdez dimanche, honnêtement, et vous vous maintenez quand même.*
→ **Cinq cents, pour moi** — effets : caisse +++, direction −−, set: match_arrange, outcome: arrange — *Tu lèves le pied. Vous perdez. Deux semaines plus tard, le district « examine » ; Roux a une photo de la buvette.*
Variante `flag('enveloppe_essence')` : « Cinq cents francs par joueur, et je sais que le club vous en donne cent cinquante pour l'essence, donc on est entre gens qui comprennent. Le président a dit non ; et toi ? »
**Traces** : match_arrange, match_propre · **Réactions déclenchées** : am.re.pichon_baguette (§ 7) · **Lu plus tard par** : am.district (`if: flag('match_arrange')`), fin am_enveloppe (epitaph_plus), ch. 30 (fin *Le pari*, variante amateur : « cinq cents francs »), ch. 20 (« LE MAINTIEN À CINQ CENTS FRANCS »), ch. 15 (Roux, dossier)

### SCÈNE am.pichon_150.cinq_heures  —  Le coup de fil de cinq heures
**Rôle** : joueur_amateur | joueur · **Intrigue** : am.pichon_150 · **Étape** : 3/4 · **Moment** : saison suivante, [1,3], après un changement de club (amateur ailleurs, ou pro) · **Lieu** : ta chambre, cinq heures du matin, le téléphone · **Conditions** : `club changé || role == 'joueur'`
**PICHON** *(boulanger — sourire — il n'a pas regardé l'heure ; il a la radio du fournil derrière lui)*
« Le pain, c'est à cinq heures, et je t'ai vu hier, enfin, entendu à la radio, tu as joué là-bas. Tu reviens manger un croissant dimanche, ou tu es trop loin maintenant ? »
← **Dimanche, un croissant** — effets : tribunes +, relation.pichon +1, set: croissant_promis — *Tu y vas. Le village te regarde comme quelqu'un d'ailleurs. Pichon te donne deux croissants ; il compte mal, exprès.*
→ **Trop loin, Roger** — effets : direction +, relation.pichon −1 — *Il dit « je comprends ». Il ne rappelle plus à cinq heures ; il rappelle à cinq heures et demie, une fois par an.*
**Traces** : croissant_promis (sans Almanach) · **Réactions déclenchées** : co.re.camille_journal (∃) · **Lu plus tard par** : Carte Destin joueur → président amateur (ch. 30 : « le club de ton enfance » ; variante Pichon si `croissant_promis`), ch. 02 (retrouvailles Pichon)
**Épilogue** : ligne « {annee} : cent cinquante francs pour l'essence. On ne l'a jamais écrit ; on le savait. »

## INTRIGUE am.montbeliac  —  L'enveloppe du club voisin
**Logline** : Montbéliac paie ses joueurs trois cents francs le match, en liquide, et les tiens partent. · **Synopsis** : Le voisin achète. D'abord Karim, puis les jumeaux. On te propose la même chose ; tu pars, tu restes, ou tu proposes à Dédé qu'on paie aussi (et c'est Gérard qui devra sortir la boîte). Une inspection peut suivre. La dernière scène est le derby contre eux, avec ceux qui sont partis en face.
**Rôle(s)** : joueur_amateur · **Postulat(s)** : partagé · **Porteur** : dede · **Cast** : dede, gerard, « Montbéliac » (voix), « Karim » (voix), roux, dupuis · **Thème** : tribune
**Saisons** : "1", "2+" · **Conditions d'entrée** : `flag('voisin_appelle') || gauges.caisse <= 45 || season >= 1` · **Rejouabilité** : replay {after: 2, max: 2}
**Issues** → **Traces** → **Qui les lit** : `paie_aussi` → `montbeliac_cash` (déjà déclarée par le script ; ici c'est la version « nous aussi » : ligne « {annee} : le village a payé aussi. Trois cents francs, sortis de la boîte. ») → fin am_enveloppe, ch. 15 (Roux), ch. 13 · `propre` → `village_propre` → ch. 30 (trait Intègre), fin am_toro (epitaph_plus « les copains partis ») · `part` → `passe_a_montbeliac` (déjà déclarée)
**Séquencier** : karim (ouverture) → dede [in 2,4] → inspection [in 3,8] (`montbeliac_cash`) → derby (S+1 ou [12,16]).

### SCÈNE am.montbeliac.karim  —  Karim est parti
**Rôle** : joueur_amateur · **Intrigue** : am.montbeliac · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : le vestiaire, le casier de Karim vide, un mot scotché dessus · **Conditions** : —
**DÉDÉ** *(coach bénévole — noir — il décolle le mot, il le lit deux fois)*
« Bon, on va pas se mentir : Montbéliac paie trois cents francs le match en liquide, Karim a signé hier et les jumeaux hésitent. Toi, ils t'ont appelé aussi ? »
← **Ils m'ont appelé, j'ai dit non** — effets : tribunes ++, vestiaire +, caisse −, set: montbeliac_refuse — *Tu as dit non. Dédé remet le mot de Karim dans sa poche. Il le gardera jusqu'au derby.*
→ **Ils m'ont appelé, j'écoute** — effets : caisse +, vestiaire −−, direction −, set: montbeliac_ecoute — *Tu écoutes. Les jumeaux t'écoutent écouter. Le mardi, il manque trois joueurs au toro.*
Variante `flag('pichon_reprend')` (ch. 02) : « Bon, on va pas se mentir : depuis que Pichon a repris les clés, tu joues chez l'ennemi, tout le monde le sait ; alors tu viens me dire quoi, dans mon vestiaire ? » — ← **Que je reviens** — vestiaire +, tribunes +, caisse −− — *Il ne dit rien. Il te tend un maillot marron ; il sent la naphtaline.* · → **Que Karim est bien là-bas** — vestiaire −−, caisse + — *Il te montre la porte. Poliment ; c'est pire.*
Variante `flag('intérim_montbeliac')` : « Bon, on va pas se mentir : tu bosses déjà chez eux, à l'intérim, et maintenant ils veulent tes crampons aussi. Ils t'ont appelé ? »
**Traces** : montbeliac_refuse, montbeliac_ecoute · **Réactions déclenchées** : — · **Lu plus tard par** : am.montbeliac.dede, am.montbeliac.derby

### SCÈNE am.montbeliac.dede  —  On paie aussi ?
**Rôle** : joueur_amateur · **Intrigue** : am.montbeliac · **Étape** : 2/4 · **Moment** : [2,4] · **Lieu** : la buvette fermée, Gérard, la boîte en fer, Dédé qui ne veut pas regarder la boîte · **Conditions** : —
**GÉRARD** *(bénévole, trésorier — neutre — il a compté avant que tu arrives, il connaît le chiffre)*
« Ici, on payait en bières, et Dédé voudrait qu'on paie en francs comme Montbéliac, il y a de quoi pour six matchs. Tu lui dis qu'on paie, ou tu lui dis qu'on reste propres et qu'on descend ? »
← **On paie aussi** — effets : vestiaire ++, caisse −, direction −, set: montbeliac_cash, outcome: paie_aussi — *La boîte s'ouvre. Les jumeaux restent. Six matchs plus tard, la boîte est vide et personne ne l'a dit.*
→ **On reste propres** — effets : vestiaire −−, tribunes +, set: village_propre, outcome: propre — *Les jumeaux partent. Vous jouez à neuf et demi ; le fils Dupuis compte pour un demi, encore.*
**Traces** : montbeliac_cash, village_propre · **Réactions déclenchées** : am.re.gerard_souligne (§ 7) · **Lu plus tard par** : am.montbeliac.inspection, fin am_enveloppe, ch. 13, ch. 15 (Roux), ch. 30 (trait Intègre)

### SCÈNE am.montbeliac.inspection  —  L'inspection
**Rôle** : joueur_amateur · **Intrigue** : am.montbeliac · **Étape** : 3/4 · **Moment** : [3,8] · **Lieu** : la buvette, un inspecteur du travail (voix), Gérard qui a « perdu » la boîte · **Conditions** : `flag('montbeliac_cash')` · rand 30 % à l'ouverture (sinon l'étape est sautée : `chance: 0.3`)
**ROUX** *(président du district — neutre — il a un dossier bleu, il ne l'ouvre pas)*
« Le district, c'est la base, et la base a reçu une lettre : des joueurs payés en liquide, à Boisnoir comme à Montbéliac. Vous témoignez pour votre club, ou vous ne savez rien ? »
← **Je ne sais rien** — effets : vestiaire ++, direction −, parole −1, set: roux_menti — *Tu ne sais rien. Roux ferme le dossier bleu ; il en a un rouge aussi, il ne l'ouvre pas non plus.*
→ **Je témoigne** — effets : direction ++, vestiaire −−−, caisse −, set: roux_temoin — *Tu témoignes. Le district suspend les deux clubs un match. Le village ne te parle plus ; Montbéliac non plus, et c'est tout ce qui te reste.*
**Traces** : roux_menti, roux_temoin (« {annee} : {prenom} {nom} a témoigné devant le district. Boisnoir et Montbéliac, un match chacun. ») · **Réactions déclenchées** : — · **Lu plus tard par** : am.district (variante « tu as déjà vu Roux »), ch. 15 (Roux : « vous aviez témoigné »), ch. 02 (Roux, retrouvailles), fin am_enveloppe

### SCÈNE am.montbeliac.derby  —  Karim en face
**Rôle** : joueur_amateur · **Intrigue** : am.montbeliac · **Étape** : 4/4 · **Moment** : [12,16] ou saison suivante · **Lieu** : le rond central, Karim en vert, il ne te regarde pas au tirage au sort · **Conditions** : —
**KARIM** *(voix sans portrait — il porte le maillot des Sangliers, le brassard aussi)*
« Trois cents francs, et un brassard, et un boulot à la mairie ; je t'avais dit de venir. Tu me tacles comme un ancien, ou comme un copain ? »
← **Comme un ancien** — effets : tribunes ++, vestiaire +, force +1, rand: [{p: 0.2, direction −−, set: carton_karim}, {}] — *Tu le tacles. Il se relève ; il te dit « ça va » ; ce n'est pas vrai, et tu gagnes.*
→ **Comme un copain** — effets : vestiaire −, tribunes −, relation.dede −1 — *Tu le laisses passer une fois. Il marque. Dédé enlève sa casquette et la remet, deux fois.*
Variante `flag('dupuis_chez_montbeliac')` (ch. 02) : « Trois cents francs, un brassard, et Dupuis dans le dos, il a changé de dos ; tu me tacles comme un ancien, ou comme un copain ? »
**Traces** : carton_karim (sans Almanach) · **Réactions déclenchées** : co.re.vecchio_garde (∃) · **Lu plus tard par** : co.derby (variante amateur, ch. 10 § 6.24 : Karim revient « tu te souviens de moi ? » si tu changes de club), ch. 90 (mémoire)
**Épilogue** : ligne « {annee} : Montbéliac a acheté trois joueurs à {ville}. En liquide, en vert. »

## INTRIGUE am.district  —  La commission du samedi matin
**Logline** : L'arbitre était le beau-frère de leur président ; tu le lui as dit ; le district te convoque. · **Synopsis** : Une insulte (ou une chaise, ou un match arrangé) et te voilà à la commission de discipline du district, salle des mariages de la mairie, un samedi matin. Roux préside, Pichon te défend, Léa attend dehors. Trois matchs, une amende, ou la radiation si tu recommences. C'est le premier pied du joueur dans les instances : il apprend que le district « examine ».
**Rôle(s)** : joueur_amateur · **Postulat(s)** : partagé · **Porteur** : roux · **Cast** : roux, pichon, lea, dede, colline (variante « l'arbitre de la vidéo », `year >= 2007`) · **Thème** : instances
**Saisons** : "1", "2+" · **Conditions d'entrée** : `flag('match_arrange') || flag('momo_couvert') || flag('carton_karim') || gauges.direction <= 35` · **Rejouabilité** : replay {after: 2, max: 2}
**Issues** → **Traces** → **Qui les lit** : `sanction` → `district_sanction` (« {annee} : trois matchs de suspension pour {prenom} {nom}. Le district a examiné. ») → fin am_touche, ch. 15 (Roux), ch. 02 · `radie` → `radie_district` → fin am_enveloppe (variante), ch. 30, ch. 90 (mémoire) · `relaxe` → `district_relaxe` → objectif, ch. 15
**Séquencier** : convocation (ouverture) → salle_des_mariages [in 1,3] → lea_dehors [in 0,1] → recidive (S+1, `plays >= 1`).

### SCÈNE am.district.convocation  —  La lettre du district
**Rôle** : joueur_amateur · **Intrigue** : am.district · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : la boulangerie, une lettre à en-tête, Pichon qui la tient avec deux doigts farineux · **Conditions** : —
**PICHON** *(boulanger, président — neutre — il lit l'en-tête, pas la lettre)*
« Le pain, c'est à cinq heures, et la commission du district, c'est samedi à dix, salle des mariages ; tu es convoqué. Je viens te défendre, ou tu y vas seul et tu dis la vérité ? »
← **Venez me défendre** — effets : direction +, tribunes +, relation.pichon +1, set: pichon_defend — *Il vient. Il apporte des croissants pour la commission ; Roux en prend un, puis se reprend.*
→ **J'y vais seul** — effets : direction −, vestiaire +, set: seul_district — *Tu y vas seul. La salle des mariages sent la cire. Roux te vouvoie comme on vouvoie un dossier.*
**Traces** : pichon_defend, seul_district · **Réactions déclenchées** : — · **Lu plus tard par** : am.district.salle_des_mariages (variantes)

### SCÈNE am.district.salle_des_mariages  —  Le district examine
**Rôle** : joueur_amateur · **Intrigue** : am.district · **Étape** : 2/4 · **Moment** : [1,3] · **Lieu** : la salle des mariages de la mairie, une table en U, Roux au milieu, un vase de fleurs en plastique · **Conditions** : —
**ROUX** *(président du district — neutre — il a le dossier bleu, il l'ouvre cette fois)*
« Le district, c'est la base, et la base a lu le rapport de l'arbitre, votre phrase y est en entier. Vous la maintenez, ou vous présentez vos excuses à l'arbitre, qui est là, derrière vous ? »
← **Je maintiens** — effets : tribunes ++, direction −−, set: district_sanction, outcome: sanction — *Trois matchs. Roux écrit lentement. L'arbitre, derrière toi, dit qu'il a « vu » ; tout le monde a vu.*
→ **Je m'excuse** — effets : direction ++, tribunes −, vestiaire −, set: district_relaxe, outcome: relaxe — *Un match avec sursis. L'arbitre te serre la main ; c'est le beau-frère, en effet, et il a des mains de boucher.*
Variante `flag('match_arrange')` : « Le district, c'est la base, et la base a une photo de la buvette avec un homme que personne ne connaît, et vous à côté. Vous l'avez connu combien de temps, cet homme ? » — ← **Cinq minutes, il partait** — direction −, parole −1, set: district_sanction — *Six matchs. Roux ferme le dossier ; il en garde une copie « pour la Ligue ».* · → **Assez pour dire non** — direction +, tribunes +, set: district_relaxe — *Relaxe. Pichon, derrière, souffle. Le vase en plastique aussi, on dirait.*
Variante `flag('roux_temoin')` : « Le district, c'est la base, et vous avez déjà témoigné ici, on s'en souvient. Cette fois c'est vous le dossier : vous maintenez ? » — mêmes sorties, la gauche donne direction − seulement (Roux est indulgent avec un ancien témoin).
**Traces** : district_sanction, district_relaxe · **Réactions déclenchées** : am.re.lea_marches (§ 7) · **Lu plus tard par** : fin am_touche, ch. 15 (Roux : « vous avez maintenu »), ch. 02 (Roux, paliers), ch. 30 (Carte Destin amateur → président amateur : « tu connais la salle des mariages »)

### SCÈNE am.district.recidive  —  La deuxième convocation
**Rôle** : joueur_amateur · **Intrigue** : am.district · **Étape** : 3/4 · **Moment** : saison suivante, `plays() >= 1` · **Lieu** : la même salle, le même vase, Roux qui ne se lève pas · **Conditions** : `flag('district_sanction')`
**ROUX** *(président du district — noir — il n'ouvre pas le dossier, il le connaît)*
« Le district, c'est la base, et la base ne convoque pas deux fois le même nom sans conséquence, c'est la radiation qui est à l'ordre du jour. Vous avez quelque chose à dire, ou quelqu'un pour le dire à votre place ? »
← **Je n'ai rien à dire** — effets : direction −−−, tribunes +, set: radie_district, outcome: radie — *Radié un an. Tu joues au foot en salle, le jeudi, avec Momo. Le district ne va pas au foot en salle.*
→ **Pichon parle pour moi** — effets : direction −, tribunes −, relation.pichon +1, set: district_sanction — *Pichon parle. Six matchs. Roux mange le croissant, cette fois, en entier.*
**Traces** : radie_district (« {annee} : radié un an par le district. {prenom} {nom} a joué en salle, le jeudi. ») · **Réactions déclenchées** : — · **Lu plus tard par** : fin am_enveloppe (variante radiation), ch. 30 (Carte Destin amateur → entraîneur amateur : « radié comme joueur, pas comme coach »), ch. 90 (mémoire)
**Épilogue** : ligne « {annee} : le district a examiné {nom}. Un samedi matin, salle des mariages. »

## INTRIGUE am.genou_21  —  Le genou à vingt et un ans  **[drame]**
**Logline** : Un tacle dans un trou de sanglier, un genou qui fait un bruit, et vingt et un ans. · **Synopsis** : Le drame du rôle, sobre, une fois par carrière, jamais en S0. Le médecin du canton envoie à l'hôpital de la ville ; le verdict tombe en deux cartes : les croisés, et à ce niveau, sans centre de rééducation, c'est fini, ou presque. Dédé propose son sifflet (reconversion précoce : entraîneur amateur à vingt et un ans), Roux propose l'école d'arbitrage (une voix, une ligne : le rôle d'arbitre n'existe pas encore), Camille propose autre chose que le foot. La dernière scène est un choix de vie, pas de jauge.
**Rôle(s)** : joueur_amateur · **Postulat(s)** : partagé · **Porteur** : dede · **Cast** : dede, camille, roux, gerard, « le médecin du canton » (voix) · **Thème** : corps
**Saisons** : "1", "2+" · **Conditions d'entrée** : `age <= 23 && season >= 1 && !flag('genou')` · **Exclusions** : jamais juste après `am.district` ni `co.camille_naissance` (règle des deux drames) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `sifflet` → `genou`, `dede_sifflet` → Carte Destin amateur → entraîneur amateur (ch. 30, « reconversion précoce »), ch. 11 (Dédé adjoint), fin am_touche (epitaph_plus) · `reprend` → `genou`, `genou_amateur_reprend` → am.doudoune (exclusion : la doudoune ne revient plus), fin *Les croisés* (variante amateur) · `arrete` → `genou`, `apres_le_foot` → ch. 30 (écran « Après le foot » précoce avec bonus de compassion), ch. 01 (Camille : « il a arrêté pour de bon »)
**Séquencier** : bruit (ouverture, sans choix : une sortie) → hopital [in 1,2] → sifflet [in 2,4].

### SCÈNE am.genou_21.bruit  —  Le bruit
**Rôle** : joueur_amateur · **Intrigue** : am.genou_21 · **Étape** : 1/3 · **Moment** : ouverture tirée · **Lieu** : la pelouse, la pluie, Dédé agenouillé, le match arrêté · **Conditions** : —
**DÉDÉ** *(coach bénévole — neutre — il ne dit pas « on va pas se mentir » ; il tient ta jambe droite)*
« Ne bouge pas, petit. Gérard appelle le médecin, et on attend, et tu ne bouges pas. »
**Une sortie** — **J'attends** — effets : force −4, set: genou, set: genou_amateur — *Le match reprend sans toi. Il pleut sur les autres. Personne ne fait de blague.*
**Traces** : genou (∃), genou_amateur · **Réactions déclenchées** : — (jamais de réaction après un drame) · **Lu plus tard par** : am.genou_21.hopital, ch. 30, ch. 01 (Camille)

### SCÈNE am.genou_21.hopital  —  L'hôpital de la ville
**Rôle** : joueur_amateur · **Intrigue** : am.genou_21 · **Étape** : 2/3 · **Moment** : [1,2] · **Lieu** : un couloir d'hôpital, Camille sur une chaise, un médecin (voix) avec une radio · **Conditions** : —
**LE MÉDECIN DU CANTON** *(voix sans portrait — il tient la radio contre le néon)*
« Les croisés, et le ménisque avec, et à votre niveau il n'y a pas de centre pour ça, il y a du repos et de la chance. Vous voulez que je vous dise le vrai délai, ou une saison ? »
← **Le vrai délai** — effets : direction +, tribunes −, set: verite_genou — *Il dit dix-huit mois, s'il n'y a rien d'autre. Camille prend ta main ; elle a entendu « rien d'autre ».*
→ **Dites-moi une saison** — effets : tribunes +, force −2, set: espoir_genou — *Il dit « une saison ». Il ne te regarde pas en le disant. Camille le regarde, lui.*
**Traces** : verite_genou, espoir_genou (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : am.genou_21.sifflet (variantes)

### SCÈNE am.genou_21.sifflet  —  Le sifflet de Dédé
**Rôle** : joueur_amateur · **Intrigue** : am.genou_21 · **Étape** : 3/3 · **Moment** : [2,4] · **Lieu** : le banc de touche, la planche sur ses parpaings, ta béquille appuyée dessus · **Conditions** : —
**DÉDÉ** *(coach bénévole — sourire — il enlève le sifflet de son cou, lentement, comme un objet qui a un poids)*
« Bon, on va pas se mentir : tes genoux, c'est fini, ou c'est dix-huit mois, ce qui est fini aussi à ton âge. Mon sifflet, il est à toi ; tu le prends, ou tu attends la chance ? »
← **Je prends le sifflet** — effets : direction ++, vestiaire +, tribunes −, set: dede_sifflet, outcome: sifflet — *Tu le prends. Il pèse rien. Le mardi suivant, c'est toi qui siffles la fin ; les jumeaux obéissent, pour voir.*
→ **J'attends la chance** — effets : tribunes +, force −1, set: genou_amateur_reprend, outcome: reprend — *Tu attends. Dix-huit mois, puis un match, puis un autre bruit, plus petit. Tu joues, moins ; tu joues.*
Variante `flag('verite_genou') && relation.camille >= 1` : troisième chemin (la droite devient) **J'arrête, et je rentre** — effets : tribunes −, direction −, relation.camille +2, set: apres_le_foot, outcome: arrete — *Tu arrêtes. Camille conduit. Le village te fait une photo au bar ; elle est à l'endroit.*
**Traces** : dede_sifflet, genou_amateur_reprend, apres_le_foot (« {annee} : {prenom} {nom} a arrêté à vingt et un ans. Le genou avait parlé le premier. ») · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 30 (Carte Destin « reconversion précoce » ; écran « Après le foot »), ch. 11 (Dédé : « je t'ai donné mon sifflet »), fin am_touche (epitaph_plus), ch. 01 (Camille, palier +3 variante)
**Épilogue** : ligne « {annee} : à vingt et un ans, un genou. Le village a arrêté de faire des blagues pendant une semaine. »

---

## 3. POSTULAT `pepite` — La pépite du club-usine

**Rôle** : `joueur` · **Index** : 2 · **Année** : 1990 · **Club** : D2, « l'usine » (le pitch dit Étoile Bretagne ; le texte dit l'usine) · **Jauges** : vestiaire 50, tribunes 80, direction 50, caisse 45 (intouchables) · **Force** : 58 · **Âge** : 19 · **Président narratif** : `fardelli` · **Drapeaux** : `[pepite]` (enfin posé) · **Objectif de saison** : la montée (72 points) ou le barrage.
**Pitch** : Tout le monde veut te vendre. Toi, tu veux jouer.
**Question de saison** : `prix` / `terrain` / `maison` (poids 1,0 chacun).
**Cast** (spec § 4.3, conservé) : fardelli (vendeur 2,5), aulard (le prix 2), brehaut (le capitaine qui te teste 2), mbako (le prodige d'après 1,5), vecchio (1), lea (1,5), gege (tifo 1,5), sabatier (1), camille (0,5), vukic (1), meneche (0,5), nassir (0,5), mere_mbako (0,5), josiane (chœur 1), rouvier (0,5), dembo (le coéquipier rival 1, ajout de la charte).
**Programme** : "0" prendre 3, fenêtre [2,9], réserve 1 : jp.tifo (signature, `if: gauges.tribunes >= 65`, poids 1,2), jp.brassard_test (1,3), co.mbako_rival (1,2), jp.premiere_une (1,0), jp.contrat_image (`if: gauges.caisse >= 45`), jp.selection (`if: gauges.tribunes >= 55`), jp.banc_hiver (`if: world.serie_defaites >= 1 || gauges.direction < 40`), jp.conseils_gigi (ritual), jp.camille_bac, jp.dembo_rival, co.pharmacie (`if: relation.sabatier >= 1`) · "1" prendre 3, reprise : jp.genou_20, jp.clause, jp.exil_dore (`if: vars.nassir_palier >= 1 || year >= 1999`), co.derby · "2+" prendre 4, reprise : jp.coach_qui_te_veut (`requires: [banc_bosse]`), jp.retour_usine (`requires: [vendu_d1]`, replay), jp.brassard_20 (`if: relation.brehaut >= 2 || flag('capitaine')`), jp.pari (`if: gauges.caisse < 45`), jp.conseils_gigi.
**Objectifs cachés** : `pepite_destination` — *Choisir sa destination* (`flag('vendu_d1') && flag('sans_agent')` ; indice : « Un agent choisit pour toi. Sauf si tu n'en as pas. ») · `pepite_enfant_du_club` — *L'enfant du club* (`flag('enfant_du_pays') && flag('fidele') && stats.saisons >= 3` ; indice : « Vingt mètres de bâche, ça engage. ») · `pepite_brassard_22` — *Le brassard avant vingt-deux ans* (`flag('capitaine') && age <= 22` ; indice : « Bréhaut a un genou. Et un brassard. »).
**alarm_override** : `tribunes.high` → `jp.pepite.alarme_tifo_lea` (Léa : « Vous confirmez ? La tribune a peint votre nom, et le président a peint un prix dessous. ») tant que `arc('jp.tifo') != 'done'` · `caisse.low` → `jp.pepite.alarme_fardelli_avance` (Fardelli : « Mon ami, une avance sur ton prochain transfert, ça ne s'appelle pas un prêt. »).

### Le script `jp.pepite.club_usine`

### SCÈNE jp.pepite.p1_valeur  —  La valeur
**Rôle** : joueur · **Intrigue** : jp.pepite.club_usine · **Étape** : 1/9 · **Moment** : saison 0, slot 1 · **Lieu** : le parking de l'usine, la voiture de Fardelli, moteur allumé, un journal plié sur le tableau de bord · **Conditions** : —
**FARDELLI** *(agent — neutre — il baisse la vitre à moitié ; il ne t'invite pas à monter)*
« Tu vaux trois millions ce matin, {toi}, quatre ce soir si tu marques. Mon ami, on parle d'argent ou d'amitié : je te représente à dix pour cent, et on choisit ensemble où tu joues. »
← **Dix pour cent, on est amis** — effets : direction +, caisse +, relation.fardelli +1, set: agent_fardelli — *Il monte la vitre. Le contrat est déjà signé de sa main ; il manque la tienne, en bas, là où il tapote.*
→ **Je choisis seul où je joue** — effets : direction −, tribunes +, relation.fardelli −1, set: sans_agent — *Il remonte la vitre plus vite. « Trois millions sans agent, ça fait deux et demi », dit-il au pare-brise.*
Variante `fil_rouge == 'prix'` : « Tu vaux trois millions ce matin, quatre ce soir si tu marques, six en janvier si tu ne te blesses pas. Mon ami, on parle d'argent ou d'amitié : je compte, et toi tu cours. » · Variante `fil_rouge == 'terrain'` : « Tu vaux trois millions, mais un joueur qui veut jouer vaut moins qu'un joueur qui veut partir, c'est le marché. Mon ami, on parle d'argent ou d'amitié : je vends, et toi tu joues où on te vend. » · Variante `fil_rouge == 'maison'` : « Tu vaux trois millions, et ta mère a demandé si on pouvait te vendre près de la maison ; on ne vend pas près, on vend cher. Mon ami, on parle d'argent ou d'amitié ? »
Variante `flag('rapport_trop_lent')` (ch. 02) : « Trois millions, dit Fardelli ; trop lent, dit Barbier, dans un rapport que tout le monde a lu. Mon ami, on parle d'argent ou d'amitié : moi je vends les lents aussi, un peu moins cher. » · Variante `flag('rancune_valdorne')` : « Tu vaux trois millions, avec un an de retard, parce que la doudoune ne t'avait pas rappelé. Mon ami, on parle d'argent ou d'amitié : cette fois, c'est moi qui rappelle. » · Variante `flag('agent_fardelli')` (venu de `lache_academie`) : un bouton — **On continue, Rocco** — direction +, relation.fardelli +1 — *Il ne monte pas la vitre. Il te dit le chiffre ; il l'avait depuis Valdorne.*
**Traces** : agent_fardelli, sans_agent (« {annee} : {prenom} {nom} a dit non à Fardelli. Trois millions sont devenus deux et demi. ») · **Réactions déclenchées** : jp.re.aulard_quatre_millions (§ 7) · **Lu plus tard par** : jp.pepite.p2_hiver, jp.pepite.p3_vente, jp.contrat_image (`if: flag('agent_fardelli')`), jp.clause, objectif `pepite_destination`, alarme caisse basse (variante), ch. 02 (Fardelli : paliers), ch. 12 (« tu as été mon client »)

### SCÈNE jp.pepite.p2_hiver  —  Le mercato d'hiver
**Rôle** : joueur · **Intrigue** : jp.pepite.club_usine · **Étape** : 2/9 · **Moment** : saison 0, [10,11] · **Lieu** : le bureau d'Aulard, un fax qui crache, Josiane qui ramasse · **Conditions** : —
**AULARD** *(président — neutre — il lit le fax debout, il ne s'assoit jamais en janvier)*
« Une offre de janvier, {toi}, un club de D1 qui paie maintenant et prend en juin. J'ai pas le temps, j'ai une usine : tu dis oui ce soir, ou tu finis la saison ici et je vends plus cher ? »
← **Oui ce soir** — effets : caisse ++, direction +, tribunes −−, set: vente_janvier — *Il signe le fax. Josiane le classe sous « janvier », le dossier le plus épais du club.*
→ **Je finis la saison ici** — effets : tribunes ++, direction −, force +1, set: finit_saison — *Il déchire le fax. Il en a une copie ; à l'usine, on a toujours une copie.*
Variante `fil_rouge == 'maison'` : « Une offre de janvier, d'un club de D2 à trente kilomètres de chez ta mère, et une autre de D1 à six cents. J'ai pas le temps, j'ai une usine : la maison, ou la carrière ? » — ← **La maison** — tribunes +, caisse −, set: enfant_du_pays_hiver — *Il note « maison » sur le fax. Il ne comprend pas ce mot-là ; il le note quand même.* · → **La carrière** — caisse ++, tribunes − — *Ta mère l'apprend par L'Écho. Elle raccroche en soupirant très fort.*
Variante `flag('international')` : « Une offre de janvier, {toi}, et depuis que tu joues en bleu cobalt le prix a doublé. J'ai pas le temps, j'ai une usine : on vend à Capitale FC ce soir, ou on attend le Continental ? » — mêmes sorties, la gauche donne caisse +++ (le seul +++ du script).
Variante `flag('enfant_du_pays')` (jp.tifo) : « Une offre de janvier, et une bâche de vingt mètres à ton nom dans la Tribune Nord qui dit le contraire. J'ai pas le temps, j'ai une usine : tu pars sous la bâche, ou tu restes dessous ? » — ← **Je pars sous la bâche** — caisse ++, tribunes −−−, parole −2, relation.gege −2, set: vente_janvier — *Gégé décroche la bâche lui-même. Il la plie. Il ne la jette pas.* · → **Je reste dessous** — tribunes ++, direction −, parole +1, set: finit_saison — *La bâche reste. Aulard fait repeindre le prix sur le panneau d'affichage, à côté.*
**Traces** : vente_janvier, finit_saison, enfant_du_pays_hiver · **Réactions déclenchées** : co.re.josiane_a_lu (∃, `!seen`) · **Lu plus tard par** : jp.pepite.p3_vente (variantes), ch. 20 (« VENDU EN JANVIER, LIVRÉ EN JUIN »)

### SCÈNE jp.pepite.p3_vente  —  La vente
**Rôle** : joueur · **Intrigue** : jp.pepite.club_usine · **Étape** : 3/9 · **Moment** : saison 0, slot 17 (remplace le dernier virage) · **Lieu** : le bureau d'Aulard, trois fax alignés, Fardelli debout derrière ta chaise, ou personne · **Conditions** : —
**AULARD** *(président — neutre — il pousse les trois fax vers toi, un à un, comme des cartes)*
« L'usine a besoin d'une vente par an, et cette année c'est toi ; j'ai pas le temps, j'ai un empire à faire tourner. Le grand club, ou rester ici un an pour le prix, ou l'or de Nassir : où ? »
← **Le grand club, en D1** — effets : caisse ++, tribunes −, direction +, set: vendu_d1, club: {change: true, division: 1}, outcome: vendu — *Tu signes le fax du milieu. Josiane tamponne. L'usine achète un jeune avec ton prix ; il a seize ans et une mère.*
→ **Je reste, encore un an** — effets : tribunes ++, direction −−, caisse −, set: fidele, outcome: fidele — *Il range les fax. Il dit « l'an prochain », et l'an prochain, à l'usine, c'est toujours cette année.*
Variante `flag('enfant_du_pays') && gauges.tribunes >= 70` (première vraie) : la droite devient **Je reste, la bâche a raison** — tribunes +++, direction −, set: fidele, set: enfant_du_pays, parole +1 — *Gégé repeint la bâche en doré. Aulard repeint le prix, plus gros.*
Variante `vars.nassir_palier >= 1 || year >= 1999` : troisième chemin, la gauche devient **L'or de Nassir** — caisse +++, tribunes −−, force −1, set: exil_dore, club: {change: true, division: 0}, outcome: exil — *Tu signes en écus avant l'heure. Nassir dit que tu n'es pas un joueur, tu es un actif ; il le dit gentiment.*
Variante `flag('vente_janvier')` : un bouton — **Je pars, c'est signé** — set: vendu_d1, club: {change: true, division: 1} — *C'était signé en janvier. Aulard te serre la main en regardant le fax suivant.*
Variante `flag('sans_agent')` : Aulard ajoute « et sans agent, c'est toi qui lis les fax » ; la gauche pose aussi `destination_choisie` (objectif).
Variante `flag('genou_cache')` (jp.genou_20) : « Le grand club veut une visite médicale demain à huit heures, et le Doc m'a dit que ton genou avait un avis ; j'ai pas le temps, j'ai une usine. Tu y vas, ou on vend à quelqu'un qui ne regarde pas ? » — ← **J'y vais, on verra** — rand: [{p: 0.5, set: vendu_d1, club: {change: true, division: 1}}, {set: vente_annulee, tribunes −−, direction −}] — *La visite dure trois heures. Le kiné du club acheteur regarde ton genou, puis Fardelli, puis son téléphone.* · → **Vendez à qui ne regarde pas** — caisse +, direction +, set: vendu_d2, club: {change: true, division: 2} — *Tu pars pour un club de D2 qui ne regarde pas les genoux. Il regarde les prix.*
**Traces** : vendu_d1 (« {annee} : {prenom} {nom}, {prix} millions et un aller simple. L'usine a acheté un gamin avec. »), fidele (∃), exil_dore, vente_annulee, vendu_d2, destination_choisie · **Réactions déclenchées** : jp.re.lea_aller_simple (§ 7) · **Lu plus tard par** : jp.pepite.s1_premier_jour, jp.retour_usine (`requires: [vendu_d1]`), une.pepite.aller_simple, une.pepite.enfant_reste, objectif `pepite_destination`, ch. 12 (le prix de référence), ch. 30 (Carrefour ; fin jp_exil), ch. 90 (mémoire de l'usine)

### SCÈNE jp.pepite.s1_premier_jour  —  Le premier jour
**Rôle** : joueur · **Intrigue** : jp.pepite.club_usine · **Étape** : 4/9 · **Moment** : saison 1, [1,2] · **Lieu** : selon la variante · **Conditions** : —
Variante `flag('vendu_d1')` — **JOSIANE** *(secrétaire d'un autre club — neutre — elle n'est pas Madame Josiane ; c'est « la Josiane d'ici », le moteur garde le portrait, la bande dit « SECRÉTAIRE DEPUIS 1979 »)* : « Vous êtes le remplaçant du remplaçant, j'en ai vu passer, vous savez, des pépites d'usine ; le casier est au fond, celui sans nom. Vous voulez qu'on écrive le vôtre, ou vous attendez de jouer ? » — ← **Écrivez-le** — direction +, tribunes −, set: casier_nomme — *Elle l'écrit au feutre. Le feutre est presque sec ; c'est celui des remplaçants.* · → **J'attends de jouer** — vestiaire +, direction − — *Le casier reste sans nom. Au troisième match, un coéquipier y écrit « le nouveau » ; ça durera.*
Variante `flag('fidele')` — **AULARD** *(sourire — il te tend un contrat d'un an, une seule page)* : « Tu es resté, petit, alors on fait comme les grands : un an, une page, et le brassard si Bréhaut tombe. J'ai pas le temps, j'ai une usine : tu signes la page, ou tu veux lire la deuxième ? » — ← **Je signe la page** — direction ++, caisse + — *Il n'y a pas de deuxième page. Il y en aura une en juin.* · → **Je lis la deuxième** — direction −, caisse ++, set: page_lue — *La deuxième page dit « clause de vente ». Elle est à ton nom, pas au sien.*
Variante `flag('exil_dore')` — **NASSIR** *(sourire — un stade vide et climatisé, il te montre le banc)* : « Bienvenue, ce n'est pas un club, c'est un actif, et vous en êtes la ligne la plus chère. Vous voulez jouer dès samedi, ou vous reposer, c'est compris dans le contrat ? » — ← **Jouer samedi** — tribunes +, force +1 — *Tu joues devant trois mille personnes et cinquante caméras. La climatisation souffle sur la pelouse.* · → **Me reposer, c'est compris** — caisse +, force −2, tribunes − — *Tu te reposes. Le compte se remplit sans toi. Camille demande à quelle heure tu rentres ; tu ne sors pas.*
Secours — **VECCHIO** : « Nouvelle saison, même vestiaire, et moi j'ai un an de plus, j'en ai vu d'autres. Tu portes toujours les bouteilles, ou c'est fini ? » — ← **Je porte encore** — vestiaire ++ · → **C'est au nouveau** — vestiaire −, tribunes +.
**Traces** : casier_nomme, page_lue · **Réactions déclenchées** : co.re.vecchio_garde (∃) · **Lu plus tard par** : jp.clause (variante « la page deux »), set-piece `objective` joueur (ch. 30 : « le remplaçant du remplaçant »)

### SCÈNE jp.pepite.s1_retour_usine  —  Le retour à l'usine (twist)
**Rôle** : joueur · **Intrigue** : jp.pepite.club_usine · **Étape** : 5/9 · **Moment** : saison 1, [10,11] · **Lieu** : le couloir des vestiaires de l'usine, côté visiteurs, une bâche pliée dans un coin · **Conditions** : —
Variante `flag('vendu_d1')` — **GÉGÉ** *(capo — neutre ; noir si `vente_janvier` — il tient un bout de la bâche, l'ancienne, à ton nom)* : « La tribune n'oublie rien, et dimanche tu joues contre nous, avec ton nom encore sur la bâche, on ne l'a pas repeinte. Tu célèbres si tu marques, ou tu baisses la tête ? » — ← **Je baisse la tête** — tribunes ++, vestiaire −, set: tifo_adieu, relation.gege +1 — *Tu marques. Tu baisses la tête. La Tribune Nord applaudit un visiteur ; ça n'arrive qu'une fois.* · → **Je célèbre, c'est mon métier** — tribunes −−, vestiaire ++, relation.gege −2 — *Tu célèbres devant la Nord. La bâche descend pendant que tu cours. Elle est brûlée le soir, proprement.*
Variante `flag('fidele')` — **BRÉHAUT** *(capitaine — neutre — il a une liste de vente dans la main, tu es dessus)* : « Le groupe vit bien, et l'usine a besoin d'une vente, et cette année sur la liste il y a moi ou toi. Tu dis au président de me vendre, ou tu te tais ? » — ← **Vendez-moi plutôt lui** — direction +, vestiaire −−, relation.brehaut −2, set: brehaut_vendu_par_toi — *Bréhaut part en janvier. Le groupe l'apprend par le fax. Il t'en veut par le fax aussi.* · → **Je me tais** — vestiaire ++, direction −, set: fidele_deux — *Tu te tais. Il te serre l'épaule, un peu trop fort ; c'est sa façon de dire merci.*
Variante `flag('exil_dore')` — **CAMILLE** *(neutre — au téléphone, le décalage horaire dans la voix)* : « Tu rentres à quelle heure, enfin, tu rentres quel mois ? L'usine joue la Coupe dimanche, Léa a écrit que « l'enfant du pays regarde de loin ». Tu prends l'avion pour le match, ou tu regardes de loin ? » — ← **Je prends l'avion** — tribunes +, caisse −, relation.camille +1 — *Tu es en tribune. Gégé te voit ; il ne dit rien ; c'est déjà ça.* · → **Je regarde de loin** — caisse +, relation.camille −1 — *Tu regardes de loin. L'Écho met ta photo au bar de l'hôtel du désert ; c'est Léa qui l'a envoyée.*
**Traces** : tifo_adieu (« {annee} : {prenom} {nom} a marqué contre l'usine et a baissé la tête. La Nord a applaudi un visiteur. »), brehaut_vendu_par_toi, fidele_deux · **Réactions déclenchées** : co.re.gege_decoupe (∃) · **Lu plus tard par** : jp.retour_usine (variante), ch. 90 (mémoire de l'usine : +1 si `tifo_adieu`, −2 sinon), une.pepite.retour, ch. 01 (Bréhaut : « tu m'as fait vendre »)

### SCÈNE jp.pepite.s1_veille  —  La veille, la valeur
**Rôle** : joueur · **Intrigue** : jp.pepite.club_usine · **Étape** : 6/9 · **Moment** : saison 1, slot 17 · **Lieu** : la voiture de Fardelli (ou une cabine, si `sans_agent`) · **Conditions** : —
**FARDELLI** *(agent — neutre — la vitre entière baissée, cette fois ; il a un chiffre à dire)*
« Demain c'est le dernier bloc, et ta valeur ce soir tient sur un ticket : elle monte si tu joues, elle descend si tu te ménages. Mon ami, on parle d'argent ou d'amitié, alors tu fonces ? »
← **Je fonce** — effets : tribunes +, force +1, set: veille_fonce — *Il note « fonce » sur le ticket. Le ticket, c'est celui de Ménèche ; il l'a acheté.*
→ **Je me ménage** — effets : force −1, direction +, set: veille_menage — *Il note « prudent ». Il vend les prudents aussi ; à des clubs prudents.*
Variante `flag('sans_agent')` — **MÉNÈCHE** *(chroniqueur — neutre — au téléphone de la cabine, il t'a fait appeler)* : « Juste une question, hors micro : sans agent, votre valeur, c'est vous qui la fixez ou c'est le marché ? Demain, vous jouez pour vous, ou pour la cote ? » — mêmes libellés, mêmes effets.
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : set-piece `gm_annonce` joueur (ch. 30 : variante « ton agent a noté fonce »)

### SCÈNE jp.pepite.s2_rentree  —  La valeur, encore (rejouable)
**Rôle** : joueur · **Intrigue** : jp.pepite.club_usine · **Étape** : 7/9 · **Moment** : saison 2+, [1,2] · **Lieu** : la voiture de Fardelli, un modèle plus récent chaque saison · **Conditions** : —
**FARDELLI** *(agent — sourire si relation ≥ 1 — il a une nouvelle voiture et le même sourire)*
« Tu vaux {prix} millions ce matin, et dans deux ans tu en vaudras la moitié ou le double, c'est ça le métier. Mon ami, on parle d'argent ou d'amitié : on vend cet été, ou on attend ? »
← **On vend cet été** — effets : caisse ++, tribunes −, set: vente_ete — *Il sort le carnet. Trois clubs, deux pays qu'on ne nomme pas.*
→ **On attend** — effets : tribunes +, direction +, force +1 — *Il range le carnet. Il ne le ferme pas complètement.*
Variante `plays() >= 2` : « Tu vaux {prix} millions, et tu me dis « on attend » depuis deux étés ; à force d'attendre, les clubs attendent aussi. Mon ami, on parle d'argent ou d'amitié : cette fois ? »
Variante `flag('sans_agent')` — **AULARD** : « Tu vaux {prix} millions ce matin, sans agent, c'est moi qui compte pour toi. J'ai pas le temps, j'ai une usine : on vend cet été ? » — mêmes sorties.
**Traces** : vente_ete · **Réactions déclenchées** : — · **Lu plus tard par** : set-piece `bilan_contrat` (ch. 30)

### SCÈNE jp.pepite.s2_veille  —  La veille (rejouable)
**Rôle** : joueur · **Intrigue** : jp.pepite.club_usine · **Étape** : 8/9 · **Moment** : saison 2+, slot 17 · **Lieu** : le vestiaire vide, Vecchio ou son suivant, une orange · **Conditions** : —
**VECCHIO** *(gardien, puis entraîneur des gardiens dès 1995 — neutre — il épluche une orange, une seule)*
« Dernier bloc demain, et tu as {age} ans, l'âge où l'on croit que ça dure. J'en ai vu d'autres, petit : tu joues pour la Une, ou pour le vestiaire ? »
← **Pour le vestiaire** — effets : vestiaire ++, tribunes − — *Il te donne un quartier. Il en garde un pour Paulette.*
→ **Pour la Une** — effets : tribunes ++, vestiaire − — *Il mange l'orange. Toute.*
Variante `chars.vecchio.statut != 'club' && !flag('gigi_staff')` : le locuteur devient **BRÉHAUT** (« Le groupe vit bien, et demain le groupe a besoin de toi pour lui, pas pour la Une. »).
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : —

### SCÈNE jp.pepite.p9_alarme_tifo_lea  —  (alarme, `tribunes.high`)
**Rôle** : joueur · **Intrigue** : alarme (override du postulat) · **Moment** : quand TRIBUNES ≥ 85, tant que `arc('jp.tifo') != 'done'` · **Lieu** : le bureau de presse · **Conditions** : ci-dessus
**LÉA** *(attachée de presse — neutre — la Une du jour, ton nom en gros, un prix en dessous)*
« Vous confirmez ? La tribune a peint votre nom sur vingt mètres et le président a peint un prix dessous, en plus petit. Vous posez devant la bâche, ou devant le prix ? »
← **Devant la bâche** — effets : tribunes −, direction −, vestiaire + — *La photo montre la bâche. Le prix est coupé au cadrage ; Aulard le remarque.*
→ **Devant le prix** — effets : tribunes −−, direction ++ — *La photo montre le prix. Gégé la découpe et la punaise au local, côté « à ne pas oublier ».*

---

## 4. POSTULAT `fin_de_contrat` — Fin de contrat à 31 ans

**Rôle** : `joueur` · **Index** : 3 · **Année** : 1990 · **Club** : D1 · **Jauges** : vestiaire 50, tribunes 50, direction 45, caisse 60 (intouchables) · **Force** : 52 · **Âge** : 31 · **Président narratif** : `fardelli` · **Drapeaux** : `[genou]` · **Objectif de saison** : le maintien (« ne pas descendre », 38 points) ; c'est le sas vers le banc.
**Pitch** : Ton genou a un avis, ton agent en a un autre.
**Question de saison** : `genou` / `agent` / `vestiaire`.
**Cast** (spec § 4.4, conservé) : fardelli (2,5), sabatier (2), brehaut (1,5), mbako (1), vecchio (1,5), vukic / clow (1), nassir (0,5), gege (1), lea (1), meneche (1), legruet (0,5), camille (1), aulard (0,5), rouvier (1, ajout : la seconde voix du genou), fauvel (0,5, ajout : la dernière sélection).
**Programme** : "0" prendre 3, fenêtre [2,9], réserve 1 : jp.genou_parle (signature, 1,3), jp.brassard_33 (1,2), jp.diplome_joueur (`excludes: [diplome]`, 1,2), jp.maison_pays (1,0), jp.memoires (1,0), jp.vestiaire_porte (`if: gauges.vestiaire >= 65`), jp.derniere_selection (`if: flag('international') || gauges.tribunes >= 65`), co.mbako_rival (variante « papy »), jp.conseils_gigi, jp.contrat_image (variante « l'après ») · "1" prendre 3, reprise : jp.jubile (`if: gauges.tribunes >= 60`), jp.consultant, jp.pari (`if: gauges.caisse < 45`), jp.exil_dore, co.pharmacie (variante « un coup de pouce pour finir »), co.derby · "2+" prendre 4, reprise : jp.adieu (`if: age >= 34`), jp.vecchio_exemple (ritual), jp.pari, jp.conseils_gigi.
**Objectifs cachés** : `fin_saison_entiere` — *Rejouer une saison entière* (`stats.saisons >= 2 && !flag('genou_grave')` ; indice : « Le genou a toujours raison. Sauf si tu l'écoutes à temps. ») · `fin_passeur` — *Le passeur* (`role_was('joueur') && relation.vukic >= 1` ; indice : « Quelqu'un te dira ce que personne ne te dira. Écoute-le. ») · `fin_debout` — *Debout* (`flag('jubile_fait') && flag('prolonge')` ; indice : « Un jubilé, c'est une fin. Sauf si tu rejoues le lendemain. »).
**alarm_override** : `tribunes.low` → `jp.fin.alarme_gege_papy` (Gégé : « La tribune n'oublie rien, le {numero} ; elle se souvient même de quand tu courais. ») · `caisse.low` → `jp.fin.alarme_fardelli_aucune_offre` (Fardelli : « Mon ami, aucune offre, et un genou ; on parle d'argent ou d'amitié, parce que là il n'y a ni l'un ni l'autre. »).

### Le script `jp.fin.dernier_contrat`

### SCÈNE jp.fin.f1_derniere_annee  —  La dernière année
**Rôle** : joueur · **Intrigue** : jp.fin.dernier_contrat · **Étape** : 1/9 · **Moment** : saison 0, slot 1 · **Lieu** : le restaurant de Fardelli, une nappe, un contrat plié sous le cendrier · **Conditions** : —
**FARDELLI** *(agent — neutre — il coupe sa viande sans te regarder, puis il te regarde)*
« Personne ne prolonge un genou, {toi}, et le tien fait du bruit jusqu'ici. Mon ami, on parle d'argent ou d'amitié : moi, je te prolonge, pour dix pour cent de ce que je trouverai. »
← **Dix pour cent, trouve** — effets : direction +, caisse −, relation.fardelli +1, set: agent_fardelli — *Il commande un dessert pour deux. Il mange les deux.*
→ **Je trouve seul** — effets : direction −, vestiaire +, relation.fardelli −1, set: sans_agent — *Il replie le contrat sous le cendrier. « Tu as trente et un ans », dit-il ; il ne dit pas la suite.*
Variante `fil_rouge == 'genou'` : « Personne ne prolonge un genou, et le Doc a la radio dans son tiroir ; mon ami, on parle d'argent ou d'amitié, alors je te dis que j'ai demandé la radio. » (pose aussi `radio_demandee`) · Variante `fil_rouge == 'agent'` : « Personne ne prolonge un genou, sauf moi, pour dix pour cent, et je connais trois clubs qui ne regardent pas les genoux. Mon ami, on parle d'argent ou d'amitié : signe. » · Variante `fil_rouge == 'vestiaire'` : « Personne ne prolonge un genou, mais un vestiaire prolonge un capitaine, et Bréhaut a le même genou que toi. Mon ami, on parle d'argent ou d'amitié : lequel des deux je vends ? »
**Traces** : agent_fardelli, sans_agent, radio_demandee · **Réactions déclenchées** : jp.re.camille_projet (§ 7) · **Lu plus tard par** : jp.fin.f2_offre, jp.genou_parle (variante « ton agent a demandé la radio »), jp.contrat_image, jp.clause

### SCÈNE jp.fin.f2_offre  —  L'offre d'hiver
**Rôle** : joueur · **Intrigue** : jp.fin.dernier_contrat · **Étape** : 2/9 · **Moment** : saison 0, [10,11] · **Lieu** : selon la variante · **Conditions** : —
Variante `flag('exil_propose') || vars.nassir_palier >= 1` — **NASSIR** *(neutre — un dossier avec une photo de stade climatisé)* : « Ce n'est pas un club, c'est un actif, et un joueur de trente et un ans avec un nom vaut plus chez nous que chez vous. Deux ans au chaud, ou six mois ici pour finir ? » — ← **Deux ans au chaud** — caisse +++, tribunes −−, set: exil_dore, club: {change: true, division: 0} — *Tu signes. Le genou aime la chaleur ; le reste, moins.* · → **Six mois ici** — tribunes ++, caisse −, relation.nassir −1 — *Il referme le dossier. « Je reviendrai », dit-il ; il revient toujours.*
Variante `flag('maison_pays')` (jp.maison_pays) — **CAMILLE** *(sourire — une carte routière, un cercle au feutre autour de ta ville natale)* : « Tu rentres à quelle heure, et surtout tu rentres où : le club de D2 de chez toi a appelé, ils veulent un nom pour la montée. On rentre, ou on finit ici ? » — ← **On rentre** — tribunes +, caisse −, relation.camille +2, set: maison_pays_signee, club: {change: true, division: 2} — *Tu signes en D2, chez toi. Ta mère fait construire ; elle n'a pas attendu.* · → **On finit ici** — direction +, relation.camille −1 — *Elle replie la carte. Le cercle reste visible à travers.*
Secours — **AULARD** *(neutre — un contrat d'une page, un chiffre plus petit que l'ancien)* : « Un an de plus, au rabais, avec une clause sur le genou : tu joues quinze matchs ou le contrat s'arrête. J'ai pas le temps, j'ai un empire : tu signes le rabais, ou tu attends juin ? » — ← **Je signe le rabais** — direction ++, caisse −, set: prolonge_rabais — *Tu signes. Le chiffre est petit ; la clause est grande.* · → **J'attends juin** — direction −−, tribunes +, set: attend_juin — *Il range la page. En juin, il en aura une autre, ou pas.*
Variante `flag('petition_portee')` (jp.vestiaire_porte) : Aulard ajoute « et une pétition de vingt-deux noms, reçue par fax, que je n'ai pas eu le temps de lire » ; la gauche donne direction + et vestiaire ++ à la place.
**Traces** : exil_dore, maison_pays_signee, prolonge_rabais, attend_juin · **Réactions déclenchées** : co.re.nassir_reviendrai (∃, après le refus) · **Lu plus tard par** : jp.fin.f3_juin, une.fin.rabais, ch. 30 (fin jp_exil), ch. 01 (Camille +3 « ici »)

### SCÈNE jp.fin.f3_juin  —  Juin
**Rôle** : joueur · **Intrigue** : jp.fin.dernier_contrat · **Étape** : 3/9 · **Moment** : saison 0, slot 17 · **Lieu** : le bureau d'Aulard, le contrat, ou son absence, et Vukić dans le couloir · **Conditions** : —
**AULARD** *(président — neutre — un stylo, ou pas de stylo)*
« Juin, {toi}, et ton genou a fait la saison, ou presque. J'ai pas le temps, j'ai un empire : un an de plus ici, ou tu prends l'offre d'ailleurs, ou tu prends le banc de la réserve que Vukić te garde ? »
← **Un an de plus, ici** — effets : direction +, tribunes +, caisse −, set: prolonge, outcome: prolonge — *Tu signes. Sabatier signe le certificat en dessous, sans lire le montant.*
→ **L'offre d'ailleurs** — effets : caisse ++, tribunes −−, club: {change: true}, set: parti_juin, outcome: parti — *Tu pars. Le vestiaire t'offre une aile de poulet et une lettre ; la lettre est courte.*
Variante `flag('prolonge_rabais')` : un bouton — **C'était signé en janvier** — set: prolonge — *La clause des quinze matchs est cochée, ou pas ; Josiane le sait, elle ne dit rien.*
Variante `flag('petition_portee') && gauges.vestiaire >= 60` : « Juin, et une pétition de vingt-deux noms que j'ai fini par lire ; j'ai pas le temps, j'ai un empire, mais un vestiaire qui écrit, ça se prolonge. Un an ? » — ← **Un an, pour eux** — vestiaire ++, direction +, set: prolonge, set: prolonge_vestiaire — *Bréhaut a signé en premier. Il le fait remarquer.* · → **Je pars quand même** — vestiaire −−, caisse ++, club: {change: true}, set: parti_juin — *La pétition reste sur le bureau. Aulard s'en sert de sous-main.*
Variante `!flag('prolonge') && !flag('exil_dore') && !flag('maison_pays_signee') && gauges.direction < 40` (aucune offre) — **FARDELLI** *(noir — au téléphone, il parle vite)* : « Aucune offre, mon ami, aucune, et on parle d'argent ou d'amitié, mais là il n'y a ni l'un ni l'autre. Tu attends août sans club, ou tu prends le banc de la réserve ? » — ← **J'attends août** — caisse −−, tribunes −, set: sans_club — *Août arrive. Le téléphone ne sonne pas. Camille l'a débranché, pour voir ; personne n'a remarqué.* · → **Le banc de la réserve** — direction +, set: banc_reserve, set: vers_entraineur — *Vukić te tend un survêtement. Il est à ta taille ; il l'avait pris exprès.*
Variante `flag('diplome')` (jp.diplome_joueur) : troisième chemin, le Carrefour lit `diplome` et propose la transition ; la scène ajoute « le papier est dans le dossier, Vukić l'a mis dessus » ; aucune sortie supplémentaire ici (le set-piece `bilan_carrefour` fait le reste).
**Traces** : prolonge (« {annee} : un an de plus pour {prenom} {nom}. Le genou n'a pas signé, il a laissé faire. »), parti_juin, prolonge_vestiaire, sans_club (« {annee} : {prenom} {nom}, trente-deux ans, sans club. Le téléphone était débranché. »), banc_reserve, vers_entraineur · **Réactions déclenchées** : jp.re.vecchio_encore_une (§ 7) · **Lu plus tard par** : jp.fin.s1_premier_jour, une.fin.un_an_de_plus, une.fin.sans_club, une.fin.vestiaire, objectif `fin_debout`, alarme caisse basse, ch. 30 (Carrefour : transition entraîneur ; fin jp_sansclub), ch. 11 (Vukić : « je t'avais gardé le banc »)

### SCÈNE jp.fin.s1_premier_jour  —  Le premier jour (destination)
**Rôle** : joueur · **Intrigue** : jp.fin.dernier_contrat · **Étape** : 4/9 · **Moment** : saison 1, [1,2] · **Lieu** : selon la variante · **Conditions** : —
Variante `flag('prolonge')` — **BRÉHAUT** *(capitaine — sourire — il a le même genou que toi et un an de plus)* : « Le groupe vit bien, et on est deux de trente-deux ans avec un genou chacun, ça fait un joueur et demi. On se partage les matchs, ou on se dispute le brassard ? » — ← **On se partage** — vestiaire ++, force −1, relation.brehaut +1, set: partage_brehaut — *Vous jouez un match sur deux. Le coach compte ; vous, non.* · → **On se dispute** — tribunes +, vestiaire −, relation.brehaut −1 — *Vous jouez tous les deux, tous les matchs. En mars, il n'en reste qu'un ; ce n'est pas forcément toi.*
Variante `flag('parti_juin')` — **JOSIANE** *(la Josiane d'ici, un autre club — neutre — le classeur ouvert à ta page, la page est mince)* : « Vous êtes le nom qu'on a pris pour le vestiaire, j'en ai vu passer, vous savez, des noms ; on ne vous a pas pris pour vos jambes. Vous voulez le casier près du coach, ou près des jeunes ? » — ← **Près des jeunes** — vestiaire ++, direction − — *Les jeunes t'appellent « papy » le premier jour, puis par ton prénom.* · → **Près du coach** — direction ++, vestiaire − — *Le coach t'appelle « mon relais ». Les jeunes t'appellent « le relais ». Ce n'est pas la même chose.*
Variante `flag('sans_club')` — **CAMILLE** *(noir si relation ≤ −1 — la table de la cuisine, un journal ouvert aux offres d'emploi, pas celles du foot)* : « Tu rentres à quelle heure ? Tu es là depuis août, alors je demande autrement : tu prends le poste de Vukić à la réserve, ou tu attends encore ? » — ← **Le poste de Vukić** — direction +, caisse +, set: vers_entraineur, relation.camille +1 — *Tu appelles Vukić. Il répond à la première sonnerie ; il attendait.* · → **J'attends encore** — caisse −−, relation.camille −2, tribunes − — *Tu attends. En janvier, un club de National appelle. Il paie en merguez.*
Secours — **VUKIĆ** : « Nouvelle saison, et je te le dis parce que personne ne te le dira : cette année tu joues moins, et ce n'est pas une punition. Tu l'acceptes, ou tu vas voir le coach ? » — ← **J'accepte** — vestiaire +, relation.vukic +1 · → **Je vais le voir** — direction −, tribunes +.
**Traces** : partage_brehaut, vers_entraineur · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 30 (Carrefour), ch. 01 (Bréhaut : « un joueur et demi »)

### SCÈNE jp.fin.s1_jambes  —  Les jambes (twist)
**Rôle** : joueur · **Intrigue** : jp.fin.dernier_contrat · **Étape** : 5/9 · **Moment** : saison 1, [10,11] · **Lieu** : la salle de soins, Sabatier avec un chronomètre, Rouvier avec un autre · **Conditions** : —
**SABATIER** *(médecin — neutre — il compare les deux chronomètres, ils ne disent pas pareil)*
« Tes jambes ont perdu trois pas cette année, c'est mesuré, et ça reste entre la table et moi. Tu changes de poste et tu recules, ou tu cours après les trois pas ? »
← **Je recule, je change de poste** — effets : force +2, tribunes −, vestiaire +, set: recule_poste — *Tu joues plus bas. Tu vois le jeu de derrière ; Vukić dit que c'est de là qu'on voit tout.*
→ **Je cours après** — effets : tribunes +, force −4, rand: [{p: 0.3, set: genou_grave, tribunes −−}, {}] — *Tu cours. Trois pas, ça ne se rattrape pas ; ça se paie, en mars, ou en mai.*
Variante `vars.gigi_conseils >= 1` (jp.conseils_gigi) — **ROUVIER** *(kiné — neutre — elle range le chronomètre de Sabatier dans sa poche à lui)* : « Respire. Encore. Gigi t'a dit que le genou avait toujours raison ; les jambes aussi, elles ont perdu trois pas. Tu recules, ou tu cours après ? » — mêmes sorties, la droite n'a plus de `rand` (elle t'a fait respirer).
**Traces** : recule_poste (« {annee} : {prenom} {nom} a reculé d'un cran. De là, on voit tout. »), genou_grave · **Réactions déclenchées** : jp.re.rouvier_respire (§ 7) · **Lu plus tard par** : ch. 30 (Carrefour : « tu vois le jeu de derrière » → transition entraîneur facilitée), fin *Les croisés* (variante), objectif `fin_saison_entiere`, une.fin.dernier_mot

### SCÈNE jp.fin.s1_veille  —  La veille, le papier
**Rôle** : joueur · **Intrigue** : jp.fin.dernier_contrat · **Étape** : 6/9 · **Moment** : saison 1, slot 17 · **Lieu** : le couloir, Vukić, un formulaire de la Fédération ou un cahier · **Conditions** : —
**VUKIĆ** *(entraîneur adjoint — neutre — le cahier ouvert à une page vide, avec ton nom en haut)*
« Dernier bloc demain, et je te le dis parce que personne ne te le dira : le banc de la réserve est libre en juin, et j'ai écrit ton nom en haut de la page. Tu joues demain comme un joueur, ou comme quelqu'un qui regarde le banc ? »
← **Comme un joueur** — effets : tribunes +, force +1, relation.vukic +1 — *Il referme le cahier. Il ne raye pas ton nom.*
→ **Je regarde déjà le banc** — effets : direction +, tribunes −, set: banc_regarde, relation.vukic +1 — *Il te donne le cahier. Il en a un autre ; il en a toujours un autre.*
Variante `flag('vukic_dauphin')` (ch. 11 : Vukić a pris un banc ailleurs) — le locuteur devient **VUKIĆ, au téléphone, d'un autre club** : « Je te le dis parce que personne ne te le dira : j'ai un banc ici, et un poste d'adjoint, à ton nom. Tu joues demain, ou tu viens ? » — ← **Je joue demain** — tribunes + — *Il dit « dimanche prochain, alors ».* · → **Je viens** — direction +, set: vers_entraineur, set: suit_vukic — *Tu prends le train le lundi. Le cahier est dans le sac.*
**Traces** : banc_regarde, suit_vukic · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 30 (Carrefour : `if: flag('banc_regarde')`), ch. 11 (`interimaire` : « tu es l'adjoint de Vukić », si `suit_vukic`), objectif `fin_passeur`

### SCÈNE jp.fin.s2_saison_de_plus  —  Une saison de plus (rejouable)
**Rôle** : joueur · **Intrigue** : jp.fin.dernier_contrat · **Étape** : 7/9 · **Moment** : saison 2+, [1,2] · **Lieu** : le vestiaire, Vecchio ou son suivant, deux paires de chaussettes · **Conditions** : —
**VECCHIO** *(gardien, 41 ans puis plus — neutre — il montre une chaussette trouée comme une preuve)*
« Une saison de plus, petit, moi j'en suis à ma quatrième retraite et je suis encore là. J'en ai vu d'autres : tu la joues pour toi, ou tu la joues pour montrer aux jeunes ? »
← **Pour moi** — effets : tribunes +, force −1 — *Il hoche la tête. Il en a vu d'autres, des égoïstes ; il les aimait bien.*
→ **Pour montrer aux jeunes** — effets : vestiaire ++, tribunes −, relation.mbako +1 — *Mbako te regarde t'échauffer. Il copie. Il fait mieux ; c'est le but.*
Variante `plays() >= 2` : « Une saison de plus, encore, et cette fois j'ai les gants sous le bras, pas aux mains ; j'en ai vu d'autres, mais pas beaucoup. Pour toi, ou pour eux ? »
Variante `chars.vecchio.statut == 'retraite' && flag('gigi_staff')` : Vecchio parle en survêtement d'entraîneur des gardiens ; même réplique, « les gants sous le bras » en didascalie.
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : —

### SCÈNE jp.fin.s2_veille  —  La veille, Camille (rejouable)
**Rôle** : joueur · **Intrigue** : jp.fin.dernier_contrat · **Étape** : 8/9 · **Moment** : saison 2+, slot 17 · **Lieu** : la maison, le canapé, un match à la télé, pas le tien · **Conditions** : `!flag('divorce')` ; sinon variante Josiane
**CAMILLE** *(neutre — elle baisse le son, elle ne coupe pas)*
« Tu rentres à quelle heure, demain, après le dernier match ; je demande parce que je ne sais plus si tu rentres joueur ou autre chose. Tu me le dis ce soir, ou tu me le dis demain ? »
← **Ce soir : je continue** — effets : tribunes +, relation.camille −1 — *Elle remonte le son. Le match à la télé, c'est celui d'un joueur de vingt ans.*
→ **Ce soir : c'est le dernier** — effets : direction +, relation.camille +2, set: dernier_annonce — *Elle coupe la télé. Elle ne dit rien ; c'est la première fois que le silence est bon.*
Variante `flag('divorce')` — **JOSIANE** : « Dernier match demain, et j'en ai vu passer, vous savez, des derniers matchs qui ne l'étaient pas. Celui-là ? » — ← **Celui-là, oui** — set: dernier_annonce · → **On verra en juin** — tribunes +.
**Traces** : dernier_annonce · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 30 (Carrefour : « tu l'avais dit à Camille » ; fin jubile si `jubile_fait`), jp.adieu (variante)

### SCÈNE jp.fin.f9_alarme_gege_papy  —  (alarme, `tribunes.low`)
**GÉGÉ** *(capo — noir — un sifflet à la bouche, pas encore dedans)*
« La tribune n'oublie rien, le {numero}, elle se souvient même de quand tu courais ; maintenant elle regarde ses pieds. Tu lui donnes un match, ou tu lui donnes ta place ? »
← **Un match, dimanche** — effets : tribunes ++, force −2, rand: [{p: 0.25, set: genou_grave}, {}] — *Tu joues fort. Une fois. La tribune chante ; le genou, lui, siffle.*
→ **Ma place, au jeune** — effets : tribunes +, vestiaire +, direction −, relation.mbako +1 — *Le jeune joue. La tribune chante son nom ; elle ne siffle plus le tien, elle l'a rangé.*

---

## 5. Les postulats pro de seconde vague (scripts)

Chaque script suit la grille : quatre ancres en S0 (slot 1, [10-11], 16, 17), trois en S1 ([1-2], [10-11], 17), deux rejouables en S2+ ([1-2], 17). Les ancres S1 et S2+ sont données en résumé (locuteur, situation, sorties) : elles suivent les mêmes gabarits que celles du § 3-4 et seront développées par le chantier données à partir de ces lignes. Le réservoir est celui du § 6 (le pool par postulat est donné dans chaque fiche).

### 5.1 POSTULAT `retour_croises` — Retour de croisés

**Année** : 1998 (l'année où tout le monde aime le foot : `monde_1998` ; le contraste est voulu) · **Club** : D1 · **Âge** : 25 · **Jauges** : vestiaire 70, tribunes 45, direction 40, caisse 50 · **Force** : 35 · **Drapeaux** : `[genou, genou_opere]` · **Objectif** : vingt titularisations (objectif de l'agent, fin *Le pouce* si manqué au Verdict) · **Question** : `corps` / `place` / `confiance` · **Cast** : sabatier (2), rouvier (2), vukic (le coach, 2), mbako (24 ans, star des Cobalts, ton poste : 1,5), brehaut (1), fardelli (1), camille (1), lea (1), gege (1), dembo (1), josiane (0,5) · **Pool "0"** : jp.genou_parle (signature, variante « le genou neuf »), co.mbako_rival (variante « il a pris ta place pendant que tu boitais »), jp.banc_hiver, jp.vestiaire_porte, jp.conseils_gigi (Vecchio est au staff : variante `gigi_staff`), co.pharmacie (variante « pour revenir plus vite ») · **"1"** : jp.selection, jp.brassard_20, jp.clause, jp.premiere_une · **"2+"** : jp.coach_qui_te_veut, jp.pari, jp.jubile.
**Objectifs** : `croises_vingt` — *Vingt titularisations* (`vars.titularisations >= 20` ; indice : « Ton agent a compté. Vingt. ») · `croises_sans_piqure` — *Sans piqûre* (`stats.saisons >= 2 && !flag('infiltre')` ; indice : « Le plateau de droite est toujours là. ») · `croises_rejoues` — *Le derby rejoué* (`flag('derby_gagne') && flag('croises_rejoues')` ; indice : « Tu t'es blessé dans un derby. Il y en a un autre. »).
**alarm_override** : `tribunes.low` → `jp.croises.alarme_gege_boite` (Gégé : « La tribune n'oublie rien, elle se rappelle le derby où tu es tombé ; elle voudrait bien un autre souvenir. »).

### SCÈNE jp.croises.c1_reprise  —  La reprise
**Rôle** : joueur · **Intrigue** : jp.croises.retour · **Étape** : 1/9 · **Moment** : saison 0, slot 1 · **Lieu** : la salle de rééducation, un vélo, Rouvier qui tient le guidon · **Conditions** : —
**ROUVIER** *(kiné — neutre — elle a le chronomètre du Doc et le sien ; elle ne regarde que le sien)*
« Le genou est neuf, c'est le papier qui le dit, et moi je dis qu'il a huit mois et qu'il a peur. Respire. Encore : tu reprends avec le groupe lundi, ou tu me donnes trois semaines de plus ? »
← **Lundi, avec le groupe** — effets : vestiaire ++, tribunes +, force −1, set: reprise_tot — *Tu reprends. Le groupe t'applaudit au premier toro. Le genou ne dit rien ; il attend.*
→ **Trois semaines de plus** — effets : force +3, vestiaire −, direction −, set: reprise_tard — *Trois semaines. Vukić ne t'attend pas ; il fait jouer Mbako, qui ne demandait que ça.*
Variante `fil_rouge == 'confiance'` : « Le genou est neuf, et le tien est le seul qui ne le sait pas. Respire. Encore : tu tacles au premier entraînement, ou tu évites pendant un mois ? » — ← **Je tacle lundi** — vestiaire ++, force −1, set: reprise_tot — *Tu tacles. Bréhaut, qui reçoit, dit « ça va ». Ça va.* · → **J'évite un mois** — force +2, vestiaire −, set: reprise_tard — *Tu évites. Le groupe le voit. Dembo te chambre ; c'est sa façon d'être gentil, il n'en a pas d'autre.*
**Traces** : reprise_tot, reprise_tard · **Réactions déclenchées** : jp.re.sabatier_deux_chronos (§ 7) · **Lu plus tard par** : jp.croises.c2_derby, jp.genou_parle (variante « le genou neuf »), objectif `croises_sans_piqure`

### SCÈNE jp.croises.c2_derby  —  Le derby où tu es tombé
**Rôle** : joueur · **Intrigue** : jp.croises.retour · **Étape** : 2/9 · **Moment** : saison 0, [10,11] (la semaine du derby) · **Lieu** : le local, Gégé, une photo punaisée : toi, au sol, l'an dernier · **Conditions** : —
**GÉGÉ** *(capo — neutre — il décroche la photo, il te la tend, il la reprend)*
« La tribune n'oublie rien, et dimanche c'est le derby où tu es tombé, même pelouse, même défenseur. Tu joues, ou tu regardes de la Nord avec nous, pour une fois ? »
← **Je joue** — effets : tribunes ++, force −2, rand: [{p: 0.2, set: genou_grave, tribunes −−}, {set: croises_rejoues}], set: derby_joue — *Tu joues. Le défenseur te regarde au tirage au sort ; il baisse les yeux le premier.*
→ **De la Nord, avec vous** — effets : tribunes +, vestiaire −, relation.gege +1, set: ami_ultras — *Tu regardes du virage. Tu chantes. On te fait chanter le couplet sur toi ; tu le connais mal.*
Variante `flag('reprise_tard')` : Gégé ajoute « et tu n'as pas encore joué une minute » ; la gauche a `p: 0.35`.
**Traces** : croises_rejoues (« {annee} : {prenom} {nom} a rejoué le derby où il était tombé. Debout à la fin. »), derby_joue, ami_ultras (∃) · **Réactions déclenchées** : co.re.gege_decoupe (∃) · **Lu plus tard par** : objectif `croises_rejoues`, co.derby (variante « tu y es tombé »), ch. 13 (`ami_ultras`), ch. 15 (le compte anonyme)

### SCÈNE jp.croises.c3_vingt  —  Le compte de l'agent
**Rôle** : joueur · **Intrigue** : jp.croises.retour · **Étape** : 3/9 · **Moment** : saison 0, slot 16 · **Lieu** : la voiture de Fardelli, un carnet avec des bâtons · **Conditions** : —
**FARDELLI** *(agent — neutre — il compte les bâtons à voix haute, il s'arrête avant la fin)*
« Le contrat dit vingt titularisations, mon ami, et on en est à {titularisations}, et il reste deux matchs ; on parle d'argent ou d'amitié, parce que la prime est dans les deux. Tu demandes au coach, ou tu laisses le compte ? »
← **Je demande au coach** — effets : direction −, tribunes +, set: demande_titularisation — *Tu demandes. Vukić te le dit parce que personne ne te le dira : il t'aurait mis quand même. Maintenant il hésite.*
→ **Je laisse le compte** — effets : direction +, caisse −, relation.fardelli −1 — *Tu laisses. Il ferme le carnet. La prime tombe, ou pas ; il te l'apprendra par un pouce.*
**Traces** : demande_titularisation · **Réactions déclenchées** : — · **Lu plus tard par** : fin *Le pouce* (jp_pouce, ch. 30 : variante « tu avais demandé »), objectif `croises_vingt`

### SCÈNE jp.croises.c4_virage  —  Le dernier virage du genou
**Rôle** : joueur · **Intrigue** : jp.croises.retour · **Étape** : 4/9 · **Moment** : saison 0, slot 17 · **Lieu** : la salle de soins, Sabatier avec la radio de l'an dernier et celle d'aujourd'hui · **Conditions** : —
**SABATIER** *(médecin — neutre — il pose les deux radios côte à côte contre le néon)*
« Celle-là, c'est l'an dernier ; celle-ci, c'est ce matin, et ça reste entre la table et moi : il a tenu. Demain, dernier bloc : tu le joues comme un genou neuf, ou comme un genou qui a tenu ? »
← **Comme un genou neuf** — effets : tribunes ++, force +1, rand: [{p: 0.15, set: genou_grave}, {}] — *Tu joues sans y penser. C'est la première fois depuis un an ; c'est aussi la dernière fois qu'il le dit.*
→ **Comme un genou qui a tenu** — effets : force +1, vestiaire +, tribunes − — *Tu joues avec. Tu tacles moins. Vukić note « intelligent » dans le cahier ; il souligne.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : set-piece `gm_annonce` (ch. 30 : variante « les deux radios »)

**S1 / S2+ (résumé)** : `jp.croises.s1_premier_jour` — Vukić : « le genou a un an de plus et toi aussi ; tu es titulaire ou tu es la doublure de Mbako ? » (variantes `reprise_tot` / `reprise_tard`) · `jp.croises.s1_twist` — *La rechute des autres* : Mbako se blesse au genou à son tour ; « le petit demande comment on fait » (sorties : lui dire tout / lui dire « le genou a toujours raison » ; pose `genou_petit_dit`, lu par ch. 01 `en.mbako.revient`) · `jp.croises.s1_veille` — Rouvier : « Respire. Encore. » (le rituel) · `jp.croises.s2_rentree` — Fardelli et le carnet à bâtons, « encore » sur `plays()` · `jp.croises.s2_veille` — Gégé et la photo du derby, repunaisée à l'endroit.

### 5.2 POSTULAT `binational` — Le binational

**Année** : 2004 · **Club** : D1 · **Âge** : 20 · **Jauges** : vestiaire 50, tribunes 55, direction 50, caisse 50 · **Force** : 60 · **Drapeaux** : `[binational]` · **Objectif** : le titre ou la Coupe Continentale (70 points) · **Question** : `pays` / `famille` / `carriere` · **Cast** : legruet (la Fédération, 2), brissac (la DTN, 1,5), mbako (30 ans, star des Cobalts, « il l'a fait avant toi », 1,5), mere_mbako (agente de vingt joueurs à partir de 2010 ; en 2004 elle est « la mère qui négocie », 1), fauvel (président du syndicat dès 2006 ; en 2004 capitaine retraité, consultant : 1), « ta mère, au téléphone du pays » (voix 1,5), « un émissaire du Kambara » (voix 1), fardelli ou solvang (1), lea (1), vence (1), gege (1), camille (1), sabatier (0,5) · **Pool "0"** : jp.selection (signature, variante binationale complète), jp.premiere_une, jp.tifo, jp.brassard_test, jp.contrat_image, jp.dembo_rival, jp.conseils_gigi · **"1"** : co.mbako_rival (variante « la star des Cobalts te reçoit »), jp.clause, jp.exil_dore, co.derby, jp.genou_20 · **"2+"** : jp.derniere_selection, jp.pari, jp.coach_qui_te_veut.
**Objectifs** : `binational_mondial` — *Disputer un Mondial* (`flag('international') && vars.mondial_joue >= 1` ; indice : « Deux hymnes, un seul Mondial. ») · `binational_deux_stades` — *Applaudi dans les deux stades* (`flag('binational_choisi') && gauges.tribunes >= 70 && stats.saisons >= 3` ; indice : « L'autre maillot siffle. Pas toujours. ») · `binational_mere` — *Ta mère à la tribune* (`flag('mere_tribune')` ; indice : « Elle n'est jamais venue. Elle viendrait pour un maillot. »).
**alarm_override** : `tribunes.low` → `jp.binational.alarme_gege_maillot` (Gégé : « La tribune n'oublie rien, elle a vu l'autre maillot à la télé ; elle voudrait comprendre. »).

### SCÈNE jp.binational.b1_deux_lettres  —  Deux lettres
**Rôle** : joueur · **Intrigue** : jp.binational.deux_hymnes · **Étape** : 1/9 · **Moment** : saison 0, slot 1 · **Lieu** : le casier, deux enveloppes à en-tête, l'une bleu cobalt, l'autre aux couleurs du Kambara · **Conditions** : —
**BRISSAC** *(DTN — neutre — elle a les deux lettres ; elle t'en tend une, puis l'autre, dans l'ordre inverse)*
« Les chiffres sont têtus, les joueurs aussi : les Cobalts espoirs vous convoquent en mars, et le Kambara vous convoque le même jour, en A. Vous ouvrez laquelle en premier ? »
← **La bleu cobalt** — effets : tribunes +, direction +, set: penche_cobalts — *Tu l'ouvres. Elle dit « espoirs », en petit. Ta mère l'apprend par la radio ; elle ne rappelle pas ce soir.*
→ **Celle du Kambara** — effets : tribunes −, vestiaire +, set: penche_kambara — *Tu l'ouvres. Elle dit « équipe A » et « ta grand-mère serait fière ». Elle ne connaît pas ta grand-mère ; elle a raison quand même.*
Variante `fil_rouge == 'famille'` : « Les chiffres sont têtus, les joueurs aussi, et votre mère a appelé la Fédération ce matin, avant vous. Laquelle ouvrez-vous ? » · Variante `fil_rouge == 'carriere'` : « Les chiffres sont têtus, les joueurs aussi, et un joueur des Cobalts vaut le double sur le marché, c'est un chiffre, pas un conseil. Laquelle ? »
**Traces** : penche_cobalts, penche_kambara · **Réactions déclenchées** : jp.re.mere_telephone (§ 7) · **Lu plus tard par** : jp.binational.b2_mars, jp.selection (le choix se fait là), ch. 14 (Brissac : « vous aviez ouvert la bleue en premier »)

### SCÈNE jp.binational.b2_mars  —  La fenêtre de mars
**Rôle** : joueur · **Intrigue** : jp.binational.deux_hymnes · **Étape** : 2/9 · **Moment** : saison 0, [10,11] · **Lieu** : le hall de l'hôtel des Cobalts, Mbako en survêtement bleu, une valise · **Conditions** : —
**MBAKO** *(star des Cobalts, 30 ans — neutre — il pose la valise ; il en a fait, des valises)*
« Je veux jouer, maintenant, c'est ce que je disais à seize ans, et j'ai choisi les Cobalts parce qu'on m'a appelé le premier ; le Kambara m'appelle encore, tous les ans. Tu choisis pour le maillot, ou pour la mère ? »
← **Pour le maillot, ici** — effets : tribunes ++, direction +, set: binational_choisi=cobalts, set: international, relation.mbako +1 — *Tu signes le formulaire bleu. Legruet dit « on verra ça après le Congrès » ; c'est déjà vu.*
→ **Pour la mère, là-bas** — effets : tribunes −−, vestiaire +, set: binational_choisi=kambara, set: international, relation.mbako +1 — *Tu signes l'autre. Ta mère pleure au téléphone ; c'est la première fois que tu l'entends pleurer de ce côté-là.*
Variante `flag('mbako_kambara')` (ch. 01 : Mbako a choisi le Kambara) : « Je veux jouer, maintenant, et moi j'ai choisi le Kambara, on m'a sifflé ici pendant deux ans, puis on a arrêté. Tu choisis lequel des deux sifflets ? » — mêmes sorties.
Variante `flag('selection_refusee')` : Legruet, à la place de Mbako, noir : « On verra ça après le Congrès, disais-je ; vous avez dit non une fois à la Fédération, on ne dit pas non deux fois. Les Cobalts, ou l'autre ? » — mêmes sorties, la gauche donne direction − (il te prend, à contrecœur).
**Traces** : binational_choisi (valeur), international (∃) (« {annee} : {prenom} {nom} a choisi un maillot. L'autre pays a gardé le numéro. ») · **Réactions déclenchées** : jp.re.vence_autre_maillot (§ 7) · **Lu plus tard par** : ch. 14 (l'appel du pays à 40 ans ; le Kambara en face en 2026, Mbako sélectionneur), ch. 15 (les fédérations se disputent), une.binational.autre_maillot, une.binational.bleu, ch. 90 (Nemesis : la fédération éconduite)

### SCÈNE jp.binational.b3_siffle  —  L'autre stade
**Rôle** : joueur · **Intrigue** : jp.binational.deux_hymnes · **Étape** : 3/9 · **Moment** : saison 0, slot 16 · **Lieu** : la zone mixte, Vence, un micro, un bruit de sifflets derrière · **Conditions** : `flag('binational_choisi')`
**VENCE** *(Télé-Stade — neutre — elle tend le micro par-dessus la barrière, elle attend la phrase)*
« On est en direct, et le stade vous a sifflé à chaque touche de balle parce que vous avez choisi l'autre maillot. Un mot pour eux, ou un mot pour votre mère ? »
← **Un mot pour eux** — effets : tribunes +, direction −, parole +1, set: mot_pour_eux — *Tu dis « je comprends ». Le lendemain, on te siffle moins ; on te siffle quand même.*
→ **Un mot pour ma mère** — effets : tribunes −, vestiaire +, set: mot_pour_mere, relation.camille +1 — *Tu dis son prénom. Vence coupe. Le stade ne coupe pas.*
**Traces** : mot_pour_eux, mot_pour_mere · **Réactions déclenchées** : co.re.vence_direct (ch. 02) · **Lu plus tard par** : jp.binational.s1_twist, ch. 14 (l'hymne : « il ne l'a pas chanté, il a dit un prénom »)

### SCÈNE jp.binational.b4_virage  —  Le maillot de la mère
**Rôle** : joueur · **Intrigue** : jp.binational.deux_hymnes · **Étape** : 4/9 · **Moment** : saison 0, slot 17 · **Lieu** : ta chambre, un colis, un maillot plié, le téléphone du pays qui sonne · **Conditions** : —
**TA MÈRE** *(voix sans portrait — le téléphone du pays ; on entend une cour, des enfants)*
« Je t'ai envoyé le maillot de là-bas, celui avec ton nom, tout le quartier a signé dedans. Tu le mets sous l'autre, demain, ou tu le gardes dans l'armoire ? »
← **Sous l'autre, demain** — effets : tribunes −, vestiaire +, force +1, set: maillot_dessous — *Tu joues avec deux maillots. À la fin, tu enlèves le premier. Le stade voit le second ; il se tait, ou pas.*
→ **Dans l'armoire** — effets : tribunes +, direction +, relation.camille −1 — *Tu le plies. Camille le range plus haut que toi ; elle ne dit pas pourquoi.*
Variante `flag('binational_choisi') == 'kambara'` : « Je t'ai envoyé le maillot d'ici, celui que tu as choisi, tout le quartier a signé dedans, et je viens dimanche, avec le car. Tu me prends une place, ou je reste avec le quartier ? » — ← **Une place, tribune d'honneur** — tribunes +, caisse −, set: mere_tribune — *Elle vient. Elle ne regarde pas le match ; elle te regarde.* · → **Avec le quartier, en Nord** — tribunes ++, relation.gege +1, set: mere_tribune — *Gégé lui donne une écharpe. Elle la porte à l'envers, avec conviction.*
**Traces** : maillot_dessous (« {annee} : {prenom} {nom} a joué avec deux maillots. Le quartier avait signé le second. »), mere_tribune · **Réactions déclenchées** : — · **Lu plus tard par** : objectif `binational_mere`, ch. 14 (l'hymne), ch. 20 (« DEUX MAILLOTS, UN JOUEUR »)

**S1 / S2+ (résumé)** : `jp.binational.s1_premier_jour` — Gégé, le maillot à la télé (« tu chantes lequel ? ») · `jp.binational.s1_twist` — *Le match entre les deux* : les Cobalts jouent le Kambara en amical ; tu es d'un côté ; « un émissaire du Kambara » te propose de ne pas jouer « par respect » (sorties : je joue / je me déclare blessé, pose `blesse_par_respect`, lu par ch. 14 et Sabatier) · `jp.binational.s1_veille` — Léa : « Vous confirmez ? » sur la phrase à Vence · `jp.binational.s2_rentree` — Brissac, la liste (« encore » : « les chiffres sont têtus, vous aussi ») · `jp.binational.s2_veille` — ta mère au téléphone, le quartier a signé un autre maillot.

### 5.3 POSTULAT `banc_dore` ★ — Le banc doré

**Année** : 2008 · **Club** : Al-Dorado FC (championnat du désert ; on écrit « Al-Dorado », jamais un pays réel) · **Âge** : 27 · **Jauges** : vestiaire 45, tribunes 40, direction 30 (tu ne joues pas), caisse 90 (compte ×5) · **Force** : 55, −2 par saison (« les jambes rouillent ») · **Drapeaux** : `[exil_dore, banc_dore]` · **Objectif** : le titre du désert (le championnat a douze clubs et un seul favori) · **Question** : `argent` / `jeu` / `retour` · **Cast** : nassir (patron 2,5), fardelli ou solvang (1,5 ; Solvang « reprend » les exilés), rouvier (kiné des Cobalts 2002-2014, en stage au désert : 1), camille (1,5), dembo (46 ans en 2012 ; en 2008 il a 42 ans et joue son dernier contrat au désert, ou il est consultant : 1), meneche (consultant Télé-Stade, 1), lea (0,5), gege (0,5, au téléphone), vukic (le coach qui te veut, 1), sacha (si née, 1), « un émissaire d'Al-Dorado » (voix), « le kiné du club » (voix) · **Pool "0"** : jp.exil_dore (signature, variante « déjà là »), jp.contrat_image, jp.conseils_gigi (Vecchio au téléphone : variante `gigi_staff`), jp.dembo_rival (variante « vieux Dembo »), jp.premiere_une (variante Ménèche consultant), jp.camille_bac (variante « Camille reprend des études, à distance ») · **"1"** : jp.coach_qui_te_veut (variante « depuis l'Europe »), jp.selection (« un exilé dans la liste ? »), jp.pari (`if: gauges.caisse >= 80` : les paris asiatiques, variante), jp.clause · **"2+"** : jp.retour_usine (variante « le retour en Europe »), jp.jubile (« au désert, personne ne vient »), jp.consultant.
**Objectifs** : `banc_dore_retour` — *Rejouer en Europe avant trente ans* (`flag('banc_dore_retour') && age < 30` ; indice : « Le banc est climatisé. Les jambes, non. ») · `banc_dore_titre` — *Le titre du désert* (`bilan.outcome == 'titre'` une fois ; indice : « Un championnat sans enjeu a quand même un vainqueur. ») · `banc_dore_camille` — *Elle est venue* (`flag('camille_ici') && stats.saisons >= 2` ; indice : « Tu rentres à quelle heure ? Elle ne le demande plus par téléphone. »).
**alarm_override** : `direction.low` → `jp.banc_dore.alarme_nassir_ligne` (Nassir : « Ce n'est pas un club, c'est un actif, et vous en êtes une ligne qui ne joue pas. Les lignes qui ne jouent pas, on les amortit. »).

### SCÈNE jp.banc_dore.d1_climatise  —  Le banc climatisé
**Rôle** : joueur · **Intrigue** : jp.banc_dore.rouille · **Étape** : 1/9 · **Moment** : saison 0, slot 1 · **Lieu** : le banc de touche d'Al-Dorado, un souffle froid par en dessous, Nassir en costume clair · **Conditions** : —
**NASSIR** *(fonds Qatalyst, propriétaire — sourire — il te fait sentir la climatisation du banc de la main)*
« Ce n'est pas un club, c'est un actif, et vous en êtes la ligne la plus visible : vous êtes payé pour être ici, pas forcément pour jouer. Vous voulez jouer quand même, ou vous voulez comprendre ? »
← **Jouer quand même** — effets : direction −, tribunes +, force +1, set: veut_jouer — *Tu joues dix minutes samedi. Le coach l'a fait pour toi ; on le lui a fait faire.*
→ **Comprendre** — effets : direction ++, caisse +, force −1, set: comprend_actif — *Il t'explique. Ça prend un quart d'heure. Tu es une ligne entre un stade et un aéroport.*
Variante `fil_rouge == 'retour'` : « Ce n'est pas un club, c'est un actif, et je sais que vous voulez rentrer, tous veulent rentrer la première année. Vous restez deux ans et vous rentrez riche, ou vous rentrez maintenant, pauvre ? » — ← **Deux ans** — caisse ++, force −2, set: comprend_actif · → **Maintenant** — caisse −−, tribunes +, set: veut_rentrer.
**Traces** : veut_jouer, comprend_actif, veut_rentrer · **Réactions déclenchées** : jp.re.camille_quelle_heure_ici (§ 7) · **Lu plus tard par** : jp.banc_dore.d2_ramadan, jp.banc_dore.d4_virage, ch. 30 (fin jp_exil, variante « il avait compris »)

### SCÈNE jp.banc_dore.d2_jeune  —  Le jeûne et le match
**Rôle** : joueur · **Intrigue** : jp.banc_dore.rouille · **Étape** : 2/9 · **Moment** : saison 0, [10,11] · **Lieu** : le vestiaire d'Al-Dorado, le soir, une table avec des dattes et de l'eau, le capitaine local (voix) · **Conditions** : —
**LE CAPITAINE D'AL-DORADO** *(voix sans portrait — il t'attend pour rompre le jeûne, tout le vestiaire attend avec lui)*
« Ce mois-ci, la moitié du vestiaire jeûne et joue quand même, et on s'assoit ensemble au coucher du soleil, c'est la règle ici. Vous vous asseyez avec nous, ou vous mangez à l'hôtel ? »
← **Je m'assois avec vous** — effets : vestiaire +++, tribunes +, set: table_partagee — *Tu t'assois. Tu attends que le soleil se couche pour manger ; c'est long, c'est simple. On t'appelle par ton prénom le lendemain.*
→ **À l'hôtel, merci** — effets : vestiaire −−, caisse + — *Tu manges à l'hôtel. Le vestiaire ne t'en veut pas ; il ne te voit pas non plus.*
**Traces** : table_partagee (« {annee} : au désert, {prenom} {nom} a attendu le coucher du soleil pour manger avec le vestiaire. ») · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 14 (le jeûne au sein des Cobalts : « tu sais comment on fait »), ch. 11 (EN-14 « Le jeûne » : variante « tu as jeûné avec eux »), une.banc_dore.table

### SCÈNE jp.banc_dore.d3_coach_europe  —  Le coup de fil d'Europe
**Rôle** : joueur · **Intrigue** : jp.banc_dore.rouille · **Étape** : 3/9 · **Moment** : saison 0, slot 16 · **Lieu** : la chambre d'hôtel, le téléphone, quatre heures de décalage · **Conditions** : —
**VUKIĆ** *(entraîneur d'un club de D1 en Europe — neutre — il appelle à une heure où il est réveillé, pas toi)*
« Je te le dis parce que personne ne te le dira : tes jambes ont un an de désert, et j'ai un poste pour toi en janvier, moins payé, plus joué. Tu rentres à la moitié du prix, ou tu finis ton contrat ? »
← **Je rentre à moitié prix** — effets : caisse −−, tribunes ++, force +2, set: banc_dore_retour, club: {change: true, division: 1} — *Tu rentres. Nassir signe la lettre de sortie sans la lire ; il a un remplaçant qui coûte moins.*
→ **Je finis mon contrat** — effets : caisse ++, force −2, relation.vukic −1, set: contrat_fini — *Tu finis. Vukić rappelle l'année suivante ; il a une autre équipe, et une autre question.*
Variante `flag('vukic_dauphin')` : Vukić précise « le banc, je l'ai pris à quelqu'un qui n'avait pas lu le second discours » ; mêmes sorties.
**Traces** : banc_dore_retour (« {annee} : {prenom} {nom} est rentré du désert à moitié prix. Les jambes ont dit merci. »), contrat_fini · **Réactions déclenchées** : co.re.nassir_reviendrai (∃, après ←) · **Lu plus tard par** : objectif `banc_dore_retour`, jp.coach_qui_te_veut (`requires`), une.banc_dore.retour, ch. 30 (fin jp_fils plus)

### SCÈNE jp.banc_dore.d4_virage  —  Le dernier virage du désert
**Rôle** : joueur · **Intrigue** : jp.banc_dore.rouille · **Étape** : 4/9 · **Moment** : saison 0, slot 17 · **Lieu** : le stade vide, Dembo sur le banc à côté, une bouteille d'eau très froide · **Conditions** : `chars.dembo.statut in [club, rival, retraite]`
**DEMBO** *(avant-centre, 42 ans, dernier contrat — neutre — il boit toute la bouteille avant de parler)*
« Donne-moi le ballon, je m'occupe du reste, je disais ça à vingt ans ; ici, personne ne donne le ballon, on donne le chèque. Demain, dernier match : on joue pour la vidéo qu'on enverra en Europe, ou pour le gars à côté ? »
← **Pour la vidéo** — effets : tribunes +, force +1, vestiaire −, set: video_europe — *Tu joues pour la caméra. Dembo aussi. Vous perdez ; la vidéo est bonne.*
→ **Pour le gars à côté** — effets : vestiaire ++, relation.dembo +2, force −1, set: dembo_ami — *Tu joues pour lui. Il marque ; il te montre du doigt. C'est son dernier but ; il le sait, pas toi.*
**Traces** : video_europe, dembo_ami (« {annee} : au désert, Dembo a marqué son dernier but sur une passe de {prenom} {nom}. Il l'a montré du doigt. ») · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 01 (Dembo, fiche à écrire : retrouvailles « le dernier but »), ch. 11 (Dembo entraîneur de Corbelin, 2020 : « tu m'as fait la passe »), ch. 30 (jp_exil plus)

**S1 / S2+ (résumé)** : `jp.banc_dore.s1_premier_jour` — Camille arrive, ou n'arrive pas (pose `camille_ici` : « elle a pris l'appartement avec vue sur le stade vide ») · `jp.banc_dore.s1_twist` — *Les paris asiatiques* : « un émissaire » propose « juste le nombre de corners » ; refuser (pose `pari_refuse`) ou accepter (pose `pari` ; La Plume en S+1, § 6 jp.pari, et la menace sur l'école de Sacha, traitée sobrement) · `jp.banc_dore.s1_veille` — Rouvier en stage : « Respire. Encore. Ici l'air est sec, les jambes aussi. » · `jp.banc_dore.s2_rentree` — Nassir : « une ligne de plus » (« encore ») · `jp.banc_dore.s2_veille` — Gégé au téléphone, depuis le local : « la tribune n'oublie rien, elle regarde ton match à trois heures du matin ».

### 5.4 POSTULAT `capitaine_dechu` ★ — Capitaine du géant déchu

**Année** : 2012 · **Club** : D2, rétrogradé administrativement (six titres au mur, la Commission dans le couloir : `commission_lettre` posée par le monde) · **Âge** : 30 · **Jauges** : vestiaire 40, tribunes 90, direction 50, caisse 20 · **Force** : 48 · **Drapeaux** : `[capitaine, geant_dechu]` · **Objectif** : la montée immédiate (72 points) · **Question** : `remontee` / `fierte` / `depart` · **Cast** : gege (2,5), brehaut (DS du club depuis 2010 : 2), vialat (l'Inspecteur, 1,5), vukic (le coach, 1,5), josiane (retraitée en 2022 ; en 2012 secrétaire de la Fédération : ici « la petite Josiane », sa nièce, prend le club : voix avec le portrait de Josiane, bande « SECRÉTAIRE DEPUIS 2008 », 1), lea (1), meneche (directeur d'antenne, 1), vence (1), fardelli (1), solvang (1), paulette (morte en 2009 : sa place 14B est vide, une carte-anecdote), vecchio (buvette des anciens, 1), dembo (ruiné en 2015 ; en 2012 consultant, 0,5), camille (1), sacha (1), « les jeunes du centre » (voix) · **Pool "0"** : jp.tifo (signature, variante « le tifo des six titres »), jp.vestiaire_porte (variante « le capitaine porte le vestiaire »), jp.brassard_20 (variante « tu l'as déjà »), jp.premiere_une, jp.contrat_image (variante « le club ne peut plus te payer : l'image, si »), jp.conseils_gigi (Vecchio à la buvette des anciens) · **"1"** : jp.clause (variante « la clause de relégation »), jp.pari (`if: gauges.caisse < 30`), co.derby, jp.genou_parle, jp.selection (« un capitaine de D2 dans la liste ? ») · **"2+"** : jp.jubile, jp.memoires, jp.consultant, jp.diplome_joueur.
**Objectifs** : `geant_remonte` — *Remonter en deux saisons* (`flag('geant_remonte')` ; indice : « Six titres au mur. Le mur est en D2. ») · `geant_brassard_garde` — *Le brassard jusqu'au bout* (`flag('capitaine') && stats.saisons >= 2 && !flag('brassard_refuse')` ; indice : « Il pèse. Garde-le. ») · `geant_jeunes` — *Les jeunes du centre* (`flag('jeunes_lances')` ; indice : « Le vestiaire est de bric et de broc. Le centre, non. »).
**alarm_override** : `caisse.low` → `jp.geant.alarme_vialat_ligne` (Vialat : « Je ne juge pas, je compte : votre salaire est la ligne trois, et la ligne trois est trop longue. »).

### SCÈNE jp.geant.g1_six_titres  —  Six titres au mur
**Rôle** : joueur · **Intrigue** : jp.geant.dechu · **Étape** : 1/9 · **Moment** : saison 0, slot 1 · **Lieu** : le vestiaire, six écussons dorés au mur, dix-neuf casiers vides, Bréhaut en costume · **Conditions** : —
**BRÉHAUT** *(directeur sportif — neutre — il compte les casiers pleins sur ses doigts, il n'a pas besoin des deux mains)*
« Le groupe vit bien, enfin, le groupe c'est toi, trois vieux, le centre de formation et un gardien de prêt ; on a six titres au mur et pas de quoi payer le mur. Tu gardes le brassard pour la remontée, ou tu me laisses te vendre pour payer le mur ? »
← **Je garde le brassard** — effets : tribunes ++, vestiaire +, caisse −, set: brassard_garde_dechu — *Tu le gardes. Gégé fait un tifo avec les six titres et ton numéro en dessous, en plus grand.*
→ **Vends-moi, paie le mur** — effets : caisse +++, tribunes −−−, set: brassard_refuse, club: {change: true, division: 1} — *Il te vend. Le mur est payé. Le tifo de Gégé est fait quand même ; il dit « JUDAS » en dessous des titres.*
Variante `fil_rouge == 'fierte'` : « Le groupe vit bien, enfin, le groupe c'est six titres et un mur ; la Commission dit qu'on est en D2, la tribune dit qu'on est nous. Tu joues la D2 comme un géant, ou comme un club de D2 ? » — ← **Comme un géant** — tribunes ++, direction −, force −1, set: joue_geant · → **Comme un club de D2** — direction ++, tribunes −, force +1, set: joue_d2.
**Traces** : brassard_garde_dechu, brassard_refuse (« {annee} : {prenom} {nom} a rendu le brassard pour payer le mur. Le tifo l'a dit autrement. »), joue_geant, joue_d2 · **Réactions déclenchées** : co.re.gege_decoupe (∃) · **Lu plus tard par** : objectif `geant_brassard_garde`, jp.geant.g2_vialat, ch. 01 (Bréhaut DS), ch. 90 (mémoire du géant : −3 si vendu)

### SCÈNE jp.geant.g2_vialat  —  La ligne trois
**Rôle** : joueur · **Intrigue** : jp.geant.dechu · **Étape** : 2/9 · **Moment** : saison 0, [10,11] · **Lieu** : une salle de réunion du club, Madame Vialat avec un classeur, Bréhaut qui regarde ses chaussures · **Conditions** : —
**VIALAT** *(l'Inspecteur — neutre — elle lit la ligne trois, qui est toi, sans lever les yeux)*
« Je ne juge pas, je compte : votre salaire est la ligne trois du budget, et la ligne trois empêche de recruter en janvier. Vous baissez votre salaire de moitié, monsieur {nom}, ou le club joue à dix-huit jusqu'en juin ? »
← **De moitié, pour janvier** — effets : caisse −−, vestiaire ++, tribunes +, set: salaire_baisse — *Tu signes l'avenant. Bréhaut recrute deux jeunes et un vieux. Vialat compte ; ça tombe juste.*
→ **À dix-huit jusqu'en juin** — effets : caisse +, vestiaire −−, direction −, set: dix_huit — *Vous jouez à dix-huit. Les jeunes du centre remplissent le banc ; ils ne remplissent pas encore le terrain.*
**Traces** : salaire_baisse (« {annee} : {prenom} {nom} a baissé son salaire de moitié. Vialat a compté ; ça tombait juste. »), dix_huit · **Réactions déclenchées** : jp.re.josiane_petite_avenant (§ 7) · **Lu plus tard par** : jp.geant.g3_jeunes, ch. 02 (Vialat : `ligne_douze` variante « vous aviez baissé la ligne trois »), une.geant.moitie, ch. 13 (`geant_dechu` côté bureau : « le capitaine avait baissé son salaire »)

### SCÈNE jp.geant.g3_jeunes  —  Les jeunes du centre
**Rôle** : joueur · **Intrigue** : jp.geant.dechu · **Étape** : 3/9 · **Moment** : saison 0, slot 16 · **Lieu** : le terrain annexe, sept gamins de dix-sept ans, Vukić avec son cahier · **Conditions** : —
**VUKIĆ** *(entraîneur — neutre — le cahier ouvert à une page avec sept prénoms et un seul nom, le tien)*
« Je te le dis parce que personne ne te le dira : dimanche c'est le dernier match, et je peux lancer les sept gamins d'un coup, avec toi devant pour les tenir, ou trois. Sept, ou trois ? »
← **Les sept, je les tiens** — effets : vestiaire ++, tribunes ++, force −2, set: jeunes_lances — *Tu les tiens. Vous gagnez deux à un ; le deux, c'est un gamin ; le un, c'est toi.*
→ **Trois, on ne joue pas avec le feu** — effets : direction +, force +1, vestiaire − — *Trois jouent. Les quatre autres regardent depuis le banc ; l'un d'eux signe ailleurs en juin.*
**Traces** : jeunes_lances (« {annee} : sept gamins du centre lancés d'un coup. {prenom} {nom} devant, pour les tenir. ») · **Réactions déclenchées** : — · **Lu plus tard par** : objectif `geant_jeunes`, ch. 11 (le second prodige : « les sept gamins »), ch. 13 (côté bureau), une.geant.sept_gamins

### SCÈNE jp.geant.g4_virage  —  Le dernier virage du géant
**Rôle** : joueur · **Intrigue** : jp.geant.dechu · **Étape** : 4/9 · **Moment** : saison 0, slot 17 · **Lieu** : la buvette des anciens, Vecchio derrière le comptoir, la place 14B vide dans la tribune Est visible par la fenêtre · **Conditions** : —
**VECCHIO** *(buvette des anciens, 63 ans — sourire — il essuie un verre qui est déjà propre)*
« J'en ai vu d'autres, des géants qui tombent, et ils remontent tous, sauf ceux qui font semblant d'être encore en haut. Demain, tu joues pour la Une de la remontée, ou pour la place 14B ? »
← **Pour la Une** — effets : tribunes ++, direction + — *Tu joues pour la Une. Elle est belle, ou elle attend un an de plus.*
→ **Pour la place 14B** — effets : tribunes +, vestiaire +, relation.vecchio +1, set: pour_paulette — *Tu joues pour une place vide. Le stade la connaît. On ne s'y assoit plus depuis 2009.*
**Traces** : pour_paulette (sans Almanach) · **Réactions déclenchées** : co.re.vecchio_garde (∃) · **Lu plus tard par** : ch. 31 (anecdote Paulette : la place 14B), set-piece `gm_annonce` (ch. 30, variante « la place vide »)

**S1 / S2+ (résumé)** : `jp.geant.s1_premier_jour` — remontée faite (pose `geant_remonte` ; Gégé : « la tribune n'oublie rien, elle a compté : deux saisons ») ou pas (Bréhaut : « on vend un gamin ») · `jp.geant.s1_twist` — *La Commission revient* : Vialat, seconde lettre ; le capitaine témoigne (« je ne juge pas, je compte, et vous, vous signez ») · `jp.geant.s1_veille` — Sacha, huit ans : « Tu m'as promis qu'on remonterait. » (une carte par saison, ch. 01) · `jp.geant.s2_rentree` — Bréhaut, « encore » : « le groupe c'est toi et dix gamins, maintenant » · `jp.geant.s2_veille` — Gégé, le tifo des six titres repeint avec un septième vide.

---

## 6. Le réservoir du joueur pro

Vingt-sept intrigues : seize écrites en entier (§ 6.1-6.16), onze en format compact (§ 6.17-6.27 : fiche au gabarit, scènes en trois lignes chacune, à développer par le chantier données sur ce modèle). Les pools par postulat sont dans les fiches des § 3-5. Rythme : une intrigue sur trois est légère (`absurde` ou `famille`) ; les deux drames (`co.pharmacie` variante victime, `jp.genou_parle` issue `genou_grave`) ne sont jamais tirés en S0 ni l'un après l'autre (ordre des pools).

### 6.1 INTRIGUE jp.tifo  —  Le tifo à ton nom
**Logline** : La Tribune Nord a peint ton nom sur vingt mètres ; elle veut une promesse : rester. · **Synopsis** : Gégé t'invite au local (trois bières, la compo à la craie). La semaine suivante, la bâche est prête : ton nom, vingt mètres, et une phrase en dessous que tu n'as pas écrite. Léa demande si tu confirmes. Aulard fait peindre le prix à côté. Un an plus tard, la bâche est toujours là, ou pliée, ou brûlée, selon ce que tu as fait de ta promesse. C'est l'intrigue signature de la pépite : la tribune adore, puis siffle.
**Rôle(s)** : joueur · **Postulat(s)** : pepite (signature), capitaine_dechu, binational · **Porteur** : gege · **Cast** : gege, lea, aulard, camille, paulette · **Thème** : tribune
**Saisons** : "0" · **Conditions d'entrée** : `gauges.tribunes >= 65` · **Exclusions** : — · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `promis` → `enfant_du_pays` (« {annee} : vingt mètres de bâche à {ville}. {prenom} {nom} a promis de rester. À la craie, pour l'instant. ») → jp.pepite.p2_hiver, jp.pepite.p3_vente, objectif `pepite_enfant_du_club`, une.pepite.enfant_reste, alarme tribunes haute, ch. 11 (`pacte_gege` : Gégé « a déjà eu une bâche à un nom »), ch. 13 (Gégé au président : « les abonnements ») · `honnete` → `honnete_tribune` (« {annee} : {prenom} {nom} a dit à la Nord qu'il ne promettait rien. Elle a gardé la bâche. ») → ch. 30 (trait Franc), une.pepite.honnete, co.retrouvailles.gege · `rien` → `ami_ultras` ou rien
**Séquencier** : local (ouverture, [2,9]) → bache [in 2,4] → une [in 0,1] → prix [in 2,5] → un_an_apres (S+1, [3,10]).

### SCÈNE jp.tifo.local  —  Le local
**Rôle** : joueur · **Intrigue** : jp.tifo · **Étape** : 1/5 · **Moment** : ouverture tirée · **Lieu** : la grille de la Tribune Nord, Gégé, une écharpe et une clé · **Conditions** : —
**GÉGÉ** *(capo — neutre — il fait tourner la clé du local autour de son doigt)*
« On te fait un tifo, petit, la Nord a voté ça hier soir, à main levée et à la troisième bière. Tu passes boire un coup au local, ou tu restes du côté des joueurs ? »
← **J'y vais** — effets : tribunes ++, direction −, relation.gege +1, set: ami_ultras — *Trois bières, la compo à la craie, ton nom déjà dessus. Tu rentres à une heure ; Camille demande à quelle heure, mais tu es déjà rentré.*
→ **Pas ce soir** — effets : tribunes −, direction +, relation.gege −1 — *Il range la clé. Le tifo se fait quand même ; il te le dira samedi, de loin.*
Variante `flag('pacte_gege')` (ch. 11 : un entraîneur de la lignée a signé le pacte) : « On te fait un tifo, petit, et le local, on l'a rénové grâce à quelqu'un qui portait ton nom, il y a longtemps ; la tribune n'oublie rien. Tu passes ? » — mêmes sorties, la gauche donne relation.gege +2.
**Traces** : ami_ultras (∃) · **Réactions déclenchées** : co.re.camille_journal (∃, `!flag('divorce')`, après ←) · **Lu plus tard par** : ch. 13 (les abonnements à cinq écus), ch. 15 (le compte anonyme), fin jp_siffle (epitaph_plus), co.retrouvailles.gege (ch. 90)

### SCÈNE jp.tifo.bache  —  Vingt mètres
**Rôle** : joueur · **Intrigue** : jp.tifo · **Étape** : 2/5 · **Moment** : [2,4] · **Lieu** : la Tribune Nord, avant le match, la bâche déroulée à moitié, ton nom en capitales · **Conditions** : —
**GÉGÉ** *(capo — sourire — il tient le bout de la bâche ; il y a une phrase en dessous de ton nom)*
« Vingt mètres, {NOM}, et en dessous on a écrit « ICI, POUR TOUJOURS » ; la tribune n'oublie rien, alors on voudrait que ce soit vrai. Tu le dis au micro, ou tu nous laisses l'écrire à ta place ? »
← **Je le dis : je reste** — effets : tribunes +++, direction −, parole +2, promise, set: enfant_du_pays, outcome: promis — *Tu le dis au micro du stade. Le stade hurle. Aulard, en loge, note la date ; il n'écrit pas la même chose.*
→ **Je ne promets rien** — effets : tribunes −, vestiaire +, parole +1, set: honnete_tribune, outcome: honnete — *Tu dis que tu ne sais pas. La Nord se tait dix secondes, puis chante quand même ; elle a payé la bâche.*
Variante `flag('derby_tete_haute')` (ch. 01, Camille) : Gégé ajoute « ta femme est passée par la porte du local hier, elle a dit que tu rentrais tard » ; sans effet.
**Traces** : enfant_du_pays, honnete_tribune · **Réactions déclenchées** : jp.re.lea_vingt_metres (§ 7) · **Lu plus tard par** : jp.pepite.p2_hiver, jp.pepite.p3_vente, jp.tifo.prix, jp.tifo.un_an_apres, objectif, une.pepite.enfant_reste, une.pepite.honnete, ch. 30 (trait Franc)

### SCÈNE jp.tifo.prix  —  Le prix à côté
**Rôle** : joueur · **Intrigue** : jp.tifo · **Étape** : 3/5 · **Moment** : [2,5] · **Lieu** : le bureau d'Aulard, la fenêtre donne sur la Nord, la bâche est encore accrochée · **Conditions** : —
**AULARD** *(président — neutre — il regarde la bâche par la fenêtre, il ne la regarde pas longtemps)*
« Vingt mètres à ton nom, c'est joli, et ça fait monter le prix, alors j'ai fait peindre le prix sur le panneau d'à côté ; j'ai pas le temps, j'ai une usine. Tu poses pour la photo avec les deux, ou tu demandes qu'on efface le prix ? »
← **Avec les deux** — effets : direction ++, tribunes −−, caisse + — *Tu poses. La photo montre ton nom et un chiffre. Gégé la découpe ; il coupe le chiffre.*
→ **Effacez le prix** — effets : direction −−, tribunes ++, relation.gege +1 — *Il ne l'efface pas. Il le fait peindre plus petit ; pour lui, c'est effacer.*
**Traces** : — · **Réactions déclenchées** : co.re.gege_decoupe (∃) · **Lu plus tard par** : alarme `jp.pepite.p9_alarme_tifo_lea`

### SCÈNE jp.tifo.un_an_apres  —  La bâche, un an après
**Rôle** : joueur · **Intrigue** : jp.tifo · **Étape** : 4/5 · **Moment** : saison suivante, [3,10] · **Lieu** : la Tribune Nord, ou le couloir des visiteurs, selon que tu es resté · **Conditions** : —
Variante `flag('enfant_du_pays') && flag('fidele')` — **GÉGÉ** *(sourire — la bâche repeinte en doré, le « POUR TOUJOURS » souligné)* : « Un an, et tu es là, alors on a repeint en doré, la tribune n'oublie rien, surtout pas ceux qui restent. Tu montes la tenir avec nous avant le match, ou tu restes sur la pelouse ? » — ← **Je monte** — tribunes ++, direction −, relation.gege +1 — *Tu tiens un bout. Tu vois le stade depuis là ; il est plus grand.* · → **Sur la pelouse** — tribunes +, vestiaire + — *Tu regardes d'en bas. Elle descend lentement ; ils la font durer.*
Variante `flag('enfant_du_pays') && flag('vendu_d1')` — **GÉGÉ** *(noir — la bâche pliée dans un sac poubelle, propre)* : « Un an, « ICI, POUR TOUJOURS », et tu joues en face ; la tribune n'oublie rien, alors on l'a pliée, pas brûlée. Tu viens la chercher, ou on la garde pour te la montrer ? » — ← **Je viens la chercher** — tribunes +, direction −, parole −1, relation.gege +1 — *Tu la prends. Elle pèse. Camille la met à la cave ; elle y est encore.* · → **Gardez-la** — tribunes −−, relation.gege −1 — *Il la garde. Il te la montre à chaque retour, pliée, dans le sac.*
Variante `flag('honnete_tribune')` — **GÉGÉ** *(neutre — la bâche telle quelle, sans la phrase)* : « On a gardé la bâche, sans la phrase, tu n'avais rien promis ; la tribune n'oublie rien, même ce qu'on ne lui a pas dit. Tu la signes, cette fois, ou toujours pas ? » — ← **Je la signe** — tribunes ++, parole +1, set: enfant_du_pays — *Tu signes au marqueur, en bas. C'est petit ; c'est là.* · → **Toujours pas** — tribunes +, vestiaire + — *Il hoche la tête. Il respecte ; il ne comprend pas.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 90 (mémoire du club), fin jp_siffle (epitaph_plus)
**Épilogue** : par abandon (club changé en cours d'intrigue), la bâche est pliée : `journal:` « {annee} : la bâche de {ville} a été pliée. Pas brûlée. »

### 6.2 INTRIGUE jp.brassard_test  —  Le test du capitaine
**Logline** : Les bouteilles d'eau, puis le penalty à sa place. Il teste. · **Synopsis** : Bréhaut, trente-trois ans et un genou, teste le nouveau : les bouteilles (ch. 01, `jp.brehaut.bouteilles`), le penalty désigné qu'il te prend, le toro où l'on ne te fait plus la passe si tu as refusé, puis, s'il t'a accepté, le brassard le jour où son genou dit stop. Le discours d'avant-derby est la cinquième scène, la vraie : le capitaine parle, ou se tait.
**Rôle(s)** : joueur · **Postulat(s)** : pepite, binational, retour_croises · **Porteur** : brehaut · **Cast** : brehaut, vecchio, vukic, mbako, dembo · **Thème** : vestiaire
**Saisons** : "0" · **Conditions d'entrée** : `chars.brehaut.statut == 'club'` · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `accepte` → `groupe_accepte` (ch. 01) → jp.brassard.penalty (variante), fin jp_porteparole · `mouton` → `mouton_noir` (« {annee} : plus personne ne fait la passe à {prenom} {nom}. Même au toro. ») → alarme `jp.alarme.vestiaire_bas_brehaut` (variante « plus de passe »), fin jp_mouton (plus), une.pepite.plus_de_passe, ch. 30 · `capitaine` → `capitaine` (∃ ; « {annee} : Titi Bréhaut a passé le brassard à {prenom} {nom}. Un peu trop fort sur l'épaule. ») → jp.brassard.discours, objectif `pepite_brassard_22`, ch. 11, ch. 14, ch. 30
**Séquencier** : jp.brehaut.bouteilles (∃, ouverture) → penalty [in 2,5] → toro [in 1,3] → genou_de_titi [in 3,8] → discours (S+1 ou [12,16], `requires: [capitaine]`).

### SCÈNE jp.brassard.penalty  —  Le tireur désigné
**Rôle** : joueur · **Intrigue** : jp.brassard_test · **Étape** : 2/5 · **Moment** : [2,5], en temps fort de Carte Match · **Lieu** : le point de penalty, 88e, un partout · **Conditions** : — (absorbe `jp.moment.penalty` ∃ : le texte existant devient la variante neutre ; celle-ci est la variante `groupe_accepte`)
**BRÉHAUT** *(capitaine — sourire si `groupe_accepte` — le ballon sous le bras, il te le tend à moitié)*
« Je suis le tireur désigné, mais tu as porté les bouteilles, alors je te pose la question une fois : le groupe vit bien quand on sait qui tire. Toi, ou moi ? »
← **Toi, capitaine** — effets : vestiaire ++, tribunes −, relation.brehaut +1 — *Il tire. Il marque. Il te montre du doigt en courant ; le groupe a vu.*
→ **Moi** — effets : vestiaire −, rand: [{p: 0.7, tribunes +++, set: penalty_marque}, {tribunes −−, vestiaire −, set: penalty_rate}] — *Tu tires. Le stade retient. Il retient jusqu'au filet, ou jusqu'au poteau.*
Variante `flag('mouton_noir')` : il ne te tend pas le ballon ; un bouton — **Je regarde** — vestiaire − — *Il tire sans te regarder. Il marque. Personne ne te tape dans le dos ; personne ne te voit.*
**Traces** : penalty_marque, penalty_rate (sans Almanach) · **Réactions déclenchées** : jp.re.vecchio_bouteilles_vendues (§ 7, après ← si `mouton_noir` a été évité de justesse) · **Lu plus tard par** : jp.brassard.genou_de_titi (variante), temps fort *Le penalty* (§ 9)

### SCÈNE jp.brassard.toro  —  Le toro
**Rôle** : joueur · **Intrigue** : jp.brassard_test · **Étape** : 3/5 · **Moment** : [1,3] · **Lieu** : le rond du toro à l'entraînement, Vecchio au milieu, qui n'y est jamais · **Conditions** : —
**VECCHIO** *(gardien, 41 ans — neutre — il est au milieu du toro, il attend le ballon depuis dix minutes)*
« Dix minutes au milieu, et j'ai touché le ballon deux fois, et toi zéro, on ne te le passe pas. J'en ai vu d'autres, petit : tu dis quelque chose, ou tu attends qu'on te le passe ? »
← **Je dis quelque chose** — effets : vestiaire +, tribunes −, rand: [{p: 0.5, clear: mouton_noir, set: groupe_accepte}, {vestiaire −}] — *Tu dis « oh ». Bréhaut te passe le ballon, une fois, fort. C'est un début, ou une fin.*
→ **J'attends** — effets : vestiaire −−, force +1, set: mouton_noir — *Tu attends. Le toro finit sans toi. Le lendemain, tu t'entraînes à côté ; c'est plus calme.*
Variante `flag('sac_porte')` (amateur, `lache_academie`) : Vecchio ajoute « tu as déjà porté un sac un mois ailleurs, ici c'est pareil, en plus long » ; la gauche a `p: 0.7`.
**Traces** : mouton_noir, groupe_accepte · **Réactions déclenchées** : — · **Lu plus tard par** : alarme vestiaire basse (variante « plus de passe »), fin jp_mouton, une.pepite.plus_de_passe

### SCÈNE jp.brassard.genou_de_titi  —  Le genou de Titi
**Rôle** : joueur · **Intrigue** : jp.brassard_test · **Étape** : 4/5 · **Moment** : [3,8] · **Lieu** : le vestiaire, Bréhaut assis, le brassard à la main, Vecchio debout · **Conditions** : `flag('groupe_accepte')` (absorbe `jp.vestiaire.brassard` ∃ : le texte existant reste, cette scène en est la variante « après le test »)
**BRÉHAUT** *(capitaine — neutre — il fait tourner le brassard autour de deux doigts)*
« Mon genou dit stop, pas moi, mais c'est lui qu'on écoute ; le groupe vit bien avec un brassard qui court. Tu le prends, ou je le passe à Vecchio et tu attends ton tour ? »
← **Je le prends** — effets : vestiaire +, direction +, set: capitaine, outcome: capitaine — *Il te le met lui-même. Il serre un peu trop fort sur l'épaule ; il le fait exprès.*
→ **Donne-le à Gigi** — effets : vestiaire ++, tribunes −, relation.vecchio +1, set: brassard_gigi — *Vecchio le met sur le gant. Il tombe deux fois par match ; le stade applaudit quand il le remet.*
**Traces** : capitaine (∃), brassard_gigi (lu par ch. 01 `en.vecchio.brassard`) · **Réactions déclenchées** : jp.re.vukic_capitaine (§ 7) · **Lu plus tard par** : jp.brassard.discours, objectif `pepite_brassard_22`, ch. 01 (Vecchio), ch. 11, ch. 14, ch. 30 (jp_porteparole plus)

### SCÈNE jp.brassard.discours  —  Le discours d'avant-derby
**Rôle** : joueur · **Intrigue** : jp.brassard_test · **Étape** : 5/5 · **Moment** : [12,16] ou saison suivante, la semaine du derby · **Lieu** : le vestiaire, Vukić à la porte, le groupe assis · **Conditions** : `flag('capitaine')` (absorbe `jp.vestiaire.discours` ∃)
**VUKIĆ** *(entraîneur adjoint — neutre — il te laisse la place au milieu, il reste près de la porte)*
« Capitaine, c'est à toi de parler au groupe avant le derby, et je te le dis parce que personne ne te le dira : ils t'écoutent depuis le brassard, pas depuis avant. Discours de feu, ou silence et terrain ? »
← **Discours de feu** — effets : rand: [{p: 0.6, vestiaire ++, tribunes +}, {vestiaire −}], set: discours_feu — *Tu parles. Mbako regarde ses chaussures ; Dembo regarde le plafond ; Bréhaut te regarde, toi.*
→ **Silence, place au terrain** — effets : vestiaire +, force +1 — *Tu ne dis rien. Vecchio dit « allez ». Ça suffit ; il en a vu d'autres.*
**Traces** : discours_feu (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : co.derby (variante « le capitaine a parlé »), ch. 14 (Fauvel : « tu as déjà parlé à un vestiaire »)
**Épilogue** : par abandon, `groupe_accepte` ou `mouton_noir` restent (ce sont des réputations) ; ligne « {annee} : Bréhaut a testé {nom}. Le groupe a noté. »

### 6.3 INTRIGUE co.mbako_rival  —  Le prodige d'après
**Logline** : Lian Mbako a seize ans, ton poste, et une mère qui dit qu'il n'a besoin de personne. · **Synopsis** : Il prend ta place à l'entraînement, puis en match. Sa mère t'explique que tu étais le prochain ; Vukić doit choisir ; le penalty se dispute ; à +3, il te demande de partir avec lui quand on le vend. En saison suivante, s'il est vendu (`mbako_vendu`, ch. 11 ou Nouvelle), il joue contre toi. Variante « papy » pour `fin_de_contrat` (tu as trente et un ans ; il t'appelle papy). Partagée avec l'entraîneur (ch. 11 en écrit le côté banc).
**Rôle(s)** : joueur · **Postulat(s)** : pepite, fin_de_contrat (variante papy), retour_croises (« il a pris ta place pendant que tu boitais »), binational (« la star te reçoit ») · **Porteur** : mbako · **Cast** : mbako, mere_mbako, vukic, fardelli, vecchio · **Thème** : vestiaire
**Saisons** : "0", "1" · **Conditions d'entrée** : `chars.mbako.statut == 'club' && chars.mbako.age <= 24` · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `mentor` → `mentor_mbako` (« {annee} : {prenom} {nom} a appris le contrôle à Lian Mbako. Il fait mieux ; c'était le but. ») → ch. 01 (Mbako +3 à vie ; `co.mbako.faveur_refus_grand_club` ∃), ch. 14 (« vous m'avez appris »), une.pepite.deux_pepites, jp.mbako.contre_toi (variante) · `rival` → `rival_mbako` (« {annee} : Lian Mbako et {prenom} {nom}, un poste pour deux. Le vestiaire a compté les points. ») → ch. 11 (Mbako coach rival, 2018), ch. 90 (Nemesis doux) · `demande_vente` → `demande_vente` → jp.pepite.p3_vente (variante « tu as demandé à partir »), une.pepite.demande
**Séquencier** : place (ouverture, absorbe `jp.vestiaire.jeune_pousse` ∃) → mere [in 1,3] → vukic [in 2,4] → penalty [in 1,4] (absorbe `jp.vestiaire.penalty_prodige` ∃) → partir_avec_moi [in 3,8] (`relation.mbako >= 2`) → contre_toi (S+1, `requires: [mbako_vendu]`).

### SCÈNE jp.mbako.mere  —  Elle t'explique
**Rôle** : joueur · **Intrigue** : co.mbako_rival · **Étape** : 2/6 · **Moment** : [1,3] · **Lieu** : le parking, la mère de Mbako adossée à une voiture qui n'est pas la sienne · **Conditions** : —
**LA MÈRE DE MBAKO** *(mère et agente — neutre — elle a un dossier sous le bras, qui n'est pas celui de son fils)*
« Mon fils n'a besoin de personne, et surtout pas d'un aîné qui lui montre comment on fait ; vous aviez dix-neuf ans, vous aussi vous étiez le prochain. Vous l'aidez, ou vous le laissez passer ? »
← **Je l'aide** — effets : vestiaire +, force −1, relation.mbako +1, relation.mere_mbako −1, set: mentor_mbako, outcome: mentor — *Tu restes après l'entraînement. Il copie. Sa mère regarde depuis la voiture ; elle note.*
→ **Je le laisse passer, seul** — effets : tribunes +, vestiaire −, relation.mbako −1, set: rival_mbako, outcome: rival — *Il passe. Seul. Il joue mieux que toi en mars ; il ne te le dit pas, il n'a pas besoin.*
Variante `flag('mbako_decide')` (ch. 01) : « Mon fils n'a besoin de personne, et il m'a dit « je décide » l'autre jour, avec vos mots, monsieur ; vous l'aidez encore, ou vous arrêtez de lui souffler ? » — mêmes sorties, la gauche donne relation.mere_mbako −2.
Variante `age >= 30` (« papy ») : « Mon fils n'a besoin de personne, et le coach lui a dit qu'il prenait votre place dimanche, sans rancune, papy ; vous l'aidez, ou vous défendez votre place ? »
**Traces** : mentor_mbako, rival_mbako · **Réactions déclenchées** : co.re.mere_mbako_souffle (ch. 01) · **Lu plus tard par** : jp.mbako.vukic, jp.mbako.partir_avec_moi, jp.mbako.contre_toi, ch. 01, ch. 11, ch. 14, ch. 90

### SCÈNE jp.mbako.vukic  —  Le choix de Vukić
**Rôle** : joueur · **Intrigue** : co.mbako_rival · **Étape** : 3/6 · **Moment** : [2,4] · **Lieu** : le couloir, la feuille de match affichée, un seul nom pour le poste · **Conditions** : —
**VUKIĆ** *(entraîneur adjoint — neutre — il tient la punaise, la feuille n'est pas encore accrochée)*
« Le coach veut le petit dimanche, et je te le dis parce que personne ne te le dira : il a raison cette semaine, pas la prochaine. Tu acceptes le banc sans rien dire, ou tu veux que je lui dise quelque chose ? »
← **Le banc, sans rien dire** — effets : direction +, vestiaire +, tribunes −, relation.vukic +1, set: banc_bosse — *Tu regardes le match. Mbako marque. Tu applaudis ; c'est filmé ; ça compte.*
→ **Dis-lui quelque chose** — effets : direction −, tribunes +, relation.vukic −1, relation.mbako −1, set: banc_boude — *Il lui dit. Le coach met le petit quand même. Il te met en tribune, pas sur le banc ; pour la leçon.*
**Traces** : banc_bosse, banc_boude (partagées avec jp.banc_hiver) · **Réactions déclenchées** : — · **Lu plus tard par** : jp.coach_qui_te_veut (`requires: [banc_bosse]`), fin jp_fils, une.pepite.boude

### SCÈNE jp.mbako.partir_avec_moi  —  Pars avec moi
**Rôle** : joueur · **Intrigue** : co.mbako_rival · **Étape** : 5/6 · **Moment** : [3,8] · **Lieu** : le vestiaire vide, le sac neuf de Mbako, l'étiquette encore dessus · **Conditions** : `relation.mbako >= 2`
**MBAKO** *(prodige — sourire — il ne regarde pas le sac cette fois, il te regarde)*
« Ils me vendent en juin, ma mère a signé, et j'ai dit que je voulais jouer, maintenant, et qu'on prenne aussi celui qui m'a appris. Tu viens avec moi, ou tu restes ici où on te met sur le banc ? »
← **Je viens avec toi** — effets : caisse +, tribunes −, direction −, set: demande_vente, outcome: demande_vente — *Tu demandes à partir. Aulard note « deux pour le prix d'un ». Il ne rit pas ; il n'a pas le temps.*
→ **Je reste, va jouer** — effets : vestiaire ++, relation.mbako +1, tribunes + — *Il part seul. Il t'envoie une carte sans texte, avec sa signature. Tu la gardes dans le casier.*
**Traces** : demande_vente · **Réactions déclenchées** : — · **Lu plus tard par** : jp.pepite.p3_vente (variante), une.pepite.demande, ch. 01 (`co.mbako.faveur_refus_grand_club`)

### SCÈNE jp.mbako.contre_toi  —  Il joue contre toi
**Rôle** : joueur · **Intrigue** : co.mbako_rival · **Étape** : 6/6 · **Moment** : saison suivante, [3,12], la semaine du match contre son club · **Lieu** : le rond central, Mbako dans un autre maillot, plus cher · **Conditions** : `flag('mbako_vendu')`
**MBAKO** *(star d'un autre club — sourire si `mentor_mbako`, neutre sinon — il te tend la main au tirage au sort, avant l'arbitre)*
« Trente millions, un sac neuf, et je veux jouer, maintenant, contre toi, c'est ce que je voulais. Tu me tacles comme un aîné, ou comme un adversaire ? »
← **Comme un aîné** — effets : vestiaire +, tribunes −, relation.mbako +1 — *Tu le laisses respirer une fois. Il marque. Il vient te chercher pour te montrer du doigt ; le stade ne comprend pas ; vous, si.*
→ **Comme un adversaire** — effets : tribunes ++, vestiaire +, force +1, rand: [{p: 0.2, relation.mbako −2, set: mbako_blesse_par_toi}, {}] — *Tu le tacles. Il se relève, ou pas. Sa mère, en tribune, note.*
Variante `flag('rival_mbako')` : « Trente millions, et je veux jouer, maintenant, contre celui qui m'a laissé passer seul ; tu me tacles, ou tu me regardes encore ? » — mêmes sorties.
**Traces** : mbako_blesse_par_toi (« {annee} : {prenom} {nom} a blessé Lian Mbako. Sa mère a noté. ») · **Réactions déclenchées** : co.re.gege_decoupe (∃) · **Lu plus tard par** : ch. 01 (Mbako, retrouvailles noires), ch. 11 (`en.retour_mbako`), ch. 90 (Nemesis)
**Épilogue** : ligne « {annee} : Lian Mbako a pris la place de {nom}. Ou l'inverse. »

### 6.4 INTRIGUE jp.contrat_image  —  Le contrat d'image
**Logline** : Une société aux îles pour ton image. Tu as dix-neuf ans, et une image. · **Synopsis** : Fardelli (ou le frère de Bréhaut, ou ton cousin) propose de loger tes droits à l'image dans une société lointaine. Camille remarque que le cousin a acheté une montre. Solvang, l'agente d'après, te propose un contrat propre, et refuse le double mandat. Le fisc arrive une saison plus tard, par Ménèche, et la fin *La carte Panama* attend au bout si le compte déborde.
**Rôle(s)** : joueur · **Postulat(s)** : pepite, fin_de_contrat (variante « à trente et un ans on prépare l'après »), banc_dore, capitaine_dechu · **Porteur** : fardelli · **Cast** : fardelli, camille, solvang, meneche, « ton cousin des îles » (voix), brehaut (variante frère) · **Thème** : argent
**Saisons** : "0", "2+" · **Conditions d'entrée** : `gauges.caisse >= 45` · **Rejouabilité** : replay {after: 2, max: 2}
**Issues** → **Traces** → **Qui les lit** : `signe` → `offshore` (∃ ; « {annee} : l'image de {prenom} {nom} est partie aux îles. Le cousin a acheté une montre. ») → jp.contrat_image.fisc, fin jp_panama, ch. 15 (La Plume), ch. 30, une.pepite.montre · `refuse` → `image_propre` → ch. 30 (trait Intègre), co.solvang (ch. 02) · `camille` → `camille_a_lu` → ch. 01 (Camille +1)
**Séquencier** : cousin (ouverture ; absorbe `jp.mercato.offshore_montage` ∃ et `jp.scandale.offshore` ∃, qui deviennent ses variantes) → montre [in 1,3] → solvang [in 2,6] → fisc (S+1, [4,10], `requires: [offshore]` ; absorbe `jp.mercato.fisc_lointain` ∃).

### SCÈNE jp.image.cousin  —  Une société aux îles
**Rôle** : joueur · **Intrigue** : jp.contrat_image · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : le restaurant de Fardelli, un cousin que tu n'as jamais vu, un dossier bleu · **Conditions** : —
**FARDELLI** *(agent — sourire — il présente le cousin d'un geste, comme un plat)*
« Ton cousin a monté une société aux îles pour ton image, zéro impôt, et tu as dix-neuf ans et une image, mon ami, on parle d'argent ou d'amitié. Tu signes sans lire, ou tu lis et tu signes quand même ? »
← **Je signe** — effets : caisse ++, relation.fardelli +1, set: offshore, outcome: signe — *Tu signes. Le cousin range le dossier. Il a une montre neuve la semaine suivante.*
→ **Je paie mes impôts** — effets : caisse −, tribunes +, direction +, set: image_propre, outcome: refuse — *Le cousin repart aux îles. Fardelli paie l'addition ; il la garde, pour la déduire.*
Variante `flag('brehaut_frere')` (ch. 01) : le locuteur devient **BRÉHAUT** : « Mon frère a un plan pour ton contrat d'image, aux îles, et le groupe vit bien quand tout le monde a le même plan. Tu signes avec lui, ou tu restes chez Fardelli ? » — ← **Avec ton frère** — caisse ++, relation.brehaut +1, relation.fardelli −2, set: offshore — *Le frère vend moins cher. Il vend quand même.* · → **Chez Fardelli** — vestiaire −, relation.brehaut −1 — *Titi ne dit rien. Le groupe fait la passe, un peu moins.*
Variante `age >= 30` : « Ton cousin a monté une société pour l'après, l'image d'un ancien joueur ça se vend vingt ans, mon ami, on parle d'argent ou d'amitié. Tu prépares l'après, ou tu le laisses venir ? »
**Traces** : offshore (∃), image_propre · **Réactions déclenchées** : jp.re.camille_montre (§ 7, après ←) · **Lu plus tard par** : jp.image.montre, jp.image.fisc, fin jp_panama, fin jp_sandwich (plus), ch. 15, ch. 30

### SCÈNE jp.image.montre  —  La montre du cousin
**Rôle** : joueur · **Intrigue** : jp.contrat_image · **Étape** : 2/4 · **Moment** : [1,3] · **Lieu** : la cuisine, Camille, un relevé de compte plié en deux · **Conditions** : `flag('offshore')`
**CAMILLE** *(neutre — elle ne déplie pas le relevé, elle attend que tu le fasses)*
« Tu rentres à quelle heure, et ton cousin, lui, il rentre avec quelle montre ; elle coûte trois mois de ton salaire. Tu lui demandes d'où elle vient, ou tu ne veux pas savoir ? »
← **Je lui demande** — effets : caisse −, direction +, relation.camille +1, set: camille_a_lu, outcome: camille — *Tu demandes. Le cousin dit « les frais ». Tu régularises la moitié ; l'autre moitié est déjà partie.*
→ **Je ne veux pas savoir** — effets : caisse +, relation.camille −1 — *Tu ne sais pas. Elle sait. Elle range le relevé dans un tiroir qui ferme à clé.*
**Traces** : camille_a_lu · **Réactions déclenchées** : — · **Lu plus tard par** : jp.image.fisc (variante « tu avais régularisé la moitié »), ch. 01 (Camille, palier +3 secours avocate)

### SCÈNE jp.image.solvang  —  Le double mandat refusé
**Rôle** : joueur · **Intrigue** : jp.contrat_image · **Étape** : 3/4 · **Moment** : [2,6] · **Lieu** : un café près de la gare, Ingrid Solvang, un seul contrat, deux pages · **Conditions** : —
**SOLVANG** *(agente — neutre — elle pose le contrat à plat, elle ne le pousse pas vers toi)*
« Mon client décide, moi je compte, et je compte que Fardelli touche des deux côtés de vos contrats d'image ; moi, un seul client par contrat. Vous changez d'agent, ou vous restez avec l'ami ? »
← **Je change d'agent** — effets : direction +, caisse −, relation.solvang +1, relation.fardelli −2, set: agent_solvang, clear: agent_fardelli — *Elle range le contrat signé. Fardelli l'apprend par Josiane ; il dit « on parlait d'amitié ».*
→ **Je reste avec l'ami** — effets : caisse +, relation.solvang −1 — *Elle laisse sa carte. Elle a le contrat de son premier client, celui que Fardelli lui a pris ; elle le garde pour vous.*
**Traces** : agent_solvang (« {annee} : {prenom} {nom} a quitté Fardelli pour Solvang. Un seul client par contrat. ») · **Réactions déclenchées** : jp.re.fardelli_amitie (§ 7, après ←) · **Lu plus tard par** : jp.clause (variante `page_trois_solvang`), ch. 02 (Solvang : elle reprend le carnet en 2018), ch. 12 (l'agente discrète), une.pepite.solvang

### SCÈNE jp.image.fisc  —  Le fisc
**Rôle** : joueur · **Intrigue** : jp.contrat_image · **Étape** : 4/4 · **Moment** : saison suivante, [4,10] · **Lieu** : la zone mixte, Ménèche, un dossier avec une île sur la couverture · **Conditions** : `flag('offshore')` (absorbe `jp.mercato.fisc_lointain` ∃)
**MÉNÈCHE** *(chroniqueur — neutre — il tient le dossier fermé ; il aime le tenir fermé)*
« Juste une question, hors micro : les îles ont fuité, votre nom, votre image, la montre de votre cousin. Vous régularisez avant que je publie, ou vous niez et je publie ? »
← **Je régularise** — effets : caisse −−, direction −, clear: offshore, set: regularise — *Tu paies. Le cousin garde la montre. Ménèche garde le dossier ; il ne publie pas ; il note.*
→ **Je nie** — effets : tribunes −−, direction −−, relation.meneche −1, rand: [{p: 0.3, end: jp_panama}, {}] — *Tu nies. Il publie. Le fisc lit le journal ; il lit vite.*
Variante `flag('camille_a_lu')` : « Juste une question, hors micro : la moitié est régularisée, votre femme a bien lu ; l'autre moitié est aux îles. Vous régularisez le reste, ou vous niez la moitié ? » — mêmes sorties, la droite a `p: 0.15`.
**Traces** : regularise · **Réactions déclenchées** : co.re.meneche_no_comment (∃) · **Lu plus tard par** : fin jp_panama, ch. 15 (La Plume : « les documents »), ch. 02 (Ménèche : `dossier_enterre` si `regularise && relation.meneche >= 2`)
**Épilogue** : ligne « {annee} : une société aux îles au nom de {nom}. Le cousin a gardé la montre. »

### 6.5 INTRIGUE jp.selection  —  La liste des vingt-six
**Logline** : Les Cobalts t'appellent. Le pays de ton père aussi. Ton club veut que tu déclares forfait. · **Synopsis** : Legruet t'appelle (la liste des espoirs, ou des A) ; Aulard veut un forfait pour ta cheville ; Fauvel te reçoit dans le groupe (« on est un groupe, pas une liste ») ; si tu as deux pays, ton père appelle. Tu rentres de sélection blessé, ou en héros, et Aulard te le fait payer ou t'en félicite. Pose `international`, `binational_choisi`, `selection_refusee`.
**Rôle(s)** : joueur · **Postulat(s)** : pepite, binational (signature, variante complète § 5.2), retour_croises, capitaine_dechu · **Porteur** : legruet · **Cast** : legruet, aulard, fauvel, lea, sabatier, « ton père, au téléphone » (voix) · **Thème** : instances
**Saisons** : "0", "1" · **Conditions d'entrée** : `gauges.tribunes >= 55 && !flag('international')` · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `cobalts` → `international` (∃ ; « {annee} : {prenom} {nom} en bleu cobalt. Le club a râlé pour la cheville. ») → ch. 14, ch. 15 (la voie de la légende), fin jp_siffle (plus), fin jp_panama (plus), une.pepite.bleu_cobalt, jp.derniere_selection · `autre` → `binational_choisi=kambara` → ch. 14, ch. 15, une.binational.autre_maillot · `refus` → `selection_refusee` (« {annee} : {prenom} {nom} a dit non à la Fédération. On ne dit pas non deux fois. ») → ch. 02 (Legruet à −1), ch. 14, ch. 15, une.pepite.forfait
**Séquencier** : liste (ouverture ; absorbe `jp.selection.liste` ∃ et `jp.corps.la_liste` ∃) → forfait [in 1,2] (absorbe `jp.corps.forfait` ∃) → groupe [in 1,3] → pere [in 0,2] (`flag('binational')`) → retour [in 2,4].

### SCÈNE jp.selection.liste  —  La liste
**Rôle** : joueur · **Intrigue** : jp.selection · **Étape** : 1/5 · **Moment** : ouverture tirée · **Lieu** : le secrétariat, Josiane qui te tend le téléphone avec un regard · **Conditions** : —
**LEGRUET** *(président de la Fédération — neutre — au téléphone, une voix de Congrès)*
« Cher ami, vous êtes dans ma liste, on verra ça après le Congrès pour le reste ; votre club, lui, voudrait que vous déclariez forfait pour votre cheville. Vous venez, ou vous êtes blessé ? »
← **Je viens** — effets : tribunes ++, direction −, set: international, outcome: cobalts — *Tu viens. Aulard l'apprend par Josiane ; il dit qu'il n'a pas le temps d'être fâché, et il l'est.*
→ **Je suis blessé, monsieur** — effets : direction ++, tribunes −, set: selection_refusee, relation.legruet −1, outcome: refus — *Tu déclares forfait. Legruet dit « on ne dit pas non deux fois ». Il ne le dit pas comme une menace ; c'en est une.*
Variante `flag('binational')` : « Cher ami, vous êtes dans ma liste, et je sais que l'autre fédération vous appelle aussi, on verra ça après le Congrès ; mais si vous venez, c'est pour toujours. Vous venez ? » — la gauche pose aussi `binational_choisi=cobalts`.
**Traces** : international, selection_refusee, binational_choisi · **Réactions déclenchées** : jp.re.aulard_cheville (§ 7) · **Lu plus tard par** : jp.selection.forfait, jp.selection.groupe, ch. 02, ch. 14, ch. 15, ch. 30, une.pepite.bleu_cobalt, une.pepite.forfait

### SCÈNE jp.selection.groupe  —  Un groupe, pas une liste
**Rôle** : joueur · **Intrigue** : jp.selection · **Étape** : 3/5 · **Moment** : [1,3] · **Lieu** : le hall de l'hôtel des Cobalts, Fauvel avec la clé de ta chambre · **Conditions** : `flag('international')`
**FAUVEL** *(capitaine des Cobalts — neutre — il te tend la clé, il garde la sienne dans l'autre main)*
« On est un groupe, pas une liste, et le groupe a une règle : le nouveau dort avec le plus vieux, c'est moi. Tu prends la chambre, ou tu demandes la tienne à la Fédération ? »
← **Je prends la chambre** — effets : vestiaire ++, tribunes +, relation.fauvel +1, set: chambre_fauvel — *Tu dors avec lui. Il ne dort pas. Il te raconte le tir au but de 1990 à deux heures du matin, une fois, et plus jamais.*
→ **La mienne, s'il vous plaît** — effets : direction +, vestiaire −, relation.fauvel −1 — *Tu as ta chambre. Le groupe l'apprend. Le groupe est une liste, pour toi, pendant deux fenêtres.*
**Traces** : chambre_fauvel (« {annee} : {prenom} {nom} a dormi dans la chambre de Fauvel. Il a entendu 1990. ») · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 14 (Fauvel : « tu as entendu 1990 »), jp.derniere_selection (variante), ch. 15 (Fauvel président du syndicat, 2006 : « on est un groupe »)

### SCÈNE jp.selection.pere  —  Le pays de ton père
**Rôle** : joueur · **Intrigue** : jp.selection · **Étape** : 4/5 · **Moment** : [0,2] · **Lieu** : le téléphone de l'hôtel, ton père, une ligne qui grésille · **Conditions** : `flag('binational') && !flag('binational_choisi')`
**TON PÈRE** *(voix sans portrait — il parle bas, on entend une radio derrière)*
« Le Kambara t'a appelé, je le sais avant toi, c'est mon cousin qui tient le téléphone de la fédération là-bas. Tu joues pour ici, ou pour nous ? »
← **Pour ici, papa** — effets : tribunes +, direction +, set: binational_choisi=cobalts — *Il dit « bien ». Il raccroche vite ; la ligne coûte. Il ne rappelle pas cette semaine.*
→ **Pour vous** — effets : tribunes −−, vestiaire +, set: binational_choisi=kambara — *Il ne dit rien. La radio derrière lui monte ; quelqu'un chante. C'est lui.*
**Traces** : binational_choisi · **Réactions déclenchées** : jp.re.vence_autre_maillot (§ 7, après →) · **Lu plus tard par** : ch. 14, ch. 15, ch. 20

### SCÈNE jp.selection.retour  —  Le retour au club
**Rôle** : joueur · **Intrigue** : jp.selection · **Étape** : 5/5 · **Moment** : [2,4] · **Lieu** : le bureau d'Aulard, un journal avec ta photo en bleu, ou une radio de ta cheville · **Conditions** : `flag('international')`
**AULARD** *(président — noir si `selection_refusee` a été évitée contre son avis — il tient le journal par un coin)*
« Tu es rentré de sélection, en héros ou en boitant, je ne sais pas encore, Sabatier n'a pas fini ; j'ai pas le temps, j'ai une usine. Tu joues dimanche pour me prouver que ça valait le coup, ou tu te reposes et je vends ? »
← **Je joue dimanche** — effets : tribunes ++, direction +, force −1, rand: [{p: 0.2, set: genou, tribunes −}, {}] — *Tu joues. Le stade chante le nom du pays et le tien, dans l'ordre. Aulard applaudit ; il regarde le prix.*
→ **Je me repose** — effets : direction −−, force +1, set: repos_selection — *Tu te reposes. Il vend en juin, ou pas ; il dit que c'est à cause de ça ; c'est faux.*
**Traces** : repos_selection · **Réactions déclenchées** : co.re.lea_confirme (∃) · **Lu plus tard par** : jp.pepite.p2_hiver (variante `international`)
**Épilogue** : ligne « {annee} : la Fédération a appelé {nom}. Le club a râlé. »

### 6.6 INTRIGUE jp.premiere_une  —  La première Une
**Logline** : Ta première conférence de presse ; tu dis « le meilleur », ou tu ne le dis pas. · **Synopsis** : Léa organise ta première conférence ; Ménèche a « juste une question, hors micro » ; tu te déclares « spécial », modeste, ou tu critiques le coach. Le vestiaire découpe l'article. Trois « je ne commente pas » fabriquent le mème (dès 2007 ; avant, la caricature de La Gazette Rose). Pose `special`, enfin lu.
**Rôle(s)** : joueur · **Postulat(s)** : pepite, binational, capitaine_dechu, banc_dore (variante Ménèche consultant) · **Porteur** : lea · **Cast** : lea, meneche, brehaut, vence · **Thème** : presse
**Saisons** : "0" · **Conditions d'entrée** : — · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `special` → `special` (∃ ; « {annee} : « le meilleur », a dit {prenom} {nom}. Le vestiaire a lu. ») → jp.une.vestiaire, fin jp_mouton (plus), une.pepite.le_meilleur, ch. 30 (Destin), ch. 11 (le vestiaire a lu) · `modeste` → `modeste_une` → ch. 20 (Écho) · `critique` → `coach_critique` (« {annee} : {prenom} {nom} a critiqué le coach en conférence. Le coach a lu aussi. ») → jp.banc_hiver (`if` : poids ×2), fin jp_place14b (plus)
**Séquencier** : conference (ouverture) → hors_micro [in 0,1] → vestiaire [in 1,3] → meme [in 3,8] (`vars.no_comment >= 3`).

### SCÈNE jp.une.conference  —  La première conférence
**Rôle** : joueur · **Intrigue** : jp.premiere_une · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : la salle de presse, deux journalistes et un stagiaire, Léa qui règle le micro · **Conditions** : —
**LÉA** *(attachée de presse — neutre — elle te tend une feuille avec trois phrases, tu n'es pas obligé)*
« Vous confirmez ? Trois phrases : « je suis content », « le groupe est bien », « merci le coach », et vous rentrez. Ou vous dites ce que vous pensez, et je gère demain ? »
← **Les trois phrases** — effets : direction +, tribunes −, set: modeste_une, outcome: modeste — *Tu lis. Ménèche bâille. L'Écho titre « Un garçon poli » ; c'est le pire titre possible, et il est gentil.*
→ **Ce que je pense** — effets : tribunes ++, direction −, vestiaire −, set: special, outcome: special — *Tu dis « je suis le meilleur ici ». Ménèche ne bâille plus. La Gazette Rose titre avant que tu sois rentré.*
Variante `year >= 2003 && chars.meneche.statut == 'consultant'` (banc_dore) : la conférence est un plateau de Télé-Stade ; Ménèche est en face, Vence présente ; mêmes sorties.
**Traces** : special, modeste_une · **Réactions déclenchées** : jp.re.brehaut_decoupe (§ 7, après →) · **Lu plus tard par** : jp.une.vestiaire, jp.une.hors_micro, fin jp_mouton, une.pepite.le_meilleur, ch. 11, ch. 30

### SCÈNE jp.une.hors_micro  —  Hors micro
**Rôle** : joueur · **Intrigue** : jp.premiere_une · **Étape** : 2/4 · **Moment** : [0,1] · **Lieu** : le couloir après la conférence, Ménèche, un magnéto qu'il dit éteint · **Conditions** : —
**MÉNÈCHE** *(chroniqueur — neutre — le magnéto dans la poche de poitrine, le voyant rouge visible)*
« Juste une question, hors micro : qui commande ce vestiaire, vous ou le coach ; répondez, ou j'écris la réponse à votre place. Le collectif, ou vous ? »
← **Le collectif, voyons** — effets : direction +, tribunes −, vars.no_comment +1 — *Tu dis « le collectif ». Il écrit « langue de bois ». Il a raison ; ça se lit.*
→ **Moi, et il le sait** — effets : tribunes ++, direction −−, vestiaire −, set: coach_critique, outcome: critique — *Il écrit ta phrase. Le coach la lit au petit-déjeuner ; il te met sur le banc au déjeuner.*
**Traces** : coach_critique · **Réactions déclenchées** : — · **Lu plus tard par** : jp.banc_hiver (`if`), fin jp_place14b (plus), ch. 02 (Ménèche : le dossier, six variantes)

### SCÈNE jp.une.vestiaire  —  Le groupe a découpé
**Rôle** : joueur · **Intrigue** : jp.premiere_une · **Étape** : 3/4 · **Moment** : [1,3] · **Lieu** : ton casier, un article découpé scotché dessus, une phrase surlignée · **Conditions** : `flag('special')`
**BRÉHAUT** *(capitaine — neutre — il est à côté du casier, il n'a pas scotché l'article lui-même, il l'a laissé faire)*
« Le groupe a découpé l'article et l'a mis dans ton casier, avec « le meilleur » en jaune ; le groupe vit bien quand tout le monde lit la même chose. Tu le laisses, ou tu l'enlèves devant eux ? »
← **Je le laisse** — effets : tribunes +, vestiaire −, force +1, set: special_assume — *Tu le laisses. Tu marques dimanche. L'article reste ; on ajoute la date du but au feutre.*
→ **Je l'enlève devant eux** — effets : vestiaire ++, tribunes −, clear: special, set: special_retire — *Tu l'enlèves. Tu le plies. Tu dis « pardon ». Dembo dit « enfin » ; il aime dire « enfin ».*
**Traces** : special_assume, special_retire · **Réactions déclenchées** : — · **Lu plus tard par** : fin jp_mouton (plus : « le groupe avait lu »), ch. 20

### SCÈNE jp.une.meme  —  Le mème
**Rôle** : joueur · **Intrigue** : jp.premiere_une · **Étape** : 4/4 · **Moment** : [3,8] · **Lieu** : la zone mixte, Ménèche avec un téléphone (ou une caricature découpée, avant 2007) · **Conditions** : `vars.no_comment >= 3`
**MÉNÈCHE** *(chroniqueur — sourire — il te montre l'écran, ta tête qui dit « je ne commente pas » en boucle)*
« Juste une question, hors micro : trois « je ne commente pas » en un mois, et le Flux en a fait une boucle, on vous voit dire ça à votre mariage, à votre enterrement. Vous en riez, ou vous commentez, enfin ? »
← **J'en ris** — effets : tribunes ++, direction −, relation.meneche +1, set: meme_assume — *Tu ris. Tu postes la boucle toi-même. Le club l'imprime sur un mug ; le mug se vend.*
→ **Je commente, enfin** — effets : tribunes +, direction −−, relation.meneche +1, parole +1 — *Tu commentes. Longtemps. Il note tout ; il en a pour deux Unes.*
Variante `year < 2007` : « Juste une question, hors micro : La Gazette Rose vous a dessiné en poteau de corner, avec « je ne commente pas » en bulle, c'est en page trois. Vous encadrez, ou vous répondez ? » — mêmes sorties.
**Traces** : meme_assume (« {annee} : {prenom} {nom} a ri de son propre mème. Le mug s'est vendu. ») · **Réactions déclenchées** : co.re.meneche_no_comment (∃) · **Lu plus tard par** : ch. 02 (Ménèche : `dossier_enterre` plus probable), ch. 20 (Gazette : « LE POTEAU DE CORNER »), ch. 31 (Nouvelle 2007 : le Flux)
**Épilogue** : ligne « {annee} : la première Une de {nom}. Le vestiaire l'a lue avant lui. »

### 6.7 INTRIGUE jp.banc_hiver  —  Le banc
**Logline** : Tu es sur le banc dimanche, et le coach ne te dira pas pourquoi. · **Synopsis** : Vukić te le dit (ch. 01, `jp.vukic.banc` : tu bosses ou tu boudes). Aulard propose le loft si tu veux partir en janvier ; Fardelli a dit aux recruteurs que tu étais blessé ; le retour dans le onze se fait par la petite porte, ou par la grande. En saison 2+, si tu as bossé, Vukić devenu coach ailleurs te veut (§ 6.20).
**Rôle(s)** : joueur · **Postulat(s)** : pepite, retour_croises · **Porteur** : vukic · **Cast** : vukic, aulard, fardelli, mbako, dembo · **Thème** : direction
**Saisons** : "0" · **Conditions d'entrée** : `world.serie_defaites >= 1 || gauges.direction < 40` ; poids ×2 si `flag('coach_critique')` · **Rejouabilité** : replay {after: 2, max: 2}
**Issues** → **Traces** → **Qui les lit** : `bosse` → `banc_bosse` (ch. 01) → jp.coach_qui_te_veut, fin jp_fils (plus), objectif `fin_passeur` · `boude` → `banc_boude` → une.pepite.boude, alarme direction basse · `partir` → `loft_tenu` ou `parti_janvier`
**Séquencier** : jp.vukic.banc (∃, ouverture) → loft [in 2,5] (absorbe `jp.mercato.loft` ∃) → recruteurs [in 1,3] → retour [in 2,6] ; variante « encore » sur la première scène propre (loft).

### SCÈNE jp.banc.loft  —  Le loft
**Rôle** : joueur · **Intrigue** : jp.banc_hiver · **Étape** : 2/4 · **Moment** : [2,5] · **Lieu** : le bureau d'Aulard, glacial, une porte qui donne sur le terrain des U17 · **Conditions** : —
**AULARD** *(président — noir si `banc_boude` — il te montre la porte des U17 sans se lever)*
« Sur le banc, tu coûtes le même prix que dans le onze, et j'ai pas le temps, j'ai une usine ; tu pars en janvier, ou tu t'entraînes avec les U17 jusqu'à ce que tu partes ? »
← **Je pars en janvier** — effets : caisse ++, tribunes −, relation.aulard +1, set: parti_janvier, club: {change: true}, outcome: partir — *Il te tend un stylo qui fuit. Tu signes avec. La tache est sur le contrat ; Josiane la garde.*
→ **Je tiens le loft** — effets : vestiaire −, tribunes ++, direction −−, relation.aulard −1, set: loft_tenu — *Tu t'entraînes avec des gamins de dix-sept ans. Mbako est dedans. Il te fait la passe ; il est le seul.*
Variante `plays('jp.banc_hiver') >= 1` (« encore ») : « Sur le banc, encore, et l'an dernier tu avais tenu le loft, je me souviens, j'ai pas le temps mais je me souviens. Cette fois tu pars, ou tu retournes chez les U17 ? »
**Traces** : parti_janvier, loft_tenu (« {annee} : {prenom} {nom} a tenu le loft avec les U17. Mbako lui faisait la passe. ») · **Réactions déclenchées** : co.re.josiane_a_lu (∃) · **Lu plus tard par** : jp.banc.retour, ch. 01 (Mbako +1), ch. 13 (le loft côté président), une.pepite.loft

### SCÈNE jp.banc.recruteurs  —  Trois recruteurs en tribune
**Rôle** : joueur · **Intrigue** : jp.banc_hiver · **Étape** : 3/4 · **Moment** : [1,3] · **Lieu** : le parking, Fardelli, trois hommes en doudoune qui repartent · **Conditions** : `flag('agent_fardelli')`
**FARDELLI** *(agent — neutre — il regarde les doudounes partir ; il compte)*
« Trois recruteurs en tribune et toi sur le banc, mon ami, alors j'ai dit que tu étais blessé, on parle d'argent ou d'amitié. Tu confirmes la blessure, ou tu dis que tu es sur le banc ? »
← **Je confirme, je suis blessé** — effets : caisse +, direction −, parole −1, set: blessure_inventee — *Sabatier signe un certificat sans te regarder. Il dit que ça reste entre la table et lui ; il ne dit pas quoi.*
→ **Je suis sur le banc, point** — effets : tribunes +, caisse −, relation.fardelli −1 — *Il dit « d'accord ». Les trois doudounes vont voir Mbako. C'est plus simple.*
Variante `flag('sans_agent')` : le locuteur devient **DEMBO** *(sourire — il t'a vu regarder les doudounes)* : « Donne-moi le ballon, je m'occupe du reste, et des recruteurs aussi, j'ai dit que tu étais blessé, ça se fait. Tu confirmes, ou tu vas leur parler toi-même ? »
**Traces** : blessure_inventee (« {annee} : {prenom} {nom} était « blessé » le jour des recruteurs. Le Doc a signé. ») · **Réactions déclenchées** : jp.re.sabatier_certificat (§ 7) · **Lu plus tard par** : ch. 01 (Sabatier, trahison −3 : « le dossier n'est plus entre la table et moi »), ch. 12 (visite médicale cachée), ch. 20

### SCÈNE jp.banc.retour  —  Le retour dans le onze
**Rôle** : joueur · **Intrigue** : jp.banc_hiver · **Étape** : 4/4 · **Moment** : [2,6] · **Lieu** : le couloir, la feuille de match, ton nom, en bas · **Conditions** : `!flag('parti_janvier')`
**VUKIĆ** *(entraîneur adjoint — sourire si `banc_bosse` — il te montre la feuille avec un doigt, en bas)*
« Tu es dedans dimanche, en bas de la feuille, et je te le dis parce que personne ne te le dira : c'est moi qui ai insisté, pas lui. Tu rentres par la petite porte et tu la fermes, ou tu attends la grande ? »
← **La petite porte** — effets : vestiaire +, tribunes +, force +1, relation.vukic +1, set: retour_petite_porte — *Tu joues vingt minutes. Tu fais une passe décisive à Mbako ; c'est le meilleur retour possible, et il est à lui.*
→ **J'attends la grande** — effets : tribunes −, direction −, force −1 — *Tu attends. Elle ne s'ouvre pas cette saison. Vukić range le cahier ; il souligne ton nom quand même.*
**Traces** : retour_petite_porte · **Réactions déclenchées** : — · **Lu plus tard par** : jp.coach_qui_te_veut (variante « tu étais rentré par la petite porte »), objectif `fin_passeur`
**Épilogue** : ligne « {annee} : sur le banc, {nom} a bossé, ou a boudé. Vukić a noté. »

### 6.8 INTRIGUE jp.genou_parle  —  Le genou qui parle (et Le genou à vingt ans)
**Logline** : Radio en main, Sabatier : fêlé. Tu finis la saison, ou tu la finis vraiment. · **Synopsis** : Une seule intrigue, deux entrées : `jp.genou_parle` (fin_de_contrat, signature, `age >= 30`) et `jp.genou_20` (pepite, S1, `age < 25` : la première gêne). Le verdict, les deux plateaux (le bistouri ou la piqûre), Rouvier qui voit ce que le Doc cache, la rechute, Camille qui te voit boiter à la maison, et la visite médicale du club acheteur en saison suivante si tu as caché. Absorbe les cartes `jp.corps.*` existantes citées.
**Rôle(s)** : joueur · **Postulat(s)** : fin_de_contrat (signature), pepite ("1"), retour_croises (variante « le genou neuf »), capitaine_dechu · **Porteur** : sabatier · **Cast** : sabatier, rouvier, camille, fardelli, vukic · **Thème** : corps
**Saisons** : "0" (fin_de_contrat), "1" (pepite) · **Conditions d'entrée** : `flag('genou') || age >= 28` (genou_parle) ; `age < 25 && season >= 1` (genou_20) · **Rejouabilité** : jamais · **[drame]** pour l'issue `genou_grave` seulement (la scène de rechute est sobre)
**Issues** → **Traces** → **Qui les lit** : `bistouri` → `genou_opere` (« {annee} : le genou de {prenom} {nom} a parlé. Le bistouri a répondu. Six mois de tribune. ») → jp.fin.f2_offre, jp.fin.f3_juin, ch. 12 (visite médicale), ch. 14, ch. 30 (Carrefour, *Les croisés*), une.fin.genou_parle · `piqure` → `infiltre` (∃), 50 % `genou_grave` → une.fin.dernier_mot, objectif, fin *Les croisés* · `silence` → `genou_cache` → jp.pepite.p3_vente (variante visite), jp.genou.visite, ch. 12
**Séquencier** : radio (ouverture ; absorbe `jp.corps.verdict_genou` ∃ / `jp.corps.premiere_gene` ∃) → plateaux [in 1,3] (absorbe `jp.corps.infiltration` ∃) → rouvier [in 1,2] → rechute [in 3,6] (`infiltre` ; absorbe `jp.corps.rechute` ∃) → maison [in 1,4] → visite (S+1, [1,6], `genou_cache` ; absorbe `jp.corps.visite_medicale` ∃).

### SCÈNE jp.genou.radio  —  La radio
**Rôle** : joueur · **Intrigue** : jp.genou_parle · **Étape** : 1/6 · **Moment** : ouverture tirée · **Lieu** : la salle de soins, la radio contre le néon, la table, une serviette pliée · **Conditions** : —
**SABATIER** *(médecin — neutre — il montre la fissure avec le capuchon du stylo, pas avec le doigt)*
« Fêlé, là, et ça reste entre la table et moi, mais ton agent a demandé la radio ce matin. Tu finis la saison avec, ou tu la finis vraiment, maintenant ? »
← **Je finis la saison avec** — effets : tribunes ++, force −3, set: genou — *Tu joues. Il range la radio dans le tiroir, pas dans le dossier. Fardelli demande le dossier ; le tiroir, il ne connaît pas.*
→ **Je la finis vraiment** — effets : direction +, tribunes −−, set: genou, set: genou_arrete — *Tu t'arrêtes. Le stade apprend « blessure » ; il n'apprend pas quoi. Six mois, ou moins, ou plus.*
Variante `flag('sabatier_confie')` (ch. 01) : « Fêlé, et tu m'avais dit mars, ça tirait depuis mars, ça reste entre la table et moi ; on a perdu deux mois à ne pas le dire. Tu finis la saison, ou tu la finis vraiment ? » — la gauche donne force −2 (il a vu venir).
Variante `age < 25` (genou_20) : « Ça, c'est un genou qui a des choses à te dire, à vingt ans, et ça reste entre la table et moi. On l'écoute maintenant, ou en mai ? » — ← **Maintenant** — force +3, tribunes −, set: genou_ecoute · → **En mai** — tribunes +, force −2, set: genou.
Variante `flag('genou_opere') && year >= 1998` (retour_croises) : « Il est neuf, ton genou, la radio le dit, et moi je dis qu'il est neuf comme une voiture neuve : les six premiers mois, on roule doucement. Tu roules doucement, ou tu roules ? »
**Traces** : genou (∃), genou_arrete, genou_ecoute · **Réactions déclenchées** : jp.re.sabatier_radio_agent (§ 7) · **Lu plus tard par** : jp.genou.plateaux, jp.fin.f2_offre, ch. 12, ch. 30

### SCÈNE jp.genou.plateaux  —  Deux plateaux
**Rôle** : joueur · **Intrigue** : jp.genou_parle · **Étape** : 2/6 · **Moment** : [1,3] · **Lieu** : la salle de soins, deux plateaux, l'un avec un bistouri, l'autre avec une seringue · **Conditions** : `flag('genou')` (absorbe `jp.corps.infiltration` ∃)
**SABATIER** *(médecin — neutre — il ne touche aucun des deux plateaux)*
« À gauche, le bistouri et six mois de tribune ; à droite, une piqûre et le match de dimanche, et ça reste entre la table et moi, le nombre de piqûres. Tu choisis lequel ? »
← **Le bistouri** — effets : tribunes −−, direction −, force +6, set: genou_opere, outcome: bistouri — *Tu t'allonges. Six mois. Rouvier te fait respirer tous les matins ; elle compte les flexions à voix haute.*
→ **La piqûre** — effets : tribunes +, set: infiltre, rand: [{p: 0.5, set: genou_grave_arme}, {}], outcome: piqure — *Tu ne sens plus rien. C'est bien ça, le problème.*
**Traces** : genou_opere, infiltre (∃), genou_grave_arme (sans Almanach) · **Réactions déclenchées** : jp.re.sabatier_rien_sentir (§ 7, après →) · **Lu plus tard par** : jp.genou.rechute, jp.genou.rouvier, ch. 12, ch. 14, ch. 30, une.fin.genou_parle

### SCÈNE jp.genou.rouvier  —  La seconde voix
**Rôle** : joueur · **Intrigue** : jp.genou_parle · **Étape** : 3/6 · **Moment** : [1,2] · **Lieu** : la salle de kiné, la porte fermée, Rouvier qui parle bas · **Conditions** : —
**ROUVIER** *(kiné — neutre — elle regarde la porte du Doc en parlant, la porte est fermée)*
« Respire. Encore. Je vois ce que le Doc cache dans le tiroir et je ne peux rien dire, alors je te dis autre chose : ton genou a raison. Tu m'écoutes, moi, ou tu écoutes la piqûre ? »
← **Je t'écoute** — effets : force +2, tribunes −, relation.rouvier +1, clear: infiltre, set: rouvier_ecoutee — *Tu arrêtes les piqûres. Le Doc ne dit rien ; il range la seringue, il sait qui a parlé.*
→ **J'écoute la piqûre** — effets : tribunes +, relation.rouvier −1 — *Elle ne dit plus rien. Elle te fait respirer quand même, tous les matins ; c'est son métier, pas son avis.*
**Traces** : rouvier_ecoutee (« {annee} : Rouvier a dit à {prenom} {nom} que le genou avait raison. Il a écouté. ») · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 01 (Rouvier, fiche à écrire : « tu m'as écoutée une fois »), ch. 14 (kiné des Cobalts), objectif `croises_sans_piqure`, jp.genou.rechute (exclusion si `rouvier_ecoutee`)

### SCÈNE jp.genou.rechute  —  La rechute
**Rôle** : joueur · **Intrigue** : jp.genou_parle · **Étape** : 4/6 · **Moment** : [3,6] · **Lieu** : l'échauffement, l'herbe, Sabatier qui arrive en courant, ce qu'il ne fait jamais · **Conditions** : `flag('infiltre') && !flag('rouvier_ecoutee')` (absorbe `jp.corps.rechute` ∃)
**SABATIER** *(médecin — neutre — il te montre l'écran de l'échographe sans un mot, puis il parle)*
« Le genou a lâché à l'échauffement, et je t'avais dit de ne rien sentir ; ça reste entre la table et moi, mais là, c'est le tiroir qui déborde. Cette fois, j'opère, ou tu reviens vite et mal ? »
← **Cette fois, opère** — effets : tribunes −−, direction −, force +4, clear: infiltre, set: genou_opere — *Tu t'allonges. Six mois. Tu les fais. Rouvier compte.*
→ **Je reviens vite** — effets : tribunes −, force −6, clear: infiltre, rand: [{p: 0.5, set: genou_grave}, {}] — *Tu reviens en six semaines. Tu joues. Le genou parle une dernière fois, ou il se tait pour de bon.*
**Traces** : genou_opere, genou_grave (« {annee} : le genou de {prenom} {nom} a eu le dernier mot. ») · **Réactions déclenchées** : — (drame possible : pas de réaction) · **Lu plus tard par** : une.fin.dernier_mot, fin *Les croisés* (jp_croises), objectif `fin_saison_entiere`, ch. 30 (Carrefour forcé si `genou_grave`)

### SCÈNE jp.genou.maison  —  Tu boites à la maison
**Rôle** : joueur · **Intrigue** : jp.genou_parle · **Étape** : 5/6 · **Moment** : [1,4] · **Lieu** : l'escalier de la maison, Camille en bas, toi en haut · **Conditions** : `flag('genou') && !flag('divorce')`
**CAMILLE** *(neutre — elle t'a entendu descendre ; elle sait compter les marches)*
« Tu rentres à quelle heure, je ne demande plus ; je demande à quelle heure tu vas dire au Doc que tu boites dans l'escalier. Tu lui dis, ou tu me laisses lui dire ? »
← **Je lui dis** — effets : direction −, force +1, relation.camille +1, set: genou_dit — *Tu lui dis. Il note « escalier » dans le tiroir. Il te laisse dimanche au repos ; le stade ne sait pas pourquoi.*
→ **Ne dis rien, s'il te plaît** — effets : tribunes +, relation.camille −1, set: genou_cache — *Elle ne dit rien. Elle regarde l'escalier tous les soirs ; elle compte les marches, elle aussi.*
Variante `flag('camille_medecin')` : « Tu rentres à quelle heure, et tu boites, je suis médecin, je vois ça de la cuisine. Je t'examine ici, ou tu vas voir Sabatier ? » — ← **Examine-moi** — force +2, relation.camille +1, set: genou_dit · → **Sabatier** — relation.camille −1, set: genou_cache.
**Traces** : genou_dit, genou_cache · **Réactions déclenchées** : — · **Lu plus tard par** : jp.genou.visite, jp.pepite.p3_vente (variante), ch. 12 (visite médicale cachée), ch. 01 (Camille)

### SCÈNE jp.genou.visite  —  La visite médicale
**Rôle** : joueur · **Intrigue** : jp.genou_parle · **Étape** : 6/6 · **Moment** : saison suivante, [1,6], ou au moment d'un transfert · **Lieu** : le cabinet du club acheteur, un kiné inconnu, Sabatier au téléphone · **Conditions** : `flag('genou_cache')` (absorbe `jp.corps.visite_medicale` ∃)
**SABATIER** *(médecin — neutre — au téléphone, il parle à voix basse, il est dans son bureau à toi)*
« Le club qui t'achète veut le bilan, et j'ai deux bilans : celui du dossier, propre, et celui du tiroir, qui boite ; ça reste entre la table et moi, mais là on me demande la table. J'arrondis, ou je dis tout ? »
← **Arrondis** — effets : direction +++, caisse +, parole −1, set: bilan_arrondi — *Il arrondit. Tu signes. Le kiné du club acheteur regarde ton genou pendant six mois, tous les matins ; il finit par comprendre.*
→ **Dis tout** — effets : direction −, tribunes +, relation.sabatier +1, set: bilan_vrai — *Il dit tout. Le club achète moins cher, ou n'achète pas. Il te serre la main ; il ne l'a jamais fait.*
**Traces** : bilan_arrondi (« {annee} : le bilan de {prenom} {nom} a été arrondi. Le genou, non. »), bilan_vrai · **Réactions déclenchées** : co.re.josiane_a_lu (∃) · **Lu plus tard par** : ch. 12 (`ds.sabatier.visite_cachee` : l'autre côté), ch. 01 (Sabatier, trahison/faveur), fin jp_sansclub (plus)
**Épilogue** : ligne « {annee} : le genou de {nom} a parlé. On l'a écouté tard. »

