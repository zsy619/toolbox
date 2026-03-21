class FlappyBird {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.gameState = 'start'; // start, playing, gameOver, paused
        this.score = 0;
        this.gameStartTime = 0;
        this.gameTime = 0;
        this.pipesPassed = 0;
        
        // Settings with defaults
        this.settings = {
            difficulty: 'normal',
            pipeSpeed: 1.5,
            jumpForce: 8,
            birdColor: '#FFD700',
            backgroundTheme: 'day',
            pipeStyle: 'classic',
            soundEnabled: true,
            volume: 50
        };
        
        // Statistics
        this.stats = {
            totalGames: 0,
            totalScore: 0,
            totalPlayTime: 0,
            bestScores: {
                easy: 0,
                normal: 0,
                hard: 0,
                expert: 0
            }
        };
        
        // Difficulty settings
        this.difficulties = {
            easy: { gravity: 0.2, pipeGap: 200, name: '简单' },
            normal: { gravity: 0.35, pipeGap: 170, name: '普通' },
            hard: { gravity: 0.5, pipeGap: 140, name: '困难' },
            expert: { gravity: 0.65, pipeGap: 120, name: '专家' }
        };
        
        // Bird properties
        this.bird = {
            x: 120,
            y: 300,
            width: 35,
            height: 35,
            velocity: 0,
            rotation: 0
        };
        
        // Pipe properties
        this.pipes = [];
        this.pipeWidth = 80;
        
        // Background themes
        this.themes = {
            day: {
                sky: ['#87CEEB', '#98FB98'],
                ground: '#8B4513',
                grass: '#228B22'
            },
            sunset: {
                sky: ['#FF7F50', '#FFB347'],
                ground: '#8B4513',
                grass: '#228B22'
            },
            night: {
                sky: ['#191970', '#483D8B'],
                ground: '#2F4F4F',
                grass: '#006400'
            },
            space: {
                sky: ['#000000', '#1a1a2e'],
                ground: '#16213e',
                grass: '#0f3460'
            }
        };
        
        // Pipe styles
        this.pipeStyles = {
            classic: { color: '#228B22', capColor: '#32CD32' },
            metal: { color: '#708090', capColor: '#A9A9A9' },
            neon: { color: '#FF1493', capColor: '#FF69B4' },
            wood: { color: '#8B4513', capColor: '#CD853F' }
        };
        
        // Game loop
        this.animationFrame = null;
        this.lastTime = 0;
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.loadStats();
        this.updateUI();
        this.bindEvents();
        this.gameLoop();
    }
    
    loadSettings() {
        const saved = localStorage.getItem('flappy-settings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
        this.applySettings();
    }
    
    loadStats() {
        const saved = localStorage.getItem('flappy-stats');
        if (saved) {
            this.stats = { ...this.stats, ...JSON.parse(saved) };
        }
    }
    
    saveSettings() {
        localStorage.setItem('flappy-settings', JSON.stringify(this.settings));
    }
    
    saveStats() {
        localStorage.setItem('flappy-stats', JSON.stringify(this.stats));
    }
    
    applySettings() {
        // Apply difficulty settings
        const diff = this.difficulties[this.settings.difficulty];
        this.bird.gravity = diff.gravity;
        this.pipeGap = diff.pipeGap;
        this.bird.jump = -this.settings.jumpForce;
        this.pipeSpeed = this.settings.pipeSpeed;
        
        // Update UI elements
        document.getElementById('difficultySelect').value = this.settings.difficulty;
        document.getElementById('settingsDifficulty').value = this.settings.difficulty;
        document.getElementById('pipeSpeedSlider').value = this.settings.pipeSpeed;
        document.getElementById('pipeSpeedValue').textContent = this.settings.pipeSpeed;
        document.getElementById('jumpForceSlider').value = this.settings.jumpForce;
        document.getElementById('jumpForceValue').textContent = this.settings.jumpForce;
        document.getElementById('birdColorSelect').value = this.settings.birdColor;
        document.getElementById('backgroundTheme').value = this.settings.backgroundTheme;
        document.getElementById('pipeStyle').value = this.settings.pipeStyle;
        document.getElementById('soundEnabled').checked = this.settings.soundEnabled;
        document.getElementById('volumeSlider').value = this.settings.volume;
        document.getElementById('volumeValue').textContent = this.settings.volume + '%';
    }
    
    bindEvents() {
        // Game controls
        this.canvas.addEventListener('click', () => this.handleInput());
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
        document.getElementById('menuBtn').addEventListener('click', () => this.showMenu());
        document.getElementById('pauseMenuBtn').addEventListener('click', () => this.showMenu());
        document.getElementById('resumeBtn').addEventListener('click', () => this.resumeGame());
        
        // Control buttons
        document.getElementById('settingsBtn').addEventListener('click', () => this.showSettings());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('muteBtn').addEventListener('click', () => this.toggleMute());
        
        // Settings events
        document.getElementById('closeSettingsBtn').addEventListener('click', () => this.hideSettings());
        document.getElementById('saveSettingsBtn').addEventListener('click', () => this.saveSettingsAndApply());
        document.getElementById('resetStatsBtn').addEventListener('click', () => this.resetStats());
        
        // Difficulty selector
        document.getElementById('difficultySelect').addEventListener('change', (e) => {
            this.settings.difficulty = e.target.value;
        });
        
        // Settings sliders and selects
        document.getElementById('pipeSpeedSlider').addEventListener('input', (e) => {
            this.settings.pipeSpeed = parseFloat(e.target.value);
            document.getElementById('pipeSpeedValue').textContent = e.target.value;
        });
        
        document.getElementById('jumpForceSlider').addEventListener('input', (e) => {
            this.settings.jumpForce = parseInt(e.target.value);
            document.getElementById('jumpForceValue').textContent = e.target.value;
        });
        
        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            this.settings.volume = parseInt(e.target.value);
            document.getElementById('volumeValue').textContent = e.target.value + '%';
        });
        
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.gameState === 'paused') {
                    this.resumeGame();
                } else {
                    this.handleInput();
                }
            } else if (e.code === 'Escape') {
                if (this.gameState === 'playing') {
                    this.togglePause();
                }
            }
        });
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleInput();
        });
    }
    han
