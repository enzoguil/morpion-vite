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

        // Coup aléatoire si grille vide
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

        let bestScore = -Infinity;
        let bestMove: [number, number] | null = null;
        const maxDepth = this.profondeur;

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (!this.grid[i][j]) {
                    this.grid[i][j] = 'O';
                    const score = this.minimax(1, false, maxDepth, -Infinity, Infinity);
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

        // Fallback
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (!this.grid[i][j]) {
                    return this.play(i, j);
                }
            }
        }
        return false;
    }

    private minimax(depth: number, isMaximizing: boolean, maxDepth: number, alpha: number, beta: number): number {
        if (this.checkAnyWin('O')) return 100 - depth;
        if (this.checkAnyWin('X')) return depth - 100;
        if (this.grid.flat().every(cell => cell !== null)) return 0;
        if (depth >= maxDepth) return this.heuristicScore();

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    if (!this.grid[i][j]) {
                        this.grid[i][j] = 'O';
                        const evalScore = this.minimax(depth + 1, false, maxDepth, alpha, beta);
                        this.grid[i][j] = null;
                        maxEval = Math.max(maxEval, evalScore);
                        alpha = Math.max(alpha, evalScore);
                        if (beta <= alpha) break;
                    }
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    if (!this.grid[i][j]) {
                        this.grid[i][j] = 'X';
                        const evalScore = this.minimax(depth + 1, true, maxDepth, alpha, beta);
                        this.grid[i][j] = null;
                        minEval = Math.min(minEval, evalScore);
                        beta = Math.min(beta, evalScore);
                        if (beta <= alpha) break;
                    }
                }
            }
            return minEval;
        }
    }

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

    private heuristicScore(): number {
        // Score pour O (IA) et X (joueur)
        const scoreAlign = (player: Player) => {
            let score = 0;
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    if (this.grid[i][j] === null) {
                        // Simule le coup
                        this.grid[i][j] = player;
                        if (this.checkWinCustom(i, j, player)) {
                            score += 100;
                        } else {
                            // Bonus pour 2 alignés ouverts
                            score += this.countOpenTwo(player, i, j) * 10;
                        }
                        this.grid[i][j] = null;
                    }
                }
            }
            return score;
        };
        return scoreAlign('O') - scoreAlign('X');
    }

    // Ajoute cette méthode à ta classe Morpion
    private countOpenTwo(player: Player, row: number, col: number): number {
        // Compte les alignements de 2 ouverts (pour anticiper les menaces)
        const n = this.size;
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1],
        ];
        let count = 0;
        for (const [dx, dy] of directions) {
            let c = 1;
            let x1 = row + dx, y1 = col + dy;
            let x2 = row - dx, y2 = col - dy;
            if (
                x1 >= 0 && x1 < n && y1 >= 0 && y1 < n && this.grid[x1][y1] === player &&
                x2 >= 0 && x2 < n && y2 >= 0 && y2 < n && this.grid[x2][y2] === player
            ) {
                c += 2;
            } else {
                if (x1 >= 0 && x1 < n && y1 >= 0 && y1 < n && this.grid[x1][y1] === player) c++;
                if (x2 >= 0 && x2 < n && y2 >= 0 && y2 < n && this.grid[x2][y2] === player) c++;
            }
            if (c === 2) count++;
        }
        return count;
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