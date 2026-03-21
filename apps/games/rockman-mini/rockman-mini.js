class RockmanMini {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameState = 'menu';
        this.keys = {};
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.platforms = [];
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.camera = { x: 0, y: 0 };
        this.levelWidth = 1600;
        
        this.init();
    }

    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.initPlayer();
        this.initLevel();
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
        this.canvas.style.backgroundColor = '#87CEEB';
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
            width: 40,
            height: 50,
            velocityX: 0,
            velocityY: 0,
            speed: 4,
            jumpPower: 14,
            health: 100,
            maxHealth: 100,
            grounded: true,
            facing: 1,
            shooting: false,
            shootCooldown: 0,
            color: '#4169E1',
            invulnerable: 0
        };
    }

    initLevel() {
        this.platforms = [
            { x: 300, y: 250, width: 100, height: 20 },
            { x: 500, y: 200, width: 100, height: 20 },
            { x: 700, y: 150, width: 100, height: 20 },
            { x: 900, y: 300, width: 150, height: 20 },
            { x: 1200, y: 250, width: 100, height: 20 },
            { x: 1400, y: 200, width: 100, height: 20 }
        ];
        
        // 生成初始敌人
        for (let i = 0; i < 5; i++) {
            this.spawnEnemy();
        }
    }

    startGame() {
        this.gameState = 'playing';
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.camera = { x: 0, y: 0 };
        this.initPlayer();
        this.enemies = [];
        this.bullets = [];
        this.initLevel();
        
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
            this.player.velocityY += 0.6;
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

        // 射击
        if ((this.keys[' '] || this.keys['f']) && this.player.shootCooldown <= 0) {
            this.shoot();
        }

        // 更新位置
        this.player.x += this.player.velocityX;
        this.player.y += this.player.velocityY;

        // 平台碰撞检测
        this.checkPlatformCollision();

        // 地面碰撞
        if (this.player.y >= 330) {
            this.player.y = 330;
            this.player.velocityY = 0;
            this.player.grounded = true;
        }

        // 边界限制
        this.player.x = Math.max(0, Math.min(this.levelWidth - this.player.width, this.player.x));

        // 更新摄像头
        this.updateCamera();

        // 更新冷却时间
        if (this.player.shootCooldown > 0) this.player.shootCooldown--;
        if (this.player.invulnerable > 0) this.player.invulnerable--;
    }

    checkPlatformCollision() {
        this.platforms.forEach(platform => {
            if (this.player.x < platform.x + platform.width &&
                this.player.x + this.player.width > platform.x &&
                this.player.y < platform.y + platform.height &&
                this.player.y + this.player.height > platform.y) {
                
                // 从上方着陆
                if (this.player.velocityY > 0 && this.player.y < platform.y) {
                    this.player.y = platform.y - this.player.height;
                    this.player.velocityY = 0;
                    this.player.grounded = true;
                }
            }
        });
    }

    shoot() {
        this.player.shooting = true;
        this.player.shootCooldown = 15;
        
        const bullet = {
            x: this.player.x + (this.player.facing === 1 ? this.player.width : 0),
            y: this.player.y + this.player.height / 2,
            width: 8,
            height: 4,
            velocityX: this.player.facing * 8,
            velocityY: 0,
            color: '#FFD700',
            type: 'player'
        };
        
        this.bullets.push(bullet);
        
        setTimeout(() => {
            this.player.shooting = false;
        }, 150);
    }

    updateBullets() {
        if (this.gameState !== 'playing') return;

        this.bullets = this.bullets.filter(bullet => {
            bullet.x += bullet.velocityX;
            bullet.y += bullet.velocityY;
            
            // 移除屏幕外的子弹
            if (bullet.x < 0 || bullet.x > this.levelWidth || bullet.y < 0 || bullet.y > this.canvas.height) {
                return false;
            }
            
            // 子弹碰撞检测
            if (bullet.type === 'player') {
                // 玩家子弹击中敌人
                this.enemies.forEach((enemy, enemyIndex) => {
                    if (bullet.x < enemy.x + enemy.width &&
                        bullet.x + bullet.width > enemy.x &&
                        bullet.y < enemy.y + enemy.height &&
                        bullet.y + bullet.height > enemy.y) {
                        
                        enemy.health -= 25;
                        this.score += 10;
                        
                        if (enemy.health <= 0) {
                            this.enemies.splice(enemyIndex, 1);
                            this.score += 50;
                        }
                        
                        return false; // 移除子弹
                    }
                });
            } else {
                // 敌人子弹击中玩家
                if (bullet.x < this.player.x + this.player.width &&
                    bullet.x + bullet.width > this.player.x &&
                    bullet.y < this.player.y + this.player.height &&
                    bullet.y + bullet.height > this.player.y &&
                    this.player.invulnerable <= 0) {
                    
                    this.player.health -= 20;
                    this.player.invulnerable = 30;
                    
                    if (this.player.health <= 0) {
                        this.playerDie();
                    }
                    
                    return false; // 移除子弹
                }
            }
            
            return true;
        });
    }

    spawnEnemy() {
        const enemy = {
            x: Math.random() * (this.levelWidth - 100) + 50,
            y: 300,
            width: 35,
            height: 45,
            velocityX: (Math.random() - 0.5) * 2,
            velocityY: 0,
            health: 50,
            maxHealth: 50,
            grounded: true,
            color: '#FF4500',
            shootCooldown: Math.random() * 60,
            type: Math.random() > 0.5 ? 'basic' : 'shooter'
        };
        this.enemies.push(enemy);
    }

    updateEnemies() {
        if (this.gameState !== 'playing') return;

        // 生成新敌人
        if (this.enemies.length < 4) {
            this.spawnEnemy();
        }

        this.enemies.forEach(enemy => {
            // 重力
            if (!enemy.grounded) {
                enemy.velocityY += 0.6;
            }

            // 简单AI
            const distanceToPlayer = this.player.x - enemy.x;
            
            if (Math.abs(distanceToPlayer) < 300) {
                if (enemy.type === 'shooter' && enemy.shootCooldown <= 0) {
                    this.enemyShoot(enemy);
                    enemy.shootCooldown = 80;
                }
                
                // 向玩家移动
                if (Math.abs(distanceToPlayer) > 50) {
                    enemy.velocityX = Math.sign(distanceToPlayer) * 1.5;
                }
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

            // 边界检测
            if (enemy.x <= 0 || enemy.x >= this.levelWidth - enemy.width) {
                enemy.velocityX *= -1;
            }

            // 更新冷却时间
            if (enemy.shootCooldown > 0) enemy.shootCooldown--;
        });
    }

    enemyShoot(enemy) {
        const bullet = {
            x: enemy.x + enemy.width / 2,
            y: enemy.y + enemy.height / 2,
            width: 6,
            height: 6,
            velocityX: Math.sign(this.player.x - enemy.x) * 4,
            velocityY: 0,
            color: '#FF0000',
            type: 'enemy'
        };
        
        this.bullets.push(bullet);
    }

    updateCamera() {
        const targetX = this.player.x - this.canvas.width / 2;
        this.camera.x = Math.max(0, Math.min(this.levelWidth - this.canvas.width, targetX));
    }

    playerDie() {
        this.lives--;
        if (this.lives <= 0) {
            this.gameState = 'gameOver';
        } else {
            this.player.x = 100;
            this.player.y = 300;
            this.player.health = this.player.maxHealth;
            this.player.invulnerable = 60;
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
        // 天空背景
        const gradient = this.ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#4682B4');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 云朵
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < 3; i++) {
            const cloudX = (i * 300 - this.camera.x * 0.5) % (this.canvas.width + 100);
            this.ctx.fillRect(cloudX, 50 + i * 20, 80, 30);
            this.ctx.fillRect(cloudX + 20, 40 + i * 20, 40, 20);
        }
        
        // 地面
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, 380, this.canvas.width, 20);
    }

    drawMenu() {
        this.ctx.fillStyle = '#4169E1';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('ROCKMAN', this.canvas.width / 2, 100);
        
        this.ctx.fillStyle = '#333';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('WASD 或 方向键移动，W跳跃', this.canvas.width / 2, 180);
        this.ctx.fillText('空格键 或 F键射击', this.canvas.width / 2, 210);
        this.ctx.fillText('消灭机器人敌人，获得高分!', this.canvas.width / 2, 250);
        this.ctx.fillText('点击开始游戏按钮开始冒险!', this.canvas.width / 2, 320);
    }

    drawGame() {
        this.ctx.save();
        this.ctx.translate(-this.camera.x, 0);
        
        // 绘制平台
        this.platforms.forEach(platform => {
            this.ctx.fillStyle = '#696969';
            this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        });
        
        // 绘制玩家
        this.drawPlayer();
        
        // 绘制敌人
        this.enemies.forEach(enemy => this.drawEnemy(enemy));
        
        // 绘制子弹
        this.bullets.forEach(bullet => this.drawBullet(bullet));
        
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
        
        // 无敌闪烁
        if (this.player.invulnerable > 0 && this.player.invulnerable % 8 < 4) {
            this.ctx.globalAlpha = 0.5;
        }
        
        // 射击光效
        if (this.player.shooting) {
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
            const muzzleX = this.player.x + (this.player.facing === 1 ? this.player.width : -10);
            this.ctx.fillRect(muzzleX, this.player.y + this.player.height/2 - 5, 10, 10);
        }
        
        // 主体
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // 头盔
        this.ctx.fillStyle = '#000080';
        this.ctx.fillRect(this.player.x + 8, this.player.y - 8, 24, 12);
        
        // 炮管
        this.ctx.fillStyle = '#FFD700';
        const cannonX = this.player.x + (this.player.facing === 1 ? this.player.width : -8);
        this.ctx.fillRect(cannonX, this.player.y + 15, 8, 6);
        
        this.ctx.restore();
    }

    drawEnemy(enemy) {
        this.ctx.fillStyle = enemy.color;
        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // 机器人特征
        this.ctx.fillStyle = '#800000';
        this.ctx.fillRect(enemy.x + 8, enemy.y - 5, 19, 8);
        
        // 眼睛
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(enemy.x + 12, enemy.y - 2, 3, 3);
        this.ctx.fillRect(enemy.x + 20, enemy.y - 2, 3, 3);
        
        // 血条
        if (enemy.health < enemy.maxHealth) {
            this.ctx.fillStyle = '#333';
            this.ctx.fillRect(enemy.x, enemy.y - 15, enemy.width, 4);
            this.ctx.fillStyle = '#FF4500';
            this.ctx.fillRect(enemy.x, enemy.y - 15, (enemy.health / enemy.maxHealth) * enemy.width, 4);
        }
    }

    drawBullet(bullet) {
        this.ctx.fillStyle = bullet.color;
        this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        
        // 光效
        if (bullet.type === 'player') {
            this.ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
            this.ctx.fillRect(bullet.x - 2, bullet.y - 2, bullet.width + 4, bullet.height + 4);
        }
    }

    drawUI() {
        // 血条
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(20, 20, 200, 20);
        this.ctx.fillStyle = '#4169E1';
        this.ctx.fillRect(20, 20, (this.player.health / this.player.maxHealth) * 200, 20);
        
        // UI文字
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`生命: ${Math.ceil(this.player.health)}`, 20, 60);
        this.ctx.fillText(`得分: ${this.score}`, 20, 80);
        this.ctx.fillText(`生命数: ${this.lives}`, 20, 100);
        
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
        
        this.ctx.fillStyle = '#4169E1';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText(`最终得分: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        
        this.ctx.font = '18px Arial';
        this.ctx.fillText('点击重新开始按钮再次挑战', this.canvas.width / 2, this.canvas.height / 2 + 80);
    }

    gameLoop() {
        this.updatePlayer();
        this.updateEnemies();
        this.updateBullets();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new RockmanMini();
});
