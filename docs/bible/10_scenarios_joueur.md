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

**Pose** (charte § 5.2 et traces nouvelles) : `genou_opere`, `genou_grave`, `capitaine`, `international`, `binational_choisi` (valeur `cobalts` | `kambara`), `selection_refusee`, `offshore`, `mouton_noir`, `groupe_accepte`, `special`, `enfant_du_pays`, `honnete_tribune`, `essai_pro`, `patron_furieux`, `flacon_b`, `pharmacie_propre`, `derby_gagne`, `derby_perdu`, `camille_ici`, `sacha_nee` (via `jp.famille.naissance`, remarque du chapitre 01), `ami_ultras`, `diplome`, `agent_fardelli`, `sans_agent`, `vendu_d1`, `fidele`, `exil_dore`, `prolonge`, `sans_club`, `maison_pays`, `jubile_fait`, `memoires_verite`, `consultant`, `pari`, `pari_refuse`, `banc_bosse`, `banc_boude`, `mentor_mbako`, `rival_mbako`, `petition_portee`, `adieu_cobalt`, `brassard_refuse`, `copains_gardes`, `village_fusionne`, `dede_sifflet`, `montbeliac_cash`, `croises_rejoues`, `banc_dore_retour`, `geant_remonte`, `genou_petit_dit`, `blesse_par_respect`, `autre_pays_attend`, `retour_promis_gege`, `ligne_apres`, `primes_renoncees`, `sacha_tribune`, `papa_du_groupe`, `raconte_1990`, `colline_bonjour`, `page_lue_vukic`, `selection_ligue`, `chrono_brissac`, `but_poucet`, `maillot_echange`, `barque_ile_verte`, `bateau_rate`, `dede_a_table`, `brochure_arbitre`, `but_dorne`, `retour_reserve_valdorne`.

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
← **Je signe la fusion** — effets : direction ++, tribunes −−, vestiaire −, set: village_fusionne — *Tu signes en vert et marron. Dédé range sa casquette ; il ne signe rien, il n'a rien à signer.*
→ **Je reste Boisnoir** — effets : tribunes ++, vestiaire ++, direction −−, set: copains_gardes — *Momo signe derrière toi sur une serviette : « ES Boisnoir, on reste ». Le maire plie le chevalet.*
Variante `flag('patron_furieux')` : Aubert ajoute « et Montbéliac a un emploi à la mairie pour ceux qui n'en ont plus » ; la gauche donne caisse ++ en plus, la droite caisse −.
Variante `flag('essai_pro') && !flag('essai_rate')` : « On fusionne en juin, mais Valdorne m'a écrit pour votre indemnité de formation ; signez ici et le village touche quelque chose. » — gauche **Je signe, pour le village** — direction ++, caisse −, set: village_fusionne, set: indemnite_village — *Le village touche l'indemnité. Elle paie la buvette neuve. On ne mettra pas ton nom dessus.* ; droite **Je pars libre** — caisse ++, tribunes −−, set: copains_gardes — *Le village ne touche rien. Gérard fait le compte à voix haute, au bar.*
**Traces** : village_fusionne (« {annee} : Boisnoir et Montbéliac ont fusionné. {prenom} {nom} a signé en vert et marron. »), copains_gardes (« {annee} : {prenom} {nom} n'a pas signé la fusion. Momo non plus. Le maillot marron a duré un an de plus. »), indemnite_village · **Réactions déclenchées** : am.re.dede_casquette (§ 7) · **Lu plus tard par** : am.village.v4_bilan, am.village.s1_premier_jour, objectifs `village_detecte_avant` et `village_copains_gardes`, ch. 13 (`fusion_imposee` : « la fusion a déjà eu lieu une fois, en 1991, et la lignée s'en souvient »), ch. 20 (« BOISNOIR-MONTBÉLIAC, LE MARIAGE »), ch. 90 (mémoire des clubs : Loubières / Montbéliac)

### SCÈNE am.village.v4_bilan  —  Le dernier virage du village
**Rôle** : joueur_amateur · **Intrigue** : am.village.club_endette · **Étape** : 4/9 · **Moment** : saison 0, slot 17 (dernier virage) · **Lieu** : la buvette, Gérard qui compte, Dédé qui fait semblant de ne pas écouter · **Conditions** : —
**GÉRARD** *(bénévole, trésorier — neutre — la boîte en fer ouverte, des pièces en piles)*
« Ici, on payait en bières, et cette année on a payé l'arbitre en bières aussi. Dimanche, c'est le dernier match du maillot marron : tu joues pour la photo, ou tu joues pour gagner ? »
← **Pour gagner, on descend pas** — effets : vestiaire +, tribunes +, force +1 — *Tu gagnes. Le village met la photo au bar quand même, mais à côté de la caisse.*
→ **Pour la photo, tous ensemble** — effets : tribunes ++, vestiaire +, force −2 — *Dédé fait jouer les jumeaux, Momo, et le fils de Dupuis. Vous perdez. La photo est très belle.*
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
→ **Le marron, et le rôti** — effets : tribunes ++, caisse −, relation.dupuis −1 — *Il donne le rôti quand même. Il dit que c'est la dernière fois ; il le dit chaque année.*
Variante `plays() >= 2` : « Le meilleur du cochon, et je pèse mes mots : c'est le troisième rôti, et le maillot rose est toujours sur son cintre. Cette année, tu le mets ? »
**Traces** : boucher_sponsor (∃, déjà déclaré) · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 11 (drapeau existant), ch. 13 (Dupuis veut choisir le capitaine : « tu as porté le rose »), fin am_heros (epitaph_plus)

### 2.3 POSTULAT `lache_academie` — Lâché par l'académie

**Rôle** : `joueur_amateur` · **Année** : 1994 · **Club** : Régional 1 (tiré ; le pitch dit « le club d'à côté de Valdorne ») · **Jauges** : vestiaire 25 (les vieux te jalousent), tribunes 45, direction 60, caisse 40 · **Force** : 74 (tu as été formé à Valdorne ; c'est ce qui reste) · **Objectif** : la montée en National (70 points) · **Drapeaux** : `[academie, agent_fardelli]` (Fardelli est déjà collé aux basques : la seule situation amateur où il parle) · **Président** : « le président » (voix sans portrait) ; Fardelli est le patron narratif.
**Pitch** : Valdorne t'a rendu à dix-huit ans. Fardelli t'a gardé.
**Question de saison** : Ce que tu veux, c'est la revanche, l'oubli, ou la commission de Fardelli ? — `revanche` / `oubli` / `fardelli`.
**Cast** : fardelli (patron 2), barbier (l'homme du rapport 1,5 : c'est lui qui t'a rendu), dede (coach 1,5), josiane (0,5), gerard (1), lea (1), camille (1), dupuis (0,5), vecchio (0,5), roux (0,5), « les vieux du vestiaire » (voix 1).
**Objectifs cachés** : `academie_sans_fardelli` — *Signer pro sans Fardelli* (`flag('essai_pro') && flag('sans_agent')` ; indice : « L'agent est ton employé, pas ton père. ») · `academie_revanche` — *Le rapport déchiré* (`relation.barbier >= 2` ; indice : « Il t'a vu jouer sous la pluie. Une fois. ») · `academie_vestiaire` — *Les vieux t'ont adopté* (`gauges.vestiaire >= 60 && stats.saisons >= 2` ; indice : « Porte les ballons. Tous. »).
**alarm_override** : `vestiaire.low` → `am.alarme.vestiaire_bas_vieux` (« les vieux » : « Le petit de Valdorne ne fait plus la passe. On ne lui en fait plus non plus. »).

#### Le script `am.academie.rendu` (quatre ancres S0, trois S1, deux S2+ : neuf scènes)

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

### SCÈNE am.academie.s1_premier_jour  —  Relu
**Rôle** : joueur_amateur · **Intrigue** : am.academie.rendu · **Étape** : 5/9 · **Moment** : saison 1, [1,2] · **Lieu** : selon la variante · **Conditions** : —
Variante `flag('essai_pro') && !flag('essai_rate')` (première vraie) — **FARDELLI** *(agent — sourire — la voiture, moteur coupé cette fois, un fax de Valdorne sur le siège passager)* : « Valdorne a relu, mon ami, on parle d'argent ou d'amitié : ils te reprennent en réserve, à l'essai, six mois. Tu y retournes la tête haute, ou tu restes ici où on te fait la passe ? » — ← **J'y retourne** — direction +, tribunes −, set: retour_reserve_valdorne, club: {change: true} — *Tu retournes à la Dorne. Le casier a ton nom, au feutre ; le même feutre qu'il y a deux ans.* · → **Je reste ici** — vestiaire ++, relation.fardelli −1, set: fidele — *Tu restes. Les vieux te font la passe. Fardelli plie le fax en quatre ; il ne le jette pas.*
Secours — **DÉDÉ** *(coach bénévole — neutre — deux gamins de dix-sept ans derrière lui, un sac de ballons entre eux)* : « Bon, on va pas se mentir : cette année tu es un des vieux, on a pris deux gamins, et le sac, c'est la règle. Tu le portes avec eux, ou tu le leur laisses ? » — ← **Avec eux** — vestiaire ++, tribunes − — *Tu portes. Les gamins portent moins ; ils regardent comment tu fais.* · → **Je le leur laisse** — tribunes +, vestiaire − — *Tu le laisses. Le plus vieux te regarde ; il a porté avec toi, il y a un an.*
**Traces** : retour_reserve_valdorne (« {annee} : Valdorne a repris {prenom} {nom} en réserve, à l'essai. Le rapport avait été relu. »), fidele (∃) · **Réactions déclenchées** : — · **Lu plus tard par** : § 10.1 (Carte Destin : « tu es déjà à la Dorne »), ch. 02 (Barbier : « ils t'ont repris »), ch. 90 (mémoire de Valdorne : 0)

### SCÈNE am.academie.s1_twist  —  Le retour à la Dorne (twist)
**Rôle** : joueur_amateur · **Intrigue** : am.academie.rendu · **Étape** : 6/9 · **Moment** : saison 1, [10,11] (la Coupe a tiré Valdorne, l'équipe première, au stade de la Dorne) · **Lieu** : le couloir de la Dorne, côté visiteurs, Barbier qui descend de la tribune d'honneur pour te voir avant · **Conditions** : `!flag('retour_reserve_valdorne')`
**BARBIER** *(recruteur — neutre — il a mis une cravate sous la doudoune, c'est la Coupe)*
« Je l'ai vu jouer sous la pluie, et aujourd'hui c'est l'équipe première, chez nous, en Coupe, sans pluie. Tu joues pour les faire mentir, ou pour ne pas être ridicule ? »
← **Pour les faire mentir** — effets : tribunes ++, force +1, set: revanche_valdorne, rand: [{p: 0.3, set: but_dorne, tribunes ++}, {}] — *Tu joues fâché. Tu marques, ou tu tiens. Il écrit une page ; il ferme le calepin avant la fin.*
→ **Pour ne pas être ridicule** — effets : vestiaire +, force −1, set: tenu_dorne — *Tu joues juste. Vous perdez trois à zéro ; vous ne perdez pas six à zéro. Les vieux disent que c'est une victoire ; ils ont raison.*
Variante `flag('retour_reserve_valdorne')` : tu es dans l'autre couloir ; le locuteur devient **DÉDÉ** *(au téléphone, depuis le bar du village)* : « Bon, on va pas se mentir : tu joues contre nous, avec eux, et le village a fait le déplacement en car ; tu célèbres si tu marques, ou tu baisses la tête ? » — ← **Je baisse la tête** — tribunes +, relation.dede +1 — *Le car applaudit un adversaire. Gérard conduit ; il klaxonne.* · → **Je célèbre** — tribunes −−, relation.dede −1 — *Le car ne klaxonne pas. Il rentre sans s'arrêter au bar.*
**Traces** : but_dorne (« {annee} : {prenom} {nom} a marqué à la Dorne, contre l'équipe qui l'avait rendu. Barbier a écrit une page. »), tenu_dorne, revanche_valdorne · **Réactions déclenchées** : co.re.barbier_doudoune (ch. 02) · **Lu plus tard par** : § 10.1 (Carte Destin : poids ×2 si `but_dorne`), objectif `academie_revanche`, une.village.rendu, ch. 02 (Barbier), ch. 90

### SCÈNE am.academie.s1_veille  —  Rendu, ou formé à
**Rôle** : joueur_amateur · **Intrigue** : am.academie.rendu · **Étape** : 7/9 · **Moment** : saison 1, slot 17 · **Lieu** : le bar, Léa avec la maquette de la Une de L'Écho, un mot entouré · **Conditions** : —
**LÉA** *(L'Écho — neutre — elle tapote le mot entouré avec le stylo ; c'est « rendu »)*
« Vous confirmez ? « Le rendu de Valdorne joue la montée demain », c'est ma Une, et Valdorne a appelé pour qu'on n'écrive pas « rendu ». J'écris « rendu », ou « formé à » ? »
← **Rendu** — effets : tribunes ++, parole +1, relation.barbier −1, set: rendu_assume — *Elle écrit « rendu ». Valdorne rappelle ; elle ne décroche pas ; elle a un carnet pour ça.*
→ **Formé à** — effets : direction +, relation.barbier +1 — *Elle écrit « formé à ». Le village lit « rendu » quand même ; il sait lire entre.*
**Traces** : rendu_assume (sans Almanach) · **Réactions déclenchées** : co.re.lea_confirme (∃) · **Lu plus tard par** : ch. 20 (« LE RENDU DE VALDORNE »), ch. 02 (Barbier : « vous avez laissé écrire rendu »)

### SCÈNE am.academie.s2_rentree  —  L'amitié commence à coûter (rejouable)
**Rôle** : joueur_amateur · **Intrigue** : am.academie.rendu · **Étape** : 8/9 · **Moment** : saison 2+, [1,2] · **Lieu** : la voiture de Fardelli, ou le vestiaire si `sans_agent` · **Conditions** : —
Variante `flag('agent_fardelli')` (première vraie) — **FARDELLI** *(agent — neutre ; noir si relation ≤ −1 — il compte les années sur les doigts, il en a assez d'une main)* : « Trois ans qu'on remonte par ici, mon ami, on parle d'argent ou d'amitié, et l'amitié commence à coûter ; cette année c'est la montée, ou je te rends aussi. » — ← **La montée, cette année** — force +1, direction +, parole +1, promise — *Il note « montée ». Il note aussi la date ; il facture les dates.* · → **Rends-moi, alors** — tribunes +, set: sans_agent, clear: agent_fardelli, relation.fardelli −1 — *Il te rend. Il ne dit pas « tu m'appelleras » ; c'est la deuxième fois, il sait.*
Secours — **DÉDÉ** *(coach bénévole — neutre — le radiateur derrière lui, une place libre devant)* : « Bon, on va pas se mentir : la doudoune ne repasse pas, et les vieux t'ont fait une place au radiateur, c'est un honneur, ici. Tu joues encore une, ou tu regardes le banc ? » — ← **Encore une** — vestiaire +, tribunes +, force −1 — *Tu t'assois au radiateur. Il chauffe mal ; c'est la place.* · → **Je regarde le banc** — direction ++, tribunes −, set: banc_regarde — *Il pose le sifflet entre vous deux. Il ne le donne pas ; pas encore.*
Variante `plays() >= 2` : Fardelli ajoute « quatre ans, mon ami, je n'ai plus de doigts » ; Dédé ajoute « et le radiateur a été changé, tu as vu ».
**Traces** : sans_agent, banc_regarde · **Réactions déclenchées** : — · **Lu plus tard par** : § 10.2 (Carte Destin : `banc_regarde`), objectif `academie_sans_fardelli`, ch. 02 (Fardelli : « je t'ai rendu deux fois »)

### SCÈNE am.academie.s2_veille  —  La tournée d'avant (rejouable)
**Rôle** : joueur_amateur · **Intrigue** : am.academie.rendu · **Étape** : 9/9 · **Moment** : saison 2+, slot 17 · **Lieu** : le bar, la veille de la montée, Gérard avec la boîte en fer et une tournée que personne n'a commandée · **Conditions** : —
**GÉRARD** *(bénévole, trésorier — neutre — il pose la tournée et la boîte côte à côte, il regarde la boîte)*
« Ici, on payait en bières, et la veille de la montée on paie la tournée d'avant, c'est la tradition, elle ne rapporte rien. Tu la bois, ou tu la paies ? »
← **Je la paie** — effets : caisse −, tribunes ++, relation.gerard +1, set: tournee_payee — *Tu paies. Il écrit « tournée » dans le cahier ; il ne souligne pas ; c'est un compliment.*
→ **Je la bois** — effets : tribunes +, force −1 — *Tu bois. Les vieux boivent avec toi. Demain, tout le monde court moins ; c'est pareil pour l'adversaire, dit Dédé ; c'est faux.*
Variante `plays() >= 2` : « Ici, on payait en bières, et c'est ta troisième tournée d'avant, la boîte s'en souvient ; tu la paies encore, ou c'est le club ? » — mêmes sorties.
**Traces** : tournee_payee (sans Almanach) · **Réactions déclenchées** : co.re.vecchio_garde (∃, si `chars.vecchio.statut == 'club'`) · **Lu plus tard par** : § 10.3 (Carte Destin : « tu payais la tournée d'avant »), fin am_heros (epitaph_plus)

### 2.4 Le réservoir du joueur amateur (douze intrigues)

Pool `"0"` (prendre 3, fenêtre [2,9], réserve 1) : `am.doudoune` (signature, `if: season >= 1 || flag('academie')`), `am.patron` (`if: flag('boulot')`), `am.troisieme_mitemps`, `am.dede_neveu`, `am.sanglier`, `am.pichon_150`, `am.repas_dimanche` (`if: !flag('divorce')`), `am.car_gerard`, `am.selection_ligue` (`if: gauges.direction >= 45`). Pool `"1"` (reprise) : `am.montbeliac`, `am.district`, `am.coupe_poucet` (`if: world.coupe_tirage_ecart >= 2`), `am.genou_21` **[drame]** (jamais en S0 ; jamais juste après `am.district`). Pool `"2+"` : `am.doudoune` (replay after 1, max 2), `am.troisieme_mitemps` (ritual), `am.car_gerard` (ritual), `am.repas_dimanche` (ritual), `am.sanglier` (replay after 2), `am.coupe_poucet` (replay after 2, max 2). Ordre des pools : `am.genou_21` n'est jamais tiré la saison qui suit `am.district` ; une intrigue sur trois est légère (`am.troisieme_mitemps`, `am.sanglier`, `am.repas_dimanche`, `am.car_gerard` : quatre sur douze). Les intrigues partagées `co.derby` (variante amateur), `co.camille_naissance` (ch. 01) et `co.pharmacie` ne sont pas au pool amateur.

## INTRIGUE am.doudoune  —  Le type en doudoune
**Logline** : Un inconnu en doudoune au bord du terrain a un essai pour toi mardi, à quatre cents kilomètres, et tu bosses lundi. · **Synopsis** : Barbier vient voir jouer un autre. Il te voit. Il propose un essai à Valdorne, deux jours à poser, et un rapport qu'il n'a pas encore écrit. Tu y vas ou tu restes avec les copains ; si tu y vas, le coup de fil arrive deux cartes plus tard : contrat pro, ou « trop lent ». Si tu restes, il revient une fois, l'année suivante, et une seule. C'est la Carte Destin amateur → pro déguisée en feuilleton ; la Carte Destin elle-même (ch. 30) lit ce que cette intrigue a posé.
**Rôle(s)** : joueur_amateur · **Postulat(s)** : partagé (village_endette, lache_academie) · **Porteur** : barbier · **Cast** : barbier, dede, camille, fardelli (si `agent_fardelli`), josiane · **Thème** : mercato
**Saisons** : "0" (si `academie`), "1", "2+" · **Conditions d'entrée** : `age <= 24 && !flag('essai_rate')` · **Exclusions** : `essai_pro` déjà posé et lu · **Rejouabilité** : replay {after: 1, max: 2}
**Issues** → **Traces** → **Qui les lit** : `essai` → `essai_pro` (« {annee} : un type en doudoune a proposé un essai à {prenom} {nom}. Mardi, sous la pluie. ») → lue par ch. 30 (Carte Destin amateur → pro), am.village.v2_scierie, am.patron, objectif `village_detecte_avant`, ch. 20 (« LA DOUDOUNE EST PASSÉE ») · `copains` → `copains_gardes` (déjà déclarée) → objectif, ch. 30 · `trop_lent` → `essai_rate` → am.doudoune.doudoune_encore, ch. 02 (Barbier commence à −1)
**Séquencier** : doudoune (ouverture) → coup_de_fil [in 2,4] → lundi (S+1, at_season +1, [1,4], `essai_rate || copains_gardes`) ou fardelli_rappelle [in 0,2] (`essai_pro`) ; variante « encore » sur `plays()`.
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

### SCÈNE am.doudoune.fardelli_rappelle  —  Il vend aussi ceux qui jouent sous la pluie
**Rôle** : joueur_amateur · **Intrigue** : am.doudoune · **Étape** : 4/4 · **Moment** : [0,2] après le coup de fil · **Lieu** : la cabine du bar-tabac, encore, Gérard qui n'essuie plus rien, il écoute · **Conditions** : `flag('essai_pro') && !flag('agent_fardelli')`
**FARDELLI** *(agent — neutre — au téléphone, un bruit de restaurant derrière lui, il a eu le numéro par Barbier)*
« Barbier t'a vu jouer sous la pluie, et moi je vends aussi ceux qui jouent sous la pluie ; mon ami, on parle d'argent ou d'amitié : dix pour cent, et Valdorne lit le rapport plus vite. »
← **Dix pour cent, d'accord** — effets : direction +, caisse −, relation.fardelli +1, set: agent_fardelli — *Il note ton nom. Il l'écrit mal ; il le corrigera sur le contrat.*
→ **Je n'ai pas besoin d'agent** — effets : tribunes +, relation.fardelli −1, set: sans_agent — *Il dit « tu m'appelleras ». Gérard, derrière le comptoir, dit que c'est ce qu'ils disent tous.*
Variante `flag('agent_fardelli')` (venu de `lache_academie`) : un bouton — **On continue, Rocco** — relation.fardelli +1 — *Il ne rappelle pas ; il est déjà là, dans la voiture, sur le parking du bar.*
**Traces** : agent_fardelli, sans_agent (drapeaux de script, lus par tout le rôle pro) · **Réactions déclenchées** : am.re.gerard_licence (§ 7, variante « et l'agent, je le mets dans la boîte ? ») · **Lu plus tard par** : jp.pepite.p1_valeur (variante `agent_fardelli` : « on continue »), objectif `academie_sans_fardelli`, § 10.1 (Carte Destin : « sans Fardelli, on a pris ton nom »), ch. 02 (Fardelli : « je t'ai eu par Barbier »)
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
← **L'intérim à Montbéliac** — effets : caisse +, tribunes −−, vestiaire −, set: interim_montbeliac — *Tu bosses chez l'ennemi. Le samedi, on te demande si tu signes aussi chez eux ; tu réponds « non » de moins en moins vite.*
→ **Je cherche ici** — effets : caisse −−, tribunes +, vestiaire +, set: chomage_village — *Tu cherches. Le village n'a que deux employeurs : la scierie, et Dupuis.*
Variante `flag('arret_complaisance')` : « Je t'ai vu au tournoi avec un arrêt de huit jours dans la poche, et j'ai un carnet de commandes ; voilà ton solde. L'intérim à Montbéliac, ou tu cherches ici ? »
**Traces** : chomage_village (« {annee} : {prenom} {nom} a perdu son boulot pour un tournoi. Le village n'a que deux patrons. »), interim_montbeliac · **Réactions déclenchées** : co.re.camille_journal (∃, si `!flag('divorce')`) · **Lu plus tard par** : am.patron.boucherie, fin am_patron (epitaph_plus), am.montbeliac (variante « tu bosses déjà chez eux »), ch. 13 (Dupuis : « je t'ai embauché une fois »)

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
**Séquencier** : tournee (ouverture, S0) → video [in 3,6] (`plays >= 1` ou `year >= 2007`) → bagarre (S2+, `plays >= 2`) → pain [in 0,1] (`bar_quatre_heures`) ; chaque étape a sa variante « encore ».

### SCÈNE am.troisieme_mitemps.tournee  —  La tournée du président
**Rôle** : joueur_amateur · **Intrigue** : am.troisieme_mitemps · **Étape** : 1/4 · **Moment** : ouverture tirée, après une Carte Match gagnée de préférence · **Lieu** : le bar-tabac, la tournée sur le comptoir, Gérard derrière avec la boîte en fer · **Conditions** : —
**GÉRARD** *(bénévole, trésorier — neutre — il pousse une bière vers toi et une addition vers Pichon)*
« Ici, on payait en bières, et ce soir c'est le président qui paie, enfin, c'est la caisse ; ça finit à quatre heures. Tu restes, ou tu rentres chez Camille ? »
← **Je reste jusqu'à quatre h** — effets : tribunes ++, force −1, relation.camille −1, set: bar_quatre_heures, outcome: reste — *À quatre heures, Momo chante. À cinq, Pichon ouvre la boulangerie et vous met dehors avec du pain.*
→ **Je rentre** — effets : tribunes −, force +1, relation.camille +1, set: rentre_tot, outcome: rentre — *Tu rentres. Le village dit « il est pas d'ici, celui-là ». Il le dit avec tendresse ; pas tous.*
Variante `plays() == 1` (« encore ») : « Ici, on payait en bières, et l'an dernier tu as payé la dernière ; ce soir c'est reparti, et Momo a apporté un appareil photo. Tu restes ? » · Variante `plays() >= 2` : « Ici, on payait en bières, et toi tu es le seul à savoir combien ça coûte, puisque tu as tenu la boîte un soir. Tu restes, ou tu comptes ? » — ← **Je compte avec toi** — tribunes +, caisse +, relation.gerard +1, set: gerard_confiance — *Tu comptes. Il te montre le double fond de la boîte. Tu sais quelque chose maintenant.*
**Traces** : bar_quatre_heures, rentre_tot, gerard_confiance (« {annee} : Gérard a montré le double fond de la boîte à {prenom} {nom}. ») · **Réactions déclenchées** : am.re.camille_quatre_heures (§ 7) · **Lu plus tard par** : ch. 13 (`gerard_parti` : « tu connaissais le double fond »), fin pa_buvette (ch. 30, epitaph_plus), am.troisieme_mitemps.video

### SCÈNE am.troisieme_mitemps.video  —  La photo qui tourne
**Rôle** : joueur_amateur · **Intrigue** : am.troisieme_mitemps · **Étape** : 2/4 · **Moment** : [3,6] · **Lieu** : la rédaction de L'Écho (une table au bar), Léa avec une photo (ou un téléphone dès 2007) · **Conditions** : `flag('bar_quatre_heures')`
**LÉA** *(L'Écho — neutre — elle pose la photo à l'envers, puis à l'endroit)*
« Vous confirmez ? Vous, sur le comptoir, à quatre heures, avec le maillot du club et le fils Dupuis qui tient l'échelle. Je la passe en page « Au local », ou je la garde ? »
← **Passez-la, c'est le village** — effets : tribunes ++, direction −, relation.lea +1, set: photo_comptoir — *L'Écho la passe. Dédé la découpe et la punaise au vestiaire, côté « à ne pas refaire ».*
→ **Gardez-la, s'il vous plaît** — effets : direction +, tribunes −, relation.lea −1 — *Elle la garde. Elle la ressort dix ans plus tard, quand tu es quelqu'un ; elle ne l'a pas oubliée.*
Variante `year >= 2007` (`monde_flux`) : « Vous confirmez ? La vidéo du comptoir a trois mille vues sur le Flux, et le district en a une copie. Je la commente, ou je la laisse tourner ? »
**Traces** : photo_comptoir (« {annee} : {prenom} {nom} sur le comptoir, à quatre heures, en maillot. L'Écho l'a passée. ») · **Réactions déclenchées** : co.re.lea_confirme (∃) · **Lu plus tard par** : jp.memoires (variante « la photo du comptoir »), ch. 20 (Écho : « AU LOCAL, À QUATRE HEURES »), am.district (variante « le district a la photo »)

### SCÈNE am.troisieme_mitemps.bagarre  —  Quatre heures dix
**Rôle** : joueur_amateur · **Intrigue** : am.troisieme_mitemps · **Étape** : 3/4 · **Moment** : saison 2+, `plays() >= 2` · **Lieu** : le trottoir devant le bar, un joueur de Montbéliac par terre, Momo qui saigne du nez · **Conditions** : —
**MOMO** *(voix sans portrait — il tient son nez, il tient aussi une chaise)*
« Le gars de Montbéliac a dit que le maillot marron c'était une couleur de boue, et je lui ai répondu avec la chaise. La gendarmerie arrive : tu me couvres, ou tu dis ce que tu as vu ? »
← **Je te couvre** — effets : vestiaire ++, direction −−, set: momo_couvert — *Tu dis que la chaise est tombée toute seule. Le gendarme est de Boisnoir ; il écrit « chute de chaise ».*
→ **Je dis ce que j'ai vu** — effets : direction +, vestiaire −−, tribunes − — *Momo prend trois matchs. Il ne te parle plus jusqu'à la Coupe ; à la Coupe, il te fait la passe, une.*
**Traces** : momo_couvert · **Réactions déclenchées** : — · **Lu plus tard par** : am.district (variante « la chaise »), fin am_toro (epitaph_plus « Momo »)

### SCÈNE am.troisieme_mitemps.pain  —  Cinq heures, le fournil
**Rôle** : joueur_amateur · **Intrigue** : am.troisieme_mitemps · **Étape** : 4/4 · **Moment** : [0,1] après la tournée, si tu es resté · **Lieu** : le fournil de Pichon, cinq heures, la porte ouverte sur le froid, Momo assis sur un sac de farine · **Conditions** : `flag('bar_quatre_heures')`
**PICHON** *(boulanger — neutre — de la farine jusqu'aux coudes, il vous a entendus arriver depuis le bar)*
« Le pain, c'est à cinq heures, et vous êtes encore là à cinq heures, alors vous sortez avec une baguette chacun. Toi, tu m'aides à enfourner, ou tu rentres avec Momo ? »
← **J'enfourne** — effets : direction ++, vestiaire −, force −1, relation.pichon +1, set: enfourne_cinq_heures — *Tu enfournes. Tu dors à sept. Dimanche, tu sens le pain ; le village trouve ça bien.*
→ **Je rentre avec Momo** — effets : vestiaire +, direction −, tribunes + — *Tu rentres. Momo chante jusqu'à la scierie. Le patron entend ; il a une fenêtre.*
Variante `plays() >= 2` (« encore ») : « Le pain, c'est à cinq heures, et c'est la troisième année que vous arrivez avec le pain ; tu enfournes, ou tu m'ouvres la boutique à sept ? » — ← **J'ouvre à sept** — direction ++, caisse +, relation.pichon +1, set: enfourne_cinq_heures — *Tu ouvres. La première cliente est Paulette. Elle te dit que tu n'es pas d'ici ; elle achète deux baguettes.* · → **Je rentre** — vestiaire +, direction −.
**Traces** : enfourne_cinq_heures (« {annee} : à cinq heures, {prenom} {nom} enfournait chez Pichon après la troisième mi-temps. ») · **Réactions déclenchées** : — · **Lu plus tard par** : § 10.3 (Carte Destin : « tu connais le fournil, tu connaîtras la boîte »), ch. 13 (Pichon : « tu sais enfourner »), ch. 02 (Pichon, retrouvailles sourire)
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
→ **Je gueule devant tous** — effets : direction −−, vestiaire ++, tribunes +, set: voisin_appelle, outcome: gueule — *Tu gueules. Pichon l'apprend au pétrin. Le soir, le téléphone sonne ; l'indicatif est celui de Montbéliac.*
**Traces** : banc_accepte, voisin_appelle · **Réactions déclenchées** : am.re.pichon_petrin (§ 7) · **Lu plus tard par** : am.dede_neveu.rentre, am.montbeliac, fin am_touche (epitaph_plus), ch. 30

### SCÈNE am.dede_neveu.rentre  —  La vingtième minute
**Rôle** : joueur_amateur · **Intrigue** : am.dede_neveu · **Étape** : 2/4 · **Moment** : [1,3] · **Lieu** : le banc de touche, une planche sur deux parpaings, Dédé debout · **Conditions** : `flag('banc_accepte')`
**DÉDÉ** *(coach bénévole — sourire — il te fait signe du menton vers la touche)*
« Bon, on va pas se mentir : on perd un à zéro et le neveu court après le ballon comme après un car. Tu rentres à sa place, ou tu me laisses assumer jusqu'au bout ? »
← **Je rentre** — effets : tribunes ++, vestiaire +, direction −, force +1 — *Tu rentres. Tu égalises. Le neveu applaudit ; Pichon, en tribune, n'applaudit pas, il pétrit ses mains.*
→ **Assume jusqu'au bout** — effets : direction ++, tribunes −−, vestiaire − — *Il assume. Vous perdez deux à zéro. Le neveu vient te remercier au bar ; c'est le seul.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : —

### SCÈNE am.dede_neveu.appel  —  L'indicatif de Montbéliac
**Rôle** : joueur_amateur · **Intrigue** : am.dede_neveu · **Étape** : 3/4 (branche) · **Moment** : [1,3] · **Lieu** : la cuisine, le téléphone mural, Camille qui écoute depuis le couloir · **Conditions** : `flag('voisin_appelle')`
**UNE VOIX DE MONTBÉLIAC** *(sans portrait — le président des Sangliers, il ne dit pas bonjour)*
« Vous avez gueulé, on l'a su, et chez nous on ne fait pas jouer les neveux, on fait jouer ceux qu'on paie. Deux cents francs par match et un poste à la mairie : vous venez ?»
← **Je viens** — effets : caisse ++, tribunes −−−, vestiaire −, club: {change: true}, set: passe_a_montbeliac — *Tu passes chez l'ennemi. Le village retire ta photo du bar ; Gérard la garde dans la boîte, à l'envers.*
→ **Je reste, même au banc** — effets : tribunes ++, caisse −, relation.dede +1 — *Tu raccroches. Camille sort du couloir. Dédé, le lendemain, remet ton nom à la craie ; il appuie fort.*
**Traces** : passe_a_montbeliac (« {annee} : {prenom} {nom} est passé à Montbéliac pour deux cents francs. Le village a retourné sa photo. ») · **Réactions déclenchées** : co.re.camille_journal (∃) · **Lu plus tard par** : ch. 90 (mémoire des clubs : Boisnoir −3, « départ chez le rival »), ch. 13 (`fusion_imposee` : « tu étais passé chez eux »), fin am_enveloppe (epitaph_plus)

### SCÈNE am.dede_neveu.revanche  —  Le neveu, un an plus tard
**Rôle** : joueur_amateur · **Intrigue** : am.dede_neveu · **Étape** : 4/4 · **Moment** : saison suivante, [3,9] · **Lieu** : l'entraînement du mardi, le neveu qui reste après les autres pour tirer des coups francs · **Conditions** : `!flag('passe_a_montbeliac')`
**LE NEVEU** *(voix sans portrait — il ramasse les ballons sans qu'on le lui demande)*
« Mon oncle ne m'a jamais demandé si je voulais jouer, il m'a mis, et tout le village a vu que je courais comme un car. Tu m'apprends le contrôle, ou tu me laisses à la boulangerie ? »
← **Je t'apprends** — effets : vestiaire ++, direction +, force −1, set: neveu_forme — *Tu restes le mardi. Au bout d'un an, il contrôle. Au bout de deux, il te fait la passe.*
→ **La boulangerie, c'est bien** — effets : vestiaire −, direction −, force +1 — *Il arrête. Il reprend la boulangerie en 2008, quand Pichon ferme. Il fait le pain, et il regarde les matchs de loin.*
**Traces** : neveu_forme · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 13 (`coupe_du_village` : « le neveu de Pichon joue », variante `neveu_forme`), ch. 31 (2008 : la boulangerie de Pichon ferme, « le neveu reprend »)
**Épilogue** : ligne « {annee} : le neveu du président a joué. Le village s'en souvient. »

## INTRIGUE am.sanglier  —  Le sanglier
**Logline** : Un sanglier a labouré la surface de réparation cette nuit ; l'arbitre hésite. · **Synopsis** : Le matin du match, Gérard découvre la surface retournée. On joue quand même (dans les trous) ou on reporte (et on perd la recette). Si l'on joue et qu'on gagne, le sanglier devient l'emblème ; s'il y a une entorse dans un trou, le porte-monnaie en souffre. La deuxième scène est la Une de L'Écho ; la troisième, un an plus tard, le sanglier revient, ou un autre.
**Rôle(s)** : joueur_amateur (et président_amateur : la variante « côté président » est au ch. 13) · **Postulat(s)** : partagé · **Porteur** : gerard · **Cast** : gerard, dede, lea, pichon, colline (si l'arbitre est un arbitre de district ; sinon « l'arbitre » voix) · **Thème** : absurde
**Saisons** : "0", "2+" (replay after 2, max 2) · **Conditions d'entrée** : — · **Rejouabilité** : replay {after: 2, max: 2}
**Issues** → **Traces** → **Qui les lit** : `joue` → `sanglier_embleme` (« {annee} : un sanglier a labouré la surface de {ville}. On a joué dedans, on a gagné. Il est sur le maillot. ») → am.sanglier.echo, ch. 13 (le maillot au sanglier), ch. 31 (anecdote « le sanglier dans la surface » : Haute-Combe l'a aussi), ch. 20 · `report` → `sanglier_report` → am.sanglier.encore
**Séquencier** : surface (ouverture) → echo [in 1,3] → dupuis_maillot [in 1,3] (`sanglier_embleme`) → chasseurs (S2+, `plays >= 1`) ; variante « encore » sur surface.

### SCÈNE am.sanglier.surface  —  La surface labourée
**Rôle** : joueur_amateur · **Intrigue** : am.sanglier · **Étape** : 1/4 · **Moment** : ouverture tirée, un matin de match · **Lieu** : la surface de réparation, retournée sur dix mètres, Gérard avec un râteau · **Conditions** : —
**GÉRARD** *(bénévole — neutre — le râteau à la main, il n'a pas commencé)*
« Ici, on payait en bières, et là il faudrait payer un sanglier, il a labouré la surface cette nuit. L'arbitre hésite : on joue dans les trous, ou on reporte et on perd la recette ? »
← **On joue dans les trous** — effets : tribunes ++, force −1, rand: [{p: 0.15, set: entorse_sanglier, caisse −−}, {set: sanglier_embleme}], outcome: joue — *Vous jouez. Le gardien adverse tombe dans un trou sur le penalty. Vous gagnez ; le sanglier est adopté.*
→ **On reporte** — effets : direction +, caisse −, tribunes −, set: sanglier_report, outcome: report — *Report. Gérard ratisse jusqu'à midi. Dupuis dit qu'il aurait bien pris le sanglier ; il pèse ses mots.*
Variante `plays() >= 1` (« encore ») : « Ici, on payait en bières, et le sanglier est revenu, ou c'est son cousin, il a la même façon de labourer. On joue dedans, comme l'autre fois ? »
**Traces** : sanglier_embleme, sanglier_report, entorse_sanglier · **Réactions déclenchées** : am.re.dede_sanglier (§ 7) · **Lu plus tard par** : am.sanglier.echo, ch. 13 (PA : le maillot au sanglier ; variante « le sanglier de 1992 »), ch. 31, fin am_heros

### SCÈNE am.sanglier.echo  —  Le sanglier en page « Au local »
**Rôle** : joueur_amateur · **Intrigue** : am.sanglier · **Étape** : 2/4 · **Moment** : [1,3] · **Lieu** : le bar, L'Écho ouvert sur le comptoir, une photo de trou · **Conditions** : `flag('sanglier_embleme')`
**LÉA** *(L'Écho — sourire — elle a titré, elle est contente du titre)*
« Vous confirmez ? « Le sanglier a marqué contre son camp », c'est ma Une de dimanche, et Dupuis veut le mettre sur le maillot. Vous posez avec le sanglier, ou avec le ballon ? »
← **Avec le sanglier** — effets : tribunes ++, direction −, relation.lea +1, set: pose_sanglier — *Tu poses avec une tête de sanglier en carton. La photo fait le tour du canton, puis du district.*
→ **Avec le ballon, sérieusement** — effets : direction +, tribunes − — *Tu poses avec le ballon. Personne ne garde cette photo-là ; celle du sanglier, si.*
**Traces** : pose_sanglier (sans Almanach) · **Réactions déclenchées** : co.re.lea_confirme (∃) · **Lu plus tard par** : ch. 20 (« LE SANGLIER A MARQUÉ CONTRE SON CAMP »), ch. 90 (mémoire de club : l'emblème)

### SCÈNE am.sanglier.dupuis_maillot  —  Le sanglier de Dupuis
**Rôle** : joueur_amateur · **Intrigue** : am.sanglier · **Étape** : 3/4 · **Moment** : [1,3] · **Lieu** : la boucherie, un dessin de maillot sur le papier du comptoir, un sanglier à côté du nom « DUPUIS » · **Conditions** : `flag('sanglier_embleme')`
**DUPUIS** *(boucher, sponsor — sourire — il a dessiné le sanglier lui-même ; il ressemble à un cochon)*
« Le meilleur du cochon, et je pèse mes mots : le sanglier va sur le maillot, à côté de mon nom, et il ressemble un peu à un cochon, c'est voulu. Tu poses avec, ou tu demandes qu'on refasse le dessin ? »
← **Je pose avec** — effets : caisse +, tribunes +, relation.dupuis +1, set: maillot_sanglier — *Tu poses. Le sanglier-cochon fait le tour du district. Il est sur les sous-bocks en mars.*
→ **Refaites le dessin** — effets : tribunes +, caisse −, relation.dupuis −1 — *Il refait. Ça ressemble à un chien. Il pèse ses mots ; il ne pèse pas ses dessins.*
**Traces** : maillot_sanglier (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 13 (`coupe_du_village` : le maillot au sanglier, côté président), fin am_heros (epitaph_plus), ch. 90 (mémoire de club : l'emblème)

### SCÈNE am.sanglier.chasseurs  —  La battue
**Rôle** : joueur_amateur · **Intrigue** : am.sanglier · **Étape** : 4/4 · **Moment** : saison 2+, `plays() >= 1`, un dimanche matin · **Lieu** : le parking du stade, trois hommes en orange, un fusil cassé sur le bras, Gérard qui compte les fusils · **Conditions** : —
**LE PRÉSIDENT DES CHASSEURS** *(voix sans portrait — orange fluo, il parle de la surface de réparation comme d'un territoire)*
« Le sanglier est revenu, il est dans le bois derrière les buts, et la battue c'est ce matin, pendant votre match. On tire, ou vous jouez et on attend la mi-temps ? »
← **Attendez la mi-temps** — effets : tribunes +, direction +, set: battue_reportee — *Ils attendent. À la mi-temps, on entend deux coups. Le sanglier revient l'année suivante ; c'est un autre.*
→ **Tirez, on joue quand même** — effets : tribunes −, vestiaire +, force +1 — *Vous jouez sous les coups de fusil. L'arbitre siffle une faute qu'il n'a pas vue ; il a sursauté.*
**Traces** : battue_reportee (sans Almanach) · **Réactions déclenchées** : am.re.dede_sanglier (§ 7, variante « c'est le tracteur, encore ») · **Lu plus tard par** : ch. 31 (anecdote « le sanglier dans la surface » : la battue), ch. 13 (président amateur : « les chasseurs veulent la clé du stade »)
**Épilogue** : ligne « {annee} : le sanglier est revenu. Personne ne l'a vu, tout le monde l'a entendu. »

## INTRIGUE am.pichon_150  —  Cent cinquante francs au noir
**Logline** : Le club propose cent cinquante francs par mois, au noir, et un match arrangé pour éviter la descente, cinq cents pour toi. · **Synopsis** : Pichon te glisse une enveloppe mensuelle « pour l'essence », que Gérard sort de la boîte. C'est l'amateurisme réel : illégal, tendre, universel. Puis, au printemps, quelqu'un propose un match arrangé pour éviter la descente ; Pichon refuse, toi tu décides. Si tu acceptes, le district « examine » (Roux, § am.district). La quatrième scène, un an plus tard, est le coup de fil de cinq heures : Pichon t'appelle après ton premier match ailleurs, il n'a pas regardé l'heure.
**Rôle(s)** : joueur_amateur · **Postulat(s)** : partagé · **Porteur** : pichon · **Cast** : pichon, gerard, roux, « un intermédiaire » (voix), camille · **Thème** : argent
**Saisons** : "0", "1" · **Conditions d'entrée** : `gauges.caisse <= 60` · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `enveloppe` → `enveloppe_essence` (« {annee} : cent cinquante francs par mois, pour l'essence. Gérard les sortait de la boîte pour {prenom} {nom}. ») → fin am_enveloppe, am.district, ch. 13 (Pichon : « je te payais l'essence »), ch. 15 (Roux : « les enveloppes du canton ») · `arrange` → `match_arrange` (« {annee} : un match pour ne pas descendre, arrangé. {nom} a levé le pied. ») → am.district (`if`), fin am_enveloppe, ch. 30 (fin *Le pari* variante amateur), ch. 20 · `propre` → `match_propre` → ch. 30 (trait Intègre), objectif
**Séquencier** : essence (ouverture) → camille [in 1,2] (`enveloppe_essence`) → arrange [in 4,8] → cinq_heures (S+1, [1,3], `requires: [essai_pro]` ou changement de club).

### SCÈNE am.pichon_150.essence  —  Pour l'essence
**Rôle** : joueur_amateur · **Intrigue** : am.pichon_150 · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : l'arrière de la boulangerie, cinq heures et demie, l'enveloppe sur le pétrin · **Conditions** : —
**PICHON** *(boulanger, président — neutre — de la farine sur l'enveloppe)*
« Le pain, c'est à cinq heures, et le foot, c'est après ; entre les deux, cent cinquante francs par mois pour l'essence, que personne ne voie. Tu prends, ou tu prends le car ? »
← **Je prends, pour l'essence** — effets : caisse ++, direction +, set: enveloppe_essence, outcome: enveloppe — *Tu prends. Gérard note « essence » dans la boîte. Il souligne.*
→ **Je prends le car** — effets : caisse −, tribunes +, relation.pichon +1, outcome: propre — *Tu prends le car. Pichon te donne le pain de la veille à la place ; il pèse plus lourd.*
**Traces** : enveloppe_essence · **Réactions déclenchées** : am.re.gerard_souligne (§ 7) · **Lu plus tard par** : am.pichon_150.arrange (variante), fin am_enveloppe, am.district, ch. 13, ch. 15

### SCÈNE am.pichon_150.camille  —  L'enveloppe sur la table
**Rôle** : joueur_amateur · **Intrigue** : am.pichon_150 · **Étape** : 2/4 · **Moment** : [1,2] · **Lieu** : la cuisine, l'enveloppe posée sur la table, « essence » écrit dessus, Camille qui ne l'a pas ouverte · **Conditions** : `flag('enveloppe_essence') && !flag('divorce')`
**CAMILLE** *(neutre — elle fait glisser l'enveloppe vers toi, du bout du doigt, comme un objet chaud)*
« Tu rentres à quelle heure, et avec quoi : il y a cent cinquante francs dans une enveloppe avec « essence » écrit dessus, et tu prends le car. Tu m'expliques, ou je demande à Gérard ? »
← **Je t'explique** — effets : relation.camille +1, direction −, set: camille_sait_essence — *Tu expliques. Elle range l'enveloppe dans le tiroir qui ferme ; elle en garde la clé.*
→ **Demande à Gérard** — effets : relation.camille −1, caisse + — *Elle demande. Gérard dit « ici, on payait en bières » ; elle ne comprend pas ; elle comprend.*
Variante `flag('camille_avocate')` : « Tu rentres à quelle heure, et cent cinquante francs au noir, je suis avocate, je sais ce que c'est ; tu arrêtes, ou je ne veux rien savoir ? » — ← **J'arrête** — caisse −, clear: enveloppe_essence, relation.camille +1 — *Tu rends l'enveloppe. Pichon la reprend sans un mot ; il te donne du pain à la place, plus lourd.* · → **Ne sache rien** — relation.camille −1 — *Elle ne sait rien. Elle ferme le tiroir à clé ; elle ne l'ouvre plus.*
**Traces** : camille_sait_essence (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 01 (Camille, palier +3 secours avocate : « je savais pour l'enveloppe »), am.district.salle_des_mariages (variante « votre femme savait »)

### SCÈNE am.pichon_150.arrange  —  Le match arrangé
**Rôle** : joueur_amateur · **Intrigue** : am.pichon_150 · **Étape** : 3/4 · **Moment** : [4,8], au printemps, quand la descente menace · **Lieu** : la buvette après l'entraînement, un homme que personne ne connaît, une enveloppe plus épaisse · **Conditions** : —
**UN INTERMÉDIAIRE** *(voix sans portrait — il parle à Pichon, mais il te regarde)*
« Dimanche, si vous perdez contre eux, ils se maintiennent, et vous vous maintenez au match d'après, c'est calculé ; cinq cents francs par joueur. Le président a dit non ; toi, tu dis quoi ? »
← **Je dis non aussi** — effets : tribunes +, vestiaire +, caisse −, set: match_propre, relation.pichon +1, outcome: propre — *Tu dis non. Pichon te donne une baguette de plus. Vous perdez dimanche, honnêtement, et vous vous maintenez quand même.*
→ **Cinq cents, pour moi** — effets : caisse +++, direction −−, set: match_arrange, outcome: arrange — *Tu lèves le pied. Vous perdez. Deux semaines plus tard, le district « examine » ; Roux a une photo de la buvette.*
Variante `flag('enveloppe_essence')` : « Cinq cents francs par joueur, et je sais que le club vous en donne cent cinquante pour l'essence, donc on est entre gens qui comprennent. Le président a dit non ; et toi ? »
**Traces** : match_arrange, match_propre · **Réactions déclenchées** : am.re.pichon_baguette (§ 7) · **Lu plus tard par** : am.district (`if: flag('match_arrange')`), fin am_enveloppe (epitaph_plus), ch. 30 (fin *Le pari*, variante amateur : « cinq cents francs »), ch. 20 (« LE MAINTIEN À CINQ CENTS FRANCS »), ch. 15 (Roux, dossier)

### SCÈNE am.pichon_150.cinq_heures  —  Le coup de fil de cinq heures
**Rôle** : joueur_amateur | joueur · **Intrigue** : am.pichon_150 · **Étape** : 4/4 · **Moment** : saison suivante, [1,3], après un changement de club (amateur ailleurs, ou pro) · **Lieu** : ta chambre, cinq heures du matin, le téléphone · **Conditions** : `club changé || role == 'joueur'`
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
← **Appelé, j'ai dit non** — effets : tribunes ++, vestiaire +, caisse −, set: montbeliac_refuse — *Tu as dit non. Dédé remet le mot de Karim dans sa poche. Il le gardera jusqu'au derby.*
→ **Ils m'ont appelé, j'écoute** — effets : caisse +, vestiaire −−, direction −, set: montbeliac_ecoute — *Tu écoutes. Les jumeaux t'écoutent écouter. Le mardi, il manque trois joueurs au toro.*
Variante `flag('pichon_reprend')` (ch. 02) : « Bon, on va pas se mentir : depuis que Pichon a repris les clés, tu joues chez l'ennemi, tout le monde le sait ; alors tu viens me dire quoi, dans mon vestiaire ? » — ← **Que je reviens** — vestiaire +, tribunes +, caisse −− — *Il ne dit rien. Il te tend un maillot marron ; il sent la naphtaline.* · → **Que Karim est bien là-bas** — vestiaire −−, caisse + — *Il te montre la porte. Poliment ; c'est pire.*
Variante `flag('interim_montbeliac')` : « Bon, on va pas se mentir : tu bosses déjà chez eux, à l'intérim, et maintenant ils veulent tes crampons aussi. Ils t'ont appelé ? »
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

### SCÈNE am.district.lea_dehors  —  On nous écrit
**Rôle** : joueur_amateur · **Intrigue** : am.district · **Étape** : 3/4 · **Moment** : [0,1] · **Lieu** : les marches de la mairie, Léa, une lettre manuscrite pour la rubrique « On nous écrit », Pichon qui descend derrière toi avec la boîte de croissants vide · **Conditions** : —
**LÉA** *(L'Écho — neutre — elle tient la lettre par le haut, comme un poisson)*
« Vous confirmez ? Le beau-frère de leur président m'a écrit pour « On nous écrit », ça parle de vous, c'est méchant et bien tourné. Je la passe avec votre réponse, ou je la passe seule ? »
← **Avec ma réponse** — effets : tribunes +, parole +1, relation.lea +1, set: reponse_echo — *Tu réponds en trois lignes. Le village lit les deux ; il préfère la tienne ; c'est le village.*
→ **Passez-la seule** — effets : direction +, tribunes − — *Elle la passe. Le canton la lit. Dédé la découpe et la punaise côté « à ne pas refaire », à côté de la photo du comptoir.*
Variante `flag('camille_sait_essence')` : Léa ajoute « et la lettre parle aussi d'une enveloppe, sans dire laquelle » ; la droite donne direction − à la place.
**Traces** : reponse_echo (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 20 (Écho, rubrique « On nous écrit » : le gabarit de la lettre du beau-frère), ch. 02 (Léa : « vous m'aviez répondu en trois lignes »)

### SCÈNE am.district.recidive  —  La deuxième convocation
**Rôle** : joueur_amateur · **Intrigue** : am.district · **Étape** : 4/4 · **Moment** : saison suivante, `plays() >= 1` · **Lieu** : la même salle, le même vase, Roux qui ne se lève pas · **Conditions** : `flag('district_sanction')`
**ROUX** *(président du district — noir — il n'ouvre pas le dossier, il le connaît)*
« Le district, c'est la base, et la base ne convoque pas deux fois le même nom sans conséquence : la radiation est à l'ordre du jour. Vous avez quelque chose à dire, ou quelqu'un pour le dire ? »
← **Je n'ai rien à dire** — effets : direction −−−, tribunes +, set: radie_district, outcome: radie — *Radié un an. Tu joues au foot en salle, le jeudi, avec Momo. Le district ne va pas au foot en salle.*
→ **Pichon parle pour moi** — effets : direction −, tribunes −, relation.pichon +1, set: district_sanction — *Pichon parle. Six matchs. Roux mange le croissant, cette fois, en entier.*
**Traces** : radie_district (« {annee} : radié un an par le district. {prenom} {nom} a joué en salle, le jeudi. ») · **Réactions déclenchées** : — · **Lu plus tard par** : fin am_enveloppe (variante radiation), ch. 30 (Carte Destin amateur → entraîneur amateur : « radié comme joueur, pas comme coach »), ch. 90 (mémoire)
**Épilogue** : ligne « {annee} : le district a examiné {nom}. Un samedi matin, salle des mariages. »

## INTRIGUE am.genou_21  —  Le genou à vingt et un ans  **[drame]**
**Logline** : Un tacle dans un trou de sanglier, un genou qui fait un bruit, et vingt et un ans. · **Synopsis** : Le drame du rôle, sobre, une fois par carrière, jamais en S0. Le médecin du canton envoie à l'hôpital de la ville ; le verdict tombe en deux cartes : les croisés, et à ce niveau, sans centre de rééducation, c'est fini, ou presque. Dédé propose son sifflet (reconversion précoce : entraîneur amateur à vingt et un ans), Roux propose l'école d'arbitrage (une voix, une ligne : le rôle d'arbitre n'existe pas encore), Camille propose autre chose que le foot. La dernière scène est un choix de vie, pas de jauge.
**Rôle(s)** : joueur_amateur · **Postulat(s)** : partagé · **Porteur** : dede · **Cast** : dede, camille, roux, gerard, « le médecin du canton » (voix) · **Thème** : corps
**Saisons** : "1", "2+" · **Conditions d'entrée** : `age <= 23 && season >= 1 && !flag('genou')` · **Exclusions** : jamais juste après `am.district` ni `co.camille_naissance` (règle des deux drames) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `sifflet` → `genou`, `dede_sifflet` → Carte Destin amateur → entraîneur amateur (ch. 30, « reconversion précoce »), ch. 11 (Dédé adjoint), fin am_touche (epitaph_plus) · `reprend` → `genou`, `genou_amateur_reprend` → am.doudoune (exclusion : la doudoune ne revient plus), fin *Les croisés* (variante amateur) · `arrete` → `genou`, `apres_le_foot` → ch. 30 (écran « Après le foot » précoce avec bonus de compassion), ch. 01 (Camille : « il a arrêté pour de bon »)
**Séquencier** : bruit (ouverture, sans choix : une sortie) → hopital [in 1,2] → roux [in 1,3] → sifflet [in 2,4].

### SCÈNE am.genou_21.bruit  —  Le bruit
**Rôle** : joueur_amateur · **Intrigue** : am.genou_21 · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : la pelouse, la pluie, Dédé agenouillé, le match arrêté · **Conditions** : —
**DÉDÉ** *(coach bénévole — neutre — il ne dit pas « on va pas se mentir » ; il tient ta jambe droite)*
« Ne bouge pas, petit. Gérard appelle le médecin, et on attend, et tu ne bouges pas. »
**Une sortie** — **J'attends** — effets : force −4, set: genou, set: genou_amateur — *Le match reprend sans toi. Il pleut sur les autres. Personne ne fait de blague.*
**Traces** : genou (∃), genou_amateur · **Réactions déclenchées** : — (jamais de réaction après un drame) · **Lu plus tard par** : am.genou_21.hopital, ch. 30, ch. 01 (Camille)

### SCÈNE am.genou_21.hopital  —  L'hôpital de la ville
**Rôle** : joueur_amateur · **Intrigue** : am.genou_21 · **Étape** : 2/4 · **Moment** : [1,2] · **Lieu** : un couloir d'hôpital, Camille sur une chaise, un médecin (voix) avec une radio · **Conditions** : —
**LE MÉDECIN DU CANTON** *(voix sans portrait — il tient la radio contre le néon)*
« Les croisés, et le ménisque avec, et à votre niveau il n'y a pas de centre pour ça, il y a du repos et de la chance. Vous voulez que je vous dise le vrai délai, ou une saison ? »
← **Le vrai délai** — effets : direction +, tribunes −, set: verite_genou — *Il dit dix-huit mois, s'il n'y a rien d'autre. Camille prend ta main ; elle a entendu « rien d'autre ».*
→ **Dites-moi une saison** — effets : tribunes +, force −2, set: espoir_genou — *Il dit « une saison ». Il ne te regarde pas en le disant. Camille le regarde, lui.*
**Traces** : verite_genou, espoir_genou (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : am.genou_21.sifflet (variantes)

### SCÈNE am.genou_21.roux  —  La brochure
**Rôle** : joueur_amateur · **Intrigue** : am.genou_21 · **Étape** : 3/4 · **Moment** : [1,3] · **Lieu** : le couloir de la mairie, Roux, une brochure de l'école d'arbitrage du district pliée en deux · **Conditions** : `flag('genou_amateur')`
**ROUX** *(président du district — neutre — il tend la brochure ; il l'a pliée pour qu'elle tienne dans ta poche, il a pensé à la poche)*
« Le district, c'est la base, et la base manque d'arbitres, surtout de jeunes qui connaissent les trous dans les surfaces. Vous prenez la brochure, ou vous attendez le genou ? »
← **Je prends la brochure** — effets : direction +, tribunes −, set: brochure_arbitre — *Tu la prends. Tu la lis deux fois. Tu ne t'inscris pas ; pas cette année ; tu la gardes.*
→ **J'attends le genou** — effets : vestiaire +, relation.roux −1 — *Il range la brochure. Il en aura une autre ; le district en imprime tous les ans.*
**Traces** : brochure_arbitre (« {annee} : Roux a donné la brochure d'arbitrage à {prenom} {nom}. Il l'a gardée. ») · **Réactions déclenchées** : — (intrigue de drame : aucune réaction) · **Lu plus tard par** : ch. 15 (Colline, responsable de l'arbitrage 2008 : « vous aviez la brochure »), ch. 30 (Carte Destin : la voie de l'arbitre, réservée), ch. 02 (Roux, retrouvailles)

### SCÈNE am.genou_21.sifflet  —  Le sifflet de Dédé
**Rôle** : joueur_amateur · **Intrigue** : am.genou_21 · **Étape** : 4/4 · **Moment** : [2,4] · **Lieu** : le banc de touche, la planche sur ses parpaings, ta béquille appuyée dessus · **Conditions** : —
**DÉDÉ** *(coach bénévole — sourire — il enlève le sifflet de son cou, lentement, comme un objet qui a un poids)*
« Bon, on va pas se mentir : tes genoux, c'est fini, ou c'est dix-huit mois, ce qui est fini aussi à ton âge. Mon sifflet, il est à toi ; tu le prends, ou tu attends la chance ? »
← **Je prends le sifflet** — effets : direction ++, vestiaire +, tribunes −, set: dede_sifflet, outcome: sifflet — *Tu le prends. Il pèse rien. Le mardi suivant, c'est toi qui siffles la fin ; les jumeaux obéissent, pour voir.*
→ **J'attends la chance** — effets : tribunes +, force −1, set: genou_amateur_reprend, outcome: reprend — *Tu attends. Dix-huit mois, puis un match, puis un autre bruit, plus petit. Tu joues, moins ; tu joues.*
Variante `flag('verite_genou') && relation.camille >= 1` : troisième chemin (la droite devient) **J'arrête, et je rentre** — effets : tribunes −, direction −, relation.camille +2, set: apres_le_foot, outcome: arrete — *Tu arrêtes. Camille conduit. Le village te fait une photo au bar ; elle est à l'endroit.*
**Traces** : dede_sifflet, genou_amateur_reprend, apres_le_foot (« {annee} : {prenom} {nom} a arrêté à vingt et un ans. Le genou avait parlé le premier. ») · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 30 (Carte Destin « reconversion précoce » ; écran « Après le foot »), ch. 11 (Dédé : « je t'ai donné mon sifflet »), fin am_touche (epitaph_plus), ch. 01 (Camille, palier +3 variante)
**Épilogue** : ligne « {annee} : à vingt et un ans, un genou. Le village a arrêté de faire des blagues pendant une semaine. »

## INTRIGUE am.coupe_poucet  —  Le Petit Poucet, côté crampons
**Logline** : La Coupe a tiré un club de D1 ; le stade tient deux mille personnes ; toi, tu marques leur dix. · **Synopsis** : Le tirage tombe à la radio du bar, Gérard lâche son verre. La semaine, Léa maquette une Une et Barbier annonce qu'il viendra, en doudoune. Le jour du match, Dédé n'a qu'un mot à la craie en face de ton nom : « lui ». Après, le pro d'en face propose l'échange de maillots ; le tien vaut un bar, le sien vaut trois mois de scierie. Le chapitre 13 écrit le côté président (`coupe_du_village`) : la recette, le chauffage, les deux mille places ; ici, on joue.
**Rôle(s)** : joueur_amateur · **Postulat(s)** : partagé · **Porteur** : dede · **Cast** : dede, gerard, lea, barbier, pichon, camille, « le pro d'en face » (voix) · **Thème** : tribune
**Saisons** : "1", "2+" · **Conditions d'entrée** : `world.coupe_tirage_ecart >= 2` (le tirage a donné deux divisions d'écart au moins) · **Exclusions** : — · **Rejouabilité** : replay {after: 2, max: 2}
**Issues** → **Traces** → **Qui les lit** : `tenu` → `poucet_tenu` (« {annee} : {ville} a tenu une mi-temps contre un club de D1. {prenom} {nom} marquait leur dix. ») → ch. 13 (`coupe_du_village` : « le petit qui marquait leur dix »), ch. 20, § 10.1 (Barbier : « je t'ai vu contre un pro ») · `but` → `but_poucet` (« {annee} : {prenom} {nom} a marqué contre un club de D1, en Coupe. Le village a un but. ») → ch. 30 (Carte Destin amateur → pro : poids ×2), ch. 90 (mémoire de club), une.village.poucet · `maillot` → `maillot_echange` → ch. 13 (le maillot sous verre au bar), fin am_heros (epitaph_plus), ch. 31 (anecdote)
**Séquencier** : tirage (ouverture) → semaine [in 1,2] → match [in 1,2] (Carte Match ou Grand Match) → apres [in 0,1].

### SCÈNE am.coupe_poucet.tirage  —  Deux mille places
**Rôle** : joueur_amateur · **Intrigue** : am.coupe_poucet · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : le bar-tabac, la radio sur le comptoir, le tirage en direct, Gérard qui a lâché son verre · **Conditions** : —
**GÉRARD** *(bénévole, trésorier — sourire — il ramasse le verre, il n'est pas cassé, il le repose sans le voir)*
« Ici, on payait en bières, et là il va falloir payer un stade : un club de D1 chez nous, deux mille places, huit cents habitants. Tu appelles tes cousins, ou ta mère ? »
← **Mes cousins, tout le canton** — effets : tribunes ++, caisse +, set: poucet_canton — *Tu appelles. Le canton vient. Gérard vend des merguez à des gens qu'il ne connaît pas ; ça ne lui était jamais arrivé.*
→ **Ma mère, d'abord** — effets : tribunes +, relation.camille +1 — *Tu appelles ta mère. Elle pleure. Elle dit qu'elle viendra ; elle vient ; elle ne regarde pas le match.*
Variante `plays() >= 1` (« encore ») : « Ici, on payait en bières, et le tirage nous refait le coup, un club de D1, deux ans après ; cette fois on a les merguez d'avance. Tu appelles qui ? » — mêmes sorties.
**Traces** : poucet_canton (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : am.coupe_poucet.apres (la recette), ch. 13 (Pichon compte le canton), am.repas.anniversaire (la date)

### SCÈNE am.coupe_poucet.semaine  —  La Une de dimanche
**Rôle** : joueur_amateur · **Intrigue** : am.coupe_poucet · **Étape** : 2/4 · **Moment** : [1,2] · **Lieu** : la buvette, Léa avec une maquette de Une, ton nom dedans, une place vide pour la photo · **Conditions** : —
**LÉA** *(L'Écho — sourire — elle tient la maquette à bout de bras pour que tu la voies entière)*
« Vous confirmez ? L'Écho titre « Huit cents habitants, deux mille places, un rêve », et Barbier a appelé pour dire qu'il viendrait, en doudoune. Vous posez pour la Une, ou vous vous entraînez ? »
← **Je pose** — effets : tribunes ++, force −1, relation.lea +1 — *Tu poses devant la buvette. La photo est belle. Barbier la découpe ; il la met dans le calepin.*
→ **Je m'entraîne** — effets : force +1, tribunes −, set: poucet_serieux — *Tu t'entraînes. Dédé fait trois séances au lieu d'une. Momo dit que c'est trop ; il vient quand même.*
Variante `flag('essai_rate')` : « Vous confirmez ? Barbier vient « revoir », c'est son mot, il l'a dit deux fois ; vous posez, ou vous vous entraînez ? » — mêmes sorties, la droite donne relation.barbier +1.
**Traces** : poucet_serieux (sans Almanach) · **Réactions déclenchées** : co.re.lea_confirme (∃) · **Lu plus tard par** : am.coupe_poucet.match (variante), § 10.1 (Barbier : la photo dans le calepin), ch. 20 (Écho : la Une du Petit Poucet)

### SCÈNE am.coupe_poucet.match  —  « Lui »
**Rôle** : joueur_amateur · **Intrigue** : am.coupe_poucet · **Étape** : 3/4 · **Moment** : [1,2], en Carte Match ou Grand Match · **Lieu** : le vestiaire, la compo à la craie, un seul mot en face de ton nom : « lui » · **Conditions** : —
**DÉDÉ** *(coach bénévole — neutre — il a écrit « lui » en plus gros que les noms, il a cassé la craie)*
« Bon, on va pas se mentir : leur dix vaut plus que le stade, et je peux te coller dessus quatre-vingt-dix minutes, ou te laisser jouer ton jeu et prier. Tu le marques, ou tu joues ? »
← **Je le marque** — effets : vestiaire ++, tribunes +, force −1, rand: [{p: 0.5, set: poucet_tenu, outcome: tenu}, {tribunes −}] — *Tu le marques. Il te parle à la trentième ; il te dit ton prénom ; il l'a lu dans L'Écho.*
→ **Je joue mon jeu** — effets : tribunes ++, vestiaire −, rand: [{p: 0.15, set: but_poucet, outcome: but, tribunes +++}, {set: poucet_tenu, outcome: tenu}] — *Tu joues. Tu marques, ou tu tiens. Le stade fait plus de bruit que ses deux mille places.*
Variante `flag('poucet_serieux')` : Dédé ajoute « et tu as fait trois séances, je t'ai vu, alors tu peux les deux » ; la gauche a `p: 0.65`.
**Traces** : poucet_tenu, but_poucet · **Réactions déclenchées** : am.re.gege_cousin_poucet (§ 7) · **Lu plus tard par** : am.coupe_poucet.apres (variante), ch. 13, ch. 20 (« LE VILLAGE A TENU »), ch. 30 (Carte Destin), ch. 90, une.village.poucet

### SCÈNE am.coupe_poucet.apres  —  L'échange
**Rôle** : joueur_amateur · **Intrigue** : am.coupe_poucet · **Étape** : 4/4 · **Moment** : [0,1] · **Lieu** : le rond central, après le coup de sifflet, le pro d'en face avec son maillot déjà enlevé, il fait froid, Pichon qui compte la recette à la buvette · **Conditions** : —
**LE PRO D'EN FACE** *(voix sans portrait — il tient le maillot par le col, il a fait ça cent fois)*
« Ton maillot contre le mien, c'est l'usage, le mien vaut trois mois de ton salaire à la scierie, on m'a dit ; tu échanges, ou tu gardes le tien pour le bar ? »
← **J'échange** — effets : tribunes +, caisse −, set: maillot_echange, outcome: maillot — *Tu échanges. Le maillot du pro est au bar. Gérard le met sous verre ; il le vendra un jour ; il le sait.*
→ **Je garde le mien** — effets : tribunes ++, vestiaire + — *Tu gardes. Le pro hausse les épaules. Pichon compte la recette ; elle paie le chauffage jusqu'à l'hiver d'après.*
Variante `flag('but_poucet')` : « Ton maillot, celui du but, c'est le mien qui le demande, cette fois, c'est l'usage à l'envers ; tu échanges, ou tu le gardes pour le bar ? » — mêmes sorties, la gauche donne tribunes ++.
**Traces** : maillot_echange (« {annee} : {prenom} {nom} a échangé son maillot avec un pro. Il est sous verre, au bar. ») · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 13 (le maillot sous verre : « on ne le vend pas »), fin am_heros (epitaph_plus), ch. 31 (anecdote : le maillot du bar)
**Épilogue** : ligne « {annee} : la Coupe est passée par {ville}. Deux mille places, huit cents habitants. »

## INTRIGUE am.repas_dimanche  —  Le gigot de midi
**Logline** : La belle-mère sert le gigot à midi et demi ; le match est à quinze heures ; aucun des deux ne bouge. · **Synopsis** : Le rituel des dimanches de belle-mère : Camille a fait le calcul, sa mère non. Le gigot, la belle-mère qui « sait ce que c'est » parce que son mari jouait aussi, l'anniversaire qui tombe le jour de la Coupe, et le dimanche où Dédé est invité pour qu'on lui demande de te faire jouer moins. Intrigue légère et tendre : c'est là que Camille se gagne ou se perd chez l'amateur, une part de gigot à la fois.
**Rôle(s)** : joueur_amateur · **Postulat(s)** : partagé · **Porteur** : camille · **Cast** : camille, « la belle-mère » (voix), dede, « Momo » · **Thème** : famille
**Saisons** : "0", "2+" (ritual) · **Conditions d'entrée** : `!flag('divorce')` · **Rejouabilité** : ritual (escalier sur `plays()`)
**Issues** → **Traces** → **Qui les lit** : `gigot` → `gigot_mange` (sans Almanach) → ch. 01 (Camille : « il vient manger, celui-là »), am.repas.dede · `match` → `belle_mere_vexee` (« {annee} : {prenom} {nom} a manqué le gigot pour un match. La belle-mère a compté. ») → ch. 01 (Camille, palier −1 plus tôt), am.repas.anniversaire (variante) · `dede_invite` → `dede_a_table` (« {annee} : Dédé a mangé le gigot chez la belle-mère de {prenom} {nom}. Il a menti sur le temps de jeu. ») → ch. 11 (Dédé adjoint : « j'ai mangé chez ta belle-mère »), § 10.2
**Séquencier** : gigot (ouverture) → belle_mere [in 0,1] → anniversaire [in 3,9] (`poucet_canton` ou un dimanche de Coupe) → dede (S2+, `plays >= 1`).

### SCÈNE am.repas.gigot  —  Midi et demi
**Rôle** : joueur_amateur · **Intrigue** : am.repas_dimanche · **Étape** : 1/4 · **Moment** : ouverture tirée, un dimanche · **Lieu** : la cuisine, deux assiettes, la pendule au-dessus du four, ton sac de sport près de la porte · **Conditions** : —
**CAMILLE** *(neutre — elle regarde la pendule, pas toi ; elle a fait le calcul)*
« Tu rentres à quelle heure, non, tu pars à quelle heure : ma mère sert le gigot à midi et demi, et ton match est à quinze heures à quarante kilomètres. Tu manges vite, ou tu manges dimanche prochain ? »
← **Je mange vite** — effets : relation.camille +1, force −1, set: gigot_mange, outcome: gigot — *Tu manges. Vite. Ta belle-mère dit que tu manges mal. Tu joues lourd ; Dédé te met à droite.*
→ **Dimanche prochain** — effets : relation.camille −1, force +1, set: belle_mere_vexee, outcome: match — *Tu pars sans manger. Ta belle-mère garde une part au chaud jusqu'à dix-neuf heures ; elle la jette devant toi.*
Variante `plays() >= 1` (« encore ») : « Tu rentres à quelle heure, c'est le troisième gigot de la saison, et ma mère a avancé l'heure : midi. Tu manges vite, ou tu manges dimanche prochain ? » — mêmes sorties.
**Traces** : gigot_mange, belle_mere_vexee · **Réactions déclenchées** : am.re.belle_mere_part (§ 7, après →) · **Lu plus tard par** : am.repas.belle_mere, am.repas.anniversaire, ch. 01 (Camille)

### SCÈNE am.repas.belle_mere  —  Mon mari jouait aussi
**Rôle** : joueur_amateur · **Intrigue** : am.repas_dimanche · **Étape** : 2/4 · **Moment** : [0,1] · **Lieu** : la table de la belle-mère, le gigot, elle sert debout, elle ne s'assoit jamais · **Conditions** : `flag('gigot_mange')`
**LA BELLE-MÈRE** *(voix sans portrait — elle sert en parlant, elle parle en servant)*
« Mon mari jouait aussi, le dimanche, et il rentrait à quatre heures du matin, alors je sais ce que c'est ; vous, vous rentrez à quelle heure, mon gendre ? »
← **Avant minuit, madame** — effets : direction +, tribunes −, relation.camille +1 — *Tu rentres à minuit moins cinq. Elle a regardé la pendule ; elle ne le dit pas.*
→ **Ça dépend du score** — effets : tribunes +, relation.camille −1 — *Elle sert Camille d'abord. Elle te sert la part la plus petite ; c'est un langage.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : am.repas.dede (variante « son mari jouait avec Dédé »)

### SCÈNE am.repas.anniversaire  —  Les bougies et la Coupe
**Rôle** : joueur_amateur · **Intrigue** : am.repas_dimanche · **Étape** : 3/4 · **Moment** : [3,9], un dimanche de Coupe · **Lieu** : la cuisine, un gâteau sur la table, le tirage de la Coupe punaisé sur le frigo, la même date · **Conditions** : `flag('poucet_canton') || world.coupe_dimanche`
**CAMILLE** *(neutre ; noir si `belle_mere_vexee` — elle a posé les bougies à côté du gâteau, pas dessus)*
« Tu rentres à quelle heure, c'est l'anniversaire de ma mère, c'est le jour de la Coupe, et je n'ai pas choisi la date, ni toi. Tu viens souffler les bougies à midi, ou tu la vois après le match ? »
← **Les bougies à midi** — effets : relation.camille +2, force −1, tribunes − — *Tu souffles. Ta belle-mère dit que tu es pâle. Tu arrives au stade à quatorze heures quarante ; Dédé te met quand même.*
→ **Après le match** — effets : relation.camille −1, tribunes +, set: belle_mere_vexee — *Tu viens après. Le gâteau est entamé. Elle a gardé une bougie ; elle ne l'allume pas.*
**Traces** : belle_mere_vexee · **Réactions déclenchées** : co.re.camille_journal (∃) · **Lu plus tard par** : ch. 01 (Camille, palier −1 : « l'anniversaire de ma mère »), am.coupe_poucet.match (variante « tu es arrivé à quatorze heures quarante »)

### SCÈNE am.repas.dede  —  Dédé a mis une chemise
**Rôle** : joueur_amateur · **Intrigue** : am.repas_dimanche · **Étape** : 4/4 · **Moment** : saison 2+, `plays() >= 1` · **Lieu** : la table de la belle-mère, Dédé invité, une bouteille apportée, une chemise, pas de casquette · **Conditions** : —
**DÉDÉ** *(coach bénévole — sourire — il a plié la casquette dans la poche de la chemise ; elle dépasse)*
« Bon, on va pas se mentir : ta belle-mère m'a invité pour me demander de te faire jouer moins, et j'ai dit oui, pour le gigot. Tu me couvres devant elle, ou tu me laisses lui dire la vérité ? »
← **Je te couvre** — effets : relation.dede +1, relation.camille −1, set: dede_a_table, outcome: dede_invite — *Tu le couvres. Il mange deux fois. Il dit que tu joues « très peu » ; tu joues tout.*
→ **Dis-lui la vérité** — effets : relation.camille +1, relation.dede −1, tribunes + — *Il dit la vérité. Elle ressert. Elle lui dit que son mari jouait aussi ; il le savait, il jouait avec lui.*
Variante `plays() >= 2` : « Bon, on va pas se mentir : c'est le troisième gigot, elle me réinvite, et je crois qu'elle m'aime bien ; tu me couvres encore, ou on arrête de mentir ? » — mêmes sorties.
**Traces** : dede_a_table · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 11 (Dédé adjoint bénévole : « j'ai mangé chez ta belle-mère »), § 10.2 (Carte Destin : « tu m'as couvert devant ta belle-mère »)
**Épilogue** : ligne « {annee} : le gigot du dimanche. Midi et demi, comme le match. »

## INTRIGUE am.selection_ligue  —  La sélection de la Ligue
**Logline** : Roux t'a mis dans la sélection amateur de la Ligue ; le match est à la Dorne ; Brissac chronomètre. · **Synopsis** : Chaque année, le district propose un nom à la Ligue pour le match des amateurs contre les espoirs de Valdorne. Cette année c'est le tien, ou celui de Karim si tu laisses la place. Un stage de deux jours où Brissac chronomètre trente mètres dans une colonne « amateurs » qui n'a jamais de chiffres ; le match à la Dorne, Barbier sur la butte, le calepin ouvert ; et le retour au village avec un maillot que Dédé n'a jamais eu. C'est le premier pied de l'amateur dans les instances : il apprend qu'un chiffre suit un joueur.
**Rôle(s)** : joueur_amateur · **Postulat(s)** : partagé · **Porteur** : roux · **Cast** : roux, brissac, barbier, dede, camille, « Karim » (voix), « les jumeaux » · **Thème** : instances
**Saisons** : "0", "1" · **Conditions d'entrée** : `gauges.direction >= 45 && age <= 23` · **Exclusions** : `essai_pro` déjà lu par la Carte Destin · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `pris` → `selection_ligue` (« {annee} : {prenom} {nom} a joué pour la sélection de la Ligue, à la Dorne. Brissac a noté un chiffre. ») → am.doudoune (variante, poids ×2), § 10.1 (Barbier : « la Ligue t'a déjà vu »), ch. 14 (Brissac : « je vous ai vu en sélection de Ligue »), ch. 15 (Roux : « j'ai proposé son nom ») · `refuse` → `ligue_refusee` → ch. 02 (Roux −1), ch. 15 · `karim` → `karim_selectionne` → am.montbeliac (variante « Karim a le maillot de la Ligue et le brassard vert »), co.derby.ancien
**Séquencier** : roux (ouverture) → stage [in 1,2] (`selection_ligue`) → dorne [in 1,3] (`selection_ligue`) → retour [in 0,2].

### SCÈNE am.selection_ligue.roux  —  Un nom par an
**Rôle** : joueur_amateur · **Intrigue** : am.selection_ligue · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : le parking du stade, Roux avec une lettre à en-tête de la Ligue, il l'a lue trois fois dans la voiture · **Conditions** : —
**ROUX** *(président du district — sourire — il tient la lettre à deux mains, comme un diplôme)*
« Le district, c'est la base, et la base propose un nom à la Ligue chaque année ; cette année c'est le vôtre, contre les espoirs de Valdorne. Vous y allez, ou vous laissez la place ? »
← **J'y vais** — effets : direction ++, tribunes +, set: selection_ligue, outcome: pris — *Tu y vas. Roux te serre la main ; il retient ton prénom ; c'est la première fois qu'il retient un prénom.*
→ **À quelqu'un du village** — effets : vestiaire ++, direction −, set: ligue_refusee, set: karim_selectionne, outcome: refuse — *Karim y va. Il revient avec un maillot. Il le porte au bar ; il ne le lave pas.*
Variante `flag('district_sanction')` : « Le district, c'est la base, et la base vous a suspendu trois matchs il y a un an, et vous propose aujourd'hui ; c'est comme ça, la base. Vous y allez ? » — mêmes sorties.
**Traces** : selection_ligue, ligue_refusee, karim_selectionne · **Réactions déclenchées** : am.re.roux_prenom (§ 7, après ←) · **Lu plus tard par** : am.selection_ligue.stage, am.doudoune, am.montbeliac, § 10.1, ch. 02, ch. 14, ch. 15

### SCÈNE am.selection_ligue.stage  —  La colonne vide
**Rôle** : joueur_amateur · **Intrigue** : am.selection_ligue · **Étape** : 2/4 · **Moment** : [1,2] · **Lieu** : un terrain de la Ligue, un stage de deux jours, Brissac avec un chronomètre et une feuille à deux colonnes, « pros » et « amateurs » · **Conditions** : `flag('selection_ligue')`
**BRISSAC** *(DTN — neutre — elle montre la colonne « amateurs » du bout du stylo ; elle est vide)*
« Les chiffres sont têtus, les joueurs aussi, et la colonne « amateurs » n'a jamais de chiffres, personne ne les prend ; trente mètres, je chronomètre. Vous courez à fond, ou comme dimanche ? »
← **À fond** — effets : force −1, direction +, relation.brissac +1, set: chrono_brissac — *Tu cours. Elle note. Le chiffre est bon ; elle le souligne ; elle ne souligne jamais.*
→ **Comme dimanche** — effets : vestiaire +, tribunes + — *Tu cours comme dimanche. Elle note « dimanche ». Ce n'est pas un chiffre ; elle le garde quand même.*
**Traces** : chrono_brissac (« {annee} : Brissac a chronométré {prenom} {nom} sur trente mètres. Elle a souligné. ») · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 14 (Brissac : « j'ai votre chiffre depuis la Ligue »), ch. 02 (Brissac, retrouvailles), § 10.1 (Barbier : « Brissac a un chiffre, moi j'ai un calepin »)

### SCÈNE am.selection_ligue.dorne  —  Sans pluie
**Rôle** : joueur_amateur · **Intrigue** : am.selection_ligue · **Étape** : 3/4 · **Moment** : [1,3] · **Lieu** : le stade de la Dorne, terrain annexe, Barbier sur la butte, la doudoune, le calepin ouvert cette fois · **Conditions** : `flag('selection_ligue')`
**BARBIER** *(recruteur — neutre — il a ouvert le calepin avant le coup d'envoi, ce qu'il ne fait jamais)*
« Je l'ai vu jouer sous la pluie, disais-je, et aujourd'hui tu joues contre nos espoirs, sur notre pelouse, sans pluie. Tu joues pour le calepin, ou pour la Ligue ? »
← **Pour le calepin** — effets : tribunes +, vestiaire −, force +1, relation.barbier +1, set: essai_pro — *Tu joues pour lui. Il écrit une page. Il ferme le calepin avant la fin ; c'est bon signe.*
→ **Pour la Ligue, pour nous** — effets : vestiaire ++, tribunes +, relation.barbier +1, set: revanche_calme — *Tu joues pour les onze. Vous perdez trois à un. Il n'écrit rien ; il te fait un signe de tête ; deux, cette fois.*
Variante `flag('revanche_valdorne')` (lache_academie) : « Je l'ai vu jouer sous la pluie, et c'est la deuxième fois que tu joues contre nous ; Valdorne a relu deux fois mon rapport, ils vont finir par le connaître. Le calepin, ou la Ligue ? » — mêmes sorties, la gauche donne relation.barbier +2.
**Traces** : essai_pro, revanche_calme · **Réactions déclenchées** : co.re.barbier_doudoune (ch. 02) · **Lu plus tard par** : am.doudoune (variante « la Ligue t'a déjà montré »), § 10.1, ch. 02 (Barbier : la page du calepin)

### SCÈNE am.selection_ligue.retour  —  Le maillot que Dédé n'a jamais eu
**Rôle** : joueur_amateur · **Intrigue** : am.selection_ligue · **Étape** : 4/4 · **Moment** : [0,2] · **Lieu** : le vestiaire du village, le mardi, le maillot de la Ligue sur ton sac, Dédé qui le regarde comme un objet rare · **Conditions** : —
**DÉDÉ** *(coach bénévole — neutre ; noir si `karim_selectionne` — il touche le maillot du bout des doigts, il ne le prend pas)*
« Bon, on va pas se mentir : le maillot de la Ligue, moi je ne l'ai jamais eu, et les jumeaux te regardent différemment depuis lundi. Tu le portes à l'entraînement, ou tu le laisses chez toi ? »
← **Je le laisse chez moi** — effets : vestiaire ++, tribunes −, relation.dede +1 — *Tu le laisses. Camille le range avec les choses qui comptent. Les jumeaux redeviennent les jumeaux.*
→ **Je le porte, une fois** — effets : tribunes ++, vestiaire −−, set: maillot_ligue_porte — *Tu le portes. Le mardi est silencieux. Momo demande s'il est lavable ; il le dit gentiment ; pas tous.*
Variante `flag('karim_selectionne')` : « Bon, on va pas se mentir : Karim porte le maillot de la Ligue au bar depuis lundi, et il ne le lave pas ; toi tu lui as laissé la place. Tu lui dis bravo devant tout le monde, ou tu le laisses le porter ? » — ← **Bravo, devant tout le monde** — vestiaire ++, relation.dede +1 — *Tu le dis. Karim rougit ; c'est la seule fois.* · → **Je le laisse le porter** — vestiaire −, tribunes + — *Tu ne dis rien. Il le porte encore en juin ; il sent la Ligue.*
**Traces** : maillot_ligue_porte (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : alarme `am.alarme.vestiaire_bas_vieux` (variante « le maillot de la Ligue »), fin am_caid (epitaph_plus)
**Épilogue** : ligne « {annee} : la Ligue a pris un nom au village. Le village l'a regardé autrement. »

## INTRIGUE am.car_gerard  —  Le car de Gérard
**Logline** : Le car du club a vingt ans, Gérard conduit, le déplacement est à Île-Verte, un bateau par jour. · **Synopsis** : Le rituel des déplacements lointains : le car tombe en panne sur la côte et on pousse ; le bateau d'Île-Verte part sans vous, ou avec vous, en barque ; la neige de Haute-Combe reporte le match et vous dormez dans le car ; le retour tombe à cinq heures devant le fournil de Pichon, parce que c'est là que Gérard sait freiner. Intrigue absurde et tendre, sans grand enjeu de jauge : c'est le liant du rôle, ce qu'on raconte au bar dix ans plus tard.
**Rôle(s)** : joueur_amateur · **Postulat(s)** : partagé · **Porteur** : gerard · **Cast** : gerard, dede, pichon, camille, « Momo » (voix) · **Thème** : absurde
**Saisons** : "0", "2+" (ritual) · **Conditions d'entrée** : `world.deplacement_lointain` (Île-Verte, Haute-Combe ou Puymarin au calendrier) · **Rejouabilité** : ritual (escalier sur `plays()`)
**Issues** → **Traces** → **Qui les lit** : `bateau_rate` → `bateau_rate` (« {annee} : le car de Gérard a raté le bateau d'Île-Verte. Forfait, et deux cents merguez sur le quai. ») → ch. 31 (anecdote Île-Verte : « un bateau par jour »), ch. 13 (président amateur : « le car a une histoire »), ch. 15 (Roux : le forfait « examiné ») · `barque` → `barque_ile_verte` (« {annee} : {ville} a traversé en barque pour jouer à Île-Verte. Deux voyages, onze joueurs mouillés. ») → ch. 13, ch. 31, ch. 90 (mémoire d'Île-Verte : +2) · `nuit_car` → `nuit_dans_le_car` → ch. 01 (Camille : « la neige par L'Écho »), fin am_comptoir (epitaph_plus) · `pousse` → `car_pousse` → ch. 13, ch. 90
**Séquencier** : panne (ouverture) → bateau [in 0,1] (Île-Verte) ou neige [in 0,1] (Haute-Combe) → cinq_heures [in 0,1] ; variantes « encore » sur `plays()`.

### SCÈNE am.car.panne  —  Payé en bières aussi
**Rôle** : joueur_amateur · **Intrigue** : am.car_gerard · **Étape** : 1/4 · **Moment** : ouverture tirée, un dimanche de déplacement lointain · **Lieu** : le bord de la route côtière, le car, le capot ouvert, Gérard qui regarde le moteur comme la boîte en fer, sans comprendre · **Conditions** : —
**GÉRARD** *(bénévole — neutre — il tapote une pièce du moteur au hasard ; elle ne répond pas)*
« Ici, on payait en bières, et le car, on l'a payé en bières aussi, il y a vingt ans, ça se sent ; le bateau part dans quarante minutes. On pousse, ou on appelle Pichon et sa camionnette ? »
← **On pousse** — effets : vestiaire ++, force −1, set: car_pousse, outcome: pousse — *Vous poussez. Le car démarre en côte. Momo tombe ; il se relève ; il pousse encore.*
→ **La camionnette du pain** — effets : direction +, vestiaire −, caisse −, relation.pichon −1 — *Pichon vient. Vous arrivez au bateau dans une odeur de croissant. Le capitaine demande s'il en reste.*
Variante `plays() >= 1` (« encore ») : « Ici, on payait en bières, et le car est tombé en panne au même virage que l'an dernier, il a de la mémoire ; on pousse, comme l'an dernier ? » — mêmes sorties, la gauche donne tribunes + en plus (la route s'en souvient).
**Traces** : car_pousse (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : am.car.bateau (variante), ch. 13 (président amateur : « le car de Gérard, tu l'as poussé »), ch. 90

### SCÈNE am.car.bateau  —  Un bateau par jour
**Rôle** : joueur_amateur · **Intrigue** : am.car_gerard · **Étape** : 2/4 · **Moment** : [0,1] · **Lieu** : le quai, le bateau d'Île-Verte à cinquante mètres, qui s'éloigne, Momo au bord avec le sac de ballons · **Conditions** : `world.deplacement == 'ile_verte'`
**MOMO** *(voix sans portrait — il tient le sac de ballons au-dessus de l'eau, sans raison)*
« Le bateau est parti, c'est le seul de la journée, et Gérard dit que leur président peut nous envoyer une barque. Tu montes dans la barque, ou on déclare forfait et on mange les merguez ici ? »
← **La barque** — effets : tribunes ++, vestiaire +, force −2, set: barque_ile_verte, outcome: barque — *Vous traversez à six dans une barque, en deux voyages. Vous jouez à onze, mouillés. Vous perdez ; c'est la plus belle défaite du canton.*
→ **Forfait, merguez** — effets : tribunes −−, direction −, caisse +, set: bateau_rate, outcome: bateau_rate — *Forfait. Gérard fait griller deux cents merguez sur le quai. Le district « examine » ; Roux vient manger.*
Variante `flag('car_pousse')` : Momo ajoute « on a poussé pour rien, alors » ; la gauche donne vestiaire ++ à la place.
**Traces** : barque_ile_verte, bateau_rate · **Réactions déclenchées** : am.re.momo_barque (§ 7, après ←) · **Lu plus tard par** : ch. 31, ch. 13, ch. 15 (Roux : le forfait), ch. 90 (mémoire d'Île-Verte), fin am_comptoir (epitaph_plus « les merguez du quai »)

### SCÈNE am.car.neige  —  Quarante centimètres
**Rôle** : joueur_amateur · **Intrigue** : am.car_gerard · **Étape** : 3/4 · **Moment** : [0,1] · **Lieu** : le parking du stade des Névés, Haute-Combe, blanc, Dédé avec la casquette pleine de neige · **Conditions** : `world.deplacement == 'haute_combe' || plays() >= 1`
**DÉDÉ** *(coach bénévole — neutre — il secoue la casquette, il la remet, elle est encore pleine)*
« Bon, on va pas se mentir : le match est reporté, il y a quarante centimètres, et le car ne redescend pas ce soir, les freins n'aiment pas la neige. On dort dans le car, ou on trouve un bar ? »
← **Dans le car** — effets : vestiaire ++, tribunes −, force −1, set: nuit_dans_le_car, outcome: nuit_car — *Vous dormez à dix-huit dans le car. Momo chante. Puis il ne chante plus ; il ronfle ; c'est pire.*
→ **Un bar, et on verra** — effets : tribunes ++, caisse −, relation.camille −1, set: nuit_bar_combe — *Vous trouvez un bar. Il ferme à deux heures ; il rouvre pour vous. Camille apprend la neige par L'Écho.*
**Traces** : nuit_dans_le_car, nuit_bar_combe (sans Almanach) · **Réactions déclenchées** : co.re.camille_journal (∃, après →) · **Lu plus tard par** : ch. 01 (Camille : « la neige par L'Écho »), fin am_comptoir (epitaph_plus), ch. 31 (anecdote Haute-Combe : « matchs reportés »)

### SCÈNE am.car.cinq_heures  —  Le car freine devant le fournil
**Rôle** : joueur_amateur · **Intrigue** : am.car_gerard · **Étape** : 4/4 · **Moment** : [0,1], le retour · **Lieu** : le parking de la boulangerie, cinq heures, le car arrêté devant le fournil parce que c'est là que Gérard sait freiner · **Conditions** : —
**PICHON** *(boulanger — sourire — il sort avec un plateau, il a compté les têtes par la vitre)*
« Le pain, c'est à cinq heures, et le car aussi, on dirait ; vous avez une tête de forfait ou une tête de barque. Vous prenez un croissant et vous rentrez, ou vous m'aidez et vous mangez ? »
← **On aide** — effets : direction +, vestiaire +, force −1, relation.pichon +1 — *Vous enfournez à onze. Le pain de dimanche est tordu. Le village le trouve bon.*
→ **Un croissant et on rentre** — effets : caisse +, tribunes − — *Vous prenez. Il compte mal, exprès. Camille vous voit passer par la fenêtre ; elle ne demande pas l'heure.*
Variante `plays() >= 2` : « Le pain, c'est à cinq heures, et c'est la troisième fois que le car freine devant mon fournil, Gérard, un jour il freinera dedans. Vous aidez, ou vous rentrez ? » — mêmes sorties.
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 13 (Pichon : « le car freinait devant le fournil »), ch. 02 (Pichon, retrouvailles)
**Épilogue** : ligne « {annee} : le car de Gérard. Il a vingt ans ; il en aura trente. »


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
**Rôle** : joueur · **Intrigue** : jp.pepite.club_usine · **Étape** : 1/10 · **Moment** : saison 0, slot 1 · **Lieu** : le parking de l'usine, la voiture de Fardelli, moteur allumé, un journal plié sur le tableau de bord · **Conditions** : —
**FARDELLI** *(agent — neutre — il baisse la vitre à moitié ; il ne t'invite pas à monter)*
« Tu vaux trois millions ce matin, {toi}, quatre ce soir si tu marques. Mon ami, on parle d'argent ou d'amitié : je te représente à dix pour cent, et on choisit ensemble où tu joues. »
← **Dix pour cent, on est amis** — effets : direction +, caisse +, relation.fardelli +1, set: agent_fardelli — *Il monte la vitre. Le contrat est déjà signé de sa main ; il manque la tienne, en bas, là où il tapote.*
→ **Je choisis seul où je joue** — effets : direction −, tribunes +, relation.fardelli −1, set: sans_agent — *Il remonte la vitre plus vite. « Trois millions sans agent, ça fait deux et demi », dit-il au pare-brise.*
Variante `fil_rouge == 'prix'` : « Tu vaux trois millions ce matin, quatre ce soir si tu marques, six en janvier si tu ne te blesses pas. Mon ami, on parle d'argent ou d'amitié : je compte, et toi tu cours. » · Variante `fil_rouge == 'terrain'` : « Tu vaux trois millions, mais un joueur qui veut jouer vaut moins qu'un joueur qui veut partir, c'est le marché. Mon ami, on parle d'argent ou d'amitié : je vends, et toi tu joues où on te vend. » · Variante `fil_rouge == 'maison'` : « Tu vaux trois millions, et ta mère a demandé si on pouvait te vendre près de la maison ; on ne vend pas près, on vend cher. Mon ami, on parle d'argent ou d'amitié ? »
Variante `flag('rapport_trop_lent')` (ch. 02) : « Trois millions, dit Fardelli ; trop lent, dit Barbier, dans un rapport que tout le monde a lu. Mon ami, on parle d'argent ou d'amitié : moi je vends les lents aussi, un peu moins cher. » · Variante `flag('rancune_valdorne')` : « Tu vaux trois millions, avec un an de retard, parce que la doudoune ne t'avait pas rappelé. Mon ami, on parle d'argent ou d'amitié : cette fois, c'est moi qui rappelle. » · Variante `flag('agent_fardelli')` (venu de `lache_academie`) : un bouton — **On continue, Rocco** — direction +, relation.fardelli +1 — *Il ne monte pas la vitre. Il te dit le chiffre ; il l'avait depuis Valdorne.*
**Traces** : agent_fardelli, sans_agent (« {annee} : {prenom} {nom} a dit non à Fardelli. Trois millions sont devenus deux et demi. ») · **Réactions déclenchées** : jp.re.aulard_quatre_millions (§ 7) · **Lu plus tard par** : jp.pepite.p2_hiver, jp.pepite.p3_vente, jp.contrat_image (`if: flag('agent_fardelli')`), jp.clause, objectif `pepite_destination`, alarme caisse basse (variante), ch. 02 (Fardelli : paliers), ch. 12 (« tu as été mon client »)

### SCÈNE jp.pepite.p2_hiver  —  Le mercato d'hiver
**Rôle** : joueur · **Intrigue** : jp.pepite.club_usine · **Étape** : 2/10 · **Moment** : saison 0, [10,11] · **Lieu** : le bureau d'Aulard, un fax qui crache, Josiane qui ramasse · **Conditions** : —
**AULARD** *(président — neutre — il lit le fax debout, il ne s'assoit jamais en janvier)*
« Une offre de janvier, {toi}, un club de D1 qui paie maintenant et prend en juin. J'ai pas le temps, j'ai une usine : tu dis oui ce soir, ou tu finis la saison ici et je vends plus cher ? »
← **Oui ce soir** — effets : caisse ++, direction +, tribunes −−, set: vente_janvier — *Il signe le fax. Josiane le classe sous « janvier », le dossier le plus épais du club.*
→ **Je finis la saison ici** — effets : tribunes ++, direction −, force +1, set: finit_saison — *Il déchire le fax. Il en a une copie ; à l'usine, on a toujours une copie.*
Variante `fil_rouge == 'maison'` : « Une offre de janvier, d'un club de D2 à trente kilomètres de chez ta mère, et une autre de D1 à six cents. J'ai pas le temps, j'ai une usine : la maison, ou la carrière ? » — ← **La maison** — tribunes +, caisse −, set: enfant_du_pays_hiver — *Il note « maison » sur le fax. Il ne comprend pas ce mot-là ; il le note quand même.* · → **La carrière** — caisse ++, tribunes − — *Ta mère l'apprend par L'Écho. Elle raccroche en soupirant très fort.*
Variante `flag('international')` : « Une offre de janvier, {toi}, et depuis que tu joues en bleu cobalt le prix a doublé. J'ai pas le temps, j'ai une usine : on vend à Capitale FC ce soir, ou on attend le Continental ? » — mêmes sorties, la gauche donne caisse +++ (le seul +++ du script).
Variante `flag('enfant_du_pays')` (jp.tifo) : « Une offre de janvier, et une bâche de vingt mètres à ton nom dans la Tribune Nord qui dit le contraire. J'ai pas le temps, j'ai une usine : tu pars sous la bâche, ou tu restes dessous ? » — ← **Je pars sous la bâche** — caisse ++, tribunes −−−, parole −2, relation.gege −2, set: vente_janvier — *Gégé décroche la bâche lui-même. Il la plie. Il ne la jette pas.* · → **Je reste dessous** — tribunes ++, direction −, parole +1, set: finit_saison — *La bâche reste. Aulard fait repeindre le prix sur le panneau d'affichage, à côté.*
**Traces** : vente_janvier, finit_saison, enfant_du_pays_hiver · **Réactions déclenchées** : co.re.josiane_a_lu (∃, `!seen`) · **Lu plus tard par** : jp.pepite.p3_vente (variantes), ch. 20 (« VENDU EN JANVIER, LIVRÉ EN JUIN »)

### SCÈNE jp.pepite.p2b_dernier_bloc  —  Le dernier match de l'usine
**Rôle** : joueur · **Intrigue** : jp.pepite.club_usine · **Étape** : 3/10 · **Moment** : saison 0, slot 16 (le dernier match de championnat, la veille de P3) · **Lieu** : le couloir des vestiaires de l'usine, Bréhaut avec la feuille de match, Fardelli au bout du couloir qui regarde sa montre · **Conditions** : —
**BRÉHAUT** *(capitaine — neutre — il tient la feuille contre sa poitrine, il ne l'a pas encore affichée)*
« Le groupe vit bien, et dimanche c'est la montée ou le barrage ; ton agent a demandé qu'on te ménage pour la visite médicale de lundi. Tu joues tout, ou tu sors à l'heure ? »
← **Quatre-vingt-dix, pour eux** — effets : vestiaire ++, tribunes +, force −1, rand: [{p: 0.15, set: genou}, {}], set: dernier_bloc_joue — *Tu joues tout. Le groupe te porte à la fin, ou te ramasse. Fardelli regarde sa montre pendant le tour d'honneur.*
→ **Je sors à l'heure** — effets : direction +, caisse +, vestiaire −−, set: dernier_bloc_menage — *Tu sors à la soixantième. Le stade siffle la sortie, pas toi ; c'est pareil. Lundi, ton genou est propre.*
Variante `fil_rouge == 'maison'` : « Le groupe vit bien, et ta mère est en tribune d'honneur, le président l'a invitée, il ne fait jamais ça. Tu joues pour elle, ou pour le barrage ? » — mêmes sorties.
Variante `flag('enfant_du_pays')` — **GÉGÉ** *(capo — sourire — la bâche déroulée pour la dernière fois de la saison, ou la dernière fois)* : « La tribune n'oublie rien, et dimanche la bâche descend pour la dernière fois de la saison, ou pour la dernière fois. Tu passes dessous à l'échauffement, ou tu restes au milieu ? » — ← **Dessous** — tribunes ++, relation.gege +1, set: dernier_bloc_joue — *Tu passes dessous. Elle te touche la tête ; c'est voulu.* · → **Au milieu, avec le groupe** — tribunes −, vestiaire +, set: dernier_bloc_joue — *Tu restes au milieu. La bâche descend quand même ; sur personne.*
Variante `flag('mouton_noir')` — **VECCHIO** *(gardien — neutre — Bréhaut ne t'adresse pas la parole ; Gigi, si)* : « J'en ai vu d'autres, des derniers matchs où personne ne te fait la passe ; dimanche, tu la demandes, ou tu la prends ? » — ← **Je la demande** — vestiaire +, set: dernier_bloc_joue — *Tu demandes. On te la fait ; une ; Gigi, du pied.* · → **Je la prends** — tribunes +, vestiaire −, force +1, set: dernier_bloc_joue — *Tu la prends. Tu marques. Personne ne vient ; tu cours seul vers le virage.*
**Traces** : dernier_bloc_joue, dernier_bloc_menage (sans Almanach ; drapeaux de script) · **Réactions déclenchées** : jp.re.fardelli_montre_tour (§ 7) · **Lu plus tard par** : jp.pepite.p3_vente (variante `genou_cache` : si `dernier_bloc_joue && flag('genou')`, la visite médicale de lundi devient la scène), set-piece `gm_annonce` joueur (ch. 30 : variante « ton agent a demandé qu'on te ménage »), jp.pepite.s1_veille (Fardelli : « l'an dernier tu avais joué tout »)

### SCÈNE jp.pepite.p3_vente  —  La vente
**Rôle** : joueur · **Intrigue** : jp.pepite.club_usine · **Étape** : 4/10 · **Moment** : saison 0, slot 17 (remplace le dernier virage) · **Lieu** : le bureau d'Aulard, trois fax alignés, Fardelli debout derrière ta chaise, ou personne · **Conditions** : —
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
**Rôle** : joueur · **Intrigue** : jp.pepite.club_usine · **Étape** : 5/10 · **Moment** : saison 1, [1,2] · **Lieu** : selon la variante · **Conditions** : —
Variante `flag('vendu_d1')` — **JOSIANE** *(secrétaire d'un autre club — neutre — elle n'est pas Madame Josiane ; c'est « la Josiane d'ici », le moteur garde le portrait, la bande dit « SECRÉTAIRE DEPUIS 1979 »)* : « Vous êtes le remplaçant du remplaçant, j'en ai vu passer, vous savez, des pépites d'usine ; le casier est au fond, celui sans nom. Vous voulez qu'on écrive le vôtre, ou vous attendez de jouer ? » — ← **Écrivez-le** — direction +, tribunes −, set: casier_nomme — *Elle l'écrit au feutre. Le feutre est presque sec ; c'est celui des remplaçants.* · → **J'attends de jouer** — vestiaire +, direction − — *Le casier reste sans nom. Au troisième match, un coéquipier y écrit « le nouveau » ; ça durera.*
Variante `flag('fidele')` — **AULARD** *(sourire — il te tend un contrat d'un an, une seule page)* : « Tu es resté, petit, alors on fait comme les grands : un an, une page, et le brassard si Bréhaut tombe. J'ai pas le temps, j'ai une usine : tu signes la page, ou tu veux lire la deuxième ? » — ← **Je signe la page** — direction ++, caisse + — *Il n'y a pas de deuxième page. Il y en aura une en juin.* · → **Je lis la deuxième** — direction −, caisse ++, set: page_lue — *La deuxième page dit « clause de vente ». Elle est à ton nom, pas au sien.*
Variante `flag('exil_dore')` — **NASSIR** *(sourire — un stade vide et climatisé, il te montre le banc)* : « Bienvenue, ce n'est pas un club, c'est un actif, et vous en êtes la ligne la plus chère. Vous voulez jouer dès samedi, ou vous reposer, c'est compris dans le contrat ? » — ← **Jouer samedi** — tribunes +, force +1 — *Tu joues devant trois mille personnes et cinquante caméras. La climatisation souffle sur la pelouse.* · → **Me reposer, c'est compris** — caisse +, force −2, tribunes − — *Tu te reposes. Le compte se remplit sans toi. Camille demande à quelle heure tu rentres ; tu ne sors pas.*
Secours — **VECCHIO** : « Nouvelle saison, même vestiaire, et moi j'ai un an de plus, j'en ai vu d'autres. Tu portes toujours les bouteilles, ou c'est fini ? » — ← **Je porte encore** — vestiaire ++ · → **C'est au nouveau** — vestiaire −, tribunes +.
**Traces** : casier_nomme, page_lue · **Réactions déclenchées** : co.re.vecchio_garde (∃) · **Lu plus tard par** : jp.clause (variante « la page deux »), set-piece `objective` joueur (ch. 30 : « le remplaçant du remplaçant »)

### SCÈNE jp.pepite.s1_retour_usine  —  Le retour à l'usine (twist)
**Rôle** : joueur · **Intrigue** : jp.pepite.club_usine · **Étape** : 6/10 · **Moment** : saison 1, [10,11] · **Lieu** : le couloir des vestiaires de l'usine, côté visiteurs, une bâche pliée dans un coin · **Conditions** : —
Variante `flag('vendu_d1')` — **GÉGÉ** *(capo — neutre ; noir si `vente_janvier` — il tient un bout de la bâche, l'ancienne, à ton nom)* : « La tribune n'oublie rien, et dimanche tu joues contre nous, avec ton nom encore sur la bâche, on ne l'a pas repeinte. Tu célèbres si tu marques, ou tu baisses la tête ? » — ← **Je baisse la tête** — tribunes ++, vestiaire −, set: tifo_adieu, relation.gege +1 — *Tu marques. Tu baisses la tête. La Tribune Nord applaudit un visiteur ; ça n'arrive qu'une fois.* · → **Je célèbre, c'est mon métier** — tribunes −−, vestiaire ++, relation.gege −2 — *Tu célèbres devant la Nord. La bâche descend pendant que tu cours. Elle est brûlée le soir, proprement.*
Variante `flag('fidele')` — **BRÉHAUT** *(capitaine — neutre — il a une liste de vente dans la main, tu es dessus)* : « Le groupe vit bien, et l'usine a besoin d'une vente, et cette année sur la liste il y a moi ou toi. Tu dis au président de me vendre, ou tu te tais ? » — ← **Vendez-moi plutôt lui** — direction +, vestiaire −−, relation.brehaut −2, set: brehaut_vendu_par_toi — *Bréhaut part en janvier. Le groupe l'apprend par le fax. Il t'en veut par le fax aussi.* · → **Je me tais** — vestiaire ++, direction −, set: fidele_deux — *Tu te tais. Il te serre l'épaule, un peu trop fort ; c'est sa façon de dire merci.*
Variante `flag('exil_dore')` — **CAMILLE** *(neutre — au téléphone, le décalage horaire dans la voix)* : « Tu rentres à quelle heure, enfin, tu rentres quel mois ? L'usine joue la Coupe dimanche, Léa a écrit que « l'enfant du pays regarde de loin ». Tu prends l'avion pour le match, ou tu regardes de loin ? » — ← **Je prends l'avion** — tribunes +, caisse −, relation.camille +1 — *Tu es en tribune. Gégé te voit ; il ne dit rien ; c'est déjà ça.* · → **Je regarde de loin** — caisse +, relation.camille −1 — *Tu regardes de loin. L'Écho met ta photo au bar de l'hôtel du désert ; c'est Léa qui l'a envoyée.*
**Traces** : tifo_adieu (« {annee} : {prenom} {nom} a marqué contre l'usine et a baissé la tête. La Nord a applaudi un visiteur. »), brehaut_vendu_par_toi, fidele_deux · **Réactions déclenchées** : co.re.gege_decoupe (∃) · **Lu plus tard par** : jp.retour_usine (variante), ch. 90 (mémoire de l'usine : +1 si `tifo_adieu`, −2 sinon), une.pepite.retour, ch. 01 (Bréhaut : « tu m'as fait vendre »)

### SCÈNE jp.pepite.s1_veille  —  La veille, la valeur
**Rôle** : joueur · **Intrigue** : jp.pepite.club_usine · **Étape** : 7/10 · **Moment** : saison 1, slot 17 · **Lieu** : la voiture de Fardelli (ou une cabine, si `sans_agent`) · **Conditions** : —
**FARDELLI** *(agent — neutre — la vitre entière baissée, cette fois ; il a un chiffre à dire)*
« Demain c'est le dernier bloc, et ta valeur ce soir tient sur un ticket : elle monte si tu joues, elle descend si tu te ménages. Mon ami, on parle d'argent ou d'amitié, alors tu fonces ? »
← **Je fonce** — effets : tribunes +, force +1, set: veille_fonce — *Il note « fonce » sur le ticket. Le ticket, c'est celui de Ménèche ; il l'a acheté.*
→ **Je me ménage** — effets : force −1, direction +, set: veille_menage — *Il note « prudent ». Il vend les prudents aussi ; à des clubs prudents.*
Variante `flag('sans_agent')` — **MÉNÈCHE** *(chroniqueur — neutre — au téléphone de la cabine, il t'a fait appeler)* : « Juste une question, hors micro : sans agent, votre valeur, c'est vous qui la fixez ou c'est le marché ? Demain, vous jouez pour vous, ou pour la cote ? » — mêmes libellés, mêmes effets.
**Traces** : veille_fonce, veille_menage (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : set-piece `gm_annonce` joueur (ch. 30 : variantes `veille_fonce` « ton agent a noté fonce » / `veille_menage` « prudent »)

### SCÈNE jp.pepite.s2_rentree  —  La valeur, encore (rejouable)
**Rôle** : joueur · **Intrigue** : jp.pepite.club_usine · **Étape** : 8/10 · **Moment** : saison 2+, [1,2] · **Lieu** : la voiture de Fardelli, un modèle plus récent chaque saison · **Conditions** : —
**FARDELLI** *(agent — sourire si relation ≥ 1 — il a une nouvelle voiture et le même sourire)*
« Tu vaux {prix} millions ce matin, et dans deux ans tu en vaudras la moitié ou le double, c'est ça le métier. Mon ami, on parle d'argent ou d'amitié : on vend cet été, ou on attend ? »
← **On vend cet été** — effets : caisse ++, tribunes −, set: vente_ete — *Il sort le carnet. Trois clubs, deux pays qu'on ne nomme pas.*
→ **On attend** — effets : tribunes +, direction +, force +1 — *Il range le carnet. Il ne le ferme pas complètement.*
Variante `plays() >= 2` : « Tu vaux {prix} millions, et tu me dis « on attend » depuis deux étés ; à force d'attendre, les clubs attendent aussi. Mon ami, on parle d'argent ou d'amitié : cette fois ? »
Variante `flag('sans_agent')` — **AULARD** : « Tu vaux {prix} millions ce matin, sans agent, c'est moi qui compte pour toi. J'ai pas le temps, j'ai une usine : on vend cet été ? » — mêmes sorties.
**Traces** : vente_ete · **Réactions déclenchées** : — · **Lu plus tard par** : set-piece `bilan_contrat` (ch. 30)

### SCÈNE jp.pepite.s2_veille  —  La veille (rejouable)
**Rôle** : joueur · **Intrigue** : jp.pepite.club_usine · **Étape** : 9/10 · **Moment** : saison 2+, slot 17 · **Lieu** : le vestiaire vide, Vecchio ou son suivant, une orange · **Conditions** : —
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
**Rôle** : joueur · **Intrigue** : jp.fin.dernier_contrat · **Étape** : 1/10 · **Moment** : saison 0, slot 1 · **Lieu** : le restaurant de Fardelli, une nappe, un contrat plié sous le cendrier · **Conditions** : —
**FARDELLI** *(agent — neutre — il coupe sa viande sans te regarder, puis il te regarde)*
« Personne ne prolonge un genou, {toi}, et le tien fait du bruit jusqu'ici. Mon ami, on parle d'argent ou d'amitié : moi, je te prolonge, pour dix pour cent de ce que je trouverai. »
← **Dix pour cent, trouve** — effets : direction +, caisse −, relation.fardelli +1, set: agent_fardelli — *Il commande un dessert pour deux. Il mange les deux.*
→ **Je trouve seul** — effets : direction −, vestiaire +, relation.fardelli −1, set: sans_agent — *Il replie le contrat sous le cendrier. « Tu as trente et un ans », dit-il ; il ne dit pas la suite.*
Variante `fil_rouge == 'genou'` : « Personne ne prolonge un genou, et le Doc a la radio dans son tiroir ; mon ami, on parle d'argent ou d'amitié, alors je te dis que j'ai demandé la radio. » (pose aussi `radio_demandee`) · Variante `fil_rouge == 'agent'` : « Personne ne prolonge un genou, sauf moi, pour dix pour cent, et je connais trois clubs qui ne regardent pas les genoux. Mon ami, on parle d'argent ou d'amitié : signe. » · Variante `fil_rouge == 'vestiaire'` : « Personne ne prolonge un genou, mais un vestiaire prolonge un capitaine, et Bréhaut a le même genou que toi. Mon ami, on parle d'argent ou d'amitié : lequel des deux je vends ? »
**Traces** : agent_fardelli, sans_agent, radio_demandee · **Réactions déclenchées** : jp.re.camille_projet (§ 7) · **Lu plus tard par** : jp.fin.f2_offre, jp.genou_parle (variante « ton agent a demandé la radio »), jp.contrat_image, jp.clause

### SCÈNE jp.fin.f2_offre  —  L'offre d'hiver
**Rôle** : joueur · **Intrigue** : jp.fin.dernier_contrat · **Étape** : 2/10 · **Moment** : saison 0, [10,11] · **Lieu** : selon la variante · **Conditions** : —
Variante `flag('exil_propose') || vars.nassir_palier >= 1` — **NASSIR** *(neutre — un dossier avec une photo de stade climatisé)* : « Ce n'est pas un club, c'est un actif, et un joueur de trente et un ans avec un nom vaut plus chez nous que chez vous. Deux ans au chaud, ou six mois ici pour finir ? » — ← **Deux ans au chaud** — caisse +++, tribunes −−, set: exil_dore, club: {change: true, division: 0} — *Tu signes. Le genou aime la chaleur ; le reste, moins.* · → **Six mois ici** — tribunes ++, caisse −, relation.nassir −1 — *Il referme le dossier. « Je reviendrai », dit-il ; il revient toujours.*
Variante `flag('maison_pays')` (jp.maison_pays) — **CAMILLE** *(sourire — une carte routière, un cercle au feutre autour de ta ville natale)* : « Tu rentres à quelle heure, et surtout tu rentres où : le club de D2 de chez toi a appelé, ils veulent un nom pour la montée. On rentre, ou on finit ici ? » — ← **On rentre** — tribunes +, caisse −, relation.camille +2, set: maison_pays_signee, club: {change: true, division: 2} — *Tu signes en D2, chez toi. Ta mère fait construire ; elle n'a pas attendu.* · → **On finit ici** — direction +, relation.camille −1 — *Elle replie la carte. Le cercle reste visible à travers.*
Secours — **AULARD** *(neutre — un contrat d'une page, un chiffre plus petit que l'ancien)* : « Un an de plus, au rabais, avec une clause sur le genou : tu joues quinze matchs ou le contrat s'arrête. J'ai pas le temps, j'ai un empire : tu signes le rabais, ou tu attends juin ? » — ← **Je signe le rabais** — direction ++, caisse −, set: prolonge_rabais — *Tu signes. Le chiffre est petit ; la clause est grande.* · → **J'attends juin** — direction −−, tribunes +, set: attend_juin — *Il range la page. En juin, il en aura une autre, ou pas.*
Variante `flag('petition_portee')` (jp.vestiaire_porte) : Aulard ajoute « et une pétition de vingt-deux noms, reçue par fax, que je n'ai pas eu le temps de lire » ; la gauche donne direction + et vestiaire ++ à la place.
**Traces** : exil_dore, maison_pays_signee, prolonge_rabais, attend_juin · **Réactions déclenchées** : co.re.nassir_reviendrai (∃, après le refus) · **Lu plus tard par** : jp.fin.f3_juin, une.fin.rabais, ch. 30 (fin jp_exil), ch. 01 (Camille +3 « ici »)

### SCÈNE jp.fin.f2b_quinzieme  —  La quinzième
**Rôle** : joueur · **Intrigue** : jp.fin.dernier_contrat · **Étape** : 3/10 · **Moment** : saison 0, slot 16 (le dernier match de championnat, avant F3) · **Lieu** : la salle de soins, un calendrier de la saison punaisé, des croix, Sabatier qui les compte avec le capuchon du stylo · **Conditions** : —
**SABATIER** *(médecin — neutre — il compte les croix deux fois, il trouve le même chiffre)*
« Quatorze matchs joués, et dimanche c'est le dernier, ça reste entre la table et moi : le genou a tenu quatorze fois. Tu tentes la quinzième, ou tu finis en tribune avec une radio propre ? »
← **La quinzième** — effets : tribunes ++, force −1, rand: [{p: 0.2, set: genou_grave}, {}], set: quinzieme_jouee — *Tu joues. Le genou tient, ou dit ce qu'il avait à dire. Aulard compte aussi, depuis la loge ; il compte autre chose.*
→ **En tribune, radio propre** — effets : direction +, tribunes −, force +1, set: quinzieme_tribune — *Tu regardes. Vukić s'assoit à côté de toi, la feuille de match sur les genoux ; il te pose une question sur le milieu.*
Variante `flag('prolonge_rabais')` : « Quatorze matchs, et la clause du président dit quinze, ça reste entre la table et moi mais il a le calendrier aussi. Tu joues la quinzième pour la clause, ou tu la laisses tomber ? » — ← **Pour la clause** — direction +, tribunes +, rand: [{p: 0.25, set: genou_grave}, {}], set: quinzieme_jouee — *Tu joues. La clause est cochée ; Josiane la coche elle-même, au crayon.* · → **Je la laisse tomber** — caisse −−, direction −, force +1, set: quinzieme_tribune, clear: prolonge_rabais — *Tu ne joues pas. Le contrat s'arrête à la case quatorze. Aulard n'a pas le temps de le regretter.*
Variante `fil_rouge == 'vestiaire'` — **BRÉHAUT** *(capitaine — neutre — il a le même calendrier, avec plus de croix)* : « Le groupe vit bien, et le groupe a un match de plus que toi dans les jambes ; dimanche tu joues avec nous, ou tu regardes avec le Doc ? » — mêmes sorties.
Variante `flag('petition_portee')` : Sabatier ajoute « et vingt-deux noms m'ont demandé de te laisser jouer ; je ne compte pas les noms, je compte les croix » ; sans effet.
**Traces** : quinzieme_jouee, quinzieme_tribune (sans Almanach ; drapeaux de script) · **Réactions déclenchées** : jp.re.vukic_feuille (§ 7) · **Lu plus tard par** : jp.fin.f3_juin (variante `prolonge_rabais` : la clause cochée ou non), objectif `fin_saison_entiere`, set-piece `gm_annonce` joueur (ch. 30 : « quatorze croix »), ch. 11 (Vukić : « tu regardais déjà la feuille de match en tribune »), ch. 30 (Carrefour : `quinzieme_tribune` facilite la transition entraîneur)

### SCÈNE jp.fin.f3_juin  —  Juin
**Rôle** : joueur · **Intrigue** : jp.fin.dernier_contrat · **Étape** : 4/10 · **Moment** : saison 0, slot 17 · **Lieu** : le bureau d'Aulard, le contrat, ou son absence, et Vukić dans le couloir · **Conditions** : —
**AULARD** *(président — neutre — un stylo, ou pas de stylo)*
« Juin, {toi}, et ton genou a fait la saison, ou presque. J'ai pas le temps, j'ai un empire : un an de plus ici, ou tu prends l'offre d'ailleurs, ou tu prends le banc de la réserve que Vukić te garde ? »
← **Un an de plus, ici** — effets : direction +, tribunes +, caisse −, set: prolonge, outcome: prolonge — *Tu signes. Sabatier signe le certificat en dessous, sans lire le montant.*
→ **L'offre d'ailleurs** — effets : caisse ++, tribunes −−, club: {change: true}, set: parti_juin, outcome: parti — *Tu pars. Le vestiaire t'offre une aile de poulet et une lettre ; la lettre est courte.*
Variante `flag('prolonge_rabais')` : un bouton — **C'était signé en janvier** — set: prolonge — *La clause des quinze matchs est cochée (`quinzieme_jouee`), ou pas ; Josiane le sait, elle ne dit rien.*
Variante `flag('petition_portee') && gauges.vestiaire >= 60` : « Juin, et une pétition de vingt-deux noms que j'ai fini par lire ; j'ai pas le temps, j'ai un empire, mais un vestiaire qui écrit, ça se prolonge. Un an ? » — ← **Un an, pour eux** — vestiaire ++, direction +, set: prolonge, set: prolonge_vestiaire — *Bréhaut a signé en premier. Il le fait remarquer.* · → **Je pars quand même** — vestiaire −−, caisse ++, club: {change: true}, set: parti_juin — *La pétition reste sur le bureau. Aulard s'en sert de sous-main.*
Variante `!flag('prolonge') && !flag('exil_dore') && !flag('maison_pays_signee') && gauges.direction < 40` (aucune offre) — **FARDELLI** *(noir — au téléphone, il parle vite)* : « Aucune offre, mon ami, aucune, et on parle d'argent ou d'amitié, mais là il n'y a ni l'un ni l'autre. Tu attends août sans club, ou tu prends le banc de la réserve ? » — ← **J'attends août** — caisse −−, tribunes −, set: sans_club — *Août arrive. Le téléphone ne sonne pas. Camille l'a débranché, pour voir ; personne n'a remarqué.* · → **Le banc de la réserve** — direction +, set: banc_reserve, set: vers_entraineur — *Vukić te tend un survêtement. Il est à ta taille ; il l'avait pris exprès.*
Variante `flag('diplome')` (jp.diplome_joueur) : troisième chemin, le Carrefour lit `diplome` et propose la transition ; la scène ajoute « le papier est dans le dossier, Vukić l'a mis dessus » ; aucune sortie supplémentaire ici (le set-piece `bilan_carrefour` fait le reste).
**Traces** : prolonge (« {annee} : un an de plus pour {prenom} {nom}. Le genou n'a pas signé, il a laissé faire. »), parti_juin, prolonge_vestiaire, sans_club (« {annee} : {prenom} {nom}, trente-deux ans, sans club. Le téléphone était débranché. »), banc_reserve, vers_entraineur · **Réactions déclenchées** : jp.re.vecchio_encore_une (§ 7) · **Lu plus tard par** : jp.fin.s1_premier_jour, une.fin.un_an_de_plus, une.fin.sans_club, une.fin.vestiaire, objectif `fin_debout`, alarme caisse basse, ch. 30 (Carrefour : transition entraîneur ; fin jp_sansclub), ch. 11 (Vukić : « je t'avais gardé le banc »)

### SCÈNE jp.fin.s1_premier_jour  —  Le premier jour (destination)
**Rôle** : joueur · **Intrigue** : jp.fin.dernier_contrat · **Étape** : 5/10 · **Moment** : saison 1, [1,2] · **Lieu** : selon la variante · **Conditions** : —
Variante `flag('prolonge')` — **BRÉHAUT** *(capitaine — sourire — il a le même genou que toi et un an de plus)* : « Le groupe vit bien, et on est deux de trente-deux ans avec un genou chacun, ça fait un joueur et demi. On se partage les matchs, ou on se dispute le brassard ? » — ← **On se partage** — vestiaire ++, force −1, relation.brehaut +1, set: partage_brehaut — *Vous jouez un match sur deux. Le coach compte ; vous, non.* · → **On se dispute** — tribunes +, vestiaire −, relation.brehaut −1 — *Vous jouez tous les deux, tous les matchs. En mars, il n'en reste qu'un ; ce n'est pas forcément toi.*
Variante `flag('parti_juin')` — **JOSIANE** *(la Josiane d'ici, un autre club — neutre — le classeur ouvert à ta page, la page est mince)* : « Vous êtes le nom qu'on a pris pour le vestiaire, j'en ai vu passer, vous savez, des noms ; on ne vous a pas pris pour vos jambes. Vous voulez le casier près du coach, ou près des jeunes ? » — ← **Près des jeunes** — vestiaire ++, direction − — *Les jeunes t'appellent « papy » le premier jour, puis par ton prénom.* · → **Près du coach** — direction ++, vestiaire − — *Le coach t'appelle « mon relais ». Les jeunes t'appellent « le relais ». Ce n'est pas la même chose.*
Variante `flag('sans_club')` — **CAMILLE** *(noir si relation ≤ −1 — la table de la cuisine, un journal ouvert aux offres d'emploi, pas celles du foot)* : « Tu rentres à quelle heure ? Tu es là depuis août, alors je demande autrement : tu prends le poste de Vukić à la réserve, ou tu attends encore ? » — ← **Le poste de Vukić** — direction +, caisse +, set: vers_entraineur, relation.camille +1 — *Tu appelles Vukić. Il répond à la première sonnerie ; il attendait.* · → **J'attends encore** — caisse −−, relation.camille −2, tribunes − — *Tu attends. En janvier, un club de National appelle. Il paie en merguez.*
Secours — **VUKIĆ** : « Nouvelle saison, et je te le dis parce que personne ne te le dira : cette année tu joues moins, et ce n'est pas une punition. Tu l'acceptes, ou tu vas voir le coach ? » — ← **J'accepte** — vestiaire +, relation.vukic +1 · → **Je vais le voir** — direction −, tribunes +.
**Traces** : partage_brehaut, vers_entraineur · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 30 (Carrefour), ch. 01 (Bréhaut : « un joueur et demi »)

### SCÈNE jp.fin.s1_jambes  —  Les jambes (twist)
**Rôle** : joueur · **Intrigue** : jp.fin.dernier_contrat · **Étape** : 6/10 · **Moment** : saison 1, [10,11] · **Lieu** : la salle de soins, Sabatier avec un chronomètre, Rouvier avec un autre · **Conditions** : —
**SABATIER** *(médecin — neutre — il compare les deux chronomètres, ils ne disent pas pareil)*
« Tes jambes ont perdu trois pas cette année, c'est mesuré, et ça reste entre la table et moi. Tu changes de poste et tu recules, ou tu cours après les trois pas ? »
← **Je recule d'un cran** — effets : force +2, tribunes −, vestiaire +, set: recule_poste — *Tu joues plus bas. Tu vois le jeu de derrière ; Vukić dit que c'est de là qu'on voit tout.*
→ **Je cours après** — effets : tribunes +, force −4, rand: [{p: 0.3, set: genou_grave, tribunes −−}, {}] — *Tu cours. Trois pas, ça ne se rattrape pas ; ça se paie, en mars, ou en mai.*
Variante `vars.gigi_conseils >= 1` (jp.conseils_gigi) — **ROUVIER** *(kiné — neutre — elle range le chronomètre de Sabatier dans sa poche à lui)* : « Respire. Encore. Gigi t'a dit que le genou avait toujours raison ; les jambes aussi, elles ont perdu trois pas. Tu recules, ou tu cours après ? » — mêmes sorties, la droite n'a plus de `rand` (elle t'a fait respirer).
**Traces** : recule_poste (« {annee} : {prenom} {nom} a reculé d'un cran. De là, on voit tout. »), genou_grave · **Réactions déclenchées** : jp.re.rouvier_respire (§ 7) · **Lu plus tard par** : ch. 30 (Carrefour : « tu vois le jeu de derrière » → transition entraîneur facilitée), fin *Les croisés* (variante), objectif `fin_saison_entiere`, une.fin.dernier_mot

### SCÈNE jp.fin.s1_veille  —  La veille, le papier
**Rôle** : joueur · **Intrigue** : jp.fin.dernier_contrat · **Étape** : 7/10 · **Moment** : saison 1, slot 17 · **Lieu** : le couloir, Vukić, un formulaire de la Fédération ou un cahier · **Conditions** : —
**VUKIĆ** *(entraîneur adjoint — neutre — le cahier ouvert à une page vide, avec ton nom en haut)*
« Dernier bloc demain, et je te le dis parce que personne ne te le dira : le banc de la réserve est libre en juin, ton nom est en haut de la page. Tu joues demain, ou tu regardes déjà le banc ? »
← **Comme un joueur** — effets : tribunes +, force +1, relation.vukic +1 — *Il referme le cahier. Il ne raye pas ton nom.*
→ **Je regarde déjà le banc** — effets : direction +, tribunes −, set: banc_regarde, relation.vukic +1 — *Il te donne le cahier. Il en a un autre ; il en a toujours un autre.*
Variante `flag('vukic_dauphin')` (ch. 11 : Vukić a pris un banc ailleurs) — le locuteur devient **VUKIĆ, au téléphone, d'un autre club** : « Je te le dis parce que personne ne te le dira : j'ai un banc ici, et un poste d'adjoint, à ton nom. Tu joues demain, ou tu viens ? » — ← **Je joue demain** — tribunes + — *Il dit « dimanche prochain, alors ».* · → **Je viens** — direction +, set: vers_entraineur, set: suit_vukic — *Tu prends le train le lundi. Le cahier est dans le sac.*
**Traces** : banc_regarde, suit_vukic · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 30 (Carrefour : `if: flag('banc_regarde')`), ch. 11 (`interimaire` : « tu es l'adjoint de Vukić », si `suit_vukic`), objectif `fin_passeur`

### SCÈNE jp.fin.s2_saison_de_plus  —  Une saison de plus (rejouable)
**Rôle** : joueur · **Intrigue** : jp.fin.dernier_contrat · **Étape** : 8/10 · **Moment** : saison 2+, [1,2] · **Lieu** : le vestiaire, Vecchio ou son suivant, deux paires de chaussettes · **Conditions** : —
**VECCHIO** *(gardien, 41 ans puis plus — neutre — il montre une chaussette trouée comme une preuve)*
« Une saison de plus, petit, moi j'en suis à ma quatrième retraite et je suis encore là. J'en ai vu d'autres : tu la joues pour toi, ou tu la joues pour montrer aux jeunes ? »
← **Pour moi** — effets : tribunes +, force −1 — *Il hoche la tête. Il en a vu d'autres, des égoïstes ; il les aimait bien.*
→ **Pour montrer aux jeunes** — effets : vestiaire ++, tribunes −, relation.mbako +1 — *Mbako te regarde t'échauffer. Il copie. Il fait mieux ; c'est le but.*
Variante `plays() >= 2` : « Une saison de plus, encore, et cette fois j'ai les gants sous le bras, pas aux mains ; j'en ai vu d'autres, mais pas beaucoup. Pour toi, ou pour eux ? »
Variante `chars.vecchio.statut == 'retraite' && flag('gigi_staff')` : Vecchio parle en survêtement d'entraîneur des gardiens ; même réplique, « les gants sous le bras » en didascalie.
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : —

### SCÈNE jp.fin.s2_veille  —  La veille, Camille (rejouable)
**Rôle** : joueur · **Intrigue** : jp.fin.dernier_contrat · **Étape** : 9/10 · **Moment** : saison 2+, slot 17 · **Lieu** : la maison, le canapé, un match à la télé, pas le tien · **Conditions** : `!flag('divorce')` ; sinon variante Josiane
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

Chaque script suit la grille : quatre ancres en S0 (slot 1, [10-11], 16, 17), trois en S1 ([1-2], [10-11], 17), deux rejouables en S2+ ([1-2], 17) : neuf scènes par script, au gabarit § 4.1, comme aux § 3-4. Le réservoir est celui du § 6 (le pool par postulat est donné dans chaque fiche).

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
« Vingt titularisations au contrat, mon ami, on en est à {titularisations}, il reste deux matchs ; on parle d'argent ou d'amitié, la prime est dans les deux. Tu demandes au coach, ou tu laisses ? »
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

### SCÈNE jp.croises.s1_premier_jour  —  Titulaire ou doublure
**Rôle** : joueur · **Intrigue** : jp.croises.retour · **Étape** : 5/9 · **Moment** : saison 1, [1,2] · **Lieu** : le couloir, la feuille de la première journée, deux noms au même poste, une punaise · **Conditions** : —
**VUKIĆ** *(entraîneur — neutre — il tient la feuille et la punaise, il n'a pas encore choisi lequel des deux noms il entoure)*
« Je te le dis parce que personne ne te le dira : le genou a un an de plus, toi aussi, et le petit a un an de moins dans ma tête. Titulaire, ou doublure de Mbako ? »
← **Titulaire, et je le prouve** — effets : tribunes +, force −1, direction −, set: titulaire_reclame — *Il t'entoure. Tu joues bien. Il note « prouvé » dans le cahier, puis il efface ; il n'aime pas ce mot.*
→ **Doublure, pour l'instant** — effets : direction +, vestiaire +, force +1, relation.vukic +1, set: doublure_acceptee — *Tu entres à l'heure. Le petit te tape dans la main en sortant ; il l'a appris de toi.*
Variante `flag('reprise_tot')` : « Je te le dis parce que personne ne te le dira : tu avais repris tôt, et le genou s'en souvient mieux que toi. Titulaire, ou doublure ? » — mêmes sorties, la gauche a force −2. · Variante `flag('reprise_tard')` : un bouton — **Titulaire, tu l'as dit** — tribunes +, relation.vukic +1 — *Il t'entoure sans demander. Trois semaines de plus, c'étaient les bonnes.*
**Traces** : titulaire_reclame, doublure_acceptee (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : jp.croises.s2_rentree (variante), fin jp_pouce (epitaph_plus), ch. 01 (Vukić : « tu avais accepté la doublure »)

### SCÈNE jp.croises.s1_twist  —  La rechute des autres (twist)
**Rôle** : joueur · **Intrigue** : jp.croises.retour · **Étape** : 6/9 · **Moment** : saison 1, [10,11] · **Lieu** : la salle de kiné, Mbako assis sur la table de Rouvier, une poche de glace sur le genou, la première de sa vie · **Conditions** : `chars.mbako.statut == 'club'`
**MBAKO** *(star des Cobalts, 24 ans — neutre — il regarde la glace comme un objet étranger)*
« Je veux jouer, maintenant, c'est ce que je dis au Doc, et le Doc dit six mois ; toi tu es passé par là. Tu me dis tout, ou tu me dis ce qu'on t'a dit ? »
← **Je te dis tout** — effets : vestiaire ++, relation.mbako +2, set: genou_petit_dit — *Tu lui dis les nuits, l'escalier, le plateau de droite. Il écoute ; il n'écoute jamais. Sa mère, dehors, non plus.*
→ **Le genou a toujours raison** — effets : vestiaire +, relation.mbako +1, relation.vecchio +1 — *Tu lui donnes la phrase de Gigi. Il la répète sans comprendre ; il comprendra en mars, sur la table.*
**Traces** : genou_petit_dit (« {annee} : {prenom} {nom} a expliqué le genou à Lian Mbako. Tout, y compris l'escalier. ») · **Réactions déclenchées** : co.re.mere_mbako_souffle (ch. 01) · **Lu plus tard par** : ch. 01 (`en.mbako.revient` : « tu m'avais dit »), ch. 14 (Mbako sélectionneur du Kambara, 2026 : « vous m'aviez expliqué la glace »), ch. 90 (Mbako à +3 dans la lignée)

### SCÈNE jp.croises.s1_veille  —  Sept heures
**Rôle** : joueur · **Intrigue** : jp.croises.retour · **Étape** : 7/9 · **Moment** : saison 1, slot 17 · **Lieu** : la salle de rééducation, le vélo, Rouvier qui range son chronomètre · **Conditions** : —
**ROUVIER** *(kiné — sourire si relation ≥ 1 — elle range le chronomètre dans sa poche, c'est le sien, elle a rendu celui du Doc)*
« Respire. Encore. Un an que je compte tes flexions, et demain, dernier bloc, je ne compte pas ; tu viens quand même à sept heures, ou tu dors ? »
← **À sept heures** — effets : force +1, relation.rouvier +1, set: rituel_rouvier — *Tu viens. Elle ne compte pas ; elle regarde. C'est pire, et c'est mieux.*
→ **Je dors, pour une fois** — effets : vestiaire +, relation.rouvier −1 — *Tu dors. Elle vient quand même à sept heures ; elle a un autre genou, celui du petit.*
**Traces** : rituel_rouvier (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 01 (Rouvier, retrouvailles sourire : « tu venais à sept heures »), ch. 14 (kiné des Cobalts : « respire, tu sais faire »)

### SCÈNE jp.croises.s2_rentree  —  Le carnet, page neuve (rejouable)
**Rôle** : joueur · **Intrigue** : jp.croises.retour · **Étape** : 8/9 · **Moment** : saison 2+, [1,2] · **Lieu** : la voiture de Fardelli, le carnet à bâtons ouvert sur une page vide · **Conditions** : —
**FARDELLI** *(agent — neutre — il lisse la page neuve du plat de la main)*
« Nouveau contrat, nouvelle page, mon ami, on parle d'argent ou d'amitié : cette année la prime c'est quinze titularisations, j'ai négocié à la baisse pour toi. Tu me remercies, ou tu demandes vingt ? »
← **Merci, quinze** — effets : direction +, caisse −, relation.fardelli +1 — *Il dessine le premier bâton avant le premier match ; « par confiance », dit-il.*
→ **Vingt, comme avant** — effets : caisse +, direction −, force −1, set: vingt_redemande — *Il raye quinze. Il écrit vingt. Il ne sourit pas ; il compte.*
Variante `plays() >= 2` : « Troisième page, mon ami, et le genou a trois ans de plus ; on parle d'argent ou d'amitié, alors on descend à dix, ou tu tiens à quinze ? » — mêmes sorties. · Variante `flag('doublure_acceptee')` : Fardelli ajoute « et l'an dernier tu as accepté la doublure, je l'ai noté en bas de page, ça ne facture rien ».
**Traces** : vingt_redemande (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : fin jp_pouce (epitaph_plus « tu avais redemandé vingt »), objectif `croises_vingt`, set-piece `bilan_verdict` (ch. 30 : « le compte de l'agent »)

### SCÈNE jp.croises.s2_veille  —  La photo à l'endroit (rejouable)
**Rôle** : joueur · **Intrigue** : jp.croises.retour · **Étape** : 9/9 · **Moment** : saison 2+, slot 17 · **Lieu** : le local, la photo du derby repunaisée à l'endroit : toi debout, à la fin · **Conditions** : —
**GÉGÉ** *(capo — sourire — il tapote la photo du doigt, il ne la décroche plus)*
« La tribune n'oublie rien, mais elle a changé la photo : celle-là c'est toi debout, à la fin du derby de l'an dernier. Demain tu joues pour en faire une autre, ou celle-là suffit ? »
← **Une autre** — effets : tribunes ++, force −1, rand: [{p: 0.1, set: genou_grave}, {}] — *Tu joues comme avant la photo. Il en prend une ; elle est floue ; il la punaise quand même.*
→ **Celle-là suffit** — effets : tribunes +, vestiaire +, force +1 — *Tu joues avec. Il garde la photo. Il n'en prend pas d'autre ; il n'en a pas besoin.*
Variante `plays() >= 2` : « … elle a deux photos maintenant, une par saison, et le mur du local est petit ; demain tu en fais une troisième, ou on garde de la place ? »
**Traces** : — · **Réactions déclenchées** : co.re.gege_decoupe (∃) · **Lu plus tard par** : ch. 90 (mémoire du club : « la photo debout »), co.retrouvailles.gege (ch. 90)

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
« Je veux jouer, maintenant, je le disais à seize ans, et j'ai choisi les Cobalts parce qu'on m'a appelé le premier ; le Kambara m'appelle encore. Tu choisis pour le maillot, ou pour la mère ? »
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

### SCÈNE jp.binational.s1_premier_jour  —  Tu chantes lequel
**Rôle** : joueur · **Intrigue** : jp.binational.deux_hymnes · **Étape** : 5/9 · **Moment** : saison 1, [1,2] · **Lieu** : le local, une télé sur une caisse, la rediffusion de ton match en sélection, le son coupé · **Conditions** : —
**GÉGÉ** *(capo — neutre ; noir si `binational_choisi == 'kambara'` — il remet le son au moment de l'hymne, puis le coupe)*
« La tribune n'oublie rien, et elle t'a vu à la télé avec un maillot, elle n'est plus sûre lequel ; elle voudrait t'entendre. Samedi, à l'échauffement, tu chantes lequel ? »
← **Celui du club, toujours** — effets : tribunes ++, relation.gege +1, set: chant_club — *Tu chantes le chant du virage. Faux. Gégé dit que c'est le bon faux.*
→ **Je ne chante pas, je joue** — effets : vestiaire +, tribunes −, set: chant_refuse — *Tu ne chantes pas. Le virage chante pour deux ; il le fait remarquer, en rythme.*
Variante `binational_choisi == 'kambara'` : « La tribune n'oublie rien, et elle t'a vu chanter l'autre hymne, la main sur le cœur ; ici, samedi, tu mets la main où ? » — ← **Sur le blason** — tribunes ++, set: chant_club — *Tu la mets. Le virage se tait, puis chante ; il a décidé.* · → **Sur rien, je joue** — tribunes −−, vestiaire +, set: chant_refuse — *Tu joues les bras le long du corps. On te siffle à la première touche ; à la dixième, on a oublié.*
**Traces** : chant_club, chant_refuse (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : alarme `jp.binational.alarme_gege_maillot` (variante « tu ne chantes rien »), ch. 14 (l'hymne : `hymne_impose`), jp.te.hymne

### SCÈNE jp.binational.s1_twist  —  Le match entre les deux (twist)
**Rôle** : joueur · **Intrigue** : jp.binational.deux_hymnes · **Étape** : 6/9 · **Moment** : saison 1, [10,11] (la semaine de l'amical Cobalts-Kambara) · **Lieu** : le hall de l'hôtel, un homme en costume trop chaud pour la saison, un verre de thé qu'il ne boit pas · **Conditions** : `flag('binational_choisi')`
**UN ÉMISSAIRE DU KAMBARA** *(voix sans portrait — il parle doucement, il a répété)*
« Samedi, les Cobalts jouent le Kambara, et vous êtes d'un côté, celui de la Fédération d'ici ; par respect pour l'autre, vous pourriez vous sentir blessé. Vous jouez, ou vous vous sentez blessé ? »
← **Je joue** — effets : tribunes ++, direction +, set: joue_contre_kambara — *Tu joues. Ta mère ne regarde pas le match ; elle regarde le mur, à côté de la télé.*
→ **Je me déclare blessé** — effets : tribunes −−, vestiaire −, relation.camille +1, set: blesse_par_respect — *Sabatier signe un certificat sans te regarder. Il dit que ça reste entre la table et lui ; c'est la deuxième fois ce mois-ci.*
Variante `binational_choisi == 'kambara'` — **LEGRUET** *(président de la Fédération — noir — au téléphone, une voix de Congrès)* : « Cher ami, on verra ça après le Congrès, mais samedi vous jouez contre nous, et un forfait vous éviterait des sifflets chez vous. Vous jouez, ou vous êtes blessé ? » — ← **Je joue** — tribunes +, direction −, set: joue_contre_cobalts — *Tu joues contre les Cobalts. Le stade siffle ton nom ; il le connaît bien.* · → **Je suis blessé, monsieur** — direction +, tribunes −, set: blesse_par_respect — *Tu ne joues pas. Legruet dit « merci » ; il ne dit jamais merci.*
**Traces** : blesse_par_respect (« {annee} : {prenom} {nom} s'est senti blessé le jour du match entre ses deux pays. Par respect. »), joue_contre_kambara, joue_contre_cobalts · **Réactions déclenchées** : jp.re.sabatier_deuxieme_certificat (§ 7, après →) · **Lu plus tard par** : ch. 14 (`binational_bloque` : « vous vous étiez senti blessé »), ch. 01 (Sabatier : la table encombrée), ch. 20 (« BLESSÉ PAR RESPECT »), jp.te.hymne

### SCÈNE jp.binational.s1_veille  —  La phrase
**Rôle** : joueur · **Intrigue** : jp.binational.deux_hymnes · **Étape** : 7/9 · **Moment** : saison 1, slot 17 · **Lieu** : le bureau de presse, la photocopie d'un article de Télé-Stade, ta phrase de la zone mixte surlignée · **Conditions** : —
**LÉA** *(attachée de presse — neutre — elle a surligné la phrase, pas le titre)*
« Vous confirmez ? Votre phrase de la zone mixte, tout le monde l'a réécrite, et demain c'est le dernier bloc. Vous la répétez si on vous la demande, ou vous en avez une autre ? »
← **Je la répète** — effets : parole +1, tribunes + — *Tu la répètes. Elle devient un titre ; le tien ; on te la ressortira à ton jubilé.*
→ **J'en ai une autre** — effets : tribunes ++, direction −, relation.lea +1, set: phrase_nouvelle — *Tu en dis une autre. Elle est meilleure. Vence est furieuse de ne pas l'avoir eue en direct.*
Variante `flag('mot_pour_mere')` : « Vous confirmez ? Le prénom de votre mère, à la télé, tout le pays le connaît maintenant ; elle a répondu à L'Écho, elle. Vous lisez sa réponse avant le match, ou après ? » — ← **Avant** — tribunes +, relation.camille +1 — *Tu lis. Elle a dit « il est bien, mon fils ». Tu joues avec ça.* · → **Après** — force +1, tribunes − — *Tu lis après. Elle a dit la même chose ; c'est plus lourd après.*
**Traces** : phrase_nouvelle (sans Almanach) · **Réactions déclenchées** : co.re.lea_confirme (∃) · **Lu plus tard par** : ch. 20 (Télé-Stade : la phrase du binational), jp.jubile (variante « on te ressort ta phrase »)

### SCÈNE jp.binational.s2_rentree  —  Ils demandent encore (rejouable)
**Rôle** : joueur · **Intrigue** : jp.binational.deux_hymnes · **Étape** : 8/9 · **Moment** : saison 2+, [1,2] · **Lieu** : un bureau de la Fédération, Brissac, une liste en deux colonnes · **Conditions** : —
**BRISSAC** *(DTN — neutre — elle a la lettre de l'autre fédération sous la liste, elle ne la cache pas)*
« Les chiffres sont têtus, les joueurs aussi : vous avez un maillot choisi, et l'autre fédération demande encore si vous avez changé d'avis. Je leur réponds quoi, cette année ? »
← **Non, c'est choisi** — effets : direction +, tribunes +, parole +1 — *Elle écrit « définitif ». Elle l'avait déjà écrit l'an dernier ; elle repasse dessus.*
→ **Qu'ils attendent** — effets : direction −, vestiaire +, set: autre_pays_attend — *Elle n'écrit rien. L'autre fédération envoie un maillot ; il est à ta taille, ils ont demandé.*
Variante `plays() >= 2` : « Les chiffres sont têtus, les joueurs aussi, et c'est la troisième année qu'ils demandent, ils sont têtus aussi. Je réponds quoi ? » — mêmes sorties.
**Traces** : autre_pays_attend (« {annee} : l'autre fédération a redemandé. {prenom} {nom} a laissé attendre. ») · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 14 (l'appel du pays à 40 ans : « vous nous aviez laissé attendre »), ch. 15 (les fédérations se disputent), § 10.8

### SCÈNE jp.binational.s2_veille  —  Le maillot de l'année (rejouable)
**Rôle** : joueur · **Intrigue** : jp.binational.deux_hymnes · **Étape** : 9/9 · **Moment** : saison 2+, slot 17 · **Lieu** : ta chambre, un colis, un maillot plié avec l'année brodée, le téléphone du pays · **Conditions** : —
**TA MÈRE** *(voix sans portrait — le téléphone du pays, le quartier derrière, moins d'enfants qu'avant)*
« Le quartier a signé un autre maillot, avec l'année, ils font ça tous les ans maintenant ; demain c'est le dernier match. Tu le mets sous l'autre, comme la première fois, ou tu as grandi ? »
← **Sous l'autre** — effets : vestiaire +, tribunes −, force +1, set: maillot_dessous — *Tu joues avec deux maillots. Le stade le sait ; il ne siffle plus ; il compte les années.*
→ **J'ai grandi, maman** — effets : direction +, relation.camille +1 — *Tu joues avec un maillot. Elle dit « bien ». Elle envoie le maillot quand même ; Camille le range avec les autres, dans l'ordre.*
Variante `plays() >= 2` : « … ils ont signé trois maillots, ton armoire est pleine, Camille me l'a dit ; celui-là, tu le mets, ou tu me le rends ? »
**Traces** : maillot_dessous · **Réactions déclenchées** : — · **Lu plus tard par** : objectif `binational_mere`, ch. 14 (l'hymne), ch. 20 (« DEUX MAILLOTS, UN JOUEUR »)

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
« Donne-moi le ballon, je m'occupe du reste, je disais ça à vingt ans ; ici, personne ne donne le ballon, on donne le chèque. Demain, dernier match : on joue pour la vidéo, ou pour le gars à côté ? »
← **Pour la vidéo** — effets : tribunes +, force +1, vestiaire −, set: video_europe — *Tu joues pour la caméra. Dembo aussi. Vous perdez ; la vidéo est bonne.*
→ **Pour le gars à côté** — effets : vestiaire ++, relation.dembo +2, force −1, set: dembo_ami — *Tu joues pour lui. Il marque ; il te montre du doigt. C'est son dernier but ; il le sait, pas toi.*
**Traces** : video_europe, dembo_ami (« {annee} : au désert, Dembo a marqué son dernier but sur une passe de {prenom} {nom}. Il l'a montré du doigt. ») · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 01 (Dembo, fiche à écrire : retrouvailles « le dernier but »), ch. 11 (Dembo entraîneur de Corbelin, 2020 : « tu m'as fait la passe »), ch. 30 (jp_exil plus)

### SCÈNE jp.banc_dore.s1_premier_jour  —  Vue sur le stade vide
**Rôle** : joueur · **Intrigue** : jp.banc_dore.rouille · **Étape** : 5/9 · **Moment** : saison 1, [1,2] · **Lieu** : selon la variante · **Conditions** : `!flag('divorce')` ; sinon secours Josiane
Variante `flag('camille_ici')` (première vraie) — **CAMILLE** *(sourire — la cuisine d'un appartement neuf, la fenêtre donne sur le stade vide, on voit ton banc)* : « Tu rentres à quelle heure, je le vois depuis la cuisine maintenant, ton banc, il est vide aussi. Je m'inscris à l'école de langue, ou je cherche un cabinet ? » — ← **L'école, d'abord** — relation.camille +1, caisse − — *Elle apprend. Elle parle mieux que toi en six mois ; elle commande pour deux.* · → **Un cabinet, ton métier** — relation.camille +2, caisse +, set: camille_metier_desert — *Elle ouvre. Elle a des clients : les femmes des joueurs, puis les joueurs, puis Nassir, une fois.*
Variante `flag('camille_reste')` — **CAMILLE** *(neutre — au téléphone, une heure qui n'est pas la tienne)* : « Tu rentres à quelle heure, enfin, tu rentres quel mois ; Sacha demande si le désert a une saison. Je viens à Noël, ou tu viens ? » — ← **Viens à Noël** — caisse −, relation.camille +1, set: camille_ici — *Elle vient. Elle reste. Elle dit que c'était pour Noël ; c'était pour voir.* · → **Je viens, moi** — tribunes −, direction −, relation.camille +1 — *Tu prends l'avion. Nassir compte les jours d'absence ; il les amortit.*
Secours — **JOSIANE** *(la Josiane d'ici, bande « SECRÉTAIRE DEPUIS 2001 » — neutre — un classeur en deux alphabets)* : « Nouvelle saison, et j'en ai vu passer, vous savez, des Européens qui ne restent pas ; le casier climatisé, ou celui près de la porte ? » — ← **Climatisé** — caisse +, vestiaire − · → **Près de la porte** — vestiaire +, direction −.
**Traces** : camille_ici, camille_metier_desert (« {annee} : Camille a ouvert un cabinet au désert. Les joueurs y vont ; Nassir, une fois. ») · **Réactions déclenchées** : — · **Lu plus tard par** : objectif `banc_dore_camille`, ch. 01 (Camille, palier +3 : « j'ai un métier ici »), fin jp_exil (epitaph_plus)

### SCÈNE jp.banc_dore.s1_twist  —  Le nombre de corners (twist)
**Rôle** : joueur · **Intrigue** : jp.banc_dore.rouille · **Étape** : 6/9 · **Moment** : saison 1, [10,11] · **Lieu** : le bar de l'hôtel, un homme avec un verre d'eau, il n'en propose pas d'autre · **Conditions** : `!flag('pari') && !flag('pari_refuse')`
**UN ÉMISSAIRE** *(voix sans portrait — il parle bas, il a un carnet fermé)*
« Juste le nombre de corners, monsieur, personne ne demande de perdre, ici on ne perd jamais ; un chiffre samedi, et la maison au pays est payée. Vous donnez le chiffre, ou vous finissez votre eau ? »
← **Je finis mon eau** — effets : tribunes +, direction +, relation.camille +1, set: pari_refuse — *Tu finis. Il paie l'eau. Il ne revient pas ; un autre revient, en juin, avec un autre verre.*
→ **Un chiffre, une fois** — effets : caisse ++, set: pari, set: pisteur — *Tu dis cinq. Il y en a cinq. Tu ne sais pas comment ; La Plume, elle, saura en juin.*
Variante `flag('sacha_nee')` : « … un chiffre samedi, et l'école de votre fille est payée dix ans, la bonne, celle avec le bus. » — mêmes sorties ; la droite donne aussi relation.camille −1 (elle a compris d'où venait l'école).
**Traces** : pari (∃), pari_refuse · **Réactions déclenchées** : — · **Lu plus tard par** : jp.pari.plume (S+1), jp.pari.brigade, fin jp_pari, ch. 02 (Amsel : « vous étiez au désert »), ch. 15 (les paris asiatiques, dossier de l'instance), jp.te.corners

### SCÈNE jp.banc_dore.s1_veille  —  L'air sec
**Rôle** : joueur · **Intrigue** : jp.banc_dore.rouille · **Étape** : 7/9 · **Moment** : saison 1, slot 17 · **Lieu** : le terrain d'entraînement d'Al-Dorado, le soir, Rouvier en stage avec le chronomètre des Cobalts, qui n'aime pas la chaleur · **Conditions** : `year <= 2014`
**ROUVIER** *(kiné des Cobalts, en stage — neutre — elle souffle sur le chronomètre, il colle)*
« Respire. Encore. Ici l'air est sec, les jambes aussi, et demain c'est le dernier match d'un championnat que personne ne regarde ; tu cours demain, ou tu me montres ce qu'il reste ? »
← **Je cours demain** — effets : tribunes +, force −1 — *Tu cours. Elle chronomètre. Elle ne dit pas le chiffre ; elle le note pour Brissac.*
→ **Je te montre ce qu'il reste** — effets : force +1, relation.rouvier +1, set: rouvier_desert — *Tu lui montres. Il reste des jambes. Elle le dit à Brissac ; Brissac le note dans une colonne qui n'existait pas.*
Variante `year > 2014` : le locuteur devient **LE KINÉ DU CLUB** *(voix sans portrait)* : « Le club veut un bilan avant l'été, pour votre ligne ; vous courez demain, ou vous me montrez ce qu'il reste ? » — mêmes sorties, sans `rouvier_desert`.
**Traces** : rouvier_desert (« {annee} : Rouvier a chronométré {prenom} {nom} au désert. Il restait des jambes. ») · **Réactions déclenchées** : — · **Lu plus tard par** : jp.selection (variante « un exilé dans la liste ? » : `if: flag('rouvier_desert')`), ch. 14 (Brissac : « Rouvier vous a vu au désert »), ch. 01 (Rouvier)

### SCÈNE jp.banc_dore.s2_rentree  —  Une ligne de plus (rejouable)
**Rôle** : joueur · **Intrigue** : jp.banc_dore.rouille · **Étape** : 8/9 · **Moment** : saison 2+, [1,2] · **Lieu** : le bureau de Nassir, un tableau sur un mur entier, une ligne de plus · **Conditions** : —
**NASSIR** *(propriétaire — neutre ; sourire si `comprend_actif` — il pointe la nouvelle ligne, puis la tienne, avec le même doigt)*
« Ce n'est pas un club, c'est un actif, et cette année il y a une ligne de plus : un joueur d'Europe, plus jeune, plus cher, à votre poste. Vous êtes la ligne d'avant, ou la ligne d'après ? »
← **Celle d'avant, je joue** — effets : direction −, tribunes +, force −1, set: ligne_avant — *Tu joues. Dix minutes par match. On te siffle poliment ; c'est le désert, tout est poli.*
→ **Celle d'après, je conseille** — effets : direction ++, caisse +, force −2, set: ligne_apres — *Tu conseilles le jeune. Il t'écoute ; il n'a personne d'autre. Nassir amortit ta ligne plus lentement.*
Variante `plays() >= 2` : « Ce n'est pas un club, c'est un actif, et il y a deux lignes de plus ; la vôtre s'appelle « historique » sur le tableau, c'est un mot qui coûte. Avant, ou après ? » — mêmes sorties.
**Traces** : ligne_avant, ligne_apres (« {annee} : au désert, {prenom} {nom} est devenu la ligne d'après. Il conseillait le jeune. ») · **Réactions déclenchées** : jp.re.nassir_amortit (§ 7) · **Lu plus tard par** : ch. 12 (Nassir : « vous savez ce qu'est une ligne »), fin jp_exil (epitaph_plus « la ligne d'après »), transition entraîneur (§ 10.4 : « tu conseillais déjà »)

### SCÈNE jp.banc_dore.s2_veille  —  Trois heures du matin (rejouable)
**Rôle** : joueur · **Intrigue** : jp.banc_dore.rouille · **Étape** : 9/9 · **Moment** : saison 2+, slot 17 · **Lieu** : ta chambre, le téléphone, Gégé depuis le local, trois heures du matin chez lui, un écran qui bloque · **Conditions** : `relation.gege >= 0`
**GÉGÉ** *(capo — sourire — on entend le local derrière lui, trois voix, pas plus)*
« La tribune n'oublie rien, elle regarde ton match à trois heures du matin sur un écran qui bloque toutes les cinq minutes. Demain, tu marques pour l'écran, ou tu rentres l'été prochain ? »
← **Pour l'écran** — effets : tribunes ++, force −1 — *Tu marques. L'écran bloque juste avant. Ils l'ont vu quand même ; c'est ce qu'ils disent.*
→ **Je rentre l'été prochain** — effets : tribunes +, parole +1, promise, set: retour_promis_gege — *Tu le dis. Il grave la date à la craie sur le mur du local. Le mur est loin ; la craie tient.*
Variante `plays() >= 2 && flag('retour_promis_gege')` : « La tribune n'oublie rien, et tu avais dit l'été dernier ; la craie est encore là, on ne l'a pas effacée. Cet été, ou on efface ? » — ← **Cet été** — parole +1, set: retour_promis_gege · → **Effacez** — parole −2, tribunes −−, clear: retour_promis_gege.
**Traces** : retour_promis_gege (« {annee} : {prenom} {nom} a promis à Gégé de rentrer. À la craie, sur le mur du local. ») · **Réactions déclenchées** : — · **Lu plus tard par** : jp.retour_usine (variante « le retour en Europe »), jp.banc_dore.d3_coach_europe (variante « tu l'avais promis à Gégé »), ch. 90 (mémoire du club : la craie), grand_deballage (epitaph_plus : la promesse non tenue)

### 5.4 POSTULAT `capitaine_dechu` ★ — Capitaine du géant déchu

**Année** : 2012 · **Club** : D2, rétrogradé administrativement (six titres au mur, la Commission dans le couloir : `commission_lettre` posée par le monde) · **Âge** : 30 · **Jauges** : vestiaire 40, tribunes 90, direction 50, caisse 20 · **Force** : 48 · **Drapeaux** : `[capitaine, geant_dechu]` · **Objectif** : la montée immédiate (72 points) · **Question** : `remontee` / `fierte` / `depart` · **Cast** : gege (2,5), brehaut (DS du club depuis 2010 : 2), vialat (l'Inspecteur, 1,5), vukic (le coach, 1,5), josiane (retraitée en 2022 ; en 2012 secrétaire de la Fédération : ici « la petite Josiane », sa nièce, prend le club : voix avec le portrait de Josiane, bande « SECRÉTAIRE DEPUIS 2008 », 1), lea (1), meneche (directeur d'antenne, 1), vence (1), fardelli (1), solvang (1), paulette (morte en 2009 : sa place 14B est vide, une carte-anecdote), vecchio (buvette des anciens, 1), dembo (ruiné en 2015 ; en 2012 consultant, 0,5), camille (1), sacha (1), « les jeunes du centre » (voix) · **Pool "0"** : jp.tifo (signature, variante « le tifo des six titres »), jp.vestiaire_porte (variante « le capitaine porte le vestiaire »), jp.brassard_20 (variante « tu l'as déjà »), jp.premiere_une, jp.contrat_image (variante « le club ne peut plus te payer : l'image, si »), jp.conseils_gigi (Vecchio à la buvette des anciens) · **"1"** : jp.clause (variante « la clause de relégation »), jp.pari (`if: gauges.caisse < 30`), co.derby, jp.genou_parle, jp.selection (« un capitaine de D2 dans la liste ? ») · **"2+"** : jp.jubile, jp.memoires, jp.consultant, jp.diplome_joueur.
**Objectifs** : `geant_remonte` — *Remonter en deux saisons* (`flag('geant_remonte')` ; indice : « Six titres au mur. Le mur est en D2. ») · `geant_brassard_garde` — *Le brassard jusqu'au bout* (`flag('capitaine') && stats.saisons >= 2 && !flag('brassard_refuse')` ; indice : « Il pèse. Garde-le. ») · `geant_jeunes` — *Les jeunes du centre* (`flag('jeunes_lances')` ; indice : « Le vestiaire est de bric et de broc. Le centre, non. »).
**alarm_override** : `caisse.low` → `jp.geant.alarme_vialat_ligne` (Vialat : « Je ne juge pas, je compte : votre salaire est la ligne trois, et la ligne trois est trop longue. »).

### SCÈNE jp.geant.g1_six_titres  —  Six titres au mur
**Rôle** : joueur · **Intrigue** : jp.geant.dechu · **Étape** : 1/9 · **Moment** : saison 0, slot 1 · **Lieu** : le vestiaire, six écussons dorés au mur, dix-neuf casiers vides, Bréhaut en costume · **Conditions** : —
**BRÉHAUT** *(directeur sportif — neutre — il compte les casiers pleins sur ses doigts, il n'a pas besoin des deux mains)*
« Le groupe vit bien, enfin, le groupe c'est toi, trois vieux, le centre et un gardien de prêt ; six titres au mur, pas de quoi payer le mur. Tu gardes le brassard, ou je te vends pour payer le mur ? »
← **Je garde le brassard** — effets : tribunes ++, vestiaire +, caisse −, set: brassard_garde_dechu — *Tu le gardes. Gégé fait un tifo avec les six titres et ton numéro en dessous, en plus grand.*
→ **Vends-moi, paie le mur** — effets : caisse +++, tribunes −−−, set: brassard_refuse, club: {change: true, division: 1} — *Il te vend. Le mur est payé. Le tifo de Gégé est fait quand même ; il dit « JUDAS » en dessous des titres.*
Variante `fil_rouge == 'fierte'` : « Le groupe vit bien, enfin, le groupe c'est six titres et un mur ; la Commission dit qu'on est en D2, la tribune dit qu'on est nous. Tu joues la D2 comme un géant, ou comme un club de D2 ? » — ← **Comme un géant** — tribunes ++, direction −, force −1, set: joue_geant · → **Comme un club de D2** — direction ++, tribunes −, force +1, set: joue_d2.
**Traces** : brassard_garde_dechu, brassard_refuse (« {annee} : {prenom} {nom} a rendu le brassard pour payer le mur. Le tifo l'a dit autrement. »), joue_geant, joue_d2 · **Réactions déclenchées** : co.re.gege_decoupe (∃) · **Lu plus tard par** : objectif `geant_brassard_garde`, jp.geant.g2_vialat, ch. 01 (Bréhaut DS), ch. 90 (mémoire du géant : −3 si vendu)

### SCÈNE jp.geant.g2_vialat  —  La ligne trois
**Rôle** : joueur · **Intrigue** : jp.geant.dechu · **Étape** : 2/9 · **Moment** : saison 0, [10,11] · **Lieu** : une salle de réunion du club, Madame Vialat avec un classeur, Bréhaut qui regarde ses chaussures · **Conditions** : —
**VIALAT** *(l'Inspecteur — neutre — elle lit la ligne trois, qui est toi, sans lever les yeux)*
« Je ne juge pas, je compte : votre salaire est la ligne trois du budget, et la ligne trois empêche de recruter en janvier. Vous le baissez de moitié, monsieur {nom}, ou le club joue à dix-huit ? »
← **De moitié, pour janvier** — effets : caisse −−, vestiaire ++, tribunes +, set: salaire_baisse — *Tu signes l'avenant. Bréhaut recrute deux jeunes et un vieux. Vialat compte ; ça tombe juste.*
→ **À dix-huit jusqu'en juin** — effets : caisse +, vestiaire −−, direction −, set: dix_huit — *Vous jouez à dix-huit. Les jeunes du centre remplissent le banc ; ils ne remplissent pas encore le terrain.*
**Traces** : salaire_baisse (« {annee} : {prenom} {nom} a baissé son salaire de moitié. Vialat a compté ; ça tombait juste. »), dix_huit · **Réactions déclenchées** : jp.re.josiane_petite_avenant (§ 7) · **Lu plus tard par** : jp.geant.g3_jeunes, ch. 02 (Vialat : `ligne_douze` variante « vous aviez baissé la ligne trois »), une.geant.moitie, ch. 13 (`geant_dechu` côté bureau : « le capitaine avait baissé son salaire »)

### SCÈNE jp.geant.g3_jeunes  —  Les jeunes du centre
**Rôle** : joueur · **Intrigue** : jp.geant.dechu · **Étape** : 3/9 · **Moment** : saison 0, slot 16 · **Lieu** : le terrain annexe, sept gamins de dix-sept ans, Vukić avec son cahier · **Conditions** : —
**VUKIĆ** *(entraîneur — neutre — le cahier ouvert à une page avec sept prénoms et un seul nom, le tien)*
« Je te le dis parce que personne ne te le dira : dimanche c'est le dernier match, et je peux lancer les sept gamins d'un coup, avec toi devant pour les tenir, ou trois. Sept, ou trois ? »
← **Les sept, je les tiens** — effets : vestiaire ++, tribunes ++, force −2, set: jeunes_lances — *Tu les tiens. Vous gagnez deux à un ; le deux, c'est un gamin ; le un, c'est toi.*
→ **Trois, pas de folie** — effets : direction +, force +1, vestiaire − — *Trois jouent. Les quatre autres regardent depuis le banc ; l'un d'eux signe ailleurs en juin.*
**Traces** : jeunes_lances (« {annee} : sept gamins du centre lancés d'un coup. {prenom} {nom} devant, pour les tenir. ») · **Réactions déclenchées** : — · **Lu plus tard par** : objectif `geant_jeunes`, ch. 11 (le second prodige : « les sept gamins »), ch. 13 (côté bureau), une.geant.sept_gamins

### SCÈNE jp.geant.g4_virage  —  Le dernier virage du géant
**Rôle** : joueur · **Intrigue** : jp.geant.dechu · **Étape** : 4/9 · **Moment** : saison 0, slot 17 · **Lieu** : la buvette des anciens, Vecchio derrière le comptoir, la place 14B vide dans la tribune Est visible par la fenêtre · **Conditions** : —
**VECCHIO** *(buvette des anciens, 63 ans — sourire — il essuie un verre qui est déjà propre)*
« J'en ai vu d'autres, des géants qui tombent, et ils remontent tous, sauf ceux qui font semblant d'être encore en haut. Demain, tu joues pour la Une de la remontée, ou pour la place 14B ? »
← **Pour la Une** — effets : tribunes ++, direction + — *Tu joues pour la Une. Elle est belle, ou elle attend un an de plus.*
→ **Pour la place 14B** — effets : tribunes +, vestiaire +, relation.vecchio +1, set: pour_paulette — *Tu joues pour une place vide. Le stade la connaît. On ne s'y assoit plus depuis 2009.*
**Traces** : pour_paulette (sans Almanach) · **Réactions déclenchées** : co.re.vecchio_garde (∃) · **Lu plus tard par** : ch. 31 (anecdote Paulette : la place 14B), set-piece `gm_annonce` (ch. 30, variante « la place vide »)

### SCÈNE jp.geant.s1_premier_jour  —  Le septième écusson
**Rôle** : joueur · **Intrigue** : jp.geant.dechu · **Étape** : 5/9 · **Moment** : saison 1, [1,2] · **Lieu** : selon la variante · **Conditions** : —
Variante `bilan.outcome == 'montee'` (première vraie) — **GÉGÉ** *(capo — sourire — le tifo des six titres, un septième écusson dessiné à la craie)* : « La tribune n'oublie rien, elle a compté : deux saisons, tu avais dit une, on te pardonne la deuxième. Le septième écusson, on le peint pour la remontée, ou pour un titre, plus tard ? » — ← **Pour la remontée** — tribunes ++, set: geant_remonte, set: septieme_remontee — *Il peint. Ce n'est pas un titre ; « c'est plus grand », dit-il ; il a tort et raison.* · → **Pour un titre, plus tard** — tribunes +, direction +, parole +1, promise, set: geant_remonte — *Il laisse la craie. Elle tient une saison ; c'est de la craie.*
Variante sinon — **BRÉHAUT** *(directeur sportif — noir — un fax de vente, un gamin de dix-sept ans dessus, sans photo)* : « Le groupe vit bien, enfin, le groupe n'est pas remonté, et Vialat dit que je vends un gamin ou que je vends le mur. Tu me dis lequel des sept, ou tu me laisses choisir ? » — ← **Je te dis lequel** — direction +, vestiaire −−, set: gamin_designe — *Tu dis un prénom. Il est vendu en juin. Les six autres te regardent autrement ; ils ont compris qui choisit.* · → **Choisis, c'est ton métier** — direction −, vestiaire +, relation.brehaut −1 — *Il choisit le meilleur. Il part. Le tifo perd une lettre ; on ne sait plus laquelle.*
**Traces** : geant_remonte (« {annee} : le géant est remonté. {prenom} {nom} avait le brassard, et deux saisons. »), septieme_remontee, gamin_designe (« {annee} : {prenom} {nom} a désigné le gamin à vendre. Les six autres ont compris. ») · **Réactions déclenchées** : co.re.gege_decoupe (∃) · **Lu plus tard par** : objectif `geant_remonte`, ch. 13 (`geant_dechu` côté bureau : « le capitaine a choisi le gamin »), ch. 11 (le second prodige), ch. 90 (mémoire du géant), fin jp_porteparole (epitaph_plus)

### SCÈNE jp.geant.s1_twist  —  La ligne douze (twist)
**Rôle** : joueur · **Intrigue** : jp.geant.dechu · **Étape** : 6/9 · **Moment** : saison 1, [10,11] · **Lieu** : la salle de réunion, Madame Vialat debout, une seconde lettre, Bréhaut assis cette fois · **Conditions** : —
**VIALAT** *(l'Inspecteur — neutre — elle lit la seconde lettre debout, elle ne s'assoit jamais pour une seconde lettre)*
« Je ne juge pas, je compte, et je compte que la ligne douze, les primes de remontée, n'existe pas dans le budget. Vous signez que vous y renoncez, monsieur {nom}, ou le club joue sans janvier ? »
← **Je renonce aux primes** — effets : caisse −−, vestiaire +, direction +, set: primes_renoncees — *Tu signes. Les gamins signent après toi ; ils n'avaient pas de prime, ils signent quand même.*
→ **Les primes sont au contrat** — effets : caisse +, direction −−, tribunes −, set: primes_gardees — *Elle compte. Ça ne tombe pas juste. Janvier passe sans recrue ; février non plus.*
Variante `flag('salaire_baisse')` : « Je ne juge pas, je compte, et vous avez déjà divisé la ligne trois, je l'ai noté ; la ligne douze est la dernière que je regarde. Vous signez ? » — mêmes sorties, la gauche donne relation.vialat +1.
**Traces** : primes_renoncees (« {annee} : {prenom} {nom} a renoncé aux primes de remontée. Vialat a compté ; les gamins ont signé après. »), primes_gardees · **Réactions déclenchées** : jp.re.josiane_petite_avenant (§ 7, après ←) · **Lu plus tard par** : ch. 02 (Vialat : `ligne_douze`), ch. 13 (`geant_dechu` côté bureau : « les primes de la ligne douze »), ch. 20 (« LE CAPITAINE RENONCE À LA LIGNE DOUZE »), transition DS (§ 10.5)

### SCÈNE jp.geant.s1_veille  —  Le dessin
**Rôle** : joueur · **Intrigue** : jp.geant.dechu · **Étape** : 7/9 · **Moment** : saison 1, slot 17 · **Lieu** : la maison, un dessin de stade sur la table, sept écussons dessus · **Conditions** : `flag('sacha_nee')` ; sinon variante Camille
**SACHA** *(ton enfant, huit ans — neutre ; noir à −1 — elle tient le dessin par un coin, elle l'a daté)*
« Tu m'as promis qu'on remonterait, c'est écrit sur mon dessin, avec la date. Demain c'est le dernier match : je viens, ou tu m'appelles après ? »
← **Tu viens** — effets : tribunes +, relation.sacha +1, relation.camille +1, set: sacha_tribune — *Elle vient. Elle ne regarde pas le match ; elle regarde le dessin, puis le score, puis le dessin.*
→ **Je t'appelle après** — effets : direction +, relation.sacha −1 — *Tu appelles. Elle a déjà vu le score. Elle demande si le dessin est faux.*
Variante `!flag('sacha_nee') && !flag('divorce')` — **CAMILLE** *(neutre — un costume dans une housse, livré ce matin, pas commandé par elle)* : « Tu rentres à quelle heure, demain, après le dernier match ; je demande parce que Bréhaut a fait livrer un costume, à ta taille. Tu me dis ce que ça veut dire, ou il me le dit ? » — ← **Je te le dis** — relation.camille +1, set: costume_evoque — *Tu le dis. Elle range la housse dans l'armoire, avec les maillots ; pas au même endroit.* · → **Il te le dira** — relation.camille −1, direction + — *Il le lui dit. Par téléphone ; elle raccroche avant la fin.*
**Traces** : sacha_tribune (« {annee} : Sacha, huit ans, à la tribune du dernier match. Elle avait daté le dessin. »), costume_evoque · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 01 (Sacha : « tu m'as promis », palier), transition DS (§ 10.5 : « le costume est déjà dans l'armoire »), ch. 90 (lignée)

### SCÈNE jp.geant.s2_rentree  —  Toi et dix gamins (rejouable)
**Rôle** : joueur · **Intrigue** : jp.geant.dechu · **Étape** : 8/9 · **Moment** : saison 2+, [1,2] · **Lieu** : le vestiaire, la liste du groupe sur la porte, dix prénoms et un nom · **Conditions** : —
**BRÉHAUT** *(directeur sportif — neutre ; sourire si `geant_remonte` — il lit la liste à voix haute, il s'arrête à ton nom)*
« Le groupe vit bien, et le groupe c'est toi et dix gamins maintenant, les trois vieux sont partis tenir la buvette. Tu joues capitaine, ou tu joues papa ? »
← **Capitaine** — effets : vestiaire +, tribunes +, force −1 — *Tu joues capitaine. Les gamins courent pour toi ; tu cours moins ; ça s'équilibre.*
→ **Papa, ils en ont besoin** — effets : vestiaire ++, direction +, force −2, relation.brehaut +1, set: papa_du_groupe — *Tu joues papa. Ils t'appellent « le vieux ». C'est tendre ; ils ne le savent pas.*
Variante `plays() >= 2` : « Le groupe vit bien, et c'est toi et onze gamins ; tu es le seul à avoir vu les six titres en vrai, eux les ont vus sur le mur. Capitaine, ou papa ? » — mêmes sorties.
**Traces** : papa_du_groupe (« {annee} : {prenom} {nom} a joué papa pour dix gamins. Ils l'appelaient « le vieux ». ») · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 11 (le brassard de Bréhaut : « tu jouais papa, tu sais faire »), fin jp_porteparole (epitaph_plus), transition entraîneur (§ 10.4)

### SCÈNE jp.geant.s2_veille  —  Le blanc (rejouable)
**Rôle** : joueur · **Intrigue** : jp.geant.dechu · **Étape** : 9/9 · **Moment** : saison 2+, slot 17 · **Lieu** : la Tribune Nord, le tifo des six titres, un septième écusson vide, repeint en blanc chaque août · **Conditions** : —
**GÉGÉ** *(capo — sourire — il touche le blanc de l'écusson, la peinture est fraîche)*
« La tribune n'oublie rien, et le septième écusson est vide depuis qu'on est descendus, on le repeint chaque août pour qu'il reste blanc. Demain tu le remplis, ou tu nous laisses le blanc ? »
← **Je le remplis** — effets : tribunes ++, force −1 — *Tu joues pour l'écusson. Il reste blanc, ou pas ; c'est le dernier match, pas le dernier mot.*
→ **Laissez le blanc** — effets : tribunes +, vestiaire +, set: ecusson_blanc — *Tu joues pour le groupe. Le blanc reste. Gégé dit que le blanc, c'est aussi une couleur ; il ne le croit pas.*
Variante `flag('septieme_remontee')` : « … le septième est peint, c'est la remontée, et il y a de la place pour un huitième ; demain, tu commences le huitième, ou on garde le mur ? » — mêmes sorties.
**Traces** : ecusson_blanc (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 13 (`geant_dechu` côté bureau : le tifo), ch. 90 (mémoire du géant : « le blanc »)

---

## 6. Le réservoir du joueur pro

Vingt-sept intrigues (§ 6.1-6.27), toutes écrites en entier au gabarit § 4.1 et § 4.3 (les § 6.21 et 6.23 sont les variantes joueur des intrigues partagées `co.pharmacie` et `co.derby`, dont le chapitre 11 écrit le côté banc). Les pools par postulat sont dans les fiches des § 3-5. Rythme : une intrigue sur trois est légère (`absurde` ou `famille`) ; les deux drames (`co.pharmacie` variante victime, `jp.genou_parle` issue `genou_grave`) ne sont jamais tirés en S0 ni l'un après l'autre (ordre des pools).

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
« Vingt mètres à ton nom, c'est joli, ça fait monter le prix, alors j'ai fait peindre le prix sur le panneau d'à côté ; j'ai pas le temps, j'ai une usine. Tu poses avec les deux, ou on efface le prix ? »
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
« Capitaine, c'est à toi de parler au groupe avant le derby, et je te le dis parce que personne ne te le dira : ils t'écoutent depuis le brassard, pas avant. Discours de feu, ou silence et terrain ? »
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
« Le coach veut le petit dimanche, et je te le dis parce que personne ne te le dira : il a raison cette semaine, pas la prochaine. Tu acceptes le banc sans rien dire, ou je lui dis quelque chose ? »
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
« Tu es rentré de sélection, en héros ou en boitant, je ne sais pas encore, le Doc n'a pas fini ; j'ai pas le temps, j'ai une usine. Tu joues dimanche pour prouver que ça valait le coup, ou je vends ? »
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
« Juste une question, hors micro : trois « je ne commente pas » en un mois, et le Flux en a fait une boucle, on vous voit le dire à votre mariage, à votre enterrement. Vous en riez, ou vous commentez ? »
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
« Tu es dedans dimanche, en bas de la feuille, et je te le dis parce que personne ne te le dira : c'est moi qui ai insisté, pas lui. Tu rentres par la petite porte, ou tu attends la grande ? »
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
Variante `flag('radio_cachee')` (jp.re.sabatier_radio_agent) : Camille ajoute « et le Doc a fermé un tiroir devant ton agent, on me l'a dit » ; sans effet. · Variante `flag('camille_medecin')` : « Tu rentres à quelle heure, et tu boites, je suis médecin, je vois ça de la cuisine. Je t'examine ici, ou tu vas voir Sabatier ? » — ← **Examine-moi** — force +2, relation.camille +1, set: genou_dit · → **Sabatier** — relation.camille −1, set: genou_cache.
**Traces** : genou_dit, genou_cache · **Réactions déclenchées** : — · **Lu plus tard par** : jp.genou.visite, jp.pepite.p3_vente (variante), ch. 12 (visite médicale cachée), ch. 01 (Camille)

### SCÈNE jp.genou.visite  —  La visite médicale
**Rôle** : joueur · **Intrigue** : jp.genou_parle · **Étape** : 6/6 · **Moment** : saison suivante, [1,6], ou au moment d'un transfert · **Lieu** : le cabinet du club acheteur, un kiné inconnu, Sabatier au téléphone · **Conditions** : `flag('genou_cache')` (absorbe `jp.corps.visite_medicale` ∃)
**SABATIER** *(médecin — neutre — au téléphone, il parle à voix basse, il est dans son bureau à toi)*
« Le club qui t'achète veut le bilan, et j'en ai deux : celui du dossier, propre, celui du tiroir, qui boite ; ça reste entre la table et moi, mais on me demande la table. J'arrondis, ou je dis tout ? »
← **Arrondis** — effets : direction +++, caisse +, parole −1, set: bilan_arrondi — *Il arrondit. Tu signes. Le kiné du club acheteur regarde ton genou pendant six mois, tous les matins ; il finit par comprendre.*
→ **Dis tout** — effets : direction −, tribunes +, relation.sabatier +1, set: bilan_vrai — *Il dit tout. Le club achète moins cher, ou n'achète pas. Il te serre la main ; il ne l'a jamais fait.*
**Traces** : bilan_arrondi (« {annee} : le bilan de {prenom} {nom} a été arrondi. Le genou, non. »), bilan_vrai · **Réactions déclenchées** : co.re.josiane_a_lu (∃) · **Lu plus tard par** : ch. 12 (`ds.sabatier.visite_cachee` : l'autre côté), ch. 01 (Sabatier, trahison/faveur), fin jp_sansclub (plus)
**Épilogue** : ligne « {annee} : le genou de {nom} a parlé. On l'a écouté tard. »

### 6.9 INTRIGUE jp.camille_bac  —  Le bac de Camille
**Logline** : Camille passe le bac en juin. Toi, tu passes peut-être en D1 à quatre cents kilomètres. · **Synopsis** : Elle révise à la table de la cuisine ; Josiane a gardé ses annales de 1957 ; le jour J tombe le jour du match ; les résultats arrivent avec la vente. C'est l'intrigue famille de la pépite : dix-neuf ans tous les deux, et un seul des deux a un agent.
**Rôle(s)** : joueur · **Postulat(s)** : pepite, banc_dore (variante « à distance ») · **Porteur** : camille · **Cast** : camille, josiane, fardelli · **Thème** : famille
**Saisons** : "0" · **Conditions d'entrée** : `age <= 22 && !flag('divorce')` · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `aide` → `camille_bac_aidee` (« {annee} : {prenom} {nom} a fait réviser Camille. Elle a eu le bac ; lui, la D1. ») → ch. 01 (Camille +1 ; `co.camille.metier` : « elle a repris ses études »), une.pepite.bac · `apres` → `bac_apres` → ch. 01 (palier −1 plus tôt) · `voiture` → `voiture_camille` → jp.pepite.p3_vente (variante « la voiture est à son nom »)
**Séquencier** : revision (ouverture) → annales [in 1,3] → jour_j [in 3,7] → resultats [in 2,4].

### SCÈNE jp.bac.revision  —  La table de la cuisine
**Rôle** : joueur · **Intrigue** : jp.camille_bac · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : la cuisine, des fiches de révision, un ballon sous la table · **Conditions** : —
**CAMILLE** *(neutre — elle surligne, elle ne lève pas la tête)*
« Tu rentres à quelle heure, ce n'est pas la question ; la question c'est le bac en juin et toi qui pars peut-être à quatre cents kilomètres. Tu me fais réviser le soir, ou tu révises ton transfert ? »
← **Je te fais réviser** — effets : vestiaire −, force −1, relation.camille +1, set: camille_bac_aidee, outcome: aide — *Tu lui fais réciter. Tu apprends des choses. Fardelli appelle ; tu ne réponds pas ; c'est la première fois.*
→ **Après le transfert** — effets : force +1, tribunes +, relation.camille −1, set: bac_apres, outcome: apres — *Elle révise seule. Elle a le bac. Elle ne te le dit pas le jour même.*
**Traces** : camille_bac_aidee, bac_apres · **Réactions déclenchées** : co.re.josiane_lapin (ch. 01, variante) · **Lu plus tard par** : jp.bac.jour_j, ch. 01, une.pepite.bac

### SCÈNE jp.bac.annales  —  Les annales de Josiane
**Rôle** : joueur · **Intrigue** : jp.camille_bac · **Étape** : 2/4 · **Moment** : [1,3] · **Lieu** : le secrétariat, un carton d'annales jaunies · **Conditions** : —
**JOSIANE** *(secrétaire — sourire — elle pose le carton sur ton casier, il est lourd)*
« J'ai gardé mes annales de 1957, j'en ai vu passer, vous savez, des bacheliers, et jamais un joueur. Vous les apportez à Camille, ou je les lui apporte moi-même, en passant ? »
← **Je les apporte** — effets : relation.camille +1, relation.josiane +1 — *Tu portes le carton. Camille rit ; c'est rare cette semaine.*
→ **Apportez-les, en passant** — effets : relation.josiane +1, vestiaire + — *Elle passe. Elle reste dîner. Elle raconte 1957 ; tu apprends que Josiane a eu 18 en philosophie.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 02 (Josiane : « les annales »)

### SCÈNE jp.bac.jour_j  —  Le jour du bac, le jour du match
**Rôle** : joueur · **Intrigue** : jp.camille_bac · **Étape** : 3/4 · **Moment** : [3,7] · **Lieu** : le parking du lycée, huit heures, ton match à quinze heures · **Conditions** : —
**CAMILLE** *(neutre — elle a sa carte d'identité dans une main, ton écharpe du club dans l'autre)*
« Philo à huit heures, ton match à quinze, et je sors à midi ; tu rentres à quelle heure, aujourd'hui, ça compte. Tu m'attends à la sortie, ou tu pars au stade avant ? »
← **Je t'attends à midi** — effets : vestiaire −, force −1, relation.camille +2, set: attendu_lycee — *Tu attends. Elle sort à midi dix. Tu arrives au stade à quatorze heures trente ; Vukić te met quand même.*
→ **Je pars avant** — effets : vestiaire +, tribunes +, relation.camille −1 — *Tu pars. Elle sort seule. Elle prend le bus jusqu'au stade ; elle arrive à la mi-temps ; tu ne l'as pas vue.*
**Traces** : attendu_lycee (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 01 (Camille, retrouvailles sourire : « tu m'as attendue à la sortie »)

### SCÈNE jp.bac.resultats  —  Les résultats
**Rôle** : joueur · **Intrigue** : jp.camille_bac · **Étape** : 4/4 · **Moment** : [2,4], avant le slot 17 · **Lieu** : la voiture de Fardelli, Camille à l'arrière, un papier plié · **Conditions** : —
**FARDELLI** *(agent — sourire — il conduit, il parle au rétroviseur)*
« Elle a eu son bac, et toi tu as une offre de D1, mon ami, on parle d'argent ou d'amitié : je vous offre la voiture pour fêter les deux. Tu la prends à ton nom, ou au sien ? »
← **Au sien** — effets : caisse −, relation.camille +1, set: voiture_camille, outcome: voiture — *La voiture est à elle. Elle apprend à conduire dessus ; elle a une fac à quatre cents kilomètres, et une voiture.*
→ **Au mien** — effets : caisse +, relation.camille −1 — *La voiture est à toi. Tu roules seul dedans. C'est une belle voiture.*
**Traces** : voiture_camille · **Réactions déclenchées** : — · **Lu plus tard par** : jp.pepite.p3_vente (variante), ch. 01 (Camille : « la voiture »)
**Épilogue** : ligne « {annee} : Camille a eu le bac. {nom} a eu autre chose. »

### 6.10 INTRIGUE jp.conseils_gigi  —  Les trois conseils de Gigi
**Logline** : Un gardien de quarante et un ans a trois choses à te dire, une par saison. · **Synopsis** : Le tutoriel déguisé du joueur, en rituel : « une tribune pleine tue autant qu'une tribune vide », « l'agent est ton employé, pas ton père », « le genou a toujours raison ». À trente et un ans, le troisième vient en premier. Deux variantes d'escalier : « encore une », et le conseil d'entraîneur des gardiens quand Gigi est au staff. Pose `vars.gigi_conseils`.
**Rôle(s)** : joueur · **Postulat(s)** : tous les postulats pro · **Porteur** : vecchio · **Cast** : vecchio · **Thème** : absurde
**Saisons** : "0", "2+" · **Conditions d'entrée** : `chars.vecchio.statut in [club, staff, retraite]` · **Rejouabilité** : ritual
**Issues** → **Traces** → **Qui les lit** : `vars.gigi_conseils += 1` à chaque scène → jp.fin.s1_jambes (variante Rouvier), fin jubile (plus), ch. 01 (Vecchio), set-piece `objective` (ch. 30 : « Gigi t'a dit »)
**Séquencier** : tribune (S0, ou genou si `age >= 30`) → agent (S1) → genou (S2) → encore_une (S3+) → gants (si `gigi_staff`).

### SCÈNE jp.gigi.tribune  —  Une tribune pleine
**Rôle** : joueur · **Intrigue** : jp.conseils_gigi · **Étape** : 1/5 · **Moment** : ouverture tirée · **Lieu** : la buvette, Gigi avec une orange · **Conditions** : `age < 30`
**VECCHIO** *(gardien, 41 ans — neutre — il pèle l'orange en une seule fois)*
« Premier conseil, petit, et j'en ai vu d'autres qui ne l'ont pas écouté : une tribune pleine tue autant qu'une tribune vide. Tu le notes, ou tu attends qu'elle se remplisse pour comprendre ? »
← **Je le note** — effets : tribunes −, vestiaire +, vars.gigi_conseils +1 — *Tu le notes. Il te donne un quartier. Il en garde un pour Paulette.*
→ **J'attends de voir** — effets : tribunes +, vars.gigi_conseils +1 — *Tu attends. Elle se remplit. Il te regarde d'un air qui dit « j'en ai vu d'autres ».*
Variante `age >= 30` (le premier conseil devient le troisième) : « Premier conseil, petit, à ton âge il n'y en a qu'un : le genou a toujours raison. Tu l'écoutes, ou tu écoutes ton agent ? » — ← **Le genou** — force +1, tribunes −, vars.gigi_conseils +1 · → **L'agent** — caisse +, vars.gigi_conseils +1.
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : alarme tribunes haute (variante « Gigi te l'avait dit »)

### SCÈNE jp.gigi.agent  —  Ton employé, pas ton père
**Rôle** : joueur · **Intrigue** : jp.conseils_gigi · **Étape** : 2/5 · **Moment** : saison suivante · **Lieu** : le vestiaire, Gigi qui lace ses gants, ou les range · **Conditions** : `plays() >= 1`
**VECCHIO** *(gardien — neutre — il fait un nœud à son gant, il le défait)*
« Deuxième conseil : l'agent est ton employé, pas ton père, et j'en ai vu d'autres qui ont pleuré à l'enterrement de leur agent. Tu lui dis « non » une fois cette saison, ou jamais ? »
← **Une fois, pour voir** — effets : relation.fardelli −1, direction +, vars.gigi_conseils +1, set: gigi_non_agent — *Tu dis non à Fardelli sur un détail. Il note. Toi aussi.*
→ **Jamais, il sait mieux** — effets : caisse +, relation.fardelli +1, vars.gigi_conseils +1 — *Tu ne dis pas non. Gigi hausse les épaules ; il en a vu d'autres.*
**Traces** : gigi_non_agent · **Réactions déclenchées** : — · **Lu plus tard par** : objectif `academie_sans_fardelli`, jp.clause (variante « Gigi t'avait dit »)

### SCÈNE jp.gigi.genou  —  Le genou a toujours raison
**Rôle** : joueur · **Intrigue** : jp.conseils_gigi · **Étape** : 3/5 · **Moment** : saison 2+ · **Lieu** : la salle de soins, Gigi sur la table d'à côté, lui aussi · **Conditions** : `plays() >= 2`
**VECCHIO** *(gardien, ou entraîneur des gardiens — neutre — il a un sac de glace sur le sien)*
« Troisième conseil, et c'est le dernier, après je n'en ai plus, j'en ai vu d'autres mais pas de quatrième : le genou a toujours raison. Tu l'écoutes cette année, ou l'année prochaine ? »
← **Cette année** — effets : force +2, tribunes −, vars.gigi_conseils +1, set: gigi_genou_ecoute — *Tu lèves le pied une semaine. Le genou dit merci ; il ne le dit qu'une fois.*
→ **L'année prochaine** — effets : tribunes +, force −1, vars.gigi_conseils +1 — *L'année prochaine, il te le redira. Autrement.*
**Traces** : gigi_genou_ecoute · **Réactions déclenchées** : — · **Lu plus tard par** : jp.fin.s1_jambes (variante Rouvier), fin jubile (plus)

### SCÈNE jp.gigi.encore_une  —  Encore une (variante d'escalier)
**Rôle** : joueur · **Intrigue** : jp.conseils_gigi · **Étape** : 4/5 · **Moment** : saison 3+ · **Lieu** : le parking, Gigi avec un sac, il ne sait pas s'il rentre ou s'il sort · **Conditions** : `plays() >= 3`
**VECCHIO** *(gardien — sourire — le sac à l'épaule, il le pose)*
« Plus de conseils, petit, je les ai tous donnés, alors une question : je raccroche cette fois, ou j'en fais encore une ? J'en ai vu d'autres, mais toi tu me vois, dis-moi. »
← **Encore une, Gigi** — effets : vestiaire ++, tribunes +, relation.vecchio +1, set: gigi_encore_une — *Il rentre. Il jouera dix matchs. Il en arrêtera trois de trop, et un d'assez.*
→ **Raccroche, on t'aime** — effets : vestiaire +, direction +, relation.vecchio +1, set: gigi_staff — *Il raccroche. Il revient le lundi, en survêtement d'entraîneur des gardiens. Il a acheté le survêtement lui-même.*
Variante `flag('gigi_staff')` (scène `gants`, 5/5) : « Plus de conseils pour toi, j'en donne aux gardiens maintenant, j'en ai vu d'autres, des ailiers qui voulaient mes gants. Tu veux les essayer, une fois, à l'entraînement ? » — ← **Une fois** — vestiaire +, tribunes +, relation.vecchio +1 — *Tu essaies. Tu arrêtes un tir. Il dit « bon, c'est tout ».* · → **Jamais** — vestiaire + — *Il rit. C'est rare.*
**Traces** : gigi_encore_une, gigi_staff (∃) · **Réactions déclenchées** : co.re.vecchio_garde (∃) · **Lu plus tard par** : ch. 11 (`en.vieux_gardien`), ch. 14, ch. 30 (jubile plus)
**Épilogue** : rituel, pas d'épilogue ; ligne d'Almanach à chaque conseil : « {annee} : Gigi Vecchio a donné un conseil à {nom}. Le {n}e. »

### 6.11 INTRIGUE jp.clause  —  La clause
**Logline** : Un rival a payé ta clause au centime près ; le club fulmine et ne peut rien faire. · **Synopsis** : Fardelli annonce que `{rival}` a levé la clause ; Aulard sort la page deux (Solvang a vu la page trois : c'est Fardelli qui l'a écrite en 1990) ; Gégé veut que tu embrasses le blason ; le fax du dernier jour arrive à 23 h 58, ou pas. Issues : partir, refuser (`fidele`), doubler (`mercenaire`). Absorbe `jp.mercato.clause` ∃ et `jp.mercato.rester_loyal` ∃.
**Rôle(s)** : joueur · **Postulat(s)** : pepite ("1"), binational, banc_dore, capitaine_dechu (variante « la clause de relégation ») · **Porteur** : fardelli · **Cast** : fardelli, aulard, gege, solvang, josiane · **Thème** : mercato
**Saisons** : "1" · **Conditions d'entrée** : `gauges.tribunes >= 55 && season >= 1` · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `part` → `club: change`, `parti_chez_rival` (« {annee} : {prenom} {nom} est parti chez {rival}. La clause, au centime. ») → ch. 90 (mémoire −3, le derby à sifflets), co.derby (variante), une.pepite.rival · `refuse` → `fidele` (∃) → objectif, fin generique (plus) · `double` → `mercenaire` (« {annee} : {prenom} {nom} a fait doubler sa clause. Le club a payé pour qu'il reste. ») → ch. 13 (le président : « il nous a fait doubler »), fin jp_sandwich (plus) · `fax` → `fax_rate` → fin jp_fax
**Séquencier** : rival (ouverture) → page_deux [in 1,3] → blason [in 1,3] → fax [in 2,4] (`year < 2010` ; sinon « le mail »).

### SCÈNE jp.clause.rival  —  Au centime près
**Rôle** : joueur · **Intrigue** : jp.clause · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : la voiture de Fardelli, un chèque photocopié · **Conditions** : —
**FARDELLI** *(agent — sourire — il te montre la photocopie, il garde l'original)*
« Le rival a payé ta clause au centime près, mon ami, on parle d'argent ou d'amitié, et là c'est de l'argent : le club fulmine et ne peut rien faire. Tu fais tes valises, ou tu déclines ? »
← **Mes valises** — effets : caisse ++, tribunes −−, direction −, set: parti_chez_rival, club: {change: true}, outcome: part — *Tu pars chez le rival. Gégé décroche ton nom du local. Il ne le brûle pas ; il le garde pour le derby.*
→ **Je décline** — effets : tribunes +, direction +, relation.fardelli −1, set: fidele, outcome: refuse — *Tu déclines. Fardelli dit « on parlait d'amitié, alors ». Il n'insiste pas ; il attend l'an prochain.*
Variante `flag('gigi_non_agent')` : Fardelli ajoute « et Gigi t'a dit de me dire non une fois, je sais, c'est le moment ou jamais » ; sans effet.
**Traces** : parti_chez_rival, fidele · **Réactions déclenchées** : jp.re.gege_blason (§ 7, après ←) · **Lu plus tard par** : jp.clause.page_deux, co.derby, ch. 90, une.pepite.rival

### SCÈNE jp.clause.page_deux  —  La page deux
**Rôle** : joueur · **Intrigue** : jp.clause · **Étape** : 2/4 · **Moment** : [1,3] · **Lieu** : le bureau d'Aulard, ton contrat, la page deux, une clause entourée · **Conditions** : `!flag('parti_chez_rival')`
**AULARD** *(président — neutre — il entoure la clause une deuxième fois, au cas où)*
« La page deux, {toi}, dit que si tu restes, ta clause double ; je l'ai écrite pour qu'on ne te la lève plus. J'ai pas le temps, j'ai une usine : tu signes la page deux, ou tu restes au prix d'avant ? »
← **Je signe la page deux** — effets : caisse ++, direction +, tribunes −, set: mercenaire, outcome: double — *Tu signes. Le club paie pour que tu restes. La Gazette Rose écrit « le mercenaire fidèle » ; les deux mots sont vrais.*
→ **Au prix d'avant** — effets : tribunes ++, caisse −, set: fidele — *Tu restes au prix d'avant. Aulard ne comprend pas ; il te serre la main ; c'est rare.*
Variante `flag('page_trois_solvang')` (ch. 02) : le locuteur devient **SOLVANG** : « Mon client décide, moi je compte, et j'ai compté la page trois de votre contrat de 1990 : Fardelli y touche sur chaque prolongation. Vous signez la page deux avec lui, ou sans lui ? » — ← **Sans lui** — caisse +, relation.fardelli −2, relation.solvang +1, set: agent_solvang · → **Avec lui, tant pis** — caisse −, relation.fardelli +1.
**Traces** : mercenaire, fidele, agent_solvang · **Réactions déclenchées** : co.re.josiane_a_lu (∃) · **Lu plus tard par** : ch. 13, fin jp_sandwich (plus), ch. 02 (Solvang), une.pepite.mercenaire

### SCÈNE jp.clause.blason  —  Embrasse le blason
**Rôle** : joueur · **Intrigue** : jp.clause · **Étape** : 3/4 · **Moment** : [1,3] · **Lieu** : le bord du terrain, Gégé, l'écharpe au poing · **Conditions** : `!flag('parti_chez_rival')` (absorbe `jp.mercato.rester_loyal` ∃)
**GÉGÉ** *(capo — sourire — il te tend l'écharpe pour que tu embrasses le blason dessus)*
« Les autres partent pour des valises, toi tu es d'ici, alors embrasse le blason devant la Nord, la tribune n'oublie rien. Tu l'embrasses, ou tu prends les billets ? »
← **J'embrasse le blason** — effets : tribunes +++, caisse −, relation.gege +1, set: blason_embrasse — *Tu l'embrasses. La Nord chante. Aulard, en loge, regarde la clause doublée ; il a payé le baiser.*
→ **Je prends les billets** — effets : caisse +, tribunes −− — *Tu ne l'embrasses pas. L'écharpe reste tendue. Il la range ; il ne la range pas vite.*
Variante `flag('mercenaire')` : « Les autres partent pour des valises, et toi tu as fait doubler ta clause pour rester, on l'a lu ; la tribune n'oublie rien. Tu embrasses le blason, ou le chèque ? »
**Traces** : blason_embrasse (« {annee} : {prenom} {nom} a embrassé le blason devant la Nord. Le club avait payé. ») · **Réactions déclenchées** : co.re.gege_decoupe (∃) · **Lu plus tard par** : ch. 90 (mémoire +1), fin jp_siffle (plus)

### SCÈNE jp.clause.fax  —  23 h 58
**Rôle** : joueur · **Intrigue** : jp.clause · **Étape** : 4/4 · **Moment** : [2,4], le dernier jour du mercato · **Lieu** : le secrétariat, la nuit, Josiane devant le fax, Fardelli au téléphone · **Conditions** : `flag('parti_chez_rival') || flag('vente_ete')` ; `year < 2010` (sinon variante « le mail »)
**JOSIANE** *(secrétaire — neutre — le fax crache, elle tient la feuille par un coin)*
« Il est 23 h 58, le fax du transfert arrive page par page, et la page trois est coincée ; j'en ai vu passer, vous savez, jamais un qui se coince. Je tire sur la page, ou j'attends qu'il finisse ? »
← **Tirez** — effets : rand: [{p: 0.6, caisse ++, set: fax_passe}, {direction −−, tribunes −, set: fax_rate}] — *Elle tire. La page vient, ou elle se déchire. Le fax imprime l'heure ; il ne ment pas.*
→ **Attendez** — effets : rand: [{p: 0.5, caisse ++, set: fax_passe}, {set: fax_rate, direction −−}] — *Elle attend. Le fax finit à minuit une. Il a été promu depuis ; toi, non.*
Variante `year >= 2010` : « Le mail du transfert est parti à 23 h 58, et le serveur de la Ligue dit « en attente », j'en ai vu passer mais jamais un serveur. On rappelle, ou on attend ? » — mêmes sorties.
**Traces** : fax_passe, fax_rate (« {annee} : le transfert de {prenom} {nom} est mort dans un fax, à 23 h 59 min 58 s. ») · **Réactions déclenchées** : co.re.josiane_a_vu_le_fax (ch. 02) · **Lu plus tard par** : fin jp_fax (§ 11), ch. 12 (le fax de 23 h 58 vu du DS), une.pepite.fax
**Épilogue** : ligne « {annee} : la clause de {nom} a été levée. Au centime. »

### 6.12 INTRIGUE jp.exil_dore  —  L'exil doré
**Logline** : Le championnat du désert brille comme l'or et paie comme l'or ; le niveau reste entre eux. · **Synopsis** : Nassir propose ; Camille ne suivra pas, ou si ; Fardelli prend dix pour cent de l'or ; ton cousin gère le compte depuis les îles. Si tu pars et que le compte déborde, la fin *Parti pour l'or* (`jp_exil`, existante) tombe au Carrefour suivant. Absorbe `jp.mercato.exil_dore` ∃ et `jp.mercato.record` ∃.
**Rôle(s)** : joueur · **Postulat(s)** : pepite ("1"), fin_de_contrat ("1"), binational, banc_dore (signature, variante « déjà là ») · **Porteur** : nassir · **Cast** : nassir, fardelli, camille, « ton cousin » (voix), rouvier · **Thème** : argent
**Saisons** : "1" · **Conditions d'entrée** : `vars.nassir_palier >= 1 || year >= 1999` · **Rejouabilité** : replay {after: 3, max: 2}
**Issues** → **Traces** → **Qui les lit** : `part` → `exil_dore` (« {annee} : {prenom} {nom} est parti pour l'or. Le niveau est resté entre eux. ») → fin jp_exil (Carrefour, `caisse >= 80`), ch. 30, ch. 14 (« un exilé dans la liste ? »), une.pepite.or, ch. 02 (Nassir) · `reste` → `or_refuse` → co.re.nassir_reviendrai (∃), ch. 02 · `cousin` → `compte_cousin` → fin jp_panama (plus), jp.contrat_image (variante)
**Séquencier** : nassir (ouverture) → camille [in 1,3] → dix_pour_cent [in 1,2] → cousin (S+1, [2,6], `exil_dore`).

### SCÈNE jp.exil.nassir  —  Comme l'or
**Rôle** : joueur · **Intrigue** : jp.exil_dore · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : la loge du sponsor, Nassir, une maquette de stade avec un toit · **Conditions** : —
**NASSIR** *(fonds Qatalyst — neutre — il ouvre le toit de la maquette pour te montrer la pelouse)*
« Chez nous, le championnat brille comme l'or et paie comme l'or, le niveau reste entre nous ; ce n'est pas un club, c'est un actif, vous seriez sa meilleure ligne. Vous partez cet été, ou pas ? »
← **Je pars pour l'or** — effets : caisse +++, tribunes −−, force −1, set: exil_dore, club: {change: true, division: 0}, outcome: part — *Tu signes. Le stade a un toit. Tu ne verras plus la pluie pendant deux ans ; le genou dit merci, le reste non.*
→ **Je garde l'ambition** — effets : tribunes +, direction +, set: or_refuse, outcome: reste — *Il referme le toit. « Je reviendrai », dit-il ; il revient toujours, avec une maquette plus grande.*
Variante `plays() >= 1` (« encore ») : « Chez nous, l'or est toujours là, et vous avez dit non une fois ; ce n'est pas un club, c'est un actif, et un actif attend. Cette fois ? » · Variante `flag('banc_dore')` (déjà là) : « Ce n'est pas un club, c'est un actif, et vous en êtes déjà la ligne la plus chère ; un club voisin, dans le désert aussi, vous propose le double. Vous changez de désert, ou vous restez dans le vôtre ? » — ← **Je change de désert** — caisse +++, tribunes −, force −1 — *Un autre stade, un autre toit.* · → **Le mien** — direction +, relation.nassir +1 — *Il vous fait monter le salaire ; sans le dire.*
**Traces** : exil_dore, or_refuse · **Réactions déclenchées** : co.re.nassir_reviendrai (∃, après →) · **Lu plus tard par** : jp.exil.camille, jp.exil.dix_pour_cent, fin jp_exil, ch. 14, ch. 02, une.pepite.or

### SCÈNE jp.exil.camille  —  Elle ne vient pas
**Rôle** : joueur · **Intrigue** : jp.exil_dore · **Étape** : 2/4 · **Moment** : [1,3] · **Lieu** : la cuisine, deux billets d'avion, un seul rempli · **Conditions** : `flag('exil_dore') && !flag('divorce')`
**CAMILLE** *(noir si relation ≤ −1 — elle a rempli le tien, pas le sien)*
« Tu rentres à quelle heure, là-bas ça ne veut plus rien dire, il y a quatre heures de décalage et un désert. Je viens six mois pour voir, ou je reste ici avec mon métier ? »
← **Viens six mois** — effets : caisse −, relation.camille +1, set: camille_ici — *Elle vient. Elle reste. Elle ouvre quelque chose là-bas ; ce n'est pas ce qu'elle voulait, c'est à elle.*
→ **Reste avec ton métier** — effets : caisse +, relation.camille −2, set: camille_reste — *Elle reste. Tu appelles à des heures qui ne sont les bonnes pour personne. Le téléphone sonne dans le vide, souvent.*
**Traces** : camille_ici, camille_reste (« {annee} : Camille n'est pas venue au désert. {prenom} {nom} appelle à des heures impossibles. ») · **Réactions déclenchées** : — · **Lu plus tard par** : fin jp_exil (plus : « Camille n'est pas venue »), ch. 01 (Camille, paliers), objectif `banc_dore_camille`

### SCÈNE jp.exil.dix_pour_cent  —  Dix pour cent de l'or
**Rôle** : joueur · **Intrigue** : jp.exil_dore · **Étape** : 3/4 · **Moment** : [1,2] · **Lieu** : le hall d'un hôtel climatisé, Fardelli en costume clair, il n'a pas chaud · **Conditions** : `flag('exil_dore') && flag('agent_fardelli')`
**FARDELLI** *(agent — sourire — il te montre une facture de climatisation, à ton nom)*
« Dix pour cent de l'or, c'est dans le contrat, mon ami, on parle d'argent ou d'amitié, et par amitié j'ai fait installer la climatisation chez toi. Tu la paies, ou je la déduis ? »
← **Je la paie** — effets : caisse −, relation.fardelli +1 — *Tu paies. Il a froid chez toi ; il vient souvent.*
→ **Déduis-la de ta commission** — effets : caisse +, relation.fardelli −1, set: gigi_non_agent — *Il déduit. Il n'a plus froid chez toi ; il ne vient plus.*
**Traces** : gigi_non_agent · **Réactions déclenchées** : — · **Lu plus tard par** : fin jp_exil (plus : « il a fait installer la climatisation »)

### SCÈNE jp.exil.cousin  —  Le compte du cousin
**Rôle** : joueur · **Intrigue** : jp.exil_dore · **Étape** : 4/4 · **Moment** : saison suivante, [2,6] · **Lieu** : le téléphone, ton cousin, un bruit de vagues derrière lui · **Conditions** : `flag('exil_dore')`
**TON COUSIN** *(voix sans portrait — il parle fort, il est content)*
« Cousin, l'or arrive tous les mois, et je le mets sur le compte des îles, à côté de l'image, c'est plus simple pour tout le monde. Je continue comme ça, ou tu veux un compte ici, avec des impôts ? »
← **Continue** — effets : caisse ++, set: compte_cousin, set: offshore, outcome: cousin — *Il continue. Il achète une deuxième montre. Il t'en envoie une ; elle est belle ; elle est à ton nom.*
→ **Un compte ici** — effets : caisse −, direction +, clear: offshore — *Tu ouvres un compte. Le cousin est vexé. Il garde la montre ; il l'a « avancée ».*
**Traces** : compte_cousin, offshore (∃) · **Réactions déclenchées** : co.re.camille_journal (∃) · **Lu plus tard par** : fin jp_panama, fin jp_exil (plus), ch. 15
**Épilogue** : ligne « {annee} : Nassir a proposé l'or à {nom}. Il a dit oui, ou « je reviendrai ». »

### 6.13 INTRIGUE jp.diplome_joueur  —  Le diplôme
**Logline** : Tes jambes parlent. La réserve n'a pas d'entraîneur. Tu passes ton diplôme cet été ? · **Synopsis** : La transition vers le banc devient une intrigue en cinq temps : Vukić pose la question (la réplique existante de `roles.yaml`), Clow tient le stage (« lundi, huit heures », ch. 01 ; si `clow_ingrat` dans la lignée, il refuse), Aulard ne veut pas d'un joueur qui étudie « pendant la saison », Brissac tient le papier, et Bréhaut passe le sien en même temps : il sera ton adjoint, ou ton rival. Pose `diplome`, lu par le Carrefour.
**Rôle(s)** : joueur · **Postulat(s)** : fin_de_contrat, capitaine_dechu ("2+") · **Porteur** : vukic · **Cast** : vukic, clow, aulard, brissac, brehaut · **Thème** : direction
**Saisons** : "0" (fin_de_contrat) · **Conditions d'entrée** : `age >= 29 && !flag('diplome')` · **Exclusions** : `diplome` · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `diplome` → `diplome` (∃ ; « {annee} : {prenom} {nom} a passé le diplôme d'entraîneur. Lundi, huit heures. ») → ch. 30 (Carrefour « tu as le papier »), jp.fin.f3_juin (variante), ch. 15 (Brissac ressort le dossier), ch. 11 · `pas_encore` → `diplome_reporte` → jp.adieu (variante) · `brehaut` → `brehaut_diplome` (« {annee} : Titi Bréhaut a passé le diplôme avec {prenom} {nom}. Adjoint, ou rival. ») → ch. 11 (Bréhaut adjoint), ch. 12 (Bréhaut DS), ch. 01
**Séquencier** : vukic (ouverture) → clow [in 1,3] → aulard [in 1,3] → brissac [in 3,8] → brehaut [in 0,2].

### SCÈNE jp.diplome.vukic  —  Tes jambes parlent
**Rôle** : joueur · **Intrigue** : jp.diplome_joueur · **Étape** : 1/5 · **Moment** : ouverture tirée · **Lieu** : le terrain de la réserve, vide, un banc sans personne dessus · **Conditions** : —
**VUKIĆ** *(entraîneur adjoint — neutre — il s'assoit sur le banc de la réserve, il tapote la place à côté)*
« Tes jambes parlent, tu le sais, et je te le dis parce que personne ne te le dira : la réserve n'a pas d'entraîneur. Tu passes ton diplôme cet été, ou tu joues encore un an sans papier ? »
← **Je le passe cet été** — effets : direction +, vestiaire +, relation.vukic +1, set: diplome_en_cours — *Il te donne le formulaire. Il l'avait dans le cahier depuis mars.*
→ **Encore un an sans papier** — effets : tribunes +, direction −, set: diplome_reporte, outcome: pas_encore — *Il range le formulaire. Il en aura un l'an prochain ; il en a toujours un.*
**Traces** : diplome_en_cours, diplome_reporte · **Réactions déclenchées** : — · **Lu plus tard par** : jp.diplome.clow, jp.adieu, ch. 30

### SCÈNE jp.diplome.clow  —  Le stage
**Rôle** : joueur · **Intrigue** : jp.diplome_joueur · **Étape** : 2/5 · **Moment** : [1,3] · **Lieu** : le bar en face du stade, Clow, un verre, un tabouret libre · **Conditions** : `flag('diplome_en_cours') && chars.clow.statut != 'mort'`
**CLOW** *(le mentor — neutre — il pousse le tabouret vers toi avec le pied)*
« Le stage, c'est chez moi, et je ne dirais pas que j'étais le meilleur formateur, mais j'étais dans le top un ; lundi, huit heures. Tu viens à sept, ou tu viens à huit comme tout le monde ? »
← **À sept** — effets : direction +, relation.clow +1, set: clow_stage — *Tu es là à sept. Il est là depuis six. Il a mis ta chaise devant.*
→ **À huit, comme tout le monde** — effets : vestiaire +, relation.clow −1 — *Tu arrives à huit. Il a commencé. Il ne recommence pas.*
Variante `flag('clow_stage')` (ch. 01 : tu es déjà chez lui) : un bouton — **Je suis déjà là** — relation.clow +1 — *Il le sait. Il a mis deux chaises.* · Variante `flag('clow_ingrat')` (lignée) : **LE FILS DE CLOW** *(voix sans portrait — la doudoune du père)* : « Mon père a formé quelqu'un de votre nom, et il n'a pas eu de merci ; le stage est complet pour vous. Vous le passez ailleurs, ou vous attendez un an ? » — ← **Ailleurs** — direction −, set: clow_stage_ailleurs — *Tu le passes à la capitale. Personne ne met ta chaise devant.* · → **J'attends** — set: diplome_reporte.
**Traces** : clow_stage (ch. 01), clow_stage_ailleurs · **Réactions déclenchées** : co.re.vukic_lundi (ch. 01) · **Lu plus tard par** : ch. 01, ch. 02 (Brissac : « le stage Clow »), ch. 30

### SCÈNE jp.diplome.aulard  —  Pas pendant la saison
**Rôle** : joueur · **Intrigue** : jp.diplome_joueur · **Étape** : 3/5 · **Moment** : [1,3] · **Lieu** : le bureau d'Aulard, ton formulaire de stage sur le bureau, à l'envers · **Conditions** : `flag('diplome_en_cours')`
**AULARD** *(président — noir — il retourne le formulaire, il le lit, il le retourne encore)*
« Un joueur qui passe un diplôme pendant la saison pense à après ; j'ai pas le temps, j'ai un empire, et l'empire paie pour maintenant. Tu attends juin, ou tu le passes et je te mets sur le banc ? »
← **J'attends juin** — effets : direction ++, relation.aulard +1, set: diplome_juin — *Tu attends. Clow attend aussi ; il n'aime pas ça ; il le fait pour toi, il ne le dit pas.*
→ **Je le passe, tant pis** — effets : direction −−, tribunes −, force −1, set: diplome_contre_aulard — *Il te met sur le banc. Tu regardes les matchs en prenant des notes. Vukić lit les notes ; il corrige.*
**Traces** : diplome_juin, diplome_contre_aulard · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 02 (Aulard : « tu pensais à après »), ch. 30 (en_sms plus si entraîneur ensuite)

### SCÈNE jp.diplome.brissac  —  Le papier
**Rôle** : joueur · **Intrigue** : jp.diplome_joueur · **Étape** : 4/5 · **Moment** : [3,8] · **Lieu** : un bureau de la Fédération, Brissac, un tampon, un dossier · **Conditions** : `flag('diplome_en_cours')`
**BRISSAC** *(DTN — neutre — elle lit ton dossier de stage avant de prendre le tampon)*
« Les chiffres sont têtus, les joueurs aussi : le stage dit « présent à sept heures », ou « à huit », et je tamponne les deux, pas pareil. Le papier tout de suite, ou l'oral en juin ? »
← **Tout de suite** — effets : direction +, set: diplome, outcome: diplome — *Elle tamponne. Le papier est chaud. Vukić le met dans le dossier, dessus.*
→ **L'oral en juin** — effets : direction −, force +1, set: diplome_reporte — *Tu repasses en juin. Tu as le papier en juillet ; Vukić l'avait déjà mis dans le dossier, en blanc.*
Variante `flag('clow_stage_ailleurs')` : « Les chiffres sont têtus, les joueurs aussi, et le stage de la capitale ne vaut pas celui de Clow, mais il vaut un tampon. Tout de suite ? » — mêmes sorties.
**Traces** : diplome (∃) · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 30 (Carrefour), jp.fin.f3_juin, ch. 15 (Brissac), ch. 11 (`en.diplome`)

### SCÈNE jp.diplome.brehaut  —  Le même stage
**Rôle** : joueur · **Intrigue** : jp.diplome_joueur · **Étape** : 5/5 · **Moment** : [0,2] · **Lieu** : le couloir de la Fédération, Bréhaut avec le même papier, plié différemment · **Conditions** : `flag('diplome')`
**BRÉHAUT** *(capitaine — neutre — il te montre son papier, il regarde le tien)*
« Le groupe vit bien, et le groupe a deux diplômés cette année, toi et moi, et une seule réserve à entraîner. Tu me prends comme adjoint, ou on se présente tous les deux ? »
← **Tu seras mon adjoint** — effets : vestiaire ++, direction +, relation.brehaut +1, set: brehaut_diplome, set: brehaut_adjoint, outcome: brehaut — *Il dit « d'accord ». Il le dit vite ; il y a pensé avant toi.*
→ **On se présente tous les deux** — effets : direction −, vestiaire −, relation.brehaut −1, set: brehaut_diplome, set: brehaut_rival_banc — *Vous vous présentez. Aulard choisit ; il choisit celui qui coûte le moins. Ce n'est pas forcément toi.*
**Traces** : brehaut_diplome, brehaut_adjoint, brehaut_rival_banc · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 11 (Bréhaut adjoint de l'intérimaire ; `en.brassard_brehaut`), ch. 12, ch. 01
**Épilogue** : ligne « {annee} : {nom} a le papier. La réserve a un entraîneur, ou deux. »

### 6.14 INTRIGUE jp.jubile  —  Le jubilé
**Logline** : Un jubilé, c'est une fin. Tu n'as pas fini. · **Synopsis** : Gégé veut organiser ton jubilé ; Léa remarque qu'un jubilé en mars, quand on joue en avril, c'est étrange ; Aulard compte la recette ; Paulette veut la place 14B pour la dernière fois ; le jour du jubilé, tu fais le tour d'honneur et tu demandes où est le vestiaire, ou tu reportes. Si tu raccroches après, la fin *Le Jubilé* (existante, dorée) tombe au Carrefour.
**Rôle(s)** : joueur · **Postulat(s)** : fin_de_contrat ("1"), retour_croises ("2+"), banc_dore (« au désert, personne ne vient »), capitaine_dechu ("2+") · **Porteur** : gege · **Cast** : gege, lea, aulard, paulette, vecchio · **Thème** : tribune
**Saisons** : "1", "2+" · **Conditions d'entrée** : `gauges.tribunes >= 60 && age >= 32` · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `accepte` → `jubile_fait` (« {annee} : stade plein pour le jubilé de {prenom} {nom}. Il a demandé où était le vestiaire. ») → fin jubile (Carrefour), objectif `fin_debout`, une.fin.jubile, ch. 31 (carte-légende) · `reporte` → `jubile_reporte` → jp.adieu (variante) · `charite` → `jubile_charite` → ch. 13 (la recette est allée à la buvette des anciens), ch. 20
**Séquencier** : gege (ouverture) → lea [in 1,2] → aulard [in 1,3] → paulette [in 0,2] → jour [in 3,8].

### SCÈNE jp.jubile.gege  —  On te fait un jubilé
**Rôle** : joueur · **Intrigue** : jp.jubile · **Étape** : 1/5 · **Moment** : ouverture tirée · **Lieu** : le local, Gégé, une affiche à moitié dessinée avec ton numéro · **Conditions** : —
**GÉGÉ** *(capo — sourire — il te montre l'affiche ; la date est vide)*
« On te fait un jubilé, la Nord a voté, et la tribune n'oublie rien, surtout pas ceux qui l'ont fait chanter. Tu choisis la date, ou tu nous dis que tu n'as pas fini ? »
← **Je choisis la date** — effets : tribunes ++, direction −, set: jubile_prevu — *Tu écris la date. Il la repasse au feutre. Elle est en mars ; tu joues encore en avril.*
→ **Je n'ai pas fini** — effets : tribunes +, vestiaire +, set: jubile_reporte, outcome: reporte — *Il garde l'affiche. Il la ressort chaque année, la date toujours vide.*
**Traces** : jubile_prevu, jubile_reporte · **Réactions déclenchées** : jp.re.lea_jubile_mars (§ 7, après ←) · **Lu plus tard par** : jp.jubile.jour, jp.adieu

### SCÈNE jp.jubile.aulard  —  La recette
**Rôle** : joueur · **Intrigue** : jp.jubile · **Étape** : 3/5 · **Moment** : [1,3] · **Lieu** : le bureau d'Aulard, un tableau de recettes, ton nom sur une ligne · **Conditions** : `flag('jubile_prevu')`
**AULARD** *(président — neutre — il tape sur la ligne du tableau avec le stylo)*
« Un jubilé, c'est un stade plein sans payer un adversaire, alors j'ai pas le temps, mais j'ai le temps pour ça : la recette est au club, ou on la partage, ou tu la donnes ? »
← **On la partage** — effets : caisse ++, direction +, tribunes − — *Tu prends ta part. Elle est correcte. Gégé l'apprend ; il ne dit rien ; la tribune n'oublie rien.*
→ **Je la donne aux anciens** — effets : caisse −, tribunes ++, set: jubile_charite, outcome: charite — *La recette va à la buvette des anciens. Vecchio la gère. Il ne compte pas ; ça marche quand même.*
**Traces** : jubile_charite · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 13, ch. 20, fin jubile (plus)

### SCÈNE jp.jubile.paulette  —  La place 14B
**Rôle** : joueur · **Intrigue** : jp.jubile · **Étape** : 4/5 · **Moment** : [0,2] · **Lieu** : la tribune Est, avant le match, Paulette à sa place, une couverture sur les genoux · **Conditions** : `chars.paulette.statut != 'mort'` (Paulette meurt en 2009)
**PAULETTE** *(abonnée depuis 1951 — sourire — elle tapote la place à côté de la sienne, la 14A)*
« J'étais là en cinquante et un, mon petit, et j'ai vu tous les jubilés, ils demandent tous où est le vestiaire à la fin, par habitude. Tu viens t'asseoir cinq minutes ici, ou tu restes en bas ? »
← **Cinq minutes, ici** — effets : tribunes ++, vestiaire −, relation.paulette +1, set: paulette_14a — *Tu t'assois. Tu vois le stade de la 14A. Il est petit, et il est tout.*
→ **Je reste en bas** — effets : tribunes +, relation.paulette −1 — *Elle hoche la tête. Elle ne retient pas ton nom ; elle retient ceux qui restent.*
**Traces** : paulette_14a (« {annee} : {prenom} {nom} s'est assis cinq minutes à la 14A. Paulette a expliqué le stade. ») · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 31 (enterrement de Paulette, 2009), fin ta_loge (ch. 30, plus), jp.geant.g4_virage (variante)

### SCÈNE jp.jubile.jour  —  Le tour d'honneur
**Rôle** : joueur · **Intrigue** : jp.jubile · **Étape** : 5/5 · **Moment** : [3,8] · **Lieu** : la pelouse, le stade plein, Vecchio dans les buts pour l'occasion · **Conditions** : `flag('jubile_prevu')`
**VECCHIO** *(gardien, pour un soir — sourire — il a remis les gants, ils sont trop petits)*
« Stade plein, petit, et moi dans les buts, j'en ai vu d'autres, mais pas un jubilé où le jubilé rejoue le mois d'après. Tu fais le tour d'honneur et tu raccroches, ou tu rejoues en avril ? »
← **Je raccroche** — effets : tribunes +++, direction −, set: jubile_fait, set: dernier_annonce, outcome: accepte — *Tu fais le tour. Tu demandes où est le vestiaire. Par habitude. Le Carrefour t'attend avec une porte.*
→ **Je rejoue en avril** — effets : tribunes ++, vestiaire +, set: jubile_fait, outcome: accepte — *Tu fais le tour. En avril, tu joues. Léa titre « Le jubilé continue » ; c'est absurde ; c'est vrai.*
**Traces** : jubile_fait, dernier_annonce · **Réactions déclenchées** : co.re.vecchio_garde (∃) · **Lu plus tard par** : fin jubile (Carrefour), objectif `fin_debout`, une.fin.jubile, ch. 30
**Épilogue** : ligne « {annee} : le jubilé de {nom}. Stade plein, ou affiche sans date. »

### 6.15 INTRIGUE jp.maison_pays  —  La maison du pays
**Logline** : Construis la grande maison au village ; tout le quartier n'attend que ça. · **Synopsis** : Ta mère appelle du pays (carte existante `jp.famille.maison_pays`, absorbée) ; Camille demande où est « chez nous » ; Fardelli a une offre du club de D2 de ta ville natale ; en saison suivante, tu y retournes, en héros ou en enfant prodigue. Pose `maison_pays`, enfin lu par F2.
**Rôle(s)** : joueur · **Postulat(s)** : fin_de_contrat, binational · **Porteur** : camille · **Cast** : camille, fardelli, « ta mère, au téléphone du pays » (voix), pichon (variante : le pays, c'est Trébignac si `role_was('joueur_amateur')`) · **Thème** : famille
**Saisons** : "0" · **Conditions d'entrée** : — · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `rentre` → `maison_pays` (∃ ; « {annee} : {prenom} {nom} fait construire au pays. Le quartier a regardé les plans. ») → jp.fin.f2_offre (variante), une.fin.prodigue, ch. 30 (Carte Destin président amateur) · `reste` → `pays_refuse` → ch. 01 (Camille +1) · `achete` → `promis_camille` → ch. 01 (Camille : « tu m'avais promis la maison ici »)
**Séquencier** : mere (ouverture ; absorbe `jp.famille.maison_pays` ∃) → chez_nous [in 1,3] → offre_d2 [in 2,5] → retour (S+1, [1,4], `maison_pays_signee`).

### SCÈNE jp.maison.chez_nous  —  Chez nous, c'est où
**Rôle** : joueur · **Intrigue** : jp.maison_pays · **Étape** : 2/4 · **Moment** : [1,3] · **Lieu** : la table, des plans de maison envoyés par ta mère, Camille qui les regarde à l'envers · **Conditions** : —
**CAMILLE** *(neutre — elle retourne les plans dans le bon sens, elle ne les regarde toujours pas)*
« Tu rentres à quelle heure, et surtout tu rentres où : ta mère a envoyé les plans de la grande maison, et chez nous c'est ici, ou c'est là-bas ? Tu me le dis, ou tu laisses ta mère répondre ? »
← **Chez nous, c'est ici** — effets : relation.camille +2, caisse −, set: promis_camille, outcome: achete — *Tu achètes ici. Ta mère fait construire quand même ; « pour les vacances ».*
→ **Là-bas, c'est chez nous** — effets : relation.camille −1, tribunes +, set: maison_pays, outcome: rentre — *Tu envoies l'argent. Les murs montent. Le quartier regarde les murs monter ; il t'attend.*
**Traces** : promis_camille, maison_pays · **Réactions déclenchées** : co.re.camille_journal (∃) · **Lu plus tard par** : jp.fin.f2_offre, ch. 01, jp.maison.offre_d2

### SCÈNE jp.maison.offre_d2  —  Le club de chez toi
**Rôle** : joueur · **Intrigue** : jp.maison_pays · **Étape** : 3/4 · **Moment** : [2,5] · **Lieu** : la voiture de Fardelli, un fax d'un club de D2 avec un blason que tu connais par cœur · **Conditions** : `flag('maison_pays')`
**FARDELLI** *(agent — neutre — il te tend le fax ; il n'aime pas ce fax, il ne rapporte rien)*
« Le club de chez toi veut un nom pour monter, mon ami, on parle d'argent ou d'amitié, et là c'est ni l'un ni l'autre : ta mère a appelé le président. Tu rentres jouer en D2, ou tu finis en D1 ? »
← **Je rentre jouer** — effets : tribunes ++, caisse −, direction −, set: maison_pays_signee, club: {change: true, division: 2} — *Tu signes pour le blason. La Une du pays titre « L'enfant revient ». Ta mère l'encadre.*
→ **Je finis en D1** — effets : caisse +, tribunes −, relation.camille +1 — *Tu ne rentres pas. Ta mère raccroche en soupirant très fort ; c'est sa façon de dire « bien ».*
Variante `role_was('joueur_amateur') && flag('croissant_promis')` : le locuteur devient **PICHON** *(au téléphone, cinq heures)* : « Le pain, c'est à cinq heures, et le club, c'est en National maintenant, on a monté ; on voudrait un nom pour la Coupe. Tu rentres, ou tu es trop loin ? » — mêmes sorties, `division: 3`.
**Traces** : maison_pays_signee (« {annee} : l'enfant prodigue est rentré en D2. Sa mère a encadré la Une. ») · **Réactions déclenchées** : co.re.lea_confirme (∃) · **Lu plus tard par** : jp.maison.retour, une.fin.prodigue, ch. 30 (Carte Destin président amateur : le club de ton enfance)

### SCÈNE jp.maison.retour  —  Le premier match au pays
**Rôle** : joueur · **Intrigue** : jp.maison_pays · **Étape** : 4/4 · **Moment** : saison suivante, [1,4] · **Lieu** : le stade de ta ville natale, ta mère en tribune d'honneur, le quartier en virage · **Conditions** : `flag('maison_pays_signee')`
**TA MÈRE** *(voix sans portrait — elle a une écharpe neuve, elle ne sait pas la mettre)*
« Tout le quartier est là, ils ont payé leur place, sauf ton oncle qui est passé par la buvette ; tu joues pour eux, ou tu joues comme là-bas ? »
← **Pour eux** — effets : tribunes +++, force −1, vestiaire − — *Tu joues pour le virage. Tu marques. Le quartier envahit la pelouse ; l'arbitre laisse faire, il est du quartier.*
→ **Comme là-bas** — effets : force +1, tribunes +, direction + — *Tu joues juste. Le club monte en fin de saison. Ta mère dit que c'est grâce à toi ; c'est faux ; c'est un peu vrai.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 90 (mémoire du club natal +2)
**Épilogue** : ligne « {annee} : la grande maison au village. Les murs sont montés. »

### 6.16 INTRIGUE jp.memoires  —  Les mémoires
**Logline** : Léa te propose d'écrire tes mémoires ; Ménèche te propose de les raconter à la radio d'abord. · **Synopsis** : À trente et un ans, on te propose ta vie en livre. Vérité ou version lisse ; le chapitre trois (le vestiaire) est lu par le vestiaire ; la variante `une_lea` (ch. 02) fait de Léa quelqu'un qui a déjà titré « Vous saviez ? » sur toi. Ménèche veut la radio avant le papier.
**Rôle(s)** : joueur · **Postulat(s)** : fin_de_contrat, capitaine_dechu ("2+"), banc_dore ("2+") · **Porteur** : lea · **Cast** : lea, meneche, brehaut, camille · **Thème** : presse
**Saisons** : "0", "2+" · **Conditions d'entrée** : `age >= 30` · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `verite` → `memoires_verite` (« {annee} : les mémoires de {prenom} {nom}. Le chapitre trois parlait du vestiaire ; le vestiaire a lu. ») → jp.memoires.chapitre_trois, une.fin.chapitre_trois, fin jp_mouton (plus), ch. 02 (Ménèche), ch. 31 (2025 : le chapitre à ton nom) · `lisse` → `memoires_lisses` → ch. 20 (Écho : « un garçon poli, encore ») · `renonce` → —
**Séquencier** : lea (ouverture) → meneche [in 1,2] → chapitre_trois [in 3,8] (`memoires_verite`) → camille [in 0,2].

### SCÈNE jp.memoires.lea  —  Ta vie en livre
**Rôle** : joueur · **Intrigue** : jp.memoires · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : un café, Léa, un cahier neuf, un magnéto qu'elle te montre avant de l'allumer · **Conditions** : —
**LÉA** *(journaliste — neutre — elle pose le cahier, elle n'a pas encore allumé le magnéto)*
« Vous confirmez ? Vos mémoires, à trente et un ans, c'est tôt, mais c'est le moment où l'on se souvient encore ; je les écris avec vous. Toute la vérité, ou une version qu'on peut offrir à Noël ? »
← **Toute la vérité** — effets : tribunes +, vestiaire −, direction −, set: memoires_verite, outcome: verite — *Elle allume le magnéto. Tu parles trois heures. Elle ne coupe rien ; c'est sa règle, c'est son problème.*
→ **La version de Noël** — effets : direction +, caisse +, set: memoires_lisses, outcome: lisse — *Elle écrit. C'est bien écrit. Ça se vend. Personne ne se souvient de la page cent douze ; il n'y en a pas.*
Variante `flag('une_lea')` (ch. 02) : « Vous confirmez ? J'ai titré « Vous saviez ? » sur vous, une fois, et vous n'avez pas répondu ; vos mémoires, c'est la réponse. Vous la donnez, ou vous me laissez écrire le chapitre que je n'ai pas relu ? » — mêmes sorties, la gauche donne relation.lea +2.
**Traces** : memoires_verite, memoires_lisses · **Réactions déclenchées** : jp.re.meneche_radio_d_abord (§ 7) · **Lu plus tard par** : jp.memoires.chapitre_trois, une.fin.chapitre_trois, ch. 02, ch. 31

### SCÈNE jp.memoires.meneche  —  La radio d'abord
**Rôle** : joueur · **Intrigue** : jp.memoires · **Étape** : 2/4 · **Moment** : [1,2] · **Lieu** : un studio de Radio Tribune (ou un plateau de Télé-Stade dès 2003), Ménèche · **Conditions** : —
**MÉNÈCHE** *(chroniqueur — neutre — il a le cahier de Léa en photocopie ; il ne dit pas d'où)*
« Juste une question, hors micro : les mémoires, ça se raconte à la radio avant de s'écrire, sinon personne n'achète le livre ; une heure, dimanche soir. Vous racontez le chapitre trois, ou un autre ? »
← **Le chapitre trois** — effets : tribunes ++, vestiaire −−, relation.meneche +1, set: chapitre_trois_radio — *Tu racontes. Le vestiaire écoute la radio dans le bus. Le bus est silencieux jusqu'à l'hôtel.*
→ **Un autre, le premier** — effets : tribunes +, relation.meneche −1 — *Tu racontes ton enfance. Il bâille ; il n'a jamais bâillé en direct, il le fait exprès.*
**Traces** : chapitre_trois_radio · **Réactions déclenchées** : — · **Lu plus tard par** : jp.memoires.chapitre_trois (variante « ils l'ont entendu avant de le lire »)

### SCÈNE jp.memoires.chapitre_trois  —  Le groupe a lu
**Rôle** : joueur · **Intrigue** : jp.memoires · **Étape** : 3/4 · **Moment** : [3,8] · **Lieu** : le vestiaire, le livre ouvert sur le banc, à la page du chapitre trois · **Conditions** : `flag('memoires_verite')`
**BRÉHAUT** *(capitaine — noir — il referme le livre en gardant le doigt à la page)*
« Le groupe a lu le chapitre trois, et le groupe vit bien quand on ne raconte pas ce qui se dit ici. Tu retires le chapitre de la réédition, ou tu assumes devant tout le monde ? »
← **Je le retire** — effets : vestiaire +, tribunes −, parole −1, set: chapitre_retire — *Tu appelles Léa. Elle retire. Elle garde la page dans un tiroir ; elle la ressortira dans ses propres mémoires, en 2040.*
→ **J'assume** — effets : vestiaire −−, tribunes ++, set: chapitre_assume — *Tu assumes. Le groupe ne te fait plus la passe une semaine. La semaine d'après, Dembo te la fait ; il a aimé le chapitre.*
**Traces** : chapitre_retire, chapitre_assume · **Réactions déclenchées** : jp.re.brehaut_plus_de_passe (§ 7, après →) · **Lu plus tard par** : fin jp_mouton (plus), une.fin.chapitre_trois, ch. 01 (Bréhaut)

### SCÈNE jp.memoires.camille  —  La dédicace
**Rôle** : joueur · **Intrigue** : jp.memoires · **Étape** : 4/4 · **Moment** : [0,2] · **Lieu** : la maison, le livre imprimé, la première page · **Conditions** : `!flag('divorce')`
**CAMILLE** *(neutre — elle a lu la dédicace ; elle attend que tu la lises à voix haute)*
« Tu rentres à quelle heure, c'est la première phrase de ton livre, c'est Léa qui l'a mise, ou toi ? Tu me dédicaces l'exemplaire, ou tu le dédicaces au vestiaire ? »
← **À toi** — effets : relation.camille +2, tribunes − — *Tu écris son prénom. Elle range le livre avec les annales de Josiane ; c'est l'étagère de ce qui compte.*
→ **Au vestiaire** — effets : vestiaire ++, relation.camille −1 — *Tu écris « au groupe ». Elle lit le livre quand même. Elle s'arrête au chapitre trois ; elle y est.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 01 (Camille, retrouvailles)
**Épilogue** : ligne « {annee} : les mémoires de {nom}. Le chapitre trois a fait parler. »

### 6.17 INTRIGUE jp.consultant  —  Le consultant du dimanche
**Logline** : Il joue le samedi, il juge le dimanche. · **Synopsis** : Ménèche a un fauteuil vide à côté du sien, le dimanche soir. Tu juges les autres, et tu es bon, c'est le problème. Aulard n'a pas le temps de regarder mais Josiane lui raconte ; Vukić note tes phrases dans son cahier et compare avec les siennes ; en direct, tu dis que ton propre coach « joue trop bas », et Vence te tend le micro. Si tu tiens le fauteuil jusqu'à trente-trois ans, la fin *Le micro du dimanche* (existante) attend au Carrefour.
**Rôle(s)** : joueur · **Postulat(s)** : fin_de_contrat ("1"), capitaine_dechu ("2+"), banc_dore ("2+") · **Porteur** : meneche · **Cast** : meneche, vence, aulard, vukic · **Thème** : presse
**Saisons** : "1", "2+" · **Conditions d'entrée** : `age >= 31` · **Exclusions** : `consultant` déjà posé · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `accepte` → `consultant` (« {annee} : {prenom} {nom} juge les autres le dimanche soir. Le président « n'a pas le temps » de regarder. ») → fin jp_consultant (Carrefour si `age >= 33`), une.fin.samedi_dimanche, ch. 02 (Vence : `plateau_offert`), ch. 30, transitions § 10.4 et 10.6 · `refuse` → — · `cache` → `consultant_cache` → ch. 02 (Ménèche : le dossier « il jugeait en cachette »)
**Séquencier** : plateau (ouverture) → aulard [in 1,3] → vukic [in 1,4] → dimanche [in 2,6] (`consultant`).

### SCÈNE jp.consultant.plateau  —  Le fauteuil vide
**Rôle** : joueur · **Intrigue** : jp.consultant · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : le plateau de Télé-Stade (`year >= 2003`) ou le studio de Radio Tribune, un fauteuil vide à côté de celui de Ménèche · **Conditions** : —
**MÉNÈCHE** *(chroniqueur, puis consultant — neutre — il tapote l'accoudoir du fauteuil vide)*
« Juste une question, hors micro : le dimanche soir, vous êtes libre, et le plateau a un fauteuil vide à côté du mien. Vous jugez les autres, ou vous restez juge de vous-même ? »
← **Je prends le fauteuil** — effets : tribunes +, vestiaire −, caisse +, set: consultant, outcome: accepte — *Tu juges. Tu es bon. C'est le problème.*
→ **Je reste sur le terrain** — effets : vestiaire +, relation.meneche −1, outcome: refuse — *Il garde le fauteuil vide. Il le filme vide, le dimanche suivant ; c'est une menace.*
Variante `year < 2003` : « Juste une question, hors micro : Radio Tribune a une heure le dimanche soir, de dix à onze, et un micro qui ne sert à rien. Vous jugez, ou vous jouez ? » — mêmes sorties.
**Traces** : consultant · **Réactions déclenchées** : — · **Lu plus tard par** : jp.consultant.aulard, une.fin.samedi_dimanche, fin jp_consultant, ch. 02 (Vence), § 10.4, § 10.6

### SCÈNE jp.consultant.aulard  —  La télé éteinte
**Rôle** : joueur · **Intrigue** : jp.consultant · **Étape** : 2/4 · **Moment** : [1,3] · **Lieu** : le bureau d'Aulard, une télé éteinte dans un coin, Josiane qui vient de sortir · **Conditions** : `flag('consultant')`
**AULARD** *(président — noir — il pointe la télé éteinte du menton)*
« Tu juges mes joueurs le dimanche, et j'ai pas le temps de regarder, mais Josiane me raconte ; tu arrêtes, ou tu continues et tu ne joues plus le samedi ? »
← **J'arrête** — effets : direction ++, caisse −, clear: consultant — *Tu arrêtes. Ménèche l'annonce à l'antenne ; il le dit deux fois, avec ton nom.*
→ **Je continue** — effets : direction −−, tribunes ++, set: consultant_assume — *Tu continues. Tu joues moins. Tu juges mieux.*
**Traces** : consultant_assume (sans Almanach) · **Réactions déclenchées** : co.re.josiane_a_lu (∃) · **Lu plus tard par** : ch. 02 (Aulard : « tu jugeais mes joueurs »), jp.consultant.dimanche

### SCÈNE jp.consultant.vukic  —  Une fois sur deux
**Rôle** : joueur · **Intrigue** : jp.consultant · **Étape** : 3/4 · **Moment** : [1,4] · **Lieu** : le vestiaire vide, Vukić avec son cahier, une page de tes phrases du dimanche · **Conditions** : `flag('consultant')`
**VUKIĆ** *(entraîneur adjoint — neutre — il lit une de tes phrases à voix haute, sans intonation)*
« Je te le dis parce que personne ne te le dira : je note ce que tu dis à la télé, et tu as raison une fois sur deux, c'est beaucoup. Tu me montres tes notes à toi, ou tu gardes ça pour l'antenne ? »
← **Je te les montre** — effets : relation.vukic +1, vestiaire +, set: notes_partagees — *Vous comparez. Vous êtes d'accord une fois sur deux ; c'est beaucoup.*
→ **Pour l'antenne** — effets : relation.vukic −1, tribunes + — *Il ferme le cahier. Il regarde quand même, chaque dimanche ; il prend des notes sur toi.*
**Traces** : notes_partagees (« {annee} : {prenom} {nom} et Vukić ont comparé leurs notes. D'accord une fois sur deux. ») · **Réactions déclenchées** : — · **Lu plus tard par** : objectif `fin_passeur`, § 10.4 (variante « une fois sur deux, c'est beaucoup »), ch. 11 (Vukić adjoint : le cahier à deux mains)

### SCÈNE jp.consultant.dimanche  —  Trop bas
**Rôle** : joueur · **Intrigue** : jp.consultant · **Étape** : 4/4 · **Moment** : [2,6] · **Lieu** : le plateau, en direct, la fin d'émission, Vence avec le micro, la régie qui compte · **Conditions** : `flag('consultant')`
**VENCE** *(Télé-Stade — neutre — elle tend le micro, elle regarde la régie, pas toi)*
« On est en direct, et vous venez de dire que votre propre coach « joue trop bas », c'est passé. Un mot pour lui, ou un mot pour vous ? »
← **Pour lui : pardon** — effets : direction +, tribunes −, parole +1 — *Tu dis pardon. Il l'entend. Il ne te met pas samedi ; c'est sa réponse.*
→ **Pour moi : j'assume** — effets : tribunes ++, direction −−, set: consultant_assume, outcome: accepte — *Tu assumes. Le Carrefour t'attend avec un fauteuil ; il est confortable.*
Variante `flag('notes_partagees')` : « On est en direct, et votre coach vient de dire, dans l'autre studio, qu'il était d'accord avec vous « une fois sur deux ». Vous répondez, ou vous le laissez conclure ? » — ← **Je le laisse conclure** — vestiaire +, relation.vukic +1 — *Il conclut. Il est bon aussi ; c'est le problème, à deux.* · → **Je réponds** — tribunes ++, relation.vukic −1 — *Tu réponds. La régie coupe ; trop tard.*
**Traces** : consultant_assume · **Réactions déclenchées** : co.re.vence_direct (ch. 02) · **Lu plus tard par** : fin jp_consultant (Carrefour), ch. 02 (Vence : `plateau_offert`), ch. 20
**Épilogue** : par abandon, `consultant` reste (le fauteuil suit le joueur, pas le club) ; ligne « {annee} : {nom} jugeait le dimanche. Le samedi, on le jugeait. »

### 6.18 INTRIGUE jp.derniere_selection  —  Une dernière fois en bleu cobalt
**Logline** : Legruet te prend pour le vestiaire, plus pour les jambes. · **Synopsis** : Une dernière liste, à trente-deux ou trente-trois ans ; Legruet le dit sans détour : c'est pour transmettre. Fauvel te redonne la chambre du plus vieux, ou tu dors avec les jeunes et tu leur racontes 1990 à sa place. Sabatier, médecin des Cobalts, propose dix minutes du dernier match ; le genou a fait le voyage. Léa a vu la caméra sur ta bouche pendant l'hymne : tu regardais le sol, ou 1990.
**Rôle(s)** : joueur · **Postulat(s)** : fin_de_contrat ("0"), binational ("2+"), capitaine_dechu ("1", « un capitaine de D2 dans la liste ? ») · **Porteur** : legruet · **Cast** : legruet, fauvel, sabatier, lea, mbako · **Thème** : instances
**Saisons** : "0", "2+" · **Conditions d'entrée** : `(flag('international') || gauges.tribunes >= 65) && age >= 31` · **Exclusions** : `selection_refusee` posée deux fois · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `y_va` → `adieu_cobalt` (« {annee} : la dernière sélection de {prenom} {nom}. Pour le vestiaire, a dit Legruet. ») → ch. 14 (Fauvel : « tu es venu pour le vestiaire »), une.fin.dernier_cobalt, fin jp_siffle (plus), § 10.7 · `refuse` → `selection_refusee` (∃) → ch. 02 (Legruet −1), ch. 14 · `ne_joue_pas` → `adieu_banc` → ch. 14 (« vous avez regardé votre dernier match »)
**Séquencier** : legruet (ouverture ; absorbe `jp.corps.derniere_liste` ∃) → fauvel [in 1,2] → sabatier [in 1,3] → hymne [in 0,1].

### SCÈNE jp.derniere.legruet  —  Pour le vestiaire
**Rôle** : joueur · **Intrigue** : jp.derniere_selection · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : le secrétariat, le téléphone, Josiane qui tend le combiné avec le même regard que la première fois · **Conditions** : —
**LEGRUET** *(président de la Fédération — neutre — une voix de Congrès, plus lente qu'avant)*
« Cher ami, c'est sans doute votre dernière liste, on verra ça après le Congrès pour la suite ; je vous prends pour le vestiaire, plus pour les jambes. Vous venez transmettre, ou vous laissez la place ? »
← **Je viens transmettre** — effets : vestiaire ++, tribunes +, set: adieu_cobalt, outcome: y_va — *Tu viens. Tu ne joues pas ; tu parles ; on t'écoute. C'est nouveau.*
→ **Place aux jeunes** — effets : direction +, vestiaire +, relation.mbako +2, set: selection_refusee, outcome: refuse — *Tu laisses. Mbako prend ton numéro. Il le porte bien ; il te l'écrit, sans texte, une carte.*
Variante `flag('chambre_fauvel')` : Legruet ajoute « Fauvel a insisté, il dit que vous savez raconter 1990 » ; la gauche donne relation.fauvel +1.
**Traces** : adieu_cobalt, selection_refusee (∃) · **Réactions déclenchées** : jp.re.aulard_cheville (§ 7, variante « ta dernière cheville ») · **Lu plus tard par** : jp.derniere.fauvel, une.fin.dernier_cobalt, ch. 02, ch. 14, § 10.7

### SCÈNE jp.derniere.fauvel  —  La chambre du plus vieux
**Rôle** : joueur · **Intrigue** : jp.derniere_selection · **Étape** : 2/4 · **Moment** : [1,2] · **Lieu** : le hall de l'hôtel des Cobalts, Fauvel avec deux clés, la même armoire qu'en 1990 · **Conditions** : `flag('adieu_cobalt')`
**FAUVEL** *(capitaine des Cobalts, ou ancien capitaine devenu consultant du stage — sourire — il te tend une clé, il garde l'autre)*
« On est un groupe, pas une liste, et le groupe a un vieux de plus, c'est toi ; la chambre du plus vieux, c'est la mienne, encore. Tu la reprends, ou tu dors avec les jeunes ? »
← **Avec toi, comme avant** — effets : vestiaire ++, relation.fauvel +1 — *Il ne raconte pas 1990. Tu le racontes à sa place ; il corrige un détail ; le poteau était à gauche.*
→ **Avec les jeunes** — effets : vestiaire +, relation.mbako +1, set: raconte_1990 — *Tu dors avec les jeunes. Ils ne dorment pas. Tu leur racontes 1990 ; tu l'as bien retenu.*
**Traces** : raconte_1990 (« {annee} : {prenom} {nom} a raconté 1990 aux jeunes des Cobalts. Le poteau était à gauche. ») · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 14 (Fauvel : « tu as raconté 1990 à ma place »), ch. 15 (Fauvel président du syndicat, 2006 : « on est un groupe »), ch. 01 (Fauvel, fiche à écrire : retrouvailles)

### SCÈNE jp.derniere.sabatier  —  Dix minutes
**Rôle** : joueur · **Intrigue** : jp.derniere_selection · **Étape** : 3/4 · **Moment** : [1,3] · **Lieu** : le vestiaire des Cobalts, le dernier match du stage, Sabatier médecin de la sélection, une table qui n'est pas la sienne · **Conditions** : `flag('adieu_cobalt') && year <= 2010`
**SABATIER** *(médecin des Cobalts — neutre — il tapote la table de la Fédération, elle est plus dure que la sienne)*
« Ton genou a fait le voyage, et ça reste entre la table et moi, mais la Fédération a une table aussi. Tu joues les dix dernières minutes du dernier match, ou tu regardes ? »
← **Dix minutes** — effets : tribunes +++, rand: [{p: 0.3, set: genou_grave}, {}] — *Tu rentres. Le stade se lève. Le genou aussi, ou pas.*
→ **Je regarde** — effets : vestiaire +, direction +, set: adieu_banc, outcome: ne_joue_pas — *Tu regardes. Fauvel te fait monter sur le podium quand même ; tu as le maillot, pas la sueur.*
Variante `year > 2010` : le locuteur devient **ROUVIER** *(kiné des Cobalts)* : « Respire. Encore. Le genou a fait le voyage, et la Fédération a une table aussi, la mienne ; dix minutes, ou tu regardes ? » — mêmes sorties, la gauche a `p: 0.2`.
**Traces** : adieu_banc, genou_grave · **Réactions déclenchées** : — (drame possible) · **Lu plus tard par** : ch. 14 (« vous avez regardé votre dernier match »), une.fin.dernier_mot (si `genou_grave`), fin jp_croises

### SCÈNE jp.derniere.hymne  —  Le sol, ou 1990
**Rôle** : joueur · **Intrigue** : jp.derniere_selection · **Étape** : 4/4 · **Moment** : [0,1] · **Lieu** : la zone mixte, Léa, une capture d'écran : ta bouche pendant l'hymne · **Conditions** : `flag('adieu_cobalt')`
**LÉA** *(journaliste — neutre — elle te montre la capture, la caméra était sur toi, pas sur le drapeau)*
« Vous confirmez ? Vous avez chanté l'hymne en regardant le sol, la caméra était sur vous. Un mot sur ce que vous regardiez, ou pas ? »
← **Le sol, c'est tout** — effets : tribunes +, relation.lea +1 — *Elle écrit « il regardait le sol ». C'est vrai ; ça suffit.*
→ **Je regardais 1990** — effets : tribunes ++, direction −, set: hymne_1990 — *Elle écrit 1990. Fauvel lit. Il t'appelle ; il ne dit rien ; il raccroche ; c'est un merci.*
Variante `flag('raconte_1990')` : « Vous confirmez ? Les jeunes disent que vous leur avez raconté 1990 dans la chambre ; et pendant l'hymne, vous regardiez le sol. Vous regardiez 1990 ? » — mêmes sorties, la droite donne relation.fauvel +1.
**Traces** : hymne_1990 (« {annee} : pendant son dernier hymne, {prenom} {nom} regardait le sol. Il a dit : 1990. ») · **Réactions déclenchées** : co.re.lea_confirme (∃) · **Lu plus tard par** : ch. 14 (l'hymne ; Fauvel), § 10.7, ch. 20 (« IL REGARDAIT 1990 »)
**Épilogue** : ligne « {annee} : la dernière liste de {nom}. Pour le vestiaire. »

### 6.19 INTRIGUE jp.vestiaire_porte  —  Le vestiaire te porte
**Logline** : Le vestiaire a signé une pétition pour ta prolongation ; le président l'a reçue par fax. · **Synopsis** : Vingt-deux noms, Vecchio deux fois. Bréhaut la fait passer par le fax de Josiane, qui la met sur le bureau ou dessous. Aulard « n'a pas deux minutes » ; il les prend, ou pas. La Gazette Rose l'a en photo ; Léa te demande si elle publie les noms. F2 et F3 lisent `petition_portee` : un vestiaire qui écrit, ça se prolonge.
**Rôle(s)** : joueur · **Postulat(s)** : fin_de_contrat ("0"), retour_croises ("0"), capitaine_dechu (variante « le capitaine porte le vestiaire ») · **Porteur** : brehaut · **Cast** : brehaut, vecchio, aulard, josiane, lea · **Thème** : vestiaire
**Saisons** : "0" · **Conditions d'entrée** : `gauges.vestiaire >= 65` · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `porte` → `petition_portee` (« {annee} : vingt-deux noms par fax pour {prenom} {nom}. Le président « n'a pas le temps ». ») → jp.fin.f2_offre, jp.fin.f2b_quinzieme, jp.fin.f3_juin (variante), une.fin.vestiaire, ch. 01 (Bréhaut `faveur_lettre`) · `retire` → `petition_retiree` → ch. 01 (Bréhaut : « tu l'as déchirée »), fin jp_porteparole (plus) · `presse` → `petition_presse` → ch. 20 (Gazette), ch. 02 (Aulard −1)
**Séquencier** : petition (ouverture) → josiane [in 0,1] → aulard [in 1,3] → presse [in 1,4].

### SCÈNE jp.porte.petition  —  Vingt-deux noms
**Rôle** : joueur · **Intrigue** : jp.vestiaire_porte · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : le vestiaire, une feuille avec vingt-deux noms, Vecchio qui vérifie qu'il a bien signé deux fois · **Conditions** : —
**BRÉHAUT** *(capitaine — sourire — il tient la feuille à deux mains, comme un maillot)*
« Le groupe vit bien, et le groupe a signé pour que tu restes, vingt-deux noms, Vecchio a signé deux fois. On l'envoie au président, ou tu la déchires parce que ça ne se fait pas ? »
← **Envoyez-la** — effets : vestiaire ++, direction −, set: petition_portee, outcome: porte — *Elle part par fax. Josiane la classe sous « pétitions » ; c'est un dossier mince.*
→ **Déchire-la** — effets : vestiaire −, direction +, set: petition_retiree, outcome: retire — *Il la déchire. Il garde un morceau ; celui avec ta signature ; tu n'avais pas signé, il l'a imitée.*
Variante `flag('capitaine') && flag('geant_dechu')` : « Le groupe vit bien, enfin, le groupe c'est dix gamins et toi, et les gamins ont signé pour que le capitaine garde son salaire ; tu l'envoies à Vialat, ou tu la déchires ? » — mêmes sorties.
**Traces** : petition_portee, petition_retiree · **Réactions déclenchées** : jp.re.vecchio_encore_une (§ 7, variante « j'ai signé deux fois ») · **Lu plus tard par** : jp.porte.josiane, jp.fin.f2_offre, jp.fin.f3_juin, une.fin.vestiaire, ch. 01

### SCÈNE jp.porte.josiane  —  Dessus ou dessous
**Rôle** : joueur · **Intrigue** : jp.vestiaire_porte · **Étape** : 2/4 · **Moment** : [0,1] · **Lieu** : le secrétariat, le fax, la pétition encore tiède · **Conditions** : `flag('petition_portee')`
**JOSIANE** *(secrétaire — neutre — elle tient la feuille par un coin, elle la lit quand même)*
« J'en ai vu passer, vous savez, mais une pétition par fax, avec vingt-deux noms et deux fois Vecchio, jamais ; je la mets sur le bureau du président, ou dessous ? »
← **Dessus** — effets : direction +, relation.josiane +1 — *Elle la met dessus. Il la lit en deux minutes ; il dit qu'il n'a pas deux minutes ; il les a prises.*
→ **Dessous, pour plus tard** — effets : direction −, set: petition_retard — *Elle la met dessous. Il la trouve en juin. C'est tard, ou c'est le bon moment.*
**Traces** : petition_retard (sans Almanach) · **Réactions déclenchées** : co.re.josiane_a_lu (∃) · **Lu plus tard par** : jp.porte.aulard (variante), jp.fin.f3_juin (variante « trouvée en juin »)

### SCÈNE jp.porte.aulard  —  Deux minutes
**Rôle** : joueur · **Intrigue** : jp.vestiaire_porte · **Étape** : 3/4 · **Moment** : [1,3] · **Lieu** : le bureau d'Aulard, la pétition posée à l'envers sur le sous-main · **Conditions** : `flag('petition_portee') && !flag('petition_retard')`
**AULARD** *(président — neutre — il retourne la feuille, il la retourne encore, il ne lit pas)*
« Une pétition, ça se lit en deux minutes, et j'ai pas deux minutes, j'ai un empire ; je la lis devant toi, ou tu me résumes ? »
← **Lisez-la** — effets : direction +, vestiaire + — *Il lit. Il compte les noms. Il en manque un : le sien.*
→ **Je résume : ils m'aiment** — effets : direction −, tribunes + — *Il dit « moi aussi ». Il ne prolonge pas ; il aime autrement.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : jp.fin.f2_offre (variante `petition_portee`)

### SCÈNE jp.porte.presse  —  Avec les noms
**Rôle** : joueur · **Intrigue** : jp.vestiaire_porte · **Étape** : 4/4 · **Moment** : [1,4] · **Lieu** : le café, Léa, une photo de La Gazette Rose où l'on reconnaît le fax · **Conditions** : `flag('petition_portee')`
**LÉA** *(journaliste — neutre — elle pose la photo de la Gazette entre vous, elle ne l'aime pas)*
« Vous confirmez ? La pétition a fuité, La Gazette Rose l'a en photo ; je la publie dans L'Écho avec les noms, ou sans ? »
← **Avec les noms** — effets : tribunes ++, direction −−, set: petition_presse, outcome: presse — *Elle publie. Le président lit les noms dans le journal ; il n'a pas le temps, mais il lit les journaux.*
→ **Sans, ou pas du tout** — effets : direction +, relation.lea −1 — *Elle ne publie pas. La Gazette, si. Sans les noms ; avec le tien, en gros.*
**Traces** : petition_presse (« {annee} : la pétition du vestiaire dans L'Écho, avec les noms. {prenom} {nom} a confirmé. ») · **Réactions déclenchées** : co.re.lea_confirme (∃) · **Lu plus tard par** : ch. 20 (Gazette : « VINGT-DEUX NOMS »), ch. 02 (Aulard −1 : « tu as donné les noms »)
**Épilogue** : ligne « {annee} : le vestiaire a écrit pour {nom}. Vecchio deux fois. »

### 6.20 INTRIGUE jp.dembo_rival  —  Donne-moi le ballon
**Logline** : Dembo, avant-centre, veut le ballon, la Une et dormir tard ; il a été vendu à dix-sept ans et ne l'a pas digéré. · **Synopsis** : Il te demande le ballon dans la surface ; Léa a une photo de yacht un lundi de pluie ; dans le bus, une nuit, il te parle de ses dix-sept ans, une seule fois ; à la 88e, un partout, Bréhaut demande qui tire. C'est le coéquipier rival de la pépite : le seul qui te chambre par affection, et qui n'a pas d'autre façon.
**Rôle(s)** : joueur · **Postulat(s)** : pepite ("0"), binational ("0"), banc_dore (variante « vieux Dembo », 42 ans) · **Porteur** : dembo · **Cast** : dembo, lea, brehaut, fardelli · **Thème** : vestiaire
**Saisons** : "0" · **Conditions d'entrée** : `chars.dembo.statut == 'club'` · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `passe` → `dembo_servi` (« {annee} : {prenom} {nom} a donné le ballon à Dembo. Il s'est occupé du reste. ») → ch. 01 (Dembo : retrouvailles), ch. 11 (la star qui ne défend pas : « tu lui faisais la passe »), fin jp_porteparole (plus), jp.te.dembo · `garde` → `dembo_rival` → ch. 11 (les huit kilos), ch. 90 (Nemesis doux) · `yacht` → `yacht_dembo` → ch. 20 (« RÉCUPÉRATION ACTIVE »), ch. 12 (Dembo à 60 millions)
**Séquencier** : ballon (ouverture) → yacht [in 1,4] (absorbe `jp.presse.yacht` ∃ et `jp.vestiaire.yacht` ∃) → dix_sept [in 2,6] → penalty [in 1,4], en temps fort.

### SCÈNE jp.dembo.ballon  —  Le reste
**Rôle** : joueur · **Intrigue** : jp.dembo_rival · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : le rond central, à l'entraînement, Dembo avec le ballon sous le pied, il ne le bouge pas · **Conditions** : —
**DEMBO** *(avant-centre — neutre — il fait rouler le ballon sous la semelle, un centimètre, pas plus)*
« Donne-moi le ballon, je m'occupe du reste, c'est simple, et le reste c'est la Une et la prime. Tu me le donnes dans la surface, ou tu tires toi-même ? »
← **Je te le donne** — effets : vestiaire ++, tribunes −, relation.dembo +1, set: dembo_servi, outcome: passe — *Tu donnes. Il marque. Il montre du doigt ; pas toi ; le ciel.*
→ **Je tire** — effets : tribunes ++, vestiaire −, relation.dembo −1, set: dembo_rival, outcome: garde — *Tu tires. Tu marques, ou pas. Il ne te regarde plus dans la surface ; il regarde le gardien.*
Variante `age >= 40` de Dembo (banc_dore) : « Donne-moi le ballon, je m'occupe du reste, je disais ça à vingt ans ; à quarante-deux, je m'occupe de la moitié. Tu me la donnes quand même, ou tu joues avec le jeune ? » — mêmes sorties, la gauche donne relation.dembo +2.
**Traces** : dembo_servi, dembo_rival · **Réactions déclenchées** : — · **Lu plus tard par** : jp.dembo.penalty, jp.te.dembo (§ 9), ch. 01, ch. 11, ch. 90

### SCÈNE jp.dembo.yacht  —  Récupération active
**Rôle** : joueur · **Intrigue** : jp.dembo_rival · **Étape** : 2/4 · **Moment** : [1,4] · **Lieu** : le bureau de presse, une photo de yacht, un lundi, il pleuvait sur le terrain · **Conditions** : —
**LÉA** *(attachée de presse — neutre — elle pose la photo, elle a déjà le titre de la Gazette dans la tête)*
« Vous confirmez ? Vous et Dembo sur un yacht, lundi, pendant que l'équipe courait sous la pluie ; il dit que c'était « une récupération active ». Vous confirmez, ou vous rentrez courir ? »
← **Récupération active** — effets : tribunes −−, vestiaire −, caisse +, set: yacht_dembo — *Tu confirmes. Le mot fait rire tout le pays ; il reste ; on le dit encore en 2040.*
→ **Je rentre courir** — effets : tribunes +, vestiaire +, relation.dembo −1 — *Tu cours. Seul. Dembo dort ; il dort bien.*
**Traces** : yacht_dembo (« {annee} : {prenom} {nom} et Dembo sur un yacht, un lundi de pluie. « Récupération active. » ») · **Réactions déclenchées** : co.re.lea_confirme (∃) · **Lu plus tard par** : ch. 20 (Gazette : « RÉCUPÉRATION ACTIVE »), ch. 12 (Dembo à 60 millions d'Al-Dorado : « le yacht »), ch. 31 (anecdote : le mot)

### SCÈNE jp.dembo.dix_sept  —  Dix-sept ans
**Rôle** : joueur · **Intrigue** : jp.dembo_rival · **Étape** : 3/4 · **Moment** : [2,6] · **Lieu** : le bus, la nuit, un retour de déplacement, Dembo qui ne dort pas pour une fois · **Conditions** : —
**DEMBO** *(avant-centre — neutre — il regarde la vitre, il te parle dans le reflet)*
« Donne-moi le ballon, je disais ça à dix-sept ans aussi, et à dix-sept ans on m'a vendu, ma mère n'a pas lu, personne n'a lu. Tu lis tes contrats, toi, ou tu as quelqu'un ? »
← **Je les lis** — effets : relation.dembo +2, direction +, set: contrats_lus — *Il dit « bien ». Il dort. C'est la seule fois où il te parle de ça.*
→ **J'ai quelqu'un** — effets : relation.dembo −1, caisse + — *Il se tourne vers la vitre. Il ne dort pas. Il regarde la route ; elle est longue.*
Variante `flag('page_lue')` : Dembo ajoute « on m'a dit que tu avais lu la page deux, c'est déjà plus que moi » ; la gauche donne relation.dembo +2 sans autre effet.
**Traces** : contrats_lus (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 01 (Dembo, retrouvailles sourire : « tu lisais tes contrats »), § 10.5 (« tu lis les contrats »)

### SCÈNE jp.dembo.penalty  —  Deux qui veulent
**Rôle** : joueur · **Intrigue** : jp.dembo_rival · **Étape** : 4/4 · **Moment** : [1,4], en temps fort de Carte Match · **Lieu** : le point de penalty, 88e, un partout, Dembo et toi à un mètre du ballon · **Conditions** : `chars.brehaut.statut == 'club'`
**BRÉHAUT** *(capitaine — neutre — il tient le ballon, il regarde les deux, il ne le pose pas)*
« Le groupe vit bien quand on sait qui tire, et là il y en a deux qui veulent, ce n'est pas bon signe. Dembo, ou toi ? »
← **Dembo** — effets : vestiaire +, relation.dembo +1, rand: [{p: 0.7, tribunes +}, {tribunes −}] — *Il tire. Il s'occupe du reste, ou pas.*
→ **Moi** — effets : relation.dembo −1, rand: [{p: 0.6, tribunes ++}, {tribunes −−, vestiaire −}] — *Tu tires. Il regarde ailleurs pendant la course d'élan ; il regarde après.*
Variante `flag('dembo_servi')` : un bouton — **Dembo, comme d'habitude** — vestiaire +, relation.dembo +1, rand: [{p: 0.75, tribunes +}, {tribunes −}] — *Il tire. Il te montre du doigt cette fois ; pas le ciel.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : temps fort jp.te.dembo (§ 9)
**Épilogue** : ligne « {annee} : Dembo et {nom}, un ballon pour deux. Il s'est occupé du reste. »

### 6.21 INTRIGUE co.pharmacie (variante joueur)  —  La pharmacie du club
**Logline** : De la créatine. Légal. Enfin, encore. · **Synopsis** : Sabatier propose ; Rouvier voit l'armoire, plus grande que le vestiaire, et ne peut rien dire ; le contrôleur cherche le bon bâtiment pendant quatre-vingt-dix minutes ; le flacon B est « non conforme » et le Doc a très envie de vacances. La variante victime est le drame de l'intrigue : ce n'était pas la créatine, tu ne le savais pas ; Rouvier témoigne. Le chapitre 11 écrit le côté banc ; les scènes ci-dessous sont celles du joueur.
**Rôle(s)** : joueur, entraîneur (ch. 11) · **Postulat(s)** : pepite ("0", `if: relation.sabatier >= 1`), fin_de_contrat ("1", variante « un coup de pouce pour finir »), retour_croises ("0", « pour revenir plus vite ») · **Porteur** : sabatier · **Cast** : sabatier, rouvier, meneche, camille · **Thème** : corps
**Saisons** : "0", "1" · **Conditions d'entrée** : `chars.sabatier.statut == 'club'` · **Rejouabilité** : jamais · **[drame]** pour la variante victime
**Issues** → **Traces** → **Qui les lit** : `flacon` → `flacon_b` (« {annee} : le flacon B de {prenom} {nom}. Deux ans. Le Doc avait très envie de vacances. ») → ch. 11 (commission de discipline), ch. 14 (le joueur suspendu dans la liste), ch. 15 (la commission antidopage, Sabatier témoin), ch. 30 (fin *Le flacon B*, postulat `le_revenant`), une.pepite.flacon · `propre` → `pharmacie_propre` (« {annee} : {prenom} {nom} a bu de l'eau. Le Doc a rangé le flacon. ») → ch. 02 (Sabatier −1), ch. 14 · `victime` → `flacon_b`, `dope_a_son_insu` → ch. 30 (fin *Le flacon B* variante « à son insu »), ch. 15 (Rouvier témoin)
**Séquencier** : creatine (ouverture ; absorbe `jp.scandale.vitamines` ∃) → armoire [in 1,3] → controleur [in 2,6] (`vitamines`) → flacon_b [in 1,2] (`flacon_b` armé) ; victime (S+1, [2,6], `vitamines && rand`) remplace flacon_b **[drame]**.

### SCÈNE jp.pharmacie.creatine  —  Légal, encore
**Rôle** : joueur · **Intrigue** : co.pharmacie · **Étape** : 1/5 · **Moment** : ouverture tirée · **Lieu** : la salle de soins, un flacon blanc sans étiquette, la table · **Conditions** : —
**SABATIER** *(médecin — neutre — il fait rouler le flacon sur la table vers toi, il ne le pousse pas)*
« De la créatine, légal, enfin, encore, et ça reste entre la table et moi ; tu cours jusqu'à la quatre-vingt-quinzième sans souffler. Tu avales, ou tu bois de l'eau ? »
← **J'avale** — effets : force +4, vestiaire +, set: vitamines, relation.sabatier +1 — *Il range le flacon dans ta poche. L'air de rien.*
→ **De l'eau** — effets : force −1, vestiaire +, set: pharmacie_propre, relation.sabatier −1, outcome: propre — *Il range le flacon dans le tiroir. Il te regarde autrement ; moins.*
Variante `age >= 31` : « Un coup de pouce pour finir, légal, enfin, encore, et ça reste entre la table et moi ; à ton âge, on ne demande pas, on finit. Tu avales, ou tu finis sans ? » · Variante `flag('genou_opere')` : « Pour revenir plus vite, légal, enfin, encore ; six mois deviennent quatre, et ça reste entre la table et moi. Tu avales, ou tu fais les six ? »
**Traces** : vitamines (∃), pharmacie_propre · **Réactions déclenchées** : — · **Lu plus tard par** : jp.pharmacie.armoire, jp.pharmacie.controleur, ch. 02, ch. 14

### SCÈNE jp.pharmacie.armoire  —  Plus grande que le vestiaire
**Rôle** : joueur · **Intrigue** : co.pharmacie · **Étape** : 2/5 · **Moment** : [1,3] · **Lieu** : la salle de kiné, la porte de l'armoire à pharmacie entrouverte, Rouvier qui la referme du pied · **Conditions** : `flag('vitamines')`
**ROUVIER** *(kiné — neutre — elle parle en regardant l'armoire, pas toi)*
« Respire. Encore. Je vois l'armoire tous les matins, elle est plus grande que le vestiaire, et je ne peux rien dire ; je le dis quand même : arrête le flacon. Tu arrêtes, ou tu attends le contrôle ? »
← **J'arrête** — effets : force −2, clear: vitamines, relation.rouvier +1, set: flacon_arrete — *Tu arrêtes. Le contrôle vient ; il ne trouve rien ; il trouve quelqu'un d'autre.*
→ **Jusqu'au contrôle** — effets : force +1, relation.rouvier −1 — *Elle ne dit plus rien. Elle te fait respirer ; c'est tout ce qu'elle peut.*
**Traces** : flacon_arrete (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : jp.pharmacie.controleur (exclusion), ch. 01 (Rouvier : « tu as arrêté quand je l'ai dit »), objectif `croises_sans_piqure`

### SCÈNE jp.pharmacie.controleur  —  Quatre-vingt-dix minutes
**Rôle** : joueur · **Intrigue** : co.pharmacie · **Étape** : 3/5 · **Moment** : [2,6] · **Lieu** : le couloir, Sabatier qui court, ce qu'il ne fait jamais · **Conditions** : `flag('vitamines') && !flag('flacon_arrete')` (variante de `co.sabatier.faveur_controle`, ch. 01, si `relation.sabatier >= 3`)
**SABATIER** *(médecin — neutre — essoufflé, il parle vite, il regarde la porte de l'accueil)*
« Le contrôleur est à l'accueil, il cherche le bon bâtiment, il a quatre-vingt-dix minutes ; ça reste entre la table et moi. Tu bois trois litres d'eau, ou tu vas le voir tout de suite ? »
← **Trois litres** — effets : direction +, parole −1, rand: [{p: 0.5, set: flacon_b}, {}] — *Tu bois. Le contrôleur trouve le bâtiment à la quatre-vingt-neuvième minute. Il est patient.*
→ **Je vais le voir** — effets : direction −, tribunes +, rand: [{p: 0.7, set: flacon_b}, {set: controle_negatif}] — *Tu y vas. Le flacon B dit ce qu'il dit.*
**Traces** : flacon_b (armé), controle_negatif (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : jp.pharmacie.flacon_b, ch. 15 (Sabatier témoin : « quatre-vingt-dix minutes »), ch. 02 (Sabatier : la faveur du contrôle)

### SCÈNE jp.pharmacie.flacon_b  —  Non conforme
**Rôle** : joueur · **Intrigue** : co.pharmacie · **Étape** : 4/5 · **Moment** : [1,2] · **Lieu** : la zone mixte, Ménèche, un communiqué du laboratoire, une phrase soulignée · **Conditions** : `flag('flacon_b')` (absorbe `jp.scandale.controle_positif` ∃)
**MÉNÈCHE** *(chroniqueur — neutre — il tient le communiqué comme un menu)*
« Juste une question, hors micro : le flacon B est « non conforme », et votre médecin a soudain très envie de vacances. Vous contestez le laboratoire, ou vous acceptez la sanction ? »
← **Je conteste** — effets : direction −, caisse −, tribunes + — *Tu contestes. Le Tribunal du Sport siège loin et répond tard ; il répond « deux ans ».*
→ **J'accepte** — effets : vestiaire −−, force −3, set: flacon_b, outcome: flacon — *Deux ans. Le Carrefour t'attend avec un postulat qu'on ne souhaite à personne : *Le revenant*.*
**Traces** : flacon_b · **Réactions déclenchées** : co.re.meneche_no_comment (∃) · **Lu plus tard par** : fin jp_flacon_b, § 10.8, ch. 11, ch. 14, ch. 15, ch. 30, une.pepite.flacon

### SCÈNE jp.pharmacie.victime  —  Ce n'était pas la créatine  **[drame]**
**Rôle** : joueur · **Intrigue** : co.pharmacie · **Étape** : 5/5 (remplace flacon_b) · **Moment** : saison suivante, [2,6] · **Lieu** : la salle de kiné, la porte fermée, Rouvier avec une feuille d'analyse qu'elle a lue trois fois · **Conditions** : `flag('vitamines') && rand < 0.15 && season >= 1`
**ROUVIER** *(kiné — neutre — elle ne dit pas « respire » ; elle pose la feuille sur la table, à l'endroit)*
« Ce n'est pas la créatine, c'est autre chose, dans les « vitamines » du Doc, et tu ne le savais pas ; je le sais depuis ce matin. »
**Une sortie** — **Je ne le savais pas** — effets : set: flacon_b, set: dope_a_son_insu, relation.sabatier −3 — *Tu ne le savais pas. La commission ne fait pas la différence. Rouvier, si ; elle témoigne ; ça compte plus tard.*
**Traces** : flacon_b, dope_a_son_insu (« {annee} : {prenom} {nom} ne savait pas ce qu'il y avait dans le flacon. Rouvier l'a dit à la commission. ») · **Réactions déclenchées** : — (jamais après un drame) · **Lu plus tard par** : fin jp_flacon_b (epitaph_plus), ch. 15 (Rouvier et Sabatier témoins), ch. 01 (Sabatier, trahison −3), ch. 30 (`le_revenant`, variante « à son insu »)
**Épilogue** : par abandon, `vitamines` est effacé ; ligne « {annee} : la pharmacie de {ville}. On n'a pas su ce qu'il y avait dedans ; on a su qu'il y en avait. »

### 6.22 INTRIGUE jp.pari  —  Le pari
**Logline** : Une petite mise sur ton propre match, juste le nombre de corners. Personne ne saura. · **Synopsis** : Tony, ton pote d'enfance, appelle ; Fardelli a un pote bookmaker dans un bar d'hôtel avec un micro sous la table ; La Plume glisse un message sous ta porte en saison suivante ; Amsel vient à six heures du matin avec tout son temps ; Ménèche offre trois minutes en prime time. La satire du pari : jamais un mode d'emploi, toujours un bar d'hôtel.
**Rôle(s)** : joueur · **Postulat(s)** : fin_de_contrat ("1", `caisse < 45`), pepite ("2+"), banc_dore (variante paris asiatiques, `jp.banc_dore.s1_twist`), capitaine_dechu ("1", `caisse < 30`) · **Porteur** : « Tony, ton pote d'enfance » (voix ; porteur technique `fardelli`) · **Cast** : Tony, fardelli, la_plume, amsel, meneche · **Thème** : instances
**Saisons** : "1", "2+" · **Conditions d'entrée** : `gauges.caisse < 45 && season >= 1` · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `refuse` → `pari_refuse` → ch. 30 (trait Intègre), ch. 02 (Amsel : « vous étiez un témoin ») · `parie` → `pari` (∃ ; « {annee} : {prenom} {nom} a parié sur ses corners. Un bar d'hôtel a enregistré. ») → jp.pari.plume, fin jp_place14b (plus), une.fin.enregistrement, ch. 15, jp.te.corners · `double` → `pari_double` → fin jp_pari (ch. 30)
**Séquencier** : tony (ouverture ; absorbe `jp.scandale.pari` ∃) → fardelli [in 1,4] (`pari`) → plume (S+1, [1,6], `pari` ; absorbe `jp.scandale.la_plume` ∃) → brigade [in 1,3] (absorbe `jp.scandale.brigade_financiere` ∃) → plateau [in 1,4] (absorbe `jp.scandale.deballage_tv` ∃).

### SCÈNE jp.pari.tony  —  Juste les corners
**Rôle** : joueur · **Intrigue** : jp.pari · **Étape** : 1/5 · **Moment** : ouverture tirée · **Lieu** : le téléphone, le soir, une voix que tu n'as pas entendue depuis le collège · **Conditions** : —
**TONY** *(voix sans portrait — ton pote d'enfance, il parle comme si vous vous étiez vus hier)*
« Une petite mise sur ton propre match, juste le nombre de corners, personne ne saura, c'est moi qui te le dis. Une fois, ou jamais ? »
← **Une fois** — effets : caisse +, set: pisteur, set: pari, outcome: parie — *Tu ranges le téléphone, un peu vite.*
→ **Jamais** — effets : tribunes +, set: pari_refuse, outcome: refuse — *Tu raccroches. Tony rappelle deux ans plus tard ; il a un autre numéro.*
Variante `flag('pari_refuse')` (banc_dore : tu as déjà refusé l'émissaire) : « Une petite mise, et je sais que tu as déjà dit non à un type au désert, c'est pour ça que je t'appelle, moi, on se connaît. Une fois ? » — mêmes sorties.
**Traces** : pari (∃), pisteur (∃), pari_refuse · **Réactions déclenchées** : — · **Lu plus tard par** : jp.pari.fardelli, jp.pari.plume, jp.te.corners, ch. 02 (Amsel), ch. 30

### SCÈNE jp.pari.fardelli  —  Le bar d'hôtel
**Rôle** : joueur · **Intrigue** : jp.pari · **Étape** : 2/5 · **Moment** : [1,4], la veille d'un match · **Lieu** : le bar d'un hôtel, Fardelli, deux verres, une table dont on ne voit pas le dessous · **Conditions** : `flag('pari')` (absorbe `jp.scandale.pari_match` ∃)
**FARDELLI** *(agent — sourire — il parle bas, il ne baisse pas les yeux vers la table)*
« Un pote bookmaker mise gros si tu ranges ton match, mon ami, on parle d'argent ou d'amitié, là c'est de l'argent, beaucoup. Tu lèves le pied, ou tu joues pour gagner ? »
← **Je lève le pied** — effets : caisse ++, force −2, set: pari_double, relation.fardelli +1, outcome: double — *Il te glisse une enveloppe. Le bar a un micro sous la table ; tu ne le sais pas.*
→ **Je joue pour gagner** — effets : vestiaire +, tribunes +, relation.fardelli −1 — *Tu gagnes. Il perd. Il dit « là, on ne parle plus ».*
**Traces** : pari_double · **Réactions déclenchées** : jp.re.fardelli_on_ne_parle_plus (§ 7, après →) · **Lu plus tard par** : jp.pari.plume (variante « l'enveloppe »), fin jp_pari, ch. 02 (Fardelli : trahison −3)

### SCÈNE jp.pari.plume  —  Sous la porte
**Rôle** : joueur · **Intrigue** : jp.pari · **Étape** : 3/5 · **Moment** : saison suivante, [1,6] · **Lieu** : ta chambre d'hôtel, un message glissé sous la porte, tapé à la machine, sans signature, avec une plume dessinée · **Conditions** : `flag('pari')`
**LA PLUME** *(journaliste d'investigation, par écrit uniquement — neutre — le message tient sur une demi-page)*
« J'ai les documents, et un enregistrement d'un bar d'hôtel, votre voix, la date, le nombre de corners. Vous me parlez avant que je publie, ou vous laissez votre agent répondre ? »
← **Je vous parle** — effets : tribunes −, direction −, parole −2, set: plume_parle — *Tu parles. Elle écoute. Elle publie quand même ; avec ta version, en encadré.*
→ **Mon agent répond** — effets : parole −5, direction −−, relation.fardelli −1 — *Fardelli « ne connaît pas Tony ». Il connaît le bar.*
Variante `flag('corner_force')` (temps fort § 9) : « J'ai les documents, et le corner forcé de la soixante-onzième, on l'entend siffler sur l'enregistrement. Vous me parlez, ou votre agent ? » — mêmes sorties.
**Traces** : plume_parle (« {annee} : La Plume a écrit à {prenom} {nom}. Il a parlé ; elle a publié quand même, avec l'encadré. ») · **Réactions déclenchées** : — · **Lu plus tard par** : jp.pari.brigade, une.fin.enregistrement, ch. 02 (La Plume : « vous m'aviez parlé »), ch. 15

### SCÈNE jp.pari.brigade  —  Six heures du matin
**Rôle** : joueur · **Intrigue** : jp.pari · **Étape** : 4/5 · **Moment** : [1,3] · **Lieu** : le centre d'entraînement, six heures du matin, Amsel avec un dossier et un thermos · **Conditions** : `flag('pari')`
**AMSEL** *(procureure — neutre — elle verse un café dans le couvercle du thermos, elle te le tend)*
« Nous avons tout notre temps, monsieur {nom}, et vous avez un entraînement à neuf heures ; des paris anonymes sur vos corners, vos relevés, un enregistrement. Vous niez, ou vous coopérez ? »
← **Je nie** — effets : direction −−, tribunes −, clear: pari — *Elle note. Elle repart avec les relevés et un sourire poli ; elle a tout son temps.*
→ **Je coopère** — effets : caisse −−−, vestiaire +, direction −, clear: pari, set: temoin_amsel — *Tu coopères. Tu es un témoin, pas un dossier. Trois heures. Ça compte, plus tard.*
**Traces** : temoin_amsel (« {annee} : {prenom} {nom} a coopéré avec Amsel. Trois heures, un café, un témoin. ») · **Réactions déclenchées** : — · **Lu plus tard par** : fin jp_pari (epitaph_plus), ch. 02 (Amsel : le témoin), ch. 15 (le dossier des paris à l'instance), ch. 30 (`le_revenant`)

### SCÈNE jp.pari.plateau  —  Trois minutes
**Rôle** : joueur · **Intrigue** : jp.pari · **Étape** : 5/5 · **Moment** : [1,4] · **Lieu** : la zone mixte, Ménèche, une affiche d'émission avec ta tête et le mot « ENQUÊTE » · **Conditions** : `flag('plume_parle') || flag('temoin_amsel') || flag('pari')`
**MÉNÈCHE** *(chroniqueur, ou directeur d'antenne dès 2012 — neutre — il te montre l'affiche, il en est fier)*
« Juste une question, hors micro, enfin, à l'antenne : deux heures d'enquête sur vous dimanche, paris, enregistrement, cousin ; je vous offre trois minutes. Vous venez, ou vous boycottez ? »
← **Je viens** — effets : rand: [{p: 0.3, end: grand_deballage}, {tribunes −, direction −−, caisse +}] — *Trois minutes. C'est long, en direct.*
→ **Je boycotte** — effets : tribunes −−, direction −, vestiaire + — *Le fauteuil est vide. Il le filme.*
**Traces** : — · **Réactions déclenchées** : co.re.meneche_no_comment (∃) · **Lu plus tard par** : fin grand_deballage (ch. 30), ch. 02 (Ménèche : le dossier)
**Épilogue** : par abandon, `pari` reste (c'est un dossier, pas un club) ; ligne « {annee} : les corners de {nom}. Quelqu'un a compté. »

### 6.23 INTRIGUE co.derby (variante joueur)  —  Le derby
**Logline** : Le derby, c'est le seul match que la ville regarde deux fois. · **Synopsis** : Gégé veut te voir au local pour peindre le tifo ; Paulette a perdu le derby de cinquante et un quatre à zéro et s'en souvient mieux que des gagnés ; le lendemain, Camille lit L'Écho ; et si tu as changé de club, l'ancien coéquipier est en face : Karim en vert pour l'amateur, ou toi-même contre le club que tu as quitté. Partagée avec l'entraîneur (ch. 11) et le président (ch. 13).
**Rôle(s)** : joueur, joueur_amateur, entraîneur (ch. 11), président (ch. 13) · **Postulat(s)** : partagé, "1" · **Porteur** : gege · **Cast** : gege, paulette, camille, « Karim » (amateur) · **Thème** : tribune
**Saisons** : "1", "2+" · **Conditions d'entrée** : `world.rival_meme_division` · **Rejouabilité** : replay {after: 1, max: 3}
**Issues** → **Traces** → **Qui les lit** : `gagne` → `derby_gagne` (« {annee} : derby gagné. {prenom} {nom} a marqué, ou pas ; la ville s'en souvient. ») → ch. 01 (Gégé, Paulette), ch. 20 (« LA VALLÉE A UN PATRON »), ch. 30 (gm_annonce), ch. 90, objectif `croises_rejoues` · `perdu` → `derby_perdu` → idem, versant noir · `tete_haute` → lit `derby_tete_haute` (ch. 01)
**Séquencier** : semaine (ouverture) → match [in 1,2], en Carte Match → lendemain [in 0,1] → ancien (replay, `flag('parti_chez_rival') || flag('passe_a_montbeliac') || flag('carton_karim')`).

### SCÈNE co.derby.semaine  —  Jeudi, au local
**Rôle** : joueur | joueur_amateur · **Intrigue** : co.derby · **Étape** : 1/4 · **Moment** : ouverture tirée, la semaine du derby · **Lieu** : le local (ou le bar-tabac, amateur), la bâche du derby à moitié peinte · **Conditions** : —
**GÉGÉ** *(capo — neutre — un pinceau dans la main, il peint en te parlant)*
« La tribune n'oublie rien, et dimanche c'est le derby, le seul match qu'on regarde deux fois ; tu viens au local jeudi pour le tifo, ou tu restes concentré ? »
← **Jeudi, au local** — effets : tribunes ++, force −1, set: ami_ultras — *Tu peins. Tu as de la peinture sur les mains dimanche ; le rival la voit.*
→ **Concentré** — effets : force +1, tribunes − — *Tu ne viens pas. Le tifo est beau ; ton nom n'y est pas.*
Variante `plays() >= 1` (« encore ») : « La tribune n'oublie rien, et l'an dernier tu avais de la peinture sur les mains ; jeudi, on refait la bâche, ou tu as déjà donné ? » — mêmes sorties. · Variante `flag('discours_feu')` (jp.brassard.discours) : Gégé ajoute « et le capitaine parle au vestiaire, on le sait, on voudrait qu'il parle au local aussi ».
**Traces** : ami_ultras (∃) · **Réactions déclenchées** : — · **Lu plus tard par** : co.derby.match (variante « la peinture sur les mains »), ch. 13, ch. 15

### SCÈNE co.derby.match  —  Cinquante et un
**Rôle** : joueur | joueur_amateur · **Intrigue** : co.derby · **Étape** : 2/4 · **Moment** : [1,2], en Carte Match · **Lieu** : la tribune Est, avant le coup d'envoi, Paulette à la 14B (ou Karim au rond central, amateur) · **Conditions** : —
**PAULETTE** *(abonnée depuis 1951 — neutre — elle ne regarde pas le terrain, elle regarde la pendule)*
« J'étais là en cinquante et un, mon petit, et le derby de cinquante et un, on l'a perdu quatre à zéro, je m'en souviens mieux que des gagnés. Tu joues pour ne pas perdre, ou pour marquer ? »
← **Pour marquer** — effets : tribunes ++, rand: [{p: 0.5, set: derby_gagne, outcome: gagne}, {set: derby_perdu, tribunes −, outcome: perdu}] — *Tu joues devant. Elle se souviendra de celui-là, dans un sens ou dans l'autre.*
→ **Pour ne pas perdre** — effets : vestiaire +, rand: [{p: 0.65, set: derby_gagne, outcome: gagne}, {set: derby_perdu, outcome: perdu}] — *Tu joues derrière. Elle dit que c'est ce que faisait son mari ; il est mort souriant.*
Variante `role == 'joueur_amateur'` — **KARIM** *(voix sans portrait — ton copain, ou ton ancien copain, au rond central)* : « Le derby, c'est le seul match que le village regarde deux fois, et cette année ils me regardent moi, en vert. Tu joues pour marquer, ou pour ne pas perdre ? » — mêmes sorties. · Variante `chars.paulette.statut == 'mort'` : le locuteur devient **GÉGÉ** *(la place 14B vide derrière lui)* : « La tribune n'oublie rien, et la 14B est vide depuis 2009, elle regardait tous les derbys ; tu joues pour marquer, ou pour ne pas perdre ? »
**Traces** : derby_gagne, derby_perdu · **Réactions déclenchées** : co.re.gege_decoupe (∃) · **Lu plus tard par** : co.derby.lendemain, objectif `croises_rejoues`, ch. 01, ch. 20, ch. 30, ch. 90

### SCÈNE co.derby.lendemain  —  Tête haute
**Rôle** : joueur | joueur_amateur · **Intrigue** : co.derby · **Étape** : 3/4 · **Moment** : [0,1] · **Lieu** : la cuisine, L'Écho ouvert à la page du derby, Camille qui l'a déjà lu · **Conditions** : `!flag('divorce')`
**CAMILLE** *(neutre — elle tourne la page vers toi, elle garde le doigt sur le titre)*
« Tu rentres à quelle heure, hier, tu es rentré à trois heures, gagné ou perdu, je ne sais plus lequel. Tu me racontes, ou je lis ? »
← **Je raconte** — effets : relation.camille +1, tribunes − — *Tu racontes. Elle écoute. Elle a déjà lu ; elle écoute quand même.*
→ **Lis** — effets : relation.camille −1, force +1 — *Elle lit. L'Écho dit « tête haute ». Elle demande à qui ; tu ne sais pas.*
Variante `flag('derby_tete_haute')` (ch. 01) : « Tu rentres à quelle heure, et L'Écho dit « tête haute », c'est de moi qu'ils parlent, je suis passée par le local. Tu me racontes ta version, ou tu lis la mienne ? » — mêmes sorties, la gauche donne relation.camille +2.
**Traces** : — · **Réactions déclenchées** : co.re.camille_journal (∃) · **Lu plus tard par** : ch. 01 (Camille, paliers)

### SCÈNE co.derby.ancien  —  L'ancien
**Rôle** : joueur | joueur_amateur · **Intrigue** : co.derby · **Étape** : 4/4 · **Moment** : replay, la semaine du derby contre ton ancien club · **Lieu** : le rond central, quelqu'un que tu connais en face, ou toi-même dans l'autre couloir · **Conditions** : `flag('parti_chez_rival') || flag('passe_a_montbeliac') || flag('carton_karim')`
**GÉGÉ** *(capo — noir si `parti_chez_rival` — de l'autre côté de la grille, ton nom en deux morceaux dans les mains)*
« La tribune n'oublie rien, et aujourd'hui tu es en face, avec leur maillot ; on a ton nom en deux morceaux, un pour l'aller, un pour le retour. Tu salues le virage, ou tu regardes tes crampons ? »
← **Je salue le virage** — effets : tribunes +, vestiaire −, relation.gege +1, set: salue_ancien_virage — *Tu salues. Il ne répond pas. Il range un morceau ; il garde l'autre pour le retour.*
→ **Je regarde mes crampons** — effets : vestiaire +, tribunes −, relation.gege −1 — *Tu ne salues pas. Le virage siffle ton nom en entier ; il le connaît par cœur.*
Variante `role == 'joueur_amateur'` — **KARIM** *(voix sans portrait — en vert, ou en marron si c'est toi qui es parti)* : « Tu te souviens de moi, on portait le même sac ; aujourd'hui je suis en face, ou c'est toi. Tu me tacles comme un ancien, ou comme un copain ? » — ← **Comme un ancien** — tribunes ++, force +1, rand: [{p: 0.2, set: carton_karim}, {}] — *Tu le tacles. Il se relève ; il dit « ça va » ; ce n'est pas vrai.* · → **Comme un copain** — vestiaire −, tribunes −, relation.dede −1 — *Tu le laisses passer. Il marque. Dédé enlève sa casquette, deux fois.*
**Traces** : salue_ancien_virage (« {annee} : {prenom} {nom} a salué son ancien virage, en face. Le virage n'a pas répondu. »), carton_karim · **Réactions déclenchées** : jp.re.gege_blason (§ 7, variante « le retour ») · **Lu plus tard par** : ch. 90 (mémoire des clubs : +1 si salué), ch. 13 (Gégé au président : « il a salué »)
**Épilogue** : ligne « {annee} : le derby. La ville l'a regardé deux fois. »

### 6.24 INTRIGUE jp.coach_qui_te_veut  —  Le coach qui te veut  ("2+")
**Logline** : Vukić est devenu coach ailleurs. Il te veut. · **Synopsis** : Il a un banc et une place dans le onze, pas sur le banc ; Aulard n'a pas le temps de te retenir mais double ton salaire ; le premier jour chez Vukić, le cahier a une page à ton nom, vide ; et le jour où vous jouez contre Aulard, il te regarde depuis la loge. L'issue « Le fils spirituel » retourne la fin existante `jp_fils` en fin dorée douce.
**Rôle(s)** : joueur · **Postulat(s)** : pepite, retour_croises, banc_dore (variante « depuis l'Europe »), binational · **Porteur** : vukic · **Cast** : vukic, aulard, camille, josiane · **Thème** : direction
**Saisons** : "2+" · **Conditions d'entrée** : `requires: [banc_bosse]` et (`flag('vukic_dauphin')` ou `chars.vukic.statut == 'rival'`) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `suit` → `fils_spirituel` (« {annee} : {prenom} {nom} a suivi Vukić. Trois valises. ») → fin jp_fils (dorée douce : « dans son nouveau club », `epitaph_plus` variante `relation.vukic >= 2`), ch. 01, ch. 11, § 10.4 · `reste` → `vukic_refuse` → ch. 01 (Vukić −1), `reste_pour_aulard` → ch. 02 (Aulard : « tu es resté pour moi »)
**Séquencier** : appel (ouverture) → aulard [in 1,3] → premier_jour [in 2,5] (`fils_spirituel`) → contre_aulard (S+1, [3,12], `fils_spirituel`).

### SCÈNE jp.coach.appel  —  Dans le onze
**Rôle** : joueur · **Intrigue** : jp.coach_qui_te_veut · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : le téléphone, Vukić depuis un autre club, on entend un vestiaire derrière · **Conditions** : —
**VUKIĆ** *(entraîneur d'un autre club — neutre — il appelle entre deux entraînements, il n'a pas beaucoup de temps et il le prend)*
« Je te le dis parce que personne ne te le dira : j'ai un banc maintenant, et une place pour toi dans le onze, pas sur le banc, dans le onze. Tu viens, ou tu restes où l'on t'a mis sur le banc ? »
← **Je viens** — effets : direction −, tribunes −, vestiaire +, relation.vukic +1, set: fils_spirituel, club: {change: true} — *Trois valises. Camille en fait une quatrième ; elle vient.*
→ **Je reste** — effets : tribunes +, relation.vukic −1, set: vukic_refuse — *Il dit « d'accord ». Il rappelle l'année suivante ; il a une autre question.*
Variante `flag('retour_petite_porte')` : « Je te le dis parce que personne ne te le dira : tu étais rentré par la petite porte chez eux, chez moi il n'y a qu'une porte. Tu viens ? » — mêmes sorties. · Variante `flag('banc_dore')` : « … j'ai un banc en Europe, et toi tu as un banc climatisé ; le mien est en bois, il y a du monde devant. Tu viens ? » — la gauche pose aussi `banc_dore_retour`.
**Traces** : fils_spirituel, vukic_refuse · **Réactions déclenchées** : co.re.camille_journal (∃) · **Lu plus tard par** : jp.coach.aulard, jp.coach.premier_jour, fin jp_fils, ch. 01, ch. 11

### SCÈNE jp.coach.aulard  —  Le double
**Rôle** : joueur · **Intrigue** : jp.coach_qui_te_veut · **Étape** : 2/4 · **Moment** : [1,3] · **Lieu** : le bureau d'Aulard, un avenant déjà rédigé, le chiffre en gras · **Conditions** : `!flag('fils_spirituel')`
**AULARD** *(président — neutre — il pousse l'avenant, il n'a pas le temps de le relire, il l'a déjà lu)*
« Vukić te veut, et j'ai pas le temps de te retenir, j'ai un empire ; tu pars pour lui, ou je double ton salaire pour que tu restes pour moi ? »
← **Pour lui** — effets : caisse −, relation.aulard −1, set: fils_spirituel, club: {change: true} — *Il ne double rien. Il te serre la main ; il regarde la porte.*
→ **Le double, pour vous** — effets : caisse ++, relation.vukic −2, set: reste_pour_aulard — *Tu restes. Vukić l'apprend par Josiane. Il ne rappelle plus.*
**Traces** : reste_pour_aulard (« {annee} : {prenom} {nom} est resté pour Aulard, au double. Vukić n'a plus rappelé. ») · **Réactions déclenchées** : co.re.josiane_a_lu (∃) · **Lu plus tard par** : ch. 02 (Aulard : « tu es resté pour moi »), ch. 01 (Vukić, retrouvailles noires), fin jp_fils (plus)

### SCÈNE jp.coach.premier_jour  —  La page vide
**Rôle** : joueur · **Intrigue** : jp.coach_qui_te_veut · **Étape** : 3/4 · **Moment** : [2,5] · **Lieu** : le nouveau vestiaire de Vukić, le cahier ouvert, une page à ton nom · **Conditions** : `flag('fils_spirituel')`
**VUKIĆ** *(entraîneur — neutre — il te tend le cahier ouvert, il garde le stylo)*
« Je te le dis parce que personne ne te le dira : ici, tu es mon joueur, pas mon ami, et le cahier a une page à ton nom, vide. Tu la remplis, ou je la remplis pour toi ? »
← **Je la remplis** — effets : vestiaire ++, force +1 — *Tu la remplis. Il corrige. C'est comme avant ; c'est mieux.*
→ **Remplis-la** — effets : direction +, force −1, set: fils_docile — *Il la remplit. Tu joues où il écrit. Tu joues bien ; tu ne sais plus pourquoi.*
**Traces** : fils_docile · **Réactions déclenchées** : — · **Lu plus tard par** : fin jp_fils (epitaph_plus « Vukić remplissait la page »), § 10.4

### SCÈNE jp.coach.contre_aulard  —  La loge d'en face
**Rôle** : joueur · **Intrigue** : jp.coach_qui_te_veut · **Étape** : 4/4 · **Moment** : saison suivante, [3,12], la semaine du match contre ton ancien club · **Lieu** : le couloir des visiteurs de ton ancien stade, Josiane avec ta place de parking à la main · **Conditions** : `flag('fils_spirituel')`
**JOSIANE** *(secrétaire — sourire — elle te tend la plaque de parking, elle l'a gardée dans le classeur)*
« J'en ai vu passer, vous savez, mais rarement un qui revient avec son ancien adjoint devenu coach ; le président, en loge, regarde votre banc, pas le terrain. Vous lui faites un signe, ou pas ? »
← **Un signe, à la loge** — effets : direction +, tribunes −, relation.aulard +1 — *Tu fais un signe. Il ne répond pas ; il note. Il notera un salaire, un jour.*
→ **Le terrain, seulement** — effets : vestiaire +, relation.vukic +1, relation.aulard −1 — *Tu regardes le terrain. Vukić aussi. Vous gagnez, ou pas ; la loge s'est vidée avant la fin.*
Variante `flag('reste_pour_aulard')` : la scène n'est pas servie.
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 02 (Aulard : « tu as fait un signe »), ch. 90 (mémoire de l'ancien club)
**Épilogue** : ligne « {annee} : Vukić a voulu {nom}. {nom} a suivi, ou pas. »

### 6.25 INTRIGUE jp.retour_usine  —  Le retour à l'usine  ("2+", replay)
**Logline** : Tu joues contre ton ancien club ; la bâche est pliée dans un coin. · **Synopsis** : Josiane t'a gardé ta place de parking ; Gégé a la bâche dans un sac ; le gamin acheté avec ton prix te demande comment c'est, d'être vendu ; Aulard, après le match, rachète parfois ce qu'il a vendu, moins cher. Variante « encore » à chaque retour ; variante « le retour en Europe » pour le banc doré.
**Rôle(s)** : joueur · **Postulat(s)** : pepite (`requires: [vendu_d1]`), banc_dore (variante « le retour en Europe », `requires: [banc_dore_retour]`) · **Porteur** : gege · **Cast** : gege, aulard, josiane, mbako · **Thème** : tribune
**Saisons** : "2+" · **Conditions d'entrée** : `requires: [vendu_d1] || requires: [banc_dore_retour]` · **Rejouabilité** : replay {after: 1, max: 3} (variante « encore »)
**Issues** → **Traces** → **Qui les lit** : `celebre` → `celebre_contre_usine` → ch. 90 (mémoire −2), fin jp_siffle (plus) · `baisse` → `tifo_adieu` (déjà déclarée) → ch. 90 (+1) · `rachete` → `retour_usine_signe` (« {annee} : l'usine a racheté {prenom} {nom}. Moins cher. La bâche dit « (BIS) ». ») → une.pepite.retour, ch. 12 (le prix de rachat)
**Séquencier** : parking (ouverture) → gamin [in 0,1] → but [in 0,1], en temps fort → aulard [in 0,1].

### SCÈNE jp.retour.parking  —  La place à ton nom
**Rôle** : joueur · **Intrigue** : jp.retour_usine · **Étape** : 1/4 · **Moment** : ouverture tirée, le jour du match contre l'usine · **Lieu** : le parking de l'usine, une place avec une plaque à ton nom, Josiane à côté · **Conditions** : —
**JOSIANE** *(secrétaire — sourire — elle a gardé la plaque ; elle a aussi gardé le tournevis)*
« J'en ai vu passer, vous savez, mais rarement un qui revient jouer contre nous avec sa place de parking encore à son nom. Vous vous garez dessus, ou avec les visiteurs ? »
← **Dessus** — effets : tribunes +, direction − — *Tu te gares. Aulard fait enlever la plaque à la mi-temps ; il a le temps pour ça.*
→ **Avec les visiteurs** — effets : direction +, relation.josiane +1 — *Elle enlève la plaque elle-même. Elle la garde dans le classeur, sous la pétition.*
Variante `plays() >= 1` (« encore ») : « J'en ai vu passer, et vous, deux fois maintenant ; la place, cette fois, c'est celle du visiteur, je l'ai fait peindre. Vous vous garez dessus ? » — un bouton — **Dessus** — relation.josiane +1 — *Tu te gares. La peinture est fraîche ; c'est voulu.* · Variante `flag('banc_dore_retour')` : « J'en ai vu passer, des retours du désert, ils ont tous la même tête, bronzée et inquiète ; la place, ou les visiteurs ? »
**Traces** : — · **Réactions déclenchées** : co.re.josiane_a_lu (∃) · **Lu plus tard par** : ch. 02 (Josiane : la plaque dans le classeur)

### SCÈNE jp.retour.gamin  —  Acheté avec ton prix
**Rôle** : joueur · **Intrigue** : jp.retour_usine · **Étape** : 2/4 · **Moment** : [0,1], avant le match · **Lieu** : le couloir, le gamin que l'usine a acheté avec ton prix, Mbako ou un autre, dix-sept ans, ton ancien numéro · **Conditions** : `chars.mbako.statut == 'club'` (sinon voix « le gamin de l'usine »)
**MBAKO** *(prodige de l'usine — neutre — il porte ton ancien numéro, il ne le sait pas, ou si)*
« Je veux jouer, maintenant, et ils m'ont acheté avec ton prix, ma mère me l'a dit, elle a lu le chiffre. Tu me dis comment c'est, d'être vendu, ou tu me laisses le découvrir ? »
← **Je te dis** — effets : vestiaire +, relation.mbako +1, set: vendu_explique — *Tu lui dis. Le fax, la Josiane d'ailleurs, le casier sans nom. Il écoute ; c'est rare ; c'est parce que c'est toi.*
→ **Tu découvriras** — effets : tribunes +, relation.mbako −1 — *Tu ne dis rien. Il découvre en juin. Il t'écrit une carte sans texte ; le chiffre est dessus.*
**Traces** : vendu_explique (sans Almanach) · **Réactions déclenchées** : co.re.mere_mbako_souffle (ch. 01) · **Lu plus tard par** : ch. 01 (Mbako : « tu m'avais dit comment c'était »), jp.mbako.contre_toi (variante)

### SCÈNE jp.retour.but  —  Le sac
**Rôle** : joueur · **Intrigue** : jp.retour_usine · **Étape** : 3/4 · **Moment** : [0,1], en temps fort, tu marques contre l'usine · **Lieu** : devant la Tribune Nord, Gégé à la grille, un sac poubelle propre à ses pieds · **Conditions** : —
**GÉGÉ** *(capo — noir — il tient le sac fermé, il n'a pas encore décidé)*
« La tribune n'oublie rien : tu viens de marquer contre nous, et on a la bâche pliée dans un sac. Tu célèbres, ou tu baisses la tête ? »
← **Je baisse la tête** — effets : tribunes ++, vestiaire −, set: tifo_adieu, outcome: baisse — *La Nord applaudit un visiteur. Ça n'arrive qu'une fois ; c'est la fois.*
→ **Je célèbre** — effets : vestiaire ++, tribunes −−, set: celebre_contre_usine, outcome: celebre — *La bâche sort du sac. Elle est brûlée le soir ; proprement.*
Variante `flag('retour_promis_gege')` (banc_dore) : « La tribune n'oublie rien, et tu avais promis de rentrer, à la craie ; tu marques contre nous en attendant. Tu baisses la tête, ou tu effaces la craie ? » — ← **Je baisse la tête** — set: tifo_adieu, parole +1 · → **Je célèbre** — set: celebre_contre_usine, parole −2, clear: retour_promis_gege.
**Traces** : tifo_adieu, celebre_contre_usine · **Réactions déclenchées** : co.re.gege_decoupe (∃) · **Lu plus tard par** : ch. 90, fin jp_siffle (plus), jp.retour.aulard (variante)

### SCÈNE jp.retour.aulard  —  Racheter moins cher
**Rôle** : joueur · **Intrigue** : jp.retour_usine · **Étape** : 4/4 · **Moment** : [0,1], après le match · **Lieu** : le couloir, Aulard, un chiffre sur un bout de fax, plus petit que l'ancien · **Conditions** : —
**AULARD** *(président — neutre — il te montre le chiffre sans te tendre le papier)*
« Tu as bien joué contre nous, et j'ai pas le temps, j'ai une usine, mais l'usine rachète parfois ce qu'elle a vendu, moins cher. Tu reviens l'été prochain, ou tu restes là où on t'a payé ? »
← **Je reviens** — effets : tribunes +++, caisse −, set: retour_usine_signe, club: {change: true, division: 2}, outcome: rachete — *Tu reviens. Gégé ressort la bâche ; il repeint « POUR TOUJOURS » ; il ajoute « (BIS) ».*
→ **Je reste** — effets : caisse +, direction + — *Il hoche la tête. Il vend un autre gamin.*
Variante `flag('celebre_contre_usine')` : Aulard ajoute « et la tribune a brûlé quelque chose hier soir, je n'ai pas eu le temps de regarder quoi » ; la gauche donne tribunes + seulement.
**Traces** : retour_usine_signe · **Réactions déclenchées** : jp.re.lea_aller_simple (§ 7, variante « aller-retour ») · **Lu plus tard par** : une.pepite.retour, ch. 12, ch. 90 (mémoire : le fils prodigue)
**Épilogue** : ligne « {annee} : {nom} est revenu jouer contre l'usine. La bâche était dans un sac. »

### 6.26 INTRIGUE jp.brassard_20 / jp.brassard_33  —  Le brassard
**Logline** : Le brassard à vingt ans (Bréhaut te le donne parce que le groupe l'a voulu) ou à trente-trois (deux capitaines du même âge, un seul brassard). · **Synopsis** : Une seule intrigue, deux entrées. Le groupe vote pour toi contre Bréhaut qui n'a pas voté ; ou son genou et le tien disent stop en même temps et il ne reste qu'un brassard pour deux jambes valides. Vukić rappelle qu'un capitaine parle au coach avant le groupe ; et le premier match avec le brassard, Colline te regarde autrement.
**Rôle(s)** : joueur · **Postulat(s)** : pepite ("2+", `if: relation.brehaut >= 2 || flag('capitaine')`), fin_de_contrat ("0", `jp.brassard_33`), capitaine_dechu (« tu l'as déjà » : seules vukic et colline sont servies) · **Porteur** : brehaut · **Cast** : brehaut, vecchio, mbako, vukic, colline · **Thème** : vestiaire
**Saisons** : "0" (33), "2+" (20) · **Conditions d'entrée** : `!flag('capitaine') || flag('geant_dechu')` · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `prend` → `capitaine` (∃) → ch. 11, ch. 14, ch. 30, § 10.5 · `gigi` → `brassard_gigi` (ch. 01 `en.vecchio.brassard`) · `refuse` → `brassard_refuse` (« {annee} : {prenom} {nom} a refusé le brassard. Le groupe a compris, ou pas. ») → objectif `geant_brassard_garde`, ch. 14 (Fauvel : « tu as refusé un brassard une fois »)
**Séquencier** : groupe (ouverture, `age < 25`) ou deux (ouverture, `age >= 30` ; absorbe `jp.vestiaire.brassard` ∃) → vukic [in 1,3] (`capitaine`) → colline [in 1,4] (`capitaine`), en temps fort.

### SCÈNE jp.brassard_20.groupe  —  Le vote
**Rôle** : joueur · **Intrigue** : jp.brassard_20 · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : le vestiaire, le brassard sur le banc, un vote à main levée qui vient de finir · **Conditions** : `age < 25`
**BRÉHAUT** *(capitaine — neutre — il ramasse le brassard, il ne l'a pas encore lâché)*
« Le groupe a voté, le groupe vit bien quand il vote, et il a voté toi, à vingt ans, contre moi qui n'ai pas voté. Tu le prends devant eux, ou tu me le laisses un an de plus ? »
← **Je le prends** — effets : vestiaire ++, direction +, set: capitaine, outcome: prend — *Il te le met. Il ne serre pas trop fort cette fois ; il a compris.*
→ **Un an de plus, Titi** — effets : vestiaire +, relation.brehaut +2, set: brassard_refuse, outcome: refuse — *Il le garde. Il te le donne en juin, sans vote ; c'est mieux.*
**Traces** : capitaine, brassard_refuse · **Réactions déclenchées** : jp.re.vukic_capitaine (§ 7, après ←) · **Lu plus tard par** : jp.brassard.vukic, objectif `pepite_brassard_22`, ch. 14

### SCÈNE jp.brassard_33.deux  —  Deux jambes valides
**Rôle** : joueur · **Intrigue** : jp.brassard_33 · **Étape** : 1/4 · **Moment** : ouverture tirée · **Lieu** : le même vestiaire, trente-trois ans tous les deux, deux poches de glace · **Conditions** : `age >= 30` (absorbe `jp.vestiaire.brassard` ∃)
**BRÉHAUT** *(capitaine — neutre — il a le brassard autour de la poche de glace, pour rire, pas beaucoup)*
« Mon genou dit stop et le tien aussi, deux capitaines de trente-trois ans, ça fait un brassard pour deux jambes valides. Tu le prends, ou je le passe à Vecchio ? »
← **Je le prends** — effets : vestiaire +, direction +, set: capitaine, outcome: prend — *Tu le prends. Vous jouez un match sur deux ; le brassard, tous les matchs.*
→ **Vecchio** — effets : vestiaire ++, tribunes −, relation.vecchio +1, set: brassard_gigi, outcome: gigi — *Gigi le met sur le gant. Il tombe deux fois par match ; le stade applaudit quand il le remet.*
**Traces** : capitaine, brassard_gigi · **Réactions déclenchées** : jp.re.vecchio_encore_une (§ 7, variante « le brassard sur le gant ») · **Lu plus tard par** : jp.brassard.vukic, ch. 01 (`en.vecchio.brassard`), jp.fin.s1_premier_jour (variante `partage_brehaut`)

### SCÈNE jp.brassard.vukic  —  Le lundi
**Rôle** : joueur · **Intrigue** : jp.brassard_20 | jp.brassard_33 · **Étape** : 2/4 · **Moment** : [1,3] · **Lieu** : le couloir, Vukić, la porte du bureau du coach fermée derrière lui · **Conditions** : `flag('capitaine')`
**VUKIĆ** *(entraîneur adjoint — neutre — il regarde la porte fermée, puis toi)*
« Je te le dis parce que personne ne te le dira : un capitaine, ça parle au coach avant le groupe, pas après. Tu viens me voir le lundi, ou tu attends que le groupe t'envoie ? »
← **Le lundi** — effets : direction +, relation.vukic +1, set: capitaine_lundi — *Tu viens. Il note ce que tu dis. Il l'utilise ; pas contre toi.*
→ **Quand le groupe m'envoie** — effets : vestiaire +, direction − — *Le groupe t'envoie souvent. Tu deviens le porte-parole ; la jauge sait ce que ça veut dire.*
**Traces** : capitaine_lundi (sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : fin jp_porteparole (plus), § 10.4, ch. 11 (Vukić : « tu venais le lundi »)

### SCÈNE jp.brassard.colline  —  J'ai vu
**Rôle** : joueur · **Intrigue** : jp.brassard_20 | jp.brassard_33 · **Étape** : 3/4 (4/4 avec le temps fort `jp.te.capitaine_rouge`) · **Moment** : [1,4], le premier match avec le brassard · **Lieu** : le rond central, avant le coup d'envoi, Colline, la pièce dans la main · **Conditions** : `flag('capitaine') && chars.colline.statut == 'arbitre'` (retraite du sifflet en 2001)
**COLLINE** *(arbitre — neutre — il vouvoie, il regarde le brassard avant de regarder ton visage)*
« J'ai vu le brassard, monsieur, c'est la première fois que vous le portez, et un capitaine me parle une fois par match, pas dix. Vous choisissez la fois maintenant, ou vous la gardez pour la fin ? »
← **Maintenant : bonjour** — effets : direction +, vestiaire +, relation.colline +1, set: colline_bonjour — *Tu dis bonjour. Il dit « j'ai vu ». Il t'écoute à la 90e ; une fois ; ça suffit.*
→ **Je la garde pour la fin** — effets : tribunes +, relation.colline −1 — *Tu la gardes. À la 90e, tu parles ; il a déjà vu ; il siffle.*
Variante `year > 2001` : le locuteur devient **L'ARBITRE** *(voix sans portrait)* ; mêmes sorties, sans relation.
**Traces** : colline_bonjour (« {annee} : premier match avec le brassard. {prenom} {nom} a dit bonjour à Colline ; Colline a vu. ») · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 02 (Colline : « vous m'aviez dit bonjour capitaine »), temps fort jp.te.capitaine_rouge (§ 9, variante `colline_bonjour` : il t'écoute), ch. 15 (Colline responsable de l'arbitrage, 2008)
**Épilogue** : ligne « {annee} : le brassard de {nom}. À vingt ans, ou à trente-trois. »

### 6.27 INTRIGUE jp.adieu / jp.vecchio_exemple  —  L'adieu, et Vecchio l'exemple  ("2+")
**Logline** : À trente-quatre ans, on te demande si c'est la dernière ; Gigi raconte ses cinq retraites. · **Synopsis** : Deux intrigues jumelles. `jp.vecchio_exemple` est un rituel : chaque saison, un verre de plus sur le comptoir, une retraite de plus racontée. `jp.adieu` ne se joue qu'une fois : Camille a une croix en juin sur le calendrier, Gégé a une bâche pliée qu'il n'ouvre pas, Vukić a une page dans le cahier. Le Carrefour lit `dernier_annonce`.
**Rôle(s)** : joueur · **Postulat(s)** : fin_de_contrat ("2+", `if: age >= 34`), tous pour le rituel Vecchio · **Porteur** : vecchio · **Cast** : vecchio, camille, gege, vukic · **Thème** : absurde (rituel) / famille (adieu)
**Saisons** : "2+" · **Conditions d'entrée** : `age >= 34` (adieu) ; `chars.vecchio.statut in [club, staff, retraite]` (rituel) · **Rejouabilité** : `jp.vecchio_exemple` ritual ; `jp.adieu` jamais
**Issues** → **Traces** → **Qui les lit** : `raccroche` → `dernier_annonce` → ch. 30 (fin jubile si `jubile_fait`, sinon Carrefour transition), § 10.4 · `une_de_plus` → `une_de_plus` (« {annee} : une saison de plus pour {prenom} {nom}. Vecchio a compté. ») → jp.vecchio_exemple (variante), jp.fin.s2_saison_de_plus
**Séquencier** : vecchio_exemple.retraites (rituel, ouverture) ; adieu : camille (ouverture) → gege [in 1,3] → vukic [in 1,3].

### SCÈNE jp.vecchio_exemple.retraites  —  Cinq verres
**Rôle** : joueur · **Intrigue** : jp.vecchio_exemple · **Étape** : 1/1 (rituel) · **Moment** : ouverture tirée · **Lieu** : la buvette (ou la buvette des anciens dès 2010), cinq verres alignés sur le comptoir, un par retraite · **Conditions** : —
**VECCHIO** *(gardien, puis entraîneur des gardiens, puis buvette — sourire — il aligne les verres, il en ajoute un chaque saison)*
« Cinq retraites, petit, un verre par retraite, et j'en ai vu d'autres, mais pas des miennes. Tu veux que je te raconte la première, ou la vraie ? »
← **La première** — effets : vestiaire +, relation.vecchio +1 — *Il raconte 1991. Il a dit « je raccroche » ; il a joué en août.*
→ **La vraie** — effets : tribunes +, relation.vecchio +1, set: vecchio_vraie_retraite — *Il raconte 1995. Il a rendu les gants au jeune. Le jeune les a rendus à sa mort, en 2031 ; c'est écrit dans le testament.*
Variante `plays() >= 1` (« encore ») : le nombre de verres monte avec `plays()` ; « Six verres, petit, et toi tu en es à combien, de retraites annoncées ? » — mêmes sorties, la gauche raconte la tienne à ta place.
**Traces** : vecchio_vraie_retraite (sans Almanach) · **Réactions déclenchées** : co.re.vecchio_garde (∃) · **Lu plus tard par** : ch. 01 (Vecchio : le testament, 2031), ch. 31 (l'enterrement de Vecchio : « les gants rendus »), fin jubile (plus)

### SCÈNE jp.adieu.camille  —  La croix en juin
**Rôle** : joueur · **Intrigue** : jp.adieu · **Étape** : 1/3 · **Moment** : ouverture tirée · **Lieu** : la maison, un calendrier, une croix en juin qu'elle a faite au crayon, pour pouvoir l'effacer · **Conditions** : `!flag('divorce')` ; sinon Josiane (« j'en ai vu passer, des dernières »)
**CAMILLE** *(neutre — elle tient le crayon, elle ne l'a pas encore posé)*
« Tu rentres à quelle heure, et cette fois je demande pour l'année : c'est la dernière, ou c'est encore « une de plus » ? Tu me réponds, ou tu réponds à Gégé d'abord ? »
← **La dernière, à toi d'abord** — effets : relation.camille +2, set: dernier_annonce, outcome: raccroche — *Elle repasse la croix au stylo. Elle ne dit rien ; elle sourit ; c'est la première fois depuis mars.*
→ **Une de plus** — effets : tribunes +, relation.camille −1, set: une_de_plus, outcome: une_de_plus — *Elle efface la croix. Elle range le calendrier. Elle en achètera un autre ; elle en a l'habitude.*
Variante `flag('jubile_reporte')` : « … Gégé a une affiche sans date depuis deux ans, et moi un calendrier ; lequel des deux tu remplis ? » — mêmes sorties.
**Traces** : dernier_annonce, une_de_plus · **Réactions déclenchées** : co.re.camille_journal (∃) · **Lu plus tard par** : jp.adieu.gege, jp.adieu.vukic, ch. 30 (Carrefour), ch. 01 (Camille, retrouvailles : « tu me l'avais dit à moi d'abord »)

### SCÈNE jp.adieu.gege  —  La bâche pliée
**Rôle** : joueur · **Intrigue** : jp.adieu · **Étape** : 2/3 · **Moment** : [1,3] · **Lieu** : le local, une bâche pliée sur la table, Gégé qui n'a pas encore vérifié ce qu'elle dit · **Conditions** : —
**GÉGÉ** *(capo — neutre — il pose la main sur la bâche pliée, il ne l'ouvre pas)*
« La tribune n'oublie rien, et elle a préparé une bâche pour ton dernier match, sans savoir si c'est le dernier. Tu nous dis, ou on la garde pliée une saison de plus ? »
← **C'est le dernier** — effets : tribunes +++, set: dernier_annonce — *La bâche s'ouvre. Elle dit « MERCI », et ton nom, et l'année ; l'année est bonne.*
→ **Gardez-la pliée** — effets : tribunes +, vestiaire + — *Il la garde. Il la déplie quand même, à moitié, pour voir si elle est bien ; elle l'est.*
Variante `flag('enfant_du_pays')` : « … et c'est la même bâche que la première, on a repeint le dos ; « ICI, POUR TOUJOURS » est de l'autre côté. Tu nous dis ? » — mêmes sorties, la gauche donne relation.gege +2.
**Traces** : dernier_annonce · **Réactions déclenchées** : co.re.gege_decoupe (∃) · **Lu plus tard par** : ch. 30 (Carrefour ; fin jubile), ch. 90 (mémoire du club : « la bâche MERCI »)

### SCÈNE jp.adieu.vukic  —  La page
**Rôle** : joueur · **Intrigue** : jp.adieu · **Étape** : 3/3 · **Moment** : [1,3] · **Lieu** : le banc de la réserve, Vukić, le cahier ouvert à une page qui porte ton nom depuis des années · **Conditions** : `flag('dernier_annonce')`
**VUKIĆ** *(entraîneur adjoint, ou entraîneur — sourire — il tourne le cahier vers toi ; la page n'est pas vide, elle est pleine)*
« Je te le dis parce que personne ne te le dira : cette page, je l'ai commencée le jour où tu as regardé le banc pour la première fois ; elle est pleine. Tu la lis maintenant, ou en août, à la réserve ? »
← **Maintenant** — effets : direction +, relation.vukic +1, set: page_lue_vukic — *Tu lis. C'est toi, vu de la touche, en dix ans. C'est juste ; c'est dur ; c'est signé.*
→ **En août, à la réserve** — effets : direction ++, vestiaire +, set: vers_entraineur, relation.vukic +1 — *Il referme. Il te donne le cahier en août. Tu es sur le banc de la réserve ; tu as la page.*
Variante `flag('vukic_dauphin')` : Vukić est au téléphone, d'un autre club : « … la page est pleine, et j'ai un poste d'adjoint à ton nom ici ; tu la lis maintenant, ou tu viens la lire ? » — la droite pose aussi `suit_vukic`.
**Traces** : page_lue_vukic (« {annee} : Vukić a montré la page à {prenom} {nom}. Dix ans, vus de la touche. »), vers_entraineur, suit_vukic · **Réactions déclenchées** : — · **Lu plus tard par** : § 10.4 (Carte Destin : « tu as lu la page »), ch. 11 (le cahier de Vukić), objectif `fin_passeur`
**Épilogue** : ligne « {annee} : l'adieu de {nom}. Ou une de plus. »

---

## 7. Les réactions (gabarit § 4.4)

Servies au tirage suivant, hors créneau ; plafond quatre par saison ; jamais de `end`, jamais de drame ; le nom du joueur n'y figure pas si la scène précédente le portait. Les réactions communes existantes citées dans les scènes (`co.re.josiane_a_lu`, `co.re.lea_confirme`, `co.re.vecchio_garde`, `co.re.camille_journal`, `co.re.meneche_no_comment`, `co.re.nassir_reviendrai`, `co.re.gege_decoupe`, `co.re.vecchio_bouteilles`, `co.re.mere_mbako_souffle`, `co.re.vukic_lundi`, `co.re.josiane_lapin`, `co.re.josiane_a_vu_le_fax`, `co.re.vence_direct`, `co.re.barbier_doudoune`) ne sont pas réécrites.

### RÉACTION jp.re.aulard_quatre_millions  —  Quatre millions
**Après** : jp.pepite.p1_valeur (les deux) · **Famille** : tiers qui commente · **Conditions** : —
**AULARD** *(président — neutre — il passe dans le couloir, il ne s'arrête pas)*
« Quatre millions, m'a dit ton agent, ou trois, j'ai pas le temps, j'ai une usine. Tu marques dimanche ? »
← **Je marque** — effets : direction +, force −1 — *Il continue son chemin. Il note « dimanche ».*
→ **On verra dimanche** — effets : direction − — *Il note « on verra ». C'est ce qu'il note le plus souvent.*

### RÉACTION jp.re.lea_vingt_metres  —  Vingt mètres de bâche
**Après** : jp.tifo.bache (← promis) · **Famille** : conséquence immédiate · **Conditions** : —
**LÉA** *(attachée de presse — neutre — le communiqué déjà rédigé)*
« Vous confirmez ? Vous venez de promettre de rester, à vingt mètres de bâche, au micro du stade. Je le mets dans le communiqué, ou je laisse la bâche parler ? »
← **Mettez-le** — effets : tribunes +, parole +1 — *C'est écrit. Deux fois, donc.*
→ **Laissez la bâche parler** — effets : direction + — *Elle n'écrit rien. La Gazette Rose, si ; avec la date.*

### RÉACTION jp.re.lea_aller_simple  —  Aller simple
**Après** : jp.pepite.p3_vente (← vendu) · **Famille** : conséquence immédiate · **Conditions** : —
**LÉA** *(attachée de presse — neutre — la Une de demain sur l'écran)*
« Vous confirmez ? « {PRIX} millions et un aller simple », c'est la manchette du Quotidien, ils ont le chiffre avant moi. Un mot pour la tribune, ou pas de mot ?»
← **Un mot : merci** — effets : tribunes +, parole +1 — *Elle l'ajoute en dernière ligne. C'est petit ; c'est là.*
→ **Pas de mot** — effets : tribunes − — *La Une part sans. Gégé la découpe sans.*

### RÉACTION jp.re.camille_projet  —  Un projet
**Après** : jp.fin.f1_derniere_annee (les deux) · **Famille** : tiers qui commente · **Conditions** : `!flag('divorce')`
**CAMILLE** *(neutre — le téléphone encore à la main)*
« Ton agent a appelé à la maison, il a demandé si on avait « un projet ». Tu rentres à quelle heure, pour qu'on en parle, du projet ? »
← **Tôt, ce soir** — effets : relation.camille +1, vestiaire − — *Tu rentres tôt. Vous parlez. Il n'y a pas de projet ; c'est déjà un début.*
→ **Après l'entraînement** — effets : relation.camille −1 — *Elle raccroche. Fardelli rappelle ; il tombe sur elle.*

### RÉACTION jp.re.vecchio_encore_une  —  Papy aussi
**Après** : jp.fin.f3_juin (← prolongé), jp.mbako.mere (variante papy) · **Famille** : tiers qui commente · **Conditions** : `chars.vecchio.statut in [club, staff]`
**VECCHIO** *(gardien — sourire — il rit sans bruit)*
« À trente et un ans, j'étais papy aussi, et j'ai encore dix ans, j'en ai vu d'autres. Tu comptes les tiens, ou tu les joues ? »
← **Je les joue** — effets : vestiaire +, tribunes + — *Il hoche la tête. Il en a vu d'autres.*
→ **Je les compte** — effets : direction + — *Il compte pour toi. Il trouve un chiffre ; il ne le dit pas.*

### RÉACTION jp.re.rouvier_respire  —  Trois pas
**Après** : jp.fin.s1_jambes (→ je cours après) · **Famille** : relance · **Conditions** : —
**ROUVIER** *(kiné — neutre — elle a le chronomètre, elle ne l'a pas lancé)*
« Respire. Encore. Trois pas, ça ne se rattrape pas en courant, ça se rattrape en respirant ; tu viens le matin, avant les autres, ou tu cours avec eux ? »
← **Le matin, avant** — effets : force +1, relation.rouvier +1 — *Tu viens. Elle compte. Tu rattrapes un pas ; c'est déjà ça.*
→ **Avec eux** — effets : vestiaire +, relation.rouvier −1 — *Tu cours. Elle regarde depuis la fenêtre ; elle ne compte plus.*

### RÉACTION jp.re.sabatier_radio_agent  —  La radio dans le tiroir
**Après** : jp.genou.radio (← je finis la saison) · **Famille** : conséquence immédiate · **Conditions** : `flag('agent_fardelli')`
**SABATIER** *(médecin — neutre — il ferme le tiroir à clé, devant toi)*
« Ça reste entre la table et moi, et entre la table et ton agent, qui a demandé la radio ce matin. Je lui donne le dossier, ou le tiroir reste fermé ? »
← **Le tiroir reste fermé** — effets : direction −, relation.sabatier +1, set: radio_cachee — *Il ferme. Fardelli demande deux fois ; deux fois non.*
→ **Donne-lui le dossier** — effets : caisse +, relation.sabatier −1 — *Il donne. Fardelli vend avec ; il vend moins cher ; il vend.*

### RÉACTION jp.re.sabatier_rien_sentir  —  Le problème
**Après** : jp.genou.plateaux (→ la piqûre) · **Famille** : conséquence immédiate · **Conditions** : —
**SABATIER** *(médecin — neutre — il range la seringue, il te regarde marcher)*
« Tu ne sens plus rien, et c'est bien ça, le problème, ça reste entre la table et moi. Tu me dis quand ça revient, ou tu attends que je le voie ? »
← **Je te le dis** — effets : force +1, relation.sabatier +1 — *Tu le dis. Deux semaines plus tard ; c'est tôt, pour un joueur.*
→ **Tu le verras** — effets : tribunes + — *Il le voit. À l'échauffement. Il court ; il ne court jamais.*

### RÉACTION jp.re.sabatier_certificat  —  Le certificat
**Après** : jp.banc.recruteurs (← je confirme) · **Famille** : tiers qui commente · **Conditions** : —
**SABATIER** *(médecin — noir — il signe sans lire, puis il lit)*
« Un certificat pour une blessure que tu n'as pas, ça reste entre la table et moi, mais la table commence à être encombrée. C'est la dernière fois, ou tu en auras besoin encore ? »
← **La dernière** — effets : relation.sabatier +1 — *Il classe. Dans le tiroir, pas dans le dossier.*
→ **On verra** — effets : relation.sabatier −1, direction − — *Il classe dans le dossier. Le dossier, tout le monde peut le lire.*

### RÉACTION jp.re.sabatier_deux_chronos  —  Deux chronomètres
**Après** : jp.croises.c1_reprise (les deux) · **Famille** : tiers qui commente · **Conditions** : —
**SABATIER** *(médecin — neutre — il compare son chronomètre à celui de Rouvier)*
« Rouvier a un chronomètre et moi un autre, et les deux ne disent pas pareil, ça reste entre la table et moi. Tu crois lequel ? »
← **Le sien** — effets : relation.rouvier +1, relation.sabatier −1 — *Il range le sien. Il ne dit rien ; il note.*
→ **Le tien, Doc** — effets : relation.sabatier +1, relation.rouvier −1 — *Elle range le sien. Elle compte quand même ; dans sa tête.*

### RÉACTION jp.re.aulard_cheville  —  La cheville
**Après** : jp.selection.liste (← je viens) · **Famille** : tiers qui commente · **Conditions** : —
**AULARD** *(président — noir — il tient une radio de cheville qu'il ne sait pas lire)*
« Ta cheville allait très bien pour la Fédération et très mal pour moi, j'ai pas le temps, j'ai une usine. Tu reviens entier, ou je facture la Fédération ? »
← **Entier, promis** — effets : direction +, parole +1, promise — *Il note. Il facture quand même, pour le principe.*
→ **Facturez-la** — effets : direction −, tribunes + — *Il facture. Legruet « verra ça après le Congrès ». Il n'y a pas de Congrès.*

### RÉACTION jp.re.brehaut_decoupe  —  Découpé
**Après** : jp.une.conference (→ le meilleur) · **Famille** : conséquence immédiate · **Conditions** : —
**BRÉHAUT** *(capitaine — neutre — il tient une paire de ciseaux qui n'est pas à lui)*
« Le groupe a découpé l'article, il est dans ton casier, avec la phrase en jaune. Le groupe vit bien quand tout le monde a lu ; tu as lu ? »
← **J'ai lu** — effets : vestiaire − — *Tu as lu. Ils t'ont regardé lire.*
→ **Pas encore** — effets : vestiaire −, tribunes + — *Tu lis plus tard. Seul. C'est pire ; c'est mieux.*

### RÉACTION jp.re.brehaut_plus_de_passe  —  Plus de passe
**Après** : jp.memoires.chapitre_trois (→ j'assume) · **Famille** : conséquence immédiate · **Conditions** : —
**BRÉHAUT** *(capitaine — noir — il te tourne le dos pendant qu'il parle)*
« Le groupe a lu le chapitre trois, et le groupe ne te fait plus la passe, c'est comme ça que le groupe vit bien. Tu le retires, ou tu joues seul ? »
← **Je joue seul** — effets : vestiaire −, force +1 — *Tu joues seul. Une semaine. Dembo te fait la passe le samedi suivant ; il a aimé le chapitre.*
→ **Je vais le retirer** — effets : vestiaire +, parole −1, set: chapitre_retire — *Tu appelles Léa. Elle retire. Elle garde la page.*

### RÉACTION jp.re.vukic_capitaine  —  Le brassard, et le lundi
**Après** : jp.brassard.genou_de_titi (← je le prends) · **Famille** : tiers qui commente · **Conditions** : —
**VUKIĆ** *(entraîneur adjoint — neutre — il a vu Bréhaut te le mettre)*
« Un brassard, et je te le dis parce que personne ne te le dira : le coach ne t'a pas choisi, le groupe l'a fait, et il s'en souviendra. Tu viens le voir lundi, ou tu attends qu'il t'appelle ? »
← **Lundi** — effets : direction +, relation.vukic +1 — *Tu viens. Il t'attendait. Il a préparé une phrase ; il ne la dit pas.*
→ **Qu'il m'appelle** — effets : direction −, vestiaire + — *Il n'appelle pas. Il te fait jouer ; il ne te parle pas.*

### RÉACTION jp.re.camille_montre  —  La montre
**Après** : jp.image.cousin (← je signe) · **Famille** : tiers qui commente · **Conditions** : `!flag('divorce')`
**CAMILLE** *(neutre — elle regarde le poignet du cousin sur une photo de journal)*
« Ton cousin a acheté une montre, elle est dans L'Écho, page « Vu au parking ». Avec quoi ? »
← **Avec son argent** — effets : relation.camille −1 — *Elle plie le journal. Elle le garde ; elle garde tout.*
→ **Je vais lui demander** — effets : relation.camille +1, caisse − — *Tu demandes. Il dit « les frais ». Tu répètes « les frais » à Camille ; elle ne rit pas.*

### RÉACTION jp.re.fardelli_amitie  —  On parlait d'amitié
**Après** : jp.image.solvang (← je change d'agent) · **Famille** : relance · **Conditions** : —
**FARDELLI** *(agent — noir — au téléphone, il ne dit pas bonjour)*
« Solvang, mon ami, la femme à qui j'ai pris son premier client, et tu vas chez elle ; on parlait d'amitié, je crois. Tu reviens avant juin, ou c'est fini ? »
← **C'est fini, Rocco** — effets : relation.fardelli −1, direction + — *Il raccroche. Il ne raccroche jamais le premier ; là, si.*
→ **On verra en juin** — effets : relation.fardelli +1, relation.solvang −1 — *Il note « juin ». Il a un carnet pour ça ; il est plein.*

### RÉACTION jp.re.gege_blason  —  Le blason, en face
**Après** : jp.clause.rival (← mes valises) · **Famille** : conséquence immédiate · **Conditions** : —
**GÉGÉ** *(capo — noir — il tient ton nom, décroché du mur du local, en deux morceaux)*
« La tribune n'oublie rien, et ton nom est en deux morceaux, un pour chaque derby de la saison. Tu veux le premier, ou on le garde pour te le montrer ? »
← **Gardez-le** — effets : tribunes −, relation.gege −1 — *Il le garde. Il te le montre au derby aller ; puis au retour.*
→ **Donnez-moi le premier** — effets : tribunes −, relation.gege +1 — *Il te le donne. C'est la moitié avec l'accent ; il l'a gardé juste.*

### RÉACTION jp.re.lea_jubile_mars  —  Un jubilé en mars
**Après** : jp.jubile.gege (← je choisis la date) · **Famille** : tiers qui commente · **Conditions** : —
**LÉA** *(journaliste — neutre — un calendrier, deux dates entourées)*
« Vous confirmez ? Un jubilé en mars, et vous jouez en avril, j'ai relu deux fois. Je titre « Le jubilé continue », ou vous me donnez un autre titre ? »
← **Le jubilé continue** — effets : tribunes + — *Elle titre. C'est absurde ; c'est vrai ; c'est L'Écho.*
→ **Un autre : « Encore une »** — effets : tribunes +, relation.lea +1 — *Elle titre « Encore une ». Vecchio découpe ; il a le même titre depuis cinq ans.*

### RÉACTION jp.re.meneche_radio_d_abord  —  La radio d'abord
**Après** : jp.memoires.lea (les deux) · **Famille** : relance · **Conditions** : —
**MÉNÈCHE** *(chroniqueur — neutre — il a su pour le livre avant la fin du café)*
« Juste une question, hors micro : Léa écrit vos mémoires, et personne ne les lira si vous ne les racontez pas à la radio d'abord. Dimanche soir, une heure ? »
← **Dimanche, une heure** — effets : tribunes +, relation.lea −1 — *Léa l'apprend. Elle ne dit rien ; elle coupe deux pages.*
→ **Le livre d'abord** — effets : relation.meneche −1, relation.lea +1 — *Il note. Il en parlera quand même ; sans vous.*

### RÉACTION jp.re.vence_autre_maillot  —  L'autre maillot
**Après** : jp.binational.b2_mars (→ Kambara), jp.selection.pere (→ pour vous) · **Famille** : conséquence immédiate · **Conditions** : —
**VENCE** *(Télé-Stade — neutre — le micro tendu, la caméra déjà rouge)*
« On est en direct, et vous venez de choisir l'autre maillot, tout le pays l'apprend en même temps que moi. Un mot pour ceux qui sifflent déjà ? »
← **Un mot : je comprends** — effets : tribunes +, parole +1 — *Le mot passe. On siffle moins ; on siffle.*
→ **Pas de mot** — effets : tribunes −, relation.vence −1 — *Douze secondes de silence en direct. C'est long.*

### RÉACTION jp.re.mere_telephone  —  Avant vous
**Après** : jp.binational.b1_deux_lettres (les deux) · **Famille** : tiers qui commente · **Conditions** : —
**TA MÈRE** *(voix sans portrait — le téléphone du pays, tôt)*
« La Fédération d'ici m'a appelée avant toi, ils disent que tu as ouvert une lettre ; laquelle, tu me dis, ou je le lis dans le journal ? »
← **Je te dis** — effets : relation.camille +1 (Camille écoute), tribunes − — *Tu dis. Elle se tait. Elle raccroche doucement ; c'est rare.*
→ **Lis le journal** — effets : tribunes + — *Elle lit. Elle t'envoie le journal, plié à la page ; c'est sa réponse.*

### RÉACTION jp.re.camille_quelle_heure_ici  —  Quelle heure ici
**Après** : jp.banc_dore.d1_climatise (les deux) · **Famille** : tiers qui commente · **Conditions** : `!flag('divorce')`
**CAMILLE** *(neutre — au téléphone, une heure qui n'est pas la tienne)*
« Tu rentres à quelle heure, ça ne veut plus rien dire, il est trois heures ici et je ne sais pas quelle heure là-bas. Tu me dis l'heure, ou tu me dis si tu joues ? »
← **Sept heures, je ne joue pas** — effets : relation.camille +1 — *Elle dit « d'accord ». Elle note l'heure. Elle rappelle à sept heures, tous les jours.*
→ **Je joue samedi** — effets : relation.camille −1, tribunes + — *Elle dit « bien ». Elle ne demande pas l'heure ; elle ne rappelle pas.*

### RÉACTION jp.re.josiane_petite_avenant  —  L'avenant
**Après** : jp.geant.g2_vialat (← de moitié) · **Famille** : tiers qui commente · **Conditions** : `year >= 2010`
**LA PETITE JOSIANE** *(voix avec le portrait de Josiane, bande « SECRÉTAIRE DEPUIS 2008 » — neutre — elle range l'avenant sous le contrat)*
« Ma tante en a vu passer, moi c'est mon premier avenant à la baisse, je le classe sous l'ancien, ou dessus ? »
← **Dessus** — effets : direction +, relation.josiane +1 — *Elle le met dessus. Vialat le voit en premier ; elle compte plus vite.*
→ **Dessous** — effets : vestiaire + — *Elle le met dessous. Le vestiaire le sait quand même ; le vestiaire sait tout.*

### RÉACTION jp.re.fardelli_montre_tour  —  La montre pendant le tour d'honneur
**Après** : jp.pepite.p2b_dernier_bloc (← quatre-vingt-dix) · **Famille** : tiers qui commente · **Conditions** : `flag('agent_fardelli')`
**FARDELLI** *(agent — neutre — il range sa montre dans sa poche ; il l'a regardée tout le match)*
« Quatre-vingt-dix minutes, mon ami, j'ai compté, et la visite est lundi à huit heures ; on parle d'argent ou d'amitié, alors tu dors, ou tu fêtes ? »
← **Je dors** — effets : force +1, relation.fardelli +1 — *Tu dors. Il te réveille à sept. Il a apporté le costume.*
→ **Je fête** — effets : tribunes +, force −1 — *Tu fêtes. Il fête aussi ; il ne boit pas ; il regarde sa montre.*

### RÉACTION jp.re.vukic_feuille  —  La feuille en tribune
**Après** : jp.fin.f2b_quinzieme (→ en tribune) · **Famille** : relance · **Conditions** : —
**VUKIĆ** *(entraîneur adjoint — neutre — il te tend la feuille de match pliée ; la question est au dos, au crayon)*
« Je te le dis parce que personne ne te le dira : tu as regardé le match comme quelqu'un qui compte les passes, pas les buts. Tu me réponds sur le milieu, ou tu regardes encore ? »
← **Le milieu est trop bas** — effets : direction +, relation.vukic +1, set: notes_partagees — *Tu réponds. Il écrit ta réponse dans le cahier ; à ta page.*
→ **Je regarde encore** — effets : tribunes + — *Il range la feuille. Il te la redonnera en juin ; la question sera la même.*

### RÉACTION jp.re.sabatier_deuxieme_certificat  —  La deuxième fois
**Après** : jp.binational.s1_twist (→ blessé) · **Famille** : conséquence immédiate · **Conditions** : `year <= 2010`
**SABATIER** *(médecin — noir — il signe sans lire ; il ne lit plus)*
« Deuxième certificat du mois, et ça reste entre la table et moi, mais la table a deux pieds qui bougent. C'est la dernière fois, ou tu as un autre pays ? »
← **La dernière** — effets : relation.sabatier +1 — *Il classe. Dans le tiroir. Il y a de la place ; c'est mauvais signe.*
→ **J'ai deux pays, Doc** — effets : relation.sabatier −1, direction − — *Il classe dans le dossier. Le dossier, la Fédération peut le lire ; les deux.*

### RÉACTION jp.re.nassir_amortit  —  L'amortissement
**Après** : jp.banc_dore.s2_rentree (→ la ligne d'après) · **Famille** : tiers qui commente · **Conditions** : —
**NASSIR** *(propriétaire — sourire — il éteint le tableau ; il a appuyé sur un bouton pour ça)*
« Ce n'est pas un club, c'est un actif, et un joueur qui conseille s'amortit sur cinq ans au lieu de deux, c'est bon pour nous deux. Vous voulez un titre sur la porte, ou juste la ligne ? »
← **Un titre sur la porte** — effets : direction +, caisse + — *La porte dit « conseiller ». En deux alphabets. Tu es le seul à lire les deux.*
→ **Juste la ligne** — effets : vestiaire +, relation.nassir −1 — *Il n'écrit rien sur la porte. Il écrit sur le tableau ; ça suffit ; c'est lui qui lit.*

### RÉACTION jp.re.fardelli_on_ne_parle_plus  —  Là, on ne parle plus
**Après** : jp.pari.fardelli (→ je joue pour gagner) · **Famille** : conséquence immédiate · **Conditions** : —
**FARDELLI** *(agent — noir — il paie les deux verres ; il ne laisse pas de pourboire)*
« Tu as gagné, mon ami, et mon pote a perdu gros, alors là, on ne parle plus, ni d'argent ni d'amitié. Tu m'appelles quand tu as besoin d'un agent, ou tu en cherches un autre ? »
← **Un autre** — effets : relation.fardelli −1, direction +, set: sans_agent, clear: agent_fardelli — *Tu cherches. Solvang a une carte ; elle l'a toujours eue.*
→ **Je t'appellerai** — effets : relation.fardelli +1, parole −1 — *Tu l'appelleras. Il le sait. Il note « appellera » ; il souligne.*

### RÉACTION am.re.gerard_licence  —  La licence dans la boîte
**Après** : am.village.v1_licence (les deux) · **Famille** : tiers qui commente · **Conditions** : —
**GÉRARD** *(bénévole — neutre — il range ta licence dans la boîte en fer, avec l'argent)*
« Ici, on payait en bières, et la licence, je la mets dans la boîte, avec le reste ; tu veux savoir combien il y a, dans le reste ? »
← **Combien ?** — effets : caisse −, relation.gerard +1 — *Il te dit. C'est peu. Il dit « et encore, je compte large ».*
→ **Je ne veux pas savoir** — effets : tribunes + — *Il referme. Tu sauras en juin ; tout le monde saura.*

### RÉACTION am.re.camille_sciure  —  De la sciure
**Après** : am.village.v2_scierie (→ je joue), am.patron.lundi (→ le foot d'abord) · **Famille** : tiers qui commente · **Conditions** : —
**CAMILLE** *(neutre — elle brosse la sciure de ton pantalon)*
« Tu rentres à quelle heure, samedi, si tu joues au lieu de livrer ; je demande parce que le patron a appelé ma mère. Tu le rappelles, ou tu joues d'abord ? »
← **Je le rappelle** — effets : caisse +, relation.camille +1 — *Tu rappelles. Il ne décroche pas. C'est sa réponse.*
→ **Je joue d'abord** — effets : tribunes +, relation.camille −1 — *Elle brosse plus fort. Il reste de la sciure ; il en restera.*

### RÉACTION am.re.dede_casquette  —  La casquette
**Après** : am.village.v3_fusion (les deux) · **Famille** : tiers qui commente · **Conditions** : —
**DÉDÉ** *(coach bénévole — neutre — la casquette à la main, il la remet)*
« Bon, on va pas se mentir : moi, dans la fusion, je ne suis pas dans l'organigramme, ils ont dit « bénévole associé ». Tu sais ce que ça veut dire, ou je te le dis ? »
← **Dis-le-moi** — effets : relation.dede +1, vestiaire + — *Il dit « rien ». Il remet la casquette.*
→ **Je le sais** — effets : direction + — *Il hoche la tête. Il siffle la fin de l'entraînement ; il n'y a pas d'entraînement.*

### RÉACTION am.re.lea_bruyeres  —  Les billets pliés
**Après** : am.village.s1_twist (→ trois cents), am.montbeliac.dede (← on paie aussi) · **Famille** : tiers qui commente · **Conditions** : —
**LÉA** *(L'Écho — neutre — un carnet, une question qu'elle n'a pas envie de poser)*
« Vous confirmez ? Des billets pliés en huit, à la buvette des Bruyères, on m'a décrit le pliage. Je l'écris, ou je l'oublie une saison ? »
← **Oubliez-le une saison** — effets : direction +, relation.lea −1 — *Elle oublie. Une saison. Elle a un carnet pour les oublis.*
→ **Écrivez-le** — effets : tribunes −−, direction −, parole +1 — *Elle écrit. Le district lit. Roux a un dossier bleu, et un rouge.*

### RÉACTION am.re.camille_quatre_cents  —  Quatre cents kilomètres
**Après** : am.doudoune.doudoune (← j'y vais) · **Famille** : tiers qui commente · **Conditions** : —
**CAMILLE** *(neutre — une carte routière, un doigt sur Valdorne)*
« Quatre cents kilomètres, mardi, et tu rentres à quelle heure, mercredi ; je viens avec toi dans le car, ou j'attends ici ? »
← **Viens** — effets : caisse −, relation.camille +1 — *Elle vient. Elle attend sous la pluie avec Barbier. Ils parlent ; il lui dit « il est bien, votre ami ».*
→ **Attends ici** — effets : relation.camille −1, force +1 — *Elle attend. Tu rentres mercredi soir. Elle n'a pas dormi ; elle ne le dit pas.*

### RÉACTION am.re.dede_juin  —  Jusqu'en juin
**Après** : am.doudoune.coup_de_fil (les deux) · **Famille** : tiers qui commente · **Conditions** : —
**DÉDÉ** *(coach bénévole — neutre — il a entendu la cabine depuis le bar)*
« Bon, on va pas se mentir : « à revoir en juin », c'est ce qu'on m'a dit en 1961, à Valdorne, sous la pluie. Tu y retournes en juin, ou tu attends qu'ils viennent ? »
← **J'y retourne** — effets : force +1, relation.dede +1 — *Il dit « bien ». Il te prête sa voiture ; elle n'a pas d'essuie-glaces.*
→ **Qu'ils viennent** — effets : vestiaire +, relation.dede −1 — *Ils ne viennent pas. Ou si ; la doudoune a ses habitudes.*

### RÉACTION am.re.pichon_petrin  —  Au pétrin
**Après** : am.dede_neveu.neveu (→ je gueule) · **Famille** : tiers qui commente · **Conditions** : —
**PICHON** *(boulanger, président — noir — de la farine sur les avant-bras, il ne les essuie pas)*
« Le pain, c'est à cinq heures, et on m'a raconté ton coup de gueule à cinq heures et demie, avant le premier client. Tu viens t'excuser au fournil, ou tu envoies Dédé ? »
← **Je viens au fournil** — effets : direction +, relation.pichon +1 — *Tu viens. Il te fait pétrir. C'est ça, l'excuse.*
→ **J'envoie Dédé** — effets : direction −, relation.pichon −1 — *Dédé y va. Il revient avec du pain ; pas avec ton pardon.*

### RÉACTION am.re.gerard_souligne  —  Souligné
**Après** : am.pichon_150.essence (← je prends), am.montbeliac.dede (← on paie aussi) · **Famille** : tiers qui commente · **Conditions** : —
**GÉRARD** *(bénévole — neutre — il écrit dans le cahier de la boîte, il souligne)*
« Ici, on payait en bières, et maintenant je souligne « essence » dans le cahier ; si quelqu'un lit le cahier un jour, tu voudras que ce soit souligné, ou pas ? »
← **Souligne** — effets : relation.gerard +1, direction − — *Il souligne. Deux fois. Le cahier est honnête ; c'est son problème.*
→ **N'écris rien** — effets : caisse +, relation.gerard −1 — *Il n'écrit rien. Il retient. Il retient tout ; c'est pire.*

### RÉACTION am.re.pichon_baguette  —  Une baguette de plus
**Après** : am.pichon_150.arrange (← je dis non) · **Famille** : conséquence immédiate · **Conditions** : —
**PICHON** *(boulanger — sourire — il te tend deux baguettes, il en avait prévu une)*
« Le pain, c'est à cinq heures, et toi tu as dit non à cinq heures et quart, j'ai entendu depuis le fournil. Une baguette de plus, tu la prends, ou tu la donnes à Momo ? »
← **Je la prends** — effets : relation.pichon +1, caisse + — *Tu la prends. Elle est chaude. C'est la seule prime honnête de ta carrière.*
→ **Pour Momo** — effets : vestiaire +, relation.pichon +1 — *Momo la mange sur le parking. Il ne sait pas pourquoi ; il dit merci.*

### RÉACTION am.re.dede_sanglier  —  Le sanglier
**Après** : am.sanglier.surface (les deux) · **Famille** : tiers qui commente · **Conditions** : —
**DÉDÉ** *(coach bénévole — neutre — il regarde la surface, la casquette en arrière)*
« Bon, on va pas se mentir : c'est pas un sanglier, c'est le cousin de Gégé qui a fait demi-tour avec son tracteur, mais on dit sanglier. Tu le dis aussi, ou tu dis tracteur ? »
← **Sanglier** — effets : tribunes +, vestiaire + — *Tu dis sanglier. Tout le monde dit sanglier. L'Écho titre sanglier.*
→ **Tracteur** — effets : direction +, tribunes − — *Tu dis tracteur. Personne ne t'écoute ; le sanglier est déjà sur le maillot.*

### RÉACTION am.re.lea_marches  —  Sur les marches
**Après** : am.district.salle_des_mariages (les deux) · **Famille** : conséquence immédiate · **Conditions** : —
**LÉA** *(L'Écho — neutre — sur les marches de la mairie, un carnet)*
« Vous confirmez ? Trois matchs, ou un sursis, on ne m'a pas dit lequel, la porte était fermée. Vous me dites, ou j'attends le procès-verbal ? »
← **Je vous dis** — effets : tribunes +, relation.lea +1 — *Tu dis. Elle écrit juste. C'est L'Écho ; c'est tendre ; c'est vrai.*
→ **Attendez le procès-verbal** — effets : direction +, relation.lea −1 — *Elle attend. Roux le lui donne ; il souligne ta phrase.*

### RÉACTION am.re.gege_cousin_poucet  —  Le cousin de Gégé
**Après** : am.coupe_poucet.match (les deux) · **Famille** : tiers qui commente · **Conditions** : —
**GÉGÉ** *(capo, en visite — sourire — il a un cousin dans la tribune ; il n'a pas d'écharpe du village, il en a fabriqué une)*
« La tribune n'oublie rien, même une tribune de deux mille qui n'existe qu'un dimanche ; mon cousin m'a dit de venir voir le petit qui marquait leur dix. Tu montes boire un coup, ou tu restes en bas ? »
← **Un coup, avec vous** — effets : tribunes +, relation.gege +1, set: ami_ultras — *Tu montes. Il te raconte la Marmite. Tu ne connais pas ; tu connaîtras.*
→ **Avec le village** — effets : vestiaire +, tribunes + — *Tu restes. Il comprend. Il te dit qu'il a un cousin partout ; c'est vrai.*

### RÉACTION am.re.belle_mere_part  —  La part au chaud
**Après** : am.repas.gigot (→ dimanche prochain) · **Famille** : tiers qui commente · **Conditions** : —
**LA BELLE-MÈRE** *(voix sans portrait — au téléphone, le four derrière elle)*
« La part est au chaud depuis midi et demi, elle est à dix-neuf heures maintenant, et Camille n'a rien dit, c'est pire. Vous passez la chercher, ou je la donne au chien ? »
← **Je passe** — effets : relation.camille +1, force −1 — *Tu passes. Elle te la donne froide ; elle l'a sortie du four exprès.*
→ **Au chien, madame** — effets : relation.camille −1, tribunes + — *Elle n'a pas de chien. Elle la jette. Camille regarde.*

### RÉACTION am.re.roux_prenom  —  Le prénom
**Après** : am.selection_ligue.roux (← j'y vais) · **Famille** : conséquence immédiate · **Conditions** : —
**ROUX** *(président du district — sourire — il a écrit ton prénom à la main sur la lettre, au-dessus du nom tapé)*
« Le district, c'est la base, et la base a retenu votre prénom, c'est rare, Legruet ne retient jamais le mien. Vous me rappelez le sien, ou vous ne le savez pas non plus ? »
← **Noël, monsieur Roux** — effets : direction +, relation.roux +1 — *Il note. Il l'oubliera ; il notera encore.*
→ **Je ne le sais pas** — effets : relation.roux +1, tribunes + — *Il rit. C'est la seule fois où Roux rit ; c'est un bon souvenir.*

### RÉACTION am.re.momo_barque  —  La deuxième barque
**Après** : am.car.bateau (← la barque) · **Famille** : conséquence immédiate · **Conditions** : —
**MOMO** *(voix sans portrait — trempé, il tient le sac de ballons au-dessus de sa tête ; il n'a pas lâché)*
« J'étais dans la deuxième barque, celle qui a pris l'eau, et le sac de ballons est sec, c'est moi qui l'ai tenu. Tu le dis à Dédé, ou tu le dis à L'Écho ? »
← **À L'Écho** — effets : tribunes +, relation.lea +1 — *Léa écrit « Momo et le sac ». C'est le titre ; il l'encadre.*
→ **À Dédé** — effets : vestiaire +, relation.dede +1 — *Dédé dit « bon ». Il donne le sac à Momo pour toute la saison ; c'est une récompense, il croit.*

---

## 8. Les manchettes de Une (gabarit § 4.5)

Cinquante-cinq manchettes propres au rôle (les titres de la spec § 4.3-4.4 « {NOM}, {PRIX} MILLIONS ET UN ALLER SIMPLE » et « STADE PLEIN POUR LE JUBILÉ DE {NOM} » sont raccourcis de deux mots pour tenir dans les 44 caractères de la charte avec le nom-test BRÉHAUT-LEMOINE) : quinze pour `pepite`, treize pour `fin_de_contrat`, quatorze pour les postulats de seconde vague, treize pour le joueur amateur. Toutes lisent une trace de la saison par `journal_has('…')` ; le chapitre 20 harmonise la voix des journaux et ajoute les manchettes des traces qui n'en ont pas encore (`tifo_adieu`, `montbeliac_cash`, `honnete_tribune` côté Gazette, `rouvier_desert`).

| id | Journal | Prio | Condition | Titre | Sous-titre | Photo · Réaction |
|---|---|---|---|---|---|---|
| `une.pepite.aller_simple` | quotidien | 4 | `journal_has('vendu_d1')` | **{NOM} : {PRIX} MILLIONS, ALLER SIMPLE** | L'usine a vendu son jeune de l'année. Elle en a acheté un autre avec ; il a seize ans et une mère. | jp.pepite.p3_vente · co.re.josiane_a_lu |
| `une.pepite.enfant_reste` | echo | 3 | `journal_has('fidele') && flag('enfant_du_pays')` | **L'ENFANT DU PAYS RESTE AU PAYS** | Vingt mètres de bâche, une promesse tenue. Gégé : « La tribune n'oublie rien. » Elle repeint. | jp.tifo.bache · co.re.gege_decoupe |
| `une.pepite.honnete` | echo | 2 | `journal_has('honnete_tribune')` | **IL N'A RIEN PROMIS, ON L'AIME QUAND MÊME** | La Nord a gardé la bâche sans la phrase. {prenom} {nom} a dit « je ne sais pas » au micro ; c'est rare. | jp.tifo.bache · co.re.vecchio_garde |
| `une.pepite.bleu_cobalt` | quotidien | 3 | `journal_has('international') && flag('binational_choisi') != 'kambara'` | **{NOM} EN BLEU COBALT** | Première sélection. Le club « a râlé pour la cheville » ; la Fédération « verra ça après le Congrès ». | jp.selection.liste · co.re.camille_journal |
| `une.pepite.forfait` | gazette | 3 | `journal_has('selection_refusee')` | **FORFAIT POUR LA CHEVILLE, TITULAIRE DIMANCHE** | La Fédération a noté. « On ne dit pas non deux fois », dit Legruet. {NOM} a dit non une fois. | jp.selection.liste · co.re.meneche_no_comment |
| `une.pepite.le_meilleur` | gazette | 3 | `journal_has('special')` | **« LE MEILLEUR » : C'EST LUI QUI LE DIT** | Première conférence, première phrase. Le vestiaire a découpé ; la phrase est en jaune dans un casier. | jp.une.conference · co.re.vecchio_garde |
| `une.pepite.boude` | gazette | 2 | `journal_has('banc_boude')` | **LA PÉPITE BOUDE SUR LE BANC** | Sur le banc, {prenom} {nom} a tapé à la porte du coach. Le coach a ouvert, écouté, refermé. | jp.vukic.banc · co.re.camille_journal |
| `une.pepite.plus_de_passe` | gazette | 3 | `journal_has('mouton_noir')` | **PLUS PERSONNE NE LUI FAIT LA PASSE** | Même au toro. Bréhaut : « Le groupe vit bien. » Sans lui, visiblement. | jp.brassard.toro · co.re.vecchio_garde |
| `une.pepite.deux_pepites` | echo | 2 | `journal_has('mentor_mbako')` | **DEUX PÉPITES, UN VESTIAIRE** | Lian Mbako, seize ans, apprend le contrôle après l'entraînement. Sa mère « n'a besoin de personne » ; lui, si. | jp.mbako.mere · co.re.gege_decoupe |
| `une.pepite.or` | quotidien | 3 | `journal_has('exil_dore')` | **PARTI POUR L'OR** | Le championnat du désert paie comme l'or. Nassir : « Ce n'est pas un club, c'est un actif. » {NOM} en est une ligne. | jp.exil.nassir · co.re.camille_journal |
| `une.pepite.montre` | gazette | 2 | `journal_has('offshore')` | **LE COUSIN A UNE MONTRE** | Une société aux îles, une image à dix-neuf ans, un cousin au parking. « Vu au parking » a vu. | jp.image.cousin · co.re.camille_journal |
| `une.pepite.rival` | gazette | 4 | `journal_has('parti_chez_rival')` | **{NOM} CHEZ L'ENNEMI, AU CENTIME** | La clause levée par {rival}. Gégé a décroché le nom du local ; il l'a gardé « pour le derby ». | jp.clause.rival · co.re.gege_decoupe |
| `une.pepite.fax` | quotidien | 3 | `journal_has('fax_rate')` | **MORT DANS UN FAX À 23 H 59** | La page trois s'est coincée. Josiane « en a vu passer, jamais un qui se coince ». Le fax a été promu. | jp.clause.fax · co.re.josiane_a_lu |
| `une.pepite.flacon` | quotidien | 4 | `journal_has('flacon_b')` | **LE FLACON B DE {NOM}** | Deux ans. Le médecin du club « a très envie de vacances ». Sabatier « ne commente pas ». | jp.pharmacie.flacon_b · co.re.camille_journal |
| `une.fin.un_an_de_plus` | quotidien | 3 | `journal_has('prolonge')` | **UN AN DE PLUS POUR {NOM}** | Trente-deux ans, un genou, une page. Aulard « n'a pas le temps », mais il a signé. | jp.fin.f3_juin · co.re.vecchio_garde |
| `une.fin.vestiaire` | echo | 3 | `journal_has('prolonge_vestiaire')` | **PROLONGÉ PAR LE VESTIAIRE** | Vingt-deux noms par fax, Vecchio deux fois. Bréhaut : « Le groupe vit bien. » Le président a lu, finalement. | jp.porte.petition · co.re.josiane_a_lu |
| `une.fin.sans_club` | gazette | 4 | `journal_has('sans_club')` | **{NOM}, 32 ANS, SANS CLUB** | Le téléphone n'a pas sonné en août. Il était débranché ; personne n'avait remarqué. | jp.fin.f3_juin · co.re.camille_journal |
| `une.fin.prodigue` | echo | 3 | `journal_has('maison_pays_signee')` | **L'ENFANT PRODIGUE REVIENT EN D2** | Le club de sa ville voulait un nom pour la montée. Sa mère a appelé le président avant l'agent. | jp.maison.offre_d2 · co.re.gege_decoupe |
| `une.fin.jubile` | echo | 3 | `journal_has('jubile_fait')` | **JUBILÉ DE {NOM} : STADE PLEIN** | Tour d'honneur, Vecchio dans les buts. À la fin, il a demandé où était le vestiaire. Par habitude. | jp.jubile.jour · co.re.vecchio_garde |
| `une.fin.banc` | quotidien | 4 | `flag('vers_entraineur') && journal_has('vers_entraineur')` | **{NOM} PASSE SUR LE BANC** | La réserve a un entraîneur. Vukić « le disait parce que personne ne le dirait ». Il l'a dit. | jp.fin.s1_veille · co.re.josiane_a_lu |
| `une.fin.samedi_dimanche` | gazette | 3 | `journal_has('consultant')` | **IL JOUE LE SAMEDI, IL JUGE LE DIMANCHE** | Le fauteuil à côté de Ménèche. Le président « n'a pas le temps » de regarder ; Josiane lui raconte. | jp.consultant.plateau · co.re.meneche_no_comment |
| `une.fin.chapitre_trois` | gazette | 3 | `journal_has('memoires_verite')` | **LE CHAPITRE 3 QUE LE VESTIAIRE N'A PAS AIMÉ** | Les mémoires de {prenom} {nom}, page 47. Bréhaut a lu. « Le groupe vit bien. » Sans passe. | jp.memoires.chapitre_trois · co.re.camille_journal |
| `une.fin.enregistrement` | gazette | 4 | `journal_has('pari')` | **UN ENREGISTREMENT, UN BAR D'HÔTEL** | La Plume « a les documents ». Le nombre de corners, la date, une voix. Fardelli « ne connaît pas Tony ». | jp.pari.plume · co.re.camille_journal |
| `une.fin.dernier_mot` | quotidien | 3 | `journal_has('genou_grave')` | **LE GENOU A EU LE DERNIER MOT** | Sabatier avait dit « tu ne sens plus rien ». C'était le problème. | jp.genou.rechute · co.re.vecchio_garde |
| `une.fin.genou_parle` | echo | 2 | `journal_has('genou_opere')` | **LE GENOU DE {NOM} A PARLÉ** | Six mois de tribune. Rouvier compte les flexions à voix haute ; on l'entend depuis la buvette. | jp.genou.plateaux · co.re.camille_journal |
| `une.fin.dernier_cobalt` | quotidien | 3 | `journal_has('adieu_cobalt')` | **UNE DERNIÈRE FOIS EN BLEU COBALT** | Pris « pour le vestiaire, plus pour les jambes ». Fauvel a rendu la clé de la chambre : « On est un groupe. » | jp.derniere.legruet · co.re.vecchio_garde |
| `une.binational.autre_maillot` | gazette | 4 | `journal_has('binational_choisi') && flag('binational_choisi') == 'kambara'` | **IL A CHOISI L'AUTRE MAILLOT** | Le stade a sifflé à chaque touche. Sa mère a envoyé un maillot signé par le quartier. | jp.binational.b2_mars · co.re.vence_direct |
| `une.binational.bleu` | quotidien | 3 | `journal_has('binational_choisi') && flag('binational_choisi') == 'cobalts'` | **{NOM} A CHOISI LE COBALT** | Deux lettres, un formulaire bleu. Brissac : « Les chiffres sont têtus, les joueurs aussi. » | jp.binational.b2_mars · co.re.camille_journal |
| `une.banc_dore.retour` | quotidien | 4 | `journal_has('banc_dore_retour')` | **RETOUR DU DÉSERT À MOITIÉ PRIX** | Vukić avait « un poste, moins payé, plus joué ». Nassir a signé la sortie sans la lire. | jp.banc_dore.d3_coach_europe · co.re.nassir_reviendrai |
| `une.banc_dore.table` | echo | 2 | `journal_has('table_partagee')` | **IL A ATTENDU LE COUCHER DU SOLEIL** | Au désert, {prenom} {nom} a mangé avec le vestiaire, à l'heure du vestiaire. On l'appelle par son prénom. | jp.banc_dore.d2_jeune · co.re.camille_journal |
| `une.geant.moitie` | quotidien | 3 | `journal_has('salaire_baisse')` | **LE CAPITAINE DIVISE SON SALAIRE PAR DEUX** | Ligne trois du budget. Vialat « ne juge pas, elle compte » ; ça tombait juste. | jp.geant.g2_vialat · co.re.josiane_a_lu |
| `une.geant.sept_gamins` | echo | 3 | `journal_has('jeunes_lances')` | **SEPT GAMINS ET UN CAPITAINE** | Le géant déchu joue avec son centre de formation. Deux à un ; le deux a dix-sept ans. | jp.geant.g3_jeunes · co.re.gege_decoupe |
| `une.village.fusion` | echo | 4 | `journal_has('village_fusionne')` | **BOISNOIR-MONTBÉLIAC, LE MARIAGE** | Vert et marron. Madame Aubert : « Le stade, c'est de l'argent public. » Dédé est « bénévole associé ». | am.village.v3_fusion · co.re.camille_journal |
| `une.village.marron` | echo | 3 | `journal_has('copains_gardes')` | **LE MAILLOT MARRON A UN AN DE PLUS** | Momo a signé sur une serviette. Le maire a plié le chevalet. On joue à onze et demi. | am.village.v3_fusion · co.re.vecchio_garde |
| `une.village.doudoune` | echo | 3 | `journal_has('essai_pro')` | **LA DOUDOUNE EST PASSÉE À {VILLE}** | Un essai à Valdorne, mardi, sous la pluie. Barbier « l'a vu jouer ». Le patron a compté les jours. | am.doudoune.doudoune · am.re.dede_juin |
| `une.village.cinq_cents` | gazette | 3 | `journal_has('match_arrange')` | **LE MAINTIEN À CINQ CENTS FRANCS** | Un homme que personne ne connaît, une buvette, une photo. Le district « examine ». Pichon avait dit non. | am.pichon_150.arrange · co.re.camille_journal |
| `une.village.poucet` | echo | 4 | `journal_has('but_poucet')` | **LE VILLAGE A MARQUÉ CONTRE LA D1** | Deux mille places, huit cents habitants, un but. Le maillot du pro est au bar, sous verre ; Gérard « ne le vend pas ». | am.coupe_poucet.match · co.re.vecchio_garde |
| `une.village.tenu` | echo | 3 | `journal_has('poucet_tenu')` | **HUIT CENTS HABITANTS ONT TENU UNE MI-TEMPS** | Le petit marquait leur dix. Le dix lui a dit son prénom à la trentième ; il l'avait lu ici. | am.coupe_poucet.match · am.re.gege_cousin_poucet |
| `une.village.rendu` | echo | 3 | `journal_has('but_dorne')` | **LE RENDU DE VALDORNE A MARQUÉ À LA DORNE** | Contre l'équipe qui l'avait rendu, sans pluie. Barbier « l'avait vu jouer sous la pluie » ; il a écrit une page. | am.academie.s1_twist · co.re.barbier_doudoune |
| `une.village.barque` | echo | 3 | `journal_has('barque_ile_verte')` | **ONZE JOUEURS, DEUX BARQUES, UN MATCH** | Le bateau d'Île-Verte était parti. Le car de Gérard, en panne. Ils ont perdu ; « la plus belle défaite du canton ». | am.car.bateau · am.re.momo_barque |
| `une.village.merguez` | gazette | 2 | `journal_has('bateau_rate')` | **FORFAIT SUR LE QUAI, MERGUEZ À VOLONTÉ** | Le district « examine ». Son président est venu manger : « Le district, c'est la base. » | am.car.bateau · co.re.meneche_no_comment |
| `une.village.ligue` | echo | 3 | `journal_has('selection_ligue')` | **{NOM} A JOUÉ POUR LA LIGUE** | La colonne « amateurs » a un chiffre. Brissac a souligné ; « les chiffres sont têtus ». Barbier était sur la butte. | am.selection_ligue.dorne · am.re.dede_juin |
| `une.village.radie` | gazette | 4 | `journal_has('radie_district')` | **RADIÉ UN AN : IL JOUE EN SALLE LE JEUDI** | Deux convocations, une salle des mariages, un vase en plastique. « Le district, c'est la base », et la base ne convoque pas deux fois pour rien. | am.district.recidive · co.re.camille_journal |
| `une.village.chomage` | echo | 3 | `journal_has('chomage_village')` | **QUATRE LUNDIS, UNE PORTE** | Le patron a compté. Le village n'a que deux employeurs ; le second pèse ses mots. | am.patron.licenciement · co.re.camille_journal |
| `une.village.genou` | echo | 2 | `journal_has('apres_le_foot')` | **{NOM} A ARRÊTÉ À VINGT ET UN ANS** | Un genou, une photo au bar, à l'endroit. Personne n'a fait de blague pendant une semaine. | am.genou_21.sifflet · — (drame : aucune réaction) |
| `une.croises.debout` | quotidien | 3 | `journal_has('croises_rejoues')` | **DEBOUT À LA FIN DU DERBY** | Même pelouse, même défenseur, un an après. Le défenseur a baissé les yeux le premier. | jp.croises.c2_derby · co.re.gege_decoupe |
| `une.croises.petit` | echo | 2 | `journal_has('genou_petit_dit')` | **IL A EXPLIQUÉ LE GENOU AU PETIT** | Lian Mbako a sa première poche de glace. {prenom} {nom} lui a dit l'escalier. Sa mère, dehors, « n'a besoin de personne ». | jp.croises.s1_twist · co.re.mere_mbako_souffle |
| `une.binational.deux_maillots` | gazette | 3 | `journal_has('maillot_dessous')` | **DEUX MAILLOTS, UN JOUEUR** | Le quartier avait signé le second. Le stade a vu le premier ; à la fin, l'autre. Il s'est tu, ou pas. | jp.binational.b4_virage · co.re.vence_direct |
| `une.binational.respect` | quotidien | 3 | `journal_has('blesse_par_respect')` | **BLESSÉ PAR RESPECT** | Les Cobalts jouaient le Kambara. {NOM} s'est « senti blessé ». Sabatier a signé ; « ça reste entre la table et moi ». | jp.binational.s1_twist · jp.re.sabatier_deuxieme_certificat |
| `une.banc_dore.ligne` | gazette | 2 | `journal_has('ligne_apres')` | **LA LIGNE D'APRÈS** | Au désert, il conseille le jeune qui a pris sa place. Nassir : « Ce n'est pas un club, c'est un actif. » Il s'amortit sur cinq ans. | jp.banc_dore.s2_rentree · jp.re.nassir_amortit |
| `une.banc_dore.craie` | echo | 3 | `journal_has('retour_promis_gege')` | **IL A PROMIS DE RENTRER. À LA CRAIE** | Trois heures du matin au local, un écran qui bloque. Gégé a gravé la date sur le mur ; « la tribune n'oublie rien ». | jp.banc_dore.s2_veille · co.re.gege_decoupe |
| `une.geant.ligne_douze` | quotidien | 3 | `journal_has('primes_renoncees')` | **LE CAPITAINE RENONCE À LA LIGNE DOUZE** | Les primes de remontée n'existaient pas dans le budget. Vialat « ne juge pas, elle compte ». Les gamins ont signé après lui. | jp.geant.s1_twist · co.re.josiane_a_lu |
| `une.geant.remonte` | echo | 4 | `journal_has('geant_remonte')` | **LE GÉANT REMONTE. SEPT ÉCUSSONS** | Deux saisons, un brassard, dix gamins. Le septième écusson est peint ; « ce n'est pas un titre, c'est plus grand ». | jp.geant.s1_premier_jour · co.re.gege_decoupe |
| `une.fin.quinzieme` | quotidien | 2 | `journal_has('quinzieme_jouee') && flag('prolonge')` | **QUATORZE CROIX, ET LA QUINZIÈME** | La clause disait quinze. Sabatier comptait les croix au capuchon ; « ça reste entre la table et moi ». Le genou a tenu. | jp.fin.f2b_quinzieme · co.re.vecchio_garde |
| `une.pepite.dernier_bloc` | echo | 2 | `journal_has('dernier_bloc_joue') && flag('vendu_d1')` | **QUATRE-VINGT-DIX MINUTES, PUIS L'AVION** | La veille de la vente, il a tout joué. Son agent regardait sa montre pendant le tour d'honneur. | jp.pepite.p2b_dernier_bloc · jp.re.lea_aller_simple |

---

## 9. Les temps forts de Grand Match (famille joueur)

Vingt temps forts pour les Grands Matchs du joueur (pro et amateur : les amateurs jouent les mêmes situations avec Dédé, Momo et Karim à la place de Vukić, Bréhaut et Dembo ; le moteur substitue par `roles:`). Format : situation · locuteur · SÛR / ÉQUILIBRÉ / RISQUÉ (c'est la seule information chiffrée du jeu ; les probabilités sont celles du moteur, pas du texte) · effets · condition.

| # | id | Situation, locuteur | SÛR | ÉQUILIBRÉ | RISQUÉ | Condition |
|---|---|---|---|---|---|---|
| 1 | `jp.te.penalty` | 88e, un partout ; Bréhaut : « Lâche ce ballon. » | Je le lui laisse (vestiaire +) | Je tire placé (tribunes ++ / −) | Je tire en force (tribunes +++ / −−, vestiaire −) | — |
| 2 | `jp.te.main` | le ballon est là, le gardien aussi, l'arbitre regarde ailleurs ; ta voix intérieure | Je la joue au pied | Je laisse passer | La main (`year < 2016` ; pose `main_de_dieu`, lu par ch. 02 Colline, ch. 15, ch. 31 carte-légende) | monde sans vidéo |
| 3 | `jp.te.tacle_derriere` | leur dix part seul ; il te chambre depuis soixante minutes | Je cours | Je le laisse | Tacle par derrière (direction −−, 20 % « cheville cassée en face », pose `tacle_lache`) | — |
| 4 | `jp.te.scorpion` | tu es gardien (Vecchio suspendu, `gants_pretes`) ; ta voix intérieure | À deux mains | Du poing | Le scorpion (tribunes +++ ou vestiaire −−) | `flag('gants_pretes')` |
| 5 | `jp.te.genou` | tu sens le genou à la 70e ; Sabatier depuis le banc : « Ça reste entre la table et moi. » | Je demande le changement | Je serre | Je joue les vingt minutes (`genou` : 30 % `genou_grave`) | `flag('genou')` |
| 6 | `jp.te.corners` | Tony a parié sur le nombre de corners ; toi tu tires les corners | Je tire normalement | Je gagne du temps | Je force le corner (pose `corner_force`, lu par jp.pari.plume) | `flag('pari')` |
| 7 | `jp.te.dembo` | Dembo veut le ballon dans la surface, tu es mieux placé | Je lui donne (vestiaire +) | Je frappe | Je dribble le gardien (tribunes +++ / vestiaire −−) | `chars.dembo.statut == 'club'` |
| 8 | `jp.te.mbako_face` | Mbako en face, seul contre toi, 90e | Je temporise | Je tacle propre | Je tacle fort (20 % `mbako_blesse_par_toi`) | `flag('mbako_vendu')` |
| 9 | `jp.te.capitaine_rouge` | ton coéquipier prend un rouge injuste ; tu es capitaine ; Colline : « J'ai vu. » | Je calme le groupe | Je discute | Je conteste (rouge aussi ; `capitaine` → vestiaire ++, direction −−) | `flag('capitaine')` |
| 10 | `jp.te.hymne` | avant le match international, la caméra sur ta bouche ; deux hymnes | Je chante | Je regarde le sol | Je ne chante pas (`binational_choisi`, lu par ch. 14 « l'hymne ») | `flag('international')` |
| 11 | `jp.te.derby_provoc` | le rival te chambre sur ton transfert ; Gégé chante ton nom, ou son contraire | Je réponds sur le terrain | Je le regarde | Je réponds (jaune, tribunes ++) | derby |
| 12 | `jp.te.tir_au_but` | cinquième tireur ; Fauvel : « Tu es le cinquième. J'étais le cinquième en 1990. » | Je laisse Fauvel | Je tire placé | Je tire une panenka (tribunes +++ / −−−) | sélection |
| 13 | `jp.te.bouteille` | mi-temps, la caméra du sponsor, les bouteilles orange devant toi | Je bois | Je les laisse | Je les écarte (pose `bouteilles_ecartees`, Destin secret « La bouteille », ch. 30 ; lu par ch. 01 Bréhaut) | `year >= 2003` |
| 14 | `jp.te.coup_de_tete` | 108e de ta dernière finale ; leur défenseur : « Ta sœur, je la préfère à toi. » | Je m'éloigne | Je réponds | Coup de tête dans le sternum (fin `jp_coup_de_tete`) | dernier match d'une carrière, `age >= 34` |
| 15 | `jp.te.kung_fu` | expulsé, un supporter t'insulte à la sortie ; ta voix intérieure | Je rentre | Je le regarde | Le coup de pied retourné (fin `jp_kungfu`) | après un rouge, `gauges.tribunes <= 30` |
| 16 | `jp.te.morsure` | corps à corps, une épaule à hauteur de bouche ; ta voix intérieure | Je pousse | Je tiens | Je mords (pose `morsure` ; troisième fois : fin `jp_morsure`) | — |
| 17 | `jp.te.gigi_sort` | Vecchio veut sortir à la 85e pour l'ovation ; il te fait signe | Je fais signe au banc | Je joue | Je le retiens (tribunes +, vestiaire +, relation.vecchio +1) | `chars.vecchio.statut == 'club'` |
| 18 | `jp.te.rentre_blesse` | Bréhaut te pousse sur la pelouse ; le kop scande ton nom ; le genou dit non | Je reste assis | Je rentre dix minutes | Je rentre sous les cris (`jp.corps.retour_terrain` ∃ absorbé) | `flag('genou') && gauges.tribunes < 30` |
| 19 | `am.te.sanglier_trou` | amateur : le ballon file vers un trou de sanglier ; tu y vas ? | Je laisse | Je contourne | J'y vais (15 % entorse) | `flag('sanglier_embleme')` |
| 20 | `am.te.karim_face` | amateur : Karim, en vert, part au but ; ton copain | Je le laisse | Je tacle propre | Je tacle comme un ancien (20 % `carton_karim`) | `flag('passe_a_montbeliac')` inversé (Karim est parti) |

---

## 10. Les transitions (Cartes Destin, § 3.3 de la charte)

Une Carte Destin au plus par saison, au Bilan ou à l'hiver, jamais si une jauge est sous 20 (sauf Parole ≥ +3). Le chapitre 30 écrit les set-pieces et la carte « Le monde réagit » ; ce paragraphe fixe le texte de la carte déclencheuse pour le rôle joueur, ses variantes lues sur les traces de ce chapitre, et **ce que le rôle suivant lit**.

### 10.1 Joueur amateur → Joueur pro — *La doudoune*
**Condition** : `season >= 1 && gauges.direction > 50 && (flag('essai_juin') || flag('essai_pro'))` · **Locuteur** : Barbier · « Je bosse pour Valdorne, et Valdorne a relu mon rapport ; je l'ai vu jouer sous la pluie, j'ai écrit « à revoir en juin », on est en juin. Tu signes pro, ou tu restes ? » · Variante `flag('rapport_trop_lent')` : l'essai est refusé (« trop lent », il pleuvait) ; la carte ne vient pas, Barbier téléphone (une ligne). Variante `flag('essai_seul')` : « sans Fardelli, on a pris ton nom, pas celui de l'agent ». · **Passation** : VESTIAIRE 50, TRIBUNES 40 + 0,3 × ancienne, DIRECTION 55, CAISSE 50 ; le postulat d'arrivée est `pepite` (D2) si `age <= 21`, sinon un club de D2 tiré, ou `lache_academie` → `pepite` avec `agent_fardelli` conservé. · **Ce que le pro lit** : `essai_pro`, `essai_seul`, `sans_agent`/`agent_fardelli`, `copains_gardes` (Momo téléphone en S0), `patron_furieux` (Fardelli : « ton patron a dit du mal de toi »), `croissant_promis`/`pichon` (le coup de fil de cinq heures), `sac_porte` (jp.brassard.toro), `montbeliac_cash` (Roux, plus tard), `boucher_sponsor` (Dupuis en surgelés, 2015).

### 10.2 Joueur amateur → Entraîneur amateur — *Le sifflet*
**Condition** : `age >= 34` ou `flag('dede_sifflet')` (reconversion précoce, `am.genou_21`) · **Locuteur** : Dédé · « Bon, on va pas se mentir : tes genoux, c'est fini, et mon sifflet, il est à toi. Tu le prends, ou tu regardes encore une saison ? » · Variante `flag('banc_regarde')` : « tu l'avais posé entre nous, l'an dernier ». · **Ce que l'entraîneur lit** (ch. 11) : `dede_sifflet` (Dédé devient l'adjoint bénévole), `radie_district` (radié comme joueur, pas comme coach : Roux le note), `village_fusionne`/`copains_gardes` (le club que tu entraînes est celui d'avant ou celui d'après), `sanglier_embleme`, `boucher_sponsor`.

### 10.3 Joueur amateur → Président amateur — *Les clés*
**Condition** : retraite, `gauges.tribunes >= 50 && gauges.caisse >= 55` · **Locuteur** : Pichon · « Le pain, c'est à cinq heures, et le club, c'est à toi ; les clés sont sur la baguette, Gérard a le double. » (`co.pichon.faveur_les_cles`, ch. 02) · Variante `flag('gerard_confiance')` : « tu connais le double fond de la boîte ; c'est déjà ça ». · **Ce que le président amateur lit** (ch. 13) : `gerard_confiance`, `enveloppe_essence`, `match_arrange`/`match_propre`, `district_sanction`/`district_relaxe` (Roux : « vous connaissez la salle des mariages »), `neveu_forme`, `paulette_emmenee`, `village_fusionne` (la fusion a déjà eu lieu une fois).

### 10.4 Joueur pro → Entraîneur — *Le banc de la réserve*
**Condition** : `age >= 32 || flag('genou')`, et `flag('diplome')` (sinon la dérogation de six mois, ch. 11 : `diplome_arrange`) · **Locuteur** : Vukić · « Tes jambes parlent, tu le sais. La réserve n'a pas d'entraîneur. Tu passes ton diplôme cet été ? » (existant, `roles.yaml`) · Variantes : `flag('vukic_dauphin')` → « je t'ai gardé le poste d'adjoint ici, chez moi » (le postulat d'arrivée est `interimaire` avec `suit_vukic`) ; `flag('recule_poste')` → « tu vois le jeu de derrière, c'est de là qu'on entraîne » ; `flag('dernier_annonce')` → « tu l'as dit à Camille avant de me le dire ; c'est bon signe » ; `flag('genou_grave')` → la carte est forcée (transition forcée, liseré or). · **Ce que l'entraîneur lit** (ch. 11) : `diplome`, `clow_stage`/`clow_stage_ailleurs`, `brehaut_adjoint`/`brehaut_rival_banc`, `capitaine`, `international`, `special` (Ménèche : « vous étiez déjà spécial joueur »), `mentor_mbako`/`rival_mbako` (Mbako coach rival en 2018), `flacon_b` (la commission), `fils_spirituel` (Vukić est ton patron, ou ton égal), `gigi_staff`, `suit_vukic`, `consultant` (« vous jugiez les coachs le dimanche »).

### 10.5 Joueur pro → Directeur sportif — *Reste, mais en costume*
**Condition** : `age >= 30 && gauges.direction >= 60 && flag('capitaine')` · **Locuteur** : Aulard · « Reste, mais en costume ; j'ai pas le temps, j'ai un empire, et l'empire a besoin de quelqu'un qui lit les contrats. Tu lis, ou tu joues encore un an ? » · Variantes : `flag('page_lue')` → « tu as lu la page deux, tu es le seul » ; `flag('agent_solvang')` → « Solvang dit que tu comptes ; c'est un compliment chez elle » ; `flag('salaire_baisse')` (capitaine_dechu) → « tu as divisé ta ligne par deux, tu sais ce que ça coûte ». · **Ce que le DS lit** (ch. 12) : `agent_fardelli`/`agent_solvang`/`sans_agent` (l'agent d'en face te connaît), `offshore`/`regularise` (Vialat), `vendu_d1` (le prix de référence), `genou_cache`/`bilan_arrondi` (la visite médicale cachée : tu sais comment on arrondit), `brehaut_diplome` (Bréhaut ton prédécesseur ou ton successeur), `mercenaire`, `dembo_servi` (Dembo à 60 millions d'Al-Dorado), `page_lue`.

### 10.6 Joueur pro → Président amateur — *Le club de ton enfance*
**Condition** : retraite, `gauges.tribunes >= 50 && gauges.caisse >= 60` · **Locuteur** : Gérard · « Le club de ton enfance te tend les bras, et la caisse ; ici, on payait en bières, et on n'a plus de bières. Tu reprends, ou tu envoies un chèque ? » · Variantes : `flag('croissant_promis')` → Pichon parle à la place de Gérard ; `flag('maison_pays_signee')` → « tu as déjà rejoué ici, en D2 ; le village, c'est en dessous » ; `flag('jubile_charite')` → « la recette du jubilé est déjà dans la boîte ; tu sais donc où est la boîte ». · **Ce que le président amateur lit** (ch. 13) : `jubile_charite`, `international` (« un international à Boisnoir »), `enfant_du_pays`, `maison_pays`, `pari`/`pari_refuse` (Roux), `consultant` (Léa : « vous jugiez à la télé »), `mouton_noir` (Dédé : « on m'a dit que personne ne te faisait la passe »).

### 10.7 Joueur pro → Sélectionneur ou Fédération — *La voie de la légende*
**Condition** : `flag('legende')` (cinquante sélections et un titre majeur ; posé par le moteur quand `vars.selections >= 50 && titres.majeurs >= 1`) · **Locuteur** : Legruet · « Cher ami, on verra ça après le Congrès, et le Congrès, c'est demain ; la Fédération a besoin d'un nom, et le vôtre a cinquante sélections. Le banc des Cobalts, ou un bureau ? » (`co.legruet` ch. 02, Carte Destin ch. 30) · Variantes : `flag('selection_refusee')` → la carte ne vient pas (« on ne dit pas non deux fois ») ; `flag('binational_choisi') == 'kambara'` → c'est le Kambara qui appelle (ch. 14, `pays_emergent` variante) ; `flag('chambre_fauvel')` → Fauvel plaide pour toi. · **Ce que le sélectionneur lit** (ch. 14) : `international`, `adieu_cobalt`, `chambre_fauvel`, `hymne_1990`, `binational_choisi`, `mot_pour_mere`, `table_partagee` (le jeûne), `capitaine`, `genou_opere`, `mentor_mbako` (Mbako te reçoit ou te combat au Kambara).

### 10.8 Transitions forcées propres au joueur
- **Blessure de carrière** (`genou_grave` posé deux fois, ou `am.genou_21` issue `arrete`) : retraite forcée, écran « Après le foot » précoce avec bonus de compassion (ch. 30) ; le personnage garde ses relations, son compte, et `apres_le_foot`.
- **Suspension longue** (`flacon_b`, `jp_pari`, `jp_kungfu`) : une saison gelée en « Sans emploi » (mini-rôle de dix cartes : Camille, l'argent, les rumeurs, Tony qui rappelle) puis le postulat dérivé `le_revenant` (ch. 30).
- **L'appel du pays** (`binational_choisi == 'kambara'`, à 40 ans, ch. 14) : le Kambara propose le banc de sa sélection, Mbako en face ou à côté.
- **Sacha héritière** (Succession, ch. 90) : si `sacha_nee` et que le joueur meurt ou raccroche après 2010, la troisième carte de Succession propose Sacha, dix-huit à vingt-deux ans, joueuse amateur (`village_endette` ou `lache_academie` avec un trait hérité : `enfant_du_pays` → trait « Fidèle » ; `mercenaire` → trait inversé « Idéaliste »), à la section féminine de Mirevaux si `year >= 2008`.

---

## 11. Les fins propres au rôle (gabarit § 4.8)

Les fins existantes du joueur (`jp_mouton`, `jp_porteparole`, `jp_siffle`, `jp_sandwich`, `jp_place14b`, `jp_fils`, `jp_sansclub`, `jp_panama`, `jp_exil`, `jp_consultant`, `jubile`) gardent titre et épitaphe ; ce paragraphe propose au chapitre 30 des `epitaph_plus` de relecture sur les traces nouvelles, puis écrit les huit fins du joueur amateur et les dix fins de choix, de chaîne et d'imposture du joueur pro listées au brainstorm 02 § 2.9.

### 11.1 `epitaph_plus` proposés pour les fins existantes
- `jp_siffle` : — si `flag('tifo_adieu')` : « La Nord avait applaudi {nom} une fois, en visiteur. C'était la dernière. » · — si `flag('celebre_contre_usine')` : « {prenom} {nom} avait célébré devant l'usine. L'usine a sifflé jusqu'au parking. »
- `jp_porteparole` : — si `flag('petition_portee')` : « La pétition avait vingt-deux noms. La lettre de départ, vingt-trois : {nom} avait signé aussi. »
- `jp_place14b` : — si `flag('coach_critique')` : « « Moi, et il le sait », avait dit {nom} à Ménèche. Le coach le savait. »
- `jp_fils` : — si `flag('fils_docile')` : « Vukić remplissait la page. {prenom} {nom} jouait où c'était écrit. Il jouait bien ; il ne savait plus pourquoi. »
- `jp_sansclub` : — si `flag('bilan_arrondi')` : « Le bilan avait été arrondi. Le genou, non. Le club acheteur a compris en six mois ; {nom}, en dix-huit. »
- `jp_exil` : — si `flag('table_partagee')` : « Au moins, {prenom} {nom} attendait le coucher du soleil avec le vestiaire. C'était le seul horaire qui comptait. »
- `jubile` : — si `flag('paulette_14a')` : « Paulette était à la 14B. Elle a dit que {nom} avait demandé où était le vestiaire. Par habitude. »

### 11.2 Les fins du joueur amateur (rôle `joueur_amateur`, préfixe `am_`)

### FIN am_toro  —  Le toro
**Rôle** : joueur_amateur · **Cause** : VESTIAIRE vide · **Rareté** : commune · **Dorée** : non · **Partageable** : oui
**Épitaphe** : Plus personne ne t'a fait la passe, même au toro du mardi, même les jumeaux. Tu as changé de club de canton ; {prenom} {nom} a porté les ballons ailleurs.
**epitaph_plus** : — si `flag('momo_couvert')` : « Momo t'a fait une passe, une, à la Coupe. C'était pour la chaise. » · — si `flag('village_propre')` : « Les copains partis chez Montbéliac ne te faisaient plus la passe non plus. Ils avaient un brassard. »
**Et si…** : — · **Almanach** : « {annee} · Le toro. »

### FIN am_caid  —  Le caïd
**Rôle** : joueur_amateur · **Cause** : VESTIAIRE pleine · **Rareté** : commune · **Dorée** : non · **Partageable** : oui
**Épitaphe** : Le vestiaire ne jurait que par toi, et le coach a compris qu'il n'avait plus de vestiaire. Il t'a viré pour le reprendre ; {prenom} {nom} a fini la saison au bar, entouré{pg, select, f{e} other{}}.
**epitaph_plus** : — si `flag('dede_sifflet')` : « Dédé t'avait donné son sifflet. Il l'a repris. Il a soufflé dedans une fois, pour vérifier. » · — si `relation.dede <= -2` : « Dédé a dit « on va pas se mentir ». Il a menti un peu ; il avait de la peine. »
**Et si…** : — · **Almanach** : « {annee} · Le caïd. »

### FIN am_comptoir  —  Le comptoir
**Rôle** : joueur_amateur · **Cause** : TRIBUNES (le bistrot) vide · **Rareté** : commune · **Dorée** : non · **Partageable** : oui
**Épitaphe** : Le bar ne t'a plus servi ; Gérard a dit que ce n'était pas lui, que c'était le comptoir. {prenom} {nom} a bu chez Montbéliac, où c'est plus cher et moins bon.
**epitaph_plus** : — si `flag('rentre_tot')` : « Tu rentrais tôt. Le village l'avait remarqué avant toi. » · — si `flag('roux_temoin')` : « Tu avais témoigné devant le district. Le comptoir n'oublie rien non plus. »
**Et si…** : — · **Almanach** : « {annee} · Le comptoir. »

### FIN am_heros  —  Le héros du canton
**Rôle** : joueur_amateur · **Cause** : TRIBUNES pleine · **Rareté** : commune · **Dorée** : non · **Partageable** : oui
**Épitaphe** : Tout le canton voulait te payer un verre, et tu n'as plus eu le temps de t'entraîner. {prenom} {nom} signe des autographes sur des sous-bocks ; Dédé a arrêté de le convoquer.
**epitaph_plus** : — si `flag('sanglier_embleme')` : « Le sanglier est sur le maillot ; {nom} est sur les sous-bocks. Le sanglier joue encore. » · — si `flag('boucher_sponsor')` : « Dupuis a mis ta photo dans la vitrine, entre le rôti et le pâté. Il pesait ses mots. »
**Et si…** : — · **Almanach** : « {annee} · Le héros du canton. »

### FIN am_touche  —  La touche
**Rôle** : joueur_amateur · **Cause** : DIRECTION (le coach) vide · **Rareté** : commune · **Dorée** : non · **Partageable** : oui
**Épitaphe** : Tu as regardé tous les matchs depuis la planche sur les deux parpaings. À la fin, {prenom} {nom} a arrêté ; Dédé n'a pas remarqué tout de suite.
**epitaph_plus** : — si `flag('voisin_appelle')` : « Tu avais gueulé devant tout le monde. Tout le monde s'en souvenait ; le banc aussi. » · — si `flag('district_sanction')` : « Trois matchs de suspension, puis la touche. Le district avait examiné ; Dédé aussi. »
**Et si…** : `le_sifflet` (rejouer en entraîneur amateur, si `dede_sifflet`) · **Almanach** : « {annee} · La touche. »

### FIN am_chouchou  —  Le chouchou
**Rôle** : joueur_amateur · **Cause** : DIRECTION pleine · **Rareté** : commune · **Dorée** : non · **Partageable** : oui
**Épitaphe** : Dédé t'aimait tant qu'il ne voyait plus les autres. Dédé est parti ; le suivant a vu les autres, et pas {prenom} {nom}.
**epitaph_plus** : — si `flag('neveu_forme')` : « Le suivant, c'était le neveu du président. Tu lui avais appris le contrôle. Il s'en est souvenu ; pas de toi. » · — si `flag('village_fusionne')` : « Le suivant venait de Montbéliac. Il ne connaissait pas ton nom ; il connaissait le maillot marron, et il ne l'aimait pas. »
**Et si…** : — · **Almanach** : « {annee} · Le chouchou. »

### FIN am_patron  —  Le patron a dit non
**Rôle** : joueur_amateur · **Cause** : CAISSE (le porte-monnaie) vide · **Rareté** : commune · **Dorée** : non · **Partageable** : oui
**Épitaphe** : Ton employeur a refusé les samedis, puis les lundis, puis toi. {prenom} {nom} a choisi le foot ; le foot ne payait pas l'essence.
**epitaph_plus** : — si `flag('patron_furieux')` : « Trois lundis, il avait dit. Il en a compté quatre. Il comptait bien. » · — si `flag('chomage_village')` : « Le village n'avait que deux patrons. {nom} avait dit non au second aussi ; il pesait ses mots. »
**Et si…** : — · **Almanach** : « {annee} · Le patron a dit non. »

### FIN am_enveloppe  —  L'enveloppe
**Rôle** : joueur_amateur · **Cause** : CAISSE pleine · **Rareté** : commune · **Dorée** : non · **Partageable** : oui
**Épitaphe** : Le club voisin payait au noir, et toi tu prenais ; la Ligue régionale a radié tout le monde. {prenom} {nom} joue en salle, le jeudi, avec Momo.
**epitaph_plus** : — si `flag('montbeliac_cash')` : « Les billets étaient pliés en huit. Léa avait décrit le pliage ; Roux l'a reconnu. » · — si `flag('match_arrange')` : « Cinq cents francs pour lever le pied. Pichon avait dit non ; {nom}, oui ; la baguette de plus est allée à Momo. »
**Et si…** : — · **Almanach** : « {annee} · L'enveloppe. »

### 11.3 Les fins de choix, de chaîne et d'imposture du joueur pro

### FIN jp_croises  —  Les croisés
**Rôle** : joueur · **Cause** : chaîne (jouer blessé au Grand Match avec `genou`, temps fort `jp.te.genou` RISQUÉ, ou `genou_grave` deux fois) · **Rareté** : rare · **Dorée** : non · **Partageable** : oui
**Épitaphe** : Tes ligaments ont rendu leur tablier avant toi. Rouvier a dit qu'elle avait vu pire ; {prenom} {nom} savait qu'elle mentait, et l'a remerciée.
**epitaph_plus** : — si `flag('rouvier_ecoutee')` : « Tu l'avais écoutée une fois. Pas la deuxième. Elle compte encore les flexions, pour quelqu'un d'autre. » · — si `flag('croises_rejoues')` : « Le derby où tu étais tombé, tu l'avais rejoué debout. Celui-là, non. »
**Et si…** : `le_sifflet` (Vukić : le banc de la réserve, transition forcée) · **Almanach** : « {annee} · Les croisés. »

### FIN jp_coup_de_tete  —  Le coup de tête
**Rôle** : joueur · **Cause** : choix (temps fort `jp.te.coup_de_tete`, dernier match d'une carrière) · **Rareté** : rare · **Dorée** : non · **Partageable** : oui
**Épitaphe** : Une insulte sur ta sœur, un coup de tête dans un sternum, une carrière qui s'achève sur un carton rouge. Les statues de {prenom} {nom} ont été commandées quand même.
**epitaph_plus** : — si `flag('jubile_fait')` : « Le jubilé avait eu lieu en mars. Le coup de tête, en mai. Le stade se souvient des deux, dans l'ordre inverse. » · — si `flag('capitaine')` : « Le brassard était sur le bras qui a poussé. Bréhaut l'a ramassé sur la pelouse ; le groupe vit bien. »
**Et si…** : — · **Almanach** : « {annee} · Le coup de tête. »

### FIN jp_kungfu  —  Le kung-fu
**Rôle** : joueur · **Cause** : choix (temps fort `jp.te.kung_fu`) · **Rareté** : rare · **Dorée** : non · **Partageable** : oui
**Épitaphe** : Tu as tenté un coup de pied retourné sur un supporter. Neuf mois de suspension ; {prenom} {nom} a commencé une carrière de comédien{pg, select, f{ne} other{}}, dans une pub pour une boisson orange.
**epitaph_plus** : — si `relation.gege <= -2` : « Le supporter était de la Nord. Gégé n'a pas porté plainte ; la tribune n'oublie rien, elle préfère. » · — si `flag('special')` : « « Le meilleur », avait dit {nom}. Au kung-fu, il l'était. »
**Et si…** : `le_revenant` · **Almanach** : « {annee} · Le kung-fu. »

### FIN jp_morsure  —  La morsure
**Rôle** : joueur · **Cause** : chaîne (trois fois `jp.te.morsure` RISQUÉ) · **Rareté** : rare · **Dorée** : non · **Partageable** : oui
**Épitaphe** : Tu as mordu un défenseur, pour la troisième fois. La commission a jugé que la méthode de {prenom} {nom} manquait de variété ; un dentifrice l'a sponsorisé{pg, select, f{e} other{}}.
**epitaph_plus** : — si `relation.lea >= 1` : « Léa avait deux communiqués, un sérieux, un rigolo. Elle a envoyé le sérieux. Elle a gardé l'autre. » · — si `flag('meme_assume')` : « Le mug du mème s'est vendu. Le mug de la morsure, mieux. »
**Et si…** : — · **Almanach** : « {annee} · La morsure. »

### FIN jp_flacon_b  —  Le flacon B
**Rôle** : joueur · **Cause** : chaîne (`flacon_b` posé par `co.pharmacie`, ou `vitamines` acceptées trois fois) · **Rareté** : rare · **Dorée** : non · **Partageable** : non (drame possible)
**Épitaphe** : Tu étais au sommet de ta forme. Le flacon B aussi ; deux ans, et le Doc « a très envie de vacances ». {prenom} {nom} a appris le mot « revenant ».
**epitaph_plus** : — si `flag('dope_a_son_insu')` : « {nom} ne savait pas. Rouvier l'a dit à la commission ; la commission a noté « ne savait pas » et a compté deux ans quand même. » · — si `flag('pharmacie_propre')` : « Ce n'était pas le flacon du Doc. C'était un autre ; il y en a toujours un autre. »
**Et si…** : `le_revenant` · **Almanach** : « {annee} · Le flacon B. »

### FIN jp_fax  —  Le fax
**Rôle** : joueur · **Cause** : chaîne (`fax_rate` puis DIRECTION vide dans les six cartes) · **Rareté** : rare · **Dorée** : non · **Partageable** : oui
**Épitaphe** : Ton transfert de rêve est mort dans un fax, à 23 h 59 min 58 s. {prenom} {nom} a passé la saison en tribune ; le fax a été promu.
**epitaph_plus** : — si `relation.josiane >= 1` : « Josiane a gardé la page trois, celle qui s'est coincée. Elle en a vu passer ; celle-là, elle l'a encadrée. » · — si `year >= 2010` : « Ce n'était pas un fax, c'était un serveur « en attente ». Il attend encore. »
**Et si…** : — · **Almanach** : « {annee} · Le fax. »

### FIN jp_faux_cousin  —  Le faux cousin
**Rôle** : joueur · **Cause** : imposture (événement joueur « Le faux cousin », 1996+ : recruté sur un coup de fil d'un prétendu Ballon d'Argent) · **Rareté** : rare · **Dorée** : non · **Partageable** : oui
**Épitaphe** : Tu as joué cinquante-trois minutes. On a compris à la deuxième ; {prenom} {nom} a compris à la cinquante-quatrième, sur le banc.
**epitaph_plus** : — si `flag('agent_fardelli')` : « Fardelli « ne connaissait pas le cousin ». Il connaissait le téléphone. » · — si `flag('rapport_trop_lent')` : « Barbier avait écrit « trop lent ». Le faux cousin avait dit « rapide ». On a cru le cousin. »
**Et si…** : — · **Almanach** : « {annee} · Le faux cousin. »

### FIN jp_statue  —  La statue
**Rôle** : joueur · **Cause** : destin (`enfant_du_pays && fidele`, club relégué deux fois) · **Rareté** : rare · **Dorée** : oui · **Partageable** : oui
**Épitaphe** : Tu as tout refusé pour ton club. Il est descendu en Régional 3 avec toi ; on a fait la statue de {prenom} {nom}, en résine, devant la buvette.
**epitaph_plus** : — si `flag('blason_embrasse')` : « La statue embrasse le blason. Gégé nettoie le socle chaque dimanche. » · — si `flag('honnete_tribune')` : « {nom} n'avait rien promis. La statue non plus ; elle est restée. »
**Et si…** : `pr_amateur` (le club de ton enfance, en Régional 3) · **Almanach** : « {annee} · La statue. »

### FIN jp_pouce  —  Le pouce
**Rôle** : joueur · **Cause** : objectif (`retour_croises` : vingt titularisations demandées, manquées au Verdict) · **Rareté** : commune · **Dorée** : non · **Partageable** : oui
**Épitaphe** : Vingt titularisations demandées, douze obtenues. Fardelli a répondu au message de {prenom} {nom} trois semaines plus tard, avec un pouce.
**epitaph_plus** : — si `flag('demande_titularisation')` : « Tu avais demandé au coach. Vukić t'aurait mis quand même ; il a hésité ensuite. » · — si `flag('reprise_tard')` : « Trois semaines de plus, avait dit Rouvier. Trois titularisations de moins ; le compte est juste. »
**Et si…** : — · **Almanach** : « {annee} · Le pouce. »

### FIN jp_agent  —  L'agent
**Rôle** : joueur · **Cause** : imposture (`agent_fardelli && relation.fardelli <= -3`, palier `co.fardelli.trahison_signe_ailleurs` variante joueur) · **Rareté** : rare · **Dorée** : non · **Partageable** : oui
**Épitaphe** : Fardelli t'a vendu dans le désert pendant que tu dormais. Le contrat était signé de la main de {prenom} {nom} ; personne ne s'en souvient, lui non plus.
**epitaph_plus** : — si `flag('gigi_non_agent')` : « Gigi t'avait dit de dire non une fois. Tu l'avais dit ; une fois. » · — si `flag('camille_a_lu')` : « Camille avait lu le relevé. Elle n'avait pas lu le contrat ; il n'était pas dans le tiroir qui ferme. »
**Et si…** : `le_banc_dore` (rejouer au désert, avec Solvang) · **Almanach** : « {annee} · L'agent. »

### FIN jp_pari  —  Le pari
**Rôle** : joueur · **Cause** : chaîne (`pari_double` puis DIRECTION vide, ou `jp.pari.brigade` niée deux fois) · **Rareté** : rare · **Dorée** : non · **Partageable** : oui
**Épitaphe** : Tu avais parié sur ta propre équipe, pour perdre. Elle a gagné ; {prenom} {nom} a tout perdu, y compris Tony, qui a changé de numéro.
**epitaph_plus** : — si `flag('temoin_amsel')` : « Amsel avait dit « nous avons tout notre temps ». Elle l'a pris ; {nom} en a eu moins. » · — si `flag('corner_force')` : « Le corner forcé de la 71e est dans l'enregistrement. On l'entend siffler. »
**Et si…** : `le_revenant` · **Almanach** : « {annee} · Le pari. »

---

## 12. La couture : traces, nouveaux éléments, questions ouvertes

### 12.1 Traces de la charte (§ 5.2) posées ou lues par ce chapitre

| Trace | Posée ici par | Lue ici par |
|---|---|---|
| `genou_opere` | jp.genou.plateaux, jp.genou.rechute | jp.fin.f2_offre, jp.fin.f3_juin, jp.genou.radio (variante), une.fin.genou_parle |
| `capitaine` | jp.brassard.genou_de_titi, jp.brassard_20.groupe, jp.brassard_33.deux, am.village.s1_premier_jour, postulat capitaine_dechu | jp.brassard.discours, objectifs, transition DS |
| `international` | jp.selection.liste, jp.binational.b2_mars | jp.pepite.p2_hiver, jp.derniere_selection, une.pepite.bleu_cobalt, fins |
| `binational_choisi` | jp.binational.b2_mars, jp.selection.pere | jp.binational.b4_virage, manchettes, jp.te.hymne |
| `selection_refusee` | jp.selection.liste, jp.derniere.legruet | jp.binational.b2_mars (variante Legruet), transition légende |
| `offshore` | jp.image.cousin, jp.exil.cousin | jp.image.fisc, fins |
| `mouton_noir` | jp.brassard.toro (et jp.brehaut.bouteilles, ch. 01) | jp.brassard.penalty (variante), une.pepite.plus_de_passe, transition président amateur |
| `special` | jp.une.conference | jp.une.vestiaire, une.pepite.le_meilleur, transition entraîneur |
| `enfant_du_pays` | jp.tifo.bache, jp.pepite.p3_vente | jp.pepite.p2_hiver, jp.pepite.p3_vente, jp.tifo.un_an_apres, fin jp_statue |
| `essai_pro` | am.doudoune.doudoune | am.village.v2_scierie, am.village.v3_fusion, am.patron, transition pro |
| `patron_furieux` | am.village.v2_scierie, am.patron.lundi | am.patron.licenciement, am.village.v3_fusion, fin am_patron |
| `flacon_b`, `pharmacie_propre` | jp.pharmacie.* | fin jp_flacon_b, une.pepite.flacon |
| `derby_gagne`, `derby_perdu` | co.derby.match | objectif croises_rejoues (gagne), ch. 20, ch. 90 |
| `camille_ici` | jp.exil.camille, jp.banc_dore.s1_premier_jour | objectif banc_dore_camille |
| `ami_ultras` | jp.tifo.local, jp.croises.c2_derby, co.derby.semaine | fin jp_siffle (plus) |
| `diplome` | jp.diplome.brissac | jp.fin.f3_juin, transition entraîneur |
| `sacha_nee` | `jp.famille.naissance` ∃ (à compléter : remarque du ch. 01) | transition Succession (§ 10.8) |
| `mbako_vendu` (lue) | — | jp.mbako.contre_toi, jp.te.mbako_face |
| `pacte_gege` (lue) | — | jp.tifo.local (variante) |
| `vukic_dauphin` (lue) | — | jp.fin.s1_veille, jp.banc_dore.d3_coach_europe, jp.coach_qui_te_veut |
| `clow_ingrat`, `clow_stage` (lues) | — | jp.diplome.clow |
| `naming_signe` (lue) | — | la scène « le stade s'appelle comme une boisson » est confiée au ch. 20 (brève) et au ch. 31 (Nouvelle) : ce chapitre n'a pas trouvé de scène joueur qui la porte sans redite ; voir § 12.4 |
| `salaires_retard` (lue) | — | alarme `jp.alarme.caisse_bas_fardelli` variante « le distributeur » (ch. 30 : « la paie du 5 n'est pas tombée ») |
| `divorce` (lue) | — | toutes les scènes de Camille (`!flag('divorce')`), jp.fin.s2_veille (variante Josiane) |
| `gigi_staff` (lue, posée aussi par jp.gigi.encore_une → `gigi_staff`) | jp.gigi.encore_une | jp.fin.s2_saison_de_plus, jp.pepite.s2_veille |

### 12.2 Traces nouvelles de ce chapitre (nom · ligne d'Almanach · posée par · lue par)

Toutes lues au moins une fois dans ce chapitre ou dans un chapitre nommé ; la ligne est écrite au `set` par le moteur. Les traces sans Almanach (drapeaux de script ou de variante) sont marquées « sans » et n'entrent pas dans la matrice du chapitre 90 sauf lecture externe.

| Trace | Almanach | Posée par | Lue par |
|---|---|---|---|
| `agent_fardelli` / `sans_agent` | sans / « a dit non à Fardelli » | p1, f1, l1 | tout le rôle ; ch. 02 ; ch. 12 |
| `vendu_d1`, `vendu_d2`, `vente_annulee` | « {prix} millions et un aller simple » | p3 | s1, jp.retour_usine, objectif, une.pepite.aller_simple, ch. 12, ch. 90 |
| `fidele` (∃), `fidele_deux`, `mercenaire` | « a fait doubler sa clause » | p3, s1_retour_usine, jp.clause.page_deux | objectifs, fin jp_sandwich plus, ch. 13 |
| `exil_dore`, `or_refuse`, `compte_cousin`, `camille_reste` | « parti pour l'or » ; « Camille n'est pas venue » | jp.exil.*, p3, f2 | fin jp_exil, ch. 14, ch. 02, ch. 15 |
| `prolonge`, `prolonge_vestiaire`, `parti_juin`, `sans_club`, `banc_reserve`, `vers_entraineur`, `attend_juin`, `prolonge_rabais` | « un an de plus » ; « trente-deux ans, sans club » | f2, f3 | s1, manchettes, objectif, ch. 30, ch. 11 |
| `recule_poste`, `genou_grave`, `genou_cache`, `genou_dit`, `bilan_arrondi`, `bilan_vrai`, `rouvier_ecoutee`, `genou_arrete`, `genou_ecoute` | « a reculé d'un cran » ; « le genou a eu le dernier mot » ; « le bilan arrondi » ; « Rouvier a dit » | jp.genou.*, jp.fin.s1_jambes | p3 (variante visite), ch. 12, ch. 01, ch. 14, ch. 30, fins |
| `honnete_tribune`, `tifo_adieu`, `celebre_contre_usine`, `blason_embrasse`, `retour_usine_signe` | « n'a rien promis » ; « a baissé la tête » ; « a embrassé le blason » | jp.tifo.*, s1_retour_usine, jp.retour.*, jp.clause.blason | ch. 90 (mémoire), fins, ch. 20, ch. 30 (trait Franc) |
| `groupe_accepte` (ch. 01), `brassard_gigi`, `brassard_refuse`, `discours_feu`, `penalty_marque/rate`, `capitaine_lundi` | « a refusé le brassard » | jp.brassard.* | ch. 01 (Vecchio), objectifs, ch. 14 |
| `mentor_mbako`, `rival_mbako`, `demande_vente`, `mbako_blesse_par_toi`, `banc_bosse` (ch. 01), `banc_boude`, `loft_tenu`, `parti_janvier`, `blessure_inventee`, `retour_petite_porte` | « a appris le contrôle à Mbako » ; « a tenu le loft » ; « était blessé le jour des recruteurs » | co.mbako_rival, jp.banc_hiver | ch. 01, ch. 11, ch. 14, ch. 90, jp.coach_qui_te_veut, ch. 12 |
| `image_propre`, `camille_a_lu`, `agent_solvang`, `regularise` | « a quitté Fardelli pour Solvang » | jp.contrat_image | ch. 02, ch. 12, jp.clause, fins |
| `chambre_fauvel`, `repos_selection`, `adieu_cobalt`, `adieu_banc`, `hymne_1990` | « a dormi dans la chambre de Fauvel » ; « la dernière sélection » | jp.selection, jp.derniere_selection | ch. 14, ch. 15, une.fin.dernier_cobalt |
| `modeste_une`, `coach_critique`, `special_assume`, `special_retire`, `meme_assume` | « a critiqué le coach » ; « a ri de son mème » | jp.premiere_une | jp.banc_hiver, fins, ch. 02, ch. 20, ch. 31 |
| `camille_bac_aidee`, `bac_apres`, `voiture_camille`, `attendu_lycee` | « a fait réviser Camille » | jp.camille_bac | ch. 01, p3 |
| `gigi_non_agent`, `gigi_genou_ecoute`, `gigi_encore_une`, `vecchio_vraie_retraite` ; `vars.gigi_conseils` | « un conseil de Gigi, le {n}e » | jp.conseils_gigi, jp.exil.dix_pour_cent, jp.vecchio_exemple | objectif, jp.clause, jp.fin.s1_jambes, fins, ch. 11 |
| `parti_chez_rival`, `fax_passe`, `fax_rate`, `page_lue`, `casier_nomme` | « parti chez {rival}, au centime » ; « mort dans un fax » | jp.clause, s1_premier_jour | ch. 90, co.derby, fin jp_fax, ch. 12, transition DS |
| `diplome_en_cours`, `diplome_reporte`, `diplome_juin`, `diplome_contre_aulard`, `clow_stage_ailleurs`, `brehaut_diplome`, `brehaut_adjoint`, `brehaut_rival_banc` | « a passé le diplôme avec Bréhaut » | jp.diplome_joueur | ch. 11, ch. 12, ch. 01, ch. 02, ch. 30 |
| `jubile_prevu`, `jubile_fait`, `jubile_reporte`, `jubile_charite`, `paulette_14a`, `dernier_annonce`, `une_de_plus` | « stade plein pour le jubilé » ; « s'est assis à la 14A » ; « une saison de plus, la {n}e » | jp.jubile, jp.adieu, jp.fin.s2_veille | fin jubile, objectif, ch. 13, ch. 31, ch. 30, transition président amateur |
| `maison_pays` (∃), `promis_camille`, `pays_refuse`, `maison_pays_signee` | « fait construire au pays » ; « l'enfant prodigue en D2 » | jp.maison_pays | f2, ch. 01, une.fin.prodigue, ch. 30, ch. 90 |
| `memoires_verite`, `memoires_lisses`, `chapitre_trois_radio`, `chapitre_retire`, `chapitre_assume` | « le chapitre trois » | jp.memoires | fins, une.fin.chapitre_trois, ch. 02, ch. 31, ch. 01 |
| `consultant`, `consultant_assume`, `notes_partagees` | « juge les autres le dimanche » | jp.consultant | fin jp_consultant, ch. 02, ch. 30, transitions |
| `petition_portee`, `petition_retiree`, `petition_retard`, `petition_presse` | « vingt-deux noms par fax » | jp.vestiaire_porte | f2, f3, ch. 01, ch. 02, ch. 20 |
| `dembo_servi`, `dembo_rival`, `yacht_dembo`, `dembo_ami`, `video_europe` | « a donné le ballon à Dembo » ; « le dernier but de Dembo » | jp.dembo_rival, jp.banc_dore.d4_virage | ch. 01 (fiche Dembo à écrire), ch. 11, ch. 30, ch. 20 |
| `pari` (∃), `pari_refuse`, `pari_double`, `plume_parle`, `temoin_amsel` (ch. 02), `corner_force` | « a parié sur ses corners » | jp.pari, jp.te.corners | fins, ch. 02, ch. 15, ch. 30 |
| `fils_spirituel`, `vukic_refuse`, `reste_pour_aulard`, `fils_docile` | « a suivi Vukić, trois valises » | jp.coach_qui_te_veut | fin jp_fils, ch. 01, ch. 11 |
| `reprise_tot`, `reprise_tard`, `croises_rejoues`, `derby_joue`, `demande_titularisation` | « a rejoué le derby où il était tombé » | jp.croises.* | objectifs, fin jp_pouce, co.derby, ch. 30 |
| `penche_cobalts`, `penche_kambara`, `mot_pour_eux`, `mot_pour_mere`, `maillot_dessous`, `mere_tribune`, `blesse_par_respect` | « a joué avec deux maillots » | jp.binational.* | ch. 14, objectif, ch. 20 |
| `veut_jouer`, `comprend_actif`, `veut_rentrer`, `table_partagee`, `banc_dore_retour`, `contrat_fini` | « a attendu le coucher du soleil » ; « rentré du désert à moitié prix » | jp.banc_dore.* | ch. 14, ch. 11, objectif, manchettes, fin jp_exil plus |
| `brassard_garde_dechu`, `joue_geant`, `joue_d2`, `salaire_baisse`, `dix_huit`, `jeunes_lances`, `geant_remonte`, `pour_paulette` | « a baissé son salaire de moitié » ; « sept gamins lancés » | jp.geant.* | objectifs, ch. 02 (Vialat), ch. 13, ch. 11, ch. 31, manchettes |
| `bouteilles_ecartees`, `main_de_dieu`, `tacle_lache`, `morsure` | « a écarté les bouteilles » ; « la main » | temps forts § 9 | ch. 30 (Destins), ch. 02 (Colline), ch. 15, ch. 31, ch. 01 |
| Amateur : `boulot_tenu`, `foot_d_abord`, `samedi_livre`, `essai_rate`, `essai_juin`, `essai_seul`, `rancune_valdorne`, `village_fusionne`, `copains_gardes`, `indemnite_village`, `dede_sifflet`, `banc_regarde`, `montbeliac_cash`, `montbeliac_refuse`, `montbeliac_ecoute`, `dupuis_vexe`, `paulette_emmenee`, `arret_complaisance`, `chomage_village`, `interim_montbeliac`, `bar_quatre_heures`, `rentre_tot`, `gerard_confiance`, `photo_comptoir`, `momo_couvert`, `banc_accepte`, `voisin_appelle`, `passe_a_montbeliac`, `neveu_forme`, `sanglier_embleme`, `sanglier_report`, `entorse_sanglier`, `pose_sanglier`, `enveloppe_essence`, `match_arrange`, `match_propre`, `croissant_promis`, `village_propre`, `roux_menti`, `roux_temoin`, `carton_karim`, `pichon_defend`, `seul_district`, `district_sanction`, `district_relaxe`, `radie_district`, `genou_amateur`, `verite_genou`, `espoir_genou`, `genou_amateur_reprend`, `apres_le_foot`, `sac_porte`, `dix_pris`, `revanche_valdorne`, `revanche_calme`, `vitrine` | voir chaque scène (§ 2) | § 2 | § 2, § 10, § 11, ch. 13, ch. 15, ch. 30, ch. 90 |
| `dernier_bloc_joue`, `dernier_bloc_menage`, `quinzieme_jouee`, `quinzieme_tribune` | sans (drapeaux de script) | jp.pepite.p2b_dernier_bloc, jp.fin.f2b_quinzieme | p3 (variante visite), f3 (la clause cochée), set-piece gm_annonce (ch. 30), ch. 11 (Vukić), objectif `fin_saison_entiere` |
| `titulaire_reclame`, `doublure_acceptee`, `genou_petit_dit`, `rituel_rouvier`, `vingt_redemande` | « a expliqué le genou à Mbako, y compris l'escalier » | jp.croises.s1_*, jp.croises.s2_rentree | ch. 01 (Vukić, Rouvier, Mbako), ch. 14 (Mbako sélectionneur du Kambara), ch. 90, fin jp_pouce (plus), une.croises.petit |
| `chant_club`, `chant_refuse`, `joue_contre_kambara`, `joue_contre_cobalts`, `blesse_par_respect`, `phrase_nouvelle`, `autre_pays_attend` | « s'est senti blessé, par respect » ; « a laissé attendre l'autre fédération » | jp.binational.s1_*, jp.binational.s2_rentree | ch. 14 (`binational_bloque`, l'hymne, l'appel à 40 ans), ch. 15, ch. 20, alarme `jp.binational.alarme_gege_maillot`, une.binational.respect |
| `camille_metier_desert`, `rouvier_desert`, `ligne_avant`, `ligne_apres`, `retour_promis_gege` | « Camille a ouvert un cabinet au désert » ; « Rouvier a chronométré au désert » ; « la ligne d'après » ; « a promis de rentrer, à la craie » | jp.banc_dore.s1_*, jp.banc_dore.s2_* | objectif `banc_dore_camille`, jp.selection (variante), ch. 01, ch. 12, ch. 14, jp.retour_usine (variante), fin jp_exil (plus), grand_deballage (plus), une.banc_dore.ligne, une.banc_dore.craie |
| `septieme_remontee`, `gamin_designe`, `primes_renoncees`, `primes_gardees`, `sacha_tribune`, `costume_evoque`, `papa_du_groupe`, `ecusson_blanc` | « a désigné le gamin à vendre » ; « a renoncé aux primes de la ligne douze » ; « Sacha, huit ans, à la tribune » ; « a joué papa pour dix gamins » | jp.geant.s1_*, jp.geant.s2_* | ch. 01 (Sacha, Bréhaut), ch. 02 (Vialat), ch. 11, ch. 13, § 10.5, fin jp_porteparole (plus), une.geant.ligne_douze, une.geant.remonte |
| `raconte_1990`, `contrats_lus`, `flacon_arrete`, `controle_negatif`, `salue_ancien_virage`, `vendu_explique`, `colline_bonjour`, `page_lue_vukic` | « a raconté 1990 aux jeunes » ; « a salué son ancien virage » ; « a dit bonjour à Colline » ; « Vukić a montré la page » | § 6.18, 6.20, 6.21, 6.23, 6.25, 6.26, 6.27 | ch. 14 (Fauvel), ch. 01 (Dembo, Mbako, Rouvier), ch. 02 (Colline), ch. 15, ch. 90, § 10.4, temps fort jp.te.capitaine_rouge |
| Amateur, ajouts : `enfourne_cinq_heures`, `maillot_sanglier`, `battue_reportee`, `camille_sait_essence`, `reponse_echo`, `brochure_arbitre`, `poucet_canton`, `poucet_serieux`, `poucet_tenu`, `but_poucet`, `maillot_echange`, `gigot_mange`, `belle_mere_vexee`, `dede_a_table`, `selection_ligue`, `ligue_refusee`, `karim_selectionne`, `chrono_brissac`, `maillot_ligue_porte`, `car_pousse`, `barque_ile_verte`, `bateau_rate`, `nuit_dans_le_car`, `nuit_bar_combe`, `retour_reserve_valdorne`, `but_dorne`, `tenu_dorne`, `rendu_assume`, `tournee_payee` | « enfournait chez Pichon à cinq heures » ; « Roux a donné la brochure » ; « a marqué contre un club de D1 » ; « a échangé son maillot avec un pro » ; « Dédé a mangé le gigot » ; « a joué pour la Ligue, à la Dorne » ; « Brissac a souligné » ; « a traversé en barque » ; « a raté le bateau » ; « Valdorne a repris en réserve » ; « a marqué à la Dorne » | § 2.3-2.4 (scènes ajoutées et intrigues am.coupe_poucet, am.repas_dimanche, am.selection_ligue, am.car_gerard) | § 10.1-10.3, ch. 01 (Camille, Sacha), ch. 02 (Roux, Barbier, Brissac, Pichon, Léa), ch. 11 (Dédé adjoint), ch. 13 (le maillot sous verre, le car, les chasseurs, le fournil), ch. 14 (Brissac), ch. 15 (Roux, Colline), ch. 20, ch. 31 (Île-Verte, Haute-Combe, le sanglier), ch. 90 |

### 12.3 Nouveaux éléments de monde introduits (à déclarer au chapitre 90)

- Voix sans portrait : « ton patron » (scierie, garage, plomberie : tiré par le postulat), « Momo » (avant-centre du village, chaise, nez), « Karim » (capitaine du village, passe à Montbéliac), « les jumeaux », « le neveu de Pichon » (reprend la boulangerie en 2008), « le médecin du canton », « une voix de Montbéliac » (le président des Sangliers, en bottes), « un intermédiaire » (le match arrangé), « les vieux du vestiaire » (Régional 1, `lache_academie`), « ta mère, au téléphone du pays », « ton père, au téléphone », « ton cousin des îles », « Tony » (déjà carte existante), « le capitaine d'Al-Dorado », « un émissaire du Kambara », « le kiné du club acheteur », « la belle-mère » (le gigot, le mari qui jouait aussi), « le pro d'en face » (la Coupe), « le président des chasseurs » (orange fluo), « le gamin de l'usine » (si Mbako n'est pas au club), « la Josiane d'ici » (le portrait de Josiane, bande « SECRÉTAIRE DEPUIS 1979 », dans un autre club : convention à valider par le chantier données), « la petite Josiane » (bande « SECRÉTAIRE DEPUIS 2008 »), « le fils de Clow » (déjà charte).
- Lieux et objets : le car de Gérard (vingt ans, payé en bières, freine devant le fournil) ; la barque d'Île-Verte (deux voyages) ; la brochure d'arbitrage du district, pliée en deux ; le maillot du pro sous verre au bar ; la colonne « amateurs » de Brissac ; le calendrier aux croix de Sabatier (quatorze, puis la quinzième) ; le septième écusson blanc du tifo du géant ; la craie du local (« rentrer l'été prochain ») ; la scierie de Boisnoir ; la salle des mariages de la mairie (commission du district) ; la planche sur deux parpaings (le banc de touche amateur) ; le double fond de la boîte en fer de Gérard ; les annales de Josiane (1957, 18 en philosophie) ; le tiroir du Doc (la radio qui n'est pas dans le dossier) ; le fauteuil vide de Ménèche ; le mug du mème ; le sac poubelle propre de la bâche pliée ; la place 14A (à côté de la 14B de Paulette) ; le stade à toit d'Al-Dorado.
- Événements et dates : le tutoriel de Trébignac est un amical de rentrée hors calendrier (Vecchio y joue tous les ans depuis 1988) ; la fusion Boisnoir-Montbéliac de 1991 (postulat `village_endette`) précède la « fusion imposée » de 1996 (ch. 13) : le chapitre 13 doit lire `village_fusionne` (« ça a déjà eu lieu une fois ») ; Dembo joue son dernier contrat au désert en 2008 (`banc_dore`) et marque son dernier but sur une passe du joueur si `dembo_ami`.
- Postulats dérivés proposés au chapitre 30 : `le_sifflet` (entraîneur amateur à vingt et un ans, `dede_sifflet`), `le_banc_dore` (Et si… de `jp_agent`), `pr_amateur` (Et si… de `jp_statue`).
- Ids d'alarme nouveaux : `am.alarme.tribunes_bas_gerard`, `am.alarme.tribunes_bas_dupuis`, `am.alarme.vestiaire_bas_vieux`, `jp.pepite.alarme_tifo_lea`, `jp.pepite.alarme_fardelli_avance`, `jp.fin.alarme_gege_papy`, `jp.fin.alarme_fardelli_aucune_offre`, `jp.croises.alarme_gege_boite`, `jp.binational.alarme_gege_maillot`, `jp.banc_dore.alarme_nassir_ligne`, `jp.geant.alarme_vialat_ligne` (le chapitre 30 écrit les alarmes standard des deux rôles ; celles-ci sont des overrides).

### 12.4 Questions ouvertes (à trancher par le showrunner dans la charte, jamais ici)

1. **`jp.gege.petit`** : le chapitre 01 (fiche Camille, `co.camille.boulangere`) cite une scène `jp.gege.petit` avec une variante « ta femme est passée par la porte » (lit `derby_tete_haute`), attribuée à un « 09 (Gégé) » qui n'existe pas dans le plan des chapitres ; la fiche de Gégé n'est pas dans le chapitre 01 (sept fiches sur dix-neuf). Ce chapitre porte la variante dans `jp.tifo.bache` ; il faut décider qui écrit la fiche de Gégé (et celles de Rouvier, Dembo, Fauvel, Brissac, Gérard, Dédé, Paulette, Sacha, mère de Mbako, Loco, Klopf) et si `jp.gege.*` est un espace réservé.
2. **Vecchio au tutoriel** : la charte fait jouer Vecchio à Trébignac « à 50 ans » (2000-2002) ; le tutoriel le fait apparaître à Trébignac en 1990 pour un amical de rentrée (« il vient tous les ans depuis 1988 »). À valider, ou remplacer Vecchio par Dédé dans les cartes 3, 4, 6, 8, 9, 11 du tutoriel (la charte § 5.1 impose « Josiane et Vecchio »).
3. **« La Josiane d'ici »** : les scènes de premier jour dans un autre club (`jp.pepite.s1_premier_jour`, `jp.fin.s1_premier_jour`) font parler « la secrétaire de l'autre club » avec le portrait de Josiane et une bande différente. Si le chantier données refuse cette convention, ces scènes passent à une voix sans portrait (« la secrétaire »).
4. **`naming_signe`** (charte § 5.2 #7 : « 10 : le stade s'appelle comme une boisson ») : aucune scène joueur ne la lit ici sans redite avec ch. 11 et 13 ; proposition : une brève d'Écho au chapitre 20 et une réaction de Gégé au chapitre 30 (alarme tribunes) ; ou ajouter une variante à `jp.tifo.local` (« la bâche est sous un nom de boisson »).
5. **Pichon président de Boisnoir** (`village_endette`) : la charte fait de Pichon le président de Trébignac ; ce chapitre le prête à Boisnoir « en attendant ». Alternative : une voix « le président » sans portrait, et Pichon seulement dans `am.pichon_150` (Trébignac) et le tutoriel.
6. **Dembo** : la charte le liste au cœur du joueur pro, mais aucune fiche n'existe ; `jp.dembo_rival` et `jp.banc_dore.d4_virage` posent `dembo_servi`, `dembo_ami` ; le chapitre 01 (ou celui qui écrira la fiche) doit les lire (retrouvailles « le dernier but »).
7. **Longueur** : le chapitre dépasse la fourchette attendue (≈ 80 000 mots contre 15 000-25 000) parce que les minimums de contenu de la charte (huit postulats à neuf scènes de script, ≥ 12 intrigues à 4-6 scènes par rôle, tutoriel, temps forts, fins, réactions, manchettes) ne tiennent pas dans la fourchette une fois tout écrit au gabarit ; le second passage a supprimé les formats « résumé » et « compact » (scripts de seconde vague, § 6.17-6.27, réservoir amateur) pour que chaque scène soit importable sans lire le chapitre. Le showrunner peut demander de scinder (10a amateur, 10b pro pépite et fin de contrat, 10c seconde vague).
8. **`jp.famille.naissance`** (∃) doit poser `sacha_nee` (remarque du chapitre 01, § 4.4) : chantier données.
9. **Année des scènes du désert** : `banc_dore` commence en 2008 ; Sabatier (fenêtre jusqu'en 2010) n'y parle pas ; Rouvier est kiné des Cobalts 2002-2014 et apparaît « en stage » : à valider.

### 12.5 La check-list du chapitre (§ 6.2 de la charte), cochée

- [x] Ids § 4.10 (`am.`, `jp.`, `co.` ; scripts `<rôle>.<postulat>.<ancre>` ; scènes `<rôle>.<arc>.<etape>` ; réactions `<rôle>.re.<qui>_<quoi>` ; manchettes `une.<postulat>.<mot>` ; fins `am_*`, `jp_*`).
- [x] Locuteurs existants (§ 2 de la charte) ou voix sans portrait déclarées en § 12.3 ; statuts et fenêtres respectés (Sabatier ≤ 2010, Paulette ≤ 2009 — sa place est vide en 2012 —, Vecchio joueur ≤ 1995 puis staff puis buvette, Mbako 16 ans en 1990 et 30 en 2004, Fauvel capitaine ≤ 1998, Legruet président ≤ 2008 ; les postulats de 1990 n'ont ni écus, ni Flux, ni vidéo ; le fax disparaît après 2010 avec la variante « le mail »).
- [x] Répliques ≤ 200 caractères, deux phrases, un tic, un nom une fois (vérification mécanique ci-dessous) ; libellés ≤ 28, première personne, sans « Oui / Non », sans le nom du joueur.
- [x] Effets § 4.11 ; un `+++` par carte au plus ; relations ±1 (±2 exceptionnel, marqué) ; conséquences sans explication.
- [x] Traces posées déclarées et lues (§ 12.1-12.2) ; réactions citées existantes ou définies § 7.
- [x] `{toi}` seulement chez un locuteur à adresse ; `{NOM}` seulement en capitales de journal ou de bâche.
- [x] Aucun nom réel, aucune monnaie réelle, aucun chiffre de jauge ou de relation dans un texte.
- [x] Drames hors S0, jamais deux d'affilée (`am.genou_21`, `co.pharmacie` victime, `jp.genou_parle` rechute : ordonnés dans les pools).
- [x] Nombres (§ 5.1 de la charte) : huit scripts de neuf à dix scènes (`pepite` et `fin_de_contrat` en ont dix : quatre ancres S0, trois S1, deux S2+, une alarme d'override) ; douze intrigues amateur (4 scènes chacune, `am.village` et `am.academie` en scripts) ; vingt-sept intrigues pro (4 à 6 scènes, plus le rituel Vecchio à une scène) ; douze cartes de tutoriel ; vingt temps forts ; quarante-trois réactions ; cinquante-cinq manchettes ; trois objectifs par postulat ; dix-neuf fins.
- [x] Chaque personnage convoqué par § 2.4 parle au moins une fois par postulat (amateur : Dédé, Pichon, Josiane, Gérard, Vecchio, Dupuis, Paulette, Barbier, Léa, Camille ; pro : Fardelli, Aulard, Vukić, Josiane, Rouvier, Bréhaut, Dembo, Vecchio, Mbako, Nassir, Solvang, Léa, Vence, Ménèche, Sabatier, Gégé, Camille, Legruet, Fauvel).
- [x] Ratio léger / stratégique / drame ≈ 60 / 30 / 10 à l'échelle des réservoirs (amateur : 4 légères sur 8 ; pro : 9 légères ou familiales sur 27, 2 drames).
- [ ] Relecture croisée par le chapitre 11 (à faire).
