class LaserDodge {
            constructor() {
                this.canvas = document.getElementById('gameCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.difficulty = 'easy';
                this.gameActive = false;
                this.paused = false;
                
                // 游戏状态
                this.score = 0;
                this.level = 1;
                this.lives = 3;
                this.time = 0;
                this.dodges = 0;
                
                // 玩家
                this.player = {
                    x: this.canvas.width / 2,
                    y: this.canvas.height / 2,
                    size: 12,
                    speed: 3,
                    color: '#2196F3'
                };
                
                // 激光
                this.lasers = [];
                this.powerUps = [];
                
                // 道具效果
                this.effects = {
                    shield: { active: false, time: 0 },
                    speed: { active: false, time: 0 },
                    slow: { active: false, time: 0 },
                    small: { active: false, time: 0 }
                };
                
                // 难度配置
                this.difficultyConfig = {
                    easy: { laserSpeed: 1.5, spawnRate: 0.02, maxLasers: 8, scoreMultiplier: 1 },
                    medium: { laserSpeed: 2.5, spawnRate: 0.035, maxLasers: 12, scoreMultiplier: 1.5 },
                    hard: { laserSpeed: 3.5, spawnRate: 0.05, maxLasers: 16, scoreMultiplier: 2 },
                    insane: { laserSpeed: 5, spawnRate: 0.08, maxLasers: 24, scoreMultiplier: 3 }
                };
                
                // 定时器
                this.gameLoop = null;
                this.startTime = 0;
                
                // 键盘状态
                this.keys = {};
                
                this.bindEvents();
            }
            
            bindEvents() {
                // 键盘事件
                document.addEventListener('keydown', (e) => {
                    this.keys[e.code] = true;
                    
                    if (e.code === 'Space') {
                        e.preventDefault();
                        if (this.gameActive) {
                            this.pauseGame();
                        } else {
                            this.startGame();
                        }
                    }
                });
                
                document.addEventListener('keyup', (e) => {
                    this.keys[e.code] = false;
                });
                
                // 鼠标事件
                this.canvas.addEventListener('mousemove', (e) => {
                    if (this.gameActive && !this.paused) {
                        const rect = this.canvas.getBoundingClientRect();
                        this.player.x = e.clientX - rect.left;
                        this.player.y = e.clientY - rect.top;
                    }
                });
                
                // 触摸事件
                this.canvas.addEventListener('touchmove', (e) => {
                    e.preventDefault();
                    if (this.gameActive && !this.paused) {
                        const rect = this.canvas.getBoundingClientRect();
                        const touch = e.touches[0];
                        this.player.x = touch.clientX - rect.left;
                        this.player.y = touch.clientY - rect.top;
                    }
                });
            }
            
            setDifficulty(difficulty) {
                if (this.gameActive) return;
                
                this.difficulty = difficulty;
                document.querySelectorAll('.difficulty-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                event.target.classList.add('active');
            }
            
            startGame() {
                this.gameActive = true;
                this.paused = false;
                this.score = 0;
                this.level = 1;
                this.lives = 3;
                this.time = 0;
                this.dodges = 0;
                this.startTime = Date.now();
                
                // 重置玩家位置
                this.player.x = this.canvas.width / 2;
                this.player.y = this.canvas.height / 2;
                this.player.size = 12;
                this.player.speed = 3;
                
                // 清空激光和道具
                this.lasers = [];
                this.powerUps = [];
                
                // 重置效果
                Object.keys(this.effects).forEach(key => {
                    this.effects[key] = { active: false, time: 0 };
                    document.getElementById(key + '-effect').classList.remove('active');
                });
                
                document.getElementById('startBtn').disabled = true;
                document.getElementById('pauseBtn').disabled = false;
                
                this.updateDisplay();
                this.gameLoop = setInterval(() => this.update(), 16);
            }
            
            pauseGame() {
                if (!this.gameActive) return;
                
                this.paused = !this.paused;
                const pauseBtn = document.getElementById('pauseBtn');
                
                if (this.paused) {
                    pauseBtn.textContent = '▶️ 继续';
                    if (this.gameLoop) {
                        clearInterval(this.gameLoop);
                        this.gameLoop = null;
                    }
                } else {
                    pauseBtn.textContent = '⏸️ 暂停';
                    this.gameLoop = setInterval(() => this.update(), 16);
                }
            }
            
            resetGame() {
                this.gameActive = false;
                this.paused = false;
                
                if (this.gameLoop) {
                    clearInterval(this.gameLoop);
                    this.gameLoop = null;
                }
                
                this.score = 0;
                this.level = 1;
                this.lives = 3;
                this.time = 0;
                this.dodges = 0;
                
                this.lasers = [];
                this.powerUps = [];
                
                Object.keys(this.effects).forEach(key => {
                    this.effects[key] = { active: false, time: 0 };
                    document.getElementById(key + '-effect').classList.remove('active');
                });
                
                document.getElementById('startBtn').disabled = false;
                document.getElementById('pauseBtn').disabled = true;
                document.getElementById('pauseBtn').textContent = '⏸️ 暂停';
                
                this.updateDisplay();
                this.draw();
            }
            
            update() {
                if (!this.gameActive || this.paused) return;
                
                this.updateTime();
                this.updatePlayer();
                this.updateLasers();
                this.updatePowerUps();
                this.updateEffects();
                this.spawnLasers();
                this.spawnPowerUps();
                this.checkCollisions();
                this.updateLevel();
                this.updateDisplay();
                this.draw();
            }
            
            updateTime() {
                this.time = (Date.now() - this.startTime) / 1000;
            }
            
            updatePlayer() {
                const speed = this.player.speed * (this.effects.speed.active ? 1.5 : 1);
                
                // 键盘控制
                if (this.keys['KeyW'] || this.keys['ArrowUp']) {
                    this.player.y = Math.max(this.player.size, this.player.y - speed);
                }
                if (this.keys['KeyS'] || this.keys['ArrowDown']) {
                    this.player.y = Math.min(this.canvas.height - this.player.size, this.player.y + speed);
                }
                if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
                    this.player.x = Math.max(this.player.size, this.player.x - speed);
                }
                if (this.keys['KeyD'] || this.keys['ArrowRight']) {
                    this.player.x = Math.min(this.canvas.width - this.player.size, this.player.x + speed);
                }
                
                // 边界检查
                this.player.x = Math.max(this.player.size, Math.min(this.canvas.width - this.player.size, this.player.x));
                this.player.y = Math.max(this.player.size, Math.min(this.canvas.height - this.player.size, this.player.y));
            }
            
            updateLasers() {
                const config = this.difficultyConfig[this.difficulty];
                const speedMultiplier = this.effects.slow.active ? 0.5 : 1;
                
                for (let i = this.lasers.length - 1; i >= 0; i--) {
                    const laser = this.lasers[i];
                    
                    laser.x += laser.dx * config.laserSpeed * speedMultiplier;
                    laser.y += laser.dy * config.laserSpeed * speedMultiplier;
                    
                    // 移除出界的激光
                    if (laser.x < -50 || laser.x > this.canvas.width + 50 ||
                        laser.y < -50 || laser.y > this.canvas.height + 50) {
                        this.lasers.splice(i, 1);
                        this.dodges++;
                    }
                }
            }
            
            updatePowerUps() {
                for (let i = this.powerUps.length - 1; i >= 0; i--) {
                    const powerUp = this.powerUps[i];
                    powerUp.rotation += 0.1;
                    
                    // 5秒后消失
                    if (Date.now() - powerUp.spawnTime > 5000) {
                        this.powerUps.splice(i, 1);
                    }
                }
            }
            
            updateEffects() {
                Object.keys(this.effects).forEach(key => {
                    const effect = this.effects[key];
                    if (effect.active) {
                        effect.time -= 16;
                        if (effect.time <= 0) {
                            effect.active = false;
                            document.getElementById(key + '-effect').classList.remove('active');
                            
                            // 恢复玩家大小
                            if (key === 'small') {
                                this.player.size = 12;
                            }
                        }
                    }
                });
            }
            
            spawnLasers() {
                const config = this.difficultyConfig[this.difficulty];
                
                if (this.lasers.length < config.maxLasers && Math.random() < config.spawnRate) {
                    const side = Math.floor(Math.random() * 4);
                    let x, y, dx, dy;
                    
                    switch (side) {
                        case 0: // 上
                            x = Math.random() * this.canvas.width;
                            y = -20;
                            dx = (Math.random() - 0.5) * 0.5;
                            dy = 1;
                            break;
                        case 1: // 右
                            x = this.canvas.width + 20;
                            y = Math.random() * this.canvas.height;
                            dx = -1;
                            dy = (Math.random() - 0.5) * 0.5;
                            break;
                        case 2: // 下
                            x = Math.random() * this.canvas.width;
                            y = this.canvas.height + 20;
                            dx = (Math.random() - 0.5) * 0.5;
                            dy = -1;
                            break;
                        case 3: // 左
                            x = -20;
                            y = Math.random() * this.canvas.height;
                            dx = 1;
                            dy = (Math.random() - 0.5) * 0.5;
                            break;
                    }
                    
                    this.lasers.push({
                        x, y, dx, dy,
                        width: 20,
                        height: 4,
                        color: '#F44336'
                    });
                }
            }
            
            spawnPowerUps() {
                if (this.powerUps.length < 2 && Math.random() < 0.001) {
                    const types = ['shield', 'speed', 'slow', 'small'];
                    const type = types[Math.floor(Math.random() * types.length)];
                    
                    this.powerUps.push({
                        x: Math.random() * (this.canvas.width - 40) + 20,
                        y: Math.random() * (this.canvas.height - 40) + 20,
                        size: 15,
                        type: type,
                        rotation: 0,
                        spawnTime: Date.now()
                    });
                }
            }
            
            checkCollisions() {
                // 激光碰撞
                for (let i = this.lasers.length - 1; i >= 0; i--) {
                    const laser = this.lasers[i];
                    const distance = Math.sqrt(
                        Math.pow(this.player.x - laser.x, 2) + 
                        Math.pow(this.player.y - laser.y, 2)
                    );
                    
                    if (distance < this.player.size + 8) {
                        if (this.effects.shield.active) {
                            this.effects.shield.active = false;
                            document.getElementById('shield-effect').classList.remove('active');
                        } else {
                            this.lives--;
                            if (this.lives <= 0) {
                                this.endGame();
                                return;
                            }
                        }
                        this.lasers.splice(i, 1);
                    }
                }
                
                // 道具碰撞
                for (let i = this.powerUps.length - 1; i >= 0; i--) {
                    const powerUp = this.powerUps[i];
                    const distance = Math.sqrt(
                        Math.pow(this.player.x - powerUp.x, 2) + 
                        Math.pow(this.player.y - powerUp.y, 2)
                    );
                    
                    if (distance < this.player.size + powerUp.size) {
                        this.collectPowerUp(powerUp);
                        this.powerUps.splice(i, 1);
                    }
                }
            }
            
            collectPowerUp(powerUp) {
                this.score += 50;
                
                const effect = this.effects[powerUp.type];
                effect.active = true;
                effect.time = 5000; // 5秒
                
                document.getElementById(powerUp.type + '-effect').classList.add('active');
                
                if (powerUp.type === 'small') {
                    this.player.size = 8;
                }
            }
            
            updateLevel() {
                const newLevel = Math.floor(this.time / 30) + 1;
                if (newLevel > this.level) {
                    this.level = newLevel;
                    this.score += 100 * this.level;
                }
            }
            
            updateDisplay() {
                const config = this.difficultyConfig[this.difficulty];
                this.score += Math.floor(this.time * config.scoreMultiplier / 10);
                
                document.getElementById('score').textContent = Math.floor(this.score);
                document.getElementById('level').textContent = this.level;
                document.getElementById('lives').textContent = this.lives;
                document.getElementById('time').textContent = this.time.toFixed(1) + 's';
            }
            
            draw() {
                // 清空画布
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // 绘制网格背景
                this.drawGrid();
                
                // 绘制玩家
                this.drawPlayer();
                
                // 绘制激光
                this.drawLasers();
                
                // 绘制道具
                this.drawPowerUps();
                
                // 绘制暂停信息
                if (this.paused) {
                    this.drawPausedText();
                }
            }
            
            drawGrid() {
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                this.ctx.lineWidth = 1;
                
                for (let x = 0; x <= this.canvas.width; x += 30) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, 0);
                    this.ctx.lineTo(x, this.canvas.height);
                    this.ctx.stroke();
                }
                
