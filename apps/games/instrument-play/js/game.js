class InstrumentGame {
    constructor() {
        this.currentInstrument = 'piano';
        this.volume = 70;
        this.isRecording = false;
        this.recordedNotes = [];
        this.isPlaying = false;
        
        this.notes = {
            piano: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
            guitar: ['E', 'A', 'D', 'G', 'B', 'E'],
            drums: ['Kick', 'Snare', 'Hi-Hat', 'Tom1', 'Tom2', 'Crash'],
            violin: ['G', 'D', 'A', 'E']
        };
        
        this.initializeInstrument();
        this.bindEvents();
    }

    initializeInstrument() {
        this.renderInstrument(this.currentInstrument);
    }

    bindEvents() {
        // 乐器选择
        document.querySelectorAll('.instrument-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchInstrument(e.target.dataset.instrument, e.target);
            });
        });

        // 音量控制
        document.getElementById('volumeSlider').addEventListener('click', (e) => {
            this.adjustVolume(e);
        });

        // 控制按钮
        document.getElementById('playBtn').addEventListener('click', () => {
            this.togglePlay();
        });

        document.getElementById('recordBtn').addEventListener('click', () => {
            this.toggleRecord();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearRecording();
        });

        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveRecording();
        });
    }

    switchInstrument(instrument, button) {
        document.querySelectorAll('.instrument-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        this.currentInstrument = instrument;
        this.renderInstrument(instrument);
        this.updateNoteDisplay(`切换到${this.getInstrumentName(instrument)}`);
    }

    renderInstrument(instrument) {
        const display = document.getElementById('instrumentDisplay');
        display.innerHTML = '';
        
        switch (instrument) {
            case 'piano':
                this.renderPiano(display);
                break;
            case 'guitar':
                this.renderGuitar(display);
                break;
            case 'drums':
                this.renderDrums(display);
                break;
            case 'violin':
                this.renderViolin(display);
                break;
        }
    }

    renderPiano(container) {
        const piano = document.createElement('div');
        piano.className = 'piano';
        
        const whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const blackKeys = ['C#', 'D#', 'F#', 'G#', 'A#'];
        const blackKeyPositions = [0.5, 1.5, 3.5, 4.5, 5.5];
        
        // 白键
        whiteKeys.forEach((note, index) => {
            const key = document.createElement('div');
            key.className = 'piano-key white-key';
            key.textContent = note;
            key.addEventListener('click', () => this.playNote(note));
            piano.appendChild(key);
        });
        
        // 黑键
        blackKeys.forEach((note, index) => {
            const key = document.createElement('div');
            key.className = 'piano-key black-key';
            key.textContent = note;
            key.style.left = `${blackKeyPositions[index] * 52 + 35}px`;
            key.addEventListener('click', () => this.playNote(note));
            piano.appendChild(key);
        });
        
        container.appendChild(piano);
    }

    renderGuitar(container) {
        const guitar = document.createElement('div');
        guitar.className = 'guitar';
        
        const neck = document.createElement('div');
        neck.className = 'guitar-neck';
        
        // 吉他弦
        this.notes.guitar.forEach((note, index) => {
            const string = document.createElement('div');
            string.className = 'guitar-string';
            string.style.top = `${40 + index * 40}px`;
            string.addEventListener('click', () => this.playNote(note));
            neck.appendChild(string);
        });
        
        // 品格
        for (let i = 1; i <= 12; i++) {
            const fret = document.createElement('div');
            fret.className = 'guitar-fret';
            fret.style.left = `${i * 45}px`;
            neck.appendChild(fret);
        }
        
        guitar.appendChild(neck);
        container.appendChild(guitar);
    }

    renderDrums(container) {
        const drums = document.createElement('div');
        drums.className = 'drums';
        
        const drumTypes = [
            { name: 'Kick', class: 'kick-drum', symbol: '🥁' },
            { name: 'Snare', class: 'snare-drum', symbol: '🥁' },
            { name: 'Hi-Hat', class: 'hi-hat', symbol: '🎵' },
            { name: 'Tom1', class: 'tom1', symbol: '🥁' },
            { name: 'Tom2', class: 'tom2', symbol: '🥁' },
            { name: 'Crash', class: 'crash', symbol: '💥' }
        ];
        
        drumTypes.forEach(drum => {
            const drumElement = document.createElement('div');
            drumElement.className = `drum ${drum.class}`;
            drumElement.textContent = drum.symbol;
            drumElement.addEventListener('click', () => this.playNote(drum.name));
            drums.appendChild(drumElement);
        });
        
        container.appendChild(drums);
    }

    renderViolin(container) {
        const violin = document.createElement('div');
        violin.className = 'violin';
        
        // 小提琴弦
        this.notes.violin.forEach((note, index) => {
            const string = document.createElement('div');
            string.className = 'violin-string';
            string.style.left = `${60 + index * 25}px`;
            string.addEventListener('click', () => this.playNote(note));
            violin.appendChild(string);
        });
        
        // 琴弓
        const bow = document.createElement('div');
        bow.className = 'violin-bow';
        bow.addEventListener('click', () => this.playNote('Bow'));
        violin.appendChild(bow);
        
        container.appendChild(violin);
    }

    playNote(note) {
        this.updateNoteDisplay(`演奏: ${note}`);
        
        // 视觉反馈
        this.addVisualFeedback(note);
        
        // 录制音符
        if (this.isRecording) {
            this.recordedNotes.push({
                note: note,
                instrument: this.currentInstrument,
                timestamp: Date.now()
            });
        }
        
        // 模拟音频播放
        console.log(`Playing ${note} on ${this.currentInstrument} at volume ${this.volume}%`);
    }

    addVisualFeedback(note) {
        // 为对应的按键添加激活效果
        const keys = document.querySelectorAll('.piano-key, .guitar-string, .drum, .violin-string');
        keys.forEach(key => {
            if (key.textContent === note || key.textContent.includes(note)) {
                key.classList.add('active');
                setTimeout(() => {
                    key.classList.remove('active');
                }, 200);
            }
        });
    }

    adjustVolume(e) {
        const slider = document.getElementById('volumeSlider');
        const rect = slider.getBoundingClientRect();
        const percentage = ((e.clientX - rect.left) / rect.width) * 100;
        
        this.volume = Math.max(0, Math.min(100, percentage));
        
        document.getElementById('volumeFill').style.width = `${this.volume}%`;
        document.getElementById('volumeValue').textContent = `${Math.round(this.volume)}%`;
    }

    togglePlay() {
        const btn = document.getElementById('playBtn');
        
        if (this.isPlaying) {
            this.isPlaying = false;
            btn.textContent = '▶️ 播放';
            this.updateNoteDisplay('播放停止');
        } else {
            this.isPlaying = true;
            btn.textContent = '⏸️ 暂停';
            this.playRecording();
        }
    }

    toggleRecord() {
        const btn = document.getElementById('recordBtn');
        
        if (this.isRecording) {
            this.isRecording = false;
            btn.textContent = '🔴 录制';
            btn.classList.remove('recording');
            this.updateNoteDisplay(`录制完成，共${this.recordedNotes.length}个音符`);
        } else {
            this.isRecording = true;
            btn.textContent = '⏹️ 停止录制';
            btn.classList.add('recording');
            this.recordedNotes = [];
            this.updateNoteDisplay('开始录制...');
        }
    }

    clearRecording() {
        this.recordedNotes = [];
        this.updateNoteDisplay('录制已清除');
    }

    saveRecording() {
        if (this.recordedNotes.length === 0) {
            this.updateNoteDisplay('没有可保存的录制');
            return;
        }
        
        const data = {
            notes: this.recordedNotes,
            timestamp: new Date().toISOString()
        };
        
        // 模拟保存到本地存储
        localStorage.setItem('instrumentRecording', JSON.stringify(data));
        this.updateNoteDisplay(`已保存${this.recordedNotes.length}个音符`);
    }

    playRecording() {
        if (this.recordedNotes.length === 0) {
            this.updateNoteDisplay('没有可播放的录制');
            this.isPlaying = false;
            document.getElementById('playBtn').textContent = '▶️ 播放';
            return;
        }
        
        let index = 0;
        const playNext = () => {
            if (index >= this.recordedNotes.length || !this.isPlaying) {
                this.isPlaying = false;
                document.getElementById('playBtn').textContent = '▶️ 播放';
                this.updateNoteDisplay('播放完成');
                return;
            }
            
            const noteData = this.recordedNotes[index];
            this.playNote(noteData.note);
            index++;
            
            setTimeout(playNext, 500); // 每个音符间隔500ms
        };
        
        playNext();
    }

    updateNoteDisplay(message) {
        document.getElementById('noteDisplay').textContent = message;
    }

    getInstrumentName(instrument) {
        const names = {
            piano: '钢琴',
            guitar: '吉他',
            drums: '鼓组',
            violin: '小提琴'
        };
        return names[instrument] || instrument;
    }
}

// 启动乐器游戏
window.addEventListener('DOMContentLoaded', () => {
    new InstrumentGame();
});