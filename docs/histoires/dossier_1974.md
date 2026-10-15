# Le dossier 1974

> « La finale de 1974 et son cinquième visage, gratté au couteau jusqu'au carton, traversent déjà
> neuf livres sur dix. Ce fil devient un dossier qui se garde d'une carrière à l'autre. » (le porteur)

Le contenu : `content/ville/dossier_1974.yaml` (les pièces, le tiroir, les scènes, les
conversations, les trois scènes jouées). Le système : `packages/tools/web/preview_dossier.js`
(la page : le dossier gardé, l'accueil, les panneaux, l'écran de fin, l'épilogue) et
`packages/tools/web/ville_dossier.js` (la ville : ce qu'on trouve en marchant, l'onglet du
carnet). Les carrières passées qui reviennent dans les livres suivants ont leur propre document :
`docs/histoires/fantomes.md`.

## 1. La vérité de 1974

Ce que les livres disent déjà, et que le dossier ne contredit jamais :

- **La finale** (mai 1974) : le Racing la perd trois buts à zéro. Le trésorier, Jean-Marie
  Vaubourg, l'a vendue avec les bookmakers du Quai pour éponger une dette ; Gigi Vecchio, le
  gardien, a laissé passer les trois ; Henri Ravenel, numéro 5 et capitaine, a pris l'enveloppe
  pour payer le traitement de sa femme. La Fédération trouve quarante mille francs dans son
  casier ; Vaubourg devient président en 1977 et garde la confession signée d'Henri dans son
  coffre. En mars 1975, on sort Henri de la Rive, sous la passerelle. *C'est le secret de « Trois
  mille visages » : seul ce livre le révèle.*
- **La photo de l'escalier** : la photo de l'équipe de 1974, au clou de l'escalier du club-house,
  le cinquième visage gratté au couteau jusqu'au carton. Josiane la décroche dans les années
  1990 et la garde (« Les Deux Téléphones » : la photo revient en 2037, sur ses genoux).
- **Gégé** (quarante-sept ans en 1990, capo de la Nord) : son père a fait le tifo de 1971 et la
  bâche ; la plaque sans nom du caveau, posée en 1989, « payée en liquide par un homme en
  écharpe », c'est lui (« Mon père, en 89, avant de mourir. Moi, j'ai payé. ») ; il pose du buis
  devant elle aux Rameaux ; en 1990, le kop imprime trois mille masques du visage du capitaine ;
  en 2040, il meurt une nuit de février, Nino à côté (« Il faut imprimer »). En 2037, il monte
  l'escalier « marche par marche ».

Ce que le dossier ajoute, sans rien retirer : **le cinquième visage, c'est Gégé qui l'a gratté.**
Le 29 juin 1974, le soir où la Fédération a parlé, un homme de la Nord de trente et un ans, qui
croyait tout ce qui était imprimé, a bu au bar de l'hôtel de la Rive, son couteau à cordes sur le
zinc (celui qui coupe les cordes des bâches) ; la nuit, il est entré au club-house avec la clé
du local à ballons, celle des bénévoles de la Nord, et il a gratté le visage du capitaine qu'il
aimait. Il a rendu la clé à sept heures du matin, en pleurant, à la demoiselle Aymard
(secrétaire du club de 1958 à 1987), qui lui a fait un café et n'a rien demandé ; le conseil a
voulu changer la photo, elle a dit non : « on ne répare pas ce qu'un homme a fait par amour ;
on le laisse au mur, pour qu'il le voie en montant ». Gégé a payé soixante ans : la plaque, le
buis, les masques (« on ne rend pas un visage, on le réimprime, et ça ne suffit pas »), et
l'escalier, marche par marche, où il demande pardon à la photo. La nuit de février 2040, il l'a
dit à Nino ; Nino l'a gardé dix ans.

Pourquoi c'est juste : la bâche de la Nord pour le numéro 5 (« LE 5 EST À NOUS ») a été
décrochée en juin 1974, cordes coupées net ; les témoins de mariage de 1974 montrent l'homme en
écharpe à côté d'Henri ; le registre du cimetière le montre à la grille, sous la pluie, en mars
1975 ; le modèle de 2024 « complète » le visage gratté avec celui qu'il voit le plus souvent à
côté du capitaine. Toutes les pièces désignent un homme de la Nord en écharpe ; aucune ne le
nomme, sauf l'épilogue, qui demande le dossier complet.

## 2. Le garde-fou : ne jamais gâcher « Trois mille visages »

- Aucune pièce d'un autre livre ne dit qui a vendu, qui a laissé passer, qui a pris l'enveloppe.
  Le seul texte qui le dit est **l'ardoise** : elle n'entre au dossier qu'au bout d'une carrière
  du livre 1 finie sur une des fins du livre (`promu_*`), c'est-à-dire quand le joueur a tout lu.
  Une carrière arrêtée avant (la police, une relégation, la ruine) ne la donne pas.
