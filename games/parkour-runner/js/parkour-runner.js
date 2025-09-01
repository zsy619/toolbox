/**
 * 跑酷游戏 - 扁平化设计版本
 * 特色功能：自动奔跑、跳跃翻滚、滑铲闪避
 */

class ParkourGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.gameState = 'menu';
        this.gameStartTime = 0;
        this.gameTime = 0;
        
        // 玩家数据
        this.player = {
            x: 100,
            y: 350,
            width: 30,
            height: 50,
            velocityY: 0,
            speed: 8,
            isJumping: false,
            isSliding: false,
            isRolling: false,
            lives: 3,
            distance: 0,
            score: 0
        };
        
        // 物理系统
        this.physics = {
            gravity: 0.8,
            jumpPower: -15,
            groundY: 350
        };
        
        // 键盘状态
        this.keys = {};
        
        // 游戏元素
        this.obstacles = [];
        this.coins = [];
        this.background = { x: 0 };
        
        // 性能统计
        this.stats = {
            currentScore: 0,
            highScore: parseInt(localStorage.getItem('parkourHighScore')) || 0,
            perfectActions: 0,
            maxCombo: 0
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateUI();
        this.gameLoop();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleJump();
            }
            if (e.code === 'ArrowDown') {
                this.handleSlide();
            }
            if (e.code === 'ArrowUp') {
                this.handleRoll();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseGame());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
    }
    
    startGame() {
        this.gameState = 'playing';
        this.gameStartTime = Date.now();
        this.resetPlayerData();
        document.getElementById('startBtn').textContent = '跑酷中...';
        document.getElementById('startBtn').disabled = true;
    }
    
    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseBtn').textContent = '继续';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseBtn').textContent = '暂停';
        }
    }
    
    resetGame() {
        this.gameState = 'menu';
        this.resetPlayerData();
        document.getElementById('startBtn').textContent = '开始跑酷';
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').textContent = '暂停';
        this.updateUI();
    }
    
    resetPlayerData() {
        this.player = {
            x: 100,
            y: 350,
            width: 30,
            height: 50,
            velocityY: 0,
            speed: 8,
            isJumping: false,
            isSliding: false,
            isRolling: false,
            lives: 3,
            distance: 0,
            score: 0
        };
        
        this.obstacles = [];
        this.coins = [];
        this.background.x = 0;
        this.stats.perfectActions = 0;
        this.stats.maxCombo = 0;
    }
    
    handleJump() {
        if (this.gameState !== 'playing' || this.player.isJumping) return;
        
        this.player.isJumping = true;
        this.player.velocityY = this.physics.jumpPower;
        this.player.score += 5;
    }
    
    handleSlide() {
        if (this.gameState !== 'playing' || this.player.isJumping) return;
        
        this.player.isSliding = true;
        this.player.height = 25;
        this.player.y = this.physics.groundY + 25;
        this.player.score += 3;
        
        setTimeout(() => {
            this.player.isSliding = false;
            this.player.height = 50;
            this.player.y = this.physics.groundY;
        }, 800);
    }
    
    handleRoll() {
        if (this.gameState !== 'playing') return;
        
        this.player.isRolling = true;
        this.player.score += 8;
        this.stats.perfectActions++;
        
        setTimeout(() => {
            this.player.isRolling = false;
        }, 600);
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        this.gameTime = Date.now() - this.gameStartTime;
        
        // 更新玩家
        this.updatePlayer();
        
        // 更新障碍物
        this.updateObstacles();
        
        // 更新金币
        this.updateCoins();
        
        // 更新背景
        this.updateBackground();
        
        // 检查碰撞
        this.checkCollisions();
        
        // 更新统计数据
        this.updateStats();
        
        // 检查游戏结束条件
        this.checkGameEnd();
        
        this.updateUI();
    }
    
    updatePlayer() {
        // 重力
        if (this.player.isJumping) {
            this.player.velocityY += this.physics.gravity;
            this.player.y += this.player.velocityY;
            
            if (this.player.y >= this.physics.groundY) {
                this.player.y = this.physics.groundY;
                this.player.isJumping = false;
                this.player.velocityY = 0;
            }
        }
        
        // 更新距离和分数
        this.player.distance += this.player.speed * 0.1;
        this.player.score += Math.floor(this.player.speed * 0.2);
        
        // 速度递增
        this.player.speed = Math.min(this.player.speed + 0.001, 15);
    }
    
    updateObstacles() {
        // 生成新障碍物
        if (Math.random() < 0.01) {
            const obstacleTypes = ['box', 'barrier', 'gap'];
            const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
            
            this.obstacles.push({
                x: this.canvas.width,
                y: type === 'barrier' ? 300 : this.physics.groundY,
                width: type === 'gap' ? 80 : 40,
                height: type === 'barrier' ? 100 : 40,
                type: type,
                speed: this.player.speed
            });
        }
        
        // 更新障碍物位置
        this.obstacles = this.obstacles.filter(obstacle => {
            obstacle.x -= obstacle.speed;
            return obstacle.x > -obstacle.width;
        });
    }
    
    updateCoins() {
        // 生成新金币
        if (Math.random() < 0.005) {
            this.coins.push({
                x: this.canvas.width,
                y: 250 + Math.random() * 100,
                width: 20,
                height: 20,
                collected: false
            });
        }
        
        // 更新金币位置
        this.coins = this.coins.filter(coin => {
            coin.x -= this.player.speed;
            return coin.x > -coin.width && !coin.collected;
        });
    }
    
    updateBackground() {
        this.background.x -= this.player.speed * 0.5;
        if (this.background.x <= -this.canvas.width) {
            this.background.x = 0;
        }
    }
    
    checkCollisions() {
        // 障碍物碰撞
        this.obstacles.forEach((obstacle, index) => {
            if (this.isColliding(this.player, obstacle)) {
                this.handleObstacleCollision(obstacle);
                this.obstacles.splice(index, 1);
            }
        });
        
        // 金币收集
        this.coins.forEach((coin, index) => {
            if (this.isColliding(this.player, coin) && !coin.collected) {
                coin.collected = true;
                this.player.score += 50;
                this.coins.splice(index, 1);
            }
        });
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    handleObstacleCollision(obstacle) {
        this.player.lives--;
        this.player.score = Math.max(0, this.player.score - 100);
        
        if (this.player.lives <= 0) {
            this.endGame();
        }
    }
    
    updateStats() {
        this.stats.currentScore = this.player.score;
    }
    
    checkGameEnd() {
        if (this.player.lives <= 0) {
            this.endGame();
        }
    }
    
    endGame() {
        this.gameState = 'finished';
        
        if (this.player.score > this.stats.highScore) {
            this.stats.highScore = this.player.score;
            localStorage.setItem('parkourHighScore', this.stats.highScore.toString());
        }
        
        document.getElementById('startBtn').textContent = '开始跑酷';
        document.getElementById('startBtn').disabled = false;
    }
    
    render() {
        // 清空画布
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景
        this.drawBackground();
        
        // 绘制地面
        this.drawGround();
        
        // 绘制障碍物
        this.drawObstacles();
        
        // 绘制金币
        this.drawCoins();
        
        // 绘制玩家
        this.drawPlayer();
        
        // 绘制UI
        this.drawGameUI();
    }
    
    drawBackground() {
        this.ctx.fillStyle = '#E0E0E0';
        for (let i = 0; i < 3; i++) {
            this.ctx.fillRect(this.background.x + i * this.canvas.width, 0, this.canvas.width, 300);
        }
    }
    
    drawGround() {
        this.ctx.fillStyle = '#9E9E9E';
        this.ctx.fillRect(0, 400, this.canvas.width, this.canvas.height - 400);
    }
    
    drawObstacles() {
        this.obstacles.forEach(obstacle => {
            this.ctx.fillStyle = obstacle.type === 'barrier' ? '#F44336' : '#795548';
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            
            // 绘制障碍物标识
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                obstacle.type === 'box' ? '📦' : obstacle.type === 'barrier' ? '🚧' : '🕳️',
                obstacle.x + obstacle.width / 2,
                obstacle.y + obstacle.height / 2 + 7
            );
        });
    }
    
    drawCoins() {
        this.coins.forEach(coin => {
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🪙', coin.x + coin.width / 2, coin.y + coin.height / 2 + 7);
        });
    }
    
    drawPlayer() {
        this.ctx.fillStyle = '#03A9F4';
        
        if (this.player.isSliding) {
            this.ctx.fillRect(this.player.x, this.player.y, this.player.width + 10, this.player.height);
        } else {
            this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        }
        
        // 绘制跑者
        this.ctx.font = '30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🏃', this.player.x + this.player.width / 2, this.player.y + this.player.height / 2 + 10);
        
        // 特殊状态效果
        if (this.player.isRolling) {
            this.ctx.strokeStyle = '#4CAF50';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(this.player.x - 5, this.player.y - 5, this.player.width + 10, this.player.height + 10);
        }
    }
    
    drawGameUI() {
        this.ctx.fillStyle = '#333333';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`速度: ${Math.floor(this.player.speed)} m/s`, 10, 30);
        this.ctx.fillText(`距离: ${Math.floor(this.player.distance)}m`, 10, 50);
        this.ctx.fillText(`生命: ${this.player.lives}`, 10, 70);
    }
    
    updateUI() {
        document.getElementById('speed').textContent = Math.floor(this.player.speed);
        document.getElementById('distance').textContent = Math.floor(this.player.distance);
        document.getElementById('lives').textContent = this.player.lives;
        document.getElementById('score').textContent = this.player.score;
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 启动游戏
window.addEventListener('load', () => {
    new ParkourGame();
});