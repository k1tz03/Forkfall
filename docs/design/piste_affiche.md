# FUSIBLE — piste « L'affiche »

Clé de fichier : `affiche`.
Maquette : `/tmp/claude-0/-home-user-Forkfall/cd07074c-ad97-5e94-99ba-f10cfbe50abd/scratchpad/piste_affiche.html`
(page unique, trois écrans dans des cadres 390 × 844 à la même échelle, tout en ligne,
un seul `<link>` Google Fonts, aucune ressource externe).

---

## 1. Le concept en une phrase

> **Toute ta carrière est imprimée en deux encres par la même petite imprimerie de province — et aucune de ces affiches n'annonce une victoire.**

L'affiche de sport existe pour convoquer une foule. Ici on l'utilise à contre-emploi :
on imprime, avec la même énergie, le même format et la même violence typographique,
**une conversation dans un bureau, un SMS à 23h47, une signature qu'on regrette.**
Le jeu ne se passe pas sur le terrain, il se passe dans les couloirs : alors on
donne aux couloirs le traitement graphique réservé aux finales. C'est ce
décalage-là qui est drôle, et c'est lui qui est triste.

Le pays inventé n'a pas besoin d'un blason ni d'une carte : il lui suffit
d'**avoir eu une imprimerie**. Soixante ans d'affiches d'un même atelier, ça fait
un pays. On ne montre jamais le drapeau, on montre le papier sur lequel il aurait
été imprimé.

**La règle qui tient tout** : une affiche = **le papier + deux encres**. Rien
d'autre. Pas de troisième couleur, pas de dégradé, pas d'ombre douce. Les
valeurs intermédiaires ne s'obtiennent que par **trame** (points à 45 %) et par
**surimpression** (encre A sur encre B = une troisième valeur sombre). Cette
contrainte est un système, pas un style : elle rend les images cohérentes entre
elles, elle rend la génération vérifiable, et elle permet de **changer d'époque
sans redessiner** (§ 7).

---

## 2. Le monde visuel

### Ce qu'on voit
- **Des cadrages qui écrasent** : une tête coupée par le bord haut, deux mains sur
  un bureau qui occupent la moitié de l'affiche, un dossier de chaise en
  contre-jour, un dos de survêtement, un couloir en fuite.
- **Des aplats francs** : trois ou quatre formes par image, pas trente. La
  silhouette doit être lisible à 40 px de large, retournée, en négatif.
- **Des lieux de service** : bureau, couloir, salle de presse, parking, car,
  buanderie, salle d'attente d'hôpital, guichet de fédération.
- **Le papier** : il est visible partout, il est la couleur de fond de l'écran,
  il n'est jamais recouvert entièrement. Les zones claires d'une image sont du
  papier nu, pas du blanc imprimé.
- **Les marques de l'atelier** : repères de coupe aux angles, un filet de
  registre, une mention de tirage en tout petit. Discrètes, jamais décoratives.

### Ce qu'on ne voit jamais
Un ballon en vol. Un but. Une célébration. Un trophée, un podium, une médaille.
Un maillot lisible, un écusson, un sponsor, un nom dans le dos. Le vert pelouse
(c'est une couleur d'encre trop chère : elle n'apparaît que dans une seule
époque, § 7). Un dégradé. Une ombre portée floue. Une photographie. Un blanc
pur — il n'y a **pas de blanc** dans ce jeu, seulement du papier. Un objet
incliné : une affiche est collée droite, sinon elle se décolle.

