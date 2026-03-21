class Sudoku {
    constructor() {
        this.size = 9;
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.solution = Array(9).fill().map(() => Array(9).fill(0));
        this.initialBoard = Array(9).fill().map(() => Array(9).fill(0));
        this.selectedCell = null;
        this.selectedNumber = null;
        this.notesMode = false;
        this.notes = Array(9).fill().map(() => Array(9).fill().map(() => new Set()));
        
        this.difficulty = 'easy';
        this.difficulties = {
            easy: { name: '简单', blanks: 35 },
            medium: { name: '中等', blanks: 45 },
            hard: { name: '困难', blanks: 55 }
        };
        
        this.timer = 0;
        this.timerInterval = null;
        this.gameState = 'ready'; // ready, playing, paused, completed
        
        this.init();
    }
    
    init() {
        this.createGrid();
        this.bindEvents();
        this.generateNewGame();
        this.updateUI();
    }
    
    createGrid() {
        const gridContainer = document.getElementById('sudokuGrid');
        gridContainer.innerHTML = '';
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // 添加宫格边界样式
                if (col === 2 || col === 5) cell.style.borderRight = '2px solid #2c3e50';
                if (row === 2 || row === 5) cell.style.borderBottom = '2px solid #2c3e50';
                
                cell.addEventListener('click', () => this.selectCell(row, col));
                gridContainer.appendChild(cell);
            }
        }
    }
    
    bindEvents() {
        // 难度选择
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeDifficulty(e.target.dataset.level);
            });
        });
        
        // 数字输入
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectNumber(parseInt(e.target.dataset.number));
            });
        });
        
        // 控制按钮
        document.getElementById('newGameBtn').addEventListener('click', () => this.generateNewGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('hintBtn').addEventListener('click', () => this.giveHint());
        document.getElementById('solveBtn').addEventListener('click', () => this.solvePuzzle());
        document.getElementById('eraseBtn').addEventListener('click', () => this.eraseCell());
        document.getElementById('notesBtn').addEventListener('click', () => this.toggleNotesMode());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.generateNewGame());
        
        // 键盘输入
        document.addEventListener('keydown', (e) => {
            if (this.gameState !== 'playing') return;
            
            const num = parseInt(e.key);
            if (num >= 1 && num <= 9) {
                this.selectNumber(num);
            } else if (e.key === 'Backspace' || e.key === 'Delete') {
                this.eraseCell();
            } else if (e.key === 'n' || e.key === 'N') {
                this.toggleNotesMode();
            }
        });
    }
    
    generateNewGame() {
        this.gameState = 'ready';
        this.timer = 0;
        this.clearTimer();
        
        // 生成完整的数独解
        this.board = Array(9).fill().map(() => Array(9).fill(0));
        this.generateComplete();
        this.solution = this.board.map(row => [...row]);
        
        // 根据难度移除数字
        this.createPuzzle();
        this.initialBoard = this.board.map(row => [...row]);
        
        // 重置游戏状态
        this.notes = Array(9).fill().map(() => Array(9).fill().map(() => new Set()));
        this.selectedCell = null;
        this.selectedNumber = null;
        this.notesMode = false;
        
        this.renderBoard();
        this.updateUI();
        this.hideMessage();
        
        this.gameState = 'playing';
        this.startTimer();
    }
    
    generateComplete() {
        // 使用回溯算法生成完整的数独
        this.solveSudoku(this.board);
    }
    
    solveSudoku(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    // 随机尝试数字以增加随机性
                    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    
                    for (let num of numbers) {
                        if (this.isValidMove(board, row, col, num)) {
                            board[row][col] = num;
                            
                            if (this.solveSudoku(board)) {
                                return true;
                            }
                            
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    
    createPuzzle() {
        const blanks = this.difficulties[this.difficulty].blanks;
        const cells = [];
        
        // 创建所有格子的索引
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                cells.push([row, col]);
            }
        }
        
        // 随机移除数字
        this.shuffleArray(cells);
        
        for (let i = 0; i < blanks && i < cells.length; i++) {
            const [row, col] = cells[i];
            this.board[row][col] = 0;
        }
    }
    
    isValidMove(board, row, col, num) {
        // 检查行
        for (let c = 0; c < 9; c++) {
            if (board[row][c] === num) return false;
        }
        
        // 检查列
        for (let r = 0; r < 9; r++) {
            if (board[r][col] === num) return false;
        }
        
        // 检查3x3宫格
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        
        for (let r = boxRow; r < boxRow + 3; r++) {
            for (let c = boxCol; c < boxCol + 3; c++) {
                if (board[r][c] === num) return false;
            }
        }
        
        return true;
    }
    
    shuffleArray(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }
    
    selectCell(row, col) {
        if (this.gameState !== 'playing') return;
        if (this.initialBoard[row][col] !== 0) return; // 不能选择初始数字
        
        // 移除之前的选中状态
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('selected', 'same-number');
        });
        
        this.selectedCell = { row, col };
        
        // 高亮选中的格子
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add('selected');
        
        // 高亮相同数字
        if (this.board[row][col] !== 0) {
            this.highlightSameNumbers(this.board[row][col]);
        }
        
        this.updateUI();
    }
    
    selectNumber(num) {
        if (this.gameState !== 'playing') return;
        
        // 更新数字按钮选中状态
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-number="${num}"]`).classList.add('selected');
        
        this.selectedNumber = num;
        
        // 如果有选中的格子，填入数字
        if (this.selectedCell) {
            this.fillNumber(this.selectedCell.row, this.selectedCell.col, num);
        }
        
        // 高亮相同数字
        this.highlightSameNumbers(num);
    }
    
    fillNumber(row, col, num) {
        if (this.initialBoard[row][col] !== 0) return;
        
        if (this.notesMode) {
            // 笔记模式
            if (this.notes[row][col].has(num)) {
                this.notes[row][col].delete(num);
            } else {
                this.notes[row][col].add(num);
            }
        } else {
            // 正常模式
            this.board[row][col] = num;
            this.notes[row][col].clear(); // 清除笔记
            
            // 检查是否有效
            if (!this.isValidMove(this.board, row, col, num)) {
                this.showError(row, col);
            }
            
            // 检查是否完成
            if (this.isPuzzleComplete()) {
                this.completePuzzle();
            }
        }
        
        this.renderBoard();
        this.updateUI();
    }
    
    eraseCell() {
        if (!this.selectedCell) return;
        const { row, col } = this.selectedCell;
        
        if (this.initialBoard[row][col] !== 0) return;
        
        this.board[row][col] = 0;
        this.notes[row][col].clear();
        
        this.renderBoard();
        this.updateUI();
    }
    
    toggleNotesMode() {
        this.notesMode = !this.notesMode;
        const notesBtn = document.getElementById('notesBtn');
        notesBtn.textContent = this.notesMode ? '退出笔记' : '笔记';
        notesBtn.style.background = this.notesMode ? '#e74c3c' : '#95a5a6';
    }
    
    highlightSameNumbers(num) {
        document.querySelectorAll('.cell').forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            
            if (this.board[row][col] === num) {
                cell.classList.add('same-number');
            }
        });
    }
    
    showError(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add('error');
        
        setTimeout(() => {
            cell.classList.remove('error');
        }, 1000);
    }
    
    giveHint() {
        if (this.gameState !== 'playing') return;
        
        // 找到一个空格子并填入正确答案
        const emptyCells = [];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] === 0) {
                    emptyCells.push([row, col]);
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[row][col] = this.solution[row][col];
            
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            cell.classList.add('celebrate');
            
            setTimeout(() => {
                cell.classList.remove('celebrate');
            }, 600);
            
            this.renderBoard();
            this.updateUI();
            
            if (this.isPuzzleComplete()) {
                this.completePuzzle();
            }
        }
    }
    
    solvePuzzle() {
        if (this.gameState !== 'playing') return;
        
        this.board = this.solution.map(row => [...row]);
        this.renderBoard();
        this.completePuzzle();
    }
    
    isPuzzleComplete() {
        // 检查是否所有格子都填满
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (this.board[row][col] === 0) return false;
            }
        }
        
        // 检查是否符合数独规则
        return this.isValidSudoku();
    }
    
    isValidSudoku() {
        // 创建临时数组，重置为0后检查
        const tempBoard = this.board.map(row => [...row]);
        
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const num = tempBoard[row][col];
                if (num !== 0) {
                    tempBoard[row][col] = 0;
                    if (!this.isValidMove(tempBoard, row, col, num)) {
                        return false;
                    }
                    tempBoard[row][col] = num;
                }
            }
        }
        return true;
    }
    
    completePuzzle() {
        this.gameState = 'completed';
        this.clearTimer();
        
        // 庆祝动画
        document.querySelectorAll('.cell').forEach((cell, index) => {
            setTimeout(() => {
                cell.classList.add('completed', 'celebrate');
            }, index * 20);
        });
        
        // 显示完成消息
        setTimeout(() => {
            this.showMessage('恭喜完成！', '你成功解决了这个数独！');
        }, 2000);
    }
    
    changeDifficulty(level) {
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-level="${level}"]`).classList.add('active');
        
        this.difficulty = level;
        document.getElementById('currentDifficulty').textContent = this.difficulties[level].name;
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.clearTimer();
            document.getElementById('pauseBtn').textContent = '继续';
            
            // 隐藏数字
            document.querySelectorAll('.cell').forEach(cell => {
                if (!cell.classList.contains('given')) {
                    cell.style.color = 'transparent';
                }
            });
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';  
            this.startTimer();
            document.getElementById('pauseBtn').textContent = '暂停';
            
            // 显示数字
            document.querySelectorAll('.cell').forEach(cell => {
                cell.style.color = '';
            });
        }
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);
    }
    
    clearTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateTimer() {
        const minutes = Math.floor(this.timer / 60);
        const seconds = this.timer % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('timer').textContent = timeString;
        document.getElementById('finalTime').textContent = timeString;
    }
    
    renderBoard() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                const value = this.board[row][col];
                const isGiven = this.initialBoard[row][col] !== 0;
                
                // 重置样式
                cell.className = 'cell';
                
                if (isGiven) {
                    cell.classList.add('given');
                }
                
                if (value !== 0) {
                    cell.textContent = value;
                    cell.innerHTML = value;
                } else if (this.notes[row][col].size > 0) {
                    // 显示笔记
                    cell.innerHTML = '';
                    const notesDiv = document.createElement('div');
                    notesDiv.className = 'cell-notes';
                    
                    for (let i = 1; i <= 9; i++) {
                        const noteDiv = document.createElement('div');
                        noteDiv.className = 'note';
                        if (this.notes[row][col].has(i)) {
                            noteDiv.textContent = i;
                        }
                        notesDiv.appendChild(noteDiv);
                    }
                    
                    cell.appendChild(notesDiv);
                } else {
                    cell.textContent = '';
                    cell.innerHTML = '';
                }
            }
        }
    }
    
    updateUI() {
        // 更新进度
        const filledCells = this.board.flat().filter(cell => cell !== 0).length;
        const progress = Math.round((filledCells / 81) * 100);
        document.getElementById('progress').textContent = `${progress}%`;
        
        this.updateTimer();
    }
    
    showMessage(title, text) {
        document.getElementById('messageTitle').textContent = title;
        document.getElementById('messageText').textContent = text;
        document.getElementById('gameMessage').classList.add('show');
    }
    
    hideMessage() {
        document.getElementById('gameMessage').classList.remove('show');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Sudoku();
});