class Minesweeper {
    constructor() {
        this.difficulties = {
            beginner: { rows: 9, cols: 9, mines: 10 },
            intermediate: { rows: 16, cols: 16, mines: 40 },
            expert: { rows: 16, cols: 30, mines: 99 }
        };
        
        this.currentDifficulty = 'beginner';
        this.board = [];
        this.gameState = 'ready'; // ready, playing, won, lost
        this.firstClick = true;
        this.timer = 0;
        this.timerInterval = null;
        this.minesRemaining = 0;
        this.cellsRevealed = 0;
        
        this.initializeGame();
        this.bindEvents();
    }
    
    initializeGame() {
        const config = this.difficulties[this.currentDifficulty];
        this.rows = config.rows;
        this.cols = config.cols;
        this.totalMines = config.mines;
        this.minesRemaining = this.totalMines;
        this.cellsRevealed = 0;
        
        this.createBoard();
        this.renderBoard();
        this.updateUI();
    }
    
    createBoard() {
        this.board = [];
        for (let row = 0; row < this.rows; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.board[row][col] = {
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighborMines: 0
                };
            }
        }
    }
    
    placeMines(firstClickRow, firstClickCol) {
        let minesPlaced = 0;
        while (minesPlaced < this.totalMines) {
            let row = Math.floor(Math.random() * this.rows);
            let col = Math.floor(Math.random() * this.cols);
            
            // Don't place mine on first click or if already has mine
            if ((row === firstClickRow && col === firstClickCol) || 
                this.board[row][col].isMine) {
                continue;
            }
            
            this.board[row][col].isMine = true;
            minesPlaced++;
        }
        
        this.calculateNeighborMines();
    }
    
    calculateNeighborMines() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (!this.board[row][col].isMine) {
                    let count = 0;
                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            let newRow = row + i;
                            let newCol = col + j;
                            if (this.isValidCell(newRow, newCol) && 
                                this.board[newRow][newCol].isMine) {
                                count++;
                            }
                        }
                    }
                    this.board[row][col].neighborMines = count;
                }
            }
        }
    }
    
    isValidCell(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }
    
    renderBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
        gameBoard.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                gameBoard.appendChild(cell);
            }
        }
    }
    
    bindEvents() {
        const gameBoard = document.getElementById('gameBoard');
        
        gameBoard.addEventListener('click', (e) => {
            if (e.target.classList.contains('cell')) {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                this.handleCellClick(row, col);
            }
        });
        
        gameBoard.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('cell')) {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                this.handleRightClick(row, col);
            }
        });
        
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeDifficulty(e.target.dataset.level);
            });
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartGame();
        });
        
        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.newGame();
        });
    }
    
    handleCellClick(row, col) {
        if (this.gameState === 'won' || this.gameState === 'lost') return;
        
        const cell = this.board[row][col];
        if (cell.isRevealed || cell.isFlagged) return;
        
        if (this.firstClick) {
            this.placeMines(row, col);
            this.firstClick = false;
            this.gameState = 'playing';
            this.startTimer();
        }
        
        this.revealCell(row, col);
        this.updateCellDisplay(row, col);
        this.checkGameEnd();
    }
    
    handleRightClick(row, col) {
        if (this.gameState === 'won' || this.gameState === 'lost') return;
        
        const cell = this.board[row][col];
        if (cell.isRevealed) return;
        
        cell.isFlagged = !cell.isFlagged;
        
        if (cell.isFlagged) {
            this.minesRemaining--;
        } else {
            this.minesRemaining++;
        }
        
        this.updateCellDisplay(row, col);
        this.updateUI();
    }
    
    revealCell(row, col) {
        const cell = this.board[row][col];
        if (cell.isRevealed || cell.isFlagged) return;
        
        cell.isRevealed = true;
        this.cellsRevealed++;
        
        if (cell.isMine) {
            this.gameState = 'lost';
            this.revealAllMines();
            return;
        }
        
        // If no neighboring mines, reveal all adjacent cells
        if (cell.neighborMines === 0) {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    let newRow = row + i;
                    let newCol = col + j;
                    if (this.isValidCell(newRow, newCol)) {
                        this.revealCell(newRow, newCol);
                    }
                }
            }
        }
    }
    
    revealAllMines() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.board[row][col].isMine) {
                    this.board[row][col].isRevealed = true;
                    this.updateCellDisplay(row, col);
                }
            }
        }
    }
    
    updateCellDisplay(row, col) {
        const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        const cell = this.board[row][col];
        
        cellElement.className = 'cell';
        cellElement.textContent = '';
        
        if (cell.isFlagged && !cell.isRevealed) {
            cellElement.classList.add('flagged');
            cellElement.textContent = '🚩';
        } else if (cell.isRevealed) {
            cellElement.classList.add('revealed');
            
            if (cell.isMine) {
                cellElement.classList.add('mine');
                cellElement.textContent = '💣';
            } else if (cell.neighborMines > 0) {
                cellElement.classList.add(`number-${cell.neighborMines}`);
                cellElement.textContent = cell.neighborMines;
            }
        }
    }
    
    checkGameEnd() {
        const totalCells = this.rows * this.cols;
        const safeCells = totalCells - this.totalMines;
        
        if (this.cellsRevealed === safeCells) {
            this.gameState = 'won';
            this.stopTimer();
            this.showMessage('恭喜!', '你成功扫除了所有地雷!');
            document.getElementById('restartBtn').textContent = '😎';
        } else if (this.gameState === 'lost') {
            this.stopTimer();
            this.showMessage('游戏结束', '你触到地雷了!');
            document.getElementById('restartBtn').textContent = '😵';
        }
    }
    
    showMessage(title, text) {
        document.getElementById('messageTitle').textContent = title;
        document.getElementById('messageText').textContent = text;
        document.getElementById('gameMessage').classList.add('show');
    }
    
    hideMessage() {
        document.getElementById('gameMessage').classList.remove('show');
    }
    
    startTimer() {
        this.timer = 0;
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateUI();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    changeDifficulty(level) {
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-level="${level}"]`).classList.add('active');
        
        this.currentDifficulty = level;
        this.restartGame();
    }
    
    restartGame() {
        this.stopTimer();
        this.gameState = 'ready';
        this.firstClick = true;
        this.timer = 0;
        this.hideMessage();
        document.getElementById('restartBtn').textContent = '😐';
        
        this.initializeGame();
    }
    
    newGame() {
        this.hideMessage();
        this.restartGame();
    }
    
    updateUI() {
        document.getElementById('mineCount').textContent = this.minesRemaining.toString().padStart(3, '0');
        document.getElementById('timer').textContent = this.timer.toString().padStart(3, '0');
        
        const totalCells = this.rows * this.cols;
        const remaining = totalCells - this.cellsRevealed - this.totalMines;
        document.getElementById('remaining').textContent = Math.max(0, remaining).toString().padStart(2, '0');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Minesweeper();
});