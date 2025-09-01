class TennisGame {
            constructor() {
                this.canvas = document.getElementById('gameCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.canvas.width = 900;
                this.canvas.height = 600;
                
                this.gameState = 'menu';
                this.playerScore = 0;
                this.aiScore = 0;
                this.playerSets = 0;
                this.aiSets = 0;
                this.setsToWin = 3;
                
                this.mouse = { x: this.canvas.width / 2, y: this.canvas.height - 100 };
                this.isCharging = false;
                this.chargePower = 0;
                this.maxPower = 100;
                this.chargeSpeed = 3;
                
                this.ball = null;
                this.ballTrail = [];
                this.player = null;
                this.aiPlayer = null;
                this.net = {
                    x: this.canvas.width / 2 - 5,
                    y: this.canvas.height / 2 - 30,
                    width: 10,
                    height: 60
                };
                
                this.court = {
                    width: this.canvas.width - 40,
                    height: this.canvas.height - 40,
                    x: 20,
                    y: 20
                };
                
                this.initializeGame();
                this.bindEvents();
                this.updateUI();
            }

            initializeGame() {
                // 初始化球
                this.ball = {
                    x: this.canvas.width / 2,
                    y: this.canvas.height - 150,
                    radius: 8,
                    vx: 0,
                    vy: 0,
                    gravity: 0.3,
                    bounce: 0.8,
                    airResistance: 0.995,
                    color: '#f1c40f',
                    isInPlay: false,
                    lastHit: 'serve'
                };
                
                // 初始化玩家
                this.player = {
                    x: this.canvas.width / 2,
                    y: this.canvas.height - 80,
                    radius: 15,
                    speed: 4,
                    color: '#74b9ff',
                    racketLength: 30,
                    racketAngle: 0
                };
                
                // 初始化AI球员
                this.aiPlayer = {
                    x: this.canvas.width / 2,
                    y: 80,
                    radius: 15,
                    speed: 3.5,
                    color: '#fd79a8',
                    racketLength: 30,
                    racketAngle: 0,
                    targetX: this.canvas.width / 2,
                    reactionTime: 0
                };
                
                this.ballTrail = [];
                this.serveTurn = 'player';
                this.resetForServe();
            }

            resetForServe() {
                if (this.serveTurn === 'player') {
                    this.ball.x = this.player.x;
                    this.ball.y = this.player.y - 30;
                } else {
                    this.ball.x = this.aiPlayer.x;
                    this.ball.y = this.aiPlayer.y + 30;
                }
                this.ball.vx = 0;
                this.ball.vy = 0;
                this.ball.isInPlay = false;
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
                    if (this.gameState === 'playing') {
                        this.isCharging = true;
                        this.chargePower = 0;
                    }
                });
                
                this.canvas.addEventListener('mouseup', (e) => {
                    if (this.gameState === 'playing' && this.isCharging) {
                        this.playerHitBall();
                        this.isCharging = false;
                        this.chargePower = 0;
                    }
                });
                
                this.canvas.addEventListener('mouseleave', (e) => {
                    if (this.isCharging) {
                        this.playerHitBall();
                        this.isCharging = false;
                        this.chargePower = 0;
                    }
                });
            }

            startGame() {
                this.gameState = 'playing';
                this.playerScore = 0;
                this.aiScore = 0;
                this.playerSets = 0;
                this.aiSets = 0;
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
                this.updatePlayer();
                this.updateAI();
                this.updateBall();
                this.updatePowerBar();
                this.checkCollisions();
                this.checkBounds();
            }

            updatePlayer() {
                // 玩家只能在自己的半场移动
                const minY = this.canvas.height / 2 + 10;
                const maxY = this.canvas.height - 60;
                
                this.player.x = Math.max(50, Math.min(this.canvas.width - 50, this.mouse.x));
                this.player.y = Math.max(minY, Math.min(maxY, this.mouse.y));
                
                // 更新蓄力
                if (this.isCharging) {
                    this.chargePower += this.chargeSpeed;
                    if (this.chargePower > this.maxPower) {
                        this.chargePower = this.maxPower;
                    }
                }
                
                // 计算球拍角度
                if (this.ball.isInPlay) {
                    const dx = this.ball.x - this.player.x;
                    const dy = this.ball.y - this.player.y;
                    this.player.racketAngle = Math.atan2(dy, dx);
                }
            }

            updateAI() {
                // AI只能在自己的半场移动
                const minY = 60;
                const maxY = this.canvas.height / 2 - 10;
                
                // AI预测球的位置
                if (this.ball.isInPlay && this.ball.vy < 0) {
                    // 球朝AI方向移动
                    const timeToReach = Math.abs((this.aiPlayer.y - this.ball.y) / this.ball.vy);
                    this.aiPlayer.targetX = this.ball.x + this.ball.vx * timeToReach;
                    this.aiPlayer.reactionTime = 20;
                } else if (this.ball.isInPlay && this.ball.vy > 0) {
                    // 球远离AI，保持中央位置
                    this.aiPlayer.targetX = this.canvas.width / 2;
                }
                
                // AI移动
                const dx = this.aiPlayer.targetX - this.aiPlayer.x;
                if (Math.abs(dx) > 5) {
                    const direction = dx > 0 ? 1 : -1;
                    this.aiPlayer.x += direction * this.aiPlayer.speed;
                }
                
                this.aiPlayer.x = Math.max(50, Math.min(this.canvas.width - 50, this.aiPlayer.x));
                
                // 计算AI球拍角度
                if (this.ball.isInPlay) {
                    const dx = this.ball.x - this.aiPlayer.x;
                    const dy = this.ball.y - this.aiPlayer.y;
                    this.aiPlayer.racketAngle = Math.atan2(dy, dx);
                }
                
                // AI击球
                if (this.aiPlayer.reactionTime > 0) {
                    this.aiPlayer.reactionTime--;
                    if (this.aiPlayer.reactionTime === 0) {
                        this.aiHitBall();
                    }
                }
            }

            updateBall() {
                if (!this.ball.isInPlay) return;
                
                // 保存轨迹
                this.ballTrail.push({ x: this.ball.x, y: this.ball.y });
                if (this.ballTrail.length > 15) {
                    this.ballTrail.shift();
                }
                
                // 更新位置
                this.ball.x += this.ball.vx;
                this.ball.y += this.ball.vy;
                
                // 应用重力和空气阻力
                this.ball.vy += this.ball.gravity;
                this.ball.vx *= this.ball.airResistance;
                this.ball.vy *= this.ball.airResistance;
                
                // 地面反弹
                if (this.ball.y + this.ball.radius > this.canvas.height - 20) {
                    this.ball.y = this.canvas.height - 20 - this.ball.radius;
                    this.ball.vy *= -this.ball.bounce;
                    
                    // 检查是否在有效区域内
                    this.checkPointScored();
                }
            }

            playerHitBall() {
                const distance = this.getDistance(this.player, this.ball);
                if (distance < this.player.radius + this.ball.radius + this.player.racketLength) {
                    this.hitBall(this.player, 'player');
                }
            }

            aiHitBall() {
                const distance = this.getDistance(this.aiPlayer, this.ball);
                if (distance < this.aiPlayer.radius + this.ball.radius + this.aiPlayer.racketLength) {
                    this.hitBall(this.aiPlayer, 'ai');
                }
            }

            hitBall(player, playerType) {
                // 计算击球方向
                let targetX, targetY;
                
                if (playerType === 'player') {
                    // 玩家击球：朝对方半场
                    const power = this.chargePower / 100;
                    const baseVelocity = 8 + power * 6;
                    const angle = Math.random() * Math.PI / 3 - Math.PI / 6; // ±30度随机
                    
                    this.ball.vx = Math.cos(angle) * baseVelocity * (Math.random() > 0.5 ? 1 : -1);
                    this.ball.vy = -Math.abs(Math.sin(angle)) * baseVelocity - 2;
                } else {
                    // AI击球：智能选择目标
                    const corners = [
                        { x: this.canvas.width * 0.2, y: this.canvas.height * 0.8 },
                        { x: this.canvas.width * 0.8, y: this.canvas.height * 0.8 }
                    ];
                    const target = corners[Math.floor(Math.random() * corners.length)];
                    
                    const dx = target.x - this.ball.x;
                    const dy = target.y - this.ball.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const velocity = 10;
                    
                    this.ball.vx = (dx / distance) * velocity;
                    this.ball.vy = (dy / distance) * velocity + 2;
                }
                
                this.ball.isInPlay = true;
                this.ball.lastHit = playerType;
                
                // 重置AI反应时间
                this.aiPlayer.reactionTime = 0;
            }

            checkCollisions() {
                // 网子碰撞
                if (this.ball.x >= this.net.x - this.ball.radius && 
                    this.ball.x <= this.net.x + this.net.width + this.ball.radius &&
                    this.ball.y >= this.net.y && 
                    this.ball.y <= this.net.y + this.net.height) {
                    
                    // 撞网
                    this.ball.vx *= -0.5;
                    this.ball.vy *= 0.5;
                    this.checkPointScored();
                }
                
                // 边界碰撞
                if (this.ball.x - this.ball.radius <= this.court.x || 
                    this.ball.x + this.ball.radius >= this.court.x + this.court.width) {
                    this.ball.vx *= -0.8;
                    this.ball.x = Math.max(this.court.x + this.ball.radius, 
                                          Math.min(this.court.x + this.court.width - this.ball.radius, this.ball.x));
                }
            }

            checkBounds() {
                // 球出界检查
                if (this.ball.y > this.canvas.height + 50 || 
                    this.ball.x < -50 || 
                    this.ball.x > this.canvas.width + 50) {
                    this.checkPointScored();
                }
            }

            checkPointScored() {
                if (!this.ball.isInPlay) return;
                
                let winner = '';
                
                // 判断得分逻辑
                if (this.ball.y > this.canvas.height / 2) {
                    // 球在玩家半场
                    if (this.ball.lastHit === 'ai') {
                        winner = 'ai';
                    } else {
                        winner = 'player';
                    }
                } else {
                    // 球在AI半场
                    if (this.ball.lastHit === 'player') {
                        winner = 'player';
                    } else {
                        winner = 'ai';
                    }
                }
                
                this.scorePoint(winner);
            }

            scorePoint(winner) {
                if (winner === 'player') {
                    this.playerScore++;
                    this.showMessage('玩家得分！', 'point');
                } else {
                    this.aiScore++;
                    this.showMessage('电脑得分！', 'point');
                }
                
                this.updateUI();
                
                // 检查是否赢得一局
                if (this.playerScore >= 6 && this.playerScore - this.aiScore >= 2) {
                    this.playerSets++;
                    this.showMessage('玩家赢得一盘！', 'game-won');
                    this.resetSet();
                } else if (this.aiScore >= 6 && this.aiScore - this.playerScore >= 2) {
                    this.aiSets++;
                    this.showMessage('电脑赢得一盘！', 'game-won');
                    this.resetSet();
                } else {
                    // 继续比赛
                    this.serveTurn = winner === 'player' ? 'player' : 'ai';
                    setTimeout(() => {
                        this.resetForServe();
                        this.hideMessage();
                    }, 2000);
                }
                
                // 检查是否赢得比赛
                if (this.playerSets >= this.setsToWin) {
                    this.endGame('player');
                } else if (this.aiSets >= this.setsToWin) {
                    this.endGame('ai');
                }
            }

            resetSet() {
                this.playerScore = 0;
                this.aiScore = 0;
                this.serveTurn = 'player';
                
                setTimeout(() => {
                    this.resetForServe();
                    this.hideMessage();
                }, 3000);
            }

            endGame(winner) {
                this.gameState = 'gameOver';
                
                let resultText;
                if (winner === 'player') {
                    resultText = `🎉 恭喜获胜！盘数 ${this.playerSets}:${this.aiSets}`;
                } else {
                    resultText = `😔 比赛失败！盘数 ${this.playerSets}:${this.aiSets}`;
                }
                
                this.showMessage(resultText, 'match-won');
                document.getElementById('startButton').style.display = 'block';
                document.getElementById('startButton').textContent = '重新开始';
            }

            updatePowerBar() {
                const powerFill = document.getElementById('powerFill');
                const percentage = (this.chargePower / this.maxPower) * 100;
                powerFill.style.width = percentage + '%';
            }

            getDistance(obj1, obj2) {
                const dx = obj1.x - obj2.x;
                const dy = obj1.y - obj2.y;
                return Math.sqrt(dx * dx + dy * dy);
            }

            draw() {
                // 清空画布
                this.ctx.fillStyle = '#27ae60';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // 绘制球场
                this.drawCourt();
                
                // 绘制网子
                this.drawNet();
                
                // 绘制球员
                this.drawPlayer(this.player);
                this.drawPlayer(this.aiPlayer);
                
                // 绘制球的轨迹
                this.drawBallTrail();
                
                // 绘制球
                this.drawBall();
                
                // 绘制蓄力指示器
                if (this.isCharging) {
                    this.drawChargeIndicator();
                }
            }

            drawCourt() {
                // 球场边界
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(this.court.x, this.court.y, this.court.width, this.court.height);
                
                // 中线
                this.ctx.beginPath();
                this.ctx.moveTo(this.court.x, this.canvas.height / 2);
                this.ctx.lineTo(this.court.x + this.court.width, this.canvas.height / 2);
                this.ctx.stroke();
                
                // 发球线
                const serviceLineY1 = this.canvas.height / 4;
                const serviceLineY2 = this.canvas.height * 3 / 4;
                
                this.ctx.beginPath();
                this.ctx.moveTo(this.court.x, serviceLineY1);
                this.ctx.lineTo(this.court.x + this.court.width, serviceLineY1);
                this.ctx.moveTo(this.court.x, serviceLineY2);
                this.ctx.lineTo(this.court.x + this.court.width, serviceLineY2);
                this.ctx.stroke();
                
                // 中央发球线
                this.ctx.beginPath();
                this.ctx.moveTo(this.canvas.width / 2, serviceLineY1);
                this.ctx.lineTo(this.canvas.width / 2, serviceLineY2);
                this.ctx.stroke();
            }

            drawNet() {
                this.ctx.fillStyle = '#2d3436';
                this.ctx.fillRect(this.net.x, this.net.y, this.net.width, this.net.height);
                
                // 网子纹理
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 1;
                for (let i = 0; i < 6; i++) {
                    const y = this.net.y + (this.net.height / 6) * i;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.net.x, y);
                    this.ctx.lineTo(this.net.x + this.net.width, y);
                    this.ctx.stroke();
                }
            }

            drawPlayer(player) {
                // 球员身体
                this.ctx.fillStyle = player.color;
                this.ctx.beginPath();
                this.ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 球员边框
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
                this.ctx.stroke();
                
                // 球拍
                const racketX = player.x + Math.cos(player.racketAngle) * player.racketLength;
                const racketY = player.y + Math.sin(player.racketAngle) * player.racketLength;
                
                this.ctx.strokeStyle = '#8b4513';
                this.ctx.lineWidth = 4;
                this.ctx.beginPath();
                this.ctx.moveTo(player.x, player.y);
                this.ctx.lineTo(racketX, racketY);
                this.ctx.stroke();
                
                // 球拍网面
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(racketX, racketY, 8, 0, Math.PI * 2);
                this.ctx.stroke();
            }

            drawBallTrail() {
                for (let i = 0; i < this.ballTrail.length; i++) {
                    const alpha = (i + 1) / this.ballTrail.length * 0.6;
                    const size = (i + 1) / this.ballTrail.length * this.ball.radius;
                    
                    this.ctx.fillStyle = `rgba(241, 196, 15, ${alpha})`;
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
                
                // 网球的线条
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius * 0.8, Math.PI / 4, Math.PI * 3 / 4);
                this.ctx.stroke();
                
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius * 0.8, Math.PI * 5 / 4, Math.PI * 7 / 4);
                this.ctx.stroke();
            }

            drawChargeIndicator() {
                const centerX = this.player.x;
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
                document.getElementById('playerScore').textContent = this.playerScore;
                document.getElementById('aiScore').textContent = this.aiScore;
                document.getElementById('playerSets').textContent = this.playerSets;
                document.getElementById('aiSets').textContent = this.aiSets;
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
            new TennisGame();
        });