# La bande originale de FUSIBLE

> « Plusieurs thèmes pour le jeu, une vingtaine, en rapport avec les histoires : les moments
> sombres, plus joyeux, de découverte, de balade, avec de la crispation, qui retient en haleine,
> ou plus énervés. Une bande-son écoutable longtemps, en boucle. » (le porteur, octobre 2026)

Ce document est la partition d'ensemble : le son du groupe, les vingt thèmes, où chacun joue,
et les règles qui les gardent écoutables pendant deux heures. Le code : `packages/tools/web/audio.js`
(le moteur, les instruments, la grammaire) et `packages/tools/web/musique/*.js` (un fichier par
thème). On écoute sans haut-parleur avec le banc (`banc_son.js`) et le juke-box.

## 1. Le son du groupe

De la synthé noire et moite, celle qui rejouait les années quatre-vingt avec une cassette fatiguée :

- **La basse mène.** Une basse analogique, saturée, en croches ou en doubles croches, souvent en
  octaves, qui respire avec la grosse caisse (la pompe). C'est elle qu'on fredonne.
- **L'hypnose plutôt que la démonstration.** Un ostinato d'une ou deux mesures (basse ou arpège)
  qui tourne, et une accroche rare au-dessus : la mélodie ne joue pas plus de la moitié du temps.
- **La batterie des boîtes à rythmes.** Grosse caisse ronde ou cognée, claps, caisse claire
  « gated », toms qui roulent, charleston discret. Quatre temps au sol pour danser, demi-temps
  pour traîner, jamais de batterie « réelle ».
- **L'espace.** Une grande salle sombre sur la caisse claire et les nappes, un écho qui rebondit
  d'une oreille à l'autre sur les arpèges ; la basse et la grosse caisse restent sèches.
- **La cassette.** Un léger flottement de hauteur (les nappes et les leads ondulent de quelques
  cents), un souffle sous le mix, une saturation douce, les aigus arrondis : rien ne brille trop.
- **Le noir.** Mineur, phrygien, mineur harmonique, dorien quand il faut respirer ; des accords
  qui glissent d'un demi-ton ; des quintes à vide. Même la joie a une ombre.

Ce qu'on n'écrit jamais : une mélodie, une basse ou un riff d'un morceau existant. On compose
dans un style, on ne copie personne. Aucun nom de groupe, de morceau ou de jeu réel dans le dépôt.

## 2. Les règles de la boucle

Le joueur passe deux heures par livre, dont les trois quarts en ville. La musique tourne.

1. **Une boucle longue.** Un thème joue une introduction (une fois), puis un corps qui ne se
   répète pas à l'identique avant **deux minutes trente au moins** (quatre pour les thèmes de
   ville) : plusieurs sections (A, A', B, pont, C…), des couches qui entrent et sortent.
2. **Une courbe d'énergie.** Monter, tenir, retomber : un creux (la basse seule, la nappe seule,
   le filtre fermé) toutes les trente-deux à soixante-quatre mesures. L'oreille se repose.
3. **L'accroche économe.** La mélodie principale apparaît, disparaît, revient variée. Les sections
   sans mélodie font respirer l'ostinato.
4. **Le confort.** Rien d'aigu et de continu (charleston bas, leads filtrés, pas de sifflement au-
   dessus de six kilohertz qui dure) ; pas de grave qui écrase un haut-parleur de téléphone : de
   l'énergie au-dessus de 250 Hz pour qu'il entende la basse.
5. **Le raccord.** La dernière mesure de la boucle relance la première (une relance, une montée,
   un roulement) : on ne doit pas entendre la couture.
6. **Le niveau.** Moyenne vers −21 dB, crête sous −3 dB, et tous les thèmes à ±1,5 dB les uns des
   autres : un fondu enchaîné ne saute pas.
7. **Le poids.** Un téléphone moyen joue tout cela en direct : peu d'oscillateurs par note dans
   les parties rapides, les nappes larges seulement pour les notes tenues.

## 3. Les vingt thèmes

Chaque thème a un nom (la clé dans `MUSIQUE`), un titre, un moment de jeu, une couleur.

### L'accueil

| Clé | Titre | Moment | Caractère |
|---|---|---|---|
| `accueil` | **Fusible** | l'écran titre | la carte de visite du groupe : une basse qui court en octaves, une accroche de quatre notes qu'on n'oublie plus, la cassette qui flotte. 112-118, la mineur. |

### Les dix livres (leurs thèmes de ville, le jour, et leur introduction)

