class GuessNumberGame {
    constructor() {
        this.modes = {
            classic: {
                name: '经典模式',
                min: 1,
                max: 100,
                maxAttempts: 10,
                timeLimit: null,
                description: '1-100，10次机会'
            },
            hard: {
                name: '困难模式',
                min: 1,
                max: 1000,
                maxAttempts: 15,
                timeLimit: null,
                description: '1-1000，15次机会'
            },
            mastermind: {
                name: '数字大师',
                min: 1000,
                max: 9999,
                maxAttempts: 8,
                timeLimit: null,
                description: '4位数字，8次机会'
            },
            quick: {
                name: '极速模式',
                min: 1,
                max: 50,
                maxAttempts: 999,
                timeLimit: 30,
                description: '1-50，30秒限时'
            }
        };
        
        this.currentMode = 'classic';
        this.targetNumber = 0;
        this.guessCount = 0;
        this.gameHistory = [];
        this.gameActive = false;
        this.timeLeft = 0;
        this.timerInterval = null;
        this.startTime = 0;
        
        // 统计数据
        this.stats = this.loadStats();
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateDisplay();
        this.newGame();
    }
    
    bindEvents() {
        // 模式选择按钮
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.getAttribute('onclick').match(/'(.+?)'/)[1];
                this.setMode(mode);
            });
        });
        
        // 游戏控制按钮
        document.getElementById('submitBtn').addEventListener('click', () => {
            this.makeGuess();
        });
        
        // 输入框回车提交
        document.getElementById('guessInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.makeGuess();
            }
        });
        
        document.getElementById('mastermindGuess').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.makeMastermindGuess();
            }
        });
        
        // 只允许数字输入
        document.getElementById('guessInput').addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
        
        document.getElementById('mastermindGuess').addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.key === 'n' || e.key === 'N') {
                this.newGame();
            } else if (e.key === 'h' || e.key === 'H') {
                this.giveHint();
            }
        });
    }
    
    setMode(mode) {
        if (!this.modes[mode]) return;
        
        this.currentMode = mode;
        
        // 更新按钮状态
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick*="${mode}"]`).classList.add('active');
        
        // 显示/隐藏相应输入框
        if (mode === 'mastermind') {
            document.querySelector('.guess-input-container').style.display = 'none';
            document.getElementById('mastermindInput').style.display = 'block';
        } else {
            document.querySelector('.guess-input-container').style.display = 'flex';
            document.getElementById('mastermindInput').style.display = 'none';
        }
        
        // 显示/隐藏计时器
        if (mode === 'quick') {
            document.getElementById('timerDisplay').style.display = 'block';
        } else {
            document.getElementById('timerDisplay').style.display = 'none';
        }
        
        this.updateDisplay();
        this.newGame();
    }
    
    newGame() {
        const mode = this.modes[this.currentMode];
        
        // 生成目标数字
        if (this.currentMode === 'mastermind') {
            this.targetNumber = Math.floor(Math.random() * 9000) + 1000;
        } else {
            this.targetNumber = Math.floor(Math.random() * (mode.max - mode.min + 1)) + mode.min;
        }
        
        // 重置游戏状态
        this.guessCount = 0;
        this.gameHistory = [];
        this.gameActive = true;
        this.startTime = Date.now();
        
        // 重置计时器
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        if (mode.timeLimit) {
            this.timeLeft = mode.timeLimit;
            this.startTimer();
        }
        
        // 清空输入框和历史记录
        document.getElementById('guessInput').value = '';
        document.getElementById('mastermindGuess').value = '';
        this.updateHistoryDisplay();
        this.updateHintDisplay('🎲 开始新游戏来获取提示！');
        this.updateDisplay();
        
        // 关闭弹窗
        this.closeVictory();
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            document.getElementById('timeLeft').textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.endGame(false, '时间到！');
            }
        }, 1000);
    }
    
    makeGuess() {
        if (!this.gameActive) return;
        
        const input = document.getElementById('guessInput');
        const guess = parseInt(input.value);
        const mode = this.modes[this.currentMode];
        
        if (!guess || guess < mode.min || guess > mode.max) {
            this.updateHintDisplay(`❌ 请输入${mode.min}-${mode.max}之间的数字！`);
            return;
        }
        
        this.processGuess(guess);
        input.value = '';
    }
    
    makeMastermindGuess() {
        if (!this.gameActive) return;
        
        const input = document.getElementById('mastermindGuess');
        const guess = input.value;
        
        if (guess.length !== 4) {
            this.updateHintDisplay('❌ 请输入4位数字！');
            return;
        }
        
        const guessNum = parseInt(guess);
        this.processMastermindGuess(guessNum);
        input.value = '';
    }
    
    processGuess(guess) {
        this.guessCount++;
        const mode = this.modes[this.currentMode];
        
        let result;
        let resultClass;
        
        if (guess === this.targetNumber) {
            result = '🎉 恭喜答对了！';
            resultClass = 'correct';
            this.endGame(true);
        } else if (guess > this.targetNumber) {
            result = '📉 太大了！';
            resultClass = 'too-high';
        } else {
            result = '📈 太小了！';
            resultClass = 'too-low';
        }
        
        // 记录历史
        this.gameHistory.push({
            guess: guess,
            result: result,
            resultClass: resultClass
        });
        
        this.updateHintDisplay(result);
        this.updateHistoryDisplay();
        this.updateDisplay();
        
        // 检查是否用完机会
        if (this.guessCount >= mode.maxAttempts && guess !== this.targetNumber) {
            this.endGame(false, '机会用完了！');
        }
    }
    
    processMastermindGuess(guess) {
        this.guessCount++;
        
        const targetStr = this.targetNumber.toString();
        const guessStr = guess.toString().padStart(4, '0');
        
        let exactMatches = 0; // A - 数字和位置都正确
        let partialMatches = 0; // B - 数字正确但位置错误
        
        const targetDigits = targetStr.split('');
        const guessDigits = guessStr.split('');
        const targetUsed = new Array(4).fill(false);
        const guessUsed = new Array(4).fill(false);
        
        // 计算完全匹配
        for (let i = 0; i < 4; i++) {
            if (targetDigits[i] === guessDigits[i]) {
                exactMatches++;
                targetUsed[i] = true;
                guessUsed[i] = true;
            }
        }
        
        // 计算部分匹配
        for (let i = 0; i < 4; i++) {
            if (!guessUsed[i]) {
                for (let j = 0; j < 4; j++) {
                    if (!targetUsed[j] && guessDigits[i] === targetDigits[j]) {
                        partialMatches++;
                        targetUsed[j] = true;
                        break;
                    }
                }
            }
        }
        
        let result;
        let resultClass;
        
        if (exactMatches === 4) {
            result = '🎉 恭喜答对了！';
            resultClass = 'correct';
            this.endGame(true);
        } else {
            result = `${exactMatches}A${partialMatches}B`;
            resultClass = 'partial';
        }
        
        // 记录历史
        this.gameHistory.push({
            guess: guessStr,
            result: result,
            resultClass: resultClass
        });
        
        this.updateHintDisplay(`🧠 ${result} (A=位置和数字都对，B=数字对位置错)`);
        this.updateHistoryDisplay();
        this.updateDisplay();
        
        // 检查是否用完机会
        if (this.guessCount >= this.modes.mastermind.maxAttempts && exactMatches !== 4) {
            this.endGame(false, '机会用完了！');
        }
    }
    
    giveHint() {
        if (!this.gameActive) return;
        
        const mode = this.modes[this.currentMode];
        let hint;
        
        if (this.currentMode === 'mastermind') {
            const targetStr = this.targetNumber.toString();
            const digits = targetStr.split('');
            const uniqueDigits = [...new Set(digits)].length;
            hint = `💡 提示：这个4位数有${uniqueDigits}个不同的数字`;
        } else {
            const range = mode.max - mode.min + 1;
            const quarter = Math.floor(range / 4);
            
            if (this.targetNumber <= mode.min + quarter) {
                hint = `💡 提示：答案在较小的范围内 (${mode.min}-${mode.min + quarter})`;
            } else if (this.targetNumber <= mode.min + quarter * 2) {
                hint = `💡 提示：答案在中下范围内 (${mode.min + quarter + 1}-${mode.min + quarter * 2})`;
            } else if (this.targetNumber <= mode.min + quarter * 3) {
                hint = `💡 提示：答案在中上范围内 (${mode.min + quarter * 2 + 1}-${mode.min + quarter * 3})`;
            } else {
                hint = `💡 提示：答案在较大的范围内 (${mode.min + quarter * 3 + 1}-${mode.max})`;
            }
        }
        
        this.updateHintDisplay(hint);
    }
    
    surrender() {
        if (!this.gameActive) return;
        
        if (confirm('确定要认输吗？')) {
            this.endGame(false, '已认输');
        }
    }
    
    endGame(won, message = '') {
        this.gameActive = false;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        const gameTime = Math.floor((Date.now() - this.startTime) / 1000);
        
        // 更新统计
        this.updateStats(won, gameTime);
        
        // 显示结果
        if (won) {
            this.showVictory(gameTime);
        } else {
            this.updateHintDisplay(`${message} 答案是：${this.targetNumber}`);
        }
    }
    
    showVictory(gameTime) {
        const minutes = Math.floor(gameTime / 60);
        const seconds = gameTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('finalAnswer').textContent = this.targetNumber;
        document.getElementById('finalGuesses').textContent = this.guessCount;
        document.getElementById('finalTime').textContent = timeString;
        
        // 检查是否是新纪录
        const modeStats = this.stats[this.currentMode];
        const isNewRecord = !modeStats.bestGuesses || this.guessCount < modeStats.bestGuesses;
        
        if (isNewRecord) {
            document.getElementById('newRecord').style.display = 'block';
            document.getElementById('victoryTitle').textContent = '🏆 新纪录！';
        } else {
            document.getElementById('newRecord').style.display = 'none';
            document.getElementById('victoryTitle').textContent = '🎉 恭喜答对了！';
        }
        
        document.getElementById('victoryPopup').classList.add('show');
    }
    
    closeVictory() {
        document.getElementById('victoryPopup').classList.remove('show');
    }
    
    updateStats(won, gameTime) {
        if (!this.stats[this.currentMode]) {
            this.stats[this.currentMode] = {
                totalGames: 0,
                wins: 0,
                bestGuesses: null,
                bestTime: null,
                totalTime: 0,
                totalGuesses: 0
            };
        }
        
        const modeStats = this.stats[this.currentMode];
        modeStats.totalGames++;
        modeStats.totalTime += gameTime;
        modeStats.totalGuesses += this.guessCount;
        
        if (won) {
            modeStats.wins++;
            
            if (!modeStats.bestGuesses || this.guessCount < modeStats.bestGuesses) {
                modeStats.bestGuesses = this.guessCount;
            }
            
            if (!modeStats.bestTime || gameTime < modeStats.bestTime) {
                modeStats.bestTime = gameTime;
            }
        }
        
        this.saveStats();
        this.updateDisplay();
    }
    
    showStats() {
        const statsGrid = document.getElementById('statsGrid');
        statsGrid.innerHTML = '';
        
        Object.keys(this.modes).forEach(modeKey => {
            const mode = this.modes[modeKey];
            const stats = this.stats[modeKey];
            
            if (!stats || stats.totalGames === 0) {
                statsGrid.innerHTML += `
                    <div>
                        <strong>${mode.name}</strong>
                        <span>暂无数据</span>
                    </div>
                `;
                return;
            }
            
            const winRate = Math.round((stats.wins / stats.totalGames) * 100);
            const avgGuesses = Math.round(stats.totalGuesses / stats.totalGames);
            const avgTime = Math.round(stats.totalTime / stats.totalGames);
            
            statsGrid.innerHTML += `
                <div>
                    <strong>${mode.name}</strong>
                    <span></span>
                </div>
                <div>
                    <span>总游戏数:</span>
                    <span>${stats.totalGames}</span>
                </div>
                <div>
                    <span>胜率:</span>
                    <span>${winRate}%</span>
                </div>
                <div>
                    <span>最佳次数:</span>
                    <span>${stats.bestGuesses || '--'}</span>
                </div>
                <div>
                    <span>平均次数:</span>
                    <span>${avgGuesses}</span>
                </div>
                <div>
                    <span>最佳时间:</span>
                    <span>${stats.bestTime ? Math.floor(stats.bestTime / 60) + ':' + (stats.bestTime % 60).toString().padStart(2, '0') : '--'}</span>
                </div>
            `;
        });
        
        document.getElementById('statsModal').classList.add('show');
    }
    
    closeStats() {
        document.getElementById('statsModal').classList.remove('show');
    }
    
    resetStats() {
        if (confirm('确定要清空所有统计数据吗？此操作不可恢复。')) {
            this.stats = {};
            this.saveStats();
            this.updateDisplay();
            this.closeStats();
        }
    }
    
    updateDisplay() {
        const mode = this.modes[this.currentMode];
        
        // 更新模式信息
        document.getElementById('gameMode').textContent = mode.name;
        document.getElementById('guessCount').textContent = this.guessCount;
        document.getElementById('attemptsLeft').textContent = Math.max(0, mode.maxAttempts - this.guessCount);
        
        // 更新最佳记录
        const modeStats = this.stats[this.currentMode];
        if (modeStats && modeStats.bestGuesses) {
            document.getElementById('bestScore').textContent = modeStats.bestGuesses + '次';
        } else {
            document.getElementById('bestScore').textContent = '--';
        }
        
        // 更新范围显示
        if (this.currentMode === 'mastermind') {
            document.getElementById('rangeDisplay').textContent = '请猜一个4位数字';
        } else {
            document.getElementById('rangeDisplay').textContent = `请猜一个${mode.min}-${mode.max}之间的数字`;
        }
        
        // 更新输入框范围
        const guessInput = document.getElementById('guessInput');
        guessInput.min = mode.min;
        guessInput.max = mode.max;
        guessInput.placeholder = `${mode.min}-${mode.max}`;
        
        // 更新计时器
        if (mode.timeLimit) {
            document.getElementById('timeLeft').textContent = this.timeLeft;
        }
    }
    
    updateHintDisplay(message) {
        document.querySelector('.hint-message').textContent = message;
    }
    
    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        
        if (this.gameHistory.length === 0) {
            historyList.innerHTML = '<div class="empty-history">还没有猜测记录</div>';
            return;
        }
        
        historyList.innerHTML = '';
        
        this.gameHistory.forEach((record, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            historyItem.innerHTML = `
                <div class="guess-info">第${index + 1}次: ${record.guess}</div>
                <div class="guess-result ${record.resultClass}">${record.result}</div>
            `;
            
            historyList.appendChild(historyItem);
        });
        
        // 滚动到底部
        historyList.scrollTop = historyList.scrollHeight;
    }
    
    loadStats() {
        try {
            return JSON.parse(localStorage.getItem('guessNumberStats')) || {};
        } catch (e) {
            return {};
        }
    }
    
    saveStats() {
        localStorage.setItem('guessNumberStats', JSON.stringify(this.stats));
    }
}

// 全局变量供HTML onclick调用
let guessGame;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    guessGame = new GuessNumberGame();
});