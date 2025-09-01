class FlightSimulator {
    constructor() {
        this.aircraft = {
            altitude: 0,
            speed: 0,
            heading: 0,
            fuel: 100,
            pitch: 0,
            roll: 0,
            throttle: 0,
            rudder: 0
        };
        
        this.flight = {
            time: 0,
            distance: 0,
            maxAltitude: 0,
            avgSpeed: 0,
            rating: 3,
            isFlying: false
        };
        
        this.mission = {
            type: 'basic',
            title: '基础飞行训练',
            objective: '保持平稳飞行5分钟',
            progress: 0,
            target: 300, // 5分钟 = 300秒
            completed: false
        };
        
        this.weather = {
            windDirection: '北风',
            windSpeed: 5,
            visibility: 10,
            cloudCover: '少云'
        };
        
        this.controls = {
            stickX: 0,
            stickY: 0,
            isDragging: false
        };
        
        this.autopilot = false;
        this.logEntries = [];
        
        this.initializeGame();
        this.bindEvents();
        this.startGameLoop();
    }
    
    initializeGame() {
        this.updateDisplay();
        this.generateClouds();
        this.addLogEntry('飞行模拟器启动');
        this.addLogEntry('准备起飞');
        this.generateWeather();
    }
    
    bindEvents() {
        // 操纵杆控制
        const stickArea = document.getElementById('stickArea');
        const controlStick = document.getElementById('controlStick');
        
        stickArea.addEventListener('mousedown', (e) => this.startStickDrag(e));
        document.addEventListener('mousemove', (e) => this.updateStickPosition(e));
        document.addEventListener('mouseup', () => this.endStickDrag());
        
        // 触摸支持
        stickArea.addEventListener('touchstart', (e) => this.startStickDrag(e.touches[0]));
        document.addEventListener('touchmove', (e) => this.updateStickPosition(e.touches[0]));
        document.addEventListener('touchend', () => this.endStickDrag());
        
        // 油门和方向舵
        document.getElementById('throttleSlider').addEventListener('input', (e) => {
            this.aircraft.throttle = parseInt(e.target.value);
            document.getElementById('throttleValue').textContent = e.target.value + '%';
        });
        
        document.getElementById('rudderSlider').addEventListener('input', (e) => {
            this.aircraft.rudder = parseInt(e.target.value);
            document.getElementById('rudderValue').textContent = e.target.value;
        });
        
        // 紧急控制
        document.getElementById('autopilotBtn').addEventListener('click', () => this.toggleAutopilot());
        document.getElementById('landingBtn').addEventListener('click', () => this.emergencyLanding());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetFlight());
    }
    
    startStickDrag(e) {
        this.controls.isDragging = true;
        const rect = document.getElementById('stickArea').getBoundingClientRect();
        this.controls.centerX = rect.left + rect.width / 2;
        this.controls.centerY = rect.top + rect.height / 2;
    }
    
    updateStickPosition(e) {
        if (!this.controls.isDragging) return;
        
        const maxDistance = 50; // 最大偏移距离
        const deltaX = e.clientX - this.controls.centerX;
        const deltaY = e.clientY - this.controls.centerY;
        
        // 限制在圆形区域内
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const limitedDistance = Math.min(distance, maxDistance);
        const angle = Math.atan2(deltaY, deltaX);
        
        const limitedX = Math.cos(angle) * limitedDistance;
        const limitedY = Math.sin(angle) * limitedDistance;
        
        // 更新操纵杆位置
        const controlStick = document.getElementById('controlStick');
        controlStick.style.transform = `translate(${limitedX - 50}%, ${limitedY - 50}%)`;
        
        // 更新飞机控制
        this.controls.stickX = limitedX / maxDistance; // -1 到 1
        this.controls.stickY = limitedY / maxDistance; // -1 到 1
        
        // 应用控制输入
        this.aircraft.roll = this.controls.stickX * 30; // 最大30度倾斜
        this.aircraft.pitch = -this.controls.stickY * 20; // 最大20度俯仰
    }
    
    endStickDrag() {
        this.controls.isDragging = false;
        
        // 操纵杆回中
        const controlStick = document.getElementById('controlStick');
        controlStick.style.transform = 'translate(-50%, -50%)';
        
        this.controls.stickX = 0;
        this.controls.stickY = 0;
        this.aircraft.roll = 0;
        this.aircraft.pitch = 0;
    }
    
    toggleAutopilot() {
        this.autopilot = !this.autopilot;
        const autopilotBtn = document.getElementById('autopilotBtn');
        
        if (this.autopilot) {
            autopilotBtn.textContent = '🤖 关闭自动驾驶';
            autopilotBtn.classList.add('active');
            this.addLogEntry('自动驾驶已启动');
        } else {
            autopilotBtn.textContent = '🤖 自动驾驶';
            autopilotBtn.classList.remove('active');
            this.addLogEntry('自动驾驶已关闭');
        }
    }
    
    emergencyLanding() {
        this.aircraft.throttle = 0;
        this.aircraft.pitch = -10;
        this.addLogEntry('执行紧急降落程序');
        
        // 自动降落
        const landingInterval = setInterval(() => {
            this.aircraft.altitude = Math.max(0, this.aircraft.altitude - 50);
            this.aircraft.speed = Math.max(0, this.aircraft.speed - 10);
            
            if (this.aircraft.altitude <= 0) {
                clearInterval(landingInterval);
                this.aircraft.speed = 0;
                this.flight.isFlying = false;
                this.addLogEntry('紧急降落完成');
            }
        }, 100);
    }
    
    resetFlight() {
        this.aircraft = {
            altitude: 0,
            speed: 0,
            heading: 0,
            fuel: 100,
            pitch: 0,
            roll: 0,
            throttle: 0,
            rudder: 0
        };
        
        this.flight = {
            time: 0,
            distance: 0,
            maxAltitude: 0,
            avgSpeed: 0,
            rating: 3,
            isFlying: false
        };
        
        this.mission.progress = 0;
        this.mission.completed = false;
        
        // 重置UI
        document.getElementById('throttleSlider').value = 0;
        document.getElementById('rudderSlider').value = 0;
        document.getElementById('throttleValue').textContent = '0%';
        document.getElementById('rudderValue').textContent = '0';
        
        this.addLogEntry('飞行重置完成');
        this.updateDisplay();
    }
    
    generateClouds() {
        const cloudsContainer = document.getElementById('cloudsContainer');
        cloudsContainer.innerHTML = '';
        
        for (let i = 0; i < 5; i++) {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.textContent = '☁️';
            cloud.style.top = Math.random() * 60 + '%';
            cloud.style.left = Math.random() * 100 + '%';
            cloud.style.animationDelay = Math.random() * 20 + 's';
            cloud.style.animationDuration = (Math.random() * 10 + 15) + 's';
            
            cloudsContainer.appendChild(cloud);
        }
    }
    
    generateWeather() {
        const directions = ['北风', '南风', '东风', '西风', '东北风', '西北风', '东南风', '西南风'];
        const cloudTypes = ['晴朗', '少云', '多云', '阴天'];
        
        this.weather.windDirection = directions[Math.floor(Math.random() * directions.length)];
        this.weather.windSpeed = Math.floor(Math.random() * 20) + 5;
        this.weather.visibility = Math.floor(Math.random() * 15) + 5;
        this.weather.cloudCover = cloudTypes[Math.floor(Math.random() * cloudTypes.length)];
        
        this.updateWeatherDisplay();
    }
    
    updateWeatherDisplay() {
        document.getElementById('windDirection').textContent = this.weather.windDirection;
        document.getElementById('windSpeed').textContent = this.weather.windSpeed + ' km/h';
        document.getElementById('visibility').textContent = this.weather.visibility + ' km';
        document.getElementById('cloudCover').textContent = this.weather.cloudCover;
    }
    
    addLogEntry(message) {
        const entry = {
            time: this.formatTime(this.flight.time),
            message: message
        };
        
        this.logEntries.unshift(entry);
        if (this.logEntries.length > 10) {
            this.logEntries.pop();
        }
        
        this.updateLogDisplay();
    }
    
    updateLogDisplay() {
        const logEntries = document.getElementById('logEntries');
        logEntries.innerHTML = '';
        
        this.logEntries.forEach(entry => {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            
            logEntry.innerHTML = `
                <div class="log-time">${entry.time}</div>
                <div class="log-message">${entry.message}</div>
            `;
            
            logEntries.appendChild(logEntry);
        });
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    updateFlightPhysics() {
        // 油门影响速度
        if (this.aircraft.throttle > 0) {
            this.aircraft.speed = Math.min(500, this.aircraft.speed + this.aircraft.throttle * 0.1);
            this.flight.isFlying = true;
        } else {
            this.aircraft.speed = Math.max(0, this.aircraft.speed - 2);
            if (this.aircraft.speed === 0) {
                this.flight.isFlying = false;
            }
        }
        
        // 速度影响高度变化
        if (this.aircraft.speed > 100) {
            this.aircraft.altitude = Math.max(0, this.aircraft.altitude + this.aircraft.pitch * 2);
        }
        
        // 方向舵影响航向
        this.aircraft.heading = (this.aircraft.heading + this.aircraft.rudder * 0.1) % 360;
        if (this.aircraft.heading < 0) this.aircraft.heading += 360;
        
        // 燃料消耗
        if (this.aircraft.throttle > 0) {
            this.aircraft.fuel = Math.max(0, this.aircraft.fuel - this.aircraft.throttle * 0.001);
        }
        
        // 自动驾驶
        if (this.autopilot) {
            this.aircraft.pitch = 0;
            this.aircraft.roll = 0;
            if (this.aircraft.altitude < 1000) {
                this.aircraft.throttle = Math.min(80, this.aircraft.throttle + 1);
            }
        }
        
        // 更新飞行统计
        if (this.flight.isFlying) {
            this.flight.time++;
            this.flight.distance += this.aircraft.speed / 3600; // 转换为公里
            this.flight.maxAltitude = Math.max(this.flight.maxAltitude, this.aircraft.altitude);
            this.flight.avgSpeed = this.flight.time > 0 ? (this.flight.distance / this.flight.time) * 3600 : 0;
        }
        
        // 任务进度
        if (this.mission.type === 'basic' && this.flight.isFlying && 
            this.aircraft.altitude > 500 && this.aircraft.speed > 150) {
            this.mission.progress = Math.min(this.mission.target, this.mission.progress + 1);
            
            if (this.mission.progress >= this.mission.target && !this.mission.completed) {
                this.mission.completed = true;
                this.addLogEntry('任务完成！基础飞行训练通过');
                this.flight.rating = 5;
            }
        }
    }
    
    updateVisualEffects() {
        // 更新地平线
        const horizonLine = document.getElementById('horizonLine');
        horizonLine.style.transform = `translateY(-50%) rotate(${this.aircraft.roll}deg)`;
        
        // 更新地面高度
        const ground = document.getElementById('ground');
        const groundHeight = Math.max(10, 50 - (this.aircraft.altitude / 100));
        ground.style.height = groundHeight + '%';
        
        // 更新天空颜色（根据高度）
        const skyView = document.getElementById('skyView');
        const skyBlue = Math.max(50, 135 - (this.aircraft.altitude / 100));
        skyView.style.background = `linear-gradient(to bottom, 
            hsl(200, 70%, ${skyBlue}%) 0%, 
            hsl(200, 70%, ${skyBlue}%) 50%, 
            hsl(120, 40%, 60%) 100%)`;
        
        // 更新飞行路径向量
        const flightPathVector = document.getElementById('flightPathVector');
        flightPathVector.style.transform = `translate(-50%, -50%) 
            translateX(${this.aircraft.roll}px) 
            translateY(${-this.aircraft.pitch}px)`;
    }
    
    updateInstruments() {
        // 更新仪表显示
        document.getElementById('altitude').textContent = Math.floor(this.aircraft.altitude);
        document.getElementById('speed').textContent = Math.floor(this.aircraft.speed);
        document.getElementById('fuel').textContent = Math.floor(this.aircraft.fuel) + '%';
        document.getElementById('heading').textContent = Math.floor(this.aircraft.heading) + '°';
        
        // 更新燃料条
        document.getElementById('fuelFill').style.width = this.aircraft.fuel + '%';
        
        // 更新指南针
        const compassNeedle = document.querySelector('.compass-needle');
        compassNeedle.style.transform = `translate(-50%, -100%) rotate(${this.aircraft.heading}deg)`;
    }
    
    updateDisplay() {
        this.updateInstruments();
        this.updateVisualEffects();
        
        // 更新任务进度
        const progressPercentage = (this.mission.progress / this.mission.target) * 100;
        document.getElementById('missionProgress').style.width = progressPercentage + '%';
        document.getElementById('progressText').textContent = Math.floor(progressPercentage) + '%';
        
        // 更新飞行统计
        document.getElementById('flightTime').textContent = this.formatTime(this.flight.time);
        document.getElementById('flightDistance').textContent = this.flight.distance.toFixed(1) + ' km';
        document.getElementById('maxAltitude').textContent = Math.floor(this.flight.maxAltitude) + ' m';
        document.getElementById('avgSpeed').textContent = Math.floor(this.flight.avgSpeed) + ' km/h';
        
        // 更新评分
        const stars = '⭐'.repeat(this.flight.rating);
        document.getElementById('flightRating').textContent = stars;
    }
    
    checkWarnings() {
        // 燃料警告
        if (this.aircraft.fuel < 20 && this.aircraft.fuel > 0) {
            this.addLogEntry('⚠️ 燃料不足警告');
        }
        
        // 失速警告
        if (this.aircraft.speed < 100 && this.aircraft.altitude > 100) {
            this.addLogEntry('⚠️ 失速警告');
        }
        
        // 高度警告
        if (this.aircraft.altitude > 5000) {
            this.addLogEntry('⚠️ 高度过高警告');
        }
    }
    
    startGameLoop() {
        setInterval(() => {
            this.updateFlightPhysics();
            this.updateDisplay();
            this.checkWarnings();
        }, 1000);
        
        // 高频率的视觉更新
        setInterval(() => {
            this.updateVisualEffects();
        }, 50);
        
        // 天气变化
        setInterval(() => {
            this.generateWeather();
        }, 60000); // 每分钟更新天气
        
        // 云层更新
        setInterval(() => {
            this.generateClouds();
        }, 30000); // 每30秒更新云层
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new FlightSimulator();
});