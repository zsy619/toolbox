class NumberPuzzle {
    constructor() {
        this.size = 4;
        this.board = [];
        this.score = 0;
        this.bestScore = this.loadBestScore();
        this.moves = 0;
        this.gameWon = false;
        this.gameOver = false;
        this.previousStates = [];
        this.maxUndoStates = 10;
        
        // 触摸控制
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.minSwipeDistance = 50;
        
        this.init();
    }
    
    init() {
        this.initBoard();
        this.bindEvents();
        this.updateDisplay();
        this.newGame();
    }
    
    initBoard() {
        this.board = [];
        for (let i = 0; i < this.size; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.board[i][j] = 0;
            }
        }
    }
    
    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    this.move('up');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.move('down');
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.move('left');
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.move('right');
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.newGame();
                    break;
            }
        });
        
        // 触摸事件
        const gameBoard = document.getElementById('gameBoard');
        
        gameBoard.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
        });
        
        gameBoard.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });
        
        gameBoard.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (this.gameOver) return;
            
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - this.touchStartX;
            const deltaY = touch.clientY - this.touchStartY;
            
            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);
            
            if (Math.max(absDeltaX, absDeltaY) > this.minSwipeDistance) {
                if (absDeltaX > absDeltaY) {
                    // 水平滑动
                    if (deltaX > 0) {
                        this.move('right');
                    } else {
                        this.move('left');
                    }
                } else {
                    // 垂直滑动
                    if (deltaY > 0) {
                        this.move('down');
                    } else {
                        this.move('up');
                    }
                }
            }
        });
        
        // 鼠标事件（用于桌面设备的拖拽）
        let mouseDown = false;
        let mouseStartX = 0;
        let mouseStartY = 0;
        
        gameBoard.addEventListener('mousedown', (e) => {
            mouseDown = true;
            mouseStartX = e.clientX;
            mouseStartY = e.clientY;
        });
        
        gameBoard.addEventListener('mousemove', (e) => {
            if (!mouseDown) return;
            e.preventDefault();
        });
        
        gameBoard.addEventListener('mouseup', (e) => {
            if (!mouseDown || this.gameOver) return;
            mouseDown = false;
            
            const deltaX = e.clientX - mouseStartX;
            const deltaY = e.clientY - mouseStartY;
            
            const absDeltaX = Math.abs(deltaX);
            const absDeltaY = Math.abs(deltaY);
            
            if (Math.max(absDeltaX, absDeltaY) > this.minSwipeDistance) {
                if (absDeltaX > absDeltaY) {
                    if (deltaX > 0) {
                        this.move('right');
                    } else {
                        this.move('left');
                    }
                } else {
                    if (deltaY > 0) {
                        this.move('down');
                    } else {
                        this.move('up');
                    }
                }
            }
        });
    }
    
    newGame() {
        this.initBoard();
        this.score = 0;
        this.moves = 0;
        this.gameWon = false;
        this.gameOver = false;
        this.previousStates = [];
        
        // 添加两个初始瓦片
        this.addRandomTile();
        this.addRandomTile();
        
        this.updateDisplay();
        this.renderBoard();
    }
    
    saveState() {
        const state = {
            board: this.board.map(row => [...row]),
            score: this.score,
            moves: this.moves
        };
        
        this.previousStates.push(state);
        
        // 限制历史状态数量
        if (this.previousStates.length > this.maxUndoStates) {
            this.previousStates.shift();
        }
        
        // 更新撤销按钮状态
        document.getElementById('undoBtn').disabled = false;
    }
    
    undo() {
        if (this.previousStates.length === 0) return;
        
        const previousState = this.previousStates.pop();
        this.board = previousState.board;
        this.score = previousState.score;
        this.moves = previousState.moves;
        
        // 更新撤销按钮状态
        if (this.previousStates.length === 0) {
            document.getElementById('undoBtn').disabled = true;
        }
        
        this.updateDisplay();
        this.renderBoard();
    }
    
    move(direction) {
        if (this.gameOver) return;
        
        this.saveState(); // 保存当前状态
        
        const previousBoard = this.board.map(row => [...row]);
        let moved = false;
        let scoreAdded = 0;
        
        if (direction === 'left') {
            for (let i = 0; i < this.size; i++) {
                const result = this.slideArray(this.board[i]);
                this.board[i] = result.array;
                scoreAdded += result.score;
                if (result.moved) moved = true;
            }
        } else if (direction === 'right') {
            for (let i = 0; i < this.size; i++) {
                const result = this.slideArray([...this.board[i]].reverse());
                this.board[i] = result.array.reverse();
                scoreAdded += result.score;
                if (result.moved) moved = true;
            }
        } else if (direction === 'up') {
            for (let j = 0; j < this.size; j++) {
                const column = [];
                for (let i = 0; i < this.size; i++) {
                    column.push(this.board[i][j]);
                }
                const result = this.slideArray(column);
                for (let i = 0; i < this.size; i++) {
                    this.board[i][j] = result.array[i];
                }
                scoreAdded += result.score;
                if (result.moved) moved = true;
            }
        } else if (direction === 'down') {
            for (let j = 0; j < this.size; j++) {
                const column = [];
                for (let i = 0; i < this.size; i++) {
                    column.push(this.board[i][j]);
                }
                const result = this.slideArray([...column].reverse());
                for (let i = 0; i < this.size; i++) {
                    this.board[i][j] = result.array.reverse()[i];
                }
                scoreAdded += result.score;
                if (result.moved) moved = true;
            }
        }
        
        if (moved) {
            this.score += scoreAdded;
            this.moves++;
            this.addRandomTile();
            this.updateDisplay();
            this.renderBoard();
            
            // 检查胜利条件
            if (!this.gameWon && this.hasWon()) {
                this.gameWon = true;
                setTimeout(() => this.showVictory(), 500);
            }
            
            // 检查游戏结束
            if (this.isGameOver()) {
                this.gameOver = true;
                setTimeout(() => this.showGameOver(), 500);
            }
        } else {
            // 移动无效，撤销保存的状态
            this.previousStates.pop();
        }
    }
    
    slideArray(arr) {
        const filtered = arr.filter(val => val !== 0);
        const missing = this.size - filtered.length;
        const zeros = Array(missing).fill(0);
        const newArray = filtered.concat(zeros);
        
        let score = 0;
        let moved = false;
        
        // 检查是否有移动
        for (let i = 0; i < this.size; i++) {
            if (arr[i] !== newArray[i]) {
                moved = true;
                break;
            }
        }
        
        // 合并相同的数字
        for (let i = 0; i < this.size - 1; i++) {
            if (newArray[i] !== 0 && newArray[i] === newArray[i + 1]) {
                newArray[i] *= 2;
                newArray[i + 1] = 0;
                score += newArray[i];
                moved = true;
            }
        }
        
        // 再次过滤和填充
        const filtered2 = newArray.filter(val => val !== 0);
        const missing2 = this.size - filtered2.length;
        const zeros2 = Array(missing2).fill(0);
        const finalArray = filtered2.concat(zeros2);
        
        return {
            array: finalArray,
            score: score,
            moved: moved
        };
    }
    
    addRandomTile() {
        const emptyCells = [];
        
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) {
                    emptyCells.push({row: i, col: j});
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const value = Math.random() < 0.9 ? 2 : 4;
            this.board[randomCell.row][randomCell.col] = value;
        }
    }
    
    hasWon() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 2048) {
                    return true;
                }
            }
        }
        return false;
    }
    
    isGameOver() {
        // 检查是否还有空格
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) {
                    return false;
                }
            }
        }
        
        // 检查是否还可以合并
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const current = this.board[i][j];
                
                // 检查右侧
                if (j < this.size - 1 && current === this.board[i][j + 1]) {
                    return false;
                }
                
                // 检查下方
                if (i < this.size - 1 && current === this.board[i + 1][j]) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    renderBoard() {
        const container = document.getElementById('tileContainer');
        container.innerHTML = '';
        
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${this.board[i][j]}`;
                    tile.textContent = this.board[i][j];
                    
                    // 计算位置
                    const size = 85;
                    const gap = 10;
                    const left = j * (size + gap);
                    const top = i * (size + gap);
                    
                    tile.style.left = left + 'px';
                    tile.style.top = top + 'px';
                    
                    // 新瓦片动画
                    if (this.isNewTile(i, j)) {
                        tile.classList.add('tile-new');
                    }
                    
                    container.appendChild(tile);
                }
            }
        }
    }
    
    isNewTile(row, col) {
        // 简化的新瓦片检测（实际实现中可能需要更复杂的逻辑）
        return this.moves === 0 || Math.random() < 0.1;
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('moves').textContent = this.moves;
        document.getElementById('bestScore').textContent = this.bestScore;
        
        // 更新最佳分数
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore();
        }
    }
    
    getBestTile() {
        let max = 0;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] > max) {
                    max = this.board[i][j];
                }
            }
        }
        return max;
    }
    
    showVictory() {
        document.getElementById('victoryScore').textContent = this.score;
        document.getElementById('victoryMoves').textContent = this.moves;
        document.getElementById('victoryPopup').classList.add('show');
    }
    
    closeVictory() {
        document.getElementById('victoryPopup').classList.remove('show');
    }
    
    continueGame() {
        // 继续游戏，允许玩家追求更高分数
        this.closeVictory();
    }
    
    showGameOver() {
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalMoves').textContent = this.moves;
        document.getElementById('bestTile').textContent = this.getBestTile();
        document.getElementById('gameOverPopup').classList.add('show');
    }
    
    closeGameOver() {
        document.getElementById('gameOverPopup').classList.remove('show');
    }
    
    showHelp() {
        document.getElementById('helpPopup').classList.add('show');
    }
    
    closeHelp() {
        document.getElementById('helpPopup').classList.remove('show');
    }
    
    loadBestScore() {
        const saved = localStorage.getItem('numberPuzzle2048_bestScore');
        return saved ? parseInt(saved) : 0;
    }
    
    saveBestScore() {
        localStorage.setItem('numberPuzzle2048_bestScore', this.bestScore.toString());
    }
}

// 全局变量供HTML onclick调用
let numberPuzzle;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    numberPuzzle = new NumberPuzzle();
});