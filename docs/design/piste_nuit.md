# FUSIBLE — piste « La nuit du stade »

Clé de fichier : `nuit`. Maquette : `/tmp/claude-0/-home-user-Forkfall/cd07074c-ad97-5e94-99ba-f10cfbe50abd/scratchpad/piste_nuit.html`
(page unique, trois écrans dans des cadres 390 × 844 à la même échelle, tout en ligne, un seul `<link>` Google Fonts).

---

## 1. Le concept en une phrase

> **Tu es le fusible : tout ce qu'on voit est éclairé par le courant qui te traverse, et le jour où ça saute, l'image s'éteint avec toi.**

Le jeu s'appelle FUSIBLE. Un fusible est la pièce qu'on sacrifie pour que
l'installation survive : il chauffe, il rougit, il claque, on le remplace en
trente secondes et personne ne retient son nom. C'est exactement le métier.
La direction prend ce mot au pied de la lettre et en fait le **système
d'éclairage du jeu** : chaque image a une source électrique et une seule ; les
quatre équilibres ne sont pas des barres de progression mais **quatre cartouches
sur un tableau** ; et la fin de carrière n'est pas un tampon, c'est une coupure
de courant.

Ce n'est pas une métaphore posée sur le jeu : c'est la règle même. Une jauge
tue par le vide **et** par le trop-plein — un filament s'éteint faute de courant
ou blanchit en surcharge. Aucune autre direction ne peut emprunter ça, parce
qu'aucune autre ne s'appelle FUSIBLE.

---

## 2. Le monde visuel

**Un principe** : on ne voit jamais le football, on voit le bâtiment qui
l'entoure, la nuit, allumé par quelqu'un qui a payé la facture.

### Ce qu'on voit
- Des **couloirs** : béton peint, portes coupe-feu, extincteur, distributeur,
  une plante en plastique, un néon sur deux qui marche.
- Des **pièces mal éclairées** : bureau présidentiel à 21 h, salle de soins,
  chaufferie, local du matériel, salle de presse aux chaises empilées, car de
  télévision, autocar à l'arrêt sur une aire, vestiaire après l'extinction.
- Des **extérieurs de nuit** : parking sous lampe au sodium, pylône de
  projecteurs vu d'en dessous, gradin vide vu depuis la pelouse, portail
  d'entrée, un abribus, une station-service sur le chemin du retour.
- Des **visages pris de près**, de trois quarts, souvent de dos-trois-quarts,
  jamais de face, jamais en train de poser. Ils regardent hors champ, ils
  parlent à quelqu'un qu'on ne voit pas, ils attendent.
- Des **objets** qui font toute la comédie : un photocopieur, un chariot de
  ballons, un sac de sport posé sur une chaise en plastique, un téléphone qui
  éclaire un menton.

### Ce qu'on ne voit jamais
Le jour. Le soleil. Une pelouse verte au grand jour. Un but, une action, un
ballon en vol. Une foule qui exulte. Un trophée. Un podium. Un maillot lisible,
un logo, un sponsor, un chiffre dans le dos. Un sourire tourné vers l'objectif.
Une contre-plongée héroïque. Deux sources de lumière dans la même image.

### La règle photographique (elle est aussi une règle d'interface)
**Une seule source par image, et le tiers inférieur gauche tombe dans le noir.**
Ce n'est pas un effet : c'est la place réservée au texte. Le texte de la scène
vit **dans l'ombre de la photo, jamais dans la lumière**. Toutes les images
générées doivent respecter cette zone morte — c'est une clause obligatoire des
prompts (§10).

### L'aveu du dispositif
Chaque image porte, en bas, une **légende de tirage** : lieu, heure, année,
support. `ÉTOILE AUBÉRIVE · BUREAU PRÉSIDENTIEL · 21 H 10` / `1990 · 24×36 ·
1600 ASA · PL. 07`. C'est la ligne qui fonde le pays inventé — on n'a pas besoin
d'une carte ni d'un blason, il suffit que les archives existent. C'est aussi là
que loge l'humour sec : la légende ne commente jamais, elle constate.

---

## 3. La palette

Huit valeurs, nommées par leur source lumineuse. Ambiance unique et assumée :
il n'y a pas de mode clair, parce qu'il n'y a pas de jour dans ce jeu.
`color-scheme: dark` est déclaré, le fond est peint explicitement.

