# FUSIBLE — Bible scénaristique · 30 · Les set-pieces, les alarmes, les face-à-face, les retrouvailles et les fins

> Ce chapitre n'a pas d'intrigue. Il tient les **moments qui reviennent** : l'objectif signé en août, le stade debout un dimanche de mai, le verdict, la jauge qui hurle, le visage qui bascule, le mort qui revient, la plaque qu'on visse sur ton casier. Sept beats, huit rôles, quatre jauges, quarante et un visages, cent douze plaques. Aucune de ces cartes n'appartient à une histoire : elles appartiennent à **toutes**, et c'est pour ça qu'elles lisent les traces des autres. Une set-piece qui ne lit rien est un écran de menu.
>
> Ce que ce chapitre **ne réécrit pas** : les fins de jauge des huit rôles (écrites par 10, 11, 12, 13, 14, 15 ; index en § 5.1), les vingt-trois fins déjà dans `content/endings.yaml` (relues en § 5.6), les scènes de palier des quarante et un personnages (écrites par 01 et 02 ; ce chapitre en tient le moteur, la table de déclenchement et six face-à-face transversaux que les fiches ne pouvaient pas écrire), les temps forts de Grand Match propres à chaque rôle (vingt par chapitre de rôle ; ce chapitre écrit le cadre). Ce qu'il **possède** : les 448 variantes de set-piece, les 64 alarmes, les retrouvailles jouées, les fins universelles, de choix, judiciaires, d'objectif et de fin de vie, les postulats dérivés, les trente Cartes Destin et le piège du centre.

## 0. Le mode d'emploi

**Ordre de priorité des cartes hors sac** (une seule par tirage ; si deux sont dues, celle du haut passe et l'autre glisse d'un tirage, jamais de plus de trois) : `1` la fin (une jauge à 0 ou 100 gagne toujours) · `2` le face-à-face de palier (±3, une fois par carrière et par personnage) · `3` l'alarme de jauge (< 20 ou > 80) · `4` la réaction programmée · `5` la set-piece du créneau · `6` la Carte Destin · `7` les retrouvailles · `8` la Nouvelle datée. Une alarme et un palier du **même personnage** ne se suivent jamais : le palier absorbe l'alarme.

**Les sept beats** (`content/setpieces.yaml`, spec § 1.12 et § 2.7) : `objective`, `gm_annonce`, `gm_te` (cadre ici, contenu dans les chapitres de rôle), `aftermatch`, `cup`, `bilan_verdict`, `bilan_contrat`, `bilan_carrefour`. Mécanique en Dart, texte ici. **Zéro aléa** : la première variante dont le `when` est vrai gagne ; la dernière n'a pas de `when` (le secours doit tenir seul en 1990 comme en 2050).

**Ce que toute variante peut lire** : `season`, `year`, `age`, `world.rang`, `division`, `objective`, `fil_rouge`, `flag('…')`, `relation.<id>`, `enemy('<id>')`, `chars.<id>.statut`, `arc('<id>')`, `plays('<id>')`, `vars.*`, `stats.titres`, `parole`, et — pendant la phase bilan seulement — `bilan.tenu` et `bilan.rang`. Jamais une jauge dans un texte, jamais un chiffre de relation.

**Placeholders** : `{patron}` (le patron du rôle), `{objectif_min}`, `{objectif}`, `{rang}`, `{gm_score}`, `{club}`, `{ville}`, `{rival}`, `{monnaie}`, `{annee}`, `{prenom}`, `{nom}`, `{NOM}`, `{numero}`, `{toi}`. Le nom du joueur au plus une fois par carte et jamais deux beats de suite : dans les listes ci-dessous, une variante sur quatre le porte, jamais deux variantes voisines.

**Les patrons par rôle** : joueur amateur → Dédé · joueur pro → Fardelli · entraîneur → Vaubourg · directeur sportif → Vaubourg, Ilyas après un rachat · président amateur → Madame Aubert, Roux au district · président pro → le Conseil (Ilyas, Malbec ou « les actionnaires ») · sélectionneur → Berthomier, puis qui préside · dirigeant d'instance → le Congrès, Bambini au-dessus.

---

## 1. Les set-pieces

### 1.1 `objective` — l'objectif de saison

