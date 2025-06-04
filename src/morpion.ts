export type Player = 'X' | 'O';
export type Cell = Player | null;

export class Morpion {
    grid: Cell[][];
    size: number;
    currentPlayer: Player;
    winner: Player | null;
    isDraw: boolean;
    toAlign: number;
    profondeur: number;

    constructor(size: number = 3, toAlign: number = 3, profondeur: number = 3) {
        this.size = size;
        this.profondeur = profondeur;
        if (size < 3 || toAlign < 3 || toAlign > size) {
            size = 3;
            toAlign = 3;
        }
        this.grid = Array.from({ length: size }, () => Array<Cell>(size).fill(null));
        this.currentPlayer = 'X';
        this.winner = null;
        this.isDraw = false;
        this.toAlign = toAlign;
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
            if (count >= this.toAlign) return true;
        }
        return false;
    }

    playAI(): boolean {
        if (this.winner || this.isDraw) return false;

        if (this.grid.flat().every(cell => cell === null)) {
            const empty: [number, number][] = [];
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    empty.push([i, j]);
                }
            }
            const [row, col] = empty[Math.floor(Math.random() * empty.length)];
            return this.play(row, col);
        }

        // 1. Blocage prioritaire
        let blockMove = this.findWinningMove('X');
        if (blockMove) return this.play(blockMove[0], blockMove[1]);

        let blockThreatMove = this.findThreatMove('X', this.profondeur);
        if (blockThreatMove) return this.play(blockThreatMove[0], blockThreatMove[1]);

        // 2. Si l'IA peut gagner immédiatement
        let winMove = this.findWinningMove('O');
        if (winMove) return this.play(winMove[0], winMove[1]);

        let prepareWinMove = this.findThreatMove('O', this.profondeur);
        if (prepareWinMove) return this.play(prepareWinMove[0], prepareWinMove[1]);

        // 3. Sinon, joue le coup qui maximise ses chances (évaluation simple)
        let bestScore = -Infinity;
        let bestMove: [number, number] | null = null;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (!this.grid[i][j]) {
                    this.grid[i][j] = 'O';
                    const score = this.evaluatePotential('O', i, j);
                    this.grid[i][j] = null;
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = [i, j];
                    }
                }
            }
        }
        if (bestMove) {
            return this.play(bestMove[0], bestMove[1]);
        }

        // 4. Sinon, joue le premier coup libre
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (!this.grid[i][j]) {
                    return this.play(i, j);
                }
            }
        }
        return false;
    }

    // Ajoute cette méthode à ta classe Morpion
    private evaluatePotential(player: Player, row: number, col: number): number {
        // Évalue le nombre de cases alignées autour de (row, col) pour le joueur
        const n = this.size;
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1],
        ];
        let score = 0;
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
            score = Math.max(score, count);
        }
        return score;
    }

    private findWinningMove(player: Player): [number, number] | null {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (!this.grid[i][j]) {
                    this.grid[i][j] = player;
                    const win = this.checkWinCustom(i, j, player);
                    this.grid[i][j] = null;
                    if (win) return [i, j];
                }
            }
        }
        return null;
    }

    private findThreatMove(player: Player, maxDepth: number): [number, number] | null {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (!this.grid[i][j]) {
                    this.grid[i][j] = player;
                    const canWin = this.canWinInDepth(player, maxDepth - 1);
                    this.grid[i][j] = null;
                    if (canWin) return [i, j];
                }
            }
        }
        return null;
    }

    private canWinInDepth(player: Player, depth: number): boolean {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === null) {
                    this.grid[i][j] = player;
                    if (this.checkWinCustom(i, j, player)) {
                        this.grid[i][j] = null;
                        return true;
                    }
                    if (depth > 0) {
                        const opponent: Player = player === 'X' ? 'O' : 'X';
                        let opponentCanBlock = false;
                        for (let k = 0; k < this.size; k++) {
                            for (let l = 0; l < this.size; l++) {
                                if (this.grid[k][l] === null) {
                                    this.grid[k][l] = opponent;
                                    if (!this.canWinInDepth(player, depth - 1)) {
                                        opponentCanBlock = true;
                                    }
                                    this.grid[k][l] = null;
                                    if (opponentCanBlock) break;
                                }
                            }
                            if (opponentCanBlock) break;
                        }
                        if (!opponentCanBlock) {
                            this.grid[i][j] = null;
                            return true;
                        }
                    }
                    this.grid[i][j] = null;
                }
            }
        }
        return false;
    }

    private checkWinCustom(row: number, col: number, player: Player): boolean {
        const n = this.size;
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
            if (count >= this.toAlign) return true;
        }
        return false;
    }
}