### Le seul écart autorisé, et il est partout
**Le repérage raté.** Sur une presse fatiguée, la deuxième plaque tombe à côté :
l'image apparaît une deuxième fois, décalée de deux millimètres, en vermillon.
On réserve cet accident à **deux objets seulement** : le mot **FUSIBLE** et le
**tampon de fin**. Le reste du jeu est en repère parfait. Un fusible, c'est
exactement ça : le moment où le circuit se décale et où quelqu'un doit sauter.
C'est la signature du jeu — on la reconnaît en une seconde, et elle ne coûte
rien à produire (c'est un décalage de 3 px, pas une image).

---

## 3. La palette

Huit valeurs. C'est un **jeu d'encres d'époque** : ce tableau est celui de
1990-1999, les autres époques changent les hexadécimaux mais **jamais les rôles**
(§ 7). Ambiance unique et assumée, peinte explicitement, `color-scheme` déclaré.

| Nom | Hex | Rôle |
|---|---|---|
| `--paille` | `#E7CE72` | **Le papier.** Fond de tous les écrans, réserve dans les images, couleur du texte imprimé en négatif sur l'encre. Jamais un fond neutre : le papier est une couleur. |
| `--paille-haute` | `#F3E3A4` | Papier « gratté » : la réserve la plus claire d'une image (un reflet, une page, un écran de téléphone). Une seule par image. |
| `--paille-ombre` | `#C8AC4C` | Papier en ombre : filets, repères de coupe, mentions de tirage, libellés secondaires sur encre (6,5:1 sur outremer). |
| `--outremer` | `#16265C` | **Encre B.** L'encre de travail : texte courant, pavés pleins, silhouettes, bandeaux, boutons. 9,2:1 sur le papier. |
| `--outremer-trame` | `#7385AB` | Trame 45 % de l'encre B : les seconds plans, les foules, les stores, la profondeur. Jamais du texte. |
| `--vermillon` | `#DF3417` | **Encre A.** L'accent unique : le danger, le tampon, la plaque décalée, l'objet qui compte dans l'image. Interdit en petit texte (2,9:1 sur papier) — uniquement en aplat ou en capitales ≥ 24 px. |
| `--vermillon-trame` | `#EC8358` | Trame 45 % de l'encre A : les peaux, les chairs, la lumière chaude. Aplat seulement. |
| `--surimpression` | `#2A1223` | **A sur B.** Le seul « noir » du jeu. Contours, ombres franches, aplats les plus sombres, filet de pied de page. |

**Contrastes vérifiés** : outremer sur paille 9,2:1 · paille sur outremer 9,2:1 ·
paille-ombre sur outremer 6,5:1 · surimpression sur paille 12,9:1.
Le vermillon ne porte **jamais** de texte : ni petit corps, ni valeur, ni
libellé. Il n'existe qu'en aplat, en capitales ≥ 24 px (le tampon, la plaque
décalée) ou en signe court (`!`, carré de 7 px). Une jauge en danger est signalée
par quatre choses à la fois : la couleur, la hachure de surimpression à 45°, le
libellé qui devient un pavé plein à texte en réserve, et un `!`. Aucune
information n'est portée par la couleur seule.

**Pourquoi pas de crème.** Le brief interdit le crème-serif-terracotta ; on n'y
est pas : le papier n'est pas un fond neutre en attente d'être rempli, c'est une
**encre à part entière**, saturée, qui donne à l'écran sa dominante. Le crème
s'excuse, le paille assume.

---

## 4. La typographie

**Deux familles. Pas trois.** Une imprimerie de province n'a que les caractères
qu'elle possède ; la variété vient des chasses et des corps, pas du catalogue.

- **Archivo** (variable, `wdth 62..125`, `wght 400..900`) — Google Fonts.
  Repli : `'Archivo Narrow', 'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif`.
  On l'utilise **à ses deux extrêmes, jamais au milieu** : `wdth 62` pour tout ce
  qui crie (titres, tampons, noms), `wdth 118-125` pour tout ce qui étiquette
  (capitales espacées, chiffres, mentions). Une seule famille qui fait deux
  métiers opposés : c'est le geste typographique de la direction.
- **Spectral** (400, 600, italique 400) — Google Fonts.
  Repli : `'Source Serif 4', Georgia, 'Times New Roman', serif`.
  **Uniquement la parole** : le texte de la scène, l'épitaphe, le sous-titre.
  C'est la seule chose du jeu qui n'est pas de l'affichage : quelqu'un parle.
  Un serif, oui — parce qu'il faut que la voix humaine soit typographiquement
  d'une autre nature que l'imprimé qui l'entoure. C'est le seul serif du jeu.

### Échelle

| Usage | Famille | Corps / interligne | Chasse · graisse · détail |
|---|---|---|---|
| Titre du jeu (FUSIBLE) | Archivo | 78 / 0,82 | wdth 62 · 900 · caps · plaque vermillon décalée 3 px |
| Tampon de fin (VIRÉ) | Archivo | 92 / 0,84 | wdth 62 · 900 · caps · plaque décalée 4 px |
| Manchette de journal | Archivo | 27 / 0,92 | wdth 66 · 800 · caps |
| Titre de fin (« Le SMS de 23h47 ») | Archivo | 30 / 1,0 | wdth 70 · 700 |
| Nom du personnage | Archivo | 25 / 1,0 | wdth 64 · 800 · caps, en réserve sur bandeau outremer |
| Titre de postulat | Archivo | 20 / 1,05 | wdth 68 · 700 |
| Chiffres de bilan | Archivo | 32 / 1,0 | wdth 110 · 700 · `tabular-nums` |
| Valeur d'indicateur | Archivo | 19 / 1,0 | wdth 105 · 700 · `tabular-nums` |
| Réponses (boutons) | Archivo | 15 / 1,1 | wdth 96 · 700 · caps · `letter-spacing .06em` |
| Étiquettes, contexte, méta, fonction | Archivo | 11-12 / 1,2 | wdth 118 · 600 · caps · `letter-spacing .16em` |
| **Texte de la scène** | Spectral | **17 / 26** | 400, `text-wrap: pretty`, 4-7 lignes, aligné à gauche |
| Épitaphe | Spectral | 15 / 23 | italique 400 |
| Sous-titre du titre | Spectral | 15 / 1,3 | italique 400 |
| Mention de tirage / légende | Archivo | 11 / 1,2 | wdth 120 · 600 · caps · paille-ombre |

**Plancher** : rien de porteur d'information sous 11 px. Les mentions de tirage
sont à 11 px exactement, et c'est leur couleur (paille-ombre), pas leur corps,
qui les met au second plan.

---

## 5. La composition des trois écrans

**Le parti, en une phrase** : *chaque écran est une affiche à fond de papier
pleine page — pas de marge blanche, pas de carte flottante, pas de coin arrondi —
où l'image déborde sur les quatre côtés d'un seul bloc, et où tout le texte est
calé sur une colonne unique à 20 px du bord gauche.*

Conséquences appliquées partout : **rien n'est centré** (sauf le tampon, qui est
un objet posé, et les chiffres de bilan, qui sont un tableau) ; **aucun rayon
supérieur à 0** (le papier se coupe au massicot) ; **aucune bordure de carte** —
la séparation se fait par filet 2 px ou par changement d'encre pleine ; la seule
« profondeur » autorisée est la surimpression.

