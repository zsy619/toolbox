class Hanoi {
    constructor() {
        this.diskCount = 3;
        this.towers = [[], [], []]; // 三个塔的圆盘
        this.moves = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.gameStarted = false;
        this.gameCompleted = false;
        this.moveHistory = [];
        this.selectedDisk = null;
        this.selectedTower = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.isAutoSolving = false;
        this.solvingSpeed = 1000; // 自动求解速度（毫秒）
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.resetGame();
        this.updateRecordDisplay();
    }
    
    bindEvents() {
        document.getElementById('difficultySelect').addEventListener('change', (e) => {
            this.diskCount = parseInt(e.target.value);
            this.resetGame();
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
            this.autoSolve();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('nextLevelBtn').addEventListener('click', () => {
            this.nextLevel();
        });
        
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.hideMessage();
            this.resetGame();
        });
        
        // 全局拖拽事件
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));
        
        // 塔点击事件
        document.querySelectorAll('.tower').forEach((tower, index) => {
            tower.addEventListener('click', () => this.onTowerClick(index));
        });
        
        // 键盘事件
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
    }
    
    resetGame() {
        this.towers = [[], [], []];
        this.moves = 0;
        this.timer = 0;
        this.gameStarted = false;
        this.gameCompleted = false;
        this.moveHistory = [];
        this.selectedDisk = null;
        this.selectedTower = null;
        this.isAutoSolving = false;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // 在第一个塔上放置所有圆盘（从大到小）
        for (let i = this.diskCount; i >= 1; i--) {
            this.towers[0].push(i);
        }
        
        this.updateMinMoves();
        this.updateStats();
        this.renderGame();
        this.hideMessage();
    }
    
    updateMinMoves() {
        const minMoves = Math.pow(2, this.diskCount) - 1;
        document.getElementById('minMoves').textContent = minMoves;
        document.getElementById('theoreticalMin').textContent = minMoves;
        document.getElementById('remainingMoves').textContent = minMoves;
    }
    
    renderGame() {
        // 清除现有圆盘
        document.querySelectorAll('.disk').forEach(disk => disk.remove());
        
        // 为每个塔渲染圆盘
        this.towers.forEach((tower, towerIndex) => {
            tower.forEach((diskSize, diskIndex) => {
                this.createDisk(diskSize, towerIndex, diskIndex);
            });
        });
        
        this.updateStats();
    }
    
    createDisk(size, towerIndex, position) {
        const disk = document.createElement('div');
        disk.className = `disk size-${size}`;
        disk.textContent = size;
        disk.dataset.size = size;
        disk.dataset.tower = towerIndex;
        
        // 计算位置
        const towerElement = document.querySelector(`[data-tower="${towerIndex}"]`);
        const towerRect = towerElement.getBoundingClientRect();
        const gameBoard = document.querySelector('.game-board');
        const boardRect = gameBoard.getBoundingClientRect();
        
        const diskHeight = 30;
        const bottom = 40 + (position * diskHeight); // 40px是塔底的高度
        
        disk.style.bottom = `${bottom}px`;
        disk.style.left = '50%';
        disk.style.transform = 'translateX(-50%)';
        
        // 添加拖拽事件
        this.makeDiskDraggable(disk);
        
        towerElement.appendChild(disk);
    }
    
    makeDiskDraggable(disk) {
        disk.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.startDrag(disk, e);
        });
        
        disk.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectDisk(disk);
        });
        
        // 触摸事件
        disk.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.startDrag(disk, touch);
        });
    }
    
    startDrag(disk, event) {
        const diskSize = parseInt(disk.dataset.size);
        const towerIndex = parseInt(disk.dataset.tower);
        
        // 检查是否可以移动（只能移动塔顶的圆盘）
        if (!this.canMoveDisk(towerIndex, diskSize)) {
            return;
        }
        
        if (!this.gameStarted) {
            this.startGame();
        }
        
        this.isDragging = true;
        this.selectedDisk = disk;
        this.selectedTower = towerIndex;
        
        const rect = disk.getBoundingClientRect();
        this.dragOffset = {
            x: event.clientX - rect.left - rect.width / 2,
            y: event.clientY - rect.top - rect.height / 2
        };
        
        disk.classList.add('dragging');
        this.showValidDropAreas();
    }
    
    onMouseMove(event) {
        if (!this.isDragging || !this.selectedDisk) return;
        
        const gameBoard = document.querySelector('.game-board');
        const boardRect = gameBoard.getBoundingClientRect();
        
        const newLeft = event.clientX - boardRect.left - this.dragOffset.x;
        const newTop = event.clientY - boardRect.top - this.dragOffset.y;
        
        this.selectedDisk.style.left = `${newLeft}px`;
        this.selectedDisk.style.top = `${newTop}px`;
        this.selectedDisk.style.transform = 'none';
        
        // 高亮有效的放置区域
        this.updateDropAreas(event.clientX, event.clientY);
    }
    
    onMouseUp(event) {
        if (!this.isDragging || !this.selectedDisk) return;
        
        this.isDragging = false;
        
        const targetTower = this.getDropTarget(event.clientX, event.clientY);
        
        if (targetTower !== null && this.canDropOnTower(targetTower)) {
            this.moveDisk(this.selectedTower, targetTower);
        } else {
            // 恢复原位置
            this.renderGame();
        }
        
        this.selectedDisk.classList.remove('dragging');
        this.hideDropAreas();
        this.selectedDisk = null;
        this.selectedTower = null;
    }
    
    selectDisk(disk) {
        const diskSize = parseInt(disk.dataset.size);
        const towerIndex = parseInt(disk.dataset.tower);
        
        if (!this.canMoveDisk(towerIndex, diskSize)) {
            return;
        }
        
        // 清除之前的选择
        document.querySelectorAll('.disk').forEach(d => d.classList.remove('selected'));
        
        disk.classList.add('selected');
        this.selectedDisk = disk;
        this.selectedTower = towerIndex;
        
        this.showValidDropAreas();
    }
    
    onTowerClick(towerIndex) {
        if (this.selectedDisk && this.selectedTower !== null) {
            if (this.canDropOnTower(towerIndex)) {
                this.moveDisk(this.selectedTower, towerIndex);
            }
            
            this.selectedDisk.classList.remove('selected');
            this.hideDropAreas();
            this.selectedDisk = null;
            this.selectedTower = null;
        }
    }
    
    canMoveDisk(towerIndex, diskSize) {
        const tower = this.towers[towerIndex];
        return tower.length > 0 && tower[tower.length - 1] === diskSize;
    }
    
    canDropOnTower(targetTower) {
        const diskSize = parseInt(this.selectedDisk.dataset.size);
        const tower = this.towers[targetTower];
        
        // 空塔可以放任何圆盘
        if (tower.length === 0) return true;
        
        // 只能将小圆盘放在大圆盘上
        return diskSize < tower[tower.length - 1];
    }
    
    moveDisk(fromTower, toTower) {
        if (fromTower === toTower) return;
        
        const disk = this.towers[fromTower].pop();
        this.towers[toTower].push(disk);
        
        // 记录移动历史
        this.moveHistory.push({ from: fromTower, to: toTower });
        
        this.moves++;
        this.updateStats();
        this.renderGame();
        
        // 检查胜利条件
        if (this.checkWin()) {
            this.showWinMessage();
        }
    }
    
    showValidDropAreas() {
        document.querySelectorAll('.tower').forEach((tower, index) => {
            if (this.canDropOnTower(index)) {
                tower.classList.add('valid-drop');
            } else {
                tower.classList.add('invalid-drop');
            }
        });
    }
    
    hideDropAreas() {
        document.querySelectorAll('.tower').forEach(tower => {
            tower.classList.remove('valid-drop', 'invalid-drop');
        });
    }
    
    updateDropAreas(clientX, clientY) {
        const targetTower = this.getDropTarget(clientX, clientY);
        
        document.querySelectorAll('.tower').forEach((tower, index) => {
            tower.classList.remove('valid-drop', 'invalid-drop');
            
            if (index === targetTower) {
                if (this.canDropOnTower(index)) {
                    tower.classList.add('valid-drop');
                } else {
                    tower.classList.add('invalid-drop');
                }
            }
        });
    }
    
    getDropTarget(clientX, clientY) {
        const towers = document.querySelectorAll('.tower');
        
        for (let i = 0; i < towers.length; i++) {
            const rect = towers[i].getBoundingClientRect();
            if (clientX >= rect.left && clientX <= rect.right &&
                clientY >= rect.top && clientY <= rect.bottom) {
                return i;
            }
        }
        
        return null;
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
        document.getElementById('currentMoves').textContent = this.moves;
        
        const minMoves = Math.pow(2, this.diskCount) - 1;
        const remaining = Math.max(0, minMoves - this.moves);
        const efficiency = this.moves > 0 ? Math.round((minMoves / this.moves) * 100) : 100;
        
        document.getElementById('remainingMoves').textContent = remaining;
        document.getElementById('efficiency').textContent = `${efficiency}%`;
    }
    
    checkWin() {
        return this.towers[2].length === this.diskCount;
    }
    
    showWinMessage() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.gameCompleted = true;
        
        const minMoves = Math.pow(2, this.diskCount) - 1;
        const efficiency = Math.round((minMoves / this.moves) * 100);
        const timeString = document.getElementById('timer').textContent;
        
        document.getElementById('finalTime').textContent = timeString;
        document.getElementById('finalMoves').textContent = this.moves;
        document.getElementById('finalMinMoves').textContent = minMoves;
        document.getElementById('finalEfficiency').textContent = `${efficiency}%`;
        
        // 计算评价和成就
        let rating = '';
        let achievement = '';
        
        if (this.moves === minMoves) {
            rating = '⭐⭐⭐';
            achievement = '🏆 完美解法！';
        } else if (efficiency >= 90) {
            rating = '⭐⭐';
            achievement = '🥈 接近完美！';
        } else if (efficiency >= 70) {
            rating = '⭐';
            achievement = '🥉 不错的表现！';
        } else {
            rating = '🎉';
            achievement = '✨ 完成挑战！';
        }
        
        document.getElementById('rating').textContent = rating;
        document.getElementById('achievement').textContent = achievement;
        
        document.getElementById('gameMessage').classList.add('show');
        
        // 庆祝动画
        document.querySelector('[data-tower="2"]').classList.add('completed-tower');
        
        // 保存记录
        this.saveRecord();
    }
    
    hideMessage() {
        document.getElementById('gameMessage').classList.remove('show');
        document.querySelectorAll('.tower').forEach(tower => {
            tower.classList.remove('completed-tower');
        });
    }
    
    undoMove() {
        if (this.moveHistory.length === 0 || this.isAutoSolving) return;
        
        const lastMove = this.moveHistory.pop();
        const disk = this.towers[lastMove.to].pop();
        this.towers[lastMove.from].push(disk);
        
        this.moves = Math.max(0, this.moves - 1);
        this.updateStats();
        this.renderGame();
    }
    
    showHint() {
        if (this.isAutoSolving) return;
        
        const solution = this.getNextMove();
        if (solution) {
            const towerNames = ['起始塔', '辅助塔', '目标塔'];
            alert(`提示：将圆盘从 ${towerNames[solution.from]} 移动到 ${towerNames[solution.to]}`);
            
            // 高亮提示的圆盘
            const diskSize = this.towers[solution.from][this.towers[solution.from].length - 1];
            const diskElement = document.querySelector(`[data-size="${diskSize}"][data-tower="${solution.from}"]`);
            if (diskElement) {
                diskElement.style.boxShadow = '0 0 20px #FFD700';
                setTimeout(() => {
                    diskElement.style.boxShadow = '';
                }, 2000);
            }
        }
    }
    
    getNextMove() {
        // 使用递归算法找到下一步最优移动
        const moves = this.solveTowers(this.diskCount, 0, 2, 1, []);
        
        // 找到当前状态在解法中的位置
        let currentStateIndex = 0;
        for (let i = 0; i < moves.length; i++) {
            // 模拟执行到第i步的状态
            const testTowers = [[], [], []];
            for (let j = this.diskCount; j >= 1; j--) {
                testTowers[0].push(j);
            }
            
            for (let j = 0; j <= i; j++) {
                const move = moves[j];
                const disk = testTowers[move.from].pop();
                testTowers[move.to].push(disk);
            }
            
            // 检查是否匹配当前状态
            if (this.statesEqual(testTowers, this.towers)) {
                currentStateIndex = i + 1;
                break;
            }
        }
        
        return currentStateIndex < moves.length ? moves[currentStateIndex] : null;
    }
    
    statesEqual(state1, state2) {
        for (let i = 0; i < 3; i++) {
            if (state1[i].length !== state2[i].length) return false;
            for (let j = 0; j < state1[i].length; j++) {
                if (state1[i][j] !== state2[i][j]) return false;
            }
        }
        return true;
    }
    
    autoSolve() {
        if (this.isAutoSolving) {
            this.isAutoSolving = false;
            document.getElementById('solveBtn').textContent = '自动求解';
            return;
        }
        
        this.isAutoSolving = true;
        document.getElementById('solveBtn').textContent = '停止求解';
        
        if (!this.gameStarted) {
            this.startGame();
        }
        
        const solution = this.solveTowers(this.diskCount, 0, 2, 1, []);
        this.executeSolution(solution);
    }
    
    solveTowers(n, from, to, aux, moves) {
        if (n === 1) {
            moves.push({ from, to });
            return moves;
        }
        
        // 将n-1个圆盘从起始塔移动到辅助塔
        this.solveTowers(n - 1, from, aux, to, moves);
        
        // 将最大的圆盘从起始塔移动到目标塔
        moves.push({ from, to });
        
        // 将n-1个圆盘从辅助塔移动到目标塔
        this.solveTowers(n - 1, aux, to, from, moves);
        
        return moves;
    }
    
    executeSolution(solution) {
        let stepIndex = 0;
        
        const executeStep = () => {
            if (!this.isAutoSolving || stepIndex >= solution.length) {
                this.isAutoSolving = false;
                document.getElementById('solveBtn').textContent = '自动求解';
                return;
            }
            
            const move = solution[stepIndex];
            this.moveDisk(move.from, move.to);
            
            stepIndex++;
            setTimeout(executeStep, this.solvingSpeed);
        };
        
        executeStep();
    }
    
    togglePause() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            document.getElementById('pauseBtn').textContent = '继续';
        } else if (this.gameStarted && !this.gameCompleted) {
            this.startTimer();
            document.getElementById('pauseBtn').textContent = '暂停';
        }
    }
    
    nextLevel() {
        const currentDifficulty = parseInt(document.getElementById('difficultySelect').value);
        const newDifficulty = Math.min(8, currentDifficulty + 1);
        
        document.getElementById('difficultySelect').value = newDifficulty.toString();
        this.diskCount = newDifficulty;
        this.hideMessage();
        this.resetGame();
    }
    
    onKeyDown(event) {
        if (this.isAutoSolving) return;
        
        switch (event.key) {
            case '1':
                this.onTowerClick(0);
                break;
            case '2':
                this.onTowerClick(1);
                break;
            case '3':
                this.onTowerClick(2);
                break;
            case 'h':
            case 'H':
                this.showHint();
                break;
            case 'r':
            case 'R':
                this.resetGame();
                break;
            case 'u':
            case 'U':
                this.undoMove();
                break;
        }
    }
    
    saveRecord() {
        const records = JSON.parse(localStorage.getItem('hanoi_records') || '{}');
        const levelKey = `level_${this.diskCount}`;
        
        if (!records[levelKey] || this.moves < records[levelKey].moves) {
            records[levelKey] = {
                moves: this.moves,
                time: this.timer,
                timeString: document.getElementById('timer').textContent,
                efficiency: Math.round((Math.pow(2, this.diskCount) - 1) / this.moves * 100)
            };
            
            localStorage.setItem('hanoi_records', JSON.stringify(records));
            this.updateRecordDisplay();
        }
    }
    
    updateRecordDisplay() {
        const records = JSON.parse(localStorage.getItem('hanoi_records') || '{}');
        const recordList = document.getElementById('recordList');
        
        recordList.innerHTML = '';
        
        for (let i = 3; i <= 8; i++) {
            const levelKey = `level_${i}`;
            const record = records[levelKey];
            
            const recordItem = document.createElement('div');
            recordItem.className = 'record-item';
            
            const recordText = record ? 
                `${record.moves}步 - ${record.timeString} (${record.efficiency}%)` : 
                '暂无记录';
            
            recordItem.innerHTML = `
                <span class="level">${i}层</span>
                <span class="record">${recordText}</span>
            `;
            
            recordList.appendChild(recordItem);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Hanoi();
});