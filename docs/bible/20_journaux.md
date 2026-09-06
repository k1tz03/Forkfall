# FUSIBLE — Bible scénaristique · 20 · Les journaux : Unes, brèves, Nouvelles datées, Nouvelles du passé

> Tout ce qui s'imprime dans le monde de FUSIBLE. Trois journaux, une chaîne, une radio, un réseau ; la Une du Bilan que le joueur compare d'une relance à l'autre ; la chronologie 1990 → 2050 servie en Nouvelles datées ; ce que l'ancien club te fait savoir ; l'Almanach que le moteur écrit tout seul ; et la page rose où Camille lit ta vie avant toi. Ce chapitre suit la charte (`00_charte.md`) à la lettre : gabarits § 4.5 (manchette), § 4.6 (Nouvelle datée), § 4.4 (réaction), § 4.9 (anecdote) ; conventions d'ids § 4.10 ; les quarante traces de § 5.2.

## 0. Comment lire ce chapitre

**Ce qu'il fournit.** (1) La voix de chaque titre : dix règles de style, les plumes (avec des noms), les rubriques, les prix par décennie, la mise en page décrite pour l'app (masthead, date, météo, prix). (2) Les manchettes : les vingt-sept génériques de tous les rôles, une manchette par trace transversale de la charte lue *depuis un autre rôle* que celui qui la pose, les manchettes des quatre postulats d'instance (le chapitre 15 s'écrit en même temps que celui-ci : il fixera les ids de photo), et douze Unes de fin de carrière. (3) La chronologie du monde en quatre-vingt-sept Nouvelles datées, de 1990 à 2050, au gabarit § 4.6, chacune armant quelque chose. (4) Vingt-quatre Nouvelles du passé. (5) Les gabarits d'Almanach (les onze du moteur, vingt-quatre de plus) et quarante lignes d'exemple, qui sont aussi les brèves types. (6) La Gazette Rose de Camille : dix entrefilets « Vu au parking » servis comme réactions. (7) La météo de la Marmite (quarante lignes), « On nous écrit » (dix lettres), la matrice de couture et les questions ouvertes.

**Ce qu'il ne refait pas.** Les manchettes écrites par les chapitres 10 à 14 (≈ 400, ids `une.pepite.*`, `une.fin.*`, `une.promu.*`, `une.interim.*`, `une.vendre.*`, `une.intouchable.*`, `une.fusion.*`, `une.coupe.*`, `une.geant.*`, `une.fonds.*`, `une.sylvanie.*`, `une.fiasco.*`, `une.generic.sl_*`…) restent telles quelles : ce chapitre les **harmonise** (§ 2.5 : la voix par journal, les doublons, les longueurs) et ne les réécrit pas. Les quarante-quatre manchettes de `content/unes.yaml` sont intouchables. Les vingt-deux Nouvelles datées 1990-2000 planifiées par la spec § 4.5 n'existent pas encore dans `content/` : elles sont écrites ici au gabarit complet, avec les ids que la spec leur donne ; le chapitre 31 les reprend sans les réécrire et complète les anecdotes de monde.

**Conventions propres.** Une manchette est présentée en ligne de tableau avec tous les champs du gabarit § 4.5 dans l'ordre : id · journal · priorité · rôles · condition (en clair, puis en langage du jeu) · titre · sous-titre · brève suggérée · photo · réaction. La longueur des titres est vérifiée avec BRÉHAUT-LEMOINE pour `{NOM}`, SAINT-ÉTOILE pour `{VILLE}`, AS SAINT-ÉTOILE pour `{CLUB}`, OLYMPIQUE LYONNET pour `{RIVAL}`. Une Nouvelle datée porte `year:` et est servie entre `year` et `year + 1` ; un seul bouton, deux libellés, le même effet ; rôles vides = tous. Les ids nouveaux : `une.generic.<mot>` (génériques), `une.<postulat>.<mot>` (instance : `heritage`, `tutelle`, `desert`, `elu`), `co.nv.<annee>_<mot>` (Nouvelles datées), `co.nouvelle.passe_<mot>` (Nouvelles du passé, variantes de `tr.nouvelles_du_passe`), `co.re.camille_parking_<mot>` (Gazette de Camille). Aucun nom réel, aucun fait réel reconnaissable, francs puis écus.

---

## 1. Les journaux et les écrans

### 1.1 Le Quotidien du Ballon (`quotidien`, bleu)

