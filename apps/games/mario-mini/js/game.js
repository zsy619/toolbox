class MarioGame {
            constructor() {
                this.canvas = document.getElementById('gameCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.canvas.width = 800;
                this.canvas.height = 400;
                
                this.gameState = 'menu'; // menu, playing, paused, gameOver
                this.score = 0;
                this.lives = 3;
                this.level = 1;
                this.camera = { x: 0, y: 0 };
                
                this.keys = {};
                this.gravity = 0.8;
                this.friction = 0.85;
                
                this.mario = {
                    x: 100,
                    y: 200,
                    width: 32,
                    height: 32,
                    vx: 0,
                    vy: 0,
                    speed: 5,
                    jumpPower: 15,
                    onGround: false,
                    direction: 1, // 1 for right, -1 for left
                    color: '#e74c3c'
                };
                
                this.platforms = [];
                this.enemies = [];
                this.coins = [];
                this.powerups = [];
                
                this.initLevel();
                this.bindEvents();
                this.updateUI();
            }

            initLevel() {
                // 清空当前关卡
                this.platforms = [];
                this.enemies = [];
                this.coins = [];
                this.powerups = [];
                
                // 重置马里奥位置
                this.mario.x = 100;
                this.mario.y = 200;
                this.mario.vx = 0;
                this.mario.vy = 0;
                this.camera.x = 0;
                
                // 生成平台
                this.generatePlatforms();
                
                // 生成敌人
                this.generateEnemies();
                
                // 生成金币
                this.generateCoins();
                
                // 生成道具
                this.generatePowerups();
            }

            generatePlatforms() {
                // 地面平台
                for (let i = 0; i < 40; i++) {
                    this.platforms.push({
                        x: i * 40,
                        y: 360,
                        width: 40,
                        height: 40,
                        color: '#8b4513',
                        type: 'ground'
                    });
                }
                
                // 悬浮平台
                const platformData = [
                    { x: 300, y: 280, width: 120, height: 20 },
                    { x: 500, y: 220, width: 80, height: 20 },
                    { x: 700, y: 300, width: 100, height: 20 },
                    { x: 900, y: 180, width: 120, height: 20 },
                    { x: 1100, y: 260, width: 80, height: 20 },
                    { x: 1300, y: 200, width: 100, height: 20 },
                    { x: 1500, y: 280, width: 120, height: 20 }
                ];
                
                platformData.forEach(platform => {
                    this.platforms.push({
                        ...platform,
                        color: '#27ae60',
                        type: 'platform'
                    });
                });
            }

            generateEnemies() {
                const enemyPositions = [
                    { x: 400, y: 320 },
                    { x: 600, y: 320 },
                    { x: 800, y: 320 },
                    { x: 1000, y: 320 },
                    { x: 1200, y: 320 }
                ];
                
                enemyPositions.forEach(pos => {
                    this.enemies.push({
                        x: pos.x,
                        y: pos.y,
                        width: 24,
                        height: 24,
                        vx: -1,
                        color: '#e74c3c',
                        alive: true
                    });
                });
            }

            generateCoins() {
                const coinPositions = [
                    { x: 350, y: 240 },
                    { x: 380, y: 240 },
                    { x: 530, y: 180 },
                    { x: 730, y: 260 },
                    { x: 930, y: 140 },
                    { x: 960, y: 140 },
                    { x: 1130, y: 220 },
                    { x: 1330, y: 160 }
                ];
                
                coinPositions.forEach(pos => {
                    this.coins.push({
                        x: pos.x,
                        y: pos.y,
                        width: 16,
                        height: 16,
                        color: '#f1c40f',
                        collected: false,
                        rotation: 0
                    });
                });
            }

            generatePowerups() {
                const powerupPositions = [
                    { x: 550, y: 180, type: 'mushroom' },
                    { x: 950, y: 140, type: 'flower' }
                ];
                
                powerupPositions.forEach(pos => {
                    this.powerups.push({
                        x: pos.x,
                        y: pos.y,
                        width: 20,
                        height: 20,
                        type: pos.type,
                        color: pos.type === 'mushroom' ? '#e74c3c' : '#e17055',
                        collected: false
                    });
                });
            }

            bindEvents() {
                document.getElementById('startButton').addEventListener('click', () => {
                    this.startGame();
                });
                
                document.addEventListener('keydown', (e) => {
                    this.keys[e.key.toLowerCase()] = true;
                    this.keys[e.code] = true;
                });
                
                document.addEventListener('keyup', (e) => {
                    this.keys[e.key.toLowerCase()] = false;
                    this.keys[e.code] = false;
                });
                
                // 防止页面滚动
                document.addEventListener('keydown', (e) => {
                    if(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
                        e.preventDefault();
                    }
                });
            }

            startGame() {
                this.gameState = 'playing';
                this.score = 0;
                this.lives = 3;
                this.level = 1;
                this.initLevel();
                this.updateUI();
                this.hideMessage();
                document.getElementById('startButton').style.display = 'none';
                this.gameLoop();
            }

            gameLoop() {
                if (this.gameState === 'playing') {
                    this.update();
                    this.draw();
                    requestAnimationFrame(() => this.gameLoop());
                }
            }

            update() {
                this.updateMario();
                this.updateEnemies();
                this.updateCoins();
                this.updateCamera();
                this.checkCollisions();
                this.checkLevelComplete();
            }

            updateMario() {
                // 处理输入
                if (this.keys['a'] || this.keys['arrowleft']) {
                    this.mario.vx = -this.mario.speed;
                    this.mario.direction = -1;
                } else if (this.keys['d'] || this.keys['arrowright']) {
                    this.mario.vx = this.mario.speed;
                    this.mario.direction = 1;
                } else {
                    this.mario.vx *= this.friction;
                }
                
                if ((this.keys['w'] || this.keys['arrowup'] || this.keys[' ']) && this.mario.onGround) {
                    this.mario.vy = -this.mario.jumpPower;
                    this.mario.onGround = false;
                }
                
                // 应用重力
                this.mario.vy += this.gravity;
                
                // 更新位置
                this.mario.x += this.mario.vx;
                this.mario.y += this.mario.vy;
                
                // 防止掉出地图
                if (this.mario.y > this.canvas.height) {
                    this.loseLife();
                }
                
                // 限制左边界
                if (this.mario.x < 0) {
                    this.mario.x = 0;
                }
            }

            updateEnemies() {
                this.enemies.forEach(enemy => {
                    if (!enemy.alive) return;
                    
                    enemy.x += enemy.vx;
                    
                    // 碰到边界或平台边缘时转向
                    let onPlatform = false;
                    this.platforms.forEach(platform => {
                        if (enemy.x + enemy.width > platform.x && 
                            enemy.x < platform.x + platform.width &&
                            enemy.y + enemy.height >= platform.y &&
                            enemy.y + enemy.height <= platform.y + 10) {
                            onPlatform = true;
                        }
                    });
                    
                    if (!onPlatform || enemy.x <= 0) {
                        enemy.vx *= -1;
                    }
                });
            }

            updateCoins() {
                this.coins.forEach(coin => {
                    if (!coin.collected) {
                        coin.rotation += 0.1;
                    }
                });
            }

            updateCamera() {
                // 相机跟随马里奥
                const targetX = this.mario.x - this.canvas.width / 3;
                this.camera.x = Math.max(0, targetX);
            }

            checkCollisions() {
                // 马里奥与平台碰撞
                this.mario.onGround = false;
                this.platforms.forEach(platform => {
                    if (this.mario.x < platform.x + platform.width &&
                        this.mario.x + this.mario.width > platform.x &&
                        this.mario.y < platform.y + platform.height &&
                        this.mario.y + this.mario.height > platform.y) {
                        
                        // 从上方落下
                        if (this.mario.vy > 0 && this.mario.y < platform.y) {
                            this.mario.y = platform.y - this.mario.height;
                            this.mario.vy = 0;
                            this.mario.onGround = true;
                        }
                        // 从下方撞击
                        else if (this.mario.vy < 0 && this.mario.y > platform.y) {
                            this.mario.y = platform.y + platform.height;
                            this.mario.vy = 0;
                        }
                        // 从左侧撞击
                        else if (this.mario.vx > 0 && this.mario.x < platform.x) {
                            this.mario.x = platform.x - this.mario.width;
                            this.mario.vx = 0;
                        }
                        // 从右侧撞击
                        else if (this.mario.vx < 0 && this.mario.x > platform.x) {
                            this.mario.x = platform.x + platform.width;
                            this.mario.vx = 0;
                        }
                    }
                });

                // 马里奥与敌人碰撞
                this.enemies.forEach(enemy => {
                    if (!enemy.alive) return;
                    
                    if (this.mario.x < enemy.x + enemy.width &&
                        this.mario.x + this.mario.width > enemy.x &&
                        this.mario.y < enemy.y + enemy.height &&
                        this.mario.y + this.mario.height > enemy.y) {
                        
                        // 从上方踩死敌人
                        if (this.mario.vy > 0 && this.mario.y < enemy.y) {
                            enemy.alive = false;
                            this.mario.vy = -8; // 反弹效果
                            this.score += 100;
                            this.updateUI();
                        } else {
                            // 被敌人撞击
                            this.loseLife();
                        }
                    }
                });

                // 马里奥与金币碰撞
                this.coins.forEach(coin => {
                    if (coin.collected) return;
                    
                    if (this.mario.x < coin.x + coin.width &&
                        this.mario.x + this.mario.width > coin.x &&
                        this.mario.y < coin.y + coin.height &&
                        this.mario.y + this.mario.height > coin.y) {
                        
                        coin.collected = true;
                        this.score += 50;
                        this.updateUI();
                    }
                });

                // 马里奥与道具碰撞
                this.powerups.forEach(powerup => {
                    if (powerup.collected) return;
                    
                    if (this.mario.x < powerup.x + powerup.width &&
                        this.mario.x + this.mario.width > powerup.x &&
                        this.mario.y < powerup.y + powerup.height &&
                        this.mario.y + this.mario.height > powerup.y) {
                        
                        powerup.collected = true;
                        this.score += 200;
                        this.updateUI();
                    }
                });
            }

            checkLevelComplete() {
                // 检查是否到达关卡终点
                if (this.mario.x > 1600) {
                    this.level++;
                    this.showMessage('恭喜通关！进入下一关！', 'level-complete');
                    setTimeout(() => {
                        this.initLevel();
                        this.hideMessage();
                    }, 2000);
                }
            }

            loseLife() {
                this.lives--;
                this.updateUI();
                
                if (this.lives <= 0) {
                    this.gameOver();
                } else {
                    // 重置马里奥位置
                    this.mario.x = 100;
                    this.mario.y = 200;
                    this.mario.vx = 0;
                    this.mario.vy = 0;
                    this.camera.x = 0;
                }
            }

            gameOver() {
                this.gameState = 'gameOver';
                this.showMessage('游戏结束！点击重新开始', 'game-over');
                document.getElementById('startButton').style.display = 'block';
                document.getElementById('startButton').textContent = '重新开始';
            }

            draw() {
                // 清空画布
                this.ctx.fillStyle = '#74b9ff';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // 保存当前状态
                this.ctx.save();
                
                // 应用相机变换
                this.ctx.translate(-this.camera.x, -this.camera.y);
                
                // 绘制平台
                this.platforms.forEach(platform => {
                    this.ctx.fillStyle = platform.color;
                    this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
                    
                    // 添加边框
                    this.ctx.strokeStyle = '#2d3436';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
                });
                
                // 绘制金币
                this.coins.forEach(coin => {
                    if (coin.collected) return;
                    
                    this.ctx.save();
                    this.ctx.translate(coin.x + coin.width/2, coin.y + coin.height/2);
                    this.ctx.rotate(coin.rotation);
                    
                    this.ctx.fillStyle = coin.color;
                    this.ctx.fillRect(-coin.width/2, -coin.height/2, coin.width, coin.height);
                    
                    this.ctx.strokeStyle = '#f39c12';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(-coin.width/2, -coin.height/2, coin.width, coin.height);
                    
                    this.ctx.restore();
                });
                
                // 绘制道具
                this.powerups.forEach(powerup => {
                    if (powerup.collected) return;
                    
                    this.ctx.fillStyle = powerup.color;
                    this.ctx.fillRect(powerup.x, powerup.y, powerup.width, powerup.height);
                    
                    this.ctx.strokeStyle = '#2d3436';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(powerup.x, powerup.y, powerup.width, powerup.height);
                });
                
                // 绘制敌人
                this.enemies.forEach(enemy => {
                    if (!enemy.alive) return;
                    
                    this.ctx.fillStyle = enemy.color;
                    this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                    
                    this.ctx.strokeStyle = '#c0392b';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
                });
                
                // 绘制马里奥
                this.ctx.fillStyle = this.mario.color;
                this.ctx.fillRect(this.mario.x, this.mario.y, this.mario.width, this.mario.height);
                
                this.ctx.strokeStyle = '#c0392b';
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(this.mario.x, this.mario.y, this.mario.width, this.mario.height);
                
                // 绘制马里奥的眼睛（表示方向）
                this.ctx.fillStyle = 'white';
                if (this.mario.direction === 1) {
                    this.ctx.fillRect(this.mario.x + 20, this.mario.y + 8, 6, 6);
                } else {
                    this.ctx.fillRect(this.mario.x + 6, this.mario.y + 8, 6, 6);
                }
                
                // 恢复状态
                this.ctx.restore();
            }

            updateUI() {
                document.getElementById('score').textContent = this.score;
                document.getElementById('lives').textContent = this.lives;
                document.getElementById('level').textContent = this.level;
            }

            showMessage(text, type) {
                const message = document.getElementById('message');
                message.textContent = text;
                message.className = `message ${type} show`;
            }

            hideMessage() {
                const message = document.getElementById('message');
                message.classList.remove('show');
            }
        }

        // 启动游戏
        window.addEventListener('load', () => {
            new MarioGame();
        });