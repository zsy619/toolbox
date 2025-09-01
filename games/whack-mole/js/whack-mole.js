class WhackMole {
    constructor() {
        // 游戏状态
        this.gameState = 'menu'; // menu, playing, paused, gameOver
        this.score = 0;
        this.timer = 60;
        this.combo = 0;
        this.maxCombo = 0;
        this.highScore = parseInt(localStorage.getItem('whackMoleHighScore')) || 0;
        
        // 游戏设置
        this.holes = [];
        this.moles = [];
        this.spawnInterval = null;
        this.gameTimer = null;
        this.difficulty = 1;
        
        // 地鼠类型配置
        this.moleTypes = {
            normal: { points: 10, duration: 2000, probability: 0.7 },
            golden: { points: 50, duration: 1500, probability: 0.2 },
            bomb: { points: -20, duration: 2500, probability: 0.1 }
        };
        
        this.initGame();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initGame() {
        this.createMoleHoles();
        this.moles = [];
        this.combo = 0;
        this.maxCombo = 0;
        this.difficulty = 1;
    }
    
    createMoleHoles() {
        const moleGrid = document.getElementById('moleGrid');
        moleGrid.innerHTML = '';
        this.holes = [];
        
        for (let i = 0; i < 9; i++) {
            const hole = document.createElement('div');
            hole.className = 'mole-hole';
            hole.dataset.holeIndex = i;
            
            const holeData = {
                element: hole,
                index: i,
                occupied: false,
                mole: null
            };
            
            this.holes.push(holeData);
            moleGrid.appendChild(hole);
        }
    }
    
    startGame() {
        if (this.gameState === 'menu' || this.gameState === 'gameOver') {
            this.gameState = 'playing';
            this.score = 0;
            this.timer = 60;
            this.combo = 0;
            this.maxCombo = 0;
            this.difficulty = 1;
            this.initGame();
            this.updateDisplay();
            this.startSpawning();
            this.startTimer();
        }
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseBtn').textContent = '继续';
            this.stopSpawning();
            this.stopTimer();
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseBtn').textContent = '暂停';
            this.startSpawning();
            this.startTimer();
        }
    }
    
    restartGame() {
        this.gameState = 'menu';
        this.stopSpawning();
        this.stopTimer();
        this.clearAllMoles();
        this.initGame();
        this.updateDisplay();
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = '暂停';
        
        // 移除游戏结束界面
        const gameOverDiv = document.querySelector('.game-over');
        if (gameOverDiv) {
            gameOverDiv.remove();
        }
        
        // 隐藏连击显示
        this.hideComboDisplay();
    }
    
    startSpawning() {
        this.stopSpawning();
        
        const baseInterval = Math.max(800, 2000 - this.difficulty * 100);
        const spawnMole = () => {
            if (this.gameState === 'playing') {
                this.spawnRandomMole();
                
                // 根据难度和时间调整生成间隔
                const currentInterval = Math.max(600, baseInterval - (60 - this.timer) * 20);
                this.spawnInterval = setTimeout(spawnMole, currentInterval + Math.random() * 500);
            }
        };
        
        spawnMole();
    }
    
    stopSpawning() {
        if (this.spawnInterval) {
            clearTimeout(this.spawnInterval);
            this.spawnInterval = null;
        }
    }
    
    startTimer() {
        this.stopTimer();
        this.gameTimer = setInterval(() => {
            if (this.gameState === 'playing') {
                this.timer--;
                this.updateDisplay();
                
                // 每20秒增加难度
                if (this.timer % 20 === 0 && this.timer > 0) {
                    this.difficulty++;
                }
                
                if (this.timer <= 0) {
                    this.endGame();
                }
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }
    
    spawnRandomMole() {
        // 找到空闲的洞
        const availableHoles = this.holes.filter(hole => !hole.occupied);
        if (availableHoles.length === 0) return;
        
        // 随机选择一个洞
        const randomHole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
        
        // 根据概率决定地鼠类型
        const rand = Math.random();
        let moleType = 'normal';
        
        if (rand <= this.moleTypes.bomb.probability) {
            moleType = 'bomb';
        } else if (rand <= this.moleTypes.bomb.probability + this.moleTypes.golden.probability) {
            moleType = 'golden';
        }
        
        this.spawnMole(randomHole, moleType);
    }
    
    spawnMole(hole, type) {
        if (hole.occupied) return;
        
        const mole = document.createElement('div');
        mole.className = `mole mole-${type}`;
        
        const moleData = {
            element: mole,
            hole: hole,
            type: type,
            timeout: null,
            clicked: false
        };
        
        // 设置点击事件
        mole.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hitMole(moleData);
        });
        
        // 添加到洞中
        hole.element.appendChild(mole);
        hole.occupied = true;
        hole.mole = moleData;
        this.moles.push(moleData);
        
        // 显示地鼠
        setTimeout(() => {
            if (mole.parentNode) {
                mole.classList.add('visible');
            }
        }, 50);
        
        // 设置自动消失
        const duration = this.moleTypes[type].duration - (this.difficulty - 1) * 200;
        moleData.timeout = setTimeout(() => {
            this.removeMole(moleData, false);
        }, Math.max(800, duration));
    }
    
    hitMole(moleData) {
        if (moleData.clicked || this.gameState !== 'playing') return;
        
        moleData.clicked = true;
        const points = this.moleTypes[moleData.type].points;
        
        // 更新分数
        this.score += points;
        
        // 处理连击
        if (points > 0) {
            this.combo++;
            this.maxCombo = Math.max(this.maxCombo, this.combo);
            
            // 连击奖励
            if (this.combo >= 5) {
                const comboBonus = Math.floor(this.combo / 5) * 5;
                this.score += comboBonus;
                this.showScorePopup(moleData.hole.element, `+${points + comboBonus}`, false);
            } else {
                this.showScorePopup(moleData.hole.element, `+${points}`, false);
            }
            
            this.showComboDisplay();
        } else {
            this.combo = 0;
            this.hideComboDisplay();
            this.showScorePopup(moleData.hole.element, `${points}`, true);
        }
        
        // 更新最高分
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('whackMoleHighScore', this.highScore.toString());
        }
        
        // 击中动画
        moleData.element.classList.add('hit');
        
        // 移除地鼠
        setTimeout(() => {
            this.removeMole(moleData, true);
        }, 300);
        
        this.updateDisplay();
    }
    
    removeMole(moleData, wasHit) {
        if (!moleData.hole || !moleData.hole.element) return;
        
        // 清除超时
        if (moleData.timeout) {
            clearTimeout(moleData.timeout);
        }
        
        // 如果没被击中，重置连击
        if (!wasHit && !moleData.clicked) {
            this.combo = 0;
            this.hideComboDisplay();
            this.updateDisplay();
        }
        
        // 移除DOM元素
        if (moleData.element && moleData.element.parentNode) {
            moleData.element.classList.remove('visible');
            setTimeout(() => {
                if (moleData.element && moleData.element.parentNode) {
                    moleData.element.parentNode.removeChild(moleData.element);
                }
            }, 300);
        }
        
        // 释放洞
        moleData.hole.occupied = false;
        moleData.hole.mole = null;
        
        // 从数组中移除
        const index = this.moles.indexOf(moleData);
        if (index > -1) {
            this.moles.splice(index, 1);
        }
    }
    
    clearAllMoles() {
        this.moles.forEach(mole => {
            this.removeMole(mole, false);
        });
        this.moles = [];
    }
    
    showScorePopup(holeElement, text, isNegative) {
        const popup = document.createElement('div');
        popup.className = `score-popup ${isNegative ? 'negative' : ''}`;
        popup.textContent = text;
        
        holeElement.appendChild(popup);
        
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 1000);
    }
    
    showComboDisplay() {
        let comboDisplay = document.querySelector('.combo-display');
        if (!comboDisplay) {
            comboDisplay = document.createElement('div');
            comboDisplay.className = 'combo-display';
            document.querySelector('.game-board').appendChild(comboDisplay);
        }
        
        comboDisplay.textContent = `连击 x${this.combo}`;
        comboDisplay.classList.add('visible');
    }
    
    hideComboDisplay() {
        const comboDisplay = document.querySelector('.combo-display');
        if (comboDisplay) {
            comboDisplay.classList.remove('visible');
        }
    }
    
    endGame() {
        this.gameState = 'gameOver';
        this.stopSpawning();
        this.stopTimer();
        this.clearAllMoles();
        
        this.showGameOver();
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = '暂停';
    }
    
    showGameOver() {
        const gameOverDiv = document.createElement('div');
        gameOverDiv.className = 'game-over';
        gameOverDiv.innerHTML = `
            <h2>🔨 游戏结束 🐭</h2>
            <div class="game-over-stats">
                <div>🏆 最终得分: ${this.score}</div>
                <div>⭐ 最高记录: ${this.highScore}</div>
                <div>⚡ 最高连击: ${this.maxCombo}</div>
                <div>🎯 击中率: ${this.calculateHitRate()}%</div>
            </div>
            <button onclick="whackMole.restartGame()" style="margin-top: 20px;">重新开始</button>
        `;
        document.body.appendChild(gameOverDiv);
    }
    
    calculateHitRate() {
        const totalMoles = this.moles.length;
        if (totalMoles === 0) return 0;
        
        const hitMoles = this.moles.filter(mole => mole.clicked).length;
        return Math.round((hitMoles / totalMoles) * 100);
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('timer').textContent = this.timer;
        document.getElementById('combo').textContent = this.combo;
        document.getElementById('highScore').textContent = this.highScore;
    }
    
    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'p':
                case 'P':
                    e.preventDefault();
                    if (this.gameState === 'playing' || this.gameState === 'paused') {
                        this.togglePause();
                    }
                    break;
                case ' ':
                    e.preventDefault();
                    if (this.gameState === 'menu' || this.gameState === 'gameOver') {
                        this.startGame();
                    }
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    this.restartGame();
                    break;
            }
        });
        
        // 点击洞的事件（空洞点击）
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('mole-hole') && this.gameState === 'playing') {
                // 点击空洞，重置连击
                if (this.combo > 0) {
                    this.combo = 0;
                    this.hideComboDisplay();
                    this.updateDisplay();
                    
                    // 显示Miss提示
                    this.showScorePopup(e.target, 'Miss!', true);
                }
            }
        });
        
        // 防止右键菜单
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // 防止选择文本
        document.addEventListener('selectstart', (e) => {
            e.preventDefault();
        });
    }
}

// 全局变量
let whackMole;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    whackMole = new WhackMole();
});