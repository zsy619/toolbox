class BeatCreator {
            constructor() {
                this.audioContext = null;
                this.isPlaying = false;
                this.isRecording = false;
                this.currentStep = 0;
                this.tempo = 120;
                this.masterVolume = 0.7;
                this.swing = 0;
                this.stepTimer = null;
                this.stepDuration = (60 / this.tempo / 4) * 1000;
                
                this.tracks = {
                    kick: { steps: new Array(16).fill(false), volume: 0.8, muted: false, solo: false, effects: {} },
                    snare: { steps: new Array(16).fill(false), volume: 0.75, muted: false, solo: false, effects: {} },
                    hihat: { steps: new Array(16).fill(false), volume: 0.6, muted: false, solo: false, effects: {} },
                    openhat: { steps: new Array(16).fill(false), volume: 0.5, muted: false, solo: false, effects: {} },
                    clap: { steps: new Array(16).fill(false), volume: 0.65, muted: false, solo: false, effects: {} },
                    crash: { steps: new Array(16).fill(false), volume: 0.7, muted: false, solo: false, effects: {} }
                };

                this.patterns = {
                    basic: {
                        kick: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
                        snare: [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
                        hihat: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
                    },
                    rock: {
                        kick: [1,0,0,1,0,0,1,0,1,0,0,1,0,0,1,0],
                        snare: [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
                        hihat: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
                        crash: [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0]
                    },
                    funk: {
                        kick: [1,0,0,1,0,1,0,0,1,0,0,1,0,1,0,0],
                        snare: [0,0,1,0,0,1,1,0,0,0,1,0,0,1,1,0],
                        hihat: [1,1,0,1,1,0,1,1,1,1,0,1,1,0,1,1]
                    },
                    disco: {
                        kick: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
                        snare: [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],
                        hihat: [1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1],
                        openhat: [0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1]
                    },
                    techno: {
                        kick: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
                        snare: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
                        hihat: [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
                        openhat: [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0]
                    },
                    jazz: {
                        kick: [1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,0],
                        snare: [0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0],
                        hihat: [1,0,1,1,0,1,1,0,1,0,1,1,0,1,1,0],
                        crash: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
                    },
                    latin: {
                        kick: [1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,0],
                        snare: [0,0,1,0,1,0,1,0,0,0,1,0,1,0,1,0],
                        hihat: [1,1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
                        clap: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0]
                    },
                    trap: {
                        kick: [1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
                        snare: [0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,1],
                        hihat: [1,0,1,1,0,1,1,0,1,0,1,1,0,1,1,0],
                        clap: [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0]
                    }
                };

                this.sounds = {};
                this.analyser = null;
                this.dataArray = null;
                this.recordedPattern = [];
                
                this.init();
            }

            async init() {
                await this.initAudio();
                this.createSequencers();
                this.setupControls();
                this.setupKeyboardControls();
                this.setupVisualizer();
                this.loadSavedPattern();
                this.updateStatus('准备就绪 - 开始创作你的节拍！');
            }

            async initAudio() {
                try {
                    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    this.masterGain = this.audioContext.createGain();
                    this.masterGain.connect(this.audioContext.destination);
                    this.masterGain.gain.value = this.masterVolume;

                    this.analyser = this.audioContext.createAnalyser();
                    this.analyser.fftSize = 128;
                    this.masterGain.connect(this.analyser);
                    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

                    await this.createSounds();
                } catch (error) {
                    console.error('音频初始化失败:', error);
                    this.updateStatus('音频初始化失败，请检查浏览器设置');
                }
            }

            async createSounds() {
                const soundDefinitions = {
                    kick: { frequency: 60, type: 'sine', duration: 0.5, envelope: [0, 1, 0.3, 0] },
                    snare: { frequency: 200, type: 'square', duration: 0.2, envelope: [0, 1, 0.1, 0], noise: true },
                    hihat: { frequency: 8000, type: 'square', duration: 0.1, envelope: [0, 1, 0, 0], noise: true },
                    openhat: { frequency: 6000, type: 'square', duration: 0.3, envelope: [0, 1, 0.2, 0], noise: true },
                    clap: { frequency: 1000, type: 'square', duration: 0.15, envelope: [0, 1, 0.1, 0], noise: true },
                    crash: { frequency: 5000, type: 'square', duration: 1.0, envelope: [0, 1, 0.5, 0], noise: true },
                    ride: { frequency: 3000, type: 'triangle', duration: 0.8, envelope: [0, 1, 0.4, 0], noise: true },
                    tom: { frequency: 120, type: 'sine', duration: 0.4, envelope: [0, 1, 0.2, 0] }
                };

                this.sounds = {};
                for (const [name, def] of Object.entries(soundDefinitions)) {
                    this.sounds[name] = def;
                }
            }

            createSequencers() {
                Object.keys(this.tracks).forEach(trackName => {
                    const sequencer = document.querySelector(`.sequencer[data-track="${trackName}"]`);
                    if (sequencer) {
                        sequencer.innerHTML = '';
                        for (let i = 0; i < 16; i++) {
                            const step = document.createElement('div');
                            step.className = 'step';
                            step.dataset.step = i;
                            step.addEventListener('click', () => this.toggleStep(trackName, i));
                            sequencer.appendChild(step);
                        }
                    }
                });
            }

            setupControls() {
                // 播放控制
                document.getElementById('playBtn').addEventListener('click', () => this.togglePlayback());
                document.getElementById('stopBtn').addEventListener('click', () => this.stop());
                document.getElementById('recordBtn').addEventListener('click', () => this.toggleRecording());
                document.getElementById('clearBtn').addEventListener('click', () => this.clearPattern());
                document.getElementById('randomBtn').addEventListener('click', () => this.generateRandomPattern());

                // 主控制
                const tempoSlider = document.getElementById('tempo');
                const masterVolumeSlider = document.getElementById('masterVolume');
                const swingSlider = document.getElementById('swing');

                tempoSlider.addEventListener('input', (e) => {
                    this.tempo = parseInt(e.target.value);
                    this.stepDuration = (60 / this.tempo / 4) * 1000;
                    document.getElementById('tempoValue').textContent = `${this.tempo} BPM`;
                    this.updateStatus(`节拍速度: ${this.tempo} BPM`);
                });

                masterVolumeSlider.addEventListener('input', (e) => {
                    this.masterVolume = e.target.value / 100;
                    if (this.masterGain) {
                        this.masterGain.gain.value = this.masterVolume;
                    }
                    document.getElementById('volumeValue').textContent = `${e.target.value}%`;
                });

                swingSlider.addEventListener('input', (e) => {
                    this.swing = e.target.value / 100;
                    document.getElementById('swingValue').textContent = `${e.target.value}%`;
                });

                // 轨道控制
                document.querySelectorAll('.mute-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const track = e.target.closest('.track').dataset.track;
                        this.toggleMute(track);
                    });
                });

                document.querySelectorAll('.solo-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const track = e.target.closest('.track').dataset.track;
                        this.toggleSolo(track);
                    });
                });

                document.querySelectorAll('.track-volume').forEach(slider => {
                    slider.addEventListener('input', (e) => {
                        const track = e.target.closest('.track').dataset.track;
                        this.tracks[track].volume = e.target.value / 100;
                    });
                });

                // 预设模式
                document.querySelectorAll('.pattern-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const pattern = e.target.dataset.pattern;
                        this.loadPattern(pattern);
                    });
                });

                // 实时演奏面板
                document.querySelectorAll('.pad').forEach(pad => {
                    pad.addEventListener('mousedown', (e) => {
                        const sound = e.target.dataset.sound;
                        this.playSound(sound);
                        if (this.isRecording) {
                            this.recordNote(sound);
                        }
                    });
                });

                // 音效控制
                document.querySelectorAll('.pitch-control, .reverb-control, .filter-control, .delay-control, .distortion-control').forEach(control => {
                    control.addEventListener('input', (e) => {
                        const track = e.target.closest('.track').dataset.track;
                        const effectType = e.target.className.replace('-control', '').replace('pitch', 'pitch').replace('reverb', 'reverb').replace('filter', 'filter').replace('delay', 'delay').replace('distortion', 'distortion');
                        this.tracks[track].effects[effectType] = e.target.value;
                    });
                });
            }

            setupKeyboardControls() {
                const keyMap = {
                    'KeyQ': 'kick',
                    'KeyW': 'snare',
                    'KeyE': 'hihat',
                    'KeyR': 'openhat',
                    'KeyA': 'clap',
                    'KeyS': 'crash',
                    'KeyD': 'ride',
                    'KeyF': 'tom',
                    'Space': 'play'
                };

                document.addEventListener('keydown', (e) => {
                    if (e.code === 'Space') {
                        e.preventDefault();
                        this.togglePlayback();
                        return;
                    }

                    const sound = keyMap[e.code];
                    if (sound && !e.repeat) {
                        this.playSound(sound);
                        if (this.isRecording) {
                            this.recordNote(sound);
                        }
                        
                        const pad = document.querySelector(`[data-sound="${sound}"]`);
                        if (pad) {
                            pad.style.background = '#ff6b6b';
                            setTimeout(() => {
                                pad.style.background = '';
                            }, 150);
                        }
                    }
                });
            }

            setupVisualizer() {
                const visualizer = document.getElementById('visualizer');
                const bars = 32;
                
                for (let i = 0; i < bars; i++) {
                    const bar = document.createElement('div');
                    bar.className = 'frequency-bar';
                    bar.style.left = `${(i / bars) * 100}%`;
                    visualizer.appendChild(bar);
                }

                this.updateVisualizer();
            }

            updateVisualizer() {
                if (this.analyser && this.dataArray) {
                    this.analyser.getByteFrequencyData(this.dataArray);
                    const bars = document.querySelectorAll('.frequency-bar');
                    
                    bars.forEach((bar, index) => {
                        const value = this.dataArray[index * 2] || 0;
                        const height = (value / 255) * 100;
                        bar.style.height = `${height}%`;
                    });
                }
                
                requestAnimationFrame(() => this.updateVisualizer());
            }

            toggleStep(track, step) {
                this.tracks[track].steps[step] = !this.tracks[track].steps[step];
                this.updateSequencerDisplay();
                this.savePattern();
                
                const stepElement = document.querySelector(`.sequencer[data-track="${track}"] .step[data-step="${step}"]`);
                if (stepElement) {
                    stepElement.classList.toggle('active', this.tracks[track].steps[step]);
                }
            }

            updateSequencerDisplay() {
                Object.keys(this.tracks).forEach(trackName => {
                    const steps = document.querySelectorAll(`.sequencer[data-track="${trackName}"] .step`);
                    steps.forEach((step, index) => {
                        step.classList.toggle('active', this.tracks[trackName].steps[index]);
                        step.classList.toggle('current', index === this.currentStep);
                    });
                });
            }

            async togglePlayback() {
                if (!this.audioContext) {
                    await this.initAudio();
                }

                if (this.audioContext.state === 'suspended') {
                    await this.audioContext.resume();
                }

                if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
            }

            play() {
                this.isPlaying = true;
                document.getElementById('playBtn').textContent = '⏸️ 暂停';
                this.updateStatus('正在播放...');
                
                this.stepTimer = setInterval(() => {
                    this.step();
                }, this.stepDuration);
            }

            pause() {
                this.isPlaying = false;
                document.getElementById('playBtn').textContent = '▶️ 播放';
                this.updateStatus('已暂停');
                
                if (this.stepTimer) {
                    clearInterval(this.stepTimer);
                    this.stepTimer = null;
                }
            }

            stop() {
                this.pause();
                this.currentStep = 0;
                this.updateSequencerDisplay();
                this.updateStatus('已停止');
            }

            step() {
                const currentTime = this.audioContext.currentTime;
                
                Object.keys(this.tracks).forEach(trackName => {
                    const track = this.tracks[trackName];
                    if (track.steps[this.currentStep] && !track.muted) {
                        const shouldPlay = this.getSoloState() ? track.solo : true;
                        if (shouldPlay) {
                            this.playSound(trackName, currentTime);
                        }
                    }
                });

                this.currentStep = (this.currentStep + 1) % 16;
                this.updateSequencerDisplay();

                // 添加当前步骤的视觉反馈
                document.querySelectorAll('.step.current').forEach(el => el.classList.remove('current'));
                document.querySelectorAll(`.step[data-step="${this.currentStep}"]`).forEach(el => el.classList.add('current'));
            }

            playSound(soundName, when = 0) {
                if (!this.audioContext || !this.sounds[soundName]) return;

                const sound = this.sounds[soundName];
                const startTime = when || this.audioContext.currentTime;
                
                try {
                    if (sound.noise) {
                        this.playNoiseSound(soundName, startTime);
                    } else {
                        this.playToneSound(soundName, startTime);
                    }
                } catch (error) {
                    console.error('播放声音失败:', error);
                }
            }

            playToneSound(soundName, startTime) {
                const sound = this.sounds[soundName];
                const track = this.tracks[soundName];
                
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.type = sound.type;
                oscillator.frequency.setValueAtTime(sound.frequency, startTime);
                
                // 应用音调效果
                if (track && track.effects.pitch) {
                    const pitchRatio = Math.pow(2, track.effects.pitch / 12);
                    oscillator.frequency.value *= pitchRatio;
                }
                
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(track ? track.volume : 0.5, startTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + sound.duration);
                
                oscillator.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                oscillator.start(startTime);
                oscillator.stop(startTime + sound.duration);
            }

            playNoiseSound(soundName, startTime) {
                const sound = this.sounds[soundName];
                const track = this.tracks[soundName];
                
                const bufferSize = this.audioContext.sampleRate * sound.duration;
                const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
                const output = buffer.getChannelData(0);
                
                for (let i = 0; i < bufferSize; i++) {
                    output[i] = Math.random() * 2 - 1;
                }
                
                const noise = this.audioContext.createBufferSource();
                const gainNode = this.audioContext.createGain();
                const filter = this.audioContext.createBiquadFilter();
                
                noise.buffer = buffer;
                filter.type = 'bandpass';
                filter.frequency.value = sound.frequency;
                filter.Q.value = 5;
                
                // 应用滤波效果
                if (track && track.effects.filter !== undefined) {
                    filter.frequency.value = sound.frequency * (track.effects.filter / 50);
                }
                
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(track ? track.volume : 0.5, startTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + sound.duration);
                
                noise.connect(filter);
                filter.connect(gainNode);
                gainNode.connect(this.masterGain);
                
                noise.start(startTime);
                noise.stop(startTime + sound.duration);
            }

            toggleMute(track) {
                this.tracks[track].muted = !this.tracks[track].muted;
                const btn = document.querySelector(`[data-track="${track}"] .mute-btn`);
                btn.classList.toggle('active', this.tracks[track].muted);
                btn.textContent = this.tracks[track].muted ? '🔈' : '🔇';
                this.updateStatus(`${track} ${this.tracks[track].muted ? '已静音' : '取消静音'}`);
            }

            toggleSolo(track) {
                this.tracks[track].solo = !this.tracks[track].solo;
                const btn = document.querySelector(`[data-track="${track}"] .solo-btn`);
                btn.classList.toggle('active', this.tracks[track].solo);
                this.updateStatus(`${track} ${this.tracks[track].solo ? '独奏模式' : '取消独奏'}`);
            }

            getSoloState() {
                return Object.values(this.tracks).some(track => track.solo);
            }

            toggleRecording() {
                this.isRecording = !this.isRecording;
                const btn = document.getElementById('recordBtn');
                const statusBar = document.getElementById('statusBar');
                
                if (this.isRecording) {
                    btn.textContent = '⏹️ 停止录制';
                    btn.classList.add('recording');
                    statusBar.classList.add('recording');
                    this.recordedPattern = [];
                    this.updateStatus('🔴 正在录制...');
                } else {
                    btn.textContent = '🔴 录制';
                    btn.classList.remove('recording');
                    statusBar.classList.remove('recording');
                    this.updateStatus('录制已停止');
                }
            }

            recordNote(sound) {
                if (this.isRecording) {
                    this.recordedPattern.push({
                        sound: sound,
                        time: Date.now(),
                        step: this.currentStep
                    });
                }
            }

            clearPattern() {
                Object.keys(this.tracks).forEach(track => {
                    this.tracks[track].steps.fill(false);
                });
                this.updateSequencerDisplay();
                this.savePattern();
                this.updateStatus('节拍已清空');
            }

            generateRandomPattern() {
                const densities = { kick: 0.3, snare: 0.25, hihat: 0.6, openhat: 0.15, clap: 0.2, crash: 0.1 };
                
                Object.keys(this.tracks).forEach(track => {
                    const density = densities[track] || 0.3;
                    for (let i = 0; i < 16; i++) {
                        this.tracks[track].steps[i] = Math.random() < density;
                    }
                });
                
                this.updateSequencerDisplay();
                this.savePattern();
                this.updateStatus('已生成随机节拍模式');
            }

            loadPattern(patternName) {
                const pattern = this.patterns[patternName];
                if (!pattern) return;

                Object.keys(pattern).forEach(track => {
                    if (this.tracks[track]) {
                        this.tracks[track].steps = [...pattern[track]];
                    }
                });

                this.updateSequencerDisplay();
                this.savePattern();
                this.updateStatus(`已加载 ${patternName} 节拍模式`);
            }

            savePattern() {
                const pattern = {
                    tracks: this.tracks,
                    tempo: this.tempo,
                    masterVolume: this.masterVolume,
                    swing: this.swing
                };
                localStorage.setItem('beatCreatorPattern', JSON.stringify(pattern));
            }

            loadSavedPattern() {
                const saved = localStorage.getItem('beatCreatorPattern');
                if (saved) {
                    try {
                        const pattern = JSON.parse(saved);
                        this.tracks = { ...this.tracks, ...pattern.tracks };
                        this.tempo = pattern.tempo || 120;
                        this.masterVolume = pattern.masterVolume || 0.7;
                        this.swing = pattern.swing || 0;
                        
                        document.getElementById('tempo').value = this.tempo;
                        document.getElementById('tempoValue').textContent = `${this.tempo} BPM`;
                        document.getElementById('masterVolume').value = this.masterVolume * 100;
                        document.getElementById('volumeValue').textContent = `${Math.round(this.masterVolume * 100)}%`;
                        document.getElementById('swing').value = this.swing * 100;
                        document.getElementById('swingValue').textContent = `${Math.round(this.swing * 100)}%`;
                        
                        this.updateSequencerDisplay();
                        this.updateStatus('已加载保存的节拍模式');
                    } catch (error) {
                        console.error('加载保存的模式失败:', error);
                    }
                }
            }

            updateStatus(message) {
                document.getElementById('statusBar').textContent = message;
                setTimeout(() => {
                    if (!this.isPlaying && !this.isRecording) {
                        document.getElementById('statusBar').textContent = '准备就绪 - 开始创作你的节拍！';
                    }
                }, 3000);
            }
        }

        // 初始化游戏
        document.addEventListener('DOMContentLoaded', () => {
            new BeatCreator();
        });

        // 添加触摸支持
        document.addEventListener('touchstart', function(e) {
            e.preventDefault();
        }, { passive: false });

        // 性能优化
        let lastUpdate = 0;
        function throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        }