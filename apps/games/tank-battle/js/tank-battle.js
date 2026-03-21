class TankBattle {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.miniMapCanvas = document.getElementById('miniMapCanvas');
        this.miniMapCtx = this.miniMapCanvas.getContext('2d');
        
        // 游戏配置
        this.cellSize = 35;
        this.cols = Math.floor(this.canvas.width / this.cellSize);
        this.rows = Math.floor(this.canvas.height / this.cellSize);
        
        // 游戏状态
        this.gameRunning = false;
        this.gamePaused = false;
        this.difficulty = 'normal';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.enemiesLeft = 0;
        this.totalKills = 0;
        this.highScore = parseInt(localStorage.getItem('tankBattleHighScore')) || 0;
        this.startTime = null;
        
        // 游戏对象
        this.player = null;
        this.enemies = [];
        this.playerBullets = [];
        this.enemyBullets = [];
        this.walls = [];
        this.powerUps = [];
        this.explosions = [];
        this.particles = [];
        
        // 道具效果
        this.powerUpEffects = {
            shield: { active: false, endTime: 0 },
            rapidFire: { active: false, endTime: 0 },
            extraLife: { active: false },
            bonus: { active: false }
        };
        
        // 难度配置
        this.difficultySettings = {
            easy: { enemySpeed: 1, bulletSpeed: 3, enemyCount: 8, enemyFireRate: 0.01 },
            normal: { enemySpeed: 1.5, bulletSpeed: 4, enemyCount: 10, enemyFireRate: 0.015 },
            hard: { enemySpeed: 2, bulletSpeed: 5, enemyCount: 12, enemyFireRate: 0.02 },
            insane: { enemySpeed: 2.5, bulletSpeed: 6, enemyCount: 15, enemyFireRate: 0.025 }
        };
        
        // 敌军类型
        this.enemyTypes = {
            basic: { symbol: '⚡', color: '#3498db', health: 1, speed: 1, points: 100 },
            fast: { symbol: '🔥', color: '#e74c3c', health: 1, speed: 2, points: 200 },
            heavy: { symbol: '💀', color: '#9b59b6', health: 3, speed: 0.5, points: 500 }
        };
        
        // 输入状态
        this.keys = {};
        this.lastShotTime = 0;
        this.shotCooldown = 300;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateDisplay();
        this.resetGame();
    }
    
    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            this.handleKeyPress(e);
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // 防止方向键滚动页面
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning) return;
        
        switch (e.key) {
            case ' ':
                e.preventDefault();
                this.shootBullet();
                break;
            case 'p':
            case 'P':
                this.togglePause();
                break;
        }
    }
    
    setDifficulty(difficulty) {
        if (['easy', 'normal', 'hard', 'insane'].includes(difficulty)) {
            this.difficulty = difficulty;
            
            // 更新按钮状态
            document.querySelectorAll('.difficulty-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[onclick*="${difficulty}"]`).classList.add('active');
            
            if (this.gameRunning) {
                this.resetGame();
            }
        }
    }
    
    startGame() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        this.gamePaused = false;
        this.startTime = Date.now();
        
        // 更新按钮状态
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        
        this.initializeLevel();
        this.gameLoop();
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        document.getElementById('pauseBtn').textContent = this.gamePaused ? '▶️ 继续' : '⏸️ 暂停';
        
        if (!this.gamePaused) {
            this.gameLoop();
        }
    }
    
    resetGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.totalKills = 0;
        this.startTime = null;
        
        // 清空游戏对象
        this.enemies = [];
        this.playerBullets = [];
        this.enemyBullets = [];
        this.powerUps = [];
        this.explosions = [];
        this.particles = [];
        
        // 重置道具效果
        Object.keys(this.powerUpEffects).forEach(key => {
            this.powerUpEffects[key] = { active: false, endTime: 0 };
        });
        
        // 创建地图
        this.generateMap();
        
        // 创建玩家
        this.createPlayer();
        
        // 更新显示
        this.updateDisplay();
        this.render();
        
        // 重置按钮状态
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = '⏸️ 暂停';
    }
    
    initializeLevel() {
        const settings = this.difficultySettings[this.difficulty];
        this.enemiesLeft = settings.enemyCount + (this.level - 1) * 2;
        
        // 清空敌军和子弹
        this.enemies = [];
        this.playerBullets = [];
        this.enemyBullets = [];
        this.explosions = [];
        
        // 生成敌军
        this.generateEnemies();
        
        // 生成道具
        if (Math.random() < 0.3) {
            this.generatePowerUp();
        }
        
        this.updateDisplay();
    }
    
    generateMap() {
        this.walls = [];
        
        // 边界墙
        for (let x = 0; x < this.cols; x++) {
            this.walls.push({ x, y: 0, destructible: false });
            this.walls.push({ x, y: this.rows - 1, destructible: false });
        }
        
        for (let y = 0; y < this.rows; y++) {
            this.walls.push({ x: 0, y, destructible: false });
            this.walls.push({ x: this.cols - 1, y, destructible: false });
        }
        
        // 内部障碍
        const obstacles = [
            // 中央十字
            { x: Math.floor(this.cols / 2), y: Math.floor(this.rows / 2) - 2 },
            { x: Math.floor(this.cols / 2), y: Math.floor(this.rows / 2) - 1 },
            { x: Math.floor(this.cols / 2), y: Math.floor(this.rows / 2) + 1 },
            { x: Math.floor(this.cols / 2), y: Math.floor(this.rows / 2) + 2 },
            { x: Math.floor(this.cols / 2) - 2, y: Math.floor(this.rows / 2) },
            { x: Math.floor(this.cols / 2) - 1, y: Math.floor(this.rows / 2) },
            { x: Math.floor(this.cols / 2) + 1, y: Math.floor(this.rows / 2) },
            { x: Math.floor(this.cols / 2) + 2, y: Math.floor(this.rows / 2) },
        ];
        
        obstacles.forEach(pos => {
            this.walls.push({ x: pos.x, y: pos.y, destructible: true });
        });
        
        // 随机障碍
        for (let i = 0; i < 15; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * (this.cols - 4)) + 2;
                y = Math.floor(Math.random() * (this.rows - 4)) + 2;
            } while (this.isPositionOccupied(x, y) || this.isNearPlayer(x, y));
            
            this.walls.push({ x, y, destructible: true });
        }
    }
    
    createPlayer() {
        this.player = {
            x: 2,
            y: this.rows - 3,
            direction: 0, // 0: 上, 1: 右, 2: 下, 3: 左
            health: 1,
            maxHealth: 1
        };
    }
    
    generateEnemies() {
        const spawnPoints = [
            { x: this.cols - 3, y: 2 },
            { x: this.cols - 3, y: 3 },
            { x: this.cols - 4, y: 2 },
            { x: 2, y: 2 },
            { x: 3, y: 2 },
            { x: 2, y: 3 }
        ];
        
        for (let i = 0; i < this.enemiesLeft; i++) {
            const spawnPoint = spawnPoints[i % spawnPoints.length];
            const enemyType = this.getRandomEnemyType();
            
            this.enemies.push({
                x: spawnPoint.x + (i % 2),
                y: spawnPoint.y + Math.floor(i / spawnPoints.length),
                direction: Math.floor(Math.random() * 4),
                type: enemyType,
                health: this.enemyTypes[enemyType].health,
                lastShotTime: 0,
                moveTimer: 0,
                ...this.enemyTypes[enemyType]
            });
        }
    }
    
    getRandomEnemyType() {
        const rand = Math.random();
        if (rand < 0.1) return 'heavy';
        if (rand < 0.3) return 'fast';
        return 'basic';
    }
    
    generatePowerUp() {
        if (this.powerUps.length >= 2) return;
        
        const types = ['shield', 'rapidFire', 'extraLife', 'bonus'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let x, y;
        do {
            x = Math.floor(Math.random() * (this.cols - 4)) + 2;
            y = Math.floor(Math.random() * (this.rows - 4)) + 2;
        } while (this.isPositionOccupied(x, y));
        
        this.powerUps.push({
            x, y, type,
            symbol: this.getPowerUpSymbol(type),
            spawnTime: Date.now()
        });
    }
    
    getPowerUpSymbol(type) {
        const symbols = {
            shield: '🛡️',
            rapidFire: '🔫',
            extraLife: '⭐',
            bonus: '💎'
        };
        return symbols[type] || '❓';
    }
    
    isPositionOccupied(x, y) {
        // 检查墙壁
        if (this.walls.some(wall => wall.x === x && wall.y === y)) {
            return true;
        }
        
        // 检查玩家
        if (this.player && this.player.x === x && this.player.y === y) {
            return true;
        }
        
        // 检查敌军
        if (this.enemies.some(enemy => enemy.x === x && enemy.y === y)) {
            return true;
        }
        
        return false;
    }
    
    isNearPlayer(x, y) {
        if (!this.player) return false;
        const dx = Math.abs(x - this.player.x);
        const dy = Math.abs(y - this.player.y);
        return dx <= 2 && dy <= 2;
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.update();
        this.render();
        this.renderMiniMap();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // 更新玩家
        this.updatePlayer();
        
        // 更新敌军
        this.updateEnemies();
        
        // 更新子弹
        this.updateBullets();
        
        // 更新爆炸效果
        this.updateExplosions();
        
        // 更新粒子效果
        this.updateParticles();
        
        // 更新道具效果
        this.updatePowerUpEffects();
        
        // 检查游戏状态
        this.checkGameState();
    }
    
    updatePlayer() {
        if (!this.player) return;
        
        let moved = false;
        const oldX = this.player.x;
        const oldY = this.player.y;
        
        // 处理移动
        if (this.keys['arrowup'] || this.keys['w']) {
            this.player.direction = 0;
            if (this.player.y > 0 && !this.isPositionOccupied(this.player.x, this.player.y - 1)) {
                this.player.y--;
                moved = true;
            }
        } else if (this.keys['arrowdown'] || this.keys['s']) {
            this.player.direction = 2;
            if (this.player.y < this.rows - 1 && !this.isPositionOccupied(this.player.x, this.player.y + 1)) {
                this.player.y++;
                moved = true;
            }
        } else if (this.keys['arrowleft'] || this.keys['a']) {
            this.player.direction = 3;
            if (this.player.x > 0 && !this.isPositionOccupied(this.player.x - 1, this.player.y)) {
                this.player.x--;
                moved = true;
            }
        } else if (this.keys['arrowright'] || this.keys['d']) {
            this.player.direction = 1;
            if (this.player.x < this.cols - 1 && !this.isPositionOccupied(this.player.x + 1, this.player.y)) {
                this.player.x++;
                moved = true;
            }
        }
        
        // 检查道具收集
        this.powerUps = this.powerUps.filter(powerUp => {
            if (powerUp.x === this.player.x && powerUp.y === this.player.y) {
                this.collectPowerUp(powerUp);
                return false;
            }
            return true;
        });
    }
    
    updateEnemies() {
        const settings = this.difficultySettings[this.difficulty];
        
        this.enemies.forEach(enemy => {
            enemy.moveTimer++;
            
            // AI移动
            if (enemy.moveTimer >= 60 / (enemy.speed * settings.enemySpeed)) {
                enemy.moveTimer = 0;
                this.moveEnemyAI(enemy);
            }
            
            // 敌军射击
            if (Math.random() < settings.enemyFireRate && Date.now() - enemy.lastShotTime > 1000) {
                this.enemyShoot(enemy);
                enemy.lastShotTime = Date.now();
            }
        });
    }
    
    moveEnemyAI(enemy) {
        // 简单AI：有30%概率向玩家方向移动
        let targetDirection = enemy.direction;
        
        if (Math.random() < 0.3 && this.player) {
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            
            if (Math.abs(dx) > Math.abs(dy)) {
                targetDirection = dx > 0 ? 1 : 3;
            } else {
                targetDirection = dy > 0 ? 2 : 0;
            }
        } else {
            // 随机移动
            if (Math.random() < 0.2) {
                targetDirection = Math.floor(Math.random() * 4);
            }
        }
        
        enemy.direction = targetDirection;
        
        // 尝试移动
        const directions = [
            { x: 0, y: -1 }, // 上
            { x: 1, y: 0 },  // 右
            { x: 0, y: 1 },  // 下
            { x: -1, y: 0 }  // 左
        ];
        
        const dir = directions[enemy.direction];
        const newX = enemy.x + dir.x;
        const newY = enemy.y + dir.y;
        
        if (newX >= 0 && newX < this.cols && newY >= 0 && newY < this.rows) {
            if (!this.isPositionOccupied(newX, newY)) {
                enemy.x = newX;
                enemy.y = newY;
            } else {
                // 如果无法移动，改变方向
                enemy.direction = Math.floor(Math.random() * 4);
            }
        }
    }
    
    shootBullet() {
        const now = Date.now();
        const cooldown = this.powerUpEffects.rapidFire.active ? 100 : this.shotCooldown;
        
        if (now - this.lastShotTime < cooldown) return;
        
        const directions = [
            { x: 0, y: -1 }, // 上
            { x: 1, y: 0 },  // 右
            { x: 0, y: 1 },  // 下
            { x: -1, y: 0 }  // 左
        ];
        
        const dir = directions[this.player.direction];
        
        this.playerBullets.push({
            x: this.player.x + dir.x,
            y: this.player.y + dir.y,
            dx: dir.x,
            dy: dir.y,
            speed: 0.5
        });
        
        this.lastShotTime = now;
        this.createMuzzleFlash(this.player.x, this.player.y);
    }
    
    enemyShoot(enemy) {
        const directions = [
            { x: 0, y: -1 }, // 上
            { x: 1, y: 0 },  // 右
            { x: 0, y: 1 },  // 下
            { x: -1, y: 0 }  // 左
        ];
        
        const dir = directions[enemy.direction];
        
        this.enemyBullets.push({
            x: enemy.x + dir.x,
            y: enemy.y + dir.y,
            dx: dir.x,
            dy: dir.y,
            speed: 0.3
        });
        
        this.createMuzzleFlash(enemy.x, enemy.y);
    }
    
    updateBullets() {
        // 更新玩家子弹
        this.playerBullets = this.playerBullets.filter(bullet => {
            bullet.x += bullet.dx * bullet.speed;
            bullet.y += bullet.dy * bullet.speed;
            
            const gridX = Math.floor(bullet.x);
            const gridY = Math.floor(bullet.y);
            
            // 检查边界
            if (gridX < 0 || gridX >= this.cols || gridY < 0 || gridY >= this.rows) {
                return false;
            }
            
            // 检查墙壁碰撞
            const wall = this.walls.find(w => w.x === gridX && w.y === gridY);
            if (wall) {
                if (wall.destructible) {
                    // 移除可破坏墙壁
                    this.walls = this.walls.filter(w => w !== wall);
                    this.createExplosion(gridX, gridY, 'small');
                }
                return false;
            }
            
            // 检查敌军碰撞
            const hitEnemy = this.enemies.find(enemy => enemy.x === gridX && enemy.y === gridY);
            if (hitEnemy) {
                hitEnemy.health--;
                this.createExplosion(gridX, gridY, 'medium');
                
                if (hitEnemy.health <= 0) {
                    this.addScore(hitEnemy.points);
                    this.totalKills++;
                    this.enemies = this.enemies.filter(enemy => enemy !== hitEnemy);
                    this.createExplosion(gridX, gridY, 'large');
                }
                
                return false;
            }
            
            return true;
        });
        
        // 更新敌军子弹
        this.enemyBullets = this.enemyBullets.filter(bullet => {
            bullet.x += bullet.dx * bullet.speed;
            bullet.y += bullet.dy * bullet.speed;
            
            const gridX = Math.floor(bullet.x);
            const gridY = Math.floor(bullet.y);
            
            // 检查边界
            if (gridX < 0 || gridX >= this.cols || gridY < 0 || gridY >= this.rows) {
                return false;
            }
            
            // 检查墙壁碰撞
            const wall = this.walls.find(w => w.x === gridX && w.y === gridY);
            if (wall) {
                if (wall.destructible) {
                    this.walls = this.walls.filter(w => w !== wall);
                    this.createExplosion(gridX, gridY, 'small');
                }
                return false;
            }
            
            // 检查玩家碰撞
            if (this.player && this.player.x === gridX && this.player.y === gridY) {
                if (!this.powerUpEffects.shield.active) {
                    this.playerHit();
                }
                return false;
            }
            
            return true;
        });
    }
    
    updateExplosions() {
        this.explosions = this.explosions.filter(explosion => {
            explosion.age++;
            return explosion.age < explosion.maxAge;
        });
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1;
            particle.alpha -= 0.02;
            particle.size *= 0.98;
            
            return particle.alpha > 0 && particle.size > 0.5;
        });
    }
    
    updatePowerUpEffects() {
        const now = Date.now();
        
        // 检查护盾效果
        if (this.powerUpEffects.shield.active && now > this.powerUpEffects.shield.endTime) {
            this.powerUpEffects.shield.active = false;
        }
        
        // 检查连发效果
        if (this.powerUpEffects.rapidFire.active && now > this.powerUpEffects.rapidFire.endTime) {
            this.powerUpEffects.rapidFire.active = false;
        }
    }
    
    collectPowerUp(powerUp) {
        const now = Date.now();
        
        switch (powerUp.type) {
            case 'shield':
                this.powerUpEffects.shield.active = true;
                this.powerUpEffects.shield.endTime = now + 10000;
                break;
            case 'rapidFire':
                this.powerUpEffects.rapidFire.active = true;
                this.powerUpEffects.rapidFire.endTime = now + 15000;
                break;
            case 'extraLife':
                this.lives++;
                break;
            case 'bonus':
                this.addScore(1000);
                break;
        }
        
        this.createExplosion(powerUp.x, powerUp.y, 'powerup');
    }
    
    playerHit() {
        this.lives--;
        this.createExplosion(this.player.x, this.player.y, 'large');
        
        if (this.lives <= 0) {
            this.gameOver();
        } else {
            // 短暂无敌时间
            this.powerUpEffects.shield.active = true;
            this.powerUpEffects.shield.endTime = Date.now() + 2000;
        }
    }
    
    addScore(points) {
        this.score += points;
        this.updateDisplay();
    }
    
    checkGameState() {
        if (this.enemies.length === 0) {
            this.levelComplete();
        }
    }
    
    levelComplete() {
        this.gameRunning = false;
        
        const levelScore = this.score;
        const bonusScore = this.lives * 500 + this.level * 200;
        this.addScore(bonusScore);
        
        this.showLevelCompletePopup(levelScore, bonusScore);
    }
    
    nextLevel() {
        this.level++;
        this.initializeLevel();
        this.gameRunning = true;
        this.gameLoop();
    }
    
    gameOver() {
        this.gameRunning = false;
        this.gamePaused = false;
        
        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('tankBattleHighScore', this.highScore);
        }
        
        this.showGameOverPopup();
    }
    
    createExplosion(x, y, type) {
        const explosionTypes = {
            small: { size: 15, duration: 20, color: '#ff6b35' },
            medium: { size: 25, duration: 30, color: '#ff8c42' },
            large: { size: 35, duration: 40, color: '#ffa726' },
            powerup: { size: 30, duration: 35, color: '#4fc3f7' }
        };
        
        const config = explosionTypes[type] || explosionTypes.small;
        
        this.explosions.push({
            x: x * this.cellSize + this.cellSize / 2,
            y: y * this.cellSize + this.cellSize / 2,
            size: config.size,
            maxSize: config.size,
            age: 0,
            maxAge: config.duration,
            color: config.color
        });
        
        // 创建粒子效果
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x * this.cellSize + this.cellSize / 2,
                y: y * this.cellSize + this.cellSize / 2,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: config.color,
                alpha: 1,
                size: Math.random() * 3 + 2
            });
        }
    }
    
    createMuzzleFlash(x, y) {
        this.explosions.push({
            x: x * this.cellSize + this.cellSize / 2,
            y: y * this.cellSize + this.cellSize / 2,
            size: 8,
            maxSize: 8,
            age: 0,
            maxAge: 5,
            color: '#ffff00'
        });
    }
    
    showLevelCompletePopup(levelScore, bonusScore) {
        document.getElementById('completedLevel').textContent = this.level - 1;
        document.getElementById('levelScore').textContent = levelScore.toLocaleString();
        document.getElementById('bonusScore').textContent = bonusScore.toLocaleString();
        document.getElementById('levelCompletePopup').classList.add('show');
    }
    
    closeLevelComplete() {
        document.getElementById('levelCompletePopup').classList.remove('show');
    }
    
    showGameOverPopup() {
        const isNewHighScore = this.score === this.highScore && this.score > 0;
        const survivalTime = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
        const minutes = Math.floor(survivalTime / 60);
        const seconds = survivalTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('gameOverTitle').textContent = '🎮 游戏结束';
        document.getElementById('gameOverMessage').textContent = '坦克被摧毁！';
        document.getElementById('finalScore').textContent = this.score.toLocaleString();
        document.getElementById('finalLevel').textContent = this.level;
        document.getElementById('totalKills').textContent = this.totalKills;
        document.getElementById('survivalTime').textContent = timeString;
        
        if (isNewHighScore) {
            document.getElementById('newHighScore').style.display = 'block';
        } else {
            document.getElementById('newHighScore').style.display = 'none';
        }
        
        document.getElementById('gameOverPopup').classList.add('show');
    }
    
    closeGameOver() {
        document.getElementById('gameOverPopup').classList.remove('show');
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score.toLocaleString();
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
        document.getElementById('enemiesLeft').textContent = this.enemies.length;
        document.getElementById('highScore').textContent = this.highScore.toLocaleString();
    }
    
    render() {
        // 清空画布
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格
        this.drawGrid();
        
        // 绘制墙壁
        this.drawWalls();
        
        // 绘制道具
        this.drawPowerUps();
        
        // 绘制玩家
        this.drawPlayer();
        
        // 绘制敌军
        this.drawEnemies();
        
        // 绘制子弹
        this.drawBullets();
        
        // 绘制爆炸效果
        this.drawExplosions();
        
        // 绘制粒子效果
        this.drawParticles();
        
        // 绘制特效
        this.drawEffects();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.cols; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.cellSize, 0);
            this.ctx.lineTo(x * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.rows; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.cellSize);
            this.ctx.lineTo(this.canvas.width, y * this.cellSize);
            this.ctx.stroke();
        }
    }
    
    drawWalls() {
        this.walls.forEach(wall => {
            const x = wall.x * this.cellSize;
            const y = wall.y * this.cellSize;
            
            this.ctx.fillStyle = wall.destructible ? '#95a5a6' : '#34495e';
            this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
            
            if (wall.destructible) {
                this.ctx.strokeStyle = '#7f8c8d';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
            }
        });
    }
    
    drawPowerUps() {
        this.powerUps.forEach(powerUp => {
            const x = powerUp.x * this.cellSize + this.cellSize / 2;
            const y = powerUp.y * this.cellSize + this.cellSize * 0.7;
            
            // 绘制发光背景
            const now = Date.now();
            const glow = Math.sin((now - powerUp.spawnTime) * 0.005) * 0.3 + 0.7;
            this.ctx.fillStyle = `rgba(231, 76, 60, ${glow * 0.3})`;
            this.ctx.fillRect(
                powerUp.x * this.cellSize,
                powerUp.y * this.cellSize,
                this.cellSize,
                this.cellSize
            );
            
            // 绘制道具符号
            this.ctx.font = `${this.cellSize * 0.8}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(powerUp.symbol, x, y);
        });
    }
    
    drawPlayer() {
        if (!this.player) return;
        
        const x = this.player.x * this.cellSize + this.cellSize / 2;
        const y = this.player.y * this.cellSize + this.cellSize / 2;
        
        // 护盾效果
        if (this.powerUpEffects.shield.active) {
            this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.6)';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.cellSize * 0.6, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        // 绘制坦克
        this.ctx.fillStyle = '#2ecc71';
        this.ctx.fillRect(
            this.player.x * this.cellSize + 2,
            this.player.y * this.cellSize + 2,
            this.cellSize - 4,
            this.cellSize - 4
        );
        
        // 绘制炮管方向
        this.drawTankBarrel(x, y, this.player.direction, '#27ae60');
        
        // 绘制坦克符号
        this.ctx.fillStyle = '#fff';
        this.ctx.font = `${this.cellSize * 0.6}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🚗', x, y + this.cellSize * 0.2);
    }
    
    drawEnemies() {
        this.enemies.forEach(enemy => {
            const x = enemy.x * this.cellSize + this.cellSize / 2;
            const y = enemy.y * this.cellSize + this.cellSize / 2;
            
            // 根据类型绘制坦克
            this.ctx.fillStyle = enemy.color;
            this.ctx.fillRect(
                enemy.x * this.cellSize + 2,
                enemy.y * this.cellSize + 2,
                this.cellSize - 4,
                this.cellSize - 4
            );
            
            // 绘制炮管方向
            this.drawTankBarrel(x, y, enemy.direction, enemy.color);
            
            // 绘制血条
            if (enemy.health < enemy.maxHealth) {
                const barWidth = this.cellSize - 4;
                const barHeight = 4;
                const barX = enemy.x * this.cellSize + 2;
                const barY = enemy.y * this.cellSize - 8;
                
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.fillRect(barX, barY, barWidth, barHeight);
                
                this.ctx.fillStyle = '#27ae60';
                this.ctx.fillRect(barX, barY, barWidth * (enemy.health / enemy.maxHealth), barHeight);
            }
            
            // 绘制敌军符号
            this.ctx.fillStyle = '#fff';
            this.ctx.font = `${this.cellSize * 0.5}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(enemy.symbol, x, y + this.cellSize * 0.15);
        });
    }
    
    drawTankBarrel(x, y, direction, color) {
        const barrelLength = this.cellSize * 0.4;
        const barrelWidth = 3;
        
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(direction * Math.PI / 2);
        
        this.ctx.fillStyle = color;
        this.ctx.fillRect(-barrelWidth / 2, -barrelLength, barrelWidth, barrelLength);
        
        this.ctx.restore();
    }
    
    drawBullets() {
        // 绘制玩家子弹
        this.ctx.fillStyle = '#f1c40f';
        this.playerBullets.forEach(bullet => {
            const x = bullet.x * this.cellSize + this.cellSize / 2;
            const y = bullet.y * this.cellSize + this.cellSize / 2;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // 绘制敌军子弹
        this.ctx.fillStyle = '#e74c3c';
        this.enemyBullets.forEach(bullet => {
            const x = bullet.x * this.cellSize + this.cellSize / 2;
            const y = bullet.y * this.cellSize + this.cellSize / 2;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawExplosions() {
        this.explosions.forEach(explosion => {
            const progress = explosion.age / explosion.maxAge;
            const size = explosion.maxSize * (1 - progress);
            const alpha = 1 - progress;
            
            this.ctx.save();
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = explosion.color;
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }
    
    drawEffects() {
        // 绘制连发效果
        if (this.powerUpEffects.rapidFire.active && this.player) {
            const x = this.player.x * this.cellSize + this.cellSize / 2;
            const y = this.player.y * this.cellSize + this.cellSize / 2;
            
            this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(x, y, this.cellSize * 0.7, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    renderMiniMap() {
        const scale = this.miniMapCanvas.width / this.cols;
        
        // 清空小地图
        this.miniMapCtx.fillStyle = '#2c3e50';
        this.miniMapCtx.fillRect(0, 0, this.miniMapCanvas.width, this.miniMapCanvas.height);
        
        // 绘制墙壁
        this.miniMapCtx.fillStyle = '#7f8c8d';
        this.walls.forEach(wall => {
            this.miniMapCtx.fillRect(wall.x * scale, wall.y * scale, scale, scale);
        });
        
        // 绘制玩家
        if (this.player) {
            this.miniMapCtx.fillStyle = '#2ecc71';
            this.miniMapCtx.fillRect(this.player.x * scale, this.player.y * scale, scale, scale);
        }
        
        // 绘制敌军
        this.miniMapCtx.fillStyle = '#e74c3c';
        this.enemies.forEach(enemy => {
            this.miniMapCtx.fillRect(enemy.x * scale, enemy.y * scale, scale, scale);
        });
        
        // 绘制道具
        this.miniMapCtx.fillStyle = '#f39c12';
        this.powerUps.forEach(powerUp => {
            this.miniMapCtx.fillRect(powerUp.x * scale, powerUp.y * scale, scale, scale);
        });
    }
    
    showHelp() {
        document.getElementById('helpModal').classList.add('show');
    }
    
    closeHelp() {
        document.getElementById('helpModal').classList.remove('show');
    }
}

// 全局变量供HTML onclick调用
let tankGame;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    tankGame = new TankBattle();
});