// 魂斗罗游戏 - 完整版本
class ContraGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // 游戏状态
        this.gameState = {
            isRunning: false,
            isPaused: false,
            score: 0,
            lives: 3,
            level: 1,
            enemiesKilled: 0,
            nextLevelThreshold: 10
        };
        
        // 玩家对象
        this.player = {
            x: 50,
            y: 500,
            width: 40,
            height: 40,
            speed: 5,
            health: 3,
            direction: 1, // 1: 右, -1: 左
            isInvulnerable: false,
            invulnerabilityTime: 0,
            color: '#00ff00'
        };
        
        // 游戏对象数组
        this.bullets = [];
        this.enemies = [];
        this.explosions = [];
        this.powerUps = [];
        this.particles = [];
        
        // 游戏配置
        this.config = {
            bulletSpeed: 8,
            enemySpeed: 2,
            enemySpawnRate: 0.015,
            maxEnemies: 8,
            explosionDuration: 30,
            invulnerabilityDuration: 120
        };
        
        // 键盘状态
        this.keys = {};
        this.lastShotTime = 0;
        this.shootCooldown = 150; // 毫秒
        
        // 背景
        this.background = {
            x: 0,
            speed: 1,
            stars: this.generateStars(100)
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateUI();
        this.gameLoop();
    }
    
    setupEventListeners() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // 快捷键
            switch(e.code) {
                case 'KeyP':
                    this.togglePause();
                    break;
                case 'Space':
                    e.preventDefault();
                    this.shoot();
                    break;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // 按钮事件
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    generateStars(count) {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                brightness: Math.random() * 0.8 + 0.2
            });
        }
        return stars;
    }
    
    startGame() {
        this.gameState.isRunning = true;
        this.gameState.isPaused = false;
        this.resetGame();
    }
    
    resetGame() {
        this.gameState.score = 0;
        this.gameState.lives = 3;
        this.gameState.level = 1;
        this.gameState.enemiesKilled = 0;
        
        this.player.x = 50;
        this.player.y = 500;
        this.player.health = 3;
        this.player.isInvulnerable = false;
        
        this.bullets = [];
        this.enemies = [];
        this.explosions = [];
        this.powerUps = [];
        this.particles = [];
        
        this.updateUI();
    }
    
    restartGame() {
        this.startGame();
    }
    
    togglePause() {
        if (this.gameState.isRunning) {
            this.gameState.isPaused = !this.gameState.isPaused;
            const pauseBtn = document.getElementById('pauseBtn');
            pauseBtn.textContent = this.gameState.isPaused ? '▶️ 继续' : '⏸️ 暂停';
        }
    }
    
    gameLoop() {
        if (this.gameState.isRunning && !this.gameState.isPaused) {
            this.update();
            this.render();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        this.updatePlayer();
        this.updateBullets();
        this.updateEnemies();
        this.updateExplosions();
        this.updateParticles();
        this.updateBackground();
        this.spawnEnemies();
        this.checkCollisions();
        this.checkLevelProgression();
        
        // 更新无敌时间
        if (this.player.isInvulnerable) {
            this.player.invulnerabilityTime--;
            if (this.player.invulnerabilityTime <= 0) {
                this.player.isInvulnerable = false;
            }
        }
    }
    
    updatePlayer() {
        const player = this.player;
        
        // 移动控制
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            player.x = Math.max(0, player.x - player.speed);
            player.direction = -1;
        }
        if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            player.x = Math.min(this.canvas.width - player.width, player.x + player.speed);
            player.direction = 1;
        }
        if (this.keys['ArrowUp'] || this.keys['KeyW']) {
            player.y = Math.max(0, player.y - player.speed);
        }
        if (this.keys['ArrowDown'] || this.keys['KeyS']) {
            player.y = Math.min(this.canvas.height - player.height, player.y + player.speed);
        }
        
        // 自动射击
        if (this.keys['Space']) {
            this.shoot();
        }
    }
    
    shoot() {
        const now = Date.now();
        if (now - this.lastShotTime > this.shootCooldown) {
            this.bullets.push({
                x: this.player.x + this.player.width,
                y: this.player.y + this.player.height / 2 - 2,
                width: 8,
                height: 4,
                speed: this.config.bulletSpeed * this.player.direction,
                direction: this.player.direction,
                color: '#ffff00'
            });
            this.lastShotTime = now;
            
            // 添加射击粒子效果
            this.createParticles(
                this.player.x + this.player.width,
                this.player.y + this.player.height / 2,
                5, '#ffff00'
            );
        }
    }
    
    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            bullet.x += bullet.speed;
            return bullet.x > -bullet.width && bullet.x < this.canvas.width + bullet.width;
        });
    }
    
    spawnEnemies() {
        if (this.enemies.length < this.config.maxEnemies && Math.random() < this.config.enemySpawnRate) {
            const enemyType = Math.random() < 0.7 ? 'basic' : 'strong';
            const enemy = {
                x: this.canvas.width,
                y: Math.random() * (this.canvas.height - 100) + 50,
                width: enemyType === 'basic' ? 35 : 45,
                height: enemyType === 'basic' ? 35 : 45,
                speed: enemyType === 'basic' ? this.config.enemySpeed : this.config.enemySpeed * 0.7,
                health: enemyType === 'basic' ? 1 : 2,
                maxHealth: enemyType === 'basic' ? 1 : 2,
                type: enemyType,
                color: enemyType === 'basic' ? '#ff0000' : '#ff6600',
                shootCooldown: 0,
                shootRate: enemyType === 'basic' ? 120 : 80
            };
            this.enemies.push(enemy);
        }
    }
    
    updateEnemies() {
        this.enemies.forEach(enemy => {
            enemy.x -= enemy.speed;
            
            // 敌人射击
            enemy.shootCooldown--;
            if (enemy.shootCooldown <= 0 && Math.random() < 0.02) {
                this.bullets.push({
                    x: enemy.x,
                    y: enemy.y + enemy.height / 2,
                    width: 6,
                    height: 3,
                    speed: -4,
                    direction: -1,
                    color: '#ff4444',
                    isEnemyBullet: true
                });
                enemy.shootCooldown = enemy.shootRate;
            }
        });
        
        // 移除超出屏幕的敌人
        this.enemies = this.enemies.filter(enemy => enemy.x > -enemy.width);
    }
    
    checkCollisions() {
        // 玩家子弹击中敌人
        this.bullets.forEach((bullet, bIndex) => {
            if (bullet.isEnemyBullet) return;
            
            this.enemies.forEach((enemy, eIndex) => {
                if (this.isColliding(bullet, enemy)) {
                    enemy.health--;
                    this.bullets.splice(bIndex, 1);
                    
                    if (enemy.health <= 0) {
                        this.destroyEnemy(enemy, eIndex);
                    } else {
                        // 受伤效果
                        this.createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 3, '#ffaa00');
                    }
                }
            });
        });
        
        // 敌人子弹击中玩家
        this.bullets.forEach((bullet, bIndex) => {
            if (!bullet.isEnemyBullet) return;
            
            if (this.isColliding(bullet, this.player) && !this.player.isInvulnerable) {
                this.playerHit();
                this.bullets.splice(bIndex, 1);
            }
        });
        
        // 玩家与敌人碰撞
        if (!this.player.isInvulnerable) {
            this.enemies.forEach((enemy, eIndex) => {
                if (this.isColliding(this.player, enemy)) {
                    this.playerHit();
                    this.destroyEnemy(enemy, eIndex);
                }
            });
        }
    }
    
    isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    destroyEnemy(enemy, index) {
        this.gameState.score += enemy.type === 'basic' ? 10 : 25;
        this.gameState.enemiesKilled++;
        
        // 创建爆炸效果
        this.explosions.push({
            x: enemy.x + enemy.width / 2,
            y: enemy.y + enemy.height / 2,
            radius: 0,
            maxRadius: enemy.width,
            duration: this.config.explosionDuration,
            currentTime: 0
        });
        
        // 创建粒子效果
        this.createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 10, enemy.color);
        
        this.enemies.splice(index, 1);
        this.updateUI();
    }
    
    playerHit() {
        this.gameState.lives--;
        this.player.isInvulnerable = true;
        this.player.invulnerabilityTime = this.config.invulnerabilityDuration;
        
        // 创建受伤效果
        this.createParticles(this.player.x + this.player.width/2, this.player.y + this.player.height/2, 8, '#ff0000');
        
        if (this.gameState.lives <= 0) {
            this.gameOver();
        }
        
        this.updateUI();
    }
    
    createParticles(x, y, count, color) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 30,
                maxLife: 30,
                color: color,
                size: Math.random() * 3 + 1
            });
        }
    }
    
    updateExplosions() {
        this.explosions = this.explosions.filter(explosion => {
            explosion.currentTime++;
            explosion.radius = (explosion.currentTime / explosion.duration) * explosion.maxRadius;
            return explosion.currentTime < explosion.duration;
        });
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            return particle.life > 0;
        });
    }
    
    updateBackground() {
        this.background.x -= this.background.speed;
        if (this.background.x <= -this.canvas.width) {
            this.background.x = 0;
        }
        
        // 移动星星
        this.background.stars.forEach(star => {
            star.x -= this.background.speed * star.brightness;
            if (star.x < 0) {
                star.x = this.canvas.width;
                star.y = Math.random() * this.canvas.height;
            }
        });
    }
    
    checkLevelProgression() {
        if (this.gameState.enemiesKilled >= this.gameState.nextLevelThreshold) {
            this.gameState.level++;
            this.gameState.enemiesKilled = 0;
            this.gameState.nextLevelThreshold += 5;
            
            // 增加难度
            this.config.enemySpawnRate = Math.min(0.03, this.config.enemySpawnRate + 0.002);
            this.config.enemySpeed = Math.min(4, this.config.enemySpeed + 0.2);
            this.config.maxEnemies = Math.min(15, this.config.maxEnemies + 1);
            
            this.updateUI();
        }
    }
    
    render() {
        // 清空画布
        this.ctx.fillStyle = '#000011';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.renderBackground();
        this.renderPlayer();
        this.renderBullets();
        this.renderEnemies();
        this.renderExplosions();
        this.renderParticles();
        
        if (this.gameState.isPaused) {
            this.renderPauseScreen();
        }
    }
    
    renderBackground() {
        // 渲染星空背景
        this.ctx.fillStyle = '#ffffff';
        this.background.stars.forEach(star => {
            this.ctx.globalAlpha = star.brightness;
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        });
        this.ctx.globalAlpha = 1;
    }
    
    renderPlayer() {
        const player = this.player;
        
        // 无敌时闪烁效果
        if (player.isInvulnerable && Math.floor(player.invulnerabilityTime / 5) % 2) {
            return;
        }
        
        // 绘制玩家
        this.ctx.fillStyle = player.color;
        this.ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // 绘制玩家细节
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(player.x + 5, player.y + 5, 30, 10);
        this.ctx.fillRect(player.x + 5, player.y + 25, 30, 10);
    }
    
    renderBullets() {
        this.bullets.forEach(bullet => {
            this.ctx.fillStyle = bullet.color;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            
            // 子弹光晕效果
            this.ctx.shadowColor = bullet.color;
            this.ctx.shadowBlur = 5;
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
            this.ctx.shadowBlur = 0;
        });
    }
    
    renderEnemies() {
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = enemy.color;
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            // 血量条
            if (enemy.health < enemy.maxHealth) {
                const barWidth = enemy.width;
                const barHeight = 4;
                const healthPercent = enemy.health / enemy.maxHealth;
                
                this.ctx.fillStyle = '#ff0000';
                this.ctx.fillRect(enemy.x, enemy.y - 8, barWidth, barHeight);
                this.ctx.fillStyle = '#00ff00';
                this.ctx.fillRect(enemy.x, enemy.y - 8, barWidth * healthPercent, barHeight);
            }
        });
    }
    
    renderExplosions() {
        this.explosions.forEach(explosion => {
            const alpha = 1 - (explosion.currentTime / explosion.duration);
            const colors = ['#ffff00', '#ff8800', '#ff0000'];
            
            colors.forEach((color, index) => {
                this.ctx.globalAlpha = alpha * (1 - index * 0.3);
                this.ctx.fillStyle = color;
                this.ctx.beginPath();
                this.ctx.arc(explosion.x, explosion.y, explosion.radius - index * 5, 0, Math.PI * 2);
                this.ctx.fill();
            });
            
            this.ctx.globalAlpha = 1;
        });
    }
    
    renderParticles() {
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
        });
        this.ctx.globalAlpha = 1;
    }
    
    renderPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏暂停', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('按 P 键或点击继续按钮恢复游戏', this.canvas.width / 2, this.canvas.height / 2 + 50);
    }
    
    gameOver() {
        this.gameState.isRunning = false;
        
        // 显示游戏结束画面
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#ff0000';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '24px Arial';
        this.ctx.fillText(`最终得分: ${this.gameState.score}`, this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText(`到达关卡: ${this.gameState.level}`, this.canvas.width / 2, this.canvas.height / 2 + 30);
        this.ctx.fillText('点击重新开始按钮再次游戏', this.canvas.width / 2, this.canvas.height / 2 + 80);
    }
    
    updateUI() {
        document.getElementById('scoreDisplay').textContent = `得分: ${this.gameState.score}`;
        document.getElementById('livesDisplay').textContent = `生命: ${this.gameState.lives}`;
        document.getElementById('levelDisplay').textContent = `关卡: ${this.gameState.level}`;
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    const game = new ContraGame();
});