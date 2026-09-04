# 5. Banque de péripéties (catalogue de cartes)

Une carte est un micro-drame de deux phrases, dit par un visage récurrent, avec deux sorties et une suite possible. Cette section fixe le format, donne douze cartes entièrement rédigées, puis catalogue 92 cartes par rôle, dix chaînes et les cartes joker. Abréviations des effets : V = VESTIAIRE, T = TRIBUNES, D = DIRECTION, C = CAISSE, F = Force (cachée), Rép = Réputation, Cam = relation Camille, rel(X) = relation avec un personnage, Parole = la valeur cachée des promesses.

## 5.1 Le format d'une carte

| Champ | Contenu | Règle |
|---|---|---|
| id | JP-09 | préfixe par rôle : JA joueur amateur, JP joueur pro, EN entraîneur, DS directeur sportif, PA président amateur, PP président pro, AG agent, SE sélectionneur, IN instance, TR transversal |
| rôle(s) | un ou plusieurs | une carte peut être partagée par substitution de noms |
| acte | pré-saison, aller, trêve, retour, sprint, bilan, ou « libre » | filtre de tirage |
| personnage | un des seize transversaux, un second rôle, ou un générique | le portrait et l'expression viennent de la relation |
| texte | 160 caractères maximum, deux phrases, présent de l'indicatif | la première phrase pose la situation, la seconde la question |
| gauche / droite | 28 caractères maximum chacun, verbe à la première personne | jamais « Oui / Non » |
| effets | 1 à 3 jauges par côté, de −25 à +25 ; plus Force, Réputation, relations, Parole | le point d'aperçu montre l'ampleur, pas le sens |
| drapeaux requis / interdits | tags | « INTERNATIONAL », « non VAR », « rel(Fardelli) ≤ −1 » |
| drapeaux posés | tags | ce qui ouvre les chaînes |
| chaîne | id de la carte suivante, délai min et max en cartes, probabilité, condition d'annulation | sablier affiché si le délai dépasse 6 |
| poids | 1 à 10 | la Pression et les alarmes le modulent |
| ruban | promesse (créancier, échéance) ou rien | une promesse active à la fois |

**Conventions d'écriture.** Le personnage parle, jamais le narrateur. Une carte ne dit jamais ce qu'elle va faire aux jauges. Les clins d'œil sont reconnaissables par la situation, pas par le nom. Une carte d'humour sur trois environ ; une carte de drame par run au plus. Chaque rôle vise 130 cartes (60 pour les rôles courts) dont 60 % transposées du réel, 25 % de chaînes, 15 % d'absurde.

## 5.2 Douze cartes entièrement rédigées

**1. JA-02 Le type en doudoune** (joueur amateur, aller, saison ≥ 2, une fois par run)
Un inconnu en doudoune au bord du terrain : « Je bosse pour Valdorne. Il y a un essai mardi. C'est à 400 kilomètres et tu dois poser deux jours. »
← J'y vais : C −5, Rép +10, F −5, drapeau ESSAI_PRO.  → Je reste avec les copains : V +5, Rép −5.
Suite : ESSAI_PRO déclenche deux cartes plus tard « Le coup de fil » : 35 % « Contrat pro » (Carte Destin vers Joueur pro), 65 % « Ils t'ont trouvé trop lent » (Rép −5, Cam +5). Le buteur passé de la huitième division au titre est passé par là.

**2. JP-09 Qui tire le penalty** (joueur pro, temps fort, attaquant ou milieu)
Bréhaut, ballon sous le bras, 88e, 1-1 : « C'est moi le tireur désigné. Lâche ce ballon. »
← Prends-le : V +10, Rép −5.  → Je tire (RISQUÉ) : V −15, puis tirage 70/30 : marqué → Rép +15, T +10 ; raté → Rép −15, T −10.
Suite : marqué déclenche « Les supporters te réclament capitaine » (V −10, T +10).

**3. JP-11 La main** (joueur pro, temps fort, match à élimination directe, monde sans vidéo)
Ménèche, en zone mixte : « L'arbitre ne l'a pas vue. Le stade non plus. Mais tu as marqué de la main. Alors ? »
← C'était la main de Dieu : Rép +15, T +10, D −10, Destin secret « La Main de Dieu ».  → J'avoue, je l'ai touché : D +10, Rép +5, T −10, Destin « Le Fair-play », trait Intègre.
Suite : gauche déclenche quatre cartes plus tard « La fédé lésée réclame le match à rejouer », carte partagée avec le rôle instance (IN-07).

**4. EN-02 L'ultimatum** (entraîneur, D < 30)
Aulard : « Trois défaites de suite. Le prochain match est un ultimatum. J'ai déjà le numéro de ton remplaçant. »
← On attaque à outrance : Grand Match forcé, effets ×2 ; défaite = Épitaphe « Le SMS de 23 h 47 ».  → Bloc bas, on assure le nul : T −10, D +5.
Suite : victoire après l'attaque à outrance déclenche « Le président parle de toi comme de son fils » (D +10, sablier).

**5. EN-06 Quarante-quatre jours** (entraîneur, première saison dans un club champion en titre)
Aulard : « Le premier jour tu as dit aux joueurs : "Jetez vos médailles, vous les avez gagnées en trichant." Ils veulent ta tête. Ça fait quarante-quatre jours. »
← Je m'excuse : V +10, Rép −10.  → Je double la mise : V −20, D −20, Rép +15 ; si V < 20 : Épitaphe « L'Homme des 44 jours », qui débloque Brian Clow comme coach adverse récurrent.

**6. PA-05 Le Petit Poucet** (président amateur, trêve, une fois par saison)
Le tirage au sort, à la télé : « Vous affrontez Paris Capitale FC en 32e de finale. Le stade municipal ne tient pas cinq mille personnes. »
← On joue chez eux, on prend la recette : C +15, T −10.  → Chez nous, dans la boue : T +15, C −5, D −5 (la Fédération grogne), puis Grand Match.
Suite : 10 % « L'exploit » (Rép +25, T +20, chaîne « Les recruteurs appellent pour tes joueurs ») ; 90 % « 0-6 mais quelle fête » (T +10).

**7. PP-04 L'enveloppe** (président pro, sprint, titre en jeu, Rép > 60)
Jean-Pierre, ton bras droit : « Il suffit que trois joueurs adverses lèvent le pied avant notre finale de la semaine suivante. Une enveloppe et c'est réglé. »
← Fais-le : F +20, C −5, drapeau ENVELOPPE, sablier.  → Jamais : Rép +10.
Suite : ENVELOPPE déclenche 5 à 10 cartes plus tard « Un joueur adverse parle à la police », puis « Titre retiré, rétrogradation », puis l'Épitaphe « La valise ».

