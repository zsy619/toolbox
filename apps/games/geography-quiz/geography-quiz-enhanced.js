// 地理知识问答游戏 - 增强版 (参考历史问答)
class GeographyQuizEnhanced {
    constructor() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalQuestions = 12;
        this.correctAnswers = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.selectedCategory = 'all';
        this.answered = false;
        this.hintUsed = false;
        this.timeLeft = 25;
        this.timerInterval = null;
        this.currentQuestions = [];
        this.categoryStats = {
            physical: { total: 0, correct: 0 },
            political: { total: 0, correct: 0 },
            cultural: { total: 0, correct: 0 },
            economic: { total: 0, correct: 0 }
        };
        
        // 按地理分类组织的问题库
        this.questions = {
            physical: [
                {
                    category: "自然地理",
                    question: "世界上最大的海洋是？",
                    answers: ["太平洋", "大西洋", "印度洋", "北冰洋"],
                    correct: 0,
                    hint: "它的名称和\"平静\"有关",
                    explanation: "太平洋面积约1.65亿平方公里，是世界上最大的海洋",
                    context: "太平洋约占地球表面积的三分之一，连接亚洲、大洋洲和美洲"
                },
                {
                    category: "自然地理",
                    question: "世界上最长的河流是？",
                    answers: ["尼罗河", "亚马逊河", "长江", "密西西比河"],
                    correct: 0,
                    hint: "它流经埃及",
                    explanation: "尼罗河全长约6650公里，是世界上最长的河流",
                    context: "尼罗河从南向北流经11个国家，最终注入地中海，被誉为埃及的生命线"
                },
                {
                    category: "自然地理",
                    question: "世界上最高的山峰是？",
                    answers: ["珠穆朗玛峰", "乔戈里峰", "干城章嘉峰", "洛子峰"],
                    correct: 0,
                    hint: "位于中国和尼泊尔边境",
                    explanation: "珠穆朗玛峰海拔8848.86米，是世界最高峰",
                    context: "珠穆朗玛峰位于喜马拉雅山脉，藏语意为'圣母峰'"
                },
                {
                    category: "自然地理",
                    question: "撒哈拉沙漠位于哪个大洲？",
                    answers: ["亚洲", "非洲", "欧洲", "南美洲"],
                    correct: 1,
                    hint: "这个大洲被称为'黑大陆'",
                    explanation: "撒哈拉沙漠位于非洲北部，面积约900万平方公里",
                    context: "撒哈拉沙漠是世界第三大沙漠，将非洲分为北非和撒哈拉以南非洲"
                },
                {
                    category: "自然地理",
                    question: "世界上最深的海沟是？",
                    answers: ["马里亚纳海沟", "波多黎各海沟", "日本海沟", "千岛海沟"],
                    correct: 0,
                    hint: "位于太平洋西部",
                    explanation: "马里亚纳海沟最深处达11034米，是地球表面最深的地方",
                    context: "马里亚纳海沟位于菲律宾海板块和太平洋板块交界处"
                },
                {
                    category: "自然地理",
                    question: "世界上最大的内陆湖是？",
                    answers: ["里海", "咸海", "贝加尔湖", "死海"],
                    correct: 0,
                    hint: "严格意义上它是一个湖",
                    explanation: "里海面积约37万平方公里，虽名为海，实际是世界最大的湖泊",
                    context: "里海被俄罗斯、哈萨克斯坦、土库曼斯坦、伊朗和阿塞拜疆五国环绕"
                },
                {
                    category: "自然地理",
                    question: "安第斯山脉位于哪个大洲？",
                    answers: ["北美洲", "南美洲", "亚洲", "非洲"],
                    correct: 1,
                    hint: "这个大洲形状像一个倒三角",
                    explanation: "安第斯山脉位于南美洲西部，全长约9000公里",
                    context: "安第斯山脉是世界最长的山脉，被称为'南美洲的脊梁'"
                }
            ],
            political: [
                {
                    category: "政治地理",
                    question: "中国的首都是哪里？",
                    answers: ["上海", "北京", "广州", "深圳"],
                    correct: 1,
                    hint: "这里有天安门广场",
                    explanation: "北京是中华人民共和国的首都",
                    context: "北京位于华北平原北部，是全国政治、文化中心"
                },
                {
                    category: "政治地理",
                    question: "澳大利亚的首都是？",
                    answers: ["悉尼", "墨尔本", "堪培拉", "珀斯"],
                    correct: 2,
                    hint: "不是最大的城市",
                    explanation: "堪培拉是澳大利亚的首都",
                    context: "堪培拉是专门规划建设的首都城市，1908年被选定为首都"
                },
                {
                    category: "政治地理",
                    question: "巴西的首都是？",
                    answers: ["里约热内卢", "圣保罗", "巴西利亚", "萨尔瓦多"],
                    correct: 2,
                    hint: "是一个专门建设的新首都",
                    explanation: "巴西利亚是巴西的首都，于1960年建成",
                    context: "巴西利亚是20世纪规划建设的现代化城市，以其独特的城市设计闻名"
                },
                {
                    category: "政治地理",
                    question: "世界上面积最大的国家是？",
                    answers: ["中国", "美国", "俄罗斯", "加拿大"],
                    correct: 2,
                    hint: "横跨欧亚两大洲",
                    explanation: "俄罗斯面积约1707万平方公里，是世界面积最大的国家",
                    context: "俄罗斯横跨11个时区，从东欧延伸到北亚"
                },
                {
                    category: "政治地理",
                    question: "印度的首都是？",
                    answers: ["孟买", "新德里", "加尔各答", "班加罗尔"],
                    correct: 1,
                    hint: "位于德里地区",
                    explanation: "新德里是印度的首都",
                    context: "新德里位于德里地区南部，是印度的政治和行政中心"
                },
                {
                    category: "政治地理",
                    question: "格陵兰岛属于哪个国家？",
                    answers: ["冰岛", "挪威", "丹麦", "加拿大"],
                    correct: 2,
                    hint: "一个欧洲小国",
                    explanation: "格陵兰岛是丹麦的自治领土",
                    context: "格陵兰岛拥有高度的内政自治权，但外交和国防由丹麦负责"
                },
                {
                    category: "政治地理",
                    question: "世界上最小的国家梵蒂冈的面积约为？",
                    answers: ["0.17平方公里", "0.44平方公里", "1.2平方公里", "2.1平方公里"],
                    correct: 1,
                    hint: "不到半平方公里",
                    explanation: "梵蒂冈面积约0.44平方公里，是世界最小的主权国家",
                    context: "梵蒂冈位于意大利罗马城内，是天主教的中心"
                }
            ],
            cultural: [
                {
                    category: "人文地理",
                    question: "日本由多少个主要岛屿组成？",
                    answers: ["2个", "3个", "4个", "5个"],
                    correct: 2,
                    hint: "本州、北海道、九州、四国",
                    explanation: "日本主要由本州、北海道、九州、四国四个大岛组成",
                    context: "四个主要岛屿约占日本总面积的97%，还有数千个小岛"
                },
                {
                    category: "人文地理",
                    question: "地中海位于哪三个大洲之间？",
                    answers: ["亚洲、非洲、欧洲", "欧洲、非洲、南美洲", "亚洲、欧洲、北美洲", "非洲、南美洲、北美洲"],
                    correct: 0,
                    hint: "古代文明的摇篮地区",
                    explanation: "地中海位于欧洲、非洲和亚洲三大洲之间",
                    context: "地中海是古代文明交流的重要区域，孕育了希腊、罗马等伟大文明"
                },
                {
                    category: "人文地理",
                    question: "马达加斯加岛位于哪个大洋？",
                    answers: ["太平洋", "大西洋", "印度洋", "北冰洋"],
                    correct: 2,
                    hint: "非洲东海岸外",
                    explanation: "马达加斯加是位于印度洋西部的岛国",
                    context: "马达加斯加距离非洲东海岸约400公里，拥有独特的生物多样性"
                },
                {
                    category: "人文地理",
                    question: "亚洲面积最大的国家是？",
                    answers: ["印度", "中国", "俄罗斯", "哈萨克斯坦"],
                    correct: 1,
                    hint: "人口也是最多的",
                    explanation: "中国面积约960万平方公里，是亚洲面积最大的国家",
                    context: "中国也是世界第三大国，拥有悠久的历史和丰富的文化"
                },
                {
                    category: "人文地理",
                    question: "世界上最大的群岛国家是？",
                    answers: ["菲律宾", "印度尼西亚", "日本", "马来西亚"],
                    correct: 1,
                    hint: "拥有超过17000个岛屿",
                    explanation: "印度尼西亚由约17508个岛屿组成，是世界最大的群岛国家",
                    context: "印度尼西亚横跨赤道，是连接亚洲和大洋洲的桥梁"
                },
                {
                    category: "人文地理",
                    question: "英国的首都是？",
                    answers: ["曼彻斯特", "伦敦", "利物浦", "爱丁堡"],
                    correct: 1,
                    hint: "这里有大本钟",
                    explanation: "伦敦是英国的首都，也是英格兰的首府",
                    context: "伦敦位于泰晤士河畔，是世界重要的金融和文化中心"
                },
                {
                    category: "人文地理",
                    question: "马尔代夫由多少个珊瑚岛组成？",
                    answers: ["约200个", "约500个", "约1200个", "约2000个"],
                    correct: 2,
                    hint: "超过一千个",
                    explanation: "马尔代夫由约1200个珊瑚岛组成",
                    context: "马尔代夫是著名的旅游胜地，其中约200个岛屿有人居住"
                }
            ],
            economic: [
                {
                    category: "经济地理",
                    question: "苏伊士运河连接哪两个海？",
                    answers: ["地中海和红海", "黑海和地中海", "红海和阿拉伯海", "地中海和大西洋"],
                    correct: 0,
                    hint: "一个在北，一个在南",
                    explanation: "苏伊士运河连接地中海和红海",
                    context: "苏伊士运河长约193公里，是重要的国际航运通道，大大缩短了欧亚航运距离"
                },
                {
                    category: "经济地理",
                    question: "巴拿马运河连接哪两个大洋？",
                    answers: ["太平洋和大西洋", "太平洋和印度洋", "大西洋和印度洋", "大西洋和北冰洋"],
                    correct: 0,
                    hint: "世界两个最大的海洋",
                    explanation: "巴拿马运河连接太平洋和大西洋",
                    context: "巴拿马运河长约81公里，极大地缩短了航运距离，被誉为世界七大工程奇迹之一"
                },
                {
                    category: "经济地理",
                    question: "世界上最大的内陆国是？",
                    answers: ["蒙古", "哈萨克斯坦", "阿富汗", "乍得"],
                    correct: 1,
                    hint: "位于中亚",
                    explanation: "哈萨克斯坦面积约272万平方公里，是世界上最大的内陆国",
                    context: "哈萨克斯坦拥有丰富的石油和天然气资源，是重要的能源出口国"
                },
                {
                    category: "经济地理",
                    question: "南美洲面积最大的国家是？",
                    answers: ["阿根廷", "巴西", "秘鲁", "哥伦比亚"],
                    correct: 1,
                    hint: "说葡萄牙语的国家",
                    explanation: "巴西面积约851万平方公里，是南美洲面积最大的国家",
                    context: "巴西约占南美洲总面积的一半，是世界第五大国，拥有丰富的自然资源"
                },
                {
                    category: "经济地理",
                    question: "世界上最长的海岸线属于哪个国家？",
                    answers: ["俄罗斯", "加拿大", "澳大利亚", "挪威"],
                    correct: 1,
                    hint: "北美洲的国家",
                    explanation: "加拿大海岸线长约20万公里，是世界上海岸线最长的国家",
                    context: "加拿大三面环海，拥有丰富的海洋资源和渔业资源"
                },
                {
                    category: "经济地理",
                    question: "世界上最大的半岛是？",
                    answers: ["阿拉伯半岛", "印度半岛", "斯堪的纳维亚半岛", "伊比利亚半岛"],
                    correct: 0,
                    hint: "位于亚洲西南部",
                    explanation: "阿拉伯半岛面积约322万平方公里，是世界最大的半岛",
                    context: "阿拉伯半岛拥有世界最大的石油储量，是全球能源的重要供应地"
                },
                {
                    category: "经济地理",
                    question: "世界上人口密度最高的国家是？",
                    answers: ["新加坡", "摩纳哥", "香港", "梵蒂冈"],
                    correct: 1,
                    hint: "欧洲的一个城邦国家",
                    explanation: "摩纳哥人口密度约每平方公里26000人，是世界人口密度最高的国家",
                    context: "摩纳哥是著名的赌场和奢侈品中心，经济高度发达"
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

        document.querySelectorAll('.category-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.setCategory(e.target.dataset.category);
            });
        });
    }

    setCategory(category) {
        this.selectedCategory = category;
        document.querySelectorAll('.category-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        const categoryNames = {
            all: '全分类',
            physical: '自然地理',
            political: '政治地理', 
            cultural: '人文地理',
            economic: '经济地理'
        };
        document.getElementById('currentCategory').textContent = categoryNames[category];
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.prepareQuestions();
        this.showQuestion();
        
        document.getElementById('startButton').style.display = 'none';
        document.getElementById('hintButton').style.display = 'inline-block';
        
        this.updateUI();
    }

    prepareQuestions() {
        // 重置分类统计
        Object.keys(this.categoryStats).forEach(category => {
            this.categoryStats[category] = { total: 0, correct: 0 };
        });
        
        let questionPool = [];
        
        if (this.selectedCategory === 'all') {
            Object.values(this.questions).forEach(categoryQuestions => {
                questionPool = questionPool.concat(categoryQuestions);
            });
        } else {
            questionPool = this.questions[this.selectedCategory] || [];
        }
        
        // 随机打乱问题
        this.currentQuestions = [];
        for (let i = 0; i < this.totalQuestions && i < questionPool.length; i++) {
            const randomIndex = Math.floor(Math.random() * questionPool.length);
            this.currentQuestions.push(questionPool[randomIndex]);
            // 更新分类统计
            const category = questionPool[randomIndex].category;
            const categoryKey = this.getCategoryKey(category);
            if (categoryKey) {
                this.categoryStats[categoryKey].total++;
            }
            questionPool.splice(randomIndex, 1);
        }
    }

    getCategoryKey(categoryName) {
        const categoryMap = {
            '自然地理': 'physical',
            '政治地理': 'political',
            '人文地理': 'cultural',
            '经济地理': 'economic'
        };
        return categoryMap[categoryName] || null;
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.totalQuestions || 
            this.currentQuestionIndex >= this.currentQuestions.length) {
            this.endQuiz();
            return;
        }

        const question = this.currentQuestions[this.currentQuestionIndex];
        document.getElementById('categoryBadge').textContent = question.category;
        document.getElementById('questionText').textContent = question.question;
        
        this.answered = false;
        this.hintUsed = false;
        this.timeLeft = 25;
        
        document.getElementById('hintBox').classList.remove('show');
        document.getElementById('geographicContext').classList.remove('show');
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
        
        if (this.timeLeft <= 8) {
            timerContainer.classList.add('warning');
        } else {
            timerContainer.classList.remove('warning');
        }
    }

    timeUp() {
        if (!this.answered) {
            this.clearTimer();
            this.answered = true;
            this.streak = 0;
            
            const question = this.currentQuestions[this.currentQuestionIndex];
            this.showMessage('⏰ 时间到！正确答案是：' + 
                question.answers[question.correct], 'wrong');
            
            const buttons = document.querySelectorAll('.answer-button');
            buttons.forEach((button, index) => {
                button.disabled = true;
                if (index === question.correct) {
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
            this.streak++;
            this.maxStreak = Math.max(this.maxStreak, this.streak);
            
            // 更新分类正确统计
            const categoryKey = this.getCategoryKey(question.category);
            if (categoryKey) {
                this.categoryStats[categoryKey].correct++;
            }
            
            // 计分系统：基础分 + 时间奖励 + 连击奖励 - 提示扣分
            const basePoints = 15;
            const timeBonus = Math.max(0, this.timeLeft);
            // 快速答题额外奖励
            const quickAnswerBonus = this.timeLeft >= 20 ? 5 : 0;
            const streakBonus = this.streak >= 3 ? (this.streak - 2) * 2 : 0;
            const hintPenalty = this.hintUsed ? 8 : 0;
            const points = basePoints + timeBonus + quickAnswerBonus + streakBonus - hintPenalty;
            
            this.score += points;
            let message = `🎉 正确！+${points}分`;
            if (timeBonus > 0) message += ` (时间奖励:${timeBonus})`;
            if (quickAnswerBonus > 0) message += ` (快速答题:+${quickAnswerBonus})`;
            if (streakBonus > 0) message += ` (连击x${this.streak}:+${streakBonus})`;
            if (hintPenalty > 0) message += ` (提示扣分:-${hintPenalty})`;
            
            this.showMessage(message, 'correct');
            
            // 如果获得高分，显示特殊效果
            if (points >= 30) {
                this.showSpecialEffect('👑 超级得分！');
            }
            
            // 如果连击数达到特定值，显示连击奖励效果
            if (this.streak === 5 || this.streak === 10 || this.streak === 15) {
                this.showSpecialEffect(`🔥 ${this.streak}连击奖励！`);
            }
        } else {
            this.streak = 0;
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
        const contextElement = document.getElementById('geographicContext');
        contextElement.innerHTML = `
            <strong>💡 ${question.explanation}</strong><br>
            <br>🌍 ${question.context}
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
        let badgeClass = '';
        
        if (accuracy >= 95) {
            grade = '👑 地理大师！你是真正的地理百科全书！';
            badgeClass = 'master';
        } else if (accuracy >= 85) {
            grade = '🏆 地理专家！你对地理了如指掌！';
            badgeClass = 'expert';
        } else if (accuracy >= 70) {
            grade = '🌟 地理达人！继续探索地球奥秘！';
            badgeClass = 'good';
        } else if (accuracy >= 55) {
            grade = '🗺️ 地理学徒！多看地图和地理资料！';
            badgeClass = 'average';
        } else if (accuracy >= 40) {
            grade = '📚 地理新手！需要加强地理知识学习！';
            badgeClass = 'beginner';
        } else {
            grade = '🌍 重新挑战！世界那么大，一起去看看！';
            badgeClass = 'beginner';
        }

        const categoryText = {
            'all': '全分类',
            'physical': '自然地理',
            'political': '政治地理',
            'cultural': '人文地理',
            'economic': '经济地理'
        };

        // 计算平均每题得分
        const avgScorePerQuestion = this.totalQuestions > 0 ? Math.round(this.score / this.totalQuestions) : 0;

        // 生成分类统计信息
        let categoryStatsHTML = '';
        if (this.selectedCategory === 'all') {
            categoryStatsHTML = '<br><strong>各分类表现：</strong><br>';
            Object.keys(this.categoryStats).forEach(key => {
                const stat = this.categoryStats[key];
                if (stat.total > 0) {
                    const categoryNames = {
                        'physical': '自然地理',
                        'political': '政治地理',
                        'cultural': '人文地理',
                        'economic': '经济地理'
                    };
                    const accuracy = Math.round((stat.correct / stat.total) * 100);
                    categoryStatsHTML += `${categoryNames[key]}: ${stat.correct}/${stat.total} (${accuracy}%)<br>`;
                }
            });
        }

        const messageContent = `
            🎊 测试完成！<br><br>
            📊 <strong>成绩统计</strong><br>
            分类：${categoryText[this.selectedCategory]}<br>
            得分：${this.score}分<br>
            正确率：${accuracy}% (${this.correctAnswers}/${this.totalQuestions})<br>
            最高连击：${this.maxStreak}题<br>
            平均每题得分：${avgScorePerQuestion}分
            ${categoryStatsHTML}
            <br><br>
            <span class="achievement-badge ${badgeClass}">${grade}</span>
        `;

        document.getElementById('message').innerHTML = messageContent;
        document.getElementById('message').className = 'message final show';
        
        document.getElementById('nextButton').style.display = 'none';
        document.getElementById('hintButton').style.display = 'none';
        document.getElementById('restartButton').style.display = 'inline-block';
    }

    restartQuiz() {
        this.clearTimer();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.answered = false;
        this.currentQuestions = [];
        
        document.getElementById('categoryBadge').textContent = '地理分类';
        document.getElementById('questionText').textContent = '准备开始地理知识问答！选择分类后点击开始按钮。';
        document.getElementById('answersGrid').innerHTML = '';
        document.getElementById('startButton').style.display = 'inline-block';
        document.getElementById('restartButton').style.display = 'none';
        document.getElementById('hintButton').style.display = 'none';
        document.getElementById('nextButton').style.display = 'none';
        document.getElementById('timer').classList.remove('warning');
        
        // 清除地理背景
        const contextElement = document.getElementById('geographicContext');
        contextElement.classList.remove('show');
        
        this.hideMessage();
        this.updateUI();
        this.updateProgress();
    }

    updateProgress() {
        const progress = (this.currentQuestionIndex / this.totalQuestions) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
    }

    updateUI() {
        const scoreElement = document.getElementById('score');
        const oldScore = parseInt(scoreElement.textContent) || 0;
        
        // 如果分数增加了，添加动画效果
        if (this.score > oldScore) {
            scoreElement.classList.add('score-animation');
            // 如果得分增加较多，添加高分奖励效果
            if (this.score - oldScore > 20) {
                scoreElement.classList.add('high-score-glow');
            }
            setTimeout(() => {
                scoreElement.classList.remove('score-animation');
                scoreElement.classList.remove('high-score-glow');
            }, 1000);
        }
        
        scoreElement.textContent = this.score;
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        document.getElementById('streak').textContent = this.streak;
        
        if (this.currentQuestionIndex > 0) {
            const accuracy = Math.round((this.correctAnswers / this.currentQuestionIndex) * 100);
            document.getElementById('accuracy').textContent = accuracy + '%';
        } else {
            document.getElementById('accuracy').textContent = '0%';
        }
    }

    showMessage(text, type) {
        const message = document.getElementById('message');
        message.innerHTML = text;
        message.className = `message ${type} show`;
    }

    hideMessage() {
        const message = document.getElementById('message');
        message.classList.remove('show');
    }
    
    showSpecialEffect(text) {
        // 创建特殊效果元素
        const effectElement = document.createElement('div');
        effectElement.className = 'special-effect';
        effectElement.textContent = text;
        effectElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #f39c12, #f1c40f);
            color: white;
            padding: 20px 40px;
            border-radius: 30px;
            font-size: 2em;
            font-weight: bold;
            z-index: 1000;
            box-shadow: 0 0 30px rgba(243, 156, 18, 0.8);
            animation: specialEffect 1.5s ease-out forwards;
        `;
        
        document.body.appendChild(effectElement);
        
        // 3秒后移除元素
        setTimeout(() => {
            effectElement.remove();
        }, 1500);
    }
}

// 启动游戏
window.addEventListener('load', () => {
    new GeographyQuizEnhanced();
});