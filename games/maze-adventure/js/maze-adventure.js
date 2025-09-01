class MazeAdventure {
    constructor() {
        this.canvas = document.getElementById('mazeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.minimapCanvas = document.getElementById('minimapCanvas');
        this.minimapCtx = this.minimapCanvas.getContext('2d');
        
        // 游戏配置
        this.difficulties = {
            easy: { size: 15, name: '简单' },
            medium: { size: 21, name: '中等' },
            hard: { size: 31, name: '困难' },
            expert: { size: 41, name: '专家' }
        };
        
        this.currentDifficulty = 'easy';
        this.mazeSize = this.difficulties.easy.size;
        this.cellSize = 0;
        
        // 游戏状态
        this.maze = [];
        this.visited = [];
        this.player = { x: 1, y: 1 };
        this.exit = { x: 0, y: 0 };
        this.treasures = [];
        this.collectedTreasures = 0;
        this.steps = 0;
        this.level = 1;
        this.startTime = null;
        this.gameActive = false;
        this.fogOfWar = false;
        
        // 寻路相关
        this.solutionPath = [];
        this.showingSolution = false;
        this.hintPath = [];
        this.showingHint = false;
        
        // 统计数据
        this.exploredCells = new Set();
        
        // 常量
        this.WALL = 1;
        this.PATH = 0;
        this.PLAYER = 2;
        this.EXIT = 3;
        this.TREASURE = 4;
        this.VISITED = 5;
        
        this.init();
    }
    
    init() {
        this.calculateCellSize();
        this.bindEvents();
        this.generateNewMaze();
        this.updateDisplay();
    }
    
    calculateCellSize() {
        this.cellSize = Math.floor(Math.min(
            this.canvas.width / this.mazeSize,
            this.canvas.height / this.mazeSize
        ));
    }
    
    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (!this.gameActive) return;
            
            let dx = 0, dy = 0;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    dy = -1;
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    dy = 1;
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    dx = -1;
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    dx = 1;
                    break;
                case ' ':
                    e.preventDefault();
                    this.collectTreasure();
                    return;
                case 'h':
                case 'H':
                    this.showHint();
                    return;
                default:
                    return;
            }
            
            e.preventDefault();
            this.movePlayer(dx, dy);
        });
        
        // 鼠标点击移动
        this.canvas.addEventListener('click', (e) => {
            if (!this.gameActive) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = Math.floor((e.clientX - rect.left) / this.cellSize);
            const y = Math.floor((e.clientY - rect.top) / this.cellSize);
            
            // 只允许移动到相邻的格子
            const dx = x - this.player.x;
            const dy = y - this.player.y;
            
            if (Math.abs(dx) + Math.abs(dy) === 1) {
                this.movePlayer(dx, dy);
            }
        });
    }
    
    setDifficulty(difficulty) {
        if (this.difficulties[difficulty]) {
            this.currentDifficulty = difficulty;
            this.mazeSize = this.difficulties[difficulty].size;
            this.calculateCellSize();
            
            // 更新按钮状态
            document.querySelectorAll('.difficulty-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[onclick*="${difficulty}"]`).classList.add('active');
            
            this.generateNewMaze();
        }
    }
    
    generateNewMaze() {
        this.gameActive = false;
        this.showingSolution = false;
        this.showingHint = false;
        this.canvas.classList.add('maze-generating');
        
        // 初始化迷宫
        this.maze = [];
        this.visited = [];
        this.exploredCells.clear();
        
        for (let y = 0; y < this.mazeSize; y++) {
            this.maze[y] = [];
            this.visited[y] = [];
            for (let x = 0; x < this.mazeSize; x++) {
                this.maze[y][x] = this.WALL;
                this.visited[y][x] = false;
            }
        }
        
        // 生成迷宫
        this.generateMazeRecursive(1, 1);
        
        // 设置起点和终点
        this.player = { x: 1, y: 1 };
        this.exit = { x: this.mazeSize - 2, y: this.mazeSize - 2 };
        this.maze[this.exit.y][this.exit.x] = this.EXIT;
        
        // 生成宝物
        this.generateTreasures();
        
        // 重置游戏状态
        this.steps = 0;
        this.collectedTreasures = 0;
        this.startTime = Date.now();
        this.gameActive = true;
        
        setTimeout(() => {
            this.canvas.classList.remove('maze-generating');
        }, 1000);
        
        this.updateDisplay();
        this.render();
    }
    
    generateMazeRecursive(x, y) {
        const directions = [
            [0, -2], [2, 0], [0, 2], [-2, 0]
        ].sort(() => Math.random() - 0.5);
        
        this.maze[y][x] = this.PATH;
        
        for (let [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            
            if (nx > 0 && ny > 0 && nx < this.mazeSize - 1 && ny < this.mazeSize - 1) {
                if (this.maze[ny][nx] === this.WALL) {
                    this.maze[y + dy/2][x + dx/2] = this.PATH;
                    this.generateMazeRecursive(nx, ny);
                }
            }
        }
    }
    
    generateTreasures() {
        this.treasures = [];
        const numTreasures = Math.floor(this.mazeSize / 8) + 2;
        
        for (let i = 0; i < numTreasures; i++) {
            let x, y;
            do {
                x = Math.floor(Math.random() * (this.mazeSize - 2)) + 1;
                y = Math.floor(Math.random() * (this.mazeSize - 2)) + 1;
            } while (
                this.maze[y][x] !== this.PATH ||
                (x === this.player.x && y === this.player.y) ||
                (x === this.exit.x && y === this.exit.y) ||
                this.treasures.some(t => t.x === x && t.y === y)
            );
            
            this.treasures.push({ x, y, collected: false });
        }
    }
    
    movePlayer(dx, dy) {
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;
        
        // 检查边界和墙壁
        if (newX < 0 || newY < 0 || newX >= this.mazeSize || newY >= this.mazeSize) {
            return false;
        }
        
        if (this.maze[newY][newX] === this.WALL) {
            return false;
        }
        
        // 移动玩家
        this.player.x = newX;
        this.player.y = newY;
        this.steps++;
        
        // 标记访问过的格子
        this.visited[newY][newX] = true;
        this.exploredCells.add(`${newX},${newY}`);
        
        // 检查是否到达终点
        if (newX === this.exit.x && newY === this.exit.y) {
            this.completeLevel();
            return true;
        }
        
        // 自动收集宝物
        this.collectTreasure();
        
        this.updateDisplay();
        this.render();
        return true;
    }
    
    collectTreasure() {
        const treasure = this.treasures.find(t => 
            t.x === this.player.x && t.y === this.player.y && !t.collected
        );
        
        if (treasure) {
            treasure.collected = true;
            this.collectedTreasures++;
            
            // 创建收集特效
            this.createTreasureEffect(treasure.x, treasure.y);
            
            this.updateDisplay();
            this.render();
        }
    }
    
    createTreasureEffect(x, y) {
        // 简单的视觉反馈，实际应用中可以添加更复杂的特效
        const element = document.createElement('div');
        element.textContent = '+💎';
        element.style.position = 'absolute';
        element.style.left = (x * this.cellSize) + 'px';
        element.style.top = (y * this.cellSize) + 'px';
        element.style.color = '#f39c12';
        element.style.fontWeight = 'bold';
        element.style.pointerEvents = 'none';
        element.style.zIndex = '1000';
        element.classList.add('treasure-collect');
        
        this.canvas.parentNode.appendChild(element);
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 600);
    }
    
    showHint() {
        if (!this.gameActive) return;
        
        this.hintPath = this.findPath(this.player, this.exit);
        this.showingHint = true;
        
        setTimeout(() => {
            this.showingHint = false;
            this.render();
        }, 3000);
        
        this.render();
    }
    
    showSolution() {
        if (!this.gameActive) return;
        
        this.solutionPath = this.findPath(this.player, this.exit);
        this.showingSolution = !this.showingSolution;
        this.render();
    }
    
    findPath(start, end) {
        // A* 寻路算法
        const openSet = [];
        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = {};
        const fScore = {};
        
        const startKey = `${start.x},${start.y}`;
        const endKey = `${end.x},${end.y}`;
        
        openSet.push(start);
        gScore[startKey] = 0;
        fScore[startKey] = this.heuristic(start, end);
        
        while (openSet.length > 0) {
            // 找到 fScore 最小的节点
            let current = openSet.reduce((min, node) => {
                const currentKey = `${node.x},${node.y}`;
                const minKey = `${min.x},${min.y}`;
                return fScore[currentKey] < fScore[minKey] ? node : min;
            });
            
            const currentKey = `${current.x},${current.y}`;
            
            if (currentKey === endKey) {
                // 重建路径
                const path = [];
                while (current) {
                    path.unshift(current);
                    current = cameFrom.get(`${current.x},${current.y}`);
                }
                return path;
            }
            
            openSet.splice(openSet.indexOf(current), 1);
            closedSet.add(currentKey);
            
            // 检查相邻节点
            const neighbors = [
                { x: current.x + 1, y: current.y },
                { x: current.x - 1, y: current.y },
                { x: current.x, y: current.y + 1 },
                { x: current.x, y: current.y - 1 }
            ];
            
            for (let neighbor of neighbors) {
                const neighborKey = `${neighbor.x},${neighbor.y}`;
                
                if (neighbor.x < 0 || neighbor.y < 0 || 
                    neighbor.x >= this.mazeSize || neighbor.y >= this.mazeSize) {
                    continue;
                }
                
                if (this.maze[neighbor.y][neighbor.x] === this.WALL) {
                    continue;
                }
                
                if (closedSet.has(neighborKey)) {
                    continue;
                }
                
                const tentativeGScore = gScore[currentKey] + 1;
                
                if (!openSet.some(n => n.x === neighbor.x && n.y === neighbor.y)) {
                    openSet.push(neighbor);
                } else if (tentativeGScore >= (gScore[neighborKey] || Infinity)) {
                    continue;
                }
                
                cameFrom.set(neighborKey, current);
                gScore[neighborKey] = tentativeGScore;
                fScore[neighborKey] = gScore[neighborKey] + this.heuristic(neighbor, end);
            }
        }
        
        return []; // 没有找到路径
    }
    
    heuristic(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
    
    completeLevel() {
        this.gameActive = false;
        const endTime = Date.now();
        const completionTime = Math.floor((endTime - this.startTime) / 1000);
        
        this.showVictoryPopup(completionTime);
    }
    
    showVictoryPopup(completionTime) {
        const minutes = Math.floor(completionTime / 60);
        const seconds = completionTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const explorationRate = Math.round((this.exploredCells.size / this.getPathCells()) * 100);
        
        document.getElementById('victoryTitle').textContent = '🎉 恭喜通关！';
        document.getElementById('victoryMessage').textContent = '太棒了！你成功走出了迷宫！';
        document.getElementById('finalLevel').textContent = this.level;
        document.getElementById('finalSteps').textContent = this.steps;
        document.getElementById('finalTime').textContent = timeString;
        document.getElementById('finalTreasures').textContent = `${this.collectedTreasures}/${this.treasures.length}`;
        document.getElementById('explorationRate').textContent = explorationRate + '%';
        
        document.getElementById('victoryPopup').classList.add('show');
    }
    
    getPathCells() {
        let count = 0;
        for (let y = 0; y < this.mazeSize; y++) {
            for (let x = 0; x < this.mazeSize; x++) {
                if (this.maze[y][x] !== this.WALL) {
                    count++;
                }
            }
        }
        return count;
    }
    
    closeVictory() {
        document.getElementById('victoryPopup').classList.remove('show');
    }
    
    nextLevel() {
        this.level++;
        this.generateNewMaze();
    }
    
    resetLevel() {
        this.player = { x: 1, y: 1 };
        this.steps = 0;
        this.collectedTreasures = 0;
        this.startTime = Date.now();
        this.gameActive = true;
        this.showingSolution = false;
        this.showingHint = false;
        
        // 重置访问状态
        for (let y = 0; y < this.mazeSize; y++) {
            for (let x = 0; x < this.mazeSize; x++) {
                this.visited[y][x] = false;
            }
        }
        
        // 重置宝物
        this.treasures.forEach(treasure => {
            treasure.collected = false;
        });
        
        this.exploredCells.clear();
        this.updateDisplay();
        this.render();
    }
    
    toggleFogOfWar() {
        this.fogOfWar = document.getElementById('fogOfWar').checked;
        this.render();
    }
    
    updateDisplay() {
        document.getElementById('currentLevel').textContent = this.level;
        document.getElementById('steps').textContent = this.steps;
        document.getElementById('treasures').textContent = `${this.collectedTreasures}/${this.treasures.length}`;
        
        // 更新计时器
        if (this.gameActive && this.startTime) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            document.getElementById('timer').textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }
    
    render() {
        this.renderMainMaze();
        this.renderMinimap();
    }
    
    renderMainMaze() {
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const visibilityRadius = this.fogOfWar ? 2 : this.mazeSize;
        
        for (let y = 0; y < this.mazeSize; y++) {
            for (let x = 0; x < this.mazeSize; x++) {
                const distance = Math.max(Math.abs(x - this.player.x), Math.abs(y - this.player.y));
                const isVisible = distance <= visibilityRadius || this.visited[y][x] || !this.fogOfWar;
                
                if (!isVisible) continue;
                
                const cellX = x * this.cellSize;
                const cellY = y * this.cellSize;
                
                // 绘制基础格子
                if (this.maze[y][x] === this.WALL) {
                    this.ctx.fillStyle = '#34495e';
                    this.ctx.fillRect(cellX, cellY, this.cellSize, this.cellSize);
                    this.ctx.strokeStyle = '#2c3e50';
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeRect(cellX, cellY, this.cellSize, this.cellSize);
                } else {
                    // 路径
                    if (this.visited[y][x]) {
                        this.ctx.fillStyle = 'rgba(52, 152, 219, 0.3)';
                    } else {
                        this.ctx.fillStyle = '#ecf0f1';
                    }
                    this.ctx.fillRect(cellX, cellY, this.cellSize, this.cellSize);
                }
                
                // 绘制解决方案路径
                if (this.showingSolution) {
                    const isOnPath = this.solutionPath.some(p => p.x === x && p.y === y);
                    if (isOnPath) {
                        this.ctx.fillStyle = 'rgba(46, 204, 113, 0.6)';
                        this.ctx.fillRect(cellX, cellY, this.cellSize, this.cellSize);
                    }
                }
                
                // 绘制提示路径
                if (this.showingHint) {
                    const isOnHint = this.hintPath.some(p => p.x === x && p.y === y);
                    if (isOnHint) {
                        this.ctx.fillStyle = 'rgba(241, 196, 15, 0.6)';
                        this.ctx.fillRect(cellX, cellY, this.cellSize, this.cellSize);
                    }
                }
                
                // 绘制宝物
                const treasure = this.treasures.find(t => t.x === x && t.y === y && !t.collected);
                if (treasure) {
                    this.ctx.fillStyle = '#f39c12';
                    this.ctx.font = `${this.cellSize * 0.6}px Arial`;
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('💎', cellX + this.cellSize/2, cellY + this.cellSize*0.75);
                }
                
                // 绘制出口
                if (x === this.exit.x && y === this.exit.y) {
                    this.ctx.fillStyle = '#e74c3c';
                    this.ctx.font = `${this.cellSize * 0.6}px Arial`;
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('🚪', cellX + this.cellSize/2, cellY + this.cellSize*0.75);
                }
            }
        }
        
        // 绘制玩家
        const playerX = this.player.x * this.cellSize;
        const playerY = this.player.y * this.cellSize;
        this.ctx.fillStyle = '#3498db';
        this.ctx.font = `${this.cellSize * 0.6}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🚶', playerX + this.cellSize/2, playerY + this.cellSize*0.75);
    }
    
    renderMinimap() {
        const scale = this.minimapCanvas.width / this.mazeSize;
        
        this.minimapCtx.fillStyle = '#2c3e50';
        this.minimapCtx.fillRect(0, 0, this.minimapCanvas.width, this.minimapCanvas.height);
        
        for (let y = 0; y < this.mazeSize; y++) {
            for (let x = 0; x < this.mazeSize; x++) {
                const cellX = x * scale;
                const cellY = y * scale;
                
                if (this.maze[y][x] === this.WALL) {
                    this.minimapCtx.fillStyle = '#34495e';
                } else if (this.visited[y][x]) {
                    this.minimapCtx.fillStyle = '#3498db';
                } else {
                    this.minimapCtx.fillStyle = '#95a5a6';
                }
                
                this.minimapCtx.fillRect(cellX, cellY, scale, scale);
            }
        }
        
        // 绘制玩家位置
        this.minimapCtx.fillStyle = '#f39c12';
        this.minimapCtx.fillRect(
            this.player.x * scale,
            this.player.y * scale,
            scale, scale
        );
        
        // 绘制出口
        this.minimapCtx.fillStyle = '#e74c3c';
        this.minimapCtx.fillRect(
            this.exit.x * scale,
            this.exit.y * scale,
            scale, scale
        );
    }
    
    showHelp() {
        document.getElementById('helpModal').classList.add('show');
    }
    
    closeHelp() {
        document.getElementById('helpModal').classList.remove('show');
    }
    
    // 游戏循环更新计时器
    gameLoop() {
        if (this.gameActive) {
            this.updateDisplay();
        }
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 全局变量供HTML onclick调用
let mazeGame;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    mazeGame = new MazeAdventure();
    mazeGame.gameLoop();
});