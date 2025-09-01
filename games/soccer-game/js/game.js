class SoccerGame {
            constructor() {
                this.canvas = document.getElementById('gameCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.canvas.width = 800;
                this.canvas.height = 500;
                
                this.gameState = 'menu';
                this.playerScore = 0;
                this.aiScore = 0;
                this.gameTime = 90;
                this.gameTimer = null;
                
                this.keys = {};
                this.mouse = { x: 0, y: 0 };
                
                this.ball = null;
                this.player = null;
                this.aiPlayer = null;
                this.fieldWidth = this.canvas.width;
                this.fieldHeight = this.canvas.height;
                this.goalWidth = 80;
                this.goalHeight = 150;
                
                this.initializeGame();
                this.bindEvents();
                this.updateUI();
            }

            initializeGame() {
                // 初始化球
                this.ball = {
                    x: this.fieldWidth / 2,
                    y: this.fieldHeight / 2,
                    radius: 8,
                    vx: 0,
                    vy: 0,
                    friction: 0.98,
                    bounce: 0.7,
                    color: '#2d3436'
                };
                
                // 初始化玩家
                this.player = {
                    x: this.fieldWidth / 4,
                    y: this.fieldHeight / 2,
                    radius: 12,
                    speed: 3,
                    color: '#74b9ff',
                    kickPower: 8,
                    hasBall: false
                };
                
                // 初始化AI球员
                this.aiPlayer = {
                    x: this.fieldWidth * 3 / 4,
                    y: this.fieldHeight / 2,
                    radius: 12,
                    speed: 2.5,
                    color: '#fd79a8',
                    kickPower: 6,
                    hasBall: false,
                    targetX: this.fieldWidth * 3 / 4,
                    targetY: this.fieldHeight / 2
                };
                
                this.gameTime = 90;
            }

            bindEvents() {
                document.getElementById('startButton').addEventListener('click', () => {
                    this.startGame();
                });
                
                document.addEventListener('keydown', (e) => {
                    this.keys[e.key.toLowerCase()] = true;
                    this.keys[e.code] = true;
                });
                
                document.addEventListener('keyup', (e) => {
                    this.keys[e.key.toLowerCase()] = false;
                    this.keys[e.code] = false;
                });
                
                this.canvas.addEventListener('mousemove', (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    this.mouse.x = e.clientX - rect.left;
                    this.mouse.y = e.clientY - rect.top;
                });
                
                // 防止页面滚动
                document.addEventListener('keydown', (e) => {
                    if(['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) > -1) {
                        e.preventDefault();
                    }
                });
            }

            startGame() {
                this.gameState = 'playing';
                this.playerScore = 0;
                this.aiScore = 0;
                this.initializeGame();
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
                        this.gameTime--;
                        this.updateUI();
                        
                        if (this.gameTime <= 0) {
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
                this.updatePlayer();
                this.updateAI();
                this.updateBall();
                this.checkCollisions();
                this.checkGoals();
            }

            updatePlayer() {
                let newX = this.player.x;
                let newY = this.player.y;
                
                // 玩家移动
                if (this.keys['w']) {
                    newY -= this.player.speed;
                }
                if (this.keys['s']) {
                    newY += this.player.speed;
                }
                if (this.keys['a']) {
                    newX -= this.player.speed;
                }
                if (this.keys['d']) {
                    newX += this.player.speed;
                }
                
                // 边界检测
                newX = Math.max(this.player.radius, Math.min(this.fieldWidth - this.player.radius, newX));
                newY = Math.max(this.player.radius, Math.min(this.fieldHeight - this.player.radius, newY));
                
                this.player.x = newX;
                this.player.y = newY;
                
                // 踢球
                if (this.keys[' '] || this.keys['space']) {
                    this.kickBall(this.player);
                    this.keys[' '] = false;
                    this.keys['space'] = false;
                }
            }

            updateAI() {
                // AI策略：追球或防守
                const distToBall = this.getDistance(this.aiPlayer, this.ball);
                const distPlayerToBall = this.getDistance(this.player, this.ball);
                
                if (distToBall < distPlayerToBall + 50) {
                    // 追球
                    this.aiPlayer.targetX = this.ball.x;
                    this.aiPlayer.targetY = this.ball.y;
                } else {
                    // 防守位置
                    this.aiPlayer.targetX = this.fieldWidth * 0.75;
                    this.aiPlayer.targetY = this.ball.y;
                }
                
                // 移动向目标
                const dx = this.aiPlayer.targetX - this.aiPlayer.x;
                const dy = this.aiPlayer.targetY - this.aiPlayer.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist > 5) {
                    this.aiPlayer.x += (dx / dist) * this.aiPlayer.speed;
                    this.aiPlayer.y += (dy / dist) * this.aiPlayer.speed;
                }
                
                // 边界检测
                this.aiPlayer.x = Math.max(this.aiPlayer.radius, Math.min(this.fieldWidth - this.aiPlayer.radius, this.aiPlayer.x));
                this.aiPlayer.y = Math.max(this.aiPlayer.radius, Math.min(this.fieldHeight - this.aiPlayer.radius, this.aiPlayer.y));
                
                // AI踢球
                if (distToBall < this.aiPlayer.radius + this.ball.radius + 5) {
                    // 计算射门方向
                    const goalX = 30;
                    const goalY = this.fieldHeight / 2;
                    const ballToGoalX = goalX - this.ball.x;
                    const ballToGoalY = goalY - this.ball.y;
                    const ballToGoalDist = Math.sqrt(ballToGoalX * ballToGoalX + ballToGoalY * ballToGoalY);
                    
                    this.ball.vx = (ballToGoalX / ballToGoalDist) * this.aiPlayer.kickPower;
                    this.ball.vy = (ballToGoalY / ballToGoalDist) * this.aiPlayer.kickPower;
                }
            }

            updateBall() {
                // 更新球的位置
                this.ball.x += this.ball.vx;
                this.ball.y += this.ball.vy;
                
                // 应用摩擦力
                this.ball.vx *= this.ball.friction;
                this.ball.vy *= this.ball.friction;
                
                // 边界碰撞（上下边界）
                if (this.ball.y - this.ball.radius <= 0 || this.ball.y + this.ball.radius >= this.fieldHeight) {
                    this.ball.vy *= -this.ball.bounce;
                    this.ball.y = Math.max(this.ball.radius, Math.min(this.fieldHeight - this.ball.radius, this.ball.y));
                }
                
                // 左右边界（球门区域特殊处理）
                if (this.ball.x - this.ball.radius <= 0) {
                    // 左边界
                    const goalTop = (this.fieldHeight - this.goalHeight) / 2;
                    const goalBottom = goalTop + this.goalHeight;
                    
                    if (this.ball.y >= goalTop && this.ball.y <= goalBottom) {
                        // 进球
                        this.aiScore++;
                        this.showMessage('电脑进球！', 'goal');
                        this.resetBall();
                    } else {
                        // 反弹
                        this.ball.vx *= -this.ball.bounce;
                        this.ball.x = this.ball.radius;
                    }
                }
                
                if (this.ball.x + this.ball.radius >= this.fieldWidth) {
                    // 右边界
                    const goalTop = (this.fieldHeight - this.goalHeight) / 2;
                    const goalBottom = goalTop + this.goalHeight;
                    
                    if (this.ball.y >= goalTop && this.ball.y <= goalBottom) {
                        // 进球
                        this.playerScore++;
                        this.showMessage('玩家进球！', 'goal');
                        this.resetBall();
                    } else {
                        // 反弹
                        this.ball.vx *= -this.ball.bounce;
                        this.ball.x = this.fieldWidth - this.ball.radius;
                    }
                }
            }

            checkCollisions() {
                // 玩家与球碰撞
                const playerDist = this.getDistance(this.player, this.ball);
                if (playerDist < this.player.radius + this.ball.radius) {
                    this.handlePlayerBallCollision(this.player);
                }
                
                // AI与球碰撞
                const aiDist = this.getDistance(this.aiPlayer, this.ball);
                if (aiDist < this.aiPlayer.radius + this.ball.radius) {
                    this.handlePlayerBallCollision(this.aiPlayer);
                }
            }

            handlePlayerBallCollision(player) {
                const dx = this.ball.x - player.x;
                const dy = this.ball.y - player.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist > 0) {
                    // 分离球和球员
                    const overlap = player.radius + this.ball.radius - dist;
                    const separateX = (dx / dist) * overlap * 0.5;
                    const separateY = (dy / dist) * overlap * 0.5;
                    
                    this.ball.x += separateX;
                    this.ball.y += separateY;
                    player.x -= separateX;
                    player.y -= separateY;
                    
                    // 传递一些动量
                    this.ball.vx += (dx / dist) * 2;
                    this.ball.vy += (dy / dist) * 2;
                }
            }

            kickBall(player) {
                const dist = this.getDistance(player, this.ball);
                if (dist < player.radius + this.ball.radius + 10) {
                    // 计算踢球方向
                    let kickX, kickY;
                    
                    if (player === this.player) {
                        // 玩家：朝鼠标方向踢球
                        kickX = this.mouse.x - this.ball.x;
                        kickY = this.mouse.y - this.ball.y;
                    } else {
                        // AI：朝球门方向踢球
                        kickX = 30 - this.ball.x;
                        kickY = (this.fieldHeight / 2) - this.ball.y;
                    }
                    
                    const kickDist = Math.sqrt(kickX * kickX + kickY * kickY);
                    if (kickDist > 0) {
                        this.ball.vx = (kickX / kickDist) * player.kickPower;
                        this.ball.vy = (kickY / kickDist) * player.kickPower;
                    }
                }
            }

            checkGoals() {
                // 这个方法已经在updateBall中处理了
            }

            resetBall() {
                this.ball.x = this.fieldWidth / 2;
                this.ball.y = this.fieldHeight / 2;
                this.ball.vx = 0;
                this.ball.vy = 0;
                
                // 重置球员位置
                this.player.x = this.fieldWidth / 4;
                this.player.y = this.fieldHeight / 2;
                this.aiPlayer.x = this.fieldWidth * 3 / 4;
                this.aiPlayer.y = this.fieldHeight / 2;
                
                this.updateUI();
                
                setTimeout(() => {
                    this.hideMessage();
                }, 2000);
            }

            endGame() {
                this.gameState = 'gameOver';
                if (this.gameTimer) {
                    clearInterval(this.gameTimer);
                }
                
                let resultText;
                if (this.playerScore > this.aiScore) {
                    resultText = `恭喜获胜！ ${this.playerScore}:${this.aiScore}`;
                } else if (this.playerScore < this.aiScore) {
                    resultText = `很遗憾失败！ ${this.playerScore}:${this.aiScore}`;
                } else {
                    resultText = `平局！ ${this.playerScore}:${this.aiScore}`;
                }
                
                this.showMessage(resultText, 'game-over');
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
                this.ctx.fillStyle = '#00b894';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // 绘制足球场
                this.drawField();
                
                // 绘制球
                this.ctx.fillStyle = this.ball.color;
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 球的白色装饰
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius - 2, 0, Math.PI * 2);
                this.ctx.stroke();
                
                // 绘制玩家
                this.drawPlayer(this.player);
                this.drawPlayer(this.aiPlayer);
            }

            drawField() {
                // 边界线
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(0, 0, this.fieldWidth, this.fieldHeight);
                
                // 中线
                this.ctx.beginPath();
                this.ctx.moveTo(this.fieldWidth / 2, 0);
                this.ctx.lineTo(this.fieldWidth / 2, this.fieldHeight);
                this.ctx.stroke();
                
                // 中圆
                this.ctx.beginPath();
                this.ctx.arc(this.fieldWidth / 2, this.fieldHeight / 2, 60, 0, Math.PI * 2);
                this.ctx.stroke();
                
                // 中心点
                this.ctx.fillStyle = 'white';
                this.ctx.beginPath();
                this.ctx.arc(this.fieldWidth / 2, this.fieldHeight / 2, 3, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 球门
                const goalTop = (this.fieldHeight - this.goalHeight) / 2;
                
                // 左球门
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                this.ctx.fillRect(0, goalTop, 30, this.goalHeight);
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(0, goalTop, 30, this.goalHeight);
                
                // 右球门
                this.ctx.fillRect(this.fieldWidth - 30, goalTop, 30, this.goalHeight);
                this.ctx.strokeRect(this.fieldWidth - 30, goalTop, 30, this.goalHeight);
                
                // 禁区
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(0, goalTop - 40, 120, this.goalHeight + 80);
                this.ctx.strokeRect(this.fieldWidth - 120, goalTop - 40, 120, this.goalHeight + 80);
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
                
                // 球员眼睛
                this.ctx.fillStyle = 'white';
                this.ctx.beginPath();
                this.ctx.arc(player.x - 4, player.y - 3, 2, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.beginPath();
                this.ctx.arc(player.x + 4, player.y - 3, 2, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.fillStyle = 'black';
                this.ctx.beginPath();
                this.ctx.arc(player.x - 4, player.y - 3, 1, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.beginPath();
                this.ctx.arc(player.x + 4, player.y - 3, 1, 0, Math.PI * 2);
                this.ctx.fill();
            }

            updateUI() {
                document.getElementById('playerScore').textContent = this.playerScore;
                document.getElementById('aiScore').textContent = this.aiScore;
                document.getElementById('time').textContent = this.gameTime;
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
            new SoccerGame();
        });