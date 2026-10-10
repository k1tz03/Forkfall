# Les livres pas encore fusionnés

Enregistrés le 10 octobre 2026, en fin de session. Les dix histoires s'écrivaient
en parallèle, chacune dans un worktree local ; le conteneur ne survit pas à la
session, alors ce qui n'était pas encore fusionné est sauvé ici, en patchs.
**Aucun de ces fichiers n'est lu par le build** : ce ne sont que des sauvegardes.

| Patch | Livre | État | Base (commit de cette branche) |
|---|---|---|---|
| `h7_en_cours.patch` | 7 (sélectionneur) | **en cours d'écriture**, instantané partiel | `f681cac` |
| `h9_en_cours.patch` | 9 (sélectionneur) | **en cours d'écriture**, instantané partiel | `f681cac` |
| `h10_en_cours.patch` | 10 (président) | **en cours d'écriture**, instantané partiel | `f681cac` |

Les livres 8, « L'Oreillette », et 4, « La Route de la Rive », ont été fusionnés
depuis (leurs patchs sont retirés). Les auteurs des livres 7, 9 et 10 ont été
arrêtés avec la session : leurs instantanés attendent qu'on les relance.
Le bundle généré (`app/assets/content.json`) n'est dans aucun patch. Les
instantanés en cours peuvent contenir des scripts jetables de leur auteur
(`packages/tools/bin/h7_lire_tmp.dart`, `_h10_lire.dart`, `_h10_stats.dart`) et,
pour le 7, une retouche locale de `build_content.dart` : à relire, pas à garder
telles quelles.

## Reprendre un livre

```bash
git checkout -b histoire-h8 f681cac
git apply --index docs/histoires/chantier/h8_l_oreillette.patch
git commit -m "Histoire 8 : L'Oreillette"
git checkout claude/football-reigns-mobile-game-qdkg5u
git merge --no-commit --no-ff histoire-h8
```

Un livre en cours se reprend de la même façon, puis s'écrit jusqu'au bout
(sa bible : `docs/histoires/00_les_dix_histoires.md`, la charte :
`docs/bible/charte_histoire.md`) avant d'être fusionné.

## Fusionner : la procédure qui a servi pour les livres 1, 2, 3, 5 et 6

1. **Les fichiers d'union** (`characters`, `portraits`, `flags`, `tags`) : le
   pilote `merge=union` de `.gitattributes` mélange les ajouts des deux côtés et
   produit des clés en double. On les reconstruit : la version de la branche,
   plus ce que le livre a ajouté en fin de fichier.
   `python3 docs/histoires/chantier/outils/union_ajouts.py histoire-h8 content/characters.yaml content/portraits.yaml content/flags.yaml content/tags.yaml`
2. **Les visages créés par deux livres** (Vallin, Vialat, Dembo, Malbec l'ont
   été) : la première fiche arrivée fait foi, la seconde s'en va.
   `python3 docs/histoires/chantier/outils/doublons.py`
   Vérifier avant que les deux fiches disent la même chose (âge de 1990, adresse
   dans les cinq rôles).
3. **Le programme du postulat** (`content/postulats.yaml`) : c'est celui du livre.
   Les sponsors louches qu'avait la branche passent après le livre
   (`season >= 3`), sauf ceux qui contrediraient le livre.
4. **Valider** : `build_content`, `lint` (0 erreur), `dart test`,
   `simulate --goldens --write` (relire le diff : en général seule la part
   « personnages » de l'empreinte bouge ; si moins de quinze codes portent une
   fin, `--recode`), une entrée au journal de `goldens_test.dart`, puis
   `simulate --runs 2000 --assert`. Le test J4 (performance) peut échouer quand
   la machine est chargée : il passe seul.

## Ce que les auteurs ont laissé ouvert (livres fusionnés et livre 8)

- **Tous** : les budgets génériques de diversité (`--narrative`) sont au rouge
  par construction. Un livre a des ancres fixes, pas un réservoir.
- **Livre 3** : la garde à vue de la départementale tombe à 12 % (peut-être
  trop) ; quelques variantes ne se voient qu'avec les missions de la ville.
- **Livre 5** : `pr_commission`, `pr_greve`, `ta_loge` et `grand_deballage` ne
  sont jamais atteintes. Le classement de juin de Madame Vialat ne sort pas, car
  la variante de Josiane, rangée avant elle, prend tout dès que l'Est a brûlé.
  Gégé, Josiane et Léa n'ont pas d'adresse de président : leur `{toi}` donne
  « président(e) ».
- **Livre 6** : les trois intrigues de la saison 2 s'ouvrent tard et la nuit du
  31 janvier les coupe ; leurs étapes 2 et 3 ne sortent jamais. Les fins de jauge
  du rôle ne sont jamais atteintes, puisque l'histoire se ferme en saison 2.
- **Livre 8** : 14 budgets hors cible, dont la diversité et les Nouvelles de la
  saison 3. Fins déséquilibrées : la voix 51 %, la clinique 24 %. Deux contenus
  ne s'atteignent que par les missions de la ville. Le lendemain de 23 h 58 et
  l'appel d'Inès sont des ancres aux créneaux 13 et 9.
