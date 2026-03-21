class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameMode = 'vs-ai'; // 'vs-ai' or 'vs-player'
        this.difficulty = 'easy'; // 'easy', 'medium', 'hard'
        this.gameActive = true;
        this.moveHistory = [];
        this.startTime = null;
        this.gameStats = this.loadStats();
        
        // 获胜组合
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // 行
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // 列
            [0, 4, 8], [2, 4, 6] // 对角线
        ];
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateDisplay();
        this.newGame();
    }
    
    bindEvents() {
        // 棋盘点击事件
        document.getElementById('gameBoard').addEventListener('click', (e) => {
            if (e.target.classList.contains('cell')) {
                const index = parseInt(e.target.dataset.index);
                this.makeMove(index);
            }
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '9') {
                const index = parseInt(e.key) - 1;
                this.makeMove(index);
            } else if (e.key === 'n' || e.key === 'N') {
                this.newGame();
            } else if (e.key === 'u' || e.key === 'U') {
                this.undo();
            } else if (e.key === 'h' || e.key === 'H') {
                this.getHint();
            }
        });
    }
    
    setMode(mode) {
        this.gameMode = mode;
        
        // 更新按钮状态
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick*="${mode}"]`).classList.add('active');
        
        // 显示/隐藏难度选择器
        const difficultySelector = document.getElementById('difficultySelector');
        if (mode === 'vs-ai') {
            difficultySelector.style.display = 'block';
        } else {
            difficultySelector.style.display = 'none';
        }
        
        this.newGame();
    }
    
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        
        // 更新按钮状态
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick*="${difficulty}"]`).classList.add('active');
        
        this.newGame();
    }
    
    newGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.moveHistory = [];
        this.startTime = Date.now();
        
        // 清除棋盘
        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });
        
        this.updateDisplay();
    }
    
    makeMove(index) {
        if (!this.gameActive || this.board[index] !== '') {
            return false;
        }
        
        // 记录移动历史
        this.moveHistory.push({
            index: index,
            player: this.currentPlayer,
            board: [...this.board]
        });
        
        // 执行移动
        this.board[index] = this.currentPlayer;
        this.updateCell(index, this.currentPlayer);
        
        // 检查游戏结果
        const result = this.checkGameResult();
        if (result) {
            this.endGame(result);
            return true;
        }
        
        // 切换玩家
        this.switchPlayer();
        
        // AI回合
        if (this.gameMode === 'vs-ai' && this.currentPlayer === 'O' && this.gameActive) {
            setTimeout(() => {
                this.makeAIMove();
            }, 500);
        }
        
        this.updateDisplay();
        return true;
    }
    
    makeAIMove() {
        if (!this.gameActive) return;
        
        let move;
        
        switch (this.difficulty) {
            case 'easy':
                move = this.getRandomMove();
                break;
            case 'medium':
                move = this.getMediumMove();
                break;
            case 'hard':
                move = this.getMinimaxMove();
                break;
        }
        
        if (move !== -1) {
            this.makeMove(move);
        }
    }
    
    getRandomMove() {
        const availableMoves = this.getAvailableMoves();
        if (availableMoves.length === 0) return -1;
        
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    getMediumMove() {
        // 中等难度：首先尝试获胜，然后阻止对手获胜，最后随机选择
        
        // 尝试获胜
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                if (this.checkWin('O')) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // 阻止对手获胜
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'X';
                if (this.checkWin('X')) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // 选择中心点或角落
        const preferredMoves = [4, 0, 2, 6, 8]; // 中心，然后是角落
        for (let move of preferredMoves) {
            if (this.board[move] === '') {
                return move;
            }
        }
        
        return this.getRandomMove();
    }
    
    getMinimaxMove() {
        let bestScore = -Infinity;
        let bestMove = -1;
        
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                let score = this.minimax(this.board, 0, false);
                this.board[i] = '';
                
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }
        
        return bestMove;
    }
    
    minimax(board, depth, isMaximizing) {
        const result = this.checkGameResult();
        
        if (result === 'O') return 1;
        if (result === 'X') return -1;
        if (result === 'draw') return 0;
        
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = this.minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = this.minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    
    getAvailableMoves() {
        return this.board.map((cell, index) => cell === '' ? index : null)
                        .filter(index => index !== null);
    }
    
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
    
    updateCell(index, player) {
        const cell = document.querySelector(`[data-index="${index}"]`);
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
    }
    
    checkGameResult() {
        // 检查获胜
        for (let player of ['X', 'O']) {
            if (this.checkWin(player)) {
                return player;
            }
        }
        
        // 检查平局
        if (this.board.every(cell => cell !== '')) {
            return 'draw';
        }
        
        return null;
    }
    
    checkWin(player) {
        return this.winningCombinations.some(combination => {
            return combination.every(index => this.board[index] === player);
        });
    }
    
    endGame(result) {
        this.gameActive = false;
        const gameTime = Math.floor((Date.now() - this.startTime) / 1000);
        
        // 高亮获胜组合
        if (result !== 'draw') {
            this.highlightWinningCombination(result);
        }
        
        // 更新统计
        this.updateStats(result);
        
        // 显示结果弹窗
        this.showVictoryPopup(result, gameTime);
    }
    
    highlightWinningCombination(winner) {
        for (let combination of this.winningCombinations) {
            if (combination.every(index => this.board[index] === winner)) {
                combination.forEach(index => {
                    document.querySelector(`[data-index="${index}"]`).classList.add('winning');
                });
                break;
            }
        }
    }
    
    showVictoryPopup(result, gameTime) {
        const minutes = Math.floor(gameTime / 60);
        const seconds = gameTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        let title, message;
        
        if (result === 'draw') {
            title = '🤝 平局';
            message = '势均力敌，不分胜负！';
        } else if (result === 'X') {
            if (this.gameMode === 'vs-ai') {
                title = '🎉 玩家获胜';
                message = '恭喜你击败了AI！';
            } else {
                title = '🎉 玩家X获胜';
                message = '玩家X获得了胜利！';
            }
        } else {
            if (this.gameMode === 'vs-ai') {
                title = '🤖 AI获胜';
                message = 'AI这次获胜了，再试一次吧！';
            } else {
                title = '🎉 玩家O获胜';
                message = '玩家O获得了胜利！';
            }
        }
        
        document.getElementById('victoryTitle').textContent = title;
        document.getElementById('victoryMessage').textContent = message;
        document.getElementById('finalMoves').textContent = this.moveHistory.length;
        document.getElementById('finalTime').textContent = timeString;
        document.getElementById('victoryPopup').classList.add('show');
    }
    
    closeVictory() {
        document.getElementById('victoryPopup').classList.remove('show');
    }
    
    undo() {
        if (this.moveHistory.length === 0 || !this.gameActive) return;
        
        // 在对战AI模式下，需要撤销两步（玩家和AI）
        const undoSteps = (this.gameMode === 'vs-ai' && this.moveHistory.length >= 2) ? 2 : 1;
        
        for (let i = 0; i < undoSteps && this.moveHistory.length > 0; i++) {
            const lastMove = this.moveHistory.pop();
            this.board[lastMove.index] = '';
            
            const cell = document.querySelector(`[data-index="${lastMove.index}"]`);
            cell.textContent = '';
            cell.className = 'cell';
        }
        
        // 恢复当前玩家
        this.currentPlayer = 'X';
        this.gameActive = true;
        
        this.updateDisplay();
    }
    
    getHint() {
        if (!this.gameActive) return;
        
        let hintMove = -1;
        
        // 根据当前玩家和游戏模式给出提示
        if (this.currentPlayer === 'X' || this.gameMode === 'vs-player') {
            if (this.difficulty === 'hard' || this.gameMode === 'vs-player') {
                hintMove = this.getBestMoveForPlayer(this.currentPlayer);
            } else {
                hintMove = this.getMediumMoveForPlayer(this.currentPlayer);
            }
        }
        
        if (hintMove !== -1) {
            const cell = document.querySelector(`[data-index="${hintMove}"]`);
            cell.classList.add('hint');
            
            setTimeout(() => {
                cell.classList.remove('hint');
            }, 3000);
            
            document.getElementById('gameMessage').textContent = `💡 建议下在位置 ${hintMove + 1}`;
        }
    }
    
    getBestMoveForPlayer(player) {
        const opponent = player === 'X' ? 'O' : 'X';
        
        // 尝试获胜
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = player;
                if (this.checkWin(player)) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // 阻止对手获胜
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = opponent;
                if (this.checkWin(opponent)) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // 选择最佳位置
        const preferredMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7];
        for (let move of preferredMoves) {
            if (this.board[move] === '') {
                return move;
            }
        }
        
        return -1;
    }
    
    getMediumMoveForPlayer(player) {
        const opponent = player === 'X' ? 'O' : 'X';
        
        // 尝试获胜
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === '') {
                this.board[i] = player;
                if (this.checkWin(player)) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        
        // 选择中心或角落
        const preferredMoves = [4, 0, 2, 6, 8];
        for (let move of preferredMoves) {
            if (this.board[move] === '') {
                return move;
            }
        }
        
        return this.getAvailableMoves()[0] || -1;
    }
    
    updateDisplay() {
        // 更新当前玩家显示
        const currentPlayerElement = document.getElementById('currentPlayer');
        if (this.gameMode === 'vs-ai') {
            currentPlayerElement.textContent = this.currentPlayer === 'X' ? '玩家 X' : 'AI O';
        } else {
            currentPlayerElement.textContent = `玩家 ${this.currentPlayer}`;
        }
        currentPlayerElement.className = this.currentPlayer === 'X' ? 'player-x' : 'player-o';
        
        // 更新游戏消息
        if (this.gameActive) {
            if (this.gameMode === 'vs-ai' && this.currentPlayer === 'O') {
                document.getElementById('gameMessage').textContent = 'AI正在思考...';
            } else {
                document.getElementById('gameMessage').textContent = '选择一个空格来下棋';
            }
        }
        
        // 更新统计显示
        document.getElementById('playerWins').textContent = this.gameStats.playerWins || 0;
        document.getElementById('draws').textContent = this.gameStats.draws || 0;
        document.getElementById('aiWins').textContent = this.gameStats.aiWins || 0;
        
        // 更新按钮状态
        document.getElementById('undoBtn').disabled = this.moveHistory.length === 0;
        document.getElementById('hintBtn').disabled = !this.gameActive;
    }
    
    updateStats(result) {
        if (this.gameMode === 'vs-ai') {
            if (result === 'X') {
                this.gameStats.playerWins = (this.gameStats.playerWins || 0) + 1;
            } else if (result === 'O') {
                this.gameStats.aiWins = (this.gameStats.aiWins || 0) + 1;
            } else {
                this.gameStats.draws = (this.gameStats.draws || 0) + 1;
            }
        } else {
            // 双人模式不区分AI和玩家
            if (result === 'draw') {
                this.gameStats.draws = (this.gameStats.draws || 0) + 1;
            } else {
                this.gameStats.playerWins = (this.gameStats.playerWins || 0) + 1;
            }
        }
        
        this.saveStats();
        this.updateDisplay();
    }
    
    resetStats() {
        if (confirm('确定要重置所有统计数据吗？')) {
            this.gameStats = { playerWins: 0, aiWins: 0, draws: 0 };
            this.saveStats();
            this.updateDisplay();
        }
    }
    
    loadStats() {
        try {
            return JSON.parse(localStorage.getItem('ticTacToeStats')) || {};
        } catch (e) {
            return {};
        }
    }
    
    saveStats() {
        localStorage.setItem('ticTacToeStats', JSON.stringify(this.gameStats));
    }
}

// 全局变量供HTML onclick调用
let ticTacToe;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    ticTacToe = new TicTacToe();
});