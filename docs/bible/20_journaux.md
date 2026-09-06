# FUSIBLE — Bible scénaristique · 20 · Les journaux : Unes, brèves, Nouvelles datées, Nouvelles du passé

> Tout ce qui s'imprime dans le monde de FUSIBLE. Trois journaux, une chaîne, une radio, un réseau ; la Une du Bilan que le joueur compare d'une relance à l'autre ; la chronologie 1990 → 2050 servie en Nouvelles datées ; ce que l'ancien club te fait savoir ; l'Almanach que le moteur écrit tout seul ; et la page rose où Camille lit ta vie avant toi. Ce chapitre suit la charte (`00_charte.md`) à la lettre : gabarits § 4.5 (manchette), § 4.6 (Nouvelle datée), § 4.4 (réaction), § 4.9 (anecdote) ; conventions d'ids § 4.10 ; les quarante traces de § 5.2.

## 0. Comment lire ce chapitre

**Ce qu'il fournit.** (1) La voix de chaque titre : dix règles de style, les plumes (avec des noms), les rubriques, les prix par décennie, la mise en page décrite pour l'app (masthead, date, météo, prix). (2) Les manchettes : les génériques de tous les rôles, une manchette par trace transversale de la charte lue *depuis un autre rôle* que celui qui la pose, les manchettes des quatre postulats d'instance (le chapitre 15 s'écrit en même temps que celui-ci : il fixera les ids de photo), et douze Unes de fin de carrière. (3) La chronologie du monde en quatre-vingt-sept Nouvelles datées, de 1990 à 2050, au gabarit § 4.6, chacune armant quelque chose. (4) Vingt-quatre Nouvelles du passé. (5) Les gabarits d'Almanach (les onze du moteur, vingt-quatre de plus) et quarante lignes d'exemple, qui sont aussi les brèves types. (6) La Gazette Rose de Camille : dix entrefilets « Vu au parking » servis comme réactions. (7) La météo de la Marmite (quarante lignes), « On nous écrit » (dix lettres), la matrice de couture et les questions ouvertes.

**Ce qu'il ne refait pas.** Les manchettes écrites par les chapitres 10 à 14 (≈ 400, ids `une.pepite.*`, `une.fin.*`, `une.promu.*`, `une.interim.*`, `une.vendre.*`, `une.intouchable.*`, `une.fusion.*`, `une.coupe.*`, `une.geant.*`, `une.fonds.*`, `une.sylvanie.*`, `une.fiasco.*`, `une.generic.sl_*`…) restent telles quelles : ce chapitre les **harmonise** (§ 2.5 : la voix par journal, les doublons, les longueurs) et ne les réécrit pas. Les quarante-quatre manchettes de `content/unes.yaml` sont intouchables. Les vingt-deux Nouvelles datées 1990-2000 planifiées par la spec § 4.5 n'existent pas encore dans `content/` : elles sont écrites ici au gabarit complet, avec les ids que la spec leur donne ; le chapitre 31 les reprend sans les réécrire et complète les anecdotes de monde.

**Conventions propres.** Une manchette est présentée en ligne de tableau avec tous les champs du gabarit § 4.5 dans l'ordre : id · journal · priorité · rôles · condition (en clair, puis en langage du jeu) · titre · sous-titre · brève suggérée · photo · réaction. La longueur des titres est vérifiée avec BRÉHAUT-LEMOINE pour `{NOM}`, SAINT-ÉTOILE pour `{VILLE}`, AS SAINT-ÉTOILE pour `{CLUB}`, OLYMPIQUE LYONNET pour `{RIVAL}`. Une Nouvelle datée porte `year:` et est servie entre `year` et `year + 1` ; un seul bouton, deux libellés, le même effet ; rôles vides = tous. Les ids nouveaux : `une.generic.<mot>` (génériques), `une.<postulat>.<mot>` (instance : `heritage`, `tutelle`, `desert`, `elu`), `co.nv.<annee>_<mot>` (Nouvelles datées), `co.nouvelle.passe_<mot>` (Nouvelles du passé, variantes de `tr.nouvelles_du_passe`), `co.re.camille_parking_<mot>` (Gazette de Camille). Aucun nom réel, aucun fait réel reconnaissable, francs puis écus.

---

## 1. Les journaux et les écrans

### 1.1 Le Quotidien du Ballon (`quotidien`, bleu)

