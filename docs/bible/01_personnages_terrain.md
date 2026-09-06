# FUSIBLE — Bible scénaristique · 01 · Les personnages du terrain et de la famille

> Chapitre 01, relu par 02. Dix-neuf fiches : les gens qui sentent la pelouse, la pommade et la cuisine. Ils sont le cœur, le chœur et l'horloge de toutes les carrières ; le business (chapitre 02) parle d'eux, eux parlent du ballon. Tout ce qui suit prolonge `content/characters.yaml`, `content/cards/**` et la charte (`00_charte.md`) ; rien ne les contredit. Quand une carte existe déjà, elle est citée par son id et n'est pas réécrite.

## 0. Comment lire ce chapitre

**Ce que contient chaque fiche.** L'en-tête au gabarit § 4.2 de la charte ; l'identité (surnom, âge par décennie, trois traits de portrait, la voix) ; la place dans le club ; désir, besoin, blessure, secret ; le tic et ses trois torsions ; l'adresse dans les huit rôles ; les cinq registres de relation (−3, −2/−1, 0, +1/+2, +3) avec deux répliques d'exemple chacun ; les rapports avec les autres ; la trajectoire 1990 → 2050 ; **une intrigue propre** (fiche § 4.3) dont les six scènes signatures sont écrites au gabarit § 4.1, importables telles quelles ; les deux **paliers** (−3 trahison, +3 faveur) ; trois **retrouvailles** (sourire, noir, et une troisième hors gabarit : téléphone, enterrement ou Fantôme) ; une réaction propre ; cinq anecdotes ; la liste des cartes propres avec le chapitre qui les écrit.

**Conventions.** Les ids suivent § 4.10. Les scènes propres d'un personnage qui traversent plusieurs rôles portent `co.` ; celles d'un seul rôle portent son préfixe (`jp.`, `en.`, `ds.`, `pr.`, `sl.`, `in.`, `am.`). Le mot d'arc de chaque personnage est **son id** (`co.vukic.*`, `jp.vecchio.*`, `en.mbako.*`) : les chapitres 10-15 gardent leurs propres mots d'arc (`en.retour_mbako`, `en.gigi_staff`, `co.pharmacie`) et ne rentrent pas dans ces espaces. Les paliers sont `co.<id>.trahison_<mot>` / `faveur_<mot>` sauf quand ils existent déjà (Gégé, Mbako +3, Camille), auquel cas on les cite et on écrit la variante manquante pour un autre rôle. Les retrouvailles sont `co.retrouvailles.<id>_sourire` / `_noir` ; la troisième prend un mot (`_telephone`, `_enterrement`, `_fantome`) et devra être déclarée au chapitre 90 comme extension du mécanisme (spec § 1.13 n'en prévoit que deux).

**Les registres.** La relation n'est jamais un chiffre à l'écran : elle est le visage (sourire ≥ +1, neutre, noir ≤ −1) et l'adresse. Les cinq registres ci-dessous servent aux auteurs des chapitres 10-15 pour écrire une variante « noir » ou « sourire » sans trahir le personnage. À −3, la trahison ; à +3, la faveur : une fois par carrière chacune (`on_relation`).

**Le vieillissement.** L'âge est celui de 1990, +1 par saison. Portrait : gris à 45, lunettes à 55, canne à 75. Hors fenêtre, le personnage est `retraite`, `parti`, `vendu`, `staff`, `rival` ou mort ; il ne parle qu'au téléphone (`statut_ok: [parti]`), à l'enterrement ou comme Fantôme.

**Les traces.** Ce chapitre **lit** (charte § 5.1) : `mbako_vendu`, `mbako_lance`, `pacte_gege`, `onze_du_virage`, `gigi_staff`, `genou_opere`, `flacon_b`, `camille_ici`, `divorce`, `clow_ingrat`, `brassard_gigi`, `bus_menace`, `derby_perdu`, `sacha_nee`. Il **pose** `divorce` (existant, `co.camille.valise`) et `sacha_nee` (la carte Naissance, § 4 Camille), plus les traces propres de chaque intrigue, toutes listées au § 20 avec leur lecteur. Une trace de ce chapitre que personne ne lit ailleurs est lue au moins par une autre fiche de ce chapitre (c'est la couture terrain-famille) et proposée au chapitre 90.

### 0.1 L'adresse dans les huit rôles

`characters.yaml` ne connaît que `entraineur` et `joueur`. Les six autres colonnes sont ajoutées ici ; le chantier données les recopie. Notation : sourire / neutre / noir. `am` = joueur amateur, `pa` = président amateur, `pr` = président pro, `sl` = sélectionneur, `in` = instance.

| id | am | ds | pa | pr | sl | in |
|---|---|---|---|---|---|---|
| `vukic` | {prenom} / petit / {nom} | {prenom} / directeur / {nom} | — | {prenom} / président / monsieur {nom} | {prenom} / coach / {nom} | {prenom} / monsieur le président / {nom} |
| `brehaut` | — | {prenom} / directeur / {nom} | — | {prenom} / président / monsieur {nom} | coach / coach / {nom} | {prenom} / monsieur le président / {nom} |
| `sabatier` | petit / petit / {nom} | {prenom} / directeur / monsieur {nom} | — | {prenom} / président / monsieur {nom} | {prenom} / coach / monsieur {nom} | {prenom} / monsieur le président / monsieur {nom} |
| `camille` | {prenom} sur les trois visages, puis {nom} à −1, dans tous les rôles | | | | | |
| `clow` | petit / petit / {nom} | petit / {prenom} / directeur | petit / {prenom} / président | petit / {prenom} / président | petit / {prenom} / sélectionneur | petit / {prenom} / monsieur le président |
| `mbako` | — | {prenom} / directeur / monsieur | — | {prenom} / président / monsieur | coach / coach / monsieur | {prenom} / président / monsieur |
| `vecchio` | petit / petit / {prenom} | coach / coach / coach | petit / président / président | coach / président / président | coach / coach / coach | coach / président / président |
| `mere_mbako` | — | {prenom} / directeur / {pg, select, f{madame} other{monsieur}} {nom} | — | {prenom} / président / {pg, select, f{madame} other{monsieur}} {nom} | {prenom} / coach / {pg, select, f{madame} other{monsieur}} {nom} | {prenom} / monsieur le président / {pg, select, f{madame} other{monsieur}} {nom} |
| `gege` | petit / {prenom} / le {numero} | {prenom} / directeur / {nom} | {prenom} / président / {nom} | {prenom} / président / {nom} | {prenom} / coach / {nom} | {prenom} / président / {nom} |
| `loco` | — | profesor / (silence) | — | {prenom} / profesor / (silence) | {prenom} / profesor / (silence) | — |
| `klopf` | — | {prenom} / directeur / collègue | — | {prenom} / président / collègue | {prenom} / collègue / collègue | {prenom} / président / collègue |
| `rouvier` | {prenom} / petit / {nom} | {prenom} / directeur / {pg, select, f{madame} other{monsieur}} {nom} | — | {prenom} / président / {pg, select, f{madame} other{monsieur}} {nom} | {prenom} / coach / {pg, select, f{madame} other{monsieur}} {nom} | {prenom} / président / {pg, select, f{madame} other{monsieur}} {nom} |
| `dembo` | — | {prenom} / directeur / patron | — | {prenom} / président / patron | {prenom} / coach / patron | {prenom} / président / patron |
| `fauvel` | {prenom} / {prenom} / le {numero} | {prenom} / directeur / {nom} | — | {prenom} / président / {nom} | {prenom} / coach / monsieur le sélectionneur | {prenom} / monsieur le président / {nom} |
| `brissac` | {prenom} / {pg, select, f{madame} other{monsieur}} {nom} / idem | idem | — | idem | idem | idem |
| `gerard` | petit / petit / {nom} | — | petit / président / {nom} | petit / président / {nom} | — | — |
| `dede` | petit / {prenom} / le {numero} | — | petit / président / {nom} | petit / président / {nom} | petit / {prenom} / {nom} | — |
| `paulette` | mon petit / {prenom} / le petit | mon petit / {prenom} / le directeur | mon petit / {prenom} / le président | mon petit / {prenom} / le président | mon petit / {prenom} / le coach | mon petit / {prenom} / le monsieur |
| `sacha` | papa/maman / {prenom} / {nom} dans tous les rôles | | | | | |

Les cases « — » sont des rôles où le personnage ne parle pas (ou seulement au téléphone, avec l'adresse du rôle voisin).

---

## 1. ZORAN VUKIĆ  (`vukic`)
**Fonction** : entraîneur adjoint · **Genre** : m · **Âge en 1990** : 37 · **Camp** : terrain · **Fenêtre** : 1990-2016 (adjoint 1990-2003, entraîneur principal ou sélectionneur de Dalmarie 2004-2008, entraîneur des gardiens des Cobalts 2009-2014, retraité 2016), puis `retraite` ; meurt en 2038, le cahier va à qui l'a mérité · **Suivant** : Ilan Sorel, adjoint (né en 1971, arrive au club en 2004, même moustache, pas le même cahier)
**Tic** : « Je te le dis parce que personne ne te le dira. » — torsions : « Je te le dis parce que tout le monde te le dira demain. » · « Je ne te le dis pas. Personne ne te le dira non plus. » · « Il te l'a dit ? Alors je n'ai plus rien à dire. »
**Désir** : être le numéro 2 d'un numéro 1 qu'il respecte · **Blessure** : ancien gardien de Dalmarie, il a lâché un ballon en finale continentale (1979) et personne ne le lui a dit ; il a passé sa vie à dire aux autres ce qu'on ne lui a pas dit
**Adresse** (sourire / neutre / noir) : entraineur : {prenom} / coach / {nom} · joueur : {prenom} / {prenom} / {nom} · autres rôles : § 0.1
**Ce qu'il pense de toi** : à +2 « tu es le numéro 1 que j'attendais » ; à 0 « on verra au premier bloc » ; à −2 « le président me demande de relire son second discours, et je le relis »
**Paliers** : −3 → `co.vukic.trahison_serrure` · +3 → `co.vukic.faveur_trois_valises`
**Dans les rôles** : entraîneur : chœur et messager (l'adjoint, le dauphin ; 1,5 par saison ; porte l'alarme tribunes haute du promu) · joueur : patron secondaire (l'adjoint qui te met sur le banc, puis le coach qui te veut ; 1) · sélectionneur : cœur (ton adjoint) ou adversaire (sélectionneur de Dalmarie 2004-2008 ; 1) · DS : cœur (l'entraîneur que tu nommes ; 1) · président : messager (il te dit ce que le vestiaire ne dira pas au bureau ; 0,5) · instance : voix au téléphone (0,5) · amateur : absent, sauf s'il descend te voir (0,5)
**Trajectoire 1990 → 2050** : 1990-1999 · 37-46 ans, adjoint à {club}, moustache, sifflet, le cahier ; suit ou trahit selon la relation ; premier banc ailleurs possible dès 1995 (Néville, le froid) · 2000-2009 · gris à 45 (1998) ; sélectionneur de Dalmarie 2004-2008 (un quart de finale, des gardiens légendaires) ; entraîneur des gardiens des Cobalts dès 2009 · 2010-2019 · lunettes (2008) ; il regarde chaque dimanche le plateau et note ce que dit l'ancien joueur ; retraité en 2016 à Portclair, face à la mer, un banc · 2020-2029 · il téléphone ; il vient aux enterrements, le premier arrivé, le dernier parti · 2030-2039 · canne (2029) ; meurt en 2038 ; le cahier est déposé au Panthéon ou remis à ta lignée (`vukic_fidele`) · 2040-2050 · une ligne d'Almanach, un banc à Portclair, une moustache sur un buste
**Retrouvailles** : `co.retrouvailles.vukic_sourire` / `_noir` / `_banc_en_face`
**Cartes propres** : *Le premier café* (01) · *Le banc, et pourquoi* (01) · *Le ballon lâché* (01) · *Le cahier au Bilan* (01) · *Dalmarie en face* (01) · *Nommer Vukić* (01) · *L'adjoint qui dîne* (11, `en.adjoint_dine`) · *Le coach qui te veut* (10, `jp.coach_qui_te_veut`) · *Le premier discours* (30, set-piece `objective`, variante `vukic_dauphin`)

### 1.1 Identité
Zoran Vukić, dit « Zoki » (par Gigi seulement ; il ne répond pas aux autres). 37 ans en 1990, 47 en 2000, 57 en 2010, 67 en 2020, 77 en 2030, 85 à sa mort. **Portrait** : la moustache brune immuable (grise en 1998, blanche en 2012, jamais rasée), le survêtement marine — pas celui du coach, jamais celui du coach —, le sifflet qu'il ne siffle pas. **Voix** : basse, sans accent audible sauf sur « finale » ; phrases courtes qui commencent souvent par « Je » et finissent par un fait. Il ne rit pas ; il souffle par le nez quand c'est drôle.

### 1.2 Place dans le club
Il arrive à 7 h, le président à 6 h 30 : c'est la première chose qu'il t'apprend. Il tient le cahier (les compos, les blessés, les mensonges de chacun), fait les échauffements de gardiens, et va au restaurant du port avec qui l'invite. Le vestiaire le tutoie, le président le vouvoie, Josiane l'appelle « Zoran » : il est le seul du club à avoir trois adresses. Quand tu prends le banc, il garde le cahier ; quand tu le perds, il garde le cahier aussi.

### 1.3 Désir, besoin, blessure, secret
**Désir** : servir un numéro 1 qu'il respecte — et le respect se gagne au premier bloc, pas à l'embauche. **Besoin** : qu'on lui dise, une fois, une chose vraie sur lui. **Blessure** : le ballon lâché en finale (1979, Étoile de Dalmarie contre le Castel Montoya) ; le stade a sifflé, ses coéquipiers l'ont consolé, personne n'a dit « c'est toi ». Il a décidé ce soir-là de dire aux autres. **Secret** : il a relu, une fois, le second discours d'un président — et il y était (`vukic_dauphin`) ; il n'a pas dit non. Il n'a pas dit oui non plus. Il attend qu'on le lui dise.

### 1.4 Le tic et ses variations
« Je te le dis parce que personne ne te le dira. » Une carte sur deux. Il s'en sert pour annoncer (le petit Mbako), prévenir (le bus), avouer (le dîner), et une fois — à +3 — pour se taire : « Je ne te le dis pas. Tu le sais déjà. » À −3, le tic se retourne contre toi : « Je le lui ai dit, parce que tu ne le lui aurais pas dit. »

### 1.5 Les cinq registres
- **−3 (noir, l'ennemi)** — « Le président a deux discours, {nom}. J'ai relu les deux. » / « La serrure a changé. Je te le dis parce que personne ne te le dira. »
- **−2 / −1 (noir)** — « Le vestiaire a lu la compo dans le journal, {nom}. Moi aussi. » / « Je ne dîne avec personne. Je mange, c'est tout. »
- **0 (neutre)** — « Le petit marche sur l'eau, coach. Le président le vend avant qu'il nage. » / « Tu veux mon avis ou ma compo ? Les deux existent. »
- **+1 / +2 (sourire)** — « {prenom}, le bus parle. Je te le dis parce que personne ne te le dira. » / « J'ai gardé le cahier. Il est à toi, pas au bureau. »
- **+3 (sourire, la faveur)** — « Trois valises. Je viens, où que ce soit ; ne me remercie pas. » / « Je ne te le dis pas. Cette fois, tu le sais avant moi. »

### 1.6 Rapports avec les autres
**Alliés** : Gigi Vecchio (deux gardiens : ils se comprennent sans phrase ; Gigi est le seul à connaître le ballon lâché) ; Josiane (elle voit qui dîne avec qui et le lui dit à lui, pas à toi) ; Sabatier (la table et le cahier partagent des secrets). **Rivaux** : Vogler (il fut son adjoint chez Vaz, un hiver : « on court, on presse, on chante », Vukić ne chante pas) ; Bréhaut quand le capitaine veut le costume que Vukić voudrait pour son numéro 1. **Dettes** : Vaubourg lui doit une élection interne qu'il n'a jamais réclamée ; il doit à Corven un conseil (« un adjoint qui dit tout n'est pas un adjoint ») qu'il n'a pas suivi. **Il déteste** : Fardelli, qui l'appelle « mon ami » alors qu'il n'a jamais eu d'agent.

### 1.7 INTRIGUE co.vukic_cahier  —  Le cahier de Vukić
**Logline** : Vukić tient le cahier de ta carrière ; à la fin il le garde, te le rend, ou le donne à celui qui t'a remplacé. · **Synopsis** : Le premier matin, il t'apprend l'heure du café et l'heure du président. En cours de saison il te dit ce que personne ne dit : le banc, le petit, le bus. Un soir de relation, il raconte le ballon lâché. Au Bilan, il pose le cahier sur ton bureau : tu le prends, ou tu lui laisses. Des années plus tard, il est sur le banc d'en face, ou dans ton staff, ou sélectionneur de son pays, et le cahier est encore dans sa poche. À la fin de sa vie, le cahier va à ta lignée, au Panthéon, ou à ton successeur.
**Rôle(s)** : entraineur, joueur, ds, selectionneur · **Postulat(s)** : partagé (promu, interimaire, fin_de_contrat, coach_intouchable, apres_fiasco) · **Porteur** : vukic · **Cast** : vukic, aulard, josiane, vecchio, brehaut · **Thème** : direction
**Saisons** : "0" (premier_matin, banc), "1" (ballon_lache, cahier_bilan), "2+" (dalmarie, nomination) · **Conditions d'entrée** : `chars.vukic.statut in [club, staff]` · **Exclusions** : `en.adjoint_dine` en cours (les deux intrigues se partagent Vukić : celle-ci parle du cahier, l'autre du restaurant) · **Rejouabilité** : jamais (les étapes 5 et 6 sont des cartes de rôle, servies quand le rôle change)
**Issues** → **Traces** → **Qui les lit** : `fidele` → `vukic_fidele` (« {annee} : Zoran Vukić a suivi {prenom} {nom}. Trois valises, un cahier. ») → lue par 30 (`en_sms` epitaph_plus variante, `jp_fils` plus), 90 (retrouvailles sourire), 14 (il est ton adjoint chez les Cobalts) · `rendu` → `cahier_rendu` (« {annee} : Zoran Vukić a rendu le cahier à {prenom} {nom}. Il en a commencé un autre. ») → lue par 30 (set-piece `bilan_carrefour` : « tu as le cahier »), 11 (`en.adjoint_dine` s'ouvre plus tard) · `garde` → `cahier_garde` (« {annee} : le cahier est resté dans la poche de Zoran Vukić. Le président a demandé à le lire. ») → lue par 11 (`en.adjoint_dine` poids ×2), 30 (`en_dauphin` plus)
**Séquencier** : premier_matin (S0, [1,4]) → banc (S0, [5,11], joueur seulement ; entraîneur : saute) → ballon_lache (S1+, [4,12], `relation.vukic >= 1`) → cahier_bilan (S1+, [15,17]) → dalmarie (sélectionneur, année ≥ 2004, fenêtre de novembre) | nomination (DS, quand un entraîneur est à nommer) ; une étape au moins en saison suivante : ballon_lache et cahier_bilan glissent en S1 ; variante lue sur `vukic_dauphin` (autre intrigue, chapitre 11) à l'étape cahier_bilan.
**Épilogue** (abandon, club changé) : `vestiaire −` ; ligne « {annee} : le cahier est resté à {club}. Vukić aussi. »

### SCÈNE en.vukic.premier_matin  —  Le premier café
**Rôle** : entraineur · **Intrigue** : co.vukic_cahier · **Étape** : 1/6 · **Moment** : saison 0, créneaux [1,4] · **Lieu** : la salle de café du centre d'entraînement, 7 h · **Conditions** : `chars.vukic.statut == 'club'`
**VUKIĆ** *(entraîneur adjoint — neutre — deux tasses, une seule sucrée)*
« Le café est à sept heures, le président prend le sien à six heures et demie. Je te le dis parce que personne ne te le dira : il aime qu'on soit déjà là. »
← **Demain, six heures et quart** — effets : direction +, vestiaire −, relation.vukic +1 — *Le président te trouve devant la machine. Il ne dit rien ; il note l'heure.*
→ **Sept heures, c'est mon heure** — effets : vestiaire +, direction −, set: cahier_sept_heures — *Le vestiaire apprend que le coach dort. Il trouve ça humain, puis inquiétant.*
**Traces** : cahier_sept_heures (pas de ligne d'Almanach : `journal:` poids 1, « le coach arrive à sept heures ») · **Réactions déclenchées** : — · **Lu plus tard par** : 30 (set-piece `objective` : Vaubourg « tu étais là à six heures et quart » / « tu dormais »)

### SCÈNE jp.vukic.banc  —  Le banc, et pourquoi
**Rôle** : joueur · **Intrigue** : co.vukic_cahier · **Étape** : 2/6 · **Moment** : saison 0, créneaux [5,11] · **Lieu** : le couloir, après l'affichage de la compo · **Conditions** : `world.serie_defaites >= 1 || gauges.direction < 45`
**VUKIĆ** *(entraîneur adjoint — neutre — le cahier ouvert à ta page)*
« Tu es sur le banc dimanche, et le coach ne te dira pas pourquoi. Je te le dis parce que personne ne te le dira : tu regardes le ballon, jamais l'homme derrière toi. »
← **Je bosse l'homme derrière** — effets : force +2, tribunes −, relation.vukic +1, set: banc_bosse — *Deux semaines de vidéo avec lui, le soir. Le cahier a une page de plus à ton nom.*
→ **Je vais taper à la porte** — effets : direction −−, vestiaire +, set: banc_boude — *Le coach ouvre, écoute, referme. Vukić range le cahier sans rien écrire.*
**Traces** : banc_bosse, banc_boude (chapitre 10, `jp.banc_hiver` : ligne « {annee} : sur le banc, {prenom} {nom} a bossé / a boudé ») · **Réactions déclenchées** : — · **Lu plus tard par** : 10 (`jp.coach_qui_te_veut`, `requires: [banc_bosse]`), 30 (`jp_fils` plus)

### SCÈNE co.vukic.ballon_lache  —  Le ballon lâché
**Rôle** : entraineur, joueur, selectionneur · **Intrigue** : co.vukic_cahier · **Étape** : 3/6 · **Moment** : saison 1+, créneaux [4,12] · **Lieu** : le bus, de nuit, retour d'un déplacement perdu · **Conditions** : `relation.vukic >= 1 && season >= 1`
**VUKIĆ** *(entraîneur adjoint — sourire — il regarde la vitre, pas toi)*
« Finale continentale, soixante-dix-neuf, un centre mou, et le ballon m'a traversé les mains. Personne ne me l'a dit ; je te le dis parce que personne ne te dira jamais tes ballons. »
← **C'était toi, Zoran** — effets : relation.vukic +2, vestiaire +, set: vukic_dit — *Il souffle par le nez. C'est la première fois que quelqu'un le lui dit. Il dort avant l'autoroute.*
→ **Un centre mou, ça arrive** — effets : relation.vukic −1, direction + — *Il hoche la tête. Le cahier reste fermé jusqu'à Néville.*
**Traces** : vukic_dit (« {annee} : dans le bus, {prenom} {nom} a dit à Zoran Vukić que c'était lui. Il l'attendait depuis 1979. ») · **Réactions déclenchées** : co.re.vecchio_zoki (§ 7.8) · **Lu plus tard par** : co.vukic.faveur_trois_valises (variante), co.retrouvailles.vukic_sourire, 31 (épitaphe d'enterrement de Vukić)

### SCÈNE en.vukic.cahier_bilan  —  Le cahier au Bilan
**Rôle** : entraineur · **Intrigue** : co.vukic_cahier · **Étape** : 4/6 · **Moment** : saison 1+, créneaux [15,17] · **Lieu** : ton bureau, la veille du dernier bloc · **Conditions** : `season >= 1` ; variante `_dauphin` si `flag('vukic_dauphin')`
**VUKIĆ** *(entraîneur adjoint — neutre — il pose le cahier, fermé, la tranche vers toi)*
« Tout est dedans : les compos, les blessés, ce que chacun a promis à qui. Le président m'a demandé de le lire ; je te le dis parce que personne ne te le dira. »
← **Je le prends, il est à moi** — effets : direction −, vestiaire +, relation.vukic +1, set: cahier_rendu, outcome: rendu — *Il en commence un autre le soir même. Petit format, celui-là.*
→ **Garde-le, tu le tiens mieux** — effets : direction +, relation.vukic −1, set: cahier_garde, outcome: garde — *Il le range dans la poche du survêtement. Le président l'aura lu avant le Bilan.*
*(Variante `en.vukic.cahier_bilan_dauphin`, si `vukic_dauphin` : « Le président a deux discours, et mon nom est dans le second. Je te le dis parce que personne ne te le dira : le cahier, tu le prends ce soir ou jamais. » Mêmes sorties ; à droite, relation.vukic −2.)*
**Traces** : cahier_rendu, cahier_garde · **Réactions déclenchées** : en.re.josiane_cahier (§ 1.11) · **Lu plus tard par** : 30 (`bilan_carrefour` variante « tu as le cahier »), 11 (`en.adjoint_dine` : poids ×2 si cahier_garde), 30 (`en_dauphin` plus)

### SCÈNE sl.vukic.dalmarie  —  Dalmarie en face
**Rôle** : selectionneur · **Intrigue** : co.vukic_cahier · **Étape** : 5/6 · **Moment** : saison 2+, fenêtre de novembre · **Lieu** : le tunnel, avant Cobalts-Dalmarie · **Conditions** : `year >= 2004 && year <= 2008`
**VUKIĆ** *(sélectionneur de Dalmarie — sourire ou noir selon la relation — même moustache, autre survêtement)*
« Sélectionneur de mon pays, à cinquante ans, contre toi. Je te le dis parce que personne ne te le dira : mon gardien a peur des centres mous, comme moi. »
← **Merci, je vise les centres** — effets : force +2, relation.vukic −1, tribunes + — *Tu gagnes d'un centre mou. Il te serre la main plus longtemps que la télé ne le montre.*
→ **Je ne veux pas savoir** — effets : relation.vukic +1, force −1, set: vukic_respecte — *Tu perds. Il ne sourit pas ; il souffle par le nez, et il t'attend au bus.*
**Traces** : vukic_respecte (« {annee} : {prenom} {nom} a refusé le secret de Zoran Vukić avant Cobalts-Dalmarie. Ils ont perdu. Ils ont bu. ») · **Réactions déclenchées** : — · **Lu plus tard par** : co.retrouvailles.vukic_banc_en_face, 14 (chaîne Tournoi : variante « Vukić en face »)

### SCÈNE ds.vukic.nomination  —  Nommer Vukić
**Rôle** : ds · **Intrigue** : co.vukic_cahier · **Étape** : 6/6 · **Moment** : saison 1+, à la première nomination d'un entraîneur · **Lieu** : le bureau du DS, le cahier sur la table · **Conditions** : `chars.vukic.statut in [club, staff, parti]` (parti : il téléphone)
**VUKIĆ** *(entraîneur adjoint — neutre — il n'a pas pris de chaise)*
« Tu me proposes le banc, directeur. Je te le dis parce que personne ne te le dira : je suis un numéro 2, et un numéro 2 sur un banc de numéro 1, ça finit au restaurant du port. »
← **Le banc, et je te couvre** — effets : vestiaire ++, direction −, relation.vukic +1, char: {vukic: {statut: staff}}, set: vukic_numero_un — *Il prend le banc et garde le cahier. Le président le vouvoie ; ça ne lui plaît pas.*
→ **Adjoint du grand nom** — effets : direction +, tribunes +, relation.vukic +1 (il respecte le grand nom) ou −1 (si `flag('loco_evince')`) — *Il range le cahier dans la poche du survêtement marine. Il est prêt à sept heures.*
**Traces** : vukic_numero_un (« {annee} : Zoran Vukić, entraîneur principal. Nommé par {prenom} {nom}, qui garde le restaurant du port à l'œil. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 12 (`coach_demission` : Vukić démissionne si le président le vouvoie trois fois), 30 (`ds_fronde` plus)

### 1.8 Les paliers

### SCÈNE co.vukic.trahison_serrure  —  La serrure
**Rôle** : entraineur, joueur, selectionneur, ds · **Intrigue** : palier −3 · **Étape** : on_relation −3 · **Moment** : programmé en [1,3] · **Lieu** : ta porte de bureau, ou le vestiaire · **Conditions** : `relation.vukic <= -3`, une fois par carrière
**VUKIĆ** *(entraîneur adjoint — noir — une clé neuve entre deux doigts)*
« Le président a changé la serrure ce matin ; il m'a donné la clé. Je te le dis parce que personne ne te le dira, {nom} : il ne t'en a pas fait faire une. »
← **Je prends la clé** — effets : direction −−, vestiaire −, set: serrure_changee — *Tu la prends. Elle ouvre son bureau à lui, pas le tien.*
→ **Je prends la clé** — effets : direction −−, vestiaire −, set: serrure_changee — *Tu la prends. Elle ouvre son bureau à lui, pas le tien.*
**Traces** : serrure_changee (« {annee} : la serrure du bureau a changé. Zoran Vukić avait la clé ; {nom}, la porte. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 30 (`en_dauphin`, `en_sms` epitaph_plus), 90 (Nemesis Vukić : « la clé, 19xx »)

### SCÈNE co.vukic.faveur_trois_valises  —  Trois valises
**Rôle** : entraineur, joueur, selectionneur, ds · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : le parking, un soir de pluie · **Conditions** : `relation.vukic >= 3`, une fois par carrière
**VUKIĆ** *(entraîneur adjoint — sourire — trois valises dans le coffre, la moustache mouillée)*
« Où que tu ailles, je viens ; trois valises, c'est tout ce que j'ai. Je ne te le dis pas parce que personne ne te le dira : je te le dis parce que c'est vrai. »
← **Monte, on y va** — effets : vestiaire ++, direction +, set: vukic_fidele, outcome: fidele — *Il ferme le coffre. Le cahier est dans la valise du milieu, entre deux survêtements marine.*
→ **Reste, ils ont besoin de toi** — effets : vestiaire +++, relation.vukic −1, set: vukic_reste — *Il rentre les valises une par une. Il te regarde partir depuis la porte du vestiaire.*
*(Variante si `flag('vukic_dit')` : « Tu m'as dit le ballon. Je te dois trois valises. »)*
**Traces** : vukic_fidele, vukic_reste (« {annee} : Zoran Vukić est resté à {club} à la demande de {prenom} {nom}. Les trois valises sont dans le grenier. ») · **Réactions déclenchées** : co.re.camille_valises_vukic (§ 4.8) · **Lu plus tard par** : 30 (`jp_fils` plus, `en_sms` plus), 14 (Vukić adjoint des Cobalts), 90 (« Trois générations » : le cahier hérité)

### 1.9 Les retrouvailles

### SCÈNE co.retrouvailles.vukic_sourire  —  Sept heures, même heure
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après une Passation ou un changement de club · **Conditions** : Vukić parmi les deux meilleures relations · **Lieu** : la salle de café du nouveau club, sept heures
**VUKIĆ** *(sa fonction du moment — sourire — le cahier neuf, déjà corné)*
« Tu m'as manqué à sept heures, {prenom}. Je te le dis parce que personne ne te le dira : le café ici est mauvais, et j'ai pris ta tasse. »
**OK** **Je reprends ma tasse** — effets : vestiaire +, relation.vukic +1 — *Il te la rend. Elle est sucrée. Il se souvient de tout.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.vukic_noir  —  Le second discours
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après une Passation · **Conditions** : Vukić parmi les pires relations · **Lieu** : le couloir du nouveau club, devant ton bureau
**VUKIĆ** *(sa fonction du moment — noir — il ne pose pas le cahier)*
« Ton président d'alors avait deux discours, {nom}, et je les ai relus tous les deux. Je te le dis parce que personne ne te le dira : celui-ci en a aussi deux. »
**OK** **Je veux lire le second** — effets : direction −, relation.vukic +1 — *Il ne l'a pas. Il sait seulement qu'il existe. Ça lui suffit ; à toi aussi.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.vukic_banc_en_face  —  Le banc d'en face
**Rôle** : entraineur, selectionneur · **Intrigue** : retrouvailles (troisième, hors gabarit spec) · **Moment** : la semaine d'un match contre le club ou le pays qu'il entraîne · **Conditions** : `chars.vukic.statut == 'rival'` · **Lieu** : le rond central, avant l'échauffement
**VUKIĆ** *(entraîneur de {rival} ou de Dalmarie — neutre — il traverse le rond central pour te serrer la main avant l'échauffement)*
« Ton cinq est plus lent qu'avant, et ton gardien sort trop tôt. Je te le dis parce que personne ne te le dira : moi non plus, d'habitude. »
← **Je change le cinq** — effets : force +1, relation.vukic +1, tribunes − — *Tu le changes. Il s'en veut. Il a toujours tout dit à tout le monde.*
→ **Je te connais, Zoran** — effets : force −1, relation.vukic +1, vestiaire + — *Tu ne changes rien. Le gardien sort trop tôt. Il te regarde depuis son banc sans un geste.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### 1.10 Anecdotes
- **01.vukic_tasse** — objet · `en.vukic.premier_matin`, retrouvailles · Sa tasse est une tasse de l'Étoile de Dalmarie, ébréchée en 1979. Il la sucre, jamais il ne la lave à la machine.
- **01.vukic_voiture** — décor · brève d'Écho, Nouvelle · Il roule dans une berline grise de 1986 qu'il n'a jamais changée ; « elle démarre », dit-il, comme s'il parlait d'un gardien.
- **01.vukic_superstition** — légende · `co.vukic.ballon_lache`, set-piece `gm_annonce` · Il ne regarde jamais un centre venu de la gauche depuis le banc. Il baisse les yeux sur le cahier ; les joueurs croient qu'il note.
- **01.vukic_repas** — décor · `en.adjoint_dine` (11), brèves · Au restaurant du port il commande toujours des moules, jamais de frites. « Les frites, c'est pour ceux qui ont gagné. »
- **01.vukic_cahier** — objet (héritable) · Dossier (objet), 90 (lignée) · Le cahier est un cahier d'écolier à petits carreaux, marine, un par saison. Le premier date de 1981. Aucun n'a de nom sur la couverture.

### 1.11 Réaction propre
### RÉACTION en.re.josiane_cahier  —  Le cahier a voyagé
**Après** : en.vukic.cahier_bilan (→ garde) · **Famille** : tiers qui commente · **Conditions** : `relation.josiane >= 0`
**MADAME JOSIANE** *(secrétaire — neutre — un cahier marine sous une pile de factures)*
« Le cahier de Zoran a passé la nuit dans le bureau du président. J'en ai vu passer, vous savez ; pas des cahiers. »
**Un bouton** : **Je le récupère** — effets : direction −, relation.vukic +1 — *Il te revient corné à une page. La tienne.*

---

## 2. TITI BRÉHAUT  (`brehaut`)
**Fonction** : capitaine, puis directeur sportif · **Genre** : m · **Âge en 1990** : 33 · **Camp** : terrain → direction (dès qu'il porte le costume : même portrait, la bande blanche change) · **Fenêtre** : joueur 1990-1994 (brassard jusqu'à 37 ans), staff ou DS 1995-2019, président de la Ligue 2020-2028 puis de la Fédération 2028-2036 « par défaut » (si aucune lignée ne prend le poste : chapitre 02, table des mandats), retraité 2036 ; il tient la buvette des anciens le samedi dès 2025, costume ou pas ; il meurt en 2044, à la buvette, en disant que le groupe vit bien · **Suivant** : Momo (le coéquipier des cartes joueur existantes : il prend le brassard en 1995, il ne prendra jamais le costume)
**Tic** : « Le groupe vit bien. » — torsions : « Le groupe vit. Bien, on verra. » · « Le groupe vivait bien. » · « Le groupe vit bien, et il lit. »
**Désir** : le brassard, puis le costume · **Blessure** : son frère est agent (« le frère de Bréhaut », voix sans portrait) et lui a coûté son contrat d'image en 1988 ; il n'a plus jamais signé sans lire, et il lit lentement
**Adresse** : entraineur : coach / coach / {nom} · joueur : {prenom} / petit / le {numero} · autres : § 0.1
**Ce qu'il pense de toi** : à +2 « tu es le coach que le groupe attendait, et je le lui dis » ; à 0 « on verra si tu tiens un vestiaire ou un tableau » ; à −2 « le groupe a lu avant toi, et le groupe ne te fait plus la passe »
**Paliers** : −3 → `co.brehaut.trahison_petition` · +3 → `co.brehaut.faveur_lettre`
**Dans les rôles** : joueur : cœur (le capitaine qui te teste ; 2) · entraîneur : cœur (le capitaine vieillissant, le relais, puis le DS ; 2) · DS : chœur ou rival (ton prédécesseur, ton successeur ; 1,5) · président : cœur (DS sous Almadis, allié ou rival ; 1,5) · sélectionneur : cœur (le capitaine écarté 1990-1994 ; 1) · instance : voix au téléphone (0,5)
**Trajectoire 1990 → 2050** : 1990-1999 · 33-42 ans, mulet blond, brassard jaune ; le genou parle en 1993 ; DS de {club} ou d'Almadis dès 1995 selon `brehaut_ds` · 2000-2009 · gris (2002), le mulet devient une coupe de banquier ; DS d'un club de D1, il achète sans toi ou avec toi ; le frère est toujours agent · 2010-2019 · lunettes (2012) ; DS sous Ilyas (« le costume est un actif ») ; il te vire par SMS avec une faute, la même que celle de Vaubourg · 2020-2029 · président de la Ligue (2020-2028) par défaut : le costume a fini par lui aller, les manches non ; puis de la Fédération (2028-2036) si personne de ta lignée ne la prend ; le samedi, il tient quand même la buvette des anciens avec Gigi puis seul ; il fait la vaisselle · 2030-2039 · retraite 2036 ; un banc à côté de celui de Gigi (mort 2031) · 2040-2050 · meurt en 2044 ; « Le groupe vit bien » est gravé sur le banc, la tribune a payé la gravure
**Retrouvailles** : `co.retrouvailles.brehaut_sourire` / `_noir` / `_telephone`
**Cartes propres** : *Les bouteilles* (01) · *Le groupe a lu* (01) · *Le frère* (01) · *Le dernier brassard* (01) · *Le costume* (01) · *Le DS de l'actif* (01) · *Le brassard* (11, `en.brassard_brehaut`) · *Le test du capitaine* (10, `jp.brassard_test`) · *Les salaires* (11, `en.salaires.brehaut`) · *Le podcast* (existant, `jp.famille.podcast_carton`)

### 2.1 Identité et place
Thierry Bréhaut, « Titi » depuis les poussins ; personne ne dit Thierry, pas même sa mère. 33 ans en 1990, 43 en 2000, 53 en 2010, 63 en 2020, 73 en 2030, 83 en 2040. **Portrait** : le mulet blond (jusqu'en 1996, puis « la coupe de la banque »), le brassard jaune porté sur le biceps, jamais à l'avant-bras, la mâchoire qui bouge quand il lit. **Voix** : lente, chaude, un mot après l'autre, comme s'il comptait les syllabes ; il dit « le groupe » là où les autres disent « nous ». Au club, il est celui qui distribue les bouteilles d'eau, la prime et les consignes ; il parle au coach avant le coach ; il tient la buvette le samedi quand la caisse a fui. Il n'a jamais été le meilleur joueur du vestiaire, il a toujours été le premier arrivé au toro.

**Désir / besoin / blessure / secret.** Désir : durer au centre : le brassard, puis le costume, puis la buvette. Besoin : qu'on lui dise avant les autres. Blessure : le contrat d'image que son frère a signé pour lui en 1988, avec une boisson qu'il n'a jamais bue. Secret : il a lu le chapitre trois avant tout le monde ; c'est lui qui a photocopié la compo pour le journal, une fois, pour voir si le groupe lisait.

### 2.2 Les cinq registres
- **−3** — « Le groupe a signé une pétition, {nom}. Je l'ai signée en premier. » / « Le groupe vit bien. Sans toi. »
- **−2 / −1** — « Le groupe a lu la compo dans le journal. Avant toi, le {numero}. » / « Pas de passe au petit. C'est le groupe qui l'a décidé, pas moi. »
- **0** — « Le groupe vit bien, coach. Les bouteilles, c'est toi ou c'est moi ? » / « Le président a divisé la prime par deux. Le groupe compte sur toi pour compter. »
- **+1 / +2** — « Le groupe vit bien, et il te fait dire merci. » / « Le penalty, tu le tires ; moi je regarde, {prenom}. »
- **+3** — « J'ai une lettre du vestiaire, coach ; elle est pour le président, et elle dit que tu restes. » / « Le groupe vit bien. C'est grâce à toi, et je vais le dire à la télé. »

### 2.3 Rapports avec les autres
**Alliés** : Vecchio (les deux vieux : ils partagent la table des anciens et la radio), Josiane (elle relit ses contrats depuis 1988), Gégé (qui l'a vu jouer en 1979 et le lui rappelle). **Rivaux** : Mbako (le vote du brassard ; « papy »), Vukić (le costume qu'ils voudraient tous deux pour leur numéro 1), Fardelli (l'agent que son frère imite mal). **Dettes** : il doit à Corven d'avoir été titulaire à 19 ans ; Ilyas lui doit un costume, et le lui fait payer. **Il déteste** : Massenet, qui a publié le contrat de la boisson.

### 2.4 INTRIGUE co.brehaut_costume  —  Le costume de Bréhaut
**Logline** : Titi Bréhaut a un brassard qu'il ne veut pas rendre et un costume qu'il n'ose pas mettre ; tu décides lequel il porte quand tu pars. · **Synopsis** : Il te teste avec les bouteilles d'eau. Il te dit que le groupe a lu. Son frère te propose un contrat d'image, et il te regarde signer ou pas. À trente-six ans, il demande à être prévenu avant les autres. Puis, DS, il achète sans toi ou t'achète, et sous Almadis il t'explique qu'un conseil d'administration est un groupe qui vit bien.
**Rôle(s)** : joueur, entraineur, ds, president · **Postulat(s)** : partagé (pepite, fin_de_contrat, promu, interimaire, vendre_trente, rachete_fonds) · **Porteur** : brehaut · **Cast** : brehaut, le frère de Bréhaut (voix), vecchio, mbako, nassir, josiane · **Thème** : vestiaire
**Saisons** : "0" (bouteilles, groupe_a_lu), "1" (frere, dernier_brassard), "2+" (costume, ds_actif) · **Conditions d'entrée** : `chars.brehaut.statut in [club, staff]` ou `direction` (DS) · **Exclusions** : `en.brassard_brehaut` la même saison · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `brassard_garde` → `brehaut_capitaine` (11 la déclare ; ligne « {annee} : Titi Bréhaut garde le brassard. Le genou n'a pas voté. ») → lue par 14 (le capitaine vieillissant), 30 (`en_copain` plus) · `costume` → `brehaut_ds` (« {annee} : Titi Bréhaut range le brassard et met le costume. Il lit chaque page. ») → lue par 12 (ton prédécesseur / successeur), 13 (DS sous Almadis), 20 (« LE BRASSARD MET UN COSTUME »), 90 (retrouvailles) · `frere` → `brehaut_frere` (« {annee} : {prenom} {nom} a signé avec le frère de Bréhaut. Titi a lu le contrat, lentement. ») → lue par 10 (`jp.contrat_image` variante), 02 (Fardelli : « le frère vend moins cher »), 30 (`jp_sandwich` plus)
**Séquencier** : bouteilles (S0, [2,6], joueur ; entraîneur : groupe_a_lu à la place) → frere (S1, [4,10]) → dernier_brassard (S1+, [8,14], `chars.brehaut.age >= 36`) → costume (S2+, Bilan) → ds_actif (président, `club_actif`) ; variante à dernier_brassard lue sur `brassard_gigi` (chapitre 11).
**Épilogue** : `vestiaire −` ; « {annee} : le brassard est resté à {club}. Titi Bréhaut aussi, pour l'instant. »

### SCÈNE jp.brehaut.bouteilles  —  Les bouteilles
**Rôle** : joueur · **Intrigue** : co.brehaut_costume · **Étape** : 1/6 · **Moment** : saison 0, [2,6] · **Lieu** : le bord du terrain, fin d'échauffement · **Conditions** : —
**BRÉHAUT** *(capitaine — neutre — un pack de six bouteilles tendu à bout de bras)*
« Le nouveau porte les bouteilles, c'est la règle depuis avant toi. Le groupe vit bien quand chacun porte quelque chose, petit. »
← **Je porte les bouteilles** — effets : vestiaire ++, tribunes −, relation.brehaut +1, set: groupe_accepte — *Tu portes. Vecchio te fait un clin d'œil ; il les a portées dix-sept ans.*
→ **Je ne suis pas là pour ça** — effets : vestiaire −−, tribunes +, relation.brehaut −1, set: mouton_noir — *Il pose le pack devant tes pieds. Tout le monde regarde le pack.*
**Traces** : groupe_accepte, mouton_noir (chapitre 10, `jp.brassard_test` : ce chapitre-ci en écrit l'ouverture, 10 la suite) · **Réactions déclenchées** : co.re.vecchio_bouteilles (§ 7.8) · **Lu plus tard par** : 10 (`jp.brassard_test` étapes 2-5), 30 (alarme vestiaire basse « plus de passe », `jp_mouton` plus)

### SCÈNE en.brehaut.groupe_a_lu  —  Le groupe a lu
**Rôle** : entraineur · **Intrigue** : co.brehaut_costume · **Étape** : 1/6 (variante entraîneur) · **Moment** : saison 0, [3,8] · **Lieu** : le vestiaire, un journal plié sur le banc · **Conditions** : `seen('en.presse.trois_questions') || flag('special')`
**BRÉHAUT** *(capitaine — neutre — il tapote le journal sans l'ouvrir)*
« Le groupe a lu ce que tu as dit à la presse, et il l'a lu deux fois. Le groupe vit bien, coach ; il aimerait l'apprendre par toi. »
← **Je le dis au groupe, là** — effets : vestiaire +, direction −, relation.brehaut +1 — *Tu parles dix minutes. Il hoche la tête à chaque phrase, un peu en retard.*
→ **La presse, c'est la presse** — effets : vestiaire −, tribunes +, relation.brehaut −1, set: groupe_lit_avant — *Le journal reste sur le banc. Le lendemain, il y en a deux.*
**Traces** : groupe_lit_avant (« {annee} : à {club}, le vestiaire apprend tout par le journal. Bréhaut le fait remarquer. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 11 (`en.re.brehaut_onze` variante), 30 (`en_copain` plus), 20 (« LE VESTIAIRE LIT »)

### SCÈNE co.brehaut.frere  —  Le frère
**Rôle** : joueur, entraineur · **Intrigue** : co.brehaut_costume · **Étape** : 2/6 · **Moment** : saison 1, [4,10] · **Lieu** : le parking, une voiture trop propre · **Conditions** : `gauges.caisse >= 40`
**BRÉHAUT** *(capitaine — neutre — il tient la portière, son frère est au volant)*
« Mon frère a un contrat d'image pour toi, et il ne lit pas plus vite que moi. Le groupe vit bien sans boisson orange ; toi, tu fais comme tu veux. »
← **Je lis, puis je signe** — effets : caisse ++, relation.brehaut +1, set: brehaut_frere, outcome: frere — *Tu lis. Il lit avec toi, lèvres qui bougent. Vous signez ensemble, la même boisson.*
→ **Pas de contrat en famille** — effets : caisse −, vestiaire +, relation.brehaut +1 — *Il ferme la portière. La voiture repart ; il reste sur le parking, soulagé.*
**Traces** : brehaut_frere · **Réactions déclenchées** : — · **Lu plus tard par** : 10 (`jp.contrat_image` variante « le frère »), 02 (Fardelli à −1), 30 (`jp_sandwich` plus)

### SCÈNE en.brehaut.dernier_brassard  —  Le dernier brassard
**Rôle** : entraineur · **Intrigue** : co.brehaut_costume · **Étape** : 3/6 · **Moment** : saison 1+, [8,14] · **Lieu** : la salle de soins, la glace sur le genou · **Conditions** : `chars.brehaut.age >= 36` ; variante `_gigi` si `flag('brassard_gigi')`
**BRÉHAUT** *(capitaine — neutre — il tient le brassard comme on tient une montre)*
« Trente-six ans, un genou qui parle, et un brassard qui pèse. Le groupe vit bien, coach ; préviens-moi avant le groupe, c'est tout ce que je demande. »
← **Tu seras prévenu le premier** — effets : vestiaire +, parole +1, promise, relation.brehaut +1, set: brehaut_previens — *Il replie le brassard dans sa main. Il ne demande pas la date ; il te fait confiance pour l'avoir.*
→ **Le brassard change dimanche** — effets : vestiaire −, force +1, relation.brehaut −1, set: brehaut_capitaine (clear), outcome: brassard_rendu — *Il le pose sur la table de massage. Sabatier le range dans un tiroir, sans un mot.*
*(Variante `_gigi` : « Gigi a le brassard sur les gants, et moi le genou dans la glace. Le groupe vit bien ; c'est moi qui vis moins bien. »)*
**Traces** : brehaut_previens (« {annee} : {prenom} {nom} a promis à Titi Bréhaut de le prévenir avant le groupe. Le groupe l'a su le lendemain. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 11 (`en.brassard_brehaut` étape S+1 : la promesse tenue ou non → parole), 30 (`en_copain` plus « Bréhaut a signé la pétition »)

### SCÈNE ds.brehaut.costume  —  Le costume
**Rôle** : ds, entraineur · **Intrigue** : co.brehaut_costume · **Étape** : 4/6 · **Moment** : saison 2+, Bilan [16,17] · **Lieu** : le couloir de la direction, un costume neuf sous housse · **Conditions** : `chars.brehaut.age >= 37`
**BRÉHAUT** *(capitaine — sourire ou neutre — la housse sur l'épaule comme un sac de sport)*
« Le président me propose un bureau, et un costume qui ne se lace pas. Le groupe vit bien ; je te demande si tu me vois dedans, coach. »
← **Mets-le, tu seras mon relais** — effets : direction +, vestiaire +, relation.brehaut +1, set: brehaut_ds, char: {brehaut: {statut: staff}}, outcome: costume — *Il l'essaie devant toi. Les manches sont trop longues ; il les garde comme ça toute sa carrière.*
→ **Reste sur le terrain, Titi** — effets : vestiaire ++, direction −, relation.brehaut +1, set: brehaut_capitaine, outcome: brassard_garde — *Il rend la housse. Le président en fait faire un autre, à quelqu'un d'autre.*
**Traces** : brehaut_ds, brehaut_capitaine · **Réactions déclenchées** : co.re.josiane_a_lu (si manchette) · **Lu plus tard par** : 12 (le DS avant toi), 13 (`pr.brehaut.ds_actif`), 20 (« LE BRASSARD MET UN COSTUME »), 90 (retrouvailles)

### SCÈNE pr.brehaut.ds_actif  —  Le DS de l'actif
**Rôle** : president · **Intrigue** : co.brehaut_costume · **Étape** : 5/6 · **Moment** : saison 1+, [4,12] · **Lieu** : la salle du conseil, Ilyas en visioconférence · **Conditions** : `flag('club_actif') && flag('brehaut_ds')`
**BRÉHAUT** *(directeur sportif — neutre — le costume aux manches trop longues, un dossier Almadis)*
« Le fonds veut vendre le petit et prêter deux jeunes au club frère. Le groupe vit bien, président ; le conseil aussi, et c'est lui qui vote. »
← **Le conseil vote, c'est moi** — effets : direction ++, tribunes −−, caisse +, relation.brehaut −1, set: brehaut_execute — *Il exécute. Il fait la vaisselle du conseil comme il faisait celle du vestiaire.*
→ **Le petit reste, dis-le** — effets : tribunes ++, direction −−, relation.brehaut +1, relation.nassir −1, set: brehaut_resiste — *Il le dit. Ilyas coupe la visioconférence. Titi range le dossier dans sa manche.*
**Traces** : brehaut_execute, brehaut_resiste (« {annee} : Titi Bréhaut a dit non au fonds au nom du président. Le fonds a noté le nom. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 13 (« Notification » : Bréhaut te la lit), 30 (`pr_pantin` plus)

### SCÈNE sl.brehaut.ecarte  —  Le capitaine écarté
**Rôle** : selectionneur · **Intrigue** : co.brehaut_costume · **Étape** : 6/6 (rôle sélection, 1990-1994) · **Moment** : fenêtre de mars, première Liste · **Lieu** : le hall de la Fédération, il attend devant salle 3 · **Conditions** : `year <= 1994 && !flag('capitaine_fauvel_confirme')`
**BRÉHAUT** *(capitaine de {club} — neutre — il a mis le brassard pour venir, sous la veste)*
« Fauvel a raté le tir au but, moi j'ai trente-trois ans et je n'ai rien raté. Le groupe vit bien avec deux capitaines, coach ; la liste, moins. »
← **Dans la liste, sans brassard** — effets : vestiaire +, tribunes +, relation.brehaut +1, relation.fauvel −1 — *Il monte dans le bus le premier. Fauvel s'assoit à côté de lui ; ils ne se parlent pas, ils se comprennent.*
→ **Pas cette fois, Titi** — effets : vestiaire −, direction +, relation.brehaut −1, set: brehaut_ecarte — *Il enlève le brassard sous la veste avant de sortir. On le voit quand même.*
**Traces** : brehaut_ecarte (« {annee} : Titi Bréhaut écarté des Cobalts par {prenom} {nom}. Il avait mis le brassard sous la veste. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 14 (Liste de juin : variante « Bréhaut a parlé à Vence »), 20 (« LE CAPITAINE SANS LISTE »)

### 2.5 Les paliers
### SCÈNE co.brehaut.trahison_petition  —  La pétition
**Rôle** : entraineur, joueur, ds · **Intrigue** : palier −3 · **Étape** : on_relation −3 · **Moment** : programmé en [1,3] · **Lieu** : le bureau du président, une feuille avec vingt-deux signatures · **Conditions** : `relation.brehaut <= -3`, une fois par carrière
**BRÉHAUT** *(capitaine ou DS — noir — il pose la feuille, signature en haut)*
« Vingt-deux noms, et le mien en premier, parce qu'un capitaine signe en premier. Le groupe vit bien, {nom} ; c'est écrit là, sans toi. »
← **Je lis les noms** — effets : vestiaire −−−, direction −−, set: petition_vestiaire — *Tu les lis. Gigi n'y est pas. C'est la seule ligne vide.*
→ **Je lis les noms** — effets : vestiaire −−−, direction −−, set: petition_vestiaire — *Tu les lis. Gigi n'y est pas. C'est la seule ligne vide.*
**Traces** : petition_vestiaire (« {annee} : vingt-deux signatures contre {nom}. Bréhaut en premier, Vecchio nulle part. ») · **Lu plus tard par** : 30 (`en_copain`, `en_bus` plus), 90 (Nemesis)

### SCÈNE co.brehaut.faveur_lettre  —  La lettre du vestiaire
**Rôle** : entraineur, joueur, ds · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : devant le bureau du président, une enveloppe du club · **Conditions** : `relation.brehaut >= 3`, une fois par carrière
**BRÉHAUT** *(capitaine ou DS — sourire — l'enveloppe non cachetée, pour que tu lises)*
« Une lettre du vestiaire pour le président : elle dit que tu restes, et elle est signée par tous. Le groupe vit bien, coach ; il l'a écrit lui-même, avec des fautes. »
← **Porte-la, avec les fautes** — effets : direction +++, vestiaire +, set: lettre_vestiaire — *Le président la lit deux fois. Il corrige une faute au stylo, puis il la range dans ton dossier.*
→ **Garde-la, ça se retournera** — effets : vestiaire ++, relation.brehaut −1 — *Il la remet dans la poche du survêtement. Il la ressortira le jour de ton départ, pour toi.*
**Traces** : lettre_vestiaire (« {annee} : le vestiaire a écrit au président pour garder {prenom} {nom}. Avec des fautes ; le président en a corrigé une. ») · **Lu plus tard par** : 30 (`en_sms` plus, `jp_porteparole` plus « Bréhaut a écrit la lettre »), 20 (« PROLONGÉ PAR LE VESTIAIRE »)

### 2.6 Les retrouvailles
### SCÈNE co.retrouvailles.brehaut_sourire  —  Les bouteilles, encore
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : Bréhaut parmi les deux meilleures relations · **Lieu** : le bord du terrain du nouveau club, fin d'échauffement
**BRÉHAUT** *(sa fonction du moment — sourire — un pack de bouteilles, par habitude)*
« Je porte encore les bouteilles, tu vois ; le costume a des poches, pas des mains. Le groupe vit bien, {prenom}, et il a demandé de tes nouvelles. »
**OK** **Donne-moi le pack** — effets : vestiaire +, relation.brehaut +1 — *Tu portes. Il te regarde porter avec le sourire de 1990.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.brehaut_noir  —  Le groupe vivait bien
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : Bréhaut parmi les pires relations · **Lieu** : le parking du nouveau club
**BRÉHAUT** *(sa fonction du moment — noir — il ne tend pas la main)*
« Le groupe vivait bien avant que tu partes, et il vit bien depuis. Je te le dis pour que tu ne poses pas la question, {nom}. »
**OK** **Je ne la posais pas** — effets : relation.brehaut +1, vestiaire − — *Il hoche la tête. Un peu en retard, comme toujours.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.brehaut_telephone  —  Le samedi de la buvette
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : après 2025 (`chars.brehaut.statut in [retraite, parti]` : il a quitté le club, pour la buvette ou pour la Ligue ; le samedi, c'est la buvette), une fois · **Conditions** : `relation.brehaut != 0` · **Lieu** : ton téléphone, un samedi, un fond de vaisselle
**BRÉHAUT** *(retraité, buvette des anciens — voix au téléphone — un fond de vaisselle)*
« Je tiens la buvette le samedi, comme quand la caisse avait fui, tu te souviens. Le groupe vit bien ; il a des cannes, mais il vit. »
← **Je passe samedi** — effets : tribunes +, relation.brehaut +1 — *Tu passes. Il te sert le premier, et fait payer les autres.*
→ **Je n'ai pas le temps** — effets : direction +, relation.brehaut −1 — *« J'ai pas le temps, j'ai un empire », dit-il en imitant l'autre. Il raccroche en riant. Pas toi.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### 2.7 Anecdotes
- **01.brehaut_boisson** — objet · `co.brehaut.frere` · La boisson orange de 1988 a un nom sur le contrat, jamais dans une réplique ; Titi en garde une canette pleine dans son casier, jamais ouverte.
- **01.brehaut_voiture** — décor · brèves · Il roule dans un break familial qu'il n'a pas rempli ; à l'arrière, les bouteilles.
- **01.brehaut_superstition** — légende de club · set-piece `gm_annonce` · Il entre sur le terrain du pied gauche et touche le poteau droit ; à 60 ans, il touche encore le poteau à la buvette.
- **01.brehaut_repas** — décor · `jp.vestiaire.repas_equipe` · Il mange du riz blanc la veille, un steak après ; « le groupe mange pareil », dit-il, et le groupe mange pareil.
- **01.brehaut_manches** — détail de portrait · `ds.brehaut.costume` · Les manches trop longues de son premier costume ne sont jamais reprises ; Ilyas les remarque, ne dit rien, note.

---

## 3. DOC SABATIER  (`sabatier`)
**Fonction** : médecin du club · **Genre** : m · **Âge en 1990** : 51 · **Camp** : terrain · **Fenêtre** : 1990-2010 (médecin de {club}, médecin des Cobalts 1996-2006), témoin de la commission antidopage 2010, retraité 2011 ; il meurt en 2029, à la table, en disant que ça reste entre elle et lui · **Suivant** : la docteure Ferrand (née 1968, arrive en 2008, ne prescrit rien qui ne se lise ; c'est la kiné Rouvier qui la recommande)
**Tic** : « Ça reste entre la table et moi. » — torsions : « Ça reste entre la table, moi, et le contrôleur. » · « Ça ne reste plus entre la table et moi. » · « Entre la table et toi, cette fois. Moi je sors. »
**Désir** : soigner, parfois trop · **Blessure** : ancien médecin d'une équipe cycliste (1978-1985), il sait ce qu'il y a dans le flacon B parce qu'il l'a rempli une fois ; il n'a plus jamais rien rempli, mais il n'a jamais rien dit
**Adresse** : entraineur : {prenom} / coach / monsieur {nom} · joueur : {prenom} / petit / {nom} · autres : § 0.1
**Ce qu'il pense de toi** : à +2 « tu écoutes ton corps et les miens, je te préviendrai » ; à 0 « tu joues avec des genoux qui ne sont pas les tiens » ; à −2 « tu as fait jouer un joueur que j'avais interdit ; je ne salue plus, je regarde »
**Paliers** : −3 → `co.sabatier.trahison_dossier` · +3 → `co.sabatier.faveur_controle`
**Dans les rôles** : joueur : horloge (le genou, la table, la piqûre ; 2) · entraîneur : cœur et tentateur (la pharmacie, le genou du petit ; 1,5) · sélectionneur : cœur (le médecin des Cobalts ; 1) · DS : messager (la visite médicale cachée ; 1) · instance : témoin (la commission antidopage 2010 ; 0,5) · président : voix au téléphone (0,5)
**Trajectoire 1990 → 2050** : 1990-1999 · 51-60 ans, barbe courte, lunettes rondes, blouse sur pull bleu ; la table, l'armoire, le premier contrôle inopiné (1991) ; médecin des Cobalts 1996 · 2000-2009 · gris depuis longtemps, lunettes déjà ; il vieillit par la voix, plus lente ; la docteure Ferrand arrive en 2008, il l'appelle « la table d'à côté » · 2010-2019 · témoin à la commission antidopage (2010) : il dit tout ou rien selon `flacon_b` et la relation ; retraité 2011 ; il vient encore le samedi, il regarde les genoux depuis la tribune · 2020-2029 · canne (2014) ; il meurt en 2020, la même année que Berthomier, on le note dans l'Almanach juste en dessous · 2030-2050 · une table de massage porte son nom au centre de formation ; on y dit encore que ça reste entre elle et nous
**Retrouvailles** : `co.retrouvailles.sabatier_sourire` / `_noir` / `_enterrement`
**Cartes propres** : *La table* (01) · *Le flacon du vélo* (01) · *Le genou du petit* (01) · *Le médecin des Cobalts* (01) · *La visite cachée* (01) · *Le témoin* (01) · *La pharmacie du club* (10-11, `co.pharmacie`) · *Le genou qui parle* (10, `jp.genou_parle`, absorbe `jp.corps.*` existantes)

### 3.1 Identité et place
Doc Sabatier ; personne ne connaît son prénom, sauf Josiane (Marcel) et elle ne le dit pas. 51 ans en 1990, 61 en 2000, 71 en 2010, 81 en 2020, 90 à sa mort. **Portrait** : la barbe courte poivre et sel qui blanchit par le menton, les lunettes rondes remontées sur le front quand il palpe, la blouse ouverte sur un pull bleu, l'odeur de camphre. **Voix** : douce, précise, un peu lasse ; il fait la moue avant de parler ; il dit « ça » pour tout ce qui fait peur. Au club, il est la table : ce qui s'y dit ne s'y dit pas ailleurs ; les joueurs y avouent, le coach y interroge, le président n'y entre pas. L'armoire à médicaments est plus grande que le vestiaire, et il en a la seule clé.

**Désir / besoin / blessure / secret.** Désir : que les corps tiennent une saison de plus ; parfois il pousse. Besoin : qu'on le croie quand il dit non. Blessure : le vélo, le flacon, un coureur qui n'a plus de reins. Secret : il garde dans le tiroir de la table un carnet où il note ce qu'il a refusé de faire ; à sa mort, il compte trente-deux lignes.

### 3.2 Les cinq registres
- **−3** — « Le dossier médical est allé à la Commission, monsieur {nom}. Il n'est plus resté entre la table et moi. » / « Vous l'avez fait jouer. Je regarde le match, je ne vous salue plus. »
- **−2 / −1** — « Le genou dit non, coach. Vous n'écoutez pas les genoux. » / « Ça reste entre la table et moi. C'est bien le problème : vous n'y venez plus. »
- **0** — « Un genou qui a des choses à dire. On l'écoute maintenant, ou en mai ? » / « Du sirop, du repos, et ça reste entre la table et moi. »
- **+1 / +2** — « {prenom}, le petit a le genou fini ; il ne le sait pas. Tu lui dis, ou moi ? » / « J'ai gardé la radio dans le tiroir. Ça reste entre la table et moi, et ton agent ne l'aura pas. »
- **+3** — « Le contrôleur est à l'accueil. Il cherche le bon bâtiment ; il a quatre-vingt-dix minutes de retard, si tu vois ce que je veux dire. » / « Je te dis tout, cette fois. Entre la table et toi ; moi je sors. »

### 3.3 Rapports avec les autres
**Alliés** : Rouvier (elle voit ce qu'il cache et ne dit rien : c'est un pacte, et une dette), Vecchio (quarante et un ans d'épaules), Vukić (le cahier et le carnet du tiroir se complètent). **Rivaux** : Fardelli (qui demande les radios), Massenet (qui demande les flacons), Brissac (« les chiffres sont têtus, les genoux aussi »). **Dettes** : il doit à Josiane son silence sur le vélo ; Berthomier lui doit un forfait arrangé (1996) qu'il n'a jamais réclamé. **Il craint** : Amsel, qui a tout son temps.

### 3.4 INTRIGUE co.sabatier_table  —  Entre la table et moi
**Logline** : Doc Sabatier sait tout des corps et une chose de trop sur le sien ; ce qu'il te dit dépend de ce que tu lui laisses garder. · **Synopsis** : Première visite : il te dit la règle de la table. Une nuit de déplacement, il raconte le vélo. Un jour, il te dit que le genou du petit est fini ; tu décides qui le lui dit. Médecin des Cobalts, il cache une blessure avant un tournoi. DS, il te propose d'arrondir une visite médicale. En 2010, devant la commission, il témoigne : de toi, ou pour toi.
**Rôle(s)** : joueur, entraineur, selectionneur, ds, instance · **Postulat(s)** : partagé · **Porteur** : sabatier · **Cast** : sabatier, rouvier, mbako, vecchio, legruet, amsel · **Thème** : corps
**Saisons** : "0" (table), "1" (flacon_velo, genou_du_petit), "2+" (cobalts, visite_cachee, temoin) · **Conditions d'entrée** : `chars.sabatier.statut in [club, staff]` ; l'étape temoin : `year >= 2010` · **Exclusions** : `co.pharmacie` la même saison · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `confident` → `sabatier_secret` (« {annee} : Doc Sabatier a parlé du vélo à {prenom} {nom}. C'est resté entre la table et eux. ») → lue par 15 (la commission : il témoigne pour toi), 30 (« le médecin après 70 ans »), 90 (retrouvailles) · `arrondi` → `visite_arrondie` (« {annee} : une visite médicale arrondie à {club}. Le genou n'a pas signé. ») → lue par 12 (la visite cachée revient à la vente), 20 (« LE GENOU N'AVAIT PAS SIGNÉ »), 30 (`ds_contrats` plus) · `temoin` → `sabatier_temoin` (« {annee} : Doc Sabatier a témoigné devant la commission antidopage. Il a dit tout. ») → lue par 15 (fede_dossier variante), 20, 30 (fin *Le flacon B*)
**Séquencier** : table (S0, [1,5]) → flacon_velo (S1+, [4,12], `relation.sabatier >= 1`) → genou_du_petit (S1+, [6,14], entraîneur) → cobalts (sélectionneur, fenêtre de juin, année ≥ 1996) | visite_cachee (DS, fenêtre de mercato) → temoin (instance, année ≥ 2010, lit `flacon_b`) ; lecture croisée : genou_du_petit lit `mbako_lance` (11).
**Épilogue** : `vestiaire −` ; « {annee} : la table est restée à {club}. Le tiroir aussi. »

### SCÈNE jp.sabatier.table  —  La table
**Rôle** : joueur · **Intrigue** : co.sabatier_table · **Étape** : 1/6 · **Moment** : saison 0, [1,5] · **Lieu** : la salle de soins, la table, une serviette pliée · **Conditions** : —
**SABATIER** *(médecin — neutre — les lunettes sur le front, les mains froides)*
« Ce que tu me dis ici, personne ne l'entend, ni le coach ni ton agent. Ça reste entre la table et moi, petit ; ce que tu ne me dis pas, je le vois quand même. »
← **Le genou tire depuis mars** — effets : force +2, tribunes −, relation.sabatier +1, set: sabatier_confie — *Il palpe. Il fait la moue. Il écrit une ligne dans le carnet du tiroir, pas dans le dossier.*
→ **Tout va bien, Doc** — effets : tribunes +, force −1, relation.sabatier −1 — *Il n'insiste pas. Il note quand même, et il souligne.*
**Traces** : sabatier_confie (« {annee} : {prenom} {nom} a dit au Doc que ça tirait. C'est resté entre la table et lui. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 10 (`jp.genou_parle` : variante « tu m'avais dit mars »), co.sabatier.faveur_controle (variante)

### SCÈNE co.sabatier.flacon_velo  —  Le flacon du vélo
**Rôle** : joueur, entraineur, selectionneur · **Intrigue** : co.sabatier_table · **Étape** : 2/6 · **Moment** : saison 1+, [4,12] · **Lieu** : l'hôtel de déplacement, la salle de soins improvisée · **Conditions** : `relation.sabatier >= 1 && season >= 1`
**SABATIER** *(médecin — sourire — un thermos, deux gobelets, la barbe dans la vapeur)*
« J'ai été médecin d'une équipe cycliste, il y a longtemps, et j'ai rempli un flacon une fois. Ça reste entre la table et moi ; je te le dis pour que tu saches ce que je refuserai. »
← **Je le garde pour moi** — effets : relation.sabatier +2, set: sabatier_secret, outcome: confident — *Il ferme le thermos. Il dort mieux ; toi, tu penses au flacon B.*
→ **Tu aurais dû le dire avant** — effets : relation.sabatier −1, direction + — *Il ne se défend pas. Il range le gobelet. Il ne t'invitera plus au thermos.*
**Traces** : sabatier_secret · **Réactions déclenchées** : co.re.rouvier_thermos (§ 12.8) · **Lu plus tard par** : 15 (commission antidopage : variante « il témoigne pour toi »), co.retrouvailles.sabatier_sourire, 30 (le médecin après 70 ans)

### SCÈNE en.sabatier.genou_du_petit  —  Le genou du petit
**Rôle** : entraineur · **Intrigue** : co.sabatier_table · **Étape** : 3/6 · **Moment** : saison 1+, [6,14] · **Lieu** : ton bureau, la porte fermée, une radio contre la fenêtre · **Conditions** : `chars.mbako.statut == 'club'` ; sinon « le petit » est le jeune gardien (`gardien_jeune`)
**SABATIER** *(médecin — neutre — la radio tenue à la lumière, sans la commenter)*
« Le genou du petit, c'est fini pour lui. Il ne le sait pas encore, et ça reste entre la table et moi jusqu'à ce que tu décides qui le lui dit. »
← **Je lui dis moi-même** — effets : vestiaire +, relation.mbako +1, relation.sabatier +1, set: genou_petit_dit — *Tu le lui dis. Il ne pleure pas ; il demande s'il peut jouer samedi. Tu dis non deux fois.*
→ **Que le Doc s'en charge** — effets : vestiaire −, relation.sabatier −1, direction + — *Il le lui dit. Le petit ne revient pas à la table ; il va voir Rouvier.*
**Traces** : genou_petit_dit (« {annee} : {prenom} {nom} a annoncé au petit que le genou était fini. Le petit a demandé pour samedi. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 11 (variante de `en.prodige` : Mbako blessé remplace « vendu » par « prêté »), 12 (le prix baisse), co.retrouvailles.mbako_sourire (variante « tu me l'as dit toi-même »)

### SCÈNE sl.sabatier.cobalts  —  Le médecin des Cobalts
**Rôle** : selectionneur · **Intrigue** : co.sabatier_table · **Étape** : 4/6 · **Moment** : fenêtre de juin, veille de la Liste du tournoi · **Lieu** : l'infirmerie du centre national, vingt-six dossiers · **Conditions** : `year >= 1996 && year <= 2006`
**SABATIER** *(médecin des Cobalts — neutre — un dossier de plus que les autres, retourné)*
« Ton meilleur joueur a une cheville qui tient trois matchs, pas sept ; son club ne le sait pas. Ça reste entre la table et moi, coach, et entre toi et ta liste. »
← **Il vient, trois matchs** — effets : force +2, tribunes +, set: cheville_cachee, relation.sabatier −1 — *Il vient. Il joue quatre matchs. Le cinquième, la cheville lâche en direct devant Vence.*
→ **Il reste chez lui** — effets : force −1, tribunes −, relation.sabatier +1, relation.fauvel −1 — *Il reste. Ce n'en était pas un.*
**Traces** : cheville_cachee (« {annee} : un joueur des Cobalts a joué le tournoi sur une cheville. Le Doc l'avait dit au sélectionneur. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 14 (chaîne Tournoi, temps fort « la cheville »), 20 (« LA CHEVILLE QUE PERSONNE N'A VUE »)

### SCÈNE ds.sabatier.visite_cachee  —  La visite cachée
**Rôle** : ds · **Intrigue** : co.sabatier_table · **Étape** : 5/6 · **Moment** : fenêtre de mercato · **Lieu** : la salle de soins, un joueur venu signer attend en survêtement · **Conditions** : `flag('genou_opere')` sur le joueur à vendre, ou une recrue dont l'agent est Fardelli
**SABATIER** *(médecin — neutre — deux dossiers, un épais, un fin)*
« Le genou de celui que tu vends a été opéré, et l'acheteur envoie son médecin demain. Ça reste entre la table et moi, directeur, si tu me demandes le dossier fin. »
← **Le dossier fin** — effets : caisse +++, relation.sabatier −1, set: visite_arrondie, outcome: arrondi — *Le médecin de l'acheteur lit trois pages. Il signe. Le genou lâche en octobre, chez eux.*
→ **Le dossier épais, tout** — effets : caisse −−, direction −, relation.sabatier +1, set: visite_honnete — *Le prix baisse d'un tiers. Le Doc range le dossier fin ; il le brûle, en fait.*
**Traces** : visite_arrondie, visite_honnete (« {annee} : {prenom} {nom} a montré le dossier épais. Le prix a baissé ; le genou, non. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 12 (l'acheteur revient avec Vialat), 20 (« LE GENOU N'AVAIT PAS SIGNÉ »), 30 (trait Intègre)

### SCÈNE in.sabatier.temoin  —  Le témoin
**Rôle** : instance · **Intrigue** : co.sabatier_table · **Étape** : 6/6 · **Moment** : un dossier de l'année, `year >= 2010` · **Lieu** : salle 3, la commission antidopage, une table qui n'est pas la sienne · **Conditions** : `flag('flacon_b') || flag('sabatier_secret')`
**SABATIER** *(témoin, 71 ans — neutre ou sourire selon la relation — la canne posée contre la table)*
« La commission me demande ce qui restait entre la table et moi. Je peux dire tout, monsieur le président, ou dire tout de toi ; ce n'est pas la même chose. »
← **Dis tout, je tiendrai** — effets : direction −−, tribunes +, parole +2, set: sabatier_temoin, outcome: temoin — *Il dit tout. Trente-deux lignes du carnet. Le tien y est, une fois, à ton avantage.*
→ **Dis ce qu'il faut** — effets : direction +, parole −2, relation.sabatier −2, set: temoin_arrange — *Il dit ce qu'il faut. En sortant il ne te salue pas ; il regarde, comme au match.*
**Traces** : sabatier_temoin, temoin_arrange (« {annee} : Doc Sabatier a dit « ce qu'il fallait » à la commission. Il n'a plus salué {nom}. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 15 (`fede_dossier` variante, `lanceur_alerte`), 30 (fin *Le flacon B*, `in_raid` plus), 02 (Amsel : « le médecin a un carnet »)

### 3.5 Les paliers
### SCÈNE co.sabatier.trahison_dossier  —  Le dossier n'est plus entre la table et moi
**Rôle** : joueur, entraineur, ds, selectionneur · **Intrigue** : palier −3 · **Étape** : on_relation −3 · **Moment** : programmé en [1,3] · **Lieu** : la salle de soins, le tiroir ouvert, vide · **Conditions** : `relation.sabatier <= -3`, une fois par carrière
**SABATIER** *(médecin — noir — il ne touche pas la table)*
« Le dossier est parti à la Commission ce matin, avec les radios et le carnet. Ça ne reste plus entre la table et moi, monsieur {nom} ; vous avez fait jouer un homme que j'avais interdit. »
← **Je prends la lettre** — effets : direction −−−, vestiaire −, set: dossier_medical_transmis — *La lettre arrive le lendemain. Elle cite trois dates. Toutes sont exactes.*
→ **Je prends la lettre** — effets : direction −−−, vestiaire −, set: dossier_medical_transmis — *La lettre arrive le lendemain. Elle cite trois dates. Toutes sont exactes.*
**Traces** : dossier_medical_transmis (« {annee} : Doc Sabatier a transmis le dossier médical à la Commission. Trois dates, toutes exactes. ») · **Lu plus tard par** : 15 (fede_dossier), 11 (commission de discipline), 30 (fins judiciaires), 20 (« LE MÉDECIN A PARLÉ »)

### SCÈNE co.sabatier.faveur_controle  —  Le bon bâtiment
**Rôle** : joueur, entraineur, selectionneur · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : le couloir du vestiaire, la porte de l'accueil au bout · **Conditions** : `relation.sabatier >= 3`, une fois par carrière
**SABATIER** *(médecin — sourire — les lunettes sur le nez, pour une fois)*
« Le contrôleur est à l'accueil et cherche le bon bâtiment ; il lui faut quatre-vingt-dix minutes. Ça reste entre la table et moi, {prenom} : qu'est-ce que tu fais de ces minutes ? »
← **Rien, on l'attend, propre** — effets : vestiaire +, parole +1, relation.sabatier +1, set: pharmacie_propre — *Il sourit. Le contrôleur repart, et le café du Doc est sucré.*
→ **Je vide l'armoire** — effets : vestiaire ++, direction +, parole −2, set: armoire_videe — *Tu vides. Il regarde ailleurs. Il souligne une ligne dans le carnet du tiroir.*
*(Variante si `flag('sabatier_confie')` : « Tu m'avais dit mars. Je te dis quatre-vingt-dix minutes. »)*
**Traces** : pharmacie_propre (∃ § 5.2), armoire_videe (« {annee} : l'armoire du club a été vidée en quatre-vingt-dix minutes. Le Doc n'a rien vu ; il a écrit. ») · **Lu plus tard par** : 10-11 (`co.pharmacie` : variante « l'armoire déjà vide »), 15 (Sabatier ennemi ou témoin), 30 (fin *Le flacon B* épitaphe plus)

### 3.6 Les retrouvailles
### SCÈNE co.retrouvailles.sabatier_sourire  —  La table d'à côté
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les deux meilleures relations · **Lieu** : la salle de soins du nouveau club, une table neuve
**SABATIER** *(sa fonction du moment — sourire — il tapote une table qui n'est pas la sienne)*
« Ici, la table est neuve et elle grince ; ça reste entre elle et moi. Tu as encore le genou de mars, {prenom}, je le vois d'ici. »
**OK** **Regarde-le, Doc** — effets : force +1, relation.sabatier +1 — *Il regarde. Il fait la moue. Rien de neuf, dit-il ; c'est bon signe.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.sabatier_noir  —  Je regarde
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les pires relations · **Lieu** : le couloir du vestiaire, il regarde tes jambes
**SABATIER** *(sa fonction du moment — noir — il ne tend pas la main, il regarde tes jambes)*
« Je ne salue pas, je regarde ; c'est ce que je fais depuis l'homme que vous avez fait jouer. Ça reste entre la table et moi, monsieur {nom}, et la table s'en souvient. »
**OK** **Cet homme a fini sa carrière** — effets : relation.sabatier +1, direction − — *« En boitant », dit-il. Il tourne les talons ; il boite un peu aussi, depuis la canne.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.sabatier_enterrement  —  Trente-deux lignes
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : 2029, une fois (`chars.sabatier.statut == 'mort' || (chars.sabatier.statut == 'parti' && flag('sabatier_mort'))`) · **Conditions** : `relation.sabatier != 0` · **Lieu** : la salle de soins de {club}, la table du Doc, le tiroir ouvert
**LA DOCTEURE FERRAND** *(médecin du club — neutre — un carnet à couverture noire, fermé)*
« Le Doc a laissé son carnet, trente-deux lignes de choses refusées, et ta ligne est dedans. Il disait que ça restait entre la table et lui ; la table est à toi si tu la veux. »
← **Je prends la table** — effets : vestiaire +, caisse −, set: table_du_doc — *La table grince chez toi. Tu n'y couches personne. Tu y poses le carnet.*
→ **Elle reste au club** — effets : tribunes +, relation.rouvier +1 — *Elle reste. Rouvier y met une plaque : « Ça reste entre la table et nous. »*
**Traces** : table_du_doc (objet héritable, Dossier) · **Lu plus tard par** : 90 (lignée : objet), 31 (épitaphe d'enterrement)

### 3.7 Anecdotes
- **01.sabatier_carnet** — objet · `in.sabatier.temoin`, enterrement · Le carnet du tiroir : trente-deux lignes en 2029, toutes des refus, datées ; la première est de 1985, la dernière de 2010.
- **01.sabatier_voiture** — décor · brèves · Une fourgonnette blanche à hayon, celle de l'équipe cycliste, avec la trace d'un ancien logo sous la peinture.
- **01.sabatier_superstition** — légende de club · set-piece `aftermatch` · Il ne dit jamais « fini » avant la soixante-dixième minute ; il dit « on verra », comme Berthomier, et ça l'agace.
- **01.sabatier_repas** — décor · `co.sabatier.flacon_velo` · Le thermos contient du café et un fond de gnôle ; « pour la table », dit-il ; la table ne boit pas.
- **01.sabatier_camphre** — détail de portrait · toute scène de soins · L'odeur de camphre le précède de trois mètres ; les joueurs savent qu'il arrive avant d'entendre la porte.

---

## 4. CAMILLE  (`camille`)
**Fonction** : à la maison · **Genre** : f · **Âge en 1990** : 32 · **Camp** : terrain (`characters.yaml` ; le camp `famille` est réservé à Sacha) · **Fenêtre** : toute la carrière ; après `divorce`, elle ne parle qu'au téléphone et à la Succession · **Suivant** : personne : Camille est unique par carrière ; sa suite dans le monde est Sacha (§ 19), et, pour la lignée, « la personne qui partage la vie » du successeur porte le même id et un autre prénom si le chapitre 90 le décide
**Tic** : « Tu rentres à quelle heure ? » — torsions : « Tu rentres ? » · « Tu rentres à quelle heure, et où ? » · « Je demande pour savoir si je mets une assiette. »
**Désir** : que tu existes ailleurs que sur un terrain · **Blessure** : elle a renoncé à quelque chose pour te suivre (un cabinet, une rédaction, un mandat, un service : son métier tiré au sort — `camille_avocate`, `camille_journaliste`, `camille_agente`, `camille_medecin`, `camille_elue` — est ce à quoi elle a renoncé, et ce qu'elle reprend à `camille_ici`)
**Adresse** : {prenom} / {prenom} / {nom} dans tous les rôles ; à −1 elle dit {nom}, et c'est la première chose qu'on remarque
**Ce qu'elle pense de toi** : à +2 « tu es là, même quand tu revois le but encaissé » ; à 0 « une assiette ou deux, je demande » ; à −2 « la chambre d'amis est faite ; ce n'est pas pour un ami »
**Paliers** : ∃ (déjà dans `content/`, cités et jamais réécrits) −1 → `co.camille.dispute` · −2 → `co.camille.chambre_amis` · −3 → `co.camille.valise` (pose `divorce`) · +3 → `co.camille.secours_avocate` / `_journaliste` / `_elue` / `_generique` ; **ce chapitre ajoute les deux secours manquants** : `co.camille.secours_medecin`, `co.camille.secours_agente`
**Dans les rôles** : tous : la cinquième jauge (0,5 à 1 par saison) ; joueur : `jp.famille.*` existantes ; entraîneur : `co.camille.*` existantes et `co.cartons_camille` (11) ; DS : le mercato à table ; présidents : la loge vide ; sélectionneur : le téléphone depuis l'hôtel ; instance : la valise qu'elle ne fait pas — la sienne, à l'hôtel du Lac
**Trajectoire 1990 → 2050** : 1990-1999 · 32-41 ans, queue de cheval, pull orange ; la maison à deux cents kilomètres ; la Naissance (Sacha) entre 1991 et 2000 ; les cartons · 2000-2009 · gris (2003) qu'elle ne cache pas ; elle reprend le métier (`camille_ici`) ; elle lit L'Écho, jamais la Gazette · 2010-2019 · lunettes (2013) ; elle a un compte sur le Flux pour lire Sacha, pas toi · 2020-2029 · si `divorce` : elle vit à Portclair ; sinon elle vient au stade une fois par an, tribune Est, à côté de la place 14B · 2030-2050 · elle survit à tout le monde ; à la fin de la carrière elle dit « tu rentres ? », et cette fois tu rentres
**Retrouvailles** : `co.retrouvailles.camille_sourire` / `_noir` / `_telephone` (après `divorce`)
**Cartes propres** : *La naissance* (01) · *Le cabinet ouvre en septembre* (01) · *La boulangère* (01) · *La chambre d'hôtel* (01) · *La tribune vide* (01) · *Pardon, l'habitude* (01) · *Les cartons* (11, `co.cartons_camille`) · *Le bac de Camille* (10, `jp.camille_bac`) · *Noël, l'anniversaire, le dimanche* (existants, `co.camille.noel` etc.) · *Le podcast* (existant, `jp.famille.podcast`)

### 4.1 Identité et place
Camille ; pas de nom de famille écrit (elle porte le tien ou le sien, le jeu ne tranche pas). 32 ans en 1990, 42 en 2000, 52 en 2010, 62 en 2020, 72 en 2030, 92 en 2050. **Portrait** : la queue de cheval de fin de journée, le pull orange (le seul point de couleur chaude du casting), le journal ouvert sur la table de la cuisine, ton nom entouré. **Voix** : nette, ironique sans être froide, jamais un cri ; elle pose des questions courtes qui contiennent la réponse. Elle est la maison : la table où l'on mange, la sieste du dimanche, le sapin dans l'entrée avec l'adjoint. Elle n'entre jamais au stade sauf deux fois : la tribune vide avec Sacha, et le jubilé.

**Désir / besoin / blessure / secret.** Désir : que tu rentres, et pas seulement à une heure. Besoin : un métier à elle, dans cette ville-ci. Blessure : le poste refusé en 1989 pour te suivre à {ville}. Secret : elle a gardé la lettre d'embauche de 1989, non signée, dans le tiroir de la cuisine ; Sacha la trouvera à dix-sept ans.

### 4.2 Les cinq registres
- **−3** — « La valise est dans l'entrée, {nom}. Elle est à moi. » (existant) / « Tu rentres à quelle heure ? Je demande pour l'avocat. »
- **−2 / −1** — « J'ai fait le lit de la chambre d'amis. Ce n'est pas pour un ami. » (existant) / « Tu rentres à quelle heure, {nom} ? Je demande pour savoir si je mets une assiette. »
- **0** — « Tu rentres à quelle heure ? Dimanche, il y a le marché, la sieste et toi. » (existant) / « J'ai lu le journal. La boulangère aussi. »
- **+1 / +2** — « Tu rentres à quelle heure ? Je fais le grand plat. {prenom}, invite-les. » / « Le cabinet ouvre en septembre. Ici. Tu rentres à quelle heure, pour fêter ça ? »
- **+3** — « Ta sanction, je l'ai lue ; elle a un vice de forme gros comme le stade. » (existant) / « J'ai invité le vestiaire dimanche. Je cuisine, tu te tais, ils parlent. » (existant)

### 4.3 Rapports avec les autres
**Alliés** : Josiane (elles se téléphonent le lundi ; Josiane lui dit à quelle heure tu es parti), Vecchio (il l'appelle « madame », il est le seul), Rouvier (le cabinet, plus tard, est à côté du sien). **Rivaux** : Vaubourg (qui réserve pour toi le soir de son anniversaire), Massenet (qui a un papier), Fardelli (qui demande si « on a un projet »). **Dettes** : elle doit à Sabatier de t'avoir gardé debout ; Gégé lui doit une bâche (« CAMILLE, TU RENTRES À QUELLE HEURE » a été peint une fois, pour rire, elle n'a pas ri).

### 4.4 INTRIGUE co.camille_naissance  —  Sacha
**Logline** : Camille demande à quelle heure tu rentres ; un jour c'est pour la maternité, un jour pour le cabinet, un jour pour la tribune vide où votre fille t'attend. · **Synopsis** : La Naissance tombe une nuit de match. Puis Camille reprend son métier ici, ou pas. Après un derby perdu, la boulangère lui fait un prix. Une saison à l'hôtel du club, elle vient voir la chambre. Sacha a six ans et regarde une tribune vide. Après le divorce, elle appelle encore : « Tu rentres à quelle heure ? Pardon. L'habitude. »
**Rôle(s)** : tous (le joueur a `jp.famille.naissance` existante, qui doit **aussi** poser `sacha_nee` — remarque pour le chapitre 10 et le chantier données) · **Postulat(s)** : partagé · **Porteur** : camille · **Cast** : camille, sacha, josiane, vecchio, rouvier · **Thème** : famille
**Saisons** : "1" (naissance : jamais en S0, c'est une carte de vie, pas de drame), "1" (metier), "2+" (boulangere, hotel, tribune_vide, telephone) · **Conditions d'entrée** : `!flag('divorce')` sauf telephone · **Exclusions** : `co.cartons_camille` en cours · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `nee` → `sacha_nee` (§ 5.2 #25 ; « {annee} : Sacha est née une nuit de match. {prenom} {nom} est arrivé{pg, select, f{e} other{}} avant / après le coup de sifflet. ») → lue par 19 (toutes les cartes de Sacha), 10 (héritière), 13, 14, 15, 90 · `metier_repris` → `camille_metier` (« {annee} : Camille a rouvert son cabinet à {ville}. Elle rentre plus tard que {nom}, parfois. ») → lue par 30 (secours à +3 : variante « ici »), 11 (`co.cartons_camille` : exclusion), 13 (la loge : elle n'a pas le temps) · `tribune` → `sacha_tribune_vide` (« {annee} : Sacha, six ans, a regardé un stade vide. Son père/sa mère était sur le banc. ») → lue par 19 (`co.sacha.six_ans`), 90 (lignée)
**Séquencier** : naissance (S1+, [4,14], `!flag('sacha_nee')`) → metier (S1+, [2,10], lit `camille_ici` de 11) → boulangere (S2+, [1,6], lit `derby_perdu`) → hotel (S2+, `flag('hotel_du_club')`) → tribune_vide (six saisons après naissance) → telephone (`flag('divorce')`, une fois)
**Épilogue** : rien : Camille suit la carrière, pas le club.

### SCÈNE co.camille.naissance  —  La naissance
**Rôle** : entraineur, ds, president, president_amateur, selectionneur, instance · **Intrigue** : co.camille_naissance · **Étape** : 1/6 · **Moment** : saison 1+, [4,14], jamais un créneau de Grand Match · **Lieu** : le téléphone du vestiaire, une heure avant le coup d'envoi · **Conditions** : `!flag('sacha_nee') && !flag('divorce') && season >= 1`
**CAMILLE** *(à la maison — neutre — essoufflée, une valise déjà faite, la bonne cette fois)*
« Tu rentres à quelle heure ? Je demande pour la maternité, le travail a commencé et le match dans une heure, je sais. »
← **J'arrive, le match attendra** — effets : relation.camille +2, vestiaire −, tribunes −, set: sacha_nee, set: naissance_avant, outcome: nee — *Vukić fait la causerie. Sacha naît à la vingt-troisième minute ; tu ne sauras jamais le score de la vingt-troisième.*
→ **Après le coup de sifflet** — effets : relation.camille −2, tribunes +, set: sacha_nee, set: naissance_apres, outcome: nee — *Tu arrives à minuit. Elle dort ; Sacha aussi ; Josiane est dans le couloir, elle a apporté un dossier et un lapin.*
**Traces** : sacha_nee, naissance_avant, naissance_apres (« {annee} : Sacha est née pendant le match. {prenom} {nom} est arrivé{pg, select, f{e} other{}} à minuit. ») · **Réactions déclenchées** : co.re.josiane_lapin (§ 4.8) · **Lu plus tard par** : § 19 (`co.sacha.six_ans` variante « tu es arrivé après »), 10 (Succession : héritière), 13 (« Papa, tu as tweeté »), 14 (l'hymne), 15 (l'ONG), 90 (lignée), 30 (set-piece `bilan_carrefour` : « il y a quelqu'un à la maison maintenant »)

### SCÈNE co.camille.metier  —  Le cabinet ouvre en septembre
**Rôle** : tous sauf joueur amateur · **Intrigue** : co.camille_naissance · **Étape** : 2/6 · **Moment** : saison 1+, [2,10] · **Lieu** : la cuisine, une lettre à en-tête sur la table · **Conditions** : `flag('camille_ici') && !flag('divorce')` ; le mot « cabinet » devient « rédaction », « agence », « service », « permanence » selon `camille_<metier>`
**CAMILLE** *(à la maison — sourire — la lettre tenue comme un contrat pro)*
« Le cabinet ouvre en septembre, ici, à {ville}, avec mon nom sur la porte. Tu rentres à quelle heure ? Parce que moi, je rentrerai tard. »
← **Ton nom sur la porte, enfin** — effets : relation.camille +2, caisse +, set: camille_metier, outcome: metier_repris — *Le nom est sur la porte en septembre. Le tien, sur la bâche ; elle trouve ça équitable.*
→ **Et si on repart en juin ?** — effets : relation.camille −2, direction + — *Elle plie la lettre. Elle la range dans le tiroir de la cuisine, avec l'autre, celle de 1989.*
**Traces** : camille_metier · **Réactions déclenchées** : — · **Lu plus tard par** : 30 (secours +3 variante « je plaide ici »), 11 (`co.cartons_camille` exclu ensuite), 13 (« elle n'a pas le temps pour la loge »), 90 (Sacha trouve la lettre de 1989 : `co.sacha.nom_de_famille` variante)

### SCÈNE co.camille.boulangere  —  La boulangère
**Rôle** : tous · **Intrigue** : co.camille_naissance · **Étape** : 3/6 · **Moment** : saison 2+, [1,6] · **Lieu** : la cuisine, un pain entamé · **Conditions** : `flag('derby_perdu') && !flag('divorce')`
**CAMILLE** *(à la maison — neutre — elle coupe le pain trop épais)*
« La boulangère m'a fait un prix, comme après chaque derby perdu ; celui-là, c'est le prix des veuves. Tu rentres à quelle heure, ou tu rentres par le jardin ? »
← **Par le jardin, ce soir** — effets : tribunes −, relation.camille +1, vestiaire + — *Tu passes par le jardin. Elle a laissé la lumière de la cuisine. Le pain est bon.*
→ **Par la porte, tête haute** — effets : tribunes +, relation.camille −1, set: derby_tete_haute — *La voisine te voit. La boulangère l'apprend. Le lendemain, le pain est au prix normal ; c'est pire.*
**Traces** : derby_tete_haute (`journal:` poids 1, sans Almanach) · **Réactions déclenchées** : — · **Lu plus tard par** : § 9 (Gégé : `jp.gege.petit` variante « ta femme est passée par la porte »), 20 (Écho, brève)

### SCÈNE co.camille.hotel  —  La chambre d'hôtel
**Rôle** : entraineur, ds, selectionneur · **Intrigue** : co.camille_naissance · **Étape** : 4/6 · **Moment** : saison 2+, [3,9] · **Lieu** : l'hôtel du club, chambre 12, une valise ouverte sur le lit · **Conditions** : `flag('hotel_du_club') && !flag('divorce')`
**CAMILLE** *(à la maison — noir ou neutre selon la relation — elle a fait deux cents kilomètres pour voir la chambre)*
« Chambre douze, un lit, une fenêtre sur le parking et Josiane qui te sert le café. Tu rentres à quelle heure, ou c'est ici que tu rentres ? »
← **C'est ici, pour cette saison** — effets : relation.camille −2, direction +, set: hotel_assume — *Elle ferme la valise. Elle repart le soir même. Josiane lui offre le café, sans rien dire.*
→ **On cherche une maison** — effets : relation.camille +2, caisse −−, set: maison_cherchee — *Vous visitez trois maisons le dimanche. Pas de vidéo ce dimanche-là. Vukić remarque.*
**Traces** : hotel_assume, maison_cherchee (« {annee} : {prenom} {nom} a quitté la chambre 12 de l'hôtel du club. Camille avait choisi la maison. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 30 (set-piece `objective` variante « Josiane sert le café » disparaît), 11 (`co.cartons_camille` rejouable `after`), § 19 (Sacha : « la maison de {ville} »)

### SCÈNE co.camille.tribune_vide  —  La tribune vide
**Rôle** : tous · **Intrigue** : co.camille_naissance · **Étape** : 5/6 · **Moment** : six saisons après `sacha_nee`, [8,14] · **Lieu** : la tribune Est, un mardi d'entraînement ouvert, personne · **Conditions** : `chars.sacha.age >= 6 && !flag('divorce')`
**CAMILLE** *(à la maison — neutre — Sacha sur les genoux, qui regarde la pelouse sans bouger)*
« Elle voulait voir où tu travailles ; elle regarde depuis vingt minutes et elle n'a pas demandé où tu étais. Tu rentres à quelle heure, pour qu'on lui explique ? »
← **Je monte, maintenant** — effets : vestiaire −, relation.camille +1, relation.sacha +1, set: sacha_tribune_vide, outcome: tribune — *Tu montes. Sacha te montre le rond central : « c'est là que tu cries ». Elle a compris.*
→ **Après la séance, promis** — effets : force +1, relation.sacha −1, parole +1, promise, set: sacha_promesse_tribune — *La séance dure. Quand tu montes, il n'y a plus que Camille, et un chocolat entamé sur le siège 14B.*
**Traces** : sacha_tribune_vide, sacha_promesse_tribune (« {annee} : {prenom} {nom} a promis de monter après la séance. Sacha avait fini le chocolat. ») · **Réactions déclenchées** : — · **Lu plus tard par** : § 19 (`co.sacha.six_ans` : « tu m'as promis »), § 18 (Paulette : le chocolat sur la 14B), 90 (lignée : trait « a grandi dans une tribune vide »)

### SCÈNE co.camille.telephone  —  Pardon, l'habitude
**Rôle** : tous · **Intrigue** : co.camille_naissance · **Étape** : 6/6 · **Moment** : la saison qui suit `divorce`, [2,12], une fois · **Lieu** : ton téléphone, un soir de semaine · **Conditions** : `flag('divorce')` ; `statut_ok` implicite : Camille parle au téléphone
**CAMILLE** *(voix au téléphone — neutre — un silence avant de parler)*
« Tu rentres à quelle heure ? Pardon, l'habitude ; j'appelais pour Sacha, elle a un mot de l'école, et c'est toi qui signes celui-là. »
← **Je signe, et je passe** — effets : relation.camille +1, relation.sacha +1, vestiaire − — *Tu signes dans l'entrée. Elle ne te fait pas entrer. Sacha te fait un signe depuis l'escalier.*
→ **Envoie-le au club, Josiane** — effets : relation.sacha −1, direction + — *Le mot arrive au secrétariat. Josiane signe à ta place, imite ta signature très bien, et te le dit.*
**Traces** : — (`journal:` poids 2 : « {annee} : Camille a appelé après le divorce. Par habitude. ») · **Réactions déclenchées** : — · **Lu plus tard par** : § 19 (Sacha à −1 : « {nom} »), 90 (Sacha héritière lit la relation Camille)

### 4.5 Les paliers (les deux secours manquants)
### SCÈNE co.camille.secours_medecin  —  Le certificat
**Rôle** : entraineur, joueur, ds, selectionneur · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : la cuisine, le protocole du contrôle étalé sur la table · **Conditions** : `flag('camille_medecin') && relation.camille >= 3`, une fois par carrière
**CAMILLE** *(à la maison, médecin — sourire — une blouse sur le dossier de la chaise, pour une fois)*
« Ton joueur suspendu pour le contrôle, j'ai lu le protocole : ils ont ouvert le flacon sans témoin. Je signe le certificat ce soir, si tu veux ; tu rentres à quelle heure ? »
← **Signe-le** — effets : vestiaire +++, direction +, relation.camille +1, relation.sabatier −1 — *La suspension tombe en dix jours. Sabatier n'aime pas qu'une autre blouse entre dans son dossier. Il le dit à la table.*
→ **Ne te mêle pas de ça** — effets : vestiaire +, relation.camille −1 — *Elle range la blouse. Le joueur purge. Elle te trouve prudent ; c'est un reproche.*
**Traces** : — · **Lu plus tard par** : 15 (commission antidopage : « un certificat de la conjointe du sélectionneur »), 20 (« LE CERTIFICAT DE LA MAISON »)

### SCÈNE co.camille.secours_agente  —  Le double mandat
**Rôle** : joueur, entraineur, ds · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : la cuisine, deux contrats côte à côte, un troisième en brouillon · **Conditions** : `flag('camille_agente') && relation.camille >= 3`, une fois par carrière
**CAMILLE** *(à la maison, agente — sourire — deux contrats côte à côte, le tien et celui du club)*
« Ton agent négocie contre toi depuis mars, j'ai les deux contrats ; j'en dépose un troisième demain, à ton nom. Tu rentres à quelle heure, qu'on le relise ? »
← **Dépose-le, j'ai confiance** — effets : caisse +++, relation.camille +1, relation.fardelli −2, set: camille_agente_mandat — *Fardelli apprend le mandat par Josiane. Il appelle « mon ami » ; il tombe sur elle.*
→ **Fardelli reste mon agent** — effets : caisse +, relation.camille −2, relation.fardelli +1 — *Elle range le troisième contrat. Elle le garde ; elle a toujours raison en septembre.*
**Traces** : camille_agente_mandat (« {annee} : Camille est devenue l'agente de {prenom} {nom}. Fardelli a appelé, il est tombé sur elle. ») · **Lu plus tard par** : 30 (postulat dérivé `couple_d_affaires`), 02 (Fardelli à −2), 12 (les quatre agents : « la cinquième »)

### 4.6 Les retrouvailles
### SCÈNE co.retrouvailles.camille_sourire  —  Deux assiettes
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les deux meilleures relations, `!flag('divorce')` · **Lieu** : la cuisine de la nouvelle maison, deux assiettes
**CAMILLE** *(à la maison — sourire — deux assiettes, déjà)*
« Nouveau club, même cuisine, j'ai mis deux assiettes sans demander. Tu rentres à quelle heure, {prenom} ? Pour la sauce, pas pour toi. »
**OK** **Avant la sauce** — effets : relation.camille +1, vestiaire − — *Tu rentres avant. C'est la première fois de la carrière ; elle ne le fait pas remarquer, elle le note.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.camille_noir  —  Une assiette
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les pires relations, `!flag('divorce')` · **Lieu** : la cuisine de la nouvelle maison, des cartons fermés
**CAMILLE** *(à la maison — noir — une assiette dans l'évier, propre)*
« Nouveau club, nouvelle ville, même question, {nom} : tu rentres à quelle heure ? Je demande pour savoir si je défais mes cartons. »
**OK** **Défais-les, je rentre tôt** — effets : relation.camille +1, direction − — *Elle défait un carton. Un seul. Elle attend de voir.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.camille_telephone  —  Sacha a dix-sept ans
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : après `divorce`, à la Passation suivante, une fois · **Conditions** : `flag('divorce') && flag('sacha_nee')` · **Lieu** : ton téléphone, un soir, un fond de radio
**CAMILLE** *(voix au téléphone — neutre — un fond de radio, Radio Tribune peut-être)*
« Sacha a trouvé une lettre de 1989 dans le tiroir de la cuisine, et elle demande ce que j'aurais fait sans toi. Tu rentres à quelle heure, pardon, tu passes quand ? »
← **Ce soir, je lui explique** — effets : relation.sacha +1, relation.camille +1, vestiaire − — *Tu expliques. Sacha écoute jusqu'au bout. Camille aussi, depuis la cuisine ; elle n'avait jamais entendu ta version.*
→ **C'est à toi de lui dire** — effets : relation.sacha −1, direction + — *Elle lui dit. Sa version. Sacha t'appelle par ton nom de famille pendant un an.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### 4.7 Anecdotes
- **01.camille_lettre** — objet · `co.camille.metier`, `co.retrouvailles.camille_telephone` · La lettre d'embauche de 1989, non signée, dans le tiroir de la cuisine ; elle déménage avec les couverts.
- **01.camille_journal** — décor · `co.re.camille_journal` · Elle lit L'Écho à voix haute pour le chat, jamais la Gazette ; le chat s'appelle Massenet, elle ne l'a jamais dit à Massenet.
- **01.camille_voiture** — décor · brèves · Une petite citadine rouge qu'elle a achetée seule le jour où tu as signé ton premier gros contrat ; elle a payé comptant.
- **01.camille_repas** — décor · `jp.famille.diner_rescue` · « Le grand plat du pays » n'a pas de nom : c'est un gratin, elle en fait vingt-deux parts, et Bréhaut fait la vaisselle.
- **01.camille_stade** — légende · `co.camille.tribune_vide`, jubilé · Elle n'entre au stade que deux fois par carrière ; les deux fois, elle s'assoit à côté de la place 14B, sans savoir pourquoi.

### 4.8 Réactions propres
### RÉACTION co.re.josiane_lapin  —  Le lapin
**Après** : co.camille.naissance (→ après le coup de sifflet) · **Famille** : tiers qui commente · **Conditions** : `relation.josiane >= 0`
**MADAME JOSIANE** *(secrétaire — neutre — un lapin en peluche et un dossier sous le même bras)*
« J'ai apporté le lapin et le dossier des primes, on ne sait jamais. J'en ai vu passer, vous savez ; pas des naissances à la vingt-troisième. »
**Un bouton** : **Merci, Josiane** — effets : direction +, relation.josiane +1 — *Le lapin reste dans la chambre. Le dossier, sur la table de nuit.*

### RÉACTION co.re.camille_valises_vukic  —  Trois valises et la nôtre
**Après** : co.vukic.faveur_trois_valises (← monte) · **Famille** : conséquence immédiate · **Conditions** : `!flag('divorce')`
**CAMILLE** *(à la maison — neutre — les cartons pas encore faits)*
« Ton adjoint a trois valises dans ton coffre et moi j'ai une maison à emballer. Tu rentres à quelle heure, pour faire au moins la tienne ? »
**Un bouton** : **Je fais la mienne ce soir** — effets : relation.camille +1, vestiaire − — *Tu la fais. Vukić attend dans la voiture. Il a apporté du ruban adhésif.*

---

## 5. DAN CORVEN  (`clow`)
**Fonction** : le mentor · **Genre** : m · **Âge en 1990** : 61 · **Camp** : terrain · **Fenêtre** : 1990 jusqu'à sa mort (entre 1995 et 2000 selon la carrière : l'hôpital de `en.clow.hopital` ; sinon il meurt en 2000, une Nouvelle datée le dit), puis un buste au Panthéon · **Suivant** : « le fils de Corven » (Owen Corven, né 1962, entraîneur de National dès 2005, de D1 en 2012 ; voix sans portrait dans les chapitres 10-15, portrait si le chapitre 90 le promeut) — il refuse ta lignée si `clow_ingrat`
**Tic** : « Je ne dirais pas que j'étais un grand. Je dirais que j'étais devant. » — torsions : « Je ne dirais pas que tu es le meilleur. Je ne dirais rien, en fait. » · « Il était devant. Devant la sortie. » · « Être devant, petit, c'est une place pour deux : toi et ce qui te suit. »
**Désir** : te voir réussir sans le dire · **Blessure** : cinquante-neuf jours dans un grand club (Capitale FC, 1971 : renvoyé par télégramme un dimanche, il a gardé le télégramme) ; il a arrêté quelque chose en 1979 et ne dit jamais quoi ; devant lui, toujours, un verre d'eau plein à ras bord
**Adresse** : entraineur : petit / {prenom} / coach · joueur : petit / petit / {nom} · autres : § 0.1
**Ce qu'il pense de toi** : à +2 « tu écoutes ; les gens qui écoutent finissent sur un banc, le bon » ; à 0 « tu as peur du président, ça se voit à ton café » ; à −2 « tu n'appelles plus ; bon signe, un coach qui écoute n'en est pas un »
**Paliers** : −3 → `co.clow.trahison_devant` · +3 → `co.clow.faveur_telegramme`
**Dans les rôles** : entraîneur : mentor (trois conseils, l'hôpital, le testament ; 0,5 dès S1) · joueur : mentor du diplôme (« lundi, huit heures » ; 1 en fin de carrière) · sélectionneur : le seul qui te dise que tu vas perdre (0,5) · DS : « le fils de Corven » refuse ou accepte ta lignée (0,5) · présidents, instance : au téléphone, puis le buste
**Trajectoire 1990 → 2050** : 1990-1999 · 61-70 ans, cheveux blancs, doudoune verte du banc, chewing-gum ; le bar, le verre plein à ras bord, les trois conseils ; l'hôpital ; la mort (chambre 12) · 2000 · s'il vit encore : la Nouvelle « Dan Corven est mort dans son sommeil, un verre d'eau plein sur la table » · 2000-2009 · le buste (Panthéon) ; le fils de Corven prend un banc en 2005 · 2010-2019 · le fils en D1 ; il porte la doudoune du père le jour des derbies · 2020-2050 · le stage du diplôme s'appelle « le stage Corven » ; on y dit la phrase, avec ou sans « devant »
**Retrouvailles** : `co.retrouvailles.clow_sourire` / `_noir` / `_fantome` (le buste parle : une seule fois par carrière, un Fantôme sans être joué)
**Cartes propres** : *Lundi, huit heures* (01) · *Trois verres* (01) · *Tu vas perdre* (01) · *Le télégramme* (01) · *Le fils de Corven* (01) · *L'enterrement* (01) · *Le mentor* (existant, `en.clow.*`) · *Le diplôme* (10, `jp.diplome_joueur` ; 11, `en.diplome` : le stage animé par Corven)

### 5.1 Identité et place
Dan Corven ; « Corven » tout court dans la bouche des joueurs, « monsieur Corven » pour Josiane, « le vieux » pour Vaubourg, qui ne l'a jamais embauché. 61 ans en 1990, 66 à 71 ans à sa mort. **Portrait** : les cheveux blancs plaqués en arrière, la doudoune verte du banc (hiver 1990, il ne l'enlève jamais, même au bar), la boule de chewing-gum qui roule quand il réfléchit, le verre à côté, plein à ras bord, qu'il ne boit pas toujours. **Voix** : haute, nasale, ironique, une phrase sur deux commence par « petit » ; il parle de lui à la troisième personne quand il ment. Il n'est de personne : il suit l'entraîneur (`same_club: false`), pas le club, s'assoit au bar en face du stade, au téléphone, à l'hôpital. Il a un tabouret réservé dans trois villes.

**Désir / besoin / blessure / secret.** Désir : que tu réussisses, et qu'on dise qu'il t'a appris. Besoin : qu'on l'appelle. Blessure : le télégramme de 1971 (cinquante-neuf jours). Secret : il n'a jamais gagné un titre comme entraîneur ; le « devant » est sa seule victoire, et il le sait.

### 5.2 Les cinq registres
- **−3** — « Je ne dirais pas qu'il était le pire, coach. Je ne dirais rien ; c'est déjà beaucoup. » / « Tu as effacé le message. Le président en a un tout prêt pour toi. »
- **−2 / −1** — « Tu n'appelles plus. Bon signe, un coach qui écoute n'en est pas un. » (existant) / « Je gère, tu dis. Ils disent tous ça avant le télégramme. »
- **0** — « Peur du président, {prenom} ? Cinquante-neuf jours dans un grand club. » (existant) / « Une promesse, c'est un chèque. Tu en as signé combien ? » (existant)
- **+1 / +2** — « Une jauge pleine tue autant qu'une vide, petit. » (existant) / « Tu vas perdre dimanche, petit ; je te le dis parce que les autres t'aiment trop. »
- **+3** — « Tiens, le télégramme de soixante et onze. Je ne dirais pas que c'est mon bien le plus précieux ; je dirais qu'il est devant. » / « Lundi, huit heures. J'ai mis ta chaise devant. »

### 5.3 Rapports avec les autres
**Alliés** : Josiane (elle a son numéro, elle prévient pour l'hôpital ; elle range son enveloppe), Vecchio (deux vieux au bar : Gigi boit de l'eau, Corven regarde), Brissac (elle le fait animer le stage du diplôme parce qu'il dit la vérité aux stagiaires). **Rivaux** : Vaubourg (« le vieux ne m'a jamais rien appris », dit Vaubourg, qui a copié son discours de 1971), Vaz (« la cassette, c'est le refuge des gens qui n'ont pas de mémoire »). **Dettes** : il doit à Vukić un conseil non suivi ; Massenet lui doit son premier article. **Il aime** : Camille, qu'il appelle « la seule qui a compris que tu ne rentrerais pas ».

### 5.4 INTRIGUE co.clow_lundi  —  Lundi, huit heures
**Logline** : Dan Corven t'apprend le métier avant que tu l'aies, te dit que tu vas perdre quand tout le monde t'aime, et laisse un télégramme ou rien. · **Synopsis** : Joueur en fin de contrat, tu passes le diplôme chez lui : lundi, huit heures. Au bar, trois verres racontent trois versions des cinquante-neuf jours. Sélectionneur, il est le seul à te dire que tu vas perdre. À +3 il te donne le télégramme de 1971. Après sa mort, son fils est sur le banc d'en face : il te serre la main ou non, selon ce que tu as fait au père. À l'enterrement, tu es au premier rang ou derrière un pilier.
**Rôle(s)** : joueur, entraineur, selectionneur, ds · **Postulat(s)** : partagé (fin_de_contrat, interimaire, promu, apres_fiasco, coach_intouchable) · **Porteur** : clow · **Cast** : clow, josiane, brissac, le fils de Corven (voix), vecchio · **Thème** : presse (le mentor est un chapitre de presse : ce qu'on dit et ce qu'on tait)
**Saisons** : "0" (lundi : joueur seulement), "1" (trois_verres), "2+" (tu_vas_perdre, telegramme, fils, enterrement) · **Conditions d'entrée** : `chars.clow.statut != 'mort'` pour 1-4 ; `== 'mort'` pour 5-6 · **Exclusions** : `en.mentor_clow` la même saison (les deux se partagent Corven : celle-là est l'arc des trois conseils, celle-ci la vie d'après) · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `stage` → `clow_stage` (« {annee} : {prenom} {nom} a passé le diplôme chez Dan Corven. Lundi, huit heures ; il était là à sept. ») → lue par 10 (`jp.diplome_joueur`), 11 (`en.diplome` : le stage), 30 (Carrefour « tu as le papier »), 02 (Brissac : « le stage Corven ») · `telegramme` → `telegramme_clow` (objet héritable ; « {annee} : Dan Corven a donné son télégramme de 1974 à {prenom} {nom}. Cinquante-neuf jours, plié en quatre. ») → lue par 90 (lignée : objet), 30 (`en_sms` plus : « le télégramme était dans la poche »), 31 · `fils_refus` → `fils_clow_refus` (« {annee} : le fils de Corven a refusé de serrer la main de {nom}. Il portait la doudoune du père. ») → lue par 90 (Nemesis de lignée), 12 (il refuse ton club), 20 (« LE FILS N'A PAS SERRÉ LA MAIN »)
**Séquencier** : lundi (joueur, S0, [6,14], `age >= 30`) → trois_verres (S1+, [4,12], `relation.clow >= 0`) → tu_vas_perdre (sélectionneur, veille de Grand Match) → telegramme (= palier +3, cité) → fils (S2+, `(chars.clow.statut == 'mort' || (chars.clow.statut == 'parti' && flag('clow_mort'))) && year >= 2005`, semaine d'un match contre son club) → enterrement (la saison de la mort, [1,4]) ; lit `clow_ingrat` (existant, 11) à fils et enterrement.
**Épilogue** : rien (Corven suit l'entraîneur).

### SCÈNE jp.clow.lundi  —  Lundi, huit heures
**Rôle** : joueur · **Intrigue** : co.clow_lundi · **Étape** : 1/6 · **Moment** : saison 0, [6,14] · **Lieu** : le bar en face du stade, un formulaire de la Fédération sur le comptoir · **Conditions** : `age >= 30 && !flag('diplome')`
**CORVEN** *(le mentor — neutre — il pousse le formulaire avec le fond de son verre)*
« Le diplôme, c'est trois mois chez moi, et je ne dirais pas que j'étais un grand formateur ; je dirais que j'étais devant. Lundi, huit heures, petit ; le club, tu lui dis après. »
← **Lundi, huit heures** — effets : direction −, vestiaire +, relation.clow +1, set: clow_stage, outcome: stage — *Tu es là à sept heures et demie. Il est là depuis sept. Il a mis ta chaise devant.*
→ **Après ma carrière, Dan** — effets : tribunes +, relation.clow −1 — *Il replie le formulaire. « Après », dit-il, « c'est le mot des gens qui finissent consultants. »*
**Traces** : clow_stage · **Réactions déclenchées** : co.re.vukic_lundi (§ 5.8) · **Lu plus tard par** : 10 (`jp.diplome_joueur` : variante « tu es déjà chez Corven »), 30 (Carrefour : « tu as le papier, et le tabouret »), 02 (Brissac)

### SCÈNE co.clow.trois_verres  —  Trois verres
**Rôle** : entraineur, joueur, ds · **Intrigue** : co.clow_lundi · **Étape** : 2/6 · **Moment** : saison 1+, [4,12] · **Lieu** : le bar, tard, trois verres pleins alignés devant lui, aucun bu · **Conditions** : `relation.clow >= 0 && chars.clow.statut != 'mort'`
**CORVEN** *(le mentor — sourire — il désigne les verres l'un après l'autre)*
« Premier verre : viré parce que j'avais raison ; deuxième : j'avais tort ; troisième : par télégramme, le vrai. Je ne dirais pas que j'ai tout dit. Je dirais que j'étais devant les menteurs. »
← **Je bois le troisième** — effets : relation.clow +1, vestiaire +, direction −, set: clow_trois_verres — *Vous buvez le troisième. Il ne le finit pas ; il ne finit jamais ceux-là. Tu rentres à pied.*
→ **Je ne bois pas, Dan** — effets : relation.clow +1, force +1 — *« Bien », dit-il. Il fait porter les trois verres à la table d'à côté. Gigi y boit de l'eau.*
**Traces** : clow_trois_verres (`journal:` poids 2 : « {annee} : trois verres avec Dan Corven. Le troisième était le vrai. ») · **Réactions déclenchées** : — · **Lu plus tard par** : co.clow.faveur_telegramme (variante « tu connais le troisième verre »), 31 (Almanach du Ballon, entrée « Corven »)

### SCÈNE sl.clow.tu_vas_perdre  —  Tu vas perdre
**Rôle** : selectionneur · **Intrigue** : co.clow_lundi · **Étape** : 3/6 · **Moment** : la veille d'un Grand Match de tournoi · **Lieu** : le hall de l'hôtel des Cobalts, il n'est pas accrédité, il est là quand même · **Conditions** : `chars.clow.statut != 'mort' && gauges.tribunes >= 60`
**CORVEN** *(le mentor — sourire — la doudoune verte au milieu des costumes)*
« Le pays t'aime, et c'est pour ça que tu perds demain : personne n'ose te dire que ton six ne court plus. Je ne dirais pas que j'étais un grand. Je dirais que j'étais devant les perdants. »
← **Le six sort, merci** — effets : force +2, vestiaire −, relation.clow +1, relation.fauvel −1 — *Le six sort. Il ne pardonne pas. Tu gagnes, ou tu perds avec un autre six ; Corven est déjà reparti.*
→ **Le pays a raison** — effets : tribunes +, force −2, relation.clow −1, set: clow_pas_ecoute — *Le six joue. Tu vois à la vingtième qu'il ne court plus. Corven regarde depuis un bar, à trois rues.*
**Traces** : clow_pas_ecoute (« {annee} : Dan Corven avait dit que le six ne courait plus. Le sélectionneur a écouté le pays. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 14 (chaîne Tournoi : temps fort « le six »), 20 (« LE VIEUX AVAIT DIT »)

### SCÈNE en.clow.fils  —  Le fils de Corven
**Rôle** : entraineur, ds · **Intrigue** : co.clow_lundi · **Étape** : 5/6 · **Moment** : saison 2+, semaine d'un match contre le club du fils · **Lieu** : le rond central, avant l'échauffement · **Conditions** : `(chars.clow.statut == 'mort' || (chars.clow.statut == 'parti' && flag('clow_mort'))) && year >= 2005` ; variante `_ingrat` si `flag('clow_ingrat')`
**LE FILS DE CORVEN** *(entraîneur adverse, voix sans portrait — neutre — la doudoune verte du père, trop grande)*
« Mon père disait que vous écoutiez, ou pas, je ne sais plus. Je ne dirais pas qu'il était un grand. Je dirais qu'il est devant ceux qui sont morts avec votre nom dans la bouche. »
← **Il m'a tout appris** — effets : tribunes +, relation.clow +1 (posthume : la mémoire du buste), set: fils_clow_main — *Il vous serre la main. Il a le chewing-gum du père. Il perd le match ; il ne vous en veut pas.*
→ **On s'est perdus de vue** — effets : direction +, set: fils_clow_refus, outcome: fils_refus — *Il retire la main avant que vous la preniez. La doudoune verte tourne le dos. Massenet a vu.*
*(Variante `_ingrat` : la main n'est pas tendue ; un seul bouton, « Je comprends », `set: fils_clow_refus`.)*
**Traces** : fils_clow_main, fils_clow_refus · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (Nemesis de lignée ; « le fils de Corven » refuse la lignée si refus), 12 (il ne travaille pas pour ton club), 20 (« LE FILS N'A PAS SERRÉ LA MAIN »)

### SCÈNE co.clow.enterrement  —  Derrière un pilier
**Rôle** : tous · **Intrigue** : co.clow_lundi · **Étape** : 6/6 · **Moment** : la saison de la mort, [1,4] (drame sobre, une seule sortie) · **Lieu** : une église de village, une doudoune verte sur le cercueil · **Conditions** : `chars.clow.statut == 'mort' || (chars.clow.statut == 'parti' && flag('clow_mort'))` ; si `flag('clow_ingrat')`, la carte existante `en.clow.testament_ingrat` a déjà dit que le fils ne voulait pas de toi : variante `_pilier`
**MADAME JOSIANE** *(secrétaire — neutre — elle t'a gardé une place, au bord)*
« Ils ont mis la doudoune sur le cercueil et un verre d'eau plein à côté, à ras bord. J'en ai vu passer, vous savez ; lui, il disait qu'il était devant. »
← **Je m'assois** — effets : — — *Tu t'assois. Le fils lit le télégramme de 1971 à voix haute. Personne ne rit ; c'est pourtant drôle.*
→ **Je m'assois** — effets : — — *Tu t'assois. Le fils lit le télégramme de 1971 à voix haute. Personne ne rit ; c'est pourtant drôle.*
*(Variante `_pilier`, si `clow_ingrat` : « Je reste derrière le pilier » ; le fils te voit ; il ne dit rien ; `set: fils_clow_refus`.)*
**Traces** : — (`journal:` poids 3 : « {annee} : enterrement de Dan Corven. Un verre d'eau plein sur le cercueil. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 31 (l'épitaphe d'enterrement, ligne des 41), 90 (Panthéon : le buste)

### 5.5 Les paliers
### SCÈNE co.clow.trahison_devant  —  Devant la sortie
**Rôle** : entraineur, joueur, selectionneur · **Intrigue** : palier −3 · **Étape** : on_relation −3 · **Moment** : programmé en [1,3] · **Lieu** : la radio, ou le plateau de Télé-Stade, un verre à côté du micro · **Conditions** : `relation.clow <= -3`, une fois par carrière
**CORVEN** *(le mentor — noir — il parle à Massenet, pas à toi ; tu écoutes)*
« Je ne dirais pas que c'était le pire de mes élèves. Je dirais qu'il était devant, du mauvais côté. Il n'appelait plus, coach, alors je parle à ceux qui m'appellent. »
← **J'éteins la radio** — effets : tribunes −−, direction −, set: clow_a_parle — *Tu éteins. Massenet a enregistré. Le vestiaire a écouté en direct, dans le bus.*
→ **J'éteins la radio** — effets : tribunes −−, direction −, set: clow_a_parle — *Tu éteins. Massenet a enregistré. Le vestiaire a écouté en direct, dans le bus.*
**Traces** : clow_a_parle (« {annee} : Dan Corven a parlé de {nom} à la radio. Top un, du bas. ») · **Lu plus tard par** : 11 (`en.dossier_meneche` variante), 20 (« LE MENTOR LÂCHE SON ÉLÈVE »), 30 (`en_sms` plus)

### SCÈNE co.clow.faveur_telegramme  —  Le télégramme
**Rôle** : entraineur, joueur, selectionneur · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : le bar, le télégramme de 1971 plié en quatre, jauni, sur le comptoir · **Conditions** : `relation.clow >= 3`, une fois par carrière
**CORVEN** *(le mentor — sourire — il ne le pousse pas ; il attend que tu le prennes)*
« Cinquante-neuf jours, un télégramme, et je l'ai gardé cinquante-neuf ans presque. Je ne dirais pas que c'est mon bien le plus précieux, petit ; je dirais qu'il est devant : prends-le. »
← **Je le prends** — effets : direction +, vestiaire +, relation.clow +1, set: telegramme_clow, outcome: telegramme — *Tu le prends. Il tient dans une poche de survêtement ; il y restera, quel que soit le survêtement.*
→ **Garde-le, il est à toi** — effets : relation.clow +1, tribunes + — *Il le replie. Il le donnera à Josiane pour l'enveloppe ; tu le retrouveras au testament, s'il y en a un.*
*(Variante si `flag('clow_trois_verres')` : « Tu connais le troisième verre. Voilà le papier qui va avec. »)*
**Traces** : telegramme_clow (objet héritable) · **Lu plus tard par** : 90 (lignée : objet ; « Trois générations » : le télégramme), 30 (`en_sms` plus : « le télégramme était dans la poche ; la faute était dans le SMS »), 31

### 5.6 Les retrouvailles
### SCÈNE co.retrouvailles.clow_sourire  —  Le tabouret
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les deux meilleures relations, `chars.clow.statut != 'mort'` · **Lieu** : le bar en face du nouveau stade, un tabouret de plus
**CORVEN** *(le mentor — sourire — un tabouret de plus au bar d'en face du nouveau stade)*
« J'ai un tabouret ici aussi, petit ; j'en ai dans trois villes, et tu m'en dois une quatrième. Je ne dirais pas que je t'ai suivi. Je dirais que j'étais devant, à savoir où tu allais. »
**OK** **La tournée est pour moi** — effets : relation.clow +1, direction − — *Il commande de l'eau. Il ne te le dit pas ; tu le vois.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.clow_noir  —  Le message
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les pires relations, `chars.clow.statut != 'mort'` · **Lieu** : le bar en face du nouveau stade, le verre vide
**CORVEN** *(le mentor — noir — le verre vide, pour une fois)*
« Tu as changé de club, et tu n'as pas changé de répondeur, coach. Je ne dirais pas que j'ai appelé. Je dirais que j'étais devant ceux qui n'ont pas rappelé non plus. »
**OK** **Je te rappelle, Dan** — effets : relation.clow +1, vestiaire + — *Tu rappelles. Il décroche à la première sonnerie. Il attendait.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.clow_fantome  —  Le buste
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : une fois par carrière, à la Passation qui suit sa mort · **Conditions** : `(chars.clow.statut == 'mort' || (chars.clow.statut == 'parti' && flag('clow_mort'))) && relation.clow != 0` · **Lieu** : le Panthéon, devant le buste
**LE BUSTE DE CORVEN** *(Panthéon — neutre — la voix vient de ta mémoire, pas du bronze)*
« On meurt aussi d'être trop aimé, petit ; je te l'ai dit en quatre-vingt-dix et tu as fait semblant de noter. Je ne dirais pas que je suis mort. Je dirais que je suis devant les absents. »
← **Je note, cette fois** — effets : tribunes −, direction − (ajustement vers le milieu), vestiaire + — *Tu regardes le bronze. Il ne cligne pas ; toi si.*
→ **Tais-toi, Dan** — effets : tribunes +, relation.clow −1 (posthume) — *Le bronze se tait. La tribune chante ton nom, un peu trop fort.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### 5.7 Anecdotes
- **01.clow_telegramme** — objet (héritable) · `co.clow.faveur_telegramme`, enterrement · Le télégramme de 1971 : « SERVICES PLUS REQUIS STOP MERCI STOP » ; il compte les mots quand il n'arrive pas à dormir : sept.
- **01.clow_verre** — légende · `en.clow.verre`, hôpital · Le verre est toujours plein à ras bord et jamais fini ; à l'hôpital, c'est un verre d'eau, et il est plein aussi.
- **01.clow_voiture** — décor · brèves · Il ne conduit plus depuis 1988 ; il prend le car des supporters, au fond, et personne ne le reconnaît sauf Gégé.
- **01.clow_repas** — décor · `co.clow.trois_verres` · Il mange des cacahuètes de bar et des œufs durs ; « le régime de ceux qui sont devant ».
- **01.clow_chewing_gum** — détail de portrait · toute scène · Il ne mâche que sur le banc et au bar ; à l'hôpital, la boule est sur la table de nuit, dans son papier.

### 5.8 Réaction propre
### RÉACTION co.re.vukic_lundi  —  Sept heures, pas huit
**Après** : jp.clow.lundi (← lundi) · **Famille** : tiers qui commente · **Conditions** : `relation.vukic >= 0`
**VUKIĆ** *(entraîneur adjoint — neutre — il a vu la chaise devant)*
« Corven a dit huit heures et il t'attendra à sept ; je te le dis parce que personne ne te le dira. Il m'a fait le coup en quatre-vingt-un. »
**Un bouton** : **Sept heures, alors** — effets : relation.clow +1, force +1 — *Tu es là à sept. Il est là depuis six et demie. Il ne le dit pas.*

### SCÈNE en.clow.stage  —  Le stage Corven (complément : sixième scène propre)
**Rôle** : entraineur · **Intrigue** : co.clow_lundi (hors séquencier : servie par `en.diplome` du chapitre 11, étape « le stage ») · **Moment** : saison 0-1, la semaine du stage · **Lieu** : une salle de la Fédération, douze chaises, un magnétoscope débranché · **Conditions** : `flag('derogation') && chars.clow.statut != 'mort'`
**CORVEN** *(le mentor, animateur du stage — neutre — il éteint le magnétoscope que Vaz avait laissé allumé)*
« Douze stagiaires, onze qui veulent le papier et un qui veut le banc ; je ne dirais pas que je sais lequel tu es ; je dirais que j'ai une idée, et qu'elle est devant. Le questionnaire, ou moi ? »
← **À toi, Dan** — effets : direction −, relation.clow +1, relation.brissac +1, set: clow_stage — *Deux heures de questions. Brissac écoute derrière la porte ; elle tamponne le papier le lendemain.*
→ **Au questionnaire, vite** — effets : direction +, relation.clow −1, set: diplome — *Tu rends en vingt minutes. Il note « rapide » sur ta copie. Ce n'est pas un compliment.*
**Traces** : clow_stage, diplome (∃) · **Réactions déclenchées** : — · **Lu plus tard par** : 11 (`en.diplome` étape S+1 : l'examen), 15 (Brissac : « le stage Corven »), 30 (Carrefour)

---

## 6. LIAN MBAKO  (`mbako`)
**Fonction** : prodige, 16 ans · **Genre** : m · **Âge en 1990** : 16 · **Camp** : terrain · **Fenêtre** : joueur 1990-2010 (à {club}, vendu, ou revenu), star des Cobalts 1996-2010, capitaine qui négocie les primes (2008), coach rival dès 2018, sélectionneur du Kambara 2026-2030, Fantôme ensuite ; il meurt en 2049, une statue le regarde · **Suivant** : Noa Vandel, « le prodige d'après » (né en 2004, seize ans en 2020 ; même tic, une mère qui ne négocie pas : c'est son père, le père-agent générique du chapitre 12)
**Tic** : « Je veux jouer. Maintenant. » — torsions : « Je veux jouer. Plus tard, c'est pareil que jamais. » · « Je ne veux plus jouer. Maintenant. » · « Ils veulent jouer. Maintenant. Je les comprends. »
**Désir** : jouer, partir, revenir · **Blessure** : sa mère négocie tout ; il n'a jamais rien décidé seul, sauf une fois, à +3, et il ne sait pas si c'était bien
**Adresse** : entraineur : coach / coach / monsieur · joueur : {prenom} / {prenom} / {nom} · autres : § 0.1
**Ce qu'il pense de toi** : à +2 « tu m'as lancé ; je marque contre toi sans célébrer » ; à 0 « je veux jouer, et tu décides » ; à −2 « tu m'as vendu, ou tu m'as fait attendre ; c'est pareil »
**Paliers** : −3 → `co.mbako.trahison_clause` · +3 → `co.mbako.faveur_refus_grand_club` (existant, entraîneur et joueur ; ce chapitre ajoute la variante sélectionneur `sl.mbako.faveur_hymne`)
**Dans les rôles** : entraîneur : horloge (le prodige, l'offre, le retour ; 1,5) · joueur : cœur et rival (le prodige d'après, ton poste ; 1,5) · sélectionneur : cœur (la star des Cobalts, le binational tenté par le Kambara ; 2) · président : cœur (le retour, la statue ; 1) · instance : cœur (le capitaine qui négocie les primes 2008 ; 1) · DS : le prix de référence (0,5) · Fantôme : à partir de 2030
**Trajectoire 1990 → 2050** : 1990-1999 · 16-25 ans, brosse, maillot blanc rayé ; lancé ou pas, vendu ou pas ; Cobalts en 1996, champion du monde en 2002, à six mille kilomètres · 2000-2009 · 26-35 ans ; capitaine des Cobalts 2004-2010 ; en 2008 il négocie les primes avec la Fédération ; le Kambara l'appelle une fois par an · 2010-2019 · 36-45 ans, gris à 45 (2019) ; retraite de joueur 2012 ; consultant deux saisons, entraîneur des jeunes, puis coach rival (2018, Étoile Bretagne ou {rival}) · 2020-2029 · lunettes (2029) ; sélectionneur du Kambara 2026-2030 : il bat les Cobalts une fois, il ne célèbre pas · 2030-2039 · Fantôme ; la statue devant la Marmite (si président tu l'as votée) ; il vient la regarder ; en 2036, si aucune lignée ne prend la Fédération, c'est lui qu'on élit « par défaut » (chapitre 02, table des mandats) : il veut présider, maintenant, et il préside jusqu'en 2044 · 2040-2050 · meurt en 2049 ; le prodige d'après lui succède dans l'Almanach ; « Je veux jouer. Maintenant. » est écrit sur le socle
**Retrouvailles** : `co.retrouvailles.mbako_sourire` / `_noir` / `_fantome`
**Cartes propres** : *Le sac neuf* (01) · *Il revient* (01) · *Le Kambara appelle* (01) · *Les primes* (01) · *La statue* (01) · *Le banc d'en face* (01) · *Le prodige* (existant, `en.prodige.*`) · *Le prodige d'après* (10, `co.mbako_rival`) · *Le retour de Mbako* (11, `en.retour_mbako`) · *Le penalty, la place* (existants, `jp.vestiaire.penalty_prodige`, `jp.vestiaire.jeune_pousse`)

### 6.1 Identité et place
Lian Mbako ; « le petit » jusqu'à trente ans, « Mbako » après, « papy » jamais (c'est lui qui le dit aux autres). 16 ans en 1990, 26 en 2000, 36 en 2010, 46 en 2020, 56 en 2030, 66 en 2040, 75 à sa mort. **Portrait** : la brosse droite de 1990 qui devient rasée en 2000 et blanche en 2030, le maillot blanc rayé vert trop grand puis trop petit, les mains dans les manches quand il attend une décision. **Voix** : brève, aiguë à seize ans, grave à trente, sans accent de nulle part ; il dit « maintenant » comme d'autres disent « s'il vous plaît ». Au club, il est la seule richesse : Vukić l'annonce, sa mère le négocie, Fardelli tourne, le président vend. Il ne dit jamais bonjour ; il dit « je veux jouer ».

**Désir / besoin / blessure / secret.** Désir : jouer, tout de suite ; partir, tout de suite ; revenir, tout de suite. Besoin : décider une fois. Blessure : sa mère a écrit la clause. Secret : il a gardé le numéro du grand club qu'il a refusé à +3, dans une chaussette ; il l'a appelé une fois, la nuit, et a raccroché avant qu'on décroche.

### 6.2 Les cinq registres
- **−3** — « La clause a joué, monsieur. Je l'ai dit à Léa : c'était votre choix, pas le mien. » / « Je veux jouer. Maintenant. Contre vous. »
- **−2 / −1** — « Je veux jouer. Maintenant. Sinon ma mère a le numéro d'un club. » (existant) / « Vous avez dit « ton tour ». J'attends. Mal. » (existant)
- **0** — « Le coach dit que je prends ta place dimanche. Sans rancune, hein, papy ? » (existant) / « Je veux jouer, coach. Maintenant, ou je demande où. »
- **+1 / +2** — « Je veux jouer. Maintenant. Ici, avec vous. » (existant) / « J'ai marqué contre toi et je n'ai pas célébré, {prenom}. Tu as vu ? »
- **+3** — « Le grand club a appelé ce matin ; j'ai dit non. » (existant) / « Je chante l'hymne, coach. Le vôtre. Maintenant. »

### 6.3 Rapports avec les autres
**Alliés** : Vukić (qui l'a vu marcher sur l'eau), Vecchio (« papy » pour rire ; Gigi lui apprend à sortir dans les pieds), Rouvier (elle lui masse le genou et lui dit que le Doc exagère). **Rivaux** : Dembo (le prodige d'avant : « on m'a vendu à dix-sept ans, toi à seize ; tu as un an de plus à digérer »), Fauvel (le brassard des Cobalts), Bréhaut (le vote). **Dettes** : il doit à sa mère tout ; il doit au coach qui l'a lancé une non-célébration, à vie ; Fardelli lui doit dix pour cent de regrets. **Il craint** : Léa, qui lui demande s'il confirme.

### 6.4 INTRIGUE co.mbako_horloge  —  L'horloge Mbako
**Logline** : Lian Mbako a seize ans en 1990 et soixante en 2034 ; à chaque rôle que tu occupes, il a l'âge qu'il faut pour te demander de jouer, maintenant. · **Synopsis** : Joueur, il te demande comment on dit non à sa mère. Entraîneur, deux ans après l'avoir vendu, il veut revenir pour moins cher. Sélectionneur, le Kambara l'appelle et il te regarde décider. Instance, il négocie les primes des Cobalts avec toi. Président, sa mère choisit le bronze de sa statue. Entraîneur encore, il est sur le banc d'en face et ne célèbre pas.
**Rôle(s)** : joueur, entraineur, selectionneur, instance, president · **Postulat(s)** : partagé · **Porteur** : mbako · **Cast** : mbako, mere_mbako, vukic, fauvel, lea, gege · **Thème** : mercato
**Saisons** : "0" (sac_neuf : joueur), "2+" (revient), rôles : kambara (sélectionneur 1996-2010), primes (instance 2008-2010), statue (président 2012+), banc_en_face (entraîneur 2018+) · **Conditions d'entrée** : selon l'étape ; lit `mbako_vendu`, `mbako_lance`, `mbako_garde` (11) · **Exclusions** : `en.retour_mbako` (11) la même saison · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `kambara` → `mbako_kambara` (« {annee} : Lian Mbako a choisi le Kambara. Le sélectionneur des Cobalts l'a laissé partir / l'a retenu. ») → lue par 14 (l'appel du pays à 40 ans, le Kambara en face en 2026), 15 (les fédérations se disputent), 20 (« IL A CHOISI L'AUTRE MAILLOT », variante Mbako) · `statue` → `mbako_statue` (« {annee} : une statue de Lian Mbako devant le stade. Sa mère a choisi le bronze, et le socle. ») → lue par 13 (« la statue » : Gégé la nettoie ou la salit), 90 (mémoire des clubs +1), 30 (`pr_fonds` plus) · `revenu` → `mbako_revenu` (« {annee} : Lian Mbako est revenu à {club}, pour moins cher. Il voulait jouer, maintenant. ») → lue par 11 (`en.retour_mbako` : exclusion), 20, 30 (`en_decoupe` plus inversée)
**Séquencier** : sac_neuf (joueur, S0, [4,12]) → revient (entraîneur, S2+, `flag('mbako_vendu') && chars.mbako.age <= 28`, [2,10]) → kambara (sélectionneur, fenêtre de septembre, `year in 1996..2010`) → primes (instance, dossier de l'année, `year in 2008..2010`) → statue (président, S1+, `chars.mbako.statut == 'retraite'`) → banc_en_face (entraîneur, `year >= 2018`, semaine du match) ; lecture croisée : revient lit `genou_petit_dit` (§ 3), kambara lit `binational_choisi` (10).
**Épilogue** : rien : Mbako suit le monde, pas le club.

### SCÈNE jp.mbako.sac_neuf  —  Le sac neuf
**Rôle** : joueur · **Intrigue** : co.mbako_horloge · **Étape** : 1/6 · **Moment** : saison 0, [4,12] · **Lieu** : le vestiaire vide, un sac neuf, étiquette encore dessus · **Conditions** : `chars.mbako.statut == 'club' && age >= 22`
**MBAKO** *(prodige, 16 ans — neutre — il ne te regarde pas, il regarde le sac)*
« Ma mère a signé pour un club que je n'ai pas vu, et le sac est arrivé ce matin. Je veux jouer. Maintenant, mais comment on lui dit non, à elle ? »
← **On la remercie, pas non** — effets : vestiaire +, relation.mbako +1, relation.mere_mbako +1, set: mbako_conseil_mere — *Il enlève l'étiquette. Il part. Il t'envoie une carte du club neuf, sans texte, juste sa signature.*
→ **Tu lui dis « je décide »** — effets : vestiaire +, relation.mbako +2, relation.mere_mbako −1, set: mbako_decide — *Il le lui dit. Elle raccroche au club. Il reste six mois de plus ; il ne sait pas si c'était bien.*
**Traces** : mbako_conseil_mere, mbako_decide (« {annee} : Lian Mbako a dit « je décide » à sa mère. C'est {prenom} {nom} qui lui avait soufflé. ») · **Réactions déclenchées** : co.re.mere_mbako_souffle (§ 8.8) · **Lu plus tard par** : 10 (`co.mbako_rival` issue mentor), § 8 (mère : `co.mere.dix_neuf_ans` variante), 14 (kambara : « tu m'as appris à décider »)

### SCÈNE en.mbako.revient  —  Il revient
**Rôle** : entraineur · **Intrigue** : co.mbako_horloge · **Étape** : 2/6 · **Moment** : saison 2+, [2,10] · **Lieu** : ton bureau, il a fait le voyage seul, sans sa mère · **Conditions** : `flag('mbako_vendu') && chars.mbako.age <= 28 && chars.mbako.statut == 'vendu'` (`statut_ok: [vendu]`)
**MBAKO** *(joueur du grand club — neutre ou sourire — le sac du grand club, usé)*
« Là-bas je joue vingt minutes par mois et le stade ne sait pas mon nom. Je veux jouer. Maintenant, chez vous, pour moins, et ma mère n'est pas au courant. »
← **Reviens, pour moins** — effets : vestiaire ++, tribunes ++, caisse −, relation.mbako +2, set: mbako_revenu, char: {mbako: {statut: club}}, outcome: revenu — *Il revient. Gégé repeint la bâche : « JUDAS » devient « PARDON », en doré, quand même.*
→ **Ta mère d'abord, Lian** — effets : direction +, relation.mbako −1, relation.mere_mbako +1 — *Il appelle sa mère depuis ton bureau. Elle dit non. Il repart avec le sac usé.*
**Traces** : mbako_revenu · **Réactions déclenchées** : co.re.gege_pardon (§ 9.8) · **Lu plus tard par** : 11 (`en.retour_mbako` : exclusion), 20 (« LE FILS PRODIGUE À {VILLE} »), 13 (la statue : « il était revenu »)

### SCÈNE sl.mbako.kambara  —  Le Kambara appelle
**Rôle** : selectionneur · **Intrigue** : co.mbako_horloge · **Étape** : 3/6 · **Moment** : fenêtre de septembre, la Liste · **Lieu** : le couloir de la Fédération, son téléphone vibre dans sa poche · **Conditions** : `year >= 1996 && year <= 2010 && chars.mbako.statut != 'retraite'`
**MBAKO** *(star des Cobalts — neutre — il te montre l'écran : « KAMBARA », en capitales)*
« Le pays de mes parents m'appelle chaque septembre, et cette fois ils ont un Mondial à jouer. Je veux jouer. Maintenant ; vous me mettez dans la liste, ou je réponds ? »
← **Dans la liste, titulaire** — effets : tribunes +, vestiaire −, relation.mbako +1, relation.fauvel −1, set: mbako_cobalts — *Il ne répond pas. Le téléphone vibre jusqu'en novembre. Il marque en bleu cobalt ; sa mère regarde l'autre match.*
→ **Réponds, c'est ton pays** — effets : tribunes −−, relation.mbako +2, set: mbako_kambara, outcome: kambara — *Il répond. Il joue pour le Kambara en novembre. Vence te demande en direct si vous confirmez ; tu confirmes.*
**Traces** : mbako_cobalts, mbako_kambara · **Réactions déclenchées** : co.re.mere_mbako_kambara (§ 8.8) · **Lu plus tard par** : 14 (le Kambara en face en 2026 : Mbako sélectionneur), 15 (les fédérations), 20 (« IL A CHOISI L'AUTRE MAILLOT »), 10 (`binational` : « Mbako l'a fait avant toi »)

### SCÈNE in.mbako.primes  —  Les primes
**Rôle** : instance · **Intrigue** : co.mbako_horloge · **Étape** : 4/6 · **Moment** : un dossier de l'année, `year in 2008..2010` · **Lieu** : la salle du comité, il est venu en survêtement des Cobalts, exprès · **Conditions** : `chars.mbako.statut != 'retraite'`
**MBAKO** *(capitaine des Cobalts — neutre — une feuille signée par vingt-six joueurs)*
« Les primes du Mondial, vingt-six signatures, et la moitié pour une école dans le pays de ma mère. Je veux jouer. Maintenant, monsieur le président : vous signez, ou on joue en maillot blanc ? »
← **Je signe, l'école aussi** — effets : caisse −−, tribunes ++, relation.mbako +2, relation.fauvel +1, set: primes_ecole — *Tu signes. L'école ouvre en 2011 ; elle porte le nom de sa mère. Dauzat le note au procès-verbal.*
→ **Les primes, pas l'école** — effets : caisse +, tribunes −, relation.mbako −1, set: primes_seules — *Ils jouent en maillot cobalt. Le sponsor souffle. L'école n'ouvre pas ; Mbako la paie seul en 2014.*
**Traces** : primes_ecole, primes_seules (« {annee} : les Cobalts ont eu leurs primes. L'école du Kambara, non ; Lian Mbako l'a payée seul. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 15 (l'égalité des primes 2016 : « Mbako avait signé pour une école »), 14 (l'avion des primes : variante), 20 (« VINGT-SIX SIGNATURES »)

### SCÈNE pr.mbako.statue  —  La statue
**Rôle** : president · **Intrigue** : co.mbako_horloge · **Étape** : 5/6 · **Moment** : saison 1+, [6,14] · **Lieu** : le parvis du stade, une bâche sur quelque chose de haut · **Conditions** : `chars.mbako.statut == 'retraite' && (flag('mbako_lance') || flag('mbako_revenu'))`
**MBAKO** *(ancien joueur, 46 ans — sourire — sa mère à trois pas, carnet fermé)*
« Le conseil veut une statue de moi et ma mère a choisi le bronze, le socle et la phrase. Je veux jouer. Maintenant ; c'est ce qu'ils ont gravé, et je ne sais pas si je le voulais encore. »
← **On la dévoile samedi** — effets : tribunes ++, caisse −−, relation.mbako +1, relation.mere_mbako +1, set: mbako_statue, outcome: statue — *La bâche tombe. Gégé nettoie le socle chaque dimanche ; quand tu vends un joueur, il le salit.*
→ **Un banc plutôt qu'une statue** — effets : caisse +, tribunes +, relation.mbako +1, relation.mere_mbako −2, set: mbako_banc — *Un banc derrière le but, à côté de celui de Gigi. Sa mère ne vient pas à l'inauguration ; lui, si.*
**Traces** : mbako_statue, mbako_banc (« {annee} : un banc pour Lian Mbako, pas une statue. Sa mère avait déjà choisi le bronze. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 13 (Gégé et le socle), 90 (mémoire des clubs), 30 (`en_retraite` plus : « le banc de Mbako, celui de Gigi, le tien »)

### SCÈNE en.mbako.banc_en_face  —  Le banc d'en face
**Rôle** : entraineur · **Intrigue** : co.mbako_horloge · **Étape** : 6/6 · **Moment** : saison 2+, semaine d'un match contre son club, `year >= 2018` · **Lieu** : le tunnel, il porte un costume, pas un survêtement · **Conditions** : `chars.mbako.statut == 'rival'` ; variante `_lance` si `flag('mbako_lance')`, `_vendu` si `flag('mbako_vendu')`
**MBAKO** *(entraîneur adverse — sourire ou noir selon la relation — les mains dans les manches du costume)*
« Coach d'en face à quarante-quatre ans, et mes joueurs veulent jouer, maintenant, comme moi à seize. Si on gagne, je ne célèbre pas ; c'est ma seule promesse à votre lignée. »
← **Célèbre, tu as le droit** — effets : tribunes +, relation.mbako +1, set: mbako_celebre — *Il gagne. Il ne célèbre pas ; il t'avait promis. Ses joueurs, si.*
→ **Perds, et on en reparle** — effets : force +1, vestiaire +, relation.mbako −1 — *Tu gagnes. Il te serre la main dans le tunnel, mains hors des manches, pour une fois.*
**Traces** : mbako_celebre (`journal:` poids 2) · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (Fantôme Mbako : « je n'ai pas célébré »), 20 (« LE PETIT NE CÉLÈBRE PAS »)

### 6.5 Les paliers
### SCÈNE co.mbako.trahison_clause  —  La clause
**Rôle** : entraineur, joueur, ds · **Intrigue** : palier −3 · **Étape** : on_relation −3 · **Moment** : programmé en [1,3] · **Lieu** : la zone mixte, Léa tend le micro, il te regarde · **Conditions** : `relation.mbako <= -3`, une fois par carrière
**MBAKO** *(prodige — noir — il parle à Léa, fort, pour toi)*
« La clause a joué et je signe demain chez {rival} ; ma mère l'avait écrite, et monsieur l'avait lue. Je veux jouer. Maintenant, ailleurs. »
← **Je ne commente pas** — effets : tribunes −−−, vestiaire −, set: mbako_vendu, char: {mbako: {statut: rival}}, var: {no_comment: "+1"} — *Léa écrit « ne commente pas ». Le lendemain, le titre est sur le coupable avant le fait.*
→ **Je ne commente pas** — effets : tribunes −−−, vestiaire −, set: mbako_vendu, char: {mbako: {statut: rival}}, var: {no_comment: "+1"} — *Léa écrit « ne commente pas ». Le lendemain, le titre est sur le coupable avant le fait.*
**Traces** : mbako_vendu (∃) · **Lu plus tard par** : 11 (`en.prodige.marque_contre_toi` variante), 20 (« TRENTE MILLIONS ET UN GAMIN »), 30 (`en_decoupe` plus), 90 (Nemesis Mbako)

### SCÈNE sl.mbako.faveur_hymne  —  L'hymne (variante sélectionneur du +3)
**Rôle** : selectionneur · **Intrigue** : palier +3 (variante de `co.mbako.faveur_refus_grand_club` pour le rôle sélection) · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : le tunnel du Grand Stade, avant l'hymne, `year >= 1996` · **Conditions** : `relation.mbako >= 3`, une fois par carrière
**MBAKO** *(star des Cobalts — sourire — la main sur le cœur avant que la musique commence)*
« Le Kambara a appelé ce matin et j'ai dit non, sans ma mère, sans vous. Je veux jouer. Maintenant, et je chante l'hymne ; regardez. »
← **Je le regarde chanter** — effets : tribunes +++, vestiaire +, set: mbako_cobalts, set: hymne_chante — *Il chante faux. Le stade chante avec lui. Vence, en direct, ne trouve rien à dire ; c'est rare.*
→ **Pas besoin de chanter** — effets : vestiaire ++, relation.mbako +1, relation.fauvel +1 — *Il ne chante pas. Fauvel chante pour deux. Le stade ne fait pas la différence ; toi, si.*
**Traces** : mbako_cobalts, hymne_chante (« {annee} : Lian Mbako a chanté l'hymne, faux, en entier. Le Kambara avait appelé le matin. ») · **Lu plus tard par** : 14 (`hymne_impose` : variante « Mbako a chanté de lui-même »), 20 (« IL A CHANTÉ »)

### 6.6 Les retrouvailles
### SCÈNE co.retrouvailles.mbako_sourire  —  Sans célébrer
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les deux meilleures relations · **Lieu** : le bord du terrain, ta première séance, il est venu en spectateur
**MBAKO** *(sa fonction du moment — sourire — il est venu à ta première séance, en spectateur)*
« Vous m'avez lancé, ou dit pour le genou, ou laissé décider, je ne sais plus lequel ; je m'en souviens de tous. Je veux jouer. Maintenant, {prenom}, même à mon âge : une séance ? »
**OK** **Une séance, en tenue** — effets : vestiaire ++, relation.mbako +1 — *Il joue quarante minutes. Le vestiaire comprend qui tu es.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.mbako_noir  —  Trente millions
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les pires relations · **Lieu** : le tunnel, avant un match contre son club
**MBAKO** *(sa fonction du moment — noir — il ne te tend pas la main, il tend un chiffre)*
« Trente millions, monsieur, c'est ce que je valais quand vous avez signé ; je vaux plus, et vous moins. Je veux jouer. Maintenant, contre vous, de préférence. »
**OK** **Seize ans, et j'ai signé** — effets : relation.mbako +1, tribunes − — *Il hoche la tête. Il ne pardonne pas ; il note que tu n'as pas nié.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.mbako_fantome  —  Le socle
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : une fois, après 2030, à une Passation · **Conditions** : `flag('mbako_statue') || flag('mbako_banc')` · **Lieu** : le parvis du stade, le banc ou le socle
**MBAKO** *(Fantôme, 60 ans et plus — neutre — assis sur le banc ou au pied du socle, un sac neuf sur les genoux)*
« Ils ont gravé « Je veux jouer. Maintenant » et les gamins le lisent en passant ; ils rient, puis ils courent. Je ne sais toujours pas si je le voulais ; vous, vous vouliez quoi ? »
← **Que tu joues, c'est tout** — effets : tribunes +, relation.mbako +1 — *Il sourit. Il enlève l'étiquette d'un sac qui n'en a plus depuis quarante ans.*
→ **Trente millions, à l'époque** — effets : caisse +, relation.mbako −1 — *Il rit. Vraiment. C'est la première fois que tu l'entends rire ; c'est un rire de vieil homme.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### 6.7 Anecdotes
- **01.mbako_chaussette** — objet · `co.mbako.faveur_refus_grand_club` (existant), retrouvailles · Le numéro du grand club refusé est dans une chaussette, dans le sac ; le sac change, la chaussette non.
- **01.mbako_voiture** — décor · brèves · À dix-huit ans une voiture de sport rouge que sa mère lui interdit de conduire ; il la conduit la nuit, à vingt à l'heure, autour du stade.
- **01.mbako_superstition** — légende · set-piece `gm_annonce` · Il entre en dernier et touche la pelouse de la main droite ; à 44 ans, coach, il le fait encore, en costume.
- **01.mbako_repas** — décor · `en.vestiaire.bizutage_chant` (existant) · La berceuse qu'il chante au bizutage est celle de sa mère ; il la chantera à Sacha si les deux familles se croisent (90).
- **01.mbako_socle** — objet · `pr.mbako.statue` · Le socle porte la phrase, la date de naissance, et une faute d'accent sur « Maintenant » que la mère a exigée : « c'est comme ça qu'il le disait ».

---

## 7. GIGI VECCHIO  (`vecchio`)
**Fonction** : gardien, 41 ans · **Genre** : m · **Âge en 1990** : 41 · **Camp** : terrain · **Fenêtre** : joueur 1990-1995 (cinq retraites), **puis l'une des deux vies, jamais les deux** : avec `gigi_staff`, entraîneur des gardiens 1995-2010 et buvette des anciens dès 2010 ; sans `gigi_staff`, gardien de Trébignac à cinquante ans (1999-2001, amateur) et buvette des anciens dès 2002 ; meurt en 2031, minute de silence, l'arbitre ajoute une minute · **Suivant** : Bastien Lorrain, « le jeune » gardien (né 1971 ; il prend les gants en 1991 ou en 1995 selon `gardien_jeune` ; il en aura vu d'autres à son tour en 2012)
**Tic** : « J'en ai vu d'autres. » — torsions : « J'en ai vu d'autres. Pas celle-là. » (existant) · « J'en ai vu d'autres, des dernières. » (existant) · « Celle-là, je la vois. » (existant)
**Désir** : une saison de plus · **Blessure** : il a quarante et un ans et personne ne le lui a dit autrement qu'en riant ; Barbier l'a raté à dix-sept ans, sous la pluie, à Néville, en 1966
**Adresse** : entraineur : coach sur les trois visages (c'est le personnage) · joueur : petit / petit / {prenom} · autres : § 0.1
**Ce qu'il pense de toi** : à +2 « je descends le premier si tu montes » ; à 0 « on verra en juin, comme chaque juin » ; à −2 « je signe chez {rival}, ils m'ont demandé, eux »
**Paliers** : −3 → `co.vecchio.trahison_une_rendue` · +3 → `co.vecchio.faveur_reunion`
**Dans les rôles** : joueur : chœur et exemple (le tutoriel du corps, les chaussettes, la réunion sans le staff ; 1,5) · entraîneur : cœur (la retraite chaque juin, le bus, le staff ; 3 dans le promu) · sélectionneur : cœur (le troisième gardien qui descend le premier ; 1) · amateur : cœur (le vieux gardien de Trébignac à cinquante ans ; 1) · présidents : chœur (la buvette des anciens ; 1) · instance : voix au téléphone (0,5) · tous : la Une gardée (`co.re.vecchio_garde`)
**Trajectoire 1990 → 2050** : 1990-1999 · 41-50 ans, moustache, tempes grises, gants jaunes ; cinq retraites ; entraîneur des gardiens à 45 (1994-1995) ; il descend le premier · 2000-2009 · 50-59 ans ; deux saisons dans les buts de Trébignac (1999-2001, sans `gigi_staff` : « Capitale FC au stade municipal », il arrête un penalty) ; lunettes (2004) pour lire les Unes qu'il garde · 2010-2019 · 60-69 ans ; la buvette des anciens avec Bréhaut ; il tient le filet de 1990 dans un placard · 2020-2029 · canne (2024) ; il vient encore le samedi, derrière le but, sur le banc à son nom · 2030-2039 · meurt en 2031, un dimanche, à la 70e ; l'arbitre ajoute une minute (Colline, s'il est désignateur) · 2040-2050 · une Nouvelle datée rappelle « le gardien de quarante-deux ans, enfin, un » ; son nom est dans le Codex à côté de celui de Mamie Paulette
**Retrouvailles** : `co.retrouvailles.vecchio_sourire` / `_noir` / `_telephone`
**Cartes propres** : *Les gants prêtés* (01) · *Un brassard sur des gants* (01) · *Trébignac, cinquante ans* (01) · *Le troisième gardien* (01) · *Le filet de quatre-vingt-dix* (01) · *La minute* (01) · *Le vieux gardien* (existant, `en.vieux.*`) · *Les trois conseils de Gigi* (10, `jp.conseils_gigi`) · *Gigi au staff* (11, `en.gigi_staff`) · *Les chaussettes, la réunion, le banc* (existants, `jp.vestiaire.superstition`, `jp.vestiaire.reunion_joueurs`, `jp.vestiaire.vecchio_banc`)

### 7.1 Identité et place
Luigi Vecchio, « Gigi » depuis les cadets de Néville ; « le vieux » dans le vestiaire, « monsieur Vecchio » pour Paulette, « Zoki » pour Vukić en retour du « Gigi ». 41 ans en 1990, 51 en 2000, 61 en 2010, 71 en 2020, 81 en 2030, 82 à sa mort. **Portrait** : la moustache grise, le maillot gris à manches longues, les gants jaunes sous le bras (jamais aux mains hors du terrain), l'épaule droite plus basse que la gauche depuis 1991. **Voix** : rocailleuse, lente, du Sud ; il ne finit pas ses phrases quand elles sont tristes. Au club, il est le premier arrivé au toro, le dernier sorti du bus, la Une gardée, la chaussette pas lavée, le casier que personne ne touche. Il boit de l'eau au bar ; Corven aussi, et ils font tous les deux semblant de trouver ça normal.

**Désir / besoin / blessure / secret.** Désir : une saison de plus, chaque juin. Besoin : qu'on le lui dise sans rire. Blessure : l'essai raté à Valdorne sous la pluie n'est pas le sien (c'est celui de Dédé) : le sien, c'est Barbier qui ne l'a pas vu, à Néville, en 1966 ; il a attendu vingt-quatre ans que quelqu'un vienne en doudoune. Secret : il garde le filet du but de 1990 (la saison du promu) dans un placard de la buvette ; il le ressort pour la minute de silence, la sienne.

### 7.2 Les cinq registres
- **−3** — « Celle-là, je ne la garde plus, {prenom}. Tiens. » / « Je signe chez {rival}. Ils m'ont demandé, eux. » (existant)
- **−2 / −1** — « Me mettre au banc devant les jeunes, ça me tuerait, coach. » (existant) / « J'en ai vu d'autres, des entraîneurs. » (existant)
- **0** — « Je prends ma retraite en juin, comme chaque juin. J'en ai vu d'autres. » (existant) / « Cinq victoires avec mes chaussettes trouées. On garde le rituel ou pas ? » (existant)
- **+1 / +2** — « J'en ai vu d'autres, des Unes. Celle-là, je la garde. Pas pour moi. » (existant) / « Je descends le premier si tu montes leur parler. » (existant)
- **+3** — « Ils ont fait une réunion sans toi, coach. J'y étais. J'en ai vu d'autres ; pas celle-là. » / « Le filet de quatre-vingt-dix est dans le placard. Il est à toi le jour où tu pars. »

### 7.3 Rapports avec les autres
**Alliés** : Vukić (deux gardiens), Bréhaut (la table des anciens, la buvette), Paulette (elle l'a vu débuter ; il lui apporte une orange à la mi-temps), Mbako (« papy » et « le petit » : ils s'appellent comme ça pendant quarante ans). **Rivaux** : le jeune (Lorrain : « le jeune a déjà ses gants ; ce sont les siens »), Barbier (qui « l'a raté », et qui vient bénévole à Trébignac en 2006 pour le voir jouer, trop tard). **Dettes** : il doit à Sabatier une épaule ; Dupuis lui doit une plaque à la buvette qu'il ne mettra jamais. **Il aime** : Camille, qu'il appelle madame ; Sacha, à qui il apprend à plonger sur le côté qui ne fait pas mal.

### 7.4 INTRIGUE co.vecchio_cinq_retraites  —  Les cinq retraites de Gigi
**Logline** : Gigi Vecchio prend sa retraite chaque juin ; entre deux, il prête ses gants, porte un brassard dessus, joue à cinquante ans, descend le premier, et meurt un dimanche à la soixante-dixième. · **Synopsis** : Joueur de champ, tu reçois ses gants le jour où le gardien est blessé. Entraîneur, tu lui donnes le brassard et il le met sur les gants. Amateur, tu le retrouves dans les buts de Trébignac à cinquante ans, contre Capitale FC. Sélectionneur, il est ton troisième gardien à 44 ans, pour le vestiaire. Président, il te donne le filet de 1990. Un dimanche de 2031, la minute.
**Rôle(s)** : joueur, entraineur, joueur_amateur, president_amateur, selectionneur, president · **Postulat(s)** : partagé · **Porteur** : vecchio · **Cast** : vecchio, vukic, brehaut, paulette, sabatier, colline (voix) · **Thème** : vestiaire
**Saisons** : "0" (gants_pretes), "1" (brassard : lit `brassard_gigi` de 11), amateur 2000-2002 (trebignac), sélection 1994-1996 (troisieme), président 2010+ (filet), 2031 (minute) · **Conditions d'entrée** : `chars.vecchio.statut in [club, staff, retraite]` selon l'étape · **Exclusions** : `en.vieux_gardien` la même saison pour l'étape brassard · **Rejouabilité** : jamais (le rituel de la retraite appartient à `en.vieux_gardien`, existant)
**Issues** → **Traces** → **Qui les lit** : `trebignac` → `gigi_trebignac` (« {annee} : Gigi Vecchio, cinquante ans, dans les buts de Trébignac contre Capitale FC. Un penalty arrêté. ») → lue par 13 (`coupe_du_village` : variante « Gigi est dans les buts »), 20 (« LE VIEUX DE TRÉBIGNAC »), 31 (carte-légende) · `filet` → `filet_gigi` (objet héritable ; « {annee} : Gigi Vecchio a donné le filet de 1990 à {prenom} {nom}. Il était dans le placard de la buvette. ») → lue par 90 (lignée : objet), 30 (`en_retraite` plus, `ta_loge`) · `minute` → `gigi_mort` (monde ; « 2031 : Gigi Vecchio est mort un dimanche, à la soixante-dixième. L'arbitre a ajouté une minute. ») → lue par 31 (Nouvelle 2031), 02 (Colline : « j'ai vu »), 18 (Paulette est morte à la même minute, en 2009 : rime), 90
**Séquencier** : gants_pretes (joueur, S0, [3,10]) → brassard (entraîneur, S1+, `flag('brassard_gigi')`, [4,12]) → trebignac (amateur ou président amateur, `year in 2000..2002`) → troisieme (sélectionneur, fenêtre de juin, `year in 1994..1996`) → filet (président, `chars.vecchio.statut == 'retraite'`) → minute (2031, tous rôles, drame sobre, une sortie)
**Épilogue** : `vestiaire −` ; « {annee} : Gigi est resté à {club}. Encore une. »

### SCÈNE jp.vecchio.gants_pretes  —  Les gants prêtés
**Rôle** : joueur · **Intrigue** : co.vecchio_cinq_retraites · **Étape** : 1/6 · **Moment** : saison 0, [3,10] · **Lieu** : le bord du terrain, le gardien titulaire au sol, Gigi suspendu · **Conditions** : `chars.vecchio.statut == 'club'` (thème `absurde`)
**VECCHIO** *(gardien, 41 ans, suspendu — neutre — il te tend ses gants jaunes, l'un après l'autre)*
« Le gardien est au sol, le jeune est en tribune, et moi je suis suspendu ; il reste toi. J'en ai vu d'autres, petit, mais un ailier dans mes gants, jamais. »
← **Je prends les gants** — effets : tribunes ++, vestiaire +, force −1, relation.vecchio +1, set: gants_pretes — *Tu arrêtes un tir. Un seul. Le stade chante ton nom ; Gigi range la Une du lendemain dans le sac, entre les deux gants.*
→ **Le jeune descend jouer** — effets : vestiaire +, direction +, relation.vecchio −1 — *Le jeune descend, en jean. Il encaisse deux buts. Gigi ne dit rien ; il garde les gants sous le bras.*
**Traces** : gants_pretes (« {annee} : {prenom} {nom} a joué vingt minutes dans les gants de Gigi Vecchio. Un arrêt, une Une. ») · **Réactions déclenchées** : co.re.vecchio_garde (existant) · **Lu plus tard par** : co.vecchio.faveur_reunion (variante « tu as porté mes gants »), 20 (« L'AILIER AUX GANTS JAUNES »), 31 (carte-légende « Piquer ou plonger ? »)

### SCÈNE en.vecchio.brassard  —  Un brassard sur des gants
**Rôle** : entraineur · **Intrigue** : co.vecchio_cinq_retraites · **Étape** : 2/6 · **Moment** : saison 1+, [4,12] · **Lieu** : le vestiaire, avant le match, le brassard passé par-dessus le gant gauche · **Conditions** : `flag('brassard_gigi')`
**VECCHIO** *(gardien, capitaine — sourire — il lève le bras gauche : ça ne tient pas, il le remet)*
« Un brassard sur des gants, coach, ça glisse et ça se voit de la tribune. J'en ai vu d'autres, des capitaines ; pas un qui l'ait mis sur le gant. »
← **Sur le gant, capitaine** — effets : vestiaire ++, tribunes +, relation.vecchio +1, relation.brehaut −1, set: brassard_gant — *Il le garde sur le gant. Il tombe deux fois par match. Le stade applaudit quand il le remet.*
→ **Bréhaut reprend le brassard** — effets : vestiaire +, direction +, relation.brehaut +1, relation.vecchio −1, set: brehaut_capitaine — *Il le rend sans un mot. Bréhaut le met sur le biceps. Gigi remet ses gants, un par un, plus lentement.*
**Traces** : brassard_gant (« {annee} : à {club}, le capitaine porte le brassard sur le gant. Il tombe deux fois par match. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 11 (`en.brassard_brehaut` étape S+1), 14 (Fauvel : « un gardien capitaine, ça se fait »), 30 (`jubile` plus)

### SCÈNE am.vecchio.trebignac  —  Trébignac, cinquante ans
**Rôle** : joueur_amateur, president_amateur · **Intrigue** : co.vecchio_cinq_retraites · **Étape** : 3/6 · **Moment** : `year in 2000..2002`, la Coupe · **Lieu** : le stade municipal Gérard-Blanchet, les buts sans filet, Gigi qui apporte le sien · **Conditions** : club = Trébignac ou adversaire de Trébignac en Coupe
**VECCHIO** *(gardien de Trébignac, 50 ans — sourire — il accroche un filet qu'il a apporté dans un sac)*
« Cinquante ans, une buvette, un filet que j'ai apporté moi-même, et Capitale FC au tirage. J'en ai vu d'autres, petit ; celle-là, on la joue chez nous, dans la boue. »
← **Je joue devant lui** — effets : tribunes ++, force −1, relation.vecchio +2, set: gigi_trebignac, outcome: trebignac — *Il arrête un penalty. Le stade municipal hurle. Barbier, en doudoune, est dans la tribune ; il a trente ans de retard.*
→ **Le jeune dans les buts** — effets : force +2, vestiaire −, relation.vecchio −1 — *Le jeune joue. Capitale FC marque cinq fois. Gigi tient la buvette pendant le match ; il ne regarde pas.*
**Traces** : gigi_trebignac · **Réactions déclenchées** : co.re.barbier_doudoune (02, à écrire par le chapitre 02 : « Je l'ai vu jouer sous la pluie. À cinquante ans. ») · **Lu plus tard par** : 13 (`coupe_du_village` variante), 20, 31 (carte-légende « Le penalty du vieux »), 02 (Barbier : retraite 2006, bénévole à Trébignac)

### SCÈNE sl.vecchio.troisieme  —  Le troisième gardien
**Rôle** : selectionneur · **Intrigue** : co.vecchio_cinq_retraites · **Étape** : 4/6 · **Moment** : fenêtre de juin, la Liste du tournoi, `year in 1994..1996` · **Lieu** : le hall de la Fédération, il attend sans dossier · **Conditions** : `chars.vecchio.statut in [club, staff]`
**VECCHIO** *(gardien, 44 ans — neutre — les gants sous le bras, comme toujours)*
« Troisième gardien à quarante-quatre ans, ça ne joue pas, ça descend du bus le premier. J'en ai vu d'autres, coach, des tournois ; pas un depuis le banc, et j'aimerais bien. »
← **Tu es le vingt-sixième** — effets : vestiaire ++, tribunes −, relation.vecchio +2, relation.brissac −1, set: gigi_vingt_sixieme — *Brissac dit que les chiffres sont têtus. Gigi aussi. Il descend le premier à chaque hôtel ; le groupe suit.*
→ **Le vingt-sixième sera jeune** — effets : force +1, tribunes +, relation.vecchio −1 — *Il rentre à {club}. Il regarde le tournoi à la buvette. Quand le bus refuse de descendre, personne ne descend le premier.*
**Traces** : gigi_vingt_sixieme (« {annee} : Gigi Vecchio, quarante-quatre ans, vingt-sixième des Cobalts. Il est descendu le premier du bus, sept fois. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 14 (le bus : variante « Gigi descend le premier » ; `bus_descendu`), 20 (« LE VINGT-SIXIÈME A QUARANTE-QUATRE ANS »)

### SCÈNE pr.vecchio.filet  —  Le filet de quatre-vingt-dix
**Rôle** : president, president_amateur · **Intrigue** : co.vecchio_cinq_retraites · **Étape** : 5/6 · **Moment** : saison 1+, [6,14] · **Lieu** : la buvette des anciens, un placard ouvert, un filet plié comme un drapeau · **Conditions** : `chars.vecchio.statut == 'retraite' && year >= 2010`
**VECCHIO** *(retraité, buvette des anciens — sourire — il tient le filet à deux mains)*
« Le filet du but de quatre-vingt-dix, celui de la saison où on n'avait pas un sou, je l'ai gardé dans le placard. J'en ai vu d'autres, président ; celui-là, il est à toi. »
← **Je le prends, pour le hall** — effets : tribunes ++, relation.vecchio +1, set: filet_gigi, outcome: filet — *Le filet est encadré dans le hall. Il sent la buvette. Gégé y accroche une écharpe le dimanche.*
→ **Garde-le, Gigi, il est à toi** — effets : relation.vecchio +1, vestiaire + — *Il le replie. Il le ressortira pour la minute ; ce sera Bréhaut qui l'accrochera.*
**Traces** : filet_gigi · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (lignée : objet), 30 (`ta_loge` plus), `co.vecchio.minute` (variante « le filet est accroché au but »)

### SCÈNE co.vecchio.minute  —  La minute
**Rôle** : tous · **Intrigue** : co.vecchio_cinq_retraites · **Étape** : 6/6 · **Moment** : 2031, [1,6], drame sobre, une sortie, jamais partagé en Une · **Lieu** : le stade, un dimanche, le filet de 1990 accroché au but Nord · **Conditions** : `year == 2031` (posée comme Nouvelle datée par 31 ; ce chapitre écrit la scène)
**COLLINE** *(responsable de l'arbitrage à la Fédération, 75 ans — neutre — voix sans portrait dans ce chapitre — il est descendu au bord du terrain, l'arbitre l'écoute)*
« Gigi Vecchio est mort ce matin, à la buvette, en disant qu'il en avait vu d'autres. Une minute de silence à la soixante-dixième ; j'ai vu, et l'arbitre en ajoutera une. »
← **Je me lève** — effets : — — *Deux minutes. Le stade ne bouge pas. Bréhaut tient le filet ; Sacha, si elle est là, ne chante pas.*
→ **Je me lève** — effets : — — *Deux minutes. Le stade ne bouge pas. Bréhaut tient le filet ; Sacha, si elle est là, ne chante pas.*
**Traces** : gigi_mort (monde) · **Réactions déclenchées** : — · **Lu plus tard par** : 31 (Nouvelle 2031, épitaphe d'enterrement), § 18 (Paulette : rime avec 2009), 90 (Panthéon), 02 (Colline)

### 7.5 Les paliers
### SCÈNE co.vecchio.trahison_une_rendue  —  Celle-là, je ne la garde plus
**Rôle** : entraineur, joueur, selectionneur · **Intrigue** : palier −3 · **Étape** : on_relation −3 · **Moment** : programmé en [1,3] · **Lieu** : le couloir, la Une qu'il gardait, dépliée, tendue · **Conditions** : `relation.vecchio <= -3`, une fois par carrière
**VECCHIO** *(gardien — noir — c'est la seule fois où il ne dit pas « coach »)*
« Celle-là, je la gardais pour toi, {prenom}, entre les deux gants ; je ne la garde plus. J'en ai vu d'autres, des coachs : celui-là, je l'ai vu de trop près. »
← **Je prends la Une** — effets : vestiaire −−−, tribunes −, set: une_rendue, char: {vecchio: {statut: parti}} — *Tu la prends. Elle date de ta première saison. Il vide son casier ; le jeune y met ses gants le soir même.*
→ **Je prends la Une** — effets : vestiaire −−−, tribunes −, set: une_rendue, char: {vecchio: {statut: parti}} — *Tu la prends. Elle date de ta première saison. Il vide son casier ; le jeune y met ses gants le soir même.*
**Traces** : une_rendue (« {annee} : Gigi Vecchio a rendu la Une qu'il gardait pour {nom}. Puis il a vidé son casier. ») · **Lu plus tard par** : 30 (`en_bus` : Gigi ne porte plus la valise), 11 (`en.vieux.retour_noir` exclu), 90 (Nemesis : jamais Gigi ; il part, il ne se venge pas — remarque pour 90)

### SCÈNE co.vecchio.faveur_reunion  —  La réunion sans toi
**Rôle** : entraineur, selectionneur · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : le parking, il t'attend appuyé sur ta voiture · **Conditions** : `relation.vecchio >= 3`, une fois par carrière
**VECCHIO** *(gardien ou entraîneur des gardiens — sourire — il parle bas, gants sous le bras)*
« Une réunion sans toi, portes fermées, et j'y étais : on ne ferme pas la porte à un gardien. J'en ai vu d'autres, coach ; pas celle-là, alors je te dis ce qu'ils veulent : être écoutés, une fois. »
← **Demain, une heure d'écoute** — effets : vestiaire +++, direction −, relation.vecchio +1, set: reunion_ecoutee — *Une heure. Bréhaut parle dix minutes, Mbako deux, les autres se taisent. Ça suffit ; Gigi le savait.*
→ **Qui a parlé, Gigi ?** — effets : vestiaire +, relation.vecchio −1 — *Il ne donne pas de nom. Il en a vu d'autres ; il ne balance pas. Il te laisse la voiture et rentre à pied.*
*(Variante si `flag('gants_pretes')` : « Tu as porté mes gants vingt minutes. Je te dois une réunion. »)*
**Traces** : reunion_ecoutee (« {annee} : le vestiaire a été écouté une heure. Gigi Vecchio avait assisté à la réunion sans le coach. ») · **Lu plus tard par** : 30 (`en_bus` plus : « Gigi avait prévenu »), 14 (`mutinerie_matee` variante « Gigi »), 11 (`bus_menace` : contre-alarme)

### 7.6 Les retrouvailles
### SCÈNE co.retrouvailles.vecchio_sourire  —  La Une, entre les gants
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les deux meilleures relations · **Lieu** : le vestiaire du nouveau club, un sac ouvert
**VECCHIO** *(sa fonction du moment — sourire — il sort une Une pliée d'un sac qui a changé trois fois)*
« Je l'ai gardée, celle de ta première saison ; elle a suivi dans trois sacs et deux clubs. J'en ai vu d'autres, coach, des Unes ; celle-là, je te la montre, je ne te la donne pas. »
**OK** **Montre-la au vestiaire** — effets : vestiaire ++, relation.vecchio +1 — *Il la montre. Le vestiaire comprend qui tu es. Il la replie entre les gants.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.vecchio_noir  —  Le casier
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les pires relations · **Lieu** : le vestiaire du nouveau club, devant un casier neuf
**VECCHIO** *(sa fonction du moment — noir — il dit « coach » quand même ; c'est pire)*
« Mon casier est resté vide jusqu'en octobre, là-bas, après toi ; ici j'en ai un neuf. J'en ai vu d'autres, coach, des casiers ; celui-là, tu n'y touches pas. »
**OK** **Je n'y touche pas** — effets : relation.vecchio +1, vestiaire − — *Il hoche la tête. Il n'en a pas vu d'autres, des coachs qui répondent ça.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.vecchio_telephone  —  La buvette des anciens
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : après 2010 (`chars.vecchio.statut == 'retraite'`), une fois par carrière · **Conditions** : `relation.vecchio != 0` · **Lieu** : ton téléphone, la buvette des anciens au bout du fil
**VECCHIO** *(retraité, buvette des anciens — voix au téléphone — des verres qu'on empile)*
« Gérard est parti au soleil, Bréhaut fait la vaisselle, et moi je paie les bières en Unes. J'en ai vu d'autres, coach, des téléphones ; celui-là, tu décroches. »
← **Je passe dimanche** — effets : tribunes +, relation.vecchio +1 — *Tu passes. Il te sert de l'eau. Il t'a gardé la place derrière le but, sur le banc à son nom.*
→ **Je t'appelle après la saison** — effets : direction +, relation.vecchio −1 — *« Après », dit-il. Il en a vu d'autres, des après. Il raccroche doucement.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### 7.7 Anecdotes
- **01.vecchio_chaussettes** — objet · `jp.vestiaire.superstition` (existant) · Les chaussettes trouées de 1990 : jamais lavées ; à la buvette des anciens, elles sont encadrées à côté du filet ; Paulette dit qu'elles sentent encore.
- **01.vecchio_voiture** — décor · brèves · Une camionnette avec « VECCHIO — PLOMBERIE » à moitié effacé : le métier de son père ; il n'a jamais posé un tuyau.
- **01.vecchio_superstition** — légende · set-piece `gm_annonce` · Il touche les deux poteaux avant chaque mi-temps et parle au poteau gauche ; « le droit, il écoute pas ».
- **01.vecchio_repas** — décor · `jp.vestiaire.repas_equipe` · Il ne mange que des pâtes au beurre la veille et une orange à la mi-temps ; il en apporte une à Paulette, tribune Est, avant de rentrer aux vestiaires.
- **01.vecchio_orange** — objet · `co.paulette.orange` · L'orange de la mi-temps : quand Gigi est mort, Paulette était morte depuis vingt-deux ans ; c'est Sacha qui a mis une orange sur la 14B.

### 7.8 Réactions propres
### RÉACTION co.re.vecchio_zoki  —  Zoki
**Après** : co.vukic.ballon_lache (← c'était toi) · **Famille** : tiers qui commente · **Conditions** : `relation.vecchio >= 0`
**VECCHIO** *(gardien — sourire — il parle bas, dans le bus, derrière)*
« Zoki t'a dit le ballon de soixante-dix-neuf ; il ne l'a dit qu'à moi, avant. J'en ai vu d'autres, coach ; des adjoints qui dorment dans le bus, non. »
**Un bouton** : **Laisse-le dormir** — effets : vestiaire +, relation.vukic +1 — *Il dort jusqu'à {ville}. C'est la première fois depuis 1979 ; Gigi le note dans sa tête, il n'a pas de cahier.*

### RÉACTION co.re.vecchio_bouteilles  —  Dix-sept ans de bouteilles
**Après** : jp.brehaut.bouteilles (les deux côtés) · **Famille** : tiers qui commente · **Conditions** : —
**VECCHIO** *(gardien — sourire — un clin d'œil, un pack sous l'autre bras)*
« Je les ai portées dix-sept ans, les bouteilles, et le jour où j'ai arrêté personne n'a dit merci. J'en ai vu d'autres, petit ; porte-les, ou porte autre chose, mais porte. »
**Un bouton** : **Compris, Gigi** — effets : vestiaire +, relation.vecchio +1 — *Tu portes les gants du jeune le lendemain. Le jeune ne comprend pas. Gigi, si.*

---

## 8. LA MÈRE DE MBAKO  (`mere_mbako`)
**Fonction** : mère et agente · **Genre** : f · **Âge en 1990** : 39 · **Camp** : terrain · **Fenêtre** : 1990-2030 (mère-agente 1990-2009, agente de vingt joueurs dès 2010, retraitée 2030 quand son fils devient Fantôme) ; elle meurt en 2041, son carnet est publié par Léa · **Suivant** : le père-agent générique (chapitre 12, voix sans portrait), et, dans le monde, le père de Noa Vandel
**Tic** : « Mon fils n'a besoin de personne. » — torsions : « Mon fils n'a besoin de personne. Surtout pas de vous. » · « Mon fils n'a besoin de personne. Moi, si. » · « Mes vingt fils n'ont besoin de personne. »
**Désir** : que son fils décide, et qu'il décide comme elle · **Blessure** : on lui a fait signer quelque chose une fois, elle avait dix-neuf ans (un contrat de chanteuse, trois ans, une avance jamais versée) ; depuis, elle lit tout, et elle écrit les clauses elle-même
**Adresse** : entraineur : {prenom} / coach / {pg, select, f{madame} other{monsieur}} {nom} · joueur : {prenom} / {prenom} / {nom} · autres : § 0.1
**Ce qu'elle pense de toi** : à +2 « vous l'avez fait jouer, vous avez lu le contrat, vous êtes rare » ; à 0 « vous êtes le coach ; moi, je gère » ; à −2 « vous avez essayé de le faire signer sans moi ; Léa le sait »
**Paliers** : −3 → `co.mere_mbako.trahison_lea` · +3 → `co.mere_mbako.faveur_numero`
**Dans les rôles** : entraîneur : tentatrice et messagère (elle négocie ; 1) · joueur : chœur (« vous aussi vous étiez le prochain » ; 0,5) · DS : tentatrice (3 % ou rien ; 1,5) · sélectionneur : messagère (le Kambara appelle ; 1) · instance : vautour (l'agente des vingt, 2010 ; 1) · président : la statue (0,5)
**Trajectoire 1990 → 2050** : 1990-1999 · 39-48 ans, chignon tiré, veste prune, le carnet de comptes ; elle signe en trois exemplaires · 2000-2009 · gris (1996) qu'elle teint jusqu'en 2005, puis assume ; agente de son fils seul ; elle refuse Fardelli douze fois · 2010-2019 · lunettes (2006) ; agente de vingt joueurs (2010), tous binationaux ; la Fédération la convoque, elle apporte vingt contrats · 2020-2029 · le Flux : elle poste les clauses, en photo · 2030-2039 · canne (2026) ; retraite 2030 ; elle vient regarder la statue, ou le banc, chaque premier dimanche · 2040-2050 · meurt en 2041 ; Léa publie le carnet : « Mon fils n'a besoin de personne », 300 pages, toutes des clauses
**Retrouvailles** : `co.retrouvailles.mere_mbako_sourire` / `_noir` / `_carnet`
**Cartes propres** : *Vous étiez le prochain* (01) · *Trois pour cent* (01) · *Le Kambara appelle* (01) · *Vingt contrats* (01) · *Dix-neuf ans* (01) · *La clause, en face* (01) · *La mère* (existant, `en.prodige.la_mere`) · *Le maillot orange* (11, `en.re.mere_orange`) · *Le prodige d'après* (10, `co.mbako_rival`, réaction)

### 8.1 Identité et place
On ne dit jamais son prénom (Josiane le connaît : Adama ; elle dit « madame »). 39 ans en 1990, 49 en 2000, 59 en 2010, 69 en 2020, 79 en 2030, 90 à sa mort. **Portrait** : le chignon tiré en arrière, la veste prune sur un haut crème, le carnet de comptes tenu comme un missel, un stylo qui écrit en trois exemplaires. **Voix** : posée, lente, chaque mot pesé comme un chiffre ; elle ne monte jamais le ton ; elle raccroche. Au club, elle est la porte avant le bureau : rien ne se signe sans elle, rien ne se dit à son fils qu'elle n'entende. Elle s'assoit en tribune présidentielle sans qu'on l'y ait invitée ; on ne la déplace pas.

**Désir / besoin / blessure / secret.** Désir : que son fils décide comme elle ; puis que vingt fils décident comme elle. Besoin : qu'un contrat, une fois, soit honnête sans qu'elle l'ait écrit. Blessure : dix-neuf ans, trois exemplaires, aucune avance. Secret : elle a gardé le contrat de 1970 ; elle le relit avant chaque négociation ; la clause qu'elle écrit dans tous les contrats de son fils est la copie inversée de celle qui l'a piégée.

### 8.2 Les cinq registres
- **−3** — « J'ai dit à Léa ce que vous avez tenté, monsieur {nom}. Mon fils n'a besoin de personne ; vous, vous aurez besoin d'un avocat. » / « Vous ne le verrez plus. Ni lui, ni moi, ni les vingt. »
- **−2 / −1** — « Vous l'avez fait attendre, coach. Mon fils n'a besoin de personne pour attendre. » / « Fardelli a mon numéro depuis mardi. Vous, vous ne l'aurez pas. »
- **0** — « Seize ans et un contrat aspirant. Vous le faites jouer, je veux un contrat pro. » (existant) / « Trois pour cent, ou rien. Mon fils n'a besoin de personne ; moi je compte. »
- **+1 / +2** — « Vous avez lu le contrat avant de signer, {prenom}. C'est rare ; je le note. » / « Mon fils n'a besoin de personne. De vous, un peu ; ne le dites pas. »
- **+3** — « Voilà le numéro que je ne donne jamais. Mon fils n'a besoin de personne ; vous, si, et je vous le donne. » / « Je vous laisse lui parler seul. C'est la première fois. »

### 8.3 Rapports avec les autres
**Alliés** : Josiane (deux femmes qui tiennent les papiers du club : elles se respectent, se craignent, se prêtent des agrafeuses), Solvang (2010+ : la nouvelle génération contre les gourmettes ; elles se partagent les binationaux), Léa (elle lui donne les clauses, Léa lui donne la Une). **Rivaux** : Fardelli (« mon ami » : elle ne répond jamais à ce mot), Brissac (qui veut son fils chez les Cobalts sans prime), Ilyas (« un actif, mon fils ? »). **Dettes** : elle doit à Vukić d'avoir vu le petit marcher sur l'eau ; Vaubourg lui doit une clause qu'il a signée sans lire. **Elle craint** : que son fils décide sans elle ; et elle le souhaite.

### 8.4 INTRIGUE co.mere_trois_pour_cent  —  Trois pour cent
**Logline** : La mère de Mbako écrit toutes les clauses ; à chaque rôle elle te demande trois pour cent, un numéro ou un aveu, et une fois elle te raconte ses dix-neuf ans. · **Synopsis** : Joueur, elle te dit que tu étais le prochain. DS, elle veut trois pour cent ou rien. Sélectionneur, le Kambara appelle et elle a déjà la prime. Instance, elle arrive avec vingt contrats. Un soir de relation elle raconte le contrat de 1970. Après la vente de son fils, elle vient te demander de signer un papier : que tu l'aurais gardé.
**Rôle(s)** : joueur, ds, selectionneur, instance, entraineur · **Postulat(s)** : partagé (pepite, vendre_trente, pays_emergent, heritage_empoisonne, promu) · **Porteur** : mere_mbako · **Cast** : mere_mbako, mbako, fardelli, josiane, lea, brissac · **Thème** : mercato
**Saisons** : "0" (prochain : joueur ; trois_pour_cent : DS), "1" (kambara, vingt_contrats selon le rôle), "2+" (dix_neuf_ans, clause_en_face) · **Conditions d'entrée** : `chars.mere_mbako.statut == 'club'` (elle ne part jamais : elle suit son fils, puis les vingt) · **Exclusions** : `en.prodige` à l'étape la_mere la même saison · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `signe_avec_elle` → `mere_trois_pour_cent` (« {annee} : trois pour cent pour la mère de Mbako, sans agent. {prenom} {nom} a signé en trois exemplaires. ») → lue par 12 (les quatre agents : « la cinquième »), 02 (Fardelli : « elle prend ma part »), 20 (« TROIS POUR CENT, TROIS EXEMPLAIRES ») · `vingt` → `mere_agente_vingt` (« {annee} : la mère de Mbako représente vingt joueurs. Elle a apporté vingt contrats à la Fédération. ») → lue par 15 (le règlement des agents), 14 (« ses joueurs » dans la liste), 10 (`binational` : elle représente le binational) · `dix_neuf` → `mere_dix_neuf_ans` (« {annee} : la mère de Mbako a raconté ses dix-neuf ans à {prenom} {nom}. Elle avait apporté le contrat de 1970. ») → lue par 90 (retrouvailles carnet), 31 (Léa publie le carnet, 2041), 06 (Mbako : « ma mère vous a dit ? »)
**Séquencier** : prochain (joueur, S0, [3,9]) | trois_pour_cent (DS, fenêtre de mercato) → kambara (sélectionneur, septembre, 1996-2010) | vingt_contrats (instance, 2010+) → dix_neuf_ans (S2+, `relation.mere_mbako >= 2`) → clause_en_face (entraîneur, S1+, `flag('mbako_vendu')`) ; lecture croisée : clause_en_face lit `mbako_vendu` (11) et `mbako_decide` (§ 6).
**Épilogue** : rien : elle suit son fils.

### SCÈNE jp.mere.prochain  —  Vous étiez le prochain
**Rôle** : joueur · **Intrigue** : co.mere_trois_pour_cent · **Étape** : 1/6 · **Moment** : saison 0, [3,9] · **Lieu** : le parking, elle t'attend devant ta voiture, carnet fermé · **Conditions** : `chars.mbako.statut == 'club' && age <= 24`
**LA MÈRE DE MBAKO** *(mère et agente — neutre — elle ne te laisse pas ouvrir la portière)*
« Vous avez dix-neuf ans, vous aussi vous étiez le prochain, et on vous a vendu sans vous demander. Mon fils n'a besoin de personne, {prenom} ; il a besoin que vous ne lui fassiez pas ça. »
← **Je lui apprends à dire non** — effets : vestiaire +, relation.mbako +1, relation.mere_mbako +1, set: mentor_mbako — *Elle ouvre la portière elle-même. « Bien », dit-elle. Elle a noté quelque chose dans le carnet, en marchant.*
→ **Je ne suis pas son père** — effets : force +1, relation.mere_mbako −1, set: rival_mbako — *Elle ne répond pas. Le petit prend ta place à la 60e le dimanche suivant ; elle était en tribune présidentielle.*
**Traces** : mentor_mbako, rival_mbako (chapitre 10, `co.mbako_rival`, issues ; ce chapitre écrit l'ouverture) · **Réactions déclenchées** : — · **Lu plus tard par** : 10 (`co.mbako_rival` étapes 2-6), 20 (« DEUX PÉPITES, UN VESTIAIRE »)

### SCÈNE ds.mere.trois_pour_cent  —  Trois pour cent
**Rôle** : ds · **Intrigue** : co.mere_trois_pour_cent · **Étape** : 2/6 · **Moment** : fenêtre de mercato, [1,4] du sous-paquet · **Lieu** : ton bureau, trois exemplaires alignés, un stylo par exemplaire · **Conditions** : `chars.mbako.statut in [club, vendu]` ou un des vingt (2010+)
**LA MÈRE DE MBAKO** *(mère et agente — neutre — elle pousse les trois exemplaires du bout du doigt)*
« Trois pour cent pour moi, sans agent, sans monsieur Fardelli, sans « mon ami ». Mon fils n'a besoin de personne, directeur ; moi j'ai besoin de trois pour cent, ou de rien, et rien c'est ailleurs. »
← **Trois pour cent, je signe** — effets : caisse −, vestiaire +, relation.mere_mbako +2, relation.fardelli −1, set: mere_trois_pour_cent, outcome: signe_avec_elle — *Elle signe les trois. Elle en garde deux. Fardelli apprend le chiffre par Josiane et rappelle « mon ami » pendant une semaine.*
→ **Rien ; Fardelli s'en occupe** — effets : caisse +, relation.mere_mbako −2, relation.fardelli +1, set: mere_rien — *Elle range les stylos un par un. Le joueur signe à Lyonnet le lendemain ; Fardelli a pris dix, pas trois.*
**Traces** : mere_trois_pour_cent, mere_rien (« {annee} : la mère de Mbako a dit « rien ». Le joueur a signé ailleurs ; Fardelli a pris dix. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 12 (le mercato d'hiver : elle revient avec un autre), 02 (Fardelli), 20

### SCÈNE sl.mere.kambara  —  La prime du Kambara
**Rôle** : selectionneur · **Intrigue** : co.mere_trois_pour_cent · **Étape** : 3/6 · **Moment** : fenêtre de septembre, la veille de `sl.mbako.kambara` ou à sa place si celle-ci a été jouée · **Lieu** : le hall de la Fédération, elle a déjà une chaise · **Conditions** : `year in 1996..2010 && !flag('mbako_kambara')`
**LA MÈRE DE MBAKO** *(mère et agente — neutre — un fax dans une pochette plastique)*
« Le Kambara offre une prime par match et une maison ; les Cobalts offrent un hymne. Mon fils n'a besoin de personne pour choisir, coach ; il a besoin que vous m'écoutiez avant lui. »
← **Je l'écoute, lui, seul** — effets : relation.mbako +1, relation.mere_mbako −1, tribunes +, set: mbako_ecoute_seul — *Tu le vois seul, pour la première fois. Elle attend dans le hall, elle a compté les minutes.*
→ **Je vous écoute, madame** — effets : relation.mere_mbako +2, direction −, set: mere_ecoutee — *Elle te lit le fax. Elle te lit aussi ce que la Fédération ne t'a pas dit sur la prime des Cobalts ; Dauzat le confirmera, au procès-verbal.*
**Traces** : mbako_ecoute_seul, mere_ecoutee (« {annee} : le sélectionneur a écouté la mère de Mbako avant son fils. Elle avait le fax du Kambara. ») · **Réactions déclenchées** : co.re.mere_mbako_kambara (§ 8.8) · **Lu plus tard par** : § 6 (`sl.mbako.kambara` : variante « ma mère vous a parlé »), 14 (l'avion des primes), 15 (les fédérations se disputent)

### SCÈNE in.mere.vingt_contrats  —  Vingt contrats
**Rôle** : instance · **Intrigue** : co.mere_trois_pour_cent · **Étape** : 4/6 · **Moment** : un dossier de l'année, `year >= 2010` · **Lieu** : la salle du comité, vingt contrats en pile, un carnet dessus · **Conditions** : `flag('mere_agente_vingt') || year >= 2010`
**LA MÈRE DE MBAKO** *(agente de vingt joueurs — neutre — elle ne s'assoit pas : elle est déjà assise)*
« Vingt joueurs, vingt clauses écrites de ma main, et votre commission veut une licence d'agent. Mon fils n'a besoin de personne, monsieur le président ; mes vingt fils ont besoin de la licence. »
← **La licence, sans examen** — effets : direction −, tribunes +, relation.mere_mbako +2, relation.fardelli −1, set: mere_agente_vingt, outcome: vingt — *Elle signe la licence en trois exemplaires. Fardelli demande la sienne le lendemain ; il a l'examen.*
→ **L'examen, comme les autres** — effets : direction +, relation.mere_mbako −1, set: mere_examen — *Elle passe l'examen. Elle a vingt sur vingt ; elle a corrigé deux questions du sujet. Dauzat l'a noté.*
**Traces** : mere_agente_vingt, mere_examen (« {annee} : la mère de Mbako a passé l'examen d'agent. Vingt sur vingt ; deux questions corrigées. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 15 (le règlement des agents ; Solvang en face), 12 (la cinquième agente), 20 (« VINGT FILS, UNE MÈRE »)

### SCÈNE co.mere.dix_neuf_ans  —  Dix-neuf ans
**Rôle** : entraineur, ds, selectionneur, instance · **Intrigue** : co.mere_trois_pour_cent · **Étape** : 5/6 · **Moment** : saison 2+, [4,12] · **Lieu** : le bar de l'hôtel d'un déplacement, elle a un jus, tu as ce que tu veux · **Conditions** : `relation.mere_mbako >= 2`
**LA MÈRE DE MBAKO** *(mère et agente — sourire — un contrat jauni sorti du carnet, trois pages)*
« J'avais dix-neuf ans, on m'a fait signer trois ans et une avance jamais venue ; je chantais. Mon fils n'a besoin de personne, {prenom} : c'est cette clause-là, à l'envers, que j'écris depuis. »
← **Chantez-moi une ligne** — effets : relation.mere_mbako +2, vestiaire +, set: mere_dix_neuf_ans, outcome: dix_neuf — *Elle chante une ligne, bas. C'est la berceuse du bizutage. Tu comprends d'où le petit la tient.*
→ **Gardez ça pour vous, madame** — effets : relation.mere_mbako −1, direction + — *Elle range le contrat de 1970. Elle ne le ressort plus ; Léa l'aura en 2041, avec le reste.*
**Traces** : mere_dix_neuf_ans · **Réactions déclenchées** : — · **Lu plus tard par** : co.retrouvailles.mere_mbako_carnet, 31 (le carnet publié, 2041), § 6 (`co.retrouvailles.mbako_sourire` variante « ma mère vous a chanté »)

### SCÈNE en.mere.clause_en_face  —  La clause, en face
**Rôle** : entraineur · **Intrigue** : co.mere_trois_pour_cent · **Étape** : 6/6 · **Moment** : saison 1+, [2,10] · **Lieu** : ton bureau, elle a apporté une feuille blanche et un stylo · **Conditions** : `flag('mbako_vendu')`
**LA MÈRE DE MBAKO** *(mère et agente — neutre — la feuille est vierge ; le stylo est décapuchonné)*
« La clause a joué, je l'avais écrite, et mon fils croit que c'est vous qui l'avez vendu. Mon fils n'a besoin de personne, coach ; écrivez-lui que vous l'auriez gardé, et signez, ou n'écrivez rien. »
← **J'écris, et je signe** — effets : vestiaire +, relation.mbako +2, relation.mere_mbako +1, direction −, set: lettre_mbako — *Trois lignes. Elle les lit deux fois. Elle les poste elle-même ; le petit ne célèbre plus jamais contre toi.*
→ **Je n'écris pas de mensonge** — effets : direction +, relation.mere_mbako +1, relation.mbako −1, set: lettre_refusee — *Elle rebouche le stylo. « Bien », dit-elle. C'est la première fois que vous êtes d'accord.*
**Traces** : lettre_mbako, lettre_refusee (« {annee} : {prenom} {nom} a refusé d'écrire au petit Mbako qu'il l'aurait gardé. Sa mère a dit « bien ». ») · **Réactions déclenchées** : — · **Lu plus tard par** : 11 (`en.prodige.marque_contre_toi` variante : « il a lu la lettre »), § 6 (`en.mbako.banc_en_face` variante), 90 (mémoire des clubs)

### 8.5 Les paliers
### SCÈNE co.mere_mbako.trahison_lea  —  Ce que Léa sait
**Rôle** : entraineur, ds, selectionneur · **Intrigue** : palier −3 · **Étape** : on_relation −3 · **Moment** : programmé en [1,3] · **Lieu** : la zone mixte, elle parle à Léa ; Léa te regarde · **Conditions** : `relation.mere_mbako <= -3`, une fois par carrière
**LA MÈRE DE MBAKO** *(mère et agente — noir — le carnet ouvert, une page cornée)*
« Vous avez tenté de faire signer mon fils sans moi, un soir, dans le bus ; Léa a la date. Mon fils n'a besoin de personne, monsieur {nom} ; vous, vous aurez besoin de confirmer. »
← **Je ne confirme pas** — effets : direction −−, tribunes −−, parole −2, set: mere_a_parle — *Léa écrit « ne confirme pas ». La Gazette titre sur le coupable ; La Plume demande les documents. Elle les a.*
→ **Je ne confirme pas** — effets : direction −−, tribunes −−, parole −2, set: mere_a_parle — *Léa écrit « ne confirme pas ». La Gazette titre sur le coupable ; La Plume demande les documents. Elle les a.*
**Traces** : mere_a_parle (« {annee} : la mère de Mbako a parlé à Léa. Un soir, un bus, une signature tentée sans elle. ») · **Lu plus tard par** : 20 (« SIGNER SANS LA MÈRE »), 02 (La Plume : « les documents »), 15 (le règlement des mineurs), 90 (Nemesis)

### SCÈNE co.mere_mbako.faveur_numero  —  Le numéro qu'elle ne donne jamais
**Rôle** : entraineur, ds, selectionneur · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : le parking, elle t'a suivi jusqu'à ta voiture · **Conditions** : `relation.mere_mbako >= 3`, une fois par carrière
**LA MÈRE DE MBAKO** *(mère et agente — sourire — une page arrachée au carnet, un numéro dessus)*
« Le club qui veut mon fils m'a donné ce numéro et je ne le donne jamais ; c'est le président, pas l'agent. Mon fils n'a besoin de personne, {prenom} ; vous, vous avez besoin d'appeler avant eux. »
← **J'appelle ce soir** — effets : caisse ++, direction +, relation.mere_mbako +1, set: numero_mere — *Tu appelles. Le président décroche. Il ne comprend pas comment tu as le numéro ; tu ne le dis pas ; elle apprécie.*
→ **Gardez-le, c'est le vôtre** — effets : relation.mere_mbako +1, vestiaire + — *Elle replie la page. « Bien », dit-elle. Elle appelle elle-même ; elle négocie pour toi, sans commission ; une fois.*
**Traces** : numero_mere (« {annee} : la mère de Mbako a donné son numéro à {prenom} {nom}. Elle ne le donne jamais. ») · **Lu plus tard par** : 12 (le mercato : une offre en plus), 02 (Fardelli : « comment tu as eu le numéro ? »), 30 (`ds_roi` plus)

### 8.6 Les retrouvailles
### SCÈNE co.retrouvailles.mere_mbako_sourire  —  Trois exemplaires, à ton nom
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les deux meilleures relations · **Lieu** : ton nouveau bureau, trois exemplaires sur la table
**LA MÈRE DE MBAKO** *(sa fonction du moment — sourire — trois exemplaires d'un contrat qui n'est pas celui de son fils)*
« C'est votre contrat, {prenom}, pas le sien ; je l'ai relu et j'ai ajouté une clause à la page trois. Mon fils n'a besoin de personne ; vous, vous aviez besoin de cette page. »
**OK** **Je lis la page trois** — effets : caisse +, direction +, relation.mere_mbako +1 — *La page trois te protège du SMS de 23 h 47. Elle a écrit ça en une ligne ; l'avocat du club met deux jours à la comprendre.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.mere_mbako_noir  —  Le numéro de Fardelli
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les pires relations · **Lieu** : le hall du nouveau club, elle reste debout
**LA MÈRE DE MBAKO** *(sa fonction du moment — noir — elle ne s'assoit pas, pour une fois)*
« J'ai le numéro de monsieur Fardelli depuis mardi, comme la première fois ; cette fois je l'ai composé. Mon fils n'a besoin de personne, monsieur {nom} ; vous, vous aurez « mon ami ». »
**OK** **Fardelli ne me fait pas peur** — effets : relation.mere_mbako −1, relation.fardelli +1, direction + — *Elle sourit. C'est pire. Fardelli t'appelle « mon ami » le soir même.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.mere_mbako_carnet  —  Le carnet, 2041
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : 2041, une fois (`chars.mere_mbako.statut == 'mort' || (chars.mere_mbako.statut == 'parti' && flag('mere_mbako_mort'))`) · **Conditions** : `flag('mere_dix_neuf_ans')` · **Lieu** : la salle de presse, un livre épais sur la table
**LÉA** *(ancienne rédactrice en chef, éditrice du carnet, 76 ans — neutre — un livre épais, une page marquée)*
« Le carnet est publié, trois cents pages, toutes des clauses ; à la page cent douze il y a votre nom et une berceuse. Vous confirmez que vous l'avez entendue ? »
← **Je confirme** — effets : tribunes +, relation.mere_mbako +1 (posthume) — *Léa écrit « confirme ». Le livre se vend à {ville} plus qu'ailleurs. Mbako, Fantôme, achète dix exemplaires.*
→ **Ça reste entre elle et moi** — effets : direction +, relation.lea −1 — *Léa écrit « ne confirme pas ». La page cent douze est la plus lue du livre.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### 8.7 Anecdotes
- **01.mere_contrat_1970** — objet · `co.mere.dix_neuf_ans`, 2041 · Le contrat de 1970, trois pages, plié dans le carnet ; l'avance non versée est de « douze mille francs », et elle sait encore ce qu'elle en aurait fait.
- **01.mere_voiture** — décor · brèves · Une berline noire, conduite par elle, jamais par le petit ; en 2010 elle a un chauffeur, un des vingt, blessé.
- **01.mere_superstition** — légende · `en.prodige.la_mere` (existant) · Trois exemplaires, toujours : « un pour vous, un pour moi, un pour le jour où l'un des deux ment ».
- **01.mere_repas** — décor · toute scène d'hôtel · Elle ne mange pas avec le club ; elle commande un jus et lit ; on l'a vue manger une fois, à l'école du Kambara, en 2011.
- **01.mere_tribune** — légende · `pr.mbako.statue` · Elle s'assoit en tribune présidentielle sans invitation depuis 1990 ; en 2032, les socios lui donnent un siège à son nom ; elle le refuse et s'assoit dessus.

### 8.8 Réactions propres
### RÉACTION co.re.mere_mbako_souffle  —  Ce que vous lui avez soufflé
**Après** : jp.mbako.sac_neuf (→ tu lui dis « je décide ») · **Famille** : conséquence immédiate · **Conditions** : —
**LA MÈRE DE MBAKO** *(mère et agente — noir — le carnet fermé d'un coup sec)*
« Il m'a dit « je décide » avec vos mots, {prenom}. Mon fils n'a besoin de personne ; il n'avait pas besoin de vous pour ça non plus. »
**Un bouton** : **Il a raison, madame** — effets : relation.mere_mbako −1, relation.mbako +1 — *Elle ne répond pas. Elle n'oublie pas non plus ; elle a un carnet pour ça.*

### RÉACTION co.re.mere_mbako_kambara  —  L'autre match
**Après** : sl.mbako.kambara (→ réponds) · **Famille** : tiers qui commente · **Conditions** : —
**LA MÈRE DE MBAKO** *(mère et agente — sourire — un billet d'avion dans le carnet)*
« Il joue pour le Kambara en novembre, et je serai dans le stade, pas dans le vôtre. Mon fils n'a besoin de personne, coach ; merci quand même. »
**Un bouton** : **Bon voyage, madame** — effets : relation.mere_mbako +1, tribunes − — *Elle part. Elle t'envoie une photo du stade du Kambara, par fax, sans texte.*

---

## 9. GÉGÉ  (`gege`)
**Fonction** : capo de la Tribune Nord · **Genre** : m · **Âge en 1990** : 47 · **Camp** : terrain · **Fenêtre** : 1990-2040 (capo 1990-2020, chroniqueur à Radio Tribune 2004-2011, compte anonyme dès 2020, élu socios 2032 à 89 ans, « le plus vieil élu du pays ») ; il meurt en 2032, la Tribune Nord porte son nom un an, puis la loi des franchises la renomme, puis on la renomme encore · **Suivant** : Nino, le neveu de Gégé (né 1985, capo dès 2020 ; même écharpe, jamais lavée non plus ; il dit « le virage n'oublie rien », c'est presque pareil)
**Tic** : « La tribune n'oublie rien. » — torsions : « La tribune n'oublie rien. Elle compte aussi. » · « La tribune n'oublie rien, mais elle ne balance pas. » (existant) · « La tribune a oublié. C'est pire. »
**Désir** : la fierté du virage, le respect · **Blessure** : son père a été interdit de stade en 1971 pour un tifo (une bâche : « LE PRÉSIDENT VEND, LE VIRAGE RESTE ») ; il est mort sans revoir la Marmite ; Gégé a la bâche, pliée, sous le bar du local
**Adresse** : entraineur : {prenom} / coach / {nom} · joueur : petit / {prenom} / le {numero} · autres : § 0.1
**Ce qu'il pense de toi** : à +2 « la tribune t'a adopté, elle chante ton nom sans se tromper d'accent » ; à 0 « on te fait un tifo, tu passes au local ? » ; à −2 « on a hésité sur l'accent »
**Paliers** : ∃ (entraîneur, déjà dans `content/`, cités et jamais réécrits) −3 → `en.gege.trahison_banderole` · +3 → `en.gege.faveur_insurrection` ; **ce chapitre ajoute** : joueur −3 → `jp.gege.trahison_sifflet` · président +3 → `pr.gege.faveur_siege`
**Dans les rôles** : entraîneur : créancier (le local, le onze, le pacte, les banderoles ; 2) · joueur : chœur (« petit », le tifo, le numéro sifflé ; 1,5) · président : créancier et cœur (les abonnements à cinq écus, le siège du siège, les socios ; 2) · amateur : cousin (il a un cousin partout ; 1) · instance : le compte anonyme (2020 ; 1) · sélectionneur : le car des supporters (0,5) · DS : « la tribune n'oublie pas qui achète bien » (0,5)
**Trajectoire 1990 → 2050** : 1990-1999 · 47-56 ans, casquette verte, doudoune noire, écharpe jamais lavée ; le local, la craie, la bâche ; gris à 45 déjà · 2000-2009 · lunettes (1998) qu'il porte sur la casquette ; Radio Tribune 2004-2011 (« Les auditeurs ont la parole », il ne la leur laisse pas) ; les abonnements à cinq écus (2003) · 2010-2019 · le Flux : il découvre qu'on peut découper une Une sans ciseaux ; la Ligue fermée (2019) : il est devant l'hôtel, soixante heures · 2020-2029 · canne (2018) ; capo honoraire ; le compte anonyme (« Tribune_N_1971 ») que tout le monde reconnaît · 2030-2039 · élu socios 2032 ; il vote la compo au conseil, à la craie · 2040-2050 · meurt en 2040, le jour de la loi des franchises ; la banderole de son enterrement fait vingt mètres ; on a hésité sur l'accent
**Retrouvailles** : `co.retrouvailles.gege_sourire` / `_noir` / `_cousin`
**Cartes propres** : *Le numéro* (01) · *Cinq écus* (01) · *Radio Tribune* (01) · *Le compte anonyme* (01) · *Les socios* (01) · *Le cousin de Corbelin* (01) · *Le kop qui t'aime trop* (existant, `en.kop.*`) · *Le tifo à ton nom* (10, `jp.tifo`) · *Le derby* (11, `co.derby`) · *Les 60 heures* (13) · *La Une découpée* (existant, `co.re.gege_decoupe`)

### 9.1 Identité et place
Gérard, comme l'autre : on dit Gégé pour ne pas confondre avec la buvette ; il en souffre. 47 ans en 1990, 57 en 2000, 67 en 2010, 77 en 2020, 87 en 2030, 97 à sa mort. **Portrait** : la casquette verte vissée, la barbe de trois jours devenue de trois ans puis de trente, la doudoune noire hiver comme été, l'écharpe rayée qui a la couleur des saisons passées. **Voix** : forte, rauque, poète malgré lui (il rime sans le vouloir, et il déteste ça) ; il parle du virage à la troisième personne, comme d'une femme. Au club, il est sous la Tribune Nord : le local, trois bières, la craie, les Unes découpées au-dessus du bar, la bâche du père. Il n'entre au bureau que pour réclamer ; il entre au vestiaire une fois par carrière, à +3.

**Désir / besoin / blessure / secret.** Désir : que le virage soit respecté, et qu'on le sache. Besoin : que quelqu'un du club vienne au local sans y être obligé. Blessure : 1971, le père, la bâche. Secret : il a un cousin dans chaque ville du pays parce qu'il a inventé la moitié d'entre eux ; le seul vrai est à Corbelin, et il a vraiment une bâche.

### 9.2 Les cinq registres
- **−3** — « La banderole fait vingt mètres. DÉMISSION, et ton nom devant. On a hésité sur l'accent. » (existant) / « Le {numero}, on le siffle à l'échauffement. La tribune n'oublie rien. »
- **−2 / −1** — « Lui, il venait. La tribune n'oublie rien. Elle compte aussi. » / « Arena Almadis. Le nom en orange, le nôtre en dessous, en petit. » (existant)
- **0** — « On te fait un tifo. Tu passes boire un coup au local ? » / « On a découpé la Une. Elle est au local, au-dessus du bar. » (existant)
- **+1 / +2** — « Un pacte : le local rénové, et ton nom chanté dans toute la ville. Tape là. » (existant) / « Petit, la tribune a chanté ton nom sans se tromper d'accent. C'est rare. »
- **+3** — « Il y avait une insurrection prévue ce soir au vestiaire. J'ai dit non. » (existant) / « Le siège du siège, on l'a levé. La tribune n'oublie rien, président ; elle sait aussi pardonner, une fois. »

### 9.3 Rapports avec les autres
**Alliés** : Paulette (elle était là en cinquante et un, il l'écoute comme une mère), Vecchio (le vieux que la tribune n'a jamais sifflé), Josiane (elle lui prête les ciseaux du secrétariat), Corven (« le seul coach qui est venu au local sans être invité, en 1974 »). **Rivaux** : Vaubourg (« le président vend »), Ilyas (« un actif ? une tribune, c'est du monde »), Massenet (qui dit « kop » : Gégé dit le virage), Colline (qui a sifflé une main contre son pays : Gégé lui en veut par principe). **Dettes** : il doit à Dupuis les bières du local depuis 1994 ; Montoya lui doit soixante heures de trottoir. **Il aime** : Sacha, qui a peint sa première banderole à sept ans, « PAPA/MAMAN RENTRE » ; elle est au-dessus du bar.

### 9.4 INTRIGUE co.gege_virage  —  Le virage
**Logline** : Gégé traverse tous tes rôles avec la même écharpe ; il te siffle, te chante, te fait payer cinq écus, t'invite à la radio, te dénonce anonymement et finit élu au conseil de ton ancien club. · **Synopsis** : Joueur, il te dit que la tribune chante ton numéro, ou le siffle. Président, il vient réclamer les abonnements à cinq écus. À Radio Tribune il t'invite un jeudi soir. En 2020, un compte anonyme parle de toi ; c'est lui. En 2032, les socios prennent le club et il est élu. Et partout, il a un cousin.
**Rôle(s)** : joueur, president, entraineur, instance, joueur_amateur, president_amateur · **Postulat(s)** : partagé · **Porteur** : gege · **Cast** : gege, paulette, aulard, nassir, lea, nino (voix) · **Thème** : tribune
**Saisons** : "0" (numero : joueur), "1" (cinq_ecus : président ; radio 2004-2011), "2+" (compte 2020+, socios 2032, cousin partout) · **Conditions d'entrée** : `chars.gege.statut in [club, retraite]` · **Exclusions** : `en.kop_qui_aime_trop` la même saison · **Rejouabilité** : jamais (le kop rejouable est l'intrigue existante)
**Issues** → **Traces** → **Qui les lit** : `cinq_ecus` → `abonnements_cinq_ecus` (« {annee} : abonnements à cinq écus en tribune Nord. {prenom} {nom} a signé ; la buvette a compensé. ») → lue par 13 (`rachete_fonds` : le naming contre les cinq écus), 20 (« CINQ ÉCUS, ET LE VIRAGE PLEIN »), 30 (`pr_siege` plus) · `radio` → `gege_radio` (« {annee} : {prenom} {nom} a répondu aux auditeurs de Radio Tribune. Gégé n'a pas laissé la parole. ») → lue par 20 (Radio Tribune comme source d'une brève), 02 (Massenet : « la radio des supporters vous aime »), 30 (transition Consultant) · `socios` → `gege_socios` (« {annee} : Gégé, quatre-vingt-neuf ans, élu au conseil des socios de {club}. Il vote la compo à la craie. ») → lue par 13 (le club repris par les socios : Gégé au conseil), 90 (« le rat de tribune »), 31 (Nouvelle 2032) · `compte` → `gege_compte_anonyme` (« {annee} : un compte anonyme a parlé de {nom}. Tout le monde a reconnu Gégé. ») → lue par 15 (le compte anonyme, 2020), 20 (« TRIBUNE_N_1971 A PARLÉ »)
**Séquencier** : numero (joueur, S0, [4,12], lit `derby_perdu`) → cinq_ecus (président, S1+, `year >= 2003`) → radio (tous, `year in 2004..2011`) → compte (instance ou président, `year >= 2020`) → socios (président ou instance, `year >= 2032`) → cousin (amateur, tout moment) ; lecture croisée : numero lit `pacte_gege` (11) ; socios lit `ligue_fermee_signee` (13).
**Épilogue** : `tribunes −` ; « {annee} : le virage a chanté un autre nom. Gégé a gardé l'ancien à la craie. »

### SCÈNE jp.gege.numero  —  Le numéro
**Rôle** : joueur · **Intrigue** : co.gege_virage · **Étape** : 1/6 · **Moment** : saison 0, [4,12] · **Lieu** : le parking, il t'attend avec deux bières, une ouverte · **Conditions** : `chars.gege.statut == 'club'` ; variante `_derby` si `flag('derby_perdu')` (« le {numero}, dimanche, on l'a sifflé »)
**GÉGÉ** *(capo, Tribune Nord — neutre — il te tend la bière fermée)*
« Le virage a appris ton numéro avant ton nom ; il chante l'un, il siffle l'autre, selon dimanche. La tribune n'oublie rien, {prenom} : tu passes au local, ou tu passes ton chemin ? »
← **Je passe au local** — effets : tribunes ++, direction −, set: ami_ultras, relation.gege +1 — *Trois bières. Ta compo à la craie sur le mur. Camille demande à quelle heure ; tu ne sais plus.*
→ **Je rentre, Gégé** — effets : tribunes −, direction +, relation.gege −1 — *Il ouvre la deuxième bière lui-même. Il la boit sur le parking. La tribune compte.*
**Traces** : ami_ultras (∃) · **Réactions déclenchées** : en.re.camille_le_verre (11, variante joueur) · **Lu plus tard par** : 10 (`jp.tifo` : variante « tu es passé au local »), 30 (`jp_siffle` plus, `en_otage`), 13 (les abonnements)

### SCÈNE pr.gege.cinq_ecus  —  Cinq écus
**Rôle** : president, president_amateur · **Intrigue** : co.gege_virage · **Étape** : 2/6 · **Moment** : saison 1+, [2,8] · **Lieu** : le bureau du président, il n'a pas frappé, il a une liste · **Conditions** : `year >= 2003`
**GÉGÉ** *(capo, Tribune Nord — neutre — la liste des abonnés fait quatre pages, à la main)*
« Un abonnement en tribune Nord, c'est quarante écus ; le virage en veut cinq, et il remplit. La tribune n'oublie rien, président : elle sait ce que coûte un stade vide. »
← **Cinq écus, pour la Nord** — effets : tribunes +++, caisse −−, relation.gege +2, set: abonnements_cinq_ecus, outcome: cinq_ecus — *La Nord est pleine en septembre. Vialat écrit une lettre ; la buvette compense, Bréhaut fait les comptes.*
→ **Quarante, comme les autres** — effets : caisse +, tribunes −−, relation.gege −1, set: tarif_plein — *Le virage est à moitié vide. L'autre moitié chante « quarante écus » sur l'air de ton nom.*
**Traces** : abonnements_cinq_ecus, tarif_plein (« {annee} : quarante écus pour la tribune Nord. Le virage a chanté le tarif. ») · **Réactions déclenchées** : co.re.gege_decoupe (existant, si Une) · **Lu plus tard par** : 13 (Vialat, le naming), 20, 30 (`pr_siege`)

### SCÈNE co.gege.radio  —  Radio Tribune
**Rôle** : tous · **Intrigue** : co.gege_virage · **Étape** : 3/6 · **Moment** : `year in 2004..2011`, [3,12] · **Lieu** : un studio au-dessus d'un bar, 22 h, un micro qui grésille · **Conditions** : `relation.gege >= 0`
**GÉGÉ** *(chroniqueur, Radio Tribune — sourire — le casque sur la casquette)*
« Jeudi, vingt-deux heures, « Les auditeurs ont la parole », et je ne la leur laisse jamais ; ce soir je te la donne. La tribune n'oublie rien, coach : qu'est-ce que tu dis au virage ? »
← **La vérité, une heure** — effets : tribunes ++, direction −, parole +1, set: gege_radio, outcome: radio — *Une heure. Trois auditeurs, tous des cousins. Massenet écoute depuis sa voiture ; il note « franc ».*
→ **Le discours du club, court** — effets : direction +, tribunes −, relation.gege −1 — *Dix minutes. Il coupe la pub à la neuvième. Il met un chant du virage à la place ; c'est ton nom, mal accentué.*
**Traces** : gege_radio · **Réactions déclenchées** : — · **Lu plus tard par** : 20 (Radio Tribune source de brève), 02 (Massenet), 30 (transition Consultant : « le peuple vous réclame » variante radio)

### SCÈNE in.gege.compte  —  Le compte anonyme
**Rôle** : instance, president · **Intrigue** : co.gege_virage · **Étape** : 4/6 · **Moment** : `year >= 2020`, [2,10] · **Lieu** : ton téléphone, une notification, puis le local · **Conditions** : `flag('monde_flux')`
**GÉGÉ** *(capo honoraire, 77 ans — neutre — la canne, le téléphone tenu à bout de bras)*
« Un compte anonyme dit que tu as vendu le virage aux franchises ; il s'appelle Tribune_N_1971, et tout le monde sait qui c'est. La tribune n'oublie rien, président ; elle a juste changé de mur. »
← **Je réponds, sous mon nom** — effets : tribunes +, direction −, relation.gege +1, set: gege_compte_anonyme, outcome: compte — *Tu réponds. Il répond. Léa fait un papier sur « le dialogue » ; c'est le premier depuis 1971 qui finit sans bâche.*
→ **Je bloque le compte** — effets : direction +, tribunes −−, relation.gege −2 — *Le compte est bloqué. La tribune compte.*
**Traces** : gege_compte_anonyme · **Réactions déclenchées** : — · **Lu plus tard par** : 15 (le compte anonyme), 20 (« TRIBUNE_N_1971 A PARLÉ »), 13 (la Ligue fermée : il est devant l'hôtel)

### SCÈNE pr.gege.socios  —  Les socios
**Rôle** : president, instance · **Intrigue** : co.gege_virage · **Étape** : 5/6 · **Moment** : `year >= 2032`, [1,6] · **Lieu** : la salle du conseil, une craie posée sur la table, la bâche du père au mur · **Conditions** : `flag('monde_franchises') || chars.gege.age >= 89`
**GÉGÉ** *(élu socios, 89 ans — sourire — il s'assoit sur la chaise du président, pas la sienne)*
« Élu au conseil à quatre-vingt-neuf ans, le plus vieux du pays, et j'ai apporté la craie. La tribune n'oublie rien, président ; maintenant elle vote, et elle a une voix de plus que toi. »
← **Vote la compo, Gégé** — effets : tribunes +++, direction −−, set: gege_socios, set: onze_du_virage, outcome: socios — *Il vote. Le mur du conseil garde la craie.*
→ **Le conseil décide, pas toi** — effets : direction ++, tribunes −−, relation.gege −1, set: gege_socios — *Il range la craie. Il reste au conseil. Il vote contre chaque décision jusqu'en 2040 ; il perd toutes les fois, et gagne à la fin.*
**Traces** : gege_socios, onze_du_virage (∃) · **Réactions déclenchées** : — · **Lu plus tard par** : 13 (les socios), 90 (« le rat de tribune »), 31 (Nouvelle 2032), 30 (`en_otage` plus, `pr_mairie`)

### SCÈNE am.gege.cousin  —  Le cousin de Corbelin
**Rôle** : joueur_amateur, president_amateur, entraineur · **Intrigue** : co.gege_virage · **Étape** : 6/6 · **Moment** : tout moment, [2,12], quand le club est loin de Saint-Étoile · **Lieu** : le bord d'un terrain de District, une écharpe qu'on reconnaît de loin · **Conditions** : `chars.gege.statut != 'mort'`
**GÉGÉ** *(capo, Tribune Nord, en déplacement — sourire — il désigne un homme avec une bâche pliée)*
« J'ai un cousin ici, comme partout, sauf que celui-là est vrai et qu'il a une bâche. La tribune n'oublie rien, petit : elle a des cousins, et ils ont des marqueurs. »
← **On déploie la bâche** — effets : tribunes ++, direction −, set: bache_cousin — *Vingt mètres pour un match de District. Le maire vient voir. La bâche dit ton nom, avec le bon accent, pour une fois.*
→ **Pas de bâche en District** — effets : tribunes −, direction +, relation.gege −1 — *Le cousin replie. Il la déploiera pour Montbéliac, à l'envers.*
**Traces** : bache_cousin (`journal:` poids 1) · **Réactions déclenchées** : — · **Lu plus tard par** : 13 (`fusion_imposee` : « la bâche du cousin »), 20 (Écho, « Au local »)

### 9.5 Les paliers (variantes de rôle)
### SCÈNE jp.gege.trahison_sifflet  —  Le sifflet du numéro
**Rôle** : joueur · **Intrigue** : palier −3 · **Étape** : on_relation −3 · **Moment** : programmé en [1,3] · **Lieu** : l'échauffement, la Tribune Nord, un sifflet qui commence à gauche · **Conditions** : `relation.gege <= -3`, une fois par carrière
**GÉGÉ** *(capo — noir — il siffle le premier ; les autres suivent)*
« Le {numero}, on le siffle à l'échauffement, à la mi-temps et au parking ; le parking, c'est nouveau. La tribune n'oublie rien : elle a hésité sur ton nom, pas sur le sifflet. »
← **Je m'échauffe devant eux** — effets : tribunes −−−, vestiaire −, set: numero_siffle — *Tu t'échauffes devant. Le sifflet dure quatre minutes. Bréhaut vient s'échauffer à côté de toi ; c'est tout ce qu'il peut.*
→ **Je m'échauffe devant eux** — effets : tribunes −−−, vestiaire −, set: numero_siffle — *Tu t'échauffes devant. Le sifflet dure quatre minutes. Bréhaut vient s'échauffer à côté de toi ; c'est tout ce qu'il peut.*
**Traces** : numero_siffle (« {annee} : le {numero} sifflé à l'échauffement, à la mi-temps, au parking. Gégé a commencé. ») · **Lu plus tard par** : 30 (`jp_siffle` plus), 10 (alarme tribunes basse variante), 90 (mémoire des clubs −1)

### SCÈNE pr.gege.faveur_siege  —  Le siège levé
**Rôle** : president, president_amateur · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : sous les fenêtres du siège, les tambours qui s'arrêtent · **Conditions** : `relation.gege >= 3`, une fois par carrière
**GÉGÉ** *(capo — sourire — il fait signe aux tambours, ils se taisent)*
« Le virage voulait faire le siège du siège ce soir, trois cents sous tes fenêtres ; j'ai dit non. La tribune n'oublie rien, président ; elle sait aussi pardonner, une fois, et c'est celle-là. »
← **Merci, Gégé, monte** — effets : tribunes +++, direction +, set: siege_leve — *Il monte au bureau. Première fois depuis 1971 pour un Gégé. Il ne s'assoit pas ; il regarde la vue sur le virage.*
→ **Qui voulait le siège ?** — effets : tribunes +, relation.gege −1 — *Il ne donne pas de noms. La tribune n'oublie rien, mais elle ne balance pas. Les tambours rentrent.*
**Traces** : siege_leve (« {annee} : le siège du siège annulé par Gégé. {prenom} {nom} ne saura jamais qui frappait les tambours. ») · **Lu plus tard par** : 30 (`pr_siege` plus), 13 (les 60 heures : il est de ton côté du trottoir)

### 9.6 Les retrouvailles
### SCÈNE co.retrouvailles.gege_sourire  —  L'écharpe
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les deux meilleures relations · **Lieu** : le parking du nouveau stade, le car des supporters
**GÉGÉ** *(capo, en déplacement — sourire — il enlève l'écharpe, ce qu'il ne fait jamais)*
« Je suis venu avec le car, six heures de route, pour te donner ça ; elle n'a jamais été lavée, c'est le principe. La tribune n'oublie rien, {prenom} : elle te suit, même ici. »
**OK** **Je la mets** — effets : tribunes ++, relation.gege +1, set: echarpe_gege — *Tu la mets. Elle sent 1990. Le virage d'ici ne comprend pas ; celui de là-bas, si.*
**Traces** : echarpe_gege (objet héritable ; « {annee} : Gégé a donné son écharpe à {prenom} {nom}. Jamais lavée ; c'est le principe. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (lignée : objet ; retrouvailles), 30 (`en_otage` plus : « l'écharpe de Gégé au cou »)

### SCÈNE co.retrouvailles.gege_noir  —  L'accent
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les pires relations · **Lieu** : le parking du nouveau stade, la banderole pliée dans le coffre du car
**GÉGÉ** *(capo, en déplacement — noir — il a fait six heures de route pour ça)*
« On a refait la banderole pour ton nouveau club, vingt mètres, et cette fois on a trouvé l'accent. La tribune n'oublie rien, {nom} ; elle se déplace, aussi. »
**OK** **Déployez-la, et rentrez** — effets : tribunes −−, direction − — *Elle se déploie à la 30e. Le nouveau virage applaudit : c'est une belle banderole.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.gege_cousin  —  Le car
**Rôle** : joueur_amateur, president_amateur · **Intrigue** : retrouvailles · **Moment** : à la première Passation vers un rôle amateur · **Conditions** : `relation.gege != 0` · **Lieu** : le bord d'un terrain de District, un car garé en travers
**GÉGÉ** *(capo — neutre — il descend d'un car, seul, l'écharpe au cou)*
« Le District, le village, le terrain en pente, j'ai un cousin ici aussi, et il m'a dit que tu étais là. La tribune n'oublie rien, petit ; elle descend jusqu'ici quand il faut. »
← **Reste boire un coup** — effets : tribunes +, relation.gege +1, caisse − — *Gérard sert. Ici, on paie en bières ; Gégé en a apporté. Le cousin a la bâche dans le coffre.*
→ **Rentre, c'est le District** — effets : relation.gege −1, direction + — *Il rentre. Le cousin reste. Il a une bâche, et un marqueur.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### 9.7 Anecdotes
- **01.gege_bache_1971** — objet · local, enterrement · La bâche du père, « LE PRÉSIDENT VEND, LE VIRAGE RESTE », pliée sous le bar ; déployée trois fois en soixante ans, toujours contre un rachat.
- **01.gege_voiture** — décor · brèves · Il n'a pas de voiture ; il a le car, au fond, et un cousin qui conduit.
- **01.gege_superstition** — légende · set-piece `gm_annonce` · Il ne regarde jamais le premier penalty ; il tourne le dos au terrain et lit la tribune Est ; « si Paulette sourit, c'est dedans ».
- **01.gege_repas** — décor · `en.kop.local` (existant) · Des merguez et trois bières ; la troisième est pour le père ; il ne la boit pas, il la pose sur le bar.
- **01.gege_ciseaux** — objet · `co.re.gege_decoupe` (existant) · Les ciseaux du local sont ceux du secrétariat, empruntés à Josiane en 1987 ; elle les a réclamés chaque année ; il les rendra à la petite Josiane en 2022.

### 9.8 Réaction propre
### RÉACTION co.re.gege_pardon  —  Pardon, en doré
**Après** : en.mbako.revient (← reviens) · **Famille** : conséquence immédiate · **Conditions** : `flag('mbako_vendu')`
**GÉGÉ** *(capo — sourire — un pot de peinture dorée, un pinceau)*
« « JUDAS » en doré, ça s'efface mal ; on a écrit « PARDON » par-dessus, en doré aussi. La tribune n'oublie rien, coach ; elle repeint. »
**Un bouton** : **C'est bien, Gégé** — effets : tribunes +, relation.mbako +1 — *La bâche dit « PARDON ». Dessous, on lit encore « JUDAS » quand il pleut. Le petit le sait.*

---

## 10. ANSELMO VAZ  (`loco`)
**Fonction** : entraîneur mystique · **Genre** : m · **Âge en 1990** : 45 · **Camp** : terrain · **Fenêtre** : 1990-2010 (entraîneur de D1 par intermittence ; le grand nom que le board veut pour janvier ; coach rival ; intouchable en 2010 sous un président qui le vénère : c'est sa dernière saison, et il ne veut pas la finir) ; il prend sa retraite en juin 2010, à soixante-cinq ans, et donne son seau ; conseiller intouchable ensuite, sans banc, jusqu'en 2025 ; il meurt en 2032, en regardant une cassette · **Suivant** : « le disciple au seau » (voix sans portrait : un jeune entraîneur qui s'assoit sur un seau sans savoir pourquoi, 2030+ ; c'est la blague finale)
**Tic** : « Regardez la cassette. » — torsions : « Vous n'avez pas regardé la cassette. » · « La cassette, c'est vous. » · « Il n'y a pas de cassette. Regardez quand même. »
**Désir** : qu'on le comprenne · **Blessure** : personne ne le comprend ; il s'assoit sur un seau parce que le banc est trop loin du terrain, et personne n'a jamais demandé pourquoi le banc était si loin
**Adresse** : entraineur : {prenom} / profesor / (il ne parle pas aux gens qu'il n'aime pas : à −1, la carte n'a pas de réplique, seulement une didascalie et le seau tourné) · autres : § 0.1
**Ce qu'il pense de toi** : à +2 « profesor, vous avez vu la cassette jusqu'au bout, on peut parler » ; à 0 « regardez la cassette » ; à −2 : il ne pense rien à voix haute ; il tourne le seau
**Paliers** : −3 → `co.loco.trahison_silence` · +3 → `co.loco.faveur_seau`
**Dans les rôles** : entraîneur : rival et tentateur (le grand nom pour janvier, l'espion, le banc d'en face ; 1 dès l'intérimaire) · DS : le coach intouchable (`coach_intouchable` : 2,5) · joueur : le coach qui te fait courir vingt kilomètres (1) · président : le postulat déblocable « Le coach-cassette » (30), et une cassette à la place d'une réunion (1) · sélectionneur : l'adversaire lointain (0,5)
**Trajectoire 1990 → 2050** : 1990-1999 · 45-54 ans, cheveux longs attachés, lunettes rondes, un survêtement d'une autre époque ; le seau ; Vogler est son adjoint un hiver (1993), et repart en courant · 2000-2009 · gris (1990 déjà) ; l'intouchable de 2010 se prépare : un président le vénère · 2010-2019 · lunettes déjà ; le coach intouchable ; « le modèle » qui note tout n'a pas de colonne pour le seau ; il refuse la vidéo (2014) : « j'ai la cassette » · 2020-2029 · canne (2020) qu'il refuse et remplace par le seau, qu'il porte ; retraite 2028 ; le seau est donné · 2030-2039 · meurt en 2039 ; la cassette qu'il regardait n'a jamais été identifiée · 2040-2050 · un disciple s'assoit sur un seau à Trébignac ; personne ne sait pourquoi
**Retrouvailles** : `co.retrouvailles.loco_sourire` / `_noir` / `_cassette`
**Cartes propres** : *La cassette de ton équipe* (01) · *Le seau, pas le banc* (01) · *Vingt kilomètres* (01) · *La cassette à la place de la réunion* (01) · *Profesor* (01) · *Vogler, l'hiver* (01) · *Le grand nom* (11, `en.grand_nom`) · *Le coach intouchable* (12) · *Le coach-cassette* (30, postulat dérivé)

### 10.1 Identité et place
Anselmo Vaz ; on dit « Vaz » avec l'accent qu'on veut, il ne corrige jamais ; « le mystique » dans la presse, « le type au seau » dans le virage. 45 ans en 1990, 55 en 2000, 65 en 2010, 75 en 2020, 85 en 2030, 94 à sa mort. **Portrait** : les cheveux longs gris attachés bas, les lunettes rondes cerclées, le survêtement bleu passé d'une équipe qu'on ne nomme pas, et le seau : blanc, retourné, posé à la limite de la zone technique. **Voix** : douce, lointaine, un accent qu'on ne place pas ; il parle par images et par silences ; il ne dit jamais « je ». Dans un club, il est partout sauf au bureau : sur le seau, dans la salle vidéo, dans la haie du voisin avec une caméra. Il vénère les joueurs qui courent ; il ignore ceux qui parlent.

**Désir / besoin / blessure / secret.** Désir : être compris, une fois, sans avoir à expliquer. Besoin : un banc plus près. Blessure : personne ne demande. Secret : la cassette qu'il regarde tout le temps est un match de jeunes de 1967 où il a été remplacé à la mi-temps ; il cherche encore ce qu'il a raté.

### 10.2 Les cinq registres
- **−3** — *(pas de réplique : le seau est tourné vers le terrain, il ne se retourne pas ; la didascalie dit : « il ne vous parle plus »)* / « Il n'y a pas de cassette pour vous. »
- **−2 / −1** — *(silence, le seau à demi tourné)* / « Vous n'avez pas regardé la cassette. »
- **0** — « Regardez la cassette. » / « Le banc est trop loin. Regardez la cassette, vous verrez pourquoi. »
- **+1 / +2** — « Profesor, la cassette de votre équipe est prête ; regardez-la avant moi. » / « Vous avez vu jusqu'au bout. Peu de gens voient jusqu'au bout. »
- **+3** — « Le seau est à vous, {prenom}. Il n'y a rien dedans ; c'est ce qu'il faut regarder. » / « La cassette, c'est vous. Je vous l'ai faite. »

### 10.3 Rapports avec les autres
**Alliés** : Fardelli (son agent, qui le vend comme un tableau : « il faut le regarder longtemps »), un président qui le vénère (2010 : le postulat `coach_intouchable`), Vukić (qui a regardé la cassette jusqu'au bout et n'a rien dit). **Rivaux** : Vogler (l'adjoint d'un hiver : « on court, on presse, on chante » ; Vaz ne chante pas et ne presse pas, il regarde), Corven (« le refuge des gens sans mémoire »), Brissac (« les chiffres sont têtus ; les cassettes aussi »). **Dettes** : il doit à Gégé de l'avoir raccompagné à sa voiture avec les jumelles ; Montoya lui doit trois titres qu'il a gagnés pour le Castel et qu'on a attribués au président. **Il aime** : Sacha, la seule qui lui ait demandé pourquoi le banc était loin ; il n'a pas répondu, il a souri.

### 10.4 INTRIGUE co.loco_cassette  —  La cassette
**Logline** : Anselmo Vaz regarde des cassettes et s'assoit sur un seau ; ce que tu comprends de lui décide s'il te parle, te fait courir, ou te donne le seau. · **Synopsis** : Entraîneur, il t'offre la cassette de ta propre équipe avant de te battre. DS, il veut un seau et le président veut un banc. Joueur, il te fait courir vingt kilomètres en regardant une cassette. Président, il t'envoie une cassette à la place de la réunion. Un jour il t'appelle profesor et explique le banc. Un hiver de 1993, Vogler est son adjoint, et vous êtes trois sur le terrain.
**Rôle(s)** : entraineur, ds, joueur, president · **Postulat(s)** : partagé (interimaire, coach_intouchable, six_mois, rachete_fonds, pepite) · **Porteur** : loco · **Cast** : loco, klopf, fardelli, vukic, gege, sacha · **Thème** : absurde
**Saisons** : "0" (cassette_equipe : entraîneur ; vingt_km : joueur), "1" (seau : DS ; reunion : président), "2+" (profesor, klopf_hiver 1993) · **Conditions d'entrée** : `chars.loco.statut != 'mort'` · **Exclusions** : `en.grand_nom` (11) la même saison · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `compris` → `loco_compris` (« {annee} : {prenom} {nom} a regardé la cassette de Anselmo Vaz jusqu'au bout. Il l'a appelé profesor. ») → lue par 12 (`coach_intouchable` : il te parle), 30 (postulat dérivé `le_coach_cassette` : débloqué si `loco_compris`), 90 (retrouvailles) · `seau` → `seau_loco` (objet héritable ; « {annee} : Anselmo Vaz a donné son seau à {prenom} {nom}. Il n'y avait rien dedans. ») → lue par 90 (lignée : objet), 30 (`en_retraite` plus : « un seau à côté du banc »), 31 · `banc` → `loco_banc_rapproche` (« {annee} : à {club}, on a rapproché le banc du terrain de trois mètres. Anselmo Vaz s'est assis dessus. ») → lue par 12 (le coach s'assoit : `coach_demission` moins probable), 20 (« LE BANC A BOUGÉ »)
**Séquencier** : cassette_equipe (entraîneur, S0, semaine d'un match contre son club) | vingt_km (joueur, S0, [3,10]) → seau (DS, S1+, [2,8]) | reunion (président, S1+) → profesor (S2+, `relation.loco >= 1`) → klopf_hiver (`year == 1993`, entraîneur) ; lecture croisée : cassette_equipe lit `espion_presse` (11).
**Épilogue** : rien : Vaz ne suit personne.

### SCÈNE en.loco.cassette_equipe  —  La cassette de ton équipe
**Rôle** : entraineur · **Intrigue** : co.loco_cassette · **Étape** : 1/6 · **Moment** : saison 0, semaine d'un match contre son club · **Lieu** : le parking du centre d'entraînement, une cassette VHS sur ton pare-brise (`year <= 2010` ; après : une clé) · **Conditions** : `chars.loco.statut == 'rival'` ; variante `_haie` si `flag('espion_presse')`
**VAZ** *(entraîneur adverse — neutre — assis sur son seau, près de ta voiture, sans explication)*
« C'est votre équipe, filmée depuis la haie, quarante minutes ; votre six ne regarde jamais derrière lui. Regardez la cassette ; moi je l'ai vue, dimanche on verra qui a compris. »
← **Je la regarde ce soir** — effets : force +2, direction −, relation.loco +1, set: cassette_regardee — *Quarante minutes. Il savait.*
→ **Je la jette, c'est espionner** — effets : tribunes +, relation.loco −2, relation.gege +1, set: cassette_jetee — *Gégé la récupère dans la poubelle. Il la regarde au local. Le virage sait avant toi que le six ne regarde pas derrière.*
**Traces** : cassette_regardee, cassette_jetee (« {annee} : {nom} a jeté la cassette de Vaz. Gégé l'a regardée au local. ») · **Réactions déclenchées** : en.re.gege_jumelles (11) · **Lu plus tard par** : 11 (`en.espion_haie` : variante « c'était Vaz »), 12 (le coach intouchable : il se souvient), co.loco.faveur_seau (variante)

### SCÈNE jp.loco.vingt_km  —  Vingt kilomètres
**Rôle** : joueur · **Intrigue** : co.loco_cassette · **Étape** : 1/6 (variante joueur) · **Moment** : saison 0, [3,10] · **Lieu** : le terrain d'entraînement, un magnétoscope sur une table pliante, une rallonge de cinquante mètres · **Conditions** : le coach du club est Vaz (`world.coach == 'loco'`)
**VAZ** *(entraîneur — neutre — il ne te regarde pas courir ; il regarde l'écran)*
« Vingt kilomètres ce matin, en regardant l'écran à chaque passage ; c'est votre match d'hier, et vous marchez à la soixante-dixième. Regardez la cassette, {prenom} ; courez en même temps. »
← **Je cours, je regarde** — effets : force +3, vestiaire −, relation.loco +1, set: vingt_km — *Vingt kilomètres. À la soixante-dixième de la cassette, tu cours plus vite. Il ne dit rien ; il rembobine.*
→ **Je cours sans regarder** — effets : force +1, tribunes +, relation.loco −1 — *Tu cours. Il éteint l'écran au dixième passage. Tu es sur le banc dimanche, et il ne te dit pas pourquoi ; Vukić, si.*
**Traces** : vingt_km (`journal:` poids 1) · **Réactions déclenchées** : — · **Lu plus tard par** : 10 (`jp.banc_hiver` variante « Vaz »), 30 (`jp_fils` plus : « Vaz t'a emmené, avec le seau »)

### SCÈNE ds.loco.seau  —  Le seau, pas le banc
**Rôle** : ds · **Intrigue** : co.loco_cassette · **Étape** : 2/6 · **Moment** : saison 1+, [2,8] · **Lieu** : le bord du terrain, le président debout, Vaz assis sur le seau, toi entre les deux · **Conditions** : `world.coach == 'loco'`
**VAZ** *(entraîneur — neutre — il tapote le seau)*
« Le président veut que je m'assoie sur le banc, pour la télévision ; le banc est à douze mètres du terrain, le seau à un. Regardez la cassette, directeur ; on y voit la distance. »
← **On rapproche le banc** — effets : direction −, vestiaire +, relation.loco +2, set: loco_banc_rapproche, outcome: banc — *Le banc bouge. Il s'assoit dessus, une fois, puis reprend le seau, à côté. La télévision filme les deux.*
→ **Le banc, c'est le contrat** — effets : direction +, relation.loco −2, set: loco_contrarie — *Il s'assoit sur le banc. Il ne dit plus rien pendant un mois, à personne. Le vestiaire joue moins bien ; il n'y a pas de cassette de ça.*
**Traces** : loco_banc_rapproche, loco_contrarie (« {annee} : Anselmo Vaz a été assis sur le banc, par contrat. Il n'a plus parlé pendant un mois. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 12 (`coach_demission` : poids selon `loco_contrarie`), 20 (« LE BANC A BOUGÉ »), 30 (`ds_fronde` plus)

### SCÈNE pr.loco.cassette_reunion  —  La cassette à la place de la réunion
**Rôle** : president · **Intrigue** : co.loco_cassette · **Étape** : 3/6 · **Moment** : saison 1+, [4,12] · **Lieu** : la salle du conseil, une chaise vide, une cassette sur la table à sa place · **Conditions** : `world.coach == 'loco'`
**VAZ** *(entraîneur — absent — Josiane pose la cassette et lit l'étiquette : « Regardez la cassette. »)*
« *(sur l'étiquette, de sa main)* Regardez la cassette ; tout ce que j'aurais dit à la réunion est dedans, et la réunion dure quatre-vingt-dix minutes de moins. »
← **On regarde, tous, maintenant** — effets : direction −, vestiaire +, relation.loco +1, set: conseil_cassette — *Le conseil regarde. C'est un match. À la fin, personne ne sait ce qu'il voulait dire ; Malbec, au téléphone, dit qu'entre présidents on se comprend, mais pas lui.*
→ **Je le convoque, en personne** — effets : direction +, relation.loco −1, set: loco_convoque — *Il vient. Il dit « regardez la cassette » et il part.*
**Traces** : conseil_cassette, loco_convoque (« {annee} : Anselmo Vaz convoqué au conseil. Il s'est assis par terre et n'a rien dit. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 13 (l'entraîneur qu'on vire ou qu'on confirme : variante Vaz), 30 (`pr_pantin`, `pr_fantome` plus)

### SCÈNE co.loco.profesor  —  Profesor
**Rôle** : entraineur, ds, joueur, president · **Intrigue** : co.loco_cassette · **Étape** : 4/6 · **Moment** : saison 2+, [3,12] · **Lieu** : le terrain vide, la nuit, le seau, et une chaise pliante qu'il a apportée pour toi · **Conditions** : `relation.loco >= 1`
**VAZ** *(entraîneur — sourire — il désigne le banc, à douze mètres, puis le terrain, à un)*
« Le banc est loin parce qu'en soixante-sept on m'a remplacé à la mi-temps et que j'ai compté les pas : douze mètres. Regardez la cassette, profesor ; c'est celle-là que je regarde. »
← **Montrez-la-moi** — effets : relation.loco +2, vestiaire +, set: loco_compris, outcome: compris — *Un match de jeunes, 1967, noir et blanc. Tu ne vois pas ce qu'il a raté ; lui non plus ; c'est ça.*
→ **Douze mètres, c'est la règle** — effets : relation.loco −1, direction + — *Il replie la chaise. Il ne dit plus « profesor ». Il dit « regardez la cassette », et c'est de nouveau la vôtre.*
**Traces** : loco_compris · **Réactions déclenchées** : co.re.sacha_seau (§ 19.8) · **Lu plus tard par** : 30 (postulat dérivé `le_coach_cassette`), 12 (le coach intouchable te parle), co.retrouvailles.loco_cassette

### SCÈNE en.loco.klopf_hiver  —  Vogler, l'hiver
**Rôle** : entraineur · **Intrigue** : co.loco_cassette · **Étape** : 5/6 · **Moment** : `year == 1993`, hiver, semaine d'un match contre son club · **Lieu** : le tunnel, Vaz sur le seau, Vogler debout derrière, casquette, qui court sur place · **Conditions** : `chars.loco.statut == 'rival'`
**VAZ** *(entraîneur adverse — neutre — il désigne Vogler du pouce sans se retourner)*
« Mon adjoint court, presse et chante ; il repartira au printemps, il ne regarde pas les cassettes. Regardez la cassette, coach ; regardez aussi lequel des deux vous voulez sur votre banc, un jour. »
← **Le seau, un jour** — effets : relation.loco +1, relation.klopf −1, force +1, set: loco_prefere — *Il hoche la tête. Vogler sourit et court encore. Vous perdez le match sur un pressing ; Vaz n'a rien vu, il regardait ailleurs.*
→ **La casquette, un jour** — effets : relation.klopf +1, relation.loco −1, tribunes +, set: klopf_prefere — *Vogler te serre la main avant le match, ce qui ne se fait pas. Vaz tourne le seau. Vous gagnez ; ils chantent quand même.*
**Traces** : loco_prefere, klopf_prefere (« {annee} : {prenom} {nom} a choisi la casquette contre le seau. Vogler a chanté ; Vaz a tourné le seau. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 11 (`en.grand_nom` : variante « tu avais choisi »), 12 (le coach que tu nommes : Vaz ou Vogler), 13 (l'entraîneur qu'on confirme)

### 10.5 Les paliers
### SCÈNE co.loco.trahison_silence  —  Le seau tourné
**Rôle** : entraineur, ds, joueur, president · **Intrigue** : palier −3 · **Étape** : on_relation −3 · **Moment** : programmé en [1,3] · **Lieu** : le bord du terrain, le seau tourné vers le terrain, son dos vers toi · **Conditions** : `relation.loco <= -3`, une fois par carrière
**VAZ** *(entraîneur — noir — il ne parle pas ; la didascalie est toute la carte)*
« *(Il ne vous parle plus. Il ne vous parlera plus. Sur le seau, une cassette, sans étiquette ; c'est la vôtre, et il ne l'a pas regardée.)* »
← **Je prends la cassette** — effets : vestiaire −−, direction −, set: loco_silence — *Tu la prends. Elle est vierge. C'est le seul message qu'il t'enverra jamais.*
→ **Je prends la cassette** — effets : vestiaire −−, direction −, set: loco_silence — *Tu la prends. Elle est vierge. C'est le seul message qu'il t'enverra jamais.*
**Traces** : loco_silence (« {annee} : Anselmo Vaz a cessé de parler à {nom}. Il lui a laissé une cassette vierge. ») · **Lu plus tard par** : 12 (`coach_demission` : il part sans un mot), 30 (`ds_fronde`), 90 (Nemesis : le seul Nemesis muet)

### SCÈNE co.loco.faveur_seau  —  Le seau
**Rôle** : entraineur, ds, joueur, president · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : le bord du terrain, il se lève du seau, ce qu'on ne l'a jamais vu faire pendant un match · **Conditions** : `relation.loco >= 3`, une fois par carrière
**VAZ** *(entraîneur — sourire — il retourne le seau, montre qu'il est vide, le pose devant toi)*
« Il n'y a rien dedans, c'est ce qu'il faut regarder ; on m'a demandé pendant trente ans ce qu'il y avait dedans. Le seau est à vous, {prenom} ; regardez la cassette, elle est aussi à vous. »
← **Je m'assois dessus** — effets : vestiaire ++, tribunes +, relation.loco +1, set: seau_loco, outcome: seau — *Tu t'assois. À un mètre du terrain, on entend les consignes. On entend aussi les insultes ; il ne l'avait pas dit.*
→ **Gardez-le, profesor** — effets : relation.loco +1, direction + — *Il se rassoit. Il le donnera à Sacha, ou au disciple, ou à personne. Il n'y a rien dedans.*
*(Variante si `flag('cassette_regardee')` : « Vous avez regardé la première. Voilà la dernière chose à regarder. »)*
**Traces** : seau_loco (objet héritable) · **Lu plus tard par** : 90 (lignée : objet), 30 (`en_retraite` plus, postulat `le_coach_cassette`), 31

### 10.6 Les retrouvailles
### SCÈNE co.retrouvailles.loco_sourire  —  La chaise pliante
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les deux meilleures relations · **Lieu** : le bord du terrain du nouveau club, une chaise pliante et un seau
**VAZ** *(sa fonction du moment — sourire — il a apporté la chaise pliante et le seau)*
« Nouveau club, même distance, j'ai mesuré : douze mètres, ils sont tous à douze mètres. Regardez la cassette, profesor ; j'en ai fait une de votre nouveau six. »
**OK** **Je regarde, ce soir** — effets : force +1, relation.loco +1 — *Le nouveau six regarde derrière lui. C'est déjà ça. Il rembobine quand même.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.loco_noir  —  Rien
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les pires relations · **Lieu** : le bord du terrain, ta première séance, un seau tourné
**VAZ** *(sa fonction du moment — noir — le seau tourné, dans un stade qui n'est pas le sien)*
« *(Il est venu. Il s'est assis sur le seau au bord de votre terrain, dos à vous, pendant votre première séance. Il n'a rien dit. Il est reparti à la fin, sans la cassette.)* »
**OK** **Je le laisse partir** — effets : vestiaire − — *Il part. C'est tout.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.loco_cassette  —  1967
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : 2039, une fois (`chars.loco.statut == 'mort' || (chars.loco.statut == 'parti' && flag('loco_mort'))`) · **Conditions** : `flag('loco_compris')` · **Lieu** : un bureau d'agente, un magnétoscope qu'on ne trouve plus, branché quand même
**SOLVANG** *(agente, elle a repris le carnet de Fardelli en 2018 et Vaz avec — neutre — une cassette VHS et un magnétoscope qu'on ne trouve plus)*
« Il regardait ça quand c'est arrivé : un match de jeunes de soixante-sept, et il est remplacé à la mi-temps. Mon client décidait ; moi, je compte : la cassette est à vous, sans facture. »
← **Je la prends** — effets : vestiaire +, relation.loco +1 (posthume), set: cassette_1967 — *Tu la regardes une dernière fois. Tu vois ce qu'il a raté : rien. C'est ce qu'il fallait regarder.*
→ **Elle va au Panthéon** — effets : tribunes +, direction + — *Elle est sous vitrine. Personne ne peut la regarder. Il aurait détesté ; ou pas.*
**Traces** : cassette_1967 (objet héritable ; « 2039 : la cassette de 1967 de Anselmo Vaz est allée à {prenom} {nom}. Il n'y avait rien à voir ; c'est ce qu'il fallait regarder. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (lignée : objet), 31 (épitaphe d'enterrement de Vaz)

### 10.7 Anecdotes
- **01.loco_seau** — objet (héritable) · `co.loco.faveur_seau` · Le seau est un seau de peinture blanc de dix litres, propre ; il en a usé quatorze en trente ans ; il garde le premier chez lui, à douze mètres de la télévision.
- **01.loco_voiture** — décor · brèves · Il ne conduit pas ; Fardelli le fait conduire ; il regarde une cassette sur un écran portable à l'arrière, même quand il n'y a pas d'écran.
- **01.loco_superstition** — légende · set-piece `gm_annonce` · Il ne se lève jamais pendant un match, même pour un but ; la seule fois, c'est le seau qu'il a donné.
- **01.loco_repas** — décor · toute scène d'hôtel · Il mange debout, du pain et des olives, devant l'écran ; « le repas, c'est douze mètres de trop ».
- **01.loco_cassette_1967** — objet · retrouvailles · La cassette est un transfert d'un film de famille ; il l'a fait copier douze fois ; toutes les copies ont le même défaut à la 45e, qu'il prend pour un signe.

---

## 11. VOGLER  (`klopf`)
**Fonction** : entraîneur à casquette · **Genre** : m · **Âge en 1990** : 38 · **Camp** : terrain · **Fenêtre** : 1990-2027 (adjoint de Vaz un hiver, 1993 ; entraîneur de D1 dès 1995 ; sélectionneur de la Vestrie 2004-2016 ; l'entraîneur que tout le monde veut 2017-2027 ; retraité 2027 à soixante-quinze ans, un mois après le vote de la limite d'âge, qui ne le concernait pas : il court encore) ; il meurt en 2038 en courant, sur un tapis · **Suivant** : aucun : Vogler dure ; sa suite est son « collègue », le mot qu'il donne à tous
**Tic** : « On court, on presse, on chante. » — torsions : « On court, on presse, et ce soir on ne chante pas. » · « On a couru, on a pressé ; on a perdu en chantant. » · « Toi, tu cours. Moi, je chante. »
**Désir** : le pressing comme une religion · **Blessure** : il a perdu trois finales de suite (1999, 2000, 2001) en souriant ; on lui a reproché le sourire plus que les défaites
**Adresse** : entraineur : {prenom} / coach / collègue · autres : § 0.1 (« collègue » est son mot noir : il le dit à ceux qu'il ne respecte pas, en souriant)
**Ce qu'il pense de toi** : à +2 « tu cours avec nous ; c'est rare chez un adversaire » ; à 0 « on verra au pressing » ; à −2 « collègue, ton six marche »
**Paliers** : −3 → `co.klopf.trahison_collegue` · +3 → `co.klopf.faveur_chant`
**Dans les rôles** : entraîneur : rival (le derby gagné, l'adjoint de Vaz ; 1) · sélectionneur : adversaire (la Vestrie 2004-2016 ; 1,5) · président : cœur (l'entraîneur que tout le monde veut ; 1) · DS : cœur (il exige un latéral gauche ; 1,5) · joueur : le coach qui te fait presser (0,5)
**Trajectoire 1990 → 2050** : 1990-1999 · 38-47 ans, casquette verte, sourire, un dentier parfait ; l'hiver chez Vaz (1993) ; premier banc de D1 (1995, Valentienne) ; trois finales perdues · 2000-2009 · gris sous la casquette (1997), personne ne le voit ; sélectionneur de la Vestrie dès 2004 : le pressing des casquettes · 2010-2019 · lunettes (2007) qu'il enlève pour les photos ; Vestrie jusqu'en 2016 ; puis « tout le monde le veut » : il choisit le club qui chante le plus fort · 2020-2029 · canne (2027) : « on court moins, on presse quand même » ; retraite 2031 · 2030-2039 · il commente en courant sur un tapis, en direct, chez Vence · 2040-2050 · meurt en 2047 sur le tapis, en souriant ; on ne sait pas s'il a gagné
**Retrouvailles** : `co.retrouvailles.klopf_sourire` / `_noir` / `_tapis`
**Cartes propres** : *Le derby gagné* (01) · *Le latéral gauche* (01) · *La Vestrie en face* (01) · *Tout le monde le veut* (01) · *La troisième finale* (01) · *La casquette* (01) · *Vogler, l'hiver* (§ 10) · *Le coach que tu nommes* (12)

### 11.1 Identité et place
On ne connaît pas son prénom ; il dit « Vogler » en se présentant, et « collègue » en te présentant. 38 ans en 1990, 48 en 2000, 58 en 2010, 68 en 2020, 78 en 2030, 95 à sa mort. **Portrait** : la casquette (verte, puis aux couleurs du club, puis de la Vestrie), le sourire trop blanc, la barbe blonde puis blanche, le survêtement zippé jusqu'au menton. **Voix** : forte, chantante, un accent du Nord qu'il exagère ; il ponctue par des claques dans le dos. Dans un club, il est partout, en courant : il fait l'échauffement avec les joueurs, il presse le président dans le couloir, il chante avec le virage après la victoire. Il ne s'assoit pas.

**Désir / besoin / blessure / secret.** Désir : que tout le monde court ; que le pressing soit une chanson. Besoin : gagner une finale, une seule. Blessure : trois finales, trois sourires. Secret : il ne sait pas chanter ; il bouge les lèvres ; les joueurs l'ont compris depuis 1995 et chantent plus fort pour couvrir.

### 11.2 Les cinq registres
- **−3** — « Collègue, j'ai pris ton adjoint et ton latéral gauche ; ils courent, maintenant. » / « On court, on presse, on chante, et toi tu regardes. »
- **−2 / −1** — « Collègue, ton six marche. On court, on presse ; on va le voir marcher. » / « On chante après. Toi, tu commentes après. »
- **0** — « On court, on presse, on chante. Tu viens courir avec nous, coach ? » / « Un latéral gauche, directeur. Pas un droit qui joue à gauche : un gauche. »
- **+1 / +2** — « {prenom}, ta gauche est belle ; je te la prends si tu ne la fais pas courir. » / « On a perdu, et mes joueurs ont chanté ton nom. C'est rare ; note-le. »
- **+3** — « La finale, on l'a perdue tous les deux, en souriant. On court, on presse, on chante ; viens chanter, une fois. » / « Je te donne ma casquette. Elle n'a jamais gagné de finale ; elle a tout le reste. »

### 11.3 Rapports avec les autres
**Alliés** : Solvang (son agente, qui compte pendant qu'il court), Rouvier (elle siffle la fin de ses entraînements ; il obéit, en riant), Fauvel (« un groupe, pas une liste » : Vogler dit « un chœur »). **Rivaux** : Vaz (le seau contre la casquette : deux religions), Vukić (qui ne chante pas), Bréhaut (« le groupe vit bien » : « le groupe court mal »). **Dettes** : il doit à Ilyas un salaire de la Vestrie ; Malbec lui doit une élection (il a fait voter les entraîneurs). **Il aime** : Dembo, qui ne défend pas, et qu'il fait presser quand même, par amour.

### 11.4 INTRIGUE co.klopf_pressing  —  On court, on presse, on chante
**Logline** : Vogler gagne le derby en souriant, exige un latéral gauche, perd trois finales, et finit par te donner sa casquette. · **Synopsis** : Entraîneur, il te bat au derby et t'embrasse. DS, il veut un gauche, pas un droit qui joue à gauche. Sélectionneur, sa Vestrie presse tes Cobalts. Président, tout le monde le veut et Solvang t'appelle. Après une finale perdue, il t'explique le sourire. Un jour un joueur veut une casquette.
**Rôle(s)** : entraineur, ds, selectionneur, president · **Postulat(s)** : partagé (promu, interimaire, vendre_trente, apres_fiasco, rachete_fonds) · **Porteur** : klopf · **Cast** : klopf, solvang, dembo, rouvier, loco · **Thème** : vestiaire
**Saisons** : "0" (derby), "1" (lateral, vestrie 2004-2016), "2+" (tout_le_monde 2017+, troisieme_finale, casquette) · **Conditions d'entrée** : `chars.klopf.statut != 'mort'` · **Exclusions** : `co.derby` (11) la même semaine · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `lateral` → `klopf_lateral` (« {annee} : Vogler a eu son latéral gauche. Un gauche, pas un droit qui joue à gauche. ») → lue par 12 (le mercato d'hiver : il en veut un deuxième), 20 (« UN GAUCHE, UN VRAI »), 30 (`ds_architecte` plus) · `finale` → `klopf_trois_finales` (monde ; « 2001 : troisième finale perdue pour Vogler. Il a souri. On lui a reproché le sourire. ») → lue par 31 (Nouvelle 2001), 14 (l'adversaire qui sourit), 02 (Vence : « le sourire ») · `casquette` → `casquette_klopf` (objet héritable ; « {annee} : Vogler a donné sa casquette à {prenom} {nom}. Elle n'avait jamais gagné de finale. ») → lue par 90 (lignée : objet), 30 (`en_retraite` plus)
**Séquencier** : derby (entraîneur, S0, semaine du derby si son club est {rival}) → lateral (DS, fenêtre de mercato) → vestrie (sélectionneur, `year in 2004..2016`) → tout_le_monde (président, `year >= 2017`) → troisieme_finale (tous, `year >= 2001`, après une finale perdue) → casquette (entraîneur, S2+, absurde)
**Épilogue** : rien.

### SCÈNE en.klopf.derby  —  Le derby gagné
**Rôle** : entraineur · **Intrigue** : co.klopf_pressing · **Étape** : 1/6 · **Moment** : saison 0, après le derby si `derby_perdu` · **Lieu** : le rond central, il traverse en courant pour t'embrasser · **Conditions** : `chars.klopf.statut == 'rival' && flag('derby_perdu')`
**VOGLER** *(entraîneur de {rival} — sourire — la casquette à l'envers, il te serre trop fort)*
« On a couru, on a pressé, on a chanté, et ton six a marché à la soixantième ; je l'ai vu de mon banc, collègue. Viens courir avec nous jeudi, ou reste, et regarde. »
← **Je viens courir jeudi** — effets : vestiaire −, force +2, relation.klopf +2, tribunes −, set: couru_avec_klopf — *Jeudi, chez eux, en survêtement. Gégé l'apprend. Le virage comprend mal ; le six court plus vite le dimanche suivant.*
→ **On se revoit au retour** — effets : tribunes +, relation.klopf −1, set: revanche_klopf — *Il rit. Il chante ton nom en s'éloignant ; ses joueurs reprennent. C'est le pire chant de la vallée.*
**Traces** : couru_avec_klopf, revanche_klopf (« {annee} : {prenom} {nom} a promis la revanche à Vogler. Vogler a chanté. ») · **Réactions déclenchées** : en.re.gege_jumelles (11, variante : « tu as couru chez eux ») · **Lu plus tard par** : 11 (`co.derby` retour : variante « la revanche »), § 9 (Gégé : « chez eux, jeudi »), 20 (« IL A COURU CHEZ L'ENNEMI »)

### SCÈNE ds.klopf.lateral  —  Le latéral gauche
**Rôle** : ds · **Intrigue** : co.klopf_pressing · **Étape** : 2/6 · **Moment** : fenêtre de mercato, [1,3] du sous-paquet · **Lieu** : ton bureau, il est entré en courant, il repart en courant · **Conditions** : `world.coach == 'klopf'`
**VOGLER** *(entraîneur — neutre — il tapote une feuille : un seul nom, un seul poste)*
« Un latéral gauche, directeur, un vrai, pas un droit qui regarde son pied. On court, on presse, on chante ; sans gauche, on chante faux, et j'ai trois millions de moins que Solvang demande. »
← **Le gauche, à son prix** — effets : caisse −−, vestiaire ++, relation.klopf +2, relation.solvang +1, set: klopf_lateral, outcome: lateral — *Il signe. Il court dès le lendemain. Solvang compte ; Vialat écrit une lettre en mars.*
→ **Un droit qui joue à gauche** — effets : caisse +, vestiaire −, relation.klopf −2, set: klopf_sans_gauche — *Le droit joue à gauche. Il regarde son pied. Vogler sourit sur le banc, et c'est le sourire des finales.*
**Traces** : klopf_lateral, klopf_sans_gauche (« {annee} : Vogler n'a pas eu son gauche. Il a souri toute la saison ; le vestiaire a compris. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 12 (mercato d'hiver), 20, 30 (`ds_rate` plus)

### SCÈNE sl.klopf.vestrie  —  La Vestrie en face
**Rôle** : selectionneur · **Intrigue** : co.klopf_pressing · **Étape** : 3/6 · **Moment** : `year in 2004..2016`, la veille d'un match Cobalts-Vestrie · **Lieu** : le hall de l'hôtel, il fait son footing dans le couloir · **Conditions** : —
**VOGLER** *(sélectionneur de la Vestrie — sourire — la casquette aux couleurs de la Vestrie, en sueur)*
« Onze casquettes demain, elles courent, elles pressent, elles chantent, et vos vingt-six ont dormi dans un hôtel de sponsor. Collègue, dis-moi juste une chose : ton six a couru cette semaine ? »
← **Il a couru, tu verras** — effets : force +1, relation.klopf +1, tribunes + — *Le six court. Il presse même. La Vestrie gagne quand même, sur un coup de pied arrêté ; Vogler n'y croit pas, il chante.*
→ **Pas un mot à l'adversaire** — effets : force −1, relation.klopf −1, direction + — *Il rit. Il court jusqu'à sa chambre. Le lendemain, la Vestrie presse ton six pendant quatre-vingt-dix minutes ; il marche à la soixantième.*
**Traces** : — (`journal:` poids 2) · **Réactions déclenchées** : — · **Lu plus tard par** : 14 (chaîne Tournoi : « Vogler en face »), 20 (« LES CASQUETTES ONT PRESSÉ »)

### SCÈNE pr.klopf.tout_le_monde  —  Tout le monde le veut
**Rôle** : president · **Intrigue** : co.klopf_pressing · **Étape** : 4/6 · **Moment** : `year >= 2017`, Bilan, quand l'entraîneur est à confirmer ou à virer · **Lieu** : ton bureau ; Solvang au téléphone, Vogler sur le parking, en train de courir · **Conditions** : `world.coach != 'klopf'`
**VOGLER** *(entraîneur libre — sourire — il passe devant la fenêtre en courant, deux fois)*
« Tout le monde me veut, président, et je choisis le club qui chante le plus fort ; ton virage chante juste. On court, on presse, on chante : tu vires l'autre, ou tu me laisses passer ? »
← **Je vire l'autre, tu signes** — effets : tribunes ++, direction −, caisse −−, relation.klopf +2, set: coach_vire, char: {klopf: {statut: club}} — *L'autre reçoit un SMS à 23 h 47, avec une faute. Vogler signe à 8 h. Il court jusqu'au centre d'entraînement.*
→ **L'autre reste, va courir** — effets : direction +, relation.klopf −1, set: klopf_refuse — *Il court ailleurs. Le club d'à côté chante plus fort en septembre. C'est le tien qui chante faux.*
**Traces** : coach_vire (13), klopf_refuse (« {annee} : {prenom} {nom} a laissé passer Vogler. Il a signé à côté, et à côté chante fort. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 13 (l'entraîneur qu'on vire : la chaîne), 12 (le coach que tu nommes), 20 (« VOGLER SIGNE À {VILLE} »)

### SCÈNE co.klopf.troisieme_finale  —  La troisième finale
**Rôle** : entraineur, selectionneur, president · **Intrigue** : co.klopf_pressing · **Étape** : 5/6 · **Moment** : `year >= 2001`, après une finale perdue (Coupe, Continental, tournoi) · **Lieu** : le vestiaire vide, il est venu te voir, chez toi, avec deux bières · **Conditions** : `flag('grand_match_perdu') && relation.klopf >= 0`
**VOGLER** *(entraîneur — sourire — la casquette sur les genoux, pour une fois)*
« J'ai perdu trois finales de suite en souriant et on m'a reproché le sourire, jamais les buts. On court, on presse, on chante ; on perd aussi, collègue, et tu as le droit de sourire ce soir. »
← **Je souris avec toi** — effets : vestiaire +, tribunes −, relation.klopf +2, set: klopf_trois_finales, outcome: finale — *Vous souriez. Vous n'avez pas ri ; vous avez souri.*
→ **Pas ce soir, Vogler** — effets : relation.klopf −1, direction + — *Il remet la casquette. Il ne dit rien. Il te laisse les deux bières ; il ne boit pas, tu le savais.*
**Traces** : klopf_trois_finales (monde) · **Réactions déclenchées** : — · **Lu plus tard par** : 31 (Nouvelle 2001), 14 (l'après-tournoi : variante « Vogler est venu »), 02 (Vence), 30 (`sl_ennemi` plus : « il a souri »)

### SCÈNE en.klopf.casquette  —  La casquette
**Rôle** : entraineur · **Intrigue** : co.klopf_pressing · **Étape** : 6/6 · **Moment** : saison 2+, [3,12] (thème absurde) · **Lieu** : le vestiaire, un joueur avec une casquette verte, à l'envers · **Conditions** : `relation.klopf >= 1 || flag('couru_avec_klopf')`
**VOGLER** *(entraîneur — sourire — au téléphone, en courant : on entend ses pas)*
« Ton six porte une casquette depuis qu'il a couru avec nous, et le vestiaire en veut onze ; je te les envoie. On court, on presse, on chante : avec ou sans casquettes, tu choisis. »
← **Onze casquettes, on court** — effets : vestiaire ++, tribunes −, force +1, relation.klopf +1, set: onze_casquettes — *Onze casquettes vertes à l'entraînement. Gégé demande si c'est une blague. Ce n'est pas une blague ; ils pressent.*
→ **Une seule, hors entraînement** — effets : vestiaire +, direction +, relation.klopf −1 — *Le six garde la sienne. Il la met sur le banc. Il regarde son pied gauche, par habitude.*
**Traces** : onze_casquettes (`journal:` poids 1) · **Réactions déclenchées** : co.re.gege_decoupe (existant, si Une) · **Lu plus tard par** : 20 (Écho, « Au local » : « onze casquettes »), 31 (anecdote de décor)

### 11.5 Les paliers
### SCÈNE co.klopf.trahison_collegue  —  Collègue
**Rôle** : entraineur, ds, president · **Intrigue** : palier −3 · **Étape** : on_relation −3 · **Moment** : programmé en [1,3] · **Lieu** : le parking, ton adjoint monte dans sa voiture, ton latéral gauche aussi · **Conditions** : `relation.klopf <= -3`, une fois par carrière
**VOGLER** *(entraîneur adverse — noir, mais il sourit : c'est son noir — il tient la portière)*
« J'ai pris ton adjoint et ton gauche, collègue ; ils voulaient courir, chez toi on marche. On court, on presse, on chante ; toi, tu regardes partir. »
← **Je regarde partir** — effets : vestiaire −−−, force −2, set: klopf_a_pris — *Ils partent. Ils chantent dans la voiture. Ton six, sur le parking, regarde son pied.*
→ **Je regarde partir** — effets : vestiaire −−−, force −2, set: klopf_a_pris — *Ils partent. Ils chantent dans la voiture. Ton six, sur le parking, regarde son pied.*
**Traces** : klopf_a_pris (« {annee} : Vogler a pris l'adjoint et le latéral gauche de {nom}. Ils ont chanté dans la voiture. ») · **Lu plus tard par** : 90 (Nemesis Vogler : il te prend un joueur par saison), 30 (`en_bus` plus), 12 (le mercato : un gauche à racheter)

### SCÈNE co.klopf.faveur_chant  —  Ton nom, chanté par eux
**Rôle** : entraineur, selectionneur, president · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : le tunnel, après un match que tu as gagné contre lui ; ses joueurs chantent · **Conditions** : `relation.klopf >= 3`, une fois par carrière
**VOGLER** *(entraîneur adverse — sourire — la casquette à la main, il fait signe à ses joueurs de continuer)*
« Ils chantent ton nom, mes joueurs, après une défaite ; je leur ai demandé, ils ont dit oui. On court, on presse, on chante, {prenom} ; ce soir on chante toi. »
← **Je vais les remercier** — effets : tribunes ++, vestiaire ++, relation.klopf +1, set: chante_par_klopf — *Tu entres dans leur vestiaire. Ils chantent plus fort. Vogler bouge les lèvres ; tu vois qu'il ne chante pas ; tu ne le diras jamais.*
→ **Fais-les taire, c'est gênant** — effets : direction +, relation.klopf −1 — *Il les fait taire. Il remet la casquette. « Collègue », dit-il, en souriant ; c'est la première fois qu'il te le dit.*
**Traces** : chante_par_klopf (« {annee} : les joueurs de Vogler ont chanté le nom de {prenom} {nom} après leur défaite. Vogler bougeait les lèvres. ») · **Lu plus tard par** : 20 (« CHANTÉ PAR L'ENNEMI »), 14 (l'après-tournoi), 90 (mémoire des clubs +1 chez lui)

### 11.6 Les retrouvailles
### SCÈNE co.retrouvailles.klopf_sourire  —  Le footing
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les deux meilleures relations · **Lieu** : le tour du nouveau stade, six heures du matin
**VOGLER** *(sa fonction du moment — sourire — il t'attend devant ton nouveau stade, en tenue, à six heures)*
« Nouveau club, même heure, six heures, on court autour du stade avant que le président arrive. On court, on presse, on chante, {prenom} ; tu viens, ou tu as pris du ventre ? »
**OK** **Je cours** — effets : force +1, relation.klopf +1, vestiaire + — *Trois tours. Il chante au deuxième. Le président arrive à six heures et demie ; il vous voit ; il ne comprend pas ; il apprécie.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.klopf_noir  —  Collègue
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les pires relations · **Lieu** : le tunnel du nouveau stade ; il ne court pas
**VOGLER** *(sa fonction du moment — noir, souriant — il ne court pas, c'est le signe)*
« Collègue, on se retrouve ; j'ai regardé ton nouveau six, il marche déjà. On court, on presse, on chante ; toi, tu changes de club. »
**OK** **Je change de six aussi** — effets : force +1, relation.klopf +1 — *Tu changes. Il note. Il te dit « coach » la fois d'après ; c'est un progrès.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.klopf_tapis  —  Le tapis de course
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : après 2031, une fois · **Conditions** : `relation.klopf != 0` · **Lieu** : le plateau de Télé-Stade, un tapis de course, en direct
**VOGLER** *(retraité, consultant sur un tapis de course, en direct — voix à la télé — on entend le tapis)*
« Je commente en courant, contrat de Vence, et ce soir je commente toi : ton équipe presse, chante, et marche à la soixantième. On court, on presse, on chante, collègue ; tu cours encore ? »
← **Je cours encore, Vogler** — effets : tribunes +, relation.klopf +1 — *Il accélère le tapis. Vence s'inquiète en direct. Il sourit ; c'est le sourire des finales.*
→ **J'éteins la télé** — effets : direction +, relation.klopf −1 — *Tu éteins. Il continue ; il ne sait pas que tu as éteint ; il chante.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### 11.7 Anecdotes
- **01.klopf_casquette** — objet (héritable) · `co.klopf.faveur_chant`, `casquette_klopf` · La casquette verte d'origine (1990) n'a jamais été lavée non plus ; elle a le sel de trois finales.
- **01.klopf_voiture** — décor · brèves · Il court entre le centre et le stade ; sa voiture est conduite par Solvang, qui compte.
- **01.klopf_superstition** — légende · set-piece `gm_annonce` · Il fait dix pompes dans le tunnel avant chaque match ; onze en finale ; il en a fait trente-trois pour rien.
- **01.klopf_repas** — décor · toute scène · Des bananes et de l'eau ; « on court, on presse, on mange après ».
- **01.klopf_levres** — légende · `co.klopf.faveur_chant` · Il ne sait pas chanter et bouge les lèvres ; en 2035, Vence le révèle en direct ; il rit ; le pays chante pour lui pendant une semaine.

---

## 12. NADIA ROUVIER  (`rouvier`)
**Fonction** : kiné · **Genre** : f · **Âge en 1990** : 30 · **Camp** : terrain · **Fenêtre** : 1990-2050 (kiné de {club} 1990-2001, kiné des Cobalts 2002-2014, cabinet à Saint-Étoile ensuite ; elle est encore là en 2050, à quatre-vingt-dix ans, elle dit « respire » à la petite-fille de Paulette) · **Suivant** : « la kiné d'après » (voix sans portrait, 2015+, formée chez elle ; elle siffle aussi)
**Tic** : « Respire. Encore. » — torsions : « Respire. Pas encore. » · « Tu ne respires plus ; c'est bien ça, le problème. » · « Je respire. Encore. Pour deux. »
**Désir** : ouvrir son cabinet · **Blessure** : elle voit ce que le Doc cache et ne peut rien dire ; elle a signé une clause de confidentialité en 1990, Josiane lui a dit de la lire, elle ne l'a pas lue
**Adresse** : entraineur : {prenom} / coach / {pg, select, f{madame} other{monsieur}} {nom} · joueur : {prenom} / petit / {nom} · autres : § 0.1
**Ce qu'elle pense de toi** : à +2 « tu écoutes ton corps ; je te dirai ce que le Doc ne dit pas » ; à 0 « respire, on verra » ; à −2 « tu as prolongé l'entraînement après mon sifflet ; le genou du petit, c'est toi »
**Paliers** : −3 → `co.rouvier.trahison_dossier` · +3 → `co.rouvier.faveur_ce_que_le_doc_cache`
**Dans les rôles** : joueur : la seconde voix (le genou, l'infiltration ; 1,5) · entraîneur : cœur (le sifflet du kiné, le stage commando ; 1) · sélectionneur : chœur (le stage à l'hôtel du sponsor ; 1) · DS : messagère (les huit kilos du carnaval ; 1) · président : le ruban du cabinet (0,5) · instance : témoin (0,5)
**Trajectoire 1990 → 2050** : 1990-1999 · 30-39 ans, cheveux courts, blouse blanche sur survêtement, le sifflet au cou ; elle siffle la fin ; elle voit · 2000-2009 · gris (2005) ; kiné des Cobalts (2002-2014) : l'hôtel du sponsor, les tables dans le hall · 2010-2019 · lunettes (2015) ; le cabinet à Saint-Étoile (2015), à côté de celui de Camille ; elle dit enfin ce que le Doc cachait, au moins à ses patients · 2020-2029 · canne (2025) ; elle refuse : « je respire, encore » · 2030-2050 · elle forme la kiné d'après ; en 2050, elle est la dernière du casting de 1990 encore debout ; l'écran-bilan du siècle la cite
**Retrouvailles** : `co.retrouvailles.rouvier_sourire` / `_noir` / `_cabinet`
**Cartes propres** : *Respire* (01) · *Le sifflet* (01) · *Le stage commando* (01) · *L'hôtel du sponsor* (01) · *Huit kilos* (01) · *Le cabinet* (01) · *Le genou à vingt ans* (10, `jp.genou_20`, seconde voix) · *La pharmacie* (10-11, `co.pharmacie`, variante « elle sait »)

### 12.1 Identité et place
Nadia Rouvier ; « Nadia » pour les joueurs, « Rouvier » pour le coach, « la petite » pour Sabatier jusqu'en 2010, ce qu'elle lui fait payer avec les mains. 30 ans en 1990, 40 en 2000, 50 en 2010, 60 en 2020, 70 en 2030, 90 en 2050. **Portrait** : les cheveux courts noirs puis gris, la blouse blanche ouverte sur un survêtement, le sifflet en métal au cou, les mains larges. **Voix** : basse, calme, un ordre par phrase ; elle ne crie qu'avec le sifflet. Au club, elle est la table d'à côté : celle où l'on ne parle pas, où l'on respire ; elle siffle la fin d'un entraînement que le coach veut prolonger, et le coach obéit parce que le sifflet du kiné est le seul que les joueurs écoutent.

**Désir / besoin / blessure / secret.** Désir : son nom sur une porte. Besoin : dire ce qu'elle voit. Blessure : la clause non lue. Secret : elle tient un carnet elle aussi, en face de celui du Doc ; le sien note ce qu'elle a vu ; il a plus de lignes.

### 12.2 Les cinq registres
- **−3** — « La Commission a mon carnet, monsieur {nom} ; il a plus de lignes que celui du Doc. Respire. Encore, tant que tu peux. » / « Tu as prolongé après mon sifflet. Le genou, c'est toi. »
- **−2 / −1** — « Respire. Pas encore : tu n'as pas mérité l'encore. » / « Le Doc te dira ce qu'il veut. Moi, je masse. »
- **0** — « Respire. Encore. Le genou dit quelque chose ; le Doc dit autre chose. » / « Je siffle à dix-huit heures, coach. Après, ils sont à moi. »
- **+1 / +2** — « {prenom}, la piqûre du Doc, c'est le match de dimanche et six mois après. Respire, et réfléchis. » / « Huit kilos de carnaval, et il peut jouer si tu me le laisses trois semaines. »
- **+3** — « Ce que le Doc cache, c'est dans mon carnet ; je te le lis, une fois. Respire. Encore. » / « Le cabinet ouvre lundi. Ton nom est sur la liste des patients ; c'est un honneur, tu sais. »

### 12.3 Rapports avec les autres
**Alliés** : Sabatier (le pacte des deux tables : elle voit, il cache, ils se respectent), Camille (deux cabinets côte à côte en 2015), Vecchio (l'épaule de 1991 : elle a dit non à Sabatier, personne ne l'a su), Vogler (il obéit au sifflet). **Rivaux** : Fardelli (qui demande les radios), Vaz (qui prolonge tout et ne siffle jamais), Brissac (« les chiffres sont têtus ; les muscles aussi »). **Dettes** : Dembo lui doit huit kilos ; Mbako lui doit un genou entier. **Elle craint** : Amsel, qui lui demandera le carnet.

### 12.4 INTRIGUE co.rouvier_sifflet  —  Le sifflet du kiné
**Logline** : Nadia Rouvier voit ce que le Doc cache ; elle siffle la fin, elle refuse le stage commando, elle masse dans le hall d'un hôtel de sponsor, et un jour elle ouvre son cabinet. · **Synopsis** : Joueur, elle est la seconde voix contre la piqûre. Entraîneur, elle siffle la fin de ta séance. Tu veux un stage commando ; elle refuse. Sélectionneur, le stage est à l'hôtel du sponsor et les tables sont dans le hall. DS, Dembo a huit kilos de carnaval. En 2015, elle ouvre le cabinet et te demande de couper le ruban, ou non.
**Rôle(s)** : joueur, entraineur, selectionneur, ds, president · **Postulat(s)** : partagé · **Porteur** : rouvier · **Cast** : rouvier, sabatier, dembo, klopf, camille, nassir · **Thème** : corps
**Saisons** : "0" (respire : joueur ; sifflet : entraîneur), "1" (commando, hotel_sponsor, huit_kilos), "2+" (cabinet 2015+) · **Conditions d'entrée** : `chars.rouvier.statut in [club, staff]` · **Exclusions** : `co.pharmacie` la même saison · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `sifflet` → `sifflet_kine` (objet héritable ; « {annee} : Nadia Rouvier a sifflé la fin. {prenom} {nom} a obéi ; le vestiaire a noté. ») → lue par 90 (lignée : objet), 30 (`en_bus` plus : « elle avait sifflé »), 11 (`bus_menace` contre-alarme) · `commando_refuse` → `stage_commando_refuse` (« {annee} : pas de stage commando à {club}. La kiné a dit non ; le coach a dit d'accord. ») → lue par 14 (le stage des Cobalts), 20 (« PAS DE COMMANDO ») · `cabinet` → `rouvier_cabinet` (« {annee} : le cabinet Rouvier ouvre à Saint-Étoile. {prenom} {nom} a coupé le ruban / n'est pas venu{pg, select, f{e} other{}}. ») → lue par 30 (le corps après 60 ans : « tu vas chez Rouvier »), 04 (Camille : le cabinet d'à côté), 90
**Séquencier** : respire (joueur, S0, lit `infiltre`) | sifflet (entraîneur, S0, [3,9]) → commando (entraîneur, S1, [2,8]) → hotel_sponsor (sélectionneur, fenêtre de juin, `year in 2002..2014`) → huit_kilos (DS, [1,6], `chars.dembo.statut == 'club'`) → cabinet (`year >= 2015`, tous)
**Épilogue** : `vestiaire −` ; « {annee} : la kiné est restée à {club}. Le sifflet aussi. »

### SCÈNE jp.rouvier.respire  —  Respire
**Rôle** : joueur · **Intrigue** : co.rouvier_sifflet · **Étape** : 1/6 · **Moment** : saison 0, [4,12], après `jp.corps.infiltration` si elle a été jouée · **Lieu** : la table d'à côté, la porte fermée · **Conditions** : `flag('genou') || flag('infiltre')`
**ROUVIER** *(kiné — neutre — les mains sur le genou, elle ne regarde pas le genou, elle te regarde)*
« La piqûre du Doc, c'est dimanche et six mois de tribune après ; le repos, c'est trois dimanches et une carrière. Respire. Encore, petit, et dis-moi lequel tu veux. »
← **Trois dimanches** — effets : tribunes −, force +3, relation.rouvier +2, relation.sabatier −1, set: genou_ecoute — *Trois dimanches. Le Doc ne dit rien ; il souligne dans son carnet. Elle souligne dans le sien.*
→ **Dimanche, je respire après** — effets : tribunes +, force −2, relation.rouvier −1, set: infiltre — *Tu joues. Tu ne sens rien. Elle t'attend à la table le lundi ; elle ne dit rien ; elle masse plus fort.*
**Traces** : genou_ecoute (10), infiltre (∃) · **Réactions déclenchées** : — · **Lu plus tard par** : 10 (`jp.genou_20`, `jp.genou_parle` : elle est la seconde voix), 30 (`jp_sansclub` plus : « le genou avait raison »)

### SCÈNE en.rouvier.sifflet  —  Le sifflet
**Rôle** : entraineur · **Intrigue** : co.rouvier_sifflet · **Étape** : 1/6 (variante entraîneur) · **Moment** : saison 0, [3,9] · **Lieu** : le terrain, dix-huit heures, tu voulais un dernier exercice · **Conditions** : —
**ROUVIER** *(kiné — neutre — le sifflet déjà dans la bouche ; elle siffle avant de parler)*
« Dix-huit heures, j'ai sifflé, ils sont à moi ; ton dernier exercice, c'est deux ischios demain. Respire. Encore, coach, et laisse-les rentrer. »
← **Ils rentrent, tu as sifflé** — effets : vestiaire ++, force −1, relation.rouvier +2, set: sifflet_kine, outcome: sifflet — *Ils rentrent. Ils l'ont vue siffler le coach. Ils l'écoutent plus que toi ; c'est utile, plus tard.*
→ **Dix minutes, moi le coach** — effets : force +2, vestiaire −, relation.rouvier −2, set: sifflet_ignore — *Dix minutes. Un ischio le lendemain. Elle ne dit pas « je l'avais dit » ; elle le note.*
**Traces** : sifflet_kine, sifflet_ignore (« {annee} : {prenom} {nom} a prolongé après le sifflet du kiné. Un ischio le lendemain. ») · **Réactions déclenchées** : co.re.klopf_sifflet (§ 12.8) · **Lu plus tard par** : 11 (`bus_menace` : contre-alarme « elle siffle »), 30 (`en_bus` plus), 90 (objet)

### SCÈNE en.rouvier.commando  —  Le stage commando
**Rôle** : entraineur · **Intrigue** : co.rouvier_sifflet · **Étape** : 2/6 · **Moment** : saison 1, [2,8] · **Lieu** : ton bureau, un prospectus d'un centre de « préparation extrême » · **Conditions** : `gauges.vestiaire >= 60 || relation.aulard >= 1`
**ROUVIER** *(kiné — neutre — le prospectus déchiré en deux, posé bien à plat)*
« Le stage commando, c'est quatre jours dans la boue et trois blessés en septembre ; je l'ai vu, à Néville, en quatre-vingt-sept. Respire. Encore, coach, et trouve autre chose pour souder un groupe. »
← **Pas de commando, d'accord** — effets : vestiaire +, direction −, force −1, relation.rouvier +2, set: stage_commando_refuse, outcome: commando_refuse — *Vous faites un stage de pêche. Le groupe vit bien ; personne n'est blessé.*
→ **Le commando, ça forge** — effets : vestiaire ++, force +2, relation.rouvier −2, set: stage_commando, schedule: [{card: en.rouvier.commando_blesses, in: [4,8]}] — *Quatre jours de boue. Le groupe chante. En septembre, trois ischios ; elle les soigne sans un mot.*
**Traces** : stage_commando_refuse, stage_commando (« {annee} : stage commando à {club}. Trois ischios en septembre ; la kiné avait dit non. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 14 (le stage des Cobalts : « pas de commando » ou « encore »), 20 (« PAS DE COMMANDO » / « TROIS ISCHIOS »), `en.rouvier.commando_blesses` (chaîne, à écrire par 11 : trois blessés, une sortie)

### SCÈNE sl.rouvier.hotel_sponsor  —  L'hôtel du sponsor
**Rôle** : selectionneur · **Intrigue** : co.rouvier_sifflet · **Étape** : 3/6 · **Moment** : fenêtre de juin, la veille du stage du tournoi · **Lieu** : le hall d'un hôtel de sponsor, trois tables de massage entre les plantes vertes · **Conditions** : `year in 2002..2014`
**ROUVIER** *(kiné des Cobalts — neutre — elle a posé sa table à côté d'une fontaine)*
« Le sponsor a mis les tables dans le hall pour les photos, et les joueurs se font masser devant les clients. Respire. Encore, coach ; ou tu dis au sponsor que les corps ne sont pas des photos. »
← **Les tables vont en chambre** — effets : caisse −, vestiaire ++, relation.rouvier +2, relation.nassir −1, set: tables_montees — *Les tables montent. Le sponsor souffle. Ilyas dit que ce n'est pas une équipe, c'est un actif ; elle répond qu'un actif a des ischios.*
→ **Les photos, c'est le contrat** — effets : caisse +, vestiaire −, relation.rouvier −2, set: tables_hall — *Les joueurs se font masser entre deux plantes. Fauvel refuse. Il est massé dans sa chambre par personne ; il boite en poules.*
**Traces** : tables_montees, tables_hall (« {annee} : les tables de massage des Cobalts dans le hall du sponsor. Fauvel a refusé ; il a boité. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 14 (le stage, l'avion des primes), 02 (Ilyas), 20 (« MASSÉS ENTRE LES PLANTES »)

### SCÈNE ds.rouvier.huit_kilos  —  Huit kilos
**Rôle** : ds · **Intrigue** : co.rouvier_sifflet · **Étape** : 4/6 · **Moment** : saison 1+, [1,6], à la reprise · **Lieu** : la salle de pesée, Dembo sur la balance, le regard ailleurs · **Conditions** : `chars.dembo.statut == 'club'`
**ROUVIER** *(kiné — neutre — elle note le chiffre sans le dire à voix haute)*
« Huit kilos de carnaval ; il joue dans trois semaines si tu me le laisses, le coach le veut samedi, le président le vend lundi. Respire. Encore, directeur ; décide avant qu'il respire, lui. »
← **Trois semaines, il est à toi** — effets : vestiaire +, direction −, relation.rouvier +2, relation.dembo +1, set: dembo_trois_semaines — *Trois semaines. Il perd sept kilos et gagne un ami. Il marque à la quatrième ; il lui dédie le but, elle n'aime pas ça.*
→ **Vendu lundi, avec les kilos** — effets : caisse ++, vestiaire −, relation.rouvier −1, relation.dembo −2, set: dembo_vendu — *Vendu. La visite médicale de l'acheteur ne pèse personne. Il marque contre toi en octobre, huit kilos plus léger.*
**Traces** : dembo_trois_semaines, dembo_vendu (12) · **Réactions déclenchées** : — · **Lu plus tard par** : 13 (Dembo : `co.dembo_ballon`), 12 (le mercato d'été), 20 (« HUIT KILOS ET UN ALLER SIMPLE »)

### SCÈNE co.rouvier.cabinet  —  Le cabinet
**Rôle** : tous · **Intrigue** : co.rouvier_sifflet · **Étape** : 5/6 · **Moment** : `year >= 2015`, [2,10], une fois · **Lieu** : une rue de Saint-Étoile, une porte neuve, un ruban, une paire de ciseaux · **Conditions** : `chars.rouvier.statut != 'mort'`
**ROUVIER** *(kiné, cabinet — sourire — les ciseaux tendus, ceux de Josiane, empruntés)*
« Le cabinet ouvre lundi, mon nom est sur la porte, et le ruban attend quelqu'un qui a un genou à me devoir. Respire. Encore, {prenom} ; tu coupes, ou tu m'envoies des fleurs ? »
← **Je coupe** — effets : tribunes +, relation.rouvier +2, relation.camille +1, set: rouvier_cabinet, outcome: cabinet — *Tu coupes. Camille est là ; son cabinet est à côté. Léa fait une photo pour L'Écho ; Massenet n'est pas venu.*
→ **Des fleurs, j'ai match** — effets : direction +, relation.rouvier −1, set: rouvier_fleurs — *Les fleurs arrivent. Elle les met dans la salle d'attente. Elle coupe le ruban avec Vecchio, qui a apporté une orange.*
**Traces** : rouvier_cabinet, rouvier_fleurs (« {annee} : des fleurs pour le cabinet Rouvier. {prenom} {nom} avait match ; Gigi a coupé le ruban. ») · **Réactions déclenchées** : co.re.camille_journal (existant) · **Lu plus tard par** : 30 (le corps après 60 ans), § 4 (Camille), 20 (Écho, « Au local »)

### SCÈNE co.rouvier.carnet_lu  —  Le carnet d'en face (sixième scène)
**Rôle** : entraineur, selectionneur, instance · **Intrigue** : co.rouvier_sifflet · **Étape** : 6/6 · **Moment** : saison 2+, [4,12] · **Lieu** : la table d'à côté, la porte fermée, un carnet à couverture rouge · **Conditions** : `relation.rouvier >= 2 && flag('sabatier_secret')`
**ROUVIER** *(kiné — sourire — le carnet ouvert à une page qu'elle a choisie)*
« Le Doc a son carnet, j'ai le mien, et le mien dit ce qu'il n'a pas refusé ; il y a une ligne sur ton club, l'an dernier. Respire. Encore, coach ; je te la lis si tu la veux. »
← **Lis-la** — effets : vestiaire −, direction −, relation.rouvier +1, relation.sabatier −1, set: rouvier_a_parle — *Elle lit. Un joueur, une date, un produit qui n'était « pas encore » interdit. Tu ne dors pas ; elle, si, pour la première fois depuis 1990.*
→ **Garde-la, tu as une clause** — effets : relation.rouvier −1, relation.sabatier +1, direction + — *Elle referme. Elle la trouvera vide de sens.*
**Traces** : rouvier_a_parle (« {annee} : Nadia Rouvier a lu une ligne de son carnet à {prenom} {nom}. Le Doc ne l'avait pas refusée, celle-là. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 15 (commission antidopage : « la kiné a un carnet »), 10-11 (`co.pharmacie` variante « elle sait »), § 3 (Sabatier : `in.sabatier.temoin` variante)

### 12.5 Les paliers
### SCÈNE co.rouvier.trahison_dossier  —  Le carnet rouge à la Commission
**Rôle** : joueur, entraineur, selectionneur, ds · **Intrigue** : palier −3 · **Étape** : on_relation −3 · **Moment** : programmé en [1,3] · **Lieu** : la salle de soins, la table vide, le sifflet posé dessus · **Conditions** : `relation.rouvier <= -3`, une fois par carrière
**ROUVIER** *(kiné — noir — elle ne masse plus ; elle range)*
« Mon carnet est à la Commission depuis ce matin, avec les dates où tu as prolongé après mon sifflet et les genoux qui ont suivi. Respire. Encore, monsieur {nom} ; tant que tu peux. »
← **Je prends le sifflet** — effets : vestiaire −−, direction −−, set: carnet_rouvier_transmis — *Tu le prends. Il ne siffle pas ; il faut savoir. Les joueurs regardent le sifflet dans ta main ; ils ne rentrent pas.*
→ **Je prends le sifflet** — effets : vestiaire −−, direction −−, set: carnet_rouvier_transmis — *Tu le prends. Il ne siffle pas ; il faut savoir. Les joueurs regardent le sifflet dans ta main ; ils ne rentrent pas.*
**Traces** : carnet_rouvier_transmis (« {annee} : le carnet rouge de Nadia Rouvier à la Commission. Les dates, les genoux, le sifflet ignoré. ») · **Lu plus tard par** : 15 (fede_dossier), 11 (commission de discipline), 20 (« LA KINÉ A PARLÉ »), 90 (Nemesis)

### SCÈNE co.rouvier.faveur_ce_que_le_doc_cache  —  Ce que le Doc cache
**Rôle** : joueur, entraineur, selectionneur · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : la table d'à côté, la lumière éteinte, sa voix seulement · **Conditions** : `relation.rouvier >= 3`, une fois par carrière
**ROUVIER** *(kiné — sourire — elle parle bas ; on entend le camphre arriver dans le couloir)*
« Le contrôle de jeudi, le Doc le sait depuis lundi et ne te l'a pas dit, parce qu'il gère ; moi je te le dis, ce n'est pas à lui de gérer ton nom. Respire. Encore, {prenom}, et sois propre jeudi. »
← **Propre jeudi, merci Nadia** — effets : vestiaire +, direction +, parole +1, relation.rouvier +1, set: pharmacie_propre — *Jeudi, le contrôleur trouve le bon bâtiment du premier coup. L'armoire est vide depuis lundi. Le Doc et elle ne se parlent pas pendant un mois ; puis si.*
→ **Le Doc gère, j'ai confiance** — effets : relation.sabatier +1, relation.rouvier −1, direction + — *Il gère. Ça passe. Elle range le sifflet ce soir-là ; elle le ressort le lendemain, elle a réfléchi.*
**Traces** : pharmacie_propre (∃) · **Lu plus tard par** : 10-11 (`co.pharmacie`), 15, 30 (trait Intègre)

### 12.6 Les retrouvailles
### SCÈNE co.retrouvailles.rouvier_sourire  —  La table d'à côté, ailleurs
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les deux meilleures relations · **Lieu** : la salle de soins du nouveau club, sa table pliante dépliée
**ROUVIER** *(sa fonction du moment — sourire — elle a apporté sa propre table, pliée)*
« J'ai suivi, avec la table ; le kiné d'ici a une table qui grince, je l'ai entendue du parking. Respire. Encore, {prenom} ; tu as toujours le dos de quatre-vingt-quatorze. »
**OK** **Allonge-moi** — effets : force +1, relation.rouvier +1 — *Vingt minutes. Le dos de 1994 est toujours là. Elle aussi.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.rouvier_noir  —  Le sifflet rangé
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les pires relations · **Lieu** : le terrain, dix-huit heures, sans sifflet
**ROUVIER** *(sa fonction du moment — noir — sans sifflet au cou, pour la première fois)*
« Je ne siffle plus pour toi, monsieur {nom} ; ici, le coach prolonge, et je laisse faire, c'est son ischio. Respire. Encore, ou pas ; ce n'est plus à moi de le dire. »
**OK** **Remets le sifflet, j'écoute** — effets : relation.rouvier +1, vestiaire + — *Elle le remet. C'est un début.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.rouvier_cabinet  —  Quatre-vingt-dix ans
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : 2050, une fois, à l'écran-bilan du siècle · **Conditions** : `chars.rouvier.statut != 'mort'` · **Lieu** : le cabinet Rouvier, Saint-Étoile, 2050
**ROUVIER** *(kiné, cabinet, 90 ans — sourire — les mains toujours larges)*
« Je suis la dernière de quatre-vingt-dix debout, et je masse encore, la petite-fille de Paulette, le dos de tout le monde. Respire. Encore ; c'est tout ce que j'ai appris, et ça suffit. »
← **Je respire** — effets : — — *Tu respires. Encore. C'est la fin du siècle ; ça suffit.*
→ **Je respire** — effets : — — *Tu respires. Encore. C'est la fin du siècle ; ça suffit.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### 12.7 Anecdotes
- **01.rouvier_sifflet** — objet (héritable) · `en.rouvier.sifflet` · Un sifflet en métal de 1985, celui de son premier club, cabossé par un tacle ; il ne siffle qu'une note, la bonne.
- **01.rouvier_voiture** — décor · brèves · Une petite voiture blanche avec une table pliante sur le toit ; « la table voyage mieux que moi ».
- **01.rouvier_superstition** — légende · toute scène · Elle ne masse jamais le pied gauche en premier ; « le gauche, c'est celui qui décide ».
- **01.rouvier_repas** — décor · `sl.rouvier.hotel_sponsor` · Elle mange après tout le monde, debout, ce que les joueurs ont laissé ; Fauvel lui garde toujours une assiette.
- **01.rouvier_carnet_rouge** — objet · `co.rouvier.carnet_lu` · Le carnet rouge a trois cent quarante lignes en 2015 ; le Doc n'en a que trente-deux ; elle n'a jamais compté les siennes à voix haute.

### 12.8 Réactions propres
### RÉACTION co.re.rouvier_thermos  —  Le thermos
**Après** : co.sabatier.flacon_velo (← je le garde) · **Famille** : tiers qui commente · **Conditions** : `relation.rouvier >= 0`
**ROUVIER** *(kiné — neutre — elle lave le thermos du Doc, sans qu'on le lui ait demandé)*
« Il t'a parlé du vélo ; il ne l'avait dit qu'à moi, et à sa table. Respire. Encore, coach ; maintenant tu sais ce qu'il refusera, et ce qu'il ne dira pas. »
**Un bouton** : **Je sais, Nadia** — effets : relation.rouvier +1, vestiaire + — *Elle range le thermos. Le Doc le retrouvera propre. Il ne demandera pas qui.*

### RÉACTION co.re.klopf_sifflet  —  Le sifflet et la casquette
**Après** : en.rouvier.sifflet (← ils rentrent) · **Famille** : tiers qui commente · **Conditions** : `relation.klopf >= 0 && chars.klopf.statut == 'rival'`
**VOGLER** *(entraîneur adverse — sourire — au téléphone, essoufflé)*
« On m'a dit que ta kiné siffle la fin et que tu obéis ; chez moi aussi, collègue, c'est la même. On court, on presse, on chante, et à dix-huit heures on rentre. »
**Un bouton** : **Même sifflet, même heure** — effets : relation.klopf +1, vestiaire + — *Il raccroche en chantant. Elle a entendu. Elle ne sourit pas ; elle note.*

---

## 13. DEMBO  (`dembo`)
**Fonction** : avant-centre · **Genre** : m · **Âge en 1990** : 24 · **Camp** : terrain · **Fenêtre** : joueur 1990-2009 (star qui ne défend pas ; vendu à Al-Dorado ou mis au loft ; l'avant-centre des Cobalts qui ne chante pas l'hymne), consultant 2010-2014, ruiné 2015, entraîneur de Corbelin de 2020 à sa mort ; il meurt en 2046, sur le banc des Ardoises, aimé, sans un sou · **Suivant** : dans le monde, le prodige d'avant devient le prodige d'après : Noa Vandel (§ 6) est « le Dembo de 2020 » ; Dembo le dit lui-même
**Tic** : « Donne-moi le ballon, je m'occupe du reste. » — torsions : « Donne-moi le ballon. Le reste, on verra. » · « On m'a donné le ballon. Personne ne s'est occupé du reste. » · « Donne-moi le micro, je m'occupe du reste. »
**Désir** : marquer, être aimé, dormir tard · **Blessure** : il a été le prodige de quelqu'un ; on l'a vendu à 17 ans (Bretagne, l'usine, 1983) et il ne l'a pas digéré ; il déteste Mbako de l'aimer
**Adresse** : entraineur : {prenom} / coach / patron (ironique) · joueur : {prenom} / {prenom} / {nom} · autres : § 0.1
**Ce qu'il pense de toi** : à +2 « donne-moi le ballon, je marque pour toi » ; à 0 « je marque, tu défends » ; à −2 « patron, tu m'as vendu ou mis au loft ; c'est pareil, j'ai dormi tard »
**Paliers** : −3 → `co.dembo.trahison_micro` · +3 → `co.dembo.faveur_ballon`
**Dans les rôles** : joueur : rival et cœur (le tireur de penalty, le yacht ; 1,5) · entraîneur : cœur (la star qui ne défend pas, les huit kilos ; 1,5) · DS : l'actif (60 millions d'Al-Dorado ; 1,5) · président : la star qu'on vend ou qu'on met au loft (1) · sélectionneur : celui qui ne chante pas l'hymne (1) · tous, 2010+ : le consultant, le ruiné, le coach de Corbelin (0,5)
**Trajectoire 1990 → 2050** : 1990-1999 · 24-33 ans, dreadlocks courtes, sourire, un maillot toujours sorti du short ; le penalty, le yacht loué, l'hymne muet · 2000-2009 · 34-43 ans ; Al-Dorado (2005-2008) ou le loft ; retraite 2009 · 2010-2019 · gris (2011) ; consultant chez Vence (« donne-moi le micro ») ; ruiné en 2015 : le yacht, le cousin, le restaurant ; il vend le ballon du match de 1996 · 2020-2029 · lunettes (2021) qu'il refuse pour la télé ; entraîneur de Corbelin de 2020 jusqu'à sa mort, les ultras poètes lui écrivent des vers · 2030-2039 · canne (2041) ; il dort tard ; il entraîne encore, il donne des ballons aux gamins de Corbelin · 2040-2050 · meurt en 2046, entraîneur de Corbelin depuis vingt-six ans ; Corbelin peint un poème sur les ardoises ; il finissait par « le reste »
**Retrouvailles** : `co.retrouvailles.dembo_sourire` / `_noir` / `_corbeaux`
**Cartes propres** : *Le penalty, le yacht* (01) · *Il ne défend pas* (01) · *Le loft* (01) · *L'hymne muet* (01) · *Donne-moi le micro* (01) · *Corbelin* (01) · *Soixante millions* (12) · *Huit kilos* (§ 12) · *Le coéquipier rival* (10)

### 13.1 Identité et place
Dembo ; un nom, pas de prénom qu'il ait accepté (« Dembo, c'est le nom qu'on scande ; le prénom, c'est celui que ma mère criait, il est à elle »). 24 ans en 1990, 34 en 2000, 44 en 2010, 54 en 2020, 64 en 2030, 80 à sa mort. **Portrait** : les dreadlocks courtes puis rasées, le sourire large, le maillot hors du short, une montre trop grosse qu'il enlève pour jouer et oublie dans le vestiaire. **Voix** : chaude, moqueuse, traînante ; il rit avant la fin de ses phrases ; il appelle tout le monde « patron », le président comme le gardien de but. Au club, il est le but : il marque, il ne défend pas, il dort tard, il est aimé ; il prend le penalty de Bréhaut, le poste de Mbako, le ballon de tout le monde. Il ne chante pas l'hymne ; il ne dit jamais pourquoi.

**Désir / besoin / blessure / secret.** Désir : marquer et qu'on l'aime pour ça, le même soir. Besoin : dormir jusqu'à onze heures sans qu'on le lui reproche. Blessure : dix-sept ans, l'usine, un aller simple ; personne n'a demandé s'il voulait. Secret : il ne chante pas l'hymne parce qu'il n'en connaît pas les paroles ; il a appris le foot dans un pays sans télé ; il a honte de la honte.

### 13.2 Les cinq registres
- **−3** — « Patron, tu m'as vendu à dix-sept ans, pardon, tu m'as vendu comme à dix-sept ans ; je le dis au micro ce soir. » / « Donne le ballon à qui tu veux. Je m'occupe du micro. »
- **−2 / −1** — « Patron, je défends si tu m'aimes. Tu ne m'aimes pas. » / « Le loft, c'est où ? Je dors tard, de toute façon. »
- **0** — « Donne-moi le ballon, je m'occupe du reste. Le penalty aussi. » / « Je ne chante pas l'hymne, coach. Ne demande pas. »
- **+1 / +2** — « {prenom}, je défends dimanche. Une fois. Pour toi, pas pour le tableau. » / « Le yacht est loué ; j'ai une place pour toi et le reste du vestiaire. »
- **+3** — « Je joue blessé dimanche, patron, et je marque. Donne-moi le ballon, je m'occupe du reste, et du reste du reste. » / « Voilà le ballon du match. Je le donne à personne, d'habitude. »

### 13.3 Rapports avec les autres
**Alliés** : Vogler (qui le fait presser par amour), Rouvier (huit kilos, trois semaines), Gégé (le virage l'aime : il marque), Fauvel (qui chante pour deux, sans demander). **Rivaux** : Mbako (le prodige d'après : « on m'a vendu à dix-sept, toi à seize, tu as un an de moins à digérer »), Bréhaut (le penalty), Ilyas (« un actif qui dort tard »). **Dettes** : il doit à Fardelli le yacht, à Vence le micro, à Corbelin un poème. **Il aime** : Sacha, qui lui a demandé pourquoi il ne chantait pas, et à qui il a répondu.

### 13.4 INTRIGUE co.dembo_ballon  —  Donne-moi le ballon
**Logline** : Dembo marque, ne défend pas, ne chante pas, dort tard, prend le micro, perd tout, et finit entraîneur d'un club de ville morte dont les ultras écrivent des poèmes. · **Synopsis** : Joueur, il te prend le penalty et t'invite sur un yacht. Entraîneur, il ne défend pas. Président, tu le vends ou tu le mets au loft. Sélectionneur, il ne chante pas l'hymne. Consultant, il te descend ou te sauve au micro ; ruiné, il te demande un prêt. Coach de Corbelin, il est sur le banc d'en face, et les corbeaux chantent.
**Rôle(s)** : joueur, entraineur, president, selectionneur, ds, instance · **Postulat(s)** : partagé (pepite, fin_de_contrat, six_mois, rachete_fonds, apres_fiasco, vendre_trente) · **Porteur** : dembo · **Cast** : dembo, brehaut, mbako, fauvel, vence, rouvier, fardelli · **Thème** : vestiaire
**Saisons** : "0" (penalty : joueur ; ne_defend_pas : entraîneur), "1" (loft : président ; hymne : sélectionneur), "2+" (micro 2010-2015 ; corbelin 2020+) · **Conditions d'entrée** : `chars.dembo.statut` selon l'étape · **Exclusions** : `ds.rouvier.huit_kilos` la même saison · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `loft` → `dembo_loft` (« {annee} : Dembo au loft, avec les jeunes. Il a dormi tard ; il a marqué à la reprise. ») → lue par 12 (le mercato : « il est au loft, il vaut moins »), 20 (« LA STAR AU LOFT »), 30 (`pr_fantome` plus) · `hymne` → `dembo_hymne_muet` (« {annee} : Dembo n'a pas chanté l'hymne. Le sélectionneur a dit / n'a pas dit pourquoi. ») → lue par 14 (`hymne_impose`), 20 (« IL N'A PAS CHANTÉ »), 19 (Sacha : « moi non plus ») · `ruine` → `dembo_ruine` (« 2015 : Dembo ruiné. Le yacht, le cousin, le restaurant ; {prenom} {nom} a prêté / n'a pas prêté. ») → lue par 31 (Nouvelle 2015), 13 (Corbelin : il te doit), 90 (retrouvailles)
**Séquencier** : penalty (joueur, S0, [3,10]) | ne_defend_pas (entraîneur, S0, [4,12]) → loft (président, S1+, [2,9]) → hymne (sélectionneur, fenêtre de juin) → micro (tous, `year in 2010..2015`) → corbelin (entraîneur, `year >= 2020`) ; lecture croisée : loft lit `dembo_vendu` (12) ; micro lit `special` (10).
**Épilogue** : rien : Dembo suit le ballon.

### SCÈNE jp.dembo.penalty  —  Le penalty, le yacht
**Rôle** : joueur · **Intrigue** : co.dembo_ballon · **Étape** : 1/6 · **Moment** : saison 0, [3,10] · **Lieu** : la surface, le point, l'arbitre qui attend, Bréhaut qui regarde · **Conditions** : `chars.dembo.statut == 'club'`
**DEMBO** *(avant-centre — sourire — le ballon déjà sous le bras, il te parle en marchant)*
« Le penalty, c'est moi, c'est écrit nulle part mais c'est moi ; et samedi j'ai loué un yacht, tu as une place. Donne-moi le ballon, je m'occupe du reste, {prenom} : du penalty, et du yacht. »
← **Le ballon, et le yacht** — effets : vestiaire ++, tribunes −, caisse −, relation.dembo +2, set: yacht_dembo — *Il marque. Camille demande à quelle heure.*
→ **Je tire, tu regardes** — effets : relation.dembo −2, force +1, rand: [{p: 0.5, tribunes: "++"}, {tribunes: "−−", vestiaire: "−"}] — *Tu tires. Il regarde, bras croisés. Si tu rates, il ne dit rien ; c'est pire que s'il parlait.*
**Traces** : yacht_dembo (« {annee} : le yacht de Dembo était un bateau de pêche. {prenom} {nom} y était, jusqu'à deux heures. ») · **Réactions déclenchées** : co.re.camille_journal (existant, variante « il y avait un bateau ») · **Lu plus tard par** : 10 (`co.mbako_rival` : Mbako jaloux du yacht), 20 (« LE YACHT DE PORTCLAIR »), 30 (`jp_porteparole` plus : « l'aile de poulet, c'était sur le bateau »)

### SCÈNE en.dembo.ne_defend_pas  —  Il ne défend pas
**Rôle** : entraineur · **Intrigue** : co.dembo_ballon · **Étape** : 1/6 (variante entraîneur) · **Moment** : saison 0, [4,12] · **Lieu** : la salle vidéo, l'image arrêtée sur lui, immobile, pendant que l'adversaire contre · **Conditions** : `chars.dembo.statut == 'club'`
**DEMBO** *(avant-centre — neutre — il regarde l'image de lui-même avec tendresse)*
« Sur l'image je ne défends pas, c'est vrai, et à l'autre bout je marque deux fois, c'est vrai aussi. Donne-moi le ballon, coach, je m'occupe du reste ; le reste, c'est les dix autres. »
← **Marque ; les dix défendent** — effets : vestiaire −, tribunes ++, force +1, relation.dembo +2, set: dembo_libre — *Il marque. Les dix autres courent. Bréhaut dit que le groupe vit bien, et regarde ses jambes.*
→ **Tu défends, ou tu t'assois** — effets : vestiaire +, tribunes −, relation.dembo −2, set: dembo_banc — *Il s'assoit. Il dort sur le banc, pour de vrai. Le stade chante son nom à la 60e ; il entre, il marque, il ne défend pas.*
**Traces** : dembo_libre, dembo_banc (« {annee} : Dembo sur le banc pour ne pas avoir défendu. Il a dormi, puis marqué. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 12 (`dembo_vendu` : le prix monte s'il est libre), 11 (`en.brassard_brehaut` variante « les dix autres »), 30 (`en_copain` plus)

### SCÈNE pr.dembo.loft  —  Le loft
**Rôle** : president · **Intrigue** : co.dembo_ballon · **Étape** : 2/6 · **Moment** : saison 1+, [2,9] · **Lieu** : ton bureau ; Fardelli au téléphone, Dembo sur le canapé, endormi, puis pas · **Conditions** : `chars.dembo.statut == 'club'`
**DEMBO** *(avant-centre — sourire — il se réveille pile pour parler)*
« Al-Dorado offre le triple, et le loft avec les jeunes m'attend si je refuse ; j'ai dormi, patron, j'ai tout entendu. Donne-moi le ballon, ou donne-moi le loft, je m'occupe du reste. »
← **Le loft, avec les jeunes** — effets : caisse −, vestiaire +, tribunes +, relation.dembo −1, set: dembo_loft, outcome: loft — *Le loft. Vialat écrit.*
→ **Al-Dorado, le triple** — effets : caisse +++, tribunes −−, relation.dembo +1, set: dembo_vendu, char: {dembo: {statut: vendu}} — *Il part. Il t'envoie une photo d'une piscine, la nuit. Il ne dort plus tard ; il ne dort plus du tout.*
**Traces** : dembo_loft, dembo_vendu (12) · **Réactions déclenchées** : — · **Lu plus tard par** : 12, 20, 30 (`pr_fantome` plus, `jp_exil` : il t'y accueille)

### SCÈNE sl.dembo.hymne  —  L'hymne muet
**Rôle** : selectionneur · **Intrigue** : co.dembo_ballon · **Étape** : 3/6 · **Moment** : fenêtre de juin, avant le premier match du tournoi · **Lieu** : le tunnel, la musique commence, sa bouche fermée · **Conditions** : `chars.dembo.statut != 'retraite' && year <= 2009`
**DEMBO** *(avant-centre des Cobalts — neutre — il regarde le drapeau, pas la caméra)*
« Je ne chante pas l'hymne, je n'ai jamais chanté, et Vence va te demander pourquoi en direct. Donne-moi le ballon, coach, je m'occupe du reste ; les paroles, ce n'est pas le reste. »
← **Il chante en silence** — effets : tribunes +, vestiaire +, relation.dembo +2, set: dembo_hymne_muet, outcome: hymne — *Tu le dis à Vence. Il ne chante toujours pas ; Fauvel chante pour deux.*
→ **Tu chantes, ou tu sors** — effets : direction +, tribunes −, relation.dembo −2, relation.fauvel −1, set: hymne_impose — *Il bouge les lèvres. Il marque quand même ; il ne te regarde pas.*
**Traces** : dembo_hymne_muet, hymne_impose (14) · **Réactions déclenchées** : co.re.sacha_hymne (§ 19.8) · **Lu plus tard par** : 14, 20 (« IL N'A PAS CHANTÉ »), § 19 (Sacha), 02 (Vence : « vous avez vu l'action ? non, la bouche »)

### SCÈNE co.dembo.micro  —  Donne-moi le micro
**Rôle** : tous · **Intrigue** : co.dembo_ballon · **Étape** : 4/6 · **Moment** : `year in 2010..2015`, [3,12] · **Lieu** : le plateau de Télé-Stade, il t'appelle pendant la pub · **Conditions** : `chars.dembo.statut == 'retraite'`
**DEMBO** *(consultant — sourire — au téléphone, le micro encore accroché)*
« Je suis sur le plateau, on parle de toi après la pub, et le yacht m'a coûté le reste, patron. Donne-moi le micro, je m'occupe de ta réputation ; ou prête-moi de quoi tenir jusqu'à Corbelin. »
← **Je prête, ne dis rien** — effets : caisse −−, tribunes +, relation.dembo +2, set: dembo_prete — *Tu prêtes. Après la pub, il dit que tu es « le patron qui donne le ballon ». Il ne rembourse pas ; il ne t'oublie pas.*
→ **Je ne prête pas, parle** — effets : caisse +, tribunes −−, relation.dembo −2, set: dembo_ruine — *Après la pub, il dit que tu l'as vendu comme à dix-sept ans. Vence ne coupe pas. C'est du direct.*
**Traces** : dembo_prete, dembo_ruine (monde, 2015) · **Réactions déclenchées** : — · **Lu plus tard par** : 31 (Nouvelle 2015), 20 (« DEMBO À LA RUE »), 30 (transition Consultant : « le plateau est à vous, il y est déjà »)

### SCÈNE en.dembo.corbelin  —  Corbelin
**Rôle** : entraineur, president · **Intrigue** : co.dembo_ballon · **Étape** : 5/6 · **Moment** : `year >= 2020`, semaine d'un match contre Corbelin · **Lieu** : le stade des Ardoises, une ville morte, une tribune qui chante en vers · **Conditions** : `chars.dembo.statut == 'rival'`
**DEMBO** *(entraîneur de Corbelin — sourire — un poème peint sur le mur derrière lui, à son nom)*
« Coach de Corbelin, deux cents supporters et ils écrivent des poèmes, sur moi, sur le froid, sur toi ce soir. Donne-moi le ballon, patron, je m'occupe du reste ; le reste, ici, c'est la rime. »
← **Je lis le poème** — effets : tribunes +, relation.dembo +1, set: poeme_corbelin — *Tu lis. Il parle d'un aller simple à dix-sept ans et du reste. Tu gagnes le match ; ils te font un vers quand même.*
→ **On joue, pas de poème** — effets : force +1, relation.dembo −1, tribunes − — *Vous jouez. Corbelin gagne. Les corbeaux chantent un vers sur toi ; Gégé le rapporte au local, il le trouve bon.*
**Traces** : poeme_corbelin (« {annee} : les ultras de Corbelin ont écrit un vers sur {prenom} {nom}. Dembo l'a peint sur les ardoises. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 20 (Écho, « On nous écrit » : le vers), 90 (mémoire des clubs : Corbelin +1), § 9 (Gégé : « un cousin à Corbelin »)

### SCÈNE ds.dembo.dix_sept_ans  —  Dix-sept ans (sixième scène)
**Rôle** : ds, entraineur · **Intrigue** : co.dembo_ballon · **Étape** : 6/6 · **Moment** : saison 1+, à la première vente d'un joueur de moins de dix-huit ans · **Lieu** : le couloir, il t'attend, sans sourire, ce qui ne lui ressemble pas · **Conditions** : `chars.dembo.statut == 'club' && chars.mbako.age <= 17 || vente d'un mineur`
**DEMBO** *(avant-centre — neutre — la montre au poignet, pour une fois)*
« Vous vendez le petit à dix-sept ans, un aller simple, comme moi en quatre-vingt-trois ; personne ne m'avait demandé. Donne-moi le ballon, directeur ; le reste, c'est demander au gamin. »
← **Je demande au gamin, ce soir** — effets : caisse −, vestiaire +, relation.dembo +2, relation.mbako +1, set: gamin_demande — *Tu demandes. Il a décidé ; Dembo l'a regardé décider, et il a souri.*
→ **Le gamin a une mère pour ça** — effets : caisse +, relation.dembo −2, set: gamin_vendu_sans — *Il part sans qu'on lui demande. Dembo lui donne le ballon du match, à la gare. Il ne te parle plus pendant un mois.*
**Traces** : gamin_demande, gamin_vendu_sans (« {annee} : un gamin vendu à dix-sept ans sans qu'on lui demande. Dembo lui a donné un ballon à la gare. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 12 (`vendre_trente` : « le gamin a été demandé »), § 6 (Mbako : « Dembo m'a donné un ballon »), 30 (trait Loyauté)

### 13.5 Les paliers
### SCÈNE co.dembo.trahison_micro  —  En direct
**Rôle** : entraineur, president, ds, selectionneur · **Intrigue** : palier −3 · **Étape** : on_relation −3 · **Moment** : programmé en [1,3] · **Lieu** : le plateau de Télé-Stade, en direct, ton téléphone allumé sur la table de la cuisine · **Conditions** : `relation.dembo <= -3`, une fois par carrière
**DEMBO** *(consultant ou joueur — noir, en souriant — il regarde la caméra, pas Vence)*
« Il m'a vendu comme à dix-sept ans, patron, un aller simple, et il l'a fait à un gamin après moi. Donne-moi le micro, je m'occupe du reste ; le reste, c'est son nom. »
← **J'éteins** — effets : tribunes −−−, direction −, set: dembo_a_parle — *Tu éteins. Vence ne coupe pas. Le lendemain, la Gazette a le coupable ; c'est toi ; le fait viendra plus tard.*
→ **J'éteins** — effets : tribunes −−−, direction −, set: dembo_a_parle — *Tu éteins. Vence ne coupe pas. Le lendemain, la Gazette a le coupable ; c'est toi ; le fait viendra plus tard.*
**Traces** : dembo_a_parle (« {annee} : Dembo a parlé de {nom} en direct. Un aller simple, un gamin, un nom. ») · **Lu plus tard par** : 20 (« DEMBO BALANCE »), 02 (Vence : « on est en direct »), 90 (Nemesis)

### SCÈNE co.dembo.faveur_ballon  —  Le ballon du match
**Rôle** : entraineur, joueur, selectionneur · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : le vestiaire, après un match gagné, un ballon signé par lui seul · **Conditions** : `relation.dembo >= 3`, une fois par carrière
**DEMBO** *(avant-centre — sourire — il a joué blessé, il boite, il tient le ballon)*
« J'ai joué blessé, j'ai marqué deux fois, et Rouvier va me tuer ; c'est pour toi, {prenom}, je ne joue blessé pour personne. Donne-moi le ballon, je m'occupe du reste : le voilà, garde-le. »
← **Je le garde** — effets : vestiaire ++, tribunes +, relation.dembo +1, set: ballon_dembo — *Tu le gardes. Il est dégonflé en 2015 ; il vaut plus que le yacht. Il le sait.*
→ **Donne-le à Rouvier** — effets : relation.rouvier +1, relation.dembo +1, vestiaire + — *Il le donne. Elle le met dans le cabinet en 2015, dans la salle d'attente, à côté des fleurs. Il l'y voit ; il sourit.*
**Traces** : ballon_dembo (objet héritable ; « {annee} : Dembo a joué blessé pour {prenom} {nom}. Deux buts, un ballon signé, une kiné furieuse. ») · **Lu plus tard par** : 90 (lignée : objet), 12 (Rouvier : les huit kilos, variante), 30 (`jp_porteparole` plus)

### 13.6 Les retrouvailles
### SCÈNE co.retrouvailles.dembo_sourire  —  Le bateau de pêche
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les deux meilleures relations · **Lieu** : le parking du nouveau club, un billet de bateau à la main
**DEMBO** *(sa fonction du moment — sourire — un billet de bateau de pêche, Portclair, samedi)*
« Nouveau club, nouveau port, j'ai loué le même bateau, celui de Portclair, et j'ai dit au capitaine que tu venais. Donne-moi le ballon, {prenom}, je m'occupe du reste, comme la première fois. »
**OK** **Samedi, Portclair** — effets : vestiaire ++, relation.dembo +1, caisse − — *Le bateau. Les mêmes chansons. Il ne chante toujours pas l'hymne ; il chante tout le reste.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.dembo_noir  —  Un aller simple
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les pires relations · **Lieu** : le couloir du nouveau club ; il ne sourit pas
**DEMBO** *(sa fonction du moment — noir — il ne sourit pas ; c'est rare, ça se voit)*
« Patron, tu as changé de club comme on change de gamin : un aller simple, et le reste. Donne-moi le ballon ; non, garde-le, je m'occupe du reste tout seul. »
**OK** **Je n'avais pas le choix** — effets : relation.dembo +1, tribunes − — *« Moi non plus, à dix-sept ans », dit-il. Il part. Il ne claque pas la porte ; il la laisse ouverte, c'est pire.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.dembo_corbeaux  —  Les ardoises
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : 2046, une fois (`chars.dembo.statut == 'mort' || (chars.dembo.statut == 'parti' && flag('dembo_mort'))`) · **Conditions** : `relation.dembo != 0` · **Lieu** : le local de la Tribune Nord, un poème recopié sur le bar
**GÉGÉ ou NINO** *(capo — neutre — un poème recopié à la main, venu de Corbelin)*
« Les corbeaux ont peint un poème sur les ardoises pour Dembo, et il y a ton nom au troisième vers ; ils l'ont mis en rime avec « le reste ». La tribune n'oublie rien, même à Corbelin. »
← **Je vais le lire sur place** — effets : tribunes +, relation.dembo +1 (posthume) — *Tu y vas. C'est faux, ou vrai ; ça rime.*
→ **Je le lis ici, ça suffit** — effets : direction + — *Tu le lis. Lui non plus ne l'aurait pas su.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### 13.7 Anecdotes
- **01.dembo_montre** — objet · toute scène · Une montre trop grosse qu'il enlève pour jouer et oublie dans le vestiaire ; Josiane l'a rapportée onze fois ; en 2015 il la vend ; en 2020 les corbeaux lui en offrent une en ardoise.
- **01.dembo_voiture** — décor · brèves · Une voiture de sport jaune, deux places, puis un bus de Corbelin qu'il conduit lui-même.
- **01.dembo_superstition** — légende · set-piece `gm_annonce` · Il dort dans le vestiaire une heure avant le match ; « le sommeil, c'est mon échauffement » ; Rouvier le réveille au sifflet.
- **01.dembo_repas** — décor · `jp.vestiaire.repas_equipe` · Il mange après le match, jamais avant : deux assiettes d'un plat de son enfance qu'il ne nomme pas, et un dessert pour Mbako.
- **01.dembo_hymne** — légende · `sl.dembo.hymne` · Il apprend les paroles de l'hymne à Corbelin, en 2020, avec les gamins ; il ne les chante toujours pas en public ; il les chante au bus.

---

## 14. KARIM FAUVEL  (`fauvel`)
**Fonction** : capitaine des Cobalts · **Genre** : m · **Âge en 1990** : 27 · **Camp** : selection · **Fenêtre** : capitaine des Cobalts 1990-1998 (le Continental gagné chez nous en 1996, le Mondial raté en 1998), joueur de {club} jusqu'en 2001 (38 ans, le capitaine vieillissant), président du syndicat des joueurs 2006-2030, la grève mondiale (2026) ; retraité 2031 ; il meurt en 2045, en tribune, pendant un hymne · **Suivant** : capitaine des Cobalts après lui : Mbako (2004-2010), puis Noa Vandel (2024+) ; au syndicat : « la déléguée » (voix sans portrait, 2030+)
**Tic** : « On est un groupe, pas une liste. » — torsions : « On était un groupe. C'est devenu une liste. » · « Une liste de vingt-six, un groupe de onze, un bus de zéro. » · « On est un syndicat, pas une liste. »
**Désir** : le Mondial · **Blessure** : il a manqué le tir au but de 1990 (finale de la Coupe d'été) ; on le lui rappelle à chaque fenêtre ; il l'a retiré en 1996, au Grand Stade, et on le lui rappelle quand même
**Adresse** : sélectionneur : {prenom} / coach / monsieur le sélectionneur · joueur : {prenom} / {prenom} / le {numero} · autres : § 0.1
**Ce qu'il pense de toi** : à +2 « tu as fait un groupe ; je descends du bus quand tu le dis » ; à 0 « on verra à la première liste » ; à −2 « monsieur le sélectionneur, le groupe a écrit une lettre »
**Paliers** : −3 → `co.fauvel.trahison_lettre_publique` · +3 → `co.fauvel.faveur_bus`
**Dans les rôles** : sélectionneur : cœur (le capitaine, le bus, l'avion des primes ; 2,5) · joueur : chœur (le capitaine qui te reçoit en sélection ; 1) · instance : cœur et adversaire (le syndicat 2006, la grève mondiale 2026 ; 1,5) · entraîneur : cœur (le capitaine vieillissant à 38 ans s'il joue à {club} ; 1) · président : le syndicat au téléphone (0,5)
**Trajectoire 1990 → 2050** : 1990-1999 · 27-36 ans, cheveux ras, un regard de milieu défensif, le brassard cobalt ; le tir au but (1990), le Continental gagné chez nous (1996), le Mondial raté (1998) · 2000-2009 · retraite 2001 ; gris (2008) ; président du syndicat (2006) : il négocie les primes avec toi, puis contre toi · 2010-2019 · lunettes (2018) ; il défend Dembo ruiné, Mbako capitaine, le joueur suspendu ; il refuse la Ligue fermée (2019) avant tout le monde · 2020-2029 · la grève mondiale (2026 : soixante-douze matchs par saison) ; il est devant l'hôtel du Lac, à côté de Gégé, ils ne se parlent pas, ils sont d'accord · 2030-2039 · canne (2038) ; retraité du syndicat ; il vient aux matchs des Cobalts, tribune, il chante l'hymne pour deux · 2040-2050 · meurt en 2045 pendant un hymne, debout ; on ne l'a pas fait asseoir
**Retrouvailles** : `co.retrouvailles.fauvel_sourire` / `_noir` / `_hymne`
**Cartes propres** : *Le tir au but* (01) · *L'avion des primes* (01) · *Le premier jour en bleu* (01) · *Le syndicat* (01) · *La grève* (01) · *Trente-huit ans* (01) · *Le bus* (14, `sl.le_bus`) · *La Liste* (14) · *Le capitaine écarté* (§ 2, `sl.brehaut.ecarte`)

### 14.1 Identité et place
Karim Fauvel ; « Karim » pour le groupe, « le capitaine » pour le pays, « le tir au but » pour la Gazette. 27 ans en 1990, 37 en 2000, 47 en 2010, 57 en 2020, 67 en 2030, 82 à sa mort. **Portrait** : les cheveux ras, la mâchoire carrée, le maillot cobalt rentré dans le short, le brassard blanc, une cicatrice sur l'arcade gauche (1988, un coude, il n'en parle pas). **Voix** : grave, posée, le mot « groupe » toutes les trois phrases ; il ne hausse jamais le ton, il se lève. Dans la sélection, il est le bus : il monte le dernier, il descend le premier ou pas ; il porte la liste des vingt-six dans sa poche et il la déchire si c'est une liste. Il chante l'hymne pour deux, pour ceux qui ne chantent pas, sans leur demander pourquoi.

**Désir / besoin / blessure / secret.** Désir : le Mondial, une fois, n'importe où. Besoin : que le groupe soit un groupe. Blessure : 1990, le tir au but, le poteau gauche. Secret : il a manqué exprès — non ; il a cru un instant qu'il pouvait manquer exprès, et cette pensée le poursuit plus que le poteau.

### 14.2 Les cinq registres
- **−3** — « Le groupe a écrit une lettre et je la publie demain, monsieur le sélectionneur. On était un groupe ; vous avez fait une liste. » / « Le bus ne descend pas. Moi non plus. »
- **−2 / −1** — « Vous avez écarté Bréhaut sans le voir. Le groupe l'a vu. » / « Une liste de vingt-six, un groupe de onze, un bus de zéro. »
- **0** — « On est un groupe, pas une liste, coach. La liste, c'est vous ; le groupe, c'est moi. » / « Le tir au but, oui, je sais. Vous vouliez autre chose ? »
- **+1 / +2** — « {prenom}, le groupe descend si je descends. Dis-moi quand. » / « Vous avez fait un groupe. J'en ai vu un, en quatre-vingt-seize ; c'est le deuxième. »
- **+3** — « Le bus ne voulait pas descendre ; j'ai dit qu'on était un groupe, pas une liste, et ils sont descendus derrière moi. Ne me remerciez pas. » / « Je chante l'hymne pour deux, ce soir : pour moi et pour vous. »

### 14.3 Rapports avec les autres
**Alliés** : Vecchio (le vingt-sixième qui descend le premier : ils se partagent le bus), Rouvier (il lui garde une assiette), Brissac (« un groupe, pas une liste » : « les chiffres sont têtus, les groupes aussi » ; ils s'estiment), Gégé (2019, 2026 : deux hommes devant un hôtel). **Rivaux** : Bréhaut (le capitaine de club a 33 ans en 1990, celui du pays 27 : deux brassards, deux horloges), Mbako (le brassard des Cobalts, 2004), Dembo (l'hymne : Fauvel chante pour lui et lui en veut de devoir le faire), Berthomier (« on verra après le Congrès » : « le groupe ne verra rien »). **Dettes** : il doit à Vence des larmes en 1990 (elle l'a fait pleurer en direct, elle n'a pas aimé ça) ; Montoya lui doit une Ligue fermée refusée. **Il aime** : Sacha, qui ne chante pas l'hymne et le lui a dit ; il n'a pas chanté pour elle.

### 14.4 INTRIGUE co.fauvel_liste  —  On est un groupe, pas une liste
**Logline** : Karim Fauvel a raté un tir au but en 1990 et passe le reste de sa vie à faire des groupes : dans le bus, dans l'avion des primes, au syndicat, dans la grève. · **Synopsis** : Sélectionneur, il te parle du tir au but à la première fenêtre. L'avion des primes attend sur le tarmac. Joueur, il te reçoit à ta première sélection. Instance, il préside le syndicat et négocie contre toi. En 2026, la grève mondiale : il est devant l'hôtel. Entraîneur, il a trente-trois ans dans ton vestiaire et un brassard qui pèse.
**Rôle(s)** : selectionneur, joueur, instance, entraineur · **Postulat(s)** : partagé (apres_fiasco, pays_emergent, pepite, heritage_empoisonne, elu_surprise, fin_de_contrat) · **Porteur** : fauvel · **Cast** : fauvel, vecchio, brissac, legruet, vence, gege · **Thème** : instances
**Saisons** : "0" (tir_au_but : sélectionneur, mars ; premier_jour : joueur), "1" (avion, trente_huit), rôles : syndicat (instance 2006+), greve (2026) · **Conditions d'entrée** : `chars.fauvel.statut` selon l'étape · **Exclusions** : `sl.le_bus` (14) la même fenêtre · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `groupe` → `fauvel_groupe` (« {annee} : Karim Fauvel a dit « on est un groupe ». Le sélectionneur l'a écouté ; le bus est descendu. ») → lue par 14 (`bus_descendu`, `mutinerie_matee` variantes), 30 (`sl_clans` plus, `sl_fete`) · `syndicat` → `fauvel_syndicat` (« {annee} : Karim Fauvel préside le syndicat des joueurs. Première revendication : un groupe, pas une liste. ») → lue par 15 (les dossiers : égalité des primes, calendrier), 13 (la grève des salariés), 20 · `greve` → `greve_soutenue` / `greve_brisee` (« 2026 : la grève mondiale. {prenom} {nom} a soutenu / brisé le mouvement ; Fauvel était devant l'hôtel. ») → lue par 31 (Nouvelle 2026), 15 (`reforme_votee`), 90 (mémoire des clubs : les joueurs se souviennent)
**Séquencier** : tir_au_but (sélectionneur, fenêtre de mars, `year <= 1998`) | premier_jour (joueur, `flag('international')`, [2,8]) → avion (sélectionneur, fenêtre de juin, veille du tournoi) → syndicat (instance, `year >= 2006`) → greve (instance ou président, `year == 2026`, lit `monde_greve`) → trente_huit (entraîneur, `year <= 2001`, `chars.fauvel.statut == 'club'`)
**Épilogue** : rien : Fauvel suit le pays.

### SCÈNE sl.fauvel.tir_au_but  —  Le tir au but
**Rôle** : selectionneur · **Intrigue** : co.fauvel_liste · **Étape** : 1/6 · **Moment** : fenêtre de mars, première Liste · **Lieu** : le centre national, il attend devant le bureau, sans frapper · **Conditions** : `year <= 1998`
**FAUVEL** *(capitaine des Cobalts — neutre — le brassard dans la main, pas au bras)*
« Le tir au but de quatre-vingt-dix, vous allez me le rappeler, tout le monde le fait, alors allez-y. On est un groupe, pas une liste, coach ; je suis dedans, ou je suis le poteau gauche ? »
← **Capitaine, on n'en parle pas** — effets : vestiaire ++, relation.fauvel +2, relation.brehaut −1, set: capitaine_fauvel_confirme — *Il remet le brassard. Il ne dit pas merci ; il monte dans le bus le dernier, comme toujours, et il tient la porte.*
→ **Le brassard se mérite** — effets : vestiaire −, direction +, relation.fauvel −1, set: brassard_en_jeu — *Il garde le brassard dans la main. Bréhaut le voit. Deux capitaines, une liste ; le groupe attend de savoir lequel descendra du bus.*
**Traces** : capitaine_fauvel_confirme, brassard_en_jeu (« {annee} : le brassard des Cobalts remis en jeu à chaque liste. Fauvel l'a gardé dans la main. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 02 (`sl.brehaut.ecarte` : exclusion), 14 (la Liste de juin : variante), 30 (`sl_clans` plus)

### SCÈNE jp.fauvel.premier_jour  —  Le premier jour en bleu
**Rôle** : joueur · **Intrigue** : co.fauvel_liste · **Étape** : 1/6 (variante joueur) · **Moment** : saison 0-1, [2,8] après `international` · **Lieu** : le centre national, le vestiaire cobalt, un casier à ton nom mal orthographié · **Conditions** : `flag('international') && year <= 1998`
**FAUVEL** *(capitaine des Cobalts — neutre — il corrige l'étiquette du casier au stylo)*
« Première sélection, ton nom est mal écrit sur le casier, et les vingt-cinq autres attendent de voir si tu manges avec nous ou avec ton agent. On est un groupe, pas une liste, {prenom} : à table. »
← **Avec le groupe** — effets : vestiaire ++, tribunes +, relation.fauvel +2, relation.fardelli −1, set: groupe_cobalts — *Tu manges avec eux. Fardelli attend dans le hall ; il y dîne seul. Fauvel réécrit ton nom sans faute ; il l'aura appris.*
→ **Avec Fardelli, il a réservé** — effets : caisse +, vestiaire −−, relation.fauvel −2, relation.fardelli +1, set: liste_cobalts — *Tu dînes en ville. Le lendemain, ton casier est au bout, près de la porte. Fauvel ne t'en parle pas ; le groupe non plus.*
**Traces** : groupe_cobalts, liste_cobalts (« {annee} : première sélection pour {prenom} {nom}. Dîner avec l'agent ; casier près de la porte. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 14 (le capitaine de la sélection te reçoit : variante), 30 (`jp_siffle` plus « même en bleu cobalt »), 20 (« {NOM} EN BLEU COBALT »)

### SCÈNE sl.fauvel.avion  —  L'avion des primes
**Rôle** : selectionneur · **Intrigue** : co.fauvel_liste · **Étape** : 2/6 · **Moment** : fenêtre de juin, la veille du départ pour le tournoi · **Lieu** : le tarmac, l'avion, vingt-six joueurs assis dans le hall qui ne montent pas · **Conditions** : `year <= 2008` (Berthomier préside ; après 2008, « le président de la Fédération » signe par courriel, sans fax, et la conséquence dit « il signe », pas « après le Congrès »)
**FAUVEL** *(capitaine des Cobalts — neutre — une feuille de primes signée par vingt-six mains)*
« La Fédération a divisé les primes par deux hier soir, et le groupe ne monte pas tant que Berthomier n'a pas signé. On est un groupe, pas une liste, coach ; vous montez avec nous, ou seul ? »
← **Je reste sur le tarmac** — effets : direction −−, vestiaire +++, relation.fauvel +2, relation.legruet −2, set: fauvel_groupe, outcome: groupe — *Trois heures. Vence filme la passerelle.*
→ **Montez, on négocie là-bas** — effets : direction +, vestiaire −−, relation.fauvel −2, set: primes_apres — *Ils montent. L'avion des primes devient l'avion tout court.*
**Traces** : fauvel_groupe, primes_apres (« {annee} : les Cobalts ont pris l'avion sans primes. Ils ont perdu le premier match en silence. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 14 (l'avion des primes : ce chapitre écrit le premier temps, 14 la chaîne), 02 (Berthomier), 20 (« TROIS HEURES SUR LE TARMAC »), 30 (`sl_primes` plus)

### SCÈNE in.fauvel.syndicat  —  Le syndicat
**Rôle** : instance · **Intrigue** : co.fauvel_liste · **Étape** : 3/6 · **Moment** : un dossier de l'année, `year >= 2006` · **Lieu** : la salle du comité, il est venu avec trois joueurs, dont un suspendu · **Conditions** : —
**FAUVEL** *(président du syndicat des joueurs — neutre — la cicatrice, le costume, la même mâchoire)*
« Soixante matchs par saison, un suspendu pour un flacon qu'il n'a pas rempli, et une commission qui « examine ». On est un groupe, pas une liste, monsieur le président ; vous nous recevez ? »
← **Je vous reçois, tous** — effets : direction −, tribunes +, relation.fauvel +2, set: fauvel_syndicat, outcome: syndicat — *Deux heures. Le calendrier passe à cinquante-huit ; c'est un début, dit Fauvel.*
→ **Les avocats, salle 3** — effets : direction +, tribunes −, relation.fauvel −2, set: syndicat_ecarte — *Les avocats. Fauvel attend avec eux ; il a l'habitude des tarmacs.*
**Traces** : fauvel_syndicat, syndicat_ecarte (« {annee} : le syndicat des joueurs renvoyé aux avocats. Fauvel a attendu salle 3 avec eux. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 15 (dossiers calendrier, égalité des primes, `reforme_votee`), 13 (la grève des salariés : Fauvel appelle), 20 (« LE GROUPE CONTRE LA LISTE »)

### SCÈNE in.fauvel.greve  —  La grève
**Rôle** : instance, president · **Intrigue** : co.fauvel_liste · **Étape** : 4/6 · **Moment** : `year == 2026`, un dossier · **Lieu** : devant l'hôtel du Lac, il est là depuis six heures, Gégé à trois mètres · **Conditions** : `flag('monde_greve')`
**FAUVEL** *(président du syndicat, 63 ans — neutre — il n'a pas dormi, ça ne se voit pas)*
« Soixante-douze matchs par saison, et les joueurs du monde ne descendent plus du bus depuis lundi. On est un groupe, pas une liste, monsieur le président : soixante, ou le Mondial des amateurs ? »
← **Soixante, je signe** — effets : direction −−, caisse −−, tribunes ++, relation.fauvel +2, relation.bambini −2, set: greve_soutenue, outcome: greve — *Tu signes. Bambini est « choqué ». Le Mondial des amateurs n'a pas lieu ; Trébignac est déçu, ils avaient un tirage.*
→ **Soixante-douze, point** — effets : direction ++, tribunes −−, relation.fauvel −2, set: greve_brisee — *Ils ne descendent pas. Le Mondial des amateurs a lieu ; Trébignac joue ; Gigi n'est plus là pour le voir, le disciple au seau, si.*
**Traces** : greve_soutenue, greve_brisee · **Réactions déclenchées** : — · **Lu plus tard par** : 31 (Nouvelle 2026, le Mondial des amateurs), 15 (`reforme_votee`, la Campagne), 90 (mémoire des joueurs), 30 (`in_pantin` plus)

### SCÈNE en.fauvel.trente_huit  —  Trente-huit ans
**Rôle** : entraineur · **Intrigue** : co.fauvel_liste · **Étape** : 5/6 · **Moment** : `year <= 2001`, [4,12] · **Lieu** : ton vestiaire, il joue à {club}, il a un brassard cobalt et un genou de trente-trois ans · **Conditions** : `chars.fauvel.statut == 'club'`
**FAUVEL** *(capitaine de {club} — neutre — il enlève le brassard cobalt de son sac, le pose sur le banc)*
« Trente-huit ans, capitaine du pays, remplaçant chez vous depuis trois dimanches ; le groupe regarde qui vous regardez. On est un groupe, pas une liste, coach ; dedans, ou le vieux ? »
← **Dedans, tu parles au groupe** — effets : vestiaire ++, force −1, relation.fauvel +2, relation.brehaut −1, set: fauvel_relais — *Il parle au groupe, cinq minutes, une fois par semaine. Bréhaut écoute, bras croisés. Le groupe vit bien ; il court moins.*
→ **Le vieux transmet** — effets : force +1, vestiaire −, relation.fauvel −1, set: fauvel_transmet — *Il transmet. Il chante l'hymne à la télé.*
**Traces** : fauvel_relais, fauvel_transmet (« {annee} : Karim Fauvel a transmis. Pas de jubilé ; il n'en voulait pas. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 11 (`en.brassard_brehaut` : variante « deux capitaines »), 14 (il devient ton capitaine chez les Cobalts si `fauvel_relais`), 30 (`en_copain` plus)

### SCÈNE sl.fauvel.finale_1996  —  1996 (sixième scène)
**Rôle** : selectionneur · **Intrigue** : co.fauvel_liste · **Étape** : 6/6 · **Moment** : `year == 1996`, la veille de la finale du Continental, chez nous, au Grand Stade neuf (chaîne Tournoi, 14) · **Lieu** : la chambre d'hôtel du capitaine, la porte ouverte, il regarde le plafond · **Conditions** : le tournoi est arrivé en finale
**FAUVEL** *(capitaine des Cobalts — neutre — il ne se lève pas quand tu entres ; c'est la seule fois)*
« S'il y a des tirs au but, je tire le premier ou je ne tire pas ; six ans que je le sais, sans savoir lequel. On est un groupe, pas une liste, coach ; la liste des tireurs, c'est vous. »
← **Tu tires le premier** — effets : vestiaire ++, tribunes +, relation.fauvel +2, set: fauvel_premier_tireur — *Il tire le premier. Il ne célèbre pas ; il regarde le poteau, longtemps.*
→ **Tu ne tires pas, tu regardes** — effets : vestiaire +, relation.fauvel +1, force +1, set: fauvel_ne_tire_pas — *Il ne tire pas. Il pleure devant Vence ; elle n'aime toujours pas ça, et elle ne coupe pas.*
**Traces** : fauvel_premier_tireur, fauvel_ne_tire_pas (« 1996 : Karim Fauvel n'a pas tiré. Champion du continent quand même ; il a pleuré devant Vence. ») · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 14 (chaîne Tournoi : temps fort « les tirs au but »), ch. 31 (`monde_continental_1996`), ch. 20 (« L'ANNÉE OÙ TOUT LE MONDE AIMAIT LE FOOT »), ch. 02 (Vence)

### 14.5 Les paliers
### SCÈNE co.fauvel.trahison_lettre_publique  —  La lettre publiée
**Rôle** : selectionneur, instance, entraineur · **Intrigue** : palier −3 · **Étape** : on_relation −3 · **Moment** : programmé en [1,3] · **Lieu** : la zone mixte, Vence tend le micro, il lit une lettre signée par vingt-six mains · **Conditions** : `relation.fauvel <= -3`, une fois par carrière
**FAUVEL** *(capitaine ou président du syndicat — noir — il lit sans lever les yeux)*
« Vingt-six signatures : le groupe ne reconnaît plus le sélectionneur, et je lis en direct ce qu'on n'a pas lu en privé. On était un groupe, monsieur le sélectionneur ; vous avez fait une liste. »
← **Je l'écoute jusqu'au bout** — effets : vestiaire −−−, direction −−, tribunes −, set: lettre_groupe_publique — *Tu écoutes. Vence ne coupe pas. Berthomier dit qu'on verra ça après le Congrès ; le Congrès, c'est ce soir.*
→ **Je l'écoute jusqu'au bout** — effets : vestiaire −−−, direction −−, tribunes −, set: lettre_groupe_publique — *Tu écoutes. Vence ne coupe pas. Berthomier dit qu'on verra ça après le Congrès ; le Congrès, c'est ce soir.*
**Traces** : lettre_groupe_publique (« {annee} : la lettre des vingt-six lue en direct par Karim Fauvel. Le sélectionneur a écouté jusqu'au bout. ») · **Lu plus tard par** : 30 (`sl_minuit`, `sl_clans`), 14 (`apres_fiasco` : le postulat naît de là), 20 (« VINGT-SIX CONTRE UN »), 90 (Nemesis)

### SCÈNE co.fauvel.faveur_bus  —  Ils sont descendus derrière moi
**Rôle** : selectionneur, entraineur · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : le parking de l'hôtel, le bus, la porte ouverte, lui debout devant · **Conditions** : `relation.fauvel >= 3`, une fois par carrière
**FAUVEL** *(capitaine — sourire — le brassard au bras, pour une fois hors du terrain)*
« Ils ne voulaient pas descendre, et j'ai dit qu'on était un groupe, pas une liste ; ils sont descendus derrière moi, un par un. Ne me remerciez pas, {prenom} ; faites la causerie, ils écoutent. »
← **La causerie, maintenant** — effets : vestiaire +++, tribunes +, set: bus_descendu, set: mutinerie_matee — *Dix minutes. Ils écoutent. Gigi est descendu le deuxième ; il dit qu'il en a vu d'autres, mais qu'il a préféré celle-là.*
→ **Qui refusait de descendre ?** — effets : vestiaire +, relation.fauvel −1 — *Il ne donne pas de noms. « Un groupe », dit-il. Il monte faire la causerie à ta place ; elle est bonne.*
**Traces** : bus_descendu, mutinerie_matee (14) · **Lu plus tard par** : 14, 30 (`sl_fete`, `en_bus` plus), § 7 (Vecchio : « je suis descendu le deuxième »)

### 14.6 Les retrouvailles
### SCÈNE co.retrouvailles.fauvel_sourire  —  Le casier bien écrit
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les deux meilleures relations · **Lieu** : le vestiaire du nouveau club, devant un casier
**FAUVEL** *(sa fonction du moment — sourire — une étiquette de casier, ton nom sans faute)*
« J'ai appris ton nom en quatre-vingt-dix et je ne l'ai plus jamais mal écrit ; ici, ils l'ont mal écrit, j'ai corrigé. On est un groupe, pas une liste, {prenom}, même à deux. »
**OK** **À deux, c'est déjà un groupe** — effets : vestiaire +, relation.fauvel +1 — *Il colle l'étiquette. Le vestiaire d'ici apprend ton nom en une semaine, au lieu d'un mois.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.fauvel_noir  —  La liste
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les pires relations · **Lieu** : le hall du nouveau club, une liste pliée dans sa main
**FAUVEL** *(sa fonction du moment — noir — une liste de vingt-six, pliée, qu'il ne te donne pas)*
« Vous avez fait une liste, là-bas, et je l'ai gardée ; je la garde partout où vous allez, monsieur. On est un groupe, pas une liste ; vous, vous êtes vingt-six noms qui ne reviendront pas. »
**OK** **Je veux la lire** — effets : relation.fauvel +1, vestiaire − — *Il la donne. Lui, aucun.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.fauvel_hymne  —  Debout
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : 2045, une fois (`chars.fauvel.statut == 'mort' || (chars.fauvel.statut == 'parti' && flag('fauvel_mort'))`) · **Conditions** : `relation.fauvel != 0` · **Lieu** : le stade, tribune Est, pendant l'hymne, en direct
**LA REMPLAÇANTE DE VENCE** *(Télé-Stade, voix sans portrait — en direct — un stade debout, un hymne qui continue)*
« Karim Fauvel est mort pendant l'hymne, debout, tribune Est, et on ne l'a pas fait asseoir ; on est en direct, et vous, vous êtes là. Vous voulez dire quelque chose ? »
← **Un groupe, pas une liste** — effets : tribunes ++, relation.fauvel +1 (posthume) — *Tu le dis. Le stade le reprend. C'est faux, dans sa bouche à lui ça sonnait mieux ; ça sonne quand même.*
→ **Rien, je chante** — effets : tribunes +, vestiaire + — *Tu chantes. Pour deux. Sacha, à côté, ne chante pas ; elle tient ta main ; ça compte pour un.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### 14.7 Anecdotes
- **01.fauvel_poteau** — légende · `sl.fauvel.tir_au_but` · Le poteau gauche du Vélodrome de la Porte (1990) a été démonté en 1997 ; il est dans le garage de Fauvel ; il s'y cogne le genou tous les matins, exprès.
- **01.fauvel_voiture** — décor · brèves · Une berline familiale, sept places, pour emmener les joueurs qui n'ont pas de voiture ; « on est un groupe, pas un covoiturage », dit Massenet ; Fauvel n'a pas ri.
- **01.fauvel_superstition** — légende · set-piece `gm_annonce` · Il monte dans le bus le dernier et vérifie que la porte ferme ; il descend le premier, ou pas du tout.
- **01.fauvel_repas** — décor · `sl.rouvier.hotel_sponsor` · Il garde une assiette à Rouvier ; il mange debout jusqu'à ce que le dernier joueur soit assis.
- **01.fauvel_cicatrice** — détail de portrait · toute scène · La cicatrice de l'arcade gauche (1988, un coude, en amical) ; il dit qu'elle date de 1990 quand on lui demande ; c'est plus simple.

---

## 15. SOLANGE BRISSAC  (`brissac`)
**Fonction** : directrice technique nationale · **Genre** : f · **Âge en 1990** : 49 · **Camp** : selection · **Fenêtre** : DTN 1988-2010 ; présidente de l'AS Mirevaux depuis 2010 (la section est professionnelle depuis 2008 ; en 2016 elle entre dans le premier championnat professionnel à huit clubs) jusqu'en 2020 ; membre de la commission technique de l'Union (2016-2020) ; retraitée 2020, à soixante-dix-neuf ans, en retard d'une réunion ; elle meurt en 2028, avec ses chiffres · **Suivant** : Aurèle Castan, DTN 2010-2030 (né 1965 ; il a les chiffres, pas les joueurs)
**Tic** : « Les chiffres sont têtus, les joueurs aussi. » — torsions : « Les chiffres sont têtus. Les présidents, moins. » · « Les joueurs sont têtus ; les chiffres ont cédé. » · « Les joueuses sont têtues, et personne n'a de chiffres. »
**Désir** : la formation, les diplômes, le jeu · **Blessure** : ancienne internationale d'une sélection féminine que personne ne filmait (1962-1971, quarante-deux sélections, zéro image) ; elle a tous ses chiffres dans un cahier, et aucun n'a été vérifié par personne
**Adresse** : entraineur : {prenom} / {pg, select, f{madame} other{monsieur}} {nom} / idem · joueur : idem · autres : § 0.1 (elle ne tutoie qu'à +1, et seulement le prénom)
**Ce qu'elle pense de toi** : à +2 « vous avez le papier, et vous l'avez lu » ; à 0 « les chiffres disent trop lent, les joueurs disent autre chose, on verra » ; à −2 « votre diplôme a un tampon et pas de signature »
**Paliers** : −3 → `co.brissac.trahison_dossier` · +3 → `co.brissac.faveur_stage`
**Dans les rôles** : entraîneur : patron secondaire (le diplôme, la dérogation, le stage de Corven ; 1) · sélectionneur : patron (l'attaquant naturalisé, la liste, le binational ; 2) · instance : cœur (la commission technique, la section féminine, l'égalité des primes ; 1,5) · joueur : le chiffre qui dit « trop lent » (0,5) · DS : « les chiffres vous aiment » (0,5) · président : présidente de Mirevaux, adversaire ou alliée (1 dès 2010)
**Trajectoire 1990 → 2050** : 1990-1999 · 49-58 ans, chignon serré, tailleur gris, un cahier à colonnes ; DTN : les diplômes, les stages, le premier « trop lent » chiffré · 2000-2009 · lunettes (1996) ; l'attaquant naturalisé (2002), le binational (2004) ; « l'algorithme » (2008) : elle le déteste, il lui donne raison · 2010-2019 · présidente de Mirevaux (2010) ; la section féminine professionnelle (2008) est son œuvre ; elle exige l'égalité des primes (2016) ; commission technique de l'Union · 2020-2029 · canne (2016) ; retraite 2025 ; elle publie ses chiffres de 1962-1971 ; personne ne peut les vérifier ; on les croit · 2030-2050 · meurt en 2036 ; Mirevaux donne son nom à la tribune ; les chiffres sont têtus
**Retrouvailles** : `co.retrouvailles.brissac_sourire` / `_noir` / `_cahier`
**Cartes propres** : *Le papier* (01) · *Le naturalisé* (01) · *Le binational dans la liste* (01) · *Les primes égales* (01) · *Trop lent* (01) · *Mirevaux, année un* (01) · *Le diplôme* (10-11) · *La commission technique* (15)

### 15.1 Identité et place
Solange Brissac ; « madame Brissac » pour tout le monde, « la DTN » pour Berthomier, « Solange » pour Josiane et Paulette. 49 ans en 1990, 59 en 2000, 69 en 2010, 79 en 2020, 89 en 2030, 95 à sa mort. **Portrait** : le chignon serré gris, le tailleur gris, les lunettes sur une chaîne, le cahier à colonnes tenu contre la poitrine, une médaille qu'elle ne porte pas mais qu'on devine. **Voix** : sèche, exacte, un chiffre par phrase ; elle finit par « et les joueurs aussi » quand elle a tort et le sait. À la Fédération, elle est le papier : sans elle, pas de banc en D1 ; elle tient les diplômes, les stages, la liste des sélections de jeunes ; elle a un bureau au bout du couloir, après salle 3, et on y attend moins longtemps.

**Désir / besoin / blessure / secret.** Désir : que le jeu soit enseigné, mesuré, et gagné. Besoin : qu'un de ses chiffres soit filmé. Blessure : quarante-deux sélections, zéro image. Secret : elle a truqué un chiffre, une fois, en 1989, pour faire passer un diplôme à quelqu'un qui le méritait et ne l'avait pas ; c'était Corven.

### 15.2 Les cinq registres
- **−3** — « Votre dossier de diplôme est rouvert, monsieur {nom} ; il y a un tampon et pas de signature. Les chiffres sont têtus, et les procès-verbaux aussi. » / « Vous n'aurez plus de banc en D1. C'est un chiffre : zéro. »
- **−2 / −1** — « Les chiffres disent trop lent. Les joueurs disent que vous ne les écoutez pas. » / « Une dérogation de six mois. Le septième, on en reparle, et pas ici. »
- **0** — « Les chiffres sont têtus, les joueurs aussi. Le stage, c'est lundi, huit heures. » / « Le binational est dans la liste ; les deux fédérations me téléphonent. Vous choisissez avant eux. »
- **+1 / +2** — « {prenom}, les chiffres vous aiment ; le Congrès aussi, peut-être. » / « Vous avez lu le papier. Je vous mets à la tête du stage suivant. »
- **+3** — « Le diplôme, sans stage, tamponné et signé ; c'est la deuxième fois que je fais ça, la première c'était pour Corven. Les chiffres sont têtus ; moi aussi, parfois, dans le bon sens. » / « Voilà mon cahier de soixante-deux. Personne ne l'a vu. Vous, si. »

### 15.3 Rapports avec les autres
**Alliés** : Corven (le diplôme de 1989, le stage qu'elle lui confie : « il dit la vérité aux stagiaires »), Fauvel (« un groupe, pas une liste » : elle a une liste et un groupe), Rouvier (les muscles sont têtus aussi), la mère de Mbako (deux femmes qui écrivent les colonnes). **Rivaux** : Berthomier (« on verra après le Congrès » : elle a vu avant), Fardelli (« les chiffres sont à vendre ? non »), Barbier (« je l'ai vu jouer sous la pluie » : « moi, je l'ai chronométré »), Vaz (les cassettes contre les colonnes). **Dettes** : elle doit à Josiane le cahier de 1962, retrouvé dans les archives de la Fédération ; Vaubourg lui doit un vote (2008). **Elle aime** : Sacha, qui lui a demandé les chiffres de la sélection féminine de 1965, et les a crus.

### 15.4 INTRIGUE co.brissac_chiffres  —  Les chiffres sont têtus
**Logline** : Solange Brissac tient le papier, la liste et les chiffres ; elle te refuse un banc, te donne un naturalisé, te tend un binational, exige l'égalité des primes, et te dit que tu étais trop lent. · **Synopsis** : Entraîneur sans diplôme, elle t'accorde six mois. Sélectionneur, elle te propose un attaquant naturalisé, puis un binational que deux fédérations se disputent. Instance, elle vient avec un dossier : primes égales. Joueur, son chiffre confirme le rapport de Barbier. En 2016, elle est présidente de Mirevaux et la section féminine commence l'année un.
**Rôle(s)** : entraineur, selectionneur, instance, joueur, president · **Postulat(s)** : partagé (interimaire, pays_emergent, apres_fiasco, sous_tutelle, section_feminine, pepite) · **Porteur** : brissac · **Cast** : brissac, clow, legruet, fauvel, mbako, barbier · **Thème** : instances
**Saisons** : "0" (papier : entraîneur ; trop_lent : joueur), "1" (naturalise 2002+, binational 2004+), "2+" (primes 2016+, mirevaux 2016) · **Conditions d'entrée** : `chars.brissac.statut != 'mort'` · **Exclusions** : `en.diplome` (11) la même saison · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `derogation` → `derogation` (11 la déclare ; ce chapitre l'écrit) → lue par 11, 20 (« LE COACH SANS PAPIER »), 30 (Carrefour) · `primes` → `primes_egales` (« {annee} : primes égales pour les Cobalts et les Cobaltes. Brissac avait les chiffres ; {prenom} {nom} a signé. ») → lue par 15 (l'égalité des primes, dossier), 20 (« À PRIME ÉGALE »), 31 (Nouvelle 2016) · `mirevaux` → `brissac_mirevaux` (« {annee} : Solange Brissac, présidente de Mirevaux. Un budget de buvette, des joueuses qui ont un emploi. ») → lue par 11 (`section_feminine` : elle est ta présidente), 13 (Mirevaux en face), 20
**Séquencier** : papier (entraîneur, S0, [1,4], `!flag('diplome')`) | trop_lent (joueur, S0, [4,10]) → naturalise (sélectionneur, fenêtre de mars, `year >= 2002`) → binational (sélectionneur, fenêtre de septembre, `year >= 2004`, lit `binational_choisi`) → primes (instance, `year >= 2016`) → mirevaux (entraîneur ou président, `year >= 2016`)
**Épilogue** : rien : Brissac suit la Fédération.

### SCÈNE en.brissac.papier  —  Le papier
**Rôle** : entraineur · **Intrigue** : co.brissac_chiffres · **Étape** : 1/6 · **Moment** : saison 0, [1,4] · **Lieu** : son bureau, au bout du couloir, après salle 3 · **Conditions** : `!flag('diplome') && world.division == 1`
**BRISSAC** *(DTN — neutre — un formulaire de dérogation, un tampon, pas de signature)*
« Sans diplôme, pas de banc en D1 ; six mois de dérogation, et un stage en janvier avec monsieur Corven. Les chiffres sont têtus, les joueurs aussi : le septième mois, le papier ou la porte. »
← **Six mois, et le stage** — effets : direction +, caisse −, relation.brissac +1, set: derogation, outcome: derogation — *Six mois. Le stage est en janvier. Corven t'attend à sept heures ; tu le sais déjà.*
→ **Le président arrangera ça** — effets : direction ++, relation.brissac −2, set: diplome_arrange — *Le président appelle Berthomier. Le tampon arrive sans signature. Elle range le formulaire dans un dossier à ton nom ; le dossier n'est pas fermé.*
**Traces** : derogation, diplome_arrange (§ 5.2 #21) · **Réactions déclenchées** : — · **Lu plus tard par** : 11 (`en.diplome` : le stage, l'examen), 15 (Brissac ressort le dossier), 11 (`en.dossier_meneche` variante), 20 (« LE COACH SANS PAPIER »), 30 (Carrefour)

### SCÈNE jp.brissac.trop_lent  —  Trop lent
**Rôle** : joueur · **Intrigue** : co.brissac_chiffres · **Étape** : 1/6 (variante joueur) · **Moment** : saison 0, [4,10] · **Lieu** : le centre national, un couloir de trente mètres, un chronomètre · **Conditions** : `gauges.tribunes >= 50 && !flag('international')`
**BRISSAC** *(DTN — neutre — elle lit le chronomètre sans le montrer)*
« Le recruteur de Valdorne a écrit « trop lent » sous la pluie, et mon chiffre dit pareil au sec. Les chiffres sont têtus, les joueurs aussi : vous courez encore, ou vous me montrez autre chose ? »
← **Je cours encore** — effets : force +1, tribunes −, relation.brissac +1, set: trop_lent_couru — *Tu cours. Le chiffre est le même. Elle note « têtu » à côté ; c'est un compliment, chez elle.*
→ **Je vous montre autre chose** — effets : force +2, tribunes +, relation.brissac +1, relation.barbier −1, set: trop_lent_autre — *Vingt minutes avec un ballon. Berthomier l'appelle le lendemain.*
**Traces** : trop_lent_couru, trop_lent_autre (« {annee} : « trop lent », disait le chiffre. {prenom} {nom} a montré autre chose ; Brissac a rangé le chronomètre. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 10 (`jp.selection` : Berthomier appelle), 02 (Barbier : « l'œil contre le chiffre »), `jp.corps.la_liste` (existant : variante « la patte gauche »)

### SCÈNE sl.brissac.naturalise  —  Le naturalisé
**Rôle** : selectionneur · **Intrigue** : co.brissac_chiffres · **Étape** : 2/6 · **Moment** : fenêtre de mars, `year >= 2002` · **Lieu** : son bureau, un passeport tout neuf sur la table, un joueur qui attend dans le couloir · **Conditions** : —
**BRISSAC** *(DTN — neutre — le passeport ouvert à la page de la photo, prise hier)*
« Un attaquant né ailleurs, naturalisé mardi, vingt buts cette saison, et un ministre qui aimerait qu'il joue en juin. Les chiffres sont têtus, les joueurs aussi, coach ; les passeports, moins. »
← **Il est dans la liste** — effets : force +2, tribunes +, vestiaire −, relation.brissac −1, relation.fauvel −1, set: naturalise_appele — *Il marque en juin. Fauvel chante pour deux. Vence demande s'il connaît l'hymne ; il le connaît mieux que Dembo.*
→ **Pas de passeport de mardi** — effets : force −1, vestiaire ++, relation.brissac +1, relation.aubert −1, set: naturalise_refuse — *Il joue pour un autre pays en septembre, contre vous. Il marque. Il ne célèbre pas ; ça devient une mode.*
**Traces** : naturalise_appele, naturalise_refuse (« {annee} : le sélectionneur a refusé l'attaquant naturalisé de mardi. Il a marqué contre les Cobalts en septembre. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 14 (la Liste, le ministre veut venir dans le vestiaire), 02 (Aubert), 20 (« LE PASSEPORT DE MARDI »)

### SCÈNE sl.brissac.binational  —  Le binational dans la liste
**Rôle** : selectionneur · **Intrigue** : co.brissac_chiffres · **Étape** : 3/6 · **Moment** : fenêtre de septembre, `year >= 2004` · **Lieu** : le couloir, deux téléphones qui sonnent dans son bureau, elle ne décroche ni l'un ni l'autre · **Conditions** : `flag('binational_choisi') == null` sur un joueur de la liste, ou un binational générique
**BRISSAC** *(DTN — neutre — deux courriers, un de chaque fédération, posés face à face)*
« Deux fédérations pour un joueur de dix-neuf ans, et la nôtre veut un match officiel avant novembre pour le bloquer. Les chiffres sont têtus, les joueurs aussi : vous le bloquez, ou il choisit ? »
← **Dix minutes, il est bloqué** — effets : tribunes +, direction +, vestiaire −, relation.brissac +1, set: binational_bloque — *Dix minutes. Il joue pour vous dix ans ; il ne chante pas l'hymne.*
→ **Il choisit à vingt et un ans** — effets : tribunes −, vestiaire +, relation.brissac −1, set: binational_libre — *Il choisit l'autre pays. Ou le vôtre. Il chante l'hymne qu'il a choisi ; ça s'entend.*
**Traces** : binational_bloque (14), binational_libre (« {annee} : le sélectionneur a laissé un binational choisir. Il a chanté l'hymne qu'il a choisi. ») · **Réactions déclenchées** : co.re.mere_mbako_kambara (§ 8.8, variante « mes vingt fils ») · **Lu plus tard par** : 14 (`binational_bloque`), 10 (`binational` : le postulat), 15 (les fédérations se disputent), 20 (« BLOQUÉ EN DIX MINUTES »)

### SCÈNE in.brissac.primes_egales  —  Les primes égales
**Rôle** : instance · **Intrigue** : co.brissac_chiffres · **Étape** : 4/6 · **Moment** : un dossier de l'année, `year >= 2016` · **Lieu** : la salle du comité, un dossier de trois centimètres, une colonne de chiffres soulignée · **Conditions** : —
**BRISSAC** *(présidente de Mirevaux, commission technique — neutre — elle ouvre le dossier à la page des primes)*
« Les Cobaltes ont gagné et touché un dixième de la prime des Cobalts, qui ont perdu. Les chiffres sont têtus, les joueuses aussi, monsieur le président : l'égalité, ou la colonne ? »
← **L'égalité, je signe** — effets : caisse −−, tribunes ++, direction −, relation.brissac +2, relation.fauvel +1, set: primes_egales, outcome: primes — *Tu signes. Vence titre ; Massenet « ne commente pas ».*
→ **La colonne, pour cette année** — effets : caisse +, tribunes −−, relation.brissac −2, set: primes_inegales — *Tu signes la colonne. La colonne fait la Une ; pas la tienne.*
**Traces** : primes_egales, primes_inegales (« {annee} : primes inégales maintenues. Les Cobaltes ont joué en blanc ; elles ont gagné. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 15 (dossier égalité des primes ; `reforme_votee`), 20 (« À PRIME ÉGALE » / « EN BLANC »), 31 (Nouvelle 2016), § 6 (Mbako : « j'avais signé pour une école »)

### SCÈNE en.brissac.mirevaux  —  Mirevaux, année un
**Rôle** : entraineur, president · **Intrigue** : co.brissac_chiffres · **Étape** : 5/6 · **Moment** : `year >= 2016`, [1,4] (ouverture de `section_feminine` si le postulat est joué ; sinon une carte de rôle) · **Lieu** : le stade de la Halle, une buvette, un vestiaire où les joueuses arrivent en tenue de travail · **Conditions** : `chars.brissac.statut != 'mort'`
**BRISSAC** *(présidente de Mirevaux — neutre — le cahier à colonnes, la colonne « emploi » remplie, la colonne « budget » presque vide)*
« Onze joueuses qui ont un emploi, un budget de buvette, et des caméras mardi pour ce que personne n'a filmé en soixante-cinq. Les chiffres sont têtus, les joueuses aussi : le jeu, ou les caméras ? »
← **Par le jeu, caméras après** — effets : vestiaire ++, tribunes −, caisse −, relation.brissac +2, set: mirevaux_jeu — *Mardi, les caméras filment un entraînement à dix-huit heures, après le travail. C'est le premier film. Elle le regarde trois fois.*
→ **Par les caméras, le budget** — effets : caisse ++, tribunes +, vestiaire −, relation.brissac −1, set: mirevaux_cameras — *Mardi, les caméras filment une conférence de presse. Les joueuses sont en retard : elles travaillaient. Le budget monte ; le jeu attend.*
**Traces** : mirevaux_jeu, mirevaux_cameras (« {annee} : à Mirevaux, les caméras avant le jeu. Les joueuses sont arrivées en retard : elles travaillaient. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 11 (`section_feminine` : fil rouge `budget / emploi / medias`), 20 (« ANNÉE UN »), 15 (la section féminine et l'égalité)

### SCÈNE sl.brissac.liste_de_jeunes  —  La liste des jeunes (sixième scène)
**Rôle** : selectionneur, entraineur · **Intrigue** : co.brissac_chiffres · **Étape** : 6/6 · **Moment** : fenêtre de juin, ou [8,14] pour l'entraîneur · **Lieu** : son bureau, la liste des espoirs, un nom que tu connais, entouré · **Conditions** : `chars.mbako.age <= 19` ou un jeune de ton club
**BRISSAC** *(DTN — neutre — le stylo posé sur le nom entouré)*
« Votre jeune a seize ans, trente matchs, et une mère qui dit qu'il n'a besoin de personne ; espoirs, ou un an de plus chez vous. Les chiffres sont têtus, les mères plus que tout. »
← **Prenez-le, il est prêt** — effets : tribunes +, vestiaire −, relation.brissac +1, relation.mere_mbako −1, set: jeune_espoirs — *Il part chez les espoirs. Il marque. Fardelli tourne dès le lendemain ; le prix double.*
→ **Un an de plus chez moi** — effets : vestiaire +, force +1, relation.brissac −1, relation.mere_mbako +1, set: jeune_garde_un_an — *Un an. Elle le prend en juin.*
**Traces** : jeune_espoirs, jeune_garde_un_an (« {annee} : {prenom} {nom} a gardé son jeune un an de plus. Brissac a attendu ; elle a des chiffres pour ça. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 11 (`en.prodige` : variante « il est chez les espoirs »), 12 (le prix), § 6 (Mbako : « vous m'avez gardé »)

### 15.5 Les paliers
### SCÈNE co.brissac.trahison_dossier  —  Le tampon sans signature
**Rôle** : entraineur, selectionneur, instance · **Intrigue** : palier −3 · **Étape** : on_relation −3 · **Moment** : programmé en [1,3] · **Lieu** : salle 3, un dossier à ton nom, ouvert à la page d'un tampon · **Conditions** : `relation.brissac <= -3`, une fois par carrière
**BRISSAC** *(DTN — noir — elle a apporté ses lunettes, pour lire à voix haute)*
« Votre dérogation de quatre-vingt-dix a un tampon et pas de signature ; je rouvre le dossier. Les chiffres sont têtus, {pg, select, f{madame} other{monsieur}} {nom} ; les procès-verbaux aussi. »
← **Je demande un avocat** — effets : direction −−−, tribunes −, set: dossier_diplome_rouvert — *Camille, si elle est avocate, plaide ; sinon Maître Vidal. Le tampon est faux. La signature manquante était celle de Berthomier, qui « verra ça après le Congrès ».*
→ **Je demande un avocat** — effets : direction −−−, tribunes −, set: dossier_diplome_rouvert — *Camille, si elle est avocate, plaide ; sinon Maître Vidal. Le tampon est faux. La signature manquante était celle de Berthomier, qui « verra ça après le Congrès ».*
**Traces** : dossier_diplome_rouvert (« {annee} : Brissac a rouvert le dossier du diplôme de {nom}. Un tampon, pas de signature. ») · **Lu plus tard par** : 15 (`fede_dossier`), 11 (`en.dossier_meneche`), 20 (« LE COACH SANS PAPIER, DIX ANS APRÈS »), 30 (fins judiciaires), § 4 (Camille : secours avocate, variante)

### SCÈNE co.brissac.faveur_stage  —  Signé, tamponné
**Rôle** : entraineur, joueur · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : son bureau, un diplôme, deux tampons, une signature · **Conditions** : `relation.brissac >= 3`, une fois par carrière
**BRISSAC** *(DTN — sourire — c'est la seule fois où elle tutoie)*
« Le diplôme, signé et tamponné, sans stage : tu l'as, le jeu, je l'ai chronométré ; la première fois, c'était Corven. Les chiffres sont têtus, {prenom} ; moi aussi, deux fois par carrière. »
← **Je le prends, merci** — effets : direction ++, vestiaire +, relation.brissac +1, set: diplome, set: diplome_brissac — *Tu le prends. Corven, s'il vit, en rit au bar. Berthomier demande qui a signé ; c'est elle ; il ne dit rien.*
→ **Je fais le stage quand même** — effets : relation.brissac +2, relation.clow +1, direction +, set: diplome, set: clow_stage — *Tu fais le stage. Elle vient le dernier jour. Elle s'assoit au fond et chronomètre Corven ; il parle exactement une heure.*
**Traces** : diplome (∃), diplome_brissac (« {annee} : diplôme signé par Brissac sans stage. Deuxième fois en trente ans ; la première, Corven. ») · **Lu plus tard par** : 30 (Carrefour « tu as le papier »), 11 (`en.diplome` : exclusion), § 5 (Corven : `co.clow.trois_verres` variante « elle t'a signé sans stage »)

### 15.6 Les retrouvailles
### SCÈNE co.retrouvailles.brissac_sourire  —  Le chronomètre
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les deux meilleures relations · **Lieu** : le couloir de la Fédération, un chronomètre à la main
**BRISSAC** *(sa fonction du moment — sourire — un chronomètre, le même depuis 1988)*
« Nouveau poste, et je vous ai chronométré depuis le couloir : vous marchez plus vite qu'avant, {prenom}. Les chiffres sont têtus, les joueurs aussi ; vous, vous avez cédé un peu, c'est bien. »
**OK** **Chronométrez-moi encore** — effets : force +1, relation.brissac +1 — *Elle chronomètre. Le chiffre est bon. Elle ne le dit pas ; elle range l'appareil ; ça veut dire oui.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.brissac_noir  —  Le dossier suit
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les pires relations · **Lieu** : son bureau, après salle 3, un dossier épais
**BRISSAC** *(sa fonction du moment — noir — un dossier à ton nom, plus épais qu'avant)*
« Votre dossier m'a suivie ; une page de plus par poste, et vous en changez souvent, {pg, select, f{madame} other{monsieur}} {nom}. Les chiffres sont têtus, les procès-verbaux aussi, et je les lis. »
**OK** **Lisez, il n'y a rien** — effets : relation.brissac +1, direction − — *Elle lit. « Presque », dit-elle.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.brissac_cahier  —  Soixante-deux
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : 2036, une fois (`chars.brissac.statut == 'mort' || (chars.brissac.statut == 'parti' && flag('brissac_mort'))`) · **Conditions** : `relation.brissac >= 1` · **Lieu** : le secrétariat de la Fédération, un cahier toilé sur le comptoir
**MADAME JOSIANE ou la petite Josiane** *(secrétaire — neutre — un cahier à colonnes, couverture toilée, 1962)*
« Madame Brissac a laissé son cahier de soixante-deux, des chiffres, aucune image ; votre nom est à la dernière page. J'en ai vu passer, vous savez ; pas des cahiers comme ça. »
← **Je lis le chiffre** — effets : tribunes +, relation.brissac +1 (posthume), set: cahier_brissac — *Le chiffre est bon. Tu ne sauras jamais ce qu'il mesure. Tu le crois ; tout le monde a fini par croire les siens.*
→ **Il va aux archives** — effets : direction + — *Il va aux archives. Sacha, si elle est à l'ONG, le fait numériser. Les chiffres sont têtus ; les images, enfin, existent.*
**Traces** : cahier_brissac (objet héritable ; « 2036 : le cahier de soixante-deux de Solange Brissac est allé à {prenom} {nom}. Aucun chiffre vérifié, tous justes. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (lignée : objet), 15 (la sélection féminine : « les chiffres de 1962 existent »), 31

### 15.7 Anecdotes
- **01.brissac_cahier_1962** — objet · retrouvailles · Le cahier à colonnes de 1962-1971 : quarante-deux sélections, buts, passes, kilomètres estimés au pas ; aucune ligne n'a jamais été vérifiée ; toutes sont justes.
- **01.brissac_voiture** — décor · brèves · Une voiture de fonction de la Fédération qu'elle conduit elle-même, avec un chronomètre sur le tableau de bord ; elle chronomètre le trajet ; elle le bat.
- **01.brissac_superstition** — légende · toute scène · Elle ne s'assoit jamais dans la tribune présidentielle ; elle regarde depuis le couloir, debout, « on voit mieux les courses ».
- **01.brissac_repas** — décor · `sl.brissac.naturalise` · Un sandwich au bureau, coupé en quatre, un quart par dossier.
- **01.brissac_clow** — légende · `co.brissac.faveur_stage` · Le diplôme de Corven (1989) a une signature de Brissac et un chiffre truqué ; Corven le sait ; il dit que c'est la seule tricherie de sa vie, et qu'elle n'était pas de lui.

---

## 16. GÉRARD  (`gerard`)
**Fonction** : bénévole de la buvette, trésorier · **Genre** : m · **Âge en 1990** : 61 · **Camp** : terrain · **Fenêtre** : 1990-2004 (buvette et caisse de Trébignac ou de {club} amateur), « Gérard a fui » (2004 au plus tard, ou jamais si `gerard_merci`), retour repenti en 2005 (buvette des anciens du club pro) ; il meurt en 2019, derrière la buvette, la boîte en fer fermée · **Suivant** : Marinette, sa femme (voix sans portrait), qui tient la buvette pendant la fuite et après ; elle n'a jamais touché à la caisse, elle a un autre tiroir
**Tic** : « Ici, on payait en bières. » — torsions : « Ici, on payait en bières. Maintenant on paie. » · « Là-bas, on paie en soleil. » · « Ici, on paie en merci, et personne n'a de monnaie. »
**Désir** : que rien ne change · **Blessure** : il a tout donné pendant vingt ans et personne n'a dit merci ; un jour il part avec la caisse (carte existante `en.evt.gerard`, qui dit un pays : les répliques nouvelles disent « au soleil », « loin »)
**Adresse** : entraineur : petit / président / {nom} · joueur amateur : petit / petit / {nom} · autres : § 0.1
**Ce qu'il pense de toi** : à +2 « tu as dit merci, c'est la première fois en vingt ans » ; à 0 « on verra à la troisième mi-temps » ; à −2 « la caisse est à moi, je l'ai remplie »
**Paliers** : −3 → `pr.gerard.trahison_caisse` · +3 → `co.gerard.faveur_bas_de_laine`
**Dans les rôles** : président amateur : chœur et créancier (la caisse, la buvette après 22 h, « Gérard a fui » ; 2) · joueur amateur : chœur (la troisième mi-temps ; 1,5) · entraîneur : l'événement existant (0,5) · président pro : le repenti (buvette des anciens, 2005+ ; 1) · instance : absent
**Trajectoire 1990 → 2050** : 1990-1999 · 61-70 ans, casquette de toile, tablier, la boîte en fer, le tabouret derrière le comptoir ; il compte en bières · 2000-2009 · gris depuis toujours ; canne (2004) ; la fuite (2004 au plus tard) « au soleil », ou pas ; retour repenti (2005), buvette des anciens, il paie les bières qu'il a bues · 2010-2019 · il tient la buvette des anciens avec Gigi et Bréhaut ; il dit merci à tout le monde, à la fin ; meurt en 2019, derrière le comptoir, la boîte fermée · 2020-2050 · Marinette, puis la petite Josiane, puis personne ; « Ici, on payait en bières » est peint sur le volet de la buvette de Trébignac ; le stade s'appelle toujours Gérard-Blanchet, ce n'est pas lui (§ 16.7)
**Retrouvailles** : `co.retrouvailles.gerard_sourire` / `_noir` / `_carte_postale`
**Cartes propres** : *La troisième mi-temps* (01) · *La buvette après vingt-deux heures* (01) · *La boîte en fer* (01) · *Merci* (01) · *La carte postale* (01) · *Le repenti* (01) · *Gérard a fui* (existant, `en.evt.gerard` ; 13 côté président amateur) · *Le club de ton enfance* (30, Carte Destin)

### 16.1 Identité et place
Gérard ; « Gégé » est pris ; on dit « Gérard de la buvette » quand il y a un doute, et il y a toujours un doute. 61 ans en 1990, 71 en 2000, 81 en 2010, 90 à sa mort. **Portrait** : la casquette de toile beige, le tablier bleu, la boîte en fer rouge sous le bras (elle ne le quitte pas), le tabouret. **Voix** : lente, du village, un peu sourde ; il répète la fin de tes phrases pour être sûr ; il compte à voix haute. Au club, il est la trésorerie : la buvette (12 000 francs par saison, « dont neuf mille en bières »), la caisse, les merguez, la licence qui dit 22 h et le rideau qui dit minuit. Il trace les lignes le samedi matin, il lave les maillots le dimanche soir, et personne ne dit merci.

**Désir / besoin / blessure / secret.** Désir : que rien ne change, surtout pas lui. Besoin : un merci. Blessure : vingt ans, zéro merci. Secret : la boîte en fer a un double fond ; il y a une enveloppe pour « le jour où » ; le jour où est arrivé, ou pas.

### 16.2 Les cinq registres
- **−3** — « La caisse est à moi, {nom} ; je l'ai remplie, bière par bière. Ici, on payait en bières ; là où je vais, on paie en soleil. » / « Vingt ans. Zéro merci. La boîte part avec moi. »
- **−2 / −1** — « Ici, on payait en bières. Toi, tu paies en factures. » / « Le rideau ferme à vingt-deux heures, président. C'est écrit ; c'est toi qui l'as écrit. »
- **0** — « Ici, on payait en bières. La licence dit vingt-deux heures ; la caisse dit minuit. » / « Deux cents merguez pour dimanche. Tu comptes, ou je compte ? »
- **+1 / +2** — « Petit, tu as dit merci. C'est la première fois en vingt ans ; assieds-toi, c'est offert. » / « J'ai un bas de laine. Ici, on payait en bières ; moi, j'ai gardé les billets. »
- **+3** — « Le bas de laine est sur le comptoir, président ; il y a de quoi tenir jusqu'en mars. Ici, on payait en bières ; on paiera en merci. » / « Je ne pars pas. J'avais un billet ; je l'ai donné à Marinette, elle va voir la mer. »

### 16.3 Rapports avec les autres
**Alliés** : Dédé (le coach bénévole : trente ans de samedis), Vecchio (la buvette des anciens, 2005+), Paulette (il lui garde une chaise et une orange), Josiane (qui compte aussi, et qui a un tiroir). **Rivaux** : Pichon (« le pain, c'est à cinq heures ; la caisse, c'est après » : ils se disputent l'heure), Dupuis (le boucher-sponsor veut ses merguez, pas celles de Gérard), Aubert (la licence de 22 h). **Dettes** : il doit à tout le monde un rideau baissé à l'heure ; tout le monde lui doit un merci ; Gégé lui doit les bières du local depuis 1994. **Il aime** : les gamins qui rangent les ballons sans qu'on le leur demande ; il en a compté trois en trente ans.

### 16.4 INTRIGUE co.gerard_boite  —  La boîte en fer
**Logline** : Gérard tient la buvette et la caisse depuis vingt ans ; on lui dit merci, ou il part au soleil avec la boîte, et revient repenti tenir la buvette des anciens. · **Synopsis** : Joueur amateur, tu paies en bières à la troisième mi-temps. Président amateur, la buvette ferme à 22 h sur le papier. Il te montre la boîte en fer, ou pas. Un soir, tu lui dis merci, ou pas. Une carte postale arrive, du soleil. En 2005, il revient, repenti, et demande la buvette des anciens.
**Rôle(s)** : joueur_amateur, president_amateur, entraineur, president · **Postulat(s)** : village_endette, fusion_imposee, coupe_du_village, lache_academie, geant_dechu, rachete_fonds · **Porteur** : gerard · **Cast** : gerard, dede, pichon, dupuis, aubert, vecchio, marinette (voix) · **Thème** : argent
**Saisons** : "0" (troisieme_mi_temps, buvette_22h), "1" (boite, merci), "2+" (carte_postale après `gerard_parti`, repenti 2005+) · **Conditions d'entrée** : `chars.gerard.statut in [club, parti, staff]` selon l'étape · **Exclusions** : `en.evt.gerard` (existant) la même saison · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `merci` → `gerard_merci` (« {annee} : {prenom} {nom} a dit merci à Gérard. Une première en vingt ans ; il s'est assis. ») → lue par 13 (« Gérard a fui » : si `gerard_merci`, il laisse un mot et la moitié de la caisse ; variante), 30 (Carte Destin « Le club de ton enfance » : « et la caisse »), 20 (Écho, « Au local ») · `parti` → `gerard_parti` (13 la déclare ; ce chapitre la lit et l'écrit côté palier) → lue par 13, 11 (`en.evt.gerard` exclusion), 20 (« GÉRARD ET LA CAISSE, AU SOLEIL ») · `revenu` → `gerard_revenu` (« {annee} : Gérard est revenu du soleil. Il tient la buvette des anciens ; il paie ses bières. ») → lue par 07 (Vecchio : buvette des anciens), 02 (Bréhaut), 30 (`pr_buvette` plus), 90
**Séquencier** : troisieme_mi_temps (joueur amateur, S0, [2,8]) | buvette_22h (président amateur, S0, [2,8]) → boite (président amateur, S1, [4,10]) → merci (S1+, [8,15], tous rôles amateurs) → carte_postale (`flag('gerard_parti')`, S+1, [2,8]) → repenti (président pro, `year >= 2005`)
**Épilogue** : `caisse −` ; « {annee} : la buvette est restée à {club}. Gérard aussi, pour l'instant. »

### SCÈNE am.gerard.troisieme_mi_temps  —  La troisième mi-temps
**Rôle** : joueur_amateur · **Intrigue** : co.gerard_boite · **Étape** : 1/6 · **Moment** : saison 0, [2,8] · **Lieu** : la buvette, après le match, la boîte en fer ouverte, une ardoise · **Conditions** : —
**GÉRARD** *(buvette — neutre — il tend une bière et montre l'ardoise du menton)*
« Ici, on payait en bières : tu marques, tu en dois une ; tu rates, tu en dois deux, c'est plus juste. L'ardoise dit trois, petit ; tu règles ce soir, ou tu marques dimanche ? »
← **Je règle, en bières** — effets : caisse −, vestiaire ++, relation.gerard +1, set: paye_en_bieres — *Trois bières. Il efface bien ; il a l'habitude.*
→ **Je marque dimanche, effacé** — effets : vestiaire +, tribunes +, parole +1, promise, relation.gerard −1 — *Il n'efface pas. Il souligne. Dimanche, tu marques ou l'ardoise dit cinq ; il a un système.*
**Traces** : paye_en_bieres (« {annee} : à {club}, {prenom} {nom} a payé en bières. Gérard a effacé l'ardoise. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 10 (`village_endette` : le bistrot), 30 (`am_comptoir` plus), 13 (la buvette prend le pouvoir : variante)

### SCÈNE pr.gerard.buvette_22h  —  La buvette après vingt-deux heures
**Rôle** : president_amateur · **Intrigue** : co.gerard_boite · **Étape** : 1/6 (variante président) · **Moment** : saison 0, [2,8] · **Lieu** : la buvette, 22 h 05, le rideau à moitié baissé, trente personnes dedans · **Conditions** : —
**GÉRARD** *(buvette, trésorier — neutre — il tient le rideau d'une main, la boîte de l'autre)*
« La licence de la mairie dit vingt-deux heures, et la caisse dit que les deux tiers rentrent après. Ici, on payait en bières, président ; tu baisses le rideau, ou tu tournes la tête ? »
← **Je tourne la tête, minuit** — effets : caisse ++, tribunes +, relation.aubert −1, relation.gerard +1, set: buvette_minuit — *Minuit. Le stade, c'est de l'argent public ; la buvette, non.*
→ **Vingt-deux heures, la loi** — effets : caisse −−, tribunes −, relation.gerard −2, relation.aubert +1, set: buvette_loi — *Le rideau descend. Trente personnes finissent au bistrot d'en face. Gérard compte ce qu'il n'a pas gagné ; il a un système pour ça aussi.*
**Traces** : buvette_minuit, buvette_loi (« {annee} : la buvette de {club} ferme à vingt-deux heures. Le bistrot d'en face a remercié le président. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 13 (Aubert : la subvention, la licence), 30 (`pa_buvette`, `pa_magot`), 20 (Écho, « Au local »)

### SCÈNE pr.gerard.boite  —  La boîte en fer
**Rôle** : president_amateur · **Intrigue** : co.gerard_boite · **Étape** : 2/6 · **Moment** : saison 1, [4,10] · **Lieu** : la buvette fermée, un lundi, la boîte sur le comptoir, fermée à clé · **Conditions** : —
**GÉRARD** *(trésorier — neutre — la clé au bout d'une ficelle, autour du cou)*
« Vingt ans de comptes là-dedans, en bières et en billets, et personne n'a jamais demandé à voir. Ici, on payait en bières, président ; tu veux l'ouvrir, ou tu me fais confiance comme les autres ? »
← **Ouvre-la, on compte ensemble** — effets : caisse +, direction +, relation.gerard −1, set: boite_ouverte — *Vous comptez. Il manque trois cents francs et un merci. Il ne dit rien sur les trois cents ; il dit « bon » sur le reste.*
→ **Je te fais confiance, Gérard** — effets : caisse −, tribunes +, relation.gerard +2, set: boite_confiance — *Il remet la clé sous la chemise. « Bon », dit-il. Il te sert un verre ; il ne le note pas.*
**Traces** : boite_ouverte, boite_confiance (« {annee} : {prenom} {nom} n'a pas ouvert la boîte de Gérard. Il a eu un verre offert, le premier en vingt ans. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 13 (« Gérard a fui » : variante `boite_ouverte` → il part avec moins), pr.gerard.trahison_caisse (variante), 30 (`pa_magot` plus)

### SCÈNE co.gerard.merci  —  Merci
**Rôle** : joueur_amateur, president_amateur, entraineur · **Intrigue** : co.gerard_boite · **Étape** : 3/6 · **Moment** : saison 1+, [8,15] · **Lieu** : le terrain, un samedi matin, il trace les lignes seul, à la chaux · **Conditions** : `!flag('gerard_parti')`
**GÉRARD** *(bénévole — neutre — il ne s'arrête pas de tracer pendant qu'il parle)*
« Vingt ans que je trace les lignes le samedi et lave les maillots le dimanche, et personne n'a jamais dit le mot. Ici, on payait en bières, petit ; le mot, on ne le paie pas, on le dit, ou pas. »
← **Merci, Gérard** — effets : tribunes +, vestiaire +, relation.gerard +2, set: gerard_merci, outcome: merci — *Il s'arrête. La ligne est droite quand même.*
→ **Les lignes sont de travers** — effets : force +1, relation.gerard −2, set: gerard_pas_merci — *Il regarde les lignes. La boîte a un double fond ; il vérifie ce soir qu'il est plein.*
**Traces** : gerard_merci, gerard_pas_merci (« {annee} : personne n'a dit merci à Gérard. Il a vérifié le double fond de la boîte. ») · **Réactions déclenchées** : co.re.dede_merci (§ 17.8) · **Lu plus tard par** : 13 (« Gérard a fui » : variante ; si `gerard_merci` il laisse un mot), 30 (Carte Destin « le club de ton enfance »), 20 (Écho), 90

### SCÈNE co.gerard.carte_postale  —  La carte postale
**Rôle** : president_amateur, entraineur, president · **Intrigue** : co.gerard_boite · **Étape** : 4/6 · **Moment** : la saison qui suit `gerard_parti`, [2,8] · **Lieu** : le secrétariat, Josiane tend une carte : une plage, sans nom de lieu · **Conditions** : `flag('gerard_parti')` (`statut_ok: [parti]` : il écrit)
**GÉRARD** *(parti, au soleil — voix écrite, au dos de la carte — une écriture qui compte)*
« « Ici, on paie en soleil, et le soleil ne rend pas la monnaie ; la caisse a fondu, il reste la boîte, je la renvoie si quelqu'un dit le mot. » Pas de signature, un cachet de la poste illisible. »
← **J'écris le mot** — effets : caisse +, tribunes +, relation.gerard +2, set: gerard_mot_envoye — *Tu écris « merci ». La boîte arrive en mars, vide, avec le double fond intact : trois cents francs, et un billet de retour non utilisé.*
→ **Qu'il garde la boîte** — effets : direction +, relation.gerard −1, set: gerard_oublie — *Tu ne réponds pas. Josiane garde la carte dans le dossier Gérard. La buvette est tenue par Marinette ; elle a un autre tiroir.*
**Traces** : gerard_mot_envoye, gerard_oublie (« {annee} : la carte de Gérard est restée sans réponse. Marinette tient la buvette ; elle a un autre tiroir. ») · **Réactions déclenchées** : co.re.josiane_a_lu (existant, si Une) · **Lu plus tard par** : § 16 (`pr.gerard.repenti` : variante), 13, 20 (« LE SOLEIL NE REND PAS LA MONNAIE »)

### SCÈNE pr.gerard.repenti  —  Le repenti
**Rôle** : president · **Intrigue** : co.gerard_boite · **Étape** : 5/6 · **Moment** : `year >= 2005`, [2,10] · **Lieu** : la buvette des anciens du club pro, fermée, il attend devant avec un tablier plié · **Conditions** : `flag('gerard_parti') && chars.gerard.statut == 'parti'` (variante `_mot` si `gerard_mot_envoye`)
**GÉRARD** *(revenu, 76 ans — neutre — la boîte en fer, ouverte, vide, tendue comme une preuve)*
« Je suis revenu du soleil avec la boîte vide et une dette en bières que je vais payer, une par une. Ici, on payait en bières, président ; je demande la buvette des anciens, et je paie les miennes. »
← **Les anciens, c'est à toi** — effets : tribunes ++, direction −, caisse −, relation.gerard +2, set: gerard_revenu, char: {gerard: {statut: staff}}, outcome: revenu — *Il tient la buvette avec Gigi. Il paie ses bières. En 2019, il meurt derrière le comptoir ; la boîte est fermée ; le double fond est plein : c'est pour les gamins qui rangent les ballons.*
→ **On ne reprend pas un voleur** — effets : direction +, tribunes −, relation.gerard −2, set: gerard_refuse — *Il replie le tablier. Marinette le reprend chez elle. Il vient aux matchs, tribune Est, à côté de Paulette ; il ne boit rien ; il ne dit rien.*
**Traces** : gerard_revenu, gerard_refuse (« {annee} : Gérard refusé à la buvette des anciens. Il est venu en tribune Est, sans boire. ») · **Réactions déclenchées** : co.re.vecchio_garde (existant, variante « Gérard est revenu ») · **Lu plus tard par** : § 7 (Vecchio : buvette des anciens), 02 (Bréhaut), 30 (`pr_buvette` plus), 90 (mémoire des clubs +1 : « le repenti »)

### SCÈNE pr.gerard.merguez  —  Deux cents merguez (sixième scène)
**Rôle** : president_amateur · **Intrigue** : co.gerard_boite · **Étape** : 6/6 · **Moment** : la semaine d'un match de Coupe à domicile contre un gros (`coupe_du_village`), [1,3] · **Lieu** : la chambre froide de la buvette, Dupuis à la porte avec un bon de commande · **Conditions** : `flag('boucher_sponsor')` ou Dupuis présent
**GÉRARD** *(buvette — neutre — il compte les merguez à voix haute, il en est à cent quatre-vingts)*
« Deux mille personnes dimanche, deux cents merguez de chez moi, et le boucher veut vendre les siennes avec son nom. Ici, on payait en bières, président ; les merguez, c'est moi depuis soixante-dix. »
← **Celles de Gérard, sans nom** — effets : tribunes +, caisse −, relation.gerard +2, relation.dupuis −2, set: merguez_gerard — *Deux cents merguez. Il en manque à la mi-temps. Dupuis vend les siennes sur le parking ; « le meilleur du cochon » ; la recette est à lui.*
→ **Celles du boucher, son nom** — effets : caisse ++, relation.dupuis +2, relation.gerard −2, set: merguez_dupuis — *Six cents merguez, « DUPUIS » sur le barbecue. La recette est bonne. Gérard tient la bière ; il ne tient pas le barbecue ; il regarde ailleurs.*
**Traces** : merguez_gerard, merguez_dupuis (« {annee} : les merguez de Dupuis pour la Coupe. Gérard a tenu la bière et regardé ailleurs. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 13 (`coupe_du_village` : fil rouge `recette / fete / apres`), 02 (Dupuis), 20 (« LA RECETTE DU DIMANCHE »)

### 16.5 Les paliers
### SCÈNE pr.gerard.trahison_caisse  —  Gérard a fui (côté président amateur)
**Rôle** : president_amateur, joueur_amateur · **Intrigue** : palier −3 (l'entraîneur a `en.evt.gerard`, existant ; 13 harmonise) · **Étape** : on_relation −3 · **Moment** : programmé en [1,3] · **Lieu** : la buvette, un lundi, le tiroir vide, la boîte partie, un mot sur le comptoir · **Conditions** : `relation.gerard <= -3`, une fois par carrière
**GÉRARD** *(parti — voix écrite sur un dessous de verre — une écriture qui ne compte plus)*
« « Vingt ans, zéro merci, une caisse, et je pars au soleil, loin, avec la boîte ; ici, on payait en bières, là-bas je verrai. » Pas de signature, et le tabouret est resté. »
← **Je préviens la gendarmerie** — effets : caisse −−−, tribunes −, direction +, set: gerard_parti, char: {gerard: {statut: parti}} — *La gendarmerie buvait ici après vingt-deux heures. Elle prend la plainte. Elle ne cherche pas très loin ; le soleil, c'est vaste.*
→ **On étouffe, Marinette prend** — effets : caisse −−−, vestiaire +, set: gerard_parti, char: {gerard: {statut: parti}} — *Marinette tient la buvette dès samedi. Elle a un autre tiroir. Elle ne dit rien sur lui ; elle dit « ici, on paie ».*
*(Variante si `flag('boite_ouverte')` : il part avec moins ; `caisse −−`. Variante si `flag('gerard_merci')` : le mot dit « merci quand même », et la moitié de la caisse est dans le double fond.)*
**Traces** : gerard_parti (13) · **Lu plus tard par** : 13, 20 (« GÉRARD ET LA CAISSE, AU SOLEIL »), 30 (`pa_buvette` plus), `co.gerard.carte_postale`

### SCÈNE co.gerard.faveur_bas_de_laine  —  Le bas de laine
**Rôle** : president_amateur, joueur_amateur, entraineur · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : la buvette fermée, une enveloppe épaisse sur le comptoir, à côté de la boîte · **Conditions** : `relation.gerard >= 3`, une fois par carrière
**GÉRARD** *(trésorier — sourire — il a enlevé la casquette, ce qui ne se voit jamais)*
« Le bas de laine, trente ans de bières que j'ai bues moi-même et payées, il y a de quoi tenir jusqu'en mars. Ici, on payait en bières, président ; ce soir on paie en merci, et tu l'as déjà dit. »
← **Je prends, et je rembourse** — effets : caisse +++, tribunes +, parole +1, promise, relation.gerard +1, set: bas_de_laine — *Tu prends. Tu rembourses en juin, ou pas ; il ne compte plus celui-là. Il a un système ; il l'a arrêté.*
→ **Garde-le, c'est à toi** — effets : tribunes ++, relation.gerard +2, set: bas_de_laine_refuse — *Il range l'enveloppe. Il la donne à Marinette : elle va voir la mer. Lui reste ; il n'a jamais vu la mer, il a la buvette.*
**Traces** : bas_de_laine, bas_de_laine_refuse (« {annee} : {prenom} {nom} a refusé le bas de laine de Gérard. Marinette a vu la mer. ») · **Lu plus tard par** : 13 (la trésorerie : variante « le prêt de la buvette »), 30 (`pa_subvention` plus), 20 (Écho)

### 16.6 Les retrouvailles
### SCÈNE co.retrouvailles.gerard_sourire  —  Une bière, offerte
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les deux meilleures relations, `chars.gerard.statut != 'mort'` · **Lieu** : la buvette, une bière sans ardoise
**GÉRARD** *(sa fonction du moment — sourire — une bière, sans ardoise)*
« Tu es revenu, ou tu es passé, ça revient au même pour la buvette ; celle-là, elle n'est pas notée. Ici, on payait en bières, petit ; celle-là, c'est moi qui paie. »
**OK** **À la tienne, Gérard** — effets : tribunes +, relation.gerard +1 — *Vous buvez. Il ne compte pas. C'est la deuxième fois de sa vie.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.gerard_noir  —  L'ardoise
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les pires relations, `chars.gerard.statut != 'mort'` · **Lieu** : la buvette, l'ardoise tournée vers toi
**GÉRARD** *(sa fonction du moment — noir — une ardoise, ton nom dessus, un chiffre)*
« L'ardoise a suivi, {nom} ; elle dit cinq, avec le système, et elle ne s'efface pas d'ici. Ici, on payait en bières ; toi, tu ne payais pas. »
**OK** **Je règle les cinq** — effets : caisse −, relation.gerard +1 — *Il efface. Bien. Il ne dit pas merci ; ce n'est pas à lui de le dire.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.gerard_carte_postale  —  Le double fond
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : 2019, une fois (`chars.gerard.statut == 'mort' || (chars.gerard.statut == 'parti' && flag('gerard_mort'))`) · **Conditions** : `relation.gerard != 0` · **Lieu** : la buvette de Trébignac, la boîte en fer ouverte sur le comptoir
**MARINETTE** *(sa femme, buvette — voix sans portrait — la boîte en fer, ouverte, le double fond levé)*
« Il est mort derrière le comptoir, la boîte fermée, et il y a trois cents francs dans le double fond, plus un mot pour toi. Il disait qu'ici on payait en bières ; le mot dit « merci ». »
← **Je garde le mot** — effets : tribunes +, relation.gerard +1 (posthume), set: mot_gerard — *Tu le gardes. Trois cents francs ne valent plus rien ; le mot, si.*
→ **Les francs, pour les gamins** — effets : tribunes ++, vestiaire + — *Les gamins qui rangent les ballons ont trois cents francs qu'on ne peut plus dépenser. Ils les encadrent au-dessus de la buvette.*
**Traces** : mot_gerard (objet héritable ; « 2019 : le mot de Gérard, trouvé dans le double fond de la boîte. Il disait merci. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (lignée : objet), 31 (épitaphe d'enterrement de Gérard), 30 (`pa_buvette` plus)

### 16.7 Anecdotes
- **01.gerard_blanchet** — légende de club · `am.vecchio.trebignac`, Nouvelles · Le stade municipal Gérard-Blanchet de Trébignac ne porte pas son nom : Gérard Blanchet était un maire (1948-1971) ; Gérard de la buvette dit « c'est mon stade » quand même, et personne ne le contredit.
- **01.gerard_boite** — objet · toute scène · La boîte en fer rouge, une boîte de biscuits de 1969, un double fond ; la clé est au cou, la ficelle est celle d'un filet de but.
- **01.gerard_voiture** — décor · brèves · Une camionnette bâchée qui transporte les merguez, la chaux et les maillots ; elle n'a pas de contrôle technique depuis 1985 ; la gendarmerie boit à la buvette.
- **01.gerard_superstition** — légende · `co.gerard.merci` · Il trace la ligne de touche gauche en premier ; si la chaux manque, la droite est plus courte ; « personne n'a jamais rien dit ».
- **01.gerard_repas** — décor · `pr.gerard.merguez` · Une merguez froide à la fin du match, la dernière ; « celle-là, personne ne la paie ».

---

## 17. DÉDÉ  (`dede`)
**Fonction** : coach bénévole · **Genre** : m · **Âge en 1990** : 52 · **Camp** : terrain · **Fenêtre** : 1990-2012 (coach bénévole de Trébignac ou du club du village, adjoint bénévole si tu redescends, un gamin passé pro ou pas) ; il meurt en 2012, l'enterrement est une carte · **Suivant** : Bébert, son fils (voix sans portrait, né 1966), qui reprend le sifflet en 2012 et dit « bon, on va pas se mentir » sans y croire
**Tic** : « Bon, on va pas se mentir. » — torsions : « Bon, on va se mentir, une fois. » · « On s'est menti. Bon. » · « Bon, on va pas se mentir : je me suis menti. »
**Désir** : un gamin qui passe pro · **Blessure** : lui n'est jamais passé ; essai raté à Valdorne en 1961, sous la pluie ; Barbier n'y était pas encore, c'est pire, personne ne l'a vu
**Adresse** : joueur amateur : petit / {prenom} / le {numero} · entraineur : petit / {prenom} / {nom} · autres : § 0.1
**Ce qu'il pense de toi** : à +2 « toi, tu vas passer ; je le dis à personne, je le sais » ; à 0 « on verra dimanche, dans la boue » ; à −2 « le {numero}, tu as le talent et pas le samedi »
**Paliers** : −3 → `co.dede.trahison_montbeliac` · +3 → `co.dede.faveur_sifflet`
**Dans les rôles** : joueur amateur : patron (ton coach, le neveu du président, la gardienne ; 2,5) · président amateur : cœur (« le coach bénévole veut être payé » ; 1,5) · entraîneur : chœur (ton adjoint bénévole si tu redescends ; 1) · joueur pro : le téléphone après ton premier match en D1 (0,5) · tous, 2012 : l'enterrement (1)
**Trajectoire 1990 → 2050** : 1990-1999 · 52-61 ans, béret, coupe-vent, un sifflet en plastique, une voiture qui sent le chien ; le samedi, la boue, le neveu du président · 2000-2009 · gris depuis 1985 ; lunettes (1995) qu'il perd ; la gardienne (2001) ; un gamin passe pro (ou pas) ; il téléphone après le premier match en D1 · 2010-2012 · il tousse ; il vient quand même ; il meurt en 2012, au bord du terrain, après avoir sifflé la fin ; l'enterrement, Barbier en doudoune, Gigi, Pichon, tout le canton · 2013-2050 · Bébert a le sifflet ; le terrain de Trébignac s'appelle « terrain Dédé » sans que personne l'ait décidé
**Retrouvailles** : `co.retrouvailles.dede_sourire` / `_noir` / `_enterrement`
**Cartes propres** : *On va pas se mentir* (01) · *Le neveu du président* (01) · *La gardienne* (01) · *Le coach veut être payé* (01) · *Le téléphone après la D1* (01) · *L'adjoint bénévole* (01) · *Le sifflet* (30, Carte Destin amateur → entraîneur) · *Le type en doudoune* (10, `essai_pro`)

### 17.1 Identité et place
André, « Dédé » depuis l'école ; « le coach » pour les gamins, « Dédé » pour les parents, « monsieur André » pour Pichon quand ils se disputent. 52 ans en 1990, 62 en 2000, 72 en 2010, 74 à sa mort. **Portrait** : le béret, le coupe-vent bleu des années 70, le sifflet en plastique orange, une chaussure de foot et une botte quand il pleut. **Voix** : du canton, rapide, il commence par « bon » et finit par « voilà » ; il crie pendant le match et chuchote après. Au club, il est le samedi : il conduit le minibus, il fait la compo sur le capot, il siffle la fin de l'entraînement parce qu'il a le sifflet, et il regarde les tribunes en doudoune quand il y en a une.

**Désir / besoin / blessure / secret.** Désir : un gamin qui passe pro, un seul, et qu'il téléphone. Besoin : qu'on ne lui mente pas. Blessure : Valdorne, 1961, la pluie, un essai raté que personne n'a regardé. Secret : il a gardé le maillot de l'essai ; il le porte sous le coupe-vent les jours de match important ; il est trop petit depuis 1975.

### 17.2 Les cinq registres
- **−3** — « Bon, on va pas se mentir, {nom} : je prends Montbéliac, ils paient, et ils ont un vrai vestiaire. » / « Le sifflet, je le garde. Il va aux Sangliers. »
- **−2 / −1** — « Le {numero}, tu as le talent et pas le samedi. Bon, on va pas se mentir. » / « Le neveu joue. C'est pas moi, c'est le président ; bon, c'est moi aussi. »
- **0** — « Bon, on va pas se mentir : tes genoux, ton boulot, ton samedi, choisis-en deux. » / « Dimanche, dans la boue, à Boisnoir. On y va en minibus, on revient en minibus, ou à pied. »
- **+1 / +2** — « Petit, le type en doudoune, il est là pour toi ; bon, on va pas se mentir, je l'ai appelé. » / « J'ai vu dans la boue ce que Valdorne n'a pas vu en soixante et un. Va. »
- **+3** — « Bon, on va pas se mentir : tes genoux, c'est fini. Mon sifflet, il est à toi. » / « Tu as passé pro et tu as téléphoné. Personne ne téléphone. Bon. »

### 17.3 Rapports avec les autres
**Alliés** : Gérard (trente ans de samedis : la buvette et le sifflet), Pichon (le président-boulanger : ils se disputent l'heure et le neveu, ils s'aiment), Vecchio (qui vient à Trébignac à cinquante ans : Dédé le fait jouer sans lui demander), Barbier (« le type en doudoune » : Dédé l'appelle ; il vient parfois). **Rivaux** : le coach de Montbéliac (qui paie), Dupuis (qui veut choisir le capitaine : « le meilleur du cochon » ; « bon, on va pas se mentir, le cochon joue pas »), Aubert (la fusion). **Dettes** : il doit à un gamin de 1978 de ne pas avoir appelé Valdorne pour lui ; le gamin est devenu plombier, il s'appelle Bébert, c'est son fils. **Il aime** : la gardienne, qu'il a fait jouer en 2001 contre l'avis de tout le canton, et qui a gardé la cage propre.

### 17.4 INTRIGUE co.dede_sifflet  —  Mon sifflet est à toi
**Logline** : Dédé a raté un essai en 1961 et fait passer pro tous les samedis depuis ; un jour un gamin téléphone, un jour on lui propose Montbéliac, un jour il donne le sifflet. · **Synopsis** : Joueur amateur, il te dit de choisir deux choses sur trois. Le neveu du président doit jouer. La gardienne veut jouer chez les hommes. Président amateur, il veut être payé, ou au moins remboursé du minibus. Joueur pro, il téléphone après ton premier match en D1. Entraîneur redescendu, il est ton adjoint bénévole, et il a le sifflet.
**Rôle(s)** : joueur_amateur, president_amateur, joueur, entraineur · **Postulat(s)** : village_endette, lache_academie, fusion_imposee, coupe_du_village, pepite (le téléphone), interimaire (l'adjoint bénévole si National) · **Porteur** : dede · **Cast** : dede, pichon, gerard, barbier, la gardienne (voix), bebert (voix) · **Thème** : famille (le foot de village est une famille)
**Saisons** : "0" (on_va_pas_se_mentir, neveu), "1" (gardienne 2001+, paye), rôles : telephone (joueur pro, première D1), adjoint (entraîneur en National) · **Conditions d'entrée** : `chars.dede.statut != 'mort'` · **Exclusions** : — · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `pro` → `dede_gamin_pro` (« {annee} : un gamin de Dédé est passé pro. Il a téléphoné après son premier match ; Dédé a pleuré au téléphone. ») → lue par 10 (`essai_pro` variante « Dédé a appelé Barbier »), 30 (Carte Destin amateur → pro : « Dédé te regarde monter dans la voiture »), 20 (Écho, « Au local ») · `gardienne` → `gardienne_titulaire` (« {annee} : à {club}, une gardienne dans l'équipe fanion. Dédé l'a fait jouer ; le canton a regardé. ») → lue par 11 (`section_feminine` : « elle a commencé chez Dédé »), 15 (la commission technique : le règlement), 20 · `paye` → `dede_paye` (« {annee} : le coach bénévole est payé. Cent cinquante francs et le minibus ; il a demandé le minibus. ») → lue par 13 (`fusion_imposee` : Montbéliac paie plus), 30 (`pa_buvette` plus)
**Séquencier** : on_va_pas_se_mentir (joueur amateur, S0, [1,3]) → neveu (joueur amateur, S0, [4,9]) → gardienne (S1+, `year >= 2001`) → paye (président amateur, S1, [2,8]) → telephone (joueur pro, la semaine du premier match en D1) → adjoint (entraîneur, `world.division >= 3`)
**Épilogue** : `vestiaire −` ; « {annee} : Dédé est resté au village. Le minibus aussi. »

### SCÈNE am.dede.on_va_pas_se_mentir  —  On va pas se mentir
**Rôle** : joueur_amateur · **Intrigue** : co.dede_sifflet · **Étape** : 1/6 · **Moment** : saison 0, [1,3] · **Lieu** : le terrain en pente, le minibus, la compo sur le capot · **Conditions** : —
**DÉDÉ** *(coach bénévole — neutre — il écrit ton nom sur le capot avec le doigt, dans la poussière)*
« Bon, on va pas se mentir : tu as des genoux, un boulot et un samedi, et tu peux en garder deux. Le {numero}, c'est toi dimanche ; le patron du garage, c'est ton problème. »
← **Le samedi et les genoux** — effets : vestiaire +, caisse −, tribunes +, relation.dede +1, set: samedi_choisi — *Tu joues. Le patron du garage te retient l'heure. Dédé le sait ; il t'a mis titulaire quand même ; il écrit « bon » sur le capot.*
→ **Le boulot d'abord, tard** — effets : caisse +, vestiaire −, relation.dede −1, set: boulot_choisi — *Tu arrives à la mi-temps. « Bon », dit-il ; ce n'est pas un compliment, c'est un constat.*
**Traces** : samedi_choisi, boulot_choisi (chapitre 10, `village_endette` : fil rouge `boulot / copains / village`) · **Réactions déclenchées** : — · **Lu plus tard par** : 10 (le script amateur), 30 (`am_touche`, `am_patron_non` plus)

### SCÈNE am.dede.neveu  —  Le neveu du président
**Rôle** : joueur_amateur · **Intrigue** : co.dede_sifflet · **Étape** : 2/6 · **Moment** : saison 0, [4,9] · **Lieu** : le vestiaire préfabriqué, un gamin en crampons neufs qui ne sait pas les lacer · **Conditions** : —
**DÉDÉ** *(coach bénévole — neutre — il regarde le gamin, puis toi, puis le plafond)*
« Le neveu du président joue dimanche, à ta place ou à celle d'un autre ; la boulangerie paie les maillots. Bon, on va pas se mentir : tu lui laisses le poste, ou tu lui apprends à lacer ? »
← **Je lui apprends à lacer** — effets : vestiaire ++, direction −, relation.dede +2, relation.pichon −1, set: neveu_lace — *Tu laces. Il joue arrière droit ; il est mauvais ; il est heureux. Pichon te fait un pain gratuit ; il ne le dit pas.*
→ **Il prend ma place, je bosse** — effets : direction +, vestiaire −, tribunes −, relation.dede −1, set: neveu_titulaire — *Il joue à ta place. Dédé dit « bon » ; il n'écrit rien sur le capot.*
**Traces** : neveu_lace, neveu_titulaire (« {annee} : le neveu du président titulaire à {club}. On a perdu ; on a mangé du pain gratuit. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 10 (`village_endette` : Pichon), 02 (Pichon : « le pain, c'est à cinq heures »), 30 (`am_chouchou` plus)

### SCÈNE co.dede.gardienne  —  La gardienne
**Rôle** : joueur_amateur, president_amateur, entraineur · **Intrigue** : co.dede_sifflet · **Étape** : 3/6 · **Moment** : saison 1+, `year >= 2001`, [3,10] · **Lieu** : la cage, une fille de dix-neuf ans avec des gants trop grands, ceux de Gigi peut-être · **Conditions** : —
**DÉDÉ** *(coach bénévole — neutre — il ne regarde pas le canton, qui regarde)*
« La gardienne arrête tout depuis septembre et le règlement du district ne dit rien ; le canton, lui, dit beaucoup. Bon, on va pas se mentir, petit : elle joue dimanche, tu la défends ? »
← **Elle joue, je la défends** — effets : vestiaire +, tribunes −, relation.dede +2, set: gardienne_titulaire, outcome: gardienne — *Elle joue. Brissac l'apprend ; elle note.*
→ **Pas cette fois, le canton** — effets : tribunes +, vestiaire −, relation.dede −2, set: gardienne_banc — *Elle reste sur le banc. Elle part à Mirevaux en 2008 ; elle y est titulaire ; elle ne revient jamais au village, sauf pour l'enterrement de Dédé.*
**Traces** : gardienne_titulaire, gardienne_banc (« {annee} : la gardienne de Dédé sur le banc. Elle est partie à Mirevaux ; elle n'est revenue que pour l'enterrement. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 11 (`section_feminine` : « elle a commencé chez Dédé »), 15 (Brissac : la commission technique), 02 (Roux : le district « examine »), 20 (Écho : « LA GARDIENNE DU CANTON »)

### SCÈNE pr.dede.paye  —  Le coach veut être payé
**Rôle** : president_amateur · **Intrigue** : co.dede_sifflet · **Étape** : 4/6 · **Moment** : saison 1, [2,8] · **Lieu** : la buvette, Gérard qui écoute en essuyant un verre, Dédé debout · **Conditions** : —
**DÉDÉ** *(coach bénévole — neutre — un carnet d'essence, tenu depuis 1979)*
« Montbéliac paie son coach cent cinquante par mois ; moi je paie le minibus depuis soixante-dix-neuf, c'est écrit là. Bon, on va pas se mentir, président : tu me paies, ou tu me dis merci ? »
← **Cent cinquante et le minibus** — effets : caisse −−, vestiaire ++, relation.dede +2, set: dede_paye, outcome: paye — *Il est payé. Il ne change rien. Il achète des plots neufs avec les cent cinquante ; le minibus sent toujours le chien.*
→ **Merci, Dédé, et rien** — effets : caisse +, relation.dede −1, relation.gerard +1 (il a entendu le merci), set: dede_benevole — *Il continue. Gérard a entendu « merci » ; il regarde Dédé ; Dédé regarde le carnet. Montbéliac appelle en janvier.*
**Traces** : dede_paye, dede_benevole (« {annee} : Dédé reste bénévole. Montbéliac a appelé en janvier ; il n'a pas répondu, cette fois. ») · **Réactions déclenchées** : co.re.dede_merci (§ 17.8, variante) · **Lu plus tard par** : 13 (`fusion_imposee` : Montbéliac paie), co.dede.trahison_montbeliac (variante « tu ne m'as pas payé »), 30 (`pa_buvette` plus)

### SCÈNE jp.dede.telephone  —  Le téléphone après la D1
**Rôle** : joueur · **Intrigue** : co.dede_sifflet · **Étape** : 5/6 · **Moment** : la semaine du premier match en D1, [1,3] · **Lieu** : ton téléphone, tard, un fond de buvette · **Conditions** : `role_was('joueur_amateur') && world.division == 1` (`statut_ok: [club, retraite]`)
**DÉDÉ** *(coach bénévole — voix au téléphone — il a regardé le match à la buvette, sur la télé de Gérard)*
« Bon, on va pas se mentir, petit : tu as joué vingt minutes en D1 et tu as touché trois ballons, j'ai compté avec Gérard. Personne ne téléphone après ; toi, tu décroches, c'est déjà ça. »
← **Trois ballons, un début** — effets : vestiaire +, tribunes +, relation.dede +2, set: dede_gamin_pro, outcome: pro — *Il ne dit rien pendant dix secondes. Puis « bon ». Puis il pleure, un peu, et il dit que c'est la buvette qui pique.*
→ **Je rappelle après la saison** — effets : direction +, relation.dede −2, set: dede_pas_rappele — *Tu ne rappelles pas. Il n'appelle plus. Il regarde tous tes matchs à la buvette ; il compte les ballons ; il le dit à Gérard.*
**Traces** : dede_gamin_pro, dede_pas_rappele (« {annee} : {prenom} {nom} n'a pas rappelé Dédé. Dédé a compté ses ballons à la buvette, toute la saison. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 30 (Carte Destin amateur → pro), 20 (Écho, « Au local » : « il a compté trois ballons »), co.retrouvailles.dede_enterrement (variante), 90 (mémoire du village)

### SCÈNE en.dede.adjoint  —  L'adjoint bénévole
**Rôle** : entraineur · **Intrigue** : co.dede_sifflet · **Étape** : 6/6 · **Moment** : saison 0-1, [1,4] · **Lieu** : un terrain de National, il t'attend avec le minibus et le sifflet · **Conditions** : `world.division >= 3 && role_was('joueur_amateur')` ou club = Trébignac
**DÉDÉ** *(coach bénévole — sourire — le sifflet orange tendu, puis retiré)*
« Tu redescends avec ton diplôme, et moi j'ai le minibus, le sifflet et trente ans de samedis. Bon, on va pas se mentir, {prenom} : je suis ton adjoint, mais le sifflet reste à moi. »
← **Le sifflet est à toi, Dédé** — effets : vestiaire ++, tribunes +, force −1, relation.dede +2, set: dede_adjoint, char: {dede: {statut: staff}} — *Il siffle la fin. Rouvier, si elle passe, approuve.*
→ **Le sifflet aussi, mon banc** — effets : force +1, vestiaire −, relation.dede −2, set: dede_ecarte — *Il pose le sifflet sur le capot. Il conduit le minibus quand même. Il ne siffle plus ; il regarde ; c'est pire.*
**Traces** : dede_adjoint, dede_ecarte (« {annee} : Dédé écarté du sifflet. Il conduit encore le minibus ; il ne siffle plus. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 11 (`interimaire` en National : Vukić absent, Dédé présent), 30 (`en_bus` plus : « le minibus n'a pas refusé de descendre »), 90 (objet : le sifflet de Dédé)

### 17.5 Les paliers
### SCÈNE co.dede.trahison_montbeliac  —  Les Sangliers
**Rôle** : joueur_amateur, president_amateur, entraineur · **Intrigue** : palier −3 · **Étape** : on_relation −3 · **Moment** : programmé en [1,3] · **Lieu** : le parking, le minibus, un autocollant vert et noir neuf sur le pare-brise · **Conditions** : `relation.dede <= -3`, une fois par carrière
**DÉDÉ** *(coach bénévole — noir — il colle l'autocollant en te parlant)*
« Montbéliac paie, chauffe le vestiaire et m'a dit merci ; je pars dimanche, avec le minibus, il est à moi. Bon, on va pas se mentir, {nom} : trente ans de samedis, tu n'en as pas voulu. »
← **Je regarde le minibus partir** — effets : vestiaire −−−, tribunes −, set: dede_montbeliac, char: {dede: {statut: rival}} — *Il part. Montbéliac gagne le derby du canton avec ta compo, celle du capot. Il l'avait photographiée.*
→ **Je regarde le minibus partir** — effets : vestiaire −−−, tribunes −, set: dede_montbeliac, char: {dede: {statut: rival}} — *Il part. Montbéliac gagne le derby du canton avec ta compo, celle du capot. Il l'avait photographiée.*
**Traces** : dede_montbeliac (« {annee} : Dédé est parti entraîner Montbéliac. Avec le minibus, le sifflet et la compo du capot. ») · **Lu plus tard par** : 13 (`fusion_imposee` : « Dédé est de l'autre côté »), 30 (`am_toro`, `pa_club_a_cote` plus), 90 (mémoire du village −2)

### SCÈNE co.dede.faveur_sifflet  —  Mon sifflet est à toi
**Rôle** : joueur_amateur, entraineur · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : le bord du terrain, la fin d'un entraînement, il te tend le sifflet orange sans rien dire d'abord · **Conditions** : `relation.dede >= 3`, une fois par carrière
**DÉDÉ** *(coach bénévole — sourire — le sifflet dans la paume ouverte)*
« Bon, on va pas se mentir : tes genoux, c'est fini, et tu regardes le terrain comme moi en soixante et un. Mon sifflet, il est à toi, {prenom} ; il est en plastique, il siffle quand même. »
← **Je le prends** — effets : vestiaire ++, direction +, relation.dede +1, set: sifflet_dede, set: diplome (amateur : équivalent) — *Tu siffles la fin. Ils s'arrêtent. C'est la première fois que quelqu'un s'arrête pour toi ; Dédé écrit « bon » sur le capot.*
→ **Garde-le, encore un samedi** — effets : force +1, relation.dede +1, tribunes + — *Il le range. Il te le donnera à l'enterrement, par Bébert ; c'est prévu.*
**Traces** : sifflet_dede (objet héritable ; « {annee} : Dédé a donné son sifflet à {prenom} {nom}. En plastique ; il siffle quand même. ») · **Lu plus tard par** : 30 (Carte Destin amateur → entraîneur : « Dédé : mon sifflet, il est à toi », existant en § 3.3 de la charte), 90 (lignée : objet), 12 (Rouvier : « deux sifflets, un seul kiné »)

### 17.6 Les retrouvailles
### SCÈNE co.retrouvailles.dede_sourire  —  Le minibus
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les deux meilleures relations, `chars.dede.statut != 'mort'` · **Lieu** : le parking du nouveau stade, le minibus garé en travers
**DÉDÉ** *(coach bénévole — sourire — le minibus garé devant ton nouveau stade, en travers)*
« J'ai fait quatre heures de minibus pour voir ton nouveau stade, il est grand, il a un vestiaire chauffé. Bon, on va pas se mentir, petit : je préfère le nôtre, mais je suis fier, voilà. »
**OK** **Viens voir le vestiaire** — effets : vestiaire +, relation.dede +1 — *Il le visite. Il repart avant la nuit ; le minibus n'a pas de phares fiables.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.dede_noir  —  Le capot
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation · **Conditions** : parmi les pires relations, `chars.dede.statut != 'mort'` · **Lieu** : le parking, la vitre du minibus à demi baissée
**DÉDÉ** *(coach bénévole — noir — il ne descend pas du minibus ; il parle par la vitre)*
« Tu n'as pas rappelé, ou tu ne m'as pas payé, ou tu m'as pris le sifflet, je sais plus lequel, bon, on va pas se mentir : les trois. Le {numero}, ici, on l'a effacé du capot. »
**OK** **Réécris-le, Dédé** — effets : relation.dede +1, tribunes + — *Il descend. C'est un début ; il n'y en aura pas d'autre, il a soixante-douze ans.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.dede_enterrement  —  Terrain Dédé
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : 2012, une fois (drame sobre, une sortie) · **Conditions** : `relation.dede != 0` · **Lieu** : le terrain de Trébignac, le canton au bord de la ligne
**BÉBERT** *(son fils, coach bénévole — voix sans portrait — le sifflet orange dans la main, le béret dans l'autre)*
« Il a sifflé la fin samedi et il s'est assis sur le capot, voilà ; tout le canton est là, le type en doudoune aussi. Bon, on va pas se mentir : il voulait que tu aies ça, il l'a dit à Gérard. »
← **Je prends le sifflet** — effets : — , set: sifflet_dede — *Tu le prends. Le canton se tait quand tu siffles ; il ne sait pas pourquoi.*
→ **Je prends le sifflet** — effets : — , set: sifflet_dede — *Tu le prends. Le canton se tait quand tu siffles ; il ne sait pas pourquoi.*
*(Variante si `flag('dede_pas_rappele')` : Bébert ajoute « il a compté tes ballons jusqu'à la fin ». Variante si `flag('dede_montbeliac')` : l'enterrement est à Montbéliac ; tu es au fond.)*
**Traces** : sifflet_dede, dede_mort (monde ; « 2012 : Dédé est mort sur le capot du minibus après avoir sifflé la fin. Le terrain porte son nom sans qu'on l'ait décidé. ») · **Lu plus tard par** : 31 (Nouvelle 2012, épitaphe des 41), 90, 02 (Barbier : « je suis venu de Trébignac »)

### 17.7 Anecdotes
- **01.dede_maillot_1961** — objet · toute scène de match important · Le maillot de l'essai de Valdorne (1961), jaune et noir, sous le coupe-vent ; trop petit depuis 1975 ; on l'a mis dans le cercueil.
- **01.dede_minibus** — décor · toute scène · Le minibus de 1979, neuf places, sent le chien (il n'y a jamais eu de chien) ; les phares marchent un jour sur deux ; on rentre à pied l'autre jour.
- **01.dede_superstition** — légende · set-piece `gm_annonce` · Il écrit la compo sur le capot avec le doigt, dans la poussière ; s'il pleut, il ne fait pas de compo ; « ils savent ».
- **01.dede_repas** — décor · `am.gerard.troisieme_mi_temps` · Un sandwich au pâté et une bière, la sienne, offerte par Gérard depuis 1970 ; c'est la seule bière que Gérard n'a jamais notée.
- **01.dede_capot** — légende · retrouvailles · Le capot du minibus a une compo gravée à la clé, en 1994, par un gamin passé pro ; personne ne l'a effacée ; c'est la seule qui compte.

### 17.8 Réaction propre
### RÉACTION co.re.dede_merci  —  Il a dit le mot
**Après** : co.gerard.merci (← merci) ou pr.dede.paye (→ merci) · **Famille** : tiers qui commente · **Conditions** : `relation.dede >= 0`
**DÉDÉ** *(coach bénévole — sourire — il range le sifflet dans la poche, ce qu'il ne fait jamais)*
« Tu as dit merci à Gérard, ou à moi, j'ai entendu de la buvette ; trente ans qu'on attendait le mot. Bon, on va pas se mentir : on l'attendait pas, on y croyait plus, c'est différent. »
**Un bouton** : **Ça fait deux mercis** — effets : vestiaire +, relation.dede +1, relation.gerard +1 — *Deux. Ils se regardent. Gérard sert deux bières ; il n'en note aucune ; c'est une soirée historique.*

---

## 18. MAMIE PAULETTE  (`paulette`)
**Fonction** : abonnée depuis 1951 · **Genre** : f · **Âge en 1990** : 71 · **Camp** : terrain · **Fenêtre** : 1990-2009 ; elle meurt en 2009, à la 70e minute, tribune Est, place 14B, on ne l'a pas réveillée ; sa place reste vide ensuite (la fin `jp_place14b` du joueur est *sa* place : on s'y assoit à côté d'elle, puis à côté de rien) · **Suivant** : sa petite-fille, « la petite Paulette » (née 1985, place 14C, voix sans portrait), qui dit « j'étais là en deux mille neuf »
**Tic** : « J'étais là en cinquante et un. » — torsions : « J'étais là en cinquante et un. Vous, non. » · « En cinquante et un, on perdait aussi. Mieux. » · « J'étais là. Cinquante et un, soixante-dix, aujourd'hui ; c'est pareil, c'est la même place. »
**Désir** : mourir au stade, tribune Est, place 14B · **Blessure** : son mari y est mort, à la 70e, souriant, en 1970, un jour de match nul ; elle a fini le match
**Adresse** : tous les rôles : mon petit / {prenom} / le coach, le petit, le président, le monsieur (jamais ton nom : elle ne retient que ceux qui restent)
**Ce qu'elle pense de toi** : à +2 « tu resteras ; j'ai retenu ton prénom, c'est rare » ; à 0 « on verra si tu es là en juin » ; à −2 « le coach, comme les autres ; en cinquante et un, il y en avait déjà »
**Paliers** : −3 → `co.paulette.trahison_nom` · +3 → `co.paulette.faveur_mari`
**Dans les rôles** : tous : la mémoire du club à voix haute (une carte par rôle au plus par saison) ; joueur : la place 14B quand tu es sur le banc (1) ; entraîneur : la tribune vétuste (1) ; président : la loge refusée (1) ; amateur : elle a aussi été là à Trébignac, en cinquante et un, c'était le même club ou presque (0,5) ; 2009 : la 70e (tous)
**Trajectoire 1990 → 2050** : 1990-1999 · 71-80 ans, permanente blanche, manteau de laine, un sac à main où il y a une orange ; L'Écho plié dans le sac ; elle dit « cinquante et un » et elle y était · 2000-2009 · canne (1995) qu'elle utilise comme pointeur ; elle refuse la loge (2003) ; elle meurt en 2009, à la 70e, on ne l'a pas réveillée ; l'arbitre n'a rien ajouté, il ne savait pas · 2010-2050 · la place 14B est vide ; en 2031, Sacha y pose une orange pour Gigi ; en 2050, la petite Paulette dit qu'elle était là en deux mille neuf
**Retrouvailles** : `co.retrouvailles.paulette_sourire` / `_noir` / `_place_vide`
**Cartes propres** : *Cinquante et un* (01) · *La loge* (01) · *La tribune vétuste* (01) · *La place 14B* (01) · *L'orange du derby* (01) · *La soixante-dixième* (01) · *Ta loge* (30, fin : elle lui fait écho) · *Le dernier derby* (30)

### 18.1 Identité et place
Paulette ; « Mamie Paulette » pour le stade entier, « madame Paulette » pour Josiane, « Paulette » pour Gigi et Solange Brissac. 71 ans en 1990, 81 en 2000, 90 à sa mort. **Portrait** : la permanente blanche, le manteau de laine bleu nuit et or (les couleurs du club, elle l'a fait teindre), le sac à main sur les genoux, la canne entre les jambes, l'orange à la mi-temps. **Voix** : haute, claire, sans hésitation ; elle parle au présent des matchs de 1951 ; elle appelle les joueurs par leur numéro et les entraîneurs par leur fonction. Au club, elle est la place 14B, tribune Est : la meilleure vue sur le but Nord, la pire sur le banc ; elle lit L'Écho avant le match et le commente à voix haute pendant. Personne ne s'assoit en 14A ni en 14C sans lui demander.

**Désir / besoin / blessure / secret.** Désir : mourir ici, à la 70e, comme lui. Besoin : que quelqu'un reste assez longtemps pour qu'elle retienne son nom. Blessure : 1970, la 70e, un match nul. Secret : elle a retenu tous les noms ; elle fait semblant de les oublier pour voir qui reviendra le lui dire.

### 18.2 Les cinq registres
- **−3** — « Le coach. Comme les autres. J'étais là en cinquante et un, il y en avait déjà, des coachs. » / « Je n'ai pas retenu votre nom. Je ne le retiendrai pas. »
- **−2 / −1** — « J'étais là en cinquante et un, mon petit ; vous, vous étiez où en juin ? » / « La loge, c'est pour ceux qui ne regardent pas. »
- **0** — « J'étais là en cinquante et un. Asseyez-vous, la 14A est libre, la 14C non. » / « Une orange, mon petit. À la mi-temps ; pas avant. »
- **+1 / +2** — « {prenom}, je vous ai retenu ; c'est rare, ne le dites à personne. » / « Mon mari était là, place 14A. Il aurait aimé votre six. »
- **+3** — « Voilà l'écharpe de mon mari ; il est mort ici, à la soixante-dixième, souriant. Je vous la donne parce que vous resterez. » / « J'étais là en cinquante et un, et je serai là en juin, à côté de vous. »

### 18.3 Rapports avec les autres
**Alliés** : Gigi (l'orange, depuis 1990 ; « le vieux » et « la vieille » se comprennent), Gégé (il lit la tribune Est avant le penalty : si elle sourit, c'est dedans), Josiane (elles ont le même âge, elles se disent vous), Léa (L'Écho : Paulette est sa première lectrice, et la seule qui écrive « On nous écrit »). **Rivaux** : Vaubourg (la loge, la tribune vétuste : « le stade, c'est le mien »), Ilyas (« un actif ? j'y étais avant l'actif »), Massenet (qui dit « kop »). **Dettes** : le club lui doit une place à vie qu'il lui a donnée en 1971 ; Camille lui doit un siège (elle s'assoit toujours à côté). **Elle aime** : Sacha, qui lui a offert un chocolat entamé sur la 14B, sans savoir que c'était sa place.

### 18.4 INTRIGUE co.paulette_14b  —  Place 14B
**Logline** : Mamie Paulette était là en cinquante et un ; elle refuse la loge, ne quitte pas la tribune vétuste, prête sa 14A quand tu es sur le banc, t'offre une orange après le derby, et meurt à la soixante-dixième. · **Synopsis** : Première rencontre : elle te dit qu'elle était là. Président, tu lui offres la loge ; elle refuse. Entraîneur, la tribune Est est vétuste ; elle ne bouge pas. Joueur, sur le banc, tu t'assois en 14A. Après un derby perdu, elle t'offre une orange. En 2009, la 70e.
**Rôle(s)** : tous · **Postulat(s)** : partagé · **Porteur** : paulette · **Cast** : paulette, vecchio, gege, lea, sacha, aulard · **Thème** : tribune
**Saisons** : "0" (cinquante_et_un), "1" (loge, tribune), "2+" (14b, orange, soixante_dixieme 2009) · **Conditions d'entrée** : `chars.paulette.statut != 'mort'` ; une carte de Paulette par saison au plus (règle de la charte) · **Exclusions** : — · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `loge_refusee` → `paulette_loge` (« {annee} : Mamie Paulette a refusé la loge. « La loge, c'est pour ceux qui ne regardent pas. » ») → lue par 30 (fin *Ta loge* : epitaph_plus « Paulette avait refusé la tienne »), 13 (la loge du président : variante), 20 (Écho, « On nous écrit ») · `tribune_gardee` → `tribune_a_renover` (∃ ; ce chapitre l'écrit côté Paulette) → lue par 30 (fin *La tribune*), 11, 13 · `mort` → `paulette_14b_vide` (« 2009 : Mamie Paulette est morte à la soixante-dixième, place 14B. On ne l'a pas réveillée. La place reste vide. ») → lue par 30 (`jp_place14b` : « à côté de rien »), 07 (Gigi : la minute de 2031 rime), 19 (Sacha : l'orange), 31 (Nouvelle 2009), 90
**Séquencier** : cinquante_et_un (S0, [2,9], tous rôles) → loge (président, S1+) | tribune (entraîneur, S1+, lit `tribune_a_renover`) → 14b (joueur, S1+, `gauges.direction < 40`) → orange (S2+, lit `derby_perdu`) → soixante_dixieme (2009, drame sobre, une sortie)
**Épilogue** : rien : Paulette ne quitte pas sa place.

### SCÈNE co.paulette.cinquante_et_un  —  Cinquante et un
**Rôle** : tous · **Intrigue** : co.paulette_14b · **Étape** : 1/6 · **Moment** : saison 0, [2,9] · **Lieu** : la tribune Est, un mardi d'entraînement ouvert, elle est seule, place 14B · **Conditions** : `chars.paulette.statut != 'mort'`
**PAULETTE** *(abonnée depuis 1951 — neutre — elle ne se lève pas ; on vient à elle)*
« J'étais là en cinquante et un, la finale perdue contre Capitale, deux à un, un but hors-jeu, et j'y suis encore. Asseyez-vous, mon petit, la 14A est libre ; la 14C, non. »
← **Je m'assois en 14A** — effets : tribunes +, direction −, relation.paulette +1, set: paulette_14a — *Tu t'assois. Elle raconte 1951 jusqu'à la fin de la séance. Le but était hors-jeu ; elle l'a vu ; personne d'autre.*
→ **Je reste debout, la séance** — effets : force +1, relation.paulette −1 — *Elle hoche la tête. « Le coach », dit-elle. Elle ne demande pas ton nom ; elle attend de voir si tu seras là en juin.*
**Traces** : paulette_14a (`journal:` poids 1) · **Réactions déclenchées** : — · **Lu plus tard par** : `jp.paulette.14b` (variante « tu connais la 14A »), 90 (mémoire du club : « il s'est assis »), 20 (Écho, « On nous écrit » : elle écrit)

### SCÈNE pr.paulette.loge  —  La loge
**Rôle** : president, president_amateur · **Intrigue** : co.paulette_14b · **Étape** : 2/6 · **Moment** : saison 1+, [2,10] · **Lieu** : le hall, une invitation à la loge présidentielle, à son nom, dans une enveloppe du club · **Conditions** : `year >= 2003`
**PAULETTE** *(abonnée — neutre — elle rend l'enveloppe sans l'ouvrir ; elle a lu le nom sur l'enveloppe, ça suffit)*
« Une loge, des petits fours, une vitre, et on ne voit pas le but Nord ; j'étais là en cinquante et un, sans vitre. Merci, président ; la 14B, je la garde, et vous, vous venez quand ? »
← **Je viens dimanche, en 14A** — effets : tribunes ++, direction −, relation.paulette +2, set: paulette_loge, outcome: loge_refusee — *Tu t'assois en 14A. Léa fait une photo pour L'Écho ; c'est la Une.*
→ **La loge est chauffée, madame** — effets : direction +, tribunes −, relation.paulette −1, set: paulette_loge — *Elle reste en 14B. La loge a une chaise vide, avec son nom, toute la saison.*
**Traces** : paulette_loge · **Réactions déclenchées** : co.re.gege_decoupe (existant, si Une) · **Lu plus tard par** : 30 (fin *Ta loge* epitaph_plus), 13 (la loge : variante), 20 (« LA 14B PLUTÔT QUE LA LOGE »)

### SCÈNE en.paulette.tribune  —  La tribune vétuste
**Rôle** : entraineur, president · **Intrigue** : co.paulette_14b · **Étape** : 2/6 (variante entraîneur) · **Moment** : saison 1+, [4,12], après un rapport sur la tribune · **Lieu** : la tribune Est, une fissure sous la 14B qu'elle montre avec la canne · **Conditions** : `flag('tribune_a_renover') || vars.tribune_alerte >= 1`
**PAULETTE** *(abonnée — neutre — la canne pointée sur la fissure, puis sur toi)*
« La fissure est là depuis soixante-dix, sous ma place ; elle a vu mon mari mourir et n'a pas bougé. J'étais là en cinquante et un, mon petit ; je ne m'assois pas ailleurs. »
← **On ferme la tribune Est** — effets : tribunes −−, caisse −−, direction −, relation.paulette −1, set: tribune_fermee, clear: tribune_a_renover — *Elle regarde le match depuis le parking, sur une chaise, avec Gérard. Elle revient en septembre. La fissure est rebouchée ; elle dit qu'on la voit encore.*
→ **La tribune tient toujours** — effets : tribunes +, caisse +, relation.paulette +1, set: tribune_a_renover — *Elle tient. Gégé le mesure ; il ne le dit à personne.*
**Traces** : tribune_fermee (∃), tribune_a_renover (∃) · **Réactions déclenchées** : — · **Lu plus tard par** : 30 (fin *La tribune* : « Paulette était dedans » ; jamais partagé), 11 (`en.evt.tribune`), 13 (le stade dont tu es locataire), 02 (Aubert : l'arrêté)

### SCÈNE jp.paulette.14b  —  La place 14B
**Rôle** : joueur · **Intrigue** : co.paulette_14b · **Étape** : 3/6 · **Moment** : saison 1+, [4,12] · **Lieu** : la tribune Est, tu es en tribune, pas sur la feuille, la 14A est libre · **Conditions** : `gauges.direction < 40` ; variante si `flag('paulette_14a')`
**PAULETTE** *(abonnée — neutre — elle tapote le siège 14A avec la canne)*
« Pas sur la feuille, mon petit, alors en tribune, et la 14A est libre depuis soixante-dix. J'étais là en cinquante et un ; asseyez-vous, on regarde ceux qui jouent à votre place. »
← **Je m'assois, et je regarde** — effets : direction +, vestiaire +, force +1, relation.paulette +2, set: place_14a_joueur — *Tu regardes. Tu le dis au coach lundi ; il ne demande pas d'où.*
→ **Je reste au bord du terrain** — effets : tribunes +, relation.paulette −1, set: bord_pelouse — *Tu restes debout. Le stade te voit debout. Elle dit « le petit » ; elle ne retient pas ton nom ; pas cette saison.*
**Traces** : place_14a_joueur, bord_pelouse (« {annee} : {prenom} {nom} est resté debout au bord de la pelouse. Mamie Paulette avait libéré la 14A. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 30 (`jp_place14b` : « tu connaissais déjà la vue »), 10 (`jp.banc_hiver` variante), 20 (Écho)

### SCÈNE co.paulette.orange  —  L'orange du derby
**Rôle** : tous · **Intrigue** : co.paulette_14b · **Étape** : 4/6 · **Moment** : saison 2+, [1,6], après `derby_perdu` · **Lieu** : la sortie du stade, elle t'attend près de la grille, une orange dans la main · **Conditions** : `flag('derby_perdu')`
**PAULETTE** *(abonnée — sourire, malgré le derby — l'orange tendue, déjà pelée à moitié)*
« On a perdu le derby, et en cinquante et un aussi, et en soixante-dix c'était un nul, et il est mort en souriant ; tenez, une orange, mon petit. J'étais là ; je serai là dimanche prochain aussi. »
← **Je prends l'orange** — effets : tribunes +, vestiaire +, relation.paulette +2, set: orange_paulette — *Tu la manges sur le parking. C'est le meilleur moment d'un derby perdu.*
→ **Pas faim, madame** — effets : relation.paulette −2, direction + — *Elle la remet dans le sac. Elle la donnera à Gigi. Elle dit « le coach » ; elle avait presque retenu ton prénom.*
**Traces** : orange_paulette (« {annee} : après le derby perdu, Mamie Paulette a offert une orange à {prenom} {nom}. Il l'a mangée sur le parking. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 11 (`co.derby` retour : variante « l'orange »), 30 (*Le dernier derby* : « elle avait une orange »), § 19 (Sacha : l'orange sur la 14B, 2031), § 4 (Camille : « la boulangère » variante « tu sens l'orange »)

### SCÈNE co.paulette.soixante_dixieme  —  La soixante-dixième
**Rôle** : tous · **Intrigue** : co.paulette_14b · **Étape** : 5/6 · **Moment** : 2009, [4,14], un dimanche, drame sobre, une sortie, jamais partagé · **Lieu** : la tribune Est, la 70e minute, personne ne l'a réveillée · **Conditions** : `year == 2009 && chars.paulette.statut != 'mort'`
**LÉA** *(L'Écho — neutre — elle est montée en tribune Est pendant le match, ce qu'elle ne fait jamais)*
« Mamie Paulette s'est endormie à la soixante-dixième, place 14B, et on ne l'a pas réveillée. Vous confirmez que je peux l'écrire comme ça, « souriante », en première page ? »
← **Écrivez-le comme ça** — effets : — , set: paulette_14b_vide, char: {paulette: {statut: mort}} — *L'Écho titre : « ELLE ÉTAIT LÀ EN CINQUANTE ET UN ». Gigi pose une orange sur la 14B le dimanche suivant, et jusqu'en 2031.*
→ **Écrivez-le comme ça** — effets : — , set: paulette_14b_vide, char: {paulette: {statut: mort}} — *L'Écho titre : « ELLE ÉTAIT LÀ EN CINQUANTE ET UN ». Gigi pose une orange sur la 14B le dimanche suivant, et jusqu'en 2031.*
**Traces** : paulette_14b_vide (monde) · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 31 (§ 9, la ligne d'enterrement `31.ent_paulette`), ch. 30 (`jp_place14b` plus, *Ta loge*), § 7 (2031), § 19 (Sacha), ch. 90 (Panthéon)

### SCÈNE am.paulette.trebignac  —  Le même club, ou presque (sixième scène)
**Rôle** : joueur_amateur, president_amateur · **Intrigue** : co.paulette_14b · **Étape** : 6/6 · **Moment** : saison 0-1, [3,10], quand le club amateur reçoit un club de la vallée en Coupe · **Lieu** : le stade municipal, une chaise pliante au bord de la ligne, elle a fait le voyage en car avec Gégé · **Conditions** : club amateur = Trébignac ou Boisnoir ; `chars.paulette.statut != 'mort'`
**PAULETTE** *(abonnée — sourire — la chaise pliante posée exactement là où serait la 14B s'il y avait une tribune)*
« J'étais là en cinquante et un, ici aussi, en Coupe, contre le même club ou presque : quatre à un, et des merguez. Vous jouez, mon petit, ou vous m'apportez une chaise pour Gérard ? »
← **Je joue, Gérard a sa chaise** — effets : tribunes ++, vestiaire +, relation.paulette +2, relation.gerard +1, set: paulette_village — *Tu joues. Vous perdez quatre à un, ou pas. Elle mange une merguez ; elle dit qu'en cinquante et un elles étaient meilleures ; Gérard s'en souvient aussi.*
→ **En tribune d'honneur, madame** — effets : direction +, tribunes −, relation.paulette −1 — *Il n'y a pas de tribune d'honneur. Il y a le banc de touche. Elle s'y assoit ; elle fait la compo à voix haute ; Dédé l'écoute.*
**Traces** : paulette_village (« {annee} : Mamie Paulette en Coupe au village, sur une chaise pliante. « Comme en cinquante et un. » ») · **Réactions déclenchées** : — · **Lu plus tard par** : 13 (`coupe_du_village` : variante « Paulette est venue »), § 9 (Gégé : le car), 20 (Écho)

### 18.5 Les paliers
### SCÈNE co.paulette.trahison_nom  —  Le coach
**Rôle** : tous · **Intrigue** : palier −3 · **Étape** : on_relation −3 · **Moment** : programmé en [1,3] · **Lieu** : la tribune Est, elle ne se tourne pas quand tu passes · **Conditions** : `relation.paulette <= -3`, une fois par carrière
**PAULETTE** *(abonnée — noir — elle regarde la pelouse ; elle te parle sans te regarder)*
« Je n'ai pas retenu votre nom, et je ne le retiendrai pas ; j'étais là en cinquante et un, il y en a eu beaucoup, des coachs. Vous êtes le coach ; c'est tout ce que vous serez ici. »
← **Je passe mon chemin** — effets : tribunes −−, set: paulette_oubli — *Tu passes. Elle dit « le coach » jusqu'à ton départ. La tribune Est l'entend ; la tribune Est retient ce qu'elle retient.*
→ **Je passe mon chemin** — effets : tribunes −−, set: paulette_oubli — *Tu passes. Elle dit « le coach » jusqu'à ton départ. La tribune Est l'entend ; la tribune Est retient ce qu'elle retient.*
**Traces** : paulette_oubli (« {annee} : Mamie Paulette n'a pas retenu le nom de {nom}. Elle disait « le coach ». La tribune Est aussi. ») · **Lu plus tard par** : 90 (mémoire des clubs −1 : « la tribune Est n'a pas retenu »), 30 (*Ta loge* plus), 20 (Écho, « On nous écrit » : sans ton nom)

### SCÈNE co.paulette.faveur_mari  —  L'écharpe de la 14A
**Rôle** : tous · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : la tribune Est, après le match, une écharpe de 1951, bleu nuit et or, pliée dans le sac à main depuis 1970 · **Conditions** : `relation.paulette >= 3`, une fois par carrière
**PAULETTE** *(abonnée — sourire — elle te tend l'écharpe à deux mains ; c'est la première fois qu'elle la sort)*
« L'écharpe de mon mari, place 14A ; il est mort ici à la soixante-dixième, souriant, un jour de nul. J'étais là en cinquante et un avec lui ; je vous la donne parce que vous resterez, {prenom}. »
← **Je la prends, madame** — effets : tribunes +++, vestiaire +, relation.paulette +1, set: echarpe_paulette — *Tu la prends. Gégé vient la voir.*
→ **Gardez-la pour la 14A** — effets : tribunes ++, relation.paulette +2, set: echarpe_14a — *Elle la pose sur la 14A. Elle y reste jusqu'en 2009. Puis on la met sur la 14B ; personne ne s'assoit dessus ; personne ne la vole ; c'est le stade.*
**Traces** : echarpe_paulette (objet héritable), echarpe_14a (« {annee} : l'écharpe du mari de Paulette est restée sur la 14A. Personne ne s'assoit dessus. ») · **Lu plus tard par** : 90 (lignée : objet ; la 14A/14B : mémoire), 30 (*Ta loge*, *Le dernier derby*), § 19 (Sacha : « l'écharpe sur le siège »)

### 18.6 Les retrouvailles
### SCÈNE co.retrouvailles.paulette_sourire  —  Le prénom retenu
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation, `chars.paulette.statut != 'mort'` · **Conditions** : parmi les deux meilleures relations · **Lieu** : le nouveau stade, rangée 14, le car des supporters sur le parking
**PAULETTE** *(abonnée — sourire — elle a fait le voyage en car, Gégé a porté le sac)*
« Je n'y étais pas en cinquante et un, ici, mais j'y suis aujourd'hui, et j'ai retenu votre prénom, {prenom}, alors je suis venue le dire. La 14B d'ici est prise ; je m'assois où ? »
**OK** **À côté de moi, sur le banc** — effets : tribunes ++, vestiaire +, relation.paulette +1 — *Elle s'assoit sur le banc. Elle fait la compo à voix haute. Le nouveau vestiaire l'écoute ; il ne sait pas qui c'est ; il le saura.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.paulette_noir  —  Le monsieur
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation, `chars.paulette.statut != 'mort'` · **Conditions** : parmi les pires relations · **Lieu** : la rédaction de L'Écho, une lettre que Léa te lit
**PAULETTE** *(abonnée — noir — elle n'a pas fait le voyage ; elle écrit à L'Écho, et Léa te lit la lettre)*
« « On nous écrit : le monsieur qui n'est pas resté est parti ailleurs ; j'étais là en cinquante et un, il n'y était pas, il n'est nulle part. » Vous confirmez que je peux la publier ? »
**OK** **Publiez, elle a le droit** — effets : tribunes −, relation.paulette +1, relation.lea +1 — *Publiée. « On nous écrit », sans ton nom. Le nouveau stade ne comprend pas ; l'ancien, si.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.paulette_place_vide  —  La 14B
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : après 2009, à la première Passation qui te ramène à {club} d'origine, une fois · **Conditions** : `flag('paulette_14b_vide') && relation.paulette != 0` · **Lieu** : la tribune Est de {club}, la 14B vide, une orange dessus
**LA PETITE PAULETTE** *(sa petite-fille, place 14C — voix sans portrait — une orange dans la main, comme l'autre)*
« Elle est morte là, à la soixante-dixième, et personne ne s'assoit en 14B, et personne ne prend la 14A non plus depuis que vous êtes parti. J'étais là en deux mille neuf ; vous, vous étiez où ? »
← **En 14A, dimanche** — effets : tribunes ++, relation.paulette +1 (posthume) — *Tu t'assois en 14A. Tu ne la manges pas ; tu la laisses ; c'est la règle qu'on n'a jamais écrite.*
→ **Ailleurs, je travaillais** — effets : direction + — *Elle hoche la tête. Elle dit « le coach », ou « le président ». Elle a retenu ; elle fait semblant ; c'est de famille.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### 18.7 Anecdotes
- **01.paulette_manteau** — objet · toute scène · Le manteau de laine bleu nuit et or, teint par elle en 1971 ; il déteint sur la 14B les jours de pluie ; le siège est bleu nuit depuis.
- **01.paulette_orange** — objet · `co.paulette.orange`, 2031 · L'orange de la mi-temps, une par match depuis 1951 ; Gigi en apporte une à partir de 1990 ; après 2009, il la pose sur la 14B ; après 2031, Sacha.
- **01.paulette_echo** — légende · `co.re.camille_journal` (existant), 20 · Elle écrit à « On nous écrit » chaque semaine depuis 1958 ; Léa a une boîte entière ; la dernière lettre est datée du samedi précédant la 70e.
- **01.paulette_mari** — légende · `co.paulette.faveur_mari` · Le mari, 14A, mort en 1970 à la 70e d'un match nul, souriant ; elle a fini le match ; « il n'aurait pas voulu qu'on parte avant la fin ».
- **01.paulette_but_1951** — légende de club · `co.paulette.cinquante_et_un`, 31 (Almanach du Ballon) · La finale de 1951, perdue deux à un contre Capitale FC sur un but hors-jeu ; elle est la seule à l'avoir vu ; l'Almanach du Ballon l'écrit « selon une abonnée ».

---

## 19. SACHA  (`sacha`)
**Fonction** : ton enfant · **Genre** : f (le jeu peut tirer un garçon : mêmes cartes, accord `{pg}` sur Sacha ; le prénom est mixte exprès) · **Âge en 1990** : non née ; naît pendant la carrière (`sacha_nee`, § 4) · **Camp** : famille · **Fenêtre** : de ses six ans à la fin du monde ; héritière possible de 18 à 22 ans à la Succession ; dans l'ONG qui compte les ouvriers (2020+) ; élue socios avec Gégé (2032) si la lignée a tenu · **Suivant** : la lignée (le successeur porte ton nom ; Sacha peut être ce successeur)
**Tic** : « Tu m'as promis. » — torsions : « Tu m'as promis. Je n'ai rien demandé. » · « Tu n'as rien promis. C'est pire. » · « Je te promets, moi. »
**Désir** : un parent, pas un entraîneur · **Blessure** : elle a grandi dans une tribune vide ; elle a compris à six ans que le rond central est « là où tu cries »
**Adresse** : papa/maman / {prenom} / {nom} dans tous les rôles ; à −1 elle dit {nom}, et c'est la pire chose qu'un enfant puisse dire
**Ce qu'elle pense de toi** : à +2 « tu es venu ; tu as monté l'escalier de la tribune » ; à 0 « tu m'as promis ; on verra » ; à −2 « {nom}, tu as tweeté à trois heures du matin »
**Paliers** : −3 → `co.sacha.trahison_succession` · +3 → `co.sacha.faveur_tribune_pleine`
**Dans les rôles** : tous à partir de ses six ans (une carte par saison) · joueur amateur : héritière (Succession) · président : « tu as tweeté à trois heures » (1) · sélectionneur : elle ne chante pas l'hymne (1) · instance : l'ONG (1) · entraîneur, joueur, DS : la promesse, la tribune vide, le nom de famille (1)
**Trajectoire 1990 → 2050** : naissance entre 1991 et 2000 · six ans : la tribune vide, le chocolat sur la 14B, « tu m'as promis le zoo » · douze ans : elle t'appelle par ton nom de famille une fois ; elle peint une banderole pour Gégé · dix-sept ans : elle trouve la lettre de 1989 dans le tiroir de la cuisine · dix-huit à vingt-deux ans : la Succession : elle prend ta suite, ou pas, avec un trait hérité et un trait inversé · vingt-cinq ans : l'ONG qui compte les ouvriers des chantiers du Mondial (2020+) · trente ans : elle demande à Vaz pourquoi le banc est loin ; il sourit · 2031 : elle pose une orange sur la 14B pour Gigi · 2032 : élue socios à côté de Gégé, si la lignée a tenu · 2050 : elle est à l'écran-bilan du siècle ; elle ne chante toujours pas l'hymne
**Retrouvailles** : `co.retrouvailles.sacha_sourire` / `_noir` / `_succession`
**Cartes propres** : *Six ans* (01) · *Le nom de famille* (01) · *Trois heures du matin* (01) · *L'hymne* (01) · *L'ONG* (01) · *L'héritière* (01) · *Trois générations* (90, lignée) · *La banderole de sept ans* (§ 9, anecdote)

### 19.1 Identité et place
Sacha ; « la petite » pour Josiane, « Sacha » pour tout le monde, « {nom} » pour personne sauf elle-même quand elle signe. Six ans à sa première carte, dix-huit à la Succession, cinquante-neuf en 2050 si elle est née en 1991. **Portrait** : à six ans, un chocolat, une écharpe trop longue, la queue de cheval de Camille ; à dix-huit, ton portrait vieilli à l'envers (le générateur inverse un trait : le mulet devient carré, la casquette devient chignon) ; à trente, une veste d'ONG et le manteau de Paulette, qu'on lui a donné. **Voix** : directe, courte, une phrase par carte, deux quand elle a grandi ; elle ne pose jamais la question de Camille ; elle dit ce qu'on lui a promis. À la maison, elle est ce que Camille n'a pas dit ; au stade, elle est le siège 14A vide ; dans le monde, elle est la lignée : la personne qui portera ton nom quand il sera une insulte ou une prière.

**Désir / besoin / blessure / secret.** Désir : un parent qui monte l'escalier. Besoin : une promesse tenue, une seule, pour croire aux autres. Blessure : la tribune vide. Secret : elle a appris l'hymne par cœur ; elle ne le chante pas parce que Dembo ne le chantait pas, et qu'il lui a dit pourquoi ; c'est le seul secret qu'elle partage avec quelqu'un d'autre que toi.

### 19.2 Les cinq registres
- **−3** — « {nom}, je ne prends pas ta suite ; je prends mon nom, l'autre. » / « Tu n'as rien promis. C'est pire. »
- **−2 / −1** — « {nom}, tu as tweeté à trois heures du matin. » / « Tu m'as promis le zoo. Le zoo était fermé, le stade non. »
- **0** — « Tu m'as promis. On verra. » / « C'est là que tu cries ? Le rond ? »
- **+1 / +2** — « Papa/Maman, tu es monté. J'ai compté les marches : quarante-deux. » / « Je te promets, moi : je serai là en juin. »
- **+3** — « J'ai rempli la tribune, {prenom} ; enfin, la 14A et la 14B, et maman à côté. C'est plein. » / « Je prends ta suite. Avec mon trait à moi, pas le tien. »

### 19.3 Rapports avec les autres
**Alliés** : Camille (la maison, la lettre de 1989), Paulette (le chocolat sur la 14B, le manteau), Gigi (il lui apprend à plonger du bon côté ; elle pose l'orange en 2031), Gégé (la banderole de sept ans au-dessus du bar), Dembo (l'hymne), Vaz (le banc), Brissac (les chiffres de 1965, qu'elle a crus). **Rivaux** : Vaubourg (« le fils ne veut pas de l'empire ; la fille non plus » : elle lui dit qu'elle n'est pas sa fille), Ilyas (l'ONG compte ses ouvriers), Bambini (« le football unit le monde » : elle a les chiffres). **Dettes** : elle doit à Josiane un lapin ; Vukić lui doit le cahier, à sa mort. **Elle aime** : Mbako, qui lui chante la berceuse de sa mère si les deux familles se croisent (90).

### 19.4 INTRIGUE co.sacha_promis  —  Tu m'as promis
**Logline** : Sacha grandit d'une carte par saison : la tribune vide à six ans, le nom de famille à douze, le tweet de trois heures, l'hymne qu'elle ne chante pas, l'ONG qui compte, et la Succession où elle prend ta suite ou la refuse. · **Synopsis** : Six ans, le zoo promis, le stade à la place. Douze ans, elle t'appelle par ton nom de famille. Président, tu as tweeté à trois heures ; elle l'a lu. Sélectionneur, elle ne chante pas l'hymne devant Vence. Instance, elle est dans l'ONG qui compte les ouvriers du Mondial que tu as attribué. À dix-huit ans, la Succession.
**Rôle(s)** : tous · **Postulat(s)** : partagé · **Porteur** : sacha · **Cast** : sacha, camille, paulette, gege, dembo, vence, nassir · **Thème** : famille
**Saisons** : une carte par saison à partir de `chars.sacha.age >= 6` ; jamais en S0 d'une carrière (elle naît en S1+) · **Conditions d'entrée** : `flag('sacha_nee')` ; `!flag('divorce')` sauf nom_de_famille et heritiere · **Exclusions** : — · **Rejouabilité** : jamais
**Issues** → **Traces** → **Qui les lit** : `promesse_tenue` → `sacha_promesse_tenue` (« {annee} : {prenom} {nom} a tenu une promesse à Sacha. Une ; elle a compté. ») → lue par 90 (lignée : trait hérité « tient parole »), 30 (`grand_deballage` plus : « sauf une, à Sacha ») · `nom` → `sacha_nom` (« {annee} : Sacha a appelé {prenom} {nom} par son nom de famille. Une fois. ») → lue par 90 (Sacha à −1 : Succession refusée), 04 (Camille : téléphone) · `hymne` → `sacha_hymne_muette` (« {annee} : Sacha n'a pas chanté l'hymne. Vence a filmé ; le sélectionneur a expliqué / n'a pas expliqué. ») → lue par 14 (`hymne_impose`), 13 (Dembo), 20 · `ong` → `sacha_ong` (« {annee} : Sacha compte les ouvriers des chantiers du Mondial. Elle a envoyé les chiffres à la FédéMonde ; son père/sa mère y siège. ») → lue par 15 (les ouvriers des chantiers : dossier), 02 (Ilyas, Bambini), 20 · `heritiere` → `sacha_heritiere` / `sacha_refus` → lue par 90 (Succession, « Trois générations »), 30 (écran de fin)
**Séquencier** : six_ans (âge 6) → nom_de_famille (âge 12, ou relation ≤ −1) → trois_heures (président, `flag('monde_flux')`, âge ≥ 10) → hymne (sélectionneur, âge ≥ 8) → ong (instance, âge ≥ 25) → heritiere (Succession, âge 18-22)
**Épilogue** : rien : Sacha suit la vie.

### SCÈNE co.sacha.six_ans  —  Six ans
**Rôle** : tous · **Intrigue** : co.sacha_promis · **Étape** : 1/6 · **Moment** : la saison de ses six ans, [3,12] · **Lieu** : l'entrée de la maison, un dimanche, un manteau déjà mis · **Conditions** : `chars.sacha.age == 6 && !flag('divorce')` ; variante `_tribune` si `flag('sacha_tribune_vide')`, `_apres` si `flag('naissance_apres')`
**SACHA** *(six ans — neutre — elle tient un ticket de zoo découpé dans L'Écho)*
« Tu m'as promis le zoo, dimanche, c'est écrit dans le journal, c'est dimanche. Le stade, c'est où tu cries ; le zoo, c'est où on regarde. »
← **Le zoo, la vidéo attendra** — effets : force −1, vestiaire −, relation.sacha +2, relation.camille +1, set: sacha_promesse_tenue, outcome: promesse_tenue — *Le zoo. Elle regarde les singes ; tu regardes ta montre ; elle le voit ; elle ne dit rien ; elle a six ans, elle note déjà.*
→ **Le stade a des animaux aussi** — effets : force +1, tribunes +, relation.sacha −2, set: sacha_promesse_rompue — *Le stade. Le lendemain, Sacha dit « tu m'as promis » ; c'est la première fois.*
**Traces** : sacha_promesse_tenue, sacha_promesse_rompue (« {annee} : le zoo était promis. {prenom} {nom} a choisi le stade ; Sacha a regardé la tribune vide. ») · **Réactions déclenchées** : co.re.camille_journal (existant, variante « elle a découpé le ticket ») · **Lu plus tard par** : 90 (lignée : trait), 30 (`grand_deballage` plus), § 4 (Camille : `co.camille.tribune_vide` exclusion si déjà jouée)

### SCÈNE co.sacha.nom_de_famille  —  Le nom de famille
**Rôle** : tous · **Intrigue** : co.sacha_promis · **Étape** : 2/6 · **Moment** : la saison de ses douze ans, ou dès que `relation.sacha <= -1`, [2,12] · **Lieu** : la cuisine, la lettre de 1989 sur la table si `camille_metier` n'a pas été joué, sinon un bulletin scolaire · **Conditions** : `chars.sacha.age >= 12`
**SACHA** *(douze ans — noir — elle dit ton nom de famille comme un professeur)*
« {nom}, tu es rentré à minuit trois fois cette semaine, j'ai compté ; maman ne compte plus, moi si. Tu m'as promis, ou tu n'as rien promis, dis-moi lequel. »
← **Je n'ai rien promis, pardon** — effets : relation.sacha +1, relation.camille +1, vestiaire −, set: sacha_nom — *Elle hoche la tête. Elle dit « papa » ou « maman » le lendemain. Elle a gardé le nom de famille pour une autre fois ; elle sait maintenant qu'il marche.*
→ **J'ai promis juin, on y est** — effets : relation.sacha −2, direction +, parole +1, promise, set: sacha_nom, set: sacha_promesse_juin — *Elle dit « juin ». Elle compte. En juin, tu as un Bilan ; elle a un bulletin ; personne ne lit le bulletin.*
**Traces** : sacha_nom, sacha_promesse_juin (« {annee} : {prenom} {nom} a promis juin à Sacha. En juin, il y avait un Bilan. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (Sacha à −1 : Succession refusée), § 4 (`co.retrouvailles.camille_telephone`), 30 (`grand_deballage` : « page douze : Sacha, juin »)

### SCÈNE pr.sacha.trois_heures  —  Trois heures du matin
**Rôle** : president, instance · **Intrigue** : co.sacha_promis · **Étape** : 3/6 · **Moment** : `flag('monde_flux') && chars.sacha.age >= 10`, [2,10], après un tweet de 3 h (Nouvelle ou alarme) · **Lieu** : la cuisine, sept heures, son téléphone tendu, ton message dessus · **Conditions** : —
**SACHA** *(dix à quinze ans — noir — elle lit ton message à voix haute, avec la faute)*
« Tu as tweeté à trois heures que l'arbitre était un vendu, avec une faute à « vendu » ; tout le collège l'a lu avant moi. Tu m'as promis d'être un parent ; les parents dorment à trois heures. »
← **J'efface, et je m'excuse** — effets : direction −, tribunes −, relation.sacha +2, relation.colline +1, set: tweet_efface — *Tu effaces. Colline a une capture ; il ne la publie pas ; il te regarde. Sacha te rend le téléphone ; elle a changé ton mot de passe.*
→ **L'arbitre était un vendu** — effets : tribunes ++, direction −−, relation.sacha −2, set: tweet_assume — *Le tweet reste. Sacha ne va pas au collège le lendemain ; elle va au stade, tribune Est, seule, en 14A.*
**Traces** : tweet_efface, tweet_assume (« {annee} : le tweet de trois heures. {prenom} {nom} a assumé ; Sacha a manqué le collège. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 13 (« Papa, tu as tweeté » : ce chapitre l'écrit, 13 le lit dans la chaîne des 60 heures), 02 (Colline, Vence), 20 (« LE TWEET DE 3 H »), 30 (`pr_pantin` plus)

### SCÈNE sl.sacha.hymne  —  L'hymne
**Rôle** : selectionneur · **Intrigue** : co.sacha_promis · **Étape** : 4/6 · **Moment** : `chars.sacha.age >= 8`, la veille ou le jour d'un match des Cobalts à domicile · **Lieu** : la tribune présidentielle, Vence à trois mètres, la caméra sur les familles pendant l'hymne · **Conditions** : —
**SACHA** *(huit à seize ans — neutre — la bouche fermée pendant l'hymne, elle te regarde, pas le drapeau)*
« Je ne chante pas l'hymne, Dembo ne le chantait pas et il m'a dit pourquoi, et la caméra est sur moi. Tu m'as promis de ne pas m'expliquer à la télé ; tu tiens ? »
← **Je tiens, je ne dis rien** — effets : tribunes −, direction −, relation.sacha +2, set: sacha_hymne_muette, outcome: hymne — *Vence demande. Le pays trouve ça normal ; le pays a des enfants.*
→ **J'explique, ça calme** — effets : tribunes +, relation.sacha −2, relation.dembo −1, set: sacha_expliquee — *Tu expliques. Dembo l'apprend. Sacha ne te parle pas pendant le tournoi ; elle chante l'hymne d'un autre pays, exprès, devant la caméra.*
**Traces** : sacha_hymne_muette, sacha_expliquee (« {annee} : le sélectionneur a expliqué à la télé pourquoi Sacha ne chantait pas. Elle a chanté un autre hymne, exprès. ») · **Réactions déclenchées** : co.re.sacha_hymne (§ 19.8, variante Dembo) · **Lu plus tard par** : 14 (`hymne_impose` variante), 13 (Dembo : `sl.dembo.hymne`), 02 (Vence), 20 (« LA FILLE DU SÉLECTIONNEUR NE CHANTE PAS »)

### SCÈNE in.sacha.ong  —  L'ONG
**Rôle** : instance · **Intrigue** : co.sacha_promis · **Étape** : 5/6 · **Moment** : `chars.sacha.age >= 25`, un dossier de l'année (les ouvriers des chantiers) · **Lieu** : le hall de l'hôtel du Lac, elle a un badge d'ONG, pas d'invitation · **Conditions** : `flag('mondial_desert') || year >= 2020`
**SACHA** *(vingt-cinq ans et plus — neutre — un dossier de chiffres, un par ouvrier)*
« On a compté les ouvriers du Mondial que tu as voté, {prenom} ; il en manque, et j'ai les noms, pas les chiffres, les noms. Tu m'as promis un parent, pas un dirigeant ; lequel lit le dossier ? »
← **Le parent, je lis ce soir** — effets : direction −−, tribunes ++, parole +1, relation.sacha +2, relation.nassir −2, relation.bambini −1, set: sacha_ong, outcome: ong — *Tu lis. Sacha attend dans le hall ; elle a le temps, comme Amsel.*
→ **Le dirigeant : la commission** — effets : direction ++, tribunes −−, relation.sacha −2, set: sacha_ong, set: ong_ecartee — *La commission examine. Elle signe de son nom, l'autre.*
**Traces** : sacha_ong, ong_ecartee (« {annee} : Sacha a publié les noms des ouvriers manquants. Sous le nom de {nom} ; signé de l'autre. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 15 (dossier « les ouvriers des chantiers », `lanceur_alerte` variante), 02 (Ilyas, Bambini, Amsel : « votre fille a les noms »), 20 (« LES NOMS »), 90 (lignée : Nemesis de sang)

### SCÈNE co.sacha.heritiere  —  L'héritière
**Rôle** : tous (Succession) · **Intrigue** : co.sacha_promis · **Étape** : 6/6 · **Moment** : après l'Épitaphe, à la Succession, si `chars.sacha.age in 18..22` · **Lieu** : l'écran de Succession, trois cartes face cachée, la troisième a son visage · **Conditions** : `flag('sacha_nee') && relation.sacha >= 0` (à −1 : variante `_refus`, une sortie)
**SACHA** *(dix-huit à vingt-deux ans — sourire — ton portrait à l'envers : un trait hérité, un trait inversé)*
« Je prends ta suite, ou je prends mon nom, l'autre, celui de maman, et je fais autre chose. Tu m'as promis, une fois, et tu as tenu, une fois ; ça suffit pour un essai. »
← **Prends ma suite** — effets : set: sacha_heritiere, outcome: heritiere — *Elle prend ton nom. Un trait hérité, un trait inversé : la fille du fusible est intègre, ou l'inverse. Gégé chante le nom ; il connaît l'accent, cette fois.*
→ **Prends ton nom, l'autre** — effets : set: sacha_refus, outcome: refus — *Elle prend l'autre. Elle est à l'ONG, ou à Mirevaux, ou kiné chez Rouvier. La lignée s'arrête ; le nom reste dans l'Almanach ; elle le lit parfois.*
*(Variante `_refus`, si `relation.sacha <= -1` : « {nom}, je ne prends pas ta suite. » Un bouton ; `set: sacha_refus`.)*
**Traces** : sacha_heritiere, sacha_refus (« {annee} : Sacha a refusé la suite. Elle a pris l'autre nom ; l'Almanach a gardé le premier. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (Succession, lignée, « Trois générations »), 30 (écran de fin : « Sacha, 19 ans, prend la suite »), 10 (héritière joueur amateur : postulat de départ)

### 19.5 Les paliers
### SCÈNE co.sacha.trahison_succession  —  L'autre nom
**Rôle** : tous · **Intrigue** : palier −3 · **Étape** : on_relation −3 · **Moment** : programmé en [1,3] · **Lieu** : la mairie, un formulaire de changement de nom, signé · **Conditions** : `relation.sacha <= -3`, une fois par carrière
**SACHA** *(seize ans et plus — noir — elle te tend la copie ; l'original est déposé)*
« J'ai pris le nom de maman à la mairie ce matin, c'est fait, c'est légal, et le stade ne chantera pas celui-là. Tu n'as rien promis, {nom} ; c'est pire, et c'est fini. »
← **Je signe la copie** — effets : tribunes −, vestiaire −, set: sacha_autre_nom, set: sacha_refus — *Tu signes. Gégé l'apprend. La tribune n'oublie rien ; elle chante ton nom sans la suite.*
→ **Je signe la copie** — effets : tribunes −, vestiaire −, set: sacha_autre_nom, set: sacha_refus — *Tu signes. Gégé l'apprend. La tribune n'oublie rien ; elle chante ton nom sans la suite.*
**Traces** : sacha_autre_nom (« {annee} : Sacha a changé de nom. La tribune a chanté celui de {nom}, sans la suite. ») · **Lu plus tard par** : 90 (Succession : pas d'héritière ; Nemesis de sang si elle monte dans le graphe), 30 (écran de fin), § 4 (Camille)

### SCÈNE co.sacha.faveur_tribune_pleine  —  La tribune pleine
**Rôle** : tous · **Intrigue** : palier +3 · **Étape** : on_relation +3 · **Moment** : programmé en [1,3] · **Lieu** : la tribune Est, un mardi d'entraînement ouvert, la 14A, la 14B, et Camille en 14C · **Conditions** : `relation.sacha >= 3`, une fois par carrière
**SACHA** *(tout âge — sourire — elle a rempli trois sièges ; pour elle c'est plein)*
« J'ai rempli la tribune, {prenom} : moi en 14A, l'orange en 14B, maman en 14C, et Gégé qui chante tout seul en Nord. Je te promets, moi : on sera là en juin, et tu monteras l'escalier. »
← **Je monte, maintenant** — effets : vestiaire −, tribunes ++, relation.sacha +1, relation.camille +1, set: tribune_pleine_sacha — *Quarante-deux marches. Elle les compte à voix haute. Camille ne dit pas à quelle heure ; elle sait : maintenant.*
→ **Après la séance, je promets** — effets : force +1, relation.sacha −1, parole +1, promise — *Après la séance, il reste Camille et l'orange. Sacha est partie chercher Gégé ; elle l'a trouvé ; il chante pour elle.*
**Traces** : tribune_pleine_sacha (« {annee} : Sacha a rempli la tribune Est : trois sièges. {prenom} {nom} a monté les quarante-deux marches. ») · **Lu plus tard par** : 90 (lignée : Succession acceptée d'office si `tribune_pleine_sacha`), 30 (`en_retraite` plus : « Sacha a le banc d'à côté »), § 4 (Camille : `co.retrouvailles.camille_sourire` variante)

### 19.6 Les retrouvailles
### SCÈNE co.retrouvailles.sacha_sourire  —  Les marches
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation, `chars.sacha.age >= 6` · **Conditions** : parmi les deux meilleures relations · **Lieu** : l'escalier de la tribune du nouveau stade
**SACHA** *(tout âge — sourire — elle a compté les marches du nouveau stade)*
« Trente-six marches ici, c'est moins qu'à {ville}, tu n'as plus d'excuse. Tu m'as promis ; je te le rappelle avant que tu oublies, pas après. »
**OK** **Trente-six, je monte** — effets : relation.sacha +1, vestiaire − — *Tu montes. Elle est en haut. Elle t'a gardé une place ; elle a demandé le numéro 14 ; il n'existe pas ici ; elle l'a écrit au marqueur.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.sacha_noir  —  Le nom
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : [2,6] après Passation, `chars.sacha.age >= 6` · **Conditions** : parmi les pires relations · **Lieu** : ton téléphone, le répondeur
**SACHA** *(tout âge — noir — elle n'est pas venue ; c'est un message sur le répondeur, ou un fax si `year < 2007`)*
« {nom}, tu as changé de club, et tu ne m'as pas demandé si je changeais d'école ; maman a demandé. Tu m'as promis un parent ; tu as un club. »
**OK** **Je rappelle ce soir** — effets : relation.sacha +1, vestiaire − — *Tu rappelles. Elle décroche à la sixième sonnerie ; elle a compté ; elle compte tout.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (retrouvailles : harmonisation des deux répliques par personnage à statut)

### SCÈNE co.retrouvailles.sacha_succession  —  Trois générations
**Rôle** : tous · **Intrigue** : retrouvailles · **Moment** : à la Succession, si `flag('sacha_heritiere')` a été posé dans un album précédent et que la lignée revient à {club} · **Conditions** : mémoire du club envers la lignée ≠ 0 · **Lieu** : l'écran de Succession, puis le rond central de {club}
**SACHA** *(la mère, désormais, du successeur — neutre — elle a le cahier de Vukić, ou le télégramme, ou le seau, ou rien)*
« Ton grand-père/ta grand-mère a crié dans ce rond, moi aussi, et toi tu vas y crier ; c'est le même rond, la tribune le sait. On m'a promis, j'ai promis, à ton tour ; tu tiens ? »
← **Je tiens** — effets : tribunes ++, vestiaire +, set: trois_generations — *Trois générations, un club. Le Destin s'allume. Gégé, ou Nino, chante le nom ; l'accent est le bon depuis 2032.*
→ **Je ne promets rien** — effets : direction +, tribunes − — *Rien. C'est honnête. Elle hoche la tête ; elle a ton visage inversé ; elle te comprend mieux que tu ne l'as comprise.*
**Traces** : trois_generations (« {annee} : trois générations de {nom} ont crié dans le même rond. La tribune le sait. ») · **Réactions déclenchées** : — · **Lu plus tard par** : 90 (lignée : « Trois générations » ; mémoire des clubs +2), 30 (écran-bilan du siècle)

### 19.7 Anecdotes
- **01.sacha_banderole** — objet · local de Gégé · La banderole de sept ans, « PAPA/MAMAN RENTRE », peinte au local avec les marqueurs des cousins ; au-dessus du bar depuis ; Gégé la décroche pour l'enterrement de personne.
- **01.sacha_marches** — légende · retrouvailles · Elle compte les marches de chaque stade : quarante-deux à {ville}, trente-six ailleurs, douze au stade municipal Gérard-Blanchet ; « le plus facile pour un parent ».
- **01.sacha_chocolat** — objet · `co.camille.tribune_vide` · Le chocolat entamé sur la 14B (six ans) : Paulette l'a trouvé, l'a fini, et a demandé à L'Écho de remercier « l'inconnue de la 14B » ; c'est la seule fois où Paulette a écrit sans dire cinquante et un.
- **01.sacha_hymne** — légende · `sl.sacha.hymne` · Elle connaît les paroles ; elle ne les chante pas ; Dembo lui a dit pourquoi ; en 2046, aux ardoises de Corbelin, elle chante une ligne, pour lui.
- **01.sacha_manteau** — objet · 2010+ · Le manteau de Paulette, bleu nuit et or, donné par la petite Paulette en 2010 ; Sacha le porte à l'ONG, à l'hôtel du Lac ; il déteint sur les fauteuils du comité.

### 19.8 Réactions propres
### RÉACTION co.re.sacha_hymne  —  Moi non plus
**Après** : sl.dembo.hymne (← je dis qu'il chante en silence) · **Famille** : tiers qui commente · **Conditions** : `flag('sacha_nee') && chars.sacha.age >= 8`
**SACHA** *(huit ans — neutre — elle a regardé le match à la télé, la bouche fermée pendant l'hymne)*
« Dembo n'a pas chanté et tu as dit qu'il chantait en silence ; moi non plus je ne chante pas, et toi tu dis quoi ? Tu m'as promis de ne pas m'expliquer. »
**Un bouton** : **Rien, tu as le droit** — effets : relation.sacha +1, relation.dembo +1 — *Elle hoche la tête. Elle apprend les paroles quand même, en secret ; on ne sait jamais.*

### RÉACTION co.re.sacha_seau  —  Pourquoi le banc est loin
**Après** : co.loco.profesor (← montrez-la-moi) · **Famille** : tiers qui commente · **Conditions** : `flag('sacha_nee') && chars.sacha.age >= 10`
**SACHA** *(dix ans et plus — sourire — elle est venue chercher le seau, sans le prendre)*
« J'ai demandé à monsieur Vaz pourquoi le banc était loin, il a souri, il n'a pas répondu ; toi, tu le sais maintenant. Tu m'as promis de ne pas mentir : c'est loin pourquoi ? »
**Un bouton** : **Douze mètres, soixante-sept** — effets : relation.sacha +1, relation.loco +1 — *Elle compte les mètres. Vaz la regarde depuis la haie ; il n'y a pas de caméra ; il sourit.*

---

## 20. La couture : traces, intrigues, questions

### 20.1 Ce que le chapitre lit (charte § 5.1) et où

| Trace | Lue par (scène de ce chapitre) |
|---|---|
| `mbako_vendu` | en.mbako.revient, en.mere.clause_en_face, co.mbako.trahison_clause (pose), co.re.gege_pardon, co.retrouvailles.mbako_noir |
| `mbako_lance` | en.sabatier.genou_du_petit (variante), pr.mbako.statue, en.mbako.banc_en_face (variante `_lance`) |
| `mbako_garde` | pr.mbako.statue (condition), co.mbako_horloge (entrée) |
| `pacte_gege` | jp.gege.numero (variante), co.gege_virage (entrée) |
| `onze_du_virage` | pr.gege.socios (pose de nouveau), § 9 registres |
| `gigi_staff` | sl.vecchio.troisieme (statut staff), co.vecchio_cinq_retraites (entrée), `co.vecchio.faveur_reunion` |
| `genou_opere` | ds.sabatier.visite_cachee |
| `flacon_b` | in.sabatier.temoin, co.rouvier.carnet_lu |
| `camille_ici` | co.camille.metier |
| `divorce` | co.camille.telephone, co.retrouvailles.camille_telephone, co.sacha.* (`!divorce` sauf nom_de_famille, heritiere) |
| `clow_ingrat` | en.clow.fils (`_ingrat`), co.clow.enterrement (`_pilier`) |
| `brassard_gigi` | en.brehaut.dernier_brassard (`_gigi`), en.vecchio.brassard |
| `bus_menace` | co.vecchio.faveur_reunion (lu par 11 en retour), sl.vecchio.troisieme |
| `derby_perdu` | co.camille.boulangere, jp.gege.numero (`_derby`), en.klopf.derby, co.paulette.orange |
| `sacha_nee` | toutes les scènes de § 19 ; co.camille.tribune_vide ; co.re.sacha_hymne, co.re.sacha_seau |

### 20.2 Ce que le chapitre pose et qui doit le lire

Trois familles. **Les traces transversales de la charte** que ce chapitre pose ou repose : `sacha_nee` (co.camille.naissance ; la carte `jp.famille.naissance` existante doit la poser aussi : remarque pour 10 et le chantier données), `divorce` (existant), `mbako_vendu` (palier −3), `ami_ultras` (jp.gege.numero), `onze_du_virage` (pr.gege.socios), `pharmacie_propre` (paliers +3 de Sabatier et Rouvier), `diplome` et `diplome_arrange` et `derogation` (Brissac), `tribune_a_renover` / `tribune_fermee` (Paulette), `bus_descendu` et `mutinerie_matee` (Fauvel +3), `hymne_impose` et `binational_bloque` (Dembo, Brissac), `coach_vire` (Vogler), `dembo_vendu` (Rouvier, Dembo), `gerard_parti` (Gérard −3), `infiltre` / `genou_ecoute` (Rouvier). **Les objets héritables** (Dossier, chapitre 90 : un seul objet actif par carrière, à trancher) : `cahier_vukic` (via `vukic_fidele`), `telegramme_clow`, `filet_gigi`, `seau_loco`, `casquette_klopf`, `sifflet_kine`, `sifflet_dede`, `ballon_dembo`, `echarpe_paulette`, `echarpe_gege`, `table_du_doc`, `cassette_1967`. **Les traces propres**, toutes lues au moins une fois par une autre fiche de ce chapitre ou par un chapitre nommé dans « Lu plus tard par » ; les plus structurantes, à inscrire au chapitre 90 :

| Trace | Posée par | Lecteurs désignés |
|---|---|---|
| `vukic_fidele`, `vukic_reste`, `cahier_garde`, `cahier_rendu`, `serrure_changee` | § 1 | 30 (en_sms, en_dauphin, jp_fils, bilan_carrefour), 11 (en.adjoint_dine), 14, 90 |
| `brehaut_ds`, `brehaut_frere`, `brehaut_previens`, `petition_vestiaire`, `lettre_vestiaire`, `brehaut_ecarte` | § 2 | 12, 13, 10, 11, 14, 20, 30 |
| `sabatier_secret`, `visite_arrondie`, `sabatier_temoin`, `dossier_medical_transmis`, `armoire_videe`, `genou_petit_dit`, `cheville_cachee` | § 3 | 15, 12, 11, 14, 20, 30 ; § 6, § 12 |
| `sacha_nee`, `naissance_avant/apres`, `camille_metier`, `hotel_assume`, `maison_cherchee`, `sacha_tribune_vide`, `camille_agente_mandat` | § 4 | § 19, 30, 11, 13, 02, 12, 90 |
| `clow_stage`, `clow_trois_verres`, `clow_pas_ecoute`, `fils_clow_main/refus`, `clow_a_parle`, `telegramme_clow` | § 5 | 10, 11, 14, 12, 20, 30, 31, 90 ; § 15 |
| `mbako_decide`, `mbako_revenu`, `mbako_cobalts`, `mbako_kambara`, `primes_ecole/seules`, `mbako_statue`, `mbako_banc`, `hymne_chante` | § 6 | 10, 11, 13, 14, 15, 20, 30, 90 ; § 8 |
| `gants_pretes`, `brassard_gant`, `gigi_trebignac`, `gigi_vingt_sixieme`, `filet_gigi`, `gigi_mort`, `une_rendue`, `reunion_ecoutee` | § 7 | 13, 14, 20, 31, 30, 90, 02 ; § 18 |
| `mentor_mbako`, `rival_mbako`, `mere_trois_pour_cent`, `mere_rien`, `mere_ecoutee`, `mbako_ecoute_seul`, `mere_agente_vingt`, `mere_examen`, `mere_dix_neuf_ans`, `lettre_mbako`, `mere_a_parle`, `numero_mere` | § 8 | 10, 12, 14, 15, 02, 20, 31, 90 ; § 6 |
| `abonnements_cinq_ecus`, `tarif_plein`, `gege_radio`, `gege_compte_anonyme`, `gege_socios`, `numero_siffle`, `siege_leve`, `bache_cousin` | § 9 | 13, 15, 20, 30, 31, 90, 02, 10 |
| `cassette_regardee/jetee`, `loco_banc_rapproche`, `loco_contrarie`, `loco_convoque`, `loco_compris`, `loco_prefere`, `klopf_prefere`, `loco_silence`, `seau_loco` | § 10 | 11, 12, 13, 20, 30, 90, 31 ; § 19 |
| `couru_avec_klopf`, `revanche_klopf`, `klopf_lateral`, `klopf_sans_gauche`, `klopf_refuse`, `klopf_trois_finales`, `klopf_a_pris`, `chante_par_klopf`, `casquette_klopf` | § 11 | 11, 12, 13, 14, 20, 30, 31, 90, 02 |
| `sifflet_kine`, `sifflet_ignore`, `stage_commando(_refuse)`, `tables_montees/hall`, `dembo_trois_semaines`, `rouvier_cabinet/fleurs`, `rouvier_a_parle`, `carnet_rouvier_transmis` | § 12 | 10, 11, 14, 15, 20, 30, 90 ; § 3, § 4 |
| `yacht_dembo`, `dembo_libre/banc`, `dembo_loft`, `dembo_hymne_muet`, `dembo_prete`, `dembo_ruine`, `poeme_corbelin`, `gamin_demande`, `gamin_vendu_sans`, `dembo_a_parle`, `ballon_dembo` | § 13 | 10, 11, 12, 14, 20, 30, 31, 90, 02 ; § 19 |
| `capitaine_fauvel_confirme`, `brassard_en_jeu`, `groupe_cobalts`, `liste_cobalts`, `fauvel_groupe`, `primes_apres`, `fauvel_syndicat`, `syndicat_ecarte`, `greve_soutenue/brisee`, `fauvel_relais/transmet`, `fauvel_premier_tireur`, `fauvel_ne_tire_pas`, `lettre_groupe_publique` | § 14 | 14, 15, 13, 11, 20, 30, 31, 90, 02 ; § 2, § 7 |
| `trop_lent_couru/autre`, `naturalise_appele/refuse`, `binational_libre`, `primes_egales/inegales`, `mirevaux_jeu/cameras`, `jeune_espoirs`, `jeune_garde_un_an`, `dossier_diplome_rouvert`, `diplome_brissac`, `cahier_brissac` | § 15 | 10, 11, 12, 14, 15, 20, 30, 31, 02 ; § 5, § 6 |
| `paye_en_bieres`, `buvette_minuit/loi`, `boite_ouverte/confiance`, `gerard_merci`, `gerard_pas_merci`, `gerard_mot_envoye`, `gerard_oublie`, `gerard_revenu/refuse`, `merguez_gerard/dupuis`, `bas_de_laine(_refuse)`, `mot_gerard` | § 16 | 10, 13, 20, 30, 90, 02 ; § 7, § 2 |
| `samedi_choisi`, `boulot_choisi`, `neveu_lace/titulaire`, `gardienne_titulaire/banc`, `dede_paye/benevole`, `dede_gamin_pro`, `dede_pas_rappele`, `dede_adjoint/ecarte`, `dede_montbeliac`, `sifflet_dede`, `dede_mort` | § 17 | 10, 11, 13, 15, 20, 30, 31, 90, 02 ; § 12 |
| `paulette_14a`, `paulette_loge`, `place_14a_joueur`, `bord_pelouse`, `orange_paulette`, `paulette_14b_vide`, `paulette_village`, `paulette_oubli`, `echarpe_paulette`, `echarpe_14a` | § 18 | 30 (ta_loge, jp_place14b, la_tribune, le_dernier_derby), 10, 11, 13, 20, 31, 90 ; § 7, § 19, § 4 |
| `sacha_promesse_tenue/rompue`, `sacha_nom`, `sacha_promesse_juin`, `tweet_efface/assume`, `sacha_hymne_muette`, `sacha_expliquee`, `sacha_ong`, `ong_ecartee`, `sacha_heritiere`, `sacha_refus`, `sacha_autre_nom`, `tribune_pleine_sacha`, `trois_generations` | § 19 | 90 (lignée, Succession, Nemesis de sang), 30, 13, 14, 15, 02, 20, 10 ; § 4, § 13 |

Lignes d'Almanach : chaque trace de ce chapitre porte sa ligne dans la scène qui la pose (« Traces »), ≤ 120 caractères, au gabarit `{annee} : …` ; les traces sans ligne sont marquées `journal:` (poids 1-2) et ne sont pas des traces déclarées.

### 20.3 Index des dix-neuf intrigues

| Intrigue | Porteur | Rôles | Thème | Scènes (dont paliers et retrouvailles) |
|---|---|---|---|---|
| co.vukic_cahier · Le cahier de Vukić | vukic | en, jp, sl, ds | direction | 6 + 2 + 3 |
| co.brehaut_costume · Le costume de Bréhaut | brehaut | jp, en, ds, pr, sl | vestiaire | 6 + 2 + 3 |
| co.sabatier_table · Entre la table et moi | sabatier | jp, en, sl, ds, in | corps | 6 + 2 + 3 |
| co.camille_naissance · Sacha | camille | tous | famille | 6 + 2 (secours médecin, agente) + 3 |
| co.clow_lundi · Lundi, huit heures | clow | jp, en, sl, ds | presse | 6 + 2 + 3 |
| co.mbako_horloge · L'horloge Mbako | mbako | jp, en, sl, in, pr | mercato | 6 + 2 + 3 |
| co.vecchio_cinq_retraites · Les cinq retraites de Gigi | vecchio | jp, en, am, pa, sl, pr | vestiaire | 6 + 2 + 3 |
| co.mere_trois_pour_cent · Trois pour cent | mere_mbako | jp, ds, sl, in, en | mercato | 6 + 2 + 3 |
| co.gege_virage · Le virage | gege | jp, pr, en, in, am, pa | tribune | 6 + 2 + 3 |
| co.loco_cassette · La cassette | loco | en, ds, jp, pr | absurde | 6 + 2 + 3 |
| co.klopf_pressing · On court, on presse, on chante | klopf | en, ds, sl, pr | vestiaire | 6 + 2 + 3 |
| co.rouvier_sifflet · Le sifflet du kiné | rouvier | jp, en, sl, ds, pr, in | corps | 6 + 2 + 3 |
| co.dembo_ballon · Donne-moi le ballon | dembo | jp, en, pr, sl, ds, in | vestiaire | 6 + 2 + 3 |
| co.fauvel_liste · On est un groupe, pas une liste | fauvel | sl, jp, in, en | instances | 6 + 2 + 3 |
| co.brissac_chiffres · Les chiffres sont têtus | brissac | en, sl, in, jp, pr | instances | 6 + 2 + 3 |
| co.gerard_boite · La boîte en fer | gerard | am, pa, en, pr | argent | 6 + 2 + 3 |
| co.dede_sifflet · Mon sifflet est à toi | dede | am, pa, jp, en | famille | 6 + 2 + 3 |
| co.paulette_14b · Place 14B | paulette | tous | tribune | 6 + 2 + 3 |
| co.sacha_promis · Tu m'as promis | sacha | tous | famille | 6 + 2 + 3 |

Ratio léger / stratégique / drame à l'échelle du chapitre : les drames sont sobres et isolés (l'enterrement de Corven, la minute de Gigi, la soixante-dixième de Paulette, l'enterrement de Dédé : quatre scènes à une sortie, aucune en S0, aucune partageable en Une) ; environ un tiers des scènes sont de thème `absurde` ou `famille` (Vaz, Gérard, Dédé, Sacha, les casquettes, le bateau de pêche).

### 20.4 Questions ouvertes (pour le showrunner et le chapitre 90)

1. **Troisième retrouvailles.** La spec § 1.13 ne prévoit que `_sourire` et `_noir` ; ce chapitre en ajoute une par personnage (`_telephone`, `_enterrement`, `_fantome`, `_banc_en_face`, `_carnet`, `_cassette`, `_tapis`, `_corbeaux`, `_hymne`, `_cabinet`, `_carte_postale`, `_place_vide`, `_succession`, `_cousin`). Elles sont servies une fois par carrière sur un statut (`retraite`, `mort`, `rival`) et non à la Passation ; le moteur doit accepter un troisième id dans `retrouvailles:` ou les traiter comme des cartes de rôle `once` à condition de statut. À trancher.
2. **`statut: mort`.** La spec ne liste que `club | staff | parti | vendu | retraite | rival`. Ce chapitre suppose un statut `mort` (Corven, Vecchio 2031, Paulette 2009, Dédé 2012, Sabatier 2029, Brissac 2036, Mère de Mbako 2041, Gérard 2019, Fauvel 2045, Dembo 2046, Vaz 2039, Vukić 2038, Bréhaut 2044, Gégé 2040, Vogler 2047, Mbako 2049) et une relation posthume (« +1 (posthume) ») qui n'affecte que la mémoire des clubs et le Panthéon. Le chapitre 31 écrit les Nouvelles de décès ; le chapitre 90 décide si `mort` est un statut ou `parti` + une trace `<id>_mort`.
3. **Colline dans `co.vecchio.minute`.** Colline est un personnage du chapitre 02 (camp `instances`, responsable de l'arbitrage à la Fédération dès 2008 : il a 75 ans en 2031 et ne siffle plus) ; il parle ici comme voix sans portrait et fait ajouter la minute par l'arbitre du jour. Le chapitre 02 lui donne un portrait : la scène le prend tel quel.
4. **Le fils de Corven, Momo, Nino, Bébert, Marinette, la petite Paulette, la petite Josiane, la docteure Ferrand, Ilan Sorel, Noa Vandel, Bastien Lorrain, Aurèle Castan** : voix sans portrait dans ce chapitre (deux cartes au plus chacune, pas de relation), conformément à § 2.3 ; le chapitre 90 décide lesquels deviennent des personnages à statut (candidats : Noa Vandel, le prodige d'après ; Nino, le capo d'après ; Owen Corven).
5. **`jp.famille.naissance` (existante)** pose `jeune_papa` mais pas `sacha_nee` : à ajouter par le chantier données pour que Sacha existe aussi dans une carrière commencée joueur.
6. **Les objets héritables** (douze dans ce chapitre) : le Dossier n'en porte qu'un ; le chapitre 90 fixe la règle de choix (le dernier reçu, ou un choix à la Succession).
7. **Deux sifflets** (Rouvier, Dédé) : ce sont deux objets distincts (`sifflet_kine`, `sifflet_dede`) ; la réaction de Rouvier « deux sifflets, un seul kiné » est à écrire par 12 si les deux coexistent.
8. **`pr.gerard.trahison_caisse`** double `en.evt.gerard` (existante, entraîneur) côté président amateur ; le chapitre 13 harmonise (une seule pose de `gerard_parti` par carrière).
9. **Espaces d'ids** : les scènes de ce chapitre vivent dans `co.<id>.*` et `<préfixe>.<id>.*` (`en.vukic.*`, `jp.vecchio.*`, `en.mbako.*`…). Les chapitres 10-15 ont, depuis, écrit leurs propres scènes dans les mêmes espaces (`jp.mbako.contre_toi`, `jp.gege.petit`, `pr.gerard.tombola`, `pr.gege.centre`, `jp.dembo.yacht`…) : l'espace est donc **partagé**, pas réservé ; aucun id n'y est défini deux fois avec deux contenus (vérifié sur 02 et 10-14 : ils citent les scènes de ce chapitre par leur id exact et n'en redéfinissent aucune). Le chapitre 90 tient l'index unique des ids ; toute collision future se règle en suffixant la scène la plus récente.
10. **Réactions citées à écrire ailleurs** : `co.re.barbier_doudoune` (citée ici et au chapitre 10 ; le chapitre 02 ne l'a pas écrite : à écrire par 02 ou par 10 dans la fiche Barbier, « Je l'ai vu jouer sous la pluie. À cinquante ans. »), `en.rouvier.commando_blesses` (11, chaîne), `en.re.camille_le_verre` variante joueur (11 ; la réaction existe dans `content/`), `en.re.gege_jumelles` (11).
11. **Harmonisation avec le chapitre 02** (écrit après ce chapitre, relu ici en retour) : les décès et mandats que 02 fixe sont repris : Fardelli meurt en 2032 (la cassette de 1967, en 2039, est remise par Solvang, qui a repris son carnet en 2018) ; Vence prend sa retraite en 2035 (l'hymne de 2045 est commenté par « la remplaçante de Vence », voix sans portrait) ; Léa quitte Le Quotidien en 2035 (en 2041, elle édite le carnet de la mère de Mbako en retraitée) ; Bréhaut préside la Ligue 2020-2028 et la Fédération 2028-2036 « par défaut », Mbako la Fédération 2036-2044 « par défaut » : les deux fiches le disent désormais, sans rien changer à la buvette du samedi ni à la statue ; Vaubourg meurt en 2020, Josiane en 2041, Pichon en 2019, Roux en 2014, Barbier en 2021 : aucune scène de ce chapitre ne les fait parler après. Rossard (`rossard`, sélectionneur 1986-1994, créé par 02) est le sélectionneur que Vence a fait pleurer en 1990 et celui dont Fauvel a raté le tir au but : la fiche Fauvel ne le nomme pas, elle le laisse à 02. Les retrouvailles de Josiane, Fardelli et Massenet (02) suivent la même mécanique que celles d'ici ([2,6] après Passation, deux meilleures / pires relations, deux phrases, un tic, un nom une fois) : vérifié, rien à harmoniser côté 01.

### 20.5 Relecture (seconde passe)

Vérifications mécaniques faites sur les 230 blocs (216 scènes, 14 réactions) : ids au format § 4.10 sans doublon ; répliques ≤ 200 caractères ; libellés ≤ 28, sans le nom du joueur, sans « Oui / Non » ; nom du joueur au plus une fois par carte ; relations ±1 (±2 exceptionnel) ; un `+++` au plus par côté ; ids « existants » tous présents dans `content/` (les autres ids cités appartiennent aux chapitres 10-15 et 30, nommés à chaque fois). Corrigés à cette passe : un libellé de trente caractères (`co.re.sacha_seau`), une relation à −3 (`in.sacha.ong`, ramenée à −2), un effet `relation 0` (`co.retrouvailles.loco_noir`), un double tic (Gérard cité dans `co.retrouvailles.vecchio_telephone`), cinq répliques à trois ou quatre phrases (Camille, les deux mots écrits de Gérard), un id fantôme (`co.paulette.derby` → `co.paulette.orange`), et la fonction de Colline en 2031 (responsable de l'arbitrage, conforme au chapitre 02). Les répliques de Mbako et de Rouvier comptent trois points parce que leur tic en contient deux (« Je veux jouer. Maintenant. », « Respire. Encore. ») : c'est le tic, pas une troisième phrase.

### 20.6 Check-list du chapitre (§ 6.2 de la charte)

- [x] 19 fiches au gabarit § 4.2, avec fenêtre et suivant ; adresse dans les huit rôles (§ 0.1) ; cinq registres × deux répliques.
- [x] **38 scènes de palier**, et le compte tombe juste : **36 écrites ici** au gabarit § 4.1 (32 `co.<id>.trahison|faveur_*` partagées, plus 4 variantes de rôle : Gégé joueur et président, Mbako sélectionneur, Camille médecin et agente), **plus 6 ∃ citées et jamais réécrites** parce qu'elles existent déjà dans `content/` (`en.gege.trahison_banderole`, `en.gege.faveur_insurrection`, `co.camille.dispute`, `co.camille.chambre_amis`, `co.camille.valise`, `co.camille.secours`). Les fiches Gégé et Camille portent la mention **∃** sur leur ligne **Paliers** : c'est ce qui manquait pour que le chapitre 90 puisse fermer la matrice.
- [x] 57 scènes de retrouvailles (deux au gabarit spec + une troisième hors gabarit par fiche).
- [x] 121 scènes propres (six par fiche, plus des variantes de rôle et deux compléments), 14 réactions au gabarit § 4.4, 95 anecdotes au gabarit § 4.9 ; 216 scènes en tout.
- [x] Répliques ≤ 200 caractères, deux phrases, un tic, un nom une fois ; libellés ≤ 28, première personne, sans « Oui / Non », sans le nom du joueur ; effets en notation § 4.11 ; conséquences sans explication.
- [x] Toutes les traces posées ont un lecteur nommé (« Lu plus tard par ») ; les traces lues de § 5.1 sont toutes lues (§ 20.1).
- [x] Aucun nom réel, aucune monnaie réelle (francs, écus), aucun chiffre de jauge ou de relation dans un texte ; les pays sont ceux de la charte (Dalmarie, Kambara, Vestrie, Al-Dorado) ; « au soleil » pour la fuite de Gérard.
- [x] Années cohérentes (pas de Flux avant 2007, pas de vidéo avant 2016, fax jusqu'en 2010, écus dès 2002) ; les âges suivent 1990 + saisons.
- [x] Drames sobres, hors S0, jamais deux d'affilée, jamais partagés en Une.

### 20.7 Relecture (troisième passe, après le chapitre 02)

Passe mécanique sur les 230 blocs, gabarit § 4.1 champ par champ. Harmonisés à cette passe : les **paliers** portent tous la même ligne d'en-tête (`**Intrigue** : palier ±3 · **Étape** : on_relation ±3 · **Moment** : programmé en [1,3] · **Lieu** · **Conditions** : relation.<id> ≤ −3 ou ≥ 3, une fois par carrière`), y compris les deux secours de Camille (qui lisent en plus `camille_medecin` / `camille_agente`) ; les **retrouvailles** portent toutes `**Intrigue** : retrouvailles` et un **Lieu**, et une ligne **Traces** (« — » quand elles ne posent rien ; l'objet héritable quand elles en donnent un : `echarpe_gege`, `cassette_1967`, `cahier_brissac`, `mot_gerard`, `trois_generations`, chacun avec sa ligne d'Almanach et son lecteur au chapitre 90). Corrigés : un nom cité deux fois dans une réplique (`co.retrouvailles.mere_mbako_noir` : « vous aurez « mon ami » ») ; trois objets d'époque sans borne d'année (le fax de `co.camille.telephone` devient « le mot arrive au secrétariat » ; les fax de `sl.brissac.binational` deviennent des courriers ; `sl.fauvel.avion` reçoit `year <= 2008`, la durée du mandat de Berthomier) ; trois locuteurs hors fenêtre après les décès et retraites fixés par le chapitre 02 (Solvang à la place de Fardelli en 2039, « la remplaçante de Vence » en 2045, Léa retraitée en 2041) ; les fiches Bréhaut et Mbako reprennent les mandats « par défaut » de la table de 02 (§ 20.4, point 11). Deux notations d'effet hors § 4.11 sont conservées parce que les cartes existantes de `content/` les emploient déjà : `rand:` (`en_vestiaire.yaml`, `en_mercato.yaml`) dans `jp.dembo.penalty`, et `var:` (`arc_vieux_gardien.yaml`, `arc_clow_presse.yaml` : `no_comment`) dans `co.mbako.trahison_clause`. Longueur : le chapitre dépasse la cible du chantier parce que les minima de la charte (dix-neuf fiches, trente-huit paliers, cinquante-sept retrouvailles, six scènes propres et cinq anecdotes par fiche) l'imposent ; rien n'y est écrit deux fois.
