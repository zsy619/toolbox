class SpaceInvaders {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameOver = false;
        this.animationId = null;
        
        // 游戏数据
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.highScore = parseInt(localStorage.getItem('spaceInvadersHighScore')) || 0;
        
        // 游戏对象
        this.player = {
            x: this.canvas.width / 2 - 25,
            y: this.canvas.height - 60,
            width: 50,
            height: 30,
            speed: 5
        };
        
        this.bullets = [];
        this.invaders = [];
        this.invaderBullets = [];
        this.barriers = [];
        this.explosions = [];
        
        // 入侵者设置
        this.invaderRows = 5;
        this.invaderCols = 10;
        this.invaderSpeed = 1;
        this.invaderDirection = 1;
        this.invaderDropDistance = 20;
        
        // 特殊入侵者
        this.ufo = null;
        this.ufoSpawnTimer = 0;
        
        // 输入处理
        this.keys = {};
        this.lastShotTime = 0;
        this.shotCooldown = 200;
        
        this.initGame();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initGame() {
        this.createInvaders();
        this.createBarriers();
        this.updateHighScore();
    }
    
    createInvaders() {
        this.invaders = [];
        const startX = 50;
        const startY = 50;
        const spacingX = 60;
        const spacingY = 50;
        
        // 创建不同类型的入侵者
        for (let row = 0; row < this.invaderRows; row++) {
            for (let col = 0; col < this.invaderCols; col++) {
                let type = 'basic';
                let points = 10;
                
                if (row === 0) {
                    type = 'fast';
                    points = 30;
                } else if (row === 1 || row === 2) {
                    type = 'medium';
                    points = 20;
                }
                
                this.invaders.push({
                    x: startX + col * spacingX,
                    y: startY + row * spacingY,
                    width: 40,
                    height: 30,
                    type: type,
                    points: points,
                    alive: true,
                    animFrame: 0
                });
            }
        }
    }
    
    createBarriers() {
        this.barriers = [];
        const barrierCount = 4;
        const barrierWidth = 80;
        const barrierHeight = 60;
        const spacing = (this.canvas.width - barrierCount * barrierWidth) / (barrierCount + 1);
        
        for (let i = 0; i < barrierCount; i++) {
            const x = spacing + i * (barrierWidth + spacing);
            const y = this.canvas.height - 200;
            
            // 创建像素化的屏障
            const barrier = {
                x: x,
                y: y,
                width: barrierWidth,
                height: barrierHeight,
                blocks: []
            };
            
            // 创建屏障的像素块
            const blockSize = 4;
            for (let row = 0; row < barrierHeight / blockSize; row++) {
                for (let col = 0; col < barrierWidth / blockSize; col++) {
                    // 创建屏障形状（圆顶状）
                    const centerX = barrierWidth / 2;
                    const centerY = barrierHeight;
                    const distance = Math.sqrt(
                        Math.pow(col * blockSize - centerX, 2) + 
                        Math.pow(row * blockSize - centerY, 2)
                    );
                    
                    if (distance < barrierWidth / 2 - 5 && row < barrierHeight / blockSize - 3) {
                        // 创建入口
                        if (row > barrierHeight / blockSize - 8 && 
                            col > barrierWidth / blockSize / 2 - 3 && 
                            col < barrierWidth / blockSize / 2 + 3) {
                            continue;
                        }
                        
                        barrier.blocks.push({
                            x: x + col * blockSize,
                            y: y + row * blockSize,
                            size: blockSize,
                            exists: true
                        });
                    }
                }
            }
            
            this.barriers.push(barrier);
        }
    }
    
    startGame() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        this.gamePaused = false;
        this.gameOver = false;
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        document.getElementById('gameOver').style.display = 'none';
        
        this.updateStatus('游戏进行中 - 消灭所有入侵者！');
        this.gameLoop();
    }
    
    pauseGame() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        const pauseBtn = document.getElementById('pauseBtn');
        
        if (this.gamePaused) {
            pauseBtn.textContent = '继续';
            this.updateStatus('游戏暂停');
        } else {
            pauseBtn.textContent = '暂停';
            this.updateStatus('游戏进行中');
            this.gameLoop();
        }
    }
    
    resetGame() {
        this.stopGame();
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.invaderSpeed = 1;
        
        // 重置玩家位置
        this.player.x = this.canvas.width / 2 - 25;
        this.player.y = this.canvas.height - 60;
        
        // 清空所有游戏对象
        this.bullets = [];
        this.invaderBullets = [];
        this.explosions = [];
        this.ufo = null;
        
        // 重新创建游戏对象
        this.createInvaders();
        this.createBarriers();
        
        this.updateDisplay();
        this.updateStatus('按开始游戏按钮开始');
        this.draw();
    }
    
    stopGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = '暂停';
    }
    
    restart() {
        document.getElementById('gameOver').style.display = 'none';
        this.resetGame();
        this.startGame();
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.update();
        this.draw();
        
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        this.handleInput();
        this.updateBullets();
        this.updateInvaders();
        this.updateInvaderBullets();
        this.updateUFO();
        this.updateExplosions();
        this.checkCollisions();
        this.checkGameState();
    }
    
    handleInput() {
        // 玩家移动
        if (this.keys['ArrowLeft'] && this.player.x > 0) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['ArrowRight'] && this.player.x < this.canvas.width - this.player.width) {
            this.player.x += this.player.speed;
        }
        
        // 射击
        if (this.keys[' ']) {
            this.shoot();
        }
    }
    
    shoot() {
        const currentTime = Date.now();
        if (currentTime - this.lastShotTime < this.shotCooldown) return;
        
        this.bullets.push({
            x: this.player.x + this.player.width / 2 - 2,
            y: this.player.y,
            width: 4,
            height: 10,
            speed: 7
        });
        
        this.lastShotTime = currentTime;
    }
    
    updateBullets() {
        // 更新玩家子弹
        this.bullets = this.bullets.filter(bullet => {
            bullet.y -= bullet.speed;
            return bullet.y > -bullet.height;
        });
    }
    
    updateInvaders() {
        if (this.invaders.length === 0) return;
        
        // 检查是否需要改变方向
        let changeDirection = false;
        
        for (let invader of this.invaders) {
            if (!invader.alive) continue;
            
            if ((invader.x <= 0 && this.invaderDirection === -1) ||
                (invader.x >= this.canvas.width - invader.width && this.invaderDirection === 1)) {
                changeDirection = true;
                break;
            }
        }
        
        if (changeDirection) {
            this.invaderDirection *= -1;
            this.invaders.forEach(invader => {
                if (invader.alive) {
                    invader.y += this.invaderDropDistance;
                }
            });
        }
        
        // 移动入侵者
        this.invaders.forEach(invader => {
            if (invader.alive) {
                invader.x += this.invaderSpeed * this.invaderDirection;
                invader.animFrame = (invader.animFrame + 0.1) % 2;
            }
        });
        
        // 入侵者射击
        if (Math.random() < 0.005 * this.level) {
            this.invaderShoot();
        }
    }
    
    invaderShoot() {
        const aliveInvaders = this.invaders.filter(inv => inv.alive);
        if (aliveInvaders.length === 0) return;
        
        const shooter = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
        
        this.invaderBullets.push({
            x: shooter.x + shooter.width / 2 - 2,
            y: shooter.y + shooter.height,
            width: 4,
            height: 8,
            speed: 3
        });
    }
    
    updateInvaderBullets() {
        this.invaderBullets = this.invaderBullets.filter(bullet => {
            bullet.y += bullet.speed;
            return bullet.y < this.canvas.height;
        });
    }
    
    updateUFO() {
        // UFO生成
        this.ufoSpawnTimer++;
        if (this.ufoSpawnTimer > 1800 && !this.ufo && Math.random() < 0.01) {
            this.ufo = {
                x: -80,
                y: 30,
                width: 80,
                height: 30,
                speed: 2,
                points: 100 + Math.floor(Math.random() * 400)
            };
            this.ufoSpawnTimer = 0;
        }
        
        // 更新UFO位置
        if (this.ufo) {
            this.ufo.x += this.ufo.speed;
            if (this.ufo.x > this.canvas.width) {
                this.ufo = null;
            }
        }
    }
    
    updateExplosions() {
        this.explosions = this.explosions.filter(explosion => {
            explosion.timer--;
            explosion.size += 2;
            explosion.alpha -= 0.05;
            return explosion.timer > 0 && explosion.alpha > 0;
        });
    }
    
    checkCollisions() {
        // 玩家子弹 vs 入侵者
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            // 检查与入侵者的碰撞
            for (let j = 0; j < this.invaders.length; j++) {
                const invader = this.invaders[j];
                if (!invader.alive) continue;
                
                if (this.isColliding(bullet, invader)) {
                    this.score += invader.points;
                    invader.alive = false;
                    this.bullets.splice(i, 1);
                    this.createExplosion(invader.x + invader.width / 2, invader.y + invader.height / 2);
                    break;
                }
            }
            
            // 检查与UFO的碰撞
            if (this.ufo && this.isColliding(bullet, this.ufo)) {
                this.score += this.ufo.points;
                this.createExplosion(this.ufo.x + this.ufo.width / 2, this.ufo.y + this.ufo.height / 2);
                this.ufo = null;
                this.bullets.splice(i, 1);
            }
            
            // 检查与屏障的碰撞
            this.checkBulletBarrierCollision(bullet, i);
        }
        
        // 入侵者子弹 vs 玩家
        for (let i = this.invaderBullets.length - 1; i >= 0; i--) {
            const bullet = this.invaderBullets[i];
            
            if (this.isColliding(bullet, this.player)) {
                this.lives--;
                this.invaderBullets.splice(i, 1);
                this.createExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
                
                if (this.lives <= 0) {
                    this.endGame();
                    return;
                }
            }
            
            // 检查与屏障的碰撞
            this.checkBulletBarrierCollision(bullet, i, this.invaderBullets);
        }
        
        // 入侵者到达底部
        for (let invader of this.invaders) {
            if (invader.alive && invader.y + invader.height >= this.player.y) {
                this.endGame();
                return;
            }
        }
    }
    
    checkBulletBarrierCollision(bullet, bulletIndex, bulletArray = this.bullets) {
        for (let barrier of this.barriers) {
            for (let j = barrier.blocks.length - 1; j >= 0; j--) {
                const block = barrier.blocks[j];
                if (!block.exists) continue;
                
                if (this.isColliding(bullet, block)) {
                    block.exists = false;
                    bulletArray.splice(bulletIndex, 1);
                    return true;
                }
            }
        }
        return false;
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    createExplosion(x, y) {
        this.explosions.push({
            x: x,
            y: y,
            size: 5,
            alpha: 1,
            timer: 20
        });
    }
    
    checkGameState() {
        // 检查是否所有入侵者都被消灭
        const aliveInvaders = this.invaders.filter(inv => inv.alive);
        
        if (aliveInvaders.length === 0) {
            this.nextLevel();
        }
    }
    
    nextLevel() {
        this.level++;
        this.invaderSpeed += 0.5;
        this.shotCooldown = Math.max(100, this.shotCooldown - 20);
        
        // 重新创建入侵者和屏障
        this.createInvaders();
        this.createBarriers();
        
        // 清空子弹和爆炸
        this.bullets = [];
        this.invaderBullets = [];
        this.explosions = [];
        
        this.updateStatus(`进入第 ${this.level} 关！`);
    }
    
    endGame() {
        this.gameOver = true;
        this.stopGame();
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('spaceInvadersHighScore', this.highScore.toString());
            this.updateHighScore();
        }
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('gameOver').style.display = 'block';
        this.updateStatus('游戏结束！');
    }
    
    draw() {
        // 清空画布
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制星空背景
        this.drawStars();
        
        // 绘制游戏对象
        this.drawPlayer();
        this.drawBullets();
        this.drawInvaders();
        this.drawInvaderBullets();
        this.drawBarriers();
        this.drawUFO();
        this.drawExplosions();
    }
    
    drawStars() {
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 50; i++) {
            const x = (i * 37) % this.canvas.width;
            const y = (i * 17) % this.canvas.height;
            const size = Math.random() * 2;
            this.ctx.fillRect(x, y, size, size);
        }
    }
    
    drawPlayer() {
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // 绘制玩家细节
        this.ctx.fillStyle = '#00cc00';
        this.ctx.fillRect(this.player.x + 10, this.player.y - 10, 10, 10);
        this.ctx.fillRect(this.player.x + 30, this.player.y - 10, 10, 10);
    }
    
    drawBullets() {
        this.ctx.fillStyle = '#ffff00';
        for (let bullet of this.bullets) {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
    }
    
    drawInvaders() {
        for (let invader of this.invaders) {
            if (!invader.alive) continue;
            
            // 根据类型设置颜色
            switch (invader.type) {
                case 'fast':
                    this.ctx.fillStyle = '#ff0000';
                    break;
                case 'medium':
                    this.ctx.fillStyle = '#ff8800';
                    break;
                default:
                    this.ctx.fillStyle = '#ffffff';
            }
            
            // 绘制入侵者主体
            this.ctx.fillRect(invader.x, invader.y, invader.width, invader.height);
            
            // 绘制动画效果（简单的闪烁）
            if (Math.floor(invader.animFrame) === 1) {
                this.ctx.fillStyle = '#888888';
                this.ctx.fillRect(invader.x + 5, invader.y + 5, invader.width - 10, invader.height - 10);
            }
        }
    }
    
    drawInvaderBullets() {
        this.ctx.fillStyle = '#ff0000';
        for (let bullet of this.invaderBullets) {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
    }
    
    drawBarriers() {
        this.ctx.fillStyle = '#00ff88';
        for (let barrier of this.barriers) {
            for (let block of barrier.blocks) {
                if (block.exists) {
                    this.ctx.fillRect(block.x, block.y, block.size, block.size);
                }
            }
        }
    }
    
    drawUFO() {
        if (!this.ufo) return;
        
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.fillRect(this.ufo.x, this.ufo.y, this.ufo.width, this.ufo.height);
        
        // UFO细节
        this.ctx.fillStyle = '#ffff00';
        for (let i = 0; i < 8; i++) {
            const x = this.ufo.x + i * 10;
            const y = this.ufo.y + 15;
            this.ctx.fillRect(x, y, 2, 2);
        }
    }
    
    drawExplosions() {
        for (let explosion of this.explosions) {
            this.ctx.save();
            this.ctx.globalAlpha = explosion.alpha;
            this.ctx.fillStyle = '#ffaa00';
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, explosion.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
    }
    
    updateHighScore() {
        document.getElementById('highScore').textContent = this.highScore;
    }
    
    updateStatus(message) {
        document.getElementById('statusMessage').textContent = message;
    }
    
    bindEvents() {
        // 按钮事件
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseGame());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            if (e.key === 'p' || e.key === 'P') {
                e.preventDefault();
                this.pauseGame();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // 防止右键菜单
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // 防止空格键滚动页面
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') {
                e.preventDefault();
            }
        });
    }
}

// 全局变量
let spaceInvaders;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    spaceInvaders = new SpaceInvaders();
    spaceInvaders.draw(); // 初始绘制
});