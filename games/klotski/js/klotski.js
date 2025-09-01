class Klotski {
    constructor() {
        this.boardWidth = 4;
        this.boardHeight = 5;
        this.cellSize = 75;
        this.blocks = [];
        this.selectedBlock = null;
        this.moves = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.gameStarted = false;
        this.moveHistory = [];
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.currentLevel = 'classic';
        
        this.levels = {
            classic: {
                name: '经典布局',
                minMoves: 81,
                blocks: [
                    { id: 'caocao', name: '曹操', type: 'caocao', width: 2, height: 2, x: 1, y: 0 },
                    { id: 'guanyu', name: '关羽', type: 'general', width: 1, height: 2, x: 0, y: 0 },
                    { id: 'zhangfei', name: '张飞', type: 'general', width: 1, height: 2, x: 3, y: 0 },
                    { id: 'zhaoyun', name: '赵云', type: 'general', width: 2, height: 1, x: 1, y: 2 },
                    { id: 'machao', name: '马超', type: 'general', width: 1, height: 2, x: 0, y: 2 },
                    { id: 'huangzhong', name: '黄忠', type: 'general', width: 1, height: 2, x: 3, y: 2 },
                    { id: 'soldier1', name: '兵A', type: 'soldier', width: 1, height: 1, x: 1, y: 3 },
                    { id: 'soldier2', name: '兵B', type: 'soldier', width: 1, height: 1, x: 2, y: 3 },
                    { id: 'soldier3', name: '兵C', type: 'soldier', width: 1, height: 1, x: 0, y: 4 },
                    { id: 'soldier4', name: '兵D', type: 'soldier', width: 1, height: 1, x: 3, y: 4 }
                ]
            },
            easy: {
                name: '简单关卡',
                minMoves: 25,
                blocks: [
                    { id: 'caocao', name: '曹操', type: 'caocao', width: 2, height: 2, x: 1, y: 1 },
                    { id: 'general1', name: '将军', type: 'general', width: 2, height: 1, x: 1, y: 0 },
                    { id: 'soldier1', name: '兵A', type: 'soldier', width: 1, height: 1, x: 0, y: 0 },
                    { id: 'soldier2', name: '兵B', type: 'soldier', width: 1, height: 1, x: 3, y: 0 },
                    { id: 'soldier3', name: '兵C', type: 'soldier', width: 1, height: 1, x: 0, y: 3 },
                    { id: 'soldier4', name: '兵D', type: 'soldier', width: 1, height: 1, x: 3, y: 3 }
                ]
            }
        };
        
        this.init();
    }
    
    init() {
        this.createBoard();
        this.bindEvents();
        this.loadLevel(this.currentLevel);
        this.updateStats();
    }
    
    createBoard() {
        const board = document.getElementById('gameBoard');
        board.innerHTML = '';
        
        // 创建网格背景
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.style.position = 'absolute';
                cell.style.left = `${x * this.cellSize + 10}px`;
                cell.style.top = `${y * this.cellSize + 10}px`;
                cell.style.width = `${this.cellSize}px`;
                cell.style.height = `${this.cellSize}px`;
                cell.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                board.appendChild(cell);
            }
        }
    }
    
    bindEvents() {
        document.getElementById('levelSelect').addEventListener('change', (e) => {
            this.loadLevel(e.target.value);
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });
        
        document.getElementById('undoBtn').addEventListener('click', () => {
            this.undoMove();
        });
        
        document.getElementById('hintBtn').addEventListener('click', () => {
            this.showHint();
        });
        
        document.getElementById('solveBtn').addEventListener('click', () => {
            this.showSolution();
        });
        
        document.getElementById('nextLevelBtn').addEventListener('click', () => {
            this.nextLevel();
        });
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.hideMessage();
            this.resetGame();
        });
        
        // 鼠标/触摸事件
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));
        
        // 键盘事件
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
    }
    
    loadLevel(levelKey) {
        this.currentLevel = levelKey;
        const level = this.levels[levelKey];
        
        if (!level) return;
        
        this.blocks = JSON.parse(JSON.stringify(level.blocks));
        document.getElementById('minMoves').textContent = level.minMoves;
        
        this.resetGame();
        this.renderBlocks();
    }
    
    resetGame() {
        this.moves = 0;
        this.timer = 0;
        this.gameStarted = false;
        this.moveHistory = [];
        this.selectedBlock = null;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // 重置方块位置
        const level = this.levels[this.currentLevel];
        this.blocks = JSON.parse(JSON.stringify(level.blocks));
        
        this.updateStats();
        this.renderBlocks();
        this.hideMessage();
    }
    
    renderBlocks() {
        const board = document.getElementById('gameBoard');
        
        // 移除现有方块
        document.querySelectorAll('.block').forEach(block => block.remove());
        
        this.blocks.forEach(block => {
            const blockEl = document.createElement('div');
            blockEl.className = `block ${block.type}`;
            blockEl.id = block.id;
            blockEl.textContent = block.name;
            
            // 设置尺寸和位置
            const width = block.width * this.cellSize;
            const height = block.height * this.cellSize;
            const left = block.x * this.cellSize + 10;
            const top = block.y * this.cellSize + 10;
            
            blockEl.style.width = `${width}px`;
            blockEl.style.height = `${height}px`;
            blockEl.style.left = `${left}px`;
            blockEl.style.top = `${top}px`;
            
            // 添加方块特定的类
            if (block.type === 'general') {
                if (block.width > block.height) {
                    blockEl.classList.add('horizontal');
                } else {
                    blockEl.classList.add('vertical');
                }
            }
            
            // 绑定事件
            this.makeBlockDraggable(blockEl, block);
            
            board.appendChild(blockEl);
        });
    }
    
    makeBlockDraggable(blockEl, block) {
        blockEl.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.startDrag(blockEl, block, e);
        });
        
        blockEl.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectBlock(block);
        });
        
        // 触摸事件
        blockEl.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.startDrag(blockEl, block, touch);
        });
    }
    
    startDrag(blockEl, block, event) {
        if (!this.gameStarted) {
            this.startGame();
        }
        
        this.isDragging = true;
        this.selectedBlock = block;
        
        const rect = blockEl.getBoundingClientRect();
        const boardRect = document.getElementById('gameBoard').getBoundingClientRect();
        
        this.dragOffset = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
        
        blockEl.classList.add('dragging');
        this.showValidMoves(block);
    }
    
    onMouseMove(event) {
        if (!this.isDragging || !this.selectedBlock) return;
        
        const blockEl = document.getElementById(this.selectedBlock.id);
        const boardRect = document.getElementById('gameBoard').getBoundingClientRect();
        
        const newLeft = event.clientX - boardRect.left - this.dragOffset.x;
        const newTop = event.clientY - boardRect.top - this.dragOffset.y;
        
        blockEl.style.left = `${newLeft}px`;
        blockEl.style.top = `${newTop}px`;
    }
    
    onMouseUp(event) {
        if (!this.isDragging || !this.selectedBlock) return;
        
        this.isDragging = false;
        
        const blockEl = document.getElementById(this.selectedBlock.id);
        blockEl.classList.remove('dragging');
        
        // 计算新位置
        const boardRect = document.getElementById('gameBoard').getBoundingClientRect();
        const newLeft = event.clientX - boardRect.left - this.dragOffset.x;
        const newTop = event.clientY - boardRect.top - this.dragOffset.y;
        
        const newX = Math.round((newLeft - 10) / this.cellSize);
        const newY = Math.round((newTop - 10) / this.cellSize);
        
        // 验证并执行移动
        if (this.canMoveTo(this.selectedBlock, newX, newY)) {
            this.moveBlock(this.selectedBlock, newX, newY);
        } else {
            // 恢复原位置
            this.renderBlocks();
        }
        
        this.hideValidMoves();
        this.selectedBlock = null;
    }
    
    selectBlock(block) {
        // 清除之前的选择
        document.querySelectorAll('.block').forEach(el => {
            el.classList.remove('selected');
        });
        
        this.selectedBlock = block;
        document.getElementById(block.id).classList.add('selected');
        
        this.showValidMoves(block);
    }
    
    canMoveTo(block, newX, newY) {
        // 检查边界
        if (newX < 0 || newY < 0 || 
            newX + block.width > this.boardWidth || 
            newY + block.height > this.boardHeight) {
            return false;
        }
        
        // 检查与其他方块的碰撞
        for (let otherBlock of this.blocks) {
            if (otherBlock.id === block.id) continue;
            
            if (this.blocksOverlap(
                newX, newY, block.width, block.height,
                otherBlock.x, otherBlock.y, otherBlock.width, otherBlock.height
            )) {
                return false;
            }
        }
        
        return true;
    }
    
    blocksOverlap(x1, y1, w1, h1, x2, y2, w2, h2) {
        return !(x1 >= x2 + w2 || x2 >= x1 + w1 || y1 >= y2 + h2 || y2 >= y1 + h1);
    }
    
    moveBlock(block, newX, newY) {
        // 保存移动历史
        this.moveHistory.push({
            blockId: block.id,
            fromX: block.x,
            fromY: block.y,
            toX: newX,
            toY: newY
        });
        
        // 更新方块位置
        block.x = newX;
        block.y = newY;
        
        this.moves++;
        this.updateStats();
        this.renderBlocks();
        
        // 检查胜利条件
        if (this.checkWin()) {
            this.showWinMessage();
        }
    }
    
    showValidMoves(block) {
        this.hideValidMoves();
        
        const directions = [
            { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
            { dx: 0, dy: -1 }, { dx: 0, dy: 1 }
        ];
        
        directions.forEach(dir => {
            for (let step = 1; step <= 3; step++) {
                const newX = block.x + dir.dx * step;
                const newY = block.y + dir.dy * step;
                
                if (this.canMoveTo(block, newX, newY)) {
                    this.createValidMoveIndicator(newX, newY, block.width, block.height);
                } else {
                    break; // 如果这个位置不能移动，就不需要检查更远的位置
                }
            }
        });
    }
    
    createValidMoveIndicator(x, y, width, height) {
        const indicator = document.createElement('div');
        indicator.className = 'valid-move-area';
        indicator.style.left = `${x * this.cellSize + 10}px`;
        indicator.style.top = `${y * this.cellSize + 10}px`;
        indicator.style.width = `${width * this.cellSize}px`;
        indicator.style.height = `${height * this.cellSize}px`;
        
        document.getElementById('gameBoard').appendChild(indicator);
    }
    
    hideValidMoves() {
        document.querySelectorAll('.valid-move-area').forEach(area => {
            area.remove();
        });
        
        document.querySelectorAll('.block').forEach(el => {
            el.classList.remove('selected');
        });
    }
    
    onKeyDown(event) {
        if (!this.selectedBlock) return;
        
        let dx = 0, dy = 0;
        
        switch (event.key) {
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
            default:
                return;
        }
        
        event.preventDefault();
        
        if (!this.gameStarted) {
            this.startGame();
        }
        
        const newX = this.selectedBlock.x + dx;
        const newY = this.selectedBlock.y + dy;
        
        if (this.canMoveTo(this.selectedBlock, newX, newY)) {
            this.moveBlock(this.selectedBlock, newX, newY);
        }
    }
    
    checkWin() {
        // 找到曹操方块
        const caocao = this.blocks.find(block => block.type === 'caocao');
        if (!caocao) return false;
        
        // 检查曹操是否到达出口位置 (底部中央)
        return caocao.x === 1 && caocao.y === 3;
    }
    
    startGame() {
        if (this.gameStarted) return;
        
        this.gameStarted = true;
        this.startTimer();
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);
    }
    
    updateTimer() {
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timer').textContent = timeString;
    }
    
    updateStats() {
        document.getElementById('moves').textContent = this.moves;
    }
    
    undoMove() {
        if (this.moveHistory.length === 0) return;
        
        const lastMove = this.moveHistory.pop();
        const block = this.blocks.find(b => b.id === lastMove.blockId);
        
        if (block) {
            block.x = lastMove.fromX;
            block.y = lastMove.fromY;
            this.moves = Math.max(0, this.moves - 1);
            this.updateStats();
            this.renderBlocks();
        }
    }
    
    showHint() {
        const hint = this.findBestMove();
        if (hint) {
            alert(`提示：移动 ${hint.blockName} ${hint.direction}`);
            
            // 高亮提示的方块
            const blockEl = document.getElementById(hint.blockId);
            blockEl.classList.add('highlight');
            setTimeout(() => {
                blockEl.classList.remove('highlight');
            }, 2000);
        } else {
            alert('暂时没有明显的好移动，请仔细观察！');
        }
    }
    
    findBestMove() {
        // 简化的提示算法
        const caocao = this.blocks.find(block => block.type === 'caocao');
        if (!caocao) return null;
        
        // 如果曹操可以向下移动，优先建议
        if (this.canMoveTo(caocao, caocao.x, caocao.y + 1)) {
            return {
                blockId: caocao.id,
                blockName: caocao.name,
                direction: '向下移动'
            };
        }
        
        // 寻找可以为曹操让路的方块
        const blockingBlocks = this.blocks.filter(block => {
            return block.type !== 'caocao' && 
                   this.blocksOverlap(
                       caocao.x, caocao.y + 1, caocao.width, caocao.height,
                       block.x, block.y, block.width, block.height
                   );
        });
        
        for (let block of blockingBlocks) {
            // 检查这个方块是否可以移动
            const directions = [
                { dx: -1, dy: 0, name: '向左移动' },
                { dx: 1, dy: 0, name: '向右移动' },
                { dx: 0, dy: -1, name: '向上移动' },
                { dx: 0, dy: 1, name: '向下移动' }
            ];
            
            for (let dir of directions) {
                if (this.canMoveTo(block, block.x + dir.dx, block.y + dir.dy)) {
                    return {
                        blockId: block.id,
                        blockName: block.name,
                        direction: dir.name
                    };
                }
            }
        }
        
        return null;
    }
    
    showSolution() {
        alert('解法演示功能开发中...\n\n经典华容道的标准解法需要81步，主要思路是：\n1. 先移动小兵创造空间\n2. 移动五虎上将为曹操让路\n3. 逐步将曹操向出口移动');
    }
    
    showWinMessage() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        const level = this.levels[this.currentLevel];
        const timeString = document.getElementById('timer').textContent;
        
        document.getElementById('finalTime').textContent = timeString;
        document.getElementById('finalMoves').textContent = this.moves;
        
        // 计算评价
        let rating = '';
        let stars = '';
        
        if (this.moves <= level.minMoves) {
            rating = '完美！';
            stars = '⭐⭐⭐';
        } else if (this.moves <= level.minMoves * 1.2) {
            rating = '优秀';
            stars = '⭐⭐';
        } else if (this.moves <= level.minMoves * 1.5) {
            rating = '良好';
            stars = '⭐';
        } else {
            rating = '完成';
            stars = '🎉';
        }
        
        document.getElementById('rating').textContent = rating;
        document.getElementById('stars').textContent = stars;
        
        document.getElementById('gameMessage').classList.add('show');
        
        // 庆祝动画
        document.getElementById('caocao').classList.add('celebration');
        
        // 保存记录
        this.saveRecord();
    }
    
    hideMessage() {
        document.getElementById('gameMessage').classList.remove('show');
        document.querySelectorAll('.block').forEach(el => {
            el.classList.remove('celebration');
        });
    }
    
    nextLevel() {
        const levelKeys = Object.keys(this.levels);
        const currentIndex = levelKeys.indexOf(this.currentLevel);
        const nextIndex = (currentIndex + 1) % levelKeys.length;
        
        document.getElementById('levelSelect').value = levelKeys[nextIndex];
        this.loadLevel(levelKeys[nextIndex]);
        this.hideMessage();
    }
    
    saveRecord() {
        const records = JSON.parse(localStorage.getItem('klotski_records') || '{}');
        const levelKey = this.currentLevel;
        
        if (!records[levelKey] || this.moves < records[levelKey].moves) {
            records[levelKey] = {
                moves: this.moves,
                time: this.timer,
                timeString: document.getElementById('timer').textContent
            };
            
            localStorage.setItem('klotski_records', JSON.stringify(records));
            this.updateRecordDisplay();
        }
    }
    
    updateRecordDisplay() {
        const records = JSON.parse(localStorage.getItem('klotski_records') || '{}');
        const recordList = document.getElementById('recordList');
        
        recordList.innerHTML = '';
        
        Object.keys(this.levels).forEach(levelKey => {
            const level = this.levels[levelKey];
            const record = records[levelKey];
            
            const recordItem = document.createElement('div');
            recordItem.className = 'record-item';
            
            const recordText = record ? 
                `${record.moves}步 - ${record.timeString}` : 
                '暂无记录';
            
            recordItem.innerHTML = `
                <span class="level">${level.name}</span>
                <span class="record">${recordText}</span>
            `;
            
            recordList.appendChild(recordItem);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Klotski();
});