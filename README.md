# Morpion Vite

Un projet de morpion en React + TypeScript, avec une IA configurable (profondeur, taille de grille, alignement pour gagner) et plusieurs modes de jeu.

## Fonctionnalités

- **Grille paramétrable** : choisissez la taille (3x3, 5x5, etc.)
- **Alignement configurable** : nombre de symboles à aligner pour gagner
- **Profondeur IA** : nombre de coups anticipés par l’IA (1 à 10)
- **Modes de jeu** :
  - Joueur vs Joueur
  - Joueur vs IA (l’IA joue toujours 'O')
  - IA vs IA (simulation automatique)
- **Détection de victoire, match nul, et blocage des coups invalides**
- **Interface responsive et centrée**

## Installation

```bash
npm install
```

## Lancer le projet

```bash
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur.

## Lancer les tests

```bash
npm test
```

- **Tests unitaires** : `tests/morpion.unit.test.ts`
- **Tests fonctionnels** : `tests/morpion.functional.test.tsx`

```bash
npm test:e2e
```

- **Tests end to end** : `e2e/morpion.e2e.spec.ts`

## Structure du projet

- `src/App.tsx` : composant principal React, interface et logique de jeu
- `src/morpion.ts` : logique du jeu et de l’IA (minimax, heuristique, etc.)
- `tests/` : tests unitaires et fonctionnels
- `e2e/` : tests end to end

## Personnalisation

- **Taille de la grille** : modifiez le champ "Taille de la grille"
- **Alignement pour gagner** : modifiez le champ "Alignement pour gagner"
- **Profondeur IA** : modifiez le champ "Profondeur IA" (plus la valeur est grande, plus l’IA est forte mais lente)
- **Mode de jeu** : cochez "Jouer contre l'IA" ou "IA vs IA"

---

**Bon jeu !**