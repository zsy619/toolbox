class PinballGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.gameActive = false;
        this.paused = false;
        this.score = 0;
        this.ballsLeft = 3;
        this.multiplier = 1;
        this.combo = 0;
        this.highScore = parseInt(localStorage.getItem('pinballHighScore')) || 0;
        
        // 物理参数
        this.gravity = 0.3;
        this.friction = 0.99;
        this.bounceFactor = 0.8;
        
        // 游戏对象
        this.ball = null;
        this.flippers = [];
        this.targets = [];
        this.bumpers = [];
        this.walls = [];
        this.particles = [];
        
        // 输入状态
        this.keys = {};
        this.leftFlipperActive = false;
        this.rightFlipperActive = false;
        
        // 发射系统
        this.launchPower = 0;
        this.charging = false;
        this.chargeDirection = 1;
        
        // 统计数据
        this.totalHits = 0;
        this.maxCombo = 0;
        
        this.init();
    }
    
    init() {
        this.setupGame();
        this.bindEvents();
        this.updateDisplay();
        this.gameLoop();
    }
    
    setupGame() {
        // 创建挡板
        this.flippers = [
            {
                x: 120, y: 550, width: 60, height: 8,
                angle: 0, targetAngle: 0, isLeft: true,
                pivotX: 130, pivotY: 550
            },
            {
                x: 220, y: 550, width: 60, height: 8,
                angle: 0, targetAngle: 0, isLeft: false,
                pivotX: 270, pivotY: 550
            }
        ];
        
        // 创建墙壁
        this.walls = [
            // 外墙
            { x1: 10, y1: 10, x2: 390, y2: 10 }, // 顶部
            { x1: 10, y1: 10, x2: 10, y2: 590 }, // 左墙
            { x1: 390, y1: 10, x2: 390, y2: 590 }, // 右墙
            
            // 内部结构
            { x1: 10, y1: 590, x2: 120, y2: 590 }, // 左下角
            { x1: 280, y1: 590, x2: 390, y2: 590 }, // 右下角
            
            // 发射通道
            { x1: 350, y1: 500, x2: 380, y2: 500 },
            { x1: 350, y1: 500, x2: 350, y2: 580 }
        ];
        
        // 创建靶标
        this.targets = [
            { x: 100, y: 200, radius: 20, color: '#ff4444', points: 1000, hit: false },
            { x: 200, y: 150, radius: 20, color: '#4488ff', points: 500, hit: false },
            { x: 300, y: 200, radius: 20, color: '#ffaa00', points: 300, hit: false },
            { x: 150, y: 300, radius: 20, color: '#00ff88', points: 200, hit: false },
            { x: 250, y: 280, radius: 20, color: '#00ff88', points: 200, hit: false }
        ];
        
        // 创建弹簧障碍
        this.bumpers = [
            { x: 80, y: 350, radius: 25, color: '#ff8800', points: 100 },
            { x: 200, y: 400, radius: 25, color: '#ff8800', points: 100 },
            { x: 320, y: 350, radius: 25, color: '#ff8800', points: 100 }
        ];
    }
    
    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            if (e.key.toLowerCase() === 'a') {
                this.leftFlipperActive = true;
            }
            if (e.key.toLowerCase() === 'd') {
                this.rightFlipperActive = true;
            }
            if (e.key === ' ') {
                e.preventDefault();
                if (!this.ball && this.ballsLeft > 0) {
                    this.startCharging();
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
            
            if (e.key.toLowerCase() === 'a') {
                this.leftFlipperActive = false;
            }
            if (e.key.toLowerCase() === 'd') {
                this.rightFlipperActive = false;
            }
            if (e.key === ' ') {
                e.preventDefault();
                if (this.charging) {
                    this.launchBall();
                }
            }
        });
        
        // 鼠标/触摸事件
        this.canvas.addEventListener('mousedown', (e) => {
            this.handlePointerDown(e.offsetX, e.offsetY);
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            this.handlePointerUp(e.offsetX, e.offsetY);
        });
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            this.handlePointerDown(x, y);
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            if (e.changedTouches.length > 0) {
                const touch = e.changedTouches[0];
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                this.handlePointerUp(x, y);
            }
        });
    }
    
    handlePointerDown(x, y) {
        if (x < this.canvas.width / 2) {
            this.leftFlipperActive = true;
        } else {
            this.rightFlipperActive = true;
        }
    }
    
    handlePointerUp(x, y) {
        if (x < this.canvas.width / 2) {
            this.leftFlipperActive = false;
        } else {
            this.rightFlipperActive = false;
        }
    }
    
    startCharging() {
        if (this.ball || this.ballsLeft <= 0) return;
        
        this.charging = true;
        this.launchPower = 0;
        this.chargeDirection = 1;
    }
    
    launchBall() {
        if (!this.charging) return;
        
        this.charging = false;
        this.ballsLeft--;
        this.gameActive = true;
        
        // 创建弹珠
        this.ball = {
            x: 365,
            y: 550,
            vx: 0,
            vy: -this.launchPower * 0.3,
            radius: 8,
            trail: []
        };
        
        this.launchPower = 0;
        this.updateDisplay();
    }
    
    update() {
        if (this.paused) return;
        
        // 更新发射力度
        if (this.charging) {
            this.launchPower += this.chargeDirection * 2;
            if (this.launchPower >= 100) {
                this.launchPower = 100;
                this.chargeDirection = -1;
            } else if (this.launchPower <= 0) {
                this.launchPower = 0;
                this.chargeDirection = 1;
            }
            this.updatePowerMeter();
        }
        
        // 更新挡板
        this.updateFlippers();
        
        // 更新弹珠
        if (this.ball) {
            this.updateBall();
        }
        
        // 更新粒子效果
        this.updateParticles();
    }
    
    updateFlippers() {
        this.flippers.forEach(flipper => {
            if (flipper.isLeft) {
                flipper.targetAngle = this.leftFlipperActive ? -0.5 : 0;
            } else {
                flipper.targetAngle = this.rightFlipperActive ? 0.5 : 0;
            }
            
            // 平滑过渡到目标角度
            const diff = flipper.targetAngle - flipper.angle;
            flipper.angle += diff * 0.3;
        });
    }
    
    updateBall() {
        if (!this.ball) return;
        
        // 添加重力
        this.ball.vy += this.gravity;
        
        // 应用摩擦力
        this.ball.vx *= this.friction;
        this.ball.vy *= this.friction;
        
        // 更新位置
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;
        
        // 更新轨迹
        this.ball.trail.push({ x: this.ball.x, y: this.ball.y });
        if (this.ball.trail.length > 10) {
            this.ball.trail.shift();
        }
        
        // 碰撞检测
        this.checkWallCollisions();
        this.checkFlipperCollisions();
        this.checkTargetCollisions();
        this.checkBumperCollisions();
        
        // 检查弹珠是否掉出
        if (this.ball.y > this.canvas.height + 50) {
            this.ballLost();
        }
    }
    
    checkWallCollisions() {
        this.walls.forEach(wall => {
            const dist = this.distanceToLine(
                this.ball.x, this.ball.y,
                wall.x1, wall.y1, wall.x2, wall.y2
            );
            
            if (dist < this.ball.radius) {
                // 计算法向量
                const dx = wall.x2 - wall.x1;
                const dy = wall.y2 - wall.y1;
                const length = Math.sqrt(dx * dx + dy * dy);
                const nx = -dy / length;
                const ny = dx / length;
                
                // 反射速度
                const dot = this.ball.vx * nx + this.ball.vy * ny;
                this.ball.vx -= 2 * dot * nx * this.bounceFactor;
                this.ball.vy -= 2 * dot * ny * this.bounceFactor;
                
                // 移动弹珠到安全位置
                this.ball.x += nx * (this.ball.radius - dist);
                this.ball.y += ny * (this.ball.radius - dist);
            }
        });
    }
    
    checkFlipperCollisions() {
        this.flippers.forEach(flipper => {
            const dx = this.ball.x - flipper.pivotX;
            const dy = this.ball.y - flipper.pivotY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < flipper.width && Math.abs(dy) < flipper.height + this.ball.radius) {
                // 挡板击球
                const force = flipper.isLeft ? this.leftFlipperActive : this.rightFlipperActive;
                if (force) {
                    const angle = Math.atan2(dy, dx);
                    const power = 15;
                    this.ball.vx += Math.cos(angle) * power;
                    this.ball.vy += Math.sin(angle) * power;
                    
                    this.createParticles(this.ball.x, this.ball.y, '#ffffff', 5);
                }
            }
        });
    }
    
    checkTargetCollisions() {
        this.targets.forEach(target => {
            if (!target.hit) {
                const dx = this.ball.x - target.x;
                const dy = this.ball.y - target.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < target.radius + this.ball.radius) {
                    // 击中靶标
                    target.hit = true;
                    this.addScore(target.points);
                    this.combo++;
                    this.totalHits++;
                    
                    // 反弹
                    const angle = Math.atan2(dy, dx);
                    this.ball.vx = Math.cos(angle) * 8;
                    this.ball.vy = Math.sin(angle) * 8;
                    
                    // 特效
                    this.createParticles(target.x, target.y, target.color, 10);
                    this.showScorePopup(target.x, target.y, target.points * this.multiplier);
                    
                    // 重置靶标（延迟）
                    setTimeout(() => {
                        target.hit = false;
                    }, 3000);
                }
            }
        });
    }
    
    checkBumperCollisions() {
        this.bumpers.forEach(bumper => {
            const dx = this.ball.x - bumper.x;
            const dy = this.ball.y - bumper.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < bumper.radius + this.ball.radius) {
                // 弹簧反弹
                const angle = Math.atan2(dy, dx);
                const force = 12;
                this.ball.vx = Math.cos(angle) * force;
                this.ball.vy = Math.sin(angle) * force;
                
                this.addScore(bumper.points);
                this.combo++;
                
                // 特效
                this.createParticles(bumper.x, bumper.y, bumper.color, 8);
                this.showScorePopup(bumper.x, bumper.y, bumper.points * this.multiplier);
            }
        });
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2; // 重力
            particle.alpha -= 0.02;
            particle.size *= 0.98;
            
            return particle.alpha > 0 && particle.size > 0.5;
        });
    }
    
    addScore(points) {
        const scoreToAdd = points * this.multiplier;
        this.score += scoreToAdd;
        
        // 更新倍数
        if (this.combo >= 5) {
            this.multiplier = Math.min(5, Math.floor(this.combo / 5) + 1);
        }
        
        // 检查奖励弹珠
        if (this.score >= (Math.floor(this.score / 10000) + 1) * 10000) {
            this.ballsLeft++;
            this.showScorePopup(this.canvas.width / 2, 100, '奖励弹珠!');
        }
        
        this.updateDisplay();
    }
    
    ballLost() {
        this.ball = null;
        this.combo = 0;
        this.multiplier = 1;
        
        if (this.ballsLeft <= 0) {
            this.gameOver();
        }
        
        this.updateDisplay();
    }
    
    gameOver() {
        this.gameActive = false;
        
        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('pinballHighScore', this.highScore);
        }
        
        // 更新最大连击
        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }
        
        this.showGameOverPopup();
    }
    
    createParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                color: color,
                alpha: 1,
                size: Math.random() * 4 + 2
            });
        }
    }
    
    showScorePopup(x, y, score) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = typeof score === 'number' ? `+${score}` : score;
        popup.style.left = x + 'px';
        popup.style.top = y + 'px';
        
        this.canvas.parentNode.appendChild(popup);
        
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 1000);
    }
    
    distanceToLine(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        
        if (lenSq === 0) return Math.sqrt(A * A + B * B);
        
        let param = dot / lenSq;
        param = Math.max(0, Math.min(1, param));
        
        const xx = x1 + param * C;
        const yy = y1 + param * D;
        
        const dx = px - xx;
        const dy = py - yy;
        
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    render() {
        // 清空画布
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景装饰
        this.renderBackground();
        
        // 绘制墙壁
        this.renderWalls();
        
        // 绘制靶标
        this.renderTargets();
        
        // 绘制弹簧障碍
        this.renderBumpers();
        
        // 绘制挡板
        this.renderFlippers();
        
        // 绘制弹珠
        if (this.ball) {
            this.renderBall();
        }
        
        // 绘制粒子效果
        this.renderParticles();
        
        // 绘制发射器
        this.renderLauncher();
    }
    
    renderBackground() {
        // 绘制装饰性背景元素
        this.ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 10; i++) {
            this.ctx.beginPath();
            this.ctx.arc(50 + i * 35, 50, 20, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    renderWalls() {
        this.ctx.strokeStyle = '#00ff88';
        this.ctx.lineWidth = 3;
        
        this.walls.forEach(wall => {
            this.ctx.beginPath();
            this.ctx.moveTo(wall.x1, wall.y1);
            this.ctx.lineTo(wall.x2, wall.y2);
            this.ctx.stroke();
        });
    }
    
    renderTargets() {
        this.targets.forEach(target => {
            this.ctx.fillStyle = target.hit ? 'rgba(255, 255, 255, 0.3)' : target.color;
            this.ctx.beginPath();
            this.ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            if (!target.hit) {
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        });
    }
    
    renderBumpers() {
        this.bumpers.forEach(bumper => {
            this.ctx.fillStyle = bumper.color;
            this.ctx.beginPath();
            this.ctx.arc(bumper.x, bumper.y, bumper.radius, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        });
    }
    
    renderFlippers() {
        this.flippers.forEach(flipper => {
            this.ctx.save();
            this.ctx.translate(flipper.pivotX, flipper.pivotY);
            this.ctx.rotate(flipper.angle);
            
            this.ctx.fillStyle = this.leftFlipperActive || this.rightFlipperActive ? '#ffff00' : '#00ff88';
            this.ctx.fillRect(-flipper.width / 2, -flipper.height / 2, flipper.width, flipper.height);
            
            this.ctx.restore();
        });
    }
    
    renderBall() {
        if (!this.ball) return;
        
        // 绘制轨迹
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        this.ball.trail.forEach((point, index) => {
            if (index === 0) {
                this.ctx.moveTo(point.x, point.y);
            } else {
                this.ctx.lineTo(point.x, point.y);
            }
        });
        this.ctx.stroke();
        
        // 绘制弹珠
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 绘制高光
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x - 2, this.ball.y - 2, this.ball.radius * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    renderParticles() {
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
    
    renderLauncher() {
        // 绘制发射器
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(355, 520, 20, 60);
        
        // 绘制弹簧
        if (this.charging) {
            const springHeight = 40 - (this.launchPower / 100) * 20;
            this.ctx.fillStyle = '#ffff00';
            this.ctx.fillRect(360, 520 + springHeight, 10, 40 - springHeight);
        }
    }
    
    updatePowerMeter() {
        const powerFill = document.getElementById('powerFill');
        const powerValue = document.getElementById('powerValue');
        
        powerFill.style.height = this.launchPower + '%';
        powerValue.textContent = Math.round(this.launchPower) + '%';
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score.toLocaleString();
        document.getElementById('ballsLeft').textContent = this.ballsLeft;
        document.getElementById('multiplier').textContent = '×' + this.multiplier;
        document.getElementById('highScore').textContent = this.highScore.toLocaleString();
    }
    
    togglePause() {
        this.paused = !this.paused;
        document.getElementById('pauseBtn').textContent = this.paused ? '▶️ 继续' : '⏸️ 暂停';
    }
    
    resetGame() {
        this.gameActive = false;
        this.paused = false;
        this.score = 0;
        this.ballsLeft = 3;
        this.multiplier = 1;
        this.combo = 0;
        this.ball = null;
        this.particles = [];
        this.charging = false;
        this.launchPower = 0;
        
        // 重置靶标
        this.targets.forEach(target => {
            target.hit = false;
        });
        
        this.updateDisplay();
        this.updatePowerMeter();
        document.getElementById('pauseBtn').textContent = '⏸️ 暂停';
    }
    
    showGameOverPopup() {
        const isNewHighScore = this.score === this.highScore && this.score > 0;
        
        document.getElementById('gameOverTitle').textContent = '🎮 游戏结束';
        document.getElementById('finalScore').textContent = this.score.toLocaleString();
        document.getElementById('finalCombo').textContent = this.maxCombo;
        document.getElementById('finalHits').textContent = this.totalHits;
        
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
    
    showHelp() {
        document.getElementById('helpModal').classList.add('show');
    }
    
    closeHelp() {
        document.getElementById('helpModal').classList.remove('show');
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 全局变量供HTML onclick调用
let pinballGame;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    pinballGame = new PinballGame();
});