**8. DS-01 Le fax de 23 h 58** (directeur sportif, dernier jour du mercato)
Madame Josiane : « Il est 23 h 58. Le fax du transfert ne passe pas. L'autre club dit que c'est notre faute. »
← Appelle la Ligue pour une dérogation : D −5, tirage 50/50 : validé (V +10, D +10) ou refusé (C −20, T −10).  → Tant pis : V −10, C −20.
Suite : échec → « Le joueur reste et boude jusqu'en janvier » (F −5).

**9. SE-01 Le bus** (sélectionneur, tournoi, V < 40)
Bréhaut, par la porte du bus : « Les joueurs refusent de descendre pour l'entraînement tant que le capitaine écarté n'est pas réintégré. »
← Je cède : V +10, D −15, T −15, Rép −10.  → Je tiens : V −20, Rép +10, D +5, drapeau GRÈVE.
Suite : GRÈVE déclenche « Le préparateur physique lit un communiqué devant les caméras » (T −20) puis « Élimination au premier tour » ; si V < 15 : Épitaphe « Le bus ». Si Gigi Vecchio est à +2, il descend le premier et la carte devient « Le vestiaire suit Gigi » (V +15).

**10. IN-01 Le vote du désert** (instance mondiale, première saison)
Un émissaire : « Le pays du désert offre à chaque membre du comité un programme de développement de 1,5 million. Votre voix ? »
← Le désert : C +30, D +10, Rép −30, drapeau VOTE_ACHETÉ, sablier.  → Le candidat classique : Rép +10, C −10, D −5.
Suite : VOTE_ACHETÉ déclenche 6 à 12 cartes plus tard IN-02 « L'hôtel du bord du lac », et « Le Mondial en hiver » (D −20, les ligues hurlent).

**11. IN-02 L'hôtel du bord du lac** (instance, requiert VOTE_ACHETÉ ou Rép < 25)
Un agent fédéral, six heures du matin : « Police. Ouvrez. »
← Je coopère : D −30, Rép −10, C −20, drapeau REPENTI ; le run continue.  → Par l'escalier de service : Épitaphe « Extradé » (avec le drap blanc de l'hôtel sur l'image de partage).
Suite : REPENTI déclenche « Tu balances tes collègues » (D +20, V −30) et ouvre le postulat « Le Repenti ».

**12. TR-01 Le Fantôme** (tous rôles, requiert un run terminé)
Ton ancien personnage, devenu entraîneur adverse : « Tu te souviens de moi ? Le club que tu as coulé, c'est moi qui l'entraîne aujourd'hui. »
← Poignée de main : Rép +5, T +5.  → Chambrage en conférence : T +10, V +5, Rép −5 ; la défaite contre lui coûtera T −10 de plus.
Suite : chaque Épitaphe stocke le nom, le rôle et la cause pour générer ce type de carte dans le run suivant.

## 5.3 Le catalogue par rôle

### Joueur amateur (JA)

| Id | Personnage | Accroche | Gauche | Droite | Effets | Chaîne |
|---|---|---|---|---|---|---|
| JA-01 Le repas chez belle-maman | Camille | « Le repas chez ma mère c'est samedi 15 h. Ton match aussi. Choisis. » | Je joue, dis que je suis blessé | Je sèche le match | G : V +10, Cam −15 ; D : Cam +10, V −10, F −5 | victoire → « Héros du dimanche » (Rép +5) ; Cam < 20 → « L'ultimatum de Camille » |
| JA-03 Le beau-frère arbitre | Karim, ton capitaine | « L'arbitre est le beau-frère de leur président. Il vient de nous refuser un but valable. » | On lui rentre dedans | On serre les dents | G : V +5, D −15, Rép −5, drapeau INSULTE ; D : D +5, V −5 | INSULTE → « Convocation au district » (trois matchs ou amende) ; D < 15 → « Radié du district » |
| JA-04 La troisième mi-temps | Momo, avant-centre | « Le président a payé la tournée. Ça finit au bar à 4 h ou tu rentres ? » | Je reste | Je rentre | G : V +15, F −10, Cam −10 ; D : F +5, V −10 | 30 % « La vidéo qui tourne » (T −10) ; 10 % « Bagarre au bar » (chaîne gendarmerie) |
| JA-05 Le patron en a marre | M. Ferreira, ton patron plombier | « Trois lundis d'arrêt pour des blessures de foot. Le prochain, c'est la porte. » | Je lève le pied | Le foot d'abord | G : F −10, C +5, V −5 ; D : C −10, V +5, drapeau PATRON | PATRON + blessure → « Licenciement » (C −25, Cam −10) |
| JA-06 Le tacle du chambreur | leur numéro 10 | « Depuis 60 minutes il te chambre sur ta coupe. Il part seul au but. » | Tacle par derrière | Je le laisse marquer | G : V +5, D −15, Rép −10, 20 % « Cheville cassée en face » ; D : V −10 | il réapparaît coéquipier si tu changes de club (« Tu te souviens de moi ? ») |
| JA-07 Le neveu du président | Dédé, le coach bénévole | « Le neveu du président doit jouer. À ta place. Tu comprends ? » | J'accepte le banc | Je gueule devant tout le monde | G : D +10, V −5, F −5 ; D : D −15, V +10, drapeau VOISIN | VOISIN → « Le président de Montbéliac t'appelle » (transfert amateur, rivalité activée) |
| JA-08 Le sanglier | Gégé, gardien du stade | « Un sanglier a labouré la surface de réparation cette nuit. L'arbitre hésite. » | On joue quand même | Report | G : F −5, D −5, V +5, 15 % « entorse dans un trou de sanglier » ; D : D +5, C −5 | victoire → « Le maillot au sanglier » devient l'emblème (T +10) |
| JA-09 Le sanglier, côté président | Gégé | même situation, vue du président amateur | On joue | Report | mêmes effets sur C et D | partagée avec PA |

### Joueur pro (JP)

