class BilliardsGame {
            constructor() {
                this.canvas = document.getElementById('gameCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.canvas.width = 900;
                this.canvas.height = 500;
                
                this.gameState = 'menu';
                this.gameMode = '8ball';
                this.currentPlayer = 'player'; // 'player' or 'ai'
                this.playerScore = 0;
                this.aiScore = 0;
                this.playerBalls = []; // 大球(9-15) 或 小球(1-7)
                this.aiBalls = [];
                
                this.mouse = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
                this.isCharging = false;
                this.chargePower = 0;
                this.maxPower = 100;
                this.chargeSpeed = 2;
                
                this.cueBall = null;
                this.balls = [];
                this.pockets = [];
                this.ballsMoving = false;
                this.ballTrails = [];
                
                this.table = {
                    x: 50,
                    y: 50,
                    width: this.canvas.width - 100,
                    height: this.canvas.height - 100
                };
                
                this.initializeGame();
                this.bindEvents();
                this.updateUI();
            }

            initializeGame() {
                this.setupTable();
                this.setupBalls();
                this.ballsMoving = false;
                this.ballTrails = [];
            }

            setupTable() {
                // 设置球袋位置
                this.pockets = [
                    { x: this.table.x, y: this.table.y, radius: 25 }, // 左上
                    { x: this.table.x + this.table.width / 2, y: this.table.y, radius: 20 }, // 中上
                    { x: this.table.x + this.table.width, y: this.table.y, radius: 25 }, // 右上
                    { x: this.table.x, y: this.table.y + this.table.height, radius: 25 }, // 左下
                    { x: this.table.x + this.table.width / 2, y: this.table.y + this.table.height, radius: 20 }, // 中下
                    { x: this.table.x + this.table.width, y: this.table.y + this.table.height, radius: 25 } // 右下
                ];
            }

            setupBalls() {
                this.balls = [];
                
                // 主球(白球)
                this.cueBall = {
                    id: 0,
                    x: this.table.x + this.table.width * 0.25,
                    y: this.table.y + this.table.height / 2,
                    vx: 0,
                    vy: 0,
                    radius: 12,
                    color: '#ffffff',
                    type: 'cue',
                    isPotted: false
                };
                
                if (this.gameMode === '8ball') {
                    this.setup8Ball();
                } else if (this.gameMode === '9ball') {
                    this.setup9Ball();
                } else if (this.gameMode === 'snooker') {
                    this.setupSnooker();
                }
            }

            setup8Ball() {
                const colors = [
                    '#ffff00', '#0000ff', '#ff0000', '#800080',  // 1-4
                    '#ff8c00', '#008000', '#8b0000', '#000000',  // 5-8 (8是黑球)
                    '#ffff00', '#0000ff', '#ff0000', '#800080',  // 9-12
                    '#ff8c00', '#008000', '#8b0000'              // 13-15
                ];
                
                const startX = this.table.x + this.table.width * 0.7;
                const startY = this.table.y + this.table.height / 2;
                const spacing = 25;
                
                // 三角形排列
                let ballId = 1;
                for (let row = 0; row < 5; row++) {
                    const ballsInRow = row + 1;
                    const rowStartY = startY - (ballsInRow - 1) * spacing / 2;
                    
                    for (let col = 0; col < ballsInRow; col++) {
                        if (ballId <= 15) {
                            this.balls.push({
                                id: ballId,
                                x: startX + row * spacing,
                                y: rowStartY + col * spacing,
                                vx: 0,
                                vy: 0,
                                radius: 12,
                                color: colors[ballId - 1],
                                type: ballId === 8 ? 'black' : (ballId < 8 ? 'solid' : 'stripe'),
                                number: ballId,
                                isPotted: false
                            });
                            ballId++;
                        }
                    }
                }
            }

            setup9Ball() {
                const colors = [
                    '#ffff00', '#0000ff', '#ff0000', '#800080',
                    '#ff8c00', '#008000', '#8b0000', '#000000', '#ffff00'
                ];
                
                const startX = this.table.x + this.table.width * 0.7;
                const startY = this.table.y + this.table.height / 2;
                const spacing = 25;
                
                // 菱形排列
                const positions = [
                    {x: 0, y: 0}, // 1号球在最前
                    {x: spacing, y: -spacing/2}, {x: spacing, y: spacing/2}, // 第二排
                    {x: spacing*2, y: -spacing}, {x: spacing*2, y: 0}, {x: spacing*2, y: spacing}, // 第三排
                    {x: spacing*3, y: -spacing/2}, {x: spacing*3, y: spacing/2}, // 第四排
                    {x: spacing*4, y: 0} // 9号球在最后
                ];
                
                for (let i = 0; i < 9; i++) {
                    this.balls.push({
                        id: i + 1,
                        x: startX + positions[i].x,
                        y: startY + positions[i].y,
                        vx: 0,
                        vy: 0,
                        radius: 12,
                        color: colors[i],
                        type: 'numbered',
                        number: i + 1,
                        isPotted: false
                    });
                }
            }

            setupSnooker() {
                // 简化版斯诺克：6个红球 + 6个彩球
                const redBalls = 6;
                const startX = this.table.x + this.table.width * 0.6;
                const startY = this.table.y + this.table.height / 2;
                
                // 红球
                for (let i = 0; i < redBalls; i++) {
                    const angle = (Math.PI * 2 / redBalls) * i;
                    this.balls.push({
                        id: i + 1,
                        x: startX + Math.cos(angle) * 40,
                        y: startY + Math.sin(angle) * 40,
                        vx: 0,
                        vy: 0,
                        radius: 12,
                        color: '#ff0000',
                        type: 'red',
                        points: 1,
                        isPotted: false
                    });
                }
                
                // 彩球
                const colorBalls = [
                    {color: '#ffff00', points: 2, name: '黄球'},
                    {color: '#008000', points: 3, name: '绿球'},
                    {color: '#8b4513', points: 4, name: '棕球'},
                    {color: '#0000ff', points: 5, name: '蓝球'},
                    {color: '#ff69b4', points: 6, name: '粉球'},
                    {color: '#000000', points: 7, name: '黑球'}
                ];
                
                colorBalls.forEach((ball, i) => {
                    this.balls.push({
                        id: redBalls + i + 1,
                        x: this.table.x + this.table.width * 0.8,
                        y: this.table.y + this.table.height * (0.2 + i * 0.12),
                        vx: 0,
                        vy: 0,
                        radius: 12,
                        color: ball.color,
                        type: 'color',
                        points: ball.points,
                        name: ball.name,
                        isPotted: false
                    });
                });
            }

            bindEvents() {
                document.getElementById('startButton').addEventListener('click', () => {
                    this.startGame();
                });
                
                // 游戏模式选择
                document.querySelectorAll('.mode-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        if (this.gameState === 'menu') {
                            this.selectMode(e.target.dataset.mode);
                        }
                    });
                });
                
                this.canvas.addEventListener('mousemove', (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    this.mouse.x = e.clientX - rect.left;
                    this.mouse.y = e.clientY - rect.top;
                });
                
                this.canvas.addEventListener('mousedown', (e) => {
                    if (this.gameState === 'playing' && !this.ballsMoving && this.currentPlayer === 'player') {
                        this.isCharging = true;
                        this.chargePower = 0;
                    }
                });
                
                this.canvas.addEventListener('mouseup', (e) => {
                    if (this.gameState === 'playing' && this.isCharging && this.currentPlayer === 'player') {
                        this.hitCueBall();
                        this.isCharging = false;
                        this.chargePower = 0;
                    }
                });
                
                this.canvas.addEventListener('mouseleave', (e) => {
                    if (this.isCharging) {
                        this.hitCueBall();
                        this.isCharging = false;
                        this.chargePower = 0;
                    }
                });
            }

            selectMode(mode) {
                this.gameMode = mode;
                document.querySelectorAll('.mode-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
                this.initializeGame();
                this.updateUI();
            }

            startGame() {
                this.gameState = 'playing';
                this.currentPlayer = 'player';
                this.playerScore = 0;
                this.aiScore = 0;
                this.playerBalls = [];
                this.aiBalls = [];
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
                this.updateBalls();
                this.updatePowerBar();
                this.checkCollisions();
                this.checkPockets();
                this.checkGameEnd();
                
                if (this.currentPlayer === 'ai' && !this.ballsMoving) {
                    setTimeout(() => this.aiMove(), 1000);
                }
            }

            updateBalls() {
                let anyBallMoving = false;
                
                // 更新主球
                if (Math.abs(this.cueBall.vx) > 0.1 || Math.abs(this.cueBall.vy) > 0.1) {
                    anyBallMoving = true;
                    this.cueBall.x += this.cueBall.vx;
                    this.cueBall.y += this.cueBall.vy;
                    
                    // 摩擦力
                    this.cueBall.vx *= 0.98;
                    this.cueBall.vy *= 0.98;
                    
                    // 边界反弹
                    this.checkWallCollision(this.cueBall);
                } else {
                    this.cueBall.vx = 0;
                    this.cueBall.vy = 0;
                }
                
                // 更新其他球
                this.balls.forEach(ball => {
                    if (!ball.isPotted && (Math.abs(ball.vx) > 0.1 || Math.abs(ball.vy) > 0.1)) {
                        anyBallMoving = true;
                        ball.x += ball.vx;
                        ball.y += ball.vy;
                        
                        ball.vx *= 0.98;
                        ball.vy *= 0.98;
                        
                        this.checkWallCollision(ball);
                    } else {
                        ball.vx = 0;
                        ball.vy = 0;
                    }
                });
                
                this.ballsMoving = anyBallMoving;
            }

            checkWallCollision(ball) {
                if (ball.x - ball.radius <= this.table.x) {
                    ball.x = this.table.x + ball.radius;
                    ball.vx *= -0.7;
                }
                if (ball.x + ball.radius >= this.table.x + this.table.width) {
                    ball.x = this.table.x + this.table.width - ball.radius;
                    ball.vx *= -0.7;
                }
                if (ball.y - ball.radius <= this.table.y) {
                    ball.y = this.table.y + ball.radius;
                    ball.vy *= -0.7;
                }
                if (ball.y + ball.radius >= this.table.y + this.table.height) {
                    ball.y = this.table.y + this.table.height - ball.radius;
                    ball.vy *= -0.7;
                }
            }

            checkCollisions() {
                // 主球与其他球的碰撞
                this.balls.forEach(ball => {
                    if (!ball.isPotted) {
                        this.checkBallCollision(this.cueBall, ball);
                    }
                });
                
                // 球与球之间的碰撞
                for (let i = 0; i < this.balls.length; i++) {
                    if (this.balls[i].isPotted) continue;
                    for (let j = i + 1; j < this.balls.length; j++) {
                        if (this.balls[j].isPotted) continue;
                        this.checkBallCollision(this.balls[i], this.balls[j]);
                    }
                }
            }

            checkBallCollision(ball1, ball2) {
                const dx = ball2.x - ball1.x;
                const dy = ball2.y - ball1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < ball1.radius + ball2.radius) {
                    // 碰撞处理
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);
                    
                    // 分离球
                    const overlap = ball1.radius + ball2.radius - distance;
                    ball1.x -= overlap * cos * 0.5;
                    ball1.y -= overlap * sin * 0.5;
                    ball2.x += overlap * cos * 0.5;
                    ball2.y += overlap * sin * 0.5;
                    
                    // 速度交换
                    const v1x = ball1.vx * cos + ball1.vy * sin;
                    const v1y = ball1.vy * cos - ball1.vx * sin;
                    const v2x = ball2.vx * cos + ball2.vy * sin;
                    const v2y = ball2.vy * cos - ball2.vx * sin;
                    
                    const newV1x = v2x * 0.8;
                    const newV2x = v1x * 0.8;
                    
                    ball1.vx = newV1x * cos - v1y * sin;
                    ball1.vy = v1y * cos + newV1x * sin;
                    ball2.vx = newV2x * cos - v2y * sin;
                    ball2.vy = v2y * cos + newV2x * sin;
                }
            }

            checkPockets() {
                this.pockets.forEach(pocket => {
                    // 检查主球
                    if (!this.cueBall.isPotted) {
                        const distance = Math.sqrt(
                            Math.pow(this.cueBall.x - pocket.x, 2) + 
                            Math.pow(this.cueBall.y - pocket.y, 2)
                        );
                        
                        if (distance < pocket.radius) {
                            this.handleCueBallPotted();
                        }
                    }
                    
                    // 检查其他球
                    this.balls.forEach(ball => {
                        if (!ball.isPotted) {
                            const distance = Math.sqrt(
                                Math.pow(ball.x - pocket.x, 2) + 
                                Math.pow(ball.y - pocket.y, 2)
                            );
                            
                            if (distance < pocket.radius) {
                                this.handleBallPotted(ball);
                            }
                        }
                    });
                });
            }

            handleCueBallPotted() {
                this.cueBall.isPotted = true;
                this.showMessage('主球落袋！犯规！', 'foul');
                
                // 重新放置主球
                setTimeout(() => {
                    this.cueBall.x = this.table.x + this.table.width * 0.25;
                    this.cueBall.y = this.table.y + this.table.height / 2;
                    this.cueBall.vx = 0;
                    this.cueBall.vy = 0;
                    this.cueBall.isPotted = false;
                    this.switchPlayer();
                    this.hideMessage();
                }, 2000);
            }

            handleBallPotted(ball) {
                ball.isPotted = true;
                
                if (this.gameMode === '8ball') {
                    this.handle8BallPot(ball);
                } else if (this.gameMode === '9ball') {
                    this.handle9BallPot(ball);
                } else if (this.gameMode === 'snooker') {
                    this.handleSnookerPot(ball);
                }
            }

            handle8BallPot(ball) {
                if (ball.number === 8) {
                    // 8号球特殊处理
                    if (this.currentPlayer === 'player') {
                        if (this.playerBalls.length === 0 || this.playerBalls.every(id => 
                            this.balls.find(b => b.id === id)?.isPotted)) {
                            this.showMessage('🎉 玩家获胜！8号球进袋！', 'game-over');
                            this.endGame('player');
                        } else {
                            this.showMessage('😔 游戏失败！8号球过早进袋！', 'game-over');
                            this.endGame('ai');
                        }
                    } else {
                        this.endGame('player');
                    }
                } else {
                    // 分配球组
                    if (this.playerBalls.length === 0 && this.aiBalls.length === 0) {
                        if (this.currentPlayer === 'player') {
                            this.playerBalls = ball.type === 'solid' ? 
                                [1,2,3,4,5,6,7] : [9,10,11,12,13,14,15];
                            this.aiBalls = ball.type === 'solid' ? 
                                [9,10,11,12,13,14,15] : [1,2,3,4,5,6,7];
                        }
                    }
                    
                    if (this.currentPlayer === 'player') {
                        this.playerScore++;
                        this.showMessage('好球！继续击球！', 'pot');
                    } else {
                        this.aiScore++;
                        this.showMessage('电脑进球！', 'pot');
                    }
                    
                    setTimeout(() => this.hideMessage(), 1500);
                }
            }

            handle9BallPot(ball) {
                if (ball.number === 9) {
                    this.showMessage(`🎉 ${this.currentPlayer === 'player' ? '玩家' : '电脑'}获胜！9号球进袋！`, 'game-over');
                    this.endGame(this.currentPlayer);
                } else {
                    if (this.currentPlayer === 'player') {
                        this.playerScore++;
                        this.showMessage('好球！继续击球！', 'pot');
                    } else {
                        this.aiScore++;
                        this.showMessage('电脑进球！', 'pot');
                    }
                    setTimeout(() => this.hideMessage(), 1500);
                }
            }

            handleSnookerPot(ball) {
                if (this.currentPlayer === 'player') {
                    this.playerScore += ball.points || 1;
                    this.showMessage(`进球！+${ball.points || 1}分`, 'pot');
                } else {
                    this.aiScore += ball.points || 1;
                    this.showMessage(`电脑进球！+${ball.points || 1}分`, 'pot');
                }
                setTimeout(() => this.hideMessage(), 1500);
            }

            switchPlayer() {
                this.currentPlayer = this.currentPlayer === 'player' ? 'ai' : 'player';
                this.updateUI();
            }

            aiMove() {
                if (this.currentPlayer !== 'ai' || this.ballsMoving) return;
                
                // 简单AI：随机选择目标球和力度
                const targetBalls = this.balls.filter(ball => !ball.isPotted);
                if (targetBalls.length === 0) return;
                
                const target = targetBalls[Math.floor(Math.random() * targetBalls.length)];
                const dx = target.x - this.cueBall.x;
                const dy = target.y - this.cueBall.y;
                const angle = Math.atan2(dy, dx);
                
                const power = 30 + Math.random() * 40;
                this.cueBall.vx = Math.cos(angle) * power * 0.1;
                this.cueBall.vy = Math.sin(angle) * power * 0.1;
                
                setTimeout(() => {
                    if (!this.ballsMoving) {
                        this.switchPlayer();
                    }
                }, 3000);
            }

            hitCueBall() {
                const dx = this.mouse.x - this.cueBall.x;
                const dy = this.mouse.y - this.cueBall.y;
                const angle = Math.atan2(dy, dx);
                
                const power = this.chargePower;
                this.cueBall.vx = Math.cos(angle) * power * 0.15;
                this.cueBall.vy = Math.sin(angle) * power * 0.15;
                
                setTimeout(() => {
                    if (!this.ballsMoving) {
                        this.switchPlayer();
                    }
                }, 3000);
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

            checkGameEnd() {
                if (this.gameMode === '8ball') {
                    const remainingBalls = this.balls.filter(ball => !ball.isPotted && ball.number !== 8);
                    if (remainingBalls.length === 0) {
                        // 只剩8号球
                        return;
                    }
                } else if (this.gameMode === '9ball') {
                    const nineBall = this.balls.find(ball => ball.number === 9);
                    if (nineBall?.isPotted) {
                        return;
                    }
                } else if (this.gameMode === 'snooker') {
                    const remainingBalls = this.balls.filter(ball => !ball.isPotted);
                    if (remainingBalls.length === 0) {
                        this.endGame(this.playerScore > this.aiScore ? 'player' : 'ai');
                    }
                }
            }

            endGame(winner) {
                this.gameState = 'gameOver';
                const resultText = winner === 'player' ? 
                    `🎉 恭喜获胜！得分 ${this.playerScore}:${this.aiScore}` : 
                    `😔 游戏失败！得分 ${this.playerScore}:${this.aiScore}`;
                
                this.showMessage(resultText, 'game-over');
                document.getElementById('startButton').style.display = 'block';
                document.getElementById('startButton').textContent = '重新开始';
            }

            draw() {
                // 清空画布
                this.ctx.fillStyle = '#0f5132';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                
                // 绘制台球桌
                this.drawTable();
                
                // 绘制球袋
                this.drawPockets();
                
                // 绘制球
                this.drawBalls();
                
                // 绘制瞄准线
                if (!this.ballsMoving && this.currentPlayer === 'player' && this.gameState === 'playing') {
                    this.drawAimLine();
                }
                
                // 绘制蓄力指示器
                if (this.isCharging) {
                    this.drawChargeIndicator();
                }
            }

            drawTable() {
                // 台球桌表面
                this.ctx.fillStyle = '#0f5132';
                this.ctx.fillRect(this.table.x, this.table.y, this.table.width, this.table.height);
                
                // 台球桌边框
                this.ctx.strokeStyle = '#8b4513';
                this.ctx.lineWidth = 8;
                this.ctx.strokeRect(this.table.x, this.table.y, this.table.width, this.table.height);
                
                // 发球线
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([5, 5]);
                this.ctx.beginPath();
                this.ctx.moveTo(this.table.x + this.table.width * 0.3, this.table.y);
                this.ctx.lineTo(this.table.x + this.table.width * 0.3, this.table.y + this.table.height);
                this.ctx.stroke();
                this.ctx.setLineDash([]);
            }

            drawPockets() {
                this.pockets.forEach(pocket => {
                    this.ctx.fillStyle = '#000000';
                    this.ctx.beginPath();
                    this.ctx.arc(pocket.x, pocket.y, pocket.radius, 0, Math.PI * 2);
                    this.ctx.fill();
                    
                    // 球袋边框
                    this.ctx.strokeStyle = '#654321';
                    this.ctx.lineWidth = 3;
                    this.ctx.stroke();
                });
            }

            drawBalls() {
                // 绘制其他球
                this.balls.forEach(ball => {
                    if (!ball.isPotted) {
                        this.drawBall(ball);
                    }
                });
                
                // 绘制主球
                if (!this.cueBall.isPotted) {
                    this.drawBall(this.cueBall);
                }
            }

            drawBall(ball) {
                // 球的阴影
                this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                this.ctx.beginPath();
                this.ctx.arc(ball.x + 2, ball.y + 2, ball.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 球的主体
                this.ctx.fillStyle = ball.color;
                this.ctx.beginPath();
                this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
                this.ctx.fill();
                
                // 球的边框
                this.ctx.strokeStyle = '#333';
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
                
                // 球号
                if (ball.number && ball.type !== 'cue') {
                    this.ctx.fillStyle = ball.color === '#000000' || ball.color === '#8b0000' ? 'white' : 'black';
                    this.ctx.font = 'bold 10px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(ball.number.toString(), ball.x, ball.y + 3);
                }
                
                // 高光
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                this.ctx.beginPath();
                this.ctx.arc(ball.x - 3, ball.y - 3, ball.radius * 0.3, 0, Math.PI * 2);
                this.ctx.fill();
            }

            drawAimLine() {
                const dx = this.mouse.x - this.cueBall.x;
                const dy = this.mouse.y - this.cueBall.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const maxLength = 200;
                const actualLength = Math.min(distance, maxLength);
                
                const endX = this.cueBall.x + (dx / distance) * actualLength;
                const endY = this.cueBall.y + (dy / distance) * actualLength;
                
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                this.ctx.lineWidth = 2;
                this.ctx.setLineDash([10, 5]);
                this.ctx.beginPath();
                this.ctx.moveTo(this.cueBall.x, this.cueBall.y);
                this.ctx.lineTo(endX, endY);
                this.ctx.stroke();
                this.ctx.setLineDash([]);
            }

            drawChargeIndicator() {
                const centerX = this.cueBall.x;
                const centerY = this.cueBall.y - 30;
                const radius = 15;
                const percentage = this.chargePower / this.maxPower;
                
                // 背景圆
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                this.ctx.stroke();
                
                // 蓄力圆
                this.ctx.strokeStyle = percentage > 0.8 ? '#e74c3c' : '#27ae60';
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * percentage);
                this.ctx.stroke();
            }

            updateUI() {
                document.getElementById('playerScore').textContent = this.playerScore;
                document.getElementById('aiScore').textContent = this.aiScore;
                document.getElementById('currentMode').textContent = 
                    this.gameMode === '8ball' ? '8球' : 
                    this.gameMode === '9ball' ? '9球' : '斯诺克';
                document.getElementById('currentPlayer').textContent = 
                    this.currentPlayer === 'player' ? '玩家' : '电脑';
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
            new BilliardsGame();
        });