                for (let y = 0; y <= this.canvas.height; y += 30) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(0, y);
                    this.ctx.lineTo(this.canvas.width, y);
                    this.ctx.stroke();
                }
            }
            
            drawPlayer() {
                this.ctx.save();
                this.ctx.translate(this.player.x, this.player.y);
                
                // 护盾效果
                if (this.effects.shield.active) {
                    this.ctx.strokeStyle = '#4CAF50';
                    this.ctx.lineWidth = 3;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, this.player.size + 8, 0, Math.PI * 2);
                    this.ctx.stroke();
                }
                
                // 玩家主体
                this.ctx.fillStyle = this.player.color;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, this.player.size, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 玩家眼睛
                this.ctx.fillStyle = '#fff';
                this.ctx.beginPath();
                this.ctx.arc(-4, -4, 2, 0, Math.PI * 2);
                this.ctx.arc(4, -4, 2, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.restore();
            }
            
            drawLasers() {
                this.lasers.forEach(laser => {
                    this.ctx.save();
                    this.ctx.translate(laser.x, laser.y);
                    
                    const angle = Math.atan2(laser.dy, laser.dx);
                    this.ctx.rotate(angle);
                    
                    // 激光核心
                    this.ctx.fillStyle = laser.color;
                    this.ctx.fillRect(-laser.width/2, -laser.height/2, laser.width, laser.height);
                    
                    // 激光光晕
                    this.ctx.fillStyle = 'rgba(244, 67, 54, 0.3)';
                    this.ctx.fillRect(-laser.width/2, -laser.height*1.5, laser.width, laser.height*3);
                    
                    this.ctx.restore();
                });
            }
            
            drawPowerUps() {
                this.powerUps.forEach(powerUp => {
                    this.ctx.save();
                    this.ctx.translate(powerUp.x, powerUp.y);
                    this.ctx.rotate(powerUp.rotation);
                    
                    // 道具背景
                    this.ctx.fillStyle = 'rgba(255, 215, 79, 0.8)';
                    this.ctx.fillRect(-powerUp.size, -powerUp.size, powerUp.size*2, powerUp.size*2);
                    
                    // 道具图标
                    this.ctx.fillStyle = '#333';
                    this.ctx.font = '16px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    
                    const icons = {
                        shield: '🛡️',
                        speed: '⚡',
                        slow: '🐌',
                        small: '🔸'
                    };
                    
                    this.ctx.fillText(icons[powerUp.type] || '💎', 0, 0);
                    
                    this.ctx.restore();
                });
            }
            
            drawPausedText() {
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '48px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText('游戏暂停', this.canvas.width/2, this.canvas.height/2);
                
                this.ctx.font = '20px Arial';
                this.ctx.fillText('按空格键继续', this.canvas.width/2, this.canvas.height/2 + 60);
            }
            
            endGame() {
                this.gameActive = false;
                
                if (this.gameLoop) {
                    clearInterval(this.gameLoop);
                    this.gameLoop = null;
                }
                
                document.getElementById('startBtn').disabled = false;
                document.getElementById('pauseBtn').disabled = true;
                
                this.showGameOver();
            }
            
            showGameOver() {
                document.getElementById('finalScore').textContent = Math.floor(this.score);
                document.getElementById('finalLevel').textContent = this.level;
                document.getElementById('finalTime').textContent = this.time.toFixed(1) + 's';
                document.getElementById('dodgeCount').textContent = this.dodges;
                
                let title;
                if (this.time >= 120) {
                    title = '🏆 激光大师！';
                } else if (this.time >= 60) {
                    title = '⚡ 闪避高手！';
                } else if (this.time >= 30) {
                    title = '👍 不错的表现！';
                } else {
                    title = '💥 游戏结束';
                }
                
                document.getElementById('gameOverTitle').textContent = title;
                document.getElementById('gameOverPopup').classList.add('show');
            }
            
            closeGameOver() {
                document.getElementById('gameOverPopup').classList.remove('show');
            }
            
            showHelp() {
                document.getElementById('helpPopup').classList.add('show');
            }
            
            closeHelp() {
                document.getElementById('helpPopup').classList.remove('show');
            }
        }

        // 全局变量
        let laserDodge;

        // 页面加载完成后初始化
        document.addEventListener('DOMContentLoaded', () => {
            laserDodge = new LaserDodge();
            laserDodge.draw();
        });