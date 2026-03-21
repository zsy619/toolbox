class CodingGame {
            constructor() {
                this.currentChallengeIndex = 0;
                this.score = 0;
                this.totalChallenges = 5;
                this.completedChallenges = 0;
                this.selectedLesson = 'variables';
                this.hintUsed = false;
                
                this.lessons = {
                    variables: {
                        name: '变量学习',
                        challenges: [
                            {
                                title: '创建你的第一个变量',
                                description: '变量是存储数据的容器。使用 let 关键字创建一个名为 message 的变量，并赋值为 "Hello World"',
                                example: `// 示例：创建变量
let name = "小明";
console.log(name);`,
                                hint: '使用 let message = "Hello World"; 来创建变量',
                                solution: 'let message = "Hello World";\nconsole.log(message);',
                                expectedOutput: 'Hello World'
                            },
                            {
                                title: '数字变量操作',
                                description: '创建两个数字变量 a = 10 和 b = 5，然后计算它们的和并输出结果',
                                example: `// 示例：数字运算
let x = 3;
let y = 4;
let sum = x + y;
console.log(sum);`,
                                hint: '创建变量 a 和 b，然后用 a + b 计算和',
                                solution: 'let a = 10;\nlet b = 5;\nlet sum = a + b;\nconsole.log(sum);',
                                expectedOutput: '15'
                            },
                            {
                                title: '字符串拼接',
                                description: '创建变量 firstName = "张" 和 lastName = "三"，将它们拼接成完整姓名并输出',
                                example: `// 示例：字符串拼接
let first = "Hello";
let second = "World";
let result = first + " " + second;
console.log(result);`,
                                hint: '使用 + 操作符来拼接字符串',
                                solution: 'let firstName = "张";\nlet lastName = "三";\nlet fullName = firstName + lastName;\nconsole.log(fullName);',
                                expectedOutput: '张三'
                            },
                            {
                                title: '变量类型转换',
                                description: '创建字符串变量 numStr = "42"，将其转换为数字并加上 8，输出结果',
                                example: `// 示例：类型转换
let str = "100";
let num = Number(str);
console.log(num + 50);`,
                                hint: '使用 Number() 函数将字符串转换为数字',
                                solution: 'let numStr = "42";\nlet num = Number(numStr);\nlet result = num + 8;\nconsole.log(result);',
                                expectedOutput: '50'
                            },
                            {
                                title: '变量更新',
                                description: '创建变量 counter = 0，然后将其值增加 3 次（每次加1），输出最终值',
                                example: `// 示例：变量更新
let score = 0;
score = score + 10;
score += 5; // 简写形式
console.log(score);`,
                                hint: '可以使用 counter++ 或 counter += 1 来增加变量值',
                                solution: 'let counter = 0;\ncounter++;\ncounter++;\ncounter++;\nconsole.log(counter);',
                                expectedOutput: '3'
                            }
                        ]
                    },
                    functions: {
                        name: '函数学习',
                        challenges: [
                            {
                                title: '创建简单函数',
                                description: '创建一个名为 sayHello 的函数，当调用时输出 "Hello!"',
                                example: `// 示例：函数定义
function greet() {
    console.log("欢迎!");
}
greet(); // 调用函数`,
                                hint: '使用 function 关键字定义函数，别忘了调用它',
                                solution: 'function sayHello() {\n    console.log("Hello!");\n}\nsayHello();',
                                expectedOutput: 'Hello!'
                            },
                            {
                                title: '带参数的函数',
                                description: '创建函数 greetUser(name)，接受一个名字参数并输出 "你好，[name]!"',
                                example: `// 示例：带参数的函数
function welcome(userName) {
    console.log("欢迎，" + userName + "!");
}
welcome("小红");`,
                                hint: '在函数括号内添加参数，然后在函数体内使用它',
                                solution: 'function greetUser(name) {\n    console.log("你好，" + name + "!");\n}\ngreetUser("小明");',
                                expectedOutput: '你好，小明!'
                            },
                            {
                                title: '返回值函数',
                                description: '创建函数 add(a, b) 返回两个数的和，然后调用它计算 5 + 3',
                                example: `// 示例：返回值函数
function multiply(x, y) {
    return x * y;
}
let result = multiply(4, 5);
console.log(result);`,
                                hint: '使用 return 关键字返回计算结果',
                                solution: 'function add(a, b) {\n    return a + b;\n}\nlet result = add(5, 3);\nconsole.log(result);',
                                expectedOutput: '8'
                            },
                            {
                                title: '数学函数',
                                description: '创建函数 square(num) 计算数字的平方，调用它计算 7 的平方',
                                example: `// 示例：数学运算函数
function double(number) {
    return number * 2;
}
console.log(double(6));`,
                                hint: '平方就是数字乘以自己',
                                solution: 'function square(num) {\n    return num * num;\n}\nlet result = square(7);\nconsole.log(result);',
                                expectedOutput: '49'
                            },
                            {
                                title: '字符串处理函数',
                                description: '创建函数 makeUpperCase(text) 将文本转换为大写，处理 "hello world"',
                                example: `// 示例：字符串处理
function makeLowerCase(str) {
    return str.toLowerCase();
}
console.log(makeLowerCase("HELLO"));`,
                                hint: '使用 .toUpperCase() 方法将字符串转换为大写',
                                solution: 'function makeUpperCase(text) {\n    return text.toUpperCase();\n}\nlet result = makeUpperCase("hello world");\nconsole.log(result);',
                                expectedOutput: 'HELLO WORLD'
                            }
                        ]
                    },
                    loops: {
                        name: '循环学习',
                        challenges: [
                            {
                                title: '基础 for 循环',
                                description: '使用 for 循环输出数字 1 到 5',
                                example: `// 示例：for 循环
for (let i = 1; i <= 3; i++) {
    console.log("第" + i + "次");
}`,
                                hint: '使用 for (let i = 1; i <= 5; i++) 来创建循环',
                                solution: 'for (let i = 1; i <= 5; i++) {\n    console.log(i);\n}',
                                expectedOutput: '1\n2\n3\n4\n5'
                            },
                            {
                                title: '数组遍历',
                                description: '创建数组 [10, 20, 30, 40]，使用 for 循环输出每个元素',
                                example: `// 示例：数组遍历
let colors = ["红", "绿", "蓝"];
for (let i = 0; i < colors.length; i++) {
    console.log(colors[i]);
}`,
                                hint: '使用 array.length 获取数组长度',
                                solution: 'let numbers = [10, 20, 30, 40];\nfor (let i = 0; i < numbers.length; i++) {\n    console.log(numbers[i]);\n}',
                                expectedOutput: '10\n20\n30\n40'
                            },
                            {
                                title: '计算总和',
                                description: '使用 for 循环计算数组 [2, 4, 6, 8] 的总和',
                                example: `// 示例：累加计算
let scores = [85, 90, 78];
let total = 0;
for (let i = 0; i < scores.length; i++) {
    total += scores[i];
}
console.log(total);`,
                                hint: '创建变量 sum = 0，在循环中累加每个元素',
                                solution: 'let numbers = [2, 4, 6, 8];\nlet sum = 0;\nfor (let i = 0; i < numbers.length; i++) {\n    sum += numbers[i];\n}\nconsole.log(sum);',
                                expectedOutput: '20'
                            },
                            {
                                title: 'while 循环',
                                description: '使用 while 循环从 10 倒数到 1',
                                example: `// 示例：while 循环
let count = 3;
while (count > 0) {
    console.log(count);
    count--;
}`,
                                hint: '从 10 开始，每次减1，直到大于 0',
                                solution: 'let num = 10;\nwhile (num > 0) {\n    console.log(num);\n    num--;\n}',
                                expectedOutput: '10\n9\n8\n7\n6\n5\n4\n3\n2\n1'
                            },
                            {
                                title: '查找最大值',
                                description: '使用循环在数组 [15, 8, 23, 4, 16] 中找到最大值',
                                example: `// 示例：查找最小值
let values = [12, 5, 8, 3];
let min = values[0];
for (let i = 1; i < values.length; i++) {
    if (values[i] < min) {
        min = values[i];
    }
}
console.log(min);`,
                                hint: '设置第一个元素为最大值，然后比较每个元素',
                                solution: 'let numbers = [15, 8, 23, 4, 16];\nlet max = numbers[0];\nfor (let i = 1; i < numbers.length; i++) {\n    if (numbers[i] > max) {\n        max = numbers[i];\n    }\n}\nconsole.log(max);',
                                expectedOutput: '23'
                            }
                        ]
                    },
                    conditions: {
                        name: '条件判断',
                        challenges: [
                            {
                                title: '基础 if 语句',
                                description: '创建变量 age = 18，如果年龄大于等于18，输出 "成年人"，否则输出 "未成年"',
                                example: `// 示例：if-else 语句
let score = 85;
if (score >= 90) {
    console.log("优秀");
} else {
    console.log("良好");
}`,
                                hint: '使用 if (age >= 18) 来判断条件',
                                solution: 'let age = 18;\nif (age >= 18) {\n    console.log("成年人");\n} else {\n    console.log("未成年");\n}',
                                expectedOutput: '成年人'
                            },
                            {
                                title: '多重条件判断',
                                description: '创建变量 score = 85，根据分数输出等级：90-100优秀，80-89良好，60-79及格，其他不及格',
                                example: `// 示例：多重 if-else
let temperature = 25;
if (temperature > 30) {
    console.log("炎热");
} else if (temperature > 20) {
    console.log("温暖");
} else {
    console.log("寒冷");
}`,
                                hint: '使用 if, else if, else 来处理多个条件',
                                solution: 'let score = 85;\nif (score >= 90) {\n    console.log("优秀");\n} else if (score >= 80) {\n    console.log("良好");\n} else if (score >= 60) {\n    console.log("及格");\n} else {\n    console.log("不及格");\n}',
                                expectedOutput: '良好'
                            },
                            {
                                title: '逻辑运算符',
                                description: '检查数字 15 是否在 10-20 范围内（包含10和20），如果是输出 "在范围内"',
                                example: `// 示例：逻辑与运算符
let hour = 14;
if (hour >= 9 && hour <= 17) {
    console.log("工作时间");
} else {
    console.log("休息时间");
}`,
                                hint: '使用 && （逻辑与）运算符连接两个条件',
                                solution: 'let number = 15;\nif (number >= 10 && number <= 20) {\n    console.log("在范围内");\n} else {\n    console.log("不在范围内");\n}',
                                expectedOutput: '在范围内'
                            },
                            {
                                title: '字符串比较',
                                description: '创建变量 password = "123456"，检查密码是否正确，正确输出 "登录成功"，错误输出 "密码错误"',
                                example: `// 示例：字符串比较
let userInput = "admin";
if (userInput === "admin") {
    console.log("管理员");
} else {
    console.log("普通用户");
}`,
                                hint: '使用 === 来比较字符串是否相等',
                                solution: 'let password = "123456";\nif (password === "123456") {\n    console.log("登录成功");\n} else {\n    console.log("密码错误");\n}',
                                expectedOutput: '登录成功'
                            },
                            {
                                title: '复杂条件判断',
                                description: '创建变量 day = "Saturday"，如果是周末（Saturday 或 Sunday）输出 "休息日"，否则输出 "工作日"',
                                example: `// 示例：逻辑或运算符
let weather = "雨天";
if (weather === "晴天" || weather === "多云") {
    console.log("适合出门");
} else {
    console.log("待在家里");
}`,
                                hint: '使用 || （逻辑或）运算符连接两个条件',
                                solution: 'let day = "Saturday";\nif (day === "Saturday" || day === "Sunday") {\n    console.log("休息日");\n} else {\n    console.log("工作日");\n}',
                                expectedOutput: '休息日'
                            }
                        ]
                    },
                    objects: {
                        name: '对象学习',
                        challenges: [
                            {
                                title: '创建对象',
                                description: '创建一个 person 对象，包含属性 name: "小红" 和 age: 25，然后输出姓名',
                                example: `// 示例：创建对象
let car = {
    brand: "丰田",
    color: "红色"
};
console.log(car.brand);`,
                                hint: '使用花括号 {} 创建对象，用 . 访问属性',
                                solution: 'let person = {\n    name: "小红",\n    age: 25\n};\nconsole.log(person.name);',
                                expectedOutput: '小红'
                            },
                            {
                                title: '对象方法',
                                description: '创建对象 calculator，包含方法 add(a, b) 返回两数之和，调用计算 3 + 7',
                                example: `// 示例：对象方法
let student = {
    name: "小明",
    sayHello: function() {
        return "你好，我是" + this.name;
    }
};
console.log(student.sayHello());`,
                                hint: '在对象中定义函数作为方法',
                                solution: 'let calculator = {\n    add: function(a, b) {\n        return a + b;\n    }\n};\nlet result = calculator.add(3, 7);\nconsole.log(result);',
                                expectedOutput: '10'
                            },
                            {
                                title: '修改对象属性',
                                description: '创建对象 book = {title: "JavaScript指南", pages: 200}，将页数修改为 250 并输出',
                                example: `// 示例：修改属性
let phone = {
    brand: "苹果",
    price: 5000
};
phone.price = 4500; // 修改价格
console.log(phone.price);`,
                                hint: '使用 object.property = newValue 来修改属性',
                                solution: 'let book = {\n    title: "JavaScript指南",\n    pages: 200\n};\nbook.pages = 250;\nconsole.log(book.pages);',
                                expectedOutput: '250'
                            },
                            {
                                title: '对象数组',
                                description: '创建包含两个学生对象的数组，每个学生有name和score属性，输出第一个学生的姓名',
                                example: `// 示例：对象数组
let fruits = [
    {name: "苹果", color: "红色"},
    {name: "香蕉", color: "黄色"}
];
console.log(fruits[0].name);`,
                                hint: '创建数组，每个元素都是对象',
                                solution: 'let students = [\n    {name: "张三", score: 85},\n    {name: "李四", score: 92}\n];\nconsole.log(students[0].name);',
                                expectedOutput: '张三'
                            },
                            {
                                title: '对象遍历',
                                description: '创建对象 grades = {math: 90, english: 85, chinese: 88}，使用 for...in 循环输出所有科目和成绩',
                                example: `// 示例：遍历对象
let colors = {
    sky: "蓝色",
    grass: "绿色",
    sun: "黄色"
};
for (let key in colors) {
    console.log(key + ": " + colors[key]);
}`,
                                hint: '使用 for (let key in object) 遍历对象属性',
                                solution: 'let grades = {\n    math: 90,\n    english: 85,\n    chinese: 88\n};\nfor (let subject in grades) {\n    console.log(subject + ": " + grades[subject]);\n}',
                                expectedOutput: 'math: 90\nenglish: 85\nchinese: 88'
                            }
                        ]
                    }
                };
                
                this.bindEvents();
                this.updateUI();
            }

            bindEvents() {
                document.getElementById('startButton').addEventListener('click', () => {
                    this.startLesson();
                });

                document.getElementById('runButton').addEventListener('click', () => {
                    this.runCode();
                });

                document.getElementById('nextButton').addEventListener('click', () => {
                    this.nextChallenge();
                });

                document.getElementById('restartButton').addEventListener('click', () => {
                    this.restartGame();
                });

                document.getElementById('hintButton').addEventListener('click', () => {
                    this.showHint();
                });

                document.querySelectorAll('.lesson-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        this.selectLesson(e.target.dataset.lesson);
                    });
                });
            }

            selectLesson(lesson) {
                this.selectedLesson = lesson;
                document.querySelectorAll('.lesson-button').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector(`[data-lesson="${lesson}"]`).classList.add('active');
                
                // 重置游戏状态
                this.currentChallengeIndex = 0;
                this.score = 0;
                this.completedChallenges = 0;
                this.updateUI();
            }

            startLesson() {
                this.currentChallengeIndex = 0;
                this.score = 0;
                this.completedChallenges = 0;
                this.showChallenge();
                
                document.getElementById('startButton').style.display = 'none';
                document.getElementById('runButton').style.display = 'inline-block';
                document.getElementById('hintButton').style.display = 'inline-block';
                document.getElementById('codeEditor').style.display = 'block';
                document.getElementById('codeOutput').style.display = 'block';
                
                this.updateUI();
            }

            showChallenge() {
                if (this.currentChallengeIndex >= this.totalChallenges) {
                    this.endLesson();
                    return;
                }

                const lesson = this.lessons[this.selectedLesson];
                const challenge = lesson.challenges[this.currentChallengeIndex];
                
                document.getElementById('challengeTitle').textContent = challenge.title;
                document.getElementById('challengeDescription').textContent = challenge.description;
                
                const exampleElement = document.getElementById('codeExample');
                exampleElement.style.display = 'block';
                exampleElement.textContent = challenge.example;
                
                document.getElementById('codeInput').value = '';
                document.getElementById('outputText').textContent = '';
                document.getElementById('hintBox').classList.remove('show');
                document.getElementById('nextButton').style.display = 'none';
                
                this.hintUsed = false;
                this.updateProgress();
                this.updateUI();
            }

            runCode() {
                const code = document.getElementById('codeInput').value.trim();
                if (!code) {
                    this.showMessage('请输入代码！', 'error');
                    return;
                }

                try {
                    // 简单的代码执行模拟
                    const output = this.executeCode(code);
                    document.getElementById('outputText').textContent = output;
                    
                    // 检查答案
                    this.checkAnswer(code, output);
                } catch (error) {
                    document.getElementById('outputText').textContent = '代码执行错误：' + error.message;
                    this.showMessage('代码有错误，请检查语法！', 'error');
                }
            }

            executeCode(code) {
                const lesson = this.lessons[this.selectedLesson];
                const challenge = lesson.challenges[this.currentChallengeIndex];
                
                // 简化的代码执行器
                let output = '';
                const originalLog = console.log;
                const logs = [];
                
                // 重写 console.log 来捕获输出
                console.log = function(...args) {
                    logs.push(args.join(' '));
                };
                
                try {
                    // 使用 eval 执行代码（在实际应用中不推荐）
                    eval(code);
                    output = logs.join('\n');
                } finally {
                    console.log = originalLog;
                }
                
                return output;
            }

            checkAnswer(code, output) {
                const lesson = this.lessons[this.selectedLesson];
                const challenge = lesson.challenges[this.currentChallengeIndex];
                
                // 简单的答案检查
                if (output.trim() === challenge.expectedOutput.trim()) {
                    this.completedChallenges++;
                    const points = this.hintUsed ? 15 : 20;
                    this.score += points;
                    this.showMessage(`🎉 正确！+${points}分`, 'success');
                    
                    setTimeout(() => {
                        document.getElementById('nextButton').style.display = 'inline-block';
                        document.getElementById('runButton').style.display = 'none';
                        document.getElementById('hintButton').style.display = 'none';
                    }, 1500);
                } else {
                    this.showMessage('输出不正确，请检查代码！期待输出：' + challenge.expectedOutput, 'error');
                }
                
                this.updateUI();
            }

            showHint() {
                if (this.hintUsed) return;
                
                this.hintUsed = true;
                const lesson = this.lessons[this.selectedLesson];
                const challenge = lesson.challenges[this.currentChallengeIndex];
                
                document.getElementById('hintText').textContent = challenge.hint;
                document.getElementById('hintBox').classList.add('show');
                document.getElementById('hintButton').style.display = 'none';
            }

            nextChallenge() {
                this.currentChallengeIndex++;
                this.hideMessage();
                
                document.getElementById('runButton').style.display = 'inline-block';
                document.getElementById('hintButton').style.display = 'inline-block';
                
                this.showChallenge();
            }

            endLesson() {
                const lesson = this.lessons[this.selectedLesson];
                const accuracy = Math.round((this.completedChallenges / this.totalChallenges) * 100);
                let grade = '';
                
                if (accuracy >= 90) grade = '🏆 编程大师！你已经掌握了' + lesson.name + '！';
                else if (accuracy >= 70) grade = '👨‍💻 编程能手！继续加油！';
                else if (accuracy >= 50) grade = '📚 编程学徒！多练习提高技能！';
                else grade = '💪 编程新手！重新挑战来提升技能！';

                this.showMessage(`🎊 课程完成！\n得分：${this.score}分\n完成率：${accuracy}%\n${grade}`, 'final');
                
                document.getElementById('runButton').style.display = 'none';
                document.getElementById('nextButton').style.display = 'none';
                document.getElementById('hintButton').style.display = 'none';
                document.getElementById('restartButton').style.display = 'inline-block';
            }

            restartGame() {
                this.currentChallengeIndex = 0;
                this.score = 0;
                this.completedChallenges = 0;
                
                document.getElementById('challengeTitle').textContent = '准备开始编程学习！';
                document.getElementById('challengeDescription').textContent = '选择一个课程开始学习编程基础知识。每个课程包含5个编程挑战，完成挑战来提升你的编程技能！';
                document.getElementById('codeExample').style.display = 'none';
                document.getElementById('codeEditor').style.display = 'none';
                document.getElementById('codeOutput').style.display = 'none';
                
                document.getElementById('startButton').style.display = 'inline-block';
                document.getElementById('restartButton').style.display = 'none';
                document.getElementById('runButton').style.display = 'none';
                document.getElementById('hintButton').style.display = 'none';
                document.getElementById('nextButton').style.display = 'none';
                
                this.hideMessage();
                this.updateUI();
                this.updateProgress();
            }

            updateProgress() {
                const progress = (this.currentChallengeIndex / this.totalChallenges) * 100;
                document.getElementById('progressFill').style.width = progress + '%';
            }

            updateUI() {
                document.getElementById('score').textContent = this.score;
                document.getElementById('currentChallenge').textContent = this.currentChallengeIndex + 1;
                
                if (this.totalChallenges > 0) {
                    const accuracy = Math.round((this.completedChallenges / Math.max(1, this.currentChallengeIndex)) * 100);
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
            new CodingGame();
        });