# Baseline d'équilibrage — HEAD `85fb069` (avant le metteur en scène)

Mesure de référence figée avant l'introduction de la couche narrative, sur le
bundle où le bug des magnitudes est corrigé (deltas -18/-10/-5/+5/+10/+18).
`dart run packages/tools/bin/simulate.dart` (5 000 runs par politique, durée en
beats = `s.turn`, toutes cartes confondues).

| Politique | Médiane | p95 | Max | Saisons moy. | Transitions | Causes de fin (top) |
|---|---|---|---|---|---|---|
| human_like | 100 | 345 | 814 | 3,3 | 494 | en_sms 37 % · jp_place14b 16 % · en_otage 14 % · jp_sandwich 6 % · jp_fils 5 % · grand_deballage 5 % |
| balancer | 168 | 1 128 | 5 001 | 8,3 | 0 | en_sms 34 % · jp_place14b 15 % · jubile 14 % · grand_deballage 10 % · en_otage 9 % · jp_fils 5 % |
| random | 38 | 104 | 211 | 0,8 | 270 | en_otage 22 % · en_sms 22 % · jp_sandwich 14 % · jp_place14b 14 % · jp_panama 7 % · jp_siffle 5 % |
| left_only | 39 | 93 | 220 | 0,8 | 0 | en_otage 32 % · jp_panama 15 % · jp_porteparole 10 % · jp_place14b 10 % · en_placard 9 % · jp_sandwich 9 % |

Budgets (`--assert`, politique human_like) : médiane dans [20, 320] ✔, run max
≤ 1 500 ✔, cause dominante ≤ 55 % ✔ (37 %).

Protocole (spec narrative §5.4) : (1) cette baseline ; (2) metteur en scène +
contenu existant seul ; (3) contenu du postulat 0 avec `--narrative`. L'écart
attribuable au director sur la médiane human_like est attendu entre −15 % et
+15 % ; au-delà, retuner `balance.yaml` avant de toucher aux fenêtres.