| Nom | Hex | Rôle |
|---|---|---|
| `--nuit` | `#07080B` | Le noir de fond. Bleuté, jamais `#000` : un noir pur est un noir sans caméra. Fond de page, fond des écrans, hors-champ. |
| `--cendre` | `#12151A` | Noir levé. Les deux bandes d'appareil (rail de fusibles en haut, barre de réponses en bas), les surfaces opaques qui portent du texte. |
| `--beton` | `#2A2E33` | Béton du couloir. Filets 1 px, séparateurs, glissières de fusibles éteintes, tramé du journal. |
| `--tungstene` | `#F3C778` | **Marque.** L'ampoule halogène de 1990. Lumière principale, filaments à mi-course, accents, barre d'action, chiffres. |
| `--brulure` | `#FFF6E2` | Le cœur de la source, surexposé. Blanc chaud : texte principal, arêtes éclairées, filament en surcharge, le mot du verdict. Jamais `#FFF`. |
| `--sodium` | `#D2662C` | La lampe de parking. Alerte : jauge en danger, fusible grillé, cote hors norme. C'est le seul rouge du jeu, et c'est une lampe, pas un carton. |
| `--froid` | `#8FA9BC` | La LED de 2040 et l'écran de téléphone. Texte secondaire, légendes de tirage, libellés. Et la couleur qui gagne à mesure que le siècle avance (§7). |
| `--papier-nuit` | `#CBC3B4` | Le papier du journal **vu sous une lampe**. Ivoire sale, jamais blanc : la Une est photographiée, pas imprimée. |

Contrôles de contraste (sur `--nuit` / `--cendre`) : `--brulure` 17,4:1 · `--tungstene`
12,9:1 · `--froid` 7,4:1 · `--sodium` 5,1:1 (réservé aux libellés ≥ 11 px en
graisse 600 et aux surfaces, jamais au corps de texte). Encre `--nuit` sur
`--papier-nuit` 14,8:1. **Aucune information ne repose sur la couleur seule** :
une jauge en danger est simultanément décalée en valeur (filament surexposé ou
éteint), taguée en toutes lettres (`SURCHARGE` / `À SEC`) et chiffrée.

### Ce qui est écarté, et pourquoi
Pas de crème + serif + terracotta (c'est la piste rejetée, et c'est du papier).
Pas de dégradé violet-bleu (c'est une nuit de synthèse, pas une nuit de stade).
**Pas de vert acide** : la sortie de secours était l'évidence du couloir, et
c'est précisément pour ça qu'elle est interdite ici — un noir profond plus un
vert acide, c'est la signature de tout le monde. La seule couleur froide
autorisée est la LED `--froid`, et elle n'a pas le droit d'être saturée.

---

## 4. La typographie

Trois familles, toutes sur Google Fonts, avec un système de rôles strict :
**les gens parlent en serif, la machine parle en grotesque, les archives parlent
en mono.** Un lecteur doit pouvoir dire, sans lire, si une ligne est une réplique
humaine ou une donnée d'installation.

| Famille | Graisses | Rôle | Repli |
|---|---|---|---|
| **Newsreader** | 300, 300 ital., 400, 500, 600 | La voix humaine : texte de scène, épitaphe, sous-titre, manchette et corps du journal. Une serif de presse, grande hauteur d'x, dessin un peu rêche : elle tient dans le noir et elle a un accent. | Georgia, « Times New Roman », serif |
| **Archivo** | 500, 600, 700, 800 | La machine et la signalétique : FUSIBLE, libellés de jauges, réponses, verdict, boutons, chiffres du bilan. Grotesque de signalisation, un peu carrée, aucune joliesse. | « Helvetica Neue », Arial, sans-serif |
| **DM Mono** | 300, 400, 500 | Les archives : légende de tirage, année et saison, numéros de fusible, sensibilité, numéro de fin. Chasse fixe = donnée relevée par un appareil. | « SFMono-Regular », Consolas, monospace |

Ni Inter ni Space Grotesk. Aucune des trois familles de la piste rejetée
(Barlow Condensed, Manrope, Fraunces) n'est reprise : la comparaison doit se
voir dès la première ligne.

### Échelle (référence 390 × 844)

| Usage | Famille / graisse | Taille / interligne | Espacement | Casse |
|---|---|---|---|---|
| FUSIBLE (titre) | Archivo 800 | 52 / .9 | .16em | capitales, dégradé de lumière sur le mot |
| Verdict (« VIRÉ ») | Archivo 800 | 62 / 1 | .2em | capitales, halo + barre de roulement |
| Titre de fin | Newsreader 500 | 26 / 1.15 | −.01em | phrase |
| **Texte de scène** | Newsreader 400 | **19 / 28** | 0 | ferré à gauche, drapeau, 4-6 lignes |
| Épitaphe | Newsreader 300 italique | 15 / 23 | 0 | ferré à gauche |
| Sous-titre du titre | Newsreader 300 italique | 15 / 1.4 | 0 | — |
| Manchette du journal | Newsreader 600 | 21 / 1.1 | −.01em | capitales, encre sur papier |
| Nom du personnage | Archivo 600 | 12 / 1 | .2em | capitales |
| Libellé de jauge | Archivo 600 | 11 / 1 | .09em | capitales |
| Réponse (gauche / droite) | Archivo 600 | 15 / 1.2 | .005em | phrase |
| Barre d'action | Archivo 700 | 15 / 1 | .14em | capitales |
| Chiffre de bilan | Archivo 600 | 21 / 1 | 0 | chiffres tabulaires |
| Ligne de contexte (saison) | DM Mono 400 | 11 / 1 | .1em | capitales |
| Légende de tirage | DM Mono 400 | 11 / 1.4 | .06em | capitales |
| Valeur de jauge | DM Mono 500 | 12 / 1 | 0 | chiffres |
| Annotation de maquette | DM Mono 400 | 9,5 | .08em | hors jeu, non porteuse d'information |

Règle : **tout ce qui sert à jouer est ≥ 11 px**. Le texte de scène est le seul
corps long, à 19/28, et il ne dépasse jamais 6 lignes.

---

## 5. La composition des trois écrans

**Parti, en une phrase : la photographie occupe tout l'écran ; l'interface n'est
pas posée dessus, elle est l'installation électrique du lieu — un rail de quatre
fusibles en haut, une légende de tirage en bas, et le texte qui vit dans l'ombre
de l'image.**

Conséquences : aucune carte, aucun liseré, aucun coin arrondi sur l'image (rayon
0 partout sauf 2 px sur les cartouches de fusible, qui sont des objets en verre).
Rien n'est centré sauf le verdict. Marge de 22 px, grille de 11 px (elle vient de
la hauteur de la légende ; tout le reste s'y aligne).

