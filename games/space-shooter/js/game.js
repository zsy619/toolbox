class SpaceShooter {
            constructor() {
                this.canvas = document.getElementById('gameCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.gameRunning = false;
                this.gamePaused = false;
                
                // 游戏状态
                this.score = 0;
                this.level = 1;
                this.lives = 3;
                this.enemiesKilled = 0;
                this.gameTime = 0;
                this.highScore = localStorage.getItem('spaceShooterHighScore') || 0;
                
                // 游戏对象
                this.player = null;
                this.bullets = [];
                this.enemies = [];
                this.enemyBullets = [];
                this.powerUps = [];
                this.particles = [];
                
                // 游戏设置
                this.enemySpawnRate = 0.02;
                this.powerUpSpawnRate = 0.001;
                this.gameSpeed = 1;
                
                // 输入状态
                this.keys = {};
                
                // 初始化
                this.init();
            }

            init() {
                this.setupEventListeners();
                this.updateDisplay();
                this.createPlayer();
            }

            setupEventListeners() {
                // 键盘事件
                document.addEventListener('keydown', (e) => {
                    this.keys[e.code] = true;
                    if (e.code === 'Space') {
                        e.preventDefault();
                        if (this.gameRunning && !this.gamePaused) {
                            this.shoot();
                        }
                    }
                });

                document.addEventListener('keyup', (e) => {
                    this.keys[e.code] = false;
                });

                // 触屏事件
                this.canvas.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    if (this.gameRunning && !this.gamePaused) {
                        this.shoot();
                    }
                });

                this.canvas.addEventListener('click', (e) => {
                    if (this.gameRunning && !this.gamePaused) {
                        this.shoot();
                    }
                });
            }

            createPlayer() {
                this.player = {
                    x: this.canvas.width / 2 - 15,
                    y: this.canvas.height - 60,
                    width: 30,
                    height: 30,
                    speed: 5,
                    shootCooldown: 0,
                    shield: 0,
                    doubleShot: 0,
                    rapidFire: 0
                };
            }

            startGame() {
                if (this.gameRunning) return;
                
                this.gameRunning = true;
                this.gamePaused = false;
                this.score = 0;
                this.level = 1;
                this.lives = 3;
                this.enemiesKilled = 0;
                this.gameTime = 0;
                
                // 清空游戏对象
                this.bullets = [];
                this.enemies = [];
                this.enemyBullets = [];
                this.powerUps = [];
                this.particles = [];
                
                this.createPlayer();
                this.updateDisplay();
                
                document.getElementById('startBtn').disabled = true;
                document.getElementById('pauseBtn').disabled = false;
                
                this.gameLoop();
            }

            togglePause() {
                if (!this.gameRunning) return;
                
                this.gamePaused = !this.gamePaused;
                const pauseBtn = document.getElementById('pauseBtn');
                pauseBtn.textContent = this.gamePaused ? '▶️ 继续' : '⏸️ 暂停';
                
                if (!this.gamePaused) {
                    this.gameLoop();
                }
            }

            restartGame() {
                this.endGame();
                setTimeout(() => this.startGame(), 100);
            }

            endGame() {
                this.gameRunning = false;
                this.gamePaused = false;
                
                document.getElementById('startBtn').disabled = false;
                document.getElementById('pauseBtn').disabled = true;
                
                // 更新最高分
                if (this.score > this.highScore) {
                    this.highScore = this.score;
                    localStorage.setItem('spaceShooterHighScore', this.highScore);
                }
                
                this.showGameOver();
            }

            gameLoop() {
                if (!this.gameRunning || this.gamePaused) return;
                
                this.update();
                this.render();
                
                requestAnimationFrame(() => this.gameLoop());
            }

            update() {
                this.gameTime++;
                
                // 更新玩家
                this.updatePlayer();
                
                // 生成敌人
                if (Math.random() < this.enemySpawnRate * this.level) {
                    this.spawnEnemy();
                }
                
                // 生成道具
                if (Math.random() < this.powerUpSpawnRate) {
                    this.spawnPowerUp();
                }
                
                // 更新游戏对象
                this.updateBullets();
                this.updateEnemies();
                this.updateEnemyBullets();
                this.updatePowerUps();
                this.updateParticles();
                
                // 碰撞检测
                this.checkCollisions();
                
                // 更新等级
                this.updateLevel();
                
                // 更新显示
                this.updateDisplay();
            }

            updatePlayer() {
                const player = this.player;
                
                // 移动控制
                if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
                    player.x = Math.max(0, player.x - player.speed);
                }
                if (this.keys['ArrowRight'] || this.keys['KeyD']) {
                    player.x = Math.min(this.canvas.width - player.width, player.x + player.speed);
                }
                if (this.keys['ArrowUp'] || this.keys['KeyW']) {
                    player.y = Math.max(0, player.y - player.speed);
                }
                if (this.keys['ArrowDown'] || this.keys['KeyS']) {
                    player.y = Math.min(this.canvas.height - player.height, player.y + player.speed);
                }
                
                // 减少冷却时间
                if (player.shootCooldown > 0) player.shootCooldown--;
                
                // 减少道具时间
                if (player.shield > 0) player.shield--;
                if (player.doubleShot > 0) player.doubleShot--;
                if (player.rapidFire > 0) player.rapidFire--;
            }

            shoot() {
                const player = this.player;
                const cooldown = player.rapidFire > 0 ? 3 : 10;
                
                if (player.shootCooldown <= 0) {
                    // 普通射击
                    this.bullets.push({
                        x: player.x + player.width / 2 - 2,
                        y: player.y,
                        width: 4,
                        height: 10,
                        speed: 8,
                        damage: 1
                    });
                    
                    // 双重射击
                    if (player.doubleShot > 0) {
                        this.bullets.push({
                            x: player.x + player.width / 2 - 10,
                            y: player.y,
                            width: 4,
                            height: 10,
                            speed: 8,
                            damage: 1
                        });
                        this.bullets.push({
                            x: player.x + player.width / 2 + 6,
                            y: player.y,
                            width: 4,
                            height: 10,
                            speed: 8,
                            damage: 1
                        });
                    }
                    
                    player.shootCooldown = cooldown;
                }
            }

            spawnEnemy() {
                const types = ['basic', 'fast', 'strong'];
                const type = types[Math.floor(Math.random() * types.length)];
                
                let enemy = {
                    x: Math.random() * (this.canvas.width - 30),
                    y: -30,
                    width: 30,
                    height: 30,
                    speed: 2,
                    health: 1,
                    shootCooldown: 0,
                    type: type,
                    points: 10
                };
                
                // 根据类型调整属性
                switch (type) {
                    case 'fast':
                        enemy.speed = 4;
                        enemy.points = 15;
                        break;
                    case 'strong':
                        enemy.health = 3;
                        enemy.width = 40;
                        enemy.height = 40;
                        enemy.speed = 1;
                        enemy.points = 30;
                        break;
                }
                
                this.enemies.push(enemy);
            }

            spawnPowerUp() {
                const types = ['doubleShot', 'rapidFire', 'health', 'shield', 'bomb', 'scoreBoost'];
                const type = types[Math.floor(Math.random() * types.length)];
                
                this.powerUps.push({
                    x: Math.random() * (this.canvas.width - 20),
                    y: -20,
                    width: 20,
                    height: 20,
                    speed: 2,
                    type: type
                });
            }

            updateBullets() {
                for (let i = this.bullets.length - 1; i >= 0; i--) {
                    const bullet = this.bullets[i];
                    bullet.y -= bullet.speed;
                    
                    if (bullet.y + bullet.height < 0) {
                        this.bullets.splice(i, 1);
                    }
                }
            }

            updateEnemies() {
                for (let i = this.enemies.length - 1; i >= 0; i--) {
                    const enemy = this.enemies[i];
                    enemy.y += enemy.speed * this.gameSpeed;
                    
                    // 敌人射击
                    if (enemy.shootCooldown <= 0 && Math.random() < 0.01) {
                        this.enemyBullets.push({
                            x: enemy.x + enemy.width / 2 - 2,
                            y: enemy.y + enemy.height,
                            width: 4,
                            height: 8,
                            speed: 4
                        });
                        enemy.shootCooldown = 60;
                    }
                    
                    if (enemy.shootCooldown > 0) enemy.shootCooldown--;
                    
                    // 移除超出屏幕的敌人
                    if (enemy.y > this.canvas.height) {
                        this.enemies.splice(i, 1);
                    }
                }
            }

            updateEnemyBullets() {
                for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
                    const bullet = this.enemyBullets[i];
                    bullet.y += bullet.speed;
                    
                    if (bullet.y > this.canvas.height) {
                        this.enemyBullets.splice(i, 1);
                    }
                }
            }

            updatePowerUps() {
                for (let i = this.powerUps.length - 1; i >= 0; i--) {
                    const powerUp = this.powerUps[i];
                    powerUp.y += powerUp.speed;
                    
                    if (powerUp.y > this.canvas.height) {
                        this.powerUps.splice(i, 1);
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
                // 子弹击中敌人
                for (let i = this.bullets.length - 1; i >= 0; i--) {
                    const bullet = this.bullets[i];
                    
                    for (let j = this.enemies.length - 1; j >= 0; j--) {
                        const enemy = this.enemies[j];
                        
                        if (this.isColliding(bullet, enemy)) {
                            enemy.health -= bullet.damage;
                            this.bullets.splice(i, 1);
                            
                            if (enemy.health <= 0) {
                                this.score += enemy.points;
                                this.enemiesKilled++;
                                this.createExplosion(enemy.x, enemy.y);
                                this.enemies.splice(j, 1);
                            }
                            break;
                        }
                    }
                }
                
                // 敌人子弹击中玩家
                for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
                    const bullet = this.enemyBullets[i];
                    
                    if (this.isColliding(bullet, this.player)) {
                        if (this.player.shield <= 0) {
                            this.lives--;
                            this.createExplosion(this.player.x, this.player.y);
                        }
                        this.enemyBullets.splice(i, 1);
                        
                        if (this.lives <= 0) {
                            this.endGame();
                            return;
                        }
                    }
                }
                
                // 敌人撞击玩家
                for (let i = this.enemies.length - 1; i >= 0; i--) {
                    const enemy = this.enemies[i];
                    
                    if (this.isColliding(enemy, this.player)) {
                        if (this.player.shield <= 0) {
                            this.lives--;
                            this.createExplosion(this.player.x, this.player.y);
                        }
                        this.createExplosion(enemy.x, enemy.y);
                        this.enemies.splice(i, 1);
                        
                        if (this.lives <= 0) {
                            this.endGame();
                            return;
                        }
                    }
                }
                
                // 玩家收集道具
                for (let i = this.powerUps.length - 1; i >= 0; i--) {
                    const powerUp = this.powerUps[i];
                    
                    if (this.isColliding(powerUp, this.player)) {
                        this.applyPowerUp(powerUp.type);
                        this.powerUps.splice(i, 1);
                    }
                }
            }

            applyPowerUp(type) {
                switch (type) {
                    case 'doubleShot':
                        this.player.doubleShot = 600;
                        break;
                    case 'rapidFire':
                        this.player.rapidFire = 600;
                        break;
                    case 'health':
                        this.lives = Math.min(5, this.lives + 1);
                        break;
                    case 'shield':
                        this.player.shield = 300;
                        break;
                    case 'bomb':
                        this.clearAllEnemies();
                        break;
                    case 'scoreBoost':
                        this.score += 100;
                        break;
                }
            }

            clearAllEnemies() {
                this.enemies.forEach(enemy => {
                    this.score += enemy.points;
                    this.enemiesKilled++;
                    this.createExplosion(enemy.x, enemy.y);
                });
                this.enemies = [];
                this.enemyBullets = [];
            }

            createExplosion(x, y) {
                for (let i = 0; i < 8; i++) {
                    this.particles.push({
                        x: x,
                        y: y,
                        vx: (Math.random() - 0.5) * 6,
                        vy: (Math.random() - 0.5) * 6,
                        life: 30,
                        color: `hsl(${Math.random() * 60 + 10}, 100%, 50%)`
                    });
                }
            }

            isColliding(rect1, rect2) {
                return rect1.x < rect2.x + rect2.width &&
                       rect1.x + rect1.width > rect2.x &&
                       rect1.y < rect2.y + rect2.height &&
                       rect1.y + rect1.height > rect2.y;
            }

            updateLevel() {
                const newLevel = Math.floor(this.enemiesKilled / 10) + 1;
                if (newLevel > this.level) {
                    this.level = newLevel;
                    this.enemySpawnRate = Math.min(0.05, this.enemySpawnRate + 0.005);
                    this.gameSpeed = Math.min(2, this.gameSpeed + 0.1);
                }
            }

            render() {
                // 清空画布
                this.ctx.fillStyle = 'linear-gradient(180deg, #001122 0%, #003366 100%)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // 绘制星空背景
                this.drawStars();
                
                // 绘制玩家
                this.drawPlayer();
                
                // 绘制子弹
                this.drawBullets();
                
                // 绘制敌人
                this.drawEnemies();
                
                // 绘制敌人子弹
                this.drawEnemyBullets();
                
                // 绘制道具
                this.drawPowerUps();
                
                // 绘制粒子效果
                this.drawParticles();
            }

            drawStars() {
                this.ctx.fillStyle = 'white';
                for (let i = 0; i < 50; i++) {
                    const x = (i * 137.5) % this.canvas.width;
                    const y = (i * 127.3 + this.gameTime * 0.5) % this.canvas.height;
                    this.ctx.fillRect(x, y, 1, 1);
                }
            }

            drawPlayer() {
                const player = this.player;
                
                // 护盾效果
                if (player.shield > 0) {
                    this.ctx.beginPath();
                    this.ctx.arc(player.x + player.width/2, player.y + player.height/2, player.width, 0, Math.PI * 2);
                    this.ctx.strokeStyle = `rgba(0, 255, 255, ${player.shield / 300})`;
                    this.ctx.lineWidth = 3;
                    this.ctx.stroke();
                }
                
                // 战舰
                this.ctx.fillStyle = '#4A90E2';
                this.ctx.fillRect(player.x, player.y, player.width, player.height);
                
                // 战舰装饰
                this.ctx.fillStyle = '#357ABD';
                this.ctx.fillRect(player.x + 5, player.y + 5, player.width - 10, player.height - 10);
            }

            drawBullets() {
                this.ctx.fillStyle = '#FFD700';
                this.bullets.forEach(bullet => {
                    this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
                });
            }

            drawEnemies() {
                this.enemies.forEach(enemy => {
                    let color = '#E74C3C';
                    if (enemy.type === 'fast') color = '#F39C12';
                    if (enemy.type === 'strong') color = '#8E44AD';
                    
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                    
                    // 敌人装饰
                    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                    this.ctx.fillRect(enemy.x + 2, enemy.y + 2, enemy.width - 4, enemy.height - 4);
                });
            }

            drawEnemyBullets() {
                this.ctx.fillStyle = '#E74C3C';
                this.enemyBullets.forEach(bullet => {
                    this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
                });
            }

            drawPowerUps() {
                this.powerUps.forEach(powerUp => {
                    let color = '#27AE60';
                    switch (powerUp.type) {
                        case 'doubleShot': color = '#E74C3C'; break;
                        case 'rapidFire': color = '#F39C12'; break;
                        case 'shield': color = '#9B59B6'; break;
                        case 'bomb': color = '#3498DB'; break;
                        case 'scoreBoost': color = '#E91E63'; break;
                    }
                    
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
                    
                    // 发光效果
                    this.ctx.shadowColor = color;
                    this.ctx.shadowBlur = 10;
                    this.ctx.fillRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height);
                    this.ctx.shadowBlur = 0;
                });
            }

            drawParticles() {
                this.particles.forEach(particle => {
                    this.ctx.fillStyle = particle.color;
                    this.ctx.globalAlpha = particle.life / 30;
                    this.ctx.fillRect(particle.x, particle.y, 3, 3);
                });
                this.ctx.globalAlpha = 1;
            }

            updateDisplay() {
                document.getElementById('score').textContent = this.score;
                document.getElementById('lives').textContent = this.lives;
                document.getElementById('level').textContent = this.level;
                document.getElementById('enemies').textContent = this.enemies.length;
                document.getElementById('highScore').textContent = this.highScore;
            }

            showGameOver() {
                const overlay = document.getElementById('gameOverOverlay');
                document.getElementById('finalScore').textContent = this.score;
                document.getElementById('enemiesKilled').textContent = this.enemiesKilled;
                document.getElementById('maxLevel').textContent = this.level;
                document.getElementById('survivalTime').textContent = Math.floor(this.gameTime / 60);
                
                // 计算星级
                let stars = '⭐';
                if (this.score > 1000) stars = '⭐⭐';
                if (this.score > 5000) stars = '⭐⭐⭐';
                if (this.score > 10000) stars = '⭐⭐⭐⭐';
                if (this.score > 20000) stars = '⭐⭐⭐⭐⭐';
                
                document.getElementById('starRating').textContent = stars;
                overlay.style.display = 'flex';
            }

            closeGameOver() {
                document.getElementById('gameOverOverlay').style.display = 'none';
            }

            showUpgrades() {
                alert('升级功能开发中...');
            }
        }

        // 全局游戏实例
        let spaceShooter;

        // 初始化游戏
        document.addEventListener('DOMContentLoaded', () => {
            spaceShooter = new SpaceShooter();
        });