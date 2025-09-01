/**
 * 滑雪游戏 - 扁平化设计版本
 * 特色功能：重力下滑、左右摆动避障、风阻影响、坡度动态变化
 */

class SkiingGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.gameState = 'menu'; // menu, playing, paused, finished
        this.gameStartTime = 0;
        this.gameTime = 0;
        
        // 玩家数据
        this.player = {
            x: 400,
            y: 100,
            width: 20,
            height: 40,
            speed: 0,
            maxSpeed: 120,
            velocityX: 0,
            velocityY: 0,
            angle: 0,
            isJumping: false,
            jumpHeight: 0,
            isCrouching: false,
            altitude: 1000,
            distance: 0,
            score: 0
        };
        
        // 物理系统
        this.physics = {
            gravity: 0.3,
            friction: 0.95,
            airResistance: 0.98,
            slopeAngle: 15,
            windForce: 0,
            windDirection: 0
        };
        
        // 键盘状态
        this.keys = {};
        
        // 游戏元素
        this.obstacles = [];
        this.snowParticles = [];
        this.powerUps = [];
        this.terrain = [];
        
        // 性能统计
        this.stats = {
            currentScore: 0,
            highScore: parseInt(localStorage.getItem('skiingGameHighScore')) || 0,
            maxSpeed: 0,
            perfectDodges: 0,
            totalObstacles: 0
        };
        
        // 难度设置
        this.difficulty = {
            beginner: { obstacles: 0.02, speed: 0.8, wind: 0.1 },
            intermediate: { obstacles: 0.04, speed: 1.0, wind: 0.2 },
            advanced: { obstacles: 0.06, speed: 1.2, wind: 0.3 },
            expert: { obstacles: 0.08, speed: 1.5, wind: 0.4 }
        };
        
        this.currentDifficulty = 'intermediate';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.generateTerrain();
        this.updateUI();
        this.gameLoop();
    }
    
    setupEventListeners() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'Space') {
                e.preventDefault();
                this.handleJump();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // 按钮事件
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseGame());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('backToMenuBtn').addEventListener('click', () => this.backToMenu());
        
        // 触屏控制
        document.getElementById('jumpBtn').addEventListener('click', () => this.handleJump());
        document.getElementById('leftBtn').addEventListener('touchstart', () => this.keys['ArrowLeft'] = true);
        document.getElementById('leftBtn').addEventListener('touchend', () => this.keys['ArrowLeft'] = false);
        document.getElementById('rightBtn').addEventListener('touchstart', () => this.keys['ArrowRight'] = true);
        document.getElementById('rightBtn').addEventListener('touchend', () => this.keys['ArrowRight'] = false);
        document.getElementById('crouchBtn').addEventListener('touchstart', () => this.keys['ArrowUp'] = true);
        document.getElementById('crouchBtn').addEventListener('touchend', () => this.keys['ArrowUp'] = false);
        document.getElementById('brakeBtn').addEventListener('touchstart', () => this.keys['ArrowDown'] = true);
        document.getElementById('brakeBtn').addEventListener('touchend', () => this.keys['ArrowDown'] = false);
        
        // 难度选择
        document.getElementById('slopeSelect').addEventListener('change', (e) => {
            this.currentDifficulty = e.target.value;
            this.generateTerrain();
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.gameStartTime = Date.now();
        this.resetPlayerData();
        this.generateTerrain();
        document.getElementById('startBtn').textContent = '滑雪中...';
        document.getElementById('startBtn').disabled = true;
    }
    
    pauseGame() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseBtn').textContent = '继续';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseBtn').textContent = '暂停';
        }
    }
    
    resetGame() {
        this.gameState = 'menu';
        this.resetPlayerData();
        this.generateTerrain();
        document.getElementById('startBtn').textContent = '开始滑雪';
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').textContent = '暂停';
        document.getElementById('gameModal').style.display = 'none';
        this.updateUI();
    }
    
    backToMenu() {
        this.resetGame();
    }
    
    resetPlayerData() {
        this.player = {
            x: 400,
            y: 100,
            width: 20,
            height: 40,
            speed: 0,
            maxSpeed: 120,
            velocityX: 0,
            velocityY: 0,
            angle: 0,
            isJumping: false,
            jumpHeight: 0,
            isCrouching: false,
            altitude: 1000,
            distance: 0,
            score: 0
        };
        
        this.physics = {
            gravity: 0.3,
            friction: 0.95,
            airResistance: 0.98,
            slopeAngle: 15,
            windForce: 0,
            windDirection: 0
        };
        
        this.obstacles = [];
        this.snowParticles = [];
        this.powerUps = [];
        this.stats.maxSpeed = 0;
        this.stats.perfectDodges = 0;
        this.stats.totalObstacles = 0;
    }
    
    generateTerrain() {
        this.terrain = [];
        const difficultyConfig = this.difficulty[this.currentDifficulty];
        
        for (let i = 0; i < 500; i++) {
            const segment = {
                x: i * 20,
                angle: (Math.random() - 0.5) * 30,
                elevation: Math.sin(i * 0.1) * 50,
                width: 20,
                hasObstacle: Math.random() < difficultyConfig.obstacles,
                obstacleType: this.getRandomObstacleType(),
                hasPowerUp: Math.random() < 0.01
            };
            this.terrain.push(segment);
        }
    }
    
    getRandomObstacleType() {
        const types = ['tree', 'rock', 'snowman', 'skier'];
        return types[Math.floor(Math.random() * types.length)];
    }
    
    handleJump() {
        if (this.gameState !== 'playing' || this.player.isJumping) return;
        
        this.player.isJumping = true;
        this.player.velocityY = -8;
        this.player.jumpHeight = 0;
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        this.gameTime = Date.now() - this.gameStartTime;
        
        // 处理键盘输入
        this.handleInput();
        
        // 更新物理系统
        this.updatePhysics();
        
        // 更新玩家
        this.updatePlayer();
        
        // 更新障碍物
        this.updateObstacles();
        
        // 更新雪花效果
        this.updateSnowParticles();
        
        // 更新道具
        this.updatePowerUps();
        
        // 检查碰撞
        this.checkCollisions();
        
        // 更新统计数据
        this.updateStats();
        
        // 检查游戏结束条件
        this.checkGameEnd();
        
        this.updateUI();
    }
    
    handleInput() {
        const difficultyConfig = this.difficulty[this.currentDifficulty];
        
        // 左右控制
        if (this.keys['ArrowLeft']) {
            this.player.velocityX -= 0.3;
            this.player.angle = Math.max(this.player.angle - 2, -30);
        }
        if (this.keys['ArrowRight']) {
            this.player.velocityX += 0.3;
            this.player.angle = Math.min(this.player.angle + 2, 30);
        }
        
        // 蹲下加速
        if (this.keys['ArrowUp']) {
            this.player.isCrouching = true;
            this.player.speed += 0.5 * difficultyConfig.speed;
        } else {
            this.player.isCrouching = false;
        }
        
        // 刹车减速
        if (this.keys['ArrowDown']) {
            this.player.speed *= 0.95;
        }
        
        // 自动回正角度
        if (!this.keys['ArrowLeft'] && !this.keys['ArrowRight']) {
            this.player.angle *= 0.9;
        }
    }
    
    updatePhysics() {
        // 重力加速
        this.player.speed += this.physics.gravity;
        
        // 坡度影响
        const slopeBonus = Math.sin(this.physics.slopeAngle * Math.PI / 180) * 2;
        this.player.speed += slopeBonus;
        
        // 风阻影响
        this.physics.windForce = (Math.random() - 0.5) * this.difficulty[this.currentDifficulty].wind;
        this.physics.windDirection = Math.random() * 360;
        this.player.velocityX += this.physics.windForce;
        
        // 空气阻力
        this.player.speed *= this.physics.airResistance;
        this.player.velocityX *= this.physics.friction;
        
        // 限制速度
        this.player.speed = Math.max(5, Math.min(this.player.speed, this.player.maxSpeed));
        this.player.velocityX = Math.max(-10, Math.min(this.player.velocityX, 10));
    }
    
    updatePlayer() {
        // 更新位置
        this.player.x += this.player.velocityX;
        this.player.y += this.player.velocityY;
        
        // 跳跃物理
        if (this.player.isJumping) {
            this.player.velocityY += this.physics.gravity;
            this.player.jumpHeight = Math.max(0, this.player.jumpHeight - this.player.velocityY);
            
            if (this.player.y >= 100) {
                this.player.y = 100;
                this.player.isJumping = false;
                this.player.velocityY = 0;
                this.player.jumpHeight = 0;
            }
        }
        
        // 边界检测
        this.player.x = Math.max(50, Math.min(this.player.x, this.canvas.width - 50));
        
        // 更新距离和高度
        this.player.distance += this.player.speed * 0.1;
        this.player.altitude = Math.max(0, 1000 - this.player.distance * 0.1);
        
        // 更新分数
        this.player.score += Math.floor(this.player.speed * 0.5);
        if (this.player.isCrouching) {
            this.player.score += 2; // 蹲下加分
        }
        
        // 坡度变化
        this.physics.slopeAngle = 15 + Math.sin(this.player.distance * 0.01) * 10;
    }
    
    updateObstacles() {
        // 生成新障碍物
        const difficultyConfig = this.difficulty[this.currentDifficulty];
        if (Math.random() < difficultyConfig.obstacles) {
            this.obstacles.push({
                x: this.canvas.width + Math.random() * 200,
                y: 200 + Math.random() * 200,
                width: 30 + Math.random() * 20,
                height: 30 + Math.random() * 40,
                type: this.getRandomObstacleType(),
                speed: 3 + Math.random() * 3
            });
            this.stats.totalObstacles++;
        }
        
        // 更新障碍物位置
        this.obstacles = this.obstacles.filter(obstacle => {
            obstacle.x -= obstacle.speed + this.player.speed * 0.15;
            obstacle.y += Math.sin(obstacle.x * 0.01) * 2; // 地形起伏
            return obstacle.x > -obstacle.width;
        });
    }
    
    updateSnowParticles() {
        // 生成雪花
        if (Math.random() < 0.3) {
            this.snowParticles.push({
                x: Math.random() * this.canvas.width,
                y: -10,
                size: 2 + Math.random() * 4,
                speed: 1 + Math.random() * 3,
                drift: (Math.random() - 0.5) * 2,
                opacity: 0.3 + Math.random() * 0.7
            });
        }
        
        // 更新雪花位置
        this.snowParticles = this.snowParticles.filter(particle => {
            particle.y += particle.speed;
            particle.x += particle.drift + this.physics.windForce;
            particle.opacity *= 0.995;
            return particle.y < this.canvas.height && particle.opacity > 0.1;
        });
    }
    
    updatePowerUps() {
        // 生成道具
        if (Math.random() < 0.005) {
            this.powerUps.push({
                x: this.canvas.width + Math.random() * 100,
                y: 150 + Math.random() * 200,
                width: 20,
                height: 20,
                type: Math.random() > 0.5 ? 'speed' : 'score',
                collected: false,
                pulsePhase: 0
            });
        }
        
        // 更新道具位置
        this.powerUps = this.powerUps.filter(powerUp => {
            powerUp.x -= 4 + this.player.speed * 0.1;
            powerUp.pulsePhase += 0.1;
            return powerUp.x > -powerUp.width && !powerUp.collected;
        });
    }
    
    checkCollisions() {
        // 障碍物碰撞
        this.obstacles.forEach((obstacle, index) => {
            if (this.isColliding(this.player, obstacle) && !this.player.isJumping) {
                this.handleObstacleCollision(obstacle);
                this.obstacles.splice(index, 1);
            } else if (obstacle.x < this.player.x - 50) {
                // 完美躲避
                this.stats.perfectDodges++;
                this.player.score += 10;
            }
        });
        
        // 道具收集
        this.powerUps.forEach((powerUp, index) => {
            if (this.isColliding(this.player, powerUp) && !powerUp.collected) {
                this.collectPowerUp(powerUp);
                powerUp.collected = true;
                this.powerUps.splice(index, 1);
            }
        });
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    handleObstacleCollision(obstacle) {
        // 根据障碍物类型处理碰撞
        const penalties = {
            tree: 50,
            rock: 30,
            snowman: 20,
            skier: 40
        };
        
        const penalty = penalties[obstacle.type] || 30;
        this.player.score = Math.max(0, this.player.score - penalty);
        this.player.speed *= 0.7; // 减速
        
        // 添加碰撞效果
        this.addSnowExplosion(obstacle.x, obstacle.y);
    }
    
    collectPowerUp(powerUp) {
        if (powerUp.type === 'speed') {
            this.player.speed = Math.min(this.player.maxSpeed, this.player.speed + 20);
        } else if (powerUp.type === 'score') {
            this.player.score += 100;
        }
        
        // 添加收集效果
        this.addCollectEffect(powerUp.x, powerUp.y);
    }
    
    addSnowExplosion(x, y) {
        for (let i = 0; i < 10; i++) {
            this.snowParticles.push({
                x: x + (Math.random() - 0.5) * 40,
                y: y + (Math.random() - 0.5) * 40,
                size: 3 + Math.random() * 5,
                speed: 2 + Math.random() * 4,
                drift: (Math.random() - 0.5) * 8,
                opacity: 1
            });
        }
    }
    
    addCollectEffect(x, y) {
        for (let i = 0; i < 5; i++) {
            this.snowParticles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                size: 4 + Math.random() * 3,
                speed: -2 - Math.random() * 3,
                drift: (Math.random() - 0.5) * 4,
                opacity: 1,
                color: '#FFD700'
            });
        }
    }
    
    updateStats() {
        this.stats.currentScore = this.player.score;
        this.stats.maxSpeed = Math.max(this.stats.maxSpeed, this.player.speed);
    }
    
    checkGameEnd() {
        if (this.player.altitude <= 0 || this.player.distance >= 5000) {
            this.endGame();
        }
    }
    
    endGame() {
        this.gameState = 'finished';
        
        // 更新最高分
        if (this.player.score > this.stats.highScore) {
            this.stats.highScore = this.player.score;
            localStorage.setItem('skiingGameHighScore', this.stats.highScore.toString());
        }
        
        // 显示结果
        this.showGameResult();
        
        document.getElementById('startBtn').textContent = '开始滑雪';
        document.getElementById('startBtn').disabled = false;
    }
    
    showGameResult() {
        const modal = document.getElementById('gameModal');
        const title = document.getElementById('resultTitle');
        
        // 根据表现设置标题
        if (this.player.altitude <= 0) {
            title.textContent = '🏆 成功到达山脚!';
        } else {
            title.textContent = '🎿 滑雪结束!';
        }
        
        // 更新结果数据
        document.getElementById('finalScore').textContent = this.player.score;
        document.getElementById('finalDistance').textContent = Math.floor(this.player.distance) + 'm';
        document.getElementById('finalMaxSpeed').textContent = Math.floor(this.stats.maxSpeed) + ' km/h';
        
        // 计算评级
        let rating = '⭐';
        if (this.player.score > 8000) rating = '⭐⭐⭐⭐⭐';
        else if (this.player.score > 6000) rating = '⭐⭐⭐⭐';
        else if (this.player.score > 4000) rating = '⭐⭐⭐';
        else if (this.player.score > 2000) rating = '⭐⭐';
        
        document.getElementById('finalRating').textContent = rating;
        
        modal.style.display = 'block';
    }
    
    render() {
        // 清空画布 - 雪白背景
        this.ctx.fillStyle = '#FAFAFA';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制天空渐变
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#FAFAFA');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height * 0.6);
        
        // 绘制雪道
        this.drawSlope();
        
        // 绘制雪花
        this.drawSnowParticles();
        
        // 绘制障碍物
        this.drawObstacles();
        
        // 绘制道具
        this.drawPowerUps();
        
        // 绘制玩家
        this.drawPlayer();
        
        // 绘制UI元素
        this.drawGameUI();
    }
    
    drawSlope() {
        // 绘制雪坡
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.beginPath();
        this.ctx.moveTo(0, 300);
        
        for (let x = 0; x <= this.canvas.width; x += 20) {
            const y = 300 + Math.sin((x + this.player.distance) * 0.01) * 30;
            this.ctx.lineTo(x, y);
        }
        
        this.ctx.lineTo(this.canvas.width, this.canvas.height);
        this.ctx.lineTo(0, this.canvas.height);
        this.ctx.closePath();
        this.ctx.fill();
        
        // 绘制滑雪痕迹
        this.ctx.strokeStyle = '#E0E0E0';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.player.x - 100, this.player.y + 20);
        this.ctx.lineTo(this.player.x - 200, this.player.y + 40);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }
    
    drawSnowParticles() {
        this.snowParticles.forEach(particle => {
            this.ctx.fillStyle = particle.color || `rgba(255, 255, 255, ${particle.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawObstacles() {
        this.obstacles.forEach(obstacle => {
            const emojis = {
                tree: '🌲',
                rock: '🪨',
                snowman: '⛄',
                skier: '🎿'
            };
            
            // 绘制阴影
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            this.ctx.fillRect(obstacle.x + 5, obstacle.y + obstacle.height, obstacle.width, 10);
            
            // 绘制障碍物
            this.ctx.fillStyle = '#654321';
            if (obstacle.type === 'rock') this.ctx.fillStyle = '#8B4513';
            if (obstacle.type === 'snowman') this.ctx.fillStyle = '#FFFFFF';
            
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            
            // 绘制表情符号
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                emojis[obstacle.type] || '🌲',
                obstacle.x + obstacle.width / 2,
                obstacle.y + obstacle.height / 2 + 8
            );
        });
    }
    
    drawPowerUps() {
        this.powerUps.forEach(powerUp => {
            const scale = 1 + Math.sin(powerUp.pulsePhase) * 0.2;
            const size = powerUp.width * scale;
            
            // 绘制光环效果
            this.ctx.strokeStyle = powerUp.type === 'speed' ? '#03A9F4' : '#FFD700';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(powerUp.x + powerUp.width / 2, powerUp.y + powerUp.height / 2, size, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // 绘制道具
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                powerUp.type === 'speed' ? '⚡' : '💎',
                powerUp.x + powerUp.width / 2,
                powerUp.y + powerUp.height / 2 + 7
            );
        });
    }
    
    drawPlayer() {
        this.ctx.save();
        
        // 移动到玩家位置
        this.ctx.translate(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
        
        // 应用角度旋转
        this.ctx.rotate(this.player.angle * Math.PI / 180);
        
        // 绘制滑雪板
        this.ctx.fillStyle = '#E91E63';
        this.ctx.fillRect(-this.player.width / 2, this.player.height / 2 - 5, this.player.width, 8);
        this.ctx.fillRect(-this.player.width / 2, this.player.height / 2 + 5, this.player.width, 8);
        
        // 绘制滑雪者身体
        if (this.player.isCrouching) {
            this.ctx.fillStyle = '#03A9F4';
            this.ctx.fillRect(-8, -15, 16, 25);
        } else {
            this.ctx.fillStyle = '#03A9F4';
            this.ctx.fillRect(-8, -20, 16, 30);
        }
        
        // 绘制头部
        this.ctx.fillStyle = '#FFE0B2';
        this.ctx.beginPath();
        this.ctx.arc(0, -25, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制滑雪杖
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(-15, -10);
        this.ctx.lineTo(-20, 10);
        this.ctx.moveTo(15, -10);
        this.ctx.lineTo(20, 10);
        this.ctx.stroke();
        
        // 速度线条效果
        if (this.player.speed > 40) {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(-30 - i * 10, -5 + i * 3);
                this.ctx.lineTo(-50 - i * 10, -5 + i * 3);
                this.ctx.stroke();
            }
        }
        
        this.ctx.restore();
    }
    
    drawGameUI() {
        // 绘制速度表
        this.ctx.fillStyle = '#333333';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`速度: ${Math.floor(this.player.speed)} km/h`, 10, 30);
        this.ctx.fillText(`高度: ${Math.floor(this.player.altitude)}m`, 10, 50);
        this.ctx.fillText(`距离: ${Math.floor(this.player.distance)}m`, 10, 70);
        
        // 绘制坡度指示器
        const slopeWidth = 100;
        const slopeHeight = 20;
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.fillRect(this.canvas.width - slopeWidth - 10, 20, slopeWidth, slopeHeight);
        
        this.ctx.save();
        this.ctx.translate(this.canvas.width - slopeWidth - 10, 20);
        this.ctx.rotate(this.physics.slopeAngle * Math.PI / 180);
        this.ctx.fillStyle = '#03A9F4';
        this.ctx.fillRect(0, 0, slopeWidth, slopeHeight);
        this.ctx.restore();
        
        this.ctx.fillStyle = '#333333';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            `${Math.floor(this.physics.slopeAngle)}°`,
            this.canvas.width - slopeWidth / 2 - 10,
            55
        );
    }
    
    updateUI() {
        // 更新统计显示
        document.getElementById('speed').textContent = Math.floor(this.player.speed);
        document.getElementById('altitude').textContent = Math.floor(this.player.altitude);
        document.getElementById('distance').textContent = Math.floor(this.player.distance);
        document.getElementById('score').textContent = this.player.score;
        
        // 更新风向指示器
        const windArrow = document.getElementById('windArrow');
        if (windArrow) {
            windArrow.style.transform = `rotate(${this.physics.windDirection}deg)`;
        }
        
        // 更新坡度指示器
        const slopeAngle = document.getElementById('slopeAngle');
        if (slopeAngle) {
            slopeAngle.style.transform = `rotate(${this.physics.slopeAngle}deg)`;
        }
        
        document.getElementById('angleValue').textContent = Math.floor(this.physics.slopeAngle) + '°';
        
        // 更新成绩面板
        document.getElementById('currentScore').textContent = this.player.score;
        document.getElementById('highScore').textContent = this.stats.highScore;
        document.getElementById('maxSpeed').textContent = Math.floor(this.stats.maxSpeed) + ' km/h';
        document.getElementById('perfectDodges').textContent = this.stats.perfectDodges;
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 启动游戏
window.addEventListener('load', () => {
    new SkiingGame();
});