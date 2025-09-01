class SlidingPuzzle {
    constructor() {
        this.size = 4;
        this.board = [];
        this.emptyPos = { row: 0, col: 0 };
        this.moveCount = 0;
        this.startTime = null;
        this.gameActive = false;
        this.timer = null;
        this.bestScores = this.loadBestScores();
        this.solved = false;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setSize(4);
        this.updateDisplay();
    }
    
    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (!this.gameActive) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.moveEmpty('down');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.moveEmpty('up');
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.moveEmpty('right');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.moveEmpty('left');
                    break;
            }
        });
    }
    
    setSize(size) {
        this.size = size;
        this.initBoard();
        this.renderBoard();
        this.updateBestScore();
        
        // 更新按钮状态
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick*="${size}"]`).classList.add('active');
    }
    
    initBoard() {
        this.board = [];
        this.moveCount = 0;
        this.startTime = null;
        this.gameActive = false;
        this.solved = false;
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // 创建已排序的棋盘
        for (let i = 0; i < this.size; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.size; j++) {
                const value = i * this.size + j + 1;
                this.board[i][j] = value === this.size * this.size ? 0 : value;
            }
        }
        
        // 空格位置
        this.emptyPos = { row: this.size - 1, col: this.size - 1 };
        
        this.updateDisplay();
    }
    
    renderBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.className = `game-board size-${this.size}`;
        gameBoard.innerHTML = '';
        
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const tile = document.createElement('div');
                tile.className = 'puzzle-tile';
                tile.dataset.row = i;
                tile.dataset.col = j;
                
                if (this.board[i][j] === 0) {
                    tile.classList.add('empty');
                } else {
                    tile.textContent = this.board[i][j];
                    tile.addEventListener('click', () => this.moveTile(i, j));
                }
                
                gameBoard.appendChild(tile);
            }
        }
    }
    
    moveTile(row, col) {
        if (!this.canMove(row, col)) return;
        
        // 开始游戏计时
        if (!this.gameActive) {
            this.startGame();
        }
        
        // 交换瓦片和空格
        this.board[this.emptyPos.row][this.emptyPos.col] = this.board[row][col];
        this.board[row][col] = 0;
        this.emptyPos = { row, col };
        
        this.moveCount++;
        this.updateDisplay();
        this.renderBoard();
        
        // 检查是否完成
        if (this.isSolved()) {
            this.gameComplete();
        }
    }
    
    moveEmpty(direction) {
        let newRow = this.emptyPos.row;
        let newCol = this.emptyPos.col;
        
        switch(direction) {
            case 'up':
                newRow--;
                break;
            case 'down':
                newRow++;
                break;
            case 'left':
                newCol--;
                break;
            case 'right':
                newCol++;
                break;
        }
        
        if (this.isValidPosition(newRow, newCol)) {
            this.moveTile(newRow, newCol);
        }
    }
    
    canMove(row, col) {
        // 检查是否与空格相邻
        const rowDiff = Math.abs(row - this.emptyPos.row);
        const colDiff = Math.abs(col - this.emptyPos.col);
        
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }
    
    isValidPosition(row, col) {
        return row >= 0 && row < this.size && col >= 0 && col < this.size;
    }
    
    shuffle() {
        this.initBoard();
        
        // 执行随机移动来打乱棋盘
        const moves = 1000;
        for (let i = 0; i < moves; i++) {
            const directions = ['up', 'down', 'left', 'right'];
            const direction = directions[Math.floor(Math.random() * directions.length)];
            
            let newRow = this.emptyPos.row;
            let newCol = this.emptyPos.col;
            
            switch(direction) {
                case 'up':
                    newRow--;
                    break;
                case 'down':
                    newRow++;
                    break;
                case 'left':
                    newCol--;
                    break;
                case 'right':
                    newCol++;
                    break;
            }
            
            if (this.isValidPosition(newRow, newCol)) {
                // 交换位置（不计入移动次数）
                this.board[this.emptyPos.row][this.emptyPos.col] = this.board[newRow][newCol];
                this.board[newRow][newCol] = 0;
                this.emptyPos = { row: newRow, col: newCol };
            }
        }
        
        this.renderBoard();
        this.gameActive = false;
        this.solved = false;
    }
    
    isSolved() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const expectedValue = i * this.size + j + 1;
                const actualValue = this.board[i][j];
                
                if (i === this.size - 1 && j === this.size - 1) {
                    // 最后一个位置应该是空格
                    if (actualValue !== 0) return false;
                } else {
                    if (actualValue !== expectedValue) return false;
                }
            }
        }
        return true;
    }
    
    startGame() {
        this.gameActive = true;
        this.startTime = Date.now();
        this.timer = setInterval(() => this.updateTimer(), 100);
    }
    
    gameComplete() {
        this.gameActive = false;
        this.solved = true;
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // 标记正确的瓦片
        document.querySelectorAll('.puzzle-tile:not(.empty)').forEach(tile => {
            tile.classList.add('correct');
        });
        
        // 更新最佳分数
        this.updateBestScore();
        
        // 显示胜利弹窗
        setTimeout(() => this.showVictory(), 500);
    }
    
    showVictory() {
        const finalTime = this.getElapsedTime();
        const stars = this.calculateStars();
        
        document.getElementById('finalMoves').textContent = this.moveCount;
        document.getElementById('finalTime').textContent = finalTime;
        
        // 更新星级显示
        const starElements = document.querySelectorAll('#starRating .star');
        starElements.forEach((star, index) => {
            if (index < stars) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
        
        document.getElementById('victoryPopup').classList.add('show');
    }
    
    calculateStars() {
        // 根据移动次数计算星级
        const optimalMoves = this.getOptimalMoves();
        const ratio = this.moveCount / optimalMoves;
        
        if (ratio <= 2) return 3;
        if (ratio <= 3) return 2;
        return 1;
    }
    
    getOptimalMoves() {
        // 简化的最优移动次数估算
        const baseMoves = {
            3: 20,
            4: 80,
            5: 200
        };
        return baseMoves[this.size] || 100;
    }
    
    closeVictory() {
        document.getElementById('victoryPopup').classList.remove('show');
    }
    
    solve() {
        // 简单的求解提示 - 显示下一步应该移动的瓦片
        if (!this.gameActive && !this.isSolved()) {
            this.shuffle();
            return;
        }
        
        this.showHint();
    }
    
    showHint() {
        // 找到第一个位置不正确的瓦片
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const expectedValue = i * this.size + j + 1;
                const actualValue = this.board[i][j];
                
                if (i === this.size - 1 && j === this.size - 1) {
                    continue; // 跳过空格位置
                }
                
                if (actualValue !== expectedValue) {
                    // 高亮显示这个瓦片
                    this.highlightTile(i, j);
                    return;
                }
            }
        }
    }
    
    highlightTile(row, col) {
        const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (tile) {
            tile.style.animation = 'hintPulse 1s ease-in-out 3';
        }
    }
    
    updateTimer() {
        if (this.gameActive) {
            document.getElementById('timeCount').textContent = this.getElapsedTime();
        }
    }
    
    getElapsedTime() {
        if (!this.startTime) return '00:00';
        
        const elapsed = Date.now() - this.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateDisplay() {
        document.getElementById('moveCount').textContent = this.moveCount;
        
        if (!this.gameActive) {
            document.getElementById('timeCount').textContent = '00:00';
        }
    }
    
    updateBestScore() {
        const key = `size_${this.size}`;
        const bestScore = this.bestScores[key];
        
        if (bestScore) {
            document.getElementById('bestScore').textContent = bestScore;
        } else {
            document.getElementById('bestScore').textContent = '--';
        }
        
        // 如果刚完成游戏，检查是否是新纪录
        if (this.solved && this.moveCount < (bestScore || Infinity)) {
            this.bestScores[key] = this.moveCount;
            this.saveBestScores();
            document.getElementById('bestScore').textContent = this.moveCount;
        }
    }
    
    loadBestScores() {
        const saved = localStorage.getItem('slidingPuzzle_bestScores');
        return saved ? JSON.parse(saved) : {};
    }
    
    saveBestScores() {
        localStorage.setItem('slidingPuzzle_bestScores', JSON.stringify(this.bestScores));
    }
    
    showHelp() {
        document.getElementById('helpPopup').classList.add('show');
    }
    
    closeHelp() {
        document.getElementById('helpPopup').classList.remove('show');
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes hintPulse {
        0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        50% { 
            transform: scale(1.1); 
            box-shadow: 0 8px 24px rgba(255, 215, 0, 0.6);
        }
    }
`;
document.head.appendChild(style);

// 全局变量供HTML onclick调用
let slidingPuzzle;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    slidingPuzzle = new SlidingPuzzle();
});