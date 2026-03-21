class Magic8Ball {
            constructor() {
                this.isShaking = false;
                this.currentCategory = 'general';
                this.language = 'zh';
                this.mood = 'classic';
                this.history = [];
                this.stats = {
                    totalQuestions: 0,
                    positiveAnswers: 0,
                    todayQuestions: 0,
                    luckyStreak: 0
                };

                this.answers = {
                    zh: {
                        general: {
                            positive: [
                                '是的，绝对如此', '毫无疑问', '肯定是的', '你可以依赖它',
                                '我认为是的', '最有可能', '前景很好', '是的',
                                '标志表明是的', '回复朦胧，请再试一次'
                            ],
                            negative: [
                                '不要指望它', '我的回答是否定的', '我的消息来源说不',
                                '前景不太好', '非常可疑'
                            ],
                            neutral: [
                                '回复朦胧，请再试一次', '稍后再问', '最好现在不告诉你',
                                '无法预测', '专注并再问一次'
                            ]
                        },
                        love: {
                            positive: [
                                '爱情正在向你走来', '真爱就在眼前', '心有所属，情有所归',
                                '缘分天注定', '情深意浓，白头偕老', '爱情甜蜜如蜜糖'
                            ],
                            negative: [
                                '此情可待成追忆', '缘分未到', '情路坎坷需谨慎',
                                '感情需要时间沉淀', '爱情需要更多耐心'
                            ],
                            neutral: [
                                '爱情扑朔迷离', '感情变化莫测', '缘分需要等待',
                                '爱情需要时间验证', '情感状态复杂'
                            ]
                        },
                        career: {
                            positive: [
                                '事业蒸蒸日上', '成功指日可待', '前程似锦',
                                '贵人相助，事半功倍', '机遇难得，把握良机', '升职加薪在望'
                            ],
                            negative: [
                                '事业需要更多努力', '暂时遇到瓶颈', '需要调整策略',
                                '时机尚未成熟', '需要积累更多经验'
                            ],
                            neutral: [
                                '事业发展平稳', '需要耐心等待', '保持现状为佳',
                                '发展态势不明朗', '需要观察时机'
                            ]
                        },
                        health: {
                            positive: [
                                '身体健康，精神饱满', '体魄强健', '生命力旺盛',
                                '健康状况良好', '身心愉悦', '活力四射'
                            ],
                            negative: [
                                '需要注意身体', '劳逸结合很重要', '健康需要关注',
                                '注意休息调养', '预防胜于治疗'
                            ],
                            neutral: [
                                '健康状况一般', '需要定期检查', '保持良好习惯',
                                '健康需要维护', '注意生活规律'
                            ]
                        },
                        money: {
                            positive: [
                                '财运亨通', '金钱滚滚来', '财源广进',
                                '投资有回报', '意外之财降临', '财富增长可期'
                            ],
                            negative: [
                                '理财需谨慎', '避免冲动消费', '财务状况紧张',
                                '投资需要三思', '节约开支为上'
                            ],
                            neutral: [
                                '财务状况平稳', '收支基本平衡', '理财需要规划',
                                '财运平平', '需要开源节流'
                            ]
                        },
                        study: {
                            positive: [
                                '学业进步神速', '考试顺利通过', '学习效果显著',
                                '知识面不断扩展', '成绩优异', '学习目标可达成'
                            ],
                            negative: [
                                '学习需要更加努力', '基础需要巩固', '学习方法需改进',
                                '考试压力较大', '需要加强复习'
                            ],
                            neutral: [
                                '学习进度正常', '需要持续努力', '学习状态一般',
                                '知识掌握中等', '需要制定学习计划'
                            ]
                        }
                    },
                    en: {
                        general: {
                            positive: [
                                'It is certain', 'It is decidedly so', 'Without a doubt', 'Yes definitely',
                                'You may rely on it', 'As I see it, yes', 'Most likely', 'Outlook good',
                                'Yes', 'Signs point to yes'
                            ],
                            negative: [
                                "Don't count on it", 'My reply is no', 'My sources say no',
                                'Outlook not so good', 'Very doubtful'
                            ],
                            neutral: [
                                'Reply hazy, try again', 'Ask again later', 'Better not tell you now',
                                'Cannot predict now', 'Concentrate and ask again'
                            ]
                        }
                    }
                };

                this.moods = {
                    classic: '🎱',
                    mystical: '🔮',
                    modern: '💎',
                    humorous: '😄'
                };

                this.init();
            }

            init() {
                this.setupEventListeners();
                this.loadData();
                this.updateStats();
                this.createParticles();
            }

            setupEventListeners() {
                const shakeBtn = document.getElementById('shakeBtn');
                const askAgainBtn = document.getElementById('askAgainBtn');
                const magicBall = document.getElementById('magicBall');
                const clearHistoryBtn = document.getElementById('clearHistoryBtn');
                const languageSelect = document.getElementById('languageSelect');
                const moodSelect = document.getElementById('moodSelect');

                shakeBtn.addEventListener('click', () => this.shakeBall());
                askAgainBtn.addEventListener('click', () => this.askAgain());
                magicBall.addEventListener('click', () => this.shakeBall());
                clearHistoryBtn.addEventListener('click', () => this.clearHistory());

                languageSelect.addEventListener('change', (e) => {
                    this.language = e.target.value;
                    this.saveData();
                });

                moodSelect.addEventListener('change', (e) => {
                    this.mood = e.target.value;
                    this.updateMoodDisplay();
                    this.saveData();
                });

                // 分类按钮
                document.querySelectorAll('.category-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                        e.target.classList.add('active');
                        this.currentCategory = e.target.dataset.category;
                    });
                });

                // 键盘快捷键
                document.addEventListener('keydown', (e) => {
                    if (e.code === 'Space' && !e.target.matches('textarea, input')) {
                        e.preventDefault();
                        this.shakeBall();
                    }
                    if (e.code === 'Enter' && e.ctrlKey) {
                        this.shakeBall();
                    }
                });

                // 触摸支持
                let touchStartY = 0;
                magicBall.addEventListener('touchstart', (e) => {
                    touchStartY = e.touches[0].clientY;
                });

                magicBall.addEventListener('touchend', (e) => {
                    const touchEndY = e.changedTouches[0].clientY;
                    const deltaY = Math.abs(touchEndY - touchStartY);
                    if (deltaY > 50) {
                        this.shakeBall();
                    }
                });
            }

            async shakeBall() {
                if (this.isShaking) return;

                const question = document.getElementById('questionInput').value.trim();
                if (!question) {
                    this.showError('请先输入一个问题！');
                    return;
                }

                this.isShaking = true;
                const magicBall = document.getElementById('magicBall');
                const answerText = document.getElementById('answerText');
                const loadingSpinner = document.getElementById('loadingSpinner');
                const shakeBtn = document.getElementById('shakeBtn');
                const askAgainBtn = document.getElementById('askAgainBtn');

                // 开始动画
                magicBall.classList.add('shaking', 'glowing');
                answerText.classList.remove('visible');
                loadingSpinner.style.display = 'block';
                shakeBtn.disabled = true;
                askAgainBtn.disabled = true;

                this.createMysticalEffects();

                // 等待动画完成
                await this.delay(1200);

                // 获取答案
                const answer = this.getRandomAnswer();
                
                // 显示答案
                loadingSpinner.style.display = 'none';
                answerText.textContent = answer.text;
                answerText.classList.add('visible');

                // 更新心情显示
                this.updatePredictionMood(answer.type);

                // 保存到历史
                this.addToHistory(question, answer.text, answer.type);

                // 更新统计
                this.updateStatsAfterAnswer(answer.type);

                // 结束动画
                await this.delay(500);
                magicBall.classList.remove('shaking', 'glowing');
                
                this.isShaking = false;
                shakeBtn.disabled = false;
                askAgainBtn.disabled = false;

                // 清空问题输入框
                document.getElementById('questionInput').value = '';
            }

            getRandomAnswer() {
                const categoryAnswers = this.answers[this.language === 'mix' ? 'zh' : this.language];
                const answers = categoryAnswers[this.currentCategory] || categoryAnswers.general;
                
                const allAnswers = [
                    ...answers.positive.map(text => ({ text, type: 'positive' })),
                    ...answers.negative.map(text => ({ text, type: 'negative' })),
                    ...answers.neutral.map(text => ({ text, type: 'neutral' }))
                ];

                // 添加一些随机性权重
                const weights = { positive: 40, negative: 30, neutral: 30 };
                const rand = Math.random() * 100;
                
                let selectedType;
                if (rand < weights.positive) {
                    selectedType = 'positive';
                } else if (rand < weights.positive + weights.negative) {
                    selectedType = 'negative';
                } else {
                    selectedType = 'neutral';
                }

                const typeAnswers = allAnswers.filter(a => a.type === selectedType);
                return typeAnswers[Math.floor(Math.random() * typeAnswers.length)];
            }

            updatePredictionMood(answerType) {
                const moodEmoji = document.querySelector('.mood-emoji');
                const moodText = document.querySelector('.mood-text');
                
                const moods = {
                    positive: { emoji: '✨', text: '星光闪耀，好运降临！' },
                    negative: { emoji: '🌫️', text: '迷雾重重，需要耐心...' },
                    neutral: { emoji: '🌙', text: '静待时机，保持平和。' }
                };

                const mood = moods[answerType];
                moodEmoji.textContent = mood.emoji;
                moodText.textContent = mood.text;
            }

            updateMoodDisplay() {
                const emoji = this.moods[this.mood];
                document.querySelector('.mood-emoji').textContent = emoji;
            }

            createMysticalEffects() {
                const effectsContainer = document.getElementById('mysticalEffects');
                
                for (let i = 0; i < 20; i++) {
                    setTimeout(() => {
                        const particle = document.createElement('div');
                        particle.className = 'particle';
                        particle.style.left = Math.random() * 100 + '%';
                        particle.style.animationDelay = Math.random() * 2 + 's';
                        particle.style.animationDuration = (2 + Math.random() * 2) + 's';
                        
                        effectsContainer.appendChild(particle);
                        
                        setTimeout(() => {
                            particle.remove();
                        }, 4000);
                    }, i * 50);
                }
            }

            createParticles() {
                const magicBall = document.getElementById('magicBall');
                setInterval(() => {
                    if (!this.isShaking && Math.random() < 0.3) {
                        const particle = document.createElement('div');
                        particle.className = 'particle';
                        particle.style.left = Math.random() * 100 + '%';
                        particle.style.top = '90%';
                        particle.style.animationDuration = (3 + Math.random() * 2) + 's';
                        
                        magicBall.appendChild(particle);
                        
                        setTimeout(() => {
                            particle.remove();
                        }, 5000);
                    }
                }, 2000);
            }

            askAgain() {
                document.getElementById('questionInput').focus();
            }

            addToHistory(question, answer, type) {
                const historyItem = {
                    question: question,
                    answer: answer,
                    type: type,
                    category: this.currentCategory,
                    timestamp: new Date().toISOString(),
                    date: new Date().toLocaleDateString('zh-CN')
                };

                this.history.unshift(historyItem);
                if (this.history.length > 50) {
                    this.history = this.history.slice(0, 50);
                }

                this.updateHistoryDisplay();
                this.saveData();
            }

            updateHistoryDisplay() {
                const historyList = document.getElementById('historyList');
                
                if (this.history.length === 0) {
                    historyList.innerHTML = '<div style="text-align: center; color: rgba(255,255,255,0.6); padding: 20px;">暂无占卜记录</div>';
                    return;
                }

                historyList.innerHTML = this.history.slice(0, 10).map(item => `
                    <div class="history-item">
                        <div class="history-question">${this.escapeHtml(item.question)}</div>
                        <div class="history-answer">"${item.answer}"</div>
                        <div class="history-time">${new Date(item.timestamp).toLocaleString('zh-CN')}</div>
                    </div>
                `).join('');
            }

            updateStatsAfterAnswer(answerType) {
                this.stats.totalQuestions++;
                
                if (answerType === 'positive') {
                    this.stats.positiveAnswers++;
                    this.stats.luckyStreak++;
                } else {
                    this.stats.luckyStreak = 0;
                }

                const today = new Date().toDateString();
                const savedDate = localStorage.getItem('magic8ball_lastDate');
                if (savedDate !== today) {
                    this.stats.todayQuestions = 1;
                    localStorage.setItem('magic8ball_lastDate', today);
                } else {
                    this.stats.todayQuestions++;
                }

                this.updateStats();
                this.saveData();
            }

            updateStats() {
                document.getElementById('totalQuestions').textContent = this.stats.totalQuestions;
                document.getElementById('positiveAnswers').textContent = this.stats.positiveAnswers;
                document.getElementById('todayQuestions').textContent = this.stats.todayQuestions;
                document.getElementById('luckyStreak').textContent = this.stats.luckyStreak;
            }

            clearHistory() {
                if (confirm('确定要清空所有占卜历史吗？')) {
                    this.history = [];
                    this.stats = {
                        totalQuestions: 0,
                        positiveAnswers: 0,
                        todayQuestions: 0,
                        luckyStreak: 0
                    };
                    this.updateHistoryDisplay();
                    this.updateStats();
                    this.saveData();
                }
            }

            showError(message) {
                const answerText = document.getElementById('answerText');
                answerText.textContent = message;
                answerText.classList.add('visible');
                answerText.style.color = '#ff6b6b';
                
                setTimeout(() => {
                    answerText.textContent = '摇动球体';
                    answerText.style.color = '#00ff88';
                    answerText.classList.remove('visible');
                }, 3000);
            }

            delay(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }

            escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }

            saveData() {
                const data = {
                    history: this.history,
                    stats: this.stats,
                    language: this.language,
                    mood: this.mood,
                    currentCategory: this.currentCategory
                };
                localStorage.setItem('magic8ball_data', JSON.stringify(data));
            }

            loadData() {
                const saved = localStorage.getItem('magic8ball_data');
                if (saved) {
                    try {
                        const data = JSON.parse(saved);
                        this.history = data.history || [];
                        this.stats = { ...this.stats, ...data.stats };
                        this.language = data.language || 'zh';
                        this.mood = data.mood || 'classic';
                        this.currentCategory = data.currentCategory || 'general';

                        document.getElementById('languageSelect').value = this.language;
                        document.getElementById('moodSelect').value = this.mood;
                        
                        document.querySelectorAll('.category-btn').forEach(btn => {
                            btn.classList.toggle('active', btn.dataset.category === this.currentCategory);
                        });

                        this.updateHistoryDisplay();
                        this.updateMoodDisplay();
                    } catch (error) {
                        console.error('加载数据失败:', error);
                    }
                }
            }
        }

        // 初始化游戏
        document.addEventListener('DOMContentLoaded', () => {
            new Magic8Ball();
        });

        // 添加一些有趣的交互效果
        document.addEventListener('mousemove', (e) => {
            const ball = document.getElementById('magicBall');
            const rect = ball.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) / 20;
            const deltaY = (e.clientY - centerY) / 20;
            
            ball.style.transform = `perspective(1000px) rotateY(${deltaX}deg) rotateX(${-deltaY}deg)`;
        });

        // 重置球的位置
        document.addEventListener('mouseleave', () => {
            const ball = document.getElementById('magicBall');
            ball.style.transform = '';
        });