**Ligne.** National, sobre, sérieux, un peu lâche : il attend que la chute soit certaine pour la titrer, puis la titre comme s'il l'avait vue venir. Il tutoie personne, ne rit jamais en Une, rit parfois page six. Il est le journal des présidents qui le lisent pour savoir ce qu'ils ont dit. Fondé en 1946 ; il paraît jusqu'en 2050 (papier jusqu'en 2035, puis « offert par Qatalyst » sur écran).

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

**Plumes.** Pierre Ménèche (chroniqueur, « Hors micro », 1990-2003 ; consultant à Télé-Stade ensuite, il garde une colonne le lundi jusqu'en 2012) · Léa (rédactrice en chef à partir de 2018, la première à mettre une question en Une) · **Ferdinand Bosc** (« Le tableau noir », la tactique : « le 4-2-3-1 n'est pas une idée, c'est un aveu ») · **Odile Marchetti** (« Le carnet » : transferts, naissances, enterrements, dans cet ordre, en corps neuf) · **Anselme Duroy** (« La cote », les cotes du week-end ; c'est chez lui que Ménèche note le pari du promu).

**Rubriques.** « Hors micro » (la chronique, page deux) · « La cote » (page trois) · « Le tableau noir » (page quatre) · « Le carnet » (dernière page) · « L'Almanach du Ballon » (le supplément d'été, mille pages, une ligne par club : c'est la seule fois où les personnages prononcent le mot Almanach).

**Prix.** 4,50 F (1990) · 5 F (1996) · 0,80 écu (2002) · 1,20 écu (2012) · 1,50 écu (2020) · 2 écus (2028) · gratuit, « offert par Qatalyst » (2035-2050).

### 1.2 La Gazette Rose (`gazette`, rose)

**Ligne.** Tabloïd : méchante, drôle, souvent juste. Elle titre sur le coupable avant le fait ; elle achète les SMS ; elle a raison un jour sur deux et le rappelle le jour où elle a raison. Papier rose depuis 1971 (« pour qu'on la voie dans le bus »), tabloïd en 2005, tout en ligne à partir de 2015, payante « dix écus par scandale » en 2032. Personne n'avoue la lire ; tout le monde la découpe.

**Dix règles de style.**
1. Le titre est court, méchant, et contient un chiffre ou une heure quand c'est possible (« 23 H 47, AVEC LA FAUTE »).
2. Le Rosé note les présidents sur vingt, jamais les joueurs, jamais les morts, jamais les trésoriers ; la note est dans le sous-titre, entre deux points.
3. Elle cite le tic d'un personnage pour le retourner contre lui (« il "n'a pas le temps" », avec les guillemets qui grincent).
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
3. Ménèche, consultant, dit « hors micro » sur un micro ouvert : c'est la blague de la chaîne depuis 2003.
4. La zone mixte est un couloir de dix mètres ; on y pose la question qu'on n'a pas le droit de poser au vestiaire.
5. Le bandeau en bas de l'écran a toujours trois mots de plus que l'info.
6. Ozanne, le patron, n'apparaît qu'une fois par carrière, pour dire que « l'audience a toujours raison ».
7. Le tweet de 3 h du matin est lu à l'antenne à 20 h 30, avec la faute.
8. Elle filme le parking quand le vestiaire est fermé ; La Gazette lui achète la photo.
9. Elle n'annonce jamais un licenciement avant le SMS ; elle l'annonce à 23 h 48.
10. Elle offre le plateau à tout entraîneur viré avec des tribunes qui l'aiment encore : c'est la Porte de sortie qui parle.

**Voix.** Nathalie Vence (terrain, puis le Plateau en 2003, directrice de l'info en 2020) · Franck Ozanne (le patron, deux répliques par carrière) · Ménèche (consultant 2003, directeur d'antenne 2012, mémoires 2025) · **Rossard** (l'ancien sélectionneur consultant qui savonne la planche, voix du chapitre 14) · **la voix du bandeau** (personne).

**Radio Tribune** (1988-2031) : la radio des supporters, de 22 h à minuit ; « Les auditeurs ont la parole » ; Gégé y tient une chronique de 2004 à 2011 ; elle ferme en 2031, un mardi, sans le dire. **Le Flux** (2007) puis **Kick** (2024) : personne n'y écrit, tout le monde y parle ; le tweet, le mème, le compte anonyme de Gégé (2020) ; Kick diffuse les matchs en flux avec un fil de commentaires qui défile sur le terrain.

### 1.5 La mise en page décrite pour l'app

La Une du Bilan est un seul gabarit à six emplacements, rendu en interface native (brainstorm 06), déclinée en trois habillages :

| Emplacement | Quotidien | Gazette | Écho |
|---|---|---|---|
| **Masthead** | « LE QUOTIDIEN DU BALLON », capitales condensées bleu nuit sur blanc cassé ; dessous, en corps six : « Fondé en 1946 · Le journal des présidents » | « LA GAZETTE ROSE », capitales grasses noires sur rose ; dessous, en italique : « On dit tout. Surtout ça. » | « L'ÉCHO DE {VILLE} », capitales fines grises sur blanc jauni ; dessous : « Depuis 1902 · Le journal de chez nous » |
| **Date et prix** | « juin {annee+1} · {prix} » à droite du masthead ; le prix suit § 1.1 ; après 2035 : « Offert par Qatalyst » | idem, prix § 1.2 ; après 2015 : « Édition en ligne » ; après 2032 : « 10 écus par scandale » | idem, prix § 1.3 ; après 2040 : « Prix libre » ; après 2045 : « Édition du dimanche » |
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

### 2.1 Les génériques de tous les rôles (vingt-six)

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
| `une.generic.ni_montee` | quotidien | 1 | entraineur, ds, president | après la loi des franchises · `year >= 2041 && world.division == 1` | {VILLE} : NI MONTÉE, NI DESCENTE, NI RIEN | {rang}e, et rien ne change : la loi de 2040 a fermé l'escalier. La Coupe reste le seul suspense. | la Nouvelle `co.nv.2040_franchises` | carte fatale | co.re.gege_decoupe |
| `une.generic.echo_parait` | echo | 2 | tous | les deux dernières saisons du monde · `year >= 2049` | L'ÉCHO PARAÎT ENCORE. {VILLE} AUSSI. | Édition du dimanche, prix libre. {rang}e ; le stagiaire a compté les abonnés : ils sont tous là. | la ligne `bilan_tenu` ou `bilan_manque` | carte fatale | co.re.josiane_a_lu (`!seen`) |
| `une.generic.tableur` | gazette | 2 | ds | masse salariale très haute · `gauges.caisse >= 80` | LE ROI DU MERCATO A UN TABLEUR | {rang}e, et une colonne « ventes » qui déborde. Le coach n'a pas lu le tableur ; le Rosé, si : 15/20. | la ligne d'une vente | carte fatale | co.re.josiane_a_lu (`!seen`) |
| `une.generic.boue` | echo | 1 | president_amateur, joueur_amateur | secours du foot de village · — (sans condition) | BOUE, BUVETTE, BILAN : {VILLE} | {rang}e, objectif {tenu}. La buvette a fait sa saison ; Gérard a compté les bières, pas les points. | la ligne `bilan_tenu` ou `bilan_manque` | carte fatale | — |

### 2.2 Une manchette par trace transversale, lue depuis un autre rôle (quarante)

La charte § 5.2 exige une manchette au moins par trace. Les chapitres 10 à 14 ont écrit celle du rôle qui pose la trace (colonne « Existe déjà ») ; ce chapitre écrit celle du rôle qui la **lit** plus tard, c'est-à-dire la couture inter-rôles imprimée : le joueur qui a vu Mbako vendu par son entraîneur le voit marquer contre lui ; le président qui a hérité du pacte de Gégé se le fait réclamer. Toutes lisent `flag()` pour la trace ancienne **et** `journal_has()` pour ce qui vient de se passer, sauf mention.

| # | Trace | Existe déjà (chapitre) | id nouveau | Journal | Prio | Rôles | Condition (clair · jeu) | Titre | Sous-titre | Brève · Photo · Réaction |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `mbako_vendu` | `une.promu.trente_millions` (yaml) | `une.generic.mbako_contre` | quotidien | 3 | joueur | Mbako, vendu par ton club, joue contre toi · `flag('mbako_vendu') && chars.mbako.statut == 'rival' && journal_has('mbako_contre')` | MBAKO A MARQUÉ CONTRE {VILLE} | Trente millions, une clause, et un but à la 88e sans célébration. Sa mère a applaudi, elle. | la ligne `mbako_contre` (ch. 10) · jp.mbako.contre · co.re.gege_decoupe |
| 2 | `mbako_lance` | `une.promu.mbako_lance` (yaml) | `une.generic.mbako_lanceur` | quotidien | 2 | selectionneur | tu l'as lancé en club, tu le sélectionnes · `flag('mbako_lance') && journal_has('mbako_liste')` | MBAKO EN BLEU, PAR CELUI QUI L'A LANCÉ | Seize ans à {ville}, vingt-deux en cobalt. « Vous m'avez lancé », a-t-il dit ; il l'a dit deux fois. | la ligne `mbako_liste` (ch. 14) · sl.liste.mbako · co.re.vecchio_garde |
| 3 | `mbako_garde` | `une.promu.mbako_garde` (yaml) | `une.generic.option_mbako` | gazette | 2 | ds | l'option Qatalyst levée sur le joueur gardé · `flag('mbako_garde') && journal_has('option_mbako_levee')` | L'OPTION MBAKO, LEVÉE À MINUIT | Gardé une fois, vendu la fois d'après : le fonds avait une ligne pour ça. Le Rosé : 7/20, « pour la lecture ». | la ligne `option_mbako_levee` (ch. 12) · ds.mercato.option · co.re.josiane_a_lu (`!seen`) |
| 4 | `pacte_gege` | `une.promu.pacte` (yaml) | `une.generic.local_reclame` | echo | 2 | president | Gégé réclame au président le local promis par le coach · `flag('pacte_gege') && journal_has('local_reclame')` | LE LOCAL PROMIS À LA CRAIE, RÉCLAMÉ | La date est toujours sur le mur. Gégé l'a montrée au président ; le président a demandé un devis. | la ligne `local_reclame` (ch. 13) · pr.gege.local · co.re.gege_decoupe |
| 5 | `onze_du_virage` | `une.promu.onze_virage` (yaml) | `une.generic.compo_bureau` | gazette | 2 | president | le virage envoie sa compo au président · `flag('onze_du_virage') && journal_has('compo_recue')` | LE PRÉSIDENT A REÇU UNE COMPO | Onze noms à la craie sur une nappe, livrés au bureau. Il « n'a pas le temps » ; il l'a affichée. | la ligne `compo_recue` (ch. 13) · pr.gege.compo · co.re.vecchio_garde |
| 6 | `ami_ultras` | — (drapeau existant) | `une.generic.compte_anonyme` | gazette | 3 | instance | le compte anonyme de Gégé défend le dirigeant · `flag('ami_ultras') && journal_has('gege_compte_anonyme') && year >= 2020` | LE COMPTE ANONYME A UN AMI AU COMITÉ | Douze mille abonnés, aucun nom, une écharpe de profil. Il défend le président de la Fédération ; on se demande depuis quand. | la ligne `gege_compte_anonyme` (ch. 15) · in.opinion.compte · co.re.gege_decoupe |
| 7 | `naming_signe` | `une.promu.arena` (yaml) | `une.generic.canette` | echo | 2 | joueur | tu joues dans un stade qui porte un nom de boisson · `flag('naming_signe') && season >= 1` | {NOM} JOUE DANS UNE CANETTE | Arena Qatalyst, en orange. {rang}e. Le virage dit encore l'ancien nom, et le speaker, le nouveau. | la Nouvelle `co.nouvelle.arena_qatalyst` · carte fatale · co.re.gege_decoupe |
| 8 | `club_actif` | `une.naming.rachat` (ch. 13) | `une.generic.actif_fair_play` | quotidien | 3 | instance | le fair-play financier frappe le club racheté · `flag('club_actif') && journal_has('fair_play_applique')` | LE FAIR-PLAY FRAPPE UN ACTIF | Le club racheté par le fonds est exclu de la Coupe Continentale. Nassir « prend note » ; l'Inspecteur compte. | la ligne `fair_play_applique` (ch. 15) · in.dossier.fair_play · co.re.vialat_recompte |
| 9 | `club_a_lancienne` | `une.promu.lancienne` (yaml) | `une.generic.ancienne_debout` | echo | 2 | president | le club qui a dit non au fonds, vu du bureau · `flag('club_a_lancienne') && bilan.tenu` | À L'ANCIENNE, ET ENCORE DEBOUT | {rang}e, sans fonds, sans naming, sans canette. Le radiateur tousse ; le président aussi, de fierté. | la ligne `bilan_tenu` · carte fatale · co.re.josiane_a_lu (`!seen`) |
| 10 | `nassir_pret` | — | `une.generic.pret_echeance` | quotidien | 2 | ds | le prêt de Qatalyst arrive à échéance · `flag('nassir_pret') && journal_has('pret_echeance')` | LE PRÊT ARRIVE À ÉCHÉANCE. LE DS AUSSI | Vingt millions à rendre en juin, une vente à faire avant. Le coach n'a lu ni le prêt ni le contrat. | la ligne `pret_echeance` (ch. 12) · ds.vendre.pret · co.re.josiane_a_lu (`!seen`) |
| 11 | `gigi_staff` | `une.promu.staff` (yaml), `sl_bus_descendu` (ch. 14) | `une.generic.gants_eleve` | echo | 2 | joueur | Gigi, entraîneur des gardiens, t'entraîne · `flag('gigi_staff') && relation.vecchio >= 1` | LES GANTS DE GIGI ONT UN ÉLÈVE | Quarante-cinq ans, une serviette, un élève qui arrête tout. « J'en ai vu d'autres. Pas celui-là. » | la ligne `palier_plus3` de Vecchio · jp.vecchio.gants · co.re.vecchio_garde |
| 12 | `finale_gigi` | — | `une.generic.finale_buvette` | echo | 2 | president, president_amateur | Gigi raconte sa finale à la buvette des anciens · `flag('finale_gigi') && year >= 2005 && chars.vecchio.statut != 'parti'` | GIGI RACONTE SA FINALE À LA BUVETTE | Chaque dimanche, la même finale, avec un arrêt de plus. Le président a payé la tournée ; c'est dans les comptes. | la ligne `finale_gigi` · pr.buvette.anciens · co.re.vecchio_garde |
| 13 | `vecchio_promis` | `une.promu.gigi_promis` (yaml) | `une.generic.gardien_promis` | gazette | 2 | ds | le DS achète un gardien alors que le coach a promis les buts à Gigi · `flag('vecchio_promis') && journal_has('gardien_recrute')` | UN GARDIEN ACHETÉ, UN GARDIEN PROMIS | Le coach avait promis les buts jusqu'en juin ; le DS a signé un gardien en janvier. Le Rosé : 5/20, « et Gigi, 20 ». | la ligne `gardien_recrute` (ch. 12) · ds.mercato.gardien · co.re.vecchio_garde |
| 14 | `enveloppe_promise` | `une.promu.valise` (yaml) | `une.generic.enveloppe_presidents` | gazette | 3 | president | Malbec te rappelle l'enveloppe, entre présidents · `flag('enveloppe_promise') && journal_has('enveloppe_malbec')` | ENTRE PRÉSIDENTS, UNE ENVELOPPE | « Entre présidents, on se comprend », a dit Malbec en sortant. La Fédération « examine » ; elle examine depuis longtemps. | la ligne `enveloppe_malbec` (ch. 13) · pr.malbec.enveloppe · co.re.malbec_compris |
| 15 | `enveloppe_refusee` | `une.promu.jamais` (ch. 11) | `une.generic.colline_vu` | quotidien | 2 | instance | Colline écrit son rapport sur l'arbitrage, et te regarde autrement · `flag('enveloppe_refusee') && journal_has('rapport_colline')` | COLLINE A VU. IL L'A ÉCRIT. | Le rapport sur l'arbitrage cite un banc qui a dit non, une fois, en 1991. Il ne cite pas le nom ; tout le monde l'a lu. | la ligne `rapport_colline` (ch. 15) · in.arbitrage.rapport · co.re.colline_vu |
| 16 | `flacon_b` | `une.promu.flacon` (ch. 11), `une.pepite.flacon` (ch. 10), `sl_flacon` (ch. 14) | `une.generic.flacon_comite` | gazette | 3 | instance | le flacon B remonte à la commission médicale · `flag('flacon_b') && journal_has('commission_medicale')` | LE FLACON B REMONTE JUSQU'AU COMITÉ | Le Doc a témoigné : « ça reste entre la table et moi », a-t-il dit à la table. La Plume a les documents. | la ligne `commission_medicale` (ch. 15) · in.dossier.antidopage · co.re.amsel_note |
| 17 | `pharmacie_propre` | `une.promu.pharmacie` (ch. 11) | `une.generic.controle_rien` | quotidien | 2 | selectionneur | contrôle inopiné du stage, rien · `flag('pharmacie_propre') && journal_has('controle_inopine')` | CONTRÔLE INOPINÉ : RIEN, ET C'EST UNE UNE | Vingt-six flacons, vingt-six conformes. Rouvier : « Respire. Encore. » Le stage a respiré. | la ligne `controle_inopine` (ch. 15) · sl.stage.controle · co.re.lea_confirme |
| 18 | `salaires_retard` | `une.promu.salaires` (ch. 11) | `une.generic.paie_du_26` | gazette | 3 | joueur | la paie n'est pas tombée le 5 · `journal_has('salaires_retard')` | LA PAIE DU 5 EST TOMBÉE LE 26 | Au distributeur du centre commercial, onze joueurs et un ticket « solde insuffisant ». Le président « n'a pas le temps ». | la ligne `salaires_retard` · jp.distributeur · co.re.camille_journal |
| 19 | `vukic_dauphin` | `une.promu.dauphin` (yaml) | `une.generic.dauphin_ailleurs` | quotidien | 2 | joueur | Vukić, ton ancien adjoint, entraîne un autre club, et te veut · `flag('vukic_dauphin') && chars.vukic.statut == 'rival' && journal_has('vukic_appelle')` | LE DAUPHIN EST ROI AILLEURS | Zoran Vukić a un banc, un cahier, et une offre pour un joueur qu'il « connaît ». Le joueur a lu ; il n'a pas rappelé. | la ligne `vukic_appelle` (ch. 10) · jp.vukic.appel · co.re.vecchio_garde |
| 20 | `clow_ingrat` | `une.promu.clow` (yaml) | `une.generic.diplome_sans_mentor` | quotidien | 2 | joueur | le diplôme passé sans Clow · `flag('clow_ingrat') && journal_has('diplome')` | LE DIPLÔME, SANS LE MENTOR | Lundi, huit heures, sans Brian Clow dans la salle. « Le top un » n'a pas été rappelé ; le fils de Clow non plus. | la ligne `diplome` · jp.diplome.stage · co.re.josiane_a_lu (`!seen`) |
| 21 | `diplome_arrange` | `une.interim.sans_papier` (ch. 11) | `une.generic.derogation_dossier` | quotidien | 3 | instance | Brissac ressort la dérogation arrangée · `flag('diplome_arrange') && journal_has('derogation_attendue')` | UNE DÉROGATION, UN DOSSIER, UN NOM | « Les chiffres sont têtus », dit la DTN, et les dates aussi : six mois sont devenus six ans. Le comité « examine ». | la ligne `derogation_attendue` (ch. 15) · in.commission_technique.derogation · co.re.dauzat_pv |
| 22 | `derby_gagne` / `derby_perdu` | `une.promu.derby`, `derby_perdu` (ch. 11), `une.derby.*` | `une.generic.derby_loge` / `une.generic.derby_loge_perdu` | echo / gazette | 3 / 2 | president | le derby vu de la loge · `journal_has('derby_gagne')` / `journal_has('derby_perdu')` | LA VALLÉE A UN PATRON, ET UNE LOGE / {VILLE} A PERDU LE DERBY DEPUIS LA LOGE | Gagné : le président est descendu au local ; on l'a laissé entrer. · Perdu : le président a regardé le derby derrière une vitre ; la vitre a tenu, dit-on. | la ligne du derby · pr.derby.loge · co.re.gege_decoupe |
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
| 33 | `president_ami` | `sl_point_douze` (ch. 14) | `une.generic.bloc_aulard` | quotidien | 2 | instance | le bloc Aulard vote pour toi au Congrès · `flag('president_ami') && journal_has('pacte_aulard')` | LE BLOC AULARD VOTE POUR LES SIENS | Quarante voix, un empire, « pas le temps ». Le président de la Fédération a été fait par un président de club ; il le sait. | la ligne `pacte_aulard` (ch. 15) · in.congres.bloc · co.re.malbec_compris |
| 34 | `fede_dossier` | — | `une.generic.retrograde_dossier` | quotidien | 4 | president | rétrogradation administrative sur dossier · `flag('fede_dossier') && journal_has('retrograde_admin')` | {CLUB} RÉTROGRADÉ SUR DOSSIER | Pas un point de moins sur le terrain, un étage de moins sur le papier. Le Tribunal du Sport « répondra ». Tard. | la ligne `retrograde_admin` (ch. 13) · pr.commission.retrogradation · co.re.josiane_a_lu (`!seen`) |
| 35 | `vote_achete` | — (ch. 15 en cours) | `une.generic.dix_huit_millions` | gazette | 4 | instance | la trace du vote acheté sort · `journal_has('vote_achete')` | DIX-HUIT MILLIONS DE PAGES | Une montre, un vote, un hôtel au bord d'un lac. La Plume : « J'ai les documents. » Tous. | la ligne `vote_achete` · in.desert.vote · co.re.amsel_note |
| 36 | `mondial_desert` | — (ch. 15) | `une.generic.mondial_decembre` | quotidien | 2 | selectionneur | le Mondial d'hiver, vécu par le sélectionneur · `flag('mondial_desert') && year >= 2022 && year <= 2023` | UN MONDIAL EN DÉCEMBRE, SANS NEIGE | Les clubs ont rendu les joueurs le lundi, cassés. Rouvier a compté les genoux ; ils y sont tous, presque. | la Nouvelle `co.nv.2022_mondial_hiver` · sl.tournoi.annonce · co.re.vence_direct |
| 37 | `ligue_fermee_signee` | `une.ligue.signee` (ch. 13) | `une.generic.douze_sans_maillot` | quotidien | 3 | selectionneur | les joueurs des douze clubs exclus des sélections · `flag('ligue_fermee_signee') && journal_has('douze_exclus')` | LES DOUZE N'AURONT PAS LE MAILLOT BLEU | Le sélectionneur applique la sanction de l'Union : sept titulaires de moins. Montoya : « assis ou debout ? » Debout, sans eux. | la ligne `douze_exclus` (ch. 14) · sl.liste.douze · co.re.lea_confirme |
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
| `une.heritage.legruet` | gazette | 3 | heritage_empoisonne | le dossier Legruet t'arrive · `journal_has('dossier_legruet')` | LE DOSSIER LEGRUET A UN SUCCESSEUR | Vingt ans de Congrès, dix voix d'écart à chaque fois, et une enveloppe par district. « On verra ça après le Congrès. » On a vu. | la ligne `dossier_legruet` · in.heritage.a3_dossier · co.re.josiane_a_lu (`!seen`) |
| `une.heritage.aube` | quotidien | 4 | heritage_empoisonne | perquisition à la Fédération · `journal_has('perquisition')` | SIX HEURES DU MATIN À LA FÉDÉRATION | Des messieurs en imperméable, un chariot, la photocopieuse en marche. Amsel : « Nous avons tout notre temps. » | la ligne `perquisition` · in.heritage.r1_aube · co.re.amsel_note |
| `une.heritage.pacte` | gazette | 2 | heritage_empoisonne | le pacte avec Aulard · `journal_has('pacte_aulard')` | AULARD ET {NOM}, MÊME EMPIRE | Le bloc des présidents vote comme un seul homme ; l'homme « n'a pas le temps ». Le Rosé : 12/20 à l'un, 8 à l'autre. | la ligne `pacte_aulard` · in.congres.bloc · co.re.malbec_compris |
| `une.heritage.reelu` | quotidien | 4 | heritage_empoisonne, sous_tutelle | réélu au Congrès · `journal_has('reelu')` | RÉÉLU{pg, select, f{E} other{}} DE ONZE VOIX | Onze : une de plus que le record de Legruet. Roux a voté « pour la base » ; la base, c'est lui. | la ligne `reelu` · set-piece Congrès · co.re.roux_base |
| `une.heritage.battu` | quotidien | 4 | tous (instance) | battu au Congrès · `journal_has('battu')` | LE CONGRÈS A CHOISI L'AUTRE | Deux cent onze voix contre, une abstention. Dauzat a rangé le procès-verbal avant la fin du dépouillement. | la ligne `battu` · set-piece Congrès · — |
| `une.tutelle.acceptee` | quotidien | 3 | sous_tutelle | la tutelle acceptée · `journal_has('tutelle_acceptee')` | LA FÉDÉRATION SIGNE SOUS TUTELLE | Le comité est dissous, le ministère nomme, le président signe en bas. La FédéMonde « prend note ». | la ligne `tutelle_acceptee` · in.tutelle.a1_decret · co.re.dauzat_pv |
| `une.tutelle.refusee` | quotidien | 3 | sous_tutelle | la tutelle refusée · `journal_has('tutelle_refusee')` | {NOM} A DIT NON AU MINISTRE | Pas de signature, pas de comité, pas de subvention. Les districts ont applaudi ; ils n'ont plus de ballons. | la ligne `tutelle_refusee` · in.tutelle.a1_decret · co.re.roux_base |
| `une.tutelle.suspendu` | gazette | 4 | sous_tutelle | le pays suspendu par la FédéMonde · `journal_has('pays_suspendu')` | LE PAYS SUSPENDU. LE BUREAU AUSSI. | Six mois sans match international, un communiqué en costume bleu. Le Rosé : 0/20, « et c'est généreux ». | la ligne `pays_suspendu` · in.tutelle.a3_fedemonde · co.re.vence_direct |
| `une.tutelle.levee` | echo | 3 | sous_tutelle | la suspension levée · `journal_has('suspension_levee')` | ON REJOUE. LE PAYS A RETROUVÉ SON MAILLOT | Au local de la capitale, on a ressorti les écharpes bleues. Le stagiaire a compté : elles y étaient toutes. | la ligne `suspension_levee` · in.tutelle.r2_levee · co.re.gege_decoupe |
| `une.tutelle.trente_jours` | quotidien | 3 | sous_tutelle | un Congrès convoqué en trente jours · `journal_has('congres_trente_jours')` | UN CONGRÈS EN TRENTE JOURS | Trois cents districts, un gymnase, des chaises pliantes. Josiane a fait les badges à la main ; « j'en ai vu passer ». | la ligne `congres_trente_jours` · in.tutelle.a2_congres · co.re.josiane_a_lu (`!seen`) |
| `une.tutelle.comite` | gazette | 2 | sous_tutelle | le comité nommé par le ministère · `journal_has('comite_du_ministere')` | LE COMITÉ EST NOMMÉ, PAS ÉLU | Sept noms, sept cabinets. Le Rosé les note ensemble : 7/20, « un par personne ». | la ligne `comite_du_ministere` · in.tutelle.a2_comite · co.re.dauzat_pv |
| `une.desert.attribue` | quotidien | 4 | tournoi_desert | le Mondial attribué au désert · `journal_has('mondial_desert')` | LE MONDIAL IRA AU DÉSERT | Douze voix contre dix, un hôtel au bord d'un lac. Nassir : « Ce n'est pas un tournoi, c'est un actif. » | la ligne `mondial_desert` · in.desert.a4_vote · co.re.vence_direct |
| `une.desert.honnete` | quotidien | 4 | tournoi_desert | le Mondial au pays pauvre et honnête · `journal_has('mondial_honnete')` | LE MONDIAL IRA AU PAYS PAUVRE ET HONNÊTE | Dix voix contre douze, dit-on ; c'est l'inverse. Bambini « est choqué » ; les sponsors comptent. | la ligne `mondial_honnete` · in.desert.a4_vote · co.re.lea_confirme |
| `une.desert.montre` | gazette | 3 | tournoi_desert | la montre acceptée · `journal_has('montre_acceptee')` | UNE MONTRE AU POIGNET DU VOTE | Elle donne l'heure de la capitale du désert. « Vu au parking » a vu le poignet. Le Rosé : 3/20. | la ligne `montre_acceptee` · in.desert.a2_montre · co.re.amsel_note |
| `une.desert.rendue` | echo | 2 | tournoi_desert | la montre rendue · `journal_has('montre_rendue')` | LA MONTRE EST RETOURNÉE À L'EXPÉDITEUR | Par courrier recommandé, avec la boîte. Le stagiaire a photographié le reçu ; c'est la photo de Une. | la ligne `montre_rendue` · in.desert.a2_montre · co.re.colline_vu |
| `une.desert.ouvriers_discours` | gazette | 3 | tournoi_desert | le discours sur les ouvriers, sans fonds · `journal_has('ouvriers_discours')` | LE DISCOURS SUR LES OUVRIERS. RIEN D'AUTRE | Quatre minutes, deux larmes, zéro écu. Sacha, dans la salle, n'a pas applaudi. | la ligne `ouvriers_discours` · in.desert.r1_ouvriers · — |
| `une.desert.ouvriers_fonds` | quotidien | 2 | tournoi_desert | un fonds pour les ouvriers · `journal_has('ouvriers_fonds')` | UN FONDS POUR LES OUVRIERS DU CHANTIER | Deux pour cent des droits, versés à une ONG qui compte. L'émirat « prend note » ; il a payé quand même. | la ligne `ouvriers_fonds` · in.desert.r1_ouvriers · co.re.lea_confirme |
| `une.desert.alerte` | quotidien | 4 | tournoi_desert, elu_surprise | tu as tout dit à la procureure · `journal_has('lanceur_alerte')` | {NOM} A TOUT DIT À LA PROCUREURE | Dix-huit millions de pages, dont trois cents à la main. Le comité a voté la suspension de celui qui a parlé. | la ligne `lanceur_alerte` · in.valises.v6_aube · co.re.amsel_note |
| `une.elu.choque` | gazette | 3 | elu_surprise | Bambini « choqué » · `journal_has('bambini_choque')` | BAMBINI « EST CHOQUÉ ». ENCORE. | Troisième fois cette saison. Il l'a dit en costume bleu, devant un sponsor qui partait. Le Rosé : « choqué, 20/20 ». | la ligne `bambini_choque` · in.elu.a1_passation · co.re.vence_direct |
| `une.elu.dauzat_parti` | quotidien | 3 | elu_surprise | Dauzat parti avec les procès-verbaux · `journal_has('dauzat_parti')` | DAUZAT A EMPORTÉ LES PROCÈS-VERBAUX | Trente ans de séances dans quatre valises. « C'est dans le procès-verbal », a-t-il dit ; on ne sait plus lequel. | la ligne `dauzat_parti` · in.elu.a2_dauzat · co.re.josiane_a_lu (`!seen`) |
| `une.elu.dauzat_reste` | gazette | 2 | elu_surprise | Dauzat reste · `journal_has('dauzat_garde')` | DAUZAT RESTE. IL SAIT POURQUOI. | Le secrétaire général a survécu à quatre présidents ; il vient d'en adopter un cinquième. Le Rosé : 14/20, « à lui ». | la ligne `dauzat_garde` · in.elu.a2_dauzat · co.re.dauzat_pv |
| `une.elu.sponsor` | quotidien | 3 | elu_surprise | un sponsor majeur signé · `journal_has('sponsor_majeur_signe')` | UN SPONSOR REVIENT. EN ORANGE. | La boisson fluo sur les panneaux du Mondial ; Nassir « prend note » d'un actif de plus. Les réserves respirent. | la ligne `sponsor_majeur_signe` · in.elu.a3_sponsors · co.re.solvang_compte |
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

### 2.5 Harmonisation des manchettes des chapitres 10 à 14

Ce chapitre a relu les ≈ 400 manchettes livrées par les chapitres de scénarios contre la voix de chaque journal (§ 1) et contre la charte. Il ne les réécrit pas ; il consigne ici ce que le chantier données appliquera à l'import.

1. **La voix.** Une manchette `gazette` porte une note du Rosé ou une source de lieu (« au parking », « dit-on ») ; une `echo` porte un prénom d'ici ou un objet ; une `quotidien` porte une fonction avant un nom. Les rares lignes qui ne le font pas (`une.pepite.rival`, `une.coach.direct`, `une.sylvanie.deux_discours`) reçoivent un mot de plus dans le sous-titre, pas dans le titre.
2. **Les longueurs.** Le test BRÉHAUT-LEMOINE / SAINT-ÉTOILE / AS SAINT-ÉTOILE s'applique ; les titres qui rendent plus de 44 caractères avec `{CLUB}` sont réécrits avec `{VILLE}` (plus court de trois signes) par le chantier données, jamais raccourcis dans leur sens.
3. **Les doublons de sens.** `une.promu.gigi_staff` (ch. 11, trace `gigi_a_parle`) et `une.promu.staff` (yaml, trace `gigi_staff`) coexistent : la première est la promesse, la seconde le fait ; on garde les deux, priorité 2 puis 3. `une.promu.adjoint_parti` (ch. 11) et `une.generic.dauphin_ailleurs` (§ 2.2) ne titrent pas le même rôle. `une.generic.sl_bus_descendu` (ch. 14) et `une.generic.gants_eleve` lisent la même trace dans deux rôles.
4. **Les ids.** Les manchettes de rôle du chapitre 14 (`une.generic.sl_*`) respectent la convention `une.generic.<mot>` avec un filtre `roles:` ; le préfixe `sl_` reste. Le chapitre 10 utilise `une.fin.*` pour le postulat `fin_de_contrat` : ce chapitre nomme ses Unes de fin de carrière `une.generic.fin_*` pour éviter la collision.
5. **`{PAYS}`.** Le chapitre 14 demande un placeholder `{PAYS}` (« LES COBALTS » / « LA SYLVANIE ») ; ce chapitre l'utilise aussi dans deux Nouvelles (§ 3) et le porte en question § 7.
6. **Le drame.** Aucune manchette de chapitre ne titre un mort le jour même ; `une.generic.sl_radio` (ch. 14) est marquée « non applicable si drame mortel » : conforme.
7. **La fraîcheur.** Toutes les manchettes de trace des chapitres lisent `journal_has()` ; les manchettes d'état (`relation`, `gauges`, `season`) tiennent les S2+. Ce chapitre ajoute vingt-six manchettes d'état génériques (§ 2.1) pour que les S5+ de tous les rôles aient une bande 2 non vide.

---
