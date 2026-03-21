class KingOfFightersMini {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.keys = {};
        this.player1 = null;
        this.player2 = null;
        this.gameTime = 99;
        this.timer = null;
        this.winner = null;
        this.round = 1;
        this.maxRounds = 3;
        this.roundWins = { player1: 0, player2: 0 };
        this.effects = [];
        
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
        
        this.canvas.style.border = '3px solid #333';
        this.canvas.style.borderRadius = '10px';
        this.canvas.style.backgroundColor = '#1a1a2e';
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
            energy: 0,
            maxEnergy: 100,
            velocityX: 0,
            velocityY: 0,
            grounded: true,
            facing: 1,
            color: '#e74c3c',
            name: 'KYO',
            attacking: false,
            blocking: false,
            attackCooldown: 0,
            combo: 0,
            lastAttackTime: 0,
            special: false,
            specialCooldown: 0,
            keys: {
                left: 'a',
                right: 'd',
                up: 'w',
                down: 's',
                punch: 'f',
                kick: 'g',
                special: 'r',
                block: 'e'
            }
        };

        this.player2 = {
            x: 600,
            y: 300,
            width: 60,
            height: 80,
            health: 100,
            maxHealth: 100,
            energy: 0,
            maxEnergy: 100,
            velocityX: 0,
            velocityY: 0,
            grounded: true,
            facing: -1,
            color: '#3498db',
            name: 'IORI',
            attacking: false,
            blocking: false,
            attackCooldown: 0,
            combo: 0,
            lastAttackTime: 0,
            special: false,
            specialCooldown: 0,
            keys: {
                left: 'ArrowLeft',
                right: 'ArrowRight',
                up: 'ArrowUp',
                down: 'ArrowDown',
                punch: 'k',
                kick: 'l',
                special: 'o',
                block: 'i'
            }
        };
    }

    startGame() {
        this.gameState = 'playing';
        this.gameTime = 99;
        this.winner = null;
        this.round = 1;
        this.roundWins = { player1: 0, player2: 0 };
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
                this.endRound('timeout');
            }
        }, 1000);
    }

    updatePlayer(player) {
        if (this.gameState !== 'playing') return;

        const opponent = player === this.player1 ? this.player2 : this.player1;

        // 重力
        if (!player.grounded) {
            player.velocityY += 0.8;
        }

        // 面向检测
        if (Math.abs(player.x - opponent.x) > 20) {
            if (player.x < opponent.x) {
                player.facing = 1;
            } else {
                player.facing = -1;
            }
        }

        // 移动输入
        if (this.keys[player.keys.left] && !player.blocking) {
            player.velocityX = -6;
        } else if (this.keys[player.keys.right] && !player.blocking) {
            player.velocityX = 6;
        } else {
            player.velocityX *= 0.7;
        }

        // 跳跃
        if (this.keys[player.keys.up] && player.grounded && !player.blocking) {
            player.velocityY = -16;
            player.grounded = false;
        }

        // 蹲下
        if (this.keys[player.keys.down]) {
            player.height = 50;
            player.y = 330;
        } else {
            player.height = 80;
            player.y = Math.min(player.y, 300);
        }

        // 格挡
        player.blocking = this.keys[player.keys.block];

        // 攻击
        if (this.keys[player.keys.punch] && player.attackCooldown <= 0) {
            this.performAttack(player, 'punch');
        }
        if (this.keys[player.keys.kick] && player.attackCooldown <= 0) {
            this.performAttack(player, 'kick');
        }

        // 必杀技
        if (this.keys[player.keys.special] && player.energy >= 50 && player.specialCooldown <= 0) {
            this.performSpecial(player);
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

        // 更新冷却时间
        if (player.attackCooldown > 0) player.attackCooldown--;
        if (player.specialCooldown > 0) player.specialCooldown--;

        // 重置连击
        if (Date.now() - player.lastAttackTime > 2000) {
            player.combo = 0;
        }

        // 恢复能量
        if (player.energy < player.maxEnergy) {
            player.energy += 0.2;
        }
    }

    performAttack(attacker, attackType) {
        attacker.attacking = true;
        attacker.attackCooldown = 15;
        
        const opponent = attacker === this.player1 ? this.player2 : this.player1;
        
        let attackRange = 90;
        let damage = attackType === 'punch' ? 12 : 18;
        
        const distance = Math.abs(attacker.x - opponent.x);
        
        if (distance < attackRange) {
            // 面向检测
            if ((attacker.facing === 1 && attacker.x < opponent.x) || 
                (attacker.facing === -1 && attacker.x > opponent.x)) {
                
                // 格挡检测
                if (opponent.blocking && 
                    ((opponent.facing === 1 && opponent.x > attacker.x) || 
                     (opponent.facing === -1 && opponent.x < attacker.x))) {
                    damage = Math.floor(damage * 0.3); // 格挡减伤
                    this.createEffect(opponent.x, opponent.y, 'block');
                } else {
                    this.createEffect(opponent.x, opponent.y, 'hit');
                }
                
                opponent.health -= damage;
                attacker.combo++;
                attacker.lastAttackTime = Date.now();
                attacker.energy = Math.min(attacker.energy + 5, attacker.maxEnergy);
                
                // 击退效果
                if (!opponent.blocking) {
                    opponent.velocityX = attacker.facing * 4;
                }
                
                // 连击奖励
                if (attacker.combo > 3) {
                    opponent.health -= 3;
                    attacker.energy = Math.min(attacker.energy + 3, attacker.maxEnergy);
                }
                
                if (opponent.health <= 0) {
                    opponent.health = 0;
                    this.endRound(attacker === this.player1 ? 'player1' : 'player2');
                }
            }
        }
        
        setTimeout(() => {
            attacker.attacking = false;
        }, 200);
    }

    performSpecial(player) {
        player.energy -= 50;
        player.specialCooldown = 180;
        player.special = true;
        
        const opponent = player === this.player1 ? this.player2 : this.player1;
        
        // 创建特效
        this.createEffect(player.x + (player.facing * 50), player.y, 'special');
        
        // 特殊攻击判定
        const distance = Math.abs(player.x - opponent.x);
        if (distance < 120) {
            let damage = 25;
            
            if (opponent.blocking) {
                damage = Math.floor(damage * 0.5);
                this.createEffect(opponent.x, opponent.y, 'block');
            } else {
                this.createEffect(opponent.x, opponent.y, 'special_hit');
                opponent.velocityX = player.facing * 8;
                opponent.velocityY = -5;
                opponent.grounded = false;
            }
            
            opponent.health -= damage;
            
            if (opponent.health <= 0) {
                opponent.health = 0;
                this.endRound(player === this.player1 ? 'player1' : 'player2');
            }
        }
        
        setTimeout(() => {
            player.special = false;
        }, 500);
    }

    createEffect(x, y, type) {
        const effect = {
            x: x,
            y: y,
            type: type,
            life: 20,
            maxLife: 20
        };
        this.effects.push(effect);
    }

    updateEffects() {
        this.effects = this.effects.filter(effect => {
            effect.life--;
            return effect.life > 0;
        });
    }

    endRound(winner) {
        clearInterval(this.timer);
        
        if (winner === 'player1') {
            this.roundWins.player1++;
        } else if (winner === 'player2') {
            this.roundWins.player2++;
        } else {
            // 超时，血量多的获胜
            if (this.player1.health > this.player2.health) {
                this.roundWins.player1++;
            } else if (this.player2.health > this.player1.health) {
                this.roundWins.player2++;
            }
        }
        
        // 检查是否有人获得胜利
        if (this.roundWins.player1 >= 2) {
            this.winner = 'PLAYER 1';
            this.gameState = 'gameOver';
        } else if (this.roundWins.player2 >= 2) {
            this.winner = 'PLAYER 2';
            this.gameState = 'gameOver';
        } else {
            // 下一回合
            this.round++;
            setTimeout(() => {
                this.nextRound();
            }, 2000);
        }
    }

    nextRound() {
        this.gameTime = 99;
        this.initPlayers();
        this.gameState = 'playing';
        this.startTimer();
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawBackground();
        
        if (this.gameState === 'menu') {
            this.drawMenu();
        } else {
            this.drawGame();
        }
    }

    drawBackground() {
        // 夜晚背景
        const gradient = this.ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#0f0f23');
        gradient.addColorStop(1, '#16213e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 星星
        this.ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 20; i++) {
            const x = (i * 37) % this.canvas.width;
            const y = (i * 23) % 200;
            this.ctx.fillRect(x, y, 2, 2);
        }
        
        // 地面
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 380, this.canvas.width, 20);
    }

    drawMenu() {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('THE KING OF FIGHTERS', this.canvas.width / 2, 100);
        
        this.ctx.font = '20px Arial';
        this.ctx.fillText('玩家1: WASD移动, F拳击, G踢腿, R必杀, E格挡', this.canvas.width / 2, 180);
        this.ctx.fillText('玩家2: 方向键移动, K拳击, L踢腿, O必杀, I格挡', this.canvas.width / 2, 210);
        
        this.ctx.fillText('必杀技需要消耗50能量，三局两胜制', this.canvas.width / 2, 260);
        this.ctx.fillText('点击开始游戏按钮开始对战!', this.canvas.width / 2, 320);
    }

    drawGame() {
        this.drawPlayer(this.player1);
        this.drawPlayer(this.player2);
        this.drawEffects();
        this.drawUI();
        
        if (this.gameState === 'paused') {
            this.drawPauseScreen();
        } else if (this.gameState === 'gameOver') {
            this.drawGameOverScreen();
        }
    }

    drawPlayer(player) {
        this.ctx.save();
        
        // 必杀技光效
        if (player.special) {
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
            this.ctx.fillRect(player.x - 10, player.y - 10, player.width + 20, player.height + 20);
        }
        
        // 格挡效果
        if (player.blocking) {
            this.ctx.fillStyle = 'rgba(0, 100, 255, 0.4)';
            this.ctx.fillRect(player.x - 5, player.y - 5, player.width + 10, player.height + 10);
        }
        
        // 攻击效果
        if (player.attacking) {
            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.6)';
            this.ctx.fillRect(
                player.x + (player.facing === 1 ? player.width : -40), 
                player.y, 
                40, 
                player.height
            );
        }
        
        // 玩家主体
        this.ctx.fillStyle = player.color;
        this.ctx.fillRect(player.x, player.y, player.width, player.height);
        
        // 玩家头部
        this.ctx.fillStyle = '#f4d03f';
        this.ctx.fillRect(player.x + 15, player.y - 15, 30, 20);
        
        // 玩家眼睛
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(player.x + 20, player.y - 10, 5, 5);
        this.ctx.fillRect(player.x + 35, player.y - 10, 5, 5);
        
        // 连击显示
        if (player.combo > 1) {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.fillText(`${player.combo} HIT COMBO!`, player.x, player.y - 25);
        }
        
        this.ctx.restore();
    }

    drawEffects() {
        this.effects.forEach(effect => {
            const alpha = effect.life / effect.maxLife;
            
            switch (effect.type) {
                case 'hit':
                    this.ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
                    this.ctx.fillRect(effect.x - 10, effect.y - 10, 20, 20);
                    break;
                case 'block':
                    this.ctx.fillStyle = `rgba(0, 100, 255, ${alpha})`;
                    this.ctx.fillRect(effect.x - 15, effect.y - 15, 30, 30);
                    break;
                case 'special':
                    this.ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
                    this.ctx.fillRect(effect.x - 20, effect.y - 20, 40, 40);
                    break;
                case 'special_hit':
                    this.ctx.fillStyle = `rgba(255, 100, 255, ${alpha})`;
                    this.ctx.fillRect(effect.x - 25, effect.y - 25, 50, 50);
                    break;
            }
        });
        
        this.updateEffects();
    }

    drawUI() {
        // 血条背景
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(20, 20, 200, 20);
        this.ctx.fillRect(580, 20, 200, 20);
        
        // 血条
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(20, 20, (this.player1.health / this.player1.maxHealth) * 200, 20);
        
        this.ctx.fillStyle = '#3498db';
        this.ctx.fillRect(580, 20, (this.player2.health / this.player2.maxHealth) * 200, 20);
        
        // 能量条背景
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(20, 45, 200, 10);
        this.ctx.fillRect(580, 45, 200, 10);
        
        // 能量条
        this.ctx.fillStyle = '#f39c12';
        this.ctx.fillRect(20, 45, (this.player1.energy / this.player1.maxEnergy) * 200, 10);
        this.ctx.fillRect(580, 45, (this.player2.energy / this.player2.maxEnergy) * 200, 10);
        
        // 玩家名称
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(this.player1.name, 20, 75);
        this.ctx.textAlign = 'right';
        this.ctx.fillText(this.player2.name, 780, 75);
        
        // 时间和回合
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Round ${this.round}`, this.canvas.width / 2, 25);
        this.ctx.fillText(`${this.gameTime}`, this.canvas.width / 2, 50);
        
        // 获胜次数
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`Wins: ${this.roundWins.player1}`, 20, 100);
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Wins: ${this.roundWins.player2}`, 780, 100);
    }

    drawPauseScreen() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#fff';
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
        this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.fillText(`${this.winner} WINS!`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        
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
    new KingOfFightersMini();
});
