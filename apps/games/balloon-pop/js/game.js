class BalloonPop {
            constructor() {
                this.mode = 'classic';
                this.gameActive = false;
                this.score = 0;
                this.balloonsPop = 0;
                this.timeLeft = 60;
                this.combo = 0;
                this.maxCombo = 0;
                this.lives = 3;
                this.timer = null;
                this.balloonSpawner = null;
                this.balloons = [];
                this.clicks = 0;
                this.hits = 0;
                
                this.balloonTypes = [
                    { color: 'red', points: 10, emoji: '🔴' },
                    { color: 'pink', points: 10, emoji: '🌸' },
                    { color: 'purple', points: 10, emoji: '🟣' },
                    { color: 'blue', points: 10, emoji: '🔵' },
                    { color: 'cyan', points: 10, emoji: '🔷' },
                    { color: 'green', points: 10, emoji: '🟢' },
                    { color: 'yellow', points: 10, emoji: '🟡' },
                    { color: 'orange', points: 10, emoji: '🟠' }
                ];
                
                this.achievements = this.loadAchievements();
                this.updateAchievementDisplay();
            }
            
            setMode(mode) {
                if (this.gameActive) return;
                
                this.mode = mode;
                document.querySelectorAll('.mode-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                event.target.classList.add('active');
                
                // 根据模式调整显示
                if (mode === 'endless') {
                    document.getElementById('timeLeft').textContent = '∞';
                } else if (mode === 'survival') {
                    this.lives = 3;
                    document.getElementById('timeLeft').textContent = '❤️' + this.lives;
                } else {
                    document.getElementById('timeLeft').textContent = '60';
                }
            }
            
            startGame() {
                this.gameActive = true;
                this.score = 0;
                this.balloonsPop = 0;
                this.combo = 0;
                this.clicks = 0;
                this.hits = 0;
                
                if (this.mode === 'classic' || this.mode === 'combo') {
                    this.timeLeft = 60;
                } else if (this.mode === 'survival') {
                    this.lives = 3;
                    this.timeLeft = 0; // 用作计时器
                } else {
                    this.timeLeft = 0; // 无限模式
                }
                
                document.getElementById('startBtn').disabled = true;
                document.getElementById('pauseBtn').disabled = false;
                
                this.clearBalloons();
                this.updateDisplay();
                this.startSpawning();
                
                if (this.mode !== 'endless') {
                    this.startTimer();
                }
            }
            
            pauseGame() {
                if (!this.gameActive) return;
                
                this.gameActive = false;
                this.stopSpawning();
                
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                
                document.getElementById('pauseBtn').textContent = '▶️ 继续';
                document.getElementById('pauseBtn').onclick = () => this.resumeGame();
            }
            
            resumeGame() {
                this.gameActive = true;
                this.startSpawning();
                
                if (this.mode !== 'endless') {
                    this.startTimer();
                }
                
                document.getElementById('pauseBtn').textContent = '⏸️ 暂停';
                document.getElementById('pauseBtn').onclick = () => this.pauseGame();
            }
            
            resetGame() {
                this.gameActive = false;
                this.stopSpawning();
                
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                
                this.score = 0;
                this.balloonsPop = 0;
                this.combo = 0;
                this.clicks = 0;
                this.hits = 0;
                
                if (this.mode === 'survival') {
                    this.lives = 3;
                }
                
                document.getElementById('startBtn').disabled = false;
                document.getElementById('pauseBtn').disabled = true;
                document.getElementById('pauseBtn').textContent = '⏸️ 暂停';
                document.getElementById('pauseBtn').onclick = () => this.pauseGame();
                
                this.clearBalloons();
                this.updateDisplay();
            }
            
            startTimer() {
                this.timer = setInterval(() => {
                    if (this.mode === 'survival') {
                        this.timeLeft++;
                    } else {
                        this.timeLeft--;
                        if (this.timeLeft <= 0) {
                            this.endGame();
                        }
                    }
                    this.updateDisplay();
                }, 1000);
            }
            
            startSpawning() {
                this.balloonSpawner = setInterval(() => {
                    if (this.gameActive) {
                        this.spawnBalloon();
                    }
                }, this.getSpawnRate());
            }
            
            stopSpawning() {
                if (this.balloonSpawner) {
                    clearInterval(this.balloonSpawner);
                    this.balloonSpawner = null;
                }
            }
            
            getSpawnRate() {
                const baseRate = 1500;
                const levelMultiplier = Math.max(0.3, 1 - (this.balloonsPop / 100));
                return baseRate * levelMultiplier;
            }
            
            spawnBalloon() {
                const gameArea = document.getElementById('gameArea');
                const balloon = document.createElement('div');
                balloon.className = 'balloon';
                
                // 随机位置
                const maxX = gameArea.clientWidth - 60;
                const x = Math.random() * maxX;
                balloon.style.left = x + 'px';
                balloon.style.bottom = '0px';
                
                // 随机类型
                let balloonType;
                const rand = Math.random();
                
                if (this.mode === 'survival' && rand < 0.15) {
                    // 炸弹气球
                    balloonType = { color: 'bomb', points: -50, emoji: '💣' };
                    balloon.classList.add('bomb');
                } else if (rand < 0.1) {
                    // 特殊气球
                    balloonType = { color: 'special', points: 25, emoji: '⭐' };
                    balloon.classList.add('special');
                } else {
                    // 普通气球
                    balloonType = this.balloonTypes[Math.floor(Math.random() * this.balloonTypes.length)];
                    balloon.classList.add(balloonType.color);
                }
                
                balloon.textContent = balloonType.emoji;
                balloon.dataset.points = balloonType.points;
                balloon.dataset.type = balloonType.color;
                
                // 设置动画持续时间
                const duration = 5 + Math.random() * 3; // 5-8秒
                balloon.style.animationDuration = duration + 's';
                
                // 点击事件
                balloon.addEventListener('click', (e) => this.popBalloon(e, balloon));
                
                gameArea.appendChild(balloon);
                this.balloons.push(balloon);
                
                // 气球消失后清理
                setTimeout(() => {
                    if (balloon.parentNode && this.gameActive) {
                        balloon.remove();
                        this.balloons = this.balloons.filter(b => b !== balloon);
                        
                        // 错过气球，重置连击
                        if (balloon.dataset.type !== 'bomb') {
                            this.combo = 0;
                            this.updateComboDisplay();
                        }
                    }
                }, duration * 1000);
            }
            
            popBalloon(event, balloon) {
                event.stopPropagation();
                
                if (!this.gameActive || balloon.classList.contains('popping')) return;
                
                this.clicks++;
                this.hits++;
                
                balloon.classList.add('popping');
                
                const points = parseInt(balloon.dataset.points);
                const type = balloon.dataset.type;
                
                if (type === 'bomb') {
                    // 炸弹气球
                    if (this.mode === 'survival') {
                        this.lives--;
                        if (this.lives <= 0) {
                            this.endGame();
                            return;
                        }
                    }
                    this.combo = 0;
                    this.score = Math.max(0, this.score + points);
                } else {
                    // 普通气球
                    this.balloonsPop++;
                    this.combo++;
                    this.maxCombo = Math.max(this.maxCombo, this.combo);
                    
                    let finalPoints = points;
                    if (this.mode === 'combo' && this.combo > 1) {
                        finalPoints = points * Math.min(this.combo, 5); // 最大5倍
                    }
                    
                    this.score += finalPoints;
                    
                    // 检查成就
                    this.checkAchievements();
                }
                
                // 显示分数弹出
                this.showScorePopup(event.clientX, event.clientY, points);
                
                // 移除气球
                setTimeout(() => {
                    balloon.remove();
                    this.balloons = this.balloons.filter(b => b !== balloon);
                }, 300);
                
                this.updateDisplay();
                this.updateComboDisplay();
            }
            
            showScorePopup(x, y, points) {
                const popup = document.createElement('div');
                popup.className = 'score-popup';
                popup.textContent = (points > 0 ? '+' : '') + points;
                popup.style.left = x + 'px';
                popup.style.top = y + 'px';
                popup.style.position = 'fixed';
                
                document.body.appendChild(popup);
                
                setTimeout(() => {
                    popup.remove();
                }, 1000);
            }
            
            updateComboDisplay() {
                const comboDisplay = document.getElementById('comboDisplay');
                
                if (this.combo >= 3) {
                    comboDisplay.textContent = `连击 x${this.combo}`;
                    comboDisplay.classList.add('show');
                } else {
                    comboDisplay.classList.remove('show');
                }
            }
            
            updateDisplay() {
                document.getElementById('score').textContent = this.score;
                document.getElementById('balloonsPop').textContent = this.balloonsPop;
                document.getElementById('combo').textContent = this.combo;
                
                if (this.mode === 'endless') {
                    document.getElementById('timeLeft').textContent = '∞';
                } else if (this.mode === 'survival') {
                    document.getElementById('timeLeft').textContent = '❤️' + this.lives;
                } else {
                    document.getElementById('timeLeft').textContent = this.timeLeft;
                }
            }
            
            clearBalloons() {
                const gameArea = document.getElementById('gameArea');
                this.balloons.forEach(balloon => balloon.remove());
                this.balloons = [];
                
                // 清理所有气球元素
                gameArea.querySelectorAll('.balloon').forEach(balloon => balloon.remove());
            }
            
            endGame() {
                this.gameActive = false;
                this.stopSpawning();
                
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                
                document.getElementById('startBtn').disabled = false;
                document.getElementById('pauseBtn').disabled = true;
                
                this.showGameOver();
            }
            
            showGameOver() {
                const accuracy = this.clicks > 0 ? Math.round((this.hits / this.clicks) * 100) : 100;
                
                document.getElementById('finalScore').textContent = this.score;
                document.getElementById('finalBalloons').textContent = this.balloonsPop;
                document.getElementById('maxCombo').textContent = this.maxCombo;
                document.getElementById('accuracy').textContent = accuracy + '%';
                
                // 根据成绩设置标题
                let title;
                if (this.score >= 1000) {
                    title = '🏆 气球大师！';
                } else if (this.score >= 500) {
                    title = '🎉 出色表现！';
                } else if (this.score >= 200) {
                    title = '👍 不错的成绩！';
                } else {
                    title = '🎮 游戏结束';
                }
                
                document.getElementById('gameOverTitle').textContent = title;
                document.getElementById('gameOverPopup').classList.add('show');
            }
            
            closeGameOver() {
                document.getElementById('gameOverPopup').classList.remove('show');
            }
            
            checkAchievements() {
                const newAchievements = [];
                
                // 初次尝试
                if (this.balloonsPop === 1 && !this.achievements.first_pop) {
                    this.achievements.first_pop = true;
                    newAchievements.push('first_pop');
                }
                
                // 连击大师
                if (this.combo >= 10 && !this.achievements.combo_master) {
                    this.achievements.combo_master = true;
                    newAchievements.push('combo_master');
                }
                
                // 极速恶魔
                if (this.balloonsPop >= 100 && this.timeLeft >= 0 && !this.achievements.speed_demon) {
                    this.achievements.speed_demon = true;
                    newAchievements.push('speed_demon');
                }
                
                // 生存专家
                if (this.mode === 'survival' && this.timeLeft >= 120 && !this.achievements.survivor) {
                    this.achievements.survivor = true;
                    newAchievements.push('survivor');
                }
                
                if (newAchievements.length > 0) {
                    this.saveAchievements();
                    this.updateAchievementDisplay();
                    
                    // 显示成就通知
                    newAchievements.forEach(id => {
                        setTimeout(() => {
                            const achievement = document.querySelector(`[data-id="${id}"]`);
                            if (achievement) {
                                achievement.style.animation = 'achievement-unlock 2s ease';
                            }
                        }, 500);
                    });
                }
            }
            
            updateAchievementDisplay() {
                Object.keys(this.achievements).forEach(id => {
                    const element = document.querySelector(`[data-id="${id}"]`);
                    if (element && this.achievements[id]) {
                        element.classList.add('unlocked');
                    }
                });
            }
            
            saveAchievements() {
                try {
                    localStorage.setItem('balloonPop_achievements', JSON.stringify(this.achievements));
                } catch (e) {
                    console.warn('无法保存成就');
                }
            }
            
            loadAchievements() {
                try {
                    const saved = localStorage.getItem('balloonPop_achievements');
                    if (saved) {
                        return JSON.parse(saved);
                    }
                } catch (e) {
                    console.warn('无法加载成就');
                }
                
                return {
                    first_pop: false,
                    combo_master: false,
                    speed_demon: false,
                    survivor: false
                };
            }
            
            showHelp() {
                document.getElementById('helpPopup').classList.add('show');
            }
            
            closeHelp() {
                document.getElementById('helpPopup').classList.remove('show');
            }
        }

        // 全局变量
        let balloonPop;

        // 页面加载完成后初始化
        document.addEventListener('DOMContentLoaded', () => {
            balloonPop = new BalloonPop();
        });

        // 点击游戏区域记录点击次数
        document.getElementById('gameArea').addEventListener('click', (e) => {
            if (balloonPop.gameActive && e.target.id === 'gameArea') {
                balloonPop.clicks++;
                balloonPop.combo = 0;
                balloonPop.updateComboDisplay();
            }
        });

        // 成就解锁动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes achievement-unlock {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); background: rgba(255, 215, 79, 0.4); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);