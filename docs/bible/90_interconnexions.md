# FUSIBLE — Bible scénaristique · 90 · Les interconnexions

> Chapitre 90, écrit après les onze autres, relu par le showrunner. Ce n'est pas un chapitre d'histoires : c'est **la carte de tout ce qui se répond**. Un joueur qui vend Mbako en 1994 doit l'entendre en 2011 par la bouche de sa mère devenue agente de vingt joueurs ; une enveloppe refusée en D2 doit changer le regard d'un arbitre vingt ans plus tard, à l'Union. Ce document dit **qui pose**, **qui lit**, **où**, **quand** — et il refuse ce qui ne se répond pas.
>
> Il est aussi le **procès-verbal de la couture** : § 9 liste les contradictions relevées entre les chapitres 00 à 31, avec une proposition de correction pour chacune. Le chapitre 90 ne corrige pas les autres chapitres ; il les met d'accord sur le papier, et le showrunner tranche.

## 0. Comment lire ce chapitre

**Ce qu'il contient.** § 1 la matrice des traces (le contrat entre chapitres) · § 2 la carte des réactions (choix → réaction) · § 3 les personnages à statut : qui part, qui revient, dans quel rôle, quelles retrouvailles, plus le Fantôme, la mémoire des clubs, le Nemesis et la lignée · § 4 les intrigues partagées `co.*` et les intrigues miroir · § 5 les fils rouges par postulat et ce qu'ils déclenchent · § 6 les chaînes multi-rôles et les trois carrières de référence · § 7 la chronologie croisée · § 8 les objectifs cachés et leurs indices · § 9 les contradictions.

**Les conventions.** Les ids suivent la charte § 4.10. Le signe **∃** marque ce qui existe déjà dans `content/` et ne se réécrit pas. Le signe **✱** marque une trace de la liste des quarante transversales (charte § 5.2). Une trace citée sans chapitre est une trace de rôle, décrite dans le chapitre de son rôle. Quand ce document écrit une scène, elle est au gabarit § 4.1 et s'importe telle quelle.

**Les trois lois de la couture.** (1) **Toute trace posée est lue ailleurs** — sinon elle n'est pas une trace, c'est une décoration : on la retire du `set:` et on la garde dans la ligne d'Almanach. (2) **Toute trace lue est posée quelque part** — sinon la variante ne sort jamais et le lecteur ne le saura jamais, ce qui est pire. (3) **Une trace se lit au moins une fois dans un autre rôle que celui qui la pose** — c'est ce qui fait qu'une carrière a une mémoire et pas seulement une saison.

**Les chiffres de l'état actuel.** 1 782 traces posées par les onze chapitres (dont 40 transversales et 49 de monde) ; 230 posées et jamais lues (§ 1.5) ; 62 lues et jamais posées, dont 22 sont de faux orphelins (§ 1.6) ; 2 096 ids définis, 3 050 cités ; 166 réactions écrites pour 205 citées ; 290 manchettes écrites pour 702 citées. Le travail restant est décrit en § 1.7 et § 9.

---

## 1. La matrice des traces

### 1.1 Comment lire la matrice

Une trace a quatre attributs : **qui la pose** (chapitre · intrigue · scène · quel choix), **qui la lit** (scène, variante, manchette, réaction, alarme, set-piece, fin, épitaphe), **sa ligne d'Almanach** (`{annee} : …`, ≤ 120 caractères, écrite par le chapitre qui pose), et **sa portée** : `run` (la carrière en cours), `lignée` (elle survit à la Succession), `monde` (elle est vraie pour tout le monde, pour toujours).

Trois portées, trois durées de vie :

| Portée | Ce que c'est | Exemples | Ce qui la remet à zéro |
|---|---|---|---|
| `run` | un fait de la carrière en cours | `banc_bosse`, `fax_rate`, `voeu_petit` | la fin de carrière |
| `lignée` | un fait attaché au **nom** et aux **relations** | `capitaine`, `genou`, `divorce` ✱, `sacha_nee` ✱, `international` ✱, `diplome` ✱, `ami_ultras` ✱, `offshore` ✱, `radie` | rien ; la Succession les hérite (charte § 3.3) |
| `monde` | un fait du monde persistant | les 49 `monde_*`, `mbako_vendu` ✱, `aubert_ministre` ✱, `mondial_desert` ✱, `ligue_fermee_signee` ✱ | rien ; ils datent le décor pour toutes les carrières suivantes |

**Règle de portée à trancher par le chantier données** : aujourd'hui aucune trace ne déclare sa portée. Proposition : un champ `scope: run | lignee | monde` dans `flags.yaml`, valeur par défaut `run`. Sans lui, une carrière de joueur amateur en 2044 peut lire `pacte_gege` posé par un entraîneur en 1993, ce que personne ne veut ; et à l'inverse `mbako_vendu` doit rester vrai après la mort du joueur qui l'a vendu, ce que tout le monde veut.

### 1.2 Les quarante transversales, ligne à ligne

État réel après relecture des onze chapitres. « Pose » et « Lit » donnent les chapitres qui le font vraiment, pas ceux que la charte annonçait ; l'écart est noté en dernière colonne.

| # | Trace | Posée par (chapitre · scène de référence) | Lue par (chapitres, nombre d'endroits) | Écart avec la charte § 5.2 |
|---|---|---|---|---|
| 1 | `mbako_vendu` ∃ | 11 · `en.prodige` (issue *vendu*) ; 01 · `en.mbako.banc_en_face` | 01(10) 02(5) 10(6) 11(10) 12(3) 13(4) 14(5) 20(2) 30(4) | conforme ; la trace la mieux cousue du jeu |
| 2 | `mbako_lance` ∃ | 11 · `en.prodige` (issue *lancé*) | 01(6) 10(1) 11(5) 13(2) 14(8) 20(4) 30(4) | conforme |
| 3 | `mbako_garde` ∃ | 11 · `en.prodige` (issue *gardé*) | 01(2) 11(2) 12(1) 14(1) 20(2) 30(3) | conforme, mais faible : 12 devait en faire « l'option Almadis », il n'en fait qu'une ligne |
| 4 | `pacte_gege` ∃ | 11 · `en.kop.pacte` | 01(3) 02(1) 10(4) 11(4) 13(9) 20(5) 30(7) 31(2) | conforme ; ch. 13 en est le meilleur lecteur (le local rénové) |
| 5 | `onze_du_virage` ∃ | 11 · `en.kop.onze` ; 01 · `co.gege_virage` | 01(3) 11(5) 13(8) 20(3) 30(4) 31(1) | conforme |
| 6 | `ami_ultras` ∃ | 10 · `jp.tifo` ; 11 · le local ; 01 · `co.gege_virage` ; 14 · `sl.le_pays_attend` | 01 10 11(5) 13(5) 14 20(5) 30 | conforme ; **quatre chapitres la posent** : à documenter comme trace « à poses multiples » |
| 7 | `naming_signe` ✱ ∃ | 11 · `en.nassir` (naming) ; 13 · `pr.naming` (Arena) ; 02 · `co.dupuis_nom_dans_le_dos` | 02(8) 10(3) 11(2) 12(2) 13(6) 15(1) 20(3) 30(8) 31(2) | conforme ; ch. 10 la lit enfin (« le stade s'appelle comme une boisson ») |
| 8 | `club_actif` ∃ | 11 · `en.nassir_proprietaire` ; 13 · `pr.naming` / `pr.vente_du_club` ; 30 · alarme | 01(2) 02(9) 11(6) 12(3) 13(10) 14(1) 15(2) 20(2) 30(6) | conforme |
| 9 | `club_a_lancienne` ∃ | 11, 13 (refus de toute la chaîne Ilyas) ; 02 | 02(4) 11(6) 13(5) 15(1) 20(1) | conforme |
| 10 | `nassir_pret` ∃ | 11, 13 | 11(3) 12(1) 13(3) 20(1) 30(1) | conforme, mince |
| 11 | `gigi_staff` ✱ ∃ | 11 · `en.vieux_gardien` (issue *staff*) ; 10 · `jp.conseils_gigi` | 01(5) 10(9) 11(11) 12(6) 14(6) 20(3) 30(3) 31(2) | conforme ; ch. 14 tient la promesse (« il descend le premier du bus ») |
| 12 | `finale_gigi` ∃ | **contenu existant** (`en.promu` A9), aucun chapitre de la bible | 11(3) 20(1) 30(3) | conforme : posée par `content/`, lue par la bible |
| 13 | `vecchio_promis` ∃ | 11 ; 13 · `pr.coupe_du_village` | 11(3) 13(3) 20(2) | conforme |
| 14 | `enveloppe_promise` ✱ ∃ | 11 · `en.enveloppe` ; 13 · `pr.valise` ; 02 · `co.pichon_cent_cinquante` | 02(17) 11(12) 12(2) 13(7) 15(2) 20(3) 30(1) 31(1) | conforme ; **trois chapitres la posent** dans trois mondes (pro, village, instances) : le sens doit rester « on m'a promis une enveloppe », jamais « j'en ai pris une » |
| 15 | `enveloppe_refusee` ∃ | 11, 13 | 02(3) 11(3) 13(3) 15(3) 20(1) 31(1) | conforme ; ch. 15 tient la promesse (Colline te regarde autrement) |
| 16 | `flacon_b` ✱ | 10, 11 · `co.pharmacie` | 01(5) 02(3) 10(10) 11(14) 14(3) 15(6) 20(3) 30(3) | conforme ; le meilleur exemple d'intrigue miroir (§ 4.2) |
| 17 | `pharmacie_propre` ✱ | 10, 11 · `co.pharmacie` ; 01 · `co.rouvier_sifflet` ; 31 · `co.dec.vestiaire` | 01 10(3) 11(4) 15 20 31 | conforme |
| 18 | `salaires_retard` ✱ ∃ | 11 · `en.salaires_retard` ; 12 · `ds.commission_occulte` ; 02 · `co.josiane_fiche` | 02(6) 10(2) 11(21) 12(4) 20(4) 30(6) 31(5) | conforme ; ch. 13 devait la poser « côté trésorerie » et ne le fait pas explicitement |
| 19 | `vukic_dauphin` ✱ ∃ | 11 · `en.adjoint_dine` | 01(5) 02(3) 10(7) 11(16) 14(1) 20(3) 30(5) | conforme |
| 20 | `clow_ingrat` ✱ ∃ | 11 · `en.mentor_clow` | 01(7) 10(4) 11(2) 12(6) 20(2) 30(3) 31(1) | conforme ; ch. 01 tient « pas de testament », ch. 12 tient « le fils de Corven refuse ta lignée » |
| 21 | `diplome` ✱ ∃ / `diplome_arrange` | 10 · `jp.diplome_joueur` ; 11 · `en.diplome` ; 01 · `co.brissac_chiffres` ; 02 · `co.legruet_apres_le_congres` | `diplome` : 01(11) 02(4) 10(18) 11(23) 20 30(4) · `diplome_arrange` : 01 02(5) 10 11(4) 15 20 | conforme ; **quatre poseurs** pour `diplome` : à réduire à deux (10 et 11), 01 et 02 se contentent de le lire |
| 22 | `derby_perdu` / `derby_gagne` ✱ | 10, 11, 13 · `co.derby` | perdu : 01(9) 02(2) 10(2) 11(3) 13(5) 20(2) 30(2) · gagné : 02(2) 10(3) 11(5) 13(5) 20(3) | conforme ; ch. 14 ne les lit pas (il pourrait : « le derby de la vallée sans vous ») |
| 23 | `camille_ici` ✱ | 10, 11 · `co.cartons_camille` | 01(6) 10(4) 11(8) 14(3) 15 20(3) 30 | conforme |
| 24 | `divorce` ✱ ∃ | **contenu existant** (`co.camille.valise`, palier −3) ; 30 le repose en alarme | 01(23) 02(6) 10(21) 11(13) 12(2) 13(7) 14(4) 15(3) 20(11) 30(5) 31(2) | conforme ; la trace la plus lue du jeu (117 lectures) |
| 25 | `sacha_nee` ✱ | 01 · `co.camille_naissance` | 01(15) 02 10(7) 11(7) 12 13(10) 14(3) 15 20(4) 30(2) 31(2) | **écart** : la carte existante `jp.famille.naissance` pose `jeune_papa` et **pas** `sacha_nee` (§ 9, contradiction C-14) |
| 26 | `genou_opere` / `genou` ✱ ∃ | 10 · `jp.genou_parle` | `genou` : 01(34) 10(103) 11(14) 12(9) 13 14(6) 20(2) 30(8) 31 · `genou_opere` : 01(3) 02 10(7) 11(3) 12(3) 14(3) 15 20 | conforme |
| 27 | `capitaine` ✱ ∃ | 10 · `jp.brassard_test`, `jp.brassard_20/33` | 01(40) 02(21) 10(65) 11(64) 12(45) 13(15) 14(61) 15(4) 20(3) 30(11) 31(7) | conforme ; attention : `capitaine` sert aussi de **mot commun** dans les didascalies, le lint doit compter les `flag('capitaine')`, pas les occurrences |
| 28 | `international` ✱ ∃ | 10 · `jp.selection` ; 02 · `co.legruet_apres_le_congres` | 01(3) 02(5) 10(19) 14(2) 15 20(5) 30(4) | conforme ; **ch. 14 ne la lit que deux fois** alors que la charte lui demandait « vous avez été international, vous savez » : à renforcer |
| 29 | `binational_choisi` ✱ | 10 · `jp.selection` (valeur `cobalts` \| `kambara`) | 01(3) 10(19) 12 14(7) 20 | conforme ; **ch. 15 ne la lit pas** (« les fédérations se disputent ») : manque |
| 30 | `selection_refusee` ✱ | 10 (forfait pour le club) ; 14 (le joueur qui refuse) ; 02 | 02(4) 10(9) 14(3) 15 20(2) 30(4) | conforme |
| 31 | `special` ✱ ∃ | 10 · `jp.premiere_une` | 01(2) 10(10) 11 12 14(3) 20 30(4) | conforme |
| 32 | `offshore` ✱ ∃ | 10 · `jp.contrat_image` ; 12 · `ds.commission_occulte` ; 30 · alarme caisse haute | 02(12) 10(12) 12(4) 20 30(2) | conforme ; **ch. 15 ne la lit pas** alors que « les documents de La Plume » lui sont attribués : manque |
| 33 | `president_ami` ✱ | 11, 12 (DIRECTION ≥ 80 trois saisons) ; 30 · alarme direction haute | 02(9) 11(4) 12(4) 13(6) 14(4) 15(5) 20 30 | conforme, très bien cousue |
| 34 | `fede_dossier` ✱ | 15 · `in.salle_trois` ; 11 · `en.commission_discipline` ; 02 ; 30 | 01(5) 02(12) 11(10) 12 13(3) 14(2) 15(3) 20(2) 30(5) 31(2) | conforme |
| 35 | `vote_achete` ✱ | 15 · `in.les_valises` | 02(20) 15(7) 20(2) 30(8) 31(2) | conforme ; **ch. 02 la lit vingt fois** : c'est le carburant du camp `instances` |
| 36 | `mondial_desert` ✱ | 15 · `in.dossier.attribution` | 01 02(10) 12 13(4) 14(5) 15(9) 20(2) 30(5) | conforme |
| 37 | `ligue_fermee_signee` ✱ | 13 · `pr.ligue_fermee` (h6) ; 15 · `in.dossier.ligue_fermee` | 01 02(12) 13(8) 14 15(3) 20 30(3) | conforme |
| 38 | `ecoutes` ✱ | 13 · `pr.ecoutes` | 02(24) 13(22) 15(4) 20 30(2) 31(2) | conforme |
| 39 | `commission_lettre` ✱ | 13 · `pr.commission` ; 12 · `ds.masse_salariale` ; 02 ; 30 | 02(9) 10 12(6) 13(7) 15(2) 20(3) 30(9) | conforme |
| 40 | `aubert_ministre` ✱ | **20** · `co.nv.2002_aubert_ministre` | 02(9) 11 12 13(5) 14(3) 15 20(4) 30(2) | **écart de chapitre** : la charte l'attribuait à 31, c'est 20 qui l'a écrite. Sans conséquence, mais à noter dans la charte |

**Ce que la matrice apprend.** Les quarante tiennent : aucune n'est orpheline, aucune n'est muette. Trois seulement sont trop minces (`mbako_garde`, `nassir_pret`, `vecchio_promis`, toutes lues par trois chapitres ou moins) ; quatre manques précis sont à combler par les chapitres concernés (28 dans 14, 29 dans 15, 32 dans 15, 22 dans 14). Le défaut n'est pas dans les quarante : il est dans les 1 742 autres (§ 1.5).

### 1.3 Les traces de monde (`monde_*`)

Quarante-neuf drapeaux de monde, tous posés par les Nouvelles datées du chapitre 20 (§ 3), tous lus au moins une fois. Ils ne sont jamais remis à zéro : ils datent le décor pour toutes les carrières. La charte n'en nommait que huit ; les quarante et un autres sont des ajouts du chapitre 20, acceptés ici.

| Décennie | Drapeaux | Ce qu'ils arment |
|---|---|---|
| 1990-1999 | `monde_droits_1990`, `monde_cobalts_1990`, `monde_tele_stade`, `monde_vaucastel`, `monde_continentale_1993`, `monde_sans_mondial`, `monde_dimanche_soir`, `monde_libre_1993` ✱, `monde_quotas`, `monde_dix_huit`, `monde_droits_1997`, `monde_titre_2002` ✱, `monde_premier_libre`, `monde_fonds`, `monde_but_en_or` | l'arrêt Vaneste ouvre les fins de contrat (10) ; `monde_titre_2002` arme la nostalgie du sélectionneur (14) ; `monde_dimanche_soir` ouvre `pr.droits_tele` (13) |
| 2000-2009 | `monde_licence_agents`, `monde_ecus` ✱, `aubert_ministre` ✱, `monde_mediacrash`, `monde_buvette_anciens`, `monde_defaut_droits`, `monde_flux` ✱, `monde_algorithme`, `monde_feminines`, `monde_fair_play` | `monde_ecus` bascule `{monnaie}` ; `monde_flux` ouvre le tweet de 3 h (13), le mème (10), le compte anonyme (01) ; `monde_algorithme` arme `ds.algorithme` (12) |
| 2010-2019 | `monde_club_frere`, `monde_capitale_rachetee`, `monde_agents_riches`, `monde_meme`, `monde_gazette_en_ligne`, `monde_video`, `monde_legruet_parti`, `monde_quarante_huit`, `monde_lea_redac`, `monde_ligue_fermee` ✱ | `monde_video` arme `in.dossier.video` (15) et le temps fort « la panne de la vidéo » ; `monde_ligue_fermee` arme la chaîne 60 heures (13) |
| 2020-2029 | `monde_compte_anonyme`, `monde_mondial_hiver`, `monde_josiane_retraite`, `monde_kick`, `monde_memoires`, `monde_greve` ✱, `monde_mondial_amateurs`, `monde_arbitre_machine`, `monde_milliard`, `monde_limite_age`, `monde_legruet_mort` | `monde_greve` arme `co_greve_mondiale` (30) et `in.dossier.greve` (15) ; `monde_josiane_retraite` fait passer la voix à la petite Josiane |
| 2030-2039 | `monde_vecchio_mort`, `monde_socios`, `monde_notation`, `monde_stade_partage`, `monde_modele` | `monde_socios` arme `pr.vente_du_club` issue `club_socios` et `co.retrouvailles.gege_socio` |
| 2040-2050 | `monde_franchises` ✱, `monde_national_vivant`, `monde_voix_generee`, `monde_soixante_quatre`, `monde_mondial_64`, `monde_buvette_refaite`, `monde_district_plein`, `monde_fin` | `monde_franchises` ferme les montées et arme `pr_franchise` (30) |

Deux réserves. (a) `monde_grève` est écrit **avec accent** dans la charte § 5.2 : c'est une faute de frappe (les ids sont ASCII, charte § 4.10) ; tous les chapitres écrivent `monde_greve`, qui fait foi. (b) `monde_buvette_refaite` (2048) n'est lu nulle part : c'est la seule trace de monde orpheline ; le chapitre 31 la lit dans l'anecdote de la plaque avec sa faute — à l'écrire noir sur blanc.

### 1.4 Les familles de traces, par chapitre

| Chapitre | Traces posées | Dont lues ailleurs | Orphelines | Taux |
|---|---|---|---|---|
| 01 personnages terrain | ≈ 300 | 275 | 25 | 92 % |
| 02 personnages direction | ≈ 190 | 152 | 38 | 80 % |
| 10 joueur | ≈ 400 | 389 | 11 | 97 % |
| 11 entraîneur | ≈ 220 | 218 | 2 | 99 % |
| 12 directeur sportif | ≈ 180 | 165 | 15 | 92 % |
| 13 président | ≈ 300 | 219 | 81 | 73 % |
| 14 sélectionneur | ≈ 130 | 130 | 0 | 100 % |
| 15 instance | ≈ 190 | 133 | 57 | 70 % |
| 20 journaux | 49 + 13 variables | 48 | 1 | 98 % |
| 30 set-pieces | 41 | 41 | 0 | 100 % |
| 31 anecdotes | 8 | 8 | 0 | 100 % |
| **Total** | **1 782** | **1 552** | **230** | **87 %** |

Les chapitres 11, 14, 30 et 31 sont exemplaires : ils ne posent rien qu'ils ne fassent lire. Les chapitres 13 et 15 sont les deux chantiers de couture (81 et 57 orphelines) : c'est logique, ce sont les deux chapitres où chaque scène a deux issues nommées et où la seconde issue n'a pas trouvé son lecteur.

### 1.5 Les 230 traces posées et jamais lues

Trois traitements possibles, dans cet ordre de préférence :

- **(A) Lui donner un lecteur** — c'est presque toujours possible et c'est ce que la trace demande. Une manchette suffit ; une variante de réaction suffit ; un `epitaph_plus` suffit.
- **(B) La dégrader en ligne d'Almanach** — on retire la trace du `set:` et on garde le `journal:` avec un poids 1. Le joueur voit la conséquence dans son journal, le moteur n'a rien à retenir. C'est le bon traitement des issues purement cosmétiques (`voeu_gros` / `voeu_petit`, `tournee_village`, `cars_gamins`).
- **(C) La fusionner avec sa jumelle** — quand une scène pose `x` et `x_refuse` et que seul `x` est lu, `x_refuse` devient l'absence de `x`. C'est le bon traitement de `naming_refuse`, `camera_refusee`, `eclairage_refuse`, `derby_refuse`, `ex_pro_refuse`, `terrain_refuse_rugby`, `pret_refuse`, `avance_refusee`, `dimanche_soir_refuse`, `stade_non_promis`, `note_ignoree`.

**Chapitre 13 (81 orphelines).** `ascension_confirmee`, `avance_refusee`, `aveu_une_saison`, `bache_brulee`, `bache_laissee`, `benevoles_partis`, `benevoles_payes`, `buvette_sans_match`, `camera_refusee`, `cameras_refusees`, `cars_gamins`, `centre_ferme_police`, `club_sauve`, `coach_en_sursis`, `congres_refuse`, `couleurs_menacees`, `declaration_veille`, `dede_condition`, `derby_heure`, `derby_midi`, `derby_refuse`, `deux_entrainements`, `deux_vestiaires`, `dimanche_soir_refuse`, `dimanche_soir_refuse_pr`, `discours_ballon`, `droits_refuses_kick`, `eclairage_refuse`, `ecole_separee`, `emprunt_juin`, `enveloppes_village`, `ex_pro_refuse`, `faute_corrigee`, `fc_united_radie`, `fc_united_sans_subvention`, `fete_promise`, `fils_clow_confirme`, `fils_clow_parti`, `fusion_discutee`, `fusion_reportee`, `h0_debout`, `h1_descendu`, `h3_efface`, `h4_fonds_non`, `h5_ami`, `h5_table`, `h6_loi_contre`, `indemnite_negociee`, `kop_compte`, `loyer_paye`, `maillot_boucherie`, `mbako_apres`, `mediacrash_vente`, `mere_seule`, `naming_refuse`, `pelouse_payee`, `plaque_reduite`, `president_assume`, `pret_refuse`, `recette_reglement`, `recrues_bistrot`, `rien_confirme`, `sacha_mardi`, `sacha_stage_refuse`, `stade_nom_maire`, `stade_non_promis`, `successeur_cherche`, `terrain_refuse_rugby`, `titre_promis_conseil`, `tombola_dupuis`, `tombola_truquee`, `tournee_gagnant`, `tournee_village`, `trait_efface`, `tribune_est_fermee`, `trop_plein`, `venu_du_district`, `visage_seul`, `voeu_gros`, `voeu_petit`, `voie_ligue_fermee`.
*Traitement proposé* : (C) pour les onze « refus » ; (B) pour `voeu_gros`, `voeu_petit`, `cars_gamins`, `tournee_village`, `tournee_gagnant`, `recrues_bistrot`, `deux_entrainements`, `discours_ballon`, `maillot_boucherie`, `benevoles_payes`, `benevoles_partis` ; (A) pour les vingt-deux qui portent du sens et n'ont jamais trouvé leur lecteur — **la chaîne des 60 heures en particulier** (`h0_debout`, `h1_descendu`, `h3_efface`, `h4_fonds_non`, `h5_ami`, `h5_table`, `h6_loi_contre` : les sept branches « non » de la chaîne, dont aucune n'est relue alors que les sept branches « oui » le sont). C'est le trou le plus visible du chapitre 13 : refuser la Ligue fermée doit se payer aussi longtemps que la signer. **Correctif** : les sept `h*` négatives sont lues par une carte de mépris inversée, `pr.ligue_fermee.h7_les_autres` (le stade est plein, le téléphone ne sonne plus), et par `co.retrouvailles.montoya_noir` (« Vous étiez debout. Vous l'êtes resté »).

