class CardMemory {
    constructor() {
        this.difficulties = {
            easy: { name: '简单 (4×3)', rows: 4, cols: 3, pairs: 6 },
            medium: { name: '中等 (4×4)', rows: 4, cols: 4, pairs: 8 },
            hard: { name: '困难 (6×4)', rows: 6, cols: 4, pairs: 12 },
            expert: { name: '专家 (6×6)', rows: 6, cols: 6, pairs: 18 }
        };
        
        this.currentDifficulty = 'medium';
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.totalPairs = 0;
        this.flips = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.gameStarted = false;
        this.gameCompleted = false;
        this.canFlip = true;
        
        // 连击系统
        this.comboCount = 0;
        this.lastMatchTime = 0;
        this.comboThreshold = 5000; // 5秒内连击
        
        // 设置
        this.settings = {
            cardTheme: 'classic',
            animationSpeed: 600,
            soundEnabled: true,
            autoHint: false
        };
        
        // 自动提示计时器
        this.hintTimer = null;
        this.lastActionTime = 0;
        
        // 成就系统
        this.achievements = {
            firstWin: { unlocked: false, name: '初来乍到', desc: '完成第一局游戏', icon: '🎉' },
            perfectGame: { unlocked: false, name: '完美游戏', desc: '用最少步数完成游戏', icon: '⭐' },
            speedDemon: { unlocked: false, name: '速度恶魔', desc: '在60秒内完成中等难度', icon: '⚡' },
            comboMaster: { unlocked: false, name: '连击大师', desc: '达到5连击', icon: '🔥' },
            persistent: { unlocked: false, name: '坚持不懈', desc: '累计完成100局游戏', icon: '💪' },
            memoryExpert: { unlocked: false, name: '记忆专家', desc: '完成专家难度', icon: '🧠' }
        };
        
        this.suits = ['♠️', '♥️', '♦️', '♣️'];
        this.values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.suitColors = {
            '♠️': 'black', '♣️': 'black',
            '♥️': 'red', '♦️': 'red'
        };
        
        // 自然主题符号
        this.natureSymbols = ['🌸', '🌿', '🌺', '🍀', '🌻', '🌳', '🦋', '🌙', '⭐', '🌈', '🌀', '🔥', '💧'];
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.bindEvents();
        this.newGame();
        this.loadRecords();
        this.renderAchievements();
    }
    
