# La ville vivante — que chaque geste compte

Retour du porteur (octobre 2026) :

> « Il manque quelque chose au jeu, quelque chose de plus profond. On a plein d'interactions :
> acheter une bière, faire quelques courses à l'épicerie, parler au mécano, boire un café avec
> lui… mais cela ne sert à rien concrètement, juste à faire perdre du temps. Toutes ces actions
> anodines n'ont aucun effet sur le jeu, et pour cela ça paraît vide. Il faut imaginer quelque
> chose où toutes ces actions auraient un sens : des événements, des influences sur le jeu, que
> le jeu soit hyper vivant. »

Le constat est juste. Une activité ne fait que bouger les quatre jauges, et depuis le mode
histoire elles sont cachées. Personne ne se souvient de rien, et rien ne revient.

## Le principe

**Aubérive se souvient.** Chaque geste laisse une trace, et chaque trace finit par revenir.

Une trace peut se loger à quatre endroits :
- **la mémoire de quelqu'un** : un lien avec une personne de la ville ;
- **une habitude** : ce que la ville dit de toi ;
- **ce qu'on t'a confié** : un tuyau ;
- **ce qu'on te doit, ou ce que tu dois** : un service, une dette.

Elle revient de plusieurs façons :
- une information qui change une décision ;
- un service au moment où tout lâche ;
- une scène de la vie de quelqu'un ;
- une carte de l'histoire qui s'ouvre autrement ;
- une ligne dans l'Almanach de la carrière.

