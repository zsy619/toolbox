class BasketballGame {
            constructor() {
                this.canvas = document.getElementById('gameCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.canvas.width = 800;
                this.canvas.height = 600;
                
                this.gameState = 'menu';
                this.score = 0;
                this.shots = 0;
                this.maxShots = 20;
                this.timeLeft = 60;
                this.gameTimer = null;
                
                this.mouse = { x: 0, y: 0 };
                this.isCharging = false;
                this.chargePower = 0;
                this.maxPower = 100;
                this.chargeSpeed = 2;
                
                this.ball = null;
                this.ballTrail = [];
                this.basket = {
                    x: 650,
                    y: 200,
                    width: 80,
                    height: 15,
                    rimLeft: 650,
                    rimRight: 730,
                    netPoints: []
                };
                
                this.player = {
                    x: 100,
                    y: 450,
                    width: 40,
                    height: 60
                };
                
                this.gravity = 0.4;
                this.initBasket();
                this.bindEvents();
                this.updateUI();
            }

            initBasket() {
                // 生成篮网的点
                this.basket.netPoints = [];
                const segments = 8;
                for (let i = 0; i <= segments; i++) {
                    const x = this.basket.rimLeft + (this.basket.width * i / segments);
                    const y = this.basket.y + 15 + Math.sin(i * 0.5) * 30;
                    this.basket.netPoints.push({ x, y });
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
                    if (this.gameState === 'playing' && !this.ball) {
                        this.isCharging = true;
                        this.chargePower = 0;
                    }
                });
                
                this.canvas.addEventListener('mouseup', (e) => {
                    if (this.gameState === 'playing' && this.isCharging && !this.ball) {
                        this.shoot();
                        this.isCharging = false;
                        this.chargePower = 0;
                    }
                });
                
                // 处理鼠标离开画布的情况
                this.canvas.addEventListener('mouseleave', (e) => {
                    if (this.isCharging) {
                        this.shoot();
                        this.isCharging = false;
                        this.chargePower = 0;
                    }
                });
            }

            startGame() {
                this.gameState = 'playing';
                this.score = 0;
                this.shots = 0;
                this.timeLeft = 60;
                this.ball = null;
                this.ballTrail = [];
                this.isCharging = false;
                this.chargePower = 0;
                
                this.updateUI();
                this.hideMessage();
                document.getElementById('startButton').style.display = 'none';
                this.startTimer();
                this.gameLoop();
            }

            startTimer() {
                if (this.gameTimer) {
                    clearInterval(this.gameTimer);
                }
                
                this.gameTimer = setInterval(() => {
                    if (this.gameState === 'playing') {
                        this.timeLeft--;
                        this.updateUI();
                        
                        if (this.timeLeft <= 0 || this.shots >= this.maxShots) {
                            this.endGame();
                        }
                    }
                }, 1000);
            }

            gameLoop() {
                if (this.gameState === 'playing') {
                    this.update();
                    this.draw();
                    requestAnimationFrame(() => this.gameLoop());
                }
            }

            update() {
                // 更新蓄力
                if (this.isCharging) {
                    this.chargePower += this.chargeSpeed;
                    if (this.chargePower > this.maxPower) {
                        this.chargePower = this.maxPower;
                    }
                }
                
                // 更新篮球
                if (this.ball) {
                    this.updateBall();
                }
                
                this.updatePowerBar();
            }

            updateBall() {
                // 保存轨迹
                this.ballTrail.push({ x: this.ball.x, y: this.ball.y });
                if (this.ballTrail.length > 15) {
                    this.ballTrail.shift();
                }
                
                // 更新位置
                this.ball.x += this.ball.vx;
                this.ball.y += this.ball.vy;
                
                // 应用重力
                this.ball.vy += this.gravity;
                
                // 检查篮筐碰撞
                this.checkBasketCollision();
                
                // 边界检测
                if (this.ball.x < 0 || this.ball.x > this.canvas.width || 
                    this.ball.y > this.canvas.height) {
                    this.ballMissed();
                }
                
                // 地面反弹
                if (this.ball.y + this.ball.radius > this.canvas.height - 50) {
                    this.ball.y = this.canvas.height - 50 - this.ball.radius;
                    this.ball.vy *= -0.6;
                    this.ball.vx *= 0.8;
                    
                    // 如果速度太小就停止
                    if (Math.abs(this.ball.vy) < 2 && Math.abs(this.ball.vx) < 1) {
                        this.ballMissed();
                    }
                }
            }

            checkBasketCollision() {
                const ballBottom = this.ball.y + this.ball.radius;
                const ballTop = this.ball.y - this.ball.radius;
                const ballLeft = this.ball.x - this.ball.radius;
                const ballRight = this.ball.x + this.ball.radius;
                
                // 检查是否从上方进入篮筐
                if (ballBottom >= this.basket.y && 
                    ballTop <= this.basket.y + this.basket.height &&
                    ballLeft >= this.basket.rimLeft && 
                    ballRight <= this.basket.rimRight &&
                    this.ball.vy > 0) {
                    
                    // 得分
                    this.score += this.calculateScore();
                    this.showMessage('投中了！+' + this.calculateScore() + '分', 'score');
                    this.ballScored();
                }
                
                // 篮筐边缘碰撞
                if (ballBottom >= this.basket.y && 
                    ballTop <= this.basket.y + this.basket.height) {
                    
                    // 左边缘
                    if (ballRight >= this.basket.rimLeft && 
                        ballLeft <= this.basket.rimLeft + 10) {
                        this.ball.vx = -Math.abs(this.ball.vx) * 0.7;
                        this.ball.x = this.basket.rimLeft - this.ball.radius;
                    }
                    
                    // 右边缘
                    if (ballLeft <= this.basket.rimRight && 
                        ballRight >= this.basket.rimRight - 10) {
                        this.ball.vx = Math.abs(this.ball.vx) * 0.7;
                        this.ball.x = this.basket.rimRight + this.ball.radius;
                    }
                }
            }

            calculateScore() {
                // 根据距离和角度计算得分
                const distance = Math.sqrt(
                    Math.pow(this.player.x - this.basket.x, 2) + 
                    Math.pow(this.player.y - this.basket.y, 2)
                );
                
                if (distance > 400) return 3; // 三分球
                if (distance > 200) return 2; // 中投
                return 1; // 近投
            }

            shoot() {
                if (this.ball || this.shots >= this.maxShots) return;
                
                this.shots++;
                
                // 计算射击角度和力度
                const dx = this.mouse.x - (this.player.x + this.player.width / 2);
                const dy = this.mouse.y - (this.player.y + this.player.height / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance === 0) return;
                
                const power = this.chargePower / 100;
                const baseVelocity = 12 + power * 8;
                
                this.ball = {
                    x: this.player.x + this.player.width / 2,
                    y: this.player.y + this.player.height / 2,
                    radius: 12,
                    vx: (dx / distance) * baseVelocity,
                    vy: (dy / distance) * baseVelocity,
                    color: '#e17055'
                };
                
                this.ballTrail = [];
                this.updateUI();
            }

            ballScored() {
                setTimeout(() => {
                    this.ball = null;
                    this.ballTrail = [];
                    this.hideMessage();
                }, 1000);
            }

            ballMissed() {
                this.showMessage('投篮偏了！', 'miss');
                setTimeout(() => {
                    this.ball = null;
                    this.ballTrail = [];
                    this.hideMessage();
                }, 1000);
            }

            updatePowerBar() {
                const powerBarFill = document.getElementById('powerBarFill');
                const percentage = (this.chargePower / this.maxPower) * 100;
                powerBarFill.style.width = percentage + '%';
            }

            endGame() {
                this.gameState = 'gameOver';
                if (this.gameTimer) {
                    clearInterval(this.gameTimer);
                }
                
                let resultText = `游戏结束！最终得分：${this.score}分`;
                if (this.score >= 40) {
                    resultText += ' - 篮球高手！';
                } else if (this.score >= 20) {
                    resultText += ' - 不错的表现！';
                } else {
                    resultText += ' - 继续练习！';
                }
                
                this.showMessage(resultText, 'game-over');
                document.getElementById('startButton').style.display = 'block';
                document.getElementById('startButton').textContent = '重新开始';
            }

            draw() {
                // 清空画布
                this.ctx.fillStyle = '#e17055';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // 绘制球场
                this.drawCourt();
                
                // 绘制篮筐
                this.drawBasket();
                
                // 绘制球员
                this.drawPlayer();
                
                // 绘制篮球轨迹
                if (this.ballTrail.length > 1) {
                    this.drawBallTrail();
                }
                
                // 绘制篮球
                if (this.ball) {
                    this.drawBall();
                }
                
                // 绘制瞄准线
                if (!this.ball && this.gameState === 'playing') {
                    this.drawAimLine();
                }
                
                // 绘制蓄力指示器
                if (this.isCharging) {
                    this.drawChargeIndicator();
                }
            }

            drawCourt() {
                // 地面
                this.ctx.fillStyle = '#8b4513';
                this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50);
                
                // 球场线条
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 3;
                
                // 三分线（简化）
                this.ctx.beginPath();
                this.ctx.arc(this.basket.x + this.basket.width / 2, this.canvas.height - 50, 300, -Math.PI, 0);
                this.ctx.stroke();
                
                // 罚球线
                this.ctx.beginPath();
                this.ctx.moveTo(this.basket.x - 100, this.canvas.height - 50);
                this.ctx.lineTo(this.basket.x - 100, this.canvas.height - 200);
                this.ctx.stroke();
            }

            drawBasket() {
                // 篮板
                this.ctx.fillStyle = '#2d3436';
                this.ctx.fillRect(this.basket.x + 60, this.basket.y - 80, 10, 100);
                
                // 篮筐
                this.ctx.strokeStyle = '#fd79a8';
                this.ctx.lineWidth = 5;
                this.ctx.beginPath();
                this.ctx.moveTo(this.basket.rimLeft, this.basket.y);
                this.ctx.lineTo(this.basket.rimRight, this.basket.y);
                this.ctx.stroke();
                
                // 篮网
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                for (let i = 0; i < this.basket.netPoints.length - 1; i++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.basket.netPoints[i].x, this.basket.netPoints[i].y);
                    this.ctx.lineTo(this.basket.netPoints[i + 1].x, this.basket.netPoints[i + 1].y);
                    this.ctx.stroke();
                }
                
                // 垂直网线
                const netSegments = 6;
                for (let i = 1; i < netSegments; i++) {
                    const x = this.basket.rimLeft + (this.basket.width * i / netSegments);
                    this.ctx.beginPath();
                    this.ctx.moveTo(x, this.basket.y + 15);
                    this.ctx.lineTo(x, this.basket.y + 35);
                    this.ctx.stroke();
                }
            }

            drawPlayer() {
                // 球员身体
                this.ctx.fillStyle = '#74b9ff';
                this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
                
                // 球员头部
                this.ctx.fillStyle = '#fdcb6e';
                this.ctx.beginPath();
                this.ctx.arc(this.player.x + this.player.width / 2, this.player.y - 10, 15, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 球员手臂（投篮姿势）
                if (this.isCharging) {
                    this.ctx.strokeStyle = '#74b9ff';
                    this.ctx.lineWidth = 4;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.player.x + this.player.width / 2, this.player.y + 20);
                    this.ctx.lineTo(this.player.x + this.player.width / 2 + 20, this.player.y - 10);
                    this.ctx.stroke();
                }
            }

            drawBallTrail() {
                for (let i = 0; i < this.ballTrail.length; i++) {
                    const alpha = i / this.ballTrail.length;
                    const size = (i / this.ballTrail.length) * this.ball.radius;
                    
                    this.ctx.fillStyle = `rgba(225, 112, 85, ${alpha * 0.6})`;
                    this.ctx.beginPath();
                    this.ctx.arc(this.ballTrail[i].x, this.ballTrail[i].y, size, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }

            drawBall() {
                // 篮球主体
                this.ctx.fillStyle = this.ball.color;
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 篮球线条
                this.ctx.strokeStyle = '#2d3436';
                this.ctx.lineWidth = 2;
                
                // 水平线
                this.ctx.beginPath();
                this.ctx.moveTo(this.ball.x - this.ball.radius, this.ball.y);
                this.ctx.lineTo(this.ball.x + this.ball.radius, this.ball.y);
                this.ctx.stroke();
                
                // 垂直线
                this.ctx.beginPath();
                this.ctx.moveTo(this.ball.x, this.ball.y - this.ball.radius);
                this.ctx.lineTo(this.ball.x, this.ball.y + this.ball.radius);
                this.ctx.stroke();
                
                // 弧线
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius * 0.7, 0, Math.PI);
                this.ctx.stroke();
                
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius * 0.7, Math.PI, Math.PI * 2);
                this.ctx.stroke();
            }

            drawAimLine() {
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([5, 5]);
                
                this.ctx.beginPath();
                this.ctx.moveTo(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();
                
                this.ctx.setLineDash([]);
            }

            drawChargeIndicator() {
                const centerX = this.player.x + this.player.width / 2;
                const centerY = this.player.y - 40;
                const radius = 20;
                const percentage = this.chargePower / this.maxPower;
                
                // 背景圆
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                this.ctx.stroke();
                
                // 蓄力圆
                this.ctx.strokeStyle = percentage > 0.8 ? '#e17055' : '#00b894';
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * percentage);
                this.ctx.stroke();
            }

            updateUI() {
                document.getElementById('score').textContent = this.score;
                document.getElementById('shots').textContent = this.shots;
                document.getElementById('time').textContent = this.timeLeft;
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
            new BasketballGame();
        });