### 5.1 Écran TITRE — l'affiche du club
De haut en bas, sans gouttière :
1. **Image (300 px, pleine largeur, débordante)** : tribune traitée en trame
   outremer, bande de piste vermillon, silhouette de dos au premier plan coupée
   par le bas. Repères de coupe aux deux angles hauts.
2. **FUSIBLE** en Archivo 78 wdth 62, outremer, plaque vermillon décalée de 3 px
   vers la droite et le bas — le titre chevauche le bas de l'image de 24 px :
   il est *imprimé par-dessus*, pas posé à côté.
3. Sous-titre Spectral italique 15 : « Une carrière de football, de 1990 à 2050. »
4. Filet outremer 2 px, puis **quatre lignes de départ** (pas quatre cartes) :
   numéro `01`-`04` en Archivo large, titre condensé, méta en capitales espacées
   `ENTRAÎNEUR · D1 · 1990`. Séparées par un filet 1 px paille-ombre. La ligne
   choisie **s'inverse** : bloc outremer plein, texte en réserve. C'est tout.
5. **Champ « TON NOM »** : pas une boîte — un **trait à remplir**, comme sur une
   affiche où l'on écrit le nom de l'équipe à la main. Étiquette en capitales
   espacées au-dessus, filet outremer 2 px dessous, curseur vermillon.
6. Bouton pleine largeur : bloc outremer plein, `COMMENCER` en réserve.

### 5.2 Écran JEU — l'affiche de la scène
1. **Deux lignes d'en-tête** : une mention de tirage (`ÉTOILE AUBÉRIVE` /
   `SAISON 1 · 1990`, en paille-ombre) puis la ligne de contexte
   (`40 ANS · 10ᵉ DE DIVISION 1` à gauche, `■ OBJECTIF : MAINTIEN` à droite,
   le carré vermillon de 7 px étant le seul rôle du vermillon ici — le texte
   reste en outremer). Filet 1 px dessous.
2. **Les quatre indicateurs** : quatre **colonnes d'encre** côte à côte, pleine
   largeur, hauteur 56 px, séparées par 2 px de papier. Chacune se remplit **par
   le bas** en outremer ; le libellé est en haut, la valeur en bas à droite en
   chiffres tabulaires. En danger (≤ 20 ou ≥ 80) : la colonne passe en vermillon
   **et** reçoit une hachure de surimpression à 45° **et** la valeur passe en
   réserve. Pas de barre arrondie, pas de jauge circulaire : des colonnes de
   couverture d'encre, comme sur une bande de contrôle d'imprimeur.
3. **L'image de scène (288 px, débordante)** : cadrage serré sur le personnage,
   tête coupée par le bord haut, deux ou trois aplats derrière.
4. **Bandeau de nom** posé sur le bas de l'image, encre pleine, sans marge :
   `JEAN-MARIE VAUBOURG` en réserve + `PRÉSIDENT` en paille-ombre.