| Clé | Titre | Livre | Caractère |
|---|---|---|---|
| `livre_h1` | **Trois mille masques** | Trois mille visages (1990, entraîneur) | la tribune qui t'aime trop : un chœur de synthèse qui scande sans paroles, une basse en marche, des toms de stade. Fier et inquiétant. 120, ré mineur. |
| `livre_h2` | **Le Répondeur** | Le Sapin en carton (1990, intérimaire) | une berline grise, la pluie, un répondeur qui parle : un piano électrique triste, une basse lente qui glisse, un bip en motif. 90, si mineur. |
| `livre_h3` | **Seize heures** | La Sirène (1990, joueur) | l'usine qui ferme, la sirène de seize heures : une note longue qui monte comme une sirène, des frappes métalliques en boucle, une basse industrielle. 124, mi phrygien. |
| `livre_h4` | **La Route de la Rive** | La Route de la Rive (1990, joueur) | rouler de nuit vers un virage de 1984 : la synthé de route, un arpège qui défile comme les lampadaires, une mélodie en valeurs longues. 104, fa dièse mineur. |
| `livre_h5` | **La Maquette** | La Maquette (1999, président) | un stade en carton dans une vitrine : grandiose et creux, des cuivres de synthèse, une marche ironique, une boîte à musique qui se moque. 96, do mineur. |
| `livre_h6` | **23 h 58** | 23 h 58 (2003, directrice sportive) | le fax, la dernière minute du mercato : une horloge en doubles croches, un arpège nerveux, des stabs d'accords, une course contre la montre. 132, sol mineur. |
| `livre_h7` | **Chambre 12** | Chambre 12 (2011, sélectionneur) | l'insomnie à l'hôtel : un groove lent et moite, une ligne de basse ronde, des nappes qui flottent, un lead qui hésite. 84, mi bémol mineur. |
| `livre_h8` | **L'Oreillette** | L'Oreillette (2024, directeur sportif) | une voix de mort dans l'oreille, un club dans un tableur : des sons froids et numériques, une voix formantée qui murmure, des triolets qui calculent. 110, la mineur (dorien). |
| `livre_h9` | **Vingt degrés dedans** | Vingt degrés dedans (2029, sélectionneuse) | un Mondial d'hiver sous un dôme : des cloches de glace, une nappe immense et lointaine, une basse qui pulse comme une ventilation. 100, fa mineur. |
| `livre_h10` | **Deux téléphones** | Les Deux Téléphones (2037, présidente) | deux sonneries qui se répondent en motif, une basse futuriste et lourde, la ville la nuit en 2040 : le noir le plus moderne du jeu. 116, do dièse mineur. |

### La ville

| Clé | Titre | Moment | Caractère |
|---|---|---|---|
| `ville_jour` | **Promenade** | la ville le jour, en balade (en alternance avec le thème du livre) | la marche tranquille, un groove de basse souple, un arpège qui scintille, l'été qui sent l'orage. 98, sol dorien. |
| `ville_nuit` | **Néons** | le soir et la nuit en ville | ralenti, moite, délavé : une nappe qui ondule fort, une basse en demi-temps, un lead qui traîne derrière le temps. 82, fa mineur. |
| `decouverte` | **Les Quartiers** | un quartier qui s'ouvre, une pièce du dossier trouvée, une page d'album finie (le reste de la journée) | la curiosité : un arpège qui s'ouvre, des cloches, une montée claire sans être naïve. 108, ré dorien. |
| `joie` | **La Montée** | le Bilan tenu, une montée, un titre, une Coupe gagnée | la fête, mais au bord de la nuit : une basse disco en octaves, des claps, une accroche qui monte, des accords majeurs volés au mineur. 122, la mineur → do majeur. |

### La tension

| Clé | Titre | Moment | Caractère |
|---|---|---|---|
| `match` | **La Rive** | le samedi au stade | la poussée : quatre temps au sol, une basse qui cogne, un chœur de tribune, des montées. 128, mi mineur. |
| `sombre` | **Garde à vue** | une carte sombre, un événement noir | la crispation : un battement de cœur, un ostinato de deux notes, des cordes de synthèse qui frottent, le silence qui pèse. 92, ré mineur. |
| `suspense` | **Les Douze Pages** | le grand déballage, les décisions du samedi en direct, la dernière carte d'un livre | retenir son souffle : une montée qui ne finit pas, un ostinato qui accélère par paliers, des roulements. 100 → 110, si bémol mineur. |
| `enerve` | **Court-circuit** | le mode éclair, Le Fusible | énervé : basse saturée en doubles croches, grosse caisse cognée, lead criard filtré, des cassures. 140, mi phrygien. |
| `fin` | **Le Dernier Tour** | l'écran de fin, l'épilogue de 2050 | la mélancolie : lent, une basse ronde, un lead en larmes, la cassette qui fatigue ; la dernière chanson de la soirée. 80, la mineur. |

## 4. Où ils jouent

- **L'accueil** : `accueil`.
- **En ville, le jour** : le thème du livre en cours (`livre_hN`) les jours pairs, `ville_jour` les
  jours impairs ; `decouverte` remplace l'un ou l'autre le jour d'une découverte.
- **En ville, le soir et la nuit** : `ville_nuit`.
- **L'introduction jouée d'un livre** : son thème.
- **Le samedi au stade** : `match` ; une décision du samedi en direct : `suspense`.
- **Une carte sombre** : `sombre` ; **le grand déballage** : `suspense`.
- **Le Bilan tenu, une montée, un titre** : `joie` (jusqu'au lendemain).
- **Le mode éclair** : `enerve`.
- **L'écran de fin, l'épilogue du dossier** : `fin`.

## 5. Comment on écrit un thème

La grammaire est celle de `audio.js` (« L'ÉCRITURE », « LES VOIX ») : seize cases par mesure, une
note attaque, `-` la tient, `.` se tait, `~` glisse, `!` accentue ; la basse et les accords en
degrés sur la grille ; la batterie en lettres. Un thème vit dans son fichier
`packages/tools/web/musique/<clé>.js` et s'enregistre auprès du moteur. Le banc le rend en WAV et
en MP3, mesure son niveau, sa durée de boucle et son poids ; le juke-box (`juke_box.js`) les joue
tous en direct, comme dans le jeu.