    bindEvents() {
        // 基本游戏控制事件
        const difficultySelect = document.getElementById('difficultySelect');
        if (difficultySelect) {
            difficultySelect.addEventListener('change', (e) => {
                this.currentDifficulty = e.target.value;
                this.newGame();
            });
        }
        
        const newGameBtn = document.getElementById('newGameBtn');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                this.newGame();
            });
        }
        
        const hintBtn = document.getElementById('hintBtn');
        if (hintBtn) {
            hintBtn.addEventListener('click', () => {
                this.showHint();
            });
        }
        
        const pauseBtn = document.getElementById('pauseBtn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.togglePause();
            });
        }
        
        const playAgainBtn = document.getElementById('playAgainBtn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.hideMessage();
                this.newGame();
            });
        }
        
        // 设置按钮事件
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showSettings();
            });
        }
        
        // 设置模态框事件
        const animationSpeed = document.getElementById('animationSpeed');
        if (animationSpeed) {
            animationSpeed.addEventListener('input', (e) => {
                const speedValue = document.getElementById('animationSpeedValue');
                if (speedValue) {
                    speedValue.textContent = e.target.value + 'ms';
                }
            });
        }
        
        // 设置模态框背景点击关闭
        const settingsModal = document.getElementById('settingsModal');
        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target === settingsModal) {
                    this.closeSettings();
                }
            });
        }
        
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'n' || e.key === 'N') {
                this.newGame();
            } else if (e.key === 'h' || e.key === 'H') {
                this.showHint();
            } else if (e.key === 'p' || e.key === 'P') {
                this.togglePause();
            } else if (e.key === 'Escape') {
                this.closeSettings();
            }
        });
    }
    
    newGame() {
        this.resetGame();
        this.generateCards();
        this.shuffleCards();
        this.renderBoard();
        this.updateStats();
    }
    
    resetGame() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.flips = 0;
        this.timer = 0;
        this.gameStarted = false;
        this.gameCompleted = false;
        this.canFlip = true;
        
        // 重置连击
        this.comboCount = 0;
        this.lastMatchTime = 0;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        const difficulty = this.difficulties[this.currentDifficulty];
        this.totalPairs = difficulty.pairs;
        
        this.hideMessage();
    }
    
    generateCards() {
        const difficulty = this.difficulties[this.currentDifficulty];
        const totalCards = difficulty.rows * difficulty.cols;
        const pairs = Math.floor(totalCards / 2);
        
        this.cards = [];
        
        // 根据主题生成不同类型的卡牌
        if (this.settings.cardTheme === 'nature') {
            // 自然主题
            for (let i = 0; i < pairs; i++) {
                const symbol = this.natureSymbols[i % this.natureSymbols.length];
                const card = {
                    id: `nature-${symbol}`,
                    symbol: symbol,
                    value: symbol,
                    isFlipped: false,
                    isMatched: false
                };
                
                this.cards.push({ ...card, uniqueId: `${card.id}-1` });
                this.cards.push({ ...card, uniqueId: `${card.id}-2` });
            }
        } else if (this.settings.cardTheme === 'numbers') {
            // 数字主题
            for (let i = 0; i < pairs; i++) {
                const number = (i % 50) + 1;
                const card = {
                    id: `number-${number}`,
                    value: number.toString(),
                    isFlipped: false,
                    isMatched: false
                };
                
                this.cards.push({ ...card, uniqueId: `${card.id}-1` });
                this.cards.push({ ...card, uniqueId: `${card.id}-2` });
            }
        } else {
            // 经典扑克牌主题
            for (let i = 0; i < pairs; i++) {
                const suitIndex = Math.floor(i / this.values.length) % this.suits.length;
                const valueIndex = i % this.values.length;
                const suit = this.suits[suitIndex];
                const value = this.values[valueIndex];
                
                const card = {
                    id: `${suit}-${value}`,
                    suit: suit,
                    value: value,
                    color: this.suitColors[suit],
                    isFlipped: false,
                    isMatched: false
                };
                
                this.cards.push({ ...card, uniqueId: `${card.id}-1` });
                this.cards.push({ ...card, uniqueId: `${card.id}-2` });
            }
        }
        
        this.totalPairs = pairs;
    }
    
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    renderBoard() {
        const gameBoard = document.getElementById('gameBoard');
        const difficulty = this.difficulties[this.currentDifficulty];
        
        gameBoard.innerHTML = '';
        gameBoard.className = `game-board ${this.currentDifficulty}`;
        
        this.cards.forEach((card, index) => {
            const cardContainer = this.createCardElement(card, index);
            gameBoard.appendChild(cardContainer);
        });
    }
    
    createCardElement(card, index) {
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        cardContainer.dataset.index = index;
        // 设置动画速度，确保转换为秒
        cardContainer.style.transition = `transform ${this.settings.animationSpeed / 1000}s`;
        
        // 卡牌背面
        const cardBack = document.createElement('div');
        cardBack.className = 'card-face back';
        
        // 卡牌正面
        const cardFront = document.createElement('div');
        cardFront.className = `card-face front theme-${this.settings.cardTheme}`;
        
        const cardContent = document.createElement('div');
        cardContent.className = 'card-content';
        
        if (this.settings.cardTheme === 'nature') {
            // 自然主题只显示符号
            const cardSymbol = document.createElement('div');
            cardSymbol.className = 'card-value';
            cardSymbol.style.fontSize = '36px';
            cardSymbol.textContent = card.symbol;
            cardContent.appendChild(cardSymbol);
        } else if (this.settings.cardTheme === 'numbers') {
            // 数字主题只显示数字
            const cardNumber = document.createElement('div');
            cardNumber.className = 'card-value';
            cardNumber.style.fontSize = '36px';
            cardNumber.textContent = card.value;
            cardContent.appendChild(cardNumber);
        } else {
            // 经典扑克牌主题
            const cardValue = document.createElement('div');
            cardValue.className = 'card-value';
            cardValue.textContent = card.value;
            
            const cardSuit = document.createElement('div');
            cardSuit.className = `card-suit ${card.color}`;
            cardSuit.textContent = card.suit;
            
            cardContent.appendChild(cardValue);
            cardContent.appendChild(cardSuit);
        }
        
        cardFront.appendChild(cardContent);
        
        cardContainer.appendChild(cardBack);
        cardContainer.appendChild(cardFront);
        
        // 添加点击事件
        cardContainer.addEventListener('click', () => {
            this.flipCard(index);
        });
        
        return cardContainer;
    }
    
    flipCard(index) {
        if (!this.canFlip || this.gameCompleted) return;
        
        const card = this.cards[index];
        const cardElement = document.querySelector(`[data-index="${index}"]`);
        
        if (card.isFlipped || card.isMatched) return;
        
        // 如果已经翻开了两张卡，不能再翻
        if (this.flippedCards.length >= 2) return;
        
        // 开始游戏计时
        if (!this.gameStarted) {
            this.startGame();
        }
        
        // 翻开卡牌
        card.isFlipped = true;
        cardElement.classList.add('flipped');
        this.flippedCards.push({ card, index, element: cardElement });
        this.flips++;
        
        this.updateStats();
        
        // 检查匹配
        if (this.flippedCards.length === 2) {
            this.canFlip = false;
            setTimeout(() => {
                this.checkMatch();
            }, this.settings.animationSpeed + 200);
        }
    }
    
    checkMatch() {
        const [first, second] = this.flippedCards;
        const currentTime = Date.now();
        
        if (first.card.id === second.card.id) {
            // 匹配成功
            first.card.isMatched = true;
            second.card.isMatched = true;
            first.element.classList.add('matched');
            second.element.classList.add('matched');
            
            this.matchedPairs++;
            
            // 检查连击
            if (currentTime - this.lastMatchTime < this.comboThreshold) {
                this.comboCount++;
                if (this.comboCount >= 3) {
                    this.showCombo();
                }
            } else {
                this.comboCount = 1;
            }
            this.lastMatchTime = currentTime;
            
            // 音效
            if (this.settings.soundEnabled) {
                this.playMatchSound();
            }
            
            // 检查成就
            this.checkAchievements();
            
            // 检查游戏是否完成
            if (this.matchedPairs === this.totalPairs) {
                this.completeGame();
            }
        } else {
            // 匹配失败，翻回去
            first.card.isFlipped = false;
            second.card.isFlipped = false;
            first.element.classList.remove('flipped');
            second.element.classList.remove('flipped');
            
            // 重置连击
            this.comboCount = 0;
            
            // 添加震动效果
            first.element.classList.add('shake');
            second.element.classList.add('shake');
            
            setTimeout(() => {
                first.element.classList.remove('shake');
                second.element.classList.remove('shake');
            }, 500);
        }
        
        this.flippedCards = [];
        this.canFlip = true;
        this.updateStats();
    }
    
    startGame() {
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
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateStats() {
        document.getElementById('flips').textContent = this.flips;
        document.getElementById('matches').textContent = this.matchedPairs;
        document.getElementById('totalPairs').textContent = this.totalPairs;
    }
    
    completeGame() {
        this.gameCompleted = true;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // 计算得分
        const baseScore = this.totalPairs * 100;
        const timeBonus = Math.max(0, 300 - this.timer) * 10;
        const flipPenalty = Math.max(0, this.flips - this.totalPairs * 2) * 5;
        const finalScore = baseScore + timeBonus - flipPenalty;
        
        // 计算评级
        const perfectFlips = this.totalPairs * 2;
        const efficiency = Math.round((perfectFlips / this.flips) * 100);
        
        let rating;
        let message;
        
        if (this.flips === perfectFlips && this.timer <= 60) {
            rating = '⭐⭐⭐';
            message = '完美游戏！';
        } else if (efficiency >= 90) {
            rating = '⭐⭐';
            message = '表现优秀！';
        } else if (efficiency >= 70) {
            rating = '⭐';
            message = '不错的表现！';  
        } else {
            rating = '🎉';
            message = '游戏完成！';
        }
        
        // 显示完成信息
        document.getElementById('messageTitle').textContent = message;
        document.getElementById('finalTime').textContent = document.getElementById('timer').textContent;
        document.getElementById('finalFlips').textContent = this.flips;
        document.getElementById('finalScore').textContent = finalScore;
        document.getElementById('accuracy').textContent = `${efficiency}%`;
        document.getElementById('rating').textContent = rating;
        
        document.getElementById('gameMessage').classList.add('show');
        
        // 庆祝动画
        if (this.flips === perfectFlips) {
            document.querySelector('.game-board').classList.add('perfect-game');
        } else {
            document.querySelector('.game-board').classList.add('celebration');
        }
        
        // 保存记录
        this.saveRecord(finalScore, efficiency);
    }
    
    hideMessage() {
        document.getElementById('gameMessage').classList.remove('show');
        document.querySelector('.game-board').classList.remove('celebration', 'perfect-game');
    }
    
    showHint() {
        if (!this.gameStarted || this.gameCompleted) return;
        
        // 找到所有未匹配的卡牌
        const availableCards = this.cards
            .map((card, index) => ({ card, index }))
            .filter(item => !item.card.isMatched && !item.card.isFlipped);
        
        if (availableCards.length < 2) return;
        
        // 找到一对匹配的卡牌
        for (let i = 0; i < availableCards.length - 1; i++) {
            for (let j = i + 1; j < availableCards.length; j++) {
                if (availableCards[i].card.id === availableCards[j].card.id) {
                    // 高亮这对卡牌
                    const element1 = document.querySelector(`[data-index="${availableCards[i].index}"]`);
                    const element2 = document.querySelector(`[data-index="${availableCards[j].index}"]`);
                    
                    element1.style.boxShadow = '0 0 20px #FFD700';
                    element2.style.boxShadow = '0 0 20px #FFD700';
                    
                    setTimeout(() => {
                        element1.style.boxShadow = '';
                        element2.style.boxShadow = '';
                    }, 2000);
                    
                    return;
                }
            }
        }
    }
    
    togglePause() {
        if (this.gameCompleted) return;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            this.canFlip = false;
            document.getElementById('pauseBtn').textContent = '继续';
            
            // 隐藏卡牌内容
            document.querySelectorAll('.card-face.front').forEach(face => {
                face.style.opacity = '0';
            });
        } else if (this.gameStarted) {
            this.startTimer();
            this.canFlip = true;
            document.getElementById('pauseBtn').textContent = '暂停';
            
            // 显示卡牌内容
            document.querySelectorAll('.card-face.front').forEach(face => {
                face.style.opacity = '1';
            });
        }
    }
    
    saveRecord(score, efficiency) {
        const records = JSON.parse(localStorage.getItem('cardmemory_records') || '{}');
        const difficultyKey = this.currentDifficulty;
        
        if (!records[difficultyKey] || score > records[difficultyKey].score) {
            records[difficultyKey] = {
                score: score,
                time: this.timer,
                timeString: document.getElementById('timer').textContent,
                flips: this.flips,
                efficiency: efficiency
            };
            
            localStorage.setItem('cardmemory_records', JSON.stringify(records));
        }
        
        this.updateRecordDisplay();
    }
    
    loadRecords() {
        this.updateRecordDisplay();
    }
    
    updateRecordDisplay() {
        const records = JSON.parse(localStorage.getItem('cardmemory_records') || '{}');
        const recordsList = document.getElementById('records');
        
        if (!recordsList) return;
        
        recordsList.innerHTML = '';
        
        Object.keys(this.difficulties).forEach(diffKey => {
            const difficulty = this.difficulties[diffKey];
            const record = records[diffKey];
            
            const recordItem = document.createElement('div');
            recordItem.className = 'record-item';
            
            if (record) {
                recordItem.innerHTML = `
                    <span class="difficulty">${difficulty.name}</span>
                    <span class="time">${record.timeString}</span>
                    <span class="score">${record.score}分</span>
                `;
            } else {
                recordItem.innerHTML = `
                    <span class="difficulty">${difficulty.name}</span>
                    <span class="time">--:--</span>
                    <span class="score">0分</span>
                `;
            }
            
            recordsList.appendChild(recordItem);
        });
    }
    
    // 设置相关方法
    showSettings() {
        this.loadSettingsToModal();
        document.getElementById('settingsModal').style.display = 'flex';
    }
    
    closeSettings() {
        this.saveSettings();
        document.getElementById('settingsModal').style.display = 'none';
    }
    
    loadSettingsToModal() {
        document.getElementById('cardTheme').value = this.settings.cardTheme;
        document.getElementById('animationSpeed').value = this.settings.animationSpeed;
        document.getElementById('animationSpeedValue').textContent = this.settings.animationSpeed + 'ms';
        document.getElementById('soundEnabled').checked = this.settings.soundEnabled;
        document.getElementById('autoHint').checked = this.settings.autoHint;
    }
    
    saveSettings() {
        this.settings = {
            cardTheme: document.getElementById('cardTheme').value,
            animationSpeed: parseInt(document.getElementById('animationSpeed').value),
            soundEnabled: document.getElementById('soundEnabled').checked,
            autoHint: document.getElementById('autoHint').checked
        };
        
        localStorage.setItem('cardmemory_settings', JSON.stringify(this.settings));
        
        // 重新生成游戏以应用新设置
        if (this.gameStarted && !this.gameCompleted) {
            this.newGame();
        }
    }
    
    loadSettings() {
        const saved = localStorage.getItem('cardmemory_settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }
    
    resetSettings() {
        this.settings = {
            cardTheme: 'classic',
            animationSpeed: 600,
            soundEnabled: true,
            autoHint: false
        };
        this.loadSettingsToModal();
    }
    
    // 连击显示
    showCombo() {
        // 清除现有的连击指示器
        const existingCombo = document.querySelector('.combo-indicator');
        if (existingCombo) {
            document.body.removeChild(existingCombo);
        }
        
        const comboIndicator = document.createElement('div');
        comboIndicator.className = 'combo-indicator';
        comboIndicator.textContent = `${this.comboCount} 连击！`;
        document.body.appendChild(comboIndicator);
        
        setTimeout(() => {
            if (document.body.contains(comboIndicator)) {
                document.body.removeChild(comboIndicator);
            }
        }, 2000);
    }
    
    // 音效播放（简单的音频反馈）
    playMatchSound() {
        if (this.settings.soundEnabled) {
            try {
                // 创建简单的音频反馈
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            } catch (e) {
                // 音频API不支持时静默忽略
            }
        }
    }
    
    // 成就系统
    checkAchievements() {
        const stats = this.getGameStats();
        
        // 首次胜利
        if (!this.achievements.firstWin.unlocked && stats.totalGames >= 1) {
            this.unlockAchievement('firstWin');
        }
        
        // 连击大师
        if (!this.achievements.comboMaster.unlocked && this.comboCount >= 5) {
            this.unlockAchievement('comboMaster');
        }
        
        // 坚持不懈
        if (!this.achievements.persistent.unlocked && stats.totalGames >= 100) {
            this.unlockAchievement('persistent');
        }
        
        // 记忆专家
        if (!this.achievements.memoryExpert.unlocked && this.currentDifficulty === 'expert' && this.matchedPairs === this.totalPairs) {
            this.unlockAchievement('memoryExpert');
        }
        
        // 完美游戏
        if (!this.achievements.perfectGame.unlocked && this.flips === this.totalPairs * 2) {
            this.unlockAchievement('perfectGame');
        }
        
        // 速度恶魔
        if (!this.achievements.speedDemon.unlocked && this.currentDifficulty === 'medium' && this.timer <= 60 && this.matchedPairs === this.totalPairs) {
            this.unlockAchievement('speedDemon');
        }
    }
    
    unlockAchievement(achievementKey) {
        this.achievements[achievementKey].unlocked = true;
        localStorage.setItem('cardmemory_achievements', JSON.stringify(this.achievements));
        
        // 显示成就解锁提示
        const achievement = this.achievements[achievementKey];
        const popup = document.createElement('div');
        popup.className = 'combo-indicator';
        popup.innerHTML = `${achievement.icon} 成就解锁: ${achievement.name}`;
        popup.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
        document.body.appendChild(popup);
        
        setTimeout(() => {
            if (document.body.contains(popup)) {
                document.body.removeChild(popup);
            }
        }, 3000);
        
        this.renderAchievements();
    }
    
    renderAchievements() {
        const saved = localStorage.getItem('cardmemory_achievements');
        if (saved) {
            this.achievements = { ...this.achievements, ...JSON.parse(saved) };
        }
        
        const grid = document.getElementById('achievementsGrid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        Object.keys(this.achievements).forEach(key => {
            const achievement = this.achievements[key];
            const item = document.createElement('div');
            item.className = `achievement-item ${achievement.unlocked ? 'unlocked' : ''}`;
            
            item.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            `;
            
            grid.appendChild(item);
        });
    }
    
    // 统计相关方法
    getGameStats() {
        const records = JSON.parse(localStorage.getItem('cardmemory_records') || '{}');
        let totalGames = 0;
        let totalTime = 0;
        let bestTime = Infinity;
        
        Object.values(records).forEach(record => {
            totalGames++;
            totalTime += record.time;
            if (record.time < bestTime) {
                bestTime = record.time;
            }
        });
        
        return {
            totalGames,
            averageTime: totalGames > 0 ? Math.round(totalTime / totalGames) : 0,
            bestTime: bestTime === Infinity ? 0 : bestTime
        };
    }
    
    exportStats() {
        const records = JSON.parse(localStorage.getItem('cardmemory_records') || '{}');
        const achievements = JSON.parse(localStorage.getItem('cardmemory_achievements') || '{}');
        const stats = this.getGameStats();
        
        const exportData = {
            records,
            achievements,
            stats,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `card-memory-stats-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
    
    clearRecords() {
        if (confirm('确定要清空所有记录吗？此操作不可恢复。')) {
            localStorage.removeItem('cardmemory_records');
            localStorage.removeItem('cardmemory_achievements');
            this.achievements = {
                firstWin: { unlocked: false, name: '初来乍到', desc: '完成第一局游戏', icon: '🎉' },
                perfectGame: { unlocked: false, name: '完美游戏', desc: '用最少步数完成游戏', icon: '⭐' },
                speedDemon: { unlocked: false, name: '速度恶魔', desc: '在60秒内完成中等难度', icon: '⚡' },
                comboMaster: { unlocked: false, name: '连击大师', desc: '达到5连击', icon: '🔥' },
                persistent: { unlocked: false, name: '坚持不懈', desc: '累计完成100局游戏', icon: '💪' },
                memoryExpert: { unlocked: false, name: '记忆专家', desc: '完成专家难度', icon: '🧠' }
            };
            this.updateRecordDisplay();
            this.renderAchievements();
        }
    }
}

// 将类实例绑定到全局变量，以便HTML中的onclick可以访问
let cardMemory;

document.addEventListener('DOMContentLoaded', () => {
    cardMemory = new CardMemory();
});