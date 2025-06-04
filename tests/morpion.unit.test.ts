import { Morpion } from '../src/morpion';

describe('Morpion - Unitaire', () => {
  it('doit initialiser une grille vide', () => {
    const game = new Morpion(3);
    expect(game.grid.flat().every(cell => cell === null)).toBe(true);
  });

  it('doit alterner les joueurs', () => {
    const game = new Morpion(3);
    game.play(0, 0);
    expect(game.currentPlayer).toBe('O');
    game.play(1, 1);
    expect(game.currentPlayer).toBe('X');
  });

  it('doit détecter la victoire', () => {
    const game = new Morpion(3);
    game.play(0, 0); // X
    game.play(1, 0); // O
    game.play(0, 1); // X
    game.play(1, 1); // O
    game.play(0, 2); // X gagne
    expect(game.winner).toBe('X');
  });

  it('doit empêcher de jouer sur une case occupée', () => {
    const game = new Morpion(3);
    game.play(0, 0);
    expect(game.play(0, 0)).toBe(false);
  });
});