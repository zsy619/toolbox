/**
 * 飞机竞速游戏 - 扁平化设计实现
 * 3D空间移动，高度气压影响，云层视觉效果，气流湍流模拟
 */

class PlaneRacingGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 游戏状态
        this.gameState = 'menu'; // menu, playing, paused, finished
        this.gameStartTime = 0;
        this.isGameRunning = false;
        
        // 飞机属性
        this.plane = {
            x: 100,
            y: 300,
            z: 1000, // 高度
            width: 50,
            height: 20,
            speed: 0,
            maxSpeed: 20,
            acceleration: 0.3,
            angle: 0,
            pitch: 0, // 俯仰角
            roll: 0,  // 翻滚角
            fuel: 100,
            fuelConsumption: 0.05
        };
        
        // 3D透视参数
        this.camera = {
            x: 0,
            y: 0,
            z: 0,
            fov: 60,
            distance: 500
        };
        
        // 环境系统
        this.environment = {
            type: 'cloudy',
            windSpeed: 15,
            windDirection: 90,
            turbulence: 0.2,
            visibility: 50,
            pressure: 1013
        };
        
        // 云层系统
        this.clouds = [];
        this.generateClouds();
        
        // AI对手
        this.opponents = [];
        this.generateOpponents();
        
        // 检查点系统
        this.checkpoints = [];
        this.generateCheckpoints();
        
        // 游戏数据
        this.gameData = {
            distance: 0,
            rank: 1,
            totalDistance: 100, // 100km
            avgSpeed: 0,
            maxSpeed: 0,
            maxAltitude: 1000,
            cruiseSpeed: 0,
            fuelEfficiency: 0,
            startTime: 0,
            checkpointsPassed: 0
        };
        
        // 控制状态
        this.keys = {};
        this.environmentType = 'cloudy';
        
        // 物理常量
        this.gravity = 0.1;
        this.airDensity = 1.0;
        this.stallSpeed = 5;
        
        // 飞行日志
        this.flightLog = [];
        
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
        document.getElementById('environmentSelect').addEventListener('change', (e) => {
            this.environmentType = e.target.value;
            this.adjustEnvironment();
        });
        
        // 触屏控制
        this.initializeTouchControls();
        
        // 模态框按钮
        document.getElementById('playAgainBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('backToMenuBtn').addEventListener('click', () => this.backToMenu());
    }
    
    initializeTouchControls() {
        const touchControls = {
            climbBtn: 'ArrowUp',
            diveBtn: 'ArrowDown',
            leftBtn: 'ArrowLeft',
            rightBtn: 'ArrowRight',
            afterburnerBtn: ' '
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
    
    adjustEnvironment() {
        const environments = {
            clear: { windSpeed: 10, turbulence: 0.1, visibility: 100, pressure: 1020 },
            cloudy: { windSpeed: 15, turbulence: 0.2, visibility: 50, pressure: 1013 },
            storm: { windSpeed: 35, turbulence: 0.8, visibility: 10, pressure: 995 },
            night: { windSpeed: 8, turbulence: 0.05, visibility: 25, pressure: 1018 }
        };
        
        const env = environments[this.environmentType];
        this.environment.windSpeed = env.windSpeed;
        this.environment.turbulence = env.turbulence;
        this.environment.visibility = env.visibility;
        this.environment.pressure = env.pressure;
        
        this.updateWeatherDisplay();
        this.generateClouds();
    }
    
    generateClouds() {
        this.clouds = [];
        const cloudCount = this.environmentType === 'clear' ? 5 : 
                          this.environmentType === 'storm' ? 20 : 10;
        
        for (let i = 0; i < cloudCount; i++) {
            this.clouds.push({
                x: Math.random() * 2000,
                y: 100 + Math.random() * 400,
                z: 500 + Math.random() * 2000,
                size: 30 + Math.random() * 50,
                opacity: 0.3 + Math.random() * 0.4,
                speed: 0.5 + Math.random() * 1.5
            });
        }
    }
    
    generateOpponents() {
        this.opponents = [];
        for (let i = 0; i < 7; i++) {
            this.opponents.push({
                x: 80 + i * 40,
                y: 250 + Math.random() * 100,
                z: 800 + Math.random() * 400,
                speed: 12 + Math.random() * 6,
                angle: 0,
                pitch: 0,
                color: `hsl(${Math.random() * 360}, 70%, 50%)`
            });
        }
    }
    
    generateCheckpoints() {
        this.checkpoints = [];
        for (let i = 1; i <= 10; i++) {
            this.checkpoints.push({
                x: i * 200,
                y: 200 + Math.sin(i) * 100,
                z: 1000 + Math.cos(i) * 200,
                width: 100,
                height: 100,
                passed: false,
                id: i
            });
        }
    }
    
    initializeGame() {
        this.resetPlanePosition();
        this.updateWeatherDisplay();
        this.addFlightLog('起飞准备完成');
        this.gameLoop();
    }
    
    resetPlanePosition() {
        this.plane.x = 100;
        this.plane.y = 300;
        this.plane.z = 1000;
        this.plane.speed = 0;
        this.plane.angle = 0;
        this.plane.pitch = 0;
        this.plane.roll = 0;
        this.plane.fuel = 100;
        this.camera.x = 0;
        this.camera.y = 0;
        this.camera.z = 0;
    }
    
    startGame() {
        if (this.gameState === 'menu') {
            this.gameState = 'playing';
            this.isGameRunning = true;
            this.gameStartTime = Date.now();
            this.gameData.startTime = this.gameStartTime;
            this.gameData.distance = 0;
            this.gameData.checkpointsPassed = 0;
            this.resetPlanePosition();
            this.addFlightLog('起飞开始');
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
        this.resetPlanePosition();
        this.gameData.distance = 0;
        this.gameData.rank = 1;
        this.gameData.checkpointsPassed = 0;
        this.generateOpponents();
        this.generateCheckpoints();
        this.flightLog = [];
        this.addFlightLog('起飞准备完成');
        this.hideModal();
        this.updateUI();
    }
    
    backToMenu() {
        this.resetGame();
    }
    
    updatePlanePhysics() {
        if (!this.isGameRunning) return;
        
        // 油门控制
        if (this.keys['ArrowUp']) {
            this.plane.speed = Math.min(this.plane.speed + this.plane.acceleration, this.plane.maxSpeed);
        } else if (this.keys['ArrowDown']) {
            this.plane.speed = Math.max(this.plane.speed - this.plane.acceleration, 0);
        }
        
        // 俯仰控制
        if (this.keys['ArrowUp']) {
            this.plane.pitch = Math.max(this.plane.pitch - 0.05, -0.5);
        } else if (this.keys['ArrowDown']) {
            this.plane.pitch = Math.min(this.plane.pitch + 0.05, 0.5);
        } else {
            this.plane.pitch *= 0.95; // 自动回中
        }
        
        // 方向控制
        if (this.keys['ArrowLeft']) {
            this.plane.angle += 0.03;
            this.plane.roll = Math.max(this.plane.roll - 0.1, -0.3);
        } else if (this.keys['ArrowRight']) {
            this.plane.angle -= 0.03;
            this.plane.roll = Math.min(this.plane.roll + 0.1, 0.3);
        } else {
            this.plane.roll *= 0.9;
        }
        
        // 加力燃烧室
        if (this.keys[' '] && this.plane.fuel > 0) {
            this.plane.speed = Math.min(this.plane.speed + this.plane.acceleration * 2, this.plane.maxSpeed * 1.5);
            this.plane.fuel -= this.plane.fuelConsumption * 5;
        }
        
        // 高度影响
        const altitudeEffect = this.calculateAltitudeEffects();
        this.plane.speed *= altitudeEffect.airDensity;
        
        // 风力影响
        const windEffect = this.calculateWindEffect();
        this.plane.speed += windEffect.speedChange;
        this.plane.angle += windEffect.directionChange;
        
        // 湍流影响
        if (this.environment.turbulence > 0.1) {
            this.plane.y += (Math.random() - 0.5) * this.environment.turbulence * 10;
            this.plane.pitch += (Math.random() - 0.5) * this.environment.turbulence * 0.1;
        }
        
        // 失速检测
        if (this.plane.speed < this.stallSpeed && this.plane.z > 100) {
            this.plane.z -= 5; // 失速下降
            this.addFlightLog('警告：飞机失速');
        }
        
        // 更新位置
        this.plane.x += Math.cos(this.plane.angle) * this.plane.speed;
        this.plane.y += Math.sin(this.plane.pitch) * this.plane.speed * 0.5;
        this.plane.z += Math.sin(this.plane.pitch) * this.plane.speed * 2;
        
        // 高度限制
        this.plane.z = Math.max(50, Math.min(this.plane.z, 5000));
        
        // 燃油消耗
        if (this.plane.speed > 0) {
            this.plane.fuel -= this.plane.fuelConsumption * (this.plane.speed / this.plane.maxSpeed);
            this.plane.fuel = Math.max(0, this.plane.fuel);
        }
        
        // 更新摄像机
        this.camera.x = this.plane.x - 200;
        this.camera.y = this.plane.y;
        this.camera.z = this.plane.z;
        
        // 更新对手
        this.updateOpponents();
        
        // 检查点检测
        this.checkCheckpoints();
        
        // 更新游戏数据
        this.updateGameData();
        
        // 检查游戏结束条件
        this.checkGameOver();
    }
    
    calculateAltitudeEffects() {
        const altitude = this.plane.z;
        const airDensity = Math.max(0.4, 1 - (altitude - 1000) / 10000);
        const oxygenLevel = Math.max(0.5, 1 - altitude / 15000);
        
        return { airDensity, oxygenLevel };
    }
    
    calculateWindEffect() {
        const windAngle = (this.environment.windDirection * Math.PI) / 180;
        const planeAngle = this.plane.angle;
        const angleDiff = windAngle - planeAngle;
        
        const speedChange = Math.cos(angleDiff) * (this.environment.windSpeed / 100);
        const directionChange = Math.sin(angleDiff) * (this.environment.windSpeed / 1000);
        
        return { speedChange, directionChange };
    }
    
    updateOpponents() {
        this.opponents.forEach(opponent => {
            // 简单AI：向前飞行并调整高度
            opponent.x += opponent.speed;
            opponent.y += (Math.random() - 0.5) * 2;
            opponent.z += (Math.random() - 0.5) * 10;
            
            // 保持在合理高度范围
            opponent.z = Math.max(500, Math.min(opponent.z, 2000));
            opponent.y = Math.max(100, Math.min(opponent.y, 500));
        });
    }
    
    checkCheckpoints() {
        this.checkpoints.forEach(checkpoint => {
            if (!checkpoint.passed) {
                const dx = this.plane.x - checkpoint.x;
                const dy = this.plane.y - checkpoint.y;
                const dz = this.plane.z - checkpoint.z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                
                if (distance < 80) {
                    checkpoint.passed = true;
                    this.gameData.checkpointsPassed++;
                    this.addFlightLog(`通过检查点 ${checkpoint.id}`);
                }
            }
        });
    }
    
    updateGameData() {
        this.gameData.distance = this.plane.x / 10; // 转换为km
        this.gameData.maxSpeed = Math.max(this.gameData.maxSpeed, this.plane.speed * 50); // 转换为马赫
        this.gameData.maxAltitude = Math.max(this.gameData.maxAltitude, this.plane.z);
        
        // 计算排名
        let rank = 1;
        this.opponents.forEach(opponent => {
            if (opponent.x > this.plane.x) rank++;
        });
        this.gameData.rank = rank;
        
        // 计算平均速度
        const elapsedTime = (Date.now() - this.gameData.startTime) / 1000;
        if (elapsedTime > 0) {
            this.gameData.avgSpeed = (this.gameData.distance / elapsedTime) * 3600; // km/h转马赫
            this.gameData.cruiseSpeed = this.gameData.avgSpeed * 0.0008; // 转换为马赫数
        }
        
        // 燃料效率
        const fuelUsed = 100 - this.plane.fuel;
        if (fuelUsed > 0) {
            this.gameData.fuelEfficiency = this.gameData.distance / fuelUsed;
        }
    }
    
    checkGameOver() {
        if (this.plane.fuel <= 0) {
            this.gameOver('燃料耗尽，紧急迫降！');
        } else if (this.plane.z < 50) {
            this.gameOver('高度过低，撞地事故！');
        } else if (this.gameData.checkpointsPassed >= 10) {
            this.gameOver('成功完成飞行任务！');
        }
    }
    
    gameOver(reason) {
        this.gameState = 'finished';
        this.isGameRunning = false;
        this.addFlightLog(reason);
        this.showResultModal(reason);
    }
    
    addFlightLog(message) {
        const timestamp = new Date().toLocaleTimeString();
        this.flightLog.push(`[${timestamp}] ${message}`);
        
        // 更新UI中的日志显示
        const logContainer = document.getElementById('flightLog');
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = `[${timestamp}] ${message}`;
        logContainer.appendChild(logEntry);
        
        // 保持最新10条记录
        while (logContainer.children.length > 10) {
            logContainer.removeChild(logContainer.firstChild);
        }
        
        // 滚动到底部
        logContainer.scrollTop = logContainer.scrollHeight;
    }
    
    updateWeatherDisplay() {
        const conditions = {
            clear: { icon: '☀️', desc: '晴空万里' },
            cloudy: { icon: '☁️', desc: '多云天气' },
            storm: { icon: '⛈️', desc: '雷暴天气' },
            night: { icon: '🌙', desc: '夜间飞行' }
        };
        
        const condition = conditions[this.environmentType];
        document.getElementById('weatherIcon').textContent = condition.icon;
        document.getElementById('weatherDesc').textContent = condition.desc;
        document.getElementById('windSpeed').textContent = `${this.environment.windSpeed} km/h`;
        document.getElementById('visibility').textContent = `${this.environment.visibility}km`;
        document.getElementById('pressure').textContent = `${this.environment.pressure} hPa`;
    }
    
    // 3D到2D投影
    project3D(x, y, z) {
        const relativeX = x - this.camera.x;
        const relativeY = y - this.camera.y;
        const relativeZ = z - this.camera.z;
        
        if (relativeZ <= 0) return null;
        
        const scale = this.camera.distance / relativeZ;
        const screenX = this.canvas.width / 2 + relativeX * scale;
        const screenY = this.canvas.height / 2 - relativeY * scale;
        
        return { x: screenX, y: screenY, scale: scale };
    }
    
    render() {
        // 清空画布 - 天空背景
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB'); // 天空蓝
        gradient.addColorStop(0.5, '#E0F6FF'); // 中间浅蓝
        gradient.addColorStop(1, '#87CEEB'); // 底部天空蓝
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制云层
        this.drawClouds();
        
        // 绘制检查点
        this.drawCheckpoints();
        
        // 绘制对手
        this.drawOpponents();
        
        // 绘制飞机
        this.drawPlane();
        
        // 绘制HUD
        this.drawHUD();
    }
    
    drawClouds() {
        this.clouds.forEach(cloud => {
            const projected = this.project3D(cloud.x, cloud.y, cloud.z);
            if (projected && projected.scale > 0.1) {
                this.ctx.save();
                this.ctx.globalAlpha = cloud.opacity;
                this.ctx.fillStyle = '#F5F5F5'; // cloud-white
                this.ctx.beginPath();
                this.ctx.arc(projected.x, projected.y, cloud.size * projected.scale, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
            
            // 云层移动
            cloud.x -= cloud.speed;
            if (cloud.x < this.camera.x - 500) {
                cloud.x = this.camera.x + 2000;
            }
        });
    }
    
    drawCheckpoints() {
        this.checkpoints.forEach(checkpoint => {
            if (!checkpoint.passed) {
                const projected = this.project3D(checkpoint.x, checkpoint.y, checkpoint.z);
                if (projected && projected.scale > 0.1) {
                    // 检查点环形
                    this.ctx.strokeStyle = '#FF9800'; // fuel-orange
                    this.ctx.lineWidth = 3;
                    this.ctx.beginPath();
                    this.ctx.arc(projected.x, projected.y, 50 * projected.scale, 0, Math.PI * 2);
                    this.ctx.stroke();
                    
                    // 检查点标识
                    this.ctx.fillStyle = '#FF9800';
                    this.ctx.font = 'bold 12px Microsoft YaHei';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText(`CP ${checkpoint.id}`, projected.x, projected.y - 60 * projected.scale);
                }
            }
        });
    }
    
    drawOpponents() {
        this.opponents.forEach(opponent => {
            const projected = this.project3D(opponent.x, opponent.y, opponent.z);
            if (projected && projected.scale > 0.1) {
                this.ctx.save();
                this.ctx.translate(projected.x, projected.y);
                this.ctx.scale(projected.scale, projected.scale);
                
                // 对手飞机
                this.ctx.fillStyle = opponent.color;
                this.ctx.fillRect(-20, -5, 40, 10);
                this.ctx.strokeStyle = '#212121';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(-20, -5, 40, 10);
                
                this.ctx.restore();
            }
        });
    }
    
    drawPlane() {
        // 玩家飞机总是在屏幕中心偏下位置
        const planeX = this.canvas.width / 2;
        const planeY = this.canvas.height * 0.7;
        
        this.ctx.save();
        this.ctx.translate(planeX, planeY);
        this.ctx.rotate(this.plane.roll);
        
        // 飞机机体
        this.ctx.fillStyle = '#CFD8DC'; // plane-silver
        this.ctx.fillRect(-this.plane.width/2, -this.plane.height/2, this.plane.width, this.plane.height);
        
        // 机体边框
        this.ctx.strokeStyle = '#212121';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-this.plane.width/2, -this.plane.height/2, this.plane.width, this.plane.height);
        
        // 机翼
        this.ctx.fillStyle = '#B0BEC5';
        this.ctx.fillRect(-15, -this.plane.height/2 - 10, 30, 8);
        this.ctx.fillRect(-15, this.plane.height/2 + 2, 30, 8);
        
        // 机头
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(this.plane.width/2 - 5, -3, 8, 6);
        
        this.ctx.restore();
        
        // 引擎尾迹
        if (this.plane.speed > 10) {
            this.ctx.fillStyle = 'rgba(255, 152, 0, 0.6)';
            for (let i = 1; i <= 3; i++) {
                const trailX = planeX - i * 20;
                const trailY = planeY + (Math.random() - 0.5) * 10;
                this.ctx.fillRect(trailX - 5, trailY - 2, 10, 4);
            }
        }
    }
    
    drawHUD() {
        // HUD信息
        this.ctx.fillStyle = '#212121';
        this.ctx.font = 'bold 14px Microsoft YaHei';
        this.ctx.textAlign = 'left';
        
        // 左侧信息
        this.ctx.fillText(`空速: ${(this.plane.speed * 50).toFixed(0)} km/h`, 20, 30);
        this.ctx.fillText(`高度: ${this.plane.z.toFixed(0)} m`, 20, 55);
        this.ctx.fillText(`燃料: ${this.plane.fuel.toFixed(0)}%`, 20, 80);
        this.ctx.fillText(`距离: ${this.gameData.distance.toFixed(1)} km`, 20, 105);
        
        // 右侧信息
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`排名: ${this.gameData.rank}/8`, this.canvas.width - 20, 30);
        this.ctx.fillText(`检查点: ${this.gameData.checkpointsPassed}/10`, this.canvas.width - 20, 55);
        
        // 十字准星
        this.ctx.strokeStyle = '#FF9800';
        this.ctx.lineWidth = 2;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX - 20, centerY);
        this.ctx.lineTo(centerX + 20, centerY);
        this.ctx.moveTo(centerX, centerY - 20);
        this.ctx.lineTo(centerX, centerY + 20);
        this.ctx.stroke();
        
        // 游戏状态提示
        if (this.gameState === 'paused') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = 'bold 24px Microsoft YaHei';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('飞行暂停', this.canvas.width/2, this.canvas.height/2);
        }
        
        this.ctx.textAlign = 'left';
    }
    
    updateUI() {
        // 更新HTML UI元素
        document.getElementById('airspeed').textContent = (this.plane.speed * 0.05).toFixed(2);
        document.getElementById('altitude').textContent = Math.round(this.plane.z);
        document.getElementById('fuel').textContent = Math.round(this.plane.fuel);
        document.getElementById('rank').textContent = this.gameData.rank;
        
        document.getElementById('cruiseSpeed').textContent = `${this.gameData.cruiseSpeed.toFixed(3)} 马赫`;
        document.getElementById('maxSpeed').textContent = `${(this.gameData.maxSpeed * 0.001).toFixed(3)} 马赫`;
        document.getElementById('serviceAltitude').textContent = `${this.gameData.maxAltitude.toFixed(0)} m`;
        document.getElementById('fuelEfficiency').textContent = `${this.gameData.fuelEfficiency.toFixed(2)} km/L`;
        
        // 更新燃料条
        const fuelFill = document.getElementById('fuelFill');
        if (fuelFill) {
            fuelFill.style.width = `${this.plane.fuel}%`;
            fuelFill.style.backgroundColor = this.plane.fuel > 30 ? '#FF9800' : '#F44336';
        }
        
        // 更新高度表
        const altitudeScale = document.getElementById('altitudeScale');
        if (altitudeScale) {
            const marker = altitudeScale.querySelector('.altitude-marker');
            const percentage = Math.max(0, Math.min(100, (this.plane.z - 500) / 2000 * 100));
            marker.style.top = `${100 - percentage}%`;
            marker.textContent = `${Math.round(this.plane.z)}m`;
        }
        
        // 更新仪表
        this.updateInstruments();
    }
    
    updateInstruments() {
        // 更新罗盘
        const compassNeedle = document.getElementById('compassNeedle');
        if (compassNeedle) {
            compassNeedle.style.transform = `rotate(${this.plane.angle * 180 / Math.PI}deg)`;
        }
        
        // 更新水平仪
        const horizonLine = document.getElementById('horizonLine');
        if (horizonLine) {
            horizonLine.style.transform = `rotate(${this.plane.roll * 180 / Math.PI}deg)`;
        }
        
        // 更新空速表
        const speedNeedle = document.getElementById('speedNeedle');
        if (speedNeedle) {
            const speedAngle = (this.plane.speed / this.plane.maxSpeed) * 180 - 90;
            speedNeedle.style.transform = `rotate(${speedAngle}deg)`;
        }
    }
    
    showResultModal(reason) {
        const modal = document.getElementById('gameModal');
        
        document.getElementById('resultTitle').textContent = `✈️ ${reason}`;
        document.getElementById('finalRank').textContent = this.getRankText(this.gameData.rank);
        
        const elapsedTime = (Date.now() - this.gameData.startTime) / 1000;
        const hours = Math.floor(elapsedTime / 3600);
        const minutes = Math.floor((elapsedTime % 3600) / 60);
        const seconds = Math.floor(elapsedTime % 60);
        document.getElementById('finalTime').textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('finalAvgSpeed').textContent = `${this.gameData.cruiseSpeed.toFixed(3)} 马赫`;
        document.getElementById('finalMaxAltitude').textContent = `${this.gameData.maxAltitude.toFixed(0)} m`;
        document.getElementById('finalFuel').textContent = `${Math.round(this.plane.fuel)}%`;
        
        // 计算评级
        const rating = this.calculateRating();
        document.getElementById('finalRating').textContent = rating;
        
        modal.style.display = 'block';
    }
    
    hideModal() {
        document.getElementById('gameModal').style.display = 'none';
    }
    
    getRankText(rank) {
        const rankTexts = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
        return rankTexts[rank - 1] || `${rank}th`;
    }
    
    calculateRating() {
        let stars = 1;
        
        if (this.gameData.rank === 1) stars += 2;
        else if (this.gameData.rank <= 3) stars += 1;
        
        if (this.plane.fuel > 40) stars += 1;
        if (this.gameData.checkpointsPassed >= 8) stars += 1;
        if (this.gameData.maxAltitude > 2000) stars += 1;
        
        return '⭐'.repeat(Math.min(stars, 5));
    }
    
    gameLoop() {
        this.updatePlanePhysics();
        this.render();
        this.updateUI();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new PlaneRacingGame();
});