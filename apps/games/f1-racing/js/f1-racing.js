/**
 * F1赛车游戏 - 扁平化设计实现
 * 遵循Material Design原则，无装饰效果
 */

class F1RacingGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.gameState = 'menu'; // menu, playing, paused, finished
        this.gameStartTime = 0;
        this.currentTime = 0;
        this.isGameRunning = false;
        
        // 车辆属性
        this.car = {
            x: 400,
            y: 500,
            width: 40,
            height: 80,
            speed: 0,
            maxSpeed: 8,
            acceleration: 0.3,
            deceleration: 0.2,
            angle: 0,
            turnSpeed: 0.15
        };
        
        // 赛道属性
        this.track = {
            centerX: 400,
            centerY: 300,
            radiusX: 250,
            radiusY: 150,
            width: 120
        };
        
        // 障碍物
        this.obstacles = [];
        this.generateObstacles();
        
        // 比赛数据
        this.raceData = {
            currentLap: 1,
            totalLaps: 3,
            lapTimes: [],
            bestLapTime: null,
            totalTime: 0,
            maxSpeed: 0,
            avgSpeed: 0,
            checkpoints: []
        };
        
        // 控制状态
        this.keys = {};
        this.difficulty = 'normal';
        
        // 小地图
        this.minimap = {
            scale: 0.25,
            offsetX: 50,
            offsetY: 50
        };
        
        this.initializeEventListeners();
        this.initializeGame();
    }
    
    initializeEventListeners() {
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ') e.preventDefault();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // 按钮事件
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('difficultySelect').addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.adjustDifficulty();
        });
        
        // 触屏控制
        this.initializeTouchControls();
        
        // 模态框按钮
        document.getElementById('playAgainBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('backToMenuBtn').addEventListener('click', () => this.backToMenu());
    }
    
    initializeTouchControls() {
        const touchControls = {
            accelerateBtn: 'ArrowUp',
            brakeBtn: 'ArrowDown',
            leftBtn: 'ArrowLeft',
            rightBtn: 'ArrowRight',
            handbrakeBtn: ' '
        };
        
        Object.entries(touchControls).forEach(([btnId, key]) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.keys[key] = true;
                });
                btn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.keys[key] = false;
                });
                btn.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    this.keys[key] = true;
                });
                btn.addEventListener('mouseup', (e) => {
                    e.preventDefault();
                    this.keys[key] = false;
                });
            }
        });
    }
    
    adjustDifficulty() {
        const settings = {
            easy: { maxSpeed: 6, obstacleCount: 3, turnSpeed: 0.2 },
            normal: { maxSpeed: 8, obstacleCount: 5, turnSpeed: 0.15 },
            hard: { maxSpeed: 10, obstacleCount: 8, turnSpeed: 0.12 },
            extreme: { maxSpeed: 12, obstacleCount: 12, turnSpeed: 0.1 }
        };
        
        const setting = settings[this.difficulty];
        this.car.maxSpeed = setting.maxSpeed;
        this.car.turnSpeed = setting.turnSpeed;
        
        this.obstacles = [];
        this.generateObstacles(setting.obstacleCount);
    }
    
    generateObstacles(count = 5) {
        this.obstacles = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const radius = this.track.radiusX - 30 + Math.random() * 60;
            this.obstacles.push({
                x: this.track.centerX + Math.cos(angle) * radius,
                y: this.track.centerY + Math.sin(angle) * radius * 0.6,
                width: 20,
                height: 20,
                type: Math.random() < 0.5 ? 'cone' : 'barrier'
            });
        }
    }
    
    initializeGame() {
        this.resetCarPosition();
        this.generateCheckpoints();
        this.gameLoop();
    }
    
    resetCarPosition() {
        this.car.x = this.track.centerX + this.track.radiusX - 60;
        this.car.y = this.track.centerY;
        this.car.speed = 0;
        this.car.angle = -Math.PI / 2;
    }
    
    generateCheckpoints() {
        this.raceData.checkpoints = [];
        const checkpointCount = 8;
        for (let i = 0; i < checkpointCount; i++) {
            const angle = (i / checkpointCount) * Math.PI * 2;
            this.raceData.checkpoints.push({
                x: this.track.centerX + Math.cos(angle) * this.track.radiusX,
                y: this.track.centerY + Math.sin(angle) * this.track.radiusY,
                passed: false,
                angle: angle
            });
        }
    }
    
    startGame() {
        if (this.gameState === 'menu') {
            this.gameState = 'playing';
            this.isGameRunning = true;
            this.gameStartTime = Date.now();
            this.raceData.currentLap = 1;
            this.raceData.lapTimes = [];
            this.updateUI();
        }
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.isGameRunning = false;
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.isGameRunning = true;
        }
    }
    
    resetGame() {
        this.gameState = 'menu';
        this.isGameRunning = false;
        this.resetCarPosition();
        this.raceData.currentLap = 1;
        this.raceData.lapTimes = [];
        this.raceData.totalTime = 0;
        this.raceData.maxSpeed = 0;
        this.generateCheckpoints();
        this.hideModal();
        this.updateUI();
    }
    
    backToMenu() {
        this.resetGame();
        // 可以添加返回主菜单的逻辑
    }
    
    updateCarPhysics() {
        if (!this.isGameRunning) return;
        
        // 加速和减速
        if (this.keys['ArrowUp']) {
            this.car.speed = Math.min(this.car.speed + this.car.acceleration, this.car.maxSpeed);
        } else if (this.keys['ArrowDown'] || this.keys[' ']) {
            this.car.speed = Math.max(this.car.speed - this.car.deceleration * 2, 0);
        } else {
            this.car.speed = Math.max(this.car.speed - this.car.deceleration, 0);
        }
        
        // 转向（只有在移动时才能转向）
        if (this.car.speed > 0) {
            if (this.keys['ArrowLeft']) {
                this.car.angle -= this.car.turnSpeed * (this.car.speed / this.car.maxSpeed);
            }
            if (this.keys['ArrowRight']) {
                this.car.angle += this.car.turnSpeed * (this.car.speed / this.car.maxSpeed);
            }
        }
        
        // 更新位置
        this.car.x += Math.cos(this.car.angle) * this.car.speed;
        this.car.y += Math.sin(this.car.angle) * this.car.speed;
        
        // 边界检测
        this.checkTrackBounds();
        
        // 碰撞检测
        this.checkCollisions();
        
        // 检查点检测
        this.checkCheckpoints();
        
        // 更新统计数据
        this.updateRaceData();
    }
    
    checkTrackBounds() {
        const dx = this.car.x - this.track.centerX;
        const dy = this.car.y - this.track.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // 外边界
        if (distance > this.track.radiusX + this.track.width / 2) {
            const angle = Math.atan2(dy, dx);
            this.car.x = this.track.centerX + Math.cos(angle) * (this.track.radiusX + this.track.width / 2);
            this.car.y = this.track.centerY + Math.sin(angle) * (this.track.radiusX + this.track.width / 2);
            this.car.speed *= 0.5; // 碰撞减速
        }
        
        // 内边界
        if (distance < this.track.radiusX - this.track.width / 2) {
            const angle = Math.atan2(dy, dx);
            this.car.x = this.track.centerX + Math.cos(angle) * (this.track.radiusX - this.track.width / 2);
            this.car.y = this.track.centerY + Math.sin(angle) * (this.track.radiusX - this.track.width / 2);
            this.car.speed *= 0.5; // 碰撞减速
        }
    }
    
    checkCollisions() {
        this.obstacles.forEach(obstacle => {
            const dx = this.car.x - obstacle.x;
            const dy = this.car.y - obstacle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 30) {
                this.car.speed *= 0.3; // 严重减速
                // 推开车辆
                const angle = Math.atan2(dy, dx);
                this.car.x = obstacle.x + Math.cos(angle) * 30;
                this.car.y = obstacle.y + Math.sin(angle) * 30;
            }
        });
    }
    
    checkCheckpoints() {
        this.raceData.checkpoints.forEach((checkpoint, index) => {
            const dx = this.car.x - checkpoint.x;
            const dy = this.car.y - checkpoint.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 40 && !checkpoint.passed) {
                checkpoint.passed = true;
                
                // 检查是否完成一圈
                if (this.raceData.checkpoints.every(cp => cp.passed)) {
                    this.completeLap();
                }
            }
        });
    }
    
    completeLap() {
        const lapTime = Date.now() - this.gameStartTime;
        this.raceData.lapTimes.push(lapTime);
        
        if (!this.raceData.bestLapTime || lapTime < this.raceData.bestLapTime) {
            this.raceData.bestLapTime = lapTime;
        }
        
        this.raceData.currentLap++;
        
        // 重置检查点
        this.raceData.checkpoints.forEach(cp => cp.passed = false);
        
        if (this.raceData.currentLap > this.raceData.totalLaps) {
            this.finishRace();
        } else {
            this.gameStartTime = Date.now(); // 重置圈速计时
        }
    }
    
    finishRace() {
        this.gameState = 'finished';
        this.isGameRunning = false;
        this.showResultModal();
    }
    
    updateRaceData() {
        this.currentTime = Date.now() - this.gameStartTime;
        this.raceData.totalTime = this.raceData.lapTimes.reduce((sum, time) => sum + time, 0) + this.currentTime;
        
        // 更新最大速度
        const currentSpeedKmh = Math.round(this.car.speed * 20);
        if (currentSpeedKmh > this.raceData.maxSpeed) {
            this.raceData.maxSpeed = currentSpeedKmh;
        }
        
        // 计算平均速度
        if (this.raceData.totalTime > 0) {
            this.raceData.avgSpeed = Math.round(this.raceData.maxSpeed * 0.7);
        }
    }
    
    render() {
        // 清空画布
        this.ctx.fillStyle = '#FAFAFA';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制赛道（扁平化设计）
        this.drawTrack();
        
        // 绘制障碍物
        this.drawObstacles();
        
        // 绘制检查点
        this.drawCheckpoints();
        
        // 绘制车辆
        this.drawCar();
        
        // 绘制UI元素
        this.drawUI();
    }
    
    drawTrack() {
        // 外圈
        this.ctx.beginPath();
        this.ctx.ellipse(this.track.centerX, this.track.centerY, 
                        this.track.radiusX + this.track.width/2, 
                        this.track.radiusY + this.track.width/2, 
                        0, 0, Math.PI * 2);
        this.ctx.fillStyle = '#607D8B'; // track-grey
        this.ctx.fill();
        
        // 内圈（赛道）
        this.ctx.beginPath();
        this.ctx.ellipse(this.track.centerX, this.track.centerY, 
                        this.track.radiusX - this.track.width/2, 
                        this.track.radiusY - this.track.width/2, 
                        0, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FAFAFA'; // background-white
        this.ctx.fill();
        
        // 赛道边界线
        this.ctx.beginPath();
        this.ctx.ellipse(this.track.centerX, this.track.centerY, 
                        this.track.radiusX + this.track.width/2, 
                        this.track.radiusY + this.track.width/2, 
                        0, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#212121';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.ellipse(this.track.centerX, this.track.centerY, 
                        this.track.radiusX - this.track.width/2, 
                        this.track.radiusY - this.track.width/2, 
                        0, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // 起终点线
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(this.track.centerX + this.track.radiusX - 5, this.track.centerY - 30, 10, 60);
        this.ctx.strokeStyle = '#212121';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(this.track.centerX + this.track.radiusX - 5, this.track.centerY - 30, 10, 60);
    }
    
    drawObstacles() {
        this.obstacles.forEach(obstacle => {
            if (obstacle.type === 'cone') {
                // 锥形障碍物
                this.ctx.fillStyle = '#FF9800'; // warning-orange
                this.ctx.beginPath();
                this.ctx.moveTo(obstacle.x, obstacle.y - 10);
                this.ctx.lineTo(obstacle.x - 10, obstacle.y + 10);
                this.ctx.lineTo(obstacle.x + 10, obstacle.y + 10);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.strokeStyle = '#212121';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            } else {
                // 方形障碍物
                this.ctx.fillStyle = '#757575'; // text-secondary
                this.ctx.fillRect(obstacle.x - 10, obstacle.y - 10, 20, 20);
                this.ctx.strokeStyle = '#212121';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(obstacle.x - 10, obstacle.y - 10, 20, 20);
            }
        });
    }
    
    drawCheckpoints() {
        this.raceData.checkpoints.forEach(checkpoint => {
            if (!checkpoint.passed) {
                this.ctx.fillStyle = '#4CAF50'; // speed-green
                this.ctx.beginPath();
                this.ctx.arc(checkpoint.x, checkpoint.y, 8, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = '#212121';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        });
    }
    
    drawCar() {
        this.ctx.save();
        this.ctx.translate(this.car.x, this.car.y);
        this.ctx.rotate(this.car.angle + Math.PI / 2);
        
        // 车身（扁平化矩形）
        this.ctx.fillStyle = '#F44336'; // race-red
        this.ctx.fillRect(-this.car.width/2, -this.car.height/2, this.car.width, this.car.height);
        
        // 车身边框
        this.ctx.strokeStyle = '#212121';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-this.car.width/2, -this.car.height/2, this.car.width, this.car.height);
        
        // 车前部标识
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(-8, -this.car.height/2, 16, 10);
        
        this.ctx.restore();
    }
    
    drawUI() {
        // 绘制速度表
        const speed = Math.round(this.car.speed * 20);
        this.ctx.fillStyle = '#212121';
        this.ctx.font = 'bold 20px Microsoft YaHei';
        this.ctx.fillText(`${speed} km/h`, 20, 40);
        
        // 绘制圈数
        this.ctx.fillText(`第 ${this.raceData.currentLap}/${this.raceData.totalLaps} 圈`, 20, 70);
        
        // 游戏状态提示
        if (this.gameState === 'paused') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 30px Microsoft YaHei';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('游戏暂停', this.canvas.width/2, this.canvas.height/2);
            this.ctx.textAlign = 'left';
        }
    }
    
    updateUI() {
        // 更新HTML UI元素
        document.getElementById('speed').textContent = Math.round(this.car.speed * 20);
        document.getElementById('lap').textContent = this.raceData.currentLap;
        document.getElementById('timer').textContent = this.formatTime(this.currentTime);
        document.getElementById('bestTime').textContent = this.raceData.bestLapTime ? 
            this.formatTime(this.raceData.bestLapTime) : '--:--';
        
        document.getElementById('currentLapTime').textContent = this.formatTime(this.currentTime);
        document.getElementById('fastestLap').textContent = this.raceData.bestLapTime ? 
            this.formatTime(this.raceData.bestLapTime) : '--:--';
        document.getElementById('avgSpeed').textContent = `${this.raceData.avgSpeed} km/h`;
        document.getElementById('maxSpeed').textContent = `${this.raceData.maxSpeed} km/h`;
        
        // 更新小地图车辆位置
        this.updateMinimap();
    }
    
    updateMinimap() {
        const minimapCar = document.getElementById('minimapCar');
        if (minimapCar) {
            const relativeX = ((this.car.x - this.track.centerX) / this.track.radiusX) * 40 + 50;
            const relativeY = ((this.car.y - this.track.centerY) / this.track.radiusY) * 40 + 50;
            minimapCar.style.left = `${relativeX}%`;
            minimapCar.style.top = `${relativeY}%`;
        }
    }
    
    showResultModal() {
        const modal = document.getElementById('gameModal');
        const totalTime = this.raceData.lapTimes.reduce((sum, time) => sum + time, 0);
        
        document.getElementById('finalTime').textContent = this.formatTime(totalTime);
        document.getElementById('finalFastestLap').textContent = this.formatTime(this.raceData.bestLapTime);
        document.getElementById('finalAvgSpeed').textContent = `${this.raceData.avgSpeed} km/h`;
        
        // 计算评级
        const rating = this.calculateRating();
        document.getElementById('finalRating').textContent = rating;
        
        modal.style.display = 'block';
    }
    
    hideModal() {
        document.getElementById('gameModal').style.display = 'none';
    }
    
    calculateRating() {
        const avgLapTime = this.raceData.lapTimes.reduce((sum, time) => sum + time, 0) / this.raceData.lapTimes.length;
        const baseTime = 30000; // 30秒基准时间
        
        if (avgLapTime < baseTime * 0.8) return '⭐⭐⭐⭐⭐';
        if (avgLapTime < baseTime) return '⭐⭐⭐⭐';
        if (avgLapTime < baseTime * 1.2) return '⭐⭐⭐';
        if (avgLapTime < baseTime * 1.5) return '⭐⭐';
        return '⭐';
    }
    
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const ms = Math.floor((milliseconds % 1000) / 10);
        return `${seconds.toString().padStart(2, '0')}:${ms.toString().padStart(2, '0')}`;
    }
    
    gameLoop() {
        this.updateCarPhysics();
        this.render();
        this.updateUI();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new F1RacingGame();
});