| Id | Personnage | Accroche | Gauche | Droite | Effets | Chaîne |
|---|---|---|---|---|---|---|
| JP-01 Le transfert du siècle | Fardelli | « Al-Dorado met 222 millions sur la table. Ta clause est publique, ton club ne peut rien faire. » | Je pars | Je reste | G : C +30, T −25, Rép +10, Cam −10, drapeau GALACTIQUE ; D : T +20, C −5, D +10, drapeau LOYAL | GALACTIQUE → « La présentation devant 60 000 personnes » puis « Le sifflet de ton ancien stade » ; LOYAL → « La prolongation en or » ou, si D < 40, « Le banc pour te punir » |
| JP-02 La morsure | Léa, ton attachée de presse | « La vidéo où tu mords l'épaule de leur défenseur a 40 millions de vues. On dit quoi ? » | Il est tombé sur mes dents | Excuses publiques | G : T −15, Rép −10, V +5 ; D : T +5, Rép −5, D +5 | « Neuf matchs de suspension » (F −15) puis « Le sponsor dentifrice » (C +15, Rép −5) ; trois fois → Épitaphe « La morsure » |
| JP-03 Les bouteilles | le responsable com des Cobalts | « Tu as écarté les bouteilles du sponsor pour montrer ta gourde. L'action a perdu quatre milliards. Ils veulent des excuses. » | Buvez de l'eau | Je m'excuse | G : Rép +15, D −15, C −10, Destin secret ; D : D +10, Rép −5 | gauche → « Les autres joueurs t'imitent » (V +10, D −10) |
| JP-04 Le pari sur les corners | Tony, ton pote d'enfance | « Une petite mise sur ton propre match, juste le nombre de corners. Personne ne saura. » | OK, une fois | Jamais | G : C +10, drapeau PARIEUR, sablier ; D : Rép +5, Cam +5 | PARIEUR → 50 % dans les six cartes « La brigade financière » (D −25, T −20) puis « Dix mois » ; D < 20 → Épitaphe « Le pari » |
| JP-05 La liste des 26 | le sélectionneur, au téléphone | « Tu es dans ma liste. Mais ton club veut que tu déclares forfait pour soigner ta cheville. » | J'y vais | Forfait | G : Rép +15, F −10, D −10, drapeau INTERNATIONAL ; D : D +10, Rép −10, T −5 | INTERNATIONAL ouvre le paquet « Sélection » (hymne, prime, chambrée) et la voie de la légende |
| JP-06 Le frère agent | Yanis, ton frère | « Vire Fardelli, je m'occupe de tout. Je suis de la famille, moi. » | D'accord, frérot | Reste à ta place | G : Cam +15, C −10, rel(Fardelli) −2, drapeau FRÈRE ; D : Cam −15, Rép +5 | FRÈRE → « La clause oubliée » (C −15, D −10) puis « Yanis a signé avec une marque de vapoteuse » (T −10) |
| JP-07 Les genoux disent stop | le coach | « Trente-quatre ans, les genoux en vrac. Adjoint dès l'été, ou tu finis dans la Ligue de l'Ouest lointain. » | Adjoint | Le soleil et les dollars | G : Rép +10, C −10, Destin Entraîneur ; D : C +20, Cam +10, F −10, Rép −5, drapeau RETRAITE_DORÉE | RETRAITE_DORÉE → deux saisons plus tard « Retour au pays » (président amateur ou consultant) |
| JP-08 Le yacht | ton community manager | « Ta photo sur un yacht pendant que l'équipe s'entraîne a trois millions de likes. Et 200 000 commentaires "mercenaire". » | Supprime | J'assume, blessé pas mort | G : T +5, Rép −5 ; D : T −15, V −10, Rép +5 | droite → « Le tifo "Bon vent" » si T < 30 |
| JP-10 L'arrêt Bosquet | Maître Vidal, ton avocat | « Six mois de contrat. Une nouvelle jurisprudence te permet de partir gratuitement. Ton club perd 40 millions. » | Je pars libre | Je prolonge | G : C +25, T −20, D −25, Rép −5 ; D : D +15, C +5, Rép +5 | gauche → « Le président t'accuse d'avoir tout planifié » puis « Sifflé partout », mais « Les autres joueurs te remercient » (V +10 au nouveau club) |
| JP-12 Le coup de tête | leur défenseur central, 108e minute de ta dernière finale | « Ta sœur, je la préfère à toi. » | Coup de tête dans le sternum | Tu encaisses | G : Épitaphe « Le coup de tête », Destin « Légende à la con » ; D : F −5, Rép +5 | la carte n'apparaît qu'au dernier match d'une carrière de joueur |
| JP-13 Le scorpion | ta voix intérieure (gardien) | « Tu peux le prendre à deux mains. Ou faire le scorpion devant 40 000 personnes. » | Scorpion (RISQUÉ) | À deux mains | G : 60/40 réussi (Rép +20, T +15, Destin) ou raté (V −15, T −10) ; D : F +2 | réussi → « Une marque de chaussures veut ton geste en pub » (C +15) |
| JP-14 La blessure des vacances | Doc Sabatier | « Rupture du croisé en jouant au beach-volley à Ibiza. Six mois. Le contrat dit "aucune activité à risque". » | J'avoue | C'est arrivé à l'entraînement | G : C −20, D −10, Rép +5 ; D : 50 % « La vidéo sort » (T −15) | drapeau « genou », paquet « rééducation » pendant six cartes |

### Entraîneur (EN)

