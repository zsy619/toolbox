class PingPongGame {
            constructor() {
                this.canvas = document.getElementById('gameCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.canvas.width = 800;
                this.canvas.height = 400;
                
                this.gameState = 'menu';
                this.playerScore = 0;
                this.aiScore = 0;
                this.winningScore = 11;
                
                this.keys = {};
                this.mouse = { y: this.canvas.height / 2 };
                
                this.ball = null;
                this.playerPaddle = null;
                this.aiPaddle = null;
                this.ballTrail = [];
                
                this.difficulty = 'medium';
                this.initializeGame();
                this.bindEvents();
                this.updateUI();
            }

            initializeGame() {
                // 初始化球
                this.ball = {
                    x: this.canvas.width / 2,
                    y: this.canvas.height / 2,
                    radius: 8,
                    vx: 5,
                    vy: 3,
                    speed: 5,
                    maxSpeed: 12,
                    color: '#f39c12'
                };
                
                // 初始化玩家球拍
                this.playerPaddle = {
                    x: 20,
                    y: this.canvas.height / 2 - 40,
                    width: 10,
                    height: 80,
                    speed: 6,
                    color: '#74b9ff'
                };
                
                // 初始化AI球拍
                this.aiPaddle = {
                    x: this.canvas.width - 30,
                    y: this.canvas.height / 2 - 40,
                    width: 10,
                    height: 80,
                    speed: this.getAISpeed(),
                    color: '#fd79a8',
                    targetY: this.canvas.height / 2
                };
                
                this.ballTrail = [];
            }

            getAISpeed() {
                const speeds = {
                    'easy': 3,
                    'medium': 4.5,
                    'hard': 6
                };
                return speeds[this.difficulty] || 4.5;
            }

            bindEvents() {
                document.getElementById('startButton').addEventListener('click', () => {
                    this.startGame();
                });
                
                document.getElementById('difficulty').addEventListener('change', (e) => {
                    this.difficulty = e.target.value;
                    this.aiPaddle.speed = this.getAISpeed();
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
                    this.mouse.y = e.clientY - rect.top;
                });
                
                // 防止页面滚动
                document.addEventListener('keydown', (e) => {
                    if(['ArrowUp', 'ArrowDown'].indexOf(e.code) > -1) {
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
                this.updatePaddles();
                this.updateBall();
                this.checkCollisions();
                this.checkScore();
            }

            updatePaddles() {
                // 玩家球拍控制
                let playerTargetY = this.playerPaddle.y;
                
                // 键盘控制
                if (this.keys['w'] || this.keys['arrowup']) {
                    playerTargetY -= this.playerPaddle.speed;
                }
                if (this.keys['s'] || this.keys['arrowdown']) {
                    playerTargetY += this.playerPaddle.speed;
                }
                
                // 鼠标控制（更直观）
                const mouseTargetY = this.mouse.y - this.playerPaddle.height / 2;
                if (Math.abs(mouseTargetY - this.playerPaddle.y) > 5) {
                    const direction = mouseTargetY > this.playerPaddle.y ? 1 : -1;
                    playerTargetY = this.playerPaddle.y + direction * this.playerPaddle.speed;
                }
                
                // 边界检查
                this.playerPaddle.y = Math.max(0, Math.min(this.canvas.height - this.playerPaddle.height, playerTargetY));
                
                // AI球拍智能控制
                this.updateAI();
            }

            updateAI() {
                const ballCenterY = this.ball.y;
                const paddleCenterY = this.aiPaddle.y + this.aiPaddle.height / 2;
                
                // 预测球的位置
                let predictedY = ballCenterY;
                if (this.ball.vx > 0) {
                    const timeToReach = (this.aiPaddle.x - this.ball.x) / this.ball.vx;
                    predictedY = this.ball.y + this.ball.vy * timeToReach;
                    
                    // 考虑边界反弹
                    if (predictedY < 0 || predictedY > this.canvas.height) {
                        predictedY = predictedY < 0 ? -predictedY : 2 * this.canvas.height - predictedY;
                    }
                }
                
                this.aiPaddle.targetY = predictedY - this.aiPaddle.height / 2;
                
                // 根据难度添加一些随机性
                if (this.difficulty === 'easy') {
                    this.aiPaddle.targetY += (Math.random() - 0.5) * 40;
                } else if (this.difficulty === 'medium') {
                    this.aiPaddle.targetY += (Math.random() - 0.5) * 20;
                }
                
                // 移动AI球拍
                const diff = this.aiPaddle.targetY - this.aiPaddle.y;
                if (Math.abs(diff) > 2) {
                    const direction = diff > 0 ? 1 : -1;
                    this.aiPaddle.y += direction * this.aiPaddle.speed;
                }
                
                // 边界检查
                this.aiPaddle.y = Math.max(0, Math.min(this.canvas.height - this.aiPaddle.height, this.aiPaddle.y));
            }

            updateBall() {
                // 保存轨迹
                this.ballTrail.push({ x: this.ball.x, y: this.ball.y });
                if (this.ballTrail.length > 10) {
                    this.ballTrail.shift();
                }
                
                // 更新位置
                this.ball.x += this.ball.vx;
                this.ball.y += this.ball.vy;
                
                // 上下边界反弹
                if (this.ball.y - this.ball.radius <= 0 || this.ball.y + this.ball.radius >= this.canvas.height) {
                    this.ball.vy *= -1;
                    this.ball.y = Math.max(this.ball.radius, Math.min(this.canvas.height - this.ball.radius, this.ball.y));
                    this.playBounceSound();
                }
            }

            checkCollisions() {
                // 玩家球拍碰撞
                if (this.ball.vx < 0 && 
                    this.ball.x - this.ball.radius <= this.playerPaddle.x + this.playerPaddle.width &&
                    this.ball.x - this.ball.radius >= this.playerPaddle.x &&
                    this.ball.y >= this.playerPaddle.y &&
                    this.ball.y <= this.playerPaddle.y + this.playerPaddle.height) {
                    
                    this.handlePaddleCollision(this.playerPaddle, 'player');
                }
                
                // AI球拍碰撞
                if (this.ball.vx > 0 && 
                    this.ball.x + this.ball.radius >= this.aiPaddle.x &&
                    this.ball.x + this.ball.radius <= this.aiPaddle.x + this.aiPaddle.width &&
                    this.ball.y >= this.aiPaddle.y &&
                    this.ball.y <= this.aiPaddle.y + this.aiPaddle.height) {
                    
                    this.handlePaddleCollision(this.aiPaddle, 'ai');
                }
            }

            handlePaddleCollision(paddle, player) {
                // 反转水平速度
                this.ball.vx *= -1;
                
                // 根据击中位置调整垂直速度
                const paddleCenterY = paddle.y + paddle.height / 2;
                const relativeIntersectY = (this.ball.y - paddleCenterY) / (paddle.height / 2);
                const maxBounceAngle = Math.PI / 4; // 45度
                const bounceAngle = relativeIntersectY * maxBounceAngle;
                
                const speed = Math.min(this.ball.maxSpeed, Math.sqrt(this.ball.vx * this.ball.vx + this.ball.vy * this.ball.vy) + 0.5);
                this.ball.vx = (player === 'player' ? 1 : -1) * speed * Math.cos(bounceAngle);
                this.ball.vy = speed * Math.sin(bounceAngle);
                
                // 防止球卡在球拍里
                if (player === 'player') {
                    this.ball.x = paddle.x + paddle.width + this.ball.radius;
                } else {
                    this.ball.x = paddle.x - this.ball.radius;
                }
                
                this.playPaddleSound();
            }

            checkScore() {
                // 左边界（AI得分）
                if (this.ball.x < 0) {
                    this.aiScore++;
                    this.showMessage('电脑得分！', 'score');
                    this.resetBall('ai');
                }
                
                // 右边界（玩家得分）
                if (this.ball.x > this.canvas.width) {
                    this.playerScore++;
                    this.showMessage('玩家得分！', 'score');
                    this.resetBall('player');
                }
                
                this.updateUI();
                
                // 检查游戏结束
                if (this.playerScore >= this.winningScore || this.aiScore >= this.winningScore) {
                    this.endGame();
                }
            }

            resetBall(scorer) {
                this.ball.x = this.canvas.width / 2;
                this.ball.y = this.canvas.height / 2;
                this.ball.vx = scorer === 'player' ? -5 : 5;
                this.ball.vy = (Math.random() - 0.5) * 6;
                this.ballTrail = [];
                
                setTimeout(() => {
                    this.hideMessage();
                }, 1500);
            }

            endGame() {
                this.gameState = 'gameOver';
                
                let resultText;
                if (this.playerScore >= this.winningScore) {
                    resultText = `🎉 恭喜获胜！ ${this.playerScore}:${this.aiScore}`;
                } else {
                    resultText = `😔 游戏失败！ ${this.playerScore}:${this.aiScore}`;
                }
                
                this.showMessage(resultText, 'game-over');
                document.getElementById('startButton').style.display = 'block';
                document.getElementById('startButton').textContent = '重新开始';
            }

            draw() {
                // 清空画布
                this.ctx.fillStyle = '#00b894';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // 绘制中线
                this.drawCenterLine();
                
                // 绘制球拍
                this.drawPaddle(this.playerPaddle);
                this.drawPaddle(this.aiPaddle);
                
                // 绘制球的轨迹
                this.drawBallTrail();
                
                // 绘制球
                this.drawBall();
            }

            drawCenterLine() {
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([10, 10]);
                
                this.ctx.beginPath();
                this.ctx.moveTo(this.canvas.width / 2, 0);
                this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
                this.ctx.stroke();
                
                this.ctx.setLineDash([]);
            }

            drawPaddle(paddle) {
                // 球拍主体
                this.ctx.fillStyle = paddle.color;
                this.ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
                
                // 球拍边框
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
                
                // 球拍纹理
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.lineWidth = 1;
                for (let i = 1; i < 4; i++) {
                    const y = paddle.y + (paddle.height / 4) * i;
                    this.ctx.beginPath();
                    this.ctx.moveTo(paddle.x + 2, y);
                    this.ctx.lineTo(paddle.x + paddle.width - 2, y);
                    this.ctx.stroke();
                }
            }

            drawBallTrail() {
                for (let i = 0; i < this.ballTrail.length; i++) {
                    const alpha = (i + 1) / this.ballTrail.length * 0.5;
                    const size = (i + 1) / this.ballTrail.length * this.ball.radius;
                    
                    this.ctx.fillStyle = `rgba(243, 156, 18, ${alpha})`;
                    this.ctx.beginPath();
                    this.ctx.arc(this.ballTrail[i].x, this.ballTrail[i].y, size, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }

            drawBall() {
                // 球的阴影
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x + 2, this.ball.y + 2, this.ball.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 球的主体
                this.ctx.fillStyle = this.ball.color;
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 球的高光
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x - 2, this.ball.y - 2, this.ball.radius * 0.3, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 球的边框
                this.ctx.strokeStyle = '#e67e22';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
                this.ctx.stroke();
            }

            playBounceSound() {
                // 简单的音效模拟
                console.log('Bounce!');
            }

            playPaddleSound() {
                // 简单的音效模拟
                console.log('Paddle hit!');
            }

            updateUI() {
                document.getElementById('playerScore').textContent = this.playerScore;
                document.getElementById('aiScore').textContent = this.aiScore;
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
            new PingPongGame();
        });