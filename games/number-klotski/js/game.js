class NumberKlotski {
            constructor() {
                this.size = 3;
                this.board = [];
                this.emptyPos = { row: this.size - 1, col: this.size - 1 };
                this.moves = 0;
                this.startTime = null;
                this.gameTime = 0;
                this.timerInterval = null;
                this.gameStarted = false;
                
                this.init();
            }

            init() {
                this.setupEventListeners();
                this.loadBestRecords();
                this.newGame();
                this.updateRecordsDisplay();
            }

            setupEventListeners() {
                // 难度选择
                document.querySelectorAll('.difficulty-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        this.size = parseInt(e.target.dataset.size);
                        this.newGame();
                    });
                });

                // 键盘控制
                document.addEventListener('keydown', (e) => {
                    if (!this.gameStarted) return;
                    
                    switch (e.key) {
                        case 'ArrowUp':
                            e.preventDefault();
                            this.moveByDirection('down');
                            break;
                        case 'ArrowDown':
                            e.preventDefault();
                            this.moveByDirection('up');
                            break;
                        case 'ArrowLeft':
                            e.preventDefault();
                            this.moveByDirection('right');
                            break;
                        case 'ArrowRight':
                            e.preventDefault();
                            this.moveByDirection('left');
                            break;
                    }
                });
            }

            newGame() {
                this.moves = 0;
                this.gameTime = 0;
                this.startTime = null;
                this.gameStarted = false;
                this.emptyPos = { row: this.size - 1, col: this.size - 1 };
                
                if (this.timerInterval) {
                    clearInterval(this.timerInterval);
                    this.timerInterval = null;
                }
                
                this.createSolvedBoard();
                this.shuffle();
                this.renderBoard();
                this.updateStats();
                this.updateBestRecord();
                
                document.getElementById('completeOverlay').style.display = 'none';
            }

            createSolvedBoard() {
                this.board = [];
                let num = 1;
                
                for (let row = 0; row < this.size; row++) {
                    this.board[row] = [];
                    for (let col = 0; col < this.size; col++) {
                        if (row === this.size - 1 && col === this.size - 1) {
                            this.board[row][col] = 0; // 空格
                        } else {
                            this.board[row][col] = num++;
                        }
                    }
                }
            }

            shuffle() {
                // 使用有效的移动来打乱，确保有解
                const moves = this.size * this.size * 100;
                const directions = ['up', 'down', 'left', 'right'];
                
                for (let i = 0; i < moves; i++) {
                    const direction = directions[Math.floor(Math.random() * directions.length)];
                    this.moveByDirection(direction, true);
                }
                
                this.moves = 0;
                this.updateStats();
            }

            moveByDirection(direction, silent = false) {
                const { row, col } = this.emptyPos;
                let newRow = row;
                let newCol = col;
                
                switch (direction) {
                    case 'up':
                        newRow = row - 1;
                        break;
                    case 'down':
                        newRow = row + 1;
                        break;
                    case 'left':
                        newCol = col - 1;
                        break;
                    case 'right':
                        newCol = col + 1;
                        break;
                }
                
                if (this.isValidPosition(newRow, newCol)) {
                    this.moveTile(newRow, newCol, silent);
                    return true;
                }
                return false;
            }

            isValidPosition(row, col) {
                return row >= 0 && row < this.size && col >= 0 && col < this.size;
            }

            moveTile(row, col, silent = false) {
                if (!this.isAdjacentToEmpty(row, col)) return false;
                
                // 交换空格和点击的方块
                this.board[this.emptyPos.row][this.emptyPos.col] = this.board[row][col];
                this.board[row][col] = 0;
                this.emptyPos = { row, col };
                
                if (!silent) {
                    this.moves++;
                    this.startTimer();
                    this.updateStats();
                    this.renderBoard();
                    
                    // 检查是否完成
                    if (this.isComplete()) {
                        this.gameComplete();
                    }
                }
                
                return true;
            }

            isAdjacentToEmpty(row, col) {
                const { row: emptyRow, col: emptyCol } = this.emptyPos;
                return (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
                       (Math.abs(col - emptyCol) === 1 && row === emptyRow);
            }

            startTimer() {
                if (!this.gameStarted) {
                    this.gameStarted = true;
                    this.startTime = Date.now();
                    
                    this.timerInterval = setInterval(() => {
                        this.gameTime = Date.now() - this.startTime;
                        this.updateStats();
                    }, 100);
                }
            }

            isComplete() {
                let expectedNum = 1;
                
                for (let row = 0; row < this.size; row++) {
                    for (let col = 0; col < this.size; col++) {
                        if (row === this.size - 1 && col === this.size - 1) {
                            return this.board[row][col] === 0;
                        } else if (this.board[row][col] !== expectedNum) {
                            return false;
                        }
                        expectedNum++;
                    }
                }
                return true;
            }

            gameComplete() {
                this.gameStarted = false;
                if (this.timerInterval) {
                    clearInterval(this.timerInterval);
                    this.timerInterval = null;
                }
                
                // 检查是否是新记录
                const isNewRecord = this.checkAndSaveRecord();
                
                // 显示完成弹窗
                document.getElementById('finalMoves').textContent = this.moves;
                document.getElementById('finalTime').textContent = this.formatTime(this.gameTime);
                document.getElementById('finalDifficulty').textContent = `${this.size}×${this.size}`;
                document.getElementById('newRecordText').style.display = isNewRecord ? 'block' : 'none';
                document.getElementById('completeOverlay').style.display = 'flex';
                
                this.updateRecordsDisplay();
            }

            checkAndSaveRecord() {
                const key = `klotski_${this.size}x${this.size}`;
                const currentRecord = {
                    moves: this.moves,
                    time: this.gameTime,
                    timestamp: Date.now()
                };
                
                const bestRecord = JSON.parse(localStorage.getItem(key));
                
                if (!bestRecord || this.moves < bestRecord.moves || 
                    (this.moves === bestRecord.moves && this.gameTime < bestRecord.time)) {
                    localStorage.setItem(key, JSON.stringify(currentRecord));
                    return true;
                }
                
                return false;
            }

            loadBestRecords() {
                this.bestRecords = {};
                for (let size = 3; size <= 6; size++) {
                    const key = `klotski_${size}x${size}`;
                    const record = JSON.parse(localStorage.getItem(key));
                    if (record) {
                        this.bestRecords[size] = record;
                    }
                }
            }

            updateBestRecord() {
                const record = this.bestRecords[this.size];
                const bestRecordEl = document.getElementById('bestRecord');
                
                if (record) {
                    bestRecordEl.textContent = `${record.moves}步`;
                } else {
                    bestRecordEl.textContent = '--';
                }
            }

            updateRecordsDisplay() {
                const recordsGrid = document.getElementById('recordsGrid');
                recordsGrid.innerHTML = '';
                
                for (let size = 3; size <= 6; size++) {
                    const record = this.bestRecords[size];
                    const recordItem = document.createElement('div');
                    recordItem.className = 'record-item';
                    
                    const difficultyNames = {
                        3: '简单',
                        4: '中等',
                        5: '困难',
                        6: '专家'
                    };
                    
                    recordItem.innerHTML = `
                        <div class="record-difficulty">${difficultyNames[size]} (${size}×${size})</div>
                        <div class="record-moves">${record ? record.moves + '步' : '--'}</div>
                        <div class="record-time">${record ? this.formatTime(record.time) : '--'}</div>
                    `;
                    
                    recordsGrid.appendChild(recordItem);
                }
            }

            renderBoard() {
                const gameBoard = document.getElementById('gameBoard');
                gameBoard.innerHTML = '';
                gameBoard.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
                gameBoard.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
                
                for (let row = 0; row < this.size; row++) {
                    for (let col = 0; col < this.size; col++) {
                        const tile = document.createElement('div');
                        tile.className = 'tile';
                        
                        if (this.board[row][col] === 0) {
                            tile.classList.add('empty');
                        } else {
                            tile.textContent = this.board[row][col];
                            tile.addEventListener('click', () => this.handleTileClick(row, col));
                        }
                        
                        gameBoard.appendChild(tile);
                    }
                }
            }

            handleTileClick(row, col) {
                if (this.board[row][col] === 0) return;
                
                const tile = event.target;
                tile.classList.add('moving');
                
                if (this.moveTile(row, col)) {
                    setTimeout(() => {
                        tile.classList.remove('moving');
                    }, 300);
                } else {
                    setTimeout(() => {
                        tile.classList.remove('moving');
                    }, 150);
                }
            }

            updateStats() {
                document.getElementById('moves').textContent = this.moves;
                document.getElementById('time').textContent = this.formatTime(this.gameTime);
                document.getElementById('difficulty').textContent = `${this.size}×${this.size}`;
            }

            formatTime(ms) {
                const seconds = Math.floor(ms / 1000);
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = seconds % 60;
                return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
            }

            autoSolve() {
                if (!confirm('确定要使用自动求解吗？这将重置当前游戏进度。')) return;
                
                // 简单的自动求解演示
                this.createSolvedBoard();
                this.renderBoard();
                this.moves = 0;
                this.gameTime = 0;
                this.gameStarted = false;
                if (this.timerInterval) {
                    clearInterval(this.timerInterval);
                    this.timerInterval = null;
                }
                this.updateStats();
                
                alert('已自动求解！在实际游戏中，您可以实现更复杂的求解算法。');
            }

            showHint() {
                if (!this.gameStarted) {
                    alert('请先开始游戏！');
                    return;
                }
                
                // 简单的提示逻辑
                const hints = [
                    '先尝试完成第一行的数字排列',
                    '移动较小的数字到正确位置',
                    '利用空格作为临时位置来移动其他数字',
                    '从左上角开始，逐行完成拼图',
                    '注意观察数字的相对位置关系'
                ];
                
                const randomHint = hints[Math.floor(Math.random() * hints.length)];
                alert(`💡 提示：${randomHint}`);
            }

            closeComplete() {
                document.getElementById('completeOverlay').style.display = 'none';
            }
        }

        // 全局游戏实例
        let numberKlotski;

        // 初始化游戏
        document.addEventListener('DOMContentLoaded', () => {
            numberKlotski = new NumberKlotski();
        });