### 5.1 TITRE
1. **Image plein cadre, 0 → 300** : un pylône de projecteurs vu d'en dessous
   depuis un parking, un seul bloc de lampes allumé, halation, le toit d'une
   tribune en silhouette. Le bas de l'image tombe dans `--nuit`.
2. **FUSIBLE**, ferré à gauche à 22 px, posé dans la partie sombre de l'image.
   La lumière du pylône traverse le mot : dégradé `--brulure` → `--tungstene`
   → `--tungstene` à 45 %. Le titre est *éclairé*, il n'est pas colorié.
3. Sous-titre en Newsreader italique : « Une carrière de football, de 1990 à 2050. »
4. Filet, puis `CHOISIR UN POINT DE DÉPART` en mono.
5. **Quatre lignes de planche-contact** : vignette 88 × 58 (une photo de nuit
   par départ) + numéro mono `01`-`04` + intitulé Archivo + ligne mono
   `ENTRAÎNEUR · D1 · 1990`. La ligne sélectionnée **reçoit la lumière** :
   arête gauche `--tungstene` de 2 px, fond levé, vignette éclaircie. Le reste
   reste éteint. Aucune coche, aucun bouton radio.
6. **TON NOM** : un libellé mono et une ligne gravée (filet 1 px `--tungstene`),
   saisie en Newsreader, curseur bloc. On écrit sur l'installation, pas dans un
   champ de formulaire.
7. **Barre pleine largeur : `METTRE SOUS TENSION`**. C'est le bouton « jouer ».
   Il dit ce que fait le jeu.

### 5.2 JEU
1. **Bande d'appareil, 0 → 80** (`--cendre`) :
   - ligne de contexte mono : `S1 · 1990 · 40 ANS · 10e · MAINTIEN` ;
   - **le rail** : quatre cartouches horizontales de 78 × 9. Chacune est un tube
     sombre où un filament se remplit depuis la gauche, avec un nœud brillant en
     tête de remplissage. Sous chaque tube : libellé Archivo 11 px + valeur mono.
     Vestiaire 50 (mi-course, `--tungstene`) · **Tribunes 80 (surcharge :
     filament `--brulure` qui déborde du tube, halo `--sodium`, libellé en
     `--sodium`, tag `SURCHARGE`)** · Président 52 · Budget 30 (bas, filament
     court et sombre).