**Ligne.** National, sobre, sérieux, un peu lâche : il attend que la chute soit certaine pour la titrer, puis la titre comme s'il l'avait vue venir. Il tutoie personne, ne rit jamais en Une, rit parfois page six. Il est le journal des présidents qui le lisent pour savoir ce qu'ils ont dit. Fondé en 1946 ; il paraît jusqu'en 2050 (papier jusqu'en 2035, puis « offert par Almadis » sur écran).

**Dix règles de style.**
1. Le titre est une phrase nominale ou un verbe au présent ; jamais de point d'exclamation sauf « CHAMPIONS ! » et « MONTÉE ! », qui sont les deux seuls qu'il s'autorise depuis 1946.
2. Le nom du joueur est en capitales une fois, jamais deux ; le prénom n'apparaît que dans le sous-titre.
3. Il cite un personnage entre guillemets, avec son tic, et ne commente jamais la citation : il la laisse tomber.
4. Il dit « l'entraîneur », « le président », « le sélectionneur » avant de dire le nom ; la fonction précède l'homme.
5. Les chiffres sont en lettres jusqu'à seize, en chiffres au-delà, sauf les millions (« trente millions ») et les rangs (« {rang}e »).
6. Le sous-titre a deux phrases : la première est le fait, la seconde est ce que quelqu'un « n'a pas commenté ».
7. Il n'écrit jamais « scandale » ; il écrit « la Fédération examine », « la Commission compte », « la justice s'intéresse ».
8. Il n'insulte pas ; sa méchanceté est une litote (« un entraîneur qui a des idées ») et sa tendresse, une date (« vingt-deux ans de maison »).
9. Il se trompe une fois par an et publie le rectificatif page douze, en corps huit.
10. Il ne titre jamais sur un mort le jour de sa mort ; le lendemain, en bas de Une, avec une photo où la personne sourit.

**Plumes.** Pierre Massenet (chroniqueur, « Hors micro », 1990-2003 ; consultant à Télé-Stade ensuite, il garde une colonne le lundi jusqu'en 2012) · Léa (rédactrice en chef à partir de 2018, la première à mettre une question en Une) · **Ferdinand Bosc** (« Le tableau noir », la tactique : « le 4-2-3-1 n'est pas une idée, c'est un aveu ») · **Odile Marchetti** (« Le carnet » : transferts, naissances, enterrements, dans cet ordre, en corps neuf) · **Anselme Duroy** (« La cote », les cotes du week-end ; c'est chez lui que Massenet note le pari du promu).

**Rubriques.** « Hors micro » (la chronique, page deux) · « La cote » (page trois) · « Le tableau noir » (page quatre) · « Le carnet » (dernière page) · « L'Almanach du Ballon » (le supplément d'été, mille pages, une ligne par club : c'est la seule fois où les personnages prononcent le mot Almanach).

**Prix.** 4,50 F (1990) · 5 F (1996) · 0,80 écu (2002) · 1,20 écu (2012) · 1,50 écu (2020) · 2 écus (2028) · gratuit, « offert par Almadis » (2035-2050).

### 1.2 La Gazette Rose (`gazette`, rose)

**Ligne.** Tabloïd : méchante, drôle, souvent juste. Elle titre sur le coupable avant le fait ; elle achète les SMS ; elle a raison un jour sur deux et le rappelle le jour où elle a raison. Papier rose depuis 1971 (« pour qu'on la voie dans le bus »), tabloïd en 2005, tout en ligne à partir de 2015, payante « dix écus par scandale » en 2032. Personne n'avoue la lire ; tout le monde la découpe.

**Dix règles de style.**
1. Le titre est court, méchant, et contient un chiffre ou une heure quand c'est possible (« 23 H 47, AVEC LA FAUTE »).
2. Le Rosé note les présidents sur vingt, jamais les joueurs, jamais les morts, jamais les trésoriers ; la note est dans le sous-titre, entre deux points.
3. Elle cite le tic d'un personnage pour le retourner contre lui (« il “n'a pas le temps” », avec les guillemets qui grincent).
4. Elle écrit « dit-on », « selon un proche », « au parking » : sa source est toujours un lieu, jamais un nom.
5. Le nom du joueur est en capitales et, une fois sur trois, précédé de « L'AFFAIRE ».
6. Elle ne dit jamais « présumé » : elle dit « et pourtant titulaire ».
7. Elle a un mur, « Les promesses, datées » : toute promesse publique y est inscrite avec sa date ; quand Parole descend, le mur s'imprime en Une.
8. Elle est tendre une fois par an, sans prévenir, sur un vieux gardien ou une secrétaire ; c'est là qu'elle fait le plus mal.
9. Elle n'écrit jamais sur un enfant ; Sacha n'y est jamais nommée, même quand elle est dans le tweet.
10. Sa dernière ligne est toujours une question : « Et maintenant ? ».

**Plumes.** La Plume (investigation, sans visage : « J'ai les documents » ; elle n'apparaît jamais en première saison, jamais sans une trace judiciaire ou Parole ≤ −2) · le Rosé (éditorialiste anonyme ; on saura en 2040 que c'était trois personnes successives, dont **Maxence Larue**, qui tient aussi « Le carnet noir ») · **Tonio Ferrand** (photographe, « Vu au parking » : il ne signe que des légendes) · **Valérie Coste** (« Les promesses, datées », qui recopie le mur).

**Rubriques.** « Le Rosé » (page deux, la note sur vingt) · « Le carnet noir » (qui va sauter, page trois) · « Les promesses, datées » (page quatre, le mur) · « Vu au parking » (page cinq, la photo et la légende) · « Et maintenant ? » (la dernière ligne, toujours).

**Prix.** 3 F (1990) · 3,50 F (1997) · 0,50 écu (2002) · 0,70 écu (2010) · en ligne, gratuit (2015) · « dix écus par scandale » (2032-2050).

### 1.3 L'Écho de {ville} (`echo`, local)

**Ligne.** Tendre, local, jamais dupe. Il parle du local, de la buvette, du radiateur, du marché du dimanche ; il connaît le prénom du gardien et la marque du minibus. C'est le seul journal que lisent Josiane et Camille, le seul que Mamie Paulette a lu, le dernier journal papier du pays (1902-2050 ; il paraît le dimanche seulement à partir de 2045, à prix libre dès 2040). Il commence par « Au local » et finit par « On nous écrit ».

**Dix règles de style.**
1. Le titre dit « nous », « chez nous », « {VILLE} » ; le club, c'est la ville.
2. Il nomme les gens par leur prénom quand ils sont d'ici (Gégé, Gigi, Josiane) et par leur fonction quand ils viennent d'ailleurs (« le fonds », « l'Inspecteur »).
3. Il ne titre jamais contre l'entraîneur ; il titre « attendait mieux », « prend l'escalier », « range les ballons ».
4. Un objet par titre : la bâche, la boîte, le radiateur, le minibus, les verres du placard.
5. Il cite Gégé une fois par Une, sauf les semaines où Gégé ne parle pas ; alors il le dit (« Gégé n'a rien dit. C'est une première. »).
6. « La météo de la Marmite » est une ligne de pied, jamais un chiffre : Froide · Tiède · Bouillante · Explosive (§ 1.7).
7. Il n'écrit « scandale » que pour la buvette (« le scandale des merguez de 1992 »).
8. Il est le seul à écrire le mot « merci » en titre.
9. Il ne publie aucune photo de parking ; ses photos sont prises de la tribune Est, place 14B.
10. Il annonce les morts en première page, avec l'heure du cimetière et le nom du bar d'après.

**Plumes.** Léa (rédactrice, 1990-2018 ; « Vous confirmez ? » est né ici) · le stagiaire de l'Écho (une voix sans portrait, à partir de 2018 ; il change chaque année et signe toujours « le stagiaire ») · **le père Guichard** (« Le marché du dimanche », soixante ans de chronique, il n'a jamais vu un match : il regarde les gens) · **Josette Pradel** (« La météo de la Marmite », une ligne par semaine, place 14C, à côté de Paulette).

**Rubriques.** « Au local » (page une, l'ambiance sous la tribune Nord) · « La météo de la Marmite » (le pied de Une) · « Le marché du dimanche » (page trois) · « On nous écrit » (dernière page, § 1.8) · « Le carnet du canton » (les mariages, les tombolas, le minibus).

**Prix.** 2,50 F (1990) · 3 F (1998) · 0,60 écu (2002) · 0,80 écu (2015) · 1 écu (2030) · prix libre (2040-2050).

### 1.4 Télé-Stade (la chaîne)

**Ligne.** L'audience a toujours raison ; en direct, sans filet. Elle rachète Capitale FC en 1991, invente le match du dimanche soir en 1994, perd les droits contre Médiacrash en 2003, les reprend en 2007 quand Médiacrash ne paie pas, se fait racheter par Kick en 2038 et garde son nom « pour les vieux ».

**Dix règles de style.**
1. Vence ouvre toujours par « On est en direct » et ferme par une question à laquelle personne ne répond.
2. Le Plateau ne parle jamais du match ; il parle de celui qui l'a perdu.
3. Massenet, consultant, dit « hors micro » sur un micro ouvert : c'est la blague de la chaîne depuis 2003.
4. La zone mixte est un couloir de dix mètres ; on y pose la question qu'on n'a pas le droit de poser au vestiaire.
5. Le bandeau en bas de l'écran a toujours trois mots de plus que l'info.
6. Ozanne, le patron, n'apparaît qu'une fois par carrière, pour dire que « l'audience a toujours raison ».
7. Le tweet de 3 h du matin est lu à l'antenne à 20 h 30, avec la faute.
8. Elle filme le parking quand le vestiaire est fermé ; La Gazette lui achète la photo.
9. Elle n'annonce jamais un licenciement avant le SMS ; elle l'annonce à 23 h 48.
10. Elle offre le plateau à tout entraîneur viré avec des tribunes qui l'aiment encore : c'est la Porte de sortie qui parle.

**Voix.** Nathalie Vence (terrain, puis le Plateau en 2003, directrice de l'info en 2020) · Franck Ozanne (le patron, deux répliques par carrière) · Massenet (consultant 2003, directeur d'antenne 2012, mémoires 2025) · **Rossard** (l'ancien sélectionneur consultant qui savonne la planche, voix du chapitre 14) · **la voix du bandeau** (personne).

**Radio Tribune** (1988-2031) : la radio des supporters, de 22 h à minuit ; « Les auditeurs ont la parole » ; Gégé y tient une chronique de 2004 à 2011 ; elle ferme en 2031, un mardi, sans le dire. **Le Flux** (2007) puis **Kick** (2024) : personne n'y écrit, tout le monde y parle ; le tweet, le mème, le compte anonyme de Gégé (2020) ; Kick diffuse les matchs en flux avec un fil de commentaires qui défile sur le terrain.

### 1.5 La mise en page décrite pour l'app

La Une du Bilan est un seul gabarit à six emplacements, rendu en interface native (brainstorm 06), déclinée en trois habillages :

| Emplacement | Quotidien | Gazette | Écho |
|---|---|---|---|
| **Masthead** | « LE QUOTIDIEN DU BALLON », capitales condensées bleu nuit sur blanc cassé ; dessous, en corps six : « Fondé en 1946 · Le journal des présidents » | « LA GAZETTE ROSE », capitales grasses noires sur rose ; dessous, en italique : « On dit tout. Surtout ça. » | « L'ÉCHO DE {VILLE} », capitales fines grises sur blanc jauni ; dessous : « Depuis 1902 · Le journal de chez nous » |
| **Date et prix** | « juin {annee+1} · {prix} » à droite du masthead ; le prix suit § 1.1 ; après 2035 : « Offert par Almadis » | idem, prix § 1.2 ; après 2015 : « Édition en ligne » ; après 2032 : « 10 écus par scandale » | idem, prix § 1.3 ; après 2040 : « Prix libre » ; après 2045 : « Édition du dimanche » |
| **Manchette** | ≤ 44 caractères, deux lignes au plus, bleu | ≤ 44 caractères, noir, avec un soulignement rose | ≤ 44 caractères, gris foncé, en chasse fine |
| **Sous-titre** | une à deux phrases, corps dix | une à deux phrases, corps dix, la note du Rosé entre deux points | une à deux phrases, corps dix, un prénom au moins |
| **Photo** | la carte fatale en noir et blanc tramé, légende = l'`answer` choisie | idem, cadre rose, légende signée « Vu au parking » | idem, tramé plus grossier, légende « Photo prise de la tribune Est » |
| **Brèves** | trois entrées de l'Almanach sous le titre « En bref » | trois entrées sous le titre « Le carnet noir » | trois entrées sous le titre « Au local » |
| **Pied** | « Classement : {rang}e · Objectif {objectif} : {tenu} » | « Et maintenant ? » puis le pied classement | « La météo de la Marmite : {meteo} » puis le pied classement |
| **Encart météo** | la météo de la ville (« Averses sur {ville} », cosmétique, tirée hors graine) | « Météo du parking : humide » (fixe) | la météo de la Marmite (§ 1.7) |

La photo est toujours la vignette de la carte fatale (spec § 1.6) ; l'encart météo du Quotidien et de la Gazette est cosmétique, rendu par l'app avec un Rng d'affichage, jamais celui de la partie. Le journal de la manchette décide l'habillage ; le moteur ne connaît ni la couleur ni la police.

### 1.6 Qui a raison, et quand

Les trois journaux se contredisent une fois par saison sur le même fait : c'est voulu. La règle de vérité : le Quotidien dit ce qui est acquis, la Gazette dit ce qui est probable, l'Écho dit ce qui se voit. Quand une manchette de trace (priorité 3) sort dans la Gazette, l'Écho en fait une brève « on nous dit » ; quand elle sort dans l'Écho, la Gazette la reprend page cinq avec une photo de parking. La réaction « quelqu'un a lu le journal » (`co.re.josiane_a_lu`, `co.re.vecchio_garde`, `co.re.camille_journal`, `co.re.gege_decoupe`, `co.re.lea_confirme`, `co.re.meneche_no_comment`) est celle du journal servi : Josiane range le Quotidien, Gégé découpe l'Écho, Camille lit la Gazette à voix haute pour le chat.

### 1.7 La météo de la Marmite (quarante formulations)

Ligne de pied de l'Écho, jamais un chiffre : *Froide* quand TRIBUNES < 25, *Tiède* entre 25 et 79, *Bouillante* à partir de 80, *Explosive* quand TRIBUNES ≥ 80 **et** qu'une alarme tribunes haute a sonné dans la saison (`alarm('tribunes.high')`), ou quand TRIBUNES ≥ 92. Le moteur tire la formulation au poids parmi les dix de l'état (Rng d'affichage, hors graine) ; une formulation marquée (t) lit une trace et passe devant les autres si la trace est vraie. Josette Pradel signe.

**Froide (TRIBUNES < 25)**
1. Froide. On entend les consignes, et elles ne sont pas bonnes.
2. Froide. La Nord a chanté deux fois ; la deuxième, c'était l'hymne du rival.
3. Froide. Gégé a rangé le mégaphone dans la boîte à fusibles.
4. Froide. Trois écharpes au marché du dimanche, toutes retournées.
5. Froide. La buvette a vendu plus de cafés que de bières ; c'est un signe.
6. Froide. Place 14B, on a demandé l'heure à la mi-temps. (t : `paulette_partie` absent)
7. Froide. La bâche a un nom ; ce n'est pas celui du club. (t : `relation.gege <= -2`)
8. Froide. Le virage est venu, a regardé, est reparti avant le corner.
9. Froide. Le radiateur de la tribune Nord tousse plus fort que les supporters. (t : `tribune_a_renover`)
10. Froide. Deux degrés en octobre, comme à Néville, mais sans le vent pour excuse.

**Tiède (25 ≤ TRIBUNES < 80)**
11. Tiède. On chante, on s'assoit, on regarde l'heure ; c'est un dimanche.
12. Tiède. Le local a ouvert à dix-neuf heures et fermé à vingt-trois : normal.
13. Tiède. La Nord a hésité entre deux chants et a choisi le silence, poliment.
14. Tiède. Gégé « n'oublie rien », mais il n'a rien noté cette semaine.
15. Tiède. Le minibus est parti plein ; il est revenu plein aussi. On ne sait pas ce qu'ils ont vu.
16. Tiède. La pelouse est belle, dit Beaulieu ; ici, c'est ce qu'on dit quand il n'y a rien à dire.
17. Tiède. Mamie Paulette a applaudi une touche ; elle a ses raisons.
18. Tiède. La bâche est pliée sous le bar, prête, ni sortie ni jetée.
19. Tiède. Un tifo a été discuté ; le vote est reporté au mardi, comme la compo. (t : `onze_du_virage`)
20. Tiède. Le stade a fait le bruit d'un stade ; la ville, celui d'une ville.

**Bouillante (TRIBUNES ≥ 80)**
21. Bouillante. La Nord a chanté le nom de l'entraîneur avant celui du club ; on note.
22. Bouillante. Gégé a repeint le local. Encore.
23. Bouillante. Trois cents personnes au marché du dimanche, toutes avec l'écharpe, toutes en avance.
24. Bouillante. On a chanté la clause du petit, la date et le prix ; c'est un chant maintenant. (t : `mbako_garde`)
25. Bouillante. La buvette a fermé à minuit, faute de bières, pas de monde.
26. Bouillante. Le pacte est sur le mur, à la craie, et la craie tient. (t : `pacte_gege`)
27. Bouillante. Le kop a offert un maillot à Josiane ; elle l'a plié, mais elle l'a pris.
28. Bouillante. Le rival a annulé son déplacement de supporters « pour cause de travaux ».
29. Bouillante. Un tracteur a été aperçu au rond-point ; il allait au stade. (t : `centre_envahi`)
30. Bouillante. La Nord a écrit « MERCI » ; l'Écho aussi, en titre, une fois.

**Explosive (alarme tribunes haute, ou TRIBUNES ≥ 92)**
31. Explosive. Le virage veut la compo et l'a dite avant l'entraîneur. (t : `otage_kop`)
32. Explosive. Le préfet a écrit ; la mairie a répondu ; « le stade, c'est de l'argent public ».
33. Explosive. Douze mètres de bâche pour un seul mot, et ce n'est pas « merci ».
34. Explosive. La Nord a chanté pendant l'hymne ; c'était le sien, à elle.
35. Explosive. Gégé a fait les abonnements à cinq écus ; il en a vendu douze mille. (t : `ami_ultras && year >= 2002`)
36. Explosive. On a vu le président dans le local ; on ne l'a pas vu ressortir avant une heure. (t : `descendu_au_kop`)
37. Explosive. Le stade est plein le mardi ; le mardi, il n'y a pas de match.
38. Explosive. Le local a un nom au-dessus de la porte : le tien, et on a hésité sur l'accent.
39. Explosive. La Nord a demandé un derby de plus ; la Fédération « verra ça après le Congrès ».
40. Explosive. Trois bières, un vote, une compo, un tifo, une dette : le local a eu une semaine chargée.

### 1.8 « On nous écrit » (dix lettres)

Dernière page de l'Écho, une lettre par semaine, trois lignes, signée d'un prénom et d'un lieu. Dans l'app, « On nous écrit » est la quatrième brève de l'Écho quand la manchette est de journal `echo` (à la place de l'encart météo du Quotidien) ; tirée au poids parmi celles dont la condition est vraie ; jamais deux fois par carrière ; la dernière est sans condition.

| id | Condition (clair · jeu) | Lettre |
|---|---|---|
| `echo.lettre.beau_frere` | tu as répondu à la lettre du beau-frère de Montbéliac · `flag('reponse_echo')` | « Le beau-frère écrit encore. Il dit que vous avez répondu en trois lignes et qu'il en attendait quatre. — Marcel, Montbéliac » |
| `echo.lettre.paulette` | Paulette vivante, une saison au moins jouée · `chars.paulette.statut == 'club' && season >= 1` | « J'étais là en cinquante et un. Je suis encore là. Dites au coach que la place 14B voit très bien le banc. — Paulette, tribune Est » |
| `echo.lettre.dupuis` | le boucher sponsorise · `flag('boucher_sponsor')` | « Le meilleur du cochon, et je pèse mes mots : le maillot rose se voit de la route. C'est le but. — Dupuis, la place » |
| `echo.lettre.mere_gamin` | tu as lancé un jeune · `flag('pepite') \|\| flag('mbako_lance')` | « Mon fils a joué douze minutes dimanche. Il n'a pas dormi de la semaine, moi non plus. Merci pour les douze minutes. — Une mère, quartier de la gare » |
| `echo.lettre.curiste` | club de Fontaine ou Régional · `world.division >= 4` | « Je suis venu pour les eaux et je reste pour le club. Le médecin dit que c'est mauvais pour la tension. — Un curiste, Fontaine » |
| `echo.lettre.radiateur` | la tribune attend l'été · `flag('tribune_a_renover')` | « Le radiateur de la Nord tousse depuis 1988. Je l'ai entendu à la radio. Il a une voix de fumeur. — Roland, rue des Forges » |
| `echo.lettre.abonne_cinq` | abonnements à cinq écus · `flag('ami_ultras') && year >= 2002` | « Cinq écus l'abonnement, j'en ai pris trois : un pour moi, un pour le petit, un pour la chaise vide. — Paul, tribune Nord » |
| `echo.lettre.camille` | Camille à −1 ou moins, pas divorcée · `relation.camille <= -1 && !flag('divorce')` | « Je ne signerai pas. Dites à l'entraîneur que la lumière du salon reste allumée jusqu'à minuit et qu'après, non. — Une lectrice » |
| `echo.lettre.gerard` | Gérard parti avec la caisse · `flag('gerard_parti')` | « Je ne dirai pas où je suis. Il fait beau. Ici, on paie en bières aussi, mais elles sont moins bonnes. — G. » |
| `echo.lettre.secours` | — (sans condition) | « Je lis l'Écho depuis que mon père le lisait. Il disait que le club, c'était nous. Je ne sais pas si c'est encore vrai ; je continue. — Un abonné » |

---

## 2. Les manchettes de Une

Rappel du moteur (spec § 1.6, `content/unes.yaml`) : au beat `bilan_une`, les manchettes éligibles (postulat, rôle, `when` vrai, pas servie au Bilan précédent) sont rangées par bande de priorité ; la plus haute gagne ; un seul tirage au poids dans la bande. Priorités : 4 titre, descente, changement de rôle ou de club, fin de mandat ; 3 trace forte de la saison (`journal_has`) ; 2 trace ordinaire ou état de l'instant ; 1 générique ; 0 secours. Une trace posée cette saison se lit par `journal_has('…')` ; `flag()` seul titrerait trois ans plus tard sur un vote oublié. Les brèves sont les trois entrées de l'Almanach les plus lourdes hors `sujet`. La colonne **Condition** donne la version en clair puis, entre accents graves, la version en langage du jeu.

### 2.1 Les génériques de tous les rôles (vingt-sept)

Les quatre secours de `unes.yaml` (`une.generic.objectif`, `aout`, `juin`, `bilan`) et les génériques du verdict existent et ne bougent pas. Celles-ci lisent l'état de l'instant, tiennent les S2+ et ne dépendent d'aucun postulat. `roles` vide = tous ; les rôles sans `bilan.rang` (sélectionneur, instance) lisent `{rang}` comme le rang du tournoi ou du mandat (spec § 1.8 : placeholder rendu par le rôle).

| id | Journal | Prio | Rôles | Condition (clair · jeu) | Titre | Sous-titre | Brève suggérée | Photo | Réaction |
|---|---|---|---|---|---|---|---|---|---|
| `une.generic.premiere` | echo | 1 | tous | première saison, objectif tenu · `season == 0 && bilan.tenu` | BIENVENUE, ET À L'ANNÉE PROCHAINE | Une première saison à {ville}, {rang}e, objectif tenu. Au local, on a retenu le prénom ; le nom viendra. | la ligne `bilan_tenu` | carte fatale | co.re.josiane_a_lu (`!seen`) |
| `une.generic.stade_plein_manque` | echo | 2 | tous | tribunes hautes, objectif manqué · `gauges.tribunes >= 80 && !bilan.tenu` | STADE PLEIN, OBJECTIF MANQUÉ À {VILLE} | {rang}e, et pas une place vide. Gégé : « La tribune n'oublie rien. » Elle a oublié le classement. | la météo : bouillante | carte fatale | co.re.gege_decoupe (`relation.gege >= 0`) |
| `une.generic.sauves_devant_personne` | echo | 2 | tous | tribunes basses, objectif tenu · `gauges.tribunes < 25 && bilan.tenu` | SAUVÉS DEVANT PERSONNE | Objectif tenu, {rang}e, devant trois cents abonnés et le père Guichard. Le local n'a pas ouvert. | la météo : froide | carte fatale | co.re.camille_journal (`!flag('divorce')`) |
| `une.generic.parole_tenue` | quotidien | 3 | tous | Parole haute · `parole >= 4` | {NOM} TIENT PAROLE. C'EST RARE. | Quatre promesses publiques, quatre tenues, une saison. Valérie Coste, à la Gazette, n'a rien à dater. | une promesse tenue | carte fatale | co.re.lea_confirme |
| `une.generic.deux_dates` | gazette | 2 | tous | Parole un peu basse · `parole <= -1 && parole > -3` | DEUX PROMESSES, DEUX DATES, ZÉRO | Le mur des promesses a deux lignes au nom de {nom}. Le Rosé : 9/20, « et encore, pour l'écriture ». | une promesse manquée | carte fatale | co.re.meneche_no_comment |
| `une.generic.ennemis` | gazette | 2 | tous | deux ennemis au moins · `stats.ennemis >= 2` (compteur à déclarer) | {NOM} A DES ENNEMIS, ET UNE LISTE | Deux personnes ne prononcent plus le nom. La Gazette les a appelées ; elles ont décroché. | la ligne `palier_moins3` | carte fatale | co.re.vecchio_garde |
| `une.generic.cinq_ans` | echo | 2 | tous | cinq saisons au même club · `stats.saisons_club >= 5` | {NOM}, CINQ ANS CHEZ NOUS | Cinq saisons, {rang}e cette fois. Josiane « en a vu passer » ; celui-là, elle le tutoie presque. | la ligne `bilan_tenu` ou `bilan_manque` | carte fatale | co.re.josiane_a_lu (`!seen`) |
| `une.generic.vingt_ans` | quotidien | 1 | joueur_amateur, joueur | vingt-deux ans ou moins · `player.age <= 22` | {NOM}, VINGT ANS ET DÉJÀ UNE UNE | {club}, {rang}e. Le carnet d'Odile Marchetti note la date de naissance ; le reste viendra. | la ligne `club_change` | carte fatale | co.re.camille_journal |
| `une.generic.soixante` | echo | 2 | tous | soixante ans ou plus · `player.age >= 60` | {NOM} N'A PAS L'ÂGE DE PARTIR | Soixante ans passés, {rang}e, et un contrat d'un an « renouvelable par tacite reconduction ». Le père Guichard applaudit. | la ligne `bilan_tenu` | carte fatale | co.re.vecchio_garde |
| `une.generic.maison` | echo | 3 | tous | Camille à +3, objectif tenu · `relation.camille >= 3 && bilan.tenu && !flag('divorce')` | QUELQU'UN ATTENDAIT À LA MAISON | {rang}e. Sur la photo de tribune Est, on voit un manteau qui n'est pas d'ici et qui reste. | la ligne `palier_plus3` de Camille | carte fatale | co.re.camille_journal |
| `une.generic.hotel_du_club` | gazette | 3 | tous | divorce cette saison · `journal_has('divorce')` | {NOM} DORT À L'HÔTEL DU CLUB | Chambre 12, celle de Josiane pour les stagiaires. « Vu au parking » n'a rien vu ; c'est ce qu'il a écrit. | la ligne `divorce` | carte fatale | co.re.josiane_a_lu (`!seen`) |
| `une.generic.naissance` | echo | 3 | tous | Sacha est née cette saison · `journal_has('sacha_nee')` | UNE NAISSANCE AU CARNET DU CANTON | Sacha, trois kilos deux, tribune Est dès le mois prochain, dit le père Guichard. {rang}e, par ailleurs. | la ligne `sacha_nee` | carte fatale | co.re.camille_journal |
| `une.generic.coupe` | quotidien | 4 | tous sauf instance | la Coupe gagnée · `journal_has('coupe_gagnee')` (trace posée par le set-piece `cup`, ch. 30) | LA COUPE EST À {VILLE} | Finale au Grand Stade, un but, un car de police pour la rentrée. {prenom} {nom} a tenu le trophée par le bas. | la ligne `coupe_gagnee` | set-piece `cup` | co.re.gege_decoupe |
| `une.generic.sorti_village` | gazette | 2 | joueur, entraineur, ds, president | sorti de la Coupe par deux divisions de moins · `journal_has('coupe_humiliation')` (set-piece `cup`) | SORTI PAR UN VILLAGE | Trente-deuxièmes, un terrain en pente, un gardien de cinquante ans. Le Rosé note le village 20/20. | la ligne `coupe_humiliation` | set-piece `cup` | co.re.camille_journal |
| `une.generic.serie_noire` | quotidien | 2 | tous sauf instance | cinq défaites de suite en juin · `world.serie_defaites >= 5` | {VILLE} A OUBLIÉ COMMENT ON GAGNE | Cinq défaites d'affilée pour finir, {rang}e. Ferdinand Bosc, page quatre : « le tableau noir est noir ». | la ligne `bilan_manque` | carte fatale | co.re.vecchio_garde |
| `une.generic.creature` | gazette | 2 | tous sauf instance | direction très haute · `gauges.direction >= 85` | {NOM}, CRÉATURE DU PRÉSIDENT | Le président « n'a pas le temps », mais il en a pour ce nom-là. Le vestiaire parle d'autre chose. | la ligne `homme_president` si posée | carte fatale | co.re.vecchio_garde |
| `une.generic.vestiaire_muet` | quotidien | 2 | joueur, entraineur, ds, selectionneur | vestiaire très bas · `gauges.vestiaire < 25` | LE VESTIAIRE DE {VILLE} NE PARLE PLUS | {rang}e. Bréhaut : « Le groupe vit bien. » Il l'a dit sans regarder personne, ce qui est nouveau. | la ligne `bus_menace` si posée | carte fatale | co.re.josiane_a_lu (`!seen`) |
| `une.generic.bieres` | gazette | 2 | tous sauf instance | caisse très basse · `gauges.caisse < 15` | {VILLE} PAIE EN BIÈRES | {rang}e et une caisse vide. Un ami à la Commission des comptes a « tout son temps » ; le trésorier, moins. | la ligne `salaires_retard` si posée | carte fatale | co.re.camille_journal |
| `une.generic.kop_bureau` | gazette | 2 | joueur, entraineur, ds | tribunes hautes, direction basse · `gauges.tribunes >= 75 && gauges.direction < 30` | LE KOP L'AIME, LE BUREAU NON | {rang}e. Le virage chante le nom ; le président a deux discours, et celui-là n'est dans aucun. | la ligne `pacte_gege` si posée | carte fatale | co.re.gege_decoupe |
| `une.generic.troisieme_club` | quotidien | 2 | tous sauf instance | troisième club de la carrière · `stats.clubs >= 3` | TROISIÈME CLUB, MÊME VALISE | {club}, {rang}e. Le carnet note trois adresses en six ans ; Camille, elle, en note deux. | la ligne `club_change` | carte fatale | co.re.camille_journal (`!flag('divorce')`) |
| `une.generic.premier_ecu` | quotidien | 1 | tous | la saison 2002 · `year == 2002` | PREMIER BILAN EN ÉCUS | {rang}e, objectif {tenu}. Le journal coûte 0,80 écu ; Josiane a recompté trois fois, « pour voir ». | la Nouvelle `co.nv.2002_ecus` | carte fatale | co.re.josiane_a_lu (`!seen`) |
| `une.generic.flux` | gazette | 1 | tous | les premières années du Flux · `year >= 2007 && year <= 2009` | {NOM} A UN COMPTE SUR LE FLUX | Deux messages, dont un à 3 h du matin. Le Rosé ne note pas ; il recopie. | la Nouvelle `co.nv.2007_flux` | carte fatale | co.re.camille_journal |
| `une.generic.kick` | gazette | 1 | tous | l'ère Kick · `year >= 2024` | {NOM} EN FLUX, AVEC LES FAUTES | Le Bilan a été commenté en direct par onze mille personnes. Trois ont lu le classement. | la ligne `une` de l'an passé | carte fatale | co.re.vecchio_garde (`chars.vecchio.statut != 'parti'`) |
| `une.generic.ni_montee` | quotidien | 1 | entraineur, ds, president | après la loi des franchises · `year >= 2041 && world.division == 1` | NI MONTÉE, NI DESCENTE, NI RIEN À DIRE | {rang}e, et rien ne change : la loi de 2040 a fermé l'escalier. La Coupe reste le seul suspense. | la Nouvelle `co.nv.2040_franchises` | carte fatale | co.re.gege_decoupe |
| `une.generic.echo_parait` | echo | 2 | tous | les deux dernières saisons du monde · `year >= 2049` | L'ÉCHO PARAÎT ENCORE. {VILLE} AUSSI. | Édition du dimanche, prix libre. {rang}e ; le stagiaire a compté les abonnés : ils sont tous là. | la ligne `bilan_tenu` ou `bilan_manque` | carte fatale | co.re.josiane_a_lu (`!seen`) |
| `une.generic.tableur` | gazette | 2 | ds | masse salariale très haute · `gauges.caisse >= 80` | LE ROI DU MERCATO A UN TABLEUR | {rang}e, et une colonne « ventes » qui déborde. Le coach n'a pas lu le tableur ; le Rosé, si : 15/20. | la ligne d'une vente | carte fatale | co.re.josiane_a_lu (`!seen`) |
| `une.generic.boue` | echo | 1 | president_amateur, joueur_amateur | secours du foot de village · — (sans condition) | BOUE, BUVETTE, BILAN : {VILLE} | {rang}e, objectif {tenu}. La buvette a fait sa saison ; Gérard a compté les bières, pas les points. | la ligne `bilan_tenu` ou `bilan_manque` | carte fatale | — |

### 2.2 Une manchette par trace transversale, lue depuis un autre rôle (quarante)

La charte § 5.2 exige une manchette au moins par trace. Les chapitres 10 à 14 ont écrit celle du rôle qui pose la trace (colonne « Existe déjà ») ; ce chapitre écrit celle du rôle qui la **lit** plus tard, c'est-à-dire la couture inter-rôles imprimée : le joueur qui a vu Mbako vendu par son entraîneur le voit marquer contre lui ; le président qui a hérité du pacte de Gégé se le fait réclamer. Toutes lisent `flag()` pour la trace ancienne **et** `journal_has()` pour ce qui vient de se passer, sauf mention.

| # | Trace | Existe déjà (chapitre) | id nouveau | Journal | Prio | Rôles | Condition (clair · jeu) | Titre | Sous-titre | Brève · Photo · Réaction |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `mbako_vendu` | `une.promu.trente_millions` (yaml) | `une.generic.mbako_contre` | quotidien | 3 | joueur | Mbako, vendu par ton club, joue contre toi · `flag('mbako_vendu') && chars.mbako.statut == 'rival' && journal_has('mbako_contre')` | MBAKO A MARQUÉ CONTRE {VILLE} | Trente millions, une clause, et un but à la 88e sans célébration. Sa mère a applaudi, elle. | la ligne `mbako_contre` (ch. 10) · jp.mbako.contre · co.re.gege_decoupe |
| 2 | `mbako_lance` | `une.promu.mbako_lance` (yaml) | `une.generic.mbako_lanceur` | quotidien | 2 | selectionneur | tu l'as lancé en club, tu le sélectionnes · `flag('mbako_lance') && journal_has('mbako_liste')` | MBAKO EN BLEU, PAR CELUI QUI L'A LANCÉ | Seize ans à {ville}, vingt-deux en cobalt. « Vous m'avez lancé », a-t-il dit ; il l'a dit deux fois. | la ligne `mbako_liste` (ch. 14) · sl.liste.mbako · co.re.vecchio_garde |
| 3 | `mbako_garde` | `une.promu.mbako_garde` (yaml) | `une.generic.option_mbako` | gazette | 2 | ds | l'option Almadis levée sur le joueur gardé · `flag('mbako_garde') && journal_has('option_mbako_levee')` | L'OPTION MBAKO, LEVÉE À MINUIT | Gardé une fois, vendu la fois d'après : le fonds avait une ligne pour ça. Le Rosé : 7/20, « pour la lecture ». | la ligne `option_mbako_levee` (ch. 12) · ds.mercato.option · co.re.josiane_a_lu (`!seen`) |
| 4 | `pacte_gege` | `une.promu.pacte` (yaml) | `une.generic.local_reclame` | echo | 2 | president | Gégé réclame au président le local promis par le coach · `flag('pacte_gege') && journal_has('local_reclame')` | LE LOCAL PROMIS À LA CRAIE, RÉCLAMÉ | La date est toujours sur le mur. Gégé l'a montrée au président ; le président a demandé un devis. | la ligne `local_reclame` (ch. 13) · pr.gege.local · co.re.gege_decoupe |
| 5 | `onze_du_virage` | `une.promu.onze_virage` (yaml) | `une.generic.compo_bureau` | gazette | 2 | president | le virage envoie sa compo au président · `flag('onze_du_virage') && journal_has('compo_recue')` | LE PRÉSIDENT A REÇU UNE COMPO | Onze noms à la craie sur une nappe, livrés au bureau. Il « n'a pas le temps » ; il l'a affichée. | la ligne `compo_recue` (ch. 13) · pr.gege.compo · co.re.vecchio_garde |
| 6 | `ami_ultras` | — (drapeau existant) | `une.generic.compte_anonyme` | gazette | 3 | instance | le compte anonyme de Gégé défend le dirigeant · `flag('ami_ultras') && journal_has('gege_compte_anonyme') && year >= 2020` | LE COMPTE ANONYME A UN AMI AU COMITÉ | Douze mille abonnés, aucun nom, une écharpe de profil. Il défend le président de la Fédération ; on se demande depuis quand. | la ligne `gege_compte_anonyme` (ch. 15) · in.opinion.compte · co.re.gege_decoupe |
| 7 | `naming_signe` | `une.promu.arena` (yaml) | `une.generic.canette` | echo | 2 | joueur | tu joues dans un stade qui porte un nom de boisson · `flag('naming_signe') && season >= 1` | {NOM} JOUE DANS UNE CANETTE | Arena Almadis, en orange. {rang}e. Le virage dit encore l'ancien nom, et le speaker, le nouveau. | la Nouvelle `co.nouvelle.arena_qatalyst` · carte fatale · co.re.gege_decoupe |
| 8 | `club_actif` | `une.naming.rachat` (ch. 13) | `une.generic.actif_fair_play` | quotidien | 3 | instance | le fair-play financier frappe le club racheté · `flag('club_actif') && journal_has('fair_play_applique')` | LE FAIR-PLAY FRAPPE UN ACTIF | Le club racheté par le fonds est exclu de la Coupe Continentale. Ilyas « prend note » ; l'Inspecteur compte. | la ligne `fair_play_applique` (ch. 15) · in.dossier.fair_play · co.re.vialat_recompte |
| 9 | `club_a_lancienne` | `une.promu.lancienne` (yaml) | `une.generic.ancienne_debout` | echo | 2 | president | le club qui a dit non au fonds, vu du bureau · `flag('club_a_lancienne') && bilan.tenu` | À L'ANCIENNE, ET ENCORE DEBOUT | {rang}e, sans fonds, sans naming, sans canette. Le radiateur tousse ; le président aussi, de fierté. | la ligne `bilan_tenu` · carte fatale · co.re.josiane_a_lu (`!seen`) |
| 10 | `nassir_pret` | — | `une.generic.pret_echeance` | quotidien | 2 | ds | le prêt d'Almadis arrive à échéance · `flag('nassir_pret') && journal_has('pret_echeance')` | LE PRÊT ARRIVE À ÉCHÉANCE. LE DS AUSSI | Vingt millions à rendre en juin, une vente à faire avant. Le coach n'a lu ni le prêt ni le contrat. | la ligne `pret_echeance` (ch. 12) · ds.vendre.pret · co.re.josiane_a_lu (`!seen`) |
| 11 | `gigi_staff` | `une.promu.staff` (yaml), `sl_bus_descendu` (ch. 14) | `une.generic.gants_eleve` | echo | 2 | joueur | Gigi, entraîneur des gardiens, t'entraîne · `flag('gigi_staff') && relation.vecchio >= 1` | LES GANTS DE GIGI ONT UN ÉLÈVE | Quarante-cinq ans, une serviette, un élève qui arrête tout. « J'en ai vu d'autres. Pas celui-là. » | la ligne `palier_plus3` de Vecchio · jp.vecchio.gants · co.re.vecchio_garde |
| 12 | `finale_gigi` | — | `une.generic.finale_buvette` | echo | 2 | president, president_amateur | Gigi raconte sa finale à la buvette des anciens · `flag('finale_gigi') && year >= 2005 && chars.vecchio.statut != 'parti'` | GIGI RACONTE SA FINALE À LA BUVETTE | Chaque dimanche, la même finale, avec un arrêt de plus. Le président a payé la tournée ; c'est dans les comptes. | la ligne `finale_gigi` · pr.buvette.anciens · co.re.vecchio_garde |
| 13 | `vecchio_promis` | `une.promu.gigi_promis` (yaml) | `une.generic.gardien_promis` | gazette | 2 | ds | le DS achète un gardien alors que le coach a promis les buts à Gigi · `flag('vecchio_promis') && journal_has('gardien_recrute')` | UN GARDIEN ACHETÉ, UN GARDIEN PROMIS | Le coach avait promis les buts jusqu'en juin ; le DS a signé un gardien en janvier. Le Rosé : 5/20, « et Gigi, 20 ». | la ligne `gardien_recrute` (ch. 12) · ds.mercato.gardien · co.re.vecchio_garde |
| 14 | `enveloppe_promise` | `une.promu.valise` (yaml) | `une.generic.enveloppe_presidents` | gazette | 3 | president | Malbec te rappelle l'enveloppe, entre présidents · `flag('enveloppe_promise') && journal_has('enveloppe_malbec')` | ENTRE PRÉSIDENTS, UNE ENVELOPPE | « Entre présidents, on se comprend », a dit Malbec en sortant. La Fédération « examine » ; elle examine depuis longtemps. | la ligne `enveloppe_malbec` (ch. 13) · pr.malbec.enveloppe · co.re.malbec_compris |
| 15 | `enveloppe_refusee` | `une.promu.jamais` (ch. 11) | `une.generic.colline_vu` | quotidien | 2 | instance | Colline écrit son rapport sur l'arbitrage, et te regarde autrement · `flag('enveloppe_refusee') && journal_has('rapport_colline')` | COLLINE A VU. IL L'A ÉCRIT. | Le rapport sur l'arbitrage cite un banc qui a dit non, une fois, en 1991. Il ne cite pas le nom ; tout le monde l'a lu. | la ligne `rapport_colline` (ch. 15) · in.arbitrage.rapport · co.re.colline_vu |
| 16 | `flacon_b` | `une.promu.flacon` (ch. 11), `une.pepite.flacon` (ch. 10), `sl_flacon` (ch. 14) | `une.generic.flacon_comite` | gazette | 3 | instance | le flacon B remonte à la commission médicale · `flag('flacon_b') && journal_has('commission_medicale')` | LE FLACON B REMONTE JUSQU'AU COMITÉ | Le Doc a témoigné : « ça reste entre la table et moi », a-t-il dit à la table. La Plume a les documents. | la ligne `commission_medicale` (ch. 15) · in.dossier.antidopage · co.re.amsel_note |
| 17 | `pharmacie_propre` | `une.promu.pharmacie` (ch. 11) | `une.generic.controle_rien` | quotidien | 2 | selectionneur | contrôle inopiné du stage, rien · `flag('pharmacie_propre') && journal_has('controle_inopine')` | CONTRÔLE INOPINÉ : RIEN, ET C'EST UNE UNE | Vingt-six flacons, vingt-six conformes. Rouvier : « Respire. Encore. » Le stage a respiré. | la ligne `controle_inopine` (ch. 15) · sl.stage.controle · co.re.lea_confirme |
| 18 | `salaires_retard` | `une.promu.salaires` (ch. 11) | `une.generic.paie_du_26` | gazette | 3 | joueur | la paie n'est pas tombée le 5 · `journal_has('salaires_retard')` | LA PAIE DU 5 EST TOMBÉE LE 26 | Au distributeur du centre commercial, onze joueurs et un ticket « solde insuffisant ». Le président « n'a pas le temps ». | la ligne `salaires_retard` · jp.distributeur · co.re.camille_journal |
| 19 | `vukic_dauphin` | `une.promu.dauphin` (yaml) | `une.generic.dauphin_ailleurs` | quotidien | 2 | joueur | Vukić, ton ancien adjoint, entraîne un autre club, et te veut · `flag('vukic_dauphin') && chars.vukic.statut == 'rival' && journal_has('vukic_appelle')` | LE DAUPHIN EST ROI AILLEURS | Zoran Vukić a un banc, un cahier, et une offre pour un joueur qu'il « connaît ». Le joueur a lu ; il n'a pas rappelé. | la ligne `vukic_appelle` (ch. 10) · jp.vukic.appel · co.re.vecchio_garde |
| 20 | `clow_ingrat` | `une.promu.clow` (yaml) | `une.generic.diplome_sans_mentor` | quotidien | 2 | joueur | le diplôme passé sans Corven · `flag('clow_ingrat') && journal_has('diplome')` | LE DIPLÔME, SANS LE MENTOR | Lundi, huit heures, sans Dan Corven dans la salle. « Le devant » n'a pas été rappelé ; le fils de Corven non plus. | la ligne `diplome` · jp.diplome.stage · co.re.josiane_a_lu (`!seen`) |
| 21 | `diplome_arrange` | `une.interim.sans_papier` (ch. 11) | `une.generic.derogation_dossier` | quotidien | 3 | instance | Brissac ressort la dérogation arrangée · `flag('diplome_arrange') && journal_has('derogation_attendue')` | UNE DÉROGATION, UN DOSSIER, UN NOM | « Les chiffres sont têtus », dit la DTN, et les dates aussi : six mois sont devenus six ans. Le comité « examine ». | la ligne `derogation_attendue` (ch. 15) · in.commission_technique.derogation · co.re.dauzat_pv |
| 22 | `derby_gagne` / `derby_perdu` | `une.promu.derby`, `derby_perdu` (ch. 11), `une.derby.*` | `une.generic.derby_loge` / `une.generic.derby_loge_perdu` | echo / gazette | 3 / 2 | president | le derby vu de la loge · `journal_has('derby_gagne')` / `journal_has('derby_perdu')` | LA VALLÉE A UN PATRON, ET UNE LOGE / {VILLE} A PERDU LE DERBY DEPUIS LA LOGE | Gagné : le président est descendu au local ; on l'a laissé entrer. · Perdu : le président a regardé le derby derrière une vitre ; la vitre a tenu, dit-on. | la ligne du derby · pr.derby.loge · co.re.gege_decoupe (deux manchettes en une ligne : chaque titre est testé séparément, 34 et 44 caractères rendus) |
| 23 | `camille_ici` | `une.promu.cartons` (ch. 11), `sl_plantes` (ch. 14) | `une.generic.cartons_ds` | echo | 2 | ds | les cartons défaits, le DS reste · `flag('camille_ici') && season >= 1 && !flag('divorce')` | LES CARTONS SONT DÉFAITS. LE DS RESTE | Deux pièces au-dessus de la boulangerie, un mercato de plus. Camille a pris un abonnement ; tribune Est. | la ligne `camille_ici` · carte fatale · co.re.camille_journal |
| 24 | `divorce` | — | `une.generic.hotel_du_club` (§ 2.1) | gazette | 3 | tous | — | — | — | — |
| 25 | `sacha_nee` | — | `une.generic.naissance` (§ 2.1) ; `une.generic.ong` | echo ; gazette | 3 ; 2 | tous ; instance | Sacha, dans l'ONG qui compte les ouvriers · `flag('sacha_nee') && journal_has('sacha_ong')` | LA FILLE DU PRÉSIDENT COMPTE LES OUVRIERS | Elle a vingt-deux ans et un tableur ; la FédéMonde en a un autre. « Tu m'as promis », dit-elle, à personne en particulier. | la ligne `sacha_ong` (ch. 15) · in.mondial.ouvriers · — |
| 26 | `genou_opere` | `une.fin.genou_parle` (ch. 10) | `une.generic.genou_vendu` | gazette | 3 | ds | vendu avec le genou, sans le rapport · `flag('genou_opere') && journal_has('genou_vendu_cache')` | VENDU AVEC LE GENOU, SANS LE RAPPORT | La visite médicale a duré neuf minutes. Le club acheteur en a mis trois semaines à comprendre. Le Rosé : 2/20. | la ligne `genou_vendu_cache` (ch. 12) · ds.visite.cachee · co.re.solvang_compte |
| 27 | `capitaine` | — | `une.generic.capitaine_sifflet` | echo | 2 | entraineur | l'ancien capitaine devenu coach · `flag('capitaine') && role_was('joueur') && season == 0` | L'ANCIEN CAPITAINE A UN SIFFLET | Le brassard est dans un tiroir, le sifflet au cou. {rang}e ; le vestiaire l'appelle encore par son prénom. | la ligne `transition` · carte fatale · co.re.vecchio_garde |
| 28 | `international` | `une.pepite.bleu_cobalt` (ch. 10) | `une.generic.maillot_liste` | quotidien | 2 | selectionneur | ancien international devenu sélectionneur · `flag('international') && season == 0` | {pg, select, f{ELLE A PORTÉ LE MAILLOT, ELLE FAIT LA LISTE} other{IL A PORTÉ LE MAILLOT, IL FAIT LA LISTE}} | Cinquante sélections, dit le carnet ; vingt-six noms, dit la liste. Fauvel : « On est un groupe. » | la ligne `transition` · sl.liste.premiere · co.re.lea_confirme |
| 29 | `binational_choisi` | `une.binational.autre_maillot` (ch. 10) | `une.generic.deux_fax` | quotidien | 3 | instance | deux fédérations se disputent un joueur · `flag('binational_choisi') == 'kambara' && journal_has('deux_fax')` | DEUX FÉDÉRATIONS, UN JOUEUR, UN FAX | Le Kambara a envoyé le sien à 23 h 51, la Fédération à 23 h 58. Dauzat : « C'est dans le procès-verbal. » | la ligne `deux_fax` (ch. 15) · in.dossier.binational · co.re.dauzat_pv |
| 30 | `selection_refusee` | `une.pepite.forfait` (ch. 10) | `une.generic.article_forfaits` | quotidien | 2 | instance | le règlement des forfaits, voté à cause de toi · `flag('selection_refusee') && journal_has('reglement_forfaits')` | L'ARTICLE DES FORFAITS PORTE UN NOM | Un joueur avait dit non pour une cheville, il y a longtemps. L'article dit désormais « deux fois ». | la ligne `reglement_forfaits` (ch. 15) · in.dossier.forfaits · co.re.dauzat_pv |
| 31 | `special` | `une.promu.special` (yaml), `une.pepite.le_meilleur` (ch. 10) | `une.generic.special_engage` | gazette | 2 | president | tu engages un entraîneur qui s'est dit « spécial » · `flag('special') && journal_has('coach_confirme')` | LE PRÉSIDENT A ENGAGÉ « LE SPÉCIAL » | Il l'avait dit à sa première conférence ; le président l'a cru à la troisième. Le Rosé : 11/20, « on verra ». | la ligne `coach_confirme` (ch. 13) · pr.coach.confirme · co.re.vence_direct |
| 32 | `offshore` | `une.pepite.montre` (ch. 10) | `une.generic.dix_huit_pages` | gazette | 3 | instance | La Plume publie les documents des îles · `flag('offshore') && journal_has('documents_publies')` | DIX-HUIT PAGES ET UNE ÎLE | Une société, un cousin, une image à dix-neuf ans, et un président de fédération dedans. « J'ai les documents. » | la ligne `documents_publies` (ch. 15) · in.plume.documents · co.re.amsel_note |
| 33 | `president_ami` | `sl_point_douze` (ch. 14) | `une.generic.bloc_aulard` | quotidien | 2 | instance | le bloc Vaubourg vote pour toi au Congrès · `flag('president_ami') && journal_has('pacte_aulard')` | LE BLOC VAUBOURG VOTE POUR LES SIENS | Quarante voix, un empire, « pas le temps ». Le président de la Fédération a été fait par un président de club ; il le sait. | la ligne `pacte_aulard` (ch. 15) · in.congres.bloc · co.re.malbec_compris |
| 34 | `fede_dossier` | — | `une.generic.retrograde_dossier` | quotidien | 4 | president | rétrogradation administrative sur dossier · `flag('fede_dossier') && journal_has('retrograde_admin')` | {CLUB} RÉTROGRADÉ SUR DOSSIER | Pas un point de moins sur le terrain, un étage de moins sur le papier. Le Tribunal du Sport « répondra ». Tard. | la ligne `retrograde_admin` (ch. 13) · pr.commission.retrogradation · co.re.josiane_a_lu (`!seen`) |
| 35 | `vote_achete` | — (ch. 15 en cours) | `une.generic.dix_huit_millions` | gazette | 4 | instance | la trace du vote acheté sort · `journal_has('vote_achete')` | DIX-HUIT MILLIONS DE PAGES | Une montre, un vote, un hôtel au bord d'un lac. La Plume : « J'ai les documents. » Tous. | la ligne `vote_achete` · in.desert.vote · co.re.amsel_note |
| 36 | `mondial_desert` | — (ch. 15) | `une.generic.mondial_decembre` | quotidien | 2 | selectionneur | le Mondial d'hiver, vécu par le sélectionneur · `flag('mondial_desert') && year >= 2030 && year <= 2031` | UN MONDIAL EN DÉCEMBRE, SANS NEIGE | Les clubs ont rendu les joueurs le lundi, cassés. Rouvier a compté les genoux ; ils y sont tous, presque. | la Nouvelle `co.nv.2030_mondial_hiver` · sl.tournoi.annonce · co.re.vence_direct |
| 37 | `ligue_fermee_signee` | `une.ligue.signee` (ch. 13) | `une.generic.douze_sans_maillot` | quotidien | 3 | selectionneur | les joueurs des quatorze clubs exclus des sélections · `flag('ligue_fermee_signee') && journal_has('douze_exclus')` | LES DOUZE N'AURONT PAS LE MAILLOT BLEU | Le sélectionneur applique la sanction de l'Union : sept titulaires de moins. Montoya : « assis ou debout ? » Debout, sans eux. | la ligne `douze_exclus` (ch. 14) · sl.liste.douze · co.re.lea_confirme |
| 38 | `ecoutes` | `une.ecoutes.rouge` (ch. 13) | `une.generic.quatre_mille_pages` | quotidien | 3 | instance | le désignateur d'arbitres, sur écoutes · `flag('ecoutes') && journal_has('designateur_libre')` | QUATRE MILLE PAGES ET UN SIFFLET | Le désignateur choisissait les arbitres au téléphone. Colline : « J'ai vu. » Il a surtout entendu. | la ligne `designateur_libre` (ch. 15) · in.arbitrage.designateur · co.re.colline_vu |
| 39 | `commission_lettre` | `une.geant.lettre` (ch. 13) | `une.generic.lettre_porte` | gazette | 3 | entraineur | la lettre de la Commission est pour le président ; la porte pour toi · `flag('commission_lettre') && !bilan.tenu` | LA LETTRE AU PRÉSIDENT, LA PORTE AU COACH | Deux soldes négatifs, un coupable désigné ; il portait un survêtement. Le Rosé note le président 4/20 et l'entraîneur « absent ». | la ligne `commission_lettre` · carte fatale · co.re.camille_journal |
| 40 | `aubert_ministre` | — (Nouvelle 2002, § 3) | `une.generic.ministre_signe` | quotidien | 2 | president, president_amateur | la ministre signe la subvention nationale du stade · `flag('aubert_ministre') && journal_has('subvention_nationale')` | LA MINISTRE A SIGNÉ POUR {VILLE} | « Le stade, c'est de l'argent public », a-t-elle dit en signant l'argent public. La tribune Nord sera prête en 2011. Ou en 2012. | la ligne `subvention_nationale` (ch. 13) · pr.stade.ministre · co.re.dupuis_pese |

Lignes 24 et 25 renvoient à § 2.1 pour ne pas dédoubler ; les quarante traces ont donc chacune une manchette dans un rôle qui n'est pas celui qui la pose (sauf `flacon_b`, `vote_achete`, `fede_dossier` : posées et lues par les instances, elles sont lues ici depuis le président ou le comité, ce qui est un autre bureau).

### 2.3 Les manchettes des postulats d'instance (vingt-sept)

Le chapitre 15 s'écrit en parallèle ; il déclare les traces lues ici (§ 0.3 de ce chapitre) et fixera les ids de photo (proposés ici sous la convention `in.<postulat>.<ancre>`, à harmoniser par lui). Le rôle `instance` n'a pas de `bilan.rang` : `{rang}` rend l'année de mandat (« 3e année »), et le pied de Une dit « Mandat : {rang}e année · Majorité : {objectif} ». L'Écho, pour l'instance, est celui de la capitale (« L'Écho de la Capitale », le seul cas où `{ville}` est fixé).

| id | Journal | Prio | Postulat | Condition (clair · jeu) | Titre | Sous-titre | Brève · Photo · Réaction |
|---|---|---|---|---|---|---|---|
| `une.heritage.tiroirs` | quotidien | 3 | heritage_empoisonne | tu as ouvert les tiroirs du prédécesseur · `journal_has('tiroirs_ouverts')` | {NOM} A OUVERT LES TIROIRS | Quatre cartons, deux mandats, une procureure qui « a tout son temps ». Le comité a demandé une pause. | la ligne `tiroirs_ouverts` · in.heritage.a1_tiroirs · co.re.amsel_note |
| `une.heritage.fermes` | gazette | 3 | heritage_empoisonne | tu as laissé les tiroirs fermés · `journal_has('tiroirs_fermes')` | LES TIROIRS RESTENT FERMÉS. À CLÉ. | Le nouveau président a hérité d'un bureau et d'une clé ; il a gardé la clé. Le Rosé : 6/20, « pour l'instant ». | la ligne `tiroirs_fermes` · in.heritage.a1_tiroirs · co.re.dauzat_pv |
| `une.heritage.legruet` | gazette | 3 | heritage_empoisonne | le dossier Berthomier t'arrive · `journal_has('dossier_legruet')` | LE DOSSIER BERTHOMIER A UN SUCCESSEUR | Vingt ans de Congrès, dix voix d'écart à chaque fois, et une enveloppe par district. « On verra ça après le Congrès. » On a vu. | la ligne `dossier_legruet` · in.heritage.a3_dossier · co.re.josiane_a_lu (`!seen`) |
| `une.heritage.aube` | quotidien | 4 | heritage_empoisonne | perquisition à la Fédération · `journal_has('perquisition')` | SIX HEURES DU MATIN À LA FÉDÉRATION | Des messieurs en imperméable, un chariot, la photocopieuse en marche. Amsel : « Nous avons tout notre temps. » | la ligne `perquisition` · in.heritage.r1_aube · co.re.amsel_note |
| `une.heritage.pacte` | gazette | 2 | heritage_empoisonne | le pacte avec Vaubourg · `journal_has('pacte_aulard')` | VAUBOURG ET {NOM}, MÊME EMPIRE | Le bloc des présidents vote comme un seul homme ; l'homme « n'a pas le temps ». Le Rosé : 12/20 à l'un, 8 à l'autre. | la ligne `pacte_aulard` · in.congres.bloc · co.re.malbec_compris |
| `une.heritage.reelu` | quotidien | 4 | heritage_empoisonne, sous_tutelle | réélu au Congrès · `journal_has('reelu')` | RÉÉLU{pg, select, f{E} other{}} DE ONZE VOIX | Onze : une de plus que le record de Berthomier. Roux a voté « pour la base » ; la base, c'est lui. | la ligne `reelu` · set-piece Congrès · co.re.roux_base |
| `une.heritage.battu` | quotidien | 4 | tous (instance) | battu au Congrès · `journal_has('battu')` | LE CONGRÈS A CHOISI L'AUTRE | Deux cent onze voix contre, une abstention. Dauzat a rangé le procès-verbal avant la fin du dépouillement. | la ligne `battu` · set-piece Congrès · — |
| `une.tutelle.acceptee` | quotidien | 3 | sous_tutelle | la tutelle acceptée · `journal_has('tutelle_acceptee')` | LA FÉDÉRATION SIGNE SOUS TUTELLE | Le comité est dissous, le ministère nomme, le président signe en bas. La FédéMonde « prend note ». | la ligne `tutelle_acceptee` · in.tutelle.a1_decret · co.re.dauzat_pv |
| `une.tutelle.refusee` | quotidien | 3 | sous_tutelle | la tutelle refusée · `journal_has('tutelle_refusee')` | {NOM} A DIT NON AU MINISTRE | Pas de signature, pas de comité, pas de subvention. Les districts ont applaudi ; ils n'ont plus de ballons. | la ligne `tutelle_refusee` · in.tutelle.a1_decret · co.re.roux_base |
| `une.tutelle.suspendu` | gazette | 4 | sous_tutelle | le pays suspendu par la FédéMonde · `journal_has('pays_suspendu')` | LE PAYS SUSPENDU. LE BUREAU AUSSI. | Six mois sans match international, un communiqué en costume bleu. Le Rosé : 0/20, « et c'est généreux ». | la ligne `pays_suspendu` · in.tutelle.a3_fedemonde · co.re.vence_direct |
| `une.tutelle.levee` | echo | 3 | sous_tutelle | la suspension levée · `journal_has('suspension_levee')` | ON REJOUE. LE PAYS A RETROUVÉ SON MAILLOT | Au local de la capitale, on a ressorti les écharpes bleues. Le stagiaire a compté : elles y étaient toutes. | la ligne `suspension_levee` · in.tutelle.r2_levee · co.re.gege_decoupe |
| `une.tutelle.trente_jours` | quotidien | 3 | sous_tutelle | un Congrès convoqué en trente jours · `journal_has('congres_trente_jours')` | UN CONGRÈS EN TRENTE JOURS | Trois cents districts, un gymnase, des chaises pliantes. Josiane a fait les badges à la main ; « j'en ai vu passer ». | la ligne `congres_trente_jours` · in.tutelle.a2_congres · co.re.josiane_a_lu (`!seen`) |
| `une.tutelle.comite` | gazette | 2 | sous_tutelle | le comité nommé par le ministère · `journal_has('comite_du_ministere')` | LE COMITÉ EST NOMMÉ, PAS ÉLU | Sept noms, sept cabinets. Le Rosé les note ensemble : 7/20, « un par personne ». | la ligne `comite_du_ministere` · in.tutelle.a2_comite · co.re.dauzat_pv |
| `une.desert.attribue` | quotidien | 4 | tournoi_desert | le Mondial attribué au désert · `journal_has('mondial_desert')` | LE MONDIAL IRA AU DÉSERT | Douze voix contre dix, un hôtel au bord d'un lac. Ilyas : « Ce n'est pas un tournoi, c'est un actif. » | la ligne `mondial_desert` · in.desert.a4_vote · co.re.vence_direct |
| `une.desert.honnete` | quotidien | 4 | tournoi_desert | le Mondial au pays pauvre et honnête · `journal_has('mondial_honnete')` | LE MONDIAL IRA AU PAYS PAUVRE ET HONNÊTE | Dix voix contre douze, dit-on ; c'est l'inverse. Bambini « est choqué » ; les sponsors comptent. | la ligne `mondial_honnete` · in.desert.a4_vote · co.re.lea_confirme |
| `une.desert.montre` | gazette | 3 | tournoi_desert | la montre acceptée · `journal_has('montre_acceptee')` | UNE MONTRE AU POIGNET DU VOTE | Elle donne l'heure de la capitale du désert. « Vu au parking » a vu le poignet. Le Rosé : 3/20. | la ligne `montre_acceptee` · in.desert.a2_montre · co.re.amsel_note |
| `une.desert.rendue` | echo | 2 | tournoi_desert | la montre rendue · `journal_has('montre_rendue')` | LA MONTRE EST RETOURNÉE À L'EXPÉDITEUR | Par courrier recommandé, avec la boîte. Le stagiaire a photographié le reçu ; c'est la photo de Une. | la ligne `montre_rendue` · in.desert.a2_montre · co.re.colline_vu |
| `une.desert.ouvriers_discours` | gazette | 3 | tournoi_desert | le discours sur les ouvriers, sans fonds · `journal_has('ouvriers_discours')` | LE DISCOURS SUR LES OUVRIERS. RIEN D'AUTRE | Quatre minutes, deux larmes, zéro écu. Sacha, dans la salle, n'a pas applaudi. | la ligne `ouvriers_discours` · in.desert.r1_ouvriers · — |
| `une.desert.ouvriers_fonds` | quotidien | 2 | tournoi_desert | un fonds pour les ouvriers · `journal_has('ouvriers_fonds')` | UN FONDS POUR LES OUVRIERS DU CHANTIER | Deux pour cent des droits, versés à une ONG qui compte. L'émirat « prend note » ; il a payé quand même. | la ligne `ouvriers_fonds` · in.desert.r1_ouvriers · co.re.lea_confirme |
| `une.desert.alerte` | quotidien | 4 | tournoi_desert, elu_surprise | tu as tout dit à la procureure · `journal_has('lanceur_alerte')` | {NOM} A TOUT DIT À LA PROCUREURE | Dix-huit millions de pages, dont trois cents à la main. Le comité a voté la suspension de celui qui a parlé. | la ligne `lanceur_alerte` · in.valises.v6_aube · co.re.amsel_note |
| `une.elu.choque` | gazette | 3 | elu_surprise | Bambini « choqué » · `journal_has('bambini_choque')` | BAMBINI « EST CHOQUÉ ». ENCORE. | Troisième fois cette saison. Il l'a dit en costume bleu, devant un sponsor qui partait. Le Rosé : « choqué, 20/20 ». | la ligne `bambini_choque` · in.elu.a1_passation · co.re.vence_direct |
| `une.elu.dauzat_parti` | quotidien | 3 | elu_surprise | Dauzat parti avec les procès-verbaux · `journal_has('dauzat_parti')` | DAUZAT A EMPORTÉ LES PROCÈS-VERBAUX | Trente ans de séances dans quatre valises. « C'est dans le procès-verbal », a-t-il dit ; on ne sait plus lequel. | la ligne `dauzat_parti` · in.elu.a2_dauzat · co.re.josiane_a_lu (`!seen`) |
| `une.elu.dauzat_reste` | gazette | 2 | elu_surprise | Dauzat reste · `journal_has('dauzat_garde')` | DAUZAT RESTE. IL SAIT POURQUOI. | Le secrétaire général a survécu à quatre présidents ; il vient d'en adopter un cinquième. Le Rosé : 14/20, « à lui ». | la ligne `dauzat_garde` · in.elu.a2_dauzat · co.re.dauzat_pv |
| `une.elu.sponsor` | quotidien | 3 | elu_surprise | un sponsor majeur signé · `journal_has('sponsor_majeur_signe')` | UN SPONSOR REVIENT. EN ORANGE. | La boisson fluo sur les panneaux du Mondial ; Ilyas « prend note » d'un actif de plus. Les réserves respirent. | la ligne `sponsor_majeur_signe` · in.elu.a3_sponsors · co.re.solvang_compte |
| `une.elu.quarante_huit` | quotidien | 4 | elu_surprise | les quarante-huit équipes votées · `journal_has('quarante_huit_votees')` | QUARANTE-HUIT ÉQUIPES, UNE MAIN LEVÉE | La sienne. Les six confédérations ont suivi ; les joueurs ont compté les matchs. Fauvel : « On est un groupe, pas un calendrier. » | la ligne `quarante_huit_votees` · in.dossier.quarante_huit · co.re.lea_confirme |
| `une.elu.deux_ans` | gazette | 3 | elu_surprise | un Mondial tous les deux ans voté · `journal_has('deux_ans_vote')` | UN MONDIAL TOUS LES DEUX ANS. DÉJÀ ? | Le président a promis « plus de football » ; les clubs ont répondu « moins de joueurs ». Le Rosé : 5/20, « pour l'audace ». | la ligne `deux_ans_vote` · in.dossier.deux_ans · co.re.malbec_compris |
| `une.elu.machine` | quotidien | 3 | elu_surprise | l'arbitre algorithmique signé · `journal_has('machine_signee')` | L'ARBITRE EST UNE MACHINE. IL A VU. | Colline a signé la fin de son métier, « parce qu'elle voit mieux ». La Main de Dieu est désactivée. | la ligne `machine_signee` · in.dossier.machine · co.re.colline_vu |

### 2.4 Les Unes de fin de carrière (douze, une par famille de fin)

Quand la carrière s'arrête, l'écran « Ce qui s'est passé » (spec § 1.7) porte une dernière Une, composée avec le même gabarit à six emplacements : manchette, sous-titre, la carte fatale en photo, trois brèves (les entrées les plus lourdes de la carrière), un pied (« {annee} · {fin_titre} »). Le moteur choisit par **famille de fin** (chemin `fin.famille` à ajouter au langage `when`, question § 7) ; les fins mortelles (*Mort au poste*, *Ta loge* si le personnage meurt au stade) n'ont **pas** de Une : l'app montre le bas de page de l'Écho, une ligne, sans photo (charte § 6.1 n° 10). Pas de réaction : il n'y a plus de tirage suivant.

| id | Famille (`fin.famille`) | Journal | Titre | Sous-titre | Brèves (kinds) |
|---|---|---|---|---|---|
| `une.generic.fin_vestiaire_vide` | `vestiaire_vide` (le bus, le toro, la fronde, la grève, les deux clans, la motion, plus personne pour tracer les lignes) | quotidien | LE GROUPE A CHOISI. PAS {NOM}. | Le vestiaire n'est pas descendu, ou n'est pas venu. Bréhaut : « Le groupe vit bien. » Sans. | fin, palier, transition |
| `une.generic.fin_vestiaire_pleine` | `vestiaire_pleine` (le copain, le caïd, le club des copains, la buvette prend le pouvoir, la fête, le dauphin, le président fantôme) | gazette | TROP DE COPAINS, PLUS DE PATRON | Ils l'aimaient tous ; personne n'obéissait. Le Rosé : « 20/20 en amitié, 0 en autorité ». | fin, palier_plus3, bilan |
| `une.generic.fin_tribunes_vide` | `tribunes_vide` (la banderole, sifflé, le comptoir, le mercato raté, le club d'à côté, le siège du siège, l'ennemi public, les dix-huit millions de pages) | echo | {VILLE} NE CHANTE PLUS | La Nord a rangé les tambours. Gégé : « La tribune n'oublie rien. » Elle a oublié de venir. | fin, une, bilan |
| `une.generic.fin_tribunes_pleine` | `tribunes_pleine` (l'otage du kop, l'homme-sandwich, le héros du canton, l'architecte, le maire jaloux, la mairie, l'ambassadeur, le showman) | gazette | LE KOP A GAGNÉ. {NOM} A PERDU. | On l'a tellement aimé qu'on a décidé pour lui. Et maintenant ? | fin, trace, une |
| `une.generic.fin_direction_vide` | `direction_vide` (le SMS de 23h47, la touche, la place 14B, d'un commun accord, la subvention, l'AG, minuit et une, le vote de défiance) | quotidien | LE SECOND DISCOURS ÉTAIT LE BON | Le patron avait deux textes ; {prenom} {nom} n'était que dans un. Il « n'a pas le temps » de commenter. | fin, bilan, palier_moins3 |
| `une.generic.fin_direction_pleine` | `direction_pleine` (promotion-placard, le chouchou, le fils spirituel, l'homme du président, l'homme de la mairie, le pantin, le pantin des confédérations) | gazette | PROMU{pg, select, f{E} other{}}. SANS FENÊTRE. | Directeur du Développement International, un bureau au troisième, un téléphone qui ne sonne pas. Le Rosé : 19/20, « au président ». | fin, trace, transition |
| `une.generic.fin_caisse_vide` | `caisse_vide` (vendu à la découpe, le patron a dit non, sans club, les contrats impayables, la buvette, la Commission des comptes, les charters, le taxi) | quotidien | IL N'Y AVAIT PLUS RIEN À VENDRE | Le dernier joueur, le parking, le minibus, le nom du stade. L'Inspecteur « ne juge pas » ; elle a fini de compter. | fin, trace, bilan |
| `une.generic.fin_caisse_pleine` | `caisse_pleine` (le coupable désigné, l'enveloppe, la carte Panama, le roi du mercato, le magot, le fonds, les primes cachées, le raid à l'aube) | gazette | D'OÙ VENAIT L'ARGENT ? ON SAIT. | Il y en avait trop, et trop vite. La Plume : « J'ai les documents. » Elle les a donnés. | fin, trace, une |
| `une.generic.fin_parole` | `parole` (le Grand Déballage) | gazette | LE GRAND DÉBALLAGE DE {NOM} | Cinq promesses datées, cinq dates passées. Le mur est plein ; la Une aussi. | fin, promesse, une |
| `une.generic.fin_age` | `age` (le jubilé, le banc en bois, ta loge sans deuil) | echo | {NOM} S'ASSOIT. ENFIN. | Trente-huit ans, ou soixante-cinq, ou soixante-dix-huit : le stade a chanté le nom, puis l'a chanté encore. Merci. | fin, titre, palier_plus3 |
| `une.generic.fin_justice` | `justice` (le flacon B, les écoutes, la radiation, la valise, les paris) | quotidien | LA JUSTICE A TOUT SON TEMPS | Le dossier a mis trois ans à se fermer ; il s'est fermé sur {prenom} {nom}. Le Tribunal du Sport « répondra ». | fin, trace, une |
| `une.generic.fin_doree` | `doree` (la statue de bronze, le micro du dimanche, le Ministre, les mémoires, le parrain, la grande porte) | quotidien | {NOM}, LA GRANDE PORTE | Douze titres, ou un seul qui compte. Sur la photo, {prenom} {nom} est au bord ; c'est là qu'on met les gens qui restent. | fin, titre, objectif |

### 2.6 Seconde livraison : cent vingt-deux manchettes (les traces orphelines et les postulats sans Une)

**Pourquoi.** La première livraison faisait cent six manchettes et aucune ne portait sur les trente-huit traces orphelines du chapitre 02 ni sur les vingt-deux du chapitre 13 : c'est la cause directe des lecteurs fantômes du C-05. Cette seconde passe en écrit **cent vingt-deux**, dans l'ordre demandé : (a) les trente-huit du chapitre 02, (b) les vingt-huit du chapitre 13 (dont les sept branches « non » de la chaîne des soixante heures), (c) les quarante des quatre postulats du joueur pro de seconde vague, qui n'avaient aucune Une propre, (d) seize d'état, pour boucher les créneaux restants.

**Convention.** Ids au gabarit § 4.10 (**trois axes** : postulat, `generic`, ou journal). Titre ≤ 44 caractères rendus. Le sous-titre porte une voix ou rien. La colonne « Lit » est la trace : c'est elle qui ferme le trou.

#### (a) Les trente-huit du chapitre 02

| id | Journal · Prio | Lit | Titre | Sous-titre |
|---|---|---|---|---|
| `une.generic.capitaine_vendu` | quotidien · 2 | `capitaine_vendu` | LE BRASSARD PART EN CAMIONNETTE | Le capitaine est vendu à trois jours de la reprise. Le vestiaire a appris le prix avant le nom du club. |
| `une.generic.capitaine_vestiaire` | echo · 2 | `capitaine_vestiaire` | LE CAPITAINE RESTE, ET LE DIT | Il a refusé le double et il l'a annoncé au vestiaire, pas à la presse. La presse l'a su par le vestiaire. |
| `une.gazette.la_chaise_du_fils` | gazette · 2 | `chaise_fils` | LE FILS A UNE CHAISE À L'UNION | Le fils de Montoya a repris la table du père, et il a ajouté une chaise. Personne ne sait pour qui. |
| `une.gazette.chapitre_brut` | gazette · 3 | `chapitre_brut` | LE CHAPITRE HUIT, VERSION BRUTE | La Gazette a la version d'avant l'avocat. Elle en publie neuf lignes, et garde le reste au chaud. |
| `une.quotidien.chiffres_agent` | quotidien · 3 | `chiffres_agent` | L'AGENT DONNE SES CHIFFRES | Une agente a publié ses commissions, ligne par ligne, sans qu'on lui demande. « Moi, je compte. » |
| `une.generic.club_dabord` | echo · 1 | `club_dabord` | LE CLUB D'ABORD, DIT-{PG} | Une offre refusée, une saison de plus, et une phrase courte au parking. Au local, on a applaudi. |
| `une.generic.coach_parti` | quotidien · 2 | `coach_parti` | L'ENTRAÎNEUR EST PARTI SEUL | Il a rendu les clés du bureau et le survêtement, plié. Il n'a pas demandé son chèque. |
| `une.generic.compo_donnee` | gazette · 3 | `compo_donnee` | LA COMPO CIRCULAIT AVANT NOUS | Onze noms connus deux heures avant le coup d'envoi. Le Rosé : « 6/20, et encore, pour la ponctualité. » |
| `une.generic.confirme_reste` | echo · 2 | `confirme_reste` | CONFIRMÉ, ET IL RESTE | Le président l'a confirmé un mardi, ce qui ne veut rien dire, et il est encore là en mai, ce qui veut tout dire. |
| `une.echo.conge_pose` | echo · 3 | `conge_pose` | ELLE A POSÉ TROIS JOURS | Josiane a posé trois jours en trente-cinq ans. Le classeur a été rangé avant, dans l'ordre. |
| `une.quotidien.hors_micro` | quotidien · 2 | `dit_hors_micro` | CE QUI S'EST DIT HORS MICRO | Le chroniqueur avait promis de ne rien écrire. Il n'a rien écrit ; il l'a dit à l'antenne. |
| `une.gazette.les_documents` | gazette · 1 | `documents_donnes` | ON NOUS A DONNÉ LES DOCUMENTS | Quatre cents pages, une enveloppe, aucun nom d'expéditeur. « J'ai les documents. » |
| `une.echo.fiche_archives` | echo · 3 | `fiche_archives` | LA FICHE DE 1990 EST AUX ARCHIVES | Le recruteur a versé son carnet au club. Un nom y est souligné deux fois, et ce n'est pas le vôtre. |
| `une.echo.fiche_tiroir` | echo · 3 | `fiche_tiroir` | LA FICHE EST RESTÉE DANS LE TIROIR | Un rapport de recrutement n'est jamais remonté. Le gamin a signé ailleurs, à quatre kilomètres. |
| `une.generic.fils_banc` | quotidien · 3 | `fils_banc` | LE FILS DU PRÉSIDENT SUR LE BANC | Il est entré à la 88e, sous les applaudissements de son père, seul debout dans la tribune d'honneur. |
| `une.generic.fils_case` | quotidien · 2 | `fils_case` | LE FILS PREND LA CASE DU PÈRE | Il n'a jamais joué, comme son père, et il l'a dit lui-même en conférence. C'est déjà ça. |
| `une.gazette.debout` | gazette · 2 | `fils_debout` | LE FILS EST RESTÉ DEBOUT | Quatorze clubs, une table, et une chaise de moins que d'invités. Il a refusé de s'asseoir sur celle-là. |
| `une.echo.le_fils_a_joue` | echo · 2 | `fils_joue` | LE FILS DU BOUCHER A JOUÉ | Vingt minutes, une passe, et le père a distribué de la charcuterie dans la tribune. On a accepté. |
| `une.village.fusion_votee` | echo · 1 | `fusion_votee` | LA FUSION EST VOTÉE | Deux clubs, un maillot, et une assemblée où l'on a compté deux fois. Le trait sur le panneau reste. |
| `une.commission.lettre_envoyee` | quotidien · 1 | `lettre_envoyee` | LA LETTRE EST PARTIE VENDREDI | L'Inspecteur ne juge pas ; elle a posté. Le club a huit semaines et deux colonnes. |
| `une.generic.liste_acceptee` | quotidien · 2 | `liste_acceptee` | LA LISTE PASSE SANS UN MOT | Vingt-six noms, aucune question, et un directeur technique qui a rangé ses chiffres. |
| `une.generic.lu_avant_de_signer` | echo · 3 | `lu_avant_de_signer` | IL A LU AVANT DE SIGNER | Quarante minutes sur la page trois, devant l'agent, qui a regardé sa montre onze fois. |
| `une.echo.mardi_bosse` | echo · 3 | `mardi_bosse` | LE MARDI, IL BOSSE À L'USINE | Un titulaire du National travaille le mardi et s'entraîne le soir. Il l'a dit sans qu'on lui demande. |
| `une.generic.mere_decide` | gazette · 2 | `mere_decide` | LA MÈRE A DÉCIDÉ, ENCORE | Le contrat est signé par le fils et lu par la mère. « Mon fils n'a besoin de personne. » |
| `une.generic.mot_a_la_mere` | echo · 2 | `mot_a_la_mere` | UN MOT À LA MÈRE, PAS À L'AGENT | Le coach a écrit à la mère avant d'appeler l'agent. L'agent l'a appris par la mère. |
| `une.generic.nom_sur_la_porte` | echo · 2 | `nom_sur_la_porte` | LE NOM EST SUR LA PORTE | Une plaque vissée un lundi matin, à sept heures, par le concierge. Elle est droite. |
| `une.gazette.page_barree` | gazette · 2 | `page_barree` | UNE PAGE BARRÉE AU FEUTRE | Le procès-verbal a une page barrée et paraphée. Le paraphe est lisible ; la page, non. |
| `une.generic.paie_attendue` | echo · 1 | `paie_attendue` | LA PAIE DU 5 N'EST PAS TOMBÉE | Onze joueurs devant le distributeur du centre commercial, à dix-neuf heures. Aucun n'a parlé. |
| `une.generic.paie_dite` | quotidien · 2 | `paie_dite` | IL A DIT LE CHIFFRE À VOIX HAUTE | Un président a annoncé le retard au vestiaire avant que le vestiaire le découvre. Ça ne s'était jamais vu. |
| `une.gazette.le_petit_a_un_agent` | gazette · 2 | `prodige_a_fardelli` | LE PETIT A UNE GOURMETTE | Seize ans, un agent, et une page trois. « Mon ami, on parle d'argent ou d'amitié ? » |
| `une.generic.prodige_donne` | echo · 2 | `prodige_donne` | LE PRODIGE EST DONNÉ, PAS VENDU | Aucune indemnité, un accord de principe et une promesse orale. Le club formateur applaudit, jaune. |
| `une.generic.projet_signe` | quotidien · 3 | `projet_signe` | LE PROJET EST SIGNÉ, EN QUATRE PAGES | Trois ans, deux objectifs, une clause de sortie. Le mot « projet » figure onze fois. |
| `une.generic.promis_en_direct` | gazette · 1 | `promis_en_direct` | PROMIS EN DIRECT, DATÉ PAR NOUS | La promesse a été faite à l'antenne, à vingt heures douze. Le mur des promesses a une ligne de plus. |
| `une.generic.replay_refuse` | quotidien · 3 | `replay_refuse` | IL A REFUSÉ DE REGARDER L'IMAGE | On lui a proposé le ralenti ; il a dit qu'il avait vu. Il avait vu. |
| `une.generic.replay_regarde` | quotidien · 3 | `replay_regarde` | IL A REGARDÉ, ET IL A CHANGÉ D'AVIS | Onze secondes de ralenti, et une phrase de moins en conférence. C'est un progrès. |
| `une.quotidien.rien_hors_micro` | quotidien · 3 | `rien_hors_micro` | RIEN, MÊME HORS MICRO | Le chroniqueur a posé sa question deux fois. Deux fois rien, et il l'a écrit. |
| `une.generic.signe_sans_lire` | gazette · 2 | `signe_sans_lire` | SIGNÉ SANS LIRE LA PAGE TROIS | Quatre minutes pour huit pages. La page trois en fait deux à elle seule. |
| `une.generic.stage_lundi` | echo · 2 | `stage_lundi` | LUNDI, HUIT HEURES, IL Y ÉTAIT À SEPT | Le diplôme se passe chez le vieux. « Je ne dirais pas que j'étais un grand ; je dirais que j'étais devant. » |

#### (b) Les vingt-huit du chapitre 13, dont les sept branches « non » des soixante heures

| id | Journal · Prio | Lit | Titre | Sous-titre |
|---|---|---|---|---|
| `une.geant.debout` | quotidien · 1 | `h0_debout` | IL EST RESTÉ DEBOUT À LA TABLE | Quatorze présidents assis, un debout, et la porte au fond. Montoya n'a pas insisté ; il a compté. |
| `une.geant.descendu` | echo · 1 | `h1_descendu` | LE PRÉSIDENT EST DESCENDU AU KOP | Heure six : la bâche disait « NULS ». Il est descendu la lire de près, et il est remonté sans rien dire. |
| `une.geant.efface` | gazette · 2 | `h3_efface` | LE TWEET DE 3 H A ÉTÉ EFFACÉ | Il a duré onze minutes. La Gazette en a une capture ; elle la publie, en petit, page quatre. |
| `une.fonds.fonds_non` | quotidien · 2 | `h4_fonds_non` | LE FONDS A DIT NON, POUR UNE FOIS | Le propriétaire a refusé de signer la Ligue fermée. « Ce n'est pas un club, c'est un actif » — et un actif se revend. |
| `une.geant.ami` | echo · 2 | `h5_ami` | ILS ONT REFUSÉ ENSEMBLE | Deux présidents, deux villes, un seul communiqué. C'est la première ligne d'une amitié ou d'un pacte. |
| `une.geant.la_table` | gazette · 2 | `h5_table` | QUATORZE CHAISES, ONZE OCCUPÉES | Trois présidents ont eu peur de leur virage. Le Rosé leur met 14/20, « pour le courage tardif ». |
| `une.geant.loi_contre` | quotidien · 2 | `h6_loi_contre` | IL A VOTÉ CONTRE LA LOI | Le nom est en bas de la page « contre », seul de sa division. La loi est passée quand même. |
| `une.geant.les_autres` | echo · 1 | `voie_ligue_fermee` | LE STADE EST PLEIN, LE TÉLÉPHONE MUET | Depuis le refus, plus une invitation, plus un appel du continent. Le derby, lui, se joue toujours. |
| `une.village.club_sauve` | echo · 1 | `club_sauve` | LE CLUB EST SAUVÉ, À TROIS FRANCS PRÈS | La tombola, la garantie personnelle et la boîte en fer. Gérard a compté deux fois, à voix haute. |
| `une.village.couleurs` | echo · 1 | `couleurs_menacees` | ON VEUT NOUS CHANGER DE COULEURS | La mairie propose un maillot mi-jaune mi-vert. Au local, on a proposé autre chose. |
| `une.village.fete_promise` | echo · 3 | `fete_promise` | UNE FÊTE PROMISE POUR JUIN | Le président a promis la fête si le club se maintient. Le mur des promesses a noté la date. |
| `une.village.enveloppes` | gazette · 2 | `enveloppes_village` | TROIS CENTS FRANCS, EN LIQUIDE | Le club voisin paie ses joueurs au match. Le district « examine » ; il examine depuis quatre ans. |
| `une.coupe.recette` | echo · 1 | `recette_reglement` | LA RECETTE PAIE DIX ANS DE BUVETTE | Deux mille personnes pour huit cents habitants. Le règlement dit que la moitié part ; la moitié est partie. |
| `une.coupe.derby_heure` | echo · 2 | `derby_heure` | LE DERBY SERA JOUÉ À MIDI | La télévision a demandé midi. Les cars partent à neuf heures, et l'usine ne comprend toujours pas. |
| `une.formation.centre_ferme` | quotidien · 1 | `centre_ferme_police` | LE CENTRE EST FERMÉ PAR LA PRÉFECTURE | Quatre dortoirs, une chaudière, et un rapport de dix pages. Le club a huit jours. |
| `une.formation.ecole_separee` | echo · 2 | `ecole_separee` | L'ÉCOLE ET LE CLUB SE SÉPARENT | Les cours du matin ne sont plus au club. Onze familles ont déménagé pour ça, et restent. |
| `une.commission.emprunt` | quotidien · 2 | `emprunt_juin` | LE CLUB EMPRUNTE JUSQU'EN JUIN | Le banquier rappelle en mars ; Josiane a déjà son numéro. « J'en ai vu passer. » |
| `une.geant.kop_compte` | echo · 2 | `kop_compte` | LA BILLETTERIE EST LA SEULE LIGNE POSITIVE | L'Inspecteur a compté les sièges avant les comptes. Le virage a compris avant le conseil. |
| `une.fonds.plaque_reduite` | echo · 2 | `plaque_reduite` | LA PLAQUE A RÉTRÉCI DE MOITIÉ | Le naming reste, en plus petit, à hauteur d'homme. Personne ne dit encore le nom. |
| `une.fonds.stade_nom_maire` | quotidien · 3 | `stade_nom_maire` | LE STADE PORTE LE NOM DE LA MAIRE | Le ruban a été coupé par elle, devant elle, pour elle. « Le stade, c'est de l'argent public. » |
| `une.geant.president_assume` | quotidien · 2 | `president_assume` | IL ASSUME, ET IL LE DIT SEUL | Aucun communiqué, aucun conseiller, une phrase au parking. Elle tient en douze mots. |
| `une.village.successeur` | echo · 2 | `successeur_cherche` | ON CHERCHE QUELQU'UN POUR APRÈS | Le président cherche un successeur depuis novembre. Trois refus, dont deux polis. |
| `une.geant.mediacrash` | quotidien · 1 | `mediacrash_vente` | LA CHAÎNE NE PAIERA PAS L'ÉCHÉANCE | Les clubs comptaient dessus en août. On note la date, encore une fois. |
| `une.village.tribune_est` | echo · 1 | `tribune_est_fermee` | LA TRIBUNE EST EST FERMÉE | Un rapport, trois poutres, et deux cents abonnés déplacés. La 14B n'est plus accessible. |
| `une.village.trop_plein` | echo · 3 | `trop_plein` | TROP DE MONDE POUR LE STADE | Huit cents places, mille deux cents personnes, et un arbitre qui a attendu vingt minutes. |
| `une.village.venu_du_district` | echo · 3 | `venu_du_district` | IL VIENT DU DISTRICT, ET IL RESTE | Un dirigeant du district a pris le club. « Le district, c'est la base » ; la base a un club de plus. |
| `une.geant.visage_seul` | gazette · 2 | `visage_seul` | UN SEUL VISAGE SUR L'AFFICHE | La campagne d'abonnements ne montre plus de joueur, seulement le président. Le Rosé : 8/20. |
| `une.fonds.titre_promis` | quotidien · 2 | `titre_promis_conseil` | UN TITRE PROMIS AU CONSEIL, PAS AU KOP | La promesse a été faite en salle, en anglais des affaires, à onze personnes. Le mur l'a datée quand même. |

#### (c) Les quarante des quatre postulats de seconde vague (dix chacun)

**`retour_croises`** (le retour après le genou) : `une.retour.premier_pas` (echo · 1) « IL A REMARCHÉ SANS BÉQUILLE » — *Onze semaines, un couloir, une kiné qui compte. »* · `une.retour.deuxieme_genou` (quotidien · 1) « LE SECOND GENOU A LÂCHÉ » — *Le même mois, l'autre jambe. Le Doc n'a rien dit ; il a fermé le carnet.* · `une.retour.infiltration` (gazette · 2) « INFILTRÉ POUR JOUER LE DERBY » — *Une piqûre, un derby, et trois semaines d'arrêt derrière. Le Rosé : 4/20.* · `une.retour.premiere_titularisation` (echo · 1) « TITULAIRE, QUATORZE MOIS APRÈS » — *Le stade s'est levé à l'annonce du nom. Il a joué cinquante-neuf minutes.* · `une.retour.visite_medicale` (quotidien · 2) « LA VISITE MÉDICALE A DURÉ TROIS JOURS » — *Le club acheteur a demandé un second avis, puis un troisième.* · `une.retour.contrat_court` (quotidien · 3) « UN CONTRAT DE SIX MOIS, ET ON VERRA » — *Signé sans prime, avec une clause au rendement. L'agent n'est pas venu.* · `une.retour.rechute` (echo · 2) « RECHUTE À LA VINGTIÈME » — *Il est sorti seul, sans civière, en regardant la tribune Est.* · `une.retour.arret` (quotidien · 1) « IL ARRÊTE, À VINGT-NEUF ANS » — *Trois lignes lues au vestiaire, pas de conférence. Le kiné était là.* · `une.retour.coach_le_veut` (echo · 2) « SON ANCIEN ADJOINT LE RAPPELLE » — *« Je te le dis parce que personne ne te le dira : il y a une place. »* · `une.retour.tete_haute` (echo · 1) « PARTI LA TÊTE HAUTE, ET DEBOUT » — *Il a fait le tour du terrain seul, après tout le monde. Le stade est resté.*

**`binational`** (les deux passeports) : `une.binational.deux_fax` (quotidien · 1) « DEUX FAX POUR LE MÊME GAMIN » — *Onze minutes d'écart, deux fédérations, une mère qui a lu les deux.* · `une.binational.dix_minutes` (quotidien · 1) « DIX MINUTES QUI ENGAGENT UNE VIE » — *Un amical, une entrée à la 80e, et un choix devenu définitif.* · `une.binational.le_passeport` (echo · 2) « LE PASSEPORT DE SA MÈRE » — *Elle l'a gardé dans une enveloppe pendant vingt ans, avec les photos.* · `une.binational.hymne` (gazette · 2) « IL N'A PAS CHANTÉ, ET ALORS ? » — *Le Rosé note la bouche fermée 12/20 et le match 16/20.* · `une.binational.appel_du_pays` (echo · 1) « LE PAYS DE SES PARENTS A APPELÉ » — *Un coup de fil un dimanche soir, en deux langues, et une nuit blanche.* · `une.binational.choix_fait` (quotidien · 1) « IL A CHOISI, ET IL EXPLIQUE » — *Sept phrases en zone mixte, aucune préparée. Vence n'a pas coupé.* · `une.binational.siffle_chez_lui` (echo · 2) « SIFFLÉ DANS LA VILLE OÙ IL EST NÉ » — *Trois cents personnes, un panneau, et un accueil qu'on n'oublie pas.* · `une.binational.la_cousine` (echo · 3) « SA COUSINE JOUE POUR L'AUTRE » — *Même famille, deux maillots, un repas de Noël prudent.* · `une.binational.regret` (gazette · 3) « IL DIT QU'IL Y REPENSE » — *Huit ans après, à l'antenne, entre deux rubriques. Le Rosé : « enfin quelqu'un d'honnête. »* · `une.binational.les_deux` (quotidien · 3) « DEUX PAYS, UN SEUL BRASSARD » — *Il porte le brassard d'un et la langue de l'autre. Ça suffit à tout le monde, sauf à lui.*

**`banc_dore`** (le désert, le contrat, le banc) : `une.dore.le_contrat` (quotidien · 1) « TROIS ANS, ET RIEN À RÉSILIER » — *Le contrat n'a pas de clause de sortie. L'agent en est très fier.* · `une.dore.le_loft` (gazette · 1) « AU LOFT, AVEC LES JEUNES » — *Un vestiaire séparé, un horaire décalé, et un salaire entier. Le Rosé : 3/20.* · `une.dore.le_titre` (echo · 2) « CHAMPION DU DÉSERT, DEVANT MILLE PERSONNES » — *Le trophée a été remis à minuit, à cause de la chaleur.* · `une.dore.la_climatisation` (echo · 3) « VINGT DEGRÉS DEDANS, CINQUANTE DEHORS » — *Le Dôme consomme la moitié de la ville. On n'en parle pas au micro.* · `une.dore.le_coup_de_fil` (quotidien · 2) « UN CLUB DU CONTINENT A APPELÉ » — *Une heure où il était réveillé, pas lui. « Je te le dis parce que personne ne te le dira. »* · `une.dore.le_jeune` (quotidien · 2) « IL A JOUÉ À JEUN, ET IL A MARQUÉ » — *Le club a décalé l'entraînement d'une heure. Personne n'a fait de communiqué.* · `une.dore.la_ligne_dapres` (gazette · 2) « LA LIGNE D'APRÈS, C'EST LUI » — *Le fonds a acheté plus jeune et plus cher. « Ce n'est pas un club, c'est un actif. »* · `une.dore.retour_promis` (echo · 2) « IL AVAIT PROMIS DE RENTRER » — *La promesse est à la craie sur le mur du local. Elle y est encore.* · `une.dore.les_jambes` (quotidien · 3) « LES JAMBES ROUILLENT AU CHAUD » — *Deux ans sans compétition vraie, et un test qui le dit franchement.* · `une.dore.rentre` (echo · 1) « IL EST RENTRÉ, ET IL A SIGNÉ EN D2 » — *Un tiers du salaire, un stade froid, et le premier applaudissement depuis trois ans.*

**`capitaine_dechu`** (le brassard repris) : `une.dechu.la_petition` (gazette · 1) « QUATORZE SIGNATURES CONTRE LE CAPITAINE » — *Une feuille passée dans le vestiaire un mardi. Deux ont signé deux fois.* · `une.dechu.brassard_repris` (quotidien · 1) « LE BRASSARD REPRIS DEVANT TOUT LE MONDE » — *À l'échauffement, sans un mot, et il l'a tendu lui-même.* · `une.dechu.le_discours` (echo · 2) « IL A PARLÉ SIX MINUTES, PERSONNE N'A BOUGÉ » — *Le vestiaire l'a écouté et n'a rien répondu. C'est la pire réponse.* · `une.dechu.le_banc` (quotidien · 2) « L'ANCIEN CAPITAINE SUR LE BANC » — *Il s'est assis au bout, à côté du troisième gardien, qui lui a fait de la place.* · `une.dechu.le_nouveau` (echo · 2) « LE NOUVEAU BRASSARD A VINGT-DEUX ANS » — *Il l'a mis à l'envers au premier match, et personne ne l'a corrigé.* · `une.dechu.la_reponse` (gazette · 2) « IL RÉPOND, ET C'EST TROP LONG » — *Quatre minutes en zone mixte. Le Rosé : « on aurait préféré quatre secondes. »* · `une.dechu.les_anciens` (echo · 3) « TROIS ANCIENS ONT REFUSÉ DE SIGNER » — *Ils n'ont rien dit publiquement. Ils se sont assis à côté de lui au repas.* · `une.dechu.le_retour` (quotidien · 2) « LE BRASSARD LUI REVIENT EN MARS » — *Blessure du nouveau, ou décision du coach ; les deux versions circulent.* · `une.dechu.la_sortie` (echo · 1) « IL PART SANS JUBILÉ, ET IL LE DEMANDE » — *Il a écrit au président pour qu'on ne fasse rien. On n'a rien fait.* · `une.dechu.la_haie` (echo · 1) « LE VESTIAIRE LUI A FAIT UNE HAIE » — *Les mêmes quatorze. Il est passé au milieu sans regarder personne, et il a serré la dernière main.*

#### (d) Seize manchettes d'état, pour les créneaux restants

`une.generic.deux_saisons` (echo · 2, `stats.saisons >= 2 && bilan.tenu`) « DEUX ANS, ET ON COMMENCE À DIRE LE NOM » · `une.generic.trois_clubs` (quotidien · 3, `stats.clubs >= 3`) « TROISIÈME CLUB, MÊME VALISE » · `une.generic.jamais_vire` (quotidien · 2, `stats.vires == 0 && stats.saisons >= 4`) « QUATRE SAISONS, ZÉRO LIMOGEAGE » · `une.generic.premier_titre` (echo · 1, `flag('titre')`) « LE PREMIER, ET ON S'EN SOUVIENDRA » · `une.generic.descente` (quotidien · 1, `bilan.descente`) « LA DESCENTE, ET LE SILENCE DU CAR » · `une.generic.montee_a_larrache` (echo · 1, `bilan.montee && gauges.caisse < 30`) « MONTÉS SANS UN SOU, ET AVEC UN RADIATEUR » · `une.generic.derby_gagne` (echo · 1, `flag('derby_gagne')`) « LE DERBY, ET LA VILLE EST INVIVABLE » · `une.generic.derby_perdu` (gazette · 2, `flag('derby_perdu')`) « LE DERBY, ET LA VILLE EST MUETTE » · `une.generic.vestiaire_froid` (quotidien · 2, `gauges.vestiaire < 25`) « LE VESTIAIRE NE PARLE PLUS » · `une.generic.caisse_pleine` (gazette · 3, `gauges.caisse >= 85`) « DE L'ARGENT, ET AUCUNE IDÉE » · `une.generic.direction_pleine` (gazette · 2, `gauges.direction >= 85`) « LA CRÉATURE DU PRÉSIDENT » · `une.generic.tribune_pleine` (echo · 2, `gauges.tribunes >= 85`) « ILS L'AIMENT TROP, C'EST MAUVAIS SIGNE » · `une.generic.trois_promesses` (gazette · 1, `parole <= -3`) « TROIS PROMESSES, TROIS DATES, ZÉRO » · `une.generic.enfant_ne` (echo · 3, `flag('sacha_nee')`) « UNE NAISSANCE, UN SOIR DE MATCH » · `une.generic.enterrement` (echo · 1, une trace `<id>_mort` de la saison) « ON A ENTERRÉ QUELQU'UN QUI COMPTAIT » · `une.generic.derniere_saison` (quotidien · 1, `age >= 68`) « LA DERNIÈRE, ET IL NE L'A PAS DIT »

**Ce que cette passe ferme** : les trente-huit traces orphelines du chapitre 02, vingt-huit du chapitre 13 (dont les sept branches « non » des soixante heures, qui étaient le trou le plus visible de la bible : refuser la Ligue fermée se paie désormais aussi longtemps que la signer), et les quatre postulats de seconde vague, qui avaient un script et pas une Une. Avec les cent six de la première livraison, le chapitre 20 en écrit **deux cent vingt-huit**. Les `une.*` encore citées et non écrites doivent être **retirées** des lignes « Lu plus tard par » par le chantier données (charte § 5.3 g) et remplacées par `une.generic.*`, qui est le secours déclaré pour tous les rôles.

---

### 2.5 Harmonisation des manchettes des chapitres 10 à 14

Ce chapitre a relu les ≈ 400 manchettes livrées par les chapitres de scénarios contre la voix de chaque journal (§ 1) et contre la charte. Il ne les réécrit pas ; il consigne ici ce que le chantier données appliquera à l'import.

1. **La voix.** Une manchette `gazette` porte une note du Rosé ou une source de lieu (« au parking », « dit-on ») ; une `echo` porte un prénom d'ici ou un objet ; une `quotidien` porte une fonction avant un nom. Les rares lignes qui ne le font pas (`une.pepite.rival`, `une.coach.direct`, `une.sylvanie.deux_discours`) reçoivent un mot de plus dans le sous-titre, pas dans le titre.
2. **Les longueurs.** Le test BRÉHAUT-LEMOINE / SAINT-ÉTOILE / AS SAINT-ÉTOILE s'applique ; les titres qui rendent plus de 44 caractères avec `{CLUB}` sont réécrits avec `{VILLE}` (plus court de trois signes) par le chantier données, jamais raccourcis dans leur sens.
3. **Les doublons de sens.** `une.promu.gigi_staff` (ch. 11, trace `gigi_a_parle`) et `une.promu.staff` (yaml, trace `gigi_staff`) coexistent : la première est la promesse, la seconde le fait ; on garde les deux, priorité 2 puis 3. `une.promu.adjoint_parti` (ch. 11) et `une.generic.dauphin_ailleurs` (§ 2.2) ne titrent pas le même rôle. `une.generic.sl_bus_descendu` (ch. 14) et `une.generic.gants_eleve` lisent la même trace dans deux rôles.
4. **Les ids.** Les manchettes de rôle du chapitre 14 (`une.generic.sl_*`) respectent la convention `une.generic.<mot>` avec un filtre `roles:` ; le préfixe `sl_` reste. Le chapitre 10 utilise `une.fin.*` pour le postulat `fin_de_contrat` : ce chapitre nomme ses Unes de fin de carrière `une.generic.fin_*` pour éviter la collision.
5. **`{PAYS}`.** Le chapitre 14 demande un placeholder `{PAYS}` (« LES COBALTS » / « LA SYLVANIE ») ; ce chapitre l'utilise aussi dans deux Nouvelles (§ 3) et le porte en question § 7.
6. **Le drame.** Aucune manchette de chapitre ne titre un mort le jour même ; `une.generic.sl_radio` (ch. 14) est marquée « non applicable si drame mortel » : conforme.
7. **La fraîcheur.** Toutes les manchettes de trace des chapitres lisent `journal_has()` ; les manchettes d'état (`relation`, `gauges`, `season`) tiennent les S2+. Ce chapitre ajoute vingt-sept manchettes d'état génériques (§ 2.1) pour que les S5+ de tous les rôles aient une bande 2 non vide.

---

## 3. La chronologie du monde, 1990 → 2050 (quatre-vingt-sept Nouvelles datées)

**Ce que c'est.** Une Nouvelle datée est une carte à un bouton, servie à un créneau réservé (`director.nouvelle_slots`, trois par saison), portant `year:` ; le moteur la tire dans la liste des datées éligibles quand `s.year ∈ [year, year+1]`, et une datée non servie dans ses deux ans est perdue (spec § 1.5). Elle ne se joue pas : elle se constate. Elle dit l'époque **par ses mœurs** et elle **arme** quelque chose — un drapeau de monde (`set: [monde_…]`), une variable qui double le poids d'une entrée de réservoir (`vars.x = 2`, lu par `poids_if` de l'entrée), ou rien du tout quand elle n'est là que pour dater le décor.

