import React, { useState } from 'react';
import { Morpion } from './morpion';

function createEmptyGrid(size: number) {
  return Array.from({ length: size }, () => Array<string | null>(size).fill(null));
}

export default function App() {
  const [size, setSize] = useState<number>(4);
  const [game, setGame] = useState(new Morpion(size));
  const [grid, setGrid] = useState(createEmptyGrid(size));
  const [message, setMessage] = useState('');

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    setSize(newSize);
    const newGame = new Morpion(newSize);
    setGame(newGame);
    setGrid(createEmptyGrid(newSize));
    setMessage('');
  };

  const handleCellClick = (row: number, col: number) => {
    if (game.winner || game.isDraw) return;
    if (game.grid[row][col]) return;
    game.play(row, col);
    setGrid(game.grid.map((r: (string | null)[]) => [...r]));
    if (game.winner) setMessage(`Le joueur ${game.winner} a gagné !`);
    else if (game.isDraw) setMessage('Match nul !');
    else if (game.currentPlayer === 'O') {
      // L'IA joue immédiatement après le joueur humain
      setTimeout(() => {
        game.playAI();
        setGrid(game.grid.map((r: (string | null)[]) => [...r]));
        if (game.winner) setMessage(`Le joueur ${game.winner} a gagné !`);
        else if (game.isDraw) setMessage('Match nul !');
        else setMessage('');
        setGame(Object.assign(Object.create(Object.getPrototypeOf(game)), game));
      }, 200);
    }
    else setMessage('');
    setGame(Object.assign(Object.create(Object.getPrototypeOf(game)), game));
  };

  const handleReset = () => {
    const newGame = new Morpion(size);
    setGame(newGame);
    setGrid(createEmptyGrid(size));
    setMessage('');
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Morpion</h1>
      <label>
        Taille de la grille :
        <select value={size} onChange={handleSizeChange}>
          <option value={3}>3 x 3</option>
          <option value={4}>4 x 4</option>
          <option value={7}>7 x 7</option>
        </select>
      </label>
      <div style={{ margin: 20 }}>
        {grid.map((row, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
            {row.map((cell, j) => (
              <button
                key={j}
                onClick={() => handleCellClick(i, j)}
                className={cell === 'X' ? 'x' : cell === 'O' ? 'o' : 'o'}
                style={{
                  width: 50,
                  height: 50,
                  fontSize: 24,
                  margin: 2,
                  background: cell === 'X' ? 'lightgreen' : cell === 'O' ? 'lightcoral' : '#fff',
                  cursor: cell || game.winner ? 'not-allowed' : 'pointer'
                }}
              >
                {cell}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div>
        {message || `Joueur courant : ${game.currentPlayer}`}
      </div>
      <button onClick={handleReset} style={{ marginTop: 20 }}>
        Nouvelle partie
      </button>
    </div>
  );
}