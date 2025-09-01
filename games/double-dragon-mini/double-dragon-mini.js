// 双截龙游戏逻辑
class DoubleDragonGame {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.canvas.id = 'dragonCanvas';
        
        const gameCanvas = document.getElementById('gameCanvas');
        gameCanvas.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.gameRunning = false;
        
        this.gameState = {
            score: 0,
            enemiesDefeated: 0,
            level: 1
        };
        
        this.player = {
            x: 100,
            y: 300,
            width: 40,
            height: 60,
            health: 100,
            speed: 4,
            isAttacking: false,
            attackType: 'punch', // punch, kick, throw
            direction: 1,
            isJumping: false,
            jumpHeight: 0
        };
        
        this.enemies = [];
        this.effects = [];
        this.weapons = [];
        
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
            
            switch(e.key.toLowerCase()) {
                case 'j':
                    this.playerAttack('punch');
                    break;
                case 'k':
                    this.playerAttack('kick');
                    break;
                case 'l':
                    this.playerAttack('throw');
                    break;
                case ' ':
                    this.playerJump();
                    break;
            }
            e.preventDefault();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    setupGame() {
        this.drawBackground();
        this.drawPlayer();
        
        // 显示准备信息
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = '28px Arial';
        this.ctx.fillText('双截龙 - 兄弟联手！', 250, 200);
        
        this.updateUI();
    }

