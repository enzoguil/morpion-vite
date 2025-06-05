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

  it('doit détecter un match nul', () => {
    const game = new Morpion(3);
    game.play(0, 0); // X
    game.play(0, 1); // O
    game.play(1, 0); // X    X O
    game.play(1, 1); // O    X O
    game.play(2, 1); // X
    game.play(2, 0); // O
    game.play(0, 2); // X
    game.play(1, 2); // O
    game.play(2, 2); // X - Match nul
    expect(game.isDraw).toBe(true);
  });

  it('ne doit pas permettre de jouer après une victoire', () => {
    const game = new Morpion(3);
    game.play(0, 0); // X
    game.play(1, 0); // O
    game.play(0, 1); // X
    game.play(1, 1); // O
    game.play(0, 2); // X gagne
    expect(game.play(2, 2)).toBe(false);
  });

  it('doit détecter la victoire en colonne', () => {
    const game = new Morpion(3);
    game.play(0, 0); // X
    game.play(0, 1); // O
    game.play(1, 0); // X
    game.play(1, 1); // O
    game.play(2, 0); // X gagne
    expect(game.winner).toBe('X');
  });

  it('doit détecter la victoire en diagonale', () => {
    const game = new Morpion(3);
    game.play(0, 0); // X
    game.play(0, 1); // O
    game.play(1, 1); // X
    game.play(0, 2); // O
    game.play(2, 2); // X gagne
    expect(game.winner).toBe('X');
  });

  it('doit détecter la victoire en anti-diagonale', () => {
    const game = new Morpion(3);
    game.play(0, 2); // X
    game.play(0, 1); // O
    game.play(1, 1); // X
    game.play(1, 0); // O
    game.play(2, 0); // X
    game.play(2, 2); // O
    game.play(2, 1); // X gagne
    expect(game.winner).toBe('X');
  });

  it('doit permettre à l\'IA de jouer un coup valide', () => {
    const game = new Morpion(3);
    expect(game.playAI()).toBe(true);
    // Il doit y avoir un seul coup joué
    expect(game.grid.flat().filter(cell => cell !== null).length).toBe(1);
  });

  it('doit empêcher l\'IA de jouer si la partie est finie', () => {
    const game = new Morpion(3);
    game.play(0, 0); // X
    game.play(1, 0); // O
    game.play(0, 1); // X
    game.play(1, 1); // O
    game.play(0, 2); // X gagne
    expect(game.playAI()).toBe(false);
  });

  it('doit détecter la victoire sur une grille 4x4 avec alignement 4', () => {
    const game = new Morpion(4, 4);
    game.play(0, 0); // X
    game.play(1, 0); // O
    game.play(0, 1); // X
    game.play(1, 1); // O
    game.play(0, 2); // X
    game.play(1, 2); // O
    game.play(0, 3); // X gagne
    expect(game.winner).toBe('X');
  });

  it('doit alterner les joueurs même sur une grande grille', () => {
    const game = new Morpion(5);
    game.play(0, 0);
    expect(game.currentPlayer).toBe('O');
    game.play(1, 1);
    expect(game.currentPlayer).toBe('X');
  });

  it('doit détecter la victoire verticale sur une grande grille', () => {
    const game = new Morpion(5, 4);
    game.play(0, 0); // X
    game.play(0, 1); // O
    game.play(1, 0); // X
    game.play(1, 1); // O
    game.play(2, 0); // X
    game.play(2, 1); // O
    game.play(3, 0); // X gagne
    expect(game.winner).toBe('X');
  });

  it('doit détecter la victoire horizontale sur une grande grille', () => {
    const game = new Morpion(5, 4);
    game.play(0, 0); // X
    game.play(1, 0); // O
    game.play(0, 1); // X
    game.play(1, 1); // O
    game.play(0, 2); // X
    game.play(1, 2); // O
    game.play(0, 3); // X gagne
    expect(game.winner).toBe('X');
  });

  it('doit détecter la victoire diagonale sur une grande grille', () => {
    const game = new Morpion(5, 4);
    game.play(0, 0); // X
    game.play(0, 1); // O
    game.play(1, 1); // X
    game.play(0, 2); // O
    game.play(2, 2); // X
    game.play(0, 3); // O
    game.play(3, 3); // X gagne
    expect(game.winner).toBe('X');
  });

  it('doit détecter la victoire anti-diagonale sur une grande grille', () => {
    const game = new Morpion(5, 4);
    game.play(0, 3); // X
    game.play(0, 2); // O
    game.play(1, 2); // X
    game.play(0, 1); // O
    game.play(2, 1); // X
    game.play(0, 0); // O
    game.play(3, 0); // X gagne
    expect(game.winner).toBe('X');
  });

  it('ne doit pas déclarer de gagnant si alignement insuffisant', () => {
    const game = new Morpion(5, 4);
    game.play(0, 0); // X
    game.play(1, 0); // O
    game.play(0, 1); // X
    game.play(1, 1); // O
    game.play(0, 2); // X
    expect(game.winner).toBe(null);
  });

  // it('doit retourner false si on joue sur une case hors grille', () => {
  //   const game = new Morpion(3);
  //   expect(game.play(-1, -1)).toBe(false);
  //   expect(game.play(3, 3)).toBe(false);
  // });

  it('doit retourner false si on joue après un match nul', () => {
    const game = new Morpion(3);
    game.play(0, 0); // X
    game.play(0, 1); // O
    game.play(1, 0); // X
    game.play(1, 1); // O
    game.play(2, 1); // X
    game.play(2, 0); // O
    game.play(0, 2); // X
    game.play(1, 2); // O
    game.play(2, 2); // X - Match nul
    expect(game.play(2, 2)).toBe(false);
  });

  it('doit permettre à l\'IA de bloquer une victoire adverse', () => {
    const game = new Morpion(3);
    game.play(0, 0); // X
    game.play(1, 1); // O
    game.play(0, 1); // X
    // O doit bloquer (0,2)
    game.playAI();
    expect(game.grid[0][2]).toBe('O');
  });

  it('doit permettre à l\'IA de gagner si possible', () => {
    const game = new Morpion(3);
    game.play(1, 1); // X
    game.play(0, 0); // O
    game.play(2, 2); // X
    game.play(0, 1); // O
    game.play(1, 2); // X
    // O doit gagner en jouant (0,2)
    game.playAI();
    expect(game.grid[0][2]).toBe('O');
    expect(game.winner).toBe('O');
  });

  it('doit détecter la victoire même si la grille est grande et alignement petit', () => {
    const game = new Morpion(7, 3);
    game.play(0, 0); // X
    game.play(1, 0); // O
    game.play(0, 1); // X
    game.play(1, 1); // O
    game.play(0, 2); // X gagne
    expect(game.winner).toBe('X');
  });

  it('doit détecter la victoire même si la grille est grande et alignement grand', () => {
    const game = new Morpion(7, 5);
    game.play(0, 0); // X
    game.play(1, 0); // O
    game.play(0, 1); // X
    game.play(1, 1); // O
    game.play(0, 2); // X
    game.play(1, 2); // O
    game.play(0, 3); // X
    game.play(1, 3); // O
    game.play(0, 4); // X gagne
    expect(game.winner).toBe('X');
  });

  it('doit retourner false si on joue sur une case déjà prise même après plusieurs coups', () => {
    const game = new Morpion(3);
    game.play(0, 0);
    game.play(1, 1);
    expect(game.play(0, 0)).toBe(false);
  });

  it('doit retourner false si on joue alors que la partie est terminée', () => {
    const game = new Morpion(3);
    game.play(0, 0);
    game.play(1, 0);
    game.play(0, 1);
    game.play(1, 1);
    game.play(0, 2); // X gagne
    expect(game.play(2, 2)).toBe(false);
  });

  it('doit permettre à l\'IA de jouer même sur une grande grille', () => {
    const game = new Morpion(7, 4);
    expect(game.playAI()).toBe(true);
    expect(game.grid.flat().filter(cell => cell !== null).length).toBe(1);
  });

  it('doit permettre à l\'IA de jouer plusieurs fois sans planter', () => {
    const game = new Morpion(3);
    for (let i = 0; i < 9; i++) {
      game.playAI();
    }
    expect(game.isDraw || game.winner !== null).toBe(true);
  });
});