// 快打旋风游戏逻辑
class FinalFightGame {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.canvas.id = 'fightCanvas';
        
        const gameCanvas = document.getElementById('gameCanvas');
        gameCanvas.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.gameRunning = false;
        
        this.gameState = {
            score: 0,
            health: 100,
            level: 1,
            combo: 0
        };
        
        this.player = {
            x: 100,
            y: 300,
            width: 40,
            height: 60,
            speed: 4,
            isAttacking: false,
            isJumping: false,
            jumpHeight: 0,
            direction: 1 // 1 for right, -1 for left
        };
        
        this.enemies = [];
        this.items = [];
        this.effects = [];
        
        this.setupControls();
        this.setupGame();
    }

    setupControls() {
        document.getElementById('startBtn').onclick = () => this.startGame();
        document.getElementById('pauseBtn').onclick = () => this.pauseGame();
        document.getElementById('resetBtn').onclick = () => this.resetGame();
        
        // 键盘控制
        this.keys = {};
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            if (e.key === ' ' || e.key.toLowerCase() === 'f') {
                this.playerAttack();
                e.preventDefault();
            }
            if (e.key.toLowerCase() === 'x') {
                this.playerJump();
                e.preventDefault();
            }
        });
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    setupGame() {
        // 绘制游戏背景
        this.drawBackground();
        this.drawPlayer();
        
        // 显示准备信息
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = '28px Arial';
        this.ctx.fillText('快打旋风 - 准备战斗！', 220, 200);
        
        this.updateUI();
    }

    drawBackground() {
        // 街道背景
        this.ctx.fillStyle = '#4a5568';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 地面
        this.ctx.fillStyle = '#2d3748';
        this.ctx.fillRect(0, 360, this.canvas.width, 40);
        
        // 建筑物轮廓
        this.ctx.fillStyle = '#1a202c';
        this.ctx.fillRect(0, 0, this.canvas.width, 100);
        this.ctx.fillStyle = '#2d3748';
        for (let i = 0; i < 5; i++) {
            this.ctx.fillRect(i * 160 + 20, 20, 120, 80);
        }
    }

    drawPlayer() {
        const p = this.player;
        
        // 玩家身体
        this.ctx.fillStyle = p.isAttacking ? '#ff6b6b' : '#4ecdc4';
        this.ctx.fillRect(p.x, p.y - p.jumpHeight, p.width, p.height);
        
        // 玩家头部
        this.ctx.fillStyle = '#feca57';
        this.ctx.fillRect(p.x + 10, p.y - p.jumpHeight - 15, 20, 20);
        
        // 攻击效果
        if (p.isAttacking) {
            this.ctx.fillStyle = 'rgba(255, 107, 107, 0.6)';
            const attackRange = p.direction > 0 ? p.x + p.width : p.x - 30;
            this.ctx.fillRect(attackRange, p.y - p.jumpHeight + 10, 30, 20);
        }
    }

    drawEnemies() {
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = enemy.isHit ? '#ff4757' : '#2f3640';
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            // 敌人血条
            if (enemy.health < enemy.maxHealth) {
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.fillRect(enemy.x, enemy.y - 15, enemy.width, 5);
                this.ctx.fillStyle = '#27ae60';
                const healthWidth = (enemy.health / enemy.maxHealth) * enemy.width;
                this.ctx.fillRect(enemy.x, enemy.y - 15, healthWidth, 5);
            }
        });
    }

    drawItems() {
        this.items.forEach(item => {
            this.ctx.fillStyle = '#f39c12';
            this.ctx.fillRect(item.x, item.y, item.width, item.height);
            
            // 道具图标
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '16px Arial';
            this.ctx.fillText(item.type === 'health' ? '+' : '$', item.x + 8, item.y + 18);
        });
    }

    drawEffects() {
        this.effects.forEach(effect => {
            this.ctx.fillStyle = effect.color;
            this.ctx.font = '20px Arial';
            this.ctx.fillText(effect.text, effect.x, effect.y);
        });
    }

    updateGame() {
        if (!this.gameRunning) return;
        
        // 清空画布并重绘背景
        this.drawBackground();
        
        // 处理输入
        this.handleInput();
        
        // 更新游戏逻辑
        this.updatePlayer();
        this.updateEnemies();
        this.updateItems();
        this.updateEffects();
        this.spawnEnemies();
        this.checkCollisions();
        
        // 绘制所有对象
        this.drawPlayer();
        this.drawEnemies();
        this.drawItems();
        this.drawEffects();
        
        // 更新UI
        this.updateUI();
        
        requestAnimationFrame(() => this.updateGame());
    }

    handleInput() {
        const p = this.player;
        
        if (this.keys['a'] || this.keys['arrowleft']) {
            if (p.x > 0) {
                p.x -= p.speed;
                p.direction = -1;
            }
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            if (p.x < this.canvas.width - p.width) {
                p.x += p.speed;
                p.direction = 1;
            }
        }
        if (this.keys['w'] || this.keys['arrowup']) {
            if (p.y > 200) p.y -= p.speed;
        }
        if (this.keys['s'] || this.keys['arrowdown']) {
            if (p.y < 340) p.y += p.speed;
        }
    }

    playerAttack() {
        if (!this.player.isAttacking) {
            this.player.isAttacking = true;
            setTimeout(() => {
                this.player.isAttacking = false;
            }, 300);
        }
    }

    playerJump() {
        if (!this.player.isJumping) {
            this.player.isJumping = true;
            let jumpSpeed = 8;
            const jumpInterval = setInterval(() => {
                this.player.jumpHeight += jumpSpeed;
                jumpSpeed -= 0.5;
                
                if (this.player.jumpHeight <= 0) {
                    this.player.jumpHeight = 0;
                    this.player.isJumping = false;
                    clearInterval(jumpInterval);
                }
            }, 20);
        }
    }

    updatePlayer() {
        // 玩家更新逻辑已在handleInput中处理
    }

    spawnEnemies() {
        if (Math.random() < 0.01 && this.enemies.length < 3) {
            this.enemies.push({
                x: this.canvas.width,
                y: 280 + Math.random() * 60,
                width: 35,
                height: 55,
                speed: 1 + Math.random(),
                health: 60,
                maxHealth: 60,
                lastAttack: 0,
                isHit: false
            });
        }
    }

    updateEnemies() {
        this.enemies = this.enemies.filter(enemy => {
            enemy.x -= enemy.speed;
            
            // 敌人AI - 简单追击
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            if (Math.abs(dx) < 100 && Math.abs(dy) < 50) {
                enemy.x += Math.sign(dx) * 0.5;
                enemy.y += Math.sign(dy) * 0.2;
            }
            
            enemy.isHit = false;
            return enemy.x > -enemy.width && enemy.health > 0;
        });
    }

    updateItems() {
        this.items = this.items.filter(item => {
            return item.lifeTime-- > 0;
        });
    }

    updateEffects() {
        this.effects = this.effects.filter(effect => {
            effect.y -= 1;
            effect.alpha -= 0.02;
            return effect.alpha > 0;
        });
    }

    checkCollisions() {
        // 玩家攻击敌人
        if (this.player.isAttacking) {
            this.enemies.forEach(enemy => {
                const attackRange = this.player.direction > 0 ? 
                    this.player.x + this.player.width : this.player.x - 30;
                const attackY = this.player.y - this.player.jumpHeight;
                
                if (attackRange < enemy.x + enemy.width &&
                    attackRange + 30 > enemy.x &&
                    attackY < enemy.y + enemy.height &&
                    attackY + 40 > enemy.y) {
                    
                    enemy.health -= 20;
                    enemy.isHit = true;
                    this.gameState.score += 50;
                    this.gameState.combo++;
                    
                    this.addEffect(`+${50 * this.gameState.combo}`, enemy.x, enemy.y, '#27ae60');
                    
                    if (enemy.health <= 0) {
                        this.gameState.score += 100;
                        this.spawnItem(enemy.x, enemy.y);
                    }
                }
            });
        }
        
        // 玩家收集道具
        this.items.forEach((item, index) => {
            if (this.player.x < item.x + item.width &&
                this.player.x + this.player.width > item.x &&
                this.player.y < item.y + item.height &&
                this.player.y + this.player.height > item.y) {
                
                if (item.type === 'health') {
                    this.gameState.health = Math.min(100, this.gameState.health + 20);
                    this.addEffect('+20 HP', item.x, item.y, '#27ae60');
                } else {
                    this.gameState.score += 200;
                    this.addEffect('+200', item.x, item.y, '#f39c12');
                }
                
                this.items.splice(index, 1);
            }
        });
    }

    spawnItem(x, y) {
        if (Math.random() < 0.3) {
            this.items.push({
                x: x,
                y: y,
                width: 20,
                height: 20,
                type: Math.random() < 0.6 ? 'health' : 'score',
                lifeTime: 300
            });
        }
    }

    addEffect(text, x, y, color) {
        this.effects.push({
            text: text,
            x: x,
            y: y,
            color: color,
            alpha: 1
        });
    }

    updateUI() {
        document.getElementById('score').textContent = this.gameState.score;
        document.getElementById('health').textContent = this.gameState.health;
        document.getElementById('level').textContent = this.gameState.level;
    }

    startGame() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            this.updateGame();
        }
    }

    pauseGame() {
        this.gameRunning = !this.gameRunning;
        if (this.gameRunning) {
            this.updateGame();
        }
    }

    resetGame() {
        this.gameRunning = false;
        this.gameState = { score: 0, health: 100, level: 1, combo: 0 };
        this.enemies = [];
        this.items = [];
        this.effects = [];
        this.player = {
            x: 100,
            y: 300,
            width: 40,
            height: 60,
            speed: 4,
            isAttacking: false,
            isJumping: false,
            jumpHeight: 0,
            direction: 1
        };
        this.setupGame();
    }
}

// 初始化游戏
window.onload = () => {
    new FinalFightGame();
};