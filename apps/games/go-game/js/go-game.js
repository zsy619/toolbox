class GoGame {
    constructor() {
        this.canvas = document.getElementById('goBoard');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.boardSize = 19;
        this.gameMode = 'pvp'; // pvp 或 ai
        this.currentPlayer = 'black'; // black 或 white
        this.gameActive = false;
        this.board = [];
        this.moveHistory = [];
        this.capturedStones = { black: 0, white: 0 };
        this.passCount = 0;
        this.startTime = null;
        
        // 棋盘绘制参数
        this.cellSize = 0;
        this.margin = 30;
        
        // 禁着点（劫争）
        this.koPosition = null;
        
        this.init();
    }
    
    init() {
        this.calculateCellSize();
        this.initializeBoard();
        this.bindEvents();
        this.updateDisplay();
        this.drawBoard();
        this.startTimer();
    }
    
    calculateCellSize() {
        const availableSize = Math.min(this.canvas.width, this.canvas.height) - 2 * this.margin;
        this.cellSize = availableSize / (this.boardSize - 1);
    }
    
    initializeBoard() {
        this.board = [];
        for (let i = 0; i < this.boardSize; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.boardSize; j++) {
                this.board[i][j] = null;
            }
        }
        this.moveHistory = [];
        this.capturedStones = { black: 0, white: 0 };
        this.currentPlayer = 'black';
        this.passCount = 0;
        this.koPosition = null;
        this.gameActive = true;
    }
    
    bindEvents() {
        this.canvas.addEventListener('click', (e) => {
            if (!this.gameActive) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const col = Math.round((x - this.margin) / this.cellSize);
            const row = Math.round((y - this.margin) / this.cellSize);
            
            if (this.isValidMove(row, col)) {
                this.makeMove(row, col);
            }
        });
    }
    
    isValidMove(row, col) {
        // 检查边界
        if (row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) {
            return false;
        }
        
        // 检查位置是否已有棋子
        if (this.board[row][col] !== null) {
            return false;
        }
        
        // 检查劫争
        if (this.koPosition && this.koPosition.row === row && this.koPosition.col === col) {
            return false;
        }
        
        // TODO: 检查自杀手（简化版本暂时跳过）
        return true;
    }
    
    makeMove(row, col) {
        // 放置棋子
        this.board[row][col] = this.currentPlayer;
        
        // 记录移动
        this.moveHistory.push({
            row: row,
            col: col,
            player: this.currentPlayer,
            capturedStones: {...this.capturedStones}
        });
        
        // 检查并提取对方棋子
        const opponent = this.currentPlayer === 'black' ? 'white' : 'black';
        this.checkCaptures(row, col, opponent);
        
        // 重置停一手计数
        this.passCount = 0;
        
        // 切换玩家
        this.currentPlayer = opponent;
        
        // 更新显示
        this.updateDisplay();
        this.drawBoard();
        
        // AI回合
        if (this.gameMode === 'ai' && this.currentPlayer === 'white' && this.gameActive) {
            setTimeout(() => this.makeAIMove(), 1000);
        }
    }
    
    checkCaptures(row, col, opponent) {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        let totalCaptured = 0;
        
        // 检查四个方向的对方棋群
        for (let [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            
            if (this.isValidPosition(newRow, newCol) && 
                this.board[newRow][newCol] === opponent) {
                
                const group = this.getGroup(newRow, newCol);
                if (this.hasNoLiberty(group)) {
                    // 提取这个棋群
                    for (let pos of group) {
                        this.board[pos.row][pos.col] = null;
                        totalCaptured++;
                    }
                }
            }
        }
        
        this.capturedStones[this.currentPlayer] += totalCaptured;
        
        // 处理劫争（简化版本）
        if (totalCaptured === 1 && this.moveHistory.length > 1) {
            // 设置劫争禁着点
            const lastCapture = this.moveHistory[this.moveHistory.length - 2];
            if (lastCapture && this.capturedStones[opponent] === 1) {
                this.koPosition = { row: lastCapture.row, col: lastCapture.col };
            }
        } else {
            this.koPosition = null;
        }
    }
    
    getGroup(row, col) {
        const color = this.board[row][col];
        if (!color) return [];
        
        const group = [];
        const visited = new Set();
        const queue = [{row, col}];
        
        while (queue.length > 0) {
            const pos = queue.shift();
            const key = `${pos.row},${pos.col}`;
            
            if (visited.has(key)) continue;
            visited.add(key);
            
            if (this.board[pos.row][pos.col] === color) {
                group.push(pos);
                
                // 添加相邻位置到队列
                const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
                for (let [dr, dc] of directions) {
                    const newRow = pos.row + dr;
                    const newCol = pos.col + dc;
                    
                    if (this.isValidPosition(newRow, newCol)) {
                        queue.push({row: newRow, col: newCol});
                    }
                }
            }
        }
        
        return group;
    }
    
    hasNoLiberty(group) {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        for (let pos of group) {
            for (let [dr, dc] of directions) {
                const newRow = pos.row + dr;
                const newCol = pos.col + dc;
                
                if (this.isValidPosition(newRow, newCol) && 
                    this.board[newRow][newCol] === null) {
                    return false; // 有气
                }
            }
        }
        
        return true; // 无气
    }
    
    isValidPosition(row, col) {
        return row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize;
    }
    
    makeAIMove() {
        if (!this.gameActive || this.currentPlayer !== 'white') return;
        
        // 简单AI：随机选择合法位置
        const availableMoves = [];
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.isValidMove(row, col)) {
                    availableMoves.push({row, col});
                }
            }
        }
        
        if (availableMoves.length > 0) {
            const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            this.makeMove(randomMove.row, randomMove.col);
        } else {
            this.pass();
        }
    }
    
    pass() {
        if (!this.gameActive) return;
        
        this.passCount++;
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        
        if (this.passCount >= 2) {
            this.endGame();
        }
        
        this.updateDisplay();
        
        // AI回合
        if (this.gameMode === 'ai' && this.currentPlayer === 'white' && this.gameActive) {
            setTimeout(() => this.makeAIMove(), 1000);
        }
    }
    
    undo() {
        if (this.moveHistory.length === 0) return;
        
        const lastMove = this.moveHistory.pop();
        this.board[lastMove.row][lastMove.col] = null;
        this.currentPlayer = lastMove.player;
        this.capturedStones = lastMove.capturedStones;
        this.passCount = 0;
        this.koPosition = null;
        
        this.updateDisplay();
        this.drawBoard();
    }
    
    resign() {
        if (!this.gameActive) return;
        
        const winner = this.currentPlayer === 'black' ? 'white' : 'black';
        this.gameActive = false;
        this.showGameOver(`${winner === 'black' ? '黑棋' : '白棋'}获胜！`, `对方认输`);
    }
    
    endGame() {
        this.gameActive = false;
        
        // 简单计算领土（只计算提子）
        const blackScore = this.capturedStones.black;
        const whiteScore = this.capturedStones.white + 6.5; // 白棋贴目6.5子
        
        let winner, result;
        if (blackScore > whiteScore) {
            winner = '黑棋获胜！';
            result = `黑棋以${(blackScore - whiteScore).toFixed(1)}子获胜`;
        } else {
            winner = '白棋获胜！';
            result = `白棋以${(whiteScore - blackScore).toFixed(1)}子获胜`;
        }
        
        this.showGameOver(winner, result);
    }
    
    showGameOver(winner, result) {
        document.getElementById('gameOverTitle').textContent = '🎉 对局结束';
        document.getElementById('gameResult').textContent = winner;
        document.getElementById('finalBlackScore').textContent = this.capturedStones.black;
        document.getElementById('finalWhiteScore').textContent = this.capturedStones.white;
        document.getElementById('gameOverPopup').classList.add('show');
    }
    
    closeGameOver() {
        document.getElementById('gameOverPopup').classList.remove('show');
    }
    
    setMode(mode) {
        this.gameMode = mode;
        
        // 更新按钮状态
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick*="${mode}"]`).classList.add('active');
        
        this.startNewGame();
    }
    
    setBoardSize(size) {
        this.boardSize = size;
        this.calculateCellSize();
        
        // 更新按钮状态
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick*="${size}"]`).classList.add('active');
        
        this.startNewGame();
    }
    
    startNewGame() {
        this.initializeBoard();
        this.updateDisplay();
        this.drawBoard();
        this.startTime = Date.now();
    }
    
    drawBoard() {
        // 清空画布
        this.ctx.fillStyle = '#FFF8E1';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格线
        this.ctx.strokeStyle = '#8D6E63';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.boardSize; i++) {
            // 垂直线
            this.ctx.beginPath();
            this.ctx.moveTo(this.margin + i * this.cellSize, this.margin);
            this.ctx.lineTo(this.margin + i * this.cellSize, this.margin + (this.boardSize - 1) * this.cellSize);
            this.ctx.stroke();
            
            // 水平线
            this.ctx.beginPath();
            this.ctx.moveTo(this.margin, this.margin + i * this.cellSize);
            this.ctx.lineTo(this.margin + (this.boardSize - 1) * this.cellSize, this.margin + i * this.cellSize);
            this.ctx.stroke();
        }
        
        // 绘制星位（19路棋盘）
        if (this.boardSize === 19) {
            const starPoints = [
                [3, 3], [3, 9], [3, 15],
                [9, 3], [9, 9], [9, 15],
                [15, 3], [15, 9], [15, 15]
            ];
            
            this.ctx.fillStyle = '#8D6E63';
            for (let [row, col] of starPoints) {
                this.ctx.beginPath();
                this.ctx.arc(
                    this.margin + col * this.cellSize,
                    this.margin + row * this.cellSize,
                    3,
                    0,
                    Math.PI * 2
                );
                this.ctx.fill();
            }
        }
        
        // 绘制棋子
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col]) {
                    this.drawStone(row, col, this.board[row][col]);
                }
            }
        }
    }
    
    drawStone(row, col, color) {
        const x = this.margin + col * this.cellSize;
        const y = this.margin + row * this.cellSize;
        const radius = this.cellSize * 0.4;
        
        // 阴影效果
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        
        // 绘制棋子
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        
        if (color === 'black') {
            this.ctx.fillStyle = '#212121';
        } else {
            this.ctx.fillStyle = '#FAFAFA';
        }
        
        this.ctx.fill();
        
        // 白棋边框
        if (color === 'white') {
            this.ctx.strokeStyle = '#BDBDBD';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    updateDisplay() {
        document.getElementById('blackCaptured').textContent = this.capturedStones.black;
        document.getElementById('whiteCaptured').textContent = this.capturedStones.white;
        document.getElementById('moveCount').textContent = this.moveHistory.length;
        document.getElementById('currentPlayer').textContent = this.currentPlayer === 'black' ? '黑棋' : '白棋';
        
        document.getElementById('blackCapturedStones').textContent = this.capturedStones.black;
        document.getElementById('whiteCapturedStones').textContent = this.capturedStones.white;
        document.getElementById('turnDisplay').textContent = `${this.currentPlayer === 'black' ? '黑棋' : '白棋'}行棋`;
    }
    
    startTimer() {
        this.startTime = Date.now();
        
        setInterval(() => {
            if (this.startTime) {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                const minutes = Math.floor(elapsed / 60);
                const seconds = elapsed % 60;
                document.getElementById('gameTime').textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
    
    showHelp() {
        document.getElementById('helpModal').classList.add('show');
    }
    
    closeHelp() {
        document.getElementById('helpModal').classList.remove('show');
    }
}

// 全局变量供HTML onclick调用
let goGame;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    goGame = new GoGame();
});