# FUSIBLE — piste « Le dossier » (clé : `archive`)

Maquette : `/tmp/claude-0/-home-user-Forkfall/cd07074c-ad97-5e94-99ba-f10cfbe50abd/scratchpad/piste_archive.html`
(trois écrans, cadres 390 × 844, un seul fichier, Google Fonts seules, `prefers-reduced-motion` respecté).

---

## 0. Le concept, en une phrase

> **Une carrière de football consultée comme un fonds d'archives : chaque scène est une pièce cotée, posée d'aplomb sur un banc de numérisation, et les quatre équilibres ne sont pas des jauges mais des densités — elles se bouchent par le bas, elles brûlent par le haut.**

Le joueur n'est pas dans le stade. Il est dans la salle de consultation, en 2050, et il dépouille le fonds
d'un club qui n'existe plus. Le présent du jeu, c'est le banc. Le passé, c'est ce qu'on pose dessus.

**La blague de la direction** — et c'est elle qui porte le ton sec du jeu : une administration parfaitement
froide, indifférente au football, classe méthodiquement des histoires de vestiaire, de dettes et de SMS à
23 h 47. L'humour ne vient jamais de l'image ; il vient de l'écart entre le sérieux du support et la
bêtise de ce qu'il conserve. C'est exactement la place que le texte de FUSIBLE occupe déjà.

### Pourquoi ce n'est pas l'album de vignettes (rejeté)

Le territoire « documents » est celui qui frôle le plus l'identité rejetée. L'écart est pris à cinq
endroits, tous structurels, aucun cosmétique :

| L'album (rejeté) | Le dossier |
|---|---|
| Papier **crème chaud**, bois, scotch, nostalgie | **Gris de mire neutre** et papier gris-blanc froid ; aucun brun, aucun bois, aucun ruban adhésif |
| Objets **penchés joliment** (album −3°, pochettes +8°, vignettes ±2°) | Tout est **d'aplomb**, aligné, coté, mesuré. Une seule pièce est de travers dans tout le jeu : la photocopie (la feuille était mal posée sur la vitre) |
| **Illustration vectorielle** en aplats, paper dolls | **Photographie** seule, N&B documentaire, générée. Aucun dessin |
| Rouge **décoratif** (aimants, ficelle, badges, bandeaux) | Rouge **réservé** : danger, verdict, annotation au feutre. Jamais de décor, et jamais sur le gris — uniquement sur le papier |
| **Quatre familles de couleurs** de jauges (bleu, orange, violet, jaune-vert) | Aucune couleur de jauge. Les quatre équilibres se lisent en **densité** — la même échelle de gris pour tous les quatre |
| Métaphore **chaleureuse** (l'enfance, la collection) | Métaphore **froide** (l'instruction, le récolement) |

---

## 1. Le monde visuel

### Ce qu'on voit
- Le **banc de numérisation** : un plan gris neutre, une lampe rasante en haut à gauche, une mire de gris
  en pied d'écran, une bande de cotation noire en tête. C'est le cadre, il ne change jamais.
- Des **pièces** posées dessus, une à la fois : note d'entretien, télex, bordereau, fiche cartonnée,
  feuille de match, convocation, relevé, coupure photocopiée, capture d'écran imprimée.
- Des **photographies d'agence en noir et blanc** : couloirs de service, parkings, bancs de touche vides,
  bureaux à contre-jour, gradins de dos, cars de reportage, chambres d'hôtel, gares.
- Des **portraits d'accréditation** : la photo du laissez-passer, flash frontal, mur neutre derrière.
- Des **marques** : tampons rouges, perforations, agrafes, trombones, ombres de bord de vitre de copieur.
- Des **nuques, des dos, des mains**. Le hors-champ. Ce qui se passe après le coup de sifflet.

### Ce qu'on ne voit jamais
Un ballon en l'air. Un but. Un stade plein. De la couleur en dehors du rouge de greffe et du cyan de cote.
Un maillot reconnaissable, un écusson, un numéro, une marque. Un visage qui sourit à l'objectif. Du bois,
du scotch, du crème, de la texture chaleureuse. Un objet penché « pour faire joli ». Un coin arrondi.

---

## 2. La palette : « le fonds »

Huit valeurs, pas une de plus. Le jeu est en gris ; le rouge est une information, le cyan est une machine.

| Variable | Hex | Nom | Rôle |
|---|---|---|---|
| `--mire-18` | `#5D6063` | **Gris de mire** | Le banc. Fond des trois écrans. Le gris neutre qu'on photographie à côté d'un document pour l'étalonner. Aucun petit texte ne s'y pose (voir §2.1) |
| `--fosse` | `#3E4144` | **Gris de fosse** | Le sol de la salle : fond de page hors téléphone, creux, dessous des pièces, plans reculés |
| `--noir-argent` | `#131518` | **Noir argentique** | L'encre. Texte sur papier, cartouches (bande de cotation, ligne de contexte, boutons), noirs des photographies |
| `--papier` | `#E3E2DD` | **Papier de dossier** | Le seul grand aplat clair. Gris-blanc **froid**, pas crème : c'est du papier photographié sous lumière neutre, pas du papier attendri par le temps |
| `--papier-ombre` | `#C4C3BD` | **Papier de dessous** | Pli, verso, deuxième feuillet, tranche d'une pile de pièces |
| `--blanc-mire` | `#F4F3F0` | **Blanc de charte** | Le patch 100 % de la mire. Texte sur noir et sur gris, filets, index du densitomètre |
| `--rouge-greffe` | `#B4241A` | **Rouge de greffe** | La seule couleur chaude. Tampon, feutre du greffier, zone brûlée d'une densité, verdict, puce d'action. **Jamais décoratif** |
| `--cyan-cote` | `#4FB6C9` | **Cyan de cote** | Tout ce qui est écrit par la machine et non par un humain : cotes, numéros de pièce, années de l'almanach, dates. **Uniquement sur noir** |

