# Fonctionnalité: Jouer au Morpion

## Scénario: Choix de la taille de la grille
Étant donné que je suis sur le menu de base  
Quand je choisis la taille de la grille  
Alors la grille s'affiche avec la taille choisie

## Scénario: Joueur place un symbole sur une case vide
Étant donné que la grille est affichée  
Quand le joueur clique sur une case vide  
Alors le symbole apparaît (X ou O) dans la case

## Scénario: Joueur place un symbole sur une case remplie
Étant donné que la grille est affichée  
Le joueur ne peut pas cliqué sur la case
La souris change de forme

## Scénario: Détection de victoire
Étant donné qu'un joueur a aligné 3 (ou 4) symboles sur une ligne, colonne ou diagonale  
Alors le jeu affiche le gagnant  
Et la partie se termine

## Scénario: Match nul
Étant donné que toutes les cases sont remplies  
Et qu'aucun joueur n'a gagné  
Alors le jeu affiche "Match nul"

## Scénario: Changement de joueur
Étant donné que c'est au tour du joueur X  
Quand il joue  
Alors c'est au tour du joueur O

## Scénario: Réinitialisation de la partie
Étant donné qu'une partie est terminée  
Quand je clique sur "Nouvelle partie"  
Alors la grille est vidée  
Et le score est remis à zéro  
Et le menu de choix de la grille s'affiche

## Scénario: Affichage du joueur courant
Étant donné qu'une partie est en cours  
Alors le nom ou le symbole du joueur courant est affiché à l'écran

## Scénario: Retour au menu principal
Étant donné qu'une partie est en cours  
Quand je clique sur "Menu principal"  
Alors la partie s'arrête  
Et le menu de base s'affiche