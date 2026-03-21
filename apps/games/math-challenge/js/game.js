class MathChallenge {
            constructor() {
                this.difficulty = 'easy';
                this.score = 0;
                this.streak = 0;
                this.maxStreak = 0;
                this.level = 1;
                this.timeLeft = 60;
                this.gameActive = false;
                this.currentQuestion = null;
                this.correctAnswers = 0;
                this.totalQuestions = 0;
                this.timer = null;
                
                this.operations = {
                    easy: ['+', '-'],
                    medium: ['+', '-', '×'],
                    hard: ['+', '-', '×', '÷']
                };
                
                this.ranges = {
                    easy: [1, 20],
                    medium: [1, 50],
                    hard: [1, 100]
                };
            }
            
            setDifficulty(difficulty) {
                this.difficulty = difficulty;
                document.querySelectorAll('.difficulty-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                event.target.classList.add('active');
            }
            
            startGame() {
                this.score = 0;
                this.streak = 0;
                this.level = 1;
                this.timeLeft = 60;
                this.gameActive = true;
                this.correctAnswers = 0;
                this.totalQuestions = 0;
                
                document.getElementById('startBtn').style.display = 'none';
                document.getElementById('pauseBtn').style.display = 'inline-block';
                document.getElementById('answerButtons').style.display = 'grid';
                
                this.updateDisplay();
                this.generateQuestion();
                this.startTimer();
            }
            
            startTimer() {
                this.timer = setInterval(() => {
                    this.timeLeft--;
                    this.updateDisplay();
                    
                    if (this.timeLeft <= 0) {
                        this.endGame();
                    }
                }, 1000);
            }
            
            generateQuestion() {
                if (!this.gameActive) return;
                
                const operations = this.operations[this.difficulty];
                const operation = operations[Math.floor(Math.random() * operations.length)];
                const [min, max] = this.ranges[this.difficulty];
                
                let a, b, answer;
                
                switch (operation) {
                    case '+':
                        a = Math.floor(Math.random() * max) + min;
                        b = Math.floor(Math.random() * max) + min;
                        answer = a + b;
                        break;
                    case '-':
                        a = Math.floor(Math.random() * max) + min;
                        b = Math.floor(Math.random() * a) + 1;
                        answer = a - b;
                        break;
                    case '×':
                        a = Math.floor(Math.random() * 12) + 2;
                        b = Math.floor(Math.random() * 12) + 2;
                        answer = a * b;
                        break;
                    case '÷':
                        answer = Math.floor(Math.random() * 12) + 2;
                        b = Math.floor(Math.random() * 12) + 2;
                        a = answer * b;
                        break;
                }
                
                this.currentQuestion = {
                    text: `${a} ${operation} ${b}`,
                    answer: answer
                };
                
                document.getElementById('questionText').textContent = this.currentQuestion.text;
                this.generateOptions();
            }
            
            generateOptions() {
                const correct = this.currentQuestion.answer;
                const options = [correct];
                
                // 生成错误选项
                while (options.length < 4) {
                    let wrong;
                    const variation = Math.floor(Math.random() * 10) + 1;
                    
                    if (Math.random() < 0.5) {
                        wrong = correct + variation;
                    } else {
                        wrong = Math.max(1, correct - variation);
                    }
                    
                    if (!options.includes(wrong)) {
                        options.push(wrong);
                    }
                }
                
                // 打乱选项
                for (let i = options.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [options[i], options[j]] = [options[j], options[i]];
                }
                
                const container = document.getElementById('answerButtons');
                container.innerHTML = '';
                
                options.forEach(option => {
                    const btn = document.createElement('button');
                    btn.className = 'option-btn';
                    btn.textContent = option;
                    btn.onclick = () => this.checkAnswer(option);
                    container.appendChild(btn);
                });
            }
            
            checkAnswer(selected) {
                if (!this.gameActive) return;
                
                this.totalQuestions++;
                const correct = selected === this.currentQuestion.answer;
                
                // 标记按钮
                document.querySelectorAll('.option-btn').forEach(btn => {
                    btn.onclick = null;
                    if (parseInt(btn.textContent) === this.currentQuestion.answer) {
                        btn.classList.add('correct');
                    } else if (parseInt(btn.textContent) === selected && !correct) {
                        btn.classList.add('incorrect');
                    }
                });
                
                if (correct) {
                    this.correctAnswers++;
                    this.streak++;
                    this.maxStreak = Math.max(this.maxStreak, this.streak);
                    
                    const baseScore = 10 * this.level;
                    const streakBonus = Math.floor(this.streak / 5) * 5;
                    this.score += baseScore + streakBonus;
                    
                    // 升级检查
                    if (this.correctAnswers % 10 === 0) {
                        this.level++;
                    }
                } else {
                    this.streak = 0;
                }
                
                this.updateDisplay();
                
                setTimeout(() => {
                    this.generateQuestion();
                }, 1000);
            }
            
            pauseGame() {
                if (this.gameActive) {
                    this.gameActive = false;
                    clearInterval(this.timer);
                    document.getElementById('pauseBtn').textContent = '▶️ 继续';
                    document.getElementById('pauseBtn').onclick = () => this.resumeGame();
                } else {
                    this.resumeGame();
                }
            }
            
            resumeGame() {
                this.gameActive = true;
                this.startTimer();
                document.getElementById('pauseBtn').textContent = '⏸️ 暂停';
                document.getElementById('pauseBtn').onclick = () => this.pauseGame();
            }
            
            endGame() {
                this.gameActive = false;
                clearInterval(this.timer);
                
                document.getElementById('startBtn').style.display = 'inline-block';
                document.getElementById('pauseBtn').style.display = 'none';
                document.getElementById('answerButtons').style.display = 'none';
                document.getElementById('questionText').textContent = '游戏结束';
                
                this.showGameOver();
            }
            
            showGameOver() {
                const accuracy = this.totalQuestions > 0 ? 
                    Math.round((this.correctAnswers / this.totalQuestions) * 100) : 0;
                
                document.getElementById('finalScore').textContent = this.score;
                document.getElementById('accuracy').textContent = accuracy + '%';
                document.getElementById('maxStreak').textContent = this.maxStreak;
                document.getElementById('maxLevel').textContent = this.level;
                
                document.getElementById('gameOverPopup').classList.add('show');
            }
            
            closeGameOver() {
                document.getElementById('gameOverPopup').classList.remove('show');
            }
            
            updateDisplay() {
                document.getElementById('score').textContent = this.score;
                document.getElementById('streak').textContent = this.streak;
                document.getElementById('timeLeft').textContent = this.timeLeft;
                document.getElementById('level').textContent = this.level;
                
                const timeProgress = (this.timeLeft / 60) * 100;
                document.getElementById('timeProgress').style.width = timeProgress + '%';
            }
            
            showHelp() {
                alert('数学挑战游戏说明：\n\n1. 选择合适的难度等级\n2. 快速计算数学题并选择正确答案\n3. 连续答对可获得连击奖励\n4. 在60秒内获得尽可能高的分数\n\n难度说明：\n- 简单：加减法(1-20)\n- 中等：加减乘法(1-50)\n- 困难：四则运算(1-100)');
            }
        }

        // 全局变量
        let mathChallenge;

        // 页面加载完成后初始化
        document.addEventListener('DOMContentLoaded', () => {
            mathChallenge = new MathChallenge();
        });