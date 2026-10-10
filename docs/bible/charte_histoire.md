# La charte d'écriture : une histoire, pas un recueil de répliques

*Octobre 2026. Ce document remplace, pour toute écriture et toute réécriture de carte, la règle
« deux phrases, un tic » de `README.md` § 3.1. Il s'applique à `content/cards/**` et
`content/arcs/**`. En cas de conflit avec un chapitre de la bible, c'est lui qui gagne.*

---

## 0. Ce que le porteur du projet a demandé

> « L'ensemble des dialogues ont été écrits à l'époque quand le jeu n'était qu'une copie de
> Reigns, et cela ne convient plus, car je veux vraiment que le jeu se vive comme une histoire !
> avec ses rebondissements […] si il n'y a aucun rebondissement mais qu'ils soient gérés bien
> entendu (pas un toutes les 30 s), les joueurs s'ennuieront ; ce qu'on veut c'est du
> rebondissement, de l'intrigue, de la rétention. »

> « Je veux des évènements aléatoires […] une manifestation des supporters, un envahissement du
> terrain, des supporters qui t'attendent devant chez toi, un inconnu qui vient te donner un
> document dans la laverie, tout un tas d'évènements sombres qui viendront se rajouter à
> l'histoire. »

Et l'exemple de ce qui ne va plus : Zoran Vukić qui dit « Le petit n'a pas son tampon. Je te le
dis parce que personne ne te le dira. »

## 1. Le diagnostic, mesuré sur les 1 364 cartes

| Symptôme | Mesure | Ce que le joueur ressent |
|---|---|---|
| **Le tic** : chaque personnage répète sa phrase fétiche | 397 cartes sur 1 364. « J'en ai vu passer » ×96, « La tribune n'oublie rien » ×86, « hors micro » ×84, « Le groupe vit bien » ×83, « J'en ai vu d'autres » ×74, « personne ne te le dira » ×71, « rentres à quelle heure » ×49, « argent ou d'amitié » ×47, « Vous confirmez » ×37, « j'ai un empire » ×33… | Des marionnettes. On n'écoute plus ce qu'ils disent, on attend la formule. |
| **Le sketch** : la carte est une blague isolée | 167 cartes `gag` / `absurde` (le chien Corner, les chaussettes porte-bonheur, la mise au vert « sans wifi », la star « en jet privé ») | Le ton sombre se casse ; la carte ne mène nulle part. |
| **La carte hors du temps** | des objets d'une autre époque sans condition d'année : la visio, le wifi, le courriel, « une machine qui calcule les notes » | On sort de 1990. |
| **La carte sans suite** | ~320 cartes de routine sans `answer` : rien ne répond au choix | Le swipe tombe dans le vide. |
| **La réplique générique** | « La star est arrivée en retard… », « Un joueur réclame une augmentation… » : personne, nulle part | On ne sait ni qui, ni où, ni pourquoi c'est important. |

Ce qui marche et qu'on garde : les cartes d'étape des intrigues récentes, écrites depuis la bible
(« Fardelli regarde le pare-brise, jamais l'enveloppe »), les traces, les réactions, les Unes, le
metteur en scène.

## 2. Les douze règles

**R1. Pas de tic. Jamais.** Aucun personnage n'a de phrase fétiche. Un personnage se reconnaît à
sa *manière* (ce qu'il regarde, ce qu'il tait, ses mots de métier), pas à une formule. Les
anciennes formules sont interdites partout, y compris détournées (« j'en ai vu passer, des
machines »). Une même tournure ne revient pas deux fois chez le même personnage.

**R2. Une carte est une scène.** Quelqu'un, quelque part, à un moment, veut quelque chose de toi.
Le texte pose le lieu ou le geste en quelques mots, puis la réplique. Pas de narrateur qui
explique, pas de morale.

**R3. On parle de *cette* situation.** La réplique ne peut pas être déplacée dans une autre carte.
Elle contient un détail concret : un nom (du casting ou du monde), un objet, une heure, un
chiffre, un lieu d'Aubérive (la buvette des anciens, la laverie de la rue du Stade, le parking du
stade, la gare routière, la friche de la Tréfilerie, le quai sud…).

**R4. Le sous-texte avant le texte.** Les gens ne disent pas ce qu'ils pensent ; ils disent ce
qu'ils ont vu, ce qu'ils veulent, ou une demi-vérité. La menace est implicite, la tendresse aussi.

