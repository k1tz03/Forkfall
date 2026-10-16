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

Chaque thème a une clé (son fichier, `musique/<clé>.js`), un titre, un moment de jeu, une couleur.

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

## 6. Le guide du compositeur

Ce qu'il faut pour écrire un thème sans rien lire d'autre que cette bible. Le modèle à ouvrir à
côté : `musique/accueil.js` (« Fusible »), écrit avec toute la palette et passé au banc. La
grammaire complète, case par case et paramètre par paramètre, est en tête de la musique dans
`audio.js` (« L'ÉCRITURE », « LES VOIX ») ; ce guide en donne l'usage.

### 6.1 Le fichier d'un thème

Un thème, un fichier : `packages/tools/web/musique/<clé>.js`, la clé du § 3 (`livre_h4`,
`suspense`…). Chaque compositeur ne touche que ses fichiers : jamais `audio.js`, jamais le thème d'un
autre, jamais `copie: 'autre_theme.A'` (une copie se fait dans le thème : `copie: 'A'`). Un fichier
dont le nom commence par `_` n'est pas chargé : c'est la place d'un brouillon. Le fichier
s'enregistre par `FusibleAudio.theme(clé, définition)` ; l'aperçu, le banc et le juke-box le chargent
seuls, par ordre alphabétique, chacun dans son filet (une erreur dans un fichier n'emporte que son
thème ; une faute de syntaxe arrête l'assemblage avec le nom du fichier et la ligne).

```js
/* ---------------------------------------------------------------------------
 * FUSIBLE — la bande originale : « La Route de la Rive » (livre_h4), la ville
 * le jour dans le livre 4. Le caractère en deux phrases ; puis la carte :
 *   intro   4 m.  (une fois) …
 *   A      16 m.  …
 *   B       8 m.  …
 * La grammaire : audio.js (« L'ÉCRITURE », « LES VOIX ») ; le guide :
 * docs/design/bande_originale.md § 6.
 * ------------------------------------------------------------------------- */
(function (A) {
  'use strict';
  var SILENCE = A.SILENCE;                          // une mesure vide
  var TENU = '- - - - - - - - - - - - - - - -';     // la note d'avant continue
  var NAPPE = 'X - - - - - - - - - - - - - - -';    // l'accord tenu toute la mesure
  // les motifs du thème, nommés : on les réutilise, on les varie (celui-ci tient la
  // place : chaque thème écrit le sien)
  var ACCROCHE = 'F#5 - - E5 - - C#5 - A4 - - - - - - .';

  A.theme('livre_h4', {
    titre: 'La Route de la Rive', moment: 'la ville le jour, livre 4',
    tonalite: 'fa dièse mineur', humeur: 'rouler de nuit vers un virage de 1984',
    ville: true,                                    // thème de ville : boucle de 4 min au moins
    bpm: 104, gain: 1,                              // `gain` se règle en dernier, au banc
    pompe: { prof: 0.5, rel: 0.2 },
    echo: { pas: 3, retour: 0.38, coupe: 2400 },
    salle: { taille: 0.7, duree: 2.8, ton: 4000 },
    cassette: { sature: 1, coupe: 10000, bas: 40, souffle: 0.004, flotte: 3 },
    voix: {
      lead:  { inst: 'lead', vol: 0.12, echo: 0.25, rev: 0.3, flotte: { prof: 6, vit: 0.6 } },
      arp:   { inst: 'pluck2', vol: 0.07, oct: 4, echo: 0.4, pompe: true, filtre: 3600 },
      nappe: { inst: 'supersaw', vol: 0.07, oct: 3, scies: 5, rev: 0.35, pompe: true,
               flotte: { prof: 10, vit: 0.4 }, filtre: 3200, env: [0.25, 0.8, 0.85, 0.4] },
      basse: { inst: 'basse', vol: 0.09, oct: 1, plancher: 'E1', pompe: true, drive: 1.6, filtre: 2400 },
      batt:  { vol: 0.7, porte: 0.5, rev: 0.15 }
    },
    sections: {
      intro: { accords: ['F#m', 'F#m', 'D', 'C#'], ouvre: { basse: [200, 2400] },
               basse: 'R 8 R 8 R 8 R 8 R 8 R 8 R 8 R 8', nappe: NAPPE,
               batt: ['k . h . k . h . k . h . k . h .', 'k . h . k . h . kz . T . t T S S'] },
      A: { accords: ['F#m', 'F#m', 'D', 'D', 'Bm', 'Bm', 'C#', 'C#'], /* … */ },
      B: { accords: ['D', 'E', 'F#m', 'F#m'], /* … */ },
      A2: { copie: 'A', harmo: true, arp: '1 5 8 1 5 8 1 5 8 1 5 8 1 5 8 9' }
    },
    ordre: ['intro', 'A', 'B', 'A2', 'B'], boucle: 1
  });
})(typeof FusibleAudio === 'object' ? FusibleAudio : require('../audio.js'));
```

- **Les champs du juke-box** : `titre`, `moment`, `tonalite`, `humeur` (une ligne). `ville: true`
  pour un thème joué en ville (les `livre_hN`, `ville_jour`, `ville_nuit`, `decouverte`, `joie`) :
  le banc lui demande alors quatre minutes de boucle au lieu de deux et demie.
- **La forme** : `ordre` liste les sections ; `boucle` est le rang où la boucle reprend. Ce qui est
  avant est l'introduction, jouée une fois (`boucle: 1` : une section d'intro). Une section dure
  autant de mesures qu'elle a d'`accords` (« Am E » : deux accords dans la mesure). Une voix porte
  une mesure (répétée) ou une liste de mesures (qui tourne, et repart du début à chaque section :
  trois mesures dans une section de seize tournent à contretemps des phrases de quatre).
- **La reprise** : le jeu quitte un thème et y revient sans cesse ; retrouvé dans les dix minutes,
  il reprend à la section qui suit celle qu'il a quittée, pas à l'introduction (qui ne joue qu'à une
  entrée neuve). Chaque section du corps doit donc pouvoir ouvrir le morceau à froid (la grosse caisse
  et la cymbale sur le premier temps, la basse dès la première mesure). `reprise: { sauf: ['creux'] }`
  nomme les sections où le jeu ne reprend jamais (un creux presque muet ouvrirait mal une carte).
- **Copier** : `B2: { copie: 'B', harmo: true, batt: [...] }` reprend B et remplace ce qu'on donne.
  `harmo: true` fait chanter la voix `harmo` sous la voix `lead` (seulement elle), sur une note de
  l'accord.
- **Les degrés** : R (la basse de l'accord, « F/E » compris), 1, 3, 5, 7, 8 (l'octave), 9 (la tierce
  à l'octave : ce n'est pas la neuvième), X (l'accord entier). Une note écrite (`C#5`) ne suit pas
  la grille. `-` prolonge par-dessus la barre de mesure (pas d'une section à la suivante) ; `X`
  prend l'accord de sa case d'attaque.
- **La batterie** : `k` `K` grosse caisse (elles font pomper), `s` caisse claire, `S` la caisse
  « gated » (elle seule passe par la porte), `c` clap, `h` `o` charleston, `r` cerclage, `t` `T`
  toms, `x` cymbale, `m` métal, `i` tic, `z` la montée (une demi-mesure : sur la neuvième case),
  `b` le boum. Elles se combinent : `kSc`, `kx`, `kz`.

### 6.2 La palette, humeur par humeur

Les paramètres nés avec ce guide (tout est détaillé dans « LES VOIX ») :

| Paramètre | Où | Ce qu'il fait |
|---|---|---|
| `salle: { taille, duree, ton, piece }` | thème | une vraie salle : pré-délai et premiers murs (`taille` 0 à 1), queue en secondes (`duree`), clarté (`ton`, Hz) ; `piece` garde un peu de la petite pièce commune. Sans `salle`, tout le thème passe dans la petite pièce, comme avant |
| `rev` | voix, `batt` | la part envoyée à la salle (sur `batt` : caisses claires, claps, toms) |
| `cassette: { sature, coupe, bas, souffle, flotte }` | thème | la bande fatiguée : saturation douce du mélange, aigus arrondis (Hz), grave inutile coupé (Hz), souffle dessous, flottement de tout le mélange (cents) |
| `flotte: { prof, vit }` ou `flotte: 8` | voix | le flottement de la bande : la hauteur ondule de ±`prof` cents à `vit` Hz, en deux lenteurs qui ne se rejoignent pas |
| `env: [a, d, s, r]`, `ton: [ouverture, palier, temps]` | voix | l'enveloppe et le filtre de l'instrument, imposés par la voix |
| `plancher: 'E1'` | voix | quand la basse d'un accord tomberait sous cette note, ses degrés montent d'une octave : en `oct: 1`, sans plancher, do et ré descendent à 33 et 37 Hz, qu'aucun téléphone ne rend (la basse, la reese : `'E1'` à `'G1'`) |
| `batt: { drive, filtre, porte, tenue }` | batterie | le bus saturé, un passe-bas balayable (`ouvre: { batt: [...] }`), la porte de la caisse `S` (1 : la queue presque aussi forte que la caisse ; 0,5 : douze décibels dessous) et sa durée (s) |
| `supersaw` (`scies` 5/7, `desaccord`, `large`) | instrument | la grande scie, pour les accords tenus et les leads larges |
| `reese` (`desaccord`, `chaleur`) | instrument | deux scies qui battent lentement, saturées, sous un passe-bas ; un sinus dessous |
| `stab` | instrument | un accord plaqué dont le filtre se ferme vite (avec `X`) |
| `vox` (`voyelle`, `vers`) | instrument | une voix « aah », « ouh », qui peut glisser d'une voyelle à l'autre |
| `sqbasse`, `pluck2` | instrument | la basse carrée des années quatre-vingt ; le pincé en dents de scie |

À `vol` égal, les instruments neufs sonnent comme leurs voisins (`sqbasse` comme `basse`, `pluck2`
comme `pluck`, `supersaw` et `vox` comme `pad`, `stab` comme un accord de `pluck`) : on change
d'instrument sans refaire le mélange.

Les valeurs de départ, selon l'humeur (à régler à l'oreille du banc ensuite) :

| | Rêveur, moite (`ville_nuit`, `livre_h7`) | Dansant (`accueil`, `joie`, `ville_jour`) | Énervé (`enerve`, `match`) | Tendu (`sombre`, `suspense`) |
|---|---|---|---|---|
| tempo | 78 à 96, demi-temps | 108 à 124, quatre au sol | 132 à 150 | 90 à 110, ou par paliers |
| `pompe` | `{ prof: 0.35, rel: 0.3 }` | `{ prof: 0.6, rel: 0.2 }` | `{ prof: 0.7, rel: 0.12 }` | `{ prof: 0.3, rel: 0.35 }` |
| `salle` | `{ taille: 0.9, duree: 4, ton: 3200 }` | `{ taille: 0.75, duree: 2.8, ton: 4200 }` | `{ taille: 0.4, duree: 1.4, ton: 5500 }` | `{ taille: 0.8, duree: 3.4, ton: 2600 }` |
| `rev` (nappes, leads) | 0,4 à 0,6 | 0,25 à 0,35 | 0,1 à 0,2 | 0,3 à 0,5 |
| `echo` | `{ pas: 6, retour: 0.45, coupe: 1800 }` | `{ pas: 3, retour: 0.38, coupe: 2600 }` | `{ pas: 2, retour: 0.25, coupe: 3500 }` | `{ pas: 3, retour: 0.5, coupe: 1500 }` |
| `cassette` | `{ sature: 0.8, coupe: 8500, bas: 40, souffle: 0.006, flotte: 5 }` | `{ sature: 1, coupe: 10500, bas: 40, souffle: 0.004, flotte: 3 }` | `{ sature: 1.6, coupe: 12000, bas: 40, souffle: 0.003 }` | `{ sature: 1, coupe: 9000, bas: 40, souffle: 0.005, flotte: 4 }` |
| `flotte` (nappes, leads) | `{ prof: 14, vit: 0.35 }` | `{ prof: 8, vit: 0.5 }` | `{ prof: 3, vit: 0.8 }` | `{ prof: 10, vit: 0.25 }` |
| `drive` (basse) | 0 à 1,2 | 1,4 à 1,8 | 2,2 à 3 | 1,2 |
| `batt` | `{ porte: 0.3, rev: 0.25 }` | `{ porte: 0.5, rev: 0.15 }` | `{ porte: 0.7, rev: 0.1, drive: 1.8 }` | `{ porte: 0.2, rev: 0.3, filtre: 6000 }` |
| les instruments | `supersaw` (`scies: 5`), `vox`, `epiano`, `cloche`, `sub` | `basse` en octaves, `pluck2`, `stab`, `lead` | `reese`, `basse` saturée, `acide`, `stab` | `reese` tenue, `vox`, `sub`, `cloche` (`faux`), `acide` filtré |

Jamais de `flotte` sur la basse ni sur la grosse caisse (le sol se désaccorde) : la `cassette`
fait flotter tout le mélange, de deux ou trois cents, et c'est assez.

### 6.3 Durer : les boucles longues

- **Compter.** Une mesure dure 240 / bpm secondes. Deux minutes trente, c'est 150 × bpm / 240
  mesures (116 bpm : 73 ; 98 bpm : 62) ; quatre minutes pour la ville, 240 × bpm / 240 = bpm
  mesures (98 bpm : 98 mesures). Le banc mesure la **période** : la plus courte durée au bout de
  laquelle la musique se redit à l'identique, case par case : un corps qui se redit lui-même
  (« A B A B ») n'en compte que la moitié.
- **Varier sans réécrire.** `copie` plus ce qui change : la basse (`BASSE`, `BASSE2`), l'arpège (en
  croches, puis en « trois contre quatre » : `'1 5 8 1 5 8 1 5 8 1 5 8 1 5 8 9'`), `harmo` au second
  passage, un accord substitué, la batterie mesure par mesure (une liste qui tourne), un balayage
  `ouvre` qui assombrit le couplet et ouvre le refrain. Une liste de mesures qui ne divise pas la
  section (trois mesures dans seize) fait varier la section de l'intérieur ; mais chaque section
  repart du début de ses listes : la période n'y gagne rien, seules des sections différentes la
  rallongent.
- **La courbe d'énergie.** Écrire la carte des sections avant les notes, avec leur force : monter,
  tenir, retomber, un creux toutes les trente-deux à soixante-quatre mesures (la basse seule, la
  nappe seule, le filtre fermé, le tic). « Fusible » : intro douce, A, B un cran au-dessus, le pont
  au fond, A2, C au sommet, la retombée, et ça repart.
- **L'accroche économe.** Elle se présente (une boîte à musique, un écho), revient au bout des
  phrases, se déforme au refrain, change d'octave au sommet ; la moitié du temps, l'ostinato seul.
- **L'introduction** ne se joue qu'une fois : la première section du corps doit tenir après elle
  **et** après la fin du corps.
- **La couture.** La dernière mesure du corps relance la première : un roulement de toms, la montée
  `z` sur la neuvième case, `S S` à la fin ; la première mesure a sa cymbale (`kx`) et le filtre de
  la basse qui se rouvre d'un coup. Le banc mesure l'écart des deux mesures : sous 3 dB, rien à
  dire ; de 3 à 6 dB, écouter ; au-delà, c'est une marche.
- **Le poids.** La `supersaw` seulement pour tenir (`scies: 5` dans une nappe, sept pour un lead
  seul), jamais en doubles croches ; le `vox` et la `reese` en valeurs longues ; les doubles croches
  aux instruments à un ou deux oscillateurs (`pluck2`, `sqbasse`, `acide`, `pluck`). Le banc compte
  les sources qui sonnent ensemble : viser 80 au plus, 100 est la limite (« Fusible » : 92 à son
  sommet, 46 en moyenne). Le coût, mesuré en rendant dans la même séance l'ancien thème de l'accueil
  et « Fusible » : son couplet coûte moins que l'ancien refrain, son sommet 1,3 fois plus ; chaque
  couche d'une section chargée (la nappe, l'arpège en doubles croches, la doublure en grande scie)
  en pèse 10 à 15 %, les effets (salle, cassette, flottements, porte) un cinquième à eux tous. Une
  couche lourde se garde pour le sommet, pas pour toute la boucle : l'envolée de « Fusible » ne
  prend sa grande scie qu'à son second passage. Une enveloppe longue (`env`) garde ses voix en
  vie : raccourcir la relâche d'une nappe allège tout.