    drawBackground() {
        // 街道背景
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 地面
        this.ctx.fillStyle = '#34495e';
        this.ctx.fillRect(0, 350, this.canvas.width, 50);
        
        // 建筑物背景
        this.ctx.fillStyle = '#1a252f';
        this.ctx.fillRect(0, 0, this.canvas.width, 150);
        
        // 窗户
        this.ctx.fillStyle = '#f39c12';
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 3; j++) {
                if (Math.random() > 0.3) {
                    this.ctx.fillRect(i * 100 + 20, j * 40 + 20, 15, 25);
                }
            }
        }
    }

    drawPlayer() {
        const p = this.player;
        
        // 玩家身体 - 龙哥
        this.ctx.fillStyle = p.isAttacking ? '#e74c3c' : '#3498db';
        this.ctx.fillRect(p.x, p.y - p.jumpHeight, p.width, p.height);
        
        // 玩家头部
        this.ctx.fillStyle = '#f4d03f';
        this.ctx.fillRect(p.x + 8, p.y - p.jumpHeight - 20, 24, 24);
        
        // 攻击效果
        if (p.isAttacking) {
            this.ctx.fillStyle = 'rgba(231, 76, 60, 0.7)';
            let attackX, attackY, attackW, attackH;
            
            switch(p.attackType) {
                case 'punch':
                    attackX = p.direction > 0 ? p.x + p.width : p.x - 35;
                    attackY = p.y - p.jumpHeight + 15;
                    attackW = 35;
                    attackH = 20;
                    break;
                case 'kick':
                    attackX = p.direction > 0 ? p.x + p.width : p.x - 40;
                    attackY = p.y - p.jumpHeight + 30;
                    attackW = 40;
                    attackH = 25;
                    break;
                case 'throw':
                    attackX = p.x - 20;
                    attackY = p.y - p.jumpHeight - 10;
                    attackW = p.width + 40;
                    attackH = p.height + 20;
                    break;
            }
            
            this.ctx.fillRect(attackX, attackY, attackW, attackH);
        }
        
        // 血条
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(p.x, p.y - p.jumpHeight - 35, p.width, 8);
        this.ctx.fillStyle = '#27ae60';
        const healthWidth = (p.health / 100) * p.width;
        this.ctx.fillRect(p.x, p.y - p.jumpHeight - 35, healthWidth, 8);
    }

    drawEnemies() {
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = enemy.isHit ? '#ff4757' : '#2f3640';
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
            
            // 敌人头部
            this.ctx.fillStyle = '#636e72';
            this.ctx.fillRect(enemy.x + 8, enemy.y - 15, 20, 20);
            
            // 敌人血条
            if (enemy.health < enemy.maxHealth) {
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.fillRect(enemy.x, enemy.y - 25, enemy.width, 6);
                this.ctx.fillStyle = '#27ae60';
                const healthWidth = (enemy.health / enemy.maxHealth) * enemy.width;
                this.ctx.fillRect(enemy.x, enemy.y - 25, healthWidth, 6);
            }
        });
    }

    drawWeapons() {
        this.weapons.forEach(weapon => {
            this.ctx.fillStyle = '#8e44ad';
            this.ctx.fillRect(weapon.x, weapon.y, weapon.width, weapon.height);
            
            // 武器图标
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '14px Arial';
            this.ctx.fillText('⚔', weapon.x + 5, weapon.y + 15);
        });
    }

    drawEffects() {
        this.effects.forEach(effect => {
            this.ctx.globalAlpha = effect.alpha;
            this.ctx.fillStyle = effect.color;
            this.ctx.font = '18px Arial';
            this.ctx.fillText(effect.text, effect.x, effect.y);
            this.ctx.globalAlpha = 1;
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
        this.updateWeapons();
        this.updateEffects();
        this.spawnEnemies();
        this.checkCollisions();
        
        // 绘制所有对象
        this.drawPlayer();
        this.drawEnemies();
        this.drawWeapons();
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

    playerAttack(type) {
        if (!this.player.isAttacking) {
            this.player.isAttacking = true;
            this.player.attackType = type;
            
            const duration = type === 'throw' ? 500 : 250;
            setTimeout(() => {
                this.player.isAttacking = false;
            }, duration);
        }
    }

    playerJump() {
        if (!this.player.isJumping) {
            this.player.isJumping = true;
            let jumpSpeed = 10;
            const jumpInterval = setInterval(() => {
                this.player.jumpHeight += jumpSpeed;
                jumpSpeed -= 0.6;
                
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
        if (Math.random() < 0.015 && this.enemies.length < 4) {
            const side = Math.random() < 0.5 ? -50 : this.canvas.width + 50;
            this.enemies.push({
                x: side,
                y: 280 + Math.random() * 60,
                width: 35,
                height: 55,
                speed: 1.5 + Math.random(),
                health: 80,
                maxHealth: 80,
                lastAttack: 0,
                isHit: false,
                type: Math.random() < 0.7 ? 'normal' : 'strong'
            });
        }
    }

    updateEnemies() {
        this.enemies = this.enemies.filter(enemy => {
            // 敌人移动AI
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 50) {
                enemy.x += Math.sign(dx) * enemy.speed;
                enemy.y += Math.sign(dy) * enemy.speed * 0.3;
            }
            
            // 敌人攻击玩家
            if (distance < 60 && Date.now() - enemy.lastAttack > 1500) {
                this.player.health -= enemy.type === 'strong' ? 15 : 10;
                enemy.lastAttack = Date.now();
                this.addEffect('-' + (enemy.type === 'strong' ? '15' : '10'), 
                    this.player.x, this.player.y, '#e74c3c');
            }
            
            enemy.isHit = false;
            return enemy.health > 0 && enemy.x > -100 && enemy.x < this.canvas.width + 100;
        });
    }

    updateWeapons() {
        this.weapons = this.weapons.filter(weapon => {
            return weapon.lifeTime-- > 0;
        });
    }

    updateEffects() {
        this.effects = this.effects.filter(effect => {
            effect.y -= 1;
            effect.alpha -= 0.03;
            return effect.alpha > 0;
        });
    }

    checkCollisions() {
        // 玩家攻击敌人
        if (this.player.isAttacking) {
            this.enemies.forEach((enemy, index) => {
                let attackX, attackY, attackW, attackH;
                const p = this.player;
                
                switch(p.attackType) {
                    case 'punch':
                        attackX = p.direction > 0 ? p.x + p.width : p.x - 35;
                        attackY = p.y - p.jumpHeight + 15;
                        attackW = 35;
                        attackH = 20;
                        break;
                    case 'kick':
                        attackX = p.direction > 0 ? p.x + p.width : p.x - 40;
                        attackY = p.y - p.jumpHeight + 30;
                        attackW = 40;
                        attackH = 25;
                        break;
                    case 'throw':
                        attackX = p.x - 20;
                        attackY = p.y - p.jumpHeight - 10;
                        attackW = p.width + 40;
                        attackH = p.height + 20;
                        break;
                }
                
                if (attackX < enemy.x + enemy.width &&
                    attackX + attackW > enemy.x &&
                    attackY < enemy.y + enemy.height &&
                    attackY + attackH > enemy.y) {
                    
                    let damage = 0;
                    switch(p.attackType) {
                        case 'punch': damage = 25; break;
                        case 'kick': damage = 35; break;
                        case 'throw': damage = 50; break;
                    }
                    
                    enemy.health -= damage;
                    enemy.isHit = true;
                    this.gameState.score += damage * 2;
                    
                    this.addEffect(`-${damage}`, enemy.x, enemy.y, '#e74c3c');
                    
                    if (enemy.health <= 0) {
                        this.gameState.score += 200;
                        this.gameState.enemiesDefeated++;
                        this.addEffect('+200', enemy.x, enemy.y, '#27ae60');
                        
                        // 随机掉落武器
                        if (Math.random() < 0.2) {
                            this.spawnWeapon(enemy.x, enemy.y);
                        }
                    }
                }
            });
        }
        
        // 玩家收集武器
        this.weapons.forEach((weapon, index) => {
            if (this.player.x < weapon.x + weapon.width &&
                this.player.x + this.player.width > weapon.x &&
                this.player.y < weapon.y + weapon.height &&
                this.player.y + this.player.height > weapon.y) {
                
                this.gameState.score += 100;
                this.addEffect('+100 武器!', weapon.x, weapon.y, '#8e44ad');
                this.weapons.splice(index, 1);
            }
        });
    }

    spawnWeapon(x, y) {
        this.weapons.push({
            x: x,
            y: y,
            width: 20,
            height: 8,
            lifeTime: 500
        });
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
        document.getElementById('player1Hp').textContent = Math.max(0, this.player.health);
        document.getElementById('score').textContent = this.gameState.score;
        document.getElementById('enemies').textContent = this.gameState.enemiesDefeated;
        
        // 游戏结束检查
        if (this.player.health <= 0) {
            this.gameRunning = false;
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.font = '36px Arial';
            this.ctx.fillText('游戏结束!', 280, 200);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px Arial';
            this.ctx.fillText(`最终得分: ${this.gameState.score}`, 300, 240);
        }
    }

    startGame() {
        if (!this.gameRunning && this.player.health > 0) {
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
        this.gameState = { score: 0, enemiesDefeated: 0, level: 1 };
        this.enemies = [];
        this.effects = [];
        this.weapons = [];
        this.player = {
            x: 100,
            y: 300,
            width: 40,
            height: 60,
            health: 100,
            speed: 4,
            isAttacking: false,
            attackType: 'punch',
            direction: 1,
            isJumping: false,
            jumpHeight: 0
        };
        this.setupGame();
    }
}

// 初始化游戏
window.onload = () => {
    new DoubleDragonGame();
};