**R5. Chaque carte fait avancer quelque chose** : une relation, une dette, un secret, une
rumeur, une peur. Une carte de « routine » est une scène de quartier qui fait vivre un personnage
qu'on reverra, pas un gag.

**R6. Le choix est un acte.** Les libellés (≤ 28 caractères) sont des actions à la première
personne ou à l'impératif, concrètes : « Je signe sans lire », « Je le mets au banc »,
« Montrez-moi la lettre ». Pas d'opinion (« Je trouve ça bien »), pas de blague.

**R7. Chaque sortie répond.** Chaque côté a son `answer` (≤ 140 caractères, au présent) : ce qui
se passe, vu de près. Il montre une conséquence ou plante une graine (« Il note ton nom sur la
dernière page. »). Jamais l'explication des effets, jamais une chute comique.

**R8. Le ton est sombre, pas cynique.** Le monde est dur — l'argent, la violence des tribunes, la
peur de perdre sa place, le racisme des années 1990, les corps qui cassent — mais les personnages
ont des raisons. L'humour reste possible s'il naît d'un personnage, sec, une fois de temps en
temps ; jamais l'absurde, jamais la parodie.

**R9. L'époque est tenue.** 1990-1999 : fax, bip, cabine, Minitel, cassette, francs, télé
régionale. Le portable et le SMS arrivent vers 1998-2000, le courriel aussi ; l'écu en 2002 ; le
Flux (le réseau social du monde) en 2008 ; la visio et les données vers 2010. Une carte qui cite
un objet daté porte la condition d'année (`when: "year >= 2008"`), sinon elle reste intemporelle.

**R10. Les noms sont ceux du monde.** Rien de réel : ni club, ni joueur, ni marque, ni
compétition, ni commune réelle. Les villes viennent de `content/names/fr.yaml` (Villebranle,
Valdorne, Portclair, Montbéliac, Nerville…) et de la bible ; jamais Villefranche, Beaulieu,
Fontaine, Valmont, Néville (communes réelles).

**R11. La mémoire.** Si une trace ou un drapeau existe, on le lit. Une carte qui peut rappeler un
choix ancien le rappelle (variante `when: "flag('...')"`). Un personnage se souvient de ce que tu
lui as fait.

**R12. Les limites du moteur.** `text` ≤ 200 caractères, `label` ≤ 28, `answer` ≤ 140. `{toi}`
seulement si le locuteur a une `adresse`. `{prenom}` / `{nom}` au plus une fois par carte. On ne
touche ni aux `id`, ni aux `effects`, ni aux `when`, ni aux `tags`, ni à la structure des arcs
quand on réécrit : seulement `text`, `label`, `answer` (et leurs variantes).

### 2.1 Avant / après

| Avant | Après |
|---|---|
| Vukić : « Le petit n'a pas son tampon. Je te le dis parce que personne ne te le dira. » | Vukić referme la porte du couloir avec le talon : « Mbako n'a pas de tampon sur sa licence. Si leur délégué la retourne, on perd sur tapis vert. Il joue quand même ? » |
| Vukić : « La star est arrivée en retard, en jet privé et en lunettes noires. Elle réclame un vestiaire à elle seule. » | Vukić, à voix basse : « Rouvier est arrivé à onze heures par la porte des livreurs. Il a dit panne. Personne n'a vu de voiture, et il sent la friche. » |
| Madame Josiane : « La banque a refusé le virement, et le vestiaire l'a su hier au distributeur. J'en ai vu passer ; je dis quoi, lundi ? » | Madame Josiane tient le relevé par un coin, comme une chose mouillée : « La banque a refusé les salaires. Ils l'ont appris hier soir au distributeur. Lundi, ils seront devant mon bureau. Je leur dis quoi ? » |
| Fardelli : « Onze minutes avant la fermeture, j'ai un attaquant en visio depuis un parking. On tente le coup de folie ? » — *Le parking avait mauvaise connexion.* | Fardelli, d'une cabine, le souffle court : « J'ai un attaquant de Portclair qui signe ce soir si le fax part avant minuit. Il a un genou, je ne te mens pas. Tu le prends ? » — *Le fax part à 23 h 52. Le genou arrive avec lui.* |
| Gégé : « Le frigo est mort en mars et on boit tiède depuis, ça forge le caractère. La tribune n'oublie rien, même la panne. » | Gégé pose trois bières tièdes sur une caisse : « Le frigo est mort en mars. La mairie a promis, le club a promis. Toi, tu promets aussi, ou tu payes ? » |