| Id | Personnage | Accroche | Gauche | Droite | Effets | Chaîne |
|---|---|---|---|---|---|---|
| EN-01 Le sèche-cheveux | Bréhaut, mi-temps, 0-2 | « Ils attendent que tu gueules. Ou pas. » | Coup de gueule, chaussure qui vole | Calme, tableau tactique | G : V −5, F +10, 15 % « L'arcade de ta star » (T −10, V −10) ; D : V +5, F +2 | seconde mi-temps gagnée après le coup de gueule → « Le mythe du sèche-cheveux » (Rép +10) |
| EN-03 Les jumelles | Vukić | « Un de nos stagiaires a été chopé avec des jumelles devant l'entraînement adverse. On dit quoi ? » | J'assume : conférence de 70 minutes avec diapositives | On nie, il cueillait des champignons | G : Rép +15, T +10, D −10, C −10 ; D : T −10, D −5 | gauche → surnom « le Loco » (T +10) ; trois fois → Épitaphe « L'espion dans la haie » |
| EN-04 La star qui ne défend pas | Bréhaut (DS) | « Notre numéro 10 refuse de défendre. Le président l'a payé 80 millions. Tu le mets sur le banc ? » | Banc | Titulaire | G : V +10, D −15, T −5, drapeau STAR_BANC ; D : V −10, D +10 | STAR_BANC + victoire → « Le président te félicite du bout des lèvres » ; + défaite → « Le président exige ta démission » (D −25) |
| EN-05 Le Real Montoya t'appelle | Fardelli | « Le Real Montoya te veut. Maintenant, à mi-saison, alors que tu as promis de rester. » | Je pars | Je reste | G : C +20, Rép −15, T −25, Parole −2, changement de club ; D : T +15, Rép +10, C −5, Parole +1 | droite + titre → « La statue devant le stade » |
| EN-07 Le Spécial | Ménèche, première conférence | « Première conférence. Vous vous décrivez comment ? » | Je suis quelqu'un de spécial | Le groupe vit bien | G : T +15, Rép +10, V +5, drapeau SPÉCIAL ; D : T −5, D +5 | SPÉCIAL : chaque défaite T −5 de plus, chaque victoire T +3 de plus ; survivre trois saisons = Destin « Le Spécial » |
| EN-08 Le doigt dans l'œil | Vukić, derby | « Une bagarre a éclaté sur les bancs. On t'a filmé le doigt dans l'œil de leur adjoint. » | Je m'excuse | Je ne me souviens de rien | G : Rép −5, D +5, V −5 ; D : T −15, D −15, V +5 | droite → « Leur adjoint devient entraîneur principal », rival récurrent (T −5 à chaque confrontation) |
| EN-09 Le gamin de 16 ans | le directeur du centre | « Mbako marche sur l'eau chez les U19. Le président veut le vendre. Le lancer en pro, c'est le protéger. » | Titulaire samedi | Trop tôt | G : V −5, T +10, D −5, drapeau PÉPITE, rel(Mbako) +2 ; D : D +5 | PÉPITE → 60 % « Le gamin explose » (Rép +15, C +20), 40 % « Il se blesse et sa famille t'accuse » (T −10) |
| EN-10 Je n'ai pas vu l'action | journaliste TV, après le coup de coude de ton joueur | « Vous avez vu l'action ? » | Je n'ai pas vu | Il mérite le rouge | G : V +10, T −10, Rép −5, compteur MYOPE ; D : V −15, T +10, Rép +5 | cinquième « Je n'ai pas vu » → Destin « Myope professionnel » et « Un opticien te sponsorise » (C +10) |
| EN-11 Les Scorpions ne défendent pas | Camille | « Tu as écarté un joueur parce qu'il est Scorpion. La presse l'a su. » | J'assume, les Scorpions ne vont pas en défense | Démenti | G : T −15, Rép −10, V −10, Destin « Astrologue » ; D : T −5, Cam −5 | gauche → « Un gourou te propose ses services » (C −10, F ±10) |
| EN-12 Le capitaine vieillissant | le préparateur physique | « Le capitaine a perdu deux mètres de vitesse. Le vestiaire l'adore, les données disent de le sortir. » | Il reste titulaire | Sur le banc, je lui parle avant | G : V +10, F −10, T −5 ; D : V −10, F +10, drapeau CAPITAINE_VEXÉ | VEXÉ → « Il annonce sa retraite à la radio » (T −10) ou, si V > 60, « Il devient ton adjoint » (V +15) |
| EN-13 Le président a acheté sans toi | Aulard | « J'ai signé un attaquant ce matin. Tu l'apprends par la presse. Tu le fais jouer ? » | Il joue | Il s'entraîne avec la réserve | G : D +8, V −6 ; D : D −12, V +8 | droite → « L'attaquant parle à Ménèche » (T −8) |
| EN-14 Le jeûne | Bréhaut | « Trois joueurs jeûnent pendant le derby. Le préparateur veut les sortir. » | Ils jouent, on adapte | Ils s'entraînent, ils ne jouent pas | G : V +8, F −4 ; D : V −12, T −5, D +4 | droite → « La polémique » (T −10) |

### Directeur sportif (DS)

