class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        this.snake = [
            {x: 10, y: 10}
        ];
        this.food = {};
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
        this.gameRunning = false;
        this.gameLoop = null;
        this.gameSpeed = 150;
        this.isPaused = false;
        
        this.initializeGame();
        this.updateUI();
    }
    
    initializeGame() {
        this.generateFood();
        this.bindEvents();
        document.getElementById('highScore').textContent = this.highScore;
    }
    
    bindEvents() {
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
    }
    
    generateFood() {
        this.food = {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
        
        for (let segment of this.snake) {
            if (segment.x === this.food.x && segment.y === this.food.y) {
                this.generateFood();
                return;
            }
        }
    }
    
    startGame() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        this.isPaused = false;
        this.dx = 1;
        this.dy = 0;
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        document.getElementById('gameOver').classList.remove('show');
        
        this.gameLoop = setInterval(() => {
            if (!this.isPaused) {
                this.update();
                this.draw();
            }
        }, this.gameSpeed);
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.isPaused = !this.isPaused;
        document.getElementById('pauseBtn').textContent = this.isPaused ? '继续' : '暂停';
    }
    
    resetGame() {
        this.stopGame();
        this.snake = [{x: 10, y: 10}];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameSpeed = 150;
        this.generateFood();
        this.updateUI();
        this.draw();
    }
    
    restartGame() {
        this.resetGame();
        this.startGame();
    }
    
    stopGame() {
        this.gameRunning = false;
        this.isPaused = false;
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = '暂停';
    }
    
    update() {
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.generateFood();
            this.increaseSpeed();
            this.updateUI();
        } else {
            this.snake.pop();
        }
    }
    
    checkCollision(head) {
        if (head.x < 0 || head.x >= this.tileCount || 
            head.y < 0 || head.y >= this.tileCount) {
            return true;
        }
        
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                return true;
            }
        }
        
        return false;
    }
    
    increaseSpeed() {
        if (this.gameSpeed > 80) {
            this.gameSpeed -= 5;
            clearInterval(this.gameLoop);
            this.gameLoop = setInterval(() => {
                if (!this.isPaused) {
                    this.update();
                    this.draw();
                }
            }, this.gameSpeed);
        }
    }
    
    gameOver() {
        this.stopGame();
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore.toString());
            document.getElementById('highScore').textContent = this.highScore;
        }
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').classList.add('show');
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
    }
    
    changeDirection(newDx, newDy) {
        if (!this.gameRunning || this.isPaused) return;
        
        if ((newDx === 1 && this.dx === -1) || 
            (newDx === -1 && this.dx === 1) ||
            (newDy === 1 && this.dy === -1) || 
            (newDy === -1 && this.dy === 1)) {
            return;
        }
        
        this.dx = newDx;
        this.dy = newDy;
    }
    
    draw() {
        this.ctx.fillStyle = '#1a202c';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#48bb78';
        for (let segment of this.snake) {
            this.ctx.fillRect(
                segment.x * this.gridSize, 
                segment.y * this.gridSize, 
                this.gridSize - 2, 
                this.gridSize - 2
            );
        }
        
        this.ctx.fillStyle = '#e53e3e';
        this.ctx.fillRect(
            this.food.x * this.gridSize, 
            this.food.y * this.gridSize, 
            this.gridSize - 2, 
            this.gridSize - 2
        );
        
        this.ctx.fillStyle = '#68d391';
        this.ctx.fillRect(
            this.snake[0].x * this.gridSize, 
            this.snake[0].y * this.gridSize, 
            this.gridSize - 2, 
            this.gridSize - 2
        );
    }
}

let game = new SnakeGame();