## 3. Les voix, sans formule

| Personnage | Comment il parle | Ce qu'il ne fait jamais |
|---|---|---|
| **Zoran Vukić**, adjoint | Peu de mots. Des faits de terrain : ce qu'il a vu, l'heure, le joueur, la jambe. Il te protège en te mettant devant la décision. | Expliquer pourquoi il te le dit ; faire la morale. |
| **Madame Josiane**, secrétaire depuis 1987 | Le vouvoiement, les dates, les papiers, les procédures. Elle avertit par un geste (un dossier laissé ouvert, une tasse en plus). | Commérer ouvertement ; évoquer son ancienneté en formule. |
| **Gégé**, capo de la tribune nord | Le « nous » de la tribune, la mémoire précise des promesses (date, somme). Fraternel, et la menace est sous la table. | Crier ; dire « la tribune n'oublie rien ». |
| **Titi Bréhaut**, capitaine | Diplomate, il parle pour « les gars », chiffre les choses, négocie. Son ambition est cachée derrière le groupe. | Dire « le groupe vit bien ». |
| **Jean-Marie Vaubourg**, président | Pressé, au téléphone, possessif (« mon club »), l'argent comme langue. Il flatte puis il coupe. | « J'ai pas le temps, j'ai un empire. » |
| **Pierre Massenet**, journaliste à L'Écho | Il échange une information contre une autre, carnet ouvert ou fermé selon ce qu'il veut. Ironie froide. | « Juste une question, hors micro. » |
| **Léa**, presse (plus tard) | Directe, vérifie, cite ses sources. | « Vous confirmez ? » |
| **Rocco Fardelli**, agent | Chaleureux, indirect, parle d'amis et de services, jamais de chiffres. | « Mon ami, on parle d'argent ou d'amitié ? » |
| **Doc Sabatier**, médecin | Doux, précis sur le corps, ambigu sur la morale (les piqûres, les certificats). | « Ça reste entre la table et moi. » |
| **Camille**, à la maison | La vie hors du foot : le loyer, la voisine, le gamin, la fatigue. Parle de ce que le foot coûte. Peut être dure quand elle a mal. | « Tu rentres à quelle heure ? » |
| **Dan Corven**, le mentor | Un ancien : il raconte un match d'avant pour parler d'aujourd'hui. Tendre, malade plus tard. | « Je dirais que j'étais devant. » |
| **Lian Mbako**, 16 ans | Phrases courtes, fierté, peur cachée, sa mère toujours dans le dos. | « Je veux jouer. Maintenant. » |
| **Gigi Vecchio**, gardien, 41 ans | Rocailleux, lent, fataliste ; des histoires de vieux matchs ; la peur de la fin. | « J'en ai vu d'autres. » |
| **La mère de Mbako** | Protectrice, commerçante, méfiante envers le club. | « Mon fils n'a besoin de personne. » |
| **Madame Aubert**, maire | Politique, l'argent public, les élections, « la ville ». | « Le stade, c'est de l'argent public. » |
| **Noé Berthomier**, Fédération | Bureaucrate, les délais, les commissions, l'art de ne pas décider. | « On verra ça après le Congrès. » |
| **Cheikh Ilyas**, fonds Almadis | Froid, le vocabulaire de la finance. | « Ce n'est pas un club, c'est un actif. » |

## 4. Les rebondissements : comment on les dose

Un rebondissement est un moment où la situation se retourne : un allié trahit, un secret sort,
un choix ancien revient, une menace se réalise, une porte se ferme. Il en faut, **réglés** :

- **Une saison (17 créneaux, ~20 cartes vécues) porte** : un grand retournement (l'ancre du
  script aux créneaux 10-11), deux ou trois retournements d'intrigue (une étape par intrigue au
  moins retourne la situation), un ou deux événements sombres (§ 5). Jamais deux chocs sur deux
  cartes consécutives ; après un choc, une ou deux scènes calmes (pas des gags : des scènes de
  personnages, souvent les conséquences).
- **Planter, puis payer.** Un détail planté tôt (un objet, un nom, une dette, une trace) revient
  3 à 10 cartes plus tard. Une intrigue ne se termine pas sans payer ce qu'elle a planté.
- **Finir la semaine sur une question.** La dernière carte avant un match (le samedi) laisse quelque
  chose d'ouvert : c'est ce qui donne envie de jouer la semaine suivante.