**Chapitre 15 (57 orphelines).** `agents_libres`, `agents_plafond`, `base_avec_toi`, `blessures_examinees`, `blessures_publiees`, `bravo_seul`, `chaise_sans_voix`, `charme_assume`, `charters_nassir`, `classeur_bureau`, `colline_redescendu`, `commissaire_garde`, `comptes_publies`, `derogation_age`, `dette_meneche`, `discours_du_siecle`, `dossier_desert_lu`, `dossier_ostrelie_lu`, `droits_amenages`, `ethique_classee`, `fair_play_tenu`, `finale_dimanche`, `greve_annoncee`, `greve_menacee`, `homme_aulard`, `joueurs_exclus`, `legruet_ecarte`, `liste_niee`, `match_en_blanc`, `mediacrash_saisi`, `motif_note`, `motif_vide`, `nom_retire`, `photo_bambini`, `pret_ostrelie`, `promesse_sans_date`, `promesses_datees`, `puymarin_domicile`, `pv_arrange`, `quatrieme_cle_cherchee`, `rire_direct`, `sacha_au_congres`, `selectionneur_diplome`, `selectionneur_du_ministre`, `siege_formation`, `sortie_direct`, `sponsor_ballon`, `sponsor_banque`, `sponsor_cherche`, `sponsor_douteux`, `sponsor_nassir`, `subvention_reprise`, `temoin_muet`, `trophee_emissaire`, `trophee_trebignac`, `video_limitee`, `vote_rendu`.
*Traitement — **appliqué** au chapitre 15 § 5.1 bis* : le chapitre souffrait d'un défaut de structure — les dix-sept Cartes Événement double face posaient chacune deux traces et **aucune n'était relue**, parce qu'un dossier était traité comme un épisode clos. Le correctif d'ensemble est écrit : **dix-sept cartes `in.dossier.<mot>_apres`**, un bouton, trois lignes, servies au créneau [14] de l'année n+1 par un `schedule:` posé sur la face votée ; chacune lit la face choisie et raconte ce qu'elle a produit. **Trente-quatre traces fermées**, plus la trace orpheline `derogation_age`, désormais posée par `in.dossier.limite_age_apres` et lue par la table des mandats du ch. 02 et par la fiche Josiane. Aucune de ces dix-sept cartes ne pose autre chose : une carte « après » raconte, elle ne relance pas.
Deux cas particuliers : `sacha_au_congres` doit être lue par le chapitre 01 (fiche Sacha, palier) et par `co.retrouvailles.sacha_succession` ; `temoin_muet` doit être lue par la fin `in_integre_chomage` en négatif (« vous n'étiez pas là ; elle l'a noté »).

**Chapitre 02 (38 orphelines).** `capitaine_vendu`, `capitaine_vestiaire`, `chaise_fils`, `chapitre_brut`, `chiffres_agent`, `club_dabord`, `coach_parti`, `compo_donnee`, `confirme_reste`, `conge_pose`, `dit_hors_micro`, `documents_donnes`, `fiche_archives`, `fiche_tiroir`, `fils_banc`, `fils_case`, `fils_debout`, `fils_joue`, `fusion_votee`, `lettre_envoyee`, `liste_acceptee`, `lu_avant_de_signer`, `mardi_bosse`, `mere_decide`, `mot_a_la_mere`, `nom_sur_la_porte`, `page_barree`, `paie_attendue`, `paie_dite`, `prodige_a_fardelli`, `prodige_donne`, `projet_signe`, `promis_en_direct`, `replay_refuse`, `replay_regarde`, `rien_hors_micro`, `signe_sans_lire`, `stage_lundi`.
*Traitement proposé* : ce sont pour l'essentiel les **secondes issues des vingt-trois intrigues propres du chapitre 02**, qui n'ont que quatre scènes chacune et pas de manchette. Le chapitre 02 demande ≈ 150 manchettes au chapitre 20 ; le chapitre 20 en a écrit 106 dont aucune sur ces traces (§ 9, contradiction C-05). **Correctif** : les trente-huit reçoivent une manchette `une.<personnage>.<mot>` écrite par 20 en seconde passe, ou sont dégradées en (B). Six d'entre elles portent trop de sens pour être dégradées et doivent être lues par un autre chapitre : `prodige_a_fardelli` (→ ch. 11 `en.prodige`, ch. 12 `ds.vente_du_prodige`), `signe_sans_lire` et `lu_avant_de_signer` (→ ch. 10 `jp.clause`), `coach_parti` (→ ch. 13 `pr.coach_vire`), `fusion_votee` (→ ch. 13 `pr.fusion`), `documents_donnes` (→ ch. 15 `in.dix_huit_millions`).

**Chapitre 01 (25 orphelines).** `bas_de_laine_refuse`, `brissac_mirevaux`, `buvette_loi`, `cahier_sept_heures`, `cassette_jetee`, `dede_benevole`, `dede_ecarte`, `dembo_banc`, `fauvel_transmet`, `fils_clow_refus`, `gardienne_banc`, `gerard_refuse`, `groupe_lit_avant`, `lettre_refusee`, `mbako_celebre`, `mbako_conseil_mere`, `merguez_dupuis`, `mirevaux_cameras`, `onze_casquettes`, `rouvier_fleurs`, `sacha_promesse_rompue`, `sacha_promesse_tribune`, `stage_commando_refuse`, `tribune_gardee`, `trop_lent_autre`.
*Traitement proposé* : trois sont graves et doivent être lues, parce qu'elles portent une promesse au joueur — `sacha_promesse_rompue` (la promesse cassée doit revenir : § 3.7, carte de lignée `co.lignee.sacha_te_nomme`), `sacha_promesse_tribune` (idem), `fils_clow_refus` (le fils de Corven refuse ta lignée : c'est le sens même de `clow_ingrat`, il faut que la carte de Succession le dise). Les autres reçoivent (B) ou (C). `cahier_sept_heures` est déjà annoncée sans Almanach par le chapitre 01 : la laisser en (B) telle quelle.

**Chapitre 12 (15 orphelines).** `beau_frere_annonce`, `commission_remboursee`, `fils_aulard_feuille`, `interim_solo`, `klopf_sourit`, `ligne_president`, `neuf_prete`, `noms_donnes`, `note_ignoree`, `pv_garde`, `recrue_fardelli`, `recrue_mere`, `recrue_modele`, `recrue_solvang`, `recrue_gardee_president`.
*Traitement* : les quatre `recrue_*` du SMS de nomination sont une **famille de valeurs**, pas quatre traces : à transformer en une trace unique `recrue_par` de valeurs `fardelli | solvang | mere | modele`, lue par `ds.mercato` la fenêtre suivante et par `co.retrouvailles.fardelli_carnet_repris`. Les autres : (B) ou (A) par une manchette `une.vendre.*` / `une.intouchable.*`.

**Chapitre 10 (11 orphelines).** `brehaut_vendu_par_toi`, `consultant_cache`, `enfant_du_pays_hiver`, `finit_saison`, `genou_grave_arme`, `penalty_rate`, `photo_prix`, `place_au_jeune`, `tete_haute`, `veille_fonce`, `veille_menage`.
*Traitement* : `brehaut_vendu_par_toi` est la plus intéressante et doit être lue — c'est la trace qui permet à Bréhaut, devenu DS puis président de la Ligue, de te recevoir en te disant qu'il sait (`co.retrouvailles.brehaut_noir`, `co.retrouvailles.brehaut_president`, ch. 13 `pr.coach_vire`). Les dix autres : (B).

**Chapitre 11 (2 orphelines).** `finale_attaque` (existe dans `flags.yaml` mais aucun lecteur : à lire par la manchette `une.promu.finale`), `rentree_diplome` (fusionner avec `diplome_en_cours`, ch. 10).

### 1.6 Les traces lues et jamais posées

Soixante-deux tokens sont lus par un `flag()` ou un `requires:` sans qu'aucun chapitre ne les pose. Quatre familles :

**(a) Faux orphelins : posés par `content/flags.yaml` et les cartes existantes (22).** `interim`, `boulot`, `descente`, `caid`, `legende`, `ascension`, `montee`, `titre`, `academie`, `galactique`, `bilan_tenu`, `bilan_manque`, `camille_avocate`, `camille_medecin`, `camille_agente`, `finale_gigi`, `voiture_couverte`, `flacon_velo`, `corner_force`, `rumeur_mercato`, `exil_propose`, `monde_libre_1993`. **Rien à faire**, sinon les déclarer dans la matrice pour que le lint ne les signale pas.