2. **Image plein cadre, 80 → 752.** Vaubourg dans son bureau, la nuit. Une lampe
   de bureau en bas à droite, des lames de store sur le mur du fond, lui de
   trois quarts dos, un liseré de lumière sur la mâchoire et l'épaule, le reste
   perdu. Il ne regarde pas l'objectif. Le bas de l'image se fond en `--nuit`.
3. **Nom + fonction** posés dans l'ombre, à 22 px du bord gauche :
   `JEAN-MARIE VAUBOURG` (Archivo, `--brulure`) / `PRÉSIDENT` (mono, `--froid`).
4. **Texte de scène** juste dessous, Newsreader 19/28, ferré à gauche, dans le noir.
5. **Légende de tirage** : filet 1 px `--beton`, puis deux colonnes mono —
   à gauche le lieu et l'heure, à droite l'année et le support.
6. **Barre de réponses, 752 → 844** : `--cendre`, deux moitiés séparées d'un
   filet 1 px. Gauche : `←` + « Un budget, ou rien ». Droite : « Un projet, et
   le maintien » + `→`. Pendant le glissé, la moitié visée reçoit une arête
   supérieure `--tungstene` et l'autre s'éteint. Aucun rayon, aucune pilule.

### 5.3 FIN
C'est le seul écran **sans photographie** : le courant est coupé, il n'y a plus
d'image à éclairer. Une veilleuse de sécurité en haut à droite, c'est tout.
1. **Le rail, mort** : quatre cartouches éteintes, et **celle du Président
   grillée** — verre noirci, filament rompu au milieu, auréole `--sodium`.
   Ligne de contexte : `CARRIÈRE CLOSE · 1990–1992`.
2. **VIRÉ** en Archivo 800 62 px, centré (la seule chose centrée du jeu), en
   `--brulure` avec halo, traversé d'une **barre de roulement** sombre : le mot
   est une lumière qui vient de sauter, pas un tampon. Dessous, mono : `FIN 3 / 42`.
3. **Le SMS de 23h47** (Newsreader 500) puis l'épitaphe en italique.
4. **La Une, photographiée** : la page posée à plat sous la lampe, très légèrement
   de travers (−1,2°, parce qu'une page photographiée n'est jamais droite), papier
   `--papier-nuit` dégradé vers `--beton` dans l'angle qui échappe à la lampe,
   grain par-dessus, ombre portée dure. Bandeau `LE QUOTIDIEN DU BALLON`,
   filet, manchette `ÉTOILE AUBÉRIVE REGARDE PASSER L'ARGENT`, deux colonnes de
   texte suggérées et un carré photo sombre. Légende de tirage dessous.
5. **CE QUI S'EST PASSÉ** : quatre colonnes, chiffre Archivo `--tungstene` +
   libellé. 2 saisons · 1 rôle · 0 titre · 3/42 fins.
6. **Barre pleine largeur : `REMETTRE LE COURANT`**, sous-titre mono
   « nouvelle carrière ».

---

## 6. Le traitement des personnages

Quarante-deux personnes, aucune ne pose. Trois règles non négociables :

1. **Jamais de face, jamais de regard caméra.** Trois quarts, profil, ou
   dos-trois-quarts. Ils parlent à quelqu'un hors champ — c'est-à-dire à vous.
2. **La moitié du visage est perdue.** Une seule source, à 60-80° du sujet : un
   côté est modelé, l'autre tombe dans `--nuit`. L'identité tient au **liseré et
   à la silhouette**, pas au détail des traits. C'est un parti de mise en scène
   *et* une sécurité : moins de détail = moins de risque de ressemblance avec
   une personne réelle, et moins de vallée dérangeante.
3. **Ils sont occupés.** Chaque portrait a une action de plateau : ferme une
   porte, cherche ses clés, lit un papier, tient un gobelet, enfile une veste.
   Personne n'est disponible pour le joueur, ce qui est exactement le sujet.

**Les trois expressions** (sourire / neutre / noir) ne changent pas le visage,
elles changent **la distance et la lumière** : sourire = un peu plus près, la
source un peu plus douce, un quart de bouche visible ; neutre = cadre de
référence ; noir = un pas en arrière, la source plus dure et plus rasante, le
visage à moitié effacé. Trois tirages différents du même personnage, pas trois
grimaces.