### 6.4 Le banc : les commandes et les cibles

```bash
# la partition seule, en Node, en une seconde : les fautes d'écriture, la forme, la période
node packages/tools/web/banc_son.js --verifier [thème …]
# le rendu d'une boucle entière : l'introduction et deux passages du corps, en WAV et en MP3
NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/banc_son.js --boucle --mp3 --out /tmp/banc livre_h4
# un passage précis, vite : vingt secondes à partir de la section B
NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/banc_son.js --depuis B --duree 20 --out /tmp/banc livre_h4
# un brouillon hors de musique/, et tous les thèmes pour comparer les niveaux
NODE_PATH=/opt/node22/lib/node_modules node packages/tools/web/banc_son.js --boucle --avec /tmp/brouillon.js --out /tmp/banc
```

Une boucle entière se rend en quelques minutes (« Fusible » : six minutes de musique, cinq minutes de
rendu sur une machine partagée) : pour travailler une section, `--depuis` et `--duree` ; la boucle
entière pour juger la forme, le niveau et la couture.

Par thème : `<clé>.wav`, `<clé>.mp3` (192 kb/s), `<clé>.png` (le spectrogramme), `<clé>_courbe.png`
(l'énergie mesure par mesure, les sections, la couture), et `banc.json` dans le dossier (toutes les
mesures, cumulées d'un rendu à l'autre : l'écart des niveaux entre thèmes se lit à la fin). Une ligne
par thème :

```
accueil   « Fusible »   moy −20,9 dB (corps) · int −19,0 · crête −3,8 · >250 Hz 23,6 % · >6 kHz 1,6 % ·
          boucle 3:02 (88 m.) · redite 3:19 · couture −1,2 dB · ×1,7 · 92 sources (C2 m.8), 46 en moyenne  ✓
```

| Mesure | Cible | Ce qu'on fait sinon |
|---|---|---|
| `moy` : le RMS moyen (sur le corps avec `--boucle`) | −21 dB, à ±1,5 (viser ±0,5) | `gain`, en dernier |
| `int` : l'intensité pondérée K (ce que l'oreille entend) | proche des autres thèmes (« Fusible » : −19) | si `moy` est bon mais `int` loin des autres, le thème est trop grave ou trop brillant |
| `crête` | sous −3 dB | baisser ce qui claque (caisse, `stab`, accents), ou `gain` |
| `>250 Hz` : la part de l'énergie au-dessus | 20 % au moins, viser 25 à 40 % | moins de basse et de grosse caisse, plus de médium (nappes, arpèges, leads) ; `cassette.bas` |
| `>6 kHz` | 6 % au plus, viser 1 à 4 % | charleston plus rare, `cassette.coupe` plus bas |
| `boucle` (la période) | 2:30 (150 s), 4:00 pour la ville | plus de sections, plus de variantes (§ 6.3) |
| `couture` | sous ±3 dB (±6 au plus) | une relance dans la dernière mesure |
| `sources` | 80, 100 au plus | § 6.3, le poids |
| `×` : la vitesse du rendu | à comparer à « Fusible » rendu dans la même séance | elle dépend de la charge de la machine : elle informe, elle ne juge pas |

