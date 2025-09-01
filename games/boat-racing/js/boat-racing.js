/**
 * 赛艇游戏 - 扁平化设计实现
 * 方向舵控制，浪花阻力克服，风向影响，燃油管理
 */

class BoatRacingGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.gameState = 'menu'; // menu, playing, paused, finished
        this.gameStartTime = 0;
        this.isGameRunning = false;
        
        // 赛艇属性
        this.boat = {
            x: 100,
            y: 250,
            width: 60,
            height: 20,
            speed: 0,
            maxSpeed: 15,
            acceleration: 0.2,
            angle: 0,
            turnSpeed: 0.08,
            fuel: 100,
            fuelConsumption: 0.1
        };
        
        // 水域环境
        this.water = {
            type: 'waves',
            waveHeight: 5,
            currentStrength: 2,
            visibility: 10
        };
        
        // 风向系统
        this.wind = {
            direction: 0, // 0-360度
            speed: 5,
            changeTimer: 0
        };
        
        // AI对手
        this.opponents = [];
        this.generateOpponents();
        
        // 障碍物（岛屿、浮标等）
        this.obstacles = [];
        this.generateObstacles();
        
        // 游戏数据
        this.gameData = {
            distance: 0,
            rank: 1,
            totalDistance: 50, // 50海里
            avgSpeed: 0,
            maxSpeed: 0,
            fuelEfficiency: 0,
            routeOptimization: 100,
            startTime: 0
        };
        
        // 控制状态
        this.keys = {};
        this.waterType = 'waves';
        
        // 天气系统
        this.weather = {
            condition: 'sunny',
            temperature: 22,
            visibility: 10,
            waveHeight: 0.5
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
        document.getElementById('waterSelect').addEventListener('change', (e) => {
            this.waterType = e.target.value;
            this.adjustWaterConditions();
        });
        
        // 方向盘控制
        const steeringWheel = document.getElementById('steeringWheel');
        const throttleSlider = document.getElementById('throttleSlider');
        
        steeringWheel.addEventListener('click', (e) => {
            const rect = steeringWheel.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            this.boat.angle = angle;
        });
        
        throttleSlider.addEventListener('input', (e) => {
            const throttle = parseFloat(e.target.value) / 100;
            this.boat.speed = this.boat.maxSpeed * throttle;
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
            turboBtn: ' '
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
    
    adjustWaterConditions() {
        const conditions = {
            calm: { waveHeight: 1, currentStrength: 0.5, visibility: 15 },
            waves: { waveHeight: 5, currentStrength: 2, visibility: 10 },
            storm: { waveHeight: 15, currentStrength: 8, visibility: 3 },
            rapids: { waveHeight: 8, currentStrength: 12, visibility: 8 }
        };
        
        const condition = conditions[this.waterType];
        this.water.waveHeight = condition.waveHeight;
        this.water.currentStrength = condition.currentStrength;
        this.water.visibility = condition.visibility;
        
        this.updateWeatherDisplay();
    }
    
    generateOpponents() {
        this.opponents = [];
        for (let i = 0; i < 5; i++) {
            this.opponents.push({
                x: 80 + i * 30,
                y: 200 + Math.random() * 100,
                speed: 8 + Math.random() * 4,
                angle: 0,
                color: `hsl(${Math.random() * 360}, 70%, 50%)`
            });
        }
    }
    
    generateObstacles() {
        this.obstacles = [];
        const obstacleCount = Math.floor(Math.random() * 5) + 3;
        
        for (let i = 0; i < obstacleCount; i++) {
            this.obstacles.push({
                x: 200 + i * 150 + Math.random() * 100,
                y: 100 + Math.random() * 300,
                width: 30 + Math.random() * 20,
                height: 30 + Math.random() * 20,
                type: Math.random() < 0.5 ? 'island' : 'buoy'
            });
        }
    }
    
    initializeGame() {
        this.resetBoatPosition();
        this.updateWeatherDisplay();
        this.gameLoop();
    }
    
    resetBoatPosition() {
        this.boat.x = 100;
        this.boat.y = 250;
        this.boat.speed = 0;
        this.boat.angle = 0;
        this.boat.fuel = 100;
    }
    
    startGame() {
        if (this.gameState === 'menu') {
            this.gameState = 'playing';
            this.isGameRunning = true;
            this.gameStartTime = Date.now();
            this.gameData.startTime = this.gameStartTime;
            this.gameData.distance = 0;
            this.resetBoatPosition();
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
        this.resetBoatPosition();
        this.gameData.distance = 0;
        this.gameData.rank = 1;
        this.generateOpponents();
        this.hideModal();
        this.updateUI();
    }
    
    backToMenu() {
        this.resetGame();
    }
    
    updateBoatPhysics() {
        if (!this.isGameRunning) return;
        
        // 加速和减速
        if (this.keys['ArrowUp']) {
            this.boat.speed = Math.min(this.boat.speed + this.boat.acceleration, this.boat.maxSpeed);
        } else if (this.keys['ArrowDown']) {
            this.boat.speed = Math.max(this.boat.speed - this.boat.acceleration * 2, 0);
        } else {
            this.boat.speed *= 0.98; // 水阻减速
        }
        
        // 转向
        if (this.keys['ArrowLeft']) {
            this.boat.angle -= this.boat.turnSpeed * (this.boat.speed / this.boat.maxSpeed + 0.2);
        }
        if (this.keys['ArrowRight']) {
            this.boat.angle += this.boat.turnSpeed * (this.boat.speed / this.boat.maxSpeed + 0.2);
        }
        
        // 涡轮加速
        if (this.keys[' '] && this.boat.fuel > 0) {
            this.boat.speed = Math.min(this.boat.speed + this.boat.acceleration * 3, this.boat.maxSpeed * 1.5);
            this.boat.fuel -= this.boat.fuelConsumption * 5;
        }
        
        // 风向影响
        const windEffect = this.calculateWindEffect();
        this.boat.speed += windEffect.speedBonus;
        this.boat.angle += windEffect.angleAdjustment;
        
        // 波浪影响
        const waveEffect = this.calculateWaveEffect();
        this.boat.speed *= waveEffect.speedMultiplier;
        this.boat.y += waveEffect.verticalMovement;
        
        // 更新位置
        this.boat.x += Math.cos(this.boat.angle) * this.boat.speed;
        this.boat.y += Math.sin(this.boat.angle) * this.boat.speed;
        
        // 燃油消耗
        if (this.boat.speed > 0) {
            this.boat.fuel -= this.boat.fuelConsumption * (this.boat.speed / this.boat.maxSpeed);
            this.boat.fuel = Math.max(0, this.boat.fuel);
        }
        
        // 边界检测
        this.checkBoundaries();
        
        // 碰撞检测
        this.checkCollisions();
        
        // 更新对手
        this.updateOpponents();
        
        // 更新游戏数据
        this.updateGameData();
        
        // 更新风向
        this.updateWind();
        
        // 检查游戏结束条件
        this.checkGameOver();
    }
    
    calculateWindEffect() {
        const boatDirection = this.boat.angle;
        const windDirection = (this.wind.direction * Math.PI) / 180;
        const angleDiff = Math.abs(boatDirection - windDirection);
        
        let speedBonus = 0;
        let angleAdjustment = 0;
        
        // 顺风加速
        if (angleDiff < Math.PI / 4) {
            speedBonus = (this.wind.speed / 10) * (1 - angleDiff / (Math.PI / 4));
        }
        // 逆风减速
        else if (angleDiff > (3 * Math.PI) / 4) {
            speedBonus = -(this.wind.speed / 15) * (angleDiff - (3 * Math.PI) / 4) / (Math.PI / 4);
        }
        
        // 侧风影响方向
        if (angleDiff > Math.PI / 6 && angleDiff < (5 * Math.PI) / 6) {
            angleAdjustment = (this.wind.speed / 100) * Math.sin(angleDiff);
        }
        
        return { speedBonus, angleAdjustment };
    }
    
    calculateWaveEffect() {
        const waveIntensity = this.water.waveHeight / 10;
        const speedMultiplier = 1 - waveIntensity * 0.1;
        const verticalMovement = Math.sin(Date.now() / 200 + this.boat.x / 50) * waveIntensity;
        
        return { speedMultiplier, verticalMovement };
    }
    
    checkBoundaries() {
        if (this.boat.x < 0) this.boat.x = 0;
        if (this.boat.x > this.canvas.width - this.boat.width) this.boat.x = this.canvas.width - this.boat.width;
        if (this.boat.y < 0) this.boat.y = 0;
        if (this.boat.y > this.canvas.height - this.boat.height) this.boat.y = this.canvas.height - this.boat.height;
    }
    
    checkCollisions() {
        this.obstacles.forEach(obstacle => {
            const dx = this.boat.x - obstacle.x;
            const dy = this.boat.y - obstacle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 40) {
                // 碰撞处理
                this.boat.speed *= 0.3;
                this.boat.fuel -= 5;
                
                // 推开船只
                const angle = Math.atan2(dy, dx);
                this.boat.x = obstacle.x + Math.cos(angle) * 40;
                this.boat.y = obstacle.y + Math.sin(angle) * 40;
            }
        });
    }
    
    updateOpponents() {
        this.opponents.forEach(opponent => {
            // 简单AI：朝向终点航行
            const targetX = this.canvas.width;
            const targetY = opponent.y + (Math.random() - 0.5) * 20;
            
            const dx = targetX - opponent.x;
            const dy = targetY - opponent.y;
            const targetAngle = Math.atan2(dy, dx);
            
            opponent.angle += (targetAngle - opponent.angle) * 0.1;
            opponent.x += Math.cos(opponent.angle) * opponent.speed;
            opponent.y += Math.sin(opponent.angle) * opponent.speed;
            
            // 边界处理
            opponent.y = Math.max(50, Math.min(opponent.y, this.canvas.height - 50));
        });
    }
    
    updateGameData() {
        this.gameData.distance = this.boat.x / 16; // 转换为海里
        this.gameData.maxSpeed = Math.max(this.gameData.maxSpeed, this.boat.speed * 2); // 转换为节
        
        // 计算排名
        let rank = 1;
        this.opponents.forEach(opponent => {
            if (opponent.x > this.boat.x) rank++;
        });
        this.gameData.rank = rank;
        
        // 计算平均速度
        const elapsedTime = (Date.now() - this.gameData.startTime) / 1000;
        if (elapsedTime > 0) {
            this.gameData.avgSpeed = (this.gameData.distance / elapsedTime) * 3600; // 节/小时
        }
        
        // 燃油效率
        const fuelUsed = 100 - this.boat.fuel;
        if (fuelUsed > 0) {
            this.gameData.fuelEfficiency = this.gameData.distance / fuelUsed;
        }
    }
    
    updateWind() {
        this.wind.changeTimer++;
        if (this.wind.changeTimer > 300) { // 每5秒变化一次
            this.wind.direction += (Math.random() - 0.5) * 30;
            this.wind.direction = (this.wind.direction + 360) % 360;
            this.wind.speed = 3 + Math.random() * 7;
            this.wind.changeTimer = 0;
        }
    }
    
    checkGameOver() {
        if (this.boat.fuel <= 0) {
            this.gameOver('燃油耗尽！');
        } else if (this.gameData.distance >= this.gameData.totalDistance) {
            this.gameOver('比赛完成！');
        }
    }
    
    gameOver(reason) {
        this.gameState = 'finished';
        this.isGameRunning = false;
        this.showResultModal(reason);
    }
    
    updateWeatherDisplay() {
        const conditions = {
            calm: { icon: '☀️', desc: '风平浪静', waveHeight: '0.2m' },
            waves: { icon: '🌊', desc: '波浪适中', waveHeight: '0.5m' },
            storm: { icon: '⛈️', desc: '风暴来袭', waveHeight: '2.0m' },
            rapids: { icon: '🌪️', desc: '急流汹涌', waveHeight: '1.5m' }
        };
        
        const condition = conditions[this.waterType];
        document.getElementById('weatherIcon').textContent = condition.icon;
        document.getElementById('weatherDesc').textContent = condition.desc;
        document.getElementById('waveHeight').textContent = condition.waveHeight;
        document.getElementById('visibility').textContent = `${this.water.visibility}km`;
    }
    
    render() {
        // 清空画布 - 海洋背景
        this.ctx.fillStyle = '#00BCD4'; // ocean-blue
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制波浪效果
        this.drawWaves();
        
        // 绘制障碍物
        this.drawObstacles();
        
        // 绘制对手
        this.drawOpponents();
        
        // 绘制赛艇
        this.drawBoat();
        
        // 绘制终点线
        this.drawFinishLine();
        
        // 绘制UI元素
        this.drawUI();
    }
    
    drawWaves() {
        this.ctx.fillStyle = '#4DD0E1'; // wave-cyan
        const time = Date.now() / 500;
        
        for (let x = 0; x < this.canvas.width; x += 20) {
            const waveHeight = Math.sin(time + x / 30) * this.water.waveHeight;
            this.ctx.fillRect(x, this.canvas.height / 2 + waveHeight, 20, this.canvas.height);
        }
    }
    
    drawObstacles() {
        this.obstacles.forEach(obstacle => {
            if (obstacle.type === 'island') {
                // 岛屿
                this.ctx.fillStyle = '#795548'; // 棕色
                this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                this.ctx.strokeStyle = '#212121';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            } else {
                // 浮标
                this.ctx.fillStyle = '#FF5722'; // 橙色
                this.ctx.beginPath();
                this.ctx.arc(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2, obstacle.width/2, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = '#212121';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        });
    }
    
    drawOpponents() {
        this.opponents.forEach(opponent => {
            this.ctx.save();
            this.ctx.translate(opponent.x, opponent.y);
            this.ctx.rotate(opponent.angle);
            
            // 对手船只
            this.ctx.fillStyle = opponent.color;
            this.ctx.fillRect(-25, -8, 50, 16);
            this.ctx.strokeStyle = '#212121';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(-25, -8, 50, 16);
            
            this.ctx.restore();
        });
    }
    
    drawBoat() {
        this.ctx.save();
        this.ctx.translate(this.boat.x, this.boat.y);
        this.ctx.rotate(this.boat.angle);
        
        // 船体
        this.ctx.fillStyle = '#FFFFFF'; // boat-white
        this.ctx.fillRect(-this.boat.width/2, -this.boat.height/2, this.boat.width, this.boat.height);
        
        // 船体边框
        this.ctx.strokeStyle = '#212121';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-this.boat.width/2, -this.boat.height/2, this.boat.width, this.boat.height);
        
        // 船头标识
        this.ctx.fillStyle = '#00BCD4';
        this.ctx.fillRect(this.boat.width/2 - 10, -5, 10, 10);
        
        this.ctx.restore();
        
        // 尾迹效果
        if (this.boat.speed > 5) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            for (let i = 1; i <= 3; i++) {
                const trailX = this.boat.x - Math.cos(this.boat.angle) * i * 15;
                const trailY = this.boat.y - Math.sin(this.boat.angle) * i * 15;
                this.ctx.fillRect(trailX - 3, trailY - 1, 6, 2);
            }
        }
    }
    
    drawFinishLine() {
        const finishX = this.canvas.width - 50;
        this.ctx.fillStyle = '#FFC107'; // fuel-amber
        this.ctx.fillRect(finishX, 0, 5, this.canvas.height);
        
        // 终点标识
        this.ctx.fillStyle = '#212121';
        this.ctx.font = 'bold 16px Microsoft YaHei';
        this.ctx.fillText('终点', finishX - 30, 30);
    }
    
    drawUI() {
        // 绘制速度表
        const speed = Math.round(this.boat.speed * 2);
        this.ctx.fillStyle = '#212121';
        this.ctx.font = 'bold 16px Microsoft YaHei';
        this.ctx.fillText(`航速: ${speed} 节`, 20, 30);
        
        // 绘制燃油表
        this.ctx.fillText(`燃油: ${Math.round(this.boat.fuel)}%`, 20, 55);
        
        // 绘制距离
        this.ctx.fillText(`航程: ${this.gameData.distance.toFixed(1)} 海里`, 20, 80);
        
        // 绘制排名
        this.ctx.fillText(`排名: ${this.gameData.rank}/6`, 20, 105);
        
        // 游戏状态提示
        if (this.gameState === 'paused') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 24px Microsoft YaHei';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('游戏暂停', this.canvas.width/2, this.canvas.height/2);
            this.ctx.textAlign = 'left';
        }
    }
    
    updateUI() {
        // 更新HTML UI元素
        document.getElementById('speed').textContent = Math.round(this.boat.speed * 2);
        document.getElementById('fuel').textContent = Math.round(this.boat.fuel);
        document.getElementById('distance').textContent = this.gameData.distance.toFixed(1);
        document.getElementById('rank').textContent = this.gameData.rank;
        
        document.getElementById('avgSpeed').textContent = `${this.gameData.avgSpeed.toFixed(1)} 节`;
        document.getElementById('maxSpeed').textContent = `${this.gameData.maxSpeed.toFixed(1)} 节`;
        document.getElementById('fuelEfficiency').textContent = `${this.gameData.fuelEfficiency.toFixed(2)} 海里/升`;
        document.getElementById('routeOptimization').textContent = `${this.gameData.routeOptimization}%`;
        
        // 更新燃油条
        const fuelFill = document.getElementById('fuelFill');
        if (fuelFill) {
            fuelFill.style.width = `${this.boat.fuel}%`;
            fuelFill.style.backgroundColor = this.boat.fuel > 30 ? '#FFC107' : '#F44336';
        }
        
        // 更新风向指示器
        document.getElementById('windDirection').textContent = this.getWindDirectionText();
        document.getElementById('windSpeed').textContent = Math.round(this.wind.speed);
        
        const windArrow = document.getElementById('windArrow');
        if (windArrow) {
            windArrow.style.transform = `rotate(${this.wind.direction}deg)`;
        }
    }
    
    getWindDirectionText() {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(this.wind.direction / 45) % 8;
        return directions[index];
    }
    
    showResultModal(reason) {
        const modal = document.getElementById('gameModal');
        
        document.getElementById('resultTitle').textContent = `🚤 ${reason}`;
        document.getElementById('finalRank').textContent = this.getRankText(this.gameData.rank);
        
        const elapsedTime = (Date.now() - this.gameData.startTime) / 1000;
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = Math.floor(elapsedTime % 60);
        document.getElementById('finalTime').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('finalAvgSpeed').textContent = `${this.gameData.avgSpeed.toFixed(1)} 节`;
        document.getElementById('finalFuel').textContent = `${Math.round(this.boat.fuel)}%`;
        
        // 计算评级
        const rating = this.calculateRating();
        document.getElementById('finalRating').textContent = rating;
        
        modal.style.display = 'block';
    }
    
    hideModal() {
        document.getElementById('gameModal').style.display = 'none';
    }
    
    getRankText(rank) {
        const rankTexts = ['1st', '2nd', '3rd', '4th', '5th', '6th'];
        return rankTexts[rank - 1] || `${rank}th`;
    }
    
    calculateRating() {
        let stars = 1;
        
        if (this.gameData.rank === 1) stars += 2;
        else if (this.gameData.rank <= 2) stars += 1;
        
        if (this.boat.fuel > 50) stars += 1;
        if (this.gameData.avgSpeed > 15) stars += 1;
        
        return '⭐'.repeat(Math.min(stars, 5));
    }
    
    gameLoop() {
        this.updateBoatPhysics();
        this.render();
        this.updateUI();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new BoatRacingGame();
});