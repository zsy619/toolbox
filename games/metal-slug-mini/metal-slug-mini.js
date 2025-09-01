// 合金弹头游戏逻辑
class MetalSlugGame {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 400;
        this.canvas.id = 'slugCanvas';
        
        const gameCanvas = document.getElementById('gameCanvas');
        gameCanvas.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.gameRunning = false;
        this.score = 0;
        this.lives = 3;
        
        this.player = {
            x: 50,
            y: 300,
            width: 30,
            height: 40,
            speed: 5
        };
        
        this.enemies = [];
        this.bullets = [];
        
        this.setupControls();
        this.setupGame();
    }

    setupControls() {
        document.getElementById('startBtn').onclick = () => this.startGame();
        document.getElementById('pauseBtn').onclick = () => this.pauseGame();
        
        // 键盘控制
        this.keys = {};
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    setupGame() {
        // 绘制初始界面
        this.ctx.fillStyle = '#4a5568';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制地面
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, 350, this.canvas.width, 50);
        
        // 绘制玩家
        this.drawPlayer();
        
        // 游戏标题
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = '24px Arial';
        this.ctx.fillText('合金弹头 - 准备作战！', 250, 200);
    }

    drawPlayer() {
        this.ctx.fillStyle = '#FF6B35';
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // 简单的士兵头盔
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(this.player.x + 5, this.player.y - 10, 20, 15);
    }

    drawEnemies() {
        this.enemies.forEach(enemy => {
            this.ctx.fillStyle = '#DC143C';
            this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }

    drawBullets() {
        this.bullets.forEach(bullet => {
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }

    updateGame() {
        if (!this.gameRunning) return;
        
        // 清空画布
        this.ctx.fillStyle = '#4a5568';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制地面
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(0, 350, this.canvas.width, 50);
        
        // 处理输入
        this.handleInput();
        
        // 更新游戏对象
        this.updateBullets();
        this.updateEnemies();
        this.spawnEnemies();
        this.checkCollisions();
        
        // 绘制所有对象
        this.drawPlayer();
        this.drawEnemies();
        this.drawBullets();
        
        // 显示分数
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`分数: ${this.score}`, 10, 30);
        this.ctx.fillText(`生命: ${this.lives}`, 10, 50);
        
        requestAnimationFrame(() => this.updateGame());
    }

    handleInput() {
        if (this.keys['a'] && this.player.x > 0) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['d'] && this.player.x < this.canvas.width - this.player.width) {
            this.player.x += this.player.speed;
        }
        if (this.keys['w'] && this.player.y > 0) {
            this.player.y -= this.player.speed;
        }
        if (this.keys['s'] && this.player.y < 350 - this.player.height) {
            this.player.y += this.player.speed;
        }
        if (this.keys[' '] || this.keys['j']) {
            this.shoot();
        }
    }

    shoot() {
        if (Date.now() - (this.lastShot || 0) > 200) {
            this.bullets.push({
                x: this.player.x + this.player.width,
                y: this.player.y + this.player.height / 2,
                width: 8,
                height: 3,
                speed: 8
            });
            this.lastShot = Date.now();
        }
    }

    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            bullet.x += bullet.speed;
            return bullet.x < this.canvas.width;
        });
    }

    spawnEnemies() {
        if (Math.random() < 0.02) {
            this.enemies.push({
                x: this.canvas.width,
                y: 300 + Math.random() * 50,
                width: 25,
                height: 35,
                speed: 2
            });
        }
    }

    updateEnemies() {
        this.enemies = this.enemies.filter(enemy => {
            enemy.x -= enemy.speed;
            return enemy.x > -enemy.width;
        });
    }

    checkCollisions() {
        // 子弹击中敌人
        this.bullets.forEach((bullet, bIndex) => {
            this.enemies.forEach((enemy, eIndex) => {
                if (bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y) {
                    this.bullets.splice(bIndex, 1);
                    this.enemies.splice(eIndex, 1);
                    this.score += 100;
                }
            });
        });
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
}

// 初始化游戏
window.onload = () => {
    new MetalSlugGame();
};