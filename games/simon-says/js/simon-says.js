class SimonGame {
    constructor() {
        this.colors = ['red', 'green', 'blue', 'yellow'];
        this.sequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.gameActive = false;
        this.showingSequence = false;
        this.playerTurn = false;
        this.streak = 0;
        this.startTime = null;
        this.soundEnabled = true;
        
        // 难度设置
        this.difficulties = {
            easy: { speed: 1500, name: '简单' },
            medium: { speed: 1000, name: '中等' },
            hard: { speed: 600, name: '困难' },
            expert: { speed: 400, name: '专家' }
        };
        this.currentDifficulty = 'easy';
        
        // 统计数据
        this.stats = this.loadStats();
        
        // 音效频率
        this.soundFrequencies = {
            red: 262,
            green: 330,
            blue: 392,
            yellow: 523
        };
        
        // 响应超时
        this.responseTimer = null;
        this.responseTimeout = 10000; // 10秒响应时间
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateDisplay();
        this.updateStats();
    }
    
    bindEvents() {
        // 颜色按钮点击事件
        document.querySelectorAll('.color-button').forEach(button => {
            button.addEventListener('click', (e) => {
                if (this.playerTurn) {
                    const color = e.currentTarget.dataset.color;
                    this.handlePlayerInput(color);
                }
            });
            
            // 添加触摸支持
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.playerTurn) {
                    const color = e.currentTarget.dataset.color;
                    this.handlePlayerInput(color);
                }
            });
        });
        
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (this.playerTurn) {
                let color = null;
                switch(e.key) {
                    case '1': color = 'red'; break;
                    case '2': color = 'green'; break;
                    case '3': color = 'blue'; break;
                    case '4': color = 'yellow'; break;
                }
                if (color) {
                    this.handlePlayerInput(color);
                }
            }
            
            // 快捷键
            if (e.key === ' ') { // 空格键开始游戏
                e.preventDefault();
                if (!this.gameActive) {
                    this.startGame();
                }
            } else if (e.key === 'r' || e.key === 'R') { // R键重新开始
                this.restartGame();
            } else if (e.key === 's' || e.key === 'S') { // S键切换音效
                this.toggleSound();
            }
        });
    }
    
    setDifficulty(difficulty) {
        if (!this.difficulties[difficulty]) return;
        
        this.currentDifficulty = difficulty;
        
        // 更新按钮状态
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick*="${difficulty}"]`).classList.add('active');
        
        // 如果游戏正在进行，重新开始
        if (this.gameActive) {
            this.restartGame();
        }
    }
    
    startGame() {
        this.gameActive = true;
        this.level = 1;
        this.sequence = [];
        this.playerSequence = [];
        this.streak = 0;
        this.startTime = Date.now();
        
        // 更新UI
        document.getElementById('startButton').textContent = '游戏中...';
        document.getElementById('startBtn').textContent = '🎮 游戏中...';
        document.getElementById('startBtn').disabled = true;
        
        // 开始第一关
        this.nextLevel();
    }
    
    restartGame() {
        this.gameActive = false;
        this.showingSequence = false;
        this.playerTurn = false;
        this.level = 1;
        this.sequence = [];
        this.playerSequence = [];
        this.streak = 0;
        
        // 清除定时器
        if (this.responseTimer) {
            clearTimeout(this.responseTimer);
            this.responseTimer = null;
        }
        
        // 重置UI
        document.getElementById('startButton').textContent = '开始';
        document.getElementById('startBtn').textContent = '🎯 开始游戏';
        document.getElementById('startBtn').disabled = false;
        document.getElementById('statusMessage').textContent = '点击开始游戏';
        document.getElementById('timeRemaining').style.display = 'none';
        
        this.updateDisplay();
    }
    
    nextLevel() {
        this.level++;
        this.playerSequence = [];
        
        // 添加新的随机颜色到序列
        const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.sequence.push(randomColor);
        
        this.updateDisplay();
        
        // 显示序列
        setTimeout(() => {
            this.showSequence();
        }, 1000);
    }
    
    async showSequence() {
        this.showingSequence = true;
        this.playerTurn = false;
        
        document.getElementById('statusMessage').textContent = '请仔细观察序列...';
        
        const speed = this.difficulties[this.currentDifficulty].speed;
        
        for (let i = 0; i < this.sequence.length; i++) {
            const color = this.sequence[i];
            
            // 更新进度
            document.getElementById('sequenceProgress').textContent = `${i + 1}/${this.sequence.length}`;
            
            await this.sleep(speed * 0.3); // 间隔时间
            
            await this.flashColor(color);
            
            await this.sleep(speed * 0.2); // 闪烁后的短暂停顿
        }
        
        // 序列显示完毕，开始玩家回合
        this.showingSequence = false;
        this.playerTurn = true;
        this.startPlayerTurn();
    }
    
    async flashColor(color) {
        const button = document.querySelector(`.color-button.${color}`);
        const flashDuration = Math.max(300, this.difficulties[this.currentDifficulty].speed * 0.4);
        
        // 添加闪烁效果
        button.classList.add('active', 'flash');
        
        // 播放音效
        if (this.soundEnabled) {
            this.playSound(color);
        }
        
        await this.sleep(flashDuration);
        
        // 移除效果
        button.classList.remove('active', 'flash');
    }
    
    startPlayerTurn() {
        document.getElementById('statusMessage').textContent = '轮到你了！重复刚才的序列';
        document.getElementById('sequenceProgress').textContent = `0/${this.sequence.length}`;
        
        // 开始响应计时
        this.startResponseTimer();
    }
    
    startResponseTimer() {
        document.getElementById('timeRemaining').style.display = 'block';
        let timeLeft = this.responseTimeout / 1000;
        document.getElementById('timeLeft').textContent = timeLeft;
        
        const countdown = setInterval(() => {
            timeLeft--;
            document.getElementById('timeLeft').textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(countdown);
            }
        }, 1000);
        
        this.responseTimer = setTimeout(() => {
            clearInterval(countdown);
            this.gameOver('时间到！');
        }, this.responseTimeout);
    }
    
    handlePlayerInput(color) {
        if (!this.playerTurn || this.showingSequence) return;
        
        // 播放音效和视觉反馈
        this.flashColor(color);
        
        // 添加到玩家序列
        this.playerSequence.push(color);
        
        // 更新进度
        document.getElementById('sequenceProgress').textContent = `${this.playerSequence.length}/${this.sequence.length}`;
        
        // 检查当前输入是否正确
        const currentIndex = this.playerSequence.length - 1;
        if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
            // 输入错误，游戏结束
            this.gameOver('输入错误！');
            return;
        }
        
        // 检查是否完成了整个序列
        if (this.playerSequence.length === this.sequence.length) {
            // 完成这一关
            this.completeLevel();
        }
    }
    
    completeLevel() {
        this.playerTurn = false;
        this.streak++;
        
        // 清除响应计时器
        if (this.responseTimer) {
            clearTimeout(this.responseTimer);
            this.responseTimer = null;
        }
        document.getElementById('timeRemaining').style.display = 'none';
        
        // 显示成功消息
        document.getElementById('statusMessage').textContent = `太棒了！第${this.level - 1}关完成！`;
        
        this.updateDisplay();
        
        // 检查是否达到了某些里程碑
        if (this.level % 5 === 1) {
            document.getElementById('statusMessage').textContent = `🎉 恭喜！达到第${this.level - 1}关！`;
        }
        
        // 准备下一关
        setTimeout(() => {
            if (this.level >= 20) {
                // 达到最高关卡
                this.gameWin();
            } else {
                this.nextLevel();
            }
        }, 2000);
    }
    
    gameOver(reason = '') {
        this.gameActive = false;
        this.playerTurn = false;
        this.showingSequence = false;
        
        // 清除定时器
        if (this.responseTimer) {
            clearTimeout(this.responseTimer);
            this.responseTimer = null;
        }
        
        const gameTime = Math.floor((Date.now() - this.startTime) / 1000);
        const finalLevel = this.level - 1;
        const score = this.calculateScore(finalLevel, gameTime);
        
        // 更新统计
        this.updateGameStats(finalLevel, score, gameTime, false);
        
        // 显示游戏结束弹窗
        this.showGameOverPopup(reason, finalLevel, score, gameTime);
        
        // 重置UI
        this.restartGame();
    }
    
    gameWin() {
        this.gameActive = false;
        const gameTime = Math.floor((Date.now() - this.startTime) / 1000);
        const finalLevel = 20;
        const score = this.calculateScore(finalLevel, gameTime) + 1000; // 完成奖励
        
        // 更新统计
        this.updateGameStats(finalLevel, score, gameTime, true);
        
        // 显示胜利弹窗
        this.showGameOverPopup('🎉 恭喜完成所有关卡！', finalLevel, score, gameTime, true);
        
        // 重置游戏
        this.restartGame();
    }
    
    calculateScore(level, time) {
        // 基础分数：每关100分
        let score = level * 100;
        
        // 难度奖励
        const difficultyMultiplier = {
            easy: 1,
            medium: 1.5,
            hard: 2,
            expert: 3
        };
        score *= difficultyMultiplier[this.currentDifficulty];
        
        // 时间奖励：时间越短分数越高
        const timeBonus = Math.max(0, 1000 - time);
        score += timeBonus;
        
        // 连击奖励
        score += this.streak * 50;
        
        return Math.floor(score);
    }
    
    showGameOverPopup(reason, level, score, time, isWin = false) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // 检查是否是新纪录
        const isNewRecord = !this.stats.bestScore || score > this.stats.bestScore;
        
        document.getElementById('victoryTitle').textContent = isWin ? '🏆 游戏完成！' : '🎮 游戏结束';
        document.getElementById('victoryMessage').textContent = reason;
        document.getElementById('finalLevel').textContent = level;
        document.getElementById('finalScore').textContent = score;
        document.getElementById('finalTime').textContent = timeString;
        
        // 显示新纪录
        if (isNewRecord) {
            document.getElementById('newRecordText').style.display = 'block';
        } else {
            document.getElementById('newRecordText').style.display = 'none';
        }
        
        document.getElementById('victoryPopup').classList.add('show');
    }
    
    closeVictory() {
        document.getElementById('victoryPopup').classList.remove('show');
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const button = document.getElementById('soundToggle');
        button.textContent = this.soundEnabled ? '🔊 音效开启' : '🔇 音效关闭';
        
        // 保存设置
        localStorage.setItem('simonSoundEnabled', this.soundEnabled);
    }
    
    playSound(color) {
        if (!this.soundEnabled) return;
        
        try {
            // 创建音频上下文
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // 设置频率
            oscillator.frequency.setValueAtTime(this.soundFrequencies[color], audioContext.currentTime);
            oscillator.type = 'sine';
            
            // 设置音量包络
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            // 播放
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio playback failed:', e);
        }
    }
    
    showHelp() {
        document.getElementById('helpModal').classList.add('show');
    }
    
    closeHelp() {
        document.getElementById('helpModal').classList.remove('show');
    }
    
    updateDisplay() {
        document.getElementById('currentLevel').textContent = Math.max(1, this.level - 1);
        document.getElementById('levelDisplay').textContent = Math.max(1, this.level - 1);
        document.getElementById('streak').textContent = this.streak;
        document.getElementById('bestScore').textContent = this.stats.bestScore || 0;
    }
    
    updateGameStats(level, score, time, completed) {
        this.stats.totalGames = (this.stats.totalGames || 0) + 1;
        this.stats.totalTime = (this.stats.totalTime || 0) + time;
        
        if (!this.stats.bestScore || score > this.stats.bestScore) {
            this.stats.bestScore = score;
        }
        
        if (!this.stats.bestLevel || level > this.stats.bestLevel) {
            this.stats.bestLevel = level;
        }
        
        if (!this.stats.longestStreak || this.streak > this.stats.longestStreak) {
            this.stats.longestStreak = this.streak;
        }
        
        if (completed) {
            this.stats.completions = (this.stats.completions || 0) + 1;
        }
        
        this.saveStats();
        this.updateStats();
    }
    
    updateStats() {
        const stats = this.stats;
        
        document.getElementById('allTimeBest').textContent = stats.bestScore || 0;
        document.getElementById('totalGames').textContent = stats.totalGames || 0;
        
        const avgScore = stats.totalGames > 0 ? Math.round((stats.bestLevel || 0) * stats.totalGames / stats.totalGames) : 0;
        document.getElementById('averageScore').textContent = avgScore;
        document.getElementById('longestStreak').textContent = stats.longestStreak || 0;
    }
    
    loadStats() {
        try {
            const saved = localStorage.getItem('simonGameStats');
            const soundSetting = localStorage.getItem('simonSoundEnabled');
            
            if (soundSetting !== null) {
                this.soundEnabled = soundSetting === 'true';
            }
            
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    }
    
    saveStats() {
        localStorage.setItem('simonGameStats', JSON.stringify(this.stats));
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 全局变量供HTML onclick调用
let simonGame;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    simonGame = new SimonGame();
});