class SnakeAdvanced {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏配置
        this.cellSize = 20;
        this.cols = this.canvas.width / this.cellSize;
        this.rows = this.canvas.height / this.cellSize;
        
        // 游戏状态
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameMode = 'classic';
        this.difficulty = 'normal';
        this.score = 0;
        this.level = 1;
        this.highScore = parseInt(localStorage.getItem('snakeAdvancedHighScore')) || 0;
        this.startTime = null;
        
        // 蛇的状态
        this.snake = [];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        
        // 食物系统
        this.foods = [];
        this.foodTypes = {
            normal: { symbol: '🍎', points: 10, growth: 1, probability: 0.7 },
            golden: { symbol: '🏆', points: 50, growth: 2, probability: 0.2 },
            bonus: { symbol: '💎', points: 100, growth: 1, probability: 0.1, effect: 'speed' }
        };
        
        // 障碍物和道具系统
        this.obstacles = [];
        this.powerUps = [];
        this.activePowers = new Map();
        
        // 道具类型
        this.powerUpTypes = {
            flame: { symbol: '🔥', duration: 5000, name: '火焰模式' },
            lightning: { symbol: '⚡', duration: 10000, name: '闪电加速' },
            shield: { symbol: '🛡️', duration: 0, name: '护盾保护' },
            doubleScore: { symbol: '⭐', duration: 10000, name: '分数翻倍' }
        };
        
        // 速度配置
        this.speeds = {
            easy: 200,
            normal: 150,
            hard: 100,
            insane: 70
        };
        
        this.currentSpeed = this.speeds[this.difficulty];
        this.gameLoopId = null;
        