| Id | Personnage | Accroche | Gauche | Droite | Effets | Chaîne |
|---|---|---|---|---|---|---|
| DS-02 Le pont d'or lointain | Fardelli, mercato d'hiver | « Un club de l'Est lointain offre 30 millions pour ton défenseur de 33 ans. Le coach en a besoin. » | On vend | On garde | G : C +30, V −10, D +10, drapeau DÉFENSE_TROUÉE ; D : D −10, V +10 | TROUÉE → « Le coach t'accuse en conférence » (T −10) sauf recrutement immédiat (C −15) |
| DS-03 L'algorithme norvégien | Lucas, analyste de 24 ans | « Selon le modèle, un inconnu de troisième division norvégienne vaut la moitié de notre effectif. 500 000 euros. » | On l'achète | On prend le nom connu à 30 millions | G : C −5, T −5, 50/50 « Pépite » (Rép +20, C +40 à la revente) ou « Flop » (Destin « Il n'a coûté que 500 000 ») ; D : C −30, T +10, D +5 | pépite → « Lucas est débauché par un club anglais » (D −5) |
| DS-04 La commission à 20 millions | Fardelli | « Mon joueur prolonge si ma commission passe à 20 millions. Sinon, je l'emmène chez le rival. » | Payé | Refusé | G : C −20, V +10, T −10 ; D : V −10, rel(Fardelli) −2 | rel ≤ −2 → « Il part libre chez le rival » (T −20, C −15) ou, si V > 60, « Le joueur vire son agent et prolonge » (Rép +10) |
| DS-05 Les huit kilos du carnaval | le préparateur physique | « Notre recrue à 60 millions est arrivée avec huit kilos de trop et une invitation au carnaval. » | On couvre, il est artiste | Amende et régime | G : T −5, V +5, F −5 ; D : V −5, D +5, T +5 | gauche → 50 % « Triplé au retour du carnaval » (T +15), 50 % « Photographié en boîte à 5 h » (T −15) |
| DS-06 La vitre de la voiture | Ménèche, à ta vitre baissée | « Dernier jour du mercato. Vous signez qui ? » | Un nom pas encore signé | No comment | G : T +10, D −10, drapeau PRIX_MONTE (C −10) ; D : T −5 | PRIX_MONTE → « Le président t'engueule à la radio » (D −10) |
| DS-07 La clause anti-voyage spatial | Maître Vidal | « L'agent exige deux clauses : le joueur peut partir si le club change la couleur des maillots. Et il lui est interdit d'aller dans l'espace. » | Signez, on s'en fiche | Pas de clauses fantaisistes | G : V +5, T +5, drapeau CLAUSE_MAILLOT ; D : V −5 | CLAUSE_MAILLOT → « Le sponsor veut un maillot rose » (C +15 ou perdre le joueur) |
| DS-08 Le 9 ou le trader | le coach | « J'ai demandé un avant-centre. Tu m'as acheté un ailier de 19 ans pour la revente. T'es DS ou trader ? » | Je soutiens le coach, on achète un 9 | Le trading paye le stade | G : D −10, V +10, C −15 ; D : D +10, V −10, T −5 | droite + V < 25 → le coach démissionne, intérim de trois matchs (transition temporaire) |
| DS-09 Le fax, côté président | Madame Josiane | version président pro de DS-01 | Dérogation | Tant pis | partagée | idem DS-01 |

### Président amateur (PA)

| Id | Personnage | Accroche | Gauche | Droite | Effets | Chaîne |
|---|---|---|---|---|---|---|
| PA-01 Le synthétique | Madame Aubert | « Je finance un terrain synthétique si le club prend le nom de la ville et si mon fils est dans l'équipe première. » | Marché conclu | Non merci | G : C +20, D +15, V −10, T −5, drapeau FILS_DU_MAIRE ; D : C −10, D −15, T +10 | FILS → « Il rate un penalty décisif » ; aux municipales, « Le nouveau maire veut son fils à lui » |
| PA-02 La buvette après 22 h | Madame Josiane, trésorière | « La buvette rapporte plus que la billetterie. La préfecture veut qu'on arrête l'alcool après 22 h. » | On ferme à 22 h | On continue en douce | G : C −15, D +10 ; D : C +10, D −15, drapeau CLANDESTINE, sablier | CLANDESTINE → 40 % « Contrôle de la gendarmerie » (C −15, D −10, T −5) |
| PA-03 Le boucher sponsor | Dupuis, boucher | « 5 000 euros pour un maillot rose avec "DUPUIS, le meilleur du cochon" dans le dos. » | Vendu | Trop cher payé | G : C +15, T −10, Rép −5, 25 % « Le maillot devient viral » (T +10, C +10) ; D : C −5, T +5 | gauche → « Le boucher veut choisir le capitaine » |
| PA-04 La fusion | le président de Montbéliac | « Fusionnons : deux fois plus de licenciés, une place en National à portée. Mais ton nom disparaît. » | Fusion | Jamais | G : C +20, D +10, T −20, Rép +5, drapeau FUSION ; D : T +10, C −10 | FUSION → « Les anciens créent le FC United du village » (rival récurrent en Coupe) puis « Les deux vestiaires ne se mélangent pas » (V −15) |
| PA-06 Deux acteurs d'Hollywood | un avocat de Los Angeles | « Deux acteurs célèbres veulent racheter le club et en faire une série. Ils promettent la Division 2 en cinq ans. » | Je vends | Le club n'est pas à vendre | G : C +40, Rép +20, T +10, Destin vers DS salarié puis Président pro si le club monte ; D : T +5, C −5 | gauche → « Les caméras dans le vestiaire » (V −10, T +15) |
| PA-07 Le gardien a poussé l'arbitre | le district | « Votre gardien a poussé l'arbitre. On envisage la fermeture du stade pour trois matchs. » | Je défends mon joueur | Je le suspends moi-même | G : V +10, D −20, C −10 ; D : V −10, D +10, Rép +5 | gauche → « Huis clos » (C −15, T −10) ; D < 15 → Épitaphe « La subvention » |
| PA-08 La gardienne | Dédé | « Plus de gardien. La fille de la trésorière joue en féminines, elle est meilleure que tous nos gars. Le règlement dit non. » | Elle joue, on assume | Forfait | G : D −10, T +15, Rép +10, V −5 puis +10 ; D : F −10, V −5, C −5 | gauche → « Le district ouvre une commission » puis « La Fédération change le règlement » (D +15, Rép +10) |
| PA-09 Les enveloppes du club voisin | Dédé | « Montbéliac paye ses joueurs 300 euros le match en liquide. Nos meilleurs partent. » | On paye aussi | On reste propres | G : C −15, V +15, D −10, drapeau CASH ; D : V −15, Rép +5 | CASH → 30 % « L'inspection du travail » (C −25) ; sans CASH, « Nos trois meilleurs signent chez le voisin » (F −15) |
| PA-10 Gérard a fui | Madame Josiane | « Gérard tenait la buvette et la caisse depuis vingt ans. Gérard est parti en Thaïlande. La caisse aussi. » | On porte plainte | On étouffe, on refait la caisse | G : D +5, C −20, T −5 ; D : C −25, V +5 | cinq cartes pour trouver l'argent ou Épitaphe « La buvette » |

### Président pro (PP)

| Id | Personnage | Accroche | Gauche | Droite | Effets | Chaîne |
|---|---|---|---|---|---|---|
| PP-01 Le fonds du désert | l'émissaire de Qatalyst | « Un État du Golfe rachète 90 % du club. Vous restez président de façade. Budget illimité. » | Je vends | Le club reste à ses supporters | G : C +50, Rép −15, D −10, T +10, drapeau PROPRIÉTAIRE_ÉTAT ; D : C −10, T +15, Rép +10 | ÉTAT → « L'émir veut un joueur de 200 millions pour Noël » puis, deux saisons plus tard, « Ton successeur est le neveu de l'émir » (fin dorée, rebond direct vers instance ou amateur) |
| PP-02 La Ligue fermée | le président du Real Montoya | « Douze clubs fondent une ligue fermée. Tu es dedans ou tu es petit. Signature dans 48 heures. » | Je signe | Sans moi | G : C +30, T −30, D −30, drapeau LIGUE_FERMÉE ; D : T +15, D +10, Rép +10, C −5 | 70 % « Retrait piteux 48 heures plus tard » (Rép −20) ; 30 % « La ligue se fait, tu es riche et détesté » ; manifestation sur la carte suivante |
| PP-03 Médiacrash | ton directeur général | « Le diffuseur Médiacrash n'a pas payé la deuxième échéance des droits TV. On a déjà dépensé l'argent en salaires. » | Emprunt bancaire | On vend deux joueurs en janvier | G : C −20, D −10 ; D : C +15, V −15, T −10 | gauche → « La Commission t'interdit de recruter » (F −10) ; C < 10 au Bilan → Épitaphe « La Commission des comptes » |
| PP-05 Arena FrigoPlus | le directeur marketing de FrigoPlus | « Le stade s'appellera Arena FrigoPlus. Dix millions par an. » | Signez | Le stade garde le nom du vieux président | G : C +25, T −15 ; D : T +10, C −10 | gauche → « Les ultras déchirent les panneaux » (T −5, C −5) ; 20 % « FrigoPlus fait faillite » (C −15) |
| PP-06 Virer le coach | Ménèche, en direct | « Le coach est dans le dur, mais il a le vestiaire. Les supporters le veulent dehors. Et vous ? » | Il est viré | Je le confirme | G : T +10, V −15, C −10, D +5, drapeau NOUVEAU_COACH ; D : T −15, V +10 | NOUVEAU_COACH tire un profil (le Loco, le Spécial, le Professeur) avec ses cartes ; si le coach viré est ton Fantôme, il devient rival |
| PP-07 Gégé des ultras | Gégé | « Abonnements tribune à 5 euros et liberté totale des banderoles. Sinon, grève des encouragements. » | Accordé | Refusé | G : T +20, D −15, C −10 ; D : T −25, D +10, drapeau SILENCE | SILENCE → « Le stade muet » (F −10) puis, si T < 20, « Envahissement de terrain » (D −20, huis clos) |
| PP-08 Le tweet de 3 h du matin | ton fils | « Papa, tu as tweeté à 3 h du matin que l'arbitre est un âne corrompu. 40 000 retweets. » | Supprime et excuse-toi | J'assume, j'ai la 4G et je suis président | G : D +5, T −5, Cam +5 ; D : T +15, D −20, C −5 | droite → « La Ligue te suspend de banc » puis « Ton compte devient culte » (Rép +10) |
| PP-09 Le fair-play financier | le président de l'Union Continentale | « Vous dépassez de 80 millions. Soit vous vendez votre star, soit exclusion de la Coupe Continentale. » | On vend | On conteste devant le tribunal du sport | G : C +30, T −20, V −10 ; D : D −20, C −10, 50/50 « Annulé pour vice de forme » (Rép +15) ou « Exclusion confirmée » (C −30, T −15) | victoire au tribunal → « Les autres clubs te détestent » (D −10) |
| PP-10 Le stade de la ville | Madame Aubert | « La ville construit un stade. Vous serez locataire, et je choisis le nom. » | On signe | On rénove le nôtre | G : C +15, D +5, T −10 ; D : C −20, T +10 | droite → « Le rapport sur la tribune vétuste » (carte de drame si ignorée trois fois) |

### Agent (AG, pack ultérieur)

| Id | Personnage | Accroche | Gauche | Droite | Effets | Chaîne |
|---|---|---|---|---|---|---|
| AG-01 Le double mandat | Maître Vidal | « Tu représentes le joueur et le club acheteur. Légal ? Presque. Rentable ? Très. » | On y va | Un seul client par deal | G : C +25, D −15, Rép −10, drapeau DOUBLE ; D : Rép +10, C −10 | DOUBLE → « Le joueur découvre que tu as touché des deux côtés » (V −20) ; D < 20 → Épitaphe « Licence retirée » |
| AG-02 La mère du prodige | la mère de Mbako | « Mon fils n'a besoin de personne. Je gère. Vous prenez 3 % ou rien. » | 3 %, mais je gère l'image | À 3 % je ne travaille pas | G : C −10, V +10, Rép +5 ; D : V −10, Rép −5 | gauche → « Le contrat le plus cher de l'histoire » (C +30) ; droite → « Tu le vois soulever le Mondial sans toi » |
| AG-03 Le gamin du centre voisin | un recruteur | « Fais signer le gamin de 15 ans du centre concurrent. Une console, un téléphone pour la mère. La Fédération l'interdit. » | OK | Trop jeune | G : C +15 différé, D −20, Rép −10, drapeau MINEUR ; D : Rép +5 | MINEUR → 40 % « Enquête sur les transferts de mineurs » (D −20), 60 % « Le gamin devient international » (C +25) |
| AG-04 Le tweet « je veux partir » | ton client star | « J'ai envie de tweeter que je veux partir. Là. Maintenant. » | Laisse-le faire | Donne-moi ce téléphone | G : T +10, C +15, Rép −10, D −10 ; D : V −5, Rép +5 | gauche → « Le club le met au loft » puis « Transfert au rabais » |
| AG-05 La société des îles Cocotiers | un intermédiaire | « La commission passe par une société aux îles Cocotiers. Le fisc ne voit rien. » | D'accord | Tout déclaré | G : C +20, D −25, drapeau OFFSHORE, sablier ; D : C −10, Rép +5 | OFFSHORE → huit cartes plus tard AG-06 |
| AG-06 Les fuites | Ménèche | « On a tes mails. Tous. Tu veux réagir ? » | Tout est faux | Je collabore avec la justice | G : T −20, D −20, Rép −10 ; D : V −20, D +15, C −20 | gauche + D < 15 → Épitaphe « Extradé » ; droite → « Tu écris un livre » (C +15, Rép +10, sortie vers consultant) |
| AG-07 La grand-mère | ton client | « Je veux rentrer jouer au pays, en deuxième division. Ma grand-mère est malade. Tu perds cinq millions. » | Je t'aide | Tu finis ton contrat | G : C −20, Rép +15, V +10 ; D : C +10, Rép −10, drapeau MALHEUREUX | MALHEUREUX → « Il part quand même, sans toi » (V −15) |
| AG-08 Le passeport express | un dirigeant de fédération étrangère | « Notre sélection veut naturaliser ton client. Passeport en six mois, prime de deux millions. Il ne parle pas la langue. » | Vendu | Il attend sa vraie sélection | G : C +15, Rép −5, D −5 ; D : Rép +5, C −5 | gauche → « Il ne connaît pas l'hymne, la vidéo est virale » puis « Il marque au Mondial » |

### Sélectionneur (SE)

| Id | Personnage | Accroche | Gauche | Droite | Effets | Chaîne |
|---|---|---|---|---|---|---|
| SE-02 Le fils du ministre | Legruet | « Le fils du ministre des Sports est un bon milieu… Tu le prends dans la liste des 26 ? » | Il est dans la liste | Je choisis mes joueurs | G : D +15, V −10, T −10 ; D : D −15, Rép +10, V +5 | gauche → « Il rate un penalty en quart » (T −15) ; droite → « La Fédération rogne ton budget de stage » (C −5) |
| SE-03 L'attaquant naturalisé | le directeur technique national | « Un attaquant brésilien peut être naturalisé en six mois. Le peuple gueule, mais il met trente buts par an. » | On le naturalise | On joue avec nos gamins | G : F +15, T −10 ; D : T +10, F −5 | gauche → SE-08 « L'hymne » |
| SE-04 La demande en mariage | journaliste TV, après l'élimination | « Un mot pour les supporters ? » | Camille, veux-tu m'épouser ? | On analysera à froid | G : Cam +20, T −20, Rép −15, Destin « Romantique » ; D : Cam −5 | gauche → 30 % « Camille dit non en direct » |
| SE-05 L'avion des primes | Bréhaut | « Les joueurs ne jouent pas le troisième match si les primes n'arrivent pas en liquide, avant le coup d'envoi. » | Faites venir l'avion avec les billets | Vous jouez pour le maillot | G : D −15, V +15, T −15 ; D : V −25, Rép +5, drapeau GRÈVE | gauche → 30 % « Les douanes saisissent l'avion » (C −20) |
| SE-06 Viré à deux mois du Mondial | Legruet | « Tu as tout gagné en qualifications. Mais le jeu n'est pas beau et le vestiaire grogne. Démissionne avec un chèque, ou on te vire. » | Je me bats, je reste | Je prends le chèque | G : T +10, D −20, V −5 ; D < 20 → Épitaphe « Minuit et une » ; D : C +20, Rép −10, Épitaphe « Le Chèque » puis transition club ou consultant | gauche réussie → « Ton remplaçant potentiel devient ton adjoint » (V +10) |
| SE-07 Le capitaine qui rentre chez lui | ton capitaine, à Saipan-sur-Mer | « Le terrain est un champ de patates, les maillots ne sont pas arrivés. Soit tu te bouges, soit je rentre chez moi. » | Rentre chez toi | Excuse-moi, tu restes | G : V −15, Rép +10, T −20 ; D : V +5, Rép −10, D −10 | gauche → « Le pays se divise en deux camps » puis, si tu passes le premier tour, « Tu avais raison » (Rép +15) |
| SE-08 L'hymne | le ministre des Sports | « Trois de tes joueurs ne chantent pas l'hymne. Le pays s'enflamme. » | Obligation de chanter | Ils jouent, ils ne chantent pas | G : V −10, T +10, D +5 ; D : T −10, V +5 | gauche → « Un joueur chante faux, la vidéo est virale » |
| SE-09 La main de ton avant-centre | Ménèche | « Votre avant-centre a contrôlé de la main avant le but qualificatif. Toute l'Irlonde réclame le match à rejouer. » | L'arbitre a sifflé, je n'y peux rien | Je demande à rejouer | G : Rép −10, T −10 ; D : Rép +20, D −20, V −10 | droite → IN-07 dans le paquet partagé ; gauche → « L'Irlonde boycotte ton club » (C −5) |
| SE-10 Le binational | Legruet | « Un gamin de 18 ans hésite entre nous et le pays de ses parents. Tu le convoques pour un amical, ça le bloque à vie. » | Je le bloque | Qu'il choisisse librement | G : F +5, D +5, Rép −5, rel(Mbako) −1 ; D : Rép +5, F −5 | droite → 50 % « Il choisit l'autre pays et marque contre toi » |

### Dirigeant d'instance (IN)

| Id | Personnage | Accroche | Gauche | Droite | Effets | Chaîne |
|---|---|---|---|---|---|---|
| IN-03 L'assistance vidéo | le chef des arbitres | « On introduit l'assistance vidéo. Les puristes hurlent, les diffuseurs adorent. » | On l'adopte | Le foot reste humain | G : T +10, C +10, V −10 (le comité des puristes), drapeau VIDÉO ; D : T −10 selon la presse, V +10 | VIDÉO → « Le hors-jeu à l'aisselle » puis « Quatre minutes pour vérifier un corner » ; active la variante de Carte Match pour tous les rôles |
| IN-04 Quarante-huit équipes | le trésorier | « Passer de 32 à 48 équipes rapporte un milliard. Le football sera moins bon, mais plus de fédérations voteront pour vous. » | 48 | 32 | G : C +30, D +15, Rép −10, T −10 ; D : C −10, Rép +10, D −10 | gauche → « Un 0-0 avec tirs au but au premier tour » ; droite → « Les petites fédérations préparent ta destitution » (D −15) |
| IN-05 Les deux millions de vieille amitié | Bambini | « Tu me dois deux millions pour du conseil fait il y a neuf ans. Sans contrat. Un virement, entre amis. » | Je paie | Sans contrat, pas de virement | G : D −25, rel(Bambini) +2, drapeau VIREMENT, sablier ; D : rel(Bambini) −2, Rép +5 | VIREMENT → « Le comité d'éthique te suspend huit ans » : Épitaphe « La radiation », sauf Rép > 70 (quatre ans, sortie consultant) |
| IN-06 Le but fantôme | la fédération lésée | « Un ballon 50 centimètres derrière la ligne, but refusé en huitième. Vous aviez refusé la technologie. » | Je m'excuse et on l'adopte | L'erreur est humaine, c'est le charme du foot | G : Rép +10, C −10, T +5 ; D : T −20, Rép −15 | gauche → IN-03 ; droite → « Le pays lésé demande ta démission » (D −10) |
| IN-07 Le chèque à la fédé lésée | le président de la fédération d'Irlonde | « Après cette main, on veut être la 33e équipe du Mondial. Sinon, tribunal. » | Un prêt pour un stade, et on n'en parle plus | Non, 32 c'est 32 | G : C −15, D +10, drapeau CHÈQUE_SECRET, sablier ; D : D −10, Rép +5, T −5 | fuite dix cartes plus tard : « Le prêt jamais remboursé » (Rép −15) |
| IN-08 Les shorts | ton conseiller com | « Tu as suggéré que les joueuses portent des shorts plus moulants pour attirer les sponsors. Ça tourne partout. » | Excuses et fonds pour le foot féminin | C'était de l'humour | G : Rép −10, C −10, T +5 ; D : T −25, Rép −20, D −10 | gauche → « Le premier Mondial féminin à guichets fermés » (Rép +15, C +10) |
| IN-09 Un Mondial tous les deux ans | le directeur technique de la FédéMonde | « Un Mondial tous les deux ans : plus quatre milliards. Les ligues et les joueurs menacent de boycotter. » | On y va | On garde le rythme | G : C +25, D −30, V −10, T −10 ; D : C −5, Rép +10, D +10 | gauche → IN-11 ; droite → « Les confédérations créent leurs propres compétitions » (C −10) |
| IN-10 Les ouvriers des chantiers | une ONG | « Des ouvriers meurent sur les chantiers de votre Mondial. Vous répondez quoi ? » | Aujourd'hui, je me sens ouvrier | Un fonds d'indemnisation obligatoire | G : T −30, Rép −20, Destin « Discours du siècle » ; D : C −15, Rép +15, D −10 | droite → « Le pays hôte menace d'annuler » (tenir = Rép +10) |
| IN-11 La grève mondiale des joueurs | le syndicat des joueurs | « Soixante-douze matchs par saison. On fait grève. Le Mondial se jouera avec des amateurs. » | On réduit le calendrier | Qu'ils fassent grève | G : C −20, V +20, D −10 ; D : V −20, T −20, drapeau GRÈVE_MONDIALE | GRÈVE_MONDIALE → « Le Mondial des amateurs » : une carte propose de passer au rôle joueur amateur avec le drapeau « a joué un Mondial » |
| IN-12 Le Ballon d'Argent de la fédé amie | le sélectionneur d'une fédération amie | « Vote pour mon capitaine au Ballon d'Argent, et ma fédé vote pour ta réélection. » | Marché conclu | Je vote pour le meilleur | G : D +15, Rép −10, 30 % fuite (T −5) ; D : D −10, Rép +10 | gauche → « Le vainqueur remercie ses amis en direct » |
| IN-13 La Campagne | une confédération, quatre fois | « Nos onze voix contre une promesse : le Mondial chez nous / plus de places / la vidéo partout / des subventions. » | Promis (ruban) | Je ne promets rien | G : +0,05 au vote, échéance au mandat suivant ; D : rien | trahir une promesse de campagne : Parole −2, V −10 |

### Cartes transversales (TR, tous rôles ou familles)

| Id | Personnage | Accroche | Gauche | Droite | Effets | Chaîne |
|---|---|---|---|---|---|---|
| TR-02 Le derby | Gégé | « Derby dimanche. Perdre, c'est pas une option. Tu fais quoi de ta semaine ? » | Tout le monde en mise au vert, portables confisqués | Semaine normale, c'est un match comme un autre | G : F +10, V −5, Cam −10 ; D : T −10, Cam +5 | le derby applique T ±20 et déclenche « Le chambrage sur les réseaux » ou « La honte au boulot » |
| TR-05 Le podcast de Camille | Camille | « Je lance un podcast sur notre vie. Premier épisode : "Pourquoi le vestiaire est plus important que moi". » | Vas-y, je te soutiens | Pas question | G : Cam +15, T −10, V −10 ; D : Cam −20, V +5 | gauche → « Le podcast cartonne » (C +10) ; droite + Cam < 20 → « Divorce en pleine saison » (F −15, C −25) |
| TR-06 Ton pari | Ménèche, au Bilan | « Vous mourrez de quoi, à votre avis ? » | (choix d'une cause) | Je ne meurs jamais | Destin « Le Pronostiqueur » si la fin arrive la saison suivante | aucune |
| TR-07 Le mème | Ménèche | « Trois "je ne commente pas" d'affilée. Votre visage est partout avec la légende. » | J'en ris | Je porte plainte | G : T +5 ; D : T −10, Rép −5 | rel(Ménèche) ±1 |
| TR-08 L'enterrement | (le personnage transversal décédé) | « Son enterrement est samedi. Il ne vous aimait pas. » | J'y vais | Je m'abstiens | G : Rép +5, réconciliation posthume ; D : T −3 | aucune |
| TR-09 Nouvelles du passé | (carte différée annulée) | « Une vieille affaire de votre ancien club refait surface. Ça ne vous concerne plus. Presque. » | OK | OK | effet réduit de la chaîne annulée | aucune |

Total du catalogue : 92 cartes, plus les douze rédigées en 5.2 (dont sept déjà comptées).

## 5.4 Familles thématiques et proportions

| Famille | Part visée | Rôles où elle domine |
|---|---|---|
| Vestiaire et groupe | 18 % | joueur, entraîneur, sélectionneur |
| Mercato, agents, contrats | 14 % | joueur pro, DS, président pro, agent |
| Presse et réseaux sociaux | 12 % | tous |
| Supporters, ultras, village | 10 % | entraîneur, président pro et amateur |
| Direction, board, mairie, Fédération | 12 % | entraîneur, président, sélectionneur |
| Finances, sponsors, fisc | 10 % | président, DS, instance |
| Arbitrage et instances | 8 % | instance, sélectionneur, arbitre |
| Famille et vie privée | 6 % | tous (Camille) |
| Moments de match (temps forts) | 6 % | joueur, banc |
| Absurde et humour pur | 4 % | tous |

Par rôle complet : 130 cartes Personnage, 8 alarmes, 8 épitaphes, 10 Destins, 12 contextes de Carte Match, 20 temps forts, 6 cartes de contrat, soit environ 195 lignes de données. Par rôle court : 60 à 70 cartes Personnage et le reste par substitution.

## 5.5 Dix chaînes en plusieurs cartes

1. **Le jeune du centre** (entraîneur, président) : « Le recruteur a vu un gamin » → 20 à 30 cartes plus tard « Il fait ses débuts » → une saison plus tard « Un grand club offre 30 millions » → vendre : « Il marque contre toi » ; garder : « Son agent réclame un salaire de star ».
2. **Le frère du capitaine** (joueur pro) : « Mon frère est agent, il a un plan pour ton contrat d'image » → « Le contrat aux Caïmans » → quatre cartes plus tard « Le fisc veut te parler » → « La carte Panama » si CAISSE déborde.
3. **Le stade promis** (président amateur, pro) : promesse à Madame Aubert contre une subvention → « Le chantier » → un an plus tard « Les municipales » : chantier non lancé = subvention perdue, D −20, Parole −2.
4. **L'ultimatum** (entraîneur) : trois défaites → EN-02 → victoire : « Le fils du président » (drapeau homme du président) ; défaite : Épitaphe.
5. **La grève** (sélectionneur) : star humiliée → « Les mots exacts sont imprimables ? » → SE-01 « Le bus » → « Le communiqué du préparateur » → élimination ou insurrection matée par Gigi.
6. **La valise** (président pro) : PP-04 → « Un joueur adverse parle » → « Titre retiré » → « Radié à vie, mais la statue reste ».
7. **Le vote du désert** (instance) : IN-01 → « Le Mondial en hiver » → IN-10 « Les ouvriers » → IN-02 « L'hôtel du bord du lac » → « Tu balances tes collègues » ou « Extradé ».
8. **La Ligue fermée** (président de grand club) : PP-02 → huit cartes de six heures → retrait ou compétition permanente dans le monde.
9. **Le sponsor devenu propriétaire** (président) : maillot → naming (PP-05) → prêt → rachat (« Vos dettes contre 51 % ») → « Notification ».
10. **La pharmacie** (joueur, entraîneur) : « De la créatine, légal, enfin, encore » → « L'armoire » → « Le contrôleur est à l'accueil » → « Le flacon B » ou, pour la victime, la carte de drame.

## 5.6 Les cartes joker universelles

Une trentaine de cartes valables pour tous les rôles et toutes les ères, écrites avec des variables ({patron}, {kop}, {club}, {rival}, {saison}) : les huit alarmes templatées (« {patron} ne te salue plus », « {kop} chante ton nom… un peu trop », « Ton banquier appelle », « Camille demande si tu comptes rentrer un jour ») ; les dix cartes du piège du centre (« Tu ne prends jamais position, dit Ménèche », « Il nous faut un projet, dit {patron} ») ; les cartes Pression et Tentation liées au rang provisoire ; les cartes de vengeance et de faveur des seize personnages (« Tu te souviens de {saison} à {club} ? Moi oui. » / « Je te dois une : l'offre que tu attendais ») ; les quatre cartes du Fantôme ; les cartes de retrouvailles à chaque changement de rôle ; « Nouvelles du passé » ; et les Cartes Nouvelles datées de chaque ère.
