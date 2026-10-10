# Étape 5 — les événements sombres et la réécriture en feuilleton

Ce que la charte d'écriture (`docs/bible/charte_histoire.md`) a changé dans la
mécanique, et ce que ça coûte aux budgets. Mesures : `simulate --narrative
--postulat p` (2 000 carrières par postulat), avant (16ceec9) et après.

## Ce qui a bougé dans le moteur

- `events_max` 1 → 2 par saison, et `events_ecart: 5` : jamais deux événements à
  moins de cinq cartes, compté à la carte **servie** (les étapes 2-3 et les fusées
  longues d'un événement comptent aussi).
- Un événement ne s'arme pas quand une étape d'intrigue arrive à échéance (dans la
  carte ou la suivante), ni sur le créneau d'une Nouvelle ou juste avant. Sans
  cette garde, la S1 du promu passait de 36 % à 48 % d'étapes échues.
- 31 arcs `kind: evenement` (19 côté entraîneur, 12 côté joueur), tous `tone:
  strategique` sauf une minute de silence en `drame`. Les événements de
  l'entraîneur qui ont un jumeau côté joueur (laverie, devant chez toi, voiture,
  lettre, car, bagarre) ne se rejouent pas après une transition joueur → entraîneur.

## Avant / après (S1, la saison où les événements commencent vraiment)

| Postulat | Événements / saison | Étapes échues | Nouvelles 3-4 | Ton léger |
|---|---|---|---|---|
| promu (0) | 0,54 → 0,73 | 36 % → 35 % | 97 % → 98 % | 51 % → 50 % |
| intérimaire (1) | 0,48 → 0,62 | 31 % → 29 % | 99 % → 99 % | 60 % → 59 % |
| pépite (2) | 0,95 → 1,17 | 11 % → 11 % | 100 % → 100 % | 54 % → 53 % |
| fin de contrat (3) | 0,86 → 1,04 | 17 % → 18 % | 99 % → 97 % | 51 % → 49 % |

Budgets hors cible, tous postulats confondus : 38 avant ; 35 après à règles égales, 30 avec le
nouveau plancher du ton (ci-dessous).

## Ce qui reste hors cible et pourquoi

- **Le ton** : le léger descend à 47-50 % dans quelques blocs. C'est voulu (des
  saisons plus sombres, deux événements `strategique` au plus) ; le plancher du
  budget passe de 50 % à 45 % (`simulate.dart`), le plafond reste à 65 %.
- **L'exposition** à cent carrières : 85-89 % pour un seuil de 90 % — il y a 87
  cartes de plus à voir.
- Trois écarts marginaux, nés du déplacement des tirages : l'entropie d'histoire
  de l'intérimaire en S0 (0,89 pour 0,90), l'issue « ancienne » de l'intrigue
  Ilyas (8 % pour 10 %), la couverture de `brassard_20` en fin de contrat (9 % pour
  10 %).
- Les budgets déjà hors cible avant (`step4_variete.md`) le restent : la
  récurrence du président, l'exposition à dix carrières, les annulations.
