// 颜色匹配游戏 - 主要逻辑
class ColorMatch {
    constructor() {
        this.gameMode = 'classic';
        this.score = 0;
        this.level = 1;
        this.streak = 0;
        this.maxStreak = 0;
        this.timeLeft = 30;
        this.gameActive = false;
        this.currentTarget = null;
        this.correctAnswers = 0;
        this.totalAnswers = 0;
        this.timer = null;
        this.sequence = [];
        this.playerSequence = [];
        this.sequenceIndex = 0;
        this.showingSequence = false;
        
        // 游戏配置
        this.config = {
            classic: {
                boardSize: 16,
                timeLimit: 30,
                colors: 8
            },
            sequence: {
                boardSize: 9,
                timeLimit: 45,
                colors: 6,
                sequenceLength: 3
            },
            speed: {
                boardSize: 12,
                timeLimit: 20,
                colors: 6
            },
            zen: {
                boardSize: 16,
                timeLimit: 0,
                colors: 10
            }
        };
        
        // 颜色调色板
        this.colorPalette = [
            '#F44336', '#E91E63', '#9C27B0', '#673AB7',
            '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
            '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
            '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
            '#795548', '#9E9E9E', '#607D8B', '#000000'
        ];
        
        this.bindEvents();
    }
    
    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.gameActive) {
                e.preventDefault();
                this.startGame();
            } else if (e.code === 'Escape' && this.gameActive) {
                this.pauseGame();
            }
        });
    }
    
    setMode(mode) {
        if (this.gameActive) return;
        
        this.gameMode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // 更新时间显示
        const timeLimit = this.config[mode].timeLimit;
        document.getElementById('timeLeft').textContent = timeLimit || '∞';
    }
    
    startGame() {
        this.resetGame();
        this.gameActive = true;
        this.timeLeft = this.config[this.gameMode].timeLimit;
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        
        this.generateBoard();
        this.updateDisplay();
        
        if (this.gameMode === 'sequence') {
            this.startSequenceMode();
        } else {
            this.generateTarget();
            if (this.timeLeft > 0) {
                this.startTimer();
            }
        }
    }
    
    resetGame() {
        this.score = 0;
        this.level = 1;
        this.streak = 0;
        this.timeLeft = this.config[this.gameMode].timeLimit;
        this.correctAnswers = 0;
        this.totalAnswers = 0;
        this.sequence = [];
        this.playerSequence = [];
        this.sequenceIndex = 0;
        this.showingSequence = false;
        
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('targetInfo').textContent = '点击开始游戏';
        document.getElementById('sequenceDisplay').style.display = 'none';
        
        this.updateDisplay();
    }
    
    pauseGame() {
        if (!this.gameActive) return;
        
        this.gameActive = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        document.getElementById('pauseBtn').textContent = '▶️ 继续';
        document.getElementById('pauseBtn').onclick = () => this.resumeGame();
    }
    
    resumeGame() {
        this.gameActive = true;
        if (this.timeLeft > 0) {
            this.startTimer();
        }
        
        document.getElementById('pauseBtn').textContent = '⏸️ 暂停';
        document.getElementById('pauseBtn').onclick = () => this.pauseGame();
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
    
    generateBoard() {
        const board = document.getElementById('gameBoard');
        const config = this.config[this.gameMode];
        const colors = this.getRandomColors(config.colors);
        
        board.innerHTML = '';
        board.style.gridTemplateColumns = `repeat(auto-fit, minmax(80px, 1fr))`;
        
        // 生成颜色块
        for (let i = 0; i < config.boardSize; i++) {
            const tile = document.createElement('div');
            tile.className = 'color-tile';
            tile.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            tile.addEventListener('click', () => this.handleTileClick(tile));
            board.appendChild(tile);
        }
    }
    
    getRandomColors(count) {
        const shuffled = [...this.colorPalette].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
    
    generateTarget() {
        const tiles = document.querySelectorAll('.color-tile');
        if (tiles.length === 0) return;
        
        const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
        const targetColor = randomTile.style.backgroundColor;
        
        this.currentTarget = {
            color: targetColor,
            rgb: this.hexToRgb(this.rgbToHex(targetColor))
        };
        
        document.getElementById('targetColor').style.backgroundColor = targetColor;
        document.getElementById('targetInfo').textContent = '点击相同颜色的方块';
    }
    
    handleTileClick(tile) {
        if (!this.gameActive || this.showingSequence) return;
        
        const clickedColor = tile.style.backgroundColor;
        
        if (this.gameMode === 'sequence') {
            this.handleSequenceClick(tile);
            return;
        }
        
        this.totalAnswers++;
        
        // 移除之前的状态
        document.querySelectorAll('.color-tile').forEach(t => {
            t.classList.remove('correct', 'incorrect', 'selected');
        });
        
        tile.classList.add('selected');
        
        if (clickedColor === this.currentTarget.color) {
            tile.classList.add('correct');
            this.handleCorrectAnswer();
        } else {
            tile.classList.add('incorrect');
            this.handleIncorrectAnswer();
        }
        
        setTimeout(() => {
            if (this.gameActive) {
                this.generateNewRound();
            }
        }, 1000);
    }
    
    handleCorrectAnswer() {
        this.correctAnswers++;
        this.streak++;
        this.maxStreak = Math.max(this.maxStreak, this.streak);
        
        // 计算分数
        const baseScore = 10 * this.level;
        const streakBonus = Math.floor(this.streak / 3) * 5;
        const speedBonus = this.gameMode === 'speed' ? 5 : 0;
        this.score += baseScore + streakBonus + speedBonus;
        
        // 升级检查
        if (this.correctAnswers % 10 === 0) {
            this.level++;
        }
        
        this.updateDisplay();
    }
    
    handleIncorrectAnswer() {
        this.streak = 0;
        this.updateDisplay();
    }
    
    generateNewRound() {
        if (this.gameMode === 'classic' || this.gameMode === 'speed' || this.gameMode === 'zen') {
            this.generateBoard();
            this.generateTarget();
        } else if (this.gameMode === 'sequence') {
            this.nextSequenceRound();
        }
    }
    
    // 序列模式相关方法
    startSequenceMode() {
        this.generateSequence();
        this.showSequence();
    }
    
    generateSequence() {
        const config = this.config.sequence;
        const colors = this.getRandomColors(config.colors);
        const length = Math.min(config.sequenceLength + Math.floor(this.level / 2), 8);
        
        this.sequence = [];
        for (let i = 0; i < length; i++) {
            this.sequence.push(colors[Math.floor(Math.random() * colors.length)]);
        }
        
        this.playerSequence = [];
        this.sequenceIndex = 0;
    }
    
    showSequence() {
        const sequenceDisplay = document.getElementById('sequenceDisplay');
        const sequenceColors = document.getElementById('sequenceColors');
        const sequenceTimer = document.getElementById('sequenceTimer');
        
        sequenceDisplay.style.display = 'block';
        sequenceColors.innerHTML = '';
        
        // 显示序列颜色
        this.sequence.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'sequence-color';
            colorDiv.style.backgroundColor = color;
            sequenceColors.appendChild(colorDiv);
        });
        
        // 倒计时
        let countdown = 3 + this.sequence.length;
        this.showingSequence = true;
        
        const countdownTimer = setInterval(() => {
            sequenceTimer.textContent = countdown;
            countdown--;
            
            if (countdown < 0) {
                clearInterval(countdownTimer);
                sequenceDisplay.style.display = 'none';
                this.showingSequence = false;
                document.getElementById('targetInfo').textContent = `按顺序点击 ${this.sequence.length} 个颜色`;
                if (this.timeLeft > 0) {
                    this.startTimer();
                }
            }
        }, 1000);
    }
    
    handleSequenceClick(tile) {
        const clickedColor = tile.style.backgroundColor;
        const expectedColor = this.sequence[this.sequenceIndex];
        
        this.playerSequence.push(clickedColor);
        
        if (clickedColor === expectedColor) {
            tile.classList.add('correct');
            this.sequenceIndex++;
            
            if (this.sequenceIndex >= this.sequence.length) {
                // 序列完成
                this.handleCorrectAnswer();
                setTimeout(() => {
                    this.nextSequenceRound();
                }, 1000);
            }
        } else {
            tile.classList.add('incorrect');
            this.handleIncorrectAnswer();
            setTimeout(() => {
                this.nextSequenceRound();
            }, 1000);
        }
    }
    
    nextSequenceRound() {
        document.querySelectorAll('.color-tile').forEach(t => {
            t.classList.remove('correct', 'incorrect', 'selected');
        });
        
        this.generateBoard();
        this.generateSequence();
        this.showSequence();
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('streak').textContent = this.streak;
        
        if (this.timeLeft > 0) {
            document.getElementById('timeLeft').textContent = this.timeLeft;
        } else {
            document.getElementById('timeLeft').textContent = '∞';
        }
    }
    
    endGame() {
        this.gameActive = false;
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        
        this.showGameOver();
    }
    
    showGameOver() {
        const accuracy = this.totalAnswers > 0 ? 
            Math.round((this.correctAnswers / this.totalAnswers) * 100) : 0;
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('accuracy').textContent = accuracy + '%';
        document.getElementById('maxStreak').textContent = this.maxStreak;
        document.getElementById('maxLevel').textContent = this.level;
        
        const title = document.getElementById('gameOverTitle');
        if (this.score > 500) {
            title.textContent = '🏆 出色表现！';
        } else if (this.score > 200) {
            title.textContent = '🎉 不错的成绩！';
        } else {
            title.textContent = '🎮 游戏结束';
        }
        
        document.getElementById('gameOverPopup').classList.add('show');
    }
    
    closeGameOver() {
        document.getElementById('gameOverPopup').classList.remove('show');
    }
    
    showHelp() {
        document.getElementById('helpPopup').classList.add('show');
    }
    
    closeHelp() {
        document.getElementById('helpPopup').classList.remove('show');
    }
    
    // 工具方法
    rgbToHex(rgb) {
        const result = rgb.match(/\d+/g);
        if (!result) return rgb;
        
        const r = parseInt(result[0]);
        const g = parseInt(result[1]);
        const b = parseInt(result[2]);
        
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
}

// 全局变量
let colorMatch;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    colorMatch = new ColorMatch();
});