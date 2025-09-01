class MatchPairs {
            constructor() {
                this.difficulty = 'easy';
                this.board = [];
                this.selectedTiles = [];
                this.matchedPairs = 0;
                this.totalPairs = 0;
                this.score = 0;
                this.combo = 0;
                this.maxCombo = 0;
                this.timeLeft = 300; // 5分钟
                this.gameStarted = false;
                this.gamePaused = false;
                this.timer = null;
                this.hintCount = 3;
                
                this.difficulties = {
                    easy: { rows: 4, cols: 4, time: 300, icons: 8 },
                    medium: { rows: 6, cols: 6, time: 480, icons: 18 },
                    hard: { rows: 6, cols: 8, time: 600, icons: 24 },
                    expert: { rows: 8, cols: 8, time: 720, icons: 32 }
                };
                
                this.icons = [
                    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
                    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
                    '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟',
                    '🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '🌼', '🌲'
                ];
                
                this.init();
            }

            init() {
                this.setupEventListeners();
                this.updateDisplay();
            }

            setupEventListeners() {
                document.querySelectorAll('.difficulty-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        if (this.gameStarted && !this.gamePaused) return;
                        
                        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        this.difficulty = e.target.dataset.difficulty;
                    });
                });

                document.addEventListener('keydown', (e) => {
                    if (e.key === ' ') {
                        e.preventDefault();
                        if (this.gameStarted) {
                            this.pauseGame();
                        } else {
                            this.newGame();
                        }
                    }
                });
            }

            newGame() {
                this.gameStarted = true;
                this.gamePaused = false;
                this.selectedTiles = [];
                this.matchedPairs = 0;
                this.score = 0;
                this.combo = 0;
                this.maxCombo = 0;
                this.hintCount = 3;
                
                const config = this.difficulties[this.difficulty];
                this.timeLeft = config.time;
                this.totalPairs = (config.rows * config.cols) / 2;
                
                this.createBoard();
                this.startTimer();
                this.updateDisplay();
                this.updateProgress();
                
                document.getElementById('pauseBtn').textContent = '⏸️ 暂停';
                document.getElementById('completeOverlay').style.display = 'none';
            }

            createBoard() {
                const config = this.difficulties[this.difficulty];
                const totalTiles = config.rows * config.cols;
                const pairsNeeded = totalTiles / 2;
                
                // 创建配对图标
                const gameIcons = this.icons.slice(0, pairsNeeded);
                const tiles = [...gameIcons, ...gameIcons];
                
                // 洗牌
                for (let i = tiles.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
                }
                
                // 创建二维数组
                this.board = [];
                for (let i = 0; i < config.rows; i++) {
                    this.board[i] = [];
                    for (let j = 0; j < config.cols; j++) {
                        this.board[i][j] = {
                            icon: tiles[i * config.cols + j],
                            matched: false,
                            selected: false
                        };
                    }
                }
                
                this.renderBoard();
            }

            renderBoard() {
                const config = this.difficulties[this.difficulty];
                const gameBoard = document.getElementById('gameBoard');
                gameBoard.innerHTML = '';
                gameBoard.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
                gameBoard.style.gridTemplateRows = `repeat(${config.rows}, 1fr)`;
                
                for (let i = 0; i < config.rows; i++) {
                    for (let j = 0; j < config.cols; j++) {
                        const tile = document.createElement('div');
                        tile.className = 'tile';
                        tile.textContent = this.board[i][j].icon;
                        tile.dataset.row = i;
                        tile.dataset.col = j;
                        
                        tile.addEventListener('click', () => this.handleTileClick(i, j));
                        
                        gameBoard.appendChild(tile);
                    }
                }
            }

            handleTileClick(row, col) {
                if (!this.gameStarted || this.gamePaused) return;
                
                const tile = this.board[row][col];
                if (tile.matched || tile.selected) return;
                
                // 如果已经选择了2个方块，先清除选择
                if (this.selectedTiles.length >= 2) {
                    this.clearSelection();
                }
                
                // 选择当前方块
                tile.selected = true;
                this.selectedTiles.push({row, col});
                this.updateTileDisplay(row, col);
                
                // 如果选择了2个方块，检查是否匹配
                if (this.selectedTiles.length === 2) {
                    setTimeout(() => this.checkMatch(), 500);
                }
            }

            checkMatch() {
                const [tile1, tile2] = this.selectedTiles;
                const icon1 = this.board[tile1.row][tile1.col].icon;
                const icon2 = this.board[tile2.row][tile2.col].icon;
                
                if (icon1 === icon2) {
                    // 匹配成功
                    this.board[tile1.row][tile1.col].matched = true;
                    this.board[tile2.row][tile2.col].matched = true;
                    this.matchedPairs++;
                    this.combo++;
                    
                    if (this.combo > this.maxCombo) {
                        this.maxCombo = this.combo;
                    }
                    
                    // 计算分数
                    const baseScore = 10;
                    const comboBonus = this.combo > 1 ? (this.combo - 1) * 5 : 0;
                    this.score += baseScore + comboBonus;
                    
                    // 更新显示
                    this.updateTileDisplay(tile1.row, tile1.col, 'matched');
                    this.updateTileDisplay(tile2.row, tile2.col, 'matched');
                    
                    // 检查游戏是否完成
                    if (this.matchedPairs === this.totalPairs) {
                        this.gameComplete();
                    }
                } else {
                    // 匹配失败
                    this.combo = 0;
                    this.updateTileDisplay(tile1.row, tile1.col, 'wrong');
                    this.updateTileDisplay(tile2.row, tile2.col, 'wrong');
                    
                    setTimeout(() => {
                        this.clearSelection();
                    }, 800);
                }
                
                this.updateDisplay();
                this.updateProgress();
            }

            clearSelection() {
                this.selectedTiles.forEach(({row, col}) => {
                    if (!this.board[row][col].matched) {
                        this.board[row][col].selected = false;
                        this.updateTileDisplay(row, col);
                    }
                });
                this.selectedTiles = [];
            }

            updateTileDisplay(row, col, status = null) {
                const tileElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                const tile = this.board[row][col];
                
                // 清除所有状态类
                tileElement.classList.remove('selected', 'matched', 'wrong', 'hint');
                
                if (status === 'matched') {
                    tileElement.classList.add('matched');
                } else if (status === 'wrong') {
                    tileElement.classList.add('wrong');
                } else if (tile.selected) {
                    tileElement.classList.add('selected');
                }
            }

            pauseGame() {
                if (!this.gameStarted) return;
                
                if (this.gamePaused) {
                    // 继续游戏
                    this.gamePaused = false;
                    this.startTimer();
                    document.getElementById('pauseBtn').textContent = '⏸️ 暂停';
                } else {
                    // 暂停游戏
                    this.gamePaused = true;
                    if (this.timer) {
                        clearInterval(this.timer);
                        this.timer = null;
                    }
                    document.getElementById('pauseBtn').textContent = '▶️ 继续';
                }
            }

            showHint() {
                if (!this.gameStarted || this.gamePaused || this.hintCount <= 0) return;
                
                // 寻找可匹配的一对
                const availableTiles = [];
                const config = this.difficulties[this.difficulty];
                
                for (let i = 0; i < config.rows; i++) {
                    for (let j = 0; j < config.cols; j++) {
                        if (!this.board[i][j].matched) {
                            availableTiles.push({row: i, col: j, icon: this.board[i][j].icon});
                        }
                    }
                }
                
                // 找到第一对匹配的方块
                for (let i = 0; i < availableTiles.length; i++) {
                    for (let j = i + 1; j < availableTiles.length; j++) {
                        if (availableTiles[i].icon === availableTiles[j].icon) {
                            // 显示提示
                            const tile1 = document.querySelector(`[data-row="${availableTiles[i].row}"][data-col="${availableTiles[i].col}"]`);
                            const tile2 = document.querySelector(`[data-row="${availableTiles[j].row}"][data-col="${availableTiles[j].col}"]`);
                            
                            tile1.classList.add('hint');
                            tile2.classList.add('hint');
                            
                            setTimeout(() => {
                                tile1.classList.remove('hint');
                                tile2.classList.remove('hint');
                            }, 2000);
                            
                            this.hintCount--;
                            return;
                        }
                    }
                }
            }

            shuffle() {
                if (!this.gameStarted || this.gamePaused) return;
                
                // 收集所有未匹配的图标
                const unmatchedIcons = [];
                const config = this.difficulties[this.difficulty];
                
                for (let i = 0; i < config.rows; i++) {
                    for (let j = 0; j < config.cols; j++) {
                        if (!this.board[i][j].matched) {
                            unmatchedIcons.push(this.board[i][j].icon);
                        }
                    }
                }
                
                // 洗牌
                for (let i = unmatchedIcons.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [unmatchedIcons[i], unmatchedIcons[j]] = [unmatchedIcons[j], unmatchedIcons[i]];
                }
                
                // 重新分配
                let iconIndex = 0;
                for (let i = 0; i < config.rows; i++) {
                    for (let j = 0; j < config.cols; j++) {
                        if (!this.board[i][j].matched) {
                            this.board[i][j].icon = unmatchedIcons[iconIndex++];
                        }
                    }
                }
                
                this.clearSelection();
                this.renderBoard();
            }

            startTimer() {
                if (this.timer) {
                    clearInterval(this.timer);
                }
                
                this.timer = setInterval(() => {
                    if (!this.gamePaused) {
                        this.timeLeft--;
                        this.updateDisplay();
                        
                        if (this.timeLeft <= 0) {
                            this.gameOver();
                        }
                    }
                }, 1000);
            }

            gameComplete() {
                this.gameStarted = false;
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                
                // 时间奖励
                const timeBonus = this.timeLeft * 2;
                this.score += timeBonus;
                
                // 显示完成弹窗
                const minutes = Math.floor((this.difficulties[this.difficulty].time - this.timeLeft) / 60);
                const seconds = (this.difficulties[this.difficulty].time - this.timeLeft) % 60;
                const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                document.getElementById('finalScore').textContent = this.score;
                document.getElementById('finalTime').textContent = timeString;
                document.getElementById('finalCombo').textContent = this.maxCombo;
                document.getElementById('finalDifficulty').textContent = this.getDifficultyName();
                document.getElementById('completeOverlay').style.display = 'flex';
                
                this.updateDisplay();
            }

            gameOver() {
                this.gameStarted = false;
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                alert('时间到！游戏结束');
            }

            getDifficultyName() {
                const names = {
                    easy: '简单',
                    medium: '中等', 
                    hard: '困难',
                    expert: '专家'
                };
                return names[this.difficulty];
            }

            updateDisplay() {
                document.getElementById('score').textContent = this.score;
                document.getElementById('combo').textContent = this.combo;
                document.getElementById('pairs').textContent = this.totalPairs - this.matchedPairs;
                
                const minutes = Math.floor(this.timeLeft / 60);
                const seconds = this.timeLeft % 60;
                document.getElementById('time').textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }

            updateProgress() {
                const progress = (this.matchedPairs / this.totalPairs) * 100;
                document.getElementById('progressFill').style.width = progress + '%';
                document.getElementById('progressText').textContent = 
                    `进度: ${this.matchedPairs}/${this.totalPairs} 配对`;
            }

            closeComplete() {
                document.getElementById('completeOverlay').style.display = 'none';
            }
        }

        // 全局游戏实例
        let matchPairs;

        // 初始化游戏
        document.addEventListener('DOMContentLoaded', () => {
            matchPairs = new MatchPairs();
        });