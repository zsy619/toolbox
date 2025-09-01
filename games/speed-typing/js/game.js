class SpeedTyping {
            constructor() {
                this.duration = 60; // 默认60秒
                this.textType = 'common';
                this.difficulty = 'easy';
                this.isActive = false;
                this.isPaused = false;
                
                // 测试数据
                this.currentText = '';
                this.typedText = '';
                this.currentIndex = 0;
                this.startTime = 0;
                this.timeLeft = 60;
                this.timer = null;
                
                // 统计数据
                this.correctChars = 0;
                this.incorrectChars = 0;
                this.totalKeystrokes = 0;
                this.mistakes = new Map();
                
                // 文本库
                this.textLibrary = {
                    common: [
                        '时间 管理 效率 工作 学习 生活 健康 运动 阅读 思考',
                        '科技 创新 发展 进步 改变 未来 机会 挑战 成功 失败',
                        '友谊 爱情 家庭 亲情 理解 支持 信任 包容 感恩 快乐',
                        '梦想 目标 计划 行动 坚持 努力 奋斗 成长 收获 满足',
                        '自然 环境 保护 地球 气候 生态 动物 植物 森林 海洋'
                    ],
                    english: [
                        'The quick brown fox jumps over the lazy dog near the riverbank.',
                        'Technology has revolutionized the way we communicate and work together.',
                        'Learning new skills requires patience, practice, and dedication to improvement.',
                        'Success comes to those who are willing to work hard and never give up.',
                        'The beautiful sunset painted the sky with vibrant colors of orange and pink.'
                    ],
                    numbers: [
                        '123 456 789 0.50 $25.99 @email.com #hashtag 100% 3:45pm',
                        '(555) 123-4567 www.example.com user@domain.org file_name.txt',
                        'Order #12345: $67.89 - Qty: 3 @ $22.63 each (Tax: 8.5%)',
                        'API_KEY=abc123xyz789 PORT=8080 DEBUG=true VERSION=1.2.3',
                        'Date: 2024/03/15 Time: 14:30:25 ID: A1B2C3 Score: 95.7%'
                    ],
                    mixed: [
                        'Hello world! 今天天气很好，温度25°C，湿度60%。Meeting @ 3:30pm.',
                        'Code: function test() { return "Hello, 世界!"; } // Comments 注释',
                        'Email: user@example.com Phone: +86-138-0013-8000 微信: wechat123',
                        'Shopping list: 🍎苹果 $2.50, 🥛牛奶 ¥15.80, 🍞面包 €3.20',
                        'Password: Abc123@#$ Username: user_2024 验证码: 6789'
                    ]
                };
                
                this.bindEvents();
                this.updateDisplay();
            }
            
            bindEvents() {
                const input = document.getElementById('typingInput');
                
                input.addEventListener('input', (e) => {
                    if (this.isActive) {
                        this.handleInput(e.target.value);
                    }
                });
                
                input.addEventListener('keydown', (e) => {
                    if (this.isActive) {
                        this.totalKeystrokes++;
                    }
                });
                
                // 防止失去焦点
                input.addEventListener('blur', () => {
                    if (this.isActive) {
                        setTimeout(() => input.focus(), 10);
                    }
                });
                
                // 快捷键
                document.addEventListener('keydown', (e) => {
                    if (e.ctrlKey && e.key === 'Enter') {
                        e.preventDefault();
                        if (!this.isActive) {
                            this.startTest();
                        } else {
                            this.restartTest();
                        }
                    }
                });
            }
            
            setDuration(duration) {
                if (this.isActive) return;
                
                this.duration = duration;
                this.timeLeft = duration;
                
                document.querySelectorAll('.test-settings .setting-buttons')[0]
                    .querySelectorAll('.setting-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                event.target.classList.add('active');
                
                this.updateDisplay();
            }
            
            setTextType(type) {
                if (this.isActive) return;
                
                this.textType = type;
                
                document.querySelectorAll('.test-settings .setting-buttons')[1]
                    .querySelectorAll('.setting-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                event.target.classList.add('active');
            }
            
            setDifficulty(difficulty) {
                if (this.isActive) return;
                
                this.difficulty = difficulty;
                
                document.querySelectorAll('.test-settings .setting-buttons')[2]
                    .querySelectorAll('.setting-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                event.target.classList.add('active');
            }
            
            generateText() {
                const texts = this.textLibrary[this.textType];
                let selectedTexts = [];
                
                // 根据难度选择文本数量
                const textCount = {
                    easy: 2,
                    medium: 3,
                    hard: 4
                }[this.difficulty];
                
                // 随机选择文本
                for (let i = 0; i < textCount; i++) {
                    const randomIndex = Math.floor(Math.random() * texts.length);
                    selectedTexts.push(texts[randomIndex]);
                }
                
                return selectedTexts.join(' ');
            }
            
            startTest() {
                this.isActive = true;
                this.startTime = Date.now();
                this.timeLeft = this.duration;
                this.currentIndex = 0;
                this.typedText = '';
                this.correctChars = 0;
                this.incorrectChars = 0;
                this.totalKeystrokes = 0;
                this.mistakes.clear();
                
                // 生成测试文本
                this.currentText = this.generateText();
                
                // 更新UI
                document.getElementById('startBtn').disabled = true;
                document.getElementById('restartBtn').disabled = false;
                document.getElementById('typingInput').disabled = false;
                document.getElementById('typingInput').focus();
                document.getElementById('resultsPanel').classList.remove('show');
                
                this.displayText();
                this.startTimer();
                this.updateDisplay();
            }
            
            restartTest() {
                this.endTest();
                setTimeout(() => this.startTest(), 100);
            }
            
            startTimer() {
                this.timer = setInterval(() => {
                    this.timeLeft--;
                    this.updateDisplay();
                    
                    if (this.timeLeft <= 0) {
                        this.endTest();
                    }
                }, 1000);
            }
            
            handleInput(inputValue) {
                this.typedText = inputValue;
                
                // 检查输入
                let correctCount = 0;
                let incorrectCount = 0;
                
                for (let i = 0; i < this.typedText.length; i++) {
                    if (i < this.currentText.length) {
                        if (this.typedText[i] === this.currentText[i]) {
                            correctCount++;
                        } else {
                            incorrectCount++;
                            // 记录错误字符
                            const expected = this.currentText[i];
                            const typed = this.typedText[i];
                            const key = `${expected} → ${typed}`;
                            this.mistakes.set(key, (this.mistakes.get(key) || 0) + 1);
                        }
                    } else {
                        incorrectCount++;
                    }
                }
                
                this.correctChars = correctCount;
                this.incorrectChars = incorrectCount;
                this.currentIndex = this.typedText.length;
                
                this.displayText();
                this.updateDisplay();
                
                // 检查是否完成
                if (this.typedText.length >= this.currentText.length) {
                    setTimeout(() => this.endTest(), 100);
                }
            }
            
            displayText() {
                const textDisplay = document.getElementById('textDisplay');
                let html = '';
                
                for (let i = 0; i < this.currentText.length; i++) {
                    const char = this.currentText[i];
                    let className = '';
                    
                    if (i < this.typedText.length) {
                        className = this.typedText[i] === char ? 'correct' : 'incorrect';
                    } else if (i === this.currentIndex) {
                        className = 'current';
                    }
                    
                    html += `<span class="char ${className}">${char === ' ' ? '&nbsp;' : char}</span>`;
                }
                
                textDisplay.innerHTML = html;
            }
            
            updateDisplay() {
                const elapsed = this.isActive ? (Date.now() - this.startTime) / 1000 : 0;
                const totalChars = this.correctChars + this.incorrectChars;
                
                // 计算WPM (以5个字符为一个单词)
                const wpm = elapsed > 0 ? Math.round((this.correctChars / 5) / (elapsed / 60)) : 0;
                
                // 计算准确率
                const accuracy = totalChars > 0 ? Math.round((this.correctChars / totalChars) * 100) : 100;
                
                // 计算已输入词数
                const wordsTyped = Math.floor(this.correctChars / 5);
                
                document.getElementById('wpm').textContent = wpm;
                document.getElementById('accuracy').textContent = accuracy + '%';
                document.getElementById('timeLeft').textContent = this.timeLeft;
                document.getElementById('wordsTyped').textContent = wordsTyped;
                
                // 更新进度条
                const progress = ((this.duration - this.timeLeft) / this.duration) * 100;
                document.getElementById('progressFill').style.width = progress + '%';
                
                let progressText = `已完成 ${progress.toFixed(1)}%`;
                if (this.isActive) {
                    progressText += ` • ${this.typedText.length}/${this.currentText.length} 字符`;
                }
                document.getElementById('progressText').textContent = progressText;
            }
            
            endTest() {
                this.isActive = false;
                
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                
                document.getElementById('startBtn').disabled = false;
                document.getElementById('restartBtn').disabled = true;
                document.getElementById('typingInput').disabled = true;
                document.getElementById('typingInput').value = '';
                
                this.showResults();
            }
            
            showResults() {
                const elapsed = this.startTime ? (Date.now() - this.startTime) / 1000 : 0;
                const totalChars = this.correctChars + this.incorrectChars;
                
                // 计算最终结果
                const wpm = elapsed > 0 ? Math.round((this.correctChars / 5) / (elapsed / 60)) : 0;
                const accuracy = totalChars > 0 ? Math.round((this.correctChars / totalChars) * 100) : 100;
                
                // 等级评价
                let rating = '练习级';
                if (wpm >= 60 && accuracy >= 95) {
                    rating = '大师级 🏆';
                } else if (wpm >= 40 && accuracy >= 90) {
                    rating = '专家级 ⭐';
                } else if (wpm >= 25 && accuracy >= 85) {
                    rating = '熟练级 👍';
                } else if (wpm >= 15 && accuracy >= 80) {
                    rating = '入门级 📚';
                }
                
                // 更新结果显示
                document.getElementById('finalWPM').textContent = wpm;
                document.getElementById('finalAccuracy').textContent = accuracy + '%';
                document.getElementById('totalChars').textContent = totalChars;
                document.getElementById('correctChars').textContent = this.correctChars;
                document.getElementById('incorrectChars').textContent = this.incorrectChars;
                document.getElementById('rating').textContent = rating;
                
                // 显示错误分析
                if (this.mistakes.size > 0) {
                    const mistakesDisplay = document.getElementById('mistakesDisplay');
                    const mistakesList = document.getElementById('mistakesList');
                    
                    let mistakesHtml = '';
                    const sortedMistakes = Array.from(this.mistakes.entries())
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5);
                    
                    sortedMistakes.forEach(([mistake, count]) => {
                        mistakesHtml += `
                            <div class="mistake-item">
                                <span>${mistake}</span>
                                <span>${count}次</span>
                            </div>
                        `;
                    });
                    
                    mistakesList.innerHTML = mistakesHtml;
                    mistakesDisplay.style.display = 'block';
                } else {
                    document.getElementById('mistakesDisplay').style.display = 'none';
                }
                
                document.getElementById('resultsPanel').classList.add('show');
            }
            
            showHelp() {
                document.getElementById('helpPopup').classList.add('show');
            }
            
            closeHelp() {
                document.getElementById('helpPopup').classList.remove('show');
            }
        }

        // 全局变量
        let speedTyping;

        // 页面加载完成后初始化
        document.addEventListener('DOMContentLoaded', () => {
            speedTyping = new SpeedTyping();
        });