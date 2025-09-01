class CrossLineGame {
    constructor() {
        this.boardSize = 15;
        this.board = [];
        this.currentPlayer = 1; // 1 = black, -1 = white
        this.gameActive = false;
        this.gameMode = 'ai'; // 'ai' or 'human'
        this.difficulty = 'medium';
        this.turnCount = 1;
        this.gameStartTime = null;
        this.moveHistory = [];
        this.maxUndoMoves = 1;
        
        // 统计数据
        this.stats = this.loadStats();
        
        // AI搜索深度
        this.searchDepth = {
            easy: 2,
            medium: 4,
            hard: 6
        };
        
        this.init();
    }
    
    init() {
        this.initBoard();
        this.createBoardUI();
        this.updateDisplay();
        this.updateModeDisplay();
    }
    
    initBoard() {
        this.board = [];
        for (let i = 0; i < this.boardSize; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i][j] = 0;
            }
        }
    }
    
    createBoardUI() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'board-cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                
                // 标记星位点
                if (this.isStarPoint(i, j)) {
                    cell.classList.add('star-point');
                }
                
                cell.addEventListener('click', () => this.handleCellClick(i, j));
                gameBoard.appendChild(cell);
            }
        }
    }
    
    isStarPoint(row, col) {
        const starPoints = [
            [3, 3], [3, 7], [3, 11],
            [7, 3], [7, 7], [7, 11],
            [11, 3], [11, 7], [11, 11]
        ];
        return starPoints.some(([r, c]) => r === row && c === col);
    }
    
    setGameMode(mode) {
        if (this.gameActive) return;
        
        this.gameMode = mode;
        
        // 更新按钮状态
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick*="${mode}"]`).classList.add('active');
        
        this.updateModeDisplay();
    }
    
    setDifficulty(difficulty) {
        if (this.gameActive) return;
        
        this.difficulty = difficulty;
        
        // 更新按钮状态
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick*="${difficulty}"]`).classList.add('active');
    }
    
    updateModeDisplay() {
        const difficultySelector = document.getElementById('difficultySelector');
        difficultySelector.style.display = this.gameMode === 'ai' ? 'block' : 'none';
    }
    
    newGame() {
        this.gameActive = true;
        this.currentPlayer = 1;
        this.turnCount = 1;
        this.gameStartTime = Date.now();
        this.moveHistory = [];
        
        this.initBoard();
        this.createBoardUI();
        this.updateDisplay();
        
        // 更新按钮状态
        document.getElementById('undoBtn').disabled = true;
    }
    
    handleCellClick(row, col) {
        if (!this.gameActive || this.board[row][col] !== 0) {
            return;
        }
        
        // 人类玩家下棋
        if (this.gameMode === 'human' || this.currentPlayer === 1) {
            this.makeMove(row, col, this.currentPlayer);
        }
    }
    
    makeMove(row, col, player) {
        if (this.board[row][col] !== 0) return false;
        
        // 保存移动历史
        this.moveHistory.push({
            row: row,
            col: col,
            player: player,
            board: this.board.map(row => [...row])
        });
        
        // 下子
        this.board[row][col] = player;
        this.updateCellUI(row, col, player);
        
        // 检查获胜
        const winResult = this.checkWin(row, col, player);
        if (winResult.win) {
            this.gameActive = false;
            this.highlightWinningCells(winResult.cells);
            setTimeout(() => this.showVictory(player, winResult.type), 500);
            this.updateStats(player);
            return true;
        }
        
        // 检查平局
        if (this.isBoardFull()) {
            this.gameActive = false;
            setTimeout(() => this.showDraw(), 500);
            return true;
        }
        
        // 切换玩家
        this.currentPlayer = -this.currentPlayer;
        this.turnCount++;
        this.updateDisplay();
        
        // 更新悔棋按钮
        document.getElementById('undoBtn').disabled = this.moveHistory.length === 0;
        
        // AI下棋
        if (this.gameActive && this.gameMode === 'ai' && this.currentPlayer === -1) {
            setTimeout(() => this.makeAIMove(), 500);
        }
        
        return true;
    }
    
    makeAIMove() {
        const move = this.getBestMove();
        if (move) {
            this.makeMove(move.row, move.col, this.currentPlayer);
        }
    }
    
    getBestMove() {
        const depth = this.searchDepth[this.difficulty];
        
        // 简单难度：添加随机性
        if (this.difficulty === 'easy' && Math.random() < 0.3) {
            return this.getRandomMove();
        }
        
        // 使用Minimax算法
        const result = this.minimax(depth, -1, -Infinity, Infinity);
        return result.move;
    }
    
    minimax(depth, player, alpha, beta) {
        // 检查终端状态
        const winner = this.getWinner();
        if (winner !== 0) {
            return { score: winner * 1000, move: null };
        }
        
        if (depth === 0 || this.isBoardFull()) {
            return { score: this.evaluateBoard(), move: null };
        }
        
        let bestMove = null;
        let bestScore = player === -1 ? -Infinity : Infinity;
        
        const moves = this.getAllValidMoves();
        // 优先考虑中心区域
        moves.sort((a, b) => {
            const centerA = Math.abs(a.row - 7) + Math.abs(a.col - 7);
            const centerB = Math.abs(b.row - 7) + Math.abs(b.col - 7);
            return centerA - centerB;
        });
        
        for (const move of moves) {
            // 剪枝：只考虑有效区域的移动
            if (!this.isRelevantMove(move.row, move.col)) continue;
            
            this.board[move.row][move.col] = player;
            
            const result = this.minimax(depth - 1, -player, alpha, beta);
            
            this.board[move.row][move.col] = 0;
            
            if (player === -1) {
                if (result.score > bestScore) {
                    bestScore = result.score;
                    bestMove = move;
                }
                alpha = Math.max(alpha, result.score);
            } else {
                if (result.score < bestScore) {
                    bestScore = result.score;
                    bestMove = move;
                }
                beta = Math.min(beta, result.score);
            }
            
            if (beta <= alpha) break; // Alpha-beta剪枝
        }
        
        return { score: bestScore, move: bestMove };
    }
    
    isRelevantMove(row, col) {
        // 只考虑已有棋子周围2格范围内的位置
        for (let i = Math.max(0, row - 2); i <= Math.min(this.boardSize - 1, row + 2); i++) {
            for (let j = Math.max(0, col - 2); j <= Math.min(this.boardSize - 1, col + 2); j++) {
                if (this.board[i][j] !== 0) {
                    return true;
                }
            }
        }
        return false;
    }
    
    evaluateBoard() {
        let score = 0;
        
        // 评估所有位置的价值
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] !== 0) {
                    score += this.evaluatePosition(i, j, this.board[i][j]);
                }
            }
        }
        
        return score;
    }
    
    evaluatePosition(row, col, player) {
        let score = 0;
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1]
        ];
        
        for (const [dr, dc] of directions) {
            const line = this.getLine(row, col, dr, dc, 5);
            score += this.evaluateLine(line, player);
        }
        
        // 位置权重
        const centerDistance = Math.abs(row - 7) + Math.abs(col - 7);
        score += (14 - centerDistance) * player;
        
        return score;
    }
    
    evaluateLine(line, player) {
        let score = 0;
        let count = 0;
        let blocked = 0;
        
        for (const cell of line) {
            if (cell === player) {
                count++;
            } else if (cell === -player) {
                blocked++;
            }
        }
        
        if (blocked === 2) return 0; // 两端被堵
        
        // 评估分数
        const multiplier = blocked === 0 ? 2 : 1;
        
        switch (count) {
            case 5: return 100000 * player * multiplier;
            case 4: return 10000 * player * multiplier;
            case 3: return 1000 * player * multiplier;
            case 2: return 100 * player * multiplier;
            case 1: return 10 * player * multiplier;
            default: return 0;
        }
    }
    
    getRandomMove() {
        const moves = this.getAllValidMoves();
        return moves[Math.floor(Math.random() * moves.length)];
    }
    
    getAllValidMoves() {
        const moves = [];
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] === 0) {
                    moves.push({ row: i, col: j });
                }
            }
        }
        return moves;
    }
    
    checkWin(row, col, player) {
        // 检查十字连珠
        const crossWin = this.checkCrossWin(row, col, player);
        if (crossWin.win) return crossWin;
        
        // 检查传统五连
        const lineWin = this.checkLineWin(row, col, player);
        if (lineWin.win) return lineWin;
        
        return { win: false, cells: [], type: '' };
    }
    
    checkCrossWin(row, col, player) {
        // 检查以当前位置为中心的十字形
        const horizontal = this.getLine(row, col, 0, 1, 5);
        const vertical = this.getLine(row, col, 1, 0, 5);
        
        const hCount = this.countConsecutive(horizontal, player);
        const vCount = this.countConsecutive(vertical, player);
        
        // 十字连珠：一个方向5子，另一个方向至少3子
        if ((hCount >= 5 && vCount >= 3) || (vCount >= 5 && hCount >= 3)) {
            const cells = [];
            
            // 添加获胜的棋子位置
            if (hCount >= 5) {
                for (let c = Math.max(0, col - 2); c <= Math.min(this.boardSize - 1, col + 2); c++) {
                    if (this.board[row][c] === player) {
                        cells.push([row, c]);
                    }
                }
            }
            if (vCount >= 3) {
                for (let r = Math.max(0, row - 2); r <= Math.min(this.boardSize - 1, row + 2); r++) {
                    if (this.board[r][col] === player) {
                        cells.push([r, col]);
                    }
                }
            }
            
            return { 
                win: true, 
                cells: cells, 
                type: '十字连珠' 
            };
        }
        
        return { win: false, cells: [], type: '' };
    }
    
    checkLineWin(row, col, player) {
        const directions = [
            [0, 1],   // 横向
            [1, 0],   // 纵向
            [1, 1],   // 主对角线
            [1, -1]   // 副对角线
        ];
        
        for (const [dr, dc] of directions) {
            const line = this.getLine(row, col, dr, dc, 5);
            const count = this.countConsecutive(line, player);
            
            if (count >= 5) {
                const cells = [];
                
                // 找到连续的5个棋子
                let start = -1;
                for (let i = 0; i < line.length - 4; i++) {
                    let consecutive = 0;
                    for (let j = i; j < line.length && j < i + 5; j++) {
                        if (line[j] === player) {
                            consecutive++;
                        } else {
                            break;
                        }
                    }
                    if (consecutive >= 5) {
                        start = i;
                        break;
                    }
                }
                
                if (start !== -1) {
                    for (let i = 0; i < 5; i++) {
                        const r = row + (start + i - 2) * dr;
                        const c = col + (start + i - 2) * dc;
                        if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize) {
                            cells.push([r, c]);
                        }
                    }
                }
                
                return { 
                    win: true, 
                    cells: cells, 
                    type: '五子连珠' 
                };
            }
        }
        
        return { win: false, cells: [], type: '' };
    }
    
    getLine(row, col, dr, dc, length) {
        const line = [];
        const start = Math.floor(length / 2);
        
        for (let i = -start; i <= start; i++) {
            const r = row + i * dr;
            const c = col + i * dc;
            
            if (r >= 0 && r < this.boardSize && c >= 0 && c < this.boardSize) {
                line.push(this.board[r][c]);
            } else {
                line.push(null); // 边界外
            }
        }
        
        return line;
    }
    
    countConsecutive(line, player) {
        let maxCount = 0;
        let currentCount = 0;
        
        for (const cell of line) {
            if (cell === player) {
                currentCount++;
                maxCount = Math.max(maxCount, currentCount);
            } else {
                currentCount = 0;
            }
        }
        
        return maxCount;
    }
    
    getWinner() {
        // 快速检查是否有获胜者
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] !== 0) {
                    const result = this.checkWin(i, j, this.board[i][j]);
                    if (result.win) {
                        return this.board[i][j];
                    }
                }
            }
        }
        return 0;
    }
    
    isBoardFull() {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] === 0) {
                    return false;
                }
            }
        }
        return true;
    }
    
    updateCellUI(row, col, player) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        const piece = document.createElement('div');
        piece.className = `piece ${player === 1 ? 'black' : 'white'} new`;
        
        cell.appendChild(piece);
        cell.classList.add('occupied');
    }
    
    highlightWinningCells(cells) {
        cells.forEach(([row, col]) => {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                cell.classList.add('winning');
            }
        });
    }
    
    undo() {
        if (this.moveHistory.length === 0 || !this.gameActive) return;
        
        // 在AI模式下，需要撤销两步（玩家和AI）
        const undoSteps = this.gameMode === 'ai' ? Math.min(2, this.moveHistory.length) : 1;
        
        for (let i = 0; i < undoSteps; i++) {
            if (this.moveHistory.length === 0) break;
            
            const lastMove = this.moveHistory.pop();
            this.board = lastMove.board.map(row => [...row]);
            
            // 更新UI
            const cell = document.querySelector(`[data-row="${lastMove.row}"][data-col="${lastMove.col}"]`);
            cell.innerHTML = '';
            cell.classList.remove('occupied');
            
            this.currentPlayer = lastMove.player;
            this.turnCount--;
        }
        
        this.updateDisplay();
        
        // 更新悔棋按钮状态
        document.getElementById('undoBtn').disabled = this.moveHistory.length === 0;
    }
    
    showVictory(winner, winType) {
        const title = winner === 1 ? '🎉 黑子获胜！' : '🎉 白子获胜！';
        document.getElementById('victoryTitle').textContent = title;
        document.getElementById('winType').textContent = winType;
        document.getElementById('winDetail').textContent = this.getWinDescription(winType);
        document.getElementById('finalTurns').textContent = this.turnCount;
        document.getElementById('winMethod').textContent = winType;
        document.getElementById('gameTime').textContent = this.getGameTime();
        
        document.getElementById('victoryPopup').classList.add('show');
    }
    
    getWinDescription(winType) {
        switch (winType) {
            case '十字连珠':
                return '横向或纵向5子+交叉3子获胜';
            case '五子连珠':
                return '任意方向连成5子获胜';
            default:
                return '恭喜获胜！';
        }
    }
    
    showDraw() {
        document.getElementById('victoryTitle').textContent = '🤝 平局！';
        document.getElementById('winType').textContent = '平局';
        document.getElementById('winDetail').textContent = '棋盘已满，未分胜负';
        document.getElementById('finalTurns').textContent = this.turnCount;
        document.getElementById('winMethod').textContent = '平局';
        document.getElementById('gameTime').textContent = this.getGameTime();
        
        document.getElementById('victoryPopup').classList.add('show');
    }
    
    closeVictory() {
        document.getElementById('victoryPopup').classList.remove('show');
    }
    
    getGameTime() {
        if (!this.gameStartTime) return '00:00';
        
        const elapsedMs = Date.now() - this.gameStartTime;
        const minutes = Math.floor(elapsedMs / 60000);
        const seconds = Math.floor((elapsedMs % 60000) / 1000);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateDisplay() {
        // 更新当前玩家指示器
        const indicator = document.getElementById('playerIndicator');
        const piece = indicator.querySelector('.piece');
        const text = indicator.querySelector('span');
        
        if (this.currentPlayer === 1) {
            piece.className = 'piece black';
            text.textContent = '黑子回合';
        } else {
            piece.className = 'piece white';
            text.textContent = '白子回合';
        }
        
        // 更新回合数
        document.getElementById('turnCount').textContent = this.turnCount;
        
        // 更新分数（这里可以根据需要添加评分逻辑）
        document.getElementById('blackScore').textContent = '0';
        document.getElementById('whiteScore').textContent = '0';
    }
    
    showHelp() {
        document.getElementById('helpPopup').classList.add('show');
    }
    
    closeHelp() {
        document.getElementById('helpPopup').classList.remove('show');
    }
    
    showStats() {
        this.updateStatsDisplay();
        document.getElementById('statsPopup').classList.add('show');
    }
    
    closeStats() {
        document.getElementById('statsPopup').classList.remove('show');
    }
    
    updateStats(winner) {
        this.stats.totalGames++;
        
        if (this.gameMode === 'ai') {
            if (winner === 1) {
                this.stats.playerWins++;
            } else {
                this.stats.aiWins++;
            }
        }
        
        this.saveStats();
    }
    
    updateStatsDisplay() {
        document.getElementById('totalGames').textContent = this.stats.totalGames;
        document.getElementById('playerWins').textContent = this.stats.playerWins;
        document.getElementById('aiWins').textContent = this.stats.aiWins;
        
        const winRate = this.stats.totalGames > 0 ? 
            Math.round((this.stats.playerWins / this.stats.totalGames) * 100) : 0;
        document.getElementById('winRate').textContent = winRate + '%';
    }
    
    resetStats() {
        this.stats = {
            totalGames: 0,
            playerWins: 0,
            aiWins: 0
        };
        this.saveStats();
        this.updateStatsDisplay();
    }
    
    loadStats() {
        const saved = localStorage.getItem('crossLineGame_stats');
        return saved ? JSON.parse(saved) : {
            totalGames: 0,
            playerWins: 0,
            aiWins: 0
        };
    }
    
    saveStats() {
        localStorage.setItem('crossLineGame_stats', JSON.stringify(this.stats));
    }
}

// 全局变量供HTML onclick调用
let crossLineGame;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    crossLineGame = new CrossLineGame();
});