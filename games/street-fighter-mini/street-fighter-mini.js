class StreetFighterMini {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.keys = {};
        this.player1 = null;
        this.player2 = null;
        this.gameTime = 99;
        this.timer = null;
        this.backgrounds = [
            { name: '道场', color: '#8B4513' },
            { name: '街道', color: '#696969' },
            { name: '港口', color: '#4682B4' }
        ];
        this.currentBg = 0;
        this.winner = null;
        
        this.init();
    }

    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.initPlayers();
        this.gameLoop();
    }

    createCanvas() {
        const container = document.getElementById('gameCanvas');
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        
        // 样式
        this.canvas.style.border = '3px solid #333';
        this.canvas.style.borderRadius = '10px';
        this.canvas.style.backgroundColor = '#f0f0f0';
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            e.preventDefault();
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
            e.preventDefault();
        });

        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
    }

    initPlayers() {
        this.player1 = {
            x: 150,
            y: 300,
            width: 60,
            height: 80,
            health: 100,
            maxHealth: 100,
            velocityX: 0,
            velocityY: 0,
            grounded: true,
            facing: 1, // 1 = right, -1 = left
            color: '#FF6B6B',
            name: 'RYU',
            attacking: false,
            attackCooldown: 0,
            combo: 0,
            lastAttackTime: 0,
            // 移动键位 (WASD)
            keys: {
                left: 'a',
                right: 'd',
                up: 'w',
                down: 's',
                punch: 'f',
                kick: 'g'
            }
        };

        this.player2 = {
            x: 600,
            y: 300,
            width: 60,
            height: 80,
            health: 100,
            maxHealth: 100,
            velocityX: 0,
            velocityY: 0,
            grounded: true,
            facing: -1,
            color: '#4ECDC4',
            name: 'KEN',
            attacking: false,
            attackCooldown: 0,
            combo: 0,
            lastAttackTime: 0,
            // 移动键位 (方向键)
            keys: {
                left: 'ArrowLeft',
                right: 'ArrowRight',
                up: 'ArrowUp',
                down: 'ArrowDown',
                punch: 'k',
                kick: 'l'
            }
        };
    }

    startGame() {
        this.gameState = 'playing';
        this.gameTime = 99;
        this.winner = null;
        this.initPlayers();
        this.startTimer();
        
        document.getElementById('startBtn').textContent = '重新开始';
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            clearInterval(this.timer);
            document.getElementById('pauseBtn').textContent = '继续';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.startTimer();
            document.getElementById('pauseBtn').textContent = '暂停';
        }
    }

    startTimer() {
        this.timer = setInterval(() => {
            if (this.gameTime > 0) {
                this.gameTime--;
            } else {
                this.endGame('timeout');
            }
        }, 1000);
    }

    updatePlayer(player) {
        if (this.gameState !== 'playing') return;

        // 重力
        if (!player.grounded) {
            player.velocityY += 0.8;
        }

        // 移动输入
        if (this.keys[player.keys.left]) {
            player.velocityX = -5;
            player.facing = -1;
        } else if (this.keys[player.keys.right]) {
            player.velocityX = 5;
            player.facing = 1;
        } else {
            player.velocityX *= 0.8; // 摩擦力
        }

        // 跳跃
        if (this.keys[player.keys.up] && player.grounded) {
            player.velocityY = -15;
            player.grounded = false;
        }

        // 蹲下
        if (this.keys[player.keys.down]) {
            player.height = 40;
            player.y = 340;
        } else {
            player.height = 80;
            player.y = Math.min(player.y, 300);
        }

        // 攻击
        if (this.keys[player.keys.punch] && player.attackCooldown <= 0) {
            this.performAttack(player, 'punch');
        }
        if (this.keys[player.keys.kick] && player.attackCooldown <= 0) {
            this.performAttack(player, 'kick');
        }

        // 更新位置
        player.x += player.velocityX;
        player.y += player.velocityY;

        // 边界检测
        player.x = Math.max(10, Math.min(this.canvas.width - player.width - 10, player.x));

        // 地面检测
        if (player.y >= 300) {
            player.y = 300;
            player.velocityY = 0;
            player.grounded = true;
        }

        // 更新攻击冷却
        if (player.attackCooldown > 0) {
            player.attackCooldown--;
        }

        // 重置连击
        if (Date.now() - player.lastAttackTime > 2000) {
            player.combo = 0;
        }
    }

    performAttack(attacker, attackType) {
        attacker.attacking = true;
        attacker.attackCooldown = 20;
        
        const opponent = attacker === this.player1 ? this.player2 : this.player1;
        
        // 攻击范围检测
        let attackRange = 80;
        let damage = attackType === 'punch' ? 8 : 12;
        
        const distance = Math.abs(attacker.x - opponent.x);
        
        if (distance < attackRange) {
            // 面向检测
            if ((attacker.facing === 1 && attacker.x < opponent.x) || 
                (attacker.facing === -1 && attacker.x > opponent.x)) {
                
                // 命中
                opponent.health -= damage;
                attacker.combo++;
                attacker.lastAttackTime = Date.now();
                
                // 击退效果
                opponent.velocityX = attacker.facing * 3;
                
                // 连击奖励
                if (attacker.combo > 2) {
                    opponent.health -= 2;
                }
                
                // 检查是否击败
                if (opponent.health <= 0) {
                    opponent.health = 0;
                    this.endGame(attacker === this.player1 ? 'player1' : 'player2');
                }
            }
        }
        
        setTimeout(() => {
            attacker.attacking = false;
        }, 200);
    }

    endGame(reason) {
        this.gameState = 'gameOver';
        clearInterval(this.timer);
        
        if (reason === 'timeout') {
            this.winner = this.player1.health > this.player2.health ? 'PLAYER 1' : 
                         this.player2.health > this.player1.health ? 'PLAYER 2' : 'DRAW';
        } else if (reason === 'player1') {
            this.winner = 'PLAYER 1';
        } else if (reason === 'player2') {
            this.winner = 'PLAYER 2';
        }
    }

    render() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景
        this.drawBackground();
        
        // 绘制地面
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, 380, this.canvas.width, 20);
        
        if (this.gameState === 'menu') {
            this.drawMenu();
        } else {
            this.drawGame();
        }
    }

    drawBackground() {
        const bg = this.backgrounds[this.currentBg];
        this.ctx.fillStyle = bg.color;
        this.ctx.fillRect(0, 0, this.canvas.width, 380);
        
        // 添加一些装饰
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 5; i++) {
            this.ctx.fillRect(i * 160, 0, 80, 380);
        }
    }

    drawMenu() {
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('STREET FIGHTER', this.canvas.width / 2, 100);
        
        this.ctx.font = '24px Arial';
        this.ctx.fillText('玩家1: WASD移动, F拳击, G踢腿', this.canvas.width / 2, 200);
        this.ctx.fillText('玩家2: 方向键移动, K拳击, L踢腿', this.canvas.width / 2, 240);
        
        this.ctx.fillText('点击开始游戏按钮开始对战!', this.canvas.width / 2, 320);
    }

    drawGame() {
        // 绘制玩家
        this.drawPlayer(this.player1);
        this.drawPlayer(this.player2);
        
        // 绘制UI
        this.drawUI();
        
        if (this.gameState === 'paused') {
            this.drawPauseScreen();
        } else if (this.gameState === 'gameOver') {
            this.drawGameOverScreen();
        }
    }

    drawPlayer(player) {
        this.ctx.save();
        
        // 攻击效果
        if (player.attacking) {
            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.5)';
            this.ctx.fillRect(
                player.x + (player.facing === 1 ? player.width : -30), 
                player.y, 
                30, 
                player.height
            );
        }
        
        // 玩家主体
        this.ctx.fillStyle = player.color;
        this.ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // 玩家头部
        this.ctx.fillStyle = '#FFB6C1';
        this.ctx.fillRect(player.x + 15, player.y - 15, 30, 20);
        
        // 玩家眼睛
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(player.x + 20, player.y - 10, 5, 5);
        this.ctx.fillRect(player.x + 35, player.y - 10, 5, 5);
        
        // 连击显示
        if (player.combo > 1) {
            this.ctx.fillStyle = '#FF0000';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillText(`${player.combo} COMBO!`, player.x, player.y - 25);
        }
        
        this.ctx.restore();
    }

    drawUI() {
        // 血条背景
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(20, 20, 200, 20);
        this.ctx.fillRect(580, 20, 200, 20);
        
        // 血条
        this.ctx.fillStyle = '#FF6B6B';
        this.ctx.fillRect(20, 20, (this.player1.health / this.player1.maxHealth) * 200, 20);
        
        this.ctx.fillStyle = '#4ECDC4';
        this.ctx.fillRect(580, 20, (this.player2.health / this.player2.maxHealth) * 200, 20);
        
        // 玩家名称
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(this.player1.name, 20, 60);
        this.ctx.textAlign = 'right';
        this.ctx.fillText(this.player2.name, 780, 60);
        
        // 时间
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`时间: ${this.gameTime}`, this.canvas.width / 2, 35);
    }

    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('暂停', this.canvas.width / 2, this.canvas.height / 2);
    }

    drawGameOverScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 32px Arial';
        if (this.winner === 'DRAW') {
            this.ctx.fillText('平局!', this.canvas.width / 2, this.canvas.height / 2 + 20);
        } else {
            this.ctx.fillText(`${this.winner} 获胜!`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        }
        
        this.ctx.font = '20px Arial';
        this.ctx.fillText('点击重新开始按钮再次对战', this.canvas.width / 2, this.canvas.height / 2 + 80);
    }

    gameLoop() {
        this.updatePlayer(this.player1);
        this.updatePlayer(this.player2);
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new StreetFighterMini();
});