**Conventions de ce chapitre.** Les libellés des Nouvelles restent à l'infinitif comme les cartes existantes (« Encaisser », « Prendre acte », « Soupirer ») : ce sont des constats, pas des choix, et la règle de la première personne (charte § 6.1 n° 4) ne s'y applique pas — c'est la seule exception, elle est déjà dans `content/`. Les deux sorties portent des effets identiques ; l'effet est petit (un `+` ou un `−`, jamais `+++`) ; `once: true` toujours. **Rôles** vide = tous. Quand l'effet touche une jauge qu'un rôle n'a pas au même endroit, on écrit le nom canonique (`caisse`, `direction`, `tribunes`, `vestiaire`) et le rôle traduit.

**Les voix et le temps.** Un locuteur ne parle que dans sa fenêtre (charte § 2.1 n° 4). Josiane parle du club jusqu'en 2008, de la Fédération jusqu'en 2016, de la FédéMonde jusqu'en 2022 ; ensuite c'est **la petite Josiane** (sa nièce). Après 2035, les Nouvelles sont dites par les « suivants » — la petite Josiane, le stagiaire de l'Écho, le fils de Corven, le fils de Montoya, Sacha — ou par le speaker du stade ; les chapitres 01 et 02 fixent qui. Aucune Nouvelle ne transpose un fait réel : ce sont des tendances, avec nos villes et nos années.

