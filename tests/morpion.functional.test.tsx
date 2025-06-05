import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';

describe('Morpion - Fonctionnel', () => {
  it('joueur gagne une partie', () => {
    const { container } = render(<App />);
    const buttons = container.getElementsByClassName('cell');
    expect(buttons.length).toBeGreaterThanOrEqual(9);

    fireEvent.click(buttons[0]); // X
    fireEvent.click(buttons[3]); // O
    fireEvent.click(buttons[1]); // X
    fireEvent.click(buttons[4]); // O
    fireEvent.click(buttons[2]); // X

    expect(screen.getByText(/a\s+gagné/i)).toBeInTheDocument();
  });

  it('empêche de jouer sur une case occupée', () => {
    const { container } = render(<App />);
    const buttons = container.getElementsByClassName('cell');
    fireEvent.click(buttons[0]); // X
    fireEvent.click(buttons[0]); // O
    expect(buttons[0]).toHaveTextContent('X');
  });

  it('reset la partie', () => {
    const { container } = render(<App />);
    const buttons = container.getElementsByClassName('cell');
    fireEvent.click(buttons[0]); // X
    fireEvent.click(buttons[1]); // O
    const resetButton = screen.getByText(/nouvelle/i);
    fireEvent.click(resetButton);
    Array.from(container.getElementsByClassName('cell')).forEach(btn => {
      expect(btn).toBeEmptyDOMElement();
    });
  });

  it('change la taille de la grille', () => {
    const { container } = render(<App />);
    const input = screen.getByLabelText(/taille/i);
    fireEvent.change(input, { target: { value: 5 } });
    expect(container.getElementsByClassName('cell').length).toBe(25);
  });

  it('affiche le joueur courant', () => {
    render(<App />);
    expect(screen.getByText(/joueur courant/i)).toBeInTheDocument();
  });

  it('change la profondeur de l\'IA', () => {
    render(<App />);
    const input = screen.getByLabelText(/profondeur/i);
    fireEvent.change(input, { target: { value: 5 } });
    expect((input as HTMLInputElement).value).toBe("5");
  });

  it('active et désactive le mode IA vs IA', () => {
    render(<App />);
    const iaVsIaCheckbox = screen.getByLabelText(/ia vs ia/i);
    fireEvent.click(iaVsIaCheckbox);
    expect(iaVsIaCheckbox).toBeChecked();
    const vsAICheckbox = screen.getByLabelText(/jouer contre l'ia/i);
    expect(vsAICheckbox).toBeDisabled();
    fireEvent.click(iaVsIaCheckbox);
    expect(vsAICheckbox).not.toBeDisabled();
  });

  it('empêche de jouer après une victoire', () => {
    const { container } = render(<App />);
    const buttons = container.getElementsByClassName('cell');
    fireEvent.click(buttons[0]); // X
    fireEvent.click(buttons[3]); // O
    fireEvent.click(buttons[1]); // X
    fireEvent.click(buttons[4]); // O
    fireEvent.click(buttons[2]); // X
    fireEvent.click(buttons[5]); // O
    expect(buttons[5]).toBeEmptyDOMElement();
  });
});