### 2.1 La règle de contraste (elle vient du gris moyen, et elle est structurante)

Un gris à 18 % ne donne 4,5:1 ni avec le noir ni avec le blanc. Au lieu de le fuir, on en fait une loi de
composition :

- **Sur le banc gris** : uniquement du `--blanc-mire` (5,7:1), ≥ 11 px, et des marques graphiques.
- **Le petit texte vit sur du papier** (`--noir-argent` sur `--papier` : 14:1) **ou sur un cartouche noir**
  (`--blanc-mire` : 12,2:1 ; `--cyan-cote` : 7,7:1).
- **Le rouge ne porte du texte que sur du papier** (5,0:1). Sur le gris il n'est qu'un trait, un cadre,
  une hachure.

Conséquence : l'écran s'organise tout seul en trois registres — le banc (gris, muet), la machine (noir,
cyan, chiffres), la pièce (papier, noir, le texte qu'on lit). C'est la grille de lecture du jeu.

Les densités ne se lisent jamais par la couleur seule : chiffre + position de l'index + hachures + cadre
rouge. Un daltonien lit exactement la même chose.

---

## 3. Typographie — deux familles, et c'est un parti

Une administration n'a pas trois polices. Elle en a deux : celle des **imprimés** et celle des **machines
à écrire**. Pas de troisième famille pour le journal : dans cette direction, la Une n'est pas une belle
page de presse, c'est une **photocopie** — elle emprunte donc la police des imprimés, écrasée par la trame.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..800&family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap">
```

- **Archivo** (variable, axes `wdth` 62→125 et `wght` 400→800) — `--f-adm`.
  Un grotesque administratif, dessiné pour les formulaires et la signalétique. **Son axe de largeur est
  le vrai outil** : la même famille fait la cote étroite à 62 %, le libellé à 70 % et le titre large à
  112 %, comme une boîte de caractères à corps mobiles où l'on prend la chasse qu'il faut.
  Repli : `Roboto Condensed, Arial Narrow, Helvetica Neue, sans-serif`.
- **Courier Prime** (400 / 700 / italique) — `--f-tap`. La voix du dossier : tout ce qui a été **frappé**
  — le texte des 1 241 scènes, les dates, les cotes, l'épitaphe, l'almanach. Vraie italique et vrai gras,
  contrairement au Courier système.
  Repli : `Courier New, ui-monospace, monospace`.

Aucune des familles interdites (Inter, Space Grotesk), aucun serif de presse (c'était Fraunces dans
l'album).

### Échelle

| Usage | Famille | Taille / interligne | Largeur / graisse | Casse |
|---|---|---|---|---|
| Titre du jeu (`FUSIBLE`) | Archivo | 44 / .86 | wdth 112 · 800 | capitales |
| Manchette de fin | Archivo | 27 / 1.02 | wdth 96 · 800 | normale |
| Tampon (VIRÉ…) | Archivo | 38 / 1.06 | wdth 78 · 800 · .06em | capitales |
| Nom du personnage | Archivo | 19 / 1.03 | wdth 74 · 800 · .02em | capitales |
| Titre de manchette photocopiée | Archivo | 19 / 1.04 | wdth 66 · 800 | capitales |
| Titre de dossier (postulat) | Archivo | 15,5 / 1.2 | wdth 82 · 700 | normale |
| Bouton d'action | Archivo | 14 | wdth 70 · 800 · .16em | capitales |
| Fonction, libellé de densité, en-tête de section, bande de cotation | Archivo | 11–12 | wdth 62–70 · 700–800 · .1–.2em | capitales |
| **Texte de scène** | Courier Prime 400 | **13,5 / 21** | — | normale, ferré à gauche |
| Épitaphe | Courier Prime italique | 12,5 / 19 | — | normale |
| Valeur de densité | Courier Prime 700 | 14 | — | chiffres |
| Cote, date, métadonnée, almanach, légende, récolement | Courier Prime 400 | 11–11,5 | — | normale |

**Règle** : tout ce qui se lit pour jouer est ≥ 11 px. Le texte de scène est ferré à gauche, mesure
≤ 42 caractères, jamais centré, jamais justifié — une note d'entretien n'est pas justifiée.

---

## 4. Composition des trois écrans

Un parti unique : **une bande de cotation noire en tête, la mire de gris en pied, et entre les deux la
pièce du jour.** Le cadre est identique sur les trois écrans ; seul ce qu'on pose dessus change. Rien
n'est centré, tout est ferré à gauche sur une marge de 14 px.

### 4.1 Titre — *le bordereau de versement* (390 × 844)

| Bande | Contenu |
|---|---|
| 0–36 | Cotation : puce rouge · `FONDS — CONSULTATION` · `BANC 03 · 2050` (cyan) |
| 36–222 | Photographie de couverture (bouche de tunnel, contre-jour, un homme de dos en survêtement sans marque) ; par-dessus, l'**étiquette de la chemise** : `FUSIBLE` en Archivo 44 large, le sous-titre en Courier, et le **tampon `FONDS 1990‑2050`** posé sur le papier — le tampon ne va jamais sur la photo, il n'y serait pas lisible |
| 222–290 | **Champ nom** sur cartouche noir : `NOM DU TITULAIRE DU DOSSIER`, ligne à remplir, curseur cyan clignotant. C'est un champ de formulaire, il n'a pas besoin d'être habillé |
| 290–318 | `DOSSIERS VERSÉS ————— 04` |
| 318–866* | **Quatre chemises** empilées : onglet noir coté `D-01…D-04` (cyan, à la verticale), vignette photographique 46 px, titre Archivo 15,5, ligne `Entraîneur · D1 · 1990` en Courier. Le dossier sélectionné est **encadré de rouge**, pas coloré |
| pied | Légende « image à générer » + mire de gris 10 pas + `mire de contrôle · D 0.00 → 2.10` |

\* les chemises occupent l'espace restant à parts égales (`flex:1`) — quatre départs aujourd'hui, six demain, sans retoucher la maquette.

### 4.2 Jeu — *la pièce sur le banc* (390 × 844)

| Bande | Contenu |
|---|---|
| 0–36 | Cotation : `ÉTOILE AUBÉRIVE` · **`EA/1990/S01/P0417`** (cyan) |
| 36–140 | **Le densitomètre** — les quatre équilibres (§4.4). C'est l'instrument du banc, il est en haut, il ne se manipule pas |
| 140–170 | Ligne de contexte sur cartouche noir : `SAISON 1 · 1990 · 40 ANS` / `10e · OBJ. MAINTIEN` |
| 170–885 | **La pièce** — une note d'entretien sur papier, bord noir à gauche, ombre portée dure + douce : en-tête (`NOTE D'ENTRETIEN` / `14.08.1990 — 09 h 20`) ; **portrait d'accréditation 104 × 128 agrafé en haut à gauche**, avec à droite le nom sur deux lignes, la fonction en cartouche noir, la cote d'accréditation, l'expression, et le **tic du personnage écrit au feutre rouge dans la marge** ; le texte de la scène en Courier ; la **photographie d'agence jointe** (bureau à contre-jour) ; les **deux visas** |
| pied | `◄ Pousser la pièce pour la classer ►` + mire + `support : tirage argentique · 1990` |

**Les deux réponses sont des visas**, pas des boutons : deux lignes dactylographiées en bas de la pièce,
`◄ G` / `D ►`, et un **cadre au feutre rouge légèrement de travers** qui se referme sur celle que le
pouce désigne. Zone de touche 44 px minimum, dans le tiers bas de l'écran.

Composition asymétrique volontaire : le portrait à gauche, le texte pleine largeur dessous. Une carte
Reigns est centrée ; une pièce d'archive ne l'est pas.

### 4.3 Fin — *la clôture du dossier* (390 × 844)

| Bande | Contenu |
|---|---|
| 0–36 | Cotation : `ÉTOILE AUBÉRIVE` · `EA/1992/S02 — CLÔTURE` |
| 36–180 | Photographie de la pièce fatale (parking la nuit, une silhouette, l'écran du téléphone comme seule source de lumière) |
| 124–176 | **Le tampon `VIRÉ`** à cheval sur le bord bas de la photo, rouge, encre rompue, −4° |
| 180–290 | Manchette `Le SMS de 23 h 47` (Archivo 27) + épitaphe (Courier italique) |
| 290–420 | **La coupure photocopiée** : `LE QUOTIDIEN DU BALLON` en filet gras, la manchette du journal, une photo tramée, des colonnes illisibles, une agrafe, une **ombre de bord de vitre** à gauche, et **−0,7° de travers** — le seul objet penché du jeu, et il l'est pour une raison |
| 420–560 | **Ce qui s'est passé** — l'almanach, trois lignes en télex, l'année en cyan |
| 560–680 | **Bordereau de récolement** — `Saisons ······ 02`, `Rôles ······ 01`, `Titres ······ 00`, `Fins connues ······ 03 / 42`. Un inventaire à conduites de points, pas quatre gros chiffres décoratifs |
| 680–800 | `■ VERSER UN NOUVEAU DOSSIER — D-05` (barre noire pleine largeur) + `relire la pièce fatale` |
| pied | mire + `dossier clos · 1992` |

### 4.4 Le densitomètre — le risque esthétique, pris à un seul endroit

Les quatre équilibres ne sont pas des jauges. Ce sont **quatre colonnes d'un nuancier de densité** :
26 px de large, dix paliers de noir à blanc, un **index blanc** qui pointe la valeur depuis l'extérieur
de la colonne, le chiffre en Courier dessous, le libellé en Archivo étroit, et une mention technique
(`D 1.05`).

- **Sous 20 : bouché.** Les deux paliers du bas passent en hachures rouges, le cadre devient rouge.
  L'image de ta carrière n'a plus de détail dans les ombres.
- **Au-dessus de 80 : brûlé.** Les deux paliers du haut passent en hachures rouges (état de *Tribunes 80*
  dans la maquette). Trop de lumière : on ne voit plus rien non plus.

C'est le seul endroit où la direction prend un vrai risque, et il tient parce qu'il dit quelque chose de
juste sur le jeu : **on meurt des deux côtés**. Une tribune qui t'adore trop te tue autant qu'une tribune
vide. Aucun autre jeu de football n'affiche ses jauges comme un densitomètre ; on reconnaît cet écran en
une seconde. Tout le reste de l'interface est délibérément calme pour que ce seul objet porte l'identité.

---

## 5. Les personnages

**Un personnage = une photo d'accréditation**, jamais un portrait d'auteur. Le laissez-passer, le badge
d'entrée, la photo agrafée sur la fiche : cadrage frontal serré (tête = 55 % de la hauteur), mur neutre à
60 cm derrière, **flash direct** qui plaque une ombre dure d'un côté, regard qui n'est pas complice.
Personne ne pose. Personne ne sourit à l'objectif.

- **Les trois expressions** (sourire / neutre / noir, déjà dans `characters.yaml`) sont **trois vignettes
  de la même bande**, générées en une seule image. Même mur, même lumière, même visage : la cohérence est
  gagnée à la génération, pas rattrapée après.
- Le **tic** du personnage (`« J'ai pas le temps, j'ai un empire. »`) est écrit **au feutre rouge dans la
  marge de la fiche**, en Courier italique, filet rouge à gauche. C'est l'annotation d'un archiviste qui
  a lu le dossier avant toi.
- Les **camps** (`terrain`, `direction`, `instances`, `sélection`) ne sont pas des couleurs de fond : ce
  sont des **types de pièce**. Terrain → note de vestiaire, papier bon marché. Direction → papier à
  en-tête, frappe nette. Instances → télex, bordereau numéroté. Sélection → convocation officielle,
  perforée. On reconnaît d'où vient une carte à la forme du document, avant même de lire le nom.
- Le **vêtement** est toujours sans marque : survêtement uni, chemise, costume, blouson. Aucun écusson,
  aucun numéro.

---

## 6. Le temps qui passe : 1990 → 2050

**Le cadre ne vieillit jamais. Le support, si.** Le banc de numérisation est de 2050 et regarde 1990 : la
mire, la bande de cotation, le densitomètre, la typographie de l'interface restent identiques sur soixante
ans. Ce qui change, c'est la matière de la pièce posée dessus. C'est ce qui rend le vieillissement
tenable : on fait vieillir 235 images, pas une interface.

| Âge | Années | Support | Photographie | Frappe | Ce qui se dégrade |
|---|---|---|---|---|---|
| I | 1990–1997 | Tirage argentique, papier machine, bords crantés, perforations, tampon dateur au dos qui transparaît | Grain argentique franc, contraste moyen, 35 mm | Machine mécanique, ruban usé, lettres qui sautent, frappe en creux | rien encore |
| II | 1998–2007 | **Télécopie et photocopie** : contraste écrasé, bandes de traînage verticales, poussière de la vitre, papier thermique qui pâlit | Tramé grossier, blancs bouchés | Marguerite puis matricielle | les demi-teintes |
| III | 2008–2019 | Laser sur A4, agrafe, plis de classeur, surlignage passé | Numérique compact, N&B propre, plat | Corps 10 bureautique | le grain — l'image devient lisse et sans caractère |
| IV | 2020–2035 | **Capture d'écran imprimée puis rephotographiée** : moiré, horodatage, artefacts de compression, aplats d'interface | Téléphone, haute sensibilité, bougé | Frappe d'écran | la matière : plus de papier, un simulacre de papier |
| V | 2036–2050 | Pièce native numérique : filigrane de conservation, bruit de capteur, vignetage de compression | Capteur poussé, bruit chromatique **désaturé de force** | Rendu logiciel | tout — le fichier se dégrade par le bas, le grain revient, mais ce n'est plus le même grain |

La ligne en pied d'écran l'annonce à chaque carte : `support : tirage argentique · 1990`, puis
`support : photocopie · 2003`, puis `support : capture · 2028`. Le joueur voit son époque changer de
matière sans qu'on la lui explique.

**Trois ères, trois humeurs de gris** (rien d'autre ne bouge) : les présidents bâtisseurs (I–II) ont des
noirs profonds et des blancs sales ; les fonds (III–IV) ont un gris plat, sans noir ni blanc vrais — rien
n'y a de relief ; le futur (V) a un contraste qui remonte, mais bruité, faux.

---

## 7. Le mouvement

Une salle d'archives ne rebondit pas. Rien ne fait de ressort, rien ne « pop ». Liste fermée :

| Geste | Durée | Détail |
|---|---|---|
| Pièce sous le doigt | suit le pointeur | **Translation pure, aucune rotation.** On pousse un document sur une table, on ne lance pas une carte. L'ombre portée se décolle légèrement (2 → 6 px) pendant le glissement |
| Cadre au feutre | 90 ms | Le visa désigné se referme dans un cadre rouge, apparition sèche (pas de fondu progressif) |
| Aperçu de densité | 90 ms | L'index de la colonne concernée se dédouble en fantôme à la valeur future |
| Validation | à 28 % de la largeur | La pièce sort du cadre à plat, 180 ms, courbe linéaire (elle glisse, elle ne vole pas) |
| Retour | 200 ms | `ease-out`, **sans dépassement** — un document repoussé ne rebondit pas |
| Pièce suivante | 140 ms | Elle est **posée** : translation de 8 px depuis le haut + ombre qui se pose. Jamais un fondu, jamais un empilement de cartes |
| Index de densité | 220 ms, `steps(6)` | Il se déplace **par paliers**. C'est un instrument, pas un liquide |
| Zone brûlée / bouchée | 1,4 s | Les hachures respirent (opacité .55 ↔ 1) |
| Tampon de fin | 90 ms | Il **s'imprime en un temps** : opacité 0 → 1, aucun `scale`, aucune rotation animée. Un léger décalage d'encre (1 px) au dernier tiers |
| Coupure du journal | 260 ms, délai 400 ms | Elle est **posée sur la pièce**, translation courte + ombre |
| Texte | 0 | Il ne s'anime pas. Jamais lettre à lettre |

**Ce qui ne bouge jamais** : la mire, la bande de cotation, le densitomètre lui-même, le cadre de l'écran.
Le banc est fixe. C'est ce qui rend le mouvement de la pièce lisible.

`prefers-reduced-motion: reduce` : tout est coupé ; le tampon, les hachures et le cadre au feutre restent
dans leur état final ; le glissement ne translate plus, la pièce est simplement remplacée.

---

## 8. Ce que cette direction rend difficile (honnêtement)

1. **Le noir et blanc sur 1 241 scènes.** La variété ne peut plus venir de la couleur : elle doit venir du
   cadrage, de la valeur et du type de document. C'est une discipline de directeur photo, pas de
   graphiste. Si les 72 photographies d'agence se ressemblent, le jeu devient gris au sens propre. Parade :
   un quota de cadrages imposé à la commande (§9), et le type de pièce qui change avec le camp.
2. **Le gris moyen est un fond exigeant.** En plein soleil sur un écran de téléphone, il est moins lisible
   qu'un fond très clair ou très sombre, et il n'offre 4,5:1 ni avec le noir ni avec le blanc. La règle
   du §2.1 le compense, mais elle **interdit** de poser du petit texte sur le fond — toute maquette future
   doit s'y plier. C'est une contrainte réelle, pas une précaution.
3. **Courier Prime en corps de texte.** Lecture 5 à 10 % plus lente qu'un sans-serif, et il faut tenir
   l'interligne à 21 px et la mesure à 42 caractères. Sur des scènes de six lignes, c'est acceptable et
   ça donne le ton ; sur un texte long, ce serait une faute. Point de vigilance à chaque écriture de carte.
4. **Aucune image ne doit contenir de texte lisible.** Les générateurs écrivent du faux texte : ici c'est
   une chance, on le **demande** (« unreadable lettering »), et tout le vrai texte est posé en HTML
   par-dessus. Mais cela signifie qu'aucune image générée n'est réutilisable telle quelle comme document
   fini : chaque pièce est un **fond** + une **mise en page vivante**. Le pipeline est en deux temps.
5. **235 générations cohérentes en N&B, c'est un vrai budget** — et la cohérence ne s'obtient pas au
   prompt seul : elle s'obtient à la passe de post-traitement (§10.2, étape 6). Sans cette moulinette,
   la série se disloque au trentième portrait.
6. **On perd la couleur d'équipe.** Pas de vert pour la pelouse, pas de couleur de club : l'identification
   des dix clubs du pool doit passer par la cote, le nom en cotation et le type de papier. C'est plus
   austère et moins immédiat qu'un écusson coloré.
7. **Le froid peut aplatir l'humour.** Si le texte n'est pas drôle, l'image ne viendra pas le sauver : elle
   n'a aucun ressort comique propre. Cette direction parie entièrement sur l'écriture — c'est son risque
   et, pour FUSIBLE, sa raison d'être.
8. **Les époques IV et V menacent l'unité.** Une capture d'écran est native en couleur et en aplats. Règle
   sans exception : *la capture est imprimée en noir et blanc, puis rephotographiée sur le banc.* Tout
   passe par le papier, même en 2050.
9. **Un mot sur les partis interdits.** Aucun n'est repris : pas de crème, pas de serif, pas de terracotta,
   pas de vert acide, pas de dégradé, pas d'Inter, pas d'émoji, rien de centré, **rayon 0 partout**. Un
   seul point d'attention : la pièce a un **bord noir sur un seul côté** (le chant de la reliure), ce qui
   n'est pas un liseré de carte — un liseré entoure, un bord tient.

---

## 9. Inventaire des images à générer

**235 générations · ≈ 315 fichiers livrés.** Tout en niveaux de gris (les fichiers de travail restent en
16 bits ; la livraison est en WebP 8 bits gris, sauf alpha en PNG).

| # | Famille | Générations | Découpe / livraison | Taille livrée | Format |
|---|---|---|---|---|---|
| **A** | **Portraits d'accréditation** — 42 personnages + 14 re-tirages d'époque (ceux qui traversent plusieurs ères) | **56** | 1 bande de 3 vues → 3 vignettes | gen. 1536 × 640 · livré **480 × 600** ×3 | WebP gris |
| **B** | **Supports d'époque** — 5 âges × 4 variantes de papier vierge | **20** | tel quel, tuilable verticalement | **1240 × 1748** | PNG gris |
| **C** | **Photographies d'agence** — 24 couloirs/coulisses, 16 tribunes & abords, 12 bureaux & salles, 12 terrain hors match, 8 transport & hôtel | **72** | tel quel | **1456 × 1088** (4:3) | WebP gris |
| **D** | **Pièces administratives photographiées** — télex, bordereau, note de service, fiche cartonnée, feuille de match, convocation, facture, relevé, planning, contrat, ticket, ordonnance | **36** | tel quel | **1200 × 1600** (3:4) | WebP gris |
| **E** | **Coupures photocopiées** — gabarits de Une et de brève, colonnes illisibles | **14** | tel quel | **1400 × 900** | WebP gris |
| **F** | **Matière d'encre de tampon** — 24 empreintes (le **mot n'est jamais généré** : on génère l'encre, le mot est composé en Archivo et masqué par la matière) | **24** | détouré | **1000 × 360** | PNG alpha |
| **G** | **Éléments du banc** — charte de gris, règle graduée, coin de calibration, agrafes, trombone, perforations, ombre de bord de vitre, poussière | **8** | détourés | **1200 × 400** | PNG alpha |
| **H** | **Couverture + vignettes de postulat** — 1 image de titre, 4 vignettes de chemise | **5** | tel quel | 1170 × 760 · 4 × 300 × 380 | WebP gris |

Densités d'affichage : livrer en @2x du plus grand emploi. Budget cible : ≤ 3,2 Mo de portraits, ≤ 9 Mo
d'images total pour le premier lot jouable (les photographies d'agence se chargent à la demande).

---

## 10. Les prompts

### 10.0 Le bloc de fonds — à recopier **mot pour mot** dans chaque prompt

> `black and white archival photograph, neutral documentary tone, medium contrast, fine silver grain, plain unbranded clothing, provincial European setting, available light, nothing heroic, no colour`

Et le bloc de refus, en fin de prompt Midjourney :

> `--no color, logo, emblem, crest, jersey number, sponsor, brand, watermark, readable text, caption, signage, smiling at camera, crowd celebration, trophy, floodlit stadium panorama, illustration, painting, 3d render, cinematic teal orange`

Aucun nom de club, de joueur, de marque ou de compétition n'apparaît nulle part : les prompts décrivent
des lieux et des fonctions génériques (un stade, un couloir, un survêtement), jamais une identité.

### 10.1 Famille A — portraits d'accréditation

**Midjourney** (un par personnage ; ici Vaubourg, président, 58 ans) :

```
accreditation ID photo strip, three frames of the same man side by side, a heavy-set man of about 58 in a dark suit and pale open-collar shirt, receding hair, thick neck, shoulders square to the lens, framed from mid-chest up, head filling 55 percent of the frame height, dead centre, plain pale grey office wall 60 cm behind him, direct on-camera flash, flat frontal light with one hard shadow to his right, expressions left to right: mouth closed and unimpressed / neutral and administrative / a short mirthless smile, black and white archival photograph, neutral documentary tone, medium contrast, fine silver grain, plain unbranded clothing, provincial European setting, available light, nothing heroic, no colour --ar 12:5 --style raw --s 50 --chaos 0 --sref <URL_PLANCHE_ZERO> --sw 110 --seed 704412 --no color, logo, emblem, crest, jersey number, sponsor, brand, watermark, readable text, caption, signage, smiling at camera, crowd celebration, trophy, floodlit stadium panorama, illustration, painting, 3d render, cinematic teal orange
```

**Gemini** (équivalent, en prose ; la même consigne, sans paramètres) :

```
Produis UNE SEULE image en noir et blanc, format panoramique 12:5, contenant trois cadres côte à côte
du même homme, comme une bande de photos d'accréditation prises dans la même séance.

Sujet : un homme d'environ 58 ans, corpulent, costume sombre, chemise claire au col ouvert, cheveux
dégarnis, cou épais. Cadré de la mi-poitrine à la tête, épaules parallèles au capteur, tête dead centre
occupant 55 % de la hauteur du cadre.

Conditions identiques dans les trois cadres : mur de bureau gris pâle à 60 cm derrière lui, flash direct
sur l'axe de l'objectif, lumière frontale plate, une seule ombre dure portée à sa droite.

Expressions, de gauche à droite : bouche fermée et peu impressionné / neutre et administratif / un
sourire bref et sans joie.

Rendu : photographie d'archive noir et blanc, ton documentaire neutre, contraste moyen, grain argentique
fin, vêtement uni sans marque, cadre provincial européen, rien d'héroïque.

Interdits absolus : couleur, logo, écusson, numéro de maillot, sponsor, marque, filigrane, texte lisible,
légende, sourire à l'objectif, fond de studio, flou d'arrière-plan artistique, illustration, rendu 3D.
```

### 10.2 Comment 42 portraits restent cohérents

1. **La planche zéro.** Générer d'abord **une seule** bande de trois vues, dans ces conditions exactes,
   avec un inconnu quelconque. Choisir celle qui a le plus l'air d'une pièce d'archive. L'héberger.
   Son URL devient le `--sref` de **toutes** les autres générations, `--sw 110`.
2. **Le bloc constant.** Les 58 mots de conditions (cadrage, distance, mur, lumière, ombre, rendu,
   interdits) sont copiés **à l'identique**, jamais reformulés, jamais réordonnés. Une synonymie suffit à
   décrocher la série.
3. **Le bloc variable, ≤ 25 mots.** Uniquement : âge, corpulence, cheveux, vêtement d'époque, fonction.
   **Aucun adjectif de style** (`cinematic`, `moody`, `dramatic`, `beautiful`) — ils cassent la série
   plus vite que tout le reste.
4. **Une graine par lot de dix** (`--seed`), notée dans le tableau de suivi. On ne change de graine que si
   le lot entier est refait.
5. **Le triptyque en une passe.** Les trois expressions naissent dans la **même image** : même mur, même
   flash, même visage. C'est la seule façon d'avoir 168 vignettes qui tiennent ensemble.
6. **Le passage au banc** (obligatoire, c'est lui qui fait la série, pas le générateur) :
   désaturation totale → point noir 8 / point blanc 240 → gamma 1,05 → **grain identique ajouté à toutes**
   → recadrage sur une grille fixe où la tête fait 55 % ± 3 % de la hauteur → export 480 × 600.
7. **Le contrôle, toutes les dix générations.** Monter les vignettes en planche-contact 6 × 7 et regarder
   à distance : si un visage saute, c'est presque toujours le **gris du mur** ou la **taille de tête**,
   pas le style. On refait cette bande-là, pas le lot.
8. **Vocabulaire commun des fonctions** (à réutiliser tel quel) : `club president` → costume sombre,
   chemise claire ; `head coach` → survêtement uni ou polo, sifflet jamais visible ; `club secretary` →
   cardigan, lunettes, classeur ; `agent` → veste de cuir, chemise ouverte ; `federation official` →
   costume gris, cravate ; `local journalist` → parka, carnet ; `supporter` → blouson, écharpe **unie**.

### 10.3 Famille B — supports d'époque (5 prompts, un par âge)

**Midjourney** (âge I, 1990–1997) :

```
flat overhead scan of a single blank sheet of 1990s typing paper, photographed straight on under even light, faint mechanical typewriter impressions with no readable letters, two punch holes at the left edge, one horizontal fold, slight cockling at the corners, paper fibre and dust, edge to edge, no object on it, black and white archival photograph, neutral documentary tone, medium contrast, fine silver grain, no colour --ar 5:7 --style raw --s 25 --chaos 0 --no color, logo, brand, watermark, readable text, handwriting, illustration, 3d render, vignette, drop shadow
```

Variantes : âge II `photocopied sheet, crushed contrast, vertical drag bands, copier glass dust, thermal
paper fading` · âge III `plain laser-printed A4, one staple, ring-binder creases, faded highlighter` ·
âge IV `printed screenshot rephotographed on paper, screen moiré, timestamp band, compression artefacts` ·
âge V `born-digital document print, sensor noise, conservation watermark, compression vignetting`.

**Gemini** (âge I) :

```
Produis une image en noir et blanc, format vertical 5:7 : le scan à plat d'une feuille de papier machine
vierge des années 1990, photographiée bien à plat sous une lumière uniforme, cadre plein bord à bord.
Détails : de très légères empreintes de frappe mécanique dont AUCUNE lettre n'est lisible, deux
perforations sur le bord gauche, un pli horizontal, un léger gondolage des coins, la fibre et la
poussière du papier. Rien n'est posé dessus.
Rendu : photographie d'archive noir et blanc, ton documentaire neutre, contraste moyen, grain argentique
fin, aucune couleur.
Interdits : couleur, logo, marque, filigrane, texte lisible, écriture manuscrite, illustration, rendu 3D,
vignettage artistique, ombre portée.
```

### 10.4 Famille C — photographies d'agence

**Midjourney** (exemple : couloir de service) :

```
press agency photograph from the early 1990s, the concrete service corridor beneath a small provincial football ground, wet floor, one bare fluorescent tube on the ceiling, a man in a plain unbranded tracksuit walking away from the camera at the far end, shot from hip height on a 35 mm lens, deep shadows, nobody looking at the camera, ordinary and unremarkable, black and white archival photograph, neutral documentary tone, medium contrast, fine silver grain, provincial European setting, available light, nothing heroic, no colour --ar 4:3 --style raw --s 40 --chaos 0 --sref <URL_PLANCHE_ZERO_LIEUX> --sw 80 --seed 511903 --no color, logo, emblem, crest, jersey number, sponsor, brand, watermark, readable text, caption, signage, smiling at camera, crowd celebration, trophy, floodlit stadium panorama, illustration, painting, 3d render, cinematic teal orange
```

**Quota de cadrages** imposé à la commande, pour que les 72 images ne se ressemblent pas :
20 % à hauteur de hanche, 20 % en plongée depuis un escalier ou une tribune, 20 % à travers une
ouverture (porte entrebâillée, vitre, grillage), 20 % de dos ou de nuque, 20 % de détail (mains, chaussures,
un banc vide, un vestiaire après). **Jamais de contre-plongée héroïque.**

**Gemini** :

```
Produis une image en noir et blanc, format 4:3 : une photographie d'agence de presse du début des années
1990. Sujet : le couloir de service en béton sous les tribunes d'un petit stade de football de province,
sol mouillé, un unique tube fluorescent nu au plafond. Au fond du couloir, un homme en survêtement uni
sans aucune marque s'éloigne, de dos. Prise de vue à hauteur de hanche, objectif 35 mm, ombres profondes.
Personne ne regarde l'objectif. La scène est ordinaire, sans rien de remarquable.
Rendu : photographie d'archive noir et blanc, ton documentaire neutre, contraste moyen, grain argentique
fin, lumière disponible, rien d'héroïque, aucune couleur.
Interdits : couleur, logo, écusson, numéro de maillot, sponsor, marque, filigrane, texte lisible,
panneau, sourire à l'objectif, liesse, trophée, panorama de stade éclairé, illustration, rendu 3D.
```

### 10.5 Famille D — pièces administratives photographiées

```
overhead photograph of a single administrative document lying flat on a neutral grey surface, a photographic grey scale strip and a small steel ruler placed alongside it, typed on a mechanical typewriter with blurred unreadable lettering, one rubber stamp mark, a paperclip at the corner, hard raking light from the upper left casting a thin shadow along the paper edge, document photography, black and white archival photograph, neutral documentary tone, medium contrast, fine silver grain, no colour --ar 3:4 --style raw --s 30 --chaos 0 --sref <URL_PLANCHE_ZERO_PIECES> --sw 90 --no color, logo, brand, watermark, readable text, legible words, illustration, 3d render, desk clutter, coffee cup, plant
```

**Gemini** : *« Produis une image en noir et blanc, format 3:4 : la photographie en vue plongeante d'un
document administratif unique posé à plat sur une surface gris neutre, à côté d'une charte de gris
photographique et d'une petite règle en acier. Le document est tapé à la machine à écrire et son texte
est flou et totalement illisible. On y voit une empreinte de tampon et un trombone dans un coin. Lumière
rasante et dure venant du haut à gauche, qui projette une ombre fine le long du bord du papier. Rendu de
photographie documentaire, noir et blanc, ton neutre, contraste moyen, grain argentique fin, aucune
couleur. Interdits : couleur, logo, marque, filigrane, mot lisible, illustration, rendu 3D, désordre de
bureau, tasse, plante. »*

### 10.6 Famille E — coupures photocopiées

```
a photocopy of a newspaper clipping on plain paper, heavy halftone dot screen, blown-out whites and clogged blacks, the sheet lying slightly crooked on the copier glass so a black band runs down one edge, one small halftoned photograph in the upper left, columns of completely illegible grey type, a staple hole, dust specks from the glass, flat even scan, black and white, no colour --ar 3:2 --style raw --s 25 --chaos 0 --no color, logo, brand, watermark, readable text, legible headline, illustration, 3d render, torn paper aesthetic, coffee stain
```

**Gemini** : *« … la photocopie d'une coupure de journal sur papier ordinaire : trame de points grossière,
blancs brûlés et noirs bouchés, la feuille est posée légèrement de travers sur la vitre du copieur, si
bien qu'une bande noire court le long d'un bord. Une petite photographie tramée en haut à gauche, des
colonnes de texte gris totalement illisible, un trou d'agrafe, des poussières de vitre. Numérisation
plate et uniforme, noir et blanc… »*

### 10.7 Famille F — matière d'encre de tampon (le mot n'est jamais généré)

```
a rubber stamp impression in red ink on plain white paper, no letters, only the broken ink texture of a plain double rectangular border, ink uneven and patchy, edges bleeding into the paper fibre, slightly rotated, isolated on pure white, high resolution, flat scan --ar 5:2 --style raw --s 20 --chaos 0 --no letters, words, text, logo, emblem, colour other than red, gradient, drop shadow, 3d render, illustration
```

En production : le mot (`VIRÉ`, `RETRAITÉ`, `CLASSÉ SANS SUITE`…) est **composé en Archivo 800 wdth 78**
et la matière d'encre lui sert de **masque**. On ne demande jamais un mot à un générateur : il l'écrirait
mal, et il ne l'écrirait pas dans notre police.

### 10.8 Famille G — éléments du banc

```
a photographic grey scale calibration target, ten steps from solid black to pure white, photographed flat under even light on a neutral grey surface, faint sheen on the card, technical reference object, isolated, black and white, no colour --ar 3:1 --style raw --s 15 --chaos 0 --no color, logo, brand, readable text, numbers, illustration, 3d render, perspective distortion
```

Variantes : `a steel ruler`, `a corner calibration mark`, `two office staples`, `a bent paperclip`,
`a row of punch holes in paper`, `the shadow of a copier glass edge`, `dust and fibre on glass`.

### 10.9 Famille H — couverture

```
press agency photograph, the mouth of a stadium players' tunnel at night seen from inside the dark corridor, a single strip light on the ceiling, the bright opening at the far end, a lone man in a plain unbranded tracksuit standing in the opening with his back to the camera, rim light on his shoulders, deep black walls, shot on a 35 mm lens from floor level, black and white archival photograph, neutral documentary tone, medium contrast, fine silver grain, nothing heroic, no colour --ar 16:10 --style raw --s 45 --chaos 0 --seed 704412 --no color, logo, emblem, crest, jersey number, sponsor, brand, watermark, readable text, signage, crowd, trophy, illustration, 3d render, cinematic teal orange
```

---

## 11. Ce que ça donne côté moteur

Les identifiants de l'aperçu jouable sont conservés ; seule leur habillage change.

| Donnée moteur | Élément | Traitement |
|---|---|---|
| `club`, `season`, `year` | `.cotation .ref` | **La cote est le HUD** : `EA/1990/S01/P0417`. Elle remplace la barre de statut |
| `age`, `rank`, `objective` | `.contexte` | Cartouche noir, Courier 11, ferré aux deux bords |
| `gauges[]` | `.densito` | Quatre colonnes de densité ; `danger` si ≤ 20 (bouché, hachures en bas) ou ≥ 80 (brûlé, hachures en haut) |
| `previewLeft/Right` | `.dens .index` fantôme | Index dédoublé pendant le glissement |
| `speakerName`, `speakerLabel` | `.identite .qui` | Nom en Archivo étroit, fonction en cartouche noir |
| `expression` | vignette du triptyque | La 1ʳᵉ, 2ᵉ ou 3ᵉ vue de la bande d'accréditation |
| `tic` | `.feutre` | Annotation au feutre rouge dans la marge |
| `camp` | type de pièce | terrain / direction / instances / sélection → note, papier à en-tête, télex, convocation |
| `kind` | en-tête de pièce | `alarme` → mention `URGENT` tamponnée · `nouvelle` → coupure · `palier` → note d'entretien · `passe` → pièce d'un âge antérieur |
| `text` | `.corps` | Courier 13,5/21, ferré à gauche, ≤ 42 caractères de mesure |
| `left/rightLabel` | `.visa` | Deux visas dactylographiés ; cadre au feutre sur celui que le pouce désigne |
| année en cours | `.mire .pied` | `support : photocopie · 2003` — l'âge du support s'annonce en pied |
| `ending.title` / `epitaph` | `.verdict h3` / `.epi` | Manchette Archivo + épitaphe Courier italique |
| type de fin | `.tampon` | Mot en Archivo masqué par la matière d'encre |
| Une du journal | `.coupure` | Photocopie tramée, −0,7°, agrafe, ombre de vitre |
| journal auto | `.telex` | « Ce qui s'est passé » : année en cyan + ligne en Courier |
| `stats` | `.recolement` | Bordereau à conduites de points, chiffres sur deux positions (`02`, `03 / 42`) |
