class HistoryQuiz {
            constructor() {
                this.currentQuestionIndex = 0;
                this.score = 0;
                this.totalQuestions = 10;
                this.correctAnswers = 0;
                this.selectedEra = 'all';
                this.answered = false;
                this.hintUsed = false;
                this.timeLeft = 30;
                this.timerInterval = null;
                
                this.questions = {
                    ancient: [
                        {
                            era: "古代史",
                            question: "中国第一个统一的封建王朝是？",
                            answers: ["夏朝", "商朝", "秦朝", "汉朝"],
                            correct: 2,
                            hint: "这个朝代只存在了15年",
                            explanation: "秦朝是中国历史上第一个统一的封建王朝，由秦始皇建立于公元前221年",
                            context: "秦统一六国后，建立了中央集权制度，统一了文字、货币、度量衡"
                        },
                        {
                            era: "古代史",
                            question: "古埃及最著名的法老是？",
                            answers: ["图坦卡蒙", "拉美西斯二世", "胡夫", "克娄巴特拉七世"],
                            correct: 1,
                            hint: "他在位67年，建造了很多神庙",
                            explanation: "拉美西斯二世统治埃及67年，是埃及历史上最伟大的法老之一",
                            context: "拉美西斯二世时期是古埃及新王国时期的鼎盛时代"
                        },
                        {
                            era: "古代史",
                            question: "古希腊雅典民主制的创立者是？",
                            answers: ["苏格拉底", "柏拉图", "梭伦", "亚里士多德"],
                            correct: 2,
                            hint: "他是古希腊七贤之一",
                            explanation: "梭伦通过改革为雅典民主制奠定了基础",
                            context: "梭伦改革废除了债务奴隶制，为平民参政创造了条件"
                        },
                        {
                            era: "古代史",
                            question: "春秋时期孔子提出的核心思想是？",
                            answers: ["法治", "仁政", "无为", "兼爱"],
                            correct: 1,
                            hint: "这个字的含义是爱人",
                            explanation: "孔子提出'仁'的思想，强调爱人、克己复礼",
                            context: "仁政思想影响了中国两千多年的政治文化"
                        },
                        {
                            era: "古代史",
                            question: "罗马帝国的第一任皇帝是？",
                            answers: ["凯撒", "屋大维", "安东尼", "庞贝"],
                            correct: 1,
                            hint: "他的尊号是奥古斯都",
                            explanation: "屋大维（奥古斯都）是罗马帝国的第一任皇帝",
                            context: "屋大维结束了罗马共和国时期的内战，开创了罗马帝国"
                        }
                    ],
                    medieval: [
                        {
                            era: "中世纪",
                            question: "查理曼大帝建立的帝国被称为？",
                            answers: ["神圣罗马帝国", "法兰克王国", "加洛林帝国", "西法兰克王国"],
                            correct: 2,
                            hint: "以他的家族命名",
                            explanation: "查理曼建立的加洛林帝国统治西欧大部分地区",
                            context: "加洛林帝国的建立标志着西欧政治统一的短暂实现"
                        },
                        {
                            era: "中世纪",
                            question: "中国唐朝的开国皇帝是？",
                            answers: ["李世民", "李渊", "李治", "李隆基"],
                            correct: 1,
                            hint: "他的庙号是高祖",
                            explanation: "李渊（唐高祖）建立了唐朝",
                            context: "唐朝是中国历史上最强盛的朝代之一，国际影响巨大"
                        },
                        {
                            era: "中世纪",
                            question: "宋朝发明的四大发明不包括？",
                            answers: ["指南针", "火药", "造纸术", "印刷术"],
                            correct: 2,
                            hint: "这项发明出现得更早",
                            explanation: "造纸术是汉朝蔡伦发明的，不是宋朝",
                            context: "四大发明对世界文明发展产生了深远影响"
                        },
                        {
                            era: "中世纪",
                            question: "十字军东征开始于哪一年？",
                            answers: ["1095年", "1096年", "1097年", "1099年"],
                            correct: 0,
                            hint: "教皇乌尔班二世发动",
                            explanation: "1095年教皇乌尔班二世发动了第一次十字军东征",
                            context: "十字军东征持续了近200年，影响了东西方文化交流"
                        },
                        {
                            era: "中世纪",
                            question: "蒙古帝国的建立者是？",
                            answers: ["成吉思汗", "窝阔台", "蒙哥", "忽必烈"],
                            correct: 0,
                            hint: "他原名铁木真",
                            explanation: "成吉思汗（铁木真）统一蒙古部落，建立蒙古帝国",
                            context: "蒙古帝国是历史上疆域最大的帝国"
                        }
                    ],
                    modern: [
                        {
                            era: "近现代",
                            question: "文艺复兴运动起源于哪个国家？",
                            answers: ["法国", "英国", "意大利", "德国"],
                            correct: 2,
                            hint: "这里有很多城邦国家",
                            explanation: "文艺复兴运动起源于14世纪的意大利",
                            context: "文艺复兴标志着欧洲从中世纪向近代的转变"
                        },
                        {
                            era: "近现代",
                            question: "美国独立战争开始于哪一年？",
                            answers: ["1775年", "1776年", "1777年", "1783年"],
                            correct: 0,
                            hint: "比《独立宣言》早一年",
                            explanation: "美国独立战争始于1775年的来克星顿战役",
                            context: "独立战争建立了世界上第一个现代共和国"
                        },
                        {
                            era: "近现代",
                            question: "法国大革命爆发于哪一年？",
                            answers: ["1789年", "1790年", "1791年", "1792年"],
                            correct: 0,
                            hint: "攻占巴士底狱的年份",
                            explanation: "法国大革命爆发于1789年7月14日",
                            context: "法国大革命提出了自由、平等、博爱的理念"
                        },
                        {
                            era: "近现代",
                            question: "工业革命最早发生在哪个国家？",
                            answers: ["法国", "英国", "德国", "美国"],
                            correct: 1,
                            hint: "这里最早出现了蒸汽机",
                            explanation: "工业革命最早在18世纪的英国开始",
                            context: "工业革命彻底改变了人类的生产和生活方式"
                        },
                        {
                            era: "近现代",
                            question: "拿破仑战争结束于哪一年？",
                            answers: ["1814年", "1815年", "1816年", "1821年"],
                            correct: 1,
                            hint: "滑铁卢战役的年份",
                            explanation: "拿破仑战争结束于1815年滑铁卢战役",
                            context: "拿破仑战争重塑了欧洲的政治格局"
                        }
                    ],
                    contemporary: [
                        {
                            era: "当代史",
                            question: "第一次世界大战开始于哪一年？",
                            answers: ["1913年", "1914年", "1915年", "1916年"],
                            correct: 1,
                            hint: "萨拉热窝事件的年份",
                            explanation: "第一次世界大战始于1914年的萨拉热窝事件",
                            context: "一战标志着'旧欧洲'的终结和现代世界的开始"
                        },
                        {
                            era: "当代史",
                            question: "二战中诺曼底登陆发生在哪一年？",
                            answers: ["1943年", "1944年", "1945年", "1946年"],
                            correct: 1,
                            hint: "D-Day是6月6日",
                            explanation: "诺曼底登陆发生在1944年6月6日",
                            context: "诺曼底登陆开辟了欧洲第二战场，加速了二战结束"
                        },
                        {
                            era: "当代史",
                            question: "中华人民共和国成立于哪一年？",
                            answers: ["1948年", "1949年", "1950年", "1951年"],
                            correct: 1,
                            hint: "毛泽东宣布中国人民站起来了",
                            explanation: "中华人民共和国成立于1949年10月1日",
                            context: "新中国的成立标志着中国历史新纪元的开始"
                        },
                        {
                            era: "当代史",
                            question: "冷战开始的标志性事件是？",
                            answers: ["雅尔塔会议", "波茨坦会议", "马歇尔计划", "杜鲁门主义"],
                            correct: 3,
                            hint: "这是美国的一项政策",
                            explanation: "杜鲁门主义标志着冷战的开始",
                            context: "冷战持续了近半个世纪，影响了世界格局"
                        },
                        {
                            era: "当代史",
                            question: "苏联解体发生在哪一年？",
                            answers: ["1989年", "1990年", "1991年", "1992年"],
                            correct: 2,
                            hint: "戈尔巴乔夫辞职的年份",
                            explanation: "苏联于1991年12月25日正式解体",
                            context: "苏联解体标志着冷战的结束和新世界秩序的形成"
                        }
                    ]
                };
                
                this.bindEvents();
                this.updateUI();
            }