**Une harmonisation.** La spec § 4.5 attribue la Coupe Continentale 1993 à Montbéliac ; la charte § 1.3 l'attribue à Marsange (Montbéliac est un club de district, il ne joue pas de coupe continentale). La charte gagne : la Nouvelle 1993 dit Marsange, la réplique de Gégé et la phrase « la fête dure trois jours, l'audit trois ans » sont conservées mot pour mot.

### 3.1 Les présidents bâtisseurs (1990-2000, vingt-deux Nouvelles)

**`co.nv.1990_droits_tele`** — *Les droits triplent* · 1990 · tous · **arme** : `set: [monde_droits_1990]` ; `vars.sponsor = 2`
**JOSIANE** *(secrétaire — elle plie le journal sur le radiateur)* « Les droits de télévision ont triplé cette nuit, paraît-il. J'en ai vu passer, des pluies ; il en tombera bien une goutte ici. »
**OK** « Encaisser » / « Se frotter les mains » — caisse + — *La goutte met deux saisons à tomber. Elle tombe sur le toit du parking.*

**`co.nv.1990_tirs_au_but`** — *La Coupe d'été s'arrête au point de penalty* · 1990 · tous · **arme** : `set: [monde_cobalts_1990]`
**MASSENET** *(chroniqueur — la télé du bar, le son coupé)* « Le capitaine des Cobalts a tiré le cinquième et le pays s'est assis d'un coup. Juste une question, hors micro : vous étiez où ? »
**OK** « Encaisser » / « Répondre en silence » — tribunes + — *Tout le monde se souvient d'où il était. Personne ne se souvient du gardien d'en face.*

