/**
 * 滑板游戏 - 扁平化设计版本
 * 特色功能：组合键特技、平衡杆控制、物理引擎模拟
 */

class SkateboardGame {
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
            y: 300,
            width: 30,
            height: 50,
            velocityX: 0,
            velocityY: 0,
            balance: 50, // 0-100, 50为完美平衡
            speed: 0,
            maxSpeed: 100,
            angle: 0,
            isJumping: false,
            isPerformingTrick: false,
            currentTrick: '',
            trickCombo: 0,
            score: 0
        };
        
        // 物理系统
        this.physics = {
            gravity: 0.5,
            friction: 0.95,
            balanceDecay: 0.98,
            trickMomentum: 0
        };
        
        // 键盘状态
        this.keys = {};
        this.trickKeys = ['KeyA', 'KeyS', 'KeyD', 'KeyF'];
        this.currentCombo = [];
        this.comboTimer = 0;
        
        // 特技系统
        this.tricks = {
            'A+S': { name: 'Kickflip', score: 100, difficulty: 1 },
            'D+F': { name: 'Heelflip', score: 120, difficulty: 1 },
            'A+D': { name: 'Frontside 180', score: 80, difficulty: 1 },
            'S+F': { name: 'Backside 180', score: 80, difficulty: 1 },
            'A+S+D': { name: '360 Flip', score: 200, difficulty: 2 },
            'D+F+A': { name: 'Varial Flip', score: 180, difficulty: 2 },
            'Space+A+S': { name: 'Aerial Kickflip', score: 300, difficulty: 3 },
            'Space+D+F': { name: 'Aerial Heelflip', score: 320, difficulty: 3 }
        };
        
        // 游戏元素
        this.obstacles = [];
        this.ramps = [];
        this.particles = [];
        
        // 性能统计
        this.stats = {
            currentScore: 0,
            highScore: parseInt(localStorage.getItem('skateboardHighScore')) || 0,
            totalTricks: 0,
            perfectBalance: 0,
            maxCombo: 0
        };
        
        // 场地类型
        this.venues = {
            street: { obstacles: 0.02, ramps: 0.01, difficulty: 1 },
            park: { obstacles: 0.01, ramps: 0.03, difficulty: 1.2 },
            vert: { obstacles: 0.005, ramps: 0.05, difficulty: 1.5 },
            bowl: { obstacles: 0.01, ramps: 0.04, difficulty: 1.8 }
        };
        
        this.currentVenue = 'park';
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.generateLevel();
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
            
            // 特技键处理
            if (this.trickKeys.includes(e.code)) {
                this.handleTrickKey(e.code);
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
        document.getElementById('accelerateBtn').addEventListener('touchstart', () => this.keys['ArrowUp'] = true);
        document.getElementById('accelerateBtn').addEventListener('touchend', () => this.keys['ArrowUp'] = false);
        document.getElementById('brakeBtn').addEventListener('touchstart', () => this.keys['ArrowDown'] = true);
        document.getElementById('brakeBtn').addEventListener('touchend', () => this.keys['ArrowDown'] = false);
        
        // 特技按钮
        document.getElementById('trickABtn').addEventListener('click', () => this.handleTrickKey('KeyA'));
        document.getElementById('trickSBtn').addEventListener('click', () => this.handleTrickKey('KeyS'));
        document.getElementById('trickDBtn').addEventListener('click', () => this.handleTrickKey('KeyD'));
        document.getElementById('trickFBtn').addEventListener('click', () => this.handleTrickKey('KeyF'));
        
        // 场地选择
        document.getElementById('venueSelect').addEventListener('change', (e) => {
            this.currentVenue = e.target.value;
            this.generateLevel();
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.gameStartTime = Date.now();
        this.resetPlayerData();
        this.generateLevel();
        document.getElementById('startBtn').textContent = '滑板中...';
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
        this.generateLevel();
        document.getElementById('startBtn').textContent = '开始滑板';
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
            y: 300,
            width: 30,
            height: 50,
            velocityX: 0,
            velocityY: 0,
            balance: 50,
            speed: 0,
            maxSpeed: 100,
            angle: 0,
            isJumping: false,
            isPerformingTrick: false,
            currentTrick: '',
            trickCombo: 0,
            score: 0
        };
        
        this.currentCombo = [];
        this.comboTimer = 0;
        this.obstacles = [];
        this.ramps = [];
        this.particles = [];
        this.stats.totalTricks = 0;
        this.stats.perfectBalance = 0;
        this.stats.maxCombo = 0;
    }
    
    generateLevel() {
        this.obstacles = [];
        this.ramps = [];
        
        const venueConfig = this.venues[this.currentVenue];
        
        // 生成障碍物
        for (let i = 0; i < 20; i++) {
            if (Math.random() < venueConfig.obstacles) {
                this.obstacles.push({
                    x: i * 100 + Math.random() * 50,
                    y: 350 + Math.random() * 100,
                    width: 20 + Math.random() * 30,
                    height: 20 + Math.random() * 40,
                    type: Math.random() > 0.5 ? 'rail' : 'stairs'
                });
            }
        }
        
        // 生成坡道
        for (let i = 0; i < 15; i++) {
            if (Math.random() < venueConfig.ramps) {
                this.ramps.push({
                    x: i * 120 + Math.random() * 60,
                    y: 300 + Math.random() * 150,
                    width: 80 + Math.random() * 40,
                    height: 40 + Math.random() * 60,
                    angle: (Math.random() - 0.5) * 30
                });
            }
        }
    }
    
    handleJump() {
        if (this.gameState !== 'playing' || this.player.isJumping) return;
        
        this.player.isJumping = true;
        this.player.velocityY = -12;
        
        // 跳跃时增加特技可能性
        if (this.currentCombo.length > 0) {
            this.executeCombo();
        }
    }
    
    handleTrickKey(keyCode) {
        if (this.gameState !== 'playing') return;
        
        const key = keyCode.replace('Key', '');
        this.currentCombo.push(key);
        this.comboTimer = 120; // 2秒时间窗口
        
        // 立即检查是否形成有效组合
        this.checkTrickCombo();
        
        // 更新UI显示
        this.updateComboDisplay();
    }
    
    checkTrickCombo() {
        const comboString = this.currentCombo.join('+');
        
        // 检查所有可能的特技组合
        for (const [combo, trick] of Object.entries(this.tricks)) {
            if (combo === comboString || combo === 'Space+' + comboString) {
                this.executeTrick(trick);
                this.currentCombo = [];
                this.comboTimer = 0;
                return;
            }
        }
        
        // 如果组合超过4个键，重置
        if (this.currentCombo.length > 4) {
            this.currentCombo = [];
            this.comboTimer = 0;
        }
    }
    
    executeTrick(trick) {
        if (this.player.isPerformingTrick) return;
        
        this.player.isPerformingTrick = true;
        this.player.currentTrick = trick.name;
        
        // 计算得分
        let score = trick.score;
        if (this.player.isJumping) score *= 1.5; // 空中特技加成
        if (this.player.trickCombo > 0) score *= (1 + this.player.trickCombo * 0.2); // 连击加成
        
        this.player.score += Math.floor(score);
        this.player.trickCombo++;
        this.stats.totalTricks++;
        this.stats.maxCombo = Math.max(this.stats.maxCombo, this.player.trickCombo);
        
        // 特技对平衡的影响
        this.player.balance += (Math.random() - 0.5) * 20;
        this.player.balance = Math.max(0, Math.min(100, this.player.balance));
        
        // 添加特效
        this.addTrickEffect();
        
        // 特技持续时间
        setTimeout(() => {
            this.player.isPerformingTrick = false;
            this.player.currentTrick = '';
        }, 1000);
    }
    
    addTrickEffect() {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: this.player.x + Math.random() * this.player.width,
                y: this.player.y + Math.random() * this.player.height,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 60,
                maxLife: 60,
                color: '#FF5722'
            });
        }
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        this.gameTime = Date.now() - this.gameStartTime;
        
        // 更新组合计时器
        if (this.comboTimer > 0) {
            this.comboTimer--;
            if (this.comboTimer === 0) {
                this.currentCombo = [];
                this.updateComboDisplay();
            }
        }
        
        // 处理键盘输入
        this.handleInput();
        
        // 更新物理
        this.updatePhysics();
        
        // 更新玩家
        this.updatePlayer();
        
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
        // 左右控制影响平衡
        if (this.keys['ArrowLeft']) {
            this.player.balance -= 0.5;
            this.player.angle = Math.max(this.player.angle - 2, -30);
            this.player.velocityX -= 0.2;
        }
        if (this.keys['ArrowRight']) {
            this.player.balance += 0.5;
            this.player.angle = Math.min(this.player.angle + 2, 30);
            this.player.velocityX += 0.2;
        }
        
        // 加速减速
        if (this.keys['ArrowUp']) {
            this.player.speed = Math.min(this.player.speed + 1, this.player.maxSpeed);
        }
        if (this.keys['ArrowDown']) {
            this.player.speed = Math.max(this.player.speed - 2, 0);
        }
        
        // 平衡回归
        if (!this.keys['ArrowLeft'] && !this.keys['ArrowRight']) {
            this.player.balance += (50 - this.player.balance) * 0.02;
            this.player.angle *= 0.95;
        }
        
        // 限制平衡值
        this.player.balance = Math.max(0, Math.min(100, this.player.balance));
    }
    
    updatePhysics() {
        // 重力
        if (this.player.isJumping) {
            this.player.velocityY += this.physics.gravity;
        }
        
        // 摩擦力
        this.player.velocityX *= this.physics.friction;
        
        // 速度衰减
        this.player.speed *= 0.99;
    }
    
    updatePlayer() {
        // 更新位置
        this.player.x += this.player.velocityX + this.player.speed * 0.2;
        this.player.y += this.player.velocityY;
        
        // 地面检测
        if (this.player.y >= 300) {
            this.player.y = 300;
            this.player.isJumping = false;
            this.player.velocityY = 0;
            
            // 着陆时重置连击（如果失去平衡）
            if (Math.abs(this.player.balance - 50) > 30) {
                this.player.trickCombo = 0;
                this.player.score = Math.max(0, this.player.score - 50);
            }
        }
        
        // 边界检测
        this.player.x = Math.max(0, Math.min(this.player.x, this.canvas.width - this.player.width));
        
        // 平衡计分
        if (Math.abs(this.player.balance - 50) < 5) {
            this.player.score += 1;
            this.stats.perfectBalance += 0.016; // 约每秒1次
        }
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
        // 障碍物碰撞
        this.obstacles.forEach(obstacle => {
            if (this.isColliding(this.player, obstacle)) {
                this.handleObstacleCollision(obstacle);
            }
        });
        
        // 坡道碰撞
        this.ramps.forEach(ramp => {
            if (this.isColliding(this.player, ramp)) {
                this.handleRampCollision(ramp);
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
        if (obstacle.type === 'rail' && this.player.isPerformingTrick) {
            // 成功在栏杆上做特技
            this.player.score += 50;
            this.addTrickEffect();
        } else {
            // 碰撞障碍物
            this.player.balance += (Math.random() - 0.5) * 40;
            this.player.trickCombo = 0;
            this.player.score = Math.max(0, this.player.score - 30);
        }
    }
    
    handleRampCollision(ramp) {
        if (!this.player.isJumping) {
            this.player.isJumping = true;
            this.player.velocityY = -8 - Math.abs(ramp.angle) * 0.2;
            this.player.score += 10;
        }
    }
    
    updateStats() {
        this.stats.currentScore = this.player.score;
    }
    
    checkGameEnd() {
        if (this.gameTime > 120000 || Math.abs(this.player.balance - 50) > 45) {
            this.endGame();
        }
    }
    
    endGame() {
        this.gameState = 'finished';
        
        // 更新最高分
        if (this.player.score > this.stats.highScore) {
            this.stats.highScore = this.player.score;
            localStorage.setItem('skateboardHighScore', this.stats.highScore.toString());
        }
        
        // 显示结果
        this.showGameResult();
        
        document.getElementById('startBtn').textContent = '开始滑板';
        document.getElementById('startBtn').disabled = false;
    }
    
    showGameResult() {
        const modal = document.getElementById('gameModal');
        const title = document.getElementById('resultTitle');
        
        title.textContent = this.gameTime > 120000 ? '🏆 时间结束!' : '😵 失去平衡!';
        
        // 更新结果数据
        document.getElementById('finalScore').textContent = this.player.score;
        document.getElementById('finalTricks').textContent = this.stats.totalTricks;
        document.getElementById('finalCombo').textContent = this.stats.maxCombo;
        
        // 计算评级
        let rating = '⭐';
        if (this.player.score > 5000) rating = '⭐⭐⭐⭐⭐';
        else if (this.player.score > 3000) rating = '⭐⭐⭐⭐';
        else if (this.player.score > 1500) rating = '⭐⭐⭐';
        else if (this.player.score > 500) rating = '⭐⭐';
        
        document.getElementById('finalRating').textContent = rating;
        
        modal.style.display = 'block';
    }
    
    updateComboDisplay() {
        const comboElement = document.getElementById('comboSequence');
        comboElement.textContent = this.currentCombo.length > 0 ? 
            this.currentCombo.join(' + ') : '准备特技组合...';
        
        // 更新计时器显示
        const timerElement = document.getElementById('comboTimer');
        const percentage = (this.comboTimer / 120) * 100;
        timerElement.style.setProperty('--width', percentage + '%');
    }
    
    render() {
        // 清空画布
        this.ctx.fillStyle = '#FAFAFA';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制场地背景
        this.drawVenue();
        
        // 绘制坡道
        this.drawRamps();
        
        // 绘制障碍物
        this.drawObstacles();
        
        // 绘制玩家
        this.drawPlayer();
        
        // 绘制粒子效果
        this.drawParticles();
        
        // 绘制UI元素
        this.drawGameUI();
    }
    
    drawVenue() {
        // 绘制地面
        this.ctx.fillStyle = '#9E9E9E';
        this.ctx.fillRect(0, 400, this.canvas.width, this.canvas.height - 400);
        
        // 绘制场地纹理
        this.ctx.strokeStyle = '#757575';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < this.canvas.width; i += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 400);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }
    }
    
    drawRamps() {
        this.ramps.forEach(ramp => {
            this.ctx.fillStyle = '#607D8B';
            this.ctx.save();
            this.ctx.translate(ramp.x + ramp.width / 2, ramp.y + ramp.height / 2);
            this.ctx.rotate(ramp.angle * Math.PI / 180);
            this.ctx.fillRect(-ramp.width / 2, -ramp.height / 2, ramp.width, ramp.height);
            this.ctx.restore();
        });
    }
    
    drawObstacles() {
        this.obstacles.forEach(obstacle => {
            this.ctx.fillStyle = obstacle.type === 'rail' ? '#424242' : '#795548';
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            
            // 绘制障碍物标识
            this.ctx.font = '16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                obstacle.type === 'rail' ? '🛤️' : '🪜',
                obstacle.x + obstacle.width / 2,
                obstacle.y + obstacle.height / 2 + 5
            );
        });
    }
    
    drawPlayer() {
        this.ctx.save();
        
        // 移动到玩家位置
        this.ctx.translate(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
        
        // 应用角度
        this.ctx.rotate(this.player.angle * Math.PI / 180);
        
        // 绘制滑板
        this.ctx.fillStyle = '#FF5722';
        this.ctx.fillRect(-this.player.width / 2, this.player.height / 2 - 5, this.player.width, 8);
        
        // 绘制玩家身体
        this.ctx.fillStyle = '#2196F3';
        this.ctx.fillRect(-8, -this.player.height / 2, 16, this.player.height - 10);
        
        // 绘制头部
        this.ctx.fillStyle = '#FFE0B2';
        this.ctx.beginPath();
        this.ctx.arc(0, -this.player.height / 2 - 8, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制特技状态
        if (this.player.isPerformingTrick) {
            this.ctx.fillStyle = '#9C27B0';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(this.player.currentTrick, 0, -30);
        }
        
        this.ctx.restore();
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawGameUI() {
        // 绘制速度和分数
        this.ctx.fillStyle = '#333333';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`速度: ${Math.floor(this.player.speed)} km/h`, 10, 30);
        this.ctx.fillText(`分数: ${this.player.score}`, 10, 50);
        this.ctx.fillText(`连击: ${this.player.trickCombo}`, 10, 70);
        
        // 绘制平衡指示器
        const balanceX = this.canvas.width - 150;
        const balanceY = 20;
        const balanceWidth = 100;
        const balanceHeight = 10;
        
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.fillRect(balanceX, balanceY, balanceWidth, balanceHeight);
        
        const balancePos = (this.player.balance / 100) * balanceWidth;
        this.ctx.fillStyle = '#2196F3';
        this.ctx.fillRect(balanceX + balancePos - 2, balanceY - 2, 4, balanceHeight + 4);
        
        // 平衡状态文字
        this.ctx.fillStyle = '#333333';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('平衡', balanceX + balanceWidth / 2, balanceY + 25);
    }
    
    updateUI() {
        // 更新统计显示
        document.getElementById('speed').textContent = Math.floor(this.player.speed);
        document.getElementById('balance').textContent = Math.floor(this.player.balance);
        document.getElementById('tricks').textContent = this.stats.totalTricks;
        document.getElementById('score').textContent = this.player.score;
        
        // 更新平衡条
        const balanceFill = document.getElementById('balanceFill');
        const balanceIndicator = document.getElementById('balanceIndicator');
        if (balanceFill && balanceIndicator) {
            balanceFill.style.width = `${this.player.balance}%`;
            balanceIndicator.style.left = `${this.player.balance}%`;
        }
        
        // 更新成绩面板
        document.getElementById('currentScore').textContent = this.player.score;
        document.getElementById('highScore').textContent = this.stats.highScore;
        document.getElementById('totalTricks').textContent = this.stats.totalTricks;
        document.getElementById('perfectBalance').textContent = Math.floor(this.stats.perfectBalance) + 's';
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 启动游戏
window.addEventListener('load', () => {
    new SkateboardGame();
});