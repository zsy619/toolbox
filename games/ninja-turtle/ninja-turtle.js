class NinjaTurtleMini {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.keys = {};
        this.player = null;
        this.enemies = [];
        this.items = [];
        this.level = 1;
        this.maxLevel = 5;
        this.score = 0;
        this.lives = 3;
        this.camera = { x: 0, y: 0 };
        this.levelWidth = 1600;
        this.enemySpawnTimer = 0;
        this.particles = [];
        
        this.init();
    }

    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.initPlayer();
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
        this.canvas.style.backgroundColor = '#2c3e50';
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

    initPlayer() {
        this.player = {
            x: 100,
            y: 300,
            width: 50,
            height: 60,
            velocityX: 0,
            velocityY: 0,
            speed: 5,
            jumpPower: 15,
            health: 100,
            maxHealth: 100,
            grounded: true,
            facing: 1, // 1 = right, -1 = left
            attacking: false,
            attackCooldown: 0,
            color: '#27ae60', // 绿色忍者龟
            weapon: 'katana',
            invulnerable: 0
        };
    }

    startGame() {
        this.gameState = 'playing';
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.camera = { x: 0, y: 0 };
        this.initPlayer();
        this.enemies = [];
        this.items = [];
        this.enemySpawnTimer = 0;
        this.particles = [];
        
        document.getElementById('startBtn').textContent = '重新开始';
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseBtn').textContent = '继续';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseBtn').textContent = '暂停';
        }
    }

    updatePlayer() {
        if (this.gameState !== 'playing') return;

        // 重力
        if (!this.player.grounded) {
            this.player.velocityY += 0.8;
        }

        // 移动控制
        this.player.velocityX = 0;
        if (this.keys['a'] || this.keys['ArrowLeft']) {
            this.player.velocityX = -this.player.speed;
            this.player.facing = -1;
        }
        if (this.keys['d'] || this.keys['ArrowRight']) {
            this.player.velocityX = this.player.speed;
            this.player.facing = 1;
        }

        // 跳跃
        if ((this.keys['w'] || this.keys['ArrowUp']) && this.player.grounded) {
            this.player.velocityY = -this.player.jumpPower;
            this.player.grounded = false;
        }

        // 攻击
        if ((this.keys[' '] || this.keys['f']) && this.player.attackCooldown <= 0) {
            this.performAttack();
        }

        // 更新位置
        this.player.x += this.player.velocityX;
        this.player.y += this.player.velocityY;

        // 地面碰撞
        if (this.player.y >= 300) {
            this.player.y = 300;
            this.player.velocityY = 0;
            this.player.grounded = true;
        }

        // 边界限制
        this.player.x = Math.max(0, Math.min(this.levelWidth - this.player.width, this.player.x));

        // 更新摄像头
        this.updateCamera();

        // 更新攻击冷却和无敌时间
        if (this.player.attackCooldown > 0) this.player.attackCooldown--;
        if (this.player.invulnerable > 0) this.player.invulnerable--;
    }

    performAttack() {
        this.player.attacking = true;
        this.player.attackCooldown = 20;

        // 攻击范围
        const attackRange = 80;
        const attackX = this.player.x + (this.player.facing === 1 ? this.player.width : -attackRange);
        const attackY = this.player.y;

        // 检查敌人碰撞
        this.enemies.forEach((enemy, index) => {
            if (enemy.x < attackX + attackRange && 
                enemy.x + enemy.width > attackX &&
                enemy.y < attackY + this.player.height &&
                enemy.y + enemy.height > attackY) {
                
                // 击中敌人
                enemy.health -= 25;
                this.score += 10;
                
                // 击退效果
                enemy.velocityX = this.player.facing * 5;
                
                // 创建粒子效果
                this.createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#ff4757');
                
                if (enemy.health <= 0) {
                    this.enemies.splice(index, 1);
                    this.score += 50;
                    
                    // 随机掉落道具
                    if (Math.random() < 0.3) {
                        this.createItem(enemy.x, enemy.y);
                    }
                }
            }
        });

        setTimeout(() => {
            this.player.attacking = false;
        }, 200);
    }

    updateEnemies() {
        if (this.gameState !== 'playing') return;

        // 生成敌人
        this.enemySpawnTimer++;
        if (this.enemySpawnTimer > 120 && this.enemies.length < 5) {
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
        }

        // 更新敌人
        this.enemies.forEach(enemy => {
            // 简单AI：向玩家移动
            const distanceToPlayer = this.player.x - enemy.x;
            
            if (Math.abs(distanceToPlayer) > 50) {
                enemy.velocityX = Math.sign(distanceToPlayer) * 2;
                enemy.facing = Math.sign(distanceToPlayer);
            } else {
                enemy.velocityX = 0;
                // 攻击玩家
                if (enemy.attackCooldown <= 0) {
                    this.enemyAttack(enemy);
                }
            }

            // 重力
            if (!enemy.grounded) {
                enemy.velocityY += 0.8;
            }

            // 更新位置
            enemy.x += enemy.velocityX;
            enemy.y += enemy.velocityY;

            // 地面碰撞
            if (enemy.y >= 300) {
                enemy.y = 300;
                enemy.velocityY = 0;
                enemy.grounded = true;
            }

            // 边界限制
            enemy.x = Math.max(0, Math.min(this.levelWidth - enemy.width, enemy.x));

            // 更新冷却时间
            if (enemy.attackCooldown > 0) enemy.attackCooldown--;
        });
    }

    spawnEnemy() {
        const spawnX = this.player.x + (Math.random() > 0.5 ? 1 : -1) * (400 + Math.random() * 200);
        const enemy = {
            x: Math.max(0, Math.min(this.levelWidth - 50, spawnX)),
            y: 300,
            width: 45,
            height: 55,
            velocityX: 0,
            velocityY: 0,
            health: 50,
            maxHealth: 50,
            grounded: true,
            facing: 1,
            attackCooldown: 0,
            color: '#e74c3c',
            type: Math.random() > 0.7 ? 'foot_soldier' : 'shredder'
        };
        this.enemies.push(enemy);
    }

    enemyAttack(enemy) {
        enemy.attackCooldown = 40;
        
        const attackRange = 60;
        const distance = Math.abs(this.player.x - enemy.x);
        
        if (distance < attackRange && this.player.invulnerable <= 0) {
            this.player.health -= 15;
            this.player.invulnerable = 30;
            
            // 击退玩家
            this.player.velocityX = enemy.facing * 3;
            
            // 创建受伤粒子
            this.createParticles(this.player.x + this.player.width/2, this.player.y + this.player.height/2, '#ff6b6b');
            
            if (this.player.health <= 0) {
                this.playerDie();
            }
        }
    }

    createItem(x, y) {
        const itemTypes = ['pizza', 'star', 'heart'];
        const item = {
            x: x,
            y: y,
            width: 30,
            height: 30,
            type: itemTypes[Math.floor(Math.random() * itemTypes.length)],
            collected: false
        };
        this.items.push(item);
    }

    updateItems() {
        if (this.gameState !== 'playing') return;

        this.items.forEach((item, index) => {
            // 检查玩家收集
            if (this.player.x < item.x + item.width &&
                this.player.x + this.player.width > item.x &&
                this.player.y < item.y + item.height &&
                this.player.y + this.player.height > item.y) {
                
                switch (item.type) {
                    case 'pizza':
                        this.player.health = Math.min(this.player.health + 30, this.player.maxHealth);
                        this.score += 20;
                        break;
                    case 'star':
                        this.score += 100;
                        break;
                    case 'heart':
                        this.player.health = this.player.maxHealth;
                        this.score += 50;
                        break;
                }
                
                this.createParticles(item.x + item.width/2, item.y + item.height/2, '#2ecc71');
                this.items.splice(index, 1);
            }
        });
    }

    createParticles(x, y, color) {
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                velocityX: (Math.random() - 0.5) * 8,
                velocityY: (Math.random() - 0.5) * 8,
                life: 30,
                maxLife: 30,
                color: color
            });
        }
    }

    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.life--;
            return particle.life > 0;
        });
    }

    updateCamera() {
        // 摄像头跟随玩家
        const targetX = this.player.x - this.canvas.width / 2;
        this.camera.x = Math.max(0, Math.min(this.levelWidth - this.canvas.width, targetX));
    }

    playerDie() {
        this.lives--;
        if (this.lives <= 0) {
            this.gameState = 'gameOver';
        } else {
            // 重置玩家位置和血量
            this.player.x = 100;
            this.player.y = 300;
            this.player.health = this.player.maxHealth;
            this.player.invulnerable = 60;
            this.enemies = [];
        }
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
        // 城市背景
        const gradient = this.ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#34495e');
        gradient.addColorStop(1, '#2c3e50');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 建筑物轮廓
        this.ctx.fillStyle = '#1a252f';
        for (let i = 0; i < 10; i++) {
            const buildingX = (i * 150 - this.camera.x) % (this.canvas.width + 150);
            const buildingHeight = 150 + Math.sin(i) * 50;
            this.ctx.fillRect(buildingX, 400 - buildingHeight, 120, buildingHeight);
        }
        
        // 地面
        this.ctx.fillStyle = '#7f8c8d';
        this.ctx.fillRect(0, 380, this.canvas.width, 20);
    }

    drawMenu() {
        this.ctx.fillStyle = '#2ecc71';
        this.ctx.font = 'bold 42px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('NINJA TURTLES', this.canvas.width / 2, 100);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('WASD 或 方向键移动', this.canvas.width / 2, 180);
        this.ctx.fillText('空格键 或 F键攻击', this.canvas.width / 2, 210);
        this.ctx.fillText('击败敌人，收集道具，保护城市!', this.canvas.width / 2, 250);
        this.ctx.fillText('点击开始游戏按钮开始冒险!', this.canvas.width / 2, 320);
    }

    drawGame() {
        this.ctx.save();
        this.ctx.translate(-this.camera.x, 0);
        
        // 绘制玩家
        this.drawPlayer();
        
        // 绘制敌人
        this.enemies.forEach(enemy => this.drawEnemy(enemy));
        
        // 绘制道具
        this.items.forEach(item => this.drawItem(item));
        
        // 绘制粒子
        this.drawParticles();
        
        this.ctx.restore();
        
        // 绘制UI
        this.drawUI();
        
        if (this.gameState === 'paused') {
            this.drawPauseScreen();
        } else if (this.gameState === 'gameOver') {
            this.drawGameOverScreen();
        }
    }

    drawPlayer() {
        this.ctx.save();
        
        // 无敌闪烁效果
        if (this.player.invulnerable > 0 && this.player.invulnerable % 10 < 5) {
            this.ctx.globalAlpha = 0.5;
        }
        
        // 攻击效果
        if (this.player.attacking) {
            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.6)';
            const attackX = this.player.x + (this.player.facing === 1 ? this.player.width : -80);
            this.ctx.fillRect(attackX, this.player.y, 80, this.player.height);
        }
        
        // 玩家主体
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // 龟壳
        this.ctx.fillStyle = '#16a085';
        this.ctx.fillRect(this.player.x + 5, this.player.y + 15, this.player.width - 10, 30);
        
        // 头部
        this.ctx.fillStyle = '#2ecc71';
        this.ctx.fillRect(this.player.x + 15, this.player.y - 10, 20, 15);
        
        // 眼睛
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.player.x + 18, this.player.y - 7, 3, 3);
        this.ctx.fillRect(this.player.x + 29, this.player.y - 7, 3, 3);
        
        this.ctx.restore();
    }

    drawEnemy(enemy) {
        // 敌人主体
        this.ctx.fillStyle = enemy.color;
        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // 头部
        this.ctx.fillStyle = '#c0392b';
        this.ctx.fillRect(enemy.x + 10, enemy.y - 8, 25, 12);
        
        // 眼睛
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(enemy.x + 15, enemy.y - 5, 3, 3);
        this.ctx.fillRect(enemy.x + 27, enemy.y - 5, 3, 3);
        
        // 血条
        if (enemy.health < enemy.maxHealth) {
            this.ctx.fillStyle = '#333';
            this.ctx.fillRect(enemy.x, enemy.y - 20, enemy.width, 6);
            this.ctx.fillStyle = '#e74c3c';
            this.ctx.fillRect(enemy.x, enemy.y - 20, (enemy.health / enemy.maxHealth) * enemy.width, 6);
        }
    }

    drawItem(item) {
        switch (item.type) {
            case 'pizza':
                this.ctx.fillStyle = '#f39c12';
                this.ctx.fillRect(item.x, item.y, item.width, item.height);
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.fillRect(item.x + 5, item.y + 5, item.width - 10, item.height - 10);
                break;
            case 'star':
                this.ctx.fillStyle = '#f1c40f';
                this.ctx.fillRect(item.x + 10, item.y, 10, item.height);
                this.ctx.fillRect(item.x, item.y + 10, item.width, 10);
                break;
            case 'heart':
                this.ctx.fillStyle = '#e74c3c';
                this.ctx.fillRect(item.x + 5, item.y + 5, 20, 20);
                this.ctx.fillRect(item.x + 10, item.y, 10, 10);
                break;
        }
    }

    drawParticles() {
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife;
            this.ctx.fillStyle = particle.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
            this.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
        });
    }

    drawUI() {
        // 血条
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(20, 20, 200, 20);
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(20, 20, (this.player.health / this.player.maxHealth) * 200, 20);
        
        // UI文字
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`生命: ${Math.ceil(this.player.health)}`, 20, 60);
        this.ctx.fillText(`得分: ${this.score}`, 20, 80);
        this.ctx.fillText(`生命数: ${this.lives}`, 20, 100);
        this.ctx.fillText(`关卡: ${this.level}`, 20, 120);
        
        // 敌人数量
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`敌人: ${this.enemies.length}`, 780, 60);
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
        
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText(`最终得分: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        
        this.ctx.font = '18px Arial';
        this.ctx.fillText('点击重新开始按钮再次挑战', this.canvas.width / 2, this.canvas.height / 2 + 80);
    }

    gameLoop() {
        this.updatePlayer();
        this.updateEnemies();
        this.updateItems();
        this.updateParticles();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new NinjaTurtleMini();
});
