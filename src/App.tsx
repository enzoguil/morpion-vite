import React, { useState, useEffect } from 'react';
import { Morpion } from './morpion';

function createEmptyGrid(size: number) {
  return Array.from({ length: size }, () => Array<string | null>(size).fill(null));
}

const App = () => {
  const [size, setSize] = useState<number>(4);
  const [align, setAlign] = useState<number>(3);
  const [profondeur, setProfondeur] = useState<number>(3); // <-- profondeur IA
  const [game, setGame] = useState(new Morpion(size, align, 3));
  const [grid, setGrid] = useState(createEmptyGrid(size));
  const [message, setMessage] = useState('');
  const [vsAI, setVsAI] = useState(true);
  const [aiVsAi, setAiVsAi] = useState(false);

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = Math.max(3, Number(e.target.value));
    setSize(newSize);
    const newGame = new Morpion(newSize, align, profondeur);
    setGame(newGame);
    setGrid(createEmptyGrid(newSize));
    setMessage('');
  };

  const handleAlignChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAlign = Math.max(3, Number(e.target.value));
    setAlign(newAlign);
    const newGame = new Morpion(size, newAlign, profondeur);
    setGame(newGame);
    setGrid(createEmptyGrid(size));
    setMessage('');
  };

  const handleProfondeurChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProf = Math.min(10, Math.max(1, Number(e.target.value)));
    setProfondeur(newProf);
    const newGame = new Morpion(size, align, newProf);
    setGame(newGame);
    setGrid(createEmptyGrid(size));
    setMessage('');
  };

  const handleVsAICheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVsAI(e.target.checked);
    if (e.target.checked) setAiVsAi(false);
    const newGame = new Morpion(size, align, profondeur);
    setGame(newGame);
    setGrid(createEmptyGrid(size));
    setMessage('');
  };

  const handleAiVsAiCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAiVsAi(e.target.checked);
    if (e.target.checked) setVsAI(false);
    const newGame = new Morpion(size, align, profondeur);
    setGame(newGame);
    setGrid(createEmptyGrid(size));
    setMessage('');
  };

  // IA vs IA effect
  useEffect(() => {
    if (aiVsAi && !game.winner && !game.isDraw) {
      const timer = setTimeout(() => {
        game.playAI();
        setGrid(game.grid.map((r: (string | null)[]) => [...r]));
        if (game.winner) setMessage(`Le joueur ${game.winner} a gagné !`);
        else if (game.isDraw) setMessage('Match nul !');
        else setMessage('');
        setGame(Object.assign(Object.create(Object.getPrototypeOf(game)), game));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [aiVsAi, game, grid]);

  const handleCellClick = (row: number, col: number) => {
    if (game.winner || game.isDraw) return;
    if (game.grid[row][col]) return;
    game.play(row, col);
    setGrid(game.grid.map((r: (string | null)[]) => [...r]));
    if (game.winner) setMessage(`Le joueur ${game.winner} a gagné !`);
    else if (game.isDraw) setMessage('Match nul !');
    else if (vsAI && game.currentPlayer === 'O') {
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
    const newGame = new Morpion(size, align);
    setGame(newGame);
    setGrid(createEmptyGrid(size));
    setMessage('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <h1>Morpion</h1>
      <label>
        Taille de la grille :
        <input
          type="number"
          value={size}
          onChange={handleSizeChange}
          min={3}
          style={{ marginLeft: 10, width: 50 }}
        />
      </label>
      <label>
        Alignement pour gagner :
        <input
          type="number"
          value={align}
          onChange={handleAlignChange}
          min={3}
          style={{ marginLeft: 10, width: 50 }}
        />
      </label>
      <label>
        Profondeur IA :
        <input
          type="number"
          value={profondeur}
          onChange={handleProfondeurChange}
          min={1}
          max={10}
          style={{ marginLeft: 10, width: 50 }}
        />
      </label>
      <div style={{ margin: 10 }}>
        <label>
          <input
            type="checkbox"
            checked={vsAI}
            onChange={handleVsAICheck}
            style={{ marginRight: 8 }}
            disabled={aiVsAi}
          />
          Jouer contre l'IA
        </label>
        <label style={{ marginLeft: 20 }}>
          <input
            type="checkbox"
            checked={aiVsAi}
            onChange={handleAiVsAiCheck}
            style={{ marginRight: 8 }}
            disabled={vsAI}
          />
          IA vs IA
        </label>
      </div>
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

export default App;