dleInput() {
        if (this.gameState === 'start') {
            // Don't start here, use start button
            return;
        } else if (this.gameState === 'playing') {
            this.bird.velocity = this.bird.jump;
            this.playSound('jump');
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.pipesPassed = 0;
        this.gameStartTime = Date.now();
        this.bird.y = 200;
        this.bird.velocity = 0;
        this.pipes = [];
        
        // Apply current settings
        this.applySettings();
        
        document.getElementById('startScreen').classList.add('hide');
        document.getElementById('gameOverScreen').classList.remove('show');
        document.getElementById('pauseScreen').classList.remove('show');
        
        // Generate first pipe
        this.generatePipe();
        this.playSound('start');
    }
    
    restart() {
        this.startGame();
    }
    
    showMenu() {
        this.gameState = 'start';
        document.getElementById('startScreen').classList.remove('hide');
        document.getElementById('gameOverScreen').classList.remove('show');
        document.getElementById('pauseScreen').classList.remove('show');
        document.getElementById('settingsScreen').classList.remove('show');
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseScreen').classList.add('show');
            document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-play"></i>';
        } else if (this.gameState === 'paused') {
            this.resumeGame();
        }
    }
    
    resumeGame() {
        this.gameState = 'playing';
        document.getElementById('pauseScreen').classList.remove('show');
        document.getElementById('pauseBtn').innerHTML = '<i class="fas fa-pause"></i>';
    }
    
    toggleMute() {
        this.settings.soundEnabled = !this.settings.soundEnabled;
        const muteBtn = document.getElementById('muteBtn');
        if (this.settings.soundEnabled) {
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            muteBtn.classList.remove('active');
        } else {
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            muteBtn.classList.add('active');
        }
        this.saveSettings();
    }
    
    showSettings() {
        document.getElementById('settingsScreen').classList.add('show');
        this.updateStatsDisplay();
    }
    
    hideSettings() {
        document.getElementById('settingsScreen').classList.remove('show');
    }
    
    saveSettingsAndApply() {
        // Get values from settings form
        this.settings.difficulty = document.getElementById('settingsDifficulty').value;
        this.settings.pipeSpeed = parseFloat(document.getElementById('pipeSpeedSlider').value);
        this.settings.jumpForce = parseInt(document.getElementById('jumpForceSlider').value);
        this.settings.birdColor = document.getElementById('birdColorSelect').value;
        this.settings.backgroundTheme = document.getElementById('backgroundTheme').value;
        this.settings.pipeStyle = document.getElementById('pipeStyle').value;
        this.settings.soundEnabled = document.getElementById('soundEnabled').checked;
        this.settings.volume = parseInt(document.getElementById('volumeSlider').value);
        
        this.saveSettings();
        this.applySettings();
        this.hideSettings();
        
        // Update mute button
        const muteBtn = document.getElementById('muteBtn');
        if (this.settings.soundEnabled) {
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            muteBtn.classList.remove('active');
        } else {
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            muteBtn.classList.add('active');
        }
    }
    
    resetStats() {
        if (confirm('确定要重置所有统计数据吗？此操作不可撤销。')) {
            this.stats = {
                totalGames: 0,
                totalScore: 0,
                totalPlayTime: 0,
                bestScores: {
                    easy: 0,
                    normal: 0,
                    hard: 0,
                    expert: 0
                }
            };
            this.saveStats();
            this.updateStatsDisplay();
        }
    }
    
    updateStatsDisplay() {
        document.getElementById('totalGames').textContent = this.stats.totalGames;
        document.getElementById('totalScore').textContent = this.stats.totalScore;
        document.getElementById('averageScore').textContent = 
            this.stats.totalGames > 0 ? Math.round(this.stats.totalScore / this.stats.totalGames) : 0;
        document.getElementById('totalPlayTime').textContent = 
            Math.round(this.stats.totalPlayTime / 60000) + '分钟';
    }
    
    generatePipe() {
        const minHeight = 50;
        const maxHeight = this.canvas.height - this.pipeGap - minHeight - 100;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        
        this.pipes.push({
            x: this.canvas.width,
            topHeight: topHeight,
            bottomY: topHeight + this.pipeGap,
            bottomHeight: this.canvas.height - topHeight - this.pipeGap - 100,
            passed: false
        });
    }
    
    updateBird() {
        if (this.gameState !== 'playing') return;
        
        // Apply gravity
        this.bird.velocity += this.bird.gravity;
        this.bird.y += this.bird.velocity;
        
        // Rotation based on velocity
        this.bird.rotation = Math.min(Math.max(this.bird.velocity * 3, -30), 90);
        
        // Check ground collision
        if (this.bird.y + this.bird.height > this.canvas.height - 100) {
            this.gameOver();
        }
        
        // Check ceiling collision
        if (this.bird.y < 0) {
            this.bird.y = 0;
            this.bird.velocity = 0;
        }
    }
    
    updatePipes() {
        if (this.gameState !== 'playing') return;
        
        // Move pipes
        for (let i = this.pipes.length - 1; i >= 0; i--) {
            const pipe = this.pipes[i];
            pipe.x -= this.pipeSpeed;
            
            // Check if bird passed the pipe
            if (!pipe.passed && pipe.x + this.pipeWidth < this.bird.x) {
                pipe.passed = true;
                this.score++;
                this.pipesPassed++;
                this.updateUI();
                this.playSound('score');
            }
            
            // Remove pipes that are off screen
            if (pipe.x + this.pipeWidth < 0) {
                this.pipes.splice(i, 1);
            }
            
            // Check collision
            if (this.checkCollision(pipe)) {
                this.gameOver();
            }
        }
        
        // Generate new pipe
        if (this.pipes.length === 0 || this.pipes[this.pipes.length - 1].x < this.canvas.width - 200) {
            this.generatePipe();
        }
    }
    
    checkCollision(pipe) {
        const birdLeft = this.bird.x;
        const birdRight = this.bird.x + this.bird.width;
        const birdTop = this.bird.y;
        const birdBottom = this.bird.y + this.bird.height;
        
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + this.pipeWidth;
        
        // Check if bird is within pipe's x range
        if (birdRight > pipeLeft && birdLeft < pipeRight) {
            // Check collision with top pipe
            if (birdTop < pipe.topHeight) {
                return true;
            }
            // Check collision with bottom pipe
            if (birdBottom > pipe.bottomY) {
                return true;
            }
        }
        
        return false;
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        this.gameTime = Math.round((Date.now() - this.gameStartTime) / 1000);
        
        // Update statistics
        this.stats.totalGames++;
        this.stats.totalScore += this.score;
        this.stats.totalPlayTime += (Date.now() - this.gameStartTime);
        
        // Update best score for current difficulty
        const currentBest = this.stats.bestScores[this.settings.difficulty];
        if (this.score > currentBest) {
            this.stats.bestScores[this.settings.difficulty] = this.score;
        }
        
        this.saveStats();
        this.playSound('gameOver');
        
        // Show game over screen
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('bestScore').textContent = this.stats.bestScores[this.settings.difficulty];
        document.getElementById('finalDifficulty').textContent = this.difficulties[this.settings.difficulty].name;
        document.getElementById('gameTime').textContent = this.gameTime;
        document.getElementById('pipesPassed').textContent = this.pipesPassed;
        document.getElementById('gameOverScreen').classList.add('show');
    }
    
    playSound(type) {
        if (!this.settings.soundEnabled) return;
        
        // Create audio context for sound effects
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            const volume = this.settings.volume / 100 * 0.1;
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
            
            switch (type) {
                case 'jump':
                    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
                    break;
                case 'score':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.2);
                    break;
                case 'gameOver':
                    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
                    break;
                case 'start':
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
                    break;
            }
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            // Fallback for browsers that don't support Web Audio API
            console.log('Sound effect:', type);
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.drawBackground();
        
        // Draw pipes
        this.drawPipes();
        
        // Draw bird
        this.drawBird();
        
        // Draw ground
        this.drawGround();
        
        // Draw effects
        this.drawEffects();
    }
    
    drawBackground() {
        const theme = this.themes[this.settings.backgroundTheme];
        
        // Sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height * 0.7);
        gradient.addColorStop(0, theme.sky[0]);
        gradient.addColorStop(1, theme.sky[1]);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height * 0.7);
        
        // Draw theme-specific elements
        if (this.settings.backgroundTheme === 'night' || this.settings.backgroundTheme === 'space') {
            this.drawStars();
        } else {
            this.drawClouds();
        }
    }
    
    drawStars() {
        this.ctx.fillStyle = 'white';
        const stars = [
            { x: 50, y: 50 }, { x: 150, y: 80 }, { x: 250, y: 60 },
            { x: 350, y: 90 }, { x: 100, y: 120 }, { x: 300, y: 40 }
        ];
        
        stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawClouds() {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        const clouds = [
            { x: 50, y: 80, size: 20 },
            { x: 200, y: 120, size: 25 },
            { x: 300, y: 60, size: 18 }
        ];
        
        clouds.forEach(cloud => {
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y, cloud.size, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + cloud.size, cloud.y, cloud.size * 0.8, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + cloud.size * 1.5, cloud.y, cloud.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
    
    drawBird() {
        this.ctx.save();
        
        // Move to bird center for rotation
        this.ctx.translate(this.bird.x + this.bird.width / 2, this.bird.y + this.bird.height / 2);
        this.ctx.rotate(this.bird.rotation * Math.PI / 180);
        
        // Draw bird body
        this.ctx.fillStyle = this.settings.birdColor;
        this.ctx.fillRect(-this.bird.width / 2, -this.bird.height / 2, this.bird.width, this.bird.height);
        
        // Draw bird eye
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(-5, -8, 6, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(-3, -8, 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Draw beak
        this.ctx.fillStyle = '#FF8C00';
        this.ctx.beginPath();
        this.ctx.moveTo(this.bird.width / 2, -3);
        this.ctx.lineTo(this.bird.width / 2 + 10, 0);
        this.ctx.lineTo(this.bird.width / 2, 3);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawPipes() {
        const style = this.pipeStyles[this.settings.pipeStyle];
        this.ctx.fillStyle = style.color;
        
        this.pipes.forEach(pipe => {
            // Top pipe
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.topHeight);
            
            // Bottom pipe
            this.ctx.fillRect(pipe.x, pipe.bottomY, this.pipeWidth, pipe.bottomHeight);
            
            // Pipe caps
            this.ctx.fillStyle = style.capColor;
            this.ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, this.pipeWidth + 10, 20);
            this.ctx.fillRect(pipe.x - 5, pipe.bottomY, this.pipeWidth + 10, 20);
            this.ctx.fillStyle = style.color;
        });
    }
    
    drawGround() {
        const theme = this.themes[this.settings.backgroundTheme];
        
        this.ctx.fillStyle = theme.ground;
        this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);
        
        // Grass
        this.ctx.fillStyle = theme.grass;
        this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 20);
    }
    
    drawEffects() {
        // Add particle effects or other visual enhancements here
        if (this.gameState === 'playing' && this.bird.velocity < -5) {
            // Wing flap effect
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.beginPath();
            this.ctx.arc(this.bird.x, this.bird.y + 15, 8, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = 
            '最高: ' + this.stats.bestScores[this.settings.difficulty];
    }
    
    gameLoop(currentTime = 0) {
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.updateBird();
        this.updatePipes();
        this.draw();
        
        this.animationFrame = requestAnimationFrame((time) => this.gameLoop(time));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FlappyBird();
});