**(b) Postulats lus comme des drapeaux (11).** `apres_fiasco`, `pays_emergent`, `heritage_empoisonne`, `sous_tutelle`, `banc_dore`, `binational`, `section_feminine`, `bout_du_monde`, `geant_dechu`, `fusion_proposee`, `village_fusion`. Les chapitres 10, 11, 14, 15 et 30 écrivent `flag('apres_fiasco')` là où il faudrait lire le postulat de la partie. **Correctif** : le chantier données pose systématiquement un drapeau au nom du postulat au démarrage (c'est déjà le cas de `promu` dans `flags.yaml`), **ou** la notation devient `postulat == 'apres_fiasco'`. Trancher une fois pour les vingt-cinq postulats ; ne pas laisser les deux notations cohabiter.

**(c) Traces d'un chapitre attendues d'un autre, jamais écrites (18).** `amical_cobalts`, `dragan_ami`, `sylvanie_adopte`, `mirevaux_pro`, `plateau_refuse`, `deux_saisons_mirevaux`, `deux_saisons_sylvanie`, `reportage_bdm`, `legruet_tombe`, `charters_coupes`, `coupe_tirage_grand`, `coupe_gros_tirage`, `poucet_gagne`, `poucet_perdu`, `reelu`, `reforme_lue`, `dossier_sur_toi`, `trente_tenus_avance`. Ce sont des traces annoncées **en fiche courte** (chapitre 11 § 5-6, chapitre 13, chapitre 15) et jamais posées par une scène au gabarit. **Correctif** : chaque fiche courte devient une scène à deux boutons, ou la trace disparaît. Cas particuliers : `coupe_gros_tirage` / `coupe_tirage_grand` sont **la même chose sous deux noms** (le tirage qui amène un gros au stade municipal) — garder `coupe_gros_tirage`, posé par le moteur au tirage de la Coupe, lu par 13 et 30 ; `poucet_gagne` / `poucet_perdu` doivent être posés par le beat `cup`, pas par une carte ; `reelu` par la Carte Destin `in.destin.reelection`.

**(d) Compteurs et chemins de monde, pas des traces (11).** `president_destitue`, `president_vend`, `causerie_deleguee`, `arbitre_machine`, `fusion_menace`, `village_uni`, `boulot_menace`, `bilan.tenu`, `stats.ennemis`, `stats.saisons_club`, `world.serie_defaites`. À déclarer au moteur comme variables (§ 1.7 n° 6), pas comme drapeaux.

### 1.7 Les six vérifications de build que ce chapitre impose

1. **Aucune trace posée sans lecteur.** Le lint échoue si un `set: x` n'a aucun `flag('x')`, `journal_has('x')`, `requires: [x]` ou condition de manchette ailleurs dans le contenu compilé. Exemptions déclarées : les traces marquées `journal_only: true`.
2. **Aucune trace lue sans poseur.** Le lint échoue si un `flag('x')` n'a aucun `set: x` ; les postulats et les compteurs sont exemptés par une liste nommée.
3. **Une trace au moins par intrigue traverse le rôle.** Le lint avertit si toutes les traces d'un arc ne sont lues que par des cartes du même `roles:`.
4. **Un id, un contenu.** Le lint échoue sur deux définitions du même id (aujourd'hui : sept collisions, § 9 C-01).
5. **Une manchette citée existe.** Le lint échoue si un « Lu plus tard par » nomme une `une.*` absente de `unes.yaml` (aujourd'hui : 394, § 9 C-05).
6. **Les chemins du langage `when` sont déclarés.** Liste à valider par l'équipe technique : `world.palier`, `world.mandat_annee`, `world.capitaine`, `world.star`, `world.tournoi`, `world.pays`, `world.coach`, `world.adversaire`, `world.next_is_derby`, `world.serie_victoires`, `world.serie_defaites`, `world.coupe_tour`, `world.tournoi_cette_annee`, `vars.ventes`, `vars.valises`, `vars.tiroirs`, `vars.divisions_montees`, `vars.expatries_convaincus`, `vars.primes_cachees`, `vars.tournois_joues`, `vars.saisons_pays_60`, `vars.nassir_palier`, `stats.ennemis`, `stats.saisons_club`, `stats.clubs`, `stats.saisons`, `player.age`, `parole`, `fin.famille`, `ancien_club.montee`, `ancien_role`, `club_change`, `role_was()`, `journal_has()`, `plays()`, `seen`. Plus les effets `world:`, `role:`, `var:`, `rand:`, `elimination:`, `end:`, `schedule:`, `chain:`.

---

## 2. La carte des réactions

### 2.1 Ce qu'est une réaction, et ce qu'elle n'est pas

Une réaction est une carte à **un bouton**, servie au tirage **suivant**, hors créneau, par le personnage qui a vu ce que tu viens de faire. Elle n'a pas de choix, elle a une conséquence déjà tombée : c'est la voix du monde qui commente, pas une nouvelle décision. Elle est le mécanisme le moins cher et le plus rentable du jeu — deux phrases, un visage, et le joueur comprend qu'il est regardé.

**Les règles.** Jamais après une carte de fin. Jamais après un drame mortel. Jamais deux réactions d'affilée. Plafond de **quatre par saison** (chapitre 13) et **trois par bloc**. Le nom du joueur n'y figure pas si la carte précédente le portait (charte § 6.1). Une réaction se rattache à **une sortie précise** d'une carte précise (`après : <id> (←)`), pas à une carte entière — c'est ce qui la rend juste.

**Les cinq familles.**

| Famille | Ce qu'elle fait | Qui la porte le mieux | Exemple |
|---|---|---|---|
| **conséquence immédiate** | le fait matériel de ton choix, dans l'heure | Josiane, Gérard, Rouvier | `pr.re.gerard_carton` — le carton de maillots reste ouvert tout l'hiver |
| **témoin** | quelqu'un a vu, et te le dit sans te juger | Vukić, Vecchio, Colline | `co.re.vecchio_zoki` — Gigi savait, pour le ballon lâché |
| **rumeur** | ce que le monde raconte déjà de toi | Massenet, Léa, le Rosé | `co.re.lea_confirme` — « Vous confirmez ? » vingt-quatre heures plus tard |
| **prix à payer** | la facture, une jauge plus tard | Fardelli, Vialat, Vaubourg | `ds.re.aulard_23h47` — le SMS avec la faute |
| **tendresse** | quelqu'un t'aime encore, et c'est pire | Camille, Paulette, Sacha, Dédé | `am.re.camille_quatre_heures` — « Tu rentres à quelle heure ? » |

### 2.2 L'index des 166 réactions écrites

| Chapitre | Nombre | Préfixes | Portées par |
|---|---|---|---|
| 01 personnages terrain | 14 | `co.re.*`, `en.re.josiane_cahier` | Camille, Dédé, Gégé, Josiane, Vogler, la mère de Mbako (×2), Rouvier, Sacha (×2), Vecchio (×2), Vukić |
| 02 personnages direction | 13 | `co.re.*` | Amsel, Colline, Dauzat, Dupuis, Josiane, Léa, Malbec, Pichon, Rossard, Roux, Solvang, Vence, Vialat |
| 10 joueur | 47 | `am.re.*` (17), `jp.re.*` (30) | Dédé (4), Camille (5), Sabatier (5), Fardelli (3), Léa (4), Gérard, Pichon (2), Vecchio (2), Vukić (2), Bréhaut (2), Vaubourg (2), Gégé, Momo, Roux, la belle-mère, Massenet, Ilyas, Rouvier, Vence, Corven, Josiane, ta mère |
| 11 entraîneur | 28 | `en.re.*` | Vaubourg (3), Josiane (4), Bréhaut (3), Vukić (2), Massenet (2), Gégé (2), Camille (2), le fils de Corven, le fils de Vaubourg, Fardelli, Inès, Berthomier, Mbako, la mère de Mbako, Milena, Rouvier, Vecchio |
| 12 directeur sportif | 10 | `ds.re.*` | Vaubourg, Barbier, Dembo (2), le fils de Vaubourg, Vogler, Vaz, Mbako, Massenet, Vence |
| 13 président | 12 | `pr.re.*` | Bréhaut (2), Dédé, Gégé, Gérard (2), Josiane (2), Léa, Massenet (2), Vence |
| 14 sélectionneur | 14 | `sl.re.*` | Camille, Dauzat, Dembo, Fardelli (2), Fauvel, Ferrol, Gégé, Josiane (2), Milena, le ministre (2), Vence |
| 15 instance | 18 | `in.re.*` | Dauzat (3), Josiane (3), Bambini, Fauvel, la Gazette, Léa, Berthomier, Malbec, Massenet, le ministre, Ilyas, l'Ostrélie, Roux, Vialat |
| 20 journaux | 10 | `co.re.camille_parking_*` | Camille lit « Vu au parking » : dix entrefilets, dix réactions, la même voix |
| **Total** | **166** | | |

Plus les réactions existantes de `content/cards/common/reactions.yaml` (`co.re.josiane_a_lu`, `co.re.gege_decoupe`, `co.re.camille_journal`, `co.re.vecchio_garde`, `en.re.josiane_numero`, `en.re.fardelli_numero`…), citées et non réécrites.

### 2.3 La carte choix → réaction (les vingt nœuds qui comptent)

Les réactions les plus rentables sont celles qu'un joueur rencontre **dans plusieurs rôles**. En voici les vingt, avec le choix qui les déclenche et ce qu'elles font sentir.

| Le choix | La réaction | Qui parle | Ce que ça dit |
|---|---|---|---|
| Vendre Mbako (11 · `en.prodige`, issue *vendu*) | `ds.re.mbako_maintenant` (12), `en.re.mere_retour` (11), `co.re.mere_mbako_souffle` (01) | Mbako, sa mère | tu as vendu un gamin ; deux personnes s'en souviennent, dont une pour toujours |
| Accepter le pacte de la craie (11 · `en.kop.pacte`) | `en.re.gege_lui_venait` (11), `pr.re.gege_tambours` (13) | Gégé | la tribune a une dette envers toi, ce qui est pire qu'une créance |
| Signer le naming (11 · `en.nassir`, 13 · `pr.naming`) | `en.re.gege_jumelles`, `co.re.dupuis_pese` (02) | Gégé, Dupuis | le boucher trouve ça grand, le virage trouve ça vendu |
| Refuser l'enveloppe (11 · `en.enveloppe`) | `co.re.colline_vu` (02), `in.re.malbec_entre_presidents` (15) | Colline, Malbec | l'arbitre te regarde autrement ; un président te trouve difficile |
| Le flacon B (10-11 · `co.pharmacie`) | `jp.re.sabatier_certificat`, `en.re.rouvier_armoire`, `co.re.rouvier_thermos` (01) | Sabatier, Rouvier | le Doc couvre, la kiné voit ; elle ne dit rien, mais elle range autrement |
| Avancer les salaires de sa poche (11) | `en.re.aulard_avance`, `en.re.vecchio_distributeur` | Vaubourg, Vecchio | le président l'apprend par la banque ; le vestiaire l'apprend au distributeur |
| Dire à Vukić que c'était lui (01 · `co.vukic.ballon_lache`) | `co.re.vecchio_zoki` (01) | Vecchio | deux gardiens, une phrase de 1979, aucun commentaire |
| Le SMS de 23 h 47 (13 · `pr.coach_vire`) | `ds.re.aulard_23h47` (12), `pr.re.meneche_23h46` (13) | Vaubourg, Massenet | Massenet l'avait une minute avant toi |
| Le fax de 23 h 58 (12 · `ds.fax`) | `co.re.josiane_a_vu_le_fax` (02), `ds.re.meneche_vitre` | Josiane, Massenet | Josiane a corrigé la faute au mot « transfert », sauf sur ses copies |
| La visite médicale arrondie (12 · `ds.joueur_ami`) | `jp.re.sabatier_deux_chronos` (10), `co.re.rouvier_thermos` | Sabatier, Rouvier | ce qui reste sur la table du Doc ne reste pas sur la table du Doc |
| Le tweet de 3 h (13 · `pr.le_fils`) | `pr.re.vence_silence`, `co.re.lea_confirme` (02) | Vence, Léa | l'antenne le lit à voix haute ; ta fille l'a lu avant |
| Descendre au vestiaire (13 · `pr.derby_en_loge`) | `pr.re.brehaut_respire`, `en.re.vukic_journal_president` | Bréhaut, Vukić | le coach n'a rien dit ; le score, si |
| Rayer six noms sur la liste du ministre (14) | `sl.re.milena_fax`, `sl.re.ministre_neveu` | Milena, le ministre | le cinquième était son neveu |
| Descendre du bus (14 · `sl.le_bus`) | `sl.re.fauvel_pour_deux`, `sl.re.josiane_siege_douze` | Fauvel, Josiane | on est un groupe, pas une liste ; le siège douze est resté vide |
| Nommer ceux du couloir (15 · `in.les_valises`) | `in.re.dauzat_courriel`, `co.re.amsel_note` (02) | Dauzat, Amsel | c'est dans le procès-verbal ; elle note l'heure |
| Voter le tournoi du désert (15 · `in.dossier.attribution`) | `in.re.bambini_deja_deux`, `in.re.nassir_charters` | Bambini, Ilyas | le football unit le monde, et ses amis |
| Le penalty pris à Dembo (10 · `jp.dembo_rival`) | `jp.re.brehaut_plus_de_passe`, `ds.re.dembo_ballon` (12) | Bréhaut, Dembo | plus de passe pendant trois matchs, et il ne dit rien |
| La promesse tenue à Sacha (01 · `co.sacha_promis`) | `co.re.sacha_hymne`, `co.re.sacha_seau` | Sacha | elle chante, ou elle ne chante pas ; c'est tout ce que tu sauras |
| La valise (13 · `pr.valise`) | `en.re.meneche_valise`, `co.re.amsel_note` | Massenet, Amsel | il ne l'écrit pas ; elle le note |
| Rentrer tôt (10 · `am.troisieme_mitemps`, 11 · `co.cartons_camille`) | `am.re.camille_quatre_heures`, `en.re.camille_derby` | Camille | la seule réaction du jeu qui te récompense de ne pas jouer |

### 2.4 Les vingt-cinq réactions citées et jamais écrites — **écrites ici**

Le compte annoncé (vingt et une) était faux : après vérification ligne à ligne (ni `### RÉACTION`, ni ligne de tableau, ni définition inline, ni `content/cards/common/reactions.yaml`), **vingt-cinq** réactions étaient citées et n'existaient nulle part. Détail savoureux : `en.re.josiane_chauffage` est l'exemple d'id donné par la charte § 4.10.

Elles sont **écrites au § 2.4 bis**, au gabarit § 4.4, et chacune est à recopier telle quelle dans le chapitre d'accueil indiqué. Le tableau ci-dessous garde les autres cas — ceux qui se règlent par un renommage ou une suppression de citation.

| Réaction | Citée par | À écrire par | Contenu proposé |
|---|---|---|---|
| `co.re.barbier_doudoune` | 01 (`jp.vecchio.trebignac`), 10 (`am.academie.revanche`) — 7 citations | **02** (fiche Barbier) | « Je l'ai vu jouer sous la pluie. À cinquante ans. » |
| `co.re.meneche_no_comment` | 10 (3 scènes), 20 (manchette générique) — 10 citations | **02** (fiche Massenet) | « Juste une question, hors micro : vous voulez que je n'écrive rien ? Je ne sais pas faire. » |
| `co.re.nassir_reviendrai` | 10 (`jp.exil_dore`) — 6 citations | **02** (fiche Ilyas) | « Ce n'est pas un club, c'est un actif ; les actifs, on les revend, puis on les rachète. » |
| `en.re.ministre_avion` | 11 (`bout_du_monde`) — 3 citations | **11** | le ministre : l'avion du retour est vendredi, il est confortable |
| `co.re.gege_craie`, `co.re.rouvier_couloir` | 31 | **31** | la craie qu'on n'efface pas ; le couloir où elle attend |
| `co.re.josiane_a_vu` | 30 | **30** — ou renommer en `co.re.josiane_a_vu_le_fax` ∃ (02) | doublon probable : trancher |
| `co.re.camille_parking_` | 20 (troncature) | **20** | erreur de citation : lire `co.re.camille_parking_note` |
| `en.re.brehaut_costume`, `en.re.lea_confirmez`, `en.re.nassir_courbe`, `en.re.rouvier_orange` | 11 | **11** | quatre réactions de fiche courte, à écrire au gabarit § 4.4 |
| `pr.re.dede_entendu`, `pr.re.dede_ex_pro`, `pr.re.dede_gamin`, `pr.re.gerard_rose`, `pr.re.lea_a_vu`, `pr.re.lea_pas_confirme`, `pr.re.meneche_dessert`, `pr.re.roux_lignes`, `pr.re.vecchio_gants` | 13 (§ 8 annonce douze réactions, en écrit douze, en cite vingt et une) | **13** | les neuf « réactions courtes » du chapitre 13 sont annoncées et non rédigées |
| `en.rouvier.commando_blesses` | 01 (chaîne du stage commando) | **11** | trois ischios en septembre, une sortie |
| `en.re.gege_jumelles` | 01 (×2) | **11** | « J'ai les jumelles, et j'ai vu qui était dans la haie. » |

### 2.4 bis Les vingt-cinq réactions, écrites

Gabarit § 4.4. Servies au tirage suivant, hors créneau ; jamais `end`, jamais de drame, jamais en chaîne ; plafond de quatre par saison. **Le nom du joueur n'y figure pas** (la scène précédente l'a porté). Chacune est marquée du chapitre qui doit l'accueillir.

**Les seize de l'entraîneur et du partagé** *(à recopier au ch. 11, sauf mention)*

### RÉACTION en.re.josiane_chauffage  —  Le radiateur a toussé
**Après** : toute scène qui pose `chauffage_impaye` ou `salaires_retard` (les deux) · **Famille** : tiers qui commente · **Conditions** : `flag('promu')` ou `gauges.caisse < 35`
**JOSIANE** *(secrétaire — neutre — elle a mis un pull, elle ne le dit pas)* « Le radiateur du couloir a toussé deux fois ce matin, puis plus rien, et la facture est en dessous du sous-main. J'en ai vu passer, des hivers : je la remonte, ou je la laisse ? »
**OK** **Remontez-la** — effets : caisse −, direction + — *Elle la remonte. Elle est en haut de la pile jusqu'en février.*

### RÉACTION en.re.josiane_cheque  —  Le chèque non daté
**Après** : `en.aulard.cheque` (←) · **Famille** : conséquence immédiate · **Conditions** : `flag('cheque_non_date')`
**JOSIANE** *(secrétaire — neutre — elle tient le chèque par un coin, comme un timbre)* « Il n'y a pas de date dessus, et une banque sans date fait ce qu'elle veut du mois. J'en ai vu passer : je le photocopie avant, ou je fais comme si je n'avais rien vu ? »
← **Photocopiez** — effets : parole +1, direction − — *Elle photocopie. La copie va dans le tiroir du bas, avec les autres.* → **Comme si de rien** — effets : direction + — *Elle range. Elle n'oublie rien, elle range.*

### RÉACTION en.re.josiane_numero  —  Le numéro qu'elle a gardé
**Après** : toute scène où un personnage à statut passe en `parti` ou `retraite` · **Famille** : tiers qui commente · **Conditions** : une fois par personnage
**JOSIANE** *(secrétaire — sourire — un répertoire à spirale, corné)* « J'ai gardé le numéro, il n'a pas changé de numéro, les gens changent de club et pas de numéro. J'en ai vu passer : je vous le donne, ou vous préférez ne pas appeler ? »
← **Donnez-le-moi** — effets : relation.josiane +1 — *Elle l'écrit sur un post-it. Elle a la même écriture depuis 1987.* → **Je n'appellerai pas** — effets : direction + — *Elle range le répertoire. Elle le rouvrira à la page suivante, un jour.*

### RÉACTION en.re.josiane_page_rouge  —  La page rouge
**Après** : toute scène qui pose une trace judiciaire (`fede_dossier`, `commission_lettre`, `perquisition`) · **Famille** : relance · **Conditions** : `season >= 1`
**JOSIANE** *(secrétaire — neutre — un classeur avec un intercalaire rouge, le seul)* « Il y a une page rouge dans le classeur, et depuis ce matin il y a votre nom dessus, en haut. J'en ai vu passer, des pages rouges : je la classe où ? »
**OK** **Classez-la normalement** — effets : direction −, parole +1 — *Elle la classe à sa date. C'est la pire des places : on la retrouve.*

### RÉACTION en.re.brehaut_on_attaque  —  On attaque, alors
**Après** : toute scène où tu choisis une posture offensive avant un Grand Match (→) · **Famille** : conséquence immédiate · **Conditions** : `chars.brehaut.statut == 'club'`
**BRÉHAUT** *(capitaine — sourire — il remonte ses chaussettes, ce qu'il ne fait que là)* « On attaque, alors, et je le dis au groupe avant que vous le disiez, comme ça c'est déjà décidé. Le groupe vit bien quand il sait à quelle heure il court. »
**OK** **Dis-leur** — effets : vestiaire +, force +1 — *Il le dit dans le couloir, à voix basse. Ils l'entendent tous.*

### RÉACTION en.re.brehaut_onze  —  Le onze du samedi
**Après** : `en.kop.onze` (les deux) · **Famille** : tiers qui commente · **Conditions** : `flag('onze_du_virage')`
**BRÉHAUT** *(capitaine — noir — la feuille de match dans la main, pliée en deux)* « Le virage a fait le onze, et le vestiaire l'a su avant moi, par un cousin de Gégé. Le groupe vit bien, coach ; il vit mieux quand c'est vous qui écrivez. »
**OK** **La prochaine, c'est moi** — effets : vestiaire +, tribunes − — *Il déplie la feuille et la relit. Il ne dit rien du deuxième nom.*

### RÉACTION en.re.camille_le_verre  —  Le verre sur l'évier
**Après** : toute scène où tu rentres après minuit (→) · **Famille** : tiers qui commente · **Conditions** : `relation.camille <= 0`
**CAMILLE** *(à la maison — neutre — un verre propre, retourné sur l'évier, un seul)* « Il y a un verre retourné sur l'évier depuis trois jours et je ne l'ai pas rangé exprès, pour voir. Tu rentres à quelle heure, ce soir, pour qu'on le range ensemble ? »
← **Ce soir, on le range** — effets : relation.camille +1, direction − — *Vous le rangez. Ça prend quatre secondes et ça tient trois semaines.* → **Range-le, toi** — effets : relation.camille −1, force +1 — *Elle le range. Elle en sort un autre, et le retourne.*

### RÉACTION en.re.fardelli_numero  —  Il a ton numéro
**Après** : toute scène de mercato où tu refuses Fardelli (→) · **Famille** : relance · **Conditions** : `relation.fardelli <= 0`
**FARDELLI** *(agent — sourire — il montre son téléphone sans le déverrouiller)* « J'ai votre numéro depuis quatre-vingt-onze et je ne l'ai jamais donné, ce qui est un service. Mon ami, on parle d'argent ou d'amitié ? »
← **D'amitié, pour ce soir** — effets : relation.fardelli +1, caisse − — *Il ne demande rien. C'est la version chère de l'amitié.* → **Ni l'un ni l'autre** — effets : relation.fardelli −1, parole +1 — *Il range le téléphone. Il ne l'éteint pas.*

### RÉACTION en.re.meneche_embuscade  —  L'embuscade du parking
**Après** : toute conférence de presse où tu refuses de répondre (→) · **Famille** : relance · **Conditions** : `relation.meneche <= -1`
**MASSENET** *(chroniqueur — noir — il est adossé à ta portière, carnet fermé)* « Vous n'avez pas répondu en salle, donc je pose la question ici, où il n'y a que nous deux. Juste une question, hors micro : c'est vous qui l'avez sorti ? »
← **Hors micro, oui** — effets : relation.meneche +1, direction − — *Il note trois mots. Il tient parole ; il ne dit pas quand.* → **Poussez-vous** — effets : relation.meneche −1, tribunes + — *Il se pousse. Il écrit « n'a pas répondu au parking », et c'est pire.*

### RÉACTION en.re.meneche_projet  —  Le mot « projet »
**Après** : toute scène où tu prononces le mot « projet » devant la presse · **Famille** : tiers qui commente · **Conditions** : `season <= 1`
**MASSENET** *(chroniqueur — neutre — il souligne un mot, une fois, sans appuyer)* « Vous avez dit « projet » quatre fois en six minutes, ce qui est le record de la saison, tenu par un limogé. Juste une question, hors micro : c'est un projet, ou c'est un budget ? »
**OK** **C'est un budget** — effets : direction −, parole +1 — *Il écrit « budget ». Le titre du lendemain n'a que ce mot-là.*

### RÉACTION co.re.mere_orange  —  L'orange dans le sac
**Après** : `sl.liste.sept_binational` (les deux), `en.mbako.mere` (les deux) · **Famille** : tiers qui commente · **Conditions** : `chars.mere_mbako.statut != 'parti'` · *(citée `en.re.mere_orange` au ch. 11 : lire `co.re.mere_orange`)*
**LA MÈRE DE MBAKO** *(mère et agente — neutre — elle pose une orange sur le coin du bureau, sans un mot d'abord)* « Il ne mange pas avant les matchs, jamais, sauf une orange, et personne au club ne le sait après huit ans. Mon fils n'a besoin de personne : vous le saviez, vous ? »
← **Je le savais** — effets : relation.mere_mbako +1, vestiaire + — *Elle repart avec l'orange. Elle la pose sur ton bureau chaque saison, après.* → **Non, dites-moi** — effets : relation.mere_mbako −1, force +1 — *Elle laisse l'orange. Elle sèche pendant six semaines ; personne n'ose la jeter.*

### RÉACTION en.re.nassir_reviendrons  —  Nous reviendrons
**Après** : toute scène où tu refuses le fonds (→) · **Famille** : relance · **Conditions** : `relation.nassir <= 0` ; `year >= 1999`
**ILYAS** *(fonds Almadis — neutre — il repose une tasse minuscule, vide, sur la soucoupe)* « Nous reviendrons dans trois ans avec le même dossier et un chiffre plus grand, c'est ainsi que ça marche. Ce n'est pas un club, c'est un actif ; les actifs attendent. »
**OK** **On verra dans trois ans** — effets : direction −, tribunes + — *Il revient dans trois ans, jour pour jour. Il l'avait noté.*

### RÉACTION en.re.rouvier_deux_sifflets  —  Deux coups de sifflet
**Après** : toute scène où tu prolonges un entraînement (→) · **Famille** : conséquence immédiate · **Conditions** : `chars.rouvier.statut in [club, staff]`
**ROUVIER** *(kiné — neutre — elle siffle deux fois, court, et range le sifflet dans sa poche)* « Deux coups : le premier pour vous, le deuxième pour les ischios du six, qui ne vous parleront pas. Respire, coach. Encore : on arrête là, ou on continue et je note ? »
← **On arrête là** — effets : vestiaire +, force −1, relation.rouvier +1 — *Ils rentrent. Le six s'entraînera jeudi, entier.* → **On continue** — effets : force +1, vestiaire −, relation.rouvier −1 — *Elle note. Le carnet du kiné n'a jamais servi à personne, sauf après.*

### RÉACTION en.re.vecchio_bus  —  Il descend le premier
**Après** : toute scène de déplacement, aller ou retour · **Famille** : tiers qui commente · **Conditions** : `chars.vecchio.statut in [club, staff]`
**VECCHIO** *(gardien, puis entraîneur des gardiens — sourire — il a déjà son sac sur l'épaule, debout dans le couloir du car)* « Je descends le premier depuis quatorze ans, ça ne se décide pas, ça se prend. J'en ai vu d'autres, coach : je descends, ou vous voulez faire un discours ? »
**OK** **Descends** — effets : vestiaire + — *Il descend. Les autres suivent dans l'ordre, sans qu'on leur dise.*

### RÉACTION en.re.vukic_second_discours  —  Le second discours
**Après** : toute scène où le président te reçoit avant le dernier bloc · **Famille** : relance · **Conditions** : `chars.vukic.statut in [club, staff]` ; `gauges.direction < 45`
**VUKIĆ** *(adjoint — neutre — il a une feuille pliée dans la poche de poitrine et il n'y touche pas)* « Le président a deux discours prêts pour la semaine prochaine, et tu n'es que dans un des deux. Je te le dis parce que personne ne te le dira ; tu veux savoir lequel ? »
← **Dis-le-moi** — effets : direction −, relation.vukic +1, parole +1 — *Il le dit. Ce n'est pas le bon. Tu as six jours et il le sait.* → **Je ne veux pas savoir** — effets : vestiaire +, relation.vukic −1 — *Il replie la feuille. Il ne la sortira plus.*

### RÉACTION co.re.rouvier_couloir  —  Le couloir où elle attend
**Après** : toute scène de la table du Doc (les deux) · **Famille** : tiers qui commente · **Conditions** : `chars.rouvier.statut in [club, staff]` ; `chars.sabatier.statut in [club, staff]` · *(à recopier au ch. 31)*
**ROUVIER** *(kiné — neutre — elle attend dans le couloir, adossée, elle ne regarde pas la porte)* « J'attends dans le couloir quand la porte est fermée, et la porte est fermée depuis vingt minutes. Respire. Encore : vous voulez que je frappe, ou que je reste là ? »
← **Frappe** — effets : relation.rouvier +1, relation.sabatier −1 — *Elle frappe. La porte s'ouvre tout de suite ; il n'y avait rien à cacher, cette fois.* → **Reste là** — effets : relation.rouvier −1 — *Elle reste. Elle regarde sa montre trois fois, et elle ne dit rien après.*

**Les neuf du président et du président amateur** *(à recopier au ch. 13)*

### RÉACTION pr.re.dede_ex_pro  —  L'ex-pro du village
**Après** : toute scène de recrutement au village (les deux) · **Famille** : tiers qui commente · **Conditions** : `chars.dede.statut in [club, staff]`
**DÉDÉ** *(coach bénévole — neutre — il montre un maillot plié, taille au-dessus)* « Il a joué deux matchs en D2 en quatre-vingt-six et il en parle encore à la buvette, tous les samedis. Bon, on va pas se mentir : il court plus, mais il fait courir les autres ; on le prend ? »
← **On le prend** — effets : vestiaire +, caisse − — *Il joue vingt minutes, une fois. Il parle du reste toute l'année.* → **Pas cette saison** — effets : caisse +, tribunes − — *Il vient quand même le samedi. Il s'assoit à côté du banc, sans y être.*

### RÉACTION pr.re.dede_gamin  —  Le gamin qui reste après
**Après** : toute scène de la formation ou du centre (les deux) · **Famille** : relance · **Conditions** : `chars.dede.statut in [club, staff]`
**DÉDÉ** *(coach bénévole — sourire — il tient deux ballons, un sous chaque bras)* « Il y en a un qui reste après l'entraînement, tous les jours, et qui range les ballons sans qu'on lui demande. Bon, on va pas se mentir : c'est pas le meilleur ; tu viens le voir jeudi ? »
← **Jeudi, je viens** — effets : vestiaire +, relation.dede +1 — *Tu viens. Il range les ballons. Il ne joue pas mieux, et tu restes quand même.* → **Pas le temps** — effets : direction + — *Dédé le regarde tout seul, jeudi. Il lui apprend à ranger autrement.*

### RÉACTION pr.re.gerard_rose  —  Le maillot rose
**Après** : toute scène avec Dupuis (les deux) · **Famille** : tiers qui commente · **Conditions** : `flag('boucher_sponsor')` ; `chars.gerard.statut in [club, staff]`
**GÉRARD** *(buvette, trésorier — neutre — il tient un maillot rose du bout des doigts)* « Le rose, on s'y fait, sauf le gardien, qui a demandé s'il pouvait garder le vert de l'an dernier. Ici, on payait en bières : le rose, c'est deux mille francs de plus ; on lui dit non ? »
← **Il garde le vert** — effets : caisse −, vestiaire + — *Le gardien garde le vert. Dupuis remarque au bout de six matchs, et il en rit.* → **Tout le monde en rose** — effets : caisse +, vestiaire − — *Tout le monde en rose, gardien compris. On le voit de loin, c'est le but.*

### RÉACTION pr.re.lea_a_vu  —  Elle a vu la camionnette
**Après** : toute scène de travaux, de fusion ou de vente · **Famille** : relance · **Conditions** : `chars.lea.statut != 'parti'`
**LÉA** *(L'Écho de {ville} — neutre — elle a le carnet fermé, ce qui est le pire signe)* « J'ai vu une camionnette d'huissier devant le club-house à sept heures et je l'ai vue repartir pleine. Vous confirmez, ou je demande à Gérard, qui me dira ? »
← **Je confirme** — effets : tribunes −, parole +1, relation.lea +1 — *Elle écrit trois lignes exactes. Trois lignes exactes font plus mal qu'une page.* → **Demandez à Gérard** — effets : relation.lea −1, direction + — *Elle demande à Gérard. Gérard raconte tout, et il raconte aussi le reste.*

### RÉACTION pr.re.lea_pas_confirme  —  Vous ne confirmez pas
**Après** : toute scène où tu refuses de parler à la presse (→) · **Famille** : conséquence immédiate · **Conditions** : `chars.lea.statut != 'parti'`
**LÉA** *(presse — noir — elle referme le carnet en le claquant, une fois)* « Vous ne confirmez pas, donc j'écris que vous ne confirmez pas, et les gens lisent ça comme un oui. Vous confirmez que vous ne confirmez pas ? »
**OK** **Écrivez ce que vous voulez** — effets : tribunes −, direction + — *Elle écrit « n'a pas souhaité confirmer ». Six mots, et la ville a compris.*

### RÉACTION pr.re.meneche_dessert  —  Au dessert
**Après** : tout dîner de dirigeants, toute AG (les deux) · **Famille** : relance · **Conditions** : `relation.meneche >= -1` ; `season >= 1`
**MASSENET** *(chroniqueur — sourire — il est venu au dessert, exprès, et il a gardé son manteau)* « Je viens toujours au dessert, parce qu'au dessert les gens ont fini de faire attention. Juste une question, hors micro : vous le vendez quand ? »
← **Hors micro : en juin** — effets : direction −, parole −1, relation.meneche +1 — *Il ne l'écrit pas en juin. Il l'écrit en mai, et il te prévient la veille.* → **Reprenez du dessert** — effets : relation.meneche −1, tribunes + — *Il reprend du dessert. Il écrit « le président a beaucoup mangé », ce qui est vrai et méchant.*

### RÉACTION pr.re.roux_lignes  —  Qui trace les lignes
**Après** : toute scène de terrain amateur, de fusion ou de vente du stade · **Famille** : tiers qui commente · **Conditions** : `chars.roux.statut in [club, retraite]`
**ROUX** *(président de district, puis retraité — neutre — il montre le terrain, où une ligne s'arrête au milieu)* « La ligne s'arrête à la moitié parce que le bénévole qui la traçait est mort en mars, et personne n'a repris la machine. Le district, c'est la base, mon petit : tu la traces, ou tu appelles la mairie ? »
← **Je la trace** — effets : tribunes +, vestiaire +, caisse − — *Tu traces. Ça prend deux heures et tu le refais chaque semaine ; c'est comme ça qu'on devient président.* → **J'appelle la mairie** — effets : direction +, tribunes − — *La mairie envoie quelqu'un en avril. En avril, la saison est finie.*

### RÉACTION pr.re.vecchio_gants  —  Les gants au clou
**Après** : toute scène de la buvette des anciens · **Famille** : tiers qui commente · **Conditions** : `chars.vecchio.statut in [staff, retraite]` ; `year >= 2002`
**VECCHIO** *(la buvette des anciens — sourire — il montre une paire de gants jaunes accrochée à un clou, au-dessus du percolateur)* « Ils sont là depuis que j'ai arrêté, et je n'ai jamais dit à personne s'ils étaient à moi. J'en ai vu d'autres, président : on les descend, ou on les laisse ? »
← **On les laisse** — effets : tribunes +, relation.vecchio +1 — *Ils restent. Les gamins croient qu'ils sont à quelqu'un de célèbre, et ils ont raison.* → **On les descend** — effets : caisse +, tribunes − — *Il les descend lui-même. Il les met dans un sac, et le sac dans le coffre de sa voiture.*

### RÉACTION pa.re.gerard_boite  —  La boîte en fer
**Après** : toute scène de trésorerie du club de village (les deux) · **Famille** : relance · **Conditions** : `chars.gerard.statut in [club, staff]` ; `!flag('gerard_parti')`
**GÉRARD** *(buvette, trésorier — neutre — la boîte en fer sur le comptoir, couvercle à moitié ouvert)* « Il y a quatre mille dedans, et il y a quatre mille dedans depuis novembre, ce qui n'est pas normal pour une buvette. Ici, on payait en bières : tu comptes avec moi, ou tu me fais confiance ? »
← **On compte ensemble** — effets : caisse +, relation.gerard −1, parole +1 — *Vous comptez. Il manque cent quatre-vingts francs et une explication. Il donne les deux, mal.* → **Je te fais confiance** — effets : relation.gerard +2, caisse − — *Il referme la boîte. Il te regarde une seconde de trop, et il dit merci en regardant ailleurs.*

**Les deux qui manquaient ailleurs**

### RÉACTION en.re.ministre_avion  —  L'avion du vendredi
**Après** : toute scène du postulat `bout_du_monde` (les deux) · **Famille** : relance · **Conditions** : `flag('bout_du_monde')` · *(à recopier au ch. 11)*
**LE MINISTRE DE SYLVANIE** *(voix, second rôle sans relation — sourire — il pose un billet imprimé sur le bureau, aller simple)* « L'avion du retour est vendredi, il est confortable, et le billet est déjà à votre nom, voyez. Vous le prenez, ou je le décale d'une saison ? »
← **Décalez-le** — effets : direction +, vestiaire −, caisse + — *Il le décale. Il garde le billet dans son tiroir et te le remontre chaque saison, plié pareil.* → **Je le prends** — effets : direction −−, tribunes + — *Tu montes vendredi. Le vestiaire l'apprend au journal du soir, comme le pays.*

### RÉACTION en.re.gege_jumelles  —  Les jumelles
**Après** : `en.espion.haie` (les deux) · **Famille** : conséquence immédiate · **Conditions** : `chars.gege.statut != 'parti'` · *(à recopier au ch. 11)*
**GÉGÉ** *(capo — sourire — il a des jumelles d'ornithologue autour du cou, et il n'a jamais regardé un oiseau)* « J'ai les jumelles depuis le derby de quatre-vingt-onze, et j'ai vu qui était dans le car de la presse, à côté du cadreur. La tribune n'oublie rien : je te donne le nom, ou je le garde pour la bâche ? »
← **Donne-moi le nom** — effets : relation.gege +1, direction − — *Il te donne le nom. Ce n'est pas celui que tu attendais ; c'est pour ça qu'il te le donne.* → **Garde-le pour la bâche** — effets : tribunes ++, parole −1 — *La bâche sort trois semaines après, avec le nom en toutes lettres. Personne ne dément.*

---

## 3. Les personnages à statut : qui part, qui revient, qui hante

### 3.1 La table des quarante-deux

Un personnage à statut a une **fenêtre** (où il parle en personne), des **cases** (les postes qu'il occupe et qui changent ce qu'il est pour toi), une **sortie** (`retraite`, `parti`, `vendu`, `staff`, `rival`, `mort`), un **retour possible** (le retournement, chapitre 02 § 1), un **suivant** (celui qui prend sa place sous un autre nom) et **trois retrouvailles**.

Lecture : « Cases » donne les postes successifs ; « Sortie » l'année et la forme ; « Retour » la scène où il revient de l'autre côté de la table.

| Personnage | Âge 1990 | Fenêtre | Cases successives | Sortie | Retour (l'autre côté de la table) | Suivant |
|---|---|---|---|---|---|---|
| `vukic` | 37 | 1990-2016 | adjoint → banc principal (1995) → sélectionneur de Dalmarie (2004-2008) → entraîneur des gardiens des Cobalts (2009-2014) | `retraite` 2016, meurt 2038 | `sl.vukic.dalmarie` (il est en face) ; `jp.coach_qui_te_veut` (il te veut) ; `ds.vukic.nomination` (tu le nommes) | Ilan Sorel, adjoint (2004) |
| `brehaut` | 33 | 1990-2044 | capitaine (1990-1994) → staff → DS → président de la Ligue (2020-2028) → président de la Fédération (2028-2036) | meurt 2044 | `co.retrouvailles.brehaut_president` ; ch. 13 `pr.coach_vire` (c'est lui qui te vire) | Momo, capitaine (1995) |
| `sabatier` | 51 | 1990-2011 | médecin de {club} → médecin des Cobalts (1996-2006) → témoin de la commission antidopage (2010) | `retraite` 2011, meurt 2029 | `in.la_table_du_doc` (il témoigne contre la table) | la docteure Ferrand (2008) |
| `camille` | 32 | toute la carrière | la maison → son métier tiré → après `divorce`, le téléphone | jamais ; la cinquième jauge | `co.retrouvailles.camille_telephone` ; le métier tiré ouvre une carte de secours | — |
| `clow` | 61 | 1990-1995/2000 | le mentor | meurt entre 1995 et 2000 ; buste au Panthéon | `co.retrouvailles.clow_fantome` (Fantôme) | Owen Corven, « le fils de Corven » (National 2005, D1 2012) |
| `mbako` | 16 | 1990-2049 | prodige → star des Cobalts (1996-2010) → capitaine des primes (2008) → coach rival (2018) → sélectionneur du Kambara (2026) → président de la Fédération (2036-2044) | meurt 2049 | `en.mbako.banc_en_face` ; `sl.ton_ancien_joueur` ; ch. 15 (il préside quand tu es à l'Union) | Noa Vandel (né 2004) |
| `vecchio` | 41 | 1990-2031 | gardien (cinq retraites) → entraîneur des gardiens (1995-2010) → gardien de Trébignac à cinquante ans (1999-2001) → buvette des anciens | meurt 2031 ; minute de silence, l'arbitre ajoute une minute | `co.retrouvailles.gigi_derriere_le_but` ; `pr.coupe_du_village` (il joue encore) | Bastien Lorrain, gardien (né 1971) |
| `mere_mbako` | 39 | 1990-2030 | mère-agente → agente de vingt joueurs (2010) | `retraite` 2030, meurt 2041 | `co.retrouvailles.mere_mbako_agente` (elle négocie contre toi) | — |
| `gege` | 47 | 1990-2040 | capo → Radio Tribune (2004-2011) → compte anonyme (2020) → élu des socios (2032) | meurt 2040 | `co.retrouvailles.gege_socio` (il est assis en face) | Nino, son neveu (capo dès 2020) |
| `loco` | 45 | 1990-2028 | le grand nom de janvier → coach rival → intouchable (2010) | `retraite` 2028, meurt 2039 | `ds.intouchable.*` (tu es son fusible) | le disciple au seau (2030+) |
| `klopf` | 38 | 1990-2040 | adjoint de Vaz (1993) → entraîneur de D1 (1995) → sélectionneur de la Vestrie (2004-2016) | meurt 2047 | `co.derby` (il gagne le derby) ; `sl.tournoi` (il est en face) | — |
| `rouvier` | 30 | 1990-2050 | kiné de {club} → kiné des Cobalts (2002-2014) → cabinet à Saint-Étoile | encore là en 2050 | `co.retrouvailles.rouvier_cabinet` | la kiné d'après (2015+) |
| `dembo` | 24 | 1990-2046 | avant-centre → consultant (2010) → ruiné (2015) → entraîneur de Corbelin (2020) | meurt 2046 | `co.retrouvailles.dembo_corbeaux` ; `ds.joueur_ami` (tu le vends) | — |
| `fauvel` | 27 | 1990-2045 | capitaine des Cobalts (1990-1998) → joueur de {club} (jusqu'en 2001) → président du syndicat (2006-2030) → la grève mondiale (2026) | meurt 2045 | `co.retrouvailles.fauvel_syndicat` ; `in.la_reforme` (le siège des joueurs) | Yanis Ferrol (capitaine 2014-2022) |
| `brissac` | 49 | 59 | 69 | 79 | 89 | † 2028 | — |
| `gerard` | 61 | 1990-2019 | buvette et caisse → « Gérard a fui » (2004 au plus tard) → repenti, buvette des anciens (2005) | meurt 2019, derrière le comptoir | `co.retrouvailles.gerard_carte_postale` ; `pa_gerard_revenu` | Marinette, sa femme |
| `dede` | 52 | 1990-2012 | coach bénévole → adjoint bénévole si tu redescends → Montbéliac | meurt 2012 | `co.retrouvailles.dede_enterrement` ; `am.montbeliac` (il est de l'autre côté) | Bébert, son fils (2012) |
| `paulette` | 71 | 1990-2009 | abonnée place 14B | meurt 2009, 70e minute | `co.retrouvailles.paulette_place_vide` | la petite Paulette, place 14C |
| `sacha` | non née | de ses six ans à 2050 | l'enfant → l'adolescente → l'héritière (18-22 ans) → l'ONG (2022) → la Succession | jamais | `co.retrouvailles.sacha_succession` ; `pr.le_fils` ; `sl.famille_loin` | elle **est** le suivant |
| `fardelli` | 44 | 1990-2018 | agent | `retraite` 2018, meurt 2032 | `co.retrouvailles.fardelli_carnet_repris` (Solvang a le carnet) | Ingrid Solvang (2018) |
| `meneche` | 42 | 52 | 62 | 72 | 82 | † 2032 | — |
| `aulard` | 58 | 1990-2016 | président de {club} (1990-1998) → Ligue (1998-2008) → Fédération (2008-2016) | `retraite` 2016, meurt 2026 au bureau | `co.retrouvailles.aulard_te_rappelle` ; `in.heritage` (tu ouvres ses tiroirs) | « le fils de Vaubourg » |
| `josiane` | 52 | 1990-2022 | secrétaire du club (depuis 1987) → Fédération (2008-2016) → FédéMonde (2016-2022) | `retraite` 2022, meurt 2041 | `co.retrouvailles.josiane_retraitee` (elle range ton dossier) | la petite Josiane, sa nièce |
| `lea` | 25 | 1990-2035+ | L'Écho (1990-2018) → rédactrice en chef du Quotidien (2018-2035) → « On nous écrit » | `retraite` 2035 | ch. 15 (elle est la seule à poser la question) | le stagiaire de l'Écho |
| `nassir` | 34 | 1990-2045 | sponsor → naming → prêt → rachat → comité du Mondial (2010-2022) → président de la Ligue (2028-2040) | `retraite` 2045 | `co.retrouvailles.nassir_racheteur` (il achète le club d'après) | le neveu de l'émir |
| `solvang` | 33 | 1990-2040 | agente → reprend le carnet de Fardelli (2018) | `retraite` 2040 | `co.retrouvailles.solvang_noir` ; `en.agente_solvang` | — |
| `vence` | 32 | 1990-2035 | terrain → Le Plateau (2003) → directrice de l'information (2020) | `retraite` 2035 | `co.vence.action_elimination` (elle te tient en direct) | « la voix du bandeau » |
| `la_plume` | 36 | 1990-2050, par écrit | investigation ; n'apparaît que si Parole ≤ −2 ou trace judiciaire | jamais visible | `in.dix_huit_millions` | — |
| `barbier` | 58 | 1990-2006 | recruteur de Valdorne → bénévole à Trébignac | `retraite` 2006, meurt 2021 | `co.retrouvailles.barbier_benevole` ; `ds.algorithme` (l'œil contre le modèle) | « le stagiaire » → « l'algorithme » (2008) → « le modèle » (2015) |
| `malbec` | 54 | 64 | 74 | 84 | 94 | † 2024 | — |
| `montoya` | 60 | 70 | 80 | 90 | † 2021 | — | — |
| `dupuis` | 50 | 60 | 70 | 80 | 90 | † 2026 | — |
| `aubert` | 46 | 56 | 66 | 76 | 86 | † 2035 | — |
| `legruet` | 63 | 1990-2016 | Fédération (1988-2008) → Union Continentale (2008-2016) | `retraite` 2016, meurt 2029 | `co.retrouvailles.legruet_dernier_congres` | « le dauphin » |
| `bambini` | 58 | 1990-2016 | FédéMonde (1986-2016) ; se représente à 79 ans (2011) | `retraite` 2016, meurt 2024 | `elu_surprise` (il « est choqué ») | « le dauphin » |
| `dauzat` | 44 | 1990-2032 | secrétaire général : Fédération (1990-2012) → Union (2012-2020) → FédéMonde (2020-2032) | `retraite` 2032, meurt 2044 | il ne part jamais : c'est son retournement | « le secrétaire général » (2032+) |
| `vialat` | 45 | 1990-2045 | l'Inspecteur (1989-2033) → agence de notation (2033-2045) | `retraite` 2045 | `co.retrouvailles.vialat_agence` (elle note ton club) | « l'algorithme de notation » |
| `amsel` | 47 | 1990-2028 | procureure | `retraite` 2028, meurt 2039 | `in.les_valises` (six heures du matin) | la procureure suivante |
| `colline` | 34 | 1990-2027 | arbitre de D1 (1990-2001) → consultant arbitrage (2001-2008) → responsable de l'arbitrage (2008-2027) | `retraite` 2027, meurt 2046 | `co.retrouvailles.colline_machine` (l'arbitre et la machine, 2027) | « la machine » |
| `pichon` | 56 | 1990-2019 | boulanger, président de Trébignac (1985-2000, puis quand personne ne veut) ; délégué du district | meurt 2019 | `pr.destin.district` (il te donne le siège) | son neveu (2008) |
| `roux` | 66 | 1990-2012 | président du district (1990-2012) | `retraite` 2012, meurt 2014 | `in.le_congres` (trois cents districts votent comme lui) | le fils de Roux (délégué dès 2012) |
| `rossard` | 52 | 1990-2015 | sélectionneur des Cobalts (1986-1994) → consultant Télé-Stade (1995-2015) | `retraite` 2015, meurt 2022 | `sl.consultant_savonne` (« moi, à votre place ») | Massenet, puis « la voix du bandeau » |

**Statut tranché : le quarante-deuxième.** Rossard, créé par le chapitre 02, est **validé comme quarante-deuxième personnage à statut** et ajouté à la charte § 2.3 (C-08, appliqué) : id `rossard`, m, 52 en 1990, camp `selection` puis bande `direction` dès 1995, tic « Moi, à votre place, je l'aurais fait. », mort en 2022. Le chapitre 15 a corrigé sa mention : il n'est plus listé parmi les voix sans portrait.

### 3.2 Les retrouvailles : le mécanisme, et son harmonisation

**Ce que dit la spec § 1.13** : à `_transitionTo` et à `_changeClub`, le moteur prend les **deux visages à |relation| maximale** et enfile `co.retrouvailles.<id>_<sourire|noir>` en créneaux [2,6], `same_club: false`, `fallback: drop`. Douze cartes existent.

**Ce que la bible a écrit** : 42 × 2 = **84 répliques de retrouvailles** (`_sourire` / `_noir`), plus **27 troisièmes retrouvailles** nommées, réparties entre le chapitre 01 (les 19 du terrain), le chapitre 02 (les 23 de la direction et des instances) et le chapitre 30 (22 scènes jouées). C'est deux de plus que les 82 attendues par la charte : Rossard.

**Le problème de format, à trancher ici.** Le chapitre 01 écrit ses retrouvailles comme des **scènes complètes à deux boutons** (`### SCÈNE co.retrouvailles.vukic_sourire`) ; le chapitre 02 les écrit comme des **répliques compactes à un bouton**, conformes au gabarit § 4.2 (« deux répliques ») ; le chapitre 30 en rejoue vingt-deux en scènes complètes, dont **six qui portent un id déjà pris** par le chapitre 01 (§ 9, C-01).

**Décision du chapitre 90.** La retrouvailles est **une carte à un bouton**, comme la réaction : le joueur ne décide rien en retrouvant quelqu'un, il encaisse. Un bouton, deux phrases, un effet léger (une jauge d'un cran, une relation de ±1, jamais plus). Les scènes à deux boutons du chapitre 01 et du chapitre 30 restent, mais **comme cartes propres** (`co.<id>.<mot>`), pas comme retrouvailles : elles sont trop riches pour un créneau que le moteur enfile sans prévenir. Concrètement :

- les 84 `_sourire` / `_noir` sont normalisées au format du chapitre 02 (un bouton) ;
- les 27 troisièmes deviennent des **cartes `once` conditionnées par le statut** (`co.<id>.<mot>`), servies par le réservoir, avec `statut_ok:` ; elles gardent leur texte et leurs deux boutons ;
- le champ `retrouvailles:` de `characters.yaml` garde deux ids, comme la spec le prévoit. Rien à changer au moteur.

**Les 27 troisièmes, par forme.**

| Forme | Personnages | Ce que la carte fait |
|---|---|---|
| `_telephone` | Bréhaut, Camille, Vecchio | il appelle un dimanche ; il ne demande rien |
| `_enterrement` | Dédé, Sabatier | le canton est là, tu portes le cercueil ou tu restes au fond |
| `_fantome` | Corven, Mbako | il te parle au bord d'un terrain ; deux joueurs se retournent |
| `_banc_en_face` | Vukić | même moustache, autre survêtement |
| `_carnet` | Fardelli (Solvang le lit), la mère de Mbako, Brissac | ton nom y est deux fois, dont une au crayon |
| `_cassette` | Vaz | il te la tend, vierge, étiquetée « FINALE » |
| `_tapis` | Vogler | il court encore, il chante encore, il a soixante ans |
| `_corbeaux` | Dembo | un poème sur les ardoises, ton nom au troisième vers |
| `_hymne` | Fauvel, Sacha | trois qui ne chantent pas, dont une qui te regarde |
| `_cabinet` | Rouvier | elle a des fleurs sur le bureau et ton dossier dans un tiroir |
| `_carte_postale` | Gérard | le double fond, trois cents francs, un mot qui dit « merci » |
| `_place_vide` | Paulette | la 14B, une orange dessus, la petite Paulette en 14C |
| `_succession` | Sacha | elle prend le nom, ou elle en prend un autre |
| `_cousin` | Gégé | il a un cousin partout, même à Corbelin |

### 3.3 Le statut `mort` et la relation posthume

Onze des quarante-deux meurent pendant la fenêtre jouable (§ 7.3) et quatorze scènes lisent `chars.<id>.statut == 'mort'`. La spec ne connaît pas ce statut. **Décision** : `mort` devient un statut réel, au même titre que `retraite` et `parti`, avec trois règles.

1. Un personnage `mort` **ne peut plus être locuteur**, sauf en Fantôme (`kind: fantome`), à l'enterrement (une carte, l'année de la mort) ou par un porte-parole nommé (Bébert pour Dédé, Marinette pour Gérard, la petite Paulette pour Paulette, Nino pour Gégé).
2. Sa **relation est gelée** : elle ne bouge plus, elle est lue au passé. Une carte peut ajouter « +1 (posthume) » — ce n'est pas un chiffre affiché, c'est la façon dont la lignée suivante le raconte.
3. Sa **trace de mort** (`<id>_mort`) est une trace de **monde** : elle est vraie pour toutes les carrières suivantes, et c'est elle qui arme la Nouvelle datée d'enterrement (chapitre 31, quarante et une lignes).

*Alternative si le moteur refuse un statut de plus* : garder `parti` et poser `<id>_mort`. Le chapitre 90 préfère le statut réel : `parti` autorise le téléphone, et un mort ne téléphone pas.

### 3.4 Les dix-sept cartes de Fantôme (quatre gabarits × quatre familles, plus le plateau)

Le Fantôme est un prédécesseur mort ou fini qui apparaît une fois par carrière à ta lignée. Il ne juge pas ; il constate qu'il a fait pareil. Quatre gabarits, déclinés sur les quatre familles de fin, seize cartes.

**Gabarit A — Le Fantôme de la promesse** (fin de jauge, `promise` non tenue). *Moment* : au premier objectif de saison de la lignée suivante. *Un bouton.*
- **A1 joueur** — `co.fantome.promesse_jp` · **LE FANTÔME** *(un maillot au numéro que tu portes — silhouette au bord du couloir)* — « Moi aussi j'avais dit "jusqu'en juin", et j'ai signé en janvier ; le canton l'a su avant ma mère. Tu diras quoi, toi, en janvier ? » — **On verra en janvier** — parole −1 — *Il n'insiste pas. Il connaît la suite.*
- **A2 entraîneur** — `co.fantome.promesse_en` · « Moi aussi j'avais promis la montée à Valmont. Le radiateur toussait déjà. »
- **A3 président** — `co.fantome.promesse_pr` · « J'avais promis un stade. J'ai eu une plaque, et elle était plus petite que le dessin. »
- **A4 instance** — `co.fantome.promesse_in` · « Quatre promesses, quatre confédérations, un mandat. Le Congrès a une bonne mémoire et une mauvaise vue. »

**Gabarit B — Le Fantôme du dossier** (fins judiciaires : `radie`, `ecoutes`, `vote_achete`, `offshore`). *Moment* : à la première carte de Parole négative. *Un bouton.*
- **B1** `co.fantome.dossier_jp` — « J'ai parié cent francs sur un corner. Ils ont retrouvé le ticket douze ans après. » · **B2** `co.fantome.dossier_en` — « L'enveloppe, je ne l'ai pas prise. Je l'ai regardée trop longtemps ; ça suffisait. » · **B3** `co.fantome.dossier_pr` — « J'ai décroché le téléphone rouge une fois. Une. » · **B4** `co.fantome.dossier_in` — « La montre, je l'ai rendue. Le tableau, non ; il était grand. »

**Gabarit C — Le Fantôme du corps** (fins de blessure, d'âge, de mort au poste). *Moment* : à la première alarme de jauge basse après 60 ans, ou après `genou`. *Un bouton.*
- **C1** `co.fantome.corps_jp` — « Mon genou m'a parlé en mars ; je lui ai répondu en juin. Il avait raison en mars. » · **C2** `co.fantome.corps_en` — « Je suis mort au poste, à la mi-temps, dans le couloir. Personne n'a osé finir le match. » · **C3** `co.fantome.corps_pa` — « J'ai tracé les lignes jusqu'à quatre-vingt-deux ans. La dernière était droite. » · **C4** `co.fantome.corps_sl` — « J'ai fait trois tournois. J'ai dormi pendant le quatrième, dans un avion, à côté d'un douanier. »

**Gabarit D — Le Fantôme doré** (fins dorées : statue, jubilé, mémoires, ta loge). *Moment* : à la première Carte Destin acceptée par la lignée. *Un bouton.*
- **D1** `co.fantome.dore_jp` — « J'ai eu une statue. Ils ont gravé le nom avec une faute d'accent ; personne ne l'a jamais corrigée. » · **D2** `co.fantome.dore_en` — « J'ai eu ma loge. On y monte par un escalier que je ne peux plus monter. » · **D3** `co.fantome.dore_pr` — « Le local, je l'ai fait repeindre. C'est la seule chose qu'ils ont gardée. » · **D4** `co.fantome.dore_in` — « J'ai écrit mes mémoires. Le chapitre huit a été relu par un avocat, et c'est le meilleur. »

**Gabarit E — Le Fantôme du plateau** (`co.fantome.consultant`, commandé huit fois par le chapitre 02). *Moment* : à la première apparition de Vence ou de Massenet après une fin de consultant. *Un bouton.*
**LE FANTÔME** *(un ancien, en costume, sur un plateau vide — les projecteurs sont éteints, il parle quand même)* — « J'ai fini ici, à commenter ceux qui font ce que je faisais mal. Je n'ai pas vu l'action ; je ne l'ai jamais vue, et j'en ai vécu. » — **Je m'assois** — tribunes +, direction − — *La chaise est chaude. Personne ne l'a occupée depuis.* *Lit* `phrase_de_trop`, `remplacant_nomme`, `chapitre_meneche`, `vence_replay`, `dossier_sorti`, `consultant`.

**Traces lues par les dix-sept** : `promise`, `parole`, `radie`, `ecoutes` ✱, `vote_achete` ✱, `offshore` ✱, `genou` ✱, `clow_ingrat` ✱ (si `clow_ingrat`, le Fantôme est Corven et il ne dit rien de gentil), `sacha_heritiere`, plus les six du gabarit E. **Trace posée** : `fantome_vu` (lue par la Succession et par les épitaphes `epitaph_plus` des fins dorées).

### 3.5 Les neuf cartes de mémoire des clubs (`co.memoire.*`, cité aussi `co.memoire_clubs` par le ch. 13 : le préfixe qui fait foi est `co.memoire.`)

Un club se souvient de ton **nom**, pas de toi. Trois accueils × trois situations. `same_club: false`, servies au premier créneau après une arrivée.

| Accueil | Tu arrives comme… | Carte | Qui parle | Le mot |
|---|---|---|---|---|
| **+3 · le retour du fils prodigue** | joueur | `co.memoire.prodigue_jp` | Gégé | « La tribune n'oublie rien, et elle a gardé ton numéro. Personne ne l'a porté depuis. » |
| | entraîneur / DS | `co.memoire.prodigue_en` | Josiane | « J'en ai vu passer ; vous, on vous a gardé votre place de parking. Elle est un peu petite maintenant. » |
| | président | `co.memoire.prodigue_pr` | Paulette ou la petite Paulette | « J'étais là quand vous êtes parti, et je suis là. Ce n'est pas un exploit, c'est une place. » |
| **0 · on verra** | joueur | `co.memoire.neutre_jp` | le concierge (voix) | « Vestiaire du fond, crochet libre, celui du milieu grince. On verra dimanche. » |
| | entraîneur / DS | `co.memoire.neutre_en` | Josiane | « La porte est neuve, il n'y a pas encore de nom dessus. J'attends de voir combien de temps. » |
| | président | `co.memoire.neutre_pr` | Roux ou le fils de Roux | « Le district, c'est la base. On vous inscrit, on ne vous applaudit pas. » |
| **−3 · persona non grata** | joueur | `co.memoire.grata_jp` | Gégé (noir) | « La tribune n'oublie rien, et ton nom est encore sur une bâche pliée dans un sac poubelle propre. » |
| | entraîneur / DS | `co.memoire.grata_en` | Vukić (noir) | « Je te le dis parce que personne ne te le dira : ils ont voté ton nom au local, et ce n'était pas pour t'accueillir. » |
| | président | `co.memoire.grata_pr` | Dupuis ou Malbec | « Entre présidents, on se comprend ; ici, on ne vous comprend pas, et on l'a écrit dans le procès-verbal. » |

**Traces lues** : `derby_perdu` ✱ / `derby_gagne` ✱, `pacte_gege` ✱, `mbako_vendu` ✱, `fusion_signee`, `gerard_parti`, `dede_montbeliac`, `brehaut_vendu_par_toi`, `ligue_fermee_signee` ✱, `village_fusionne`, plus la **mémoire de club** (charte § 1.3 : « mémoire à −3 pour la lignée qui a signé la fusion » à Loubières). **Trace posée** : `memoire_club` (valeur `plus3 | zero | moins3`), lue par les set-pieces `objective` et `aftermatch` (chapitre 30) et par les manchettes d'arrivée.

### 3.6 Les vingt-quatre cartes de Nemesis (trois par rôle)

Un Nemesis est une relation à −3 qui **traverse un changement de rôle**. Il ne t'attaque pas : il est là, il a le pouvoir, et il ne t'aide pas. Trois cartes templatées par rôle, servies au plus une par saison, jamais deux d'affilée.

| Rôle | N1 · il te barre | N2 · il te double | N3 · il te propose la paix (une fois) |
|---|---|---|---|
| joueur amateur | Dédé/Dupuis : tu es dix-septième sur une feuille de seize | Montbéliac te prend ton capitaine | Pichon : « Le pain, c'est à cinq heures ; on efface ? » |
| joueur pro | Vukić/Vaubourg : la compo est écrite avant l'échauffement | Fardelli vend ta place à un autre | Bréhaut : « Le groupe vit bien. Toi non. On se parle ? » |
| entraîneur | Massenet sort le dossier | Vaz/Vogler prend le banc qu'on t'avait promis | Gégé : « La tribune n'oublie rien. Elle peut se taire. » |
| DS | Fardelli fait passer la commission par un autre | Solvang signe ton joueur à minuit | Vialat : « Je ne juge pas, je compte. On recompte ensemble ? » |
| président amateur | Roux te convoque en commission | Dupuis sponsorise le club d'à côté | Gérard : « Ici, on payait en bières. Tu paies la première ? » |
| président pro | Malbec vote contre toi à la Ligue | Montoya t'exclut de la table | Vaubourg : « J'ai pas le temps, j'ai un empire. J'ai deux minutes. » |
| sélectionneur | Rossard te savonne au plateau | Berthomier annonce ton remplaçant avant toi | Fauvel : « On est un groupe, pas une liste. Vous en êtes ? » |
| instance | Dauzat perd ton procès-verbal | Bambini fait voter son dauphin | Amsel : « Nous avons tout notre temps. Vous voulez le mien ? » |

**Les ids.** Le tableau ci-dessus est le **gabarit par rôle** ; l'id réel est nommé par le personnage, parce que c'est lui qu'on reconnaît : `co.nemesis.<id>_<n1|n2|n3>`. Les chapitres 02 et 10 citent déjà `co.nemesis.aulard`, `co.nemesis.fardelli`, `co.nemesis.lea` et `co.nemesis.solvang` : ce sont les quatre premiers à écrire, avec `co.nemesis.meneche`, `co.nemesis.gege`, `co.nemesis.malbec` et `co.nemesis.dauzat`. Huit personnages × trois cartes = les vingt-quatre.

**Mécanique** : le Nemesis est désigné à la Passation (la pire relation, `relation <= -3`, statut vivant) et stocké dans `world.nemesis`. N3 n'apparaît qu'une fois par carrière et remet la relation à −1 si elle est acceptée : c'est la seule sortie. **Traces posées** : `nemesis_paix`, `nemesis_refuse` (lues par les épitaphes, par le Grand Déballage et par la carte de Succession).

### 3.7 Les six cartes de lignée

La lignée est ce qui reste : un nom, un objet, une promesse. Six cartes, servies à la Succession ou juste après.

1. **`co.lignee.le_nom`** — *Le nom qu'on chante ou qu'on insulte.* Gégé, ou Nino après 2020. « La tribune n'oublie rien, et elle chante encore ton nom de famille ; elle ne sait pas que ce n'est plus toi. » — **Je le porte** — tribunes +, `set: nom_porte` · **Je prends l'autre** — tribunes −, direction +, `set: sacha_autre_nom`.
2. **`co.lignee.trois_generations`** — *Trois générations.* Paulette (avant 2009) ou la petite Paulette. « J'ai vu votre père, je vous vois, et il y a un petit en 14C qui mange une orange. » — un bouton. *Lit* `paulette_14a`, `sacha_nee` ✱, `trois_generations`.
3. **`co.lignee.objet`** — *L'objet.* Le Dossier ne tient **qu'un** objet ; douze sont héritables (§ 6.4). « Il vous a laissé ça. Vous ne pouvez en prendre qu'un ; les autres restent au Panthéon. » — deux boutons : **le dernier reçu** / **celui qu'on choisit**. *Décision du chapitre 90* : à la Succession, le joueur **choisit** parmi les objets gagnés ; hors Succession, c'est le dernier reçu qui écrase.
4. **`co.lignee.la_promesse`** — *Tu m'as promis.* Sacha, si `sacha_promesse_rompue`. « Tu m'avais promis juin, et c'était juin. Je ne te le redemanderai pas. » — un bouton — parole −2, relation.sacha −1. **C'est la carte qui rend `sacha_promesse_rompue` non orpheline** (§ 1.5).
5. **`co.lignee.la_dette`** — *Ce qu'on te doit, ce que tu dois.* La meilleure relation vivante te doit quelque chose ou l'inverse. « Votre père m'a avancé la paie du 5, de sa poche. Je n'ai jamais rendu. » *Lit* `salaires_avances`, `bas_de_laine`, `gerard_merci`, `mere_trois_pour_cent`.
6. **`co.lignee.persona`** — *Le club se souvient de ton nom.* Renvoie aux neuf cartes de mémoire (§ 3.5) avec le nom hérité. *Lit* `memoire_club`.

---

## 4. Les intrigues partagées et les intrigues miroir

### 4.1 L'index des intrigues `co.*`

Une intrigue `co.` est jouable dans **deux rôles ou plus**. Il y en a quarante-huit : dix-neuf portées par les fiches du chapitre 01 (une par personnage du terrain), vingt-trois par celles du chapitre 02, six partagées entre chapitres de scénarios.

| Famille | Intrigues | Rôles couverts |
|---|---|---|
| **Le terrain (ch. 01)** | `co.vukic_cahier`, `co.brehaut_costume`, `co.sabatier_table`, `co.camille_naissance`, `co.clow_lundi`, `co.mbako_horloge`, `co.vecchio_cinq_retraites`, `co.mere_trois_pour_cent`, `co.gege_virage`, `co.loco_cassette`, `co.klopf_pressing`, `co.rouvier_sifflet`, `co.dembo_ballon`, `co.fauvel_liste`, `co.brissac_chiffres`, `co.gerard_boite`, `co.dede_sifflet`, `co.paulette_14b`, `co.sacha_promis` | 4 à 8 rôles chacune ; `co.camille_naissance`, `co.sabatier_table`, `co.paulette_14b`, `co.sacha_promis` sont partagées par **tous** |
| **La direction et les instances (ch. 02)** | `co.fardelli_page_trois`, `co.meneche_hors_micro`, `co.aulard_empire`, `co.josiane_fiche`, `co.lea_carnet`, `co.nassir_actif`, `co.solvang_double_mandat`, `co.vence_action`, `co.la_plume_copies`, `co.barbier_doudoune`, `co.malbec_deux_lettres`, `co.montoya_table`, `co.dupuis_nom_dans_le_dos`, `co.aubert_argent_public`, `co.legruet_apres_le_congres`, `co.bambini_trophee`, `co.dauzat_proces_verbal`, `co.vialat_deux_soldes`, `co.amsel_tout_notre_temps`, `co.colline_jai_vu`, `co.pichon_cent_cinquante`, `co.roux_la_base`, `co.rossard_planche` | chaque étape est gardée par un rôle : joueur → entraîneur → DS → président → instance. C'est le mécanisme du **retournement** |
| **Les partagées de scénario** | `co.derby` (10, 11, 13), `co.pharmacie` (10, 11), `co.cartons_camille` (10, 11), `co.mbako_rival` (01, 10), `co.destin.*` (11, 30), `co.retrouvailles.*` (01, 02, 30) | deux à trois chapitres écrivent la même intrigue vue d'un autre fauteuil |

**Règle d'exclusion.** Une intrigue `co.` ne se sert **qu'une fois par carrière**, tous rôles confondus, sauf si elle est marquée `replay`. Le chantier données doit poser `exclusive_with` entre les variantes de rôle d'une même intrigue : jouer `co.pharmacie` côté joueur interdit `co.pharmacie` côté banc **dans la même carrière**, mais l'autorise dans la carrière suivante avec la trace héritée.

### 4.2 Les six intrigues miroir

Une intrigue miroir est **la même histoire vue de deux fauteuils**. Elle est le meilleur argument du jeu : le joueur reconnaît la scène et comprend, dans son corps, qu'il a changé de côté. Six existent ; elles sont la colonne vertébrale de la couture inter-rôles.

#### Miroir 1 — La vente de Mbako (quatre fauteuils)

| Fauteuil | Où | Ce que tu vois | Ce que tu poses | Ce que tu lis d'avant |
|---|---|---|---|---|
| **entraîneur** | 11 · `en.prodige` | un gamin de seize ans qui marche sur l'eau et un président qui compte | `mbako_lance` ✱, `mbako_vendu` ✱, `mbako_garde` ✱, `commission_vente` | `gamin_barbier`, `brassard_mbako` |
| **joueur** | 10 · `co.mbako_rival` | le prodige d'après, qui prend ta place ; c'est **toi** qu'on vend pour lui | `rival_mbako`, `mentor_mbako`, `demande_vente`, `mbako_blesse_par_toi` | `mbako_decide`, `mbako_vendu` ✱ |
| **DS** | 12 · `ds.vente_du_prodige` | une clause, une mère à 3 %, un chiffre de référence qui est celui de Mbako | `petit_vendu`, `petit_garde`, `clause_sautee` | `mbako_vendu` ✱, `mere_trois_pour_cent`, `gamin_demande` |
| **président** | 13 · `pr.rachete_fonds` (`mbako_revenu`) ; `pr.petit_poucet` (`mbako_au_vestiaire_village`) | le retour, la statue, le socle gravé avec une faute d'accent | `mbako_revenu`, `mbako_apres` | `mbako_vendu` ✱ |
| **la mère** | 01 · `co.mere_trois_pour_cent` ; 14 · `sl.avion_des_primes` | celle qui a signé quelque chose à dix-neuf ans et qui ne signera plus rien | `mere_trois_pour_cent`, `mere_agente_vingt`, `prime_mbako_a_part` | `mbako_vendu` ✱, `mbako_decide` |

**Ce qui fait le miroir** : `mbako_vendu` ✱ est lu par neuf chapitres. La scène de vente est écrite une fois (11), et huit autres scènes la citent sans la rejouer. **Règle** : aucune scène ne redit *comment* Mbako a été vendu ; elles disent seulement *que* ça a eu lieu et ce que ça coûte à celui qui parle.

#### Miroir 2 — La pharmacie (`co.pharmacie`, deux fauteuils, une victime)

Côté **joueur** (10), tu es celui à qui on tend le flacon : `vitamines`, `flacon_b` ✱, `dope_a_son_insu`, `controle_negatif`. Côté **banc** (11), tu es celui qui décide ce qu'il y a dans l'armoire : `pharmacie_propre` ✱, `flacon_cache`, `sabatier_denonce`. Côté **instance** (15 · `in.la_table_du_doc`), tu es celui qui ferme la table : `commission_medicale`, `table_fermee`, `joueur_protege`. Trois hauteurs, un flacon. **La règle du drame** : `dope_a_son_insu` n'est jamais posé par le joueur qui le subit — il est posé par le banc et lu par le joueur de la carrière suivante. C'est la seule trace du jeu qui punit rétroactivement une lignée.

#### Miroir 3 — Le derby (`co.derby`, trois fauteuils)

Joueur (10) : tu le joues, `derby_gagne` ✱ / `derby_perdu` ✱, `salue_ancien_virage`. Banc (11) : tu le prépares, `espion_cafe`, `onze_du_virage` ✱. Loge (13 · `pr.derby_en_loge`) : tu dînes la veille avec le président d'en face, `diner_veille`, `arbitre_alpague`, `bache_laissee`. **Ce qui fait le miroir** : la même bâche, vue de trois hauteurs — le joueur la lit en courant, le coach la lit du banc, le président la fait décrocher.

#### Miroir 4 — L'enveloppe (trois fauteuils, trois sens)

Joueur amateur (10 · `am.pichon_150`) : cent cinquante francs dans une enveloppe, c'est ta paie. Entraîneur (11 · `en.enveloppe`) : c'est une proposition de truquer, `enveloppe_promise` ✱ / `enveloppe_refusee` ✱. Président (13 · `pr.valise`) : c'est une valise, et l'autre président la trouve normale. Instance (15 · `in.les_valises`) : c'est une montre, un tableau, et six heures du matin. **Le même objet grandit avec toi** : c'est l'idée la plus économique de la bible, et elle tient grâce à une seule trace, `enveloppe_promise` ✱, lue dix-sept fois par le chapitre 02.

#### Miroir 5 — Gérard et la caisse (deux fauteuils, un chapitre existant)

Entraîneur (∃ `en.evt.gerard`) : Josiane t'annonce le tiroir vide. Président amateur (13 · `pr.gerard_a_fui`) : c'est **toi** qui dois payer les licences. Fiche (01 · `co.gerard_boite`) : c'est **lui** qui parle, et il explique. **Problème de couture** : la carte existante ne pose pas `gerard_parti`, alors que sept scènes le lisent (§ 9, C-13).

#### Miroir 6 — La Ligue fermée (deux fauteuils, soixante heures)

Président pro (13 · `pr.ligue_fermee`, huit cartes de six heures) : on te demande si tu es assis ou debout. Instance (15 · `in.dossier.ligue_fermee`) : on te demande si tu exclus leurs joueurs des sélections. Sélectionneur (14) : tu retrouves ces joueurs dans ta liste. **Ce qui fait le miroir** : `ligue_fermee_signee` ✱ est une trace de **monde** — celui qui l'a signée devient l'ennemi de toutes les lignées suivantes.

### 4.3 Les quatre miroirs à écrire

Le chapitre 90 propose quatre miroirs de plus, qui coûtent une variante chacun et rapportent beaucoup :

1. **Le diplôme** (`diplome` ✱ / `diplome_arrange`) : vu du joueur qui le passe (10), du coach qui n'en a pas (11), de la DTN qui le signe (01 · `co.brissac_chiffres`), et de la Fédération qui rouvre le dossier vingt ans après (15 · `in.le_selectionneur`). Les quatre scènes existent ; il manque **la variante de 15 qui lit `diplome_arrange` posé par 11**.
2. **Le genou** (`genou` ✱) : vu du joueur (10), du kiné (01), du DS qui arrondit la visite (12), et de la commission médicale (15). Manque : **la variante de 12 qui lit `genou_petit_dit` posé par 01**.
3. **Le tifo** (`pacte_gege` ✱) : vu du joueur dont le nom est sur la bâche (10), du coach qui signe le pacte (11), du président à qui on réclame le local rénové (13), et du socio en face (30 · `co.retrouvailles.gege_socio`). Complet.
4. **Le bus** (`bus_menace`, `mutinerie`) : vu du joueur dedans (10), du coach devant la porte (11), du sélectionneur qui monte (14), et de l'instance qui lit le communiqué (15). Manque : **la variante de 10 côté joueur**, aujourd'hui absente.

---

## 5. Les fils rouges par postulat et ce qu'ils déclenchent

Le fil rouge est tiré au début de la carrière, parmi trois réponses à la question de saison. Il n'est jamais dit au joueur ; il pondère le réservoir, choisit les variantes des set-pieces (chapitre 30 en lit dix-neuf), et donne son ton à la Une du Bilan. C'est la manette de variété la moins chère du jeu : le même postulat rejoué donne un autre film.

| Postulat | Question de saison | Fil rouge | Ce que le fil rouge double dans le réservoir | Ce qu'il change au set-piece `objective` | La trace qu'il pousse |
|---|---|---|---|---|---|
| `promu` | Ce club est à qui ? | `tribune` | `en.kop_qui_aime_trop` ×1,5 ; `en.espion_haie` | Gégé parle avant Vaubourg | `pacte_gege` ✱, `onze_du_virage` ✱ |
| | | `president` | `en.adjoint_dine`, `en.fils_aulard` | Vaubourg promet une prime qu'il ne datera pas | `vukic_dauphin` ✱, `president_ami` ✱ |
| | | `argent` | `en.salaires_retard`, `en.nassir_proprietaire` | Josiane parle du 5 du mois | `salaires_retard` ✱, `naming_signe` ✱ |
| `interimaire` | Qui te garde ? | `vestiaire` | `en.vestiaire_ancien`, `en.brassard_brehaut` | Bréhaut parle à la place du président | `methodes_ancien`, `brehaut_capitaine` |
| | | `diplome` | `en.diplome`, `en.commission_discipline` | Berthomier : « il manque une signature » | `derogation`, `diplome_arrange` |
| | | `grand_nom` | `en.grand_nom`, `en.ancien_en_face` | Fardelli propose déjà ton remplaçant | `cassette_regardee`, `loco_evince` |
| `bout_du_monde` | Qui commande ? | `ministre` / `salaires` / `peuple` | `en.compo_ministre` / `en.salaires_sylvanie` / `en.adoption` | le ministre, Rouvier ou la place | `compo_du_ministre` / `salaires_sylvanie` / `sylvanie_adopte` |
| `six_mois` | Le titre par quoi ? | `stars` / `proprietaire` / `jeu` | `en.stars_a_trente` / `en.proprietaire_quarante` / `en.loft_dembo` | Ilyas compte, ou Vaz s'assoit | `roi_mbako` / `nassir_au_vestiaire` / `seau_dans_le_placard` |
| `section_feminine` | Avec quoi ? | `budget` / `emploi` / `medias` | `en.budget_buvette` / `en.emploi_des_joueuses` / `en.medias_arrivent` | Brissac, Inès ou Vence | `budget_buvette` / `emploi_garde` / `cameras_venues` |
| `pepite` | Tu joues pour quoi ? | `prix` | `jp.clause`, `jp.contrat_image` | Fardelli chiffre ton année | `agent_fardelli`, `offshore` ✱ |
| | | `terrain` | `jp.brassard_test`, `jp.banc_hiver` | Bréhaut parle du brassard | `capitaine` ✱, `banc_bosse` |
| | | `maison` | `jp.tifo`, `jp.retour_usine` | Gégé parle de la bâche | `enfant_du_pays`, `ami_ultras` ✱ |
| `fin_de_contrat` | Qui décide ? | `genou` / `agent` / `vestiaire` | `jp.genou_parle` / `jp.exil_dore` / `jp.vestiaire_porte` | Sabatier, Fardelli ou Bréhaut | `genou` ✱ / `exil_dore` / `petition_portee` |
| `village_endette` | Que ne veux-tu pas perdre ? | `boulot` / `copains` / `village` | `am.patron` / `am.troisieme_mitemps` / `am.montbeliac` | ton patron, Momo ou Dédé | `patron_furieux` / `copains_gardes` / `village_fusionne` |
| `lache_academie` | Contre quoi ? | `revanche` / `oubli` / `fardelli` | `am.doudoune` / `am.genou_21` / `am.selection_ligue` | Barbier, Dédé ou Fardelli | `revanche_valdorne` / `apres_le_foot` / `agent_fardelli` |
| `retour_croises` | Qu'est-ce qui revient d'abord ? | `corps` / `place` / `confiance` | `jp.genou_parle` / `jp.brassard_test` / `co.derby` | Rouvier, Vukić ou Gégé | `croises_rejoues` / `titulaire_reclame` / `derby_joue` |
| `binational` | Tu choisis quoi ? | `pays` / `famille` / `carriere` | `jp.selection` / `jp.maison_pays` / `jp.contrat_image` | Brissac, ta mère ou Fardelli | `binational_choisi` ✱ |
| `banc_dore` | Tu veux quoi ? | `argent` / `jeu` / `retour` | `jp.exil_dore` / `jp.coach_qui_te_veut` / `jp.retour_usine` | Ilyas, Dembo ou Gégé | `exil_dore` / `veut_jouer` / `retour_promis_gege` |
| `capitaine_dechu` | Le brassard pèse pour quoi ? | `remontee` / `fierte` / `depart` | `jp.geant.dechu` / `jp.vestiaire_porte` / `jp.adieu` | Vialat, Bréhaut ou Camille | `geant_remonte` / `brassard_garde_dechu` / `dernier_annonce` |
| `vendre_trente` | Trente millions comment ? | `coach` / `scouts` / `president` | `ds.neuf_ou_trader` / `ds.cellule` / `ds.beau_frere` | Vogler, Barbier ou Vaubourg | `coach_pas_prevenu` / `cellule_barbier` / `recrue_du_president` |
| `coach_intouchable` | Qui saute ? | `loco` / `president` / `vestiaire` | `ds.intouchable.*` / `ds.masse_salariale` / `ds.joueur_ami` | Vaz, Ilyas ou Mbako | `cassette_recue` / `fusible_saute` / `dembo_a_choisi` |
| `fusion_imposee` | Que gardes-tu ? | `couleurs` / `mairie` / `gamins` | `pr.fusion` / `pr.terrain_rugby` / `pr.indemnite_formation` | Aubert, Roux ou Dédé | `couleurs_gardees` / `mairie_perdue` / `vestiaires_melanges` |
| `coupe_du_village` | Le Poucet pour quoi ? | `recette` / `fete` / `apres` | `pr.petit_poucet` / `pr.buvette_benevoles` / `pr.montee` | Pichon, Gérard ou Dupuis | `recette_apres` / `fete_promise` / `successeur_cherche` |
| `geant_dechu` | Tu sauves quoi ? | `commission` / `kop` / `vente` | `pr.commission` / `pr.gege_exige` / `pr.naming` | Vialat, Gégé ou Vaubourg | `commission_lettre` ✱ / `kop_compte` / `geant_vente_aout` |
| `rachete_fonds` | Le club est à qui ? | `naming` / `kop` / `titre` | `pr.naming` / `pr.gege_exige` / `pr.actionnaires` | Ilyas, Gégé ou le Conseil | `naming_signe` ✱ / `banderoles_libres` / `titre_promis_conseil` |
| `pays_emergent` | Avec qui ? | `expatries` / `ministre` / `jeunes` | `sl.star_refuse` / `sl.minuit_et_une` / `sl.le_pays_attend` | Teslić, le ministre ou Dragan | `expatries_convaincus` / `liste_du_ministre` / `jeunes_lances_sylvanie` |
| `apres_fiasco` | Le brassard à qui ? | `mutins` / `nouveaux` / `presse` | `sl.le_bus` / `sl.le_capitaine` / `sl.consultant_savonne` | Fauvel, Ferrol ou Rossard | `mutin_rappele` / `vandel_lance` / `savon_subi` |
| `heritage_empoisonne` | Les tiroirs ? | `nettoyer` / `proteger` / `oublier` | `in.les_valises` / `in.le_club_ami` / `in.le_congres` | Amsel, Malbec ou Roux | `tiroirs_ouverts` / `pacte_aulard` / `firmin_dit` |
| `sous_tutelle` | Qui te lève la tutelle ? | `ministre` / `fedemonde` / `districts` | `in.tutelle.*` / `in.le_selectionneur` / `in.le_congres` | le ministre, Bambini ou Roux | `tutelle_acceptee` / `pays_suspendu` / `congres_ile_verte` |
| `tournoi_desert` | Le vote sur quoi ? | `argent` / `parole` / `votes` | `in.dossier.attribution` / `in.dix_huit_millions` / `in.les_valises` | Ilyas, La Plume ou Bambini | `mondial_desert` ✱ / `documents_publies` / `vote_achete` ✱ |
| `elu_surprise` | Qui te lâche en premier ? | `dauzat` / `sponsors` / `mondial` | `in.dauzat_proces_verbal` / `in.dossier.sponsor_majeur` / `in.dossier.attribution` | Dauzat, Ilyas ou Bambini | `pv_desordre` / `sponsor_cherche` / `mondial_desert` ✱ |

**Trois règles de fil rouge.** (1) Le fil rouge choisit **la première carte de la saison 0** (l'ancre A1) : c'est là que le joueur doit sentir, sans qu'on le lui dise, que cette partie sera celle du kop ou celle de l'argent. (2) Il **ne change jamais** en cours de carrière ; il change à la Passation. (3) Un objectif caché au moins par postulat est **inaccessible sans un certain fil rouge** — c'est ce qui donne envie de rejouer le même postulat (§ 8).

---

## 6. Les chaînes multi-rôles

### 6.1 Ce qui voyage d'un fauteuil à l'autre

La charte § 3.3 dit ce qui se conserve. Voici **ce que ça donne concrètement** : quelles traces survivent, et quelle scène du rôle suivant les lit.

| Ce qui voyage | Traces concernées | Lu par, dans le rôle suivant |
|---|---|---|
| **Le corps** | `genou` ✱, `genou_opere` ✱, `genou_grave`, `croises_rejoues`, `infiltre` | entraîneur : `en.pharmacie.armoire` (« vous savez ce que ça fait ») ; DS : `ds.joueur_ami` (tu arrondis, tu sais pourquoi) ; sélectionneur : `sl.blessure_avant` ; set-piece `gm_te` (Colline : « vous jouiez sur une jambe ») |
| **Le brassard** | `capitaine` ✱, `brassard_gigi`, `brassard_refuse`, `capitaine_lundi` | entraîneur : `en.brassard_brehaut` (tu sais ce que pèse le tissu) ; sélectionneur : `sl.le_capitaine` ; président : `pr.gege_exige` (le kop te croit) |
| **Le papier** | `diplome` ✱, `diplome_arrange`, `derogation`, `clow_stage` | entraîneur : `en.diplome` ; instance : `in.le_selectionneur` (Brissac rouvre le dossier) ; fin `en_chaussure` |
| **La tribune** | `ami_ultras` ✱, `pacte_gege` ✱, `onze_du_virage` ✱, `otage_kop` | président : `pr.gege_exige`, `pr.ligue_fermee.h1_kop` ; instance : `in.gege.compte` (le compte anonyme) ; fin `en_otage` |
| **La maison** | `divorce` ✱, `sacha_nee` ✱, `camille_ici` ✱, `camille_metier`, `sacha_promesse_tenue` / `_rompue` | tous : les cartes `famille` lisent `!divorce` ; Succession : `co.retrouvailles.sacha_succession` ; fin `co_photo_famille` |
| **La casserole** | `offshore` ✱, `pari`, `pisteur`, `ecoutes` ✱, `radie`, `fede_dossier` ✱, `vote_achete` ✱ | président : `pr.ecoutes` ; instance : `in.les_valises` ; La Plume apparaît dès Parole ≤ −2 ; fins judiciaires |
| **La dette** | `enveloppe_promise` ✱, `enveloppe_refusee` ✱, `president_ami` ✱, `dette_malbec`, `dette_aulard` | président : `pr.congres` (tes alliés) ; instance : `in.le_congres` (ta majorité se calcule dessus) |
| **Le nom** | `enfant_du_pays`, `special` ✱, `international` ✱, `legende`, `memoire_club` | tous : les neuf cartes de mémoire (§ 3.5) ; les Unes d'arrivée ; le Nemesis |
| **L'objet** | douze objets héritables (§ 6.4) | Succession : `co.lignee.objet` ; les épitaphes `epitaph_plus` |

### 6.2 Les trois carrières de référence, rejouées scène par scène

Ce sont les tests d'intégration du chapitre 90 (brainstorm 03 § 3.6). Chacune est une suite d'ids : si la suite se joue sans trou, la couture tient.

#### Carrière A — La voie de la légende (37 scènes citées)

**Joueur amateur, 1991-1992** (`village_endette`, fil `village`) : `am.tuto.bienvenue` → `am.tuto.copains` → `am.tuto.match` → `am.village.club_endette` A1-A4 → `am.doudoune.doudoune` (pose `essai_pro`) → `am.selection_ligue` (pose `selection_ligue`) → Carte Destin `co.destin.am_vers_jp` (Barbier).
**Joueur pro, 1993-2004** (`pepite`, fil `terrain`) : `jp.pepite.p1_prix` → `jp.brassard_test.penalty` (pose `capitaine` ✱) → `jp.selection.liste` (pose `international` ✱) → `jp.tifo.bache` (pose `ami_ultras` ✱, `enfant_du_pays`) → `co.mbako_rival.sac_neuf` (Mbako te double) → `jp.genou_parle.bilan` (pose `genou` ✱, issue *opéré*) → `jp.derniere_selection.adieu_cobalt` → `jp.conseils_gigi` (Vecchio, trois conseils) → `jp.adieu` → Carte Destin `co.destin.jp_vers_selection` (Berthomier, `legende`).
**Sélectionneur, 2006-2013** (`apres_fiasco` si 2011, sinon les Cobalts par défaut) : `sl.la_liste.mars_le_vieux` → `sl.le_capitaine.brassard` (lit `capitaine` ✱) → `sl.ton_ancien_joueur.couloir` (lit `mbako_lance` ✱) → chaîne `sl.tournoi` (douze scènes, demi-finale) → `sl.minuit_et_une.congres` (Dauzat) → Carte Destin `co.destin.sl_vers_union` (Bambini).
**Union Continentale, 2014-2022** (`tournoi_desert` en variante) : `in.le_congres.campagne` ×4 → `in.dossier.attribution` (pose `mondial_desert` ✱, `vote_achete` ✱) → `in.les_valises` V1-V6 → **fin `in_radiation`** — *La radiation*, huit ans, le golf qu'il n'aime pas.
**Ce que la lignée hérite** : `radie`, `vote_achete` ✱, `international` ✱, `capitaine` ✱, `genou` ✱, `ami_ultras` ✱ ; le postulat dérivé `le_repenti` est proposé en un tap. **Fantôme** : gabarit B4.

#### Carrière B — Le fusible éternel (34 scènes citées)

**Entraîneur intérimaire, 1990** (`interimaire`, fil `grand_nom`) : `en.interim.i1_bureau` → `en.vestiaire_ancien.cafetiere` → `en.grand_nom.cassette` (Vaz ; pose `cassette_regardee`) → `en.diplome.derogation` (pose `derogation`) → Carte Destin `co.destin.adjoint_vers_en`.
**Entraîneur, 1991-2000** (`promu`, fil `argent`) : `en.promu.a1_inventaire` → `en.salaires_retard.distributeur` (pose `salaires_retard` ✱) → `en.kop.pacte` (pose `pacte_gege` ✱) → `en.prodige.offre` (pose `mbako_vendu` ✱) → `en.adjoint_dine` (pose `vukic_dauphin` ✱) → **fin `en_sms`** (viré) → `co.retrouvailles.aulard_te_rappelle` → deuxième club → **fin `en_decoupe`** → troisième club → **fin `en_coupable`**.
**Consultant, 2001-2002** : `co.destin.en_vers_plateau` (Vence) → `jp.consultant.plateau` → `en.plateau_meneche` (Audience 85).
**Sélectionneur du bout du monde, 2003-2010** (`pays_emergent`, fil `expatries`) : `sl.sylvanie.a1_le_ministre` → `sl.star_refuse.teslic` (pose `teslic_venu`) → `sl.le_pays_attend.place` (pose `descendu_sur_la_place`) → chaîne `sl.tournoi` (qualification historique, pose `qualifie_sylvanie`) → Carte Destin `co.destin.sl_vers_club` (Malbec).
**Grand club, 2011-2013** (`six_mois`, fil `stars`) : `en.stars_a_trente.roi` → `en.proprietaire_quarante.janvier` → **fin `statue_de_bronze`** — *L'homme qui savait perdre*.
**Ce que la lignée hérite** : `diplome` ✱, `derogation`, `pacte_gege` ✱, `mbako_vendu` ✱, `vukic_dauphin` ✱, `qualifie_sylvanie`, `sylvanie_adopte`. **Fantôme** : gabarit D2. **Postulat dérivé débloqué** : `le_vautour` (trois limogeages + consultant).

#### Carrière C — Le rat de tribune (31 scènes citées)

**Joueur amateur, 1990-1992** (`village_endette`, fil `copains`) : tutoriel → `am.troisieme_mitemps.comptoir` → `am.car_gerard.nuit` → `am.genou_21.verite` (pose `genou_amateur`, `apres_le_foot`) → Carte Destin `co.destin.am_vers_pa` (Pichon).
*Note* : le brainstorm fait commencer cette carrière comme « capo des ultras », rôle qui n'existe pas dans les huit rôles de la charte. **Décision du chapitre 90** : on entre par le joueur amateur avec `ami_ultras` ✱ posé dès la saison 0 (`am.tuto.bistrot` variante `jp.tifo.local`), ce qui donne la même couleur sans créer un neuvième rôle (§ 9, C-19).
**Président amateur, 1993-2004** (`fusion_imposee` 1996, fil `couleurs`) : `pr.fusion_imposee.a1_lettre` → `pr.fusion.deux_maillots` (pose `couleurs_gardees`) → `pr.buvette_benevoles.tombola` → `pr.gerard_a_fui.cinquieme_carte` (pose `gerard_parti`, `club_sauve`) → `pr.montee.eclairage` ×4 (pose `montee_village`) → Carte Destin `pr.destin.ascension` (Léa : « Vous confirmez ? Le village est en D2 »).
**Président pro, 2005-2016** (`rachete_fonds` en variante socios, fil `kop`) : `pr.rachete_fonds.a1_plaque` → `pr.gege_exige.abonnements` (pose `abonnements_cinq_ecus`) → `pr.commission.couloir` (pose `commission_lettre` ✱) → `pr.coach_vire.sms` → `pr.ligue_fermee` h0-h6 (**debout** : pose `h0_debout`, `retrait_piteux`) → Carte Destin `pr.destin.ligue`.
**Ligue puis Fédération, 2017-2024** : `in.le_congres.campagne` ×4 → **élection perdue contre Vaubourg** → fin `in_congres` — *Battu au Congrès*.
**Retraite en tribune, 2025-2032** : `co.retrouvailles.gege_socio` → `pr.vente_du_club.socios` (pose `club_socios`) → **fin `pa_dernier_derby`** — *Le virage a gagné*.
**Ce que la lignée hérite** : `ami_ultras` ✱, `pacte_gege` ✱, `gerard_parti`, `montee_village`, `h0_debout`, `club_socios`. **Fantôme** : gabarit D3.

### 6.3 Les trente arêtes de transition, et la trace qui les ouvre

| De → Vers | Trace ou condition qui l'ouvre | Carte Destin | Ce que le rôle suivant lit en premier |
|---|---|---|---|
| amateur → pro | `essai_pro` | `co.destin.am_vers_jp` (Barbier) | `rapport_trop_lent`, `essai_rate` |
| amateur → entraîneur amateur | `genou_amateur` ou 34 ans | `co.destin.am_vers_en` (Dédé) | `dede_sifflet` |
| amateur → président amateur | retraite + `bistrot >= 50` | `co.destin.am_vers_pa` (Pichon) | `village_fusionne`, `boite_ouverte` |
| pro → entraîneur | `diplome` ✱ + (âge ≥ 32 ou `genou` ✱) | ∃ `roles.yaml` (Vukić) | `capitaine` ✱, `vestiaire`, `mouton_noir` |
| pro → DS | `capitaine` ✱ + club ≥ 60 + âge ≥ 30 | `co.destin.jp_vers_ds` (Vaubourg) | `agent_fardelli`, `page_trois_lue` |
| pro → président amateur | retraite + tribunes ≥ 50 | `co.destin.jp_vers_pa` (Gérard) | `maison_pays`, `enfant_du_pays` |
| pro → sélectionneur/Fédération | `legende` (`international` ✱ + titre) | `co.destin.jp_vers_selection` (Berthomier) | `international` ✱, `selection_refusee` ✱ |
| adjoint → entraîneur | intérim gagné | `co.destin.adjoint_vers_en` (Vaubourg) | `methodes_ancien`, `interim` |
| entraîneur → sélectionneur | deux saisons tribunes ≥ 60 + titre | `co.destin.en_vers_selection` (Berthomier) | `derby_gagne` ✱, `montee` |
| entraîneur → DS | président ≥ 70, trois saisons | `co.destin.en_vers_ds` (Vaubourg) | `president_ami` ✱ |
| entraîneur → plateau → sélectionneur | limogeage + tribunes > 40, puis Audience > 85 | `co.destin.en_vers_plateau` (Vence) | `plateau_refuse`, `consultant` |
| entraîneur (Sylvanie) → sélectionneur de Sylvanie | `sylvanie_adopte`, deux saisons | `co.destin.en_vers_sylvanie` (le ministre) | `compo_du_ministre`, `dragan_ami` |
| entraîneur → président amateur | `gerard_parti` + tribunes ≥ 55 | `co.destin.en_vers_president_amateur` (Gérard) | `boite_ouverte`, `bas_de_laine` |
| DS → président pro | `president_vend` ou `president_destitue` + tribunes ≥ 55 | `ds.destin.president` (Gégé) | `trente_tenus`, `commission_lettre` ✱ |
| DS → Fédération | Brissac ≥ +2 | `ds.destin.commission` (Brissac) | `algorithme_adopte`, `carnet_barbier` |
| président amateur → district → Ligue → Fédération | Roux ≥ +1, deux saisons par étape | `pr.destin.district` (Roux) | `firmin_dit`, `siege_district` |
| président amateur → président pro | `vars.divisions_montees >= 4` en huit saisons, ou `club_vendu_acteurs` | `pr.destin.ascension` (Léa) | `montee_village`, `club_vendu_acteurs` |
| président pro → Fédération | quatre saisons + trois alliés à +2 | `pr.destin.federation` (élection) | `allie_malbec`, `allie_aulard`, `vote_gros` |
| président pro → Union | Montoya ≥ +2 (« la voie ligue fermée ») | `pr.destin.union` (Montoya) | `ligue_fermee_signee` ✱, `assis_diner` |
| sélectionneur → Union | quart de finale + pays ≥ 60 | `sl.destin.union` (Bambini) | `titre_continental`, `pays_reconquis` |
| sélectionneur → entraîneur de club | toujours, au Bilan | `sl.destin.club` (Malbec) | `mutinerie_matee`, `bus_descendu` |
| sélectionneur → ministre | Aubert ≥ +2 | `sl.destin.ministere` (Aubert) | `aubert_ministre` ✱ → fin `co_ministre` |
| Fédération → Union → FédéMonde | deux mandats + alliés | `in.destin.reelection`, `in.destin.le_parrain` | `reelu`, `promesse_tenue` |
| tout rôle → Porte de sortie | DIRECTION entre 10 et 25, une fois par rôle | `co.destin.porte_de_sortie` | `fuyard` au troisième refus → fin `co_fuyard` |
| transitions forcées (11) | faillite, décès du président, coup d'État, blessure de carrière, suspension, enquête, le vestiaire te porte, le sélectionneur tombe, rachat, l'appel du pays, Gérard a fui | une carte à liseré or + une carte « Le monde réagit » | la trace de l'événement |

### 6.4 Les douze objets héritables, et la règle du seul emplacement

Le Dossier ne tient **qu'un** objet. Douze sont gagnables : le **cahier de Vukić**, le **télégramme de Corven** (1971), le **filet de 1990** (Vecchio), le **seau de Vaz**, la **casquette de Vogler**, le **sifflet de Rouvier**, le **sifflet de Dédé**, le **ballon de Dembo**, l'**écharpe de Paulette**, l'**écharpe de Gégé** (1971), la **table du Doc** (la plaque), la **cassette de 1967** — plus, hors des douze, la **boîte en fer de Gérard**, le **carnet de Barbier**, le **cahier de Brissac** et la **feuille de Josiane**, qui sont des objets de scène et non de Dossier.

**Règle du chapitre 90.** (1) Hors Succession, **le dernier reçu écrase** ; une carte à un bouton le dit (« Tu poses le cahier ; le sifflet part dans le carton »). (2) **À la Succession, l'héritier choisit** parmi les objets gagnés par toute la lignée : c'est la carte `co.lignee.objet` (§ 3.7). (3) Les objets non choisis vont au **Panthéon**, où ils sont visibles et cités par les Fantômes. (4) Un objet donne un `epitaph_plus` et **une seule** variante de scène par rôle — jamais un bonus de jauge.

**Deux sifflets, un seul kiné.** `sifflet_kine` (Rouvier) et `sifflet_dede` (Dédé) peuvent coexister. Réaction à écrire par le chapitre 11 : `en.re.rouvier_deux_sifflets` — « Respire. Encore. Il y a deux sifflets dans ce sac, et un seul kiné. » — un bouton.

---

## 7. La chronologie croisée

### 7.1 Le tableau de bord des six décennies

Pour chaque décennie : ce que le monde fait, qui préside quoi, qui meurt, et ce que la carrière du joueur peut être.

| Décennie | Le monde (Nouvelles datées) | Fédération · Ligue · Union · FédéMonde · Ministère | Ils meurent | Postulats disponibles |
|---|---|---|---|---|
| **1990-1999** | 22 Nouvelles ; francs ; l'arrêt Vaneste (1993) ; le Continental gagné à la maison (1996) ; le but en or (1999) ; les premiers fonds (1999) | Berthomier · « un président », puis Vaubourg 1998 · « le président de l'Union » · Bambini · « le ministre » | Corven (1995-2000) | `promu`, `interimaire`, `pepite`, `fin_de_contrat`, `village_endette` (1991), `lache_academie` (1994), `fusion_imposee` (1996), `retour_croises` (1998), `geant_dechu` (1999) |
| **2000-2009** | 12 Nouvelles ; les écus (2002) ; Médiacrash et le défaut de 2006 ; le Flux (2007) ; Mirevaux professionnelle (2008) ; le fair-play financier (2009) | Berthomier jusqu'en 2008, puis **Vaubourg** · Vaubourg, puis **Malbec 2008** · **Berthomier 2008** · Bambini · **Aubert 2002-2012** | Paulette (2009) | `coupe_du_village` (2000), `bout_du_monde` (2001), `pays_emergent` (2002), `vendre_trente` (2003), `binational` (2004), `heritage_empoisonne` (2005), `six_mois` (2006), `rachete_fonds` (2007), `banc_dore` (2008), `tournoi_desert` (2009) |
| **2010-2019** | 13 Nouvelles ; le club frère (2010) ; la vidéo (2014) ; les 48 équipes (2017) ; la Ligue fermée (2019, 60 heures) | Vaubourg, puis **toi ou Malbec 2016** · Malbec · Berthomier, retraité 2016 · Bambini, retraité 2016 · « le ministre » | Roux (2014) | `coach_intouchable` (2010), `apres_fiasco` (2011), `capitaine_dechu` (2012), `sous_tutelle` (2013), `elu_surprise` (2016), `section_feminine` (2016) |
| **2020-2029** | 14 Nouvelles ; le Mondial d'hiver (2030) ; Kick (2024) ; la grève mondiale (2026) ; l'arbitre algorithmique (2027) ; le milliard (2028) ; la limite d'âge de 75 ans | « le président », puis **Bréhaut 2028** · **Bréhaut**, puis **Ilyas 2028** · toi · « le dauphin » ; **Dauzat SG 2020** | Gérard, Pichon (2019) ; Barbier (2021) ; Rossard (2022) ; Bambini (2024) ; Vaubourg (2026) ; Montoya (2027) ; Berthomier, Sabatier (2029) | tous les ★ débloqués ; les cinq postulats dérivés |
| **2030-2039** | 13 Nouvelles ; les socios reprennent trois clubs (2032) ; l'agence de notation (2033) ; le stade partagé (2035) ; le modèle (2037) | **Bréhaut 2028-2036**, puis **Mbako 2036** · Ilyas · « le président de l'Union » · « le conseil » | Vecchio (2031) ; Fardelli (2032) ; Malbec (2033) ; Dupuis (2034) ; Brissac (2036) ; Vukić (2038) ; Massenet, Amsel, Vaz (2039) | idem ; la carrière est celle d'un « suivant » |
| **2040-2050** | 13 Nouvelles ; la loi des franchises (2040) ; le Mondial à 64 (2046) ; le dernier guichet (2047) ; le district plus plein qu'en 1990 (2049) ; l'écran-bilan du siècle (2050) | Mbako jusqu'en 2044 · la Ligue des franchises · idem · idem | Gégé (2040) ; Josiane, la mère de Mbako (2041) ; Aubert (2043) ; Bréhaut, Dauzat (2044) ; Fauvel (2045) ; Dembo, Colline (2046) ; Vogler (2047) ; Mbako (2049) | idem ; les fins de monde (`co_greve_mondiale`, `pr_franchise`, `monde_fin`) |

### 7.2 Les âges, décennie par décennie

Âge en 1990, puis à chaque changement de décennie. La règle de portrait : gris à 45, lunettes à 55, canne à 75.

| Personnage | 1990 | 2000 | 2010 | 2020 | 2030 | 2040 | 2050 |
|---|---|---|---|---|---|---|---|
| `sacha` | — | 0-10 | 6-20 | 16-30 | 26-40 | 36-50 | 46-60 |
| `mbako` | 16 | 26 | 36 | 46 | 56 | 66 | † 2049 |
| `dembo` | 24 | 34 | 44 | 54 | 64 | 74 | † 2046 |
| `lea` | 25 | 35 | 45 | 55 | 65 | 75 | 85 |
| `fauvel` | 27 | 37 | 47 | 57 | 67 | 77 | † 2045 |
| `rouvier` | 30 | 40 | 50 | 60 | 70 | 80 | 90 |
| `vence`, `camille` | 32 | 42 | 52 | 62 | 72 | (retraite 2035) | — |
| `brehaut`, `solvang` | 33 | 43 | 53 | 63 | 73 | 83 | † 2044 |
| `nassir`, `colline` | 34 | 44 | 54 | 64 | 74 | 84 | † 2046 |
| `la_plume` | 36 | 46 | 56 | 66 | 76 | 86 | 96 |
| `vukic` | 37 | 47 | 57 | 67 | 77 | † 2038 | — |
| `klopf` | 38 | 48 | 58 | 68 | 78 | 88 | † 2038 |
| `mere_mbako` | 39 | 49 | 59 | 69 | 79 | 89 | † 2041 |
| `vecchio` | 41 | 51 | 61 | 71 | 81 | † 2031 | — |
| `meneche` | 42 | 52 | 62 | 72 | 82 | † 2032 | — |
| `fardelli`, `dauzat` | 44 | 54 | 64 | 74 | 84 | † 2032 / † 2036 | — |
| `loco`, `vialat` | 45 | 55 | 65 | 75 | 85 | † 2032 / † 2032 | — |
| `aubert` | 46 | 56 | 66 | 76 | 86 | † 2035 | — |
| `gege`, `amsel` | 47 | 57 | 67 | 77 | 87 | † 2032 / † 2030 | — |
| `brissac` | 49 | 59 | 69 | 79 | 89 | † 2028 | — |
| `dupuis` | 50 | 60 | 70 | 80 | 90 | † 2026 | — |
| `sabatier` | 51 | 61 | 71 | 81 | † 2029 | — | — |
| `josiane`, `dede`, `rossard` | 52 | 62 | 72 | 82 | 92 | † 2030 / † 2012 / † 2022 | — |
| `malbec` | 54 | 64 | 74 | 84 | 94 | † 2024 | — |
| `pichon` | 56 | 66 | 76 | † 2019 | — | — | — |
| `aulard`, `bambini`, `barbier` | 58 | 68 | 78 | 88 | † 2020 / † 2024 / † 2021 | — | — |
| `montoya` | 60 | 70 | 80 | 90 | † 2021 | — | — |
| `clow`, `gerard` | 61 | † 1995-2000 / 71 | — / 81 | — / † 2019 | — | — | — |
| `legruet` | 63 | 73 | 83 | 93 | † 2020 | — | — |
| `roux` | 66 | 76 | 86 | † 2014 | — | — | — |
| `paulette` | 71 | 81 | † 2009 | — | — | — | — |

**Ce que ce tableau apprend, et ce qui a été corrigé** : l'âge moyen au décès des quarante-deux était de **quatre-vingt-dix ans**, sans qu'une seule de ces morts soit présentée comme extraordinaire. Treize décès ont été remontés (C-09, appliqué) : Berthomier 2020 (93), Josiane 2030 (92), Malbec 2024 (88), Aubert 2035 (91), Dauzat 2036 (90), Gégé 2032 (89 : l'année de son élection aux socios, ce qui est mieux), Amsel 2030 (87), Brissac 2028 (87), Vogler 2038 (86), Vaz 2032 (87), Vialat 2032 (87), Dupuis 2026 (86), Massenet 2032 (84), plus Vaubourg 2020 (88) et Montoya 2021 (91, la blague assumée : il meurt à la table pendant un vote qu'il gagnait). Les grands âges restent là où c'est la blague : **Paulette 90, Vecchio 82, Roux 90, Rouvier vivante à 90 en 2050**. Les fenêtres d'activité, elles, se ferment toutes à soixante-quinze ans, sauf déclaration contraire dans la fiche (charte § 2.1.4).

**Ce qu'il apprend d'utile aussi** : les décès sont **groupés** — après correction, dix-sept des trente-trois tombent entre 2020 et 2038, et le reste s'étale jusqu'en 2049. Les carrières de la cinquième et de la sixième décennie sont donc des carrières d'enterrements, ce qui est le bon ton pour la fin du jeu (l'Almanach, le Panthéon, l'écran-bilan du siècle) à condition d'en espacer trois ou quatre. Les quarante-deux lignes d'enterrement sont écrites au chapitre 31 § 9.

### 7.3 Les fenêtres et les collisions à surveiller

Onze pièges de fenêtre relevés dans les onze chapitres. Le lint doit les attraper : **un locuteur hors fenêtre est un bug de continuité, pas une licence poétique**.

| Personnage | Fenêtre | Chapitres qui le font parler hors fenêtre | Correction |
|---|---|---|---|
| `sabatier` | jusqu'en 2011 | 14 (`sl.la_liste`, `sl.blessure_avant` après 2011) | remplacer par « la docteure Ferrand » ou par Rouvier |
| `rouvier` (Cobalts) | 2002-2014 | 10 (`banc_dore` 2008 : elle est « en stage » au désert) | accepter le stage, ou remplacer par « le kiné du club acheteur » |
| `josiane` (club) | jusqu'en 2008 | 11, 12, 13 après 2008 | « la petite Josiane » à partir de 2008 |
| `barbier` | jusqu'en 2006 | 11 (`section_feminine`, 2016 : « je l'ai vue jouer sous la pluie ») | accepté : il est bénévole à Trébignac et vient voir, la fiche 02 l'autorise |
| `aulard` (club) | 1990-1998 | 12 (`vendre_trente`, 2003) | « le fils préside, le père téléphone » (ch. 12), à valider |
| `legruet` (Fédération) | 1988-2008 | 14 (`apres_fiasco`, 2011), 15 (`heritage_empoisonne`, 2005) | voir C-06 et C-07 |
| `brissac` (DTN) | 1988-2010 | 14 après 2010 | « Castan, DTN 2010-2030 » |
| `dede` | jusqu'en 2012 | 13, 30 après 2012 | Bébert, son fils |
| `paulette` | jusqu'en 2009 | 13, 20, 30 après 2009 | la petite Paulette, place 14C |
| `vecchio` | jusqu'en 2031 | 10 (tutoriel 1990 à Trébignac) | voir C-10 |
| `gerard` | 1990-2019 | 13 (`pr.gerard_a_fui` après 2004 sans repentir) | `gerard_mer` / `gerard_revenu` conditionne |

---

## 8. Les objectifs cachés et leurs indices

### 8.1 Le mécanisme

Trois objectifs par postulat, soixante-trois en tout (vingt et un postulats). Ils ne sont **jamais affichés** ; ils apparaissent au Cimetière, découverts, avec leur plaque. Chacun a **un indice**, prononcé une fois par un personnage, sans qu'on sache que c'en est un — c'est la seule façon honnête de faire deviner sans dire. L'indice est une réplique existante, jamais une carte de plus.

**Les trois familles.** (a) *L'objectif de fidélité* — rester, tenir, ne pas trahir ; il se rate en une carte. (b) *L'objectif de virtuosité* — réussir deux choses incompatibles ; il demande un fil rouge précis. (c) *L'objectif de sortie* — finir d'une certaine façon ; il se joue à la dernière carte.

### 8.2 Les soixante-trois, par postulat

| Postulat | Objectif | Condition | L'indice, et qui le dit |
|---|---|---|---|
| `village_endette` | `village_detecte_avant` | `essai_pro && !village_fusionne` | Barbier : « Je l'ai vu jouer sous la pluie » (avant la fusion) |
| | `village_copains_gardes` | `copains_gardes && saisons >= 2` | Momo : « Le nouveau porte les ballons. Toi tu es plus le nouveau. » |
| | `village_boulot_tenu` | `!patron_furieux && saisons >= 2` | ton patron : « Lundi, huit heures. On est d'accord ? » |
| `lache_academie` | `academie_sans_fardelli` | `sans_agent && essai_pro` | Dédé : « Bon, on va pas se mentir : un agent, ça se paie. » |
| | `academie_revanche` | `revanche_valdorne && but_dorne` | Barbier : « Valdorne relit ses rapports une fois par an. » |
| | `academie_vestiaire` | `sac_porte && fidele` | les vieux du vestiaire : « Le sac, c'est pour le nouveau. » |
| `pepite` | `pepite_destination` | `destination_choisie` | Fardelli : « Mon ami, on parle d'argent ou de destination ? » |
| | `pepite_enfant_du_club` | `enfant_du_pays && !vendu_d1` | Gégé : « La tribune n'oublie rien, surtout pas ceux qui restent. » |
| | `pepite_brassard_22` | `capitaine && age <= 22` | Bréhaut : « Le groupe vit bien. Il vivrait mieux avec un patron jeune. » |
| `fin_de_contrat` | `fin_saison_entiere` | `finit_saison && prolonge` | Vecchio : « J'en ai vu d'autres partir en janvier. » |
| | `fin_passeur` | `place_au_jeune && vestiaire >= 60` | Vukić : « Je te le dis : le petit te regarde t'échauffer. » |
| | `fin_debout` | `quinzieme_jouee && !genou_grave` | Sabatier : « Quatorze croix au calendrier. Il en reste une. » |
| `retour_croises` | `croises_vingt` | `vingt_redemande` | Rouvier : « Respire. Encore. Le vingt, c'est une idée, pas un genou. » |
| | `croises_sans_piqure` | `!infiltre && derby_joue` | Sabatier : « Ça reste entre la table et moi, et la table préfère non. » |
| | `croises_rejoues` | `croises_rejoues && saisons >= 3` | Gégé : « Le virage a compté les mois. » |
| `binational` | `binational_mondial` | `international && joue_contre_kambara` | ta mère, au téléphone : « Ils regarderont, ici aussi. » |
| | `binational_deux_stades` | `chant_club && mere_tribune` | Brissac : « Les chiffres sont têtus. Les hymnes aussi. » |
| | `binational_mere` | `mot_pour_mere` | Léa : « Vous confirmez ? Pour qui, la phrase ? » |
| `banc_dore` | `banc_dore_retour` | `banc_dore_retour && video_europe` | Ilyas : « Ce n'est pas un club, c'est un actif ; les actifs reviennent. » |
| | `banc_dore_titre` | titre au désert + `veut_jouer` | le capitaine d'Al-Dorado : « Ici, on gagne climatisé. » |
| | `banc_dore_camille` | `camille_reste && !divorce` | Camille : « Tu rentres à quelle heure ? Il fait nuit à trois heures ici. » |
| `capitaine_dechu` | `geant_remonte` | `geant_remonte` | Vialat : « Je ne juge pas. Je compte. Il vous manque sept points. » |
| | `geant_brassard_garde` | `brassard_garde_dechu && septieme_remontee` | Bréhaut : « Le groupe vit bien quand le brassard ne bouge pas. » |
| | `geant_jeunes` | `jeunes_lances && primes_renoncees` | Sacha : « Tu m'as promis qu'on resterait. » |
| `promu` | `promu_banc_gigi` | `finale_gigi && gigi_staff` | Vecchio : « J'en ai vu d'autres. Une de plus, coach. » |
| | `promu_deux_maintiens` | deux maintiens de suite | Vaubourg : « J'ai pas le temps, j'ai un empire ; toi, tu as deux ans. » |
| | `promu_a_lancienne` | `club_a_lancienne` | Gégé : « La tribune n'oublie rien, et elle n'aime pas les boissons. » |
| `interimaire` | `interim_garder_poste` | `cdi_signe` | Josiane : « J'en ai vu passer. Trois matchs, c'est court. » |
| | `interim_sans_papier` | `!diplome && cdi_signe` | Berthomier : « Il manque une signature. On verra ça après le Congrès. » |
| | `interim_adjoint_fidele` | `vukic_fidele && !vukic_dauphin` | Vukić : « Je te le dis parce que personne ne te le dira. » |
| `bout_du_monde` | `bdm_adopte` | `sylvanie_adopte` | le ministre : « L'expatrié est adopté. On dit ça, ici. » |
| | `bdm_paye_a_lheure` | `!salaires_sylvanie` deux saisons | Milena : « Le ministère a un décalage. Toujours le même. » |
| | `bdm_compo_a_moi` | `compo_refusee` ×2 | Dragan : « Six coachs, six compos. La vôtre est de vous ? » |
| `six_mois` | `sm_titre` | titre en une saison | Ilyas : « Six mois, c'est une ligne de bilan, pas une saison. » |
| | `sm_stars_matees` | `stars_matees` | Dembo : « Donne-moi le ballon, je m'occupe du reste. » |
| | `sm_seau` | `seau_dans_le_placard` | Vaz : « Regardez la cassette. Celle de soixante-sept. » |
| `section_feminine` | `sf_pro` | `mirevaux_pro && saisons >= 2` | Brissac : « Un budget de buvette, deux saisons. Puis un vrai. » |
| | `sf_cameras` | `cameras_venues` | Vence : « On est en direct. En demi-finale, en tout cas. » |
| | `sf_emploi` | `emploi_garde && saisons >= 2` | Inès : « Je travaille de nuit. Le foot, c'est le jour. » |
| `vendre_trente` | `vendre_trente_deux_ans` | `trente_tenus` ×2 | Vaubourg : « La page deux, tu l'as lue ? Moi je l'ai écrite. » |
| | `vendre_trente_le_petit_reste` | `trente_tenus && petit_garde` | Barbier : « Je l'ai vu jouer sous la pluie. Lui, gardez-le. » |
| | `vendre_trente_sans_fardelli` | `trente_tenus && !commission_occulte` | Solvang : « Mon client décide. Moi, je compte. » |
| `coach_intouchable` | `intouchable_trois_saisons` | trois saisons en poste | Ilyas : « Le fusible, c'est vous. Les fusibles durent peu. » |
| | `intouchable_titre_cassette` | titre + `cassette_recue` | Vaz : « Regardez la cassette. Vous verrez le titre dedans. » |
| | `intouchable_seau_range` | `seau_range` | la petite Josiane : « Il y a un seau dans le placard du fond. » |
| `fusion_imposee` | `fusion_couleurs` | `couleurs_gardees` | Gérard : « Ici, on payait en bières, et on jouait en marron. » |
| | `fusion_mairie_amie` | `aubert_soutien && !mairie_perdue` | Aubert : « Le stade, c'est de l'argent public. Le nom aussi. » |
| | `fusion_gamins` | `vestiaires_melanges && ecole_separee == false` | Dédé : « On va pas se mentir : les gamins s'en fichent, du nom. » |
| `coupe_du_village` | `coupe_chez_nous` | `poucet_chez_nous && poucet_legende` | Pichon : « Le pain, c'est à cinq heures ; le tirage, à midi. » |
| | `coupe_gigi_dernier` | `vecchio_promis && gigi_trebignac` | Vecchio : « J'en ai vu d'autres. Pas Capitale FC. » |
| | `coupe_apres` | `recette_apres && successeur_cherche` | Gérard : « La boîte, elle sert à l'année d'après. » |
| `geant_dechu` | `geant_sans_lettre` | `!commission_lettre` deux saisons | Vialat : « Je ne juge pas. Je compte. Deux fois. » |
| | `geant_mot_tenu` | `mot_janvier && local_renove` | Gégé : « La tribune n'oublie rien, surtout pas janvier. » |
| | `geant_remonte_propre` | remontée + `!star_vendue_fpf` | Bréhaut : « Le groupe vit bien quand il reste le même. » |
| `rachete_fonds` | `fonds_titre_kop` | titre + `banderoles_libres` | Gégé : « Le titre, on le prendra. La bâche, on la garde. » |
| | `fonds_plaque_jamais_dite` | `plaque_attend` | Ilyas : « Ce n'est pas un club, c'est un actif. La plaque attend. » |
| | `fonds_visage_debout` | `visage_fonds && !figurant` | Josiane : « J'en ai vu passer, des visages. » |
| `pays_emergent` | `sylvanie_liste_a_moi` | `liste_a_moi` | le ministre : « La liste de mars est sur votre bureau. » |
| | `sylvanie_premiere` | `qualifie_sylvanie` | Dragan : « Six coachs. Zéro qualification. » |
| | `sylvanie_deux_escales` | `vol_de_ligne && qualifie_sylvanie` | Milena : « Deux escales et un bus. C'est le tarif. » |
| `apres_fiasco` | `fiasco_le_bus_descend` | `bus_descendu` | Fauvel : « On est un groupe, pas une liste. » |
| | `fiasco_un_brassard` | `capitaine_choisi` une seule fois | Rossard : « Moi, à votre place, je l'aurais changé deux fois. » |
| | `fiasco_pays_reconquis` | `pays_reconquis` | Vence : « On est en direct. Le pays regarde encore, figurez-vous. » |
| `heritage_empoisonne` | `heritage_tiroirs` | `tiroirs_ouverts && !pacte_aulard` | Amsel : « Nous avons tout notre temps. Vous, moins. » |
| | `heritage_firmin` | `firmin_dit` | Roux : « Le district, c'est la base. Firmin, c'est mon prénom. » |
| | `heritage_reelu` | `reelu` | Berthomier : « On verra ça après le Congrès. » |
| `sous_tutelle` | `tutelle_levee` | `suspension_levee` | le ministre : « L'arrêté est signé. Il se dé-signe aussi. » |
| | `tutelle_comite_libre` | `comite_elu && !comite_du_ministere` | Dauzat : « C'est dans le procès-verbal. Le vrai. » |
| | `tutelle_mondial_joue` | `match_en_blanc == false` | Fauvel : « On est un groupe. Même sans maillot. » |
| `tournoi_desert` | `desert_parole` | `dossier_ostrelie_lu && !vote_achete` | Bambini : « Le football unit le monde. Et mes amis. » |
| | `desert_douze_assis` | `assis_diner && !ligue_fermee_signee` | Montoya : « Quatorze clubs. Une table. Vous êtes assis ou debout ? » |
| | `desert_sans_scandale` | `!perquisition` deux mandats | Amsel : « Nous avons tout notre temps. » |
| `elu_surprise` | `surprise_dauzat_reste` | `dauzat_garde` | Dauzat : « C'est dans le procès-verbal. Je le garde. » |
| | `surprise_sponsor_propre` | `sponsor_banque \|\| sponsor_ballon` | Josiane : « J'en ai vu passer, des sponsors. Trois ont payé. » |
| | `surprise_reelu` | `reelu` | Bambini : « Je suis choqué. Sincèrement choqué. » |

**Trois règles d'objectif.** (1) Un objectif au moins par postulat demande **un fil rouge précis** (§ 5) : `promu_a_lancienne` est presque impossible avec le fil `argent`. (2) Un objectif au moins se **rate en une carte** : c'est ce qui donne le regret. (3) Aucun objectif ne demande une jauge maximale — les jauges pleines tuent.

---

## 9. Les contradictions — **toutes tranchées**

**État après la passe de correction** : les vingt-six contradictions sont **tranchées**. Vingt-quatre sont **appliquées dans les chapitres** (la ligne *Appliqué* dit quoi, et où) ; **C-18** et **C-25** sont marquées RÉSOLU et RETIRÉ dans leur titre ; **C-20** est entérinée mais son dernier tiers vit hors de `docs/bible/` (la spec) et part au chantier données avec les autres commandes de la charte § 5.3. Ce qui reste à faire n'est plus une décision : c'est de la copie dans `content/`.

Vingt-six contradictions relevées entre les chapitres 00 à 31 et `content/`. Elles sont classées par gravité : **bloquante** (le build casse ou une scène ment), **de continuité** (un fait du monde change d'un chapitre à l'autre), **de convention** (deux façons d'écrire la même chose). Chacune reçoit une proposition ; le chapitre 90 ne corrige aucun chapitre lui-même.

### 9.1 Bloquantes

**C-01 · Sept ids définis deux fois, avec deux contenus différents.** — *bloquante*
Le chapitre 30 a réécrit six retrouvailles que le chapitre 01 avait déjà écrites, et le chapitre 10 a réécrit une scène du chapitre 01.

| id | Chapitre 01 | Chapitre 30 (ou 10) |
|---|---|---|
| `co.retrouvailles.clow_fantome` | *Le buste* — au Panthéon, la voix vient de ta mémoire | *Le fantôme du mentor* — silhouette au bord du terrain |
| `co.retrouvailles.dede_enterrement` | *Terrain Dédé* — Bébert, son fils, le sifflet orange | *On enterre le sifflet* — Pichon, devant l'église |
| `co.retrouvailles.dembo_corbeaux` | *Les ardoises* — **2046, Dembo est mort** | *Il entraîne les Corbeaux* — **2020, Dembo est vivant** |
| `co.retrouvailles.gerard_carte_postale` | *Le double fond* — 2019, Marinette, il est mort | *Une carte postale* — il est parti au soleil |
| `co.retrouvailles.paulette_place_vide` | *La 14B* — la petite Paulette, une orange | version courte du chapitre 30 |
| `co.retrouvailles.camille_telephone` | *Sacha a dix-sept ans* — la lettre de 1989 | *Le téléphone du dimanche* |
| `jp.dembo.penalty` (01) / `jp.dembo.penalty` (10) | *Le penalty, le yacht* — Dembo parle, S0 | *Deux qui veulent* — Bréhaut parle, 88e minute |

*Appliqué* : le chapitre 01 fait foi (il est propriétaire de l'espace `co.<personnage>.*`). Les six versions du chapitre 30 sont renommées **`co.retrouvailles.clow_bord_de_terrain`, `dede_eglise`, `dembo_ardoises_2020`, `gerard_soleil`, `paulette_14b_court`, `camille_dimanche`** ; celle du chapitre 10 devient **`jp.dembo.penalty_deux`**. Le fait est tranché : **Dembo entraîne Corbelin de 2020 à sa mort en 2046**, les deux scènes sont bonnes, elles ont maintenant deux noms.

**C-02 · Le format des retrouvailles diverge entre trois chapitres.** — *bloquante*
Le chapitre 01 écrit des scènes complètes à deux boutons, le chapitre 02 des répliques à un bouton (gabarit § 4.2), le chapitre 30 vingt-deux scènes à deux boutons. Le moteur enfile la carte sans prévenir : deux boutons y sont un choix hors contexte.
*Appliqué* : charte § 4.2, règle des retrouvailles. Les quatre-vingt-quatre répliques `_sourire` / `_noir` sont **à un bouton** (deux sorties identiques) ; les trente-huit du chapitre 01 ont été converties. Les scènes riches restent des cartes à deux boutons, servies par le réservoir, et gardent leur id. Le champ `retrouvailles:` de `characters.yaml` garde ses deux ids : **aucun changement moteur**.

**C-03 · Un troisième id de retrouvailles n'existe pas dans la spec.** — *bloquante*
Vingt-sept troisièmes retrouvailles sont écrites ; `characters.yaml` n'accepte que `{sourire, noir}` et le moteur n'en enfile que deux.
*Appliqué* : les vingt-sept « troisièmes retrouvailles » sont déclarées **cartes propres `once` du réservoir**, conditionnées par `statut_ok:` et par l'année (charte § 4.2). Elles gardent leur id en `co.retrouvailles.*` pour ne rien casser. Rien à changer au moteur ni à `characters.yaml`.

**C-04 · Le statut `mort` n'existe pas.** — *bloquante*
Quatorze scènes lisent `chars.<id>.statut == 'mort'` ; la spec connaît `club`, `vendu`, `staff`, `parti`, `retraite`, `rival`.
*Appliqué* : le statut `mort` est **créé** à la charte § 2.4 bis, avec ses trois règles (plus de locuteur sauf Fantôme, enterrement ou porte-parole nommé ; relation gelée, lue au passé, `+1 (posthume)` possible ; trace `<id>_mort` de portée monde, qui arme la ligne d'enterrement du ch. 31 § 9). Et surtout, le **repli est écrit dans les scènes elles-mêmes**, pas seulement ici : les quatorze conditions sont devenues `chars.<id>.statut == 'mort' || (chars.<id>.statut == 'parti' && flag('<id>_mort'))`, ce qui marche dans les deux hypothèses de moteur et débloque le chantier données sans attendre l'arbitrage.

**C-05 · 394 manchettes citées et jamais écrites.** — *bloquante* (le lint de build échoue)
Les lignes « Lu plus tard par » des scènes citent 702 ids `une.*` ; 290 seulement sont définies. Répartition des manquantes : ch. 13 (128), ch. 02 (127), ch. 20 (42), ch. 11 et 14 (30 chacun), ch. 15 (25). Le chapitre 02 annonce lui-même « ~150 manchettes demandées au ch. 20 » ; le chapitre 20 en a écrit 106, dont aucune sur les traces du chapitre 02.
*Appliqué, en deux passes*. **(1)** Le chantier données **supprime des lignes « Lu plus tard par » toute `une.*` non écrite** et la remplace par `une.generic.*`, déclaré secours pour tous les rôles (charte § 4.10 et § 5.3 g) — un lecteur imaginaire n'est pas un lecteur. **(2)** Le chapitre 20 a livré sa **seconde passe de cent vingt-deux manchettes** (§ 2.6), dans l'ordre demandé : les trente-huit traces orphelines du chapitre 02, vingt-huit du chapitre 13 (dont les **sept branches « non » de la chaîne des soixante heures**, qui étaient le trou le plus visible de la bible), les quarante des quatre postulats de seconde vague, et seize d'état. Le chapitre 20 en écrit désormais **deux cent vingt-huit**.

**C-06 · `heritage_empoisonne` (2005) contredit la table des mandats.** — *bloquante* (le monde ment)
Le postulat dit « ton prédécesseur est parti pour corruption » et place le joueur à la tête de la Fédération en **2005**. La charte § 1.5, la fiche Berthomier (ch. 02) et la table des mandats disent que Berthomier préside la Fédération **jusqu'en 2008** et la quitte **pour l'Union**, élu de neuf voix, sans scandale. Le chapitre 15 déclare la divergence sans la résoudre (« Berthomier à l'Union en 2007 et non 2008 »).
*Proposition, par ordre de préférence* : **(a)** déplacer le postulat en **2008** — l'année où la case se libère réellement, où Vaubourg prend la Fédération dans le monde par défaut et où le joueur peut la prendre à sa place ; le « prédécesseur parti pour corruption » devient « le prédécesseur est parti à l'Union en laissant quatre tiroirs et trois clés », ce qui est plus fusible et plus drôle. **(b)** Garder 2005 et faire tomber Berthomier en 2005 dans **toutes** les tables (charte § 1.5, ch. 02, ch. 14) — coûteux : Berthomier est la mécanique de nomination du sélectionneur jusqu'en 2008. **(c)** Garder 2005 en déclarant que `heritage_empoisonne` est un **monde alternatif de postulat** ; à éviter, c'est la porte ouverte à tout.

**C-07 · `apres_fiasco` (2011) et `sous_tutelle` (2013) contredisent la présidence de Vaubourg.** — *bloquante*
La charte § 2.4 donne Berthomier comme patron du sélectionneur ; en 2011, Berthomier est à l'Union et **Vaubourg préside la Fédération** (2008-2016). Le chapitre 14 écrit Berthomier en base et Vaubourg en variante. `sous_tutelle` place le joueur à la Fédération en 2013, alors qu'Vaubourg y est réélu en 2012.
*Appliqué* : charte § 0.5 du chapitre 14 — **Berthomier jusqu'en juin 2008, Vaubourg de 2008 à 2016, « le président » (voix) ensuite** ; après 2008, Vaubourg est en base et Berthomier en variante de visiteur (« il vient au Congrès et il a un avis »). Pour `sous_tutelle`, la fiche écrit noir sur blanc que le postulat s'ouvre sur **la dissolution du comité de Vaubourg par le ministre** et que le joueur **est** le comité provisoire.

**C-08 · Rossard est un quarante-deuxième personnage non prévu.** — *bloquante pour `characters.yaml`*
Créé par le chapitre 02 (sélectionneur des Cobalts 1986-1994, consultant 1995-2015, meurt 2022), utilisé par 14 (`sl.consultant_savonne`), 15 (comme voix sans portrait !) et 30 (paliers `co.rossard.*`, retrouvailles). Absent de la charte § 2.3. Le chapitre 15 le traite en voix sans portrait, le chapitre 02 en personnage à statut : les deux ne peuvent pas être vrais.
*Appliqué* : Rossard est validé comme **quarante-deuxième personnage à statut** et ajouté à la charte § 2.3 (id `rossard`, m, 52 en 1990, camp `selection` puis bande `direction` dès 1995, tic « Moi, à votre place, je l'aurais fait. », meurt en 2022). Sans lui la sélection n'a pas de passé avant 1994 et le chapitre 14 perd son antagoniste de plateau.

### 9.2 De continuité

**C-09 · Trente-trois personnages meurent, à quatre-vingt-dix ans de moyenne.** — *continuité*
Josiane 103, Berthomier 102, Aubert 99, Dauzat 98, Malbec 97, Gégé 97, Montoya 97, Amsel 96, Brissac 95, Vogler 95, Vaubourg 94, Dupuis 94, Vaz 94, Bambini 92, Massenet 91, Sabatier 90, Paulette 90, Roux 90, Gérard 90, la mère de Mbako 90, Rouvier vivante à 90 en 2050. Aucune n'est présentée comme un exploit ; le monde devient invraisemblable exactement là où il devrait être mélancolique.
*Appliqué* : treize décès remontés sans toucher aux scènes, seulement à l'année (Berthomier 2020, Josiane 2030, Malbec 2024, Aubert 2035, Dauzat 2036, Gégé 2032, Amsel 2030, Brissac 2028, Vogler 2038, Vaz 2032, Vialat 2032, Dupuis 2026, Massenet 2032), plus Vaubourg 2020 et Montoya 2021. Les grands âges restent là où c'est la blague, et **toute fenêtre d'activité se ferme à soixante-quinze ans sauf déclaration** (charte § 2.1.4) : Vialat 2020, Vaz 2010, Roux 2002, Malbec 2012, Aubert 2022, Dauzat 2024, Brissac 2020, Vogler 2027.

**C-10 · Vecchio est à Trébignac en 1990 dans le tutoriel, et au club pro jusqu'en 1999 partout ailleurs.** — *continuité*
Le tutoriel du chapitre 10 le fait jouer l'amical de rentrée de Trébignac « tous les ans depuis 1988 » à quarante et un ans ; la charte § 2.2 et la fiche 01 le mettent gardien de `{club}` jusqu'en 1995, entraîneur des gardiens jusqu'en 2010, et **gardien de Trébignac à cinquante ans (2000-2002)**.
*Appliqué* : les deux vies de Vecchio sont **exclusives par la trace** — avec `gigi_staff`, entraîneur des gardiens 1995-2010 puis buvette dès 2010 ; sans `gigi_staff`, **gardien de Trébignac à cinquante ans (1999-2001)** puis buvette dès 2002. Le tutoriel est un prologue hors chronologie (« un amical de rentrée, un samedi »), et la mention de 2006 du chapitre 11 porte la condition.

**C-11 · Mirevaux devient professionnelle trois fois : 2008, 2010 et 2016.** — *continuité*
Charte § 1.1 et § 1.3 : « la première section féminine professionnelle (Mirevaux, 2008) », confirmé par la Nouvelle `co.nv.2008_mirevaux` (ch. 20, pose `monde_feminines`). Fiche Brissac (ch. 01) : « présidente de l'AS Mirevaux depuis 2010 (la section est professionnelle depuis 2008 ; en 2016 elle entre dans le premier championnat professionnel à huit clubs) jusqu'en 2020 ». Postulat `section_feminine` (charte § 3.2 et ch. 11) : « Section féminine, **année un**, 2016 · Mirevaux », « première saison professionnelle ».
*Appliqué* : **2008** = la professionnalisation de la section de Mirevaux (la Nouvelle `co.nv.2008_mirevaux`, le drapeau `monde_feminines`). **2016** = l'année un du **championnat professionnel à huit clubs**, ce que le postulat raconte réellement : il s'appelle désormais « Championnat professionnel, année un ». La fiche Brissac dit « présidente depuis 2010, la section est professionnelle depuis 2008 ».

**C-12 · Barbier a raté Vecchio à dix-sept ans « en 1979 » ; Vecchio avait dix-sept ans en 1966.** — *continuité*
Charte § 2.3, blessure de Barbier : « celui qu'il a raté (un gardien de Néville qui avait dix-sept ans en 1979 : Gigi Vecchio, dit la légende) ». Vecchio a quarante et un ans en 1990, donc dix-sept ans en 1966. Le chapitre 12 reprend l'erreur (« carnet de Barbier, dernière page : un gardien de Néville »).
*Appliqué* : **1966** partout. Barbier a trente-quatre ans quand il rate Vecchio : c'est le début de sa carrière et non le milieu, ce qui fait de ce raté sa blessure fondatrice, et Vecchio a attendu vingt-quatre ans que quelqu'un vienne en doudoune.

**C-13 · `gerard_parti` est lu sept fois et posé par personne dans `content/`.** — *continuité et build*
La carte existante `en.evt.gerard` ne pose aucun drapeau ; les chapitres 01 (`pr.gerard.trahison_caisse`) et 13 (`pr.gerard_a_fui`) posent `gerard_parti`, et neuf scènes le lisent. Une carrière d'entraîneur qui joue la carte existante n'arme donc rien.
*Appliqué* (commande au chantier données, charte § 5.3 d et h) : `set: [gerard_parti]` sur les **deux** sorties de `en.evt.gerard` ; `exclusive_with` entre `pr.gerard.trahison_caisse` (ch. 01) et `pr.gerard_a_fui` (ch. 13) ; et le pays réel nommé dans le texte de la carte existante remplacé par « **au soleil** », pour que le monde soit fictif sans exception.

**C-14 · `jp.famille.naissance` ne pose pas `sacha_nee`.** — *continuité et build*
La carte existante pose `jeune_papa` ; `sacha_nee` est lue par cinquante-deux endroits dans huit chapitres. Un joueur pro qui a un enfant n'a donc pas Sacha.
*Appliqué* (commande au chantier données, charte § 5.3 d) : `set: [sacha_nee]` sur les **deux** sorties de `jp.famille.naissance`, et `jeune_papa` renommé **`jeune_parent`** dans `flags.yaml` — le personnage joué peut être une femme.

**C-15 · Pichon préside deux clubs à la fois.** — *continuité*
La charte § 2.3 en fait le président du FC Trébignac (1985-2000) ; le chapitre 10 le met président de Boisnoir dans `village_endette` (« en attendant »).
*Appliqué* : dans `village_endette`, le président du village est **une voix sans portrait** (« le président », en bleu de travail). Pichon reste à Trébignac, où il a sa boulangerie et son tutoriel. Coût nul : il n'avait que deux répliques dans ce postulat.

**C-16 · Le chapitre 20 a écrit les Nouvelles datées que la charte attribue au chapitre 31.** — *continuité de plan*
La charte § 5.1 confie à 31 « les Nouvelles datées 2001-2050 » ; le chapitre 20 en a écrit quatre-vingt-sept, de 1990 à 2050, et le chapitre 31 trois seulement (celles que 12 et 14 lui commandaient). Aucune collision d'id : les deux ensembles sont disjoints.
*Appliqué* : la charte § 5.1 est corrigée. Le chapitre 20 est **propriétaire** des `co.nv.<annee>_*` et des `monde_*` (les 88 Nouvelles de 1990 à 2050) ; le chapitre 31 garde et a livré les Nouvelles « à côté » (`co.nouvelle.fd_*`), les anecdotes, les gags, les **douze cartes-légendes** (§ 10), **L'Almanach du Ballon** (§ 11) et les **quarante-deux lignes d'enterrement** (§ 9, Rossard compris). Le C-16 ne certifie plus un livrable absent : il est écrit.

**C-17 · Le chapitre 30 n'a pas écrit trois fins que le chapitre 15 lui a commandées, et en a renommé quatre.** — *continuité et build*
Commandées par 15 : `in_extrade` (citée dans `in.valises.six_heures` par un `end:`), `in_integre_chomage` (citée par un `end:`), `in_memoires`, `co_ministre`. Écrites par 30 : `in_radiation` ✓, mais `co_ministre` au lieu de `co_ministre`, et rien pour les trois autres. Commandées par 14 : `sl_mariage`, `co_cheque`, `co_ministre`, `sl_verre_de_vin`, `sl_non_qualification` ; écrites par 30 : `sl_mariage`, `co_cheque`, `co_ministre`, `sl_verre_de_vin`, `sl_non_qualification`. Le chapitre 13 annonce `pr_demission` dans ses nouveautés et le cite dans un `end:` sans écrire la plaque.
*Appliqué* : le chapitre 30 a écrit **`in_extrade`, `in_integre_chomage` et `in_memoires`** (§ 5.4 bis) ; le chapitre 13 a écrit la plaque **`pr_demission`** (§ 11.3). Les renommages en `co_*` sont entérinés (`sl_mariage`, `co_cheque`, `co_ministre` : ces fins sont atteignables par plusieurs rôles) et les citations des chapitres 14 et 15 sont à jour. La fin universelle « Battu au Congrès » porte l'id **`in_congres`** ; `battu_congres` et `battu_au_congres` sont morts.

**C-18 · RÉSOLU — l'index annonçait quatre-vingt-onze plaques et en additionnait cent quinze.** — *continuité*
Le tableau du chapitre 30 § 5.1 additionne 64 + 14 + 7 + 7 + 5 + 6 + (4 ∃ + 4) + 4 = **115**, sous un titre qui dit quatre-vingt-onze. `content/endings.yaml` contient vingt-cinq ids, dont trois universels (`grand_deballage`, `jubile`, `generique`) : la charte parle de « vingt-trois existantes ».
*Appliqué* : le chapitre 30 § 5.1 s'intitule désormais « L'index des cent douze plaques », affiche « Fins découvertes 17 / 112 », marque les trois doublons dans le tableau et ajoute une ligne de total ; la charte § 5.3 j commande le même chiffre à `endings.yaml`. Le compte est de **112 plaques** : 64 de jauge (8 rôles × 4 jauges × 2), 14 de choix et de chaîne, 7 judiciaires, 7 d'imposture et de destin, 5 d'objectif, 6 de fin de vie et dorées, 8 qui concluent une histoire, 4 de monde, moins 3 doublons (`in_radiation` compté deux fois, `jubile` et `grand_deballage` comptés dans deux familles).

**C-19 · Le « rat de tribune » commence par un rôle qui n'existe pas.** — *continuité*
Le brainstorm 03 § 3.6 fait démarrer la troisième carrière de référence en « capo des ultras (2 saisons, grève réussie) ». Les huit rôles de la charte n'en comportent pas.
*Appliqué* : charte § 3.3. On entre par le **joueur amateur** avec `ami_ultras` posé dès la saison 0 (variante de `am.tuto.bistrot`). Le capo reste Gégé, et c'est mieux : le joueur ne devient pas Gégé, il devient quelqu'un que Gégé aime. La carrière complète est écrite au § 6.2 de ce chapitre.

**C-20 · La Coupe Continentale 1993 : Marsange ou Montbéliac.** — *continuité, déjà tranchée*
La spec § 4.5 l'attribue à Montbéliac, qui est un club de district ; la charte § 1.3 à Marsange. Le chapitre 20 a tranché pour Marsange.
*Entériné* : **Marsange**. Montbéliac est un club de district, il ne joue pas de coupe continentale. La spec `docs/spec_variete_narrative.md` § 4.5 doit être corrigée par le chantier données : c'est le seul point de cette liste qui vit hors de `docs/bible/`.

### 9.3 De convention

**C-21 · Les postulats sont lus comme des drapeaux.** — *convention*
Onze ids de postulat sont lus par `flag('apres_fiasco')`, `flag('geant_dechu')`, `flag('banc_dore')`… dans les chapitres 10, 11, 14, 15 et 30. Seul `promu` est déclaré dans `flags.yaml`.
*Appliqué* : charte § 4.11. **Le démarrage d'un postulat pose un drapeau à son nom**, comme `promu` le fait déjà, et la notation retenue est **`flag('<postulat>')`** — jamais `flag('x')` et `postulat == 'x'` dans la même bible. Les onze drapeaux sont à déclarer dans `flags.yaml` (charte § 5.3 e).

**C-22 · Deux notations d'alarme pour le même porteur.** — *convention*
Le chapitre 14 déclare `sl.alarme.caisse_bas_milena` (Milena, secrétaire du ministère) ; le chapitre 30 écrit `sl.alarme.caisse_bas_josiane` (Josiane à la Fédération). Les deux existent, aucune ne référence l'autre.
*Appliqué* : **`sl.alarme.caisse_bas_josiane`** (ch. 30) est l'alarme de base du rôle ; **`sl.alarme.caisse_bas_milena`** est l'`alarm_override` du postulat `pays_emergent`, écrite au chapitre 14 § 10, avec la même mécanique et une autre voix. C'est exactement l'usage prévu des `alarm_overrides` ; les deux se citent désormais l'une l'autre.

**C-23 · `pa_club_a_cote` ou `pa_club_a_cote`.** — *convention*
Le chapitre 13 écrit la fin `pa_club_a_cote` (*Le club d'à côté*) ; le chapitre 02 cite `pa_club_a_cote` ; le chapitre 30 cite les deux.
*Appliqué* : la fin « Le club d'à côté » porte l'id **`pa_club_a_cote`**, qui est son titre au brainstorm 02 § 2.9 et à la charte § 3.1. Le chapitre 13 a renommé ; `pa_village` n'existe plus.

**C-24 · Notations d'effet absentes du gabarit § 4.11.** — *convention*
`rand:`, `var:`, `world:`, `role:`, `end:`, `schedule:`, `chain:`, `elimination:` sont utilisées par les chapitres 10 à 15 et présentes dans `content/` sans figurer dans la charte.
*Appliqué* : les huit notations sont **au gabarit**, charte § 4.11, avec un exemple chacune (`rand:`, `var:`, `world:`, `role:`, `end:`, `schedule:`, `chain:`, `elimination:`). `elimination:` sort des cartes : c'est une entrée de `content/balance.yaml` appliquée par le moteur à la clôture d'une chaîne, parce qu'elle dépasse l'échelle symbolique (`+++` = 18).

**C-25 · RETIRÉ — `{toi}` est légal pour Aubert, Vialat et Amsel.** — *note de convention*
Diagnostic erroné, corrigé après relecture. `{toi}` ne rend pas un tutoiement : **il rend l'`adresse`**. Aubert, Vialat et Amsel ont bien une adresse — « madame ou monsieur {nom} » sur les trois visages — donc « Je ne juge pas, {toi} » s'affiche « Je ne juge pas, monsieur Bréhaut-Lemoine », qui est exactement ce qu'on voulait écrire. Les vingt-neuf occurrences relevées (dix-neuf pour Aubert, huit pour Vialat, deux pour Amsel) sont **au chapitre 13**, pas aux chapitres 14 et 15, et elles sont **correctes**.
*Règle retenue* : `{toi}` est permis pour tout personnage qui a une `adresse` ; il rend le vouvoiement quand l'adresse en est un. Rien à corriger dans les chapitres, rien à faire au chantier données (charte § 5.3 i).

**C-26 · Les voix sans portrait dépassent le plafond de deux cartes.** — *convention*
La charte § 2.3 fixe deux cartes par voix et par chapitre. Norbert (le chauffeur du bus) en a cinq, Lulu (le gardien du stade) sept, Marinette trois dans le chapitre 31 ; `{coach}` (l'entraîneur viré) parle trois fois dans le chapitre 11 ; le ministre de Sylvanie porte tout un postulat dans les chapitres 11 et 14.
*Appliqué* : charte § 2.1.9 — la catégorie **second rôle sans relation** est ouverte : un portrait générique, un tic, une fenêtre, aucune relation, aucun palier, aucune retrouvaille, et autant de cartes que son décor en demande. Y sont versés Norbert, Lulu, Marinette, le ministre de Sylvanie, Dragan Ilić, Inès Marchal, le fils de Corven, la petite Josiane, Nino et le stagiaire de l'Écho. Ils ne comptent pas dans les quarante-deux ; ils comptent dans le lint des locuteurs.

### 9.4 Les vingt-cinq réactions (écrites au § 2.4 bis) et les dix-huit traces à poser

Rappel des deux listes de travail : § 2.4 (les vingt et une réactions citées et jamais écrites) et § 1.6 (c) (les dix-huit traces annoncées en fiche courte et jamais posées par une scène). Ce sont les deux chantiers les plus rapides : une demi-journée d'écriture chacun, et le lint passe au vert.

---

## 10. Ce que le chapitre 90 refuse

Pour finir, la liste courte de ce qui ne doit pas entrer dans la base, quoi qu'en dise un chapitre :

1. **Une trace posée sans lecteur.** Elle ment au joueur : il croit que ça comptera.
2. **Une trace lue sans poseur.** Elle ment à l'auteur : il croit que sa variante existe.
3. **Un id qui désigne deux choses.** Sept aujourd'hui (C-01).
4. **Une manchette citée et jamais écrite.** Trois cent quatre-vingt-quatorze aujourd'hui (C-05).
5. **Un locuteur hors fenêtre.** Un mort ne téléphone pas, un retraité ne fait pas la compo.
6. **Un fait réel, même maquillé.** Un pays, un club, une personne, un scandale reconnaissable. Le monde est entièrement inventé, et il n'y a pas d'exception, pas même une carte existante.
7. **Un chiffre de relation dans le texte.** La relation se lit sur le visage.
8. **Une réplique de plus de deux phrases, un libellé de plus de vingt-huit caractères, un nom du joueur deux fois dans la même carte.**

Le reste — la longueur des chapitres, le nombre de variantes, le choix entre deux bonnes scènes — se discute. Ces huit points, non : ce sont eux qui font qu'une carrière de soixante ans se souvient d'un samedi de 1991.