        // 迷宫地图
        this.mazeWalls = [];
        
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
            this.handleKeyPress(e);
        });
        
        // 防止方向键滚动页面
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
        });
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning && e.key !== ' ' && e.key.toLowerCase() !== 'r') return;
        
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (this.direction.y !== 1) {
                    this.nextDirection = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (this.direction.y !== -1) {
                    this.nextDirection = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (this.direction.x !== 1) {
                    this.nextDirection = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (this.direction.x !== -1) {
                    this.nextDirection = { x: 1, y: 0 };
                }
                break;
            case ' ':
                e.preventDefault();
                this.togglePause();
                break;
            case 'r':
            case 'R':
                this.resetGame();
                break;
        }
    }
    
    setMode(mode) {
        if (['classic', 'survival', 'maze', 'arcade'].includes(mode)) {
            this.gameMode = mode;
            
            // 更新按钮状态
            document.querySelectorAll('.mode-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[onclick*="${mode}"]`).classList.add('active');
            
            this.resetGame();
        }
    }
    
    setDifficulty(difficulty) {
        if (['easy', 'normal', 'hard', 'insane'].includes(difficulty)) {
            this.difficulty = difficulty;
            this.currentSpeed = this.speeds[difficulty];
            
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
        this.level = 1;
        this.startTime = null;
        
        // 重置蛇
        this.snake = [
            { x: Math.floor(this.cols / 2), y: Math.floor(this.rows / 2) }
        ];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        
        // 清空游戏元素
        this.foods = [];
        this.obstacles = [];
        this.powerUps = [];
        this.activePowers.clear();
        this.mazeWalls = [];
        
        // 根据模式初始化
        this.initializeMode();
        
        // 生成初始食物
        this.generateFood();
        
        // 更新显示
        this.updateDisplay();
        this.updateActivePowers();
        this.render();
        
        // 重置按钮状态
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = '⏸️ 暂停';
        
        if (this.gameLoopId) {
            clearTimeout(this.gameLoopId);
        }
    }
    
    initializeMode() {
        switch (this.gameMode) {
            case 'survival':
                this.generateObstacles(5);
                break;
            case 'maze':
                this.generateMaze();
                break;
            case 'arcade':
                this.generatePowerUp();
                break;
        }
    }
    
    generateMaze() {
        this.mazeWalls = [];
        
        // 生成简单的迷宫结构
        const centerX = Math.floor(this.cols / 2);
        const centerY = Math.floor(this.rows / 2);
        
        // 十字形障碍
        for (let i = 5; i < this.cols - 5; i++) {
            if (Math.abs(i - centerX) > 3) {
                this.mazeWalls.push({ x: i, y: centerY });
            }
        }
        
        for (let i = 5; i < this.rows - 5; i++) {
            if (Math.abs(i - centerY) > 3) {
                this.mazeWalls.push({ x: centerX, y: i });
            }
        }
        
        // 边角障碍
        for (let i = 0; i < 8; i++) {
            this.mazeWalls.push({ x: 2 + i, y: 2 });
            this.mazeWalls.push({ x: 2, y: 2 + i });
            this.mazeWalls.push({ x: this.cols - 3 - i, y: this.rows - 3 });
            this.mazeWalls.push({ x: this.cols - 3, y: this.rows - 3 - i });
        }
    }
    
    generateObstacles(count) {
        this.obstacles = [];
        
        for (let i = 0; i < count; i++) {
            let pos;
            do {
                pos = this.getRandomPosition();
            } while (this.isPositionOccupied(pos.x, pos.y));
            
            this.obstacles.push(pos);
        }
    }
    
    generateFood() {
        if (this.foods.length >= 3) return;
        
        const foodType = this.getRandomFoodType();
        let pos;
        
        do {
            pos = this.getRandomPosition();
        } while (this.isPositionOccupied(pos.x, pos.y));
        
        this.foods.push({
            x: pos.x,
            y: pos.y,
            type: foodType,
            ...this.foodTypes[foodType]
        });
    }
    
    generatePowerUp() {
        if (this.powerUps.length >= 2 || Math.random() > 0.3) return;
        
        const powerUpKeys = Object.keys(this.powerUpTypes);
        const powerUpType = powerUpKeys[Math.floor(Math.random() * powerUpKeys.length)];
        
        let pos;
        do {
            pos = this.getRandomPosition();
        } while (this.isPositionOccupied(pos.x, pos.y));
        
        this.powerUps.push({
            x: pos.x,
            y: pos.y,
            type: powerUpType,
            ...this.powerUpTypes[powerUpType]
        });
    }
    
    getRandomFoodType() {
        const rand = Math.random();
        let cumulative = 0;
        
        for (const [type, config] of Object.entries(this.foodTypes)) {
            cumulative += config.probability;
            if (rand <= cumulative) {
                return type;
            }
        }
        
        return 'normal';
    }
    
    getRandomPosition() {
        return {
            x: Math.floor(Math.random() * this.cols),
            y: Math.floor(Math.random() * this.rows)
        };
    }
    
    isPositionOccupied(x, y) {
        // 检查蛇身
        if (this.snake.some(segment => segment.x === x && segment.y === y)) {
            return true;
        }
        
        // 检查食物
        if (this.foods.some(food => food.x === x && food.y === y)) {
            return true;
        }
        
        // 检查障碍物
        if (this.obstacles.some(obstacle => obstacle.x === x && obstacle.y === y)) {
            return true;
        }
        
        // 检查迷宫墙壁
        if (this.mazeWalls.some(wall => wall.x === x && wall.y === y)) {
            return true;
        }
        
        // 检查道具
        if (this.powerUps.some(powerUp => powerUp.x === x && powerUp.y === y)) {
            return true;
        }
        
        return false;
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.update();
        this.render();
        
        // 计算当前速度（考虑加速效果）
        let speed = this.currentSpeed;
        if (this.activePowers.has('lightning')) {
            speed = Math.floor(speed * 0.5);
        }
        if (this.activePowers.has('bonus')) {
            speed = Math.floor(speed * 0.7);
        }
        
        this.gameLoopId = setTimeout(() => this.gameLoop(), speed);
    }
    
    update() {
        // 更新方向
        this.direction = { ...this.nextDirection };
        
        // 计算新的头部位置
        const head = { ...this.snake[0] };
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        // 检查边界碰撞
        if (head.x < 0 || head.x >= this.cols || head.y < 0 || head.y >= this.rows) {
            this.gameOver();
            return;
        }
        
        // 检查自身碰撞
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            if (!this.activePowers.has('shield')) {
                this.gameOver();
                return;
            } else {
                // 消耗护盾
                this.activePowers.delete('shield');
                this.updateActivePowers();
            }
        }
        
        // 检查障碍物碰撞
        if (this.obstacles.some(obstacle => obstacle.x === head.x && obstacle.y === head.y)) {
            if (!this.activePowers.has('flame')) {
                this.gameOver();
                return;
            }
        }
        
        // 检查迷宫墙壁碰撞
        if (this.mazeWalls.some(wall => wall.x === head.x && wall.y === head.y)) {
            if (!this.activePowers.has('flame')) {
                this.gameOver();
                return;
            }
        }
        
        // 移动蛇
        this.snake.unshift(head);
        
        // 检查食物碰撞
        let foodEaten = false;
        this.foods = this.foods.filter(food => {
            if (food.x === head.x && food.y === head.y) {
                this.eatFood(food);
                foodEaten = true;
                return false;
            }
            return true;
        });
        
        // 检查道具碰撞
        this.powerUps = this.powerUps.filter(powerUp => {
            if (powerUp.x === head.x && powerUp.y === head.y) {
                this.collectPowerUp(powerUp);
                return false;
            }
            return true;
        });
        
        // 如果没有吃到食物，移除尾部
        if (!foodEaten) {
            this.snake.pop();
        }
        
        // 生成新食物
        if (Math.random() < 0.1) {
            this.generateFood();
        }
        
        // 在街机模式下生成道具
        if (this.gameMode === 'arcade' && Math.random() < 0.05) {
            this.generatePowerUp();
        }
        
        // 在生存模式下偶尔添加障碍物
        if (this.gameMode === 'survival' && Math.random() < 0.02) {
            this.generateObstacles(1);
        }
        
        // 更新道具效果
        this.updatePowerEffects();
        
        // 检查升级
        this.checkLevelUp();
        
        this.updateDisplay();
    }
    
    eatFood(food) {
        let points = food.points;
        
        // 分数翻倍效果
        if (this.activePowers.has('doubleScore')) {
            points *= 2;
        }
        
        this.score += points;
        
        // 根据食物类型增长
        for (let i = 0; i < food.growth - 1; i++) {
            this.snake.push({ ...this.snake[this.snake.length - 1] });
        }
        
        // 特殊效果
        if (food.effect === 'speed') {
            this.activePowers.set('bonus', { duration: 3000, startTime: Date.now() });
        }
        
        this.updateActivePowers();
    }
    
    collectPowerUp(powerUp) {
        const now = Date.now();
        
        switch (powerUp.type) {
            case 'flame':
            case 'lightning':
            case 'doubleScore':
                this.activePowers.set(powerUp.type, {
                    duration: powerUp.duration,
                    startTime: now
                });
                break;
            case 'shield':
                this.activePowers.set('shield', { duration: 0, startTime: now });
                break;
        }
        
        this.updateActivePowers();
    }
    
    updatePowerEffects() {
        const now = Date.now();
        const toRemove = [];
        
        for (const [type, power] of this.activePowers) {
            if (power.duration > 0 && now - power.startTime >= power.duration) {
                toRemove.push(type);
            }
        }
        
        toRemove.forEach(type => this.activePowers.delete(type));
        
        if (toRemove.length > 0) {
            this.updateActivePowers();
        }
    }
    
    updateActivePowers() {
        const container = document.getElementById('activePowers');
        container.innerHTML = '';
        
        if (this.activePowers.size === 0) {
            container.innerHTML = '<div style="color: #666; text-align: center; font-size: 0.9em;">暂无活跃道具</div>';
            return;
        }
        
        for (const [type, power] of this.activePowers) {
            const powerInfo = this.powerUpTypes[type];
            const element = document.createElement('div');
            element.className = 'active-power';
            
            let timeText = '';
            if (power.duration > 0) {
                const remaining = Math.max(0, power.duration - (Date.now() - power.startTime));
                timeText = `${Math.ceil(remaining / 1000)}秒`;
            } else {
                timeText = '一次性';
            }
            
            element.innerHTML = `
                <div class="power-icon-small">${powerInfo.symbol}</div>
                <div class="power-details">
                    <div class="power-name-small">${powerInfo.name}</div>
                    <div class="power-timer">${timeText}</div>
                </div>
            `;
            
            container.appendChild(element);
        }
    }
    
    checkLevelUp() {
        const newLevel = Math.floor(this.score / 500) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            // 速度略微增加
            if (this.currentSpeed > 50) {
                this.currentSpeed = Math.max(50, this.currentSpeed - 5);
            }
        }
    }
    
    gameOver() {
        this.gameRunning = false;
        this.gamePaused = false;
        
        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeAdvancedHighScore', this.highScore);
        }
        
        // 清除游戏循环
        if (this.gameLoopId) {
            clearTimeout(this.gameLoopId);
        }
        
        this.showGameOverPopup();
    }
    
    showGameOverPopup() {
        const isNewHighScore = this.score === this.highScore && this.score > 0;
        const survivalTime = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
        const minutes = Math.floor(survivalTime / 60);
        const seconds = survivalTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('gameOverTitle').textContent = '🎮 游戏结束';
        document.getElementById('gameOverMessage').textContent = '很遗憾！蛇蛇撞到了障碍物';
        document.getElementById('finalScore').textContent = this.score.toLocaleString();
        document.getElementById('finalLength').textContent = this.snake.length;
        document.getElementById('finalLevel').textContent = this.level;
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
        document.getElementById('length').textContent = this.snake.length;
        document.getElementById('level').textContent = this.level;
        document.getElementById('highScore').textContent = this.highScore.toLocaleString();
    }
    
    render() {
        // 清空画布
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格
        this.drawGrid();
        
        // 绘制迷宫墙壁
        this.drawWalls();
        
        // 绘制障碍物
        this.drawObstacles();
        
        // 绘制食物
        this.drawFood();
        
        // 绘制道具
        this.drawPowerUps();
        
        // 绘制蛇
        this.drawSnake();
        
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
        this.ctx.fillStyle = '#666';
        this.mazeWalls.forEach(wall => {
            this.ctx.fillRect(
                wall.x * this.cellSize,
                wall.y * this.cellSize,
                this.cellSize,
                this.cellSize
            );
        });
    }
    
    drawObstacles() {
        this.ctx.fillStyle = '#8B0000';
        this.obstacles.forEach(obstacle => {
            this.ctx.fillRect(
                obstacle.x * this.cellSize,
                obstacle.y * this.cellSize,
                this.cellSize,
                this.cellSize
            );
            
            // 添加危险标记
            this.ctx.fillStyle = '#FF0000';
            this.ctx.font = `${this.cellSize * 0.6}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                '⚠️',
                obstacle.x * this.cellSize + this.cellSize / 2,
                obstacle.y * this.cellSize + this.cellSize * 0.7
            );
            this.ctx.fillStyle = '#8B0000';
        });
    }
    
    drawFood() {
        this.foods.forEach(food => {
            const x = food.x * this.cellSize + this.cellSize / 2;
            const y = food.y * this.cellSize + this.cellSize * 0.7;
            
            // 根据食物类型绘制背景
            switch (food.type) {
                case 'golden':
                    this.ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
                    break;
                case 'bonus':
                    this.ctx.fillStyle = 'rgba(138, 43, 226, 0.3)';
                    break;
                default:
                    this.ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
            }
            
            this.ctx.fillRect(
                food.x * this.cellSize,
                food.y * this.cellSize,
                this.cellSize,
                this.cellSize
            );
            
            // 绘制食物符号
            this.ctx.font = `${this.cellSize * 0.8}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(food.symbol, x, y);
        });
    }
    
    drawPowerUps() {
        this.powerUps.forEach(powerUp => {
            const x = powerUp.x * this.cellSize + this.cellSize / 2;
            const y = powerUp.y * this.cellSize + this.cellSize * 0.7;
            
            // 绘制发光背景
            this.ctx.fillStyle = 'rgba(50, 130, 184, 0.3)';
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
    
    drawSnake() {
        this.snake.forEach((segment, index) => {
            const x = segment.x * this.cellSize;
            const y = segment.y * this.cellSize;
            
            if (index === 0) {
                // 蛇头
                let headColor = '#00FF00';
                
                // 根据活跃道具改变颜色
                if (this.activePowers.has('flame')) {
                    headColor = '#FF4500';
                } else if (this.activePowers.has('lightning')) {
                    headColor = '#FFD700';
                } else if (this.activePowers.has('shield')) {
                    headColor = '#00BFFF';
                } else if (this.activePowers.has('doubleScore')) {
                    headColor = '#FF69B4';
                }
                
                this.ctx.fillStyle = headColor;
                this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
                
                // 蛇头眼睛
                this.ctx.fillStyle = '#000';
                const eyeSize = this.cellSize * 0.15;
                this.ctx.fillRect(x + this.cellSize * 0.2, y + this.cellSize * 0.2, eyeSize, eyeSize);
                this.ctx.fillRect(x + this.cellSize * 0.65, y + this.cellSize * 0.2, eyeSize, eyeSize);
            } else {
                // 蛇身
                const alpha = Math.max(0.3, 1 - (index * 0.05));
                this.ctx.globalAlpha = alpha;
                this.ctx.fillStyle = '#32CD32';
                this.ctx.fillRect(x + 1, y + 1, this.cellSize - 2, this.cellSize - 2);
                this.ctx.globalAlpha = 1;
            }
        });
    }
    
    drawEffects() {
        // 绘制火焰效果
        if (this.activePowers.has('flame')) {
            this.ctx.shadowColor = '#FF4500';
            this.ctx.shadowBlur = 10;
        }
        
        // 绘制闪电效果
        if (this.activePowers.has('lightning')) {
            this.ctx.shadowColor = '#FFD700';
            this.ctx.shadowBlur = 15;
        }
        
        // 重置阴影
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
    }
    
    showHelp() {
        document.getElementById('helpModal').classList.add('show');
    }
    
    closeHelp() {
        document.getElementById('helpModal').classList.remove('show');
    }
}

// 全局变量供HTML onclick调用
let snakeGame;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    snakeGame = new SnakeAdvanced();
});