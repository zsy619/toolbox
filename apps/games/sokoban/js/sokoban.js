class Sokoban {
    constructor() {
        this.levels = [
            // 第1关 - 简单入门
            [
                "####",
                "#.@#",
                "#$*#",
                "####"
            ],
            // 第2关 - 基础推动
            [
                "#####",
                "#.@*#",
                "#$$ #",
                "#.  #",
                "#####"
            ],
            // 第3关 - 转弯技巧
            [
                "######",
                "#....#",
                "#.$$@#",
                "#....#",
                "######"
            ],
            // 第4关 - 顺序推动
            [
                " ####",
                " #  #",
                "##$*#",
                "#@$.#",
                "#  ##",
                "####"
            ],
            // 第5关 - 空间规划
            [
                "######",
                "#  ..#",
                "# $$ #",
                "#  @ #",
                "######"
            ],
            // 第6关 - 复杂布局
            [
                " #####",
                "##...#",
                "#@$$$#",
                "##...#",
                " #####"
            ],
            // 第7关 - 高级技巧
            [
                "########",
                "#......#",
                "#@$$$$ #",
                "#......#",
                "########"
            ],
            // 第8关 - 终极挑战
            [
                " ####",
                " #  ###",
                "##....#",
                "#@$$$ #",
                "#.....#",
                "#######"
            ]
        ];
        
        this.currentLevel = 0;
        this.moves = 0;
        this.pushes = 0;
        this.gameGrid = null;
        this.playerPos = { x: 0, y: 0 };
        this.gameState = [];
        this.history = [];
        this.isGameComplete = false;
        
        this.initGame();
        this.bindEvents();
    }
    
    initGame() {
        this.loadLevel(this.currentLevel);
        this.updateDisplay();
        this.renderGame();
        this.loadLevelSelector();
    }
    
    loadLevelSelector() {
        const selector = document.getElementById('levelSelector');
        selector.innerHTML = '';
        for (let i = 0; i < this.levels.length; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `第 ${i + 1} 关`;
            if (i === this.currentLevel) {
                option.selected = true;
            }
            selector.appendChild(option);
        }
    }
    
    loadLevel(levelIndex) {
        if (levelIndex < 0 || levelIndex >= this.levels.length) return;
        
        this.currentLevel = levelIndex;
        this.moves = 0;
        this.pushes = 0;
        this.history = [];
        this.isGameComplete = false;
        
        const level = this.levels[levelIndex];
        this.gameState = [];
        
        // 解析关卡数据
        for (let y = 0; y < level.length; y++) {
            this.gameState[y] = [];
            for (let x = 0; x < level[y].length; x++) {
                const char = level[y][x];
                switch (char) {
                    case '#': // 墙
                        this.gameState[y][x] = 'wall';
                        break;
                    case '@': // 玩家
                        this.gameState[y][x] = 'floor';
                        this.playerPos = { x, y };
                        break;
                    case '+': // 玩家在目标点上
                        this.gameState[y][x] = 'target';
                        this.playerPos = { x, y };
                        break;
                    case '$': // 箱子
                        this.gameState[y][x] = 'box';
                        break;
                    case '*': // 箱子在目标点上
                        this.gameState[y][x] = 'box-on-target';
                        break;
                    case '.': // 目标点
                        this.gameState[y][x] = 'target';
                        break;
                    case ' ': // 地板
                        this.gameState[y][x] = 'floor';
                        break;
                    default:
                        this.gameState[y][x] = 'floor';
                }
            }
        }
        
        this.saveState();
    }
    
    saveState() {
        const state = {
            gameState: JSON.parse(JSON.stringify(this.gameState)),
            playerPos: { ...this.playerPos },
            moves: this.moves,
            pushes: this.pushes
        };
        this.history.push(state);
        
        // 限制历史记录数量
        if (this.history.length > 100) {
            this.history.shift();
        }
    }
    
    undo() {
        if (this.history.length > 1) {
            this.history.pop(); // 移除当前状态
            const previousState = this.history[this.history.length - 1];
            
            this.gameState = JSON.parse(JSON.stringify(previousState.gameState));
            this.playerPos = { ...previousState.playerPos };
            this.moves = previousState.moves;
            this.pushes = previousState.pushes;
            
            this.updateDisplay();
            this.renderGame();
        }
    }
    
    renderGame() {
        const gameBoard = document.getElementById('gameBoard');
        const gridElement = document.getElementById('gameGrid');
        
        if (!this.gameState || this.gameState.length === 0) return;
        
        const rows = this.gameState.length;
        const cols = Math.max(...this.gameState.map(row => row.length));
        
        gridElement.style.gridTemplateColumns = `repeat(${cols}, 40px)`;
        gridElement.style.gridTemplateRows = `repeat(${rows}, 40px)`;
        
        gridElement.innerHTML = '';
        
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                const cellType = this.gameState[y] && this.gameState[y][x] ? this.gameState[y][x] : 'floor';
                
                // 设置基础类型
                if (cellType === 'wall') {
                    cell.classList.add('wall');
                    cell.textContent = '🧱';
                } else if (cellType === 'target') {
                    cell.classList.add('target');
                    cell.textContent = '🎯';
                } else if (cellType === 'box') {
                    cell.classList.add('box');
                    cell.textContent = '📦';
                } else if (cellType === 'box-on-target') {
                    cell.classList.add('box-on-target');
                    cell.textContent = '✅';
                } else {
                    cell.classList.add('floor');
                }
                
                // 添加玩家
                if (this.playerPos.x === x && this.playerPos.y === y) {
                    if (cellType === 'target') {
                        cell.classList.add('player-on-target');
                    } else {
                        cell.classList.add('player');
                    }
                    cell.textContent = '🚶';
                }
                
                gridElement.appendChild(cell);
            }
        }
    }
    
    movePlayer(dx, dy) {
        if (this.isGameComplete) return;
        
        const newX = this.playerPos.x + dx;
        const newY = this.playerPos.y + dy;
        
        // 检查边界
        if (newY < 0 || newY >= this.gameState.length || 
            newX < 0 || newX >= this.gameState[newY].length) {
            return;
        }
        
        const targetCell = this.gameState[newY][newX];
        
        // 不能移动到墙
        if (targetCell === 'wall') return;
        
        // 如果目标位置是箱子或目标上的箱子
        if (targetCell === 'box' || targetCell === 'box-on-target') {
            const boxNewX = newX + dx;
            const boxNewY = newY + dy;
            
            // 检查箱子新位置边界
            if (boxNewY < 0 || boxNewY >= this.gameState.length || 
                boxNewX < 0 || boxNewX >= this.gameState[boxNewY].length) {
                return;
            }
            
            const boxTargetCell = this.gameState[boxNewY][boxNewX];
            
            // 箱子不能推到墙或其他箱子上
            if (boxTargetCell === 'wall' || boxTargetCell === 'box' || boxTargetCell === 'box-on-target') {
                return;
            }
            
            // 推动箱子
            this.saveState();
            
            // 移除箱子原位置
            if (targetCell === 'box-on-target') {
                this.gameState[newY][newX] = 'target';
            } else {
                this.gameState[newY][newX] = 'floor';
            }
            
            // 设置箱子新位置
            if (boxTargetCell === 'target') {
                this.gameState[boxNewY][boxNewX] = 'box-on-target';
            } else {
                this.gameState[boxNewY][boxNewX] = 'box';
            }
            
            this.pushes++;
        } else {
            this.saveState();
        }
        
        // 移动玩家
        this.playerPos.x = newX;
        this.playerPos.y = newY;
        this.moves++;
        
        this.updateDisplay();
        this.renderGame();
        this.checkWin();
    }
    
    checkWin() {
        // 检查是否所有箱子都在目标点上
        for (let y = 0; y < this.gameState.length; y++) {
            for (let x = 0; x < this.gameState[y].length; x++) {
                if (this.gameState[y][x] === 'box') {
                    return false; // 还有箱子不在目标点上
                }
            }
        }
        
        // 胜利!
        this.isGameComplete = true;
        this.showVictory();
    }
    
    showVictory() {
        const existingMessage = document.querySelector('.victory-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const victoryMessage = document.createElement('div');
        victoryMessage.className = 'victory-message';
        victoryMessage.innerHTML = `
            <h2>🎉 恭喜过关! 🎉</h2>
            <div class="victory-stats">
                <div>🚶 移动步数: ${this.moves}</div>
                <div>📦 推箱次数: ${this.pushes}</div>
                <div>⭐ 关卡: ${this.currentLevel + 1}/${this.levels.length}</div>
            </div>
            <button onclick="sokoban.nextLevel()" style="margin: 10px;">下一关</button>
            <button onclick="sokoban.hideVictory()" style="margin: 10px;">继续游戏</button>
        `;
        
        document.body.appendChild(victoryMessage);
        
        // 3秒后自动隐藏
        setTimeout(() => {
            this.hideVictory();
        }, 5000);
    }
    
    hideVictory() {
        const victoryMessage = document.querySelector('.victory-message');
        if (victoryMessage) {
            victoryMessage.remove();
        }
    }
    
    nextLevel() {
        this.hideVictory();
        if (this.currentLevel < this.levels.length - 1) {
            this.loadLevel(this.currentLevel + 1);
            this.loadLevelSelector();
            this.updateDisplay();
            this.renderGame();
        } else {
            alert('🎊 恭喜您完成了所有关卡! 🎊');
        }
    }
    
    previousLevel() {
        if (this.currentLevel > 0) {
            this.loadLevel(this.currentLevel - 1);
            this.loadLevelSelector();
            this.updateDisplay();
            this.renderGame();
        }
    }
    
    restartLevel() {
        this.loadLevel(this.currentLevel);
        this.updateDisplay();
        this.renderGame();
    }
    
    selectLevel() {
        const selector = document.getElementById('levelSelector');
        const levelIndex = parseInt(selector.value);
        this.loadLevel(levelIndex);
        this.updateDisplay();
        this.renderGame();
    }
    
    updateDisplay() {
        document.getElementById('currentLevel').textContent = this.currentLevel + 1;
        document.getElementById('totalLevels').textContent = this.levels.length;
        document.getElementById('moveCount').textContent = this.moves;
        document.getElementById('pushCount').textContent = this.pushes;
        
        // 更新按钮状态
        document.getElementById('prevBtn').disabled = this.currentLevel === 0;
        document.getElementById('nextBtn').disabled = this.currentLevel === this.levels.length - 1;
        document.getElementById('undoBtn').disabled = this.history.length <= 1;
    }
    
    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    this.movePlayer(0, -1);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    this.movePlayer(0, 1);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.movePlayer(-1, 0);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.movePlayer(1, 0);
                    break;
                case 'u':
                case 'U':
                    e.preventDefault();
                    this.undo();
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    this.restartLevel();
                    break;
            }
        });
        
        // 触摸事件支持
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (!touchStartX || !touchStartY) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            const minSwipeDistance = 30;
            
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > minSwipeDistance) {
                    if (diffX > 0) {
                        this.movePlayer(-1, 0); // 左
                    } else {
                        this.movePlayer(1, 0);  // 右
                    }
                }
            } else {
                if (Math.abs(diffY) > minSwipeDistance) {
                    if (diffY > 0) {
                        this.movePlayer(0, -1); // 上
                    } else {
                        this.movePlayer(0, 1);  // 下
                    }
                }
            }
            
            touchStartX = 0;
            touchStartY = 0;
        });
    }
}

// 全局变量
let sokoban;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    sokoban = new Sokoban();
});