Deux règles pour le joueur :
1. **On voit la trace quand elle se fait** (une ligne : « Lulu s'en souviendra »).
2. **On sent qu'elle revient** (« Lulu : "Ta voiture, je l'ai mise derrière. Personne ne l'a
   vue." »).

## 1. Les gens d'Aubérive

Ce sont les visages des lieux. Le patron du Corner, le mécano du garage du Pont, l'épicière, le
kiosquier, la pharmacienne, le curé, le bookmaker de l'arrière-salle… Chacun a :
- un nom et un portrait (les mêmes bustes que les cartes) ;
- un lieu, et des heures où on le trouve ;
- une époque : on ne tient pas un comptoir soixante ans, donc un successeur prend la suite ;
- un **réseau** : ce qu'il sait, et sur quoi il pèse.

Ce sont des **personnages** du jeu. Les cartes peuvent les faire parler. Leur **lien** avec toi
est la relation du moteur (`relation.<id>`, de −3 à +3) : les cartes la lisent, et l'Almanach
écrit une ligne au palier +3.

Certains existent déjà dans les livres, comme Lavergne au tabac du Quai, Marie-Jo à la
boulangerie, Irène au Rideau Rouge, Steph à la salle de muscu ou Abel au cimetière. La ville
vivante leur donne une vie en ville ; elle ne les réécrit pas.

**Les réseaux**, et la jauge cachée qu'ils touchent :

| Réseau | Ce qu'il sait | Jauge cachée |
|---|---|---|
| `tribunes` | ce que pensent le kop et le comptoir | `tribunes` |
| `vestiaire` | ce qui se dit entre les joueurs | `vestiaire` |
| `direction` | l'humeur du président, du conseil | `direction` |
| `argent` | les comptes, les dettes | `caisse` |
| `presse` | ce qui paraîtra demain | — |
| `rue` | qui va où, avec quelle voiture | — |
| `milieu` | les paris, les combines, ce qui se décharge au port | — |
| `mairie` | les votes, les permis, le stade | — |
| `sante` | les corps, les ordonnances | — |
| `familles` | les mariages, les deuils, les gamins | — |
| `police` | — | — |

## 2. Le lien — le temps passé avec quelqu'un

Une activité faite **avec** quelqu'un (`avec:`) lui donne un point de lien : le café avec le
mécano, les courses chez l'épicière, le demi chez Marcel.
- Il y a **au plus un point par personne entre deux cartes**. On ne force pas une amitié en
  buvant dix cafés de suite.
- Aux seuils de **2, 5 et 9 points**, la relation monte d'un cran (+1, +2, +3). Le moteur la
  lit et peut programmer une carte quand elle franchit un seuil (`on_relation`).
- Les cartes et les scènes peuvent aussi la faire baisser : un service refusé, une trahison.
  Au-dessous de zéro, la personne te boude (−1), t'en veut (−2), puis devient un ennemi (−3).

Ce que chaque cran ouvre :

| Lien | Ce qu'il devient (le carnet) | Ce que ça ouvre |
|---|---|---|
| +1 | « te reconnaît », « te sert sans attendre » | ses répliques changent, il te dit l'humeur de son réseau |
| +2 | « te tutoie », « te fait confiance » | **ses tuyaux** ; les scènes de sa vie |
| +3 | « ferait beaucoup pour toi » | **son service** ; une carte de l'histoire peut l'appeler |
| −1 à −3 | « te boude », « t'en veut », « ne te sert plus » | répliques froides ; une scène peut se retourner contre toi |

## 3. Les tuyaux — ce que la ville sait

Dans une histoire noire, l'information est la monnaie. Une personne liée te dit ce qu'elle sait,
quand tu lui parles (tu la touches en ville, ou « Parler » dans le panneau de son lieu). Il y a
deux sortes de tuyaux.

**Le climat.** Dès le lien +1, chaque personne te dit **en clair** où en est la jauge cachée de
son réseau, avec ses mots. Marcel, sur les tribunes : « Le kop gronde. Samedi, ils ne
chanteront pas. » Josiane, sur la direction : « Le président a fermé sa porte trois fois
aujourd'hui. » Les jauges sont cachées depuis le mode histoire ; la ville les rend lisibles à
qui y passe du temps. Ces phrases sont écrites par tranche :
- `bas` : la jauge à moins de 35 ;
- `moyen` : de 35 à 65 ;
- `haut` : au-dessus de 65.

**Les tuyaux d'histoire.** Dès le lien +2, une confidence une seule fois. Elle pose un drapeau
`tuyau_<id>` qu'une carte ou une scène lira : une troisième voie, un piège évité, une vérité.
Le tuyau est noté dans le carnet. Il porte sa condition (`si`), pour arriver au bon moment de la
bonne histoire. Exemple : Lulu, au garage, une fois la berline brûlée dans le livre 1 : « La
berline, je l'ai vue entrer au port la veille. Pas volée : livrée. »

## 4. Les services — ce qu'on fait pour toi

Dès le lien +3, chaque personne peut te rendre **un service**, une fois par saison. On le
demande dans son panneau. Ce sont des effets concrets :
- **de l'argent** : l'épicière fait crédit (la ruine recule d'une semaine), le banquier
  repousse l'huissier, le bookmaker prête — de l'argent sale ;
- **une protection** : le patron du Corner calme le kop, le curé garde un document, le mécano
  fait disparaître une voiture, le chauffeur te ramène sans qu'on te voie ;
- **une influence** : la journaliste adoucit un papier, le kiosquier te montre la Une de
  demain, la pharmacienne ne dit rien.

Un service peut créer **une dette** (`dette: true`). Plus tard, la personne viendra la
réclamer dans une scène, et refuser coûte le lien.

## 5. Les habitudes — ce que la ville dit de toi

Chaque activité compte dans **une habitude** (`habitude:`). Au seuil (10 gestes de la même
habitude), elle devient une **réputation** : un drapeau `rep_<habitude>`, et une ligne de
l'Almanach.

| Habitude | Les gestes | La réputation | Ce qu'elle déclenche |
|---|---|---|---|
| `comptoir` | demis, tournées, cafés au zinc | « un pilier du Corner » | les tribunes t'adoptent ; le président s'inquiète, la presse aussi |
| `nuit` | le Rideau Rouge, les sorties tardives | « un oiseau de nuit » | une photo, une rumeur, une carte de la direction |
| `jeu` | le 421, les cartes, les cotes, le tripot | « un joueur » | le bookmaker vient te voir (le match arrangé) |
| `sport` | la muscu, courir le long de la Rive, les jongles | « un infatigable » | la forme (le joueur), le vestiaire te respecte |
| `soin` | dormir, le kiné, la pharmacie, le médecin | « quelqu'un qui se ménage » | moins de blessures, moins d'insomnies |
| `culture` | la librairie, le cinéma, le journal | « un liseur » | la presse t'écoute ; des tuyaux d'archives |
| `foi` | l'église, le cimetière, les fleurs sur une tombe | « fidèle » | les anciens, les familles ; on vient te chercher pour un deuil |
| `famille` | la maison, l'école, les fleurs, le square | « présent pour les siens » | moins de drames à la maison |
| `largesse` | la tournée, les places offertes, les pourboires, les dons | « généreux » | les tribunes ; les quémandeurs |
| `luxe` | la boutique, l'hôtel, les grandes tables | « un flambeur » | la presse, le fisc, la jalousie |
| `quartier` | les courses, le marché, la laverie, parler aux gens | « un enfant du pays » | la ville te protège ; plus de tuyaux |
| `travail` | rester tard au club, la vidéo, le bureau | « un bourreau de travail » | la direction ; la maison s'éloigne |

La réputation colore les répliques de toute la ville (`si: flag(rep_comptoir)`). Elle déclenche
ses scènes et ses cartes, et elle s'écrit dans l'écran de fin.

## 6. Les événements — la ville vit sans toi

Les scènes de la semaine existent déjà. Elles reçoivent ce qui manquait : **la vie des gens que
tu connais**.
- **Leur histoire.** Chaque personne a deux ou trois scènes, gardées par le lien
  (`si: "relation.lulu >= 2"`). Le fils de Lulu est arrêté, l'épicière s'est fait braquer, le
  patron du Corner vend son fonds. Tu aides, ou non, et les effets sont réels : le lien, une
  jauge, de l'argent, un drapeau qu'une carte lira.
- **Les dettes.** On vient réclamer le service rendu.
- **Les réputations.** La photo du « pilier du Corner » dans L'Écho, la visite du bookmaker au
  « joueur ».
- **Les grands moments.** Un enterrement, un mariage, une fête du quartier. Être là compte
  (les tableaux de rue existent déjà).

Le moteur, de son côté, programme une carte quand un lien franchit un seuil (`on_relation`) :
c'est là que la ville entre dans l'histoire.

## 7. Ce qu'on voit

- **La trace, après chaque geste.** Une ligne sous le texte de l'activité : « Lulu s'en
  souviendra. », « Au Corner, on t'a vu payer ta tournée. ».
- **Le palier, quand un lien monte.** Un bandeau : « Lulu te tutoie, maintenant. »
- **La réputation, quand elle naît.** « En ville, on dit de toi : un pilier du Corner. »
- **Le carnet** (un bouton de la ville, « Les gens »). Il rassemble :
  - les visages connus, leur lieu, ce qu'ils sont devenus pour toi ;
  - les tuyaux reçus ;
  - les services disponibles, les dettes ;
  - le climat de chaque réseau, au dernier mot entendu ;
  - ce que la ville dit de toi.

## 8. Les formats (pour qui écrit)

**Une activité** (`content/ville/activites_*.yaml`) prend trois champs de plus :

```yaml
  - id: garage_cafe
    lieu: garage
    objet: machine_a_cafe
    label: "Un café avec Lulu"
    texte: "…"
    avec: lulu               # avec qui : un point de lien (au plus un par personne entre deux cartes)
    habitude: quartier       # ce que la ville compte
    effets: {set: [garage_habitue]}   # facultatif : un effet propre (drapeaux, var, jauges), comme une mission
```

**Une personne** (`content/ville/gens*.yaml`), par lots. Un nouveau visage n'a pas d'`age`, et aucun
mot de son nom n'est dans les réservoirs de noms (`content/names/fr.yaml`) : le moteur retire des
réservoirs tout mot porté par un personnage, et un Lucien ou un Ferrand de plus changerait les noms
tirés, donc toutes les carrières figées (`build_content` le refuse).

```yaml
gens:
  - id: lulu                       # un nouveau personnage, ou un personnage existant (on n'écrit alors que la ville)
    name: "Lucien « Lulu » Ferrand"
    label: "LE MÉCANO DU PONT"
    genre: m
    adresse: { … }                 # comme characters.yaml : comment il te parle
    portrait: { … }                # comme portraits.yaml
    lieu: garage
    tranches: [matin, midi, aprem]
    annees: [1990, 2016]           # son époque ; un successeur a son entrée (son fils, sa fille)
    reseau: rue
    trace: "Lulu s'en souviendra." # la ligne après un geste partagé (facultatif ; sinon générique)
    paliers: ["te reconnaît", "te tutoie", "ferait beaucoup pour toi"]
    froid: ["te boude", "t'en veut", "ne te sert plus"]
    activites: [garage_vidange]     # les activités de son lieu (déjà écrites) qu'on fait avec lui : un point de lien chacune
    climat:                         # ce qu'il dit de son réseau, par tranche de la jauge (pas pour `rue`, `milieu`…)
      bas:
        - "…"
        - { si: "role == president", texte: "…" }   # la jauge n'a pas le même visage pour tous les rôles
      moyen: ["…"]
      haut: ["…"]
    repliques:                      # quand on le touche (la grammaire des `si` de la ville)
      - { lien: 0, texte: "…" }
      - { lien: 2, si: "serie_d >= 2", texte: "…" }
      - { lien: -1, texte: "…" }    # froid : lien ≤ −1
    tuyaux:
      - id: lulu_berline            # pose le drapeau tuyau_lulu_berline
        lien: 2
        si: "flag(h1_berline_brulee) && !flag(h1_lhoste_1974)"
        texte: "« … »"
        effets: { var: { h1_piste: "+1" } }   # facultatif, en plus du drapeau
    service:
      lien: 3
      label: "Faire disparaître la voiture"     # 28 caractères au plus
      texte: "…"                                 # ce qui se passe (200)
      effets: { set: [service_lulu_voiture], jauges: { direction: 2 } }
      dette: true                                # pose dette_lulu ; une scène viendra la réclamer
```

Une phrase du climat est dite si son `si` est vrai ; la ville dit la première vraie de la tranche,
et se tait s'il n'y en a aucune. La jauge `direction` est « le président » pour l'entraîneur et le
directeur sportif, « le club » pour le joueur, « les actionnaires » pour le président, « la
Fédération » pour le sélectionneur ; `vestiaire` est « le staff », « le club » ou « le groupe »
selon le rôle ; `caisse` est le budget, le compte, la masse salariale, la trésorerie ou les moyens.

**Une scène de la vie de quelqu'un** : le format des scènes de la semaine, avec `qui: lulu` et
un `si` sur le lien (`"relation.lulu >= 2"`), une dette (`"flag(dette_lulu)"`) ou une réputation
(`"flag(rep_jeu)"`).

**La grammaire des `si` de la ville** apprend :
- `relation.<id> >= n` (elle le savait déjà) ;
- `habitude.<nom> >= n` ;
- `flag(rep_<habitude>)`, `flag(tuyau_<id>)`, `flag(dette_<id>)`.

Les cartes lisent la même chose dans leur `when` : `relation.lulu >= 2`, `flags.tuyau_lulu_berline`,
`vars.hab_comptoir >= 10`.

## 9. Les nouveaux quartiers

Les quatre quartiers du Grand Aubérive (`docs/histoires/grand_auberive.md`) arrivent avec leurs
gens. Le patron du Relais des routiers, l'éducateur de la maison de quartier, la fermière, le
concierge de l'Impérial : chacun a ses tuyaux, son service et ses scènes. Débloquer un quartier,
c'est rencontrer de nouvelles personnes, avec ce qu'elles savent et ce qu'elles peuvent pour toi.