- L'épilogue, qui redit la vérité (Mireille : « Le trésorier avait vendu la finale au Quai. Le
  gardien a laissé passer les trois. Et Henri a pris l'enveloppe. »), demande le dossier complet,
  donc l'ardoise, donc le livre 1 fini.
- Les autres pièces enrichissent sans dévoiler : elles parlent de l'homme en écharpe, de la clé,
  du couteau, jamais de l'enveloppe. Ce qu'elles disent d'Henri (le capitaine de 1974, mort en
  1975) est sur la quatrième de couverture du livre 1, que l'accueil montre à tous.
- La vignette brillante (l'album) montre le cinquième visage intact : Henri Ravenel, qui regarde
  vers la Nord. Elle ne dit rien de ce qu'il a fait.
- Les pièces manquantes ne montrent que leur date et un indice de lieu (« Dans la cave de
  l'hôtel de la Rive, avant le pilon. »), jamais leur texte.

## 3. Les pièces

Douze pièces requises, une facultative (la vignette brillante : l'album n'est pas dans tous les
contenus). Chaque livre en livre au moins une. `trouve` dit comment : un drapeau `dossier_<pièce>`
posé par une scène ou une activité, une conversation surprise entendue jusqu'à sa dernière
réplique, une scène jouée regardée, la fin d'un livre, ou l'événement `fusible:album`.

| Ordre | Pièce (`id`) | Date | Livre(s) | Comment, où | Ce qu'elle dit (≤ 200) |
|---|---|---|---|---|---|
| 10 | La bâche de 1973 (`bache`) | 1973 | 3 *La Sirène* | scène de la semaine `do.sc.bache` : buvette, le soir, saison 2, Gégé range ses bâches | LE 5 EST À NOUS, 1973 ; cordes coupées net ; « décrochée un soir de juin 74 » |
| 15 | La vignette brillante (`brillante`, facultative) | 1974 | l'album | `fusible:album` `{type: brillante, id: 1974_cinquieme}` | le cinquième visage intact ; Henri regarde vers la Nord |
| 20 | Le presse-papier (`presse_papier`) | mai 1974 | 6 *23 h 58* | scène `do.sc.presse_papier` : club-house, Josiane, saison 2 | « Au 5, de la Nord. Mai 1974. » gravé sous le verre |
| 25 | L'ardoise et le ticket (`ardoise`) | mai 1974 | 1 *Trois mille visages* | la fin d'une carrière du livre 1 sur `promu_*` | l'ardoise de Gigi, le ticket du Quai, le trésorier de 1974 (le secret du livre 1) |
| 30 | Les témoins de juin (`temoins`) | juin 1974 | 5 *La Maquette* | scène `do.sc.temoins` : archives de la mairie, Mireille (la sœur), si `h5_mireille` | trois mariages, les mêmes témoins : Henri, et un homme de la Nord qui signe d'une écharpe |
| 40 | Le cahier de nuit (`cahier_nuit`) | 29 juin 1974 | 7 *Chambre 12* | scène `do.sc.cahier_nuit` : réception de l'hôtel, la nuit, Sandrine, saison 2 | minuit, un gars de la Nord, un couteau à cordes sur le zinc |
| 50 | Le carnet de la demoiselle Aymard (`carnet`) | 30 juin 1974 | 1, 2, 3, 4 (1990) | activité `do_tiroir_aymard` : secrétariat du club-house, le soir, 1990-1991, « Le tiroir du bas » | le cadre gratté, la clé du local à ballons, rendue à sept heures |
| 55 | La vieille clé (`cle`) | 1987 | 2 *Le Sapin en carton* | conversation `do.cv.la_cle` : laverie, Delmotte et Josiane | la clé que la demoiselle Aymard a laissée à Josiane : « elle a ouvert quelque chose, une nuit de juin 1974 » |
| 60 | Le registre de la loge (`registre`) | mars 1975 | 4 *La Route de la Rive* | scène `do.sc.registre` : loge du cimetière, Monsieur Abel, si `h4_registre` | l'enterrement d'Henri hors du caveau ; l'homme en écharpe à la grille |
| 70 | Le visage du fonds (`scan`) | 2024 | 8 *L'Oreillette* | scène `do.sc.scan` : chez toi, la nuit, la voix, saison 2, si l'oreillette est encore là | le modèle complète le visage gratté avec celui de l'homme en écharpe |
| 80 | Le couteau à cordes (`couteau`) | 2030 | 9 *Vingt degrés dedans* | conversation `do.cv.le_couteau` : buvette, Gigi et Gégé, avant la mort de Gigi | « Ton couteau à cordes, tu l'as sorti une fois de trop. » « Une fois. En juin. » |
| 90 | Ce que savait la demoiselle Aymard (`josiane`) | 2037 | 10 *Les Deux Téléphones* | scène jouée `do.ci.josiane`, après `pr.h10.ph.visite(_cadre)`, si le carnet est au dossier | la clé des bénévoles, l'homme qui pleurait, « on ne répare pas ce qu'un homme a fait par amour » |
| 95 | Vingt minutes sur le palier (`pardon`) | 2037 | 10 | scène jouée `do.ci.pardon`, après `pr.h10.ph.gege` | « Soixante ans que je te demande pardon dans cet escalier. Tu ne réponds jamais. » |

**Le moment demandé** : en 2037, dans *Les Deux Téléphones*, Madame Josiane arrive au club-house
en fauteuil, la photo de 1974 sur les genoux (les cartes `pr.h10.ph.visite` et
`pr.h10.ph.visite_cadre`). Si le dossier contient le carnet trouvé en 1990 (`dossier_carnet`,
posé au début de la carrière par l'héritage), la scène jouée `do.ci.josiane` suit la carte : elle
raconte la suite. Sinon, rien ne suit : elle se tait, et la carte suffit.

Une pièce trouvée entre au dossier tout de suite (même si la carrière ne finit pas), avec le nom
de famille et l'année de la carrière qui l'a trouvée ; un bandeau l'annonce (« Une pièce du
dossier 1974 : La vieille clé. »), celui de la ville quand on y est, sinon celui de la page. Dans
les carrières suivantes, la pièce déjà trouvée est un drapeau `dossier_<pièce>` : la scène qui la
donne se tait.

## 4. L'épilogue (mars 2050)

`do.ci.epilogue`, au format des scènes jouées (`docs/histoires/scenes_jouees.md`) : le club-house,
le soir, Nino (soixante-six ans) à la vitrine, Mbako (soixante-seize ans) à la table du conseil,
Mireille au secrétariat, toi. Une boîte à chaussures sur la table : ce que soixante ans ont laissé
de 1974. Nino dit ce que Gégé lui a confié la nuit de février 2040 ; Mireille dit ce que la boîte
prouve ; « Ils sont tous sur la photo, ceux qui ont vendu et ceux qui ne savaient pas. Le seul qui
n'y est pas, c'est celui qui l'a grattée. » ; la lumière du palier s'éteint, le clou tient.

- **S'ouvre** quand les douze pièces requises sont au dossier : l'accueil montre alors
  « L'épilogue · Le dossier 1974 · mars 2050 » (et le panneau du dossier, son bouton).
- **Se joue depuis l'accueil**, sans carrière : `preview_dossier.js` en joue les répliques sur le
  club-house de nuit (`ville/int_clubhouse_nuit.webp`, la pièce de la ville, sinon la vignette du
  livre 10), avec les portraits des cartes, la musique de la fin, « Passer » et le clavier
  (Entrée, Échap). La mise en scène de la ville (qui marche où) n'y est pas jouée.
- **Le générique** : la vignette brillante (si elle est au dossier) glissée dans le coin du
  cadre, puis « Ce dossier, ils l'ont rassemblé : » et les noms des carrières qui ont trouvé les
  pièces, par année.
- En ville, la scène porte `si: flag(dossier_epilogue) && annee >= 2050`, et aucun héritage ne
  pose ce drapeau : elle ne se joue jamais pendant une carrière. Elle reste une scène jouée
  valide (lieux, places, acteurs vérifiés par `build_content`).

## 5. Ce qui se garde, et où

`localStorage`, chaque accès sous `try` ; rien ne casse si le stockage manque (navigation
privée) : le jeu se joue, il ne se souvient pas.

| Clé | Contenu | Borne |
|---|---|---|
| `fusible.dossier.v1` | `{pieces: {<id>: {t, livre, nom, annee}}, epilogueVu}` | 13 pièces |

Le reste (les carrières, l'héritage gardé à côté de la graine) : `docs/histoires/fantomes.md`.

## 6. Pour écrire une pièce de plus

1. Une entrée dans `dossier.pieces` (`content/ville/dossier_1974.yaml`) : `id`, `titre` (≤ 40),
   `date`, `ordre`, `livres`, `ou` (≤ 80 : l'indice, sans rien dévoiler), `texte` (≤ 200),
   `trouve` (une seule façon). `build_content` vérifie tout (`_compileDossierFantomes`).
2. Ce qui la donne, dans le même lot : une scène (`set: [dossier_<id>]`), une activité, une
   conversation, une scène jouée ; sa condition dit `!flag(dossier_<id>)`.
3. Le drapeau dans `content/flags.yaml` (la section du dossier, à la fin).
4. Relire le § 2 : une pièce n'a pas le droit de dire l'enveloppe.

## 7. Vérifier

- `dart run packages/tools/bin/build_content.dart`, `lint.dart` (0 erreur).
- La page : `qa_dossier.js` (le banc du lot, hors dépôt) joue l'accueil, la conversation de la
  laverie (`FusibleVille._essai('conv', 'do.cv.la_cle')` : le bandeau, le dossier gardé, l'onglet
  du carnet), une carrière du livre 1 finie sur `promu_vengeance` (l'ardoise sur l'écran de fin),
  et l'épilogue semé (un dossier complet dans `fusible.dossier.v1`), à 393×851 et 360×640.
- Pour voir une scène sans jouer : `packages/tools/web/voir_scene.js --scene do.ci.josiane
  --postulat 9` (le livre 10), `--conv do.cv.le_couteau --postulat 8`.
