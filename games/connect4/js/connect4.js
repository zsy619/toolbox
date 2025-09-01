class Connect4 {
    constructor() {
        // 游戏设置
        this.rows = 6;
        this.cols = 7;
        this.currentPlayer = 1; // 1 = 红方, 2 = 蓝方
        this.gameOver = false;
        this.isAIMode = false;
        this.aiPlayer = 2; // AI是蓝方
        this.aiDifficulty = 2; // 1=简单, 2=中等, 3=困难
        
        // 游戏状态
        this.board = [];
        this.moveHistory = [];
        this.winningCells = [];
        
        // 统计数据
        this.stats = {
            redWins: parseInt(localStorage.getItem('connect4RedWins')) || 0,
            blueWins: parseInt(localStorage.getItem('connect4BlueWins')) || 0,
            draws: parseInt(localStorage.getItem('connect4Draws')) || 0
        };
        
        this.initGame();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initGame() {
        // 初始化棋盘
        this.board = [];
        for (let row = 0; row < this.rows; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.board[row][col] = 0; // 0 = 空, 1 = 红方, 2 = 蓝方
            }
        }
        
        this.currentPlayer = 1;
        this.gameOver = false;
        this.moveHistory = [];
        this.winningCells = [];
        
        this.createBoard();
        this.updateStatus('点击列来投放棋子');
        this.updateDisplay();
    }
    
    createBoard() {
        // 创建掉落区域
        const dropZone = document.getElementById('dropZone');
        dropZone.innerHTML = '';
        
        for (let col = 0; col < this.cols; col++) {
            const dropColumn = document.createElement('div');
            dropColumn.className = 'drop-column';
            dropColumn.dataset.col = col;
            
            const preview = document.createElement('div');
            preview.className = `drop-preview ${this.currentPlayer === 1 ? 'red' : 'blue'}`;
            dropColumn.appendChild(preview);
            
            dropColumn.addEventListener('click', (e) => this.handleColumnClick(e));
            dropColumn.addEventListener('mouseenter', (e) => this.updatePreview(e));
            
            dropZone.appendChild(dropColumn);
        }
        
        // 创建游戏网格
        const gameGrid = document.getElementById('gameGrid');
        gameGrid.innerHTML = '';
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell empty';
                cell.dataset.row = row;
                cell.dataset.col = col;
                gameGrid.appendChild(cell);
            }
        }
        
        // 创建列指示器
        const columnIndicators = document.getElementById('columnIndicators');
        columnIndicators.innerHTML = '';
        
        for (let col = 0; col < this.cols; col++) {
            const indicator = document.createElement('div');
            indicator.className = 'column-indicator';
            indicator.textContent = col + 1;
            columnIndicators.appendChild(indicator);
        }
    }
    
    handleColumnClick(event) {
        if (this.gameOver) return;
        
        // 如果是AI回合，不允许人类玩家操作
        if (this.isAIMode && this.currentPlayer === this.aiPlayer) {
            return;
        }
        
        const col = parseInt(event.target.dataset.col);
        this.makeMove(col);
    }
    
    updatePreview(event) {
        if (this.gameOver) return;
        
        const preview = event.target.querySelector('.drop-preview');
        if (preview) {
            preview.className = `drop-preview ${this.currentPlayer === 1 ? 'red' : 'blue'}`;
        }
    }
    
    makeMove(col) {
        if (this.gameOver || !this.isValidMove(col)) {
            return false;
        }
        
        // 找到该列最底部的空位
        let row = -1;
        for (let r = this.rows - 1; r >= 0; r--) {
            if (this.board[r][col] === 0) {
                row = r;
                break;
            }
        }
        
        if (row === -1) return false; // 列已满
        
        // 放置棋子
        this.board[row][col] = this.currentPlayer;
        this.moveHistory.push({ row, col, player: this.currentPlayer });
        
        // 更新显示
        this.updateCell(row, col, this.currentPlayer);
        
        // 检查胜负
        if (this.checkWin(row, col)) {
            this.endGame(`${this.currentPlayer === 1 ? '🔴 红方' : '🔵 蓝方'}获胜！`);
            this.updateStats(this.currentPlayer === 1 ? 'red' : 'blue');
        } else if (this.isBoardFull()) {
            this.endGame('平局！');
            this.updateStats('draw');
        } else {
            // 切换玩家
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
            this.updateDisplay();
            this.updateAllPreviews();
            
            // 如果是AI模式且轮到AI
            if (this.isAIMode && this.currentPlayer === this.aiPlayer) {
                this.updateStatus('🤔 AI正在思考...');
                document.getElementById('thinkingIndicator').style.display = 'block';
                
                setTimeout(() => {
                    this.makeAIMove();
                }, 1000);
            } else {
                this.updateStatus(`${this.currentPlayer === 1 ? '🔴 红方' : '🔵 蓝方'}的回合`);
            }
        }
        
        // 更新撤销按钮状态
        document.getElementById('undoBtn').disabled = this.moveHistory.length === 0 || this.gameOver;
        
        return true;
    }
    
    isValidMove(col) {
        return col >= 0 && col < this.cols && this.board[0][col] === 0;
    }
    
    updateCell(row, col, player) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.className = `cell ${player === 1 ? 'red' : 'blue'} dropping`;
            
            // 移除动画类
            setTimeout(() => {
                cell.classList.remove('dropping');
            }, 500);
        }
    }
    
    updateAllPreviews() {
        const previews = document.querySelectorAll('.drop-preview');
        previews.forEach(preview => {
            preview.className = `drop-preview ${this.currentPlayer === 1 ? 'red' : 'blue'}`;
        });
    }
    
    checkWin(row, col) {
        const player = this.board[row][col];
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 对角线 \
            [1, -1]   // 对角线 /
        ];
        
        for (const [dRow, dCol] of directions) {
            const line = this.getLine(row, col, dRow, dCol, player);
            if (line.length >= 4) {
                this.winningCells = line;
                this.highlightWinningCells();
                return true;
            }
        }
        
        return false;
    }
    
    getLine(row, col, dRow, dCol, player) {
        const line = [{ row, col }];
        
        // 向一个方向延伸
        let r = row + dRow, c = col + dCol;
        while (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.board[r][c] === player) {
            line.push({ row: r, col: c });
            r += dRow;
            c += dCol;
        }
        
        // 向另一个方向延伸
        r = row - dRow;
        c = col - dCol;
        while (r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.board[r][c] === player) {
            line.unshift({ row: r, col: c });
            r -= dRow;
            c -= dCol;
        }
        
        return line;
    }
    
    highlightWinningCells() {
        for (const { row, col } of this.winningCells) {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                cell.classList.add('winning');
            }
        }
    }
    
    isBoardFull() {
        for (let col = 0; col < this.cols; col++) {
            if (this.board[0][col] === 0) {
                return false;
            }
        }
        return true;
    }
    
    endGame(message) {
        this.gameOver = true;
        this.updateStatus(message);
        document.getElementById('thinkingIndicator').style.display = 'none';
        
        // 禁用所有掉落区域
        const dropColumns = document.querySelectorAll('.drop-column');
        dropColumns.forEach(col => {
            col.classList.add('disabled');
        });
        
        this.showVictoryMessage(message);
    }
    
    showVictoryMessage(message) {
        const victoryDiv = document.createElement('div');
        victoryDiv.className = 'victory-message';
        victoryDiv.innerHTML = `
            <h2>${message}</h2>
            <div class="victory-stats">
                <div>🔴 红方胜利: ${this.stats.redWins}</div>
                <div>🔵 蓝方胜利: ${this.stats.blueWins}</div>
                <div>🤝 平局: ${this.stats.draws}</div>
            </div>
            <button onclick="connect4.newGame(); this.parentElement.remove();" style="margin-top: 20px;">再来一局</button>
        `;
        document.body.appendChild(victoryDiv);
    }
    
    makeAIMove() {
        if (this.gameOver) return;
        
        let bestCol = this.getBestMove();
        
        // 添加一些随机性，特别是在简单难度
        if (this.aiDifficulty === 1 && Math.random() < 0.3) {
            const validMoves = [];
            for (let col = 0; col < this.cols; col++) {
                if (this.isValidMove(col)) {
                    validMoves.push(col);
                }
            }
            bestCol = validMoves[Math.floor(Math.random() * validMoves.length)];
        }
        
        document.getElementById('thinkingIndicator').style.display = 'none';
        this.makeMove(bestCol);
    }
    
    getBestMove() {
        // 检查AI是否可以获胜
        for (let col = 0; col < this.cols; col++) {
            if (this.isValidMove(col)) {
                const row = this.getLowestRow(col);
                this.board[row][col] = this.aiPlayer;
                if (this.checkWin(row, col)) {
                    this.board[row][col] = 0; // 撤销
                    return col;
                }
                this.board[row][col] = 0; // 撤销
            }
        }
        
        // 检查是否需要阻止对手获胜
        const opponent = this.aiPlayer === 1 ? 2 : 1;
        for (let col = 0; col < this.cols; col++) {
            if (this.isValidMove(col)) {
                const row = this.getLowestRow(col);
                this.board[row][col] = opponent;
                if (this.checkWin(row, col)) {
                    this.board[row][col] = 0; // 撤销
                    return col;
                }
                this.board[row][col] = 0; // 撤销
            }
        }
        
        // 使用Minimax算法选择最佳位置
        if (this.aiDifficulty >= 2) {
            const depth = this.aiDifficulty === 2 ? 4 : 6;
            return this.minimax(depth, this.aiPlayer, -Infinity, Infinity).col;
        }
        
        // 简单AI：随机选择
        const validMoves = [];
        for (let col = 0; col < this.cols; col++) {
            if (this.isValidMove(col)) {
                validMoves.push(col);
            }
        }
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    }
    
    minimax(depth, player, alpha, beta) {
        // 检查终止条件
        if (depth === 0 || this.gameOver) {
            return { score: this.evaluateBoard(), col: -1 };
        }
        
        let bestCol = -1;
        
        if (player === this.aiPlayer) {
            let maxScore = -Infinity;
            
            for (let col = 0; col < this.cols; col++) {
                if (this.isValidMove(col)) {
                    const row = this.getLowestRow(col);
                    this.board[row][col] = player;
                    
                    if (this.checkWinAt(row, col, player)) {
                        this.board[row][col] = 0;
                        return { score: 1000, col: col };
                    }
                    
                    const score = this.minimax(depth - 1, player === 1 ? 2 : 1, alpha, beta).score;
                    this.board[row][col] = 0;
                    
                    if (score > maxScore) {
                        maxScore = score;
                        bestCol = col;
                    }
                    
                    alpha = Math.max(alpha, score);
                    if (beta <= alpha) break; // Alpha-beta剪枝
                }
            }
            
            return { score: maxScore, col: bestCol };
        } else {
            let minScore = Infinity;
            
            for (let col = 0; col < this.cols; col++) {
                if (this.isValidMove(col)) {
                    const row = this.getLowestRow(col);
                    this.board[row][col] = player;
                    
                    if (this.checkWinAt(row, col, player)) {
                        this.board[row][col] = 0;
                        return { score: -1000, col: col };
                    }
                    
                    const score = this.minimax(depth - 1, player === 1 ? 2 : 1, alpha, beta).score;
                    this.board[row][col] = 0;
                    
                    if (score < minScore) {
                        minScore = score;
                        bestCol = col;
                    }
                    
                    beta = Math.min(beta, score);
                    if (beta <= alpha) break; // Alpha-beta剪枝
                }
            }
            
            return { score: minScore, col: bestCol };
        }
    }
    
    checkWinAt(row, col, player) {
        const directions = [
            [0, 1], [1, 0], [1, 1], [1, -1]
        ];
        
        for (const [dRow, dCol] of directions) {
            const line = this.getLine(row, col, dRow, dCol, player);
            if (line.length >= 4) {
                return true;
            }
        }
        
        return false;
    }
    
    evaluateBoard() {
        let score = 0;
        
        // 评估所有可能的4连线位置
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                // 水平
                if (col <= this.cols - 4) {
                    score += this.evaluateLine(row, col, 0, 1);
                }
                // 垂直
                if (row <= this.rows - 4) {
                    score += this.evaluateLine(row, col, 1, 0);
                }
                // 对角线
                if (row <= this.rows - 4 && col <= this.cols - 4) {
                    score += this.evaluateLine(row, col, 1, 1);
                }
                if (row <= this.rows - 4 && col >= 3) {
                    score += this.evaluateLine(row, col, 1, -1);
                }
            }
        }
        
        return score;
    }
    
    evaluateLine(row, col, dRow, dCol) {
        let aiCount = 0, humanCount = 0;
        
        for (let i = 0; i < 4; i++) {
            const r = row + i * dRow;
            const c = col + i * dCol;
            
            if (this.board[r][c] === this.aiPlayer) {
                aiCount++;
            } else if (this.board[r][c] === (this.aiPlayer === 1 ? 2 : 1)) {
                humanCount++;
            }
        }
        
        // 如果同时包含AI和人类棋子，这条线无效
        if (aiCount > 0 && humanCount > 0) {
            return 0;
        }
        
        // 评分
        if (aiCount === 4) return 1000;
        if (aiCount === 3) return 50;
        if (aiCount === 2) return 10;
        if (aiCount === 1) return 1;
        
        if (humanCount === 4) return -1000;
        if (humanCount === 3) return -50;
        if (humanCount === 2) return -10;
        if (humanCount === 1) return -1;
        
        return 0;
    }
    
    getLowestRow(col) {
        for (let row = this.rows - 1; row >= 0; row--) {
            if (this.board[row][col] === 0) {
                return row;
            }
        }
        return -1;
    }
    
    undo() {
        if (this.moveHistory.length === 0 || this.gameOver) return;
        
        // 在AI模式下，撤销两步（玩家和AI的）
        const movesToUndo = this.isAIMode ? Math.min(2, this.moveHistory.length) : 1;
        
        for (let i = 0; i < movesToUndo; i++) {
            if (this.moveHistory.length === 0) break;
            
            const lastMove = this.moveHistory.pop();
            this.board[lastMove.row][lastMove.col] = 0;
            
            const cell = document.querySelector(`[data-row="${lastMove.row}"][data-col="${lastMove.col}"]`);
            if (cell) {
                cell.className = 'cell empty';
            }
        }
        
        // 恢复到正确的玩家
        if (this.moveHistory.length === 0) {
            this.currentPlayer = 1;
        } else {
            const lastMove = this.moveHistory[this.moveHistory.length - 1];
            this.currentPlayer = lastMove.player === 1 ? 2 : 1;
        }
        
        this.updateDisplay();
        this.updateAllPreviews();
        this.updateStatus(`${this.currentPlayer === 1 ? '🔴 红方' : '🔵 蓝方'}的回合`);
        
        // 重新启用掉落区域
        const dropColumns = document.querySelectorAll('.drop-column');
        dropColumns.forEach(col => {
            col.classList.remove('disabled');
        });
        
        document.getElementById('undoBtn').disabled = this.moveHistory.length === 0;
    }
    
    newGame() {
        // 移除胜利消息
        const victoryMessage = document.querySelector('.victory-message');
        if (victoryMessage) {
            victoryMessage.remove();
        }
        
        this.initGame();
    }
    
    toggleAIMode() {
        this.isAIMode = !this.isAIMode;
        const button = document.getElementById('aiModeBtn');
        
        if (this.isAIMode) {
            button.textContent = '双人对战';
            button.classList.add('ai-active');
            this.updateStatus('🤖 人机对战模式 - 你是红方');
        } else {
            button.textContent = '人机对战';
            button.classList.remove('ai-active');
            this.updateStatus('👥 双人对战模式');
        }
        
        this.newGame();
    }
    
    updateStats(result) {
        if (result === 'red') {
            this.stats.redWins++;
            localStorage.setItem('connect4RedWins', this.stats.redWins);
        } else if (result === 'blue') {
            this.stats.blueWins++;
            localStorage.setItem('connect4BlueWins', this.stats.blueWins);
        } else if (result === 'draw') {
            this.stats.draws++;
            localStorage.setItem('connect4Draws', this.stats.draws);
        }
        
        this.updateDisplay();
    }
    
    resetStats() {
        if (confirm('确定要重置所有游戏记录吗？')) {
            this.stats = { redWins: 0, blueWins: 0, draws: 0 };
            localStorage.removeItem('connect4RedWins');
            localStorage.removeItem('connect4BlueWins');
            localStorage.removeItem('connect4Draws');
            this.updateDisplay();
        }
    }
    
    updateStatus(message) {
        document.getElementById('statusMessage').textContent = message;
    }
    
    updateDisplay() {
        document.getElementById('redWins').textContent = this.stats.redWins;
        document.getElementById('blueWins').textContent = this.stats.blueWins;
        document.getElementById('draws').textContent = this.stats.draws;
        
        const currentPlayerEl = document.getElementById('currentPlayer');
        currentPlayerEl.textContent = `${this.currentPlayer === 1 ? '🔴 红方' : '🔵 蓝方'}`;
        currentPlayerEl.className = `current-player ${this.currentPlayer === 1 ? 'red' : 'blue'}`;
    }
    
    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            
            const key = e.key;
            if (key >= '1' && key <= '7') {
                const col = parseInt(key) - 1;
                this.makeMove(col);
            } else if (key === 'u' || key === 'U') {
                e.preventDefault();
                this.undo();
            } else if (key === 'n' || key === 'N') {
                e.preventDefault();
                this.newGame();
            }
        });
        
        // 防止右键菜单
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
}

// 全局变量
let connect4;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    connect4 = new Connect4();
});