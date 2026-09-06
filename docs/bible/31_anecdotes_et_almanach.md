# FUSIBLE — Bible scénaristique · 31 · Les anecdotes, les running gags et l'almanach du monde

> Le sel. Ce chapitre ne raconte aucune histoire : il fournit ce qui se passe **entre** les histoires. Cent quatre anecdotes de monde jouables comme cartes de routine, vingt running gags avec leurs variations sur soixante ans, huit objets qui changent de main, les superstitions de vingt clubs, trente Nouvelles « à côté » et soixante noms en réserve. Il suit la charte (`00_charte.md`) : gabarit § 4.1 (scène), § 4.6 (Nouvelle), § 4.9 (anecdote), ids § 4.10, effets § 4.11, interdits § 6.

## 0. Comment lire ce chapitre

**Ce qu'il fournit.** § 2 : cent anecdotes de monde classées par lieu, chacune jouable comme carte de routine à un ou deux boutons (six dépliées au gabarit § 4.1 complet, les autres au **format ligne** ci-dessous, qui porte les mêmes champs). § 3 : vingt running gags et leurs quatre âges. § 4 : huit objets. § 5 : les superstitions des clubs. § 6 : trente Nouvelles « à côté ». § 7 : soixante noms en réserve. § 8 : trois Nouvelles datées manquantes, la couture et l'index par personnage.

**Ce qu'il livre aussi, et qui manquait à la première version** : § 9 les **quarante-deux lignes d'enterrement** (une par personnage à statut, Rossard compris), § 10 les **douze cartes-légendes** (une par saison au plus), § 11 **L'Almanach du Ballon** (dix entrées types par décennie). Ces trois livrables sont commandés par la charte § 5.1 et ne sont délégués à personne.

**Ce qu'il ne refait pas.** Les quatre-vingt-huit Nouvelles datées 1990-2050, les drapeaux `monde_*` et les gabarits d'Almanach sont au chapitre 20, qui en est propriétaire (charte § 5.1, corrigée après relecture) ; les fins et set-pieces au chapitre 30 ; les fiches au 01 et 02 (ici un personnage ne fait que ce que sa fiche autorise, dans sa fenêtre). Les anecdotes des chapitres 12 et 13 (`13.tracteur`, `13.coin_de_dede`, `13.tirage_aout`, `13.maillot_sous_verre`, le mur de Josiane, le fax et sa faute) sont citées, pas doublées.

