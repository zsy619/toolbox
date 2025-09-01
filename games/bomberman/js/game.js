class BombermanGame {
            constructor() {
                this.canvas = document.getElementById('gameCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.canvas.width = 720;
                this.canvas.height = 480;
                
                this.tileSize = 40;
                this.cols = this.canvas.width / this.tileSize;
                this.rows = this.canvas.height / this.tileSize;
                
                this.gameState = 'menu';
                this.score = 0;
                this.lives = 3;
                this.level = 1;
                this.timeLeft = 180;
                this.gameTimer = null;
                this.isPaused = false;
                
                this.keys = {};
                this.player = null;
                this.enemies = [];
                this.bombs = [];
                this.explosions = [];
                this.blocks = [];
                this.powerups = [];
                this.walls = [];
                this.particles = [];
                
                this.initializeGame();
                this.bindEvents();
                this.updateUI();
                this.gameLoop();
            }

            initializeGame() {
                this.clearGame();
                this.generateMap();
                this.createPlayer();
                this.createEnemies();
                this.timeLeft = 180;
                this.particles = [];
            }

            clearGame() {
                this.bombs = [];
                this.explosions = [];
                this.blocks = [];
                this.powerups = [];
                this.walls = [];
                this.enemies = [];
                this.particles = [];
            }

            generateMap() {
                // 生成边界墙和固定墙
                for (let row = 0; row < this.rows; row++) {
                    for (let col = 0; col < this.cols; col++) {
                        if (row === 0 || row === this.rows - 1 || 
                            col === 0 || col === this.cols - 1 ||
                            (row % 2 === 0 && col % 2 === 0)) {
                            this.walls.push({
                                x: col * this.tileSize,
                                y: row * this.tileSize,
                                col: col,
                                row: row,
                                destructible: false
                            });
                        }
                    }
                }

                // 生成可破坏方块
                for (let row = 1; row < this.rows - 1; row++) {
                    for (let col = 1; col < this.cols - 1; col++) {
                        if ((row % 2 !== 0 || col % 2 !== 0) && 
                            !(row <= 2 && col <= 2) && 
                            Math.random() < 0.6) {
                            this.blocks.push({
                                x: col * this.tileSize,
                                y: row * this.tileSize,
                                col: col,
                                row: row,
                                destructible: true
                            });
                        }
                    }
                }
            }

            createPlayer() {
                this.player = {
                    x: this.tileSize,
                    y: this.tileSize,
                    width: this.tileSize - 4,
                    height: this.tileSize - 4,
                    speed: 2,
                    bombCount: 1,
                    bombPower: 1,
                    bombsPlaced: 0,
                    direction: 0,
                    moving: false,
                    invulnerable: false,
                    invulnerabilityTimer: 0
                };
            }

            createEnemies() {
                const enemyCount = Math.min(this.level + 1, 6);
                this.enemies = [];
                
                for (let i = 0; i < enemyCount; i++) {
                    let x, y;
                    do {
                        x = (Math.floor(Math.random() * (this.cols - 4)) + 2) * this.tileSize;
                        y = (Math.floor(Math.random() * (this.rows - 4)) + 2) * this.tileSize;
                    } while (this.isCollision(x, y, this.tileSize - 4, this.tileSize - 4) || 
                             (x < this.tileSize * 3 && y < this.tileSize * 3));
                    
                    this.enemies.push({
                        x: x,
                        y: y,
                        width: this.tileSize - 4,
                        height: this.tileSize - 4,
                        speed: Math.random() * 0.5 + 0.5,
                        direction: Math.floor(Math.random() * 4),
                        moveTimer: 0,
                        type: Math.random() < 0.7 ? 'basic' : 'smart'
                    });
                }
            }

            bindEvents() {
                document.addEventListener('keydown', (e) => {
                    this.keys[e.code] = true;
                    
                    if (e.code === 'Space') {
                        e.preventDefault();
                        if (this.gameState === 'playing') {
                            this.placeBomb();
                        }
                    }
                    
                    if (e.code === 'KeyP') {
                        this.togglePause();
                    }
                    
                    if (e.code === 'KeyR') {
                        this.restartGame();
                    }
                });

                document.addEventListener('keyup', (e) => {
                    this.keys[e.code] = false;
                });

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

            startGame() {
                this.gameState = 'playing';
                this.isPaused = false;
                this.initializeGame();
                this.startTimer();
                this.hideMessage();
            }

            togglePause() {
                if (this.gameState === 'playing') {
                    this.isPaused = !this.isPaused;
                    if (this.isPaused) {
                        this.showMessage('游戏暂停', 'paused');
                        clearInterval(this.gameTimer);
                    } else {
                        this.hideMessage();
                        this.startTimer();
                    }
                }
            }

            restartGame() {
                clearInterval(this.gameTimer);
                this.score = 0;
                this.lives = 3;
                this.level = 1;
                this.startGame();
            }

            startTimer() {
                clearInterval(this.gameTimer);
                this.gameTimer = setInterval(() => {
                    if (!this.isPaused && this.gameState === 'playing') {
                        this.timeLeft--;
                        if (this.timeLeft <= 0) {
                            this.playerDie();
                        }
                        this.updateUI();
                    }
                }, 1000);
            }

            gameLoop() {
                if (this.gameState === 'playing' && !this.isPaused) {
                    this.updatePlayer();
                    this.updateEnemies();
                    this.updateBombs();
                    this.updateExplosions();
                    this.updatePowerups();
                    this.updateParticles();
                    this.checkCollisions();
                    this.checkLevelComplete();
                }
                
                this.render();
                requestAnimationFrame(() => this.gameLoop());
            }

            updatePlayer() {
                if (this.player.invulnerable) {
                    this.player.invulnerabilityTimer--;
                    if (this.player.invulnerabilityTimer <= 0) {
                        this.player.invulnerable = false;
                    }
                }

                let newX = this.player.x;
                let newY = this.player.y;
                this.player.moving = false;

                if (this.keys['ArrowLeft']) {
                    newX -= this.player.speed;
                    this.player.direction = 1;
                    this.player.moving = true;
                }
                if (this.keys['ArrowRight']) {
                    newX += this.player.speed;
                    this.player.direction = 3;
                    this.player.moving = true;
                }
                if (this.keys['ArrowUp']) {
                    newY -= this.player.speed;
                    this.player.direction = 2;
                    this.player.moving = true;
                }
                if (this.keys['ArrowDown']) {
                    newY += this.player.speed;
                    this.player.direction = 0;
                    this.player.moving = true;
                }

                if (!this.isCollision(newX, this.player.y, this.player.width, this.player.height)) {
                    this.player.x = newX;
                }
                if (!this.isCollision(this.player.x, newY, this.player.width, this.player.height)) {
                    this.player.y = newY;
                }
            }

            updateEnemies() {
                this.enemies.forEach(enemy => {
                    enemy.moveTimer--;
                    
                    if (enemy.moveTimer <= 0) {
                        if (enemy.type === 'smart') {
                            // 智能敌人：朝玩家方向移动
                            const dx = this.player.x - enemy.x;
                            const dy = this.player.y - enemy.y;
                            
                            if (Math.abs(dx) > Math.abs(dy)) {
                                enemy.direction = dx > 0 ? 3 : 1; // 右或左
                            } else {
                                enemy.direction = dy > 0 ? 0 : 2; // 下或上
                            }
                        } else {
                            // 基础敌人：随机方向
                            if (Math.random() < 0.3) {
                                enemy.direction = Math.floor(Math.random() * 4);
                            }
                        }
                        enemy.moveTimer = 60;
                    }

                    let newX = enemy.x;
                    let newY = enemy.y;

                    switch (enemy.direction) {
                        case 0: newY += enemy.speed; break; // 下
                        case 1: newX -= enemy.speed; break; // 左
                        case 2: newY -= enemy.speed; break; // 上
                        case 3: newX += enemy.speed; break; // 右
                    }

                    if (!this.isCollision(newX, newY, enemy.width, enemy.height)) {
                        enemy.x = newX;
                        enemy.y = newY;
                    } else {
                        enemy.direction = Math.floor(Math.random() * 4);
                    }
                });
            }

            updateBombs() {
                this.bombs.forEach((bomb, index) => {
                    bomb.timer--;
                    if (bomb.timer <= 0) {
                        this.explodeBomb(bomb);
                        this.bombs.splice(index, 1);
                        this.player.bombsPlaced--;
                    }
                });
            }

            updateExplosions() {
                this.explosions = this.explosions.filter(explosion => {
                    explosion.timer--;
                    return explosion.timer > 0;
                });
            }

            updatePowerups() {
                this.powerups.forEach((powerup, index) => {
                    if (this.isColliding(this.player, powerup)) {
                        this.collectPowerup(powerup);
                        this.powerups.splice(index, 1);
                    }
                });
            }

            updateParticles() {
                this.particles = this.particles.filter(particle => {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.life--;
                    particle.vx *= 0.95;
                    particle.vy *= 0.95;
                    return particle.life > 0;
                });
            }

            placeBomb() {
                if (this.player.bombsPlaced >= this.player.bombCount) return;
                
                const bombX = Math.floor((this.player.x + this.player.width / 2) / this.tileSize) * this.tileSize;
                const bombY = Math.floor((this.player.y + this.player.height / 2) / this.tileSize) * this.tileSize;
                
                const existingBomb = this.bombs.find(bomb => bomb.x === bombX && bomb.y === bombY);
                if (existingBomb) return;
                
                this.bombs.push({
                    x: bombX,
                    y: bombY,
                    timer: 120,
                    power: this.player.bombPower
                });
                
                this.player.bombsPlaced++;
                this.createParticles(bombX + this.tileSize/2, bombY + this.tileSize/2, 5, '#fd79a8');
            }

            explodeBomb(bomb) {
                const directions = [
                    { dx: 0, dy: -1 }, // 上
                    { dx: 0, dy: 1 },  // 下
                    { dx: -1, dy: 0 }, // 左
                    { dx: 1, dy: 0 }   // 右
                ];
                
                // 中心爆炸
                this.explosions.push({
                    x: bomb.x,
                    y: bomb.y,
                    timer: 30
                });
                
                this.createParticles(bomb.x + this.tileSize/2, bomb.y + this.tileSize/2, 15, '#ff6b35');

                // 四个方向的爆炸
                directions.forEach(dir => {
                    for (let i = 1; i <= bomb.power; i++) {
                        const x = bomb.x + dir.dx * this.tileSize * i;
                        const y = bomb.y + dir.dy * this.tileSize * i;
                        
                        // 检查不可破坏的墙
                        const wall = this.walls.find(w => w.x === x && w.y === y);
                        if (wall && !wall.destructible) break;
                        
                        // 检查可破坏方块
                        const blockIndex = this.blocks.findIndex(b => b.x === x && b.y === y);
                        if (blockIndex !== -1) {
                            this.blocks.splice(blockIndex, 1);
                            this.score += 10;
                            this.createParticles(x + this.tileSize/2, y + this.tileSize/2, 8, '#8e44ad');
                            
                            // 随机生成道具
                            if (Math.random() < 0.3) {
                                const powerupType = Math.random() < 0.5 ? 'bomb' : 'power';
                                this.powerups.push({
                                    x: x,
                                    y: y,
                                    type: powerupType,
                                    collected: false
                                });
                            }
                            break;
                        }
                        
                        this.explosions.push({
                            x: x,
                            y: y,
                            timer: 30
                        });
                    }
                });
            }

            collectPowerup(powerup) {
                if (powerup.type === 'bomb') {
                    this.player.bombCount++;
                    this.score += 50;
                } else if (powerup.type === 'power') {
                    this.player.bombPower++;
                    this.score += 50;
                }
                
                this.createParticles(powerup.x + this.tileSize/2, powerup.y + this.tileSize/2, 10, '#00b894');
                this.updateUI();
            }

            createParticles(x, y, count, color) {
                for (let i = 0; i < count; i++) {
                    this.particles.push({
                        x: x,
                        y: y,
                        vx: (Math.random() - 0.5) * 4,
                        vy: (Math.random() - 0.5) * 4,
                        life: 30,
                        color: color,
                        size: Math.random() * 3 + 1
                    });
                }
            }

            checkCollisions() {
                // 玩家与敌人碰撞
                if (!this.player.invulnerable) {
                    this.enemies.forEach(enemy => {
                        if (this.isColliding(this.player, enemy)) {
                            this.playerDie();
                        }
                    });
                }

                // 玩家与爆炸碰撞
                if (!this.player.invulnerable) {
                    this.explosions.forEach(explosion => {
                        if (this.isColliding(this.player, {
                            x: explosion.x,
                            y: explosion.y,
                            width: this.tileSize,
                            height: this.tileSize
                        })) {
                            this.playerDie();
                        }
                    });
                }

                // 敌人与爆炸碰撞
                this.enemies = this.enemies.filter(enemy => {
                    const hitByExplosion = this.explosions.some(explosion => 
                        this.isColliding(enemy, {
                            x: explosion.x,
                            y: explosion.y,
                            width: this.tileSize,
                            height: this.tileSize
                        })
                    );
                    
                    if (hitByExplosion) {
                        this.score += 100;
                        this.createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, 12, '#e17055');
                        this.updateUI();
                    }
                    
                    return !hitByExplosion;
                });
            }

            checkLevelComplete() {
                if (this.enemies.length === 0) {
                    this.level++;
                    this.timeLeft = 180;
                    this.showMessage(`关卡 ${this.level-1} 完成！`, 'level-complete');
                    setTimeout(() => {
                        this.initializeGame();
                        this.updateUI();
                    }, 2000);
                }
            }

            playerDie() {
                this.lives--;
                this.createParticles(this.player.x + this.player.width/2, this.player.y + this.player.height/2, 20, '#e17055');
                
                if (this.lives <= 0) {
                    this.gameOver();
                } else {
                    this.player.x = this.tileSize;
                    this.player.y = this.tileSize;
                    this.player.invulnerable = true;
                    this.player.invulnerabilityTimer = 180; // 3秒无敌
                }
                
                this.updateUI();
            }

            gameOver() {
                this.gameState = 'gameover';
                clearInterval(this.gameTimer);
                this.showMessage(`游戏结束！最终得分: ${this.score}`, 'game-over');
            }

            isCollision(x, y, width, height) {
                if (x < 0 || y < 0 || x + width > this.canvas.width || y + height > this.canvas.height) {
                    return true;
                }
                
                for (let wall of this.walls) {
                    if (x < wall.x + this.tileSize &&
                        x + width > wall.x &&
                        y < wall.y + this.tileSize &&
                        y + height > wall.y) {
                        return true;
                    }
                }
                
                for (let block of this.blocks) {
                    if (x < block.x + this.tileSize &&
                        x + width > block.x &&
                        y < block.y + this.tileSize &&
                        y + height > block.y) {
                        return true;
                    }
                }
                
                for (let bomb of this.bombs) {
                    if (x < bomb.x + this.tileSize &&
                        x + width > bomb.x &&
                        y < bomb.y + this.tileSize &&
                        y + height > bomb.y) {
                        return true;
                    }
                }
                
                return false;
            }

            isColliding(obj1, obj2) {
                return obj1.x < obj2.x + (obj2.width || this.tileSize) &&
                       obj1.x + obj1.width > obj2.x &&
                       obj1.y < obj2.y + (obj2.height || this.tileSize) &&
                       obj1.y + obj1.height > obj2.y;
            }

            render() {
                // 清空画布
                this.ctx.fillStyle = '#2d5016';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // 绘制网格
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                this.ctx.lineWidth = 1;
                for (let i = 0; i <= this.cols; i++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(i * this.tileSize, 0);
                    this.ctx.lineTo(i * this.tileSize, this.canvas.height);
                    this.ctx.stroke();
                }
                for (let i = 0; i <= this.rows; i++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, i * this.tileSize);
                    this.ctx.lineTo(this.canvas.width, i * this.tileSize);
                    this.ctx.stroke();
                }

                // 绘制墙壁
                this.walls.forEach(wall => {
                    this.ctx.fillStyle = wall.destructible ? '#8B4513' : '#654321';
                    this.ctx.fillRect(wall.x, wall.y, this.tileSize, this.tileSize);
                    
                    // 添加边框
                    this.ctx.strokeStyle = '#5D4037';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(wall.x, wall.y, this.tileSize, this.tileSize);
                });

                // 绘制可破坏方块
                this.blocks.forEach(block => {
                    this.ctx.fillStyle = '#D2691E';
                    this.ctx.fillRect(block.x, block.y, this.tileSize, this.tileSize);
                    
                    this.ctx.strokeStyle = '#A0522D';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(block.x, block.y, this.tileSize, this.tileSize);
                });

                // 绘制道具
                this.powerups.forEach(powerup => {
                    this.ctx.fillStyle = powerup.type === 'bomb' ? '#fd79a8' : '#fdcb6e';
                    this.ctx.fillRect(powerup.x + 5, powerup.y + 5, this.tileSize - 10, this.tileSize - 10);
                    
                    this.ctx.fillStyle = '#fff';
                    this.ctx.font = '20px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(
                        powerup.type === 'bomb' ? '💣' : '🔥',
                        powerup.x + this.tileSize / 2,
                        powerup.y + this.tileSize / 2 + 7
                    );
                });

                // 绘制炸弹
                this.bombs.forEach(bomb => {
                    const flash = Math.floor(bomb.timer / 10) % 2;
                    this.ctx.fillStyle = flash ? '#ff4757' : '#ff6b35';
                    this.ctx.fillRect(bomb.x + 2, bomb.y + 2, this.tileSize - 4, this.tileSize - 4);
                    
                    this.ctx.fillStyle = '#fff';
                    this.ctx.font = '24px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('💣', bomb.x + this.tileSize / 2, bomb.y + this.tileSize / 2 + 8);
                });

                // 绘制爆炸
                this.explosions.forEach(explosion => {
                    const intensity = explosion.timer / 30;
                    this.ctx.fillStyle = `rgba(255, 107, 53, ${intensity})`;
                    this.ctx.fillRect(explosion.x, explosion.y, this.tileSize, this.tileSize);
                    
                    this.ctx.fillStyle = `rgba(255, 235, 59, ${intensity * 0.8})`;
                    this.ctx.fillRect(explosion.x + 5, explosion.y + 5, this.tileSize - 10, this.tileSize - 10);
                });

                // 绘制粒子
                this.particles.forEach(particle => {
                    const alpha = particle.life / 30;
                    this.ctx.globalAlpha = alpha;
                    this.ctx.fillStyle = particle.color;
                    this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
                });
                this.ctx.globalAlpha = 1;

                // 绘制玩家
                if (!this.player.invulnerable || Math.floor(Date.now() / 100) % 2) {
                    this.ctx.fillStyle = '#74b9ff';
                    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
                    
                    this.ctx.fillStyle = '#fff';
                    this.ctx.font = '24px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('🤖', 
                        this.player.x + this.player.width / 2, 
                        this.player.y + this.player.height / 2 + 8
                    );
                }

                // 绘制敌人
                this.enemies.forEach(enemy => {
                    this.ctx.fillStyle = enemy.type === 'smart' ? '#e17055' : '#fd79a8';
                    this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                    
                    this.ctx.fillStyle = '#fff';
                    this.ctx.font = '20px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(
                        enemy.type === 'smart' ? '👾' : '👻',
                        enemy.x + enemy.width / 2,
                        enemy.y + enemy.height / 2 + 7
                    );
                });
            }

            showMessage(text, type) {
                const messageEl = document.getElementById('gameMessage');
                messageEl.textContent = text;
                messageEl.className = `message show ${type}`;
            }

            hideMessage() {
                const messageEl = document.getElementById('gameMessage');
                messageEl.className = 'message';
            }

            updateUI() {
                document.getElementById('scoreValue').textContent = this.score;
                document.getElementById('livesValue').textContent = this.lives;
                document.getElementById('levelValue').textContent = this.level;
                document.getElementById('timeValue').textContent = this.timeLeft;
            }
        }

        // 启动游戏
        document.addEventListener('DOMContentLoaded', () => {
            const game = new BombermanGame();
        });