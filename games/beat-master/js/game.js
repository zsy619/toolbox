class BeatMaster {
            constructor() {
                this.gameActive = false;
                this.gamePaused = false;
                this.currentMode = 'training';
                this.bpm = 120;
                this.score = 0;
                this.combo = 0;
                this.maxCombo = 0;
                this.beatCount = 0;
                this.accurateBeats = 0;
                this.totalBeats = 0;
                this.currentBeat = 0;
                this.gameStartTime = 0;
                this.gameInterval = null;
                this.beatInterval = null;
                this.lastBeatTime = 0;
                this.tolerance = 150; // 毫秒容错
                this.currentPattern = [];
                this.patternIndex = 0;
                
                this.modes = {
                    training: { 
                        name: '训练模式', 
                        bpm: 120, 
                        duration: 60,
                        pattern: [1, 0, 1, 0] // 简单4/4拍
                    },
                    challenge: { 
                        name: '挑战模式', 
                        bpm: 80, 
                        duration: 90,
                        pattern: [1, 0, 1, 0, 1, 0, 1, 0]
                    },
                    rhythm: { 
                        name: '节奏模式', 
                        bpm: 100, 
                        duration: 120,
                        pattern: [2, 1, 0, 1, 2, 0, 1, 0] // 复杂节奏型
                    },
                    freestyle: { 
                        name: '自由模式', 
                        bpm: 120, 
                        duration: 180,
                        pattern: [1, 1, 1, 1]
                    }
                };
                
                this.init();
            }

            init() {
                this.setupEventListeners();
                this.setupAudio();
                this.updateDisplay();
                this.createPattern();
            }

            setupEventListeners() {
                document.querySelectorAll('.mode-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        if (this.gameActive && !this.gamePaused) return;
                        
                        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        this.currentMode = e.target.dataset.mode;
                        this.bpm = this.modes[this.currentMode].bpm;
                        this.createPattern();
                        this.updateDisplay();
                    });
                });

                document.addEventListener('keydown', (e) => {
                    if (e.key === ' ') {
                        e.preventDefault();
                        if (this.gameActive) {
                            this.tapBeat('primary');
                        } else {
                            this.startGame();
                        }
                    } else if (e.key === 'Enter') {
                        e.preventDefault();
                        this.tapBeat('secondary');
                    }
                });

                // 阻止按钮的默认行为以获得更精确的时间
                document.getElementById('primaryBeat').addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.tapBeat('primary');
                });

                document.getElementById('secondaryBeat').addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.tapBeat('secondary');
                });
            }

            setupAudio() {
                if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                }
            }

            startGame() {
                if (this.gameActive) return;
                
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume();
                }
                
                this.gameActive = true;
                this.gamePaused = false;
                this.score = 0;
                this.combo = 0;
                this.maxCombo = 0;
                this.beatCount = 0;
                this.accurateBeats = 0;
                this.totalBeats = 0;
                this.currentBeat = 0;
                this.patternIndex = 0;
                this.gameStartTime = Date.now();
                
                const mode = this.modes[this.currentMode];
                this.bpm = mode.bpm;
                this.currentPattern = mode.pattern;
                this.gameDuration = mode.duration * 1000;
                
                this.startBeats();
                this.updateDisplay();
                this.createPattern();
                
                document.getElementById('pauseBtn').textContent = '⏸️ 暂停';
                document.getElementById('completeOverlay').style.display = 'none';
                
                // 游戏计时器
                this.gameInterval = setInterval(() => {
                    const elapsed = Date.now() - this.gameStartTime;
                    if (elapsed >= this.gameDuration) {
                        this.endGame();
                    }
                }, 100);
            }

            startBeats() {
                const beatDuration = 60000 / this.bpm; // 毫秒
                this.lastBeatTime = Date.now();
                
                this.beatInterval = setInterval(() => {
                    if (!this.gamePaused) {
                        this.playBeat();
                        this.currentBeat++;
                        this.updateBeatDisplay();
                        this.lastBeatTime = Date.now();
                    }
                }, beatDuration);
            }

            playBeat() {
                if (!this.audioContext) return;
                
                const patternValue = this.currentPattern[this.patternIndex % this.currentPattern.length];
                this.patternIndex++;
                
                // 根据节拍类型播放不同音调
                let frequency = 800; // 默认频率
                if (patternValue === 2) frequency = 1000; // 强拍
                else if (patternValue === 1) frequency = 800;  // 中拍
                else if (patternValue === 0) frequency = 600;  // 弱拍或休止
                
                if (patternValue > 0) {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
                    oscillator.type = 'sine';
                    
                    const volume = patternValue === 2 ? 0.3 : 0.2;
                    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.1);
                }
            }

            tapBeat(type) {
                if (!this.gameActive || this.gamePaused) return;
                
                const now = Date.now();
                const timeSinceLastBeat = now - this.lastBeatTime;
                const beatDuration = 60000 / this.bpm;
                const nextBeatTime = beatDuration - timeSinceLastBeat;
                
                // 计算准确性
                let accuracy = 0;
                if (timeSinceLastBeat < this.tolerance) {
                    // 太早了
                    accuracy = Math.max(0, 100 - (this.tolerance - timeSinceLastBeat) / this.tolerance * 100);
                } else if (nextBeatTime < this.tolerance) {
                    // 接近下一拍
                    accuracy = Math.max(0, 100 - nextBeatTime / this.tolerance * 100);
                }
                
                this.totalBeats++;
                
                if (accuracy > 70) {
                    this.accurateBeats++;
                    this.combo++;
                    this.score += Math.floor(accuracy * (1 + this.combo * 0.1));
                    
                    if (this.combo > this.maxCombo) {
                        this.maxCombo = this.combo;
                    }
                    
                    // 视觉反馈
                    this.showAccuracyFeedback(accuracy);
                } else {
                    this.combo = 0;
                    this.showAccuracyFeedback(0);
                }
                
                this.beatCount++;
                this.updateDisplay();
                
                // 按钮反馈
                const button = document.getElementById(type + 'Beat');
                button.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 100);
                
                // 挑战模式增速
                if (this.currentMode === 'challenge' && this.beatCount % 16 === 0) {
                    this.bpm += 5;
                    this.restartBeats();
                }
            }

            showAccuracyFeedback(accuracy) {
                const indicator = document.getElementById('beatIndicator');
                
                if (accuracy > 90) {
                    indicator.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
                    indicator.textContent = '🎯';
                } else if (accuracy > 70) {
                    indicator.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
                    indicator.textContent = '♪';
                } else {
                    indicator.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
                    indicator.textContent = '✗';
                }
                
                setTimeout(() => {
                    indicator.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
                    indicator.textContent = '♪';
                }, 300);
            }

            restartBeats() {
                if (this.beatInterval) {
                    clearInterval(this.beatInterval);
                }
                this.startBeats();
                this.updateDisplay();
            }

            updateBeatDisplay() {
                const indicator = document.getElementById('beatIndicator');
                indicator.classList.add('active');
                
                setTimeout(() => {
                    indicator.classList.remove('active');
                }, 100);
                
                this.updatePatternDisplay();
            }

            pauseGame() {
                if (!this.gameActive) return;
                
                if (this.gamePaused) {
                    // 继续游戏
                    this.gamePaused = false;
                    this.gameStartTime = Date.now() - (this.gameStartTime - this.gamePauseTime);
                    document.getElementById('pauseBtn').textContent = '⏸️ 暂停';
                } else {
                    // 暂停游戏
                    this.gamePaused = true;
                    this.gamePauseTime = Date.now() - this.gameStartTime;
                    document.getElementById('pauseBtn').textContent = '▶️ 继续';
                }
            }

            resetGame() {
                this.gameActive = false;
                this.gamePaused = false;
                
                if (this.beatInterval) {
                    clearInterval(this.beatInterval);
                    this.beatInterval = null;
                }
                
                if (this.gameInterval) {
                    clearInterval(this.gameInterval);
                    this.gameInterval = null;
                }
                
                this.score = 0;
                this.combo = 0;
                this.beatCount = 0;
                this.accurateBeats = 0;
                this.totalBeats = 0;
                this.currentBeat = 0;
                this.patternIndex = 0;
                
                this.bpm = this.modes[this.currentMode].bpm;
                
                document.getElementById('pauseBtn').textContent = '⏸️ 暂停';
                this.updateDisplay();
                this.createPattern();
            }

            endGame() {
                this.gameActive = false;
                
                if (this.beatInterval) {
                    clearInterval(this.beatInterval);
                    this.beatInterval = null;
                }
                
                if (this.gameInterval) {
                    clearInterval(this.gameInterval);
                    this.gameInterval = null;
                }
                
                const finalAccuracy = this.totalBeats > 0 ? Math.round((this.accurateBeats / this.totalBeats) * 100) : 0;
                
                document.getElementById('finalScore').textContent = this.score;
                document.getElementById('finalAccuracy').textContent = finalAccuracy + '%';
                document.getElementById('finalCombo').textContent = this.maxCombo;
                document.getElementById('finalBeatCount').textContent = this.beatCount;
                document.getElementById('completeOverlay').style.display = 'flex';
                
                this.updateDisplay();
            }

            createPattern() {
                const patternDisplay = document.getElementById('patternDisplay');
                const pattern = this.modes[this.currentMode].pattern;
                
                patternDisplay.innerHTML = '';
                
                pattern.forEach((beat, index) => {
                    const beatElement = document.createElement('div');
                    beatElement.className = 'pattern-beat';
                    
                    if (beat === 2) {
                        beatElement.classList.add('strong');
                        beatElement.textContent = '●';
                    } else if (beat === 1) {
                        beatElement.classList.add('weak');
                        beatElement.textContent = '○';
                    } else {
                        beatElement.textContent = '◦';
                    }
                    
                    patternDisplay.appendChild(beatElement);
                });
            }

            updatePatternDisplay() {
                const patternBeats = document.querySelectorAll('.pattern-beat');
                const currentIndex = this.patternIndex % patternBeats.length;
                
                patternBeats.forEach((beat, index) => {
                    beat.classList.remove('current');
                    if (index === currentIndex) {
                        beat.classList.add('current');
                    }
                });
            }

            showSettings() {
                const newBpm = prompt('设置BPM (60-200):', this.bpm);
                if (newBpm && newBpm >= 60 && newBpm <= 200) {
                    this.bpm = parseInt(newBpm);
                    if (this.gameActive) {
                        this.restartBeats();
                    }
                    this.updateDisplay();
                }
            }

            updateDisplay() {
                document.getElementById('score').textContent = this.score;
                document.getElementById('combo').textContent = this.combo;
                document.getElementById('beatCount').textContent = this.beatCount;
                document.getElementById('bpmDisplay').textContent = this.bpm + ' BPM';
                
                const accuracy = this.totalBeats > 0 ? Math.round((this.accurateBeats / this.totalBeats) * 100) : 100;
                document.getElementById('accuracy').textContent = accuracy + '%';
                document.getElementById('accuracyText').textContent = `准确率: ${accuracy}%`;
                document.getElementById('accuracyFill').style.width = accuracy + '%';
            }

            closeComplete() {
                document.getElementById('completeOverlay').style.display = 'none';
            }
        }

        // 全局游戏实例
        let beatMaster;

        // 初始化游戏
        document.addEventListener('DOMContentLoaded', () => {
            beatMaster = new BeatMaster();
        });