**Le format ligne** (trois lignes, tous les champs du gabarit § 4.1 dans l'ordre) :

```
**`<id>`** · <lieu> · <rôles> · cd <cooldown> · <conditions ou —>
**<LOCUTEUR>** *(fonction — expression — didascalie)* « Réplique de deux phrases, un tic, un nom une fois. »
← **<libellé>** — <effets> — *conséquence* → **<libellé>** — <effets> — *conséquence* · Traces : … · Lu par : …
```

Un seul bouton = les deux libellés portent le même effet, écrit deux fois comme dans les cartes existantes. « cd 25 » = `cooldown: 25`. « tous rôles » = `roles:` vide.

**Les règles de l'anecdote.** Elle (a) ne fait jamais avancer une intrigue, (b) ne pose qu'une trace légère au plus, (c) touche une jauge, deux au maximum, jamais `+++`, (d) n'appelle jamais `end`, (e) ne cite le nom du joueur qu'une carte sur quatre, (f) est rejouable sauf mention `once`, (g) parle d'un lieu ou d'un objet, pas d'un enjeu. Le moteur les tire dans la bande de respiration, jamais deux d'affilée, jamais dans le dernier bloc d'une saison où une jauge est sous vingt. Leur fonction est le contraste : après la commission de discipline, savoir qui a mangé le dernier flan.

**Ids créés ici.** `co.dec.<lieu>_<mot>` (anecdote de décor commune), `<préfixe>.dec.<mot>` (anecdote de décor propre à un rôle), `co.gag.<gag>_<age>` (variation de running gag), `co.obj.<objet>_<mot>` (carte d'objet), `co.nouvelle.fd_<mot>` (fait divers), `31.<mot>` (bloc ANECDOTE § 4.9, non jouable, servi en brève, en épitaphe ou au Codex).

---

## 1. Les quatorze lieux et qui y parle

| Lieu | Qui y parle | Ce qu'on y apprend | Anecdotes |
|---|---|---|---|
| Le couloir, le distributeur | Vecchio, Josiane, Rouvier, Momo | l'argent, avant les journaux | 8 |
| Le vestiaire, la table du Doc | Sabatier, Rouvier, Bréhaut, Dembo, Vukić | ce qui ne sort pas | 8 |
| Le bus | Norbert (chauffeur), Vecchio, Fauvel, Mbako | la hiérarchie, assise | 8 |
| Le parking | Massenet, Fardelli, Gégé, La Plume | ce que le club ne dit pas | 7 |
| Le local, sous la Tribune Nord | Gégé, Nino, Paulette | la mémoire | 8 |
| La buvette, le club-house | Gérard, Dupuis, Dédé, Pichon | la trésorerie réelle | 8 |
| Le secrétariat, le bureau, le fax | Josiane, Vaubourg, Dauzat, Malbec | le pouvoir, à l'écrit | 7 |
| Le centre de formation | Barbier, Brissac, Mbako, Marinette | l'avenir, en survêtement | 7 |
| L'hôtel du club, les déplacements | Josiane, Vukić, Sabatier, Vogler | l'ennui | 6 |
| Le port, la ville, le marché | Paulette, Camille, le stagiaire de l'Écho, Léa | ce que la ville pense | 6 |
| Le Congrès, salle 3, l'hôtel du Lac | Berthomier, Roux, Dauzat, Bambini, Amsel | le vote, le couloir | 8 |
| La pelouse, la tribune Est, le panneau | Lulu (le gardien du stade), Paulette, Ilyas | le décor lui-même | 8 |
| Le restaurant, la boucherie, le bistrot | Dupuis, Fardelli, Solvang, Dembo | l'appétit | 7 |
| La maison | Camille, Sacha, Corven (au téléphone) | le prix | 4 |

Voix sans portrait créées ici (deux cartes chacune au plus, aucune relation) : **Norbert**, chauffeur du bus depuis 1988, « Je conduis, je ne commente pas. » · **Lulu**, gardien du stade, et son chien **Corner** · **Marinette**, la cantine du centre de formation, « Il y a des flans pour tout le monde. » · **Nino**, le capo d'après (repris du chapitre 01) · **le stagiaire de l'Écho** (repris de la charte § 1.6) · **la petite Josiane** (chapitre 02).

---

## 2. Cent anecdotes de monde

### 2.1 Le couloir et le distributeur (8)

Le distributeur est le vrai bulletin de santé du club : le 5 du mois, on sait avant le président. Le couloir est l'endroit où deux personnes qui ne se parlent pas doivent se croiser.

### SCÈNE co.dec.couloir_distributeur — Le ticket dans la fente
**Rôle** : tous · **Intrigue** : routine (décor) · **Étape** : — · **Moment** : toute saison, bande de respiration · **Lieu** : le couloir, devant le distributeur · **Conditions** : cd 25 ; `!flag('salaires_retard')` pour la version douce
**VECCHIO** *(gardien — neutre — il déplie un ticket trouvé par terre, à bout de bras)*
« Quelqu'un a laissé son solde imprimé dans la fente, et il est jeune. J'en ai vu d'autres ; celui-là, je le remets à l'envers. »
← **Je lis le chiffre** — effets : vestiaire −, direction + — *Tu ne dis rien. Lui non plus, et c'est pire.*
→ **Je le retourne aussi** — effets : vestiaire + — *Il replie le papier en quatre. Le couloir sent le café brûlé.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : § 3.16 (gag du distributeur), ch. 11 (alarme vestiaire si `salaires_retard`)

**`co.dec.couloir_le_cinq`** · devant le distributeur, le 5 du mois · tous · cd 20 · `flag('salaires_retard')`
**MOMO** *(coéquipier — noir — trois cartes dans la main, la sienne et deux autres)* « On y va à trois, comme ça il n'y en a qu'un qui a l'air bête. Tu viens avec nous ou tu attends le communiqué ? »
← **Je viens avec vous** — vestiaire ++, direction −, set: distributeur_groupe — *Vous êtes cinq en arrivant. Le distributeur n'a rien à dire à personne.* → **J'attends le communiqué** — direction +, vestiaire − — *Ils y vont sans toi. Le communiqué arrive le 11.* · Traces : distributeur_groupe · Lu par : § 3.16, ch. 11 (alarme vestiaire), ch. 20 (brève)

**`co.dec.couloir_affiche`** · le couloir du centre · tous · cd 30 · —
**JOSIANE** *(secrétaire — neutre — une punaise entre les dents)* « L'affiche du stage de secourisme est là depuis quatre ans, et personne ne l'a lue. J'en ai vu passer, vous savez, des affiches qui durent plus que des entraîneurs. »
← **Je l'enlève** — direction +, relation.josiane −1 — *Elle garde la punaise. Le carré plus clair sur le mur reste.* → **Je la laisse** — vestiaire + — *Elle repunaise le coin décollé. L'affiche gagne une année.* · Traces : — · Lu par : § 3.9

**`co.dec.couloir_pesee`** · la balance du couloir · joueur, entraineur, ds · cd 25 · —
**ROUVIER** *(kiné — neutre — elle tape la balance du pied)* « Cette balance ment de deux kilos depuis l'inondation, et tout le monde s'est arrangé avec. Respire ; je la règle, ou on garde le mensonge ? »
← **Règle-la** — vestiaire −, force +1 — *Trois joueurs découvrent leur poids réel. Deux ne reviennent pas dans le couloir.* → **On garde le mensonge** — vestiaire + — *Elle laisse la balance tranquille. Tout le monde a maigri de deux kilos.* · Traces : — · Lu par : ch. 12 (les huit kilos du carnaval)

**`co.dec.couloir_cafe`** · la machine à café, en panne · tous · cd 25 · —
**JOSIANE** *(secrétaire — sourire — elle tient sa propre cafetière, italienne, contre elle)* « La machine du couloir n'a jamais marché ; j'apporte la mienne depuis quatre-vingt-sept. J'en ai vu passer, des techniciens qui promettent de repasser. »
← **Je paie un vrai percolateur** — caisse −, direction +, vestiaire + — *Le percolateur arrive. Sa cafetière reste sur le bureau, au cas où.* → **La vôtre est meilleure** — relation.josiane +1, direction + — *Elle sert deux tasses. Le technicien ne repassera pas.* · Traces : — · Lu par : ch. 01 (retrouvailles Josiane), § 4.7

**`co.dec.couloir_plaque`** · le couloir des bureaux · entraineur, ds, president · cd 40 · saison ≥ 1
**JOSIANE** *(secrétaire — neutre — une plaque gravée dans la main, pas encore vissée)* « J'ai fait graver la vôtre, et j'ai gardé les sept précédentes dans le tiroir du bas. J'en ai vu passer ; le tiroir est plein, il faudra choisir. »
← **Vissez la mienne** — direction + — *Elle visse. Le tiroir se referme sur les sept autres.* → **Gardez le tiroir ouvert** — vestiaire +, direction − — *Elle laisse la plaque à plat sur le bureau. Elle prend la poussière du bon côté.* · Traces : — · Lu par : ch. 30 (fins DIRECTION), § 3.2

**`co.dec.couloir_chaussures`** · le couloir, sol repeint de la veille · tous · cd 30 · —
**LULU** *(gardien du stade — noir — pinceau à la main, à genoux)* « J'ai repeint la ligne bleue ce matin et vous êtes onze à avoir marché dessus. Le chien, lui, il a fait le tour. »
← **On repeindra, promis** — direction −, tribunes + — *Il regarde le chien. Le chien a raison depuis toujours.* → **Je fais le tour aussi** — vestiaire + — *Tu longes le mur. Onze paires d'yeux te regardent longer le mur.* · Traces : — · Lu par : § 3.14 (Corner)

**`co.dec.couloir_liste`** · le tableau d'affichage · joueur, entraineur, selectionneur · cd 25 · —
**BRÉHAUT** *(capitaine — neutre — il regarde une feuille punaisée de travers)* « La liste est affichée depuis huit heures et personne n'a osé la redresser. Le groupe vit bien, mais il vit de travers. »
← **Je la redresse** — vestiaire + — *Il sourit sans le montrer. La feuille est droite ; le groupe aussi, pour un jour.* → **Qu'ils la lisent comme ça** — vestiaire −, direction + — *Deux joueurs la lisent la tête penchée. Ils retiennent la position, pas les noms.* · Traces : — · Lu par : § 3.12

### 2.2 Le vestiaire, la table du Doc, la pharmacie (8)

La table du Doc est la seule pièce sans témoin, donc la seule où l'on parle. Le vestiaire a une géographie : les anciens près de la porte, les jeunes près des douches, un crochet que personne n'occupe.

### SCÈNE co.dec.doc_table — Ce qui reste sur la table
**Rôle** : joueur, entraineur, selectionneur · **Intrigue** : routine (décor) · **Étape** : — · **Moment** : toute saison, hors bloc final · **Lieu** : la table de massage, porte fermée · **Conditions** : cd 30
**SABATIER** *(médecin du club — neutre — il essuie ses mains, sans se presser)*
« Trois joueurs m'ont dit trois choses ce matin, et deux concernent ton onze. Ça reste entre la table et moi, sauf si tu me demandes. »
← **Je ne demande rien** — effets : vestiaire ++, relation.sabatier +1 — *Il hoche la tête. Il range la serviette et il oublie très bien.*
→ **Dis-moi la troisième** — effets : direction +, vestiaire −, relation.sabatier −1 — *Il te la dit. La porte est fermée, et quelqu'un l'a entendue quand même.*
**Traces** : — · **Réactions déclenchées** : co.re.rouvier_couloir · **Lu plus tard par** : ch. 01 (paliers de Sabatier), § 3.11

**`co.dec.vestiaire_crochet`** · le vestiaire, le crochet vide · joueur, entraineur · cd 35 · —
**VECCHIO** *(gardien — neutre — il désigne un crochet du menton)* « Ce crochet est à un type parti en quatre-vingt-douze, et personne ne s'y accroche depuis. J'en ai vu d'autres, mais celui-là on le laisse. »
← **J'y pends ma veste** — vestiaire −−, force +1 — *Le vestiaire se tait. Ta veste est très seule sur le mur.* → **On le laisse** — vestiaire + — *Le crochet reste vide. Il tiendra plus longtemps que toi.* · Traces : — · Lu par : § 4.5 (l'écharpe), ch. 30 (jubile plus)

**`co.dec.vestiaire_musique`** · le vestiaire, une heure avant · joueur, entraineur · cd 20 · —
**DEMBO** *(avant-centre — sourire — une enceinte grosse comme un ballon)* « L'enceinte, c'est moi qui la porte, donc c'est moi qui choisis. Donne-moi le ballon, je m'occupe du reste, et du volume. »
← **Baisse de moitié** — vestiaire −, direction + — *Il baisse. Il remonte à la 40e minute de la mi-temps, ce qui n'existe pas.* → **Monte, et gagne** — vestiaire ++, direction − — *Le couloir tremble. Le président ferme la porte de son bureau.* · Traces : — · Lu par : ch. 10 (Dembo), § 3.13

**`co.dec.doc_flan`** · l'infirmerie, midi · joueur, entraineur · cd 30 · —
**ROUVIER** *(kiné — sourire — un flan dans une main, une cuillère dans l'autre)* « Il restait un flan et deux blessés, j'ai tranché en faveur du plus triste. Respire, et ne le dis pas à l'autre. »
← **Je ne dis rien** — vestiaire +, relation.rouvier +1 — *L'autre l'apprend en trois heures. Personne ne sait comment.* → **J'en rachète douze** — caisse −, vestiaire ++ — *Douze flans arrivent le lendemain. Le club en parle plus que du match.* · Traces : — · Lu par : § 3.14, ch. 20 (brève)

**`co.dec.pharmacie_boite`** · l'armoire de l'infirmerie · entraineur, joueur, ds · cd 40 · saison ≥ 1
**SABATIER** *(médecin — neutre — une boîte sans étiquette dans la main)* « Cette boîte traîne dans l'armoire depuis l'ancien staff, et je ne sais pas ce qu'il y a dedans. Ça reste entre la table et moi : je la jette ou je la range ? »
← **Jetez-la** — direction +, vestiaire +, set: pharmacie_propre — *Il la jette devant toi, avec le sac, dans la benne du parking.* → **Rangez-la** — caisse +, direction − — *Il la range tout au fond. L'armoire ferme mal depuis toujours.* · Traces : pharmacie_propre ∃ · Lu par : ch. 11 (la pharmacie), ch. 15 (commission antidopage), ch. 20

**`co.dec.vestiaire_ballon_signe`** · le vestiaire, après une victoire · tous rôles terrain · cd 30 · —
**BRÉHAUT** *(capitaine — sourire — un ballon et un marqueur qui ne marche qu'à plat)* « Le ballon de la victoire, on le signe tous et on l'offre à quelqu'un du club. Le groupe vit bien ; il faut juste choisir qui. »
← **À Josiane** — direction +, vestiaire + — *Elle le pose sur le classeur. Il y restera vingt ans.* → **Au kop** — tribunes ++, direction − — *Le local l'accroche au plafond, dans un filet à oranges.* · Traces : — · Lu par : § 2.5, ch. 01

**`co.dec.vestiaire_douche_froide`** · les douches, novembre · joueur, entraineur, president · cd 25 · —
**VUKIĆ** *(adjoint — neutre — cheveux mouillés, serviette sur l'épaule)* « L'eau chaude tient onze minutes et on est vingt-deux. Je te le dis parce que personne ne te le dira : ils tirent au sort. »
← **Je paie le ballon d'eau** — caisse −−, vestiaire ++ — *L'eau chaude tient une heure. Le tirage au sort manque à trois joueurs.* → **Qu'ils tirent au sort** — vestiaire −, force +1 — *Les onze perdants s'endurcissent. Deux tombent malades, ce qui est autre chose.* · Traces : — · Lu par : § 3.9 (le radiateur), ch. 11

**`co.dec.vestiaire_maillot_numero`** · le vestiaire, veille de reprise · joueur, entraineur, ds · cd 30 · —
**MOMO** *(coéquipier — neutre — deux maillots pliés, le sien et un autre)* « Le douze, personne n'en veut, et le sept, ils sont trois dessus. Tu tranches, ou on se débrouille comme l'an dernier ? »
← **Je tranche** — direction +, vestiaire − — *Le sept est attribué. Deux joueurs s'entraînent avec le dos tourné.* → **Débrouillez-vous** — vestiaire + — *Ils se débrouillent. Le douze finit sur le dos du plus jeune, comme toujours.* · Traces : — · Lu par : § 3.3 (le bus, siège douze)

### 2.3 Le bus et Norbert (8)

La hiérarchie du club se lit à l'œil nu dans l'ordre des sièges. Norbert conduit depuis 1988 ; il ne commente pas, ce qui est une manière de tout dire.

### SCÈNE co.dec.bus_siege_douze — Le siège douze
**Rôle** : tous · **Intrigue** : routine (décor) · **Étape** : — · **Moment** : déplacement, toute saison · **Lieu** : le bus, à l'arrêt, moteur qui tourne · **Conditions** : cd 25
**NORBERT** *(chauffeur du bus — neutre — il pose sa veste sur un dossier, sans regarder personne)*
« Le douze, personne ne s'assoit dessus depuis le car de quatre-vingt-onze. Je conduis, je ne commente pas ; je pose juste ma veste. »
← **Je m'assois au douze** — effets : vestiaire −, force +1, tribunes + — *Vingt kilomètres sans un mot. Puis quelqu'un rit, et le bus repart.*
→ **Je reste debout** — effets : vestiaire + — *Il remet sa veste sur le douze. Le douze reste au douze.*
**Traces** : — · **Réactions déclenchées** : — · **Lu plus tard par** : ch. 14 (le bus du fiasco, siège douze), § 4.5, ch. 30 (en_bus plus)

**`co.dec.bus_radio`** · le bus, autoroute · tous · cd 20 · —
**NORBERT** *(chauffeur — sourire — la main sur le bouton, pas encore tourné)* « À l'aller c'est ma radio, au retour c'est la vôtre : règle de quatre-vingt-huit. Je conduis, je ne commente pas, mais l'aller est long. »
← **Votre radio, alors** — vestiaire −, direction + — *Trois heures d'accordéon. Deux joueurs dorment mieux que d'habitude.* → **On met la nôtre** — vestiaire +, force −1 — *Il baisse sa vitre. Le bruit du vent est une chronique.* · Traces : — · Lu par : § 3.13

**`co.dec.bus_arret_frites`** · une aire d'autoroute, 23 h · tous · cd 30 · —
**VECCHIO** *(gardien — sourire — un cornet de frites pour deux)* « On s'arrête ici depuis quinze ans et le patron nous garde la friteuse allumée. J'en ai vu d'autres, des aires ; celle-là a un patron. »
← **Vingt minutes, pas plus** — vestiaire +, force −1 — *Le patron sort douze cornets. Le bus sent la frite jusqu'à la ville.* → **On roule** — force +1, vestiaire −− — *Le bus passe devant. Le patron reste sur le parking avec sa friteuse allumée.* · Traces : — · Lu par : § 3.13, ch. 20

**`co.dec.bus_retard_president`** · le bus, moteur coupé, parking du club · entraineur, ds, selectionneur · cd 30 · —
**NORBERT** *(chauffeur — noir — il regarde sa montre de conducteur, pas la sienne)* « J'ai vingt-deux personnes à l'heure et une qui n'est pas là. Je conduis, je ne commente pas, mais l'amende, c'est pour moi. »
← **On part sans lui** — direction −−, vestiaire ++ — *Le bus part. Le retardataire arrive en taxi, et il n'oublie pas.* → **On attend** — vestiaire −, direction + — *Onze minutes. Personne ne parle pendant onze minutes.* · Traces : — · Lu par : ch. 13, § 3.2

**`co.dec.bus_carte_papier`** · le bus, sortie manquée · tous · cd 35 · année < 2010
**NORBERT** *(chauffeur — neutre — une carte routière dépliée sur le volant)* « La sortie a changé de numéro cet été et la carte date de l'an dernier. Je conduis, je ne commente pas : à droite ou tout droit ? »
← **À droite** — force −1, vestiaire + — *Vous arrivez par le vieux pont. Le stade est plus beau par là.* → **Tout droit** — force +1, tribunes − — *Vous arrivez pile à l'heure, par la zone commerciale. Personne ne regarde par la fenêtre.* · Traces : — · Lu par : § 6 (fd_rond_point)

**`co.dec.bus_chant_impose`** · le bus, retour de victoire · joueur, entraineur, selectionneur · cd 25 · —
**MBAKO** *(prodige — sourire — debout dans l'allée, une bouteille en guise de micro)* « Le nouveau chante debout, c'est la règle, et je suis le nouveau depuis deux ans. Je veux jouer, maintenant ; alors quelqu'un d'autre chante. »
← **Chante quand même** — vestiaire ++, relation.mbako −1 — *Il chante faux, exprès, très longtemps. Le bus l'adore.* → **Je chante à sa place** — vestiaire +, tribunes + — *Tu chantes. Norbert klaxonne une fois, ce qui est un compliment.* · Traces : — · Lu par : ch. 11 (le prodige), § 3.13

**`co.dec.bus_gigi_descend`** · le bus, arrivée au stade · tous · cd 30 · `flag('gigi_staff')` ou Vecchio au club
**VECCHIO** *(gardien — neutre — sac de gants sur l'épaule, déjà debout)* « Je descends le premier depuis dix-neuf ans, c'est comme ça qu'on sait qu'on est arrivés. J'en ai vu d'autres descendre avant moi ; ils ne sont plus là. »
← **Descends** — vestiaire +, tribunes + — *Il descend. Le stade fait le bruit qu'il fait toujours quand il descend.* → **Le capitaine d'abord** — vestiaire −, direction + — *Il laisse passer. Il descend deuxième, et il compte les marches.* · Traces : — · Lu par : ch. 14 (le bus), ch. 30 (en_retraite plus)

**`co.dec.bus_norbert_retraite`** · le parking, dernier déplacement de Norbert · tous · once · saison ≥ 4
**NORBERT** *(chauffeur — sourire — il rend deux clés au lieu d'une)* « Trente-quatre ans, deux cent mille kilomètres, une seule crevaison. Je conduis, je ne commente pas ; à partir de lundi, je commente. »
← **On vous garde le douze** — vestiaire ++, tribunes + — *Il s'assoit au douze. Personne ne dit rien, et pour une fois c'est bien.* → **Merci, et bonne route** — direction + — *Il salue de la main depuis le trottoir. Le bus part avec un autre à sa place.* · Traces : — · Lu par : § 7 (le suivant : Sonia Marek), ch. 20 (brève)

### 2.4 Le parking (7)

Le parking est la salle de rédaction de La Gazette Rose (« Vu au parking ») : le prix des voitures, la longueur des conversations, et qui attend dans la sienne, moteur éteint.

**`co.dec.parking_meneche_attend`** · le parking du centre, 19 h · entraineur, joueur, ds, president · cd 25 · —
**MASSENET** *(journaliste — neutre — appuyé sur une portière qui n'est pas la sienne)* « J'attends depuis quarante minutes, et j'attendrai encore vingt. Juste une question, hors micro : vous sortez par où, d'habitude ? »
← **Une question, une seule** — direction −, tribunes + — *Il note trois mots. Il en publiera onze.* → **Je sors par derrière** — direction +, tribunes − — *Il regarde la porte de derrière. Il la connaissait déjà.* · Traces : — · Lu par : ch. 20 (« Vu au parking »), § 3.17

**`co.dec.parking_voiture_president`** · le parking, place numérotée · tous · cd 30 · —
**GÉGÉ** *(capo — noir — assis sur le muret, écharpe au cou)* « Sa place est peinte à son nom et la nôtre est dans la boue depuis quinze ans. La tribune n'oublie rien, surtout la peinture. »
← **Je fais peindre le parking** — caisse −, tribunes ++ — *Les lignes sont blanches. Le nom du président est toujours écrit plus gros.* → **Une place, c'est une place** — tribunes −, direction + — *Il crache par terre, poliment. La boue reste.* · Traces : — · Lu par : ch. 13, § 3.2

**`co.dec.parking_fardelli_moteur`** · le parking, moteur allumé · joueur, entraineur, ds · cd 25 · —
**FARDELLI** *(agent — sourire — vitre baissée de dix centimètres)* « Je ne descends pas, il fait froid et j'ai quatre-vingts kilomètres. Mon ami, on parle d'argent ou d'amitié ? »
← **D'amitié, alors** — direction +, caisse − — *Il remonte la vitre en riant. Il rappellera pour l'argent.* → **D'argent, vite** — caisse +, vestiaire − — *Il coupe le moteur. La conversation dure quarante minutes.* · Traces : — · Lu par : ch. 01/02, § 3.17

**`co.dec.parking_voitures_jeunes`** · le parking des joueurs · joueur, entraineur, ds · cd 30 · année ≥ 2000
**VUKIĆ** *(adjoint — neutre — il regarde une voiture jaune, très basse)* « Le gamin a signé lundi et la voiture est arrivée mercredi ; le permis, c'est vendredi. Je te le dis parce que personne ne te le dira. »
← **Je lui parle** — vestiaire +, relation.mbako −1 — *Il écoute. La voiture est garée plus loin la semaine suivante.* → **C'est son argent** — vestiaire − — *La voiture reste devant la porte. Deux autres arrivent le mois d'après.* · Traces : — · Lu par : ch. 10, ch. 12

**`co.dec.parking_camionnette_supporters`** · le parking, samedi matin · tous · cd 30 · —
**NINO** *(sous-capo — sourire — une camionnette pleine de peinture)* « On a la bâche, la peinture et personne pour ouvrir le portail. Le virage attend, et le virage attend mal. »
← **J'ouvre le portail** — tribunes ++, direction − — *La bâche est peinte dans le parking. Le sol garde une fresque de vingt mètres.* → **Demandez au club** — tribunes −, direction + — *Ils peignent sur le trottoir d'en face. C'est plus visible, et c'est bien le problème.* · Traces : — · Lu par : § 2.5, ch. 13

**`co.dec.parking_plume_photo`** · le parking, la nuit · president, instance, ds · cd 40 · `flag('ecoutes')` ou Parole ≤ −2
**LA PLUME** *(journaliste d'investigation — noir — par écrit ; une enveloppe glissée sous l'essuie-glace)* « Trois photos de ce parking, trois dates, trois voitures. J'ai les documents ; il me manque une phrase de vous. »
← **Je ne dirai rien** — direction −, tribunes − — *L'article sort sans ta phrase. C'est pire, elle le savait.* → **Une phrase, la mienne** — parole +1, direction −− — *Ta phrase est en gras, en bas. Elle est exacte, et elle te suit trois ans.* · Traces : — · Lu par : ch. 20, ch. 30 (grand_deballage)

**`co.dec.parking_flaque`** · le parking, après la pluie · tous · cd 35 · —
**LULU** *(gardien du stade — neutre — bottes, seau, chien)* « La flaque du fond a un nom depuis quatre-vingt-quatorze et le chien s'y baigne. Elle prendra le vôtre si vous ne la bouchez pas. »
← **On la bouche** — caisse −, direction + — *Deux camions de gravier. La flaque revient au printemps, plus à l'est.* → **Qu'elle garde son nom** — tribunes +, vestiaire + — *Le chien y saute. Trois enfants font pareil, ce qui règle la question.* · Traces : — · Lu par : § 3.14

### 2.5 Le local, sous la Tribune Nord (8)

Trois bières, un mur, une craie, un filet à oranges. On y vote la compo qu'on ne jouera pas, on y découpe les Unes : c'est la seule archive du club qui n'a jamais brûlé.

### SCÈNE co.dec.local_mur_craie — Le mur des dates
**Rôle** : tous · **Intrigue** : routine (décor) · **Étape** : — · **Moment** : toute saison, hors bloc final · **Lieu** : le local, sous la Tribune Nord · **Conditions** : cd 30 ; relation.gege ≥ 0
**GÉGÉ** *(capo, Tribune Nord — neutre — la craie dans la main, le mur derrière lui)*
« Ce mur porte cent onze dates et deux promesses non tenues, écrites plus gros. La tribune n'oublie rien ; tu veux voir lesquelles ? »
← **Montre-moi les deux** — effets : tribunes +, direction −, parole +1 — *Il montre. Les deux noms sont ceux de gens qui vivent encore en ville.*
→ **Je préfère les cent onze** — effets : tribunes ++, relation.gege +1 — *Il fait le tour du mur avec toi. Ça prend une heure et deux bières.*
**Traces** : — · **Réactions déclenchées** : co.re.gege_craie · **Lu plus tard par** : ch. 11 (`pacte_gege`), ch. 13 (Gégé au président), § 3.2

**`co.dec.local_filet_oranges`** · le local, plafond · tous · cd 35 · —
**NINO** *(sous-capo — sourire — il décroche un filet à oranges plein de ballons)* « Chaque ballon là-dedans vient d'une victoire à l'extérieur, et il en manque un depuis l'inondation. Le virage compte mieux que la Fédération. »
← **Je vous en donne un** — tribunes ++, vestiaire − — *Le filet est plein. Le vestiaire cherche son ballon toute la semaine.* → **Comptez sans moi** — tribunes − — *Il raccroche le filet. Il compte quand même.* · Traces : — · Lu par : § 2.2

**`co.dec.local_unes_decoupees`** · le local, mur de gauche · tous · cd 30 · une manchette servie cette saison
**GÉGÉ** *(capo — noir — des ciseaux, un journal rose)* « On découpe les Unes et on garde même les moches, surtout les moches. La tribune n'oublie rien, et elle plastifie. »
← **Découpez celle-là** — tribunes +, direction − — *La Une est punaisée au-dessus de la porte. Tu la vois en sortant.* → **Brûlez-la** — tribunes −, vestiaire + — *Ils la brûlent dans un seau. Ils en gardent une photo.* · Traces : — · Lu par : ch. 20, § 3.2

**`co.dec.local_bache_nom`** · le local, une bâche de vingt mètres au sol · tous · cd 40 · saison ≥ 1
**NINO** *(sous-capo — neutre — un pinceau, une lettre déjà peinte)* « La bâche a un nom depuis mardi et il reste trois lettres à peindre. On peut encore changer d'avis ; après, c'est peint. »
← **Peignez** — tribunes ++, direction −, promise — *Vingt mètres portent un nom. Ce nom devra tenir la saison.* → **Attendez juin** — tribunes −, direction + — *La bâche est repliée avec trois lettres. Elles sèchent quand même.* · Traces : — · Lu par : ch. 10 (« ton nom sur la bâche »), ch. 30 (en_banderole)

**`co.dec.local_chaise_du_pere`** · le local, une chaise à part · tous · cd 45 · once par carrière
**GÉGÉ** *(capo — neutre — il pose la main sur un dossier de chaise vide)* « Celle-là, c'est celle de mon père, interdit de stade en soixante et onze pour un dessin. La tribune n'oublie rien ; elle s'assoit ailleurs. »
← **Je reste debout** — tribunes +, relation.gege +1 — *Il approuve d'un mouvement de menton. La chaise reste vide.* → **Je m'assois** — tribunes −−, relation.gege −1 — *Le local se vide en quatre minutes. Personne ne t'a rien dit.* · Traces : — · Lu par : ch. 01 (blessure de Gégé), ch. 30

**`co.dec.local_vote_compo`** · le local, veille de match · tous · cd 25 · —
**NINO** *(sous-capo — sourire — un tableau noir, onze noms, une craie qui grince)* « On a voté le onze à main levée et on t'a mis en dix, par politesse. Le virage attend mal, mais il attend. »
← **Je regarde le tableau** — tribunes +, vestiaire − — *Tu le regardes. Deux noms te trottent dans la tête jusqu'à dimanche.* → **Je ne regarde pas** — vestiaire +, tribunes − — *Ils effacent avant que tu sortes. Ils recommencent la semaine d'après.* · Traces : — · Lu par : ch. 11 (`onze_du_virage`), ch. 13

**`co.dec.local_biere_tiede`** · le local, frigo en panne · tous · cd 30 · —
**GÉGÉ** *(capo — sourire — trois bières tièdes alignées sur une caisse)* « Le frigo est mort en mars et on boit tiède depuis, ça forge le caractère. La tribune n'oublie rien, même la panne. »
← **Je paie le frigo** — caisse −, tribunes ++ — *Le frigo arrive. Ils gardent l'ancien, debout, comme une statue.* → **Trois tièdes, alors** — tribunes +, force −1 — *Tu bois la tienne. Le goût reste jusqu'à l'échauffement.* · Traces : — · Lu par : § 3.5 (Gérard)

**`co.dec.local_paulette_visite`** · le local, un mardi · tous · cd 40 · année ≤ 2009
**PAULETTE** *(abonnée depuis 1951 — sourire — un cabas, deux tartes)* « Je descends deux fois par an pour vérifier qu'ils mangent, et ils mangent mal. J'étais là en cinquante et un ; le local sentait déjà la peinture. »
← **Je prends une part** — tribunes +, vestiaire + — *Tu manges debout. Le local se tient droit pendant vingt minutes.* → **Je repasserai** — tribunes − — *Elle laisse les deux tartes. Elle repart par l'escalier, lentement.* · Traces : — · Lu par : § 3.6, ch. 01

### 2.6 La buvette et le club-house (8)

La trésorerie réelle du football amateur. Gérard la tient depuis vingt ans ; la caisse est une boîte en fer ; le prix du café n'a pas bougé depuis 1986, ce qui est un choix politique.

### SCÈNE co.dec.buvette_ardoise — L'ardoise
**Rôle** : joueur_amateur, president_amateur, entraineur · **Intrigue** : routine (décor) · **Étape** : — · **Moment** : toute saison · **Lieu** : la buvette, après 22 h · **Conditions** : cd 25
**GÉRARD** *(bénévole, trésorier — neutre — un carnet à spirale, une page pleine de bâtons)*
« L'ardoise du dimanche fait quatre pages et trois noms reviennent partout. Ici, on payait en bières ; maintenant on paie en bâtons. »
← **J'efface tout** — effets : caisse −−, vestiaire ++, tribunes + — *Il arrache les quatre pages. Trois hommes te serrent la main trop longtemps.*
→ **Que chacun paie** — effets : caisse ++, vestiaire −, tribunes − — *Deux paient. Un ne revient plus le dimanche.*
**Traces** : — · **Réactions déclenchées** : pa.re.gerard_boite · **Lu plus tard par** : ch. 13 (la caisse), § 3.5, ch. 30 (pa_buvette plus)

**`co.dec.buvette_prix_cafe`** · la buvette, le tableau des prix · amateur, president_amateur · cd 30 · —
**GÉRARD** *(bénévole — noir — une craie devant un tableau jauni)* « Le café est à ce prix depuis quatre-vingt-six et le sucre est offert, c'est écrit. Ici, on payait en bières ; on ne va pas commencer à compter. »
← **On augmente de dix** — caisse +, tribunes −− — *Il monte le chiffre. Il le remonte plus petit que les autres.* → **On ne touche à rien** — tribunes +, caisse − — *Le tableau reste. Le sucre aussi.* · Traces : — · Lu par : § 3.5, ch. 13

**`co.dec.buvette_merguez`** · la buvette de Portclair, un souvenir · tous · cd 45 · once
**DUPUIS** *(boucher, sponsor — sourire — il pose deux cents merguez sur le comptoir)* « La buvette d'à côté a brûlé en quatre-vingt-douze avec deux cents merguez dedans, personne dessous. Le meilleur du cochon, et je pèse mes mots. »
← **On en refait deux cents** — caisse −, tribunes ++, set: merguez_deux_cents — *La fumée monte jusqu'à la tribune. Quelqu'un ressort la photo de quatre-vingt-douze.* → **Cent suffiront** — caisse +, tribunes − — *Il en apporte deux cents quand même. Il en remporte cent.* · Traces : merguez_deux_cents · Lu par : § 6 (fd_merguez), ch. 20 (brève), ch. 13

**`co.dec.buvette_frigo_bieres`** · le club-house, dimanche midi · amateur, president_amateur · cd 25 · —
**DÉDÉ** *(coach bénévole — neutre — il compte des bouteilles à voix basse)* « Il manque douze bières et j'ai deux suspects, dont un qui a marqué. Bon, on va pas se mentir : tu veux les noms ? »
← **Donne les noms** — vestiaire −, direction + — *Il les donne. Les deux s'entraînent très bien le mardi suivant.* → **Douze bières, ça se perd** — vestiaire ++, caisse − — *Il range le carnet. Il en manque quatorze le dimanche d'après.* · Traces : — · Lu par : § 3.5

**`co.dec.buvette_photo_1974`** · le mur du club-house · tous · cd 35 · —
**PICHON** *(boulanger, président — sourire — il redresse un cadre)* « Cette photo de soixante-quatorze a treize joueurs et douze noms, et personne ne sait qui est le treizième. Le pain, c'est à cinq heures ; le mystère, c'est après. »
← **On cherche le treizième** — tribunes +, direction − — *Trois anciens s'y mettent. Ils trouvent quatre noms différents.* → **Qu'il reste anonyme** — tribunes + — *Le cadre est redressé. Le treizième continue de sourire.* · Traces : — · Lu par : § 6 (fd_treizieme), ch. 13

**`co.dec.buvette_anciens_samedi`** · la buvette des anciens · tous · cd 30 · année ≥ 2005
**VECCHIO** *(gardien, puis buvette des anciens — sourire — un torchon sur l'épaule)* « Le samedi matin, ici, c'est nous ; on sert du café et on refait des matchs de quatre-vingt-quinze. J'en ai vu d'autres, mais on ne refait que ceux-là. »
← **Je m'assois avec vous** — vestiaire +, tribunes + — *Tu écoutes un match que tu n'as pas joué. Tu t'en souviens quand même.* → **Je passe en coup de vent** — direction + — *Il te sert un café à emporter. Le gobelet fuit ; il le sait.* · Traces : — · Lu par : ch. 01 (Vecchio), ch. 13

**`co.dec.buvette_tombola`** · la buvette, tombola de Noël · amateur, president_amateur, president · cd 40 · —
**PAULETTE** *(abonnée — sourire — un carnet de tickets et un stylo à bille mâchouillé)* « Le premier lot, c'est un jambon ; le deuxième, un maillot ; le troisième, personne ne le réclame jamais. J'étais là en cinquante et un, et déjà. »
← **J'achète tout le carnet** — caisse −, tribunes ++ — *Tu gagnes le troisième lot. Personne ne te dit ce que c'est.* → **Deux tickets** — tribunes + — *Tu ne gagnes rien. Le jambon part chez le voisin de Dupuis.* · Traces : — · Lu par : § 3.6

**`co.dec.buvette_verre_perdu`** · la buvette, inventaire de juin · president_amateur, president · cd 35 · —
**GÉRARD** *(trésorier — neutre — une caisse en fer ouverte, des verres empilés)* « Sur cent vingt verres, il en reste quarante et un, et personne n'a rien cassé. Ici, on payait en bières ; les verres partaient avec. »
← **On rachète cent verres** — caisse −− — *Cent verres arrivent. Il en reste quarante-trois en juin prochain.* → **Les gens ramèneront** — caisse +, tribunes − — *Une affiche demande le retour des verres. Six reviennent, dont deux d'un autre club.* · Traces : — · Lu par : § 4.8 (la boîte en fer), ch. 13

### 2.7 Le secrétariat, le bureau, le fax (7)

Josiane a le vrai plan du club : un classeur, un tiroir du bas, un mur d'accusés de réception. Le fax écrit faux depuis 1998 (ch. 12) ; elle corrige à la main sans le dire.

### SCÈNE co.dec.bureau_tiroir_du_bas — Le tiroir du bas
**Rôle** : entraineur, ds, president, instance · **Intrigue** : routine (décor) · **Étape** : — · **Moment** : saison ≥ 1 · **Lieu** : le secrétariat · **Conditions** : cd 35
**JOSIANE** *(secrétaire — neutre — elle ouvre un tiroir de dix centimètres, pas plus)*
« Le tiroir du bas contient ce qu'on n'a pas jeté et ce qu'on n'a pas classé. J'en ai vu passer ; il faudrait deux heures et une décision. »
← **On trie ce soir** — effets : direction +, caisse +, relation.josiane +1 — *Deux heures. Il en ressort un contrat de 1993 que personne ne cherchait.*
→ **Qu'il reste fermé** — effets : direction −, vestiaire + — *Elle repousse le tiroir du genou. Il ne ferme plus tout à fait.*
**Traces** : — · **Réactions déclenchées** : co.re.josiane_a_lu ∃ · **Lu plus tard par** : ch. 02 (Josiane), ch. 12 (le mur de Josiane), § 3.2, § 3.9

**`co.dec.bureau_fax_faute`** · le secrétariat, le fax · entraineur, ds, president · cd 25 · année ≤ 2010
**JOSIANE** *(secrétaire — sourire — un stylo rouge sur une page qui sort encore chaude)* « Notre fax écrit « transfet » depuis quatre-vingt-dix-huit et je corrige à la main depuis. J'en ai vu passer, des machines ; celle-là a un caractère. »
← **On le fait réparer** — caisse −, direction + — *Le technicien change une pièce. Le mot revient faux la semaine suivante.* → **Corrigez, comme toujours** — direction +, relation.josiane +1 — *Elle corrige. Le club reçoit ses transferts avec une virgule rouge.* · Traces : — · Lu par : ch. 12 (le fax de 23 h 58), § 3.10

**`co.dec.bureau_sms_faute`** · le bureau du président, tard · entraineur, ds · cd 40 · relation.aulard ≤ 0
**VAUBOURG** *(président — neutre — le pouce au-dessus de l'écran, un brouillon à l'écran)* « J'ai un message tout prêt pour un entraîneur, avec une faute que je ne corrige jamais. J'ai pas le temps, j'ai un empire ; tu veux le lire ? »
← **Montrez-moi** — direction −, parole +1, set: faute_lue — *Tu la vois : le mot est faux depuis 1991. Il l'a envoyé onze fois.* → **Gardez-le pour un autre** — direction +, vestiaire − — *Il range le téléphone. Le brouillon reste en mémoire.* · Traces : faute_lue · Lu par : § 3.1, ch. 30 (en_sms plus), ch. 20

**`co.dec.bureau_classeur_rouge`** · le secrétariat · president, ds, instance · cd 35 · —
**JOSIANE** *(secrétaire — noir — un classeur rouge tenu à deux mains)* « Le rouge, c'est les affaires en cours ; il était bleu jusqu'en quatre-vingt-quatorze. J'en ai vu passer, des couleurs, jamais deux fois la même raison. »
← **Ouvrez le rouge** — direction +, caisse − — *Trois dossiers dedans, deux à ton nom. Elle attendait qu'on demande.* → **Rangez le rouge** — direction − — *Elle le remet debout entre deux bleus. Il dépasse d'un centimètre.* · Traces : — · Lu par : ch. 13, ch. 15

**`co.dec.bureau_photocopieuse`** · le couloir des bureaux · tous rôles de bureau · cd 30 · —
**DAUZAT** *(secrétaire général — sourire — une rame de papier sous le bras)* « La photocopieuse bourre à la page quarante et une, et le règlement en fait quarante-deux. C'est dans le procès-verbal, page quarante et une. »
← **Achetez-en une autre** — caisse −, direction + — *La nouvelle bourre page cinquante-trois. Il note la page.* → **Photocopiez en deux fois** — direction +, force −1 — *Il coupe le règlement en deux. Deux personnes n'en lisent qu'une moitié.* · Traces : — · Lu par : ch. 15, § 3.19

**`co.dec.bureau_plante_verte`** · le bureau du président · president, ds, instance · cd 35 · —
**MALBEC** *(président du Racing — neutre — il tâte la terre d'une plante manifestement fausse)* « Ma plante est en plastique et trois visiteurs sur quatre l'arrosent quand même. Entre présidents, on se comprend ; toi, tu l'arroserais ? »
← **Je l'arroserais** — direction +, vestiaire − — *Il rit vraiment, pour une fois. Il te ressert un café.* → **Elle est en plastique** — direction −, caisse + — *Il te trouve moins drôle et plus utile. Ça se paie plus tard.* · Traces : — · Lu par : ch. 14 (l'hôtel du sponsor), § 3.15

**`co.dec.bureau_petite_josiane`** · le secrétariat, un lundi · tous rôles de bureau · cd 45 · année ≥ 2008
**LA PETITE JOSIANE** *(nièce, secrétaire — neutre — un classeur qu'elle tient comme sa tante)* « Ma tante range le journal sous les autres et moi je le mets dessus, on n'est pas d'accord. Vous voulez le voir dessus ou dessous ? »
← **Sous les autres** — direction +, vestiaire + — *Elle le glisse dessous en soupirant. Le pli est au même endroit.* → **Dessus, pour une fois** — direction −, tribunes + — *Le journal reste dessus toute la journée. Tout le club le lit.* · Traces : — · Lu par : § 3.2, ch. 02

### 2.8 Le centre de formation (7)

Un préfabriqué, une pelouse trop courte, un panneau avec des noms et les horaires du car. Barbier arrive en doudoune quand il pleut, parce que c'est sous la pluie qu'on voit.

**`co.dec.centre_flans`** · la cantine du centre · tous · cd 25 · —
**MARINETTE** *(cantine du centre — sourire — un chariot, des ramequins)* « Il y a des flans pour tout le monde, sauf pour ceux qui reviennent en douce. Je sais toujours qui est revenu en douce. »
← **Un flan, et je m'assois** — vestiaire +, tribunes + — *Tu manges avec quatorze gamins. Deux te parlent, douze te regardent.* → **Je n'ai pas le temps** — direction + — *Elle met un flan de côté. Il attend jusqu'au soir.* · Traces : — · Lu par : § 3.14

**`co.dec.centre_panneau`** · le panneau d'affichage · entraineur, ds, president · cd 30 · —
**BRISSAC** *(DTN — neutre — un doigt sur une liste de quatorze noms)* « Sur ces quatorze, deux joueront en pro et onze le sauront trop tard. Les chiffres sont têtus, les joueurs aussi ; qui prévient les onze ? »
← **Je les préviens moi-même** — vestiaire −, direction +, parole +1 — *Tu passes une matinée à dire non. Onze familles s'en souviennent.* → **Le club le fera** — direction −, caisse + — *Une lettre part le 30 juin. Elle est très bien écrite.* · Traces : — · Lu par : ch. 10 (`lache_academie`), ch. 12

**`co.dec.centre_barbier_pluie`** · le bord du terrain, sous la pluie · tous · cd 30 · —
**BARBIER** *(recruteur — sourire — doudoune, capuche, carnet dans un sac plastique)* « Je suis là depuis une heure et quart, il pleut, et c'est exactement pour ça. Je l'ai vu jouer sous la pluie ; le reste, c'est du beau temps. »
← **Lequel ?** — direction +, relation.barbier +1 — *Il montre un dossard sans le nommer. Le numéro est neuf.* → **Il pleut aussi ailleurs** — vestiaire + — *Il rabat sa capuche. Il reste encore une heure.* · Traces : — · Lu par : ch. 12 (l'algorithme contre l'œil), ch. 02

**`co.dec.centre_chaussures_trop_grandes`** · le vestiaire des jeunes · tous · cd 30 · —
**MBAKO** *(prodige — neutre — des crampons deux pointures au-dessus, deux paires de chaussettes)* « Je joue en quarante-trois avec du quarante-cinq depuis février, parce que c'est ce qu'il y avait. Je veux jouer, maintenant ; les pieds suivront. »
← **On t'achète ta pointure** — caisse −, relation.mbako +1, vestiaire + — *Les crampons arrivent le jeudi. Il marque le samedi, ce qui ne prouve rien.* → **Les pieds suivront** — force +1, relation.mbako −1 — *Il joue avec du quarante-cinq. Il ne l'oublie jamais.* · Traces : — · Lu par : ch. 11 (le prodige), § 3.13

**`co.dec.centre_car_horaire`** · l'arrêt du car, 6 h 40 · tous · cd 35 · —
**MARINETTE** *(cantine — neutre — deux sandwichs emballés, un dans chaque main)* « Le car de six heures quarante prend les gamins des trois villages, et il en manque un ce matin. Il y a des flans pour tout le monde, mais pas de deuxième car. »
← **Je vais le chercher** — direction −, vestiaire ++ — *Tu arrives chez lui à sept heures dix. Sa mère te fait un café qu'elle n'a pas.* → **Il apprendra** — vestiaire −, force +1 — *Il apprend. Il arrive à l'heure pendant six ans.* · Traces : — · Lu par : ch. 10

**`co.dec.centre_mur_des_partis`** · le couloir du centre · tous · cd 40 · saison ≥ 2
**BRISSAC** *(DTN — sourire — un mur de photos de classe, une par promotion)* « Chaque promotion a sa photo et on entoure au feutre ceux qui sont passés pros. Les chiffres sont têtus : il y a des années sans un seul rond. »
← **On entoure aussi les autres** — vestiaire +, direction − — *Deux cents ronds au feutre bleu. Le mur devient illisible et beaucoup plus juste.* → **On garde la règle** — direction + — *Un rond de plus cette année. La photo de 1996 n'en a toujours aucun.* · Traces : — · Lu par : ch. 20 (brève), § 7

**`co.dec.centre_but_sans_filet`** · la pelouse du centre · tous · cd 30 · —
**LULU** *(gardien du stade — noir — un filet roulé sous le bras, du fil de fer à la main)* « Le but nord n'a plus de filet depuis Noël et les gamins courent chercher le ballon dans les orties. Le chien, lui, il ne va plus dans les orties. »
← **Deux filets neufs** — caisse −, vestiaire + — *Les filets sont posés le jeudi. Les orties respirent.* → **Ça les fait courir** — force +1, vestiaire − — *Ils courent. Deux ont des plaques rouges jusqu'aux genoux.* · Traces : — · Lu par : § 3.14

### 2.9 L'hôtel du club et les déplacements (6)

Chambre 12, moquette à motifs, un plateau de fruits sous film. Le club y devient une famille pendant vingt-deux heures, puis redevient un club.

**`co.dec.hotel_chambre_douze`** · l'hôtel du club, veille de match · tous · cd 30 · —
**VUKIĆ** *(adjoint — neutre — une clé à gros porte-clés dans la main)* « La douze donne sur la route et personne n'y dort, sauf celui qui a mal parlé la semaine d'avant. Je te le dis parce que personne ne te le dira. »
← **Je prends la douze** — vestiaire ++, force −1 — *Tu dors mal. Le vestiaire l'apprend avant le petit-déjeuner.* → **Attribuez-la** — vestiaire −, direction + — *Un joueur y dort. Il joue en colère, ce qui marche une fois sur deux.* · Traces : — · Lu par : ch. 11, ch. 14 (l'hôtel du sponsor)

**`co.dec.hotel_plateau_fruits`** · l'hôtel, hall, 22 h · tous · cd 25 · —
**SABATIER** *(médecin — sourire — il soulève un film plastique sur des bananes)* « Le plateau de fruits est le même depuis lundi, seul le film a changé. Ça reste entre la table et moi, mais je ne mangerais pas la poire. »
← **On change de traiteur** — caisse −, vestiaire + — *Le plateau du lendemain est splendide. Personne n'y touche non plus.* → **Personne n'y touche jamais** — direction + — *Le plateau reste. La poire devient un personnage du couloir.* · Traces : — · Lu par : § 3.14, ch. 20

**`co.dec.hotel_cloison`** · l'hôtel, deux chambres, une cloison · tous · cd 30 · —
**BRÉHAUT** *(capitaine — noir — il tape deux fois du poing sur un mur fin)* « On entend tout à travers, et cette nuit on a tout entendu. Le groupe vit bien ; il faut juste qu'il dorme. »
← **Je change les chambres** — vestiaire +, direction − — *Le plan de chambres est refait à minuit. Deux joueurs ne se parlent plus, mais ils dorment.* → **On dort quand même** — force +1, vestiaire − — *Personne ne dort. L'échauffement est très silencieux.* · Traces : — · Lu par : ch. 14 (les deux clans), § 3.12

**`co.dec.hotel_ascenseur`** · l'hôtel, ascenseur bloqué · tous · cd 35 · —
**VOGLER** *(entraîneur adverse — sourire — casquette, survêtement, il tient la porte)* « L'ascenseur ne fait que quatre personnes et nous sommes deux staffs. On court, on presse, on chante : on prend les escaliers ? »
← **On prend l'escalier** — force +1, vestiaire + — *Quatre étages avec l'adversaire. Vous parlez de latéraux gauches.* → **Après vous** — direction +, force −1 — *Il monte. Tu attends huit minutes avec vingt-deux personnes.* · Traces : — · Lu par : ch. 11 (Vogler), § 3.15

**`co.dec.hotel_facture_minibar`** · l'hôtel, départ, la note · entraineur, ds, president, selectionneur · cd 30 · —
**JOSIANE** *(secrétaire — noir — une note d'hôtel dépliée en accordéon)* « Le minibar de la chambre neuf a coûté plus que la chambre neuf. J'en ai vu passer, mais pas à ce prix, et pas en janvier. »
← **Le club paie** — caisse −−, vestiaire + — *Le club paie. Le minibar de la neuf est vide dès février.* → **Il paiera lui-même** — caisse +, vestiaire −− — *Le joueur paie. Il raconte l'histoire à chaque nouveau pendant six ans.* · Traces : — · Lu par : ch. 12, § 3.5

**`co.dec.hotel_fenetre_fanfare`** · l'hôtel, 3 h du matin, extérieur · tous · cd 35 · match à l'extérieur, `{rival}`
**GÉGÉ** *(capo — sourire — en bas, dans la rue, un tambour et onze personnes)* « Leur kop est venu jouer du tambour sous vos fenêtres, alors on est venus jouer sous les leurs. La tribune n'oublie rien, et elle ne dort pas. »
← **Rentrez, s'il vous plaît** — tribunes −, force +1 — *Ils rentrent en chantant plus bas. Le tambour continue deux rues plus loin.* → **Vous êtes fous** — tribunes ++, force −1 — *Le tambour dure jusqu'à quatre heures. Le club perd, et personne ne regrette.* · Traces : — · Lu par : ch. 13, § 3.2

### 2.10 Le port, la ville, le marché du dimanche (6)

Ce que la ville pense se lit au marché, chez le coiffeur, sur la vitrine du bar-tabac : la seule sonde de TRIBUNES qui ne passe pas par le stade.

**`co.dec.ville_marche_dimanche`** · le marché, 10 h · tous · cd 25 · —
**PAULETTE** *(abonnée — neutre — un cabas, une file d'attente derrière elle)* « Trois personnes m'ont parlé du match avant que j'achète mes poireaux, et aucune n'était contente. J'étais là en cinquante et un ; le marché parle avant le journal. »
← **Je fais la queue avec vous** — tribunes ++, direction − — *Tu écoutes vingt minutes. Tu apprends deux choses que le club ignore.* → **Je passe devant** — tribunes −, force +1 — *Tu passes. La file te regarde passer.* · Traces : — · Lu par : § 3.6, ch. 20

**`co.dec.ville_vitrine`** · le bar-tabac, vitrine · tous · cd 30 · —
**LE STAGIAIRE DE L'ÉCHO** *(presse locale — sourire — un scotch, une affiche)* « On affiche le classement en vitrine chaque lundi, et lundi dernier il a fallu du petit format. Vous voulez une phrase pour la légende ? »
← **Une phrase courte** — tribunes +, parole +1, promise — *Ta phrase tient dans la vitrine. Elle y reste six semaines.* → **Pas de phrase** — tribunes −, direction + — *Il affiche le classement tout seul. C'est plus dur à lire.* · Traces : — · Lu par : ch. 20, § 3.17

**`co.dec.port_bateau_puymarin`** · le port, l'embarcadère · tous · cd 35 · déplacement à Puymarin ou Île-Verte
**NORBERT** *(chauffeur — noir — le bus arrêté devant une passerelle)* « Il y a un bateau par jour et il part dans onze minutes, avec ou sans nous. Je conduis, je ne commente pas ; je ne nage pas non plus. »
← **On court** — force −1, vestiaire ++ — *Vingt-deux personnes courent avec des sacs. Le bateau attend deux minutes, pour rire.* → **On dormira sur place** — caisse −, vestiaire + — *Une nuit imprévue au bord de l'eau. Trois joueurs disent que c'était la meilleure.* · Traces : — · Lu par : ch. 14, § 6 (fd_ferry)

**`co.dec.ville_coiffeur`** · le salon de coiffure, samedi · joueur, entraineur · cd 30 · —
**CAMILLE** *(à la maison — sourire — elle montre une photo découpée dans un journal)* « Le coiffeur a ta photo au mur, entre un chanteur et un cheval. Tu rentres à quelle heure ; il ferme à sept heures. »
← **Je passe avant sept heures** — tribunes +, relation.camille +1 — *Tu y vas. Le coiffeur refuse d'être payé et parle du match de 1994.* → **Une autre fois** — tribunes − — *La photo jaunit. Le cheval, lui, est intemporel.* · Traces : — · Lu par : ch. 01 (Camille), § 3.13

**`co.dec.ville_ecole`** · une école de la ville · tous · cd 40 · —
**LÉA** *(presse — neutre — un carnet, trente enfants derrière elle)* « Une classe a écrit trente lettres au club et vingt-huit posent la même question. Vous confirmez que vous restez ? »
← **Je réponds aux trente** — tribunes ++, direction −, parole +1, promise — *Trente réponses écrites à la main. Deux finissent encadrées.* → **Je réponds à la classe** — tribunes + — *Une lettre pour trente. Elle est lue à voix haute et ça suffit.* · Traces : — · Lu par : ch. 20 (« On nous écrit »), ch. 30

**`co.dec.port_bookmaker`** · le bar du port · joueur, entraineur · cd 40 · année ≥ 1994
**LE BOOKMAKER DU PORT** *(voix — noir — une ardoise avec des cotes à la craie)* « Votre club est à cinq mille contre un pour le titre et deux personnes ont misé cent francs. Vous voulez savoir qui ? »
← **Je veux savoir** — direction −, tribunes +, set: pisteur — *Il te donne un prénom. Tu le connais très bien.* → **Ça ne me regarde pas** — vestiaire + — *Il efface la cote et en écrit une autre. La craie ne tient pas.* · Traces : pisteur ∃ · Lu par : ch. 11 (`pari_promu`), ch. 15, ch. 30

### 2.11 Le Congrès, la salle 3, l'hôtel du Lac (8)

Le pouvoir se joue dans les couloirs ; la salle est là pour que le couloir existe. Salle 3 : chaises orange, horloge qui avance de quatre minutes.

**`co.dec.congres_chaises`** · le Congrès, hall, juin · president_amateur, president, instance · cd 30 · —
**ROUX** *(président de district — sourire — il pose une écharpe sur trois chaises)* « Je garde trois places pour ma ligue depuis quatorze ans, au troisième rang, à gauche. Le district, c'est la base ; la base s'assoit tôt. »
← **Je m'assois avec vous** — direction +, tribunes + — *Trois cents délégués voient où tu t'assois. C'est le seul discours qui compte.* → **Je reste au fond** — direction − — *Il enlève une écharpe. Il la garde sur le bras toute la matinée.* · Traces : — · Lu par : ch. 15 (le Congrès), ch. 02

**`co.dec.salle3_horloge`** · salle 3, salle d'attente · tous · cd 35 · convocation en cours
**DAUZAT** *(secrétaire général — neutre — un dossier fermé sur les genoux)* « L'horloge de la salle trois avance de quatre minutes depuis mille neuf cent quatre-vingts et personne ne la règle. C'est dans le procès-verbal, en note de bas de page. »
← **Je la règle** — direction −, parole +1 — *Tu montes sur une chaise devant deux commissaires. Ils notent.* → **J'attends** — direction +, force −1 — *Tu attends quarante minutes. Trente-six, selon l'horloge.* · Traces : — · Lu par : ch. 15, ch. 11 (commission de discipline)

**`co.dec.congres_buffet`** · le Congrès, buffet, 12 h 30 · president, instance · cd 25 · —
**BERTHOMIER** *(président de la Fédération — sourire — une assiette vide dans une main, un verre plein dans l'autre)* « Le buffet du Congrès dit tout : regardez qui mange avec qui, et vous avez le vote. On verra ça après le Congrès, mais regardez maintenant. »
← **Je regarde** — direction +, vestiaire + — *Tu vois deux groupes et un homme seul. L'homme seul votera comme les deux groupes.* → **Je mange** — vestiaire −, caisse + — *Tu manges très bien. Tu apprends le résultat comme tout le monde.* · Traces : — · Lu par : ch. 15 (la Campagne), § 3.19

**`co.dec.lac_couloir_moquette`** · l'hôtel du Lac, couloir du troisième · instance · cd 30 · —
**BAMBINI** *(patron de la FédéMonde — sourire — il marche vite, deux personnes derrière lui)* « La moquette de ce couloir est si épaisse qu'on n'entend personne arriver, et c'est voulu. Le football unit le monde ; le couloir, lui, sépare. »
← **Je marche à côté de lui** — direction +, vestiaire − — *Tu fais soixante mètres à sa hauteur. Deux photographes le remarquent.* → **Je laisse passer** — vestiaire +, direction − — *Il passe. Les deux personnes derrière lui te regardent, elles.* · Traces : — · Lu par : ch. 15, ch. 02

**`co.dec.lac_petit_dejeuner`** · l'hôtel du Lac, 6 h · instance, president · cd 40 · `flag('vote_achete')` ou `flag('fede_dossier')`
**AMSEL** *(procureure — neutre — elle est assise en face, café noir, dossier fermé)* « J'ai pris le premier petit-déjeuner et j'ai vu descendre onze personnes dans cet ordre. Nous avons tout notre temps ; asseyez-vous. »
← **Je m'assois** — direction −, parole +1 — *Tu t'assois. Elle ne pose aucune question, ce qui est la question.* → **Je remonte** — direction +, vestiaire − — *Tu remontes. L'ascenseur met très longtemps.* · Traces : — · Lu par : ch. 15 (le raid à l'aube), ch. 30

**`co.dec.congres_badge`** · l'accueil du Congrès · president_amateur, president, instance · cd 30 · —
**LA PETITE JOSIANE** *(accueil — sourire — un badge dans une pochette plastique)* « Votre badge est bleu, donc pas le troisième étage, et celui-là est vert, donc partout. On m'a dit de ne pas les mélanger. »
← **Je prends le bleu** — direction −, tribunes + — *Tu restes en bas. Tout se décide en haut, et tu l'apprends tard.* → **Je prends le vert** — direction ++, parole −1 — *Tu montes. Quelqu'un remarque la couleur avant de remarquer toi.* · Traces : — · Lu par : ch. 13 (le badge vert), § 3.20

**`co.dec.salle3_chaise_orange`** · salle 3, la chaise du fond · tous · cd 40 · —
**COLLINE** *(arbitre — neutre — il attend, dossier sur les genoux, dos droit)* « Cette chaise a une fêlure et tout le monde s'assoit dessus, moi le premier. J'ai vu ; ça ne change rien à ce que j'écris. »
← **Je m'assois à côté** — direction +, relation.colline +1 — *Vous attendez ensemble. Aucun des deux ne parle du match.* → **Je reste debout** — force +1, relation.colline −1 — *Tu restes debout quarante minutes. Il note que tu es resté debout.* · Traces : — · Lu par : ch. 15 (Colline), ch. 02

**`co.dec.congres_micro`** · le Congrès, tribune, micro coupé · president, instance · cd 35 · —
**DAUZAT** *(secrétaire général — noir — un doigt sur une console, l'air ailleurs)* « Le micro de la tribune se coupe tout seul à la sixième minute, depuis toujours. C'est dans le procès-verbal : « incident technique », douze fois. »
← **Je parle cinq minutes** — direction +, tribunes + — *Tu finis à cinq minutes cinquante. Trois cents personnes remarquent la précision.* → **Je parle jusqu'au bout** — direction −, tribunes ++ — *Le micro coupe. Tu finis en criant, et on t'entend mieux.* · Traces : — · Lu par : ch. 15 (la Campagne), § 3.19

### 2.12 La pelouse, la tribune Est, le panneau (8)

Le décor est un personnage : une pelouse qui a un avis, une tribune Est où Paulette a sa place, un panneau qui change de nom plus souvent que l'équipe.

**`co.dec.pelouse_taupe`** · la pelouse, jeudi · tous · cd 30 · —
**LULU** *(gardien du stade — noir — une taupinière au point de penalty)* « Il y a une taupe sous le point de penalty et elle a gagné deux fois contre moi. Le chien la cherche ; le chien est très mauvais. »
← **Appelez quelqu'un** — caisse −, direction + — *Un homme vient avec une boîte. La taupe déménage de trois mètres.* → **Laissez-la** — tribunes +, force −1 — *Le penalty du dimanche part de travers. Personne ne parle de la taupe.* · Traces : — · Lu par : § 3.14, § 6 (fd_taupe)

**`co.dec.tribune_est_14b`** · la tribune Est, place 14B · tous · cd 35 · année ≤ 2009
**PAULETTE** *(abonnée — sourire — elle époussette un siège avec un mouchoir)* « Quatorze B, c'est la mienne, et quatorze A, c'était la sienne, à la soixante-dixième. J'étais là en cinquante et un ; je serai là dimanche. »
← **Je m'assois en 14A** — tribunes +, vestiaire + — *Tu regardes vingt minutes de match à côté d'elle. Elle commente très bien.* → **Je vous laisse** — tribunes + — *Elle pose son mouchoir sur le 14A. Le siège reste propre.* · Traces : — · Lu par : ch. 30 (ta_loge, jubile plus), ch. 01, § 3.6

**`co.dec.panneau_naming`** · le stade, le panneau d'entrée · tous · cd 30 · `flag('naming_signe')`
**GÉGÉ** *(capo — noir — il regarde des lettres orange, très hautes)* « Le nom du sponsor est en haut, le nôtre en dessous, en petit, et en dessous il n'y a rien. La tribune n'oublie rien, surtout ce qui est écrit petit. »
← **On agrandit le nôtre** — caisse −, tribunes ++ — *Les lettres du club doublent. Le sponsor demande pourquoi, poliment.* → **C'est le contrat** — tribunes −−, caisse + — *Le panneau reste. Le virage chante l'ancien nom pendant six ans.* · Traces : — · Lu par : ch. 11 (arc Ilyas), ch. 13, ch. 20

**`co.dec.pelouse_arrosage`** · la pelouse, 11 h, veille de match · entraineur, ds, president · cd 30 · —
**LULU** *(gardien du stade — sourire — une vanne d'arrosage sous la main)* « Je peux l'arroser beaucoup ou pas du tout, et les deux sont légaux. Le chien préfère beaucoup ; moi, je fais ce qu'on me dit. »
← **Beaucoup** — force +1, direction −, tribunes − — *Le terrain est gras. L'adversaire glisse ; vous aussi, un peu moins.* → **Comme d'habitude** — direction +, vestiaire + — *Le terrain est parfait. L'arbitre le note, ce qui n'arrive jamais.* · Traces : — · Lu par : ch. 11, ch. 13

**`co.dec.tribune_travaux`** · la tribune Nord, tôle et échafaudage · tous · cd 35 · `flag('tribune_a_renover')`
**JOSIANE** *(secrétaire — neutre — un devis à deux pages, la deuxième dessous)* « Le devis de la tribune date de trois étés et il n'a pas vieilli, lui. J'en ai vu passer, des devis ; celui-là est toujours à la même page. »
← **On signe cet été** — caisse −−, tribunes ++, promise — *Le devis est signé. L'échafaudage arrive deux ans plus tard, et il reste.* → **L'été prochain** — tribunes −, caisse + — *Elle range le devis dans le tiroir du bas. Il connaît le chemin.* · Traces : tribune_a_renover ∃ · Lu par : ch. 11, ch. 13, ch. 20

**`co.dec.stade_horloge_arretee`** · le stade, l'horloge du fronton · tous · cd 40 · —
**LULU** *(gardien du stade — neutre — la tête levée vers un cadran arrêté)* « L'horloge du fronton est arrêtée sur quatre-vingt-dix depuis la montée, et personne n'a demandé qu'on la répare. Le chien s'assoit dessous, allez savoir. »
← **On la répare** — caisse −, tribunes − — *L'horloge repart. Le stade trouve ça triste sans savoir pourquoi.* → **Elle a raison** — tribunes ++ — *Elle reste sur quatre-vingt-dix. Deux tatouages en ville reproduisent le cadran.* · Traces : — · Lu par : § 6 (fd_horloge), ch. 20

**`co.dec.stade_chien_corner`** · le stade, avant l'entraînement · tous · cd 25 · —
**LULU** *(gardien du stade — sourire — il siffle un chien qui traverse la surface)* « Il s'appelle Corner parce qu'il ne va jamais au milieu, jamais. Le chien, lui, connaît le règlement mieux que la ligue. »
← **Il peut rester** — vestiaire ++, force −1 — *Corner assiste à toute la séance. Il rapporte deux ballons et en cache un.* → **Sortez-le** — force +1, vestiaire − — *Corner sort. Il aboie du parking pendant une heure et vingt minutes.* · Traces : — · Lu par : § 3.14, § 6 (fd_corner)

**`co.dec.stade_sono`** · le stade, la sono, avant le coup d'envoi · tous · cd 30 · —
**NINO** *(sous-capo — noir — un câble débranché dans la main)* « La sono passe une chanson que le virage déteste depuis trois ans, et le virage la couvre en chantant plus fort. Le virage attend mal, mais il chante bien. »
← **On change la chanson** — tribunes ++, direction − — *La nouvelle chanson est reprise par tout le stade. Le sponsor déteste.* → **La sono décide** — tribunes −, caisse + — *La chanson passe. Elle est couverte, comme d'habitude.* · Traces : — · Lu par : ch. 13, § 3.2

### 2.13 Le restaurant, la boucherie, le bistrot (7)

On mange beaucoup, et jamais gratuitement : le restaurant du port est le bureau de Fardelli, la boucherie un sponsor, le bistrot la jauge TRIBUNES de l'amateur.

**`co.dec.resto_port_addition`** · le restaurant du port · joueur, entraineur, ds, president · cd 25 · —
**FARDELLI** *(agent — sourire — il pose la main à plat sur l'addition)* « J'ai réservé, j'ai commandé, et je vais payer, ce qui n'engage à rien. Mon ami, on parle d'argent ou d'amitié ? »
← **Je paie ma part** — caisse −, direction +, parole +1 — *Il laisse faire, l'air déçu. Il note quelque chose sur son téléphone.* → **Merci pour l'addition** — caisse +, direction − — *Il paie tout. Il rappellera dans onze jours, à midi.* · Traces : — · Lu par : ch. 02 (Fardelli), § 3.17

**`co.dec.boucherie_maillot`** · la boucherie, samedi matin · amateur, president_amateur, president · cd 30 · —
**DUPUIS** *(boucher, sponsor — sourire — un maillot rose plié entre deux jambons)* « J'ai fait imprimer mon nom en lettres de huit centimètres, et j'ai payé les crampons. Le meilleur du cochon, et je pèse mes mots. »
← **Six centimètres** — caisse −, tribunes +, relation.dupuis −1 — *Il accepte, vexé. Les lettres font sept, il n'a rien dit.* → **Huit, très bien** — caisse ++, tribunes −, set: boucher_sponsor — *Le maillot rose entre sur le terrain. La ville en parle six mois.* · Traces : boucher_sponsor ∃ · Lu par : ch. 13, ch. 11, ch. 20

**`co.dec.bistrot_comptoir`** · le bistrot du village, 19 h · joueur_amateur, president_amateur · cd 25 · —
**DÉDÉ** *(coach bénévole — neutre — deux verres, un plein, un vide)* « Le comptoir a décidé que tu jouais milieu, et le comptoir ne s'est trompé que deux fois depuis quatre-vingts. Bon, on va pas se mentir : il a souvent raison. »
← **J'écoute le comptoir** — tribunes ++, vestiaire − — *Tu joues milieu. Le comptoir en parle jusqu'à Noël.* → **Je joue où je veux** — vestiaire +, tribunes −− — *Le comptoir se tait. Il te regarde jouer avec beaucoup d'attention.* · Traces : — · Lu par : ch. 10 (jauge TRIBUNES amateur), ch. 30 (am_comptoir)

**`co.dec.resto_solvang_eau`** · un restaurant sobre, midi · joueur, ds, entraineur · cd 30 · année ≥ 2000
**SOLVANG** *(agente — neutre — une carafe d'eau, un carnet, rien d'autre sur la table)* « Je prends de l'eau et je note tout, ça fait gagner du temps à tout le monde. Mon client décide ; moi, je compte. »
← **Notez tout** — direction +, caisse + — *Elle note. Elle t'envoie la même page par courrier, signée.* → **On parle sans papier** — vestiaire +, direction − — *Elle referme le carnet. Elle se souvient très bien quand même.* · Traces : — · Lu par : ch. 02, ch. 12

**`co.dec.resto_dembo_table`** · un restaurant très éclairé, 23 h · joueur, entraineur, ds · cd 30 · —
**DEMBO** *(avant-centre — sourire — quatorze personnes à sa table, dont deux qu'il ne connaît pas)* « On est quatorze, il en est venu six que je ne connais pas, et c'est moi qui régale. Donne-moi le ballon, je m'occupe du reste, et de l'addition. »
← **Je m'assois deux minutes** — vestiaire +, tribunes + — *Tu restes une heure. Deux photos sortent le lendemain, floues.* → **Je passe mon chemin** — force +1, relation.dembo −1 — *Il lève son verre vers toi de loin. Il raconte l'histoire autrement.* · Traces : — · Lu par : ch. 10, ch. 12, ch. 20

**`co.dec.boucherie_fils`** · la boucherie, l'arrière-boutique · amateur, president_amateur · cd 40 · —
**DUPUIS** *(boucher — noir — il désigne un jeune homme en tablier, qui regarde ailleurs)* « Mon fils découpe très mal et il joue très mal, mais il joue mieux qu'il ne découpe. Le meilleur du cochon, et je pèse mes mots. »
← **Il jouera samedi** — caisse +, vestiaire −− — *Il joue quarante minutes. Le club touche un congélateur neuf.* → **Il apprendra le métier** — vestiaire +, caisse −, relation.dupuis −1 — *Le tablier reste. Le maillot rose met un an à revenir.* · Traces : — · Lu par : ch. 13, ch. 10

**`co.dec.bistrot_ecran`** · le bar du coin, écran neuf · tous · cd 35 · année ≥ 2003
**GÉGÉ** *(capo — noir — devant un écran qui montre un autre match)* « Ils ont mis le match du dimanche soir sur l'écran et notre match, personne ne le montre. La tribune n'oublie rien ; elle regarde par la fenêtre. »
← **On paie l'abonnement au bar** — caisse −, tribunes ++ — *Le bar diffuse le club. Il est plein à quatorze heures un mardi.* → **Qu'ils regardent l'autre** — tribunes −, direction + — *L'écran montre les autres. Douze personnes vont au stade quand même.* · Traces : — · Lu par : ch. 13, ch. 20 (Télé-Stade)

### 2.14 La maison (4)

Quatre seulement : la maison n'est pas un décor, c'est la cinquième jauge, et on n'y rit jamais aux dépens de Camille ni de Sacha.

**`co.dec.maison_repas_froid`** · la cuisine, 23 h 10 · tous · cd 25 · `!flag('divorce')`
**CAMILLE** *(à la maison — neutre — une assiette recouverte d'une autre assiette)* « J'ai gardé le tien au chaud jusqu'à neuf heures, puis je l'ai gardé tout court. Tu rentres à quelle heure, la prochaine fois ? »
← **Je le mange froid** — relation.camille +1, force −1 — *Tu manges froid en face d'elle. Elle raconte sa journée, et c'est mieux que le repas.* → **J'ai déjà mangé** — relation.camille −1, direction + — *Elle range l'assiette. Elle ne la ressort pas.* · Traces : — · Lu par : ch. 01 (paliers Camille), ch. 30

**`co.dec.maison_dessin_sacha`** · le frigo, un dessin scotché · tous · cd 30 · `flag('sacha_nee')` et Sacha ≥ 6 ans
**SACHA** *(ton enfant — sourire — un dessin où le stade est plus grand que la maison)* « J'ai dessiné le stade et la maison, et le stade est plus grand parce que c'est vrai. Tu m'as promis qu'on irait ensemble. »
← **Dimanche, ensemble** — relation.sacha +1, direction −, promise — *Vous y allez. Elle s'ennuie à la mi-temps et s'en souvient toute sa vie.* → **Bientôt** — relation.sacha −1, direction + — *Le dessin reste sur le frigo. La maison y rétrécit d'année en année.* · Traces : — · Lu par : ch. 90 (lignée), ch. 30

**`co.dec.maison_valise_couloir`** · le couloir de la maison · tous · cd 40 · saison ≥ 2, relation.camille ≤ 0
**CAMILLE** *(à la maison — noir — une valise ouverte, vide, posée à plat)* « La valise est sortie du placard pour un déplacement, et elle est restée dans le couloir trois semaines. Tu rentres à quelle heure ; je demande pour la valise. »
← **Je la range** — relation.camille +1, direction − — *Tu la ranges. Le couloir redevient un couloir.* → **Je repars jeudi** — relation.camille −1, force +1 — *La valise reste ouverte. Elle se remplit toute seule, un peu chaque jour.* · Traces : — · Lu par : § 4.2 (la valise), ch. 01, ch. 30 (en_valise)

**`co.dec.maison_telephone_clow`** · le téléphone du salon, dimanche soir · entraineur, joueur · cd 35 · Corven vivant (année ≤ 2000)
**CORVEN** *(le mentor — sourire — au téléphone, un verre qu'on entend poser)* « J'ai regardé ton match sur un poste qui ne prend qu'une chaîne et demie. Je ne dirais pas que j'ai tout vu. Je dirais que j'étais devant. »
← **Dis-moi ce que tu as vu** — vestiaire +, force +1, relation.clow +1 — *Il parle onze minutes du même joueur. Il a raison sur dix.* → **Une autre fois, il est tard** — relation.clow −1, direction + — *Il dit « bien sûr ». Il rappelle quinze jours plus tard, plus court.* · Traces : — · Lu par : ch. 11 (`clow_ingrat`), § 3.4

---

## 3. Les vingt running gags

**Règle du gag.** Deux fois par saison au plus, jamais deux d'affilée, et il **vieillit** : quatre âges (S0 découverte, S1 confirmation, S2+ variation, lignée héritage). Le troisième passage doit être tordu, sinon le gag meurt. Jamais plus d'une jauge. Ids : `co.gag.<gag>_<s0|s1|s2|lignee>`.

**3.1 La faute de Vaubourg.** Il écrit « convocqué » depuis 1991 et ne corrige jamais ; le SMS de 23 h 47 la contient. *S0* : elle est au tableau du vestiaire, personne n'ose. *S1* : elle est dans ton SMS de licenciement (`co.dec.bureau_sms_faute`, trace `faute_lue`). *S2+* : son successeur la recopie, par respect. *Lignée* : la faute est gravée sur la plaque du parking, en bronze, et le club refuse de la refaire. Lu par ch. 30 (`en_sms` plus), ch. 20.

**3.2 Le journal rangé « sous les autres ».** Josiane range toute Une qui te concerne sous la pile (`co.re.josiane_a_lu` ∃). *S0* : elle le range et le dit. *S1* : elle le range sans le dire, et tu vois le coin dépasser. *S2+* : elle en garde un double « pour le dossier » (tiroir du bas). *Lignée* : sa nièce le met dessus, exprès (`co.dec.bureau_petite_josiane`). Lu par ch. 20, ch. 02.

**3.3 La canette orange d'Ilyas.** Il en pose toujours deux, il n'en ouvre jamais aucune. *S0* : la canette est sur ton bureau après son départ. *S1* : il t'en offre une, tu la gardes fermée. *S2+* : le distributeur du couloir ne vend plus que ça. *Lignée* : au musée du club, une canette non ouverte sous verre, avec la date. Lu par ch. 11 (arc Ilyas), ch. 13, ch. 20.

**3.4 Le « devant » de Corven.** « Je ne dirais pas que j'étais un grand. Je dirais que j'étais devant. » *S0* : il le dit de lui. *S1* : il le dit de toi, une fois, et se reprend. *S2+* : il le dit d'un joueur que tu n'as pas retenu. *Lignée* : après sa mort, son fils le dit de son père ; la plaque du buste porte la phrase avec « devant » entre guillemets. Lu par ch. 01, ch. 30 (Panthéon).

**3.5 « Ici, on payait en bières ».** Gérard convertit toute somme en bières. *S0* : la buvette. *S1* : il convertit ton salaire, à voix haute, devant témoins. *S2+* : il convertit une indemnité de transfert (« quatre-vingt mille bières »). *Lignée* : le tarif de la buvette des anciens est affiché en bières, avec une équivalence en écus, en petit. Lu par ch. 13, ch. 30 (`pa_buvette`).

**3.6 « J'étais là en cinquante et un ».** Paulette date tout. *S0* : elle date le stade. *S1* : elle date ton prédécesseur (« lui aussi disait ça »). *S2+* : elle refuse de dater le nouveau nom du stade. *Lignée* : elle meurt en 2009 à la 70e ; la tribune Est garde la 14B libre, et quelqu'un y pose un mouchoir chaque dimanche. Lu par ch. 01, ch. 30 (`ta_loge`).

**3.7 Le seau de Vaz.** Il s'assoit dessus parce que le banc est trop loin du terrain. *S0* : on découvre le seau. *S1* : le seau est numéroté (« seau 4 ») et voyage en soute. *S2+* : un club lui interdit le seau ; il s'assoit par terre. *Lignée* : un seau est vendu aux enchères pour l'association du club, et il n'est pas le bon. Lu par ch. 11, ch. 12, ch. 30 (`en_seau`).

**3.8 « Regardez la cassette ».** Vaz le dit encore en 2035, quand plus personne n'a de magnétoscope. *S0* : la cassette existe. *S1* : la cassette est vierge, il la commente quand même. *S2+* : il demande « la cassette » à un analyste qui lui tend une tablette ; il refuse. *Lignée* : à sa retraite, il offre sa cassette vierge à un successeur (objet héritable, ch. 12). Lu par ch. 12, ch. 11.

**3.9 Le radiateur qui tousse.** Il tousse au club, à la Fédération, à l'hôtel du Lac. *S0* : le promu n'a pas payé le chauffage. *S1* : le même bruit dans un bureau de la Fédération. *S2+* : un radiateur neuf tousse au bout de trois semaines. *Lignée* : le seul radiateur silencieux du monde est dans le bureau que tu quittes. Lu par ch. 02 (retrouvailles Josiane), ch. 11, ch. 15.

**3.10 Le fax et « transfet ».** Le fax de `{club}` écrit faux depuis 1998 ; Josiane corrige à la main. *S0* : la faute. *S1* : un club adverse retourne le fax en soulignant la faute. *S2+* : le fax meurt en 2010 ; le courriel reprend la faute, par copier-coller. *Lignée* : la faute est dans le pied de page du site du club en 2035. Lu par ch. 12, ch. 20.

**3.11 Le sifflet de Rouvier.** Elle siffle la fin de l'entraînement que tu voulais prolonger. *S0* : elle siffle. *S1* : tu ranges le sifflet dans un tiroir ; il revient. *S2+* : elle le prête à un jeune kiné qui n'ose pas s'en servir. *Lignée* : le sifflet est légué avec une note : « Respire. Encore. » Lu par ch. 01, § 4.3, ch. 30.

**3.12 « Le groupe vit bien ».** Bréhaut le dit surtout quand c'est faux. *S0* : il le dit et c'est vrai. *S1* : il le dit après une bagarre au vestiaire. *S2+* : devenu DS, il le dit d'un groupe qu'il n'a pas vu depuis six mois. *Lignée* : il le dit une dernière fois à la buvette des anciens, en 2044, et il a raison. Lu par ch. 01, ch. 12, ch. 30.

**3.13 « J'en ai vu d'autres » — l'inventaire de Vecchio.** À chaque catastrophe, il compare. *S0* : « j'en ai vu d'autres ». *S1* : « j'en ai vu d'autres, pas celle-là ». *S2+* : il tient une liste écrite, à la main, sur la doublure de son sac. *Lignée* : à sa mort (2031), on trouve la liste ; elle compte quatre-vingt-onze lignes, et la première est de 1968. Lu par ch. 01, ch. 30.

**3.14 Corner, le chien de Lulu.** Il ne va jamais au milieu du terrain. *S0* : il traverse une séance. *S1* : il cache un ballon et le rend en mars. *S2+* : il refuse d'entrer sur le synthétique neuf (`fusion_imposee`, ch. 13). *Lignée* : un deuxième chien lui succède ; il s'appelle Corner aussi, tout le monde trouve ça normal. Lu par ch. 13, § 6.

**3.15 Les plantes vertes de l'hôtel du sponsor.** Vingt-deux, puis vingt-trois (ch. 14). *S0* : quelqu'un les compte. *S1* : il y en a vingt-trois, personne n'explique. *S2+* : une plante est en plastique, comme celle de Malbec, et trois personnes l'arrosent. *Lignée* : l'hôtel ferme ; une plante suit un dirigeant dans son bureau. Lu par ch. 14, ch. 02, § 2.7.

**3.16 Le distributeur du 5.** *S0* : quelqu'un y va seul. *S1* : ils y vont à trois (`distributeur_groupe`). *S2+* : ils n'y vont plus, ils regardent leur téléphone, ce qui est pire parce que c'est silencieux. *Lignée* : le centre commercial ferme en 2038 ; le distributeur reste, seul, éclairé. Lu par ch. 11 (alarme vestiaire), ch. 10, ch. 20.

**3.17 Le stagiaire de l'Écho.** Il change de prénom chaque saison et reste « le stagiaire ». *S0* : il pose une question naïve et juste. *S1* : c'est un autre ; personne ne le remarque. *S2+* : un ancien stagiaire est devenu rédacteur en chef ailleurs et te rappelle sa question. *Lignée* : en 2050, L'Écho n'a plus qu'un stagiaire, et c'est tout le journal. Lu par ch. 20, § 2.10.

**3.18 La minute de silence mal comptée.** L'arbitre ajoute toujours une minute. *S0* : cinquante-cinq secondes, quelqu'un râle. *S1* : une minute dix, personne ne bouge. *S2+* : deux minutes, et le stade tient. *Lignée* : à la mort de Vecchio (2031), Colline, en tribune, regarde sa montre et ne dit rien. Lu par ch. 30, ch. 01.

**3.19 « On verra ça après le Congrès ».** Berthomier reporte tout au Congrès. *S0* : il le dit et le Congrès a lieu. *S1* : il le dit après le Congrès. *S2+* : Dauzat le dit à sa place, avec le numéro de page. *Lignée* : sur sa tombe (2029), la Fédération fait graver la date du Congrès suivant, par habitude administrative. Lu par ch. 15, ch. 02.

**3.20 Le badge qui n'ouvre pas.** *S0* : ton badge n'ouvre pas la porte du couloir. *S1* : il ouvre la porte, pas l'ascenseur. *S2+* : le badge vert ouvre tout et rend impoli. *Lignée* : tu rends le badge le dernier jour ; il ouvre encore, pendant six ans, et personne ne le sait. Lu par ch. 13, ch. 15, ch. 30 (fins DIRECTION).

---

## 4. Les huit objets qui reviennent

Un objet FUSIBLE change de main (il raconte une relation), ne vaut rien (le donner coûte autre chose que de l'argent) et survit à celui qui le portait (il finit dans une épitaphe). Chacun a une carte de passation (`co.obj.<objet>_<mot>`) et une ligne d'Almanach.

**4.1 Le cahier** (ANECDOTE `31.cahier` · objet). Le cahier de l'entraîneur : quadrillé, couverture noire, une page par joueur, la dernière page réservée à ceux qu'il n'a pas pris. Vukić le garde quand il prend le banc ; il n'écrit pas dedans pendant un an. Carte : `co.obj.cahier_passation` — *← Je le laisse sur le bureau* / *→ Je l'emporte* (direction ±, relation.vukic ±1). Almanach : « {annee} : le cahier a changé de main. La dernière page était pleine. » Lu par ch. 11, ch. 30 (`en_dauphin`).

**4.2 La valise** (`31.valise` · objet). Deux valises dans le monde : celle de Camille (le couloir, `co.dec.maison_valise_couloir`) et celle de l'hôtel du Lac (l'enveloppe qui a grandi). Elles ne se rencontrent jamais dans une même carrière ; si les deux existent, la fin est `en_valise` et l'épitaphe cite le couloir, pas l'hôtel. Almanach : « {annee} : une valise est restée trois semaines dans le couloir. » Lu par ch. 13, ch. 15, ch. 30.

**4.3 Le sifflet** (`31.sifflet` · objet). Celui de Rouvier, en plastique, jauni, marqué d'un point de vernis rouge. Il siffle la fin de ce que tu voulais prolonger. Carte : `co.obj.sifflet_lègue` (année ≥ 2014, quand elle ouvre son cabinet) — *← Je le prends* / *→ Qu'il reste au club* (vestiaire +, relation.rouvier ±1). Almanach : « {annee} : le sifflet du kiné a changé de cou. » Lu par ch. 01, ch. 11, ch. 14.

**4.4 Le brassard** (`31.brassard` · objet). Tissu élastique, cousu deux fois, il a la taille du bras de celui de 1994. On ne le donne pas : on le pose sur un banc et quelqu'un le prend. Carte : `co.obj.brassard_pose` — *← Je le pose sur le banc* / *→ Je le donne en main propre* (vestiaire ±, trace `capitaine` ∃). Almanach : « {annee} : le brassard est resté deux jours sur le banc. » Lu par ch. 10, ch. 14, ch. 30.

**4.5 L'écharpe** (`31.echarpe` · objet). Celle de Gégé, tricotée en 1971 par sa mère pour son père, interdit de stade. Elle ne se lave pas. Si `pacte_gege` tient à la fin de la carrière, il la pose sur ton siège ; s'il est à −3, il la brûle dans un seau et t'envoie la photo. Carte : `co.obj.echarpe_rendue` (trace `echarpe_rendue`). Almanach : « {annee} : l'écharpe de soixante et onze a changé d'épaule. » Lu par ch. 30 (`en_otage`, `grand_deballage`), ch. 90.

**4.6 L'enveloppe** (`31.enveloppe` · objet). Kraft, format commercial, jamais fermée : « pour que tu puisses regarder sans t'engager ». Elle grandit avec les décennies : enveloppe (1990), sacoche (2005), valise (2015), virement d'une fondation (2030) — et redevient une enveloppe en 2045, parce que c'est plus sûr. Traces `enveloppe_promise` ∃ / `enveloppe_refusee` ∃. Almanach : « {annee} : une enveloppe est restée ouverte sur une table. » Lu par ch. 11, ch. 13, ch. 15, ch. 30.

**4.7 La boîte en fer** (`31.boite` · objet). La caisse de Gérard : une boîte à gâteaux, un élastique, un carnet à spirale dedans. Quand « Gérard a fui », c'est elle qui manque, pas l'argent. Elle revient en 2005, vide, avec un mot d'excuse et quatre-vingt-douze francs qui n'ont plus cours. Almanach : « {annee} : la boîte est revenue. Le carnet aussi, moins deux pages. » Lu par ch. 13, ch. 30 (`pa_buvette`).

**4.8 La cassette** (`31.cassette` · objet). Celle de Vaz, vierge, étiquetée « FINALE » d'une écriture appliquée. Personne n'a jamais osé la lire. Carte : `co.obj.cassette_lue` (une fois par carrière, année ≥ 2020) — *← Je la lis* : quatre-vingt-dix minutes de neige, et une voix à la fin qui dit trois mots. *→ Je la garde fermée* : elle vaut plus fermée. Almanach : « {annee} : quelqu'un a lu la cassette. Il n'a rien voulu dire. » Lu par ch. 12, ch. 30.

---

## 5. Superstitions et rituels des clubs

Une superstition est une carte à un bouton servie la semaine d'un derby ou d'un Grand Match (`co.dec.rite_<club>`), et une ligne de Codex ; effet `+` au maximum.

| Club | Le rite | Ce qui se passe si on le rompt |
|---|---|---|
| AS Saint-Étoile | le capitaine touche la tôle de la Tribune Nord en sortant du tunnel | le virage chante moins fort une mi-temps (tribunes −) |
| Olympique Lyonnet | on entre sur le terrain par ordre de taille, du plus petit au plus grand | deux joueurs se disputent la place et jouent mieux (force +1, vestiaire −) |
| Capitale FC | le président ne descend jamais au vestiaire avant la 60e minute | il descend, tout le monde comprend qu'il a une annonce (direction +) |
| Olympique Marsange | l'équipe fait le tour du terrain avant l'échauffement, dans le sens du port | le vent tourne, dit-on ; le club invente une explication météorologique |
| US Valmont | on ne prononce jamais le mot « montée » avant avril | quelqu'un le dit en janvier, la ville en parle jusqu'en mai |
| Stade Valdorne | les jeunes du centre plient les maillots des pros le vendredi | un pro plie le sien, le centre le raconte pendant dix ans |
| Étoile Bretagne | le dernier arrivé au club paie le café de tout le monde, une fois | il refuse ; il paie deux fois plus tard, sans qu'on lui demande |
| FC Portclair | on grille deux cents merguez avant chaque huitième, depuis 1992 | on en grille cent ; le club perd, et personne n'accuse les merguez à voix haute |
| Racing de Valentienne | on ne ferme jamais complètement la porte du vestiaire | on la ferme, il fait deux degrés de plus et personne ne s'en plaint |
| Olympique Roquemont | l'entraîneur ne dit jamais son onze avant la veille à 19 h | il le dit le jeudi ; toute la ville le sait le jeudi soir |
| AS Villefranche | on repeint la ligne médiane la veille de chaque match, même propre | on ne la repeint pas ; le club gagne, et le rite meurt (tristement) |
| Stade Beaulieu | silence complet dans le tunnel : « on entend les consignes » | quelqu'un chante ; c'est la meilleure chose arrivée au club depuis 1986 |
| Sporting Néville | le gardien enfile le gant gauche en premier, toujours | il commence par le droit et encaisse tôt ; il en parle vingt ans |
| Stade Terrenoire | on frappe trois fois sur la tribune vétuste avant d'entrer | la tribune répond, ce qui inquiète tout le monde |
| Stade de Haute-Combe | on laisse une place vide au premier rang, pour le sanglier | on l'occupe ; le sanglier entre sur le terrain à la 22e (`sanglier_vu`) |
| FC Trébignac | Gérard ouvre la buvette avant l'échauffement, jamais après | il ouvre après ; l'équipe joue à jeun et perd 5-0, dit la légende |
| ES Boisnoir | on ne compte jamais les joueurs à voix haute avant le coup d'envoi | on compte ; il en manque un, et il manquait déjà |
| AS Mirevaux | les deux équipes, féminine et masculine, se serrent la main au portail | on saute l'étape ; le club le remet le mois suivant, en écrivant pourquoi |
| FC Corbelin | le kop récite un poème de quatre vers avant le coup d'envoi | ils en récitent cinq ; le cinquième devient la bâche de la saison suivante |
| US Puymarin | on embarque toujours avec le même marin, Fernand, à la barre | Fernand est malade ; le club perd et remercie quand même le remplaçant |

**Rituels de rôle** (une carte par carrière) : le joueur amateur porte les ballons la première saison (`am.tuto.copains` ∃) · l'entraîneur écrit le onze au crayon avant de l'écrire au stylo · le président amateur compte la caisse deux fois, à voix haute, avec un témoin · le sélectionneur laisse un maillot vierge dans le vestiaire, sans nom, « pour celui qui manque ».

---

## 6. Trente Nouvelles « à côté » (faits divers du monde)

Gabarit § 4.6, non datées : `co.nouvelle.fd_<mot>`, un bouton, effet ≤ `+`, jamais de méchanceté, jamais un fait réel. Une par saison au plus, `once`.

1. **`fd_taupe`** · **LULU** : « La taupe du point de penalty a été prise, photographiée et relâchée au rond-point. Le chien n'a rien vu venir. » — tribunes + — *Le penalty du dimanche rentre.*
2. **`fd_corner`** · **LÉA** : « Un chien nommé Corner a arrêté un tir en Régional 2 et le but a été refusé. Vous confirmez que c'est un arrêt ? » — tribunes + — *Le chien fait la Une de L'Écho, page trois.*
3. **`fd_merguez`** · **DUPUIS** : « Deux cents merguez ont battu le record du stade de la Jetée, et il en restait quatre. Le meilleur du cochon, et je pèse mes mots. » — caisse + — *Les quatre sont congelées pour l'an prochain.*
4. **`fd_horloge`** · **LE STAGIAIRE DE L'ÉCHO** : « L'horloge du fronton est arrêtée sur quatre-vingt-dix depuis douze ans et la ville a voté pour la laisser. Une pétition demandait la réparation ; elle a fait onze signatures. » — tribunes + — *La onzième était celle de l'horloger.*
5. **`fd_treizieme`** · **PICHON** : « On a retrouvé le treizième homme de la photo de soixante-quatorze ; il était venu pour l'électricité. Le pain, c'est à cinq heures ; il est resté sur la photo. » — tribunes + — *On l'invite au repas de fin de saison.*
6. **`fd_ferry`** · **NORBERT** : « Un club a raté le bateau et joué avec sept joueurs et deux dirigeants en short. Je conduis, je ne commente pas ; ils ont perdu 6-1. » — vestiaire + — *Les deux dirigeants ont couru quatre-vingt-dix minutes.*
7. **`fd_rond_point`** · **JOSIANE** : « Un car d'équipe a fait onze fois le tour du même rond-point avant de trouver la sortie. J'en ai vu passer ; celui-là a fait quatre kilomètres sur place. » — direction + — *La sortie était la première.*
8. **`fd_sanglier`** · **LÉA** : « Un sanglier est entré dans la surface à Haute-Combe et l'arbitre a arrêté le jeu six minutes. Vous confirmez qu'il y avait hors-jeu ? » — tribunes + — *Le sanglier est reparti par le tunnel, calmement.* (trace `sanglier_vu`)
9. **`fd_pigeon`** · **LULU** : « Un pigeon dort dans la lucarne du but sud depuis mars et il ne bouge pas quand ça tire. Le chien a renoncé. » — vestiaire + — *Le gardien lui parle avant chaque corner.*
10. **`fd_tondeuse`** · **LULU** : « La tondeuse a écrit un mot dans la pelouse et on ne sait pas lequel. Le chien tourne autour depuis deux jours. » — tribunes + — *La photo aérienne montre « ANO ». Personne ne sait.*
11. **`fd_maillots_laves`** · **MARINETTE** : « Les maillots sont revenus roses de la blanchisserie, tous les vingt-deux. Il y a des flans pour tout le monde ; des maillots blancs, non. » — tribunes + — *Le club joue en rose et gagne. Le rose reste en troisième maillot.*
12. **`fd_arbitre_lunettes`** · **COLLINE** : « Un collègue a arbitré un match entier avec les lunettes de son beau-frère. J'ai vu ; il a très bien arbitré. » — direction + — *Le beau-frère a récupéré ses lunettes à la mi-temps du retour.*
13. **`fd_but_vole`** · **PICHON** : « On nous a volé un but, les deux poteaux et la barre, un dimanche à l'aube. Le pain, c'est à cinq heures ; le vol, c'était à quatre. » — caisse − — *Le but est réapparu deux villages plus loin, repeint.*
14. **`fd_penalty_400`** · **DÉDÉ** : « Une séance de tirs au but de district a duré quarante-huit tirs et le boulanger a livré pendant. Bon, on va pas se mentir : personne ne voulait finir. » — vestiaire + — *Le gardien vainqueur a arrêté le vingt-quatrième.*
15. **`fd_mariage`** · **CAMILLE** : « Un couple s'est marié au rond central un samedi matin, entre deux matchs de jeunes. Tu rentres à quelle heure ; ils ont dansé jusqu'à midi. » — tribunes + — *Le témoin portait le maillot de son club, sous la veste.*
16. **`fd_ballon_mer`** · **LÉA** : « Un ballon parti d'un stade du port a été retrouvé sur une plage à quatre-vingts kilomètres. Vous confirmez que c'est le même ? » — tribunes + — *Il porte un tampon de 1993. Il est au local, dans le filet.*
17. **`fd_sponsor_pompes`** · **JOSIANE** : « Un club a signé avec une entreprise de pompes funèbres et personne n'a rien dit pendant six mois. J'en ai vu passer ; le maillot était très élégant. » — caisse + — *Le slogan disait : « Nous accompagnons ».*
18. **`fd_vestiaire_bloque`** · **VUKIĆ** : « Une équipe est restée enfermée dans son vestiaire vingt minutes et a joué la mi-temps entière en retard. Je te le dis parce que personne ne te le dira : la clé était dedans. » — vestiaire + — *Ils ont gagné. La clé est restée dedans, exprès, deux ans.*
19. **`fd_chevre`** · **ROUX** : « Un club de district a payé son bus avec une chèvre et la chèvre est devenue la mascotte. Le district, c'est la base ; la chèvre s'appelle Recette. » — caisse + — *Elle broute la pelouse le lundi ; ça coûte moins cher.*
20. **`fd_tribune_vide`** · **GÉGÉ** : « Un match a été joué à huis clos et onze supporters ont regardé depuis une grue louée à trois. La tribune n'oublie rien, surtout pas la facture. » — tribunes + — *La grue est revenue trois fois. Elle a un surnom.*
21. **`fd_maire_arbitre`** · **AUBERT** : « Un maire a arbitré un derby de village parce que personne d'autre n'était venu. Le stade, c'est de l'argent public ; le sifflet aussi, apparemment. » — direction + — *Il a sifflé un penalty contre son propre village. Il a été réélu.*
22. **`fd_prenom`** · **LE STAGIAIRE DE L'ÉCHO** : « Deux frères jumeaux portent le même prénom sur la feuille de match depuis six ans, par erreur administrative. Personne n'a jamais osé corriger. » — direction + — *L'un a marqué ; on ne sait pas lequel.*
23. **`fd_orage`** · **NORBERT** : « Un match a été arrêté par la grêle et repris quatre-vingts jours plus tard, à la 34e minute. Je conduis, je ne commente pas ; j'ai fait le trajet deux fois. » — force + — *Le score était le même. Le buteur avait changé de club.*
24. **`fd_photo_floue`** · **VENCE** : « La photo officielle a été reprise onze fois parce qu'un joueur clignait des yeux à chaque fois. On est en direct ; la douzième est parfaite, il est absent. » — vestiaire + — *Il a été ajouté au feutre, dans le coin.*
25. **`fd_supporter_fidele`** · **PAULETTE** : « Un homme a vu six cent quarante matchs d'affilée et il a manqué le six cent quarante et unième pour un mariage. J'étais là en cinquante et un ; il était là aussi. » — tribunes + — *Le club lui a envoyé la feuille de match, encadrée.*
26. **`fd_gardien_but`** · **VECCHIO** : « Un gardien de District a marqué de sa surface avec un dégagement et le vent. J'en ai vu d'autres ; celui-là, il l'a refait le dimanche suivant. » — vestiaire + — *Il a raté les deux cent trente suivants.*
27. **`fd_cageots`** · **DÉDÉ** : « La tribune de bois du village a été refaite avec des cageots du marché et elle tient depuis onze ans. Bon, on va pas se mentir : elle sent la pomme. » — tribunes + — *Le contrôle de sécurité est passé. Il a été bref.*
28. **`fd_billet_perdu`** · **LA PETITE JOSIANE** : « Un abonné a retrouvé son billet de mille neuf cent soixante-dix-huit dans un manteau et il est venu avec. On l'a laissé entrer, évidemment. » — tribunes + — *Il s'est assis à la place indiquée. Elle existait encore.*
29. **`fd_double_match`** · **BRISSAC** : « Un joueur a disputé deux matchs le même dimanche, dans deux clubs, à trente kilomètres. Les chiffres sont têtus : il a marqué dans les deux. » — direction + — *Il a été suspendu deux dimanches. Il en a profité pour dormir.*
30. **`fd_lettre_1954`** · **JOSIANE** : « Une lettre postée en cinquante-quatre est arrivée au club cette semaine et elle demandait un essai. J'en ai vu passer ; on lui a répondu. » — tribunes + — *L'expéditeur avait quatre-vingt-onze ans. Il est venu voir un entraînement.*

---

## 7. Soixante noms en réserve

Aucun ne collisionne avec la charte § 1.3, `content/names/fr.yaml` ni les voix des chapitres 01, 02, 10-15. À déclarer au chapitre 90 avant emploi.

**Joueurs et joueuses (20)** — Aïssa Vandel, ailière de Mirevaux, tire les corners des deux pieds · Ruben Costel, latéral, n'a jamais reçu de carton en douze ans · Milo Pasquet, gardien de 1,72 m, arrête tout sauf les frappes molles · Sélim Ourdi, milieu, joue avec une montre · Basile Ferrec, attaquant, marque uniquement en seconde période · Ilan Sorel, meneur (déjà cité ch. 01) · Noa Vandel, prodige d'après 2015 (ch. 01) · Théa Roussin, capitaine de la section féminine, infirmière le lundi · Ivo Brankić, défenseur dalmate, chante l'hymne de tout le monde · Kenzo Malard, ailier, transféré quatre fois en deux ans · Abel Ntsama, pivot, tient un carnet de tous ses adversaires · Lucien Vaury, milieu de 36 ans, entraîneur adjoint le soir · Sonia Delcourt, gardienne, première femme à jouer un match de District mixte (1997) · Timéo Bassin, latéral, joue pieds nus à l'entraînement · Jonas Ferreux, attaquant, refuse de tirer les penaltys · Amel Sadaoui, milieu, le seul à lire le règlement · Gaspard Nury, défenseur, se blesse à chaque photo officielle · Yann Kerhoas, ailier de Kerbrouck, joue mieux dans le sable · Rémi Talon, buteur de Régional devenu pro à 29 ans · Livia Marceau, milieu, capitaine à 19 ans.

**Arbitres (12)** — Hervé Sanglade, siffle très tôt, s'excuse très tard · Nour Belkacem, première femme au sifflet en D1 (2006) · Baptiste Ourdan, arbitre de touche, meilleur juge du pays, refuse le central · Gaël Prévôt, ne parle jamais aux entraîneurs · Solène Mercadier, arbitre et vétérinaire · Idris Fanon, deux mètres, tout le monde se tait · Léon Bacque, désignateur de 1990 à 2004 (« on ne discute pas d'un désignateur ») · Wilhelm Osset, arbitre vestre, siffle en chantant · Amandine Lorge, arbitre de la finale continentale 2031 · Pascal Vaury, frère de Lucien, ne s'en vante pas · Otto Kremm, arbitre du Mondial d'hiver 2030 · Bruno Cathala, le seul à avoir sifflé un penalty au Grand Stade contre Capitale FC dans les arrêts de jeu.

**Presse et écrans (12)** — Aimé Rossard (chroniqueur, déjà cité ch. 20) · Josette Pradel (ch. 20) · Maxence Larue (ch. 20) · Valérie Coste (ch. 20) · Carmen Douay, la voix du dimanche à Radio Tribune · Ferréol Mabon, photographe, une seule photo célèbre et il n'en parle jamais · Ninon Serval, cheffe des sports du Quotidien (2028) · Bastien Lorrain (ch. 01) · Aurèle Castan (ch. 01) · Isaure Vaneck, la première à commenter en flux sur Kick (2024) · Gilbert Ozenne, le rectificatif page douze, depuis 1971 · « le Rosé », éditorialiste anonyme de La Gazette Rose (voix, sans visage, note les présidents sur vingt).

**Villes, villages et lieux (16)** — Sombreuil (village de District, deux cents habitants, un terrain en pente) · Cavelac (ville d'eau, un club de curistes) · Pontarel (le pont, le bac, le terrain de l'autre côté) · Marnaval (ancienne mine, tribune de bois) · Vaubelle (banlieue de la Capitale, centre de formation privé, 2016) · Grandcourt (le club qui a fusionné trois fois) · Auroy (la ville du Tribunal du Sport, deux hôtels) · Salvagnac (Régional, terrain prêté par la coopérative) · Belle-Ancre (port, le club joue face au large) · Tourmens (ville de garnison, l'équipe change tous les trois ans) · Écurolles (le village qui a gagné la Coupe du district six fois) · Piégut (deux clubs, une rue, une haine) · Champsaure (la neige, comme Haute-Combe, en moins connu) · Roquevère (la carrière, la poussière blanche sur les maillots) · Lansargues (le rond-point des onze tours) · Verchamps (le stade au milieu des champs, la buvette dans une grange).

---

## 8. La couture

### 8.1 Les trois Nouvelles datées commandées par les chapitres 12 et 14

Le chapitre 20 écrit les quatre-vingt-sept Nouvelles datées ; trois manquaient, demandées ailleurs. Gabarit § 4.6, un bouton.

**`co.nv.2004_klopf`** · 2004 · tous rôles sauf `ds` où Vogler est ton entraîneur · arme `klopf_parti_vestrie` — **MASSENET** *(journaliste — une feuille d'agence à la main)* : « La Vestrie a nommé son entraîneur à casquette à la tête de la sélection, et il a accepté en trois minutes. Juste une question, hors micro : vous auriez dit oui ? » — **OK** (*Je note* / *Je note*) — direction + — *Il court déjà sur le tarmac. Il paraît qu'il chante dans l'avion.*

**`co.nv.2004_sylvanie`** · 2004 · tous rôles sauf `selectionneur` · arme `qualifie_sylvanie` — **VENCE** *(Télé-Stade — micro, plateau)* : « La Sylvanie s'est qualifiée pour le Continental avec onze joueurs qui travaillent, et le ministre a pleuré à l'antenne. On est en direct ; ils dansent sur la place. » — **OK** — tribunes + — *Cent mille personnes devant un écran du ministère. Le pays s'arrête deux jours.*

**`co.nv.2011_fiasco`** · 2011 · tous rôles sauf `selectionneur` · arme `lettre_groupe_publique` — **LÉA** *(presse — une photocopie à la main)* : « La lettre du groupe a été lue à voix haute avant d'être publiée, et le bus n'est jamais descendu. Vous confirmez que personne n'a bougé ? » — **OK** — vestiaire − — *La photo du bus fermé fait le tour du pays. Elle ressort à chaque fenêtre.*

### 8.2 Traces posées par ce chapitre (toutes lues ailleurs)

| Trace | Posée par | Lue par |
|---|---|---|
| `distributeur_groupe` | `co.dec.couloir_le_cinq` | § 3.16 ; ch. 11 (alarme VESTIAIRE, avec `salaires_retard`) ; ch. 20 (brève) |
| `faute_lue` | `co.dec.bureau_sms_faute` | § 3.1 ; ch. 30 (`en_sms` `epitaph_plus`) ; ch. 20 (manchette « LA FAUTE DU PATRON ») |
| `merguez_deux_cents` | `co.dec.buvette_merguez` | § 6 (`fd_merguez`) ; ch. 13 (Coupe du village) ; ch. 20 (brève) |
| `sanglier_vu` | § 6 (`fd_sanglier`), § 5 (rite de Haute-Combe) | ch. 14 (déplacement à Haute-Combe) ; ch. 20 ; Codex |
| `echarpe_rendue` | `co.obj.echarpe_rendue` (§ 4.5) | ch. 30 (`en_otage`, `grand_deballage`) ; ch. 90 (mémoire des clubs) |
| `klopf_parti_vestrie`, `qualifie_sylvanie`, `lettre_groupe_publique` | § 8.1 | ch. 12, ch. 14 (qui les ont commandées) |

Traces existantes réutilisées sans être doublées : `pharmacie_propre`, `boucher_sponsor`, `pisteur`, `tribune_a_renover`, `naming_signe`, `salaires_retard`, `gigi_staff`, `sacha_nee`, `divorce`, `ecoutes`, `fede_dossier`, `vote_achete`.

### 8.3 Index par personnage (qui parle, et où)

Gégé § 2.4, 2.5 ×4, 2.9, 2.12, 2.13 · Josiane § 2.1 ×3, 2.7 ×3, 2.9, 2.12, § 6 ×3 · Vecchio § 2.1, 2.2, 2.3 ×2, 2.6, § 6 · Norbert § 2.3 ×5, 2.10, § 6 ×2 · Lulu et Corner § 2.1, 2.4, 2.8, 2.12 ×4, § 6 ×3 · Paulette § 2.5, 2.6, 2.10, 2.12, § 6 · Gérard § 2.6 ×4 · Dupuis § 2.6, 2.13 ×2, § 6 · Dédé § 2.6, 2.13, § 6 ×2 · Pichon § 2.6, § 6 ×2 · Sabatier § 2.2 ×2, 2.9 · Rouvier § 2.1, 2.2 · Bréhaut § 2.1, 2.2, 2.9 · Vukić § 2.2, 2.4, 2.9, § 6 · Dembo § 2.2, 2.13 · Mbako § 2.3, 2.8 · Momo § 2.1, 2.2 · Nino § 2.4, 2.5 ×2, 2.12 · Marinette § 2.8 ×2, § 6 · Barbier § 2.8 · Brissac § 2.8 ×2, § 6 · Massenet § 2.4, § 8.1 · Fardelli § 2.4, 2.13 · Solvang § 2.13 · La Plume § 2.4 · Léa § 2.10, § 6 ×3 · le stagiaire de l'Écho § 2.10, § 6 ×2 · Vence § 6, § 8.1 · Vaubourg § 2.7 · Malbec § 2.7 · Dauzat § 2.7, 2.11 ×2 · Berthomier § 2.11 · Bambini § 2.11 · Amsel § 2.11 · Colline § 2.11, § 6 · Roux § 2.11, § 6 · la petite Josiane § 2.7, 2.11, § 6 · Aubert § 6 · Vogler § 2.9 · Camille § 2.10, 2.14 ×2, § 6 · Sacha § 2.14 · Corven § 2.14 · Ilyas (par le décor seul) § 2.12, § 3.3.

### 8.4 Questions ouvertes pour le showrunner et le chapitre 90

1. **Norbert, Lulu et Marinette** sont des voix sans portrait ici (deux à cinq cartes chacun, aucune relation) : Norbert dépasse le plafond de deux cartes de la charte § 2.3 — soit on lui ouvre une fiche de second rôle sans relation, soit on répartit ses répliques entre Vecchio et Josiane. Recommandation : lui laisser le bus, c'est le seul lieu qui n'a pas de voix.
2. **Corner** (le chien) est un « personnage » sans portrait ni relation : à confirmer côté moteur (locuteur `lulu`, le chien ne parle pas).
3. La trace `faute_lue` recoupe le SMS de 23 h 47 du chapitre 30 : vérifier qu'elle n'entre pas en conflit avec l'`epitaph_plus` d'`en_sms`.
4. `co.dec.rite_<club>` suppose que le moteur connaisse le club adverse d'un Grand Match (`world.adversaire`) : à confirmer, sinon les vingt rites deviennent des lignes de Codex.
5. Les vingt superstitions valent pour les clubs de la charte § 1.3 ; il manque un rite pour les huit sélections étrangères (chapitre 14 ?).
6. Les soixante noms de § 7 doivent être ajoutés à `content/names/` ou rester des voix ponctuelles : décision du chapitre 90.


---

## 9. Les quarante-deux enterrements

Une ligne par personnage à statut. **Type** : ligne d'Almanach (gabarit § 4.9), ≤ 120 caractères, servie une fois, l'année du décès, en brève de Une et dans le Codex. Chacune est armée par la trace `<id>_mort` (charte § 2.4 bis) et se lit au passé. Elles ne sont pas des cartes : elles sont ce qui reste quand la carte est passée. **Règle d'écriture** : l'année, le nom, et **un seul détail** — celui que personne d'autre n'aurait remarqué.

| # | id | Année | La ligne |
|---|---|---|---|
| 1 | `31.ent_clow` | 1995-2000 | « {annee} : Dan Corven est mort. Doudoune verte sur le cercueil, verre d'eau plein à côté, à ras bord. » |
| 2 | `31.ent_paulette` | 2009 | « 2009 : Mamie Paulette est morte à la 70e, tribune Est, place 14B. On ne l'a pas réveillée. » |
| 3 | `31.ent_dede` | 2012 | « 2012 : Dédé est mort. On a enterré le sifflet avec lui ; Bébert en a racheté un, plus aigu. » |
| 4 | `31.ent_roux` | 2014 | « 2014 : Firmin Roux est mort. Trois cents districts ont envoyé une couronne chacun ; il y en avait trois cent une. » |
| 5 | `31.ent_pichon` | 2019 | « 2019 : Roger Pichon est mort à quatre heures du matin. Le four était déjà chaud ; personne n'a su l'éteindre. » |
| 6 | `31.ent_gerard` | 2019 | « 2019 : Gérard est mort. On a trouvé la boîte en fer sous l'évier, avec le compte juste, à un franc près. » |
| 7 | `31.ent_legruet` | 2020 | « 2020 : Noé Berthomier est mort. L'enterrement a été reporté d'un jour : il y avait un Congrès. » |
| 8 | `31.ent_aulard` | 2020 | « 2020 : Jean-Marie Vaubourg est mort. Son fils a lu deux pages ; l'empire tenait sur une. » |
| 9 | `31.ent_montoya` | 2021 | « 2021 : Don Alvaro Montoya est mort à la table, pendant un vote qu'il gagnait. On a compté sa voix. » |
| 10 | `31.ent_barbier` | 2021 | « 2021 : Lucien Barbier est mort. Dans la doudoune, un carnet, et un nom de 1966 souligné deux fois. » |
| 11 | `31.ent_rossard` | 2022 | « 2022 : Aimé Rossard est mort devant une séance de tirs au but. Le cinquième n'avait pas encore tiré. » |
| 12 | `31.ent_bambini` | 2024 | « 2024 : Giancarlo Bambini est enterré à l'hôtel du Lac. Amsel est venue, à l'heure, et elle est restée. » |
| 13 | `31.ent_malbec` | 2024 | « 2024 : Hubert Malbec est mort. Il avait préparé son discours de président de la Fédération ; il est dans la poche. » |
| 14 | `31.ent_dupuis` | 2026 | « 2026 : Dupuis est mort. Le maillot rose est plié sur le cercueil ; le fils a fermé la boucherie une heure. » |
| 15 | `31.ent_brissac` | 2028 | « 2028 : Solange Brissac est morte. Le cahier à colonnes est à la Fédération, page soixante-deux, à jour. » |
| 16 | `31.ent_sabatier` | 2029 | « 2029 : le Doc Sabatier est mort. Le carnet du tiroir compte trente-deux lignes, toutes des refus. » |
| 17 | `31.ent_josiane` | 2030 | « 2030 : Madame Josiane est morte. Le classeur était rangé ; c'est comme ça qu'on a su qu'elle était partie. » |
| 18 | `31.ent_amsel` | 2030 | « 2030 : Judith Amsel est morte à six heures du matin. Elle avait tout son temps ; elle l'a pris entièrement. » |
| 19 | `31.ent_vecchio` | 2031 | « 2031 : Gigi Vecchio est mort un dimanche, à la 70e. L'arbitre a ajouté une minute, sans qu'on lui demande. » |
| 20 | `31.ent_gege` | 2032 | « 2032 : Gégé est mort, élu des socios depuis six mois. L'écharpe n'a jamais été lavée ; on ne l'a pas lavée. » |
| 21 | `31.ent_loco` | 2032 | « 2032 : Anselmo Vaz est mort devant une cassette. Le seau est resté à douze mètres de la télévision. » |
| 22 | `31.ent_meneche` | 2032 | « 2032 : Pierre Massenet est mort en direct, sur un plateau d'anciens. Le micro était ouvert ; il l'a toujours été. » |
| 23 | `31.ent_fardelli` | 2032 | « 2032 : Rocco Fardelli est enterré. Trois présidents, deux procureures, aucun joueur ; la gourmette au poignet. » |
| 24 | `31.ent_vialat` | 2032 | « 2032 : Madame Vialat est morte. Les comptes de la buvette de Trébignac tombent juste depuis douze ans. » |
| 25 | `31.ent_aubert` | 2035 | « 2035 : Madame Aubert est morte. Le ruban du dernier stade inauguré était dans un tiroir, coupé en deux. » |
| 26 | `31.ent_dauzat` | 2036 | « 2036 : Aurélien Dauzat est mort. Le dernier procès-verbal est signé de sa main, et il ne manque rien. » |
| 27 | `31.ent_klopf` | 2038 | « 2038 : Vogler est mort en courant, sur un tapis. Trois finales gagnées, et un seul kop qui a chanté. » |
| 28 | `31.ent_vukic` | 2038 | « 2038 : Zoran Vukić est mort. Le cahier est passé à son adjoint ; deux pages n'étaient pas de sa main. » |
| 29 | `31.ent_mere_mbako` | 2041 | « 2041 : la mère de Mbako est morte. Le carnet fait trois cents pages ; à la cent douzième, une berceuse. » |
| 30 | `31.ent_brehaut` | 2044 | « 2044 : Titi Bréhaut est mort. Sur le faire-part : « Le groupe vivait bien. » Personne n'a osé corriger. » |
| 31 | `31.ent_solvang` | 2044 | « 2044 : Ingrid Solvang est morte. Elle avait gardé le contrat de son premier client, dans une chemise fine. » |
| 32 | `31.ent_fauvel` | 2045 | « 2045 : Karim Fauvel est mort en tribune, debout, pendant un hymne. On ne l'a pas fait asseoir. » |
| 33 | `31.ent_dembo` | 2046 | « 2046 : Dembo est mort sur le banc des Ardoises. Corbelin a peint un poème dessus ; il finit par « le reste ». » |
| 34 | `31.ent_nassir` | 2046 | « 2046 : Cheikh Ilyas est mort dans une loge vide. Sur l'écran, une courbe, et le match en petit. » |
| 35 | `31.ent_colline` | 2046 | « 2046 : Colline est mort. Il vouvoyait tout le monde, y compris sa mère ; le faire-part la vouvoie aussi. » |
| 36 | `31.ent_mbako` | 2049 | « 2049 : Lian Mbako est mort. Sur le socle de la statue : « Je veux jouer. Maintenant. » Rien d'autre. » |
| 37 | `31.ent_camille` | selon la carrière | « {annee} : Camille est morte. Deux assiettes sur la table, une recouverte de l'autre, gardée au chaud. » |
| 38 | `31.ent_lea` | après 2050 | « Léa n'est pas morte pendant le jeu. Elle a enterré tout le monde, et elle a demandé à chaque fois : « Vous confirmez ? » » |
| 39 | `31.ent_rouvier` | après 2050 | « Nadia Rouvier a quatre-vingt-dix ans en 2050 et son cabinet est ouvert le samedi. « Respire. Encore. » » |
| 40 | `31.ent_la_plume` | après 2050 | « La Plume n'a pas de visage, donc pas de photo au carnet. On a publié un rectangle blanc, et c'était juste. » |
| 41 | `31.ent_vence` | après 2050 | « Nathalie Vence s'est retirée en 2035. Elle a refusé qu'on la filme ce jour-là ; c'était la première fois. » |
| 42 | `31.ent_sacha` | jamais | « Sacha ne meurt pas dans ce jeu. Elle hérite, et c'est pire pour tout le monde, à commencer par elle. » |

**Comment elles sortent.** Une ligne d'enterrement est servie **une fois**, l'année du décès, dans les brèves de la Une du Bilan si le joueur a une relation ≠ 0 avec le mort ; sinon elle entre au Codex sans être affichée. Elle n'annule ni ne remplace la **carte** d'enterrement, quand il y en a une (`co.clow.enterrement` ch. 01, `co.retrouvailles.dede_eglise` ch. 30, `31.ent_paulette` a la sienne au § 2.12) : la carte se joue, la ligne reste.

---

## 10. Les douze cartes-légendes

Une par saison au plus, jamais deux la même. **Type** : carte-légende (gabarit § 4.9), un bouton, aucune jauge, aucune trace ; elle raconte une chose du monde qui n'est arrivée à personne et que tout le monde connaît. C'est le seul endroit du jeu où le narrateur a le droit d'être joli. Servie au créneau [8] ou [13], condition d'année seulement, `once` par carrière.

| id | Année | Titre | Le texte (deux phrases, narrateur, tutoiement) |
|---|---|---|---|
| `co.leg.gardien_de_neville` | ≥ 1990 | Le gardien de Néville | « On raconte qu'un gardien de Néville a arrêté trois penaltys de suite en 1966, sous la pluie, devant un recruteur en doudoune. Le recruteur regardait ailleurs, et c'est pour ça que tu connais son nom à lui. » |
| `co.leg.merguez_de_portclair` | ≥ 1992 | Deux cents merguez | « La buvette de Portclair a brûlé la veille d'une demi-finale, avec deux cents merguez dedans et personne. Le club a gagné le match, et depuis, à Portclair, on dit qu'une buvette qui brûle porte chance. » |
| `co.leg.fete_de_marsange` | ≥ 1993 | Trois jours, trois ans | « Marsange a gagné la Coupe Continentale avec un budget de deuxième division, et le port a chanté trois jours. L'audit a duré trois ans, et il a trouvé une facture de mille sept cents couverts. » |
| `co.leg.but_du_sanglier` | ≥ 1994 | Le sanglier de Haute-Combe | « Un sanglier est entré dans la surface de Haute-Combe un dimanche de février, et le but a été refusé pour cause de sanglier. Le règlement ne dit rien là-dessus ; l'arbitre a écrit « évidence » dans son rapport. » |
| `co.leg.grand_stade` | ≥ 1996 | Les sièges qui se rabattent | « Le Grand Stade a quatre-vingt mille places et des sièges qui se rabattent tout seuls, ce qui fait un bruit de mer quand tout le monde se lève. Dans ton stade, les sièges ne se rabattent pas ; c'est pour ça qu'on sait qui est parti. » |
| `co.leg.fax_de_minuit` | 1996-2010 | Vingt-trois heures cinquante-huit | « Un transfert a été validé à vingt-trois heures cinquante-huit parce qu'un fax a mis quatre minutes à sortir une page. Le joueur a fait toute sa carrière dans un club qu'il n'avait pas choisi, et il y a une tribune à son nom. » |
| `co.leg.cassette_de_1967` | ≥ 1998 | La cassette de soixante-sept | « Il existe une cassette qu'un entraîneur a fait copier douze fois, et les douze copies ont le même défaut à la quarante-cinquième minute. Il prenait ça pour un signe ; personne n'a jamais osé lui dire que c'était le magnétoscope. » |
| `co.leg.le_but_en_or` | 1999-2003 | La règle qui gifle | « Pendant quatre ans, un but arrêtait le match tout de suite, comme une gifle, et le gardien restait seul dessus. La règle a disparu ; les gardiens qui l'ont prise, non. » |
| `co.leg.vaucastel_remonte` | ≥ 2009 | Quatre-vingts ans dans une chemise | « Vaucastel a déposé le bilan en 1992, quatre-vingts ans de club dans une chemise cartonnée, et a remonté en 2009. Le trésorier qui pleurait au téléphone était là les deux fois, à la même place. » |
| `co.leg.mondial_des_amateurs` | ≥ 2026 | Le Mondial des amateurs | « L'année de la grève mondiale, un Mondial d'amateurs a été joué en trois semaines, et Trébignac y a eu un tirage. Ils ont perdu six à zéro, et ils en parlent encore comme d'une qualification. » |
| `co.leg.derniere_montee` | ≥ 2040 | La dernière montée | « La loi de 2040 a supprimé la montée, et le dernier club à être monté l'a fait un samedi, à la différence de buts, devant onze cents personnes. Depuis, c'est la seule date que les gamins du National apprennent par cœur. » |
| `co.leg.dernier_journal` | ≥ 2045 | Le dernier journal | « L'Écho de {ville} est le dernier journal papier du pays et il paraît le dimanche, à quatre pages. La quatrième est toujours la même : les résultats du District, en petit, en entier. » |

---

## 11. L'Almanach du Ballon (six blocs de dix entrées)

**L'Almanach du Ballon** est la chronique imprimée du monde : une page par décennie, dix entrées par page, consultable au Codex. Elle n'est pas jouable ; elle est ce que le joueur lit quand il veut savoir dans quel monde il a vécu. **Type** : ligne d'Almanach (§ 4.9), ≤ 120 caractères, au passé composé, sans nom de joueur. Une entrée sort **si son année est passée** dans la carrière en cours.

**1990-1999 — l'ère des présidents bâtisseurs**
1. « 1990 : les droits télé ont triplé. Trois présidents ont acheté un attaquant le même mardi. »
2. « 1991 : premiers contrôles inopinés. Un club a fait repeindre son infirmerie la veille. »
3. « 1992 : Vaucastel a déposé le bilan. Quatre-vingts ans de club dans une chemise cartonnée. »
4. « 1993 : l'arrêt Vaneste. En fin de contrat, on part où l'on veut, et gratis. »
5. « 1994 : Télé-Stade a racheté Capitale FC. La chaîne a gardé les deux caméras du dimanche. »
6. « 1995 : les stades sont passés tout-assis. Le virage est resté debout ; on l'a laissé. »
7. « 1996 : les Cobalts ont gagné le Continental chez eux, au Grand Stade neuf. »
8. « 1997 : les quotas d'étrangers sont tombés. Un recruteur a acheté un atlas et l'a annoté au crayon. »
9. « 1998 : les Cobalts n'étaient pas au Mondial. Le pays a regardé la finale avec le son. »
10. « 1999 : le but en or, et les premiers fonds lointains. Deux façons d'arrêter un match. »

**2000-2009 — l'argent arrive**
1. « 2000 : un fax a daté tous les contrats de janvier au premier janvier mille neuf cents. »
2. « 2001 : les agents ont eu une licence. Onze l'ont passée, quatre l'ont eue, sept ont continué. »
3. « 2002 : les salaires sont passés en écus. Tout le monde a divisé à voix haute pendant six ans. »
4. « 2003 : Médiacrash a pris les droits en mettant deux fois le prix. On a noté la date. »
5. « 2004 : Loubières et Montbéliac ont fusionné. Un maillot, deux buvettes, un seul comptable. »
6. « 2005 : première commission à deux chiffres. Personne n'a su laquelle, tout le monde a su le chiffre. »
7. « 2006 : Médiacrash n'a pas payé la deuxième échéance. On avait noté la date de la première. »
8. « 2007 : le fonds Almadis a racheté Capitale FC, et Le Flux a été inventé le même automne. »
9. « 2008 : la section féminine de Mirevaux est passée professionnelle. Douze contrats, un bus. »
10. « 2009 : le fair-play financier. Une règle qui compte, écrite par des gens qui comptent. »

**2010-2019 — l'ère des fonds**
1. « 2010 : le premier club frère dans l'autre hémisphère. On y a envoyé les joueurs qui attendaient. »
2. « 2011 : le naming des stades. Trois villes ont refusé de dire le nouveau nom, et le disent encore. »
3. « 2012 : Massenet est devenu directeur d'antenne. Il a gardé son carnet et changé de côté. »
4. « 2013 : un ministre a dissous un comité de fédération. La FédéMonde a donné trente jours. »
5. « 2014 : la vidéo est arrivée. Le premier but annulé l'a été pour trois centimètres. »
6. « 2015 : quarante-huit équipes votées pour le Mondial. Le vote a duré onze minutes. »
7. « 2016 : les jeunes se vendent à seize ans. Les parents lisent la page trois avant la page une. »
8. « 2017 : « le modèle » note tout. Il note aussi les entraîneurs, et il les note mal. »
9. « 2018 : Léa a pris Le Quotidien, et Solvang a pris le carnet de Fardelli, sauf trois pages. »
10. « 2019 : quatorze clubs ont fondé une Ligue fermée. Elle a duré soixante heures. »

**2020-2029 — le grand écart**
1. « 2020 : Berthomier est mort. On verra ça après le Congrès, disait-il ; le Congrès a été reporté. »
2. « 2021 : Kick a pris la diffusion en flux. On regarde le football sur un téléphone, debout. »
3. « 2022 : quarante-huit équipes au Mondial. Il a fallu inventer six villes pour les loger. »
4. « 2023 : le premier commentaire généré par la voix d'un ancien joueur. Il ne s'est pas trompé une fois. »
5. « 2024 : la limite d'âge de soixante-quinze ans a été votée au Congrès, pour les autres. »
6. « 2025 : Massenet a publié ses mémoires. Le chapitre huit a été relu par un avocat, deux fois. »
7. « 2026 : la grève mondiale des joueurs. Soixante-douze matchs par saison, ou soixante ; ce fut soixante. »
8. « 2026 : le Mondial des amateurs. Trébignac a eu un tirage, et a perdu six à zéro, et en parle encore. »
9. « 2027 : l'arbitre algorithmique en test. Colline a arbitré à côté de lui, et il a eu raison deux fois. »
10. « 2028 : le premier transfert à un milliard. On l'a annoncé au milieu d'un autre sujet. »

**2030-2039 — les franchises**
1. « 2030 : le Mondial d'hiver à Al-Dorado. Vingt degrés dedans, cinquante dehors, deux mois de trêve. »
2. « 2031 : Gigi Vecchio est mort un dimanche, à la 70e. L'arbitre a ajouté une minute. »
3. « 2032 : les socios ont repris Marsange, Portclair et Saint-Étoile. Gégé a été élu, et il est mort élu. »
4. « 2033 : la Commission des comptes est devenue une agence de notation. Personne n'a signé la première note. »
5. « 2034 : Trébignac a été racheté par un fonds, pour rire. Le fonds a payé le chauffage, sérieusement. »
6. « 2035 : Vence s'est retirée. Elle a refusé qu'on la filme, pour la première fois de sa vie. »
7. « 2036 : Dauzat est mort. Le dernier procès-verbal est signé de sa main, et il ne manque rien. »
8. « 2037 : un club a joué un amical avec une compo faite par un modèle. Il a gagné, et personne n'a fêté. »
9. « 2038 : la loi des franchises est en débat depuis huit ans. Elle en mettra encore deux. »
10. « 2039 : « le joueur cloné » a fait la une d'un journal, un premier avril. On l'a cru trois jours. »

**2040-2050 — la fin des montées**
1. « 2040 : plus de montée ni de descente en D1. La D2 est devenue le vrai football, et elle le sait. »
2. « 2041 : la mère de Mbako est morte. Le carnet fait trois cents pages, toutes des clauses. »
3. « 2042 : un District a organisé un championnat parallèle avec montée. Six cents personnes y sont allées. »
4. « 2043 : L'Écho de {ville} est passé au prix libre. Les recettes ont augmenté. »
5. « 2044 : Bréhaut est mort. Sur le faire-part : « Le groupe vivait bien. » »
6. « 2045 : Fauvel est mort debout, en tribune, pendant un hymne. On ne l'a pas fait asseoir. »
7. « 2046 : le Mondial à soixante-quatre. La phase de poules a duré cinq semaines. »
8. « 2047 : la Coupe est le seul suspense qui reste. On la regarde comme on regardait tout. »
9. « 2049 : Mbako est mort. Sur le socle : « Je veux jouer. Maintenant. » »
10. « 2050 : l'écran-bilan du siècle. Vous avez incarné trente-sept personnes, gagné douze titres, été viré vingt-neuf fois. »

