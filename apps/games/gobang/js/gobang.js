class GobangGame {
    constructor() {
        this.canvas = document.getElementById('gameBoard');
        this.ctx = this.canvas.getContext('2d');
        this.boardSize = 15;
        this.cellSize = 40;
        this.pieceRadius = 18;
        this.padding = 0;
        
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
        this.currentPlayer = 1; // 1=黑棋, 2=白棋
        this.gameOver = false;
        this.moveHistory = [];
        this.scores = { black: 0, white: 0 };
        
        this.initializeGame();
    }
    
    initializeGame() {
        this.drawBoard();
        this.bindEvents();
        this.updateUI();
        
        this.canvas.width = this.boardSize * this.cellSize;
        this.canvas.height = this.boardSize * this.cellSize;
        this.drawBoard();
    }
    
    bindEvents() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        
        document.getElementById('newGameBtn').addEventListener('click', () => this.newGame());
        document.getElementById('undoBtn').addEventListener('click', () => this.undoMove());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.newGame());
        
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseleave', () => this.clearPreview());
    }
    
    drawBoard() {
        this.ctx.fillStyle = '#DEB887';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.boardSize; i++) {
            const pos = i * this.cellSize + this.cellSize / 2;
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.cellSize / 2, pos);
            this.ctx.lineTo(this.canvas.width - this.cellSize / 2, pos);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(pos, this.cellSize / 2);
            this.ctx.lineTo(pos, this.canvas.height - this.cellSize / 2);
            this.ctx.stroke();
        }
        
        const starPoints = [
            [3, 3], [3, 11], [11, 3], [11, 11], [7, 7]
        ];
        
        this.ctx.fillStyle = '#8B4513';
        starPoints.forEach(([x, y]) => {
            const centerX = x * this.cellSize + this.cellSize / 2;
            const centerY = y * this.cellSize + this.cellSize / 2;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, 3, 0, 2 * Math.PI);
            this.ctx.fill();
        });
        
        this.drawPieces();
    }
    
    drawPieces() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] !== 0) {
                    this.drawPiece(row, col, this.board[row][col]);
                }
            }
        }
    }
    
    drawPiece(row, col, player) {
        const centerX = col * this.cellSize + this.cellSize / 2;
        const centerY = row * this.cellSize + this.cellSize / 2;
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, this.pieceRadius, 0, 2 * Math.PI);
        
        if (player === 1) {
            this.ctx.fillStyle = '#000';
            this.ctx.fill();
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        } else {
            this.ctx.fillStyle = '#fff';
            this.ctx.fill();
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }
    
    drawPreviewPiece(row, col, player) {
        const centerX = col * this.cellSize + this.cellSize / 2;
        const centerY = row * this.cellSize + this.cellSize / 2;
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, this.pieceRadius, 0, 2 * Math.PI);
        
        if (player === 1) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        } else {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        }
        this.ctx.fill();
        
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }
    
    handleClick(e) {
        if (this.gameOver) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const col = Math.round((x - this.cellSize / 2) / this.cellSize);
        const row = Math.round((y - this.cellSize / 2) / this.cellSize);
        
        if (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize) {
            if (this.board[row][col] === 0) {
                this.makeMove(row, col);
            }
        }
    }
    
    handleMouseMove(e) {
        if (this.gameOver) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const col = Math.round((x - this.cellSize / 2) / this.cellSize);
        const row = Math.round((y - this.cellSize / 2) / this.cellSize);
        
        if (row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize && this.board[row][col] === 0) {
            this.drawBoard();
            this.drawPreviewPiece(row, col, this.currentPlayer);
        }
    }
    
    clearPreview() {
        this.drawBoard();
    }
    
    makeMove(row, col) {
        this.board[row][col] = this.currentPlayer;
        this.moveHistory.push({ row, col, player: this.currentPlayer });
        
        this.drawBoard();
        
        if (this.checkWin(row, col)) {
            this.endGame(this.currentPlayer);
        } else if (this.isBoardFull()) {
            this.endGame(0);
        } else {
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
            this.updateUI();
        }
    }
    
    checkWin(row, col) {
        const directions = [
            [0, 1],   // 水平
            [1, 0],   // 垂直
            [1, 1],   // 正斜线
            [1, -1]   // 反斜线
        ];
        
        const player = this.board[row][col];
        
        for (let [dx, dy] of directions) {
            let count = 1;
            
            // 正方向
            for (let i = 1; i < 5; i++) {
                const newRow = row + dx * i;
                const newCol = col + dy * i;
                if (newRow >= 0 && newRow < this.boardSize && 
                    newCol >= 0 && newCol < this.boardSize && 
                    this.board[newRow][newCol] === player) {
                    count++;
                } else {
                    break;
                }
            }
            
            // 反方向
            for (let i = 1; i < 5; i++) {
                const newRow = row - dx * i;
                const newCol = col - dy * i;
                if (newRow >= 0 && newRow < this.boardSize && 
                    newCol >= 0 && newCol < this.boardSize && 
                    this.board[newRow][newCol] === player) {
                    count++;
                } else {
                    break;
                }
            }
            
            if (count >= 5) {
                return true;
            }
        }
        
        return false;
    }
    
    isBoardFull() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === 0) {
                    return false;
                }
            }
        }
        return true;
    }
    
    endGame(winner) {
        this.gameOver = true;
        
        if (winner === 1) {
            this.scores.black++;
            document.getElementById('resultText').textContent = '黑棋获胜！';
        } else if (winner === 2) {
            this.scores.white++;
            document.getElementById('resultText').textContent = '白棋获胜！';
        } else {
            document.getElementById('resultText').textContent = '平局！';
        }
        
        this.updateScores();
        document.getElementById('gameResult').classList.add('show');
    }
    
    undoMove() {
        if (this.moveHistory.length === 0 || this.gameOver) return;
        
        const lastMove = this.moveHistory.pop();
        this.board[lastMove.row][lastMove.col] = 0;
        this.currentPlayer = lastMove.player;
        this.drawBoard();
        this.updateUI();
    }
    
    newGame() {
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
        this.currentPlayer = 1;
        this.gameOver = false;
        this.moveHistory = [];
        
        document.getElementById('gameResult').classList.remove('show');
        this.drawBoard();
        this.updateUI();
    }
    
    resetGame() {
        this.newGame();
        this.scores = { black: 0, white: 0 };
        this.updateScores();
    }
    
    updateUI() {
        const currentPlayerElement = document.getElementById('currentPlayer');
        if (this.currentPlayer === 1) {
            currentPlayerElement.textContent = '黑棋';
            currentPlayerElement.className = 'black';
        } else {
            currentPlayerElement.textContent = '白棋';
            currentPlayerElement.className = 'white';
        }
        
        document.getElementById('undoBtn').disabled = this.moveHistory.length === 0 || this.gameOver;
    }
    
    updateScores() {
        document.getElementById('blackScore').textContent = this.scores.black;
        document.getElementById('whiteScore').textContent = this.scores.white;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GobangGame();
});