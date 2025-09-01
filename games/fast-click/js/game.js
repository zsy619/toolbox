class FastClick {
    constructor() {
        this.mode = 'classic';
        this.isPlaying = false;
        this.clicks = 0;
        this.timeLeft = 10;
        this.timer = null;
        this.startTime = 0;
        
        this.modeConfig = {
            classic: { time: 10, target: null, name: '经典模式' },
            endurance: { time: 30, target: null, name: '耐力模式' },
            burst: { time: 5, target: null, name: '爆发模式' },
            target: { time: null, target: 100, name: '目标模式' }
        };
        
        this.records = this.loadRecords();
        this.updateDisplay();
        this.updateRecords();
    }
    
    setMode(mode) {
        if (this.isPlaying) return;
        
        this.mode = mode;
        const config = this.modeConfig[mode];
        
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // 更新显示
        if (config.time) {
            this.timeLeft = config.time;
            document.getElementById('timeLeft').textContent = config.time;
        } else {
            document.getElementById('timeLeft').textContent = '∞';
        }
        
        this.updateBestScore();
        this.resetDisplay();
    }
    
    startGame() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.clicks = 0;
        this.startTime = Date.now();
        
        const config = this.modeConfig[this.mode];
        this.timeLeft = config.time || 999;
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('resetBtn').disabled = true;
        
        const clickArea = document.getElementById('clickArea');
        const clickText = document.getElementById('clickText');
        const clickInfo = document.getElementById('clickInfo');
        const progressContainer = document.getElementById('progressBarContainer');
        
        clickText.textContent = '开始点击！';
        clickInfo.textContent = `${config.name} - 尽可能快地点击`;
        
        if (config.target) {
            progressContainer.style.display = 'block';
        } else {
            progressContainer.style.display = 'none';
        }
        
        this.updateDisplay();
        
        if (config.time) {
            this.startTimer();
        }
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    handleClick() {
        if (!this.isPlaying) {
            this.startGame();
            return;
        }
        
        this.clicks++;
        this.createClickEffect(event);
        
        const config = this.modeConfig[this.mode];
        
        // 检查目标模式是否完成
        if (config.target && this.clicks >= config.target) {
            this.endGame();
            return;
        }
        
        this.updateDisplay();
        this.animateClickArea();
    }
    
    createClickEffect(event) {
        const clickArea = document.getElementById('clickArea');
        const effects = document.getElementById('clickEffects');
        const rect = clickArea.getBoundingClientRect();
        
        // 计算点击位置
        let x, y;
        if (event && event.clientX) {
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        } else {
            x = rect.width / 2;
            y = rect.height / 2;
        }
        
        // 创建粒子效果
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'click-particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            
            const dx = (Math.random() - 0.5) * 100;
            const dy = (Math.random() - 0.5) * 100;
            particle.style.setProperty('--dx', dx + 'px');
            particle.style.setProperty('--dy', dy + 'px');
            
            effects.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 600);
        }
    }
    
    animateClickArea() {
        const clickArea = document.getElementById('clickArea');
        clickArea.classList.add('active');
        
        setTimeout(() => {
            clickArea.classList.remove('active');
        }, 100);
    }
    
    updateDisplay() {
        document.getElementById('clicks').textContent = this.clicks;
        
        if (this.mode !== 'target') {
            document.getElementById('timeLeft').textContent = this.timeLeft;
        } else {
            document.getElementById('timeLeft').textContent = '∞';
        }
        
        // 计算CPS
        if (this.isPlaying && this.clicks > 0) {
            const elapsed = (Date.now() - this.startTime) / 1000;
            const cps = (this.clicks / elapsed).toFixed(1);
            document.getElementById('cps').textContent = cps;
        } else {
            document.getElementById('cps').textContent = '0.0';
        }
        
        // 更新进度条（目标模式）
        if (this.mode === 'target') {
            const progress = (this.clicks / this.modeConfig.target.target) * 100;
            document.getElementById('progressBar').style.width = Math.min(progress, 100) + '%';
        }
        
        this.updateBestScore();
    }
    
    updateBestScore() {
        const record = this.records[this.mode];
        if (this.mode === 'target') {
            document.getElementById('bestScore').textContent = record > 0 ? record.toFixed(1) + 's' : '--';
        } else {
            document.getElementById('bestScore').textContent = record;
        }
    }
    
    endGame() {
        this.isPlaying = false;
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('resetBtn').disabled = false;
        
        // 计算最终成绩
        let finalScore;
        if (this.mode === 'target') {
            finalScore = (Date.now() - this.startTime) / 1000;
        } else {
            finalScore = this.clicks;
        }
        
        // 更新记录
        this.updateRecord(finalScore);
        this.updateRecords();
        
        // 显示结果
        this.showGameOver(finalScore);
    }
    
    updateRecord(score) {
        if (this.mode === 'target') {
            // 目标模式：记录时间（越小越好）
            if (this.clicks >= this.modeConfig.target.target) {
                if (this.records[this.mode] === 0 || score < this.records[this.mode]) {
                    this.records[this.mode] = score;
                }
            }
        } else {
            // 其他模式：记录点击次数（越大越好）
            if (score > this.records[this.mode]) {
                this.records[this.mode] = score;
            }
        }
        
        this.saveRecords();
    }
    
    resetGame() {
        if (this.isPlaying) {
            this.endGame();
        }
        
        this.clicks = 0;
        this.timeLeft = this.modeConfig[this.mode].time || 999;
        
        this.resetDisplay();
        this.updateDisplay();
    }
    
    resetDisplay() {
        const clickText = document.getElementById('clickText');
        const clickInfo = document.getElementById('clickInfo');
        const progressContainer = document.getElementById('progressBarContainer');
        
        clickText.textContent = '点击开始游戏';
        clickInfo.textContent = '选择模式后点击此区域开始挑战';
        progressContainer.style.display = 'none';
        
        document.getElementById('cps').textContent = '0.0';
    }
    
    showGameOver(finalScore) {
        const elapsed = (Date.now() - this.startTime) / 1000;
        const avgCPS = elapsed > 0 ? (this.clicks / elapsed).toFixed(1) : '0.0';
        
        document.getElementById('finalClicks').textContent = this.clicks;
        document.getElementById('finalCPS').textContent = avgCPS;
        
        // 成绩评价
        const cps = parseFloat(avgCPS);
        let rating;
        if (cps >= 10) {
            rating = '神级手速 🔥';
        } else if (cps >= 8) {
            rating = '优秀 ⭐';
        } else if (cps >= 6) {
            rating = '良好 👍';
        } else if (cps >= 4) {
            rating = '一般 👌';
        } else {
            rating = '需要练习 💪';
        }
        
        document.getElementById('performanceRating').textContent = rating;
        
        // 标题
        let title;
        if (this.mode === 'target' && this.clicks >= this.modeConfig.target.target) {
            title = '🎯 目标完成！';
        } else if (cps >= 10) {
            title = '🔥 神级表现！';
        } else if (cps >= 8) {
            title = '⭐ 优秀成绩！';
        } else {
            title = '🎮 游戏结束';
        }
        
        document.getElementById('gameOverTitle').textContent = title;
        document.getElementById('gameOverPopup').classList.add('show');
    }
    
    closeGameOver() {
        document.getElementById('gameOverPopup').classList.remove('show');
    }
    
    updateRecords() {
        document.getElementById('classicRecord').textContent = this.records.classic + ' 次';
        document.getElementById('enduranceRecord').textContent = this.records.endurance + ' 次';
        document.getElementById('burstRecord').textContent = this.records.burst + ' 次';
        
        if (this.records.target > 0) {
            document.getElementById('targetRecord').textContent = this.records.target.toFixed(1) + ' 秒';
        } else {
            document.getElementById('targetRecord').textContent = '-- 秒';
        }
    }
    
    showRecords() {
        alert(`个人最佳记录：\n\n经典模式: ${this.records.classic} 次\n耐力模式: ${this.records.endurance} 次\n爆发模式: ${this.records.burst} 次\n目标模式: ${this.records.target > 0 ? this.records.target.toFixed(1) + ' 秒' : '未完成'}`);
    }
    
    showHelp() {
        document.getElementById('helpPopup').classList.add('show');
    }
    
    closeHelp() {
        document.getElementById('helpPopup').classList.remove('show');
    }
    
    saveRecords() {
        try {
            localStorage.setItem('fastClick_records', JSON.stringify(this.records));
        } catch (e) {
            console.warn('无法保存记录');
        }
    }
    
    loadRecords() {
        try {
            const saved = localStorage.getItem('fastClick_records');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('无法加载记录');
        }
        
        return {
            classic: 0,
            endurance: 0,
            burst: 0,
            target: 0
        };
    }
}

// 全局变量
let fastClick;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    fastClick = new FastClick();
});

// 键盘事件
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        fastClick.handleClick();
    }
});