            bindEvents() {
                document.getElementById('startButton').addEventListener('click', () => {
                    this.startQuiz();
                });

                document.getElementById('nextButton').addEventListener('click', () => {
                    this.nextQuestion();
                });

                document.getElementById('restartButton').addEventListener('click', () => {
                    this.restartQuiz();
                });

                document.getElementById('hintButton').addEventListener('click', () => {
                    this.showHint();
                });

                document.querySelectorAll('.era-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        this.setEra(e.target.dataset.era);
                    });
                });
            }

            setEra(era) {
                this.selectedEra = era;
                document.querySelectorAll('.era-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector(`[data-era="${era}"]`).classList.add('active');
                
                const eraNames = {
                    all: '全时期',
                    ancient: '古代史',
                    medieval: '中世纪',
                    modern: '近现代',
                    contemporary: '当代史'
                };
                document.getElementById('currentEra').textContent = eraNames[era];
            }

            startQuiz() {
                this.currentQuestionIndex = 0;
                this.score = 0;
                this.correctAnswers = 0;
                this.prepareQuestions();
                this.showQuestion();
                
                document.getElementById('startButton').style.display = 'none';
                document.getElementById('hintButton').style.display = 'inline-block';
                
                this.updateUI();
            }

            prepareQuestions() {
                let questionPool = [];
                
                if (this.selectedEra === 'all') {
                    Object.values(this.questions).forEach(eraQuestions => {
                        questionPool = questionPool.concat(eraQuestions);
                    });
                } else {
                    questionPool = this.questions[this.selectedEra] || [];
                }
                
                // 随机打乱问题
                this.currentQuestions = [];
                for (let i = 0; i < this.totalQuestions && i < questionPool.length; i++) {
                    const randomIndex = Math.floor(Math.random() * questionPool.length);
                    this.currentQuestions.push(questionPool[randomIndex]);
                    questionPool.splice(randomIndex, 1);
                }
            }

            showQuestion() {
                if (this.currentQuestionIndex >= this.totalQuestions || 
                    this.currentQuestionIndex >= this.currentQuestions.length) {
                    this.endQuiz();
                    return;
                }

                const question = this.currentQuestions[this.currentQuestionIndex];
                document.getElementById('eraBadge').textContent = question.era;
                document.getElementById('questionText').textContent = question.question;
                
                this.answered = false;
                this.hintUsed = false;
                this.timeLeft = 30;
                
                document.getElementById('hintBox').classList.remove('show');
                document.getElementById('historicalContext').classList.remove('show');
                document.getElementById('nextButton').style.display = 'none';
                document.getElementById('hintButton').style.display = 'inline-block';
                
                this.renderAnswers(question);
                this.updateProgress();
                this.updateUI();
                this.startTimer();
            }

            startTimer() {
                this.clearTimer();
                this.timerInterval = setInterval(() => {
                    this.timeLeft--;
                    this.updateTimer();
                    
                    if (this.timeLeft <= 0) {
                        this.timeUp();
                    }
                }, 1000);
            }

            clearTimer() {
                if (this.timerInterval) {
                    clearInterval(this.timerInterval);
                    this.timerInterval = null;
                }
            }

            updateTimer() {
                const timerElement = document.getElementById('timeLeft');
                const timerContainer = document.getElementById('timer');
                
                timerElement.textContent = this.timeLeft;
                
                if (this.timeLeft <= 10) {
                    timerContainer.classList.add('warning');
                } else {
                    timerContainer.classList.remove('warning');
                }
            }

            timeUp() {
                if (!this.answered) {
                    this.clearTimer();
                    this.answered = true;
                    this.showMessage('⏰ 时间到！正确答案是：' + 
                        this.currentQuestions[this.currentQuestionIndex].answers[
                            this.currentQuestions[this.currentQuestionIndex].correct
                        ], 'wrong');
                    
                    const buttons = document.querySelectorAll('.answer-button');
                    buttons.forEach((button, index) => {
                        button.disabled = true;
                        if (index === this.currentQuestions[this.currentQuestionIndex].correct) {
                            button.classList.add('correct');
                        }
                    });
                    
                    setTimeout(() => {
                        this.showContext();
                        document.getElementById('nextButton').style.display = 'inline-block';
                        document.getElementById('hintButton').style.display = 'none';
                    }, 1500);
                    
                    this.updateUI();
                }
            }

            renderAnswers(question) {
                const grid = document.getElementById('answersGrid');
                grid.innerHTML = '';
                
                question.answers.forEach((answer, index) => {
                    const button = document.createElement('button');
                    button.className = 'answer-button';
                    button.textContent = answer;
                    button.addEventListener('click', () => this.selectAnswer(index));
                    grid.appendChild(button);
                });
            }

            selectAnswer(selectedIndex) {
                if (this.answered) return;
                
                this.clearTimer();
                this.answered = true;
                const question = this.currentQuestions[this.currentQuestionIndex];
                const buttons = document.querySelectorAll('.answer-button');
                
                buttons.forEach((button, index) => {
                    button.disabled = true;
                    if (index === question.correct) {
                        button.classList.add('correct');
                    } else if (index === selectedIndex && index !== question.correct) {
                        button.classList.add('wrong');
                    }
                });

                if (selectedIndex === question.correct) {
                    this.correctAnswers++;
                    const timeBonus = Math.max(0, this.timeLeft);
                    const hintPenalty = this.hintUsed ? 5 : 0;
                    const points = 10 + timeBonus - hintPenalty;
                    this.score += points;
                    this.showMessage(`🎉 正确！+${points}分 (时间奖励:${timeBonus}, 提示扣分:${hintPenalty})`, 'correct');
                } else {
                    this.showMessage(`❌ 错误！正确答案是：${question.answers[question.correct]}`, 'wrong');
                }

                setTimeout(() => {
                    this.showContext();
                    document.getElementById('nextButton').style.display = 'inline-block';
                    document.getElementById('hintButton').style.display = 'none';
                }, 1500);

                this.updateUI();
            }

            showContext() {
                const question = this.currentQuestions[this.currentQuestionIndex];
                const contextElement = document.getElementById('historicalContext');
                contextElement.innerHTML = `
                    <strong>💡 ${question.explanation}</strong><br>
                    <br>📖 ${question.context}
                `;
                contextElement.classList.add('show');
            }

            showHint() {
                if (this.answered || this.hintUsed) return;
                
                this.hintUsed = true;
                const question = this.currentQuestions[this.currentQuestionIndex];
                document.getElementById('hintText').textContent = question.hint;
                document.getElementById('hintBox').classList.add('show');
                document.getElementById('hintButton').style.display = 'none';
            }

            nextQuestion() {
                this.currentQuestionIndex++;
                this.hideMessage();
                this.showQuestion();
            }

            endQuiz() {
                this.clearTimer();
                const accuracy = Math.round((this.correctAnswers / this.totalQuestions) * 100);
                let grade = '';
                
                if (accuracy >= 90) grade = '🏆 历史学家！你对历史了如指掌！';
                else if (accuracy >= 70) grade = '📚 历史爱好者！继续探索历史！';
                else if (accuracy >= 50) grade = '🎓 历史学徒！多读历史书籍！';
                else grade = '📖 历史新手！重新学习历史知识！';

                this.showMessage(`🎊 测试完成！\n得分：${this.score}分\n正确率：${accuracy}%\n${grade}`, 'final');
                
                document.getElementById('nextButton').style.display = 'none';
                document.getElementById('hintButton').style.display = 'none';
                document.getElementById('restartButton').style.display = 'inline-block';
            }

            restartQuiz() {
                this.clearTimer();
                this.currentQuestionIndex = 0;
                this.score = 0;
                this.correctAnswers = 0;
                this.answered = false;
                
                document.getElementById('eraBadge').textContent = '历史时期';
                document.getElementById('questionText').textContent = '准备开始历史知识问答！';
                document.getElementById('answersGrid').innerHTML = '';
                document.getElementById('startButton').style.display = 'inline-block';
                document.getElementById('restartButton').style.display = 'none';
                document.getElementById('hintButton').style.display = 'none';
                document.getElementById('nextButton').style.display = 'none';
                document.getElementById('timer').classList.remove('warning');
                
                this.hideMessage();
                this.updateUI();
                this.updateProgress();
            }

            updateProgress() {
                const progress = (this.currentQuestionIndex / this.totalQuestions) * 100;
                document.getElementById('progressFill').style.width = progress + '%';
            }

            updateUI() {
                document.getElementById('score').textContent = this.score;
                document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
                
                if (this.totalQuestions > 0) {
                    const accuracy = Math.round((this.correctAnswers / Math.max(1, this.currentQuestionIndex)) * 100);
                    document.getElementById('accuracy').textContent = accuracy + '%';
                }
            }

            showMessage(text, type) {
                const message = document.getElementById('message');
                message.textContent = text;
                message.className = `message ${type} show`;
            }

            hideMessage() {
                const message = document.getElementById('message');
                message.classList.remove('show');
            }
        }

        // 启动游戏
        window.addEventListener('load', () => {
            new HistoryQuiz();
        });