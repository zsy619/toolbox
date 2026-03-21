class Tetris {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('nextCanvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.blockSize = 30;
        this.boardWidth = 10;
        this.boardHeight = 20;
        
        this.board = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropTime = 0;
        this.dropInterval = 1000;
        this.gameRunning = false;
        this.isPaused = false;
        
        this.pieces = {
            I: { shape: [[1,1,1,1]], color: '#00f0f0' },
            O: { shape: [[1,1],[1,1]], color: '#f0f000' },
            T: { shape: [[0,1,0],[1,1,1]], color: '#a000f0' },
            S: { shape: [[0,1,1],[1,1,0]], color: '#00f000' },
            Z: { shape: [[1,1,0],[0,1,1]], color: '#f00000' },
            J: { shape: [[1,0,0],[1,1,1]], color: '#0000f0' },
            L: { shape: [[0,0,1],[1,1,1]], color: '#f0a000' }
        };
        
        this.init();
    }
    
    init() {
        this.initBoard();
        this.createNewPiece();
        this.bindEvents();
        this.updateUI();
        this.gameLoop();
    }
    
    initBoard() {
        this.board = Array(this.boardHeight).fill().map(() => Array(this.boardWidth).fill(0));
    }
    
    createNewPiece() {
        if (!this.nextPiece) {
            this.nextPiece = this.getRandomPiece();
        }
        
        this.currentPiece = this.nextPiece;
        this.currentPiece.x = Math.floor(this.boardWidth / 2) - Math.floor(this.currentPiece.shape[0].length / 2);
        this.currentPiece.y = 0;
        
        this.nextPiece = this.getRandomPiece();
        this.drawNextPiece();
        
        if (this.checkCollision(this.currentPiece, 0, 0)) {
            this.gameOver();
        }
    }
    
    getRandomPiece() {
        const pieces = Object.keys(this.pieces);
        const randomPiece = pieces[Math.floor(Math.random() * pieces.length)];
        const piece = this.pieces[randomPiece];
        
        return {
            shape: piece.shape,
            color: piece.color,
            x: 0,
            y: 0
        };
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning || this.isPaused) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    this.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    this.movePiece(0, 1);
                    break;
                case 'ArrowUp':
                case ' ':
                    this.rotatePiece();
                    break;
                case 'p':
                case 'P':
                    this.togglePause();
                    break;
            }
            e.preventDefault();
        });
        
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.gameRunning || this.isPaused) return;
                
                const action = btn.dataset.action;
                switch(action) {
                    case 'left':
                        this.movePiece(-1, 0);
                        break;
                    case 'right':
                        this.movePiece(1, 0);
                        break;
                    case 'down':
                        this.movePiece(0, 1);
                        break;
                    case 'rotate':
                        this.rotatePiece();
                        break;
                }
            });
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });
        
        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.hideMessage();
            this.restart();
        });
    }
    
    movePiece(dx, dy) {
        if (this.checkCollision(this.currentPiece, dx, dy)) {
            if (dy > 0) {
                this.placePiece();
            }
            return;
        }
        
        this.currentPiece.x += dx;
        this.currentPiece.y += dy;
    }
    
    rotatePiece() {
        const rotated = this.rotateMatrix(this.currentPiece.shape);
        const originalShape = this.currentPiece.shape;
        
        this.currentPiece.shape = rotated;
        
        if (this.checkCollision(this.currentPiece, 0, 0)) {
            this.currentPiece.shape = originalShape;
        }
    }
    
    rotateMatrix(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                rotated[j][rows - 1 - i] = matrix[i][j];
            }
        }
        
        return rotated;
    }
    
    checkCollision(piece, dx, dy) {
        const newX = piece.x + dx;
        const newY = piece.y + dy;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const boardX = newX + x;
                    const boardY = newY + y;
                    
                    if (boardX < 0 || boardX >= this.boardWidth || 
                        boardY >= this.boardHeight || 
                        (boardY >= 0 && this.board[boardY][boardX])) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    placePiece() {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const boardX = this.currentPiece.x + x;
                    const boardY = this.currentPiece.y + y;
                    
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            }
        }
        
        this.clearLines();
        this.createNewPiece();
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.boardHeight - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.boardWidth).fill(0));
                linesCleared++;
                y++; // Check the same line again
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * 100 * this.level;
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(50, 1000 - (this.level - 1) * 50);
            this.updateUI();
        }
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = this.isPaused ? '继续' : '暂停';
    }
    
    restart() {
        this.initBoard();
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropInterval = 1000;
        this.gameRunning = true;
        this.isPaused = false;
        this.createNewPiece();
        this.updateUI();
        document.getElementById('pauseBtn').textContent = '暂停';
    }
    
    gameOver() {
        this.gameRunning = false;
        document.getElementById('finalScore').textContent = this.score;
        this.showMessage();
    }
    
    showMessage() {
        document.getElementById('gameMessage').classList.add('show');
    }
    
    hideMessage() {
        document.getElementById('gameMessage').classList.remove('show');
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lines').textContent = this.lines;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw board
        this.drawBoard();
        
        // Draw current piece
        if (this.currentPiece) {
            this.drawPiece(this.currentPiece, this.ctx);
        }
        
        // Draw grid
        this.drawGrid();
    }
    
    drawBoard() {
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x]) {
                    this.ctx.fillStyle = this.board[y][x];
                    this.ctx.fillRect(x * this.blockSize, y * this.blockSize, 
                                    this.blockSize, this.blockSize);
                    
                    this.ctx.strokeStyle = '#333';
                    this.ctx.strokeRect(x * this.blockSize, y * this.blockSize, 
                                      this.blockSize, this.blockSize);
                }
            }
        }
    }
    
    drawPiece(piece, context) {
        context.fillStyle = piece.color;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const drawX = (piece.x + x) * this.blockSize;
                    const drawY = (piece.y + y) * this.blockSize;
                    
                    context.fillRect(drawX, drawY, this.blockSize, this.blockSize);
                    context.strokeStyle = '#333';
                    context.strokeRect(drawX, drawY, this.blockSize, this.blockSize);
                }
            }
        }
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 0.5;
        
        for (let x = 0; x <= this.boardWidth; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.blockSize, 0);
            this.ctx.lineTo(x * this.blockSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.boardHeight; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.blockSize);
            this.ctx.lineTo(this.canvas.width, y * this.blockSize);
            this.ctx.stroke();
        }
    }
    
    drawNextPiece() {
        this.nextCtx.fillStyle = '#000';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (this.nextPiece) {
            const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * 20) / 2;
            const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * 20) / 2;
            
            this.nextCtx.fillStyle = this.nextPiece.color;
            
            for (let y = 0; y < this.nextPiece.shape.length; y++) {
                for (let x = 0; x < this.nextPiece.shape[y].length; x++) {
                    if (this.nextPiece.shape[y][x]) {
                        this.nextCtx.fillRect(offsetX + x * 20, offsetY + y * 20, 20, 20);
                        this.nextCtx.strokeStyle = '#333';
                        this.nextCtx.strokeRect(offsetX + x * 20, offsetY + y * 20, 20, 20);
                    }
                }
            }
        }
    }
    
    gameLoop(currentTime = 0) {
        if (this.gameRunning && !this.isPaused) {
            if (currentTime - this.dropTime > this.dropInterval) {
                this.movePiece(0, 1);
                this.dropTime = currentTime;
            }
        }
        
        this.draw();
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new Tetris();
    game.gameRunning = true;
});