Tous les thèmes à ±1,5 dB les uns des autres : rendre aussi l'accueil dans le même dossier et lire la
dernière ligne (« l'ensemble »).

### 6.5 Vérifier sans haut-parleur

- **La courbe** (`<clé>_courbe.png`) : une barre par mesure, son intensité ; les sections en bandes
  nommées ; les points rouges, le RMS brut ; le trait vert, la cible ; le trait rouge, la couture.
  On y lit la courbe d'énergie promise (un creux est une vallée nette), une section qui ne décolle
  pas, une marche à la couture.
- **Le spectrogramme** (`<clé>.png`, échelle de fréquence logarithmique) : le temps en abscisse.
  La grosse caisse : des coups en virgule de 150 à 50 Hz (c'est elle qui charge la bande 90-180 Hz,
  pas la basse) ; la basse : une bande continue sous 250 Hz et ses harmoniques au-dessus ; la caisse
  « gated » : un bloc de bruit jusqu'à 10 kHz, coupé net ; les nappes et l'arpège entre 300 Hz et
  2 kHz ; les charlestons, des traits fins jusqu'à 14 kHz ; au-dessus de la coupure de la cassette,
  plus rien. Un creux se voit (le haut du spectre s'éteint), une couture aussi.
- **Zoomer** sur une mesure pour lire les notes (une fréquence linéaire, quatre secondes) :
  `ffmpeg -ss 31 -t 4 -i accueil.wav -lavfi "showspectrumpic=s=1400x700:fscale=lin:start=60:stop=1400" zoom.png`
  — puis comparer aux fréquences attendues (la4 = 440 Hz ; un demi-ton, × 1,0595). Les étiquettes de
  l'axe sont approximatives : mesurer avant de corriger une note.
- **Écouter quand même** : le MP3 sur un téléphone, et le juke-box (§ 6.6), qui joue le thème en
  direct avec le moteur du jeu, saute d'une section à l'autre et fait entendre la couture.

### 6.6 Le juke-box

```bash
node packages/tools/web/juke_box.js --out /tmp/juke [--avec /tmp/brouillon.js]
```

Deux pages, la même musique : `index.html` (la page entière, à ouvrir ou à servir) et
`artefact.html` (sans l'enveloppe du document : c'est elle que l'outil Artifact publie pour le
porteur). La liste des faces dans l'ordre de cette bible, le lecteur collé en haut (la section, la
mesure, le passage, le temps dans la boucle, le spectre, le niveau à côté de la cible de −21 dB),
les sections à toucher pour y sauter, « Écouter la couture » (deux mesures avant la fin de la boucle),
et le fondu enchaîné du jeu d'une face à l'autre. Un thème qui ne se compile pas reste dans la liste,
marqué, avec son erreur.

### 6.7 Les pièges

- Seize cases par mesure, ni plus ni moins (le banc dit laquelle).
- `ouvre` ne balaie qu'une voix qui a un `filtre` ; une section sans `ouvre` rend à la voix son
  `filtre`. Le balayage dure toute la section.
- Une voix `drive` joue ses notes à pleine force dans la saturation : son `vol` s'applique après.
- La `porte` ne prend que `S` ; `rev` sur `batt` prend `s`, `S`, `c`, `t`, `T`, `r` (jamais la
  grosse caisse ni le charleston, qui restent secs).
- Le `gain` d'un thème vient en dernier, une fois le mélange juste ; les `vol` font le mélange.
- `epoque: true` change le timbre d'une voix selon l'année de la carrière : à éviter dans un thème
  qui doit sonner pareil partout.
- Aucune mélodie, aucune basse, aucun riff d'un morceau existant, et aucun nom réel (groupe, morceau,
  jeu) nulle part : on décrit un style avec des mots (§ 1).
