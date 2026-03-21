class RhythmBeat {
    constructor() {
        this.isPlaying = false;
        this.currentTempo = 120;
        this.beatsPerMeasure = 4;
        this.noteValue = 4;
        this.currentBeat = 1;
        this.volume = 0.7;
        this.soundType = 'click';
        this.visualIndicator = true;
        this.vibrationFeedback = false;
        this.autoSave = true;
        this.darkTheme = false;
        
        // 练习相关
        this.practiceMode = null;
        this.practiceStartTime = null;
        this.totalBeatsCount = 0;
        this.accuracyData = [];
        this.tapTimes = [];
        
        // 音频上下文
        this.audioContext = null;
        this.beatInterval = null;
        this.nextBeatTime = 0;
        this.scheduleAheadTime = 25.0; // 25ms
        this.lookAhead = 25.0; // 25ms
        
        this.init();
    }
    
    init() {
        this.setupAudio();
        this.bindEvents();
        this.loadSettings();
        this.updateDisplay();
        this.updateTimeSignature();
    }
    
    setupAudio() {
        // 初始化Web Audio API
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    bindEvents() {
        // 速度滑块事件
        const tempoSlider = document.getElementById('tempoSlider');
        tempoSlider.addEventListener('input', (e) => {
            this.setTempo(parseInt(e.target.value));
        });
        
        // 音量滑块事件
        const volumeSlider = document.getElementById('volumeSlider');
        volumeSlider.addEventListener('input', (e) => {
            this.setVolume(parseInt(e.target.value));
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePlay();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.changeTempo(5);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.changeTempo(-5);
                    break;
                case 'KeyT':
                    e.preventDefault();
                    this.tapTempo();
                    break;
            }
        });
    }
    
    setTempo(tempo) {
        this.currentTempo = Math.max(40, Math.min(200, tempo));
        document.getElementById('tempoSlider').value = this.currentTempo;
        document.getElementById('tempoValue').textContent = this.currentTempo;
        document.getElementById('currentTempo').textContent = this.currentTempo;
        
        // 更新预设按钮状态
        this.updatePresetButtons();
        
        if (this.autoSave) {
            this.saveSettings();
        }
    }
    
    changeTempo(delta) {
        this.setTempo(this.currentTempo + delta);
    }
    
    updatePresetButtons() {
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 检查是否匹配预设速度
        const presets = [60, 90, 120, 160];
        const matchingPreset = presets.find(preset => preset === this.currentTempo);
        if (matchingPreset) {
            const presetBtn = document.querySelector(`[onclick*="${matchingPreset}"]`);
            if (presetBtn) {
                presetBtn.classList.add('active');
            }
        }
    }
    
    setVolume(volume) {
        this.volume = volume / 100;
        document.getElementById('volumeValue').textContent = volume + '%';
        
        if (this.autoSave) {
            this.saveSettings();
        }
    }
    
    changeSoundType() {
        this.soundType = document.getElementById('soundSelect').value;
        
        if (this.autoSave) {
            this.saveSettings();
        }
    }
    
    updateTimeSignature() {
        this.beatsPerMeasure = parseInt(document.getElementById('beatsPerMeasure').value);
        this.noteValue = parseInt(document.getElementById('noteValue').value);
        
        // 更新显示
        document.getElementById('signatureNumerator').textContent = this.beatsPerMeasure;
        document.getElementById('signatureDenominator').textContent = this.noteValue;
        document.getElementById('totalBeats').textContent = this.beatsPerMeasure;
        
        // 更新拍号描述
        const description = this.getTimeSignatureDescription();
        document.getElementById('signatureDescription').textContent = description;
        
        // 更新节拍显示
        this.updateBeatPattern();
        
        // 重置当前拍
        this.currentBeat = 1;
        this.updateDisplay();
    }
    
    getTimeSignatureDescription() {
        const signatures = {
            '2/4': '2/4拍 - 二四拍 (进行曲)',
            '3/4': '3/4拍 - 三四拍 (华尔兹)',
            '4/4': '4/4拍 - 四四拍 (常见)',
            '5/4': '5/4拍 - 五四拍 (不规则)',
            '6/8': '6/8拍 - 六八拍 (复合)',
            '7/8': '7/8拍 - 七八拍 (不规则)',
            '8/8': '8/8拍 - 八八拍'
        };
        
        const key = `${this.beatsPerMeasure}/${this.noteValue}`;
        return signatures[key] || `${key}拍`;
    }
    
    updateBeatPattern() {
        const container = document.getElementById('beatPattern');
        container.innerHTML = '';
        
        for (let i = 1; i <= this.beatsPerMeasure; i++) {
            const beatCircle = document.createElement('div');
            beatCircle.className = `beat-circle ${i === 1 ? 'strong' : 'weak'}`;
            beatCircle.dataset.beat = i;
            beatCircle.textContent = i;
            
            if (i === this.currentBeat) {
                beatCircle.classList.add('active');
            }
            
            container.appendChild(beatCircle);
        }
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        if (!this.audioContext) {
            this.setupAudio();
        }
        
        // 恢复音频上下文（处理浏览器自动播放策略）
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        
        this.isPlaying = true;
        this.nextBeatTime = this.audioContext.currentTime;
        
        // 开始调度节拍
        this.scheduler();
        this.beatInterval = setInterval(() => this.scheduler(), this.lookAhead);
        
        // 更新UI
        const playBtn = document.getElementById('playBtn');
        playBtn.querySelector('.btn-icon').textContent = '⏸️';
        playBtn.querySelector('.btn-text').textContent = '暂停';
        
        // 开始练习计时
        if (!this.practiceStartTime) {
            this.practiceStartTime = Date.now();
        }
    }
    
    pause() {
        this.isPlaying = false;
        
        if (this.beatInterval) {
            clearInterval(this.beatInterval);
            this.beatInterval = null;
        }
        
        // 更新UI
        const playBtn = document.getElementById('playBtn');
        playBtn.querySelector('.btn-icon').textContent = '▶️';
        playBtn.querySelector('.btn-text').textContent = '开始';
    }
    
    stop() {
        this.pause();
        this.currentBeat = 1;
        this.updateDisplay();
        
        // 重置练习统计
        this.practiceStartTime = null;
        this.totalBeatsCount = 0;
        this.updateStatistics();
    }
    
    scheduler() {
        while (this.nextBeatTime < this.audioContext.currentTime + this.scheduleAheadTime) {
            this.scheduleBeat(this.nextBeatTime);
            this.nextBeatTime += 60.0 / this.currentTempo; // 下一拍的时间
        }
    }
    
    scheduleBeat(time) {
        // 播放节拍音效
        this.playBeatSound(time, this.currentBeat === 1);
        
        // 安排UI更新
        const delay = (time - this.audioContext.currentTime) * 1000;
        setTimeout(() => {
            this.updateBeatVisual();
        }, Math.max(0, delay));
    }
    
    playBeatSound(time, isStrongBeat) {
        if (!this.audioContext || this.volume === 0) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // 根据音效类型设置频率和音色
        const frequencies = this.getSoundFrequencies();
        const frequency = isStrongBeat ? frequencies.strong : frequencies.weak;
        
        oscillator.frequency.setValueAtTime(frequency, time);
        oscillator.type = this.getSoundWaveType();
        
        // 设置音量包络
        const attackTime = 0.01;
        const decayTime = 0.1;
        const sustainLevel = 0.3;
        const releaseTime = 0.1;
        
        gainNode.gain.setValueAtTime(0, time);
        gainNode.gain.linearRampToValueAtTime(this.volume, time + attackTime);
        gainNode.gain.exponentialRampToValueAtTime(
            this.volume * sustainLevel, 
            time + attackTime + decayTime
        );
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + attackTime + decayTime + releaseTime);
        
        oscillator.start(time);
        oscillator.stop(time + attackTime + decayTime + releaseTime);
    }
    
    getSoundFrequencies() {
        const sounds = {
            click: { strong: 1000, weak: 800 },
            beep: { strong: 880, weak: 660 },
            drum: { strong: 80, weak: 60 },
            piano: { strong: 523.25, weak: 392.00 }, // C5, G4
            wood: { strong: 400, weak: 300 }
        };
        
        return sounds[this.soundType] || sounds.click;
    }
    
    getSoundWaveType() {
        const waveTypes = {
            click: 'square',
            beep: 'sine',
            drum: 'triangle',
            piano: 'sine',
            wood: 'sawtooth'
        };
        
        return waveTypes[this.soundType] || 'square';
    }
    
    updateBeatVisual() {
        if (!this.isPlaying) return;
        
        // 更新节拍圆圈
        const circles = document.querySelectorAll('.beat-circle');
        circles.forEach(circle => {
            circle.classList.remove('active');
            if (parseInt(circle.dataset.beat) === this.currentBeat) {
                circle.classList.add('active');
            }
        });
        
        // 更新节拍计数器
        document.getElementById('currentBeat').textContent = this.currentBeat;
        
        // 视觉指示器动画
        if (this.visualIndicator) {
            this.animateTempoIndicator();
        }
        
        // 振动反馈
        if (this.vibrationFeedback && navigator.vibrate) {
            navigator.vibrate(this.currentBeat === 1 ? 100 : 50);
        }
        
        // 更新统计
        this.totalBeatsCount++;
        this.updateStatistics();
        
        // 移动到下一拍
        this.currentBeat = this.currentBeat >= this.beatsPerMeasure ? 1 : this.currentBeat + 1;
    }
    
    animateTempoIndicator() {
        const indicator = document.getElementById('tempoIndicator');
        const circle = document.getElementById('tempoCircle');
        
        // 指针旋转动画
        const angle = ((this.currentBeat - 1) / this.beatsPerMeasure) * 360;
        indicator.style.transform = `translateX(-50%) rotate(${angle}deg)`;
        
        // 圆圈脉冲动画
        circle.classList.add('pulse');
        setTimeout(() => {
            circle.classList.remove('pulse');
        }, 100);
    }
    
    tapTempo() {
        const now = Date.now();
        this.tapTimes.push(now);
        
        // 只保留最近的8次敲击
        if (this.tapTimes.length > 8) {
            this.tapTimes.shift();
        }
        
        // 需要至少2次敲击才能计算速度
        if (this.tapTimes.length >= 2) {
            const intervals = [];
            for (let i = 1; i < this.tapTimes.length; i++) {
                intervals.push(this.tapTimes[i] - this.tapTimes[i - 1]);
            }
            
            // 计算平均间隔
            const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
            const bpm = Math.round(60000 / avgInterval);
            
            // 设置新的速度
            if (bpm >= 40 && bpm <= 200) {
                this.setTempo(bpm);
            }
        }
        
        // 视觉反馈
        const tapBtn = document.getElementById('tapBtn');
        tapBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            tapBtn.style.transform = 'scale(1)';
        }, 100);
        
        // 清除旧的敲击记录
        setTimeout(() => {
            this.tapTimes = this.tapTimes.filter(time => now - time < 3000);
        }, 3000);
    }
    
    startBasicPractice() {
        this.practiceMode = 'basic';
        this.startPracticeSession();
    }
    
    startAccentPractice() {
        this.practiceMode = 'accent';
        this.startPracticeSession();
    }
    
    startVariationPractice() {
        this.practiceMode = 'variation';
        this.startPracticeSession();
    }
    
    startSilentPractice() {
        this.practiceMode = 'silent';
        this.startPracticeSession();
    }
    
    startPracticeSession() {
        this.practiceStartTime = Date.now();
        this.totalBeatsCount = 0;
        this.accuracyData = [];
        
        // 根据练习模式调整设置
        switch (this.practiceMode) {
            case 'accent':
                // 强调重音
                break;
            case 'variation':
                // 随机变化速度
                this.scheduleTempoVariations();
                break;
            case 'silent':
                // 降低音量
                const originalVolume = this.volume;
                this.setVolume(10);
                setTimeout(() => this.setVolume(originalVolume * 100), 30000); // 30秒后恢复
                break;
        }
        
        if (!this.isPlaying) {
            this.play();
        }
        
        // 30秒后显示练习结果
        setTimeout(() => {
            if (this.practiceMode) {
                this.showPracticeResults();
            }
        }, 30000);
    }
    
    scheduleTempoVariations() {
        if (this.practiceMode !== 'variation') return;
        
        const variations = [
            { tempo: this.currentTempo - 10, duration: 5000 },
            { tempo: this.currentTempo + 15, duration: 3000 },
            { tempo: this.currentTempo - 5, duration: 4000 },
            { tempo: this.currentTempo + 10, duration: 6000 }
        ];
        
        let delay = 3000; // 3秒后开始变化
        variations.forEach(variation => {
            setTimeout(() => {
                if (this.practiceMode === 'variation') {
                    this.setTempo(variation.tempo);
                }
            }, delay);
            delay += variation.duration;
        });
    }
    
    showPracticeResults() {
        this.pause();
        
        const practiceTime = this.getPracticeTime();
        const avgTempo = this.currentTempo;
        const accuracy = this.calculateAccuracy();
        
        // 更新结果显示
        document.getElementById('finalTime').textContent = practiceTime;
        document.getElementById('avgTempo').textContent = avgTempo + ' BPM';
        document.getElementById('finalAccuracy').textContent = accuracy + '%';
        document.getElementById('finalBeats').textContent = this.totalBeatsCount;
        
        // 绘制准确度图表
        this.drawAccuracyChart(accuracy);
        
        document.getElementById('practicePopup').classList.add('show');
        
        this.practiceMode = null;
    }
    
    calculateAccuracy() {
        // 简化的准确度计算
        const baseAccuracy = 100;
        const deduction = Math.max(0, (this.totalBeatsCount - 120) * 0.1); // 假设理想拍数为120
        return Math.max(85, Math.round(baseAccuracy - deduction));
    }
    
    drawAccuracyChart(accuracy) {
        const canvas = document.getElementById('accuracyChart');
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 80;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制背景圆
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 10;
        ctx.stroke();
        
        // 绘制准确度弧
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + (accuracy / 100) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = accuracy >= 90 ? '#4CAF50' : accuracy >= 75 ? '#FF9800' : '#F44336';
        ctx.lineWidth = 10;
        ctx.stroke();
        
        // 绘制文字
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(accuracy + '%', centerX, centerY + 8);
    }
    
    continuePractice() {
        document.getElementById('practicePopup').classList.remove('show');
        this.play();
    }
    
    closePractice() {
        document.getElementById('practicePopup').classList.remove('show');
        this.practiceMode = null;
    }
    
    getPracticeTime() {
        if (!this.practiceStartTime) return '00:00';
        
        const elapsedMs = Date.now() - this.practiceStartTime;
        const minutes = Math.floor(elapsedMs / 60000);
        const seconds = Math.floor((elapsedMs % 60000) / 1000);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateStatistics() {
        if (this.practiceStartTime) {
            document.getElementById('practiceTime').textContent = this.getPracticeTime();
        }
        
        document.getElementById('totalBeats').textContent = this.totalBeatsCount;
        
        const accuracy = this.calculateAccuracy();
        document.getElementById('accuracy').textContent = accuracy + '%';
    }
    
    updateDisplay() {
        // 更新节拍显示
        this.updateBeatPattern();
        
        // 更新当前拍计数器
        document.getElementById('currentBeat').textContent = this.currentBeat;
    }
    
    toggleVisualIndicator() {
        this.visualIndicator = document.getElementById('visualIndicator').checked;
        if (this.autoSave) this.saveSettings();
    }
    
    toggleVibration() {
        this.vibrationFeedback = document.getElementById('vibrationFeedback').checked;
        if (this.autoSave) this.saveSettings();
    }
    
    toggleAutoSave() {
        this.autoSave = document.getElementById('autoSave').checked;
        this.saveSettings();
    }
    
    toggleTheme() {
        this.darkTheme = document.getElementById('darkTheme').checked;
        document.body.classList.toggle('dark-theme', this.darkTheme);
        if (this.autoSave) this.saveSettings();
    }
    
    showSettings() {
        // 更新设置状态
        document.getElementById('visualIndicator').checked = this.visualIndicator;
        document.getElementById('vibrationFeedback').checked = this.vibrationFeedback;
        document.getElementById('autoSave').checked = this.autoSave;
        document.getElementById('darkTheme').checked = this.darkTheme;
        
        document.getElementById('settingsPopup').classList.add('show');
    }
    
    closeSettings() {
        document.getElementById('settingsPopup').classList.remove('show');
    }
    
    resetSettings() {
        this.currentTempo = 120;
        this.beatsPerMeasure = 4;
        this.noteValue = 4;
        this.volume = 0.7;
        this.soundType = 'click';
        this.visualIndicator = true;
        this.vibrationFeedback = false;
        this.autoSave = true;
        this.darkTheme = false;
        
        // 重置UI
        this.setTempo(120);
        this.setVolume(70);
        document.getElementById('beatsPerMeasure').value = 4;
        document.getElementById('noteValue').value = 4;
        document.getElementById('soundSelect').value = 'click';
        
        this.updateTimeSignature();
        this.saveSettings();
    }
    
    saveSettings() {
        const settings = {
            tempo: this.currentTempo,
            beatsPerMeasure: this.beatsPerMeasure,
            noteValue: this.noteValue,
            volume: this.volume,
            soundType: this.soundType,
            visualIndicator: this.visualIndicator,
            vibrationFeedback: this.vibrationFeedback,
            autoSave: this.autoSave,
            darkTheme: this.darkTheme
        };
        
        localStorage.setItem('rhythmBeat_settings', JSON.stringify(settings));
    }
    
    loadSettings() {
        const saved = localStorage.getItem('rhythmBeat_settings');
        if (!saved) return;
        
        try {
            const settings = JSON.parse(saved);
            
            this.currentTempo = settings.tempo || 120;
            this.beatsPerMeasure = settings.beatsPerMeasure || 4;
            this.noteValue = settings.noteValue || 4;
            this.volume = settings.volume !== undefined ? settings.volume : 0.7;
            this.soundType = settings.soundType || 'click';
            this.visualIndicator = settings.visualIndicator !== undefined ? settings.visualIndicator : true;
            this.vibrationFeedback = settings.vibrationFeedback || false;
            this.autoSave = settings.autoSave !== undefined ? settings.autoSave : true;
            this.darkTheme = settings.darkTheme || false;
            
            // 应用设置到UI
            this.setTempo(this.currentTempo);
            this.setVolume(this.volume * 100);
            document.getElementById('beatsPerMeasure').value = this.beatsPerMeasure;
            document.getElementById('noteValue').value = this.noteValue;
            document.getElementById('soundSelect').value = this.soundType;
            
            if (this.darkTheme) {
                document.body.classList.add('dark-theme');
            }
            
        } catch (e) {
            console.warn('Failed to load settings:', e);
        }
    }
    
    showHelp() {
        document.getElementById('helpPopup').classList.add('show');
    }
    
    closeHelp() {
        document.getElementById('helpPopup').classList.remove('show');
    }
}

// 全局变量供HTML onclick调用
let rhythmBeat;

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    rhythmBeat = new RhythmBeat();
});