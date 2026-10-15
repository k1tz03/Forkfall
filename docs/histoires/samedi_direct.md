# Le samedi en direct — décider au bord du terrain

Proposition approuvée par le porteur (octobre 2026) :

> « Le samedi en direct. Aujourd'hui, le match se regarde : son résultat est tiré avant, avec la
> posture choisie pour six journées d'un coup. Il y aurait désormais deux ou trois décisions au
> bord du terrain, à la minute où elles arrivent, cinq secondes pour un geste. La tribune, le
> tableau et la musique réagissent. […] Garde-fou : une carrière se rejoue toujours à
> l'identique. »

## Les trois garde-fous, et la forme qui les tient

1. **Une carrière sans décision en direct ne change pas d'un bit** : `simulate`, les vingt
   goldens, l'aperçu des cartes seules, l'application Flutter, les budgets de `--assert`. Les
   décisions ne tirent rien sur le `Rng` de la carrière et ne prennent ni tour ni créneau : les
   ancres des dix livres restent où elles sont.
2. **Le déterminisme** : tout ce que le direct montre ou décide se déduit de la graine, de la
   saison, de la journée et des décisions déjà prises — un générateur à part, haché
   (`Rng(fnv1a32('samedi|graine|postulat|saison|blocs'))`), jamais `Math.random`.
3. **Rien ne contredit la suite** : le résultat du match mis en scène (la dernière journée du
   bloc) est acquis avant que le moteur ne tire la carte suivante.

La forme :