5. **Texte de la scène** : Spectral 17/26, outremer sur papier, colonne unique,
   filet vermillon 3 px de 28 px de haut collé à la marge gauche en tête de
   paragraphe (la seule marque de « quelqu'un parle »).
6. **Deux réponses** empilées, pleine largeur, 54 px : papier + filet outremer
   2 px + triangle plein indiquant le sens (◀ à gauche, ▶ à droite). Au contact,
   la bande s'inverse en encre pleine. Pas de couleur pour distinguer les
   réponses : c'est le sens de la flèche qui distingue, pas un code chromatique.
7. Mention de pied : `GLISSE À GAUCHE OU À DROITE`.

### 5.3 Écran FIN — l'affiche de la sortie
1. **Image (240 px, débordante)** : parking, un cône de lumière en papier haut,
   une silhouette de dos, un rectangle vermillon minuscule (l'écran du téléphone)
   — le seul vermillon de l'image.
2. **Tampon `VIRÉ`** : Archivo 92 wdth 62, chevauchant l'image, plaque vermillon
   décalée de 4 px. Non incliné.
3. Titre `Le SMS de 23h47`, puis épitaphe en Spectral italique.
4. **Le journal, traité en affiche et non en page** : un filet outremer 3 px,
   la mention `LE QUOTIDIEN DU BALLON` en capitales espacées, la manchette en
   Archivo 27 wdth 66 caps sur trois lignes. **Pas de colonnes, pas de fausse
   photo, pas de scotch** : une manchette, c'est déjà une affiche.
5. **Les chiffres** : quatre cellules séparées par des filets 1 px, chiffre en
   Archivo large 32, libellé en capitales espacées 11 px. `2 SAISONS · 1 RÔLE ·
   0 TITRE · 3/42 FINS`.
6. Deux actions : bloc plein `NOUVEAU TIRAGE` (le successeur — une carrière est
   un tirage) et un lien souligné `REJOUER LA MÊME AFFICHE`.

---

## 6. Le traitement des personnages

**Un personnage = une affiche de personne.** Chaque portrait obéit à quatre
règles fixes, qui sont ce qui garantit la cohérence des 42 :

1. **Le cadrage** : buste coupé sous les épaules, **la tête occupe 60 à 66 % de
   la hauteur**, le crâne est coupé par le bord haut de 5 à 10 %. Toujours.
   Personne n'est cadré en pied, personne n'est cadré en gros plan d'œil.
2. **Le regard hors champ** : personne ne regarde le joueur. Le camp décide du
   côté — direction et instances regardent **vers la gauche**, terrain et
   sélection regardent **vers la droite**. Quand deux camps se parlent, les
   regards se croisent hors de l'écran. C'est gratuit et ça raconte.
3. **Le détail unique** : un seul objet identifie le personnage, et il est en
   **vermillon** — la cravate du président, le sifflet du coach, le carnet du
   journaliste, le brassard, la montre de l'agent. Un personnage = un objet
   rouge. C'est la mémoire du joueur sur 60 ans.
4. **Les valeurs** : la peau est en `--vermillon-trame`, les cheveux et les
   vêtements sombres en `--outremer` ou `--surimpression`, les fonds sont du
   papier nu. Trois aplats maximum sur un visage : le visage, l'ombre du visage,
   les cheveux. Aucun modelé, aucun dégradé, pas de dents, pas d'iris détaillé —
   les yeux sont deux formes.

**Les trois expressions** (sourire / neutre / fermé) ne touchent que la bouche et
la ligne des sourcils : ce sont **trois formes de bouche et deux formes de
sourcil** livrées en SVG et posées sur le portrait généré. On ne génère pas trois
images par personnage : on génère **le visage neutre** et on imprime la bouche
par-dessus, comme une deuxième passe d'encre. Économie : 42 images au lieu de 126.

**Le joueur incarné** n'a jamais de visage. Il est toujours de dos ou hors champ.
C'est la seule silhouette entièrement en `--outremer` plein, sans trame de peau.

---

## 7. Le temps qui passe (1990 → 2050)

**Jamais de filtre « vieux ».** Ce qui change, c'est **le jeu d'encres et le
procédé d'impression** — parce qu'une imprimerie change de machine, pas de goût.
Cinq époques. Les **rôles** de la palette (§ 3) sont identiques dans les cinq :
seuls les hexadécimaux et le vocabulaire graphique changent.

| Époque | Procédé | Papier | Encre A | Encre B | Surimpression | Vocabulaire graphique |
|---|---|---|---|---|---|---|
| **1990-1999** | Sérigraphie 2 tons | paille `#E7CE72` | vermillon `#DF3417` | outremer `#16265C` | `#2A1223` | Trame grossière (points de 6 px), repères de coupe, chasse très étroite, texte à la main sur le trait du nom |
| **2000-2009** | Offset quadri bon marché | blanc froid `#EDECE7` | magenta `#D5197A` | noir de cuve `#17181C` | `#12060B` | Trame fine (2 px), premiers dégradés autorisés (offset sait le faire), chasse plus large, ombres portées dures |
| **2010-2019** | Numérique grand format sur bâche | gris bâche `#D2D3CE` | orange sécurité `#F26A1B` | cyan profond `#0E7FA8` | `#1B3040` | Plus de repères de coupe, plus de trame visible du tout : aplats absolument plats, bords nets, typographie plus large et plus molle |
| **2020-2034** | Retour du papier recyclé (mode rétro dans la fiction) | sable `#DCD3C2` | rose `#EE5D86` | vert bouteille `#14503A` | `#241A24` | La trame grossière revient **volontairement** : c'est une citation, pas une usure. Repères de coupe décoratifs, mal placés |
| **2035-2050** | Plus de papier : panneau lumineux | ardoise `#12141A` | rouge `#F0483C` | blanc lumineux `#EDE9DE` | — (l'encre s'additionne, elle ne se multiplie plus) | Le papier a disparu : le fond devient sombre, les aplats deviennent des surfaces émissives, le grain disparaît, le repérage devient parfait. **Le fusible ne saute plus. C'est ça, la tristesse de la fin.** |

**Ce que ça donne à jouer** : le joueur ne « voit » pas le temps passer, il le
subit — l'écran change de couleur trois ou quatre fois dans une carrière, jamais
pendant une scène, toujours à l'ouverture d'une saison de bascule (1999→2000,
2009→2010, 2019→2020, 2034→2035), en une transition de 500 ms où les deux plaques
se recalent. Le passage à 2035 est le seul moment où le fond passe du clair au
sombre : c'est un événement, pas une option.

**Ce que ça coûte** : rien en production d'images, tout en discipline (§ 10.5).
Les images sont générées **une seule fois** en 1990 et **recolorées à
l'exécution**, parce qu'elles n'ont que quatre valeurs identifiables.

---

## 8. Le mouvement

Une affiche ne bouge pas. Ce qui bouge, c'est **la presse**.

| Événement | Ce qui se passe | Durée |
|---|---|---|
| Arrivée d'une scène | **Deux passes d'encre** : l'affiche apparaît d'abord en outremer seul, puis la plaque vermillon tombe 90 ms plus tard. C'est tout le « changement de carte » | 90 + 130 ms |
| Glissement | L'affiche se déplace **en bloc, sans rotation, sans échelle** — une feuille de papier qu'on pousse. Le fond derrière est du papier nu | suit le doigt |
| Validation | La feuille sort par le bord, l'affiche suivante est déjà dessous | 180 ms |
| Aperçu d'effet pendant le glissement | La colonne d'indicateur concernée gagne un **liseré de surimpression 3 px** en haut ou en bas selon le sens. Aucune animation de valeur | 100 ms |
| Indicateur en danger | La hachure de surimpression **se décale d'1 px** puis revient, toutes les 1,4 s : le repérage tremble | 1,4 s en boucle |
| Tampon de fin | La plaque outremer est déjà là ; la **plaque vermillon tombe de 4 px** et s'arrête net. Pas de rebond, pas de rotation | 320 ms |
| Bascule d'époque | Les huit valeurs de la palette s'interpolent d'un jeu d'encres à l'autre, une seule fois, à l'ouverture de saison | 500 ms |
| Texte | Fondu d'opacité. **Jamais lettre par lettre** | 120 ms |

Ce qui ne bouge **jamais** : le papier, les filets, la typographie (aucun
tremblement de titre), les images (aucun parallaxe, aucun zoom lent).

`prefers-reduced-motion: reduce` : les deux passes d'encre deviennent une seule
apparition ; le tampon est directement dans son état décalé final ; la hachure de
danger est fixe ; la bascule d'époque est instantanée. **Rien ne disparaît** :
tous les états finaux restent visibles.

---

## 9. Ce que la direction rend difficile (honnêtement)

1. **Deux encres, c'est peu.** Il n'y a pas de couleur libre pour un cinquième
   indicateur, pour un camp supplémentaire, pour une notion nouvelle. Le jour où
   le jeu voudra distinguer six choses par la couleur, il ne pourra pas. Il
   faudra distinguer par la forme, ce qui est plus long à concevoir.
2. **Le vermillon ne peut pas porter de texte.** 2,9:1 sur le papier. Toute
   alerte doit être doublée d'une hachure et d'un changement de réserve. C'est
   une contrainte permanente sur chaque nouvel écran.
3. **Les générateurs d'images détestent les aplats.** Ils ajoutent du modelé, du
   volume, une troisième couleur, une lumière. Sans la passe de postérisation
   automatique (§ 10.5), une image sur trois est inutilisable. Cette passe est
   une vraie brique logicielle à écrire, pas une option.
4. **L'illustration dérive plus que la photo.** Deux visages illustrés par le
   même modèle se ressemblent moins que deux photos du même studio. Les 42
   portraits demandent une planche-mère, une grammaire de cadrage stricte et une
   planche-contact de validation — c'est du travail humain, il n'est pas
   automatisable.
5. **Un fond jaune saturé fatigue** sur une session d'une heure. On compense en
   n'imprimant jamais plus de 45 % de la surface, en posant le texte long sur le
   papier (jamais en réserve sur l'encre) et en donnant aux époques 2 et 3 des
   papiers beaucoup plus calmes. Le jaune est un choix de *première décennie*,
   pas du jeu entier — et c'est justement le propos.
6. **Cinq jeux d'encres, c'est cinq validations d'accessibilité**, pas une. Le
   couple vert bouteille / rose de 2020 est le plus fragile ; il a été choisi
   pour ça (une imprimerie qui se croit maligne), mais il devra être testé.
7. **La bascule vers un fond sombre en 2035** casse toute la logique « papier »
   construite pendant 45 ans de jeu. C'est voulu, c'est le meilleur moment de la
   direction, et c'est aussi celui qui peut être perçu comme une erreur si on
   l'atteint sans y avoir été préparé.

---

## 10. L'inventaire des images à générer

Format de livraison : **PNG 8 bits à palette indexée de 4 couleurs**
(papier · encre A · encre B · surimpression), sans alpha sauf mention.
La palette indexée n'est pas une coquetterie : c'est elle qui rend la
recoloration d'époque (§ 7) possible en une table de correspondance.

| # | Famille | Nombre | Taille source | Format | Détail |
|---|---|---|---|---|---|
| 1 | **Portraits de personnages** | **42** | 1200 × 1500 (4:5) | PNG indexé 4 c. | Un par personnage, expression neutre. Les 3 bouches et 2 sourcils sont en SVG par-dessus (§ 6) |
| 2 | **Portraits vieillis** | **18** | 1200 × 1500 | PNG indexé 4 c. | Seulement les 18 personnages qui traversent plus de 25 ans de jeu ; une deuxième version « + 25 ans » |
| 3 | **Silhouettes du joueur incarné** | **6** | 1200 × 1500 | PNG indexé, alpha | De dos : coach en survêtement, joueur en maillot, costume, à 3 âges. Aplat outremer plein |
| 4 | **Décors de scène** | **36** | 1170 × 870 (4:3) | PNG indexé 4 c. | 12 lieux × 3 époques graphiques (1990 / 2010 / 2040). Le décor est derrière le portrait, pas avec lui |
| 5 | **Affiches de postulat** | **4** | 1170 × 1460 (4:5) | PNG indexé 4 c. | Écran titre, une par point de départ |
| 6 | **Affiches de fin** | **21** | 1170 × 1460 | PNG indexé 4 c. | Une par fin écrite |
| 7 | **Bandeaux de manchette** | **12** | 1170 × 660 (16:9) | PNG indexé 4 c. | Un par famille de une de fin de saison ; illustration seule, la manchette est du texte vivant |
| 8 | **Tuiles de trame et de matière** | **6** | 600 × 600 | PNG alpha, répétable | Trame 6 px, trame 2 px, grain de papier, fibres, bord de massicot, colle sèche |
| 9 | **Repères d'atelier** | **8** | 200 × 200 | SVG | Repères de coupe, croix de registre, gamme de gris — vectoriels, jamais générés |
| | **Total images générées** | **139** | | | (+ 8 SVG dessinés à la main) |

Dérivés produits par script, pas par génération : versions @1x/@2x/@3x,
recolorations d'époque (5 × par image = table de correspondance, 0 génération),
miniatures de planche-contact.

---

## 11. Les prompts

### 11.0 Le bloc de style (à copier **tel quel** en tête de chaque prompt)

> `two-colour screen print poster, flat spot inks only, no gradients, no shading, no photography, printed on warm straw-yellow paper, one red-orange ink and one deep navy ink, third dark value only where the two inks overprint, coarse 45-degree halftone dots in the mid tones, hard edges, high contrast, bold simplified shapes, generous empty paper, European sports poster of the early nineties, anonymous mundane subject, no logos, no text, no lettering, no brand marks, no numbers on clothing`

Négatif systématique (Midjourney `--no`, Gemini en phrase) :
`--no text, letters, words, logo, emblem, crest, sponsor, jersey number, gradient, glow, bokeh, photorealism, 3d render, watermark, signature, trophy, medal, celebration, ball in flight, crowd cheering`

Trois règles de rédaction, valables pour les deux outils :
- **Jamais de nom propre.** Aucun club, joueur, marque, compétition, ville
  réelle. On décrit une fonction (« a club president in his fifties »), un lieu
  (« a concrete stadium corridor »), un vêtement (« a plain unmarked tracksuit »).
- **Jamais un maillot identifiable** : `plain unmarked kit`, `no number`,
  `no crest`, `solid colour shirt`.
- **Jamais un identifiant d'outil ou de modèle** dans les fichiers de prod : on
  versionne par la planche-mère, pas par le moteur.

---

### 11.1 Portraits de personnages (famille 1 et 2)

**Midjourney**
```
<bloc de style> :: chest-up portrait of a heavy-set club president in his late fifties, three-quarter view, head cropped slightly by the top edge, head filling two thirds of the frame, looking off-frame to the left, closed unreadable expression, flat straight mouth, heavy brow, dark suit, single red necktie as the only red-orange object, skin rendered as one flat halftone tint, hair as one solid navy shape, empty paper background, no background objects
--ar 4:5 --style raw --s 120 --chaos 0 --sref <URL_PLANCHE_MERE> --sw 90 --seed 4711 --no text, letters, words, logo, emblem, crest, sponsor, jersey number, gradient, glow, bokeh, photorealism, 3d render, watermark, signature
```

**Gemini** (même image, formulation en prose ; on joint la planche-mère en
image de référence et on l'appelle explicitement)
```
En reprenant EXACTEMENT le style de l'image de référence jointe (sérigraphie deux
encres sur papier paille : une encre rouge-orangé, une encre bleu marine, une
troisième valeur sombre uniquement là où les deux encres se superposent, trames
de points grossières à 45°, aplats sans dégradé), produis un portrait en buste
d'un président de club d'une petite cinquantaine d'années, corpulent, vu de trois
quarts, le sommet du crâne coupé par le bord haut du cadre, la tête occupant les
deux tiers de la hauteur, le regard porté hors champ vers la gauche, l'expression
fermée, la bouche droite, les sourcils lourds. Costume sombre traité en aplat
bleu marine. Une seule cravate rouge : c'est le seul objet rouge-orangé de
l'image. La peau est un aplat unique de trame rouge-orangée, sans modelé. Le fond
est du papier vide, aucun objet. Format 4:5. Aucun texte, aucune lettre, aucun
logo, aucun écusson, aucun numéro, aucun dégradé, aucun effet photographique.
```

**Le cas des 18 portraits vieillis** : on ne régénère pas de zéro. On repasse le
portrait d'origine en image de référence (`--sref` du portrait lui-même,
`--sw 140`) et on n'écrit que le delta : `same man, twenty-five years older, hair
now one flat pale shape, deeper brow line, same necktie` — le vermillon de son
objet ne change jamais, c'est le fil qui le rend reconnaissable.

---

### 11.2 Décors de scène (famille 4)

**Midjourney**
```
<bloc de style> :: empty concrete corridor under a stadium stand, seen head-on, strong one-point perspective, closed fire door at the far end, a plastic chair against the wall, floor and walls as three flat navy shapes, a single red-orange stripe painted along the wall at waist height, lower left third left as plain paper for text, no people
--ar 4:3 --style raw --s 90 --chaos 0 --sref <URL_PLANCHE_MERE> --sw 80 --seed 4712 --no text, letters, words, logo, people, faces, gradient, photorealism, 3d render
```

**Gemini**
```
Dans le style exact de l'image de référence jointe (sérigraphie deux encres sur
papier paille), dessine un couloir de béton vide sous une tribune de stade, vu de
face, forte perspective à un point de fuite, une porte coupe-feu fermée au fond,
une chaise en plastique contre le mur. Sol et murs traités en trois aplats bleu
marine, une seule bande rouge-orangé peinte le long du mur à hauteur de hanche.
Le tiers inférieur gauche reste du papier nu, sans motif : c'est la place du
texte. Aucun personnage, aucun texte, aucun logo, aucun dégradé. Format 4:3.
```

---

### 11.3 Affiches de postulat et de fin (familles 5 et 6)

**Midjourney**
```
<bloc de style> :: a lone figure seen from behind in a plain unmarked tracksuit, standing in an empty floodlit car park at night, cropped at the knees by the bottom edge, one hard cone of pale paper light falling from the top right, the figure a single solid navy silhouette, one tiny red-orange rectangle glowing in his hand, vast empty paper sky, deep silence, poster composition with the whole upper third left empty
--ar 4:5 --style raw --s 140 --chaos 0 --sref <URL_PLANCHE_MERE> --sw 80 --seed 4713 --no text, letters, words, logo, faces, crowd, gradient, glow, photorealism, 3d render
```

**Gemini**
```
Dans le style exact de l'image de référence jointe, dessine une silhouette seule
vue de dos, en survêtement uni sans marque, debout sur un parking désert éclairé
la nuit, coupée aux genoux par le bord bas. Un unique cône de lumière, traité en
papier clair, tombe depuis le haut à droite. La silhouette est un aplat bleu
marine plein, sans détail. Un minuscule rectangle rouge-orangé brille dans sa
main : c'est le seul rouge de l'image. Le ciel est du papier vide. Le tiers
supérieur reste libre, il recevra un titre. Aucun visage, aucune foule, aucun
texte, aucun dégradé. Format 4:5.
```

---

### 11.4 Bandeaux de manchette (famille 7)

**Midjourney**
```
<bloc de style> :: wide horizontal composition, three anonymous men in dark suits shaking hands over a table, seen from chest height, heads cropped by the top edge, only hands and torsos visible, a red-orange folder on the table as the single accent, flat navy shapes, wide empty paper margins on both sides
--ar 16:9 --style raw --s 110 --chaos 0 --sref <URL_PLANCHE_MERE> --sw 85 --seed 4714 --no text, letters, words, logo, faces, gradient, photorealism, 3d render
```

**Gemini** : même consigne, en prose, avec la mention explicite « têtes coupées
par le bord haut, on ne voit que les mains et les bustes » et « une chemise
cartonnée rouge-orangé posée sur la table est le seul accent coloré ».

---

### 11.5 La méthode de cohérence (c'est elle qui compte)

1. **La planche-mère.** Avant tout le reste, on génère et on choisit **une seule
   image** : une grille de six visages, même papier, mêmes deux encres, même
   trame. On la retouche à la main jusqu'à ce qu'elle soit exactement la charte.
   Elle est hébergée à une URL stable et devient **l'unique `--sref` du projet**
   (et l'unique image de référence jointe côté Gemini). On ne la change jamais en
   cours de production ; si on la change, on régénère tout.
2. **Le bloc de style figé** (§ 11.0) : neuf phrases, copiées **à l'identique**,
   jamais reformulées. La variation ne vit que dans la phrase de sujet.
3. **La grammaire de cadrage figée** (§ 6) : coupe du crâne, part de la tête dans
   le cadre, côté du regard, un seul objet vermillon. Ces quatre paramètres sont
   dans un tableau, un par personnage, et ils sont écrits dans le prompt — jamais
   laissés au hasard.
4. **La graine par famille** : `--seed 4711` pour tous les portraits, `4712` pour
   les décors, `4713` pour les affiches, `4714` pour les bandeaux. Deux
   personnages générés à la même graine avec le même bloc de style partagent
   l'éclairage et la trame ; c'est ce qui fait qu'ils ont l'air d'être du même
   atelier.
5. **La passe de postérisation** — la vraie garantie. Un script (Pillow /
   ImageMagick) prend l'image générée et la réduit **de force** à quatre couleurs
   par quantification vers la palette d'époque : papier, encre A, encre B,
   surimpression. Tout ce que le modèle a inventé (un beige, un reflet, un
   dégradé) est écrasé sur la valeur la plus proche. **La couleur n'est plus
   jamais décidée par le générateur.** C'est ce qui rend 139 images cohérentes
   même si elles ont été produites sur trois mois par trois personnes.
6. **La planche-contact.** Les 42 portraits sur une page, à 120 px de large,
   imprimée. Tout visage qui « saute » (une chasse de trame différente, un
   cadrage plus lâche, une peau plus claire) est refait. C'est le seul contrôle
   qui marche, et il est humain.
7. **Le test de la silhouette.** Chaque image est passée en aplat noir sur blanc
   à 40 px de large. Si on ne reconnaît pas ce que c'est, l'image est refusée :
   une affiche qui ne tient pas en silhouette n'est pas une affiche.
