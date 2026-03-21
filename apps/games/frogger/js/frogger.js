class Frogger {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.timer = 60;
        this.highScore = parseInt(localStorage.getItem('froggerHighScore')) || 0;
        
        // 游戏设置
        this.gridSize = 40;
        this.rows = 15;
        this.cols = 20;
        this.gameSpeed = 1;
        
        // 游戏对象
        this.frog = null;
        this.cars = [];
        this.logs = [];
        this.turtles = [];
        this.homes = [];
        this.particles = [];
        this.savedFrogs = 0;
        this.targetFrogs = 5;
        
        // 动画和时间
        this.animationId = null;
        this.lastTime = 0;
        this.timerInterval = null;
        
        this.initGame();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initGame() {
        // 初始化青蛙
        this.frog = {
            x: 9,
            y: 14,
            onLog: null,
            onTurtle: null,
            moving: false,
            targetX: 9,
            targetY: 14,
            moveProgress: 0
        };
        
        // 初始化汽车
        this.initCars();
        
        // 初始化木头和乌龟
        this.initWaterObjects();
        
        // 初始化青蛙的家
        this.initHomes();
        
        // 清空其他对象
        this.particles = [];
        this.savedFrogs = 0;
        this.timer = 60;
    }
    
    initCars() {
        this.cars = [];
        
        // 定义每行的汽车配置
        const carRows = [
            { y: 13, speed: 2, direction: 1, spacing: 4, color: '#ff4444' },
            { y: 12, speed: 1.5, direction: -1, spacing: 5, color: '#44ff44' },
            { y: 11, speed: 2.5, direction: 1, spacing: 3, color: '#4444ff' },
            { y: 10, speed: 1, direction: -1, spacing: 6, color: '#ffff44' },
            { y: 9, speed: 3, direction: 1, spacing: 4, color: '#ff44ff' }
        ];
        
        carRows.forEach(row => {
            for (let i = 0; i < Math.ceil(this.cols / row.spacing) + 2; i++) {
                this.cars.push({
                    x: (row.direction > 0 ? -2 : this.cols + 1) + i * row.spacing * row.direction,
                    y: row.y,
                    width: 2,
                    height: 1,
                    speed: row.speed * row.direction * this.gameSpeed,
                    color: row.color,
                    originalSpeed: row.speed * row.direction,
                    spacing: row.spacing,
                    direction: row.direction
                });
            }
        });
    }
    
    initWaterObjects() {
        this.logs = [];
        this.turtles = [];
        
        // 木头配置
        const logRows = [
            { y: 7, speed: 1, direction: 1, spacing: 6, length: 3 },
            { y: 6, speed: 1.5, direction: -1, spacing: 5, length: 4 },
            { y: 5, speed: 0.8, direction: 1, spacing: 7, length: 3 },
            { y: 4, speed: 2, direction: -1, spacing: 4, length: 2 },
            { y: 3, speed: 1.2, direction: 1, spacing: 8, length: 5 }
        ];
        
        logRows.forEach(row => {
            for (let i = 0; i < Math.ceil(this.cols / row.spacing) + 2; i++) {
                this.logs.push({
                    x: (row.direction > 0 ? -row.length : this.cols + 1) + i * row.spacing * row.direction,
                    y: row.y,
                    width: row.length,
                    height: 1,
                    speed: row.speed * row.direction * this.gameSpeed,
                    originalSpeed: row.speed * row.direction,
                    spacing: row.spacing,
                    direction: row.direction
                });
            }
        });
        
        // 乌龟配置
        const turtleRows = [
            { y: 2, speed: 0.8, direction: -1, spacing: 4, count: 2 },
            { y: 1, speed: 1.2, direction: 1, spacing: 6, count: 3 }
        ];
        
        turtleRows.forEach(row => {
            for (let i = 0; i < Math.ceil(this.cols / row.spacing) + 2; i++) {
                for (let j = 0; j < row.count; j++) {
                    this.turtles.push({
                        x: (row.direction > 0 ? -row.count : this.cols + 1) + i * row.spacing * row.direction + j,
                        y: row.y,
                        width: 1,
                        height: 1,
                        speed: row.speed * row.direction * this.gameSpeed,
                        originalSpeed: row.speed * row.direction,
                        spacing: row.spacing,
                        direction: row.direction,
                        diving: false,
                        diveTimer: Math.random() * 5000 + 3000
                    });
                }
            }
        });
    }
    
    initHomes() {
        this.homes = [];
        const homePositions = [1, 5, 9, 13, 17];
        
        homePositions.forEach(x => {
            this.homes.push({
                x: x,
                y: 0,
                occupied: false,
                points: 50
            });
        });
    }
    
    startGame() {
        if (this.gameState === 'menu' || this.gameState === 'gameOver') {
            this.gameState = 'playing';
            this.score = 0;
            this.lives = 3;
            this.level = 1;
            this.gameSpeed = 1;
            this.initGame();
            this.updateDisplay();
            this.startTimer();
            this.gameLoop();
        }
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseBtn').textContent = '继续';
            this.stopTimer();
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseBtn').textContent = '暂停';
            this.startTimer();
            this.gameLoop();
        }
    }
    
    restartGame() {
        this.gameState = 'menu';
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.stopTimer();
        this.initGame();
        this.updateDisplay();
        this.draw();
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = '暂停';
        
        // 移除所有弹窗
        this.removeAllPopups();
    }
    
    startTimer() {
        this.stopTimer();
        this.timerInterval = setInterval(() => {
            if (this.gameState === 'playing') {
                this.timer--;
                this.updateDisplay();
                
                if (this.timer <= 0) {
                    this.loseLife();
                }
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
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
        // 更新青蛙移动动画
        this.updateFrogMovement(deltaTime);
        
        // 更新汽车
        this.updateCars();
        
        // 更新水上物体
        this.updateWaterObjects();
        
        // 更新粒子效果
        this.updateParticles(deltaTime);
        
        // 检查碰撞
        this.checkCollisions();
        
        // 检查游戏状态
        this.checkGameState();
    }
    
    updateFrogMovement(deltaTime) {
        if (this.frog.moving) {
            this.frog.moveProgress += deltaTime * 0.01;
            
            if (this.frog.moveProgress >= 1) {
                this.frog.x = this.frog.targetX;
                this.frog.y = this.frog.targetY;
                this.frog.moving = false;
                this.frog.moveProgress = 0;
                
                // 检查是否到达安全区域
                if (this.frog.y === 0) {
                    this.checkHomeReached();
                } else if (this.frog.y === 8) {
                    // 到达中间安全区域
                    this.score += 10;
                }
            }
        }
        
        // 如果青蛙在木头或乌龟上，跟随移动
        if (this.frog.onLog) {
            this.frog.x += this.frog.onLog.speed * deltaTime * 0.016;
            this.frog.targetX = this.frog.x;
        } else if (this.frog.onTurtle && !this.frog.onTurtle.diving) {
            this.frog.x += this.frog.onTurtle.speed * deltaTime * 0.016;
            this.frog.targetX = this.frog.x;
        }
        
        // 检查青蛙是否移出屏幕
        if (this.frog.x < 0 || this.frog.x >= this.cols) {
            this.loseLife();
        }
    }
    
    updateCars() {
        this.cars.forEach(car => {
            car.x += car.speed * 0.016;
            
            // 重置汽车位置
            if (car.direction > 0 && car.x > this.cols + 2) {
                car.x = -car.width;
            } else if (car.direction < 0 && car.x < -car.width) {
                car.x = this.cols + 1;
            }
        });
    }
    
    updateWaterObjects() {
        // 更新木头
        this.logs.forEach(log => {
            log.x += log.speed * 0.016;
            
            if (log.direction > 0 && log.x > this.cols + 2) {
                log.x = -log.width;
            } else if (log.direction < 0 && log.x < -log.width) {
                log.x = this.cols + 1;
            }
        });
        
        // 更新乌龟
        this.turtles.forEach(turtle => {
            turtle.x += turtle.speed * 0.016;
            
            // 乌龟潜水机制
            turtle.diveTimer -= 16;
            if (turtle.diveTimer <= 0) {
                turtle.diving = !turtle.diving;
                turtle.diveTimer = turtle.diving ? 
                    Math.random() * 2000 + 1000 : // 潜水时间
                    Math.random() * 5000 + 3000;  // 浮出时间
            }
            
            if (turtle.direction > 0 && turtle.x > this.cols + 2) {
                turtle.x = -turtle.width;
            } else if (turtle.direction < 0 && turtle.x < -turtle.width) {
                turtle.x = this.cols + 1;
            }
        });
    }
    
    updateParticles(deltaTime) {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx * deltaTime * 0.016;
            particle.y += particle.vy * deltaTime * 0.016;
            particle.life -= deltaTime;
            particle.alpha = particle.life / particle.maxLife;
            return particle.life > 0;
        });
    }
    
    checkCollisions() {
        const frogGridX = Math.floor(this.frog.x);
        const frogGridY = Math.floor(this.frog.y);
        
        // 检查与汽车碰撞
        if (frogGridY >= 9 && frogGridY <= 13) {
            this.cars.forEach(car => {
                if (this.isColliding(
                    { x: frogGridX, y: frogGridY, width: 1, height: 1 },
                    car
                )) {
                    this.loseLife();
                }
            });
        }
        
        // 检查水中状态
        if (frogGridY >= 1 && frogGridY <= 7) {
            this.frog.onLog = null;
            this.frog.onTurtle = null;
            let onSafePlatform = false;
            
            // 检查是否在木头上
            this.logs.forEach(log => {
                if (this.isColliding(
                    { x: frogGridX, y: frogGridY, width: 1, height: 1 },
                    log
                )) {
                    this.frog.onLog = log;
                    onSafePlatform = true;
                }
            });
            
            // 检查是否在乌龟上
            if (!onSafePlatform) {
                this.turtles.forEach(turtle => {
                    if (!turtle.diving && this.isColliding(
                        { x: frogGridX, y: frogGridY, width: 1, height: 1 },
                        turtle
                    )) {
                        this.frog.onTurtle = turtle;
                        onSafePlatform = true;
                    }
                });
            }
            
            // 如果不在安全平台上，就会溺水
            if (!onSafePlatform) {
                this.loseLife();
            }
        }
    }
    
    checkHomeReached() {
        const frogGridX = Math.floor(this.frog.x);
        let homeFound = false;
        
        this.homes.forEach(home => {
            if (Math.abs(home.x - frogGridX) <= 0.5 && !home.occupied) {
                home.occupied = true;
                this.savedFrogs++;
                this.score += home.points + this.timer; // 时间奖励
                homeFound = true;
                
                this.showFrogSaved();
                this.resetFrogPosition();
                
                // 更新最高分
                if (this.score > this.highScore) {
                    this.highScore = this.score;
                    localStorage.setItem('froggerHighScore', this.highScore.toString());
                }
            }
        });
        
        if (!homeFound) {
            this.loseLife(); // 青蛙跳到了错误的位置
        }
    }
    
    checkGameState() {
        // 检查是否完成关卡
        if (this.savedFrogs >= this.targetFrogs) {
            this.nextLevel();
        }
        
        // 检查游戏结束
        if (this.lives <= 0) {
            this.endGame();
        }
    }
    
    moveFrog(dx, dy) {
        if (this.gameState !== 'playing' || this.frog.moving) return;
        
        const newX = this.frog.x + dx;
        const newY = this.frog.y + dy;
        
        // 检查边界
        if (newX < 0 || newX >= this.cols || newY < 0 || newY >= this.rows) {
            return;
        }
        
        // 不能移动到已占用的家
        if (newY === 0) {
            let canMove = false;
            this.homes.forEach(home => {
                if (Math.abs(home.x - newX) <= 0.5 && !home.occupied) {
                    canMove = true;
                }
            });
            if (!canMove) return;
        }
        
        this.frog.targetX = newX;
        this.frog.targetY = newY;
        this.frog.moving = true;
        this.frog.moveProgress = 0;
        
        // 向前移动得分
        if (dy < 0) {
            this.score += 10;
        }
    }
    
    loseLife() {
        this.lives--;
        this.createExplosion(this.frog.x * this.gridSize, this.frog.y * this.gridSize);
        this.resetFrogPosition();
        
        if (this.lives <= 0) {
            this.endGame();
        }
    }
    
    resetFrogPosition() {
        this.frog.x = 9;
        this.frog.y = 14;
        this.frog.targetX = 9;
        this.frog.targetY = 14;
        this.frog.moving = false;
        this.frog.onLog = null;
        this.frog.onTurtle = null;
        this.timer = 60;
    }
    
    nextLevel() {
        this.level++;
        this.gameSpeed += 0.2;
        this.targetFrogs = Math.min(5, 3 + this.level);
        
        this.showLevelComplete();
        
        setTimeout(() => {
            this.savedFrogs = 0;
            this.initGame();
            this.updateDisplay();
            this.hideLevelComplete();
        }, 2000);
    }
    
    endGame() {
        this.gameState = 'gameOver';
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this.stopTimer();
        
        this.showGameOver();
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = '暂停';
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    createExplosion(x, y) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 200,
                vy: (Math.random() - 0.5) * 200,
                life: 1000,
                maxLife: 1000,
                alpha: 1,
                color: `hsl(${Math.random() * 60 + 15}, 100%, 50%)`
            });
        }
    }
    
    showFrogSaved() {
        const frogSavedDiv = document.createElement('div');
        frogSavedDiv.className = 'frog-saved';
        frogSavedDiv.innerHTML = `🐸 青蛙安全到家！ (+${50 + this.timer}分)`;
        document.body.appendChild(frogSavedDiv);
        
        setTimeout(() => {
            if (frogSavedDiv.parentNode) {
                frogSavedDiv.remove();
            }
        }, 1500);
    }
    
    showLevelComplete() {
        const levelCompleteDiv = document.createElement('div');
        levelCompleteDiv.className = 'level-complete';
        levelCompleteDiv.innerHTML = `
            <h2>🎉 第${this.level - 1}关完成! 🎉</h2>
            <p>所有青蛙都安全到家了！</p>
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
    
    showGameOver() {
        const gameOverDiv = document.createElement('div');
        gameOverDiv.className = 'game-over';
        gameOverDiv.innerHTML = `
            <h2>🐸 游戏结束 🐸</h2>
            <div class="game-over-stats">
                <div>🏆 最终得分: ${this.score}</div>
                <div>⭐ 最高记录: ${this.highScore}</div>
                <div>🚀 到达关卡: ${this.level}</div>
                <div>🏠 拯救青蛙: ${this.savedFrogs}</div>
            </div>
            <button onclick="frogger.restartGame()" style="margin-top: 20px;">重新开始</button>
        `;
        document.body.appendChild(gameOverDiv);
    }
    
    removeAllPopups() {
        ['game-over', 'level-complete', 'frog-saved'].forEach(className => {
            const element = document.querySelector('.' + className);
            if (element) {
                element.remove();
            }
        });
    }
    
    draw() {
        // 清空画布
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景区域
        this.drawBackground();
        
        // 绘制游戏对象
        if (this.gameState !== 'menu') {
            this.drawWaterObjects();
            this.drawCars();
            this.drawFrog();
            this.drawHomes();
            this.drawParticles();
        }
        
        // 绘制网格线（调试用）
        // this.drawGrid();
        
        // 绘制暂停屏幕
        if (this.gameState === 'paused') {
            this.drawPauseScreen();
        }
    }
    
    drawBackground() {
        const gridSize = this.gridSize;
        
        // 天空区域 (y: 0)
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, gridSize);
        
        // 水域 (y: 1-7)
        this.ctx.fillStyle = '#4169E1';
        this.ctx.fillRect(0, gridSize, this.canvas.width, 7 * gridSize);
        
        // 中间安全区域 (y: 8)
        this.ctx.fillStyle = '#32CD32';
        this.ctx.fillRect(0, 8 * gridSize, this.canvas.width, gridSize);
        
        // 马路 (y: 9-13)
        this.ctx.fillStyle = '#696969';
        this.ctx.fillRect(0, 9 * gridSize, this.canvas.width, 5 * gridSize);
        
        // 马路标线
        this.ctx.fillStyle = '#FFFF00';
        for (let y = 9; y <= 13; y++) {
            for (let x = 0; x < this.cols; x += 2) {
                this.ctx.fillRect(x * gridSize + gridSize * 0.4, y * gridSize + gridSize * 0.45, gridSize * 0.2, gridSize * 0.1);
            }
        }
        
        // 起始安全区域 (y: 14)
        this.ctx.fillStyle = '#32CD32';
        this.ctx.fillRect(0, 14 * gridSize, this.canvas.width, gridSize);
    }
    
    drawFrog() {
        const gridSize = this.gridSize;
        let drawX, drawY;
        
        if (this.frog.moving) {
            // 插值计算移动中的位置
            const progress = this.smoothstep(this.frog.moveProgress);
            drawX = (this.frog.x + (this.frog.targetX - this.frog.x) * progress) * gridSize;
            drawY = (this.frog.y + (this.frog.targetY - this.frog.y) * progress) * gridSize;
        } else {
            drawX = this.frog.x * gridSize;
            drawY = this.frog.y * gridSize;
        }
        
        // 绘制青蛙
        this.ctx.fillStyle = '#32CD32';
        this.ctx.fillRect(drawX + gridSize * 0.1, drawY + gridSize * 0.1, gridSize * 0.8, gridSize * 0.8);
        
        // 青蛙眼睛
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(drawX + gridSize * 0.2, drawY + gridSize * 0.2, gridSize * 0.2, gridSize * 0.2);
        this.ctx.fillRect(drawX + gridSize * 0.6, drawY + gridSize * 0.2, gridSize * 0.2, gridSize * 0.2);
        
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(drawX + gridSize * 0.25, drawY + gridSize * 0.25, gridSize * 0.1, gridSize * 0.1);
        this.ctx.fillRect(drawX + gridSize * 0.65, drawY + gridSize * 0.25, gridSize * 0.1, gridSize * 0.1);
    }
    
    drawCars() {
        const gridSize = this.gridSize;
        
        this.cars.forEach(car => {
            this.ctx.fillStyle = car.color;
            this.ctx.fillRect(
                car.x * gridSize + gridSize * 0.05,
                car.y * gridSize + gridSize * 0.1,
                car.width * gridSize * 0.9,
                car.height * gridSize * 0.8
            );
            
            // 车窗
            this.ctx.fillStyle = '#87CEEB';
            this.ctx.fillRect(
                car.x * gridSize + gridSize * 0.2,
                car.y * gridSize + gridSize * 0.2,
                car.width * gridSize * 0.6,
                car.height * gridSize * 0.4
            );
        });
    }
    
    drawWaterObjects() {
        const gridSize = this.gridSize;
        
        // 绘制木头
        this.logs.forEach(log => {
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(
                log.x * gridSize + gridSize * 0.05,
                log.y * gridSize + gridSize * 0.2,
                log.width * gridSize * 0.9,
                log.height * gridSize * 0.6
            );
            
            // 木头纹理
            this.ctx.fillStyle = '#A0522D';
            for (let i = 0; i < log.width; i++) {
                this.ctx.fillRect(
                    (log.x + i) * gridSize + gridSize * 0.1,
                    log.y * gridSize + gridSize * 0.3,
                    gridSize * 0.1,
                    log.height * gridSize * 0.4
                );
            }
        });
        
        // 绘制乌龟
        this.turtles.forEach(turtle => {
            if (!turtle.diving) {
                this.ctx.fillStyle = '#228B22';
                this.ctx.fillRect(
                    turtle.x * gridSize + gridSize * 0.1,
                    turtle.y * gridSize + gridSize * 0.1,
                    turtle.width * gridSize * 0.8,
                    turtle.height * gridSize * 0.8
                );
                
                // 乌龟壳纹理
                this.ctx.fillStyle = '#006400';
                this.ctx.fillRect(
                    turtle.x * gridSize + gridSize * 0.2,
                    turtle.y * gridSize + gridSize * 0.2,
                    turtle.width * gridSize * 0.6,
                    turtle.height * gridSize * 0.6
                );
            } else {
                // 潜水时显示气泡
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                this.ctx.beginPath();
                this.ctx.arc(
                    turtle.x * gridSize + gridSize * 0.5,
                    turtle.y * gridSize + gridSize * 0.5,
                    gridSize * 0.2,
                    0,
                    2 * Math.PI
                );
                this.ctx.fill();
            }
        });
    }
    
    drawHomes() {
        const gridSize = this.gridSize;
        
        this.homes.forEach(home => {
            if (home.occupied) {
                // 已有青蛙的家
                this.ctx.fillStyle = '#32CD32';
                this.ctx.fillRect(
                    home.x * gridSize + gridSize * 0.1,
                    home.y * gridSize + gridSize * 0.1,
                    gridSize * 0.8,
                    gridSize * 0.8
                );
            } else {
                // 空的家
                this.ctx.fillStyle = '#FFD700';
                this.ctx.fillRect(
                    home.x * gridSize + gridSize * 0.2,
                    home.y * gridSize + gridSize * 0.2,
                    gridSize * 0.6,
                    gridSize * 0.6
                );
                
                // 家的标记
                this.ctx.fillStyle = '#FFA500';
                this.ctx.fillRect(
                    home.x * gridSize + gridSize * 0.4,
                    home.y * gridSize + gridSize * 0.3,
                    gridSize * 0.2,
                    gridSize * 0.4
                );
            }
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
        });
        this.ctx.globalAlpha = 1;
    }
    
    drawGrid() {
        const gridSize = this.gridSize;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.cols; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * gridSize, 0);
            this.ctx.lineTo(x * gridSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.rows; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * gridSize);
            this.ctx.lineTo(this.canvas.width, y * gridSize);
            this.ctx.stroke();
        }
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
    
    smoothstep(t) {
        return t * t * (3 - 2 * t);
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
        document.getElementById('timer').textContent = this.timer;
        document.getElementById('highScore').textContent = this.highScore;
    }
    
    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (this.gameState !== 'playing') return;
            
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    this.moveFrog(0, -1);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    this.moveFrog(0, 1);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.moveFrog(-1, 0);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.moveFrog(1, 0);
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
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            const minSwipeDistance = 30;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > minSwipeDistance) {
                    if (diffX > 0) {
                        this.moveFrog(-1, 0); // 左
                    } else {
                        this.moveFrog(1, 0);  // 右
                    }
                }
            } else {
                if (Math.abs(diffY) > minSwipeDistance) {
                    if (diffY > 0) {
                        this.moveFrog(0, -1); // 上
                    } else {
                        this.moveFrog(0, 1);  // 下
                    }
                }
            }
            
            touchStartX = 0;
            touchStartY = 0;
        });
    }
}

// 全局变量
let frogger;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    frogger = new Frogger();
});