**Le personnage incarné** (vous) n'a **jamais** de portrait. On ne voit jamais
votre visage : quand une carte vous concerne, on voit vos mains, votre dos, votre
sac, votre reflet dans une vitre, votre ombre sur le mur du couloir. C'est le
seul trou du casting, et il est délibéré.

---

## 7. Le temps qui passe : 1990 → 2050

Le vieillissement ne se joue pas sur les objets (pas de « rétro » décoratif) mais
sur **la lumière et le support**. Trois axes, une seule table, appliqués en code
par-dessus des plaques photographiques neutres — donc **une image sert quatre
époques**.

| Époque | Source dominante | Support | Grain / défaut | Température (`--lumiere`) | Légende de tirage |
|---|---|---|---|---|---|
| **1990-1999** | halogène, ampoule nue, tube fluo fatigué | négatif 35 mm, 1600 ASA | grain fort, halation ambrée, noirs bleutés écrasés, une rayure verticale | `--tungstene` `#F3C778` | `1990 · 24×36 · 1600 ASA · PL. 07` |
| **2000-2014** | sodium des parkings, flash embarqué | numérique compact | bruit chromatique léger, chute de flash, dominante orange-vert | `#E39A4A` | `2004 · DSC_0143 · ISO 800` |
| **2015-2029** | LED + fluo mélangés | numérique propre | grain quasi nul, netteté un peu dure | `#C9B79A` | `2021 · IMG_2210 · ISO 3200` |
| **2030-2050** | panneaux LED, écrans comme seule source | capteur sans bruit | pas de grain, **bandes de postérisation** dans les noirs | `--froid` `#8FA9BC` | `2043 · CAM3_0009 · 12800 ISO` |

Trois conséquences :
- **Le jeu refroidit sur soixante ans.** Le token `--lumiere` glisse du tungstène
  vers la LED. En 2050 le tungstène a disparu de l'écran : la dernière décennie
  est littéralement une autre lumière, sans qu'on ait redessiné une seule image.
- **La légende change de grammaire** : elle passe du numéro de planche au nom de
  fichier. C'est le détail qui date une saison sans afficher « 2043 » en gros.
- **Le grain diminue.** Le monde devient plus net et moins habité. C'est le seul
  commentaire que la direction se permet.

---

## 8. Le mouvement

Liste fermée. Tout est du courant électrique ou du geste ; rien n'est décoratif.

| Ce qui bouge | Durée / courbe | Détail |
|---|---|---|
| Respiration de la source | 6 s, `ease-in-out`, en boucle | ±3 % de luminosité sur le halo principal. On la sent, on ne la voit pas. |
| Filament en surcharge | ~2 Hz irrégulier | Un vacillement de secteur sur la cartouche en danger, jamais sur les autres. |
| La carte suit le pouce | temps réel | translation + rotation max 2,5° ; **la lumière répond** : glisser à gauche éteint la moitié droite de la barre et allume l'arête gauche. |
| Bascule de carte | 220 ms, `cubic-bezier(.2,.7,.2,1)` | la sortante part et se coupe, l'entrante arrive déjà éclairée (pas de fondu blanc). |
| Variation d'une jauge | 320 ms | le filament glisse à sa nouvelle longueur ; un dépassement de seuil ajoute un flash de 90 ms. |
| **La coupure (fin de partie)** | 90 ms de noir sec, puis 300 ms | pas de fondu : l'image se **coupe**, une barre de roulement traverse l'écran, la veilleuse s'allume. C'est le seul moment brutal du jeu. |

**Ce qui ne bouge jamais** : la photographie (aucun panoramique, aucun zoom — une
photo de plateau est immobile), la typographie, le rail, les légendes, la Une.

`prefers-reduced-motion: reduce` : plus de respiration, plus de vacillement (le
danger se lit alors au filament surexposé, au tag `SURCHARGE` et au chiffre), la
bascule tombe à 0 ms, la coupure devient un changement d'état instantané.

---

## 9. Ce que cette direction rend difficile

Sans détour :

