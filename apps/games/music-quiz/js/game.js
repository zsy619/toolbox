class MusicQuizGame {
    constructor() {
        this.questions = this.generateQuestions();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.selectedCategory = 'all';
        this.startTime = null;
        this.gameActive = false;
        
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.startBtn = document.getElementById('startBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.questionContainer = document.getElementById('questionContainer');
        this.questionNumber = document.getElementById('questionNumber');
        this.questionText = document.getElementById('questionText');
        this.optionsContainer = document.getElementById('optionsContainer');
        this.currentScore = document.getElementById('currentScore');
        this.questionProgress = document.getElementById('questionProgress');
        this.accuracy = document.getElementById('accuracy');
        this.progressFill = document.getElementById('progressFill');
        this.resultContainer = document.getElementById('resultContainer');
        this.categorySelector = document.getElementById('categorySelector');
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectCategory(e.target.dataset.category, e.target));
        });
    }

    generateQuestions() {
        return [
            // 古典音乐
            {
                category: 'classical',
                question: '《命运交响曲》是哪位作曲家的作品？',
                options: ['贝多芬', '莫扎特', '巴赫', '肖邦'],
                correct: 0
            },
            {
                category: 'classical',
                question: '《蓝色多瑙河》是哪种音乐体裁？',
                options: ['交响曲', '协奏曲', '圆舞曲', '奏鸣曲'],
                correct: 2
            },
            {
                category: 'classical',
                question: '被称为"音乐之父"的作曲家是？',
                options: ['巴赫', '亨德尔', '海顿', '莫扎特'],
                correct: 0
            },
            
            // 流行音乐
            {
                category: 'pop',
                question: '迈克尔·杰克逊被称为什么？',
                options: ['摇滚之王', '流行之王', '爵士之王', '蓝调之王'],
                correct: 1
            },
            {
                category: 'pop',
                question: '《Yesterday》是哪个乐队的经典歌曲？',
                options: ['滚石乐队', '披头士乐队', '皇后乐队', 'Led Zeppelin'],
                correct: 1
            },
            {
                category: 'pop',
                question: '格莱美奖是哪个国家的音乐奖项？',
                options: ['英国', '美国', '法国', '德国'],
                correct: 1
            },
            
            // 摇滚音乐
            {
                category: 'rock',
                question: '《Bohemian Rhapsody》是哪个乐队的代表作？',
                options: ['皇后乐队', '滚石乐队', 'Led Zeppelin', 'Pink Floyd'],
                correct: 0
            },
            {
                category: 'rock',
                question: '电吉他是在哪个年代开始流行的？',
                options: ['1930年代', '1940年代', '1950年代', '1960年代'],
                correct: 2
            },
            
            // 爵士音乐
            {
                category: 'jazz',
                question: '爵士乐起源于哪个国家？',
                options: ['英国', '法国', '美国', '意大利'],
                correct: 2
            },
            {
                category: 'jazz',
                question: '被称为"爵士乐之王"的是？',
                options: ['路易斯·阿姆斯特朗', '迈尔斯·戴维斯', '约翰·柯川', '杜克·艾灵顿'],
                correct: 0
            },
            
            // 中国音乐
            {
                category: 'chinese',
                question: '《高山流水》是哪种乐器的经典曲目？',
                options: ['古筝', '古琴', '琵琶', '二胡'],
                correct: 1
            },
            {
                category: 'chinese',
                question: '《茉莉花》是哪个地区的民歌？',
                options: ['江苏', '浙江', '安徽', '山东'],
                correct: 0
            },
            {
                category: 'chinese',
                question: '二胡有几根弦？',
                options: ['一根', '两根', '三根', '四根'],
                correct: 1
            },
            
            // 综合题目
            {
                category: 'all',
                question: '音乐中的"Do Re Mi"是什么？',
                options: ['音符名称', '唱名', '调式', '节拍'],
                correct: 1
            },
            {
                category: 'all',
                question: '一个八度包含多少个半音？',
                options: ['10个', '11个', '12个', '13个'],
                correct: 2
            },
            {
                category: 'all',
                question: '4/4拍子中，一小节有几拍？',
                options: ['2拍', '3拍', '4拍', '8拍'],
                correct: 2
            }
        ];
    }

    selectCategory(category, button) {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.selectedCategory = category;
    }

    getFilteredQuestions() {
        if (this.selectedCategory === 'all') {
            return this.questions;
        }
        return this.questions.filter(q => q.category === this.selectedCategory || q.category === 'all');
    }

    startGame() {
        this.gameActive = true;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.startTime = Date.now();
        
        this.filteredQuestions = this.getFilteredQuestions();
        if (this.filteredQuestions.length < 10) {
            // 如果题目不够，重复使用
            while (this.filteredQuestions.length < 10) {
                this.filteredQuestions = this.filteredQuestions.concat(this.getFilteredQuestions());
            }
        }
        
        // 随机打乱题目
        this.filteredQuestions = this.shuffleArray(this.filteredQuestions).slice(0, 10);
        
        this.startBtn.style.display = 'none';
        this.categorySelector.style.display = 'none';
        this.questionContainer.style.display = 'block';
        this.resultContainer.style.display = 'none';
        
        this.showQuestion();
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.filteredQuestions.length) {
            this.endGame();
            return;
        }

        const question = this.filteredQuestions[this.currentQuestionIndex];
        
        this.questionNumber.textContent = `第 ${this.currentQuestionIndex + 1} 题`;
        this.questionText.textContent = question.question;
        
        this.optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
            button.addEventListener('click', () => this.selectAnswer(index, button));
            this.optionsContainer.appendChild(button);
        });
        
        this.updateProgress();
        this.nextBtn.style.display = 'none';
    }

    selectAnswer(selectedIndex, button) {
        if (!this.gameActive) return;
        
        const question = this.filteredQuestions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === question.correct;
        
        // 禁用所有选项
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
        });
        
        // 显示正确答案
        document.querySelectorAll('.option-btn').forEach((btn, index) => {
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === selectedIndex && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        if (isCorrect) {
            this.score += 10;
            this.correctAnswers++;
        }
        
        this.updateScore();
        this.nextBtn.style.display = 'inline-block';
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.filteredQuestions.length) {
            this.endGame();
        } else {
            this.showQuestion();
        }
    }

    updateScore() {
        this.currentScore.textContent = this.score;
        this.questionProgress.textContent = `${this.currentQuestionIndex + 1}/10`;
        const accuracy = this.currentQuestionIndex > 0 ? 
            Math.round((this.correctAnswers / (this.currentQuestionIndex + 1)) * 100) : 0;
        this.accuracy.textContent = `${accuracy}%`;
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / 10) * 100;
        this.progressFill.style.width = `${progress}%`;
    }

    endGame() {
        this.gameActive = false;
        const endTime = Date.now();
        const timeSpent = Math.round((endTime - this.startTime) / 1000);
        
        this.questionContainer.style.display = 'none';
        this.optionsContainer.innerHTML = '';
        this.nextBtn.style.display = 'none';
        this.restartBtn.style.display = 'inline-block';
        this.resultContainer.style.display = 'block';
        
        // 更新结果统计
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('correctAnswers').textContent = this.correctAnswers;
        document.getElementById('finalAccuracy').textContent = `${Math.round((this.correctAnswers / 10) * 100)}%`;
        document.getElementById('timeSpent').textContent = `${timeSpent}s`;
    }

    restartGame() {
        this.startBtn.style.display = 'inline-block';
        this.restartBtn.style.display = 'none';
        this.categorySelector.style.display = 'block';
        this.resultContainer.style.display = 'none';
        this.progressFill.style.width = '0%';
        
        // 重置分数显示
        this.currentScore.textContent = '0';
        this.questionProgress.textContent = '0/10';
        this.accuracy.textContent = '0%';
    }
}

// 启动游戏
document.addEventListener('DOMContentLoaded', () => {
    new MusicQuizGame();
});