# Équilibrage — étape 3 : la bible du promu

Après la bible complète du postulat 0 « Le promu sans un sou » (7 arcs
entraîneur, Camille, paliers de relation, Nouvelles datées) : 336 cartes
(212 dans le sac), 12 arcs, 21 fins, hash `ed6a250c`.

## Réglages retenus

| Réglage | Avant | Après | Pourquoi |
|---|---|---|---|
| `force` du promu | 46 | 52 | à 46, médiane 52 cartes / 1,8 saison : le joueur ne voyait presque jamais S1 (Clow, banderoles, pacte). |
| Fin `en_retraite` (entraîneur, 65 ans) | — | ajoutée, dorée | sans retraite l'entraîneur était immortel (max 1902 cartes, > budget 1500). |

Expérience `force` (600 runs, politique human_like, postulat 0) :

| force | médiane | p95 | saisons moy | en_sms | en_banderole |
|---|---|---|---|---|---|
| 46 | 52 | 246 | 1,8 | 60 % | 26 % |
| 50 | 66 | 338 | 2,4 | 57 % | 25 % |
| **52** | **66** | **344** | **2,7** | **56 %** | **20 %** |
| 54 | 74 | 354 | 2,8 | 61 % | 18 % |
| 58 | 83 | 424 | 3,9 | 58 % | 13 % |

52 place la médiane dans la bande spec [60, 200] tout en gardant le promu
fragile (un run sur deux meurt en S1). Le SMS du président reste la mort
dominante à toutes les forces : c'est la jauge « direction » qui dérive, pas
le classement — à surveiller quand on écrira les verdicts de fin de saison.

## Budgets globaux (`simulate --runs 2000 --assert`, tous postulats)

| politique | médiane | p95 | max | saisons | fins dominantes |
|---|---|---|---|---|---|
| human_like | 148 | 474 | 1395 | 4,8 | en_sms 38 %, jp_fils 8 %, grand_deballage 8 % |
| balancer | 236 | 647 | 919 | 7,4 | en_sms 23 %, jubile 19 %, en_retraite 9 % |
| random | 50 | 150 | 338 | 1,3 | en_sms 24 %, en_otage 22 % |
| left_only | 51 | 127 | 270 | 1,2 | en_otage 38 % |

Aucun budget violé. Cartes jamais vues (2) : `en.clow.testament_ingrat`,
`en.evt.tribune_ferme` (toutes deux conditionnées à des états rares — voulu).

## Métriques narratives du promu (`--narrative --postulat 0 --runs 500`)

| | S0 | S1 | S2+ |
|---|---|---|---|
| cartes/saison | 16,8 | 13,6 | 15,7 |
| temps d'histoire/saison (médiane) | 14 | 12 | 4 |
| écart max entre temps d'histoire | 3 | 7 | 14 |
| isolement des cartes de routine | 0 % | 3 % | 50 % |
| visages distincts/saison | 8,1 | 7,1 | 8,8 |
| Nouvelles 3-4/saison | 58 % | 64 % | 84 % |

- **S0 tient la promesse** : une carte sur deux avance une histoire, aucun
  trou de plus de trois cartes, tout le casting revient (Aulard, Gégé,
  Vecchio, Josiane, Nassir, Meneche ≥ 98 % des saisons).
- **S1 est correct** mais la vague d'échéances des slots 1-6 (banderoles,
  pacte, Clow) crée un backlog de 3 et 41 % d'étapes servies en retard.
- **S2+ est vide** : les séries sont à usage unique par run, il ne reste que
  les événements et les alarmes. C'est le prochain chantier de contenu
  (arcs `every_season`, deuxième vague de séries, verdicts), pas un
  problème de moteur — la cadence forcée n'a simplement plus rien à ouvrir.

## Prochaines étapes d'équilibrage

1. Écrire la deuxième saison du promu (arcs rejouables, Clow en mentor
   récurrent, Camille au-delà du palier 1).
2. Étaler les échéances S1 (fenêtres `at` plus larges ou `deadline` +2).
3. Les Nouvelles : les créneaux réservés [7, 12, 14] sont trop souvent pris
   par un script ou une échéance ; envisager une dette reportée sur la saison
   suivante plutôt qu'un rattrapage immédiat.
