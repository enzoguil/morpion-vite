export type Player = 'X' | 'O';
export type Cell = Player | null;

export class Morpion {
    grid: Cell[][];
    size: number;
    currentPlayer: Player;
    winner: Player | null;
    isDraw: boolean;

    constructor(size: number = 3) {
        this.size = size;
        this.grid = Array.from({ length: size }, () => Array<Cell>(size).fill(null));
        this.currentPlayer = 'X';
        this.winner = null;
        this.isDraw = false;
    }

    play(row: number, col: number): boolean {
        if (this.grid[row][col] || this.winner) return false;
        this.grid[row][col] = this.currentPlayer;
        if (this.checkWin(row, col)) {
            this.winner = this.currentPlayer;
        } else if (this.grid.flat().every(cell => cell)) {
            this.isDraw = true;
        } else {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        }
        return true;
    }

    checkWin(row: number, col: number): boolean {
        const n = this.size;
        const p = this.currentPlayer;
        const toAlign = n === 7 ? 5 : 3;

        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1],
        ];

        for (const [dx, dy] of directions) {
            let count = 1;
            let x = row + dx, y = col + dy;
            while (x >= 0 && x < n && y >= 0 && y < n && this.grid[x][y] === p) {
                count++;
                x += dx;
                y += dy;
            }
            x = row - dx;
            y = col - dy;
            while (x >= 0 && x < n && y >= 0 && y < n && this.grid[x][y] === p) {
                count++;
                x -= dx;
                y -= dy;
            }
            if (count >= toAlign) return true;
        }
        return false;
    }

    playAI(): boolean {
        if (this.winner || this.isDraw) return false;
        let bestScore = -Infinity;
        let move: [number, number] | null = null;

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (!this.grid[i][j]) {
                    this.grid[i][j] = this.currentPlayer;
                    let score = this.minimax(1, false);
                    this.grid[i][j] = null;
                    if (score > bestScore) {
                        bestScore = score;
                        move = [i, j];
                    }
                }
            }
        }
        if (move) {
            return this.play(move[0], move[1]);
        }
        return false;
    }

    private minimax(depth: number, isMaximizing: boolean): number {
        // Évalue l'état actuel
        if (this.checkAnyWin('O')) return 10 - depth;
        if (this.checkAnyWin('X')) return depth - 10;
        if (this.grid.flat().every(cell => cell)) return 0; // match nul

        if (depth >= 2) return 0; // Limite la profondeur à 2 coups

        let bestScore = isMaximizing ? -Infinity : Infinity;
        const player: Player = isMaximizing ? this.currentPlayer : (this.currentPlayer === 'X' ? 'O' : 'X');

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (!this.grid[i][j]) {
                    this.grid[i][j] = player;
                    let score = this.minimax(depth + 1, !isMaximizing);
                    this.grid[i][j] = null;
                    if (isMaximizing) {
                        bestScore = Math.max(score, bestScore);
                    } else {
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
        }
        return bestScore;
    }

    // Vérifie la victoire pour un joueur donné (sans changer le joueur courant)
    private checkAnyWin(player: Player): boolean {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === player && this.checkWinCustom(i, j, player)) {
                    return true;
                }
            }
        }
        return false;
    }

    // Version custom de checkWin pour un joueur donné
    private checkWinCustom(row: number, col: number, player: Player): boolean {
        const n = this.size;
        const toAlign = n === 7 ? 5 : 3;
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1],
        ];
        for (const [dx, dy] of directions) {
            let count = 1;
            let x = row + dx, y = col + dy;
            while (x >= 0 && x < n && y >= 0 && y < n && this.grid[x][y] === player) {
                count++;
                x += dx;
                y += dy;
            }
            x = row - dx;
            y = col - dy;
            while (x >= 0 && x < n && y >= 0 && y < n && this.grid[x][y] === player) {
                count++;
                x -= dx;
                y -= dy;
            }
            if (count >= toAlign) return true;
        }
        return false;
    }
}