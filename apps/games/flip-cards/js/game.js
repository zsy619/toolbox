class FlipCards {
            constructor() {
                this.gameActive = false;
                this.gamePaused = false;
                this.currentTheme = 'animals';
                this.currentDifficulty = 'easy';
                this.board = [];
                this.flippedCards = [];
                this.matchedPairs = 0;
                this.totalPairs = 0;
                this.score = 0;
                this.flips = 0;
                this.matches = 0;
                this.gameTime = 0;
                this.gameStartTime = 0;
                this.timer = null;
                this.hintCount = 3;
                
                this.difficulties = {
                    easy: { rows: 3, cols: 4, time: 180 },
                    medium: { rows: 4, cols: 4, time: 240 },
                    hard: { rows: 4, cols: 6, time: 300 },
                    expert: { rows: 6, cols: 6, time: 360 }
                };
                
                this.themes = {
                    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🦄', '🐝'],
                    fruits: ['🍎', '🍊', '🍌', '🍇', '🍓', '🥝', '🍑', '🍒', '🥭', '🍍', '🥥', '🍈', '🍉', '🍋', '🍐', '🥑', '🍅', '🥕'],
                    colors: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🩶', '🩷', '💛', '💙', '💜', '🖤', '🤍', '🤎', '💚'],
                    numbers: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '💯', '🔢', '📊', '📈', '📉', '⏰', '📅', '🗓️']
                };
                
                this.init();
            }

            init() {
                this.setupEventListeners();
                this.updateDisplay();
            }

            setupEventListeners() {
                document.querySelectorAll('.theme-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        if (this.gameActive && !this.gamePaused) return;
                        
                        document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        this.currentTheme = e.target.dataset.theme;
                    });
                });

                document.querySelectorAll('.difficulty-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        if (this.gameActive && !this.gamePaused) return;
                        
                        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        this.currentDifficulty = e.target.dataset.difficulty;
                    });
                });

                document.addEventListener('keydown', (e) => {
                    if (e.key === ' ') {
                        e.preventDefault();
                        if (this.gameActive) {
                            this.pauseGame();
                        } else {
                            this.newGame();
                        }
                    }
                });
            }

            newGame() {
                this.gameActive = true;
                this.gamePaused = false;
                this.board = [];
                this.flippedCards = [];
                this.matchedPairs = 0;
                this.score = 0;
                this.flips = 0;
                this.matches = 0;
                this.gameTime = 0;
                this.gameStartTime = Date.now();
                this.hintCount = 3;
                
                const config = this.difficulties[this.currentDifficulty];
                this.totalPairs = (config.rows * config.cols) / 2;
                
                this.createBoard();
                this.startTimer();
                this.updateDisplay();
                this.updateProgress();
                
                document.getElementById('pauseBtn').textContent = '⏸️ 暂停';
                document.getElementById('completeOverlay').style.display = 'none';
            }

            createBoard() {
                const config = this.difficulties[this.currentDifficulty];
                const totalCards = config.rows * config.cols;
                const pairsNeeded = totalCards / 2;
                
                // 选择主题图标
                const themeIcons = this.themes[this.currentTheme];
                const gameIcons = themeIcons.slice(0, pairsNeeded);
                
                // 创建配对卡片
                const cards = [...gameIcons, ...gameIcons];
                
                // 洗牌
                for (let i = cards.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [cards[i], cards[j]] = [cards[j], cards[i]];
                }
                
                // 创建二维数组
                this.board = [];
                for (let i = 0; i < config.rows; i++) {
                    this.board[i] = [];
                    for (let j = 0; j < config.cols; j++) {
                        this.board[i][j] = {
                            icon: cards[i * config.cols + j],
                            flipped: false,
                            matched: false,
                            id: i * config.cols + j
                        };
                    }
                }
                
                this.renderBoard();
            }

            renderBoard() {
                const config = this.difficulties[this.currentDifficulty];
                const gameBoard = document.getElementById('gameBoard');
                gameBoard.innerHTML = '';
                gameBoard.style.gridTemplateColumns = `repeat(${config.cols}, 1fr)`;
                gameBoard.style.gridTemplateRows = `repeat(${config.rows}, 1fr)`;
                
                for (let i = 0; i < config.rows; i++) {
                    for (let j = 0; j < config.cols; j++) {
                        const card = document.createElement('div');
                        card.className = 'card';
                        card.dataset.row = i;
                        card.dataset.col = j;
                        
                        const cardFront = document.createElement('div');
                        cardFront.className = 'card-face card-front';
                        cardFront.textContent = this.board[i][j].icon;
                        
                        const cardBack = document.createElement('div');
                        cardBack.className = 'card-face card-back';
                        
                        card.appendChild(cardFront);
                        card.appendChild(cardBack);
                        
                        card.addEventListener('click', () => this.handleCardClick(i, j));
                        
                        gameBoard.appendChild(card);
                    }
                }
            }

            handleCardClick(row, col) {
                if (!this.gameActive || this.gamePaused) return;
                
                const cardData = this.board[row][col];
                if (cardData.flipped || cardData.matched) return;
                
                // 如果已经翻开两张卡片，先等待处理
                if (this.flippedCards.length >= 2) return;
                
                // 翻开卡片
                cardData.flipped = true;
                this.flippedCards.push({row, col});
                this.flips++;
                this.updateCardDisplay(row, col);
                
                // 如果翻开了两张卡片，检查是否匹配
                if (this.flippedCards.length === 2) {
                    setTimeout(() => this.checkMatch(), 800);
                }
                
                this.updateDisplay();
            }

            checkMatch() {
                const [card1, card2] = this.flippedCards;
                const icon1 = this.board[card1.row][card1.col].icon;
                const icon2 = this.board[card2.row][card2.col].icon;
                
                if (icon1 === icon2) {
                    // 匹配成功
                    this.board[card1.row][card1.col].matched = true;
                    this.board[card2.row][card2.col].matched = true;
                    this.matchedPairs++;
                    this.matches++;
                    
                    // 计算分数
                    const baseScore = 100;
                    const flipBonus = Math.max(0, 50 - this.flips); // 翻牌次数越少奖励越高
                    this.score += baseScore + flipBonus;
                    
                    // 更新显示
                    this.updateCardDisplay(card1.row, card1.col, 'matched');
                    this.updateCardDisplay(card2.row, card2.col, 'matched');
                    
                    // 检查游戏是否完成
                    if (this.matchedPairs === this.totalPairs) {
                        this.gameComplete();
                    }
                } else {
                    // 匹配失败
                    this.updateCardDisplay(card1.row, card1.col, 'wrong');
                    this.updateCardDisplay(card2.row, card2.col, 'wrong');
                    
                    setTimeout(() => {
                        this.board[card1.row][card1.col].flipped = false;
                        this.board[card2.row][card2.col].flipped = false;
                        this.updateCardDisplay(card1.row, card1.col);
                        this.updateCardDisplay(card2.row, card2.col);
                    }, 1000);
                }
                
                this.flippedCards = [];
                this.updateProgress();
            }

            updateCardDisplay(row, col, status = null) {
                const cardElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                const cardData = this.board[row][col];
                
                // 清除状态类
                cardElement.classList.remove('flipped', 'matched', 'wrong');
                
                if (status === 'matched') {
                    cardElement.classList.add('matched');
                } else if (status === 'wrong') {
                    cardElement.classList.add('wrong');
                } else if (cardData.flipped || cardData.matched) {
                    cardElement.classList.add('flipped');
                }
            }

            pauseGame() {
                if (!this.gameActive) return;
                
                if (this.gamePaused) {
                    // 继续游戏
                    this.gamePaused = false;
                    this.gameStartTime = Date.now() - this.gameTime;
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
                if (!this.gameActive || this.gamePaused || this.hintCount <= 0) return;
                
                // 寻找可匹配的一对未翻开的卡片
                const config = this.difficulties[this.currentDifficulty];
                const availableCards = [];
                
                for (let i = 0; i < config.rows; i++) {
                    for (let j = 0; j < config.cols; j++) {
                        if (!this.board[i][j].flipped && !this.board[i][j].matched) {
                            availableCards.push({row: i, col: j, icon: this.board[i][j].icon});
                        }
                    }
                }
                
                // 找到第一对匹配的卡片
                for (let i = 0; i < availableCards.length; i++) {
                    for (let j = i + 1; j < availableCards.length; j++) {
                        if (availableCards[i].icon === availableCards[j].icon) {
                            // 显示提示
                            const card1 = document.querySelector(`[data-row="${availableCards[i].row}"][data-col="${availableCards[i].col}"]`);
                            const card2 = document.querySelector(`[data-row="${availableCards[j].row}"][data-col="${availableCards[j].col}"]`);
                            
                            card1.style.boxShadow = '0 0 20px rgba(255, 193, 7, 0.8)';
                            card2.style.boxShadow = '0 0 20px rgba(255, 193, 7, 0.8)';
                            
                            setTimeout(() => {
                                card1.style.boxShadow = '';
                                card2.style.boxShadow = '';
                            }, 2000);
                            
                            this.hintCount--;
                            this.score -= 20; // 使用提示扣分
                            this.updateDisplay();
                            return;
                        }
                    }
                }
            }

            resetGame() {
                this.gameActive = false;
                this.gamePaused = false;
                
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                
                this.score = 0;
                this.flips = 0;
                this.matches = 0;
                this.gameTime = 0;
                this.matchedPairs = 0;
                this.flippedCards = [];
                this.hintCount = 3;
                
                document.getElementById('pauseBtn').textContent = '⏸️ 暂停';
                document.getElementById('gameBoard').innerHTML = '';
                this.updateDisplay();
                this.updateProgress();
            }

            startTimer() {
                if (this.timer) {
                    clearInterval(this.timer);
                }
                
                this.timer = setInterval(() => {
                    if (!this.gamePaused) {
                        this.gameTime = Date.now() - this.gameStartTime;
                        this.updateDisplay();
                    }
                }, 100);
            }

            gameComplete() {
                this.gameActive = false;
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                
                // 时间奖励
                const config = this.difficulties[this.currentDifficulty];
                const maxTime = config.time * 1000;
                const timeBonus = Math.max(0, Math.floor((maxTime - this.gameTime) / 1000) * 5);
                this.score += timeBonus;
                
                // 显示完成弹窗
                const minutes = Math.floor(this.gameTime / 60000);
                const seconds = Math.floor((this.gameTime % 60000) / 1000);
                const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                document.getElementById('finalScore').textContent = this.score;
                document.getElementById('finalTime').textContent = timeString;
                document.getElementById('finalFlips').textContent = this.flips;
                document.getElementById('finalDifficulty').textContent = this.getDifficultyName();
                document.getElementById('completeOverlay').style.display = 'flex';
                
                this.updateDisplay();
            }

            getDifficultyName() {
                const names = {
                    easy: '简单',
                    medium: '中等',
                    hard: '困难',
                    expert: '专家'
                };
                return names[this.currentDifficulty];
            }

            updateDisplay() {
                document.getElementById('score').textContent = this.score;
                document.getElementById('flips').textContent = this.flips;
                document.getElementById('matches').textContent = this.matches;
                
                const minutes = Math.floor(this.gameTime / 60000);
                const seconds = Math.floor((this.gameTime % 60000) / 1000);
                document.getElementById('time').textContent = 
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }

            updateProgress() {
                const progress = this.totalPairs > 0 ? (this.matchedPairs / this.totalPairs) * 100 : 0;
                document.getElementById('progressFill').style.width = progress + '%';
                document.getElementById('progressText').textContent = 
                    `进度: ${this.matchedPairs}/${this.totalPairs} 配对完成`;
            }

            closeComplete() {
                document.getElementById('completeOverlay').style.display = 'none';
            }
        }

        // 全局游戏实例
        let flipCards;

        // 初始化游戏
        document.addEventListener('DOMContentLoaded', () => {
            flipCards = new FlipCards();
        });