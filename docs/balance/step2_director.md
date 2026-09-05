# Étape 2 — metteur en scène + contenu existant seul (commit suivant `85fb069`)

Même bundle que la baseline, plus le director, l'arc de script générique
(2 ancres/saison), 8 alarmes par rôle et les 3 Nouvelles réservées. Aucune
bible de postulat encore. `simulate --runs 1000 --assert`.

| Politique | Médiane | p95 | Max | Saisons moy. | Δ médiane vs baseline |
|---|---|---|---|---|---|
| human_like | 133 | 439 | 1 459 | 4,0 | **+33 %** |
| balancer | 184 | 1 630 | 5 001 | 10,0 | +10 % |
| random | 44 | 134 | 236 | 1,0 | +16 % |
| left_only | 66 | 172 | 439 | 1,6 | +69 % |

Causes de fin human_like : en_sms 37 % · en_otage 16 % · jp_place14b 12 % ·
grand_deballage 9 % · jp_fils 8 % · jp_sandwich 5 %. Budgets globaux : ✔.

Lecture : les runs s'allongent parce que les alarmes garantissent une carte
de secours dans les 3 cartes après chaque franchissement de 20/80, et parce
que les Nouvelles réservées (sans effet) diluent la pression. L'écart dépasse
la bande ±15 % ; conformément au protocole (§5.4) on **ne retune pas avant
l'étape 3** : les étapes d'arcs de la bible (`++`/`+++`) sont attendues pour
ramener la médiane. Décision de retune prise sur le rapport d'étape 3.

À noter : `en.mercato.solde_hiver` jamais vue sur 1 000 runs (multiplicateur
mercato ×0,2 hors fenêtre + condition) — à revoir avec le contenu.

## Métriques narratives à l'étape 2 (`simulate --narrative --postulat 0 --runs 300`)

La photo « avant la bible », vue par le metteur en scène :

| Métrique | S0 | Budget (§5.2) |
|---|---|---|
| écart max entre temps d'histoire | 16 (les deux ancres du script générique) | ≤ 4 |
| temps d'histoire / saison | médiane 2 | ≥ 10 |
| tons léger / stratégique / drame | 90 / 10 / 0 % | 50-65 / 30-45 / ≤ 10 |
| Nouvelles / saison | 3-4 dans 97 % | ✔ |
| alarmes / saison | moy 0,7 · max 3 | ✔ |
| événements / saison | 0 | ≥ 0,2 dès S1 |
| isolement (routine sans lien) | 64 % | < 40 % |
| récurrence : Aulard ≥ 3 / Gégé ≥ 3 / Vecchio ≥ 3 | 10 % / 6 % / 0 % | ≥ 90 % |
| famine · cadence_pull / run | 0 · 0,99 | 0 · ≤ 0,3 |
| voix (paires même locuteur) | 5,8 % | ≤ 6 % ✔ |
| entropie (séquences S0 distinctes / 300) | 300 | ≥ 25 ✔ |

Les mécaniques tiennent (famine nulle, voix, respirations, alarmes servies avec
la bonne variante, échéances sans backlog) ; tout ce qui manque est du contenu :
les arcs, les événements, les paliers de relation et les cartes de Clow. C'est
précisément le périmètre de l'étape 3 (bible du postulat 0).
