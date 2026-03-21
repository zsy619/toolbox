/**
 * 自行车赛游戏 - 扁平化设计版本
 * 特色功能：踩踏节奏控制、体力管理系统、动态难度调整
 */

class BikeRacingGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.gameState = 'menu'; // menu, playing, paused, finished
        this.gameStartTime = 0;
        this.gameTime = 0;
        
        // 玩家数据
        this.player = {
            x: 50,
            y: 200,
            width: 40,
            height: 25,
            speed: 0,
            maxSpeed: 80,
            acceleration: 1.2,
            deceleration: 0.8,
            stamina: 100,
            maxStamina: 100,
            pedalRhythm: 0,
            perfectPedals: 0,
            totalPedals: 0,
            distance: 0,
            score: 0
        };
        
        // 赛道数据
        this.track = {
            segments: [],
            currentSegment: 0,
            difficulty: 1,
            type: 'mountain'
        };
        
        // 节奏系统
        this.rhythm = {
            indicator: 0,
            target: 50,
            speed: 2,
            tolerance: 10,
            lastPedalTime: 0
        };
        
        // 键盘状态
        this.keys = {};
        
        // 游戏元素
        this.obstacles = [];
        this.particles = [];
        
        // 性能统计
        this.stats = {
            currentScore: 0,
            highScore: parseInt(localStorage.getItem('bikeRacingHighScore')) || 0,
            perfectPedals: 0,
            avgSpeed: 0,
            maxDistance: 0
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.generateTrack();
        this.updateUI();
        this.gameLoop();
    }
    
    setupEventListeners() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (e.code === 'Space') {
                e.preventDefault();
                this.handlePedal();
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
        document.getElementById('pedalBtn').addEventListener('click', () => this.handlePedal());
        document.getElementById('leftBtn').addEventListener('touchstart', () => this.keys['ArrowLeft'] = true);
        document.getElementById('leftBtn').addEventListener('touchend', () => this.keys['ArrowLeft'] = false);
        document.getElementById('rightBtn').addEventListener('touchstart', () => this.keys['ArrowRight'] = true);
        document.getElementById('rightBtn').addEventListener('touchend', () => this.keys['ArrowRight'] = false);
        document.getElementById('sprintBtn').addEventListener('touchstart', () => this.keys['ArrowUp'] = true);
        document.getElementById('sprintBtn').addEventListener('touchend', () => this.keys['ArrowUp'] = false);
        document.getElementById('brakeBtn').addEventListener('touchstart', () => this.keys['ArrowDown'] = true);
        document.getElementById('brakeBtn').addEventListener('touchend', () => this.keys['ArrowDown'] = false);
        
        // 赛道选择
        document.getElementById('trackSelect').addEventListener('change', (e) => {
            this.track.type = e.target.value;
            this.generateTrack();
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.gameStartTime = Date.now();
        this.resetPlayerData();
        this.generateTrack();
        document.getElementById('startBtn').textContent = '游戏中...';
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
        this.generateTrack();
        document.getElementById('startBtn').textContent = '开始比赛';
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
            x: 50,
            y: 200,
            width: 40,
            height: 25,
            speed: 0,
            maxSpeed: 80,
            acceleration: 1.2,
            deceleration: 0.8,
            stamina: 100,
            maxStamina: 100,
            pedalRhythm: 0,
            perfectPedals: 0,
            totalPedals: 0,
            distance: 0,
            score: 0
        };
        
        this.rhythm = {
            indicator: 0,
            target: 50,
            speed: 2,
            tolerance: 10,
            lastPedalTime: 0
        };
        
        this.obstacles = [];
        this.particles = [];
    }
    
    generateTrack() {
        this.track.segments = [];
        const trackTypes = {
            flat: { hills: 0.1, obstacles: 0.3 },
            mountain: { hills: 0.6, obstacles: 0.4 },
            city: { hills: 0.3, obstacles: 0.6 },
            extreme: { hills: 0.8, obstacles: 0.8 }
        };
        
        const config = trackTypes[this.track.type] || trackTypes.mountain;
        
        for (let i = 0; i < 1000; i++) {
            const segment = {
                height: Math.random() < config.hills ? Math.random() * 60 - 30 : 0,
                hasObstacle: Math.random() < config.obstacles,
                obstacleType: Math.random() > 0.5 ? 'rock' : 'tree',
                wind: (Math.random() - 0.5) * 2
            };
            this.track.segments.push(segment);
        }
    }
    
    handlePedal() {
        if (this.gameState !== 'playing') return;
        
        const currentTime = Date.now();
        const timeSinceLastPedal = currentTime - this.rhythm.lastPedalTime;
        
        // 节奏判定
        const rhythmAccuracy = this.calculateRhythmAccuracy();
        
        if (rhythmAccuracy > 0.8) {
            this.player.perfectPedals++;
            this.player.speed += this.player.acceleration * 1.2;
            this.player.stamina = Math.max(0, this.player.stamina - 0.5);
            this.addParticle(this.player.x, this.player.y, '#4CAF50', '完美!');
        } else if (rhythmAccuracy > 0.5) {
            this.player.speed += this.player.acceleration;
            this.player.stamina = Math.max(0, this.player.stamina - 1);
            this.addParticle(this.player.x, this.player.y, '#FFC107', '良好');
        } else {
            this.player.speed += this.player.acceleration * 0.5;
            this.player.stamina = Math.max(0, this.player.stamina - 2);
            this.addParticle(this.player.x, this.player.y, '#FF5722', '失误');
        }
        
        this.player.totalPedals++;
        this.rhythm.lastPedalTime = currentTime;
        
        // 限制最大速度
        this.player.speed = Math.min(this.player.speed, this.player.maxSpeed);
    }
    
    calculateRhythmAccuracy() {
        const indicatorPos = this.rhythm.indicator;
        const targetPos = this.rhythm.target;
        const distance = Math.abs(indicatorPos - targetPos);
        const maxDistance = 50;
        
        return Math.max(0, 1 - distance / maxDistance);
    }
    
    addParticle(x, y, color, text) {
        this.particles.push({
            x, y, color, text,
            life: 60,
            maxLife: 60,
            vx: (Math.random() - 0.5) * 2,
            vy: -2
        });
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        this.gameTime = Date.now() - this.gameStartTime;
        
        // 更新节奏指示器
        this.rhythm.indicator += this.rhythm.speed;
        if (this.rhythm.indicator >= 100 || this.rhythm.indicator <= 0) {
            this.rhythm.speed *= -1;
        }
        
        // 处理键盘输入
        this.handleInput();
        
        // 更新玩家位置和状态
        this.updatePlayer();
        
        // 更新障碍物
        this.updateObstacles();
        
        // 更新粒子效果
        this.updateParticles();
        
        // 检查碰撞
        this.checkCollisions();
        
        // 更新统计数据
        this.updateStats();
        
        // 检查游戏结束条件
        this.checkGameEnd();
        
        this.updateUI();
    }
    
    handleInput() {
        // 左右转向
        if (this.keys['ArrowLeft'] && this.player.x > 0) {
            this.player.x -= 2;
        }
        if (this.keys['ArrowRight'] && this.player.x < this.canvas.width - this.player.width) {
            this.player.x += 2;
        }
        
        // 冲刺（消耗体力）
        if (this.keys['ArrowUp'] && this.player.stamina > 0) {
            this.player.speed += 0.5;
            this.player.stamina = Math.max(0, this.player.stamina - 0.2);
        }
        
        // 刹车
        if (this.keys['ArrowDown']) {
            this.player.speed = Math.max(0, this.player.speed - this.player.deceleration * 1.5);
        }
    }
    
    updatePlayer() {
        // 自然减速
        this.player.speed = Math.max(0, this.player.speed - 0.1);
        
        // 体力恢复
        if (!this.keys['ArrowUp']) {
            this.player.stamina = Math.min(this.player.maxStamina, this.player.stamina + 0.1);
        }
        
        // 更新距离和分数
        this.player.distance += this.player.speed * 0.1;
        this.player.score += Math.floor(this.player.speed * 0.5);
        
        // 地形影响
        const currentSegment = Math.floor(this.player.distance / 10);
        if (currentSegment < this.track.segments.length) {
            const segment = this.track.segments[currentSegment];
            
            // 坡度影响
            if (segment.height > 0) {
                this.player.speed *= 0.98; // 上坡减速
                this.player.stamina = Math.max(0, this.player.stamina - 0.05);
            } else if (segment.height < 0) {
                this.player.speed *= 1.02; // 下坡加速
            }
            
            // 风阻影响
            this.player.speed += segment.wind * 0.1;
        }
        
        // 限制速度
        this.player.speed = Math.max(0, Math.min(this.player.speed, this.player.maxSpeed));
    }
    
    updateObstacles() {
        // 生成新障碍物
        if (Math.random() < 0.02) {
            this.obstacles.push({
                x: this.canvas.width,
                y: 180 + Math.random() * 40,
                width: 30,
                height: 30,
                type: Math.random() > 0.5 ? 'rock' : 'tree',
                speed: 2 + Math.random() * 2
            });
        }
        
        // 更新障碍物位置
        this.obstacles = this.obstacles.filter(obstacle => {
            obstacle.x -= obstacle.speed + this.player.speed * 0.1;
            return obstacle.x > -obstacle.width;
        });
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            return particle.life > 0;
        });
    }
    
    checkCollisions() {
        this.obstacles.forEach((obstacle, index) => {
            if (this.isColliding(this.player, obstacle)) {
                this.player.speed *= 0.5;
                this.player.stamina = Math.max(0, this.player.stamina - 10);
                this.obstacles.splice(index, 1);
                this.addParticle(obstacle.x, obstacle.y, '#FF5722', '碰撞!');
            }
        });
    }
    
    isColliding(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    updateStats() {
        this.stats.currentScore = this.player.score;
        this.stats.perfectPedals = this.player.perfectPedals;
        this.stats.avgSpeed = this.player.totalPedals > 0 ? 
            Math.floor(this.player.distance / (this.gameTime / 1000)) : 0;
        this.stats.maxDistance = Math.max(this.stats.maxDistance, this.player.distance);
    }
    
    checkGameEnd() {
        if (this.player.stamina <= 0 || this.player.distance >= 10000) {
            this.endGame();
        }
    }
    
    endGame() {
        this.gameState = 'finished';
        
        // 更新最高分
        if (this.player.score > this.stats.highScore) {
            this.stats.highScore = this.player.score;
            localStorage.setItem('bikeRacingHighScore', this.stats.highScore.toString());
        }
        
        // 显示结果
        this.showGameResult();
        
        document.getElementById('startBtn').textContent = '开始比赛';
        document.getElementById('startBtn').disabled = false;
    }
    
    showGameResult() {
        const modal = document.getElementById('gameModal');
        const title = document.getElementById('resultTitle');
        
        // 根据表现设置标题
        if (this.player.distance >= 10000) {
            title.textContent = '🏆 恭喜完成比赛!';
        } else {
            title.textContent = '😓 体力耗尽!';
        }
        
        // 更新结果数据
        document.getElementById('finalScore').textContent = this.player.score;
        document.getElementById('finalDistance').textContent = Math.floor(this.player.distance) + 'm';
        document.getElementById('finalPerfectPedals').textContent = this.player.perfectPedals;
        
        // 计算评级
        let rating = '⭐';
        if (this.player.score > 5000) rating = '⭐⭐⭐⭐⭐';
        else if (this.player.score > 3000) rating = '⭐⭐⭐⭐';
        else if (this.player.score > 1000) rating = '⭐⭐⭐';
        else if (this.player.score > 500) rating = '⭐⭐';
        
        document.getElementById('finalRating').textContent = rating;
        
        modal.style.display = 'block';
    }
    
    render() {
        // 清空画布
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制赛道背景
        this.drawTrack();
        
        // 绘制障碍物
        this.drawObstacles();
        
        // 绘制玩家
        this.drawPlayer();
        
        // 绘制粒子效果
        this.drawParticles();
        
        // 绘制UI元素
        this.drawGameUI();
    }
    
    drawTrack() {
        // 绘制赛道路面
        this.ctx.fillStyle = '#666666';
        this.ctx.fillRect(0, 300, this.canvas.width, 100);
        
        // 绘制赛道线条
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 350);
        this.ctx.lineTo(this.canvas.width, 350);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // 绘制地形变化
        const currentSegment = Math.floor(this.player.distance / 10);
        if (currentSegment < this.track.segments.length) {
            const segment = this.track.segments[currentSegment];
            if (segment.height !== 0) {
                this.ctx.fillStyle = segment.height > 0 ? '#8B4513' : '#4CAF50';
                this.ctx.fillRect(0, 300 + segment.height, this.canvas.width, Math.abs(segment.height));
            }
        }
    }
    
    drawObstacles() {
        this.obstacles.forEach(obstacle => {
            this.ctx.fillStyle = obstacle.type === 'rock' ? '#8B4513' : '#4CAF50';
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            
            // 绘制障碍物细节
            this.ctx.fillStyle = '#333333';
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                obstacle.type === 'rock' ? '🪨' : '🌳',
                obstacle.x + obstacle.width / 2,
                obstacle.y + obstacle.height / 2 + 7
            );
        });
    }
    
    drawPlayer() {
        // 绘制自行车主体
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // 绘制车轮
        this.ctx.fillStyle = '#333333';
        this.ctx.beginPath();
        this.ctx.arc(this.player.x + 8, this.player.y + this.player.height, 8, 0, Math.PI * 2);
        this.ctx.arc(this.player.x + this.player.width - 8, this.player.y + this.player.height, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制骑手
        this.ctx.fillStyle = '#FFE0B2';
        this.ctx.fillRect(this.player.x + 15, this.player.y - 15, 10, 15);
        
        // 速度指示
        if (this.player.speed > 20) {
            this.ctx.strokeStyle = '#FFFFFF';
            this.ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.player.x - 10 - i * 5, this.player.y + 5 + i * 3);
                this.ctx.lineTo(this.player.x - 20 - i * 5, this.player.y + 5 + i * 3);
                this.ctx.stroke();
            }
        }
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = alpha;
            
            if (particle.text) {
                this.ctx.font = '14px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(particle.text, particle.x, particle.y);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        this.ctx.globalAlpha = 1;
    }
    
    drawGameUI() {
        // 绘制速度表
        this.ctx.fillStyle = '#333333';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`速度: ${Math.floor(this.player.speed)} km/h`, 10, 30);
        this.ctx.fillText(`距离: ${Math.floor(this.player.distance)}m`, 10, 50);
        
        // 绘制体力条
        const staminaWidth = 100;
        const staminaHeight = 10;
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.fillRect(this.canvas.width - staminaWidth - 10, 20, staminaWidth, staminaHeight);
        this.ctx.fillStyle = '#FFC107';
        this.ctx.fillRect(
            this.canvas.width - staminaWidth - 10, 20,
            (this.player.stamina / this.player.maxStamina) * staminaWidth, staminaHeight
        );
    }
    
    updateUI() {
        // 更新统计显示
        document.getElementById('speed').textContent = Math.floor(this.player.speed);
        document.getElementById('stamina').textContent = Math.floor(this.player.stamina);
        document.getElementById('distance').textContent = Math.floor(this.player.distance);
        document.getElementById('rhythm').textContent = this.player.perfectPedals;
        
        // 更新体力条
        const staminaFill = document.getElementById('staminaFill');
        if (staminaFill) {
            staminaFill.style.width = `${(this.player.stamina / this.player.maxStamina) * 100}%`;
        }
        
        // 更新节奏指示器
        const rhythmIndicator = document.getElementById('rhythmIndicator');
        if (rhythmIndicator) {
            rhythmIndicator.style.left = `${this.rhythm.indicator}%`;
        }
        
        // 更新成绩面板
        document.getElementById('currentScore').textContent = this.player.score;
        document.getElementById('highScore').textContent = this.stats.highScore;
        document.getElementById('perfectPedals').textContent = this.player.perfectPedals;
        document.getElementById('avgSpeed').textContent = this.stats.avgSpeed + ' km/h';
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 启动游戏
window.addEventListener('load', () => {
    new BikeRacingGame();
});