1. **1 241 scènes, on ne fera jamais 1 241 photographies.** Il faut un système :
   une carte affiche **soit un portrait, soit une plaque de lieu**, jamais un
   montage des deux (composer un visage photoréaliste sur un fond photoréaliste
   ne tient pas la route à l'écran). Environ 60 % des cartes tournent sur ~84
   plaques de lieux réutilisées, choisies par (lieu, source de lumière) ; 40 %
   montrent un portrait. Le rythme du jeu doit accepter de revoir un couloir.
   **Mitigation retenue** : le grain, la halation et la température sont des
   couches de code, pas des pixels cuits — une même plaque ne se ressemble pas
   d'une décennie à l'autre.
2. **La cohérence de 42 visages générés est le vrai risque du projet.** Sans
   méthode, on obtient 42 styles. La méthode est en §10.4 et elle coûte du temps
   de tri : compter 5 à 6 tirages gardés pour 1.
3. **Le photoréalisme de visages frôle deux murs** : la ressemblance involontaire
   avec une personne réelle, et la vallée dérangeante. La parade est esthétique
   (§6 : jamais de face, moitié de visage perdue) et elle doit être tenue sans
   exception — la première image « bien éclairée de face » fait tomber tout le
   système.
4. **Du texte sur photo, c'est une bagarre permanente.** Elle est gagnée par la
   contrainte de génération (tiers inférieur gauche noir) et perdue si un seul
   prompt l'oublie. Prévoir une passe de contrôle automatique : refuser toute
   image dont la luminance moyenne dans la zone de texte dépasse un seuil.
5. **Écran sombre + soleil dehors.** Un jeu mobile se joue dans le bus. Les
   bandes d'appareil sont opaques (jamais de texte d'interface sur l'image), le
   corps est à 19 px, et il faut prévoir un réglage « lisibilité » qui remonte
   l'opacité du voile sous le texte — pas un thème clair, un voile.
6. **Le photoréalisme nocturne glisse vers la série policière et tue le comique.**
   C'est le danger le plus sérieux pour un jeu dont le ton est sec et drôle. La
   parade : **les sujets sont médiocres** — un photocopieur, un distributeur, une
   chaise en plastique, un survêtement sur un cintre — et le rire est dans le
   texte et dans la légende, jamais dans l'image. Aucune image ne doit être
   « belle » toute seule.
7. **Le poids.** 257 images en 1080 × 1920 : compter 22-28 Mo en WebP q80. Il faut
   un chargement par époque et par lot, et des placeholders noirs (ce qui, ici,
   ne se voit pas).
8. **L'accessibilité du contraste** est en tension permanente avec le clair-obscur.
   Le compromis tenu : le texte n'est jamais sur la lumière, et le voile
   dégradé sous le bloc de texte est un élément d'interface obligatoire, pas une
   option de l'image.

---

## 10. Les images à générer

### 10.1 Inventaire

| Famille | Nombre | Taille source | Format livré |
|---|---|---|---|
| **Portraits de personnages** — 42 personnages × 3 tirages (sourire / neutre / noir) | **126** | 1080 × 1920 (9:16) | WebP q80 |
| **Le personnage incarné** — dos, mains, sac, reflet, ombre (2 rôles × 2 genres × 4 âges) | **16** | 1080 × 1920 | WebP q80 |
| **Plaques de lieux** — couloirs (12), vestiaires (8), bureaux (8), soins/chaufferie/matériel (10), presse/télé (8), transports (10), extérieurs de nuit (16), tribunes vides (12) | **84** | 1080 × 1920 | WebP q80 |
| **Vignettes de départ** (4 postulats) | **4** | 960 × 640 (3:2) | WebP q85 |
| **Plaques de fin** (une par famille de fin : viré, retraite, promotion, disparition…) | **12** | 1080 × 1920 | WebP q80 |
| **Pages de journal photographiées** (2 journaux × 3 époques) | **6** | 1080 × 1440 (3:4) | WebP q85 |
| **Textures d'époque** — grain ×4, halation ×3, poussière/rayures ×2 | **9** | 1024 × 1024 tuilable | PNG-8 + alpha |
| **Total** | **257** | | ≈ 22-28 Mo |

Toutes les plaques sont générées **neutres** (pas de grain, pas de dominante) :
le grain, la halation et la température sont appliqués en code par époque.

### 10.2 La phrase-socle (identique dans TOUS les prompts, au mot près)

> `documentary still photograph, one single practical light source, no fill light, deep unlit shadows, nobody looks at the camera, 35mm lens, eye level slightly off axis, muted desaturated colour, the lower left third of the frame falls into pure shadow with nothing in it, plain unbranded clothing, no logos, no lettering, no numbers, anonymous generic stadium building`

Puis **une clause d'époque** (§7), puis **le seul créneau variable** : le sujet.
Rien d'autre ne change jamais. Un adjectif ajouté hors vocabulaire (§10.4) est
un bug, pas une intention.

### 10.3 Les prompts par famille

Les paramètres Midjourney utilisés partout : `--ar` · `--style raw` · `--s` ·
`--chaos` · `--sref` · `--sw` · `--seed` · `--no`.
Pour Gemini : même texte en phrases pleines, **image de référence attachée**, et
les interdits reformulés en phrases (Gemini ignore les négations en liste).

---

#### A. Portraits de personnages

**Midjourney**
```
documentary still photograph, one single practical light source, no fill light, deep unlit shadows,
nobody looks at the camera, 35mm lens, eye level slightly off axis, muted desaturated colour,
the lower left third of the frame falls into pure shadow with nothing in it, plain unbranded clothing,
no logos, no lettering, no numbers, anonymous generic stadium building,
shot on 35mm colour negative film, 1600 ASA, tungsten halogen lamp, warm amber halation, visible grain, crushed blue-black shadows,
close three quarter portrait of a man in his late fifties, olive complexion, receding grey hair, clean shaven, dark suit jacket open over a plain shirt,
standing in an unlit office at night, head turned away from the lens, one side of the face rim lit by a desk lamp out of frame, the other side lost in black,
he is putting his coat on and looking at something off camera, closed unreadable expression
--ar 9:16 --style raw --s 120 --chaos 4 --sref <URL de la planche mère> --sw 70 --seed 771204
--no logo, text, watermark, jersey number, crowd, celebration, daylight, sunshine, green pitch, trophy, smile at camera, studio backdrop, symmetrical lighting
```

**Gemini**
```
Génère une photographie documentaire verticale (9:16), prise sur le vif, pas une pose.
Reprends EXACTEMENT l'éclairage, l'objectif, la pellicule, la colorimétrie et le grain de l'image
de référence jointe ; ne change que la personne décrite ci-dessous.
Une seule source de lumière pratique, aucune lumière d'appoint, les ombres restent complètement noires.
Le tiers inférieur gauche du cadre doit être vide et totalement dans le noir.
Sujet : un homme d'une petite soixantaine, teint olive, cheveux gris dégarnis, rasé de près,
veste de costume sombre ouverte sur une chemise unie. Il est dans un bureau non éclairé, la nuit.
Il tourne la tête loin de l'objectif ; un côté du visage est ourlé par la lumière d'une lampe de
bureau hors champ, l'autre disparaît dans le noir. Il enfile son manteau et regarde hors cadre.
Expression fermée, illisible.
Interdits : aucun logo, aucun texte, aucun chiffre, aucun maillot identifiable, aucune foule,
aucune célébration, aucune lumière du jour, aucune pelouse verte, aucun trophée, aucun sourire
vers l'objectif, aucun fond de studio, aucun éclairage symétrique.
```

---

#### B. Plaques de lieux

**Midjourney**
```
<phrase-socle> , <clause d'époque> ,
empty service corridor under a stadium at night, painted concrete walls, one fluorescent tube working
and the next one dead, a fire door, a vending machine glowing faintly at the far end, wet floor,
nobody in the frame, the corridor recedes into total darkness on the left
--ar 9:16 --style raw --s 90 --chaos 2 --sref <URL de la planche mère> --sw 60 --seed 771204
--no logo, text, watermark, people, crowd, daylight, green pitch, trophy, neon signage, cinematic lens flare
```
Le créneau variable prend les 84 lieux (§10.1). Deux règles de rédaction :
toujours nommer **la source** (« one fluorescent tube », « a sodium lamp on a
pole », « a phone screen ») et toujours nommer **ce qui reste dans le noir**.

**Gemini** : même texte en phrases pleines, avec « aucune personne dans le cadre »
et « le côté gauche du couloir doit rester complètement noir » explicités.

---

#### C. Vignettes de départ (planche-contact du titre)

**Midjourney**
```
<phrase-socle> , 1990s clause ,
wide establishing frame, a floodlight pylon seen from below from an empty car park at night,
one bank of lamps lit, strong halation around the lamps, the roof of an empty stand in silhouette,
a parked coach, nobody in the frame
--ar 3:2 --style raw --s 90 --chaos 2 --sref <URL> --sw 60 --seed 771204 --no <liste standard>
```

---

#### D. Plaques de fin (courant coupé)

**Midjourney**
```
<phrase-socle> ,
a stadium electrical cupboard in a back room, the door open, rows of ceramic fuses, one of them blackened
and burst, the only light is a small green-free emergency lamp above the door, everything else in total darkness,
dust in the air, nobody in the frame
--ar 9:16 --style raw --s 100 --chaos 3 --sref <URL> --sw 60 --seed 771204 --no <liste standard>
```

---

#### E. Page de journal photographiée

**Midjourney**
```
<phrase-socle> ,
a newspaper page lying flat on a wooden desk, photographed straight down, lit by one desk lamp from the
upper left so the opposite corner falls into shadow, cheap yellowed newsprint, the printed text is an
illegible grey texture, one dark halftone photograph on the page, slight paper curl, dust
--ar 3:4 --style raw --s 90 --chaos 2 --sref <URL> --sw 50 --seed 771204
--no readable text, headline, letters, words, logo, watermark, colour photography, glossy magazine paper
```
La manchette et le texte sont **composés en Newsreader par-dessus** : l'image ne
fournit que le papier, la lumière et le grain. C'est la seule façon d'avoir un
titre juste, lisible et localisable.

---

#### F. Textures d'époque
Générées séparément, en niveaux de gris, sur fond neutre : `fine grain texture,
scanned 35mm film base, tileable, grey, no image content --ar 1:1 --tile`. Puis
détourées en alpha et appliquées en `overlay` / `soft-light` par le moteur.

### 10.4 Comment 42 portraits restent une même famille

1. **La planche mère d'abord.** On génère un seul portrait, longuement, jusqu'à
   ce que la lumière, l'objectif et la pellicule soient exactement justes. Il
   devient la référence de style de tout le projet (`--sref`, et l'image jointe
   côté Gemini). Aucun autre portrait n'est lancé avant qu'elle soit validée.
2. **Une phrase-socle immuable.** Copiée-collée, jamais reformulée. Toute
   variation d'écriture est une variation de style.
3. **Trois créneaux variables, dans cet ordre, toujours** :
   `<personne> , <lieu et source> , <action et expression>`. Rien avant, rien
   après, rien entre.
4. **Un vocabulaire fermé.** Les seuls mots autorisés dans le créneau `personne` :
   - teint : `porcelain` · `fair` · `golden` · `olive` · `brown` · `deep brown`
   - âge : `late twenties` · `late thirties` · `late forties` · `late fifties` · `late sixties`
   - cheveux : `shaved` · `receding` · `cropped` · `swept back` · `curly` · `tied back` · `long`
   - couleur : `black` · `dark brown` · `chestnut` · `red` · `blond` · `grey` · `white`
   - pilosité : `clean shaven` · `moustache` · `full beard` · `goatee`
   - tenue : `dark suit jacket` · `plain tracksuit top` · `plain training jacket` · `knitted jumper` · `padded coat` · `work blouse` · `plain shirt`
   Jamais de nationalité, jamais de nom propre, jamais d'adjectif de beauté.
   Le même personnage se décrit avec **exactement la même chaîne** dans ses trois tirages.
5. **Une graine fixe par lot.** `--seed 771204` pour toute la campagne ; on ne
   la change que si le lot entier est refait. Un re-tirage garde ainsi la famille.
6. **`--sw 70` pour les portraits, `--sw 60` pour les lieux.** Au-dessus, la
   référence mange le sujet ; en dessous, la famille se disloque.
7. **Pool de références plafonné à trois.** Quand un portrait est validé, il peut
   rejoindre le pool ; on ne dépasse jamais trois images de référence, sinon le
   style dérive vers leur moyenne.
8. **Tri : 6 tirages, 1 gardé.** Le critère de rejet n'est pas « c'est moche »,
   c'est : deux sources de lumière · un regard caméra · le tiers inférieur gauche
   éclairé · un vêtement marqué · un visage entièrement modelé.
9. **L'égalisation finale se fait en code.** Le grain, la halation, la
   température et le voile de texte sont des couches uniformes appliquées par le
   moteur : elles écrasent les écarts résiduels entre images. C'est ce qui rend
   la campagne réalisable — on ne cherche pas 257 images identiques, on cherche
   257 images que la même couche peut réunir.
10. **Aucun nom réel** de club, de personne, de marque ou de compétition dans un
    prompt, jamais — ni en anglais, ni en français, ni « in the style of ».
