class GolfGame {
            constructor() {
                this.canvas = document.getElementById('gameCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.canvas.width = 900;
                this.canvas.height = 600;
                
                this.gameState = 'menu';
                this.currentHole = 1;
                this.totalHoles = 18;
                this.totalStrokes = 0;
                this.holeStrokes = 0;
                
                this.mouse = { x: this.canvas.width / 2, y: this.canvas.height - 100 };
                this.isCharging = false;
                this.chargePower = 0;
                this.maxPower = 100;
                this.chargeSpeed = 2;
                
                this.selectedClub = 'putter';
                this.clubPowers = {
                    putter: { min: 1, max: 15, accuracy: 0.95 },
                    wedge: { min: 10, max: 50, accuracy: 0.85 },
                    iron: { min: 30, max: 80, accuracy: 0.75 },
                    driver: { min: 50, max: 120, accuracy: 0.65 }
                };
                
                this.ball = null;
                this.ballTrail = [];
                this.hole = null;
                this.obstacles = [];
                this.wind = { x: 0, y: 0 };
                
                this.holes = this.generateHoles();
                this.initializeGame();
                this.bindEvents();
                this.updateUI();
            }

            generateHoles() {
                const holes = [];
                for (let i = 1; i <= this.totalHoles; i++) {
                    holes.push({
                        number: i,
                        par: this.getRandomPar(),
                        tee: { x: 100, y: this.canvas.height - 100 },
                        hole: { 
                            x: this.canvas.width - 100 + Math.random() * 40 - 20, 
                            y: 100 + Math.random() * 40 - 20,
                            radius: 15 
                        },
                        obstacles: this.generateObstacles(),
                        terrain: this.generateTerrain()
                    });
                }
                return holes;
            }

            getRandomPar() {
                const pars = [3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 3, 4, 4, 4, 5, 4];
                return pars[Math.floor(Math.random() * pars.length)];
            }

            generateObstacles() {
                const obstacles = [];
                const numObstacles = Math.floor(Math.random() * 4) + 1;
                
                for (let i = 0; i < numObstacles; i++) {
                    const type = Math.random() < 0.6 ? 'sand' : 'water';
                    obstacles.push({
                        type: type,
                        x: 200 + Math.random() * 400,
                        y: 150 + Math.random() * 300,
                        width: 60 + Math.random() * 80,
                        height: 40 + Math.random() * 60,
                        penalty: type === 'water' ? 2 : 1
                    });
                }
                
                return obstacles;
            }

            generateTerrain() {
                return {
                    roughAreas: Math.floor(Math.random() * 3) + 1
                };
            }

            initializeGame() {
                const currentHoleData = this.holes[this.currentHole - 1];
                
                // 初始化球
                this.ball = {
                    x: currentHoleData.tee.x,
                    y: currentHoleData.tee.y,
                    radius: 6,
                    vx: 0,
                    vy: 0,
                    gravity: 0.2,
                    friction: 0.98,
                    color: '#ffffff',
                    isMoving: false,
                    inHole: false
                };
                
                // 设置球洞
                this.hole = currentHoleData.hole;
                
                // 设置障碍物
                this.obstacles = currentHoleData.obstacles;
                
                // 生成随机风向
                this.generateWind();
                
                this.ballTrail = [];
                this.holeStrokes = 0;
            }

            generateWind() {
                const windStrength = Math.random() * 0.3;
                const windAngle = Math.random() * Math.PI * 2;
                this.wind = {
                    x: Math.cos(windAngle) * windStrength,
                    y: Math.sin(windAngle) * windStrength
                };
                
                const windSpeed = Math.floor(windStrength * 100);
                const windDirection = this.getWindDirection(windAngle);
                document.getElementById('windInfo').textContent = 
                    windSpeed === 0 ? '风速: 无风' : `风速: ${windSpeed}km/h ${windDirection}`;
            }

            getWindDirection(angle) {
                const directions = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
                const index = Math.round(angle / (Math.PI / 4)) % 8;
                return directions[index];
            }

            bindEvents() {
                document.getElementById('startButton').addEventListener('click', () => {
                    this.startGame();
                });
                
                // 球杆选择
                document.querySelectorAll('.club-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        this.selectClub(e.target.dataset.club);
                    });
                });
                
                this.canvas.addEventListener('mousemove', (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    this.mouse.x = e.clientX - rect.left;
                    this.mouse.y = e.clientY - rect.top;
                });
                
                this.canvas.addEventListener('mousedown', (e) => {
                    if (this.gameState === 'playing' && !this.ball.isMoving) {
                        this.isCharging = true;
                        this.chargePower = 0;
                    }
                });
                
                this.canvas.addEventListener('mouseup', (e) => {
                    if (this.gameState === 'playing' && this.isCharging && !this.ball.isMoving) {
                        this.hitBall();
                        this.isCharging = false;
                        this.chargePower = 0;
                    }
                });
                
                this.canvas.addEventListener('mouseleave', (e) => {
                    if (this.isCharging) {
                        this.hitBall();
                        this.isCharging = false;
                        this.chargePower = 0;
                    }
                });
            }

            selectClub(clubType) {
                this.selectedClub = clubType;
                document.querySelectorAll('.club-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector(`[data-club="${clubType}"]`).classList.add('active');
            }

            startGame() {
                this.gameState = 'playing';
                this.currentHole = 1;
                this.totalStrokes = 0;
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
                this.checkCollisions();
                this.checkHole();
            }

            updateBall() {
                if (!this.ball.isMoving) return;
                
                // 保存轨迹
                this.ballTrail.push({ x: this.ball.x, y: this.ball.y });
                if (this.ballTrail.length > 20) {
                    this.ballTrail.shift();
                }
                
                // 应用风力
                this.ball.vx += this.wind.x;
                this.ball.vy += this.wind.y;
                
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
                    this.ball.vy *= -0.6;
                    this.ball.vx *= 0.8;
                }
                
                // 边界反弹
                if (this.ball.x - this.ball.radius <= 0 || this.ball.x + this.ball.radius >= this.canvas.width) {
                    this.ball.vx *= -0.7;
                    this.ball.x = Math.max(this.ball.radius, Math.min(this.canvas.width - this.ball.radius, this.ball.x));
                }
                
                // 停止检测
                if (Math.abs(this.ball.vx) < 0.3 && Math.abs(this.ball.vy) < 0.3 && 
                    this.ball.y + this.ball.radius >= this.canvas.height - 20) {
                    this.ball.vx = 0;
                    this.ball.vy = 0;
                    this.ball.isMoving = false;
                    this.ballTrail = [];
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

            hitBall() {
                const clubData = this.clubPowers[this.selectedClub];
                const power = (this.chargePower / 100) * (clubData.max - clubData.min) + clubData.min;
                const accuracy = clubData.accuracy;
                
                // 计算击球方向
                const dx = this.mouse.x - this.ball.x;
                const dy = this.mouse.y - this.ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // 添加精度偏差
                const accuracyOffset = (1 - accuracy) * (Math.random() - 0.5) * 0.5;
                const angle = Math.atan2(dy, dx) + accuracyOffset;
                
                // 设置球的速度
                this.ball.vx = Math.cos(angle) * power * 0.15;
                this.ball.vy = Math.sin(angle) * power * 0.15;
                this.ball.isMoving = true;
                
                // 增加杆数
                this.holeStrokes++;
                this.totalStrokes++;
                this.updateUI();
            }

            checkCollisions() {
                // 检查障碍物碰撞
                this.obstacles.forEach(obstacle => {
                    if (this.ball.x >= obstacle.x && 
                        this.ball.x <= obstacle.x + obstacle.width &&
                        this.ball.y >= obstacle.y && 
                        this.ball.y <= obstacle.y + obstacle.height) {
                        
                        if (obstacle.type === 'water') {
                            // 水障碍：球回到上一位置并罚杆
                            this.ball.x = this.holes[this.currentHole - 1].tee.x;
                            this.ball.y = this.holes[this.currentHole - 1].tee.y;
                            this.ball.vx = 0;
                            this.ball.vy = 0;
                            this.ball.isMoving = false;
                            this.totalStrokes += obstacle.penalty;
                            this.holeStrokes += obstacle.penalty;
                            this.showMessage('球落入水障碍！罚2杆', 'good-shot');
                            this.updateUI();
                        } else if (obstacle.type === 'sand') {
                            // 沙坑：减速
                            this.ball.vx *= 0.5;
                            this.ball.vy *= 0.5;
                            this.ball.friction = 0.9;
                        }
                    }
                });
            }

            checkHole() {
                const distance = Math.sqrt(
                    Math.pow(this.ball.x - this.hole.x, 2) + 
                    Math.pow(this.ball.y - this.hole.y, 2)
                );
                
                if (distance <= this.hole.radius && !this.ball.isMoving) {
                    this.ball.inHole = true;
                    this.completeHole();
                }
            }

            completeHole() {
                const par = this.holes[this.currentHole - 1].par;
                let message = '';
                
                if (this.holeStrokes === 1) {
                    message = '🎉 一杆进洞！传奇表现！';
                } else if (this.holeStrokes <= par - 2) {
                    message = '🦅 老鹰球！出色发挥！';
                } else if (this.holeStrokes === par - 1) {
                    message = '🐦 小鸟球！干得漂亮！';
                } else if (this.holeStrokes === par) {
                    message = '✅ 标准杆！稳定发挥！';
                } else if (this.holeStrokes === par + 1) {
                    message = '😐 柏忌，还不错';
                } else {
                    message = '😅 需要多练习哦';
                }
                
                this.showMessage(message, this.holeStrokes === 1 ? 'hole-in-one' : 'good-shot');
                
                setTimeout(() => {
                    if (this.currentHole < this.totalHoles) {
                        this.nextHole();
                    } else {
                        this.endGame();
                    }
                }, 2000);
            }

            nextHole() {
                this.currentHole++;
                this.initializeGame();
                this.updateUI();
                this.hideMessage();
            }

            endGame() {
                this.gameState = 'gameOver';
                const averageScore = (this.totalStrokes / this.totalHoles).toFixed(1);
                
                let rating = '';
                if (averageScore <= 3.5) {
                    rating = '专业级高手！';
                } else if (averageScore <= 4.0) {
                    rating = '优秀球手！';
                } else if (averageScore <= 4.5) {
                    rating = '不错的表现！';
                } else {
                    rating = '继续努力！';
                }
                
                this.showMessage(`🏁 比赛结束！总杆数: ${this.totalStrokes} | 平均: ${averageScore} | ${rating}`, 'game-over');
                document.getElementById('startButton').style.display = 'block';
                document.getElementById('startButton').textContent = '重新开始';
            }

            getDistance(obj1, obj2) {
                const dx = obj1.x - obj2.x;
                const dy = obj1.y - obj2.y;
                return Math.sqrt(dx * dx + dy * dy);
            }

            draw() {
                // 清空画布
                this.drawBackground();
                
                // 绘制球洞
                this.drawHole();
                
                // 绘制障碍物
                this.drawObstacles();
                
                // 绘制轨迹
                this.drawBallTrail();
                
                // 绘制球
                this.drawBall();
                
                // 绘制瞄准线
                if (!this.ball.isMoving && this.gameState === 'playing') {
                    this.drawAimLine();
                }
                
                // 绘制蓄力指示器
                if (this.isCharging) {
                    this.drawChargeIndicator();
                }
            }

            drawBackground() {
                // 绘制草地背景
                this.ctx.fillStyle = '#2ecc71';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // 绘制发球台
                this.ctx.fillStyle = '#27ae60';
                this.ctx.fillRect(50, this.canvas.height - 150, 100, 100);
                
                // 绘制球道
                const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
                gradient.addColorStop(0, '#2ecc71');
                gradient.addColorStop(0.5, '#27ae60');
                gradient.addColorStop(1, '#2ecc71');
                this.ctx.fillStyle = gradient;
                this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50);
            }

            drawHole() {
                // 绘制果岭
                this.ctx.fillStyle = '#16a085';
                this.ctx.beginPath();
                this.ctx.arc(this.hole.x, this.hole.y, this.hole.radius + 20, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 绘制球洞
                this.ctx.fillStyle = '#2c3e50';
                this.ctx.beginPath();
                this.ctx.arc(this.hole.x, this.hole.y, this.hole.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 绘制旗杆
                this.ctx.strokeStyle = '#e74c3c';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.moveTo(this.hole.x, this.hole.y - this.hole.radius);
                this.ctx.lineTo(this.hole.x, this.hole.y - this.hole.radius - 40);
                this.ctx.stroke();
                
                // 绘制旗帜
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.fillRect(this.hole.x, this.hole.y - this.hole.radius - 40, 25, 15);
            }

            drawObstacles() {
                this.obstacles.forEach(obstacle => {
                    if (obstacle.type === 'sand') {
                        this.ctx.fillStyle = '#f4d03f';
                    } else if (obstacle.type === 'water') {
                        this.ctx.fillStyle = '#3498db';
                    }
                    
                    this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                    
                    // 添加纹理效果
                    if (obstacle.type === 'sand') {
                        this.ctx.fillStyle = '#f1c40f';
                        for (let i = 0; i < 10; i++) {
                            const x = obstacle.x + Math.random() * obstacle.width;
                            const y = obstacle.y + Math.random() * obstacle.height;
                            this.ctx.fillRect(x, y, 2, 2);
                        }
                    } else if (obstacle.type === 'water') {
                        this.ctx.strokeStyle = '#2980b9';
                        this.ctx.lineWidth = 2;
                        for (let i = 0; i < 3; i++) {
                            const y = obstacle.y + (obstacle.height / 4) * (i + 1);
                            this.ctx.beginPath();
                            this.ctx.moveTo(obstacle.x, y);
                            this.ctx.lineTo(obstacle.x + obstacle.width, y);
                            this.ctx.stroke();
                        }
                    }
                });
            }

            drawBallTrail() {
                for (let i = 0; i < this.ballTrail.length; i++) {
                    const alpha = (i + 1) / this.ballTrail.length * 0.5;
                    const size = (i + 1) / this.ballTrail.length * this.ball.radius;
                    
                    this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                    this.ctx.beginPath();
                    this.ctx.arc(this.ballTrail[i].x, this.ballTrail[i].y, size, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }

            drawBall() {
                if (this.ball.inHole) return;
                
                // 球的阴影
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x + 2, this.ball.y + 2, this.ball.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 球的主体
                this.ctx.fillStyle = this.ball.color;
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 球的纹理
                this.ctx.strokeStyle = '#bdc3c7';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius * 0.7, 0, Math.PI * 2);
                this.ctx.stroke();
                
                // 高光
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x - 2, this.ball.y - 2, this.ball.radius * 0.3, 0, Math.PI * 2);
                this.ctx.fill();
            }

            drawAimLine() {
                const dx = this.mouse.x - this.ball.x;
                const dy = this.mouse.y - this.ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxLength = 100;
                const actualLength = Math.min(distance, maxLength);
                
                const endX = this.ball.x + (dx / distance) * actualLength;
                const endY = this.ball.y + (dy / distance) * actualLength;
                
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
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
                const centerY = this.ball.y - 30;
                const radius = 15;
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
                document.getElementById('totalStrokes').textContent = this.totalStrokes;
                document.getElementById('currentHole').textContent = this.currentHole;
                document.getElementById('par').textContent = this.holes[this.currentHole - 1].par;
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
            new GolfGame();
        });