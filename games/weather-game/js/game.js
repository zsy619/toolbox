class WeatherGame {
    constructor() {
        this.player = {
            accuracy: 0,
            score: 0,
            level: 1,
            streak: 0,
            totalPredictions: 0,
            correctPredictions: 0
        };
        
        this.currentWeather = {
            temperature: 25,
            humidity: 60,
            windSpeed: 5,
            pressure: 1013,
            condition: 'cloudy',
            icon: '☁️',
            description: '多云'
        };
        
        this.challenge = {
            location: '北京',
            correctWeather: 'sunny',
            correctMaxTemp: 28,
            correctMinTemp: 18,
            playerWeather: null,
            playerMaxTemp: 25,
            playerMinTemp: 15
        };
        
        this.weatherTypes = {
            sunny: { icon: '☀️', name: '晴天', description: '阳光明媚' },
            cloudy: { icon: '☁️', name: '多云', description: '云层较多' },
            rainy: { icon: '🌧️', name: '雨天', description: '降雨天气' },
            stormy: { icon: '⛈️', name: '暴风雨', description: '雷电交加' },
            snowy: { icon: '❄️', name: '雪天', description: '降雪天气' },
            foggy: { icon: '🌫️', name: '雾天', description: '能见度低' }
        };
        
        this.locations = ['北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '重庆', '西安', '武汉'];
        this.history = [];
        
        this.initializeGame();
        this.bindEvents();
        this.startGameLoop();
    }
    
    initializeGame() {
        this.updateCurrentWeather();
        this.generateNewChallenge();
        this.updateDisplay();
        this.createRadarPatterns();
    }
    
    bindEvents() {
        // 天气选择
        document.querySelectorAll('.weather-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectWeather(option.dataset.weather);
            });
        });
        
        // 温度滑块
        const maxTempSlider = document.getElementById('maxTempSlider');
        const minTempSlider = document.getElementById('minTempSlider');
        
        maxTempSlider.addEventListener('input', (e) => {
            this.challenge.playerMaxTemp = parseInt(e.target.value);
            document.getElementById('maxTempValue').textContent = e.target.value + '°C';
        });
        
        minTempSlider.addEventListener('input', (e) => {
            this.challenge.playerMinTemp = parseInt(e.target.value);
            document.getElementById('minTempValue').textContent = e.target.value + '°C';
        });
        
        // 提交预测
        document.getElementById('predictBtn').addEventListener('click', () => {
            this.submitPrediction();
        });
        
        // 工具按钮
        document.getElementById('satelliteBtn').addEventListener('click', () => this.showSatelliteView());
        document.getElementById('windBtn').addEventListener('click', () => this.showWindMap());
        document.getElementById('pressureBtn').addEventListener('click', () => this.showPressureMap());
        document.getElementById('historyBtn').addEventListener('click', () => this.showHistoryData());
    }
    
    selectWeather(weatherType) {
        // 清除之前的选择
        document.querySelectorAll('.weather-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // 选择新天气
        document.querySelector(`[data-weather="${weatherType}"]`).classList.add('selected');
        this.challenge.playerWeather = weatherType;
    }
    
    submitPrediction() {
        if (!this.challenge.playerWeather) {
            alert('请先选择天气类型！');
            return;
        }
        
        const weatherCorrect = this.challenge.playerWeather === this.challenge.correctWeather;
        const tempCorrect = this.checkTemperatureAccuracy();
        const isCorrect = weatherCorrect && tempCorrect;
        
        this.player.totalPredictions++;
        
        if (isCorrect) {
            this.player.correctPredictions++;
            this.player.streak++;
            this.player.score += 100 + (this.player.streak * 10);
        } else {
            this.player.streak = 0;
            this.player.score = Math.max(0, this.player.score - 20);
        }
        
        this.player.accuracy = Math.round((this.player.correctPredictions / this.player.totalPredictions) * 100);
        
        // 添加到历史记录
        this.addToHistory(isCorrect, weatherCorrect, tempCorrect);
        
        // 显示结果
        this.showPredictionResult(isCorrect, weatherCorrect, tempCorrect);
        
        // 检查升级
        this.checkLevelUp();
        
        // 生成新挑战
        setTimeout(() => {
            this.generateNewChallenge();
            this.updateDisplay();
        }, 3000);
        
        this.updateDisplay();
    }
    
    checkTemperatureAccuracy() {
        const maxTempDiff = Math.abs(this.challenge.playerMaxTemp - this.challenge.correctMaxTemp);
        const minTempDiff = Math.abs(this.challenge.playerMinTemp - this.challenge.correctMinTemp);
        
        return maxTempDiff <= 3 && minTempDiff <= 3; // 允许3度误差
    }
    
    showPredictionResult(isCorrect, weatherCorrect, tempCorrect) {
        const correctWeather = this.weatherTypes[this.challenge.correctWeather];
        let message = `正确答案: ${correctWeather.icon} ${correctWeather.name}\\n`;
        message += `正确温度: ${this.challenge.correctMaxTemp}°C / ${this.challenge.correctMinTemp}°C\\n\\n`;
        
        if (isCorrect) {
            message += '🎉 预测完全正确！';
            this.createWeatherEffect(this.challenge.correctWeather);
        } else {
            message += '❌ 预测有误:\\n';
            if (!weatherCorrect) {
                message += '- 天气类型错误\\n';
            }
            if (!tempCorrect) {
                message += '- 温度预测偏差较大\\n';
            }
        }
        
        alert(message);
    }
    
    addToHistory(isCorrect, weatherCorrect, tempCorrect) {
        const historyItem = {
            location: this.challenge.location,
            playerWeather: this.challenge.playerWeather,
            correctWeather: this.challenge.correctWeather,
            playerMaxTemp: this.challenge.playerMaxTemp,
            playerMinTemp: this.challenge.playerMinTemp,
            correctMaxTemp: this.challenge.correctMaxTemp,
            correctMinTemp: this.challenge.correctMinTemp,
            isCorrect: isCorrect,
            weatherCorrect: weatherCorrect,
            tempCorrect: tempCorrect,
            timestamp: new Date()
        };
        
        this.history.unshift(historyItem);
        if (this.history.length > 10) {
            this.history.pop();
        }
        
        this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        historyList.innerHTML = '';
        
        this.history.forEach(item => {
            const historyElement = document.createElement('div');
            historyElement.className = `history-item ${item.isCorrect ? 'correct' : 'incorrect'}`;
            
            const playerWeather = this.weatherTypes[item.playerWeather];
            const correctWeather = this.weatherTypes[item.correctWeather];
            
            historyElement.innerHTML = `
                <div class="history-prediction">
                    <span>${item.location}</span>
                    <span>${playerWeather.icon} ${playerWeather.name}</span>
                    <span>${item.playerMaxTemp}°/${item.playerMinTemp}°</span>
                </div>
                <div class="history-result ${item.isCorrect ? 'correct' : 'incorrect'}">
                    ${item.isCorrect ? '✓ 正确' : '✗ 错误'}
                </div>
            `;
            
            historyList.appendChild(historyElement);
        });
    }
    
    generateNewChallenge() {
        this.challenge.location = this.locations[Math.floor(Math.random() * this.locations.length)];
        
        // 根据季节和地区生成合理的天气
        const weatherKeys = Object.keys(this.weatherTypes);
        this.challenge.correctWeather = weatherKeys[Math.floor(Math.random() * weatherKeys.length)];
        
        // 生成合理的温度范围
        const baseTemp = Math.floor(Math.random() * 30) + 5; // 5-35度
        this.challenge.correctMaxTemp = baseTemp + Math.floor(Math.random() * 8) + 2;
        this.challenge.correctMinTemp = baseTemp - Math.floor(Math.random() * 8) - 2;
        
        // 重置玩家选择
        this.challenge.playerWeather = null;
        this.challenge.playerMaxTemp = 25;
        this.challenge.playerMinTemp = 15;
        
        // 更新UI
        document.querySelectorAll('.weather-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        document.getElementById('maxTempSlider').value = 25;
        document.getElementById('minTempSlider').value = 15;
        document.getElementById('maxTempValue').textContent = '25°C';
        document.getElementById('minTempValue').textContent = '15°C';
        
        document.getElementById('challengeLocation').textContent = this.challenge.location;
    }
    
    updateCurrentWeather() {
        // 模拟当前天气变化
        this.currentWeather.temperature += (Math.random() - 0.5) * 2;
        this.currentWeather.humidity += (Math.random() - 0.5) * 10;
        this.currentWeather.windSpeed += (Math.random() - 0.5) * 2;
        this.currentWeather.pressure += (Math.random() - 0.5) * 5;
        
        // 限制范围
        this.currentWeather.temperature = Math.max(-10, Math.min(40, this.currentWeather.temperature));
        this.currentWeather.humidity = Math.max(0, Math.min(100, this.currentWeather.humidity));
        this.currentWeather.windSpeed = Math.max(0, Math.min(50, this.currentWeather.windSpeed));
        this.currentWeather.pressure = Math.max(980, Math.min(1040, this.currentWeather.pressure));
        
        // 随机改变天气条件
        if (Math.random() < 0.1) {
            const weatherKeys = Object.keys(this.weatherTypes);
            const newWeather = weatherKeys[Math.floor(Math.random() * weatherKeys.length)];
            this.currentWeather.condition = newWeather;
            this.currentWeather.icon = this.weatherTypes[newWeather].icon;
            this.currentWeather.description = this.weatherTypes[newWeather].name;
        }
    }
    
    createRadarPatterns() {
        const weatherPatterns = document.getElementById('weatherPatterns');
        weatherPatterns.innerHTML = '';
        
        for (let i = 0; i < 5; i++) {
            const pattern = document.createElement('div');
            pattern.className = 'weather-pattern';
            
            const size = Math.random() * 30 + 10;
            const x = Math.random() * 170;
            const y = Math.random() * 170;
            
            pattern.style.width = size + 'px';
            pattern.style.height = size + 'px';
            pattern.style.left = x + 'px';
            pattern.style.top = y + 'px';
            pattern.style.background = this.getPatternColor();
            
            weatherPatterns.appendChild(pattern);
        }
    }
    
    getPatternColor() {
        const colors = ['#4caf50', '#ff9800', '#f44336', '#2196f3', '#9c27b0'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    createWeatherEffect(weatherType) {
        const effectsContainer = document.getElementById('weatherEffects');
        effectsContainer.innerHTML = '';
        
        if (weatherType === 'rainy' || weatherType === 'stormy') {
            this.createRainEffect();
        } else if (weatherType === 'snowy') {
            this.createSnowEffect();
        }
    }
    
    createRainEffect() {
        const effectsContainer = document.getElementById('weatherEffects');
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const rainDrop = document.createElement('div');
                rainDrop.className = 'rain-drop';
                rainDrop.style.left = Math.random() * 100 + '%';
                rainDrop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
                
                effectsContainer.appendChild(rainDrop);
                
                setTimeout(() => {
                    rainDrop.remove();
                }, 1000);
            }, i * 50);
        }
    }
    
    createSnowEffect() {
        const effectsContainer = document.getElementById('weatherEffects');
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const snowFlake = document.createElement('div');
                snowFlake.className = 'snow-flake';
                snowFlake.textContent = '❄';
                snowFlake.style.left = Math.random() * 100 + '%';
                snowFlake.style.animationDuration = (Math.random() * 2 + 2) + 's';
                
                effectsContainer.appendChild(snowFlake);
                
                setTimeout(() => {
                    snowFlake.remove();
                }, 4000);
            }, i * 100);
        }
    }
    
    checkLevelUp() {
        const requiredScore = this.player.level * 500;
        if (this.player.score >= requiredScore) {
            this.player.level++;
            alert(`恭喜升级！现在是${this.player.level}级气象员！`);
        }
    }
    
    showSatelliteView() {
        alert('🛰️ 卫星云图显示：\\n- 西北方向有云团移动\\n- 东南部晴朗无云\\n- 预计6小时后云层覆盖增加');
    }
    
    showWindMap() {
        alert('💨 风向图显示：\\n- 当前风向：西北风\\n- 风力等级：3-4级\\n- 明日转为东南风');
    }
    
    showPressureMap() {
        alert('📊 气压图显示：\\n- 当前气压：1013 hPa\\n- 气压趋势：稳定\\n- 高压系统正在接近');
    }
    
    showHistoryData() {
        const accuracy = this.player.accuracy || 0;
        alert(`📈 历史数据：\\n- 总预测次数：${this.player.totalPredictions}\\n- 正确次数：${this.player.correctPredictions}\\n- 准确率：${accuracy}%\\n- 最高连续正确：${this.getMaxStreak()}`);
    }
    
    getMaxStreak() {
        // 计算历史最高连续正确次数
        let maxStreak = 0;
        let currentStreak = 0;
        
        this.history.forEach(item => {
            if (item.isCorrect) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        });
        
        return Math.max(maxStreak, this.player.streak);
    }
    
    updateDisplay() {
        // 更新统计数据
        document.getElementById('accuracy').textContent = this.player.accuracy;
        document.getElementById('score').textContent = this.player.score;
        document.getElementById('level').textContent = this.player.level;
        document.getElementById('streak').textContent = this.player.streak;
        
        // 更新当前天气
        document.getElementById('currentWeatherIcon').textContent = this.currentWeather.icon;
        document.getElementById('currentTemp').textContent = Math.round(this.currentWeather.temperature) + '°C';
        document.getElementById('currentDesc').textContent = this.currentWeather.description;
        document.getElementById('humidity').textContent = Math.round(this.currentWeather.humidity) + '%';
        document.getElementById('windSpeed').textContent = Math.round(this.currentWeather.windSpeed) + ' km/h';
        document.getElementById('pressure').textContent = Math.round(this.currentWeather.pressure) + ' hPa';
    }
    
    startGameLoop() {
        // 更新当前天气
        setInterval(() => {
            this.updateCurrentWeather();
            this.updateDisplay();
        }, 10000);
        
        // 更新雷达图案
        setInterval(() => {
            this.createRadarPatterns();
        }, 5000);
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new WeatherGame();
});