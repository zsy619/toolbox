// 恶魔城游戏逻辑
class CastlevaniaGame {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.canvas.id = 'castleCanvas';
        
        const gameCanvas = document.getElementById('gameCanvas');
        gameCanvas.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.gameRunning = false;
        
        this.gameState = {
            score: 0,
            hearts: 5,
            level: 1
        };
        
        this.player = {
            x: 100,
            y: 300,
            width: 30,
            height: 50,
            health: 100,
            speed: 3,
            isAttacking: false,
            isJumping: false,
            jumpHeight: 0,
            jumpSpeed: 0,
            direction: 1,
            onGround: true,
            weapon: 'whip' // whip, dagger, axe
        };
        
        this.enemies = [];
        this.platforms = [];
        this.items = [];
        this.projectiles = [];
        this.effects = [];
        
        this.setupPlatforms();
        this.setupControls();
        this.setupGame();
    }

    setupPlatforms() {
        // 创建平台系统
        this.platforms = [
            { x: 0, y: 350, width: 800, height: 50 }, // 地面
            { x: 200, y: 280, width: 150, height: 20 }, // 平台1
            { x: 450, y: 220, width: 120, height: 20 }, // 平台2
            { x: 650, y: 160, width: 150, height: 20 }, // 平台3
            { x: 100, y: 180, width: 80, height: 20 }   // 平台4
        ];
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
                    this.playerAttack();
                    break;
                case 'k':
                    this.useSubWeapon();
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
        this.drawPlatforms();
        
        // 显示准备信息
        this.ctx.fillStyle = '#8B0000';
        this.ctx.font = '28px Arial';
        this.ctx.fillText('恶魔城 - 夜幕降临...', 220, 100);
        
        this.updateUI();
    }

    drawBackground() {
        // 夜空背景
        this.ctx.fillStyle = '#191970';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 月亮
        this.ctx.fillStyle = '#F5F5DC';
        this.ctx.beginPath();
        this.ctx.arc(650, 80, 40, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 城堡轮廓
        this.ctx.fillStyle = '#2F2F2F';
        this.ctx.fillRect(0, 0, this.canvas.width, 150);
        
        // 城堡尖塔
        this.ctx.fillStyle = '#1C1C1C';
        for (let i = 0; i < 4; i++) {
            this.ctx.fillRect(i * 200 + 50, 50, 30, 100);
            // 尖顶
            this.ctx.beginPath();
            this.ctx.moveTo(i * 200 + 50, 50);
            this.ctx.lineTo(i * 200 + 65, 20);
            this.ctx.lineTo(i * 200 + 80, 50);
            this.ctx.fill();
        }
        
        // 窗户 - 发出微弱的光
        this.ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 6; i++) {
            if (Math.random() > 0.4) {
                this.ctx.fillRect(i * 130 + 20, 80, 12, 18);
            }
        }
    }

    drawPlatforms() {
        this.platforms.forEach(platform => {
            this.ctx.fillStyle = '#8B4513';
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // 平台纹理
            this.ctx.fillStyle = '#A0522D';
            for (let i = platform.x; i < platform.x + platform.width; i += 20) {
                this.ctx.fillRect(i, platform.y, 18, 5);
            }
        });
    }

    drawPlayer() {
        const p = this.player;
        
        // 玩家身体 - 西蒙·贝尔蒙特
        this.ctx.fillStyle = p.isAttacking ? '#8B0000' : '#4169E1';
        this.ctx.fillRect(p.x, p.y - p.jumpHeight, p.width, p.height);
        
        // 玩家头部
        this.ctx.fillStyle = '#FDBCB4';
        this.ctx.fillRect(p.x + 8, p.y - p.jumpHeight - 15, 14, 18);
        
        // 头发
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(p.x + 6, p.y - p.jumpHeight - 18, 18, 8);
        
        // 攻击效果 - 鞭子
        if (p.isAttacking) {
            this.ctx.strokeStyle = '#8B4513';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            const whipLength = 60;
            const whipX = p.direction > 0 ? p.x + p.width : p.x;
            const whipEndX = whipX + (whipLength * p.direction);
            this.ctx.moveTo(whipX, p.y - p.jumpHeight + 20);
            this.ctx.lineTo(whipEndX, p.y - p.jumpHeight + 15);
            this.ctx.stroke();
            
            // 鞭子尖端效果
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fillRect(whipEndX - 3, p.y - p.jumpHeight + 12, 6, 6);
        }
        
        // 血条
        this.ctx.fillStyle = '#8B0000';
        this.ctx.fillRect(p.x, p.y - p.jumpHeight - 25, p.width, 6);
        this.ctx.fillStyle = '#32CD32';
        const healthWidth = (p.health / 100) * p.width;
        this.ctx.fillRect(p.x, p.y - p.jumpHeight - 25, healthWidth, 6);
    }

    drawEnemies() {
        this.enemies.forEach(enemy => {
            switch(enemy.type) {
                case 'skeleton':
                    this.ctx.fillStyle = enemy.isHit ? '#FF6347' : '#F5F5DC';
                    this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                    // 骷髅头
                    this.ctx.fillStyle = '#FFF';
                    this.ctx.fillRect(enemy.x + 5, enemy.y - 10, 15, 15);
                    // 眼睛
                    this.ctx.fillStyle = '#FF0000';
                    this.ctx.fillRect(enemy.x + 8, enemy.y - 7, 3, 3);
                    this.ctx.fillRect(enemy.x + 14, enemy.y - 7, 3, 3);
                    break;
                    
                case 'bat':
                    this.ctx.fillStyle = enemy.isHit ? '#FF6347' : '#2F2F2F';
                    this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                    // 翅膀
                    this.ctx.fillStyle = '#1C1C1C';
                    this.ctx.fillRect(enemy.x - 5, enemy.y + 3, 8, 4);
                    this.ctx.fillRect(enemy.x + enemy.width - 3, enemy.y + 3, 8, 4);
                    break;
            }
            
            // 敌人血条
            if (enemy.health < enemy.maxHealth) {
                this.ctx.fillStyle = '#8B0000';
                this.ctx.fillRect(enemy.x, enemy.y - 15, enemy.width, 4);
                this.ctx.fillStyle = '#32CD32';
                const healthWidth = (enemy.health / enemy.maxHealth) * enemy.width;
                this.ctx.fillRect(enemy.x, enemy.y - 15, healthWidth, 4);
            }
        });
    }

    drawItems() {
        this.items.forEach(item => {
            switch(item.type) {
                case 'heart':
                    this.ctx.fillStyle = '#FF1493';
                    this.ctx.fillRect(item.x, item.y, item.width, item.height);
                    this.ctx.fillStyle = '#FFF';
                    this.ctx.font = '12px Arial';
                    this.ctx.fillText('♥', item.x + 3, item.y + 12);
                    break;
                    
                case 'potion':
                    this.ctx.fillStyle = '#8A2BE2';
                    this.ctx.fillRect(item.x, item.y, item.width, item.height);
                    this.ctx.fillStyle = '#FFF';
                    this.ctx.font = '12px Arial';
                    this.ctx.fillText('+', item.x + 5, item.y + 12);
                    break;
            }
        });
    }

    drawProjectiles() {
        this.projectiles.forEach(proj => {
            switch(proj.type) {
                case 'dagger':
                    this.ctx.fillStyle = '#C0C0C0';
                    this.ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
                    break;
                    
                case 'axe':
                    this.ctx.fillStyle = '#8B4513';
                    this.ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
                    this.ctx.fillStyle = '#C0C0C0';
                    this.ctx.fillRect(proj.x + 2, proj.y + 2, proj.width - 4, proj.height - 4);
                    break;
            }
        });
    }

    drawEffects() {
        this.effects.forEach(effect => {
            this.ctx.globalAlpha = effect.alpha;
            this.ctx.fillStyle = effect.color;
            this.ctx.font = '16px Arial';
            this.ctx.fillText(effect.text, effect.x, effect.y);
            this.ctx.globalAlpha = 1;
        });
    }

    updateGame() {
        if (!this.gameRunning) return;
        
        // 清空画布并重绘背景
        this.drawBackground();
        this.drawPlatforms();
        
        // 处理输入
        this.handleInput();
        
        // 更新游戏逻辑
        this.updatePlayer();
        this.updateEnemies();
        this.updateItems();
        this.updateProjectiles();
        this.updateEffects();
        this.spawnEnemies();
        this.checkCollisions();
        this.checkPlatformCollisions();
        
        // 绘制所有对象
        this.drawPlayer();
        this.drawEnemies();
        this.drawItems();
        this.drawProjectiles();
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
    }

    playerAttack() {
        if (!this.player.isAttacking) {
            this.player.isAttacking = true;
            setTimeout(() => {
                this.player.isAttacking = false;
            }, 400);
        }
    }

    playerJump() {
        if (this.player.onGround && !this.player.isJumping) {
            this.player.isJumping = true;
            this.player.onGround = false;
            this.player.jumpSpeed = 12;
        }
    }

    useSubWeapon() {
        if (this.gameState.hearts > 0) {
            this.gameState.hearts--;
            
            this.projectiles.push({
                x: this.player.x,
                y: this.player.y,
                width: 8,
                height: 4,
                speedX: 6 * this.player.direction,
                speedY: 0,
                type: 'dagger',
                damage: 30
            });
        }
    }

    updatePlayer() {
        const p = this.player;
        
        // 重力和跳跃
        if (!p.onGround) {
            p.jumpHeight += p.jumpSpeed;
            p.jumpSpeed -= 0.8; // 重力
            
            if (p.jumpHeight <= 0) {
                p.jumpHeight = 0;
                p.jumpSpeed = 0;
                p.isJumping = false;
                p.onGround = true;
            }
        }
    }

    spawnEnemies() {
        if (Math.random() < 0.01 && this.enemies.length < 5) {
            const enemyType = Math.random() < 0.7 ? 'skeleton' : 'bat';
            const spawnX = Math.random() < 0.5 ? -30 : this.canvas.width + 30;
            
            this.enemies.push({
                x: spawnX,
                y: enemyType === 'bat' ? 150 + Math.random() * 100 : 320,
                width: enemyType === 'bat' ? 20 : 25,
                height: enemyType === 'bat' ? 15 : 35,
                speed: enemyType === 'bat' ? 2 : 1,
                health: enemyType === 'bat' ? 40 : 60,
                maxHealth: enemyType === 'bat' ? 40 : 60,
                type: enemyType,
                isHit: false,
                lastAttack: 0
            });
        }
    }

    updateEnemies() {
        this.enemies = this.enemies.filter(enemy => {
            // 敌人AI
            const dx = this.player.x - enemy.x;
            const distance = Math.abs(dx);
            
            if (enemy.type === 'skeleton') {
                enemy.x += Math.sign(dx) * enemy.speed;
                
                // 骷髅攻击
                if (distance < 50 && Date.now() - enemy.lastAttack > 2000) {
                    this.player.health -= 15;
                    enemy.lastAttack = Date.now();
                    this.addEffect('-15', this.player.x, this.player.y, '#FF0000');
                }
            } else if (enemy.type === 'bat') {
                // 蝙蝠飞行模式
                enemy.x += Math.sign(dx) * enemy.speed;
                enemy.y += Math.sin(Date.now() * 0.005) * 2;
                
                if (distance < 40 && Date.now() - enemy.lastAttack > 1500) {
                    this.player.health -= 10;
                    enemy.lastAttack = Date.now();
                    this.addEffect('-10', this.player.x, this.player.y, '#FF0000');
                }
            }
            
            enemy.isHit = false;
            return enemy.health > 0 && enemy.x > -50 && enemy.x < this.canvas.width + 50;
        });
    }

    updateItems() {
        this.items = this.items.filter(item => {
            return item.lifeTime-- > 0;
        });
    }

    updateProjectiles() {
        this.projectiles = this.projectiles.filter(proj => {
            proj.x += proj.speedX;
            proj.y += proj.speedY;
            
            return proj.x > -20 && proj.x < this.canvas.width + 20 &&
                   proj.y > -20 && proj.y < this.canvas.height + 20;
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
        // 玩家鞭子攻击敌人
        if (this.player.isAttacking) {
            const whipLength = 60;
            const whipX = this.player.direction > 0 ? 
                this.player.x + this.player.width : this.player.x - whipLength;
            
            this.enemies.forEach(enemy => {
                if (whipX < enemy.x + enemy.width &&
                    whipX + whipLength > enemy.x &&
                    this.player.y - this.player.jumpHeight < enemy.y + enemy.height &&
                    this.player.y - this.player.jumpHeight + 40 > enemy.y) {
                    
                    enemy.health -= 25;
                    enemy.isHit = true;
                    this.gameState.score += 100;
                    
                    this.addEffect('-25', enemy.x, enemy.y, '#FFD700');
                    
                    if (enemy.health <= 0) {
                        this.gameState.score += 200;
                        this.spawnItem(enemy.x, enemy.y);
                    }
                }
            });
        }
        
        // 投射物攻击敌人
        this.projectiles.forEach((proj, pIndex) => {
            this.enemies.forEach((enemy, eIndex) => {
                if (proj.x < enemy.x + enemy.width &&
                    proj.x + proj.width > enemy.x &&
                    proj.y < enemy.y + enemy.height &&
                    proj.y + proj.height > enemy.y) {
                    
                    enemy.health -= proj.damage;
                    enemy.isHit = true;
                    this.gameState.score += 150;
                    
                    this.addEffect(`-${proj.damage}`, enemy.x, enemy.y, '#00FFFF');
                    this.projectiles.splice(pIndex, 1);
                    
                    if (enemy.health <= 0) {
                        this.gameState.score += 300;
                        this.spawnItem(enemy.x, enemy.y);
                    }
                }
            });
        });
        
        // 玩家收集道具
        this.items.forEach((item, index) => {
            if (this.player.x < item.x + item.width &&
                this.player.x + this.player.width > item.x &&
                this.player.y < item.y + item.height &&
                this.player.y + this.player.height > item.y) {
                
                switch(item.type) {
                    case 'heart':
                        this.gameState.hearts++;
                        this.addEffect('+1 ♥', item.x, item.y, '#FF1493');
                        break;
                    case 'potion':
                        this.player.health = Math.min(100, this.player.health + 30);
                        this.addEffect('+30 HP', item.x, item.y, '#32CD32');
                        break;
                }
                
                this.items.splice(index, 1);
            }
        });
    }

    checkPlatformCollisions() {
        const p = this.player;
        p.onGround = false;
        
        this.platforms.forEach(platform => {
            if (p.x < platform.x + platform.width &&
                p.x + p.width > platform.x &&
                p.y - p.jumpHeight + p.height > platform.y &&
                p.y - p.jumpHeight < platform.y + platform.height) {
                
                // 从上方落到平台上
                if (p.jumpSpeed <= 0 && p.y - p.jumpHeight <= platform.y) {
                    p.y = platform.y;
                    p.jumpHeight = 0;
                    p.jumpSpeed = 0;
                    p.isJumping = false;
                    p.onGround = true;
                }
            }
        });
    }

    spawnItem(x, y) {
        if (Math.random() < 0.4) {
            const itemType = Math.random() < 0.6 ? 'heart' : 'potion';
            this.items.push({
                x: x,
                y: y,
                width: 16,
                height: 16,
                type: itemType,
                lifeTime: 400
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
        document.getElementById('playerHp').textContent = Math.max(0, this.player.health);
        document.getElementById('score').textContent = this.gameState.score;
        document.getElementById('hearts').textContent = this.gameState.hearts;
        
        // 游戏结束检查
        if (this.player.health <= 0) {
            this.gameRunning = false;
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#8B0000';
            this.ctx.font = '36px Arial';
            this.ctx.fillText('德古拉获胜!', 260, 200);
            this.ctx.fillStyle = '#FFF';
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
        this.gameState = { score: 0, hearts: 5, level: 1 };
        this.enemies = [];
        this.items = [];
        this.projectiles = [];
        this.effects = [];
        this.player = {
            x: 100,
            y: 300,
            width: 30,
            height: 50,
            health: 100,
            speed: 3,
            isAttacking: false,
            isJumping: false,
            jumpHeight: 0,
            jumpSpeed: 0,
            direction: 1,
            onGround: true,
            weapon: 'whip'
        };
        this.setupGame();
    }
}

// 初始化游戏
window.onload = () => {
    new CastlevaniaGame();
};