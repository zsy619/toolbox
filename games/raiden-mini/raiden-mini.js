class RaidenMini {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameState = 'menu';
        this.keys = {};
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.powerups = [];
        this.stars = [];
        this.score = 0;
        this.lives = 3;
        this.wave = 1;
        this.enemySpawnTimer = 0;
        this.starSpawnTimer = 0;
        
        this.init();
    }

    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.initPlayer();
        this.initStars();
        this.gameLoop();
    }

    createCanvas() {
        const container = document.getElementById('gameCanvas');
        this.canvas = document.createElement('canvas');
        this.canvas.width = 600;
        this.canvas.height = 800;
        this.ctx = this.canvas.getContext('2d');
        container.appendChild(this.canvas);
        
        this.canvas.style.border = '3px solid #333';
        this.canvas.style.borderRadius = '10px';
        this.canvas.style.backgroundColor = '#000';
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
            x: this.canvas.width / 2 - 25,
            y: this.canvas.height - 100,
            width: 50,
            height: 60,
            speed: 6,
            health: 100,
            maxHealth: 100,
            shootCooldown: 0,
            weapon: 'normal',
            color: '#00FF00'
        };
    }

    initStars() {
        this.stars = [];
        for (let i = 0; i < 50; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 3 + 1,
                size: Math.random() * 2 + 1
            });
        }
    }

    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.lives = 3;
        this.wave = 1;
        this.enemySpawnTimer = 0;
        this.initPlayer();
        this.enemies = [];
        this.bullets = [];
        this.powerups = [];
        
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

        // 移动控制
        if (this.keys['a'] || this.keys['ArrowLeft']) {
            this.player.x = Math.max(0, this.player.x - this.player.speed);
        }
        if (this.keys['d'] || this.keys['ArrowRight']) {
            this.player.x = Math.min(this.canvas.width - this.player.width, this.player.x + this.player.speed);
        }
        if (this.keys['w'] || this.keys['ArrowUp']) {
            this.player.y = Math.max(0, this.player.y - this.player.speed);
        }
        if (this.keys['s'] || this.keys['ArrowDown']) {
            this.player.y = Math.min(this.canvas.height - this.player.height, this.player.y + this.player.speed);
        }

        // 自动射击
        if (this.player.shootCooldown <= 0) {
            this.playerShoot();
            this.player.shootCooldown = 10;
        }

        if (this.player.shootCooldown > 0) this.player.shootCooldown--;
    }

    playerShoot() {
        const bullet = {
            x: this.player.x + this.player.width / 2 - 2,
            y: this.player.y,
            width: 4,
            height: 15,
            speed: 12,
            color: '#FFFF00',
            type: 'player'
        };
        this.bullets.push(bullet);
    }

    updateEnemies() {
        if (this.gameState !== 'playing') return;

        // 生成敌人
        this.enemySpawnTimer++;
        if (this.enemySpawnTimer > 60 - this.wave * 5) {
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
        }

        // 更新敌人
        this.enemies = this.enemies.filter(enemy => {
            enemy.y += enemy.speed;
            
            // 敌人射击
            if (enemy.shootCooldown <= 0 && Math.random() < 0.02) {
                this.enemyShoot(enemy);
                enemy.shootCooldown = 30;
            }
            if (enemy.shootCooldown > 0) enemy.shootCooldown--;
            
            // 移除屏幕外的敌人
            if (enemy.y > this.canvas.height) {
                return false;
            }
            
            // 敌人与玩家碰撞
            if (enemy.x < this.player.x + this.player.width &&
                enemy.x + enemy.width > this.player.x &&
                enemy.y < this.player.y + this.player.height &&
                enemy.y + enemy.height > this.player.y) {
                
                this.player.health -= 50;
                if (this.player.health <= 0) {
                    this.playerDie();
                }
                return false;
            }
            
            return true;
        });
    }

    spawnEnemy() {
        const enemyTypes = ['basic', 'fast', 'heavy'];
        const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        
        let enemy = {
            x: Math.random() * (this.canvas.width - 40),
            y: -50,
            width: 40,
            height: 40,
            speed: 2,
            health: 25,
            maxHealth: 25,
            shootCooldown: 0,
            type: type,
            color: '#FF0000'
        };
        
        switch (type) {
            case 'fast':
                enemy.speed = 4;
                enemy.health = 15;
                enemy.color = '#FF8000';
                break;
            case 'heavy':
                enemy.speed = 1;
                enemy.health = 50;
                enemy.width = 60;
                enemy.height = 50;
                enemy.color = '#8000FF';
                break;
        }
        
        this.enemies.push(enemy);
    }

    enemyShoot(enemy) {
        const bullet = {
            x: enemy.x + enemy.width / 2 - 2,
            y: enemy.y + enemy.height,
            width: 4,
            height: 10,
            speed: 6,
            color: '#FF0000',
            type: 'enemy'
        };
        this.bullets.push(bullet);
    }

    updateBullets() {
        if (this.gameState !== 'playing') return;

        this.bullets = this.bullets.filter(bullet => {
            if (bullet.type === 'player') {
                bullet.y -= bullet.speed;
                
                // 检查与敌人碰撞
                for (let i = this.enemies.length - 1; i >= 0; i--) {
                    const enemy = this.enemies[i];
                    if (bullet.x < enemy.x + enemy.width &&
                        bullet.x + bullet.width > enemy.x &&
                        bullet.y < enemy.y + enemy.height &&
                        bullet.y + bullet.height > enemy.y) {
                        
                        enemy.health -= 25;
                        this.score += 10;
                        
                        if (enemy.health <= 0) {
                            this.enemies.splice(i, 1);
                            this.score += 50;
                            
                            // 掉落道具
                            if (Math.random() < 0.2) {
                                this.createPowerup(enemy.x, enemy.y);
                            }
                        }
                        
                        return false; // 移除子弹
                    }
                }
                
                return bullet.y > -bullet.height;
            } else {
                bullet.y += bullet.speed;
                
                // 检查与玩家碰撞
                if (bullet.x < this.player.x + this.player.width &&
                    bullet.x + bullet.width > this.player.x &&
                    bullet.y < this.player.y + this.player.height &&
                    bullet.y + bullet.height > this.player.y) {
                    
                    this.player.health -= 10;
                    if (this.player.health <= 0) {
                        this.playerDie();
                    }
                    return false;
                }
                
                return bullet.y < this.canvas.height;
            }
        });
    }

    createPowerup(x, y) {
        const powerup = {
            x: x,
            y: y,
            width: 25,
            height: 25,
            speed: 2,
            type: Math.random() > 0.5 ? 'health' : 'weapon',
            color: Math.random() > 0.5 ? '#00FF00' : '#0000FF'
        };
        this.powerups.push(powerup);
    }

    updatePowerups() {
        if (this.gameState !== 'playing') return;

        this.powerups = this.powerups.filter(powerup => {
            powerup.y += powerup.speed;
            
            // 检查玩家收集
            if (powerup.x < this.player.x + this.player.width &&
                powerup.x + powerup.width > this.player.x &&
                powerup.y < this.player.y + this.player.height &&
                powerup.y + powerup.height > this.player.y) {
                
                if (powerup.type === 'health') {
                    this.player.health = Math.min(this.player.health + 30, this.player.maxHealth);
                } else {
                    this.player.weapon = 'spread';
                }
                
                this.score += 20;
                return false;
            }
            
            return powerup.y < this.canvas.height;
        });
    }

    updateStars() {
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = -star.size;
                star.x = Math.random() * this.canvas.width;
            }
        });
    }

    playerDie() {
        this.lives--;
        if (this.lives <= 0) {
            this.gameState = 'gameOver';
        } else {
            this.player.health = this.player.maxHealth;
            this.player.x = this.canvas.width / 2 - 25;
            this.player.y = this.canvas.height - 100;
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
        // 星空背景
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#FFF';
        this.stars.forEach(star => {
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        });
    }

    drawMenu() {
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('雷电', this.canvas.width / 2, 200);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '20px Arial';
        this.ctx.fillText('WASD 或 方向键移动', this.canvas.width / 2, 300);
        this.ctx.fillText('自动射击，消灭所有敌机!', this.canvas.width / 2, 340);
        this.ctx.fillText('收集道具增强火力和血量', this.canvas.width / 2, 380);
        this.ctx.fillText('点击开始游戏按钮开始战斗!', this.canvas.width / 2, 450);
    }

    drawGame() {
        // 绘制玩家
        this.drawPlayer();
        
        // 绘制敌人
        this.enemies.forEach(enemy => this.drawEnemy(enemy));
        
        // 绘制子弹
        this.bullets.forEach(bullet => this.drawBullet(bullet));
        
        // 绘制道具
        this.powerups.forEach(powerup => this.drawPowerup(powerup));
        
        // 绘制UI
        this.drawUI();
        
        if (this.gameState === 'paused') {
            this.drawPauseScreen();
        } else if (this.gameState === 'gameOver') {
            this.drawGameOverScreen();
        }
    }

    drawPlayer() {
        // 主体
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // 机翼
        this.ctx.fillStyle = '#008000';
        this.ctx.fillRect(this.player.x - 10, this.player.y + 20, 70, 20);
        
        // 驾驶舱
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.fillRect(this.player.x + 20, this.player.y + 10, 10, 15);
    }

    drawEnemy(enemy) {
        this.ctx.fillStyle = enemy.color;
        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        
        // 血条
        if (enemy.health < enemy.maxHealth) {
            this.ctx.fillStyle = '#333';
            this.ctx.fillRect(enemy.x, enemy.y - 8, enemy.width, 4);
            this.ctx.fillStyle = '#FF0000';
            this.ctx.fillRect(enemy.x, enemy.y - 8, (enemy.health / enemy.maxHealth) * enemy.width, 4);
        }
    }

    drawBullet(bullet) {
        this.ctx.fillStyle = bullet.color;
        this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }

    drawPowerup(powerup) {
        this.ctx.fillStyle = powerup.color;
        this.ctx.fillRect(powerup.x, powerup.y, powerup.width, powerup.height);
        
        // 图标
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'center';
        const text = powerup.type === 'health' ? '+' : 'W';
        this.ctx.fillText(text, powerup.x + powerup.width/2, powerup.y + powerup.height/2 + 5);
    }

    drawUI() {
        // 血条
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(20, 20, 200, 15);
        this.ctx.fillStyle = '#00FF00';
        this.ctx.fillRect(20, 20, (this.player.health / this.player.maxHealth) * 200, 15);
        
        // UI文字
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`得分: ${this.score}`, 20, 60);
        this.ctx.fillText(`生命: ${this.lives}`, 20, 80);
        this.ctx.fillText(`波次: ${this.wave}`, 20, 100);
        
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`敌机: ${this.enemies.length}`, this.canvas.width - 20, 60);
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
        
        this.ctx.fillStyle = '#FF0000';
        this.ctx.font = 'bold 48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('游戏结束', this.canvas.width / 2, this.canvas.height / 2 - 50);
        
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText(`最终得分: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 20);
        
        this.ctx.font = '18px Arial';
        this.ctx.fillText('点击重新开始按钮再次挑战', this.canvas.width / 2, this.canvas.height / 2 + 80);
    }

    gameLoop() {
        this.updatePlayer();
        this.updateEnemies();
        this.updateBullets();
        this.updatePowerups();
        this.updateStars();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new RaidenMini();
});
