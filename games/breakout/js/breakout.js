class Breakout {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.gameState = 'ready'; // ready, playing, paused, gameOver, levelComplete
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        
        // Paddle
        this.paddle = {
            width: 100,
            height: 15,
            x: this.canvas.width / 2 - 50,
            y: this.canvas.height - 30,
            speed: 8,
            color: '#fff'
        };
        
        // Ball
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 50,
            radius: 8,
            speedX: 0,
            speedY: 0,
            maxSpeed: 6,
            color: '#fff',
            trail: []
        };
        
        // Bricks
        this.bricks = [];
        this.brickRows = 8;
        this.brickCols = 14;
        this.brickWidth = 50;
        this.brickHeight = 20;
        this.brickPadding = 3;
        this.brickOffsetTop = 60;
        this.brickOffsetLeft = 35;
        
        // Input
        this.keys = {};
        this.mouseX = 0;
        
        // Particles
        this.particles = [];
        
        this.init();
    }
    
    init() {
        this.createBricks();
        this.bindEvents();
        this.updateUI();
        this.gameLoop();
    }
    
    createBricks() {
        this.bricks = [];
        const colors = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6', '#1abc9c', '#34495e'];
        
        for (let row = 0; row < this.brickRows; row++) {
            for (let col = 0; col < this.brickCols; col++) {
                const brickX = col * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
                const brickY = row * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
                
                this.bricks.push({
                    x: brickX,
                    y: brickY,
                    width: this.brickWidth,
                    height: this.brickHeight,
                    color: colors[row],
                    destroyed: false,
                    points: (this.brickRows - row) * 10 // 上层砖块分数更高
                });
            }
        }
    }
    
    bindEvents() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            if (e.key === ' ') {
                e.preventDefault();
                if (this.gameState === 'ready') {
                    this.startGame();
                }
            } else if (e.key === 'p' || e.key === 'P') {
                this.togglePause();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Mouse events
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
        });
        
        // Button events
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('newGameBtn').addEventListener('click', () => this.restartGame());
        
        // Touch events for mobile
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.touches[0].clientX - rect.left;
        });
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.gameState === 'ready') {
                this.startGame();
            }
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.ball.speedX = (Math.random() - 0.5) * 4;
        this.ball.speedY = -4;
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseBtn').textContent = '继续';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseBtn').textContent = '暂停';
        }
    }
    
    restartGame() {
        this.gameState = 'ready';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        
        // Reset paddle
        this.paddle.x = this.canvas.width / 2 - this.paddle.width / 2;
        
        // Reset ball
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height - 50;
        this.ball.speedX = 0;
        this.ball.speedY = 0;
        this.ball.trail = [];
        
        // Reset bricks
        this.createBricks();
        
        // Reset particles
        this.particles = [];
        
        this.updateUI();
        this.hideMessage();
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = '暂停';
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        this.updatePaddle();
        this.updateBall();
        this.updateParticles();
        this.checkCollisions();
        this.checkGameState();
    }
    
    updatePaddle() {
        // Keyboard control
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) {
            this.paddle.x -= this.paddle.speed;
        }
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) {
            this.paddle.x += this.paddle.speed;
        }
        
        // Mouse control
        if (this.mouseX > 0) {
            this.paddle.x = this.mouseX - this.paddle.width / 2;
        }
        
        // Keep paddle within bounds
        this.paddle.x = Math.max(0, Math.min(this.canvas.width - this.paddle.width, this.paddle.x));
    }
    
    updateBall() {
        // Add trail effect
        this.ball.trail.push({ x: this.ball.x, y: this.ball.y });
        if (this.ball.trail.length > 10) {
            this.ball.trail.shift();
        }
        
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;
        
        // Ball collision with walls
        if (this.ball.x <= this.ball.radius || this.ball.x >= this.canvas.width - this.ball.radius) {
            this.ball.speedX = -this.ball.speedX;
            this.createParticles(this.ball.x, this.ball.y, '#fff');
        }
        
        if (this.ball.y <= this.ball.radius) {
            this.ball.speedY = -this.ball.speedY;
            this.createParticles(this.ball.x, this.ball.y, '#fff');
        }
        
        // Ball falls below paddle
        if (this.ball.y > this.canvas.height) {
            this.lives--;
            this.resetBall();
            
            if (this.lives <= 0) {
                this.gameOver();
            }
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    checkCollisions() {
        // Ball-paddle collision
        if (this.ball.y + this.ball.radius >= this.paddle.y &&
            this.ball.x >= this.paddle.x &&
            this.ball.x <= this.paddle.x + this.paddle.width) {
            
            // Calculate hit position relative to paddle center
            const hitPos = (this.ball.x - (this.paddle.x + this.paddle.width / 2)) / (this.paddle.width / 2);
            
            this.ball.speedX = hitPos * this.ball.maxSpeed;
            this.ball.speedY = -Math.abs(this.ball.speedY);
            
            this.createParticles(this.ball.x, this.ball.y, this.paddle.color);
        }
        
        // Ball-brick collisions
        for (let brick of this.bricks) {
            if (!brick.destroyed && this.ballBrickCollision(this.ball, brick)) {
                brick.destroyed = true;
                this.score += brick.points;
                
                this.createParticles(brick.x + brick.width / 2, brick.y + brick.height / 2, brick.color);
                
                // Simple collision response
                this.ball.speedY = -this.ball.speedY;
                
                break; // Only hit one brick per frame
            }
        }
    }
    
    ballBrickCollision(ball, brick) {
        return ball.x + ball.radius >= brick.x &&
               ball.x - ball.radius <= brick.x + brick.width &&
               ball.y + ball.radius >= brick.y &&
               ball.y - ball.radius <= brick.y + brick.height;
    }
    
    createParticles(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: color,
                life: 30
            });
        }
    }
    
    checkGameState() {
        // Check if all bricks are destroyed
        const remainingBricks = this.bricks.filter(brick => !brick.destroyed);
        
        if (remainingBricks.length === 0) {
            this.levelComplete();
        }
    }
    
    levelComplete() {
        this.gameState = 'levelComplete';
        this.level++;
        
        // Bonus points for remaining lives
        this.score += this.lives * 100;
        
        setTimeout(() => {
            this.showMessage('过关了！', `第${this.level - 1}关完成！准备下一关...`);
            
            setTimeout(() => {
                this.nextLevel();
            }, 2000);
        }, 1000);
    }
    
    nextLevel() {
        this.createBricks();
        this.resetBall();
        this.gameState = 'ready';
        this.hideMessage();
        
        // Increase difficulty slightly
        this.ball.maxSpeed = Math.min(8, this.ball.maxSpeed + 0.5);
        
        this.updateUI();
    }
    
    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height - 50;
        this.ball.speedX = 0;
        this.ball.speedY = 0;
        this.ball.trail = [];
        this.gameState = 'ready';
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        this.showMessage('游戏结束', `最终得分: ${this.score}`);
    }
    
    showMessage(title, text) {
        document.getElementById('messageTitle').textContent = title;
        document.getElementById('messageText').textContent = text;
        document.getElementById('gameMessage').classList.add('show');
    }
    
    hideMessage() {
        document.getElementById('gameMessage').classList.remove('show');
    }
    
    draw() {
        // Clear canvas with gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawBricks();
        this.drawPaddle();
        this.drawBall();
        this.drawParticles();
        
        if (this.gameState === 'ready') {
            this.drawStartText();
        } else if (this.gameState === 'paused') {
            this.drawPausedText();
        }
    }
    
    drawBricks() {
        for (let brick of this.bricks) {
            if (!brick.destroyed) {
                // Draw brick with gradient
                const gradient = this.ctx.createLinearGradient(brick.x, brick.y, brick.x, brick.y + brick.height);
                gradient.addColorStop(0, brick.color);
                gradient.addColorStop(1, this.darkenColor(brick.color, 0.3));
                
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
                
                // Draw brick border
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
            }
        }
    }
    
    drawPaddle() {
        // Draw paddle with gradient
        const gradient = this.ctx.createLinearGradient(this.paddle.x, this.paddle.y, this.paddle.x, this.paddle.y + this.paddle.height);
        gradient.addColorStop(0, '#fff');
        gradient.addColorStop(1, '#ccc');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        
        // Draw paddle border
        this.ctx.strokeStyle = '#999';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
    }
    
    drawBall() {
        // Draw ball trail
        this.ctx.globalAlpha = 0.3;
        for (let i = 0; i < this.ball.trail.length; i++) {
            const point = this.ball.trail[i];
            const alpha = i / this.ball.trail.length * 0.3;
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, this.ball.radius * (i / this.ball.trail.length), 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Draw ball
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw ball highlight
        this.ctx.fillStyle = '#f0f0f0';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x - 2, this.ball.y - 2, this.ball.radius / 3, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawParticles() {
        for (let particle of this.particles) {
            this.ctx.globalAlpha = particle.life / 30;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x, particle.y, 3, 3);
        }
        this.ctx.globalAlpha = 1;
    }
    
    drawStartText() {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('按空格键或点击开始游戏', this.canvas.width / 2, this.canvas.height / 2);
    }
    
    drawPausedText() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏暂停', this.canvas.width / 2, this.canvas.height / 2);
    }
    
    darkenColor(color, amount) {
        // Simple color darkening function
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
        const g = Math.max(0, (num >> 8 & 0x00FF) - Math.round(255 * amount));
        const b = Math.max(0, (num & 0x0000FF) - Math.round(255 * amount));
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Breakout();
});