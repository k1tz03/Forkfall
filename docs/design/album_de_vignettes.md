# Fusible — fiche de design « L'album de vignettes » (maquette finale)

Maquette : `design_mockup.html` (page unique, trois écrans dans des cadres de téléphone 400 × 860, tout inline, polices Google seulement, `prefers-reduced-motion` respecté).
Direction retenue par le client (brainstorm §6.1) : **une seule métaphore, l'album de vignettes autocollantes ; un seul monde visuel, le papier.** Le cadre du rôle (tableau tactique pour l'entraîneur) est un support qui *tient* la vignette ; il ne raconte pas. Le papier découpé (scotch, punaises, coupures) reste un habillage : table du titre, Une, écran de fin — jamais l'écran de jeu.

---

## 1. Tokens de couleur (variables sur `:root`, thème unique peint explicitement)

| Variable | Hex | Rôle |
|---|---|---|
| `--pelouse` | `#1F5A32` | **Marque.** Couverture de l'album, pochettes, écusson, survêtement du coach |
| `--pelouse-2` | `#123D22` | Pelouse profonde : dos de couverture, ombres, fond des libellés sur crème |
| `--creme` | `#EFE4C6` | **Marque.** Papier crème : pages de l'album, stickers, texte sur le tableau, magnet gauche |
| `--creme-2` | `#E3D5AE` | Crème ombrée (tranche des pages) |
| `--tampon` | `#C8262C` | **Marque.** Tampon VIRÉ, aimant qui tient la vignette, ficelle de promesse, hachures/anneau de danger, badge droit, Successeur |
| `--tampon-2` | `#8C161B` | Tampon profond (ombre portée du bouton Successeur) |
| `--camp-terrain` | `#2F7A44` | Fond de vignette : personnages du terrain ; pochettes « joueur » |
| `--camp-direction` | `#6E1F2F` | Fond de vignette : direction (Aulard) — bordeaux |
| `--camp-instances` | `#4C5E72` | Fond de vignette : instances — bleu ardoise |
| `--camp-selection` | `#1F5FB4` | Fond de vignette : sélection — bleu studio 80 |
| `--ui-bleu` | `#2E6DB4` | Jauge Vestiaire (disque) ; punaise bleue |
| `--ui-orange` | `#E07A17` | Jauge Tribunes ; magnet de réponse droit ; pastille d'aperçu d'effet ; focus |
| `--ui-violet` | `#7A4DAF` | Jauge Direction |
| `--ui-jaunevert` | `#9DBE2A` | Jauge Caisse ; objectif dans la ligne de contexte |
| `--ui-rose` | `#D6538B` | Réserve (5ᵉ jauge Camille, La Gazette Rose) |
| `--ui-ardoise` | `#5A6D7E` | Badge de swipe gauche ; registre instances |
| `--board` / `--board-2` | `#16382A` / `#0F2A1F` | Tableau tactique (cadre entraîneur), fond des pochettes « entraîneur » |
| `--bois` / `--bois-2` / `--bois-3` | `#7A4E2A` / `#5A371C` / `#A47444` | Table de vestiaire, cadre bois du tableau, chant de table |
| `--mur` | `#2A2E2A` | Lambris du vestiaire |
| `--alu` | `#C9CBC4` | Liseré aluminium intérieur du tableau, crochets, sifflet |
| `--blanc-vignette` | `#FCFAF3` | Bord blanc des vignettes, stickers, bande NOM · FONCTION |
| `--journal` | `#FBFAF4` | Papier de la Une et des coupures |
| `--journal-bleu` | `#1C4C9A` | Titre du Quotidien du Ballon, filets, têtes d'encart, lettrine, prix |
| `--encre` / `--encre-2` / `--encre-3` | `#1E1A14` / `#4A423A` / `#8A8072` | Encre : texte, contours 1,5-2 px, anneaux ; encre douce ; encre grise |
| `--or` | `#D9B85A` | Étiquette dorée de la couverture ; tampon des fins dorées (`.stamp.gold`) |
| `--craie` | `rgba(239,228,198,.55)` | Tracés à la craie (lignes de terrain, cases pointillées) |
| `--scotch` | `rgba(255,236,150,.55)` | Ruban adhésif (coins de la Une, sticker CTA, dernière apparition) |

Contrastes vérifiés : texte encre sur crème/orange/blanc ≥ 7:1 ; crème sur tableau 9:1 ; blanc sur tampon 5,4:1 ; les jauges se lisent par forme + pictogramme + hachures + anneau, jamais par la couleur seule.

