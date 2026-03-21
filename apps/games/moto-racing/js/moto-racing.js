/**
 * 摩托车赛游戏 - 扁平化设计实现
 * 侧视角赛道，精确操控平衡与速度，特技加分系统
 */

class MotoRacingGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.gameState = 'menu'; // menu, playing, paused, finished
        this.gameStartTime = 0;
        this.isGameRunning = false;
        
        // 摩托车属性
        this.moto = {
            x: 100,
            y: 300,
            width: 60,
            height: 30,
            speed: 0,
            maxSpeed: 12,
            acceleration: 0.4,
            velocityY: 0,
            rotation: 0,
            balance: 100,
            isJumping: false,
            onGround: true
        };
        
        // 地形系统
        this.terrain = [];
        this.camera = { x: 0, y: 0 };
        this.generateTerrain();
        
        // 特技系统
        this.stunts = {
            backflips: 0,
            frontflips: 0,
            perfectLandings: 0,
            longJumps: 0,
            currentRotation: 0,
            isPerformingStunt: false
        };
        
        // 游戏数据
        this.gameData = {
            score: 0,
            distance: 0,
            highScore: localStorage.getItem('motoRacingHighScore') || 0,
            stuntCount: 0,
            perfectLandings: 0
        };
        
        // 控制状态
        this.keys = {};
        this.trackType = 'mountain';
        
        // 物理常量
        this.gravity = 0.8;
        this.friction = 0.95;
        this.groundFriction = 0.85;
        
        this.initializeEventListeners();
        this.initializeGame();
    }
    
    initializeEventListeners() {
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ') e.preventDefault();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // 按钮事件
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('trackSelect').addEventListener('change', (e) => {
            this.trackType = e.target.value;
            this.generateTerrain();
        });
        
        // 触屏控制
        this.initializeTouchControls();
        
        // 模态框按钮
        document.getElementById('playAgainBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('backToMenuBtn').addEventListener('click', () => this.backToMenu());
    }
    
    initializeTouchControls() {
        const touchControls = {
            accelerateBtn: 'ArrowUp',
            brakeBtn: 'ArrowDown',
            backwardBtn: 'ArrowLeft',
            forwardBtn: 'ArrowRight',
            jumpBtn: ' '
        };
        
        Object.entries(touchControls).forEach(([btnId, key]) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.keys[key] = true;
                });
                btn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.keys[key] = false;
                });
                btn.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    this.keys[key] = true;
                });
                btn.addEventListener('mouseup', (e) => {
                    e.preventDefault();
                    this.keys[key] = false;
                });
            }
        });
    }
    
    generateTerrain() {
        this.terrain = [];
        const terrainLength = 200;
        let height = 350;
        
        const trackSettings = {
            desert: { roughness: 0.5, jumpFreq: 0.1, hillHeight: 30 },
            mountain: { roughness: 1.0, jumpFreq: 0.15, hillHeight: 50 },
            city: { roughness: 0.3, jumpFreq: 0.05, hillHeight: 20 },
            extreme: { roughness: 1.5, jumpFreq: 0.2, hillHeight: 80 }
        };
        
        const settings = trackSettings[this.trackType];
        
        for (let i = 0; i < terrainLength; i++) {
            const x = i * 20;
            
            // 基础地形波动
            height += (Math.random() - 0.5) * settings.roughness * 10;
            height = Math.max(250, Math.min(380, height));
            
            // 添加跳台
            if (Math.random() < settings.jumpFreq) {
                // 创建跳台
                for (let j = 0; j < 5; j++) {
                    const rampHeight = height - (j * settings.hillHeight / 5);
                    this.terrain.push({
                        x: x + j * 20,
                        y: rampHeight,
                        type: 'ramp'
                    });
                }
                height -= settings.hillHeight;
                i += 4; // 跳过跳台占用的位置
            } else {
                this.terrain.push({
                    x: x,
                    y: height,
                    type: 'ground'
                });
            }
        }
    }
    
    initializeGame() {
        this.resetMotoPosition();
        this.gameLoop();
    }
    
    resetMotoPosition() {
        this.moto.x = 100;
        this.moto.y = 300;
        this.moto.speed = 0;
        this.moto.velocityY = 0;
        this.moto.rotation = 0;
        this.moto.balance = 100;
        this.moto.onGround = true;
        this.camera.x = 0;
    }
    
    startGame() {
        if (this.gameState === 'menu') {
            this.gameState = 'playing';
            this.isGameRunning = true;
            this.gameStartTime = Date.now();
            this.gameData.score = 0;
            this.gameData.distance = 0;
            this.resetMotoPosition();
            this.updateUI();
        }
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.isGameRunning = false;
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.isGameRunning = true;
        }
    }
    
    resetGame() {
        this.gameState = 'menu';
        this.isGameRunning = false;
        this.resetMotoPosition();
        this.gameData.score = 0;
        this.gameData.distance = 0;
        this.gameData.stuntCount = 0;
        this.stunts.backflips = 0;
        this.stunts.frontflips = 0;
        this.stunts.perfectLandings = 0;
        this.stunts.currentRotation = 0;
        this.hideModal();
        this.updateUI();
    }
    
    backToMenu() {
        this.resetGame();
    }
    
    updateMotoPhysics() {
        if (!this.isGameRunning) return;
        
        // 加速和减速
        if (this.keys['ArrowUp']) {
            this.moto.speed = Math.min(this.moto.speed + this.moto.acceleration, this.moto.maxSpeed);
        } else if (this.keys['ArrowDown']) {
            this.moto.speed = Math.max(this.moto.speed - this.moto.acceleration * 2, 0);
        } else {
            this.moto.speed *= this.moto.onGround ? this.groundFriction : this.friction;
        }
        
        // 空中姿态控制（前倾/后倾）
        if (!this.moto.onGround) {
            if (this.keys['ArrowLeft']) {
                this.moto.rotation -= 0.1; // 后倾
                this.stunts.currentRotation -= 0.1;
            }
            if (this.keys['ArrowRight']) {
                this.moto.rotation += 0.1; // 前倾
                this.stunts.currentRotation += 0.1;
            }
        }
        
        // 跳跃
        if (this.keys[' '] && this.moto.onGround) {
            this.moto.velocityY = -15;
            this.moto.onGround = false;
            this.moto.isJumping = true;
        }
        
        // 重力和垂直运动
        if (!this.moto.onGround) {
            this.moto.velocityY += this.gravity;
        }
        
        // 水平移动
        this.moto.x += this.moto.speed;
        this.moto.y += this.moto.velocityY;
        
        // 地面碰撞检测
        this.checkGroundCollision();
        
        // 平衡系统
        this.updateBalance();
        
        // 特技检测
        this.checkStunts();
        
        // 更新摄像机
        this.camera.x = this.moto.x - 200;
        
        // 更新游戏数据
        this.updateGameData();
        
        // 检查游戏结束条件
        this.checkGameOver();
    }
    
    checkGroundCollision() {
        // 查找最近的地形点
        const nearestTerrain = this.terrain.find(point => 
            Math.abs(point.x - this.moto.x) < 30
        );
        
        if (nearestTerrain && this.moto.y + this.moto.height/2 >= nearestTerrain.y) {
            if (!this.moto.onGround) {
                // 着陆检测
                this.handleLanding(nearestTerrain);
            }
            
            this.moto.y = nearestTerrain.y - this.moto.height/2;
            this.moto.velocityY = 0;
            this.moto.onGround = true;
            this.moto.isJumping = false;
            
            // 地面上的旋转恢复
            this.moto.rotation *= 0.9;
        } else if (this.moto.y > 450) {
            // 掉出地图
            this.gameOver();
        }
    }
    
    handleLanding(terrain) {
        const landingAngle = Math.abs(this.moto.rotation);
        
        if (landingAngle < 0.3) {
            // 完美着陆
            this.stunts.perfectLandings++;
            this.gameData.score += 50;
            this.showStuntMessage('完美着陆 +50');
        } else if (landingAngle > 1.5) {
            // 糟糕着陆，损失平衡
            this.moto.balance -= 20;
            this.moto.speed *= 0.5;
        }
        
        // 重置旋转计数
        this.stunts.currentRotation = 0;
    }
    
    updateBalance() {
        const rotationPenalty = Math.abs(this.moto.rotation) * 10;
        
        if (this.moto.onGround) {
            // 在地面上，平衡恢复
            this.moto.balance = Math.min(100, this.moto.balance + 1);
            this.moto.balance -= rotationPenalty;
        } else {
            // 在空中，平衡缓慢下降
            this.moto.balance -= 0.5 + rotationPenalty;
        }
        
        this.moto.balance = Math.max(0, this.moto.balance);
        
        if (this.moto.balance <= 0) {
            this.gameOver();
        }
    }
    
    checkStunts() {
        if (!this.moto.onGround && Math.abs(this.stunts.currentRotation) > Math.PI * 2) {
            if (this.stunts.currentRotation > 0) {
                // 前空翻
                this.stunts.frontflips++;
                this.gameData.score += 80;
                this.showStuntMessage('前空翻 +80');
            } else {
                // 后空翻
                this.stunts.backflips++;
                this.gameData.score += 100;
                this.showStuntMessage('后空翻 +100');
            }
            
            this.gameData.stuntCount++;
            this.stunts.currentRotation = 0;
        }
    }
    
    showStuntMessage(message) {
        // 在游戏中显示特技消息（简化实现）
        console.log(message); // 实际应用中可以创建DOM元素显示
    }
    
    updateGameData() {
        this.gameData.distance = Math.floor(this.moto.x / 10);
        
        // 距离奖励
        this.gameData.score += Math.floor(this.moto.speed / 2);
        
        // 更新最高分
        if (this.gameData.score > this.gameData.highScore) {
            this.gameData.highScore = this.gameData.score;
            localStorage.setItem('motoRacingHighScore', this.gameData.highScore);
        }
    }
    
    checkGameOver() {
        if (this.moto.balance <= 0 || this.moto.y > 450) {
            this.gameOver();
        }
    }
    
    gameOver() {
        this.gameState = 'finished';
        this.isGameRunning = false;
        this.showResultModal();
    }
    
    render() {
        // 清空画布
        this.ctx.fillStyle = '#87CEEB'; // 天空蓝
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 保存上下文用于摄像机变换
        this.ctx.save();
        this.ctx.translate(-this.camera.x, 0);
        
        // 绘制地形
        this.drawTerrain();
        
        // 绘制摩托车
        this.drawMoto();
        
        // 恢复上下文
        this.ctx.restore();
        
        // 绘制UI元素
        this.drawUI();
    }
    
    drawTerrain() {
        this.ctx.fillStyle = '#795548'; // ground-brown
        this.ctx.strokeStyle = '#212121';
        this.ctx.lineWidth = 2;
        
        // 绘制地形线
        this.ctx.beginPath();
        let isFirst = true;
        
        this.terrain.forEach(point => {
            if (point.x > this.camera.x - 100 && point.x < this.camera.x + this.canvas.width + 100) {
                if (isFirst) {
                    this.ctx.moveTo(point.x, point.y);
                    isFirst = false;
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            }
        });
        
        // 填充到底部
        this.ctx.lineTo(this.camera.x + this.canvas.width, this.canvas.height);
        this.ctx.lineTo(this.camera.x, this.canvas.height);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        
        // 绘制跳台标识
        this.terrain.forEach(point => {
            if (point.type === 'ramp' && 
                point.x > this.camera.x - 50 && 
                point.x < this.camera.x + this.canvas.width + 50) {
                this.ctx.fillStyle = '#FF9800'; // stunt-orange
                this.ctx.fillRect(point.x - 5, point.y - 10, 10, 10);
            }
        });
    }
    
    drawMoto() {
        this.ctx.save();
        this.ctx.translate(this.moto.x, this.moto.y);
        this.ctx.rotate(this.moto.rotation);
        
        // 摩托车车身（扁平化矩形）
        this.ctx.fillStyle = '#2196F3'; // moto-blue
        this.ctx.fillRect(-this.moto.width/2, -this.moto.height/2, this.moto.width, this.moto.height);
        
        // 车身边框
        this.ctx.strokeStyle = '#212121';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-this.moto.width/2, -this.moto.height/2, this.moto.width, this.moto.height);
        
        // 车轮
        this.ctx.fillStyle = '#212121';
        this.ctx.beginPath();
        this.ctx.arc(-20, 10, 8, 0, Math.PI * 2); // 后轮
        this.ctx.arc(20, 10, 8, 0, Math.PI * 2);  // 前轮
        this.ctx.fill();
        
        // 骑手
        this.ctx.fillStyle = '#FF9800'; // stunt-orange
        this.ctx.fillRect(-5, -25, 10, 15);
        
        this.ctx.restore();
        
        // 绘制速度尾迹效果
        if (this.moto.speed > 8) {
            this.ctx.fillStyle = 'rgba(33, 150, 243, 0.3)';
            for (let i = 1; i <= 3; i++) {
                this.ctx.fillRect(
                    this.moto.x - this.moto.width/2 - i * 10,
                    this.moto.y - 5,
                    8, 10
                );
            }
        }
    }
    
    drawUI() {
        // 绘制速度表
        const speed = Math.round(this.moto.speed * 10);
        this.ctx.fillStyle = '#212121';
        this.ctx.font = 'bold 16px Microsoft YaHei';
        this.ctx.fillText(`速度: ${speed} km/h`, 20, 30);
        
        // 绘制距离
        this.ctx.fillText(`距离: ${this.gameData.distance}m`, 20, 55);
        
        // 绘制分数
        this.ctx.fillText(`得分: ${this.gameData.score}`, 20, 80);
        
        // 绘制平衡条
        const balanceWidth = 100;
        const balanceHeight = 10;
        this.ctx.fillStyle = '#FAFAFA';
        this.ctx.fillRect(this.canvas.width - balanceWidth - 20, 20, balanceWidth, balanceHeight);
        this.ctx.fillStyle = this.moto.balance > 30 ? '#FFEB3B' : '#F44336';
        this.ctx.fillRect(
            this.canvas.width - balanceWidth - 20, 
            20, 
            (this.moto.balance / 100) * balanceWidth, 
            balanceHeight
        );
        this.ctx.strokeStyle = '#212121';
        this.ctx.strokeRect(this.canvas.width - balanceWidth - 20, 20, balanceWidth, balanceHeight);
        
        this.ctx.fillStyle = '#212121';
        this.ctx.font = 'bold 12px Microsoft YaHei';
        this.ctx.fillText(`平衡: ${Math.round(this.moto.balance)}%`, this.canvas.width - balanceWidth - 20, 45);
        
        // 游戏状态提示
        if (this.gameState === 'paused') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 24px Microsoft YaHei';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('游戏暂停', this.canvas.width/2, this.canvas.height/2);
            this.ctx.textAlign = 'left';
        }
    }
    
    updateUI() {
        // 更新HTML UI元素
        document.getElementById('speed').textContent = Math.round(this.moto.speed * 10);
        document.getElementById('balance').textContent = Math.round(this.moto.balance);
        document.getElementById('distance').textContent = this.gameData.distance;
        document.getElementById('stunts').textContent = this.gameData.stuntCount;
        
        document.getElementById('currentScore').textContent = this.gameData.score;
        document.getElementById('highScore').textContent = this.gameData.highScore;
        document.getElementById('stuntCount').textContent = this.gameData.stuntCount;
        document.getElementById('perfectLandings').textContent = this.stunts.perfectLandings;
        
        // 更新平衡条
        const balanceFill = document.getElementById('balanceFill');
        if (balanceFill) {
            balanceFill.style.width = `${this.moto.balance}%`;
            balanceFill.style.backgroundColor = this.moto.balance > 30 ? '#FFEB3B' : '#F44336';
        }
    }
    
    showResultModal() {
        const modal = document.getElementById('gameModal');
        
        document.getElementById('finalScore').textContent = this.gameData.score;
        document.getElementById('finalDistance').textContent = `${this.gameData.distance}m`;
        document.getElementById('finalStunts').textContent = this.gameData.stuntCount;
        
        // 计算评级
        const rating = this.calculateRating();
        document.getElementById('finalRating').textContent = rating;
        
        modal.style.display = 'block';
    }
    
    hideModal() {
        document.getElementById('gameModal').style.display = 'none';
    }
    
    calculateRating() {
        const score = this.gameData.score;
        
        if (score >= 5000) return '⭐⭐⭐⭐⭐';
        if (score >= 3000) return '⭐⭐⭐⭐';
        if (score >= 2000) return '⭐⭐⭐';
        if (score >= 1000) return '⭐⭐';
        return '⭐';
    }
    
    gameLoop() {
        this.updateMotoPhysics();
        this.render();
        this.updateUI();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new MotoRacingGame();
});