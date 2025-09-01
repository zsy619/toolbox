class BowlingGame {
            constructor() {
                this.canvas = document.getElementById('gameCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.canvas.width = 900;
                this.canvas.height = 600;
                
                this.gameState = 'menu';
                this.currentFrame = 1;
                this.currentThrow = 1;
                this.totalFrames = 10;
                this.scores = [];
                this.frameScores = [];
                
                this.mouse = { x: this.canvas.width / 2, y: this.canvas.height - 100 };
                this.isCharging = false;
                this.chargePower = 0;
                this.maxPower = 100;
                this.chargeSpeed = 2.5;
                
                this.accuracyPosition = 50; // 0-100
                this.accuracyDirection = 1;
                this.accuracySpeed = 1.5;
                
                this.ball = null;
                this.ballTrail = [];
                this.pins = [];
                this.fallenPins = [];
                
                this.initializeGame();
                this.bindEvents();
                this.updateUI();
            }

            initializeGame() {
                // 初始化保龄球
                this.ball = {
                    x: this.canvas.width / 2,
                    y: this.canvas.height - 80,
                    radius: 15,
                    vx: 0,
                    vy: 0,
                    gravity: 0.2,
                    friction: 0.98,
                    color: '#2d3436',
                    isMoving: false,
                    isVisible: true
                };
                
                // 初始化保龄球瓶
                this.setupPins();
                
                this.ballTrail = [];
                this.initializeScoreboard();
            }

            setupPins() {
                this.pins = [];
                const startX = this.canvas.width / 2;
                const startY = 120;
                const spacing = 25;
                
                // 经典的三角形排列 (4-3-2-1)
                const rows = [
                    { count: 4, y: startY },
                    { count: 3, y: startY + spacing },
                    { count: 2, y: startY + spacing * 2 },
                    { count: 1, y: startY + spacing * 3 }
                ];
                
                let pinId = 0;
                rows.forEach(row => {
                    const startRowX = startX - (row.count - 1) * spacing / 2;
                    for (let i = 0; i < row.count; i++) {
                        this.pins.push({
                            id: pinId++,
                            x: startRowX + i * spacing,
                            y: row.y,
                            radius: 8,
                            width: 6,
                            height: 20,
                            isStanding: true,
                            color: '#f8f9fa',
                            fallenAngle: 0
                        });
                    }
                });
            }

            initializeScoreboard() {
                this.scores = Array(10).fill(null).map(() => ({ throw1: null, throw2: null, throw3: null, total: 0 }));
                this.frameScores = Array(10).fill(0);
                this.renderScoreboard();
            }

            renderScoreboard() {
                const frameScoresElement = document.getElementById('frameScores');
                frameScoresElement.innerHTML = '';
                
                for (let i = 0; i < 10; i++) {
                    const frameBox = document.createElement('div');
                    frameBox.className = `frame-box ${i === this.currentFrame - 1 ? 'current' : ''}`;
                    
                    let frameText = `第${i + 1}轮<br>`;
                    const score = this.scores[i];
                    
                    if (i < 9) { // 前9轮
                        if (score.throw1 === 10) {
                            frameText += 'X';
                        } else if (score.throw1 !== null && score.throw2 !== null) {
                            if (score.throw1 + score.throw2 === 10) {
                                frameText += `${score.throw1}/`;
                            } else {
                                frameText += `${score.throw1}${score.throw2}`;
                            }
                        } else if (score.throw1 !== null) {
                            frameText += `${score.throw1}-`;
                        } else {
                            frameText += '--';
                        }
                    } else { // 第10轮
                        let throws = '';
                        if (score.throw1 === 10) throws += 'X';
                        else if (score.throw1 !== null) throws += score.throw1;
                        else throws += '-';
                        
                        if (score.throw2 !== null) {
                            if (score.throw1 !== 10 && score.throw1 + score.throw2 === 10) {
                                throws += '/';
                            } else if (score.throw2 === 10) {
                                throws += 'X';
                            } else {
                                throws += score.throw2;
                            }
                        } else if (score.throw1 !== 10) {
                            throws += '-';
                        }
                        
                        if (score.throw3 !== null) {
                            if (score.throw3 === 10) throws += 'X';
                            else throws += score.throw3;
                        } else if ((score.throw1 === 10 || (score.throw1 + score.throw2 === 10)) && i === 9) {
                            throws += '-';
                        }
                        
                        frameText += throws;
                    }
                    
                    frameBox.innerHTML = frameText;
                    frameScoresElement.appendChild(frameBox);
                }
            }

            bindEvents() {
                document.getElementById('startButton').addEventListener('click', () => {
                    this.startGame();
                });
                
                this.canvas.addEventListener('mousemove', (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    this.mouse.x = e.clientX - rect.left;
                    this.mouse.y = e.clientY - rect.top;
                });
                
                this.canvas.addEventListener('mousedown', (e) => {
                    if (this.gameState === 'playing' && !this.ball.isMoving && this.ball.isVisible) {
                        this.isCharging = true;
                        this.chargePower = 0;
                    }
                });
                
                this.canvas.addEventListener('mouseup', (e) => {
                    if (this.gameState === 'playing' && this.isCharging && this.ball.isVisible) {
                        this.throwBall();
                        this.isCharging = false;
                        this.chargePower = 0;
                    }
                });
                
                this.canvas.addEventListener('mouseleave', (e) => {
                    if (this.isCharging) {
                        this.throwBall();
                        this.isCharging = false;
                        this.chargePower = 0;
                    }
                });
            }

            startGame() {
                this.gameState = 'playing';
                this.currentFrame = 1;
                this.currentThrow = 1;
                this.initializeGame();
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
                this.updateBall();
                this.updatePowerBar();
                this.updateAccuracy();
                this.checkCollisions();
                this.checkBounds();
            }

            updateBall() {
                if (!this.ball.isMoving) return;
                
                // 保存轨迹
                this.ballTrail.push({ x: this.ball.x, y: this.ball.y });
                if (this.ballTrail.length > 15) {
                    this.ballTrail.shift();
                }
                
                // 更新位置
                this.ball.x += this.ball.vx;
                this.ball.y += this.ball.vy;
                
                // 应用重力和摩擦
                this.ball.vy += this.ball.gravity;
                this.ball.vx *= this.ball.friction;
                this.ball.vy *= this.ball.friction;
                
                // 地面反弹
                if (this.ball.y + this.ball.radius > this.canvas.height - 20) {
                    this.ball.y = this.canvas.height - 20 - this.ball.radius;
                    this.ball.vy *= -0.4;
                    this.ball.vx *= 0.9;
                }
                
                // 边界反弹
                if (this.ball.x - this.ball.radius <= 50 || this.ball.x + this.ball.radius >= this.canvas.width - 50) {
                    this.ball.vx *= -0.6;
                    this.ball.x = Math.max(50 + this.ball.radius, Math.min(this.canvas.width - 50 - this.ball.radius, this.ball.x));
                }
                
                // 停止检测
                if (Math.abs(this.ball.vx) < 0.5 && Math.abs(this.ball.vy) < 0.5 && 
                    this.ball.y + this.ball.radius >= this.canvas.height - 20) {
                    this.ball.isMoving = false;
                    this.ballTrail = [];
                    this.endThrow();
                }
            }

            updatePowerBar() {
                if (this.isCharging) {
                    this.chargePower += this.chargeSpeed;
                    if (this.chargePower > this.maxPower) {
                        this.chargePower = this.maxPower;
                    }
                }
                
                const powerFill = document.getElementById('powerFill');
                const percentage = (this.chargePower / this.maxPower) * 100;
                powerFill.style.width = percentage + '%';
            }

            updateAccuracy() {
                if (!this.isCharging) {
                    this.accuracyPosition += this.accuracyDirection * this.accuracySpeed;
                    if (this.accuracyPosition <= 0 || this.accuracyPosition >= 100) {
                        this.accuracyDirection *= -1;
                        this.accuracyPosition = Math.max(0, Math.min(100, this.accuracyPosition));
                    }
                    
                    const marker = document.getElementById('accuracyMarker');
                    marker.style.left = this.accuracyPosition + '%';
                }
            }

            throwBall() {
                const power = this.chargePower / 100;
                const direction = (this.mouse.x - this.ball.x) / this.canvas.width;
                
                // 计算精度偏差
                const accuracyError = Math.abs(this.accuracyPosition - 50) / 50;
                const maxDeviation = 0.3 * accuracyError;
                const deviation = (Math.random() - 0.5) * maxDeviation;
                
                // 设置球的速度
                const baseVelocity = 8 + power * 8;
                this.ball.vx = (direction + deviation) * baseVelocity;
                this.ball.vy = -baseVelocity * 0.8;
                this.ball.isMoving = true;
            }

            checkCollisions() {
                this.pins.forEach(pin => {
                    if (!pin.isStanding) return;
                    
                    const distance = Math.sqrt(
                        Math.pow(this.ball.x - pin.x, 2) + 
                        Math.pow(this.ball.y - pin.y, 2)
                    );
                    
                    if (distance < this.ball.radius + pin.radius) {
                        // 碰撞检测
                        pin.isStanding = false;
                        pin.fallenAngle = Math.random() * Math.PI;
                        
                        // 球的反弹
                        const dx = this.ball.x - pin.x;
                        const dy = this.ball.y - pin.y;
                        const angle = Math.atan2(dy, dx);
                        
                        this.ball.vx += Math.cos(angle) * 2;
                        this.ball.vy += Math.sin(angle) * 2;
                        
                        // 连锁反应
                        this.checkPinCollisions(pin);
                    }
                });
            }

            checkPinCollisions(fallenPin) {
                this.pins.forEach(pin => {
                    if (!pin.isStanding || pin === fallenPin) return;
                    
                    const distance = Math.sqrt(
                        Math.pow(fallenPin.x - pin.x, 2) + 
                        Math.pow(fallenPin.y - pin.y, 2)
                    );
                    
                    if (distance < pin.radius * 3) {
                        if (Math.random() < 0.4) { // 40%几率连带倒下
                            pin.isStanding = false;
                            pin.fallenAngle = Math.random() * Math.PI;
                        }
                    }
                });
            }

            checkBounds() {
                // 球出界检查
                if (this.ball.y < -50) {
                    this.ball.isMoving = false;
                    this.endThrow();
                }
            }

            endThrow() {
                const pinsDown = this.pins.filter(pin => !pin.isStanding).length;
                const frameScore = this.currentThrow === 1 ? pinsDown : pinsDown - (this.scores[this.currentFrame - 1].throw1 || 0);
                
                // 记录分数
                if (this.currentFrame <= 10) {
                    if (this.currentThrow === 1) {
                        this.scores[this.currentFrame - 1].throw1 = pinsDown;
                        
                        if (pinsDown === 10) {
                            // 全中
                            this.showMessage('🎉 全中！STRIKE！', 'strike');
                            this.nextFrame();
                        } else {
                            this.currentThrow = 2;
                            this.resetForNextThrow();
                        }
                    } else if (this.currentThrow === 2) {
                        this.scores[this.currentFrame - 1].throw2 = frameScore;
                        
                        if (this.scores[this.currentFrame - 1].throw1 + frameScore === 10) {
                            // 补中
                            this.showMessage('👍 补中！SPARE！', 'spare');
                        }
                        
                        if (this.currentFrame === 10 && (this.scores[9].throw1 === 10 || this.scores[9].throw1 + frameScore === 10)) {
                            // 第10轮有额外投球机会
                            this.currentThrow = 3;
                            this.setupPins();
                            this.resetForNextThrow();
                        } else {
                            this.nextFrame();
                        }
                    } else if (this.currentThrow === 3 && this.currentFrame === 10) {
                        this.scores[9].throw3 = frameScore;
                        this.endGame();
                    }
                }
                
                this.calculateTotalScore();
                this.updateUI();
                this.renderScoreboard();
            }

            calculateTotalScore() {
                let total = 0;
                
                for (let i = 0; i < 10; i++) {
                    const frame = this.scores[i];
                    
                    if (i < 9) { // 前9轮
                        if (frame.throw1 === 10) { // 全中
                            total += 10;
                            if (this.scores[i + 1]) {
                                total += this.scores[i + 1].throw1 || 0;
                                if (this.scores[i + 1].throw1 === 10 && i < 8) {
                                    total += this.scores[i + 2] ? this.scores[i + 2].throw1 || 0 : 0;
                                } else {
                                    total += this.scores[i + 1].throw2 || 0;
                                }
                            }
                        } else if ((frame.throw1 || 0) + (frame.throw2 || 0) === 10) { // 补中
                            total += 10;
                            if (this.scores[i + 1]) {
                                total += this.scores[i + 1].throw1 || 0;
                            }
                        } else {
                            total += (frame.throw1 || 0) + (frame.throw2 || 0);
                        }
                    } else { // 第10轮
                        total += (frame.throw1 || 0) + (frame.throw2 || 0) + (frame.throw3 || 0);
                    }
                    
                    this.frameScores[i] = total;
                }
                
                document.getElementById('totalScore').textContent = total;
            }

            nextFrame() {
                if (this.currentFrame < this.totalFrames) {
                    this.currentFrame++;
                    this.currentThrow = 1;
                    this.setupPins();
                    this.resetForNextThrow();
                } else {
                    this.endGame();
                }
            }

            resetForNextThrow() {
                this.ball.x = this.canvas.width / 2;
                this.ball.y = this.canvas.height - 80;
                this.ball.vx = 0;
                this.ball.vy = 0;
                this.ball.isMoving = false;
                this.ball.isVisible = true;
                this.ballTrail = [];
                
                setTimeout(() => {
                    this.hideMessage();
                }, 2000);
            }

            endGame() {
                this.gameState = 'gameOver';
                const finalScore = this.frameScores[9];
                
                let rating = '';
                if (finalScore >= 200) {
                    rating = '专业级高手！';
                } else if (finalScore >= 150) {
                    rating = '优秀选手！';
                } else if (finalScore >= 100) {
                    rating = '不错的表现！';
                } else {
                    rating = '继续努力！';
                }
                
                this.showMessage(`🏁 游戏结束！总分: ${finalScore} | ${rating}`, 'game-over');
                document.getElementById('startButton').style.display = 'block';
                document.getElementById('startButton').textContent = '重新开始';
            }

            draw() {
                // 清空画布
                this.drawBackground();
                
                // 绘制球道
                this.drawLane();
                
                // 绘制保龄球瓶
                this.drawPins();
                
                // 绘制轨迹
                this.drawBallTrail();
                
                // 绘制球
                if (this.ball.isVisible) {
                    this.drawBall();
                }
                
                // 绘制瞄准线
                if (!this.ball.isMoving && this.ball.isVisible && this.gameState === 'playing') {
                    this.drawAimLine();
                }
                
                // 绘制蓄力指示器
                if (this.isCharging) {
                    this.drawChargeIndicator();
                }
            }

            drawBackground() {
                // 绘制木质背景
                this.ctx.fillStyle = '#deb887';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            }

            drawLane() {
                // 绘制球道
                this.ctx.fillStyle = '#cd853f';
                this.ctx.fillRect(50, 0, this.canvas.width - 100, this.canvas.height);
                
                // 绘制球道边界
                this.ctx.strokeStyle = '#8b4513';
                this.ctx.lineWidth = 4;
                this.ctx.strokeRect(50, 0, this.canvas.width - 100, this.canvas.height);
                
                // 绘制投球区域
                this.ctx.fillStyle = '#f4a460';
                this.ctx.fillRect(50, this.canvas.height - 120, this.canvas.width - 100, 120);
                
                // 绘制瞄准点
                this.ctx.fillStyle = '#8b4513';
                for (let i = 1; i <= 7; i++) {
                    const x = 50 + (this.canvas.width - 100) / 8 * i;
                    this.ctx.fillRect(x - 2, this.canvas.height / 2, 4, 20);
                }
            }

            drawPins() {
                this.pins.forEach(pin => {
                    this.ctx.save();
                    this.ctx.translate(pin.x, pin.y);
                    
                    if (pin.isStanding) {
                        // 站立的保龄球瓶
                        this.ctx.fillStyle = pin.color;
                        this.ctx.fillRect(-pin.width / 2, -pin.height / 2, pin.width, pin.height);
                        
                        // 瓶子上的红色条纹
                        this.ctx.fillStyle = '#e74c3c';
                        this.ctx.fillRect(-pin.width / 2, -2, pin.width, 4);
                        
                        // 瓶子边框
                        this.ctx.strokeStyle = '#2d3436';
                        this.ctx.lineWidth = 1;
                        this.ctx.strokeRect(-pin.width / 2, -pin.height / 2, pin.width, pin.height);
                    } else {
                        // 倒下的保龄球瓶
                        this.ctx.rotate(pin.fallenAngle);
                        this.ctx.fillStyle = pin.color;
                        this.ctx.fillRect(-pin.height / 2, -pin.width / 2, pin.height, pin.width);
                        
                        this.ctx.fillStyle = '#e74c3c';
                        this.ctx.fillRect(-2, -pin.width / 2, 4, pin.width);
                    }
                    
                    this.ctx.restore();
                });
            }

            drawBallTrail() {
                for (let i = 0; i < this.ballTrail.length; i++) {
                    const alpha = (i + 1) / this.ballTrail.length * 0.4;
                    const size = (i + 1) / this.ballTrail.length * this.ball.radius;
                    
                    this.ctx.fillStyle = `rgba(45, 52, 54, ${alpha})`;
                    this.ctx.beginPath();
                    this.ctx.arc(this.ballTrail[i].x, this.ballTrail[i].y, size, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }

            drawBall() {
                // 球的阴影
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x + 3, this.ball.y + 3, this.ball.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 球的主体
                this.ctx.fillStyle = this.ball.color;
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 球的纹理
                this.ctx.strokeStyle = '#636e72';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius * 0.8, 0, Math.PI * 2);
                this.ctx.stroke();
                
                // 手指孔
                for (let i = 0; i < 3; i++) {
                    const angle = (Math.PI * 2 / 3) * i;
                    const holeX = this.ball.x + Math.cos(angle) * this.ball.radius * 0.4;
                    const holeY = this.ball.y + Math.sin(angle) * this.ball.radius * 0.4;
                    
                    this.ctx.fillStyle = '#000';
                    this.ctx.beginPath();
                    this.ctx.arc(holeX, holeY, 3, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }

            drawAimLine() {
                const dx = this.mouse.x - this.ball.x;
                const dy = this.mouse.y - this.ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxLength = 200;
                const actualLength = Math.min(distance, maxLength);
                
                const endX = this.ball.x + (dx / distance) * actualLength;
                const endY = this.ball.y + (dy / distance) * actualLength;
                
                this.ctx.strokeStyle = 'rgba(231, 76, 60, 0.6)';
                this.ctx.lineWidth = 3;
                this.ctx.setLineDash([10, 5]);
                this.ctx.beginPath();
                this.ctx.moveTo(this.ball.x, this.ball.y);
                this.ctx.lineTo(endX, endY);
                this.ctx.stroke();
                this.ctx.setLineDash([]);
            }

            drawChargeIndicator() {
                const centerX = this.ball.x;
                const centerY = this.ball.y - 40;
                const radius = 20;
                const percentage = this.chargePower / this.maxPower;
                
                // 背景圆
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                this.ctx.stroke();
                
                // 蓄力圆
                this.ctx.strokeStyle = percentage > 0.8 ? '#e74c3c' : '#27ae60';
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * percentage);
                this.ctx.stroke();
            }

            updateUI() {
                document.getElementById('currentFrame').textContent = this.currentFrame;
                document.getElementById('currentThrow').textContent = this.currentThrow;
                
                const standingPins = this.pins.filter(pin => pin.isStanding).length;
                document.getElementById('frameScore').textContent = 10 - standingPins;
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
            new BowlingGame();
        });