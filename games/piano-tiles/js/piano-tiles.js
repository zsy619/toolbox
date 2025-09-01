class PianoGame {
    constructor() {
        this.gameActive = false;
        this.currentSong = 'twinkle';
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.speed = 1.0;
        this.totalNotes = 0;
        this.hitNotes = 0;
        this.missedNotes = 0;
        this.tiles = [];
        this.columns = 4;
        this.tileHeight = 80;
        this.fallSpeed = 2;
        this.gameTime = 0;
        this.gameInterval = null;
        this.spawnInterval = null;
        this.hitLine = 80; // 命中线高度
        
        // 音符频率 (Hz) - 用于Web Audio API
        this.noteFrequencies = {
            C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
            G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25
        };
        
        // 曲目定义
        this.songs = {
            twinkle: {
                name: '小星星',
                notes: [
                    {col: 0, delay: 0}, {col: 0, delay: 500}, {col: 2, delay: 1000}, {col: 2, delay: 1500},
                    {col: 3, delay: 2000}, {col: 3, delay: 2500}, {col: 2, delay: 3000},
                    {col: 1, delay: 3500}, {col: 1, delay: 4000}, {col: 0, delay: 4500}, {col: 0, delay: 5000},
                    {col: 2, delay: 5500}, {col: 2, delay: 6000}, {col: 1, delay: 6500}, {col: 1, delay: 7000}, {col: 0, delay: 7500}
                ]
            },
            happy: {
                name: '生日快乐',
                notes: [
                    {col: 0, delay: 0}, {col: 0, delay: 500}, {col: 1, delay: 1000}, {col: 0, delay: 1500},
                    {col: 3, delay: 2000}, {col: 2, delay: 2500}, {col: 0, delay: 3000}, {col: 0, delay: 3500},
                    {col: 1, delay: 4000}, {col: 0, delay: 4500}, {col: 3, delay: 5000}, {col: 3, delay: 5500}
                ]
            },
            canon: {
                name: '卡农',
                notes: [
                    {col: 0, delay: 0}, {col: 2, delay: 400}, {col: 1, delay: 800}, {col: 3, delay: 1200},
                    {col: 0, delay: 1600}, {col: 1, delay: 2000}, {col: 2, delay: 2400}, {col: 0, delay: 2800},
                    {col: 2, delay: 3200}, {col: 1, delay: 3600}, {col: 3, delay: 4000}, {col: 2, delay: 4400}
                ]
            }
        };
        
        this.currentNoteIndex = 0;
        this.gameStartTime = 0;
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateDisplay();
        this.setupAudio();
    }
    
    setupAudio() {
        // 初始化Web Audio API
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (!this.gameActive) return;
            
            let column = -1;
            switch(e.key) {
                case '1': column = 0; break;
                case '2': column = 1; break;
                case '3': column = 2; break;
                case '4': column = 3; break;
            }
            
            if (column >= 0) {
                this.hitColumn(column);
            }
        });
        
        // 触屏/鼠标事件
        document.querySelectorAll('.piano-column').forEach((col, index) => {
            col.addEventListener('click', () => {
                if (this.gameActive) {
                    this.hitColumn(index);
                }
            });
            
            col.addEventListener('mousedown', () => {
                col.classList.add('active');
            });
            
            col.addEventListener('mouseup', () => {
                col.classList.remove('active');
            });
            
            col.addEventListener('mouseleave', () => {
                col.classList.remove('active');
            });
        });
    }
    
    selectSong(songKey) {
        if (this.gameActive) return;
        
        this.currentSong = songKey;
        
        // 更新按钮状态
        document.querySelectorAll('.song-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[onclick*="${songKey}"]`).classList.add('active');
    }
    
    startGame() {
        if (this.gameActive) return;
        
        this.gameActive = true;
        this.score = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.speed = 1.0;
        this.totalNotes = 0;
        this.hitNotes = 0;
        this.missedNotes = 0;
        this.currentNoteIndex = 0;
        this.gameTime = 0;
        this.tiles = [];
        this.gameStartTime = Date.now();
        
        // 清空棋盘
        document.querySelectorAll('.piano-tile').forEach(tile => tile.remove());
        
        // 更新按钮状态
        document.getElementById('pauseBtn').disabled = false;
        
        // 开始游戏循环
        this.gameInterval = setInterval(() => this.gameLoop(), 16); // 60 FPS
        this.spawnInterval = setInterval(() => this.spawnTiles(), 800 / this.speed);
        
        this.updateDisplay();
    }
    
    pauseGame() {
        if (!this.gameActive) return;
        
        this.gameActive = false;
        
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
        
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
        
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = '▶️ 继续';
        pauseBtn.onclick = () => this.resumeGame();
    }
    
    resumeGame() {
        this.gameActive = true;
        
        this.gameInterval = setInterval(() => this.gameLoop(), 16);
        this.spawnInterval = setInterval(() => this.spawnTiles(), 800 / this.speed);
        
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = '⏸️ 暂停';
        pauseBtn.onclick = () => this.pauseGame();
    }
    
    resetGame() {
        this.gameActive = false;
        
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
        
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
        
        // 清空所有瓦片
        document.querySelectorAll('.piano-tile').forEach(tile => tile.remove());
        this.tiles = [];
        
        // 重置状态
        this.score = 0;
        this.combo = 0;
        this.speed = 1.0;
        this.currentNoteIndex = 0;
        
        // 重置按钮
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = '⏸️ 暂停';
        pauseBtn.onclick = () => this.pauseGame();
        pauseBtn.disabled = true;
        
        this.updateDisplay();
    }
    
    spawnTiles() {
        if (!this.gameActive) return;
        
        const song = this.songs[this.currentSong];
        const currentTime = Date.now() - this.gameStartTime;
        
        // 检查是否需要生成新的音符
        while (this.currentNoteIndex < song.notes.length) {
            const note = song.notes[this.currentNoteIndex];
            if (currentTime >= note.delay - 2000) { // 提前2秒生成
                this.createTile(note.col);
                this.currentNoteIndex++;
                this.totalNotes++;
            } else {
                break;
            }
        }
        
        // 随机生成额外音符（增加难度）
        if (Math.random() < 0.3) {
            const randomCol = Math.floor(Math.random() * this.columns);
            this.createTile(randomCol);
            this.totalNotes++;
        }
    }
    
    createTile(column) {
        const tile = document.createElement('div');
        tile.className = 'piano-tile';
        tile.style.top = '-80px';
        tile.dataset.column = column;
        tile.dataset.hit = 'false';
        
        const columnElement = document.querySelector(`[data-key="${column}"]`);
        columnElement.appendChild(tile);
        
        this.tiles.push({
            element: tile,
            column: column,
            y: -80,
            hit: false
        });
    }
    
    gameLoop() {
        if (!this.gameActive) return;
        
        this.moveTiles();
        this.checkMissedTiles();
        this.updateSpeed();
        this.updateDisplay();
    }
    
    moveTiles() {
        this.tiles.forEach((tile, index) => {
            tile.y += this.fallSpeed * this.speed;
            tile.element.style.top = tile.y + 'px';
            
            // 移除超出边界的瓦片
            if (tile.y > 500) {
                tile.element.remove();
                this.tiles.splice(index, 1);
            }
        });
    }
    
    checkMissedTiles() {
        const hitLineY = 400 - this.hitLine; // 命中线位置
        
        this.tiles.forEach((tile, index) => {
            if (!tile.hit && tile.y > hitLineY + 50) {
                // 错过了音符
                tile.element.classList.add('missed');
                tile.hit = true;
                this.missedNotes++;
                this.combo = 0;
                
                // 播放错误音效
                this.playErrorSound();
                
                setTimeout(() => {
                    if (tile.element && tile.element.parentNode) {
                        tile.element.remove();
                    }
                    const tileIndex = this.tiles.indexOf(tile);
                    if (tileIndex > -1) {
                        this.tiles.splice(tileIndex, 1);
                    }
                }, 200);
                
                // 检查游戏是否结束
                if (this.missedNotes >= 5) {
                    this.endGame();
                }
            }
        });
    }
    
    hitColumn(column) {
        const hitLineY = 400 - this.hitLine;
        let hitTile = null;
        let bestDistance = Infinity;
        
        // 找到最接近命中线的瓦片
        this.tiles.forEach(tile => {
            if (tile.column === column && !tile.hit) {
                const distance = Math.abs(tile.y - hitLineY);
                if (distance < bestDistance && distance < 60) {
                    bestDistance = distance;
                    hitTile = tile;
                }
            }
        });
        
        if (hitTile) {
            this.hitTile(hitTile, bestDistance);
        } else {
            // 错误点击
            this.combo = 0;
            this.playErrorSound();
            
            // 视觉反馈
            const column_element = document.querySelector(`[data-key="${column}"]`);
            column_element.style.background = 'rgba(244, 67, 54, 0.3)';
            setTimeout(() => {
                column_element.style.background = '';
            }, 200);
        }
    }
    
    hitTile(tile, distance) {
        tile.hit = true;
        tile.element.classList.add('hit');
        tile.element.classList.add('hit-animation');
        
        // 计算分数
        let points = 100;
        if (distance < 20) points = 150; // Perfect
        else if (distance < 40) points = 120; // Good
        
        this.score += points * (1 + this.combo * 0.1);
        this.combo++;
        this.hitNotes++;
        
        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }
        
        // 连击特效
        if (this.combo > 5) {
            document.getElementById('combo').classList.add('combo-effect');
            setTimeout(() => {
                document.getElementById('combo').classList.remove('combo-effect');
            }, 300);
        }
        
        // 播放音效
        this.playNote(tile.column);
        
        // 移除瓦片
        setTimeout(() => {
            if (tile.element && tile.element.parentNode) {
                tile.element.remove();
            }
            const tileIndex = this.tiles.indexOf(tile);
            if (tileIndex > -1) {
                this.tiles.splice(tileIndex, 1);
            }
        }, 200);
    }
    
    playNote(column) {
        if (!this.audioContext) return;
        
        const frequencies = [
            this.noteFrequencies.C4,
            this.noteFrequencies.E4,
            this.noteFrequencies.G4,
            this.noteFrequencies.C5
        ];
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequencies[column], this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
    
    playErrorSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }
    
    updateSpeed() {
        // 根据分数逐渐增加速度
        const newSpeed = 1.0 + Math.floor(this.score / 1000) * 0.2;
        if (newSpeed !== this.speed) {
            this.speed = Math.min(newSpeed, 3.0);
            
            // 更新生成间隔
            if (this.spawnInterval) {
                clearInterval(this.spawnInterval);
                this.spawnInterval = setInterval(() => this.spawnTiles(), 800 / this.speed);
            }
        }
    }
    
    endGame() {
        this.gameActive = false;
        
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
        
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
        
        // 计算准确率
        const accuracy = this.totalNotes > 0 ? Math.round((this.hitNotes / this.totalNotes) * 100) : 0;
        
        // 显示游戏结束弹窗
        document.getElementById('finalScore').textContent = Math.floor(this.score);
        document.getElementById('maxCombo').textContent = this.maxCombo;
        document.getElementById('accuracy').textContent = accuracy + '%';
        document.getElementById('gameOverPopup').classList.add('show');
        
        // 重置按钮状态
        document.getElementById('pauseBtn').disabled = true;
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = '⏸️ 暂停';
        pauseBtn.onclick = () => this.pauseGame();
    }
    
    closeGameOver() {
        document.getElementById('gameOverPopup').classList.remove('show');
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = Math.floor(this.score);
        document.getElementById('combo').textContent = this.combo;
        document.getElementById('speed').textContent = this.speed.toFixed(1) + 'x';
    }
}

// 全局变量供HTML onclick调用
let pianoGame;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    pianoGame = new PianoGame();
});