Textures (SVG inline en data-URI, aucune image) : `--grain` (feTurbulence .9, alpha .32 ; posé en `soft-light` 35 % sur les photos, en `overlay` sur le tableau, en `multiply` sur la table), `--wood` (feTurbulence anisotrope .012/.35 pour le fil du bois), `--grunge` (feTurbulence .65, matrice alpha −3,2/2,5 ; masque des tampons et de `#kindTag`).

---

## 2. Échelle typographique

Familles (un seul `<link>` Google Fonts, piles de repli déclarées) :
- **Barlow Condensed** 600 / 700 / 800 — `--font-cond` : manchettes, tampons, bandes NOM · FONCTION, libellés de swipe, boutons, étiquettes de jauge, statut, craie. Repli : Roboto Condensed, Arial Narrow, Impact.
- **Manrope** 500 / 600 / 700 / 800 — `--font-ui` : texte de carte, contexte, sous-titres, oreilles de la Une. Repli : Segoe UI, Roboto, Helvetica, Arial.
- **Fraunces** 600 / 700 / 900 + italique 500 (opsz 9-144) — `--font-paper` : masthead, lede, accroches des postulats, n° de vignette, réponse précédente, colonnes de la Une. Repli : Playfair Display, Georgia, Times.

| Usage | Famille / graisse | Taille / interligne | Espacement | Casse |
|---|---|---|---|---|
| Titre en relief (couverture) | Barlow 800 | 42 / .9 | 0 | capitales, 4 text-shadows (relief) |
| Tampon (`#banner`) | Barlow 800 | 52 / 1 | .08em | capitales, double bordure 5 px, masque grunge |
| Manchette (`#etitle`) | Barlow 800 | 34 / .95 | .005em | capitales, `text-wrap: balance` |
| Masthead (`.masthead h1`) | Fraunces 900 opsz 144 | 22 / 1 | −.01em | — |
| Nom du personnage (`#speaker`) | Barlow 800 | 16 / 1 | .06em | capitales, 1 ligne, ellipse |
| Fonction (`#speakerLabel`) | Barlow 600 | 10,5 / 1 | .2em | capitales, encre douce |
| Bouton Successeur / CTA sticker | Barlow 800 | 22 / 1 | .06-.08em | capitales |
| Titre de pochette (postulat) | Barlow 800 | 18 / 1 | .01em | — |
| Boutons-magnets | Barlow 700 | 14 / 1.05 | .03em | capitales |
| Badges de swipe | Barlow 800 | 14 / 1.05 | .04em | capitales |
| Statut, étiquettes de jauge, ruban, hintline | Barlow 600-700 | 11-13 / 1 | .06-.16em | capitales |
| **Texte de carte (`#cardText`)** | Manrope 500 | **16 / 24** | .0 | centré, `text-wrap: pretty`, 4-6 lignes |
| Ligne de contexte | Manrope 600 | 12 / 1.4 | .02em | tabular-nums |
| Lede (`#epitaph`) | Fraunces italique 500 | 12 / 1.35 | 0 | — |
| Réponse précédente (`#answer`) | Fraunces italique | 12 / 1.4 | 0 | crème à 70 % |
| Accroche de postulat | Fraunces italique | 11 / 1.25 | 0 | 2 lignes max |
| N° de vignette | Fraunces 600 | 11 (8 en petit) | 0 | « n° 217 » |
| Presse décorative (colonnes, oreilles, dateline, légendes) | Fraunces / Manrope | 7,5-9,5 | .03-.1em | jamais porteur d'information de jeu |

Règle : tout ce qui se lit pour jouer est ≥ 11 px ; le texte de carte est le seul corps long et il est à 16/24 hors de la vignette.

---

## 3. Grille, marges, rayons

- Grille de **8 pt** ; marges d'écran **20** (jeu : cadre bois 7 + padding 13 ; titre : 20).
- Écran de jeu, de haut en bas (référence 390 × 844) : statut 44 · rail 64 + 4 + étiquette 14 · contexte 18 · ruban 18 · zone de vignette 342 (vignette 222 × 329 + aimant 12) · texte 72-96 · réponse 18 · magnets 56 · hintline 14. Rien d'interactif au-dessus de la moitié de l'écran ; les magnets sont dans la zone du pouce.
- Rayons : **16** sur les boutons UI (magnets de réponse) ; **2-6** sur les objets papier (vignette 2, sticker 3/6/3/5, tampon 6) : le papier a des coins presque vifs ; les cases d'album sont carrées à pointillés.
- Objets penchés : album −3°, pochette +8°, stickers ±0,5-2°, Une −1°, tampon −6°, badges ±6°, dernière apparition +7°.

