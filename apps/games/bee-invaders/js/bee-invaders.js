class BeeInvaders {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.highScore = parseInt(localStorage.getItem('beeInvadersHighScore')) || 0;
        
        // 游戏对象
        this.player = null;
        this.bullets = [];
        this.bees = [];
        this.beeBullets = [];
        this.barriers = [];
        this.particles = [];
        this.ufo = null;
        
        // 游戏设置
        this.beeSpeed = 0.5;
        this.beeDropDistance = 20;
        this.beeDirection = 1;
        this.lastBeeShot = 0;
        this.beeShootInterval = 2000;
        this.ufoSpawnChance = 0.001;
        
        // 动画和时间
        this.animationId = null;
        this.lastTime = 0;
        
        this.initGame();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initGame() {
        // 初始化玩家
        this.player = {
            x: this.canvas.width / 2 - 20,
            y: this.canvas.height - 60,
            width: 40,
            height: 30,
            speed: 5
        };
        
        // 初始化蜜蜂群
        this.initBees();
        
        // 初始化掩体
        this.initBarriers();
        
        // 清空数组
        this.bullets = [];
        this.beeBullets = [];
        this.particles = [];
        this.ufo = null;
    }
    
    initBees() {
        this.bees = [];
        const rows = 5;
        const cols = 10;
        const beeWidth = 30;
        const beeHeight = 25;
        const spacing = 15;
        const startX = (this.canvas.width - (cols * (beeWidth + spacing) - spacing)) / 2;
        const startY = 50;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                let type = 'normal';
                let points = 10;
                
                // 前两行是红色蜜蜂，分数更高
                if (row < 2) {
                    type = 'red';
                    points = 30;
                }
                
                this.bees.push({
                    x: startX + col * (beeWidth + spacing),
                    y: startY + row * (beeHeight + spacing),
                    width: beeWidth,
                    height: beeHeight,
                    alive: true,
                    type: type,
                    points: points,
                    animFrame: Math.floor(Math.random() * 2)
                });
            }
        }
    }
    
    initBarriers() {
        this.barriers = [];
        const barrierCount = 4;
        const barrierWidth = 80;
        const barrierHeight = 60;
        const spacing = (this.canvas.width - barrierCount * barrierWidth) / (barrierCount + 1);
        
        for (let i = 0; i < barrierCount; i++) {
            const barrier = {
                x: spacing + i * (barrierWidth + spacing),
                y: this.canvas.height - 200,
                width: barrierWidth,
                height: barrierHeight,
                blocks: []
            };
            
            // 创建掩体的像素块
            const blockSize = 4;
            const blocksX = Math.floor(barrierWidth / blockSize);
            const blocksY = Math.floor(barrierHeight / blockSize);
            
            for (let by = 0; by < blocksY; by++) {
                barrier.blocks[by] = [];
                for (let bx = 0; bx < blocksX; bx++) {
                    // 创建掩体形状（中间有凹槽）
                    const isBarrier = this.isBarrierBlock(bx, by, blocksX, blocksY);
                    barrier.blocks[by][bx] = isBarrier;
                }
            }
            
            this.barriers.push(barrier);
        }
    }
    
    isBarrierBlock(x, y, maxX, maxY) {
        const centerX = maxX / 2;
        const centerY = maxY / 2;
        
        // 基本掩体形状
        if (y < maxY * 0.3) return true;
        
        // 中间凹槽
        if (y > maxY * 0.7 && Math.abs(x - centerX) < maxX * 0.3) {
            return false;
        }
        
        // 两侧支撑
        if (x < maxX * 0.2 || x > maxX * 0.8) return true;
        
        // 上半部分
        if (y < maxY * 0.7 && Math.abs(x - centerX) < maxX * 0.4) return true;
        
        return false;
    }
    
    startGame() {
        if (this.gameState === 'menu' || this.gameState === 'gameOver') {
            this.gameState = 'playing';
            this.score = 0;
            this.lives = 3;
            this.level = 1;
            this.beeSpeed = 0.5;
            this.initGame();
            this.updateDisplay();
            this.gameLoop();
        }
        
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
            this.gameLoop();
        }
    }
    
    restartGame() {
        this.gameState = 'menu';
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.initGame();
        this.updateDisplay();
        this.draw();
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = '暂停';
        
        // 移除游戏结束界面
        const gameOverDiv = document.querySelector('.game-over');
        if (gameOverDiv) {
            gameOverDiv.remove();
        }
    }
    
    gameLoop(currentTime = 0) {
        if (this.gameState !== 'playing') return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        // 更新玩家子弹
        this.bullets = this.bullets.filter(bullet => {
            bullet.y -= bullet.speed;
            return bullet.y > -bullet.height;
        });
        
        // 更新蜜蜂子弹
        this.beeBullets = this.beeBullets.filter(bullet => {
            bullet.y += bullet.speed;
            return bullet.y < this.canvas.height;
        });
        
        // 更新蜜蜂位置
        this.updateBees(deltaTime);
        
        // 更新UFO
        if (this.ufo) {
            this.ufo.x += this.ufo.speed;
            if (this.ufo.x > this.canvas.width + 50 || this.ufo.x < -100) {
                this.ufo = null;
            }
        }
        
        // 随机生成UFO
        if (!this.ufo && Math.random() < this.ufoSpawnChance) {
            this.spawnUFO();
        }
        
        // 蜜蜂射击
        if (Date.now() - this.lastBeeShot > this.beeShootInterval) {
            this.beeShoot();
            this.lastBeeShot = Date.now();
        }
        
        // 更新粒子效果
        this.updateParticles(deltaTime);
        
        // 碰撞检测
        this.checkCollisions();
        
        // 检查游戏状态
        this.checkGameState();
    }
    
    updateBees(deltaTime) {
        let moveDown = false;
        let leftmost = this.canvas.width;
        let rightmost = 0;
        
        // 找到蜜蜂群的边界
        this.bees.forEach(bee => {
            if (bee.alive) {
                leftmost = Math.min(leftmost, bee.x);
                rightmost = Math.max(rightmost, bee.x + bee.width);
            }
        });
        
        // 检查是否需要掉头
        if ((rightmost >= this.canvas.width - 10 && this.beeDirection > 0) || 
            (leftmost <= 10 && this.beeDirection < 0)) {
            this.beeDirection *= -1;
            moveDown = true;
        }
        
        // 移动蜜蜂
        this.bees.forEach(bee => {
            if (bee.alive) {
                if (moveDown) {
                    bee.y += this.beeDropDistance;
                } else {
                    bee.x += this.beeSpeed * this.beeDirection;
                }
                
                // 动画帧
                bee.animFrame = (bee.animFrame + 0.1) % 2;
            }
        });
    }
    
    beeShoot() {
        const aliveBees = this.bees.filter(bee => bee.alive);
        if (aliveBees.length === 0) return;
        
        // 随机选择一只蜜蜂射击
        const shooter = aliveBees[Math.floor(Math.random() * aliveBees.length)];
        
        this.beeBullets.push({
            x: shooter.x + shooter.width / 2 - 2,
            y: shooter.y + shooter.height,
            width: 4,
            height: 10,
            speed: 3
        });
    }
    
    spawnUFO() {
        const direction = Math.random() < 0.5 ? 1 : -1;
        this.ufo = {
            x: direction > 0 ? -50 : this.canvas.width + 50,
            y: 30,
            width: 50,
            height: 25,
            speed: direction * 2,
            points: 100 + Math.floor(Math.random() * 400)
        };
    }
    
    updateParticles(deltaTime) {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= deltaTime;
            particle.alpha = particle.life / particle.maxLife;
            return particle.life > 0;
        });
    }
    
    checkCollisions() {
        // 玩家子弹与蜜蜂碰撞
        this.bullets.forEach((bullet, bulletIndex) => {
            this.bees.forEach((bee, beeIndex) => {
                if (bee.alive && this.isColliding(bullet, bee)) {
                    this.bullets.splice(bulletIndex, 1);
                    bee.alive = false;
                    this.score += bee.points;
                    this.createExplosion(bee.x + bee.width/2, bee.y + bee.height/2);
                    
                    // 更新最高分
                    if (this.score > this.highScore) {
                        this.highScore = this.score;
                        localStorage.setItem('beeInvadersHighScore', this.highScore.toString());
                    }
                }
            });
            
            // 子弹与UFO碰撞
            if (this.ufo && this.isColliding(bullet, this.ufo)) {
                this.bullets.splice(bulletIndex, 1);
                this.score += this.ufo.points;
                this.createExplosion(this.ufo.x + this.ufo.width/2, this.ufo.y + this.ufo.height/2);
                this.ufo = null;
            }
            
            // 子弹与掩体碰撞
            this.checkBulletBarrierCollision(bullet, bulletIndex);
        });
        
        // 蜜蜂子弹与玩家碰撞
        this.beeBullets.forEach((bullet, bulletIndex) => {
            if (this.isColliding(bullet, this.player)) {
                this.beeBullets.splice(bulletIndex, 1);
                this.lives--;
                this.createExplosion(this.player.x + this.player.width/2, this.player.y + this.player.height/2);
                
                if (this.lives <= 0) {
                    this.gameState = 'gameOver';
                }
            }
            
            // 蜜蜂子弹与掩体碰撞
            this.checkBulletBarrierCollision(bullet, bulletIndex, false);
        });
        
        // 蜜蜂与玩家碰撞
        this.bees.forEach(bee => {
            if (bee.alive && this.isColliding(bee, this.player)) {
                this.lives = 0;
                this.gameState = 'gameOver';
            }
            
            // 蜜蜂到达底部
            if (bee.alive && bee.y + bee.height > this.canvas.height - 100) {
                this.lives = 0;
                this.gameState = 'gameOver';
            }
        });
    }
    
    checkBulletBarrierCollision(bullet, bulletIndex, isPlayerBullet = true) {
        this.barriers.forEach(barrier => {
            if (this.isColliding(bullet, barrier)) {
                if (isPlayerBullet) {
                    this.bullets.splice(bulletIndex, 1);
                } else {
                    this.beeBullets.splice(bulletIndex, 1);
                }
                
                // 破坏掩体
                this.damageBarrier(barrier, bullet.x + bullet.width/2, bullet.y + bullet.height/2);
            }
        });
    }
    
    damageBarrier(barrier, hitX, hitY) {
        const blockSize = 4;
        const relativeX = hitX - barrier.x;
        const relativeY = hitY - barrier.y;
        const blockX = Math.floor(relativeX / blockSize);
        const blockY = Math.floor(relativeY / blockSize);
        
        // 破坏击中点周围的块
        const damageRadius = 2;
        for (let dy = -damageRadius; dy <= damageRadius; dy++) {
            for (let dx = -damageRadius; dx <= damageRadius; dx++) {
                const x = blockX + dx;
                const y = blockY + dy;
                
                if (y >= 0 && y < barrier.blocks.length && 
                    x >= 0 && x < barrier.blocks[y].length) {
                    if (dx * dx + dy * dy <= damageRadius * damageRadius) {
                        barrier.blocks[y][x] = false;
                    }
                }
            }
        }
    }
    
    checkGameState() {
        // 检查是否所有蜜蜂都被消灭
        const aliveBees = this.bees.filter(bee => bee.alive);
        if (aliveBees.length === 0) {
            this.nextLevel();
        }
        
        // 检查游戏结束
        if (this.lives <= 0 || this.gameState === 'gameOver') {
            this.endGame();
        }
    }
    
    nextLevel() {
        this.level++;
        this.beeSpeed += 0.3;
        this.beeShootInterval = Math.max(800, this.beeShootInterval - 200);
        
        this.showLevelComplete();
        
        setTimeout(() => {
            this.initBees();
            this.initBarriers();
            this.bullets = [];
            this.beeBullets = [];
            this.particles = [];
            this.ufo = null;
            this.hideLevelComplete();
        }, 2000);
    }
    
    showLevelComplete() {
        const levelCompleteDiv = document.createElement('div');
        levelCompleteDiv.className = 'level-complete';
        levelCompleteDiv.innerHTML = `
            <h2>🎉 第${this.level - 1}关完成! 🎉</h2>
            <p>准备进入第${this.level}关...</p>
        `;
        document.body.appendChild(levelCompleteDiv);
    }
    
    hideLevelComplete() {
        const levelCompleteDiv = document.querySelector('.level-complete');
        if (levelCompleteDiv) {
            levelCompleteDiv.remove();
        }
    }
    
    endGame() {
        this.gameState = 'gameOver';
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.showGameOver();
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = '暂停';
    }
    
    showGameOver() {
        const gameOverDiv = document.createElement('div');
        gameOverDiv.className = 'game-over';
        gameOverDiv.innerHTML = `
            <h2>💥 游戏结束 💥</h2>
            <div class="game-over-stats">
                <div>🏆 最终得分: ${this.score}</div>
                <div>⭐ 最高记录: ${this.highScore}</div>
                <div>🚀 到达关卡: ${this.level}</div>
            </div>
            <button onclick="beeInvaders.restartGame()" style="margin-top: 20px;">重新开始</button>
        `;
        document.body.appendChild(gameOverDiv);
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    createExplosion(x, y) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 500,
                maxLife: 500,
                alpha: 1,
                color: `hsl(${Math.random() * 60 + 15}, 100%, 50%)`
            });
        }
    }
    
    shoot() {
        if (this.gameState !== 'playing') return;
        
        // 限制同时存在的子弹数量
        if (this.bullets.length < 3) {
            this.bullets.push({
                x: this.player.x + this.player.width / 2 - 2,
                y: this.player.y,
                width: 4,
                height: 15,
                speed: 8
            });
        }
    }
    
    draw() {
        // 清空画布
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制星空背景
        this.drawStars();
        
        // 绘制游戏对象
        if (this.gameState !== 'menu') {
            this.drawPlayer();
            this.drawBullets();
            this.drawBees();
            this.drawBeeBullets();
            this.drawBarriers();
            this.drawUFO();
            this.drawParticles();
        }
        
        // 绘制UI信息
        if (this.gameState === 'paused') {
            this.drawPauseScreen();
        }
    }
    
    drawStars() {
        this.ctx.fillStyle = 'white';
        for (let i = 0; i < 50; i++) {
            const x = (i * 137.5) % this.canvas.width;
            const y = (i * 84.3) % this.canvas.height;
            const size = Math.sin(i) * 0.5 + 1;
            this.ctx.fillRect(x, y, size, size);
        }
    }
    
    drawPlayer() {
        this.ctx.fillStyle = '#00ff00';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // 飞船细节
        this.ctx.fillStyle = '#00aa00';
        this.ctx.fillRect(this.player.x + 5, this.player.y + 5, this.player.width - 10, this.player.height - 10);
        
        // 飞船炮口
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(this.player.x + this.player.width/2 - 2, this.player.y - 5, 4, 5);
    }
    
    drawBullets() {
        this.ctx.fillStyle = '#ffff00';
        this.bullets.forEach(bullet => {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }
    
    drawBeeBullets() {
        this.ctx.fillStyle = '#ff0000';
        this.beeBullets.forEach(bullet => {
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }
    
    drawBees() {
        this.bees.forEach(bee => {
            if (!bee.alive) return;
            
            const animOffset = Math.floor(bee.animFrame) * 2;
            
            if (bee.type === 'red') {
                this.ctx.fillStyle = '#ff4444';
            } else {
                this.ctx.fillStyle = '#ffaa00';
            }
            
            // 蜜蜂身体
            this.ctx.fillRect(bee.x + animOffset, bee.y, bee.width - animOffset*2, bee.height);
            
            // 蜜蜂翅膀
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.fillRect(bee.x + 5 + animOffset, bee.y - 3, 8, 6);
            this.ctx.fillRect(bee.x + bee.width - 13 + animOffset, bee.y - 3, 8, 6);
        });
    }
    
    drawBarriers() {
        this.ctx.fillStyle = '#00aa00';
        this.barriers.forEach(barrier => {
            const blockSize = 4;
            for (let y = 0; y < barrier.blocks.length; y++) {
                for (let x = 0; x < barrier.blocks[y].length; x++) {
                    if (barrier.blocks[y][x]) {
                        this.ctx.fillRect(
                            barrier.x + x * blockSize,
                            barrier.y + y * blockSize,
                            blockSize,
                            blockSize
                        );
                    }
                }
            }
        });
    }
    
    drawUFO() {
        if (!this.ufo) return;
        
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.fillRect(this.ufo.x, this.ufo.y, this.ufo.width, this.ufo.height);
        
        // UFO细节
        this.ctx.fillStyle = '#aa00aa';
        this.ctx.fillRect(this.ufo.x + 5, this.ufo.y + 5, this.ufo.width - 10, this.ufo.height - 10);
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
        });
        this.ctx.globalAlpha = 1;
    }
    
    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏暂停', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('按P键或点击继续按钮恢复游戏', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
        document.getElementById('highScore').textContent = this.highScore;
    }
    
    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (this.gameState !== 'playing') return;
            
            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    if (this.player.x > 0) {
                        this.player.x -= this.player.speed;
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    if (this.player.x < this.canvas.width - this.player.width) {
                        this.player.x += this.player.speed;
                    }
                    break;
                case ' ':
                    e.preventDefault();
                    this.shoot();
                    break;
            }
        });
        
        // 暂停键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'p' || e.key === 'P') {
                e.preventDefault();
                this.togglePause();
            }
        });
        
        // 触摸事件支持
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.shoot();
        });
        
        this.canvas.addEventListener('click', (e) => {
            this.shoot();
        });
        
        // 触摸移动支持
        let touchStartX = 0;
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (this.gameState !== 'playing') return;
            
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const touchX = touch.clientX - rect.left;
            
            const canvasScale = this.canvas.offsetWidth / this.canvas.width;
            const gameX = touchX / canvasScale;
            
            this.player.x = Math.max(0, Math.min(this.canvas.width - this.player.width, gameX - this.player.width / 2));
        });
    }
}

// 全局变量
let beeInvaders;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    beeInvaders = new BeeInvaders();
});