**`co.nv.1991_tele_stade`** — *Une chaîne rachète un club* · 1991 · tous · **arme** : `set: [monde_tele_stade]`
**VAUBOURG** *(président — il repose le combiné sans avoir parlé)* « Une chaîne de télévision vient d'acheter le club de la capitale, avec le stade et les joueurs dedans. J'ai pas le temps, j'ai un empire ; eux, ils ont une antenne. »
**OK** « Prendre acte » / « Encaisser » — direction − — *Le dimanche soir devient une case de grille. Personne n'a demandé au dimanche.*

**`co.nv.1991_controle`** — *Le premier contrôle inopiné* · 1991 · tous · **arme** : `vars.pharmacie = 2`
**SABATIER** *(médecin du club — il ferme la mallette d'un coup sec)* « Deux messieurs sont venus sans prévenir et sont repartis avec des flacons numérotés. Ça reste entre la table et moi, mais la table a une porte maintenant. »
**OK** « Encaisser » / « Noter » — vestiaire − — *La mallette change de placard. Le placard change de clé.*

**`co.nv.1992_buvette_portclair`** — *Deux cents merguez* · 1992 · tous · **arme** : `vars.tribune_alerte = 3`
**AUBERT** *(maire — communiqué à la main, ton plat)* « La buvette du club de Portclair a brûlé la veille d'une demi-finale : personne dedans, deux cents merguez. Le stade, c'est de l'argent public, et le fil électrique aussi. »
**OK** « Prendre acte » / « Encaisser » — caisse − — *Le préfet écrit à tous les clubs. Ici, on regarde le plafond de la buvette pour la première fois depuis 1974.*

**`co.nv.1992_depot_bilan`** — *Vaucastel dépose le bilan* · 1992 · tous · **arme** : `set: [monde_vaucastel]`
**JOSIANE** *(secrétaire — le fax n'a pas fini de sortir)* « Vaucastel a déposé le bilan ce matin, quatre-vingts ans de club dans une chemise cartonnée. J'en ai vu passer, mais jamais avec le trésorier qui pleure au téléphone. »
**OK** « Encaisser » / « Se taire » — caisse − — *Ils repartiront du District. Ils remonteront en 2009 ; personne ne le sait encore.*

**`co.nv.1993_continentale`** — *La fête dure trois jours* · 1993 · tous · **arme** : `set: [monde_continentale_1993]`
**GÉGÉ** *(capo — écharpe d'une autre couleur, pour une fois)* « Marsange a gagné la Coupe Continentale avec un budget de deuxième division, et le port a chanté jusqu'au mardi. La fête dure trois jours ; l'audit, trois ans. »
**OK** « Encaisser » / « Lever son verre » — tribunes + — *Trois ans plus tard, un inspecteur compte les factures de la fête. Il en trouve une de mille sept cents couverts.*

**`co.nv.1993_bons_essence`** — *Le gardien payé en bons d'essence* · 1993 · tous · **arme** : `vars.enveloppe = 2`
**MASSENET** *(chroniqueur — carnet ouvert, stylo capuchonné)* « Un club de D2 payait son gardien en bons d'essence et en jambons, sur trois saisons. La Fédération « examine » ; juste une question, hors micro : elle examine quoi ? »
**OK** « Prendre acte » / « Encaisser » — direction − — *Le gardien, lui, a fait quatre-vingt mille kilomètres. Il les a tous faits pour venir s'entraîner.*

**`co.nv.1998_sans_mondial`** — *L'été sans les Cobalts* · 1994 · tous · **arme** : `set: [monde_sans_mondial]`
**BERTHOMIER** *(président de la Fédération — il lit un papier qu'il n'a pas écrit)* « Les Cobalts regarderont le Mondial à la télévision, comme tout le monde, avec le son. On verra ça après le Congrès ; le Congrès, c'est dans onze mois. »
**OK** « Encaisser » / « Prendre acte » — direction − — *La sélection joue un match amical un mardi de juin. Il y a quatre mille personnes et deux caméras.*

**`co.nv.1994_dimanche_soir`** — *Le match du dimanche soir* · 1994 · tous · **arme** : `set: [monde_dimanche_soir]`
**VAUBOURG** *(président — la grille des horaires sur le bureau)* « Ils veulent un match le dimanche à vingt heures trente, et ils paient pour l'avoir. J'ai pas le temps, j'ai un empire ; l'empire ferme à vingt-deux heures quinze. »
**OK** « Encaisser » / « Regarder la grille » — tribunes − — *Les cars de supporters partent à seize heures et rentrent à deux. Le lundi, l'usine ne comprend pas.*

**`co.nv.1993_arret_vaneste`** — *L'arrêt Vaneste* · 1993 · tous · **arme** : `set: [monde_libre_1993]`
**FARDELLI** *(agent — il agite trois feuillets agrafés)* « Un joueur a gagné son procès : en fin de contrat, il part où il veut, et gratis. Mon ami, on parle d'argent ou d'amitié ? On parle des deux, maintenant. »
**OK** « Prendre acte » / « Encaisser » — direction − — *Les présidents relisent tous leurs contrats en une nuit. Les agents aussi, mais en riant.*

**`co.nv.1997_quotas`** — *Les quotas tombent* · 1995 · tous · **arme** : `set: [monde_quotas]`
**VUKIĆ** *(adjoint — il pose une carte du continent sur la table)* « On peut aligner onze étrangers si on veut, il n'y a plus de compte à faire. Je te le dis parce que personne ne te le dira : les onze coûteront plus cher que les vingt-deux d'avant. »
**OK** « Encaisser » / « Prendre la carte » — force +1 — *Le recruteur de Valdorne achète un atlas. Il l'annote au crayon, comme un cahier.*

**`co.nv.1996_dix_huit`** — *Vingt clubs, puis dix-huit* · 1996 · tous · **arme** : — (décor ; `set: [monde_dix_huit]` lu par le ch. 15 : la réforme des formats)
**BERTHOMIER** *(président de la Fédération — il compte sur ses doigts, deux fois)* « Le championnat passera de vingt clubs à dix-huit, ce qui fait quatre matchs de moins et deux clubs de trop. On verra ça après le Congrès, où les deux clubs votent. »
**OK** « Encaisser » / « Compter aussi » — direction − — *La réforme est votée par vingt clubs dont deux ne seront plus là pour l'appliquer.*

**`co.nv.1996_faux_cousin`** — *Le faux cousin* · 1996 · tous · **arme** : `vars.cousin = 3`
**FARDELLI** *(agent — costume neuf, gourmette ancienne)* « Un garçon s'est présenté partout comme le cousin d'un international et a signé quatre contrats en trois mois. Mon ami, on parle d'argent ou d'amitié ? Lui, il parlait famille. »
**OK** « Encaisser » / « Rire jaune » — caisse − — *Le vrai cousin apprend la nouvelle par le journal. Il n'a jamais eu de cousin.*

**`co.nv.1997_droits_doublent`** — *Les droits doublent encore* · 1997 · tous · **arme** : `vars.sponsor = 2` ; `set: [monde_droits_1997]`
**JOSIANE** *(secrétaire — calculette, deux piles de courrier)* « Les droits ont encore doublé, et la part des petits clubs a baissé de trois lignes dans le tableau. J'en ai vu passer, des tableaux ; celui-là, je le garde. »
**OK** « Encaisser » / « Garder le tableau » — caisse + — *La part augmente en écus et diminue en pourcentage. Les deux sont vrais ; on titre le premier.*

**`co.nv.1996_grand_stade`** — *Le Grand Stade* · 1997 · tous · **arme** : `vars.tribune_alerte = 2`
**AUBERT** *(maire — maquette sous plexiglas, ruban rouge)* « La capitale ouvre un stade de quatre-vingts mille places avec des sièges qui se rabattent tout seuls. Le stade, c'est de l'argent public ; le vôtre aussi, et il a des poutres. »
**OK** « Prendre acte » / « Regarder la maquette » — tribunes − — *On visite le Grand Stade en autocar. On rentre et on regarde la tribune Nord autrement.*

**`co.nv.2002_cobalts`** — *L'année où tout le monde aimait le football* · 1998 · tous · **arme** : `set: [monde_titre_2002]`
**GÉGÉ** *(capo — voix cassée, écharpe bleu cobalt)* « Les Cobalts sont champions du monde, à six mille kilomètres et la ville n'a pas dormi de la semaine. La tribune n'oublie rien, et surtout pas une nuit pareille. »
**OK** « Encaisser » / « Chanter encore » — tribunes ++ — *Trois mille licenciés de plus en septembre. Deux mille sont partis en janvier ; mille sont restés vingt ans.*

**`co.nv.1998_libre`** — *Le premier parti pour rien* · 1998 · tous · **arme** : `set: [monde_premier_libre]`
**FARDELLI** *(agent — il tapote une enveloppe kraft vide)* « Un titulaire de D1 est parti libre, et son club n'a pas touché un franc, seulement une lettre. Mon ami, on parle d'argent ou d'amitié ? Là, on ne parle de rien : il n'y a rien. »
**OK** « Encaisser » / « Ranger l'enveloppe » — direction − — *Le président fait afficher les dates de fin de contrat au mur du bureau. Elles y resteront dix ans.*

**`co.nv.1999_fonds`** — *Un fonds lointain rachète un club* · 1999 · tous · **arme** : `set: [monde_fonds]`
**ILYAS** *(fonds Almadis — il repose une tasse minuscule)* « Un fonds a acheté un club de première division en une nuit, avec le centre de formation et les dettes. Ce n'est pas un club, c'est un actif ; les actifs se réparent plus vite. »
**OK** « Prendre acte » / « Encaisser » — direction − — *Les autres présidents appellent le vendeur pour savoir le prix. Aucun ne le dit.*

**`co.nv.1999_but_en_or`** — *Le but en or* · 1999 · tous · **arme** : — (décor ; `set: [monde_but_en_or]` lu par le ch. 14 : le Grand Match du tournoi)
**VECCHIO** *(gardien — il tient ses gants à bout de bras)* « On a inventé un but qui arrête le match tout de suite, comme une gifle, et c'est le gardien qui reste seul dessus. J'en ai vu d'autres, mais celle-là je l'ai vue de dos. »
**OK** « Encaisser » / « Regarder les gants » — vestiaire − — *La règle disparaîtra en cinq ans. Le gardien qui l'a prise, non.*

**`co.nv.2000_fax_1900`** — *Le fax imprime 1900* · 2000 · tous · **arme** : — (absurde ; `vars.fax = 2` : poids ×2 des intrigues de mercato à échéance)
**JOSIANE** *(secrétaire — elle tient un rouleau de papier thermique)* « Le fax date tous les contrats de janvier au premier janvier mille neuf cents, sans exception. J'en ai vu passer, mais jamais un club rétrogradé au siècle dernier. »
**OK** « Encaisser » / « Redater à la main » — direction − — *Elle redate quarante-deux feuilles au stylo bille. La Fédération les accepte toutes.*

**`co.nv.2000_ecus_annonce`** — *Les contrats en écus dans deux ans* · 2000 · tous · **arme** : — (annonce ; la bascule est en 2002)
**VAUBOURG** *(président — deux calculettes, une dans chaque main)* « Dans deux ans, tout se signera en écus, et ce qui vaut un million en vaudra cent cinquante mille. J'ai pas le temps, j'ai un empire ; l'empire va changer d'unité. »
**OK** « Prendre acte » / « Recompter » — caisse − — *Les joueurs recomptent leur salaire dans les deux monnaies pendant six ans. Ils y perdent à chaque fois.*

### 3.2 L'argent arrive (2001-2009, douze Nouvelles)

**`co.nv.2001_licence_agents`** — *Les agents ont une licence* · 2001 · tous · **arme** : `set: [monde_licence_agents]`
**SOLVANG** *(agente — dossier à onglets, ongles courts)* « La Fédération délivre des licences d'agent depuis ce matin, avec un examen et un numéro. Mon client décide, moi je compte ; à partir d'aujourd'hui, je compte aussi les numéros. »
**OK** « Encaisser » / « Prendre note » — direction + — *Onze agents passent l'examen. Quatre le réussissent. Les sept autres travaillent quand même.*

**`co.nv.2002_ecus`** — *Le premier salaire en écus* · 2002 · tous · **arme** : `set: [monde_ecus]`
**JOSIANE** *(secrétaire — trois fiches de paie étalées)* « Les salaires sont passés en écus ce mois-ci, et personne ne sait plus s'il gagne beaucoup. J'en ai vu passer, des monnaies ; celle-là, tout le monde la divise à voix haute. »
**OK** « Encaisser » / « Recompter trois fois » — caisse − — *La buvette arrondit à l'écu supérieur. Personne ne s'en aperçoit avant Noël.*

**`co.nv.2002_aubert_ministre`** — *La maire devient ministre* · 2002 · tous · **arme** : `set: [aubert_ministre]` (trace transversale n° 40 ; lue par 13, 14, 15, 30)
**AUBERT** *(ministre des Sports — même tailleur, autre bureau)* « Je m'occupe du sport pour tout le pays à partir de lundi, stades compris. Le stade, c'est de l'argent public ; il y en a maintenant deux tiroirs, et j'ai les deux clés. »
**OK** « Prendre acte » / « Encaisser » — direction + — *Le club reçoit une lettre à en-tête neuf. Elle dit exactement ce que disait l'ancienne.*

**`co.nv.2003_mediacrash`** — *Les droits changent de main* · 2003 · tous · **arme** : `set: [monde_mediacrash]`
**VAUBOURG** *(président de la Ligue — enveloppe scellée sur la table)* « Une chaîne inconnue a mis deux fois le prix et a tout emporté, poules comprises. J'ai pas le temps, j'ai un empire ; j'ai quand même pris le temps de lire leur bilan. »
**OK** « Encaisser » / « Lire le bilan aussi » — caisse + — *L'argent arrive en août, entier. On note la date ; on la regrettera en 2006.*

**`co.nv.2004_fusion_villages`** — *Deux villages, un maillot* · 2004 · tous · **arme** : `vars.fusion = 2`
**ROUX** *(président de district — registre ouvert, doigt sur la ligne)* « Loubières et Montbéliac ont fusionné en une seule société, avec un maillot mi-jaune mi-vert. Le district, c'est la base ; ce soir, la base a deux buvettes et un seul comptable. »
**OK** « Prendre acte » / « Encaisser » — tribunes − — *Trois cents licenciés au total, deux clubs de supporters, aucun qui se parle. Le maillot, lui, se vend bien.*

**`co.nv.2005_buvette_anciens`** — *La buvette des anciens rouvre* · 2005 · tous · **arme** : `set: [monde_buvette_anciens]`
**GÉRARD** *(bénévole — tablier repassé, boîte en fer neuve)* « J'ai rouvert la buvette des anciens le dimanche matin, avec les verres du placard et rien d'autre. Ici, on payait en bières ; maintenant on paie en écus et on rend la monnaie. »
**OK** « Encaisser » / « Payer une tournée » — tribunes + — *La caisse est sur la table, ouverte, toute la journée. Personne ne la regarde ; tout le monde la voit.*

**`co.nv.2006_mediacrash_defaut`** — *La deuxième échéance ne tombe pas* · 2006 · tous · **arme** : `set: [monde_defaut_droits]`
**VIALAT** *(Inspecteur de la Commission des comptes — deux colonnes, un trait)* « Le diffuseur n'a pas versé la deuxième échéance et vingt clubs ont bâti leur budget dessus. Je ne juge pas, je compte ; à cette heure, je compte à zéro. »
**OK** « Encaisser » / « Rouvrir le budget » — caisse −− — *Six clubs vendent un joueur en janvier. Deux vendent leur centre de formation.*

**`co.nv.2007_flux`** — *Le Flux* · 2007 · tous · **arme** : `set: [monde_flux]`
**LÉA** *(journaliste — écran retourné vers toi)* « Il y a un endroit où tout le monde écrit ce qu'il pense, à toute heure, sous son vrai nom ou pas. Vous confirmez ? Parce que là, trois cents personnes confirment à votre place. »
**OK** « Prendre acte » / « Encaisser » — tribunes − — *Le président ouvre un compte le soir même. Il écrit son premier message à trois heures du matin.*

**`co.nv.2007_droits_reviennent`** — *Les droits reviennent* · 2007 · tous · **arme** : `vars.sponsor = 2`
**OZANNE** *(patron de Télé-Stade — deux mots, puis il part)* « Nous reprenons le championnat à partir d'août, au même prix qu'il y a quatre ans. L'audience a toujours raison ; cette fois, elle a aussi une calculette. »
**OK** « Encaisser » / « Signer » — caisse + — *Le championnat retrouve son dimanche soir. Il ne retrouve pas ses deux saisons perdues.*

**`co.nv.2008_algorithme`** — *Le modèle qui note tout* · 2008 · tous · **arme** : `set: [monde_algorithme]`
**BARBIER** *(recruteur — doudoune, thermos, feuille imprimée)* « Lyonnet a embauché trois garçons qui notent les joueurs avec des colonnes, sans aller au stade. Je l'ai vu jouer sous la pluie ; leur tableau, lui, n'a jamais été mouillé. »
**OK** « Encaisser » / « Regarder la feuille » — force +1 — *Le tableau a raison deux fois sur trois. La troisième fois, c'est Barbier.*

**`co.nv.2008_mirevaux`** — *La première section féminine professionnelle* · 2008 · tous · **arme** : `set: [monde_feminines]`
**BRISSAC** *(directrice technique nationale — deux feuilles, un stylo rouge)* « Mirevaux a professionnalisé sa section féminine : douze contrats, un vestiaire, un budget de buvette. Les chiffres sont têtus, les joueuses aussi ; c'est pour ça que ça tiendra. »
**OK** « Prendre acte » / « Encaisser » — tribunes + — *Quatre cents personnes au premier match. Sept cents au deuxième, parce qu'il pleuvait ailleurs.*

**`co.nv.2009_fair_play`** — *On ne dépense plus que ce qu'on gagne* · 2009 · tous · **arme** : `set: [monde_fair_play]`
**VIALAT** *(Inspecteur — règle posée en travers du bilan)* « L'Union a voté une règle simple : un club ne dépense plus que ce qu'il gagne, et le reste est un écart. Je ne juge pas, je compte ; les écarts, je les compte deux fois. »
**OK** « Encaisser » / « Relire la règle » — caisse − — *Les fonds inventent le contrat de sponsor à la maison. L'Inspecteur invente la colonne d'en face.*

### 3.3 L'ère des fonds (2010-2019, treize Nouvelles)

**`co.nv.2010_multi_propriete`** — *Un club frère à l'autre bout du monde* · 2010 · tous · **arme** : `set: [monde_club_frere]`
**ILYAS** *(Almadis — carte du monde à deux punaises)* « Nous avons acheté un deuxième club à huit mille kilomètres du premier, avec les mêmes couleurs. Ce n'est pas un club, c'est un actif ; deux actifs se prêtent des joueurs sans commission. »
**OK** « Prendre acte » / « Encaisser » — direction − — *Un jeune part en prêt un mardi et revient en janvier avec un accent. Il n'a joué que six matchs.*

**`co.nv.2011_qatalyst_capitale`** — *Le fonds prend la capitale* · 2011 · tous · **arme** : `set: [monde_capitale_rachetee]`
**MASSENET** *(consultant — micro ouvert, il croit qu'il est fermé)* « Le club de la capitale a été racheté par un fonds du désert, et le premier virement dépasse le budget de la Ligue. Juste une question, hors micro : on met combien de zéros ? »
**OK** « Encaisser » / « Compter les zéros » — direction − — *Les salaires de la ligue montent de vingt pour cent en deux étés. Les recettes, non.*

**`co.nv.2011_seize_ans`** — *On les vend à seize ans* · 2011 · tous · **arme** : `vars.pepite = 2`
**MÈRE DE MBAKO** *(mère et agente — sac posé sur la table, pas ouvert)* « Trois clubs sont venus voir un garçon de seize ans à l'entraînement du mercredi, avec des contrats prêts. Mon fils n'a besoin de personne ; celui-là a besoin de sa mère, et il ne l'a pas. »
**OK** « Encaisser » / « Fermer la porte » — vestiaire − — *La Fédération écrit une note sur l'âge minimum. Elle arrive en mars, après la signature.*

**`co.nv.2012_naming_partout`** — *Le stade change de nom* · 2012 · tous · **arme** : `vars.naming = 2`
**GÉGÉ** *(capo — il montre un panneau du menton)* « Quatre stades du championnat ont changé de nom cette année, et aucun ne s'appelle comme sa ville. La tribune n'oublie rien ; elle n'apprend pas les nouveaux noms non plus. »
**OK** « Encaisser » / « Dire l'ancien nom » — tribunes − — *Le speaker dit le nouveau nom. Le virage répond l'ancien, plus fort, à chaque annonce.*

**`co.nv.2013_agents_plus_riches`** — *Plus riches que les présidents* · 2013 · tous · **arme** : `set: [monde_agents_riches]`
**FARDELLI** *(agent — montre neuve, sourire ancien)* « Les commissions d'un seul mercato dépassent le budget annuel de deux clubs de D1, et ça se sait. Mon ami, on parle d'argent ou d'amitié ? On ne parle plus que de la première. »
**OK** « Prendre acte » / « Encaisser » — caisse − — *Un président demande à devenir agent. On lui répond qu'il est trop vieux et trop connu.*

**`co.nv.2014_meme`** — *Le mème* · 2014 · tous · **arme** : `set: [monde_meme]`
**VENCE** *(Télé-Stade — téléphone tendu, image figée)* « Une grimace de vingt-quatre images tourne depuis hier avec sept phrases différentes écrites dessus. On est en direct, et vous êtes déjà en boucle depuis quatorze heures. »
**OK** « Encaisser » / « Regarder l'image » — tribunes − — *La grimace dure toute la saison. Le match qu'elle vient d'un partout à la dernière minute ; personne ne s'en souvient.*

**`co.nv.2015_gazette_en_ligne`** — *La Gazette quitte le papier* · 2015 · tous · **arme** : `set: [monde_gazette_en_ligne]`
**LE ROSÉ** *(éditorialiste anonyme — texte seul, pas de visage)* « La Gazette ne s'imprime plus : elle paraît quand il se passe quelque chose, c'est-à-dire tout le temps. On notait les présidents une fois par semaine ; on les notera trois fois par jour. »
**OK** « Prendre acte » / « Encaisser » — direction − — *Le kiosque du stade garde une pile de vieux numéros. Ils se vendent mieux qu'avant.*

**`co.nv.2016_video`** — *On juge les buts au ralenti* · 2016 · tous · **arme** : `set: [monde_video]`
**Reprend la carte existante `co.nouvelle.arbitrage_video` (`content/cards/common/co_nouvelles.yaml`), à qui l'import ajoute `year: 2016`, `once: true` et `set: [monde_video]` ; le texte, les libellés et l'effet `tribunes: "-"` ne changent pas** (charte § 6.1 n° 11).
**MASSENET** *(chroniqueur — texte existant, conservé mot pour mot)* « On va juger les buts au ralenti, avec des caméras. Trois minutes d'attente pour valider un corner. »
**OK** « Prendre acte » / « Noter » — tribunes −, `set: [monde_video]` — *Le virage apprend à chanter pendant l'attente. C'est le seul chant nouveau de la décennie.*

**`co.nv.2016_legruet_part`** — *Le président de toujours s'en va* · 2016 · tous · **arme** : `set: [monde_legruet_parti]`
**DAUZAT** *(secrétaire général — chemise cartonnée refermée)* « Le président de la Fédération part après vingt-huit ans, dont vingt-six gagnés de moins de dix voix. C'est dans le procès-verbal ; il y est deux mille six cent quarante fois. »
**OK** « Encaisser » / « Refermer la chemise » — direction − — *Il emporte une photo et laisse le reste. Le reste tient dans quatre armoires.*

**`co.nv.2017_quarante_huit`** — *Quarante-huit équipes* · 2017 · tous · **arme** : `set: [monde_quarante_huit]`
**BAMBINI** *(FédéMonde — costume bleu, main levée avant le vote)* « Le Mondial passera à quarante-huit équipes, ce qui fera vingt-deux pays de plus à la fête. Le football unit le monde, et mes amis ; mes amis sont désormais quarante-huit. »
**OK** « Prendre acte » / « Encaisser » — direction + — *Six confédérations votent pour. Les joueurs comptent les matchs et ne votent pas.*

**`co.nv.2018_lea_redac`** — *Une question en Une* · 2018 · tous · **arme** : `set: [monde_lea_redac]`
**LÉA** *(rédactrice en chef du Quotidien — épreuve de Une à la main)* « Je dirige le journal depuis ce matin, et la Une de demain se termine par un point d'interrogation. Vous confirmez ? Le journal a mis soixante-douze ans à poser la question. »
**OK** « Encaisser » / « Lire l'épreuve » — direction − — *Quatre présidents appellent avant la parution. Trois pour féliciter, un pour autre chose.*

**`co.nv.2019_ligue_fermee`** — *Quarante-huit heures* · 2019 · tous · **arme** : `set: [monde_ligue_fermee]`
**MONTOYA** *(Castel Montoya — table longue, douze chaises, deux vides)* « Quatorze clubs ont annoncé une ligue entre eux, sans montée ni descente, et l'ont retirée le surlendemain. Quatorze clubs, une table : vous étiez assis ou debout ? »
**OK** « Prendre acte » / « Rester debout » — tribunes − — *Les bâches sortent en deux heures dans quarante stades. Elles restent pliées sous les bars pendant vingt ans, au cas où.*

**`co.nv.2019_prix_du_billet`** — *Le billet du virage* · 2019 · tous · **arme** : `vars.abonnement = 2`
**GÉGÉ** *(capo — trois talons de billets en éventail)* « Le billet du virage a doublé en six ans et la moyenne d'âge de la Nord a pris huit ans. La tribune n'oublie rien ; elle vieillit, mais elle n'oublie rien. »
**OK** « Encaisser » / « Compter les talons » — tribunes − — *Le club crée un tarif jeune en février. Il est plafonné à deux cents places.*

### 3.4 Le grand écart (2020-2029, treize Nouvelles)

**`co.nv.2020_compte_anonyme`** — *Un compte sans visage* · 2020 · tous · **arme** : `set: [monde_compte_anonyme]`
**VENCE** *(directrice de l'info — capture d'écran projetée)* « Un compte sans nom et sans visage a douze mille abonnés et sait ce qui se dit au local avant nous. On est en direct ; lui, il est en avance. »
**OK** « Encaisser » / « Chercher qui c'est » — tribunes − — *On cherche pendant six mois. On trouve une écharpe de profil et rien d'autre.*

**`co.nv.2021_quatre_sponsors`** — *Quatre noms sur un maillot* · 2021 · tous · **arme** : `vars.sponsor = 2`
**DUPUIS** *(boucher, sponsor — maillot déplié sur le comptoir)* « Il y a maintenant quatre noms sur un maillot : la poitrine, la manche, le dos et le short. Le meilleur du cochon, et je pèse mes mots : je veux la manche, elle se voit à la télé. »
**OK** « Encaisser » / « Regarder la manche » — caisse + — *Le maillot rapporte trois fois plus. Il devient illisible de la tribune Est.*

**`co.nv.2022_josiane_retraite`** — *Josiane range son bureau* · 2022 · tous · **arme** : `set: [monde_josiane_retraite]`
**JOSIANE** *(secrétaire — carton à archives, deux stylos dessus)* « Je m'arrête après trente-cinq ans, quatre présidents, deux fédérations et une machine à café que j'ai gagnée en 1994. J'en ai vu passer ; ma nièce en verra d'autres. »
**OK** « Encaisser » / « Porter le carton » — direction − — *Elle laisse les dossiers rangés par année. Ils resteront rangés par année pendant vingt ans.*

**`co.nv.2023_calendrier_plein`** — *Soixante-douze matchs* · 2023 · tous · **arme** : `vars.greve = 2`
**FAUVEL** *(président du syndicat des joueurs — calendrier annoté au feutre)* « Un international jouera soixante-douze matchs cette saison, sans compter les avions. On est un groupe, pas une liste ; là, on est devenus un calendrier. »
**OK** « Encaisser » / « Compter les avions » — vestiaire − — *Le syndicat demande une réunion. On la fixe en juin, pendant le tournoi.*

**`co.nv.2024_kick`** — *Tout passe en flux* · 2024 · tous · **arme** : `set: [monde_kick]`
**OZANNE** *(Télé-Stade — il regarde l'écran, pas toi)* « Les matchs se regardent désormais sur une application, avec les commentaires des gens qui défilent sur le terrain. L'audience a toujours raison ; elle écrit par-dessus le ballon. »
**OK** « Prendre acte » / « Encaisser » — tribunes − — *On peut couper le fil de commentaires. Onze pour cent des gens le coupent.*

**`co.nv.2024_billet_sans_papier`** — *Le carnet d'abonnement disparaît* · 2024 · tous · **arme** : — (décor ; `vars.abonnement = 2`)
**PETITE JOSIANE** *(secrétaire — écran, imprimante débranchée)* « Les abonnements n'ont plus de carnet : c'est un code sur le téléphone, et il change à chaque match. Ma tante en a vu passer ; celui-là, elle ne l'aurait pas plié dans son sac. »
**OK** « Encaisser » / « Imprimer quand même » — tribunes − — *Le club imprime quatre cents carnets pour les anciens. Ils sont tous pris en trois jours.*

**`co.nv.2025_memoires_meneche`** — *Les mémoires* · 2025 · tous · **arme** : `set: [monde_memoires]`
**MASSENET** *(retraité — livre épais, quatrième de couverture vers toi)* « J'ai écrit six cents pages sur trente-cinq ans et j'ai gardé deux histoires pour moi, dont une vous concerne. Juste une question, hors micro : vous voulez le chapitre onze ? »
**OK** « Encaisser » / « Ouvrir au chapitre onze » — direction − — *Le livre se vend quarante mille exemplaires. Le chapitre onze fait quatre pages et ne nomme personne.*

**`co.nv.2026_greve`** — *La grève mondiale des joueurs* · 2026 · tous · **arme** : `set: [monde_greve]`
**FAUVEL** *(syndicat — micro de fortune, parking d'hôtel)* « Les joueurs de trente et un pays ne joueront pas les deux prochaines journées, et personne n'a prévenu les clubs. On est un groupe, pas une liste ; ce week-end, on est un groupe. »
**OK** « Prendre acte » / « Encaisser » — vestiaire +, caisse − — *Deux journées sans football. Les buvettes ouvrent quand même, par habitude.*

**`co.nv.2026_mondial_amateurs`** — *Le Mondial des amateurs* · 2026 · tous · **arme** : `set: [monde_mondial_amateurs]`
**DÉDÉ** *(coach bénévole — survêtement propre, ce qui est rare)* « Pendant la grève, ils ont organisé un tournoi mondial avec des équipes de village, et c'était plein. Bon, on va pas se mentir : c'était mieux, et ça ne durera pas. »
**OK** « Encaisser » / « Regarder jusqu'au bout » — tribunes + — *Un gardien de district passe à la télévision nationale un mardi soir. Il travaille le mercredi.*

**`co.nv.2027_arbitre_machine`** — *L'arbitre essaie une machine* · 2027 · tous · **arme** : `set: [monde_arbitre_machine]`
**COLLINE** *(arbitre, responsable de l'arbitrage — sifflet posé sur la table, pas au cou)* « On teste un système qui décide des hors-jeu tout seul, en huit centièmes de seconde, sans lever la tête. J'ai vu ; lui aussi, et il ne se trompe pas sur les jours de pluie. »
**OK** « Prendre acte » / « Regarder le sifflet » — tribunes − — *La Main de Dieu est désactivée un dimanche de novembre. Personne ne la regrette à voix haute.*

**`co.nv.2028_milliard`** — *Le premier milliard* · 2028 · tous · **arme** : `set: [monde_milliard]`
**SOLVANG** *(agente — un chiffre écrit à la main sur une serviette)* « Un joueur a été transféré pour un milliard d'écus, dont onze pour cent de commission et deux ans de garantie. Mon client décide, moi je compte ; là, j'ai compté deux fois. »
**OK** « Encaisser » / « Relire la serviette » — caisse − — *Le club vendeur construit un centre de formation et une piscine. Il redescend quatre ans plus tard.*

**`co.nv.2028_limite_age`** — *Soixante-quinze ans au Congrès* · 2028 · tous · **arme** : `set: [monde_limite_age]`
**DAUZAT** *(secrétaire général — article surligné, page 41)* « Le Congrès a voté une limite d'âge à soixante-quinze ans pour tous les postes élus, à partir du mandat suivant. C'est dans le procès-verbal ; l'exception aussi, page quarante et un. »
**OK** « Encaisser » / « Lire la page 41 » — direction − — *Quatre dirigeants fêtent leurs soixante-quinze ans la même année. Trois trouvent la page.*

**`co.nv.2020_legruet_mort`** — *On enterre un président* · 2029 · tous · **arme** : `set: [monde_legruet_mort]`
**ROUX** *(président de district — chapeau à la main, dehors)* « On a enterré le président de la Fédération ce matin, avec trois cents districts derrière le corbillard. Le district, c'est la base ; il ne s'est jamais souvenu de mon prénom, et j'y étais. »
**OK** « Encaisser » / « Rester dehors » — direction − — *La Fédération met un drapeau en berne trois jours. Le quatrième, on discute de la succession.*

### 3.5 Les franchises (2030-2039, quatorze Nouvelles)

**`co.nv.2030_mondial_hiver`** — *Un Mondial en décembre* · 2030 · tous · **arme** : `set: [monde_mondial_hiver]`
**ROUVIER** *(kiné — liste de noms, deux surlignés)* « Le Mondial se joue en décembre cette année, en plein championnat, et les clubs rendront les joueurs le lundi. Respire, encore ; eux, ils n'auront pas le temps de souffler avant mars. »
**OK** « Prendre acte » / « Encaisser » — vestiaire − — *Trois clubs perdent leur meilleur joueur en janvier. Aucun ne perd le même.*

**`co.nv.2030_biere_quinze`** — *Quinze écus la bière* · 2030 · tous · **arme** : — (décor ; `vars.abonnement = 2`)
**GÉRARD** *(bénévole — ardoise réécrite trois fois)* « La bière du stade est passée à quinze écus, et celle de la buvette des anciens reste à trois. Ici, on payait en bières ; là-haut, on paie la bière comme un repas. »
**OK** « Encaisser » / « Rester en bas » — tribunes − — *La buvette des anciens ne désemplit pas. Le club envisage de la fermer pour concurrence déloyale.*

**`co.nv.2031_vecchio`** — *Une minute, et une de plus* · 2031 · tous · **arme** : `set: [monde_vecchio_mort]`
**COLLINE** *(arbitre — il regarde sa montre, il ne la remonte pas)* « On a observé une minute de silence pour un gardien qui en avait fait quarante et une, et le stade a tenu deux. J'ai vu ; j'ai ajouté la deuxième au temps additionnel. »
**OK** « Encaisser » / « Compter jusqu'à deux » — vestiaire − — *Les gants sont accrochés au-dessus du couloir. Personne ne les décroche, jamais.*

**`co.nv.2031_radio_ferme`** — *La radio s'arrête un mardi* · 2031 · tous · **arme** : — (décor ; lu par le ch. 20 : la voix des supporters disparaît)
**GÉGÉ** *(capo, très vieux — casque sur la table, micro débranché)* « Radio Tribune s'est arrêtée mardi soir à minuit, sans le dire, au milieu d'un appel d'un auditeur de Corbelin. La tribune n'oublie rien ; l'auditeur, lui, attend encore. »
**OK** « Encaisser » / « Rappeler l'auditeur » — tribunes − — *L'émission de vingt-deux heures est remplacée par de la musique. Les auditeurs écrivent au Flux ; personne ne répond.*

**`co.nv.2032_socios`** — *Trois clubs reprennent leur nom* · 2032 · tous · **arme** : `set: [monde_socios]`
**GÉGÉ** *(capo, élu — badge trop grand, écharpe intacte)* « Trois clubs ont été rachetés par leurs abonnés, à cinquante écus la part, et le stade a repris son ancien nom. La tribune n'oublie rien ; maintenant elle signe aussi les chèques. »
**OK** « Encaisser » / « Prendre une part » — tribunes + — *Le conseil d'administration se réunit au local, le mardi, à dix-neuf heures. Il y a du café et des chaises pliantes.*

**`co.nv.2032_gazette_payante`** — *Dix écus par scandale* · 2032 · tous · **arme** : — (décor ; lu par le ch. 20 : la mise en page de la Gazette)
**LE ROSÉ** *(éditorialiste anonyme — texte seul)* « La Gazette ne vend plus d'abonnements : elle vend l'affaire à l'unité, dix écus, payables avant de lire. On notait les présidents sur vingt ; on facture désormais à la note. »
**OK** « Prendre acte » / « Payer pour voir » — direction − — *Les affaires à dix écus se revendent à deux dans les cours de récréation. Le tirage triple.*

**`co.nv.2033_agence_notation`** — *Les clubs sont notés* · 2033 · tous · **arme** : `set: [monde_notation]`
**VIALAT** *(directrice de l'agence de notation — grille à cinq colonnes)* « La Commission est devenue une agence : chaque club reçoit une note publique, de A à E, tous les six mois. Je ne juge pas, je compte ; c'est la note qui juge, et elle est lue par les banques. »
**OK** « Encaisser » / « Demander la grille » — caisse − — *Deux clubs de D1 sont notés D. Leur assurance double avant le premier match.*

**`co.nv.2034_ecole_a_douze`** — *Le centre de formation prend à douze ans* · 2034 · tous · **arme** : `vars.pepite = 2`
**BRISSAC** *(présidente de Mirevaux — tableau des âges, deux lignes barrées)* « Les centres recrutent à douze ans, avec l'école dans le même bâtiment. Les chiffres sont têtus, les enfants aussi ; on les fait entrer deux ans plus tôt et sortir au même âge. »
**OK** « Prendre acte » / « Barrer une ligne » — vestiaire − — *Sur quarante enfants entrés à douze ans, un signera pro. On le sait ; on recrute quand même.*

**`co.nv.2035_quotidien_offert`** — *Le journal devient gratuit* · 2035 · tous · **arme** : — (décor ; lu par le ch. 20 : la mise en page du Quotidien)
**LÉA** *(rédactrice en chef — le bandeau du sponsor sur l'épreuve)* « Le Quotidien ne se vend plus : il est offert, et le nom du fonds est écrit sous le nôtre, en orange. Vous confirmez ? J'ai confirmé, et j'ai gardé la Une. »
**OK** « Encaisser » / « Lire le bandeau » — direction − — *Le tirage triple en un mois. Les questions en Une passent de trois par semaine à une.*

**`co.nv.2035_stade_partage`** — *Deux clubs, un stade* · 2035 · tous · **arme** : `set: [monde_stade_partage]`
**PETITE JOSIANE** *(secrétaire — planning mural à deux couleurs)* « Deux clubs partagent le même stade à partir d'août, un dimanche sur deux, avec deux jeux de bâches. Ma tante en a vu passer ; elle n'a jamais vu un vestiaire avec deux étiquettes sur la porte. »
**OK** « Encaisser » / « Regarder le planning » — caisse + — *La pelouse tient jusqu'en novembre. Après, elle ne tient plus pour personne.*

**`co.nv.2036_joueur_clone`** — *Le joueur cloné* · 2036 · tous · **arme** : — (absurde, pure blague de journal)
**LE STAGIAIRE DE L'ÉCHO** *(voix sans portrait — journal déplié, doigt sur le titre)* « La Gazette annonce qu'un club a cloné son avant-centre et l'a aligné deux fois en amical, sous deux numéros. Au local, on a demandé lequel des deux payait sa tournée. »
**OK** « Encaisser » / « Chercher le démenti » — tribunes + — *Le démenti paraît quatre jours plus tard, en corps huit. Le mème, lui, dure six ans.*

**`co.nv.2037_onze_contre_modele`** — *Onze contre un modèle* · 2037 · tous · **arme** : `set: [monde_modele]`
**FILS DE CORVEN** *(entraîneur — verre d'eau, pas d'autre chose)* « Un club a joué un amical où la compo et les changements venaient d'un modèle, sans entraîneur sur le banc. Mon père disait qu'il était devant ; le modèle, lui, ne dit rien. »
**OK** « Prendre acte » / « Regarder le banc vide » — direction − — *Ils gagnent trois à zéro. Personne ne sait qui féliciter à la fin, alors on ne félicite personne.*

**`co.nv.2038_kick_rachete`** — *La chaîne est rachetée, elle garde son nom* · 2038 · tous · **arme** : — (décor)
**VENCE** *(directrice de l'info, dernière saison — plateau à moitié démonté)* « Nous appartenons à l'application depuis ce matin, mais nous gardons le nom de la chaîne pour les vieux. On est en direct ; on l'est depuis cinquante-quatre ans, et c'est écrit nulle part. »
**OK** « Encaisser » / « Regarder le plateau » — direction − — *Le générique de 1984 est rediffusé une fois, par erreur. Il fait la meilleure audience du mois.*

**`co.nv.2039_debat_franchises`** — *La loi en débat, dixième année* · 2039 · tous · **arme** : `vars.franchises = 2`
**MALBEC** *(président de la Ligue — deux versions du texte, l'une annotée)* « La loi qui supprime la montée et la descente sera votée l'an prochain, ou dans dix ans. Entre présidents, on se comprend : vingt la veulent, quatre-vingts la craignent. »
**OK** « Prendre acte » / « Lire l'autre version » — direction − — *Les vingt ont les voix. Les quatre-vingts ont les tribunes ; on verra ce qui pèse.*

### 3.6 La fin des montées (2040-2050, treize Nouvelles)

**`co.nv.2040_franchises`** — *L'escalier est fermé* · 2040 · tous · **arme** : `set: [monde_franchises]`
**MALBEC** *(président de la Ligue — stylo posé, texte signé)* « C'est voté : plus de montée ni de descente en première division, les clubs y restent, et les autres restent dehors. Entre présidents, on se comprend ; ce soir, on se comprend un peu trop bien. »
**OK** « Encaisser » / « Regarder la signature » — tribunes −, direction + — *Le championnat garde ses dix-huit clubs pour toujours. La Coupe devient le seul endroit où l'on peut tomber.*

**`co.nv.2040_prix_libre`** — *L'Écho passe au prix libre* · 2040 · tous · **arme** : — (décor ; lu par le ch. 20 : la mise en page de l'Écho)
**LE STAGIAIRE DE L'ÉCHO** *(voix sans portrait — boîte en fer près de la porte)* « On ne met plus de prix sur le journal : il y a une boîte à l'entrée du local et chacun donne ce qu'il veut. Le premier dimanche, la boîte contenait quatre-vingts écus et une pièce de dix francs. »
**OK** « Encaisser » / « Mettre quelque chose » — tribunes + — *La pièce de dix francs reste dans la boîte huit ans. Personne ne la prend, personne ne la rend.*

**`co.nv.2041_national_vrai_foot`** — *En bas, on peut encore tomber* · 2041 · tous · **arme** : `set: [monde_national_vivant]`
**DÉDÉ** *(coach bénévole, très vieux — banc de touche en bois, écharpe roulée)* « Depuis que la première division est fermée, tout le monde regarde la deuxième et le National. Bon, on va pas se mentir : c'est nous qui avons le suspense maintenant. »
**OK** « Encaisser » / « Regarder en bas » — tribunes + — *Une chaîne achète les droits du National. Elle filme les matchs avec deux caméras et un drone.*

**`co.nv.2042_voix_generee`** — *Le commentaire d'un mort* · 2042 · tous · **arme** : `set: [monde_voix_generee]`
**PETITE JOSIANE** *(secrétaire — poste de radio, volume bas)* « Les matchs sont commentés par la voix d'un ancien joueur qui est mort il y a onze ans, et sa famille touche un pourcentage. Ma tante en a vu passer ; elle aurait débranché le poste. »
**OK** « Encaisser » / « Débrancher » — tribunes − — *La voix ne se trompe jamais de nom. C'est à ça qu'on la reconnaît.*

**`co.nv.2043_coupe_suspense`** — *La Coupe, seul endroit où l'on tremble* · 2043 · tous · **arme** : `vars.coupe = 2`
**PAULETTE** *(voix d'archive de 2004, repassée à l'antenne chaque janvier)* « J'étais là en cinquante et un, et on ne gagnait rien du tout ; on venait quand même. Le seul soir où j'ai tremblé, c'était un seizième de Coupe contre bien plus fort que nous. »
**OK** « Encaisser » / « Écouter jusqu'au bout » — tribunes + — *La bande dure vingt-deux secondes. On la repasse tous les ans jusqu'en 2050.*

**`co.nv.2044_vote_soixante_quatre`** — *Soixante-quatre* · 2044 · tous · **arme** : `set: [monde_soixante_quatre]`
**FILS DE MONTOYA** *(président du Castel Montoya — même table, deux chaises de plus)* « Le Mondial passera à soixante-quatre équipes en 2046, ce qui fait cent quatre matchs et six semaines. Mon père disait quatorze clubs, une table ; ils sont soixante-quatre, et la table est un stade. »
**OK** « Prendre acte » / « Compter les chaises » — direction + — *Les qualifications sont supprimées pour trois confédérations. Elles votent pour, à l'unanimité.*

**`co.nv.2045_echo_dimanche`** — *Une fois par semaine* · 2045 · tous · **arme** : — (décor)
**LE STAGIAIRE DE L'ÉCHO** *(voix sans portrait — presse arrêtée, odeur d'encre)* « L'Écho ne paraît plus que le dimanche matin, quatre pages, et il est le dernier journal papier du pays. On garde « Au local » en une et « On nous écrit » en dernière ; le reste tient au milieu. »
**OK** « Encaisser » / « Prendre les quatre pages » — tribunes + — *Le tirage baisse d'un tiers. La boîte à prix libre se remplit deux fois plus.*

**`co.nv.2046_mondial_64`** — *Six semaines* · 2046 · tous · **arme** : `set: [monde_mondial_64]`
**SACHA** *(ton enfant, adulte — badge d'observatrice, carnet)* « Le Mondial commence aujourd'hui avec soixante-quatre pays, cent quatre matchs et onze stades neufs dans trois pays. Tu m'as promis qu'on le regarderait ensemble ; c'est dans six semaines, la finale. »
**OK** « Encaisser » / « Noter la date » — vestiaire + — *Trois des onze stades n'auront plus d'usage en septembre. On le sait avant le coup d'envoi.*

**`co.nv.2047_sans_guichet`** — *Le stade sans guichet* · 2047 · tous · **arme** : — (décor)
**PETITE JOSIANE** *(secrétaire — clé d'un local qui ne sert plus)* « On a fermé le dernier guichet du stade : tout se prend sur l'application, et le local du guichet devient une réserve. Ma tante en a vu passer ; ce guichet, elle l'a tenu douze ans en août. »
**OK** « Encaisser » / « Garder la clé » — tribunes − — *Le guichet devient l'endroit où l'on range les bâches. C'est bien pour les bâches.*

**`co.nv.2048_derniere_buvette`** — *On refait la buvette* · 2048 · tous · **arme** : `set: [monde_buvette_refaite]`
**GÉRARD** *(fantôme du club, plaque au mur — voix d'archive)* « La buvette a été refaite en 2048, avec deux tireuses et la boîte en fer d'origine, sous verre. Ici, on payait en bières ; c'est écrit sur la plaque, avec la date et une faute. »
**OK** « Encaisser » / « Lire la plaque » — tribunes + — *La faute est sur le mot « bénévole ». On ne la corrige pas ; on la montre.*

**`co.nv.2049_district_renait`** — *Le district compte ses clubs* · 2049 · tous · **arme** : `set: [monde_district_plein]`
**ROUX** *(président de district, très vieux — registre neuf, écriture tremblée)* « Il y a plus de clubs dans le district cette année qu'en mille neuf cent quatre-vingt-dix, et aucun n'a de budget. Le district, c'est la base ; la base a repris toute la place que le haut a laissée. »
**OK** « Encaisser » / « Signer le registre » — tribunes + — *Quarante-deux clubs, dont onze créés depuis 2040. Neuf ont repris le nom d'un club mort.*

**`co.nv.2050_bilan_siecle`** — *Le siècle en un écran* · 2050 · tous · **arme** : `set: [monde_fin]`
**PETITE JOSIANE** *(secrétaire — un seul feuillet, imprimé)* « La Fédération a publié le bilan du demi-siècle : soixante ans, quatre monnaies, deux formats et un journal survivant. Ma tante en a vu passer ; il paraît que le tableau tient sur une page. »
**OK** « Encaisser » / « Lire la page » — direction − — *Le tableau tient sur une page. On y lit tout, sauf ce que ça faisait d'y être.*

**`co.nv.2050_dernier_dimanche`** — *Le dernier dimanche* · 2050 · tous · **arme** : — (décor final ; sert de brève de secours à l'écran de fin)
**LE STAGIAIRE DE L'ÉCHO** *(voix sans portrait — dernière page composée à la main)* « Le journal fête ses cent quarante-huit ans dimanche, et le stade joue à quinze heures comme en 1902. Au local, on a sorti les photos ; il y en a une où personne ne reconnaît personne. »
**OK** « Encaisser » / « Regarder la photo » — tribunes + — *On identifie deux visages sur la photo. On invente les autres, et on les note au dos.*

---

## 4. Les Nouvelles du passé (vingt-quatre)

**Le moteur.** Quand tu changes de club (ou de rôle), les intrigues en attente du club précédent sont abandonnées (`reason = 'club'`) et ressortent une fois, plus tard, en carte `kind: passe` : la carte générique `tr.nouvelles_du_passe` (Josiane, un fax à la main, « Une vieille affaire — {passe_titre} — refait surface ») avec les effets de l'`epilogue` de l'arc. Ce chapitre écrit **vingt-trois variantes** qui prennent sa place quand leur condition est vraie (première vraie gagne, la générique reste en secours) : elles nomment l'affaire au lieu de la désigner, et donnent la parole à quelqu'un d'autre que la secrétaire. Un seul bouton, deux libellés, effets identiques ; l'`epilogue` de l'arc s'applique **en plus** de l'effet écrit ici ; jamais deux Nouvelles du passé de suite ; jamais en saison 0.

**Gabarit en ligne de tableau** (§ 4.6 adapté) : id · condition en clair puis en langage du jeu · locuteur (expression) · réplique (deux phrases, un tic) · bouton unique, effets, conséquence · ligne d'Almanach (kind `arc`, poids 2).

| id | Condition (clair · jeu) | Locuteur | Réplique | Bouton · effets · conséquence | Almanach |
|---|---|---|---|---|---|
| `co.nouvelle.passe_pacte` | tu as promis le local rénové et tu es parti · `flag('pacte_gege') && club_change` | GÉGÉ (noir) | « Le local a été repeint cet été, par le club, sans qu'on demande. La tribune n'oublie rien : la date est encore sur le mur, avec ton nom au-dessus. » | « Encaisser » / « Regarder le mur » · tribunes − · *La craie a tenu deux ans. La peinture a tenu deux mois.* | « {annee} · Le local promis à {ville} a été rénové sans {nom}. » |
| `co.nouvelle.passe_mbako` | le prodige a été vendu après ton départ · `flag('mbako_lance') && !flag('mbako_vendu') && club_change` | MASSENET (neutre) | « Le petit que vous aviez lancé est parti pour trente millions, six mois après vous. Juste une question, hors micro : vous en touchez quelque chose ? » | « Encaisser » / « Sourire jaune » · direction − · *Le club encaisse. Toi, tu lis le chiffre dans le journal comme tout le monde.* | « {annee} · Le prodige lancé par {nom} est vendu par un autre. » |
| `co.nouvelle.passe_gigi` | tu avais promis une saison de plus au vieux gardien · `flag('vecchio_promis') && club_change` | VECCHIO (au téléphone, neutre) | « Ils m'ont mis entraîneur des gardiens en octobre, sans me demander, et j'ai dit oui. J'en ai vu d'autres ; celle-là, je l'ai vue venir de très loin. » | « Encaisser » / « Rappeler plus tard » · vestiaire − · *Il raccroche le premier. Ça ne lui était jamais arrivé.* | « {annee} · Gigi Vecchio passe au staff du club que {nom} a quitté. » |
| `co.nouvelle.passe_salaires` | les salaires étaient en retard quand tu es parti · `flag('salaires_retard') && club_change` | JOSIANE (neutre) | « Tout a été payé en novembre, d'un coup, avec les arriérés et les intérêts. J'en ai vu passer ; celui-là est parti le mois d'avant, et il a manqué le virement. » | « Encaisser » / « Compter les mois » · caisse − · *Onze joueurs ont été payés. Le douzième était toi.* | « {annee} · Les arriérés de {ville} sont réglés après le départ de {nom}. » |
| `co.nouvelle.passe_naming` | le naming était signé quand tu es parti · `flag('naming_signe') && club_change` | LE STAGIAIRE DE L'ÉCHO | « Le panneau est monté en août : ancien nom en petit, marque en orange, quatre mètres de haut. Au local, on continue à donner rendez-vous à l'ancien nom. » | « Encaisser » / « Dire l'ancien nom » · tribunes − · *La photo de Une est prise de la tribune Est. On y voit surtout l'orange.* | « {annee} · Le stade de {ville} porte un nom de marque depuis août. » |
| `co.nouvelle.passe_vukic` | ton adjoint a pris ton banc · `flag('vukic_dauphin') && club_change` | VUKIĆ (sourire) | « J'ai pris le banc en janvier, avec ton cahier et deux pages en moins. Je te le dis parce que personne ne te le dira : les deux pages, c'était les tiennes. » | « Encaisser » / « Demander les pages » · direction − · *Il envoie une photocopie trois semaines plus tard. Elle est incomplète.* | « {annee} · Zoran Vukić prend le banc que {nom} a laissé. » |
| `co.nouvelle.passe_clow` | tu as laissé tomber le mentor · `flag('clow_ingrat') && club_change` | LE FILS DE CORVEN | « Mon père a laissé un carton avec des cassettes et une liste de six noms sur le couvercle. Le vôtre était le cinquième ; il a été barré au crayon, pas au stylo. » | « Encaisser » / « Demander le carton » · vestiaire − · *Le carton reste chez le fils. Le crayon s'efface avec le temps ; personne ne repasse dessus.* | « {annee} · Le carton de Dan Corven ne contient pas de lettre pour {nom}. » |
| `co.nouvelle.passe_camille` | tu as déménagé avec elle et vous n'êtes pas séparés · `flag('camille_ici') && club_change && !flag('divorce')` | CAMILLE (sourire) | « L'ancien voisin a envoyé une carte : il dit que le boulanger d'en bas a fermé et qu'il pense à nous. Tu rentres à quelle heure ? J'ai gardé la carte sur le frigo. » | « Encaisser » / « Lire la carte » · relation.camille +1 · *La carte reste sur le frigo trois ans. On finit par ne plus la voir.* | « {annee} · Une carte postale de l'ancienne ville reste sur le frigo. » |
| `co.nouvelle.passe_tribune` | la tribune attendait l'été quand tu es parti · `flag('tribune_a_renover') && club_change` | GÉGÉ (neutre) | « La tribune Nord a été refaite en juillet : sièges neufs, radiateurs neufs, deux rangs en moins. La tribune n'oublie rien, surtout pas les deux rangs. » | « Encaisser » / « Compter les rangs » · tribunes − · *Trois cents places de moins, quatre cents abonnés en plus. On s'assoit serré, et on aime ça.* | « {annee} · La tribune Nord de {ville} est rénovée l'été suivant le départ de {nom}. » |
| `co.nouvelle.passe_descente` | ton ancien club est descendu · `club_change && ancien_club.descente` | MASSENET (neutre) | « Votre ancien club est descendu, à deux points, avec quatre entraîneurs dans la saison. Juste une question, hors micro : vous auriez fait mieux ? » | « Encaisser » / « Ne pas répondre » · tribunes + · *Tu ne réponds pas. Le lendemain, le journal écrit que tu as souri.* | « {annee} · L'ancien club de {nom} descend, un an après. » |
| `co.nouvelle.passe_montee` | ton ancien club est monté · `club_change && ancien_club.montee` | LÉA (neutre) | « Ils sont montés au bout de la deuxième saison, avec neuf joueurs que vous aviez fait signer. Vous confirmez ? Le président, lui, ne vous a pas cité une fois. » | « Encaisser » / « Confirmer » · direction − · *Le président remercie le groupe, la ville et le hasard. Dans cet ordre.* | « {annee} · L'ancien club de {nom} monte avec neuf de ses joueurs. » |
| `co.nouvelle.passe_enveloppe` | l'enveloppe promise n'a jamais été refermée · `flag('enveloppe_promise') && club_change` | DAUZAT (neutre) | « La commission a rouvert un dossier de l'époque où vous étiez là-bas, à la demande d'un club adverse. C'est dans le procès-verbal ; votre nom y est deux fois, à la même page. » | « Encaisser » / « Demander la page » · direction − · *La page arrive par courrier. Les deux mentions sont dans la liste des présents.* | « {annee} · Un dossier de l'ancien club de {nom} est rouvert. » |
| `co.nouvelle.passe_gerard` | Gérard était parti avec la caisse · `flag('gerard_parti') && club_change` | PICHON (sourire triste) | « Gérard a envoyé une carte postale au club, sans adresse au dos, avec un timbre qu'on ne connaît pas. Le pain, c'est à cinq heures ; la carte est arrivée à onze. » | « Encaisser » / « Regarder le timbre » · caisse − · *La carte dit trois mots et il fait beau. On l'a punaisée derrière le comptoir.* | « {annee} · Une carte postale sans adresse arrive au club de Gérard. » |
| `co.nouvelle.passe_buvette` | tu as quitté un club amateur · `club_change && ancien_role == 'president_amateur' \|\| ancien_role == 'joueur_amateur'` | DÉDÉ (neutre) | « La buvette a fermé en février : plus de bénévole le samedi, plus de merguez, plus de tournoi. Bon, on va pas se mentir : c'est ça qui a tué le club, pas la descente. » | « Encaisser » / « Proposer un samedi » · tribunes − · *Deux anciens rouvrent un dimanche sur trois. Ça tient jusqu'en juin.* | « {annee} · La buvette de l'ancien club de {nom} ferme un samedi de février. » |
| `co.nouvelle.passe_josiane` | tu as quitté un club où Josiane travaillait · `club_change && year < 2008` | JOSIANE (sourire) | « J'ai rangé votre bureau : deux cahiers, une photo, un sifflet et un mot que vous n'avez pas posté. J'en ai vu passer ; les mots non postés, c'est ce qu'il en reste toujours. » | « Encaisser » / « Demander le mot » · relation.josiane +1 · *Elle garde le mot dans le tiroir du haut. Elle ne le lit pas.* | « {annee} · Josiane range le bureau de {nom} : deux cahiers et un mot. » |
| `co.nouvelle.passe_brassard` | tu étais capitaine et tu es parti · `flag('capitaine') && club_change` | BRÉHAUT (neutre) | « Le brassard est passé à un garçon de vingt-trois ans qui le remet à l'envers un match sur deux. Le groupe vit bien ; il vit autrement, c'est tout. » | « Encaisser » / « Envoyer un mot » · vestiaire − · *Tu envoies trois lignes. Il les lit à voix haute dans le vestiaire ; ça ne se fait pas, et ça fait du bien.* | « {annee} · Le brassard de {nom} passe à un joueur de vingt-trois ans. » |
| `co.nouvelle.passe_prodige` | tu n'as pas lancé le gamin qu'on te signalait · `!flag('mbako_lance') && !flag('pepite') && club_change && season >= 2` | BARBIER (neutre) | « Le gamin que vous n'avez pas fait jouer a signé à Valdorne en janvier et il a marqué en février. Je l'ai vu jouer sous la pluie ; vous, vous l'avez vu à l'entraînement. » | « Encaisser » / « Regarder le rapport » · force −1 · *Le rapport tient en quatre lignes. La quatrième dit « à revoir dans deux ans ».* | « {annee} · Le jeune écarté par {nom} signe dans un centre de formation. » |
| `co.nouvelle.passe_bache` | la tribune avait mis ton nom sur une bâche · `flag('otage_kop') \|\| flag('ami_ultras')` + `club_change` | GÉGÉ (neutre) | « La bâche à ton nom a été décrochée en octobre, pliée, et rangée sous le bar avec les autres. La tribune n'oublie rien ; elle range, mais elle ne jette pas. » | « Encaisser » / « Demander la bâche » · tribunes − · *Elle est toujours sous le bar. Vingt mètres, trois plis, ton nom à l'intérieur.* | « {annee} · La bâche au nom de {nom} est pliée sous le bar du local. » |
| `co.nouvelle.passe_president` | le président qui t'a laissé partir a sauté · `club_change && journal_has('ancien_president_vire')` | MALBEC (sourire) | « Le président qui vous a laissé partir a été destitué en assemblée générale, à onze voix contre neuf. Entre présidents, on se comprend ; lui, plus personne ne le comprenait. » | « Encaisser » / « Ne rien dire » · direction + · *Il t'appelle deux mois plus tard, pour rien. Tu décroches, aussi pour rien.* | « {annee} · Le président de l'ancien club de {nom} est destitué. » |
| `co.nouvelle.passe_commission` | la lettre de la Commission est arrivée après ton départ · `flag('commission_lettre') && club_change` | VIALAT (neutre) | « La lettre est partie le 12, vous étiez parti le 4, et elle porte quand même votre nom en objet. Je ne juge pas, je compte ; je compte les dates, aussi. » | « Encaisser » / « Demander la lettre » · caisse − · *La lettre suit deux adresses et arrive chez toi en mars. Elle est ouverte.* | « {annee} · La lettre de la Commission arrive après le départ de {nom}. » |
| `co.nouvelle.passe_fusion` | tu as quitté un club menacé de fusion · `flag('fusion_menace') && club_change` | AUBERT (neutre) | « Les deux clubs ont fusionné en juin, un maillot mi-jaune mi-vert et un seul terrain. Le stade, c'est de l'argent public ; deux stades, c'était deux fois trop d'argent public. » | « Prendre acte » / « Encaisser » · tribunes − · *Trois cents licenciés se répartissent sur un terrain. Cent vingt ne se réinscrivent pas.* | « {annee} · L'ancien club de {nom} fusionne avec son voisin. » |
| `co.nouvelle.passe_plaque` | tu as passé cinq saisons au club quitté · `stats.saisons_club >= 5 && club_change` | LE STAGIAIRE DE L'ÉCHO | « Une plaque a été posée au-dessus de la porte du vestiaire, avec le nom, les années et une faute d'accent. Au local, on a voté pour garder la faute ; c'est passé à main levée. » | « Encaisser » / « Regarder l'accent » · tribunes + · *La faute reste. Elle devient le détail que tout le monde raconte aux nouveaux.* | « {annee} · Une plaque au nom de {nom} est posée au vestiaire de {ville}. » |
| `co.nouvelle.passe_flacon` | le dossier antidopage était ouvert quand tu es parti · `flag('flacon_b') && club_change` | SABATIER (neutre, sobre) | « Le dossier a été classé en avril, sans audition, avec une ligne de conclusion et pas de nom. Ça reste entre la table et moi ; la table, cette fois, était une salle. » | « Encaisser » / « Lire la ligne » · direction − · *La ligne dit « éléments insuffisants ». Elle ne dit pas insuffisants pour quoi.* | « {annee} · Le dossier médical ouvert sous {nom} est classé sans audition. » |
| `tr.nouvelles_du_passe` (existante) | secours, sans condition | JOSIANE, puis la petite Josiane après 2022 | texte existant, conservé : « Une vieille affaire — {passe_titre} — refait surface. Ça ne vous concerne plus. Presque. » | « Tourner la page » ×2 · effets de l'`epilogue` seuls · *(l'`answer` reste vide)* | l'`epilogue.journal` de l'arc |

---

## 5. Le journal de carrière (l'Almanach)

**Ce que c'est.** `GameState.journal` : une liste d'entrées datées, pondérées, taguées, écrites par le moteur au fil de la partie (spec § 1.7). Elle sert trois écrans : les **trois brèves** de la Une du Bilan (les plus lourdes de la saison, hors sujet de la manchette), l'écran **« Ce qui s'est passé »** (les six plus lourdes de la carrière), et le **Cimetière** (une ligne par carrière). Une entrée est formatée à l'écriture (le nom, le club, le rang de l'instant) et tronquée à 120 caractères. Compaction : douze entrées par saison au plus.

### 5.1 Les onze gabarits du moteur (existants, `content/journal.yaml` — ne pas réécrire)

`bilan_tenu`, `bilan_manque`, `montee`, `descente`, `titre` (kind `bilan`, poids 3, titre 4) · `palier_moins3`, `palier_plus3` (kind `palier`, poids 2) · `transition`, `club_change` (kind `transition`, poids 3) · `objectif` (poids 3) · `fin` (poids 5). Ce chapitre n'y touche pas : il en dépend. Deux remarques d'usage pour la Une : `titre` et `fin` gagnent toujours la première brève quand elles existent ; `palier_plus3` porte `{perso_tic}`, ce qui met un tic dans le journal — c'est le seul endroit où un tic s'imprime sans guillemets.

### 5.2 Quarante gabarits de plus (par type d'événement)

À déclarer dans `journal.yaml` sous `auto:` ; un gabarit absent = pas de ligne (le moteur ne plante pas). Poids : 1 anecdote, 2 trace, 3 fait de saison, 4 fait rare, 5 fin.

| clé | kind · poids | Écrite quand | Gabarit (≤ 120 caractères) |
|---|---|---|---|
| `coupe_gagnee` | bilan · 4 | la Coupe est gagnée (set-piece `cup`) | « {annee} · {club} gagne la Coupe. {prenom} {nom} tient le trophée par le bas. » |
| `coupe_humiliation` | bilan · 3 | sorti par un club de deux divisions de moins | « {annee} · {club} sorti de la Coupe par un club de {division}e division. Terrain en pente. » |
| `derby_gagne` | trace · 2 | trace `derby_gagne` posée | « {annee} · La vallée a un patron : {club} bat {rival}. » |
| `derby_perdu` | trace · 2 | trace `derby_perdu` posée | « {annee} · {rival} gagne le derby. Le local n'a pas ouvert le lendemain. » |
| `promesse_tenue` | carte · 2 | `promise` résolue à l'endroit | « {annee} · {nom} avait promis {promesse}. {pg, select, f{Elle} other{Il}} l'a fait. » |
| `promesse_rompue` | carte · 2 | `promise` résolue à l'envers | « {annee} · La promesse de {promesse} est datée au mur de la Gazette. Elle n'a pas tenu. » |
| `mercato_vente` | carte · 2 | une vente conclue | « {annee} · {club} vend {joueur} pour {prix} {monnaie}. La caisse respire jusqu'en janvier. » |
| `mercato_achat` | carte · 2 | un achat conclu | « {annee} · {club} signe {joueur}. Le vestiaire compte les places, pas les millions. » |
| `mercato_rate` | carte · 2 | le fax de 23 h 58 ne passe pas | « {annee} · Le transfert de {joueur} n'est pas parti à temps. Le fax a imprimé à 23 h 59. » |
| `blessure_longue` | carte · 3 | blessure de plus de six mois | « {annee} · {joueur} sort pour la saison. Le Doc n'a pas commenté ; c'est sa façon de commenter. » |
| `retour_blessure` | carte · 2 | retour après blessure longue | « {annee} · {joueur} rejoue après {mois} mois. Le stade s'est levé avant le coup d'envoi. » |
| `selection_appel` | trace · 3 | trace `international` posée | « {annee} · {prenom} {nom} en bleu cobalt pour la première fois. » |
| `selection_refus` | trace · 2 | trace `selection_refusee` posée | « {annee} · {prenom} {nom} décline la sélection. On ne dit pas non deux fois. » |
| `sanction_commission` | trace · 3 | une sanction disciplinaire tombe | « {annee} · Salle 3 : {sanction} pour {prenom} {nom}. Le procès-verbal tient en une page. » |
| `sanction_levee` | carte · 2 | une sanction annulée | « {annee} · La sanction est levée pour vice de forme. Le Tribunal du Sport a répondu tard. » |
| `arrivee_perso` | carte · 1 | un personnage rejoint le club | « {annee} · {perso} arrive à {club}. » |
| `depart_perso` | carte · 2 | un personnage quitte le club | « {annee} · {perso} quitte {club}. {perso_tic} » |
| `deces_perso` | carte · 4 | un personnage meurt | « {annee} · {perso} est mort. Une minute avant le coup d'envoi ; le stade a tenu deux. » |
| `naissance` | trace · 3 | trace `sacha_nee` posée | « {annee} · Naissance de {enfant}. Tribune Est dès le mois prochain, dit le père Guichard. » |
| `divorce` | trace · 3 | trace `divorce` posée | « {annee} · La valise était dans l'entrée. Elle n'était pas à {prenom} {nom}. » |
| `nouvelle_monde` | nouvelle · 1 | une Nouvelle datée est servie | « {annee} · {nouvelle_titre}. » |
| `election` | transition · 3 | une élection d'instance gagnée | « {annee} · {prenom} {nom} élu{pg, select, f{e} other{}} à {instance}, de {ecart} voix. » |
| `mandat_renouvele` | bilan · 3 | mandat reconduit au Congrès | « {annee} · Mandat renouvelé. {ecart} voix ; Roux a voté pour la base. » |
| `campagne_promesse` | carte · 2 | une promesse de Campagne posée | « {annee} · Promesse de campagne à {confederation} : {promesse}. Elle est datée. » |

#### 5.2 bis Les seize derniers gabarits (par types d'événement non couverts)

La charte § 5.1 en demande quarante en plus des onze du moteur ; les vingt-quatre ci-dessus n'en couvraient pas huit familles entières. Les voici, dans les huit familles qui manquaient : **le vote, le contrôle, la mort d'un personnage à statut, la naissance et la lignée, le changement de nom d'un stade, l'objet qui change de main, la promesse tenue et la promesse datée.**

| clé | kind · poids | Écrite quand | Gabarit (≤ 120 caractères) |
|---|---|---|---|
| `vote_congres` | trace · 3 | un vote de Congrès est tranché (`in.campagne.le_vote`, `in.le_congres`) | « {annee} · Congrès : {voix_pour} voix pour, {voix_contre} contre. {nom} a compté les siennes deux fois. » |
| `vote_ag` | trace · 3 | une AG d'actionnaires vote (`pr.ag`) | « {annee} · L'AG a voté en bloc. Les résolutions étaient séparées ; le fonds, non. » |
| `vote_socios` | trace · 3 | les socios votent (`pr.vente_du_club.socios`, `gege_socio`) | « {annee} · Les socios ont voté à main levée. On a recompté les mains, pas les voix. » |
| `controle_medical` | carte · 2 | une visite médicale de transfert (`ds.visite`, `jp.genou`) | « {annee} · Visite médicale de {joueur} : trois jours, deux avis, une signature. » |
| `controle_inopine` | trace · 3 | un contrôle antidopage tombe (`flacon_b`, `controle_inopine`) | « {annee} · Contrôle inopiné un mardi matin. Le Doc a ouvert l'armoire lui-même. » |
| `audit` | trace · 3 | la Commission ouvre un audit (`commission_lettre`, `fede_dossier`) | « {annee} · Audit ouvert sur {club}. L'Inspecteur ne juge pas ; elle a demandé la ligne douze. » |
| `deces_statut` | trace · 4 | une trace `<id>_mort` est posée | « {annee} · {personnage} est mort. {detail}. » (le détail vient du ch. 31 § 9) |
| `enterrement_present` | carte · 3 | le joueur assiste à l'enterrement | « {annee} · {nom} était à l'enterrement de {personnage}, au premier rang ou derrière un pilier. » |
| `naissance` | carte · 3 | `sacha_nee` est posée | « {annee} · {prenom_enfant} est né{pg_enfant} pendant un match. {nom} est arrivé{pg} à minuit. » |
| `lignee_succession` | bilan · 5 | la Succession désigne l'héritier | « {annee} · {heritier} reprend le nom, le trait hérité, et la place 14B si elle est libre. » |
| `stade_renomme` | trace · 3 | `naming_signe`, `arena_dupuis`, `plaque_reduite` | « {annee} · Le stade s'appelle {nouveau_nom}. Dans la rue, on dit encore « le stade ». » |
| `stade_rendu` | trace · 3 | le naming tombe, ou la mairie reprend | « {annee} · Le nom est retiré de la façade. Les vis sont restées ; on les voit de loin. » |
| `objet_transmis` | trace · 3 | un objet héritable change de main (§ 4 du ch. 31) | « {annee} · {objet} a changé de main. {donneur} ne l'a pas repris. » |
| `objet_perdu` | trace · 2 | un objet héritable est perdu, vendu ou jeté | « {annee} · {objet} a disparu. Personne n'a cherché longtemps ; c'est ça qui reste. » |
| `promesse_datee` | trace · 2 | une promesse publique entre au mur de la Gazette | « {annee} · Promesse datée au mur : {promesse}, échéance {echeance}. Le mur ne bouge pas. » |
| `promesse_tenue_tard` | trace · 3 | une promesse est tenue après son échéance | « {annee} · {nom} a tenu {promesse}, avec {retard} de retard. La Gazette a barré la ligne, à regret. » |

**Compte** : 11 (moteur, `journal.yaml`) + 24 (§ 5.2) + 16 (ici) = **51 gabarits**, dont **40 écrits par ce chapitre**, comme la charte le demande.

### 5.3 Quarante lignes d'exemple (ce sont les brèves types)

**Nom d'exemple** : Suzanne Bréhaut-Lemoine, joueuse puis entraîneuse d'AS Saint-Étoile — c'est le nom de test de la charte (§ 4.5), le plus long à rendre.

Formatées, ≤ 120 caractères, dans l'ordre où un lecteur les rencontrerait sur une Une. Colonne « où » : le journal qui les prend en brève de préférence (`Q` Quotidien, `G` Gazette, `E` Écho).

| # | Ligne | kind · poids | Source | Où |
|---|---|---|---|---|
| 1 | 1991 · AS Saint-Étoile termine 17e : objectif « maintien » tenu. | bilan · 3 | `bilan_tenu` | Q E |
| 2 | 1991 · Le pacte du local est écrit à la craie sur le mur de la Tribune Nord. | trace · 2 | `pacte_gege` | E |
| 3 | 1991 · Gégé doit quelque chose à Suzanne Bréhaut-Lemoine. La tribune n'oublie rien. | palier · 2 | `palier_plus3` | E |
| 4 | 1992 · Le chauffage de la tribune Nord attend l'été prochain. | trace · 2 | `tribune_a_renover` | E |
| 5 | 1992 · La paie du 5 est tombée le 26. Onze joueurs au distributeur. | trace · 2 | `salaires_retard` | G |
| 6 | 1992 · AS Saint-Étoile signe Lian Mbako, seize ans, pour rien. | carte · 2 | `mercato_achat` | Q |
| 7 | 1993 · La vallée a un patron : AS Saint-Étoile bat Olympique Lyonnet. | trace · 2 | `derby_gagne` | E |
| 8 | 1993 · AS Saint-Étoile vend Lian Mbako pour trente millions de francs. | carte · 2 | `mercato_vente` | Q G |
| 9 | 1993 · Le virage a fait le onze. Trois noms sur onze ont joué. | trace · 2 | `onze_du_virage` | G |
| 10 | 1994 · Doc Sabatier ne parle plus à Suzanne Bréhaut-Lemoine. | palier · 2 | `palier_moins3` | G |
| 11 | 1994 · AS Saint-Étoile termine 5e : objectif « la Coupe Continentale » manqué. | bilan · 3 | `bilan_manque` | Q |
| 12 | 1995 · L'arrêt Vaneste : en fin de contrat, on part où l'on veut. | nouvelle · 1 | `nouvelle_monde` | Q |
| 13 | 1995 · Gigi Vecchio passe au staff : entraîneur des gardiens à quarante-six ans. | trace · 2 | `gigi_staff` | E |
| 14 | 1996 · Une enveloppe a été promise. Elle n'a pas été ouverte devant témoin. | trace · 2 | `enveloppe_promise` | G |
| 15 | 1996 · Salle 3 : deux matchs de suspension pour Suzanne Bréhaut-Lemoine. | trace · 3 | `sanction_commission` | Q |
| 16 | 1997 · La sanction est levée pour vice de forme. Le Tribunal a répondu tard. | carte · 2 | `sanction_levee` | Q |
| 17 | 1997 · Montée en Division 1 avec AS Saint-Étoile. | bilan · 3 | `montee` | E Q |
| 18 | 1997 · Naissance de Sacha. Tribune Est dès le mois prochain, dit le père Guichard. | trace · 3 | `naissance` | E |
| 19 | 1998 · L'année où tout le monde aimait le football. | nouvelle · 1 | `nouvelle_monde` | E |
| 20 | 1998 · AS Saint-Étoile champion. Suzanne Bréhaut-Lemoine sur la photo, au bord. | bilan · 4 | `titre` | Q G E |
| 21 | 1999 · Le stade s'appelle Arena Almadis depuis août. | trace · 2 | `naming_signe` | G |
| 22 | 1999 · Le transfert de Dembo n'est pas parti à temps. Le fax a imprimé à 23 h 59. | carte · 2 | `mercato_rate` | G |
| 23 | 2000 · Suzanne Bréhaut-Lemoine avait promis le maintien sans vendre. Elle l'a fait. | carte · 2 | `promesse_tenue` | Q |
| 24 | 2000 · Zoran Vukić a relu le second discours. Son nom est dedans. | trace · 2 | `vukic_dauphin` | G |
| 25 | 2001 · Dan Corven est mort. Une minute avant le coup d'envoi ; le stade a tenu deux. | carte · 4 | `deces_perso` | Q E |
| 26 | 2001 · AS Saint-Étoile gagne la Coupe. Suzanne Bréhaut-Lemoine tient le trophée par le bas. | bilan · 4 | `coupe_gagnee` | Q G E |
| 27 | 2002 · Le premier salaire en écus. Tout le monde divise à voix haute. | nouvelle · 1 | `nouvelle_monde` | Q |
| 28 | 2002 · Suzanne Bréhaut-Lemoine raccroche les crampons et prend le banc d'AS Saint-Étoile. | transition · 3 | `transition` | Q E |
| 29 | 2003 · AS Saint-Étoile sorti de la Coupe par un club de 5e division. Terrain en pente. | bilan · 3 | `coupe_humiliation` | G |
| 30 | 2003 · Le genou a été opéré. Le Doc n'a pas commenté ; c'est sa façon de commenter. | carte · 3 | `blessure_longue` | Q |
| 31 | 2004 · Objectif caché atteint : Gigi titulaire pour la finale. | objectif · 3 | `objectif` | E |
| 32 | 2004 · La lettre de la Commission des comptes est arrivée. Deux soldes négatifs. | trace · 2 | `commission_lettre` | Q G |
| 33 | 2005 · Suzanne Bréhaut-Lemoine signe au Racing de Valentienne. | transition · 3 | `club_change` | Q |
| 34 | 2005 · Madame Josiane quitte AS Saint-Étoile. J'en ai vu passer, vous savez. | carte · 2 | `depart_perso` | E |
| 35 | 2006 · La valise était dans l'entrée. Elle n'était pas à Suzanne Bréhaut-Lemoine. | trace · 3 | `divorce` | G |
| 36 | 2007 · Suzanne Bréhaut-Lemoine décline la sélection. On ne dit pas non deux fois. | trace · 2 | `selection_refus` | Q |
| 37 | 2008 · Élue à la Fédération, de onze voix. | transition · 3 | `election` | Q |
| 38 | 2009 · Promesse de campagne à la confédération du Sud : deux places au Mondial. Elle est datée. | carte · 2 | `campagne_promesse` | G |
| 39 | 2010 · Mandat renouvelé. Neuf voix ; Roux a voté pour la base. | bilan · 3 | `mandat_renouvele` | Q |
| 40 | 2011 · Le vote de défiance. | fin · 5 | `fin` | Q G E |

Règle de lecture pour l'intégrateur : une brève ne dit **jamais** un chiffre de jauge, ne commente **jamais** un choix, ne contient **jamais** deux fois le nom du joueur. Une brève qui contient un tic le contient sans guillemets (ligne 3, ligne 34) : c'est la voix du journal qui cite de mémoire.

---

## 6. La Gazette Rose de Camille (dix entrefilets)

**L'idée.** Camille est la cinquième jauge : elle ne se lit pas dans un chiffre, elle se lit dans ce qu'elle a lu avant toi. Dix fois par carrière au plus, elle ouvre la Gazette à la page cinq — « Vu au parking », la photo et la légende de Tonio Ferrand — et te lit un entrefilet qui te concerne. Ce sont des **réactions** au gabarit § 4.4 (`co.re.camille_parking_<mot>`), servies au tirage suivant, hors créneau, plafond compris dans les quatre réactions par saison ; toutes lisent `!flag('divorce')` ; jamais deux dans la même saison ; jamais en saison 0 ; jamais après un drame. L'entrefilet est le texte imprimé (deux phrases, la source est un lieu, la dernière ligne est une question) ; la réplique est ce que Camille en fait.

| id | Après · conditions | L'entrefilet (Gazette, « Vu au parking ») | CAMILLE (expression) — réplique | ← / → effets · conséquences |
|---|---|---|---|---|
| `co.re.camille_parking_diner` | après une carte où tu as choisi le dîner du président · `relation.camille <= 0` | « Une table pour deux réservée à vingt heures, occupée à vingt-deux par trois hommes en costume. La chaise vide était réservée au nom d'une dame. Et maintenant ? » | (neutre, journal plié à la page cinq) « Ils ont écrit “une dame”, et ils ont mis la photo de la chaise. Tu rentres à quelle heure, ce soir, pour de vrai ? » | ← **Je réponds une heure** — relation.camille +1, direction − — *Tu rentres à cette heure-là. Elle a compté.* / → **Je ne promets rien** — relation.camille −1 — *Elle referme le journal à la bonne page.* |
| `co.re.camille_parking_hotel` | après une nuit d'hôtel du club · `flag('camille_ici')` | « Le parking de l'hôtel du club était plein un mardi de novembre, et la chambre 12 avait de la lumière à deux heures. On y range les stagiaires, dit-on. Et maintenant ? » | (noir, café froid) « La chambre 12, c'est celle des stagiaires : je l'ai su avant eux, parce que tu me l'avais dit. Tu rentres à quelle heure ? » | ← **Je rentre ce soir** — vestiaire −, relation.camille +1 — *Tu rates la séance vidéo. La chambre 12 reste vide.* / → **Je finis la semaine là-bas** — relation.camille −1, force +1 — *La lumière reste allumée jusqu'à deux heures. Six nuits.* |
| `co.re.camille_parking_note` | après une manchette `gazette` avec une note du Rosé · `journal_has('une')` | « Le Rosé note 6/20, “et encore, pour la coiffure”. Le parking du stade était vide à dix-neuf heures ; c'est un chiffre aussi. Et maintenant ? » | (sourire) « Six sur vingt pour la coiffure, c'est injuste : la coiffure, c'est la seule chose que je gère. Tu rentres à quelle heure ? » | ← **On en rit ce soir** — relation.camille +1, tribunes − — *Vous découpez l'article. Il finit sur le frigo, à côté de la carte postale.* / → **Je ne lis pas ça** — relation.camille −1 — *Elle lit la fin toute seule, à voix haute, pour personne.* |
| `co.re.camille_parking_promesse` | après une promesse publique rompue · `parole <= -1` | « Le mur des promesses, datées, s'allonge d'une ligne : “la tribune rénovée avant juin”. C'était en octobre, au micro, devant deux cents personnes. Et maintenant ? » | (neutre, crayon à la main) « Ils datent tout, maintenant, même ce que tu m'as promis à moi. Tu rentres à quelle heure ? Je note. » | ← **Celle-là, je la tiens** — parole +1, direction − — *Elle raye la ligne au crayon. Le crayon, pas le stylo.* / → **C'est du journal** — relation.camille −1 — *Elle laisse la ligne. Elle laisse aussi le journal ouvert.* |
| `co.re.camille_parking_agent` | après une scène avec Fardelli ou Solvang · `relation.fardelli >= 1 \|\| relation.solvang >= 1` | « Deux cafés, une gourmette et une serviette pliée en quatre au bar de l'hôtel de la gare. La serviette est repartie dans une poche. Et maintenant ? » | (noir) « La serviette pliée en quatre, c'est une phrase que je préférerais ne pas savoir lire. Tu rentres à quelle heure, et avec qui ? » | ← **Je viens te chercher** — caisse −, relation.camille +1 — *La serviette reste au bar. Le garçon la jette avec le reste.* / → **C'est mon métier** — relation.camille −1, caisse + — *Elle range le journal dans le tiroir du bas. Il y en a d'autres.* |
| `co.re.camille_parking_sacha` | après une carte de Sacha · `flag('sacha_nee') && chars.sacha.age >= 6` | « Un enfant attendait sur le parking du centre d'entraînement, à dix-neuf heures, avec un sac de sport trop grand. Aucun nom, aucune photo : on ne fait pas ça. Et maintenant ? » | (neutre, doux) « Ils n'ont pas mis la photo, et c'est la seule fois où je leur dis merci. Tu rentres à quelle heure ? Elle a demandé, pas moi. » | ← **Je pars maintenant** — direction −, relation.camille +1 — *Le sac trop grand rentre en voiture. C'est déjà tout.* / → **Après la vidéo** — relation.camille −1, force +1 — *Le parking est vide à vingt heures. Le sac aussi.* |
| `co.re.camille_parking_bache` | après une bâche ou un tifo à ton nom · `flag('ami_ultras') \|\| flag('otage_kop')` | « Vingt mètres de bâche, un nom, une faute d'accent, et douze personnes qui la portent à trois heures du matin. La colle était encore fraîche à sept heures. Et maintenant ? » | (sourire) « Ils ont mis l'accent au mauvais endroit, comme sur les convocations de la mairie. Tu rentres à quelle heure ? Je veux la voir avant qu'il pleuve. » | ← **On y va ensemble** — tribunes +, relation.camille +1 — *Vous la voyez à sept heures. Elle prend la photo, pas eux.* / → **J'y vais seul** — tribunes + — *Tu la vois seul. Elle la voit dans le journal, page cinq.* |
| `co.re.camille_parking_offre` | après une offre d'un autre club · `flag('rumeur_mercato')` | « Une berline immatriculée d'un autre département sur le parking des joueurs, deux heures, moteur coupé. Le chauffeur a lu tout le journal. Et maintenant ? » | (neutre, valise pas sortie) « Une berline d'un autre département, deux heures : soit c'est une offre, soit c'est un enterrement. Tu rentres à quelle heure me le dire ? » | ← **Ce soir, tout** — relation.camille +2, direction − — *Vous étalez la carte du pays sur la table. Elle entoure deux villes.* / → **Quand ce sera fait** — relation.camille −1 — *Elle apprend la ville par le journal. Elle apprend la date par le déménageur.* |
| `co.re.camille_parking_tendre` | l'entrefilet tendre annuel · `season >= 3 && relation.camille >= 1` | « Une femme attend depuis vingt ans au même endroit du parking, côté sortie des joueurs, sans écharpe et sans autographe. Nous ne mettons pas son nom. Et maintenant ? » | (sourire, gênée) « Ils ont écrit “vingt ans” et ils ont mis une photo de dos, et je me suis reconnue tout de suite. Tu rentres à quelle heure, ce soir, dis-moi. » | ← **Je sors par devant** — tribunes −, relation.camille +2 — *Tu sors par la grande porte. Elle t'attend côté sortie des joueurs, par habitude.* / → **Comme d'habitude** — relation.camille +1 — *Elle est là. Elle sera là la semaine prochaine aussi.* |
| `co.re.camille_parking_secours` | secours, sans condition (hors S0) | « Le parking du stade se vide en onze minutes un soir de victoire, en quatre un soir de défaite. Nous avons chronométré les deux. Et maintenant ? » | (neutre) « Onze minutes pour une victoire, quatre pour une défaite : ils ont chronométré ta vie, et ils ont raison. Tu rentres à quelle heure ? » | ← **En onze minutes** — relation.camille +1 — *Tu es à la maison avant la fin du bandeau.* / → **Il reste la vidéo** — relation.camille −1, force +1 — *Le parking est vide. Le bureau, non.* |

---

## 7. La couture : ce que ce chapitre pose, ce qu'il lit, ce qui reste ouvert

### 7.1 Les traces de monde posées ici (chapitre 31 les reprend sans les réécrire)

Chacune est posée par une Nouvelle datée et **lue ailleurs** : c'est la règle de la charte § 5.2 (une trace jamais lue est une erreur de build).

| Trace | Posée par | Lue par |
|---|---|---|
| `monde_droits_1990`, `monde_droits_1997` | `co.nv.1990_droits_tele`, `co.nv.1997_droits_doublent` | 13 (la répartition), 15 (« les petits ou les gros ? »), pools `sponsors` (poids ×2) |
| `monde_cobalts_1990` | `co.nv.1990_tirs_au_but` | 14 (la blessure de Fauvel), 10 (« tu regardais ») |
| `monde_tele_stade`, `monde_dimanche_soir` | 1991, 1994 | 13 (l'actionnaire audiovisuel, l'horaire imposé), 20 (`une.generic.creature`, la météo) |
| `monde_vaucastel`, `monde_defaut_droits` | 1992, 2006 | 13 (la mémoire des clubs, la trésorerie), 12 (la masse salariale), 15 |
| `monde_continentale_1993` | 1993 | 13 (l'audit trois ans), 11 (« ils l'ont fait avec ça ») |
| `monde_sans_mondial`, `monde_dix_huit` | 1994, 1996 | 14 (le pays à vingt), 15 (la motion, la réforme des formats) |
| `monde_libre_1993` ✱ | 1995 | 10 (*La clause*, F2), 12 (la fin de contrat), 11 |
| `monde_quotas`, `monde_premier_libre` | 1995, 1998 | 12 (le mercato ouvert), 14 (le binational), 10 |
| `monde_titre_2002` ✱ | 1998 | 14 (la génération d'après), 13 (les abonnements), 20 (manchette) |
| `monde_fonds` | 1999 | 11 et 13 (le `when` de l'arc Ilyas), 12 |
| `monde_but_en_or` | 1999 | 14 (le Grand Match du tournoi) |
| `monde_licence_agents`, `monde_agents_riches` | 2001, 2013 | 12 (le double mandat, la commission à deux chiffres), 15 |
| `monde_ecus` ✱ | 2002 | tous (`{monnaie}`), 20 (`une.generic.premier_ecu`) |
| `aubert_ministre` ✱ (trace transversale 40) | 2002 | 13, 14, 15, 30, 02 ; manchette `une.generic.ministre_signe` |
| `monde_mediacrash` | 2003 | 13 (l'échéance de 2006), 15 (l'appel d'offres) |
| `monde_buvette_anciens` | 2005 | 13 ; manchette `une.generic.finale_buvette` |
| `monde_flux` ✱ | 2007 | tous (le tweet, le mème, le compte anonyme) ; manchette `une.generic.flux` |
| `monde_algorithme`, `monde_modele` | 2008, 2037 | 12 (l'algorithme contre l'œil), 11 (le tableau noir) |
| `monde_feminines` | 2008 | 11 (postulat `section_feminine`), 15 (l'égalité des primes) |
| `monde_fair_play` | 2009 | 13 (la Commission), 12 (l'interdiction de recruter), 15 ; manchette `une.generic.actif_fair_play` |
| `monde_club_frere`, `monde_capitale_rachetee` | 2010, 2011 | 12, 13 |
| `monde_meme`, `monde_compte_anonyme` | 2014, 2020 | 13 (le tweet de 3 h), 15 (l'opinion), 30 (l'alarme tribunes) |
| `monde_gazette_en_ligne` | 2015 | 20 (§ 1.5), 13 (la fuite en direct) |
| `monde_video` ✱ | 2016 | 15 (Colline et la machine), 14, 30 (`aftermatch`) |
| `monde_legruet_parti`, `monde_legruet_mort` | 2016, 2029 | 15 (la succession, le Congrès sans lui), 14, 02 |
| `monde_quarante_huit`, `monde_soixante_quatre`, `monde_mondial_64` | 2017, 2044, 2046 | 14 (la qualification), 15 (les votes, les réserves) |
| `monde_lea_redac` | 2018 | 20 (§ 1.1), 15 |
| `monde_ligue_fermee` ✱ | 2019 | 13 et 15 (la chaîne « 60 heures »), 14, 20, 30 |
| `monde_mondial_hiver` | 2022 | 14 (le calendrier), 13 (le club frère) ; manchette `une.generic.mondial_decembre` |
| `monde_josiane_retraite` | 2022 | 01 et 02 (le suivant : la petite Josiane), 20 (les voix après 2022) |
| `monde_kick` | 2024 | 20 (la Une commentée), 13 (les droits) ; manchette `une.generic.kick` |
| `monde_memoires` | 2025 | 30 (fin *Les mémoires*), 15 (le dossier enterré ressort) |
| `monde_greve` ✱ | 2026 | 15 (le dossier calendrier), 14 (la liste), 13 (la billetterie) |
| `monde_mondial_amateurs` | 2026 | 10 (postulat déblocable), 13 |
| `monde_arbitre_machine` | 2027 | 15 (le dossier de Colline), 30 (`aftermatch`) ; manchette `une.elu.machine` |
| `monde_milliard`, `monde_limite_age` | 2028 | 12 et 13 (le prix de référence), 15 (la Campagne), 30 (*Mort au poste*) |
| `monde_vecchio_mort` | 2031 | 01 (l'enterrement), 30 (`epitaph_plus`), 11 (le poste de Gigi) |
| `monde_socios`, `monde_stade_partage` | 2032, 2035 | 13 (la reprise, le loyer), 15 (le statut des clubs), 20 (la météo) |
| `monde_notation` | 2033 | 13 (l'emprunt), 12 (le mercato bloqué), 15 |
| `monde_voix_generee` | 2042 | 20 (la voix du bandeau), 30 (fin *Le micro du dimanche*) |
| `monde_franchises` ✱ | 2040 | tous ; manchette `une.generic.ni_montee` ; 15 (deux dossiers) |
| `monde_national_vivant`, `monde_district_plein` | 2041, 2049 | 13 (la valeur d'un club de D2, le président amateur), 10 |
| `monde_fin` | 2050 | 30 (l'écran de fin de partie) |

✱ = trace de monde nommée par la charte § 5.2. Les variables d'armement (`vars.sponsor`, `vars.pharmacie`, `vars.tribune_alerte`, `vars.enveloppe`, `vars.cousin`, `vars.fax`, `vars.fusion`, `vars.pepite`, `vars.naming`, `vars.abonnement`, `vars.greve`, `vars.franchises`, `vars.coupe`) ne sont pas des drapeaux : elles doublent ou triplent le poids d'entrées de réservoir déclarées par les chapitres 10 à 15, et n'écrivent aucune ligne d'Almanach.

### 7.2 Ce que ce chapitre lit et n'invente pas

Les quarante traces transversales (§ 2.2) sont posées par les chapitres 10 à 15 ; ce chapitre n'en pose aucune, sauf `aubert_ministre` (que la charte lui attribue via la Nouvelle 2002). Les vingt-trois Nouvelles du passé lisent des traces existantes et l'`epilogue` des arcs ; elles n'en posent aucune. Les brèves de § 5.3 sont écrites par le moteur à partir des gabarits de § 5.1 et § 5.2 : aucune carte n'a à les répéter.

### 7.3 Questions ouvertes (pour le showrunner et le chantier données)

1. **`fin.famille`** : les douze Unes de fin (§ 2.4) supposent un chemin `fin.famille` dans le langage `when` (douze valeurs : `vestiaire_vide`, `vestiaire_pleine`, `tribunes_vide`, `tribunes_pleine`, `direction_vide`, `direction_pleine`, `caisse_vide`, `caisse_pleine`, `parole`, `age`, `justice`, `doree`). Le chapitre 30 doit l'attribuer à chacune des 91 fins ; sans lui, la Une de fin retombe sur `une.generic.fin_doree` / `fin_age`, ce qui serait faux.
2. **`{PAYS}`** : demandé par le chapitre 14, utilisé ici par les Nouvelles 1990, 1994, 1998 et par la tutelle (§ 2.3). À déclarer dans `formatText`.
3. **`stats.ennemis`, `stats.saisons_club`, `stats.clubs`, `world.serie_defaites`, `ancien_club.*`, `ancien_role`, `club_change`, `role_was()`** : compteurs et chemins lus par § 2.1, § 2.2 et § 4. Tous existent en intention, aucun n'est déclaré. À arbitrer d'un coup, avec `fin.famille`.
4. **`journal_has()` et les Nouvelles** : une Nouvelle datée écrit une entrée `nouvelle_monde` (poids 1) ; faut-il qu'elle puisse être **sujet** d'une manchette de priorité 1 (« PREMIER BILAN EN ÉCUS ») ? Ce chapitre le suppose (deux manchettes le font) ; il faut que la Nouvelle serve avant le Bilan, ce que les créneaux 7, 12, 14 garantissent.
5. **Le prix du journal après 2035** : « Offert par Almadis » suppose que `club_actif` ou `monde_capitale_rachetee` soit vrai quelque part dans le monde, pas forcément chez toi. Faute de mieux, l'app affiche « Offert » quand `year >= 2035` et le nom du fonds seulement si `flag('club_actif')`.
6. **Les voix après 2035** : la petite Josiane, le stagiaire de l'Écho, le fils de Corven et le fils de Montoya parlent ici sans fiche. Les chapitres 01 et 02 doivent leur donner adresse, tic et fenêtre, ou ce chapitre bascule sur le narrateur.
7. **La météo de la Marmite hors club** : le sélectionneur et le dirigeant d'instance n'ont pas de Marmite. Proposition : l'Écho de la Capitale rend « Météo du pays » avec les mêmes quarante formulations, en remplaçant « la Nord » par « le virage de la capitale » ; à trancher au chapitre 30.
8. **Deux Nouvelles la même saison** : le moteur réserve trois créneaux de Nouvelle par saison et deux datées peuvent tomber la même année (2002, 2007, 2008, 2011, 2016, 2019, 2022, 2024, 2026, 2028, 2031, 2032, 2035, 2040, 2050). Il faut vérifier que la seconde ne mange pas le créneau d'une Nouvelle du passé en attente ; sinon, priorité à la Nouvelle du passé, la datée a deux ans pour sortir.
