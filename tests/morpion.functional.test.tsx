import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';

describe('Morpion - Fonctionnel', () => {
  it('joueur gagne une partie', () => {
    render(<App />);
    const buttons = screen.getAllByRole('button');
    // Correction : vérifier que le nombre de boutons est suffisant
    expect(buttons.length).toBeGreaterThanOrEqual(9);

    fireEvent.click(buttons[0]); // X
    fireEvent.click(buttons[3]); // O
    fireEvent.click(buttons[1]); // X
    fireEvent.click(buttons[4]); // O
    fireEvent.click(buttons[2]); // X gagne

    // Correction : rendre la recherche du texte plus robuste
    expect(screen.getByText(/a\s+gagné/i)).toBeInTheDocument();
  });
});