---

## 4. Composants

### 4.1 La vignette (`#card`)
- Largeur **222 px**, aimant rouge 26 px au-dessus (`.pin`, `top:-12px`) ; l'ensemble est ce que le drag transforme.
- `.sticker` : bord blanc **7 / 8 / 6 / 7 px** (irrégulier), `clip-path` polygonal (`--cut`) qui rend les bords légèrement gauches **et** coupe le coin supérieur droit sur `--peel` = 30 px.
- `.photo` : 3:4, dégradé du camp (`data-camp`) vers 78 % de sa valeur, grain soft-light 35 %, rayon 2.
- `.peel` : coin décollé en deux couches dans le carré `--peel` — ombre floutée 3 px (`::before`) + rabat blanc → gris (`::after`, dégradé 225°). Le fond réel (tableau, lignes de craie) apparaît dans le triangle coupé : l'illusion tient quelle que soit la rotation.
- `.shadow > i` : ombre portée découpée à la même forme, floutée 8 px, décalée 3/12 (pas de `filter` sur l'élément glissé lui-même).
- Portrait : `<symbol>` SVG en aplats, contour 2 px, ≤ 2 ombres ; expressions commutées par `--exp-sourire / --exp-neutre / --exp-noir` posées sur le `<svg id="portrait">`.
- `#sablier` : pastille crème 26 px, coin sup. gauche ; `#kindTag` : petit tampon grungé rouge (12 px, +6°), coin sup. droit sous le rabat ; `#cardNumber` : Fraunces 11 px sur voile noir 35 %, coin inf. droit.
- Bande (`.band`) : 36 px, NOM 16/800 sur une ligne (ellipse) + FONCTION 10,5/600 .2em.
- Badges de swipe (`#badgeLeft/#badgeRight`) : stickers crème à bordure 2,5 px (ardoise à gauche, rouge à droite), posés à **54 px du bas** de la vignette (sur le buste, jamais sur le visage), ±6°, opacité = progression du drag (0 → 1 à 30 % de la largeur).
- Carte fatale (`#fatalCard .card`) : même composant à 136 px (`--peel` 20, bande 26, NOM 10,5).

### 4.2 Jauges (`#rail`) = 4 cases d'album à remplir
- Case **64 × 64** à pointillés craie 1,5 px, numéro « 1-4 » en Fraunces 10 px dans le coin ; sticker blanc 56 × 56 collé penché (`--tilt` ±0,5-2°).
- Disque **48 px** : remplissage vertical `linear-gradient(to top, teinte UI var(--v), #E6DEC7)`, anneau encre 1,5 px, pictogramme SVG 28 px (crampon / écharpe / fauteuil / billets) en encre.
- Danger (< 20 ou > 80) : hachures rouges 45° (2 px / 8 px, α .55) qui respirent 1,2 s + anneau rouge 2 px autour du sticker ; le pictogramme reste lisible.
- Aperçu d'effet pendant le drag : pastille orange en haut à droite du sticker, **10 px** (magnitude 1) ou **14 px** (magnitude 2).
- Étiquette Barlow 600 11 px .1em sous la case.
- Fin de run (`#deadRail`) : 4 mini-stickers 29 px éteints (brightness .45, saturate .3) ; la coupable garde sa couleur, barrée d'un trait rouge 3 px à −30° et clignote 1,2 s.

### 4.3 Boutons
- **Magnet de réponse** (`.magnet`) : 56 px min, rayon 16, pastille métal 24 px ; gauche crème / encre, droite orange / encre (texte foncé, pas blanc) ; ombre 3 px + portée. Un seul `.magnet.right` pour les cartes à sortie unique.
- **Sticker CTA** (`#btnNewAlbum`) : blanc vignette, pastille rouge 18 px, −1,5°, ruban adhésif au coin, sous-libellé Manrope 10 px.
- **Successeur** (`#btnNew`) : sticker rouge tampon à bord blanc 4 px, 54 px min, trois cartes face cachée (13 × 18) en éventail, « — nouvel album » en Manrope 12.
- **Pochette de postulat** (`.postulat`) : 122 px, dentelure 7 px (clip-path), bande de colle striée sous le rabat, fond par rôle (entraîneur = tableau + ligne médiane + rond central à la craie ; joueur = pelouse rayée) ; contenu n° (Fraunces 11), titre (Barlow 18), rôle · division · année (Manrope 10,5 capitales), accroche (Fraunces italique 11, 2 lignes).
- **Rejouer** (`#btnReplay`) : lien-texte Barlow 12 souligné, crème 75 %.

### 4.4 Tampon (`#banner`)
- Barlow 800 52 px, .08em, rouge tampon, **double bordure 5 px**, rayon 6, padding 0 12 2 ; masque `--grunge` ; centré à 60 % de la hauteur de la carte fatale, −6°.
- Variante `.gold` (fins dorées) : or sur or.

### 4.5 La Une (`.une`, « Le Quotidien du Ballon »)
- Papier `--journal`, −1°, scotch aux deux coins supérieurs, scanlines 1990 à 5 %, ombre portée 24 px ; padding 8 / 12 / 10.
- Masthead : grille 60 / 1fr / 54 — oreille Météo (« Averses sur la Marmite · 11° »), titre Fraunces 900 22 px bleu + devise 7,5 px, oreille Prix « 5 écus » (Barlow 800 16 bleu) ; filet bleu 2,5 px.
- Dateline : Manrope 700 8 px capitales, « Lundi 4 mai 1992 · 46ᵉ année · n° 14 212 · Édition Sud », filet encre 1 px.
- Manchette `#etitle` 34 px ; lede `#epitaph` Fraunces italique 12.
- Corps : grille 100 / 1fr — photo = la carte fatale en N&B tramé (`grayscale contrast 1.25` + trame radiale 3 px en multiply, cadre encre 1 px) + légende italique 8 px « (Photo La Plume) » ; colonne droite = encarts « En chiffres » (`#score`, 2 × 2, Barlow 800 18) et « La jauge coupable » (`#guilty`, pictogramme barré dans un cercle 28 px + phrase).
- Colonnes : 2 colonnes Fraunces 8 px justifiées, lettrine bleue, marge droite 62 px pour la vignette « dernière apparition » ; c'est la partie souple (`flex:1; overflow:hidden`) : si le contenu déborde, ce sont elles qui se coupent, jamais les actions.
- `#lastSticker` : ta vignette « dernière apparition » (buste coach, expression noire) 62 px, scotchée, +7°, coin inférieur droit de la Une.

### 4.6 Écran titre
- Mur lambris 116 px avec barre à crochets, écharpe rayée vert/crème, sifflet à cordon rouge, maillot n° 9 ; chant de table bois 10 px + ombre.
- Table 280 px : album 186 × 240 (−3°, couverture verte gaufrée, tranche, « Édition 1990 → 2050 », FUSIBLE en relief, sous-titre Fraunces italique, vignette n° 001 collée, étiquette dorée « Album officiel · 512 vignettes ») qui s'ouvre en rotateY (400 ms) sur la page 1 à 6 cases ; coupure du Quotidien punaisée ; pochette 104 × 136 verte dentelée avec bande crème « 5 vignettes » et deux vignettes qui dépassent.
- Sous la table : sticker « Nouvel album » (dégagé de l'album), « Déchire une pochette » + 4 pochettes réelles (postulats.yaml n° 01-04, 1990), Cimetière = plaque de casier (vis aux deux bouts, chiffre orange).

---

## 5. Motion (liste fermée)

| Tween | Durée | Courbe / détail | Variable |
|---|---|---|---|
| Tampon qui s'abat | **400 ms** | scale 1,6 → 0,96 → 1, rotation −6°, opacité 0 → 1 (55 %) | `--t-stamp` |
| Secousse de la carte fatale à l'impact | 80 ms | ±2 px, 1 fois, 220 ms après l'arrivée ; rejouable au tap | — |
| Une qui se déplie | 400 ms, délai 500 ms | rotateX −70° → 0, ease-out | `--t-page` |
| Couverture de l'album | 400 ms | rotateY 0 → −150°, cubic-bezier(.3,.7,.2,1) | `--t-page` |
| Pochette qui se déchire | **600 ms** | rabat −22° / translate(−30, −60) / opacité 0 | `--t-pack` |
| Texte de carte | 120 ms | fondu d'opacité, **jamais lettre par lettre** | `--t-text` |
| Pop d'arrivée de la vignette | 200 ms | scale .95 → 1 | `--t-pop` |
| Retour élastique après drag | 250 ms | cubic-bezier(.2,.8,.3,1.2) | `--t-back` |
| Départ de la vignette validée | 200 ms | translateX ±1,6 largeur, rotation ±12° | — |
| Jauge en zone rouge | 1,2 s | respiration d'opacité des hachures (.45 ↔ 1) | `--t-pulse` |
| Jauge coupable (fin) | 1,2 s | clignotement par paliers (steps 2) | `--t-pulse` |
| Micro-transitions (survol, pastille d'aperçu) | 120 ms | ease | `--t-text` |

Physique du swipe : la vignette suit le pointeur, rotation = progression × 12° (max), badges révélés proportionnellement à partir de 8 px, aperçu d'effet sur les jauges à partir de 12 px, validation à **30 %** de la largeur, sinon retour élastique.
`prefers-reduced-motion: reduce` : toutes les animations et transitions sont coupées ; tampon, Une, hachures et coupable restent visibles dans leur état final ; le drag ne translate ni ne tourne.

---

## 6. Mapping vers l'aperçu jouable (`preview_template.html`)

Ids conservés à l'identique : `#titleScreen #postulats #cimetiere · #gameScreen #rail #context #card #speaker #cardText #badgeLeft #badgeRight #answer #controls #hintline · #endingScreen #banner #etitle #guilty #epitaph #score #btnNew #btnReplay #seedline`.

| Donnée du moteur (par carte / vue) | Élément | Branchement |
|---|---|---|
| `speakerName` | `#speaker` | NOM dans la bande (1 ligne, ellipse) |
| `speakerLabel` | `#speakerLabel` (nouveau) | FONCTION ; ou « NOM · FONCTION » entier dans `#speaker` et `#speakerLabel` vidé |
| `text` | `#cardText` | bloc fixe **hors de `#card`**, ne tourne pas ; fondu 120 ms au changement |
| `tic` | — | non affiché à part (déjà dans le texte) |
| `camp` | `#card[data-camp]` | `terrain \| direction \| instances \| selection` → `--camp` |
| `expression` | `#portrait[data-expression]` | poser `--exp-sourire / --exp-neutre / --exp-noir` (`inline` / `none`) sur le `<svg>` ; à remplacer par le paper doll |
| `kind` | `#card[data-kind]`, `#kindTag` | `alarme` → tremblement 80 ms + « Alarme » ; `nouvelle` → fond journal + « Nouvelle » ; `palier` → « Face à face » ; `passe` → « Nouvelles du passé » ; sinon `#kindTag[hidden]` |
| `tone` | `#card[data-tone]` | libre (aucun style pour l'instant) |
| `sablier` | `#sablier` | `hidden` si `false` |
| id de carte | `#cardNumber` | « n° {id} » |
| `leftLabel` / `rightLabel` / `single` | `#badgeLeft` `#badgeRight` `#controls` | deux `.magnet.left/.right` ou un seul `.magnet.right` (OK) ; badge gauche vide si `single` |
| `previewLeft/Right [{g, m}]` | `.gauge .hint` | `renderRail(dir)` : `--hs` 10 px (m = 1) / 14 px (m = 2), classe `.show` |
| `gauges [{id,label,value}]` | `#rail` | `renderRail` recrée les 4 cases ; `.danger` si ≤ 20 ou ≥ 80 |
| `season year age rank objective` | `#context` | mêmes spans + `.obj` |
| promesse active (créancier, échéance) | `#ruban` (nouveau) | « Promis à {créancier} : {promesse} » ; `hidden` sans promesse |
| `lastAnswer` | `#answer` | Fraunces italique |
| `ending.title / epitaph` | `#etitle / #epitaph` | manchette / lede |
| `ending.gauge / side` | `#guilty` + `#deadRail .mini.guilty` (nouveau) | pictogramme barré + phrase ; mini-sticker coupable non éteint |
| `stats` | `#score` | 4 `.cell` (`.n` / `.l`) dans l'encart « En chiffres » |
| type de fin | `#banner` | texte du tampon : VIRÉ / BLESSÉ / EN GARDE À VUE / RETRAITÉ / MORT DE RIRE ; `.gold` pour les fins dorées |
| carte fatale | `#fatalCard .card` + `#unePhoto` | même vignette en couleur (tampon dessus) puis tramée N&B dans la Une |
| toi | `#lastSticker` | vignette « dernière apparition » (buste coach, expression selon la fin) |
| `#btnNew #btnReplay #seedline` | inchangés | Successeur (3 cartes face cachée), rejouer, graine |
| `#btnNewAlbum` (nouveau) | écran titre | ouvre la couverture ; la pochette cliquée (`.postulat[data-index]`) démarre le run après 600 ms |

Écarts structurels par rapport à l'aperçu : `#card` ne contient plus le texte ; `#speaker` n'est plus un chip mais la bande ; `#banner` est le tampon posé sur `#fatalCard` et non un bandeau ; `#guilty` et `#score` vivent dans la Une ; les jauges ne sont plus des fioles mais des cases d'album (même signature `renderRail(gauges, dir)`).
