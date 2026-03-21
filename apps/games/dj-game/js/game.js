class DJGame {
    constructor() {
        this.deckA = {
            playing: false,
            volume: 70,
            pitch: 0,
            bpm: 120,
            track: null,
            audioContext: null,
            oscillator: null,
            gainNode: null
        };
        
        this.deckB = {
            playing: false,
            volume: 70,
            pitch: 0,
            bpm: 128,
            track: null,
            audioContext: null,
            oscillator: null,
            gainNode: null
        };
        
        this.crossfaderValue = 50;
        this.effects = {
            reverb: false,
            delay: false,
            filter: false,
            distortion: false
        };
        
        this.recording = false;
        this.recordStartTime = null;
        
        this.initializeAudio();
        this.bindEvents();
        this.startVisualizer();
        this.updateStatus();
    }

    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    bindEvents() {
        // Deck A 控制
        document.getElementById('playA').addEventListener('click', () => this.togglePlay('A'));
        document.getElementById('stopA').addEventListener('click', () => this.stop('A'));
        document.getElementById('volumeA').addEventListener('input', (e) => this.setVolume('A', e.target.value));
        document.getElementById('pitchA').addEventListener('input', (e) => this.setPitch('A', e.target.value));
        document.getElementById('syncA').addEventListener('click', () => this.syncBPM('A'));

        // Deck B 控制
        document.getElementById('playB').addEventListener('click', () => this.togglePlay('B'));
        document.getElementById('stopB').addEventListener('click', () => this.stop('B'));
        document.getElementById('volumeB').addEventListener('input', (e) => this.setVolume('B', e.target.value));
        document.getElementById('pitchB').addEventListener('input', (e) => this.setPitch('B', e.target.value));
        document.getElementById('syncB').addEventListener('click', () => this.syncBPM('B'));

        // 音轨选择
        document.querySelectorAll('#deckA .track-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectTrack('A', btn.dataset.track, btn));
        });
        
        document.querySelectorAll('#deckB .track-btn').forEach(btn => {
            btn.addEventListener('click', () => this.selectTrack('B', btn.dataset.track, btn));
        });

        // Crossfader
        document.getElementById('crossfader').addEventListener('input', (e) => {
            this.crossfaderValue = e.target.value;
            this.updateMix();
        });

        // 音效
        document.querySelectorAll('.effect-btn').forEach(btn => {
            btn.addEventListener('click', () => this.toggleEffect(btn.id, btn));
        });

        // 录制
        document.getElementById('recordBtn').addEventListener('click', () => this.toggleRecord());
    }

    selectTrack(deck, track, button) {
        // 移除同一deck中其他按钮的active状态
        const deckElement = deck === 'A' ? document.getElementById('deckA') : document.getElementById('deckB');
        deckElement.querySelectorAll('.track-btn').forEach(btn => btn.classList.remove('active'));
        
        // 激活当前按钮
        button.classList.add('active');
        
        // 设置音轨
        this[`deck${deck}`].track = track;
        
        // 更新BPM
        const bpmMap = {
            house: 120, techno: 130, trance: 138, dubstep: 140,
            electro: 128, ambient: 90, drum: 120, synth: 125
        };
        
        this[`deck${deck}`].bpm = bpmMap[track] || 120;
        document.getElementById(`bpm${deck}`).textContent = this[`deck${deck}`].bpm;
    }

    togglePlay(deck) {
        const deckData = this[`deck${deck}`];
        const playBtn = document.getElementById(`play${deck}`);
        
        if (!deckData.track) {
            alert('请先选择音轨！');
            return;
        }
        
        if (deckData.playing) {
            this.pause(deck);
            playBtn.textContent = '▶️ PLAY';
        } else {
            this.play(deck);
            playBtn.textContent = '⏸️ PAUSE';
        }
    }

    play(deck) {
        const deckData = this[`deck${deck}`];
        
        if (!this.audioContext) return;
        
        // 创建音频节点
        deckData.oscillator = this.audioContext.createOscillator();
        deckData.gainNode = this.audioContext.createGain();
        
        // 根据音轨类型设置不同的频率和波形
        const trackSettings = {
            house: { frequency: 220, type: 'sawtooth' },
            techno: { frequency: 110, type: 'square' },
            trance: { frequency: 330, type: 'sine' },
            dubstep: { frequency: 80, type: 'sawtooth' },
            electro: { frequency: 165, type: 'square' },
            ambient: { frequency: 440, type: 'sine' },
            drum: { frequency: 60, type: 'square' },
            synth: { frequency: 523, type: 'sawtooth' }
        };
        
        const settings = trackSettings[deckData.track] || { frequency: 220, type: 'sine' };
        
        deckData.oscillator.type = settings.type;
        deckData.oscillator.frequency.setValueAtTime(
            settings.frequency * (1 + deckData.pitch / 100), 
            this.audioContext.currentTime
        );
        
        // 设置音量
        deckData.gainNode.gain.setValueAtTime(
            (deckData.volume / 100) * 0.3, 
            this.audioContext.currentTime
        );
        
        // 连接音频节点
        deckData.oscillator.connect(deckData.gainNode);
        deckData.gainNode.connect(this.masterGain);
        
        // 开始播放
        deckData.oscillator.start();
        deckData.playing = true;
        
        this.updateMix();
    }

    pause(deck) {
        const deckData = this[`deck${deck}`];
        
        if (deckData.oscillator) {
            deckData.oscillator.stop();
            deckData.oscillator = null;
        }
        
        deckData.playing = false;
    }

    stop(deck) {
        this.pause(deck);
        const playBtn = document.getElementById(`play${deck}`);
        playBtn.textContent = '▶️ PLAY';
    }

    setVolume(deck, value) {
        const deckData = this[`deck${deck}`];
        deckData.volume = value;
        
        if (deckData.gainNode) {
            deckData.gainNode.gain.setValueAtTime(
                (value / 100) * 0.3, 
                this.audioContext.currentTime
            );
        }
        
        this.updateMix();
    }

    setPitch(deck, value) {
        const deckData = this[`deck${deck}`];
        deckData.pitch = value;
        
        if (deckData.oscillator) {
            const trackSettings = {
                house: 220, techno: 110, trance: 330, dubstep: 80,
                electro: 165, ambient: 440, drum: 60, synth: 523
            };
            
            const baseFreq = trackSettings[deckData.track] || 220;
            deckData.oscillator.frequency.setValueAtTime(
                baseFreq * (1 + value / 100), 
                this.audioContext.currentTime
            );
        }
        
        // 更新BPM显示
        const newBPM = Math.round(deckData.bpm * (1 + value / 100));
        document.getElementById(`bpm${deck}`).textContent = newBPM;
    }

    syncBPM(deck) {
        const otherDeck = deck === 'A' ? 'B' : 'A';
        const targetBPM = this[`deck${otherDeck}`].bpm;
        
        this[`deck${deck}`].bpm = targetBPM;
        document.getElementById(`bpm${deck}`).textContent = targetBPM;
        
        // 重置音调
        document.getElementById(`pitch${deck}`).value = 0;
        this.setPitch(deck, 0);
    }

    updateMix() {
        const volumeA = this.deckA.volume * (100 - this.crossfaderValue) / 100;
        const volumeB = this.deckB.volume * this.crossfaderValue / 100;
        
        const masterVol = Math.round((volumeA + volumeB) / 2);
        document.getElementById('masterVolume').textContent = `${masterVol}%`;
        
        // 计算当前BPM
        const currentBPM = Math.round((this.deckA.bpm + this.deckB.bpm) / 2);
        document.getElementById('currentBPM').textContent = currentBPM;
        
        // 更新混音状态
        let status = 'READY';
        if (this.deckA.playing && this.deckB.playing) {
            status = 'MIXING';
        } else if (this.deckA.playing || this.deckB.playing) {
            status = 'PLAYING';
        }
        document.getElementById('mixStatus').textContent = status;
    }

    toggleEffect(effectId, button) {
        this.effects[effectId] = !this.effects[effectId];
        
        if (this.effects[effectId]) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
        
        // 这里可以添加实际的音效处理逻辑
        console.log(`Effect ${effectId}: ${this.effects[effectId] ? 'ON' : 'OFF'}`);
    }

    toggleRecord() {
        const recordBtn = document.getElementById('recordBtn');
        
        if (!this.recording) {
            this.recording = true;
            this.recordStartTime = Date.now();
            recordBtn.textContent = '⏹️ 停止录制';
            recordBtn.classList.add('recording');
            
            this.recordTimer = setInterval(() => {
                const elapsed = Math.floor((Date.now() - this.recordStartTime) / 1000);
                const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
                const seconds = (elapsed % 60).toString().padStart(2, '0');
                document.getElementById('recordTime').textContent = `${minutes}:${seconds}`;
            }, 1000);
        } else {
            this.recording = false;
            recordBtn.textContent = '🔴 开始录制';
            recordBtn.classList.remove('recording');
            
            if (this.recordTimer) {
                clearInterval(this.recordTimer);
            }
            
            alert('录制已保存！');
        }
    }

    startVisualizer() {
        const visualizer = document.getElementById('visualizer');
        const barCount = 50;
        
        // 创建可视化条
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'bar';
            visualizer.appendChild(bar);
        }
        
        // 动画循环
        const animate = () => {
            const bars = visualizer.querySelectorAll('.bar');
            
            bars.forEach((bar, index) => {
                let height = 5;
                
                if (this.deckA.playing || this.deckB.playing) {
                    // 根据音频活动生成可视化效果
                    const baseHeight = Math.random() * 150 + 20;
                    const volumeMultiplier = (this.deckA.volume + this.deckB.volume) / 200;
                    height = baseHeight * volumeMultiplier;
                    
                    // 添加频率相关的变化
                    const frequency = Math.sin(Date.now() * 0.01 + index * 0.1) * 50 + 50;
                    height += frequency;
                }
                
                bar.style.height = `${Math.max(5, height)}px`;
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    updateStatus() {
        setInterval(() => {
            this.updateMix();
        }, 1000);
    }
}

// 启动DJ游戏
document.addEventListener('DOMContentLoaded', () => {
    new DJGame();
});