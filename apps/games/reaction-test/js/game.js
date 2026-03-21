class ReactionTest {
            constructor() {
                this.mode = 'simple';
                this.isWaiting = false;
                this.isReady = false;
                this.startTime = 0;
                this.results = [];
                this.timeoutId = null;
                this.multipleTestCount = 0;
                this.multipleResults = [];
                
                this.loadStats();
            }
            
            setMode(mode) {
                if (this.isWaiting || this.isReady) return;
                
                this.mode = mode;
                document.querySelectorAll('.mode-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                event.target.classList.add('active');
                
                this.resetArea();
            }
            
            startTest() {
                if (this.isWaiting || this.isReady) return;
                
                this.resetArea();
                this.isWaiting = true;
                this.multipleTestCount = 0;
                this.multipleResults = [];
                
                const area = document.getElementById('reactionArea');
                const icon = document.getElementById('reactionIcon');
                const text = document.getElementById('reactionText');
                
                area.classList.add('waiting');
                icon.textContent = '⏳';
                text.textContent = '等待...准备好后会变绿';
                
                // 随机延迟 1-5 秒
                const delay = Math.random() * 4000 + 1000;
                
                this.timeoutId = setTimeout(() => {
                    this.showReadySignal();
                }, delay);
            }
            
            showReadySignal() {
                if (!this.isWaiting) return;
                
                this.isWaiting = false;
                this.isReady = true;
                this.startTime = performance.now();
                
                const area = document.getElementById('reactionArea');
                const icon = document.getElementById('reactionIcon');
                const text = document.getElementById('reactionText');
                
                area.classList.remove('waiting');
                area.classList.add('ready');
                
                if (this.mode === 'visual') {
                    icon.textContent = '🎯';
                    text.textContent = '点击！';
                } else if (this.mode === 'audio') {
                    icon.textContent = '🔊';
                    text.textContent = '听到声音了吗？点击！';
                    this.playAudioSignal();
                } else {
                    icon.textContent = '✅';
                    text.textContent = '现在点击！';
                }
            }
            
            playAudioSignal() {
                // 创建音频信号
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            }
            
            handleClick() {
                if (this.isWaiting) {
                    // 提前点击
                    this.handleEarlyClick();
                } else if (this.isReady) {
                    // 正确反应
                    this.recordReaction();
                } else {
                    // 开始测试
                    this.startTest();
                }
            }
            
            handleEarlyClick() {
                if (this.timeoutId) {
                    clearTimeout(this.timeoutId);
                    this.timeoutId = null;
                }
                
                this.isWaiting = false;
                
                const area = document.getElementById('reactionArea');
                const icon = document.getElementById('reactionIcon');
                const text = document.getElementById('reactionText');
                
                area.classList.remove('waiting');
                area.classList.add('clicked');
                icon.textContent = '❌';
                text.textContent = '太早了！等信号变绿再点击';
                
                setTimeout(() => {
                    this.resetArea();
                }, 2000);
            }
            
            recordReaction() {
                const endTime = performance.now();
                const reactionTime = Math.round(endTime - this.startTime);
                
                this.isReady = false;
                
                const area = document.getElementById('reactionArea');
                const icon = document.getElementById('reactionIcon');
                const text = document.getElementById('reactionText');
                
                area.classList.remove('ready');
                area.classList.add('clicked');
                
                const rating = this.getRating(reactionTime);
                icon.textContent = rating.emoji;
                text.textContent = `${reactionTime}ms - ${rating.text}`;
                
                this.results.push({
                    time: reactionTime,
                    mode: this.mode,
                    timestamp: new Date()
                });
                
                if (this.mode === 'multiple') {
                    this.multipleResults.push(reactionTime);
                    this.multipleTestCount++;
                    
                    if (this.multipleTestCount < 5) {
                        setTimeout(() => {
                            text.textContent += ` (${this.multipleTestCount}/5)`;
                            setTimeout(() => {
                                this.startTest();
                            }, 1500);
                        }, 1000);
                        return;
                    } else {
                        // 计算平均值
                        const avgTime = Math.round(
                            this.multipleResults.reduce((a, b) => a + b, 0) / this.multipleResults.length
                        );
                        text.textContent = `完成！平均: ${avgTime}ms`;
                    }
                }
                
                this.updateStats();
                this.updateResultsList();
                this.saveStats();
                
                setTimeout(() => {
                    this.resetArea();
                }, 3000);
            }
            
            getRating(time) {
                if (time < 200) {
                    return { emoji: '⚡', text: '闪电般反应!' };
                } else if (time < 250) {
                    return { emoji: '🚀', text: '优秀!' };
                } else if (time < 300) {
                    return { emoji: '👍', text: '良好!' };
                } else if (time < 400) {
                    return { emoji: '👌', text: '一般' };
                } else {
                    return { emoji: '🐌', text: '需要练习' };
                }
            }
            
            resetArea() {
                const area = document.getElementById('reactionArea');
                const icon = document.getElementById('reactionIcon');
                const text = document.getElementById('reactionText');
                
                area.className = 'reaction-area';
                icon.textContent = '⚡';
                text.textContent = '点击开始测试你的反应速度';
                
                this.isWaiting = false;
                this.isReady = false;
                
                if (this.timeoutId) {
                    clearTimeout(this.timeoutId);
                    this.timeoutId = null;
                }
            }
            
            updateStats() {
                const lastResult = this.results[this.results.length - 1];
                
                document.getElementById('lastTime').textContent = lastResult.time + 'ms';
                document.getElementById('testCount').textContent = this.results.length;
                
                if (this.results.length > 0) {
                    const avgTime = Math.round(
                        this.results.reduce((sum, result) => sum + result.time, 0) / this.results.length
                    );
                    document.getElementById('avgTime').textContent = avgTime + 'ms';
                    
                    const bestTime = Math.min(...this.results.map(r => r.time));
                    document.getElementById('bestTime').textContent = bestTime + 'ms';
                }
            }
            
            updateResultsList() {
                const container = document.getElementById('resultsList');
                
                if (this.results.length === 0) {
                    container.innerHTML = '<div class="empty-results">开始测试后将显示结果</div>';
                    return;
                }
                
                container.innerHTML = '';
                
                // 显示最近10次结果
                const recentResults = this.results.slice(-10).reverse();
                
                recentResults.forEach((result, index) => {
                    const item = document.createElement('div');
                    item.className = 'result-item';
                    
                    const rating = this.getRating(result.time);
                    
                    item.innerHTML = `
                        <div>
                            <span>测试 ${this.results.length - index}</span>
                            <span class="result-rating">(${result.mode})</span>
                        </div>
                        <div class="result-time">${result.time}ms ${rating.emoji}</div>
                    `;
                    
                    container.appendChild(item);
                });
            }
            
            resetStats() {
                if (confirm('确定要重置所有统计数据吗？')) {
                    this.results = [];
                    
                    document.getElementById('lastTime').textContent = '--';
                    document.getElementById('avgTime').textContent = '--';
                    document.getElementById('bestTime').textContent = '--';
                    document.getElementById('testCount').textContent = '0';
                    
                    this.updateResultsList();
                    this.saveStats();
                }
            }
            
            saveStats() {
                try {
                    localStorage.setItem('reactionTest_results', JSON.stringify(this.results));
                } catch (e) {
                    console.warn('无法保存统计数据');
                }
            }
            
            loadStats() {
                try {
                    const saved = localStorage.getItem('reactionTest_results');
                    if (saved) {
                        this.results = JSON.parse(saved);
                        this.updateStats();
                        this.updateResultsList();
                    }
                } catch (e) {
                    console.warn('无法加载统计数据');
                }
            }
            
            showHelp() {
                document.getElementById('helpPopup').classList.add('show');
            }
            
            closeHelp() {
                document.getElementById('helpPopup').classList.remove('show');
            }
        }

        // 全局变量
        let reactionTest;

        // 页面加载完成后初始化
        document.addEventListener('DOMContentLoaded', () => {
            reactionTest = new ReactionTest();
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                reactionTest.handleClick();
            }
        });