- **Les conséquences se voient en ville** : un lieu ferme, un personnage n'est plus à sa place,
  une enseigne s'éteint, quelqu'un attend devant chez toi.

## 5. Les événements sombres

Ce sont des arcs `kind: evenement`, tirés par le metteur en scène quand leur `when` est vrai
(ils naissent de l'état du monde, ils ne tombent pas du ciel), une à deux fois par saison au plus,
jamais deux à moins de cinq créneaux d'écart. Chacun porte un **lieu** (`lieu:` sur la carte) :
c'est là que la ville le met en scène. Chacun pose une trace et **nourrit l'histoire** : il ouvre
ou fait avancer une intrigue, ou revient plus tard.

Lieux possibles : `domicile`, `laverie`, `stade`, `vestiaire`, `bureau`, `secretariat`, `buvette`,
`parking`, `mairie`, `gare`, `friche`, `cimetiere`, `terrain`, `rue`, `echo`, `muscu`, `cabinet`,
`banque`, `cafe`.

### 5.1 Le catalogue

| id | Titre | Rôle | Quand (état du monde) | Lieu | Ce qui se passe | Ce que ça nourrit |
|---|---|---|---|---|---|---|
| `sb.manif` | La manifestation | E | tribunes < 35, ou défaites en série | mairie → stade | Trois cents supporters sous les fenêtres de la mairie, banderole contre Vaubourg et contre toi. Gégé te demande de descendre leur parler. | Aubert, Vaubourg ; trace `manif` lue par la Une et par la commission |
| `sb.envahissement` | L'envahissement | E, J | derby, ou tribunes très basses, ou trace `manif` | stade (pendant le match) | À la 80e, un homme saute la grille et court vers le banc (E) / vers toi (J). Tu le protèges des stadiers ou tu le laisses emmener. | huis clos, tribune fermée par arrêté ; commission ; Gégé |
| `sb.devant_chez_toi` | Ils t'attendent | E, J | tribunes < 30 après une défaite, ou promesse non tenue au kop | domicile | Minuit : cinq types sous ta fenêtre, des écharpes. Camille a éteint la lumière. Tu descends, tu appelles la police, ou tu attends. | Camille, Gégé ; la voiture taguée plus tard |
| `sb.laverie` | L'inconnu de la laverie | E, J | S1+, n'importe quand, une fois | laverie | Pendant que les maillots tournent, un homme en blouson gris pose une enveloppe kraft sur la machine : « Lisez ça avant samedi. » Dedans : une copie de virement du club vers un compte de Valdorne. | ouvre le fil **L'homme au blouson gris** (§ 5.2) ; le dossier, Massenet |
| `sb.voiture` | La voiture | E, J | trace `devant_chez_toi` ou tribunes < 25 | parking | Ta voiture au parking du stade : « VENDU » à la bombe sur le capot, un pneu crevé. | assurance, Camille ; Gégé sait qui |
| `sb.appel_nuit` | Le coup de fil de 3 heures | E, J | avant un match important | domicile | Le téléphone sonne à 3 h. Une voix : « Samedi, ton gardien a mal au dos. » Puis la tonalité. | l'enveloppe, la commission ; Vecchio |
| `sb.disparu` | Le joueur qui ne vient pas | E | vestiaire < 45 | terrain → friche | Rouvier ne vient pas à l'entraînement. On le retrouve à la friche, avec des types qui lui réclament de l'argent. | la dette d'un joueur, le chantage |
| `sb.bagarre_buvette` | La bagarre de la buvette | E, J | trace `manif` ou derby | buvette | Deux bandes de la tribune nord se battent à la buvette des anciens ; Gégé a l'arcade ouverte ; la police veut des noms. | licence de la buvette, buvette fermée |
| `sb.local_feu` | Le feu au local | E | relation Gégé ≤ −1, ou trace `bagarre` | stade | Le local du kop brûle dans la nuit. Accident, ou quelqu'un ? | Gégé, assurance, la mairie |
| `sb.photos` | Les photos | J (E) | moral bas, sorties de nuit | cafe → rue | Un homme te montre des photos de toi à 3 h du matin, la veille d'un match. Il demande de l'argent. | le chantage, la presse, Camille |
| `sb.huissier` | L'huissier | E | caisse < 25 | secretariat | Un huissier entre au club-house avec deux déménageurs : le photocopieur, les ordinateurs, la machine à laver. Josiane se met devant la porte. | salaires, Vaubourg, la grève |
| `sb.perquisition` | Six heures du matin | E | trace `laverie_lue` ou direction très basse en S2+ | bureau | La police financière au club-house à l'aube. Les cartons de Vaubourg descendent l'escalier. | Vaubourg, le dossier, la Une |
| `sb.lettre` | La lettre | E, J | Mbako titulaire, ou un joueur noir mis en avant | domicile | Une lettre anonyme, des lettres découpées : « Si le petit joue samedi… ». | Mbako, sa mère ; le racisme des tribunes, sans complaisance |
| `sb.cercueil` | Le cercueil | E | tribunes < 25, fin de saison, relégation possible | stade | Au matin, un cercueil aux couleurs du club devant la grille du stade, ton nom écrit dessus. | la Une, Vaubourg ; la peur |
| `sb.car` | Le car | E, J | déplacement d'hiver | gare → route | Retour de Portclair dans la neige : le car du club dans le fossé. Norbert est blessé. | Norbert, le vestiaire, la saison |
| `sb.greve` | La grève | E | trace `salaires` ou caisse < 20 | vestiaire | Les joueurs refusent de s'entraîner tant que les salaires ne sont pas payés. Bréhaut te tend une lettre signée par tous. | salaires, Vaubourg, la Fédération |
| `sb.terrain_brule` | Le terrain brûlé | E | trace `cercueil` ou `manif` | terrain | Au matin, des lettres brûlées dans la pelouse du terrain annexe : un mot, cinq lettres. | Gégé, la mairie, la séance annulée |
| `sb.corbeau` | Le corbeau | E, J | S1+, après un succès | secretariat | Des lettres anonymes arrivent chez Vaubourg, chez Aubert et à L'Écho : elles parlent de toi. | Massenet, Camille ; qui écrit ? |
| `sb.agression` | La rue | J (E) | après un derby perdu | rue | Trois supporters adverses t'attendent rue des Lilas. Un coéquipier arrive. | Bréhaut, la plainte, la presse |
| `sb.dopage` | La boîte | J | genou ou fatigue | muscu | À la salle de muscu, un inconnu te tend une boîte sans étiquette : « Pour le genou. Tout le monde en prend. » | Sabatier, le contrôle, la carrière |
| `sb.ancien` | L'ancien | E, J | S2+, à la friche | friche | Un ancien du club, sorti de prison, te demande un service : un nom sur une liste d'invités, un carton à garder. | le passé du club, la police |
| `sb.mort_tribune` | La minute de silence | E | tribune vétuste (trace) | stade | Un supporter meurt d'un malaise en tribune pendant le match. Sa famille ne veut pas de la minute de silence. | Gégé, la mairie, la tribune |

### 5.2 Les fils qui reviennent

Quelques événements sont des **fils** : ils reviennent, plus fort, et finissent par payer.

- **L'homme au blouson gris** (`sb.laverie` → `sb.laverie_2` → `sb.laverie_3`) : il revient deux
  fois avec un document de plus (le virement, puis la liste des licences, puis un nom). La dernière
  fois, on apprend qui l'envoie (Massenet ? un ancien comptable du club ? la mère de Mbako ?) et
  le joueur choisit quoi en faire. C'est le mystère qui court sur deux saisons.
- **La tribune** : `sb.manif` → `sb.envahissement` → `sb.cercueil` : la colère qui monte si rien
  n'est fait.
- **La maison** : `sb.devant_chez_toi` → `sb.voiture` → `sb.lettre` : la peur qui entre chez toi,
  Camille qui part ou qui reste.

## 6. Mode opératoire de la réécriture

1. On relit **toutes** les cartes d'un fichier, dans l'ordre.
2. On réécrit une carte si l'une de ces conditions est vraie : elle contient un tic (R1) ; elle
   est un sketch (`gag`, `absurde`, ou une blague sans suite) ; elle est générique (R3) ; elle est
   hors époque (R9) ; elle a un côté sans `answer` (R7) ; elle cite un nom réel (R10).
3. On garde l'idée de la carte (le même sujet, les mêmes effets, le même personnage), on change
   la manière : une scène, un détail, du sous-texte, un acte, une conséquence.
4. On ne touche ni aux ids, ni aux effets, ni aux conditions, ni aux tags, ni aux arcs.
5. On vérifie les limites (texte ≤ 200, libellé ≤ 28, réponse ≤ 140), les placeholders et
   l'époque.
6. Une carte déjà juste (une scène, sans tic, avec ses réponses) ne se touche pas.
