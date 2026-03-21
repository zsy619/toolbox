class PacmanGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.cols = 40;
        this.rows = 30;
        
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameState = 'ready'; // ready, playing, paused, gameOver
        
        this.pacman = {
            x: 20, y: 20, direction: 'right', nextDirection: 'right',
            size: 18, speed: 1, mouthAngle: 0
        };
        
        this.ghosts = [
            { x: 380, y: 280, color: '#FF0000', direction: 'up', scared: false, scaredTime: 0 },
            { x: 400, y: 280, color: '#00FFFF', direction: 'up', scared: false, scaredTime: 0 },
            { x: 420, y: 280, color: '#FFB8FF', direction: 'up', scared: false, scaredTime: 0 },
            { x: 440, y: 280, color: '#FFB852', direction: 'up', scared: false, scaredTime: 0 }
        ];
        
        this.dots = [];
        this.powerPellets = [];
        this.walls = [];
        this.fruits = [];
        
        this.keys = {};
        this.powerMode = false;
        this.powerModeTime = 0;
        
        this.init();
    }
    
    init() {
        this.generateMaze();
        this.bindEvents();
        this.gameLoop();
    }
    
    generateMaze() {
        // 创建迷宫墙壁
        this.walls = [];
        
        // 外墙
        for (let x = 0; x < this.cols; x++) {
            this.walls.push({ x: x * this.gridSize, y: 0 });
            this.walls.push({ x: x * this.gridSize, y: (this.rows - 1) * this.gridSize });
        }
        for (let y = 0; y < this.rows; y++) {
            this.walls.push({ x: 0, y: y * this.gridSize });
            this.walls.push({ x: (this.cols - 1) * this.gridSize, y: y * this.gridSize });
        }
        
        // 内部墙壁（简化版）
        const wallPattern = [
            [3, 3, 5, 3], [8, 3, 10, 3], [13, 3, 15, 3], [18, 3, 20, 3],
            [25, 3, 27, 3], [30, 3, 32, 3], [35, 3, 37, 3],
            [3, 6, 3, 8], [10, 6, 10, 8], [15, 6, 15, 8], [25, 6, 25, 8],
            [30, 6, 30, 8], [37, 6, 37, 8]
        ];
        
        wallPattern.forEach(([x1, y1, x2, y2]) => {
            for (let x = x1; x <= x2; x++) {
                for (let y = y1; y <= y2; y++) {
                    this.walls.push({ x: x * this.gridSize, y: y * this.gridSize });
                }
            }
        });
        
        // 生成豆子
        this.dots = [];
        for (let x = 1; x < this.cols - 1; x++) {
            for (let y = 1; y < this.rows - 1; y++) {
                const pos = { x: x * this.gridSize, y: y * this.gridSize };
                if (!this.isWall(pos.x, pos.y) && !this.isNearGhostStart(pos.x, pos.y)) {
                    this.dots.push(pos);
                }
            }
        }
        
        // 生成能量豆
        this.powerPellets = [
            { x: 2 * this.gridSize, y: 2 * this.gridSize },
            { x: (this.cols - 3) * this.gridSize, y: 2 * this.gridSize },
            { x: 2 * this.gridSize, y: (this.rows - 3) * this.gridSize },
            { x: (this.cols - 3) * this.gridSize, y: (this.rows - 3) * this.gridSize }
        ];
    }
    
    isWall(x, y) {
        return this.walls.some(wall => wall.x === x && wall.y === y);
    }
    
    isNearGhostStart(x, y) {
        const ghostStart = { x: 400, y: 280 };
        const distance = Math.abs(x - ghostStart.x) + Math.abs(y - ghostStart.y);
        return distance < 60;
    }
    
    bindEvents() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            switch(e.key) {
                case 'ArrowUp': case 'w': case 'W':
                    this.pacman.nextDirection = 'up';
                    break;
                case 'ArrowDown': case 's': case 'S':
                    this.pacman.nextDirection = 'down';
                    break;
                case 'ArrowLeft': case 'a': case 'A':
                    this.pacman.nextDirection = 'left';
                    break;
                case 'ArrowRight': case 'd': case 'D':
                    this.pacman.nextDirection = 'right';
                    break;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
    }
    
    startGame() {
        this.gameState = 'playing';
        document.getElementById('startBtn').textContent = '游戏中';
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
    
    resetGame() {
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.gameState = 'ready';
        this.pacman.x = 20;
        this.pacman.y = 20;
        this.generateMaze();
        this.updateUI();
        document.getElementById('startBtn').textContent = '开始游戏';
        document.getElementById('pauseBtn').textContent = '暂停';
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        this.updatePacman();
        this.updateGhosts();
        this.checkCollisions();
        this.updatePowerMode();
        
        if (this.dots.length === 0) {
            this.nextLevel();
        }
    }
    
    updatePacman() {
        // 尝试改变方向
        const nextX = this.pacman.x + this.getDirectionOffset(this.pacman.nextDirection).x * this.gridSize;
        const nextY = this.pacman.y + this.getDirectionOffset(this.pacman.nextDirection).y * this.gridSize;
        
        if (!this.isWall(nextX, nextY)) {
            this.pacman.direction = this.pacman.nextDirection;
        }
        
        // 移动
        const offset = this.getDirectionOffset(this.pacman.direction);
        const newX = this.pacman.x + offset.x * this.pacman.speed;
        const newY = this.pacman.y + offset.y * this.pacman.speed;
        
        if (!this.isWall(newX, newY)) {
            this.pacman.x = newX;
            this.pacman.y = newY;
        }
        
        // 边界传送
        if (this.pacman.x < 0) this.pacman.x = this.canvas.width - this.gridSize;
        if (this.pacman.x >= this.canvas.width) this.pacman.x = 0;
        
        // 嘴巴动画
        this.pacman.mouthAngle += 0.3;
        if (this.pacman.mouthAngle > Math.PI) this.pacman.mouthAngle = 0;
    }
    
    getDirectionOffset(direction) {
        switch (direction) {
            case 'up': return { x: 0, y: -1 };
            case 'down': return { x: 0, y: 1 };
            case 'left': return { x: -1, y: 0 };
            case 'right': return { x: 1, y: 0 };
            default: return { x: 0, y: 0 };
        }
    }
    
    updateGhosts() {
        this.ghosts.forEach(ghost => {
            if (ghost.scared && ghost.scaredTime > 0) {
                ghost.scaredTime--;
                if (ghost.scaredTime <= 0) {
                    ghost.scared = false;
                }
            }
            
            // 简单AI：随机移动
            if (Math.random() < 0.1) {
                const directions = ['up', 'down', 'left', 'right'];
                ghost.direction = directions[Math.floor(Math.random() * directions.length)];
            }
            
            const offset = this.getDirectionOffset(ghost.direction);
            const newX = ghost.x + offset.x * 1;
            const newY = ghost.y + offset.y * 1;
            
            if (!this.isWall(newX, newY)) {
                ghost.x = newX;
                ghost.y = newY;
            } else {
                // 撞墙时随机改变方向
                const directions = ['up', 'down', 'left', 'right'];
                ghost.direction = directions[Math.floor(Math.random() * directions.length)];
            }
            
            // 边界传送
            if (ghost.x < 0) ghost.x = this.canvas.width - this.gridSize;
            if (ghost.x >= this.canvas.width) ghost.x = 0;
        });
    }
    
    checkCollisions() {
        // 检查吃豆子
        this.dots = this.dots.filter(dot => {
            if (Math.abs(this.pacman.x - dot.x) < 15 && Math.abs(this.pacman.y - dot.y) < 15) {
                this.score += 10;
                return false;
            }
            return true;
        });
        
        // 检查吃能量豆
        this.powerPellets = this.powerPellets.filter(pellet => {
            if (Math.abs(this.pacman.x - pellet.x) < 15 && Math.abs(this.pacman.y - pellet.y) < 15) {
                this.score += 50;
                this.activatePowerMode();
                return false;
            }
            return true;
        });
        
        // 检查与鬼的碰撞
        this.ghosts.forEach(ghost => {
            if (Math.abs(this.pacman.x - ghost.x) < 15 && Math.abs(this.pacman.y - ghost.y) < 15) {
                if (ghost.scared) {
                    this.score += 200;
                    ghost.x = 400;
                    ghost.y = 280;
                    ghost.scared = false;
                    ghost.scaredTime = 0;
                } else {
                    this.lives--;
                    if (this.lives <= 0) {
                        this.gameOver();
                    } else {
                        this.resetPositions();
                    }
                }
            }
        });
    }
    
    activatePowerMode() {
        this.powerMode = true;
        this.powerModeTime = 300; // 5秒
        this.ghosts.forEach(ghost => {
            ghost.scared = true;
            ghost.scaredTime = 300;
        });
    }
    
    updatePowerMode() {
        if (this.powerMode && this.powerModeTime > 0) {
            this.powerModeTime--;
            if (this.powerModeTime <= 0) {
                this.powerMode = false;
            }
        }
    }
    
    resetPositions() {
        this.pacman.x = 20;
        this.pacman.y = 20;
        this.ghosts.forEach((ghost, index) => {
            ghost.x = 380 + index * 20;
            ghost.y = 280;
        });
    }
    
    nextLevel() {
        this.level++;
        this.generateMaze();
        this.resetPositions();
        // 增加游戏难度
        this.ghosts.forEach(ghost => {
            ghost.speed = Math.min(ghost.speed + 0.1, 2);
        });
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        alert(`游戏结束！最终得分：${this.score}`);
        this.resetGame();
    }
    
    render() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制墙壁
        this.ctx.fillStyle = '#0000FF';
        this.walls.forEach(wall => {
            this.ctx.fillRect(wall.x, wall.y, this.gridSize, this.gridSize);
        });
        
        // 绘制豆子
        this.ctx.fillStyle = '#FFFF00';
        this.dots.forEach(dot => {
            this.ctx.beginPath();
            this.ctx.arc(dot.x + this.gridSize/2, dot.y + this.gridSize/2, 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // 绘制能量豆
        this.ctx.fillStyle = '#FFFFFF';
        this.powerPellets.forEach(pellet => {
            this.ctx.beginPath();
            this.ctx.arc(pellet.x + this.gridSize/2, pellet.y + this.gridSize/2, 6, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // 绘制吃豆人
        this.drawPacman();
        
        // 绘制鬼
        this.ghosts.forEach(ghost => this.drawGhost(ghost));
    }
    
    drawPacman() {
        this.ctx.save();
        this.ctx.translate(this.pacman.x + this.gridSize/2, this.pacman.y + this.gridSize/2);
        
        // 根据方向旋转
        switch (this.pacman.direction) {
            case 'up': this.ctx.rotate(-Math.PI/2); break;
            case 'down': this.ctx.rotate(Math.PI/2); break;
            case 'left': this.ctx.rotate(Math.PI); break;
        }
        
        this.ctx.fillStyle = '#FFFF00';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.pacman.size/2, this.pacman.mouthAngle, Math.PI * 2 - this.pacman.mouthAngle);
        this.ctx.lineTo(0, 0);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawGhost(ghost) {
        this.ctx.fillStyle = ghost.scared ? '#0000FF' : ghost.color;
        
        // 身体
        this.ctx.beginPath();
        this.ctx.arc(ghost.x + this.gridSize/2, ghost.y + this.gridSize/2, this.gridSize/2, Math.PI, 0);
        this.ctx.rect(ghost.x, ghost.y + this.gridSize/2, this.gridSize, this.gridSize/2);
        this.ctx.fill();
        
        // 底部锯齿
        this.ctx.beginPath();
        this.ctx.moveTo(ghost.x, ghost.y + this.gridSize);
        for (let i = 0; i < 4; i++) {
            this.ctx.lineTo(ghost.x + (i + 0.5) * this.gridSize/4, ghost.y + this.gridSize - 5);
            this.ctx.lineTo(ghost.x + (i + 1) * this.gridSize/4, ghost.y + this.gridSize);
        }
        this.ctx.fill();
        
        // 眼睛
        this.ctx.fillStyle = '#FFF';
        this.ctx.fillRect(ghost.x + 4, ghost.y + 4, 4, 6);
        this.ctx.fillRect(ghost.x + 12, ghost.y + 4, 4, 6);
        
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(ghost.x + 5, ghost.y + 5, 2, 4);
        this.ctx.fillRect(ghost.x + 13, ghost.y + 5, 2, 4);
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('level').textContent = this.level;
    }
    
    gameLoop() {
        this.update();
        this.render();
        this.updateUI();
        requestAnimationFrame(() => this.gameLoop());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PacmanGame();
});