- **Le moteur écrit le script du samedi** (`Engine.samediDirect`, pur : l'état ne bouge pas).
  Le nombre de décisions (une à trois), leurs minutes, le score à chaque décision, l'adversaire,
  le texte et les deux gestes de chaque décision. C'est lui, et pas la ville, qui le calcule :
  il est testé en Dart, il ne dépend que de l'état, et il peut vérifier ce que la ville lui
  renvoie (une décision qui n'était pas au script ne compte pas).
- **La ville retient le choix de posture.** Le samedi, à la Rive, la carte du match se joue
  comme avant ; mais son choix (Offensif, Prudent…) ne part pas au moteur : la ville le garde
  (`FusibleVille.retenir`, un crochet d'une ligne dans `advance` de la coquille), lance le
  match et le joue jusqu'à la dernière décision.
- **À chaque décision, le match s'arrête** : ralenti, la caméra sur le banc, sur la Nord ou en
  loge, la musique du stade cède à un cœur qui bat (le thème `sombre`), une carte de décision
  avec la minute, le score, le texte, deux boutons et un anneau de cinq secondes (dix en
  mouvement réduit ou en mode lent ; le compte s'arrête quand la page est cachée). Sans
  réponse, le geste passif s'applique (`defaut:`).
- **Un seul appel au moteur**, après la dernière décision : `fusibleChoose(droite, direct)`
  (`Engine.choose(…, direct:)`). Le moteur refait le script, compte les décisions qui y
  figurent, et résout le bloc **avec les mêmes six paires de tirages** : seules les bornes de
  la dernière journée bougent (`resolveBlock(dernier:)`). Il applique les effets cachés, écrit
  la fin du match (les buts après la dernière décision, cohérents avec la lettre) et garde la
  trace dans l'état (`GameState.direct`, trente matchs au plus).
- **La ville finit le match**, puis ne rend la vue qu'à la sortie du stade
  (`FusibleCoquille.presenterDirect`) : la carte d'après arrive quand le score est au mur.

### Un écart assumé : le score affiché n'est pas indépendant du résultat

La forme recommandée tirait le score courant indépendamment du résultat. Indépendant, un match
sur cinq (≈ 22 %) aurait dû se retourner dans le dernier quart d'heure — mené à la 75ᵉ et
vainqueur, ou devant et battu —, quand le football réel en retourne deux ou trois sur cent : le
joueur aurait vu un tableau qui ment, et des décisions qui ne pèsent rien.

Le moteur sait, sans rien tirer, ce que la dernière journée donnerait **sans décision** : il
rejoue le bloc sur une copie du générateur (`Rng.fromState`, comme un aperçu). Le score à la
dernière décision est tiré selon cette lettre (une victoire passe devant une fois sur deux à la
75ᵉ, une défaite derrière une fois sur deux ; un nul, à égalité six fois sur dix). Les
retournements qui restent (≈ 6 %) sont le football ; ceux qu'on ajoute sont ceux que les
décisions provoquent. Ce que ça coûte : rien côté hasard — c'est la même fonction, sur une
copie.

## Ce que les décisions font

Chaque geste a deux nombres, en points de pourcentage sur la dernière journée du bloc : `v`
(la victoire) et `n` (le nul) ; la défaite bouge de −(`v` + `n`). Un geste vaut au plus ±6 ; la
somme d'un match est bornée à ±10 (victoire) et ±8 (nul). Le tirage reste le même : un geste
change le résultat quand le dé tombait tout près de la frontière, et seulement là.

| Exemple (`content/ville/match_direct.yaml`) | `v` | `n` | Ce que ça veut dire |
|---|---|---|---|
| « Un attaquant de plus », mené dans le dernier quart d'heure | +3 | 0 | plus de victoires, autant de défaites en moins |
| « Je ferme la porte », à égalité | −2 | +5 | moins de défaites, moins de victoires |
| « Je sors le capitaine », il boite | +3 | +1 | mieux sur le terrain, et le vestiaire qui se froisse (−1) |
| « On monte, on les tue », devant à l'heure de jeu | +3 | −3 | plus de victoires, plus de nuls perdus |
| « Je reste en loge » pendant l'envahissement | −1 | 0 | les joueurs attendent dans le froid ; la Nord s'en souvient (−1) |

Le geste passif (celui que le temps choisit) est presque toujours le plus neutre : ne rien faire
a rarement un prix sur la pelouse, mais il arrive que ce soit le bon geste (laisser un vestiaire
soudé se parler, `ent_vestiaire_soude`).

Et des effets cachés, légers, par les mécanismes qui existent déjà : un cran de relation avec un
visage de la carrière (le capitaine, le gamin, le capo de la Nord, le jardinier de la Rive…),
un point de climat (les jauges cachées). Aucun drapeau, rien qui touche une ancre d'un livre,
jamais de fin.

## Combien, et quand

| Le samedi | Décisions |
|---|---|
| le premier de la carrière | une |
| un samedi ordinaire | une ou deux (moitié-moitié) |
| le derby (le rival : deuxième et cinquième blocs) | deux ou trois |
| la dernière journée (sixième bloc) | trois |

Trois moments : la première mi-temps (17ᵉ-40ᵉ), l'heure de jeu (55ᵉ-70ᵉ), le dernier quart
d'heure (76ᵉ-85ᵉ). Une décision est écrite pour un rôle, une ou plusieurs situations (`menes`,
`nul`, `devant`), un ou plusieurs moments, et parfois une condition (`when:`, la langue des
cartes) : une époque (deux remplaçants jusqu'en 1994, la passe en retrait prise à la main
jusqu'en 1991, le portable dans la loge à partir de 1998, l'assistance vidéo à partir de 2019,
cinq changements à partir de 2020), un visage de la carrière (Vecchio, Mbako, Vukić, Bréhaut,
Dembo, Vialat, Fardelli, Vogler, Kara, Ober, Ferrol, Vandel), ou **ce que la semaine a préparé** :
le moral du vestiaire (`gauges.vestiaire`), un lien de deux crans avec le jardinier de la Rive
(il a dit où la pelouse a bu), avec le capo de la Nord, avec Steph de la salle de muscu. C'est
par là que la semaine pèse sur le samedi. La moins vue de la carrière passe d'abord ; à égalité,
le poids. Un rôle qui décide au bord du terrain a, pour chaque moment et chaque situation, au
moins une décision sans condition (`build_content` le vérifie) : aucun samedi ne reste muet.

Les époques des livres décident de ce qui sert : l'entraîneur et le joueur vivent 1990-1995,
le président 1999 puis 2037, le directeur sportif 2003 puis 2024, le sélectionneur 2011 puis
2029. Mesuré sur 1 500 samedis (les dix livres, huit graines) : 2,0 décisions par match, 57
des 60 décisions servies (les trois autres attendent un lien tissé en ville), aucun score
final qui contredise la lettre.

Les rôles : la ville met le match en scène pour tous (l'entraîneur et le sélectionneur sur le
banc, le joueur sur la pelouse, le président et le directeur sportif en loge). Loin d'Aubérive
(le Mondial du livre 9), pas de Rive, donc pas de direct ; la Coupe et le Grand Match restent
des cartes.

## Le contenu

`content/ville/match_direct.yaml`, validé par `build_content` (`compileMatchDirect`,
`packages/tools/bin/src/match_direct_build.dart`) :

```yaml
match_direct:
  - id: ent_capitaine_boite
    roles: [entraineur]
    situations: [menes, nul]
    moments: [heure]
    when: "year <= 1995"             # facultatif : la langue des `when` des cartes
    camera: banc                     # banc | kop | loge | terrain (sinon : selon le rôle)
    poids: 2                         # facultatif
    texte: "…"                       # ≤ 200 (≤ 220 une fois rendu) ; {adv} {Adv} {score} {minute} …
    gauche: {label: "Je le sors", reponse: "…", v: 2, n: 0, foule: siffle, effets: {relation: {brehaut: -1}}}
    droite: {label: "Il reste", reponse: "…"}
    defaut: droite                   # le geste passif, quand le temps est écoulé
```

Un libellé ≤ 28 caractères, une réponse ≤ 140, `foule` ∈ `leve | siffle | rien`, des effets
`jauges` (±1 ou ±2) et `relation` (±1) seulement, une condition `when` valide dont les drapeaux
sont déclarés. Les textes sont écrits selon la charte (`docs/bible/charte_histoire.md`) : une
scène, un geste, une question qui engage ; pas de formule qui revient.

## Ce qui ne bouge pas, et ce qui ne se rejoue pas

- Sans `direct`, `Engine.choose` prend exactement le même chemin qu'avant ; `resolveBlock` sans
  `dernier` aussi (le test du direct compare l'ancien algorithme, recopié, au nouveau sur des
  milliers d'états) ; `GameState.toJson` n'écrit `direct` que s'il y a une trace. Mesuré à
  l'arrivée : les vingt goldens passent sans être régénérés, et `simulate --runs 300` sort la
  même chose, à l'octet, avant et après.
- **Le Code de Carrière ne rejoue pas les décisions en direct** — pas plus que le reste de la
  ville (les activités, les missions, les scènes de la semaine) : une carrière jouée en ville se
  sauvegarde par son état entier. Les encoder serait possible (leurs identifiants se recalculent :
  il suffirait d'un bit par décision), mais le Code ne rejouerait de toute façon pas la ville
  autour ; on ne le fait pas.
- Une page rechargée au milieu des décisions reprend la carte du match : rien n'a été envoyé au
  moteur, et le script, déterministe, revient à l'identique. Rechargée après l'appel, elle
  reprend après le match (le score est déjà au mur).

## Les fichiers

| | |
|---|---|
| `packages/core/lib/src/match_direct.dart` | le catalogue, le script, la trace (pur) |
| `packages/core/lib/src/world.dart` | `resolveBlock(dernier:)`, `postureModDe` |
| `packages/core/lib/src/engine.dart` | `samediDirect`, `choose(…, direct:)` |
| `packages/core/lib/src/state.dart` | `GameState.direct` |
| `packages/tools/web/preview.dart` | `fusibleChoose(droite, direct?)`, `fusibleDirect(droite)` |
| `packages/tools/web/ville_direct.js` | la mise en scène, la carte de décision, l'anneau |
| `packages/tools/web/preview_direct.js` | `FusibleCoquille.choisirDirect` / `presenterDirect` |
| `content/ville/match_direct.yaml` | les décisions |
| `packages/tools/bin/src/match_direct_build.dart` | leur validation (appelée par `build_content`) |
| `packages/core/test/samedi_direct_test.dart` | les quatre preuves (sans décision, même décision, sens, tirages) |