**Mécanique** : créneau 1, deux sorties (« Je m'engage » / « Je ne promets rien ») ; s'engager pose `promise` et met la Parole en jeu au Bilan.

#### Joueur amateur (`joueur_amateur`) — patron : Dédé
1. **si** `season == 0` — **DÉDÉ** *(coach bénévole — neutre)* — « Bon, on va pas se mentir : l'objectif c'est de finir devant Montbéliac. Tu es là tous les samedis ou pas ? »
2. **si** `flag('boulot_menace')` — **DÉDÉ** — « Ton patron t'a dit quoi pour les samedis ? On va pas se mentir, je peux pas t'aligner un samedi sur trois. »
3. **si** `relation.dede >= 2` — **DÉDÉ** *(sourire)* — « Cette année je te mets numéro dix et je le dis à personne. On va pas se mentir, ça se mérite. »
4. **si** `flag('essai_pro')` — **BARBIER** *(recruteur, en doudoune)* — « Je l'ai vu jouer sous la pluie, l'an dernier. Cette saison, {toi}, tu joues pour un carnet, pas pour un canton. »
5. **si** `season >= 2 && flag('caid')` — **DÉDÉ** *(noir)* — « Le vestiaire t'appartient, paraît-il. On va pas se mentir : cette saison, l'objectif c'est que tu me rendes le sifflet ou l'équipe. »
6. **si** `year >= 2004 && flag('village_fusion')` — **PICHON** — « Le pain, c'est à cinq heures ; la fusion, c'est en juin. L'objectif, c'est qu'il reste un maillot à nous en septembre. »
7. **si** `relation.dupuis >= 1` — **DUPUIS** *(boucher-sponsor)* — « Le meilleur du cochon, et je pèse mes mots : je paie les maillots si vous montez. Tu montes ? »
8. **secours** — **DÉDÉ** — « Bon, on va pas se mentir : l'objectif c'est {objectif_min}. Tu t'engages, ou tu bosses lundi la tête basse ? »

#### Joueur pro (`joueur`) — patron : Fardelli
1. **si** `season == 0 && fil_rouge == 'prix'` — **FARDELLI** — « Mon ami, l'objectif de l'année c'est ton prix : vingt titularisations et je double la mise. On parle d'argent ou d'amitié ? »
2. **si** `flag('genou')` — **SABATIER** — « L'objectif, cette saison, c'est trente matchs sans piqûre. Ça reste entre la table et moi, {toi}. »
3. **si** `flag('capitaine')` — **BRÉHAUT** — « Le groupe vit bien, et le groupe attend {objectif_min}. Tu portes le brassard, tu portes l'objectif : d'accord ? »
4. **si** `flag('international')` — **BERTHOMIER** *(au téléphone)* — « On verra ça après le Congrès, mais la liste se fait en mars. Vous jouez combien de matchs cette saison ? »
5. **si** `relation.fardelli <= -2` — **FARDELLI** *(noir)* — « Monsieur {nom}, l'objectif c'est que quelqu'un vous veuille en juin. On parle d'argent, là, plus d'amitié. »
6. **si** `season >= 2 && age >= 30` — **VECCHIO** — « À ton âge, l'objectif c'est de finir la saison entier. J'en ai vu d'autres se fixer autre chose. »
7. **si** `flag('exil_propose')` — **ILYAS** — « Ce n'est pas un club, c'est un actif, et tu en es la ligne la plus lisible. Ton objectif est écrit dans mon tableau : tu le signes ? »
8. **secours** — **FARDELLI** — « L'objectif de la saison, mon ami, c'est {objectif_min}. Tu t'engages, ou je vais le dire à quelqu'un d'autre ? »

#### Entraîneur (`entraineur`) — patron : Vaubourg
1. **si** `season >= 1 && flag('descente')` — **VAUBOURG** — « On est descendus, {toi}. Cette saison l'objectif c'est {objectif_min}, et tu paies le chauffage : tu t'engages ? »
2. **si** `flag('vukic_dauphin')` — **VAUBOURG** *(Vukić assis à côté)* — « Cette saison, l'objectif c'est {objectif_min}. Zoran est d'accord ; il l'était avant toi. »
3. **si** `fil_rouge == 'argent'` — **VAUBOURG** — « J'ai pas le temps, j'ai un empire : l'objectif c'est {objectif_min} et un sponsor sur le maillot. Tu signes en bas ? »
4. **si** `flag('pacte_gege')` — **VAUBOURG** *(la Une du local sur le bureau)* — « La tribune a écrit ton objectif à la craie avant moi. Le mien est en dur : {objectif_min}. »
5. **si** `flag('naming_signe')` — **ILYAS** — « Ce n'est pas un club, c'est un actif : l'objectif de l'actif, c'est {objectif_min} et deux jeunes revendables. Vous validez ? »
6. **si** `stats.titres >= 1` — **VAUBOURG** *(sourire)* — « Mon {prenom}, l'objectif c'est de recommencer. Personne ne m'a jamais dit que c'était plus facile. »
7. **si** `relation.aulard <= -2` — **VAUBOURG** *(noir)* — « Monsieur {nom}, l'objectif est écrit dans le contrat, page quatre. J'ai pas le temps de vous le lire. »
8. **secours** — **VAUBOURG** — « Cette saison, l'objectif c'est {objectif_min}. Tu t'engages ? »

#### Directeur sportif (`ds`) — patron : Vaubourg, puis Ilyas
1. **si** `season == 0` — **VAUBOURG** — « L'objectif est dans ton contrat, pas dans le mien : trente millions de ventes. J'ai pas le temps de négocier deux fois. »
2. **si** `flag('club_actif')` — **ILYAS** — « Ce n'est pas un club, c'est un actif : l'objectif, c'est la valeur du portefeuille en juin. Tu signes le tableau ? »
3. **si** `flag('coach_intouchable')` — **VAUBOURG** — « L'objectif c'est {objectif_min}, et l'entraîneur ne se discute pas. Le reste, tu en fais ce que tu veux. »
4. **si** `relation.klopf >= 1 || relation.loco >= 1` — **le coach** *(casquette ou seau)* — « On court, on presse, on chante : moi je veux un latéral gauche. Ton objectif à toi, c'est de me le trouver. »
5. **si** `flag('commission_lettre')` — **VIALAT** — « Je ne juge pas, je compte : votre objectif de saison est une masse salariale sous le seuil. Vous signez la lettre ? »
6. **si** `flag('algorithme_adopte')` — **BARBIER** *(noir)* — « Vous avez un modèle et un objectif chiffré. Moi je l'ai vu jouer sous la pluie ; le modèle, non. »
7. **si** `season >= 2 && flag('dembo_vendu')` — **VAUBOURG** — « L'an dernier tu as vendu l'attaquant et l'affiche. Cette saison, l'objectif c'est de les remplacer sans le dire. »
8. **secours** — **VAUBOURG** — « L'objectif de la saison, c'est {objectif_min}, et un mercato qui ne me réveille pas la nuit. Tu t'engages ? »

#### Président amateur (`president_amateur`) — patron : Aubert
1. **si** `season == 0` — **AUBERT** — « Le stade, c'est de l'argent public, monsieur le président. L'objectif de la mairie, c'est {objectif_min} sans une ligne de plus au budget. »
2. **si** `flag('fusion_proposee')` — **AUBERT** — « Deux clubs, un terrain, une subvention : voilà l'objectif de l'année. Vous préférez les couleurs ou le chauffage ? »
3. **si** `arc('pr.coupe_village') == 'active'` — **PICHON** — « Le pain, c'est à cinq heures ; le tirage, c'est ce soir. L'objectif, cette année, c'est qu'on parle de nous une fois. »
4. **si** `flag('gerard_parti')` — **JOSIANE** — « J'en ai vu passer, des trésoriers. L'objectif de la saison, c'est que la caisse ait un fond en juin. »
5. **si** `relation.roux >= 1` — **ROUX** — « Le district, c'est la base, et la base te regarde. L'objectif : finir la saison sans un match à huis clos. »
6. **si** `relation.dupuis >= 2` — **DUPUIS** — « Le meilleur du cochon, et je pèse mes mots : mon nom dans le dos et la montée. Les deux, hein, pas un des deux. »
7. **si** `season >= 3 && flag('village_uni')` — **DÉDÉ** — « Bon, on va pas se mentir : cette année les gamins restent chez nous. L'objectif c'est qu'aucun ne signe à côté. »
8. **secours** — **AUBERT** — « L'objectif de la saison, c'est {objectif_min}. Vous vous engagez devant le conseil municipal, ou devant moi seulement ? »

#### Président pro (`president`) — patron : le Conseil
1. **si** `season == 0 && flag('geant_dechu')` — **JOSIANE** *(les classeurs dans les bras)* — « J'en ai vu passer, des présidents. Celui d'avant avait promis la remontée ; l'objectif est resté sur le bureau. »
2. **si** `flag('club_actif')` — **ILYAS** — « Ce n'est pas un club, c'est un actif : l'objectif est trimestriel, la Coupe est un bonus. Vous validez le tableau ? »
3. **si** `flag('commission_lettre')` — **VIALAT** — « Je ne juge pas, je compte. Votre objectif de saison est une trésorerie positive au 30 juin ; le classement ne m'intéresse pas. »
4. **si** `relation.gege <= -1` — **GÉGÉ** *(sous les fenêtres du siège)* — « La tribune n'oublie rien, et elle a un objectif : le maillot sans logo et {objectif_min}. On te laisse choisir l'ordre. »
5. **si** `flag('naming_signe')` — **MALBEC** — « Entre présidents, on se comprend : tu as vendu le nom du stade, il te reste à vendre une saison. Objectif {objectif_min} ? »
6. **si** `year >= 2019 && relation.montoya >= 1` — **MONTOYA** — « Quatorze clubs, une table, vous êtes assis ou debout ? L'objectif de votre saison dépend de la réponse. »
7. **si** `stats.titres >= 1 && season >= 3` — **le Conseil** *(voix, sans portrait)* — « Le titre a coûté deux fois le budget du titre. L'objectif de cette saison est un bilan, pas une coupe. »
8. **secours** — **MALBEC** — « Entre présidents, on se comprend : l'objectif c'est {objectif_min}. Tu t'engages devant l'assemblée ou devant moi ? »

#### Sélectionneur (`selectionneur`) — patron : Berthomier
1. **si** `season == 0` — **BERTHOMIER** — « On verra ça après le Congrès, mais l'objectif est écrit : {objectif_min}. Vous vous engagez devant la presse ou devant moi ? »
2. **si** `flag('apres_fiasco')` — **BRISSAC** — « Les chiffres sont têtus, les joueurs aussi : sept joueurs du bus sont encore sélectionnables. L'objectif, c'est qu'ils redescendent. »
3. **si** `flag('mutinerie_matee')` — **FAUVEL** — « On est un groupe, pas une liste, et le groupe veut une qualification. Vous nous la promettez devant nous ? »
4. **si** `year >= 2002 && relation.aubert >= 1` — **AUBERT** *(ministre)* — « Le stade, c'est de l'argent public ; la sélection aussi. L'objectif du ministère, c'est un pays qui se regarde jouer. »
5. **si** `flag('pays_emergent')` — **le ministre** *(voix, sans portrait)* — « Le pays est à quatre-vingt-dix, vous êtes à un. L'objectif, c'est de rentrer avec un match gagné et vingt joueurs vivants. »
6. **si** `relation.legruet <= -2` — **DAUZAT** — « C'est dans le procès-verbal : votre objectif est la qualification, pas le jeu. Le président ne recevra pas. »
7. **si** `flag('mondial_desert')` — **BERTHOMIER** — « Le tournoi se joue en hiver, donc la saison est coupée en deux. L'objectif, lui, n'a pas changé d'un pouce. »
8. **secours** — **BERTHOMIER** — « L'objectif de l'année, c'est {objectif_min}. Cher {prenom}, vous vous engagez ? »

#### Dirigeant d'instance (`instance`) — patron : le Congrès
1. **si** `season == 0` — **DAUZAT** — « C'est dans le procès-verbal : votre programme annonce quatre dossiers. Vous en tenez combien avant le Congrès ? »
2. **si** `flag('heritage_empoisonne')` — **JOSIANE** — « J'en ai vu passer, et celui d'avant est parti par l'escalier de service. L'objectif de l'année, c'est que vous sortiez par la porte. »
3. **si** `flag('vote_achete')` — **BAMBINI** *(sourire)* — « Le football unit le monde, et mes amis. Votre objectif, cher ami, c'est que mes amis restent des amis. »
4. **si** `relation.roux >= 1` — **ROUX** — « Le district, c'est la base : trois cents voix qui veulent un terrain synthétique chacune. L'objectif, c'est d'en promettre cent. »
5. **si** `flag('fede_dossier')` — **AMSEL** — « Nous avons tout notre temps, monsieur le président. Votre objectif de l'année, c'est de savoir où sont vos procès-verbaux. »
6. **si** `year >= 2026 && flag('monde_greve')` — **FAUVEL** *(syndicat)* — « On est un groupe, pas une liste, et le groupe joue soixante-douze matchs. L'objectif, c'est un calendrier ou une grève. »
7. **si** `season >= 3` — **MALBEC** — « Entre présidents, on se comprend : la Campagne commence dans un an. L'objectif de cette année, c'est la suivante. »
8. **secours** — **DAUZAT** — « L'objectif du mandat est consigné : {objectif_min}. Vous confirmez la formulation pour le procès-verbal ? »

### 1.2 `gm_annonce` — l'annonce du Grand Match

**Mécanique** : une annonce avant le temps fort, deux postures (§ 3.1 de la charte) ; le texte ne dit jamais qui va gagner.

#### Joueur amateur
1. **si** `arc('co.derby') == 'active'` — « GRAND MATCH. Montbéliac au bout du canton, le car à treize heures, ton patron t'a dit de rentrer tôt. »
2. **si** `flag('essai_pro')` — « GRAND MATCH. Un type en doudoune est arrivé avec un carnet. Il regarde tout le monde, surtout toi. »
3. **si** `flag('boulot_menace')` — « GRAND MATCH. Tu as posé un jour de congé pour ça. Le contremaître a souri, c'était pas gentil. »
4. **si** `relation.dupuis >= 1` — « GRAND MATCH. Dupuis a fait imprimer des maillots roses avec son nom dans le dos. Le canton entier est venu voir ça. »
5. **si** `year >= 1996 && flag('village_fusion')` — « GRAND MATCH. Le dernier derby avant la fusion : après, ce sera le même maillot. Personne ne veut le perdre. »
6. **si** `age >= 30` — « GRAND MATCH. Tu as mis quarante minutes à t'échauffer. Personne ne l'a dit à voix haute. »
7. **si** `relation.paulette >= 1` — « GRAND MATCH. Mamie Paulette a fait le déplacement en car. Elle était là en cinquante et un, elle le rappelle au chauffeur. »
8. **secours** — « GRAND MATCH. Deux cents personnes autour du terrain et une buvette. Coup d'envoi. »

#### Joueur pro
1. **si** `arc('co.derby') == 'active'` — « GRAND MATCH. Le derby. Gégé a peint la ville, ta sœur habite du mauvais côté. Coup d'envoi. »
2. **si** `flag('genou')` — « GRAND MATCH. Le genou a parlé toute la semaine. Le kiné a dit « respire », le coach a dit « tu joues ». »
3. **si** `flag('mbako_vendu') && chars.mbako.statut == 'vendu'` — « GRAND MATCH. Il est en face, en jaune, et il a dix-neuf ans. Le stade connaît son prénom mieux que le tien. »
4. **si** `flag('special')` — « GRAND MATCH. Tu as dit « le meilleur » en conférence. Quarante mille personnes sont venues vérifier. »
5. **si** `flag('international')` — « GRAND MATCH. Le sélectionneur est dans la tribune de presse, deuxième rang. Il ne prend pas de notes, c'est pire. »
6. **si** `relation.gege <= -2` — « GRAND MATCH. La tribune Nord a préparé quelque chose pour toi. Ce n'est pas un tifo. »
7. **si** `stats.titres >= 1 && season >= 2` — « GRAND MATCH. On te siffle à l'échauffement dans un stade où tu as gagné. C'est la nouveauté de l'année. »
8. **secours** — « GRAND MATCH. Le stade est plein, tout se joue ici. Coup d'envoi. »

#### Entraîneur
1. **si** `arc('co.derby') == 'active'` — « GRAND MATCH. Le derby de la vallée. Gégé a peint la ville, le président a invité le maire. Coup d'envoi. »
2. **si** `flag('onze_du_virage')` — « GRAND MATCH. Le onze est affiché au local depuis mardi. Il est le tien, à deux noms près. »
3. **si** `flag('salaires_retard')` — « GRAND MATCH. La paie du cinq n'est pas tombée. Le vestiaire a fait comme si, jusqu'à l'échauffement. »
4. **si** `flag('mbako_lance')` — « GRAND MATCH. Le gamin est titulaire, il a seize ans et il a demandé le ballon dans le couloir. Coup d'envoi. »
5. **si** `relation.aulard <= -1` — « GRAND MATCH. Le président est en loge avec deux invités que personne ne connaît. Ils regardent ton banc, pas le terrain. »
6. **si** `year >= 2016 && flag('monde_video')` — « GRAND MATCH. La vidéo est branchée, l'écran est au-dessus du kop. On verra tout, deux fois. »
7. **si** `flag('derby_perdu')` — « GRAND MATCH. Le derby de l'aller a laissé une trace de peinture sur le mur du local. Elle n'a pas été effacée. »
8. **secours** — « GRAND MATCH. Le stade est plein, tout se joue ici. Coup d'envoi. »

#### Directeur sportif
1. **si** `flag('dembo_vendu')` — « GRAND MATCH. L'attaquant que tu as vendu joue en face. Le stade a fait deux banderoles : une pour lui, une contre toi. »
2. **si** `flag('fax_rate')` — « GRAND MATCH. Le joueur qui devait tenir ce poste est resté dans un fax. Tu regardes son remplaçant s'échauffer. »
3. **si** `arc('co.derby') == 'active'` — « GRAND MATCH. Le derby, et sept de tes recrues sur la feuille. C'est ton match, en costume, dans une tribune. »
4. **si** `relation.klopf <= -1 || relation.loco <= -1` — « GRAND MATCH. L'entraîneur a changé ta compo idéale sans t'appeler. Tu l'apprends par l'écran. »
5. **si** `flag('algorithme_adopte')` — « GRAND MATCH. Le modèle donne soixante et un pour cent. Barbier regarde la pelouse et dit qu'il pleut. »
6. **si** `flag('mbako_garde')` — « GRAND MATCH. Le prodige que tu n'as pas vendu commence sur le banc. Sa mère est dans la tribune, au premier rang. »
7. **si** `flag('commission_lettre')` — « GRAND MATCH. Deux inspecteurs sont venus voir un match, disent-ils. Ils ont demandé où était la comptabilité. »
8. **secours** — « GRAND MATCH. Le stade est plein, et douze de tes signatures sont sur la feuille. Coup d'envoi. »

#### Président amateur
1. **si** `arc('pr.coupe_village') == 'active'` — « GRAND MATCH. Capitale FC au stade municipal, huit cents habitants, deux mille places. La télévision a demandé où étaient les toilettes. »
2. **si** `flag('fusion_signee')` — « GRAND MATCH. Premier match sous le maillot fusionné. Les deux moitiés du village sont dans deux virages différents. »
3. **si** `relation.aubert <= -1` — « GRAND MATCH. Le maire est venu quand même. Elle a garé sa voiture devant l'entrée des joueurs. »
4. **si** `flag('gerard_parti')` — « GRAND MATCH. La buvette est tenue par deux cousins et une caisse en carton. Ça marche mieux qu'avant. »
5. **si** `relation.dupuis >= 2` — « GRAND MATCH. Dupuis a offert deux cents merguez et veut son nom au micro trois fois. Il compte. »
6. **si** `year >= 2000 && flag('terrain_rugby')` — « GRAND MATCH. Le terrain a servi au rugby samedi. Les lignes se croisent, l'arbitre a soupiré. »
7. **si** `relation.paulette >= 1` — « GRAND MATCH. Mamie Paulette a sa chaise pliante à la même place depuis cinquante et un. Elle a prévu une couverture. »
8. **secours** — « GRAND MATCH. Le village est autour du terrain, la buvette est prête. Coup d'envoi. »

#### Président pro
1. **si** `arc('co.derby') == 'active'` — « GRAND MATCH. Le derby, et le maire dans ta loge. Tu as deux discours de mi-temps, comme d'habitude. »
2. **si** `flag('naming_signe')` — « GRAND MATCH. Première affiche sous le nouveau nom du stade. Le kop a bâché la lettre du sponsor. »
3. **si** `relation.gege <= -2` — « GRAND MATCH. La tribune Nord entre à la vingtième minute, en silence, dos au terrain. Elle a prévenu la presse avant toi. »
4. **si** `flag('coach_vire') && season >= 1` — « GRAND MATCH. Le coach que tu as viré est sur le banc d'en face. Il a salué la loge, longuement. »
5. **si** `flag('ligue_fermee_signee')` — « GRAND MATCH. Le derby n'existe plus au calendrier, mais il reste ce soir. Le stade sonne un peu creux. »
6. **si** `flag('commission_lettre')` — « GRAND MATCH. La Commission a écrit jeudi. Tu regardes le match en pensant à une phrase de la lettre. »
7. **si** `stats.titres >= 1` — « GRAND MATCH. On joue pour confirmer, ce qui n'a jamais fait chanter personne. Le stade est plein quand même. »
8. **secours** — « GRAND MATCH. Le stade est plein, la loge aussi. Coup d'envoi. »

#### Sélectionneur
1. **si** `vars.tournoi_tour >= 3` — « GRAND MATCH. Demi-finale. Le pays a posé un jour de congé sans le demander à personne. Coup d'envoi. »
2. **si** `flag('bus_descendu')` — « GRAND MATCH. Le bus est descendu à l'heure, en silence, un par un. Gigi est descendu le premier. »
3. **si** `flag('hymne_impose')` — « GRAND MATCH. Vingt-six bouches et un hymne. Les caméras ne regardent que celles qui ne bougent pas. »
4. **si** `flag('binational_bloque')` — « GRAND MATCH. En face, un joueur que tu n'as pas appelé porte l'autre maillot. Il a serré la main de tout le monde sauf une. »
5. **si** `relation.fauvel >= 2` — « GRAND MATCH. Le capitaine a parlé douze secondes dans le vestiaire. Personne n'a rien ajouté. »
6. **si** `flag('mondial_desert')` — « GRAND MATCH. Quarante degrés dehors, dix-huit dans le stade, un match en décembre. Le corps ne comprend rien. »
7. **si** `relation.legruet <= -2` — « GRAND MATCH. Le président de la Fédération est assis à côté de ton successeur possible. Ils ne parlent pas de toi. »
8. **secours** — « GRAND MATCH. Un pays entier regarde. Coup d'envoi. »

#### Dirigeant d'instance
1. **si** `flag('mondial_desert')` — « GRAND MATCH. Finale du tournoi que tu as attribué. La tribune officielle est pleine de gens qui n'aiment pas le football. »
2. **si** `flag('video_adoptee')` — « GRAND MATCH. La vidéo arbitre sa première finale. Trois cents millions de personnes regardent un écran regarder un écran. »
3. **si** `flag('vote_achete')` — « GRAND MATCH. Deux journalistes te cherchent dans les couloirs. Ils ne veulent pas parler du match. »
4. **si** `relation.bambini <= -1` — « GRAND MATCH. Ta place est au deuxième rang de la tribune officielle. Personne n'a rien dit, c'est le plan de table. »
5. **si** `year >= 2026 && flag('monde_greve')` — « GRAND MATCH. Les joueurs ont accepté de jouer ce match-là. Ils l'ont écrit dans un communiqué, avec une virgule pour toi. »
6. **si** `flag('reforme_votee')` — « GRAND MATCH. Premier match du format que tu as fait voter. Il vaudrait mieux qu'il soit bon. »
7. **si** `relation.colline >= 1` — « GRAND MATCH. L'arbitre que tu as nommé siffle la finale. Il a dit « j'ai vu » et il a raccroché. »
8. **secours** — « GRAND MATCH. La finale. Tu remets le trophée dans quatre-vingt-dix minutes. Coup d'envoi. »

### 1.3 `gm_te` — le cadre du temps fort

Le contenu des temps forts appartient aux chapitres de rôle (vingt chacun) ; ce chapitre écrit le **cadre** commun, servi avant le premier temps fort de chaque Grand Match, et les trois libellés de risque, seule information chiffrée du jeu (§ 6.1.7).

1. **si** `vars.gm_te_index == 1` — « Le match bascule ici. Trois façons de faire, une seule qui te ressemble. » — libellés : **SÛR** · **ÉQUILIBRÉ** · **RISQUÉ**
2. **si** `vars.gm_te_index == 2 && vars.gm_won == 0` — « On mène, il reste une heure, et tout le monde regarde ton banc. »
3. **si** `vars.gm_te_index == 2 && vars.gm_won == -1` — « On est mené. Le stade s'est tu d'un coup, comme on ferme un robinet. »
4. **si** `vars.gm_te_index == 3` — « Dernier quart d'heure. Ce que tu décides maintenant, on le racontera en juin. »
5. **si** `flag('genou')` — « Ton corps a une opinion sur la suite. Elle n'est pas dans le plan. »
6. **si** `relation.colline >= 1` — « L'arbitre passe près de toi et dit deux mots : « j'ai vu ». Rien d'autre. »
7. **si** `flag('finale_gigi')` — « Le vieux gardien s'avance de trois mètres. Il n'a pas demandé la permission. »
8. **secours** — « Le match se décide dans les cinq prochaines minutes. Choisis. »

### 1.4 `aftermatch` — l'après-match

#### Joueur amateur
1. **si** `vars.gm_won == 1 && relation.dede >= 1` — **DÉDÉ** *(sourire)* — « Bon, on va pas se mentir : t'as été bon. Troisième mi-temps, et tu paies rien. »
2. **si** `vars.gm_won == 1 && flag('essai_pro')` — **BARBIER** — « Je l'ai vu jouer sous la pluie, celui-là, et là je l'ai vu jouer tout court. Tu as un stylo ? »
3. **si** `vars.gm_won == -1 && flag('boulot_menace')` — **le contremaître** *(voix, sans portrait)* — « Vous avez perdu, et vous êtes en retard lundi. Les deux se voient sur votre figure. »
4. **si** `vars.gm_won == -1 && relation.dede <= -1` — **DÉDÉ** *(noir)* — « On va pas se mentir : le {numero} a joué pour lui. Douche, et on en reparle jeudi. »
5. **si** `vars.gm_won == 0` — **GÉRARD** — « Ici, on payait en bières, et un nul c'est une bière quand même. Tu la bois ou tu rentres ? »
6. **si** `relation.dupuis >= 1 && vars.gm_won == 1` — **DUPUIS** — « Le meilleur du cochon, et je pèse mes mots : ce soir c'est saucisses pour tout le monde. Tu passes au comptoir ? »
7. **si** `age >= 32` — **VECCHIO** — « J'en ai vu d'autres finir sur les rotules. Assieds-toi avant de faire semblant de ranger tes crampons. »
8. **secours** — **DÉDÉ** — « Bon, on va pas se mentir : c'est fait. On se dit quoi pour samedi ? »

#### Joueur pro
1. **si** `vars.gm_won == 1 && flag('capitaine')` — **BRÉHAUT** — « Le groupe vit bien ce soir. Tu parles au vestiaire ou tu les laisses crier ? »
2. **si** `vars.gm_won == 1 && flag('special')` — **VENCE** — « On est en direct : vous aviez dit que vous étiez le meilleur. Vous confirmez, ou vous corrigez ? »
3. **si** `vars.gm_won == -1 && relation.gege <= -1` — **GÉGÉ** *(devant le parking)* — « La tribune n'oublie rien, et elle a compté tes courses. Tu descends nous parler ou tu montes dans la voiture ? »
4. **si** `vars.gm_won == -1 && flag('genou')` — **ROUVIER** — « Respire. Encore. Maintenant dis-moi ce que tu as senti à la soixantième, et pas ce que tu veux que j'entende. »
5. **si** `vars.gm_won == 1 && relation.fardelli >= 1` — **FARDELLI** — « Mon ami, ça, ça vaut deux millions de plus. On parle d'argent ou d'amitié, ce soir ? »
6. **si** `vars.gm_won == 0 && flag('mbako_vendu')` — **MASSENET** — « Juste une question, hors micro : le gamin en face vous a coûté un point. Vous en pensez quoi, vraiment ? »
7. **si** `vars.gm_won == -1 && flag('international')` — **BERTHOMIER** *(dans le couloir)* — « On verra ça après le Congrès. La liste, elle, se fait sur des soirs comme celui-là. »
8. **secours** — **VUKIĆ** — « Je te le dis parce que personne ne te le dira : ce match, tu l'as joué à moitié. On regarde la vidéo demain ? »

#### Entraîneur
1. **si** `vars.gm_won == 1 && flag('finale_gigi')` — « Score final {gm_score}. Gigi a gardé le ballon sous le bras. Il en a vu d'autres, pas celui-là. »
2. **si** `vars.gm_won == 1 && flag('pacte_gege')` — **GÉGÉ** — « La tribune n'oublie rien : ton nom a été chanté quatre fois. Le local, il est toujours à rénover ? »
3. **si** `vars.gm_won == -1 && arc('co.derby') == 'active'` — **MASSENET** — « Juste une question, hors micro : on perd un derby avec ce onze-là, ou avec ce coach-là ? »
4. **si** `vars.gm_won == -1 && flag('salaires_retard')` — **BRÉHAUT** — « Le groupe vit bien, mais le groupe n'a pas été payé le cinq. Tu leur dis quelque chose ou je le dis ? »
5. **si** `vars.gm_won == 1 && relation.aulard <= -1` — **VAUBOURG** *(dans le couloir, sans s'arrêter)* — « J'ai pas le temps, j'ai un empire. Bravo, hein. »
6. **si** `vars.gm_won == -1 && flag('mbako_lance')` — **la mère de Mbako** — « Mon fils n'a besoin de personne, mais il a besoin de jouer quatre-vingt-dix minutes. Vous l'avez sorti à la soixantième. »
7. **si** `vars.gm_won == 0 && flag('onze_du_virage')` — **VUKIĆ** — « Je te le dis parce que personne ne te le dira : ce onze-là n'est pas le tien. Tu le sais depuis mardi. »
8. **secours** — « Le match est terminé. Il faut parler au groupe. »

#### Directeur sportif
1. **si** `vars.gm_won == 1 && flag('algorithme_adopte')` — **BARBIER** — « Je l'ai vu jouer sous la pluie et le modèle l'avait mis quatorzième. Tu écris ça dans le rapport ? »
2. **si** `vars.gm_won == -1 && relation.klopf <= -1` — **VOGLER** *(en conférence, sans te regarder)* — « On court, on presse, on chante ; il manque un latéral gauche depuis juillet. Ce n'est pas moi qui achète. »
3. **si** `vars.gm_won == -1 && flag('dembo_vendu')` — **GÉGÉ** — « La tribune n'oublie rien : elle a compté les buts de celui que tu as vendu. Trois, ce soir. »
4. **si** `vars.gm_won == 1 && relation.aulard >= 1` — **VAUBOURG** — « Mon {prenom}, tu as acheté un joueur à trois millions qui en vaut douze. Tu me trouves le suivant quand ? »
5. **si** `vars.gm_won == 1 && flag('mbako_garde')` — **la mère de Mbako** — « Mon fils n'a besoin de personne, mais son contrat expire en juin. On parle maintenant ou après la douche ? »
6. **si** `vars.gm_won == -1 && flag('commission_lettre')` — **VIALAT** — « Je ne juge pas, je compte : deux défaites et une masse salariale. Ce sont trois chiffres, monsieur. »
7. **si** `vars.gm_won == 0 && relation.brehaut >= 1` — **BRÉHAUT** — « Le groupe vit bien, mais il joue à dix contre onze au milieu. Tu le vois d'en haut, toi ? »
8. **secours** — **JOSIANE** — « J'en ai vu passer, des soirs comme celui-là. Le rapport, vous le voulez ce soir ou demain matin ? »

#### Président amateur
1. **si** `vars.gm_won == 1 && arc('pr.coupe_village') == 'active'` — **LÉA** — « Vous confirmez ? Le village a battu une équipe qui a un bus climatisé. Une phrase pour L'Écho ? »
2. **si** `vars.gm_won == 1` — **GÉRARD** — « Ici, on payait en bières, et là on a vidé le fût. La caisse est pleine et je ne sais pas quoi en faire. »
3. **si** `vars.gm_won == -1 && relation.aubert <= -1` — **AUBERT** — « Le stade, c'est de l'argent public, et il a coûté cher ce soir. Vous passerez me voir lundi. »
4. **si** `vars.gm_won == -1 && flag('fusion_signee')` — **DÉDÉ** — « Bon, on va pas se mentir : les gars de l'autre village se sont pas fait de passes. Tu leur parles ou j'y vais ? »
5. **si** `vars.gm_won == 1 && relation.dupuis >= 1` — **DUPUIS** — « Le meilleur du cochon, et je pèse mes mots : mon nom a été prononcé deux fois. J'en avais payé trois. »
6. **si** `vars.gm_won == 0 && relation.paulette >= 1` — **PAULETTE** — « J'étais là en cinquante et un, et on jouait plus vite. Tu me ramènes ou je prends le car ? »
7. **si** `vars.gm_won == -1 && flag('gerard_parti')` — **JOSIANE** — « J'en ai vu passer, des défaites, et des trésoriers aussi. La buvette a fait cent vingt {monnaie} ce soir. »
8. **secours** — **DÉDÉ** — « Bon, on va pas se mentir : c'est fini. On range les buts ou on boit d'abord ? »

#### Président pro
1. **si** `vars.gm_won == 1 && relation.gege >= 1` — **GÉGÉ** *(sous la loge)* — « La tribune n'oublie rien : ce soir, elle t'a chanté. Les abonnements à cinq {monnaie}, tu y penses ? »
2. **si** `vars.gm_won == -1 && flag('coach_vire')` — **MASSENET** — « Juste une question, hors micro : vous en changez combien par saison, avant de vous poser la question ? »
3. **si** `vars.gm_won == -1 && relation.gege <= -2` — **GÉGÉ** *(noir)* — « La tribune n'oublie rien, et elle a ton adresse. On se voit en bas du siège demain. »
4. **si** `vars.gm_won == 1 && flag('club_actif')` — **ILYAS** — « Ce n'est pas un club, c'est un actif, et l'actif a pris quatre points de valeur ce soir. Vous avez vu la courbe ? »
5. **si** `vars.gm_won == 1 && relation.aubert >= 1` — **AUBERT** — « Le stade, c'est de l'argent public, et ce soir il était plein. Vous me devez une inauguration. »
6. **si** `vars.gm_won == -1 && flag('naming_signe')` — **le sponsor** *(voix, sans portrait)* — « Notre nom est sur le fronton et sur les images de la défaite. Nous aimerions parler du contrat. »
7. **si** `vars.gm_won == 0 && relation.brehaut >= 1` — **BRÉHAUT** *(DS)* — « Le groupe vit bien, l'effectif non. Tu me donnes deux minutes maintenant, ou lundi devant tout le monde ? »
8. **secours** — **JOSIANE** — « J'en ai vu passer, des présidents, après des matchs comme ça. Vous descendez au vestiaire ou vous restez en loge ? »

#### Sélectionneur
1. **si** `vars.gm_won == 1 && vars.tournoi_tour >= 3` — **VENCE** — « On est en direct, et le pays ne dort pas. Une phrase pour ceux qui ne vous croyaient pas ? »
2. **si** `vars.gm_won == -1 && vars.tournoi_tour >= 2` — **VENCE** — « On est en direct : c'est terminé. Vous voulez dire quelque chose à quelqu'un ? »
3. **si** `vars.gm_won == -1 && flag('bus_menace')` — **FAUVEL** — « On est un groupe, pas une liste, et le groupe veut parler ce soir. Pas demain, ce soir. »
4. **si** `vars.gm_won == 1 && flag('hymne_impose')` — **MASSENET** — « Juste une question, hors micro : ils ont chanté parce que vous l'avez demandé, ou parce qu'ils avaient envie ? »
5. **si** `vars.gm_won == -1 && relation.legruet <= -1` — **BERTHOMIER** — « On verra ça après le Congrès. Le Congrès est dans onze jours, madame/monsieur {nom}. »
6. **si** `vars.gm_won == 1 && relation.vecchio >= 1` — **VECCHIO** — « J'en ai vu d'autres, des soirs pareils, mais jamais du bon côté. Merci, coach. »
7. **si** `vars.gm_won == 0 && flag('binational_bloque')` — **la mère de Mbako** — « Mon fils n'a besoin de personne, et l'autre fédération appelle tous les mois. Vous avez perdu un point et un joueur. »
8. **secours** — **FAUVEL** — « On est un groupe, pas une liste. Vous venez au vestiaire, ou on vous attend dans l'avion ? »

#### Dirigeant d'instance
1. **si** `vars.gm_won == 1 && flag('video_adoptee')` — **COLLINE** — « J'ai vu. La machine aussi, deux minutes plus tard. Vous voulez mon rapport ce soir ? »
2. **si** `flag('mondial_desert')` — **BAMBINI** — « Le football unit le monde, et mes amis. Vous montez remettre le trophée à côté de moi, cher ami ? »
3. **si** `flag('vote_achete')` — **LA PLUME** *(par écrit)* — « J'ai les documents, et une photo de la tribune officielle. Vous voulez commenter avant demain six heures ? »
4. **si** `relation.amsel <= -1` — **AMSEL** — « Nous avons tout notre temps. Profitez de la finale, elle sera dans le dossier comme le reste. »
5. **si** `year >= 2027 && flag('arbitre_machine')` — **COLLINE** — « J'ai vu, mais ce n'est plus mon avis qui compte. Vous m'expliquerez à quoi je sers, un jour. »
6. **si** `relation.fauvel >= 1` — **FAUVEL** — « On est un groupe, pas une liste, et le groupe a joué gratuitement ce soir. Les primes, c'est quand ? »
7. **si** `relation.bambini <= -2` — **BAMBINI** *(noir)* — « Le football unit le monde. Il ne nous unira pas, vous et moi, monsieur. »
8. **secours** — **DAUZAT** — « C'est dans le procès-verbal : la finale s'est bien tenue. Vous signez la feuille de présence ? »

### 1.5 `cup` — le tour de Coupe

#### Joueur amateur
1. **si** `flag('coupe_tirage_grand')` — « Tour de Coupe. Le tirage sort un club de D2 et un car de quarante places. Le canton veut venir. »
2. **si** `flag('boulot_menace')` — « Tour de Coupe. Le match est un mercredi à quinze heures. Ton patron a un avis très clair. »
3. **si** `relation.dupuis >= 1` — « Tour de Coupe. Dupuis a promis un cochon entier si vous passez. Il a montré le cochon. »
4. **si** `age <= 21` — « Tour de Coupe. Il paraît qu'un recruteur suit ce tour-là. Tout le monde te l'a dit, personne ne l'a vu. »
5. **si** `flag('village_fusion')` — « Tour de Coupe. On joue contre le club voisin, celui avec qui on fusionne l'an prochain. C'est demain, et c'est bizarre. »
6. **si** `relation.dede <= -1` — « Tour de Coupe. Tu es sur la feuille en dix-septième position. Il y a seize places sur la feuille. »
7. **si** `year >= 1995` — « Tour de Coupe. La télévision régionale envoie une caméra et un stagiaire. Le stagiaire cherche une prise de courant. »
8. **secours** — « Tour de Coupe. Le tirage t'offre un adversaire surprise. On y va ? »

#### Joueur pro
1. **si** `flag('vitamines') || flag('flacon_b')` — « Tour de Coupe. Un contrôleur attend à l'accueil avec une mallette. Le tirage t'offre un adversaire surprise. »
2. **si** `flag('genou')` — « Tour de Coupe. Terrain gras, District, cinq degrés. Le staff te demande si tu veux vraiment jouer ça. »
3. **si** `division <= 1` — « Tour de Coupe. Un stade municipal, huit cents personnes derrière une main courante, et ton maillot qui vaut leur budget. »
4. **si** `flag('special')` — « Tour de Coupe. Le président du petit club a fait afficher ta phrase sur la buvette. En grand. »
5. **si** `flag('capitaine')` — « Tour de Coupe. Le vestiaire a décidé que c'était un match de jeunes. Tu es sur la feuille quand même. »
6. **si** `relation.fardelli >= 1` — « Tour de Coupe. Ton agent trouve que c'est un match à risque pour rien. Il l'a dit à un journaliste avant de te le dire. »
7. **si** `year >= 2016 && flag('monde_video')` — « Tour de Coupe. Pas de vidéo à ce tour-là : l'arbitre est seul, et il le sait. »
8. **secours** — « Tour de Coupe. Le tirage t'offre un adversaire surprise. On y va ? »

#### Entraîneur
1. **si** `flag('vitamines') || flag('flacon_b')` — « Tour de Coupe. Un contrôleur attend à l'accueil. Le tirage t'offre un adversaire surprise. On y va ? »
2. **si** `flag('espion_retour')` — « Tour de Coupe. L'adversaire a taillé sa haie. Il a laissé un mot dedans, à ton nom. »
3. **si** `flag('salaires_retard')` — « Tour de Coupe. La prime de qualification tomberait avant la paie du cinq. Le vestiaire a fait le calcul avant toi. »
4. **si** `relation.aulard <= -1` — « Tour de Coupe. Le président a dit à la radio que la Coupe « n'est pas la priorité ». Le vestiaire écoute la radio. »
5. **si** `flag('mbako_lance')` — « Tour de Coupe. Le gamin veut jouer ce match-là et l'a dit à sa mère. Sa mère l'a dit à un journaliste. »
6. **si** `flag('pacte_gege')` — « Tour de Coupe. Le local a affrété deux cars pour un match à cinq heures de route. Personne ne leur a demandé. »
7. **si** `season >= 2 && stats.titres == 0` — « Tour de Coupe. C'est la dernière chose que tu peux encore gagner cette saison. Tout le monde le sait, personne ne le dit. »
8. **secours** — « Tour de Coupe. Le tirage t'offre un adversaire surprise. On y va ? »

#### Directeur sportif
1. **si** `flag('fax_rate')` — « Tour de Coupe. Le joueur resté dans le fax joue en face, et il commence. On te l'a signalé par SMS. »
2. **si** `flag('commission_occulte')` — « Tour de Coupe. Un intermédiaire du club adverse veut « parler après le match ». Il a ton numéro, tu ne sais pas comment. »
3. **si** `flag('algorithme_adopte')` — « Tour de Coupe. Le modèle donne quatre-vingt-douze pour cent et ne connaît pas le terrain. Barbier a pris ses bottes. »
4. **si** `relation.barbier >= 2` — « Tour de Coupe. Barbier a vu jouer leur numéro huit sous la pluie. Il te propose de venir avec un carnet. »
5. **si** `division <= 1` — « Tour de Coupe. Le club adverse a demandé si tes joueurs signaient des autographes avant ou après. »
6. **si** `flag('coach_demission')` — « Tour de Coupe. L'entraîneur a mis toute la réserve sur la feuille. Il ne t'a pas prévenu, exprès. »
7. **si** `relation.solvang >= 1` — « Tour de Coupe. Ingrid a trois clients en face, tous en fin de contrat. Elle sera derrière le but, avec un carnet. »
8. **secours** — « Tour de Coupe. Le tirage t'offre un adversaire surprise, et douze de tes signatures sur la feuille. »

#### Président amateur
1. **si** `flag('coupe_tirage_grand')` — « Tour de Coupe. Un club de D1 au stade municipal. La recette d'un match couvre trois saisons de chauffage. »
2. **si** `relation.aubert <= -1` — « Tour de Coupe. La mairie exige une commission de sécurité avant d'ouvrir le stade. Elle se réunit dans onze jours. »
3. **si** `flag('gerard_parti')` — « Tour de Coupe. La buvette d'un jour de Coupe, c'est un an de budget. Il faut quelqu'un pour tenir la caisse. »
4. **si** `relation.dupuis >= 1` — « Tour de Coupe. Dupuis veut son nom sur le maillot du match télévisé. Il a apporté un chèque et un rouleau de scotch. »
5. **si** `flag('terrain_rugby')` — « Tour de Coupe. Le club de rugby joue le même dimanche sur le même terrain. Il faut que quelqu'un cède. »
6. **si** `relation.roux >= 1` — « Tour de Coupe. Le district propose un arbitre de ligue et deux délégués. Roux viendra « voir la base ». »
7. **si** `year >= 2007 && flag('monde_flux')` — « Tour de Coupe. Une vidéo du terrain enneigé a fait le tour du pays. Trois cents personnes de plus veulent venir. »
8. **secours** — « Tour de Coupe. Le tirage t'offre un adversaire surprise, et une buvette à remplir. »

#### Président pro
1. **si** `division <= 1` — « Tour de Coupe. Un stade municipal, pas de loge, pas de parking, et une caméra sur un échafaudage. »
2. **si** `flag('commission_lettre')` — « Tour de Coupe. La recette d'un beau parcours ferait taire la Commission un mois. Un mois, pas deux. »
3. **si** `flag('naming_signe')` — « Tour de Coupe. Le sponsor veut son nom sur le maillot du tour télévisé. Le règlement dit non, il propose de payer le non. »
4. **si** `relation.gege >= 1` — « Tour de Coupe. Le local a payé un car et un tifo pour un seizième de finale. Ils ont demandé deux cents places à un {monnaie}. »
5. **si** `flag('coach_vire') && season >= 1` — « Tour de Coupe. C'est le premier match du nouvel entraîneur. La presse a déjà écrit les deux versions. »
6. **si** `flag('ligue_fermee_signee')` — « Tour de Coupe. Le club adverse a refusé le protocole d'accueil « pour raisons sportives ». C'est écrit en une ligne. »
7. **si** `relation.aubert >= 1` — « Tour de Coupe. La maire veut le coup d'envoi et la photo. Elle a apporté son écharpe et un photographe. »
8. **secours** — « Tour de Coupe. Le tirage t'offre un adversaire surprise. On y va ? »

#### Sélectionneur *(la Coupe devient le match amical / le barrage)*
1. **si** `vars.fenetre == 'mars'` — « Fenêtre de mars. Un amical à l'étranger, deux blessés déjà annoncés par leurs clubs. On y va ? »
2. **si** `flag('pays_emergent')` — « Match de qualification. Terrain à deux mille mètres, vestiaire sans eau chaude, un ministre dans le car. »
3. **si** `flag('binational_bloque')` — « Amical. L'autre fédération a programmé son match le même jour, exprès. Deux téléphones sonnent dans le vestiaire. »
4. **si** `relation.aubert >= 1 && year >= 2002` — « Amical de gala. La ministre veut descendre au vestiaire avant le coup d'envoi. Elle a prévenu la presse, pas toi. »
5. **si** `flag('charters_coupes')` — « Déplacement. Vol de ligne avec escale, dix-neuf heures de voyage, un match le lendemain. La Fédération a compté. »
6. **si** `flag('mutinerie_matee')` — « Amical. Les deux clans ont demandé des chambres séparées. L'hôtel a un étage de trop, ça tombe bien. »
7. **si** `relation.klopf <= -1` — « Amical contre la Vestrie. Vogler a annoncé qu'il ferait courir les siens quatre-vingt-dix minutes, « pour voir ». »
8. **secours** — « Match de la fenêtre. Vingt-six joueurs, trois jours, un stade à moitié plein. On y va ? »

#### Dirigeant d'instance *(la Coupe devient le dossier de la session)*
1. **si** `vars.dossier == 'video'` — « Session. Le dossier de la vidéo est sur la table, deux confédérations pour, deux contre. Il faut trancher aujourd'hui. »
2. **si** `vars.dossier == 'calendrier'` — « Session. Les clubs veulent moins de dates, les fédérations en veulent plus. Les joueurs ne sont pas invités. »
3. **si** `vars.dossier == 'attribution'` — « Session. Deux candidatures : un pays riche et suspect, un pays pauvre et honnête. Le vote est à main levée. »
4. **si** `vars.dossier == 'primes' && year >= 2016` — « Session. L'égalité des primes entre les deux sélections est à l'ordre du jour, point onze. Il y a douze points. »
5. **si** `flag('fede_dossier')` — « Session. Un dossier te concerne, il est en « divers ». Personne ne regarde personne. »
6. **si** `year >= 2026 && flag('monde_greve')` — « Session extraordinaire. Le syndicat des joueurs a envoyé une lettre de onze lignes. La onzième est une date. »
7. **si** `relation.montoya >= 1` — « Session. Les quatorze clubs demandent une place à la table. Ils ont apporté leur propre table. »
8. **secours** — « Session. Un dossier, quatre confédérations, une heure de retard. On ouvre ? »

### 1.6 `bilan_verdict` — le verdict

Lit `bilan.tenu` et `bilan.rang` (valides seulement pendant la phase bilan ; jamais `flag('bilan_tenu')`, jamais `world.rang_final`). Le verdict est un texte de **narrateur**, pas une réplique : il s'écrit en trois familles — les cinq rôles de club partagent une liste, le sélectionneur et le dirigeant d'instance ont la leur — soit huit variantes servies à chacun des huit rôles.

#### Tous rôles de club (joueur amateur, joueur, entraîneur, DS, présidents)
1. **si** `bilan.tenu && bilan.rang <= 3` — « Le verdict tombe : {rang}e. Le président a fait imprimer la photo de famille. Tu es dessus, au bord. »
2. **si** `bilan.tenu && flag('promise')` — « Le verdict tombe : {rang}e. {objectif} : tenu. La promesse d'août tient encore debout, à une semaine près. »
3. **si** `bilan.tenu` — « Le verdict tombe : {rang}e. {objectif} : tenu. Josiane a déjà rangé le dossier sous les autres. »
4. **si** `!bilan.tenu && bilan.rang >= 17` — « Le verdict tombe : {rang}e. Le mot « descente » est écrit en petit, en bas de la lettre. »
5. **si** `!bilan.tenu && flag('salaires_retard')` — « Le verdict tombe : {rang}e. Les salaires de mai ne sont pas tombés non plus. Deux lignes dans le même courrier. »
6. **si** `!bilan.tenu && flag('promise')` — « Le verdict tombe : {rang}e. La Gazette a ressorti la phrase d'août, avec la date. »
7. **si** `!bilan.tenu && bilan.rang <= 6` — « Le verdict tombe : {rang}e. À un point de ce qu'on t'avait demandé. On a refait la photo sans toi. »
8. **secours** — « Le verdict de la saison tombe. Objectif : {objectif}. »

#### Sélectionneur
1. **si** `bilan.tenu && vars.tournoi_tour >= 4` — « Le verdict tombe : le pays a gagné. Le trophée passe de main en main ; il finira chez quelqu'un qui n'a pas joué. »
2. **si** `bilan.tenu && vars.tournoi_tour >= 3` — « Le verdict tombe : demi-finale. Le pays dit « on y était presque » et le pense, cette fois. »
3. **si** `bilan.tenu` — « Le verdict tombe : qualifiés. La Fédération a préparé une conférence et deux communiqués. Un seul servira. »
4. **si** `!bilan.tenu && flag('bus_menace')` — « Le verdict tombe : éliminés. La photo du bus est déjà en Une, prise par quelqu'un du bus. »
5. **si** `!bilan.tenu && flag('hymne_impose')` — « Le verdict tombe : éliminés. On reparle des bouches fermées pendant l'hymne, pas des occasions manquées. »
6. **si** `!bilan.tenu && relation.legruet <= -1` — « Le verdict tombe : éliminés. Le président de la Fédération a fait savoir qu'il « verra ça après le Congrès ». »
7. **si** `!bilan.tenu` — « Le verdict tombe : le pays regardera le tournoi à la télévision. Toi aussi, dans une autre langue. »
8. **secours** — « Le verdict de l'année tombe. Objectif : {objectif}. »

#### Dirigeant d'instance
1. **si** `bilan.tenu && flag('reforme_votee')` — « Le verdict tombe : la réforme est votée. Elle portera le nom de la commission, pas le tien. »
2. **si** `bilan.tenu && flag('vote_achete')` — « Le verdict tombe : quatre dossiers sur quatre. Deux journalistes demandent comment, pas combien. »
3. **si** `bilan.tenu` — « Le verdict tombe : le Congrès valide l'exercice. Trois cents mains se lèvent, deux restent baissées. »
4. **si** `!bilan.tenu && flag('fede_dossier')` — « Le verdict tombe : deux dossiers enterrés, et un ouvert sur toi. Le procès-verbal fait quarante pages. »
5. **si** `!bilan.tenu && relation.bambini <= -1` — « Le verdict tombe : rejeté. Le patron de la FédéMonde « est choqué », et il l'a dit avant le vote. »
6. **si** `!bilan.tenu && relation.roux <= -1` — « Le verdict tombe : les districts ont voté contre. La base ne t'a pas trouvé assez souvent dans la base. »
7. **si** `!bilan.tenu` — « Le verdict tombe : ta grande réforme est rejetée. Elle sera votée dans dix ans, sous un autre nom. »
8. **secours** — « Le verdict de l'exercice tombe. Objectif : {objectif}. »

### 1.7 `bilan_contrat` — on continue ou pas

#### Joueur amateur
1. **si** `bilan.tenu && relation.dede >= 2` — **DÉDÉ** — « Bon, on va pas se mentir : sans toi on descend. Tu resignes ta licence ou tu vas voir ailleurs ? »
2. **si** `flag('essai_pro')` — **BARBIER** — « Je l'ai vu jouer sous la pluie, et je le redis en juin. Tu montes à Valdorne lundi, ou tu restes au canton ? »
3. **si** `flag('boulot_menace')` — **CAMILLE** — « Tu rentres à quelle heure, en fait, l'an prochain ? Le club ou le contrat, il faut choisir avant août. »
4. **si** `!bilan.tenu && relation.dede <= -1` — **DÉDÉ** *(noir)* — « On va pas se mentir : j'ai deux gamins à ton poste. Tu veux quel numéro, l'an prochain ? »
5. **si** `age >= 30` — **VECCHIO** — « J'en ai vu d'autres arrêter à ton âge et le regretter à quarante. Tu reprends une licence ou pas ? »
6. **si** `relation.dupuis >= 2` — **DUPUIS** — « Le meilleur du cochon, et je pèse mes mots : je t'embauche à la boucherie et tu joues le samedi. Ça t'irait ? »
7. **si** `flag('village_fusion')` — **PICHON** — « Le pain, c'est à cinq heures ; le club fusionne à la Saint-Jean. Tu signes chez eux ou chez nous ? »
8. **secours** — **DÉDÉ** — « Bon, on va pas se mentir : on continue ensemble, ou tu tentes autre chose ? »

#### Joueur pro
1. **si** `bilan.tenu && relation.fardelli >= 1` — **FARDELLI** — « Mon ami, trois clubs appellent et le tien traîne. On parle d'argent ou d'amitié, cette fois ? »
2. **si** `flag('genou') && age >= 30` — **SABATIER** — « Ça reste entre la table et moi : une saison de plus, ça se paie en cartilage. Tu signes quand même ? »
3. **si** `flag('capitaine') && bilan.tenu` — **VAUBOURG** — « Mon {prenom}, je prolonge le brassard, pas le salaire. Tu signes où, comme d'habitude ? »
4. **si** `flag('exil_propose')` — **ILYAS** — « Ce n'est pas un club, c'est un actif, et vous êtes une ligne qui vieillit bien. Vous venez au soleil ? »
5. **si** `!bilan.tenu && relation.vukic <= -1` — **VUKIĆ** — « Je te le dis parce que personne ne te le dira : tu n'es plus dans mes plans. Tu cherches, ou tu attends ? »
6. **si** `flag('diplome')` — **VUKIĆ** — « Tes jambes parlent, et tu as le papier. Tu joues une saison de plus, ou tu prends la réserve ? »
7. **si** `flag('petition_portee')` — **BRÉHAUT** — « Le groupe a signé pour toi et le président l'a reçue par fax. Tu veux qu'on remette une couche ? »
8. **secours** — **FARDELLI** — « On continue l'aventure, mon ami, ou on tente autre chose ailleurs ? »

#### Entraîneur
1. **si** `relation.aulard <= -1` — **VAUBOURG** — « On continue, ou je te fais un chèque ? Je ne le date pas. »
2. **si** `stats.titres >= 1 && season == vars.titre_saison` — **VAUBOURG** — « Champion. Je te prolonge sans lire ; tu signes où ? »
3. **si** `flag('vukic_dauphin')` — **VAUBOURG** *(Vukić dans le couloir)* — « On continue un an, avec Zoran comme adjoint. Il a déjà dit oui, lui. »
4. **si** `flag('otage_kop')` — **VAUBOURG** — « J'ai pas le temps, j'ai un empire, et la tribune a un entraîneur. Lequel des deux je prolonge ? »
5. **si** `!bilan.tenu && flag('promise')` — **MASSENET** — « Juste une question, hors micro : vous aviez promis en août. On prolonge la promesse ou l'homme ? »
6. **si** `relation.malbec >= 1` — **MALBEC** — « Entre présidents, on se comprend : le mien a un banc libre et un budget. Tu écoutes ou tu resignes ici ? »
7. **si** `flag('clow_ingrat')` — **JOSIANE** — « J'en ai vu passer, et le vieux monsieur qui vous a formé n'a pas eu de coup de fil. Vous prolongez quoi, au juste ? »
8. **secours** — **VAUBOURG** — « On continue l'aventure, ou tu tentes autre chose ? »

#### Directeur sportif
1. **si** `bilan.tenu && flag('roi_mercato')` — **VAUBOURG** — « Mon {prenom}, tu as vendu trente millions et acheté trois bons. Tu restes, et tu recommences. »
2. **si** `flag('coach_demission')` — **VAUBOURG** — « L'entraîneur part, toi tu restes ; ou l'inverse. Je n'ai pas le temps de garder les deux. »
3. **si** `flag('commission_lettre')` — **VIALAT** — « Je ne juge pas, je compte : votre nom est en bas de douze contrats impayables. Vous les portez encore un an ? »
4. **si** `relation.nassir >= 1 && flag('club_actif')` — **ILYAS** — « Ce n'est pas un club, c'est un actif, et vous êtes son directeur des achats. Trois ans, avec conditions ? »
5. **si** `flag('commission_occulte')` — **FARDELLI** — « Mon ami, on a fait de belles choses ensemble et il en reste une à finir. Tu prolonges, ou je vais voir ton successeur ? »
6. **si** `!bilan.tenu && relation.brehaut <= -1` — **BRÉHAUT** — « Le groupe vit bien, le staff non. Tu prolonges avec eux, ou tu leur laisses la place ? »
7. **si** `relation.solvang >= 2` — **SOLVANG** — « Mon client décide, moi je compte : un club vous veut, et je représente son entraîneur. Vous écoutez ? »
8. **secours** — **VAUBOURG** — « On continue l'aventure, ou tu tentes autre chose ? »

#### Président amateur
1. **si** `bilan.tenu && relation.aubert >= 1` — **AUBERT** — « Le stade, c'est de l'argent public, et vous l'avez bien dépensé. Vous reprenez un mandat ? »
2. **si** `flag('gerard_parti')` — **JOSIANE** — « J'en ai vu passer, des trésoriers en fuite, et des présidents après. Vous restez ou vous rendez les clés ? »
3. **si** `flag('fusion_signee')` — **PICHON** — « Le pain, c'est à cinq heures ; la présidence du club fusionné, c'est à deux. Vous en voulez la moitié ? »
4. **si** `relation.roux >= 2` — **ROUX** — « Le district, c'est la base, et la base te propose un siège. Tu gardes le club aussi, ou tu montes ? »
5. **si** `!bilan.tenu && relation.dupuis <= -1` — **DUPUIS** — « Le meilleur du cochon, et je pèse mes mots : mon nom n'est plus sur ce maillot l'an prochain. Vous financez comment ? »
6. **si** `age >= 70` — **DÉDÉ** — « Bon, on va pas se mentir : t'as l'âge de regarder depuis la buvette. Tu passes la main ou pas ? »
7. **si** `flag('village_uni')` — **PAULETTE** — « J'étais là en cinquante et un, et j'ai vu quatre présidents partir fâchés. Tu ne pars pas fâché, toi, hein ? »
8. **secours** — **AUBERT** — « Vous repartez pour une saison, ou vous rendez le club à quelqu'un d'autre ? »

#### Président pro
1. **si** `bilan.tenu && stats.titres >= 1` — **MALBEC** — « Entre présidents, on se comprend : tu es champion, donc tu es un problème. La Ligue te veut à sa table. »
2. **si** `flag('commission_lettre')` — **VIALAT** — « Je ne juge pas, je compte : deux exercices négatifs. Vous signez le plan de retour à l'équilibre, ou nous le signons pour vous ? »
3. **si** `flag('club_actif')` — **ILYAS** — « Ce n'est pas un club, c'est un actif. Vous en restez le visage, ou nous en changeons ? »
4. **si** `relation.gege <= -2` — **GÉGÉ** — « La tribune n'oublie rien, et elle a mis une date sur la banderole. Tu restes jusqu'à cette date ? »
5. **si** `relation.montoya >= 1 && year >= 2019` — **MONTOYA** — « Quatorze clubs, une table, vous êtes assis ou debout ? La réponse vaut pour votre mandat aussi. »
6. **si** `flag('ecoutes')` — **AMSEL** — « Nous avons tout notre temps, et vous non. Vous restez président pendant l'instruction ? »
7. **si** `!bilan.tenu && flag('coach_vire')` — **MASSENET** — « Juste une question, hors micro : vous avez changé d'entraîneur deux fois. Qui change de président ? »
8. **secours** — **le Conseil** *(voix)* — « Le mandat arrive à son terme. Vous le reprenez, ou nous ouvrons la porte ? »

#### Sélectionneur
1. **si** `bilan.tenu && vars.tournoi_tour >= 4` — **BERTHOMIER** — « Cher {prenom}, on ne remercie pas un champion. On lui demande de recommencer. »
2. **si** `!bilan.tenu && relation.legruet <= -1` — **DAUZAT** — « C'est dans le procès-verbal : votre contrat expire à minuit. Le président vous appellera, sûrement. »
3. **si** `flag('mutinerie_matee')` — **FAUVEL** — « On est un groupe, pas une liste, et le groupe a demandé que vous restiez. Vous restez ? »
4. **si** `relation.aubert >= 2 && year >= 2002` — **AUBERT** — « Le stade, c'est de l'argent public, le ministère aussi, et il a un bureau libre. Vous continuez, ou vous montez ? »
5. **si** `flag('selection_refusee')` — **BRISSAC** — « Les chiffres sont têtus, les joueurs aussi : trois ont dit non cette année. Vous repartez avec les mêmes ? »
6. **si** `relation.malbec >= 1` — **MALBEC** — « Entre présidents, on se comprend : revenez au quotidien, un vrai banc, un vrai vestiaire. Vous y pensez ? »
7. **si** `age >= 62` — **VECCHIO** *(entraîneur des gardiens)* — « J'en ai vu d'autres partir un an trop tard. Vous partez, ou vous faites comme eux ? »
8. **secours** — **BERTHOMIER** — « On continue, cher {prenom}, ou on verra ça après le Congrès ? »

#### Dirigeant d'instance
1. **si** `season % 4 == 3` — **DAUZAT** — « C'est dans le procès-verbal : la Campagne s'ouvre lundi. Quatre promesses, quatre confédérations, un vote. »
2. **si** `flag('vote_achete')` — **BAMBINI** — « Le football unit le monde, et mes amis. Mes amis voudraient savoir si vous vous représentez. »
3. **si** `flag('fede_dossier')` — **AMSEL** — « Nous avons tout notre temps. Vous vous représentez, ou vous préférez que nous nous rencontrions plus tôt ? »
4. **si** `relation.roux >= 2` — **ROUX** — « Le district, c'est la base, et la base a une motion prête à votre nom. Vous la laissez déposer ? »
5. **si** `relation.malbec <= -1` — **MALBEC** — « Entre présidents, on se comprend : j'ai deux cents voix et un candidat. Vous vous retirez avant, ou après ? »
6. **si** `age >= 75 && year >= 2026` — **DAUZAT** — « C'est dans le procès-verbal : la limite d'âge est de soixante-quinze ans. Vous demandez la dérogation ? »
7. **si** `bilan.tenu && relation.bambini >= 2` — **BAMBINI** — « Le football unit le monde. Vous, vous unissez les votes, cher ami. On monte d'un étage ? »
8. **secours** — **DAUZAT** — « Le mandat continue, ou vous laissez le siège ? Je note la réponse. »

### 1.8 `bilan_carrefour` — la porte

Une variante avec `transition:` remplace le libellé de `roles.yaml → transitions.label` quand son `when` est vrai **et** que la transition est éligible (§ 6, Cartes Destin). Sinon, texte de respiration. Le Carrefour est le seul beat **transversal par construction** : ses huit variantes nomment chacune un rôle d'arrivée, et couvrent donc les huit rôles de départ.

#### Toutes familles — les huit variantes transversales
1. **si** `flag('diplome')` — `transition: entraineur` — **VUKIĆ** — « Tu as le papier, {prenom}. La réserve n'a pas d'entraîneur ; tu passes de l'autre côté ? »
2. **si** `flag('capitaine') && age >= 30 && relation.aulard >= 1` — `transition: ds` — **VAUBOURG** — « Reste, mais en costume. J'ai pas le temps de former quelqu'un d'autre à mes défauts. »
3. **si** `flag('legende')` — `transition: selectionneur` — **BERTHOMIER** — « On verra ça après le Congrès, et le Congrès c'est demain. Vous prenez les Cobalts ? »
4. **si** `flag('ascension') && division >= 3` — `transition: president` — **LÉA** — « Vous confirmez ? Le village est en D2 et vous êtes toujours président. On écrit quoi, exactement ? »
5. **si** `direction <= 25 && plays('porte_de_sortie') == 0` — **CAMILLE** — « Tu vois le mur arriver, et moi je le vois depuis mars. Tu pars avant, ou tu attends la lettre ? »
6. **si** `flag('vukic_dauphin') && relation.vukic <= -1` — **VUKIĆ** — « Je te le dis parce que personne ne te le dira : ils m'ont proposé ta place. Je n'ai pas encore répondu. »
7. **si** `age >= 60 && stats.titres >= 2` — **PAULETTE** — « J'étais là en cinquante et un, et j'ai vu partir les meilleurs trop tard. Tu veux finir comment, toi ? »
8. **secours** — « L'été passe. Le téléphone sonne une fois, deux fois, puis plus. On repart. »

---

## 2. Les alarmes de jauge

**Mécanique** (`content/alarms.yaml`) : quand une jauge franchit **20 vers le bas** ou **80 vers le haut**, une carte portée par un personnage entre dans les trois tirages suivants. Ordre du fichier = préférence ; une alarme ne se répète pas dans la saison ; deux alarmes du même personnage ne se suivent jamais. Jamais de drame, jamais de `end:` : une main courante, pas une chute. Une sortie soulage la jauge, l'autre la creuse en payant ailleurs — aucune n'est la bonne.

**Trois porteurs par rôle et par jauge** : le canonique, la variante quand il est absent ou muet, la variante tardive (S2+ ou trace posée). Les alarmes de l'**entraîneur** et du **joueur pro** existent (18 cartes) : on ne les réécrit pas, on leur ajoute le **troisième porteur**. Les six autres rôles sont écrits en entier.

**`alarm_override` par postulat** : un postulat peut remplacer le porteur d'une jauge par le sien (`promu` : CAISSE bas → Josiane et le chauffage ; `interimaire` : DIRECTION bas → Vaubourg et les six semaines ; `coupe_du_village` : CAISSE haut → la recette du Petit Poucet ; `apres_fiasco` : VESTIAIRE bas → les deux clans ; `tournoi_desert` : TRIBUNES bas → La Plume ; `section_feminine` : CAISSE bas → la ligue régionale). Le chapitre du postulat écrit la carte, ce chapitre garantit qu'il y a toujours un secours.

### 2.1 Joueur amateur (`am.`)

| Jauge | Porteur 1 | Porteur 2 | Porteur 3 |
|---|---|---|---|
| Les copains (vestiaire) | Vecchio (le vieux gardien) | Dédé | un coéquipier sans portrait |
| Le bistrot (tribunes) | Gérard | Dupuis | Paulette |
| Le coach (direction) | Dédé | Barbier | Pichon |
| Le porte-monnaie (caisse) | Pichon | Camille | Gérard |

**`am.alarme.vestiaire_bas_vieux`** · vestiaire < 20 · **VECCHIO** *(gardien de 50 ans — neutre)* — « J'en ai vu d'autres se faire oublier au toro. Tu paies la tournée jeudi, ou tu joues seul jusqu'en mai ? »
← **Je paie la tournée** — vestiaire ++, caisse − — *Onze bières, deux excuses, un vestiaire qui te reparle.* · → **Je joue pour moi** — vestiaire −, force + — *Tu marques. Personne ne vient te chercher.*
**`am.alarme.vestiaire_haut_dede`** · vestiaire > 80 · **DÉDÉ** *(coach — noir)* — « Bon, on va pas se mentir : c'est toi qui fais la compo dans les vestiaires. Tu me rends le sifflet ou tu la fermes ? »
← **Je me tais** — vestiaire −, direction ++ — *Il refait la compo devant tout le monde. La tienne.* · → **Je dis ce que je pense** — vestiaire +, direction −− — *Le vestiaire applaudit. Le coach note un nom sur son papier.*
**`am.alarme.tribunes_bas_gerard`** · tribunes < 20 · **GÉRARD** *(buvette)* — « Ici, on payait en bières, et là on ne te sert plus la tienne. Tu viens t'expliquer au comptoir ou tu rentres par-derrière ? »
← **Je vais au comptoir** — tribunes ++, caisse − — *Deux heures debout, quatre versions du match, une paix.* · → **Je rentre par-derrière** — tribunes −, vestiaire + — *La porte de derrière grince. Tout le monde l'entend.*
**`am.alarme.tribunes_haut_dupuis`** · tribunes > 80 · **DUPUIS** *(boucher-sponsor — sourire)* — « Le meilleur du cochon, et je pèse mes mots : tu signes des maillots au lieu de courir. Tu t'entraînes mardi ? »
← **Je viens mardi** — tribunes −, direction ++ — *Tu arrives le premier. Personne ne te photographie.* · → **Je fais la photo** — tribunes +, vestiaire −− — *Le canton t'adore. Le vestiaire compte les absences.*
**`am.alarme.direction_bas_dede`** · direction < 20 · **DÉDÉ** — « On va pas se mentir : tu es dix-septième sur une feuille de seize. Tu viens t'entraîner deux fois ou tu regardes ? »
← **Deux entraînements** — direction ++, caisse − — *Le boulot attendra. Le sifflet a noté.* · → **Je regarde** — direction −, tribunes + — *Le banc est froid, la buvette est chaude.*
**`am.alarme.direction_haut_barbier`** · direction > 80 · **BARBIER** *(doudoune)* — « Je l'ai vu jouer sous la pluie, et le coach ne voit plus que lui. Un chouchou, ça ne dure que le temps d'un coach. »
← **Je reste le chouchou** — direction +, vestiaire −− — *Le onze est écrit avant l'échauffement.* · → **Je prends du recul** — direction −, vestiaire ++ — *Tu portes les ballons. Le vestiaire te reparle.*
**`am.alarme.caisse_bas_pichon`** · caisse < 20 · **PICHON** *(président-boulanger)* — « Le pain, c'est à cinq heures ; ta licence, c'est cent cinquante {monnaie}. Tu la paies ou je la mets sur l'ardoise du club ? »
← **Je paie ma licence** — caisse −, direction ++ — *Il écrit ton nom au stylo, pas au crayon.* · → **Mets-la sur l'ardoise** — caisse +, tribunes − — *L'ardoise se voit de la buvette.*
**`am.alarme.caisse_haut_gerard`** · caisse > 80 · **GÉRARD** — « Ici, on payait en bières, mais toi tu as une enveloppe tous les mois. La ligue régionale, elle compte aussi. »
← **Je rends l'enveloppe** — caisse −−, direction + — *Elle repart dans la boîte en fer. Personne n'a rien vu.* · → **Je garde tout** — caisse +, tribunes − — *Le club voisin le sait déjà. Il paie mieux.*

### 2.2 Joueur pro (`jp.`) — troisièmes porteurs

| Jauge | Porteur 1 ∃ | Porteur 2 ∃ | **Porteur 3 (nouveau)** |
|---|---|---|---|
| Vestiaire | Bréhaut (bas et haut) | Vecchio | **Dembo** |
| Tribunes | Gégé (bas) | Léa (haut) | **Paulette** |
| Le club | Vukić (bas et haut) | Vaubourg | **Josiane** |
| Compte | Fardelli (bas et haut) | Solvang | **Camille** |

**`jp.alarme.vestiaire_bas_dembo`** · vestiaire < 20 · `when: relation.brehaut == 0` · **DEMBO** *(avant-centre — noir)* — « Donne-moi le ballon, je m'occupe du reste : c'est ce que tu ne fais jamais. Tu joues avec nous jeudi ou tout seul ? »
← **Je joue pour l'équipe** — vestiaire ++, force − — *Deux passes en retrait. Il marque et te montre du doigt.* · → **Je continue comme ça** — vestiaire −, tribunes + — *Tu marques encore. Le toro se fait sans toi.*
**`jp.alarme.tribunes_bas_paulette`** · tribunes < 20 · **PAULETTE** *(place 14B)* — « J'étais là en cinquante et un, et je ne siffle jamais. Là, j'ai envie, et ça m'embête beaucoup. »
← **Je viens la voir** — tribunes ++ — *Elle te donne un bonbon et ton année de naissance.* · → **Je fais mon match** — tribunes −, vestiaire + — *Elle range son écharpe à la mi-temps.*
**`jp.alarme.direction_haut_josiane`** · direction > 80 · **JOSIANE** — « J'en ai vu passer, des chouchous du bureau. Le prochain coach lira le dossier avant de vous voir jouer. »
← **Je prends mes distances** — direction −, vestiaire ++ — *Tu déjeunes au vestiaire. Le bureau le remarque.* · → **Je reste au chaud** — direction +, tribunes − — *Le bureau te trouve parfait. Le vestiaire trouve ça drôle.*
**`jp.alarme.caisse_haut_camille`** · caisse > 80 · `when: !flag('divorce')` · **CAMILLE** — « Tu rentres à quelle heure ? La maison est payée, la deuxième aussi, et ton cousin a une idée. »
← **Pas d'idée de cousin** — caisse −, relation.camille +1 — *Le cousin est vexé. Le compte reste lisible.* · → **J'écoute le cousin** — caisse +, set: offshore — *Une société avec un joli nom et une adresse loin.*

### 2.3 Entraîneur (`en.`) — troisièmes porteurs

| Jauge | Porteur 1 ∃ | Porteur 2 ∃ | **Porteur 3 (nouveau)** |
|---|---|---|---|
| Vestiaire | Vukić / Vecchio | Bréhaut (haut) | **Rouvier** |
| Tribunes | Gégé (bas et haut) | Vukić (haut) | **Massenet** |
| Le président | Josiane (bas) / Vaubourg (haut) | Malbec | **Camille** |
| Le budget | Josiane (bas) / Massenet (haut) | Ilyas | **Vialat** |

**`en.alarme.vestiaire_bas_rouvier`** · vestiaire < 20 · **ROUVIER** *(kiné)* — « Respire. Encore. Ils sont quatre sur ma table qui n'ont rien, et ils y restent une heure. »
← **Je vais les voir** — vestiaire ++, direction − — *Tu t'assois par terre dans la salle de soins. Ça dure deux heures.* · → **Je durcis** — vestiaire −, force + — *La table se vide. L'infirmerie aussi, officiellement.*
**`en.alarme.tribunes_haut_meneche`** · tribunes > 80 · **MASSENET** — « Juste une question, hors micro : quand le kop compose votre équipe, vous signez ou vous applaudissez ? »
← **Je recadre publiquement** — tribunes −−, direction ++ — *Tu le dis en conférence, une phrase, sans nom.* · → **Je laisse dire** — tribunes +, direction − — *Le président lit l'article et le pose sur la pile.*
**`en.alarme.direction_bas_camille`** · direction < 20 · `when: !flag('divorce')` · **CAMILLE** — « Tu rentres à quelle heure ? Un journaliste a appelé ici pour savoir si tu cherchais un appartement ailleurs. »
← **Je rentre ce soir** — direction +, vestiaire − — *Tu manges à table. Le téléphone reste dans la veste.* · → **Je reste au club** — direction −, force + — *Tu dors au centre. Le gardien te connaît par ton prénom.*
**`en.alarme.caisse_haut_vialat`** · caisse > 80 · **VIALAT** — « Je ne juge pas, je compte : votre budget a doublé, la recette non. La Commission écrit à ceux qui doublent. »
← **Je rends deux recrues** — caisse −−, vestiaire − — *Deux valises repartent. Le vestiaire compte les absents.* · → **Je dépense tout** — caisse +, direction −, set: commission_lettre — *La lettre arrive un mardi, avec accusé de réception.*

### 2.4 Directeur sportif (`ds.`)

| Jauge | Porteur 1 | Porteur 2 | Porteur 3 |
|---|---|---|---|
| Le staff (vestiaire) | l'entraîneur (Vogler ou Vaz) | Bréhaut (capitaine) | Barbier |
| Tribunes | Gégé | Massenet | Vence |
| Le président (direction) | Vaubourg | Ilyas | le beau-frère du président |
| Masse salariale (caisse) | Vialat | Fardelli | Josiane |

**`ds.alarme.vestiaire_bas_coach`** · vestiaire < 20 · **VOGLER** *(ou Vaz — noir)* — « On court, on presse, on chante, et on joue avec les joueurs que je n'ai pas demandés. Vous venez au vestiaire l'expliquer ? »
← **Je descends l'expliquer** — vestiaire ++, direction − — *Tu parles quatre minutes. Personne ne te coupe.* · → **C'est mon travail** — vestiaire −, caisse + — *Il le redit en conférence, avec le sourire.*
**`ds.alarme.vestiaire_haut_capitaine`** · vestiaire > 80 · **BRÉHAUT** — « Le groupe vit bien, et il t'aime trop : personne ne dit plus rien de vrai. Tu veux des amis ou des joueurs ? »
← **Je reprends de la distance** — vestiaire −, direction ++ — *Tu ne manges plus avec eux. Ils s'en aperçoivent le troisième jour.* · → **Je reste des leurs** — vestiaire +, direction − — *Le président appelle ça « le club des copains ».*
**`ds.alarme.tribunes_bas_gege`** · tribunes < 20 · **GÉGÉ** — « La tribune n'oublie rien, et elle a compté tes recrues : sept, dont deux qui jouent. Tu viens au local nous expliquer ? »
← **Je vais au local** — tribunes ++, direction − — *Trois bières, un tableau blanc, deux heures.* · → **Je ne me justifie pas** — tribunes −, caisse + — *Une bâche apparaît dimanche : « ON VEUT DES JOUEURS ».*
**`ds.alarme.tribunes_haut_gege`** · tribunes > 80 · **GÉGÉ** *(sourire)* — « La tribune n'oublie rien : ton nom est chanté avant celui du coach. Tu profites, ou tu calmes ? »
← **Je calme** — tribunes −, vestiaire + — *Tu fais chanter le nom du coach. Il ne dit pas merci.* · → **Je profite** — tribunes +, direction −− — *Le président apprend qu'il a un architecte.*
**`ds.alarme.direction_bas_aulard`** · direction < 20 · **VAUBOURG** — « J'ai pas le temps, j'ai un empire, et un directeur sportif que je croise dans les couloirs. Tu m'expliques le mercato ou je le fais sans toi ? »
← **Je lui explique tout** — direction ++, vestiaire − — *Deux heures de tableau. Il note deux noms, pas les tiens.* · → **Il achètera sans moi** — direction −−, caisse + — *Il achète un attaquant de trente-quatre ans. Il l'annonce d'abord.*
**`ds.alarme.direction_haut_beau_frere`** · direction > 80 · **le beau-frère du président** *(voix, sans portrait)* — « Vous êtes son homme, et il le dit partout. Le jour où il tombe, on ne cherchera pas longtemps. »
← **Je prends de la hauteur** — direction −, tribunes + — *Tu parles au kop avant de parler au bureau.* · → **Je suis son homme** — direction +, vestiaire −, set: homme_president — *Le vestiaire arrête de te parler des primes.*
**`ds.alarme.caisse_bas_vialat`** · caisse < 20 · **VIALAT** — « Je ne juge pas, je compte : douze contrats, trois payables. Vous en résiliez combien avant janvier ? »
← **J'en résilie trois** — caisse ++, vestiaire −− — *Trois casiers vides un lundi matin.* · → **Je tiens jusqu'en juin** — caisse −, direction − — *Elle referme le dossier et le garde sur le dessus.*
**`ds.alarme.caisse_haut_fardelli`** · caisse > 80 · **FARDELLI** — « Mon ami, avec une caisse pareille on fait des choses, et on laisse des traces. On parle d'argent ou d'amitié ? »
← **On parle d'amitié** — caisse −, relation.fardelli −1 — *Il range son carnet lentement, pour que tu le voies.* · → **On parle d'argent** — caisse +, set: commission_occulte — *Une ligne « conseil extérieur » dans un contrat de dix pages.*

### 2.5 Président amateur (`pr.`, rôle `president_amateur`)

| Jauge | Porteur 1 | Porteur 2 | Porteur 3 |
|---|---|---|---|
| Le club (vestiaire) | Dédé | Josiane | les cousins de la buvette |
| Le village (tribunes) | Gégé (le cousin de Gégé) | Paulette | Dupuis |
| La mairie (direction) | Aubert | Roux | le conseil municipal (voix) |
| La caisse | Gérard | Vialat (la ligue) | Pichon |

**`pr.alarme.vestiaire_bas_dede`** · vestiaire < 20 · **DÉDÉ** — « Bon, on va pas se mentir : il n'y a plus personne pour tracer les lignes le samedi. Tu viens avec le chariot ou on joue sur de l'herbe ? »
← **Je trace les lignes** — vestiaire ++, caisse − — *Deux heures à genoux, un dos cassé, un club qui joue.* · → **Je trouve quelqu'un** — vestiaire −, direction + — *La mairie envoie un employé, une fois.*
**`pr.alarme.vestiaire_haut_cousins`** · vestiaire > 80 · **les cousins de la buvette** *(voix)* — « On tient la buvette, les maillots et le car. On a aussi un avis sur le coach, tu veux l'entendre ? »
← **Je les écoute** — vestiaire +, direction −− — *Le coach l'apprend par la buvette. Il range son sifflet.* · → **Le club, c'est moi** — vestiaire −−, direction + — *Le fût reste dans la réserve dimanche.*
**`pr.alarme.tribunes_bas_gege`** · tribunes < 20 · **le cousin de Gégé** *(voix, écharpe)* — « Mon cousin dit qu'une tribune n'oublie rien. Ici, il n'y a plus rien à oublier : ils vont voir le club d'à côté. »
← **Je fais une fête au club** — tribunes ++, caisse − — *Merguez gratuites, trois cents personnes, un club qui existe.* · → **Ils reviendront** — tribunes −, caisse + — *Le club d'à côté a mis un car gratuit.*
**`pr.alarme.tribunes_haut_dupuis`** · tribunes > 80 · **DUPUIS** — « Le meilleur du cochon, et je pèse mes mots : le village t'adore, et le maire l'a remarqué. Tu te présentes contre elle ? »
← **Je ne fais pas de politique** — tribunes −, direction ++ — *Elle t'appelle « monsieur le président » sans ironie.* · → **On verra en mars** — tribunes +, direction −− — *La subvention est « à l'étude ».*
**`pr.alarme.direction_bas_aubert`** · direction < 20 · **AUBERT** — « Le stade, c'est de l'argent public, et la commission de sécurité passe jeudi. Vous avez le rapport électrique ? »
← **Je fais les travaux** — direction ++, caisse −− — *Un électricien, deux jours, une facture, un tampon.* · → **Je discute** — direction −, tribunes + — *Le stade ouvre quand même. Elle note la date.*
**`pr.alarme.direction_haut_conseil`** · direction > 80 · **le conseil municipal** *(voix)* — « Le club touche plus que la médiathèque. On aimerait savoir qui décide, vous ou la mairie. »
← **Je rends une part** — direction −, caisse −− — *La médiathèque a un budget. Le club a une image.* · → **Je garde tout** — direction +, tribunes −− — *Le village lit le compte rendu du conseil.*
**`pr.alarme.caisse_bas_gerard`** · caisse < 20 · **GÉRARD** — « Ici, on payait en bières, et là on paie plus rien. Je remplis le fût sur mes sous ou on ferme la buvette ? »
← **Je remplis le fût** — caisse −, tribunes ++ — *Il paie de sa poche et ne le dira jamais.* · → **On ferme deux mois** — caisse +, tribunes −− — *Le rideau baissé se voit de la route.*
**`pr.alarme.caisse_haut_magot`** · caisse > 80 · **ROUX** — « Le district, c'est la base, et la base ne garde pas dix mille {monnaie} en liquide dans un placard. Tu déclares, ou tu attends la visite ? »
← **Je déclare tout** — caisse −−, direction ++ — *Un comptable, un chèque, un dimanche perdu.* · → **On garde la boîte en fer** — caisse +, direction −, set: magot_liquide — *La boîte change de placard. Deux personnes savent.*

### 2.6 Président pro (`pr.`, rôle `president`)

| Jauge | Porteur 1 | Porteur 2 | Porteur 3 |
|---|---|---|---|
| Le club (vestiaire) | Bréhaut (DS) | l'entraîneur | Josiane |
| Tribunes | Gégé | Paulette | Massenet |
| Actionnaires (direction) | le Conseil | Ilyas | Malbec |
| Trésorerie (caisse) | Vialat | Ilyas | Josiane |

**`pr.alarme.vestiaire_bas_brehaut`** · vestiaire < 20 · **BRÉHAUT** *(DS)* — « Le groupe vit bien ; le personnel, non. Les jardiniers ont posé un préavis pour le derby, tu les reçois ? »
← **Je les reçois** — vestiaire ++, caisse − — *Quarante minutes, deux cafés, une prime de match.* · → **Je laisse le DS gérer** — vestiaire −, direction + — *La pelouse tient. La photo du préavis circule.*
**`pr.alarme.vestiaire_haut_coach`** · vestiaire > 80 · **l'entraîneur** *(Vogler, Vaz ou Vukić)* — « Je signe les recrues, les contrats et les cartes de vœux. À quoi vous servez, exactement ? »
← **Je reprends la main** — vestiaire −, direction ++ — *Tu signes tout pendant une semaine. Il boude proprement.* · → **Il gère mieux que moi** — vestiaire +, direction −− — *Le Conseil se demande qui il paie.*
**`pr.alarme.tribunes_bas_gege`** · tribunes < 20 · **GÉGÉ** — « La tribune n'oublie rien, et elle a une date : dimanche, on entre à la vingtième, dos au terrain. Tu descends avant ? »
← **Je descends au virage** — tribunes ++, direction − — *Tu prends une bière tiède debout. La photo fait le tour.* · → **Je reste en loge** — tribunes −−, direction + — *Vingt minutes de silence, filmées en plan large.*
**`pr.alarme.tribunes_haut_meneche`** · tribunes > 80 · **MASSENET** — « Juste une question, hors micro : porté par les tribunes, on se présente à la mairie. Vous y pensez, ou vous y allez ? »
← **Je pense au club** — tribunes −, direction ++ — *Tu démens en deux phrases. La deuxième est de trop.* · → **Je ne dis pas non** — tribunes +, direction −−, set: tentation_mairie — *Une affiche existe déjà quelque part.*
**`pr.alarme.direction_bas_conseil`** · direction < 20 · **le Conseil** *(voix)* — « Une assemblée générale extraordinaire est convoquée. L'ordre du jour tient en un point, et c'est vous. »
← **Je prépare l'AG** — direction ++, caisse − — *Trois nuits, un plan, deux alliés retournés.* · → **Je pars en vacances** — direction −−, vestiaire + — *L'ordre du jour ne change pas. Toi non plus.*
**`pr.alarme.direction_haut_nassir`** · direction > 80 · **ILYAS** — « Ce n'est pas un club, c'est un actif, et vous en êtes le visage. Un visage, ça se remplace plus vite qu'un actif. »
← **Je pose mes conditions** — direction −, tribunes + — *Tu obtiens une clause. Elle tient deux ans.* · → **Je suis leur homme** — direction +, tribunes −−, set: pantin — *On te photographie beaucoup, on te consulte peu.*
**`pr.alarme.caisse_bas_vialat`** · caisse < 20 · **VIALAT** — « Je ne juge pas, je compte : deuxième exercice négatif. Vous vendez un joueur avant le 31, ou nous bloquons les recrutements. »
← **Je vends l'attaquant** — caisse ++, tribunes −− — *La tribune apprend le prix avant le nom.* · → **Je tiens jusqu'en juin** — caisse −, direction −, set: commission_lettre — *La lettre arrive avec un délai de quinze jours.*
**`pr.alarme.caisse_haut_nassir`** · caisse > 80 · **ILYAS** — « Ce n'est pas un club, c'est un actif, et le vôtre est magnifique. On l'achète avec ce qu'il y a autour ? »
← **Je ne vends pas** — caisse −, tribunes ++ — *Le kop l'apprend et chante ton nom deux dimanches.* · → **J'écoute l'offre** — caisse +, direction −, set: club_actif — *Trois hommes en costume visitent le centre de formation.*

### 2.7 Sélectionneur (`sl.`)

| Jauge | Porteur 1 | Porteur 2 | Porteur 3 |
|---|---|---|---|
| Le groupe (vestiaire) | Fauvel (capitaine) | Rouvier | Vecchio |
| Le pays (tribunes) | Gégé | Vence | Massenet |
| La Fédération (direction) | Dauzat | Berthomier | Brissac |
| Les moyens (caisse) | Josiane | Ilyas | Aubert (ministre) |

**`sl.alarme.vestiaire_bas_capitaine`** · vestiaire < 20 · **FAUVEL** — « On est un groupe, pas une liste, et là c'est une liste. Deux tables au dîner, deux étages à l'hôtel : vous choisissez la vôtre ? »
← **Je mange avec tout le monde** — vestiaire ++, direction − — *Tu changes de table à chaque plat. Personne n'est dupe, tout le monde apprécie.* · → **Je renvoie les deux chefs** — vestiaire −, force − — *Deux cadres rentrent chez eux. La liste est plus courte et plus calme.*
**`sl.alarme.vestiaire_haut_rouvier`** · vestiaire > 80 · **ROUVIER** *(kiné)* — « Respire. Encore. Ils t'aiment tellement qu'ils sont sortis à trois heures et qu'ils t'ont envoyé la photo. »
← **Je ferme l'étage** — vestiaire −, direction + — *Couvre-feu, un gardien, deux plaintes.* · → **Je fais confiance** — vestiaire +, tribunes −− — *La photo sort quand même, ailleurs.*
**`sl.alarme.tribunes_bas_gege`** · tribunes < 20 · **GÉGÉ** — « La tribune n'oublie rien, et le pays non plus. On a appris ton nom pour le crier, c'est déjà ça. »
← **Je vais leur parler** — tribunes ++, direction − — *Une heure de radio de supporters, à vingt-deux heures.* · → **Je regarde le terrain** — tribunes −, vestiaire + — *Les joueurs te remercient. Personne d'autre.*
**`sl.alarme.tribunes_haut_ministre`** · tribunes > 80 · **AUBERT** *(ministre, après 2002)* — « Le stade, c'est de l'argent public, et vous êtes plus aimé que le gouvernement. C'est un compliment inquiétant. »
← **Je baisse le ton** — tribunes −, direction ++ — *Tu annules deux interviews. On te trouve modeste.* · → **Je continue** — tribunes +, direction −− — *Un ambassadeur, ça se nomme vite.*
**`sl.alarme.direction_bas_dauzat`** · direction < 20 · **DAUZAT** — « C'est dans le procès-verbal : votre contrat court jusqu'à minuit le 30. Personne n'a demandé d'avenant. »
← **Je demande une réunion** — direction ++, vestiaire − — *Quarante minutes, un café, aucune signature.* · → **J'attends minuit** — direction −−, tribunes + — *Le téléphone sonne à minuit et une.*
**`sl.alarme.direction_haut_legruet`** · direction > 80 · **BERTHOMIER** *(sourire)* — « Cher {prenom}, vous êtes mon homme, et on verra ça après le Congrès. Le Congrès peut mal tourner. »
← **Je prends mes distances** — direction −, tribunes + — *Tu ne montes pas dans la voiture officielle.* · → **Je reste son homme** — direction +, vestiaire −, set: president_ami — *Le vestiaire apprend qui décide de la liste.*
**`sl.alarme.caisse_bas_josiane`** · caisse < 20 · **JOSIANE** *(Fédération)* — « J'en ai vu passer, des budgets. Le charter est annulé : c'est un vol de ligne avec escale, ou le train. »
← **On prend le train** — caisse ++, vestiaire −− — *Neuf heures de train, deux joueurs malades.* · → **Je paie le charter** — caisse −−, vestiaire + — *L'avion décolle. La facture arrive en juin.*
**`sl.alarme.caisse_haut_nassir`** · caisse > 80 · **ILYAS** — « Ce n'est pas une sélection, c'est une vitrine, et nous payons la vitrine. La prime du staff est sur un autre compte. »
← **Je refuse le second compte** — caisse −−, direction + — *Tu signes un refus écrit. Dauzat le classe.* · → **J'accepte la prime** — caisse +, parole −2, set: primes_cachees — *Le sponsor verse le 3 du mois. La Fédération l'apprendra un dimanche.*

### 2.8 Dirigeant d'instance (`in.`)

| Jauge | Porteur 1 | Porteur 2 | Porteur 3 |
|---|---|---|---|
| Le comité (vestiaire) | Dauzat | Montoya | Brissac |
| L'opinion (tribunes) | La Plume | Léa | Vence |
| Le Congrès (direction) | Roux (les districts) | Malbec | Bambini |
| Les réserves (caisse) | le trésorier (voix) | Amsel | Ilyas |

**`in.alarme.vestiaire_bas_dauzat_dauphin`** · vestiaire < 20 · **DAUZAT** — « C'est dans le procès-verbal : une motion de défiance est déposée, signée par sept membres. Vous voulez les noms ? »
← **Je veux les noms** — direction +, vestiaire −− — *Sept noms, dont deux que tu as nommés.* · → **Je réunis le comité** — vestiaire ++, caisse − — *Deux jours de couloirs, un dîner, une motion retirée.*
**`in.alarme.vestiaire_haut_montoya`** · vestiaire > 80 · **MONTOYA** — « Quatorze clubs, une table, vous êtes assis ou debout ? Un comité qui vous adore, ça s'achète, donc ça se rachète. »
← **Je renouvelle le comité** — vestiaire −, direction ++ — *Trois départs volontaires, deux entrées choisies.* · → **Je garde mes fidèles** — vestiaire +, tribunes − — *On appelle ça une cour, dans les journaux.*
**`in.alarme.tribunes_bas_plume`** · tribunes < 20 · **LA PLUME** *(par écrit)* — « J'ai les documents : dix-huit millions de pages, et votre nom sur quatre cents. Vous répondez avant six heures ? »
← **Je réponds tout de suite** — tribunes +, direction − — *Une réponse de trois lignes, relue par un avocat.* · → **Je ne réponds pas** — tribunes −−, caisse + — *Le silence est cité comme une réponse.*
**`in.alarme.tribunes_haut_showman`** · tribunes > 80 · **VENCE** — « On est en direct : vous avez une émission, une chanson et une ligne de vêtements. Il vous manque quoi ? »
← **J'arrête le cirque** — tribunes −, direction ++ — *Tu annules la tournée. Le comité respire.* · → **Je fais la tournée** — tribunes +, direction −− — *Le comité d'éthique ouvre un dossier « image ».*
**`in.alarme.direction_bas_roux`** · direction < 20 · **ROUX** — « Le district, c'est la base, et la base ne t'a pas vu depuis deux ans. Trois cents voix, ça se déplace en car. »
← **Je tourne les districts** — direction ++, caisse − — *Onze salles des fêtes, onze cafés, onze photos.* · → **Je travaille les dossiers** — direction −−, tribunes + — *Les dossiers avancent. Le car aussi, vers l'autre candidat.*
**`in.alarme.direction_haut_bambini`** · direction > 80 · **BAMBINI** — « Le football unit le monde, et mes amis. Les confédérations vous adorent : ça veut dire qu'elles vous tiennent. »
← **Je pose une condition** — direction −, tribunes + — *Tu refuses un siège. On note que tu refuses.* · → **Je prends tout** — direction +, vestiaire −, set: pantin_confed — *Quatre présidents décident, un seul parle.*
**`in.alarme.caisse_bas_taxi`** · caisse < 20 · **le trésorier** *(voix)* — « L'hôtel du Congrès demande un acompte, et deux sponsors n'ont pas renouvelé. Il reste de quoi payer les taxis. »
← **Je coupe les frais** — caisse ++, direction −− — *Plus de voitures, plus de suites, plus d'amis.* · → **Je maintiens le train de vie** — caisse −−, tribunes + — *Le Congrès est somptueux. Le chauffeur attend son chèque.*
**`in.alarme.caisse_haut_amsel`** · caisse > 80 · **AMSEL** — « Nous avons tout notre temps. Vos réserves ont triplé en deux ans ; nous aimerions savoir en quelle monnaie. »
← **J'ouvre les comptes** — caisse −, direction + — *Un audit, six semaines, deux lignes effacées.* · → **Je ne réponds rien** — caisse +, tribunes −−, set: fede_dossier — *À six heures du matin, on frappe à une porte d'hôtel.*

---

## 3. Les face-à-face de palier

**Mécanique.** Quand une relation franchit **−3** ou **+3**, la carte de palier du personnage est programmée en dur dans les trois tirages suivants (`characters.yaml → on_relation`, `kind: palier` dérivé au build), **hors du sac**, **une fois par carrière et par personnage et par sens**. Elle passe avant l'alarme (§ 0) et absorbe l'alarme du même porteur. Un palier **−3** fait de ce personnage un **Ennemi** : il est conservé d'un rôle à l'autre (charte § 3.3), `enemy('<id>')` devient vrai, et les fins, les manchettes et les retrouvailles le lisent. Un palier **+3** pose une **faveur** : le personnage te sauve une fois, gratuitement, plus tard — et te le rappellera.

**Écriture.** Les quatre-vingt-deux scènes sont dans les fiches des chapitres **01** et **02** ; ce chapitre en tient la **table de déclenchement**, la priorité, et les six face-à-face qui dépendent du rôle joué et pas du personnage (§ 3.2). Trois règles : la trahison n'a **qu'une sortie** (on ne négocie pas un −3, on le lit) ; la faveur en a deux (accepter, ou demander pourquoi — ce qui coûte un cran) ; aucune n'est un drame, même quand elle fait mal.

### 3.1 La table des quatre-vingt-deux paliers

| Personnage | −3 · la trahison | +3 · la faveur |
|---|---|---|
| Gégé | `en.gege.trahison_banderole` — vingt mètres, ton nom devant | `en.gege.faveur_insurrection` — il a annulé l'insurrection du vestiaire |
| Bréhaut | `co.brehaut.trahison_petition` — il a signé en premier | `co.brehaut.faveur_lettre` — la lettre du vestiaire, signée en premier |
| Vukić | `co.vukic.trahison_serrure` — il garde le bureau et change la serrure | `co.vukic.faveur_trois_valises` — trois valises, il te suit |
| Vecchio | `co.vecchio.trahison_une_rendue` — il rend le maillot devant le groupe | `co.vecchio.faveur_reunion` — il réunit le vestiaire sans toi, pour toi |
| Sabatier | `co.sabatier.trahison_dossier` — le dossier médical sort de la table | `co.sabatier.faveur_controle` — il te prévient d'un contrôle |
| Rouvier | `co.rouvier.trahison_dossier` — elle parle de ce que le Doc cachait | `co.rouvier.faveur_ce_que_le_doc_cache` — elle te le dit à toi d'abord |
| Camille | `co.camille.valise` — la valise dans l'entrée, `set: divorce` | `co.camille.secours_*` — son métier te sauve une fois |
| Sacha | `co.sacha.trahison_succession` — elle t'appelle par ton nom de famille | `co.sacha.faveur_tribune_pleine` — elle vient, et la tribune est pleine |
| Corven | `co.clow.trahison_devant` — il te raye de son testament | `co.clow.faveur_telegramme` — un télégramme de six mots |
| Mbako | `co.mbako.trahison_clause` — il active la clause, sa mère l'avait écrite | `co.mbako.faveur_refus_grand_club` — il refuse le grand club pour toi |
| mère de Mbako | `co.mere_mbako.trahison_lea` — elle raconte tout à la presse | `co.mere_mbako.faveur_numero` — elle te donne son numéro direct |
| Dembo | `co.dembo.trahison_micro` — il parle au micro à la mi-temps | `co.dembo.faveur_ballon` — il donne le ballon au petit, pour toi |
| Fauvel | `co.fauvel.trahison_lettre_publique` — la lettre du groupe, publiée | `co.fauvel.faveur_bus` — il fait descendre le bus |
| Brissac | `co.brissac.trahison_dossier` — elle ressort ton dossier de diplôme | `co.brissac.faveur_stage` — elle t'ouvre le stage et la porte |
| Vaz | `co.loco.trahison_silence` — il ne t'adresse plus la parole, jamais | `co.loco.faveur_seau` — il te prête le seau et la cassette |
| Vogler | `co.klopf.trahison_collegue` — « collègue » dit à la troisième personne | `co.klopf.faveur_chant` — son kop chante ton nom après le match |
| Gérard | `co.gerard.trahison_caisse` — la boîte en fer disparaît | `co.gerard.faveur_bas_de_laine` — il paie de sa poche, sans le dire |
| Dédé | `co.dede.trahison_montbeliac` — il entraîne l'ennemi héréditaire | `co.dede.faveur_sifflet` — il te donne son sifflet |
| Paulette | `co.paulette.trahison_nom` — elle ne retient plus ton nom, exprès | `co.paulette.faveur_mari` — elle te raconte son mari, à la 70e |
| Dupuis | `co.dupuis.trahison_montbeliac` — son nom passe sur le maillot d'en face | `co.dupuis.faveur_tribune` — il paie la tribune, sans conditions |
| Pichon | `co.pichon.trahison_cinq_heures` — la boulangerie ferme, le club aussi | `co.pichon.faveur_les_cles` — il te donne les clés du club |
| Rossard | `co.rossard.trahison_remplacant` — il te remplace et le dit avant toi | `co.rossard.faveur_vingt_trois` — il joue blessé, sans le dire |
| Fardelli | `co.fardelli.trahison_signe_ailleurs` — il signe ailleurs pendant que tu dors | `co.fardelli.faveur_premier_appel` — tu es son premier appel |
| Solvang | `co.solvang.trahison_libre` — elle libère ton joueur en trois lignes | `co.solvang.faveur_page_trois` — elle te montre la page trois |
| Massenet | `en.meneche.trahison_dossier` — il sort le dossier | `co.meneche.faveur_enterre` — il l'enterre, et te le dit |
| Léa | `co.lea.trahison_une_question` — la question qui fait la Une | `co.lea.faveur_vingt_quatre_heures` — vingt-quatre heures d'avance |
| Vence | `co.vence.trahison_en_direct` — la question de trop, en direct | `co.vence.faveur_plateau` — le plateau est à toi |
| La Plume | `co.la_plume.trahison_documents` — les documents sortent | `co.la_plume.faveur_source` — elle protège sa source, et c'est toi |
| Vaubourg | `co.aulard.trahison_cheque_non_date` — le chèque qu'il ne date pas | `co.aulard.faveur_rappel` — il te rappelle, cinq ans après |
| Malbec | `co.malbec.trahison_denonce` — il te dénonce entre présidents | `co.malbec.faveur_ma_voix` — sa voix, et deux cents avec |
| Montoya | `co.montoya.trahison_debout` — tu restes debout | `co.montoya.faveur_assis` — une chaise à la table |
| Ilyas | `co.nassir.trahison_notification` — une notification, deux lignes | `co.nassir.faveur_un_club` — il t'achète un club |
| Josiane | `co.josiane.trahison_sous_les_autres` — ton dossier rangé sous les autres | `co.josiane.faveur_classeur` — le classeur qu'elle avait gardé |
| Barbier | `co.barbier.trahison_trop_lent` — « trop lent », écrit et signé | `co.barbier.faveur_sous_la_pluie` — il t'a vu jouer sous la pluie |
| Aubert | `co.aubert.trahison_subvention` — la subvention coupée en séance | `co.aubert.faveur_ministere` — le ministère décroche pour toi |
| Berthomier | `co.legruet.trahison_avant_toi` — il nomme l'autre avant de te le dire | `co.legruet.faveur_les_districts` — les districts votent pour toi |
| Dauzat | `co.dauzat.trahison_proces_verbal` — la phrase exacte, au procès-verbal | `co.dauzat.faveur_page_41` — la page 41 du règlement, pour toi |
| Bambini | `co.bambini.trahison_choque` — il « est choqué » | `co.bambini.faveur_mes_amis` — ses amis deviennent les tiens |
| Vialat | `co.vialat.trahison_recrutement` — recrutements bloqués | `co.vialat.faveur_ligne_douze` — elle te montre la ligne douze |
| Amsel | `co.amsel.trahison_six_heures` — six heures du matin | `co.amsel.faveur_temoin` — tu passes de mis en cause à témoin |
| Colline | `co.colline.trahison_rapport` — le rapport d'arbitre, mot pour mot | `co.colline.faveur_rien` — il ne fait rien, et te regarde |
| Roux | `co.roux.trahison_huis_clos` — huis clos et trois matchs | `co.roux.faveur_siege` — un siège au district |

### 3.2 Les six face-à-face transversaux (le rôle change, la scène existe)

### SCÈNE co.palier.ancien_patron_egal  —  L'ancien patron, à ta table
**Rôle** : president | instance · **Intrigue** : — (palier transversal) · **Étape** : 1/1 · **Moment** : toute saison, après une transition de rôle · **Lieu** : une table de réunion · **Conditions** : `relation.aulard <= -3 && role_changed && chars.aulard.statut != 'retraite'`
**VAUBOURG** *(président — noir — il ne se lève pas)*
« On m'a dit que vous étiez de ce côté-ci de la table, maintenant. J'ai pas le temps, j'ai un empire ; vous, vous avez le temps. »
← **Je m'assois quand même** — direction −, parole +1, set: ennemi_a_table — *Il déplace sa chaise de dix centimètres. Personne ne dit rien pendant une minute.*
→ **Je m'assois quand même** — idem *(une seule sortie : on ne négocie pas un −3)*
**Traces** : ennemi_a_table · **Réactions déclenchées** : co.re.josiane_a_vu · **Lu plus tard par** : in_defiance (epitaph_plus), pr_ag (epitaph_plus), les Cartes Destin § 6, la manchette « ILS SE SONT REVUS »

### SCÈNE co.palier.dauphin_devenu_rival  —  Ton adjoint en face
**Rôle** : entraineur | selectionneur | ds · **Étape** : 1/1 · **Moment** : S2+ · **Lieu** : le couloir des vestiaires · **Conditions** : `relation.vukic <= -3 && flag('vukic_dauphin')`
**VUKIĆ** *(entraîneur adverse — noir — le cahier sous le bras)*
« Je te le dis parce que personne ne te le dira : ce cahier, c'est le tien, et je l'ai amélioré. Bon match, {nom}. »
← **Je lui souhaite bon match** — vestiaire −, direction −, set: cahier_perdu — *Il te tend la main trois secondes de trop, et la retire le premier.*
→ **Je lui souhaite bon match** — idem
**Traces** : cahier_perdu · **Lu plus tard par** : en_dauphin (epitaph_plus ∃), § 6 Destin *Entraîneur → Consultant*, une.generic.cahier

### SCÈNE co.palier.electeur_hostile  —  Celui qui vote
**Rôle** : instance · **Étape** : 1/1 · **Moment** : année de Congrès · **Lieu** : une salle des fêtes de district · **Conditions** : `relation.roux <= -3`
**ROUX** *(président de district — noir — devant trente personnes)*
« Le district, c'est la base, et la base a une mémoire de terrain gras. Vous êtes venu une fois en quatre ans, et c'était pour la photo. »
← **Je repars ce soir** — direction −−, tribunes + — *Trente personnes te regardent partir. Deux te saluent.*
→ **Je repars ce soir** — idem
**Traces** : districts_perdus · **Lu plus tard par** : in_defiance, in_congres, la Campagne (§ 6), une.generic.districts

### SCÈNE co.palier.mecene_sauveur  —  Celui qui paie sans condition
**Rôle** : president_amateur | president · **Étape** : 1/1 · **Moment** : après une alarme caisse · **Lieu** : l'arrière-boutique · **Conditions** : `relation.dupuis >= 3`
**DUPUIS** *(boucher-sponsor — sourire — il essuie ses mains)*
« Le meilleur du cochon, et je pèse mes mots : la tribune, je la paie, et je ne veux rien dessus. Même pas mon nom. »
← **J'accepte et je le dis** — caisse +++, tribunes ++ — *Le village apprend qui a payé. Il refuse d'être applaudi et l'est quand même.*
→ **J'accepte, sans le dire** — caisse +++, relation.dupuis +1 — *Il te fait promettre. Tu tiens, ça se remarque aussi.*
**Traces** : tribune_payee · **Lu plus tard par** : pa_club_a_cote (epitaph_plus), une.generic.tribune, § 4 retrouvailles

### SCÈNE co.palier.la_seule_qui_sait  —  Elle a gardé le classeur
**Rôle** : tous · **Étape** : 1/1 · **Moment** : toute saison ≥ 1 · **Lieu** : le bureau du fond · **Conditions** : `relation.josiane >= 3`
**JOSIANE** *(secrétaire — sourire — un classeur vert sur les genoux)*
« J'en ai vu passer, et j'ai gardé celui-là parce qu'un jour quelqu'un en aurait besoin. Vous le lisez ici, pas ailleurs. »
← **Je le lis ici** — direction ++, set: classeur_josiane — *Douze pages, trois dates, une signature qui n'est pas la tienne.*
→ **Pourquoi moi ?** — direction +, relation.josiane −1 — *Elle referme le classeur. « Parce que vous avez dit bonjour », et elle sort.*
**Traces** : classeur_josiane · **Lu plus tard par** : grand_deballage (epitaph_plus), pr_commission, in.alarme.caisse_haut_amsel, une.generic.classeur

### SCÈNE co.palier.enfant_qui_te_nomme  —  Elle t'appelle par ton nom
**Rôle** : tous · **Étape** : 1/1 · **Moment** : Sacha ≥ 6 ans, hors S0 · **Lieu** : la cuisine · **Conditions** : `relation.sacha <= -3` · **Ton** : drame sobre, une par carrière
**SACHA** *(ton enfant — noir — elle ne lève pas les yeux)*
« Tu m'as promis, {nom}. Trois fois, et je les ai comptées comme tu comptes les points. »
← **Je m'assois en face** — vestiaire −, direction − — *Tu restes une heure. Elle finit ses devoirs, et tu restes quand même.*
→ **Je m'assois en face** — idem
**Traces** : sacha_te_nomme · **Lu plus tard par** : ta_loge (epitaph_plus), jubile (epitaph_plus), § 6 *Porte de sortie*, 90 (lignée)

---

## 4. Les retrouvailles

**Mécanique.** Un personnage `parti`, `vendu`, `retraite` ou `rival` revient quand tu changes de club, de rôle ou d'époque : **une carte par saison** au plus, en respiration (créneaux 6, 12 ou 16), jamais deux du même personnage, jamais dans la saison de son palier. Le **visage** choisit la variante : `_sourire` si la relation était ≥ +1 à la séparation, `_noir` si ≤ −1, `_telephone` s'il est hors fenêtre. Les **répliques** sont dans les fiches (01 et 02) ; les **scènes** ci-dessous sont les cadres qui les servent.

**Trois personnages te suivent** d'un rôle à l'autre (charte § 3.3) : tes deux meilleures relations et ta pire. Ce sont eux que le tirage privilégie ; les autres reviennent par accident, ce qui est mieux.

### SCÈNE co.retrouvailles.vendu_marque_contre_toi  —  Il est en face, en jaune
**Rôle** : entraineur | joueur | ds · **Moment** : S+1 après la vente · **Conditions** : `flag('mbako_vendu') && chars.mbako.statut == 'vendu'`
**MBAKO** *(prodige, autre club — neutre — il a grandi de six centimètres)*
« Je veux jouer, maintenant, et je joue. Vous m'avez vendu un mardi, coach ; j'ai su le prix par la radio. »
← **Je dis que c'était le club** — vestiaire −, relation.mbako −1 — *Il hoche la tête et va s'échauffer devant ton banc.*
→ **Je lui dis que j'ai dit oui** — vestiaire +, tribunes − — *Il te regarde une seconde de plus. C'est tout ce que tu auras.*
**Traces** : mbako_revu · **Lu plus tard par** : 20 (« TRENTE MILLIONS ET UN GAMIN »), en_decoupe (epitaph_plus), § 6 Destin

### SCÈNE co.retrouvailles.coach_vire_en_face  —  L'entraîneur que tu as viré
**Rôle** : president | ds · **Moment** : S+1 · **Conditions** : `flag('coach_vire') && chars.<coach>.statut == 'rival'`
**VOGLER** *(entraîneur adverse — noir — casquette)* — « On court, on presse, on chante, et ici on chante mieux. Vous voulez la main d'abord ou l'interview d'abord, collègue ? »
← **La main** — direction +, tribunes − — *Il la serre longuement, face aux photographes.*
→ **L'interview** — tribunes +, direction − — *Il répond avant toi, et mieux.*
**Traces** : coach_revu · **Lu plus tard par** : pr_siege, une.generic.revanche

### SCÈNE co.retrouvailles.gigi_derriere_le_but  —  Le banc en bois
**Rôle** : tous · **Moment** : après `gigi_staff` ou la retraite de Vecchio · **Conditions** : `chars.vecchio.statut == 'staff' || chars.vecchio.statut == 'retraite'`
**VECCHIO** *(45 ans et plus — sourire — assis sur un banc en bois)* — « J'en ai vu d'autres revenir, et repartir plus vite. Tu t'assois cinq minutes, ou tu fais celui qui est pressé ? »
← **Je m'assois** — vestiaire ++, direction − — *Cinq minutes deviennent quarante. Personne ne vous cherche.*
→ **Je suis pressé** — direction +, relation.vecchio −1 — *Il ne se retourne pas. Il regarde les gardiens.*
**Traces** : banc_de_gigi · **Lu plus tard par** : en_retraite (epitaph_plus ∃), jubile, 31 (l'enterrement de Vecchio, 2031)

### SCÈNE co.retrouvailles.josiane_retraitee  —  Elle range encore
**Rôle** : tous · **Moment** : après 2022 · **Conditions** : `chars.josiane.statut == 'retraite'`
**JOSIANE** *(retraitée — sourire — un carton sur les genoux)* — « J'en ai vu passer, et je range encore les dossiers de ceux qui sont partis. Le vôtre est sur le dessus, figurez-vous. »
← **Je le prends** — direction +, set: dossier_repris — *Douze pages sur toi, écrites par quelqu'un qui t'aimait bien.*
→ **Laissez-le où il est** — vestiaire + — *Elle le remet sous les autres, doucement.*
**Traces** : dossier_repris · **Lu plus tard par** : generique (epitaph_plus ∃), grand_deballage, 90

### SCÈNE co.retrouvailles.fardelli_carnet_repris  —  Le carnet a changé de main
**Rôle** : joueur | ds | president · **Moment** : après 2018 · **Conditions** : `chars.fardelli.statut == 'retraite' && relation.solvang != 0`
**SOLVANG** *(agente — neutre — un carnet noir posé sur la table)* — « Mon client décide, moi je compte, et j'ai repris son carnet. Votre nom y est deux fois, dont une au crayon. »
← **Je veux voir la page** — caisse −, direction + — *Elle tourne le carnet vers toi. Une seule ligne est lisible.*
→ **Je ne veux pas savoir** — parole +1 — *Elle referme le carnet et le range sans un mot.*
**Traces** : carnet_solvang · **Lu plus tard par** : jp_agent, ds_roi_mercato, 20

### SCÈNE co.retrouvailles.gege_socio  —  Il est du conseil, maintenant
**Rôle** : president | instance · **Moment** : après 2032 · **Conditions** : `relation.gege != 0 && year >= 2032`
**GÉGÉ** *(élu des socios — neutre — cravate mal nouée)* — « La tribune n'oublie rien, et maintenant elle vote. Je suis assis en face de toi, et ça me fait tout drôle. »
← **Je lui laisse le premier mot** — tribunes ++, direction − — *Il parle onze minutes. Il ne s'était jamais entendu.*
→ **Je préside** — direction +, tribunes − — *Il note, comme au local. Sur un carton de bière.*
**Traces** : gege_elu · **Lu plus tard par** : pr_mairie, in_pages, 20, 90

### SCÈNE co.retrouvailles.dede_eglise  —  On enterre le sifflet
**Rôle** : tous · **Moment** : 2012 · **Conditions** : `year == 2012 && relation.dede != 0` · **Ton** : drame sobre
**PICHON** *(boulanger — neutre — devant l'église)* — « Le pain, c'est à cinq heures, et il venait le chercher à quatre. On te garde une place au premier rang. »
← **Je prends la place** — vestiaire +, tribunes + — *Tu portes le cercueil du côté droit. Le sifflet est dedans.*
→ **Je reste au fond** — parole +1 — *Tu vois tout le canton de dos. Personne ne te reproche rien.*
**Traces** : dede_enterre · **Lu plus tard par** : am_toro (epitaph_plus), 31 (l'enterrement), 90

### SCÈNE co.retrouvailles.clow_bord_de_terrain  —  Le fantôme du mentor
**Rôle** : entraineur | selectionneur · **Moment** : après la mort de Corven · **Conditions** : `(chars.clow.statut == 'mort' || (chars.clow.statut == 'parti' && flag('clow_mort'))) && !flag('clow_ingrat')`
**CORVEN** *(le mentor — Fantôme, silhouette au bord du terrain)* — « Je ne dirais pas que j'étais un grand. Je dirais que j'étais devant ; toi, tu es juste derrière, et c'est mieux que ce que j'espérais. »
← **Je réponds à voix haute** — vestiaire +, direction − — *Deux joueurs se retournent. Tu parles seul, au bord d'un terrain.*
→ **Je continue l'entraînement** — force + — *La silhouette reste jusqu'à la fin de la séance.*
**Traces** : clow_revu · **Lu plus tard par** : 31 (cartes-légendes), en_retraite, statue_de_bronze

### SCÈNE co.retrouvailles.meneche_memoires  —  Il écrit ses mémoires
**Rôle** : tous · **Moment** : après 2025 · **Conditions** : `chars.meneche.statut == 'retraite'`
**MASSENET** *(retraité — neutre — un manuscrit sous le bras)* — « Juste une question, hors micro : le chapitre neuf parle de vous, et il est aimable. Vous le voulez aimable ou vrai ? »
← **Vrai** — tribunes −, parole +2, set: chapitre_neuf — *Il sourit pour la première fois depuis trente ans.*
→ **Aimable** — tribunes +, parole −1 — *Le chapitre neuf fait quatre pages et ne dit rien.*
**Traces** : chapitre_neuf · **Lu plus tard par** : grand_deballage (epitaph_plus), 20, 90

### SCÈNE co.retrouvailles.aulard_te_rappelle  —  Cinq ans après
**Rôle** : entraineur | ds | selectionneur · **Moment** : S+3 après un limogeage · **Conditions** : `relation.aulard >= 1 && chars.aulard.statut != 'retraite'`
**VAUBOURG** *(président — sourire — au téléphone)* — « Mon {prenom}, j'ai pas le temps, j'ai un empire, et un banc vide depuis mardi. Tu es libre jeudi ? »
← **Je suis libre** — direction ++, caisse + — *Il ne parle pas du limogeage. Toi non plus, c'est le contrat.*
→ **Je ne suis pas libre** — parole +1, relation.aulard −1 — *Il raccroche poliment. Il rappellera dans deux ans.*
**Traces** : aulard_rappelle · **Lu plus tard par** : § 6 Destin, en_sms (epitaph_plus), 20

### SCÈNE co.retrouvailles.brehaut_president  —  Le costume lui va
**Rôle** : entraineur | ds | president · **Moment** : après 2020 · **Conditions** : `chars.brehaut.statut == 'parti' && year >= 2020`
**BRÉHAUT** *(président de la Ligue — neutre — manches trop courtes)* — « Le groupe vit bien, et le groupe c'est vingt présidents maintenant. Tu veux quelque chose, ou tu passais ? »
← **Je veux quelque chose** — direction +, relation.brehaut −1 — *Il note sur un carnet. Il note tout, depuis qu'il a le costume.*
→ **Je passais** — vestiaire + — *Il propose un café et parle de bouteilles d'eau pendant vingt minutes.*
**Traces** : brehaut_ligue · **Lu plus tard par** : in_defiance, § 6 Destin, 02

### SCÈNE co.retrouvailles.dembo_ardoises_2020  —  Il entraîne les Corbeaux
**Rôle** : tous · **Moment** : après 2020 · **Conditions** : `chars.dembo.statut == 'rival' && year >= 2020`
**DEMBO** *(entraîneur de Corbelin — neutre — survêtement délavé)* — « Donne-moi le ballon, je m'occupe du reste : c'est ce que je leur dis, et ils rigolent. Tu es venu voir quoi ? »
← **Je suis venu te voir** — vestiaire +, relation.dembo +1 — *Il te fait visiter un vestiaire de dix mètres carrés, fièrement.*
→ **Je suis venu voir un joueur** — direction + — *Il te donne le nom avant que tu le demandes.*
**Traces** : dembo_coach · **Lu plus tard par** : 12 (le recrutement), 20, 90

### SCÈNE co.retrouvailles.legruet_dernier_congres  —  Le dernier Congrès
**Rôle** : selectionneur | instance · **Moment** : 2016-2029 · **Conditions** : `chars.legruet.statut == 'retraite'`
**BERTHOMIER** *(retraité — neutre — au fond de la salle)* — « On verra ça après le Congrès, disais-je, et il n'y a plus de Congrès pour moi. Vous vous asseyez à côté ou ça vous coûte des voix ? »
← **Je m'assois à côté** — direction −, parole +2 — *Trois cents personnes vous voient. Il ne dit plus rien de la matinée.*
→ **Je reste debout** — direction + — *Il regarde ailleurs pendant tout le vote.*
**Traces** : legruet_dernier · **Lu plus tard par** : in_congres (epitaph_plus), 31 (sa mort, 2029), 02

### SCÈNE co.retrouvailles.nassir_racheteur  —  Il achète le club d'après
**Rôle** : entraineur | ds | president · **Moment** : après un changement de club · **Conditions** : `relation.nassir != 0 && club_changed`
**ILYAS** *(fonds — neutre — sur l'écran d'une visioconférence)* — « Ce n'est pas un club, c'est un actif, et j'ai acheté celui-ci mardi. Vous êtes dans le périmètre, {toi}. »
← **Je demande mes conditions** — direction +, caisse + — *Il accepte deux points sur trois, et note le troisième.*
→ **Je ne travaille plus là** — direction −−, parole +2 — *L'écran s'éteint. La clause de rupture arrive par courrier.*
**Traces** : nassir_revient · **Lu plus tard par** : en_placard (epitaph_plus ∃), pr_fonds, § 6 Destin

### SCÈNE co.retrouvailles.vialat_agence  —  Elle note les clubs
**Rôle** : president | ds | instance · **Moment** : après 2033 · **Conditions** : `year >= 2033 && relation.vialat != 0`
**VIALAT** *(agence de notation — neutre)* — « Je ne juge pas, je compte, et maintenant je note. Votre club est en B moins ; vous voulez savoir pourquoi, ou vous préférez pas ? »
← **Je veux savoir** — caisse −, direction + — *Onze lignes, dont trois te concernent personnellement.*
→ **Je préfère pas** — tribunes + — *Elle referme le dossier et le publie le lendemain.*
**Traces** : note_agence · **Lu plus tard par** : pr_commission, in_taxi, 20

### SCÈNE co.retrouvailles.mere_mbako_agente  —  Elle en a vingt, maintenant
**Rôle** : ds | entraineur | selectionneur · **Moment** : après 2010 · **Conditions** : `year >= 2010 && relation.mere_mbako != 0`
**la mère de Mbako** *(agente — neutre — un dossier par joueur)* — « Mon fils n'a besoin de personne, et les dix-neuf autres non plus. On commence par lequel ? »
← **Par le gardien** — caisse −, direction + — *Elle sort le bon dossier sans regarder.*
→ **Par le vôtre** — vestiaire +, relation.mere_mbako +1 — *Elle referme les dix-neuf autres. Ça prend du temps.*
**Traces** : agente_des_vingt · **Lu plus tard par** : 12, 14, 20

### SCÈNE co.retrouvailles.paulette_14b_court  —  La place 14B
**Rôle** : tous · **Moment** : après 2009 · **Conditions** : `year >= 2009 && relation.paulette >= 1` · **Ton** : drame sobre
**le stagiaire de l'Écho** *(voix — neutre)* — « Sa place est libre depuis dimanche, tribune Est, quatorze B. Le club se demande s'il faut mettre une plaque ou personne. »
← **Une plaque** — tribunes ++, caisse − — *Un nom en laiton, deux dates, et l'année cinquante et un.*
→ **Personne. Elle détestait ça** — tribunes +, parole +1 — *Le siège reste vide et personne ne s'assoit dessus.*
**Traces** : place_14b_vide · **Lu plus tard par** : jp_place14b (epitaph_plus), ta_loge, 31, 90

### SCÈNE co.retrouvailles.gerard_soleil  —  Une carte postale
**Rôle** : president_amateur | tous · **Moment** : S+2 après `gerard_parti` · **Conditions** : `flag('gerard_parti')`
**GÉRARD** *(par écrit — au dos d'une carte)* — « Ici, on payait en bières, et là-bas on paie en autre chose. Il reste douze mille dans une boîte, sous l'évier du local. »
← **Je vais voir sous l'évier** — caisse ++, tribunes − — *La boîte est là. Il manque exactement ce qu'il lui fallait.*
→ **Je jette la carte** — parole +1, tribunes + — *Personne ne saura. La boîte reste sous l'évier.*
**Traces** : boite_sous_evier · **Lu plus tard par** : pa_buvette (epitaph_plus), 13, 31

### SCÈNE co.retrouvailles.colline_machine  —  L'arbitre et la machine
**Rôle** : instance | entraineur · **Moment** : après 2027 · **Conditions** : `year >= 2027 && relation.colline != 0`
**COLLINE** *(ancien arbitre — neutre — il vouvoie)* — « J'ai vu, pendant vingt ans, et maintenant c'est une machine qui voit. On m'a demandé de lui apprendre à hésiter. »
← **Apprenez-lui** — direction +, tribunes + — *Il accepte, et met deux ans à écrire une règle d'hésitation.*
→ **Ne lui apprenez rien** — direction −, parole +1 — *Il vous serre la main. C'est la première fois.*
**Traces** : arbitre_machine · **Lu plus tard par** : 15, 31 (Nouvelle 2027), in_pages

### SCÈNE co.retrouvailles.camille_dimanche  —  Le téléphone du dimanche
**Rôle** : tous · **Moment** : après `divorce` · **Conditions** : `flag('divorce')` · **Ton** : drame sobre, une par carrière
**CAMILLE** *(au téléphone — neutre)* — « Tu rentres à quelle heure ? Je le demande pour la petite, plus pour moi. »
← **Dimanche, sûr** — vestiaire +, relation.sacha +1, promise — *Tu notes la date sur le planning du club. En rouge.*
→ **Je ne peux pas promettre** — parole +1, relation.camille −1 — *Elle dit « d'accord » et raccroche la première.*
**Traces** : dimanche_promis · **Lu plus tard par** : co.sacha.trahison_succession, ta_loge (epitaph_plus), 90

### SCÈNE co.retrouvailles.fauvel_syndicat  —  Il représente les joueurs
**Rôle** : instance | selectionneur · **Moment** : après 2006 · **Conditions** : `year >= 2006 && relation.fauvel != 0`
**FAUVEL** *(syndicat des joueurs — neutre — une chemise cartonnée)* — « On est un groupe, pas une liste, et là c'est douze mille personnes. Vous nous recevez, ou vous recevez les clubs d'abord ? »
← **Je vous reçois d'abord** — vestiaire ++, direction − — *Les clubs l'apprennent par la presse et n'aiment pas ça.*
→ **Les clubs d'abord** — direction +, tribunes −− — *Il attend trois heures dans le couloir, exprès, devant les caméras.*
**Traces** : syndicat_recu · **Lu plus tard par** : 15, in_motion, 31 (la grève, 2026)

### SCÈNE co.retrouvailles.barbier_benevole  —  Il revient à Trébignac
**Rôle** : president_amateur | ds · **Moment** : après 2006 · **Conditions** : `chars.barbier.statut == 'retraite'`
**BARBIER** *(bénévole, en doudoune — sourire)* — « Je l'ai vu jouer sous la pluie, et je le referai gratuitement le samedi matin. Vous avez un carnet à me prêter ? »
← **Je vous en donne un neuf** — direction +, vestiaire + — *Il l'ouvre à la première page et écrit une date.*
→ **Prenez le mien** — relation.barbier +1, caisse − — *Il lit tes notes et corrige deux mots au crayon.*
**Traces** : carnet_barbier · **Lu plus tard par** : 10 (l'essai), 12 (l'algorithme contre l'œil), 90

---

## 5. Les fins

### 5.1 L'index des cent douze plaques

Le Cimetière est un mur de casiers ; chaque plaque est grise tant qu'elle n'est pas découverte (« Fins découvertes 17 / **112** »). **Deux jauges qui cassent sur la même carte : la première dans l'ordre du HUD gagne** ; **une jauge qui casse au Verdict : l'épitaphe d'objectif remplace celle de la jauge**.

**Le compte, recompté une fois pour toutes** (le titre annonçait quatre-vingt-onze, le tableau en additionnait cent quinze) : 64 + 14 + 7 + 7 + 5 + 6 + 8 + 4 = **115 lignes**, moins **trois doublons** — `in_radiation` compté deux fois (jauge et judiciaire), `jubile` et `grand_deballage` comptés chacun dans deux familles — soit **112 plaques**, dont 25 existent déjà dans `content/endings.yaml` (22 de rôle + 3 universelles). C'est ce chiffre qui va au compteur du Cimetière et à `endings.yaml` (charte § 5.3 j).

| Famille | Nombre | Qui les écrit |
|---|---|---|
| Fins de jauge, huit rôles (2 par jauge) | 64 | 10 (`am_*`, `jp_*`), 11 (`en_*`), 12 (`ds_*`), 13 (`pa_*`, `pr_*`), 14 (`sl_*`), 15 (`in_*`) — 23 déjà dans `content/endings.yaml` |
| Fins de choix et de chaîne | 14 | 10, 11 (les gestes du terrain) et **30** (`co_cheque`, `en_chaussure`, `sl_verre_de_vin`, `sl_mariage`, `co_ministre`) |
| Fins judiciaires et financières | 7 (dont `in_radiation`, **déjà compté** dans les fins de jauge : ne compte qu'une fois) | 13 (`pr_valise`, `pr_ecoutes`) et **30** (`co_ligue_fermee`, `co_dix_huit_mois`, `pr_sponsor`, `in_radiation`, `pa_pelouse`) |
| Fins d'imposture et de destin | 7 | 10 (`jp_faux_cousin`, `jp_fax`, `jp_agent`, `jp_statue`), 11 (`en_consultant`) et **30** (`in_aeroport`, `in_congres`) |
| Fins d'objectif | 5 | 10 (`jp_pouce`) et **30** (`co_relegation`, `co_photo_famille`, `sl_non_qualification`, `in_reforme`) |
| Fins de fin de vie et fins dorées | 6 (dont `jubile` ∃, **déjà compté** dans les fins qui concluent une histoire) | **30** en entier (`ta_loge`, `mort_au_poste`, `statue_de_bronze`, `burn_out`, `pa_dernier_derby`, `jubile` ∃) |
| Fins qui concluent une histoire | 4 ∃ + 4 | ∃ : `en_valise`, `en_dauphin`, `jp_exil`, `jp_consultant` · **30** : `co_pacte_tenu`, `pa_gerard_revenu`, `sl_bus_descendu`, `in_lanceur_alerte` |
| Fins de monde (tardives) | 4 (dont `grand_deballage` ∃, **déjà compté** parmi les universelles existantes) | **30** (`co_fuyard`, `co_greve_mondiale`, `pr_franchise`, `grand_deballage` ∃) |
| **Total après déduplication** | **112** | c'est le dénominateur du Cimetière |

### 5.2 Les fins de choix et de chaîne

### FIN co_cheque  —  Le Chèque
**Rôle** : tous sauf joueur amateur · **Cause** : choix (accepter l'indemnité quand le patron la propose ; score ×0,7) · **Rareté** : commune · **Dorée** : non · **Partageable** : oui
**Épitaphe** : « Tu as pris le chèque. Il était gros, la porte aussi, et {prenom} {nom} est sorti{pg, select, f{e} other{}} en marchant droit. »
**epitaph_plus** : — si `relation.aulard <= -1` : « Il ne l'a pas daté. La banque non plus, pendant trois semaines. » · — si `flag('promise')` : « La promesse d'août tenait sur une ligne ; le chèque, sur deux. »
**Et si…** : `le_vautour` (consultant) · **Almanach** : « {annee} · Départ négocié : un communiqué de trois lignes et un chèque non daté. »

### FIN en_chaussure  —  La chaussure
**Rôle** : entraîneur · **Cause** : choix (trait Sanguin, défaite en Coupe) · **Rareté** : rare · **Dorée** : non · **Partageable** : oui
**Épitaphe** : « Tu as shooté dans une chaussure. Elle a atterri sur l'arcade de ta star, et la star avait un compagnon dans la presse. »
**epitaph_plus** : — si `relation.dembo <= -1` : « Il a montré l'arcade en direct, longuement, sous trois angles. » · — si `flag('otage_kop')` : « Le virage a chanté « encore » ; le président a lu ça comme un programme. »
**Et si…** : `le_vautour` · **Almanach** : « {annee} · Une chaussure, une arcade, un vestiaire évacué en huit minutes. »

### FIN sl_verre_de_vin  —  Le verre de vin
**Rôle** : sélectionneur · **Cause** : choix (le faux homme d'affaires) · **Rareté** : rare · **Dorée** : non · **Partageable** : oui
**Épitaphe** : « Un journaliste déguisé en homme d'affaires, un verre de vin, une phrase de trop. Soixante-sept jours à la tête du pays. »
**epitaph_plus** : — si `enemy('meneche')` : « Il avait « juste une question, hors micro ». Il avait aussi un micro. » · — si `flag('selection_refusee')` : « La phrase concernait un joueur qui avait dit non. Il l'a lue au petit déjeuner. »
**Et si…** : `le_vautour` · **Almanach** : « {annee} · Une phrase dans un restaurant, deux pages dans un tabloïd, un contrat rompu. »

### FIN sl_mariage  —  La demande en mariage
**Rôle** : sélectionneur · **Cause** : choix (éliminé, l'interview) · **Rareté** : rare · **Dorée** : non · **Partageable** : oui
**Épitaphe** : « Éliminé{pg, select, f{e} other{}}, tu as profité de l'interview pour demander Camille en mariage. Camille a dit oui ; la Fédération, non. »
**epitaph_plus** : — si `relation.vence >= 1` : « Elle a tenu le micro sans rien dire pendant onze secondes. C'est un record. » · — si `flag('sacha_nee')` : « Sacha regardait, et elle a raconté ça toute sa vie, dans les deux sens. »
**Et si…** : `couple_d_affaires` · **Almanach** : « {annee} · Une élimination, une demande en mariage en direct, une rupture de contrat. »

### FIN co_ministre  —  Le Ministre
**Rôle** : sélectionneur | président · **Cause** : choix (accepter le ministère ; Aubert à +2) · **Rareté** : rare · **Dorée** : oui · **Partageable** : oui
**Épitaphe** : « Champion{pg, select, f{ne} other{}}, tu as été nommé{pg, select, f{e} other{}} au ministère des Sports. Tu as regretté les défenseurs centraux dès la deuxième réunion. »
**epitaph_plus** : — si `relation.aubert >= 2` : « Elle t'a passé le bureau, la plante verte et la liste de ses ennemis. » · — si `flag('aubert_ministre')` : « Le stade, c'est de l'argent public ; le ministère, c'est le même argent, en plus lent. »
**Et si…** : — · **Almanach** : « {annee} · {nom} entre au ministère des Sports. Le club reçoit une lettre de félicitations. »

### 5.3 Les fins judiciaires et financières

### FIN co_ligue_fermee  —  La Ligue fermée
**Rôle** : président | instance · **Cause** : chaîne (les 60 heures) · **Rareté** : rare · **Dorée** : non · **Partageable** : oui
**Épitaphe** : « Tu as annoncé une ligue fermée un dimanche soir. Elle a été enterrée le mardi, et {prenom} {nom} le mercredi. »
**epitaph_plus** : — si `relation.montoya >= 1` : « Quatorze clubs, une table, et une seule chaise retirée : la tienne. » · — si `flag('pacte_gege')` : « Le virage avait un pacte avec toi ; il l'a rendu à la craie, sur le mur du local. »
**Et si…** : `le_repenti` · **Almanach** : « {annee} · Une ligue fermée annoncée dimanche, enterrée mardi, oubliée jeudi. »

### FIN co_dix_huit_mois  —  Dix-huit mois
**Rôle** : tous · **Cause** : chaîne (CAISSE > 85 et la carte du fisc) · **Rareté** : rare · **Dorée** : non · **Partageable** : non
**Épitaphe** : « Fraude fiscale, dix-huit mois, une cellule avec vue sur un parking. Ton codétenu te demandait des pronostics et tu les donnais faux. »
**epitaph_plus** : — si `flag('offshore')` : « La société du cousin s'appelait comme une plage. Le juge a demandé laquelle. » · — si `flag('primes_cachees')` : « Le sponsor payait le 3 du mois, en liquide, dans une enveloppe kraft. »
**Et si…** : `le_repenti` · **Almanach** : « {annee} · Dix-huit mois pour {nom}. Le club a retiré la photo du couloir. »

### FIN pr_sponsor  —  Le sponsor
**Rôle** : président · **Cause** : chaîne (le sponsor douteux) · **Rareté** : rare · **Dorée** : non · **Partageable** : oui
**Épitaphe** : « Ton sponsor maillot était une société-écran. Le maillot était très joli ; on l'a vu dans le journal, rubrique justice. »
**epitaph_plus** : — si `flag('naming_signe')` : « Le stade portait le même nom. Il a fallu deux nuits et une grue pour l'enlever. » · — si `relation.gege <= -1` : « Le virage jouait en maillot blanc depuis huit mois. Il avait lu avant tout le monde. »
**Et si…** : `le_repenti` · **Almanach** : « {annee} · Le sponsor maillot de {club} n'existait pas. Le maillot, si. »

### FIN in_radiation  —  La radiation
**Rôle** : dirigeant d'instance · **Cause** : chaîne (les valises) · **Rareté** : rare · **Dorée** : non · **Partageable** : non
**Épitaphe** : « Suspendu{pg, select, f{e} other{}} huit ans de toute activité liée au football. Tu as pris un abonnement au golf, et tu n'aimes pas le golf. »
**epitaph_plus** : — si `flag('vote_achete')` : « Les dix-huit millions de pages en citaient quatre cents. On les a lues à voix haute. » · — si `relation.amsel <= -2` : « Elle avait tout son temps. Elle en a pris huit ans, comme toi. »
**Et si…** : `le_repenti` · **Almanach** : « {annee} · Radiation de huit ans. Le comité d'éthique a publié un communiqué de onze lignes. »

### FIN pa_pelouse  —  La pelouse
**Rôle** : président amateur · **Cause** : chaîne (subvention détournée) · **Rareté** : rare · **Dorée** : non · **Partageable** : oui
**Épitaphe** : « La mairie a repris le stade. Tu as joué tes matchs à domicile dans un parc, et le parc n'avait ni tribune ni toi. »
**epitaph_plus** : — si `relation.aubert <= -2` : « Elle a coupé le ruban du parking à la place du stade, en écharpe. » · — si `flag('magot_liquide')` : « La boîte en fer a été comptée devant témoin. Il manquait le montant d'un chauffage. »
**Et si…** : `le_repenti` · **Almanach** : « {annee} · {club} joue dans un parc. Les buts sont deux blousons. »

### 5.4 Les fins d'imposture, de destin et d'objectif

### FIN in_aeroport  —  Le mauvais aéroport
**Rôle** : dirigeant d'instance · **Cause** : chaîne (le Congrès déplacé) · **Rareté** : rare · **Dorée** : non · **Partageable** : oui
**Épitaphe** : « Le Congrès qui devait te réélire s'est tenu sur une autre île. On a voté sans toi, par respect pour l'horaire. »
**epitaph_plus** : — si `relation.dauzat <= -1` : « C'était dans le procès-verbal, en bas de la page onze, en petits caractères. » · — si `relation.josiane >= 2` : « Elle avait imprimé le bon billet. Quelqu'un l'a échangé dans le classeur. »
**Et si…** : — · **Almanach** : « {annee} · Congrès délocalisé. Le président sortant était à l'aéroport de l'autre île. »

### FIN in_congres  —  Battu au Congrès
**Rôle** : dirigeant d'instance · **Cause** : objectif (réélection perdue) · **Rareté** : commune · **Dorée** : non · **Partageable** : oui
**Épitaphe** : « Cent douze voix contre quatre-vingt-dix-neuf. Tu avais promis un Mondial à tout le monde ; tout le monde a préféré la promesse de l'autre. »
**epitaph_plus** : — si `flag('districts_perdus')` : « Trois cents districts votent comme un seul homme, et cet homme ne t'aimait pas. » · — si `relation.malbec <= -1` : « Entre présidents, on se comprend : il avait compris deux ans avant toi. »
**Et si…** : `le_repenti` · **Almanach** : « {annee} · {nom} battu{pg, select, f{e} other{}} au Congrès de treize voix. »

### FIN co_relegation  —  La relégation
**Rôle** : entraîneur | DS | présidents · **Cause** : objectif (au Verdict) · **Rareté** : commune · **Dorée** : non · **Partageable** : oui
**Épitaphe** : « Descendu{pg, select, f{e} other{}} en division inférieure. Le stade a paru très grand d'un coup, et les actionnaires très petits. »
**epitaph_plus** : — si `flag('salaires_retard')` : « Les salaires de mai sont tombés en août, dans une division de moins. » · — si `relation.gege >= 1` : « Le virage a chanté jusqu'à la fin, et il est resté. C'est ce qui fait le plus mal. »
**Et si…** : — · **Almanach** : « {annee} · {club} descend. La tribune Nord est restée un quart d'heure après le coup de sifflet. »

### FIN co_photo_famille  —  La photo de famille
**Rôle** : entraîneur | DS · **Cause** : objectif (manqué d'un point) · **Rareté** : commune · **Dorée** : non · **Partageable** : oui
**Épitaphe** : « Sixième à un point. On a refait la photo de famille du club sans toi, et le photographe s'est excusé, lui. »
**epitaph_plus** : — si `flag('promise')` : « La promesse d'août était affichée au local, datée, à la craie. » · — si `relation.aulard >= 1` : « Mon {prenom}, a-t-il dit, on n'a pas eu de chance. Il l'a dit à ton successeur aussi. »
**Et si…** : — · **Almanach** : « {annee} · {club} sixième à un point de la Continentale. La photo a été prise le lendemain. »

### FIN sl_non_qualification  —  La non-qualification
**Rôle** : sélectionneur · **Cause** : objectif · **Rareté** : commune · **Dorée** : non · **Partageable** : oui
**Épitaphe** : « Le pays regardera le tournoi à la télévision. Toi aussi, mais dans une autre langue, depuis un pays où l'on ne te reconnaît pas encore. »
**epitaph_plus** : — si `flag('binational_bloque')` : « Le joueur que tu n'as pas appelé s'est qualifié avec l'autre maillot. » · — si `flag('selection_refusee')` : « Trois avaient dit non ; on n'a retenu que celui qui avait dit oui trop tard. »
**Et si…** : — · **Almanach** : « {annee} · Le pays reste à la maison. La Fédération publie un communiqué de six lignes. »

### FIN in_reforme  —  La réforme enterrée
**Rôle** : dirigeant d'instance · **Cause** : objectif · **Rareté** : commune · **Dorée** : non · **Partageable** : oui
**Épitaphe** : « Ta grande réforme a été rejetée par cent quatre-vingts voix. Elle sera votée dans dix ans, sous un autre nom, par quelqu'un d'autre. »
**epitaph_plus** : — si `relation.bambini <= -1` : « Il « était choqué » avant le vote, ce qui est une façon de compter. » · — si `flag('syndicat_recu')` : « Les joueurs l'avaient soutenue. Personne ne leur a demandé leur voix. »
**Et si…** : — · **Almanach** : « {annee} · Réforme rejetée. Le rapport de quatre cents pages est archivé au sous-sol. »

### FIN in_extrade  —  Extradé

**Rôle** : dirigeant d'instance · **Cause** : chaîne (les valises, V5 : tu n'as pas ouvert et tu es parti par l'escalier de service) · **Rareté** : rare · **Dorée** : non · **Partageable** : oui
**Épitaphe** : « Tu es sorti{pg, select, f{e} other{}} par l'escalier de service, en peignoir d'hôtel, à six heures dix. Trois pays plus tard, {prenom} {nom} est rentré{pg, select, f{e} other{}} menotté{pg, select, f{e} other{}}, en costume prêté. »
**epitaph_plus** : — si `relation.amsel <= -2` : « Elle avait tout son temps. Elle a mis quatre ans, et elle n'a jamais couru. » · — si `flag('vote_achete')` : « Le drap blanc de l'hôtel est l'image la plus partagée de la décennie. »
**Et si…** : `le_repenti` · **Almanach** : « {annee} · Extradition. Le vol a fait escale ; on a filmé l'escale. »
*(Image de partage : le drap blanc de l'hôtel, plié sur la rambarde de l'escalier.)*

### FIN in_integre_chomage  —  Intègre et au chômage

**Rôle** : dirigeant d'instance · **Cause** : choix (V6 : tu as tout refusé et tout documenté) + défaite au vote · **Rareté** : rare · **Dorée** : **oui** · **Partageable** : oui
**Épitaphe** : « Tu as tout refusé et tout documenté, ligne par ligne, pendant quatre ans. {prenom} {nom} a perdu de treize voix, et personne ne t'a proposé autre chose. »
**epitaph_plus** : — si `flag('temoin_amsel')` : « La procureure a gardé ton dossier à part, dans une chemise sans nom. » · — si `flag('lanceur_alerte')` : « Dauzat a écrit « à sa demande » dans le procès-verbal. C'était vrai, et ça t'a coûté treize voix. »
**Et si…** : — (une carrière propre n'a pas de rebond : c'est le prix) · **Almanach** : « {annee} · Battu{pg, select, f{e} other{}} de treize voix, sans une tache. Le procès-verbal fait quatre pages. »

### FIN in_memoires  —  Les Mémoires

**Rôle** : dirigeant d'instance (et président pro après 2025) · **Cause** : âge, ou retrait volontaire au Bilan · **Rareté** : commune · **Dorée** : **oui** · **Partageable** : oui
**Épitaphe** : « Tu es parti{pg, select, f{e} other{}} debout, un mardi, sans communiqué. Le livre de {prenom} {nom} s'est vendu correctement, et le chapitre huit a été relu par un avocat. »
**epitaph_plus** : — si `relation.meneche >= 2` : « Massenet a écrit la préface, hors micro, et l'a signée quand même. » · — si `flag('dossier_enterre')` : « Le chapitre huit s'arrête à la page cent douze. La suite existe, chez l'avocat. »
**Et si…** : `le_vautour` · **Almanach** : « {annee} · Les Mémoires. Le chapitre huit a été relu par un avocat, deux fois. »

### 5.5 Les fins de fin de vie, les fins dorées et les fins qui concluent une histoire

### FIN ta_loge  —  Ta loge
**Rôle** : tous · **Cause** : âge (78 ans) · **Rareté** : rare · **Dorée** : oui · **Partageable** : oui
**Épitaphe** : « Tu t'es endormi{pg, select, f{e} other{}} dans ta loge à la soixante-dixième, souriant{pg, select, f{e} other{}}. Le derby a été gagné ; on ne t'a pas réveillé{pg, select, f{e} other{}}. »
**epitaph_plus** : — si `flag('place_14b_vide')` : « Deux sièges vides ce jour-là : le quatorze B et le tien. » · — si `flag('dimanche_promis')` : « Sacha était à côté. Elle a fait signe qu'on baisse la musique. »
**Et si…** : — · **Almanach** : « {annee} · {prenom} {nom} s'est endormi{pg, select, f{e} other{}} en loge à la 70e. Le stade l'a su à la 92e. »

### FIN mort_au_poste  —  Mort au poste
**Rôle** : tous · **Cause** : âge (après 70 ans, la carte du médecin) · **Rareté** : rare · **Dorée** : non · **Partageable** : non · **Ton** : drame sobre, sans blague
**Épitaphe** : « Tu es mort{pg, select, f{e} other{}} dans ton fauteuil, au stade, pendant la quatre-vingt-neuvième minute. L'arbitre a ajouté une minute d'arrêt de jeu. »
**epitaph_plus** : — si `relation.sabatier >= 1` : « Le médecin était à trois rangs. Ça reste entre la table et lui. » · — si `relation.vecchio >= 2` : « Le vieux gardien s'est levé le premier, et il est resté debout tout le temps. »
**Et si…** : — · **Almanach** : « {annee} · Minute de silence à la Marmite. L'arbitre a rendu la minute. »

### FIN statue_de_bronze  —  La statue de bronze
**Rôle** : tous · **Cause** : choix volontaire (dixième saison, Réputation > 85, aucune jauge sous 40) · **Rareté** : rare · **Dorée** : oui · **Partageable** : oui
**Épitaphe** : « Tu as tout gagné, tout dit, et tu es parti{pg, select, f{e} other{}} avant qu'on te le demande. On a coulé la statue en bronze, pas en résine. »
**epitaph_plus** : — si `flag('pacte_gege')` : « Le virage a payé le socle, en pièces, dans une boîte en fer. » · — si `flag('clow_revu')` : « Un vieux monsieur qui se disait devant a dit qu'il n'était pas surpris. Il mentait bien. »
**Et si…** : — · **Almanach** : « {annee} · Statue de {nom} devant la Tribune Nord. Elle est en bronze, on a vérifié. »

### FIN burn_out  —  Le burn-out
**Rôle** : tous · **Cause** : chaîne (trois cartes Pression d'affilée, série noire) · **Rareté** : commune · **Dorée** : non · **Partageable** : non · **Ton** : drame sobre, jamais en S0
**Épitaphe** : « Tu as fait un malaise à la troisième conférence de presse de la journée. Le médecin a prescrit du repos, le président un remplaçant. »
**epitaph_plus** : — si `relation.camille >= 1` : « Elle est venue à l'hôpital avec des vêtements propres et aucune question. » · — si `flag('divorce')` : « Personne n'avait le numéro à appeler. On a appelé le club. »
**Et si…** : `le_vautour` · **Almanach** : « {annee} · Arrêt maladie. Le communiqué parle de « raisons personnelles » en deux lignes. »

### FIN pa_dernier_derby  —  Le dernier derby
**Rôle** : président amateur · **Cause** : âge (80 ans, refuser de passer la main) · **Rareté** : rare · **Dorée** : oui · **Partageable** : oui
**Épitaphe** : « Tu as présidé le club soixante ans. Le dernier derby a été gagné, et tu ne l'as pas su : tu t'étais endormi{pg, select, f{e} other{}} à la soixante-dixième. »
**epitaph_plus** : — si `flag('boite_sous_evier')` : « La buvette a fait sa meilleure recette du siècle ce jour-là. » · — si `relation.dede >= 2` : « Son sifflet était dans ta poche. On l'a rendu au vestiaire. »
**Et si…** : — · **Almanach** : « {annee} · Soixante ans de présidence à {club}. Le dernier derby a été gagné. »

### FIN co_pacte_tenu  —  Le local rénové
**Rôle** : entraîneur | président · **Cause** : chaîne (conclut *Le kop qui aime trop* : `pacte_gege` tenu, tribunes ≥ 70, départ volontaire) · **Rareté** : rare · **Dorée** : oui · **Partageable** : oui
**Épitaphe** : « Le local a été rénové, la date est restée à la craie, et ton nom est sur le mur au-dessus. Tu es parti{pg, select, f{e} other{}} le jour de l'inauguration. »
**epitaph_plus** : — si `flag('onze_du_virage')` : « Le onze du virage est encadré à côté. Il ressemble beaucoup au tien. » · — si `relation.gege >= 3` : « Il a fait le discours. Deux phrases, et il s'est arrêté au milieu de la deuxième. »
**Et si…** : — · **Almanach** : « {annee} · Le local de la Tribune Nord rénové. La craie de {annee} n'a pas été effacée. »

### FIN pa_gerard_revenu  —  La boîte rendue
**Rôle** : président amateur · **Cause** : chaîne (conclut *Gérard a fui* : `boite_sous_evier` trouvée et rendue au club) · **Rareté** : rare · **Dorée** : oui · **Partageable** : oui
**Épitaphe** : « Il est revenu un samedi de novembre, avec la boîte et douze mille {monnaie} dedans. Il a repris son tablier sans qu'on lui demande. »
**epitaph_plus** : — si `relation.gerard >= 2` : « Personne n'a jamais reparlé du soleil, ni de rien. » · — si `flag('village_uni')` : « Le village a fait comme s'il n'était jamais parti. C'est ce qu'il voulait. »
**Et si…** : — · **Almanach** : « {annee} · La caisse de la buvette est revenue. Elle était plus lourde qu'au départ. »

### FIN sl_bus_descendu  —  Le bus est descendu
**Rôle** : sélectionneur · **Cause** : chaîne (conclut *Le bus* : `bus_menace` puis `bus_descendu`, groupe ≥ 70) · **Rareté** : rare · **Dorée** : oui · **Partageable** : oui
**Épitaphe** : « Le bus est descendu à l'heure, un par un, en silence. Ce sont les vingt-six qui ont demandé à te garder. »
**epitaph_plus** : — si `relation.fauvel >= 2` : « Le capitaine est descendu le dernier, exprès, pour compter. » · — si `flag('gigi_staff')` : « Le vieux gardien est descendu le premier, comme toujours. »
**Et si…** : — · **Almanach** : « {annee} · Le bus est descendu. Personne n'a expliqué pourquoi il avait failli ne pas le faire. »

### FIN in_lanceur_alerte  —  Le lanceur d'alerte
**Rôle** : dirigeant d'instance · **Cause** : chaîne (conclut *Les valises* : `lanceur_alerte`, Parole ≥ +3) · **Rareté** : rare · **Dorée** : oui · **Partageable** : oui
**Épitaphe** : « Tu as donné les documents toi-même, avec les pages qui te concernaient. Tu n'as plus jamais été invité{pg, select, f{e} other{}} nulle part. »
**epitaph_plus** : — si `relation.la_plume >= 2` : « Elle a protégé sa source pendant onze ans, y compris de toi. » · — si `flag('vote_achete')` : « Quatre cents pages portaient ton nom. Tu les avais surlignées. »
**Et si…** : `le_repenti` · **Almanach** : « {annee} · Dix-huit millions de pages, remises par quelqu'un de la maison. »

### 5.6 Les fins de monde (tardives)

### FIN co_fuyard  —  La porte de sortie, la troisième fois
**Rôle** : tous · **Cause** : chaîne (`fuyard` posé trois fois) · **Rareté** : commune · **Dorée** : non · **Partageable** : oui
**Épitaphe** : « Tu es parti{pg, select, f{e} other{}} avant la fin trois fois de suite. La quatrième, personne n'a proposé de porte. »
**epitaph_plus** : — si `parole <= -3` : « Douze promesses en cours, aucune close, et un carnet d'adresses qui ne répond plus. » · — si `relation.josiane >= 1` : « Elle avait gardé les trois lettres de démission. Elles se ressemblent beaucoup. »
**Et si…** : `le_vautour` · **Almanach** : « {annee} · Troisième départ anticipé. Le téléphone de {nom} a cessé de sonner en juillet. »

### FIN co_greve_mondiale  —  La grève
**Rôle** : instance | président | sélectionneur · **Cause** : chaîne (2026, `monde_greve` mal négocié) · **Rareté** : rare · **Dorée** : non · **Partageable** : oui
**Épitaphe** : « Soixante-douze matchs par saison, et un jour où personne n'est venu. Le stade est resté ouvert toute la journée, vide et éclairé. »
**epitaph_plus** : — si `relation.fauvel <= -1` : « Il avait envoyé une lettre de onze lignes. La onzième était une date. » · — si `flag('syndicat_recu')` : « Tu les avais reçus. Tu ne les avais pas écoutés jusqu'au bout. »
**Et si…** : — · **Almanach** : « {annee} · Grève mondiale des joueurs. Aucun match, aucune image, une seule photo. »

### FIN pr_franchise  —  La franchise
**Rôle** : président · **Cause** : chaîne (après 2040, le club déplacé) · **Rareté** : rare · **Dorée** : non · **Partageable** : oui
**Épitaphe** : « Le club a été déplacé de quatre cents kilomètres avec ses couleurs et son nom. Il ne restait à {ville} qu'un stade et une habitude. »
**epitaph_plus** : — si `relation.gege <= -2` : « La tribune n'oublie rien : elle a refondé un club en District, sans toi. » · — si `flag('naming_signe')` : « Le nom du sponsor a suivi. C'est la seule chose qui a suivi. »
**Et si…** : `le_repenti` · **Almanach** : « {annee} · {club} joue à quatre cents kilomètres. Les abonnés ont reçu un courrier. »

### 5.7 Les vingt-trois `epitaph_plus` des fins existantes  (livrés)

`content/endings.yaml` contient **vingt-cinq** ids : les douze `en_*`, les dix `jp_*`, et trois universels (`grand_deballage`, `jubile`, `generique`). Les vingt-trois fins de rôle et de geste sont **conformes** (titre, épitaphe de deux phrases, une variante qui nomme le joueur, accord de genre) : **on ne touche pas à leur épitaphe**. Trois observations sans réécriture : (1) `en_tribune` est le seul drame mortel du rôle entraîneur — il reste `share: false` ; (2) `jp_exil` et `jp_consultant` concluent une intrigue et gardent leur `rebond` réservé ; (3) `generique` n'en reçoit pas : c'est le secours, il ne commente rien.

Ce que la relecture demandait, et qui manquait : **les `epitaph_plus`**. Les voici, deux au plus par fin, la première vraie gagne. Chacun se branche sur une trace **déjà écrite** ailleurs dans la bible : c'est ce qui rend visibles quarante traces aujourd'hui muettes. Ils s'ajoutent à `endings.yaml` dans le champ `epitaph_plus`, sans autre changement.

| Fin ∃ | `epitaph_plus` n° 1 (condition → phrase) | `epitaph_plus` n° 2 |
|---|---|---|
| `en_bus` | `flag('bus_menace')` → « Le bus était déjà resté une fois, en novembre. Personne n'avait compté. » | `relation.brehaut <= -2` → « Le groupe vivait bien, disait-il. Il vivait bien sans toi. » |
| `en_copain` | `flag('onze_du_virage')` → « Le virage avait fait la compo un samedi. Il l'a refaite tous les samedis. » | `relation.vecchio >= 2` → « Gigi t'a gardé la Une. Il l'a pliée en quatre, comme un mot d'excuse. » |
| `en_banderole` | `flag('pacte_renie')` → « La date était à la craie sur le mur du local. Quelqu'un l'a repassée au marqueur. » | `flag('echarpe_rendue')` → « L'écharpe est revenue par la poste, lavée. C'était la première fois. » |
| `en_otage` | `flag('pacte_gege')` → « Tu avais tapé dans la main. La main s'est refermée en janvier. » | `flag('echarpe_rendue')` → « Gégé a rendu l'écharpe au local, sans un mot, devant douze personnes. » |
| `en_sms` | `flag('vukic_dauphin')` → « Zoran a lu le message avant toi : il était en copie, par erreur. » | `flag('faute_lue')` → « Il y avait une faute au troisième mot. Tu l'as relue quatorze fois. » |
| `en_placard` | `flag('club_actif')` → « Le bureau donnait sur le parking du personnel. Ce n'est pas un club, c'est un actif. » | `flag('titre_directeur')` → « Directeur du Développement International : quatre mots, aucune fenêtre. » |
| `en_decoupe` | `flag('mbako_vendu')` → « Le gamin valait trente millions. Le plateau les a comptés en deux minutes. » | `relation.meneche <= -2` → « Hors micro, il avait prévenu. À l'antenne, il ne prévient pas. » |
| `en_coupable` | `flag('commission_lettre')` → « L'Inspecteur ne jugeait pas, elle comptait. On t'a jugé avec ses chiffres. » | `flag('vialat_ligne_douze')` → « La ligne douze était juste. C'est la seule qui l'était. » |
| `en_tribune` | `flag('tribune_signalee')` → « Le rapport était sur le bureau depuis mars. Il y est encore. » | `relation.gege >= 2` → « Le virage n'a pas chanté pendant deux ans. Personne ne le leur a demandé. » |
| `en_retraite` | `flag('clow_stage')` → « Lundi, huit heures, tu y étais à sept. Ça n'a servi à rien, et ça a tout servi. » | `flag('gigi_staff')` → « Gigi t'a serré la main aux gants. Il ne les enlève jamais. » |
| `en_valise` | `flag('camille_ici')` → « Elle avait fait la valise avant toi, deux fois, et l'avait défaite deux fois. » | `flag('divorce')` → « La chambre d'amis est restée faite pendant huit mois. » |
| `en_dauphin` | `flag('vukic_dit')` → « Tu lui avais dit que c'était lui. Il l'a répété à son adjoint, dix ans après. » | `flag('cahier_perdu')` → « Il a gardé le cahier. Deux pages étaient de ta main. » |
| `jp_mouton` | `flag('groupe_cobalts')` → « Tu avais mangé avec le groupe, une fois. Ils s'en souviennent mieux que toi. » | `relation.brehaut <= -2` → « Le capitaine t'a appelé par ton numéro jusqu'au dernier jour. » |
| `jp_porteparole` | `flag('yacht_dembo')` → « L'aile de poulet, c'était sur le bateau de pêche. Il n'y avait pas de yacht. » | `flag('special')` → « Tu avais dit « le Spécial » en riant. Ils ne riaient pas. » |
| `jp_siffle` | `flag('groupe_cobalts')` → « Même en bleu cobalt, le stade te sifflait. Fauvel chantait pour deux. » | `flag('transfert_siecle')` → « Il y avait eu un pont pour t'emmener. Il n'y en a pas pour revenir. » |
| `jp_sandwich` | `flag('genou')` → « Le genou disait la vérité depuis trois ans. Le sandwich l'a dite plus vite. » | `flag('pharmacie_ouverte')` → « L'armoire était ouverte, la table était propre. Ça restait entre la table et toi. » |
| `jp_place14b` | `flag('place_14b_vide')` → « Personne ne s'assoit en 14B. Gigi y met une orange, le dimanche. » | `relation.paulette >= 2` → « Elle était là en cinquante et un. Elle a retenu ton prénom, ce qui est rare. » |
| `jp_fils` | `flag('sacha_promesse_rompue')` → « Tu avais promis juin. En juin il y a eu un Bilan. » | `flag('sacha_promesse_tribune')` → « Elle a compté les marches du stade. Quarante-deux, et elle les a montées seule. » |
| `jp_sansclub` | `flag('clause_lue')` → « Sa mère l'avait lue, la clause. Elle l'avait même écrite. » | `flag('libre_chez_rival')` → « Le trou au poste s'est refermé en une semaine. Il ne s'est pas refermé sur toi. » |
| `jp_panama` | `flag('offshore')` → « La société avait un nom de bateau et une adresse de boîte aux lettres. » | `flag('pari_9')` → « Le neuf était un bon pari. C'est le seul que personne n'a oublié. » |
| `jp_exil` | `flag('banc_dore_retour')` → « Tu es rentré à vingt-neuf ans. Le continent avait changé de nom pour les stades. » | `flag('retour_promis_gege')` → « La promesse était à la craie. Le mur a été repeint en 2018. » |
| `jp_consultant` | `flag('special')` → « Tu as refait « le Spécial » à l'antenne. Ça a marché la deuxième fois. » | `relation.meneche >= 2` → « Il t'a tendu le micro sans le couper. C'était sa façon de dire merci. » |
| `grand_deballage` | `flag('sacha_promesse_rompue')` → « Page douze : Sacha, juin. Le reste du livre parle d'argent. » | `flag('telegramme_clow')` → « Le télégramme était dans la poche de la doudoune. Sept mots, il les comptait. » |
| `jubile` | `flag('pacte_tenu')` → « Le local a été rénové avant le jubilé. La date est restée gravée dessous. » | `flag('gigi_staff')` → « Gigi a fait la haie, avec les gants. Il a été le premier à sortir du bus. » |

**Règle d'écriture d'un `epitaph_plus`** (elle vaut pour les cent douze plaques) : **une phrase, jamais deux** ; elle ne répète pas l'épitaphe, elle ajoute le détail que seule cette carrière-là a produit ; elle ne nomme pas le joueur (l'épitaphe l'a déjà fait) ; elle se lit après une seconde de noir.

### 5.8 Les cinq postulats dérivés (« Et si… »)

Proposés en un tap sur l'écran de fin, ils rejouent la carrière depuis la conséquence.

| id | Rôle · année | Depuis quelles fins | Ce qui change au départ | Question de saison |
|---|---|---|---|---|
| `le_revenant` | joueur · année de la fin +1 | `jp_flacon_b`, `jp_pari`, `jp_kungfu`, `jp_morsure` | suspension purgée, Réputation 25, un seul club te répond, drapeau `revenant` | `pardon / vengeance / silence` |
| `le_repenti` | président amateur · année de la fin +2 | `in_radiation`, `co_dix_huit_mois`, `pr_ecoutes`, `co_ligue_fermee`, `pa_pelouse` | Réputation 90, Propreté 0, un club de District, personne ne veut de photo avec toi | `reparer / recommencer / se_taire` |
| `le_vautour` | entraîneur-consultant · année de la fin | `en_consultant`, `co_cheque`, `burn_out`, `en_chaussure` | pas de banc, un plateau télé, une jauge Audience à la place de TRIBUNES | `micro / banc / revanche` |
| `couple_d_affaires` | joueur ou entraîneur · année de la fin | `sl_mariage`, toute fin avec `relation.camille >= 2` | Camille gère ta carrière : elle remplace l'agent, la carte famille devient une carte direction | `argent / couple / carriere` |
| `le_coach_cassette` | entraîneur · 1994 | toute fin où `relation.loco >= 2` | tu joues Anselmo Vaz : un seau, une cassette, un vestiaire qui ne comprend rien | `cassette / seau / peuple` |

---

## 6. Les Cartes Destin de transition

**Règle** (charte § 3.3) : une Carte Destin au plus par saison, au Bilan ou à l'hiver ; jamais si une jauge est sous 20, sauf `parole >= 3` ; refuser est toujours possible ; trois refus ferment la branche deux saisons ; on ne redevient jamais joueur. Chaque Destin a un **liseré or**, une réponse d'une phrase, et une carte **« Le monde réagit »** au tirage suivant (§ 6.3). La **Passation** remet les jauges (`roles.yaml`) ; se conservent la Réputation, les étiquettes, les relations, les ennemis, la Parole, les traits, l'objet, les drapeaux personnels, l'âge et le nom.

### 6.1 Les trente arêtes

| # | De → Vers | Condition | Locuteur — la phrase | Réponse (si tu acceptes) |
|---|---|---|---|---|
| 1 | am → joueur pro | S≥2, Le coach > 50, forme OK | **BARBIER** — « Je bosse pour Valdorne, et il y a un essai mardi. Je l'ai vu jouer sous la pluie, ce gamin-là. » | Tu montes dans la voiture avec un sac de sport. |
| 2 | am → entraîneur amateur | 34 ans, ou blessure grave à 21 | **DÉDÉ** — « Bon, on va pas se mentir : tes genoux, c'est fini. Mon sifflet, il est à toi. » | Tu prends le sifflet et tu ne le rends jamais. |
| 3 | am → président amateur | retraite, Le bistrot ≥ 50, Compte élevé | **PICHON** — « Le pain, c'est à cinq heures ; le club, c'est à toi maintenant. » | Il te donne trois clés et un classeur. |
| 4 | am → arbitre (reconversion) | blessure à 21 ans, Le coach ≥ 60 | **ROUX** — « Le district, c'est la base, et la base manque d'arbitres. Douze samedis et un stage. » | Tu apprends à vouvoyer vingt-deux personnes à la fois. |
| 5 | joueur → entraîneur | âge ≥ 32 ou `genou`, `diplome` | **VUKIĆ** — « Tes jambes parlent, {prenom}. La réserve n'a pas d'entraîneur. » | Tu raccroches les crampons pour le survêtement. |
| 6 | joueur → DS | âge ≥ 30, Le club ≥ 60, `capitaine` | **VAUBOURG** — « Reste, mais en costume. J'ai pas le temps d'expliquer deux fois. » | Tu changes de vestiaire pour un bureau au premier. |
| 7 | joueur → président amateur | retraite, Tribunes ≥ 50, Compte élevé | **GÉRARD** — « Le club de ton enfance te tend les bras. Et la caisse, qui est vide. » | Tu signes le procès-verbal de l'assemblée générale. |
| 8 | joueur → sélectionneur ou Fédération | `legende` (50 sélections + un titre) | **BERTHOMIER** — « On verra ça après le Congrès, cher {prenom}. Le Congrès, c'est demain matin. » | On te présente à trois cents personnes qui applaudissent. |
| 9 | adjoint → entraîneur | intérim gagné, ou offre de National | **VAUBOURG** — « Le coach a été viré hier soir. Tu as trois matchs, pas quatre. » | Tu t'assois à la place de quelqu'un qui n'a pas vidé le tiroir. |
| 10 | entraîneur → sélectionneur | 2 saisons Tribunes ≥ 60 + titre ou montée | **BERTHOMIER** — « On verra ça après le Congrès. Le Congrès, c'est demain. » | Tu rends les clés du centre et tu prends un badge. |
| 11 | entraîneur → DS | Le président ≥ 70 après 3 saisons | **VAUBOURG** — « Reste, mais en costume. Le banc, on le donne à quelqu'un que tu formeras. » | Tu montes d'un étage et tu perds le vestiaire. |
| 12 | entraîneur → consultant | limogeage avec Tribunes > 40 | **VENCE** — « On est en direct, et le plateau est à vous. Un dimanche sur deux, pour commencer. » | Tu découvres qu'un plateau est plus froid qu'un banc. |
| 13 | consultant → sélectionneur | Audience > 85 | **VENCE** — « On est en direct : le peuple vous réclame, et la Fédération regarde l'audience. » | Tu éteins le micro au milieu d'une phrase. |
| 14 | entraîneur (Sylvanie) → sélectionneur de la Sylvanie | `bout_du_monde`, 2 saisons | **le ministre** *(voix)* — « L'expatrié est adopté. Le pays vous demande, et le pays n'a pas d'autre nom. » | On joue un hymne que tu ne connais pas encore. |
| 15 | DS → président pro | le président vend ou tombe, Tribunes ≥ 55 | **GÉGÉ** — « Les supporters te réclament. La tribune n'oublie rien, surtout pas ceux qui achètent bien. » | Tu t'assois dans le fauteuil sans le régler. |
| 16 | DS → Fédération | commission technique, Brissac ≥ +2 | **BRISSAC** — « Les chiffres sont têtus, les joueurs aussi, et les vôtres sont bons. Le Congrès aussi, peut-être. » | Tu reçois un ordre du jour de onze points. |
| 17 | président amateur → district | 2 saisons, Roux ≥ +1 | **ROUX** — « Le district, c'est la base, et la base te propose un siège. Le siège grince. » | Tu deviens la personne qu'on appelle le dimanche soir. |
| 18 | district → ligue | 3 saisons, deux alliés | **MALBEC** — « Entre présidents, on se comprend : la Ligue a une place, et j'ai deux cents voix. » | Tu apprends le mot « pondération ». |
| 19 | président amateur → président pro | quatre divisions en huit saisons, ou rachat | **LÉA** — « Vous confirmez ? Le village est en D2 et personne n'y croit encore. » | Tu signes un contrat de télévision de quarante pages. |
| 20 | président pro → Fédération | 4 saisons, Trésorerie ≥ 55, Actionnaires ≥ 55, 3 alliés | **l'élection** *(Carte Destin double face)* — « Deux cent onze grands électeurs, une salle, deux tours. » | Tu gagnes de neuf voix et tu ne dors pas. |
| 21 | président pro → Union Continentale | bloc des quatorze, Montoya ≥ +2 | **MONTOYA** — « Quatorze clubs, une table, vous êtes assis ou debout ? La chaise est déjà tirée. » | Tu t'assois, et la table est plus longue que prévu. |
| 22 | sélectionneur → Union Continentale | quart de finale + Le pays ≥ 60 | **BAMBINI** — « Le football unit le monde, et mes amis. L'ancienne gloire au comité, cher ami ? » | On te donne un badge, un chauffeur et un dossier. |
| 23 | sélectionneur → entraîneur de club | toujours, au Bilan | **MALBEC** — « Entre présidents, on se comprend : revenez au quotidien, un vrai vestiaire. » | Tu retrouves l'odeur du chlore et des maillots humides. |
| 24 | sélectionneur → ministre | Aubert ≥ +2, titre | **AUBERT** — « Le stade, c'est de l'argent public ; le ministère aussi, et il a un bureau libre. » | *(fin `co_ministre`)* |
| 25 | Fédération → Union Continentale | 2 mandats, une confédération alliée | **DAUZAT** — « C'est dans le procès-verbal : votre candidature est recevable. L'hôtel du Lac est réservé. » | Tu changes de langue de travail et de fuseau. |
| 26 | Union → FédéMonde | 2 mandats, 2 confédérations | **la Campagne** — « Quatre promesses, quatre confédérations, un vote à bulletin secret. » | Tu promets quatre choses différentes en quatre jours. |
| 27 | instance → réélection | tous les 4 ans, obligatoire | **le Congrès** — « Le vote est ouvert. Deux cent onze bulletins, une urne, une heure. » | *(échec : fin `in_congres`)* |
| 28 | tout rôle → Porte de sortie | DIRECTION 10-25, une fois par rôle | **CAMILLE** — « Tu vois le mur arriver, et moi je le vois depuis mars. On part avant ? » | Tu démissionnes un jeudi ; le chômage dure deux cartes. |
| 29 | transition forcée | faillite, décès, coup d'État, blessure, suspension, rachat, mutinerie, l'appel du pays | **JOSIANE** — « J'en ai vu passer, mais pas comme ça. Vous prenez le poste ce soir, ou personne ne le prend. » | Tu signes debout, dans un couloir, sans lire. |
| 30 | lignée → Succession | mort ou retraite, Sacha 18-22 ans | **SACHA** — « Tu m'as promis, et j'ai dix-huit ans. Je prends ton nom ou je prends le mien ? » | Elle hérite d'un trait, et de son inverse. |

### 6.2 Refuser

Une seule carte, trois textes, servie à chaque refus. **Premier refus** — « Tu dis non poliment. On te répond « on comprend », et personne ne comprend. » **Deuxième refus** — « Tu dis non une deuxième fois. Le téléphone met trois mois à sonner de nouveau. » **Troisième refus** — « Tu dis non. La porte se ferme pour deux saisons, et quelqu'un d'autre entre par là. » (`set: refus_3`, branche fermée deux saisons.)

### 6.3 « Le monde réagit » (quatre gabarits, servis au tirage suivant une Carte Destin acceptée)

1. **la presse** — **LÉA** — « Vous confirmez ? On me dit que vous avez changé de côté de la table. Une phrase, et je vous laisse. » — un bouton, parole ±0.
2. **le vestiaire d'avant** — **BRÉHAUT** — « Le groupe a appris ça par la radio. Tu passes dire au revoir, ou on fait comme si ? » — deux boutons, vestiaire ±.
3. **la tribune** — **GÉGÉ** — « La tribune n'oublie rien, et elle n'a pas décidé si c'est une trahison. Tu viens au local jeudi ? » — deux boutons, tribunes ±.
4. **la maison** — **CAMILLE** — « Tu rentres à quelle heure, dans ta nouvelle vie ? Je demande pour savoir quoi répondre au téléphone. » — deux boutons, relation ±1.

---

## 7. Le piège du centre

Servi quand **les quatre jauges restent entre 45 et 55 pendant six cartes** : rien ne va mal, rien ne va bien, et le jeu devient une routine. Dix cartes sans répétition, une par saison au plus ; **deux sorties qui déséquilibrent**, aucune ne ramène au centre. Elles ne posent pas de trace, elles fabriquent du désordre.

1. **`co.piege.enveloppe_trouvee`** — **JOSIANE** — « J'en ai vu passer, des enveloppes, mais pas dans ce tiroir-là. Vous l'ouvrez ou je la remets ? » ← ouvrir : caisse ++, direction −− · → remettre : direction +, vestiaire −
2. **`co.piege.micro_ouvert`** — **VENCE** — « On est en direct depuis deux minutes, et vous ne le saviez pas. Vous voulez qu'on coupe ? » ← laisser tourner : tribunes ++, direction −− · → couper : direction +, tribunes −−
3. **`co.piege.gamin_de_seize_ans`** — **BARBIER** — « Je l'ai vu jouer sous la pluie, il a seize ans et il joue mieux que trois des tiens. Tu le lances dimanche ? » ← lancer : force ++, vestiaire −− · → attendre : vestiaire +, tribunes −
4. **`co.piege.offre_du_rival`** — **MALBEC** — « Entre présidents, on se comprend : chez moi, c'est le double et un projet. Tu écoutes jusqu'au bout ? » ← écouter : caisse ++, direction −− · → raccrocher : direction ++, caisse −
5. **`co.piege.pari_du_dimanche`** — un inconnu *(sans portrait)* — « Cent {monnaie} sur votre équipe, à cinq mille contre un. Vous ne pariez pas, vous ? » ← parier : caisse ++, parole −2 · → refuser : parole +2, caisse −
6. **`co.piege.tribune_qui_dort`** — **GÉGÉ** — « La tribune n'oublie rien, mais là elle s'ennuie, et une tribune qui s'ennuie invente. Tu nous donnes quoi ? » ← promettre : tribunes ++, promise · → rien : tribunes −−, direction +
7. **`co.piege.lettre_anonyme`** — **MASSENET** — « Juste une question, hors micro : cette lettre vous accuse de trois choses, et deux sont fausses. Laquelle est vraie ? » ← répondre : tribunes −, parole +2 · → se taire : direction −, caisse +
8. **`co.piege.medecin_pressé`** — **SABATIER** — « Ça reste entre la table et moi : il peut jouer avec une piqûre, et il jouera moins longtemps. Je pique ? » ← piquer : force ++, vestiaire −− · → repos : force −, vestiaire ++
9. **`co.piege.dîner_de_l_adjoint`** — **VUKIĆ** — « Je te le dis parce que personne ne te le dira : j'ai dîné avec le président mardi. Tu veux savoir de quoi ? » ← savoir : direction −−, vestiaire ++ · → ne pas savoir : direction +, vestiaire −
10. **`co.piege.la_maison`** — **CAMILLE** — « Tu rentres à quelle heure ? Il y a une visite d'appartement samedi, à deux cents kilomètres d'ici. » ← y aller : direction −−, relation.camille +1 · → travailler : direction ++, relation.camille −1

---

## 8. Ce que ce chapitre pose et ce qu'il lit (la couture)

**Traces posées ici** (toutes lues ailleurs, ce qui est la condition pour exister) : `ennemi_a_table` (lue par § 6, `pr_ag`, `in_defiance`), `cahier_perdu` (`en_dauphin`, § 6.12), `districts_perdus` (`in_congres`, `in_defiance`, la Campagne du chapitre 15), `tribune_payee` (`pa_club_a_cote`, 13, 20), `classeur_josiane` (`grand_deballage`, `pr_commission`, `in.alarme.caisse_haut_amsel`), `sacha_te_nomme` (`ta_loge`, `jubile`, 90), `mbako_revu` (20, `en_decoupe`), `coach_revu` (`pr_siege`), `banc_de_gigi` (`en_retraite`, `jubile`, 31), `dossier_repris` (`generique`, 90), `carnet_solvang` (`jp_agent`, `ds_roi_mercato`), `gege_elu` (`pr_mairie`, `in_pages`, 90), `dede_enterre` (`am_toro`, 31), `clow_revu` (`statue_de_bronze`, 31), `chapitre_neuf` (`grand_deballage`, 20), `aulard_rappelle` (§ 6, `en_sms`), `brehaut_ligue` (`in_defiance`, 02), `dembo_coach` (12, 20), `legruet_dernier` (`in_congres`, 31), `nassir_revient` (`en_placard`, `pr_fonds`), `note_agence` (`pr_commission`, `in_taxi`), `agente_des_vingt` (12, 14), `place_14b_vide` (`jp_place14b`, `ta_loge`, 31), `boite_sous_evier` (`pa_buvette`, `pa_gerard_revenu`), `arbitre_machine` (15, 31), `dimanche_promis` (`ta_loge`, 90), `syndicat_recu` (`in_motion`, `co_greve_mondiale`), `carnet_barbier` (10, 12), `magot_liquide` (`pa_pelouse`, `pa_magot`), `commission_occulte` ∃, `homme_president` ∃, `pantin`, `pantin_confed`, `primes_cachees`, `tentation_mairie`, `club_actif` ∃, `commission_lettre` ∃, `fede_dossier` ∃, `offshore` ∃, `refus_3`.

**Traces lues ici sans être posées** (elles viennent des chapitres 01-15 et 31) : `mbako_vendu`, `mbako_lance`, `mbako_garde`, `pacte_gege`, `onze_du_virage`, `ami_ultras`, `naming_signe`, `nassir_pret`, `gigi_staff`, `finale_gigi`, `enveloppe_promise`, `flacon_b`, `vitamines`, `salaires_retard`, `vukic_dauphin`, `clow_ingrat`, `diplome`, `derby_perdu`, `camille_ici`, `divorce`, `sacha_nee`, `genou`, `capitaine`, `international`, `binational_bloque`, `selection_refusee`, `special`, `president_ami`, `vote_achete`, `mondial_desert`, `ligue_fermee_signee`, `ecoutes`, `aubert_ministre`, `bus_menace`, `bus_descendu`, `hymne_impose`, `mutinerie_matee`, `otage_kop`, `boucher_sponsor`, `fuyard`, `dembo_vendu`, `fax_rate`, `algorithme_adopte`, `coach_demission`, `coach_vire`, `fusion_signee`, `gerard_parti`, `terrain_rugby`, `village_fusion`, `village_uni`, `essai_pro`, `boulot_menace`, `promise`, `reforme_votee`, `video_adoptee`, `lanceur_alerte`, `monde_video`, `monde_flux`, `monde_greve`, `monde_ligue_fermee`, `pari`, `pari_promu`, `espion_retour`, `petition_portee`, `exil_propose`, `caid`, `descente`, `ascension`, `legende`, `roi_mercato`.

**Trois vérifications à faire au build** : (1) aucune set-piece de bilan ne lit `flag('bilan_tenu')` ni `world.rang_final` — seulement `bilan.tenu` et `bilan.rang` ; (2) chaque beat a une variante finale **sans `when`** pour les huit rôles ; (3) chaque alarme a un porteur dont la `fenetre` couvre l'année servie — sinon le porteur 2, puis le porteur 3 (§ 2).
